import React from 'react';
import {
  Hero, poseAt, faceAt, kf, camT, LOOKS, Glow, LightVeil, Dust, Foreground, toWorld, ShotProps, Phone, stand,
  Study, STUDY, Desk, Kitchen, KitchenIsland, KITCHEN, Bedroom, BEDROOM, Supermarket, aisleStand, Pose,
} from '../../engine';
import { BanhMi } from './chd-props-schematic';
import { RoomStuff, OpenGift, HeadArm, FamilyMeal } from './chd-props-room';

// Chapter D, the end: adaptation (D19-D23, "nothing is special", edit look "cold") and the call from mum (D24-D26).

const PIP = LOOKS.pipHood;
const MOM = LOOKS.mom;
const HEAD = { x: 0, y: -176 };
const headAt = (p: Pose, dx = 0, dy = 0) => toWorld(p, { x: HEAD.x + dx * p.scale, y: HEAD.y + dy });

// ---------- D19: wide, a room stuffed with things; Pip small in the middle, face flat ----------
const S19 = stand(STUDY, 0.5, 0.52, 0.5);
export const D19: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S19.x, y: S19.y, scale: S19.scale, yaw: 0, look: 0, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 } } },
    { f: 40, p: { headTilt: 2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), kf(t, [[0, 600], [len, 640]]), kf(t, [[0, 0.95], [len, 1.08]]))}>
      <Study t={t + 50} id="d19st" veil={0.3} />
      <RoomStuff />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" shadow={1} />
    </g>
  );
};

// ---------- D20: medium, Pip front-on among the piles, flat face, a slow blink ----------
export const D20: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, scale: 1, yaw: 0.1, look: 0, armL: { a: 7, b: -6 }, armR: { a: 7, b: -6 } } },
    { f: len, p: { headTilt: -3, tilt: 1 } },
  ]);
  if (t % 50 > 44) pose.blink = 1;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), 600, kf(t, [[0, 1.55], [len, 1.7]]))}>
      <Study t={t + 90} id="d20st" veil={0.34} />
      <RoomStuff />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" shadow={1} />
      <Foreground blur={10}>
        <path d="M 120 1100 Q 100 820 220 760 Q 330 740 380 900 L 420 1100 Z" fill="#1A1218" />
        <path d="M 1560 1100 Q 1540 880 1640 840 L 1800 840 L 1820 1100 Z" fill="#1A1218" />
      </Foreground>
    </g>
  );
};

// ---------- D21: close in the kitchen: Pip chews a bánh mì, bored ----------
const S21 = stand(KITCHEN, 0.5, 0.4, 0.62);
export const D21: React.FC<ShotProps> = ({ t, len }) => {
  const chew = Math.sin(t * 0.9);
  const pose = poseAt(t, [
    { f: 0, p: { x: S21.x, y: S21.y, scale: S21.scale, yaw: 0.45, facing: 1, look: 0.2, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, headTilt: 4 } },
    { f: len, p: { headTilt: -2 } },
  ]);
  const p2: Pose = { ...pose, ...faceAt(t, [[0, 'tired']]), y: pose.y + chew * 1.5 };
  const mouth = headAt(p2, 30, 28);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), 560, kf(t, [[0, 2.5], [len, 2.8]]))}>
      <Kitchen t={t + 20} id="d21k" />
      <Hero look={PIP} pose={p2} rimId="rimR" shadow={0} />
      <HeadArm pose={p2} look={PIP} arm="armR" hx={mouth.x + 54} hy={mouth.y + 40} elbow={50}>
        <BanhMi x={mouth.x + 16} y={mouth.y + 24} s={0.42} rot={-28} t={t} />
      </HeadArm>
      <KitchenIsland />
    </g>
  );
};

// ---------- D22: a gift box opened on the floor; Pip shrugs ----------
const S22 = stand(BEDROOM, 0.42, 0.36, 0.62);
const G22 = BEDROOM.P(0.6, 1, 0.7);
export const D22: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S22.x, y: S22.y, scale: S22.scale, yaw: 0.2, look: 0.5, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 } } },
    { f: 14, p: { armL: { a: 38, b: 92 }, armR: { a: 38, b: 92 }, tilt: 0, headTilt: -5, squash: 0.03 }, ease: (v: number) => 1 - Math.pow(1 - v, 3) },
    { f: 22, p: { armL: { a: 34, b: 96 }, armR: { a: 34, b: 96 }, squash: 0 } },
    { f: len, p: { armL: { a: 36, b: 94 }, armR: { a: 36, b: 94 }, headTilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 970]]), 650, kf(t, [[0, 1.25], [len, 1.35]]))}>
      <Bedroom t={t + 70} id="d22bd" veil={0.34} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [12, 'tired']]) }} rimId="rimR" shadow={1} />
      <OpenGift x={G22.x} y={G22.y} s={0.85} t={t} />
    </g>
  );
};

