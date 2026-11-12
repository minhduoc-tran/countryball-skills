import React from 'react';
import { rnd, Glow, mixHex, FONT } from '../../engine';
import { MilkyWay } from './chc-sky-and-people-props';
import { FrostPane } from './chc-cold-science-props';

// Chapter C: Pip's bedroom wall with the big window onto the black noon sky. A warm lamp (the power is still on),
// a wall clock at 12:00, a radiator, a plant on the sill. `frost` 0..1 grows ice on the glass. One layout for every
// window shot, so they match: window pane 700-1220 x 190-700, floor line at y 930.

export const WIN = { x0: 700, x1: 1220, y0: 190, y1: 700 };
export const FLOOR_Y = 930;

export const WindowRoom: React.FC<{ t: number; id: string; frost?: number }> = ({ t, id, frost = 0 }) => {
  const { x0, x1, y0, y1 } = WIN;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#262C4A" />
          <stop offset="1" stopColor="#1A1E36" />
        </linearGradient>
        <clipPath id={`${id}pane`}><rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} /></clipPath>
        <radialGradient id={`${id}lamp`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFC27A" stopOpacity={0.6} />
          <stop offset="1" stopColor="#FFC27A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-400} y={-300} width={2720} height={FLOOR_Y + 300} fill={`url(#${id}wall)`} />
      {/* the night outside: black sky, stars, the Milky Way, the lit city at the bottom of the pane */}
      <g clipPath={`url(#${id}pane)`}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#060A1C" />
        {Array.from({ length: 70 }).map((_, i) => (
          <circle key={i} cx={x0 + rnd(5, i) * (x1 - x0)} cy={y0 + rnd(6, i) * (y1 - y0) * 0.85} r={0.9 + rnd(7, i) * 1.8} fill="#EAF0FF" opacity={0.35 + 0.5 * Math.abs(Math.sin(t / (8 + rnd(8, i) * 9) + i))} />
        ))}
        <MilkyWay t={t} id={`${id}mw`} cx={960} cy={330} rot={-24} len={620} w={150} o={0.7} stars={60} seed={9} />
        <path d={`M ${x0} ${y1} L ${x0} ${y1 - 90} L ${x0 + 60} ${y1 - 90} L ${x0 + 60} ${y1 - 140} L ${x0 + 130} ${y1 - 140} L ${x0 + 130} ${y1 - 70} L ${x0 + 220} ${y1 - 70} L ${x0 + 220} ${y1 - 170} L ${x0 + 290} ${y1 - 170} L ${x0 + 290} ${y1 - 100} L ${x0 + 380} ${y1 - 100} L ${x0 + 380} ${y1 - 130} L ${x1} ${y1 - 130} L ${x1} ${y1} Z`} fill="#0C0A1C" />
        {Array.from({ length: 22 }).map((_, i) => (
          <rect key={i} x={x0 + 14 + rnd(15, i) * (x1 - x0 - 28)} y={y1 - 20 - rnd(16, i) * 110} width={9} height={12} fill={mixHex('#FFC27A', '#9FC0FF', rnd(17, i))} opacity={0.75} />
        ))}
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#9FC0FF" opacity={0.04} />
      </g>
      {frost > 0 ? <FrostPane x0={x0} y0={y0} x1={x1} y1={y1} p={frost} id={`${id}fr`} /> : null}
      {/* frame, muntins, sill */}
      <rect x={x0 - 18} y={y0 - 18} width={x1 - x0 + 36} height={y1 - y0 + 36} fill="none" stroke="#3A3E5E" strokeWidth={22} />
      <path d={`M ${(x0 + x1) / 2} ${y0} L ${(x0 + x1) / 2} ${y1} M ${x0} ${(y0 + y1) / 2} L ${x1} ${(y0 + y1) / 2}`} stroke="#3A3E5E" strokeWidth={12} />
      <rect x={x0 - 50} y={y1 + 18} width={x1 - x0 + 100} height={26} rx={6} fill="#4A4E70" />
      <rect x={x0 - 50} y={y1 + 18} width={x1 - x0 + 100} height={4} fill="#8A90C0" opacity={0.6} />
      {/* curtains */}
      <path d={`M ${x0 - 130} ${y0 - 60} L ${x0 - 20} ${y0 - 60} Q ${x0 - 50} ${(y0 + y1) / 2} ${x0 - 24} ${y1 + 30} L ${x0 - 130} ${y1 + 30} Z`} fill="#5A3048" />
      <path d={`M ${x1 + 130} ${y0 - 60} L ${x1 + 20} ${y0 - 60} Q ${x1 + 50} ${(y0 + y1) / 2} ${x1 + 24} ${y1 + 30} L ${x1 + 130} ${y1 + 30} Z`} fill="#5A3048" />
      <rect x={x0 - 150} y={y0 - 72} width={x1 - x0 + 300} height={12} rx={6} fill="#2A2038" />
      {/* a plant on the sill */}
      <g transform={`translate(${x1 - 80} ${y1 + 18})`}>
        <path d="M -22 0 L 22 0 L 16 -34 L -16 -34 Z" fill="#8A5040" />
        <path d="M 0 -34 q -26 -34 -10 -64 q 8 30 10 64 M 0 -34 q 22 -40 40 -44 q -8 28 -40 44" fill="#3E6A4A" />
      </g>
      {/* radiator under the window, cold */}
      <rect x={x0 - 20} y={y1 + 90} width={x1 - x0 + 40} height={150} rx={10} fill="#3A3E5A" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={x0 - 4 + i * 52} y={y1 + 102} width={34} height={126} rx={10} fill="#4A4E72" />)}
      {/* the floor and skirting */}
      <rect x={-400} y={FLOOR_Y} width={2720} height={400} fill="#1E1824" />
      <rect x={-400} y={FLOOR_Y - 22} width={2720} height={22} fill="#33385A" />
      <rect x={-400} y={FLOOR_Y} width={2720} height={4} fill="#000" opacity={0.4} />
      <ellipse cx={960} cy={FLOOR_Y + 80} rx={330} ry={44} fill="#9FC0FF" opacity={0.08} />
      {/* wall clock at noon, left of the window */}
      <g transform="translate(400 330)">
        <circle r={86} fill="#F2ECE0" stroke="#2A2038" strokeWidth={10} />
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d="M 0 -72 L 0 -62" stroke="#2A2038" strokeWidth={i % 3 === 0 ? 6 : 3} transform={`rotate(${i * 30})`} />)}
        <path d="M 0 0 L 0 -64" stroke="#2A2038" strokeWidth={6} strokeLinecap="round" />
        <path d="M 0 0 L 0 -46" stroke="#2A2038" strokeWidth={8} strokeLinecap="round" />
        <circle r={7} fill="#2A2038" />
        <text x={0} y={140} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#9FB0D8" letterSpacing={4}>12:00</text>
      </g>
      {/* a framed picture right of the window */}
      <rect x={1440} y={250} width={150} height={190} fill="#1A1624" stroke="#4A4E70" strokeWidth={10} />
      <rect x={1458} y={268} width={114} height={154} fill="#3A4E7A" />
      <path d="M 1458 410 L 1500 340 L 1530 380 L 1550 350 L 1572 410 Z" fill="#1C2A4A" />
      {/* the warm lamp on a side table: the power is still on */}
      <ellipse cx={1560} cy={720} rx={340} ry={300} fill={`url(#${id}lamp)`} style={{ mixBlendMode: 'screen' }} />
      <rect x={1500} y={760} width={120} height={14} fill="#4A3A40" />
      <path d={`M 1510 774 L 1500 ${FLOOR_Y} M 1610 774 L 1620 ${FLOOR_Y}`} stroke="#4A3A40" strokeWidth={10} />
      <path d="M 1530 760 L 1590 760 L 1578 690 L 1542 690 Z" fill="#2A2038" />
      <rect x={1556} y={640} width={8} height={52} fill="#2A2038" />
      <path d="M 1520 640 L 1600 640 L 1580 580 L 1540 580 Z" fill="#FFD9A0" />
      <Glow x={1560} y={620} r={240} kind="warm" o={0.6} />
    </g>
  );
};
