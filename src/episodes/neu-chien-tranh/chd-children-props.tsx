import React from 'react';
import { clamp, easeOut, rnd, FONT } from '../../engine';

// Chapter D, "children": sis's grey-white cat (the same cat all episode), the empty swing, and the exercise book:
// a closed cover that opens, ruled pages, careful pencil letters that write on, the pencil. Pure functions of t.

const FUR = '#B9BECB';
const FUR_DK = '#8F95A6';
const FUR_LT = '#ECEEF3';

/** The cat in a loaf, facing left (`flip` faces right); x, y = where it touches the floor; `eyes` open / half / closed. */
export const GreyCat: React.FC<{ x: number; y: number; s?: number; t: number; eyes?: 'open' | 'half' | 'closed'; flip?: boolean }> = ({ x, y, s = 1, t, eyes = 'open', flip = false }) => {
  const br = Math.sin(t / 13) * 1.6;
  const fl = Math.sin(t / 17) * 12;
  const ear = Math.max(0, Math.sin(t / 29)) > 0.97 ? -10 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={6} cy={4} rx={104} ry={12} fill="#000" opacity={0.3} />
      <path d={`M 64 -14 Q ${112 + fl * 0.5} -6 ${104 + fl} -44`} stroke={FUR_DK} strokeWidth={15} fill="none" strokeLinecap="round" />
      <ellipse cx={4} cy={-36 - br * 0.5} rx={76} ry={38 + br} fill={FUR} />
      <path d="M -70 -30 Q 4 8 78 -30 Q 74 2 4 2 Q -66 2 -70 -30 Z" fill={FUR_LT} opacity={0.85} />
      <ellipse cx={34} cy={-32} rx={38} ry={30} fill={FUR} stroke={FUR_DK} strokeWidth={2} opacity={0.9} />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${6 + i * 24} ${-72 + i * 3} q 6 14 ${i * 2} 26`} stroke={FUR_DK} strokeWidth={6} fill="none" strokeLinecap="round" />)}
      <ellipse cx={-52} cy={-6} rx={22} ry={11} fill={FUR_LT} />
      <ellipse cx={-22} cy={-4} rx={20} ry={10} fill={FUR_LT} />
      <g transform="translate(-62 -78)">
        <path d={`M -28 -14 L -30 -52 L -6 -30 Z`} fill={FUR} stroke={FUR_DK} strokeWidth={2} />
        <path d={`M 28 -14 L 30 -52 L 6 -30 Z`} fill={FUR} stroke={FUR_DK} strokeWidth={2} transform={`rotate(${ear} 20 -14)`} />
        <path d="M -24 -20 L -25 -42 L -10 -28 Z M 24 -20 L 25 -42 L 10 -28 Z" fill="#E8A8B0" opacity={0.8} />
        <circle r={34} fill={FUR} />
        <ellipse cx={0} cy={14} rx={18} ry={13} fill={FUR_LT} />
        <path d="M -3 6 L 3 6 L 0 11 Z" fill="#E08A98" />
        {eyes === 'open' ? (
          <g>
            {[-14, 14].map((cx) => <ellipse key={cx} cx={cx} cy={-4} rx={7} ry={8} fill="#CFE08A" />)}
            {[-14, 14].map((cx) => <ellipse key={cx} cx={cx} cy={-4} rx={2.4} ry={7} fill="#15131C" />)}
          </g>
        ) : eyes === 'half' ? (
          <g>
            {[-14, 14].map((cx) => <path key={cx} d={`M ${cx - 8} -5 Q ${cx} 2 ${cx + 8} -5 Q ${cx} -9 ${cx - 8} -5 Z`} fill="#CFE08A" />)}
            {[-14, 14].map((cx) => <path key={cx} d={`M ${cx - 9} -6 H ${cx + 9}`} stroke={FUR_DK} strokeWidth={4} strokeLinecap="round" />)}
          </g>
        ) : (
          <g>{[-14, 14].map((cx) => <path key={cx} d={`M ${cx - 8} -4 Q ${cx} 4 ${cx + 8} -4`} stroke="#3A3446" strokeWidth={3.5} fill="none" strokeLinecap="round" />)}</g>
        )}
        <path d="M -30 8 L -52 4 M -30 14 L -52 16 M 30 8 L 52 4 M 30 14 L 52 16" stroke={FUR_LT} strokeWidth={2.4} opacity={0.8} />
      </g>
    </g>
  );
};

/** An empty swing at dusk: an A-frame, a bar, two chains and a seat swinging gently; x the middle, y the ground. */
export const Swing: React.FC<{ x: number; y: number; t: number; amp?: number }> = ({ x, y, t, amp = 9 }) => {
  const th = Math.sin(t / 15) * amp;
  const top = y - 560;
  const L = 430;
  const rad = (th * Math.PI) / 180;
  const sx = Math.sin(rad) * L;
  const sy = Math.cos(rad) * L;
  return (
    <g>
      <ellipse cx={x} cy={y + 8} rx={400} ry={16} fill="#000" opacity={0.3} />
      {[-1, 1].map((d) => <path key={d} d={`M ${x + d * 40} ${top} L ${x + d * 330} ${y} M ${x + d * 40} ${top} L ${x + d * 250} ${y + 10}`} stroke="#3A3446" strokeWidth={16} strokeLinecap="round" />)}
      <rect x={x - 70} y={top - 14} width={140} height={26} rx={10} fill="#2A2438" />
      {[-60, 60].map((d) => <path key={d} d={`M ${x + d} ${top} L ${x + d + sx} ${top + sy}`} stroke="#8A8EA0" strokeWidth={5} strokeDasharray="14 5" />)}
      <g transform={`translate(${x + sx} ${top + sy}) rotate(${th})`}>
        <rect x={-90} y={0} width={180} height={24} rx={10} fill="#B0463A" stroke="#5A1E18" strokeWidth={4} />
        <rect x={-90} y={0} width={180} height={7} rx={4} fill="#FFFFFF" opacity={0.25} />
      </g>
    </g>
  );
};

/** A ruled exercise-book page seen from above (x0, y0 = top-left, w x h), with a red margin; faint lines every `gap`. */
export const RuledPage: React.FC<{ x0: number; y0: number; w: number; h: number; gap?: number; first?: number; margin?: boolean }> = ({ x0, y0, w, h, gap = 190, first = 240, margin = true }) => (
  <g>
    <rect x={x0 + 14} y={y0 + 16} width={w} height={h} fill="#000" opacity={0.3} />
    <rect x={x0} y={y0} width={w} height={h} fill="#F2EAD6" />
    {Array.from({ length: Math.floor((h - first) / gap) + 1 }).map((_, i) => <path key={i} d={`M ${x0} ${y0 + first + i * gap} H ${x0 + w}`} stroke="#8FB0D0" strokeWidth={3} opacity={0.75} />)}
    {margin ? <path d={`M ${x0 + 110} ${y0} V ${y0 + h}`} stroke="#D9645A" strokeWidth={3} opacity={0.7} /> : null}
  </g>
);

/** Careful pencil letters writing on one by one: line baselines `y`, letters from x0 every dx, starting at frame `start`, one per `step`. */
export const PencilLetters: React.FC<{ t: number; id: string; text: string[]; x0: number; y: number; dx: number; start: number; step: number; size?: number }> = ({ t, id, text, x0, y, dx, start, step, size = 150 }) => (
  <g fontFamily={FONT.hand} fontSize={size} fill="#4A4A66">
    {text.map((ch, i) => {
      const p = clamp((t - (start + i * step)) / (step * 1.1));
      if (p <= 0) return null;
      const x = x0 + i * dx;
      return (
        <g key={i} transform={`rotate(${(rnd(4, i) - 0.5) * 5} ${x} ${y})`}>
          <clipPath id={`${id}c${i}`}><rect x={x - 12} y={y - size} width={(dx + 4) * easeOut(p)} height={size * 1.4} /></clipPath>
          <text x={x} y={y} clipPath={`url(#${id}c${i})`} stroke="#4A4A66" strokeWidth={1.5}>{ch}</text>
        </g>
      );
    })}
  </g>
);

/** x of the pencil tip after `n` letters have been written (for the hand to follow). */
export const tipAt = (t: number, x0: number, dx: number, start: number, step: number, count: number) => {
  const k = clamp((t - start) / step, 0, count);
  return x0 + dx * k + 40;
};

/** A pencil lying along the line from its tip (x, y) up and to the right, `len` long. */
export const Pencil: React.FC<{ x: number; y: number; len?: number; ang?: number }> = ({ x, y, len = 430, ang = -62 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    <path d="M 0 0 L 50 -15 V 15 Z" fill="#E9C99A" stroke="#7A5A3A" strokeWidth={3} />
    <path d="M 0 0 L 16 -5 V 5 Z" fill="#3A3446" />
    <rect x={50} y={-15} width={len - 90} height={30} fill="#F2C230" stroke="#9A7A10" strokeWidth={3} />
    <rect x={50} y={-15} width={len - 90} height={9} fill="#FFFFFF" opacity={0.3} />
    <rect x={len - 40} y={-15} width={40} height={30} rx={6} fill="#E8837A" stroke="#8A3A32" strokeWidth={3} />
    <rect x={len - 44} y={-15} width={8} height={30} fill="#C9CCD6" />
  </g>
);
