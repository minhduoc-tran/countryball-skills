import React from 'react';
import { FONT, Glow, Dust, clamp, easeOut, rnd } from '../../engine';

// Chapter C props, family beat: music notes, the money tin, the 4:00 clock face, an art-class room with easels,
// Mo's work apron, and Pip's thought bubbles with their dream icons. All pure functions of the shot clock.

export const INK = '#1D2033';

/** A drifting music note (hum), rising from (x, y); `t` is the clock, `seed` offsets the phase. */
export const MusicNote: React.FC<{ x: number; y: number; t: number; seed?: number; s?: number; color?: string }> = ({ x, y, t, seed = 0, s = 1, color = '#FFE7B3' }) => {
  const ph = ((t * 0.9 + seed * 23) % 70) / 70;
  return (
    <g transform={`translate(${x + Math.sin(ph * 7 + seed) * 18} ${y - ph * 150}) scale(${s}) rotate(${Math.sin(ph * 6 + seed) * 12})`} opacity={Math.sin(ph * Math.PI)}>
      <ellipse cx={0} cy={0} rx={13} ry={10} fill={color} transform="rotate(-20)" />
      <path d="M 11 -3 V -46 Q 24 -40 26 -26" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** The little tin where mum counts the takings: a lid with a slot, a few notes sticking out. */
export const MoneyTin: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={86} ry={10} fill="#000" opacity={0.3} />
    <rect x={-70} y={-70} width={140} height={70} rx={8} fill="#C9A24A" stroke="#6E5420" strokeWidth={5} />
    <rect x={-70} y={-70} width={140} height={14} rx={6} fill="#E8CB7A" />
    <rect x={-30} y={-52} width={60} height={9} rx={4} fill="#4A3A14" />
    <rect x={-22} y={-86} width={44} height={36} rx={4} fill="#8CC3D6" stroke="#4F8AA0" strokeWidth={3} transform="rotate(-6)" />
    <rect x={-70} y={-30} width={140} height={6} fill="#6E5420" opacity={0.25} />
  </g>
);

/** Mo's night-shift apron. (x, y) is the neck point; it hangs 150 tall at s = 1. */
export const Apron: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number }> = ({ x, y, s = 1, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <path d="M -24 -4 Q 0 -24 24 -4" stroke="#6E4A2E" strokeWidth={6} fill="none" />
    <path d="M -26 0 L -34 150 Q 0 162 34 150 L 26 0 Q 0 10 -26 0 Z" fill="#E7DCC8" stroke="#8A7A5E" strokeWidth={4} strokeLinejoin="round" />
    <rect x={-18} y={70} width={36} height={32} rx={5} fill="#D6C9AE" stroke="#8A7A5E" strokeWidth={3} />
    <path d="M -28 120 q 8 -10 14 -4 M 12 128 q 6 -8 12 -2" stroke="#C0654A" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
  </g>
);

/** An easel with a canvas; `children` is drawn on the canvas in its local space (-90..90 x -120..40). Origin: its base. */
export const Easel: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={12} fill="#000" opacity={0.25} />
    <path d="M -80 0 L -34 -250 M 80 0 L 34 -250 M 0 -20 L 0 -270" stroke="#7A4E2E" strokeWidth={12} strokeLinecap="round" />
    <rect x={-100} y={-120} width={200} height={14} rx={4} fill="#9A6A40" stroke="#4A2E20" strokeWidth={3} />
    <g transform="translate(0 -230)">
      <rect x={-104} y={-4} width={208} height={150} rx={4} fill="#F4EEDD" stroke="#4A2E20" strokeWidth={5} />
      <g transform="translate(0 70)">{children}</g>
    </g>
  </g>
);

