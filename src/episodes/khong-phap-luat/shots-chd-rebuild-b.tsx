import React from 'react';
import {
  Hero, Pose, basePose, walkPose, bikePose, Bicycle, faceAt, joints, toWorld, kf, clamp, easeOut, backOut, camT, streetStand, LEG_LEN, LOOKS, FONT, ShotProps,
} from '../../engine';
import { DawnAlley, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart, Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { GRANDMA, WORKER, NEIGHBOURS, SchoolGate } from './chd-courtyard-props';

// Chapter D, "6 month one: rebuild" part 2 (212.46-220.45 s, look peace): D26 the school-gate sign is hand painted,
// D27 a rider slows and the neighbours wag fingers, D28 mum pushes the xôi cart out, D29 sis goes to school.

const PAINT = '#D9342B';
const GY = 780;
const SIGN = { x: 480, y: 330, w: 760, h: 380 };

/** The hand-painted sign: white board on two legs. Each part reveals left to right (0..1). */
const PaintedSign: React.FC<{ head: number; l1: number; l2: number; id: string }> = ({ head, l1, l2, id }) => (
  <g>
    <path d={`M ${SIGN.x + 80} ${SIGN.y + SIGN.h} V ${GY + 120} M ${SIGN.x + SIGN.w - 80} ${SIGN.y + SIGN.h} V ${GY + 120}`} stroke="#5E4026" strokeWidth={22} strokeLinecap="round" />
    <rect x={SIGN.x} y={SIGN.y} width={SIGN.w} height={SIGN.h} rx={16} fill="#F6F0E0" stroke="#7A5230" strokeWidth={12} />
    <defs>
      {[['h', head, 0, 100], ['a', l1, 100, 150], ['b', l2, 250, 100]].map(([k, p, dy, hh]) => (
        <clipPath key={k as string} id={`${id}${k}`}><rect x={SIGN.x} y={SIGN.y + (dy as number)} width={SIGN.w * (p as number)} height={hh as number} /></clipPath>
      ))}
    </defs>
    <g fontFamily={FONT.hand} fontWeight={700} fill={PAINT} stroke={PAINT} strokeWidth={2}>
      <text x={SIGN.x + 40} y={SIGN.y + 78} fontSize={64} clipPath={`url(#${id}h)`} fill="#2F6E9A" stroke="#2F6E9A">QUY ĐỊNH 2</text>
      <text x={SIGN.x + 40} y={SIGN.y + 218} fontSize={126} clipPath={`url(#${id}a)`}>CHẠY CHẬM</text>
      <text x={SIGN.x + 40} y={SIGN.y + 320} fontSize={72} clipPath={`url(#${id}b)`}>QUA CỔNG TRƯỜNG</text>
    </g>
  </g>
);

// ---------- D26: a neighbour paints the sign at the school gate, sidestepping along it as the words appear ----------
export const D26: React.FC<ShotProps> = ({ t, len }) => {
  const head = clamp(t / 14);
  const l1 = clamp((t - 26) / 22);
  const l2 = clamp((t - 56) / 20);
  const edge = l2 > 0 ? l2 : l1 > 0 ? l1 : head;
  const px = SIGN.x + SIGN.w * edge * 0.92 - 120;
  const S = 1.15;
  const back = t >= 48 && t < 56;
  const wx = back ? kf(t, [[48, SIGN.x + SIGN.w * 0.92 - 120], [56, SIGN.x - 120]], (v) => v) : px;
  const paint = Math.sin(t / 2.4);
  const pose: Pose = back
    ? walkPose(wx, t * 0.7, GY + 200, S, {}, -1)
    : { ...basePose, x: wx, y: LEG_LEN * -S + GY + 200, scale: S, yaw: 0.7, facing: 1, armR: { a: 112 + 8 * paint, b: -4 }, ...faceAt(t, [[0, 'neutral']]) };
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 820]]), 560, kf(t, [[0, 1.15], [len, 1.25]]))}>
      <SchoolGate gy={GY} t={t} />
      <PaintedSign head={head} l1={l1} l2={l2} id="d26" />
      <Hero look={WORKER} pose={pose} rimId="rimR" shadow={0.7} />
      {!back ? <g><path d={`M ${hand.x} ${hand.y} l 54 -18`} stroke="#6A4A2E" strokeWidth={9} strokeLinecap="round" /><ellipse cx={hand.x + 62} cy={hand.y - 20} rx={10} ry={16} fill={PAINT} transform={`rotate(70 ${hand.x + 62} ${hand.y - 20})`} /></g> : null}
    </g>
  );
};

