import React from 'react';
import { clamp, easeInOut, rnd, Glow, FONT } from '../../engine';
import { INK } from './chc-note-and-object-props';

// Chapter C props (4/4): a flip calendar (months flipping, fast-forward spin or one flip at a time) and the grandmother's
// countryside: house front with a porch, a rattan chair, a yard, a wooden gate onto the lane, falling leaves.

/**
 * A tear-off wall calendar centred on (x, y), 360 x 450 at s = 1. `m` is a continuous month counter: the page for month
 * floor(m) flips up over the hinge as frac(m) runs 0..1 (eased unless `lin`), showing the next month under it.
 */
export const FlipCalendar: React.FC<{ x: number; y: number; s?: number; m: number; lin?: boolean; first?: number }> = ({ x, y, s = 1, m, lin = false, first = 0 }) => {
  const k = Math.floor(m);
  const fr = m - k;
  const f = lin ? fr : easeInOut(fr);
  const month = (i: number) => ((first + i) % 12) + 1;
  const Page: React.FC<{ n: number; back?: boolean }> = ({ n, back = false }) => (
    <g>
      <rect x={-180} y={0} width={360} height={410} fill={back ? '#D8D0BF' : '#F3ECDD'} stroke={INK} strokeWidth={4} />
      {!back ? (
        <g>
          <rect x={-180} y={0} width={360} height={100} fill="#D9534F" />
          <text x={0} y={72} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill="#FFF3DC" letterSpacing={3}>{`THÁNG ${n}`}</text>
          {Array.from({ length: 28 }).map((_, i) => <circle key={i} cx={-132 + (i % 7) * 44} cy={146 + Math.floor(i / 7) * 56} r={9} fill={INK} opacity={0.3} />)}
        </g>
      ) : null}
    </g>
  );
  const flipY = Math.cos(f * Math.PI);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-172} y={-196} width={360} height={430} fill="#000" opacity={0.3} />
      <g transform="translate(0 -205)">
        <Page n={month(k + 1)} />
        {/* the page turning up over the hinge */}
        <g transform={`scale(1 ${flipY})`} opacity={f >= 1 ? 0 : 1}>
          <Page n={month(k)} back={flipY < 0} />
        </g>
        <rect x={-180} y={-14} width={360} height={26} rx={6} fill="#3A3444" />
        {[-120, -40, 40, 120].map((rx) => <circle key={rx} cx={rx} cy={-2} r={9} fill="#C9CBD6" />)}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- the countryside
/** A falling leaf field: n leaves drifting down and sideways across the region. Pure function of t. */
export const Leaves: React.FC<{ t: number; n?: number; x0?: number; w?: number; y0?: number; h?: number; seed?: number }> = ({ t, n = 14, x0 = 300, w = 1400, y0 = 100, h = 760, seed = 4 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const sp = 0.8 + rnd(seed, i) * 1.1;
      const k = ((t * sp) / 110 + rnd(seed + 1, i)) % 1;
      const lx = x0 + rnd(seed + 2, i) * w + Math.sin(k * 9 + i) * 60 + k * 90;
      const ly = y0 + k * h;
      return (
        <g key={i} transform={`translate(${lx} ${ly}) rotate(${k * 360 * (i % 2 ? 1 : -1) + i * 40}) scale(${0.8 + rnd(seed + 3, i) * 0.7})`} opacity={clamp(k * 6) * clamp((1 - k) * 8)}>
          <path d="M 0 -16 Q 14 -4 0 16 Q -14 -4 0 -16 Z" fill={['#D9893A', '#B8602A', '#E3B04B', '#A5502A'][i % 4]} />
          <path d="M 0 -14 V 14" stroke="#6E3A18" strokeWidth={2} />
        </g>
      );
    })}
  </g>
);

/**
 * Grandmother's yard in the late afternoon: sky and hills, the house front on the left with a porch (floor at y 800), a swept
 * yard, a wooden gate at x about 1500 onto an empty lane. `id` keeps the gradients unique.
 */
