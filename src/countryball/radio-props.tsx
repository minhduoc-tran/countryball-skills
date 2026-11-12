import React from 'react';
import { FONT } from '../engine/fonts';
import { Glow } from './fx-glow';
import { clamp, flicker } from './fx-math';

// Period (1970s) radio props, drawn in screen px, `s` = scale, (x, y) = the point they stand on, `t` in frames:
//   <RadioMicrophone x y s? t? onAir? />   the studio desk of the surrender broadcast at Đài Phát thanh Sài Gòn: a round desk microphone (chrome
//                                          grille ball on a stem, black base), a reel-to-reel tape recorder (two spinning reels, VU meter), headphones,
//                                          a typed sheet and the red ON AIR lamp (onAir true = lit, glowing). About 520 px wide at s = 1.
//   <ReelToReel x y s? t? />               only the tape recorder
//   <TransistorRadio x y s? t? waves? />   a portable transistor set (cream and brown case, speaker grille, dial with needle, antenna, strap);
//                                          waves 0..1 draws sound arcs flowing out of the speaker; ~200 px tall at s = 1
// Pure functions of their props.

const INK = '#1B1B1E';

export const ReelToReel: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => {
  const spin = (t * 9) % 360;
  const reel = (cx: number, cy: number, dir: number) => (
    <g transform={`translate(${cx},${cy}) rotate(${spin * dir})`}><circle r={58} fill="#CFD3D6" stroke={INK} strokeWidth={3.4} /><circle r={42} fill="#3A2C22" /><circle r={16} fill="#B9BDC0" stroke={INK} strokeWidth={2.4} />{[0, 120, 240].map((a) => <path key={a} d="M0,-16 L0,-52" stroke="#CFD3D6" strokeWidth={9} transform={`rotate(${a})`} />)}</g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round">
      <rect x={-190} y={-190} width={380} height={190} rx={14} fill="#6B7075" stroke={INK} strokeWidth={4} />
      <rect x={-190} y={-190} width={380} height={34} rx={14} fill="#8A9096" stroke={INK} strokeWidth={4} />
      {reel(-96, -110, 1)}{reel(96, -110, 1)}
      <path d="M-96,-52 L-40,-30 H40 L96,-52" fill="none" stroke="#3A2C22" strokeWidth={3} />
      <circle cx={-40} cy={-30} r={6} fill="#B9BDC0" stroke={INK} strokeWidth={1.6} /><circle cx={40} cy={-30} r={6} fill="#B9BDC0" stroke={INK} strokeWidth={1.6} />
      <rect x={-60} y={-184} width={120} height={26} rx={4} fill="#EDE4C6" stroke={INK} strokeWidth={2.4} />
      <path d="M-44,-166 Q0,-188 44,-166" fill="none" stroke={INK} strokeWidth={2} /><path d="M0,-164 L" stroke={INK} />
      <line x1={0} y1={-164} x2={14 * Math.sin(t * 0.3)} y2={-182} stroke="#C63A32" strokeWidth={2.4} />
      {[-120, -90, -60].map((kx) => <circle key={kx} cx={kx} cy={-20} r={9} fill="#2A2C30" stroke="#B9BDC0" strokeWidth={2.4} />)}
      {[40, 68, 96, 124].map((kx) => <rect key={kx} x={kx - 9} y={-30} width={18} height={20} rx={3} fill="#2A2C30" stroke="#B9BDC0" strokeWidth={2} />)}
    </g>
  );
};

