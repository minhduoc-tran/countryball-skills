import React from 'react';
import { Glow, Puff } from './fx-glow';
import { bez2, clamp, deg, easeOut, hash, Pt, polar, prog } from './fx-math';

// SAM-2 surface-to-air missiles and flak bursts, on the map (screen px; t in frames).
//   <SamSite x y r />                                  site icon: ring of 6 launchers round a radar dish
//   <SamMissile x y heading size flame? />             missile sprite (cruciform fins, so one sprite serves top-down and side view)
//   <SamLaunch id t t0 from to dur? bend? size? />     launch flash, missile curving to `to`, long smoke trail
//   <FlakBurst id t t0 x y r? />                       proximity burst: flash, orange fireball, black smoke, fragments
//   samPos(from, to, u, bend)                          missile position (px) at flight progress u, e.g. to start a burst on arrival

const INK = '#151515';

export const SamSite: React.FC<{ x: number; y: number; r?: number; star?: boolean }> = ({ x, y, r = 40, star: showStar = true }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#3E4A2C" stroke={INK} strokeWidth={r * 0.1} />
    <circle r={r * 0.82} fill="none" stroke="#74804F" strokeWidth={r * 0.06} strokeDasharray={`${r * 0.2} ${r * 0.12}`} />
    {Array.from({ length: 6 }, (_, i) => (
      <g key={i} transform={`rotate(${i * 60 + 30})`}>
        <rect x={r * 0.18} y={-r * 0.07} width={r * 0.58} height={r * 0.14} fill="#C9CDBE" stroke={INK} strokeWidth={r * 0.04} />
        <polygon points={`${r * 0.76},${-r * 0.07} ${r * 0.88},0 ${r * 0.76},${r * 0.07}`} fill="#DA251D" stroke={INK} strokeWidth={r * 0.03} />
      </g>
    ))}
    <circle r={r * 0.22} fill="#6B7358" stroke={INK} strokeWidth={r * 0.06} />
    {showStar && <circle r={r * 0.08} fill="#FFCD00" />}
  </g>
);

export const SamMissile: React.FC<{ x: number; y: number; heading?: number; size?: number; flame?: boolean; t?: number }> = ({ x, y, heading = 0, size = 50, flame = true, t = 0 }) => {
  const k = size / 100, sw = Math.max(1.6, size * 0.04) / k;
  return (
    <g transform={`translate(${x},${y}) rotate(${heading}) scale(${k})`}>
      {flame && <g><path d={`M-50,0 L${-72 - (t % 3) * 6},-4 L${-98 - (t % 2) * 10},0 L${-72 - (t % 3) * 6},4 Z`} fill="#FFB02E" /><path d="M-50,0 L-70,-2 L-80,0 L-70,2 Z" fill="#FFF3B0" /></g>}
      <polygon points="-34,-5 -46,-18 -52,-18 -46,-5" fill="#4A4F55" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <polygon points="-34,5 -46,18 -52,18 -46,5" fill="#4A4F55" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <rect x={-52} y={-6} width={22} height={12} rx={2} fill="#2E3238" stroke={INK} strokeWidth={sw} />
      <polygon points="14,-4 4,-13 -2,-13 -2,-4" fill="#D8DBDD" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <polygon points="14,4 4,13 -2,13 -2,4" fill="#D8DBDD" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M-30,-5.5 L22,-5.5 Q40,-5 52,0 Q40,5 22,5.5 L-30,5.5 Z" fill="#ECEEEF" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <rect x={-12} y={-5.5} width={6} height={11} fill="#DA251D" />
    </g>
  );
};

const ctrlPoint = (a: Pt, b: Pt, bend: number): Pt => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  return [(a[0] + b[0]) / 2 - dy * bend, (a[1] + b[1]) / 2 + dx * bend];
};
const flightU = (k: number) => Math.pow(clamp(k), 1.35); // accelerates away from the rail
export const samPos = (from: Pt, to: Pt, u: number, bend = 0.25): Pt => bez2(from, ctrlPoint(from, to, bend), to, flightU(u));

/** SAM launch at frame t0: flash and ground smoke, then a missile accelerating along a curve to `to` over `dur`
 *  frames, leaving a smoke trail that widens and fades for `life` frames. Missile vanishes on arrival (start a FlakBurst). */
