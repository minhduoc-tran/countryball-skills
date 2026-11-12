import React from 'react';
import { clamp, easeOut, hash } from '../../countryball/fx-math';
import { INK } from './chd-common';

// Chapter E props (screen px, pure functions of props): Cessna O-1 side view, olive truck with riders, tank riders, hourglass, paper note,
// shop front with a shutter, onlooker silhouettes. No faces, no weapons in detail, nothing gory.

/** Cessna O-1 Bird Dog, SIDE view facing right (flip = left), (x, y) = centre, size = length in px; `heads` = tiny silhouettes in the cabin window. */
export const O1Side: React.FC<{ x: number; y: number; size?: number; flip?: boolean; rot?: number; t?: number; heads?: number }> = ({ x, y, size = 400, flip = false, rot = 0, t = 0, heads = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${flip ? -size / 100 : size / 100},${size / 100})`} strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx={-2} cy={20} rx={30} ry={2.4} fill="#000" opacity={0.12} />
    <path d="M-50,-2 L-52,-19 L-43,-19 L-37,-5 Z" fill="#CFC8A4" stroke={INK} strokeWidth={1.5} />
    <path d="M-52,-1 L-34,-4 L-34,-1 L-50,1 Z" fill="#CFC8A4" stroke={INK} strokeWidth={1.3} />
    <path d="M-50,-2 L-22,-6 L8,-9 Q26,-9 33,-4 L33,5 Q20,9 0,9 L-30,5 L-50,1 Z" fill="#DAD3B0" stroke={INK} strokeWidth={1.6} />
    <path d="M-4,-12 L16,-12 L22,-4 L-6,-4 Z" fill="#B7DAEE" stroke={INK} strokeWidth={1.2} />
    {Array.from({ length: heads }, (_, i) => <g key={i}><circle cx={-2 + i * 3.6} cy={-8} r={1.6} fill="#2A2F3A" /><rect x={-3.4 + i * 3.6} y={-6.6} width={2.8} height={3} rx={1} fill="#2A2F3A" /></g>)}
    <path d="M-24,-17 L30,-20.5 L32,-17 L-20,-13.5 Z" fill="#E5DFC0" stroke={INK} strokeWidth={1.5} />
    <path d="M2,-14 L9,7 M19,-15 L14,7" stroke={INK} strokeWidth={1.5} />
    <path d="M10,9 L9,13 M-46,1 L-47,4" stroke={INK} strokeWidth={1.4} />
    <circle cx={9} cy={13} r={3.6} fill="#2B2E32" stroke={INK} strokeWidth={1} /><circle cx={-47} cy={5} r={1.8} fill="#2B2E32" />
    <ellipse cx={34} cy={0} rx={1.2 + 0.5 * Math.abs(Math.sin(t * 1.3))} ry={13} fill="#D9DEE2" opacity={0.55} />
    <circle cx={33.4} cy={0} r={1.4} fill="#2B2E32" />
  </g>
);

/** Seated rider silhouette (olive helmet dome + body), (x, y) = seat point; bob = px of sway. */
export const Rider: React.FC<{ x: number; y: number; s?: number; bob?: number; flag?: boolean }> = ({ x, y, s = 1, bob = 0 }) => (
  <g transform={`translate(${x},${y + bob}) scale(${s})`}>
    <path d="M-9,0 L-8,-22 Q0,-30 8,-22 L9,0 Z" fill="#4E5A34" stroke={INK} strokeWidth={2.4} />
    <circle cy={-32} r={8.5} fill="#2B2F38" />
    <path d="M-12,-35 Q0,-50 12,-35 Z" fill="#6B7A44" stroke={INK} strokeWidth={2.2} /><line x1={-14} y1={-35} x2={14} y2={-35} stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
  </g>
);

/** Olive truck, SIDE view facing right, (x, y) = ground line under the middle; size = length; riders on the bed. */
export const Truck: React.FC<{ x: number; y: number; size?: number; riders?: number; t?: number; flip?: boolean; body?: string; cab?: string }> = ({ x, y, size = 360, riders = 5, t = 0, flip = false, body = '#7A8250', cab = '#6E7648' }) => {
  const k = size / 200;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -k : k},${k})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cy={2} rx={104} ry={7} fill="#000" opacity={0.25} />
      <rect x={-96} y={-52} width={118} height={34} rx={3} fill={body} stroke={INK} strokeWidth={3.4} />
      <path d="M26,-18 L26,-66 L58,-66 L84,-42 L90,-42 L90,-18 Z" fill={cab} stroke={INK} strokeWidth={3.4} />
      <path d="M40,-60 L56,-60 L74,-42 L40,-42 Z" fill="#B7DAEE" stroke={INK} strokeWidth={2.4} />
      <rect x={-98} y={-24} width={196} height={14} rx={4} fill="#4C5334" stroke={INK} strokeWidth={3} />
      <line x1={30} y1={-66} x2={24} y2={-130} stroke={INK} strokeWidth={2.6} />
      {[-66, -6, 52, 72].map((cx, i) => <g key={i}><circle cx={cx} cy={-6} r={15} fill="#26292D" stroke={INK} strokeWidth={3} /><circle cx={cx} cy={-6} r={6} fill="#8E9499" /></g>)}
      {Array.from({ length: riders }, (_, i) => <Rider key={i} x={-84 + i * 25} y={-50} s={0.8} bob={Math.sin(t / 5 + i * 1.9) * 1.6} />)}
    </g>
  );
};

/** Hourglass, (x, y) = centre, h = height, `u` 0..1 = how much sand has run (top bulb empties, bottom bulb fills). */
export const Hourglass: React.FC<{ id: string; x: number; y: number; h?: number; u?: number }> = ({ id, x, y, h = 300, u = 0 }) => {
  const k = h / 300, q = clamp(u);
  const glass = 'M-78,-150 H78 L78,-130 Q78,-40 14,0 Q78,40 78,130 L78,150 H-78 L-78,130 Q-78,40 -14,0 Q-78,-40 -78,-130 Z';
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} strokeLinejoin="round" strokeLinecap="round">
      <defs><clipPath id={`${id}-glass`}><path d={glass} /></clipPath></defs>
      <path d={glass} fill="#CFE8F2" fillOpacity={0.22} />
      <g clipPath={`url(#${id}-glass)`}>
        <rect x={-80} y={-150 + 150 * q} width={160} height={150 * (1 - q)} fill="#E6B84A" opacity={q < 1 ? 1 : 0} transform="translate(0,0)" />
        <rect x={-80} y={-150} width={160} height={150 * q * 0} fill="none" />
        <rect x={-3} y={-2} width={6} height={q < 1 ? 150 : 0} fill="#E6B84A" />
        <path d={`M-80,150 L-80,${150 - 120 * q} Q0,${150 - 150 * q} 80,${150 - 120 * q} L80,150 Z`} fill="#E6B84A" />
      </g>
      <path d={glass} fill="none" stroke="#F4F1E4" strokeWidth={9} />
      <rect x={-92} y={-166} width={184} height={18} rx={8} fill="#7A5A3C" stroke={INK} strokeWidth={4} /><rect x={-92} y={148} width={184} height={18} rx={8} fill="#7A5A3C" stroke={INK} strokeWidth={4} />
    </g>
  );
};

