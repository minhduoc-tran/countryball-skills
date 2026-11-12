import React from 'react';
import {
  Hero, Street, ShotProps, LOOKS, basePose, Pose, faceAt, poseAt, kf, clamp, easeOut, backOut, camT, Glow, Dust, Foreground, LEG_LEN,
} from '../../engine';
import { armTo, handAt, ped, floorOf } from '../neu-chien-tranh/chc-pose-utils';
import { Walker } from './chc-street-people';
import {
  TollAlley, RopeBarrier, CashBox, alley, GANG_A, GANG_B, GANG_C, BIG_MAN, SELLER, PAYER, WATCHMAN,
} from './chc-alley-and-toll-props';
import { GoodsStack, StallFront } from './chc-jungle-incident-props';

// Chapter C, "week one: jungle" (look w1), part 1: C1 the street where the strongest start taking; C2 a big man walks off with a
// seller's stack; C3 the toll gang strings a rope across the alley mouth; C4 a reluctant passer-by pays into the cash box.

const FLOOR_STALL = 910;

// ---------- C1: wide street, people hurry past with their eyes down; a big man strides along with a stack of goods ----------
export const C1: React.FC<ShotProps> = ({ t }) => {
  const len = 73; // first shot of the chapter: its true length (a one-chapter preview stretches it)
  const ph = t * 0.42;
  const bx = kf(t, [[0, 4.6], [len, 2.4]], (v) => v);
  const g = ped(bx, 3.5);
  const sc = g.scale * 1.12;
  const fy = floorOf(g);
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 1000]]), 620, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <Street t={t + 30} id="jc1" market={0.7} />
      <Walker look={PAYER} X={-5.6} Z={13} phase={ph * 1.3} facing={1} extra={{ expr: 'worried', look: 0.7 }} rim="rimR" />
      <Walker look={WATCHMAN} X={5.5} Z={10} phase={ph * 1.2 + 1} facing={-1} extra={{ expr: 'worried', look: -0.6, headTilt: -6 }} rim="rimL" />
      <Walker look={SELLER} X={-5.0} Z={7.6} phase={ph * 1.1} facing={-1} extra={{ expr: 'worried' }} rim="rimR" />
      <Walker
        look={BIG_MAN} X={bx} Z={3.5} phase={ph} facing={-1} scale={1.12} rim="rimL"
        extra={{ expr: 'smug', look: -0.2, armL: { a: 64, b: -26 }, armR: { a: 64, b: -26 }, tilt: -2 }}
      />
      <GoodsStack x={g.x - 64 * sc} y={fy - 78 * sc} s={0.82 * sc} />
      <Dust t={t} seed={4} x0={500} y0={300} w={1000} h={500} n={26} o={0.45} />
    </g>
  );
};

