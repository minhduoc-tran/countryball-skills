import React from 'react';
import { Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Tag, Supermarket, aisleStand, Study, Desk, Mug, joints, toWorld, Foreground, ShotProps } from '../../engine';
import { MorningBedroom, roomStand } from './kit-morning-bedroom';
import { RewindWave } from './kit-rewind-fx';
import { IceCreamStack } from './kit-props';
import { Boss } from './kit-cast-figures';
import { AngryBubble } from './cha-screens-and-bubbles';
import { Belly } from './cha-places-props';
import { toScreen } from './shots-cha-cold-open';

// Chapter A, "no consequences" (45.0-54.6 s): Pip's grin as it sinks in (HẬU QUẢ, crossed out); ten ice creams and a
// bulging belly -> reset -> flat belly at 06:00; Pip yells everything at the boss -> reset -> the boss smiles, blank.
const PIP = LOOKS.pipHood;

// ---------- A21: medium, Pip by his window at morning: the grin spreads; a "HẬU QUẢ" tag gets crossed out ----------
export const A21: React.FC<ShotProps> = ({ t, len }) => {
  const p = roomStand(0.62, 0.42);
  const pose = poseAt(t, [
    { f: 0, p: { ...p, yaw: -0.35, look: -0.3, headTilt: 4, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 20, p: { headTilt: -2, look: 0.2 }, ease: easeOut },
    { f: 40, p: { armL: { a: 15, b: -125 }, headTilt: -5, tilt: -3 }, ease: easeOut },
    { f: len, p: { headTilt: -6 } },
  ]);
  const cam = { x: p.x + 60, y: p.y - 110, z: kf(t, [[0, 2.0], [len, 2.25]]) };
  const hd = toScreen(cam.x, cam.y, cam.z, toWorld(pose, { x: 0, y: -176 }));
  return (
    <g>
      <g transform={camT(cam.x, cam.y, cam.z)}>
        <MorningBedroom t={t + 1000} id="ca21" dawn={1} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [18, 'smug'], [44, 'happy']]) }} rimId="rimR" shadow={1} />
      </g>
      <Tag x={hd.x + 380} y={hd.y - 120} t={t - 16} text="HẬU QUẢ" mark="x" markT={42} w={300} />
    </g>
  );
};

// ---------- A22: medium in the supermarket aisle: ten ice creams in one fist, Pip eating, his belly ballooning ----------
export const A22: React.FC<ShotProps> = ({ t, len }) => {
  const p = aisleStand(0.5, 0.62);
  const pose = poseAt(t, [
    { f: 0, p: { ...p, yaw: 0.3, look: 0.3, headTilt: 4, armR: { a: 110, b: 30 }, armL: { a: 20, b: -6 } } },
    { f: 10, p: { headTilt: -4, armR: { a: 120, b: 26 } }, ease: easeOut },
    { f: 22, p: { headTilt: 6 } },
    { f: 34, p: { headTilt: -4, tilt: -4 } },
    { f: len, p: { tilt: -6 } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const k = kf(t, [[0, 0.25], [len, 1]], easeOut);
  return (
    <g transform={camT(p.x + 40, p.y - 50, kf(t, [[0, 2.0], [len, 2.15]]))}>
      <Supermarket t={t + 300} id="ca22" cart={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]), squash: -0.02 * k }} rimId="rimR" shadow={1} />
      <Belly pose={pose} k={k} />
      <IceCreamStack x={hand.x} y={hand.y} n={10} s={p.scale * 0.55} />
      <Glow x={p.x} y={p.y - 120} r={260} o={0.2} />
    </g>
  );
};

