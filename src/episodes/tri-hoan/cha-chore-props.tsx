import React from 'react';
import { BEDROOM, PaperBall, PlateTop, Phone, settle, rnd, clamp } from '../../engine';
import { StickyNote } from './cha-note-and-chip-props';

// Chapter A props for "còn 5 ngày": the desk seen from above (a landslide of stuff), the open wardrobe, a tower of
// dishes and a basin of suds. All pure functions of t.

/** Everything on Pip's desk, from straight above, in screen coordinates (use over a Tabletop). */
export const MessyDeskTop: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {/* the laptop, open, seen from above: keys, a trackpad, the screen's light */}
    <g transform="translate(640 400) rotate(-5)">
      <rect x={-250} y={-150} width={500} height={330} rx={22} fill="#000" opacity={0.3} transform="translate(12 14)" />
      <rect x={-250} y={-150} width={500} height={330} rx={22} fill="#8A8EA6" />
      <rect x={-250} y={-150} width={500} height={70} rx={16} fill="#24222E" />
      <rect x={-232} y={-140} width={464} height={50} rx={8} fill="#9FC0FF" opacity={0.55 + 0.1 * Math.sin(t / 5)} />
      {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 11 }).map((__, c) => <rect key={`${r}${c}`} x={-226 + c * 41} y={-66 + r * 36} width={34} height={28} rx={5} fill="#4A4C5C" />))}
      <rect x={-70} y={84} width={140} height={70} rx={10} fill="#7A7E96" />
    </g>
    {/* a cup noodle with its lid half peeled, a fork, steam */}
    <g transform="translate(1290 270)">
      <circle cx={8} cy={12} r={104} fill="#000" opacity={0.3} />
      <circle r={100} fill="#D9534F" /><circle r={80} fill="#F6EFE3" /><circle r={56} fill="#E6DFD0" />
      <path d="M -60 -30 Q 0 -90 60 -30 L 40 0 Z" fill="#D9534F" opacity={0.9} />
      <rect x={90} y={-12} width={150} height={9} rx={4} fill="#C9C2B2" transform="rotate(-18 90 -12)" />
      <path d={`M -20 -70 q ${Math.sin(t / 6) * 8} -26 0 -50 M 20 -70 q ${Math.cos(t / 7) * 8} -26 0 -50`} stroke="#F6EFE3" strokeWidth={5} fill="none" opacity={0.45} strokeLinecap="round" />
    </g>
    {/* two mugs, a plate with a crust, a snack bag */}
    {[[1420, 640, '#E9E2D2'], [330, 760, '#7FB5C9']].map(([x, y, c], i) => (
      <g key={i}>
        <circle cx={(x as number) + 8} cy={(y as number) + 12} r={64} fill="#000" opacity={0.3} />
        <circle cx={x as number} cy={y as number} r={62} fill={c as string} /><circle cx={x as number} cy={y as number} r={46} fill="#5A3A28" />
        <path d={`M ${(x as number) + 60} ${(y as number) - 12} q 34 6 0 30`} stroke={c as string} strokeWidth={14} fill="none" />
      </g>
    ))}
    <PlateTop x={930} y={790} r={110} />
    <path d="M 880 770 q 20 -30 60 -10 q -10 30 -60 10 Z" fill="#C98A4A" />
    <g transform="translate(1150 640) rotate(12)">
      <rect x={-6} y={8} width={170} height={230} fill="#000" opacity={0.25} />
      <path d="M 0 0 L 8 8 L 16 0 L 24 8 L 32 0 L 40 8 L 48 0 L 56 8 L 64 0 L 72 8 L 80 0 L 88 8 L 96 0 L 104 8 L 112 0 L 120 8 L 128 0 L 136 8 L 144 0 L 152 8 L 160 0 L 160 230 L 0 230 Z" fill="#E9A23B" />
      <circle cx={80} cy={110} r={44} fill="#D9534F" />
    </g>
    {/* socks, balled paper, a phone, a pen and a cable */}
    {[[440, 170, 8, '#4A8C86'], [560, 150, -20, '#D96A8A']].map(([x, y, r, c], i) => (
      <path key={i} transform={`translate(${x} ${y}) rotate(${r})`} d="M -50 -20 L 20 -26 Q 56 -22 58 6 Q 54 34 22 30 L -4 24 L -10 48 L -50 40 Z" fill={c as string} stroke="#00000033" strokeWidth={3} />
    ))}
    {[[200, 560, 36], [860, 150, 30], [1010, 460, 34], [250, 400, 26]].map(([x, y, r], i) => <PaperBall key={i} x={x} y={y} r={r} rot={i * 40} />)}
    <Phone x={980} y={140} w={110} rot={-24} />
    <path d="M 120 220 L 330 250" stroke="#E9C46A" strokeWidth={10} strokeLinecap="round" transform={`rotate(${Math.sin(t / 16) * 2} 200 230)`} />
    <path d="M 60 880 q 260 -140 420 -20 t 380 -30" stroke="#1D2033" strokeWidth={7} fill="none" strokeLinecap="round" />
    {[[700, 700, 6], [1000, 280, -9], [160, 840, 14], [1500, 400, 4]].map(([x, y, r], i) => <StickyNote key={i} x={x} y={y} w={110} rot={r} />)}
  </g>
);

