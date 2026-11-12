import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS, LEG_LEN, walkPose, rnd,
  Classroom, SchoolDesk, Tabletop, Paper, Glow, LightVeil, Foreground, Sparkle, Street, streetStand, groundY, propScale, proj,
  Motorbike, CrossroadsTop, LyingPipTop, ShotProps,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';
import { ChalkWrite, ChalkPath } from './shots-chb-local-props';

// Chapter B, the fun part (2/4): the school is his (no teacher, tests swept off the desk, TỰ DO!!! in chalk with a king
// doodle) and the city is his playground (running and jumping, lying in the crossroads, a street with no horns).

const PIP = LOOKS.pipHood;

// ---------- the board: "TỰ DO!!!" writes on, then a chalk doodle of Pip with a crown ----------
const KING = { x: 955, y: 395 };
const TuDoBoard: React.FC<{ id: string; text?: number; doodle?: number }> = ({ id, text = 0, doodle = 0 }) => (
  <g>
    <ChalkWrite id={id} x={452} y={338} text="TỰ DO!!!" size={104} p={text} anchor="start" />
    <g transform={`translate(${KING.x} ${KING.y})`}>
      <ChalkPath d="M -46 -30 L -50 -78 L -26 -52 L 0 -90 L 26 -52 L 50 -78 L 46 -30 Z" p={doodle * 2.2} w={6} color="#F6D68A" />
      <ChalkPath d="M -48 -30 A 50 50 0 1 0 48 -30" p={doodle * 2.2 - 0.9} w={6} />
      <ChalkPath d="M -52 -22 Q -64 40 -30 70 M 52 -22 Q 64 40 30 70" p={doodle * 2.2 - 1.2} w={6} />
      <ChalkPath d="M -20 0 L -20 8 M 20 0 L 20 8" p={doodle * 2.2 - 1.5} w={7} />
      <ChalkPath d="M -22 28 Q 0 50 22 28" p={doodle * 2.2 - 1.6} w={6} />
      <ChalkPath d="M -10 72 L -10 94 M 10 72 L 10 94" p={doodle * 2.2 - 1.8} w={5} />
    </g>
  </g>
);

// ---------- B10: wide, the empty classroom: no teacher (an empty desk, the chair pushed back), Pip strolls in ----------
const FLOOR_Y = 900;
export const B10: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  const x = 560 + 480 * k;
  const pose = walkPose(x, t * 0.5, FLOOR_Y, 0.92, { yaw: 0.7, armL: { a: 34, b: 24 }, armR: { a: 34, b: 24 }, look: 0.3 });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 0.95], [len, 1.05]]))}>
      <Classroom t={t + 120} empty board={<g />} id="b10cls" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={1260} />
    </g>
  );
};

// ---------- B11: top-down on a school desk: a stack of test sheets, his mitten sweeps them all off the edge ----------
const SHEETS = Array.from({ length: 6 }).map((_, i) => ({
  x: 900 + i * 6, y: 560 - i * 5, rot: -6 + i * 3, vx: -(46 + rnd(3, i) * 40), vy: (rnd(4, i) - 0.7) * 34, spin: (rnd(5, i) - 0.5) * 26, at: 6 + i * 1.2,
}));
export const B11: React.FC<ShotProps> = ({ t, len }) => {
  const arm = { x: kf(t, [[0, 1760], [5, 1250], [16, 360]]), y: kf(t, [[0, 700], [5, 640], [16, 560]]) };
  return (
    <g transform={`translate(960 540) rotate(${-1.5 + t * 0.05}) scale(${1 + t * 0.002}) translate(-960 -540)`}>
      <Tabletop edge={1400} wood="#B08A5E" grain="#9C7A50" />
      <Glow x={1000} y={420} r={720} o={0.3} />
      <rect x={1500} y={160} width={140} height={60} rx={10} fill="#E9A0A0" transform="rotate(16 1570 190)" />
      <rect x={150} y={820} width={420} height={44} fill="#D9C8A8" transform="rotate(-6 360 842)" />
      {SHEETS.map((sh, i) => {
        const k = Math.max(0, t - sh.at);
        const e = k * (1 - 0.01 * k);
        return (
          <g key={i} opacity={1 - clamp((k - 22) / 10)}>
            <Paper x={sh.x + sh.vx * e} y={sh.y + sh.vy * e + 1.4 * k * k} w={430} rot={sh.rot + sh.spin * e} done={false} />
          </g>
        );
      })}
      <text x={900} y={330} textAnchor="middle" fontFamily="Itim, sans-serif" fontSize={40} fill="#3A4A6A" opacity={t < 6 ? 1 : 0}>KIỂM TRA</text>
      <InsertArm x={arm.x} y={arm.y} fx={arm.x + 700} fy={arm.y + 620} rot={-80} s={5} width={116} />
    </g>
  );
};

// ---------- B12: medium at the board: he walks along it writing TỰ DO!!! in chalk ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 2) / 22);
  const front = 452 + 400 * p;
  const pose = poseAt(t, [
    { f: 0, p: { x: 400, y: 800, scale: 1.55, yaw: 0.6, look: 0.8, armR: { a: 14, b: -6 }, armL: { a: 10, b: -8 } } },
  ]);
  const px = front - 120;
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 800]]), kf(t, [[0, 520], [len, 505]]), kf(t, [[0, 1.2], [len, 1.3]]))}>
      <Classroom t={t + 200} empty board={<TuDoBoard id="b12" text={p} />} id="b12cls" />
      <Hero look={PIP} pose={{ ...pose, x: px, armR: { a: 150, b: -6 + 6 * Math.sin(t * 1.3) }, armL: { a: 10, b: -8 }, tilt: 3, headTilt: -2, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <Sparkle x={front + 30} y={330} t={t - 22} s={0.9} />
    </g>
  );
};

