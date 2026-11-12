import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS, LEG_LEN, rnd, settle,
  Street, streetStand, groundY, Bicycle, bikePose, Rooftop, Bedroom, BEDROOM, stand, AlarmClock, Tabletop,
  Glow, LightVeil, Foreground, Dust, Sparkle, ShotProps,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';
import { Boombox, ShopWindowBed, NeighbourFacade, SpeedLines } from './shots-chb-local-props';
import { TowerWall, CableBirds, ShoutArcs, Zzz, SunBeam } from './shots-chb-local-props-rooftop-and-night';

// Chapter B, the fun part (3/4): hands-free on the empty highway, the climb up the tallest tower, the shout nobody hears
// (the birds go, then the silence), and the night: music at full blast, the neighbour's dark window, sleeping in a shop
// window, waking at 11:47. Each shot is a pure function of its own clock t.

const PIP = LOOKS.pipHood;

// ---------- B17: wide, tracking: Pip rides the empty road, hands off the bars, the street rushing past ----------
export const B17: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 5.0;
  const st = streetStand(0, Z);
  const y = groundY(Z);
  const x = kf(t, [[0, 260], [len, 1680]], (u) => u);
  const pose = { ...bikePose(t, x, y, st.scale, { hands: 'free' }), ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(x - 40 + 30 * Math.sin(t / 10), 620, 1.85)}>
      <Street t={t + 160} id="b17" />
      <Bicycle x={x} y={y} s={st.scale} t={t} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <SpeedLines t={t} n={12} speed={60} y0={300} y1={900} o={0.3} seed={7} />
      <Foreground blur={6}>
        {[0, 1].map((i) => {
          const px = 2400 - ((t * 120 + i * 1300) % 3000);
          return <rect key={i} x={px} y={-100} width={70} height={1300} fill="#0C0A12" />;
        })}
      </Foreground>
    </g>
  );
};

// ---------- B18: medium, hands free: arms wide on the bike, head back, the road tearing past ----------
export const B18: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 4.3;
  const st = streetStand(0, Z);
  const y = groundY(Z);
  const x = 960 + 8 * Math.sin(t / 6);
  const pose = { ...bikePose(t, x, y, st.scale, { hands: 'free' }), headTilt: -5 + Math.sin(t / 5) * 2, ...faceAt(t, [[0, 'happy']]) };
  const sway = kf(t, [[0, 0], [len, -120]]);
  return (
    <g transform={camT(x + 90, 600, kf(t, [[0, 2.0], [len, 2.3]]))}>
      <g transform={`translate(${sway} 0)`}>
        <Street t={t + 260} id="b18" />
      </g>
      <Bicycle x={x} y={y} s={st.scale} t={t} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <SpeedLines t={t} n={16} speed={90} y0={0} y1={1080} o={0.4} seed={9} />
    </g>
  );
};