// ---------- D27: a student on a bicycle comes in fast, slows at the sign, and three neighbours wag their fingers ----------
export const D27: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, -260], [16, 620], [34, 980], [len, 1090]], (v) => v);
  const slow = clamp((t - 16) / 14);
  const g = GY + 230;
  const S = 0.95;
  const rider: Pose = { ...bikePose(t * (1 - 0.8 * slow), x, g, S), ...faceAt(t, [[0, 'happy'], [18, 'oops']]), headTilt: -8 * slow };
  const wag = (i: number): Pose => ({ ...basePose, x: 1400 + i * 150, y: LEG_LEN * -0.9 + GY + 170 + (i % 2) * 30, scale: 0.9, yaw: -0.6, facing: -1, armL: { a: 118 + 22 * Math.sin(t / 2.2 + i), b: -12 }, handL: 'point', ...faceAt(t, [[0, 'neutral']]) });
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <SchoolGate gy={GY} t={t} />
      <PaintedSign head={1} l1={1} l2={1} id="d27" />
      {t < 16 ? [0, 1, 2].map((i) => <path key={i} d={`M ${x - 140 - i * 40} ${g - 110 - i * 36} h -${110 - i * 20}`} stroke="#5E5A50" strokeWidth={6} strokeLinecap="round" opacity={0.6} />) : null}
      <Bicycle x={x} y={g} s={S} t={t * (1 - 0.8 * slow)} color="#3E8CC8" />
      <Hero look={LOOKS.mo} pose={rider} rimId="rimR" shadow={0} />
      {[0, 1, 2].map((i) => {
        const p = backOut(clamp((t - 20 - i * 3) / 6));
        return p > 0 ? <Hero key={i} look={i === 0 ? GRANDMA : NEIGHBOURS[i === 1 ? 1 : 3]} pose={{ ...wag(i), scale: 0.9 * p, y: wag(i).y + (1 - p) * 40 }} rimId="rimL" shadow={0.5} /> : null;
      })}
      {t > 30 ? <path d={`M ${x + 30} ${g - 440} q 8 20 0 30`} stroke="#9CD8E8" strokeWidth={8} strokeLinecap="round" fill="none" /> : null}
    </g>
  );
};

// ---------- D28: mum pushes the xôi cart out to the alley mouth at dawn; steam rises ----------
export const D28: React.FC<ShotProps> = ({ t, len }) => {
  const { x: CX, y: CY, s: CS } = CART;
  const cx = kf(t, [[0, CX - 300 * CS], [len - 16, CX]], easeOut);
  const pushing = t < len - 16;
  const mumX = cx - 215 * CS;
  const mum: Pose = pushing
    ? walkPose(mumX, t * 0.5, CY, CS, { armL: { a: 70, b: -8 }, armR: { a: 74, b: -8 }, ...faceAt(t, [[0, 'happy']]) }, 1)
    : { ...basePose, x: mumX, y: CY - LEG_LEN * CS, scale: CS, yaw: 0.5, facing: 1, armL: { a: 14, b: -6 }, armR: { a: 30, b: 10 }, headTilt: 3, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(kf(t, [[0, CX - 120 * CS], [len, CX + 40 * CS]]), CY - 230 * CS, kf(t, [[0, 2.3], [len, 2.6]]))}>
      <DawnAlley t={t + 40} id="d28st" />
      <XoiCart x={cx} y={CY} s={CS} t={t} />
      <Hero look={LOOKS.mom} pose={mum} rimId="rimR" shadow={0} />
      <Steam x={cx + 60 * CS} y={CY - 200 * CS} t={t} n={4} h={170 * CS} w={26 * CS} o={0.55} />
    </g>
  );
};

// ---------- D29: sis with her school bag walks off to school and waves back ----------
export const D29: React.FC<ShotProps> = ({ t, len }) => {
  const st = streetStand(-3.2, 4.4, { sidewalk: true });
  const S = st.scale * 0.8;
  const g = st.y + LEG_LEN * st.scale;
  const x = kf(t, [[0, st.x - 180], [len, st.x + 380]], (v) => v);
  const wave = t > len - 16;
  const pose: Pose = walkPose(x, t * 0.7, g, S, wave ? { armL: { a: 150 + 20 * Math.sin(t / 2), b: 8 }, ...faceAt(t, [[0, 'happy']]) } : { ...faceAt(t, [[0, 'happy']]) }, 1);
  return (
    <g transform={camT(x + 160, g - 200 * S, 3.0)}>
      <DawnAlley t={t + 40} id="d29st" />
      <rect x={x - 62 * S} y={pose.y - 120 * S} width={44 * S} height={92 * S} rx={10 * S} fill="#F28C6A" stroke="#14121C" strokeWidth={4} transform={`rotate(${pose.tilt} ${x} ${pose.y})`} />
      <Hero look={LOOKS.sis} pose={pose} rimId="rimR" shadow={0.7} />
    </g>
  );
};
