import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS, LEG_LEN, Rooftop, StreetLamp, Glow, Foreground,
  ShotProps,
} from '../../engine';
import { NightBack, SolarRow, PowerMeter, Turbine, Flag, flakeField } from './chd-weather-props';

// Chapter D, beat "cost: weather" (D1-D6): the panels die, the wind stops, the rain and the snow stop. Dead air.

const PIP = LOOKS.pipHood;

// ---------- D1: wide on the roof: a row of solar panels, glowing faintly, going dead one by one ----------
const D1_LEN = 26; // the shot's real length (155.19 s -> 156.05 s); `len` is huge when the chapter is previewed alone
export const D1: React.FC<ShotProps> = ({ t }) => {
  const len = D1_LEN;
  const life = 1 - easeIn(clamp((t - 1) / (len - 6)));
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), kf(t, [[0, 700], [len, 700]]), kf(t, [[0, 1.2], [len, 1.3]]))}>
      <Rooftop t={t + 200} sunGone={1} lightsOut={1} cityLit={1.4} />
      <SolarRow x={300} y={620} n={4} life={life} t={t} />
      <Foreground blur={10}>
        <rect x={-300} y={930} width={2600} height={260} fill="#06060C" opacity={0.9} />
      </Foreground>
    </g>
  );
};

// ---------- D2: insert: the output meter, the needle drops to zero and trembles ----------
export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 3) / 14);
  const v = t < 3 ? 0.78 : 0.78 * (1 - easeOut(k)) - (t > 17 ? Math.sin((t - 17) * 1.6) * 0.03 * Math.exp(-(t - 17) / 6) : 0);
  const dead = v < 0.02;
  return (
    <g>
      <rect x={-300} y={-300} width={2520} height={1680} fill="#0B0D16" />
      <Glow x={960} y={540} r={620} kind="cool" o={0.18} />
      <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.15], [len, 1.25]]))}>
        <PowerMeter x={960} y={520} s={1.5} v={v} readout={dead ? '0 W' : `${Math.round(v * 400)} W`} dead={dead} t={t} />
      </g>
    </g>
  );
};

// ---------- D3: a wind turbine on a ridge at night, its blades slowing to a stop ----------
export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const u = clamp(t / (len + 4));
  const angle = 11 * (len + 4) * (u - (u * u * u) / 3) + 20; // speed falls from 11 deg/frame to 0
  const hubX = 1000;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1020]]), kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.0], [len, 1.2]]))}>
      <NightBack id="d3" t={t} horizon={860} seed={52} />
      <path d="M -400 960 Q 300 800 900 880 Q 1500 940 2320 820 L 2320 1300 L -400 1300 Z" fill="#0A0D18" />
      <path d="M 700 905 Q 1000 880 1300 925" stroke="#26304A" strokeWidth={4} fill="none" />
      <Turbine x={hubX} y={330} angle={angle} h={560} glow={t} s={1.15} />
      <Turbine x={1500} y={520} angle={angle * 0.8 + 50} h={330} s={0.55} glow={t + 9} />
      <Turbine x={430} y={560} angle={angle * 1.1 + 90} h={300} s={0.5} glow={t + 4} />
      <Glow x={hubX} y={330} r={260} kind="cool" o={0.12} />
    </g>
  );
};

// ---------- D4: Pip on the roof watches a flag go limp on its pole; the air is dead ----------
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const limp = easeOut(clamp(t / (len * 0.75)));
  const pose = poseAt(t, [
    { f: 0, p: { x: 560, y: 820 - LEG_LEN * 0.95, scale: 0.95, yaw: 0.5, look: 0.7, armL: { a: 8, b: 6 }, armR: { a: 14, b: 8 } } },
    { f: 40, p: { look: 0.9, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), 560, kf(t, [[0, 1.2], [len, 1.4]]))}>
      <Rooftop t={t + 400} sunGone={1} lightsOut={1} cityLit={1.4} />
      <Flag x={1250} y={822} t={t} limp={limp} s={1.15} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} rimId="rimBlue" shadow={0.4} />
    </g>
  );
};

// A night street corner with one lamp, used by the rain and the snow shots.
const LampCorner: React.FC<{ t: number; id: string; on: number }> = ({ t, id, on }) => (
  <g>
    <NightBack id={id} t={t} horizon={820} seed={61} />
    <rect x={-400} y={820} width={2800} height={500} fill="#0D111D" />
    <ellipse cx={720} cy={900} rx={380} ry={40} fill="#FFD9A0" opacity={0.14 * on} />
    <StreetLamp x={580} y={900} s={1.45} on={on} />
  </g>
);

// ---------- D5: the lamp-lit rain thins, hangs frozen in the air for a beat, then is gone ----------
export const D5: React.FC<ShotProps> = ({ t, len }) => {
  const drops = flakeField(7, 150, t, { speed: 38, sway: 0, stop: 30, gone: 56, w: 1500, h: 1000, x0: 80, y0: -60 });
  const frozen = t > 30;
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 800]]), 480, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <LampCorner t={t + 60} id="d5" on={0.85 + 0.15 * Math.sin(t / 3)} />
      {drops.map((d) => (d.alive ? <path key={d.i} d={`M ${d.x} ${d.y} l ${-3} ${frozen ? 34 : 46}`} stroke="#BFD4F0" strokeWidth={2.4} strokeLinecap="round" opacity={0.55} /> : null))}
    </g>
  );
};

// ---------- D6: medium: Pip under the lamp, the last snowflakes stop in mid-air and vanish ----------
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const flakes = flakeField(19, 70, t, { speed: 2.4, sway: 24, stop: 34, gone: 62, w: 1100, h: 900, x0: 330, y0: -40 });
  const pose = poseAt(t, [
    { f: 0, p: { x: 860, y: 842 - LEG_LEN * 1.0, scale: 1.0, yaw: -0.4, look: -0.3, armL: { a: 12, b: 6 }, armR: { a: 14, b: 10 } } },
    { f: 36, p: { look: -0.1, headTilt: -4, armR: { a: 40, b: 70 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 800]]), 540, kf(t, [[0, 1.35], [len, 1.5]]))}>
      <LampCorner t={t + 120} id="d6" on={0.9} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [34, 'worried']]) }} rimId="rimR" shadow={0.5} />
      {flakes.map((f) => (f.alive ? <circle key={f.i} cx={f.x} cy={f.y} r={3 + f.r * 5} fill="#F2F7FF" opacity={0.85} /> : null))}
    </g>
  );
};
