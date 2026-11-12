import React from 'react';
import { LOOKS, Look, FONT, HEAD, Pose, rnd } from '../../engine';
import { INK } from './chc-props-money-and-prices';

// Chapter C food and trade props: bánh mì loaves and bags, the glass bread cart, rice sacks, the rice truck, and the
// extra costumes (vendor, neighbours, farmer, sepia) built on the one rig. All pure functions of their props.

export const VENDOR: Look = { ...LOOKS.suit, jacket: '#D9C26A', jacketShade: '#B89F4A', limb: '#D9C26A', accent: '#C8483E', extra: undefined, hair: '#241C18' };
export const NEIGHBOURS: Look[] = [
  LOOKS.mom,
  { ...LOOKS.mo, jacket: '#4A6EB0', jacketShade: '#3A5890', extra: 'curls', hair: '#3A2A20' },
  { ...LOOKS.sis, jacket: '#B5583E', jacketShade: '#944530', extra: 'bob', hair: '#2A2220', accent: '#E9C46A' },
  { ...LOOKS.suit, jacket: '#5E6E46', jacketShade: '#4C5A38', limb: '#5E6E46', extra: undefined },
  { ...LOOKS.mom, jacket: '#3E8C86', jacketShade: '#2F6E69', extra: 'bob', hair: '#241C18' },
];
export const FARMER: Look = { ...LOOKS.suit, skin: '#D9B896', skinShade: '#C29E7A', hand: '#D9B896', jacket: '#6A7A4A', jacketShade: '#566438', limb: '#6A7A4A', accent: '#C8B070', extra: undefined, hair: '#241C18' };
const SEPIA = { skin: '#E8D2A8', skinShade: '#CDB58A', hand: '#E8D2A8', jacket: '#7A5A3A', jacketShade: '#664A2E', limb: '#7A5A3A', line: '#2A1C10', shoe: '#4A3220', face: '#2A1C10', hair: '#2A1C10', accent: '#B8935A' };
export const SEPIA_LOOKS: Look[] = [
  { ...SEPIA },
  { ...SEPIA, jacket: '#5A4A3A', jacketShade: '#4A3C2E', limb: '#5A4A3A', extra: 'bob' },
  { ...SEPIA, jacket: '#9A7A52', jacketShade: '#80623E', limb: '#9A7A52', extra: 'curls' },
];

