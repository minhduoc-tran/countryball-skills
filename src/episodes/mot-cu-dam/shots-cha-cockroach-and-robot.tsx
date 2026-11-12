import React from 'react';
import { Street, ShotProps, kf, camT, clamp, easeIn, easeOut, Glow, LOOKS, Hero, poseAt, faceAt, Foreground, LEG_LEN } from '../../engine';
import { SpeedLines, ImpactFlash, Shockwave, Debris, DustCloud, BoomWord, shakeAt } from './punch-fx-kit';
import { PunchPip, FistInsert, punchFist } from './punch-pip-and-fist';
import { GiantCockroach } from './giant-cockroach';
import { RogueRobot, BoltRain } from './rogue-robot';
import { Runner, CROWD } from './cha-local-props';

// Chapter A cold open, part 1: the cockroach (A1-A5) and the robot (A6-A9). The punch runs are split into a wind-up shot
// and a hit shot that share one clock `tg` (the hit shot starts `off` frames into the wind-up shot's clock), so the
// fist lands on the cut + a few frames, on the word "Bùm".
const PIP = LOOKS.pipHood;
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);

// ---------- A1: wide, the night street: the giant cockroach scuttles in from the right, a few far figures flee ----------
export const A1: React.FC<ShotProps> = ({ t }) => {
  const rx = kf(t, [[0, 2350], [58, 1380]], easeOut);
  const sk = shakeAt(t, 30, 5, 5);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 1040], [60, 980]]), 600, kf(t, [[0, 0.95], [60, 1.05]]))}>
        <Street t={t + 80} id="a1" night />
        <Runner t={t} x={kf(t, [[0, 760], [60, 520]])} ground={655} scale={0.3} look={CROWD[0]} ph={1} />
        <Runner t={t} x={kf(t, [[0, 900], [60, 640]])} ground={650} scale={0.27} look={CROWD[1]} ph={3} />
        <GiantCockroach t={t} x={rx} y={690} scale={1.08} facing={-1} walk={1.2} rimId="rimBlue" id="a1c" />
      </g>
    </g>
  );
};

// ---------- A2: medium-wide, the crowd runs past calm Pip, away from the beast behind ----------
export const A2: React.FC<ShotProps> = ({ t }) => {
  const sp = [20, 26, 17, 23];
  const pose = poseAt(t, [{ f: 0, p: { x: 640, y: 560, scale: 0.72, yaw: 0.9, facing: 1, look: 0.8, armL: { a: 12, b: 10 }, armR: { a: 12, b: 10 } } }]);
  return (
    <g transform={camT(980, 600, kf(t, [[0, 1.08], [38, 1.2]]))}>
      <Street t={t + 120} id="a2" night />
      <GiantCockroach t={t} x={kf(t, [[0, 1600], [38, 1500]])} y={690} scale={1.08} facing={-1} walk={1} rimId="rimBlue" id="a2c" />
      <Hero look={PIP} pose={{ ...pose, y: 735 - 0.72 * LEG_LEN, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimBlue" shadow={0.6} />
      {[0, 1, 2, 3].map((i) => (
        <Runner key={i} t={t} x={1300 + i * 170 - sp[i] * t} ground={[790, 760, 810, 740][i]} scale={[0.75, 0.62, 0.8, 0.58][i]} look={CROWD[i]} ph={i * 2} />
      ))}
    </g>
  );
};

// ---------- A3: the fist clenches (insert) ----------
export const A3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <FistInsert t={t} id="a3" clenchAt={3} thrustAt={400} />
  </g>
);

// ---------- A4 / A5: Pip winds up, then the hit (one scene, tg = shared clock) ----------
const HIT = 38;
const PIP_OPTS = { x: 700, ground: 735, scale: 0.72, side: 1 as const, aim: 98, lunge: 70 };
const RoachFight: React.FC<{ tg: number; id: string; cam: [number, number, number]; fx?: boolean }> = ({ tg, id, cam, fx = false }) => {
  const fist = punchFist(tg, HIT, PIP_OPTS);
  const rx = kf(tg, [[0, 1500], [HIT, 1200]]);
  const hit = lin(tg, HIT, 56);
  const hp = { x: 905, y: 540 };
  const sk = shakeAt(tg, HIT, 22, 14);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(cam[0], cam[1], cam[2])}>
        <Street t={tg + 80} id={id} night />
        <GiantCockroach t={tg} x={rx} y={690} scale={1.08} facing={-1} hit={hit} flyDist={1500} walk={tg < HIT ? 1 : 0.4} rimId="rimBlue" id={`${id}c`} />
        {fx ? <Glow x={hp.x} y={hp.y} r={420 * (tg >= HIT ? 1 : 0)} o={0.6 * clamp(1 - (tg - HIT) / 14)} /> : null}
        <Shockwave t={tg} hitT={HIT} x={fist.x + 20} y={fist.y} kind="air" />
        <Shockwave t={tg} hitT={HIT} x={hp.x + 40} y={720} kind="ground" r={700} />
        <DustCloud t={tg} hitT={HIT} x={hp.x + 30} y={730} r={110} />
        <PunchPip t={tg} hitT={HIT} {...PIP_OPTS} rimId="rimBlue" />
        <Debris t={tg} hitT={HIT} x={hp.x + 30} y={hp.y} n={30} power={1.1} dir={-25} cone={200} groundY={725} />
        <SpeedLines t={tg} cx={hp.x} cy={hp.y} o={tg >= HIT && tg < HIT + 9 ? 0.75 : 0} rIn={260} />
        <ImpactFlash t={tg} hitT={HIT} x={fist.x + 30} y={fist.y} r={700} />
        <BoomWord t={tg} at={HIT + 3} x={1170} y={480} size={170} />
      </g>
    </g>
  );
};
// A4: the wind-up, medium-wide on Pip, the beast closing in (ends 5 frames before the hit)
export const A4: React.FC<ShotProps> = ({ t }) => <RoachFight tg={t} id="a4" cam={[kf(t, [[0, 900], [33, 860]]), 600, kf(t, [[0, 1.2], [33, 1.55]])]} />;
// A5: the hit, same scene from a closer, lower angle; the beast flies
export const A5: React.FC<ShotProps> = ({ t }) => <RoachFight tg={t + 33} id="a5" cam={[1000, 590, kf(t, [[0, 1.55], [18, 1.2]])]} fx />;