// ---------- C2: medium at the stall: the big man lifts the stack off the counter and walks away; the seller steps back, palms up ----------
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const stallX = 1000;
  const counterY = 700;
  const lift = easeOut(clamp((t - 2) / 12));
  const leave = clamp((t - 16) / (len - 16));
  const bs = 1.5;
  const bx = 1370 + leave * leave * 760;
  const bpose: Pose = {
    ...basePose, x: bx, y: FLOOR_STALL - LEG_LEN * bs - Math.abs(Math.sin(leave * 16)) * 6 * (leave > 0 ? 1 : 0), scale: bs, yaw: leave > 0 ? 0.9 : -0.8, facing: leave > 0 ? 1 : -1,
    legL: { a: leave > 0 ? 26 * Math.sin(leave * 16) : 4, b: 0 }, legR: { a: leave > 0 ? -26 * Math.sin(leave * 16) : -4, b: 0 }, expr: 'smug', look: leave > 0 ? 0.4 : -0.6,
  };
  const carry = leave > 0;
  const armL = carry ? { a: 70, b: -14 } : armTo({ ...bpose }, 'armL', stallX + 10, counterY - 80 - lift * 50);
  const pose: Pose = { ...bpose, armL, armR: carry ? { a: 70, b: -14 } : { a: 20, b: 14 } };
  const hand = handAt(pose, 'armL', pose.armL);
  const stackX = carry ? bx + 70 : stallX - 10 + (hand.x - (stallX - 10)) * lift;
  const stackY = carry ? FLOOR_STALL - 130 * bs + 10 : counterY - 8 + (hand.y + 90 - (counterY - 8)) * lift;
  const back = easeOut(clamp((t - 6) / 14));
  const sellerPose: Pose = {
    ...basePose, x: 600 - back * 70, y: FLOOR_STALL - LEG_LEN * 1.2 - 4 * Math.sin(back * 3), scale: 1.2, yaw: 0.45, facing: 1,
    armL: { a: 10 + back * 50, b: 6 }, armR: { a: 16 + back * 62, b: 10 }, handL: 'open', handR: 'open', expr: 'shock', look: 0.8,
    legL: { a: -6 * back, b: 0 }, legR: { a: 8 * back, b: 0 },
  };
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 640, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g filter="url(#blur6)"><Street t={t} id="jc2" market={0.5} /></g>
      <rect x={-300} y={FLOOR_STALL - 6} width={2520} height={400} fill="#4A3C44" />
      <ellipse cx={600 - back * 70} cy={FLOOR_STALL + 4} rx={70} ry={11} fill="#000" opacity={0.35} />
      <ellipse cx={bx} cy={FLOOR_STALL + 4} rx={90} ry={13} fill="#000" opacity={0.35} />
      <StallFront x={stallX} y={counterY} s={1.4} stack={carry || lift > 0.05 ? 0 : 1} />
      <Hero look={SELLER} pose={sellerPose} rimId="rimR" shadow={0} />
      <Hero look={BIG_MAN} pose={pose} rimId="rimL" shadow={0} />
      <GoodsStack x={stackX} y={stackY} s={1.0} />
      <Glow x={1000} y={400} r={500} o={0.25} />
    </g>
  );
};

// ---------- C3: the alley mouth: the gang strings a rope between two posts, hangs the sign, sets down the cash box ----------
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const z = 2.3;
  const fy = alley.yb(z);
  const sc = alley.s(z) * 1.05;
  const x0 = alley.xl(z) + 40;
  const x1 = alley.xr(z) - 40;
  const build = easeOut(clamp((t - 4) / 30));
  const xe = x0 + (x1 - x0) * build;
  const topY = fy - 170 * 0.85;
  const box = backOut(clamp((t - 38) / 8));
  const mk = (x: number, f: number, extra: Partial<Pose>): Pose => ({ ...basePose, x, y: f - LEG_LEN * sc, scale: sc, ...extra });
  const bPose0 = mk(x0 - 46, fy + 6, { yaw: 0.55, facing: 1, expr: 'smug', look: 0.5 });
  const bPose = { ...bPose0, armR: armTo(bPose0, 'armR', x0 + 6, topY + 8) };
  const cPose0 = mk(xe - 64, fy + 10, { yaw: 0.6, facing: 1, expr: 'smug', look: 0.5, legL: { a: 18 * Math.sin(t / 3) * (build < 1 ? 1 : 0), b: 0 }, legR: { a: -18 * Math.sin(t / 3) * (build < 1 ? 1 : 0), b: 0 } });
  const cPose = { ...cPose0, armR: armTo(cPose0, 'armR', xe, topY + 8) };
  const aPose = poseAt(t, [
    { f: 0, p: mk(830, alley.yb(2.9), { scale: alley.s(2.9) * 1.05, y: alley.yb(2.9) - LEG_LEN * alley.s(2.9) * 1.05, yaw: 0, armL: { a: 38, b: -110 }, armR: { a: 38, b: -110 }, expr: 'smug' }) },
    { f: 40, p: { armR: { a: 100, b: -4 }, handR: 'point' } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 960]]), 600, kf(t, [[0, 1.15], [len, 1.4]]))}>
      <TollAlley t={t} id="jc3" />
      <Hero look={GANG_A} pose={{ ...aPose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      <RopeBarrier x0={x0} x1={x1} y={fy} s={0.85} t={t} build={build} />
      <Hero look={GANG_B} pose={bPose} rimId="rimR" shadow={0} />
      <Hero look={GANG_C} pose={cPose} rimId="rimL" shadow={0} />
      {t >= 36 ? <g transform={`translate(1040 ${fy + 26}) scale(${box}) translate(-1040 ${-(fy + 26)})`}><CashBox x={1040} y={fy + 26} s={0.8} open={0.7} /></g> : null}
      <Dust t={t} seed={6} x0={600} y0={300} w={800} h={500} n={22} o={0.45} />
      <Foreground blur={16}>
        <ellipse cx={420} cy={1010} rx={260} ry={110} fill="#0C0812" opacity={0.9} />
        <ellipse cx={1620} cy={1040} rx={220} ry={90} fill="#0C0812" opacity={0.9} />
      </Foreground>
    </g>
  );
};

