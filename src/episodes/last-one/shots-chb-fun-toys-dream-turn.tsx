import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, settle, camT, LOOKS, LEG_LEN, HEAD, rnd,
  Supermarket, SUPERMARKET, aisleStand, walkPose, PillowFort, Teddy, Ball, ToyRobot, GiftBox, Rooftop, Paper,
  Foreground, Glow, Dust, Sparkle, PasteIn, ShotProps,
} from '../../engine';
import { FlyPillow } from './shots-chb-local-props';
import { Zzz } from './shots-chb-local-props-rooftop-and-night';

// Chapter B, the fun part (4/4): the toy store is his room, a pillow fort in the mall, then the dream on the roof (the
// homework blowing away, golden sunset) and the turn: the sun dips, the string lights die, the smile drops.

const PIP = LOOKS.pipHood;
const R = SUPERMARKET;

// ---------- B27: wide, the toy store: Pip walks in under the plush and the toys, looking up, a slow push-in ----------
export const B27: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / len));
  const A = aisleStand(0.48, 0.14 + 0.38 * k);
  const pose = walkPose(A.x, t * 0.5, A.y + LEG_LEN * A.scale, A.scale, { yaw: 0.3, look: 0.4, armL: { a: 22, b: 14 }, armR: { a: 22, b: 14 }, headTilt: -5 });
  return (
    <g transform={camT(960, kf(t, [[0, 545], [len, 560]]), kf(t, [[0, 1.0], [len, 1.25]]))}>
      <Supermarket t={t + 110} id="b27" toys cart={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- B28: medium: Pip leaps up cheering in the toy aisle, a ball, a robot and a gift box tossed in the air ----------
const B28_AT = aisleStand(0.46, 0.5);
export const B28: React.FC<ShotProps> = ({ t, len }) => {
  const up = Math.max(0, Math.sin(clamp((t - 8) / 24) * Math.PI));
  const pose = poseAt(t, [
    { f: 0, p: { x: B28_AT.x, y: B28_AT.y, scale: B28_AT.scale, yaw: 0.2, look: 0.4, armL: { a: 32, b: 18 }, armR: { a: 32, b: 18 } } },
    { f: 6, p: { armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, squash: 0.1 } },
    { f: 10, p: { armL: { a: 160, b: -8 }, armR: { a: 160, b: -8 }, squash: -0.08 }, ease: easeOut },
    { f: 32, p: { armL: { a: 150, b: 12 }, armR: { a: 150, b: 12 }, squash: -0.03 } },
    { f: 37, p: { squash: 0.1, armL: { a: 120, b: 14 }, armR: { a: 120, b: 14 } } },
    { f: 42, p: { squash: 0, armL: { a: 155, b: 12 }, armR: { a: 155, b: 12 } } },
  ]);
  const bob = (t < 10 ? 0 : 1) * up * 70;
  const toss = (at: number, vx: number) => { const k = Math.max(0, t - at); return { x: B28_AT.x + vx * k, y: B28_AT.y - 150 * B28_AT.scale - 22 * k + 0.5 * k * k, on: k > 0 && k < 40 }; };
  const a = toss(10, -9);
  const b = toss(11, 6);
  const c = toss(12, 13);
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 940]]), 500, kf(t, [[0, 1.85], [len, 2.0]]))}>
      <Supermarket t={t + 180} id="b28" toys cart={false} />
      <Hero look={PIP} pose={{ ...pose, y: pose.y - bob, ...faceAt(t, [[0, 'shock'], [8, 'happy']]) }} rimId="rimR" shadow={0} />
      {a.on ? <Ball x={a.x} y={a.y} r={26} /> : null}
      {b.on ? <g transform={`rotate(${t * 9} ${b.x} ${b.y})`}><ToyRobot x={b.x} y={b.y + 40} h={80} /></g> : null}
      {c.on ? <g transform={`rotate(${-t * 7} ${c.x} ${c.y})`}><GiftBox x={c.x} y={c.y + 20} w={60} h={50} c1="#E86AA6" c2="#F6D04D" /></g> : null}
      <Sparkle x={B28_AT.x + 90} y={B28_AT.y - 260} t={t - 12} s={0.9} />
    </g>
  );
};

