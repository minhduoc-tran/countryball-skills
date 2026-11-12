import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LightVeil, Glow, Dust, Phone, WallCalendar, calendarDay, WallTexture,
  Bedroom, BedDuvet, bedSit, LAMP, WINDOW, joints, toWorld, FONT, ShotProps,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';
import { Candle, BigPhone, BatteryIcon } from './che-night-props';

// Chapter E, "friend": every night he calls his best friend and nobody picks up (E1, E2); then the phone dies, the
// outlet is dead too (E3, E4), and he stares at the black screen (E5). Power is off: candle, phone glow, moon.

const PIP = LOOKS.pipHood;
const NIGHT_WALL = '#262B48';

// ---------- E1: wide-ish, Pip in bed at night, phone ringing in his hand, candle on the nightstand ----------
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.2);
  const ring = t % 30 < 18 ? 1 : 0;
  const pose = poseAt(t, [
    { f: 0, p: { ...sit, yaw: 0.45, look: 0.5, facing: 1, armL: { a: 12, b: -6 }, armR: { a: 128, b: 52 }, legL: { a: 78, b: -6 }, legR: { a: 74, b: -6 }, headTilt: 3, handR: 'open' } },
    { f: 22, p: { headTilt: -2, look: 0.7 } },
    { f: 40, p: { headTilt: 2, look: 0.3 } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const candle = { x: LAMP.x + 70, y: LAMP.y + 150 };
  return (
    <g transform={camT(kf(t, [[0, 850], [len, 830]]), kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.45], [len, 1.62]]))}>
      <Bedroom t={t + 40} id="e1bd" duvet={false} lamp={0} clock="" crossed={27} veil={0.2} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [26, 'tired']]) }} rimId="rimBlue" shadow={0} />
      <BedDuvet knees={0.7} />
      <Phone x={hand.x + 6} y={hand.y - 22} w={58} rot={8} on={1} caller="BẠN THÂN" buzz={ring} f={t} />
      <Glow x={hand.x} y={hand.y - 10} r={200} kind="cool" o={0.55 + 0.2 * ring} />
      <Candle x={candle.x} y={candle.y} s={0.5} t={t} />
      {/* the candle and the moon are all the light: sink everything else */}
      <LightVeil id="e1veil" lights={[[candle.x, candle.y - 60, 330], [hand.x, hand.y, 240], [(WINDOW.x0 + WINDOW.x1) / 2, 480, 190]]} o={0.62} />
      <Glow x={candle.x} y={candle.y - 70} r={220} o={0.5} />
      <Dust t={t} seed={5} x0={candle.x - 200} y0={candle.y - 260} w={400} h={260} n={16} o={0.5} />
    </g>
  );
};

// ---------- E2: the wall calendar by candlelight: his marker crosses three more nights, one after another ----------
const CAL2 = { x: 1000, y: 40, w: 660 };
const NIGHTS = [
  { day: 28, move: [0, 4], draw: [4, 10] },
  { day: 29, move: [10, 13], draw: [13, 19] },
  { day: 30, move: [19, 22], draw: [22, 28] },
];
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const done = NIGHTS.filter((n) => t >= n.draw[1]).length;
  const cur = NIGHTS[Math.min(done, NIGHTS.length - 1)];
  const drawing = done >= NIGHTS.length ? 0 : clamp((t - cur.draw[0]) / (cur.draw[1] - cur.draw[0]));
  const p = (d: number) => calendarDay(CAL2.x, CAL2.y, CAL2.w, d);
  const hx = kf(t, [[0, p(27).x + 90], [4, p(28).x], [10, p(28).x], [13, p(29).x], [19, p(29).x], [22, p(30).x], [30, p(30).x], [40, p(30).x + 180]], easeOut);
  const hy = kf(t, [[0, p(27).y + 60], [4, p(28).y], [10, p(28).y], [13, p(29).y], [19, p(29).y], [22, p(30).y], [30, p(30).y], [40, p(30).y + 220]], easeOut);
  return (
    <g transform={`translate(1000 540) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-1000 -540)`}>
      <rect x={-200} y={-200} width={2400} height={1500} fill={NIGHT_WALL} />
      <WallTexture rect={[-200, -200, 2400, 1500]} />
      <WallCalendar x={CAL2.x} y={CAL2.y} w={CAL2.w} crossed={27 + done} drawing={drawing} />
      <Candle x={260} y={960} s={1.7} t={t + 20} />
      <LightVeil id="e2veil" lights={[[300, 700, 640], [1000, 500, 420]]} o={0.7} />
      <Dust t={t} seed={9} x0={100} y0={300} w={700} h={700} n={26} o={0.5} />
      {/* his mitten with a red marker */}
      <g>
        <InsertArm x={hx} y={hy} fx={hx + 420} fy={hy + 620} rot={-28} s={2.6} width={92} fist />
        <g transform={`translate(${hx} ${hy}) rotate(-28)`}>
          <rect x={-9} y={-6} width={18} height={92} rx={6} fill="#D93A3A" stroke="#4A1214" strokeWidth={3} transform="translate(-6 -18) rotate(8)" />
          <circle cx={-8} cy={-6} r={4} fill="#FFB0A0" />
        </g>
      </g>
    </g>
  );
};

