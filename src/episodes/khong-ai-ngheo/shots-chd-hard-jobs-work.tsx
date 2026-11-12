import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, joints, toWorld, streetStand, LEG_LEN, Haze, Glow, rnd, ShotProps,
} from '../../engine';
import { DawnAlley } from '../tien-vo-han/che-dawn-alley-backdrop';
import { WORKER } from './cast-looks';
import { Bag, GarbageTruck, UpChip } from './chd-jobs-props';
import { CoffeeHillside, CoffeeBush, SLOPE_Y } from './chd-coffee-slope-scenery';

// Chapter D, "hard jobs" (D4-D6): the WORKER sweeping the street at dawn, tossing a bag into a garbage truck, picking
// coffee cherries on a steep Tây Nguyên slope. Each beat is one short phrase ("Quét đường." "Đổ rác." "Hái cà phê...").

// ---------- D4: dawn street, the sweeper swings a long broom; leaves skitter, a wage arrow pops ----------
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const at = streetStand(0.1, 3.3);
  const sw = Math.sin(t * 0.34);
  const pose: Pose = {
    ...basePose, ...at, yaw: 0.85, tilt: 7 + sw * 3, look: 0.5,
    armR: { a: 52 + sw * 16, b: 18 }, armL: { a: 44 + sw * 16, b: 22 },
    legL: { a: 14, b: 6 }, legR: { a: -10, b: 0 }, handR: 'open', sway: sw * 6,
  };
  const hand = toWorld(pose, joints(pose).armR.end);
  const gy = at.y + LEG_LEN * at.scale + 4;
  const gx = hand.x + 0.62 * (gy - hand.y);
  return (
    <g transform={camT(kf(t, [[0, at.x + 20], [len, at.x + 5]]), 640, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <DawnAlley t={t + 40} id="d4a" />
      {/* leaves skitter ahead of the bristles */}
      {Array.from({ length: 9 }).map((_, i) => {
        const ph = (t * 0.07 + rnd(3, i)) % 1;
        return <ellipse key={i} cx={gx + 40 + ph * 170} cy={gy - 6 - Math.sin(ph * 3.14) * 40 - rnd(4, i) * 10} rx={11} ry={5} fill={i % 2 ? '#C98A3A' : '#8F6A2A'} opacity={1 - ph * 0.8} transform={`rotate(${ph * 300} ${gx + 40 + ph * 170} ${gy})`} />;
      })}
      <Hero look={WORKER} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.6} />
      <path d={`M ${hand.x} ${hand.y} L ${gx} ${gy}`} stroke="#8B5A3C" strokeWidth={9} strokeLinecap="round" />
      <path d={`M ${gx - 34} ${gy + 2} L ${gx + 36} ${gy - 8} L ${gx + 46} ${gy + 8} L ${gx - 26} ${gy + 14} Z`} fill="#D9A441" stroke="#7A5A20" strokeWidth={4} />
      <UpChip x={at.x + 170} y={at.y - 290} k={(t - 6) / 16} s={0.9} c="#1E8F4E" />
    </g>
  );
};

