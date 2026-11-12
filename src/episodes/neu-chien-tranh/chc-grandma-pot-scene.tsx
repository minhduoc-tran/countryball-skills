import React from 'react';
import { Hero, Look, Pose, basePose, faceAt, clamp } from '../../engine';
import { PorridgePot, Ladle, Bowl, GRANDMA, WORKER, ChargeStation, hipFor } from './chc-neighbours-props';
import { armTo, handAt } from './chc-pose-utils';

// Chapter C, week one: reusable figures for the porridge pot and the charging station. Everything is placed by a
// floor line (`fy`) and a hero scale (`s`), so the same scene works far down the street or in a medium shot.

export type PotServe = { x: number; y: number } | null;

/**
 * Grandma behind the huge pot, stirring or ladling. `x` is the POT's centre, `fy` the floor line, `s` the hero scale
 * (the pot is drawn in hero units, its rim at her waist). `serve` is a world point (a bowl's top); `mix` 0..1 moves the
 * ladle tip from stirring to it and back (arc). The whole pot is drawn after her, so it covers her legs.
 */
export const GrandmaPot: React.FC<{ x: number; fy: number; s: number; t: number; serve?: PotServe; mix?: number; glow?: number; expr?: Pose['expr']; rim?: string }> = ({
  x, fy, s, t, serve = null, mix = 0, glow = 1, expr = 'happy', rim = 'rimR',
}) => {
  const a = t * 0.3;
  const sy = fy - 166 * s;
  const stir = { x: x + 20 * s + Math.cos(a) * 36 * s, y: sy + Math.sin(a) * 6 * s };
  const tip = serve ? { x: stir.x + (serve.x - stir.x) * mix, y: stir.y + (serve.y - stir.y) * mix - Math.sin(mix * Math.PI) * 46 * s } : stir;
  const gx = x - 28 * s;
  const base: Pose = { ...basePose, x: gx, y: hipFor(fy, s), scale: s, yaw: 0.4, tilt: 2 + 2 * Math.sin(a), expr };
  const armR = armTo(base, 'armR', tip.x - 40 * s, tip.y - 62 * s);
  const pose: Pose = { ...base, armR, armL: { a: 16, b: 24 }, look: 0.7, ...faceAt(t, [[0, expr]]) };
  const h = handAt(pose, 'armR', armR);
  return (
    <g>
      <Hero look={GRANDMA} pose={pose} rimId={rim} shadow={0} />
      <PorridgePot x={x} y={fy} s={s} t={t} layer="back" glow={glow} />
      <Ladle hx={h.x} hy={h.y} px={tip.x} py={tip.y} s={s * 1.1} lift={serve ? 40 * Math.sin(mix * Math.PI) : 0} />
      <PorridgePot x={x} y={fy} s={s} t={t} layer="front" />
    </g>
  );
};

/**
 * A neighbour in profile holding a bowl out toward the cook, facing screen-left (`dir` -1) or right (1). `got` 0..1:
 * how full the bowl is. Idle breathing comes from `t`.
 */
export const BowlHolder: React.FC<{ x: number; fy: number; s: number; t: number; look: Look; dir?: 1 | -1; got?: number; reach?: number; seed?: number; expr?: Pose['expr']; rim?: string }> = ({
  x, fy, s, t, look, dir = -1, got = 0, reach = 1, seed = 0, expr = 'happy', rim = 'rimR',
}) => {
  const side = dir === -1 ? 'armL' : 'armR';
  const base: Pose = { ...basePose, x, y: hipFor(fy, s), scale: s, yaw: 0.72 * dir, facing: dir, tilt: 2 * dir + Math.sin(t / 14 + seed) * 0.8, expr };
  const hand = { x: x + dir * (58 + 18 * reach) * s, y: fy - 100 * s };
  const arm = armTo(base, side, hand.x, hand.y);
  const pose: Pose = { ...base, [side]: arm, look: dir * 0.6, ...faceAt(t + seed * 7, [[0, expr]]) };
  const h = handAt(pose, side, arm);
  return (
    <g>
      <Hero look={look} pose={pose} rimId={rim} shadow={0} />
      <Bowl x={h.x} y={h.y + 24 * s} s={s * 0.85} t={t + seed * 5} steam={got > 0.2} full={clamp(got * 1.5)} />
    </g>
  );
};

/** The charging station with the mechanic building it: he stands left of the table, hands on the battery. */
export const MechanicStation: React.FC<{ x: number; fy: number; s: number; t: number; built: number; expr?: Pose['expr']; cheer?: number; rim?: string; n?: number }> = ({
  x, fy, s, t, built, expr = 'happy', cheer = 0, rim = 'rimR', n = 6,
}) => {
  const tableX = x + 215 * s;
  const base: Pose = { ...basePose, x, y: hipFor(fy, s), scale: s, yaw: 0.7, tilt: 4, expr };
  const wig = Math.sin(t * 0.7) * 4 * s * (1 - cheer);
  const tgt = { x: tableX - 112 * s + 6 * s + wig, y: fy - 190 * s + Math.cos(t * 0.5) * 3 * s };
  const armR = armTo(base, 'armR', tgt.x, tgt.y);
  const armL: Pose['armL'] = cheer > 0 ? { a: -8 + 108 * cheer, b: 30 + 22 * cheer } : { a: -8, b: 30 };
  const pose: Pose = { ...base, armR: cheer > 0.5 ? { a: 12, b: 20 } : armR, armL, look: 0.5, tilt: 4 - 4 * cheer, ...faceAt(t, [[0, expr]]) };
  return (
    <g>
      <Hero look={WORKER} pose={pose} rimId={rim} shadow={0} />
      <ChargeStation x={tableX} y={fy} s={s} t={t} built={built} n={n} />
    </g>
  );
};
