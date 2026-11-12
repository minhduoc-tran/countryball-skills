import React from 'react';
import { LOOKS, Look, clamp, easeOut, FONT } from '../../engine';
import { WORKER, GRANDMA } from '../khong-ai-ngheo/cast-looks';

// Chapter D props (4/4): the neighbourhood: neighbours, a row of house doors, the communal house (đình) courtyard,
// the chalkboard and the school gate.

export { WORKER, GRANDMA };

/** Neighbours: same rig, different clothes. */
export const NEIGHBOURS: Look[] = [
  WORKER,
  { ...LOOKS.mom, jacket: '#4A7A8A', jacketShade: '#3A6270', hair: '#2A1C18' },
  { ...LOOKS.mo, jacket: '#B5523B', jacketShade: '#94412E', accent: '#F2C14E', extra: undefined },
  { ...LOOKS.suit, jacket: '#6E7A5A', jacketShade: '#586248', accent: '#E9C46A', extra: undefined, hair: '#4A4A50' },
  { ...LOOKS.mom, jacket: '#D9B04A', jacketShade: '#B08C34', hair: '#3A2620' },
  { ...LOOKS.mo, jacket: '#3E8C86', jacketShade: '#2F6E69', accent: '#F28C6A', extra: undefined, hair: '#2A1C18' },
];

const WALLS = ['#D9B88A', '#B7C8A8', '#C9A8A0', '#A8BCC9'];
export const doorX = (i: number) => 380 + i * 400;

/** A row of four narrow houses; door i swings open from time opens[i] (frames). Ground line at gy. */
export const DoorRow: React.FC<{ t: number; gy: number; opens: number[] }> = ({ t, gy, opens }) => (
  <g>
    <rect x={-300} y={gy - 900} width={2520} height={900} fill="#E6C7A0" />
    <rect x={-300} y={gy} width={2520} height={500} fill="#8E8576" />
    <path d={`M -300 ${gy + 40} H 2220`} stroke="#6A6458" strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => {
      const x0 = doorX(i) - 195;
      const o = easeOut(clamp((t - opens[i]) / 8));
      return (
        <g key={i}>
          <rect x={x0} y={gy - 640} width={390} height={640} fill={WALLS[i]} stroke="#5E4A32" strokeWidth={6} />
          <rect x={x0 - 10} y={gy - 660} width={410} height={30} fill="#7A4A32" />
          <rect x={x0 + 40} y={gy - 540} width={110} height={130} rx={6} fill="#3A4A5A" stroke="#5E4A32" strokeWidth={6} />
          <path d={`M ${x0 + 95} ${gy - 540} V ${gy - 410} M ${x0 + 40} ${gy - 475} H ${x0 + 150}`} stroke="#5E4A32" strokeWidth={4} />
          <rect x={doorX(i) - 20} y={gy - 330} width={150} height={330} fill={o > 0 ? '#4A2E1C' : '#8A5A32'} stroke="#3E2814" strokeWidth={6} />
          {o > 0 ? <rect x={doorX(i) - 14} y={gy - 324} width={138} height={324} fill="#FFC27A" opacity={0.35 * o} /> : null}
          <rect x={doorX(i) - 20} y={gy - 330} width={150 * (1 - 0.85 * o)} height={330} fill="#8A5A32" stroke="#3E2814" strokeWidth={6} />
          <circle cx={doorX(i) - 20 + 150 * (1 - 0.85 * o) - 18} cy={gy - 160} r={7} fill="#E2B655" />
          <ellipse cx={x0 + 300} cy={gy - 590} rx={22} ry={28} fill="#D94A3A" stroke="#6A1E16" strokeWidth={4} opacity={0.9} />
        </g>
      );
    })}
    <Wires t={t} gy={gy} />
  </g>
);
const Wires: React.FC<{ t: number; gy: number }> = ({ t, gy }) => (
  <path d={`M -300 ${gy - 760 + Math.sin(t / 30) * 2} Q 900 ${gy - 700} 2220 ${gy - 770}`} stroke="#2A2630" strokeWidth={4} fill="none" opacity={0.6} />
);

