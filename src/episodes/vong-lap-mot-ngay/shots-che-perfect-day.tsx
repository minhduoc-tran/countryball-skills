import React from 'react';
import { Hero, LOOKS, Pose, basePose, walkPose, faceAt, poseAt, kf, clamp, easeOut, easeInOut, camT, Foreground, Sparkle, Street, streetStand, joints, toWorld, reachAngle, Kitchen, KitchenIsland, KITCHEN, islandTop, stand, Tabletop, Rooftop, Glow, proj, ShotProps } from '../../engine';
import { MorningBedroom, BedDuvet, bedSit, MB } from './kit-morning-bedroom';
import { Granny, GRANNY } from './kit-cast-figures';
import { grannyPose } from './kit-cast';
import { MegaTicket, Dumbbell } from './kit-props';
import { WetRoad, RainVeil, HandUmbrella, slipStand, XR } from './kit-street-rain';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { Pill, CrossMark } from './che-common-props';
import { PhoBowl, LaughLines, PlasticStool } from './che-perfect-day-props';
import { JokeBubble, Awning } from './che-loop-repeats-from-cha';

// Chapter E, "8 perfect day" (258.92-274.27 s): no tricks, one ordinary, whole day.
//   E12 the 06:00 alarm: switched off gently, a smile, a stretch   E13 top-down: the ticket and the dumbbell crossed out
//   E14 a slow phở breakfast with mum   E15 Mo's same joke bubble, Pip still laughs   E16 the umbrella over the granny
//   E17 the rooftop at sunset, Pip on the parapet   E18 closer: content, the sun going down
const PIP = LOOKS.pipHood;

// ---------- E12 "Rồi một ngày, bạn quyết định làm khác.": the alarm rings; he switches it off gently and smiles ----------
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const S = bedSit(0.3);
  const base: Pose = { ...basePose, x: S.x, y: S.y, scale: S.scale, yaw: 0.5, facing: 1, look: 0.6, legL: { a: 80, b: 0 }, legR: { a: 80, b: 0 } };
  const reach = reachAngle(base, { x: MB.CLOCK.x - 10, y: MB.CLOCK.y - 50 });
  const pose = poseAt(t, [
    { f: 0, p: { ...base, armR: { a: 14, b: -6 }, armL: { a: 14, b: -6 }, ...faceAt(0, [[0, 'neutral']]) } },
    { f: 8, p: { armR: { a: reach, b: 0 } }, ease: easeOut },
    { f: 20, p: { armR: { a: reach + 4, b: 2 } } },
    { f: 30, p: { armR: { a: 110, b: 50 }, armL: { a: 110, b: 50 }, headTilt: -6 }, ease: easeInOut },
    { f: 48, p: { armR: { a: 118, b: 44 }, armL: { a: 118, b: 44 }, headTilt: -8 } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [24, 'happy']]);
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 800]]), 540, kf(t, [[0, 2.05], [len, 2.2]]))}>
      <MorningBedroom id="e12r" t={t + 600} ring={t < 20 ? 1 : 0} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
      <BedDuvet knees={0.4} />
      {t > 30 ? <Sparkle x={S.x + 30} y={S.y - 330 * S.scale} t={t - 30} s={0.7} /> : null}
    </g>
  );
};

// ---------- E13 "Không xổ số, không thử thách.": the desk from above, the ticket and the dumbbell crossed out on their words ----------
export const E13: React.FC<ShotProps> = ({ t, len }) => {
  const push = easeInOut(clamp((t - 44) / 18));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Tabletop edge={1300} />
      <Glow x={1500} y={160} r={700} o={0.4} />
      <g transform={`translate(${-60 * push} 0)`}>
        <MegaTicket x={600} y={470} s={1.15} id="e13t" rot={-7} nums={[5, 12, 19, 27, 33, 41]} />
        <CrossMark x={600} y={470} h={190} t={t - 3} />
        <Dumbbell x={1350} y={500} s={1.6} rot={18} />
        <CrossMark x={1350} y={500} h={190} t={t - 32} />
      </g>
      <Pill x={600} y={800} text="XỔ SỐ" t={t} at={2} size={48} />
      <Pill x={1350} y={800} text="THỬ THÁCH" t={t} at={31} size={48} />
      <InsertArm x={kf(t, [[40, 1980], [60, 1700]])} y={kf(t, [[40, 980], [60, 760]])} fx={2200} fy={1200} rot={-60} s={5} width={120} />
    </g>
  );
};

