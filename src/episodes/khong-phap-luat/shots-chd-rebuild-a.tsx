import React from 'react';
import {
  Hero, Pose, basePose, walkPose, faceAt, joints, toWorld, kf, clamp, easeOut, backOut, camT, streetStand, LEG_LEN, FONT, Sparkle, ShotProps,
} from '../../engine';
import { DawnAlley, DawnMotes } from '../tien-vo-han/che-dawn-alley-backdrop';
import { LookArm } from '../khong-ai-ngheo/chb-cards-and-marks';
import { GRANDMA, WORKER, NEIGHBOURS, DoorRow, doorX, Dinh, Chalkboard } from './chd-courtyard-props';

// Chapter D, "6 month one: rebuild" part 1 (200.51-212.46 s; m1 then peace from D23): D20 the alley wakes, D21 doors
// open one by one, D22 grandma knocks door to door, D23 the whole neighbourhood in the courtyard, D24 the board goes
// up, D25 rule 1 in chalk.

const CHALK = '#F4F0E0';
const hipY = (g: number, s: number) => g - LEG_LEN * s;

// ---------- D20: dawn at the alley mouth: a neighbour sweeps the pavement, another walks by ----------
export const D20: React.FC<ShotProps> = ({ t, len }) => {
  const st = streetStand(-2.2, 4.8);
  const sweep = Math.sin(t / 4);
  const pose: Pose = { ...basePose, ...st, yaw: 0.6, facing: 1, tilt: 10, armL: { a: 40 + 10 * sweep, b: 20 }, armR: { a: 48 + 18 * sweep, b: 24 }, ...faceAt(t, [[0, 'happy']]) };
  const hand = toWorld(pose, joints(pose).armR.end);
  const g = st.y + LEG_LEN * st.scale;
  const w2 = streetStand(2.6, 5.6);
  const wx = kf(t, [[0, 1500], [len, 1180]], (v) => v);
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 900]]), 600, kf(t, [[0, 1.3], [len, 1.5]]))}>
      <DawnAlley t={t + 40} id="d20st" />
      <Hero look={WORKER} pose={pose} rimId="rimR" shadow={0.6} />
      <path d={`M ${hand.x} ${hand.y} L ${hand.x + 70 * st.scale + 30 * sweep * st.scale} ${g - 4}`} stroke="#6A4A2E" strokeWidth={7 * st.scale + 2} strokeLinecap="round" />
      <path d={`M ${hand.x + 40 * st.scale + 30 * sweep * st.scale} ${g - 12} l 60 8`} stroke="#C9A04A" strokeWidth={14 * st.scale + 2} strokeLinecap="round" />
      <Hero look={NEIGHBOURS[1]} pose={walkPose(wx, t * 0.5, w2.y + LEG_LEN * w2.scale, w2.scale, { ...faceAt(t, [[0, 'neutral']]) }, -1)} rimId="rimL" shadow={0.6} />
      <DawnMotes t={t} seed={3} />
    </g>
  );
};

// ---------- D21: four house doors open one by one and a neighbour steps out of each ----------
const OPENS_A = [4, 15, 26, 37];
export const D21: React.FC<ShotProps> = ({ t, len }) => {
  const GY = 820;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <DoorRow t={t} gy={GY} opens={OPENS_A} />
      {OPENS_A.map((o, i) => {
        const p = backOut(clamp((t - o - 3) / 7));
        if (p <= 0) return null;
        const s = 0.78 * p;
        const pose: Pose = { ...basePose, x: doorX(i) + 55, y: hipY(GY - 6, s), scale: s, armR: { a: 150 + 14 * Math.sin(t / 3 + i), b: 8 }, ...faceAt(t, [[0, 'happy']]) };
        return <Hero key={i} look={NEIGHBOURS[(i + 2) % 6]} pose={pose} rimId="rimR" shadow={0.5} />;
      })}
    </g>
  );
};

