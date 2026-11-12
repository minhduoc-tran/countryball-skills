import React from 'react';
import { Glow } from '../../countryball/fx-glow';
import { clamp, flicker, hash } from '../../countryball/fx-math';

// Chapter H (the quiet ending) river scenery: the Thạch Hãn at dusk / night. A pure function of the shot clock `t` (frames).
//   <RiverScene id t tone pan H bridges reeds />   sky (tone 0 = dusk .. 1 = night), stars, moon, far bank, optional bridges,
//                                                   water with reflections. Children are drawn ON the water (lanterns, boat).
//   <LanternField id t n ... />                     hoa đăng drifting on the water, perspective-sized, staggered release
//   <Lamp x y s t ph c o />                         one lantern (lotus + candle glow + reflection streak)

export const mixHex = (a: string, b: string, k: number): string => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp(k)).toString(16).padStart(2, '0')).join('')}`;
};

const PETALS = [['#F7B3C9', '#FDE0EA'], ['#F4F1E6', '#FFFFFF'], ['#F6CF68', '#FDE9A8']] as const;

/** One floating lantern. (x, y) = centre on the water, s = radius in px (perspective size). */
export const Lamp: React.FC<{ x: number; y: number; s: number; t: number; ph?: number; c?: number; o?: number; glow?: number }> = ({ x, y, s, t, ph = 0, c = 0, o = 1, glow = 1 }) => {
  if (o < 0.01) return null;
  const f = flicker(t * 0.6, ph), bob = Math.sin((t + ph * 11) * 0.06) * s * 0.06, [pa, pb] = PETALS[c % 3];
  return (
    <g opacity={o}>
      {/* reflection streak on the water below */}
      <ellipse cx={x} cy={y + s * 1.1} rx={s * 0.2 * f} ry={s * 1.3} fill="#FFB347" opacity={0.22 * glow} style={{ mixBlendMode: 'screen' }} />
      <Glow x={x} y={y + bob} r={s * (s > 26 ? 2.4 : 3.4) * f} color="#FFA43A" o={(s > 26 ? 0.34 : 0.5) * glow} />
      {s > 7 && (
        <g transform={`translate(${x},${y + bob})`} strokeLinejoin="round">
          <ellipse cy={s * 0.2} rx={s * 0.95} ry={s * 0.26} fill="#000" opacity={0.3} />
          <g transform="scale(1,0.42)">
            {[0, 1].map((ring) => Array.from({ length: 8 }, (_, i) => (
              <ellipse key={`${ring}${i}`} rx={s * (ring ? 0.28 : 0.36)} ry={s * 0.16} fill={ring ? pb : pa} stroke="#2B1A16" strokeWidth={Math.max(0.6, s * 0.03)}
                transform={`rotate(${i * 45 + ring * 22.5}) translate(${s * (ring ? 0.34 : 0.66)},0)`} />
            )))}
          </g>
          <ellipse cy={-s * 0.02} rx={s * 0.2} ry={s * 0.12} fill="#FFF4C8" />
          <path d={`M0,${-s * 0.08} Q${s * 0.13},${-s * 0.4 * f} 0,${-s * 0.72 * f} Q${-s * 0.13},${-s * 0.4 * f} 0,${-s * 0.08} Z`} fill="#FFC53A" />
          <path d={`M0,${-s * 0.1} Q${s * 0.05},${-s * 0.3} 0,${-s * 0.46 * f} Q${-s * 0.05},${-s * 0.3} 0,${-s * 0.1} Z`} fill="#FFF6D6" />
        </g>
      )}
      {s <= 7 && <circle cx={x} cy={y + bob} r={Math.max(1.4, s * 0.38)} fill="#FFE29A" />}
    </g>
  );
};

/** Lanterns drifting along the river: deterministic, far ones small and slow, near ones big. `n` lanterns, released between
 *  frame t0 and t0 + span (each fades in), moving `dir` (+1 right, -1 left). `H` = horizon y; band = fraction of water used. */
export const LanternField: React.FC<{
  id: string; t: number; n?: number; H?: number; t0?: number; span?: number; dir?: 1 | -1; speed?: number; size?: number;
  seed?: number; dMin?: number; dMax?: number; o?: number;
}> = ({ t, n = 90, H = 520, t0 = 0, span = 60, dir = 1, speed = 0.32, size = 1, seed = 1, dMin = 0, dMax = 1, o = 1 }) => {
  const W = 2300, items = Array.from({ length: n }, (_, i) => ({ i, d: dMin + (dMax - dMin) * Math.pow(hash(i, seed), 0.85) })).sort((a, b) => a.d - b.d);
  return (
    <g>
      {items.map(({ i, d }) => {
        const born = t0 + hash(i, seed + 5) * span, a = t - born;
        if (a < 0) return null;
        const s = (6 + 44 * d) * size, y = H + 26 + d * (1080 - H - 110) + Math.sin(t * 0.02 + i) * 3;
        const x0 = hash(i, seed + 2) * W, xr = (((x0 + dir * (t - t0) * speed * (0.3 + 1.1 * d)) % W) + W) % W - 170;
        const edge = clamp(Math.min(xr + 170, W - 170 - xr) / 120);
        return <Lamp key={i} x={xr + Math.sin(t * 0.03 + i * 2) * 5} y={y} s={s} t={t} ph={i} c={i + Math.floor(hash(i, seed + 7) * 3)} o={clamp(a / 26) * edge * o} />;
      })}
    </g>
  );
};

const treeline = (seed: number, base: number, amp: number): string => {
  let d = `M-60,${base + 140} L-60,${base}`;
  for (let x = -60; x <= 1990; x += 14) {
    const h = amp * (0.3 + 0.28 * Math.sin(x / 170 + seed) + 0.2 * Math.sin(x / 57 + seed * 2) + 0.22 * hash(Math.round(x / 14), seed));
    d += ` L${x},${(base - Math.max(2, h)).toFixed(1)}`;
  }
  return `${d} L1990,${base + 140} Z`;
};

/** Sky + far bank + water. `H` horizon y; `pan` shifts the far scenery (parallax px); `tone` 0 dusk .. 1 night. */
export const RiverScene: React.FC<{
  id: string; t: number; tone?: number; pan?: number; H?: number; bridges?: boolean; reeds?: boolean; moonX?: number; children?: React.ReactNode; lit?: number;
}> = ({ id, t, tone = 1, pan = 0, H = 520, bridges = false, reeds = false, moonX = 1720, children, lit = 1 }) => {
  const k = clamp(tone);
  const top = mixHex('#1E2D52', '#050A18', k), mid = mixHex('#8A5468', '#0B1830', k), low = mixHex('#F0A55E', '#1B3254', k), water = mixHex('#2A3552', '#071222', k);
  const bank = mixHex('#17202E', '#060C16', k), hill = mixHex('#2A3446', '#0B1424', k);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="0.6" stopColor={mid} /><stop offset="1" stopColor={low} /></linearGradient>
        <linearGradient id={`${id}-wat`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mixHex(low, water, 0.35)} /><stop offset="0.35" stopColor={water} /><stop offset="1" stopColor={mixHex(water, '#000000', 0.55)} /></linearGradient>
        <linearGradient id={`${id}-mist`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={low} stopOpacity={0} /><stop offset="1" stopColor={low} stopOpacity={0.55} /></linearGradient>
      </defs>
      <rect width={1920} height={H + 2} fill={`url(#${id}-sky)`} />
      {Array.from({ length: 80 }, (_, i) => (
        <circle key={i} cx={hash(i, 1) * 1920} cy={hash(i, 2) * H * 0.8} r={0.8 + 1.8 * hash(i, 3)} fill="#E8F0FF" opacity={k * k * (0.25 + 0.6 * hash(i, 4)) * (0.65 + 0.35 * Math.sin(t / 16 + i))} />
      ))}
      <Glow x={moonX} y={170} r={330} color="#B8CCFF" o={0.5 * k} />
      <circle cx={moonX} cy={170} r={44} fill="#F3F6FF" opacity={0.95 * k} />
      <Glow x={560 - pan * 0.1} y={H - 10} r={760} color="#FF8A3C" o={0.55 * (1 - k)} />
      <path transform={`translate(${-pan * 0.15},0)`} d={treeline(11, H - 52, 70)} fill={hill} opacity={0.9} />
      <rect y={H - 120} width={1920} height={125} fill={`url(#${id}-mist)`} opacity={0.5} />
      <path transform={`translate(${-pan * 0.4},0)`} d={treeline(5, H - 8, 46)} fill={bank} />
      {/* tiny lights in the far village */}
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={((hash(i, 21) * 2000 - pan * 0.4 + 2000) % 2000) - 40} cy={H - 4 - 6 * hash(i, 22)} r={2} fill="#FFD27A" opacity={0.15 + 0.7 * k * (0.7 + 0.3 * Math.sin(t / 20 + i))} />
      ))}
      {bridges && <Bridges H={H} pan={pan} k={k} lit={lit} t={t} />}
      <rect y={H} width={1920} height={1080 - H} fill={`url(#${id}-wat)`} />
      {/* sky/moon reflection */}
      <Glow x={moonX} y={H + 100} r={260} color="#B8CCFF" o={0.22 * k} />
      {Array.from({ length: 22 }, (_, i) => {
        const y = H + 10 + i * i * 1.15, w = (60 + i * 7) * (0.7 + 0.3 * Math.sin(t / 14 + i * 1.3));
        return <rect key={i} x={moonX - w / 2 + Math.sin(t / 30 + i) * 8} y={y} width={w} height={2 + i * 0.12} rx={2} fill="#CFE0FF" opacity={0.5 * k * (1 - i / 26)} />;
      })}
      {Array.from({ length: 60 }, (_, i) => {
        const d = hash(i, 1), y = H + 10 + Math.pow(d, 1.5) * (1080 - H - 20), w = 30 + 140 * d * hash(i, 2), x = hash(i, 3) * 2100 - 100 + Math.sin(t / 40 + i) * 18;
        return <line key={i} x1={x} y1={y} x2={x + w} y2={y} stroke={hash(i, 4) > 0.5 ? '#9DB6D8' : '#FFB36A'} strokeWidth={1 + 2.2 * d} strokeLinecap="round" opacity={(0.05 + 0.16 * hash(i, 5)) * (0.5 + 0.5 * Math.sin(t / 11 + i * 1.7))} />;
      })}
      {children}
      {reeds && <Reeds t={t} />}
    </g>
  );
};

