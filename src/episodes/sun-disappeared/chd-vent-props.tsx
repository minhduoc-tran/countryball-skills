import React from 'react';
import { rnd, Glow } from '../../engine';

// Chapter D local props, part 5: the deep-sea vent scene (black smoker, tube worms, shrimp, marine snow).

/** The deep seabed: a near-black blue gradient, a rocky floor, drifting marine snow. Floor at y = `floor`. */
export const DeepSeabed: React.FC<{ id: string; t: number; floor?: number }> = ({ id, t, floor = 800 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}g`} x1="0" y1="-300" x2="0" y2="1300" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#02060E" /><stop offset="0.7" stopColor="#0A1A2E" /><stop offset="1" stopColor="#10243A" />
      </linearGradient>
    </defs>
    <rect x={-500} y={-400} width={2920} height={1900} fill={`url(#${id}g)`} />
    {Array.from({ length: 70 }).map((_, i) => (
      <circle key={i} cx={-100 + rnd(21, i) * 2120 + Math.sin(t / 30 + i) * 12} cy={((rnd(22, i) * 1300 + t * (0.5 + rnd(23, i))) % 1300) - 200} r={1.6 + rnd(24, i) * 2.6} fill="#CFE6FF" opacity={0.25 + 0.3 * rnd(25, i)} />
    ))}
    <path d={`M -500 ${floor + 40} Q 200 ${floor - 30} 600 ${floor + 10} T 1400 ${floor - 10} T 2420 ${floor + 20} L 2420 1500 L -500 1500 Z`} fill="#14111A" />
    <path d={`M -500 ${floor + 40} Q 200 ${floor - 30} 600 ${floor + 10} T 1400 ${floor - 10} T 2420 ${floor + 20}`} stroke="#3A2A3C" strokeWidth={5} fill="none" />
  </g>
);

/** A black smoker chimney with a dark plume, a hot glow at its mouth. Base centre (x, y). */
export const BlackSmoker: React.FC<{ x: number; y: number; s?: number; t: number; h?: number }> = ({ x, y, s = 1, t, h = 360 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={130} ry={20} fill="#000" opacity={0.5} />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const k = ((t / 110 + i / 6) % 1);
      return <circle key={i} cx={Math.sin(k * 5 + i) * 26 * k} cy={-h - 20 - k * 360} r={18 + k * 70} fill="#1E2434" opacity={0.8 * (1 - k * 0.85)} />;
    })}
    <path d={`M -90 0 L -52 ${-h * 0.45} L -44 ${-h * 0.7} L -30 ${-h} L 28 ${-h + 8} L 40 ${-h * 0.62} L 58 ${-h * 0.3} L 96 0 Z`} fill="#2A202C" stroke="#5A4A5C" strokeWidth={4} strokeLinejoin="round" />
    {[0.2, 0.4, 0.6, 0.8].map((q, i) => <path key={i} d={`M ${-60 + i * 12} ${-h * q} l ${50 + i * 8} ${-6 + i * 4}`} stroke="#4A3A4C" strokeWidth={4} />)}
    <path d={`M 30 0 L 28 ${-h} L 34 ${-h} L 80 0 Z`} fill="#FF6A2A" opacity={0.22} />
    <ellipse cx={0} cy={-h} rx={36} ry={9} fill="#0A0608" />
    <Glow x={0} y={-h} r={150} kind="warm" o={0.6 + 0.1 * Math.sin(t / 6)} />
    <Glow x={0} y={0} r={160} kind="red" o={0.35} />
  </g>
);

/** A clump of tube worms: tapering pale-pink tubes bending in the current, each topped by a feathery red plume. */
export const TubeWorms: React.FC<{ x: number; y: number; s?: number; t: number; n?: number; seed?: number }> = ({ x, y, s = 1, t, n = 9, seed = 5 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }).map((_, i) => {
      const bx = (i - n / 2) * 24 + rnd(seed, i) * 12, hh = 90 + rnd(seed + 1, i) * 110;
      const lean = (rnd(seed + 4, i) - 0.5) * 50, sw = lean + Math.sin(t / 16 + i * 1.7) * 14;
      const tx = bx + sw, ty = -hh;
      const fan = 10 + Math.sin(t / 7 + i) * 3;
      return (
        <g key={i}>
          <path d={`M ${bx - 7} 0 Q ${bx + sw * 0.3 - 5} ${-hh * 0.5} ${tx - 3} ${ty} L ${tx + 3} ${ty} Q ${bx + sw * 0.3 + 5} ${-hh * 0.5} ${bx + 7} 0 Z`} fill="#D8C4C0" stroke="#7A5A5E" strokeWidth={1.5} />
          <path d={`M ${bx + 2} 0 Q ${bx + sw * 0.3 + 3} ${-hh * 0.5} ${tx + 1} ${ty}`} stroke="#F4E8E4" strokeWidth={2} fill="none" opacity={0.6} />
          <g style={{ filter: 'drop-shadow(0 0 7px #FF3A3A)' }} stroke="#E8323C" strokeWidth={4} strokeLinecap="round" fill="none">
            {[-2, -1, 0, 1, 2].map((k) => <path key={k} d={`M ${tx} ${ty} q ${k * fan * 0.5} -22 ${k * fan} -${40 - Math.abs(k) * 6}`} />)}
          </g>
        </g>
      );
    })}
  </g>
);

/** A tiny glowing shrimp, swimming in a lazy loop. */
export const Shrimp: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number }> = ({ x, y, s = 1, t, seed = 1 }) => {
  const px = x + Math.sin(t / 30 + seed) * 40, py = y + Math.cos(t / 24 + seed * 2) * 16;
  const dir = Math.cos(t / 30 + seed) > 0 ? 1 : -1;
  return (
    <g transform={`translate(${px} ${py}) scale(${dir * s} ${s})`}>
      <path d="M -20 4 Q -8 -14 14 -6 Q 24 -2 22 8 Q 4 14 -20 4 Z" fill="#FFD8C8" stroke="#8A4A3A" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 7px #FFB6A0)' }} />
      <path d="M -20 4 L -30 0 L -28 10 Z" fill="#FFB6A0" />
      <path d="M 18 -4 Q 30 -16 40 -14" stroke="#FFD8C8" strokeWidth={1.8} fill="none" />
      <circle cx={16} cy={-1} r={2.2} fill="#14121A" />
      <path d={`M -4 10 l -3 ${6 + Math.sin(t / 3) * 2} M 4 10 l -2 ${6 + Math.sin(t / 3 + 1) * 2}`} stroke="#FFB6A0" strokeWidth={1.8} />
    </g>
  );
};
