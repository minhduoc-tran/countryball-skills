import React from 'react';
import { Hero, LOOKS, faceAt, kf, camT, poseAt, easeOut, FloatLabel, joints, toWorld, ShotProps } from '../../engine';
import { DanangBeach } from './kit-danang-beach';
import { SeaWall, FishingRod, AbyssPov } from './cha-wall-and-rod-props';

// Chapter A, Mo (22.9-28.0 s): Mo on the sea wall with his rod, a close-up of the rod hand, the shaft where the sea was,
// and his face on "Biển đâu rồi mày?". Mo stands at (1050, hips 660), feet on the wall coping at y 800.

const MO = { x: 1050, y: 660, scale: 1 };
const moIdle = (t: number) =>
  poseAt(t, [
    { f: 0, p: { ...MO, yaw: 0.5, tilt: -2, armL: { a: 12, b: -6 }, armR: { a: 38, b: -14 }, handR: 'open', look: 0.4 } },
    { f: 60, p: { tilt: 2, armR: { a: 44, b: -18 } } },
  ]);

// ---------- A15: medium-wide: Mo stands on the wall, rod in hand, beach and bare seabed behind ----------
export const A15: React.FC<ShotProps> = ({ t, len }) => {
  const pose = { ...moIdle(t), ...faceAt(t, [[0, 'neutral'], [26, 'oops']]) };
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1000]]), 600, kf(t, [[0, 1.3], [len, 1.5]]))}>
      <g filter="url(#blur3)"><DanangBeach id="cc15" t={t + 20} drain={1} people={[]} /></g>
      <SeaWall />
      <Hero look={LOOKS.mo} pose={pose} rimId="rimR" shadow={1} />
      <FishingRod pose={pose} t={t} />
    </g>
  );
};

// ---------- A16: insert: the rod hand, line dangling over nothing, the camera easing in ----------
export const A16: React.FC<ShotProps> = ({ t, len }) => {
  const pose = { ...moIdle(t + 30), ...faceAt(t, [[0, 'oops']]) };
  const h = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, h.x + 30], [len, h.x + 10]]), kf(t, [[0, h.y - 10], [len, h.y + 10]]), kf(t, [[0, 3.1], [len, 3.6]]))}>
      <g filter="url(#blur6)"><DanangBeach id="cc16" t={t + 40} drain={1} people={[]} /></g>
      <SeaWall />
      <Hero look={LOOKS.mo} pose={pose} rimId="rimR" shadow={1} />
      <FishingRod pose={pose} t={t} />
    </g>
  );
};

// ---------- A17: POV down the wall: a bottomless shaft, pebbles falling away, the line hanging into the dark ----------
export const A17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 600]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
    <AbyssPov t={t} />
  </g>
);

// ---------- A18: close-up: Mo, rod tip at the edge of frame: "Biển đâu rồi mày?" ----------
export const A18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...MO, yaw: 0.35, tilt: 3, armR: { a: 38, b: -14 }, headTilt: 0, look: 0.3 } },
    { f: 14, p: { tilt: -2, headTilt: -7, look: -0.2 }, ease: easeOut },
    { f: len, p: { tilt: 0, headTilt: 5 } },
  ]);
  const face = faceAt(t, [[0, 'shock'], [18, 'worried']]);
  return (
    <g>
      <g transform={camT(1050, 520, kf(t, [[0, 3.0], [len, 3.4]]))}>
        <g filter="url(#blur16)"><g transform="translate(260 140) scale(0.8)"><DanangBeach id="cc18" t={t} drain={1} people={[]} /></g></g>
        <Hero look={LOOKS.mo} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
        <FloatLabel x={1135} y={450} t={t - 16} text="?" size={46} />
      </g>
    </g>
  );
};
