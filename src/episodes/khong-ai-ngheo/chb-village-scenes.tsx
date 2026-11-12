import React from 'react';
import { Sun, Glow, Haze, Dust, rnd, clamp, easeOut } from '../../engine';

// Chapter B props (3/5): the village the children live in. A morning backdrop (sky, sun, two hill layers, a dirt road with
// the golden "sàn" line along it), a small village clinic, a family table and a bare hut interior. Ground line at y = 800.

export const GROUND_Y = 800;

/** The golden floor line (the episode's "sàn" motif): a glowing stripe along the ground, shimmering. */
export const GoldFloor: React.FC<{ y?: number; x0?: number; x1?: number; t: number; o?: number }> = ({ y = GROUND_Y + 2, x0 = -200, x1 = 2120, t, o = 1 }) => (
  <g opacity={o}>
    <rect x={x0} y={y - 10} width={x1 - x0} height={26} fill="#FFD36A" opacity={0.25} style={{ filter: 'blur(8px)' }} />
    <rect x={x0} y={y - 3} width={x1 - x0} height={7} rx={3.5} fill="#FFE08A" />
    <rect x={x0} y={y - 3} width={x1 - x0} height={7} rx={3.5} fill="#fff" opacity={0.3 + 0.2 * Math.sin(t / 7)} />
  </g>
);

