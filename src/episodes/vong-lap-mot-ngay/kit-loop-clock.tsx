import React from 'react';
import { clamp, easeOut, easeInOut, backOut, lerp, FONT, UI, Glow } from '../../engine';
import { PAL, mix, fmtVN } from './kit-palette';

export { RewindWave, MemoryGlow } from './kit-rewind-fx';

// The loop's clock grammar. Screen-space or world-space, pure functions of t. x, y = CENTRE unless said.
//   <FlipClock x y s time="06:00" t from? flipAt? cyan? />  big flip-digit clock, 4 cards + colon, ~600 x 200 at s 1.
//       Digits that differ between `from` and `time` flip (8 frames) starting at frame `flipAt` (default 0).
//       cyan 0..1 tints the cards with the reset colour; blur (px) smears the digits (fast spin).
//   <ResetClock t t0 x y s />  the power's gag, ~40 frames from t0: 23:59 holds, flips to 00:00 (t0..t0+7), the
//       digits spin BACKWARDS fast through the night and day (t0+9..t0+30, cyan, a spinning LoopIcon above),
//       slam on 06:00 (t0+31, overshoot) and the label "THỨ TƯ" pops under (t0+33). Before t0: 23:59. Total height
//       ~400 at s 1 (clock 236, label pill centred 200 below). Pair with <RewindWave t t0={t0 + 30} /> for the snap.
//   <DayCounter x y n t? s? />  the pill "NGÀY #n" (n in VN format: 3.650) with a cyan loop icon; pops in over 8
//       frames from t = 0 when t is given. Pill height 84 at s 1, width grows with n (~360 for 3 digits).
//   <LoopIcon x y r t? spin? color? />  the cyan circular rewind arrow (anticlockwise); spins backwards with t.

const CARD = { w: 128, h: 184, gap: 14, colon: 46 };
const digitX = (i: number) => {
  const total = CARD.w * 4 + CARD.gap * 2 + CARD.colon;
  const x0 = -total / 2;
  return i < 2 ? x0 + i * (CARD.w + CARD.gap) : x0 + 2 * CARD.w + CARD.gap + CARD.colon + (i - 2) * (CARD.w + CARD.gap);
};

/** One half (top or bottom) of a flip card showing digit `ch`: an inner <svg> clips it, so no ids are needed. */
const Half: React.FC<{ x: number; ch: string; top: boolean; cyan: number; k?: number }> = ({ x, ch, top, cyan, k = 1 }) => {
  const hh = CARD.h / 2;
  const bg = mix(top ? '#2A2836' : '#24222E', '#1E4A56', cyan);
  const fg = mix('#F6EFE3', PAL.cyanSoft, cyan);
  const hinge = 0;
  return (
    <g transform={`translate(0 ${hinge}) scale(1 ${k}) translate(0 ${-hinge})`}>
      <svg x={x} y={top ? -hh : 0} width={CARD.w} height={hh} viewBox={`0 ${top ? 0 : hh} ${CARD.w} ${hh}`} overflow="hidden">
        <rect x={0} y={0} width={CARD.w} height={CARD.h} rx={16} fill={bg} />
        <text x={CARD.w / 2} y={CARD.h / 2 + 50} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={148} fill={fg}>
          {ch}
        </text>
        {top ? <rect x={0} y={0} width={CARD.w} height={10} rx={5} fill="#FFFFFF" opacity={0.08} /> : <rect x={0} y={CARD.h - 30} width={CARD.w} height={30} fill="#000" opacity={0.15} />}
      </svg>
    </g>
  );
};

export const FlipClock: React.FC<{ x: number; y: number; s?: number; time: string; t: number; from?: string; flipAt?: number; cyan?: number; blur?: number }> = ({ x, y, s = 1, time, t, from, flipAt = 0, cyan = 0, blur = 0 }) => {
  const now = time.replace(':', '').padStart(4, '0').slice(0, 4).split('');
  const old = (from ?? time).replace(':', '').padStart(4, '0').slice(0, 4).split('');
  const p = clamp((t - flipAt) / 8);
  const W = digitX(3) + CARD.w - digitX(0);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* the housing */}
      <rect x={-W / 2 - 30} y={-CARD.h / 2 - 26} width={W + 60} height={CARD.h + 52} rx={34} fill="#0E0C16" stroke="#3A3446" strokeWidth={5} />
      <rect x={-W / 2 - 24} y={-CARD.h / 2 - 22} width={W + 48} height={10} rx={5} fill="#FFFFFF" opacity={0.06} />
      {now.map((n, i) => {
        const o = old[i];
        const cx = digitX(i);
        const flipping = o !== n && p < 1;
        return (
          <g key={i} style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}>
            {/* resting halves: the new top behind the flap, the old bottom until the flap covers it */}
            <Half x={cx} ch={n} top cyan={cyan} />
            <Half x={cx} ch={flipping && p < 0.5 ? o : n} top={false} cyan={cyan} />
            {flipping && p < 0.5 ? <Half x={cx} ch={o} top cyan={cyan} k={Math.cos(p * Math.PI)} /> : null}
            {flipping && p >= 0.5 ? <Half x={cx} ch={n} top={false} cyan={cyan} k={-Math.cos(p * Math.PI)} /> : null}
            <rect x={cx} y={-2} width={CARD.w} height={4} fill="#08070C" />
            <rect x={cx - 5} y={-12} width={7} height={24} rx={3} fill="#4A4456" />
            <rect x={cx + CARD.w - 2} y={-12} width={7} height={24} rx={3} fill="#4A4456" />
          </g>
        );
      })}
      {/* the colon, blinking on the seconds */}
      {[-34, 34].map((dy) => (
        <circle key={dy} cx={digitX(1) + CARD.w + CARD.gap / 2 + CARD.colon / 2} cy={dy} r={11} fill={mix('#F6EFE3', PAL.cyan, cyan)} opacity={Math.floor(t / 15) % 2 ? 0.45 : 1} />
      ))}
    </g>
  );
};

