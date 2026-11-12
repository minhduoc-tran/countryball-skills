import React from 'react';
import { LOOKS, Look, Pose, joints, toWorld, rnd, FONT, Sun, Haze } from '../../engine';

// Chapter B props (5/5): the "mind" beat. The sugarcane farmer (one look, one conical hat, so he is the same man in
// every panel), the cane field, a head silhouette, a coin, a crossed-out "Zzz". Pure functions of the counters given.

export const FARMER: Look = { ...LOOKS.mo, jacket: '#9B7B4B', jacketShade: '#7C6238', accent: '#D8C58A', extra: undefined, hair: '#2A1C18' };

/** The farmer's conical hat, sitting on the head of `pose` (draw it right after the Hero). */
export const FarmerHat: React.FC<{ pose: Pose }> = ({ pose }) => {
  const h = toWorld(pose, joints(pose).head);
  const s = pose.scale;
  return (
    <g transform={`translate(${h.x} ${h.y - 40 * s}) rotate(${pose.tilt + pose.headTilt}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={112} ry={22} fill="#C9A85A" stroke="#7A5E22" strokeWidth={4} />
      <path d="M -92 2 L 0 -92 L 92 2 Q 0 24 -92 2 Z" fill="#E3C57A" stroke="#7A5E22" strokeWidth={4} strokeLinejoin="round" />
      <path d="M -50 -4 L 0 -92 M 0 -92 L 52 -4 M -22 8 L 0 -92" stroke="#B8964A" strokeWidth={3} opacity={0.7} />
      <path d="M -78 6 Q 0 28 78 6" stroke="#B5523B" strokeWidth={7} fill="none" />
    </g>
  );
};

type Pal = { sky0: string; sky1: string; stalk: string; leaf: string; far: string; sun: string };
const PALS: Record<'dry' | 'gold', Pal> = {
  dry: { sky0: '#A9B7BF', sky1: '#E4D7B4', stalk: '#7F8C4A', leaf: '#97A15A', far: '#6F7C4E', sun: '#F3E3B0' },
  gold: { sky0: '#FF9E5E', sky1: '#FFE3A2', stalk: '#98AE3E', leaf: '#B4C04C', far: '#7F9A3C', sun: '#FFF0B8' },
};

/** A sugarcane field: sky, low sun, three rows of tall stalks with swaying leaves, a dirt path at y 800. */
export const CaneField: React.FC<{ id: string; t: number; mood?: 'dry' | 'gold' }> = ({ id, t, mood = 'dry' }) => {
  const P = PALS[mood];
  const row = (seed: number, base: number, hMin: number, hVar: number, step: number, col: string, leafCol: string, sway: number) =>
    Array.from({ length: Math.ceil(2800 / step) }).map((_, i) => {
      const x = -300 + i * step + rnd(seed, i) * step * 0.8;
      const h = hMin + rnd(seed + 1, i) * hVar;
      const sw = Math.sin(t / 22 + i * 0.9) * sway;
      const top = base - h;
      return (
        <g key={`${seed}${i}`}>
          <path d={`M ${x} ${base} L ${x + sw * 0.4} ${top}`} stroke={col} strokeWidth={step * 0.28} strokeLinecap="round" />
          {[0.25, 0.5, 0.75].map((k) => <path key={k} d={`M ${x - step * 0.14 + sw * 0.4 * k} ${base - h * k} h ${step * 0.28}`} stroke="#00000033" strokeWidth={2} />)}
          <path d={`M ${x + sw * 0.4} ${top} q ${-step * 2.2} ${-20 + sw} ${-step * 2.6} ${step * 1.4}`} stroke={leafCol} strokeWidth={step * 0.2} fill="none" strokeLinecap="round" />
          <path d={`M ${x + sw * 0.4} ${top} q ${step * 2.2} ${-26 - sw} ${step * 2.8} ${step * 1.6}`} stroke={leafCol} strokeWidth={step * 0.2} fill="none" strokeLinecap="round" />
          <path d={`M ${x + sw * 0.4} ${top + 30} q ${step * 1.6} ${-10} ${step * 2} ${step * 1.2}`} stroke={leafCol} strokeWidth={step * 0.16} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      );
    });
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.sky0} />
          <stop offset="75%" stopColor={P.sky1} />
        </linearGradient>
        <linearGradient id={`${id}gr`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A6B45" />
          <stop offset="100%" stopColor="#5E4630" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-300} width={2720} height={1100} fill={`url(#${id}sky)`} />
      <Sun x={mood === 'gold' ? 1450 : 1500} y={mood === 'gold' ? 480 : 420} r={mood === 'gold' ? 90 : 70} t={t} rays={mood === 'gold'} />
      <rect x={-400} y={520} width={2720} height={300} fill={P.far} opacity={0.55} />
      {row(11, 660, 150, 90, 40, P.far, P.far, 3)}
      <Haze y={560} h={220} o={0.35} />
      {row(21, 760, 300, 120, 48, P.stalk, P.leaf, 5)}
      <rect x={-400} y={770} width={2720} height={500} fill={`url(#${id}gr)`} />
      <path d="M -400 840 H 2320" stroke="#4A3524" strokeWidth={4} opacity={0.5} />
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse key={i} cx={-200 + rnd(5, i) * 2400} cy={880 + rnd(6, i) * 140} rx={40 + rnd(7, i) * 50} ry={6} fill="#4A3524" opacity={0.4} />
      ))}
    </g>
  );
};

