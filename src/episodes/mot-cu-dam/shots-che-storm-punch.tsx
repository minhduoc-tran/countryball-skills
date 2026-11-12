import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, camT, Glow, ShotProps,
} from '../../engine';
import {
  SpeedLines, StreakLines, ImpactFlash, Shockwave, Debris, DustCloud, BoomWord, shakeAt,
} from './punch-fx-kit';
import { PunchPip, FistInsert, punchFist } from './punch-pip-and-fist';
import { TyphoonSpiral, Rain, holeCycle } from './storm-sky';
import { StormGround } from './che-props-storm-and-icons';
import { PIP } from './che-props-suit-and-drone';

// Chapter E, THE PUNCH at the typhoon (E21-E25, "fight" look): wind-up (E21), the fist insert (E22), THE HIT on "Bùm"
// (E23), the hole opens (E24), Pip stares up with rain on his face while it closes (E25).
// One clock for the sky: T. E23 starts at T = 0 (hit at T = HIT = 2), E24 at T = 18, E25 at T = 58.

const PO = { x: 560, ground: 940, scale: 0.8, side: 1 as const, aim: 125, lunge: 24, lean: -8 };
const HIT = 2; // the hit frame inside E23
const SKY = { cx: 900, cy: 300, R: 1250 };
const holeAt = (T: number) => holeCycle(T, 6, 30, 22, 16);

const Sky: React.FC<{ t: number; id: string; hole?: number; rain?: number }> = ({ t, id, hole = 0, rain = 1 }) => (
  <g>
    <TyphoonSpiral t={t + 40} id={id} cx={SKY.cx} cy={SKY.cy} R={SKY.R} hole={hole} />
    <StormGround t={t} y={940} id={`${id}g`} />
    <Rain t={t} intensity={rain} slant={0.4} />
  </g>
);

// ---------- E21: the wind-up: Pip coils, speed lines gather on the fist, the sky turns ----------
export const E21: React.FC<ShotProps> = ({ t, len }) => {
  const hitT = len + 2;
  const fist = punchFist(t, hitT, PO);
  const g = clamp(t / len);
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 760]]), 560, kf(t, [[0, 1.0], [len, 1.18]]))}>
      <Sky t={t} id="e21" />
      <Glow x={fist.x} y={fist.y} r={160 + 220 * g} o={0.55 * g} />
      <PunchPip t={t} hitT={hitT} {...PO} rimId="rimBlue" />
      <SpeedLines t={t} cx={fist.x} cy={fist.y} n={36} rIn={460 - 200 * g} rOut={1500} o={0.4 * g} />
    </g>
  );
};

// ---------- E22: insert: the fist clenches and trembles, then thrusts at the lens ----------
export const E22: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <FistInsert t={t} id="e22" clenchAt={2} thrustAt={len - 3} />
    <Rain t={t} intensity={0.7} slant={0.4} color="#FFE9E0" />
  </g>
);