export const CountrySide: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FB8D0" /><stop offset="0.7" stopColor="#F6D9A4" /><stop offset="1" stopColor="#F2C58A" /></linearGradient>
      <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8C690" /><stop offset="1" stopColor="#CFA070" /></linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={1300} fill={`url(#${id}sky)`} />
    <circle cx={1560} cy={330} r={80} fill="#FFF3C8" opacity={0.85} />
    <Glow x={1560} y={330} r={620} o={0.4} />
    {/* far hills, trees and a field */}
    <path d="M -400 560 Q 100 400 500 520 Q 900 420 1300 520 Q 1700 400 2320 520 V 800 H -400 Z" fill="#7FA68A" opacity={0.75} />
    <path d="M -400 640 Q 300 540 800 620 Q 1300 540 2320 640 V 800 H -400 Z" fill="#6A9A6E" />
    {[1100, 1260, 1750, 1900].map((tx, i) => (
      <g key={i} transform={`translate(${tx} 700)`}>
        <rect x={-9} y={-150 + i * 8} width={18} height={150} fill="#5A3E2A" />
        <ellipse cx={0} cy={-190 + i * 8} rx={86} ry={78} fill={i % 2 ? '#4E8A5A' : '#5C9A62'} />
        <ellipse cx={-30 + Math.sin(t / 30 + i) * 3} cy={-210 + i * 8} rx={40} ry={34} fill="#6FB06E" opacity={0.7} />
      </g>
    ))}
    {/* the lane and the swept yard */}
    <rect x={-400} y={700} width={2720} height={500} fill="#C9A06A" />
    <path d="M 1380 700 L 1560 700 L 1900 1100 L 1080 1100 Z" fill="#B58C58" opacity={0.7} />
    <rect x={-400} y={800} width={2720} height={400} fill="#D8B27C" />
    {/* the house front: wall, door, window, tiled roof overhang */}
    <rect x={-400} y={120} width={1150} height={680} fill={`url(#${id}wall)`} />
    <rect x={-400} y={780} width={1150} height={26} fill="#8A6A4A" />
    <path d="M -400 -40 H 800 L 740 130 H -400 Z" fill="#9A4A3A" />
    {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${-400 + i * 100} -40 L ${-420 + i * 100} 130`} stroke="#7A3A2C" strokeWidth={4} />)}
    <rect x={-400} y={130} width={1150} height={20} fill="#6E3326" />
    <rect x={380} y={230} width={230} height={550} rx={6} fill="#7A4E2E" stroke="#4A2E20" strokeWidth={8} />
    <rect x={410} y={262} width={74} height={150} fill="#E9C98A" opacity={0.55} />
    <rect x={20} y={260} width={250} height={220} rx={8} fill="#BFE3F0" stroke="#7A4E2E" strokeWidth={12} />
    <path d="M 145 260 V 480 M 20 370 H 270" stroke="#7A4E2E" strokeWidth={7} />
    <g transform={`translate(160 150) rotate(${Math.sin(t / 24) * 2})`}>
      <path d="M 0 0 V 40" stroke="#4A2E20" strokeWidth={4} />
      <path d="M -34 40 H 34 L 24 92 H -24 Z" fill="#C9724A" stroke="#7A3F18" strokeWidth={4} />
      {[-26, -8, 12, 28].map((dx, i) => <path key={i} d={`M ${dx} 44 q ${dx * 0.3} 40 ${dx * 0.1} ${70 + (i % 2) * 18}`} stroke="#3E8C5A" strokeWidth={8} fill="none" strokeLinecap="round" />)}
    </g>
    {/* the porch floor and step */}
    <rect x={-400} y={800} width={1230} height={30} fill="#A9744C" />
    <rect x={-400} y={830} width={1230} height={14} fill="#7A4E2E" />
    {/* the gate: two posts, a wooden gate half open, a bamboo fence */}
    <g transform="translate(1500 800)">
      <rect x={-300} y={-120} width={200} height={14} fill="#A07A4A" />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-300 + i * 24} y={-150} width={10} height={150} rx={4} fill="#B8905A" />)}
      <rect x={-92} y={-210} width={30} height={216} fill="#8A6A4A" stroke={INK} strokeWidth={4} />
      <rect x={100} y={-210} width={30} height={216} fill="#8A6A4A" stroke={INK} strokeWidth={4} />
      <rect x={-98} y={-224} width={42} height={18} fill="#6E3326" /><rect x={94} y={-224} width={42} height={18} fill="#6E3326" />
      <path d="M -62 -170 L -62 -10 L 40 -26 L 40 -156 Z" fill="#9A7448" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -62 -120 L 40 -112 M -62 -60 L 40 -66" stroke="#6A4A2A" strokeWidth={6} />
      <ellipse cx={20} cy={6} rx={170} ry={12} fill="#000" opacity={0.18} />
    </g>
  </g>
);

/** The rattan porch chair seen from the side, facing right; origin at the seat middle, legs reach 150 below. */
export const PorchChair: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={-10} cy={150} rx={120} ry={12} fill="#000" opacity={0.25} />
    <path d="M -90 -4 L -100 -150 Q -100 -190 -60 -190 L -50 -4" fill="#C98F5A" stroke="#6E4630" strokeWidth={6} strokeLinejoin="round" />
    <rect x={-100} y={-6} width={150} height={24} rx={10} fill="#D9A46B" stroke="#6E4630" strokeWidth={6} />
    <path d="M -90 18 L -96 150 M 40 18 L 46 150" stroke="#6E4630" strokeWidth={10} strokeLinecap="round" />
    <path d="M -86 -150 H -60 M -88 -110 H -56 M -90 -70 H -54" stroke="#6E4630" strokeWidth={4} opacity={0.6} />
  </g>
);
