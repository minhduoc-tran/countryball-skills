import React from 'react';
import { clamp, easeOut, backOut, rnd, Bokeh, Glow, FONT } from '../../engine';

// Chapter D props (2/4): the tips board (1 2 3), warm backdrops, study cards with a source tag, the "ĐÓ LÀ THẬT" stamp,
// hearts, a light bulb, a maple leaf and two-bar charts. All pure functions of t (frames, 30 fps).

export const CREAM = '#F6EFE3';
export const INK = '#2A1830';

/** Flat warm gradient with soft bokeh; `memory` goes sepia-brown (study cards). */
export const WarmBackdrop: React.FC<{ id: string; t: number; memory?: boolean }> = ({ id, t, memory = false }) => (
  <g>
    <defs>
      <radialGradient id={`${id}bg`} cx="0.5" cy="0.42" r="0.85">
        <stop offset="0" stopColor={memory ? '#6A4A38' : '#8A4E3E'} />
        <stop offset="1" stopColor={memory ? '#2A1B18' : '#2C1A2E'} />
      </radialGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1880} fill={`url(#${id}bg)`} />
    <Bokeh seed={7} n={12} x0={0} y0={0} w={1920} h={1080} t={t} o={0.16} />
    <Glow x={960} y={460} r={760} o={0.35} />
  </g>
);

export const Heart: React.FC<{ x: number; y: number; s?: number; o?: number; color?: string }> = ({ x, y, s = 1, o = 1, color = '#FF6F91' }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 28 C -46 -6 -34 -40 -14 -40 C -4 -40 0 -32 0 -26 C 0 -32 6 -40 16 -40 C 36 -40 46 -6 0 28 Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={o} />
);

/** Hearts drifting up from (x, y), staggered; n of them. */
export const HeartsRise: React.FC<{ x: number; y: number; t: number; n?: number; s?: number }> = ({ x, y, t, n = 4, s = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = clamp((t - i * 6) / 40);
      return p > 0 && p < 1 ? <Heart key={i} x={x + (rnd(5, i) - 0.5) * 140 * s + Math.sin(t / 7 + i) * 10} y={y - p * 190 * s} s={0.5 * s * backOut(clamp(p * 5))} o={1 - p * p} /> : null;
    })}
  </g>
);

export const Bulb: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const k = backOut(clamp(t / 8));
  return t < 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <Glow x={0} y={0} r={190} o={0.7} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.2;
        return <path key={i} d={`M ${Math.cos(a) * 84} ${Math.sin(a) * 84} L ${Math.cos(a) * 112} ${Math.sin(a) * 112}`} stroke="#FFE27A" strokeWidth={8} strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(t / 3 + i)} />;
      })}
      <path d="M -26 40 L 26 40 L 22 62 L -22 62 Z" fill="#9A9AA8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -24 36 Q -64 0 -54 -34 Q -44 -76 0 -76 Q 44 -76 54 -34 Q 64 0 24 36 Z" fill="#FFE27A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -14 34 L -14 8 L 0 -6 L 14 8 L 14 34" fill="none" stroke="#E8A93A" strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};

const TIP_ICONS: React.FC<{ on: boolean }>[] = [
  ({ on }) => (
    <g stroke={on ? '#FFE27A' : '#BFA9A0'} strokeWidth={9} fill="none" strokeLinecap="round">
      <circle cy={8} r={52} />
      <path d="M 0 8 L 0 -22 M 0 8 L 22 20 M -14 -62 L 14 -62" />
    </g>
  ),
  ({ on }) => (
    <g stroke={on ? '#FFE27A' : '#BFA9A0'} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={-64} y={-34} width={54} height={68} rx={12} />
      <rect x={10} y={-34} width={54} height={68} rx={12} />
      <path d="M -6 0 L 6 0 M 0 -8 L 8 0 L 0 8" />
    </g>
  ),
  ({ on }) => <path d="M 0 52 C -80 -6 -58 -64 -26 -64 C -8 -64 0 -50 0 -40 C 0 -50 8 -64 26 -64 C 58 -64 80 -6 0 52 Z" fill="none" stroke={on ? '#FF8FB0' : '#BFA9A0'} strokeWidth={9} strokeLinejoin="round" />,
];

