import React from 'react';
import { FONT } from '../engine/fonts';
import { backOut, clamp, Pt } from './fx-math';

// Speech bubble (Bricolage title font, thick outline, tail towards the speaker) and the small props a ball holds
// beside it: document "HIỆP ĐỊNH", pen, binoculars. All pure functions of props; the bubble pops in when given t and at.

const INK = '#111';

/** Speech bubble centred on (x, y). Text is split on "\n". The tail points at (tipX, tipY), e.g. the speaker's head.
 *  With `t` and `at` it pops in (back-ease, 8 frames) from the tail tip; without them it is always shown. */
export const SpeechBubble: React.FC<{
  x: number; y: number; text: string; tipX: number; tipY: number; size?: number; fill?: string; color?: string; t?: number; at?: number;
}> = ({ x, y, text, tipX, tipY, size = 34, fill = '#FFFFFF', color = '#15151A', t, at = 0 }) => {
  const k = t === undefined ? 1 : backOut(clamp((t - at) / 8));
  if (k <= 0.001) return null;
  const lines = text.split('\n'), lh = size * 1.15;
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.56 + size * 1.1, h = lines.length * lh + size * 0.7;
  const sw = Math.max(4, size * 0.14);
  // tail: leaves the rectangle edge nearest the tip, two base points either side
  const dx = tipX - x, dy = tipY - y, horiz = Math.abs(dx) / w > Math.abs(dy) / h;
  const base = Math.min(size * 0.55, (horiz ? h : w) * 0.3), off = horiz ? [0, base] : [base, 0];
  const edge: Pt = horiz ? [x + Math.sign(dx) * w / 2, clamp(y + dy * 0.3, y - h / 2 + base, y + h / 2 - base)]
    : [clamp(x + dx * 0.3, x - w / 2 + base, x + w / 2 - base), y + Math.sign(dy) * h / 2];
  const b1: Pt = [edge[0] - off[0], edge[1] - off[1]], b2: Pt = [edge[0] + off[0], edge[1] + off[1]];
  // fill-only patch that hides the rectangle border between the tail's base points (shrunk so the tail edges stay inked)
  const vl = Math.hypot(tipX - edge[0], tipY - edge[1]) || 1, v: Pt = [(tipX - edge[0]) / vl, (tipY - edge[1]) / vl], bl = Math.hypot(b2[0] - b1[0], b2[1] - b1[1]) || 1;
  const u: Pt = [(b2[0] - b1[0]) / bl, (b2[1] - b1[1]) / bl], m = sw * 0.6;
  const patch = [[b1[0] + u[0] * m - v[0] * sw, b1[1] + u[1] * m - v[1] * sw], [b2[0] - u[0] * m - v[0] * sw, b2[1] - u[1] * m - v[1] * sw],
    [b2[0] - u[0] * m + v[0] * sw * 1.2, b2[1] - u[1] * m + v[1] * sw * 1.2], [b1[0] + u[0] * m + v[0] * sw * 1.2, b1[1] + u[1] * m + v[1] * sw * 1.2]].join(' ');
  return (
    <g transform={`translate(${tipX},${tipY}) scale(${k}) translate(${-tipX},${-tipY})`}>
      <polygon points={`${b1} ${tipX},${tipY} ${b2}`} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={size * 0.7} fill={fill} stroke={INK} strokeWidth={sw} />
      <polygon points={patch} fill={fill} />
      {lines.map((l, i) => (
        <text key={i} x={x} y={y - h / 2 + size * 0.35 + lh * (i + 0.8)} textAnchor="middle" fontFamily={FONT.title} fontWeight={800}
          fontSize={size} fill={color}>{l}</text>
      ))}
    </g>
  );
};

type PropBox = { x: number; y: number; s?: number; rot?: number };
const place = ({ x, y, s = 1, rot = 0 }: PropBox) => `translate(${x},${y}) rotate(${rot}) scale(${s})`;

/** Paper document titled HIỆP ĐỊNH with text lines, a red seal and a ribbon. About 90 x 120 px at s = 1. */
export const DocumentProp: React.FC<PropBox & { title?: string }> = ({ title = 'HIỆP ĐỊNH', ...p }) => (
  <g transform={place(p)}>
    <rect x={-45} y={-60} width={90} height={120} rx={6} fill="#F6F0DC" stroke={INK} strokeWidth={5} />
    <text y={-28} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={title.length > 8 ? 15 : 18} fill="#1E1E24">{title}</text>
    <line x1={-30} y1={-18} x2={30} y2={-18} stroke="#1E1E24" strokeWidth={3} />
    {[-2, 8, 18, 28].map((y, i) => <line key={y} x1={-30} y1={y} x2={i === 3 ? 6 : 30} y2={y} stroke="#8A8470" strokeWidth={4} strokeLinecap="round" />)}
    <circle cx={22} cy={44} r={11} fill="#C8322A" stroke={INK} strokeWidth={3} />
    <path d="M16,52 L12,66 L22,60 L30,66 L28,52 Z" fill="#C8322A" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

/** Fountain pen lying along +x (tip right). About 110 px long at s = 1. */
export const PenProp: React.FC<PropBox & { color?: string }> = ({ color = '#1F3E8A', ...p }) => (
  <g transform={place(p)}>
    <path d="M-55,-8 L28,-8 L44,0 L28,8 L-55,8 Q-62,0 -55,-8 Z" fill={color} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
    <path d="M28,-8 L44,0 L28,8 Z" fill="#E8C34A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M44,0 L58,0" stroke={INK} strokeWidth={4} strokeLinecap="round" />
    <line x1={-48} y1={-3} x2={14} y2={-3} stroke="#fff" strokeWidth={3} opacity={0.5} strokeLinecap="round" />
    <rect x={-46} y={-12} width={26} height={5} rx={2} fill="#C9A227" stroke={INK} strokeWidth={2.5} />
  </g>
);

/** Binoculars, lenses pointing up (rotate to aim). About 100 x 80 px at s = 1. */
export const BinocularsProp: React.FC<PropBox> = (p) => (
  <g transform={place(p)}>
    {[-1, 1].map((s) => (
      <g key={s}>
        <rect x={s * 26 - 18} y={-38} width={36} height={64} rx={10} fill="#3B4048" stroke={INK} strokeWidth={5} />
        <rect x={s * 26 - 22} y={-48} width={44} height={20} rx={7} fill="#2A2E34" stroke={INK} strokeWidth={5} />
        <ellipse cx={s * 26} cy={-48} rx={15} ry={6} fill="#6FA8D6" stroke={INK} strokeWidth={3} />
      </g>
    ))}
    <rect x={-14} y={-10} width={28} height={16} rx={4} fill="#555B64" stroke={INK} strokeWidth={4} />
  </g>
);