/** The art-class room, flat and sunny: wall, big window with a morning glow, shelf of paint jars, a few paintings. */
export const ArtRoom: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E9C79A" /><stop offset="1" stopColor="#C9966A" /></linearGradient>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE2A8" /><stop offset="1" stopColor="#FFC98A" /></linearGradient>
    </defs>
    <rect x={-300} y={-300} width={2520} height={1280} fill={`url(#${id}wall)`} />
    <rect x={-300} y={760} width={2520} height={600} fill="#8A5A3C" />
    <rect x={-300} y={752} width={2520} height={14} fill="#5C3A26" />
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${-200 + i * 300} 766 L ${-420 + i * 380} 1300`} stroke="#6E4630" strokeWidth={3} opacity={0.6} />)}
    {/* window */}
    <rect x={640} y={150} width={560} height={400} rx={10} fill={`url(#${id}sky)`} stroke="#6E4630" strokeWidth={12} />
    <path d="M 920 150 V 550 M 640 350 H 1200" stroke="#6E4630" strokeWidth={10} />
    <circle cx={1060} cy={260} r={50} fill="#FFF3C8" opacity={0.9} />
    <path d="M 1200 150 L 1560 700 L 900 700 L 640 550 Z" fill="#FFE9B0" opacity={0.2} style={{ mixBlendMode: 'screen' }} />
    {/* shelf with paint jars */}
    <rect x={1320} y={330} width={420} height={14} rx={4} fill="#6E4630" />
    {['#E0533F', '#F2C14E', '#3E8C86', '#5A7FD0', '#9B5FA8', '#6FB38A'].map((c, i) => (
      <g key={c}><rect x={1344 + i * 62} y={290} width={44} height={40} rx={8} fill={c} stroke="#4A2E20" strokeWidth={3} /><rect x={1344 + i * 62} y={282} width={44} height={10} rx={3} fill="#EDE3CF" /></g>
    ))}
    {/* paintings on the wall */}
    <g transform="translate(180 230) rotate(-3)">
      <rect width={260} height={190} fill="#F4EEDD" stroke="#4A2E20" strokeWidth={6} />
      <circle cx={190} cy={60} r={30} fill="#F2C14E" /><path d="M 0 190 L 90 90 L 170 190 Z" fill="#3E8C86" /><path d="M 100 190 L 190 110 L 260 190 Z" fill="#2F6E69" />
    </g>
    <g transform="translate(1500 450) rotate(2)">
      <rect width={200} height={150} fill="#F4EEDD" stroke="#4A2E20" strokeWidth={6} />
      <path d="M 20 120 Q 100 10 180 120 Z" fill="#E0533F" /><circle cx={100} cy={90} r={22} fill="#FFE7B3" />
    </g>
    <Glow x={920} y={350} r={720} o={0.35} />
    <Dust t={t} seed={4} x0={620} y0={300} w={760} h={440} n={26} o={0.5} />
  </g>
);

export type DreamKind = 'rocket' | 'brush' | 'steth' | 'ball' | 'book' | 'star';

/** A dream icon centred on its origin, about 110 wide at s = 1. */
export const DreamIcon: React.FC<{ kind: DreamKind; s?: number }> = ({ kind, s = 1 }) => {
  const body: Record<DreamKind, React.ReactNode> = {
    rocket: (
      <g>
        <path d="M 0 -58 Q 26 -26 22 24 L -22 24 Q -26 -26 0 -58 Z" fill="#F4F0E6" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={0} cy={-14} r={11} fill="#5A9FD0" stroke={INK} strokeWidth={4} />
        <path d="M -22 8 L -42 36 L -22 28 Z M 22 8 L 42 36 L 22 28 Z" fill="#E0533F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M -10 30 Q 0 66 10 30 Z" fill="#FFB347" />
      </g>
    ),
    brush: (
      <g transform="rotate(35)">
        <rect x={-7} y={-8} width={14} height={62} rx={6} fill="#B98557" stroke={INK} strokeWidth={4} />
        <path d="M -9 -8 L 9 -8 L 7 -22 L -7 -22 Z" fill="#C9CDD6" stroke={INK} strokeWidth={3} />
        <path d="M -8 -22 Q 0 -66 8 -22 Z" fill="#E0533F" stroke={INK} strokeWidth={3} />
      </g>
    ),
    steth: (
      <g fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round">
        <path d="M -30 -44 Q -34 10 0 14 Q 34 10 30 -44" stroke="#3E8C86" />
        <path d="M 0 14 Q 0 44 30 40" stroke="#3E8C86" />
        <circle cx={36} cy={40} r={13} fill="#C9CDD6" />
      </g>
    ),
    ball: (
      <g>
        <circle r={44} fill="#F6EFE3" stroke={INK} strokeWidth={5} />
        <path d="M 0 -14 L 14 -4 L 9 12 L -9 12 L -14 -4 Z" fill={INK} />
        <path d="M 0 -14 V -44 M 14 -4 L 42 -14 M 9 12 L 24 38 M -9 12 L -24 38 M -14 -4 L -42 -14" stroke={INK} strokeWidth={4} />
      </g>
    ),
    book: (
      <g>
        <path d="M -52 -34 Q -26 -44 0 -30 Q 26 -44 52 -34 V 34 Q 26 24 0 38 Q -26 24 -52 34 Z" fill="#F4EEDD" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 0 -30 V 38" stroke={INK} strokeWidth={4} />
        <path d="M -40 -14 Q -24 -20 -10 -12 M -40 4 Q -24 -2 -10 6 M 10 -12 Q 24 -20 40 -14 M 10 6 Q 24 -2 40 4" stroke="#8A7A5E" strokeWidth={3} fill="none" />
      </g>
    ),
    star: <path d="M 0 -50 L 14 -16 L 50 -14 L 22 8 L 32 44 L 0 24 L -32 44 L -22 8 L -50 -14 L -14 -16 Z" fill="#F2C14E" stroke={INK} strokeWidth={5} strokeLinejoin="round" />,
  };
  return <g transform={`scale(${s})`}>{body[kind]}</g>;
};