/** HH:MM for a count of minutes (wraps at 24 h). */
const hhmm = (m: number) => {
  const mm = ((Math.round(m) % 1440) + 1440) % 1440;
  return `${String(Math.floor(mm / 60)).padStart(2, '0')}:${String(mm % 60).padStart(2, '0')}`;
};

export const ResetClock: React.FC<{ t: number; t0: number; x: number; y: number; s?: number }> = ({ t, t0, x, y, s = 1 }) => {
  const tt = t - t0;
  // 0..8 the flip to midnight, 9..30 the backward spin (24:00 -> 06:00), 31 the slam
  const spin = clamp((tt - 9) / 21);
  const mins = lerp(1440, 360, easeInOut(spin));
  const time = tt < 0 ? '23:59' : tt < 9 ? '00:00' : tt < 31 ? hhmm(mins) : '06:00';
  const cyan = tt < 9 ? 0 : tt < 31 ? 1 : clamp(1 - (tt - 31) / 12);
  const speed = tt >= 9 && tt < 31 ? Math.sin(spin * Math.PI) : 0;
  const slam = tt >= 31 ? 1 + 0.12 * Math.exp(-(tt - 31) / 3) * Math.cos((tt - 31) * 1.4) : 1;
  const label = easeOut(clamp((tt - 33) / 7));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {cyan > 0 ? <Glow x={0} y={0} r={520} kind="cool" o={0.5 * cyan} /> : null}
      <g transform={`scale(${slam}) translate(0 ${speed * Math.sin(t * 2.3) * 6})`}>
        <FlipClock x={0} y={0} time={time} from={tt < 9 ? '23:59' : undefined} flipAt={0} t={tt} cyan={cyan} blur={speed * 3.5} />
      </g>
      {/* motion streaks while it spins */}
      {speed > 0.05
        ? Array.from({ length: 10 }).map((_, k) => <rect key={k} x={-290 + k * 62} y={-100 + ((t * 37 + k * 53) % 120)} width={4} height={50 + 50 * speed} rx={2} fill={PAL.cyanSoft} opacity={0.22 * speed} />)
        : null}
      {tt >= 9 && tt < 34 ? <LoopIcon x={0} y={-215} r={44} t={t} spin={-26} /> : null}
      {label > 0 ? (
        <g transform={`translate(0 ${200 + (1 - label) * 30}) scale(${0.6 + 0.4 * backOut(label)})`} opacity={label}>
          <rect x={-170} y={-50} width={340} height={92} rx={46} fill={UI.pill} opacity={0.82} />
          <text x={0} y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill={UI.text} letterSpacing={3}>
            THỨ TƯ
          </text>
        </g>
      ) : null}
    </g>
  );
};

export const LoopIcon: React.FC<{ x: number; y: number; r?: number; t?: number; spin?: number; color?: string }> = ({ x, y, r = 40, t = 0, spin = -4, color = PAL.cyan }) => {
  // a 290-degree arc travelling anticlockwise from 230 deg to -60 deg, the arrow head at its end
  const a0 = (-60 * Math.PI) / 180;
  const a1 = (230 * Math.PI) / 180;
  const pt = (a: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  const tip = { x: Math.cos(a0) * r, y: Math.sin(a0) * r };
  const dir = { x: Math.sin(a0), y: -Math.cos(a0) }; // anticlockwise tangent
  const nrm = { x: Math.cos(a0), y: Math.sin(a0) };
  const h = r * 0.42;
  const wd = r * 0.32;
  return (
    <g transform={`translate(${x} ${y}) rotate(${t * spin})`} style={{ filter: `drop-shadow(0 0 ${r * 0.25}px ${color})` }}>
      <path d={`M ${pt(a1)} A ${r} ${r} 0 1 0 ${pt(a0)}`} stroke={color} strokeWidth={r * 0.22} fill="none" strokeLinecap="round" />
      <path d={`M ${tip.x + dir.x * h} ${tip.y + dir.y * h} L ${tip.x + nrm.x * wd} ${tip.y + nrm.y * wd} L ${tip.x - nrm.x * wd} ${tip.y - nrm.y * wd} Z`} fill={color} stroke={color} strokeWidth={r * 0.06} strokeLinejoin="round" />
    </g>
  );
};

export const DayCounter: React.FC<{ x: number; y: number; n: number; t?: number; s?: number }> = ({ x, y, n, t, s = 1 }) => {
  const label = `NGÀY #${fmtVN(n)}`;
  const w = 150 + label.length * 30;
  const pop = t === undefined ? 1 : backOut(clamp(t / 8));
  const o = t === undefined ? 1 : clamp(t / 3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`} opacity={o}>
      <rect x={-w / 2} y={-42} width={w} height={84} rx={42} fill={UI.pill} opacity={0.85} />
      <rect x={-w / 2} y={-42} width={w} height={84} rx={42} fill="none" stroke={PAL.cyan} strokeWidth={3} opacity={0.7} />
      <LoopIcon x={-w / 2 + 50} y={0} r={20} t={t ?? 0} spin={-3} />
      <text x={-w / 2 + 88} y={17} fontFamily={FONT.ui} fontWeight={700} fontSize={48} fill={UI.text} letterSpacing={2}>
        {label}
      </text>
    </g>
  );
};

