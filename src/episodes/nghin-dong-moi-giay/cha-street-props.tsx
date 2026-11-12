import React from 'react';
import { FONT, Glow } from '../../engine';

// Chapter A props drawn in the engine's style (flat fills, a darker side, a warm rim line, a contact shadow):
// a bánh mì baguette, the bánh mì cart, an ATM kiosk, a banknote, the red bow on the new motorbike, a phone in a hand.
// All origins are on the ground / the object's centre as noted; every prop is a pure function of its arguments.

/** A baguette lying along x, centre (x, y), ~230 wide at s 1: crust with slashes if `bite`. */
export const BanhMi: React.FC<{ x: number; y: number; s?: number; rot?: number; filling?: boolean }> = ({ x, y, s = 1, rot = 0, filling = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -112 4 Q -118 -26 -80 -34 L 78 -34 Q 118 -30 116 2 Q 112 30 74 34 L -78 34 Q -112 32 -112 4 Z" fill="#C98A3E" stroke="#6A3E1A" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -100 -4 Q -100 -26 -74 -30 L 76 -30 Q 104 -26 106 -6 Q 60 -14 -100 -4 Z" fill="#EBB868" />
    {[-70, -30, 10, 50].map((k) => (
      <path key={k} d={`M ${k} -30 Q ${k + 14} -12 ${k + 30} -26`} stroke="#8A5424" strokeWidth={5} fill="none" strokeLinecap="round" />
    ))}
    {filling ? (
      <g>
        <path d="M -90 -8 Q -40 -2 10 -10 Q 60 -2 100 -8" stroke="#7DBE5A" strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M -70 -2 Q -20 6 30 -2 Q 70 6 96 0" stroke="#E0705A" strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    ) : null}
    <path d="M -100 -30 L 70 -33" stroke="#FFE7B8" strokeWidth={3} opacity={0.7} strokeLinecap="round" />
  </g>
);

/** The bánh mì cart: wooden body, glass case with baguettes, a striped awning, a sign, two wheels. x, y on the ground; ~340 wide at s 1. */
export const BanhMiCart: React.FC<{ x: number; y: number; s?: number; t?: number; lit?: number }> = ({ x, y, s = 1, t = 0, lit = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={190} ry={14} fill="#000" opacity={0.4} />
    <circle cx={-110} cy={-34} r={34} fill="#1E1A22" /><circle cx={-110} cy={-34} r={16} fill="#8A8896" />
    <circle cx={110} cy={-34} r={34} fill="#1E1A22" /><circle cx={110} cy={-34} r={16} fill="#8A8896" />
    <path d="M -150 -70 L 150 -70 L 150 -190 L -150 -190 Z" fill="#9C4A32" />
    <path d="M 150 -70 L 150 -190 L 126 -190 L 126 -70 Z" fill="#6E3222" />
    <rect x={-150} y={-190} width={300} height={10} fill="#C46A48" />
    {/* the glass case */}
    <path d="M -140 -190 L 140 -190 L 140 -290 L -140 -290 Z" fill="#CFE6F2" opacity={0.28} stroke="#E6F2F8" strokeWidth={4} />
    {[0, 1, 2].map((i) => <BanhMi key={i} x={-30 + (i % 2) * 20} y={-212 - i * 24} s={0.95} rot={i % 2 ? 2 : -2} />)}
    <path d="M -130 -280 L -90 -196" stroke="#FFF" strokeWidth={5} opacity={0.35} />
    {/* awning and sign */}
    <path d="M -190 -290 L 190 -290 L 160 -350 L -160 -350 Z" fill="#E4A83A" />
    {[-160, -80, 0, 80].map((k) => <path key={k} d={`M ${k} -350 L ${k + 40} -350 L ${k + 50} -290 L ${k + 10} -290 Z`} fill="#D8483C" />)}
    <rect x={-120} y={-420} width={240} height={70} rx={10} fill="#1E1824" stroke="#FFD58A" strokeWidth={4} />
    <text y={-368} textAnchor="middle" fontFamily={FONT.hand} fontSize={52} fontWeight={700} fill="#FFD58A">BÁNH MÌ</text>
    <path d="M -90 -60 L -90 -20 M 90 -60 L 90 -20" stroke="#4A2A1E" strokeWidth={8} />
    {/* the warm lamp and steam */}
    <Glow x={0} y={-230} r={260} o={0.5 * lit} />
    {[0, 1].map((i) => <path key={i} d={`M ${-60 + i * 120} -300 q ${10 + Math.sin(t / 7 + i) * 8} -30 0 -60 q ${-10 + Math.sin(t / 9 + i) * 8} -30 4 -56`} stroke="#FFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.28} />)}
  </g>
);

/** An ATM kiosk on the pavement (x, y on the ground; ~220 wide, 430 tall at s 1). `cash` 0..1 slides notes out of the slot. */
export const AtmKiosk: React.FC<{ x: number; y: number; s?: number; t?: number; cash?: number; screen?: string }> = ({ x, y, s = 1, t = 0, cash = 0, screen = 'RÚT TIỀN' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={130} ry={12} fill="#000" opacity={0.4} />
    <path d="M -100 0 L -100 -400 L 100 -400 L 100 0 Z" fill="#46506A" />
    <path d="M 100 0 L 100 -400 L 78 -400 L 78 0 Z" fill="#323A52" />
    <path d="M -100 -400 L 100 -400 L 100 -430 L -100 -430 Z" fill="#2FA575" />
    <text y={-404} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fontWeight={700} fill="#F2FFF8" letterSpacing={6}>ATM</text>
    <rect x={-78} y={-370} width={156} height={110} rx={10} fill="#0E2A22" stroke="#1E1824" strokeWidth={5} />
    <rect x={-70} y={-362} width={140} height={94} rx={6} fill="#1E7A5A" />
    <text y={-306} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fontWeight={700} fill="#E9FFF2">{screen}</text>
    <rect x={-70} y={-240} width={140} height={74} rx={8} fill="#2A3048" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-58 + (i % 4) * 30} y={-232 + Math.floor(i / 4) * 22} width={22} height={16} rx={4} fill="#B8BCD0" />)}
    <rect x={-70} y={-140} width={140} height={30} rx={6} fill="#14121C" />
    <rect x={-60} y={-134} width={120} height={8} rx={4} fill="#000" />
    {cash > 0 ? (
      <g>
        {[0, 1, 2].map((i) => <Banknote key={i} x={0} y={-124 + cash * (34 + i * 6)} s={0.7} rot={(i - 1) * 3} w={110} clip />)}
      </g>
    ) : null}
    <Glow x={0} y={-310} r={200} kind="cool" o={0.35 + 0.05 * Math.sin(t / 5)} />
  </g>
);

/** A banknote (teal, polymer-style) centred on (x, y), `w` wide. */
export const Banknote: React.FC<{ x: number; y: number; s?: number; rot?: number; w?: number; label?: string; clip?: boolean }> = ({ x, y, s = 1, rot = 0, w = 170, label = '500.000', clip = false }) => {
  const h = w * 0.46;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-w / 2 + 4} y={-h / 2 + 5} width={w} height={h} rx={5} fill="#000" opacity={clip ? 0 : 0.3} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5} fill="#4FB8A8" stroke="#1F6A5E" strokeWidth={3} />
      <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} rx={3} fill="none" stroke="#CFF5EA" strokeWidth={2} opacity={0.7} />
      <circle cx={-w * 0.24} cy={0} r={h * 0.28} fill="#CFF5EA" opacity={0.55} />
      <text x={w * 0.14} y={h * 0.14} textAnchor="middle" fontFamily={FONT.ui} fontSize={h * 0.34} fontWeight={700} fill="#14473F">{label}</text>
    </g>
  );
};

