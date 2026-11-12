import React from 'react';
import {
  Hero, Pose, poseAt, kf, clamp, easeOut, camT, LOOKS, joints, toWorld,
  Street, Motorbike, proj, propScale, px, Cat, CanFood, Glow, ShotProps,
} from '../../engine';
import { blinkAt } from './chd-cat-and-bird-art';

// Day 5, the street with the grass creeping back. Low, tight on the abandoned scooter (the Street's first road bike).
// D2: Pip crouched in profile on the right, an open can of fish in his hand; two eyes glint in the dark under the
// scooter. D2b: the cat creeps out toward the can. The cat is drawn before the scooter is drawn again on top, so it
// starts hidden underneath. Pip's soles are placed from his joints so they touch the road.

const PIP = LOOKS.pipHood;
const LOW = 120;
const BIKE = { X: 1.7, Z: 7.4 };
const BP = (() => { const p = proj(BIKE.X, 0, BIKE.Z); return { x: p.x, y: p.y + LOW }; })();
const BS = propScale(BIKE.Z);
const PIP_G = (() => { const p = proj(3.75, 0, 6.9); return { x: p.x, y: p.y + LOW, s: (1.6 * px(6.9)) / 378 }; })();

/** The crouch: both legs folded under him, torso leaning in, left (screen-left, facing left) arm holding out the can. */
const crouch = (extra: Partial<Pose> = {}): Pose => {
  const base: Pose = {
    x: PIP_G.x, y: 0, scale: PIP_G.s, facing: -1, yaw: -0.9, tilt: -12, headTilt: -4, look: -0.9, expr: 'neutral', blink: 0, spin: 0, squash: 0, sway: 0,
    glasses: 0, handL: 'open', handR: 'open',
    legL: { a: 60, b: -100 }, legR: { a: 54, b: -94 }, armL: { a: 70, b: 14 }, armR: { a: 14, b: 10 }, ...extra,
  };
  const j = joints(base);
  const low = Math.max(j.legL.end.y, j.legR.end.y); // the lowest sole, local; put it on the road
  return { ...base, y: PIP_G.y - low * base.scale };
};

const Scene: React.FC<{ t: number; len: number; eyes: number; out: number; zoom: [number, number] }> = ({ t, len, eyes, out, zoom }) => {
  const p0 = crouch();
  const pose = poseAt(t, [{ f: 0, p: { ...p0, tilt: -8 } }, { f: 14, p: { tilt: -13, headTilt: -6 } }, { f: 60, p: { tilt: -11 } }]);
  const hand = toWorld(pose, joints(pose).armL.end);
  const cs = (px(BIKE.Z) * 1.05) / 140;
  const canX = hand.x - 6;
  const catX = BP.x - 10 * BS + out * (canX - 70 * cs - (BP.x - 10 * BS));
  const eyeX = BP.x + 2 * BS;
  const eyeY = BP.y - 11 * BS;
  const bl = blinkAt(t, [22]);
  const CatEl = (
        <g transform={`translate(${catX} ${BP.y + 2}) scale(${-cs} ${cs})`}>
          <Cat x={0} y={0} mood={out < 0.7 ? 'peek' : 'alert'} f={t} />
        </g>
        );
  return (
    <g transform={camT(kf(t, [[0, (BP.x + PIP_G.x) / 2 + 20], [len, (BP.x + PIP_G.x) / 2 + 30]]), BP.y - 50, kf(t, [[0, zoom[0]], [len, zoom[1]]]))}>
      <Street t={t + 60} id="d2st" grass={0.4} low={LOW} />
      <ellipse cx={BP.x - 6 * BS} cy={BP.y - 6 * BS} rx={70 * BS} ry={11 * BS} fill="#06040A" opacity={0.85} />
      {out > 0 && out < 0.45 ? CatEl : null}
      <Motorbike x={BP.x} y={BP.y} s={BS} facing={1} lean={-9} color="#B8483E" t={t} />
      {out >= 0.45 ? CatEl : null}
      {eyes > 0 && out === 0 ? (
        <g opacity={eyes}>
          {[-1, 1].map((d) => (
            <g key={d}>
              <circle cx={eyeX + d * 11 * BS} cy={eyeY} r={14 * BS * (1 - 0.9 * bl)} fill="#FFE27A" opacity={0.28} />
              <ellipse cx={eyeX + d * 11 * BS} cy={eyeY} rx={6.5 * BS} ry={6.5 * BS * (1 - 0.9 * bl)} fill="#FFE27A" />
              <circle cx={eyeX + d * 11 * BS + 1.5} cy={eyeY - 1.5} r={1.8 * BS} fill="#fff" />
            </g>
          ))}
        </g>
      ) : null}
      <CanFood x={hand.x - 4} y={hand.y + 22 * PIP_G.s * 2} s={PIP_G.s * 1.3} rot={8} />
      <Hero look={PIP} pose={pose} rimId="rimL" shadow={0} />
      <ellipse cx={PIP_G.x} cy={PIP_G.y + 4} rx={60 * PIP_G.s * 2.2} ry={10 * PIP_G.s * 2.2} fill="#000" opacity={0.35} />
      <Glow x={BP.x - 40} y={BP.y - 30} r={160} o={0.2} />
    </g>
  );
};

// ---------- D2: eyes glint in the dark under the scooter; Pip crouches in profile on the right with the open can ----------
export const D2: React.FC<ShotProps> = ({ t, len }) => <Scene t={t} len={len} eyes={clamp((t - 6) / 4)} out={0} zoom={[3.3, 3.6]} />;

// ---------- D2b: the cat creeps out from under the scooter toward the can ----------
export const D2b: React.FC<ShotProps> = ({ t, len }) => <Scene t={t + 36} len={len + 36} eyes={1} out={t < 6 ? 0 : easeOut(clamp((t - 6) / 34))} zoom={[3.6, 3.8]} />;
