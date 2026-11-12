import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeInOut, backOut, rnd, camT, LOOKS, HEAD, Street, streetStand, joints, toWorld,
  FocusRings, Glow, ShotProps, FONT,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { PhoneFrame, SignalBars, BatteryIcon, AppIcon, WalletScreen, AppKind } from './chb-phone-props';

// Chapter B, "day one" the phone (B6-B9): the e-wallet fails (B6), Pip understands his whole life is in a phone (B7), the
// four apps that are his life (B8), and the phone that needs power and a network: 7% and no bars (B9).

const PIP = LOOKS.pipHood;

/** A dark table under a soft pool of light, for the phone inserts. */
const DarkDesk: React.FC<{ id: string; glow?: 'warm' | 'cool' }> = ({ id, glow = 'cool' }) => (
  <g>
    <defs>
      <radialGradient id={`${id}bg`} cx="0.5" cy="0.5" r="0.75"><stop offset="0" stopColor="#2A2646" /><stop offset="1" stopColor="#0B0A14" /></radialGradient>
    </defs>
    <rect x={-300} y={-300} width={2520} height={1700} fill={`url(#${id}bg)`} />
    <Glow x={960} y={540} r={760} kind={glow} o={0.35} />
  </g>
);

/** The status strip at the top of the screen: signal bars, a clock, the battery. */
const StatusStrip: React.FC<{ t: number; bars: number; cross?: number; pct: number }> = ({ t, bars, cross = 0, pct }) => (
  <g>
    <SignalBars x={-112} y={-256} level={bars} cross={cross} s={0.9} />
    <text x={0} y={-250} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#F6EFE3">9:41</text>
    <BatteryIcon x={62} y={-246} pct={pct} t={t} s={0.8} showText={false} />
  </g>
);

const GRID: { kind: AppKind; x: number; y: number }[] = [
  { kind: 'money', x: -68, y: -75 }, { kind: 'map', x: 68, y: -75 }, { kind: 'school', x: -68, y: 65 }, { kind: 'chat', x: 68, y: 65 },
];

/** The lock-screen with the four apps: `pops` are the frames each pops at; `dim` fades them. */
const HomeScreen: React.FC<{ t: number; pops: number[]; dim?: number; fade?: number }> = ({ t, pops, dim = 0, fade = 0 }) => (
  <g>
    <rect x={-132} y={-285} width={264} height={570} fill="#2C3A5E" />
    <rect x={-132} y={-285} width={264} height={570} fill="#5A3E7A" opacity={0.35} />
    <circle cx={90} cy={-170} r={120} fill="#FF9A6A" opacity={0.12} />
    {GRID.map((g, i) => (
      <AppIcon key={g.kind} kind={g.kind} x={g.x} y={g.y + Math.sin(t / 9 + i * 1.7) * 2.5 * clamp((t - pops[i]) / 10)} pop={clamp((t - pops[i]) / 7)} o={1 - 0.65 * dim} />
    ))}
    <rect x={-132} y={-285} width={264} height={570} fill="#000" opacity={fade} />
  </g>
);

// ---------- B6: insert: a finger taps pay in the e-wallet; LỖI KẾT NỐI slams in with a glitch; then the signal bars die ----------
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const err = t >= 20 ? t - 20 : -1;
  const bars = t < 40 ? 4 : 0;
  const cross = clamp((t - 40) / 4);
  const fx = kf(t, [[0, 1350], [7, 930], [11, 930], [26, 1500]]);
  const fy = kf(t, [[0, 1000], [7, 640], [11, 650], [26, 1050]]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <DarkDesk id="sb6" />
      <PhoneFrame x={960} y={540} s={1.5} id="sb6p" glow={err >= 0 ? 'red' : 'cool'}>
        <WalletScreen t={t} err={err} />
        <StatusStrip t={t} bars={bars} cross={cross} pct={52} />
      </PhoneFrame>
      <InsertArm x={fx} y={fy} fx={2150} fy={1300} rot={-24} s={3.6} width={96} point />
    </g>
  );
};

