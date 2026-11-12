import React from 'react';
import {
  Hero, ShotProps, LOOKS, basePose, Pose, faceAt, kf, clamp, easeOut, camT, Glow, Dust, Foreground, LEG_LEN,
  Kitchen, KITCHEN, KitchenIsland, islandTop, stand,
} from '../../engine';
import { Candle, Dim } from '../last-one/shots-chc-shared-props-and-cards';

// Chapter C, "week one: family" (look blackout): the family round one candle in the dark kitchen. C10 wide, C11 the flame, C12-C14 slow
// push-in on mum as she speaks softly, C15 sis leans on her. Everyone stands behind the island (its top hides their legs).

const PIP = LOOKS.pipHood;
const MUM = LOOKS.mom;
const SIS = LOOKS.sis;
const CANDLE = islandTop(0.5, 0.45);

/** Hero standing behind the island at u; `k` scales the figure (sis 0.72). */
const at = (u: number, k = 1) => {
  const a = stand(KITCHEN, u, 0.4);
  const sc = a.scale * k;
  return { x: a.x, y: a.y + (LEG_LEN * a.scale - LEG_LEN * sc), scale: sc };
};
const pose = (u: number, k: number, extra: Partial<Pose>): Pose => ({ ...basePose, ...at(u, k), ...extra });

/** The kitchen in the dark with the candle's glow on the island. */
const DarkKitchen: React.FC<{ t: number; id: string; glow?: number }> = ({ t, id, glow = 1 }) => (
  <g>
    <Kitchen t={t + 40} id={id} veil={0.6} />
    <Dim o={0.38} />
    <Glow x={CANDLE.x} y={CANDLE.y - 150} r={520} o={0.55 * glow} />
  </g>
);
const CandleOn: React.FC<{ t: number; s?: number }> = ({ t, s = 0.62 }) => <Candle x={CANDLE.x} y={CANDLE.y} t={t} s={s} glow={1} />;

// ---------- C10: wide: the family stands round the island, one candle on it; the room is dark ----------
export const C10: React.FC<ShotProps> = ({ t, len }) => {
  const p = pose(0.35, 1, { yaw: 0.5, facing: 1, look: 0.7, expr: 'tired', armL: { a: 10, b: 6 }, armR: { a: 12, b: 6 } });
  const m = pose(0.5, 1, { yaw: 0.1, look: 0.2, expr: 'neutral', armL: { a: 12, b: 8 }, armR: { a: 12, b: 8 } });
  const s = pose(0.64, 0.72, { yaw: -0.5, facing: -1, look: -0.7, expr: 'worried', armL: { a: 10, b: 6 }, armR: { a: 14, b: 8 } });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), kf(t, [[0, 560], [len, 590]]), kf(t, [[0, 1.15], [len, 1.4]]))}>
      <DarkKitchen t={t} id="fc10" />
      <Hero look={PIP} pose={{ ...p, headTilt: 3 }} rimId="rimR" shadow={0} />
      <Hero look={SIS} pose={s} rimId="rimL" shadow={0} />
      <Hero look={MUM} pose={m} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <CandleOn t={t} />
    </g>
  );
};

// ---------- C11: macro: the flame, three faces soft behind it ----------
export const C11: React.FC<ShotProps> = ({ t, len }) => {
  const face = (x: number, look: typeof PIP, yaw: number, k: number, expr: Pose['expr']) => (
    <Hero look={look} pose={{ ...basePose, x, y: 900 - 20 * k, scale: k, yaw, facing: yaw < 0 ? -1 : 1, expr, look: yaw * -0.8 }} rimId="rimR" shadow={0} />
  );
  return (
    <g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#120C16" />
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
        <Foreground blur={10}>
          {face(560, PIP, 0.6, 2.2, 'tired')}
          {face(1380, SIS, -0.6, 1.7, 'worried')}
          {face(960, MUM, 0, 2.3, 'neutral')}
        </Foreground>
        <Glow x={960} y={600} r={760} o={0.6} />
        <Candle x={960} y={1010} t={t} s={2.6} glow={1} />
        <Dust t={t} seed={5} x0={620} y0={300} w={700} h={500} n={22} o={0.5} />
      </g>
    </g>
  );
};

// ---------- C12: medium on mum, speaking softly (slow push-in begins) ----------
export const C12: React.FC<ShotProps> = ({ t, len }) => {
  const m = pose(0.5, 1, { yaw: 0.15, look: -0.3, expr: 'neutral', headTilt: kf(t, [[0, 0], [len, 3]]), armL: { a: 12, b: 8 }, armR: { a: 12, b: 8 } });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 620], [len, 600]]), kf(t, [[0, 1.55], [len, 1.8]]))}>
      <DarkKitchen t={t + 10} id="fc12" />
      <Hero look={MUM} pose={{ ...m, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <CandleOn t={t + 10} />
    </g>
  );
};

// ---------- C13: closer: mum in profile, eyes on the flame, thinking of how she used to see the law ----------
export const C13: React.FC<ShotProps> = ({ t, len }) => {
  const m = pose(0.5, 1, { yaw: 0.6, facing: 1, look: 0.6, expr: 'worried', headTilt: kf(t, [[0, 2], [len, 6]]), armL: { a: 12, b: 8 }, armR: { a: 12, b: 8 } });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), kf(t, [[0, 560], [len, 590]]), kf(t, [[0, 2.0], [len, 2.4]]))}>
      <DarkKitchen t={t + 20} id="fc13" />
      <Hero look={MUM} pose={m} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <CandleOn t={t + 20} />
      <Dust t={t} seed={9} x0={800} y0={300} w={400} h={300} n={14} o={0.5} />
    </g>
  );
};

// ---------- C14: close: mum turns her face to sis, a small smile as she understands ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => {
  const turn = easeOut(clamp(t / 14));
  const m = pose(0.5, 1, { yaw: 0.6 - 1.0 * turn, facing: turn > 0.5 ? -1 : 1, look: 0.6 - 1.2 * turn, headTilt: 6 - 10 * turn, armL: { a: 12, b: 8 }, armR: { a: 12, b: 8 } });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 1000]]), kf(t, [[0, 520], [len, 530]]), kf(t, [[0, 2.5], [len, 2.9]]))}>
      <DarkKitchen t={t + 30} id="fc14" />
      <Hero look={MUM} pose={{ ...m, ...faceAt(t, [[0, 'tired'], [12, 'happy']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <CandleOn t={t + 30} />
    </g>
  );
};

// ---------- C15: sis leans against mum's side; mum's arm closes round her; the candle burns ----------
export const C15: React.FC<ShotProps> = ({ t, len }) => {
  const lean = easeOut(clamp((t - 4) / 16));
  const m = pose(0.47, 1, { yaw: 0.35, facing: 1, look: 0.7, expr: 'happy', headTilt: 6 * lean, armL: { a: 12, b: 8 }, armR: { a: 12, b: 8 } });
  const sx = 0.64 - 0.075 * lean;
  const s = pose(sx, 0.72, { yaw: 0.2, facing: 1, look: 0.2, tilt: -9 * lean, headTilt: -10 * lean, expr: lean > 0.5 ? 'happy' : 'worried', armL: { a: 10, b: 6 }, armR: { a: 12, b: 8 }, blink: lean > 0.6 ? 0.7 : 0 });
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 1010]]), kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.9], [len, 2.15]]))}>
      <DarkKitchen t={t + 40} id="fc15" />
      <Hero look={SIS} pose={s} rimId="rimL" shadow={0} />
      <Hero look={MUM} pose={m} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <CandleOn t={t + 40} />
    </g>
  );
};
