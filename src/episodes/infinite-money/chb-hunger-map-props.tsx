import React from 'react';
import { clamp, easeOut, backOut, Glow, SCH, FONT } from '../../engine';

// Chapter B props (5/5): the hunger beat's schematic pieces: a stylised world map (1000 x 520 at s 1), the rice-bowl
// icon, the Ceres2030 report card. Pure functions of the frame counters they are given.

const LAND = [
  'M 60 80 L 200 50 L 300 70 L 330 130 L 300 200 L 240 250 L 200 330 L 150 250 L 90 180 Z', // N. America
  'M 240 300 L 330 290 L 370 360 L 330 460 L 285 505 L 262 400 Z', // S. America
  'M 470 80 L 580 66 L 610 120 L 540 170 L 470 150 Z', // Europe
  'M 485 190 L 610 180 L 670 250 L 625 385 L 565 445 L 525 360 L 462 270 Z', // Africa
  'M 610 60 L 900 66 L 965 160 L 890 255 L 800 250 L 760 210 L 700 235 L 650 150 Z', // Asia
  'M 810 360 L 930 350 L 960 420 L 860 445 Z', // Australia
];
/** Where the bowls land on the map, left to right (map units). */
export const MAP_BOWLS: [number, number][] = [[170, 150], [290, 380], [535, 125], [545, 300], [720, 140], [830, 190], [880, 400]];

export const WorldMap: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number; glow?: number }> = ({ x, y, s = 1, color = '#2C4468', o = 1, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {LAND.map((d, i) => <path key={i} d={d} fill={color} stroke={glow > 0 ? SCH.glow : SCH.dim} strokeWidth={4} strokeLinejoin="round" opacity={0.95} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={`g${i}`} d={`M 0 ${i * 100 + 20} H 1000`} stroke={SCH.grid} strokeWidth={2} />)}
  </g>
);

/** A rice bowl icon, ~120 wide (centred on the rim). `on` (0..1): rice mounds up, steam, orange glow; 0 = empty dim outline. */
export const BowlIcon: React.FC<{ x: number; y: number; s?: number; on?: number; t?: number }> = ({ x, y, s = 1, on = 0, t = 0 }) => {
  const k = easeOut(clamp(on));
  const col = on > 0 ? SCH.live : SCH.dim;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {on > 0 ? <Glow x={0} y={-10} r={110} o={0.6 * k} /> : null}
      {on > 0 ? <path d={`M -48 0 Q -36 ${-60 * k} 0 ${-70 * k} Q 36 ${-60 * k} 48 0 Z`} fill="#F6EFE3" opacity={k} /> : null}
      <path d="M -62 0 H 62 Q 58 56 0 62 Q -58 56 -62 0 Z" fill={on > 0 ? '#3A2A22' : 'none'} stroke={col} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -62 0 H 62" stroke={col} strokeWidth={6} strokeLinecap="round" />
      {on > 0.4 ? [0, 1].map((i) => <path key={i} d={`M ${-14 + i * 28} -80 q 8 -14 0 -28 q -8 -14 0 -28`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.5 * Math.sin((((t * 0.03 + i / 2) % 1) + 1) % 1 * Math.PI)} transform={`translate(0 ${-20 * k})`} />) : null}
    </g>
  );
};

/** The Ceres2030 report: a paper with a title, bars and lines, popping in; 520 x 680 at s 1, centred. */
export const ReportCard: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const k = t <= 0 ? 0 : backOut(clamp(t / 10));
  const bar = (i: number) => clamp((t - 14 - i * 5) / 10);
  return (
    <g transform={`translate(${x} ${y}) rotate(${-2 + Math.sin(t / 20)}) scale(${s * k})`}>
      <rect x={-250} y={-330} width={520} height={680} rx={10} fill="#000" opacity={0.3} />
      <rect x={-260} y={-340} width={520} height={680} rx={10} fill="#F6F1E3" stroke="#B9B09A" strokeWidth={3} />
      <rect x={-260} y={-340} width={520} height={110} rx={10} fill="#2F5E8F" />
      <text x={0} y={-262} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill="#FFF6D8" letterSpacing={3}>CERES2030</text>
      <text x={0} y={-236} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#CFE3F8" letterSpacing={2}>RESEARCH REPORT</text>
      <g transform="translate(-170 -40)">
        {[0.5, 0.75, 1, 0.65, 0.9].map((h, i) => <rect key={i} x={i * 70} y={-h * 200 * bar(i) + 120} width={46} height={h * 200 * bar(i)} fill={i === 2 ? '#FF8A3D' : '#2F5E8F'} opacity={0.9} />)}
        <path d="M -10 120 H 350" stroke="#2A2630" strokeWidth={4} />
      </g>
      {[0, 1, 2].map((i) => <rect key={i} x={-210} y={150 + i * 40} width={i === 2 ? 220 : 420} height={10} rx={5} fill="#2A2630" opacity={0.2} />)}
      <text x={0} y={310} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#2A2630" opacity={0.7}>Cornell · IFPRI · IISD</text>
    </g>
  );
};
