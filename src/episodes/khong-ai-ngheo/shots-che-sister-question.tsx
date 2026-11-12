import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, camT, LOOKS, Glow, Dust, Foreground, FONT, backOut, toWorld, joints, ShotProps,
} from '../../engine';
import { KitchenNight, KitchenFront, SPOT } from './che-kitchen-night-scene';
import { NewBooks, LaughMarks } from './che-home-and-family-props';

// Chapter E, "sister" (202.0-212.5 s): the kitchen at night. E1 wide, E2 sis asks (medium), E3 her face (close, "?"),
// E4 Pip looks around, E5 mum laughing, E6 the xôi pot still steaming (insert), E7 sis with her new books.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const MOM = LOOKS.mom;

/** Pose helpers: each person's idle at their spot (breathing sway). */
const mumPose = (t: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, ...SPOT.mum, yaw: 0.35, facing: 1, headTilt: 3 * Math.sin(t / 7), armL: { a: 14, b: -6 },
  armR: { a: 40 + 14 * Math.sin(t / 6), b: 40 }, ...extra,
});
const pipPose = (t: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, ...SPOT.pip, yaw: -0.5, facing: -1, headTilt: 2 * Math.sin(t / 11), armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, ...extra,
});
const sisPose = (t: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, ...SPOT.sis, yaw: 0.4, facing: 1, headTilt: 2 * Math.sin(t / 9), armL: { a: 10, b: -4 }, armR: { a: 10, b: -4 }, sway: 3, ...extra,
});

