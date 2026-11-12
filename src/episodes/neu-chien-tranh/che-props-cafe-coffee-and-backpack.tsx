import React from 'react';
import { FONT, Glow, Phone, clamp, easeOut, backOut } from '../../engine';

// Chapter E props for the return: the old cafe closed up (shutter, dust, a faded sign, stacked stools), plastic stools,
// a glass of iced milk coffee (cà phê sữa đá), a schoolbag, and a phone showing Mo's message. Pure functions of t.

/** The closed cafe's front, drawn flat: (x, y) is the middle of its ground line; about 760 wide, 560 tall at s = 1. */
export const CafeFront: React.FC<{ x: number; y: number; s?: number; t: number; id: string }> = ({ x, y, s = 1, t, id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <pattern id={`${id}rib`} width={20} height={14} patternUnits="userSpaceOnUse"><rect width={20} height={14} fill="#8E93A0" /><rect width={20} height={5} fill="#B3B8C4" /><rect y={11} width={20} height={3} fill="#5E6270" /></pattern>
    </defs>
    <ellipse cx={0} cy={4} rx={420} ry={16} fill="#000" opacity={0.35} />
    {/* wall and upper window */}
    <rect x={-380} y={-560} width={760} height={560} fill="#C9B79A" />
    <rect x={-380} y={-560} width={760} height={560} fill="#6E5A44" opacity={0.18} />
    <path d="M -300 -130 Q -250 -330 -280 -540 M 240 -540 Q 280 -400 300 -250" stroke="#8A7458" strokeWidth={6} opacity={0.35} fill="none" />
    <rect x={-250} y={-520} width={180} height={150} fill="#3A4A58" stroke="#5A4A3A" strokeWidth={10} />
    <path d="M -160 -520 V -370 M -250 -445 H -70" stroke="#5A4A3A" strokeWidth={6} />
    <rect x={-250} y={-520} width={180} height={150} fill="#7A8CA0" opacity={0.2} />
    {/* faded sign, one screw loose */}
    <g transform="rotate(-2 80 -440)">
      <rect x={-20} y={-500} width={380} height={110} rx={10} fill="#8A4A36" stroke="#4A2A20" strokeWidth={6} />
      <rect x={-8} y={-488} width={356} height={86} rx={6} fill="none" stroke="#D8C49A" strokeWidth={3} opacity={0.6} />
      <text x={170} y={-421} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={76} fill="#D8C49A" opacity={0.65}>CÀ PHÊ</text>
      <path d="M -10 -392 L 30 -380" stroke="#4A2A20" strokeWidth={5} />
    </g>
    {/* the shutter, pulled down, with a padlock */}
    <rect x={-330} y={-320} width={660} height={320} fill={`url(#${id}rib)`} stroke="#3E414C" strokeWidth={6} />
    <rect x={-346} y={-336} width={692} height={26} rx={6} fill="#6E7280" stroke="#3E414C" strokeWidth={5} />
    <rect x={-340} y={-30} width={680} height={30} fill="#4E5260" stroke="#3E414C" strokeWidth={5} />
    <g transform="translate(40 -52)">
      <path d="M -14 0 V -18 Q -14 -34 0 -34 Q 14 -34 14 -18 V 0" fill="none" stroke="#9A9AA6" strokeWidth={6} />
      <rect x={-20} y={-2} width={40} height={32} rx={6} fill="#C9A24A" stroke="#6A5420" strokeWidth={4} />
    </g>
    {/* dust streaks and a handbill, curling */}
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${-300 + i * 110} ${-300 + (i % 3) * 20} V ${-120 - (i % 2) * 50}`} stroke="#D9CFBE" strokeWidth={9} opacity={0.17} />)}
    <rect x={-250} y={-250} width={70} height={92} fill="#E8E0CC" stroke="#8A7A5A" strokeWidth={3} transform="rotate(-6 -215 -204)" opacity={0.9} />
    <path d="M -240 -226 H -194 M -240 -208 H -200 M -238 -190 H -204" stroke="#8A7A5A" strokeWidth={3} transform="rotate(-6 -215 -204)" />
    {/* stacked stools at the right */}
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(300 ${-i * 34})`}>
        <path d="M -38 -50 L -46 0 H 46 L 38 -50 Z" fill="#B8453C" stroke="#6E2A24" strokeWidth={3} />
        <ellipse cx={0} cy={-50} rx={40} ry={9} fill="#D9645A" stroke="#6E2A24" strokeWidth={3} />
      </g>
    ))}
    {/* cobweb in the corner, a dead plant, a leaf that tumbles slowly on the step */}
    <path d="M -380 -560 Q -330 -520 -300 -470 M -380 -560 Q -350 -500 -380 -440 M -380 -520 Q -350 -510 -332 -494" stroke="#F6EFE3" strokeWidth={2.5} fill="none" opacity={0.55} />
    <g transform="translate(-300 0)">
      <path d="M -26 0 L -18 -52 H 18 L 26 0 Z" fill="#8A5A44" stroke="#4A2E20" strokeWidth={3} />
      <path d="M 0 -52 Q -22 -96 -34 -120 M 0 -52 Q 8 -100 24 -126 M 0 -52 Q 22 -84 40 -92" stroke="#7A6A3A" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
    <ellipse cx={-120 + Math.sin(t / 30) * 6} cy={-4} rx={14} ry={5} fill="#9A7A3A" transform={`rotate(${Math.sin(t / 25) * 14} -120 -4)`} />
  </g>
);

