import React from 'react';
import { EyePair, Eyes } from './ball-face';
import { FLAGS } from './ball-flags';
import { BallMotion, REST } from './ball-motion';
import { NonLa } from './ball-accessories';

// Countryball kit: a ball = a flag clipped to a circle, a thick black outline, soft shading and two white eyes
// (no pupils, the genre rule). Flags are drawn in a unit box (-1..1) and the whole ball is scaled by r.
// Split across: ball-flags (flags), ball-face (expressions), ball-accessories (hats, glasses, headset),
// ball-motion (hop, breathe, shake...), ball-speech-and-props (speech bubble, document, pen, binoculars).

export type { Eyes };
export { FLAGS, NonLa };

export const Ball: React.FC<{
  id: string; x: number; y: number; r: number; flag: string;
  eyes?: Eyes; look?: number; tilt?: number; hat?: React.ReactNode; sweat?: boolean;
  /** Extra motion (hop, breathe, shake, talk...) from ball-motion.ts; squash is anchored at the ball's bottom. */
  motion?: BallMotion;
  /** Frame, only used to spin the 'dizzy' spirals. */
  t?: number;
  /** Tear under the eye for 'sad'. */
  tear?: boolean;
  /** Draw the soft floor shadow (default true). */
  shadow?: boolean;
}> = ({ id, x, y, r, flag, eyes = 'normal', look = 0, tilt = 0, hat, sweat, motion = REST, t = 0, tear, shadow = true }) => (
  <g>
    {shadow && <ellipse cx={x + r * 0.08} cy={y + r * 0.98} rx={r * 0.85 * (1 + (motion.sx - 1) * 0.5) * (motion.dy < 0 ? 1 + motion.dy / (r * 6) : 1)} ry={r * 0.16}
      fill="#000" opacity={0.28} />}
    {/* translate(0,1) scale translate(0,-1): squash around the ball's bottom point */}
    <g transform={`translate(${x + motion.dx},${y + motion.dy}) rotate(${tilt + motion.rot}) scale(${r}) translate(0,1) scale(${motion.sx},${motion.sy}) translate(0,-1)`}>
      <defs>
        <clipPath id={`cb-clip-${id}`}><circle r={1} /></clipPath>
        <radialGradient id={`cb-shade-${id}`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#FFF" stopOpacity={0.28} />
          <stop offset="0.55" stopColor="#FFF" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.35} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#cb-clip-${id})`}>
        {FLAGS[flag]()}
        <circle r={1} fill={`url(#cb-shade-${id})`} />
      </g>
      <circle r={1} fill="none" stroke="#111" strokeWidth={0.07} />
      <EyePair eyes={eyes} look={look} t={t} tear={tear} />
      {sweat && <path d="M0.78,-0.62 Q0.9,-0.44 0.78,-0.36 Q0.66,-0.44 0.78,-0.62 Z" fill="#7FC8F0" stroke="#111" strokeWidth={0.035} />}
      {hat}
    </g>
  </g>
);