// ---------- E3: the phone in his hand: 1% in red, then it dies ----------
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const die = 46;
  const alive = t < die ? 1 : 0;
  const blink = t < die ? (Math.floor(t / 5) % 2 ? 0.35 : 1) : 0;
  const collapse = clamp((t - die) / 4);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#0C0D1A" />
      <g filter="url(#blur16)">
        <Glow x={300} y={800} r={500} o={0.4} />
        <Glow x={1700} y={300} r={320} kind="cool" o={0.18} />
      </g>
      <BigPhone x={940} y={560} w={430} rot={-6} lit={alive} id="e3ph">
        {alive || collapse < 1 ? (
          <g>
            <rect x={-100} y={-200} width={200} height={400} fill="#14182A" opacity={alive ? 1 : 0} />
            <text x={0} y={-110} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#C8D2F0" opacity={alive ? 1 : 0}>PIN YẾU</text>
            <BatteryIcon x={0} y={-10} pct={1} s={1.5} blink={alive ? blink : 0} />
            {/* the screen collapses to a bright line, then nothing */}
            {t >= die ? <rect x={-100} y={-3 - 200 * (1 - collapse)} width={200} height={6 + 400 * (1 - collapse)} fill={collapse < 1 ? '#DCE4FF' : '#05050A'} opacity={collapse < 1 ? 0.9 : 1} /> : null}
          </g>
        ) : null}
      </BigPhone>
      {/* his mitten holding it from below */}
      <InsertArm x={1030} y={890} fx={1500} fy={1260} rot={-35} s={3.8} width={110} />
      {t >= die ? <Glow x={400} y={900} r={420} o={0.35} /> : null}
    </g>
  );
};

