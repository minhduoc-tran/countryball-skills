import React from 'react';
import { Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS, LEG_LEN, Glow, Sparkle, Rooftop, walkPose, stand, rnd, joints, toWorld, ShotProps } from '../../engine';
import { Splash } from '../mot-cu-dam/chf-storm-props';
import { Confetti } from '../infinite-money/chb-card-terminal-and-confetti';
import { PoolSide, Restaurant, REST, Dish, PartyHat, PIP_SUIT, PIP_SUIT_BLUE } from './cha-places-props';

// Chapter A, "every day is a holiday" (54.6-61.0 s): blue hair and a jump into a hotel pool in a suit; eating the whole
// menu of a restaurant (a long table of dishes, the empty plates stacking up); a rooftop party with confetti.
const PIP = LOOKS.pipHood;

// ---------- A26: wide poolside at dusk: Pip in a suit, his hair pops blue, he runs and cannonballs into the pool ----------
export const A26: React.FC<ShotProps> = ({ t, len }) => {
  const blue = 9;
  const run0 = 34;
  const jump = 56;
  const entry = 72;
  const deck = 650;
  const sc = 0.95;
  const x = t < run0 ? 640 : t < jump ? kf(t, [[run0, 640], [jump, 930]], (v) => v) : kf(t, [[jump, 930], [entry, 1180]], (v) => v);
  const air = clamp((t - jump) / (entry - jump));
  const yJump = -Math.sin(air * Math.PI) * 200 + easeIn(air) * 170;
  let pose: Pose;
  if (t < run0) {
    pose = poseAt(t, [
      { f: 0, p: { x, y: deck - LEG_LEN * sc, scale: sc, yaw: 0.2, look: 0.2, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
      { f: blue + 2, p: { squash: 0.08, armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 } }, ease: easeOut },
      { f: blue + 8, p: { squash: 0, armL: { a: 140, b: 14 }, armR: { a: 144, b: 14 } } },
      { f: run0, p: { armL: { a: 30, b: 40 }, armR: { a: 30, b: 40 }, yaw: 0.8 } },
    ]);
  } else if (t < jump) {
    pose = walkPose(x, (t - run0) * 0.9, deck, sc, { yaw: 0.85, tilt: 12, armL: { a: 40 * Math.sin((t - run0) * 0.9), b: 60 }, armR: { a: -40 * Math.sin((t - run0) * 0.9), b: 60 } }, 1);
  } else {
    pose = poseAt(t - jump, [
      { f: 0, p: { x, y: deck - LEG_LEN * sc + yJump, scale: sc, yaw: 0.6, tilt: 8, squash: -0.1, armL: { a: 160, b: 0 }, armR: { a: 160, b: 0 }, legL: { a: 10, b: 0 }, legR: { a: -10, b: 0 } } },
      { f: 5, p: { squash: 0, legL: { a: 80, b: -120 }, legR: { a: 70, b: -120 }, armL: { a: 60, b: 90 }, armR: { a: 60, b: 90 } }, ease: easeOut },
    ]);
    pose = { ...pose, x, y: deck - LEG_LEN * sc + yJump };
  }
  const look = t < blue ? PIP_SUIT : PIP_SUIT_BLUE;
  const under = t >= entry;
  const head = { x: pose.x, y: pose.y - 176 * sc };
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 960]]), kf(t, [[0, 560], [len, 580]]), kf(t, [[0, 1.12], [len, 1.18]]))}>
      <PoolSide t={t} id="ca26" />
      {!under ? <Hero look={look} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [blue, 'happy']]) }} rimId="rimR" shadow={t < jump ? 1 : 0} /> : null}
      <Sparkle x={head.x} y={head.y - 40} t={t - blue + 1} s={1.2} />
      {t >= blue && t < blue + 8 ? <circle cx={head.x} cy={head.y - 20} r={60 + (t - blue) * 22} fill="none" stroke="#7FD4FF" strokeWidth={8} opacity={1 - (t - blue) / 8} /> : null}
      {under ? (
        <g>
          {/* the water column and the rings */}
          <path d={`M ${1110} 712 Q ${1180} ${712 - 420 * Math.sin(clamp((t - entry) / 16) * Math.PI)} ${1250} 712 Z`} fill="#DFF8FF" opacity={0.85 * (1 - clamp((t - entry - 10) / 10))} />
          <Splash x={1180} y={712} p={clamp((t - entry) / 18)} s={4} seed={4} />
          <Splash x={1180} y={712} p={clamp((t - entry - 4) / 18)} s={5.5} seed={7} />
          {/* bubbles where he went in */}
          {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={1170 + rnd(5, i) * 40 - 20} cy={760 - ((t - entry) * 3 + i * 14) % 60} r={6} fill="none" stroke="#DFF8FF" strokeWidth={3} opacity={0.7} />)}
        </g>
      ) : null}
    </g>
  );
};

