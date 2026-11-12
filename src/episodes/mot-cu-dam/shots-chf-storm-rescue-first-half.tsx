import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, walkPose, reachAngle, kf, clamp, easeOut, easeInOut, camT, LOOKS, Street, streetStand, Glow, ShotProps, LEG_LEN, basePose,
} from '../../engine';
import { Rain } from './storm-sky';
import { StormBack, FloodFront, Splash, TinSheet, TinHouse, WindDebris, GROUND } from './chf-storm-props';

// CHAPTER F, the typhoon night, first half: "Nên lần đầu tiên, bạn không đấm. Bạn chạy. Bạn giữ chặt mái tôn sắp bay."
// F1 the flooded street wide, F2 the fist drops (he does NOT punch), F3 he runs through floodwater, F4 a roof sheet
// lifts off a house with neighbours inside, F5 Pip pins it down.

const PIP = LOOKS.pipHood;
const frac = (v: number) => v - Math.floor(v);

// ---------- F1: the street under the typhoon, flooded; Pip small in the middle, looking up at the sky ----------
export const F1: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(0.4, 9.5, { low: 40 });
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.2, look: -0.4, headTilt: -4, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: len, p: { yaw: 0, look: 0, headTilt: 0, sway: 12 } },
  ]);
  const zoom = kf(t, [[0, 1.0], [len, 1.22]]);
  return (
    <g transform={camT(960, 560, zoom)}>
      <Street t={t + 120} id="f1" night veil={0.4} low={40} />
      <rect x={-300} y={655} width={2520} height={600} fill="#2E4A68" opacity={0.5} />
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={i} d={`M ${((i * 211 + t * (6 + (i % 4) * 3)) % 2200) - 150} ${690 + (i % 6) * 48} q 30 -7 60 0 t 60 0`} stroke="#CFE2FA" strokeWidth={3} fill="none" opacity={0.3} />
      ))}
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlue" shadow={0} />
      <rect x={-300} y={s.y + 300 * s.scale + 14} width={2520} height={600} fill="#2E4A68" opacity={0.45} />
      <WindDebris t={t} n={8} seed={5} />
      <Rain t={t} intensity={1.5} slant={0.5} />
    </g>
  );
};

// ---------- F2: medium: the fist that would have punched drops open; he turns toward the sound of the neighbours ----------
export const F2: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: GROUND - LEG_LEN * 1.05, scale: 1.05, yaw: 0.5, facing: 1, tilt: -6, armR: { a: 80, b: 60 }, armL: { a: 10, b: -8 }, look: 0.5, sway: 8 } },
    { f: 12, p: { armR: { a: 70, b: 70 }, tilt: -8 } },
    { f: 22, p: { armR: { a: 14, b: 14 }, tilt: 2, yaw: 0.2, look: 0.8, headTilt: 4 }, ease: easeOut },
    { f: len, p: { armR: { a: 10, b: 8 }, yaw: -0.15, look: -0.9 } },
  ]);
  const cx = kf(t, [[0, 960], [len, 1000]]);
  return (
    <g transform={camT(cx, 560, 1.5)}>
      <StormBack t={t + 30} id="f2" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'cool'], [12, 'worried']]) }} rimId="rimBlue" shadow={0} />
      <FloodFront t={t} />
      <WindDebris t={t} n={10} seed={9} />
      <Rain t={t} intensity={1.6} slant={0.5} />
    </g>
  );
};

// ---------- F3: he runs through the floodwater, the camera racing with him, splashes at every step ----------
export const F3: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 260], [len, 1420]], (v) => v);
  const ph = t * 0.85;
  const swing = Math.sin(ph);
  const pose = walkPose(x, ph, GROUND, 1.0, { tilt: 16, armL: { a: 60 * swing, b: 70 }, armR: { a: -60 * swing, b: 70 } });
  const sp = (k: number) => clamp((frac(ph / Math.PI - k) * 2.2));
  const cx = x + 220;
  return (
    <g transform={camT(cx, 590, 1.25)}>
      <StormBack t={t + 55} id="f3" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlue" shadow={0} />
      <Splash x={x + 30} y={GROUND - 20} p={sp(0)} s={1.3} seed={2} />
      <Splash x={x - 20} y={GROUND - 24} p={sp(0.5)} s={1.1} seed={6} />
      <FloodFront t={t} flow={1.8} />
      <WindDebris t={t} n={10} seed={13} />
      <Rain t={t} intensity={1.7} slant={0.55} />
    </g>
  );
};

