import React from 'react';
import { Hero, LOOKS, faceAt, kf, clamp, easeOut, camT, poseAt, Schematic, Dust, Glow, Sparkle, ShotProps } from '../../engine';
import { DrySeabed } from './kit-dry-seabed';
import { Globe } from './kit-globe';
import { BigNum } from './kit-hud';
import { RidgeGlow, RidgeChain, WaterVeil } from './cha-world-props';
import { BigText } from './cha-scale-props';

// Chapter A, the hidden world, part 1 (42.1-52.6 s): Pip at the lip of the abyss sees the unseen seabed, the 65.000 km
// mid-ocean ridge (number, globe seam, a range in the distance), and "it used to lie under the water".

const LIP_PIP = { x: 440, y: 790, scale: 0.85, yaw: 0.85 };

// ---------- A24: Pip at the shelf lip, the far plain glowing, a slow push-in ----------
export const A24: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { ...LIP_PIP, look: 0.8, tilt: 2, armL: { a: 10, b: -6 }, armR: { a: 14, b: -6 } } }, { f: len, p: { tilt: 6, armR: { a: 22, b: -6 } } }]);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 800]]), kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.05], [len, 1.3]]))}>
      <DrySeabed id="ce24" t={t + 20} haze={0.2} />
      <RidgeGlow t={t} />
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [22, 'happy']]) }} rimId="rimR" shadow={1} />
      <Dust t={t} seed={4} x0={0} y0={420} w={1920} h={520} n={30} o={0.5} />
      <Sparkle x={1260} y={410} t={t - 14} s={1.4} />
    </g>
  );
};

// ---------- A25: the far plain: seamounts and a warm seam on the horizon, the camera sweeping across ----------
export const A25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1500], [len, 1000]]), 470, kf(t, [[0, 1.8], [len, 1.6]]))}>
    <DrySeabed id="ce25" t={t + 50} haze={0.3} />
    <RidgeGlow t={t} />
    <Glow x={1000} y={410} r={300} kind="warm" o={0.35} />
  </g>
);

// ---------- A26: 65.000 KM counting up, a mountain line drawing along the bottom ----------
export const A26: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / 40));
  let d = 'M 80 940';
  for (let x = 80; x <= 1840; x += 40) d += ` L ${x} ${940 - Math.abs(Math.sin(x * 0.021)) * 90 - (x % 120) * 0.25}`;
  return (
    <BigNum t={t} len={len} id="ce26" to={65000} unit="KM" caption="DÃY NÚI DÀI NHẤT HÀNH TINH">
      <path d={d} stroke="#FFB15A" strokeWidth={8} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
    </BigNum>
  );
};

// ---------- A27: the globe turns with the ridge glowing orange all the way round ----------
export const A27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Schematic t={t} id="ce27" />
    <Globe id="ce27g" t={t} r={370} cx={960} cy={560} ridge={easeOut(clamp(t / 12))} rot={-60} />
    <BigText x={960} y={140} text="65.000 KM" size={96} t={t - 6} />
  </g>
);

// ---------- A28: the range seen from the seabed: peaks marching to the horizon, light pulses running along it ----------
export const A28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 600], [len, 1100]]), 560, kf(t, [[0, 1.05], [len, 1.12]]))}>
    <DrySeabed id="ce28" t={t + 70} haze={0.25} />
    <RidgeChain t={t} id="ce28r" />
  </g>
);

// ---------- A29: ...and before today it lay under the sea: the water drains off the same range ----------
export const A29: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1100, 560, kf(t, [[0, 1.12], [len, 1.05]]))}>
    <DrySeabed id="ce29" t={t + 70} haze={0.25} />
    <RidgeChain t={t + 40} id="ce29r" />
    <WaterVeil id="ce29w" t={t} y={kf(t, [[6, 90], [len - 4, 1150]], easeOut)} />
  </g>
);
