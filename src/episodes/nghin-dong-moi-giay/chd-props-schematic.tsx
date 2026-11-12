import React from 'react';
import { SCH, FONT, mixHex, clamp } from '../../engine';

// Chapter D props for the schematic shots (lottery, inflation): a lottery ticket, a bánh mì, a chat bubble, a banknote,
// piles of notes and goods, a price tag. Flat fills with a cream line, on the blueprint ground. `fade` 0..1 greys a
// prop out (joy fading, value draining).

// Fading keeps each colour's lightness (so the herbs and the crust still read apart) and drains its hue to grey.
const col = (c: string, fade: number) => {
  const v = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const l = Math.round((0.3 * v[0] + 0.59 * v[1] + 0.11 * v[2]) * 0.85 + 20);
  const g = `#${[l, l, l + 6].map((n) => Math.min(255, n).toString(16).padStart(2, '0')).join('')}`;
  return mixHex(c, g, fade);
};

/** A lottery ticket (notched sides, a star, number boxes). About 230 x 120 at s 1. */
export const LotteryTicket: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} strokeLinejoin="round">
    <path d="M -115 -60 H 115 V -14 A 14 14 0 0 0 115 14 V 60 H -115 V 14 A 14 14 0 0 0 -115 -14 Z" fill="#E9B94A" stroke="#6A4A12" strokeWidth={4} />
    <path d="M -115 -60 H 115 V -44 H -115 Z" fill="#C8432F" />
    <text x={0} y={-47} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={13} fill="#FFF3DC" letterSpacing={4}>XỔ SỐ</text>
    <path d="M -78 -16 l 6 14 l 15 1 l -12 10 l 4 15 l -13 -8 l -13 8 l 4 -15 l -12 -10 l 15 -1 Z" fill="#FFF3DC" stroke="#6A4A12" strokeWidth={2} transform="translate(8 8) scale(0.8)" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={-30 + i * 28} y={-12} width={22} height={34} rx={4} fill="#FFF3DC" stroke="#6A4A12" strokeWidth={2} />
        <text x={-19 + i * 28} y={13} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#2A1A08">{[7, 1, 9, 4, 2][i]}</text>
      </g>
    ))}
    <path d="M -100 42 H 100" stroke="#6A4A12" strokeWidth={2} strokeDasharray="6 5" />
  </g>
);

