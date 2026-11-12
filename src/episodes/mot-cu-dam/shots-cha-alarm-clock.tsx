import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, camT, clamp, easeOut, easeIn, rnd, LOOKS, HEAD, Glow, ShotProps,
  BedDuvet, bedSit, BEDROOM, stand, reachAngle, LEG_LEN, FONT,
} from '../../engine';
import { DawnBedroom } from '../last-one/shots-cha-morning-bedroom';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { SpeedLines, ImpactFlash, Shockwave, Debris, DustCloud, BoomWord, shakeAt } from './punch-fx-kit';
import { BedsideBackdrop, BedsideTable, ClockWreck, RingingClock } from './cha-local-props';

// Chapter A, "1 rule: alarm clock" (A21-A31): the ordinary morning, the alarm, the habit slap that is a punch: the clock
// turns to dust, the bedside table snaps in two, mum in the doorway. Pip is the hoodie hero; the set is last-one's DawnBedroom.
const PIP = LOOKS.pipHood;
const MOM = LOOKS.mom;

// ---------- A21: wide, Pip wakes in bed and stretches ----------
export const A21: React.FC<ShotProps> = ({ t }) => {
  const b = bedSit(0.2);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: b.x, y: b.y, scale: b.scale, yaw: -0.4, look: 0.2, headTilt: 8, armL: { a: 8, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 12, p: { headTilt: 6 } },
    { f: 26, p: { headTilt: -6, armL: { a: 165, b: 6 }, armR: { a: 160, b: 10 } }, ease: easeOut },
    { f: 38, p: { armL: { a: 150, b: 8 }, armR: { a: 148, b: 12 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [38, 870]]), 520, kf(t, [[0, 1.15], [38, 1.3]]))}>
      <DawnBedroom t={t + 60} id="a21" duvet={false} clock="07:00" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [20, 'happy']]), blink: t < 14 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
    </g>
  );
};

// ---------- A22: medium, a normal morning: Pip smiles at the window, arms down ----------
export const A22: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.26);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: b.x, y: b.y, scale: b.scale, yaw: 0.55, look: 0.9, headTilt: -3, armL: { a: 150, b: 8 }, armR: { a: 146, b: 12 } } },
    { f: 12, p: { armL: { a: 14, b: -6 }, armR: { a: 16, b: -6 }, headTilt: 3 }, ease: easeOut },
    { f: len, p: { headTilt: -2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 900]]), 520, kf(t, [[0, 1.9], [len, 2.15]]))}>
      <DawnBedroom t={t + 100} id="a22" duvet={false} clock="07:00" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
    </g>
  );
};

// ---------- A23: close-up, "except one thing": the smile drops, eyes slide toward the clock ----------
export const A23: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.1 * clamp(t / len));
  const pose: Pose = {
    ...basePose, x: 1000, y: 590 - HEAD.y * sc, scale: sc, yaw: kf(t, [[0, 0.1], [12, 0.45]]), look: kf(t, [[0, 0], [10, 0.9]]),
    headTilt: kf(t, [[0, 0], [14, 3]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 },
    ...faceAt(t, [[0, 'happy'], [8, 'oops']]),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-430 -470) scale(1.8)">
          <DawnBedroom t={t + 90} id="a23" duvet />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.3} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- A24: macro, the alarm clock rings and shakes ----------
const Macro: React.FC<{ t: number; id: string; children: React.ReactNode; cracks?: number; zoom?: number }> = ({ t, id, children, cracks = 0, zoom = 1 }) => (
  <g transform={camT(960, 540, zoom)}>
    <BedsideBackdrop t={t} id={id} />
    <Glow x={1500} y={260} r={700} o={0.4} />
    <BedsideTable x={960} y={800} w={2400} legs={false} cracks={cracks} />
    {children}
  </g>
);
export const A24: React.FC<ShotProps> = ({ t, len }) => (
  <Macro t={t} id="a24" zoom={kf(t, [[0, 1.0], [len, 1.08]])}>
    <RingingClock t={t} cx={960} cy={800} s={3} />
  </Macro>
);

