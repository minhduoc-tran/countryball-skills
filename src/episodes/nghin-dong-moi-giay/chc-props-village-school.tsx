import React from 'react';
import { Glow, clamp, easeOut, rnd } from '../../engine';

// Chapter C, the donation: a mountain village school yard on a cold misty morning, and the children in it. The yard
// is a full 1920 x 1080 backdrop (misty terraced hills, a small school with a red pennant, pines, a fence); the
// children are simple figures whose coats turn from grey to red as `coat` goes 0 to 1.

const mix = (a: string, b: string, k: number) => {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * clamp(k)).toString(16).padStart(2, '0')).join('')}`;
};

const Pine: React.FC<{ x: number; y: number; s: number; c?: string }> = ({ x, y, s, c = '#2F4A44' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-6} y={-30} width={12} height={34} fill="#3B2C28" />
    {[0, 1, 2].map((k) => <path key={k} d={`M ${-60 + k * 10} ${-30 - k * 50} L 0 ${-120 - k * 50} L ${60 - k * 10} ${-30 - k * 50} Z`} fill={c} />)}
    <path d="M 0 -270 L 10 -70 L 56 -34 Z" fill="#000" opacity={0.0} />
  </g>
);

/** The village school backdrop, 1920 x 1080. `mist` 0..1 thickness, `t` drifts the mist bands. */
export const VillageSchool: React.FC<{ t: number; id: string; mist?: number }> = ({ t, id, mist = 0.75 }) => {
  const drift = (k: number) => ((t * (0.35 + k * 0.1) + k * 500) % 2600) - 340;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7E98B8" /><stop offset="0.55" stopColor="#D9C8BC" /><stop offset="1" stopColor="#F2D9B8" />
        </linearGradient>
        <linearGradient id={`${id}mist`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EEF1F4" stopOpacity={0} /><stop offset="0.5" stopColor="#EEF1F4" stopOpacity={0.8} /><stop offset="1" stopColor="#EEF1F4" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={2720} height={1900} fill={`url(#${id}sky)`} />
      <circle cx={1500} cy={330} r={110} fill="#FFF1D2" opacity={0.85} />
      <Glow x={1500} y={330} r={620} o={0.55} />
      <path d="M -400 520 L 80 330 Q 260 250 440 360 L 700 250 Q 900 220 1080 380 L 1400 300 Q 1700 260 2320 470 L 2320 760 L -400 760 Z" fill="#8FA2B6" />
      <rect x={-400} y={380} width={2720} height={220} fill={`url(#${id}mist)`} opacity={mist * 0.9} />
      <path d="M -400 600 Q 160 430 520 520 Q 800 420 1180 540 Q 1560 440 2320 600 L 2320 820 L -400 820 Z" fill="#6E8576" />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M -400 ${620 + k * 34} Q 400 ${540 + k * 30} 1100 ${600 + k * 30} T 2320 ${640 + k * 30}`} stroke="#8FA88A" strokeWidth={4} fill="none" opacity={0.55} />)}
      <rect x={-400} y={560} width={2720} height={200} fill={`url(#${id}mist)`} opacity={mist} transform={`translate(${Math.sin(t / 60) * 30} 0)`} />
      {[0, 1, 2].map((k) => <ellipse key={k} cx={drift(k)} cy={640 + k * 40} rx={420} ry={34} fill="#F4F6F8" opacity={0.28 * mist} />)}
      {[[130, 700, 1.0], [250, 720, 0.75], [1660, 690, 0.95], [1790, 715, 1.2], [1560, 720, 0.7]].map(([x, y, s], i) => <Pine key={i} x={x} y={y} s={s * 0.9} c={i % 2 ? '#2C4640' : '#35524A'} />)}
      {/* the school: low cream building, brick-red roof, a door and windows, a red pennant on a pole */}
      <g transform="translate(1000 740)">
        <ellipse cx={0} cy={6} rx={400} ry={22} fill="#000" opacity={0.3} />
        <rect x={-330} y={-190} width={660} height={190} fill="#E4D2A4" />
        <rect x={-330} y={-190} width={140} height={190} fill="#C8B686" opacity={0.7} />
        <rect x={322} y={-186} width={8} height={186} fill="#FFE2B0" opacity={0.7} />
        <path d="M -370 -186 L -250 -270 L 250 -270 L 370 -186 Z" fill="#9A4A3C" />
        <path d="M -370 -186 L -250 -270 L -150 -270 L -230 -186 Z" fill="#7C3A30" />
        <path d="M 250 -270 L 370 -186 L 345 -186 L 230 -270 Z" fill="#C0654F" opacity={0.7} />
        <rect x={-50} y={-130} width={100} height={130} rx={6} fill="#6B4A36" />
        <rect x={-34} y={-116} width={68} height={116} fill="#F3C970" opacity={0.85} />
        {[-250, -150, 150, 250].map((wx) => <g key={wx}><rect x={wx - 36} y={-150} width={72} height={70} rx={4} fill="#F3C970" opacity={0.9} /><path d={`M ${wx} -150 L ${wx} -80 M ${wx - 36} -115 L ${wx + 36} -115`} stroke="#6B4A36" strokeWidth={5} /></g>)}
        <rect x={440} y={-330} width={8} height={330} fill="#7A6A5C" />
        <path d={`M 448 -326 Q ${490 + Math.sin(t / 5) * 8} ${-312 + Math.sin(t / 4) * 3} 540 -320 L 540 -270 Q ${490 + Math.sin(t / 5 + 1) * 8} ${-282} 448 -280 Z`} fill="#D6333E" />
      </g>
      {/* the yard and a low fence */}
      <rect x={-400} y={740} width={2720} height={500} fill="#B9A582" />
      <path d="M -400 740 L 2320 740 L 2320 770 L -400 770 Z" fill="#9A8A6A" />
      {Array.from({ length: 22 }).map((_, i) => <ellipse key={i} cx={-300 + rnd(3, i) * 2500} cy={800 + rnd(4, i) * 260} rx={30 + rnd(5, i) * 50} ry={6 + rnd(6, i) * 6} fill="#A8946F" opacity={0.6} />)}
      {Array.from({ length: 26 }).map((_, i) => <rect key={i} x={-120 + i * 88} y={716} width={10} height={44} fill="#7A5A3C" />)}
      <rect x={-400} y={728} width={2720} height={8} fill="#7A5A3C" />
    </g>
  );
};

