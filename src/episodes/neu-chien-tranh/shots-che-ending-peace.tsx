import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, walkPose, joints, toWorld, kf, clamp, easeOut, camT, LOOKS, Look, LEG_LEN, Glow, Dust, Sparkle, Foreground,
  Rooftop, Stairwell, Banister, ShotProps,
} from '../../engine';
import { DawnAlley, DawnMotes, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { Shopper } from '../tien-vo-han/che-world-icons-and-people';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { GRANDMA, WORKER, VILLAGE_GIRL } from '../khong-ai-ngheo/cast-looks';
import { Backpack } from './che-props-cafe-coffee-and-backpack';
import { Field, Birds, RunningKid, VEST, KID_BOY } from './che-props-field-and-deminers';
import { SchoolDay, SchoolDrum, BreakfastTop, DuskBlock } from './che-props-school-breakfast-and-window';

// Chapter E, "ending" (266.8-280.3 s): "Peace is like air": E21 Pip breathes the open sky, E22 nobody notices it when it is
// there, E23 (memory) the stairwell with a bag when it is gone, then what it looks like: E24 a normal breakfast, E25 the school
// drum and children running in, E26 a green field with no bombs, E27 many hands together, E28 a lit window at dusk.

const PIP = LOOKS.pipHood;
const FEET = 842;
const { x: CX, y: CY, s: CS } = CART;

// ---------- E21: roof at golden hour: Pip, eyes closed, takes a long breath of open sky; soft air streaks drift past ----------
export const E21: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.3;
  const br = Math.sin(clamp(t / (len - 6)) * Math.PI);
  const pose: Pose = {
    ...basePose, x: 760, y: FEET - LEG_LEN * sc, scale: sc, yaw: 0.5, facing: 1, tilt: -5 * br, headTilt: -9 * br, blink: 0.95 * clamp(t / 10), squash: -0.03 * br,
    armL: { a: 14 + 30 * br, b: -6 }, armR: { a: 14 + 30 * br, b: -6 }, sway: 5,
  };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), kf(t, [[0, 540], [len, 480]]), kf(t, [[0, 1.45], [len, 1.3]]))}>
      <Rooftop t={t + 90} sunX={1250} sunY={650} cityLit={0.8} />
      <Birds t={t + 40} seed={21} x0={-200} y0={150} w={2400} h={220} n={5} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ph = ((t * (1.6 + i * 0.2) + i * 330) % 2600) - 300;
        const y = 300 + i * 70;
        return <path key={i} d={`M ${ph} ${y} q 90 -26 180 0 t 180 0 t 180 0`} stroke="#FFF3DF" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.35} />;
      })}
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Glow x={1250} y={650} r={640} o={0.4} />
      <Dust t={t} seed={211} x0={300} y0={200} w={1300} h={600} n={20} o={0.4} />
    </g>
  );
};

// ---------- E22: the alley on an ordinary morning: Pip walks past with his eyes on his phone; nobody looks up ----------
export const E22: React.FC<ShotProps> = ({ t, len }) => {
  const ph = t * 0.5;
  const x = CX + 260 * CS + t * 6;
  const pose = walkPose(x, ph, CY, CS, { yaw: 0.8, headTilt: 12, look: -0.8, armR: { a: 70, b: 80 }, armL: { a: 24 * Math.sin(ph), b: 14 } }, 1);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, CX + 380 * CS], [len, CX + 640 * CS]]), CY - 170 * CS, kf(t, [[0, 2.7], [len, 2.9]]))}>
      <DawnAlley t={t + 600} id="e22st" />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Shopper x={CX + 400} y={CY + 24} s={CS * 1.35} color="#8A5A6A" bob={Math.sin(t / 10)} flip />
      <Shopper x={CX - 120} y={CY + 30} s={CS * 1.35} color="#4A6A8A" bob={Math.sin(t / 9)} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <g transform={`translate(${hand.x} ${hand.y}) rotate(-20)`}>
        <rect x={-8 * CS * 2.4} y={-14 * CS * 2.4} width={16 * CS * 2.4} height={28 * CS * 2.4} rx={3} fill="#16151C" stroke="#7FB0E0" strokeWidth={1.5} />
        <Glow x={0} y={-10} r={50} kind="cool" o={0.35} />
      </g>
      <Birds t={t} seed={22} x0={CX} y0={CY - 760 * CS} w={1600} h={140} n={3} col="#4A2E3A" />
      <DawnMotes t={t} seed={22} />
    </g>
  );
};

