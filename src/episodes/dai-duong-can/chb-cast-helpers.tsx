import React from 'react';
import { Hero, LOOKS, walkPose, poseAt, feetBelowHips, Pose } from '../../engine';

// Chapter B cast helpers. Pip = LOOKS.pipHood, Mo = LOOKS.mo (carries his fishing rod).
//   <Rod x y s facing? up? />   Mo's fishing rod over his shoulder, drawn BEHIND him (call before <Hero>): (x, y) = hip point.
//   <Duo t x ground sc? ... />  Pip + Mo walking side by side to the right (or left with facing -1); x = Pip's hip x.
export const Rod: React.FC<{ x: number; y: number; s: number; facing?: 1 | -1; t?: number }> = ({ x, y, s, facing = 1, t = 0 }) => {
  const x0 = x + facing * 22 * s;
  const y0 = y - 90 * s;
  const x1 = x - facing * 150 * s;
  const y1 = y - 340 * s;
  const sway = Math.sin(t / 9) * 6 * s;
  return (
    <g>
      <path d={`M ${x0} ${y0} L ${x1} ${y1}`} stroke="#3A2A1A" strokeWidth={8 * s} strokeLinecap="round" />
      <path d={`M ${x0} ${y0} L ${x1} ${y1}`} stroke="#B98B4E" strokeWidth={4.5 * s} strokeLinecap="round" />
      <path d={`M ${x1} ${y1} Q ${x1 - facing * 20 * s} ${y1 + 70 * s} ${x1 - facing * 14 * s + sway} ${y1 + 140 * s}`} stroke="#F6EFE3" strokeWidth={1.8 * s} fill="none" />
      <path d={`M ${x1 - facing * 14 * s + sway} ${y1 + 140 * s} q ${facing * 7 * s} 12 ${-facing * 3 * s} 16`} stroke="#F6EFE3" strokeWidth={2.4 * s} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const Duo: React.FC<{ t: number; x: number; ground: number; sc?: number; facing?: 1 | -1; pipExpr?: Pose['expr']; moExpr?: Pose['expr']; gap?: number; speed?: number }> = ({
  t, x, ground, sc = 0.5, facing = 1, pipExpr = 'happy', moExpr = 'neutral', gap = 150, speed = 0.55,
}) => {
  const pip = { ...walkPose(x, t * speed, ground, sc, { expr: pipExpr }, facing) };
  const mo = { ...walkPose(x - facing * gap * sc * 2, t * speed + 1.3, ground, sc, { expr: moExpr, armR: { a: 40, b: -30 } }, facing) };
  return (
    <g>
      <Rod x={mo.x} y={mo.y} s={sc} facing={facing} t={t} />
      <Hero look={LOOKS.mo} pose={mo} rimId="rimR" shadow={1} />
      <Hero look={LOOKS.pipHood} pose={pip} rimId="rimR" shadow={1} />
    </g>
  );
};

/** A standing pose with its feet on `ground`. */
export const standAt = (x: number, ground: number, sc: number, p: Partial<Pose> = {}): Partial<Pose> => ({ x, y: ground - feetBelowHips(sc), scale: sc, ...p });
export { poseAt };
