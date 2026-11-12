import React from 'react';
import { SCH, DrawOn, FONT, clamp, easeOut, backOut } from '../../engine';
import { INK } from './chc-family-props';

// Chapter C props, the doubts: a worried price tag, country outlines (Kenya, Finland) as plain label shapes, tiny house
// icons, gold coins, a clipboard, and the vi-VN thousands format. All pure functions of the shot clock.

/** 10000 -> "10.000" (Vietnamese thousands dots, no Intl so it is the same everywhere). */
export const vnNum = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** A schematic outline of Kenya (rough, plain, no flag); origin top-left of a 360 x 420 box. */
export const KENYA_PATH = 'M 5 18 L 90 0 L 189 45 L 252 54 L 315 9 L 360 32 L 320 117 L 319 245 L 275 333 L 239 419 L 171 347 L 0 252 L 0 198 L 40 153 L 22 54 Z';
/** A schematic outline of Finland (rough, plain, no flag); origin top-left of a 200 x 410 box. */
export const FINLAND_PATH = 'M 43 408 L 16 364 L 18 284 L 67 172 L 72 144 L 54 84 L 2 42 L 54 4 L 117 4 L 144 44 L 171 164 L 162 244 L 198 284 L 175 344 L 135 384 L 81 396 Z';

export const CountryOutline: React.FC<{ d: string; x: number; y: number; s?: number; t: number; dur?: number; fillO?: number }> = ({ d, x, y, s = 1, t, dur = 16, fillO = 0.18 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={d} fill={SCH.live} opacity={fillO * easeOut(clamp((t - dur) / 10))} />
    <DrawOn d={d} t={t} dur={dur} color={SCH.line} width={6 / s} />
  </g>
);

/** A tiny house, line icon, lit orange when `on` > 0; 70 wide at s = 1, origin its centre. */
export const HouseIcon: React.FC<{ x: number; y: number; s?: number; on?: number }> = ({ x, y, s = 1, on = 0 }) => {
  const c = on > 0 ? SCH.live : SCH.dim;
  const pop = 1 + 0.25 * Math.sin(clamp(on) * Math.PI);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`} stroke={c} strokeWidth={5} fill={on > 0 ? `${SCH.live}33` : 'none'} strokeLinecap="round" strokeLinejoin="round" style={on > 0 ? { filter: `drop-shadow(0 0 8px ${SCH.glow})` } : undefined}>
      <path d="M -32 4 L 0 -28 L 32 4 M -24 0 V 30 H 24 V 0" />
      <path d="M -6 30 V 12 H 8 V 30" strokeWidth={4} />
    </g>
  );
};

/** A gold coin with a dollar sign; r 50 at s = 1; `half` draws a half coin (cut off at the right). */
export const Coin: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; half?: boolean; mark?: string }> = ({ x, y, s = 1, rot = 0, o = 1, half = false, mark = '$' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    {half ? <clipPath id={`halfc${Math.round(x)}${Math.round(y)}`}><rect x={-60} y={-60} width={62} height={120} /></clipPath> : null}
    <g clipPath={half ? `url(#halfc${Math.round(x)}${Math.round(y)})` : undefined}>
      <circle r={50} fill="#F2C14E" stroke="#8A6A1A" strokeWidth={6} />
      <circle r={37} fill="none" stroke="#B8902A" strokeWidth={4} />
      <text y={16} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill="#8A6A1A">{mark}</text>
      <path d="M -34 -22 Q -20 -40 2 -42" stroke="#FFF3C8" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  </g>
);

/** A price tag with a worried face (eyes, brows, a sweat drop) that shakes with fear; 290 x 150 at s = 1, origin centre. */
export const WorriedTag: React.FC<{ x: number; y: number; t: number; s?: number; rot?: number; text?: string; fear?: number }> = ({ x, y, t, s = 1, rot = 0, text = '', fear = 1 }) => {
  const sh = Math.sin(t * 1.9) * 3 * fear;
  return (
    <g transform={`translate(${x + sh} ${y}) rotate(${rot + Math.sin(t * 1.3) * 2 * fear}) scale(${s})`}>
      <path d="M -130 -75 L 110 -75 L 150 0 L 110 75 L -130 75 Z" fill="#F2E6D0" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={-108} cy={0} r={10} fill="#1B1930" stroke={INK} strokeWidth={3} />
      <path d="M -108 -2 Q -150 -70 -190 -120" stroke="#C9B38A" strokeWidth={5} fill="none" />
      {text ? <text x={30} y={-26} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={44} fill={INK}>{text}</text> : null}
      {[-18, 54].map((ex, i) => <g key={i}><circle cx={ex} cy={8} r={14} fill="#fff" stroke={INK} strokeWidth={3} /><circle cx={ex + 3} cy={11} r={6} fill={INK} /></g>)}
      <path d="M -40 -4 L -2 -18 M 76 -4 L 38 -18" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M -6 46 Q 18 34 42 46" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={`M 100 ${-40 + ((t * 2) % 30)} q 8 14 0 22 q -8 -8 0 -22 Z`} fill="#8CD3F0" stroke={INK} strokeWidth={2} />
    </g>
  );
};

/** A clipboard with a small bar chart and a tick: "the economists tried it". Origin centre, 200 x 260 at s = 1. */
export const Clipboard: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const k = backOut(clamp(t / 8));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`} stroke={SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={-100} y={-130} width={200} height={260} rx={14} />
      <rect x={-36} y={-150} width={72} height={34} rx={10} fill={SCH.ground} />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${-56 + i * 44} 70 V ${70 - (30 + i * 28) * easeOut(clamp((t - 8 - i * 3) / 10))}`} stroke={SCH.live} strokeWidth={20} />)}
      <path d="M -56 -70 H 56" strokeWidth={5} opacity={0.6} />
      <path d="M -56 -42 H 24" strokeWidth={5} opacity={0.6} />
      <path d="M 40 20 l 14 16 l 28 -34" stroke={SCH.live} strokeWidth={9} opacity={clamp((t - 26) / 4)} />
    </g>
  );
};

