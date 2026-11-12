import React from 'react';
import { SCH, FONT, clamp, easeOut } from '../../engine';

// Chapter B props (4/5): the "world" beat. A light bulb as a line icon, a school bag (the real thing), a school icon, and
// the closed school gate. Pure functions of the frame counters they are given.

const LINE = SCH.line;
const LIVE = SCH.live;

/** A bulb as a blueprint line icon, ~150 x 230, centred. `on` 0..1 fills and lights it; `slash` draws a no-sign over it. */
export const BulbLine: React.FC<{ x: number; y: number; s?: number; on?: number; slash?: number; t?: number }> = ({ x, y, s = 1, on = 0, slash = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={on > 0.1 ? LIVE : LINE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" style={on > 0.1 ? { filter: `drop-shadow(0 0 20px ${SCH.glow})` } : undefined}>
    <path d="M -40 70 C -40 40 -80 20 -80 -30 A 80 80 0 0 1 80 -30 C 80 20 40 40 40 70 Z" fill={`${LIVE}${Math.round(on * 80).toString(16).padStart(2, '0')}`} />
    <path d="M -34 94 H 34 M -26 118 H 26 M -40 70 H 40" />
    <path d="M -14 70 V 10 L 0 -8 L 14 10 V 70" strokeWidth={4} opacity={0.8} />
    {on > 0.5 ? [-1, 0, 1].map((i) => <path key={i} d={`M ${i * 112} ${-60 - Math.abs(i) * -20 - 40} l ${i * 24} ${-24 + Math.abs(i) * 10}`} strokeWidth={5} opacity={0.5 + 0.3 * Math.sin(t / 4 + i)} />) : null}
    {slash > 0 ? <path d={`M -110 -110 L ${-110 + 220 * easeOut(clamp(slash))} ${-110 + 220 * easeOut(clamp(slash))}`} stroke="#FF5A4A" strokeWidth={14} /> : null}
  </g>
);

/** A child's school bag, front view, ~210 x 280, centred. `swing` tilts it as it is handed over. */
export const SchoolBag: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={4} cy={150} rx={110} ry={14} fill="#000" opacity={0.28} />
    <path d="M -60 -138 Q 0 -190 60 -138" stroke="#7A2A24" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M -100 140 V -60 Q -100 -130 -30 -134 H 30 Q 100 -130 100 -60 V 140 Q 100 150 90 150 H -90 Q -100 150 -100 140 Z" fill="#D9534F" stroke="#7A2A24" strokeWidth={6} />
    <path d="M -100 -20 Q 0 20 100 -20 V -60 Q 100 -130 30 -134 H -30 Q -100 -130 -100 -60 Z" fill="#E86A5C" stroke="#7A2A24" strokeWidth={6} />
    <rect x={-16} y={-24} width={32} height={34} rx={7} fill="#F2C14E" stroke="#7A5A12" strokeWidth={4} />
    <rect x={-70} y={36} width={140} height={84} rx={14} fill="#C74540" stroke="#7A2A24" strokeWidth={5} />
    <path d="M -50 60 H 50" stroke="#F4D7CE" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    <path d="M -100 -30 Q -128 40 -100 110 M 100 -30 Q 128 40 100 110" stroke="#7A2A24" strokeWidth={12} fill="none" strokeLinecap="round" />
    <ellipse cx={-52} cy={-70} rx={14} ry={30} fill="#fff" opacity={0.28} />
  </g>
);

/** A small school house as a blueprint icon: roof, door, flag, ~200 x 180, centred. */
export const SchoolLine: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={LINE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M -90 80 V -10 L 0 -60 L 90 -10 V 80 Z" />
    <path d="M -22 80 V 20 H 22 V 80 M -66 4 h 28 v 24 h -28 Z M 38 4 h 28 v 24 h -28 Z" />
    <path d="M 0 -60 V -112" />
    <path d={`M 0 -112 q 24 ${-8 + Math.sin(t / 5) * 4} 42 4 q -20 14 -42 4`} fill={LIVE} stroke={LIVE} />
  </g>
);

/** The school gate, shut: two plank doors in an arch with a chain and a padlock swinging. x = centre, y = ground. */
export const SchoolGate: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={420} ry={20} fill="#000" opacity={0.3} />
    <rect x={-360} y={-560} width={720} height={560} fill="#E9DDBF" stroke="#A89A76" strokeWidth={5} />
    <rect x={-360} y={-560} width={720} height={44} fill="#C8553D" />
    <text x={0} y={-526} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill="#FFF3DC" letterSpacing={10}>TRƯỜNG HỌC</text>
    <path d="M -230 0 V -330 Q -230 -460 0 -460 Q 230 -460 230 -330 V 0 Z" fill="#7A5239" stroke="#3E2A1E" strokeWidth={8} />
    <path d="M 0 -460 V 0" stroke="#3E2A1E" strokeWidth={8} />
    {[-150, -75, 75, 150].map((px) => <path key={px} d={`M ${px} -10 V -400`} stroke="#5E3F2B" strokeWidth={4} opacity={0.8} />)}
    {/* chain and padlock */}
    <path d="M -150 -200 Q 0 -150 150 -200" stroke="#9AA3B1" strokeWidth={10} fill="none" strokeDasharray="22 8" />
    <g transform={`translate(0 -170) rotate(${Math.sin(t / 9) * 6} 0 -30)`}>
      <path d="M -22 -10 V -36 A 22 22 0 0 1 22 -36 V -10" stroke="#C7CED8" strokeWidth={9} fill="none" />
      <rect x={-34} y={-12} width={68} height={56} rx={9} fill="#F2C14E" stroke="#7A5A12" strokeWidth={5} />
      <circle cx={0} cy={14} r={7} fill="#7A5A12" />
    </g>
    <rect x={-290} y={0} width={580} height={22} fill="#CFC3A2" stroke="#A89A76" strokeWidth={3} />
  </g>
);
