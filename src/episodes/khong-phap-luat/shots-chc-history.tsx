import React from 'react';
import {
  Hero, ShotProps, basePose, Pose, kf, clamp, easeOut, backOut, camT, Dust, Foreground, LEG_LEN, shake, FONT, Glow,
} from '../../engine';
import { Parchment, INK } from './chc-hobbes-props';
import { MedievalVillage, HomicideChart, TruthStamp, HistoryScroll, SepiaSky } from './chc-history-props';
import { TollAlley, RopeBarrier, CashBox, LongShadow, alley, GANG_A, GANG_B, GANG_C } from './chc-alley-and-toll-props';

// Chapter C, "week one: history" (look memory for C21-C24): C21 a scroll of history unrolls, C22 a sepia medieval castle and village,
// C23 the bar chart: medieval homicide rate vs today (x HÀNG CHỤC LẦN, source EISNER, 2003), C24 the stamp ĐÓ LÀ THẬT; then back in the
// alley (look w1) C25: the toll-gang leader's long shadow falls over it: whoever is strongest is the law.

// ---------- C21: "history shows": a parchment scroll unrolls across the table with little icons of the old world ----------
export const C21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.15]]))}>
    <Parchment id="hs21" burn={0.8} />
    <HistoryScroll x={960} y={560} unroll={t / 28} t={t} />
    <Dust t={t} seed={21} x0={200} y0={100} w={1500} h={800} n={24} o={0.4} />
  </g>
);

// ---------- C22: sepia illustration: a castle on its hill and a village below, smoke from the chimneys, a windmill turning ----------
export const C22: React.FC<ShotProps> = ({ t, len }) => {
  const chip = backOut(clamp((t - 4) / 8));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 900], [len, 960]]), kf(t, [[0, 520], [len, 470]]), kf(t, [[0, 1.0], [len, 1.28]]))}>
        <SepiaSky t={t} />
        <MedievalVillage x={960} y={880} t={t} s={1.0} />
        <rect x={-300} y={880} width={2520} height={400} fill="#8E7A54" />
        <Foreground blur={10}><ellipse cx={300} cy={1100} rx={700} ry={160} fill="#3A2A18" opacity={0.85} /><ellipse cx={1700} cy={1110} rx={600} ry={140} fill="#3A2A18" opacity={0.85} /></Foreground>
      </g>
      <g transform={`translate(80 80) scale(${chip})`} style={{ transformOrigin: '0 0' }}>
        <rect x={0} y={0} width={640} height={76} rx={10} fill="#F2E6C6" stroke="#B8914A" strokeWidth={5} />
        <text x={320} y={52} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill={INK} letterSpacing={2}>CHÂU ÂU · THỜI TRUNG CỔ</text>
      </g>
    </g>
  );
};

// ---------- C23: the bar chart: the medieval bar towers over today's sliver; x HÀNG CHỤC LẦN on "chục"; source tag ----------
export const C23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Parchment id="hs23" burn={0.9} />
    <HomicideChart x={960} y={540} p={(t - 4) / 24} x10={(t - 39) / 8} tag={(t - 52) / 8} />
  </g>
);

// ---------- C24: the stamp ĐÓ LÀ THẬT slams over the chart; the camera punches in on the tall bar ----------
export const C24: React.FC<ShotProps> = ({ t, len }) => {
  const sk = shake(t, 8, 9, 14);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 900], [len, 940]]), kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 1.2], [len, 1.4]]))}>
        <Parchment id="hs24" burn={0.9} />
        <HomicideChart x={960} y={540} p={1} x10={1} tag={1} />
        <TruthStamp x={900} y={650} p={(t - 6) / 14} />
        <Dust t={t} seed={24} x0={300} y0={100} w={1300} h={800} n={20} o={0.4} />
      </g>
    </g>
  );
};

// ---------- C25: the alley again: the leader stands in the glow at its far end; his shadow stretches down the alley over the rope and the cash box ----------
export const C25: React.FC<ShotProps> = ({ t }) => {
  const len = 75; // last shot of the chapter: its true length (a one-chapter preview stretches it)
  const zr = 2.3;
  const fy = alley.yb(zr);
  const x0 = alley.xl(zr) + 40;
  const x1 = alley.xr(zr) - 40;
  const sc = alley.s(zr) * 1.05;
  const zl = 3.4;
  const ls = alley.s(zl) * 1.1;
  const rise = easeOut(clamp(t / 20));
  const shLen = kf(t, [[0, 190], [len, 380]]);
  const mkG = (x: number, yaw: number): Pose => ({ ...basePose, x, y: fy + 8 - LEG_LEN * sc, scale: sc, yaw, facing: yaw < 0 ? -1 : 1, expr: 'smug', look: yaw * -0.5, armL: { a: 12, b: 8 }, armR: { a: 12, b: 8 } });
  const leader: Pose = { ...basePose, x: 960, y: alley.yb(zl) - LEG_LEN * ls, scale: ls, yaw: 0, expr: 'smug', armL: { a: 38, b: -110 }, armR: { a: 38, b: -110 } };
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 650]]), kf(t, [[0, 1.0], [len, 1.22]]))}>
      <TollAlley t={t + 80} id="hs25" />
      <Glow x={960} y={alley.yb(zl) - 100} r={420} o={0.7} />
      <g style={{ filter: 'brightness(0.18)' }} opacity={0.5 + 0.5 * rise}>
        <Hero look={GANG_A} pose={leader} rimId="rimR" shadow={0} />
      </g>
      <LongShadow fx={960} fy={alley.yb(zl) + 6} len={shLen} s={1.2} o={0.75 * rise} />
      <RopeBarrier x0={x0} x1={x1} y={fy} s={0.85} t={t} />
      <Hero look={GANG_B} pose={mkG(x0 - 46, 0.55)} rimId="rimR" shadow={0} />
      <Hero look={GANG_C} pose={mkG(x1 + 46, -0.55)} rimId="rimL" shadow={0} />
      <CashBox x={1040} y={fy + 26} s={0.8} open={0.7} />
      <Foreground blur={16}><ellipse cx={380} cy={1030} rx={280} ry={110} fill="#0C0812" opacity={0.9} /></Foreground>
    </g>
  );
};
