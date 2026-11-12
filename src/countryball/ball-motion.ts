import { hash } from './fx-math';

// Ball motion helpers: pure functions of the frame `t` returning a BallMotion that Ball applies on top of its pose.
// dx/dy in px (screen), sx/sy scale (squash is anchored at the ball's bottom, so a squash keeps the ball on the floor),
// rot in degrees. Combine several with mixMotion(hop(...), breathe(...)).

export type BallMotion = { dx: number; dy: number; sx: number; sy: number; rot: number };
export const REST: BallMotion = { dx: 0, dy: 0, sx: 1, sy: 1, rot: 0 };

export const mixMotion = (...ms: (BallMotion | undefined)[]): BallMotion =>
  ms.reduce<BallMotion>((a, m) => (m ? { dx: a.dx + m.dx, dy: a.dy + m.dy, sx: a.sx * m.sx, sy: a.sy * m.sy, rot: a.rot + m.rot } : a), REST);

/** Idle breathing: slow squash and stretch. */
export const breathe = (t: number, period = 70, amp = 0.03, phase = 0): BallMotion => {
  const s = Math.sin(((t + phase) / period) * Math.PI * 2) * amp;
  return { ...REST, sx: 1 - s * 0.6, sy: 1 + s };
};

/** Repeated hop: parabola arc of `height` px every `period` frames, squash on landing, stretch in the air. */
export const hop = (t: number, period = 30, height = 40, phase = 0): BallMotion => {
  const k = (((t + phase) % period) + period) % period / period; // 0..1 inside one hop
  const air = 4 * k * (1 - k); // 0 on the ground, 1 at the top
  const land = k < 0.12 ? 1 - k / 0.12 : 0; // squash right after touching down
  return { dx: 0, dy: -height * air, sx: 1 + 0.12 * land - 0.05 * air, sy: 1 - 0.14 * land + 0.08 * air, rot: 0 };
};

/** One hop starting at frame `at` (stays on the ground before and after). */
export const hopOnce = (t: number, at: number, dur = 24, height = 50): BallMotion =>
  t < at || t > at + dur ? REST : hop(t - at, dur, height);

/** Hit shake: decaying jitter after frame `hitT` plus a short squash. */
export const shake = (t: number, hitT: number, amp = 14, len = 18): BallMotion => {
  const a = t - hitT;
  if (a < 0 || a > len) return REST;
  const k = 1 - a / len, j = Math.sin(a * 2.4) * amp * k * k;
  return { dx: j, dy: 0, sx: 1 + 0.08 * k, sy: 1 - 0.08 * k, rot: j * 0.5 + (hash(a, 3) - 0.5) * k * 2 };
};

/** Talking wobble: quick small squash pulses and a slight sway while `on`. */
export const talk = (t: number, on = true, speed = 1): BallMotion => {
  if (!on) return REST;
  const p = Math.abs(Math.sin(t * 0.5 * speed + hash(Math.floor(t * 0.12 * speed)) * 3));
  return { dx: 0, dy: 0, sx: 1 - 0.025 * p, sy: 1 + 0.035 * p, rot: Math.sin(t * 0.13 * speed) * 2 };
};

/** Looking around: slow tilt to one side and back (degrees). Returns the tilt and an eye `look` value. */
export const lookTilt = (t: number, period = 120, maxTilt = 8): { tilt: number; look: number } => {
  const s = Math.sin((t / period) * Math.PI * 2);
  return { tilt: s * maxTilt, look: Math.max(-1, Math.min(1, s * 1.4)) };
};
