import React from 'react';
import { FONT, rnd, clamp, easeOut, backOut } from '../../engine';

// Chapter C ("the cost: inflation") money props: banknotes, the black card, a card terminal, a flip price board and
// a hanging price tag. Flat fills, dark outline, drawn at 100 px-ish units; every one is a pure function of its props.

export const INK = '#1D2033';
const GOLD = '#D9B25A';
export const NOTE_COLS = ['#6FB38A', '#7FA6D6', '#D9A05A', '#B58AC9'];

/** A generic banknote (not any real design), centred, 160 x 80 at s 1. */
export const Note: React.FC<{ x: number; y: number; rot?: number; s?: number; c?: string; o?: number; label?: string }> = ({ x, y, rot = 0, s = 1, c = '#6FB38A', o = 1, label = '₫' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-80} y={-40} width={160} height={80} rx={7} fill={c} stroke={INK} strokeWidth={3.5} />
    <rect x={-70} y={-31} width={140} height={62} rx={4} fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={2.5} />
    <circle cx={0} cy={0} r={21} fill="#fff" fillOpacity={0.35} stroke="#fff" strokeOpacity={0.6} strokeWidth={2} />
    <text x={0} y={9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill={INK} fillOpacity={0.7}>{label}</text>
    <path d="M -62 -22 h 26 M -62 -12 h 18 M 36 22 h 26 M 44 12 h 18" stroke="#fff" strokeOpacity={0.5} strokeWidth={3} strokeLinecap="round" />
  </g>
);

/** A jumble of `n` notes heaped around (x, y) = the bottom middle; the heap widens as it grows. */
export const NotePile: React.FC<{ x: number; y: number; n: number; s?: number; seed?: number }> = ({ x, y, n, s = 1, seed = 3 }) => (
  <g>
    {Array.from({ length: Math.max(0, Math.floor(n)) }).map((_, i) => {
      const row = Math.floor(Math.sqrt(i * 1.6));
      const spread = 40 + row * 34;
      const px = x + (rnd(seed, i) - 0.5) * spread * s * 2;
      const py = y - 20 * s - row * 22 * s + rnd(seed + 2, i) * 8;
      return <Note key={i} x={px} y={py} rot={(rnd(seed + 1, i) - 0.5) * 50} s={0.5 * s} c={NOTE_COLS[i % 3]} />;
    })}
  </g>
);

/** The black card: matte, a gold chip and a thin gold infinity. 300 x 190 at s 1, centred. */
export const BlackCard: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-95} width={300} height={190} rx={18} fill="#17161C" stroke="#050408" strokeWidth={4} />
    <rect x={-150} y={-95} width={300} height={8} rx={4} fill="#fff" opacity={0.07} />
    <rect x={-122} y={-52} width={52} height={40} rx={8} fill={GOLD} />
    <path d="M -122 -32 h 52 M -96 -52 v 40" stroke="#8A6A2A" strokeWidth={2.5} />
    <text x={0} y={50} textAnchor="middle" fontFamily={FONT.ui} fontSize={92} fill={GOLD} fillOpacity={0.9}>∞</text>
    <path d="M 94 -44 q 12 14 0 28 M 108 -52 q 18 22 0 44" stroke={GOLD} strokeOpacity={0.7} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

/** A card terminal, centred on the body, 360 x 620 at s 1. `ok` 0..1 turns the screen to the green success. */
export const PosTerminal: React.FC<{ x: number; y: number; s?: number; ok?: number; t?: number; rot?: number }> = ({ x, y, s = 1, ok = 0, t = 0, rot = 0 }) => {
  const k = clamp(ok * 3);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={14} cy={318} rx={210} ry={22} fill="#000" opacity={0.4} />
      <rect x={-180} y={-310} width={360} height={620} rx={42} fill="#2F3342" stroke="#0E0F16" strokeWidth={5} />
      <rect x={-180} y={-310} width={360} height={14} rx={7} fill="#fff" opacity={0.12} />
      <rect x={-150} y={-262} width={300} height={190} rx={16} fill={k > 0 ? '#2DBE6C' : '#10241E'} stroke="#0E0F16" strokeWidth={4} />
      {k > 0 ? (
        <g opacity={k}>
          <circle cx={0} cy={-206} r={30} fill="#E9FFF2" />
          <path d="M -15 -206 l 11 13 l 22 -26" stroke="#2DBE6C" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={0} y={-140} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#06301B">PAYMENT</text>
          <text x={0} y={-104} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#06301B">APPROVED</text>
        </g>
      ) : (
        <text x={0} y={-160} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill="#7FE0A8" opacity={0.6 + 0.4 * Math.sin(t / 4)}>TAP</text>
      )}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-136 + (i % 3) * 94} y={-40 + Math.floor(i / 3) * 76} width={80} height={60} rx={12} fill="#3F4458" stroke="#0E0F16" strokeWidth={3} />
      ))}
    </g>
  );
};