// ---------- A25: medium, still half asleep, Pip slaps at the clock by habit (twice) ----------
export const A25: React.FC<ShotProps> = ({ t }) => {
  const b = bedSit(0.36);
  const clock = BEDROOM.P(0.455, 0.78, 0.075);
  const base: Pose = { ...basePose, x: b.x, y: b.y, scale: b.scale, yaw: 0.5, facing: 1, tilt: 6, armL: { a: 8, b: -6 }, armR: { a: 12, b: -6 } };
  const reach = reachAngle(base, { x: clock.x, y: clock.y - 40 });
  const pose: Pose = poseAt(t, [
    { f: 0, p: { armR: { a: 12, b: -6 }, headTilt: 6 } },
    { f: 8, p: { armR: { a: reach + 55, b: 0 } }, ease: easeOut },
    { f: 12, p: { armR: { a: reach, b: 0 } }, ease: easeIn },
    { f: 18, p: { armR: { a: reach + 40, b: 0 } }, ease: easeOut },
    { f: 28, p: { armR: { a: reach + 55, b: 0 } } },
    { f: 31, p: { armR: { a: reach, b: 0 } }, ease: easeIn },
    { f: 38, p: { armR: { a: reach + 20, b: 0 } }, ease: easeOut },
    { f: 45, p: { armR: { a: reach + 20, b: 0 } } },
  ], base);
  const ring = [12, 31].some((s) => t >= s && t < s + 4) ? 0 : 1;
  return (
    <g transform={camT(clock.x - 30, 520, 2.1)}>
      <DawnBedroom t={t + 140} id="a25" duvet={false} clock="07:00" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]), blink: 1 }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
      {[0, 1].map((k) => {
        const p = ((t / 9 + k / 2) % 1);
        return <path key={k} d={`M ${clock.x + 26 + 38 * p} ${clock.y - 70} q 14 18 0 38`} stroke="#FFE7B8" strokeWidth={5} fill="none" strokeLinecap="round" opacity={ring * (1 - p)} />;
      })}
    </g>
  );
};

// ---------- A26 / A27: the fist comes down on the clock (shared clock tg), the clock bursts ----------
const HIT = 36;
const fistPos = (tg: number) => {
  const y = tg < HIT - 8 ? kf(tg, [[0, 420], [HIT - 8, 140]], easeOut) : tg < HIT - 3 ? 140 + (rnd(2, Math.floor(tg)) - 0.5) * 8 : kf(tg, [[HIT - 3, 140], [HIT, 560], [HIT + 8, 585]], easeIn);
  return { x: 1000 + (tg < HIT - 3 ? (rnd(5, Math.floor(tg)) - 0.5) * (tg > 16 ? 8 : 0) : 0), y };
};
const ClockHit: React.FC<{ tg: number; id: string }> = ({ tg, id }) => {
  const f = fistPos(tg);
  const sk = shakeAt(tg, HIT, 26, 14);
  const gone = tg >= HIT;
  const squash = tg >= HIT - 1 && tg < HIT ? 0.7 : 1;
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <Macro t={tg} id={id} cracks={clamp((tg - HIT) / 5)}>
        {!gone ? (
          <g transform={`translate(960 800) scale(1 ${squash}) translate(-960 -800)`}>
            <RingingClock t={tg} cx={960} cy={800} s={3} ring={clamp(1 - (tg - 20) / 16)} />
          </g>
        ) : null}
        <SpeedLines t={tg} cx={1000} cy={620} n={40} rIn={420} rOut={1500} o={tg < HIT - 2 ? 0.35 * clamp((tg - 6) / 20) : tg < HIT + 8 ? 0.7 : 0} color="#FFFFFF" seed={2} />
        <Shockwave t={tg} hitT={HIT} x={980} y={760} kind="ground" r={900} />
        <Shockwave t={tg} hitT={HIT} x={980} y={620} kind="air" r={700} />
        <DustCloud t={tg} hitT={HIT} x={980} y={770} r={150} n={14} />
        <Debris t={tg} hitT={HIT} x={980} y={640} n={34} power={1.2} groundY={800} dir={-90} cone={340} colors={['#24202C', '#8A8AA0', '#FF5A3A', '#3A3444']} />
        <InsertArm x={f.x} y={f.y} fx={1650} fy={-420} fist s={4.8} />
        <ImpactFlash t={tg} hitT={HIT} x={980} y={640} r={900} full />
        <BoomWord t={tg} at={HIT + 3} x={1440} y={420} size={300} rot={7} />
      </Macro>
    </g>
  );
};
export const A26: React.FC<ShotProps> = ({ t }) => <ClockHit tg={t} id="a26" />;
export const A27: React.FC<ShotProps> = ({ t }) => <ClockHit tg={t + 31} id="a27" />;