/** A tiny market stall: an awning, a counter, and a sign colour; origin at the ground centre, 300 wide at s = 1. */
export const MiniStall: React.FC<{ x: number; y: number; s?: number; awning: string; goods?: 'veg' | 'cloth' | 'shop' }> = ({ x, y, s = 1, awning, goods = 'shop' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={170} ry={14} fill="#000" opacity={0.25} />
    <path d="M -140 -330 H 140 L 164 -250 H -164 Z" fill={awning} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[-110, -55, 0, 55, 110].map((sx) => <path key={sx} d={`M ${sx - 27} -330 L ${sx - 40} -250`} stroke="#fff" strokeWidth={14} opacity={0.35} />)}
    <path d="M -128 -250 V -100 M 128 -250 V -100" stroke="#7A4E2E" strokeWidth={9} />
    <rect x={-150} y={-104} width={300} height={104} rx={8} fill="#B98557" stroke={INK} strokeWidth={5} />
    <rect x={-150} y={-104} width={300} height={16} rx={6} fill="#D9A46B" />
    {goods === 'veg' ? [-90, -40, 10, 60, 106].map((vx, i) => <circle key={i} cx={vx} cy={-114} r={20} fill={['#E0533F', '#6FB38A', '#F2A33D', '#6FB38A', '#E0533F'][i]} stroke={INK} strokeWidth={3} />) : null}
    {goods === 'cloth' ? [-90, -30, 30, 90].map((vx, i) => <path key={i} d={`M ${vx - 26} -104 q 0 -40 26 -40 q 26 0 26 40 Z`} fill={['#9B5FA8', '#5A7FD0', '#E9654B', '#3E8C86'][i]} stroke={INK} strokeWidth={3} />) : null}
    {goods === 'shop' ? [-90, -30, 30, 90].map((vx, i) => <rect key={i} x={vx - 20} y={-146} width={40} height={42} rx={6} fill={['#F2C14E', '#E0533F', '#5A7FD0', '#6FB38A'][i]} stroke={INK} strokeWidth={3} />) : null}
  </g>
);

/** A point at k (0..1) along the quadratic curve p0 -> p2 bent toward p1: where a coin is mid-hop. */
export const quadAt = (p0: [number, number], p1: [number, number], p2: [number, number], k: number): [number, number] => [
  (1 - k) * (1 - k) * p0[0] + 2 * (1 - k) * k * p1[0] + k * k * p2[0],
  (1 - k) * (1 - k) * p0[1] + 2 * (1 - k) * k * p1[1] + k * k * p2[1],
];
