import React from 'react';

// Toy sprites for the toy-store variant of the supermarket: upright, drawn in screen space (x, y = the middle of the
// base, h = height in px). They are billboards: round or boxy toys read fine without perspective, and the shelf code
// scales them with depth. Flat fills, a darker shade on the side away from the light (the left), a warm rim on the
// lit side and a contact shadow, like the rest of the props.

const RIM = '#FFD39A';
const INK = '#1D1A26';

/** A sitting teddy bear, about 120 units tall at h = 120. `fur` the body, `belly` the lighter patch, `bow` a tie colour. */
export const Teddy: React.FC<{ x: number; y: number; h: number; fur?: string; belly?: string; bow?: string | null; shadow?: boolean }> = ({
  x, y, h, fur = '#B9794A', belly = '#E3B98C', bow = '#D9534F', shadow = true,
}) => {
  const dark = '#00000030';
  return (
    <g transform={`translate(${x} ${y}) scale(${h / 120})`}>
      {shadow ? <ellipse cx={4} cy={2} rx={44} ry={7} fill="#000" opacity={0.35} /> : null}
      {/* legs, with foot pads */}
      <ellipse cx={-22} cy={-12} rx={19} ry={13} fill={fur} />
      <ellipse cx={22} cy={-12} rx={19} ry={13} fill={fur} />
      <ellipse cx={-26} cy={-12} rx={8} ry={6} fill={belly} />
      <ellipse cx={26} cy={-12} rx={8} ry={6} fill={belly} />
      {/* arms */}
      <ellipse cx={-34} cy={-46} rx={11} ry={20} fill={fur} transform="rotate(18 -34 -46)" />
      <ellipse cx={34} cy={-46} rx={11} ry={20} fill={fur} transform="rotate(-18 34 -46)" />
      {/* body and belly */}
      <ellipse cx={0} cy={-40} rx={31} ry={36} fill={fur} />
      <ellipse cx={-10} cy={-36} rx={14} ry={30} fill={dark} />
      <ellipse cx={3} cy={-36} rx={20} ry={25} fill={belly} />
      {/* head */}
      <circle cx={-19} cy={-107} r={10} fill={fur} />
      <circle cx={19} cy={-107} r={10} fill={fur} />
      <circle cx={-19} cy={-107} r={5.5} fill={belly} />
      <circle cx={19} cy={-107} r={5.5} fill={belly} />
      <circle cx={0} cy={-88} r={26} fill={fur} />
      <path d="M -26 -88 A 26 26 0 0 0 -4 -62 L -4 -110 A 26 26 0 0 0 -26 -88 Z" fill={dark} />
      <ellipse cx={2} cy={-80} rx={13} ry={10} fill={belly} />
      <ellipse cx={2} cy={-84} rx={5} ry={3.4} fill={INK} />
      <circle cx={-9} cy={-95} r={3} fill={INK} />
      <circle cx={13} cy={-95} r={3} fill={INK} />
      <path d="M 2 -80 L 2 -76 M -3 -75 Q 2 -72 7 -75" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      {bow ? <path d={`M 0 -62 L -14 -70 L -14 -54 Z M 0 -62 L 14 -70 L 14 -54 Z`} fill={bow} /> : null}
      <path d="M 26 -100 Q 30 -80 28 -62" stroke={RIM} strokeWidth={2} fill="none" opacity={0.5} />
    </g>
  );
};

/** A beach-ball style ball (three coloured wedges), r its radius. */
export const Ball: React.FC<{ x: number; y: number; r: number; c1?: string; c2?: string; c3?: string }> = ({ x, y, r, c1 = '#E4572E', c2 = '#F6D04D', c3 = '#3E9BD6' }) => {
  const cy = y - r;
  const wedge = (a0: number, a1: number, c: string) => {
    const p = (a: number) => `${x + Math.cos(a) * r} ${cy + Math.sin(a) * r}`;
    return <path d={`M ${x} ${cy} L ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)} Z`} fill={c} />;
  };
  return (
    <g>
      <ellipse cx={x + r * 0.15} cy={y} rx={r * 0.95} ry={r * 0.16} fill="#000" opacity={0.35} />
      <circle cx={x} cy={cy} r={r} fill="#F4EFE4" />
      {wedge(-2.6, -1.4, c1)}
      {wedge(-0.3, 0.9, c2)}
      {wedge(1.9, 3.1, c3)}
      <path d={`M ${x - r * 0.7} ${cy + r * 0.55} A ${r * 0.9} ${r * 0.9} 0 0 0 ${x + r * 0.6} ${cy + r * 0.7}`} stroke="#000" strokeOpacity={0.22} strokeWidth={r * 0.28} fill="none" strokeLinecap="round" />
      <circle cx={x} cy={cy} r={r * 0.1} fill="#fff" />
      <ellipse cx={x - r * 0.35} cy={cy - r * 0.45} rx={r * 0.22} ry={r * 0.12} fill="#fff" opacity={0.65} transform={`rotate(-35 ${x - r * 0.35} ${cy - r * 0.45})`} />
      <path d={`M ${x + r * 0.8} ${cy - r * 0.55} A ${r} ${r} 0 0 1 ${x + r * 0.35} ${cy - r * 0.95}`} stroke={RIM} strokeWidth={2} fill="none" opacity={0.55} />
    </g>
  );
};