/** A bánh mì from the side: crust with slashes, a filling of herbs and pickle, steam when fresh. About 280 long at s 1. */
export const BanhMi: React.FC<{ x: number; y: number; s?: number; rot?: number; fade?: number; t?: number; bite?: number }> = ({ x, y, s = 1, rot = 0, fade = 0, t = 0, bite = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx={0} cy={50} rx={140} ry={12} fill="#000" opacity={0.28} />
    <path d="M -135 12 Q -140 -34 -96 -40 L 96 -40 Q 140 -34 135 12 Q 130 44 90 46 L -90 46 Q -130 44 -135 12 Z" fill={col('#D9A15A', fade)} stroke={col('#7A4A1E', fade)} strokeWidth={4} />
    <path d="M -120 -2 Q 0 20 120 -2 L 120 16 Q 0 36 -120 16 Z" fill={col('#F1E2C4', fade)} />
    <path d="M -112 4 Q -70 -22 -40 6 Q -10 -20 24 6 Q 60 -22 112 4" stroke={col('#5BA84A', fade)} strokeWidth={9} fill="none" />
    <path d="M -80 14 H 90" stroke={col('#E2694A', fade)} strokeWidth={7} />
    {[-70, -25, 25, 70].map((cx) => (
      <path key={cx} d={`M ${cx - 12} -34 Q ${cx} -12 ${cx + 10} -34`} stroke={col('#F7D9A0', fade)} strokeWidth={5} fill="none" />
    ))}
    {bite > 0 ? <circle cx={134} cy={6} r={34 * bite} fill={SCH.ground} /> : null}
    {fade < 0.5
      ? [-40, 0, 40].map((k, i) => (
          <path key={i} d={`M ${k} -52 q 14 -22 0 -44 q -14 -22 0 -44`} stroke="#F6EFE3" strokeWidth={5} fill="none" opacity={0.5 * (1 - fade * 2) * (0.6 + 0.4 * Math.sin(t / 6 + i))} transform={`translate(0 ${-((t * 1.1 + i * 14) % 26)})`} />
        ))
      : null}
  </g>
);

/** A chat bubble with three dots, tail bottom-left. About 230 x 150 at s 1. */
export const ChatBubble: React.FC<{ x: number; y: number; s?: number; fade?: number; t?: number }> = ({ x, y, s = 1, fade = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <path d="M -115 -65 H 115 Q 130 -65 130 -50 V 30 Q 130 45 115 45 H -40 L -85 80 L -76 45 H -115 Q -130 45 -130 30 V -50 Q -130 -65 -115 -65 Z" fill={col('#58B3E8', fade)} stroke={col('#1D5A82', fade)} strokeWidth={5} />
    {[-50, 0, 50].map((cx, i) => (
      <circle key={i} cx={cx} cy={-10 + (fade < 0.4 ? Math.sin(t / 5 + i) * 5 : 0)} r={11} fill={col('#F6FBFF', fade)} />
    ))}
  </g>
);

/** A banknote (not a real one): green with a circle portrait and the amount. About 300 x 150 at s 1. */
export const Banknote: React.FC<{ x: number; y: number; s?: number; rot?: number; fade?: number; text?: string }> = ({ x, y, s = 1, rot = 0, fade = 0, text = '1.000 đ' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-75} width={300} height={150} rx={12} fill={col('#3E9A6A', fade)} stroke={col('#17482F', fade)} strokeWidth={5} />
    <rect x={-136} y={-61} width={272} height={122} rx={7} fill="none" stroke={col('#A8E4C0', fade)} strokeWidth={2.5} />
    <circle cx={-80} cy={0} r={36} fill={col('#2A7A52', fade)} stroke={col('#A8E4C0', fade)} strokeWidth={3} />
    <circle cx={-80} cy={-8} r={11} fill={col('#A8E4C0', fade)} /><path d="M -100 22 Q -80 2 -60 22 Z" fill={col('#A8E4C0', fade)} />
    <text x={44} y={12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={text.length > 7 ? 30 : 36} fill={col('#EFFFF4', fade)}>{text}</text>
  </g>
);

/** A pile of notes: n slabs stacked (fractional n grows the top one). Footprint about 220 wide; x, y the base centre. */
export const MoneyPile: React.FC<{ x: number; y: number; n: number; s?: number }> = ({ x, y, n, s = 1 }) => {
  const full = Math.floor(n);
  const part = n - full;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={150} ry={14} fill="#000" opacity={0.3} />
      {Array.from({ length: full + 1 }).map((_, i) => {
        const h = i === full ? 24 * part : 24;
        if (h <= 0.5) return null;
        return (
          <g key={i} transform={`translate(${((i * 37) % 23) - 11} ${-(i + 1) * 24 + (24 - h)})`}>
            <rect x={-105} y={0} width={210} height={h} rx={5} fill={i % 2 ? '#3E9A6A' : '#4DAA78'} stroke="#17482F" strokeWidth={3} />
            {h > 20 ? <rect x={-60} y={6} width={120} height={10} rx={4} fill="#A8E4C0" opacity={0.55} /> : null}
          </g>
        );
      })}
    </g>
  );
};

/** A pile of goods: n crates stacked two-wide. x, y the base centre. */
export const GoodsPile: React.FC<{ x: number; y: number; n: number; s?: number }> = ({ x, y, n, s = 1 }) => {
  const full = Math.floor(n);
  const part = n - full;
  const cr = ['#C9944A', '#D9A95E'];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={140} ry={14} fill="#000" opacity={0.3} />
      {Array.from({ length: full + 1 }).map((_, i) => {
        const sc = i === full ? part : 1;
        if (sc <= 0.05) return null;
        const row = Math.floor(i / 2);
        const cx = (i % 2 ? 1 : -1) * 62 * (row % 2 ? 0.2 : 1);
        return (
          <g key={i} transform={`translate(${cx} ${-row * 80}) scale(${sc})`}>
            <rect x={-60} y={-80} width={120} height={80} rx={5} fill={cr[i % 2]} stroke="#5A3A12" strokeWidth={3} />
            <path d="M -60 -50 H 60 M 0 -80 V -50" stroke="#5A3A12" strokeWidth={3} />
          </g>
        );
      })}
    </g>
  );
};

/** A price tag on a string: hole, the text, a bevelled top corner. `sw` swings it in degrees. */
export const PriceTag: React.FC<{ x: number; y: number; s?: number; sw?: number; text: string; size?: number; color?: string }> = ({ x, y, s = 1, sw = 0, text, size = 64, color = '#2A1A08' }) => {
  const w = Math.max(240, text.length * size * 0.62 + 90);
  return (
    <g transform={`translate(${x} ${y}) rotate(${sw}) scale(${s})`}>
      <path d="M 0 -150 L 0 0" stroke={SCH.line} strokeWidth={4} />
      <path d={`M ${-w / 2 + 40} 0 L ${w / 2} 0 V 120 H ${-w / 2} V 40 Z`} fill="#F4E9CE" stroke="#7A5A22" strokeWidth={5} strokeLinejoin="round" />
      <circle cx={-w / 2 + 38} cy={34} r={9} fill={SCH.ground} stroke="#7A5A22" strokeWidth={3} />
      <text x={22} y={86} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={color}>{text}</text>
    </g>
  );
};

/** 25000 -> "25.000": Vietnamese thousands dots. */
export const dots = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const lerpK = (a: number, b: number, k: number) => a + (b - a) * clamp(k);