/**
 * A flip price board on legs: the old value folds shut (p 0..0.5), the new one opens (0.5..1) in red with an up arrow.
 * 560 x 330 at s 1, x y = centre of the board.
 */
export const PriceBoard: React.FC<{ x: number; y: number; s?: number; from: string; to: string; p: number; title?: string; t?: number }> = ({ x, y, s = 1, from, to, p, title = 'SANDWICHES', t = 0 }) => {
  const q = clamp(p);
  const sy = q < 0.5 ? 1 - q * 2 : (q - 0.5) * 2;
  const txt = q < 0.5 ? from : to;
  const hot = q >= 0.5;
  const arrow = backOut(clamp((q - 0.7) / 0.3));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -190 165 L -230 330 M 190 165 L 230 330" stroke="#5A3E2A" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={0} cy={338} rx={270} ry={16} fill="#000" opacity={0.4} />
      <rect x={-280} y={-165} width={560} height={330} rx={16} fill="#8A5E3A" stroke={INK} strokeWidth={5} />
      <rect x={-262} y={-147} width={524} height={294} rx={8} fill="#1F3A33" stroke="#0E1F1A" strokeWidth={4} />
      <text x={0} y={-92} textAnchor="middle" fontFamily={FONT.hand} fontSize={52} fill="#F2E6D0" opacity={0.9}>{title}</text>
      <path d="M -200 -70 H 200" stroke="#F2E6D0" strokeOpacity={0.4} strokeWidth={3} strokeDasharray="10 8" />
      <g transform={`translate(0 30) scale(1 ${Math.max(0.02, sy)})`}>
        <text x={0} y={34} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={128} fill={hot ? '#FF7A66' : '#F7F0DD'}>{txt}</text>
      </g>
      <text x={210} y={124} textAnchor="middle" fontFamily={FONT.hand} fontSize={44} fill="#F2E6D0" opacity={0.85}>₫</text>
      {hot ? (
        <g transform={`translate(345 ${20 - Math.sin(t / 5) * 8}) scale(${arrow * 1.6})`}>
          <path d="M 0 36 V -30 M -24 -8 L 0 -36 L 24 -8" stroke="#FF5A48" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </g>
  );
};

/** A hanging price tag: string loop, punched hole, big number. 280 x 150 at s 1, x y = the tag's centre. */
export const PriceTag: React.FC<{ x: number; y: number; s?: number; rot?: number; text: string; sub?: string; c?: string; ink?: string }> = ({ x, y, s = 1, rot = 0, text, sub, c = '#F2E6D0', ink = INK }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -128 0 Q -190 -60 -190 -120" stroke="#C9B38A" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M -130 -75 L 110 -75 L 150 0 L 110 75 L -130 75 Z" fill={c} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={-108} cy={0} r={10} fill="#1B1930" stroke={INK} strokeWidth={3} />
    <text x={4} y={sub ? 14 : 28} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={text.length > 4 ? 62 : 84} fill={ink}>{text}</text>
    {sub ? <text x={4} y={52} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill={ink} opacity={0.7}>{sub}</text> : null}
  </g>
);

/** A pop-in mark ("!" or "?") over a head: x y the mark's centre, `t` the frames since it should appear. */
export const Mark: React.FC<{ x: number; y: number; t: number; ch?: string; s?: number; color?: string }> = ({ x, y, t, ch = '!', s = 1, color = '#FF5A48' }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 6));
  return (
    <g transform={`translate(${x} ${y - Math.sin(t / 6) * 3}) scale(${s * k})`}>
      <circle r={38} fill="#fff" stroke={INK} strokeWidth={4} />
      <text y={22} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill={color}>{ch}</text>
    </g>
  );
};

/** A small green success chip ("PAYMENT APPROVED") that pops in at t = 0 and fades after `hold` frames. */
export const PaidChip: React.FC<{ x: number; y: number; t: number; hold?: number; s?: number }> = ({ x, y, t, hold = 26, s = 1 }) => {
  if (t < 0 || t > hold + 8) return null;
  const k = backOut(clamp(t / 6)) * (1 - easeOut(clamp((t - hold) / 8)));
  return (
    <g transform={`translate(${x} ${y - easeOut(clamp(t / 16)) * 14}) scale(${s * k})`}>
      <rect x={-250} y={-30} width={500} height={60} rx={30} fill="#2DBE6C" stroke="#0E5A32" strokeWidth={3} />
      <path d="M -226 0 l 9 10 l 17 -20" stroke="#E9FFF2" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={20} y={9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={25} fill="#06301B" letterSpacing={1}>PAYMENT APPROVED</text>
    </g>
  );
};
