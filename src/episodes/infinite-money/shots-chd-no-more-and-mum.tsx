import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, HEAD, joints, toWorld, Street, streetStand, Schematic,
  Glow, walkPose, reachAngle, ShotProps,
} from '../../engine';
import { NoMoreCard } from './chd-props-money-and-icons';
import { XoiCart, Steam, ArmHand, NEIGHBOUR } from './chd-props-cast-and-scenes';

// Chapter D, beats "cannot make" and "mum" (D15-D22): three +0 cards, then the dawn alley: mum pushing the xôi cart,
// Pip asking why, her smile, a neighbour taking a packet.

const PIP = LOOKS.pipHood;
const MOM = LOOKS.mom;

// ---------- D15-D17: "+0" cards on the schematic ground: rice, doctors, hours ----------
export const D15: React.FC<ShotProps> = ({ t, len }) => (
  <g><Schematic t={t} id="d15sch" /><NoMoreCard t={t} len={len} kind="rice" label="RICE" /></g>
);
export const D16: React.FC<ShotProps> = ({ t, len }) => (
  <g><Schematic t={t + 40} id="d16sch" /><NoMoreCard t={t} len={len} kind="doctor" label="DOCTORS" /></g>
);
export const D17: React.FC<ShotProps> = ({ t, len }) => (
  <g><Schematic t={t + 80} id="d17sch" /><NoMoreCard t={t} len={len} kind="clock" label="24 HOURS" sub="EVERY DAY" /></g>
);

// ---------- the dawn street: the Street set, a pale low sun at its end, a cool haze ----------
const Dawn: React.FC<{ t: number; id: string; blur?: boolean }> = ({ t, id, blur }) => {
  const street = (
    <g>
      <Street t={t + 20} id={id} veil={0.3} />
      <Glow x={960} y={470} r={900} o={0.55} />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#FFD2A0" opacity={0.1} style={{ mixBlendMode: 'screen' }} />
    </g>
  );
  return blur ? <g filter="url(#blur16)"><g transform="translate(-300 -260) scale(1.5)">{street}</g></g> : street;
};

/** Mum behind the cart: the handle point her hands hold (a hand's reach in front of her), and the cart's centre x for it. */
const pushHandle = (pose: Pose, gy: number, sc: number) => {
  const H = { x: pose.x + 62 * sc, y: gy - 150 * sc * 0.95 };
  const a = reachAngle(pose, H);
  return { arms: { armL: { a, b: -2 }, armR: { a, b: -2 } }, cartX: H.x + 250 * sc * 0.95 };
};

