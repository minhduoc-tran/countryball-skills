import React from 'react';
import { clamp, easeOut, backOut, rnd, FONT, SCH, UI, LOOKS, Look } from '../../engine';
import { PAL } from './kit-palette';

// Chapter C, "tired" props (pure functions of t; x, y = centre unless said).
//   RESEARCHER                  a lab-coat Look (white coat, dark bob) for the sleep researcher.
//   <DayBar x y w t p />        x y = left end. The waking day 06:00 -> 24:00 as a bar filling to p, a sun at the start,
//                               a moon at the end, an open eye riding the tip; "18 GIỜ" pops over it when p reaches 1.
//   <EyeIcon x y s t red? />    a wide-open schematic eye, ~240 wide at s 1; red 0..1 adds bloodshot veins + dark bags.
//   <BeerGlass x y s t fill />  a schematic beer glass ~180 x 260 at s 1 (x y = base centre), fill 0..1 with bubbles.
//   <ReactionBox x y s light press />  the reaction tester seen front-on (~700 x 420 at s 1): lamp (grey -> green),
//                               a big red button that sinks by `press` 0..1.
//   <Meter x y w p label color t />    x y = top-left: a label and a rounded bar filled to p in `color`, "%" readout.
//   <HeavyCloud x y s t />      a grey rain cloud with a drizzle (over a tired head).
//   <Zs x y t s? />             sleepy z's drifting up.   popIn(t, at) -> { s, o, e } for staggered pop-ins.

export const RESEARCHER: Look = { ...LOOKS.mom, jacket: '#E4E0D6', jacketShade: '#C6C0B2', accent: '#7FA6C9', limb: '#E4E0D6', hair: '#2A2028', shoe: '#3A3446' };

export const DayBar: React.FC<{ x: number; y: number; w: number; t: number; p: number }> = ({ x, y, w, t, p }) => {
  const q = clamp(p);
  const tip = x + w * q;
  const done = backOut(clamp((p - 1) * 10));
  return (
    <g>
      <rect x={x} y={y - 34} width={w} height={68} rx={34} fill="#FFFFFF" opacity={0.1} stroke={SCH.dim} strokeWidth={3} />
      <defs>
        <linearGradient id="chcDayFill" x1="0" x2="1">
          <stop offset="0" stopColor="#FFD27A" />
          <stop offset="0.6" stopColor={SCH.live} />
          <stop offset="1" stopColor="#5A6AD8" />
        </linearGradient>
      </defs>
      <rect x={x} y={y - 34} width={Math.max(68, w * q)} height={68} rx={34} fill="url(#chcDayFill)" opacity={q > 0 ? 1 : 0} />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <path d={`M ${x + (w * k) / 3} ${y + 44} l 0 18`} stroke={SCH.line} strokeWidth={4} />
          <text x={x + (w * k) / 3} y={y + 110} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.line}>{['06:00', '12:00', '18:00', '24:00'][k]}</text>
        </g>
      ))}
      {/* the sun at the start, the moon at the end */}
      <g transform={`translate(${x - 10} ${y - 150})`}>
        <circle r={44} fill="#FFD27A" style={{ filter: 'drop-shadow(0 0 18px #FFB15A)' }} />
        {Array.from({ length: 8 }).map((_, k) => <path key={k} d={`M ${Math.cos(k * 0.785 + t / 30) * 60} ${Math.sin(k * 0.785 + t / 30) * 60} L ${Math.cos(k * 0.785 + t / 30) * 78} ${Math.sin(k * 0.785 + t / 30) * 78}`} stroke="#FFD27A" strokeWidth={7} strokeLinecap="round" />)}
      </g>
      <g transform={`translate(${x + w + 10} ${y - 150})`}>
        <circle r={44} fill="#C9D6FF" />
        <circle cx={18} cy={-12} r={40} fill={SCH.ground} />
        {[[-70, -30], [60, 40], [-40, 50]].map(([sx, sy], k) => <circle key={k} cx={sx} cy={sy} r={4} fill="#F6EFE3" opacity={0.5 + 0.5 * Math.sin(t / 5 + k)} />)}
      </g>
      <EyeIcon x={Math.max(x + 40, tip - 40)} y={y} s={0.36} t={t} red={q} />
      <g transform={`translate(${x + w / 2} ${y - 230}) scale(${done})`} opacity={clamp((p - 1) * 10)}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={110} fill={SCH.live} style={{ filter: `drop-shadow(0 0 18px ${SCH.glow}88)` }}>18 GIỜ</text>
      </g>
    </g>
  );
};

export const EyeIcon: React.FC<{ x: number; y: number; s?: number; t: number; red?: number }> = ({ x, y, s = 1, t, red = 0 }) => {
  const look = Math.sin(t / 11) * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {red > 0 ? <path d="M -100 30 Q 0 110 100 30" stroke="#5A4A7A" strokeWidth={14} fill="none" opacity={0.6 * red} strokeLinecap="round" /> : null}
      <path d="M -120 0 Q 0 -110 120 0 Q 0 110 -120 0 Z" fill="#F6EFE3" stroke={SCH.line} strokeWidth={8} strokeLinejoin="round" />
      {Array.from({ length: 6 }).map((_, k) => {
        const side = k % 2 ? 1 : -1;
        const sy = (rnd(81, k) - 0.5) * 50;
        return <path key={k} d={`M ${side * 112} ${sy * 0.3} q ${-side * 24} ${sy * 0.4} ${-side * 40} ${sy} l ${-side * 14} ${rnd(82, k) * 12}`} stroke="#E8553E" strokeWidth={4} fill="none" opacity={red} strokeLinecap="round" />;
      })}
      <circle cx={look} cy={0} r={46} fill="#3E6A8A" />
      <circle cx={look} cy={0} r={22} fill="#0E1018" />
      <circle cx={look + 12} cy={-12} r={8} fill="#FFFFFF" />
    </g>
  );
};