/** A thought bubble: a cloud of bumps around an ellipse (cx, cy, w, h) with a tail of three dots toward (tx, ty). */
export const ThoughtBubble: React.FC<{ cx: number; cy: number; w: number; h: number; tx: number; ty: number; fill?: string; stroke?: string; o?: number; children?: React.ReactNode }> = ({
  cx, cy, w, h, tx, ty, fill = '#FFF8EA', stroke = INK, o = 1, children,
}) => {
  const n = 14;
  const bumps = Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    return { x: cx + Math.cos(a) * w * 0.46, y: cy + Math.sin(a) * h * 0.46, r: Math.min(w, h) * 0.17 };
  });
  const tail = [0.22, 0.5, 0.78].map((k, i) => ({ x: tx + (cx - tx) * (1 - k) * 0.62 + 0, y: ty + (cy + h * 0.5 - ty) * (1 - k) * 0.62, r: 8 + i * 6 }));
  return (
    <g opacity={o}>
      {[...tail, ...bumps].map((b, i) => <circle key={`s${i}`} cx={b.x} cy={b.y} r={b.r + 5} fill={stroke} />)}
      <ellipse cx={cx} cy={cy} rx={w * 0.46} ry={h * 0.46} fill={stroke} />
      {[...tail, ...bumps].map((b, i) => <circle key={`f${i}`} cx={b.x} cy={b.y} r={b.r} fill={fill} />)}
      <ellipse cx={cx} cy={cy} rx={w * 0.46 - 4} ry={h * 0.46 - 4} fill={fill} />
      {children}
    </g>
  );
};

/** The first bubble's text, in the hand face. */
export const BubbleText: React.FC<{ x: number; y: number; lines: string[]; size?: number; color?: string; o?: number }> = ({ x, y, lines, size = 54, color = INK, o = 1 }) => (
  <g opacity={o}>
    {lines.map((l, i) => <text key={i} x={x} y={y + i * size * 1.1} textAnchor="middle" fontFamily={FONT.hand} fontSize={size} fill={color}>{l}</text>)}
  </g>
);

/** Little pop particles for the second bubble bursting at (x, y), t = frames since the pop. */
export const PopBurst: React.FC<{ x: number; y: number; t: number; r?: number; color?: string }> = ({ x, y, t, r = 160, color = '#8D93A8' }) => {
  if (t < 0 || t > 20) return null;
  const k = easeOut(clamp(t / 12));
  return (
    <g opacity={1 - clamp((t - 8) / 12)}>
      <circle cx={x} cy={y} r={r * (0.6 + 0.5 * k)} fill="none" stroke={color} strokeWidth={6 * (1 - k) + 1} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + rnd(3, i) * 0.4;
        const d = r * (0.5 + 0.9 * k) * (0.8 + rnd(5, i) * 0.4);
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={7 * (1 - k) + 2} fill={color} />;
      })}
    </g>
  );
};