/** A conical hat on a standing, upright figure's head (pose x, y, scale), sepia or straw. */
export const ConicalHat: React.FC<{ pose: Pose; color?: string; dy?: number }> = ({ pose, color = '#E2C27A', dy = 0 }) => {
  const k = pose.scale;
  const cx = pose.x + HEAD.x * k + pose.tilt * 2.2 * k;
  const cy = pose.y + (HEAD.y - 26 + dy) * k;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${k})`}>
      <path d="M -112 14 Q 0 -20 112 14 L 0 -104 Z" fill={color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -60 -6 L 0 -104 M 0 -8 L 0 -104 M 60 -6 L 0 -104" stroke={INK} strokeOpacity={0.25} strokeWidth={3} />
      <path d="M -44 8 Q -50 40 -34 56 M 44 8 Q 50 40 34 56" stroke="#8A3A32" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** A bánh mì loaf, side view, 240 x 70 at s 1, centred. */
export const Loaf: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -118 4 Q -122 -30 -70 -34 L 70 -34 Q 122 -30 118 4 Q 112 34 60 36 L -60 36 Q -112 34 -118 4 Z" fill="#E2A24A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -112 14 Q -100 34 -60 36 L 60 36 Q 100 34 112 14 Q 90 28 0 28 Q -90 28 -112 14 Z" fill="#B8742E" opacity={0.8} />
    {[-66, -22, 22, 66].map((px, i) => <path key={i} d={`M ${px - 14} -22 L ${px + 12} 8`} stroke="#F7D690" strokeWidth={7} strokeLinecap="round" />)}
  </g>
);

/** A kraft paper bag with a loaf sticking out of it, 120 wide x 150 tall at s 1, x y = bottom middle. */
export const BreadBag: React.FC<{ x: number; y: number; rot?: number; s?: number; tone?: number }> = ({ x, y, rot = 0, s = 1, tone = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <g transform="translate(6 -118) rotate(-14)"><Loaf x={0} y={0} s={0.5} /></g>
    <path d="M -58 0 L -50 -120 L 50 -120 L 58 0 Z" fill={tone ? '#C9A276' : '#D9B788'} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 18 0 L 24 -120 L 50 -120 L 58 0 Z" fill="#000" opacity={0.1} />
    <path d="M -50 -120 L -42 -100 L 42 -100 L 50 -120" fill="#E6C99C" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-26} y={-76} width={52} height={22} rx={4} fill="#C8483E" opacity={0.85} />
  </g>
);

/**
 * The bánh mì cart: a wooden box on two wheels under a glass case, a striped header sign. 360 wide x 300 tall at s 1,
 * x y = the ground under it. `loaves` 0..1 how full the case is; `sold` shows the red "HẾT" card on the glass.
 */
export const BreadCart: React.FC<{ x: number; y: number; s?: number; loaves?: number; sold?: boolean; t?: number }> = ({ x, y, s = 1, loaves = 1, sold = false, t = 0 }) => {
  const n = Math.round(loaves * 8);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={200} ry={14} fill="#000" opacity={0.4} />
      <path d="M -150 -150 L -170 -300 L 170 -300 L 150 -150" fill="#EFE7D2" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -165 -250 L -155 -300 L 165 -300 L 155 -250 Z" fill="#C8483E" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <text x={0} y={-262} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={36} fill="#FFF3DC">SANDWICHES</text>
      <rect x={-150} y={-248} width={300} height={104} rx={6} fill="#CFE6EA" fillOpacity={0.55} stroke={INK} strokeWidth={4} />
      {Array.from({ length: n }).map((_, i) => <Loaf key={i} x={-76 + (i % 4) * 50 + (i > 3 ? 20 : 0)} y={-184 + Math.floor(i / 4) * 44} rot={-8 + (i % 3) * 8} s={0.38} />)}
      <path d="M -142 -240 L -90 -148" stroke="#fff" strokeOpacity={0.35} strokeWidth={8} strokeLinecap="round" />
      <rect x={-160} y={-144} width={320} height={110} rx={6} fill="#8A5E3A" stroke={INK} strokeWidth={4} />
      <rect x={-160} y={-144} width={320} height={10} fill="#FFD9A0" opacity={0.5} />
      <path d="M -110 -120 V -56 M 0 -120 V -56 M 110 -120 V -56" stroke="#6A4528" strokeWidth={4} />
      <g transform={`translate(${-70} ${-34})`}>
        <circle r={36} fill="#2A2630" stroke={INK} strokeWidth={4} /><circle r={14} fill="#8E8A9A" />
        <path d="M 0 -30 V 30 M -30 0 H 30" stroke="#8E8A9A" strokeWidth={3} transform={`rotate(${t * 3})`} />
      </g>
      <g transform="translate(110 -34)"><circle r={36} fill="#2A2630" stroke={INK} strokeWidth={4} /><circle r={14} fill="#8E8A9A" /></g>
      <path d="M 150 -120 L 230 -150" stroke="#5A3E2A" strokeWidth={10} strokeLinecap="round" />
      {sold ? (
        <g transform="translate(0 -196) rotate(-6)">
          <rect x={-124} y={-30} width={248} height={60} rx={8} fill="#E04A3C" stroke="#fff" strokeWidth={4} />
          <text y={14} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={38} fill="#fff">SOLD OUT</text>
        </g>
      ) : null}
    </g>
  );
};

/** A rice sack: burlap, a tied neck, a red "RICE" band. 140 wide x 170 tall at s 1, x y = bottom middle. */
export const RiceSack: React.FC<{ x: number; y: number; rot?: number; s?: number; open?: number }> = ({ x, y, rot = 0, s = 1, open = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -64 0 Q -80 -70 -52 -128 L 52 -128 Q 80 -70 64 0 Q 0 10 -64 0 Z" fill="#E4D3A8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 20 -126 Q 50 -70 40 0 Q 62 -2 64 0 Q 80 -70 52 -128 Z" fill="#000" opacity={0.1} />
    {open > 0 ? <ellipse cx={0} cy={-128} rx={52} ry={12} fill="#F7F1DC" stroke={INK} strokeWidth={3} /> : (
      <path d="M -52 -128 Q -40 -156 -18 -150 L 18 -150 Q 40 -156 52 -128 Z" fill="#E4D3A8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    )}
    <path d="M -26 -134 L 26 -134" stroke="#8A3A32" strokeWidth={6} strokeLinecap="round" />
    <rect x={-44} y={-92} width={88} height={34} rx={4} fill="#C8483E" />
    <text y={-66} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={32} fill="#FFF3DC">RICE</text>
  </g>
);

/** The rice truck seen from the side facing right: red cab, flat bed stacked with sacks. 760 wide at s 1, x y = ground. */
export const RiceTruck: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const bump = Math.sin(t * 0.9) * 2.2;
  const rows = [6, 5, 4, 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={400} ry={16} fill="#000" opacity={0.4} />
      <g transform={`translate(0 ${bump})`}>
        <rect x={-380} y={-130} width={560} height={26} rx={6} fill="#4A3E52" stroke={INK} strokeWidth={4} />
        {rows.map((n, r) => Array.from({ length: n }).map((_, i) => (
          <RiceSack key={`${r}${i}`} x={-300 + i * 84 + r * 42 + (rnd(r + 1, i) - 0.5) * 8} y={-130 - r * 84} s={0.72} rot={(rnd(r + 5, i) - 0.5) * 5} />
        )))}
        <path d="M 190 -130 L 190 -300 L 300 -300 L 372 -190 L 392 -190 L 392 -130 Z" fill="#C8483E" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 214 -280 L 290 -280 L 346 -200 L 214 -200 Z" fill="#CFE6EA" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <rect x={380} y={-170} width={20} height={34} rx={4} fill="#FFE59A" stroke={INK} strokeWidth={3} />
      </g>
      {[-250, -150, 250].map((wx, i) => (
        <g key={i} transform={`translate(${wx} -42)`}>
          <circle r={50} fill="#1A1822" stroke={INK} strokeWidth={4} /><circle r={22} fill="#9A94A8" />
          <path d="M 0 -20 V 20 M -20 0 H 20" stroke="#4A4658" strokeWidth={5} transform={`rotate(${t * 14})`} />
        </g>
      ))}
    </g>
  );
};
