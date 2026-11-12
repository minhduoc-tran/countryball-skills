import React from 'react';
import { Hero, Street, ShotProps, LOOKS, basePose, Pose, walkPose, faceAt, kf, clamp, easeOut, backOut, camT, SCH, SchLabel, FONT, Glow, Bus, propScale, Dust } from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { UkraineOutline, SourceTag, TickBadge, CardBase, uaPoint, streamPos } from './chc-cards-and-icons';
import { WORKER, hipFor } from './chc-neighbours-props';
import { BackpackWorn, PACK } from './chc-backpack-and-cat-props';
import { armTo, ped, floorOf, roadPt } from './chc-pose-utils';

// Chapter C, month one, the goodbye (look "m1"): C22-C23 the number card (more than 6 million people left Ukraine,
// UNHCR, "ĐÓ LÀ THẬT"); C24-C26 the bus station: Mo stays with his dad, the long hug, the door closes and Mo waves.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const DAD = WORKER;

// ---------- C22: the plain outline of the country with its people (tiny icons, restless) ----------
export const C22: React.FC<ShotProps> = ({ t, len }) => (
  <CardBase t={t} len={len} id="c22" z1={1.1}>
    <UkraineOutline x={960} y={500} s={1.7} t={t} dur={14} fillO={0.1} />
    <g transform="translate(960 500) scale(1.7) translate(-305 -185)">
      {Array.from({ length: 46 }).map((_, i) => {
        const [x, y] = uaPoint(i);
        const pop = backOut(clamp((t - 8 - i * 0.7) / 6));
        return <PersonIcon key={i} x={x + Math.sin(t / 7 + i) * 1.6} y={y} s={0.5 * pop} on={i % 7 === 0} o={0.85} />;
      })}
    </g>
    <SchLabel x={960} y={940} t={t - 6} text="UKRAINE" size={64} />
  </CardBase>
);

// ---------- C23: HƠN 6 TRIỆU NGƯỜI: streams of tiny people leave the outline; source UNHCR; ĐÓ LÀ THẬT ----------
export const C23: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.round(6 * easeOut(clamp(t / 26)));
  const hon = easeOut(clamp((t - 24) / 8));
  return (
    <CardBase t={t} len={len} id="c23" z1={1.05}>
      <UkraineOutline x={440} y={400} s={0.9} t={t} dur={8} fillO={0.1} />
      {Array.from({ length: 72 }).map((_, i) => {
        const p = streamPos(i, t, 700, 1960, 3, 440, 760, 80, 1.5);
        return <PersonIcon key={i} x={p.x} y={p.y} s={0.62} on={i % 6 === 0} o={clamp(p.o * 3) * 0.9} />;
      })}
      <g opacity={hon} transform={`translate(${(1 - hon) * -30} 0)`}>
        <text x={1060} y={300} fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill={SCH.dim} letterSpacing={6}>HƠN</text>
      </g>
      <text x={1060} y={470} fontFamily={FONT.ui} fontWeight={700} fontSize={150} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>
        {`${n} TRIỆU`}
      </text>
      <text x={1060} y={566} fontFamily={FONT.ui} fontWeight={700} fontSize={84} fill={SCH.line} letterSpacing={6} opacity={easeOut(clamp((t - 12) / 8))}>NGƯỜI</text>
      <SourceTag t={t - 20} text="UNHCR" />
      <TickBadge t={t - 71} x={1610} y={140} s={0.85} />
    </CardBase>
  );
};

// ---------- the bus station: the same street, the bus waiting at the stop on the right ----------
const BUS_Z = 8.5;
const StationBus: React.FC<{ open?: number; dx?: number; t: number }> = ({ open = 1, dx = 0, t }) => {
  const b = roadPt(3.4, BUS_Z);
  return <Bus x={b.x + dx} y={b.y} s={propScale(BUS_Z)} facing={-1} number="09" open={open} lit={1} t={t} />;
};

/** Spots on the road at Z 4.4 shared by C24-C26 (screen x of Mo and his dad). */
const MZ = 4.4;
const moAt = ped(0.2, MZ);
const dadAt = ped(1.15, MZ + 0.15, 0, 1.75);

