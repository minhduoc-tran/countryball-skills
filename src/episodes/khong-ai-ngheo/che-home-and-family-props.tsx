import React from 'react';
import { FONT, Glow, clamp, backOut } from '../../engine';
import { Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';

// Chapter E props for the family evening: the warm xôi steamer, a stack of new books, Mo's naive painting of the
// family, the phone it arrives on, and laugh marks. Origins: ground contact (pot, books) or the centre (the rest).

/** The xôi steamer on the table: a steel pot, ears, an ajar lid, a golden mound inside and a rope of steam. Origin: its base. */
export const XoiPot: React.FC<{ x: number; y: number; s?: number; t: number; steam?: number }> = ({ x, y, s = 1, t, steam = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={96} ry={13} fill="#000" opacity={0.4} />
    <path d="M -80 0 L -90 -118 Q -90 -130 -76 -130 L 76 -130 Q 90 -130 90 -118 L 80 0 Z" fill="#B7BBC6" stroke="#4A4F5C" strokeWidth={4} />
    <path d="M 34 0 L 48 -130 L 90 -130 Q 90 -130 90 -118 L 80 0 Z" fill="#8E92A0" opacity={0.7} />
    <path d="M -84 -96 H 84" stroke="#4A4F5C" strokeWidth={3} opacity={0.5} />
    <path d="M -80 -30 Q -60 -40 -30 -34" stroke="#fff" strokeWidth={4} fill="none" opacity={0.35} strokeLinecap="round" />
    {/* ears */}
    <rect x={-116} y={-104} width={30} height={14} rx={7} fill="#5A4034" stroke="#2E1A12" strokeWidth={3} />
    <rect x={86} y={-104} width={30} height={14} rx={7} fill="#5A4034" stroke="#2E1A12" strokeWidth={3} />
    {/* the golden mound showing where the lid is ajar */}
    <ellipse cx={-6} cy={-132} rx={82} ry={13} fill="#F4D35E" stroke="#B8902A" strokeWidth={3} />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-48 + i * 20} cy={-134 + (i % 2) * 4} r={3.5} fill="#9B5FA8" opacity={0.75} />)}
    <g transform="rotate(-12 40 -142) translate(26 -6)">
      <ellipse cx={0} cy={-146} rx={86} ry={14} fill="#C9CDD8" stroke="#4A4F5C" strokeWidth={4} />
      <circle cx={0} cy={-162} r={9} fill="#4A4F5C" />
    </g>
    {steam > 0 ? <Steam x={-10} y={-146} t={t} n={6} h={190} w={26} o={0.6 * steam} seed={2} /> : null}
  </g>
);

/** A stack of three new books, spines facing us, a bookmark ribbon on the top one. Origin: the bottom centre. */
export const NewBooks: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={96} ry={10} fill="#000" opacity={0.3} />
    {[
      { w: 150, h: 34, c: '#C75B4A', d: '#9C4236', dx: 0 },
      { w: 138, h: 30, c: '#3E7FB0', d: '#2D6088', dx: 6 },
      { w: 124, h: 30, c: '#E2B84A', d: '#B8902A', dx: -4 },
    ].map((b, i, a) => {
      const y0 = -a.slice(0, i).reduce((m, q) => m + q.h, 0) - b.h;
      return (
        <g key={i}>
          <rect x={-b.w / 2 + b.dx} y={y0} width={b.w} height={b.h} rx={4} fill={b.c} stroke="#2A1C18" strokeWidth={3} />
          <rect x={-b.w / 2 + b.dx + 10} y={y0 + 7} width={b.w - 20} height={b.h - 14} rx={3} fill={b.d} opacity={0.55} />
          <rect x={-b.w / 2 + b.dx} y={y0} width={b.w} height={4} rx={2} fill="#fff" opacity={0.3} />
        </g>
      );
    })}
    <path d="M 40 -94 V -70 L 48 -78 L 56 -70 V -94 Z" fill="#F2E3C0" stroke="#7A5A28" strokeWidth={2} />
  </g>
);

