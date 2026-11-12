import React from 'react';
import { Hero, Look, Pose, walkPose, LEG_LEN } from '../../engine';
import { ped, floorOf } from '../neu-chien-tranh/chc-pose-utils';

// Chapter C: a pedestrian on the Street set at ground point (X, Z). Walk phase from the shot clock; `facing` -1 walks to screen-left.
export const Walker: React.FC<{
  look: Look; X: number; Z: number; phase: number; facing?: 1 | -1; scale?: number; extra?: Partial<Pose>; rim?: string; low?: number;
}> = ({ look, X, Z, phase, facing = 1, scale = 1, extra = {}, rim = 'rimR', low = 0 }) => {
  const g = ped(X, Z, low);
  const pose = walkPose(g.x, phase, floorOf(g), g.scale * scale, extra, facing);
  return <Hero look={look} pose={pose} rimId={rim} shadow={0} />;
};

/** The same spot standing still (no walk cycle). */
export const Stander: React.FC<{
  look: Look; X: number; Z: number; yaw?: number; scale?: number; extra?: Partial<Pose>; rim?: string; low?: number;
}> = ({ look, X, Z, yaw = 0, scale = 1, extra = {}, rim = 'rimR', low = 0 }) => {
  const g = ped(X, Z, low);
  const sc = g.scale * scale;
  const pose: Pose = { ...walkPose(g.x, 0, floorOf(g), sc, {}, 1), legL: { a: 4, b: 0 }, legR: { a: -4, b: 0 }, armL: { a: 8, b: 6 }, armR: { a: 8, b: 6 }, y: floorOf(g) - LEG_LEN * sc, tilt: 0, yaw, facing: yaw < 0 ? -1 : 1, ...extra };
  return <Hero look={look} pose={pose} rimId={rim} shadow={0} />;
};
