import React from 'react';
import { ShotProps, Hero, LOOKS, poseAt, camT, kf, clamp, easeIn, easeOut } from '../../engine';
import { SpeedLines, ImpactFlash, Shockwave, Debris, DustCloud, BoomWord, shakeAt } from './punch-fx-kit';
import { PunchPip, punchFist, punchPose } from './punch-pip-and-fist';
import { RogueRobot, BoltRain } from './rogue-robot';
import { IndustrialBg, Trooper, Barricade, GROUND } from './chb-industrial-props';

// Chapter B, robot part 2: B29-B34 (76.27-81.5 s). The mid-air punch (Bùm on frame 3 of B30), the robot bursts, bolts rain, Pip lands and dusts off.
// Frames after the hit (hAbs): B30 starts at -3, B31 at 18, B32 at 47, B33 at 65 (landing at 73), B34 at 95.

const RX = 1300; // the robot's x
const RS = 0.8; // and scale
const OPTS = { scale: 0.8, side: 1 as const, aim: 92, lunge: 60 };
// where the fist must land (the robot's chest) and the hitter's x/ground that put it there
const ref = punchFist(0, 0, { ...OPTS, x: 0, ground: 0 });
const X_HIT = 1135 - ref.x;
const G_HIT = 410 - ref.y;
const hitOf = (t: number, hitT: number, ground: number, dx = 0) => ({ ...OPTS, x: X_HIT + dx, ground });
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);
const fall = (hAbs: number) => G_HIT + (GROUND - G_HIT) * easeIn(clamp((hAbs - 20) / 53));
const BURST_LEN = 44;

// ---------- B29: mid-air, the fist is cocked, speed lines gather on the robot (cut before the hit) ----------
export const B29: React.FC<ShotProps> = ({ t }) => {
  const g = kf(t, [[0, G_HIT + 330], [36, G_HIT]], easeOut);
  const dx = kf(t, [[0, -420], [36, 0]], easeOut);
  const sk = shakeAt(t, 0, 0, 1);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 1000], [33, 1150]]), kf(t, [[0, 560], [33, 430]]), kf(t, [[0, 1.0], [33, 1.35]]))}>
        <IndustrialBg t={t + 190} id="b29" />
        <RogueRobot t={t + 120} x={RX} y={GROUND} scale={RS} walk={0.8} id="b29r" />
        <PunchPip t={t} hitT={36} {...hitOf(t, 36, g, dx)} rimId="rimR" />
        <SpeedLines t={t} cx={1135} cy={410} o={clamp((t - 6) / 20) * 0.6} rIn={380} n={44} />
      </g>
    </g>
  );
};

// ---------- B30: THE HIT, in mid-air: the robot blows apart ----------
const B30_HIT = 3;
export const B30: React.FC<ShotProps> = ({ t }) => {
  const o = hitOf(t, B30_HIT, G_HIT);
  const fist = punchFist(t, B30_HIT, o);
  const burst = lin(t, B30_HIT + 1, BURST_LEN);
  const sk = shakeAt(t, B30_HIT, 30, 18);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(1150, 430, kf(t, [[0, 1.35], [21, 1.22]]))}>
        <IndustrialBg t={t + 223} id="b30" />
        <RogueRobot t={t + 153} x={RX} y={GROUND} scale={RS} walk={t < B30_HIT ? 0.8 : 0} burst={burst} id="b30r" />
        <Shockwave t={t} hitT={B30_HIT} x={fist.x + 30} y={fist.y} kind="air" r={760} />
        <PunchPip t={t} hitT={B30_HIT} {...o} rimId="rimR" />
        <Debris t={t} hitT={B30_HIT} x={fist.x + 60} y={fist.y} n={34} power={1.4} dir={-20} cone={300} colors={['#C4622D', '#6B7280', '#8E3F1C', '#3E4450']} />
        <SpeedLines t={t} cx={fist.x + 40} cy={fist.y} o={t >= B30_HIT && t < B30_HIT + 8 ? 0.75 : 0} rIn={300} />
        <ImpactFlash t={t} hitT={B30_HIT} x={fist.x + 40} y={fist.y} r={900} full />
        <BoomWord t={t} at={B30_HIT + 4} x={1500} y={280} size={250} rot={6} />
      </g>
    </g>
  );
};

