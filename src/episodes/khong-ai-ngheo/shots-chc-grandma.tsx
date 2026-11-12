import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, Glow, Dust, Rays, walkPose, joints, toWorld, reachAngle, FONT, ShotProps,
} from '../../engine';
import { DawnAlley } from '../tien-vo-han/che-dawn-alley-backdrop';
import { Backpack, KID_A, KID_B } from '../tien-vo-han/che-world-icons-and-people';
import { GRANDMA } from './cast-looks';
import { LotteryStrip, PorchBackdrop, PorchChair, PorchTable, Teapot, TeaCup, Bird, RainStreaks, ScrollingPavement } from './chc-grandma-props';

// Chapter C, "3 fun: grandma" (110.92-120.89 s): C9 the ticket seller at the alley mouth, C10 thirty years of feet in sun
// and rain, C11 she sits on her porch and pours tea, C12 she points kids the way to school, C13 slow push-in, birds, steam.

const G = GRANDMA;
const FLOOR = 800;
const SEAT_S = 1.4;
// seated in profile: thighs forward, shins down; hips ~ one shin above the floor
const SEAT_HIP = FLOOR - 68 * SEAT_S - 8;
const seated = (extra: Partial<Pose>): Pose => ({
  ...basePose, x: 980, y: SEAT_HIP, scale: SEAT_S, yaw: 0.7, facing: 1, legL: { a: 82, b: -80 }, legR: { a: 78, b: -78 }, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, ...extra,
});

// ---------- C9: medium: grandma at the mouth of the alley in the early light, calling, a strip of tickets in her raised hand ----------
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = {
    ...basePose, x: 1050, y: 640, scale: 1.55, yaw: 0.35, facing: 1, headTilt: 3 + 2 * Math.sin(t / 10), look: 0.3,
    armL: { a: 12, b: 6 }, armR: { a: 128 + 4 * Math.sin(t / 6), b: 12 }, ...faceAt(t, [[0, 'neutral']]),
  };
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <DawnAlley t={t + 20} id="c10st" blur={10} cart />
      <Hero look={G} pose={pose} rimId="rimR" shadow={0} />
      <LotteryStrip x={hand.x + 6} y={hand.y - 4} t={t} s={1.15} />
      <Dust t={t} seed={3} x0={700} y0={300} w={800} h={500} n={22} o={0.5} />
    </g>
  );
};

// ---------- C10: low: grandma's feet walk and walk; sun, then rain, then sun; "30 NĂM" stamps on ----------
export const C10: React.FC<ShotProps> = ({ t, len }) => {
  const rainIn = clamp((t - Math.round(len * 0.4)) / 6) * (1 - clamp((t - Math.round(len * 0.78)) / 6));
  const pose = walkPose(960, t * 0.55, 700, 1.5, { yaw: 1 });
  const stamp = backOut(clamp((t - 10) / 8));
  return (
    <g>
      <g transform={camT(960, kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 2.5], [len, 2.8]]))}>
        <rect x={-400} y={-400} width={2720} height={1100} fill="#FFD9A0" />
        <Rays x={420} y={200} t={t} len={900} n={9} o={0.5} />
        <rect x={-400} y={-400} width={2720} height={1100} fill="#46506A" opacity={rainIn} />
        <ScrollingPavement t={t} top={700} speed={11} wet={rainIn > 0.5 ? 1 : 0} />
        <Hero look={G} pose={pose} rimId="rimR" shadow={0} />
        <g opacity={rainIn}><RainStreaks t={t} n={90} /></g>
        <Glow x={420} y={260} r={700} o={0.4 * (1 - rainIn)} />
      </g>
      <g transform={`translate(960 210) scale(${stamp}) rotate(-4)`} opacity={stamp > 0 ? 1 : 0}>
        <text textAnchor="middle" fontFamily={FONT.hand} fontSize={200} fill="#FFE27A" stroke="#1A1230" strokeWidth={18} paintOrder="stroke">30 NĂM</text>
      </g>
    </g>
  );
};