/** The wardrobe's open side on the bedroom's right wall: a dark cavity, hanging clothes, one door swung out. */
export const OpenWardrobe: React.FC<{ open?: number }> = ({ open = 1 }) => {
  const { P, Q } = BEDROOM;
  const cols = ['#D9534F', '#E9C46A', '#4A8C86', '#8A6AC9', '#F2A65A', '#5C7CFA', '#F6EFE3', '#D96A8A'];
  const door = [[0.87, 0.14, 0.14], [0.87, 0.14, 0.14 + 0.12 * open], [0.87, 0.97, 0.14 + 0.12 * open], [0.87, 0.97, 0.14]] as [number, number, number][];
  return (
    <g>
      <polygon points={Q([[0.87, 0.14, 0.14], [0.87, 0.14, 0.4], [0.87, 0.97, 0.4], [0.87, 0.97, 0.14]])} fill="#120E14" opacity={open} />
      <path d={`M ${P(0.87, 0.24, 0.16).x} ${P(0.87, 0.24, 0.16).y} L ${P(0.87, 0.24, 0.38).x} ${P(0.87, 0.24, 0.38).y}`} stroke="#8A8EA6" strokeWidth={4} opacity={open} />
      {cols.map((c, i) => {
        const a = P(0.87, 0.26, 0.17 + i * 0.027);
        const b = P(0.87, 0.62 + (i % 3) * 0.04, 0.17 + i * 0.027);
        return <path key={i} d={`M ${a.x} ${a.y} L ${b.x - 6} ${b.y} L ${b.x + 8} ${b.y} Z`} fill={c} opacity={open} />;
      })}
      <polygon points={Q(door)} fill="#46383F" stroke="#2E242C" strokeWidth={3} />
    </g>
  );
};

/** A T-shirt (x, y its middle, w its width, rot): the colour comes from `c`. */
export const Shirt: React.FC<{ x: number; y: number; w?: number; rot?: number; c: string }> = ({ x, y, w = 80, rot = 0, c }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${w / 80})`}>
    <path d="M -22 -34 L -40 -26 L -52 -4 L -36 4 L -28 -8 L -28 34 L 28 34 L 28 -8 L 36 4 L 52 -4 L 40 -26 L 22 -34 Q 0 -22 -22 -34 Z" fill={c} stroke="#00000044" strokeWidth={3} strokeLinejoin="round" />
    <path d="M -22 -34 Q 0 -22 22 -34" stroke="#00000033" strokeWidth={4} fill="none" />
  </g>
);

/** A leaning tower of plates, bowls and a pot, side view: x, y the middle of its base; it wobbles (`wob` 0..1). */
export const DishTower: React.FC<{ x: number; y: number; t: number; n?: number; wob?: number; s?: number }> = ({ x, y, t, n = 9, wob = 1, s = 1 }) => {
  const lean = Math.sin(t / 7) * 3 * wob + settle(t, 4, 1.2, 10);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={100} ry={14} fill="#000" opacity={0.35} />
      {Array.from({ length: n }).map((_, i) => {
        const k = i * 0.01 + 0.004;
        const dx = lean * i * 0.7 + (rnd(8, i) - 0.5) * 14;
        const w = i === 0 ? 112 : i % 3 === 2 ? 74 : 92;
        return (
          <g key={i} transform={`translate(${dx} ${-i * 22 - k})`}>
            <ellipse cx={0} cy={-2} rx={w} ry={13} fill="#CFC8BC" />
            <ellipse cx={0} cy={-8} rx={w} ry={12} fill={i % 3 === 2 ? '#9FC0D9' : '#F4F1EA'} />
            <ellipse cx={0} cy={-8} rx={w * 0.66} ry={7} fill="#E6E0D4" />
            {i % 2 === 0 ? <path d={`M ${-w * 0.4} -8 q 14 -10 30 0`} stroke="#9A6A3A" strokeWidth={4} fill="none" opacity={0.7} /> : null}
          </g>
        );
      })}
      <g transform={`translate(${lean * n * 0.7} ${-n * 22 - 2})`}>
        <path d="M -50 0 L 50 0 L 44 -44 L -44 -44 Z" fill="#7A7E96" /><rect x={-60} y={-52} width={120} height={9} rx={4} fill="#9A9EB6" />
        <path d="M 50 -36 L 82 -40" stroke="#3A3C4C" strokeWidth={9} strokeLinecap="round" />
      </g>
    </g>
  );
};

/** A basin of suds on the worktop: x, y the middle of its base, bubbles rising (a pure function of t). */
export const SudsBasin: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={14} fill="#000" opacity={0.35} />
    <path d="M -110 -70 L 110 -70 L 90 0 L -90 0 Z" fill="#4C8FD9" />
    <ellipse cx={0} cy={-70} rx={110} ry={16} fill="#6FB0F2" />
    {[[-60, -84, 26], [-20, -92, 34], [24, -88, 30], [62, -82, 22], [0, -100, 20]].map(([bx, by, r], i) => <circle key={i} cx={bx} cy={by} r={r} fill="#F6FAFF" stroke="#BFD6FF" strokeWidth={3} />)}
    {Array.from({ length: 7 }).map((_, i) => {
      const k = ((t * 0.7 + i * 9) % 50) / 50;
      return <circle key={`b${i}`} cx={-70 + i * 24 + Math.sin(t / 8 + i) * 10} cy={-110 - k * 150} r={8 + (i % 3) * 5} fill="none" stroke="#DFF0FF" strokeWidth={3} opacity={1 - k} />;
    })}
  </g>
);

/** A teardrop sliding down a cheek from (x, y) over `t` frames, then gone. */
export const Tear: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const k = clamp(t / 26);
  return k <= 0 || k >= 1 ? null : (
    <path transform={`translate(${x} ${y + k * 46 * s}) scale(${s})`} d="M 0 -10 Q 7 2 0 9 Q -7 2 0 -10 Z" fill="#8FD3FF" stroke="#DFF0FF" strokeWidth={1.5} opacity={1 - k * 0.5} />
  );
};
