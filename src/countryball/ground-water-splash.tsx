import React from 'react';
import { Puff } from './fx-glow';
import { easeOut, hash, polar, prog } from './fx-math';

// Water effects on a river / sea map (screen px, t in frames):
//   <WaterSplash t t0 x y r? />     a shell landing in the water: white column shoots up (12 f), collapses, foam disc, ripple rings
//   <WaterRipples t t0 x y r? n?/>  just the expanding rings (oar strokes, floating lantern, rain)
// The column is drawn upright (up the screen), which reads as a column of water in the oblique map view.

export const WaterRipples: React.FC<{ t: number; t0: number; x: number; y: number; r?: number; n?: number; life?: number; color?: string }> = ({ t, t0, x, y, r = 40, n = 3, life = 80, color = '#E8F4FF' }) => {
  const a = t - t0;
  if (a < 0 || a > life + n * 10) return null;
  return (
    <g fill="none" stroke={color}>
      {Array.from({ length: n }, (_, i) => {
        const age = a - i * 10, k = age / life;
        return age > 0 && k < 1 ? <ellipse key={i} cx={x} cy={y} rx={r * (0.3 + 1.6 * easeOut(k))} ry={r * 0.45 * (0.3 + 1.6 * easeOut(k))} strokeWidth={3 * (1 - k) + 0.6} opacity={0.8 * (1 - k)} /> : null;
      })}
    </g>
  );
};

export const WaterSplash: React.FC<{ t: number; t0: number; x: number; y: number; r?: number }> = ({ t, t0, x, y, r = 34 }) => {
  const a = t - t0;
  if (a < 0 || a > 110) return null;
  const rise = easeOut(a / 12), fall = prog(a, 14, 40), h = r * 3.1 * rise * (1 - fall * 0.94), w = r * 0.3 * (0.6 + 0.4 * rise) * (1 + 0.5 * fall);
  return (
    <g>
      <WaterRipples t={t} t0={t0} x={x} y={y} r={r * 1.1} n={3} life={90} />
      <ellipse cx={x} cy={y} rx={r * (0.5 + 0.9 * easeOut(a / 20))} ry={r * 0.3 * (0.5 + 0.9 * easeOut(a / 20))} fill="#F4FAFF" opacity={0.75 * (1 - prog(a, 30, 100))} />
      {h > 2 && (
        <g opacity={1 - prog(a, 34, 46) * 0.4}>
          <path d={`M${x - w * 1.5},${y} Q${x - w * 0.7},${y - h * 0.5} ${x - w * 0.8},${y - h} L${x + w * 0.8},${y - h} Q${x + w * 0.7},${y - h * 0.5} ${x + w * 1.5},${y} Z`} fill="#F7FBFF" stroke="#9CC6E8" strokeWidth={2.2} strokeLinejoin="round" />
          <Puff x={x} y={y - h} r={w * 1.15} color="#FFFFFF" o={0.95} seed={x} />
          <Puff x={x - w * 0.7} y={y - h * 0.9} r={w * 0.7} color="#EAF4FC" o={0.9} seed={x + 2} />
          <Puff x={x + w * 0.7} y={y - h * 0.86} r={w * 0.65} color="#EAF4FC" o={0.9} seed={x + 4} />
        </g>
      )}
      {a > 6 && a < 50 && Array.from({ length: 9 }, (_, i) => {
        const ang = -150 + i * 37 + hash(i, 3) * 20, d = r * (0.5 + 1.5 * easeOut((a - 6) / 20)) * (0.6 + 0.6 * hash(i, 4)), p = polar(x, y - h * 0.3, ang, d);
        return <circle key={i} cx={p[0]} cy={p[1] + (a - 6) * (a - 6) * 0.01} r={2.4 + hash(i, 5) * 2.4} fill="#EAF4FC" opacity={1 - prog(a, 20, 50)} />;
      })}
    </g>
  );
};