// ---------- E4: a wall outlet, a dead charger plugged in; his mitten wiggles the plug: nothing ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const jig = t > 12 && t < 24 ? Math.sin((t - 12) * 1.9) * 7 : 0;
  const hand = { x: kf(t, [[0, 1500], [10, 960], [24, 960], [34, 1500]], easeOut), y: kf(t, [[0, 1100], [10, 560], [24, 560], [34, 1100]], easeOut) };
  const sway = Math.sin(t / 10) * 12;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.1]])}) translate(-960 -540)`}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#2A2E4C" />
      <WallTexture rect={[-200, -200, 2400, 1500]} />
      <rect x={-200} y={960} width={2400} height={240} fill="#20182A" />
      <rect x={-200} y={950} width={2400} height={14} fill="#3A3048" />
      {/* the outlet plate and, above it, a light switch, both off */}
      <rect x={700} y={290} width={300} height={400} rx={30} fill="#E4E0D6" stroke="#B5AFA0" strokeWidth={5} />
      <rect x={1086} y={420} width={110} height={170} rx={20} fill="#E4E0D6" stroke="#B5AFA0" strokeWidth={5} />
      <rect x={1110} y={440} width={62} height={60} rx={8} fill="#CFC9BA" />
      <rect x={700} y={290} width={300} height={10} rx={5} fill="#FFFFFF" opacity={0.4} />
      {[[790, 400], [910, 400]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={22} height={64} rx={8} fill="#2A2630" />
          <rect x={x + 54} y={y} width={22} height={64} rx={8} fill="#2A2630" />
          <circle cx={x + 38} cy={y + 110} r={13} fill="#2A2630" />
        </g>
      ))}
      <rect x={700} y={500} width={300} height={190} fill="#E4E0D6" opacity={0} />
      {/* the charger: a white block in the lower socket, a cable swaying down and out of frame */}
      <g transform={`translate(${jig} 0)`}>
        <rect x={776} y={522} width={148} height={130} rx={18} fill="#F2F0EA" stroke="#B5AFA0" strokeWidth={5} />
        <rect x={776} y={522} width={148} height={14} rx={7} fill="#FFFFFF" opacity={0.7} />
        <rect x={800} y={606} width={100} height={26} rx={9} fill="#CFC9BA" />
        <circle cx={850} cy={570} r={9} fill="#3A3640" />
      </g>
      <path d={`M ${850 + jig} 652 C ${850 + sway} 800 ${1000 - sway} 860 ${1160 + sway * 2} 1160`} stroke="#14121A" strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={`M ${850 + jig} 652 C ${850 + sway} 800 ${1000 - sway} 860 ${1160 + sway * 2} 1160`} stroke="#EDE9DE" strokeWidth={20} fill="none" strokeLinecap="round" />
      <Candle x={1560} y={900} s={1.5} t={t + 8} />
      <LightVeil id="e4veil" lights={[[1500, 700, 620], [850, 500, 300]]} o={0.68} />
      <Dust t={t} seed={4} x0={1000} y0={300} w={700} h={600} n={22} o={0.5} />
      <InsertArm x={hand.x} y={hand.y} fx={hand.x + 380} fy={hand.y + 660} rot={-30} s={4.2} width={118} />
    </g>
  );
};

// ---------- E5: close on the black screen: his face reflected in it, faint, a long hold, a slow push-in; one false flicker ----------
export const E5: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.95;
  const flick = t >= 66 && t < 80 ? Math.sin(((t - 66) / 14) * Math.PI) : 0;
  const pose: Pose = {
    ...poseAt(t, [
      { f: 0, p: { x: 0, y: -10 + 176 * s, scale: s, yaw: 0.05, look: 0.0, headTilt: 2, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 } } },
      { f: 40, p: { headTilt: -2 } },
      { f: 80, p: { headTilt: 1 } },
    ]),
    ...faceAt(t, [[0, 'tired'], [66, 'shock'], [82, 'tired']]),
  };
  if (t % 46 > 41) pose.blink = 1;
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 530]]), kf(t, [[0, 1.0], [len, 1.5]]))}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#0A0B16" />
      <g filter="url(#blur16)">
        <Glow x={160} y={820} r={420} o={0.4} />
        <Glow x={1760} y={160} r={300} o={0.25} />
        <circle cx={1500} cy={850} r={70} fill="#FFB060" opacity={0.25} />
      </g>
      <BigPhone x={960} y={540} w={470} rot={-3} lit={flick} id="e5ph">
        <g>
          {/* the reflection: dim, a head and shoulders, the screen's gloss across it */}
          <g opacity={0.62}>
            <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
          </g>
          <rect x={-100} y={-210} width={200} height={420} fill="#05050A" opacity={0.38} />
          <path d="M -100 -210 L 10 -210 L -100 20 Z" fill="#FFFFFF" opacity={0.07} />
          <rect x={-100} y={-210} width={200} height={420} fill="#7FA6FF" opacity={0.5 * flick} />
        </g>
      </BigPhone>
    </g>
  );
};