// ---------- E23 (memory): the stairwell, when peace is gone: Pip holds his bag against his chest and waits ----------
export const E23: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.95;
  const pose = poseAt(t, [
    { f: 0, p: { x: 300, y: 420 - LEG_LEN * sc, scale: sc, yaw: 0.35, facing: 1, look: 0.4, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 2 } },
    { f: 50, p: { headTilt: 5, look: 0.8 } },
    { f: len, p: { headTilt: -3 } },
  ]);
  const breathe = Math.sin(t / 14) * 3;
  return (
    <g transform={camT(kf(t, [[0, 340], [len, 320]]), kf(t, [[0, 290], [len, 270]]), kf(t, [[0, 1.5], [len, 1.9]]))}>
      <Stairwell t={t + 400} id="e23sw" />
      <Backpack x={300 - 62 * sc} y={420 - 28 * sc + breathe * 0.4} s={0.62} rot={-5} col="#D9733A" shadow={0} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [60, 'tired']]) }} rimId="rimL" shadow={0.5} />
      <Foreground blur={10}>
        <path d="M 560 760 Q 580 560 700 520 Q 840 500 880 600 Q 940 640 980 760 Z" fill="#14121C" />
      </Foreground>
      <Banister />
    </g>
  );
};

// ---------- E24: a normal breakfast from above: xôi in a leaf, porridge steaming, iced coffee; Pip's hand reaches in ----------
export const E24: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp((t - 6) / 16));
  const k = kf(t, [[0, 1.0], [len, 1.1]]);
  return (
    <g transform={`translate(960 540) scale(${k}) translate(-960 -540)`}>
      <BreakfastTop t={t} />
      <InsertArm x={560 - 700 * (1 - reach)} y={460 + 700 * (1 - reach)} fx={-300} fy={1300} rot={-143} s={3.4} width={84} />
      <Sparkle x={560} y={380} t={t - 18} s={1.1} />
      <Sparkle x={1130} y={300} t={t - 26} s={0.9} />
      <Foreground blur={10}><ellipse cx={120} cy={1090} rx={380} ry={110} fill="#3A2418" opacity={0.8} /></Foreground>
    </g>
  );
};

const hitAt = (t: number) => Math.max(...[3, 15, 27].map((h) => (t >= h ? Math.max(0, 1 - (t - h) / 7) : 0)));

// ---------- E25: the school yard: the drum is struck and children run in through the gate ----------
export const E25: React.FC<ShotProps> = ({ t, len }) => {
  const kid = (look: typeof PIP, delay: number, s: number, gy: number) => {
    const x = 1750 - Math.max(0, t - delay) * 17;
    const pose = walkPose(x, t * 0.95, gy, s, { armL: { a: 55 * Math.sin(t * 0.95), b: 40 }, armR: { a: -55 * Math.sin(t * 0.95), b: 40 }, tilt: -10 }, -1);
    return <Hero look={look} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />;
  };
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 1060]]), 600, kf(t, [[0, 0.95], [len, 1.05]]))}>
      <defs><linearGradient id="e25sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8EC4E4" /><stop offset="0.8" stopColor="#FFE7C0" /></linearGradient></defs>
      <rect x={-500} y={-400} width={3600} height={1300} fill="url(#e25sky)" />
      <Glow x={300} y={120} r={600} o={0.35} />
      <rect x={-500} y={880} width={3600} height={500} fill="#C9A878" />
      <SchoolDay x={1150} y={880} s={0.95} t={t} />
      <SchoolDrum x={720} y={1010} s={1.25} hit={hitAt(t)} />
      {kid(VILLAGE_GIRL, 0, 0.8, 1000)}
      {kid(KID_BOY, 8, 0.7, 950)}
      {kid(LOOKS.sis, 15, 0.66, 1035)}
      <Birds t={t} seed={25} x0={300} y0={80} w={1800} h={140} n={3} col="#4A2E3A" />
    </g>
  );
};