// ---------- B7: medium: Pip looks at his phone and it lands: his whole life is in there ----------
export const B7: React.FC<ShotProps> = ({ t, len }) => {
  const at = streetStand(0.2, 3.7);
  const pose = poseAt(t, [
    { f: 0, p: { x: at.x, y: at.y, scale: at.scale, yaw: 0.5, look: 0.5, armR: { a: 48, b: 78 }, armL: { a: 8, b: 6 } } },
    { f: 30, p: { headTilt: 0 } },
    { f: 34, p: { headTilt: -3, look: 0.1, armR: { a: 52, b: 82 } } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const head = toWorld(pose, { x: 0, y: HEAD.y });
  const shock = t >= 32;
  const sh = shock && t < 38 ? Math.sin((t - 32) * 5) * 3 : 0;
  return (
    <g transform={`translate(${sh} 0) ${camT(at.x + 20, at.y - 30 * at.scale, kf(t, [[0, 2.5], [len, 2.9]]))}`}>
      <Street t={t + 90} id="sb7" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [32, 'shock']]) }} rimId="rimBlue" shadow={0.5} />
      <PhoneFrame x={hand.x + 4} y={hand.y - 26 * at.scale} s={at.scale * 0.34} id="sb7p" glow="cool" glowO={0.7}>
        <HomeScreen t={t} pops={[0, 0, 0, 0]} />
      </PhoneFrame>
      <g transform={`translate(${head.x} ${head.y}) scale(0.4) translate(${-head.x} ${-head.y})`}>
        <FocusRings x={head.x} y={head.y} t={t - 32} r0={80} />
      </g>
    </g>
  );
};

// ---------- B8: insert: the four apps pop onto the screen one by one: money, map, school, family chat ----------
export const B8: React.FC<ShotProps> = ({ t, len }) => {
  const pops = [4, 14, 24, 34];
  const ring = t - 40;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <DarkDesk id="sb8" glow="warm" />
      <FocusRings x={960} y={540} t={ring} r0={330} color="#FFD9A8" />
      <PhoneFrame x={960} y={540} s={1.4} id="sb8p" glow="warm" glowO={0.6}>
        <HomeScreen t={t} pops={pops} />
        <StatusStrip t={t} bars={4} pct={61} />
      </PhoneFrame>
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={260 + rnd(8, i) * 1400} cy={140 + rnd(9, i) * 800 - ((t * (0.3 + rnd(2, i))) % 60)} r={3 + rnd(4, i) * 4} fill="#FFD9A8" opacity={0.18 + 0.2 * Math.sin(t / 10 + i)} />
      ))}
    </g>
  );
};

// ---------- B9: insert: the phone needs power (7%, red, blinking) and a network (the bars drop to none) ----------
export const B9: React.FC<ShotProps> = ({ t, len }) => {
  const batK = backOut(clamp((t - 37) / 7));
  const sigK = backOut(clamp((t - 55) / 7));
  const level = t < 58 ? 4 : Math.max(0, 4 - Math.floor((t - 58) / 3));
  const cross = clamp((t - 70) / 4);
  const dim = clamp((t - 36) / 30);
  const fade = clamp((t - 60) / 15) * 0.65;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <DarkDesk id="sb9" />
      <PhoneFrame x={960} y={560} s={1.15} id="sb9p" glow="red" glowO={0.35 * clamp((t - 37) / 10)}>
        <HomeScreen t={t} pops={[-30, -30, -30, -30]} dim={dim} fade={fade} />
        <StatusStrip t={t} bars={level} cross={cross} pct={t < 37 ? 31 - (t / 37) * 24 : 7} />
      </PhoneFrame>
      <g transform={`translate(330 560) scale(${batK})`}>
        <BatteryIcon x={0} y={0} pct={7} t={t} s={3.4} />
      </g>
      <g transform={`translate(1470 650) scale(${sigK})`}>
        <SignalBars x={0} y={0} level={level} cross={cross} s={4.2} />
      </g>
    </g>
  );
};
