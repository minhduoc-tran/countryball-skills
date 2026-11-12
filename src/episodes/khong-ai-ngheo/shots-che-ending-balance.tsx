import React from 'react';
import {
  Hero, Pose, basePose, walkPose, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Dust, Sparkle, KITCHEN, stand, ShotProps,
} from '../../engine';
import { KitchenNight, KitchenFront } from './che-kitchen-night-scene';
import { GoldFloor, GoldPile, Balance, RiceBowl, PillPair, SchoolBag, Hoe } from './che-ending-balance-props';
import { VILLAGE_GIRL } from './cast-looks';

// Chapter E, "ending" (215.8-225.1 s), warm and slow, the golden floor under everything:
//   E13 the family stands on the golden floor, E14 a gold pile fades and the floor stays, E15 an empty balance sways,
//   E16 rice bowl and pill rise together, E17 schoolbag and hoe rise together, E18 the girl walks on with her schoolbag.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const MOM = LOOKS.mom;

/** A dusk-blue backdrop with a warm pool of light behind the subject and the floor line at `fy`. */
const Stage: React.FC<{ t: number; fy: number; cx?: number }> = ({ t, fy, cx = 960 }) => (
  <g>
    <rect x={-400} y={-300} width={2720} height={fy + 300} fill="#231D3D" />
    <rect x={-400} y={fy - 420} width={2720} height={420} fill="#33264A" opacity={0.7} />
    <rect x={-400} y={fy} width={2720} height={1400} fill="#17122A" />
    <Glow x={cx} y={fy - 260} r={780} o={0.55} />
    <GoldFloor x0={-400} x1={2320} y={fy} t={t} />
    <Dust t={t} seed={61} x0={cx - 600} y0={fy - 600} w={1200} h={560} n={26} o={0.5} />
  </g>
);

// ---------- E13: wide: mum, Pip and sis in front of the island, the golden floor glowing under their feet ----------
export const E13: React.FC<ShotProps> = ({ t, len }) => {
  const m = stand(KITCHEN, 0.42, 0.72);
  const p = stand(KITCHEN, 0.56, 0.74);
  const s = stand(KITCHEN, 0.69, 0.76, 0.62 * 0.72);
  const floorY = KITCHEN.P(0.5, 1, 0.75).y;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <KitchenNight t={t + 360} id="e13k" veil={0.66} />
      <KitchenFront t={t} seed={23} />
      <GoldFloor x0={KITCHEN.P(0.1, 1, 0.75).x} x1={KITCHEN.P(0.95, 1, 0.75).x} y={floorY} t={t} />
      <Hero look={MOM} pose={{ ...basePose, ...m, yaw: 0.25, facing: 1, headTilt: 3 * Math.sin(t / 9), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={{ ...basePose, ...p, yaw: -0.15, facing: -1, headTilt: 2 * Math.sin(t / 11), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <Hero look={SIS} pose={{ ...basePose, ...s, yaw: -0.3, facing: -1, sway: 3, headTilt: -3, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <Sparkle x={p.x + 40} y={p.y - 420} t={t - 20} s={1} />
    </g>
  );
};

// ---------- E14: a heap of gold, glinting; it thins and sinks away while the golden floor under it stays ----------
export const E14: React.FC<ShotProps> = ({ t, len }) => {
  const fade = easeOut(clamp((t - 18) / (len - 22)));
  const fy = 760;
  return (
    <g transform={camT(960, kf(t, [[0, 620], [len, 600]]), kf(t, [[0, 1.2], [len, 1.45]]))}>
      <Stage t={t} fy={fy} />
      <GoldPile x={960} y={fy - 4} s={1.35} t={t} fade={fade} />
    </g>
  );
};

// ---------- E15: wide: an empty balance on the golden floor, swaying as if waiting for a choice ----------
export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const fy = 800;
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 540]]), kf(t, [[0, 0.95], [len, 1.1]]))}>
      <Stage t={t + 40} fy={fy} />
      <Balance x={960} y={fy - 6} s={1.15} tilt={9 * Math.sin(t / 11)} />
    </g>
  );
};

/** Items fall onto a pan and settle: `drop` 0..1 is the fall. */
const Dropped: React.FC<{ t: number; at: number; children: React.ReactNode }> = ({ t, at, children }) => {
  const k = clamp((t - at) / 9);
  const bounce = k < 1 ? 0 : Math.max(0, Math.sin((t - at - 9) / 3)) * Math.max(0, 1 - (t - at - 9) / 12) * 8;
  return <g transform={`translate(0 ${-(1 - easeOut(k)) * 420 - bounce})`} opacity={k > 0 ? 1 : 0}>{children}</g>;
};

// ---------- E16: the rice bowl and the pill drop onto the pans; the beam settles level and both rise together ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const fy = 820;
  const tilt = kf(t, [[0, 0], [10, -6], [20, 8], [34, -3], [46, 0]]);
  const lift = easeOut(clamp((t - 44) / (len - 48)));
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.2], [len, 1.4]]))}>
      <Stage t={t + 70} fy={fy} />
      <Balance
        x={960} y={fy - 6} s={1.15} tilt={tilt} lift={lift} glow={lift}
        left={<Dropped t={t} at={4}><RiceBowl x={0} y={0} s={0.8} t={t} /></Dropped>}
        right={<Dropped t={t} at={14}><PillPair x={0} y={0} s={0.9} /></Dropped>}
      />
      <Sparkle x={780} y={400} t={t - 46} s={1.1} />
      <Sparkle x={1150} y={430} t={t - 56} s={0.9} />
    </g>
  );
};

// ---------- E17: low, closer: the schoolbag and the hoe; both pans rise level ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => {
  const fy = 860;
  const tilt = kf(t, [[0, 6], [12, -5], [22, 0]]);
  const lift = easeOut(clamp((t - 14) / (len - 16)));
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 960]]), kf(t, [[0, 600], [len, 560]]), kf(t, [[0, 1.35], [len, 1.55]]))}>
      <Stage t={t + 110} fy={fy} />
      <Balance
        x={960} y={fy - 6} s={1.15} tilt={tilt} lift={lift} glow={lift}
        left={<Dropped t={t} at={0}><SchoolBag x={0} y={0} s={0.72} /></Dropped>}
        right={<Dropped t={t} at={4}><Hoe x={0} y={-24} s={0.85} rot={-10} /></Dropped>}
      />
    </g>
  );
};

// ---------- E18: the girl walks along the golden floor with her schoolbag on her back; the hoe rests, done for today ----------
export const E18: React.FC<ShotProps> = ({ t, len }) => {
  const fy = 800;
  const sc = 1.3;
  const x = kf(t, [[0, 700], [len, 960]]);
  const pose: Pose = walkPose(x, t * 0.5, fy, sc, { yaw: 0.8, headTilt: 3 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 980]]), 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <Stage t={t + 150} fy={fy} cx={900} />
      <Hoe x={420} y={fy - 40} s={0.9} rot={-62} />
      <SchoolBag x={x - 50} y={fy - 140} s={0.5} />
      <Hero look={VILLAGE_GIRL} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Sparkle x={x + 70} y={fy - 400} t={t - 20} s={0.9} />
    </g>
  );
};
