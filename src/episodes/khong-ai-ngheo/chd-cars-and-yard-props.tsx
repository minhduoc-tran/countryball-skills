import React from 'react';
import { clamp, backOut, easeOut, FONT, Skyline, Glow } from '../../engine';

// Chapter D, "the neighbour": shiny cars (side view, facing right), a villa, a picket fence and a dusk
// neighbourhood backdrop; all flat fills with a dark outline, pure functions of their props.

const INK = '#1D2033';

/** A shiny sedan, 364 wide at s 1; (x, y) = ground below the middle. `shine` 0..1 sweeps a glint across the body. */
export const Car: React.FC<{ x: number; y: number; s?: number; c?: string; shine?: number; flip?: boolean; id: string }> = ({ x, y, s = 1, c = '#E9B12E', shine = 0, flip = false, id }) => {
  const body = 'M -180 0 L -176 -34 Q -170 -48 -140 -52 L -96 -58 Q -70 -96 -20 -100 L 60 -100 Q 100 -98 124 -60 L 160 -52 Q 182 -46 182 -20 L 180 0 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <defs><clipPath id={`${id}car`}><path d={body} /></clipPath></defs>
      <ellipse cx={0} cy={4} rx={210} ry={14} fill="#000" opacity={0.35} />
      <path d={body} fill={c} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -80 -60 Q -62 -90 -20 -92 L 22 -92 L 22 -60 Z M 36 -92 L 62 -92 Q 92 -90 108 -62 L 36 -62 Z" fill="#BFE6F7" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -176 -30 H 176" stroke="#000" strokeOpacity={0.18} strokeWidth={4} />
      <rect x={166} y={-44} width={18} height={12} rx={5} fill="#FFF3B0" stroke={INK} strokeWidth={3} />
      <rect x={-184} y={-40} width={12} height={12} rx={4} fill="#D9302E" stroke={INK} strokeWidth={3} />
      <g clipPath={`url(#${id}car)`}>
        <path d="M -40 -120 L 0 -120 L -50 20 L -90 20 Z" fill="#fff" opacity={0.55} transform={`translate(${-250 + 520 * easeOut(clamp(shine))} 0)`} />
        <path d="M -170 -96 Q 0 -112 150 -80" stroke="#fff" strokeOpacity={0.4} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
      {[-112, 112].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={-4} r={36} fill="#23222B" stroke={INK} strokeWidth={5} />
          <circle cx={wx} cy={-4} r={16} fill="#C9CCD6" stroke={INK} strokeWidth={3} />
        </g>
      ))}
    </g>
  );
};

/** A car that pops in (a scale overshoot + a glint + a ring) at its own time; `t` is the shot clock, `at` the frame it lands. */
export const PopCar: React.FC<{ x: number; y: number; s?: number; c: string; t: number; at: number; id: string; flip?: boolean }> = ({ x, y, s = 1, c, t, at, id, flip }) => {
  const q = t - at;
  if (q < 0) return null;
  const k = backOut(clamp(q / 7));
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
        <Car x={x} y={y} s={s} c={c} shine={(q - 3) / 20} id={id} flip={flip} />
      </g>
      {q < 12 ? <ellipse cx={x} cy={y - 30 * s} rx={(120 + q * 22) * s} ry={(50 + q * 8) * s} fill="none" stroke="#FFF3B0" strokeWidth={5} opacity={1 - q / 12} /> : null}
    </g>
  );
};