/** Mo's first painting, naive and bright: a sun, a hill, a house with a red roof, and four stick people holding hands. 400 x 300 at s = 1, centred. */
export const FamilyPainting: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-210} y={-160} width={420} height={320} rx={6} fill="#000" opacity={0.25} transform="translate(5 8)" />
    <rect x={-206} y={-156} width={412} height={312} fill="#F6EFE3" stroke="#B8A98E" strokeWidth={3} />
    <rect x={-190} y={-140} width={380} height={280} fill="#9FD3EC" />
    {/* the sun with wobbly rays */}
    <circle cx={120} cy={-86} r={34} fill="#FFD84A" />
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return <path key={i} d={`M ${120 + Math.cos(a) * 42} ${-86 + Math.sin(a) * 42} L ${120 + Math.cos(a) * (58 + (i % 2) * 8)} ${-86 + Math.sin(a) * (58 + (i % 2) * 8)}`} stroke="#FFB82A" strokeWidth={6} strokeLinecap="round" />;
    })}
    {/* a green hill and the house */}
    <path d="M -190 60 Q -60 -10 60 40 Q 130 70 190 30 V 140 H -190 Z" fill="#6DBE6A" />
    <rect x={-150} y={-10} width={92} height={74} fill="#F2D6A0" stroke="#7A5A28" strokeWidth={4} />
    <path d="M -162 -8 L -104 -56 L -46 -8 Z" fill="#D9473A" stroke="#7A2A22" strokeWidth={4} strokeLinejoin="round" />
    <rect x={-116} y={26} width={26} height={38} fill="#8B5A3C" />
    <rect x={-146} y={4} width={22} height={20} fill="#9FD3EC" stroke="#7A5A28" strokeWidth={3} />
    {/* four stick people in a row, hands joined: mum, Pip, sis, and a small one */}
    {[
      { x: -16, h: 78, c: '#C25B7A' },
      { x: 24, h: 84, c: '#3A3650' },
      { x: 62, h: 58, c: '#2FA39A' },
      { x: 96, h: 48, c: '#F28C6A' },
    ].map((p, i) => (
      <g key={i} stroke="#2A1C18" strokeWidth={5} strokeLinecap="round" fill="none">
        <circle cx={p.x} cy={118 - p.h - 12} r={11} fill="#F2C79B" />
        <path d={`M ${p.x} ${118 - p.h} V ${118 - 26} M ${p.x} ${118 - 26} L ${p.x - 9} 118 M ${p.x} ${118 - 26} L ${p.x + 9} 118`} stroke={p.c} />
        <path d={`M ${p.x - 20} ${118 - p.h * 0.62} H ${p.x + 20}`} stroke={p.c} />
      </g>
    ))}
    <text x={160} y={132} textAnchor="end" fontFamily={FONT.hand} fontSize={22} fill="#7A3F18">MO</text>
  </g>
);

/**
 * Mo's message on a phone, seen head on: the notification banner slides in, then the chat opens with the painting.
 * 300 x 600 at s = 1, centred. `p` runs 0..1 over the reveal: the banner first, the picture bubble after.
 */
export const PhoneChat: React.FC<{ x: number; y: number; s?: number; rot?: number; p: number; t: number }> = ({ x, y, s = 1, rot = 0, p, t }) => {
  const banner = backOut(clamp(p * 3));
  const bubble = backOut(clamp((p - 0.3) * 2.4));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <Glow x={0} y={-40} r={420} o={0.35} />
      <rect x={-150} y={-300} width={300} height={600} rx={38} fill="#17151E" stroke="#3A3748" strokeWidth={5} />
      <rect x={-134} y={-282} width={268} height={564} rx={26} fill="#F3EBDD" />
      <rect x={-134} y={-282} width={268} height={60} rx={26} fill="#E4D5BA" />
      <rect x={-134} y={-244} width={268} height={22} fill="#E4D5BA" />
      {/* the contact: Mo's curls and name */}
      <circle cx={-96} cy={-252} r={17} fill="#C98E68" />
      <path d="M -112 -262 q 6 -16 16 -14 q 10 -4 18 12 q -16 -8 -34 2 Z" fill="#2A1C18" />
      <text x={-68} y={-244} fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#3A2A20">MO</text>
      {/* the picture bubble */}
      <g transform={`translate(-8 -78) scale(${bubble})`} opacity={bubble > 0 ? 1 : 0}>
        <rect x={-118} y={-104} width={236} height={188} rx={18} fill="#FFFFFF" stroke="#D9C9A8" strokeWidth={3} />
        <FamilyPainting x={0} y={-10} s={0.52} />
      </g>
      {/* a heart under it, beating */}
      <g transform={`translate(88 70) scale(${bubble * (1 + 0.1 * Math.sin(t / 5))})`}>
        <path d="M 0 14 C -26 -4 -20 -26 0 -14 C 20 -26 26 -4 0 14 Z" fill="#E4505A" stroke="#8A2A32" strokeWidth={3} />
      </g>
      {/* the banner that slides in from the top */}
      <g transform={`translate(0 ${-330 + 120 * banner})`} opacity={banner > 0.02 ? 1 : 0}>
        <rect x={-126} y={-30} width={252} height={60} rx={16} fill="#2B2733" opacity={0.94} />
        <circle cx={-96} cy={0} r={15} fill="#C98E68" />
        <text x={-70} y={9} fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#F6EFE3">MO</text>
        <rect x={-14} y={-6} width={96} height={12} rx={6} fill="#F6EFE3" opacity={0.5} />
      </g>
    </g>
  );
};

/** Laugh marks beside a head: short rays that pulse on and off. */
export const LaughMarks: React.FC<{ x: number; y: number; t: number; s?: number; flip?: boolean }> = ({ x, y, t, s = 1, flip = false }) => {
  const k = 0.55 + 0.45 * Math.abs(Math.sin(t / 4));
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} stroke="#FFD76A" strokeWidth={7} strokeLinecap="round" opacity={0.9}>
      {[-24, 0, 24].map((a, i) => (
        <path key={i} d={`M ${40 * Math.cos((a * Math.PI) / 180)} ${-40 * Math.sin((a * Math.PI) / 180) * -1} L ${(40 + 28 * k) * Math.cos((a * Math.PI) / 180)} ${(40 + 28 * k) * Math.sin((a * Math.PI) / 180)}`} />
      ))}
    </g>
  );
};