// ---------- D23: the supermarket, wide: Pip tiny and grey in the middle of the aisle ----------
const S23 = aisleStand(0.5, 0.42);
export const D23: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S23.x, y: S23.y, scale: S23.scale, yaw: 0, look: 0, armL: { a: 7, b: -6 }, armR: { a: 7, b: -6 } } },
    { f: 50, p: { headTilt: 3 } },
    { f: len, p: { headTilt: -2 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 0.95], [len, 1.3]]))}>
      <Supermarket t={t + 30} id="d23m" cart={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={1} />
    </g>
  );
};

// ---------- D24: night, the silent flat; his phone buzzing on the desk, "MẸ" ----------
export const D24: React.FC<ShotProps> = ({ t, len }) => {
  const ring = t % 30 < 20 ? 1 : 0;
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 700, scale: 1, yaw: 0.5, look: 0.7, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, headTilt: 3 } },
    { f: len, p: { headTilt: 6, look: 0.9 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1060]]), 660, kf(t, [[0, 1.4], [len, 1.6]]))}>
      <Study t={t + 10} id="d24st" night veil={0.5} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} rimId="rimBlue" shadow={0} />
      <Desk x0={600} x1={1360} y={700} laptop={false} lamp={false} />
      <Glow x={1130} y={760} r={260} kind="cool" o={0.45 + 0.3 * ring} />
      <Phone x={1130} y={730} w={150} rot={-6} on={1} caller="MẸ" buzz={ring} f={t} />
      <LightVeil id="d24veil" lights={[[1130, 740, 300], [1130, 480, 240]]} o={0.4} />
    </g>
  );
};

// ---------- D25: mum in the warm kitchen, phone at her ear; the table is set, one place empty ----------
const S25 = stand(KITCHEN, 0.4, 0.4, 0.62);
export const D25: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S25.x, y: S25.y, scale: S25.scale, yaw: 0.45, facing: 1, look: 0.5, armR: { a: 8, b: -6 }, headTilt: 4 } },
    { f: len, p: { headTilt: 7, look: 0.7 } },
  ]);
  const p2: Pose = { ...pose, ...faceAt(t, [[0, 'worried']]) };
  if (t % 52 > 47) p2.blink = 1;
  const ear = headAt(p2, -64, 6);
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1000]]), 600, kf(t, [[0, 1.5], [len, 1.7]]))}>
      <Kitchen t={t + 60} id="d25k" />
      <Hero look={MOM} pose={p2} rimId="rimR" shadow={0} />
      <HeadArm pose={p2} look={MOM} arm="armL" hx={ear.x} hy={ear.y + 10} elbow={50}>
        <rect x={ear.x - 26} y={ear.y - 52} width={30} height={78} rx={9} fill="#16151C" stroke="#3A3846" strokeWidth={3} transform={`rotate(-8 ${ear.x} ${ear.y})`} />
      </HeadArm>
      <KitchenIsland />
      <FamilyMeal t={t} />
    </g>
  );
};

// ---------- D26: close-up, Pip listens with the phone at his ear; eyes soft; a long hold ----------
export const D26: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, scale: 1.0, yaw: 0.45, facing: 1, look: 0.3, armR: { a: 8, b: -6 }, headTilt: 3 } },
    { f: 50, p: { headTilt: -2, look: -0.3 } },
    { f: len, p: { headTilt: 0, look: -0.4 } },
  ]);
  const p2: Pose = { ...pose, ...faceAt(t, [[0, 'neutral'], [36, 'worried']]) };
  if (t % 58 > 52) p2.blink = 1;
  const ear = headAt(p2, -64, 6);
  const head = headAt(p2);
  return (
    <g transform={camT(kf(t, [[0, head.x - 20], [len, head.x - 10]]), kf(t, [[0, head.y + 10], [len, head.y + 4]]), kf(t, [[0, 3.1], [len, 3.5]]))}>
      <g filter="url(#blur16)">
        <Study t={t + 40} id="d26st" night veil={0.55} />
      </g>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#0A0C1E" opacity={0.45} />
      <Hero look={PIP} pose={p2} rimId="rimBlue" shadow={0} />
      <HeadArm pose={p2} look={PIP} arm="armL" hx={ear.x} hy={ear.y + 10} elbow={50}>
        <rect x={ear.x - 26} y={ear.y - 52} width={30} height={78} rx={9} fill="#16151C" stroke="#3A3846" strokeWidth={3} transform={`rotate(-8 ${ear.x} ${ear.y})`} />
      </HeadArm>
      <Glow x={ear.x + 4} y={ear.y} r={150} o={0.35} />
      <Dust t={t} seed={3} x0={head.x - 300} y0={head.y - 200} w={600} h={400} n={14} o={0.4} />
    </g>
  );
};
