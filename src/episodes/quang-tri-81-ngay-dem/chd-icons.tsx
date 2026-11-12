import React from 'react';
import { FONT } from '../../engine/fonts';
import { MuCoi } from '../../countryball/ball-accessories';

// Chapter D icons (all drawn around their own centre; x, y = centre, s = scale, rot = degrees). Flat shapes with an ink outline.
const INK = '#151515';
const tf = (x: number, y: number, s = 1, rot = 0) => `translate(${x},${y}) rotate(${rot}) scale(${s})`;

/** Aerial bomb, nose pointing down at rot 0 (about 24 x 64 px at s = 1). */
export const BombIcon: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; fill?: string }> = ({ x, y, s = 1, rot = 0, o = 1, fill = '#5E6B3A' }) => (
  <g transform={tf(x, y, s, rot)} opacity={o}>
    <path d="M-10,-18 L-16,-34 L16,-34 L10,-18 Z" fill="#3E4A26" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-12,-20 Q-13,22 0,32 Q13,22 12,-20 Z" fill={fill} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
    <rect x={-12} y={-4} width={24} height={6} fill="#E2B95A" opacity={0.9} />
  </g>
);

/** Artillery shell, nose pointing up at rot 0 (about 18 x 52 px at s = 1). */
export const ShellIcon: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number }> = ({ x, y, s = 1, rot = 0, o = 1 }) => (
  <g transform={tf(x, y, s, rot)} opacity={o}>
    <path d="M-9,26 L-9,-6 Q-9,-20 0,-28 Q9,-20 9,-6 L9,26 Z" fill="#B58A3C" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
    <rect x={-9} y={10} width={18} height={6} fill="#7A5A22" stroke={INK} strokeWidth={2} />
    <rect x={-9} y={-4} width={18} height={4} fill="#6E7458" />
  </g>
);

/** Letter envelope with a red-and-blue airmail edge (about 64 x 44 px at s = 1). */
export const EnvelopeIcon: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number }> = ({ x, y, s = 1, rot = 0, o = 1 }) => (
  <g transform={tf(x, y, s, rot)} opacity={o}>
    <rect x={-32} y={-22} width={64} height={44} rx={4} fill="#F4EBD2" stroke={INK} strokeWidth={3.5} />
    <path d="M-32,-20 L0,4 L32,-20" fill="none" stroke="#8A7A58" strokeWidth={3} strokeLinejoin="round" />
    <path d="M-30,20 L-8,2 M30,20 L8,2" stroke="#8A7A58" strokeWidth={2.5} />
    <rect x={14} y={-17} width={13} height={16} fill="#C8322A" stroke={INK} strokeWidth={2} />
  </g>
);

export const SunIcon: React.FC<{ x: number; y: number; s?: number; spin?: number }> = ({ x, y, s = 1, spin = 0 }) => (
  <g transform={tf(x, y, s)}>
    <g transform={`rotate(${spin})`}>
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={-26} x2={0} y2={-36} stroke="#FFD166" strokeWidth={5} strokeLinecap="round" transform={`rotate(${i * 36})`} />)}
    </g>
    <circle r={18} fill="#FFD166" stroke={INK} strokeWidth={3.5} />
  </g>
);

export const MoonIcon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={tf(x, y, s)}>
    <path d="M6,-26 A26,26 0 1 0 22,12 A20,20 0 0 1 6,-26 Z" fill="#C9D6FF" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
  </g>
);

/** A VNM mũ cối with nobody under it: for quiet loss beats. (x, y) = where the helmet rests; r = ball-radius scale. */
export const EmptyHelmet: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 120 }) => (
  <g transform={`translate(${x},${y}) scale(${r}) translate(0,0.1)`}>
    <ellipse cx={0} cy={0.06} rx={0.98} ry={0.1} fill="#000" opacity={0.3} />
    <MuCoi camo />
  </g>
);

/** Small village house with a lit window (about 130 x 110 px at s = 1). */
export const HouseIcon: React.FC<{ x: number; y: number; s?: number; lit?: number }> = ({ x, y, s = 1, lit = 1 }) => (
  <g transform={tf(x, y, s)}>
    <rect x={-52} y={-16} width={104} height={58} fill="#C9B48A" stroke={INK} strokeWidth={4} />
    <path d="M-68,-14 L0,-62 L68,-14 Z" fill="#9C4B35" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-34} y={0} width={30} height={30} fill={lit > 0 ? '#FFD98A' : '#3A3A3A'} stroke={INK} strokeWidth={3} />
    <rect x={12} y={6} width={26} height={36} fill="#6B4A2E" stroke={INK} strokeWidth={3} />
    {lit > 0 && <circle cx={-19} cy={15} r={44} fill="#FFD98A" opacity={0.18 * lit} />}
  </g>
);

/** Closed book (cover with a title band) about 150 x 200 px at s = 1. */
export const BookIcon: React.FC<{ x: number; y: number; s?: number; rot?: number; title?: string }> = ({ x, y, s = 1, rot = 0, title = 'TRẬN ĐÁNH' }) => (
  <g transform={tf(x, y, s, rot)}>
    <rect x={-66} y={-92} width={140} height={190} rx={6} fill="#EDE4CC" stroke={INK} strokeWidth={4} />
    <rect x={-76} y={-100} width={140} height={190} rx={6} fill="#8C2F2A" stroke={INK} strokeWidth={5} />
    <rect x={-76} y={-100} width={20} height={190} rx={4} fill="#6E2420" stroke={INK} strokeWidth={4} />
    <rect x={-44} y={-62} width={96} height={64} rx={4} fill="#E2B95A" opacity={0.92} />
    <text x={4} y={-24} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={17} fill="#3A1410">{title}</text>
    <path d="M-30,30 H44 M-30,48 H30" stroke="#E2B95A" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
  </g>
);

/** Red-cross crate (medical box) carried on the night path; deliberately no person drawn. */
export const MedBox: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={tf(x, y, s)}>
    <rect x={-22} y={-18} width={44} height={36} rx={4} fill="#F4F4F4" stroke={INK} strokeWidth={3.5} />
    <path d="M-4,-12 H4 V-4 H12 V4 H4 V12 H-4 V4 H-12 V-4 H-4 Z" fill="#D8352A" />
  </g>
);

/** Ammunition crate. */
export const AmmoBox: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={tf(x, y, s, rot)}>
    <rect x={-24} y={-16} width={48} height={32} rx={3} fill="#6E7A44" stroke={INK} strokeWidth={3.5} />
    <rect x={-24} y={-4} width={48} height={5} fill="#E2B95A" opacity={0.85} />
    <circle cx={-14} cy={8} r={3} fill={INK} /><circle cx={14} cy={8} r={3} fill={INK} />
  </g>
);