// ---------- A23: medium, 06:00 again (reset wave): Pip in his room looks down, pats a flat belly, delighted ----------
export const A23: React.FC<ShotProps> = ({ t, len }) => {
  const p = roomStand(0.68, 0.45);
  const pose = poseAt(t, [
    { f: 0, p: { ...p, yaw: 0.35, look: 0.2, headTilt: 2, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 14, p: { headTilt: 16, look: 0.1 }, ease: easeOut },
    { f: 26, p: { armR: { a: -6, b: -70 } }, ease: easeOut },
    { f: 32, p: { armR: { a: -2, b: -60 } } },
    { f: 38, p: { armR: { a: -6, b: -70 } } },
    { f: 44, p: { armR: { a: -2, b: -60 } } },
    { f: 52, p: { headTilt: -4, look: 0.5, armR: { a: -4, b: -66 } }, ease: easeOut },
    { f: len, p: { headTilt: -6 } },
  ]);
  const k = kf(t, [[0, 1], [3, 1], [12, 0]], easeOut);
  return (
    <g>
      <g transform={camT(p.x + 30, p.y - 60, kf(t, [[0, 1.85], [len, 2.0]]))}>
        <MorningBedroom t={t + 1100} id="ca23" dawn={1} ring={1} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [20, 'happy']]) }} rimId="rimR" shadow={1} />
        <Belly pose={pose} k={k} />
      </g>
      <RewindWave t={t} t0={1} id="ca23rw" />
    </g>
  );
};

// The boss's office (the Study set) marks, shared by A24 / A25
const BOSS_AT = { x: 1130, y: 700, scale: 0.98 };
const PIP_OFF = { x: 600, y: 790, scale: 1.18 };
const bossPose = (t: number, shock: boolean): Pose => poseAt(t, [
  { f: 0, p: { ...BOSS_AT, yaw: -0.4, look: -0.6, armL: { a: 14, b: -6 }, armR: { a: 30, b: 70 }, tilt: shock ? -6 : 0 } },
  { f: 8, p: { tilt: shock ? -10 : 0, headTilt: shock ? -6 : 3 }, ease: easeOut },
]);

// ---------- A24: medium-wide office: Pip leans over the desk and lets it all out (a huge angry bubble); the boss recoils ----------
export const A24: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...PIP_OFF, yaw: 0.55, look: 0.6, tilt: 4, armL: { a: 30, b: 20 }, armR: { a: 60, b: 20 } } },
    { f: 6, p: { tilt: 12, armR: { a: 110, b: 10 } }, ease: easeOut },
    { f: 14, p: { tilt: 9, armR: { a: 90, b: 20 } } },
    { f: 22, p: { tilt: 13, armR: { a: 115, b: 6 } } },
    { f: len, p: { tilt: 10, armR: { a: 100, b: 14 } } },
  ]);
  const cam = { x: 900, y: 560, z: kf(t, [[0, 1.3], [len, 1.4]]) };
  const bh = toScreen(cam.x, cam.y, cam.z, { x: 860, y: 330 });
  const sh = t > 4 ? Math.sin(t * 2.1) * 3 : 0;
  return (
    <g>
      <g transform={camT(cam.x + sh, cam.y, cam.z)}>
        <Study t={t + 200} id="ca24" />
        <Boss pose={{ ...bossPose(t, true), ...faceAt(t, [[0, 'neutral'], [6, 'shock']]) }} rimId="rimL" />
        <Desk x0={760} x1={1460} y={720} laptop lamp />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={1} />
      </g>
      <AngryBubble x={bh.x} y={bh.y} t={t - 3} s={0.95} />
    </g>
  );
};

// ---------- A25: close on the boss next morning (reset wave): a warm blank smile and his coffee; Pip a blurred shoulder ----------
export const A25: React.FC<ShotProps> = ({ t, len }) => {
  const pose = bossPose(t + 30, false);
  const hand = toWorld(pose, joints(pose).armR.end);
  const cam = { x: BOSS_AT.x - 20, y: BOSS_AT.y - 170, z: kf(t, [[0, 2.4], [len, 2.55]]) };
  return (
    <g>
      <g transform={camT(cam.x, cam.y, cam.z)}>
        <Study t={t + 260} id="ca25" />
        <Boss pose={{ ...pose, ...faceAt(t, [[0, 'happy']]), blink: t > 30 && t < 34 ? 1 : 0, headTilt: 3 + Math.sin(t / 10) * 2 }} rimId="rimL" />
        <Mug x={hand.x + 10} y={hand.y + 10} rot={0} f={t} />
        <Desk x0={760} x1={1460} y={720} laptop lamp />
      </g>
      <Foreground blur={16}>
        <ellipse cx={300} cy={760} rx={330} ry={420} fill="#14111C" />
        <circle cx={360} cy={330} r={190} fill="#1E1A26" />
      </Foreground>
      <RewindWave t={t} t0={1} id="ca25rw" />
    </g>
  );
};
