import React from 'react';
import { ShotProps, Hero, LOOKS, poseAt, camT, kf, clamp, easeOut, easeIn } from '../../engine';
import { StreakLines, shakeAt } from './punch-fx-kit';
import { RogueRobot } from './rogue-robot';
import { IndustrialBg, Barricade, Trooper, Tracers, Pings, GROUND } from './chb-industrial-props';

// Chapter B, robot part 1: B25-B28 (70.52-76.27 s). The rogue robot among the factories, bullets bounce off it, Pip crouches and leaps.

/** A small camera jolt each time the robot's foot lands (a step every ~14 frames). */
const stomp = (t: number, phase: number, amp: number) => shakeAt(t, Math.floor((t - phase) / 14) * 14 + phase, amp, 8);

// ---------- B25: wide, the robot marches in among the factories ----------
export const B25: React.FC<ShotProps> = ({ t }) => {
  const s = kf(t, [[0, 0.46], [65, 0.62]]);
  const sk = stomp(t, 6, 6);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 960], [65, 1040]]), 540, 1.0)}>
        <IndustrialBg t={t} id="b25" />
        <Barricade x={300} y={GROUND + 40} s={0.5} />
        <Trooper x={420} y={GROUND + 30} s={0.5} />
        <RogueRobot t={t} x={kf(t, [[0, 1350], [65, 1180]])} y={kf(t, [[0, 850], [65, 890]])} scale={s} walk={1} id="b25r" />
      </g>
    </g>
  );
};

// ---------- B26: the factories slide past, the robot stomps: dust, sparks of rivets ----------
export const B26: React.FC<ShotProps> = ({ t }) => {
  const sk = stomp(t, 4, 12);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(960, 520, 1.0)}>
        <g transform={`translate(${-t * 9} 0)`}><IndustrialBg t={t + 70} id="b26" /></g>
        <RogueRobot t={t + 30} x={960} y={1020} scale={0.78} walk={1.2} id="b26r" />
      </g>
    </g>
  );
};

// ---------- B27: bullets from behind the barricade ping off the armour: it does not even slow ----------
export const B27: React.FC<ShotProps> = ({ t }) => {
  const rx = kf(t, [[0, 1500], [38, 1380]]);
  const sk = stomp(t, 3, 5);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 940], [38, 1000]]), 540, 1.0)}>
        <IndustrialBg t={t + 110} id="b27" smoke={0.7} />
        <RogueRobot t={t + 60} x={rx} y={880} scale={0.72} walk={1} id="b27r" />
        <Tracers t={t} x0={560} y0={720} x1={rx - 120} y1={470} n={8} />
        <Pings t={t} x={rx - 110} y={470} r={320} n={7} seed={3} />
        <Pings t={t + 1} x={rx + 20} y={300} r={200} n={3} seed={8} />
        {[150, 360, 560].map((x, i) => <Trooper key={x} x={x} y={GROUND + 60} s={0.92} flash={(t + i) % 3 === 0 ? 1 : 0} />)}
        {[250, 470].map((x) => <Barricade key={x} x={x} y={GROUND + 110} s={1.2} />)}
      </g>
    </g>
  );
};

// ---------- B28: low angle, Pip crouches and leaps; the robot towers behind ----------
export const B28: React.FC<ShotProps> = ({ t }) => {
  const g = 1010;
  const hip = g - 140 * 0.95;
  const pose = poseAt(t, [
    { f: 0, p: { x: 520, y: hip, scale: 0.95, yaw: 0.9, facing: 1, expr: 'cool', tilt: 4, armL: { a: 20, b: 20 }, armR: { a: 20, b: 20 }, legL: { a: -8, b: 8 }, legR: { a: 10, b: -8 } } },
    { f: 8, p: { y: hip + 46, tilt: 18, armL: { a: -50, b: 30 }, armR: { a: -55, b: 30 }, legL: { a: -48, b: 100 }, legR: { a: 62, b: -105 }, squash: 0.18 }, ease: easeOut },
    { f: 12, p: { y: hip - 70, x: 560, tilt: 8, armL: { a: 150, b: 10 }, armR: { a: 160, b: 10 }, legL: { a: -10, b: 20 }, legR: { a: 12, b: -20 }, squash: -0.2 }, ease: easeIn },
    { f: 29, p: { y: hip - 560, x: 900, tilt: 24, armL: { a: 120, b: 20 }, armR: { a: 170, b: 30 }, legL: { a: -25, b: 50 }, legR: { a: 30, b: -60 }, squash: -0.12 }, ease: easeOut },
  ]);
  const up = clamp((t - 10) / 18);
  return (
    <g transform={camT(kf(t, [[0, 900], [29, 960]]), kf(t, [[0, 640], [29, 470]]), 1.15)}>
      <IndustrialBg t={t + 150} id="b28" />
      <RogueRobot t={t + 90} x={1380} y={1000} scale={0.98} walk={0} id="b28r" />
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimR" shadow={t < 12 ? 1 : 0} />
      {up > 0 ? <StreakLines t={t} x={pose.x} y={pose.y + 150} dir={-90 + 20} n={10} len={420} spread={70} o={0.7 * (1 - up * 0.4)} /> : null}
    </g>
  );
};