// ---------- B29: medium: Pip tosses pillows into a heap in the middle of the mall, and the fort pops up, lights on ----------
const FORT = R.P(0.56, 1, 0.66);
const FORT_S = 0.8;
const PILLOWS: { c: string; at: number; to: [number, number]; rot: number }[] = [
  { c: '#E8A0B4', at: 3, to: [-150, -40], rot: -8 }, { c: '#9FC6E8', at: 11, to: [-20, -40], rot: 6 }, { c: '#F2D58A', at: 19, to: [130, -40], rot: -4 },
  { c: '#A8D8B8', at: 27, to: [-80, -105], rot: 8 }, { c: '#C4A8E0', at: 35, to: [70, -105], rot: -10 },
];
export const B29: React.FC<ShotProps> = ({ t, len }) => {
  const A = aisleStand(0.3, 0.66);
  const toss = PILLOWS.reduce((m, p) => Math.max(m, 1 - Math.abs(t - (p.at - 1)) / 3), 0);
  const fort = t >= 47;
  const pose = poseAt(t, [{ f: 0, p: { x: A.x, y: A.y, scale: A.scale, yaw: 0.6, look: 0.7, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } }, { f: 46, p: {} }, { f: 52, p: { armL: { a: 150, b: 12 }, armR: { a: 150, b: 12 }, squash: -0.05 }, ease: easeOut }, { f: 62, p: { squash: 0 } }]);
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 970]]), 600, kf(t, [[0, 1.12], [len, 1.22]]))}>
      <Supermarket t={t + 70} id="b29" toys cart={false} />
      {!fort ? PILLOWS.map((p, i) => {
        const k = t - p.at;
        if (k < 0) return null;
        const f = clamp(k / 9);
        const x = A.x + 60 * A.scale + (FORT.x + p.to[0] * FORT_S - (A.x + 60 * A.scale)) * f;
        const y = A.y - 80 * A.scale + (FORT.y + p.to[1] * FORT_S - (A.y - 80 * A.scale)) * f - Math.sin(f * Math.PI) * 130;
        return <FlyPillow key={i} x={x} y={y} rot={p.rot + (1 - f) * 200} c={p.c} s={0.62} />;
      }) : null}
      {fort ? (
        <g transform={`translate(${FORT.x} ${FORT.y}) scale(${kf(t, [[47, 0.3], [52, 1.08], [56, 1.0]])}) translate(${-FORT.x} ${-FORT.y})`}>
          <PillowFort x={FORT.x} y={FORT.y} s={FORT_S} t={t} />
        </g>
      ) : null}
      <Hero look={PIP} pose={{ ...pose, armR: t < 46 ? { a: 20 + 110 * toss, b: -8 } : pose.armR, tilt: t < 46 ? 4 * toss : 0, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Sparkle x={FORT.x - 120} y={FORT.y - 230} t={t - 48} s={1.1} />
      <Sparkle x={FORT.x + 150} y={FORT.y - 200} t={t - 52} s={0.8} />
    </g>
  );
};

