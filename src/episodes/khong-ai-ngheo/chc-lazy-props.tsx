import React from 'react';
import { Glow, Dust, SCH, FONT, clamp, easeOut } from '../../engine';
import { INK } from './chc-family-props';

// Chapter C props, the "lazy?" doubt: a living room with a sofa (lazy blanket lump, or empty with a dent), a calendar,
// a stress face. Pure functions of the shot clock.

/** A plain living room: wall, window with swaying curtains, rug, floor lamp, a door at the right (`open` pours light in). Floor at y 800. */
export const LivingRoom: React.FC<{ t: number; id: string; open?: number; lampOn?: number }> = ({ t, id, open = 0, lampOn = 1 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CDB89A" /><stop offset="1" stopColor="#B59C7C" /></linearGradient>
      <linearGradient id={`${id}door`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFF1C4" /><stop offset="1" stopColor="#FFD98A" /></linearGradient>
    </defs>
    <rect x={-300} y={-300} width={2520} height={1100} fill={`url(#${id}wall)`} />
    <rect x={-300} y={800} width={2520} height={500} fill="#8A6A4C" />
    <rect x={-300} y={792} width={2520} height={14} fill="#5E4630" />
    {/* window with curtains */}
    <rect x={260} y={170} width={360} height={380} rx={8} fill="#BFD9E8" stroke="#6E5238" strokeWidth={12} />
    <path d="M 440 170 V 550" stroke="#6E5238" strokeWidth={8} />
    {[0, 1].map((i) => <path key={i} d={`M ${i ? 640 : 240} 150 q ${(i ? -1 : 1) * (50 + Math.sin(t / 25 + i) * 6)} 220 ${(i ? -1 : 1) * 20} 430 H ${i ? 560 : 320} Z`} fill="#C9724A" opacity={0.92} />)}
    {/* the door at the right, with light beyond it when open */}
    <rect x={1380} y={150} width={300} height={650} fill={open > 0 ? `url(#${id}door)` : '#7A5638'} stroke="#4A2E20" strokeWidth={8} />
    {open > 0 ? <path d="M 1380 150 L 1380 800 L 1250 830 L 1250 180 Z" fill="#7A5638" stroke="#4A2E20" strokeWidth={6} /> : null}
    {open > 0 ? <path d="M 1380 800 L 1000 1000 H 1500 L 1680 800 Z" fill="#FFE9A8" opacity={0.28 * open} /> : null}
    {/* rug, floor lamp */}
    <ellipse cx={960} cy={900} rx={560} ry={62} fill="#7A4A4A" opacity={0.65} />
    <g>
      <path d="M 1130 800 V 420" stroke="#4A3626" strokeWidth={9} />
      <ellipse cx={1130} cy={800} rx={44} ry={9} fill="#2A2018" />
      <path d="M 1086 420 L 1174 420 L 1152 340 L 1108 340 Z" fill="#F2D49A" stroke="#6E5238" strokeWidth={4} />
    </g>
    <Glow x={1130} y={400} r={420} o={0.5 * lampOn} />
    <Glow x={430} y={340} r={560} o={0.22} />
    <Dust t={t} seed={8} x0={240} y0={200} w={500} h={560} n={18} o={0.5} />
  </g>
);

/** A sofa from the front: back, arms, three seat cushions with a dent in the middle one (`dent` 0..1). Origin: floor centre, 640 wide at s = 1. */
export const Sofa: React.FC<{ x: number; y: number; s?: number; dent?: number }> = ({ x, y, s = 1, dent = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={340} ry={20} fill="#000" opacity={0.3} />
    <rect x={-300} y={-300} width={600} height={190} rx={50} fill="#5C7090" stroke={INK} strokeWidth={6} />
    <rect x={-340} y={-190} width={90} height={170} rx={36} fill="#52668A" stroke={INK} strokeWidth={6} />
    <rect x={250} y={-190} width={90} height={170} rx={36} fill="#52668A" stroke={INK} strokeWidth={6} />
    {[-165, 0, 165].map((cx, i) => <rect key={i} x={cx - 80} y={-120} width={160} height={90} rx={22} fill="#6A81A6" stroke={INK} strokeWidth={5} />)}
    <ellipse cx={0} cy={-84} rx={60} ry={14 + 6 * dent} fill="#4A5C7C" opacity={0.55 * dent} />
    <path d="M -300 -20 V 0 M 300 -20 V 0" stroke={INK} strokeWidth={14} strokeLinecap="round" />
  </g>
);

/** Someone sprawled under a blanket on the sofa: a lump and two socked feet, with Zs drifting up. Origin: sofa floor centre. */
export const BlanketLump: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -240 -118 Q -230 -190 -120 -176 Q 0 -200 120 -170 Q 230 -150 240 -118 Z" fill="#B0606E" stroke={INK} strokeWidth={5} />
    <path d="M -140 -170 q 30 -30 60 0 M 20 -184 q 30 -26 60 4" stroke="#8A4654" strokeWidth={5} fill="none" strokeLinecap="round" />
    <ellipse cx={-248} cy={-132} rx={30} ry={26} fill="#E9C9A0" stroke={INK} strokeWidth={4} />
    <ellipse cx={262} cy={-126} rx={20} ry={26} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
    <ellipse cx={298} cy={-122} rx={20} ry={26} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
    {[0, 1, 2].map((i) => {
      const ph = ((t * 0.5 + i * 22) % 66) / 66;
      return <text key={i} x={-220 + ph * 60 + i * 30} y={-220 - ph * 150} fontFamily={FONT.hand} fontSize={44 + i * 14} fill="#F6EFE3" stroke={INK} strokeWidth={5} paintOrder="stroke" opacity={Math.sin(ph * Math.PI)}>Z</text>;
    })}
  </g>
);

/** A month calendar page, 300 x 330 at s = 1, origin its centre; `tick` cells show a green tick as they come in. */
export const CalendarPage: React.FC<{ x: number; y: number; s?: number; t: number; ticks?: number }> = ({ x, y, s = 1, t, ticks = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-165} width={300} height={330} rx={16} fill="#F6EFE3" stroke={INK} strokeWidth={6} />
    <path d="M -150 -165 H 150 V -100 H -150 Z" fill="#E0533F" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {Array.from({ length: 20 }).map((_, i) => {
      const cx = -108 + (i % 5) * 54;
      const cy = -62 + Math.floor(i / 5) * 56;
      const on = clamp(ticks - i);
      return <g key={i}><rect x={cx - 20} y={cy - 20} width={40} height={40} rx={6} fill="none" stroke="#8A8794" strokeWidth={3} />{on > 0 ? <path d={`M ${cx - 12} ${cy} l 9 10 l 17 -20`} stroke="#2DBE6C" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={on} /> : null}</g>;
    })}
  </g>
);

/** A round stress face on the meter: `calm` 0 = worried (frown, sweat), 1 = relaxed (smile). */
export const StressFace: React.FC<{ x: number; y: number; s?: number; calm: number; t: number }> = ({ x, y, s = 1, calm, t }) => {
  const c = easeOut(clamp(calm));
  const col = c > 0.5 ? '#9ED6A8' : '#F2B3A0';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={90} fill={col} stroke={SCH.line} strokeWidth={7} />
      {[-30, 30].map((ex) => <circle key={ex} cx={ex} cy={-18} r={9} fill={INK} />)}
      <path d={`M -36 ${-38 + 8 * (1 - c)} L -16 ${-50 - 10 * (1 - c)} M 36 ${-38 + 8 * (1 - c)} L 16 ${-50 - 10 * (1 - c)}`} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={1 - c} />
      <path d={`M -36 ${26 + 6 * (1 - c)} Q 0 ${-14 + 76 * c} 36 ${26 + 6 * (1 - c)}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      {c < 0.6 ? <path d={`M 70 ${-30 + ((t * 1.6) % 40)} q 8 14 0 24 q -8 -10 0 -24 Z`} fill="#8CD3F0" stroke={INK} strokeWidth={3} /> : null}
    </g>
  );
};
