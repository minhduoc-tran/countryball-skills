import React from 'react';
import { Hero, poseAt, faceAt, walkPose, camT, kf, clamp, easeOut, LOOKS, Street, streetStand, proj, propScale, Glow, ShotProps, Look } from '../../engine';
import { BreadCart, VENDOR } from './chc-props-food-and-trade';
import { PriceBoard, Mark } from './chc-props-money-and-prices';
import { BlurStreet } from './chc-street-scenes';

// Chapter C, the shopkeepers: one seller recognises Pip (C12), every seller along the street sees him coming from far
// away (C13), and the board is quietly swapped for a higher price (C14).

const PIP = LOOKS.pipHood;
const SELLERS: Look[] = [VENDOR, { ...VENDOR, jacket: '#B5583E', jacketShade: '#944530', limb: '#B5583E' }, { ...VENDOR, jacket: '#5E8CA8', jacketShade: '#4A7088', limb: '#5E8CA8' }, { ...VENDOR, jacket: '#8A6AA8', jacketShade: '#6E5288', limb: '#8A6AA8' }];

/** Pip walking toward the camera at street position (X, Z): the pose, with feet on the road. */
const pipWalk = (t: number, X: number, Z: number): { pose: ReturnType<typeof walkPose>; s: ReturnType<typeof streetStand> } => {
  const s = streetStand(X, Z);
  return { s, pose: walkPose(s.x, t * 0.5, s.y + 140 * s.scale, s.scale, { yaw: 0, tilt: 0 }, 1) };
};

// ---------- C12: a seller in the near foreground freezes: he has recognised the small figure walking down the street ----------
export const C12: React.FC<ShotProps> = ({ t, len }) => {
  const { pose: pw } = pipWalk(t, -0.4, kf(t, [[0, 15], [len, 11.5]], (v) => v));
  const sv = streetStand(3.3, 4.6);
  const vp = poseAt(t, [
    { f: 0, p: { x: sv.x, y: sv.y, scale: sv.scale, yaw: -0.55, facing: -1, look: -0.8, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } },
    { f: 10, p: { headTilt: -5, armR: { a: 40, b: -60 } }, ease: easeOut },
  ]);
  const cart = proj(4.9, 0, 4.6);
  return (
    <g transform={camT(kf(t, [[0, 1200], [len, 1130]]), 630, kf(t, [[0, 2.3], [len, 2.8]]))}>
      <Street t={t + 20} id="c12" market={1} />
      <Hero look={PIP} pose={{ ...pw, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <BreadCart x={cart.x} y={cart.y} s={propScale(4.6) * 0.34} loaves={1} t={t} />
      <Hero look={VENDOR} pose={{ ...vp, ...faceAt(t, [[0, 'neutral'], [10, 'shock'], [34, 'smug']]) }} rimId="rimL" shadow={0} />
      <Mark x={sv.x - 20} y={sv.y - 300 * sv.scale} t={t - 12} s={0.6} />
      <Glow x={960} y={470} r={600} o={0.3} />
    </g>
  );
};

// ---------- C13: the wide street: Pip far away, a target ring on him, every seller turning to look, "!" popping up ----------
const SPOTS: [number, number, number][] = [[-5.2, 6.4, 0.55], [5.3, 6.0, -0.55], [-5.5, 9.5, 0.55], [5.6, 9.2, -0.55]];
export const C13: React.FC<ShotProps> = ({ t, len }) => {
  const { pose: pw, s: ps } = pipWalk(t, 0.1, kf(t, [[0, 16], [len, 13]], (v) => v));
  const ring = 1 + 0.12 * Math.sin(t / 4);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.15], [len, 1.3]]))}>
      <Street t={t + 55} id="c13" market={1} />
      {SPOTS.map(([X, Z, yaw], i) => {
        const s = streetStand(X, Z);
        const turn = easeOut(clamp((t - 4 - i * 5) / 8));
        const p = poseAt(t, [{ f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: yaw * turn, facing: yaw > 0 ? 1 : -1, look: Math.sign(yaw) * turn, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } }]);
        return (
          <g key={i}>
            <Hero look={SELLERS[i]} pose={{ ...p, ...faceAt(t, [[0, 'neutral'], [6 + i * 5, 'shock']]) }} rimId={yaw > 0 ? 'rimR' : 'rimL'} shadow={0} />
            <Mark x={s.x} y={s.y - 290 * s.scale} t={t - 8 - i * 5} s={0.55} />
          </g>
        );
      })}
      <Hero look={PIP} pose={{ ...pw, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <circle cx={ps.x} cy={ps.y - 8} r={46 * ring} fill="none" stroke="#FF6A5A" strokeWidth={4} strokeDasharray="14 10" opacity={clamp((t - 4) / 6)} />
    </g>
  );
};

// ---------- C14: the seller swaps the price board when Pip is still far off ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => {
  const flip = kf(t, [[22, 0], [36, 1]], (v) => v);
  const vp = poseAt(t, [
    { f: 0, p: { x: 1320, y: 600, scale: 1.55, yaw: -0.5, facing: -1, look: -0.9, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 16, p: { armL: { a: 60, b: -40 }, headTilt: 4 }, ease: easeOut },
    { f: 24, p: { armL: { a: 84, b: -20 } } },
    { f: 40, p: { armL: { a: 20, b: -10 }, headTilt: -4 } },
  ]);
  const pp = walkPose(1000, t * 0.45, 700, 0.3, { yaw: 0 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 560, kf(t, [[0, 1], [len, 1.08]]))}>
      <BlurStreet t={t + 20} id="c14" blur={4} />
      <Hero look={PIP} pose={{ ...pp, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <PriceBoard x={700} y={540} s={1.05} from="35.000" to="50.000" p={flip} t={t} />
      <Hero look={VENDOR} pose={{ ...vp, ...faceAt(t, [[0, 'neutral'], [20, 'smug']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};
