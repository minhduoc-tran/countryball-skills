import React from 'react';
import { WallTexture, rnd, FONT } from '../../engine';

// The little sister's room (local to chapter E): a star-print wall, a skirting board, a small bed seen side-on, and
// the crayon drawings taped to the wall. `day` is the warm remembered version (the quarrel); night is the lit-by-
// candle present. Everything is drawn flat with a darker side away from the light, as the engine does.

const PAL = {
  night: { wall: '#2E2640', star: '#43375A', floor: '#2A2030', skirt: '#3C3050', blanket: '#8A4A66', blanketLine: '#A65E7E', mattress: '#4A3E66', frame: '#3A2C3A', pillow: '#CFC4D6' },
  day: { wall: '#C99AA6', star: '#E0B4BC', floor: '#A9805E', skirt: '#E6D6C6', blanket: '#E486A0', blanketLine: '#F2A8BC', mattress: '#9A7AB0', frame: '#8A5E4A', pillow: '#F6EEE6' },
};

export const SisterWall: React.FC<{ day?: boolean; floorY?: number; x0?: number; x1?: number }> = ({ day = false, floorY = 880, x0 = -400, x1 = 2320 }) => {
  const c = day ? PAL.day : PAL.night;
  return (
    <g>
      <rect x={x0} y={-400} width={x1 - x0} height={floorY + 400} fill={c.wall} />
      {Array.from({ length: 90 }).map((_, i) => (
        <path key={i} d={`M ${x0 + 60 + (i % 15) * 190 + (Math.floor(i / 15) % 2) * 95} ${40 + Math.floor(i / 15) * 130} l 7 -7 l 7 7 l -7 7 Z`} fill={c.star} />
      ))}
      <WallTexture rect={[x0, -400, x1 - x0, floorY + 400]} />
      <rect x={x0} y={floorY - 30} width={x1 - x0} height={30} fill={c.skirt} />
      <rect x={x0} y={floorY - 30} width={x1 - x0} height={4} fill="#FFFFFF" opacity={0.18} />
      <rect x={x0} y={floorY} width={x1 - x0} height={900} fill={c.floor} />
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={`M ${x0 + i * 220} ${floorY} L ${x0 + i * 220 - 120} 1500`} stroke="#000" strokeWidth={3} opacity={0.18} />
      ))}
    </g>
  );
};