/** Morning in a hill village: id must be unique per shot. */
export const VillageBg: React.FC<{ id: string; t: number; sunX?: number }> = ({ id, t, sunX = 1420 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6FA9D6" />
        <stop offset="62%" stopColor="#F4D49A" />
        <stop offset="100%" stopColor="#F7B873" />
      </linearGradient>
      <linearGradient id={`${id}gr`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7DA55A" />
        <stop offset="100%" stopColor="#4F7A44" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={1100} fill={`url(#${id}sky)`} />
    <Sun x={sunX} y={470} r={86} t={t} />
    <path d="M -400 640 Q 100 470 560 590 Q 900 470 1300 600 Q 1700 480 2320 620 V 820 H -400 Z" fill="#8FB08C" opacity={0.85} />
    <Haze y={560} h={200} o={0.4} />
    <path d="M -400 720 Q 200 600 640 700 Q 1100 610 1500 700 Q 1900 620 2320 710 V 840 H -400 Z" fill="#5F8C62" />
    {[260, 700, 1120, 1760].map((x, i) => (
      <g key={i} transform={`translate(${x} 720) scale(${0.8 + (i % 2) * 0.25})`}>
        <rect x={-6} y={-70} width={12} height={70} fill="#6A4A32" />
        <ellipse cx={0} cy={-100} rx={52} ry={46} fill="#3E7040" />
        <ellipse cx={-14} cy={-112} rx={26} ry={20} fill="#5E9A4E" opacity={0.7} />
      </g>
    ))}
    <rect x={-400} y={GROUND_Y - 30} width={2720} height={500} fill={`url(#${id}gr)`} />
    <path d={`M -400 ${GROUND_Y + 40} H 2320 V 1200 H -400 Z`} fill="#C9A06A" />
    <path d={`M -400 ${GROUND_Y + 40} H 2320`} stroke="#A07A48" strokeWidth={4} />
    {Array.from({ length: 14 }).map((_, i) => (
      <ellipse key={i} cx={-200 + rnd(7, i) * 2400} cy={GROUND_Y + 80 + rnd(8, i) * 160} rx={30 + rnd(9, i) * 40} ry={5} fill="#B08A56" opacity={0.6} />
    ))}
    <Dust t={t} seed={5} x0={0} y0={300} w={1900} h={500} n={22} o={0.5} />
  </g>
);

/** The village clinic: a small whitewashed house with a green cross sign, a lit open door and a bench. x = door centre. */
export const Clinic: React.FC<{ x: number; t: number; open?: number }> = ({ x, t, open = 1 }) => {
  const o = easeOut(clamp(open));
  return (
    <g transform={`translate(${x} ${GROUND_Y})`}>
      <ellipse cx={0} cy={6} rx={430} ry={22} fill="#000" opacity={0.28} />
      <rect x={-380} y={-300} width={760} height={300} fill="#F2E8D2" stroke="#B9AA88" strokeWidth={4} />
      <path d="M -420 -300 L 0 -420 L 420 -300 Z" fill="#B5523B" stroke="#7E3626" strokeWidth={5} />
      <rect x={-380} y={-40} width={760} height={40} fill="#D9CBA8" />
      {/* the door, open on warm light */}
      <rect x={-84} y={-230} width={168} height={230} fill="#FFE2A0" stroke="#7A5239" strokeWidth={8} />
      <Glow x={0} y={-120} r={260} o={0.55 * o} />
      <path d={`M -84 -230 L ${-84 - 70 * o} -214 L ${-84 - 70 * o} 6 L -84 0 Z`} fill="#7A5239" stroke="#4E3322" strokeWidth={4} />
      {/* windows with curtains */}
      {[-250, 250].map((wx) => (
        <g key={wx}>
          <rect x={wx - 62} y={-210} width={124} height={110} fill="#BDE3F2" stroke="#7A5239" strokeWidth={7} />
          <path d={`M ${wx} -210 V -100 M ${wx - 62} -155 H ${wx + 62}`} stroke="#7A5239" strokeWidth={5} />
          <path d={`M ${wx - 62} -210 q 14 50 0 110 h 24 q -8 -60 8 -110 Z`} fill="#F08FA6" opacity={0.85} />
        </g>
      ))}
      {/* the sign: a green cross on a white board */}
      <g transform={`translate(0 -330) rotate(${Math.sin(t / 22) * 1.2})`}>
        <rect x={-96} y={-52} width={192} height={104} rx={14} fill="#FFFFFF" stroke="#2F6E4A" strokeWidth={6} />
        <path d="M -16 -34 H 16 V -12 H 38 V 12 H 16 V 34 H -16 V 12 H -38 V -12 H -16 Z" fill="#2FBF71" />
      </g>
      {/* bench */}
      <g transform="translate(-300 0)">
        <rect x={-80} y={-60} width={160} height={14} rx={5} fill="#9A6A48" stroke="#4E3322" strokeWidth={3} />
        <path d="M -66 -46 V 0 M 66 -46 V 0" stroke="#4E3322" strokeWidth={9} />
      </g>
    </g>
  );
};

/** A low family table with a cloth, from the front. x = centre, y = table top; `w` = width. Draw it AFTER the people. */
export const FamilyTable: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 980 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 + 14} y={0} width={w - 28} height={300} fill="#C8553D" stroke="#7E3626" strokeWidth={4} />
    <path d={`M ${-w / 2 + 14} 60 H ${w / 2 - 14} M ${-w / 2 + 14} 120 H ${w / 2 - 14}`} stroke="#E9B6A0" strokeWidth={6} strokeDasharray="30 18" opacity={0.6} />
    <rect x={-w / 2} y={-16} width={w} height={34} rx={10} fill="#E26A4E" stroke="#7E3626" strokeWidth={4} />
    <rect x={-w / 2} y={-16} width={w} height={9} rx={4} fill="#fff" opacity={0.25} />
  </g>
);

