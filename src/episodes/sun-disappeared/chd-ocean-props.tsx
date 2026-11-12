import React from 'react';
import { clamp, easeOut, rnd, SCH, SchLabel } from '../../engine';

// Chapter D local props, part 2: the frozen sea (ice sheet, cross-section schematic, fish, bubbles).

/** A pale ice sheet spreading up from the viewer toward the horizon: `p` 0..1. Fills x -100..2020 below the jagged front. */
export const IceSheet: React.FC<{ p: number; horizon: number; id: string; t?: number }> = ({ p, horizon, id, t = 0 }) => {
  const pts: string[] = [];
  for (let x = -120; x <= 2040; x += 40) {
    const px = clamp(p * 1.5 - 0.35 * (x / 1920) - 0.1 * rnd(5, x / 40));
    const y = 1160 - (1160 - horizon - 8) * easeOut(px) + (px > 0 && px < 1 ? (rnd(9, x / 40) - 0.5) * 34 : 0);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  const cracks = Array.from({ length: 16 }).map((_, i) => {
    const cx = rnd(3, i) * 1920, cy = horizon + 40 + rnd(4, i) * (1080 - horizon - 60);
    const shown = clamp(p * 1.4 - 0.2 - cy / 3000) > 0.6;
    return shown ? <path key={i} d={`M ${cx} ${cy} l ${30 + rnd(6, i) * 80} ${rnd(7, i) * 30 - 10} l ${20 + rnd(8, i) * 40} ${rnd(1, i) * 40 - 10}`} stroke="#8EB2CC" strokeWidth={3} fill="none" /> : null;
  });
  return (
    <g>
      <defs>
        <linearGradient id={`${id}ice`} x1="0" y1={horizon} x2="0" y2="1080" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6F90B2" />
          <stop offset="1" stopColor="#D8EEF8" />
        </linearGradient>
        <clipPath id={`${id}clip`}><polygon points={`${pts.join(' ')} 2040,1200 -120,1200`} /></clipPath>
      </defs>
      <polygon points={`${pts.join(' ')} 2040,1200 -120,1200`} fill={`url(#${id}ice)`} />
      <g clipPath={`url(#${id}clip)`}>{cracks}
        <ellipse cx={560 + Math.sin(t / 30) * 20} cy={900} rx={380} ry={26} fill="#FFFFFF" opacity={0.16} />
      </g>
      <polyline points={pts.join(' ')} fill="none" stroke="#F4FBFF" strokeWidth={5} strokeLinejoin="round" opacity={0.8} />
    </g>
  );
};

/** Side-on fish, nose to the right (flip with `dir` -1). x, y at the body centre. `t` drives the tail. */
export const Fish: React.FC<{ x: number; y: number; s?: number; dir?: 1 | -1; t: number; color?: string }> = ({ x, y, s = 1, dir = 1, t, color = '#FF9A4A' }) => {
  const w = Math.sin(t / 5) * 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
      <path d={`M -60 0 L ${-100} ${-34 + w * 0.5} Q ${-88} ${w * 0.3} ${-100} ${34 + w * 0.5} Z`} fill="#E5742A" />
      <path d="M -62 0 Q -20 -52 50 -22 Q 84 -4 78 6 Q 40 40 -20 34 Q -52 24 -62 0 Z" fill={color} stroke="#2A1A14" strokeWidth={3} strokeLinejoin="round" />
      <path d="M -20 -40 Q 0 -66 24 -34 Z" fill="#E5742A" stroke="#2A1A14" strokeWidth={3} strokeLinejoin="round" />
      <path d="M -6 12 Q 20 30 30 10 Z" fill="#F6C27A" opacity={0.7} />
      <path d="M 18 -18 Q 12 4 20 24" stroke="#E5742A" strokeWidth={4} fill="none" opacity={0.7} />
      <circle cx={52} cy={-6} r={8} fill="#F6EFE3" stroke="#2A1A14" strokeWidth={2.5} />
      <circle cx={54} cy={-6} r={3.6} fill="#14121A" />
    </g>
  );
};

