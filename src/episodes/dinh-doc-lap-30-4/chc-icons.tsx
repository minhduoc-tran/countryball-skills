import React from 'react';
import { FONT } from '../../engine/fonts';
import { hash } from '../../countryball/fx-math';
import { Silhouette, ramp } from './chc-common';

// Chapter C icons: 1970s television, generic top-down jet and airliner (heading +x), analogue clock face, lines of speech.
const INK = '#151515';

/** 1970s TV set centred on (x, y), ~w px wide; the screen shows a faceless speaker silhouette with flicker and scan lines. s = seconds. */
export const TvSet: React.FC<{ id: string; x: number; y: number; w?: number; s: number }> = ({ id, x, y, w = 760, s }) => {
  const h = w * 0.74, sw = w * 0.74, sh = h * 0.72, fl = 0.92 + 0.08 * Math.sin(s * 37);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2 + 10} y={-h / 2 + 18} width={w} height={h} rx={34} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill="#7A5230" stroke={INK} strokeWidth={7} />
      <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={26} fill="#8E6440" />
      <clipPath id={`${id}-scr`}><rect x={-w / 2 + 40} y={-h / 2 + 40} width={sw} height={sh} rx={40} /></clipPath>
      <g clipPath={`url(#${id}-scr)`}>
        <rect x={-w / 2 + 40} y={-h / 2 + 40} width={sw} height={sh} fill="#5E7B93" opacity={fl} />
        <rect x={-w / 2 + 40} y={-h / 2 + 40} width={sw} height={sh} fill="#1E2E3C" opacity={0.4} />
        <g transform={`translate(${-w / 2 + 40 + sw / 2},${-h / 2 + 40 + sh + 8})`}><Silhouette x={0} y={0} s={1.35} color="#0F1A26" rim="#7FA3C8" /></g>
        {Array.from({ length: 22 }, (_, i) => <rect key={i} x={-w / 2 + 40} y={-h / 2 + 40 + i * (sh / 22) + ((s * 40) % (sh / 22))} width={sw} height={2} fill="#000" opacity={0.18} />)}
        <rect x={-w / 2 + 40} y={-h / 2 + 40 + ((s * 220) % (sh + 80)) - 40} width={sw} height={40} fill="#fff" opacity={0.05} />
      </g>
      <rect x={-w / 2 + 40} y={-h / 2 + 40} width={sw} height={sh} rx={40} fill="none" stroke={INK} strokeWidth={8} />
      <g transform={`translate(${w / 2 - 78},${-h / 2 + 90})`}>
        {[0, 1].map((i) => <g key={i} transform={`translate(0,${i * 96})`}><circle r={30} fill="#3A2A1C" stroke={INK} strokeWidth={5} /><line x1={0} y1={-6} x2={0} y2={-24} stroke="#D8C9A8" strokeWidth={5} strokeLinecap="round" transform={`rotate(${i ? 50 : -30})`} /></g>)}
        {[0, 1, 2, 3].map((i) => <line key={i} x1={-24} y1={210 + i * 14} x2={24} y2={210 + i * 14} stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.7} />)}
      </g>
      <path d={`M${-w * 0.1},${-h / 2} L${-w * 0.28},${-h / 2 - 90} M${w * 0.1},${-h / 2} L${w * 0.28},${-h / 2 - 90}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <rect x={-w * 0.3} y={h / 2} width={w * 0.14} height={26} fill={INK} /><rect x={w * 0.16} y={h / 2} width={w * 0.14} height={26} fill={INK} />
    </g>
  );
};

/** Lines of a long speech typing in (grey bars, no words), left edge x, top y. */
export const SpeechLines: React.FC<{ x: number; y: number; s: number; at?: number; n?: number; w?: number; color?: string }> = ({ x, y, s, at = 0, n = 9, w = 560, color = '#D9E3EC' }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const k = ramp(s, at + i * 0.17, at + i * 0.17 + 0.4), len = w * (0.62 + 0.38 * hash(i + 3));
      return <rect key={i} x={x} y={y + i * 54} width={len * k} height={20} rx={10} fill={color} stroke={INK} strokeWidth={4} opacity={0.95} />;
    })}
  </g>
);

/** Generic small twin-jet seen from above, heading +x, `len` px long (not any specific type). */
export const JetTop: React.FC<{ x: number; y: number; len?: number; rot?: number; color?: string }> = ({ x, y, len = 220, rot = 0, color = '#8C97A3' }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${len / 100})`} stroke={INK} strokeWidth={1.6} strokeLinejoin="round">
    <polygon points="8,-4 -22,-34 -32,-34 -22,-3" fill={color} /><polygon points="8,4 -22,34 -32,34 -22,3" fill={color} />
    <polygon points="-34,-2 -46,-14 -52,-14 -48,-2" fill={color} /><polygon points="-34,2 -46,14 -52,14 -48,2" fill={color} />
    <path d="M50,0 C44,-4 34,-5 24,-5 L-48,-4 L-54,-1.5 L-54,1.5 L-48,4 L24,5 C34,5 44,4 50,0 Z" fill={color} />
    <ellipse cx={26} cy={0} rx={9} ry={2.6} fill="#27323F" />
  </g>
);