export const RadioMicrophone: React.FC<{ x: number; y: number; s?: number; t?: number; onAir?: boolean }> = ({ x, y, s = 1, t = 0, onAir = true }) => {
  const lampO = onAir ? clamp(0.75 + 0.25 * Math.sin(t * 0.25)) : 0.12;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round">
      <rect x={-300} y={-330} width={600} height={320} fill="#3A3F4A" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 12 * 6 }, (_, i) => <circle key={i} cx={-275 + (i % 12) * 50} cy={-305 + Math.floor(i / 12) * 50} r={4} fill="#262A33" />)}
      <rect x={-300} y={-10} width={600} height={22} rx={4} fill="#7A5A3C" stroke={INK} strokeWidth={4} />
      <rect x={-280} y={12} width={16} height={150} fill="#5A422C" stroke={INK} strokeWidth={3} /><rect x={264} y={12} width={16} height={150} fill="#5A422C" stroke={INK} strokeWidth={3} />
      <ReelToReel x={-130} y={-10} s={0.9} t={t} />
      {/* microphone: heavy base, chrome stem, grille ball */}
      <ellipse cx={150} cy={-10} rx={56} ry={11} fill="#1E1F23" stroke={INK} strokeWidth={3} />
      <path d="M128,-14 Q150,-30 172,-14 L166,-24 H134Z" fill="#2A2C30" />
      <rect x={144} y={-150} width={12} height={130} fill="#C9CED2" stroke={INK} strokeWidth={3} />
      <ellipse cx={150} cy={-165} rx={44} ry={52} fill="#B7BCC2" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${112},${-190 + i * 16} Q150,${-180 + i * 16} 188,${-190 + i * 16}`} fill="none" stroke="#6F757B" strokeWidth={2} />)}
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${150 + (i - 2) * 16},-216 Q${150 + (i - 2) * 20},-165 ${150 + (i - 2) * 16},-114`} fill="none" stroke="#6F757B" strokeWidth={1.6} />)}
      <path d="M118,-188 Q124,-206 140,-212" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
      {/* headphones and a typed sheet */}
      <path d="M232,-10 Q232,-86 262,-86 Q292,-86 292,-10" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" /><rect x={222} y={-40} width={22} height={34} rx={8} fill="#2A2C30" stroke={INK} strokeWidth={3} /><rect x={282} y={-40} width={22} height={34} rx={8} fill="#2A2C30" stroke={INK} strokeWidth={3} />
      <g transform="translate(46,-14) rotate(-4)"><rect width={96} height={6} y={0} fill="#E8E2CE" stroke={INK} strokeWidth={2} /></g>
      {/* ON AIR lamp on a bracket above the desk */}
      <rect x={-60} y={-318} width={120} height={46} rx={10} fill="#2A2C30" stroke={INK} strokeWidth={4} />
      <rect x={-52} y={-310} width={104} height={30} rx={6} fill="#C63A32" opacity={lampO} />
      {onAir && <Glow x={0} y={-295} r={120 * flicker(t * 0.15, 3) * 0.8} color="#FF4A3A" o={0.55 * lampO} />}
      <text x={0} y={-288} textAnchor="middle" fontSize={22} fontFamily={FONT.title} fontWeight={900} fill={onAir ? '#FFF2E8' : '#7A3A34'} letterSpacing={3}>ON AIR</text>
    </g>
  );
};

export const TransistorRadio: React.FC<{ x: number; y: number; s?: number; t?: number; waves?: number }> = ({ x, y, s = 1, t = 0, waves = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx={0} cy={2} rx={84} ry={9} fill="#000" opacity={0.22} />
    <line x1={52} y1={-150} x2={118} y2={-262} stroke="#C9CED2" strokeWidth={6} /><circle cx={118} cy={-262} r={7} fill="#C9CED2" stroke={INK} strokeWidth={2.4} />
    <path d="M-62,-150 Q0,-196 62,-150" fill="none" stroke="#6A4630" strokeWidth={10} />
    <rect x={-84} y={-160} width={168} height={160} rx={22} fill="#C9A46A" stroke={INK} strokeWidth={4.6} />
    <rect x={-72} y={-148} width={144} height={52} rx={10} fill="#F2E8CC" stroke={INK} strokeWidth={3} />
    {[-52, -26, 0, 26, 52].map((tx) => <line key={tx} x1={tx} y1={-142} x2={tx} y2={-130} stroke={INK} strokeWidth={2} />)}
    <line x1={-56 + 30 * (0.5 + 0.5 * Math.sin(t * 0.02))} y1={-146} x2={-56 + 30 * (0.5 + 0.5 * Math.sin(t * 0.02))} y2={-100} stroke="#C63A32" strokeWidth={3} />
    <circle cx={0} cy={-46} r={34} fill="#5A3E2A" stroke={INK} strokeWidth={3} />
    {Array.from({ length: 19 }, (_, i) => <circle key={i} cx={((i % 5) - 2) * 11} cy={-46 + (Math.floor(i / 5) - 1.5) * 11} r={2.4} fill={INK} opacity={Math.hypot(((i % 5) - 2) * 11, (Math.floor(i / 5) - 1.5) * 11) < 31 ? 0.85 : 0} />)}
    <circle cx={-64} cy={-24} r={8} fill="#2A2C30" stroke="#E8E2CE" strokeWidth={2} /><circle cx={64} cy={-24} r={8} fill="#2A2C30" stroke="#E8E2CE" strokeWidth={2} />
    {waves > 0.02 && [0, 1, 2].map((i) => { const k = ((t * 0.03 + i / 3) % 1), r = 70 + k * 120; return <path key={i} d={`M${r * 0.5},${-46 - r * 0.6} A${r},${r} 0 0 1 ${r * 0.5},${-46 + r * 0.6}`} transform="translate(60,0)" fill="none" stroke="#FFE9A8" strokeWidth={6 * (1 - k)} opacity={waves * (1 - k)} />; })}
  </g>
);
