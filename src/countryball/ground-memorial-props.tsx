import React from 'react';
import { Glow } from './fx-glow';
import { clamp, flicker, hash, Pt, prog } from './fx-math';
import { pathAtDist, samplePath } from './fx-flight-path';
import { WaterRipples } from './ground-water-splash';

// Memorial props for the quiet ending (screen px, t in frames, 30 fps): candle, incense, floating flower lanterns (hoa đăng).
//   <HoaDang x y s? t? color? ph? />           one lotus lantern on the water: petals, candle glow, bob, ripples, reflected light
//   <HoaDangField id t t0 points n? size? speed? every? />   lanterns released at the start of `points` (one every `every` frames) and drifting along it at `speed` px/frame
//   <Candle x y s? t? lit? />                  candle (cream wax, drip, flickering flame + warm glow); (x, y) = foot
//   <IncenseBundle x y s? t? n? />             censer bowl with n sticks, glowing tips and thin curling smoke; (x, y) = bowl bottom
// Warm light is drawn with fx-glow (screen blend), so it works best over a dim / night background.

const INK = '#151515';
const PETAL = { pink: ['#F4A6C0', '#FBD3E1'], white: ['#F2F2EA', '#FFFFFF'], yellow: ['#F4C95A', '#FCE29A'] } as const;

export const HoaDang: React.FC<{ x: number; y: number; s?: number; t?: number; color?: keyof typeof PETAL; ph?: number; light?: number }> = ({ x, y, s = 56, t = 0, color = 'pink', ph = 0, light = 1 }) => {
  const [a, b] = PETAL[color], bob = Math.sin((t + ph) * 0.07) * s * 0.03, f = flicker(t, ph);
  return (
    <g>
      <WaterRipples t={t} t0={t - ((t + ph) % 70)} x={x} y={y + s * 0.18} r={s * 0.9} n={2} life={70} />
      <g style={{ mixBlendMode: 'screen' }} opacity={0.35 * light}>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={x + Math.sin(t * 0.1 + i) * 3} cy={y + s * (0.5 + i * 0.28)} rx={s * (0.45 - i * 0.07)} ry={s * 0.05} fill="#FFD68A" />)}</g>
      <Glow x={x} y={y - s * 0.1 + bob} r={s * 1.7 * f} color="#FFB347" o={0.55 * light} />
      <g transform={`translate(${x},${y + bob})`} strokeLinejoin="round">
        <ellipse cx={0} cy={s * 0.2} rx={s * 0.62} ry={s * 0.14} fill="#000" opacity={0.28} />
        {[0, 1].map((ring) => Array.from({ length: 8 }, (_, i) => {
          const ang = (i * 360) / 8 + ring * 22.5, r = ring ? 0.5 : 0.66;
          return <g key={`${ring}-${i}`} transform={`rotate(${ang}) translate(${s * r * 0.5},0)`}><ellipse rx={s * 0.3} ry={s * (ring ? 0.16 : 0.12)} fill={ring ? b : a} stroke={INK} strokeWidth={1.8} transform={`scale(1,0.62)`} /></g>;
        }))}
        <ellipse cx={0} cy={-s * 0.04} rx={s * 0.2} ry={s * 0.13} fill="#FFF4C8" stroke={INK} strokeWidth={1.6} />
        <path d={`M0,${-s * 0.1} Q${s * 0.07},${-s * 0.28 * f} 0,${-s * 0.4 * f} Q${-s * 0.07},${-s * 0.26 * f} 0,${-s * 0.1} Z`} fill="#FFC53A" stroke="#FF8A1E" strokeWidth={1.2} />
      </g>
    </g>
  );
};

export const HoaDangField: React.FC<{ id: string; t: number; t0: number; points: Pt[]; n?: number; size?: number; speed?: number; every?: number; seed?: number }> = ({ t, t0, points, n = 9, size = 52, speed = 0.9, every = 14, seed = 1 }) => {
  const sp = samplePath(points), colors = ['pink', 'white', 'yellow'] as const;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const born = t0 + i * every + hash(i, seed) * every * 0.7, a = t - born;
        if (a < 0) return null;
        const p = pathAtDist(sp, a * speed), o = clamp(a / 20) * (1 - prog(a * speed, sp.total - 80, sp.total));
        return o > 0.01 ? <g key={i} opacity={o}><HoaDang x={p.x + Math.sin(a * 0.04 + i) * 16 + (hash(i, seed + 1) - 0.5) * 70} y={p.y + (hash(i, seed + 2) - 0.5) * 50} s={size * (0.85 + 0.3 * hash(i, seed + 3))} t={t} color={colors[i % 3]} ph={i * 13} /></g> : null;
      })}
    </g>
  );
};

