import React from 'react';
import { Look, LOOKS, FONT } from '../../engine';

// Chapter A local props for the convenience store: the shop owner's look, a carton of milk, the counter seen from the
// front (wooden, with a till and a scanner) and a front-walking pose helper.

/** The shop owner / cashier: the suit man without the jacket (a blue work shirt and apron colours). */
export const OWNER: Look = { ...LOOKS.suit, jacket: '#4C8CA8', jacketShade: '#3A6E86', accent: '#F2D58A', limb: '#4C8CA8', extra: undefined, hair: '#1F1A22' };

const INK = '#14101C';

/** A gable-top milk carton, base centred on (x, y), 64 units tall at s = 1; `rot` tips it about its base. */
export const MilkCarton: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={26} ry={4} fill="#000" opacity={0.22} />
    <path d="M -22 0 L -22 -50 L 22 -50 L 22 0 Z" fill="#F4F1EA" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <path d="M -22 -50 L -12 -70 L 12 -70 L 22 -50 Z" fill="#DDE6F0" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <path d="M -12 -70 L 12 -70 L 12 -76 L -12 -76 Z" fill="#C9D4E2" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    <rect x={-22} y={-34} width={44} height={16} fill="#3E7CC4" />
    <circle cx={0} cy={-26} r={7} fill="#F4F1EA" />
    <path d="M -22 -50 L -22 0" stroke="#FFFFFF" strokeWidth={3} opacity={0.6} />
    <path d="M 22 -50 L 22 0 L 10 0 L 10 -50 Z" fill="#000" opacity={0.1} />
  </g>
);

/** The counter from the front: a slab on a panel, with a till, a scanner and a jar of sweets. Top surface at `top`. */
export const CounterFront: React.FC<{ x0: number; x1: number; top: number; id: string }> = ({ x0, x1, top, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}wood`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8A5A3A" /><stop offset="1" stopColor="#5E3C28" />
      </linearGradient>
    </defs>
    <rect x={x0} y={top} width={x1 - x0} height={300} fill={`url(#${id}wood)`} stroke={INK} strokeWidth={4} />
    <rect x={x0 - 14} y={top - 16} width={x1 - x0 + 28} height={22} rx={5} fill="#B98C5E" stroke={INK} strokeWidth={4} />
    <path d={`M ${x0 - 8} ${top - 12} L ${x1 + 8} ${top - 12}`} stroke="#FFD9A0" strokeWidth={3} opacity={0.5} />
    {[0.2, 0.5, 0.8].map((k) => <rect key={k} x={x0 + (x1 - x0) * k - 60} y={top + 56} width={120} height={150} rx={6} fill="none" stroke="#3E281C" strokeWidth={4} opacity={0.7} />)}
    {/* the till and its screen */}
    <g transform={`translate(${x0 + 150} ${top - 16})`}>
      <rect x={-52} y={-48} width={104} height={48} rx={6} fill="#2C303C" stroke={INK} strokeWidth={3} />
      <rect x={-34} y={-104} width={68} height={50} rx={5} fill="#2C303C" stroke={INK} strokeWidth={3} />
      <rect x={-28} y={-98} width={56} height={38} rx={3} fill="#7FE0C8" />
      <text x={0} y={-71} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#0A4A3E">0</text>
      <rect x={-52} y={-22} width={104} height={6} fill="#3A3F4C" />
    </g>
    {/* a scanner gun on its stand and a jar of sweets */}
    <g transform={`translate(${x0 + 330} ${top - 16})`}>
      <rect x={-18} y={-12} width={36} height={12} rx={3} fill="#2C303C" />
      <path d="M -6 -12 L -6 -46 Q -6 -64 14 -64 L 34 -64 L 34 -48 L 8 -48 L 8 -12 Z" fill="#E4572E" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M 26 -62 L 54 -62" stroke="#FF8A6A" strokeWidth={3} opacity={0.8} />
    </g>
    <g transform={`translate(${x1 - 120} ${top - 16})`}>
      <path d="M -26 0 L -26 -70 Q -26 -80 -14 -80 L 14 -80 Q 26 -80 26 -70 L 26 0 Z" fill="#CFE3EE" opacity={0.6} stroke={INK} strokeWidth={3} />
      {[[-12, -14, '#E4572E'], [10, -18, '#F6B93B'], [-4, -34, '#58B368'], [12, -40, '#E86AA6'], [-14, -52, '#3E9BD6']].map(([cx, cy, c], i) => <circle key={i} cx={cx as number} cy={cy as number} r={9} fill={c as string} />)}
      <rect x={-20} y={-90} width={40} height={10} rx={3} fill="#D94452" stroke={INK} strokeWidth={2.5} />
    </g>
  </g>
);
