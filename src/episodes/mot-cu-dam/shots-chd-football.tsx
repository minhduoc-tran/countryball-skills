import React from 'react';
import { ShotProps, kf, camT, clamp, easeOut, easeIn, Hero, basePose, poseAt, faceAt, walkPose, joints, toWorld, LOOKS } from '../../engine';
import { ImpactFlash, Shockwave, Debris, BoomWord, StreakLines, shakeAt } from './punch-fx-kit';
import { Pitch, Ball, KIDS, PITCH_GROUND as G } from './chd-football-props';

// Chapter D, football with Mo (D31-D36, 178.79-185.70 s), "bored" look: Mo asks, Pip kicks, the ball bursts into shreds,
// Mo's awkward smile, the other kids walk away, Pip alone on the pitch.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);
const hip = (scale: number) => G - 154 * scale; // hip y that puts straight legs' soles on the grass

// D31 (40 f): Mo waves the ball at Pip: "đá bóng?"
export const D31: React.FC<ShotProps> = ({ t }) => {
  const wave = 128 + 16 * Math.sin(t * 0.7);
  const mo = poseAt(t, [
    { f: 0, p: { x: 540, y: hip(0.9), scale: 0.9, yaw: 0.55, facing: 1, expr: 'happy', armR: { a: 20, b: 20 }, armL: { a: 40, b: 70 } } },
    { f: 8, p: { armR: { a: wave, b: 12 } }, ease: easeOut },
    { f: 40, p: { armR: { a: wave, b: 12 }, x: 570 } },
  ]);
  const ball = toWorld(mo, joints(mo).armL.end);
  return (
    <g transform={camT(980, 560, kf(t, [[0, 1.05], [40, 1.15]]))}>
      <Pitch t={t} id="d31" />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
      <Ball x={ball.x + 6} y={ball.y - 14} r={36} rot={t * 3} />
      <Hero look={PIP} pose={{ ...basePose, x: 1340, y: hip(0.9), scale: 0.9, yaw: -0.5, facing: -1, ...faceAt(t, [[0, 'tired']]) }} rimId="rimL" shadow={1} />
    </g>
  );
};

// D32 (25 f): the kick: back-swing, contact at f19, the ball is gone
export const D32: React.FC<ShotProps> = ({ t }) => {
  const hit = 19;
  const s = 1.0;
  const p = poseAt(t, [
    { f: 0, p: { x: 800, y: hip(s), scale: s, yaw: 0.9, facing: 1, tilt: 2, armL: { a: -20, b: 20 }, armR: { a: 40, b: 40 }, legR: { a: -4, b: 0 }, legL: { a: 4, b: 0 } } },
    { f: 11, p: { legR: { a: -60, b: 85 }, tilt: -8, armL: { a: 50, b: 30 }, armR: { a: -30, b: 40 } }, ease: easeOut },
    { f: hit, p: { legR: { a: 78, b: -8 }, tilt: 12, x: 830, armL: { a: -50, b: 30 }, armR: { a: 70, b: 20 } }, ease: easeIn },
    { f: 25, p: { legR: { a: 100, b: -12 }, tilt: 16 }, ease: easeOut },
  ]);
  const h = t - hit;
  const bx = h < 0 ? 1010 : 1010 + 90 * h + 14 * h * h;
  const by = h < 0 ? G - 40 : G - 40 - 70 * h;
  const foot = toWorld(p, joints(p).legR.end);
  return (
    <g transform={camT(980, 640, 1.35)}>
      <Pitch t={t} id="d32" />
      <Hero look={PIP} pose={{ ...p, ...faceAt(t, [[0, 'neutral'], [hit - 3, 'cool']]) }} rimId="rimR" shadow={1} />
      <Ball x={bx} y={by} r={40} rot={t * 24} />
      <StreakLines t={t} x={bx} y={by} dir={-18} n={h >= 0 ? 10 : 0} len={500} spread={50} thick={8} />
      <Shockwave t={t} hitT={hit} x={foot.x + 20} y={foot.y} r={260} len={14} />
      <ImpactFlash t={t} hitT={hit} x={foot.x + 30} y={foot.y} r={190} />
    </g>
  );
};