// ---------- B19: climbing: Pip goes up the pipe ladder of the tallest tower, the roof edge and the sky coming down to meet him ----------
export const B19: React.FC<ShotProps> = ({ t, len }) => {
  const cx = 960;
  const hipY = kf(t, [[0, 1500], [Math.round(len * 0.78), 330], [len, 175]], (u) => u);
  const ph = t * 0.45;
  const sL = Math.sin(ph);
  const pose: Pose = {
    x: cx, y: hipY, scale: 1.25, facing: 1, tilt: 0, spin: 0, headTilt: 4 * sL, armL: { a: 150 - 22 * sL, b: -10 }, armR: { a: 150 + 22 * sL, b: -10 },
    legL: { a: 18 - 26 * sL, b: -50 + 30 * sL }, legR: { a: 18 + 26 * sL, b: -50 - 30 * sL }, expr: 'happy', blink: 0, look: -0.3, glasses: 0, yaw: 0, squash: 0, handL: 'open', handR: 'open', sway: 8 * sL,
  };
  return (
    <g transform={camT(cx + 20, hipY - 160, kf(t, [[0, 0.95], [len, 1.05]]))}>
      <TowerWall id="b19" t={t} cx={cx} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [8, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- B20: low angle on the roof: Pip shouts at the sky, mouth wide, arms flung up, the shout rolling out ----------
export const B20: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = Math.max(0, Math.sin(t * 0.55));
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 790, scale: 1.8, yaw: 0.35, look: 0.6, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, headTilt: 0, tilt: 0 } },
    { f: 5, p: { armL: { a: 130, b: 8 }, armR: { a: 130, b: 8 }, headTilt: -8, tilt: -6, squash: 0.05 }, ease: easeOut },
    { f: 12, p: { armL: { a: 150, b: 12 }, armR: { a: 150, b: 12 }, headTilt: -10, tilt: -8, squash: -0.04 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Rooftop t={t + 66} sunX={1250} sunY={570} low={260} />
      <ShoutArcs x={915} y={497} t={t - 4} s={1.3} />
      <Hero look={PIP} pose={{ ...pose, squash: pose.squash - 0.03 * pulse, sway: Math.sin(t * 0.8) * 12, ...faceAt(t, [[0, 'neutral'], [4, 'shock'], [24, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- B21: wide city from the roof: the shout reaches the cable, every bird bursts into the air ----------
const TINY = { x: 1290, scale: 0.46 };
export const B21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Rooftop t={t + 140} sunX={1000} sunY={600} />
    <Hero look={PIP} pose={{ ...poseAt(t, [{ f: 0, p: { x: TINY.x, y: 812 - LEG_LEN * TINY.scale, scale: TINY.scale, yaw: -0.3, armL: { a: 150, b: 12 }, armR: { a: 150, b: 12 } } }, { f: 24, p: { armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 } } }]), ...faceAt(t, [[0, 'shock'], [18, 'neutral']]) }} rimId="rimR" shadow={0} />
    <CableBirds t={t} off={2} />
    <Foreground blur={10}><rect x={1840} y={-100} width={140} height={1300} fill="#0C0A12" /></Foreground>
  </g>
);

// ---------- B22: the same city, still: tiny Pip, an empty cable, one far bird; he shrugs, nobody heard ----------
export const B22: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: TINY.x, y: 812 - LEG_LEN * TINY.scale, scale: TINY.scale, yaw: -0.3, look: -0.6, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 } } },
    { f: 24, p: { look: 0.5 } },
    { f: 38, p: { armL: { a: 70, b: -10 }, armR: { a: 70, b: -10 }, headTilt: 5 }, ease: easeOut },
    { f: 52, p: { armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, headTilt: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1090]]), kf(t, [[0, 540], [len, 600]]), kf(t, [[0, 1.0], [len, 1.4]]))}>
      <Rooftop t={140 + 80 + t * 0.2} sunX={1000} sunY={600} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [36, 'oops'], [54, 'neutral']]) }} rimId="rimR" shadow={0} />
      <CableBirds t={t} off={-999} gone />
      <Foreground blur={10}><rect x={1840} y={-100} width={140} height={1300} fill="#0C0A12" /></Foreground>
    </g>
  );
};

// ---------- B23: the bedroom at night: the boombox at full blast, rings pulsing, Pip dancing under the fairy lights ----------
const DANCE = stand(BEDROOM, 0.62, 0.5, 0.62);
const BOX = BEDROOM.P(0.3, 1, 0.58);
export const B23: React.FC<ShotProps> = ({ t, len }) => {
  const beat = (t / 15) * Math.PI * 2;
  const bob = Math.abs(Math.sin(beat / 2));
  const L = Math.sin(beat / 2);
  const pose: Pose = {
    x: DANCE.x + 24 * Math.sin(beat / 4), y: DANCE.y + 12 * (1 - bob), scale: DANCE.scale, facing: 1, tilt: 6 * L, spin: 0, headTilt: 8 * L,
    armL: { a: 100 + 55 * L, b: 20 }, armR: { a: 100 - 55 * L, b: 20 }, legL: { a: 14 + 10 * L, b: -8 }, legR: { a: -14 + 10 * L, b: -8 }, expr: 'happy', blink: 0, look: 0.3 * L, glasses: 0,
    yaw: 0.25 * L, squash: 0.07 * (1 - bob), handL: 'open', handR: 'open', sway: 14 * L,
  };
  const flash = Math.max(0, Math.sin(beat / 2 * 1)) ** 2;
  const zoom = kf(t, [[0, 1.2], [len, 1.55]]);
  const shake = rnd(5, Math.floor(t / 7.5)) * 3 - 1.5;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 840]]) + shake, kf(t, [[0, 600], [len, 650]]), zoom)}>
      <Bedroom t={t + 50} id="b23" crossed={4} clock="21:40" />
      <Boombox x={BOX.x} y={BOX.y} s={0.62 * BEDROOM.s(0.58) * 1.0} t={t} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Glow x={BOX.x} y={BOX.y - 60} r={420} o={0.25 + 0.3 * flash} />
      <Glow x={DANCE.x} y={DANCE.y} r={500} kind={t % 30 < 15 ? 'cool' : 'warm'} o={0.15 * flash} />
    </g>
  );
};