// ---------- C11: porch, wide: grandma settles on the chair, lifts the teapot and pours into a cup, steam rising ----------
export const C11: React.FC<ShotProps> = ({ t, len }) => {
  const tableX = 1240;
  const tableTop = 640;
  const potTable = { x: tableX - 40, y: tableTop - 4 };
  const base = seated({});
  const lift = easeOut(clamp((t - 24) / 10));
  const pourK = easeOut(clamp((t - 38) / 8));
  const reachT = { x: potTable.x, y: potTable.y - 60 };
  const arm = reachAngle(base, reachT);
  const pose: Pose = { ...base, armR: { a: arm * (0.75 + 0.25 * lift) - 14 * lift, b: 8 }, headTilt: 3, look: 0.6, ...faceAt(t, [[0, 'happy']]) };
  const hand = toWorld(pose, joints(pose).armR.end);
  const pot = { x: potTable.x + (hand.x - 20 - potTable.x) * lift, y: potTable.y + (hand.y + 30 - potTable.y) * lift - 36 * lift };
  const cup = { x: tableX + 40, y: tableTop - 2 };
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1100]]), 590, kf(t, [[0, 1.25], [len, 1.45]]))}>
      <PorchBackdrop t={t + 50} id="c12p" />
      <PorchTable x={tableX} y={tableTop} />
      <TeaCup x={cup.x} y={cup.y} t={t} level={pourK} />
      <PorchChair x={1005} y={SEAT_HIP + 58} />
      <Hero look={G} pose={pose} rimId="rimR" shadow={0} />
      <Teapot x={pot.x} y={pot.y} tilt={pourK * 22} t={t} s={0.9} steam={lift > 0.1} />
      {pourK > 0.3 ? <path d={`M ${pot.x + 70} ${pot.y - 62} Q ${cup.x - 6} ${pot.y - 40} ${cup.x} ${cup.y - 50}`} stroke="#C9843A" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
    </g>
  );
};

// ---------- C12: medium: two schoolkids stop at the porch; grandma points the way, they brighten and walk on ----------
export const C12: React.FC<ShotProps> = ({ t, len }) => {
  const point = easeOut(clamp((t - 6) / 8));
  const base = seated({ x: 780 });
  const pose: Pose = { ...base, handR: 'point', armR: { a: 14 + point * 86, b: 4 }, look: 0.7, ...faceAt(t, [[0, 'happy']]) };
  const go = clamp((t - 26) / (len - 26));
  const arrive = easeOut(clamp(t / 14));
  const kx = (k: number) => 1500 - arrive * 300 + k * 130 + go * go * 800;
  const kid = (k: number): Pose => ({ ...basePose, x: kx(k), y: 890 - 140 * 1.15 - Math.abs(Math.sin(go * 14 + k)) * 6 * (go > 0 ? 1 : 0), scale: 1.15, yaw: go > 0 ? 0.9 : -0.5, facing: go > 0 ? 1 : -1, armL: { a: go > 0 ? 18 * Math.sin(go * 14 + k) : 10, b: 8 }, armR: { a: go > 0 ? -18 * Math.sin(go * 14 + k) : 10, b: 8 }, legL: { a: go > 0 ? 22 * Math.sin(go * 14 + k) : 5, b: 0 }, legR: { a: go > 0 ? -22 * Math.sin(go * 14 + k) : -5, b: 0 }, ...faceAt(t, [[0, 'worried'], [20, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 620, kf(t, [[0, 1.35], [len, 1.4]]))}>
      <PorchBackdrop t={t + 90} id="c13p" />
      <PorchChair x={805} y={SEAT_HIP + 58} />
      <Hero look={G} pose={pose} rimId="rimR" shadow={0} />
      {[0, 1].map((k) => {
        const p = kid(k);
        return (
          <g key={k}>
            <Backpack x={p.x - (go > 0 ? 34 : -34) * 1.15} y={p.y - 54} s={1.1} color={k ? '#3E8C86' : '#E9654B'} flip={go > 0} />
            <Hero look={k ? KID_B : KID_A} pose={p} rimId="rimR" shadow={0} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- C13: close, slow push-in: grandma holds her cup, eyes soft, steam curling, birds crossing the sky ----------
export const C13: React.FC<ShotProps> = ({ t, len }) => {
  const base = seated({ x: 980 });
  const pose: Pose = { ...base, armR: { a: 74, b: 70 }, headTilt: 2 + Math.sin(t / 20) * 2, look: 0.2, ...faceAt(t, [[0, 'happy']]), blink: 0.75 };
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1030]]), kf(t, [[0, 600], [len, 520]]), kf(t, [[0, 1.7], [len, 2.9]]))}>
      <PorchBackdrop t={t + 120} id="c14p" />
      <PorchChair x={1005} y={SEAT_HIP + 58} />
      <Hero look={G} pose={pose} rimId="rimR" shadow={0} />
      <TeaCup x={hand.x + 6} y={hand.y + 40} s={0.85} t={t} />
      {[0, 1, 2].map((i) => <Bird key={i} x={kf(t, [[0, 120 + i * 140], [len, 1900 + i * 140]]) - 100} y={260 - i * 55 + Math.sin(t / 9 + i) * 16} t={t} seed={i} s={0.8} />)}
      <Bird x={1230} y={530} t={t} fly={0} s={0.9} seed={2} />
    </g>
  );
};