// ---------- C24: Mo stays with his dad; Pip comes toward them from the left with his backpack on ----------
export const C24: React.FC<ShotProps> = ({ t, len }) => {
  const s = moAt.scale;
  const fy = floorOf(moAt);
  const moPose: Pose = { ...basePose, x: moAt.x, y: moAt.y, scale: s, yaw: -0.5, facing: -1, tilt: -1, look: -0.6, ...faceAt(t, [[0, 'worried']]) };
  const dadBase: Pose = { ...basePose, x: dadAt.x, y: dadAt.y, scale: dadAt.scale, yaw: -0.5, facing: -1, tilt: -1 };
  const dadPose: Pose = { ...dadBase, armL: armTo(dadBase, 'armL', moAt.x + 22 * s, moAt.y - 100 * s), look: -0.4, ...faceAt(t, [[0, 'neutral']]) };
  const px = kf(t, [[0, moAt.x - 600], [len, moAt.x - 190]], easeOut);
  const pipPose = walkPose(px, t * 0.55, fy, s, { tilt: 4, look: 0.5, ...faceAt(t, [[0, 'worried']]) }, 1);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 640, 1.95)}>
      <Street t={t + 30} id="c24" />
      <StationBus t={t} />
      <BackpackWorn pose={pipPose} layer="back" color={PACK.pip} />
      <Hero look={PIP} pose={pipPose} rimId="rimR" shadow={0} />
      <BackpackWorn pose={pipPose} layer="strap" color={PACK.pip} />
      <Hero look={DAD} pose={dadPose} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={moPose} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- C25: the long hug, a slow push-in ----------
export const C25: React.FC<ShotProps> = ({ t, len }) => {
  const s = moAt.scale;
  const fy = floorOf(moAt);
  const lean = easeOut(clamp(t / 20));
  const pipBase: Pose = { ...basePose, x: moAt.x - 90 * s, y: hipFor(fy, s), scale: s, yaw: 0.9, facing: 1, tilt: 12 * lean };
  const moBase: Pose = { ...basePose, x: moAt.x, y: hipFor(fy, s), scale: s, yaw: -0.9, facing: -1, tilt: -3 * lean };
  const sway = Math.sin(t / 22) * 0.6;
  const pipPose: Pose = { ...pipBase, armR: armTo(pipBase, 'armR', moBase.x + 26 * s, fy - 222 * s), headTilt: 10 * lean, blink: 1, expr: 'neutral', tilt: pipBase.tilt + sway, look: 0.3 };
  const moPose: Pose = { ...moBase, armL: armTo(moBase, 'armL', pipBase.x - 30 * s, fy - 226 * s), headTilt: -6 * lean, blink: 1, expr: 'neutral', tilt: moBase.tilt - sway, look: -0.3 };
  const d = dadAt;
  const dadPose: Pose = { ...basePose, x: d.x + 16 * s, y: d.y, scale: d.scale, yaw: -0.5, facing: -1, tilt: -1, look: -0.4, armL: { a: 20, b: 30 }, ...faceAt(t, [[0, 'neutral']]) };
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 668], [len, 622]]), kf(t, [[0, 2.0], [len, 2.9]]))}>
      <Street t={t + 60} id="c25" />
      <StationBus t={t + 30} />
      <Hero look={DAD} pose={dadPose} rimId="rimR" shadow={0} />
      <BackpackWorn pose={pipPose} layer="back" color={PACK.pip} />
      <Hero look={PIP} pose={pipPose} rimId="rimR" shadow={0} />
      <BackpackWorn pose={pipPose} layer="strap" color={PACK.pip} />
      <Hero look={MO} pose={moPose} rimId="rimR" shadow={0} />
      <Glow x={moAt.x - 36 * s} y={moAt.y - 80 * s} r={220} kind="warm" o={0.25} />
      <Dust t={t} seed={4} x0={moAt.x - 200} y0={moAt.y - 300} w={400} h={260} n={10} o={0.4} />
    </g>
  );
};

// ---------- C26: the bus door folds shut and the bus pulls away to the left; Mo (right) waves and keeps waving ----------
export const C26: React.FC<ShotProps> = ({ t, len }) => {
  const mz = 3.7;
  const mo = ped(1.45, mz);
  const dad = ped(2.3, mz + 0.15, 0, 1.75);
  const ms = mo.scale;
  const wave = Math.sin(t * 0.55) * 14;
  const moPose: Pose = { ...basePose, x: mo.x, y: mo.y, scale: ms, yaw: -0.6, facing: -1, tilt: -1, look: -0.6, armL: { a: 100, b: 52 + wave }, handL: 'open', ...faceAt(t, [[0, 'worried']]) };
  const dadPose: Pose = { ...basePose, x: dad.x, y: dad.y, scale: dad.scale, yaw: -0.5, facing: -1, tilt: 0, look: -0.5, armR: { a: 14, b: 20 }, armL: { a: 16, b: 20 }, ...faceAt(t, [[0, 'neutral']]) };
  const door = kf(t, [[0, 1], [22, 0]], (v) => easeOut(v));
  const leave = clamp((t - 22) / 27);
  const bz = 5.4;
  const bus = roadPt(-1.6, bz);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 990]]), 690, kf(t, [[0, 1.7], [len, 1.62]]))}>
      <Street t={t + 90} id="c26" />
      <Bus x={bus.x - Math.pow(leave, 1.7) * 1000} y={bus.y} s={propScale(bz)} facing={-1} number="09" open={door} lit={1} t={t} />
      <Hero look={DAD} pose={dadPose} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={moPose} rimId="rimR" shadow={0} />
    </g>
  );
};

