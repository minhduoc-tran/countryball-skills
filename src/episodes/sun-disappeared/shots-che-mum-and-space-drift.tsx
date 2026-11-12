import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, easeInOut, camT, LightVeil, Glow, Dust, KITCHEN, stand, LOOKS,
  Schematic, SchLabel, SCH, rnd, ShotProps,
} from '../../engine';
import { faceBlink, HomeNight, Heater, Blanket, FrontDoor, flick, SIS, PIP } from './che-home-and-door-props';
import { DeepSpace, FrozenEarth, GalaxyDots } from './che-space-and-chip-props';

// Chapter E, "mom" and the drift: mum's gentle look (E10), Pip between the cold door and the warm family (E11),
// then Earth drifting dark and frosted (E12, E13) and the galaxy of wandering planets (E14-E16).

const MOM = LOOKS.mom;

// ---------- E10: medium: mum in the warm kitchen light, a gentle look, leaving it up to Pip ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  const st = stand(KITCHEN, 0.55, 0.42, 0.7);
  const pose: Pose = {
    ...basePose, ...st, yaw: kf(t, [[0, 0.25], [len, 0.1]]), facing: 1, headTilt: kf(t, [[0, 6], [len, 3]]), look: -0.1,
    armL: { a: 10, b: -8 }, armR: { a: 14, b: -10 }, sway: 3, ...faceBlink(t, [[0, 'neutral'], [26, 'happy']], 70, 65),
  };
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 930]]), kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 2.3], [len, 2.55]]))}>
      <HomeNight t={t + 210} id="e10h" dim={0.42} />
      <Hero look={MOM} pose={pose} rimId="rimR" shadow={0} />
      <Glow x={1130} y={520} r={420} o={0.35 * flick(t, 2)} />
      <Dust t={t} seed={10} x0={700} y0={350} w={600} h={420} n={22} o={0.5} />
      <LightVeil id="e10v" lights={[[960, 560, 420], [1130, 560, 260]]} o={0.3} />
    </g>
  );
};

// ---------- E11: wide: Pip in the middle, the cold door on the left, mum and sister by the heater on the right ----------
export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const st = stand(KITCHEN, 0.38, 0.72);
  const look = kf(t, [[0, -0.9], [18, -0.9], [32, 0.9], [50, 0.9], [len, -0.2]]);
  const pip: Pose = {
    ...basePose, ...st, yaw: look * 0.45, facing: look < 0 ? -1 : 1, headTilt: 0, look, armL: { a: 8, b: -6 }, armR: { a: 12, b: -6 },
    sway: 3, ...faceAt(t, [[0, 'worried']]),
  };
  const mom = stand(KITCHEN, 0.86, 0.6, 0.66);
  const momPose: Pose = { ...basePose, ...mom, yaw: -0.5, facing: -1, armL: { a: 8, b: -6 }, armR: { a: 12, b: -6 }, headTilt: 2, ...faceAt(t, [[0, 'neutral']]) };
  const sp = stand(KITCHEN, 0.7, 0.8, 0.62);
  const sis: Pose = { ...basePose, ...sp, scale: sp.scale * 0.72, y: sp.y + 60 * sp.scale * 0.28, yaw: -0.4, facing: -1, armL: { a: 10, b: 8 }, armR: { a: 10, b: 8 }, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), kf(t, [[0, 600], [len, 580]]), kf(t, [[0, 1.05], [len, 1.2]]))}>
      <HomeNight t={t + 260} id="e11h" heaterAt={1040} />
      {/* the cold door on the left wall, blue light seeping under it */}
      <g transform="translate(0 40)">
        <FrontDoor x0={110} y0={240} w={250} h={560} seed={5} frost={1.1} />
        <rect x={110} y={790} width={250} height={8} fill="#8EC8FF" opacity={0.6} />
        <Glow x={235} y={800} r={300} kind="cool" o={0.3} />
      </g>
      <Hero look={SIS} pose={sis} rimId="rimR" shadow={0.5} />
      <Hero look={MOM} pose={momPose} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0.5} />
      <Dust t={t} seed={11} x0={900} y0={500} w={700} h={400} n={20} o={0.5} />
    </g>
  );
};