// ---------- E1: wide: the family kitchen after dark; mum cooks and laughs, Pip and sis at the right ----------
export const E1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 960]]), kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <KitchenNight t={t + 30} id="e1k" />
    <Hero look={MOM} pose={{ ...mumPose(t), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    <KitchenFront t={t} seed={11} />
    <Hero look={SIS} pose={{ ...sisPose(t, { yaw: -0.3, facing: -1 }), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
    <Hero look={PIP} pose={{ ...pipPose(t), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
    <LaughMarks x={SPOT.mum.x + 56} y={SPOT.mum.y - 250} t={t} s={0.7} />
  </g>
);

// ---------- E2: medium: sis looks up and asks, head tilted, curious ----------
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const tilt = kf(t, [[0, 0], [14, 7], [len, 9]]);
  return (
    <g transform={camT(kf(t, [[0, SPOT.sis.x + 40], [len, SPOT.sis.x + 20]]), SPOT.sis.y - 70, kf(t, [[0, 2.1], [len, 2.45]]))}>
      <KitchenNight t={t + 60} id="e2k" />
      <Hero look={MOM} pose={{ ...mumPose(t), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <KitchenFront t={t} seed={12} />
      <Hero look={SIS} pose={{ ...sisPose(t, { yaw: -0.25, facing: -1, headTilt: tilt, look: -0.7 }), ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.5} />
      <Foreground blur={10}>
        <Hero look={PIP} pose={{ ...pipPose(t, { x: SPOT.pip.x + 120, y: SPOT.pip.y + 120, scale: SPOT.pip.scale * 1.7 }), ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0} />
      </Foreground>
    </g>
  );
};

// ---------- E3: close-up of her face on the question; a "?" bobs up beside her ----------
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const q = backOut(clamp((t - 10) / 10));
  const hx = SPOT.sis.x + 8;
  const hy = SPOT.sis.y - 190;
  return (
    <g transform={camT(kf(t, [[0, hx - 10], [len, hx + 4]]), hy + 6, kf(t, [[0, 4.4], [len, 5.0]]))}>
      <g filter="url(#blur6)">
        <KitchenNight t={t + 90} id="e3k" />
        <Hero look={MOM} pose={{ ...mumPose(t), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        <KitchenFront t={t} seed={13} />
      </g>
      <Hero look={SIS} pose={{ ...sisPose(t, { yaw: -0.15, facing: -1, headTilt: 9 + 2 * Math.sin(t / 8), look: -0.6 }), ...faceAt(t, [[0, 'neutral'], [18, 'worried'], [46, 'neutral']]) }} rimId="rimL" shadow={0} />
      <g transform={`translate(${hx + 78} ${hy - 78 + 5 * Math.sin(t / 7)}) rotate(14) scale(${q})`}>
        <text textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill="#FFE27A" stroke="#3A2A20" strokeWidth={8} paintOrder="stroke">?</text>
      </g>
      <Glow x={hx} y={hy} r={300} o={0.25} />
    </g>
  );
};

// ---------- E4: Pip looks around the room, eyes sweeping left then right, a soft smile ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const look = kf(t, [[0, -0.9], [14, -0.9], [26, 0.8], [len, 0.8]]);
  return (
    <g transform={camT(kf(t, [[0, SPOT.pip.x - 30], [len, SPOT.pip.x - 60]]), SPOT.pip.y - 90, kf(t, [[0, 2.0], [len, 2.3]]))}>
      <KitchenNight t={t + 120} id="e4k" />
      <Hero look={MOM} pose={{ ...mumPose(t), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <KitchenFront t={t} seed={14} />
      <Hero look={PIP} pose={{ ...pipPose(t, { yaw: 0.1, facing: -1, look, headTilt: kf(t, [[0, -4], [20, 4], [len, 4]]) }), ...faceAt(t, [[0, 'neutral'], [24, 'happy']]) }} rimId="rimL" shadow={0.5} />
    </g>
  );
};

// ---------- E5: mum laughing at the counter, shoulders bobbing, laugh marks ----------
export const E5: React.FC<ShotProps> = ({ t, len }) => {
  const bob = Math.sin(t / 2.6);
  return (
    <g transform={camT(kf(t, [[0, SPOT.mum.x + 90], [len, SPOT.mum.x + 70]]), SPOT.mum.y - 80, kf(t, [[0, 2.0], [len, 2.35]]))}>
      <KitchenNight t={t + 150} id="e5k" />
      <Hero look={MOM} pose={{ ...mumPose(t, { yaw: 0.2, y: SPOT.mum.y + 3 * bob, tilt: 2 * bob, headTilt: 5 * bob, armR: { a: 50 + 10 * bob, b: 40 } }), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <KitchenFront t={t} seed={15} />
      <LaughMarks x={SPOT.mum.x + 70} y={SPOT.mum.y - 215} t={t} s={0.9} />
      <LaughMarks x={SPOT.mum.x - 60} y={SPOT.mum.y - 215} t={t + 3} s={0.9} flip />
    </g>
  );
};

// ---------- E6: insert: the xôi pot on the island, lid ajar, steam climbing; the lamp glow pushes in ----------
export const E6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1010]]), kf(t, [[0, 630], [len, 590]]), kf(t, [[0, 2.7], [len, 3.3]]))}>
    <g filter="url(#blur6)">
      <KitchenNight t={t + 40} id="e6k" />
    </g>
    <KitchenFront t={t} seed={16} />
    <Glow x={1010} y={560} r={360} o={0.4} />
  </g>
);

// ---------- E7: sis hugging her new books, beaming ----------
export const E7: React.FC<ShotProps> = ({ t, len }) => {
  const sway = Math.sin(t / 10);
  const pose = sisPose(t, { yaw: 0.1, facing: 1, headTilt: 5 * sway, armL: { a: 50, b: 90 }, armR: { a: 50, b: 90 } });
  const chest = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, SPOT.sis.x], [len, SPOT.sis.x + 10]]), SPOT.sis.y - 70, kf(t, [[0, 2.2], [len, 2.6]]))}>
      <KitchenNight t={t + 180} id="e7k" />
      <Hero look={MOM} pose={{ ...mumPose(t), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <KitchenFront t={t} seed={17} />
      <Hero look={SIS} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <NewBooks x={chest.x - 6} y={chest.y + 34} s={0.6} rot={-3 * sway} />
      <Dust t={t} seed={7} x0={SPOT.sis.x - 200} y0={SPOT.sis.y - 400} w={400} h={360} n={14} o={0.5} />
    </g>
  );
};