// ---------- B31: the fireball fades, bolts rain on the factory yard, officers look up ----------
export const B31: React.FC<ShotProps> = ({ t }) => {
  const a = t + 18; // frames after the hit
  const burst = lin(a + B30_HIT, B30_HIT + 1, BURST_LEN);
  const o = hitOf(t, B30_HIT - a, fall(a));
  return (
    <g>
      <g transform={camT(1150, 470, kf(t, [[0, 1.0], [29, 0.9]]))}>
        <IndustrialBg t={t + 244} id="b31" />
        <RogueRobot t={t + 174} x={RX} y={GROUND} scale={RS} walk={0} burst={burst} id="b31r" />
        {[140, 340].map((x) => <Trooper key={x} x={x} y={GROUND + 60} s={0.92} />)}
        <Barricade x={240} y={GROUND + 110} s={1.2} />
        <PunchPip t={t} hitT={B30_HIT - a} {...o} rimId="rimR" fx={false} />
        <BoltRain t={t} startT={-4} x0={300} x1={1900} groundY={GROUND + 40} top={-120} n={110} size={1.8} span={26} />
      </g>
    </g>
  );
};

// ---------- B32: close on the tarmac: bolts bounce and settle ----------
export const B32: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(1100, 860, 1.9)}>
    <IndustrialBg t={t + 273} id="b32" />
    <BoltRain t={t + 29} startT={-4} x0={700} x1={1500} groundY={GROUND + 60} top={560} n={50} size={2.2} span={12} />
    <rect x={-800} y={GROUND + 60} width={3600} height={4} fill="#FFFFFF" opacity={0.08} />
  </g>
);

// ---------- B33: Pip drops in and lands, dust ring; the robot's black smoke behind ----------
export const B33: React.FC<ShotProps> = ({ t }) => {
  const a = t + 65;
  const LAND = 8;
  const base = punchPose(Math.min(t, LAND) + 65 + B30_HIT, B30_HIT, { ...OPTS, x: X_HIT, ground: GROUND });
  const pose = t < LAND
    ? { ...punchPose(a + B30_HIT, B30_HIT, hitOf(t, B30_HIT, fall(a))) }
    : poseAt(t, [
        { f: LAND, p: { ...base, y: GROUND - 140 * 0.8 + 6, squash: 0.28 } },
        { f: LAND + 5, p: { squash: 0.15, tilt: 0, armL: { a: 30, b: 40 }, armR: { a: 40, b: 40 }, legL: { a: -30, b: 50 }, legR: { a: 40, b: -50 } }, ease: easeOut },
        { f: 29, p: { squash: 0, tilt: 2, armL: { a: 10, b: 10 }, armR: { a: 12, b: 14 }, legL: { a: -6, b: 6 }, legR: { a: 8, b: -6 }, expr: 'cool' }, ease: easeOut },
      ]);
  const sk = shakeAt(t, LAND, 14, 10);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(1100, 560, kf(t, [[0, 0.95], [29, 1.1]]))}>
        <IndustrialBg t={t + 303} id="b33" />
        <RogueRobot t={t + 233} x={RX} y={GROUND} scale={RS} walk={0} burst={1} id="b33r" />
        <BoltRain t={t + 29 + 29 + 18 + 1} startT={-4} x0={300} x1={1900} groundY={GROUND + 40} top={-120} n={40} size={1.8} span={26} />
        <Shockwave t={t} hitT={LAND} x={X_HIT + 80} y={GROUND} kind="ground" r={600} />
        <DustCloud t={t} hitT={LAND} x={X_HIT + 80} y={GROUND} r={100} />
        <Hero look={LOOKS.pipHood} pose={pose} rimId="rimR" />
        <Debris t={t} hitT={LAND} x={X_HIT + 80} y={GROUND - 4} n={14} power={0.5} dir={-90} cone={160} groundY={GROUND} sparks={false} />
      </g>
    </g>
  );
};

// ---------- B34: cool and calm, he dusts off his hands ----------
export const B34: React.FC<ShotProps> = ({ t }) => {
  const k = Math.floor(t / 4) % 2;
  const brush = k ? 14 : -10;
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: GROUND - 140 * 1.0 - 4, scale: 1.0, yaw: 0.35, facing: 1, expr: 'cool', tilt: 2, armL: { a: 40 + brush, b: 100 }, armR: { a: 40 - brush, b: 100 }, legL: { a: -4, b: 4 }, legR: { a: 6, b: -4 } } },
    { f: 26, p: { tilt: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [26, 960]]), 520, kf(t, [[0, 1.15], [26, 1.3]]))}>
      <IndustrialBg t={t + 332} id="b34" />
      <RogueRobot t={t + 262} x={1480} y={GROUND} scale={RS} walk={0} burst={1} id="b34r" />
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimR" />
      {[0, 1, 2, 3].map((i) => {
        const p = (t * 0.06 + i / 4) % 1;
        return <circle key={i} cx={940 + i * 22 + p * 40} cy={GROUND - 220 - p * 90} r={5 + p * 7} fill="#CDBFA6" opacity={0.7 * (1 - p)} />;
      })}
    </g>
  );
};