// ---------- C4: medium: a passer-by hesitates at the rope, pulls out a note, drops it in the cash box; the leader watches ----------
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const z = 2.3;
  const fy = alley.yb(z);
  const x0 = alley.xl(z) + 40;
  const x1 = alley.xr(z) - 40;
  const gs = alley.s(2.7) * 1.05;
  const px = kf(t, [[0, 640], [14, 860], [len, 860]]);
  const ps = 0.84;
  const pFloor = alley.yb(1.9);
  const reach = easeOut(clamp((t - 18) / 12));
  const drop = clamp((t - 30) / 12);
  const pPose0: Pose = { ...basePose, x: px, y: pFloor - LEG_LEN * ps, scale: ps, yaw: 0.55, facing: 1, expr: 'worried', look: 0.5, legL: { a: t < 14 ? 20 * Math.sin(t / 2.2) : 0, b: 0 }, legR: { a: t < 14 ? -20 * Math.sin(t / 2.2) : 0, b: 0 } };
  const target = { x: 1010, y: fy - 150 };
  const aim = armTo(pPose0, 'armR', target.x, target.y);
  const pPose: Pose = { ...pPose0, armR: { a: 14 + (aim.a - 14) * reach, b: 6 + (aim.b - 6) * reach } };
  const hand = handAt(pPose, 'armR', pPose.armR);
  const cPose: Pose = { ...basePose, x: 1170, y: fy - LEG_LEN * gs, scale: gs, yaw: -0.55, facing: -1, expr: 'smug', look: -0.5, armL: { a: 40, b: -90 }, armR: { a: 12, b: 8 } };
  const aPose: Pose = { ...basePose, x: 1330, y: alley.yb(2.9) - LEG_LEN * alley.s(2.9) * 1.05, scale: alley.s(2.9) * 1.05, yaw: -0.3, expr: 'smug', armL: { a: 40, b: -110 }, armR: { a: 40, b: -110 }, headTilt: -4 };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 640, kf(t, [[0, 1.5], [len, 1.8]]))}>
      <TollAlley t={t + 50} id="jc4" />
      <Hero look={GANG_A} pose={aPose} rimId="rimR" shadow={0} />
      <RopeBarrier x0={x0} x1={x1} y={fy} s={0.85} t={t} />
      <Hero look={GANG_C} pose={cPose} rimId="rimL" shadow={0} />
      <CashBox x={1040} y={fy + 26} s={0.8} open={0.7} bill={drop} />
      {drop === 0 && reach > 0.3 ? (
        <g transform={`translate(${hand.x + 8} ${hand.y - 4}) rotate(-12)`}><rect x={-22} y={-10} width={44} height={20} rx={3} fill="#9ED0A0" stroke="#1A1420" strokeWidth={3} /></g>
      ) : null}
      <Hero look={PAYER} pose={pPose} rimId="rimR" shadow={0} />
    </g>
  );
};