/** A red gift bow with ribbons, centred on (x, y), ~120 wide at s 1; `pop` 0..1 scales it in. */
export const RedBow: React.FC<{ x: number; y: number; s?: number; pop?: number }> = ({ x, y, s = 1, pop = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * pop})`}>
    <path d="M 0 0 Q -70 -60 -64 -10 Q -60 26 0 0 Z" fill="#D8283C" stroke="#7A1022" strokeWidth={3} />
    <path d="M 0 0 Q 70 -60 64 -10 Q 60 26 0 0 Z" fill="#E4405A" stroke="#7A1022" strokeWidth={3} />
    <path d="M -4 6 L -34 64 L -14 56 L -4 78 L 6 14 Z" fill="#B81C30" stroke="#7A1022" strokeWidth={3} strokeLinejoin="round" />
    <path d="M 4 6 L 34 64 L 14 56 L 6 78 L -2 14 Z" fill="#D8283C" stroke="#7A1022" strokeWidth={3} strokeLinejoin="round" />
    <circle cx={0} cy={0} r={13} fill="#F25A70" stroke="#7A1022" strokeWidth={3} />
    <path d="M -50 -26 Q -30 -42 -14 -28" stroke="#FFC2CC" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
  </g>
);

/** A phone seen from its back/side in a raised hand: a small slab whose screen light spills onto the face (centre x, y). */
export const HeldPhone: React.FC<{ x: number; y: number; s?: number; rot?: number; glow?: number }> = ({ x, y, s = 1, rot = 0, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <Glow x={0} y={-20} r={150} kind="cool" o={0.7 * glow} />
    <rect x={-17} y={-34} width={34} height={64} rx={7} fill="#16151C" stroke="#3A3846" strokeWidth={2} />
    <rect x={-14} y={-31} width={28} height={58} rx={5} fill="#2FBF71" opacity={0.9 * glow + 0.1} />
    <rect x={-9} y={-23} width={18} height={8} rx={3} fill="#EFFFF6" opacity={0.9} />
  </g>
);