/** A red plastic stool; (x, y) its foot centre, h the height at s = 1 is 66. */
export const PlasticStool: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = '#D9534F' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={3} rx={36} ry={7} fill="#000" opacity={0.3} />
    <path d="M -22 -60 L -30 0 H 30 L 22 -60 Z" fill={col} stroke="#7A2A28" strokeWidth={3} />
    <path d="M -8 -58 L -12 -4 M 8 -58 L 12 -4" stroke="#7A2A28" strokeWidth={2.5} opacity={0.55} />
    <ellipse cx={0} cy={-62} rx={30} ry={7} fill={col} stroke="#7A2A28" strokeWidth={3} />
    <ellipse cx={-6} cy={-64} rx={18} ry={3} fill="#fff" opacity={0.25} />
  </g>
);

/** A low plastic cafe table, top at y - 64 s; (x, y) the foot. */
export const LowTable: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={3} rx={64} ry={9} fill="#000" opacity={0.3} />
    <path d="M -34 -58 L -42 0 M 34 -58 L 42 0" stroke="#4A6A8A" strokeWidth={7} strokeLinecap="round" />
    <ellipse cx={0} cy={-62} rx={72} ry={14} fill="#5E88B4" stroke="#2C4660" strokeWidth={3} />
    <ellipse cx={-10} cy={-64} rx={44} ry={5} fill="#fff" opacity={0.18} />
  </g>
);

