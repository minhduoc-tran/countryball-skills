import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Dust, Kitchen, KitchenIsland, KITCHEN, islandTop, stand, ShotProps,
} from '../../engine';

// Chapter A, the kitchen: breakfast still on the island (a bowl of phở, a bánh mì, chopsticks), the kettle still warm,
// and the empty apron on a chair where Mum should be. Everything here is drawn for this chapter in the engine's style.

const PIP = LOOKS.pipHood;
const RIM = '#FFB46A';

/** Rising steam: `n` wisps from (x, y), each a soft S-curve that lifts and fades on its own 44-frame loop. */
export const Steam: React.FC<{ x: number; y: number; t: number; n?: number; s?: number; o?: number }> = ({ x, y, t, n = 3, s = 1, o = 0.55 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" stroke="#F4EEE2">
    {Array.from({ length: n }).map((_, i) => {
      const p = ((t + i * (44 / n)) % 44) / 44;
      const dx = (i - (n - 1) / 2) * 22 + Math.sin(p * 6 + i) * 8;
      const y0 = -p * 110;
      return (
        <path key={i} d={`M ${dx} ${y0} q 12 -16 0 -30 q -12 -16 0 -30`} strokeWidth={7 - p * 3} opacity={o * Math.sin(Math.PI * p)} />
      );
    })}
  </g>
);

/** A bowl of phở seen from slightly above: broth, noodles, beef slices, herbs, chopsticks across the rim. */
export const PhoBowl: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={6} cy={4} rx={118} ry={18} fill="#000" opacity={0.4} />
    <path d="M -108 -58 Q -104 6 -52 6 L 52 6 Q 104 6 108 -58 Z" fill="#E6DCC6" />
    <path d="M 20 6 L 52 6 Q 104 6 108 -58 L 84 -58 Q 76 -8 20 0 Z" fill="#BFB398" />
    <path d="M -100 -40 Q -96 0 -54 2" stroke="#2F6E8A" strokeWidth={5} fill="none" opacity={0.7} />
    <ellipse cx={0} cy={-58} rx={110} ry={30} fill="#F1E9D6" />
    <ellipse cx={0} cy={-56} rx={96} ry={24} fill="#C98A4A" />
    <ellipse cx={0} cy={-55} rx={86} ry={20} fill="#E0B070" opacity={0.7} />
    {[[-40, -60], [10, -52], [48, -62], [-8, -68]].map(([dx, dy], i) => <path key={i} d={`M ${dx - 26} ${dy} q 26 -12 52 0`} stroke="#F4ECDB" strokeWidth={5} fill="none" strokeLinecap="round" />)}
    {[[-34, -52], [30, -50]].map(([dx, dy], i) => <ellipse key={i} cx={dx} cy={dy} rx={24} ry={7} fill="#B9705A" transform={`rotate(${i ? 8 : -10} ${dx} ${dy})`} />)}
    {[[-58, -62, 0], [56, -56, 1], [4, -74, 2], [-14, -58, 3]].map(([dx, dy, k]) => <ellipse key={k} cx={dx} cy={dy} rx={11} ry={5} fill="#4E7E4A" transform={`rotate(${k * 40 - 30} ${dx} ${dy})`} />)}
    <circle cx={64} cy={-62} r={4} fill="#D9482E" />
    <circle cx={-66} cy={-56} r={3.5} fill="#D9482E" />
    <path d="M -80 -62 Q 0 -78 90 -50" stroke={RIM} strokeWidth={3} fill="none" opacity={0.6} />
    <path d="M -50 -100 L 130 -34" stroke="#C98A4A" strokeWidth={7} strokeLinecap="round" />
    <path d="M -34 -106 L 144 -42" stroke="#A8703A" strokeWidth={7} strokeLinecap="round" />
    <Steam x={0} y={-76} t={t} n={3} s={1.2} />
  </g>
);

