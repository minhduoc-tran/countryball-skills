import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, camT, Glow, Dust, Street, streetStand, proj, walkPose, joints, toWorld, rnd, LEG_LEN, ShotProps,
} from '../../engine';
import { DawnAlley, DawnMotes, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { PIP, MO, SIS, MOM, RunnerSil, HugArm } from './cha-cafe-and-alley-props';

// Chapter A, hour one, home (A19-A22, 36.64-47.25 s): Mo pulls Pip running against the crowd; mum packs the cart with
// shaking hands; sis clutches her schoolbag; the family hugs in the middle of the alley, wordless, a slow push-in.

const { x: CX, y: CY, s: CS } = CART;

// ---------- A19: wide: Pip and Mo run up the street toward us while the crowd runs the other way, away down the street ----------
export const A19: React.FC<ShotProps> = ({ t, len }) => {
  const heroZ = kf(t, [[0, 15], [len, 5.6]], (v) => v);
  const ph = t * 0.62;
  const mo = streetStand(-0.7, heroZ);
  const pip = streetStand(-1.9, heroZ + 0.5);
  const moPose: Pose = walkPose(mo.x, ph, mo.y + LEG_LEN * mo.scale, mo.scale, { yaw: 0.5, tilt: 0, armR: { a: -40, b: -30 }, expr: 'worried' }, 1);
  const pipPose: Pose = walkPose(pip.x, ph + 0.8, pip.y + LEG_LEN * pip.scale, pip.scale, { yaw: 0.5, armL: { a: -30, b: -20 }, armR: { a: 20, b: 10 }, expr: 'worried' }, 1);
  const hand = toWorld(moPose, joints(moPose).armR.end);
  const crowd = Array.from({ length: 22 }).map((_, i) => {
    const Z = 4.2 + ((rnd(8, i) * 26 + 0.16 * t) % 26);
    const X = (rnd(9, i) - 0.5) * 7.4;
    const g = proj(X, 0, Z);
    return { Z, x: g.x, y: g.y, s: 3.6 / Z, i };
  });
  const behind = crowd.filter((c) => c.Z > heroZ).sort((a, b) => b.Z - a.Z);
  const front = crowd.filter((c) => c.Z <= heroZ).sort((a, b) => b.Z - a.Z);
  const cols = ['#2B2540', '#4A3A5A', '#3A4A5E', '#5E3A3A'];
  const draw = (c: typeof crowd[number]) => <RunnerSil key={c.i} x={c.x} y={c.y} s={c.s} phase={t * 0.6 + c.i * 1.3} color={cols[c.i % 4]} bag={c.i % 3 === 0} />;
  return (
    <g transform={camT(mo.x - 40, mo.y - 60, kf(t, [[0, 3.2], [len, 1.8]]))}>
      <Street t={t + 90} id="a19st" market={0.5} veil={0.3} />
      {behind.map(draw)}
      <Hero look={MO} pose={moPose} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={pipPose} rimId="rimR" shadow={0} />
      <path d={`M ${hand.x} ${hand.y} L ${hand.x - 40 * mo.scale * 4} ${hand.y + 6}`} stroke={MO.limb} strokeWidth={12 * mo.scale * 3} strokeLinecap="round" />
      {front.map(draw)}
    </g>
  );
};

// ---------- A20: the alley mouth: Pip and Mo run in; mum packs the cart with shaking hands; slow push-in to her hands ----------
export const A20: React.FC<ShotProps> = ({ t, len }) => {
  const run = clamp(t / 60);
  const Zk = kf(t, [[0, 16], [60, 6.6]], (v) => v);
  const Xk = kf(t, [[0, -1.2], [60, -3.4]], (v) => v);
  const mo = streetStand(Xk, Zk, { sidewalk: run > 0.9 });
  const pip = streetStand(Xk - 0.7, Zk + 0.4);
  const ph = t * 0.6;
  const stop = clamp((t - 56) / 6);
  const moP: Pose = walkPose(mo.x, ph * (1 - stop), mo.y + LEG_LEN * mo.scale, mo.scale, { yaw: -0.5, expr: 'worried' }, -1);
  const pipP: Pose = walkPose(pip.x, ph * (1 - stop) + 0.8, pip.y + LEG_LEN * pip.scale, pip.scale, { yaw: -0.5, expr: 'worried' }, -1);
  const tremble = clamp((t - 56) / 8);
  const shake = Math.sin(t * 2.3) * 9 * tremble;
  const mum: Pose = {
    ...basePose, x: CX + 45 * CS, y: CY - 140 * CS + 3 * Math.abs(Math.sin(t / 5)), scale: CS, yaw: 0.45, facing: 1, tilt: 6, headTilt: 5,
    armL: { a: 38 + shake, b: 40 }, armR: { a: 44 - shake, b: 34 + 18 * Math.sin(t / 4) }, expr: 'worried',
  };
  return (
    <g transform={camT(kf(t, [[0, CX + 330 * CS], [60, CX + 300 * CS], [len, CX + 70 * CS]]), kf(t, [[0, CY - 250 * CS], [len, CY - 210 * CS]]), kf(t, [[0, 1.9], [60, 2.4], [len, 4.4]]))}>
      <DawnAlley t={t + 70} id="a20st" />
      <Hero look={MOM} pose={mum} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} lantern />
      {/* boxes and a sack the cart is being packed into, a lid half closed */}
      <rect x={CX + 190 * CS} y={CY - 110 * CS} width={110 * CS} height={110 * CS} rx={6} fill="#B98557" stroke="#4A2E20" strokeWidth={3} />
      <rect x={CX + 205 * CS} y={CY - 190 * CS} width={90 * CS} height={80 * CS} rx={6} fill="#C99A67" stroke="#4A2E20" strokeWidth={3} />
      <Hero look={MO} pose={moP} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={pipP} rimId="rimR" shadow={0} />
      <DawnMotes t={t} seed={14} />
    </g>
  );
};

