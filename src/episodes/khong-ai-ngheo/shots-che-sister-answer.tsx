import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Dust, Sparkle, ShotProps,
} from '../../engine';
import { KitchenNight, KitchenFront, SPOT } from './che-kitchen-night-scene';
import { PhoneChat, FamilyPainting, LaughMarks } from './che-home-and-family-props';

// Chapter E, "sister" part two (212.5-215.9 s): E8 Mo's message lands, E9 his first painting, E10 Pip turns to his
// sister, E11 close-up "Không.", E12 "Nhà mình đủ." and the hug.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const MOM = LOOKS.mom;

const mum = (t: number): Pose => ({
  ...basePose, ...SPOT.mum, yaw: 0.35, facing: 1, headTilt: 3 * Math.sin(t / 7), armL: { a: 14, b: -6 }, armR: { a: 40 + 14 * Math.sin(t / 6), b: 40 },
});

// ---------- E8: insert: a phone on the island lights up, Mo's name slides in, the picture bubble pops ----------
export const E8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 960]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <g filter="url(#blur16)">
      <KitchenNight t={t + 210} id="e8k" />
      <KitchenFront t={t} seed={18} />
    </g>
    <rect x={-100} y={-100} width={2120} height={1280} fill="#1A1020" opacity={0.25} />
    <PhoneChat x={960} y={560} s={1.25} rot={-6} p={clamp((t - 2) / 22)} t={t} />
  </g>
);

// ---------- E9: the painting itself, big and wobbly, a few sparkles: the first one he ever made ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 2) / 12));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g filter="url(#blur16)">
        <KitchenNight t={t + 240} id="e9k" />
        <KitchenFront t={t} seed={19} />
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#1A1020" opacity={0.3} />
      <Glow x={960} y={540} r={760} o={0.5} />
      <FamilyPainting x={960} y={540} s={(1.9 + 0.3 * k) } rot={-2 + Math.sin(t / 14) * 1.2} />
      <Sparkle x={620} y={290} t={t - 6} s={1.1} />
      <Sparkle x={1310} y={760} t={t - 22} s={0.9} />
      <Sparkle x={1330} y={310} t={t - 40} s={0.8} />
    </g>
  );
};

// ---------- E10: Pip turns from the island to his sister; his face softens ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { ...SPOT.pip, yaw: 0.0, facing: -1, look: 0.6, headTilt: -3, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 18, p: { yaw: -0.6, look: -0.5, headTilt: 3 }, ease: easeOut },
  ]);
  const sis: Pose = { ...basePose, ...SPOT.sis, x: SPOT.sis.x + 30, yaw: 0.6, facing: 1, headTilt: 5, sway: 3, armL: { a: 10, b: -4 }, armR: { a: 10, b: -4 } };
  return (
    <g transform={camT(kf(t, [[0, 1130], [len, 1090]]), SPOT.pip.y - 110, kf(t, [[0, 1.7], [len, 1.95]]))}>
      <KitchenNight t={t + 270} id="e10k" />
      <Hero look={MOM} pose={{ ...mum(t), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <KitchenFront t={t} seed={20} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.5} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [16, 'happy']]) }} rimId="rimL" shadow={0.5} />
    </g>
  );
};

// ---------- E11: warm close-up: "Không." a small shake of the head, eyes soft ----------
export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const hx = SPOT.pip.x - 6;
  const hy = SPOT.pip.y - 205;
  const shake = kf(t, [[0, 0], [5, -5], [10, 4], [16, -2], [len, 0]]);
  return (
    <g transform={camT(kf(t, [[0, hx - 20], [len, hx - 4]]), hy + 10, kf(t, [[0, 4.4], [len, 4.9]]))}>
      <g filter="url(#blur6)">
        <KitchenNight t={t + 300} id="e11k" />
        <KitchenFront t={t} seed={21} />
      </g>
      <Hero look={PIP} pose={{ ...basePose, ...SPOT.pip, yaw: -0.35, facing: -1, headTilt: shake, look: -0.3, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <Glow x={hx} y={hy} r={380} o={0.35} />
    </g>
  );
};

// ---------- E12: "Nhà mình đủ." her arms around his waist, his hand on her head; mum laughs behind them ----------
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const run = easeOut(clamp(t / 12));
  const sx = SPOT.pip.x - 110 + 56 * run;
  const pip: Pose = { ...basePose, ...SPOT.pip, yaw: -0.45, facing: -1, headTilt: 3 + 2 * Math.sin(t / 12), armL: { a: 30 + 30 * run, b: 80 }, armR: { a: 10, b: -6 } };
  const sis: Pose = {
    ...basePose, ...SPOT.sis, x: sx, y: SPOT.sis.y + 4, yaw: 0.55, facing: 1, headTilt: -4 - 3 * run, sway: 4,
    armL: { a: 14, b: 6 }, armR: { a: 58 + 24 * run, b: 26 },
  };
  return (
    <g transform={camT(kf(t, [[0, SPOT.pip.x - 110], [len, SPOT.pip.x - 80]]), SPOT.pip.y - 150, kf(t, [[0, 1.6], [len, 2.1]]))}>
      <KitchenNight t={t + 330} id="e12k" />
      <Hero look={MOM} pose={{ ...mum(t), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <KitchenFront t={t} seed={22} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <LaughMarks x={SPOT.mum.x + 56} y={SPOT.mum.y - 250} t={t} s={0.7} />
      <Sparkle x={SPOT.pip.x - 40} y={SPOT.pip.y - 360} t={t - 16} s={1.1} />
      <Dust t={t} seed={8} x0={SPOT.pip.x - 300} y0={SPOT.pip.y - 450} w={500} h={400} n={16} o={0.5} />
    </g>
  );
};