// ---------- D5: medium: the WORKER heaves a bag up into the garbage truck's hopper ----------
export const D5: React.FC<ShotProps> = ({ t, len }) => {
  const gy = 905;
  const sc = 0.95;
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 1640, y: gy - LEG_LEN * sc, scale: sc, yaw: -0.9, facing: -1, tilt: -4, armL: { a: 40, b: 10 }, armR: { a: 22, b: 12 }, look: -0.5 } },
    { f: 7, p: { tilt: -12, armL: { a: 20, b: 6 }, armR: { a: 18, b: 6 } } },
    { f: 13, p: { tilt: 6, armL: { a: 128, b: -10 }, armR: { a: 28, b: 6 } }, ease: easeOut },
    { f: 24, p: { tilt: 2, armL: { a: 70, b: 0 }, armR: { a: 24, b: 6 } } },
  ]);
  const k = clamp((t - 12) / 12);
  const hand = toWorld(pose, joints(pose).armL.end);
  const held = { x: hand.x - 10, y: hand.y + 24 };
  const bx = k > 0 ? held.x + (1430 - held.x) * k : held.x;
  const by = k > 0 ? held.y + (470 - held.y) * k - Math.sin(k * Math.PI) * 190 : held.y;
  const inside = k >= 1;
  const shakeY = Math.sin(t * 2.2) * 2;
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1000]]), 590, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <DawnAlley t={t + 90} id="d5a" blur={6} />
      <GarbageTruck x={900} y={gy + shakeY} s={1.7} t={t} lift={inside ? 6 : 0} />
      {Array.from({ length: 5 }).map((_, i) => {
        const ph = ((t * 0.5 + i * 9) % 40) / 40;
        return <circle key={i} cx={560 + ph * 80 + i * 6} cy={gy - 40 - ph * 90} r={14 + ph * 26} fill="#8E8A94" opacity={(1 - ph) * 0.4} filter="url(#blur6)" />;
      })}
      <Hero look={WORKER} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [14, 'happy']]) }} rimId="rimL" shadow={0.6} />
      {!inside ? <Bag x={bx} y={by} s={1.05} rot={k * 260} /> : null}
      {inside ? <circle cx={1440} cy={430} r={clamp(1 - (t - 24) / 6) * 40} fill="#fff" opacity={0.5} /> : null}
      <UpChip x={1720} y={300} k={(t - 14) / 12} s={0.9} c="#1E8F4E" />
    </g>
  );
};

// ---------- D6: the WORKER picks cherries on a steep red-soil slope, a basket on his back, mist drifting ----------
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const px = 980;
  const sc = 1.25;
  const gy = SLOPE_Y(px);
  const cyc = Math.sin(t * 0.45);
  const pose: Pose = {
    ...basePose, x: px, y: gy - LEG_LEN * sc + 6, scale: sc, yaw: 0.8, tilt: 9, look: 0.7,
    armR: { a: 104 + cyc * 8, b: -16 + cyc * 14 }, armL: { a: -86 - cyc * 8, b: 8 - cyc * 12 },
    legL: { a: 20, b: 4 }, legR: { a: -8, b: 0 }, sway: cyc * 4,
  };
  const picked = Math.min(8, Math.floor(t / 4.5));
  const hand = toWorld(pose, joints(pose).armR.end);
  const camX = kf(t, [[0, 1000], [len, 1060]]);
  return (
    <g transform={camT(camX, 520, kf(t, [[0, 1.2], [len, 1.35]]))}>
      <CoffeeHillside t={t + 20} />
      {/* basket on his back */}
      <g transform={`translate(${px - 78} ${pose.y - 150}) rotate(-18)`}>
        <path d="M -52 -120 L 52 -120 L 34 40 L -34 40 Z" fill="#B98A4A" stroke="#6E4A20" strokeWidth={5} />
        {[-70, -30, 10].map((y) => <path key={y} d={`M -50 ${y} H 50`} stroke="#8A6030" strokeWidth={4} />)}
        <circle cx={0} cy={-122} r={4} fill="#D9302E" />
      </g>
      <Hero look={WORKER} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [18, 'happy']]) }} rimId="rimL" shadow={0.4} />
      {/* the bush she is picking, in front of her hand */}
      <CoffeeBush x={px + 250} y={SLOPE_Y(px + 250) + 8} s={1.1} sway={Math.sin(t / 9) * 1.5} seed={77} picked={picked} />
      {/* a cherry flies to her hand every cycle */}
      {[0, 1, 2].map((i) => {
        const q = ((t + i * 13) % 39) / 39;
        return <circle key={i} cx={px + 250 - (px + 250 - hand.x) * q + 10} cy={hand.y - 20 + Math.sin(q * 3.14) * -30} r={8} fill="#D9302E" stroke="#7A1616" strokeWidth={2.5} opacity={q > 0.9 ? 0 : 1} />;
      })}
      <Haze y={800} h={300} o={0.25} />
      <Glow x={330} y={250} r={700} o={0.25} />
      <UpChip x={px + 90} y={pose.y - 520} k={(t - 10) / 14} s={1.1} c="#1E8F4E" />
    </g>
  );
};
