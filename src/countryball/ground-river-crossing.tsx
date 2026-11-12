import React from 'react';
import { Flare } from './fx-tracers-and-lights';
import { clamp, deg, hash, lerp, Pt, prog } from './fx-math';
import { WaterRipples, WaterSplash } from './ground-water-splash';

// Night river crossing (the Thạch Hãn, "vượt sông"): small boats and bamboo rafts cross under flares while shells splash
// in the water. Screen px, t in frames. People are only tiny dots (heads) in the boats: no detail, nothing graphic.
//   <Boat x y heading size? t? crew? />       top view wooden boat (sampan), oars dip with t, crew = number of dot heads
//   <Raft x y heading size? t? crew? />       bamboo raft (rows of poles tied together)
//   <FlareGlitter x y t w? h? />              golden glints on the water below a flare at (x, y) (flare height in px = h)
//   <RiverCrossing id t t0 t1 from to n? ... /> boats leave bank `from`, reach bank `to` (both points on the banks, the boats spread
//                                              along the bank) with staggered starts, curving downstream `drift` px; optional
//                                              `flares` [{t0, x, y}] and `splashes` (number of shell splashes along the route).
// Water is drawn by the map; draw this group above it.

const INK = '#151515';

export const Boat: React.FC<{ x: number; y: number; heading?: number; size?: number; t?: number; crew?: number; wake?: boolean; ph?: number }> = ({ x, y, heading = 0, size = 44, t = 0, crew = 3, wake = true, ph = 0 }) => {
  const k = size / 100, row = Math.sin((t + ph) * 0.3) * 14;
  return (
    <g transform={`translate(${x},${y}) rotate(${heading}) scale(${k})`} strokeLinejoin="round" strokeLinecap="round">
      {wake && <g fill="none" stroke="#EAF4FF" strokeWidth={3} opacity={0.6}><path d="M-48,-8 L-120,-30 M-48,8 L-120,30" /><path d="M-60,-6 L-140,-20 M-60,6 L-140,20" opacity={0.5} /></g>}
      <path d="M-50,0 Q-34,-15 18,-15 Q48,-9 58,0 Q48,9 18,15 Q-34,15 -50,0 Z" fill="#6B4A2B" stroke={INK} strokeWidth={3.4} />
      <path d="M-40,0 Q-28,-9 16,-9 Q38,-5 44,0 Q38,5 16,9 Q-28,9 -40,0 Z" fill="#3F2C1A" />
      {[-1, 1].map((s) => <g key={s}><line x1={2} y1={s * 11} x2={-14 - row * s} y2={s * 40} stroke="#C2A36B" strokeWidth={3.4} /><ellipse cx={-14 - row * s} cy={s * 40} rx={6} ry={3} fill="#C2A36B" stroke={INK} strokeWidth={1.6} /></g>)}
      {Array.from({ length: crew }, (_, i) => <g key={i}><circle cx={-24 + (i * 54) / Math.max(1, crew - 1) * 0.9 - (crew === 1 ? -22 : 0)} cy={0} r={6.4} fill="#5C6A3A" stroke={INK} strokeWidth={2.2} /><circle cx={-24 + (i * 54) / Math.max(1, crew - 1) * 0.9 - (crew === 1 ? -22 : 0)} cy={0} r={2.4} fill="#97A55C" /></g>)}
    </g>
  );
};

export const Raft: React.FC<{ x: number; y: number; heading?: number; size?: number; t?: number; crew?: number; ph?: number }> = ({ x, y, heading = 0, size = 52, t = 0, crew = 4, ph = 0 }) => {
  const k = size / 100, bob = Math.sin((t + ph) * 0.12) * 1.2;
  return (
    <g transform={`translate(${x},${y + bob}) rotate(${heading}) scale(${k})`} strokeLinecap="round" strokeLinejoin="round">
      <rect x={-48} y={-30} width={96} height={60} fill="#000" opacity={0.22} transform="translate(5,7)" />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-48} y={-30 + i * 8.6} width={96} height={8.6} rx={4} fill={i % 2 ? '#B89B58' : '#C9AE6E'} stroke={INK} strokeWidth={2.4} />)}
      {[-26, 0, 26].map((rx) => <line key={rx} x1={rx} y1={-30} x2={rx} y2={30} stroke="#6A5530" strokeWidth={3} />)}
      {Array.from({ length: crew }, (_, i) => <circle key={i} cx={-28 + i * 19} cy={i % 2 ? 10 : -10} r={6.2} fill="#5C6A3A" stroke={INK} strokeWidth={2.2} />)}
      <line x1={52} y1={-34} x2={86} y2={-50} stroke="#C2A36B" strokeWidth={3.4} /><line x1={52} y1={34} x2={86} y2={50} stroke="#C2A36B" strokeWidth={3.4} />
    </g>
  );
};