// ---------- E26: a green field with nothing hidden in it: golden light, a child flying a kite ----------
export const E26: React.FC<ShotProps> = ({ t, len }) => {
  const seed = 1;
  const x = 300 + ((t * 5 + seed * 160) % 900);
  const kx = x + 520 + Math.sin(t / 17) * 40;
  const ky = 250 + Math.sin(t / 13) * 24;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 900]]), 700, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Field t={t + 150} id="e26f" front={3000} dawn={1} sunX={1500} />
      <Birds t={t + 60} seed={26} x0={-100} y0={140} w={2200} h={160} n={4} />
      <path d={`M ${x + 20} ${900 - 215 * 0.75} Q ${(x + kx) / 2} ${(900 + ky) / 2 - 40} ${kx} ${ky + 40}`} stroke="#F6EFE3" strokeWidth={2.5} fill="none" opacity={0.8} />
      <g transform={`translate(${kx} ${ky}) rotate(${Math.sin(t / 15) * 10})`}>
        <path d="M 0 -48 L 34 0 L 0 62 L -34 0 Z" fill="#E9654B" stroke="#7A2A28" strokeWidth={4} /><path d="M 0 -48 V 62 M -34 0 H 34" stroke="#7A2A28" strokeWidth={3} />
        <path d={`M 0 62 q 14 20 0 40 t 0 40 t 0 40`} stroke="#F2B33D" strokeWidth={5} fill="none" />
      </g>
      <RunningKid t={t} look={KID_BOY} xa={300} xb={1200} gy={900} s={0.75} seed={seed} />
      <RunningKid t={t} look={LOOKS.sis} xa={200} xb={1300} gy={960} s={0.6} seed={3} />
      <Dust t={t} seed={261} x0={200} y0={400} w={1500} h={500} n={22} o={0.45} />
    </g>
  );
};

/** One person's arm reaching in from `ang` degrees: a sleeve in their jacket colour and a big mitten at radius r from (960, 540). */
const HandArm: React.FC<{ look: Look; ang: number; r: number; wob: number }> = ({ look, ang, r, wob }) => {
  const th = (ang * Math.PI) / 180;
  const x = 960 + Math.cos(th) * r;
  const y = 540 + Math.sin(th) * r + wob;
  const fx = 960 + Math.cos(th) * 1700;
  const fy = 540 + Math.sin(th) * 1700;
  const d = `M ${x} ${y} L ${fx} ${fy}`;
  return (
    <g filter="url(#rimR)">
      <path d={d} stroke={look.line} strokeWidth={96} strokeLinecap="round" />
      <path d={d} stroke={look.jacket} strokeWidth={80} strokeLinecap="round" />
      <path d={`M ${x + Math.cos(th) * 150} ${y + Math.sin(th) * 150} L ${x + Math.cos(th) * 172} ${y + Math.sin(th) * 172}`} stroke={look.accent} strokeWidth={86} />
      <g transform={`translate(${x} ${y}) rotate(${ang + 90}) scale(7.5)`}>
        <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={look.hand} stroke={look.line} strokeWidth={2.6} strokeLinejoin="round" />
        <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={look.hand} stroke={look.line} strokeWidth={2.4} />
      </g>
    </g>
  );
};

// ---------- E27: many hands together: seven arms from every side meet in the middle of a warm glow ----------
export const E27: React.FC<ShotProps> = ({ t, len }) => {
  const arms = [
    { look: PIP, a: -90 }, { look: LOOKS.mo, a: -38 }, { look: LOOKS.mom, a: 15 }, { look: GRANDMA, a: 65 },
    { look: VEST, a: 115 }, { look: WORKER, a: 165 }, { look: LOOKS.sis, a: 215 },
  ];
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <defs><radialGradient id="e27bg" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stopColor="#F2A55A" /><stop offset="1" stopColor="#3A2650" /></radialGradient></defs>
      <rect x={-100} y={-100} width={2120} height={1280} fill="url(#e27bg)" />
      <Glow x={960} y={540} r={620} o={0.6} />
      {arms.map((m, i) => (
        <HandArm key={i} look={m.look} ang={m.a} r={96 + (1 - easeOut(clamp((t - i * 4) / 10))) * 600} wob={Math.sin(t / 20 + i) * 3} />
      ))}
      <Sparkle x={960} y={430} t={t - 30} s={1.6} />
      <Sparkle x={860} y={600} t={t - 36} s={1.1} />
      <Sparkle x={1080} y={600} t={t - 40} s={1.1} />
    </g>
  );
};

// ---------- E28: a lit window at dusk: a family around a table; the camera eases out over the whole block ----------
export const E28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 930], [len, 960]]), kf(t, [[0, 530], [len, 520]]), kf(t, [[0, 3.0], [len, 1.5]]))}>
    <DuskBlock t={t} wx={930} wy={530} />
    <Dust t={t} seed={281} x0={700} y0={300} w={500} h={400} n={14} o={0.5} />
  </g>
);