// ---------- D22: grandma with her ticket bundle knocks at door after door; each one opens ----------
const OPENS_B = [19, 47, 999, 999];
export const D22: React.FC<ShotProps> = ({ t, len }) => {
  const GY = 820;
  const gx = kf(t, [[0, 260], [17, 260], [30, 660], [46, 660], [60, 1060], [len, 1060]], (v) => v);
  const moving = (t >= 17 && t < 30) || (t >= 46 && t < 60);
  const knock = (t >= 4 && t < 17) || (t >= 32 && t < 46) || t >= 62;
  const S = 1.0;
  const pose: Pose = moving
    ? walkPose(gx, t * 0.6, GY, S, { ...faceAt(t, [[0, 'neutral']]) }, 1)
    : { ...basePose, x: gx, y: hipY(GY, S), scale: S, yaw: 0.7, facing: 1, armR: knock ? { a: 96 + 10 * Math.sin(t * 1.7), b: 6 } : { a: 12, b: -6 }, armL: { a: 20, b: 40 }, ...faceAt(t, [[0, 'neutral']]) };
  const hand = toWorld(pose, joints(pose).armL.end);
  const o1 = backOut(clamp((t - OPENS_B[0] - 3) / 7));
  const o2 = backOut(clamp((t - OPENS_B[1] - 3) / 7));
  return (
    <g transform={camT(gx + 240, 600, 1.35)}>
      <DoorRow t={t} gy={GY} opens={OPENS_B} />
      {o1 > 0 ? <Hero look={NEIGHBOURS[0]} pose={{ ...basePose, x: doorX(0) + 55, y: hipY(GY - 6, 0.8 * o1), scale: 0.8 * o1, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} /> : null}
      {o2 > 0 ? <Hero look={NEIGHBOURS[3]} pose={{ ...basePose, x: doorX(1) + 55, y: hipY(GY - 6, 0.8 * o2), scale: 0.8 * o2, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} /> : null}
      <Hero look={GRANDMA} pose={pose} rimId="rimR" shadow={0.7} />
      <g transform={`translate(${hand.x + 6} ${hand.y + 6}) rotate(-12)`}>
        {['#E05A4A', '#4C9AD8', '#F2C14E', '#6AB87A'].map((c, i) => <rect key={i} x={-9 + i * 6} y={-4 - i * 3} width={22} height={38} rx={3} fill={c} stroke="#2A1830" strokeWidth={2.5} transform={`rotate(${-18 + i * 12} ${-9 + i * 6} 30)`} />)}
      </g>
      {knock ? <path d={`M ${gx + 120} ${GY - 250} l 14 -10 M ${gx + 126} ${GY - 220} l 20 0 M ${gx + 120} ${GY - 190} l 14 10`} stroke="#FFE27A" strokeWidth={6} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t * 1.7)} /> : null}
    </g>
  );
};