// ---------- the house and its sheet, shared by F4 and F5 ----------
const HOUSE_X = 980;
const HOUSE_H = 165;
const EAVE = { x: HOUSE_X - 290, y: GROUND - HOUSE_H };
const TH = 22;

/** Where the free end of the sheet is: `lift` 0 flat on the house, 1 torn up and flapping. */
const sheetEnd = (lift: number, t: number) => ({
  x: HOUSE_X + 300 - 70 * lift,
  y: GROUND - HOUSE_H - 8 - 230 * lift + Math.sin(t * 1.7) * 14 * lift,
});

// ---------- F4: wide: the wind tears the corrugated roof up; neighbours in the lit window; Pip dashes in ----------
export const F4: React.FC<ShotProps> = ({ t, len }) => {
  const lift = kf(t, [[0, 0.25], [len - 4, 1]]);
  const x = kf(t, [[0, 2050], [len, 1480]], easeOut);
  const ph = t * 0.9;
  const pose = walkPose(x, ph, GROUND, 0.9, { tilt: -15, armL: { a: 55 * Math.sin(ph), b: 60 }, armR: { a: -55 * Math.sin(ph), b: 60 } }, -1);
  const b = sheetEnd(lift, t);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1100]]), 560, 1.0)}>
      <StormBack t={t + 80} id="f4" />
      <TinHouse x={HOUSE_X} t={t} h={HOUSE_H} />
      <TinSheet a={EAVE} b={b} th={TH} />
      <Glow x={HOUSE_X - 150} y={GROUND - 120} r={260} o={0.35} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlue" shadow={0} />
      <Splash x={x} y={GROUND - 18} p={clamp(frac(ph / Math.PI) * 2.2)} s={1.1} seed={3} />
      <FloodFront t={t} flow={1.4} />
      <WindDebris t={t} n={16} seed={21} />
      <Rain t={t} intensity={1.8} slant={0.6} />
    </g>
  );
};

// ---------- F5: close: both hands pin the sheet down; it shudders under his palms, the family inside is safe ----------
export const F5: React.FC<ShotProps> = ({ t, len }) => {
  const press = easeInOut(clamp(t / 8));
  const lift = 0.9 - 0.9 * press;
  const free = sheetEnd(lift, t);
  const hand = { x: free.x - 30, y: free.y - TH - 4 };
  const base: Pose = { ...basePose, x: HOUSE_X + 330, y: GROUND - LEG_LEN * 1.05, scale: 1.05, yaw: -0.45, facing: -1, tilt: -14 * press, legL: { a: -18, b: 10 }, legR: { a: 22, b: -4 }, sway: 10 };
  const a = reachAngle(base, hand);
  const pose: Pose = { ...base, armR: { a, b: 0 }, armL: { a: -a - 6, b: 0 }, look: -0.7 };
  const sh = Math.sin(t * 2.3) * 2.5 * press;
  return (
    <g transform={camT(HOUSE_X + 120, 500, 1.55)}>
      <StormBack t={t + 110} id="f5" />
      <TinHouse x={HOUSE_X} t={t} h={HOUSE_H} />
      <TinSheet a={EAVE} b={{ x: free.x, y: free.y + sh }} th={TH} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [10, 'neutral']]) }} rimId="rimBlue" shadow={0} />
      {/* rain splashes jumping off the sheet where his hands press it */}
      <Splash x={hand.x} y={hand.y + 6} p={clamp(((t * 0.12) % 1))} s={0.7} seed={4} />
      <FloodFront t={t} flow={1.2} />
      <WindDebris t={t} n={8} seed={31} />
      <Rain t={t} intensity={1.8} slant={0.6} />
    </g>
  );
};