export const Candle: React.FC<{ x: number; y: number; s?: number; t?: number; lit?: boolean; seed?: number }> = ({ x, y, s = 90, t = 0, lit = true, seed = 0 }) => {
  const f = flicker(t, seed), w = s * 0.2, h = s * 0.62;
  return (
    <g>
      {lit && <Glow x={x} y={y - h - s * 0.14} r={s * 1.5 * f} color="#FFB347" o={0.65} />}
      <ellipse cx={x} cy={y} rx={w * 0.9} ry={s * 0.05} fill="#000" opacity={0.3} />
      <path d={`M${x - w / 2},${y} L${x - w / 2},${y - h} Q${x},${y - h - s * 0.06} ${x + w / 2},${y - h} L${x + w / 2},${y} Q${x},${y + s * 0.06} ${x - w / 2},${y} Z`} fill="#F3E6C4" stroke={INK} strokeWidth={s * 0.035} strokeLinejoin="round" />
      <path d={`M${x + w * 0.18},${y - h + 2} q${w * 0.18},${h * 0.2} 0,${h * 0.3}`} stroke="#E2CF9E" strokeWidth={s * 0.05} strokeLinecap="round" fill="none" />
      <line x1={x} y1={y - h} x2={x} y2={y - h - s * 0.08} stroke={INK} strokeWidth={s * 0.03} />
      {lit && <path d={`M${x},${y - h - s * 0.06} Q${x + s * 0.1 * f},${y - h - s * 0.22} ${x},${y - h - s * 0.36 * f} Q${x - s * 0.1},${y - h - s * 0.22} ${x},${y - h - s * 0.06} Z`} fill="#FFC53A" stroke="#FF8A1E" strokeWidth={s * 0.02} />}
    </g>
  );
};

export const IncenseBundle: React.FC<{ x: number; y: number; s?: number; t?: number; n?: number }> = ({ x, y, s = 120, t = 0, n = 3 }) => (
  <g>
    <ellipse cx={x} cy={y} rx={s * 0.34} ry={s * 0.05} fill="#000" opacity={0.3} />
    {Array.from({ length: n }, (_, i) => {
      const lean = (i - (n - 1) / 2) * 0.16, tx = x + lean * s * 0.9, ty = y - s * 0.78 - s * 0.05 * hash(i, 1);
      return (
        <g key={i}>
          <line x1={x + lean * s * 0.1} y1={y - s * 0.2} x2={tx} y2={ty} stroke="#B9482F" strokeWidth={s * 0.026} strokeLinecap="round" />
          <circle cx={tx} cy={ty} r={s * 0.026} fill="#FF7A3A" /><Glow x={tx} y={ty} r={s * 0.12} color="#FF7A3A" o={0.7} />
          <path d={Array.from({ length: 16 }, (_, j) => { const k = j / 15, yy = ty - k * s * 0.9, xx = tx + Math.sin(k * 7 + t * 0.07 + i * 2) * s * 0.07 * (0.3 + k); return `${j ? 'L' : 'M'}${xx.toFixed(1)},${yy.toFixed(1)}`; }).join('')}
            fill="none" stroke="#E8E8EA" strokeWidth={s * 0.016} strokeLinecap="round" opacity={0.5} />
        </g>
      );
    })}
    <path d={`M${x - s * 0.3},${y - s * 0.24} L${x - s * 0.24},${y} L${x + s * 0.24},${y} L${x + s * 0.3},${y - s * 0.24} Z`} fill="#8C5A32" stroke={INK} strokeWidth={s * 0.03} strokeLinejoin="round" />
    <ellipse cx={x} cy={y - s * 0.24} rx={s * 0.3} ry={s * 0.06} fill="#C9B58A" stroke={INK} strokeWidth={s * 0.03} />
  </g>
);