// ---------- D23: everybody walks into the courtyard in front of the communal house and gathers ----------
const CROWD = [
  { x: 480, row: 0, look: 1 }, { x: 700, row: 1, look: 2 }, { x: 880, row: 0, look: 3 }, { x: 1080, row: 1, look: 4 },
  { x: 1280, row: 0, look: 5 }, { x: 1470, row: 1, look: 0 }, { x: 1640, row: 0, look: 2 }, { x: 600, row: 2, look: 4 }, { x: 1180, row: 2, look: 1 }, { x: 1540, row: 2, look: 3 },
];
export const D23: React.FC<ShotProps> = ({ t, len }) => {
  const GY = 760;
  const people = [...CROWD].sort((a, b) => a.row - b.row).map((c, k) => {
    const s = 0.62 + c.row * 0.1;
    const g = GY + 60 + c.row * 90;
    const start = c.x < 960 ? -120 : 2040;
    const t0 = k * 2;
    const arrive = 22 + t0;
    const x = kf(t, [[t0, start], [arrive, c.x]], easeOut);
    const dir: 1 | -1 = c.x < 960 ? 1 : -1;
    const pose: Pose = t < arrive
      ? walkPose(x, t * 0.6 + k, g, s, { ...faceAt(t, [[0, 'happy']]) }, dir)
      : { ...basePose, x, y: hipY(g, s) - Math.abs(Math.sin(t / 7 + k)) * 3, scale: s, yaw: dir * 0.5, facing: dir, ...faceAt(t, [[0, 'happy']]) };
    return <Hero key={k} look={NEIGHBOURS[c.look]} pose={pose} rimId={dir > 0 ? 'rimR' : 'rimL'} shadow={0.5} />;
  });
  const gp = backOut(clamp((t - 6) / 12));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Dinh t={t} gy={GY} id="d23" />
      {people}
      <Hero look={GRANDMA} pose={{ ...basePose, x: 960, y: hipY(GY + 200, 0.95 * gp), scale: 0.95 * gp, yaw: 0, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// ---------- D24: the board is set up in the courtyard; grandma chalks the heading "QUY ĐỊNH 1" ----------
export const D24: React.FC<ShotProps> = ({ t, len }) => {
  const GY = 780;
  const drop = backOut(clamp(t / 12));
  const prog = clamp((t - 14) / 40);
  const S = 1.25;
  const grandma: Pose = { ...basePose, x: 1150, y: hipY(GY + 140, S), scale: S, yaw: -0.7, facing: -1, armL: { a: 128 + 8 * Math.sin(t * 1.4), b: 6 - 4 * Math.sin(t * 1.4) }, ...faceAt(t, [[0, 'neutral']]) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), 520, kf(t, [[0, 1.15], [len, 1.28]]))}>
      <g filter="url(#blur6)">
        <Dinh t={t} gy={GY} id="d24" />
        {[260, 520, 1500, 1720].map((x, i) => <Hero key={i} look={NEIGHBOURS[(i + 1) % 6]} pose={{ ...basePose, x, y: hipY(GY + 40, 0.7), scale: 0.7, yaw: i < 2 ? 0.5 : -0.5, facing: i < 2 ? 1 : -1 }} rimId="rimR" shadow={0} />)}
      </g>
      <g transform={`translate(0 ${-(1 - drop) * 400})`}>
        <Chalkboard x={720} y={500} w={640} h={420}>
          <defs><clipPath id="d24clip"><rect x={-300} y={-200} width={600 * prog} height={140} /></clipPath></defs>
          <g clipPath="url(#d24clip)">
            <text x={0} y={-110} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={92} fill={CHALK} letterSpacing={3}>QUY ĐỊNH 1</text>
            <path d="M -290 -64 Q 0 -50 290 -66" stroke={CHALK} strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>
        </Chalkboard>
      </g>
      <Hero look={GRANDMA} pose={grandma} rimId="rimL" shadow={0.7} />
      <Sparkle x={1000} y={330} t={t - 44} s={1.0} />
    </g>
  );
};

// ---------- D25: close on the board: the rule appears word by word; grandma's hand with the chalk follows ----------
const WORDS1: [string, number][] = [['KHÔNG', 0], ['AI', 7], ['ĐƯỢC', 10], ['LẤY', 16]];
const WORDS2: [string, number][] = [['ĐỒ', 21], ['CỦA', 24], ['NGƯỜI', 28], ['KHÁC', 34]];
const Line: React.FC<{ y: number; words: [string, number][]; t: number }> = ({ y, words, t }) => (
  <text x={0} y={y} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={124} fill={CHALK} letterSpacing={2}>
    {words.map(([w, f], i) => <tspan key={i} fillOpacity={clamp((t - f) / 3)}>{(i ? ' ' : '') + w}</tspan>)}
  </text>
);
export const D25: React.FC<ShotProps> = ({ t, len }) => {
  const done = Math.max(0, ...[...WORDS1, ...WORDS2].filter(([, f]) => t >= f).map(([, f]) => f));
  const n = [...WORDS1, ...WORDS2].filter(([, f]) => t >= f).length;
  const hx = n <= 4 ? 520 + n * 220 : 460 + (n - 4) * 240;
  const hy = n <= 4 ? 520 : 690;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#3A2818" />
      <Chalkboard x={960} y={470} w={1500} h={760}>
        <text x={0} y={-250} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={70} fill="#F2D27A">QUY ĐỊNH 1</text>
        <Line y={-30} words={WORDS1} t={t} />
        <Line y={150} words={WORDS2} t={t} />
        <path d={`M -560 200 Q 0 ${216 + done * 0} 560 196`} stroke={CHALK} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - easeOut(clamp((t - 36) / 16)))} />
      </Chalkboard>
      <LookArm look={GRANDMA} x={hx + 40 + Math.sin(t) * 4} y={hy + 40} fx={2100} fy={1250} rot={70} s={2.6} width={70} />
      <rect x={hx - 6} y={hy + 6} width={44} height={10} rx={4} fill={CHALK} transform={`rotate(-30 ${hx} ${hy})`} />
      <Sparkle x={1560} y={250} t={t - 40} s={1.2} />
    </g>
  );
};
