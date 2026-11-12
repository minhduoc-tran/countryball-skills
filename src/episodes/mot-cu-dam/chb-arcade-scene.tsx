import React from 'react';
import { clamp } from '../../engine';
import { punchFist, PunchOpts } from './punch-pip-and-fist';

// Shared numbers for the arcade punch scene (B5, B7, B9, B10): the geometry that puts the machine's pad exactly where
// the fist lands, and the machine's flight once it is ripped off its base. Side-on, everything faces right.

/** the carpet line the machine and the fighters stand on (the wall base is ARC_FLOOR, 800) */
export const FLOOR = 900;
export const WALL_X0 = 1580;
export const WALL_X1 = 1900;
export const PIP_OPTS: PunchOpts = { x: 700, ground: FLOOR, scale: 1, side: 1, aim: 88, lunge: 70 };
export const MO_OPTS: PunchOpts = { x: 700, ground: FLOOR, scale: 0.96, side: 1, aim: 84, lunge: 60 };
/** frames after the hit when the machine reaches the wall */
export const HW = 16;

/** Machine x (centre), scale s, and the fist's landing point for a puncher with `o` hitting at hitT. */
export const machineFor = (o: PunchOpts, hitT: number) => {
  const fist = punchFist(hitT, hitT, o);
  const s = (FLOOR - fist.y) / 420;
  return { x: fist.x + 277 * s - 10, s, fist };
};

/** Machine state h frames after the hit: x shift, y lift, tilt (deg). It hits the wall at HW, then crashes on through, slowing. */
export const flight = (h: number, mx: number, s: number) => {
  if (h < 0) return { dx: 0, dy: 0, rot: 0 };
  const D = WALL_X0 - 190 * s - mx;
  const dx = h < HW ? D * Math.pow(h / HW, 1.8) : D + 300 * (1 - Math.exp(-(h - HW) / 10)) + 10 * (h - HW);
  const dy = -3.5 * Math.min(h, HW) * (h < HW ? 1 : 0.7) - (h > HW ? 4 * (h - HW) : 0) + (h > 34 ? 0.4 * (h - 34) * (h - 34) : 0);
  const rot = 1.2 * h + (h > HW ? 1.8 * (h - HW) : 0);
  return { dx, dy, rot };
};

/** The bolted-down plate left behind where the machine stood, with torn cables sparking. */
export const BaseStub: React.FC<{ x: number; y: number; s: number; t: number; hitT: number }> = ({ x, y, s, t, hitT }) => {
  const h = t - hitT;
  if (h < 0) return null;
  const sp = clamp(1 - h / 40);
  return (
    <g>
      <rect x={x - 180 * s} y={y - 18 * s} width={360 * s} height={18 * s} fill="#14204F" stroke="#150E1F" strokeWidth={6} />
      {[-150, -50, 60, 150].map((dx) => <circle key={dx} cx={x + dx * s} cy={y - 9 * s} r={6 * s} fill="#8A91B8" stroke="#150E1F" strokeWidth={2} />)}
      <path d={`M ${x - 40 * s} ${y - 18 * s} q 20 -60 ${50 * s} -50 t 20 -40`} stroke="#150E1F" strokeWidth={8} fill="none" strokeLinecap="round" />
      {sp > 0 && h % 3 !== 2 ? <polygon points={`${x + 30 * s},${y - 100 * s} ${x + 52 * s},${y - 132 * s} ${x + 42 * s},${y - 106 * s} ${x + 66 * s},${y - 140 * s}`} fill="#FFE27A" opacity={sp} /> : null}
    </g>
  );
};