// ---------- A28: "the clock turns to dust": the wreck on the cracked top, dust sifting down in the light ----------
export const A28: React.FC<ShotProps> = ({ t, len }) => (
  <Macro t={t + 60} id="a28" cracks={1} zoom={kf(t, [[0, 1.0], [len, 1.18]])}>
    <ellipse cx={960} cy={790} rx={320} ry={34} fill="#CBB79A" opacity={0.85} />
    <ClockWreck x={960} y={780} s={1.25} />
    <DustCloud t={t + 14} hitT={0} x={960} y={770} r={140} n={12} />
    {Array.from({ length: 46 }).map((_, i) => {
      const p = (t * (0.012 + rnd(1, i) * 0.01) + rnd(2, i)) % 1;
      return <circle key={i} cx={420 + rnd(3, i) * 1100 + Math.sin(t / 14 + i) * 20} cy={160 + p * 640} r={2 + rnd(4, i) * 4} fill="#F3E3C8" opacity={0.7 * (1 - p)} />;
    })}
  </Macro>
);

// ---------- A29: the bedside table snaps in two: both halves drop at the middle, the mug slides off, Pip freezes behind ----------
export const A29: React.FC<ShotProps> = ({ t }) => {
  const snap = t < 3 ? 0 : kf(t, [[3, 0], [10, 36], [14, 30], [18, 34]], easeOut);
  const p = Math.max(0, t - 8);
  const mugY = 560 + 0.5 * 2.2 * p * p;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700 - 0.8 * LEG_LEN, scale: 0.8, yaw: 0.1, look: 0, tilt: 3, armL: { a: 20, b: 10 }, armR: { a: 52, b: 40 } } },
    { f: 12, p: { armR: { a: 70, b: 35 }, armL: { a: 60, b: 30 }, headTilt: -4 }, ease: easeOut },
  ]);
  const sk = shakeAt(t, 6, 16, 10);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <BedsideBackdrop t={t + 30} id="a29" />
      <Glow x={1500} y={260} r={700} o={0.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [8, 'oops']]) }} rimId="rimR" shadow={0} />
      <BedsideTable x={960} y={640} w={1050} snap={snap} floorY={960} />
      {/* the mug on the left half slides and falls */}
      <g transform={`translate(${790 - 30 * clamp(p / 8)} ${Math.min(mugY, 930)}) rotate(${-20 * clamp(p / 10)})`}>
        <rect x={-30} y={-54} width={60} height={54} rx={8} fill="#E9E2D2" stroke="#17141F" strokeWidth={5} />
        <path d="M 30 -40 q 26 4 0 28" stroke="#17141F" strokeWidth={6} fill="none" />
      </g>
      <DustCloud t={t} hitT={5} x={960} y={660} r={120} n={10} />
      <Debris t={t} hitT={5} x={960} y={650} n={18} power={0.9} groundY={950} dir={-90} cone={300} colors={['#B98A5A', '#8C6240', '#5E3F28']} />
    </g>
  );
};

// ---------- A30: mum in the doorway, back-lit by the hall light ----------
const DOOR = stand(BEDROOM, 0.03, 0.665, 0.72);
export const A30: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: DOOR.x, y: DOOR.y, scale: DOOR.scale, yaw: 0.45, facing: 1, look: 0.5, armL: { a: 14, b: 8 }, armR: { a: 18, b: 12 } } },
    { f: 8, p: { armR: { a: 40, b: 30 }, armL: { a: 36, b: 24 }, headTilt: 6 }, ease: easeOut },
    { f: len, p: { headTilt: 6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, DOOR.x + 120], [len, DOOR.x + 100]]), 540, kf(t, [[0, 1.9], [len, 2.2]]))}>
      <DawnBedroom t={t + 180} id="a30" duvet />
      <Glow x={DOOR.x - 20} y={DOOR.y - 90} r={360} o={0.5} />
      <Hero look={MOM} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [6, 'shock']]) }} rimId="rimL" shadow={0.5} />
    </g>
  );
};

// ---------- A31: close-up, mum's jaw drops ----------
export const A31: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.9 * (1 + 0.06 * clamp(t / len));
  const pose: Pose = {
    ...basePose, x: 1000, y: 580 - HEAD.y * sc, scale: sc, yaw: 0.2, look: 0.3,
    headTilt: kf(t, [[0, 0], [8, 4]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 },
    ...faceAt(t, [[0, 'shock']]),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-250 -430) scale(1.8)">
          <DawnBedroom t={t + 200} id="a31" duvet />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.25} />
      <Glow x={160} y={560} r={520} o={0.4} />
      <SpeedLines t={t} cx={1000} cy={430} n={36} rIn={330} rOut={1300} o={0.22} color="#FFE7B8" seed={9} />
      <Hero look={MOM} pose={pose} rimId="rimL" shadow={0} />
      <text x={1480} y={300 - 6 * Math.sin(t / 3)} fontFamily={FONT.hand} fontSize={150} fill="#FFE27A" stroke="#1A1230" strokeWidth={12} paintOrder="stroke" transform="rotate(10 1480 300)">!</text>
    </g>
  );
};