/** A two-storey villa with a garage on the right; (x, y) = ground at the left corner, ~700 wide at s 1. */
export const Villa: React.FC<{ x: number; y: number; s?: number; wall?: string; roof?: string }> = ({ x, y, s = 1, wall = '#EAD9B8', roof = '#B5523B' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={0} y={-340} width={420} height={340} fill={wall} stroke={INK} strokeWidth={5} />
    <rect x={420} y={-210} width={280} height={210} fill={wall} stroke={INK} strokeWidth={5} />
    <path d="M -30 -340 L 210 -470 L 450 -340 Z" fill={roof} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 410 -210 L 560 -280 L 710 -210 Z" fill={roof} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[[70, -280], [270, -280], [70, -140], [270, -140]].map(([wx, wy], i) => (
      <g key={i}>
        <rect x={wx} y={wy} width={80} height={90} fill="#FFE9A8" stroke={INK} strokeWidth={4} />
        <path d={`M ${wx + 40} ${wy} V ${wy + 90} M ${wx} ${wy + 45} H ${wx + 80}`} stroke={INK} strokeWidth={3} />
      </g>
    ))}
    <rect x={180} y={-130} width={60} height={130} fill="#7A5A3C" stroke={INK} strokeWidth={4} />
    <rect x={460} y={-170} width={200} height={170} fill="#D9D4C8" stroke={INK} strokeWidth={4} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M 460 ${-150 + i * 32} H 660`} stroke="#B4AE9E" strokeWidth={3} />)}
  </g>
);

/** A picket fence from x0 to x1 with its top rail at y; pickets 90 tall. */
export const Fence: React.FC<{ x0: number; x1: number; y: number; h?: number }> = ({ x0, x1, y, h = 150 }) => {
  const n = Math.ceil((x1 - x0) / 46);
  return (
    <g>
      <rect x={x0} y={y + 14} width={x1 - x0} height={h - 14} fill="#CDB994" />
      {Array.from({ length: n }).map((_, i) => (
        <path key={i} d={`M ${x0 + i * 46} ${y + h} V ${y + 14} L ${x0 + i * 46 + 18} ${y} L ${x0 + i * 46 + 36} ${y + 14} V ${y + h} Z`} fill="#F1E8D6" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      ))}
      <rect x={x0} y={y + 36} width={x1 - x0} height={14} fill="#D9CBAE" stroke={INK} strokeWidth={3} />
      <rect x={x0} y={y + h - 40} width={x1 - x0} height={14} fill="#D9CBAE" stroke={INK} strokeWidth={3} />
    </g>
  );
};

/** The dusk sky, a far skyline, a warm sun glow and a green verge with a driveway band at `ground`. */
export const NeighbourBackdrop: React.FC<{ id: string; ground: number; t: number }> = ({ id, ground, t }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6E5A9E" />
        <stop offset="55%" stopColor="#F2A86E" />
        <stop offset="100%" stopColor="#FFD79A" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={ground + 300} fill={`url(#${id}sky)`} />
    <Glow x={1500} y={ground - 260} r={800} o={0.5} />
    <Skyline y={ground - 40} seed={31} color="#6A4F86" h={170} />
    <rect x={-400} y={ground - 40} width={2720} height={1400} fill="#6FA860" />
    <rect x={-400} y={ground + 40} width={2720} height={1400} fill="#8C8A94" />
    <rect x={-400} y={ground + 36} width={2720} height={10} fill="#B9B6C0" />
    {[-60, 620, 1010, 1800].map((tx, i) => (
      <g key={`tr${i}`} transform={`translate(${tx} ${ground - 30})`}>
        <rect x={-9} y={-110} width={18} height={110} fill="#6A4A32" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={-170} r={78 - (i % 2) * 14} fill="#3E8C4E" stroke={INK} strokeWidth={5} />
        <circle cx={-26} cy={-190} r={30} fill="#56A862" opacity={0.7} />
      </g>
    ))}
    {Array.from({ length: 14 }).map((_, i) => <rect key={`rd${i}`} x={-300 + i * 200} y={ground + 150} width={110} height={10} rx={5} fill="#E9E4D0" opacity={0.8} />)}
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={(t * (0.3 + i * 0.12) + i * 800) % 2800 - 300} cy={140 + i * 70} rx={200} ry={34} fill="#fff" opacity={0.25} />
    ))}
  </g>
);

/** A little grey rain cloud that follows a sad head, with a few drops. */
export const SadCloud: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`translate(0 ${Math.sin(t / 7) * 5})`}>
      <path d="M -90 20 Q -120 20 -118 -10 Q -116 -40 -80 -38 Q -70 -76 -28 -72 Q 10 -100 44 -66 Q 96 -70 100 -24 Q 130 -10 104 20 Z" fill="#8F93A8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {[-50, -10, 30, 70].map((dx, i) => {
        const ph = ((t * 0.07 + i * 0.27) % 1);
        return <path key={i} d={`M ${dx} ${34 + ph * 90} v 22`} stroke="#6FB3F2" strokeWidth={6} strokeLinecap="round" opacity={1 - ph} />;
      })}
    </g>
  </g>
);

/** A big count tag ("3", "4") in the mono face with a dark pill. */
export const CountTag: React.FC<{ x: number; y: number; n: string; t: number }> = ({ x, y, n, t }) => (
  t < 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${backOut(clamp(t / 7))})`}>
      <rect x={-150} y={-90} width={300} height={170} rx={50} fill="#0B1226" opacity={0.8} stroke="#FFE27A" strokeWidth={6} />
      <text y={46} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FFE27A" stroke="#1A1230" strokeWidth={8} paintOrder="stroke">{n}</text>
    </g>
  )
);
