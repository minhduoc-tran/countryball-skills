import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, camT, LOOKS, Supermarket, SUPERMARKET, aisleStand, walkPose,
  joints, toWorld, MacroRow, macroRow, Glow, LightVeil, Sparkle, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { OWNER, MilkCarton, CounterFront } from './cha-shop-and-milk-props';

// Chapter A cold open, the shop: Pip walks into the convenience store (A4), takes a carton of milk off the shelf (A5),
// strolls across the shop to the door with it (A6) and past the counter, where the cashier only stares (A7).

const PIP = LOOKS.pipHood;
const CASHIER_AT = SUPERMARKET.P(0.77, 1, 0.0);
const COUNTER_TOP_Y = SUPERMARKET.P(0.77, 0.8, 0).y;

/** Walking toward the camera, three-quarter view: legs scissor, arms swing, a small bob. */
const walkFront = (x: number, y: number, scale: number, phase: number, extra: Partial<Pose> = {}): Pose => {
  const s = Math.sin(phase);
  return {
    ...basePose, x, y: y - Math.abs(Math.cos(phase)) * 5 * scale, scale, yaw: 0.25, facing: 1, tilt: 2,
    legL: { a: 26 * s, b: -Math.max(0, 30 * Math.sin(phase + 1.2)) }, legR: { a: -26 * s, b: -Math.max(0, 30 * Math.sin(phase + 1.2 + Math.PI)) },
    armL: { a: 22 * s, b: 12 }, armR: { a: -22 * s, b: 12 }, sway: 8 * Math.sin(phase), ...extra,
  };
};

/** The cashier behind the far checkout: only the part above the counter shows (a clip at the counter's far edge). */
const FarCashier: React.FC<{ t: number; look: number; yaw: number; expr?: 'neutral' | 'shock' | 'worried' }> = ({ t, look, yaw, expr = 'neutral' }) => {
  const sc = 0.2;
  const pose: Pose = { ...basePose, x: CASHIER_AT.x, y: CASHIER_AT.y - 140 * sc - 24 * sc, scale: sc, yaw, look, expr, headTilt: Math.sin(t / 20) * 2, armL: { a: 20, b: 40 }, armR: { a: 20, b: 40 } };
  return (
    <g>
      <clipPath id="sa-cash-clip"><rect x={900} y={0} width={400} height={COUNTER_TOP_Y + 2} /></clipPath>
      <g clipPath="url(#sa-cash-clip)"><Hero look={OWNER} pose={pose} rimId="rimL" shadow={0} /></g>
    </g>
  );
};

// ---------- A4: wide, the aisle: the entrance doors glow with the dusk, Pip walks in; the cashier looks up ----------
export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / (len + 4));
  const s = aisleStand(kf(t, [[0, 0.5], [len, 0.44]]), 0.1 + 0.5 * easeOut(p), 0.5);
  const pose = walkFront(s.x, s.y, s.scale, t * 0.6, { look: -0.3 });
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Supermarket t={t + 30} id="sa4" />
      <FarCashier t={t} look={-0.4} yaw={-0.4} expr={t > 12 ? 'worried' : 'neutral'} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- A5: macro, the milk shelf; his mitten takes one carton and lifts it out of frame ----------
const ROW = macroRow(31, ['carton', 'carton', 'bottle', 'box'], -60, 2100, 200);
export const A5: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp(t / 9));
  const lift = easeInOut(clamp((t - 12) / 17));
  const hx = kf(t, [[0, 120], [9, 930]], (v) => v) + 60 * lift;
  const hy = kf(t, [[0, 700], [9, 700]], (v) => v) - 360 * lift;
  const cx = 930 + 60 * lift;
  const cy = 900 - 360 * lift;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <rect x={-200} y={-200} width={2320} height={1500} fill="#262B39" />
      <g filter="url(#blur6)" opacity={0.85}><MacroRow slots={ROW} y={760} h={340} lip /></g>
      <Glow x={940} y={140} r={800} kind="cool" o={0.35} />
      <LightVeil id="sa5veil" lights={[[940, 520, 700]]} o={0.45} />
      <MilkCarton x={cx} y={cy} s={5.4} rot={-6 * lift} />
      <MilkCarton x={cx - 250} y={900} s={5.4} />
      <MilkCarton x={cx + 270} y={900} s={5.4} />
      <InsertArm x={hx - 70 * reach} y={hy - 150 + 20 * (1 - reach)} fx={-300} fy={hy + 120} rot={-20 + 25 * lift} s={4.8} />
      <Sparkle x={cx + 90} y={cy - 330} t={t - 10} s={0.9} />
    </g>
  );
};

// ---------- A6: wide, he strolls across the shop to the doors with the milk swinging in his hand ----------
export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const u = kf(t, [[0, 0.2], [len, 0.46]], (v) => v);
  const s = aisleStand(u, 0.2, 0.55);
  const pose = walkPose(s.x, t * 0.62, s.y + 140 * s.scale, s.scale, { armR: { a: 18, b: 8 }, look: 0.4 });
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 540, 1.18)}>
      <Supermarket t={t + 60} id="sa6" />
      <FarCashier t={t} look={kf(t, [[0, -0.6], [len, 0.8]])} yaw={kf(t, [[0, -0.5], [len, 0.3]])} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimL" shadow={0} />
      <MilkCarton x={hand.x + 2} y={hand.y + 18 * s.scale} s={0.3 * s.scale * 3} rot={Math.sin(t * 0.62) * 12} />
    </g>
  );
};

// ---------- A7: medium, the counter: Pip walks past with the milk, the cashier's eyes follow, then he's gone ----------
export const A7: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 120], [len - 8, 2100]], (v) => v);
  const sc = 1.1;
  const pose = walkPose(x, t * 0.55, 1040, sc, { armR: { a: 12, b: 6 }, look: 0.2 });
  const hand = toWorld(pose, joints(pose).armR.end);
  const track = clamp((x - 200) / 1500);
  const cash: Pose = {
    ...basePose, x: 1380, y: 880, scale: 1.05, yaw: kf(track, [[0, -0.5], [1, 0.55]]), look: kf(track, [[0, -0.8], [1, 0.9]]),
    armL: { a: 20, b: 40 }, armR: { a: 20, b: 40 }, headTilt: kf(track, [[0, 3], [1, -3]]),
  };
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.05]])}) translate(-960 -540)`}>
      <g filter="url(#blur10)">
        <g transform="translate(-300 -100) scale(1.6)"><Supermarket t={t + 90} id="sa7" /></g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1500} fill="#0A0814" opacity={0.3} />
      <Hero look={OWNER} pose={{ ...cash, ...faceAt(t, [[0, 'neutral'], [len - 22, 'shock']]) }} rimId="rimL" shadow={0} />
      <CounterFront x0={820} x1={2060} top={830} id="sa7c" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      <MilkCarton x={hand.x + 4} y={hand.y + 30} s={1.1} rot={Math.sin(t * 0.55) * 10} />
    </g>
  );
};
