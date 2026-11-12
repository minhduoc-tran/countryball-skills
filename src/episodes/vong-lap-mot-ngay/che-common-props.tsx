import React from 'react';
import { clamp, easeOut, backOut, FONT, UI } from '../../engine';
import { PAL } from './kit-palette';

// Chapter E shared bits (screen or world space, pure functions of t). x, y = CENTRE unless said.
//   <Pill x y text t at? size? col? />   a mono readout on a dark pill that pops in (backOut) at frame `at`.
//   <CrossMark x y h t dur? />           a red X drawing on from t = 0 (two strokes), half-size h.
//   <SpeechBubble x y w h t at tail? children />  a cream rounded bubble with a tail toward (tail.x, tail.y) (local
//       to the bubble centre), popping in at `at`; children drawn in bubble-local coordinates.
//   <NoteGlyph x y s col? />             a music note (two beamed quavers) for the piano.
//   <QMark x y s t />                    a bobbing hand-drawn "?" (the unknown of Thursday).

export const Pill: React.FC<{ x: number; y: number; text: string; t: number; at?: number; size?: number; col?: string; o?: number }> = ({ x, y, text, t, at = 0, size = 44, col = UI.text, o = 0.84 }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 8));
  const w = text.length * size * 0.64 + 64;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={size * 0.95} fill={UI.pill} opacity={o} />
      <text y={size * 0.36} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={col} letterSpacing={2}>{text}</text>
    </g>
  );
};

export const CrossMark: React.FC<{ x: number; y: number; h: number; t: number; dur?: number }> = ({ x, y, h, t, dur = 8 }) => {
  const p = easeOut(clamp(t / dur));
  if (p <= 0) return null;
  const q = clamp(p * 2);
  const q2 = clamp(p * 2 - 1);
  return (
    <g stroke="#FF4A3A" strokeWidth={h * 0.16} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 10px #FF4A3A88)' }}>
      <path d={`M ${x - h} ${y - h} L ${x - h + 2 * h * q} ${y - h + 2 * h * q}`} />
      {q2 > 0 ? <path d={`M ${x + h} ${y - h} L ${x + h - 2 * h * q2} ${y - h + 2 * h * q2}`} /> : null}
    </g>
  );
};

export const SpeechBubble: React.FC<{ x: number; y: number; w: number; h: number; t: number; at?: number; tail?: { x: number; y: number }; children?: React.ReactNode; fill?: string }> = ({ x, y, w, h, t, at = 0, tail, children, fill = '#FFF6E4' }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 7));
  const r = Math.min(h / 2, 40);
  const tx = tail ? tail.x : -w * 0.25;
  const ty = tail ? tail.y : h * 0.9;
  const bx = clamp(tx, -w / 2 + r + 20, w / 2 - r - 40);
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx={r} fill="#000" opacity={0.3} />
      <path d={`M ${bx} ${h / 2 - 4} L ${tx} ${ty} L ${bx + 40} ${h / 2 - 4} Z`} fill={fill} stroke="#14121A" strokeWidth={6} strokeLinejoin="round" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill={fill} stroke="#14121A" strokeWidth={6} />
      <path d={`M ${bx + 4} ${h / 2 - 3} L ${bx + 36} ${h / 2 - 3}`} stroke={fill} strokeWidth={8} />
      {children}
    </g>
  );
};

export const NoteGlyph: React.FC<{ x: number; y: number; s?: number; col?: string; rot?: number; o?: number }> = ({ x, y, s = 1, col = '#FFE27A', rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o} style={{ filter: 'drop-shadow(0 0 8px rgba(255,226,122,0.6))' }}>
    <ellipse cx={-22} cy={22} rx={16} ry={12} fill={col} stroke="#2A1A14" strokeWidth={3} transform="rotate(-20 -22 22)" />
    <ellipse cx={26} cy={14} rx={16} ry={12} fill={col} stroke="#2A1A14" strokeWidth={3} transform="rotate(-20 26 14)" />
    <path d="M -8 18 L -8 -40 L 40 -50 L 40 10" stroke="#2A1A14" strokeWidth={10} fill="none" strokeLinejoin="round" />
    <path d="M -8 18 L -8 -40 L 40 -50 L 40 10" stroke={col} strokeWidth={5} fill="none" strokeLinejoin="round" />
  </g>
);

export const QMark: React.FC<{ x: number; y: number; s?: number; t: number; at?: number; col?: string }> = ({ x, y, s = 1, t, at = 0, col = PAL.dawnGold }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 9));
  const bob = Math.sin((t - at) / 8) * 8;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${Math.sin((t - at) / 11) * 8}) scale(${s * k})`}>
      <text textAnchor="middle" y={40} fontFamily={FONT.title} fontWeight={800} fontSize={130} fill={col} stroke="#2A1A14" strokeWidth={14} paintOrder="stroke">?</text>
    </g>
  );
};
