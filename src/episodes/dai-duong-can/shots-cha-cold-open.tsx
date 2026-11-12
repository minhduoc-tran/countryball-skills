import React from 'react';
import { Hero, LOOKS, faceAt, kf, clamp, easeOut, easeIn, camT, poseAt, Glow, ShotProps } from '../../engine';
import { DanangBeach } from './kit-danang-beach';
import { SeaCover, SplashRings, PlaceTag } from './cha-beach-props';

// Chapter A, the cold open (0:00-9.5 s): sunny Đà Nẵng, Pip drops into the sea, the water starts sliding away, runs
// to the horizon, and Pip is left on wet sand. Beach sea = DanangBeach `drain` 0 -> 1; Pip's own water is a SeaCover.

// ---------- A1: wide, the calm bright bay, a slow push-in, place tag ----------
export const A1: React.FC<ShotProps> = ({ t, len, f }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), kf(t, [[0, 560], [len, 580]]), kf(t, [[0, 1.04], [len, 1.12]]))}>
      <DanangBeach id="ca1" t={t} drain={0} />
    </g>
    <PlaceTag label="ĐÀ NẴNG" f={f} />
  </g>
);

// ---------- A2: sun and palm: glare through swaying fronds above the glittering sea ----------
export const A2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 1400], [len, 1380]]), kf(t, [[0, 450], [len, 420]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <DanangBeach id="ca2" t={t + 60} drain={0} />
      <Glow x={1480} y={140} r={380} o={0.5 + 0.2 * Math.sin(t / 9)} />
      {[0, 1, 2].map((i) => <circle key={i} cx={1480 - 170 - i * 150} cy={140 + 90 + i * 70} r={26 - i * 6} fill="#FFF3C4" opacity={0.18} />)}
    </g>
  </g>
);

// Pip floating in the near water: shared framing for A3 / A4
const FLOAT = { x: 920, hipY: 660, scale: 1.1, ground: 860 };
const Backdrop: React.FC<{ id: string; t: number; drain: number }> = ({ id, t, drain }) => (
  <g filter="url(#blur6)">
    <DanangBeach id={id} t={t + 30} drain={drain} people={[]} />
  </g>
);

// ---------- A3: medium, Pip lets himself drop into the water: splash, then happy bobbing ----------
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const hit = 8;
  const fall = kf(t, [[0, -300], [hit, 8], [hit + 4, -8], [hit + 9, 0]], (x) => x);
  const bob = t > hit + 6 ? Math.sin((t - hit) / 8) * 6 : 0;
  const pose = poseAt(t, [
    { f: 0, p: { x: FLOAT.x, y: FLOAT.hipY, scale: FLOAT.scale, yaw: 0.35, armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 }, legL: { a: 10, b: 0 }, legR: { a: -10, b: 0 }, tilt: -6, squash: 0 } },
    { f: hit, p: { armL: { a: 120, b: 0 }, armR: { a: 120, b: 0 } }, ease: easeOut },
    { f: hit + 10, p: { armL: { a: 70, b: 4 }, armR: { a: 76, b: 4 }, tilt: 3 }, ease: easeOut },
    { f: len, p: { armL: { a: 58, b: 8 }, armR: { a: 64, b: 8 }, tilt: -2 } },
  ]);
  const face = faceAt(t, [[0, 'happy']]);
  return (
    <g transform={camT(940, 560, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Backdrop id="ca3" t={t} drain={0} />
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...face, y: pose.y + fall + bob, headTilt: Math.sin(t / 10) * 3 }} rimId="rimR" shadow={0} />
      <SeaCover id="ca3" t={t} y={kf(t, [[0, 640], [hit, 640], [hit + 3, 650]]) + bob * 0.4} />
      <SplashRings x={FLOAT.x} y={644} t={t - hit} />
    </g>
  );
};

// ---------- A4: the water starts to slide away: Pip's face drops, the sea level falls past his chest, he lands ----------
export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const drop = easeIn(clamp((t - 22) / 11));
  const land = 33;
  const pose = poseAt(t, [
    { f: 0, p: { x: FLOAT.x, y: FLOAT.hipY, scale: FLOAT.scale, yaw: 0.35, armL: { a: 58, b: 8 }, armR: { a: 64, b: 8 }, legL: { a: 10, b: 0 }, legR: { a: -10, b: 0 }, tilt: -2, squash: 0 } },
    { f: 9, p: { armL: { a: 40, b: 6 }, armR: { a: 44, b: 6 }, tilt: 3 }, ease: easeOut },
    { f: land - 2, p: { armL: { a: 30, b: 0 }, armR: { a: 30, b: 0 }, legL: { a: 4, b: 0 }, legR: { a: -4, b: 0 }, squash: 0 } },
    { f: land + 2, p: { squash: 0.22, armL: { a: 52, b: 0 }, armR: { a: 52, b: 0 } }, ease: easeOut },
    { f: land + 7, p: { squash: -0.04 } },
    { f: len, p: { squash: 0, tilt: 5, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
  ]);
  const face = faceAt(t, [[0, 'happy'], [8, 'oops'], [16, 'shock']]);
  const cover = kf(t, [[0, 650], [10, 656], [34, 930]], easeIn);
  const y = pose.y + drop * (FLOAT.ground - FLOAT.scale * 140 - FLOAT.hipY);
  return (
    <g transform={camT(940, 600, 1.5)}>
      <Backdrop id="ca4" t={t + 8} drain={kf(t, [[0, 0], [len, 0.45]], easeIn)} />
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...face, y, headTilt: kf(t, [[0, 0], [14, -6]]), look: kf(t, [[0, 0.3], [12, -0.4]]) }} rimId="rimR" shadow={clamp((t - land + 3) / 4)} />
      <SeaCover id="ca4" t={t} y={cover} />
    </g>
  );
};

// ---------- A5: wide, the waterline races out toward the horizon, the bathers freeze ----------
export const A5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 960]]), kf(t, [[0, 600], [len, 548]]), kf(t, [[0, 1.12], [len, 1.02]]))}>
    <DanangBeach id="ca5" t={t + 80} drain={kf(t, [[0, 0.45], [len, 0.93]], easeIn)} />
  </g>
);

// ---------- A6: Pip stands on the bare wet sand, the sea gone, a slow push-in and a slump ----------
export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 800, y: 652, scale: 0.95, yaw: 0.55, tilt: 0, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, look: 0.5 } },
    { f: 20, p: { tilt: 4, headTilt: 3 }, ease: easeOut },
    { f: len, p: { tilt: 9, headTilt: 6, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 } } },
  ]);
  const face = faceAt(t, [[0, 'shock'], [34, 'worried']]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), 610, kf(t, [[0, 1.25], [len, 1.5]]))}>
      <DanangBeach id="ca6" t={t + 120} drain={1} />
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...face }} rimId="rimR" shadow={1} />
    </g>
  );
};
