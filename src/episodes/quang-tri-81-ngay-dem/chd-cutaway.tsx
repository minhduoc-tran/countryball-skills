import React from 'react';
import { hash, clamp, prog } from '../../countryball/fx-math';
import { Glow } from '../../countryball/fx-glow';

// Chapter D cutaway (side section of the ground): a dim sky with distant flashes on top, earth below, a timber-braced
// bunker (x 300..1500 in WORLD px) and a trench corridor going right (x 1500..3000, open to the sky in slits).
// The camera is `camX` (world px at the left edge of the screen). Every `period` frames a shell lands somewhere above:
// the whole section shudders and dust falls from the ceiling. Children are drawn in WORLD coords inside the section
// (floor line at FLOOR_Y). `water` 0..1 floods the floor to ~210 px; `rain` adds mud tint. No people are drawn here.

export const FLOOR_Y = 900;
const CEIL_Y = 560, SURFACE_Y = 330;

export const Cutaway: React.FC<{
  id: string; t: number; camX?: number; period?: number; water?: number; lamp?: boolean; dusk?: number; mud?: number; children?: React.ReactNode;
}> = ({ id, t, camX = 0, period = 52, water = 0, lamp = true, dusk = 0.5, mud = 0, children }) => {
  const k = t % period, boom = Math.max(0, 1 - k / 9), shake = boom * 7, sx = (hash(Math.floor(t / period), 3) - 0.5) * 2 * shake, sy = (hash(Math.floor(t / period), 4) - 0.5) * 2 * shake;
  const flash = k < 4 ? 1 - k / 4 : 0, fx = 300 + hash(Math.floor(t / period), 8) * 2400;
  const earth = mud > 0 ? '#4B3A2A' : '#4A3526';
  const wl = clamp(water) * 210;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B2230" /><stop offset="1" stopColor={dusk > 0.5 ? '#6B4A3A' : '#8A6A55'} /></linearGradient>
        <clipPath id={`${id}-cav`}><rect x={camX + 0} y={CEIL_Y} width={4000} height={FLOOR_Y - CEIL_Y} /></clipPath>
      </defs>
      <rect width={1920} height={1080} fill="#2A1D14" />
      <g transform={`translate(${-camX + sx},${sy})`}>
        {/* sky + horizon flashes */}
        <rect x={camX - 40} y={-40} width={2000} height={SURFACE_Y + 50} fill={`url(#${id}-sky)`} />
        {flash > 0 && <Glow x={fx} y={SURFACE_Y - 10} r={340} color="#FFB45A" o={0.75 * flash} />}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${i * 480 - 60},${SURFACE_Y} l40,-${60 + 70 * hash(i, 2)} l30,24 l36,-${30 + 40 * hash(i, 5)} l40,${70 + 40 * hash(i, 7)} Z`} fill="#241A17" opacity={0.85} />)}
        {/* earth with stones */}
        <rect x={-100} y={SURFACE_Y} width={3400} height={800} fill={earth} />
        <rect x={-100} y={SURFACE_Y} width={3400} height={16} fill="#5C4A32" />
        {Array.from({ length: 150 }, (_, i) => <ellipse key={i} cx={hash(i, 1) * 3300 - 80} cy={SURFACE_Y + 30 + hash(i, 2) * 760} rx={4 + hash(i, 3) * 12} ry={3 + hash(i, 4) * 7} fill={hash(i, 5) > 0.5 ? '#3A2A1D' : '#5E4A36'} opacity={0.7} />)}
        {/* bunker cavity + trench corridor */}
        <rect x={300} y={CEIL_Y} width={1200} height={FLOOR_Y - CEIL_Y} rx={30} fill="#1C130E" stroke="#0E0805" strokeWidth={6} />
        <rect x={1480} y={CEIL_Y + 120} width={1500} height={FLOOR_Y - CEIL_Y - 120} fill="#1C130E" stroke="#0E0805" strokeWidth={6} />
        {[1700, 2150, 2600].map((x) => <rect key={x} x={x} y={SURFACE_Y} width={110} height={CEIL_Y + 120 - SURFACE_Y + 4} fill="#7A5A48" opacity={0.6} />)}
        {[2200, 2650].map((x, i) => <g key={x}><rect x={x - 40} y={SURFACE_Y - 8} width={80} height={14} fill="#6B5A40" transform={`rotate(${i * 4 - 2} ${x} ${SURFACE_Y})`} /></g>)}
        {/* timber props */}
        {[330, 780, 1230, 1470].map((x) => <rect key={x} x={x - 14} y={CEIL_Y} width={28} height={FLOOR_Y - CEIL_Y} fill="#6B4A2E" stroke="#2A1A0E" strokeWidth={4} />)}
        <rect x={300} y={CEIL_Y} width={1200} height={30} fill="#7A5634" stroke="#2A1A0E" strokeWidth={4} />
        <rect x={300} y={FLOOR_Y} width={2700} height={60} fill="#33261B" />
        {/* lamp */}
        {lamp && <g transform={`translate(${780 + Math.sin(t * 0.07) * 8 + sx * 2},${CEIL_Y + 30})`}>
          <line x1={0} y1={0} x2={0} y2={70} stroke="#2A1A0E" strokeWidth={4} />
          <Glow x={0} y={92} r={300} color="#FFC46A" o={0.55 + 0.1 * Math.sin(t * 0.4)} />
          <path d="M-14,86 L14,86 L10,108 L-10,108 Z" fill="#E2B95A" stroke="#2A1A0E" strokeWidth={3} /><circle cy={96} r={7} fill="#FFF2C4" />
        </g>}
        {children}
        {/* dust from the ceiling after each hit */}
        <g clipPath={`url(#${id}-cav)`}>
          {Array.from({ length: 30 }, (_, i) => {
            const age = k - hash(i, 9) * 8;
            if (age < 0 || age > 48) return null;
            return <circle key={i} cx={340 + hash(i, 1) * 1100} cy={CEIL_Y + 30 + age * (3 + 4 * hash(i, 2))} r={2 + 3 * hash(i, 3)} fill="#B79B78" opacity={0.7 * (1 - age / 48)} />;
          })}
        </g>
        {/* water in the cavity / trench */}
        {wl > 0 && <g>
          <rect x={300} y={FLOOR_Y - wl + Math.sin(t * 0.12) * 3} width={2700} height={wl + 60} fill="#6B5B3E" opacity={0.82} />
          <path d={`M300,${FLOOR_Y - wl} ${Array.from({ length: 28 }, (_, i) => `l50,${i % 2 ? 5 : -5}`).join(' ')}`} stroke="#A99970" strokeWidth={4} fill="none" opacity={0.7} />
        </g>}
      </g>
      <rect width={1920} height={1080} fill="#000" opacity={0.12 + 0.2 * (1 - prog(k, 0, 6))} />
    </g>
  );
};
