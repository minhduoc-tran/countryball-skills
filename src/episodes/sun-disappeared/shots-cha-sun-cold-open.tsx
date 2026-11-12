import React from 'react';
import {
  Glow, Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, joints, toWorld, LEG_LEN, Kitchen, Cat, Dust,
  Sparkle, Rooftop, TitleCard, ShotProps,
} from '../../engine';
import { BeachDusk } from '../nghin-dong-moi-giay/chb-travel-scenery-props';
import { Umbrella, Towel, Kite, Walker } from './cha-sun-props';

// "What if the Sun disappeared?" Chapter A cold open, A1-A9: a perfectly ordinary sunny day (beach, kite, cat in a
// sunbeam), the Sun itself, then the title over the roof. Pure functions of each shot's clock t.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const GROUND = 905; // sand line Pip sits on
const SIT = { x: 760, scale: 0.95 };
const SEAT_Y = GROUND - 34;

// Pip sitting on the towel, legs out in profile facing the sea, eyes closed and smiling when `calm`.
const sitPose = (t: number, calm: number, extra = {}) =>
  poseAt(t, [
    { f: 0, p: { x: SIT.x, y: SEAT_Y, scale: SIT.scale, yaw: 0.85, look: 0.4, headTilt: -6, tilt: -4, blink: calm, armL: { a: 20, b: 20 }, armR: { a: 32, b: 24 }, legL: { a: 84, b: -6 }, legR: { a: 78, b: -4 }, ...extra } },
  ]);
const Pip: React.FC<{ t: number; calm: number; extra?: object; face?: string }> = ({ t, calm, extra, face = 'happy' }) => {
  const breath = Math.sin(t / 14) * 3;
  const pose = { ...sitPose(t, calm, extra), ...faceAt(t, [[0, face as 'happy']]) };
  return <Hero look={PIP} pose={{ ...pose, y: (pose.y ?? SEAT_Y) + breath * 0.3 }} rimId="rimR" shadow={0.6} />;
};

const Beach: React.FC<{ id: string; t: number; people?: boolean }> = ({ id, t, people = true }) => (
  <g>
    <BeachDusk id={id} t={t} palms />
    {people ? (
      <g>
        <Walker x={200} y={860} t={t} s={0.55} seed={3} dir={1} />
        <Walker x={1500} y={870} t={t} s={0.6} seed={7} dir={-1} />
        <Walker x={900} y={845} t={t} s={0.42} seed={11} dir={1} />
      </g>
    ) : null}
  </g>
);

// ---------- A1: wide, the beach, Pip on a towel under an umbrella, eyes closed ----------
export const A1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 860]]), 640, kf(t, [[0, 1.0], [len, 1.18]]))}>
    <Beach id="a1" t={t} />
    <Umbrella x={580} y={GROUND + 20} s={1.0} />
    <Towel x={780} y={GROUND - 20} />
    <Pip t={t} calm={1} />
    <Glow x={1180} y={560} r={700} o={0.25} />
  </g>
);

// ---------- A2: close-up, the Sun's glow on Pip's face, a smile ----------
export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const hx = SIT.x + 22;
  const hy = SEAT_Y - 176 * SIT.scale + 6;
  return (
    <g transform={camT(hx + 30, hy + 10, kf(t, [[0, 3.0], [len, 3.5]]))}>
      <BeachDusk id="a2" t={t} palms={false} />
      <Pip t={t} calm={1} extra={{ headTilt: -8 }} />
      <Glow x={hx + 140} y={hy - 20} r={300} o={0.5 + Math.sin(t / 9) * 0.06} />
      <Glow x={hx + 90} y={hy} r={160} o={0.35} />
      <Sparkle x={hx + 120} y={hy - 70} t={(t % 40) - 6} s={1.4} />
    </g>
  );
};

// ---------- A3: medium, the roof, the little sister flies a kite ----------
const SIS_SCALE = 0.72;
const sisPose = (t: number) => {
  const run = Math.sin(t / 9) * 6;
  return poseAt(t, [
    { f: 0, p: { x: 760 + run, y: 820 - LEG_LEN * SIS_SCALE, scale: SIS_SCALE, yaw: 0.55, look: 0.9, tilt: -5 + run * 0.3, armR: { a: 160, b: 4 }, armL: { a: 110, b: 4 }, legL: { a: -8 - run, b: 6 }, legR: { a: 10 + run, b: 6 } } },
  ]);
};
const KITE_POS = (t: number) => ({ x: 1180 + Math.sin(t / 17) * 40, y: 250 + Math.cos(t / 21) * 22 });
const Sister: React.FC<{ t: number }> = ({ t }) => {
  const pose = { ...sisPose(t), ...faceAt(t, [[0, 'happy']]) };
  const hand = toWorld(pose, joints(pose).armR.end);
  const k = KITE_POS(t);
  return (
    <g>
      <Kite x={k.x} y={k.y} t={t} s={1.0} rot={18} />
      <path d={`M ${hand.x} ${hand.y} Q ${(hand.x + k.x) / 2 + 40} ${(hand.y + k.y) / 2 + 120} ${k.x - 22} ${k.y + 74}`} stroke="#FFF3DC" strokeWidth={3} fill="none" />
      <Hero look={SIS} pose={pose} rimId="rimR" shadow={0.6} />
    </g>
  );
};
export const A3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 990]]), 560, kf(t, [[0, 1.1], [len, 1.22]]))}>
    <Rooftop t={t + 60} sunX={1480} sunY={560} />
    <Sister t={t} />
  </g>
);

