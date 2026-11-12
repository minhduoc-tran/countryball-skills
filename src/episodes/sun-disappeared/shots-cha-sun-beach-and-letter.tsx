import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, Rooftop, Glow, Dust, ShotProps } from '../../engine';
import { BeachDusk } from '../nghin-dong-moi-giay/chb-travel-scenery-props';
import { Umbrella, Towel, Walker, Letter, Kite } from './cha-sun-props';

// Chapter A, the "nothing changes" shots (A14-A15: life carries on) and the letter on the doormat (A19).

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;

// ---------- A14: wide beach, everyone carries on (countdown chip ticking in the look) ----------
export const A14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 900]]), 650, kf(t, [[0, 0.95], [len, 1.1]]))}>
    <BeachDusk id="a14" t={t + 90} palms />
    <Walker x={150} y={870} t={t} s={0.6} seed={3} dir={1} />
    <Walker x={1600} y={880} t={t} s={0.65} seed={7} dir={-1} />
    <Walker x={700} y={840} t={t} s={0.42} seed={11} dir={1} />
    <Walker x={1100} y={850} t={t} s={0.45} seed={2} dir={-1} />
    <Umbrella x={1380} y={925} s={0.9} tilt={6} />
    <Towel x={1400} y={885} w={420} />
    <Umbrella x={560} y={925} s={0.9} />
    <Towel x={780} y={885} w={420} />
    <Kite x={300 + Math.sin(t / 20) * 30} y={230} t={t} s={0.8} />
  </g>
);

// ---------- A15: the roof, Pip stretches in the warm light, sister plays, all normal ----------
export const A15: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: 800, y: 820 - LEG_LEN * 0.9, scale: 0.9, yaw: 0.2, look: 0.3, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 } } },
    { f: 18, p: { armL: { a: 170, b: 8 }, armR: { a: 170, b: 8 }, headTilt: -6, blink: 1 }, ease: easeOut },
    { f: 36, p: { armL: { a: 20, b: 8 }, armR: { a: 20, b: 8 }, headTilt: 0, blink: 0 }, ease: easeOut },
  ]);
  const hop = Math.abs(Math.sin(t / 6)) * 18;
  const sis = poseAt(t, [{ f: 0, p: { x: 1150, y: 820 - LEG_LEN * 0.7 - hop, scale: 0.7, yaw: -0.4, look: -0.6, armL: { a: 120, b: 6 }, armR: { a: 120, b: 6 } } }]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 560, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <Rooftop t={t + 20} sunX={1500} sunY={600} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// ---------- A19: a letter slides through the door and lands on the mat; warm lamp-light, a little sad ----------
export const A19: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 6) / 24));
  const lx = 960 + 60 - 60 * k;
  const ly = 330 + 640 * k + (t > 30 ? Math.sin((t - 30) / 3) * 2 * Math.exp(-(t - 30) / 6) : 0);
  const rot = -22 * (1 - k) + 6 * k;
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 640]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <defs>
        <linearGradient id="a19floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A3426" /><stop offset="1" stopColor="#2A1D18" />
        </linearGradient>
      </defs>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#2F2A33" />
      {/* the door, slightly ajar at the bottom: a bright gap with a flap */}
      <rect x={560} y={-100} width={800} height={900} fill="#5A4636" stroke="#2A1A12" strokeWidth={8} />
      <rect x={640} y={80} width={290} height={300} rx={8} fill="none" stroke="#3E2E22" strokeWidth={6} />
      <rect x={990} y={80} width={290} height={300} rx={8} fill="none" stroke="#3E2E22" strokeWidth={6} />
      <rect x={620} y={290} width={680} height={40} fill="#C9A24A" stroke="#7A5A22" strokeWidth={4} rx={6} />
      <rect x={-100} y={800} width={2120} height={400} fill="url(#a19floor)" />
      <path d="M -100 800 L 2020 800" stroke="#1A100C" strokeWidth={6} />
      <Glow x={960} y={760} r={620} o={0.45} />
      <Dust t={t} seed={9} x0={700} y0={300} w={520} h={500} n={26} o={0.7} />
      {/* doormat */}
      <path d="M 640 960 L 1280 960 L 1340 1060 L 580 1060 Z" fill="#7A5A3A" stroke="#3E2A1A" strokeWidth={6} strokeLinejoin="round" />
      <path d="M 700 985 L 1220 985 M 690 1010 L 1230 1010 M 680 1035 L 1240 1035" stroke="#A58156" strokeWidth={5} />
      <Letter x={lx} y={Math.min(ly, 975) + 40} s={0.95} rot={rot} />
    </g>
  );
};