// ---------- D18: wide: the alley mouth at dawn; mum and her cart come out of the haze, steam rising ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => {
  const at = streetStand(-3.5 + 1.3 * easeOut(clamp(t / len)), 8.6);
  const sc = at.scale;
  const gy = at.y + LEG_LEN * sc;
  const base = walkPose(at.x, t * 0.42, gy, sc, { yaw: 0.9, tilt: 0 }, 1);
  const h = pushHandle(base, gy, sc);
  const pose = { ...base, ...h.arms };
  return (
    <g transform={camT(at.x + 120, 590, kf(t, [[0, 1.7], [len, 2.0]]))}>
      <Dawn t={t} id="d18st" />
      <XoiCart x={h.cartX} y={gy} s={sc * 0.95} t={t} roll={t * 9} />
      <Hero look={MOM} pose={pose} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// ---------- D19: medium: side-on, mum leans into the cart and pushes it along the sidewalk, the steam trailing ----------
export const D19: React.FC<ShotProps> = ({ t, len }) => {
  const x = -1.6 + (t / len) * 1.8;
  const at = streetStand(x, 4.2);
  const sc = at.scale;
  const gy = at.y + LEG_LEN * sc;
  const base = walkPose(at.x, t * 0.4, gy, sc, { yaw: 0.9, tilt: 0 }, 1);
  const h = pushHandle(base, gy, sc);
  const pose = { ...base, ...h.arms };
  return (
    <g transform={camT(at.x + 150, 650, 1.3)}>
      <Dawn t={t} id="d19st" />
      <XoiCart x={h.cartX} y={gy} s={sc * 0.95} t={t} roll={t * 9} />
      <Hero look={MOM} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// ---------- D20: two-shot: the cart parked, mum behind it, Pip beside her, puzzled ----------
export const D20: React.FC<ShotProps> = ({ t, len }) => {
  const mAt = streetStand(1.1, 3.6);
  const pAt = streetStand(-0.7, 3.4);
  const mPose: Pose = { ...basePose, ...mAt, yaw: -0.55, armL: { a: 20, b: 14 }, armR: { a: 16, b: 10 }, headTilt: Math.sin(t / 30) * 2 };
  const pPose = poseAt(t, [
    { f: 0, p: { ...basePose, ...pAt, yaw: 0.45, look: 0.5, armL: { a: 10, b: 8 }, armR: { a: 14, b: 8 } } },
    { f: 16, p: { armR: { a: 40, b: 40 }, headTilt: 5 } },
    { f: 50, p: { armR: { a: 14, b: 8 }, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 920]]), 640, kf(t, [[0, 1.55], [len, 1.75]]))}>
      <Dawn t={t} id="d20st" />
      <XoiCart x={mAt.x + 270 * mAt.scale} y={mAt.y + LEG_LEN * mAt.scale} s={mAt.scale * 0.95} t={t} />
      <Hero look={MOM} pose={{ ...mPose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={{ ...pPose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// ---------- D21: close-up: mum smiles, warm light on her face, steam drifting across the bottom of the frame ----------
export const D21: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 3.3], [len, 3.7]]);
  const head = { x: 1000, y: 540 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: -0.3, look: -0.4, headTilt: kf(t, [[0, 3], [len, -2]]),
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'neutral'], [8, 'happy']]), blink: t > 40 && t < 43 ? 1 : 0,
  };
  return (
    <g>
      <Dawn t={t} id="d21st" blur />
      <Glow x={700} y={380} r={800} o={0.35} />
      <Hero look={MOM} pose={pose} rimId="rimR" shadow={0} />
      <g filter="url(#blur10)" opacity={0.7}><Steam x={1500} y={1080} t={t} s={3.4} n={4} o={0.4} /></g>
    </g>
  );
};

// ---------- D22: insert: a hand holds out a hot banana-leaf packet of xôi, the neighbour's hand takes it ----------
const XoiPacket: React.FC<{ x: number; y: number; rot?: number; t: number }> = ({ x, y, rot = 0, t }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={8} cy={92} rx={120} ry={16} fill="#000" opacity={0.25} />
    <path d="M -110 30 Q -120 -60 -40 -80 L 60 -80 Q 130 -60 112 30 Q 100 90 0 96 Q -100 90 -110 30 Z" fill="#6FA650" stroke="#2E5A24" strokeWidth={5} />
    <path d="M -60 -78 Q 0 -120 70 -78 Z" fill="#F4EAC8" stroke="#B8A878" strokeWidth={4} />
    <path d="M -30 -10 Q 0 30 50 -10 M -50 30 Q 0 70 70 30" stroke="#4E8A3A" strokeWidth={4} fill="none" />
    <path d="M -100 10 Q 0 50 104 10" stroke="#C9A06A" strokeWidth={6} fill="none" />
    <Steam x={0} y={-110} t={t} s={1.2} n={4} />
  </g>
);
export const D22: React.FC<ShotProps> = ({ t, len }) => {
  const give = easeOut(clamp((t - 4) / 16));
  const take = easeOut(clamp((t - 24) / 14));
  const mx = 1500 - 520 * give + 140 * take;
  const my = 620 + 20 * give;
  const nx = 200 + 640 * give * 0.0 + 760 * take;
  const px = take > 0 ? mx - 110 + (nx - mx + 110) * take : mx - 110;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
      <Dawn t={t} id="d22st" blur />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0A12" opacity={0.25} />
      <Glow x={900} y={520} r={700} o={0.35} />
      <ArmHand look={MOM} x={mx} y={my} fx={mx + 760} fy={1250} rot={28} s={4.6} width={118} />
      <XoiPacket x={px} y={my + 14} rot={-6 + 6 * take} t={t} />
      <ArmHand look={NEIGHBOUR} x={Math.min(nx, 900)} y={650} fx={-300} fy={1200} rot={-24} s={4.8} width={124} />
    </g>
  );
};