/** Warm glints on the water under a flare (x, y = the flare, h = its height above the water in px): short dashes that shimmer. */
export const FlareGlitter: React.FC<{ x: number; y: number; t: number; w?: number; h?: number; o?: number }> = ({ x, y, t, w = 150, h = 120, o = 0.8 }) => (
  <g style={{ mixBlendMode: 'screen' }} opacity={o}>
    {Array.from({ length: 22 }, (_, i) => {
      const dy = h + i * 7, wd = (10 + hash(i, 1) * 36) * (1 - i / 34), dx = (hash(i, 2) - 0.5) * w * (0.4 + i / 30) + Math.sin(t * 0.25 + i * 1.7) * 6;
      return <line key={i} x1={x + dx - wd} y1={y + dy} x2={x + dx + wd} y2={y + dy} stroke="#FFE7A8" strokeWidth={2.4} strokeLinecap="round" opacity={(0.35 + 0.65 * Math.abs(Math.sin(t * 0.3 + i))) * (1 - i / 26)} />;
    })}
  </g>
);

type CrossProps = { id: string; t: number; t0: number; t1: number; from: Pt; to: Pt; n?: number; size?: number; spacing?: number; drift?: number; raft?: boolean; flares?: { t0: number; x: number; y: number }[]; splashes?: number; seed?: number; crew?: number };
export const RiverCrossing: React.FC<CrossProps> = ({ t, t0, t1, from, to, n = 5, size = 54, spacing = 74, drift = 60, raft = false, flares = [], splashes = 6, seed = 1, crew = 3 }) => {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
  return (
    <g>
      {flares.map((f, i) => t >= f.t0 && t < f.t0 + 180 && <FlareGlitter key={`g${i}`} x={f.x + Math.sin((t - f.t0) * 0.05) * 14} y={f.y + (t - f.t0) * 0.7} t={t} h={Math.max(40, 400 - (t - f.t0) * 0.2)} o={Math.min(1, (t - f.t0) / 10) * (1 - prog(t, f.t0 + 140, f.t0 + 180))} />)}
      {Array.from({ length: splashes }, (_, i) => {
        const ts = lerp(t0, t1, (i + 0.5) / splashes) + (hash(i, seed) - 0.5) * 16, u = 0.12 + 0.76 * hash(i, seed + 1), off = (hash(i, seed + 2) - 0.5) * (n * spacing + 220);
        return <WaterSplash key={`s${i}`} t={t} t0={ts} x={lerp(from[0], to[0], u) + nx * off} y={lerp(from[1], to[1], u) + ny * off} r={26 + 18 * hash(i, seed + 3)} />;
      })}
      {Array.from({ length: n }, (_, i) => {
        if (t < t0) return null;
        const o = (i - (n - 1) / 2) * spacing, delay = hash(i, seed + 9) * 0.35, bowK = drift * (0.6 + 0.8 * hash(i, seed + 4));
        const posAt = (v: number): Pt => [lerp(from[0], to[0], v) + nx * o, lerp(from[1], to[1], v) + ny * o + Math.sin(v * Math.PI) * bowK];
        const u = clamp((prog(t, t0, t1) - delay) / (1 - delay)), p = posAt(u), q = posAt(Math.min(1, u + 0.03));
        const heading = deg(Math.atan2(q[1] - p[1] || dy, q[0] - p[0] || dx)), moving = u > 0 && u < 1;
        return (
          <g key={i}>
            {moving && <WaterRipples t={t} t0={t - 8} x={p[0]} y={p[1]} r={size * 0.7} n={2} life={40} />}
            {raft ? <Raft x={p[0]} y={p[1]} heading={heading} size={size * 1.15} t={t} crew={crew + 1} ph={i * 9} /> : <Boat x={p[0]} y={p[1]} heading={heading} size={size} t={t} crew={crew} wake={moving} ph={i * 7} />}
          </g>
        );
      })}
      {flares.map((f, i) => <Flare key={`f${i}`} t={t} t0={f.t0} x={f.x} y={f.y} r={150} life={180} />)}
    </g>
  );
};
