import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, Rooftop, Schematic, SchLabel, Arrow, DrawOn, SCH, FONT,
  Foreground, Sparkle, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BlinkMoon, BrightPoint, StarField, SunIcon, EarthIcon, MoonIcon, JupiterIcon, CrossedBulb, MirrorIcon } from './chb-local-props';

// Chapter B, 2/3: the Moon blinks out (B5), "a mirror for the Sun" (B6, B7), then Jupiter: look up (B8), the bright
// point (B9), the last light's trip Sun -> Jupiter -> Earth (B10, B11), the brightest thing in the sky (B12) and the
// fade (B13). The rooftop is already in permanent night (sunGone 1).

const PIP = LOOKS.pipHood;
const FEET = 822;
const MOON = { x: 1280, y: 250, r: 80 };
const JUP = { x: 1250, y: 300 };

// ---------- B5: wide night rooftop: the Moon hangs over the city, then blinks out on "vanishes" (frame 56) ----------
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.55;
  const pose = poseAt(t, [
    { f: 0, p: { x: 640, y: FEET - LEG_LEN * sc, scale: sc, yaw: 0.4, tilt: -3, headTilt: -8, armL: { a: 12, b: 6 }, armR: { a: 12, b: 6 } } },
    { f: 58, p: { headTilt: -8 } },
    { f: 64, p: { headTilt: 2, tilt: 0 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1130]]), kf(t, [[0, 540], [len, 400]]), kf(t, [[0, 1.0], [len, 1.5]]))}>
      <Rooftop t={t + 360} cityLit={2.5} sunGone={1} />
      <BlinkMoon x={MOON.x} y={MOON.y} r={MOON.r} t={t} at={56} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [58, 'shock']]) }} rimId="rimBlue" shadow={0} />
      <Foreground blur={10}><rect x={1840} y={-100} width={140} height={1300} fill="#0C0A12" /></Foreground>
    </g>
  );
};

// ---------- B6: schematic: the Moon has no light of its own (a bulb crossed out) ----------
export const B6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Schematic t={t} id="b6" />
    <g transform={`translate(0 ${Math.sin(t / 9) * 6})`}><MoonIcon x={660} y={500} r={170} /></g>
    <CrossedBulb x={1260} y={500} p={(t - 22) / 8} s={2.4} />
    <SchLabel x={960} y={870} t={t - 6} text="NO LIGHT OF ITS OWN" size={62} />
  </g>
);

// ---------- B7: schematic: Sun (gone) -> Moon (a mirror) -> Earth, "1 second" between the last two ----------
export const B7: React.FC<ShotProps> = ({ t, len }) => {
  const gone = easeOut(clamp((t - 30) / 8));
  const dot = (a: number, b: number, from: number, to: number, y: number) => {
    const p = clamp((t - from) / (to - from));
    return p > 0 && p < 1 ? <circle cx={a + (b - a) * p} cy={y} r={11} fill={SCH.glow} /> : null;
  };
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Schematic t={t} id="b7" />
      <SunIcon x={280} y={540} r={72} t={t} gone={gone} />
      <MoonIcon x={960} y={540} r={92} lit={1 - gone} />
      <MirrorIcon x={960} y={330} t={t} s={1.1} />
      <EarthIcon x={1640} y={540} r={58} />
      <Arrow x0={400} y0={540} x1={840} y1={540} t={t - 4} bend={0} />
      <Arrow x0={1080} y0={540} x1={1560} y1={540} t={t - 10} bend={0} />
      {dot(400, 840, 12, 34, 540)}
      {dot(1080, 1560, 30, 52, 540)}
      <SchLabel x={960} y={720} t={t - 14} text="MIRROR" size={44} color={SCH.dim} />
      <SchLabel x={1320} y={480} t={t - 24} text="1 second" size={50} color={SCH.live} />
    </g>
  );
};

// ---------- B8: "But look up": Pip, medium, arm up pointing at the sky ----------
export const B8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.25;
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: FEET + 80 - LEG_LEN * sc, scale: sc, yaw: 0.3, tilt: -2, headTilt: -4, armL: { a: 12, b: 6 }, armR: { a: 40, b: 30 }, handR: 'point' } },
    { f: 10, p: { armR: { a: 160, b: 4 }, headTilt: -12, tilt: -5 }, ease: easeOut },
    { f: 15, p: { armR: { a: 156, b: 6 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), kf(t, [[0, 520], [len, 470]]), kf(t, [[0, 1.5], [len, 1.75]]))}>
      <Rooftop t={t + 400} low={80} cityLit={2.5} sunGone={1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [8, 'shock']]) }} rimId="rimBlue" shadow={0} />
    </g>
  );
};

// ---------- B9: the star field, one bright point: JUPITER (a label draws on), Pip's finger pointing from below ----------
export const B9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1100]]), kf(t, [[0, 600], [len, 500]]), kf(t, [[0, 1.2], [len, 1.5]]))}>
    <StarField id="b9" t={t + 40} />
    <BrightPoint x={1260} y={380} t={t} r={13} />
    <Sparkle x={1260} y={380} t={t - 4} />
    <DrawOn d="M 1285 352 L 1320 270 L 1320 270" t={t - 14} dur={9} color={SCH.glow} width={4} />
    <SchLabel x={1330} y={236} t={t - 22} text="JUPITER" size={46} color="#FFE2A8" anchor="start" />
    <InsertArm x={1130} y={640} fx={800} fy={1250} rot={28} s={2.4} width={64} point />
  </g>
);

