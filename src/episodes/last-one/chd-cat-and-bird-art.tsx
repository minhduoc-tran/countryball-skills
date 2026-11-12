import React from 'react';
import { clamp } from '../../engine';

// Chapter D's creatures, drawn locally: a deadpan cat face for the comic beat (it only blinks), and a pigeon on a
// cable that bobs, fluffs and takes off. Same palette as the engine's Cat so it reads as the same animal.

const CAT = '#3A3E57';
const CAT_SHADE = '#2C3048';

/** A lid that closes and opens: 0 open .. 1 shut. Blinks at the given frames, each over 6 frames. */
export const blinkAt = (t: number, at: number[]) => {
  let v = 0;
  for (const a of at) {
    const k = t - a;
    if (k >= 0 && k < 6) v = Math.max(v, 1 - Math.abs(k - 3) / 3);
  }
  return clamp(v * 1.15);
};

/** The cat's head, big, looking at us (or a little to one side): yellow eyes, a pink nose, whiskers; `blink` 0..1. */
export const CatFace: React.FC<{ x: number; y: number; r?: number; blink?: number; look?: number; flip?: boolean }> = ({ x, y, r = 170, blink = 0, look = 0, flip = false }) => {
  const eyeRy = r * 0.19 * (1 - blink * 0.94);
  const e = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={-r * 0.06} rx={r * 0.21} ry={r * 0.19} fill="#E8D86A" opacity={blink > 0.9 ? 0 : 1} />
      <ellipse cx={cx + look * r * 0.06} cy={-r * 0.06} rx={r * 0.07 * (1 - blink * 0.5)} ry={eyeRy} fill="#111" />
      <ellipse cx={cx + look * r * 0.06 - r * 0.04} cy={-r * 0.12} rx={r * 0.03} ry={r * 0.03} fill="#fff" opacity={1 - blink} />
      {/* the lid: a fur-coloured shade that slides down over the eye */}
      <path d={`M ${cx - r * 0.23} ${-r * 0.26} L ${cx + r * 0.23} ${-r * 0.26} L ${cx + r * 0.23} ${-r * 0.26 + r * 0.46 * blink} Q ${cx} ${-r * 0.2 + r * 0.5 * blink} ${cx - r * 0.23} ${-r * 0.26 + r * 0.46 * blink} Z`} fill={CAT} />
      <path d={`M ${cx - r * 0.2} ${-r * 0.26 + r * 0.44 * blink} Q ${cx} ${-r * 0.2 + r * 0.5 * blink} ${cx + r * 0.2} ${-r * 0.26 + r * 0.44 * blink}`} stroke="#C9CCE0" strokeWidth={r * 0.025} fill="none" strokeLinecap="round" opacity={blink} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path d={`M ${-r * 0.92} ${-r * 0.1} L ${-r * 0.78} ${-r * 1.1} L ${-r * 0.2} ${-r * 0.72} Z M ${r * 0.92} ${-r * 0.1} L ${r * 0.78} ${-r * 1.1} L ${r * 0.2} ${-r * 0.72} Z`} fill={CAT} />
      <path d={`M ${-r * 0.74} ${-r * 0.3} L ${-r * 0.68} ${-r * 0.88} L ${-r * 0.38} ${-r * 0.62} Z M ${r * 0.74} ${-r * 0.3} L ${r * 0.68} ${-r * 0.88} L ${r * 0.38} ${-r * 0.62} Z`} fill="#6A4A5A" opacity={0.7} />
      <ellipse cx={0} cy={0} rx={r} ry={r * 0.88} fill={CAT} />
      <ellipse cx={r * 0.2} cy={r * 0.3} rx={r * 0.78} ry={r * 0.56} fill={CAT_SHADE} opacity={0.5} />
      <path d={`M ${-r * 0.96} ${-r * 0.2} Q ${-r * 0.7} ${-r * 0.86} 0 ${-r * 0.86}`} stroke="#FFB46A" strokeWidth={r * 0.03} fill="none" opacity={0.6} strokeLinecap="round" />
      {e(-r * 0.4)}
      {e(r * 0.4)}
      <path d={`M ${-r * 0.07} ${r * 0.2} L ${r * 0.07} ${r * 0.2} L 0 ${r * 0.29} Z`} fill="#D88A9A" />
      <path d={`M 0 ${r * 0.29} L 0 ${r * 0.38} M 0 ${r * 0.38} Q ${-r * 0.1} ${r * 0.47} ${-r * 0.2} ${r * 0.4} M 0 ${r * 0.38} Q ${r * 0.1} ${r * 0.47} ${r * 0.2} ${r * 0.4}`} stroke="#C9CCE0" strokeWidth={r * 0.025} fill="none" strokeLinecap="round" />
      {[-1, 1].map((sd) => (
        <g key={sd} stroke="#C9CCE0" strokeWidth={r * 0.016} opacity={0.75} strokeLinecap="round">
          <path d={`M ${sd * r * 0.3} ${r * 0.32} L ${sd * r * 0.98} ${r * 0.2}`} />
          <path d={`M ${sd * r * 0.3} ${r * 0.38} L ${sd * r * 1.0} ${r * 0.4}`} />
          <path d={`M ${sd * r * 0.3} ${r * 0.44} L ${sd * r * 0.94} ${r * 0.6}`} />
        </g>
      ))}
    </g>
  );
};