/** A bánh mì: a golden baguette with diagonal slashes, on a small plate. */
export const BanhMi: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={2} rx={112} ry={14} fill="#000" opacity={0.35} />
    <ellipse cx={0} cy={-2} rx={104} ry={14} fill="#E9E2D2" />
    <path d="M -86 -12 Q -92 -52 -50 -56 L 56 -58 Q 98 -56 94 -20 Q 90 -6 60 -8 L -60 -6 Q -82 -4 -86 -12 Z" fill="#D69A4A" />
    <path d="M -60 -6 L 60 -8 Q 90 -6 94 -20 Q 88 -4 60 0 L -60 0 Q -82 0 -86 -12 Q -80 -4 -60 -6 Z" fill="#A86C2E" />
    {[-52, -22, 8, 38].map((dx) => <path key={dx} d={`M ${dx} -52 L ${dx + 14} -20`} stroke="#F2C27A" strokeWidth={6} strokeLinecap="round" />)}
    <path d="M -76 -34 Q -60 -52 -30 -54" stroke="#FFE0A0" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M -72 -10 Q 0 -2 80 -12" stroke="#7A4A22" strokeWidth={2.5} fill="none" opacity={0.5} />
  </g>
);

// ---------- A17: the kitchen, the camera pushing in to the island: breakfast waiting, steam still rising ----------
export const A17: React.FC<ShotProps> = ({ t, len }) => {
  const bowl = islandTop(0.46, 0.5);
  const bread = islandTop(0.6, 0.55);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 940]]), kf(t, [[0, 560], [len, 610]]), kf(t, [[0, 1.0], [len, 1.85]]))}>
      <Kitchen t={t + 20} id="kb17" />
      <KitchenIsland />
      <PhoBowl x={bowl.x} y={bowl.y + 10} s={0.62} t={t} />
      <BanhMi x={bread.x + 6} y={bread.y + 10} s={0.5} />
      {/* a folded napkin and a second pair of chopsticks, laid for one */}
      <rect x={islandTop(0.34, 0.6).x} y={islandTop(0.34, 0.6).y - 6} width={46} height={10} rx={3} fill="#E9DCC8" transform="rotate(-8 700 700)" />
      <Glow x={bowl.x} y={bowl.y - 60} r={200} o={0.35} />
    </g>
  );
};

// ---------- A18: insert, the kettle on the hob, a thin curl of steam from the spout: it is still warm ----------
export const A18: React.FC<ShotProps> = ({ t, len }) => {
  const sx = 1010;
  const sy = 470;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-720 -520) scale(2.1)">
          <Kitchen t={t + 90} id="kb18" />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0C0A12" opacity={0.3} />
      <Glow x={700} y={420} r={640} o={0.45} />
      {/* the hob ring and the kettle: steel body, dark base, a lit left edge, a bakelite handle */}
      <ellipse cx={900} cy={880} rx={380} ry={44} fill="#000" opacity={0.4} />
      <ellipse cx={900} cy={860} rx={330} ry={34} fill="#2A2830" />
      <ellipse cx={900} cy={856} rx={250} ry={22} fill="#3A3842" />
      <path d="M 590 850 Q 570 640 720 560 Q 770 450 900 440 Q 1030 450 1080 560 Q 1230 640 1210 850 Q 1100 900 900 900 Q 700 900 590 850 Z" fill="#D8503C" />
      <path d="M 1010 560 Q 1090 450 1010 450 Q 1030 450 1080 560 Q 1230 640 1210 850 Q 1130 890 1000 898 Q 1160 800 1100 640 Q 1070 590 1010 560 Z" fill="#A63A2E" />
      <path d="M 610 800 Q 590 660 720 580 Q 770 480 880 458" stroke="#FFB49A" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.75} />
      <path d="M 600 800 Q 880 840 1200 790" stroke="#2A2830" strokeWidth={10} fill="none" opacity={0.35} />
      <ellipse cx={900} cy={436} rx={74} ry={18} fill="#E26A54" />
      <circle cx={900} cy={408} r={26} fill="#2A2830" />
      <path d="M 880 400 Q 890 392 905 396" stroke="#8A8898" strokeWidth={4} fill="none" />
      {/* the handle arcing over the lid, and the spout to the right */}
      <path d="M 740 560 Q 880 300 1060 540" stroke="#2A2830" strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d="M 748 552 Q 880 316 1050 534" stroke="#6A6876" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M 1130 640 Q 1200 580 1250 500 Q 1290 470 1300 480 Q 1290 540 1230 640 Z" fill="#D8503C" />
      <path d="M 1190 616 Q 1250 540 1296 484" stroke="#A63A2E" strokeWidth={8} fill="none" />
      {/* a single thin curl of steam from the spout */}
      <path d={`M ${sx + 290} ${sy} q ${14 + Math.sin(t / 8) * 10} -50 0 -90 q ${-16 + Math.sin(t / 7) * 10} -50 8 -100 q 18 -50 ${Math.sin(t / 9) * 12} -100`} stroke="#F4EEE2" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.55} />
      <Steam x={sx + 290} y={sy - 10} t={t + 10} n={2} s={1.6} o={0.35} />
      <Dust t={t} seed={83} x0={300} y0={150} w={1300} h={700} n={20} o={0.35} />
    </g>
  );
};