// ---------- A4: the kite alone against the sky ----------
export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const k = KITE_POS(t * 1.3);
  return (
    <g transform={camT(kf(t, [[0, k.x - 140], [len, k.x - 40]]), k.y + 60, kf(t, [[0, 1.5], [len, 1.9]]))}>
      <Rooftop t={t + 80} sunX={1480} sunY={560} />
      <Kite x={k.x} y={k.y} t={t} s={1.5} rot={22} />
      <path d={`M ${k.x - 33} ${k.y + 113} Q ${k.x - 200} ${k.y + 400} ${k.x - 520} ${k.y + 700}`} stroke="#FFF3DC" strokeWidth={3} fill="none" />
    </g>
  );
};

// ---------- A5/A6: the cat asleep on the kitchen counter in the window's sunbeam ----------
const CAT_AT = { x: 868, y: 604 };
const Sunbeam: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <path d="M 760 470 L 990 470 L 1200 760 L 700 760 Z" fill="#FFD27A" opacity={0.2 + Math.sin(t / 20) * 0.03} style={{ mixBlendMode: 'screen' }} />
    <Dust t={t} seed={5} x0={730} y0={470} w={380} h={300} n={34} o={0.8} />
  </g>
);
const CatScene: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Kitchen t={t + 30} id={id} />
    <Glow x={860} y={540} r={420} o={0.5} />
    <Sunbeam t={t} />
    <Cat x={CAT_AT.x} y={CAT_AT.y} mood="sleep" f={t} />
    <Glow x={CAT_AT.x} y={CAT_AT.y - 20} r={170} o={0.35} />
  </g>
);
export const A5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 920]]), kf(t, [[0, 560], [len, 580]]), kf(t, [[0, 1.2], [len, 1.5]]))}>
    <CatScene t={t} id="a5" />
  </g>
);
export const A6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(CAT_AT.x + kf(t, [[0, 0], [len, 20]]), CAT_AT.y - 10, kf(t, [[0, 3.0], [len, 3.5]]))}>
    <CatScene t={t + 60} id="a6" />
  </g>
);

// ---------- A7: wider and lower, Pip content on the sand while the world goes about its day ----------
export const A7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 900]]), 760, kf(t, [[0, 1.3], [len, 1.45]]))}>
    <Beach id="a7" t={t + 40} people={false} />
    <Umbrella x={500} y={GROUND + 20} />
    <Towel x={780} y={GROUND - 20} />
    <Pip t={t} calm={clamp(1 - (t - 30) / 6)} extra={{ look: 0.2 }} face="happy" />
    <Walker x={1250} y={880} t={t} s={0.7} seed={5} dir={-1} />
    <Walker x={1400} y={920} t={t + 20} s={0.8} seed={9} dir={-1} />
  </g>
);

// ---------- A8: push-in on the Sun itself, huge, still looking perfectly normal ----------
export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1.0], [len, 2.6]], (x) => x * x);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 640]]), z)}>
      <Rooftop t={t + 100} sunX={960} sunY={650} />
      <Glow x={960} y={650} r={700} o={0.35 + Math.sin(t / 8) * 0.04} />
    </g>
  );
};

// ---------- A9: the title over the roof at dusk, Pip small, the Sun still up ----------
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 840 - LEG_LEN * 0.62, scale: 0.62, yaw: 0, look: 0, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 } } },
    { f: 24, p: {} },
    { f: 36, p: { yaw: -0.5, look: -0.8 }, ease: easeOut },
    { f: 60, p: {} },
    { f: 72, p: { yaw: 0.5, look: 0.8, armR: { a: 150, b: 10 } }, ease: easeOut },
    { f: 100, p: {} },
    { f: 112, p: { yaw: 0.05, look: -0.2, headTilt: 3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 548]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Rooftop t={t + 40} sunX={960} sunY={690} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [74, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <TitleCard t={t} lines={['WHAT IF THE SUN', 'JUST DISAPPEARED?']} accent="DISAPPEARED" accentT={75} size={100} y={170} />
    </g>
  );
};