/** The three tips as tiles "1 2 3" centred on (x, y); tile `active` (1..3) is lit and bigger. Tiles pop at t = 0, 4, 8. */
export const Tips: React.FC<{ x: number; y: number; t: number; active: number; s?: number; lit?: number }> = ({ x, y, t, active, s = 1, lit = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => {
      const k = backOut(clamp((t - i * 4) / 8));
      const on = i + 1 === active;
      const grow = on ? 1 + 0.28 * easeOut(clamp((t - 10 - lit) / 8)) : 1;
      const Icon = TIP_ICONS[i];
      return (
        <g key={i} transform={`translate(${(i - 1) * 330} 0) scale(${k * grow})`} opacity={k > 0 ? (on || active === 0 ? 1 : 0.62) : 0}>
          <rect x={-130} y={-130} width={260} height={260} rx={44} fill={on ? '#5A2E3E' : '#3A2438'} stroke={on ? '#FFE27A' : '#8A6A70'} strokeWidth={on ? 8 : 5} style={on ? { filter: 'drop-shadow(0 0 30px rgba(255,200,90,0.6))' } : undefined} />
          <g transform="translate(0 6)"><Icon on={on} /></g>
          <circle cx={-104} cy={-104} r={34} fill={on ? '#FFE27A' : '#6E5560'} stroke={INK} strokeWidth={5} />
          <text x={-104} y={-90} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={44} fill={INK}>{i + 1}</text>
        </g>
      );
    })}
  </g>
);

/** The rubber stamp "ĐÓ LÀ THẬT": slams in at t = 0 (big to size with a ring), rotated, with a tick. */
export const Stamp: React.FC<{ x: number; y: number; t: number; text?: string; s?: number }> = ({ x, y, t, text = 'ĐÓ LÀ THẬT', s = 1 }) => {
  if (t < 0) return null;
  const k = 1 + 1.6 * (1 - easeOut(clamp(t / 6)));
  const ring = clamp((t - 5) / 12);
  return (
    <g transform={`translate(${x} ${y}) rotate(-7) scale(${s * k})`} opacity={clamp(t / 3)}>
      {ring > 0 && ring < 1 ? <rect x={-380 - ring * 80} y={-90 - ring * 50} width={760 + ring * 160} height={180 + ring * 100} rx={40} fill="none" stroke="#5BE08A" strokeWidth={6} opacity={1 - ring} /> : null}
      <rect x={-380} y={-90} width={760} height={180} rx={34} fill="#0E2A1C" opacity={0.86} />
      <rect x={-380} y={-90} width={760} height={180} rx={34} fill="none" stroke="#5BE08A" strokeWidth={12} />
      <path d="M -342 4 L -312 36 L -264 -32" stroke="#5BE08A" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={50} y={32} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={92} fill="#5BE08A" letterSpacing={2}>{text}</text>
    </g>
  );
};