// ---------- E14 "Bạn ăn sáng thật chậm cùng mẹ.": phở at the kitchen island with mum, steam, morning sun ----------
export const E14: React.FC<ShotProps> = ({ t, len }) => {
  const ps = stand(KITCHEN, 0.4, 0.4);
  const ms = stand(KITCHEN, 0.62, 0.4);
  const talk = Math.sin(t / 5);
  const pip: Pose = { ...basePose, ...ps, yaw: 0.55, facing: 1, look: 0.6, headTilt: 3 + Math.sin(t / 13) * 2, armR: { a: 40, b: 50 }, armL: { a: 14, b: -6 }, ...faceAt(t, [[0, 'happy']]) };
  const mom: Pose = { ...basePose, ...ms, yaw: -0.55, facing: -1, look: -0.6, headTilt: -4 + talk * 3, armL: { a: 50 + talk * 12, b: 40 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'happy']]) };
  const b1 = islandTop(0.45, 0.4);
  const b2 = islandTop(0.57, 0.4);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), 560, kf(t, [[0, 1.75], [len, 1.85]]))}>
      <Kitchen t={t + 40} id="e14k" veil={0.42} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0} />
      <Hero look={LOOKS.mom} pose={mom} rimId="rimL" shadow={0} />
      <KitchenIsland stools={false} />
      <PhoBowl x={b1.x} y={b1.y - 20} s={0.42} t={t} />
      <PhoBowl x={b2.x} y={b2.y - 20} s={0.42} t={t + 20} />
      <Glow x={b1.x + 60} y={b1.y - 60} r={260} o={0.3} />
    </g>
  );
};

// ---------- E15 "Bạn nghe hết câu chuyện cười của Mo, và vẫn cười.": chapter A's sidewalk two-shot, the SAME joke bubble;
// on "vẫn cười" Pip bursts out laughing ----------
const MO_AT = streetStand(-6.4, 4.7, { sidewalk: true });
const PIP_ST = streetStand(-5.05, 4.6, { sidewalk: true });
const toScreen = (cx: number, cy: number, z: number, p: { x: number; y: number }) => ({ x: 960 + (p.x - cx) * z, y: 540 + (p.y - cy) * z });
export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const L = 52;
  const laugh = t >= L;
  const bounce = laugh ? Math.abs(Math.sin((t - L) / 2.6)) : 0;
  const g = Math.sin(t / 4);
  const mo: Pose = {
    ...basePose, ...MO_AT, yaw: 0.5, facing: 1, look: 0.6, headTilt: laugh ? -6 : g * 4,
    armL: { a: 20, b: -10 }, armR: { a: 60 + g * 16, b: 50 },
    ...faceAt(t, [[0, 'happy']]),
  };
  const pip: Pose = {
    ...basePose, ...PIP_ST, yaw: -0.5, facing: -1, look: -0.7, headTilt: laugh ? 10 + bounce * 6 : -2, squash: laugh ? bounce * 0.05 : 0,
    armL: laugh ? { a: 40, b: 70 } : { a: 10, b: -6 }, armR: laugh ? { a: 40, b: 70 } : { a: 10, b: -6 },
    ...faceAt(t, [[0, 'neutral'], [L, 'happy']]),
  };
  const cam = { x: (MO_AT.x + PIP_ST.x) / 2 + 90, y: MO_AT.y - 70, z: 1.85 };
  const ms = toScreen(cam.x, cam.y, cam.z, toWorld(mo, { x: 0, y: -176 }));
  const ps = toScreen(cam.x, cam.y, cam.z, toWorld(pip, { x: 0, y: -176 }));
  return (
    <g>
      <g transform={camT(kf(t, [[0, cam.x - 10], [len, cam.x + 10]]), cam.y, kf(t, [[0, cam.z], [len, cam.z * 1.05]]))}>
        <Street t={t + 600} id="e15st" veil={0.3} light="red" />
        <Hero look={LOOKS.mo} pose={mo} rimId="rimR" shadow={1} />
        <Hero look={PIP} pose={pip} rimId="rimL" shadow={1} />
      </g>
      <Awning t={t} />
      <JokeBubble x={ms.x + 40} y={ms.y - 330} t={t - 2} s={1.1} tail={1} />
      {laugh ? <LaughLines x={ps.x + 70} y={ps.y} s={1.4} t={t} dir={1} /> : null}
      {laugh ? <Sparkle x={ps.x + 40} y={ps.y - 150} t={t - L} s={1.2} /> : null}
    </g>
  );
};