/** A glass of cà phê sữa đá: dark coffee over milk, ice, a straw. (x, y) the glass's foot; 56 wide, 96 tall at s = 1. */
export const IcedCoffee: React.FC<{ x: number; y: number; s?: number; t: number; level?: number }> = ({ x, y, s = 1, t, level = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={34} ry={6} fill="#000" opacity={0.3} />
    <path d="M -28 -96 L -22 0 H 22 L 28 -96 Z" fill="#DFF0F4" opacity={0.25} />
    <path d={`M ${-27 + (1 - level) * 0} ${-96 + 14 * (1 - level)} L -22 0 H 22 L ${27} ${-96 + 14 * (1 - level)} Z`} fill="#6B3E24" opacity={0.95} />
    <path d="M -23 -22 L -22 0 H 22 L 23 -22 Z" fill="#F0DDB4" />
    {[[-10, -66], [8, -74], [-2, -50], [10, -52]].map(([cx, cy], i) => (
      <rect key={i} x={cx - 8} y={cy - 8} width={16} height={16} rx={3} fill="#F6FBFF" opacity={0.55} transform={`rotate(${i * 17 + Math.sin(t / 24 + i) * 4} ${cx} ${cy})`} />
    ))}
    <path d="M -28 -96 L -22 0 H 22 L 28 -96" fill="none" stroke="#F6FBFF" strokeWidth={3} opacity={0.8} />
    <path d="M 8 -40 L 22 -124" stroke="#E9654B" strokeWidth={6} strokeLinecap="round" />
    <path d="M -17 -90 L -15 -20" stroke="#fff" strokeWidth={3} opacity={0.45} />
  </g>
);

/** A schoolbag: (x, y) is its bottom centre, about 150 wide, 190 tall at s = 1. */
export const Backpack: React.FC<{ x: number; y: number; s?: number; rot?: number; col?: string; shadow?: number }> = ({ x, y, s = 1, rot = 0, col = '#D9733A', shadow = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={3} rx={86} ry={11} fill="#000" opacity={0.32 * shadow} />
    <path d="M -34 -196 Q -34 -222 0 -222 Q 34 -222 34 -196" fill="none" stroke="#5A2E14" strokeWidth={9} />
    <path d="M -72 0 Q -84 -90 -62 -170 Q -50 -200 0 -200 Q 50 -200 62 -170 Q 84 -90 72 0 Z" fill={col} stroke="#5A2E14" strokeWidth={5} />
    <path d="M -70 -10 Q -80 -90 -60 -165" stroke="#fff" strokeWidth={5} opacity={0.2} fill="none" />
    <path d="M -50 -92 H 50 V -8 H -50 Z" fill="#B85A28" stroke="#5A2E14" strokeWidth={4} />
    <path d="M -50 -64 H 50" stroke="#5A2E14" strokeWidth={3} />
    <rect x={-12} y={-76} width={24} height={14} rx={4} fill="#F2C14E" stroke="#5A2E14" strokeWidth={3} />
    <path d="M -50 -176 Q 0 -150 50 -176" stroke="#5A2E14" strokeWidth={4} fill="none" />
    <circle cx={0} cy={-156} r={7} fill="#F2C14E" stroke="#5A2E14" strokeWidth={3} />
  </g>
);

/** A phone (big, dark body from the engine) with Mo's message bubble popping on its screen at t = at. */
export const MessagePhone: React.FC<{ x: number; y: number; w?: number; t: number; at?: number; rot?: number; buzz?: number; text?: string }> = ({ x, y, w = 520, t, at = 12, rot = 0, buzz = 0, text = 'Tao về rồi' }) => {
  const h = w * 2.05;
  const sw = w * 0.88;
  const sh = h - w * 0.12;
  const k = backOut(clamp((t - at) / 8));
  const tp = easeOut(clamp((t - at - 14) / 6));
  return (
    <g>
      <Phone x={x} y={y} w={w} rot={rot} on={0} buzz={buzz} f={t} />
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} rx={w * 0.11} fill="#1F2A44" opacity={clamp((t - at + 6) / 4)} />
        <g opacity={clamp((t - at + 6) / 4)}>
          <rect x={-sw / 2} y={-sh / 2} width={sw} height={w * 0.3} rx={w * 0.11} fill="#2E3F66" />
          <circle cx={-sw / 2 + w * 0.17} cy={-sh / 2 + w * 0.15} r={w * 0.09} fill="#C98E68" />
          <path d={`M ${-sw / 2 + w * 0.09} ${-sh / 2 + w * 0.12} Q ${-sw / 2 + w * 0.17} ${-sh / 2 + w * 0.02} ${-sw / 2 + w * 0.25} ${-sh / 2 + w * 0.12} Z`} fill="#2A1C18" />
          <text x={-sw / 2 + w * 0.3} y={-sh / 2 + w * 0.185} fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.085} fill="#F6EFE3">Mo</text>
        </g>
        <g transform={`translate(${-sw / 2 + w * 0.06} ${-sh / 2 + w * 0.6}) scale(${k})`} style={{ transformOrigin: 'left top' }}>
          <rect x={0} y={0} width={w * 0.62} height={w * 0.2} rx={w * 0.08} fill="#F6EFE3" />
          <path d={`M 0 ${w * 0.12} L ${-w * 0.03} ${w * 0.2} L ${w * 0.07} ${w * 0.18} Z`} fill="#F6EFE3" />
          <text x={w * 0.31} y={w * 0.13} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={w * 0.095} fill="#1D2033">{text}</text>
        </g>
        <g opacity={tp}>
          <rect x={sw / 2 - w * 0.44} y={sh / 2 - w * 0.5} width={w * 0.36} height={w * 0.16} rx={w * 0.08} fill="#2FBF71" />
          <text x={sw / 2 - w * 0.26} y={sh / 2 - w * 0.385} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.06} fill="#EFFFF6">✓✓</text>
        </g>
      </g>
      <Glow x={x} y={y} r={w * 1.3} kind="cool" o={0.3 * clamp((t - at) / 6)} />
    </g>
  );
};