/** A tin robot: a box body, a square head with an antenna, lit eyes and a grille mouth. About h tall. */
export const ToyRobot: React.FC<{ x: number; y: number; h: number; body?: string; trim?: string }> = ({ x, y, h, body = '#3E9BD6', trim = '#F6B93B' }) => (
  <g transform={`translate(${x} ${y}) scale(${h / 120})`}>
    <ellipse cx={3} cy={2} rx={40} ry={6} fill="#000" opacity={0.35} />
    <rect x={-26} y={-26} width={16} height={26} rx={3} fill="#6E7788" />
    <rect x={10} y={-26} width={16} height={26} rx={3} fill="#8A93A4" />
    <rect x={-42} y={-86} width={14} height={44} rx={5} fill="#8A93A4" />
    <rect x={28} y={-86} width={14} height={44} rx={5} fill="#A9B2C2" />
    <rect x={-32} y={-76} width={64} height={52} rx={6} fill={body} />
    <rect x={-32} y={-76} width={20} height={52} rx={6} fill="#000" opacity={0.18} />
    <rect x={-20} y={-66} width={40} height={14} rx={3} fill={trim} />
    <circle cx={-10} cy={-38} r={5} fill="#D9534F" />
    <circle cx={6} cy={-38} r={5} fill="#58B368" />
    <rect x={16} y={-44} width={9} height={12} rx={2} fill="#F4EFE4" />
    <rect x={-4} y={-92} width={8} height={18} fill="#6E7788" />
    <rect x={-26} y={-118} width={52} height={32} rx={7} fill="#C9D1DD" />
    <rect x={-26} y={-118} width={16} height={32} rx={7} fill="#000" opacity={0.15} />
    <rect x={-17} y={-110} width={11} height={11} rx={2} fill="#FFE27A" />
    <rect x={6} y={-110} width={11} height={11} rx={2} fill="#FFE27A" />
    <path d="M -12 -94 L 12 -94 M -12 -90 L 12 -90" stroke={INK} strokeWidth={2} />
    <path d="M 0 -118 L 0 -130" stroke="#6E7788" strokeWidth={3} />
    <circle cx={0} cy={-132} r={5} fill="#D9534F" />
    <path d="M 33 -112 L 33 -78" stroke={RIM} strokeWidth={2} opacity={0.5} />
  </g>
);

/** A toy car in side view, nose to the right. w is its length. */
export const ToyCar: React.FC<{ x: number; y: number; w: number; body?: string; stripe?: string }> = ({ x, y, w, body = '#D94452', stripe = '#F6F1E3' }) => (
  <g transform={`translate(${x} ${y}) scale(${w / 120})`}>
    <ellipse cx={0} cy={2} rx={56} ry={5} fill="#000" opacity={0.35} />
    <path d="M -56 -14 L -56 -30 Q -52 -36 -40 -36 L -22 -38 Q -12 -58 8 -58 L 26 -58 Q 38 -56 44 -38 L 52 -34 Q 58 -30 58 -22 L 58 -14 Z" fill={body} />
    <path d="M -56 -14 L -56 -30 Q -52 -36 -40 -36 L -22 -38 L -22 -14 Z" fill="#000" opacity={0.16} />
    <path d="M -14 -38 Q -6 -52 8 -52 L 14 -52 L 14 -38 Z" fill="#BFE6FF" />
    <path d="M 20 -52 L 28 -52 Q 36 -50 40 -38 L 20 -38 Z" fill="#BFE6FF" />
    <rect x={-56} y={-26} width={114} height={5} fill={stripe} opacity={0.9} />
    <path d="M 50 -30 L 58 -28 L 58 -22 L 50 -22 Z" fill="#FFE27A" />
    {[-32, 32].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={-9} r={13} fill={INK} />
        <circle cx={cx} cy={-9} r={6} fill="#C9D1DD" />
      </g>
    ))}
    <path d="M -2 -58 Q 20 -62 40 -48" stroke={RIM} strokeWidth={2} fill="none" opacity={0.5} />
  </g>
);

/** A stack of wrapped building-block boxes (screen space), for a toy bin or a floor display. */
export const GiftBox: React.FC<{ x: number; y: number; w: number; h: number; c1: string; c2: string }> = ({ x, y, w, h, c1, c2 }) => (
  <g>
    <ellipse cx={x + 4} cy={y + 1} rx={w * 0.58} ry={h * 0.07} fill="#000" opacity={0.35} />
    <rect x={x - w / 2} y={y - h} width={w} height={h} fill={c1} />
    <rect x={x - w / 2} y={y - h} width={w * 0.3} height={h} fill="#000" opacity={0.15} />
    <rect x={x - w * 0.08} y={y - h} width={w * 0.16} height={h} fill={c2} />
    <rect x={x - w / 2} y={y - h * 0.58} width={w} height={h * 0.14} fill={c2} />
    <path d={`M ${x} ${y - h} Q ${x - w * 0.22} ${y - h * 1.28} ${x - w * 0.06} ${y - h * 1.02} M ${x} ${y - h} Q ${x + w * 0.22} ${y - h * 1.28} ${x + w * 0.06} ${y - h * 1.02}`} stroke={c2} strokeWidth={Math.max(2, w * 0.07)} fill="none" strokeLinecap="round" />
    <path d={`M ${x + w / 2} ${y - h} L ${x + w / 2} ${y}`} stroke={RIM} strokeWidth={2} opacity={0.5} />
  </g>
);
