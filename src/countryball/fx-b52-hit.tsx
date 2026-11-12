import React from 'react';
import { AircraftTop } from './aircraft-top-view';
import { B52Variant } from './aircraft-kinds';
import { FlakBurst } from './fx-sam-and-flak';
import { Flames, GroundBlast } from './fx-bomb-carpet';
import { Glow, Puff } from './fx-glow';
import { easeIn, easeOut, flicker, Pt, prog, rad } from './fx-math';

// A B-52 shot down: flies straight until the hit at t0, then fire on a wing, a smoke trail, a spiral fall (the plane
// tumbles, curves and shrinks as altitude drops) and a ground blast at t0 + fallDur. All of it is a function of t.
//   <B52Shootdown id t t0 at heading size? speed? fallDur? spin? linger? />
//   shootdownPose(...)   plane position / heading / altitude scale at any frame (to sync SAM aim, camera follow, a ball's reaction)

type Cfg = { at: Pt; heading: number; speed?: number; fallDur?: number; spin?: number };

export const shootdownPose = (t: number, t0: number, { at, heading, speed = 3.2, fallDur = 70, spin = 1 }: Cfg) => {
  if (t <= t0) { const d = (t - t0) * speed; return { x: at[0] + Math.cos(rad(heading)) * d, y: at[1] + Math.sin(rad(heading)) * d, heading, alt: 1, roll: 1, fallen: false }; }
  const dt = Math.min(t - t0, fallDur);
  let x = at[0], y = at[1], h = heading, v = speed;
  for (let i = 0; i < dt; i++) { x += Math.cos(rad(h)) * v; y += Math.sin(rad(h)) * v; h += spin * (1.2 + i * 0.1); v *= 0.985; }
  const roll = Math.cos(dt * 0.4 * (1 + dt / 80));
  return { x, y, heading: h, alt: 1 - 0.4 * easeIn(dt / fallDur), roll: Math.abs(roll) < 0.15 ? 0.15 * Math.sign(roll || 1) : roll, fallen: t - t0 >= fallDur };
};

export const B52Shootdown: React.FC<Cfg & { id: string; t: number; t0: number; size?: number; variant?: B52Variant; linger?: number }> = ({
  id, t, t0, at, heading, size = 110, speed = 3.2, fallDur = 70, spin = 1, variant = 'D', linger = 240,
}) => {
  const cfg = { at, heading, speed, fallDur, spin }, pose = shootdownPose(t, t0, cfg), a = t - t0, k = size / 100;
  const puffs: React.ReactNode[] = [];
  for (let tau = t0; tau <= Math.min(t, t0 + fallDur); tau += 2) {
    const p = shootdownPose(tau, t0, cfg), age = t - tau;
    puffs.push(
      <g key={tau}>
        <Puff x={p.x} y={p.y - age * 0.15} r={(9 + Math.min(age, 90) * 0.34) * p.alt * k} color={age < 14 ? '#3A2A22' : '#25252A'} o={0.85 * (1 - prog(age, 0, 150))} seed={tau} />
        {age < 12 && <Glow x={p.x} y={p.y} r={22 * p.alt * k * (1 - age / 12)} color="#FF8A1E" o={0.8} />}
      </g>,
    );
  }
  // flaming wing: outboard on the left wing, in plane space, rotated with heading and squashed by the roll
  const wl: Pt = [-10 * k * pose.alt, -34 * k * pose.alt * pose.roll], c = Math.cos(rad(pose.heading)), s = Math.sin(rad(pose.heading));
  const wx = pose.x + wl[0] * c - wl[1] * s, wy = pose.y + wl[0] * s + wl[1] * c;
  return (
    <g>
      {puffs}
      {a >= 0 && !pose.fallen && (
        <>
          <Glow x={wx} y={wy} r={50 * k * pose.alt * flicker(t, 4)} color="#FF7A1A" o={0.6} />
          <AircraftTop id={id} kind="b52" variant={variant} size={size * pose.alt} x={pose.x} y={pose.y} heading={pose.heading} roll={pose.roll} />
          <Flames t={t} x={wx} y={wy} s={30 * k * pose.alt} n={4} seed={3} dir={pose.heading + 180} />
        </>
      )}
      {a < 0 && <AircraftTop id={id} kind="b52" variant={variant} size={size} x={pose.x} y={pose.y} heading={heading} />}
      <FlakBurst id={`${id}-hit`} t={t} t0={t0} x={at[0] + wl[0] * c - wl[1] * s} y={at[1] + wl[0] * s + wl[1] * c} r={size * 0.32} life={90} />
      {a >= fallDur && <GroundBlast t={t} t0={t0 + fallDur} x={pose.x} y={pose.y} r={size * 0.5} linger={linger} />}
      {a >= fallDur - 2 && a < fallDur + 6 && <Glow x={pose.x} y={pose.y} r={size * 1.6 * easeOut((a - fallDur + 2) / 8)} color="#FFFFFF" o={0.6 * (1 - prog(a, fallDur, fallDur + 6))} />}
    </g>
  );
};
