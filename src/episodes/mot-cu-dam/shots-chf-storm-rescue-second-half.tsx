import React from 'react';
import {
  Hero, Pose, faceAt, walkPose, reachAngle, kf, clamp, easeOut, easeInOut, camT, LOOKS, Glow, Bus, ShotProps, LEG_LEN,
} from '../../engine';
import { Rain } from './storm-sky';
import { StormBack, FloodFront, Splash, WindDebris, TinHouse, GROUND } from './chf-storm-props';
import { Piggyback, piggybackPoses, EggPalm } from './chf-piggyback-and-egg';

// CHAPTER F, the typhoon night, second half: "Bạn kéo chiếc xe buýt kẹt giữa dòng nước. Rồi bạn cõng em gái về nhà,
// thật nhẹ, như đang cầm một quả trứng."
// F6 the bus stuck in rushing water, F7 one hand on a tow rope and it rolls free, F8 he crouches and she hops on,
// F9 the gentle walk home, F10 the egg in an open palm, F11 at the lit door, she sleeps on his shoulder.

const PIP = LOOKS.pipHood;
const frac = (v: number) => v - Math.floor(v);
const BUS_S = 1.05;

/** The bus half-sunk in the flood: front to the left, nose a touch down, water piling at its upstream (left) end. */
const FloodedBus: React.FC<{ x: number; t: number; tilt?: number; shudder?: number }> = ({ x, t, tilt = -2.5, shudder = 0 }) => (
  <g transform={`translate(${Math.sin(t * 2.1) * shudder} 0) rotate(${tilt} ${x + 280} ${GROUND})`}>
    <Bus x={x} y={GROUND - 4} s={BUS_S} facing={-1} number="09" open={0} lit={1} t={t} />
    <Glow x={x - 420 * BUS_S} y={GROUND - 90} r={230} o={0.5} />
  </g>
);

const Foam: React.FC<{ x: number; t: number; amt?: number }> = ({ x, t, amt = 1 }) => (
  <g opacity={amt}>
    {Array.from({ length: 9 }).map((_, i) => {
      const k = (t * 0.07 + i * 0.37) % 1;
      return <ellipse key={i} cx={x + 20 + (i % 3) * 36 + k * 120} cy={GROUND - 26 - (i % 4) * 14 - k * 40} rx={34 - k * 20} ry={14 - k * 8} fill="#EAF3FF" opacity={0.85 * (1 - k)} />;
    })}
  </g>
);

// ---------- F6: wide: the bus sits stuck in the brown rushing water, wipers going, passengers' windows lit ----------
export const F6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 560, kf(t, [[0, 0.95], [len, 1.08]]))}>
    <StormBack t={t + 20} id="f6" phase={30} />
    <FloodedBus x={1000} t={t} shudder={2.5} />
    <FloodFront t={t} flow={2.2} o={0.7} />
    <Foam x={520} t={t} />
    <WindDebris t={t} n={12} seed={41} />
    <Rain t={t} intensity={1.8} slant={0.6} />
  </g>
);

// ---------- F7: one hand on a rope, a calm walk, the whole bus rolls out of the current behind him ----------
export const F7: React.FC<ShotProps> = ({ t, len }) => {
  const go = easeInOut(clamp((t - 6) / (len - 6)));
  const busX = 1330 - 560 * go;
  const front = busX - 410 * BUS_S; // the bumper
  const ph = t * 0.42;
  const x = front - 250;
  const pose0 = walkPose(x, ph, GROUND, 0.62, { tilt: -10, yaw: -0.8, look: -0.5 }, -1);
  const hand0 = { x: front - 20, y: GROUND - 80 };
  const a = reachAngle({ ...pose0, armR: { a: 0, b: 0 } }, hand0);
  const pose: Pose = { ...pose0, armR: { a, b: 0 }, armL: { a: 6, b: 8 }, ...faceAt(t, [[0, 'cool']]) };
  const handW = { x: x + 12, y: pose.y + LEG_LEN * 0.62 * 0.0 + 36 };
  const slack = 20 * (1 - go);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 740]], easeInOut), 600, 1.08)}>
      <StormBack t={t + 140} id="f7" phase={10} />
      <FloodedBus x={busX} t={t} tilt={-2.5 + 2.5 * go} shudder={2 * (1 - go)} />
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
      <path d={`M ${handW.x + 12} ${handW.y} Q ${(handW.x + front) / 2} ${handW.y + slack + 18} ${front} ${GROUND - 80}`} stroke="#14121A" strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={`M ${handW.x + 12} ${handW.y} Q ${(handW.x + front) / 2} ${handW.y + slack + 18} ${front} ${GROUND - 80}`} stroke="#C79A5A" strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="10 7" />
      <Splash x={x + 20} y={GROUND - 20} p={clamp(frac(ph / Math.PI) * 2.2)} s={0.8} seed={8} />
      <FloodFront t={t} flow={2.0} o={0.7} />
      <Foam x={front - 60} t={t} />
      <WindDebris t={t} n={12} seed={51} />
      <Rain t={t} intensity={1.8} slant={0.6} />
    </g>
  );
};

