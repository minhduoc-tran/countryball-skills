import React from 'react';
import { clamp, rnd, FONT } from '../../engine';
import { PAL } from './kit-palette';

// Props, part 2 (re-exported from kit-props.tsx). x, y = CENTRE unless said. Pure functions.
//   <IceCreamStack x y n s? />  n cones fanned out like a bouquet in one fist; x y = where the hand grips (the
//       cone tips meet there). ~360 wide x 330 tall for n = 10 at s 1. Scoops cycle through 5 flavours.
//   <MegaTicket x y s nums id fade? t? />  a generic lottery ticket "MEGA 6/45" (no real logo), ~440 x 230 at s 1, six
//       two-digit numbers in circles (nums: number[] of 6), a barcode and "THỨ TƯ" draw line. fade 0..1 dissolves it
//       (greys, breaks into cyan flakes): the ticket vanishing at 06:00.
//   <Wallet50k x y s open? />  an open brown wallet (x y = its spine, ~350 x 210 at s 1) with ONE 50.000 note sticking
//       out of the top-right pocket (reaches ~200 above and ~290 right of x y).
//   <Dumbbell x y s rot? />  a hand dumbbell, ~260 long at s 1, x y = the grip's centre.

const FLAVOURS = [['#F7C8D8', '#E89AB4'], ['#F4E3B8', '#D9C08A'], ['#8A5A44', '#6A4232'], ['#BDE7C8', '#8CCBA0'], ['#F2B33D', '#D4922A']];

export const IceCreamStack: React.FC<{ x: number; y: number; n?: number; s?: number }> = ({ x, y, n = 10, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }).map((_, i) => {
      const k = n === 1 ? 0 : i / (n - 1) - 0.5;
      const a = k * 70;
      const [c, sh] = FLAVOURS[i % FLAVOURS.length];
      return (
        <g key={i} transform={`rotate(${a}) translate(0 ${-Math.abs(k) * 10})`}>
          {/* the wafer cone with its cross-hatch, then the scoop and a drip */}
          <path d="M -28 -150 L 28 -150 L 0 0 Z" fill="#D9A15A" stroke="#6A4420" strokeWidth={4} strokeLinejoin="round" />
          <path d="M -18 -130 L 10 -60 M 2 -150 L 20 -104 M -8 -96 L 18 -130 M -14 -122 L 14 -150" stroke="#A8743A" strokeWidth={2.5} />
          <circle cx={0} cy={-176} r={38} fill={c} stroke="#5A3A2E" strokeWidth={4} />
          <path d="M -36 -164 Q -20 -150 -6 -160 Q 6 -148 20 -158 Q 30 -150 36 -164" stroke={sh} strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M -20 -196 Q -8 -208 8 -204" stroke="#FFFFFF" strokeWidth={5} opacity={0.5} fill="none" strokeLinecap="round" />
          {i % 3 === 0 ? <circle cx={4} cy={-218} r={7} fill="#C8382E" stroke="#5A1A14" strokeWidth={2} /> : null}
        </g>
      );
    })}
  </g>
);