// ---------- A19: wide, an apron hung on a chair and nobody in it; Pip small at the edge of the kitchen, looking ----------
export const A19: React.FC<ShotProps> = ({ t, len }) => {
  const pip = stand(KITCHEN, 0.84, 0.34);
  const chair = KITCHEN.P(0.17, 1, 0.64);
  const k = KITCHEN.s(0.64) / KITCHEN.s(0.5);
  const sway = Math.sin(t / 14) * 1.6;
  const pose = poseAt(t, [
    { f: 0, p: { x: pip.x, y: pip.y, scale: pip.scale, yaw: -0.5, look: -0.8, armL: { a: 8, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 16, p: { headTilt: -3, look: -0.9 }, ease: easeOut },
    { f: 36, p: { headTilt: 2, yaw: -0.35 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 850]]), kf(t, [[0, 580], [len, 640]]), kf(t, [[0, 1.0], [len, 1.4]]))}>
      <Kitchen t={t + 150} id="kb19" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [18, 'worried']]) }} rimId="rimL" shadow={0} />
      <KitchenIsland />
      {/* the chair: seat, legs, a tall back, and the apron hanging over it, its strings dangling */}
      <g transform={`translate(${chair.x} ${chair.y}) scale(${k})`}>
        <ellipse cx={4} cy={4} rx={80} ry={12} fill="#000" opacity={0.4} />
        <path d="M -52 -100 L -58 0 M 52 -100 L 58 0 M -40 -102 L -44 -4 M 40 -102 L 44 -4" stroke="#5A3E30" strokeWidth={8} strokeLinecap="round" />
        <rect x={-66} y={-120} width={132} height={22} rx={7} fill="#8A5E44" />
        <rect x={-66} y={-120} width={132} height={5} rx={2} fill={RIM} opacity={0.6} />
        <rect x={-58} y={-236} width={14} height={118} fill="#6E4A38" />
        <rect x={44} y={-236} width={14} height={118} fill="#6E4A38" />
        <rect x={-60} y={-246} width={120} height={20} rx={8} fill="#8A5E44" />
        <rect x={-60} y={-246} width={120} height={4} rx={2} fill={RIM} opacity={0.6} />
        <g transform={`rotate(${sway} 0 -246)`}>
          {/* the apron by its neck loop: a narrow bib, a waist, a skirt that flares; ties hang at the sides */}
          <path d="M -22 -246 L 22 -246 L 30 -196 L 62 -190 L 76 -92 Q 0 -78 -76 -92 L -62 -190 L -30 -196 Z" fill="#D98A8A" />
          <path d="M 22 -246 L 30 -196 L 62 -190 L 76 -92 Q 40 -84 20 -84 Z" fill="#B96A6E" />
          <path d="M -62 -190 L -30 -196 L 30 -196 L 62 -190" stroke="#F2C0B8" strokeWidth={4} fill="none" />
          <rect x={-34} y={-160} width={68} height={44} rx={8} fill="#F2D6C8" />
          <path d="M -34 -148 H 34" stroke="#C9A092" strokeWidth={3} />
          <path d="M -24 -246 Q -24 -286 0 -288 Q 24 -286 24 -246" stroke="#B96A6E" strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M 62 -190 Q 96 -170 90 -110" stroke="#B96A6E" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M -62 -190 Q -96 -166 -92 -106" stroke="#B96A6E" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M -70 -100 Q -72 -150 -58 -186" stroke="#FFD9C0" strokeWidth={3} fill="none" opacity={0.6} />
        </g>
      </g>
      <Dust t={t} seed={19} x0={600} y0={350} w={700} h={400} n={16} o={0.45} />
    </g>
  );
};
