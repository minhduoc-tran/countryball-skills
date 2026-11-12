import React from 'react';
import { rnd } from '../../engine';
import { TopBike, TopCar } from './cha-crossroads-top-props';

// Chapter A: vehicle layouts for the top-down crossroads shots (the junction centre at 960, 540; arms 540 wide).
// Dir: where the vehicle comes FROM. A vehicle heading down the screen has rot 180, heading right 90, left 270, up 0.

export type Dir = 'T' | 'B' | 'L' | 'R';
export type Veh = { kind: 'bike' | 'car'; from: Dir; lane: number; t0: number; speed: number; color: string; shirt?: string; stopAt?: number };

const ROT: Record<Dir, number> = { T: 180, B: 0, L: 90, R: 270 };
const SHIRTS = ['#3E6A8A', '#D9A441', '#E07A2E', '#7A5A8A', '#58B368', '#C8323C', '#4C8CA8'];
const BIKE_COLS = ['#B8483E', '#2FA595', '#EDE6D6', '#3E6A8A', '#D9A441', '#7A5A8A'];

/** Position along the arm: `d` is the distance travelled from the screen edge (0) toward and past the centre. */
const place = (v: Veh, d: number) => {
  switch (v.from) {
    case 'T': return { x: v.lane, y: -160 + d };
    case 'B': return { x: v.lane, y: 1240 - d };
    case 'L': return { x: -160 + d, y: v.lane };
    default: return { x: 2080 - d, y: v.lane };
  }
};

/** Moving traffic: each vehicle drives from its edge at `speed` px/frame from frame t0 (clamped by `stopAt` if given). */
export const MovingTraffic: React.FC<{ t: number; vehicles: Veh[]; ease?: boolean }> = ({ t, vehicles }) => (
  <g>
    {vehicles.map((v, i) => {
      let d = Math.max(0, t - v.t0) * v.speed;
      if (v.stopAt !== undefined) d = Math.min(d, v.stopAt);
      const p = place(v, d);
      const rot = ROT[v.from];
      return v.kind === 'car' ? <TopCar key={i} x={p.x} y={p.y} rot={rot} color={v.color} s={0.9} /> : <TopBike key={i} x={p.x} y={p.y} rot={rot} color={v.color} shirt={v.shirt ?? SHIRTS[i % SHIRTS.length]} />;
    })}
  </g>
);

/** The jam: scooters and taxis packed in the junction and queueing down every arm, each at its own skewed angle. */
export type JamItem = { x: number; y: number; rot: number; kind: 'bike' | 'car'; color: string; shirt: string };
export const JAM: JamItem[] = (() => {
  const out: JamItem[] = [];
  let n = 0;
  const add = (x: number, y: number, rot: number, kind: 'bike' | 'car' = 'bike') => {
    out.push({ x, y, rot, kind, color: kind === 'car' ? (n % 2 ? '#3FA66A' : '#E8B83A') : BIKE_COLS[n % BIKE_COLS.length], shirt: SHIRTS[n % SHIRTS.length] });
    n++;
  };
  // the junction: a knot at all angles
  [[860, 450, 20], [960, 430, -30], [1070, 470, 150], [900, 540, 100], [1010, 560, 70], [1090, 580, 200], [840, 640, 250], [950, 650, 160], [1050, 660, -60]].forEach(([x, y, r]) => add(x, y, r));
  add(1010, 360, 8, 'car'); add(880, 735, 190, 'car');
  // queues down the arms
  for (let i = 0; i < 4; i++) { add(840 + (i % 2) * 130, 250 - Math.floor(i / 2) * 150, 180 + (rnd(2, i) - 0.5) * 20); add(1100, 150 - i * 20 + 40, 175); }
  for (let i = 0; i < 4; i++) add(880 + (i % 2) * 150, 860 + Math.floor(i / 2) * 140, (rnd(3, i) - 0.5) * 24);
  for (let i = 0; i < 3; i++) { add(600 - i * 130, 440 + (i % 2) * 40, 90 + (rnd(4, i) - 0.5) * 20); add(640 - i * 150, 640, 85); }
  for (let i = 0; i < 3; i++) { add(1320 + i * 130, 460 + (i % 2) * 30, 270 + (rnd(5, i) - 0.5) * 20); add(1340 + i * 150, 630, 275); }
  return out;
})();

export const JamLayer: React.FC<{ f?: number; shake?: number; skip?: number[] }> = ({ f = 0, shake = 0, skip = [] }) => (
  <g>
    {JAM.map((v, i) => {
      if (skip.includes(i)) return null;
      const jx = Math.sin(f * 1.7 + i * 2.3) * shake;
      const jy = Math.cos(f * 1.3 + i * 1.7) * shake;
      return v.kind === 'car' ? <TopCar key={i} x={v.x + jx} y={v.y + jy} rot={v.rot} color={v.color} s={0.9} roofLight={i % 2 === 0} /> : <TopBike key={i} x={v.x + jx} y={v.y + jy} rot={v.rot} color={v.color} shirt={v.shirt} />;
    })}
  </g>
);