/** A study card: cream paper with tape and a drop shadow, `children` drawn in its local space (-w/2..w/2, -h/2..h/2); the source tag pops under it at tagT. */
export const StudyCard: React.FC<{ x: number; y: number; w: number; h: number; t: number; rot?: number; tag?: string; tagT?: number; children?: React.ReactNode; flip?: boolean }> = ({
  x, y, w, h, t, rot = -2, tag, tagT = 14, children, flip = true,
}) => {
  const k = backOut(clamp(t / 9));
  const turn = flip ? easeOut(clamp(t / 10)) : 1;
  const tg = backOut(clamp((t - tagT) / 8));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${Math.max(0.01, turn) * k} ${k})`} opacity={t < 0 ? 0 : 1}>
      <rect x={-w / 2 + 14} y={-h / 2 + 18} width={w} height={h} rx={14} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={CREAM} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.05} rx={14} fill="#E6DCC6" />
      <rect x={-70} y={-h / 2 - 22} width={140} height={44} fill="#E9D58A" opacity={0.85} transform="rotate(-3)" />
      {children}
      {tag && tg > 0 ? (
        <g transform={`translate(0 ${h / 2 + 26}) scale(${tg})`}>
          <rect x={-tag.length * 13.5 - 28} y={-34} width={tag.length * 27 + 56} height={68} rx={34} fill="#0B0816" opacity={0.88} />
          <rect x={-tag.length * 13.5 - 28} y={-34} width={tag.length * 27 + 56} height={68} rx={34} fill="none" stroke={CREAM} strokeWidth={3} opacity={0.8} />
          <text y={12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill={CREAM}>{tag}</text>
        </g>
      ) : null}
    </g>
  );
};

/** A red maple leaf, about 160 wide, centred. */
export const MapleLeaf: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -84 L 18 -46 L 46 -58 L 40 -14 L 80 -22 L 62 14 L 84 30 L 30 44 L 34 70 L 6 62 L 6 92 L -6 92 L -6 62 L -34 70 L -30 44 L -84 30 L -62 14 L -80 -22 L -40 -14 L -46 -58 L -18 -46 Z" fill="#D63A32" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 0 84 L 0 -50 M 0 20 L -40 -4 M 0 20 L 40 -4" stroke="#8E1E1E" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

/** Two bars on a baseline (x, y = the baseline centre): `h1`, `h2` heights (0..1 of `maxH`), with labels under them. */
export const TwoBars: React.FC<{ x: number; y: number; h1: number; h2: number; maxH?: number; l1: string; l2: string; c1?: string; c2?: string; w?: number }> = ({
  x, y, h1, h2, maxH = 440, l1, l2, c1 = '#E0644E', c2 = '#5BC98A', w = 190,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-360} y={0} width={720} height={10} rx={5} fill={CREAM} opacity={0.8} />
    {[[-170, h1, c1, l1], [170, h2, c2, l2]].map(([bx, bh, c, l], i) => (
      <g key={i}>
        <rect x={(bx as number) - w / 2} y={-(bh as number) * maxH} width={w} height={(bh as number) * maxH} rx={14} fill={c as string} stroke={INK} strokeWidth={6} />
        <rect x={(bx as number) - w / 2 + 14} y={-(bh as number) * maxH + 12} width={26} height={Math.max(0, (bh as number) * maxH - 24)} rx={8} fill="#FFF" opacity={0.2} />
        <text x={bx as number} y={62} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={CREAM}>{l as string}</text>
      </g>
    ))}
  </g>
);

/** A "ĐÓ LÀ THẬT"-free big caption in the title face with a heavy outline, popping at t = 0. */
export const BigWord: React.FC<{ x: number; y: number; t: number; text: string; size?: number; color?: string }> = ({ x, y, t, text, size = 150, color = '#FFE27A' }) => (
  t < 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${backOut(clamp(t / 8))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={size} fill={color} stroke={INK} strokeWidth={size / 7} paintOrder="stroke" letterSpacing={2} style={{ filter: 'drop-shadow(0 0 24px rgba(255,200,90,0.45))' }}>{text}</text>
    </g>
  )
);

/** A small mono pill (the "Viết ở phần bình luận nhé" style) popping at t = 0. */
export const MonoPill: React.FC<{ x: number; y: number; t: number; text: string; size?: number }> = ({ x, y, t, text, size = 40 }) => {
  if (t < 0) return null;
  const w = text.length * size * 0.62 + 80;
  return (
    <g transform={`translate(${x} ${y}) scale(${backOut(clamp(t / 9))})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={size} fill="#2A1830" opacity={0.86} />
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={size} fill="none" stroke={CREAM} strokeWidth={3} opacity={0.85} />
      <text y={size * 0.34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={CREAM}>{text}</text>
    </g>
  );
};
