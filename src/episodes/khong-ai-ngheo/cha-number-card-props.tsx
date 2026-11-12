import React from 'react';
import { clamp, easeOut, backOut, rnd, Glow, SCH, FONT } from '../../engine';

// Chapter A props (4/4): the number cards of the scale beat: a grid of people where the poor are dimmed, a big stat that pops
// with a glow, the open fairy-tale book, a magnifier, a green tick. Pure functions of t.

const mix = (a: string, b: string, k: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = h(a);
  const B = h(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k)).toString(16).padStart(2, '0')).join('');
};

/** One person (head + shoulders), about 40 wide at s = 1, centred on its middle. `dim` 0..1 fades it to the dimmed state; `ring` outlines the dimmed ones. */
export const GridPerson: React.FC<{ x: number; y: number; s?: number; dim?: number; ring?: number; pop?: number }> = ({ x, y, s = 1, dim = 0, ring = 0, pop = 1 }) => {
  const fill = mix('#F6EFE3', '#36476A', dim);
  const line = mix('#F6EFE3', '#8394B4', dim);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`} opacity={clamp(pop * 3) * (1 - 0.12 * dim)}>
      {ring > 0 ? <circle cy={-6} r={36} fill="#FF8A3D" opacity={0.18 * ring} /> : null}
      <circle cx={0} cy={-20} r={12} fill={fill} stroke={ring > 0 && dim > 0.5 ? '#FF8A3D' : line} strokeWidth={ring > 0 && dim > 0.5 ? 3.5 : 3} />
      <path d="M -19 26 Q -20 -4 0 -4 Q 20 -4 19 26 Z" fill={fill} stroke={ring > 0 && dim > 0.5 ? '#FF8A3D' : line} strokeWidth={ring > 0 && dim > 0.5 ? 3.5 : 3} strokeLinejoin="round" />
    </g>
  );
};

/** A cols x rows grid of people in row-major order. `dimOf(i)` gives each person's dim amount, `popAt` staggers the first appearance. */
export const PeopleGrid: React.FC<{ t: number; x0: number; y0: number; dx: number; dy: number; cols: number; rows: number; s?: number; dimOf: (i: number) => number; ring?: number; popStep?: number }> = ({
  t, x0, y0, dx, dy, cols, rows, s = 1, dimOf, ring = 0, popStep = 0.35,
}) => (
  <g>
    {Array.from({ length: cols * rows }).map((_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      return <GridPerson key={i} x={x0 + c * dx} y={y0 + r * dy} s={s} dim={dimOf(i)} ring={ring} pop={backOut(clamp((t - 1 - i * popStep) / 7))} />;
    })}
  </g>
);

/** A big number or word that pops with overshoot at t = 0 and glows. */
export const BigStat: React.FC<{ x: number; y: number; t: number; text: string; size?: number; color?: string; glow?: string }> = ({ x, y, t, text, size = 200, color = SCH.live, glow = SCH.glow }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 9));
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={size} fill={color} stroke="#101A2A" strokeWidth={size / 16} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 ${size / 8}px ${glow})` }}>{text}</text>
    </g>
  );
};