// ---------- A27: the restaurant: a long table of dishes; Pip eats down the menu, empty plates stacking up ----------
const DISHES = Array.from({ length: 22 }).map((_, i) => ({ x: 180 + i * 72 + (i % 2) * 14, row: i % 2, kind: (i * 3) % 4 }));
export const A27: React.FC<ShotProps> = ({ t, len }) => {
  const p = stand(REST, 0.5, 0.52);
  const top = p.y + 18;
  const floor = p.y + LEG_LEN * p.scale + 30;
  const eaten = Math.floor(clamp(t / len) * 10) + 3;
  const bite = Math.sin(t * 0.7);
  const pose = poseAt(t, [{ f: 0, p: { ...p, yaw: -0.3, look: -0.2, headTilt: 10 + bite * 4, armL: { a: 20 + bite * 4, b: -118 }, armR: { a: 14, b: -6 } } }]);
  const bowl = toWorld(pose, joints(pose).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 880]]), kf(t, [[0, top - 70], [len, top - 80]]), kf(t, [[0, 1.6], [len, 1.66]]))}>
      <Restaurant t={t + 40} id="ca27" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      {/* his bowl of phở at his chest, chopsticks going in */}
      <Dish x={bowl.x + 6} y={bowl.y + 16} s={0.42} kind={0} />
      <path d={`M ${bowl.x + 10} ${bowl.y - 14} L ${bowl.x + 34} ${bowl.y - 70 - bite * 10} M ${bowl.x + 18} ${bowl.y - 12} L ${bowl.x + 44} ${bowl.y - 66 - bite * 10}`} stroke="#C9A46A" strokeWidth={5} strokeLinecap="round" />
      {/* the long table: a red cloth down to the floor, the top crowded with the whole menu */}
      <polygon points={`120,${top} 1800,${top} 1840,${top + 60} 80,${top + 60}`} fill="#E9E2D2" />
      <rect x={80} y={top + 60} width={1760} height={floor - top - 60} fill="#B8483E" />
      <path d={`M 80 ${top + 60} L 1840 ${top + 60}`} stroke="#8A2E26" strokeWidth={10} />
      {Array.from({ length: 22 }).map((_, k) => <path key={k} d={`M ${110 + k * 80} ${top + 70} L ${100 + k * 80} ${floor - 4}`} stroke="#9A3A30" strokeWidth={4} opacity={0.6} />)}
      <rect x={80} y={floor - 6} width={1760} height={20} fill="#000" opacity={0.35} />
      <path d={`M 120 ${top} L 1800 ${top}`} stroke="#FFC98A" strokeWidth={3} opacity={0.5} />
      {/* dishes: the ones nearest Pip go first, their plates stacking up */}
      {DISHES.map((d, i) => {
        const order = Math.abs(d.x - 960);
        const rank = DISHES.filter((e) => Math.abs(e.x - 960) < order).length;
        if (rank < eaten) return null;
        return <Dish key={i} x={d.x} y={top + 16 + d.row * 30} s={0.62} kind={d.kind} />;
      })}
      {Array.from({ length: eaten }).map((_, k) => <Dish key={`s${k}`} x={1090} y={top + 34 - k * 9} s={0.6} kind={4} />)}
      <Glow x={960} y={top - 80} r={420} o={0.3} />
    </g>
  );
};

// ---------- A28: wide rooftop party at dusk: party hats, arms up, confetti, string lights: every day a holiday ----------
export const A28: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.05;
  const feet = 828;
  const jumpP = (ph: number) => Math.max(0, Math.sin(t * 0.32 + ph)) * 26;
  const pip = poseAt(t, [{ f: 0, p: { x: 860, y: feet - LEG_LEN * sc - jumpP(0), scale: sc, yaw: 0.25, look: 0.4, armL: { a: 160, b: 10 }, armR: { a: 150 + Math.sin(t / 3) * 10, b: 14 }, squash: -0.03 } }]);
  const mo = poseAt(t, [{ f: 0, p: { x: 1150, y: feet - LEG_LEN * sc - jumpP(1.6), scale: sc, yaw: -0.35, look: -0.5, armL: { a: 150, b: 20 }, armR: { a: 140 + Math.sin(t / 3 + 1) * 12, b: 10 } } }]);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 990], [len, 1000]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.08], [len, 1.16]]))}>
        <Rooftop t={t + 500} sunX={1500} sunY={640} cityLit={1.6} />
        {/* fireworks over the city */}
        {[[520, 300, 0], [1460, 240, 14], [980, 200, 28]].map(([fx, fy, d], k) => {
          const q = ((t + d) % 40) / 40;
          return (
            <g key={k} opacity={1 - q}>
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <path key={i} d={`M ${fx + Math.cos(a) * 30 * q} ${fy + Math.sin(a) * 30 * q} L ${fx + Math.cos(a) * 120 * q} ${fy + Math.sin(a) * 120 * q + 30 * q * q}`} stroke={['#FFD04D', '#FF6A5A', '#5FB4FF'][k]} strokeWidth={5} strokeLinecap="round" />;
              })}
            </g>
          );
        })}
        <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
        <PartyHat pose={pip} />
        <Hero look={LOOKS.mo} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={1} />
        <PartyHat pose={mo} />
      </g>
      <Confetti t={t + 20} x0={0} y0={-60} w={1920} h={1200} n={60} seed={5} speed={6} />
      <Glow x={1500} y={600} r={600} o={0.25} />
    </g>
  );
};
