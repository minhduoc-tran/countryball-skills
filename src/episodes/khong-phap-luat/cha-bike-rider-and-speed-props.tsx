import React from 'react';
import { Hero, Look, Pose, basePose, Expr, Motorbike, joints, clamp, rnd } from '../../engine';

// Chapter A local props: a character seated on the engine's Motorbike (side view) and speed streaks.
//   <Rider look x y s facing t color expr /> draws the bike and the rider; x, y = the ground point between the wheels,
//   s = Motorbike scale. The rider is the rig at 0.55 * s, hips on the seat, feet on the floorboard, hands on the bars.

const D2R = Math.PI / 180;
// two-bone IK in the rig's "from straight down" degrees (knee/elbow bends toward `bendFwd`)
const ik = (l1: number, l2: number, dx: number, dy: number, bendFwd: boolean) => {
  const d = clamp(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1, l1 + l2 - 0.5);
  const th = Math.atan2(dx, dy) / D2R;
  const al = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)) / D2R;
  const be = Math.acos((l2 * l2 + d * d - l1 * l1) / (2 * l1 * d)) / D2R;
  if (bendFwd) {
    const a = th + al;
    return { a, b: th - be - a };
  }
  const a = th - al;
  return { a, b: th + be - a };
};

const HIP = { x: -22, y: -98 }; // bike coordinates (scale 1, facing right)
const FOOT = { x: 22, y: -34 };
const GRIP = { x: 64, y: -113 };
const K = 0.55; // rider scale relative to the bike

/** The seated pose. `lean` tips the torso (degrees, + forward), `arms` 'bars' | 'up' (both arms raised, cheering). */
export const ridePose = (x: number, y: number, s: number, facing: 1 | -1, o: { lean?: number; arms?: 'bars' | 'up'; bob?: number; expr?: Expr; look?: number; sway?: number } = {}): Pose => {
  const { lean = 10, arms = 'bars', bob = 0, expr = 'neutral', look = 0.4, sway = 0 } = o;
  const sc = K * s;
  const base: Pose = { ...basePose, x: x + facing * HIP.x * s, y: y + HIP.y * s + bob, scale: sc, facing, yaw: facing, tilt: lean * facing, expr, look, sway };
  const j = joints(base);
  // Targets in the rig's local frame (hip = 0, unscaled, screen directions); arms are rotated by the torso tilt, so the
  // target and the shoulder are un-rotated before solving.
  const local = (bx: number, by: number) => ({ x: (facing * (bx - HIP.x) * s) / sc, y: ((by - HIP.y) * s) / sc });
  const unrot = (p: { x: number; y: number }) => {
    const r = (-base.tilt * Math.PI) / 180;
    return { x: p.x * Math.cos(r) - p.y * Math.sin(r), y: p.x * Math.sin(r) + p.y * Math.cos(r) };
  };
  const reach = (side: 'armL' | 'armR', gx: number, gy: number) => {
    const dir = side === 'armR' ? 1 : -1;
    const root = unrot(j[side].root);
    const T = unrot(local(gx, gy));
    return ik(62, 58, (T.x - root.x) * dir, T.y - root.y, false);
  };
  const near = facing === 1 ? 'armR' : 'armL';
  const far = facing === 1 ? 'armL' : 'armR';
  const out: Pose = { ...base };
  if (arms === 'up') {
    out[near] = { a: 150, b: 12 };
    out[far] = { a: 150, b: 12 };
  } else {
    out[near] = reach(near, GRIP.x, GRIP.y);
    out[far] = reach(far, GRIP.x - 4, GRIP.y);
  }
  // thighs forward, shins back down to the floorboard
  const L = ik(72, 68, ((FOOT.x - HIP.x) * s) / sc, ((FOOT.y - HIP.y) * s) / sc, true);
  out.legL = L;
  out.legR = L;
  return out;
};

export type RiderProps = { look: Look; x: number; y: number; s?: number; facing?: 1 | -1; t: number; color?: string; expr?: Expr; arms?: 'bars' | 'up'; lean?: number; helmetHook?: boolean; lamp?: number; rim?: string; bounce?: number };

/** A bike with its rider. Wheels spin with t; the hood strings and the body sway with speed. */
export const Rider: React.FC<RiderProps> = ({ look, x, y, s = 1, facing = 1, t, color = '#B8483E', expr = 'neutral', arms = 'bars', lean = 10, helmetHook = false, lamp = 0, rim, bounce = 1 }) => {
  const bob = Math.sin(t * 0.9) * 2.2 * s * bounce;
  const pose = ridePose(x, y, s, facing, { lean, arms, bob, expr, sway: 22 + 10 * Math.sin(t * 0.8) });
  return (
    <g>
      <Motorbike x={x} y={y + bob * 0.5} s={s} facing={facing} color={color} spin={t * 26} lamp={lamp} helmet={helmetHook} />
      <Hero look={look} pose={pose} rimId={rim ?? (facing === 1 ? 'rimR' : 'rimL')} shadow={0} />
    </g>
  );
};

/** Horizontal speed streaks trailing behind a thing moving toward `dir` (1 = right); (x, y) the centre. */
export const SpeedLines: React.FC<{ x: number; y: number; t: number; dir?: 1 | -1; w?: number; h?: number; n?: number; seed?: number; o?: number }> = ({ x, y, t, dir = 1, w = 420, h = 200, n = 9, seed = 3, o = 0.7 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const len = 90 + rnd(seed, i) * 200;
      const ph = ((t * 0.09 + rnd(seed + 1, i)) % 1 + 1) % 1;
      const x0 = x - dir * (w * 0.1 + ph * w) ;
      const yy = y - h / 2 + rnd(seed + 2, i) * h;
      return <path key={i} d={`M ${x0} ${yy} L ${x0 - dir * len} ${yy}`} stroke="#FFF3DC" strokeWidth={3 + rnd(seed + 3, i) * 4} strokeLinecap="round" opacity={0.75 * (1 - ph)} />;
    })}
  </g>
);

/** A dust puff cloud rolling behind a wheel. */
export const WheelDust: React.FC<{ x: number; y: number; t: number; dir?: 1 | -1; s?: number }> = ({ x, y, t, dir = 1, s = 1 }) => (
  <g>
    {Array.from({ length: 6 }).map((_, i) => {
      const ph = ((t * 0.07 + i / 6) % 1 + 1) % 1;
      return <circle key={i} cx={x - dir * ph * 160 * s} cy={y - ph * 30 * s - 8} r={(10 + ph * 26) * s} fill="#E8D8C4" opacity={0.22 * (1 - ph)} filter="url(#blur6)" />;
    })}
  </g>
);
