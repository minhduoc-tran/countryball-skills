// Shared deterministic maths for the countryball effects kit. Everything is a pure function of its arguments:
// no Math.random, no state, so every effect can be scrubbed, held or played backwards. Frames are 30 fps.

export type Pt = [number, number];

/** Seeded hash in [0, 1). Same (a, b) always gives the same number. */
export const hash = (a: number, b = 0): number => {
  const s = Math.sin(a * 127.1 + b * 311.7 + 1.7) * 43758.5453;
  return s - Math.floor(s);
};
export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** 0..1 progress of t between frames a and b (clamped). */
export const prog = (t: number, a: number, b: number) => clamp((t - a) / Math.max(1e-6, b - a));
export const easeOut = (k: number) => 1 - Math.pow(1 - clamp(k), 3);
export const easeIn = (k: number) => Math.pow(clamp(k), 2);
export const easeInOut = (k: number) => { const c = clamp(k); return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2; };
/** Overshooting ease, for pop-ins. */
export const backOut = (k: number) => { const c = clamp(k), s = 1.70158; return 1 + (s + 1) * Math.pow(c - 1, 3) + s * Math.pow(c - 1, 2); };
export const deg = (rad: number) => (rad * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;
/** Point at distance r, angle a (degrees, 0 = east, 90 = south on screen) from (x, y). */
export const polar = (x: number, y: number, a: number, r: number): Pt => [x + r * Math.cos(rad(a)), y + r * Math.sin(rad(a))];
/** Quadratic bezier point. */
export const bez2 = (p0: Pt, p1: Pt, p2: Pt, u: number): Pt => {
  const v = 1 - u;
  return [v * v * p0[0] + 2 * v * u * p1[0] + u * u * p2[0], v * v * p0[1] + 2 * v * u * p1[1] + u * u * p2[1]];
};
/** Quick flicker factor 0.6..1.4 for fire (changes every frame, smooth-ish). */
export const flicker = (t: number, seed = 0) => 1 + 0.25 * Math.sin(t * 0.9 + seed * 7) + 0.15 * Math.sin(t * 2.3 + seed * 3) + 0.1 * (hash(Math.floor(t), seed) - 0.5);
export const f2 = (n: number) => n.toFixed(2);