// ---------- E12: wide: a small dark Earth drifting among the stars ----------
export const E12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 900]]), 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <DeepSpace t={t} id="e12" drift={0.35} />
    <FrozenEarth x={kf(t, [[0, 1250], [len, 880]], easeInOut)} y={kf(t, [[0, 600], [len, 520]], easeInOut)} r={120} t={t} id="e12e" />
  </g>
);

// ---------- E13: closer: the cold, dark world, frost on its seas, a few city lights ----------
export const E13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <DeepSpace t={t + 40} id="e13" drift={0.5} />
    <FrozenEarth x={kf(t, [[0, 860], [len, 760]], easeInOut)} y={560} r={360} t={t} id="e13e" spin={0.6} />
  </g>
);

// ---------- E14: schematic: a spiral galaxy turning slowly ----------
export const E14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 0.95], [len, 1.12]]))}>
    <Schematic t={t} id="e14s" />
    <GalaxyDots cx={960} cy={520} R={760} t={t * 3} n={230} tilt={0.5} />
    <SchLabel x={960} y={930} t={t - 6} text="OUR GALAXY" size={40} color={SCH.dim} />
  </g>
);

// Wandering planets: position drifts along a heading; wrapped to the frame so they never run out.
const roguePlanets = (n: number, t: number, spread: number) =>
  Array.from({ length: n }).map((_, i) => {
    const x = (rnd(21, i) * 2200 + t * (0.8 + rnd(22, i) * 2.2) * (i % 2 ? 1 : -1) + 2200) % 2200 - 140;
    const y = rnd(23, i) * 1180 - 50 + Math.sin(t / 30 + i) * spread;
    return { x, y, r: 5 + rnd(24, i) * 9, dir: i % 2 ? 1 : -1, i };
  });

// ---------- E15: billions of lonely planets, each drifting its own way: "BILLIONS?" ----------
export const E15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Schematic t={t} id="e15s" />
      {roguePlanets(110, t, 6).map((p) => (
        <g key={p.i}>
          <path d={`M ${p.x} ${p.y} l ${-p.dir * 60} 0`} stroke={SCH.dim} strokeWidth={2} strokeDasharray="4 6" opacity={0.45} />
          <circle cx={p.x} cy={p.y} r={p.r} fill="#1B2438" stroke="#9FB4D8" strokeWidth={2.5} />
          <circle cx={p.x - p.r * 0.3} cy={p.y - p.r * 0.3} r={p.r * 0.35} fill="#9FB4D8" opacity={0.4} />
        </g>
      ))}
    </g>
    <SchLabel x={960} y={540} t={t} text="BILLIONS?" size={150} color={SCH.live} />
  </g>
);

// ---------- E16: one lonely planet among the stars, then ours drifts in beside it: "now we would be one of them" ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const join = easeOut(clamp((t - 66) / 45));
  const ex = 1700 - 700 * join;
  const ey = 360 + 190 * join;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 540, kf(t, [[0, 1.08], [len, 1.0]]))}>
      <Schematic t={t} id="e16s" />
      {roguePlanets(22, t, 4).map((p) => (
        <g key={p.i} opacity={0.65}>
          <circle cx={p.x} cy={p.y} r={p.r} fill="#1B2438" stroke="#9FB4D8" strokeWidth={2.5} />
        </g>
      ))}
      <g transform={`translate(${620 - t * 0.5} 520)`}>
        <circle r={60} fill="#1B2438" stroke="#9FB4D8" strokeWidth={4} />
        <circle cx={-18} cy={-18} r={20} fill="#9FB4D8" opacity={0.35} />
      </g>
      {t > 60 ? (
        <g opacity={clamp((t - 60) / 6)}>
          <FrozenEarth x={ex} y={ey} r={70} t={t} id="e16e" />
          <circle cx={ex} cy={ey} r={96 + 6 * Math.sin(t / 5)} fill="none" stroke={SCH.live} strokeWidth={4} strokeDasharray="10 8" opacity={join} />
          <SchLabel x={ex} y={ey + 140} t={t - 90} text="EARTH" size={40} color={SCH.live} />
        </g>
      ) : null}
    </g>
  );
};

export { Heater, Blanket };
