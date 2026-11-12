import React from 'react';
import { SCH, FONT, UI, clamp, easeOut, backOut } from '../../engine';

// Chapter A props for the "scale" beat, on the blueprint ground. Pure functions of t.
//   <WaterCube x y s t />      isometric cube of water (the 1,3 tỷ km³) with a wavy top, popping in.
//   <DropGrid x y t />         10 x 10 grid of droplets filling in order: 97 blue, the last 3 pale (rivers, lakes, ice).
//   <DepthBracket x y0 y1 t label />  vertical dimension line between two world y values with a big live-orange label.

export const WaterCube: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const k = backOut(clamp(t / 10));
  const bob = Math.sin(t / 10) * 4;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s * k})`}>
      <path d="M 0 -150 L 130 -80 L 130 80 L 0 150 L -130 80 L -130 -80 Z" fill="#1B4F72" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -130 -80 L 0 -10 L 0 150 L -130 80 Z" fill="#2E86C1" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 0 -10 L 130 -80 L 130 80 L 0 150 Z" fill="#1F6FA3" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 0 -150 L 130 -80 L 0 -10 L -130 -80 Z" fill="#5BC0E8" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -70 -85 Q -35 -100 0 -85 T 70 -85" stroke="#E8F7FC" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  );
};

export const DropGrid: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: 100 }).map((_, i) => {
      const c = i % 10;
      const r = Math.floor(i / 10);
      const k = backOut(clamp((t - 4 - i * 0.26) / 6));
      const water = i < 97;
      return (
        <g key={i} transform={`translate(${c * 60} ${r * 60}) scale(${k})`}>
          <path d="M 0 -24 Q 20 2 0 22 Q -20 2 0 -24 Z" fill={water ? '#2E86C1' : 'none'} stroke={water ? '#9AD3F2' : SCH.dim} strokeWidth={water ? 2 : 4} strokeDasharray={water ? undefined : '6 5'} />
          {water ? <path d="M -6 2 Q -8 12 -1 14" stroke="#E8F7FC" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} /> : null}
        </g>
      );
    })}
  </g>
);

export const DepthBracket: React.FC<{ x: number; y0: number; y1: number; t: number; label: string; lx?: number }> = ({ x, y0, y1, t, label, lx = 36 }) => {
  const k = easeOut(clamp(t / 10));
  const ye = y0 + (y1 - y0) * k;
  return (
    <g>
      <path d={`M ${x - 16} ${y0} L ${x + 16} ${y0} M ${x} ${y0} L ${x} ${ye} M ${x - 16} ${ye} L ${x + 16} ${ye}`} stroke={UI.live} strokeWidth={7} strokeLinecap="round" fill="none" />
      {t > 6 ? (
        <g transform={`translate(${x + lx} ${(y0 + y1) / 2 + 20}) scale(${backOut(clamp((t - 6) / 8))})`}>
          <text fontFamily={FONT.ui} fontWeight={700} fontSize={72} fill={UI.live} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}88)` }}>{label}</text>
        </g>
      ) : null}
    </g>
  );
};

export const BigText: React.FC<{ x: number; y: number; text: string; size?: number; t: number; color?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, text, size = 280, t, color = SCH.live, anchor = 'middle' }) => (
  <g transform={`translate(${x} ${y}) scale(${0.9 + 0.1 * backOut(clamp((t + 2) / 8))})`} opacity={clamp((t + 3) / 4)}>
    <text textAnchor={anchor} fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={color} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{text}</text>
  </g>
);

export const Caption: React.FC<{ x: number; y: number; text: string; t: number; size?: number; color?: string }> = ({ x, y, text, t, size = 44, color = SCH.dim }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontSize={size} fill={color} letterSpacing={2} opacity={easeOut(clamp(t / 8))}>{text}</text>
);