// ---------- A6: wide, the robot stomps down the street (skyline towering) ----------
export const A6: React.FC<ShotProps> = ({ t }) => {
  const s = kf(t, [[0, 0.5], [33, 0.62]]);
  const sk = shakeAt(t, 8, 10, 7);
  const sk2 = shakeAt(t, 22, 10, 7);
  return (
    <g transform={`translate(${sk.x + sk2.x} ${sk.y + sk2.y})`}>
      <g transform={camT(960, 560, kf(t, [[0, 1.0], [33, 1.05]]))}>
        <Street t={t + 40} id="a6" night />
        <Runner t={t} x={kf(t, [[0, 700], [33, 380]])} ground={915} scale={0.34} look={CROWD[2]} ph={2} />
        <Runner t={t} x={kf(t, [[0, 1500], [33, 1180]])} ground={925} scale={0.32} look={CROWD[3]} ph={5} />
        <RogueRobot t={t} x={1000} y={880} scale={s} walk={1} id="a6r" />
      </g>
    </g>
  );
};

// ---------- A7: low angle, the camera tilts up the robot, Pip tiny at its foot ----------
export const A7: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 560, y: 1005 - 0.3 * LEG_LEN, scale: 0.3, yaw: 0.5, facing: 1, headTilt: -14, look: 0.6, armL: { a: 10, b: 6 }, armR: { a: 10, b: 6 } } }]);
  const sk = shakeAt(t, 10, 8, 6);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 900], [35, 950]]), kf(t, [[0, 820], [35, 470]]), kf(t, [[0, 1.15], [35, 0.9]]))}>
        <Street t={t + 90} id="a7" night low={150} />
        <RogueRobot t={t} x={1050} y={1005} scale={1.1} walk={1} id="a7r" />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimBlue" shadow={0.6} />
      </g>
    </g>
  );
};

// ---------- A8 / A9: the robot, the wind-up and the hit (shared clock tg) ----------
const RHIT = 34;
const R_OPTS = { x: 690, ground: 905, scale: 0.7, side: 1 as const, aim: 70, lunge: 90 };
const RobotFight: React.FC<{ tg: number; id: string; cam: [number, number, number] }> = ({ tg, id, cam }) => {
  const fist = punchFist(tg, RHIT, R_OPTS);
  const burst = lin(tg, RHIT + 1, 44);
  const rs = kf(tg, [[0, 0.5], [RHIT, 0.78]], easeIn);
  const sk = shakeAt(tg, RHIT, 30, 18);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(cam[0], cam[1], cam[2])}>
        <Street t={tg + 40} id={id} night />
        <RogueRobot t={tg} x={1000} y={880} scale={rs} burst={burst} walk={tg < RHIT ? 1 : 0} id={`${id}r`} />
        <Shockwave t={tg} hitT={RHIT} x={fist.x + 40} y={fist.y} kind="air" r={560} />
        <Shockwave t={tg} hitT={RHIT} x={900} y={905} kind="ground" r={800} />
        <DustCloud t={tg} hitT={RHIT} x={880} y={905} r={130} />
        <PunchPip t={tg} hitT={RHIT} {...R_OPTS} rimId="rimBlue" />
        <Debris t={tg} hitT={RHIT} x={fist.x + 60} y={fist.y} n={34} power={1.4} dir={-35} cone={240} groundY={910} colors={['#C4622D', '#6B7280', '#8E3F1C', '#3E4450']} />
        <SpeedLines t={tg} cx={fist.x + 40} cy={fist.y} o={tg >= RHIT && tg < RHIT + 8 ? 0.7 : 0} rIn={300} />
        <BoltRain t={tg} startT={RHIT + 6} x0={200} x1={1750} groundY={930} n={90} size={1.9} />
        <ImpactFlash t={tg} hitT={RHIT} x={fist.x + 40} y={fist.y} r={800} />
        <BoomWord t={tg} at={RHIT + 3} x={1330} y={360} size={300} rot={6} />
      </g>
    </g>
  );
};
export const A8: React.FC<ShotProps> = ({ t }) => <RobotFight tg={t} id="a8" cam={[kf(t, [[0, 900], [29, 860]]), 740, kf(t, [[0, 1.35], [29, 1.6]])]} />;
export const A9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RobotFight tg={t + 29} id="a9" cam={[960, 540, kf(t, [[0, 1.05], [21, 0.95]])]} />
    <Foreground blur={10}>
      <rect x={-200} y={1010} width={900} height={200} fill="#07060C" opacity={0.8} transform="rotate(-3 300 1100)" />
    </Foreground>
  </g>
);