// ---------- A21: close-up: sis, clutching her schoolbag to her chest, eyes wide ----------
export const A21: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 2.1], [len, 2.3]]);
  const pose: Pose = {
    ...basePose, x: 960, y: 330 + 176 * sc, scale: sc, yaw: 0.15, look: kf(t, [[0, -0.5], [24, 0.4]]),
    armL: { a: 24, b: -104 }, armR: { a: 24, b: -104 }, headTilt: kf(t, [[0, 3], [len, -3]]), ...faceAt(t, [[0, 'worried'], [26, 'shock']]),
  };
  return (
    <g>
      <g filter="url(#blur16)"><DawnAlley t={t + 120} id="a21st" /></g>
      <rect x={0} y={0} width={1920} height={1080} fill="#10081A" opacity={0.18} />
      <Hero look={SIS} pose={pose} rimId="rimR" shadow={0} />
      {/* the schoolbag, hugged to her chest, trembling a little */}
      <g transform={`translate(${960 + Math.sin(t * 1.9) * 3} ${330 + 176 * sc - 60 * sc + Math.cos(t * 2.3) * 2}) scale(${sc / 2.6})`}>
        <rect x={-160} y={-150} width={320} height={310} rx={56} fill="#E2766A" stroke="#8A3A32" strokeWidth={8} />
        <rect x={-110} y={-70} width={220} height={120} rx={34} fill="#C85A4E" stroke="#8A3A32" strokeWidth={6} />
        <rect x={-12} y={-10} width={24} height={34} rx={6} fill="#F2C14E" />
        <path d="M -90 -150 Q 0 -230 90 -150" stroke="#8A3A32" strokeWidth={12} fill="none" strokeLinecap="round" />
        <ellipse cx={-170} cy={-10} rx={40} ry={32} fill={SIS.hand} stroke={SIS.line} strokeWidth={6} />
        <ellipse cx={170} cy={-10} rx={40} ry={32} fill={SIS.hand} stroke={SIS.line} strokeWidth={6} />
      </g>
      <Glow x={960} y={400} r={600} o={0.22} />
    </g>
  );
};

// ---------- A22: the family hugs in the middle of the alley, wordless; a slow push-in ----------
export const A22: React.FC<ShotProps> = ({ t, len }) => {
  const arms = easeOut(clamp((t - 4) / 18));
  const sway = Math.sin(t / 14) * 2.5;
  const S = 1.55;
  const hang = { armL: { a: 12, b: 6 }, armR: { a: 12, b: 6 } };
  const pip: Pose = { ...basePose, ...hang, x: 850, y: 640 - sway, scale: S, yaw: 0.2, look: 0.5, headTilt: -4 - 8 * arms };
  const mum: Pose = { ...basePose, ...hang, x: 1060, y: 640 + sway, scale: S * 1.05, yaw: -0.2, look: -0.5, headTilt: 4 + 10 * arms };
  const sis: Pose = { ...basePose, ...hang, x: 955, y: 780 + sway * 0.5, scale: S * 0.72, yaw: 0, headTilt: 3 };
  return (
    <g transform={camT(955, kf(t, [[0, 580], [len, 520]]), kf(t, [[0, 1.0], [len, 1.45]]))}>
      <DawnAlley t={t + 150} id="a22st" blur={6} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [30, 'neutral']]), blink: t % 70 > 66 || t > 36 ? 1 : 0 }} rimId="rimL" shadow={0} />
      <Hero look={MOM} pose={{ ...mum, ...faceAt(t, [[0, 'worried'], [30, 'neutral']]), blink: t > 36 ? 1 : 0 }} rimId="rimR" shadow={0} />
      {/* Pip's arm over sis's head onto mum's shoulder; mum's arm round Pip's */}
      <HugArm look={PIP} a={[895, 476]} c={[965, 498]} b={[1090, 486]} s={1.5} p={arms} />
      <HugArm look={MOM} a={[1030, 500]} c={[950, 522]} b={[830, 504]} s={1.5} p={arms * 0.9} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'worried'], [30, 'neutral']]), blink: t > 40 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <HugArm look={PIP} a={[905, 520]} c={[915, 640]} b={[985, 700]} s={1.2} p={arms} />
      <HugArm look={MOM} a={[1015, 530]} c={[1010, 650]} b={[935, 705]} s={1.2} p={arms} />
      <Glow x={960} y={430} r={560} o={0.28} />
      <Dust t={t} seed={19} x0={500} y0={200} w={900} h={600} n={22} o={0.5} />
    </g>
  );
};