/** Small folded paper note, centre (x, y), rotates by `rot`. */
export const PaperNote: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-22} y={-16} width={44} height={32} rx={3} fill="#FBF7E8" stroke={INK} strokeWidth={3} />
    <path d="M-22,-16 L0,2 L22,-16" fill="none" stroke="#8A8470" strokeWidth={2.4} />
    {[-6, 4].map((yy) => <line key={yy} x1={-12} y1={yy + 8} x2={12} y2={yy + 8} stroke="#B3AC93" strokeWidth={2} />)}
  </g>
);

/** Shop front: (x, ground) = bottom centre, w x h wall, a door opening with a rolling `shutter` 0 (open) .. 1 (closed). */
export const ShopFront: React.FC<{ id: string; x: number; y: number; w?: number; h?: number; shutter?: number; wall?: string }> = ({ id, x, y, w = 360, h = 520, shutter = 0, wall = '#D8C79A' }) => {
  const dw = w * 0.56, dh = h * 0.5, dx = x - dw / 2, dy = y - dh, sh = easeOut(shutter) * dh;
  return (
    <g strokeLinejoin="round">
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={wall} stroke={INK} strokeWidth={5} />
      <rect x={x - w / 2} y={y - h} width={w} height={26} fill="#8E5A3C" stroke={INK} strokeWidth={4} />
      {[0, 1].map((i) => <rect key={i} x={x - w / 2 + 34 + i * (w - 128)} y={y - h + 64} width={60} height={92} fill="#6E8CA6" stroke={INK} strokeWidth={4} />)}
      <rect x={dx} y={dy} width={dw} height={dh} fill="#2B1E1A" stroke={INK} strokeWidth={5} />
      <defs><clipPath id={`${id}-door`}><rect x={dx} y={dy} width={dw} height={dh} /></clipPath></defs>
      <g clipPath={`url(#${id}-door)`}>
        <rect x={dx} y={dy} width={dw} height={sh} fill="#9AA3AA" stroke={INK} strokeWidth={3} />
        {Array.from({ length: Math.ceil(sh / 14) }, (_, i) => <line key={i} x1={dx} x2={dx + dw} y1={dy + 8 + i * 14} y2={dy + 8 + i * 14} stroke="#6E777E" strokeWidth={3} />)}
        <rect x={dx} y={dy + sh - 8} width={dw} height={8} fill="#6E777E" />
      </g>
    </g>
  );
};

