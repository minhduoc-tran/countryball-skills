import { useCurrentFrame, useVideoConfig } from 'remotion';

// Time + easing helpers for the HUD. Every HUD piece takes an optional `t` (seconds); without it they read the
// current frame, so they are pure functions of the frame either way (no state, no randomness).

export const useT = (t?: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return t ?? frame / fps;
};

export const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
export const easeOutCubic = (u: number) => 1 - Math.pow(1 - clamp01(u), 3);
export const easeInOutCubic = (u: number) => { const c = clamp01(u); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
/** Overshoots ~10% then settles: the "slide + settle" of cards and chips. */
export const easeOutBack = (u: number) => { const c = clamp01(u), k = 1.70158; return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2); };

/**
 * Enter/exit envelope for a HUD element visible during [from, to] (seconds, to optional).
 * `enter` 0..1 (with overshoot, for slide/settle), `leave` 0..1, `a` = overall opacity 0..1.
 */
export function appear(t: number, from = -1e9, to = 1e9, inDur = 0.55, outDur = 0.4) {
  const enter = easeOutBack((t - from) / inDur), leave = easeInOutCubic((t - (to - outDur)) / outDur);
  const a = clamp01((t - from) / (inDur * 0.5)) * (1 - leave);
  return { enter, leave, a, visible: a > 0.001 };
}
