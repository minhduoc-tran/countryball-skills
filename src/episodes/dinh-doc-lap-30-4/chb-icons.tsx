import React from 'react';
import { FlagCloth } from '../../countryball/flag-cloth';

// Chapter B icons (screen px, drawn around (x, y) = ground / waterline centre). Plain flat silhouettes with an ink outline:
// top-down tiny vehicles for the columns on the map, side views for the "bằng mọi phương tiện" tiles, a refugee-ship top view.
const INK = '#151515';
const sw = (s: number) => Math.max(1.4, s * 0.05);

export type VehKind = 'truck' | 'jeep' | 'civ' | 'cart' | 'bike';
const VEH: Record<VehKind, { body: string; top: string; w: number; h: number }> = {
  truck: { body: '#6B7440', top: '#8C9658', w: 2.6, h: 1.1 },   // army truck (olive)
  jeep: { body: '#7A8450', top: '#9BA46A', w: 1.7, h: 0.9 },
  civ: { body: '#D9D2C2', top: '#EFE9DA', w: 2.0, h: 1.0 },     // civilian bus / van (light)
  cart: { body: '#B98A52', top: '#D2A56C', w: 1.5, h: 0.9 },    // loaded cart
  bike: { body: '#C9CDD2', top: '#E6E8EA', w: 1.0, h: 0.5 },
};
/** Top-down vehicle, `s` = unit size px; heading degrees (0 = east). */
export const Veh: React.FC<{ x: number; y: number; heading?: number; s?: number; kind?: VehKind }> = ({ x, y, heading = 0, s = 14, kind = 'truck' }) => {
  const v = VEH[kind], w = v.w * s, h = v.h * s;
  return (
    <g transform={`translate(${x},${y}) rotate(${heading})`} strokeLinejoin="round">
      <rect x={-w / 2 + 2} y={-h / 2 + 3} width={w} height={h} rx={h * 0.2} fill="#000" opacity={0.25} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.2} fill={v.body} stroke={INK} strokeWidth={sw(s)} />
      <rect x={-w / 2 + w * 0.08} y={-h / 2 + h * 0.14} width={w * 0.58} height={h * 0.72} rx={h * 0.1} fill={v.top} />
      {kind !== 'bike' && <rect x={w * 0.2} y={-h / 2 + h * 0.18} width={w * 0.22} height={h * 0.64} fill="#2B3A44" opacity={0.85} />}
    </g>
  );
};

/** Army truck, side view, facing right. */
export const TruckSide: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = '#6B7440' }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx={0} cy={4} rx={150} ry={12} fill="#000" opacity={0.28} />
    <path d="M-150,-22 L-150,-130 Q-150,-140 -138,-140 L28,-140 L28,-22 Z" fill="#9A9062" stroke={INK} strokeWidth={6} />
    <path d="M-150,-130 Q-80,-190 28,-140" fill="#B7AD7E" stroke={INK} strokeWidth={6} />
    <path d="M36,-22 L36,-110 L84,-110 L116,-72 L136,-66 L136,-22 Z" fill={color} stroke={INK} strokeWidth={6} />
    <path d="M52,-100 L84,-100 L106,-72 L52,-72 Z" fill="#2B3A44" stroke={INK} strokeWidth={4} />
    {[-100, -20, 92].map((cx) => <g key={cx}><circle cx={cx} cy={-16} r={28} fill="#222" stroke={INK} strokeWidth={5} /><circle cx={cx} cy={-16} r={11} fill="#8A8F94" /></g>)}
  </g>
);

/** Jeep with a small PRG flag on the antenna (a captured vehicle in the hands of the Quân Giải phóng), side view, facing right. */
export const JeepSide: React.FC<{ x: number; y: number; s?: number; t?: number; id: string }> = ({ x, y, s = 1, t = 0, id }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx={0} cy={4} rx={105} ry={10} fill="#000" opacity={0.28} />
    <path d="M-100,-24 L-100,-70 L-46,-70 L-40,-108 L22,-108 L30,-70 L100,-66 L100,-24 Z" fill="#8A8A64" stroke={INK} strokeWidth={6} />
    <path d="M-34,-100 L16,-100 L22,-72 L-38,-72 Z" fill="#2B3A44" stroke={INK} strokeWidth={4} />
    {[-62, 62].map((cx) => <g key={cx}><circle cx={cx} cy={-18} r={25} fill="#222" stroke={INK} strokeWidth={5} /><circle cx={cx} cy={-18} r={9} fill="#8A8F94" /></g>)}
    <line x1={-92} y1={-70} x2={-92} y2={-176} stroke={INK} strokeWidth={4} />
    <FlagCloth id={`${id}-fl`} x={-90} y={-176} w={58} h={38} kind="PRG" wave={0.7} t={t} />
  </g>
);

/** Cargo ship, side view, facing right (for the "tàu thủy" tile). */
export const ShipSide: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y + Math.sin(t * 0.08) * 3 * s}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
    <path d="M-190,-56 L180,-56 L140,0 L-150,0 Z" fill="#33475B" stroke={INK} strokeWidth={6} />
    <rect x={-190} y={-62} width={370} height={10} fill="#C9343A" stroke={INK} strokeWidth={4} />
    <rect x={-40} y={-124} width={120} height={64} fill="#E8E4D6" stroke={INK} strokeWidth={5} />
    <rect x={-20} y={-168} width={80} height={46} fill="#E8E4D6" stroke={INK} strokeWidth={5} />
    <rect x={-6} y={-208} width={34} height={42} fill="#B3262B" stroke={INK} strokeWidth={5} />
    {[-170, -120, 100, 150].map((cx) => <line key={cx} x1={cx} y1={-62} x2={cx + 12} y2={-130} stroke={INK} strokeWidth={5} />)}
    {[-150, 120].map((cx) => <rect key={cx} x={cx - 30} y={-84} width={60} height={26} fill="#8A6E48" stroke={INK} strokeWidth={4} />)}
  </g>
);

/** Refugee / cargo ship, top-down, bow to the +x side (heading degrees, 0 = east). Dotted deck = people (tiny dots only). */
export const ShipTop: React.FC<{ x: number; y: number; heading?: number; s?: number; t?: number }> = ({ x, y, heading = 0, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${heading}) scale(${s})`} strokeLinejoin="round">
    <path d={`M-130,-26 L70,-26 Q130,-12 140,0 Q130,12 70,26 L-130,26 Z`} fill="#3D5167" stroke={INK} strokeWidth={5} />
    <path d="M-124,-20 L66,-20 Q112,-9 122,0 Q112,9 66,20 L-124,20 Z" fill="#8F8A7C" />
    {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={-112 + (i % 13) * 14} cy={i < 13 ? -9 : 9} r={3.1} fill="#E8DFC8" opacity={0.85} />)}
    <rect x={-26} y={-14} width={46} height={28} fill="#E8E4D6" stroke={INK} strokeWidth={4} />
    <rect x={-8} y={-9} width={14} height={18} fill="#B3262B" />
    <path d={`M-130,0 L-190,${Math.sin(t * 0.1) * 3}`} stroke="#DDE8F2" strokeWidth={10} opacity={0.3} strokeLinecap="round" />
  </g>
);
