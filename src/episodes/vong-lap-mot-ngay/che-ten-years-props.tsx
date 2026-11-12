import React from 'react';
import { clamp, backOut, rnd, FONT, Glow } from '../../engine';
import { PAL } from './kit-palette';

// Chapter E "ten years" props. Pure functions of t.
//   <CalendarGrid t cols rows x0 y0 cw ch />  a wall of little tear-off pages, every one "THỨ TƯ", popping in a fast
//       diagonal wave from the top-left (page i pops at frame (col + row) * 1.6 + small jitter).
//   <MirrorFrame x y w h id>{reflection}</MirrorFrame>  a wall mirror (wooden frame, glass sheen) with the reflection
//       clipped inside its glass; x y = centre.
//   LANGS  the five greetings (English, Japanese, Korean, French, Russian) for E5's bubbles.

export const CalendarGrid: React.FC<{ t: number; cols: number; rows: number; x0: number; y0: number; cw: number; ch: number }> = ({ t, cols, rows, x0, y0, cw, ch }) => {
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const at = (c + r) * 1.6 + rnd(9, i) * 3;
      if (t < at) continue;
      const k = backOut(clamp((t - at) / 6));
      const x = x0 + c * cw + cw / 2;
      const y = y0 + r * ch + ch / 2;
      const w = cw * 0.82;
      const h = ch * 0.84;
      const rot = (rnd(11, i) - 0.5) * 6;
      out.push(
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
          <rect x={-w / 2 + 4} y={-h / 2 + 5} width={w} height={h} fill="#000" opacity={0.35} />
          <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={PAL.paper} />
          <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.18} fill="#C8382E" />
          <text y={-h * 0.06} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={h * 0.16} fill="#C8382E">THỨ</text>
          <text y={h * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={h * 0.4} fill="#C8382E">TƯ</text>
        </g>,
      );
    }
  }
  return <g>{out}</g>;
};

export const MirrorFrame: React.FC<{ x: number; y: number; w: number; h: number; id: string; children?: React.ReactNode }> = ({ x, y, w, h, id, children }) => (
  <g>
    <defs>
      <clipPath id={`${id}glass`}><rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={w * 0.5} /></clipPath>
      <linearGradient id={`${id}sheen`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.22} />
        <stop offset="0.35" stopColor="#FFFFFF" stopOpacity={0} />
        <stop offset="0.6" stopColor="#FFFFFF" stopOpacity={0.08} />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect x={x - w / 2 - 22 + 14} y={y - h / 2 - 22 + 18} width={w + 44} height={h + 44} rx={w * 0.5 + 22} fill="#000" opacity={0.4} />
    <rect x={x - w / 2 - 22} y={y - h / 2 - 22} width={w + 44} height={h + 44} rx={w * 0.5 + 22} fill="#7A5236" stroke="#2A1A14" strokeWidth={6} />
    <rect x={x - w / 2 - 10} y={y - h / 2 - 10} width={w + 20} height={h + 20} rx={w * 0.5 + 10} fill="none" stroke="#A8784E" strokeWidth={5} />
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={w * 0.5} fill="#2A2C3A" />
    <g clipPath={`url(#${id}glass)`}>
      {children}
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill={`url(#${id}sheen)`} />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="#9FC0E6" opacity={0.06} />
    </g>
    <Glow x={x + w * 0.3} y={y - h * 0.35} r={w * 0.5} o={0.12} />
  </g>
);

export const LANGS = ['Hello!', 'こんにちは', '안녕하세요', 'Bonjour!', 'Привет!'];
