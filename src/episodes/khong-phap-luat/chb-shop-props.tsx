import React from 'react';
import { clamp, easeOut, backOut, rnd, Glow, FONT, LOOKS, Look } from '../../engine';
import { Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';

// Chapter B props (2/4): day one, shops. The convenience store front with its shutter, a crate of drinks, the shop owner,
// a passer-by's look, mum's steamer pot, a warm wooden counter. Pure functions of the clock.

const INK = '#12101C';

/** The owner of the convenience store: a pale shirt with a blue apron colour, no suit (the suit look minus its extras). */
export const OWNER: Look = { ...LOOKS.suit, jacket: '#E9E2D0', jacketShade: '#CFC6AE', accent: '#3E6A8A', limb: '#E9E2D0', extra: undefined };
/** An anonymous passer-by (only his sleeve and hand show). */
export const PASSER: Look = { ...LOOKS.mo, jacket: '#4A4F5C', jacketShade: '#3A3E4A', limb: '#4A4F5C', extra: undefined };

/** The shop front, 1400 wide, ground at y 900: wall, sign, glass shop window behind the shutter, a shutter lowered to `down` (0..1). */
export const ShopFront: React.FC<{ t: number; down?: number; gap?: number; sign?: boolean }> = ({ t, down = 1, gap = 0, sign = true }) => {
  const top = 330;
  const doorH = 570;
  const sh = doorH * down - gap;
  const flick = Math.sin(t / 3.1) > 0.9 ? 0.4 : 1;
  return (
    <g>
      <rect x={-300} y={0} width={2500} height={900} fill="#7A6A78" />
      <rect x={-300} y={0} width={2500} height={900} fill="#3A2A44" opacity={0.25} />
      <rect x={260} y={90} width={1240} height={240} rx={14} fill="#26303F" stroke={INK} strokeWidth={6} />
      {sign ? (
        <g opacity={flick}>
          <rect x={290} y={116} width={1180} height={188} rx={10} fill="#1F7A5A" />
          <rect x={290} y={116} width={1180} height={188} rx={10} fill="none" stroke="#9FE8C8" strokeWidth={5} opacity={0.6} />
          <text x={880} y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={118} fill="#E9FFF3" letterSpacing={4}>TIỆN LỢI</text>
        </g>
      ) : null}
      {/* the shop behind the shutter: dark, a fridge glass glowing faintly */}
      <rect x={300} y={top} width={1160} height={doorH} fill="#151220" />
      <rect x={340} y={top + 60} width={300} height={doorH - 80} fill="#26405A" opacity={0.7} />
      <rect x={1150} y={top + 60} width={260} height={doorH - 80} fill="#3A3048" opacity={0.8} />
      {/* the roller shutter, ribbed, lowered from the top */}
      <rect x={290} y={top - 10} width={1180} height={36} rx={6} fill="#4A4A58" stroke={INK} strokeWidth={5} />
      <g>
        <rect x={300} y={top + 24} width={1160} height={Math.max(0, sh)} fill="#8E93A2" />
        {Array.from({ length: 24 }).map((_, i) => (
          <rect key={i} x={300} y={top + 24 + i * 24} width={1160} height={Math.max(0, Math.min(8, sh - i * 24))} fill="#5E6272" />
        ))}
        <rect x={300} y={top + 24} width={46} height={Math.max(0, sh)} fill="#000" opacity={0.18} />
        <rect x={300 + 1160 - 60} y={top + 24} width={60} height={Math.max(0, sh)} fill="#000" opacity={0.14} />
        <rect x={300} y={top + 24 + Math.max(0, sh) - 22} width={1160} height={22} fill="#6E7282" stroke={INK} strokeWidth={4} />
        <rect x={860} y={top + 24 + Math.max(0, sh) - 14} width={40} height={14} rx={4} fill="#D8B24A" />
      </g>
      <rect x={260} y={896} width={1240} height={40} fill="#4B4152" />
      <rect x={-300} y={930} width={2500} height={400} fill="#3A3342" />
      <ellipse cx={880} cy={930} rx={700} ry={26} fill="#000" opacity={0.3} />
    </g>
  );
};

/** A hand-written "ĐÓNG CỬA" paper taped on the shutter, swinging on one corner. */
export const ClosedNote: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(t / 8) * 5 - 3})`}>
    <rect x={-8} y={-10} width={90} height={20} fill="#E8D9A0" opacity={0.8} transform="rotate(-6)" />
    <rect x={-100} y={0} width={200} height={140} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
    <text x={0} y={62} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={50} fill="#C8202F">ĐÓNG</text>
    <text x={0} y={116} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={50} fill="#C8202F">CỬA</text>
  </g>
);

/** A crate of bottled drinks on the pavement; `taken` bottle index (or -1) is missing. */
export const DrinkCrate: React.FC<{ x: number; y: number; s?: number; taken?: number }> = ({ x, y, s = 1, taken = -1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={150} ry={12} fill="#000" opacity={0.35} />
    {[0, 1, 2, 3, 4].map((i) => (i === taken ? null : (
      <g key={i} transform={`translate(${-100 + i * 50} -70)`}>
        <rect x={-14} y={-38} width={28} height={92} rx={9} fill={['#E8453C', '#F2B84B', '#3E8C86', '#E8453C', '#7A5A8A'][i]} stroke={INK} strokeWidth={3} />
        <rect x={-6} y={-62} width={12} height={26} rx={4} fill="#DADDE8" stroke={INK} strokeWidth={3} />
        <rect x={-14} y={-4} width={28} height={22} fill="#FFF1D0" opacity={0.85} />
      </g>
    )))}
    <rect x={-130} y={-40} width={260} height={44} rx={6} fill="#B98557" stroke="#4A2E20" strokeWidth={5} />
    <path d="M -130 -22 H 130" stroke="#4A2E20" strokeWidth={3} opacity={0.5} />
  </g>
);

/** Mum's steamer pot (big, drawn from the cart's pot): a lid ajar, steam rising. Origin on the pot's base centre, ~330 wide. */
export const BigPot: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={190} ry={18} fill="#000" opacity={0.4} />
    <path d="M -150 0 L -126 -250 L 126 -250 L 150 0 Z" fill="#C9CDD6" stroke="#4A4F5C" strokeWidth={7} strokeLinejoin="round" />
    <path d="M 60 0 L 70 -250 L 126 -250 L 150 0 Z" fill="#9FA3AE" opacity={0.7} />
    <path d="M -110 -30 L -96 -230" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.45} />
    <rect x={-172} y={-170} width={34} height={20} rx={8} fill="#3A3E4A" />
    <rect x={138} y={-170} width={34} height={20} rx={8} fill="#3A3E4A" />
    <ellipse cx={-10} cy={-258} rx={140} ry={22} fill="#B8BCC8" stroke="#4A4F5C" strokeWidth={7} transform="rotate(-5 -10 -258)" />
    <circle cx={-14} cy={-286} r={14} fill="#4A4F5C" />
    <path d="M -100 -250 Q 0 -300 100 -252 Z" fill="#F4D35E" opacity={0.9} />
    <Steam x={0} y={-290} t={t} n={7} h={260} w={34} o={0.6} />
  </g>
);

/** A warm, dim wooden counter seen close up: dark planks, a lamp pool. Fills the 1920 x 1080 world and a margin. */
export const WarmCounter: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-300} y={-300} width={2520} height={1700} fill="#2A1D22" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-300} y={500 + i * 90} width={2520} height={86} fill={i % 2 ? '#5A3C2A' : '#6A4630'} stroke="#2A1812" strokeWidth={4} />
    ))}
    <rect x={-300} y={-300} width={2520} height={800} fill="#34222A" />
    {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={200 + rnd(3, i) * 1500} cy={80 + rnd(4, i) * 300} r={30 + rnd(5, i) * 40} fill="#FFB347" opacity={0.1 + 0.05 * Math.sin(t / 20 + i)} />)}
    <Glow x={960} y={560} r={900} o={0.4} />
  </g>
);

/** A pay envelope, 240 x 160, centred. `open` 0..1 lifts its flap; `empty` shows the dark inside when open. */
export const PayEnvelope: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number }> = ({ x, y, s = 1, rot = 0, open = 0 }) => {
  const k = easeOut(clamp(open));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-120} y={-80} width={240} height={160} rx={8} fill="#F3E3B8" stroke={INK} strokeWidth={5} />
      {k > 0.05 ? <path d={`M -112 -74 L 0 ${-74 + 70 * k} L 112 -74 Z`} fill="#1B1620" opacity={0.9} /> : null}
      <path d="M -120 80 L -20 6 M 120 80 L 20 6" stroke="#C9B27A" strokeWidth={4} />
      <g transform={`translate(0 ${-80 - 20 * k}) scale(1 ${1 - 2 * k})`}>
        <path d="M -120 0 L 0 84 L 120 0 Z" fill="#E8D49A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {k < 0.5 ? <text x={0} y={52} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={40} fill="#8A5A2A">LƯƠNG</text> : null}
    </g>
  );
};
