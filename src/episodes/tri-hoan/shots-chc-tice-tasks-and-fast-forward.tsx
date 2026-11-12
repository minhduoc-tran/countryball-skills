import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, easeIn, backOut, settle, shake, camT, LOOKS, Glow, Bedroom, BEDROOM, stand, TapeLines, FONT, SCH, ShotProps,
} from '../../engine';
import { StickyNote, TaskBox, INK } from './chc-note-and-object-props';
import { CardFrame } from './chc-chart-props';
import { FlipCalendar } from './chc-calendar-and-country-props';

// Chapter C, "4 tice" part 2 and "5 life": C9 task boxes get pushed along a timeline (none disappears), C10 they all pile into the
// last day, C11-C13 the VCR fast-forward: Pip's room, a calendar spinning with the MAI LÀM note riding it, slowing to a stop.

const LANE_Y = 760;
const slotX = (i: number) => 380 + i * 192;
const BOX_COL = ['#F6EFE3', '#BFE3F0', '#F9E7C0', '#E8D4F2', '#CDEBD3'];

/** The timeline: a bar with seven day posts and a red flag on the last day (the deadline). */
const Timeline: React.FC<{ t: number; shakeX?: number }> = ({ t, shakeX = 0 }) => (
  <g>
    <rect x={slotX(0) - 100} y={LANE_Y + 62} width={slotX(6) - slotX(0) + 200} height={18} rx={9} fill="#fff" opacity={0.16} />
    {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M ${slotX(i)} ${LANE_Y + 62} v 40`} stroke={SCH.dim} strokeWidth={5} strokeLinecap="round" />)}
    <g transform={`translate(${slotX(6) + 96 + shakeX} ${LANE_Y + 62})`}>
      <path d="M 0 0 V -300" stroke={SCH.line} strokeWidth={8} strokeLinecap="round" />
      <path d={`M 0 -300 L 150 -${268 + 8 * Math.sin(t / 3)} L 0 -230 Z`} fill="#FF5A4A" />
      <text x={20} y={-253} fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#fff" letterSpacing={2}>HẠN</text>
    </g>
  </g>
);

// ---------- C9: five task boxes; each "tomorrow" pushes them one day along, a MAI LÀM note flicks on the front one; none vanishes ----------
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const push = (a: number) => easeOut(clamp((t - a) / 9));
  const shift = push(8) + push(28);
  return (
    <CardFrame t={t} len={len} id="c9tl" cx={960} cy={640} z0={1.3} z1={1.38}>
      <Timeline t={t} />
      {BOX_COL.map((c, i) => {
        const idx = 4 - i; // box 0 starts at the right of the group
        const x = slotX(idx + shift);
        return <TaskBox key={i} x={x} y={LANE_Y + 6 - settle(t - 14 - i, 3)} s={1.12} color={c} rot={(i - 2) * 1.5} />;
      })}
      {[8, 28].map((a, k) => {
        const p = backOut(clamp((t - a - 2) / 6)) * (1 - clamp((t - a - 14) / 6));
        return p > 0 ? <StickyNote key={k} x={slotX(2 + k * 2) + 20} y={LANE_Y - 150 - 30 * p} lines={['MAI', 'LÀM']} s={0.55 * p} rot={-6 + k * 10} /> : null;
      })}
    </CardFrame>
  );
};

// ---------- C10: the boxes sprint along the days and crash into the last one: a pile against the deadline flag ----------
export const C10: React.FC<ShotProps> = ({ t, len }) => {
  const sh = shake(t, 36, 16, 12);
  const hits = [10, 19, 28, 36, 44];
  return (
    <CardFrame t={t} len={len} id="c10tl" cx={kf(t, [[0, 1000], [len, 1200]])} cy={600} z0={1.3} z1={1.5}>
      <g transform={`translate(${sh.x} ${sh.y})`}>
        <Timeline t={t} shakeX={settle(t - 36, 8)} />
        {BOX_COL.map((c, i) => {
          const from = slotX(2 + (4 - i));
          const hit = hits[i];
          const k = easeIn(clamp((t - 2 - i * 3) / (hit - 2 - i * 3)));
          const stackY = LANE_Y + 6 - i * 66;
          const wob = settle(t - hit, 6 + i * 1.5, 1.6, 7);
          const x = from + (slotX(6) - from) * k + wob;
          const y = stackY - (1 - Math.min(1, k * 1.0)) * 0 + Math.abs(settle(t - hit, 14, 1.3, 5)) * (t > hit ? 0.5 : 0);
          const squash = t > hit && t < hit + 5 ? 1 - 0.12 * Math.sin(((t - hit) / 5) * Math.PI) : 1;
          return <g key={i} transform={`translate(${x} ${y}) scale(1.12 ${1.12 * squash}) translate(${-x} ${-y})`}><TaskBox x={x} y={y} s={1.12} color={c} rot={(i % 2 ? 5 : -4) * (t > hit ? 1 : 0)} /></g>;
        })}
        {t > 44 ? <StickyNote x={slotX(6) + 130} y={LANE_Y - 260} lines={['MAI', 'LÀM']} s={0.5} rot={14} /> : null}
      </g>
      {t > 44 && t < 50 ? <rect x={-400} y={-400} width={3000} height={2000} fill="#FFF3DC" opacity={0.28} /> : null}
    </CardFrame>
  );
};

// ---------- the fast-forward tape chip ----------
const FfChip: React.FC<{ t: number }> = ({ t }) => (
  <g transform="translate(96 130)">
    <rect x={0} y={-56} width={310} height={92} rx={20} fill="#0B0816" opacity={0.72} />
    {[0, 1].map((i) => <path key={i} transform={`translate(${46 + i * 44} -10)`} d="M -16 -26 L 22 0 L -16 26 Z" fill={(Math.floor(t / 4) + i) % 3 === 0 ? '#FFE27A' : '#F6EFE3'} />)}
    <text x={136} y={10} fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill="#F6EFE3" letterSpacing={3}>TUA NHANH</text>
  </g>
);

const PIP = LOOKS.pipHood;
const pipAt = (t: number, extra: Partial<Pose> = {}): Pose => {
  const s = stand(BEDROOM, 0.4, 0.34);
  return { ...basePose, x: s.x, y: s.y, scale: s.scale, yaw: 0.5, facing: 1, look: 0.6, ...extra, ...faceAt(t, [[0, 'neutral'], [14, 'worried']]) };
};

// ---------- C11: the room; Pip stands and watches the wall calendar start to spin (tape lines, chip) ----------
export const C11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 940], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Bedroom t={t + 90} id="c11bd" lamp={1} crossed={0} />
      <Hero look={PIP} pose={pipAt(t, { armR: { a: 20 + 16 * Math.sin(t / 3), b: 10 } })} rimId="rimR" shadow={0} />
      <FlipCalendar x={1230} y={560} s={0.8} m={t * 0.34} lin />
      <StickyNote x={1350 + Math.sin(t * 0.8) * 4} y={385 + Math.cos(t * 1.1) * 4} lines={['MAI', 'LÀM']} s={0.52} rot={-6 + Math.sin(t * 0.9) * 5} />
    </g>
    <TapeLines f={t} /><FfChip t={t} />
  </g>
);

// ---------- C12: close on the calendar, spinning faster; the MAI LÀM note rides on it, flapping ----------
export const C12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, kf(t, [[0, 1.3], [len, 1.7]]))}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#2A2438" />
      <Glow x={960} y={520} r={760} o={0.4} />
      <FlipCalendar x={960} y={560} s={1.25} m={t * 0.55} lin />
      <StickyNote x={1210 + Math.sin(t * 1.3) * 6} y={330 + Math.cos(t * 1.5) * 8} lines={['MAI', 'LÀM']} s={0.85} rot={-4 + Math.sin(t * 1.2) * 9} />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${240 + i * 30} ${240 + i * 110} h ${160 + ((t * 40 + i * 70) % 220)}`} stroke="#fff" strokeWidth={4} opacity={0.14} strokeLinecap="round" />)}
    </g>
    <TapeLines f={t * 1.5} /><FfChip t={t} />
  </g>
);

// ---------- C13: the spin brakes to a stop on the last page while the camera drives in ("cả cuộc đời?") ----------
export const C13: React.FC<ShotProps> = ({ t, len }) => {
  const m = 18 * easeOut(clamp(t / (len - 2)));
  const z = kf(t, [[0, 1.5], [len, 2.4]]);
  return (
    <g>
      <g transform={camT(1000, 470, z)}>
        <rect x={-600} y={-600} width={3200} height={2400} fill="#2A2438" />
        <Glow x={960} y={520} r={800} o={0.4} />
        <FlipCalendar x={960} y={560} s={1.25} m={m} lin={m < 17} />
        <StickyNote x={1210} y={330 + settle(t - (len - 8), 10)} lines={['MAI', 'LÀM']} s={0.85} rot={-4 + Math.sin(t * 1.2) * 9 * (1 - easeOut(clamp(t / len)))} />
      </g>
      <TapeLines f={t * 1.2} /><FfChip t={t} />
      <rect width={1920} height={1080} fill="#fff" opacity={0.5 * clamp((t - (len - 3)) / 3)} />
    </g>
  );
};