/** A schoolchild, x the middle, y the feet; about 150 tall at s 1. `coat` 0 grey and thin, 1 a new red coat; shivers while cold. */
export const Child: React.FC<{ x: number; y: number; s?: number; t: number; coat?: number; seed?: number; cheer?: number; hair?: string }> = ({ x, y, s = 1, t, coat = 1, seed = 1, cheer = 0, hair = '#2A1E22' }) => {
  const cold = 1 - clamp(coat);
  const shiver = cold * Math.sin(t * 2.4 + seed * 3) * 2.2;
  const hop = cheer * Math.abs(Math.sin(t * 0.32 + seed)) * 26;
  const body = mix('#8A8E99', '#D6333E', coat);
  const shade = mix('#6E727D', '#A8232E', coat);
  return (
    <g transform={`translate(${x + shiver} ${y - hop}) scale(${s})`}>
      <ellipse cx={0} cy={hop + 3} rx={44} ry={9} fill="#000" opacity={0.3} />
      <rect x={-22} y={-52} width={15} height={52} rx={6} fill="#3A3446" />
      <rect x={7} y={-52} width={15} height={52} rx={6} fill="#3A3446" />
      <ellipse cx={-14} cy={0} rx={16} ry={7} fill="#2A2630" />
      <ellipse cx={16} cy={0} rx={16} ry={7} fill="#2A2630" />
      <path d={`M -46 ${-52 - 10 * 0} L -38 -122 Q 0 -140 38 -122 L 46 -52 Z`} fill={body} />
      <path d="M -46 -52 L -38 -122 Q -20 -130 -12 -128 L -14 -52 Z" fill={shade} opacity={0.7} />
      {coat > 0.5 ? <rect x={-3} y={-126} width={6} height={74} fill="#8F1A24" opacity={0.7} /> : null}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`rotate(${sd * -1 * (cheer > 0 ? -(150 + Math.sin(t * 0.5 + seed + sd) * 14) * cheer : 0)} ${sd * 38} -118)`}>
          <path d={`M ${sd * 38} -118 Q ${sd * 62} -90 ${sd * 56} -60`} stroke={body} strokeWidth={17} strokeLinecap="round" fill="none" />
          <circle cx={sd * 56} cy={-56} r={9} fill="#E8B898" />
        </g>
      ))}
      <circle cx={0} cy={-158} r={34} fill="#EFC9A4" />
      <path d="M -35 -160 Q -34 -200 0 -198 Q 34 -200 35 -160 Q 20 -178 0 -176 Q -20 -178 -35 -160 Z" fill={hair} />
      <circle cx={-12} cy={-152} r={3.6} fill="#2A1E22" />
      <circle cx={12} cy={-152} r={3.6} fill="#2A1E22" />
      <path d={coat > 0.5 ? 'M -9 -138 Q 0 -128 9 -138' : 'M -8 -136 Q 0 -141 8 -136'} stroke="#7A3A2E" strokeWidth={3} fill="none" strokeLinecap="round" />
      {coat > 0.5 ? <circle cx={-20} cy={-142} r={6} fill="#F28C8C" opacity={0.6} /> : <rect x={-34} y={-124} width={68} height={7} fill="#CFC9BC" opacity={0.0} />}
    </g>
  );
};

/** Children standing in the yard in a loose group; `coat` runs 0..1 (staggered), `cheer` 0..1. */
export const KidsRow: React.FC<{ t: number; coat: number; cheer?: number; y?: number; s?: number; x0?: number; step?: number; n?: number }> = ({ t, coat, cheer = 0, y = 900, s = 1.4, x0 = 480, step = 150, n = 7 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const yy = y + (i % 2) * 34;
      return <Child key={i} x={x0 + i * step + (i % 2) * 40} y={yy} s={s * (1 + (i % 2) * 0.1)} t={t} seed={i + 1} coat={easeOut(clamp(coat * 1.5 - i * 0.07))} cheer={cheer}
        hair={['#2A1E22', '#4A2A1E', '#1E1A26', '#3A2A20'][i % 4]} />;
    })}
  </g>
);
