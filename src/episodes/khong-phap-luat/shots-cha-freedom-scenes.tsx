import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Street, streetStand, joints, toWorld, Glow, Sparkle, ShotProps, proj, propScale,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { Rider, SpeedLines, WheelDust } from './cha-bike-rider-and-speed-props';
import { TrafficFlow, Biker } from './cha-street-traffic-and-walkers-props';
import { Timetable, PaperBits } from './cha-timetable-and-paper-props';
import { WORKER } from '../khong-ai-ngheo/cast-looks';
import { OWNER } from './cha-shop-and-milk-props';

// Chapter A, hour one, the fun part: Pip spreads his arms in the empty-minded freedom (A19), Mo opens the throttle
// (A20, A21), Pip tears up his extra-class timetable (A22, A23) and both laugh (A24).

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;

const FUN: Biker[] = [
  { Z: 9, X0: -9, v: 0.16, look: WORKER, color: '#3E6A8A' },
  { Z: 11.5, X0: 5, v: -0.14, look: OWNER, color: '#EDE6D6' },
  { Z: 14, X0: -2, v: 0.12, look: LOOKS.mom, color: '#D9A441' },
];

// ---------- A19: medium, Pip in the middle of the road, arms wide, face up; scooters whizz past behind him ----------
export const A19: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(0.1, 4.2);
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.15, look: 0, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 } } },
    { f: 10, p: { armL: { a: 150, b: 8 }, armR: { a: 150, b: 8 }, headTilt: -8, squash: -0.04 }, ease: easeOut },
    { f: 24, p: { armL: { a: 128, b: 6 }, armR: { a: 128, b: 6 }, headTilt: 6, squash: 0.03 } },
    { f: 40, p: { armL: { a: 150, b: 8 }, armR: { a: 150, b: 8 }, headTilt: -6, squash: -0.03 } },
    { f: 60, p: { armL: { a: 132, b: 8 }, armR: { a: 132, b: 8 }, headTilt: 4, squash: 0.02 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), 600, kf(t, [[0, 1.8], [len, 2.0]]))}>
      <Street t={t + 300} id="sa19" />
      <TrafficFlow t={t * 1.6 + 20} bikers={FUN} />
      <Hero look={PIP} pose={{ ...pose, sway: 14 * Math.sin(t / 5), ...faceAt(t, [[0, 'neutral'], [8, 'happy']]) }} rimId="rimR" shadow={0} />
      <Sparkle x={s.x + 150} y={s.y - 120} t={t - 10} s={0.8} />
      <Sparkle x={s.x - 160} y={s.y - 60} t={t - 22} s={0.7} />
    </g>
  );
};

// ---------- A20: wide, Mo opens the throttle and rips across the road, cheering ----------
export const A20: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 4.6;
  const sc = propScale(Z);
  const g = proj(0, 0, Z);
  const x = kf(t, [[0, 2150], [len, -250]], (v) => v);
  return (
    <g transform={camT(960, 560, 1.2)}>
      <Street t={t + 100} id="sa20" />
      <WheelDust x={x + 100 * sc} y={g.y} t={t} dir={-1} s={sc * 1.3} />
      <Rider look={MO} x={x} y={g.y} s={sc} facing={-1} t={t} color="#2FA595" expr="happy" arms="up" lean={18} />
      <SpeedLines x={x + 180 * sc} y={g.y - 90 * sc} t={t} dir={-1} w={700} h={200 * sc} n={12} seed={12} />
    </g>
  );
};