export const MegaTicket: React.FC<{ x: number; y: number; s?: number; nums?: number[]; id: string; fade?: number; t?: number; rot?: number }> = ({ x, y, s = 1, nums = [7, 14, 21, 28, 35, 42], id, fade = 0, t = 0, rot = 0 }) => {
  const f = clamp(fade);
  const grey = f > 0 ? `grayscale(${Math.min(1, f * 2)})` : undefined;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <g opacity={1 - clamp((f - 0.35) * 1.6)} style={grey ? { filter: grey } : undefined}>
        <rect x={-214} y={-106} width={440} height={230} rx={14} fill="#000" opacity={0.3} />
        <path d="M -220 -115 H 220 V -30 A 16 16 0 0 0 220 2 V 115 H -220 V 2 A 16 16 0 0 0 -220 -30 Z" fill="#FFF6E2" stroke="#7A4A12" strokeWidth={5} strokeLinejoin="round" />
        <path d="M -220 -115 H 220 V -60 H -220 Z" fill="#C8382E" />
        <path d="M -220 -60 H 220" stroke="#F2C14E" strokeWidth={6} />
        <text x={-196} y={-74} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFF6E2" letterSpacing={2}>MEGA 6/45</text>
        <circle cx={168} cy={-88} r={20} fill="#F2C14E" stroke="#7A4A12" strokeWidth={3} />
        <path d="M 168 -102 l 4 9 l 10 1 l -8 7 l 3 10 l -9 -6 l -9 6 l 3 -10 l -8 -7 l 10 -1 Z" fill="#C8382E" />
        {nums.slice(0, 6).map((v, i) => (
          <g key={i}>
            <circle cx={-170 + i * 68} cy={-4} r={29} fill="#FFFFFF" stroke="#C8382E" strokeWidth={5} />
            <text x={-170 + i * 68} y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill="#2A1A08">{String(v).padStart(2, '0')}</text>
          </g>
        ))}
        <text x={-196} y={62} fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#7A4A12">KỲ QUAY: THỨ TƯ</text>
        <text x={-196} y={92} fontFamily={FONT.ui} fontSize={20} fill="#7A4A12">GIÁ: 10.000đ</text>
        {Array.from({ length: 28 }).map((_, i) => <rect key={i} x={70 + i * 5} y={46} width={rnd(91, i) > 0.5 ? 3 : 1.5} height={54} fill="#2A1A08" />)}
        <path d="M -200 30 H 200" stroke="#7A4A12" strokeWidth={2} strokeDasharray="8 6" />
      </g>
      {/* dissolving: cyan flakes lift off the ticket */}
      {f > 0 && f < 1
        ? Array.from({ length: 22 }).map((_, i) => {
            const k = clamp((f - rnd(93, i) * 0.4) * 2);
            return <rect key={`${id}f${i}`} x={-200 + rnd(94, i) * 400 + Math.sin(t / 6 + i) * 10 * k} y={-100 + rnd(95, i) * 200 - k * 160} width={14} height={10} fill={PAL.cyan} opacity={k > 0 ? (1 - k) * 0.9 : 0} transform={`rotate(${i * 40 + t * 3})`} />;
          })
        : null}
    </g>
  );
};

export const Wallet50k: React.FC<{ x: number; y: number; s?: number; open?: boolean }> = ({ x, y, s = 1, open = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={10} cy={120} rx={190} ry={20} fill="#000" opacity={0.3} />
    {open ? <rect x={-176} y={-100} width={176} height={210} rx={14} fill="#5A3A28" stroke="#24160E" strokeWidth={5} /> : null}
    {/* the note, sliding out of the right pocket: generic 50.000 design, pink-violet */}
    <g transform="translate(36 -150) rotate(-8)">
      <rect x={-10} y={-50} width={260} height={120} rx={6} fill="#D98AB4" stroke="#6A2A4E" strokeWidth={4} />
      <rect x={4} y={-36} width={232} height={92} rx={4} fill="none" stroke="#B05A8A" strokeWidth={3} />
      <circle cx={60} cy={10} r={30} fill="#E9B4CF" stroke="#B05A8A" strokeWidth={3} />
      <text x={226} y={-6} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#4A1A36">50.000</text>
      <text x={226} y={36} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={18} fill="#4A1A36" letterSpacing={3}>ĐỒNG</text>
    </g>
    <rect x={0} y={-100} width={176} height={210} rx={14} fill="#6E4A34" stroke="#24160E" strokeWidth={5} />
    <rect x={14} y={-30} width={148} height={124} rx={8} fill="#5A3A28" stroke="#3A2416" strokeWidth={3} />
    <path d="M 14 -30 H 162" stroke="#C9A06A" strokeWidth={3} strokeDasharray="6 5" />
    <path d="M 4 -96 H 172" stroke="#FFC98A" strokeWidth={3} opacity={0.5} />
    {open ? <path d="M 0 -100 L 0 110" stroke="#24160E" strokeWidth={6} /> : null}
  </g>
);

export const Dumbbell: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-9} width={140} height={18} rx={6} fill="#9A9AA8" stroke="#2A2630" strokeWidth={4} />
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <rect x={sd > 0 ? 70 : -106} y={-46} width={36} height={92} rx={10} fill="#2E2B3D" stroke="#121019" strokeWidth={4} />
        <rect x={sd > 0 ? 104 : -126} y={-32} width={22} height={64} rx={8} fill="#3A3650" stroke="#121019" strokeWidth={4} />
        <path d={`M ${sd > 0 ? 76 : -100} -40 L ${sd > 0 ? 76 : -100} 36`} stroke="#6A6688" strokeWidth={4} opacity={0.6} />
      </g>
    ))}
    {[-40, -20, 0, 20, 40].map((dx) => <path key={dx} d={`M ${dx} -9 L ${dx + 6} 9`} stroke="#6A6A78" strokeWidth={2} />)}
  </g>
);
