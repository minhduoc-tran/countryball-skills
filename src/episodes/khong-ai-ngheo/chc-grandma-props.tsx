import React from 'react';
import { Glow, rnd } from '../../engine';
import { Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { INK } from './chc-family-props';

// Chapter C props, grandma beat: the lottery-ticket strip, the porch (house front, rattan chair, little table), a teapot
// and cup, birds, rain, and a scrolling pavement for the "30 years of walking" feet. All pure functions of the clock.

/** A strip of lottery tickets hanging from (x, y) (the hand), swinging with `t`. About 190 tall at s = 1. */
export const LotteryStrip: React.FC<{ x: number; y: number; t: number; s?: number; n?: number }> = ({ x, y, t, s = 1, n = 6 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }).map((_, i) => {
      const sw = Math.sin(t / 7 - i * 0.45) * (3 + i * 2.2);
      return (
        <g key={i} transform={`translate(${sw * i * 0.4} ${i * 34}) rotate(${sw * 0.5})`}>
          <rect x={-22} y={0} width={44} height={38} rx={4} fill={['#E8D49A', '#F2A9A0', '#A9D6C2', '#BFC8F0'][i % 4]} stroke={INK} strokeWidth={3} />
          <path d="M -14 10 H 14 M -14 20 H 8 M -14 29 H 12" stroke={INK} strokeWidth={3} opacity={0.55} strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

/** The house front with a porch: warm wall, door, roof overhang, hanging plant, rail. Floor at y 800. */
export const PorchBackdrop: React.FC<{ t: number; id: string; open?: boolean }> = ({ t, id, open = false }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFE3F0" /><stop offset="1" stopColor="#F9E7C0" /></linearGradient>
      <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0CF9C" /><stop offset="1" stopColor="#D9A877" /></linearGradient>
    </defs>
    <rect x={-300} y={-300} width={2520} height={1500} fill={`url(#${id}sky)`} />
    {open ? (
      <g>
        <g filter="url(#blur6)">
          <ellipse cx={380} cy={640} rx={420} ry={260} fill="#6FA86A" /><ellipse cx={1500} cy={620} rx={480} ry={280} fill="#5E9A5C" />
          <ellipse cx={940} cy={700} rx={520} ry={120} fill="#8DBB78" />
        </g>
        <circle cx={1500} cy={250} r={90} fill="#FFF3C8" opacity={0.85} />
        <Glow x={1500} y={250} r={520} o={0.35} />
        {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={-200 + i * 250} y={560} width={16} height={240} fill="#8A5A3C" />)}
        <rect x={-300} y={548} width={2520} height={22} rx={6} fill="#A9744C" stroke="#6E4630" strokeWidth={4} />
        <rect x={-300} y={640} width={2520} height={12} fill="#8A5A3C" />
      </g>
    ) : null}
    {/* the house wall, door and window */}
    {!open ? <g>
    <rect x={-300} y={60} width={2520} height={740} fill={`url(#${id}wall)`} />
    <rect x={-300} y={60} width={2520} height={30} fill="#8A5A3C" />
    <rect x={1330} y={180} width={300} height={620} rx={8} fill="#7A4E2E" stroke="#4A2E20" strokeWidth={8} />
    <rect x={1370} y={230} width={100} height={170} rx={6} fill="#E9C98A" opacity={0.7} />
    <circle cx={1590} cy={520} r={12} fill="#E8CB7A" />
    <rect x={260} y={210} width={360} height={290} rx={10} fill="#BFE3F0" stroke="#7A4E2E" strokeWidth={12} />
    <path d="M 440 210 V 500 M 260 355 H 620" stroke="#7A4E2E" strokeWidth={8} />
    <rect x={226} y={210} width={38} height={290} fill="#6FA08A" stroke="#4A2E20" strokeWidth={4} />
    <rect x={616} y={210} width={38} height={290} fill="#6FA08A" stroke="#4A2E20" strokeWidth={4} />
    </g> : null}
    {/* roof overhang with a hanging plant */}
    <path d="M -300 -40 H 2220 V 120 H -300 Z" fill="#9A4A3A" />
    <path d="M -300 120 H 2220 V 146 H -300 Z" fill="#6E3326" />
    <g transform={`translate(1100 146) rotate(${Math.sin(t / 22) * 2})`}>
      <path d="M 0 0 V 70" stroke="#4A2E20" strokeWidth={4} />
      <path d="M -40 70 H 40 L 28 130 H -28 Z" fill="#C9724A" stroke="#7A3F18" strokeWidth={4} />
      {[-34, -14, 10, 32].map((dx, i) => <path key={i} d={`M ${dx} 74 q ${dx * 0.3} 50 ${dx * 0.1} ${90 + (i % 2) * 24}`} stroke="#3E8C5A" strokeWidth={9} fill="none" strokeLinecap="round" />)}
    </g>
    {/* porch floor */}
    <rect x={-300} y={800} width={2520} height={500} fill="#A9744C" />
    <rect x={-300} y={800} width={2520} height={16} fill="#7A4E2E" />
    {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${-300 + i * 340} 816 V 1200`} stroke="#8A5A3C" strokeWidth={3} opacity={0.6} />)}
    <Glow x={640} y={300} r={760} o={0.32} />
  </g>
);

/** A rattan chair seen from the side, facing right; origin: seat level, middle of the seat. */
export const PorchChair: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={-10} cy={150} rx={120} ry={12} fill="#000" opacity={0.25} />
    <path d="M -90 -4 L -100 -150 Q -100 -190 -60 -190 L -50 -4" fill="#C98F5A" stroke="#6E4630" strokeWidth={6} strokeLinejoin="round" />
    <rect x={-100} y={-6} width={150} height={24} rx={10} fill="#D9A46B" stroke="#6E4630" strokeWidth={6} />
    <path d="M -90 18 L -96 150 M 40 18 L 46 150" stroke="#6E4630" strokeWidth={10} strokeLinecap="round" />
    <path d="M -86 -150 H -60 M -88 -110 H -56 M -90 -70 H -54" stroke="#6E4630" strokeWidth={4} opacity={0.6} />
  </g>
);

/** A small round table; origin at the top-centre, legs 170 down. */
export const PorchTable: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={170} rx={100} ry={10} fill="#000" opacity={0.25} />
    <path d="M 0 10 V 168 M -50 168 H 50" stroke="#6E4630" strokeWidth={12} strokeLinecap="round" />
    <ellipse cx={0} cy={4} rx={110} ry={16} fill="#D9A46B" stroke="#6E4630" strokeWidth={6} />
  </g>
);

/** A clay teapot, origin at its base centre, spout to the right; `tilt` degrees pours. */
export const Teapot: React.FC<{ x: number; y: number; s?: number; tilt?: number; t?: number; steam?: boolean }> = ({ x, y, s = 1, tilt = 0, t = 0, steam = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={50} ry={6} fill="#000" opacity={0.25} />
    <path d="M -46 0 Q -58 -50 -30 -72 H 30 Q 58 -50 46 0 Z" fill="#B8603E" stroke="#6E2F1A" strokeWidth={5} strokeLinejoin="round" />
    <path d="M 40 -34 Q 78 -50 84 -76 L 70 -78 Q 62 -58 36 -52" fill="#B8603E" stroke="#6E2F1A" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -46 -50 Q -84 -50 -78 -22 Q -72 -6 -44 -12" fill="none" stroke="#6E2F1A" strokeWidth={8} strokeLinecap="round" />
    <path d="M -30 -72 Q 0 -90 30 -72 Z" fill="#9A4A2E" stroke="#6E2F1A" strokeWidth={4} />
    <circle cx={0} cy={-90} r={8} fill="#6E2F1A" />
    {steam ? <Steam x={0} y={-96} t={t} n={4} h={110} w={14} o={0.5} seed={2} /> : null}
  </g>
);

/** A small tea cup; origin at its base centre. */
export const TeaCup: React.FC<{ x: number; y: number; s?: number; t?: number; level?: number }> = ({ x, y, s = 1, t = 0, level = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={36} ry={5} fill="#000" opacity={0.25} />
    <path d="M -30 -50 H 30 Q 28 0 0 0 Q -28 0 -30 -50 Z" fill="#F6F1E6" stroke="#8A7A5E" strokeWidth={4} />
    <ellipse cx={0} cy={-48} rx={28} ry={6} fill="#C9843A" opacity={0.4 + 0.6 * level} />
    <path d="M 30 -40 q 22 0 18 18 q -4 10 -24 8" fill="none" stroke="#8A7A5E" strokeWidth={5} />
    {level > 0.5 ? <Steam x={0} y={-54} t={t} n={4} h={90} w={12} o={0.55} seed={5} /> : null}
  </g>
);

/** A sparrow: body, wing flap while `fly` is 1, a head bob while perched. Faces right. */
export const Bird: React.FC<{ x: number; y: number; t: number; fly?: number; s?: number; seed?: number }> = ({ x, y, t, fly = 1, s = 1, seed = 0 }) => {
  const flap = fly ? Math.sin(t * 0.9 + seed) * 26 : 0;
  const bob = fly ? 0 : Math.max(0, Math.sin(t / 6 + seed * 3)) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={22} ry={13} fill="#8A6A4A" />
      <circle cx={18} cy={-8 + bob * 0.3} r={9} fill="#9A7A58" />
      <path d="M 26 -8 l 10 3 l -10 3 Z" fill="#E8B04A" />
      <circle cx={21} cy={-10 + bob * 0.3} r={2.2} fill={INK} />
      <path d="M -22 -2 l -18 8 l 18 2 Z" fill="#6E5238" />
      <path d={`M -4 -6 Q -14 ${-30 - flap} -34 ${-24 - flap} Q -18 -10 -4 -2 Z`} fill="#6E5238" stroke="#4A3626" strokeWidth={2} />
    </g>
  );
};

/** Rain streaks over the whole frame, falling with `t`. */
export const RainStreaks: React.FC<{ t: number; n?: number; o?: number; seed?: number }> = ({ t, n = 70, o = 0.55, seed = 1 }) => (
  <g stroke="#CFE0F0" strokeWidth={3} strokeLinecap="round" opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const x = -100 + rnd(seed, i) * 2100;
      const y = ((rnd(seed + 1, i) * 1300 + t * (34 + rnd(seed + 2, i) * 20)) % 1300) - 150;
      return <path key={i} d={`M ${x} ${y} l -10 40`} />;
    })}
  </g>
);

/** Pavement running past under walking feet: slabs scrolling left. Top surface at y `top`. */
export const ScrollingPavement: React.FC<{ t: number; top: number; speed?: number; wet?: number }> = ({ t, top, speed = 9, wet = 0 }) => {
  const off = (t * speed) % 260;
  return (
    <g>
      <rect x={-300} y={top} width={2520} height={700} fill={wet ? '#5A6272' : '#B9A58A'} />
      <rect x={-300} y={top} width={2520} height={22} fill={wet ? '#7A8496' : '#D6C4A6'} />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${-260 + i * 260 - off} ${top + 22} L ${-340 + i * 260 - off} ${top + 700}`} stroke={wet ? '#454C5A' : '#8E7B60'} strokeWidth={6} />)}
      {wet ? <ellipse cx={1300} cy={top + 90} rx={220} ry={26} fill="#8FA4C0" opacity={0.35} /> : null}
    </g>
  );
};