// ---------- B10 / B11: the last light: Sun -> Jupiter (43 min), bounce back to Earth (+33 min), over an hour in all ----------
const SUN_P = { x: 250, y: 620 };
const EARTH_P = { x: 560, y: 810 };
const JUP_P = { x: 1560, y: 400 };
const Layout: React.FC<{ t: number; id: string; sunGone: number; bounce: number; extra?: React.ReactNode }> = ({ t, id, sunGone, bounce, extra }) => (
  <g>
    <Schematic t={t} id={id} />
    <SunIcon x={SUN_P.x} y={SUN_P.y} r={66} t={t} gone={sunGone} />
    <EarthIcon x={EARTH_P.x} y={EARTH_P.y} r={40} />
    <JupiterIcon x={JUP_P.x} y={JUP_P.y} r={70} />
    <SchLabel x={SUN_P.x} y={SUN_P.y + 140} t={t - 2} text="SUN" size={34} color={SCH.dim} />
    <SchLabel x={EARTH_P.x + 40} y={EARTH_P.y + 90} t={t - 2} text="EARTH" size={34} color={SCH.dim} />
    <SchLabel x={JUP_P.x} y={JUP_P.y + 130} t={t - 2} text="JUPITER" size={34} color={SCH.dim} />
    <Arrow x0={340} y0={590} x1={1470} y1={420} t={t - 4} dur={14} bend={0} />
    {bounce > -1 ? <Arrow x0={1500} y0={470} x1={640} y1={790} t={bounce} dur={14} color={SCH.glow} bend={0} /> : null}
    {extra}
  </g>
);
export const B10: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 10) / 58);
  const gone = easeOut(clamp((t - 38) / 8));
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Layout t={t} id="b10" sunGone={gone} bounce={-9} extra={
        <g>
          <circle cx={340 + (1470 - 340) * p} cy={590 + (420 - 590) * p} r={13} fill={SCH.glow} opacity={p > 0 && p < 1 ? 1 : 0} />
          <SchLabel x={900} y={600} t={t - 16} text="43 min" size={60} color={SCH.live} />
          <SchLabel x={900} y={252} t={t - 8} text="LAST SUNLIGHT LEAVES" size={36} color={SCH.dim} />
        </g>
      } />
    </g>
  );
};
export const B11: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 36) / 40);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 940]]), kf(t, [[0, 560], [len, 580]]), kf(t, [[0, 1.12], [len, 1.0]]))}>
      <Layout t={t} id="b11" sunGone={1} bounce={t - 36} extra={
        <g>
          <circle cx={1500 + (640 - 1500) * p} cy={470 + (790 - 470) * p} r={13} fill="#FFF3D0" opacity={p > 0 && p < 1 ? 1 : 0} />
          <SchLabel x={900} y={600} t={t} text="43 min" size={44} color={SCH.dim} />
          <SchLabel x={1180} y={760} t={t - 44} text="+ 33 min" size={56} color={SCH.live} />
          <g transform={`translate(960 140)`}>
            <SchLabel x={0} y={0} t={t - 62} text="> 1 HOUR" size={110} color="#FFE2A8" />
          </g>
        </g>
      } />
    </g>
  );
};

// ---------- B12: night rooftop: Jupiter, the brightest thing in the sky, swelling; Pip pointing at it ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.8;
  const pose = poseAt(t, [
    { f: 0, p: { x: 700, y: FEET - LEG_LEN * sc, scale: sc, yaw: 0.35, tilt: -4, headTilt: -10, armL: { a: 12, b: 6 }, armR: { a: 150, b: 8 }, handR: 'point' } },
    { f: 111, p: { armR: { a: 156, b: 6 } } },
  ]);
  const grow = 13 + 14 * easeOut(clamp((t - 30) / 50));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1040]]), kf(t, [[0, 520], [len, 400]]), kf(t, [[0, 1.0], [len, 1.45]]))}>
      <Rooftop t={t + 440} cityLit={2.5} sunGone={1} />
      <BrightPoint x={JUP.x} y={JUP.y} t={t} r={grow} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimBlue" shadow={0} />
    </g>
  );
};

// ---------- B13: the point fades; Pip lowers his arm and looks down ----------
export const B13: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.2;
  const pose = poseAt(t, [
    { f: 0, p: { x: 800, y: FEET + 60 - LEG_LEN * sc, scale: sc, yaw: 0.35, tilt: -5, headTilt: -12, armL: { a: 12, b: 6 }, armR: { a: 156, b: 6 }, handR: 'point' } },
    { f: 18, p: { armR: { a: 156, b: 6 } } },
    { f: 40, p: { armR: { a: 14, b: 8 }, headTilt: 4, tilt: 0 }, ease: easeOut },
  ]);
  const o = 1 - easeOut(clamp((t - 6) / 30));
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 980]]), 470, 1.45)}>
      <Rooftop t={t + 500} low={60} cityLit={2.5} sunGone={1} />
      <BrightPoint x={JUP.x} y={JUP.y} t={t} r={26} o={o} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [22, 'worried']]) }} rimId="rimBlue" shadow={0} />
    </g>
  );
};