/** The communal house courtyard (sân đình): paved yard, a tiled curved roof on red columns, a banyan tree. Ground at gy. */
export const Dinh: React.FC<{ t: number; gy: number; id: string }> = ({ t, gy, id }) => {
  const cx = 1180;
  return (
    <g>
      <defs><linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6E3B8" /><stop offset="1" stopColor="#F4C890" /></linearGradient></defs>
      <rect x={-300} y={-300} width={2520} height={gy + 300} fill={`url(#${id}sky)`} />
      <circle cx={420} cy={200} r={80} fill="#FFF3CF" opacity={0.9} />
      <rect x={cx - 520} y={gy - 140} width={1040} height={140} fill="#A8987A" stroke="#5E4A32" strokeWidth={5} />
      <rect x={cx - 470} y={gy - 440} width={940} height={304} fill="#3A2418" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={cx - 470 + i * 176} y={gy - 450} width={36} height={314} fill="#8A3A2A" stroke="#4A1E14" strokeWidth={4} />)}
      <Lantern x={cx - 190} y={gy - 380} t={t} />
      <Lantern x={cx + 190} y={gy - 380} t={t + 12} />
      <path d={`M ${cx - 580} ${gy - 440} Q ${cx - 460} ${gy - 450} ${cx - 330} ${gy - 560} L ${cx + 330} ${gy - 560} Q ${cx + 460} ${gy - 450} ${cx + 580} ${gy - 440} Q ${cx + 500} ${gy - 424} ${cx + 440} ${gy - 436} L ${cx - 440} ${gy - 436} Q ${cx - 500} ${gy - 424} ${cx - 580} ${gy - 440} Z`} fill="#7A3E2E" stroke="#3E1E14" strokeWidth={6} strokeLinejoin="round" />
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${cx - 330 + i * 47} ${gy - 556} L ${cx - 380 + i * 54} ${gy - 438}`} stroke="#4A2418" strokeWidth={3} opacity={0.6} />)}
      <path d={`M ${cx - 600} ${gy - 452} q -30 -30 -4 -58 M ${cx + 600} ${gy - 452} q 30 -30 4 -58`} stroke="#3E1E14" strokeWidth={9} fill="none" strokeLinecap="round" />
      <rect x={-300} y={gy} width={2520} height={600} fill="#CDB896" />
      {Array.from({ length: 8 }).map((_, r) => <path key={r} d={`M -300 ${gy + 18 + r * r * 8 + r * 20} H 2220`} stroke="#A8987A" strokeWidth={3} />)}
      {/* the banyan on the left, aerial roots hanging */}
      <path d={`M 150 ${gy + 10} Q 130 ${gy - 200} 180 ${gy - 360} L 300 ${gy - 360} Q 340 ${gy - 200} 300 ${gy + 10} Z`} fill="#6A4A32" stroke="#3E2814" strokeWidth={6} />
      {[[40, 140, 190], [230, 90, 220], [420, 160, 170], [140, 20, 150], [330, 50, 160]].map(([bx, by, r], i) => <circle key={i} cx={bx} cy={gy - 430 - by + 80} r={r} fill={i % 2 ? '#4E7A3C' : '#5E8A48'} stroke="#2F4A26" strokeWidth={4} />)}
      {[170, 210, 260, 330].map((rx, i) => <path key={i} d={`M ${rx} ${gy - 300} q ${(i % 2 ? 1 : -1) * 6 + Math.sin(t / 25 + i) * 3} 130 0 270`} stroke="#6A4A32" strokeWidth={6} fill="none" />)}
    </g>
  );
};
const Lantern: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x + Math.sin(t / 20) * 3} ${y})`}>
    <path d="M 0 -40 V 0" stroke="#4A1E14" strokeWidth={4} />
    <ellipse cx={0} cy={26} rx={22} ry={30} fill="#D94A3A" stroke="#6A1E16" strokeWidth={4} />
    <path d="M -10 0 V 50 M 10 0 V 50" stroke="#FFC27A" strokeWidth={2} opacity={0.6} />
  </g>
);

/** A chalkboard on two posts: frame, dark-green face. (x, y) = centre of the face. children draw in board coordinates (centred). */
export const Chalkboard: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M ${-w / 2 + 60} ${h / 2} V ${h / 2 + 260} M ${w / 2 - 60} ${h / 2} V ${h / 2 + 260}`} stroke="#5E4026" strokeWidth={26} strokeLinecap="round" />
    <rect x={-w / 2 - 22} y={-h / 2 - 22} width={w + 44} height={h + 44} rx={14} fill="#7A5230" stroke="#3E2814" strokeWidth={7} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill="#24402F" />
    <path d={`M ${-w / 2 + 30} ${h / 2 - 40} q ${w * 0.3} -20 ${w * 0.5} -4`} stroke="#F4F0E0" strokeWidth={4} opacity={0.12} fill="none" />
    {children}
  </g>
);

/** The school gate: two white pillars with red caps, a plate, a yellow school behind, a flag. Ground at gy. */
export const SchoolGate: React.FC<{ gy: number; t: number }> = ({ gy, t }) => (
  <g>
    <rect x={-300} y={-300} width={2520} height={gy + 300} fill="#F0DCB4" />
    <rect x={200} y={gy - 520} width={1520} height={400} fill="#E9C15A" stroke="#8A6A22" strokeWidth={6} />
    {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={250 + i * 185} y={gy - 470} width={90} height={120} rx={6} fill="#6A94AA" stroke="#8A6A22" strokeWidth={5} />)}
    <path d={`M 960 ${gy - 520} V ${gy - 760}`} stroke="#4A3A2A" strokeWidth={8} />
    <path d={`M 962 ${gy - 756} q 60 ${-14 + 10 * Math.sin(t / 6)} 120 0 q -60 ${16 + 10 * Math.sin(t / 6)} -120 ${30} Z`} fill="#C8202F" stroke="#4A1010" strokeWidth={3} />
    <rect x={-300} y={gy} width={2520} height={600} fill="#8A8478" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={i * 280 - 100} y={gy + 330} width={150} height={26} fill="#E8E2D2" opacity={0.7} />)}
    <path d={`M -300 ${gy + 8} H 2220`} stroke="#5E5A50" strokeWidth={8} />
    {[480, 1440].map((px) => (
      <g key={px}>
        <rect x={px - 60} y={gy - 360} width={120} height={360} fill="#F4EEDD" stroke="#8A8270" strokeWidth={6} />
        <rect x={px - 74} y={gy - 392} width={148} height={36} fill="#C8202F" stroke="#6A1010" strokeWidth={5} />
      </g>
    ))}
    <rect x={560} y={gy - 400} width={800} height={44} rx={8} fill="#F4EEDD" stroke="#8A8270" strokeWidth={6} />
    <text x={960} y={gy - 366} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#6A1010" letterSpacing={10}>TRƯỜNG</text>
  </g>
);
