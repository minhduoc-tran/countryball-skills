import React from 'react';
import { rnd, Glow, Bokeh, Haze, SCH } from '../../engine';
import { Wisps } from '../tien-vo-han/chb-food-and-family-props';

// Chapter D, "hunger": a food-aid queue seen only from behind (no faces, no suffering shown: people waiting with empty
// bowls), a serving table far away under a lamp, and a stack of empty bowls for the foreground. Pure functions of t.

export type BackLook = { top: string; bottom: string; hair: string; hat?: 'cone' | 'cap' | 'scarf' | null; bowl?: boolean; child?: boolean };

/** A person seen from behind standing on y (feet), x the middle; `s` scales (1 = about 330 tall). Holds an empty bowl at the side. */
export const BackFigure: React.FC<{ x: number; y: number; s?: number; look: BackLook; sway?: number }> = ({ x, y, s = 1, look, sway = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={4} rx={64} ry={11} fill="#000" opacity={0.3} />
    <rect x={-26} y={-136} width={21} height={136} rx={8} fill={look.bottom} />
    <rect x={5} y={-136} width={21} height={136} rx={8} fill={look.bottom} />
    <g transform={`rotate(${sway} 0 -130)`}>
      <path d="M -46 -118 Q -52 -250 0 -262 Q 52 -250 46 -118 Z" fill={look.top} />
      <path d="M -46 -118 Q -52 -250 0 -262 L 0 -118 Z" fill="#000" opacity={0.14} />
      <rect x={-12} y={-282} width={24} height={26} fill="#D9BFA3" />
      <circle cx={0} cy={-304} r={34} fill={look.hair} />
      <ellipse cx={-33} cy={-298} rx={5} ry={9} fill="#D9BFA3" />
      <ellipse cx={33} cy={-298} rx={5} ry={9} fill="#D9BFA3" />
      {look.hat === 'cone' ? <path d="M -78 -318 L 0 -392 L 78 -318 Q 0 -300 -78 -318 Z" fill="#D9B77A" stroke="#8A6A3A" strokeWidth={3} /> : null}
      {look.hat === 'cap' ? <path d="M -36 -316 Q 0 -352 36 -316 Z" fill="#4A5A7A" /> : null}
      {look.hat === 'scarf' ? <path d="M -36 -320 Q 0 -350 36 -320 L 34 -290 Q 0 -310 -34 -290 Z" fill="#B0463A" /> : null}
      <path d="M -46 -236 Q -62 -180 -54 -130" stroke={look.top} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M 46 -236 Q 60 -190 52 -140" stroke={look.top} strokeWidth={22} fill="none" strokeLinecap="round" />
      <circle cx={-54} cy={-126} r={11} fill="#D9BFA3" />
      <circle cx={52} cy={-136} r={11} fill="#D9BFA3" />
      {look.bowl !== false ? (
        <g transform="translate(-68 -126)">
          <path d="M -26 0 H 26 Q 22 26 0 28 Q -22 26 -26 0 Z" fill="#E9E2D2" stroke="#8A8272" strokeWidth={3} />
          <ellipse cx={0} cy={0} rx={26} ry={6} fill="#6A6458" />
        </g>
      ) : null}
    </g>
  </g>
);

/** A small child by the hand of a grown-up: only the back of a head and a small body. */
export const BackChild: React.FC<{ x: number; y: number; s?: number; top: string }> = ({ x, y, s = 1, top }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={3} rx={36} ry={8} fill="#000" opacity={0.28} />
    <rect x={-14} y={-78} width={12} height={78} rx={5} fill="#3A3446" />
    <rect x={3} y={-78} width={12} height={78} rx={5} fill="#3A3446" />
    <path d="M -28 -70 Q -30 -146 0 -152 Q 30 -146 28 -70 Z" fill={top} />
    <circle cx={0} cy={-176} r={24} fill="#2A1C18" />
    <path d="M -24 -168 q -8 22 4 34 M 24 -168 q 8 22 -4 34" stroke="#2A1C18" strokeWidth={9} fill="none" strokeLinecap="round" />
  </g>
);

/** The far serving table: a canopy, a lamp, a big pot with a trickle of steam, a person in an apron (no face). */
export const ServingTable: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-170} r={420} o={0.7} />
    <ellipse cx={0} cy={6} rx={230} ry={16} fill="#000" opacity={0.32} />
    <path d="M -230 -300 L 0 -400 L 230 -300 Z" fill="#B0463A" />
    <path d="M -230 -300 Q -190 -270 -150 -300 Q -110 -270 -70 -300 Q -30 -270 10 -300 Q 50 -270 90 -300 Q 130 -270 170 -300 Q 200 -280 230 -300 Z" fill="#E9D8B8" />
    <rect x={-216} y={-300} width={8} height={300} fill="#5A4636" />
    <rect x={208} y={-300} width={8} height={300} fill="#5A4636" />
    <circle cx={0} cy={-258} r={13} fill="#FFE2A0" />
    <rect x={-210} y={-98} width={420} height={20} fill="#7A5A3A" />
    <rect x={-190} y={-78} width={16} height={78} fill="#5A4026" />
    <rect x={174} y={-78} width={16} height={78} fill="#5A4026" />
    <path d="M -110 -98 L -100 -150 H 20 L 30 -98 Z" fill="#8A8EA0" stroke="#3A3E50" strokeWidth={3} />
    <ellipse cx={-40} cy={-150} rx={60} ry={9} fill="#3A3E50" />
    <Wisps x={-40} y={-162} t={t} s={0.9} n={3} o={0.5} />
    <circle cx={110} cy={-176} r={22} fill="#D9BFA3" />
    <path d="M 78 -98 Q 76 -166 110 -170 Q 144 -166 142 -98 Z" fill="#E9E2D2" />
    {[-150, 60, 110].map((dx, i) => <ellipse key={i} cx={dx + 40} cy={-103} rx={18} ry={5} fill="#E9E2D2" opacity={0.9 - i * 0.1} />)}
  </g>
);

