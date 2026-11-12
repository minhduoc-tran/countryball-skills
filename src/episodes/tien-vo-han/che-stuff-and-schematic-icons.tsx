import React from 'react';
import { SCH, FONT, backOut, clamp } from '../../engine';

// Chapter E: the pile of things Pip decides NOT to buy (flat colour glyphs, ~120 px) and the schematic line icons
// (coin, school, crate). Origin of every glyph is its centre.

const L = '#1A1222';
export type StuffKind = 'gift' | 'shoe' | 'pad' | 'phone' | 'burger' | 'bag';

export const Stuff: React.FC<{ kind: StuffKind; x: number; y: number; s?: number; rot?: number }> = ({ kind, x, y, s = 1, rot = 0 }) => {
  const g: Record<StuffKind, React.ReactNode> = {
    gift: (
      <g>
        <rect x={-62} y={-44} width={124} height={92} rx={8} fill="#E9654B" stroke={L} strokeWidth={5} />
        <rect x={-10} y={-44} width={20} height={92} fill="#FFE27A" stroke={L} strokeWidth={4} />
        <rect x={-66} y={-62} width={132} height={26} rx={6} fill="#F07E64" stroke={L} strokeWidth={5} />
        <path d="M 0 -62 q -34 -40 -44 -14 q 20 10 44 14 q 24 -4 44 -14 q -10 -26 -44 14 Z" fill="#FFE27A" stroke={L} strokeWidth={4} />
      </g>
    ),
    shoe: (
      <g>
        <path d="M -66 30 L -66 -10 Q -30 -20 -10 -50 L 14 -50 Q 20 -20 66 -4 Q 80 4 70 30 Z" fill="#F2F2EC" stroke={L} strokeWidth={5} strokeLinejoin="round" />
        <path d="M -66 30 H 70" stroke="#3E8C86" strokeWidth={14} />
        <path d="M -4 -36 l 14 8 M 6 -24 l 14 8" stroke={L} strokeWidth={4} />
        <path d="M -40 0 Q -10 -6 20 6" stroke="#E9654B" strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
    ),
    pad: (
      <g>
        <path d="M -70 -16 Q -78 40 -46 40 Q -28 40 -18 18 H 18 Q 28 40 46 40 Q 78 40 70 -16 Q 62 -40 30 -40 H -30 Q -62 -40 -70 -16 Z" fill="#6A7BD9" stroke={L} strokeWidth={5} />
        <path d="M -44 -14 h 24 M -32 -26 v 24" stroke="#F6EFE3" strokeWidth={7} strokeLinecap="round" />
        <circle cx={34} cy={-20} r={8} fill="#FFE27A" stroke={L} strokeWidth={3} />
        <circle cx={50} cy={-4} r={8} fill="#E9654B" stroke={L} strokeWidth={3} />
      </g>
    ),
    phone: (
      <g>
        <rect x={-34} y={-62} width={68} height={124} rx={12} fill="#2B2F3A" stroke={L} strokeWidth={5} />
        <rect x={-26} y={-50} width={52} height={92} rx={5} fill="#7FD4FF" />
        <circle cx={0} cy={52} r={4} fill="#8A8794" />
      </g>
    ),
    burger: (
      <g>
        <path d="M -60 -10 Q -60 -56 0 -56 Q 60 -56 60 -10 Z" fill="#E0A458" stroke={L} strokeWidth={5} />
        <rect x={-64} y={-8} width={128} height={14} rx={7} fill="#58B368" stroke={L} strokeWidth={4} />
        <rect x={-58} y={6} width={116} height={18} rx={8} fill="#8A4A32" stroke={L} strokeWidth={4} />
        <path d="M -60 28 Q -60 50 0 50 Q 60 50 60 28 Z" fill="#E0A458" stroke={L} strokeWidth={5} />
      </g>
    ),
    bag: (
      <g>
        <path d="M -50 -34 H 50 L 62 56 H -62 Z" fill="#F2B33D" stroke={L} strokeWidth={5} strokeLinejoin="round" />
        <path d="M -26 -34 Q -26 -70 0 -70 Q 26 -70 26 -34" fill="none" stroke={L} strokeWidth={6} />
        <circle cx={0} cy={10} r={16} fill="#fff" opacity={0.4} />
      </g>
    ),
  };
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>{g[kind]}</g>;
};

/** A line-icon coin with the dong sign, for the schematic. */
export const CoinIcon: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({ x, y, s = 1, on = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={on ? SCH.live : SCH.dim} strokeWidth={5} fill={on ? `${SCH.live}22` : 'none'} style={on ? { filter: `drop-shadow(0 0 10px ${SCH.glow})` } : undefined}>
    <circle r={50} /><circle r={38} strokeWidth={2.5} />
    <text y={18} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={52} fill={on ? SCH.live : SCH.dim} stroke="none">đ</text>
  </g>
);

/** A line-icon school, ~120 tall; `on` lights it. */
export const SchoolIcon: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({ x, y, s = 1, on = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={on ? SCH.live : SCH.dim} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round" style={on ? { filter: `drop-shadow(0 0 10px ${SCH.glow})` } : undefined}>
    <path d="M -64 -10 L 0 -56 L 64 -10 Z" /><path d="M -50 -10 V 48 H 50 V -10" /><path d="M -14 48 V 16 H 14 V 48" />
    <path d="M -38 6 h 14 v 14 h -14 Z M 24 6 h 14 v 14 h -14 Z" /><path d="M 0 -56 V -80 L 22 -72 L 0 -64" />
  </g>
);

/** A line-icon crate of goods; `pop` 0..1 grows it in with an overshoot. */
export const CrateIcon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  if (t < 0) return null;
  const p = backOut(clamp(t / 7));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * p})`} stroke={SCH.live} strokeWidth={5} fill={`${SCH.live}22`} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${SCH.glow})` }}>
      <rect x={-44} y={-34} width={88} height={68} rx={4} /><path d="M -44 -10 H 44 M -12 -34 V -10 M 12 -34 V -10" />
    </g>
  );
};
