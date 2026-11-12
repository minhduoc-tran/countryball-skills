import React from 'react';
import { FONT, clamp, easeOut } from '../../engine';

// A Vietnamese market fish stall with an EMPTY ice tray (fills 0..1920 x 1080). Stall counter top at y 700, glass front 700..1000 from x 880.
//   <FishStall id t />                       background + counter (draw the shopper before the counter's front: use <StallFront/> after her)
//   <StallSign x y t flip drop? />           the hanging sign (pivot above (x, y)): flip 0..1 turns it from its blank back to HẾT HÀNG; drop 0..1 lowers it in.
// Order in a shot: FishStall (back + tray), shopper, StallFront (glass + counter lip), StallSign.

const INK = '#14121A';

export const FishStall: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <defs>
      <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D9A66B" /><stop offset="1" stopColor="#A9703F" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${id}w)`} />
    {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${i * 170} 0 V 700`} stroke="#8C5A30" strokeWidth={4} opacity={0.35} />)}
    {Array.from({ length: 16 }).map((_, i) => (
      <path key={i} d={`M ${i * 130 - 20} 0 L ${i * 130 + 65} 0 L ${i * 130 + 85} 190 L ${i * 130 - 40} 190 Z`} fill={i % 2 ? '#F6EFE3' : '#D9453A'} stroke={INK} strokeWidth={4} />
    ))}
    <path d="M -20 190 Q 100 236 215 190 Q 330 236 445 190 Q 560 236 675 190 Q 790 236 905 190 Q 1020 236 1135 190 Q 1250 236 1365 190 Q 1480 236 1595 190 Q 1710 236 1825 190 Q 1940 236 2055 190" fill="#D9453A" stroke={INK} strokeWidth={4} opacity={0.0} />
    {[260, 700, 1180, 1620].map((x, i) => <g key={i}><circle cx={x} cy={262} r={34 + Math.sin(t / 7 + i) * 1.2} fill="#FFE9A8" opacity={0.9} /><circle cx={x} cy={262} r={90} fill="#FFE9A8" opacity={0.15} /></g>)}
    <g transform="translate(300 420)"><rect x={-120} y={-70} width={240} height={140} rx={14} fill="#2E86C1" stroke={INK} strokeWidth={6} /><text textAnchor="middle" y={24} fontFamily={FONT.ui} fontWeight={700} fontSize={84} fill="#F6EFE3">CÁ</text></g>
    <rect x={0} y={700} width={1920} height={380} fill="#6E4A2E" />
    {/* the counter: glass front, steel tray inside, empty */}
    <rect x={880} y={690} width={1040} height={300} fill="#CFE6EE" stroke={INK} strokeWidth={6} />
    <rect x={900} y={740} width={1000} height={240} fill="#8FB6C6" opacity={0.5} />
    <path d="M 930 800 L 1870 800 L 1830 940 L 970 940 Z" fill="#B9C2C8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 960 820 L 1840 820 L 1815 920 L 985 920 Z" fill="#DCE6EC" opacity={0.85} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={1150 + i * 270} cy={880 + (i % 2) * 14} rx={90 + i * 10} ry={14} fill="#7DB8D6" opacity={0.65} />)}
    {[1030, 1330, 1650].map((x, i) => <path key={i} d={`M ${x} 830 q 8 22 0 40`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.4 * Math.sin(t / 8 + i)} />)}
    <g transform="translate(1090 660)"><rect x={-70} y={-26} width={140} height={30} rx={8} fill="#8A8F94" stroke={INK} strokeWidth={5} /><path d="M -60 -26 L 0 -90 L 60 -26" fill="none" stroke={INK} strokeWidth={6} /><circle cx={0} cy={-62} r={26} fill="#F6EFE3" stroke={INK} strokeWidth={5} /><path d="M 0 -62 L 12 -76" stroke="#D9453A" strokeWidth={4} /></g>
    {[0, 1, 2].map((i) => <rect key={i} x={1480 + i * 14} y={612 - i * 22} width={150} height={20} rx={5} fill="#3E8C6B" stroke={INK} strokeWidth={4} />)}
  </g>
);

export const StallFront: React.FC = () => (
  <g>
    <rect x={880} y={690} width={1040} height={26} fill="#E9E4D8" stroke={INK} strokeWidth={6} />
    <rect x={880} y={990} width={1040} height={90} fill="#5A3A22" stroke={INK} strokeWidth={5} />
    <path d="M 930 740 L 1010 740 L 930 940 Z" fill="#FFFFFF" opacity={0.14} />
  </g>
);

export const StallSign: React.FC<{ x: number; y: number; t: number; flip?: number; drop?: number }> = ({ x, y, t, flip = 0, drop = 1 }) => {
  const d = easeOut(clamp(drop));
  const swing = Math.sin(t / 8) * 5 * Math.exp(-t / 70) + (1 - d) * 0;
  const f = easeOut(clamp(flip));
  const sx = Math.abs(Math.cos(f * Math.PI));
  const front = f > 0.5;
  const pivY = y - 330;
  const dy = (1 - d) * -340;
  return (
    <g transform={`translate(${x} ${pivY + dy}) rotate(${swing * (1 + (1 - d) * 3)})`}>
      <path d="M -150 0 L -150 300 M 150 0 L 150 300" stroke={INK} strokeWidth={5} />
      <g transform={`translate(0 330) scale(${Math.max(0.04, sx)} 1)`}>
        <rect x={-230} y={-120} width={460} height={240} rx={20} fill={front ? '#F6EFE3' : '#C9B48E'} stroke={INK} strokeWidth={8} />
        {front ? (
          <g>
            <rect x={-210} y={-100} width={420} height={200} rx={12} fill="none" stroke="#D9453A" strokeWidth={8} />
            <text textAnchor="middle" y={-12} fontFamily={FONT.ui} fontWeight={700} fontSize={92} fill="#D9453A">HẾT</text>
            <text textAnchor="middle" y={78} fontFamily={FONT.ui} fontWeight={700} fontSize={92} fill="#D9453A">HÀNG</text>
          </g>
        ) : <path d="M -190 -60 H 190 M -190 -10 H 140 M -190 40 H 170 M -190 80 H 90" stroke="#9A855E" strokeWidth={6} strokeLinecap="round" />}
      </g>
    </g>
  );
};