export const SamLaunch: React.FC<{ id: string; t: number; t0: number; from: Pt; to: Pt; dur?: number; bend?: number; size?: number; life?: number }> = ({
  t, t0, from, to, dur = 40, bend = 0.25, size = 84, life = 110,
}) => {
  const a = t - t0;
  if (a < 0) return null;
  const tEnd = Math.min(a, dur), puffs: React.ReactNode[] = [];
  for (let j = 0; j * 0.6 <= tEnd; j++) {
    const tau = j * 0.6, age = a - tau, p = samPos(from, to, tau / dur, bend);
    const o = 0.42 * (1 - prog(age, 0, life)), r = 6 + Math.min(age, 70) * 0.3 + (tau < 8 ? 6 : 0);
    puffs.push(<Puff key={j} x={p[0] + (hash(j, 1) - 0.5) * 4} y={p[1] - age * 0.08} r={r} color={tau < 10 ? '#F2E8D8' : '#E6E6E6'} o={o} seed={j} />);
  }
  const flying = a <= dur, head = samPos(from, to, a / dur, bend), prev = samPos(from, to, Math.max(0, a - 1) / dur, bend);
  const heading = deg(Math.atan2(head[1] - prev[1], head[0] - prev[0] || 1e-6)) || -90;
  return (
    <g>
      {/* launch dust: a ring of puffs blown outward from the rail for ~40 frames */}
      {a < 70 && Array.from({ length: 9 }, (_, i) => {
        const ang = i * 40 + hash(i, 2) * 30, rr = 8 + easeOut(a / 40) * (30 + hash(i, 3) * 26), p = polar(from[0], from[1], ang, rr);
        return <Puff key={i} x={p[0]} y={p[1]} r={10 + a * 0.35} color="#CFC6B4" o={0.65 * (1 - prog(a, 8, 70))} seed={i} />;
      })}
      {puffs}
      <Glow x={from[0]} y={from[1]} r={70 * (1 - prog(a, 0, 14))} color="#FFB347" o={0.9} />
      {flying && <><Glow x={head[0]} y={head[1]} r={size * 0.3} color="#FFA62B" o={0.35} />
        <SamMissile x={head[0]} y={head[1]} heading={heading} size={size} t={Math.floor(t)} /></>}
    </g>
  );
};

/** Proximity-fuse flak burst at (x, y) starting frame t0: white flash (4 f), orange fireball, black smoke puff that
 *  drifts up and lingers ~`life` frames, and 12 hot fragments flying out. `r` = fireball radius in px. */
export const FlakBurst: React.FC<{ id: string; t: number; t0: number; x: number; y: number; r?: number; life?: number }> = ({ t, t0, x, y, r = 60, life = 110 }) => {
  const a = t - t0;
  if (a < 0 || a > life + 10) return null;
  const grow = easeOut(a / 10), fire = 1 - prog(a, 8, 30), smoke = 0.9 * (1 - prog(a, 26, life));
  return (
    <g>
      <Puff x={x + a * 0.15} y={y - a * 0.35} r={r * (0.55 + 0.9 * easeOut(a / 40))} color="#1E1E22" o={smoke * 0.9} seed={3} />
      <Puff x={x - r * 0.35 + a * 0.1} y={y - r * 0.2 - a * 0.25} r={r * 0.55 * easeOut(a / 34)} color="#34343A" o={smoke * 0.8} seed={9} />
      <Glow x={x} y={y} r={r * 2.2 * grow} color="#FF7A1A" o={0.6 * fire} />
      <circle cx={x} cy={y} r={r * grow} fill="#FF8A1E" opacity={0.95 * fire} />
      <circle cx={x} cy={y} r={r * 0.62 * grow} fill="#FFD25A" opacity={fire} />
      <circle cx={x} cy={y} r={r * 0.3 * grow} fill="#FFF8D6" opacity={fire} />
      {a < 5 && <polygon points={Array.from({ length: 16 }, (_, i) => { const p = polar(x, y, i * 22.5, (i % 2 ? 0.7 : 1.35) * r); return p.join(','); }).join(' ')} fill="#FFF1C4" opacity={1 - a / 5} />}
      {Array.from({ length: 12 }, (_, i) => {
        const ang = i * 30 + hash(i, 4) * 25, d0 = r * (0.5 + 1.7 * easeOut(a / 14) * (0.6 + 0.6 * hash(i, 5))), len = 8 + hash(i, 6) * 14;
        const p = polar(x, y, ang, d0), q = polar(x, y, ang, d0 - len);
        return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={i % 3 ? '#FFD34D' : '#FFFFFF'} strokeWidth={3} strokeLinecap="round" opacity={1 - prog(a, 4, 20)} />;
      })}
    </g>
  );
};