// ---------- A21: close-up, Mo hunched over the bars, shades on, curls streaming, the street a blur ----------
export const A21: React.FC<ShotProps> = ({ t, len }) => {
  const s = 4.0;
  const slide = ((t * 34) % 640);
  const pose = { x: 0, y: 0 };
  void pose;
  return (
    <g>
      <g filter="url(#blur10)" transform={`translate(${slide} 0)`}>
        <g transform="translate(-700 -150) scale(1.5)"><Street t={t + 160} id="sa21" /></g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0814" opacity={0.15} />
      <g transform={camT(kf(t, [[0, 940], [len, 980]]), 520, 1.0)}>
        <Rider look={{ ...MO }} x={900} y={1180} s={s} facing={1} t={t} color="#2FA595" expr="cool" arms="bars" lean={22} />
        <SpeedLines x={560} y={520} t={t} w={900} h={900} n={18} seed={21} />
      </g>
    </g>
  );
};

// ---------- A22: medium, Pip holds up the extra-class timetable and announces he is done with it ----------
export const A22: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(0.0, 4.0);
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.35, look: 0.3, armL: { a: 12, b: 8 }, armR: { a: 20, b: 10 } } },
    { f: 8, p: { armR: { a: 135, b: 25 }, headTilt: -4, tilt: -2 }, ease: easeOut },
    { f: 30, p: { armR: { a: 128, b: 25 }, armL: { a: 40, b: 30 }, headTilt: 3 } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 560, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Street t={t + 340} id="sa22" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [8, 'smug']]) }} rimId="rimR" shadow={0} />
      <Timetable id="sa22t" x={hand.x + 70} y={hand.y - 160} s={0.4} rot={kf(t, [[0, 10], [len, -4]])} />
      <Glow x={hand.x + 60} y={hand.y - 150} r={170} kind="warm" o={0.2} />
    </g>
  );
};

// ---------- A23: insert, two mittens rip the timetable in half and the pieces fly ----------
export const A23: React.FC<ShotProps> = ({ t, len }) => {
  const rip = clamp((t - 10) / 10);
  const shake = rip > 0 && rip < 1 ? Math.sin(t * 4) * 5 : 0;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#2E2744" />
      <Glow x={960} y={520} r={760} kind="warm" o={0.35} />
      <g transform={`translate(${shake} 0)`}>
        <Timetable id="sa23t" x={960} y={540} s={1.7} rot={-4 + 6 * rip} tear={rip} />
      </g>
      <InsertArm x={kf(t, [[0, 640], [10, 760]]) - 190 * easeOut(rip)} y={400 + 60 * rip} fx={-200} fy={900} rot={-30} s={4.8} fist />
      <InsertArm x={kf(t, [[0, 1280], [10, 1160]]) + 190 * easeOut(rip)} y={400 + 60 * rip} fx={2120} fy={900} rot={30} s={4.8} fist />
      <PaperBits x={960} y={540} k={t - 14} />
    </g>
  );
};

// ---------- A24: medium, Pip and Mo double over laughing, bouncing ----------
export const A24: React.FC<ShotProps> = ({ t, len }) => {
  const a = streetStand(-0.8, 3.7);
  const b = streetStand(0.85, 3.7);
  const bounce = (ph: number) => Math.abs(Math.sin(t / 3.2 + ph));
  const mk = (st: ReturnType<typeof streetStand>, ph: number, yaw: number) => ({
    ...poseAt(t, [{ f: 0, p: { x: st.x, y: st.y, scale: st.scale, yaw, headTilt: -8, tilt: -4, armL: { a: 40, b: 40 }, armR: { a: 40, b: 40 } } }]),
    y: st.y - 16 * bounce(ph) * st.scale * 2,
    headTilt: -10 + 6 * Math.sin(t / 3.2 + ph), squash: 0.04 * (1 - bounce(ph)), sway: 14 * Math.sin(t / 3.2 + ph),
  });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), 600, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Street t={t + 380} id="sa24" />
      <Hero look={PIP} pose={{ ...mk(a, 0, 0.45), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...mk(b, 1.3, -0.45), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <Sparkle x={a.x - 80} y={a.y - 240} t={t - 4} s={0.8} />
      <Sparkle x={b.x + 90} y={b.y - 260} t={t - 12} s={0.8} />
    </g>
  );
};

