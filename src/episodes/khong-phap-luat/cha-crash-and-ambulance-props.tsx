import React from 'react';
import { clamp, easeOut, Glow } from '../../engine';
import { TopBike } from './cha-crossroads-top-props';

// Chapter A local props for the crash and the ambulance (side/front billboards for the street view).

const INK = '#14101C';

/** A scooter lying on the road, seen from a low oblique angle (the top-down bike squashed), `len` px long. Dented. */
export const LyingBike: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; rot?: number }> = ({ x, y, s = 1, color = '#3E6A8A', flip = false, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)`}>
    <g transform={`scale(${s * 1.7} ${s * 0.95}) rotate(90)`}>
      <TopBike x={0} y={0} rot={0} color={color} rider={false} dent />
    </g>
  </g>
);

/** A comic impact star with streaks, popping at k frames after the hit (k < 0: nothing, k > 14: gone). */
export const ImpactStar: React.FC<{ x: number; y: number; k: number; r?: number }> = ({ x, y, k, r = 110 }) => {
  if (k < 0 || k > 14) return null;
  const grow = easeOut(clamp(k / 4));
  const fade = 1 - clamp((k - 6) / 8);
  const pts = Array.from({ length: 16 }).map((_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const rr = (i % 2 ? 0.55 : 1) * r * grow;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(' ');
  return (
    <g transform={`translate(${x} ${y}) rotate(${k * 4})`} opacity={fade}>
      <polygon points={pts} fill="#FFE27A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <polygon points={pts} fill="#FFFFFF" transform="scale(0.55)" opacity={0.85} />
    </g>
  );
};

/** An ambulance seen from the front (about 200 x 250 at s = 1, wheels' ground line at y 0): lights alternate with f. */
export const AmbulanceFront: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => {
  const a = Math.floor(f / 4) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={120} ry={12} fill="#000" opacity={0.4} />
      <rect x={-98} y={-34} width={26} height={34} rx={6} fill="#1C1A24" stroke={INK} strokeWidth={4} />
      <rect x={72} y={-34} width={26} height={34} rx={6} fill="#1C1A24" stroke={INK} strokeWidth={4} />
      <path d="M -100 -40 L -100 -200 Q -100 -230 -70 -230 L 70 -230 Q 100 -230 100 -200 L 100 -40 Z" fill="#F4F4F4" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -78 -208 L 78 -208 L 70 -128 L -70 -128 Z" fill="#2A3A52" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -60 -198 L -20 -198 L -28 -140 L -62 -140 Z" fill="#FFFFFF" opacity={0.14} />
      <rect x={-100} y={-112} width={200} height={20} fill="#D8323C" stroke={INK} strokeWidth={3} />
      <path d="M -16 -84 L 16 -84 M 0 -100 L 0 -68" stroke="#D8323C" strokeWidth={14} />
      <rect x={-68} y={-80} width={30} height={22} rx={6} fill="#FFE7B0" stroke={INK} strokeWidth={3} />
      <rect x={38} y={-80} width={30} height={22} rx={6} fill="#FFE7B0" stroke={INK} strokeWidth={3} />
      <rect x={-84} y={-52} width={168} height={18} rx={5} fill="#8C8A98" stroke={INK} strokeWidth={3} />
      <rect x={-70} y={-248} width={60} height={22} rx={6} fill={a ? '#FF4538' : '#7A2A2A'} stroke={INK} strokeWidth={3} />
      <rect x={10} y={-248} width={60} height={22} rx={6} fill={a ? '#2A3A7A' : '#4A7CFF'} stroke={INK} strokeWidth={3} />
      <Glow x={-40} y={-240} r={300} kind="red" o={a ? 0.9 : 0.12} />
      <Glow x={40} y={-240} r={300} kind="cool" o={a ? 0.12 : 0.9} />
    </g>
  );
};

/** Siren sound waves from a point: two arcs pulsing outward in the siren colours. */
export const SirenWaves: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round">
    {[0, 1, 2].map((i) => {
      const k = ((f / 18 + i / 3) % 1 + 1) % 1;
      const r = 50 + k * 190;
      return (
        <g key={i} opacity={0.85 * (1 - k)}>
          <path d={`M ${-r} ${-r * 0.2} A ${r} ${r} 0 0 1 ${r} ${-r * 0.2}`} stroke="#FF6A58" strokeWidth={10 * (1 - k)} />
          <path d={`M ${-r * 0.8} ${r * 0.1} A ${r * 0.8} ${r * 0.8} 0 0 0 ${r * 0.8} ${r * 0.1}`} stroke="#6A9CFF" strokeWidth={8 * (1 - k)} />
        </g>
      );
    })}
  </g>
);

