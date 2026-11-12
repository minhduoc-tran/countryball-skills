import React from 'react';
import {
  Hero, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, joints, toWorld, Rooftop, Street, streetStand, Stars,
  Glow, Foreground, Dust, ShotProps,
} from '../../engine';
import { Sandwich } from './chb-local-props';

// Chapter B, 1/3: "Then, at minute eight, the lights go out." A rooftop lunch at dusk (B1), the Sun winks out on the
// word "out" (B2: a close-up, the face lit and then suddenly dark), the street goes from day to night with everyone
// looking up (B3), and Pip stands with his bite of banh mi under the first stars (B4).

const PIP = LOOKS.pipHood;
const FEET = 822; // roof deck line: where the feet stand on the Rooftop set

// ---------- B1: wide rooftop, Pip tiny with his lunch, the Sun low and warm behind the city ----------
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.55;
  const pose = poseAt(t, [
    { f: 0, p: { x: 700, y: FEET - LEG_LEN * sc, scale: sc, yaw: 0.45, look: 0.6, armL: { a: 12, b: 6 }, armR: { a: 52, b: 82 }, handR: 'open' } },
    { f: 22, p: { armR: { a: 30, b: 100 } }, ease: easeOut },
    { f: 40, p: { armR: { a: 52, b: 82 } } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 880]]), 560, kf(t, [[0, 1.0], [len, 1.16]]))}>
      <Rooftop t={t + 200} sunX={1100} sunY={620} cityLit={2.5} />
      <Hero look={PIP} pose={{ ...pose, sway: Math.sin(t / 6) * 6, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Sandwich x={hand.x + 6} y={hand.y - 2} rot={-18} s={0.32} bite={0.5} />
      <Foreground blur={10}><rect x={1840} y={-100} width={140} height={1300} fill="#0C0A12" /></Foreground>
    </g>
  );
};

// ---------- B2: close-up: Pip's face warm and lit, the Sun vanishes on "out" (frame 16..26), face goes dark, rim turns blue ----------
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const gone = easeOut(clamp((t - 16) / 10));
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 800, scale: 1, yaw: 0.28, look: 0.3, armL: { a: 12, b: 6 }, armR: { a: 12, b: 6 }, headTilt: 2 } },
    { f: 16, p: { headTilt: 0 } },
    { f: 20, p: { headTilt: -6, tilt: -2 }, ease: easeOut },
  ]);
  const jolt = t >= 16 && t < 24 ? { x: Math.sin(t * 3.1) * 9 * (1 - (t - 16) / 8), y: Math.cos(t * 3.9) * 6 * (1 - (t - 16) / 8) } : { x: 0, y: 0 };
  return (
    <g transform={`translate(${jolt.x} ${jolt.y}) ${camT(960, 650, kf(t, [[0, 2.9], [len, 3.3]]))}`}>
      <Rooftop t={t + 240} sunX={960} sunY={640} cityLit={2.5} sunGone={gone} />
      <g style={{ filter: `brightness(${1 - 0.62 * gone})` }}>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [19, 'shock']]) }} rimId={gone > 0.5 ? 'rimBlue' : 'rimR'} shadow={0} />
      </g>
      <Glow x={960} y={640} r={420} o={0.5 * (1 - gone)} />
    </g>
  );
};

// ---------- B3: the street at noon turns to night; the neighbours stop and look up ----------
const WATCH = [
  { look: LOOKS.mo, X: -1.9, Z: 8, k: 1, arm: true },
  { look: LOOKS.mom, X: 2.0, Z: 7.5, k: 1, arm: false },
  { look: LOOKS.sis, X: 0.9, Z: 6.2, k: 0.7, arm: true },
  { look: PIP, X: -0.5, Z: 5.4, k: 1, arm: false },
];
export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const dark = easeOut(clamp((t - 8) / 34));
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Street t={t + 160} id="b3d" />
      <g opacity={dark}><Street t={t + 160} id="b3n" night moon={false} /></g>
      {WATCH.map((w, i) => {
        const st = streetStand(w.X, w.Z);
        const sc = st.scale * w.k;
        const up = easeOut(clamp((t - 4 - i * 3) / 10));
        const pose = {
          ...basePose,
          x: st.x, y: st.y + LEG_LEN * (st.scale - sc), scale: sc, yaw: i % 2 ? -0.3 : 0.3, headTilt: (i % 2 ? 1 : -1) * -9 * up,
          armR: { a: w.arm ? 20 + 140 * up : 12, b: 6 }, armL: { a: 12, b: 6 }, tilt: (i % 2 ? 1 : -1) * 3 * up,
        };
        return <Hero key={i} look={w.look} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [10 + i * 3, 'shock']]) }} rimId={dark > 0.5 ? 'rimBlue' : 'rimL'} shadow={0} />;
      })}
      <g opacity={dark}><Stars seed={77} x0={0} y0={0} w={1920} h={420} t={t} n={70} o={0.9} /></g>
    </g>
  );
};

// ---------- B4: low angle: Pip, a bite of banh mi in hand and his mouth open, under the stars switching on ----------
export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const low = 230;
  const sc = 1.15;
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: FEET + low - LEG_LEN * sc, scale: sc, yaw: 0.25, tilt: -3, headTilt: -10, armL: { a: 12, b: 6 }, armR: { a: 40, b: 84 } } },
    { f: 24, p: { armR: { a: 22, b: 40 }, headTilt: -13 }, ease: easeOut },
    { f: 60, p: { armR: { a: 14, b: 20 } } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const starIn = clamp((t - 4) / 34);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 900]]), kf(t, [[0, 730], [len, 680]]), kf(t, [[0, 1.5], [len, 1.7]]))}>
      <Rooftop t={t + 300} low={low} cityLit={2.5} sunGone={1} />
      <g opacity={starIn}><Stars seed={91} x0={-200} y0={-300} w={2300} h={700} t={t} n={80} o={1} /></g>
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimBlue" shadow={0} />
      <Sandwich x={hand.x + 8} y={hand.y} rot={-10 + 20 * clamp((t - 24) / 36)} s={0.42} bite={0.6} />
      <Dust t={t} seed={4} x0={300} y0={100} w={1300} h={600} n={20} o={0.35} />
    </g>
  );
};
