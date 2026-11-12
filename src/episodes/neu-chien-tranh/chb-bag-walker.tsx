import React from 'react';
import { Hero, Look, Expr, Pose, walkPose, joints, toWorld, faceAt, LEG_LEN } from '../../engine';
import { ShopBag } from './chb-scene-props';

// A hurried shopper: a walking Hero (profile) with a stuffed bag in each hand. `at(t)` gives the hip point and scale
// (streetStand / aisleStand, moving with t); the bags follow the hands. Used by the street and supermarket shots.

type At = { x: number; y: number; scale: number };

export const BagWalker: React.FC<{
  look: Look; t: number; at: (t: number) => At; facing: 1 | -1; ph?: number; c?: number; speed?: number; rim?: string; faces?: [number, Expr][];
}> = ({ look, t, at, facing, ph = 0, c = 0, speed = 0.62, rim = 'rimR', faces = [[0, 'worried']] }) => {
  const s = at(t);
  const sw = Math.sin(t * speed + ph);
  const pose: Pose = walkPose(s.x, t * speed + ph, s.y + LEG_LEN * s.scale, s.scale, {
    armL: { a: 7 + 5 * sw, b: 8 },
    armR: { a: 7 - 5 * sw, b: 8 },
    tilt: 9 * facing,
    look: 0.3 * facing,
    ...faceAt(t, faces),
  }, facing);
  const j = joints(pose);
  const near = facing === 1 ? j.armR.end : j.armL.end;
  const far = facing === 1 ? j.armL.end : j.armR.end;
  const hn = toWorld(pose, near);
  const hf = toWorld(pose, far);
  const bs = s.scale * 0.95;
  return (
    <g>
      <ShopBag x={hf.x} y={hf.y} s={bs * 0.9} c={c + 1} />
      <Hero look={look} pose={pose} rimId={rim} shadow={0} />
      <ShopBag x={hn.x} y={hn.y} s={bs} c={c} />
    </g>
  );
};