const Bridges: React.FC<{ H: number; pan: number; k: number; lit: number; t: number }> = ({ H, pan, k, lit, t }) => {
  const col = mixHex('#38476A', '#0E1830', k);
  const lamps = (x0: number, x1: number, y: number) => Array.from({ length: Math.floor((x1 - x0) / 34) }, (_, i) => (
    <circle key={i} cx={x0 + i * 34} cy={y} r={2.8} fill="#FFD890" opacity={lit * (0.6 + 0.3 * k) * (0.8 + 0.2 * Math.sin(t / 18 + i))} />
  ));
  const pillars = (xs: number[], y: number) => xs.map((x, i) => <g key={i}><rect x={x - 9} y={y} width={18} height={H + 14 - y} fill={col} /><rect x={x - 5} y={H + 14} width={10} height={70} fill="#FFD890" opacity={0.16 * lit} style={{ mixBlendMode: 'screen' }} /></g>);
  // bridge 1: steel truss (zigzag girder), bridge 2: concrete arches
  const x0 = 100, x1 = 880, y1 = H - 24, xs1 = Array.from({ length: 6 }, (_, i) => x0 + ((x1 - x0) * i) / 5);
  const zig = Array.from({ length: 26 }, (_, i) => `${x0 - 40 + i * 34},${i % 2 ? y1 - 44 : y1 - 8}`).join(' ');
  const y2 = H - 14, xs2 = Array.from({ length: 6 }, (_, i) => 1040 + i * 190);
  return (
    <g transform={`translate(${-pan * 0.3},0)`}>
      {pillars(xs1, y1)}
      <rect x={x0 - 60} y={y1 - 8} width={x1 - x0 + 120} height={14} fill={col} />
      <polyline points={zig} fill="none" stroke={col} strokeWidth={4} />
      <line x1={x0 - 60} y1={y1 - 44} x2={x1 + 60} y2={y1 - 44} stroke={col} strokeWidth={5} />
      {lamps(x0 - 60, x1 + 60, y1 - 54)}
      {pillars(xs2, y2)}
      <rect x={990} y={y2 - 8} width={1010} height={14} fill={col} />
      {xs2.slice(0, -1).map((x, i) => <path key={i} d={`M${x},${H + 12} Q${x + 95},${y2 - 34} ${x + 190},${H + 12}`} fill="none" stroke={col} strokeWidth={9} />)}
      {lamps(990, 2000, y2 - 20)}
    </g>
  );
};

/** Dark reeds in the lower corners (depth). */
export const Reeds: React.FC<{ t: number }> = ({ t }) => (
  <g fill="none" stroke="#02060C" strokeLinecap="round">
    {Array.from({ length: 26 }, (_, i) => {
      const left = i % 2 === 0, x = left ? 20 + hash(i, 1) * 360 : 1900 - hash(i, 1) * 360, h = 150 + 260 * hash(i, 2), sway = Math.sin(t / 40 + i) * 14;
      return <path key={i} d={`M${x},1100 Q${x + (left ? 20 : -20) + sway * 0.4},${1100 - h * 0.5} ${x + (left ? 60 : -60) + sway},${1100 - h}`} strokeWidth={5 + 6 * hash(i, 3)} />;
    })}
  </g>
);
