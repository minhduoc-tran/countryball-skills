import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, backOut, settle, camT, reachAngle, LOOKS, Glow, Bedroom, BEDROOM, stand, Phone, Dust, Foreground, ShotProps,
} from '../../engine';
import { GRANDMA } from '../khong-ai-ngheo/cast-looks';
import { StickyNote, Stubble } from './chc-note-and-object-props';
import { FlipCalendar, CountrySide, PorchChair, Leaves } from './chc-calendar-and-country-props';

// Chapter C, "5 grandma" (167.5-176.2 s), look "y10", quiet and gentle: C37 grandma's call rings unanswered, C38 Pip, with his bag
// packed, sticks THÁNG SAU on the calendar, C39 the month flips, then flips again, C40 grandma on her porch (wide, push-in),
// C41 her face turned to the gate, leaves falling, the gate empty.

const PIP = LOOKS.pipHood;
const G = GRANDMA;

// ---------- C37: the phone buzzes on a dark table: BÀ is calling; nobody picks up; a MAI LÀM note beside it ----------
export const C37: React.FC<ShotProps> = ({ t, len }) => {
  const buzz = 0.6 + 0.4 * Math.abs(Math.sin(t / 3));
  const ring = (i: number) => ((t / 18 + i / 3) % 1);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#241D2C" />
      <rect x={-400} y={800} width={2720} height={500} fill="#5B4038" />
      <rect x={-400} y={796} width={2720} height={8} fill="#7A5747" />
      <Glow x={960} y={520} r={760} o={0.4} />
      {[0, 1, 2].map((i) => <circle key={i} cx={960} cy={520} r={220 + ring(i) * 380} fill="none" stroke="#7FD4FF" strokeWidth={6} opacity={(1 - ring(i)) * 0.5} />)}
      <Phone x={960 + Math.sin(t * 2.7) * 4} y={540} w={330} rot={-4} on={1} caller="BÀ" buzz={buzz} f={t} />
      <StickyNote x={1330} y={640} lines={['MAI', 'LÀM']} s={0.8} rot={9} />
    </g>
  );
};

// ---------- C38: Pip (older) with a packed bag at his feet reaches up and sticks THÁNG SAU on the calendar ----------
export const C38: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.5, 0.34);
  const base: Pose = { ...basePose, x: s.x, y: s.y, scale: s.scale, yaw: 0.6, facing: 1, look: 0.7, headTilt: 3, armL: { a: 12, b: 6 } };
  const reach = easeOut(clamp((t - 4) / 10));
  const arm = reachAngle(base, { x: 1128, y: 585 });
  const pose: Pose = { ...base, armR: { a: 14 + (arm - 14) * reach, b: 6 * (1 - reach) }, ...faceAt(t, [[0, 'neutral'], [16, 'tired']]) };
  const slap = backOut(clamp((t - 14) / 6));
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1090]]), 570, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Bedroom t={t + 330} id="c38bd" lamp={1} crossed={0} />
      {/* the packed bag at his feet */}
      <g transform={`translate(${s.x - 90} ${s.y + 138 * s.scale})`}>
        <ellipse cx={0} cy={4} rx={70} ry={10} fill="#000" opacity={0.35} />
        <rect x={-62} y={-72} width={124} height={72} rx={16} fill="#3E8C86" stroke="#14121C" strokeWidth={4} />
        <path d="M -34 -72 Q 0 -112 34 -72" stroke="#14121C" strokeWidth={8} fill="none" /><path d="M -62 -36 H 62" stroke="#2F6E69" strokeWidth={5} />
      </g>
      <FlipCalendar x={1230} y={570} s={0.62} m={5} first={-1} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Stubble pose={pose} />
      {slap > 0 ? <StickyNote x={1320} y={470 + settle(t - 18, 6, 1.6, 5)} lines={['THÁNG', 'SAU']} s={0.4 * (1.8 - 0.8 * slap)} rot={-8 + (1 - slap) * 14} /> : null}
    </g>
  );
};

// ---------- C39: the month page flips, THÁNG 5 -> 6, and a moment later again, -> 7; the note stays stuck on the calendar ----------
export const C39: React.FC<ShotProps> = ({ t, len }) => {
  const m = 5 + clamp(t / 12) + clamp((t - 25) / 12);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#2A2234" />
      <Glow x={960} y={520} r={820} o={0.45} />
      <FlipCalendar x={960} y={580} s={1.45} m={m} first={-1} />
      <StickyNote x={1290 + Math.sin(t / 7) * 3} y={300 + settle(t - 4, 5, 1.8, 6) + settle(t - 28, 5, 1.8, 6)} lines={['THÁNG', 'SAU']} s={0.9} rot={8} />
      <Dust t={t} seed={9} x0={400} y0={120} w={1100} h={800} n={16} o={0.35} />
    </g>
  );
};

/** Grandma seated in profile on the porch chair at x, looking right toward the gate. */
const grandmaPose = (t: number, x: number): { pose: Pose; seatY: number } => {
  const S = 1.4;
  const hip = 800 - 68 * S - 8;
  return {
    seatY: hip + 58,
    pose: {
      ...basePose, x, y: hip, scale: S, yaw: 0.7, facing: 1, legL: { a: 82, b: -80 }, legR: { a: 78, b: -78 }, armL: { a: 14, b: 6 }, armR: { a: 18, b: 10 },
      headTilt: 2 + Math.sin(t / 26) * 1.5, look: 0.9, ...faceAt(t, [[0, 'neutral']]), blink: t % 70 > 66 ? 1 : 0,
    },
  };
};

// ---------- C40: wide on the porch: grandma sits on her chair, the yard and the gate beyond; leaves fall; a slow push-in ----------
export const C40: React.FC<ShotProps> = ({ t, len }) => {
  const { pose, seatY } = grandmaPose(t, 640);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <CountrySide t={t + 60} id="c40cs" />
      <PorchChair x={665} y={seatY} />
      <Leaves t={t + 40} n={10} x0={300} w={1300} seed={4} />
      <Hero look={G} pose={pose} rimId="rimR" shadow={0} />
      <Foreground blur={10}><ellipse cx={1900} cy={1000} rx={260} ry={200} fill="#24331F" opacity={0.8} /></Foreground>
    </g>
  );
};

// ---------- C41: closer: her face turned toward the gate; the camera drifts toward the empty gate; leaves keep falling ----------
export const C41: React.FC<ShotProps> = ({ t, len }) => {
  const { pose, seatY } = grandmaPose(t, 760);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1210]]), kf(t, [[0, 560], [len, 640]]), kf(t, [[0, 1.55], [len, 1.9]]))}>
      <CountrySide t={t + 100} id="c41cs" />
      <PorchChair x={785} y={seatY} />
      <Leaves t={t + 90} n={14} x0={400} w={1200} seed={6} />
      <Hero look={G} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <Leaves t={t + 30} n={3} x0={1000} w={600} seed={8} />
    </g>
  );
};