// ---------- B24: insert: the neighbour's window across the way: dark, curtains drawn, nobody; the bass just rattles it ----------
export const B24: React.FC<ShotProps> = ({ t, len }) => {
  const rattle = Math.sin(t * 1.9) * 2.2 * (1 - clamp(t / len));
  const rings = [0, 1, 2].map((i) => (((t * 0.04 + i / 3) % 1) + 1) % 1);
  return (
    <g transform={camT(960 + rattle, 540, kf(t, [[0, 2.6], [len, 3.0]]))}>
      <NeighbourFacade cx={960} cy={540} t={t} />
      <g style={{ mixBlendMode: 'screen' }}>
        {rings.map((p, i) => <circle key={i} cx={-200} cy={820} r={300 + p * 1500} fill="none" stroke="#FFE27A" strokeWidth={8 * (1 - p) + 1} opacity={0.35 * (1 - p)} />)}
      </g>
      <Glow x={960} y={540} r={520} kind="cool" o={0.1} />
      <Foreground blur={16}><path d="M 1500 1080 L 1560 800 Q 1700 740 1920 790 L 1920 1080 Z" fill="#07050C" /></Foreground>
    </g>
  );
};

// ---------- B25: a shop window at night: Pip sleeps on the display bed under the spotlight, the price tag beside him ----------
export const B25: React.FC<ShotProps> = ({ t, len }) => {
  const breathe = Math.sin(t / 11) * 3;
  const pose: Pose = {
    x: 800, y: 640 + breathe, scale: 1.15, facing: 1, tilt: 0, spin: -90, headTilt: -45, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, legL: { a: 6, b: 0 }, legR: { a: -6, b: 0 },
    expr: 'neutral', blink: 1, look: 0, glasses: 0, yaw: 0.2, squash: 0, handL: 'open', handR: 'open', sway: 0,
  };
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 520, kf(t, [[0, 1.05], [len, 1.2]]))}>
      <ShopWindowBed id="b25" t={t} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <path d="M 850 640 Q 960 500 1180 520 Q 1360 530 1490 560 L 1490 720 L 850 720 Z" fill="#6A78B8" />
      <path d="M 850 640 Q 960 500 1180 520 Q 1360 530 1490 560" stroke="#FFC98A" strokeWidth={4} fill="none" opacity={0.5} />
      <Zzz x={600} y={420} t={t} />
    </g>
  );
};

// ---------- B26: insert: the bedside clock in late-morning sun reads 11:47; a lazy mitten pats it quiet ----------
export const B26: React.FC<ShotProps> = ({ t, len }) => {
  const slap = clamp((t - 18) / 5);
  const arm = { x: kf(t, [[0, 2050], [16, 1560], [20, 1220], [30, 1560], [len, 1900]]), y: kf(t, [[0, 360], [16, 360], [20, 330], [30, 380], [len, 420]]) };
  const hop = settle(t - 20, 14, 1.8, 6);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
      <Tabletop edge={1400} wood="#7A5A48" grain="#6A4C3C" lip="#8A6A56" />
      <SunBeam t={t} o={0.3} />
      <g transform={`translate(0 ${-Math.abs(hop)})`}>
        <AlarmClock x={760} y={760} s={3.0} text="11:47" />
      </g>
      <ellipse cx={1500} cy={760} rx={110} ry={34} fill="#CFE6FF" opacity={0.3} />
      <path d="M 1400 740 L 1420 560 L 1580 560 L 1600 740 Z" fill="#CFE6FF" opacity={0.28} />
      <InsertArm x={arm.x} y={arm.y} fx={arm.x + 560} fy={arm.y - 380} rot={-120} s={4.4} width={110} />
      <Sparkle x={820} y={420} t={t - 22} s={0.8} />
      <Glow x={1500} y={150} r={900} o={0.4} />
      <Dust t={t} seed={13} x0={200} y0={100} w={1500} h={800} n={20} o={0.3} />
    </g>
  );
};
