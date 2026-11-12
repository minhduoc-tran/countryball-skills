import React from 'react';
import { SCH, FONT, clamp, backOut, rnd } from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';

// Chapter D, "the cost: the planet": a spinning Earth, the stamp that says it is real, and the cream line icons of
// an average American's stuff (house, car, plane, TV, bag) drawn on the schematic ground.

const INK = '#1D2033';
const W = 400; // one strip of continents, in Earth units (the globe is 200 wide)
const LAND = [
  'M 20 -50 Q 60 -80 100 -50 Q 130 -30 110 0 Q 80 20 90 50 Q 60 70 40 40 Q 10 20 20 -10 Z',
  'M 170 -70 Q 220 -90 250 -60 Q 280 -30 250 0 Q 230 40 200 20 Q 170 0 180 -30 Z',
  'M 290 10 Q 330 -10 360 20 Q 380 50 350 70 Q 310 80 290 50 Z',
  'M 140 40 Q 170 30 190 60 Q 170 90 140 70 Z',
];

/** The Earth: ocean, drifting continents (a looping strip), a dark crescent and an atmosphere glow. Centre x y, radius r. */
export const Earth: React.FC<{ x: number; y: number; r: number; t: number; id: string; o?: number }> = ({ x, y, r, t, id, o = 1 }) => {
  const k = r / 100;
  const off = (t * 0.9) % W;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <defs>
        <clipPath id={`${id}clip`}><circle r={r} /></clipPath>
        <radialGradient id={`${id}sea`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#6CC0F2" />
          <stop offset="70%" stopColor="#2B78C8" />
          <stop offset="100%" stopColor="#1B4E96" />
        </radialGradient>
        <radialGradient id={`${id}shade`} cx="0.3" cy="0.3" r="0.85">
          <stop offset="55%" stopColor="#0A1030" stopOpacity={0} />
          <stop offset="100%" stopColor="#0A1030" stopOpacity={0.6} />
        </radialGradient>
        <radialGradient id={`${id}atm`}>
          <stop offset="80%" stopColor="#8FD0FF" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#8FD0FF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle r={r * 1.22} fill={`url(#${id}atm)`} />
      <circle r={r} fill={`url(#${id}sea)`} />
      <g clipPath={`url(#${id}clip)`}>
        {[-1, 0, 1].map((m) => (
          <g key={m} transform={`translate(${(-100 + m * W - off) * k + W * k * 0.5} 0) scale(${k})`}>
            {LAND.map((d, i) => <path key={i} d={d} fill={i % 2 ? '#5DBB63' : '#43A55A'} stroke="#2A7A40" strokeWidth={3} />)}
          </g>
        ))}
        <circle r={r} fill={`url(#${id}shade)`} />
        <ellipse cx={-r * 0.35} cy={-r * 0.45} rx={r * 0.28} ry={r * 0.12} fill="#fff" opacity={0.25} transform={`rotate(-30 ${-r * 0.35} ${-r * 0.45})`} />
      </g>
      <circle r={r} fill="none" stroke="#0F2A5C" strokeWidth={Math.max(3, r * 0.03)} />
    </g>
  );
};

/** A rubber stamp: a tilted rounded frame with a word and a tick, slamming in at t = 0. */
export const Stamp: React.FC<{ x: number; y: number; t: number; text: string; sub?: string; color?: string; rot?: number; s?: number }> = ({ x, y, t, text, sub, color = '#2FBF71', rot = -8, s = 1 }) => {
  if (t < 0) return null;
  const k = 1 + Math.max(0, 1 - t / 5) * 1.2;
  const o = clamp(t / 3);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k * s})`} opacity={o}>
      <rect x={-250} y={-86} width={500} height={172} rx={26} fill="#0B1226" fillOpacity={0.6} stroke={color} strokeWidth={10} />
      <rect x={-234} y={-70} width={468} height={140} rx={16} fill="none" stroke={color} strokeWidth={3} />
      <text x={-20} y={sub ? 24 : 36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={104} fill={color} letterSpacing={4}>{text}</text>
      <path d="M 170 4 l 28 32 l 56 -72" transform="translate(-30 0)" stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {sub ? (
        <g>
          <rect x={-190} y={92} width={380} height={40} rx={20} fill="#0B1226" opacity={0.9} />
          <text x={0} y={120} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill={SCH.line} letterSpacing={2}>{sub}</text>
        </g>
      ) : null}
    </g>
  );
};

export type StuffKind = 'house' | 'car' | 'plane' | 'tv' | 'bag';
const STUFF: Record<StuffKind, string[]> = {
  house: ['M -56 14 L 0 -44 L 56 14', 'M -42 6 V 62 H 42 V 6', 'M -12 62 V 26 H 12 V 62'],
  car: ['M -78 44 V 12 Q -74 -2 -52 -4 L -32 -36 H 32 L 52 -4 Q 76 -2 78 12 V 44 Z', 'M -30 -30 L -42 -4 H 42 L 30 -30 Z', 'M -50 44 a 16 16 0 1 0 0.1 0 M 50 44 a 16 16 0 1 0 0.1 0'],
  plane: ['M 0 -70 L 8 -22 L 64 10 V 26 L 8 12 L 8 46 L 30 60 V 70 L 0 62 L -30 70 V 60 L -8 46 V 12 L -64 26 V 10 L -8 -22 Z'],
  tv: ['M -64 -34 H 64 V 40 H -64 Z', 'M -50 -22 H 50 V 28 H -50 Z', 'M -30 40 L -38 60 H 38 L 30 40', 'M -20 -34 L -40 -62 M 20 -34 L 40 -62'],
  bag: ['M -44 -16 H 44 L 52 60 H -52 Z', 'M -24 -16 V -34 Q 0 -56 24 -34 V -16'],
};

/** A cream line icon of an average American's stuff; pops in at t = 0 and glows orange. ~140 wide. */
export const StuffIcon: React.FC<{ x: number; y: number; t: number; kind: StuffKind; s?: number }> = ({ x, y, t, kind, s = 1.4 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`} stroke={SCH.line} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${SCH.glow}88)` }}>
      <circle r={86} fill="#14203A" stroke={SCH.dim} strokeWidth={3} />
      {STUFF[kind].map((d, i) => <path key={i} d={d} stroke={SCH.live} />)}
    </g>
  );
};

/** A crowd of person icons on a grid: `lit` 0..1 sweeps orange across it diagonally (the world's population). */
export const Crowd: React.FC<{ lit: number; cols?: number; rows?: number; gap?: number; x0?: number; y0?: number; s?: number }> = ({
  lit, cols = 14, rows = 6, gap = 138, x0 = 960, y0 = 540, s = 1.1,
}) => (
  <g>
    {Array.from({ length: cols * rows }).map((_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const q = (c / cols + r / rows * 0.6 + rnd(2, i) * 0.12) / 1.72;
      return <PersonIcon key={i} x={x0 + (c - (cols - 1) / 2) * gap} y={y0 + (r - (rows - 1) / 2) * gap * 1.05} s={s} on={lit > q} o={0.75} />;
    })}
  </g>
);
