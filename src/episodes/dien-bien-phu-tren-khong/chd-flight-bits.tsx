import React from 'react';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { AircraftKind } from '../../countryball/aircraft-kinds';
import { FlightPath, Trail, pathAtDist, samplePath } from '../../countryball/fx-flight-path';
import { Pt, clamp, prog, rad } from '../../countryball/fx-math';

// Chapter D flight helpers (screen px, t = frame): a straight contrail up to a hit, wingmen on constant-speed lanes,
// the doomed plane before its hit frame, and a B-52 that banks along a curved path (roll squeezes the sprite).

const dirOf = (heading: number): Pt => [Math.cos(rad(heading)), Math.sin(rad(heading))];

/** Twin contrail behind the plane that will be hit at frame `hit` at `at`; fades for 90 frames after the hit. */
export const Contrail: React.FC<{ t: number; hit: number; at: Pt; heading: number; speed: number; size?: number }> = ({ t, hit, at, heading, speed, size = 120 }) => {
  const [dx, dy] = dirOf(heading), L = 800, sp = samplePath([[at[0] - dx * L, at[1] - dy * L], at]);
  const s1 = clamp(L - Math.max(0, hit - t) * speed, 0, L), s0 = Math.max(0, s1 - 440);
  return <Trail sp={sp} s0={s0} s1={s1} w={6} twin={size * 0.16} fade={t < hit ? 1 : 1 - prog(t, hit, hit + 90)} />;
};

/** The plane flying straight until the hit (drawn only before it, B52Shootdown takes over). */
export const DoomedPlane: React.FC<{ id: string; t: number; hit: number; at: Pt; heading: number; speed: number; size?: number }> = ({ id, t, hit, at, heading, speed, size = 120 }) => {
  const [dx, dy] = dirOf(heading), d = (hit - t) * speed;
  return <AircraftTop id={id} kind="b52" size={size} x={at[0] - dx * d} y={at[1] - dy * d} heading={heading} />;
};

/** A plane that is at `at + off` at frame `hit` and flies a straight lane at `speed` px/frame (trail included). */
export const WingLane: React.FC<{ id: string; t: number; hit: number; at: Pt; off: Pt; heading: number; speed: number; size?: number; kind?: AircraftKind }> = ({
  id, t, hit, at, off, heading, speed, size = 120, kind = 'b52',
}) => {
  const [dx, dy] = dirOf(heading), t0 = -200, t1 = hit + 250;
  const start: Pt = [at[0] + off[0] - dx * speed * (hit - t0), at[1] + off[1] - dy * speed * (hit - t0)];
  const end: Pt = [start[0] + dx * speed * (t1 - t0), start[1] + dy * speed * (t1 - t0)];
  return <FlightPath id={id} t={t} t0={t0} t1={t1} points={[start, end]} size={size} kind={kind} trailLen={440} />;
};

/** Plane along a (curved) px path between frames t0..t1, `roll(u)` 1 = level, <1 = banked (wing-over squeeze). */
export const BankPlane: React.FC<{ id: string; t: number; points: Pt[]; t0: number; t1: number; size?: number; roll?: (u: number) => number; trailLen?: number; kind?: AircraftKind }> = ({
  id, t, points, t0, t1, size = 110, roll, trailLen = 420, kind = 'b52',
}) => {
  const sp = samplePath(points), u = prog(t, t0, t1), s = u * sp.total;
  if (t < t0) return null;
  const head = pathAtDist(sp, s);
  return (
    <g>
      <Trail sp={sp} s0={Math.max(0, s - trailLen)} s1={s} w={Math.max(4, size * 0.055)} twin={kind === 'b52' ? size * 0.16 : 0} fade={1 - prog(t, t1, t1 + 40)} />
      <AircraftTop id={id} kind={kind} size={size} x={head.x} y={head.y} heading={head.heading} roll={roll ? roll(u) : 1} />
    </g>
  );
};