// ---------- F8: he crouches in the doorway light; his sister hops onto his back ----------
export const F8: React.FC<ShotProps> = ({ t, len }) => {
  const hopP = clamp((t - 12) / 16);
  const crouch = kf(t, [[0, 0], [10, 1], [len - 6, 0.7], [len, 0.4]]);
  const x = 760;
  const { sis } = piggybackPoses(t, x, GROUND, 1, 1, { crouch, tilt: 10 });
  const arc = Math.sin(hopP * Math.PI) * 120;
  return (
    <g transform={camT(800, 560, 1.4)}>
      <StormBack t={t + 60} id="f8" />
      <TinHouse x={420} t={t} h={190} roof={false} />
      <Glow x={380} y={GROUND - 100} r={330} o={0.45} />
      {hopP < 1 ? <SisHop t={t} hopP={hopP} sis={sis} arc={arc} /> : null}
      <Piggyback t={t} x={x} ground={GROUND} scale={1} facing={1} crouch={crouch} hideSis={hopP < 1} pipExpr={hopP < 1 ? 'happy' : 'worried'} />
      <FloodFront t={t} flow={0.8} o={0.55} />
      <Rain t={t} intensity={1.6} slant={0.5} />
    </g>
  );
};

/** Sis in mid-hop from the porch to Pip's back (before she lands, she is a lone Hero on an arc). */
const SisHop: React.FC<{ t: number; hopP: number; sis: Pose; arc: number }> = ({ hopP, sis, arc }) => {
  const sx = kf(hopP, [[0, 520], [1, sis.x]], easeOut);
  const sy = kf(hopP, [[0, GROUND - LEG_LEN * sis.scale], [1, sis.y]], easeOut) - arc;
  const pose: Pose = { ...sis, x: sx, y: sy, legL: { a: 30, b: -30 }, legR: { a: -10, b: -20 }, armL: { a: 60, b: 0 }, armR: { a: 60, b: 0 }, squash: hopP < 0.1 ? 0.1 : -0.06 * Math.sin(hopP * Math.PI), expr: 'happy' };
  return <Hero look={LOOKS.sis} pose={pose} rimId="rimBlue" shadow={0} />;
};

// ---------- F9: the gentle walk home: tiny steps, no splash worth the name, the lit house ahead ----------
export const F9: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 360], [len, 880]], (v) => v);
  const ph = t * 0.33;
  return (
    <g transform={camT(x + 330, 580, 1.22)}>
      <StormBack t={t + 90} id="f9" phase={50} />
      <TinHouse x={1500} t={t} h={190} roof={false} />
      <Glow x={1330} y={GROUND - 110} r={380} o={0.5} />
      <Piggyback t={t} x={x} ground={GROUND} scale={1} facing={1} step={ph} stride={8} pipExpr="worried" />
      <FloodFront t={t} flow={0.8} o={0.5} />
      <Splash x={x + 24} y={GROUND - 22} p={clamp(frac(ph / Math.PI) * 2.6)} s={0.4} seed={11} />
      <Rain t={t} intensity={1.2} slant={0.4} />
    </g>
  );
};

// ---------- F10: insert: an open palm, an egg on it, the hand barely moving ----------
export const F10: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1.0], [len, 1.1]]);
  return (
    <g>
      <g filter="url(#blur16)">
        <rect x={-100} y={-100} width={2120} height={1280} fill="#10172C" />
        <StormBack t={t} id="f10" flash={0} />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0E1C" opacity={0.4} />
      <Glow x={900} y={520} r={620} o={0.4} />
      <g transform={`translate(960 640) scale(${z}) translate(-960 -640)`}>
        <EggPalm t={t} id="f10" calm={0.3 + 0.5 * clamp(t / len)} />
      </g>
    </g>
  );
};

// ---------- F11: at the lit door: she is asleep on his shoulder, he stands very still, the rain thinning ----------
export const F11: React.FC<ShotProps> = ({ t, len }) => {
  const zoom = kf(t, [[0, 1.4], [len, 1.75]]);
  const open = easeOut(clamp(t / 18));
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 560, zoom)}>
      <StormBack t={t + 20} id="f11" flash={0} />
      <TinHouse x={1380} t={t} h={190} roof={false} />
      <rect x={1380 + 260 - 190} y={GROUND - 190 + 30} width={110} height={160} fill="#FFD890" opacity={open} />
      <Glow x={1400} y={GROUND - 100} r={520} o={0.55 * open + 0.2} />
      <Piggyback t={t} x={1060} ground={GROUND} scale={1} facing={1} step={0} stride={2} sleepy={1} pipExpr="happy" />
      <FloodFront t={t} flow={0.6} o={0.45} />
      <Rain t={t} intensity={0.6} slant={0.3} />
    </g>
  );
};
