import React from 'react';
import { Glow } from './fx-glow';
import { deg, easeInOut, flicker, hash, lerp, Pt, polar, prog } from './fx-math';

// Night-sky effects over the map (screen px, t in frames):
//   <AaGun x y aim? s? />                      small anti-aircraft gun icon (barrel points at `aim` degrees)
//   <AaTracers id t x y aim reach? rate? cyc? seed? />   dashed glowing tracer rounds streaming from a gun, in bursts, varying
//   <Flare t t0 x y r? life? />                parachute flare: swaying, falling, flickering, lighting the ground below
//   <Searchlights t sources length? spread? lock? />     sweeping beams (a `lock` point makes them converge on a target)

const INK = '#151515';

export const AaGun: React.FC<{ x: number; y: number; aim?: number; s?: number }> = ({ x, y, aim = -90, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={16} fill="#4A5236" stroke={INK} strokeWidth={4} />
    <g transform={`rotate(${aim})`}>
      <rect x={2} y={-4} width={32} height={8} fill="#6A6F73" stroke={INK} strokeWidth={3} />
      <rect x={2} y={-9} width={6} height={18} fill="#53585C" stroke={INK} strokeWidth={3} />
    </g>
    <circle r={6} fill="#2E3320" stroke={INK} strokeWidth={2} />
  </g>
);

/** Tracer rounds leave the gun at (x, y) towards angle `aim` (deg, -90 = up the screen), travel `reach` px in 14 frames.
 *  They come in bursts (`cyc` frames period, ~60% firing) with seeded jitter, so each gun looks different. */
export const AaTracers: React.FC<{ id: string; t: number; x: number; y: number; aim: number; reach?: number; rate?: number; cyc?: number; seed?: number; spread?: number; color?: string }> = ({
  t, x, y, aim, reach = 420, rate = 1, cyc = 34, seed = 1, spread = 7, color = '#FF5A2B',
}) => {
  const life = 14, out: React.ReactNode[] = [], phase = hash(seed, 9) * cyc;
  for (let i = Math.floor((t - life) / rate); i <= Math.floor(t / rate); i++) {
    const t0 = i * rate;
    if (((t0 + phase) % cyc) / cyc > 0.6) continue; // pause between bursts
    const age = t - t0;
    if (age < 0 || age > life) continue;
    const ang = aim + (hash(i, seed) - 0.5) * spread * 2, d = reach * (age / life) * (0.8 + 0.3 * hash(i, seed + 5)), len = 46 + 40 * hash(i, seed + 2);
    const a = polar(x, y, ang, d), b = polar(x, y, ang, Math.max(0, d - len));
    out.push(
      <g key={i} opacity={Math.min(1, (life - age) / 5)}>
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={11} strokeLinecap="round" opacity={0.28} />
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={i % 3 ? '#FFB347' : color} strokeWidth={6} strokeLinecap="round" strokeDasharray="16 7" />
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#FFF4D0" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="16 7" />
      </g>,
    );
  }
  const firing = ((t + phase) % cyc) / cyc < 0.6;
  return <g>{out}{firing && <Glow x={x} y={y} r={26 + 8 * hash(Math.floor(t), seed)} color="#FFB347" o={0.7} />}</g>;
};

/** Parachute flare lit at t0: swings gently as it sinks (0.7 px/frame), flickers, and washes the ground in warm light. */
export const Flare: React.FC<{ t: number; t0: number; x: number; y: number; r?: number; life?: number }> = ({ t, t0, x, y, r = 120, life = 180 }) => {
  const a = t - t0;
  if (a < 0 || a > life) return null;
  const fade = Math.min(1, a / 8) * (1 - prog(a, life - 40, life)), fx = x + Math.sin(a * 0.05) * 14, fy = y + a * 0.7, f = flicker(t, 2);
  return (
    <g opacity={fade}>
      <Glow x={fx} y={fy + 90} r={r * 3.2 * (0.9 + 0.1 * f)} color="#FFD98A" o={0.22} />
      <Glow x={fx} y={fy} r={r * 0.9 * f} color="#FFF0B8" o={0.75} />
      <path d={`M${fx - 22},${fy - 34} Q${fx},${fy - 58} ${fx + 22},${fy - 34} Z`} fill="#EDEDED" stroke={INK} strokeWidth={2.5} opacity={0.95} />
      <path d={`M${fx - 22},${fy - 34} L${fx},${fy - 6} M${fx + 22},${fy - 34} L${fx},${fy - 6}`} stroke="#CFCFCF" strokeWidth={1.5} />
      <circle cx={fx} cy={fy} r={7} fill="#FFFFFF" />
      {[0, 60, 120].map((rot) => <line key={rot} x1={fx - 26 * f} y1={fy} x2={fx + 26 * f} y2={fy} stroke="#FFF8DC" strokeWidth={2} opacity={0.8} transform={`rotate(${rot + a * 2} ${fx} ${fy})`} />)}
    </g>
  );
};

export type SearchSource = { x: number; y: number; base: number; swing?: number; period?: number; phase?: number };

/** Searchlight beams from ground sources: angle = base + swing * sin(...). With `lock` ({x, y} + frame `from`) every
 *  beam eases over to point at the target and holds, as in a real cone-up on a bomber. Screen blend over a dark map. */
export const Searchlights: React.FC<{ t: number; sources: SearchSource[]; length?: number; spread?: number; lock?: { at: Pt; from: number; dur?: number }; color?: string }> = ({
  t, sources, length = 900, spread = 3.2, lock, color = '#DFF3FF',
}) => (
  <g style={{ mixBlendMode: 'screen' }}>
    {sources.map((s, i) => {
      const sweepA = s.base + (s.swing ?? 25) * Math.sin(((t / (s.period ?? 140)) + (s.phase ?? i * 0.3)) * Math.PI * 2);
      const lockA = lock ? deg(Math.atan2(lock.at[1] - s.y, lock.at[0] - s.x)) : sweepA;
      const ang = lock ? lerp(sweepA, lockA, easeInOut(prog(t, lock.from, lock.from + (lock.dur ?? 20)))) : sweepA;
      const len = lock && prog(t, lock.from, lock.from + 20) >= 1 ? Math.hypot(lock.at[0] - s.x, lock.at[1] - s.y) * 1.25 : length;
      const [l0, r0] = [polar(s.x, s.y, ang - 90, 6), polar(s.x, s.y, ang + 90, 6)];
      const [l1, r1] = [polar(s.x, s.y, ang - spread, len), polar(s.x, s.y, ang + spread, len)];
      const end = polar(s.x, s.y, ang, len);
      return (
        <g key={i}>
          <polygon points={`${l0} ${l1} ${r1} ${r0}`} fill={color} opacity={0.16} />
          <polygon points={`${l0} ${polar(s.x, s.y, ang - spread * 0.4, len)} ${polar(s.x, s.y, ang + spread * 0.4, len)} ${r0}`} fill={color} opacity={0.28} />
          <Glow x={end[0]} y={end[1]} r={30} color={color} o={0.3} />
          <circle cx={s.x} cy={s.y} r={9} fill="#FFFFFF" opacity={0.9} />
        </g>
      );
    })}
  </g>
);