/** A small caption in the mono face that pops in at t = 0. */
export const Cap: React.FC<{ x: number; y: number; t: number; text: string; size?: number; color?: string }> = ({ x, y, t, text, size = 46, color = SCH.dim }) => {
  if (t < 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${backOut(clamp(t / 7))})`}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={color} letterSpacing={4}>{text}</text>
    </g>
  );
};

/** A big green tick in a disc that pops and draws on; r = disc radius. */
export const BigTick: React.FC<{ x: number; y: number; t: number; r?: number }> = ({ x, y, t, r = 150 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 9));
  const p = easeOut(clamp((t - 5) / 9));
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} style={{ filter: 'drop-shadow(0 0 28px rgba(91,224,138,0.6))' }}>
      <circle r={r} fill="#2FBF71" />
      <path d={`M ${-r * 0.42} ${r * 0.02} l ${r * 0.28} ${r * 0.32} l ${r * 0.58} ${-r * 0.7}`} stroke="#E9FFF2" strokeWidth={r * 0.18} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </g>
  );
};

/** A magnifier: draws `children` (the thing under the glass) again, enlarged by `zoom`, inside a lens at (lx, ly). */
export const Magnifier: React.FC<{ id: string; lx: number; ly: number; r?: number; zoom?: number; children: React.ReactNode }> = ({ id, lx, ly, r = 170, zoom = 1.6, children }) => (
  <g>
    <defs><clipPath id={`${id}lens`}><circle cx={lx} cy={ly} r={r} /></clipPath></defs>
    <circle cx={lx} cy={ly} r={r} fill="#101A2A" />
    <g clipPath={`url(#${id}lens)`}><g transform={`translate(${lx} ${ly}) scale(${zoom}) translate(${-lx} ${-ly})`}>{children}</g></g>
    <circle cx={lx} cy={ly} r={r} fill="none" stroke="#E8C98A" strokeWidth={16} />
    <path d={`M ${lx + r * 0.7} ${ly + r * 0.7} L ${lx + r * 1.55} ${ly + r * 1.55}`} stroke="#8A5A32" strokeWidth={34} strokeLinecap="round" />
    <path d={`M ${lx - r * 0.55} ${ly - r * 0.45} Q ${lx - r * 0.4} ${ly - r * 0.7} ${lx - r * 0.1} ${ly - r * 0.78}`} stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.6} />
  </g>
);

/** An open fairy-tale book (about 900 wide) with a castle rising from its pages and stars floating up. `rise` 0..1. */
export const Storybook: React.FC<{ x: number; y: number; t: number; rise: number }> = ({ x, y, t, rise }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={150} rx={520} ry={34} fill="#000" opacity={0.4} />
    <path d="M -470 -90 Q -230 -130 0 -70 L 0 140 Q -230 80 -470 120 Z" fill="#F6EBCB" stroke="#7A5A30" strokeWidth={6} strokeLinejoin="round" />
    <path d="M 470 -90 Q 230 -130 0 -70 L 0 140 Q 230 80 470 120 Z" fill="#FBF2D8" stroke="#7A5A30" strokeWidth={6} strokeLinejoin="round" />
    <path d="M -490 130 Q -230 90 0 150 Q 230 90 490 130" stroke="#7A3A2A" strokeWidth={22} fill="none" strokeLinecap="round" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M -420 ${-50 + i * 34} Q -240 ${-84 + i * 34} -60 ${-30 + i * 34}`} stroke="#C9B58A" strokeWidth={8} fill="none" strokeLinecap="round" />)}
    <g transform={`translate(190 ${40}) scale(${easeOut(rise)})`} opacity={clamp(rise * 3)}>
      <path d="M -130 0 V -150 H -90 V -190 H -50 V -150 H -10 V -230 L 30 -290 L 70 -230 V -150 H 110 V -190 H 150 V -150 H 190 V 0 Z" transform="translate(-30 0)" fill="#E8D4F2" stroke="#6A4A8A" strokeWidth={6} strokeLinejoin="round" />
      <path d="M 0 0 V -70 Q 0 -100 30 -100 Q 60 -100 60 -70 V 0 Z" fill="#6A4A8A" transform="translate(-30 0)" />
      <path d="M 0 -290 V -340 L 50 -322 L 0 -304" fill="#E8414E" stroke="#7A2E1E" strokeWidth={4} transform="translate(0 0)" />
    </g>
    {Array.from({ length: 9 }).map((_, i) => {
      const ph = ((t * 0.018 + rnd(3, i)) % 1);
      return <path key={i} d="M 0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" transform={`translate(${-300 + rnd(4, i) * 600 + Math.sin(t / 12 + i) * 14} ${-60 - ph * 420}) scale(${0.5 + rnd(5, i) * 0.8})`} fill={i % 2 ? '#FFE27A' : '#FFFFFF'} opacity={Math.sin(ph * Math.PI) * clamp(rise * 2)} />;
    })}
    <Glow x={0} y={-40} r={520} o={0.3 * rise} />
  </g>
);