// ---------- B13: insert on the board: the chalk doodle of himself as king draws on ----------
export const B13: React.FC<ShotProps> = ({ t, len }) => {
  const d = clamp((t - 2) / 26);
  // chalk in his mitten, tracking the pen along the crown, then the face (screen space)
  const hx = kf(t, [[0, 1500], [6, 1130], [14, 1010], [24, 1000], [len, 1040]]);
  const hy = kf(t, [[0, 900], [6, 560], [14, 430], [24, 640], [len, 700]]);
  return (
    <g>
      <g transform={camT(KING.x - 60, kf(t, [[0, 400], [len, 390]]), kf(t, [[0, 2.5], [len, 2.7]]))}>
        <Classroom t={t + 280} empty board={<TuDoBoard id="b13" text={1} doodle={d} />} id="b13cls" />
      </g>
      <g filter="url(#rimR)">
        <InsertArm x={hx} y={hy} fx={hx + 520} fy={hy + 620} rot={-18} s={4.2} width={100} point />
      </g>
    </g>
  );
};

// ---------- B14: wide, the street at dusk: Pip runs across the road, leaps, lands with both arms up ----------
export const B14: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 3.3;
  const st = streetStand(0, Z);
  const g = groundY(Z);
  const px = (X: number) => proj(X, 0, Z).x;
  const x = kf(t, [[0, px(-1.9)], [30, px(-0.5)], [50, px(0.8)], [len, px(1.0)]], (u) => u);
  const jt = clamp((t - 30) / 20);
  const air = Math.sin(jt * Math.PI) * 150;
  const base = walkPose(x, t * 0.85, g, st.scale, { yaw: 0.75, armL: { a: 40, b: 40 }, armR: { a: 40, b: 40 }, look: 0.4 });
  const pose: Pose = t < 28
    ? base
    : poseAt(t, [
        { f: 28, p: { ...base, squash: 0.1, armL: { a: -10, b: 6 }, armR: { a: -10, b: 6 } } },
        { f: 33, p: { squash: -0.08, armL: { a: 150, b: 12 }, armR: { a: 150, b: 12 }, legL: { a: 40, b: -50 }, legR: { a: -20, b: -30 } }, ease: easeOut },
        { f: 46, p: { squash: -0.04 } },
        { f: 50, p: { squash: 0.12, legL: { a: 6, b: 0 }, legR: { a: -6, b: 0 }, armL: { a: 120, b: 14 }, armR: { a: 120, b: 14 } } },
        { f: 55, p: { squash: 0, armL: { a: 146, b: 12 }, armR: { a: 146, b: 12 } } },
      ]);
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 1010]]), 640, kf(t, [[0, 1.1], [len, 1.2]]))}>
      <Street t={t + 30} id="b14" market={0.7} />
      <ellipse cx={x} cy={g + 6} rx={70 * st.scale * (1 - air / 300)} ry={9 * st.scale} fill="#000" opacity={0.3 * (1 - air / 250)} />
      <Hero look={PIP} pose={{ ...pose, x, y: (t < 28 ? base.y : st.y) - air, scale: st.scale, facing: 1, yaw: t < 30 ? 0.75 : 0.5, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- B15: top-down on the crossroads: Pip lies in the middle, a slow push-in onto his face as he watches the clouds ----------
export const B15: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 410]]), kf(t, [[0, 1.0], [len, 2.9]], easeIn2))}>
      <CrossroadsTop t={t + 40} id="b15" />
      <LyingPipTop x={960} y={578} scale={0.95} t={t} blink={t % 70 > 66 ? 1 : 0} />
      <ellipse cx={960 + 800 - k * 1600} cy={560} rx={260} ry={120} fill="#1A1030" opacity={0.12} filter="url(#blur16)" />
    </g>
  );
};
const easeIn2 = (u: number) => u * u * (3 - 2 * u);

// ---------- B16: low angle on the quiet street: scooters stand where they stopped, a paper bag drifts, the light blinks green ----------
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 3.7;
  const b = proj(-1.5, 0, Z);
  const s = propScale(Z);
  const low = 230;
  const drift = kf(t, [[0, 1800], [len, 200]], (u) => u);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 1.05], [len, 1.18]]))}>
      <Street t={t + 90} id="b16" low={low} light="green" />
      <Motorbike x={b.x} y={b.y + low} s={s} facing={1} lean={-4} color="#B8483E" t={t} />
      <g transform={`translate(${drift} ${groundY(7) + low - 20})`}>
        <path d={`M -16 0 L -12 -26 L 12 -26 L 16 0 Z`} fill="#EDE6D6" transform={`rotate(${t * 9})`} />
      </g>
      <Foreground blur={10}>
        <path d="M 0 1080 L 40 800 Q 140 720 220 780 L 260 1080 Z" fill="#0C0A12" />
      </Foreground>
    </g>
  );
};
