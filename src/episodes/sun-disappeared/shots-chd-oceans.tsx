import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, camT, LOOKS, LEG_LEN, Rooftop, Schematic, Glow, Foreground,
  ShotProps, rnd,
} from '../../engine';
import { NightBack } from './chd-weather-props';
import { IceSheet, Fish, Bubbles, IceSection } from './chd-ocean-props';

// Chapter D, beat "cost: oceans" (D7-D11): the sea freezes over only on top; a thick lid of ice; the deep stays liquid.

const PIP = LOOKS.pipHood;

// ---------- D7: wide: a dark night sea, a white ice sheet spreading across it ----------
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 4) / (len - 12));
  const H = 560;
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 600]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <NightBack id="d7" t={t} horizon={H} seed={73} />
      <rect x={-400} y={H} width={2800} height={900} fill="#08142A" />
      <rect x={-400} y={H} width={2800} height={40} fill="#16345C" opacity={0.7} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M ${(rnd(1, i) * 2000 - 100 + t * (0.4 + i * 0.1)) % 2100 - 100} ${H + 40 + i * 70} q 50 -9 100 0 t 100 0`} stroke="#4C7CB8" strokeWidth={3} fill="none" opacity={0.5 * (1 - p)} />
      ))}
      <IceSheet p={p} horizon={H} id="d7i" t={t} />
      <Glow x={960} y={H} r={700} kind="cool" o={0.18} />
    </g>
  );
};

// ---------- D8: schematic cross-section: ice lid on top, liquid water below ----------
export const D8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1060], [len, 1060]]), kf(t, [[0, 540], [len, 520]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Schematic t={t} id="sd8" />
    <IceSection t={t} id="d8s" lid={clamp((t - 4) / 26)} heat={0} labels={{ ice: t - 22, water: t - 34, heat: -1 }} />
  </g>
);

// ---------- D9: the same section lower: heat arrows rise from the seabed under the ice ----------
export const D9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 960]]), kf(t, [[0, 700], [len, 640]]), kf(t, [[0, 1.2], [len, 1.1]]))}>
    <Schematic t={t} id="sd9" />
    <IceSection t={t} id="d9s" lid={1} heat={clamp(t / 12)} labels={{ ice: -1, water: -1, heat: t - 8 }} />
  </g>
);

// ---------- D10: under the ice: a fish swims calmly through dark water ----------
export const D10: React.FC<ShotProps> = ({ t, len }) => {
  const fx = kf(t, [[0, -160], [len, 2080]]);
  const fy = 640 + Math.sin(t / 22) * 26;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.18]]))}>
      <defs>
        <linearGradient id="d10w" x1="0" y1="0" x2="0" y2="1080" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2E6FA0" />
          <stop offset="0.35" stopColor="#123E6C" />
          <stop offset="1" stopColor="#060E22" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-300} width={2800} height={1800} fill="url(#d10w)" />
      {/* the underside of the ice lid, glowing faintly, with light cracks */}
      <path d="M -400 -300 L 2320 -300 L 2320 150 Q 1800 190 1400 130 T 700 160 T -400 120 Z" fill="#CFE9F7" opacity={0.9} />
      <path d="M -400 120 Q 200 180 700 160 T 1400 130 T 2320 150" stroke="#F4FBFF" strokeWidth={8} fill="none" opacity={0.7} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${200 + i * 420} 150 l 20 -50 l -10 -30`} stroke="#8EB2CC" strokeWidth={4} fill="none" />)}
      <Glow x={960} y={160} r={900} kind="cool" o={0.28} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${300 + i * 380} 160 L ${240 + i * 380 - 40} 760`} stroke="#9FD0F0" strokeWidth={60} opacity={0.05} />)}
      <Bubbles t={t} x0={200} w={1500} y0={900} y1={200} n={14} seed={3} />
      <Fish x={fx} y={fy} s={1.25} t={t} />
      <Fish x={fx - 330} y={fy + 170 + Math.sin(t / 17) * 12} s={0.7} t={t + 7} color="#FFB66A" />
      <Foreground blur={10}>
        <path d="M -400 1080 Q 300 940 900 1010 T 2320 960 L 2320 1300 L -400 1300 Z" fill="#050912" />
      </Foreground>
    </g>
  );
};

// ---------- D11: close-up: Pip on the cold roof nods, his breath puffs ----------
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 820 - LEG_LEN, scale: 1, yaw: 0.35, look: 0.2, headTilt: 0 } },
    { f: 8, p: { headTilt: -5 } },
    { f: 16, p: { headTilt: 4 } },
    { f: 24, p: { headTilt: -5 } },
    { f: 34, p: { headTilt: 1 } },
  ]);
  const bob = Math.abs(Math.sin(clamp(t / 34) * Math.PI * 1.5)) * 10;
  return (
    <g transform={camT(930, 500 + bob * 0.6, kf(t, [[0, 3.0], [len, 3.3]]))}>
      <Rooftop t={t + 800} sunGone={1} lightsOut={1} cityLit={1.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [14, 'happy']]) }} rimId="rimBlue" shadow={0} />
      {[0, 1, 2].map((i) => {
        const k = ((t / 40 + i / 3) % 1);
        return <ellipse key={i} cx={980 + k * 70} cy={532 - k * 56} rx={10 + k * 26} ry={7 + k * 18} fill="#E6F1FF" opacity={0.42 * (1 - k)} />;
      })}
    </g>
  );
};
