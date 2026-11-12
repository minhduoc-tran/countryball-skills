import React from 'react';
import { clamp, backOut } from '../../engine';

// Chapter E "perfect day" props. Pure functions of t. x, y = CENTRE unless said.
//   <PhoBowl x y s t />        a steaming bowl of phở seen from a little above (noodles, herbs, chopsticks across it).
//   <LaughLines x y s t dir? />  little bursting strokes beside a laughing head (dir 1 to the right, -1 to the left).
//   <PlasticStool x y s />     a low red plastic stool (y = seat top).

export const PhoBowl: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={6} cy={70} rx={110} ry={18} fill="#000" opacity={0.35} />
    <path d="M -110 0 Q -100 80 0 82 Q 100 80 110 0 Z" fill="#E9E2D2" stroke="#2A2630" strokeWidth={4} />
    <path d="M -80 46 Q 0 60 80 46" stroke="#3E6A8A" strokeWidth={6} fill="none" />
    <ellipse cx={0} cy={0} rx={110} ry={30} fill="#F4EEDF" stroke="#2A2630" strokeWidth={4} />
    <ellipse cx={0} cy={2} rx={96} ry={22} fill="#C98A4A" />
    {[-50, -20, 10, 40].map((dx, k) => <path key={k} d={`M ${dx - 20} ${-4 + (k % 2) * 6} q 20 10 40 0`} stroke="#F4E3B8" strokeWidth={5} fill="none" />)}
    {[[-40, -6], [30, 6], [60, -4], [-10, 10]].map(([dx, dy], k) => <ellipse key={`h${k}`} cx={dx} cy={dy} rx={12} ry={6} fill="#4E7350" />)}
    <path d="M -130 -40 L 120 18 M -124 -54 L 128 4" stroke="#8A5A34" strokeWidth={6} strokeLinecap="round" />
    {[-40, 0, 40].map((dx, k) => {
      const ph = ((t * 0.8 + k * 13) % 40) / 40;
      return <path key={`s${k}`} d={`M ${dx} ${-20 - ph * 120} q 14 -16 0 -32 q -14 -16 0 -32`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.45 * Math.sin(ph * Math.PI)} strokeLinecap="round" />;
    })}
  </g>
);

export const LaughLines: React.FC<{ x: number; y: number; s?: number; t: number; dir?: 1 | -1 }> = ({ x, y, s = 1, t, dir = 1 }) => {
  const p = (t % 10) / 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#FFE27A" strokeWidth={6} strokeLinecap="round" opacity={0.9 - p * 0.5}>
      {(dir > 0 ? [-30, 0, 30] : [150, 180, 210]).map((a) => (
        <path key={a} d={`M ${Math.cos((a * Math.PI) / 180) * (40 + p * 20)} ${Math.sin((a * Math.PI) / 180) * (40 + p * 20)} l ${Math.cos((a * Math.PI) / 180) * 30} ${Math.sin((a * Math.PI) / 180) * 30}`} />
      ))}
    </g>
  );
};

/** A low red plastic stool (ghế nhựa) seen from the side: x = centre, y = the seat top, s scale (~150 wide at s 1). */
export const PlasticStool: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={6} cy={92} rx={92} ry={12} fill="#000" opacity={0.35} />
    <path d="M -64 10 L -78 90 L -58 90 L -44 14 Z M 64 10 L 78 90 L 58 90 L 44 14 Z" fill="#B8382E" stroke="#4A1410" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -50 40 L 50 40" stroke="#9A2A22" strokeWidth={8} />
    <rect x={-76} y={-6} width={152} height={22} rx={8} fill="#D8463A" stroke="#4A1410" strokeWidth={4} />
    <path d="M -70 -4 L 66 -4" stroke="#FFC98A" strokeWidth={3} opacity={0.6} />
  </g>
);