// D33 (36 f): the ball arcs up and BURSTS at f13 into white-and-black shreds
export const D33: React.FC<ShotProps> = ({ t }) => {
  const hit = 13;
  const q = lin(t, 0, hit);
  const bx = 700 + 480 * q;
  const by = 880 - 560 * q + 0 * q * q;
  const sk = shakeAt(t, hit, 18, 12);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(960, 560, 1.0)}>
        <Pitch t={t} id="d33" />
        <Hero look={PIP} pose={{ ...basePose, x: 620, y: hip(0.7) + 40, scale: 0.7, yaw: 0.6, facing: 1, tilt: 8, legR: { a: 90, b: -10 }, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={1} />
        <Hero look={MO} pose={{ ...basePose, x: 800, y: hip(0.7) + 40, scale: 0.7, yaw: 0.5, facing: 1, armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 }, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={1} />
        {t < hit ? <Ball x={bx} y={by} r={42} rot={t * 30} /> : null}
        {t < hit ? <StreakLines t={t} x={bx} y={by} dir={-50} n={8} len={380} spread={40} thick={7} /> : null}
        <Shockwave t={t} hitT={hit} x={bx} y={by} r={520} len={20} />
        <Shockwave t={t} hitT={hit + 2} x={bx} y={by} r={340} len={20} color="#FFE27A" />
        <Debris t={t} hitT={hit} x={bx} y={by} n={46} power={1.0} dir={-90} cone={340} seed={23} groundY={G + 40} colors={['#FFFFFF', '#16101A', '#E8E2D4', '#FFFFFF', '#6B6A70']} />
        <ImpactFlash t={t} hitT={hit} x={bx} y={by} r={520} />
        <BoomWord t={t} at={hit + 3} x={bx + 220} y={by + 40} size={190} rot={7} />
      </g>
    </g>
  );
};

// D34 (37 f): Mo's awkward smile, a scrap of ball on his curls
export const D34: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 470, kf(t, [[0, 2.5], [37, 2.8]]))}>
    <Pitch t={t} id="d34" />
    <Hero look={MO} pose={{ ...basePose, x: 960, y: 640, yaw: 0.15, ...faceAt(t, [[0, 'oops']]), headTilt: 5 * Math.sin(t * 0.3), look: 0.3, armR: { a: 150, b: 40 } }} rimId="rimR" shadow={0} />
    <g transform={`translate(${940 + 8 * Math.sin(t * 0.2)} ${420 + kf(t, [[0, -16], [37, 6]])}) rotate(${-14 + 10 * Math.sin(t * 0.2)})`}>
      <polygon points="-34,0 0,-26 34,-6 26,24 -20,26" fill="#FFFFFF" stroke="#16101A" strokeWidth={5} />
      <polygon points="-10,-4 8,-8 12,8 -6,12" fill="#16101A" />
    </g>
    <Debris t={t + 40} hitT={0} x={960} y={260} n={12} power={0.15} dir={90} cone={120} seed={31} colors={['#FFFFFF', '#16101A']} sparks={false} />
  </g>
);

// D35 (20 f): three kids walk away without a glance; Pip stays
export const D35: React.FC<ShotProps> = ({ t }) => {
  const ph = t * 0.55;
  return (
    <g transform={camT(980, 560, 1.05)}>
      <Pitch t={t} id="d35" />
      {KIDS.map((k, i) => (
        <Hero key={i} look={k} pose={{ ...walkPose(1050 - i * 230 - t * (11 + i * 0.8), ph + i * 1.3, G + (i - 1) * 6, 0.88, { expr: 'neutral', look: -0.8 }, -1) }} rimId="rimL" shadow={1} />
      ))}
      <Hero look={PIP} pose={{ ...basePose, x: 1480, y: hip(0.95), scale: 0.95, yaw: -0.6, facing: -1, ...faceAt(t, [[0, 'tired']]), look: -0.9 }} rimId="rimL" shadow={1} />
    </g>
  );
};

// D36 (50 f): Pip alone on the pitch, small, long shadow; the camera drifts back
export const D36: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(980, 600, kf(t, [[0, 1.3], [50, 1.0]]))}>
    <Pitch t={t} id="d36" />
    <ellipse cx={1180} cy={G + 6} rx={150} ry={14} fill="#000" opacity={0.35} />
    <Hero look={PIP} pose={{ ...basePose, x: 1100, y: hip(0.8), scale: 0.8, yaw: -0.2, ...faceAt(t, [[0, 'tired']]), look: -0.5, armL: { a: 4, b: -2 }, armR: { a: 4, b: -2 } }} rimId="rimR" shadow={1} />
    <g transform={`translate(${760 - t * 3} ${G + 40}) rotate(${-t * 7})`}>
      <polygon points="-30,0 -4,-22 28,-6 20,18 -16,20" fill="#FFFFFF" stroke="#16101A" strokeWidth={4} />
    </g>
  </g>
);
