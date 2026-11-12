import React from 'react';
import { rnd } from '../../engine';

// Chapter D: a steep coffee hillside in the Central Highlands (Tây Nguyên): red basalt soil, terraced rows of
// coffee bushes with red cherries, blue hills and morning mist. SLOPE_Y(x) is the ground line the picker stands on.

export const SLOPE_Y = (x: number) => 960 - 0.3 * x;

/** A coffee bush: dark glossy leaves with red cherries; `sway` nudges the top in the wind. */
export const CoffeeBush: React.FC<{ x: number; y: number; s?: number; sway?: number; seed?: number; picked?: number }> = ({ x, y, s = 1, sway = 0, seed = 1, picked = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={12} fill="#000" opacity={0.25} />
    <path d="M 0 0 V -60" stroke="#4A3226" strokeWidth={10} />
    <g transform={`rotate(${sway} 0 -40)`}>
      {Array.from({ length: 11 }).map((_, i) => (
        <ellipse key={i} cx={-70 + rnd(seed, i) * 140} cy={-70 - rnd(seed + 1, i) * 120} rx={46} ry={22} fill={i % 2 ? '#2F7A44' : '#3E9A55'} stroke="#1D4A2A" strokeWidth={3} transform={`rotate(${(rnd(seed + 2, i) - 0.5) * 80} ${-70 + rnd(seed, i) * 140} ${-70 - rnd(seed + 1, i) * 120})`} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        i < 14 - picked ? <circle key={i} cx={-80 + rnd(seed + 5, i) * 160} cy={-60 - rnd(seed + 6, i) * 130} r={9} fill="#D9302E" stroke="#7A1616" strokeWidth={2.5} /> : null
      ))}
    </g>
  </g>
);

/** The whole hillside behind the picker. `t` drives the mist and the sway. */
export const CoffeeHillside: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <linearGradient id="chdSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7FB6D8" />
        <stop offset="60%" stopColor="#F6D9A8" />
        <stop offset="100%" stopColor="#FFC98A" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={1700} fill="url(#chdSky)" />
    <circle cx={330} cy={250} r={190} fill="#FFF0C4" opacity={0.55} filter="url(#blur16)" />
    <circle cx={330} cy={250} r={70} fill="#FFF6DA" />
    <path d="M -400 520 Q 100 330 520 470 T 1300 400 T 2320 470 V 1200 H -400 Z" fill="#8FB0C8" opacity={0.75} />
    <path d="M -400 640 Q 300 470 760 580 T 1560 520 T 2320 600 V 1200 H -400 Z" fill="#6E9A92" opacity={0.9} />
    {/* red-soil slope with terraces */}
    <path d={`M -400 ${SLOPE_Y(-400) + 20} L 2320 ${SLOPE_Y(2320) + 20} V 1300 H -400 Z`} fill="#A24E2E" />
    <path d={`M -400 ${SLOPE_Y(-400) + 20} L 2320 ${SLOPE_Y(2320) + 20}`} stroke="#C26A44" strokeWidth={8} />
    {[1, 2, 3].map((r) => (
      <g key={r}>
        <path d={`M -400 ${SLOPE_Y(-400) + 20 + r * 150} L 2320 ${SLOPE_Y(2320) + 20 + r * 150}`} stroke="#7A3820" strokeWidth={6} opacity={0.7} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = -150 + i * 360 + r * 120;
          return <CoffeeBush key={i} x={x} y={SLOPE_Y(x) + r * 150 + 10} s={0.62 + r * 0.04} sway={Math.sin(t / 22 + i + r) * 2} seed={i + r * 9} />;
        })}
      </g>
    ))}
    {/* the rows further up the hill */}
    {[0, 1, 2, 3, 4].map((i) => {
      const x = 100 + i * 420;
      return <CoffeeBush key={i} x={x} y={SLOPE_Y(x) - 10} s={0.45} sway={Math.sin(t / 25 + i) * 2} seed={i + 40} />;
    })}
    <g opacity={0.55} filter="url(#blur16)">
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={((t * (0.5 + i * 0.2) + i * 700) % 2600) - 300} cy={640 + i * 90} rx={520} ry={44} fill="#FFF3E0" />
      ))}
    </g>
  </g>
);
