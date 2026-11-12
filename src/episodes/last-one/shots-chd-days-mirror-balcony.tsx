import React from 'react';
import {
  Hero, Pose, poseAt, walkPose, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, reachAngle,
  BEDROOM, RoomShell, Box, FloorShadow, stand, Glow, LightVeil, Dust, Foreground, WallFrame, ShotProps,
} from '../../engine';
import { Candle } from './chd-local-props';
import { Balcony, PlantBong, BALCONY_FLOOR } from './chd-balcony-and-plant';

// Chapter D, the days alone. D7 (day 10): Pip talks to himself in front of a mirror, his reflection talking back.
// D8 (day 20): on the balcony at dusk he pins a name tag on a potted plant: BÔNG. D9: he sits cross-legged and tells it
// about his day. Lips move by swapping neutral / worried (same eyes, so it never reads as a blink).

const PIP = LOOKS.pipHood;
const flap = (t: number, every = 3) => (Math.floor(t / every) % 2 === 0 ? ('worried' as const) : ('neutral' as const));

// ---------- D7: medium, a bedroom corner by candlelight: Pip and his reflection, both talking ----------
const R = BEDROOM;
const MIRROR = { x0: 690, x1: 920, y0: 350, y1: 742 };
const D7_STAND = stand(R, 0.66, 0.4);
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const talk = flap(t);
  const talkR = flap(t - 1);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: D7_STAND.x, y: D7_STAND.y, scale: D7_STAND.scale, yaw: -0.6, look: -0.9, armL: { a: 20, b: 20 }, armR: { a: 12, b: -6 } } },
    { f: 10, p: { armL: { a: 70, b: 40 }, headTilt: -3 } },
    { f: 22, p: { armL: { a: 38, b: 54 }, headTilt: 2 } },
    { f: 34, p: { armL: { a: 76, b: 30 }, headTilt: -3 } },
    { f: 46, p: { armL: { a: 44, b: 48 }, headTilt: 1 } },
  ]);
  const rs = D7_STAND.scale * 0.68;
  const mid = (MIRROR.x0 + MIRROR.x1) / 2;
  const candle = R.P(0.5, 0.78, 0.08);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 570, kf(t, [[0, 1.55], [len, 1.66]]))}>
      <RoomShell r={R} id="d7r" wall="#2E3352" side="#252A44" floorC="#2A2232" ceiling="#15182A" lines="#1C1724" />
      <WallFrame x={1010} y={400} w={110} h={140} art={1} />
      {/* the standing mirror against the back wall: frame, glass, and Pip's reflection behind the glass */}
      <FloorShadow r={R} u={[0.25, 0.5]} w={[0, 0.03]} />
      <rect x={MIRROR.x0 - 16} y={MIRROR.y0 - 16} width={MIRROR.x1 - MIRROR.x0 + 32} height={MIRROR.y1 - MIRROR.y0 + 16} rx={10} fill="#3A2E36" />
      <rect x={MIRROR.x0 - 16} y={MIRROR.y0 - 16} width={6} height={MIRROR.y1 - MIRROR.y0 + 16} fill="#FFC98A" opacity={0.4} />
      <defs>
        <clipPath id="d7glass">
          <rect x={MIRROR.x0} y={MIRROR.y0} width={MIRROR.x1 - MIRROR.x0} height={MIRROR.y1 - MIRROR.y0} />
        </clipPath>
      </defs>
      <rect x={MIRROR.x0} y={MIRROR.y0} width={MIRROR.x1 - MIRROR.x0} height={MIRROR.y1 - MIRROR.y0} fill="#46507A" />
      <g clipPath="url(#d7glass)">
        <rect x={MIRROR.x0} y={MIRROR.y0} width={MIRROR.x1 - MIRROR.x0} height={MIRROR.y1 - MIRROR.y0} fill="#2E3558" />
        <g opacity={0.92}>
          <Hero look={PIP} pose={{ ...pose, x: mid, y: MIRROR.y1 - 8 - LEG_LEN * rs, scale: rs, yaw: 0.25, look: 0.1, armL: { a: 20, b: 20 }, armR: { a: 40 + Math.sin(t / 5) * 14, b: 40 }, expr: talkR, blink: 0, headTilt: 0 }} rimId="rimR" shadow={0} />
        </g>
        <path d={`M ${MIRROR.x0 + 20} ${MIRROR.y1} L ${MIRROR.x0 + 100} ${MIRROR.y0} L ${MIRROR.x0 + 130} ${MIRROR.y0} L ${MIRROR.x0 + 50} ${MIRROR.y1} Z`} fill="#fff" opacity={0.08} />
      </g>
      {/* a little table with the candle, then the light */}
      <FloorShadow r={R} u={[0.43, 0.58]} w={[0.02, 0.12]} />
      <Box r={R} u={[0.43, 0.58]} v={[0.78, 1]} w={[0.02, 0.12]} front="#40323A" top="#54434A" side="#30252C" rim />
      <Candle x={candle.x} y={candle.y - 2} t={t} s={1.5} h={36} seed={4} />
      <LightVeil id="d7veil" lights={[[candle.x, candle.y - 60, 420], [mid, 520, 260]]} o={0.4} />
      <Glow x={candle.x} y={candle.y - 60} r={380} o={0.42} />
      <Hero look={PIP} pose={{ ...pose, expr: talk, blink: 0 }} rimId="rimL" shadow={0} />
      <Dust t={t + 30} seed={21} x0={candle.x - 220} y0={candle.y - 260} w={440} h={300} n={14} o={0.4} />
    </g>
  );
};