// ---------- B30: medium: Pip sleeps in the pillow fort, the fairy lights on, the store dimmed to night ----------
const B30_FORT = R.P(0.5, 1, 0.66);
const B30_S = 0.95;
export const B30: React.FC<ShotProps> = ({ t, len }) => {
  const breathe = Math.sin(t / 12) * 1.6;
  const pose: Pose = {
    ...basePose, x: B30_FORT.x + 10 * B30_S, y: B30_FORT.y - 52 * B30_S + breathe, scale: 0.66 * B30_S, facing: 1, yaw: 0.2, spin: -90, headTilt: -45,
    armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, legL: { a: 6, b: 0 }, legR: { a: -6, b: 0 }, expr: 'neutral', blink: 1,
  };
  return (
    <g transform={camT(kf(t, [[0, 975], [len, 960]]), kf(t, [[0, 700], [len, 690]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Supermarket t={t + 150} id="b30" toys dark={0.55} night cart={false} />
      <PillowFort x={B30_FORT.x} y={B30_FORT.y} s={B30_S} t={t} layer="back" />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Teddy x={B30_FORT.x + 52 * B30_S} y={B30_FORT.y - 6 * B30_S} h={70 * B30_S} fur="#B9794A" belly="#E3B98C" bow="#D9534F" shadow={false} />
      <PillowFort x={B30_FORT.x} y={B30_FORT.y} s={B30_S} t={t} layer="front" />
      <Zzz x={B30_FORT.x - 70 * B30_S} y={B30_FORT.y - 210 * B30_S} t={t} size={54} />
      <Foreground blur={10}><path d="M 250 1080 L 300 740 L 420 700 L 470 1080 Z" fill="#07050C" /></Foreground>
    </g>
  );
};

// ---------- B31: the roof at golden hour: homework sheets tear loose and sail away over the city; Pip lies back, hands behind his head ----------
const SHEET_FLY = Array.from({ length: 7 }).map((_, i) => ({ y0: 330 + rnd(14, i) * 230, at: i * 3.6, sp: 26 + rnd(15, i) * 20, amp: 30 + rnd(16, i) * 40, w: 100 + rnd(17, i) * 36 }));
export const B31: React.FC<ShotProps> = ({ t, len }) => {
  const kick = Math.sin(t / 7) * 6;
  const pose: Pose = {
    ...basePose, x: 1010, y: 975, scale: 1.25, facing: 1, yaw: 0.3, spin: -90, headTilt: -50, armL: { a: 150, b: 90 }, armR: { a: 150, b: 90 },
    legL: { a: 8, b: 0 }, legR: { a: -22 + kick, b: 40 }, expr: 'happy', look: 0.4, sway: 6 * Math.sin(t / 6),
  };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), kf(t, [[0, 640], [len, 620]]), kf(t, [[0, 1.2], [len, 1.4]]))}>
      <Rooftop t={t + 20} sunX={1180} sunY={600} low={50} />
      <ellipse cx={1010} cy={886} rx={230} ry={20} fill="#000" opacity={0.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      {SHEET_FLY.map((sh, i) => {
        const k = t - sh.at;
        if (k < -4 || k > 70) return null;
        const x = 560 + sh.sp * k * 1.15;
        const y = sh.y0 - 3 * k + sh.amp * Math.sin(k / 6 + i);
        const flip = Math.cos(k / 3 + i);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${k * 10 + i * 30}) scale(${flip < 0 ? -1 : 1} ${Math.max(0.25, Math.abs(flip))})`} opacity={1 - clamp((k - 54) / 16)}>
            <Paper x={0} y={0} w={sh.w} rot={0} done={false} />
          </g>
        );
      })}
      <Dust t={t} seed={21} x0={300} y0={300} w={1300} h={400} n={20} o={0.5} />
    </g>
  );
};

// ---------- B32: golden hour, medium close: Pip sits on the parapet with the sun on his face, smiling, a slow push-in ----------
export const B32: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 980, y: 770, scale: 1.55, facing: 1, yaw: 0.7, look: 0.5, tilt: -2, armL: { a: 20, b: 20 }, armR: { a: 26, b: 20 }, legL: { a: 84, b: -84 }, legR: { a: 78, b: -86 } } },
    { f: 30, p: { headTilt: 3, look: 0.9 } },
    { f: 60, p: { headTilt: -2, look: 0.5 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1050]]), kf(t, [[0, 640], [len, 560]]), kf(t, [[0, 1.5], [len, 2.3]]))}>
      <Rooftop t={t + 200} sunX={1290} sunY={620} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]), blink: t % 60 > 56 ? 1 : 0 }} rimId="rimR" shadow={0} />
      {/* his legs hang on the far side of the parapet: the wall and the deck hide them */}
      <rect x={600} y={806} width={800} height={34} fill="#2B2230" />
      <rect x={600} y={806} width={800} height={3} fill="#C9895A" opacity={0.5} />
      <rect x={600} y={840} width={800} height={600} fill="#181220" />
      <Glow x={1290} y={620} r={700} o={0.35} />
      <Dust t={t} seed={33} x0={600} y0={300} w={900} h={400} n={26} o={0.6} />
    </g>
  );
};

// ---------- B33: the turn: the sun sinks, the string lights die one by one, the windows go dark; his smile is going ----------
export const B33: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  const pose = poseAt(t, [
    { f: 0, p: { x: 980, y: 800 - LEG_LEN * 1.1 + 40, scale: 1.1, yaw: 0.3, look: 0.5, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 } } },
    { f: 30, p: { look: -0.2, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Rooftop t={t + 230} sunX={1180} sunY={kf(t, [[0, 600], [len, 790]])} red={easeIn(clamp((t - 8) / 36)) * 0.5} lightsOut={clamp((t - 10) / 24)} blackout={clamp((t - 14) / 30)} cityLit={2.4} low={40} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [24, 'neutral'], [38, 'worried']]) }} rimId={k > 0.6 ? 'rimRed' : 'rimR'} shadow={0} />
    </g>
  );
};

// ---------- B34: extreme close-up: the smile has dropped; the dark city, red, soft behind him ----------
export const B34: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.2 * (1 + 0.05 * clamp(t / len));
  const head = { x: 960, y: 740 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.14, look: kf(t, [[0, 0.3], [20, -0.3], [len, 0.1]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-600 -560) scale(2)">
          <Rooftop t={t + 260} sunX={1180} sunY={800} red={0.5} lightsOut={1} blackout={1} cityLit={2.4} low={120} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.3} />
      <Hero look={PIP} pose={pose} rimId="rimRed" shadow={0} />
    </g>
  );
};