/**
 * A pigeon standing on a cable at (x, y) (its feet), facing right (or left with `flip`). `bob` animates the head;
 * `fly` (0..1+) is a take-off: the wings beat and the feet tuck. Scale `s` 1 is about 110 long.
 */
export const Pigeon: React.FC<{ x: number; y: number; t: number; s?: number; flip?: boolean; fly?: number; seed?: number }> = ({ x, y, t, s = 1, flip = false, fly = 0, seed = 0 }) => {
  const bob = Math.sin(t / 3.4 + seed) * 4;
  const wing = fly > 0 ? Math.sin(t * 0.95 + seed) * 42 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${fly > 0 ? -14 : 0} 0 -36)`}>
      {fly <= 0 ? <path d="M -4 -18 L -4 0 M 10 -18 L 10 0 M -10 0 L 0 0 M 5 0 L 16 0" stroke="#C0707A" strokeWidth={3.4} strokeLinecap="round" fill="none" /> : null}
      <path d="M -34 -38 L -72 -20 L -64 -48 Z" fill="#555B74" />
      {fly > 0 ? (
        <path transform={`rotate(${-30 + wing} -4 -50)`} d="M -4 -50 Q -40 -110 -74 -96 Q -50 -70 -4 -50 Z" fill="#5E647E" />
      ) : null}
      <ellipse cx={0} cy={-38} rx={40} ry={25} fill="#7A8098" />
      <path d="M -30 -50 Q 0 -66 34 -46" stroke="#FFB46A" strokeWidth={2.6} fill="none" opacity={0.65} strokeLinecap="round" />
      <ellipse cx={8} cy={-28} rx={26} ry={13} fill="#9AA0B8" opacity={0.75} />
      <path transform={fly > 0 ? `rotate(${-30 - wing * 0.6} -4 -44)` : undefined} d={fly > 0 ? 'M -4 -46 Q 36 -110 74 -92 Q 40 -64 -4 -46 Z' : 'M -22 -46 Q 8 -64 38 -40 Q 6 -30 -22 -46 Z'} fill="#5E647E" />
      <g transform={`translate(${bob * 0.6} ${Math.abs(bob) * -0.3})`}>
        <circle cx={34} cy={-62} r={15} fill="#7A8098" />
        <ellipse cx={30} cy={-50} rx={11} ry={7} fill="#5E9A8A" opacity={0.85} />
        <path d="M 47 -63 L 62 -58 L 47 -55 Z" fill="#E0A860" />
        <circle cx={40} cy={-66} r={3.6} fill="#FFB84A" />
        <circle cx={40.8} cy={-66} r={1.6} fill="#111" />
      </g>
    </g>
  );
};