// ---------- E23: THE HIT: low-angle side-on, the biggest of the episode, straight up into the spiral ----------
export const E23: React.FC<ShotProps> = ({ t }) => {
  const fist = punchFist(t, HIT, PO);
  const sk = shakeAt(t, HIT, 34, 18);
  const hole = holeAt(t);
  const h = t - HIT;
  const beam = h >= 0 ? clamp(1 - h / 14) : 0;
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 800], [18, 860]]), 520, kf(t, [[0, 1.12], [HIT, 1.2], [18, 1.1]]))}>
        <Sky t={t} id="e23" hole={hole} rain={1 - 0.5 * hole} />
        {/* the blast: a bright column from the fist straight into the eye of the storm */}
        {beam > 0 ? <polygon points={`${fist.x - 40},${fist.y} ${fist.x + 40},${fist.y} ${SKY.cx + 220 * (1 - beam)},-200 ${SKY.cx - 220 * (1 - beam)},-200`} fill="#FFF6D0" opacity={0.55 * beam} /> : null}
        <Glow x={fist.x} y={fist.y} r={t >= HIT ? 900 : 0} o={0.7 * clamp(1 - h / 16)} />
        <Shockwave t={t} hitT={HIT} x={fist.x} y={fist.y} kind="air" r={1500} len={22} />
        <Shockwave t={t} hitT={HIT + 3} x={fist.x} y={fist.y} kind="air" r={1000} len={18} color="#FFE9A8" />
        <Shockwave t={t} hitT={HIT} x={PO.x + 120} y={PO.ground} kind="ground" r={1100} />
        <DustCloud t={t} hitT={HIT} x={PO.x + 100} y={PO.ground - 10} r={150} color="#9FB4DA" />
        <PunchPip t={t} hitT={HIT} {...PO} rimId="rimBlue" />
        <Debris t={t} hitT={HIT} x={PO.x + 120} y={PO.ground - 20} n={44} power={1.5} dir={-80} cone={300} groundY={PO.ground + 20} colors={['#CFE4FF', '#8FB4E8', '#E9F2FF', '#4A5F8A']} />
        <StreakLines t={t} x={fist.x} y={fist.y} dir={-62} n={t >= HIT - 2 && t < HIT + 6 ? 12 : 0} len={620} />
        <SpeedLines t={t} cx={fist.x} cy={fist.y} n={64} rIn={240} rOut={1900} o={h >= 0 && h < 10 ? 0.8 : 0} />
        <ImpactFlash t={t} hitT={HIT} x={fist.x} y={fist.y} r={1500} full />
        <BoomWord t={t} at={HIT + 2} x={1130} y={390} size={300} rot={-6} />
      </g>
    </g>
  );
};

// ---------- E24: the hole opens in the spiral: blue sky, sunbeams; Pip small below, arm still raised ----------
export const E24: React.FC<ShotProps> = ({ t, len }) => {
  const T = t + 18;
  const hole = holeAt(T);
  const sk = shakeAt(t, 0, 10, 10);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 860], [len, 900]]), kf(t, [[0, 520], [len, 400]]), kf(t, [[0, 1.1], [len, 0.95]]))}>
        <Sky t={T} id="e24" hole={hole} rain={1 - 0.8 * hole} />
        <PunchPip t={T} hitT={HIT} {...PO} rimId="rimBlue" fx={false} />
        <Glow x={SKY.cx} y={SKY.cy} r={500 * hole} o={0.4 * hole} />
      </g>
    </g>
  );
};

// ---------- E25: close-up: Pip stares up, rain on his face; behind him the hole in the spiral closes again ----------
export const E25: React.FC<ShotProps> = ({ t, len }) => {
  const T = t + 58;
  const hole = holeAt(T);
  const sc = kf(t, [[0, 3.0], [len, 3.3]]);
  // head centre near y 560: hip = 560 + 176 * scale
  const pose: Pose = { ...basePose, x: 640, y: 600 + 176 * sc, scale: sc, yaw: 0.2, look: 0.2, headTilt: -6, ...faceAt(t, [[0, 'shock']]), blink: t > len - 5 ? 1 : 0 };
  return (
    <g>
      <g transform={camT(960, 540, 1.0)}>
        <TyphoonSpiral t={T + 40} id="e25sp" cx={1250} cy={330} R={SKY.R} hole={hole} />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#06080F" opacity={0.28} />
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
      {/* rain on his face: drops running down, plus streaks in front */}
      {Array.from({ length: 9 }).map((_, i) => {
        const dx = 500 + ((i * 53) % 300);
        const dy = 430 + ((t * (2 + (i % 3)) + i * 61) % 340);
        return <ellipse key={i} cx={dx} cy={dy} rx={6} ry={13} fill="#DCEBFF" opacity={0.55} />;
      })}
      <Rain t={t} intensity={0.9 * (1 - 0.6 * hole)} slant={0.4} />
    </g>
  );
};