/** A dusk yard behind the queue: sky, haze, a low row of roofs, a bare ground with faint paving lines. */
export const AidYard: React.FC<{ id: string; t: number; groundY?: number }> = ({ id, t, groundY = 700 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#262046" />
        <stop offset="0.6" stopColor="#7A4A6A" />
        <stop offset="1" stopColor="#E3946A" />
      </linearGradient>
      <linearGradient id={`${id}gr`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4A3A44" />
        <stop offset="1" stopColor="#1E1822" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={groundY + 400} fill={`url(#${id}sky)`} />
    <g fill="#2E2248" opacity={0.9}>
      {Array.from({ length: 14 }).map((_, i) => {
        const w = 120 + rnd(5, i) * 160;
        const h = 70 + rnd(6, i) * 170;
        return <rect key={i} x={-300 + i * 190} y={groundY - h} width={w} height={h} />;
      })}
    </g>
    <Haze y={groundY - 20} h={220} o={0.4} />
    <rect x={-400} y={groundY} width={2720} height={800} fill={`url(#${id}gr)`} />
    <rect x={-400} y={groundY} width={2720} height={4} fill="#FFC98A" opacity={0.3} />
    {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${300 + i * 150} ${groundY} L ${-300 + i * 300} 1200`} stroke="#2A2230" strokeWidth={3} opacity={0.6} />)}
    <Bokeh seed={9} n={8} x0={0} y0={groundY - 260} w={1900} h={240} t={t} o={0.12} />
  </g>
);

/** A stack of empty bowls (each a little off true), x the middle of the base. */
export const BowlStack: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 5 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={6} rx={120} ry={14} fill="#000" opacity={0.35} />
    {Array.from({ length: n }).map((_, i) => (
      <g key={i} transform={`translate(${(rnd(3, i) - 0.5) * 12} ${-i * 34})`}>
        <path d="M -104 -70 H 104 Q 96 -4 0 0 Q -96 -4 -104 -70 Z" fill="#E9E2D2" stroke="#8A8272" strokeWidth={4} />
        <path d="M -104 -70 Q -60 -60 -50 -4 Q -100 -8 -104 -70 Z" fill="#000" opacity={0.12} />
        <ellipse cx={0} cy={-70} rx={104} ry={14} fill="#CFC6B2" stroke="#8A8272" strokeWidth={3} />
      </g>
    ))}
  </g>
);

/** An empty bowl as a blueprint line icon (rim, inside, a pair of chopsticks laid across), centred, ~120 wide at s 1. */
export const EmptyBowl: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={SCH.live} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx={0} cy={0} rx={62} ry={13} fill="#101A2A" />
    <path d="M -62 0 Q -58 58 0 64 Q 58 58 62 0" />
    <path d="M -22 72 H 22" />
    <path d="M -34 -44 L 52 -8 M -18 -54 L 68 -18" stroke={SCH.dim} strokeWidth={5} />
  </g>
);