// ---------- E16 "Bạn che ô cho bà cụ.": chapter D's close framing on the zebra in the rain: Pip walks her across under the gold umbrella ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const dX = kf(t, [[0, -0.5], [len, 0.25]], (x) => x);
  const gs = slipStand(dX);
  const g = { ...grannyPose(gs.x, gs.y, gs.scale, { facing: 1, walk: t * 0.35 }), ...faceAt(t, [[0, 'happy']]), look: -0.4, headTilt: -8 };
  const ps = streetStand(XR.SLIP.X - 0.75 + dX, XR.SLIP.Z - 0.15);
  const pip = walkPose(ps.x, t * 0.35, ps.y + 140 * ps.scale, ps.scale, { armL: { a: 166, b: -6 }, armR: { a: 50, b: 30 }, yaw: 0.55, look: 0.5, ...faceAt(t, [[0, 'happy']]) }, 1);
  const hand = toWorld(pip, joints(pip).armL.end);
  const SLIP = proj(XR.SLIP.X, 0, XR.SLIP.Z);
  return (
    <g>
      <g transform={camT(kf(t, [[0, SLIP.x - 40], [len, SLIP.x + 10]]), SLIP.y - 62, kf(t, [[0, 5.0], [len, 5.2]]))}>
        <Street t={t + 900} id="e16s" light="red" />
        <WetRoad t={t} id="e16w" />
        <Granny pose={g} rimId="rimR" shadow={0.7} />
        <Hero look={PIP} pose={pip} rimId="rimR" shadow={0.6} />
        <HandUmbrella x={hand.x} y={hand.y} s={pip.scale * 1.15} t={t} rot={10} color="#D9A441" />
      </g>
      <RainVeil t={t} id="e16r" />
    </g>
  );
};

// ---------- E17 "Rồi bạn ngồi nhìn hoàng hôn.": the rooftop, Pip sits on the parapet facing the low sun ----------
const seated = (t: number, x: number, y: number, scale: number): Pose => ({
  ...basePose, x, y, scale, yaw: 0.85, facing: 1, look: 0.8, headTilt: -2 + Math.sin(t / 16) * 2,
  legL: { a: 82, b: -84 }, legR: { a: 76, b: -78 }, armL: { a: 20, b: -10 }, armR: { a: 24, b: -14 },
});
export const E17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Rooftop t={t + 300} sunX={1260} sunY={kf(t, [[0, 640], [len, 652]])} />
    <PlasticStool x={745} y={772} s={0.62} />
    <Hero look={PIP} pose={{ ...seated(t, 760, 760, 0.95), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
  </g>
);

// ---------- E18 "Một ngày bình thường, nhưng trọn vẹn.": closer and lower; the sun sinks, he closes his eyes, content ----------
export const E18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = { ...seated(t, 760, 760, 0.95), ...faceAt(t, [[0, 'happy']]), blink: t > 40 && t < 86 ? 1 : 0, headTilt: 4 + Math.sin(t / 16) * 2 };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), kf(t, [[0, 600], [len, 620]]), kf(t, [[0, 2.0], [len, 2.25]]))}>
      <Rooftop t={t + 360} sunX={1260} sunY={kf(t, [[0, 655], [len, 700]])} />
      <PlasticStool x={745} y={772} s={0.62} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Sparkle x={1000} y={520} t={(t % 50) - 6} s={0.6} />
      <Sparkle x={640} y={470} t={((t + 25) % 50) - 6} s={0.5} />
    </g>
  );
};