/** Rising bubbles. */
export const Bubbles: React.FC<{ t: number; x0: number; w: number; y0: number; y1: number; n?: number; seed?: number; o?: number }> = ({ t, x0, w, y0, y1, n = 14, seed = 2, o = 0.5 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const k = ((t * (0.004 + rnd(seed, i) * 0.004) + rnd(seed + 1, i)) % 1);
      return <circle key={i} cx={x0 + rnd(seed + 2, i) * w + Math.sin(t / 9 + i) * 8} cy={y0 + (y1 - y0) * k} r={3 + rnd(seed + 3, i) * 6} fill="none" stroke="#CDEBFF" strokeWidth={2} opacity={o * (1 - 0.7 * k)} />;
    })}
  </g>
);

/**
 * The cross-section: snow above, an ICE lid, liquid WATER, the warm seabed. `lid` 0..1 draws the ice thickening from the top,
 * `heat` 0..1 shows red arrows rising from the seabed and tints the deep water. Box x 360..1560, y 240..880.
 */
export const IceSection: React.FC<{ t: number; lid: number; heat: number; id: string; labels: { ice: number; water: number; heat: number } }> = ({ t, lid, heat, id, labels }) => {
  const X0 = 360, X1 = 1560, IC0 = 330, IC1 = 330 + 130 * easeOut(lid), WB = 800;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1={IC0} x2="0" y2={WB} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1C4C7C" />
          <stop offset="0.6" stopColor="#173A68" />
          <stop offset="1" stopColor={heat > 0 ? '#5A2E58' : '#12305A'} />
        </linearGradient>
        <pattern id={`${id}h`} width={26} height={26} patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <path d="M 0 0 L 0 26" stroke="#FFFFFF" strokeWidth={3} opacity={0.35} />
        </pattern>
      </defs>
      <rect x={X0} y={IC0} width={X1 - X0} height={WB - IC0} fill={`url(#${id}w)`} stroke={SCH.dim} strokeWidth={4} />
      {/* waves of slow water under the lid */}
      {[0, 1, 2].map((i) => <path key={i} d={`M ${X0 + 20} ${IC1 + 70 + i * 80} q 80 ${-14 + Math.sin(t / 12 + i) * 6} 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0`} stroke="#6CA6D8" strokeWidth={3} fill="none" opacity={0.4} />)}
      <rect x={X0} y={IC0} width={X1 - X0} height={IC1 - IC0} fill="#CFE9F7" stroke="#F4FBFF" strokeWidth={4} />
      <rect x={X0} y={IC0} width={X1 - X0} height={IC1 - IC0} fill={`url(#${id}h)`} />
      <path d={`M ${X0} ${WB} Q 700 ${WB - 26} 960 ${WB + 4} T ${X1} ${WB - 6} L ${X1} ${WB + 80} L ${X0} ${WB + 80} Z`} fill="#4A3224" stroke="#8A6040" strokeWidth={4} />
      {/* snow on the lid */}
      <path d={`M ${X0} ${IC0} q 60 -34 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`} fill="#F4FBFF" opacity={clamp(lid * 2)} />
      {heat > 0 ? Array.from({ length: 5 }).map((_, i) => {
        const x = 520 + i * 230, k = (t * 0.02 + i * 0.2) % 1;
        const a = clamp(heat) * (0.4 + 0.6 * Math.sin(k * Math.PI));
        return (
          <g key={i} opacity={a}>
            <path d={`M ${x} ${WB - 10} L ${x} ${WB - 150 - k * 120}`} stroke="#FF5A4A" strokeWidth={14} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 12px #FF5A4A)' }} />
            <path d={`M ${x - 28} ${WB - 130 - k * 120} L ${x} ${WB - 190 - k * 120} L ${x + 28} ${WB - 130 - k * 120}`} stroke="#FF5A4A" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      }) : null}
      <SchLabel x={1620} y={IC0 + 62} t={labels.ice} text="ICE" size={64} anchor="start" />
      <path d={`M 1566 ${IC0 + 48} L 1610 ${IC0 + 48}`} stroke={SCH.line} strokeWidth={4} opacity={labels.ice > 0 ? 1 : 0} />
      <SchLabel x={1620} y={600} t={labels.water} text="WATER" size={64} anchor="start" color="#8CC8FF" />
      <SchLabel x={960} y={WB + 140} t={labels.heat} text="EARTH'S HEAT" size={62} color="#FF7A5A" />
    </g>
  );
};