/** A head in profile facing right, ~430 x 520 centred on the middle of the skull (x 0, y 0). */
export const HEAD_D =
  'M -170 270 L -150 160 C -196 130 -206 20 -196 -60 C -174 -190 -60 -250 40 -244 C 140 -234 200 -150 190 -60 C 188 -34 202 -12 216 8 C 226 22 214 34 196 40 C 206 62 190 76 176 82 C 184 102 170 122 140 128 L 136 154 C 136 184 160 204 190 224 L 214 270 Z';

export const HeadProfile: React.FC<{ x: number; y: number; s?: number; fill?: string; stroke?: string; clipId?: string; children?: React.ReactNode }> = ({ x, y, s = 1, fill = '#E8B995', stroke = '#1D2033', clipId, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {clipId ? <clipPath id={clipId}><path d={HEAD_D} /></clipPath> : null}
    <path d={HEAD_D} fill={fill} stroke={stroke} strokeWidth={8} strokeLinejoin="round" />
    {clipId ? <g clipPath={`url(#${clipId})`}>{children}</g> : children}
    <path d={HEAD_D} fill="none" stroke={stroke} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={120} cy={-34} r={9} fill={stroke} />
  </g>
);

/** A gold coin with the dong sign, r 40 at s 1. */
export const CoinDisc: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number }> = ({ x, y, s = 1, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <circle r={40} fill="#E8B83E" stroke="#7A5A12" strokeWidth={5} />
    <circle r={30} fill="none" stroke="#FFE08A" strokeWidth={3} />
    <circle r={9} fill="#7A5A12" opacity={0.55} />
    <path d="M -22 -22 L 22 22 M 22 -22 L -22 22" stroke="#FFE08A" strokeWidth={0} />
  </g>
);

/** "Zzz" crossed out by a red no-sign: sleep that does not come. */
export const ZzzNo: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => (
      <text key={i} x={i * 62} y={-i * 62 + Math.sin(t / 6 + i) * 4} fontFamily={FONT.title} fontWeight={800} fontSize={90 + i * 26} fill="#DDE8FF" stroke="#1D2033" strokeWidth={5} paintOrder="stroke">
        Z
      </text>
    ))}
    <circle cx={86} cy={-70} r={150} fill="none" stroke="#FF5A4A" strokeWidth={16} />
    <path d="M -22 -178 L 194 38" stroke="#FF5A4A" strokeWidth={16} strokeLinecap="round" />
  </g>
);

/** A small label pill (top-left of a panel): "TRƯỚC THU HOẠCH". */
export const TagPill: React.FC<{ x: number; y: number; text: string; color?: string }> = ({ x, y, text, color = '#BFD0E6' }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={-44} width={text.length * 27 + 56} height={80} rx={40} fill="#0B0816" opacity={0.72} />
    <text x={28} y={14} fontFamily={FONT.ui} fontWeight={700} fontSize={42} fill={color} letterSpacing={2}>{text}</text>
  </g>
);
