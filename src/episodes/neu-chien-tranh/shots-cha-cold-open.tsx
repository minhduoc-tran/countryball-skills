import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, Glow, Dust, FONT, Sparkle, UI, LEG_LEN,
  Street, streetStand, joints, toWorld, ShotProps,
} from '../../engine';
import { DawnAlley, DawnMotes, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { Shopper } from '../tien-vo-han/che-world-icons-and-people';
import { PIP, MO, SIS, MOM, CafeBack, CafeTable, IcedCoffee, DayCalendar, CafeGuest, LookArm, Stool } from './cha-cafe-and-alley-props';

// Chapter A, the cold open A1-A7 (0.00-12.25 s): an ordinary sunny Sunday. Pip and Mo with iced milk coffee, sis doing
// homework, mum at her xôi cart, a calendar of identical days, then every phone in the cafe buzzes at once (A7, "alert").

const { x: CX, y: CY, s: CS } = CART;

/** Seated hip pose on a plastic stool: legs forward, hips 68 units above the ground. */
const seated = (x: number, ground: number, s: number, facing: 1 | -1, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: ground - 68 * s - 6, scale: s, facing, yaw: facing * 0.7, tilt: 0,
  legL: { a: 84, b: -84 }, legR: { a: 74, b: -80 }, armL: { a: 14, b: 8 }, armR: { a: 14, b: 8 }, ...extra,
});

// ---------- A1: wide, a sunny Sunday street: Pip and Mo on stools at a cafe table, sipping; "CHỦ NHẬT" ----------
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const P = streetStand(-5.1, 5.4, { sidewalk: true });
  const M = streetStand(-6.5, 5.4, { sidewalk: true });
  const ground = P.y + LEG_LEN * P.scale;
  const sip = Math.max(0, Math.sin((t - 14) / 7));
  const pip = seated(P.x, ground, P.scale, -1, { armR: { a: 14, b: 8 }, headTilt: 2 - 3 * sip });
  const mo = seated(M.x, ground, M.scale, 1, { headTilt: Math.sin(t / 9) * 2 });
  const tx = (P.x + M.x) / 2;
  const pop = backOut(clamp((t - 3) / 8));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 640], [len, 560]]), kf(t, [[0, 640], [len, 660]]), kf(t, [[0, 2.0], [len, 2.5]]))}>
        <Street t={t + 60} id="a1st" market={0.6} veil={0.26} />
        <rect x={-400} y={-300} width={2720} height={1700} fill="#FFC890" opacity={0.16} style={{ mixBlendMode: 'screen' }} />
        <Glow x={960} y={470} r={620} o={0.3} />
        <Stool x={M.x} y={ground} s={M.scale} color="#3A7AC8" />
        <Stool x={P.x} y={ground} s={P.scale} color="#C84A3E" />
        <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
        <g transform={`translate(${tx} ${ground}) scale(${P.scale * 0.42})`}>
          <CafeTable x={0} y={-250} w={520} id="a1tb" />
        </g>
        <DawnMotes t={t} seed={3} />
      </g>
      <g transform={`translate(960 130) scale(${pop})`}>
        <rect x={-190} y={-52} width={380} height={96} rx={48} fill={UI.pill} opacity={0.72} />
        <text y={20} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={54} fill={UI.text} letterSpacing={4}>CHỦ NHẬT</text>
      </g>
    </g>
  );
};

// ---------- A2: macro: two glasses of iced milk coffee clink; condensation drops slide ----------
export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 6) / 10));
  const back = clamp((t - 18) / 8);
  const mx = 1220 - 130 * k + 14 * back;
  const px = 700 + 130 * k - 14 * back;
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <CafeBack t={t + 90} id="a2st" blur={16} />
      <rect x={-200} y={-200} width={2320} height={1500} fill="#1A0E08" opacity={0.18} />
      <CafeTable x={960} y={800} w={1500} id="a2tb" />
      <IcedCoffee x={px} y={812} s={2.6} t={t} tilt={4 * k - 3 * back} />
      <IcedCoffee x={mx} y={812} s={2.6} t={t + 7} tilt={-4 * k + 3 * back} />
      <LookArm look={MO} x={mx + 140} y={640} fx={mx + 640} fy={1120} rot={20} s={4.4} width={104} />
      <LookArm look={PIP} x={px - 140} y={640} fx={px - 640} fy={1120} rot={-20} s={4.4} width={104} rim="rimL" />
      <Sparkle x={960} y={520} t={t - 16} s={1.6} />
      <Sparkle x={930} y={600} t={t - 20} s={1.0} />
      <Glow x={960} y={500} r={520} o={0.25} />
    </g>
  );
};