/** Onlooker silhouette (feet at x, y); `wave` 0..1 raises + swings an arm, `lean` degrees. */
export const Onlooker: React.FC<{ x: number; y: number; s?: number; color?: string; wave?: number; t?: number; lean?: number; hat?: boolean }> = ({ x, y, s = 1, color = '#1A2430', wave = 0, t = 0, lean = 0, hat = false }) => {
  const sw = wave > 0 ? Math.sin(t * 0.45) * 18 : 0;
  return (
    <g transform={`translate(${x},${y}) rotate(${lean}) scale(${s})`}>
      <ellipse cy={2} rx={16} ry={4} fill="#000" opacity={0.25} />
      <path d="M-9,0 L-8,-30 L8,-30 L9,0 Z" fill={color} />
      <path d="M-13,-30 Q-13,-56 0,-56 Q13,-56 13,-30 Z" fill={color} />
      <circle cy={-67} r={10} fill={color} />
      {hat && <path d="M-20,-72 Q0,-96 20,-72 Z" fill="#C8B070" stroke={INK} strokeWidth={2} />}
      <path d={wave > 0 ? `M11,-48 L${26 + sw},${-84 - 6 * wave}` : 'M11,-48 L16,-22'} stroke={color} strokeWidth={6} strokeLinecap="round" />
      <path d="M-11,-48 L-16,-22" stroke={color} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

/** Row of far people, deterministic (a crowd along a pavement). */
export const PavementRow: React.FC<{ x0: number; x1: number; y: number; n: number; s?: number; t?: number; seed?: number; wavers?: number; color?: string }> = ({ x0, x1, y, n, s = 1, t = 0, seed = 1, wavers = 0.3, color = '#18202C' }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const px = x0 + ((i + 0.5 + (hash(i, seed) - 0.5) * 0.5) / n) * (x1 - x0), w = hash(i, seed + 7) < wavers;
      return <Onlooker key={i} x={px} y={y + (hash(i, seed + 3) - 0.5) * 16 * s} s={s * (0.9 + 0.2 * hash(i, seed + 5))} color={color} wave={w ? 1 : 0} t={t + i * 7} lean={Math.sin(t * 0.04 + i) * 1.4} hat={hash(i, seed + 9) < 0.18} />;
    })}
  </g>
);

/** Scrolling roadside (noon sky, far trees, road band with dashes, posts moving left with `t`), `y` = road centre line; `speed` px/frame. */
export const RoadScroll: React.FC<{ id: string; t: number; y?: number; speed?: number; tone?: 'noon' | 'dawn' }> = ({ id, t, y = 800, speed = 6, tone = 'noon' }) => {
  const off = (t * speed) % 480;
  return (
    <g>
      <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={tone === 'noon' ? '#6FA8D8' : '#3C4C7A'} /><stop offset="1" stopColor={tone === 'noon' ? '#E3F0F6' : '#F0B27C'} /></linearGradient></defs>
      <rect width={1920} height={y - 120} fill={`url(#${id}-sky)`} />
      <rect y={y - 124} width={1920} height={1204 - y} fill="#7A8A56" />
      {Array.from({ length: 9 }, (_, i) => { const cx = i * 300 - ((t * speed * 0.35) % 300) - 100; return <g key={i}><rect x={cx - 5} y={y - 240} width={10} height={130} fill="#5B4630" /><circle cx={cx} cy={y - 260} r={70 + (i % 3) * 14} fill="#3F6B34" /></g>; })}
      <rect y={y - 120} width={1920} height={260} fill="#6A6458" />
      <rect y={y - 120} width={1920} height={8} fill="#B9B29E" />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 400 - off} y={y + 40} width={200} height={10} fill="#E8E2CE" opacity={0.85} />)}
      {Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={i * 480 - off - 4} y={y - 240} width={8} height={120} fill="#4A3B2A" /><rect x={i * 480 - off - 26} y={y - 246} width={52} height={8} fill="#4A3B2A" /></g>)}
      <rect y={y + 140} width={1920} height={1080 - y - 140} fill="#5C6B3C" />
    </g>
  );
};
