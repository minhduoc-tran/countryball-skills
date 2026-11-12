import React from 'react';
import { ShotProps, Hero, LOOKS, walkPose, poseAt, faceAt, camT, kf, clamp, easeOut, easeInOut, Sparkle } from '../../engine';
import { SpeedLines, ImpactFlash, Shockwave, shakeAt } from './punch-fx-kit';
import { PunchPip } from './punch-pip-and-fist';
import { ArcadeBg, ArcadeFront, BoxingMachine, LedDisplay, RecordBoard, SideWall } from './chb-arcade-props';
import { FLOOR, MO_OPTS, PIP_OPTS, machineFor } from './chb-arcade-scene';

// Chapter B, arcade part 1: B1-B7 (40.97-49.84 s). Mo drags Pip to the arcade, the boxing machine, the record, Mo's 420, Pip steps up.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;

// ---------- B1: arcade front, Mo pulls Pip by the wrist towards the door ----------
export const B1: React.FC<ShotProps> = ({ t }) => {
  const ph = t * 0.55;
  const mx = kf(t, [[0, 520], [58, 880]], (u) => u);
  const px = mx - 235;
  const mo = walkPose(mx, ph, 930, 0.95, { armL: { a: -72, b: -8 }, expr: 'happy' }, 1);
  const pip = walkPose(px, ph + 1.3, 930, 0.95, { armR: { a: 70, b: 10 }, expr: 'oops', tilt: -4 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 820], [58, 960]]), 560, kf(t, [[0, 1.12], [58, 1.3]]))}>
      <ArcadeFront t={t} id="b1" />
      <Hero look={PIP} pose={pip} rimId="rimL" />
      <Hero look={MO} pose={mo} rimId="rimL" />
    </g>
  );
};

// ---------- B2: inside, the machines blink; they walk in; the boxing machine glows at the back ----------
export const B2: React.FC<ShotProps> = ({ t }) => {
  const ph = t * 0.5;
  const px = kf(t, [[0, 250], [47, 700]], (u) => u);
  return (
    <g transform={camT(kf(t, [[0, 880], [47, 960]]), 520, kf(t, [[0, 1.0], [47, 1.18]]))}>
      <ArcadeBg t={t + 20} id="b2" />
      <BoxingMachine x={1380} y={FLOOR} s={0.66} t={t} text="000" />
      <Hero look={MO} pose={walkPose(px + 190, ph, FLOOR + 60, 0.9, { expr: 'happy', armR: { a: 70, b: 6 } }, 1)} rimId="rimL" />
      <Hero look={PIP} pose={walkPose(px, ph + 1.4, FLOOR + 60, 0.9, { expr: 'happy' }, 1)} rimId="rimL" />
    </g>
  );
};

// ---------- B3: "Máy đấm bốc": push in on the machine, Mo points at it ----------
export const B3: React.FC<ShotProps> = ({ t }) => {
  const pop = easeOut(clamp(t / 8));
  const pose = poseAt(t, [
    { f: 0, p: { x: 470, y: 560, scale: 1.25, yaw: 0.6, facing: 1, armR: { a: 40, b: 0 }, handR: 'point', expr: 'happy', look: 0.8 } },
    { f: 12, p: { armR: { a: 86, b: 0 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [41, 960]]), 540, kf(t, [[0, 1.2], [41, 1.55]]))}>
      <ArcadeBg t={t + 60} id="b3" />
      <BoxingMachine x={1150} y={FLOOR} s={0.95 * (0.9 + 0.1 * pop)} t={t} text={t % 6 < 3 ? '000' : '888'} flash={t % 6 < 3 ? 0 : 1} />
      <Hero look={MO} pose={{ ...pose, y: FLOOR - 136 * 1.25 - 30 }} rimId="rimL" />
    </g>
  );
};

// ---------- B4: the district record board, 900, with a glint ----------
export const B4: React.FC<ShotProps> = ({ t }) => {
  const pop = t / 10;
  const heads = (x: number, look: typeof PIP, ex: number) =>
    <Hero look={look} pose={poseAt(t, [{ f: 0, p: { x, y: 1090, scale: 1.5, yaw: 0.5, facing: 1, look: -0.2, expr: 'shock', headTilt: -6 } }])} rimId="rimL" shadow={0} />;
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [37, 1.12]]))}>
      <ArcadeBg t={t + 90} id="b4" dim={0.35} />
      <RecordBoard x={960} y={400} w={900} t={t} pop={pop} />
      <Sparkle x={1180 + 0 * t} y={330} t={t - 12} />
      {heads(520, MO, 0)}
      {heads(1400, PIP, 0)}
    </g>
  );
};