// ---------- A3: medium: sis at the cafe table doing homework, the pencil moving ----------
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const wr = Math.sin(t / 3.2);
  const pose = seated(930, 860, 1.12, 1, {
    yaw: 0.35, headTilt: 7, look: 0.4, armR: { a: 62 + 5 * wr, b: 50 + 6 * Math.cos(t / 3.2) }, armL: { a: 28, b: 40 },
  });
  const hand = toWorld(pose, joints(pose).armR.end);
  const lines = clamp(t / (len - 6));
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 900]]), 640, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <CafeBack t={t + 120} id="a3st" blur={10} />
      <Hero look={SIS} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <CafeTable x={930} y={770} w={760} h={190} id="a3tb" />
      {/* notebook with writing growing, a pencil at her hand, her schoolbag against the table */}
      <g transform="translate(1010 764) skewX(-30)">
        <rect x={-120} y={-30} width={240} height={50} fill="#FFF8E8" stroke="#C9A46A" strokeWidth={3} />
        {[0, 1, 2].map((i) => <rect key={i} x={-104} y={-22 + i * 13} width={Math.max(0, 200 * clamp(lines * 3 - i))} height={4} rx={2} fill="#3A4A8A" />)}
      </g>
      <path d={`M ${hand.x} ${hand.y} l 16 22`} stroke="#E9A83A" strokeWidth={7} strokeLinecap="round" />
      <g transform="translate(560 800)">
        <rect x={-50} y={-90} width={100} height={110} rx={22} fill="#E2766A" stroke="#8A3A32" strokeWidth={4} />
        <rect x={-34} y={-70} width={68} height={40} rx={12} fill="#C85A4E" />
        <path d="M -30 -92 Q 0 -128 30 -92" stroke="#8A3A32" strokeWidth={6} fill="none" />
      </g>
      <Dust t={t} seed={7} x0={600} y0={300} w={800} h={500} n={16} o={0.5} />
    </g>
  );
};

// ---------- A4: the alley mouth: mum at her xôi cart, steam rising, a customer waiting ----------
export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const scoop = Math.sin(t / 6);
  const mum: Pose = { ...basePose, x: CX + 45 * CS, y: CY - 140 * CS, scale: CS, yaw: 0.45, facing: 1, headTilt: 3, armL: { a: 12, b: -6 }, armR: { a: 40 + 14 * scoop, b: 30 } };
  return (
    <g transform={camT(kf(t, [[0, CX + 190 * CS], [len, CX + 150 * CS]]), CY - 250 * CS, kf(t, [[0, 2.6], [len, 3.0]]))}>
      <DawnAlley t={t + 20} id="a4st" />
      <Hero look={MOM} pose={{ ...mum, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Shopper x={CX + 420 * CS} y={CY + 10} s={CS * 1.05} color="#4A6A8A" bob={Math.max(0, Math.sin(t / 7)) * 2} />
      <DawnMotes t={t} seed={9} />
    </g>
  );
};

// ---------- A5: a calendar of identical sunny Sundays, ticked off in a time-lapse ----------
export const A5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 0.95], [len, 1.1]]))}>
    <rect x={-300} y={-300} width={2520} height={1700} fill="#F6D9A4" />
    <circle cx={960} cy={540} r={900} fill="#FFE9BE" opacity={0.7} />
    <DayCalendar x={960} y={540} t={t} t0={4} every={1.6} />
    <Glow x={960} y={540} r={800} o={0.18} />
  </g>
);

// ---------- A6 / A7: the cafe from the sidewalk; a row of tables, phones lying dark ... then every one lights up ----------
const TABLES = [
  { x: 380, guest: 1, seed: 11, phone: 0 },
  { x: 960, guest: 0, seed: 0, phone: 0 },
  { x: 1560, guest: 1, seed: 23, phone: 0 },
];
const CafeRow: React.FC<{ t: number; len: number; buzzT: number; id: string }> = ({ t, len, buzzT, id }) => {
  const lit = (i: number) => clamp((t - buzzT - i * 1.5) / 3);
  const turn = (i: number) => easeOut(clamp((t - buzzT - 5 - i * 2) / 6));
  const sip = Math.max(0, Math.sin((t - 6) / 8));
  const pip = seated(900, 880, 1.15, 1, { yaw: 0.3, armL: { a: 14, b: 8 }, armR: { a: 14, b: 8 }, headTilt: 2 - 2 * sip + 6 * turn(1) });
  const mo = seated(1100, 880, 1.15, -1, { yaw: -0.3, headTilt: -turn(1) * 7 });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), 600, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <CafeBack t={t + 150} id={id} blur={10} />
      {/* guests behind their tables */}
      <CafeGuest x={300} y={790} s={1.15} seed={11} glow={lit(0)} turn={turn(0)} />
      <CafeGuest x={470} y={800} s={1.1} seed={13} glow={lit(0.5)} turn={turn(0.5)} />
      <CafeGuest x={1560} y={790} s={1.15} seed={23} glow={lit(2)} turn={turn(2)} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [buzzT + 8, 'shock']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy'], [buzzT + 9, 'worried']]) }} rimId="rimL" shadow={0} />
      {TABLES.map((tb, i) => (
        <g key={i}>
          <CafeTable x={tb.x} y={800} w={i === 1 ? 600 : 420} h={170} id={`${id}tb${i}`} />
          {/* a phone lying on the table, its screen lighting and buzzing when the alert comes */}
          <g transform={`translate(${tb.x + (i === 1 ? 40 : 0) + Math.sin(t * 9) * 4 * lit(i)} ${796}) skewX(-40)`}>
            <rect x={-22} y={-8} width={44} height={22} rx={5} fill={lit(i) > 0 ? '#CFE6FF' : '#16151C'} stroke="#3A3846" strokeWidth={3} />
          </g>
          {lit(i) > 0 ? <Glow x={tb.x} y={770} r={180} kind="cool" o={0.7 * lit(i)} /> : null}
        </g>
      ))}
      <IcedCoffee x={820} y={800} s={0.7} t={t} />
      <IcedCoffee x={1210} y={800} s={0.7} t={t + 5} />
    </g>
  );
};
export const A6: React.FC<ShotProps> = ({ t, len }) => <CafeRow t={t} len={len} buzzT={999} id="a6st" />;
export const A7: React.FC<ShotProps> = ({ t, len }) => <CafeRow t={t + 40} len={len + 40} buzzT={44} id="a7st" />;