/** Generic airliner seen from above, heading +x (white, blue tail stripe). */
export const AirlinerTop: React.FC<{ x: number; y: number; len?: number; rot?: number }> = ({ x, y, len = 260, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${len / 100})`} stroke={INK} strokeWidth={1.4} strokeLinejoin="round">
    <polygon points="14,-3 -18,-46 -28,-46 -14,-3" fill="#E8ECF0" /><polygon points="14,3 -18,46 -28,46 -14,3" fill="#E8ECF0" />
    <polygon points="-38,-2 -48,-18 -55,-18 -50,-2" fill="#E8ECF0" /><polygon points="-38,2 -48,18 -55,18 -50,2" fill="#E8ECF0" />
    <path d="M52,0 C48,-5 40,-6 30,-6 L-52,-4 L-56,-1.5 L-56,1.5 L-52,4 L30,6 C40,6 48,5 52,0 Z" fill="#F4F6F8" />
    <rect x={-6} y={-12} width={9} height={7} rx={2} fill="#5E7B93" /><rect x={-6} y={5} width={9} height={7} rx={2} fill="#5E7B93" />
    <rect x={-46} y={-1.2} width={14} height={2.4} fill="#4F7FC4" stroke="none" />
    <ellipse cx={42} cy={0} rx={5} ry={1.8} fill="#27323F" />
  </g>
);

/** Analogue clock face centred on (x, y), radius r; the hands show hour h (0-11.99) and minute m. */
export const ClockFace: React.FC<{ x: number; y: number; r?: number; h: number; m: number }> = ({ x, y, r = 250, h, m }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r + 24} fill="#1B1B22" stroke="#E2B95A" strokeWidth={10} />
    <circle r={r} fill="#F3EEDD" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-r + 16} x2={0} y2={-r + (i % 3 === 0 ? 62 : 38)} stroke={INK} strokeWidth={i % 3 === 0 ? 14 : 7} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
    {[12, 3, 6, 9].map((n, i) => <text key={n} x={[0, r - 100, 0, -(r - 100)][i]} y={[-(r - 118), 22, r - 78, 22][i]} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill={INK}>{n}</text>)}
    <line x1={0} y1={26} x2={0} y2={-r * 0.5} stroke={INK} strokeWidth={22} strokeLinecap="round" transform={`rotate(${(h + m / 60) * 30})`} />
    <line x1={0} y1={34} x2={0} y2={-r * 0.78} stroke="#B3262B" strokeWidth={12} strokeLinecap="round" transform={`rotate(${m * 6})`} />
    <circle r={18} fill="#B3262B" stroke={INK} strokeWidth={5} />
  </g>
);
