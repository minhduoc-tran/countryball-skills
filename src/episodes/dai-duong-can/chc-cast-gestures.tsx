import React from 'react';
import { Pose, Look, HEAD, clamp, easeOut } from '../../engine';

// A hand raised to the face, drawn AFTER the Hero (the rig draws the head over the arms, so a rig arm can't reach the face).
//   <FaceHand pose look k at? side? />   sleeve from the shoulder to the nose (at 'nose') or the mouth (at 'mouth'); k 0..1 raises it.
//   Fingers pinch for the nose, a fist-ish cup for the mouth. dir = which screen side the arm comes from (default: behind the facing).

export const FaceHand: React.FC<{ pose: Pose; look: Look; k: number; at?: 'nose' | 'mouth'; dir?: 1 | -1 }> = ({ pose, look, k, at = 'nose', dir }) => {
  if (k <= 0) return null;
  const sc = pose.scale;
  const side = dir ?? (pose.facing === 1 ? -1 : 1);
  const hx = pose.x + Math.sin((pose.tilt * Math.PI) / 180) * 176 * sc;
  const hy = pose.y + HEAD.y * sc;
  const fx = hx + pose.yaw * 26 * sc + (at === 'mouth' ? pose.yaw * 4 * sc : 0);
  const fy = hy + (at === 'nose' ? 16 : 42) * sc;
  const e = easeOut(clamp(k));
  const sx = pose.x + side * 46 * sc;
  const sy = pose.y - 128 * sc;
  const ex = sx + (fx - sx) * 0.5 + side * 58 * sc;
  const ey = sy + (fy - sy) * 0.55 + 36 * sc;
  const wx = sx + (fx - sx) * e;
  const wy = sy + (fy - sy) * e;
  const mx = sx + (ex - sx) * e + side * 20 * sc * (1 - e);
  const my = sy + (ey - sy) * e + 60 * sc * (1 - e);
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d={`M ${sx} ${sy} L ${mx} ${my} L ${wx} ${wy}`} stroke={look.line} strokeWidth={21 * sc} fill="none" />
      <path d={`M ${sx} ${sy} L ${mx} ${my} L ${wx} ${wy}`} stroke={look.jacket} strokeWidth={14 * sc} fill="none" />
      {at === 'nose' ? (
        <g transform={`translate(${wx} ${wy})`}>
          <circle r={19 * sc} fill={look.hand} stroke={look.line} strokeWidth={4 * sc} />
          <path d={`M ${-side * 6 * sc} ${-12 * sc} l ${-side * 10 * sc} ${-12 * sc}`} stroke={look.line} strokeWidth={4 * sc} />
        </g>
      ) : (
        <g transform={`translate(${wx} ${wy})`}>
          <circle r={22 * sc} fill={look.hand} stroke={look.line} strokeWidth={4 * sc} />
          <path d={`M ${-10 * sc} ${-2 * sc} h ${20 * sc} M ${-9 * sc} ${8 * sc} h ${18 * sc}`} stroke={look.line} strokeWidth={3 * sc} opacity={0.7} />
        </g>
      )}
    </g>
  );
};