// ---------- D8: wide, the balcony at dusk: Pip walks to the plant and pins a name tag on it: BÔNG ----------
const SC = 1.0;
const HIP_Y = BALCONY_FLOOR - LEG_LEN * SC;
const PLANT_X = 1280;
const PLANT_S = 0.8;
export const D8: React.FC<ShotProps> = ({ t, len }) => {
  const lin = (u: number) => u;
  const x1 = 1090;
  let pose: Pose;
  if (t < 20) {
    pose = walkPose(kf(t, [[0, 380], [20, x1]], lin), t * 0.62, BALCONY_FLOOR, SC, {}, 1);
  } else {
    const w20 = walkPose(x1, 20 * 0.62, BALCONY_FLOOR, SC, {}, 1);
    const target = { x: PLANT_X + 70 * PLANT_S - 96, y: BALCONY_FLOOR - 330 * PLANT_S + 50 };
    const stood: Pose = { ...w20, x: x1, y: HIP_Y, yaw: 0.8, tilt: 0, sway: 0, look: 0.6, headTilt: 0, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 }, armL: { a: 12, b: -6 } };
    const reach = reachAngle({ ...stood, armR: { a: 0, b: 0 } }, target);
    pose = poseAt(t, [
      { f: 20, p: w20 },
      { f: 27, p: stood },
      { f: 34, p: { armR: { a: reach, b: 4 }, tilt: 3 }, ease: easeOut },
      { f: 58, p: {} },
      { f: 68, p: { armR: { a: 20, b: 14 }, tilt: 0, look: 0.2 } },
    ]);
  }
  const tag = clamp((t - 33) / 7);
  const write = clamp((t - 41) / 18);
  const face = clamp((t - 66) / 6);
  const expr = t < 62 ? 'neutral' : 'happy';
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1170]]), kf(t, [[0, 600], [len, 640]]), kf(t, [[0, 1.12], [len, 1.42]]))}>
      <Balcony t={t + 20} id="d8" />
      <PlantBong x={PLANT_X} s={PLANT_S} t={t} id="d8p" tag={tag} write={write} face={face} />
      <Hero look={PIP} pose={{ ...pose, expr, blink: t % 80 > 76 ? 1 : 0 }} rimId="rimR" shadow={0.6} />
      <Foreground blur={10}>
        <path d="M -200 1100 L -200 940 Q 100 900 380 960 L 380 1100 Z" fill="#0E0A14" />
      </Foreground>
    </g>
  );
};

// ---------- D9: medium, sitting cross-legged on the boards, telling the plant about his day, hands going ----------
const SIT_Y = BALCONY_FLOOR - 4 * SC;
export const D9: React.FC<ShotProps> = ({ t, len }) => {
  const beat = Math.sin(t / 5);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 860, y: SIT_Y, scale: SC, yaw: 0.8, look: 0.7, tilt: 3, armL: { a: 20, b: 40 }, armR: { a: 50, b: 40 }, legL: { a: 84, b: -150 }, legR: { a: 64, b: -128 } } },
    { f: 16, p: { armR: { a: 118, b: 20 }, tilt: 5 } },
    { f: 32, p: { armR: { a: 60, b: 54 }, tilt: 1, headTilt: 3 } },
    { f: 48, p: { armR: { a: 130, b: 10 }, armL: { a: 70, b: 30 }, tilt: 5 } },
    { f: 70, p: { armR: { a: 80, b: 40 }, armL: { a: 20, b: 40 }, tilt: 2 } },
  ]);
  const expr = t > 52 ? (Math.floor(t / 3) % 2 === 0 ? 'happy' : 'neutral') : flap(t, 3);
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1090]]), 760, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Balcony t={t + 140} id="d9" />
      <PlantBong x={1330} s={0.8} t={t + 60} id="d9p" tag={1} write={1} face={1} />
      <Hero look={PIP} pose={{ ...pose, expr, blink: 0, headTilt: pose.headTilt + beat * 2 }} rimId="rimR" shadow={0} />
      <ellipse cx={900} cy={BALCONY_FLOOR + 6} rx={150} ry={16} fill="#000" opacity={0.4} />
      <Foreground blur={10}>
        <path d="M -200 1100 L -200 1010 Q 300 960 700 1020 L 700 1100 Z" fill="#0E0A14" />
      </Foreground>
    </g>
  );
};
