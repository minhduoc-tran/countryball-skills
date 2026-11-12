import React from 'react';
import { Glow, Puff } from './fx-glow';
import { clamp, easeOut, flicker, hash, lerp, Pt, polar, prog } from './fx-math';

// Ground explosions on the map (screen px, t in frames, deterministic):
//   <GroundBlast t t0 x y r? linger? />          one blast: flash, fireball, ring, rising smoke, scorch mark, fire glow that lingers
//   <BombCarpet id t t0 from to dur? n? width? r? linger? />   "rải thảm": n blasts walking along a line, jittered across `width`
//   <Flames t x y s? n? seed? />                 flickering flame tongues (also used by the shot-down B-52 and burning city)

/** Flame tongues: n teardrops flickering on a ~`s` px base at (x, y), pointing up (or along `dir` degrees). */
export const Flames: React.FC<{ t: number; x: number; y: number; s?: number; n?: number; seed?: number; dir?: number }> = ({ t, x, y, s = 30, n = 4, seed = 1, dir = -90 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const f = flicker(t + i * 3, seed + i), sp = (i - (n - 1) / 2) * s * 0.28, len = s * (0.8 + 0.5 * hash(i, seed)) * f, wid = s * 0.22;
      const base = polar(x, y, dir + 90, sp), tip = polar(base[0], base[1], dir + Math.sin(t * 0.4 + i * 2) * 14, len);
      const l = polar(base[0], base[1], dir + 90, wid), r = polar(base[0], base[1], dir - 90, wid);
      return (
        <g key={i}>
          <path d={`M${l} Q${l[0] * 0.5 + tip[0] * 0.5},${l[1] * 0.5 + tip[1] * 0.5 - 0} ${tip} Q${r[0] * 0.5 + tip[0] * 0.5},${r[1] * 0.5 + tip[1] * 0.5} ${r} Z`} fill="#FF7A1A" />
          <path d={`M${polar(base[0], base[1], dir + 90, wid * 0.5)} L${polar(base[0], base[1], dir, len * 0.6)} L${polar(base[0], base[1], dir - 90, wid * 0.5)} Z`} fill="#FFD25A" />
        </g>
      );
    })}
  </g>
);

export const GroundBlast: React.FC<{ t: number; t0: number; x: number; y: number; r?: number; linger?: number }> = ({ t, t0, x, y, r = 40, linger = 220 }) => {
  const a = t - t0;
  if (a < 0) return null;
  const burn = 1 - prog(a, linger * 0.45, linger), fire = 1 - prog(a, 8, 26);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r * 0.95} ry={r * 0.7} fill="#17120F" opacity={0.6 * Math.min(1, a / 4)} />
      {burn > 0 && <Glow x={x} y={y} r={r * 2.1 * (0.9 + 0.1 * flicker(t, x))} color="#FF6A1A" o={0.45 * burn * Math.min(1, a / 6)} />}
      {Array.from({ length: 5 }, (_, i) => {
        const age = a - 6 - i * 3, rr = r * (0.55 + 0.5 * hash(i, y)), k = 1 - prog(age, 20, linger);
        if (age < 0 || k <= 0) return null;
        const p: Pt = [x + (hash(i, 1) - 0.3) * r * 0.9 + age * (0.22 + 0.1 * hash(i, 5)), y - r * 0.2 - age * (0.45 + 0.2 * hash(i, 2))];
        return <Puff key={i} x={p[0]} y={p[1]} r={rr * (0.5 + 0.7 * easeOut(age / 40))} color={i % 2 ? '#2A2A2E' : '#45454B'} o={0.8 * k} seed={i + x} />;
      })}
      {burn > 0.05 && <Flames t={t} x={x} y={y + r * 0.1} s={r * 0.9 * burn} n={3} seed={x + y} />}
      {fire > 0 && <>
        <circle cx={x} cy={y} r={r * easeOut(a / 8)} fill="#FF8A1E" opacity={fire} />
        <circle cx={x} cy={y} r={r * 0.6 * easeOut(a / 8)} fill="#FFD25A" opacity={fire} />
      </>}
      {a < 14 && <circle cx={x} cy={y} r={r * (0.4 + 2.2 * easeOut(a / 14))} fill="none" stroke="#FFE9B0" strokeWidth={4 * (1 - a / 14) + 1} opacity={1 - a / 14} />}
      {a < 4 && <Glow x={x} y={y} r={r * 3} color="#FFFFFF" o={1 - a / 4} />}
    </g>
  );
};

/** "Rải thảm": n blasts walk from `from` to `to` over `dur` frames, each jittered up to ±width/2 across the line. */
export const BombCarpet: React.FC<{ id: string; t: number; t0: number; from: Pt; to: Pt; dur?: number; n?: number; width?: number; r?: number; linger?: number; seed?: number }> = ({
  t, t0, from, to, dur = 60, n = 24, width = 70, r = 30, linger = 220, seed = 1,
}) => {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const u = i / (n - 1), j = (hash(i, seed) - 0.5) * width, ti = t0 + u * dur;
        if (t < ti) return null;
        return <GroundBlast key={i} t={t} t0={ti} x={lerp(from[0], to[0], u) + nx * j} y={lerp(from[1], to[1], u) + ny * j} r={r * (0.75 + 0.5 * hash(i, seed + 3))} linger={linger} />;
      })}
    </g>
  );
};

export const carpetProgress = (t: number, t0: number, dur: number) => clamp((t - t0) / dur);