/** A small bed seen side-on: a headboard on the right, a mattress with a blanket and a pillow; top is the mattress top. */
export const SisterBed: React.FC<{ x0: number; x1: number; top: number; floorY?: number; day?: boolean }> = ({ x0, x1, top, floorY = 880, day = false }) => {
  const c = day ? PAL.day : PAL.night;
  return (
    <g>
      <ellipse cx={(x0 + x1) / 2} cy={floorY + 8} rx={(x1 - x0) / 2 + 30} ry={16} fill="#000" opacity={0.35} />
      <rect x={x0 + 14} y={top + 70} width={26} height={floorY - top - 70} fill={c.frame} />
      <rect x={x1 - 40} y={top - 190} width={30} height={floorY - top + 190} fill={c.frame} />
      <path d={`M ${x1 - 40} ${top - 190} Q ${x1 - 25} ${top - 230} ${x1 - 10} ${top - 190} Z`} fill={c.frame} />
      <rect x={x0} y={top + 6} width={x1 - x0 - 10} height={74} rx={12} fill={c.frame} />
      <rect x={x0} y={top - 40} width={x1 - x0 - 40} height={52} rx={14} fill={c.mattress} />
      <path d={`M ${x0} ${top - 10} Q ${(x0 + x1) / 2} ${top - 52} ${x1 - 44} ${top - 22} L ${x1 - 44} ${top + 22} L ${x0} ${top + 30} Z`} fill={c.blanket} />
      {[0.2, 0.4, 0.6, 0.8].map((k, i) => (
        <path key={i} d={`M ${x0 + (x1 - x0) * k} ${top - 36} L ${x0 + (x1 - x0) * k - 6} ${top + 28}`} stroke={c.blanketLine} strokeWidth={5} opacity={0.7} />
      ))}
      <path d={`M ${x1 - 230} ${top - 36} Q ${x1 - 190} ${top - 100} ${x1 - 100} ${top - 80} Q ${x1 - 70} ${top - 60} ${x1 - 60} ${top - 30} Z`} fill={c.pillow} />
      <path d={`M ${x1 - 215} ${top - 50} Q ${x1 - 180} ${top - 90} ${x1 - 120} ${top - 82}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.4} />
      <rect x={x0} y={top - 40} width={x1 - x0 - 40} height={3} fill="#FFC98A" opacity={0.4} />
    </g>
  );
};

// ---------- crayon drawings ----------
const COL = { red: '#E0463E', blue: '#3A78D4', yellow: '#F2C230', green: '#4BAE5A', orange: '#F08A32', pink: '#E8639E', brown: '#8A5A3A', purple: '#8A58C8' };
type Stroke = { d: string; c: string; w?: number; fill?: string };

/** One stick figure in crayon: head, body, arms (reaching sideways when `reach`), legs; a triangle dress for `girl`. */
const stick = (x: number, y: number, h: number, c: string, girl = false, reach = 0): Stroke[] => {
  const r = h * 0.14;
  const neck = y + r * 2;
  const hip = y + h * 0.62;
  const out: Stroke[] = [
    { d: `M ${x - r} ${y + r} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`, c },
    { d: `M ${x} ${neck} L ${x} ${hip}`, c },
    { d: `M ${x} ${neck + 8} L ${x - h * 0.24 * (1 + reach)} ${neck + h * 0.2} M ${x} ${neck + 8} L ${x + h * 0.24 * (1 + reach)} ${neck + h * 0.2}`, c },
    { d: `M ${x} ${hip} L ${x - h * 0.16} ${y + h} M ${x} ${hip} L ${x + h * 0.16} ${y + h}`, c },
  ];
  if (girl) out.push({ d: `M ${x} ${neck + h * 0.1} L ${x - h * 0.2} ${hip + 6} L ${x + h * 0.2} ${hip + 6} Z`, c, fill: `${c}55` });
  return out;
};
const heart = (x: number, y: number, s: number, c: string): Stroke => ({
  d: `M ${x} ${y + s * 0.7} C ${x - s * 1.3} ${y - s * 0.1} ${x - s * 0.5} ${y - s * 1.0} ${x} ${y - s * 0.3} C ${x + s * 0.5} ${y - s * 1.0} ${x + s * 1.3} ${y - s * 0.1} ${x} ${y + s * 0.7} Z`, c, fill: `${c}66`,
});
const sun = (x: number, y: number, r: number): Stroke[] => [
  { d: `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`, c: COL.yellow, fill: `${COL.yellow}77` },
  ...Array.from({ length: 8 }).map((_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return { d: `M ${x + Math.cos(a) * (r + 8)} ${y + Math.sin(a) * (r + 8)} L ${x + Math.cos(a) * (r + 24)} ${y + Math.sin(a) * (r + 24)}`, c: COL.orange };
  }),
];
const house = (x: number, y: number, w: number): Stroke[] => [
  { d: `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y - w * 0.7} L ${x} ${y - w * 0.7} Z`, c: COL.brown, fill: `${COL.orange}55` },
  { d: `M ${x - 10} ${y - w * 0.7} L ${x + w / 2} ${y - w * 1.2} L ${x + w + 10} ${y - w * 0.7} Z`, c: COL.red, fill: `${COL.red}66` },
  { d: `M ${x + w * 0.4} ${y} L ${x + w * 0.4} ${y - w * 0.4} L ${x + w * 0.65} ${y - w * 0.4} L ${x + w * 0.65} ${y}`, c: COL.brown },
  { d: `M ${x + w * 0.1} ${y - w * 0.5} h ${w * 0.18} v ${w * 0.16} h ${-w * 0.18} Z`, c: COL.blue },
];
const cat = (x: number, y: number, s: number): Stroke[] => [
  { d: `M ${x - 40 * s} ${y} Q ${x - 50 * s} ${y - 50 * s} ${x} ${y - 52 * s} Q ${x + 50 * s} ${y - 50 * s} ${x + 40 * s} ${y} Z`, c: COL.orange, fill: `${COL.orange}66` },
  { d: `M ${x - 32 * s} ${y - 48 * s} L ${x - 38 * s} ${y - 80 * s} L ${x - 14 * s} ${y - 58 * s} M ${x + 32 * s} ${y - 48 * s} L ${x + 38 * s} ${y - 80 * s} L ${x + 14 * s} ${y - 58 * s}`, c: COL.orange },
  { d: `M ${x - 20 * s} ${y - 30 * s} l 2 0 M ${x + 20 * s} ${y - 30 * s} l 2 0`, c: COL.brown, w: 8 },
  { d: `M ${x + 40 * s} ${y - 6 * s} Q ${x + 80 * s} ${y - 30 * s} ${x + 70 * s} ${y - 70 * s}`, c: COL.orange },
  { d: `M ${x - 52 * s} ${y - 20 * s} l -22 -6 M ${x - 52 * s} ${y - 12 * s} l -22 4`, c: COL.brown, w: 3 },
];

export type CrayonKind = 'family' | 'house' | 'cat' | 'hearts' | 'sun';
const content = (kind: CrayonKind, w: number, h: number): Stroke[] => {
  switch (kind) {
    case 'family':
      return [
        ...stick(w * 0.2, h * 0.32, h * 0.38, COL.blue),
        ...stick(w * 0.4, h * 0.32, h * 0.38, COL.pink, true),
        ...stick(w * 0.6, h * 0.44, h * 0.26, COL.green),
        ...stick(w * 0.8, h * 0.48, h * 0.22, COL.purple, true),
        ...sun(w * 0.82, h * 0.14, h * 0.07),
        { d: `M ${w * 0.06} ${h * 0.84} Q ${w * 0.5} ${h * 0.8} ${w * 0.94} ${h * 0.84}`, c: COL.green, w: 8 },
        heart(w * 0.5, h * 0.1, h * 0.04, COL.red),
      ];
    case 'house':
      return [...house(w * 0.22, h * 0.8, w * 0.52), ...sun(w * 0.2, h * 0.16, h * 0.07), { d: `M ${w * 0.05} ${h * 0.8} L ${w * 0.95} ${h * 0.8}`, c: COL.green, w: 8 }];
    case 'cat':
      return [...cat(w * 0.45, h * 0.7, w / 190), heart(w * 0.8, h * 0.2, h * 0.05, COL.pink)];
    case 'hearts':
      return [heart(w * 0.3, h * 0.3, h * 0.12, COL.red), heart(w * 0.66, h * 0.44, h * 0.16, COL.pink), heart(w * 0.4, h * 0.72, h * 0.08, COL.purple)];
    default:
      return sun(w * 0.5, h * 0.4, h * 0.16);
  }
};

/** A sheet of paper taped to the wall (x, y its top centre), with a crayon drawing on it; `seed` wobbles the strokes. */
export const CrayonSheet: React.FC<{ x: number; y: number; w?: number; h?: number; rot?: number; kind: CrayonKind; paper?: string; seed?: number }> = ({
  x, y, w = 300, h = 400, rot = 0, kind, paper = '#F4EEDC', seed = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 6} y={8} width={w} height={h} fill="#000" opacity={0.32} />
    <rect x={-w / 2} y={0} width={w} height={h} fill={paper} />
    <rect x={-w / 2} y={h - 14} width={w} height={14} fill="#000" opacity={0.08} />
    <g transform={`translate(${-w / 2} 0)`} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {content(kind, w, h).map((s, i) => (
        <g key={i} transform={`translate(${(rnd(seed, i) - 0.5) * 3} ${(rnd(seed + 1, i) - 0.5) * 3})`}>
          <path d={s.d} stroke={s.c} strokeWidth={s.w ?? 5} fill={s.fill ?? 'none'} opacity={0.92} />
        </g>
      ))}
    </g>
    {/* two pieces of tape, askew */}
    <rect x={-w / 2 - 12} y={-8} width={50} height={22} fill="#EADFA8" opacity={0.75} transform={`rotate(-34 ${-w / 2} 0)`} />
    <rect x={w / 2 - 38} y={-8} width={50} height={22} fill="#EADFA8" opacity={0.75} transform={`rotate(34 ${w / 2} 0)`} />
  </g>
);

/** The sign on her door, in crayon: PHÒNG CỦA EM with a star and a heart, on a sheet hanging from a ribbon. */
export const DoorSign: React.FC<{ x: number; y: number; w?: number; swing?: number }> = ({ x, y, w = 360, swing = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${swing})`}>
    <path d={`M ${-w * 0.22} 0 L 0 -70 L ${w * 0.22} 0`} stroke="#E8639E" strokeWidth={7} fill="none" strokeLinecap="round" />
    <rect x={-w / 2 + 8} y={10} width={w} height={w * 0.42} rx={14} fill="#000" opacity={0.3} />
    <rect x={-w / 2} y={0} width={w} height={w * 0.42} rx={14} fill="#F6F0E0" />
    <rect x={-w / 2} y={0} width={w} height={w * 0.42} rx={14} fill="none" stroke="#E0463E" strokeWidth={6} strokeDasharray="22 14" strokeLinecap="round" />
    <text x={0} y={w * 0.2} textAnchor="middle" fontFamily={FONT.hand} fontSize={w * 0.17} fill="#3A78D4" fontWeight={700}>PHÒNG</text>
    <text x={0} y={w * 0.36} textAnchor="middle" fontFamily={FONT.hand} fontSize={w * 0.17} fill="#E0463E" fontWeight={700}>CỦA EM</text>
    <path d={`M ${-w * 0.4} ${w * 0.12} l 7 14 l 15 2 l -11 11 l 3 15 l -14 -8 l -14 8 l 3 -15 l -11 -11 l 15 -2 Z`} fill="#F2C230" stroke="#F08A32" strokeWidth={3} transform="scale(0.8) translate(-60 0)" />
  </g>
);