/** A bare one-room hut interior: plank walls, a window onto the evening, a floor mat, a rafter with a cord. `lit` 0..1. */
export const HutRoom: React.FC<{ id: string; t: number; lit: number; bulbX?: number; children?: React.ReactNode }> = ({ id, lit, bulbX = 960, children }) => {
  const dark = 0.84 * (1 - lit);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}pool`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#05060F" stopOpacity={0} />
          <stop offset="55%" stopColor="#05060F" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#05060F" stopOpacity={0.72} />
        </radialGradient>
      </defs>
      <rect x={-400} y={-300} width={2720} height={1100} fill="#6E4C34" />
      {Array.from({ length: 24 }).map((_, i) => (
        <g key={i}>
          <rect x={-400 + i * 120} y={-300} width={118} height={1100} fill={i % 2 ? '#7A5539' : '#6A4932'} />
          <path d={`M ${-340 + i * 120} ${-100 + rnd(3, i) * 600} v 120`} stroke="#4E3322" strokeWidth={3} opacity={0.5} />
        </g>
      ))}
      <rect x={-400} y={GROUND_Y - 40} width={2720} height={500} fill="#4A3524" />
      <rect x={560} y={GROUND_Y + 30} width={800} height={230} rx={10} fill="#C9A66A" stroke="#8A6A3A" strokeWidth={4} />
      <path d="M 580 840 H 1340 M 580 900 H 1340 M 580 960 H 1340" stroke="#A8864A" strokeWidth={4} />
      {/* a shelf with pots, a hanging conical hat, a water jug: a poor but lived-in room */}
      <rect x={1440} y={420} width={340} height={16} fill="#3A2616" />
      <path d="M 1480 436 V 470 M 1740 436 V 470" stroke="#3A2616" strokeWidth={8} />
      <path d="M 1490 420 q -6 -50 30 -56 q 36 6 30 56 Z" fill="#B5523B" stroke="#4E3322" strokeWidth={4} />
      <path d="M 1620 420 v -70 h 60 v 70 Z" fill="#C9A66A" stroke="#4E3322" strokeWidth={4} />
      <path d="M 1700 420 q -4 -34 24 -40 q 28 6 24 40 Z" fill="#7E9A6A" stroke="#4E3322" strokeWidth={4} />
      <g transform="translate(1220 340)"><ellipse cx={0} cy={44} rx={70} ry={14} fill="#C9A85A" stroke="#7A5E22" strokeWidth={4} /><path d="M -62 42 L 0 -40 L 62 42 Q 0 58 -62 42 Z" fill="#E3C57A" stroke="#7A5E22" strokeWidth={4} /></g>
      <path d="M 1220 290 V 300" stroke="#3A2616" strokeWidth={8} />
      <g transform={`translate(1560 ${GROUND_Y + 40})`}>
        <ellipse cx={0} cy={6} rx={70} ry={12} fill="#000" opacity={0.3} />
        <path d="M -30 0 Q -66 -50 -34 -110 L -20 -140 H 20 L 34 -110 Q 66 -50 30 0 Z" fill="#A8603E" stroke="#4E3322" strokeWidth={5} />
        <rect x={-26} y={-150} width={52} height={16} rx={6} fill="#8A4E30" stroke="#4E3322" strokeWidth={4} />
      </g>
      {/* a window onto the dusk, and a rafter */}
      <rect x={200} y={200} width={230} height={260} fill="#3E5A88" stroke="#3A2616" strokeWidth={14} />
      <path d="M 315 200 V 460 M 200 330 H 430" stroke="#3A2616" strokeWidth={9} />
      <rect x={-400} y={-30} width={2720} height={44} fill="#3A2616" />
      <path d={`M ${bulbX} 14 V 250`} stroke="#2A1C14" strokeWidth={5} />
      {children}
      <rect x={-400} y={-300} width={2720} height={1600} fill="#05060F" opacity={dark} />
      <rect x={-400} y={-300} width={2720} height={1600} fill={`url(#${id}pool)`} opacity={0.35 + 0.65 * lit} />
    </g>
  );
};

/** A hanging bulb (the real thing): cord, fitting, glass; `on` 0..1 lights the filament and the glow. */
export const HangingBulb: React.FC<{ x: number; y: number; on: number; t: number; s?: number }> = ({ x, y, on, t, s = 1 }) => {
  const sw = Math.sin(t / 16) * 2.2 * on;
  return (
    <g transform={`translate(${x} ${y}) rotate(${sw} 0 -${y})`}>
      {on > 0 ? <Glow x={0} y={60 * s} r={520 * s} o={0.95 * on} /> : null}
      <rect x={-14 * s} y={0} width={28 * s} height={36 * s} rx={5} fill="#3A3A44" stroke="#14121C" strokeWidth={3} />
      <path d={`M ${-30 * s} ${36 * s} Q ${-52 * s} ${100 * s} 0 ${112 * s} Q ${52 * s} ${100 * s} ${30 * s} ${36 * s} Z`} fill={on > 0.05 ? '#FFF1B8' : '#6A6F7C'} opacity={on > 0.05 ? 1 : 0.55} stroke="#14121C" strokeWidth={3} />
      <path d={`M ${-12 * s} ${40 * s} q ${6 * s} ${34 * s} 0 ${46 * s} q ${12 * s} ${-14 * s} ${24 * s} 0 q ${-6 * s} ${-12 * s} 0 ${-46 * s}`} stroke={on > 0.05 ? '#FF9A2E' : '#2A2A32'} strokeWidth={4} fill="none" />
    </g>
  );
};
