import { Pose, Limb, limbSpread, LEG_LEN, streetStand, proj, ST } from '../../engine';

// Chapter C helpers shared by its shot files: two-link arm reach (so a hand lands exactly on a prop), a world-point
// helper for a hand, and street placement shortcuts.

const L1 = 62; // upper arm (rig.tsx UPPER_ARM)
const L2 = 58; // forearm (FORE_ARM)
const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;

/**
 * The { a, b } of `pose`'s arm that puts the hand on world point (wx, wy). Two-link reach with the elbow hanging low;
 * a target out of range gets the arm straightened toward it. Ignores `spin`.
 */
export const armTo = (pose: Pose, side: 'armL' | 'armR', wx: number, wy: number): Limb => {
  const dir = side === 'armR' ? 1 : -1;
  const sx = dir * 42 * limbSpread(pose.yaw) + pose.yaw * 6;
  const sy = -108;
  // the target in hero-local space, then un-tilted (the shoulder turns with the torso)
  const lx = (wx - pose.x) / pose.scale;
  const ly = (wy - pose.y) / pose.scale;
  const tr = rad(-pose.tilt);
  const tx = lx * Math.cos(tr) - ly * Math.sin(tr);
  const ty = lx * Math.sin(tr) + ly * Math.cos(tr);
  // mirror so the arm always swings toward +x'
  const dx = dir * (tx - sx);
  const dy = ty - sy;
  const r = Math.min(Math.hypot(dx, dy), L1 + L2 - 0.5);
  const ang = deg(Math.atan2(dx, dy));
  const cosA = Math.max(-1, Math.min(1, (L1 * L1 + r * r - L2 * L2) / (2 * L1 * Math.max(r, 1))));
  const a = ang - deg(Math.acos(cosA));
  const ex = L1 * Math.sin(rad(a));
  const ey = L1 * Math.cos(rad(a));
  const a2 = deg(Math.atan2(dx - ex, dy - ey));
  return { a, b: a2 - a };
};

/** Where the hand of `pose`'s arm limb ends up in the world (for a prop held in it), given its { a, b }. */
export const handAt = (pose: Pose, side: 'armL' | 'armR', limb: Limb) => {
  const dir = side === 'armR' ? 1 : -1;
  const sx = dir * 42 * limbSpread(pose.yaw) + pose.yaw * 6;
  const sy = -108;
  const ex = sx + dir * L1 * Math.sin(rad(limb.a));
  const ey = sy + L1 * Math.cos(rad(limb.a));
  const hx = ex + dir * L2 * Math.sin(rad(limb.a + limb.b));
  const hy = ey + L2 * Math.cos(rad(limb.a + limb.b));
  const tr = rad(pose.tilt);
  return {
    x: pose.x + (hx * Math.cos(tr) - hy * Math.sin(tr)) * pose.scale,
    y: pose.y + (hx * Math.sin(tr) + hy * Math.cos(tr)) * pose.scale,
  };
};

/** A character standing at street point (X, Z): hip point and scale; the sidewalk flag follows |X| > the kerb. */
export const ped = (X: number, Z: number, low = 0, k = 1.6) => streetStand(X, Z, { sidewalk: Math.abs(X) > ST.road, low, k });

/** The floor line y under a character placed with `ped`. */
export const floorOf = (p: { y: number; scale: number }) => p.y + LEG_LEN * p.scale;

/** Screen position of a ground point on the road (X, Z). */
export const roadPt = (X: number, Z: number, low = 0) => {
  const p = proj(X, 0, Z);
  return { x: p.x, y: p.y + low };
};
