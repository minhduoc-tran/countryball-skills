import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeInOut, camT, LOOKS, Street, streetStand, proj, propScale, Glow, Foreground, FocusRings, TrafficLight, ShotProps,
} from '../../engine';
import { GRANDMA, WORKER } from '../khong-ai-ngheo/cast-looks';
import { Rider, SpeedLines, WheelDust } from './cha-bike-rider-and-speed-props';

// Chapter A cold open, the ride: Pip runs the red light (A1), rides on without a helmet (A2), and the people he passes
// only watch (A3). Each shot is a pure function of its own clock t.

const PIP = LOOKS.pipHood;

// ---------- A1: the red light on its mast, Pip's scooter shoots across the crossing in front of it ----------
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 5.0;
  const sc = propScale(Z);
  const g = proj(0, 0, Z);
  const x = kf(t, [[0, 120], [len, 2000]], (v) => v);
  const blink = 0.75 + 0.25 * Math.sin(t * 0.7);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1060]]), 520, 1.3)}>
      <Street t={t + 20} id="sa1" light="red" />
      <WheelDust x={x - 90 * sc} y={g.y} t={t} s={sc * 1.2} />
      <Rider look={PIP} x={x} y={g.y} s={sc} facing={1} t={t} color="#D9A441" expr="smug" lean={14} />
      <SpeedLines x={x - 120 * sc} y={g.y - 90 * sc} t={t} w={520} h={170 * sc} seed={5} />
      {/* the red signal on its mast in the foreground, glowing */}
      <TrafficLight x={470} y={1010} s={1.25} state="red" flip={false} glow on={blink} />
      <Glow x={470 + 300 * 1.25} y={1010 - 490 * 1.25} r={230} kind="red" o={0.95 * blink} />
    </g>
  );
};

// ---------- A2: medium, side-on, Pip rides on bare-headed: the helmet swings on the hook, the hood strings fly ----------
export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const s = 2.7;
  const slide = -((t * 26) % 520);
  const hook = proj(0, 0, 4)
  void hook;
  const shake = Math.sin(t * 1.7) * 3;
  return (
    <g>
      <g filter="url(#blur6)" transform={`translate(${slide} 0)`}>
        <g transform="translate(-250 -120) scale(1.35)">
          <Street t={t + 120} id="sa2" />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0814" opacity={0.18} />
      <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 640, kf(t, [[0, 1.0], [len, 1.1]]))}>
        <g transform={`translate(${shake} 0)`}>
          <WheelDust x={620} y={880} t={t} s={1.5} />
          <Rider look={PIP} x={960} y={880} s={s} facing={1} t={t} color="#D9A441" expr="happy" lean={16} helmetHook />
          <FocusRings x={960 + 62 * s} y={880 - 128 * s} t={t - 6} r0={22} color="#FFE27A" />
          <SpeedLines x={660} y={640} t={t} w={640} h={520} n={14} seed={8} />
        </g>
      </g>
    </g>
  );
};

// ---------- A3: two passers-by on the sidewalk watch him go by, and only shrug ----------
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const a = streetStand(-3.1, 4.6);
  const b = streetStand(3.0, 4.9);
  const passX = kf(t, [[0, -300], [14, 2300]], (v) => v);
  const look = clamp((t - 2) / 12);
  const shrug = easeOut(clamp((t - 14) / 8));
  const pa = poseAt(t, [
    { f: 0, p: { x: a.x, y: a.y, scale: a.scale, yaw: -0.5, look: -0.2, armL: { a: 8, b: -8 }, armR: { a: 8, b: -8 } } },
    { f: 12, p: { yaw: 0.45, look: 0.9 }, ease: easeInOut },
    { f: 26, p: { armL: { a: 62, b: 68 }, armR: { a: 62, b: 68 }, headTilt: -5 }, ease: easeOut },
  ]);
  const pb = poseAt(t, [
    { f: 0, p: { x: b.x, y: b.y, scale: b.scale, yaw: -0.6, look: -0.3, armL: { a: 8, b: -8 }, armR: { a: 8, b: -8 } } },
    { f: 12, p: { yaw: 0.4, look: 0.9 }, ease: easeInOut },
    { f: 26, p: { armL: { a: 70, b: 64 }, armR: { a: 70, b: 64 }, headTilt: 5 }, ease: easeOut },
  ]);
  void look;
  void shrug;
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1040]]), 600, 2.1)}>
      <Street t={t + 200} id="sa3" />
      <Hero look={WORKER} pose={{ ...pa, ...faceAt(t, [[0, 'neutral'], [18, 'worried']]) }} rimId="rimR" shadow={0} />
      <Hero look={GRANDMA} pose={{ ...pb, ...faceAt(t, [[0, 'neutral'], [20, 'worried']]) }} rimId="rimL" shadow={0} />
      <Foreground blur={10}>
        <Rider look={PIP} x={passX} y={1020} s={2.6} facing={1} t={t} color="#D9A441" expr="happy" lean={16} />
        <SpeedLines x={passX - 300} y={800} t={t} w={600} h={380} n={10} seed={4} />
      </Foreground>
    </g>
  );
};