// ---------- B5: Mo punches the pad (hit at frame 9) ----------
const B5_HIT = 9;
export const B5: React.FC<ShotProps> = ({ t }) => {
  const m = machineFor(MO_OPTS, B5_HIT);
  const h = t - B5_HIT;
  const sk = shakeAt(t, B5_HIT, 9, 8);
  const rolling = h >= 0 ? String(Math.floor(((t * 137) % 900) + 100)) : '000';
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(1010, 560, 1.12)}>
        <ArcadeBg t={t + 120} id="b5" />
        <SideWall x0={1580} x1={1900} hole={0} id="b5w" />
        <BoxingMachine x={m.x + (h > 0 ? Math.sin(h * 1.3) * 5 * Math.exp(-h / 6) : 0)} y={FLOOR} s={m.s} t={t} padPush={clamp(h < 0 ? 0 : kf(h, [[0, 1], [3, 1], [8, 0]]))} text={rolling} displayOn={1} />
        <Hero look={PIP} pose={walkPose(330, 0, FLOOR, 0.92, { expr: 'happy', yaw: 0.8, armR: { a: 20, b: 120 }, armL: { a: 20, b: 120 } }, 1)} rimId="rimL" />
        <PunchPip t={t} hitT={B5_HIT} {...MO_OPTS} look={MO} rimId="rimL" />
        <Shockwave t={t} hitT={B5_HIT} x={m.fist.x} y={m.fist.y} kind="air" r={300} />
        <ImpactFlash t={t} hitT={B5_HIT} x={m.fist.x + 30} y={m.fist.y} r={380} />
      </g>
    </g>
  );
};

// ---------- B6: the display counts up to 420; the record, 900, is far above ----------
export const B6: React.FC<ShotProps> = ({ t }) => {
  const v = Math.round(kf(t, [[0, 0], [24, 420]], easeOut));
  const done = t >= 24;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [35, 1.08]]))}>
      <ArcadeBg t={t + 150} id="b6" dim={0.5} />
      <LedDisplay x={960} y={380} w={1180} h={440} text={String(v).padStart(3, '0')} color={done ? '#FFD23F' : '#FF4A3D'} label="ĐIỂM" on={1} />
      <RecordBoard x={960} y={830} w={520} t={t} />
      {done ? <Sparkle x={1380} y={250} t={t - 24} /> : null}
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={240 + i * 480} cy={90} r={14} fill={(t + i) % 4 < 2 ? '#FFD23F' : '#FF3DA8'} />)}
    </g>
  );
};

// ---------- B7: Pip steps up to the pad; Mo steps aside ----------
export const B7: React.FC<ShotProps> = ({ t }) => {
  const m = machineFor(PIP_OPTS, 9);
  const px = kf(t, [[0, 400], [20, 640]], easeInOut);
  const walking = t < 20;
  const pip = walking ? walkPose(px, t * 0.6, FLOOR, 1, { expr: 'cool' }, 1) : walkPose(px, 0, FLOOR, 1, { expr: 'cool', armR: { a: 40, b: 110 }, armL: { a: 55, b: 100 } }, 1);
  const mo = poseAt(t, [
    { f: 0, p: { x: 560, y: FLOOR - 136 * 0.96, scale: 0.96, yaw: 0.7, facing: 1, expr: 'happy', armL: { a: 10, b: 8 }, armR: { a: 20, b: 20 } } },
    { f: 10, p: { x: 330, armR: { a: -60, b: -30 }, expr: 'happy' }, ease: easeOut },
  ]);
  return (
    <g transform={camT(1000, 560, 1.12)}>
      <ArcadeBg t={t + 170} id="b7" />
      <SideWall x0={1580} x1={1900} hole={0} id="b7w" />
      <BoxingMachine x={m.x} y={FLOOR} s={m.s} t={t} text="000" />
      <Hero look={MO} pose={mo} rimId="rimL" />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'smug']]) }} rimId="rimL" />
      <SpeedLines t={t} cx={m.fist.x} cy={m.fist.y} o={clamp((t - 10) / 14) * 0.35} rIn={420} n={34} />
    </g>
  );
};