export const BeerGlass: React.FC<{ x: number; y: number; s?: number; t: number; fill: number }> = ({ x, y, s = 1, t, fill }) => {
  const f = clamp(fill);
  const top = -240;
  const lvl = -20 + (top + 40 + 20) * f;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id="chcGlass"><path d="M -86 -240 L 86 -240 L 70 0 L -70 0 Z" /></clipPath>
      </defs>
      <g clipPath="url(#chcGlass)">
        <rect x={-100} y={lvl} width={200} height={260} fill="#F2B33D" opacity={0.9} />
        <rect x={-100} y={lvl - 30} width={200} height={34} rx={14} fill="#FFF6E0" opacity={f > 0.05 ? 1 : 0} />
        {Array.from({ length: 10 }).map((_, k) => {
          const ph = (t * 0.03 + rnd(91, k)) % 1;
          const by = -10 - ph * (-lvl - 10);
          return by > lvl ? <circle key={k} cx={-50 + rnd(92, k) * 100} cy={by} r={4 + rnd(93, k) * 4} fill="#FFF6E0" opacity={0.7} /> : null;
        })}
      </g>
      <path d="M -86 -240 L 86 -240 L 70 0 L -70 0 Z" fill="none" stroke={SCH.line} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 86 -190 Q 150 -180 146 -110 Q 142 -50 78 -50" stroke={SCH.line} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M -60 -210 L -50 -30" stroke="#FFFFFF" strokeWidth={6} opacity={0.3} strokeLinecap="round" />
    </g>
  );
};

export const ReactionBox: React.FC<{ x: number; y: number; s?: number; light: number; press: number }> = ({ x, y, s = 1, light, press }) => {
  const g = clamp(light);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={220} rx={380} ry={30} fill="#000" opacity={0.35} />
      <rect x={-350} y={-200} width={700} height={420} rx={40} fill="#2A2E3A" stroke="#11131A" strokeWidth={8} />
      <rect x={-330} y={-186} width={660} height={22} rx={11} fill="#FFFFFF" opacity={0.08} />
      {/* the lamp */}
      <circle cx={-150} cy={-30} r={96} fill="#11131A" />
      <circle cx={-150} cy={-30} r={80} fill={g > 0.5 ? '#3DE07A' : '#4A5060'} style={g > 0.5 ? { filter: 'drop-shadow(0 0 40px #3DE07A)' } : undefined} />
      <circle cx={-176} cy={-56} r={18} fill="#FFFFFF" opacity={0.35} />
      {/* the button */}
      <ellipse cx={150} cy={40} rx={124} ry={46} fill="#11131A" />
      <g transform={`translate(0 ${press * 22})`}>
        <path d="M 40 40 L 40 -10 A 110 40 0 0 1 260 -10 L 260 40 A 110 40 0 0 1 40 40 Z" fill="#A8323E" />
        <ellipse cx={150} cy={-10} rx={110} ry={40} fill="#E8553E" />
        <ellipse cx={120} cy={-20} rx={40} ry={12} fill="#FFFFFF" opacity={0.3} />
      </g>
    </g>
  );
};

export const Meter: React.FC<{ x: number; y: number; w?: number; p: number; label: string; color: string; t: number }> = ({ x, y, w = 520, p, label, color }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-24} y={-70} width={w + 48} height={150} rx={28} fill={UI.pill} opacity={0.78} />
    <text x={0} y={-20} fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={UI.text} letterSpacing={4}>{label}</text>
    <text x={w} y={-20} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={color}>{`${Math.round(clamp(p) * 100)}%`}</text>
    <rect x={0} y={10} width={w} height={40} rx={20} fill="#FFFFFF" opacity={0.14} />
    <rect x={0} y={10} width={Math.max(40, w * clamp(p))} height={40} rx={20} fill={color} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
  </g>
);

export const HeavyCloud: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 9) * 6}) scale(${s})`}>
    {Array.from({ length: 9 }).map((_, k) => {
      const ph = (t * 0.07 + rnd(95, k)) % 1;
      return <path key={k} d={`M ${-90 + rnd(96, k) * 180} ${40 + ph * 120} l -6 22`} stroke="#9AA6BE" strokeWidth={5} strokeLinecap="round" opacity={0.8 * (1 - ph)} />;
    })}
    {[[-80, 10, 60], [-20, -20, 76], [60, 0, 66], [110, 24, 46], [-130, 30, 42]].map(([cx, cy, r], k) => <circle key={k} cx={cx} cy={cy} r={r} fill="#5E6678" />)}
    <path d="M -172 40 L 156 40 Q 160 70 120 70 L -150 70 Q -180 66 -172 40 Z" fill="#4A5062" />
    {[[-70, -30, 40], [-10, -60, 44]].map(([cx, cy, r], k) => <circle key={`h${k}`} cx={cx} cy={cy} r={r} fill="#7A8296" opacity={0.6} />)}
  </g>
);

/** A sleepy "z" floating up from (x, y), every 24 frames. */
export const Zs: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g>
    {[0, 1, 2].map((k) => {
      const ph = ((t + k * 12) % 36) / 36;
      return (
        <text key={k} x={x + ph * 60 * s + k * 8} y={y - ph * 140 * s} fontFamily={FONT.hand} fontSize={(34 + k * 10) * s} fill={PAL.paper} opacity={Math.sin(ph * Math.PI) * 0.85}>z</text>
      );
    })}
  </g>
);

export const popIn = (t: number, at: number) => ({ s: 0.4 + 0.6 * backOut(clamp((t - at) / 9)), o: clamp((t - at) / 4), e: easeOut(clamp((t - at) / 12)) });
