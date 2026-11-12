import React from 'react';
import {
  Hero, Pose, faceAt, kf, clamp, easeOut, camT, walkPose, Sparkle, Glow, Rays, Dust, Tag, FloatLabel, ShotProps, rnd,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { PIP, DeskWorld, typingPip, seatedPip, LaptopFront, SlideApp, TimerPill } from './chd-desk-props';
import { WarmBackdrop, Tips, Bulb } from './chd-card-props';
import { HillSky } from './chd-country-props';

// Chapter D, "6 fix: two minutes" (176.19-186.40 s): D1 the bulb pops, D2 the three tips, D3 the 2:00 timer, D4 the laptop
// opens, D5 one sentence typed, D6 the boulder starts rolling, D7 the timer passes 2:00, D8 slides fill with planets.

const SENTENCE = 'Hệ Mặt Trời có 8 hành tinh.';

// ---------- D1: wide: Pip at his desk, worried, then the bulb pops over his head ----------
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = seatedPip({ headTilt: 2, look: 0.4, armR: { a: 10, b: 20 }, armL: { a: 10, b: 20 } });
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1010]]), kf(t, [[0, 610], [len, 540]]), kf(t, [[0, 1.2], [len, 1.5]]))}>
      <DeskWorld t={t} id="d1r" pose={pose} face={faceAt(t, [[0, 'tired'], [18, 'happy']])} open={0} lamp={1} />
      <Bulb x={950} y={270} t={t - 18} s={0.9} />
      <Sparkle x={1040} y={380} t={t - 22} s={0.8} />
    </g>
  );
};

// ---------- D2: the three tips pop in (1, 2, 3); the first lights up ----------
export const D2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
    <WarmBackdrop id="d2w" t={t} />
    <Tips x={960} y={540} t={t} active={1} s={1.45} />
  </g>
);

// ---------- D3: "2:00" huge, the ring sweeps round it ----------
export const D3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 0.92], [len, 1.06]]))}>
    <WarmBackdrop id="d3w" t={t} />
    <Rays x={960} y={540} t={t} len={900} n={12} o={0.25} />
    <g transform={`translate(0 ${-8 * Math.abs(Math.sin(t / 6))})`}>
      <TimerPill x={960} y={540} text="2:00" s={2.6 * (1 + 0.1 * (1 - easeOut(clamp(t / 8))))} ring={easeOut(clamp(t / 20))} w={380} />
    </g>
    <Sparkle x={1380} y={330} t={t - 14} s={1.2} />
  </g>
);

// ---------- D4: insert: the laptop lid swings open, a sleeve reaches in ----------
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp((t - 2) / 14));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.08]]))}>
      <WarmBackdrop id="d4w" t={t} memory />
      <LaptopFront x={960} y={860} w={1000} open={open} id="d4l">{(w, h) => <SlideApp w={w} h={h} t={t} text="" thumbs={1} />}</LaptopFront>
      <InsertArm x={1380 - 100 * open} y={470 + 220 * (1 - open)} fx={2100} fy={900} rot={-20} s={4.2} width={96} />
    </g>
  );
};

// ---------- D5: the screen close: ONE sentence types itself, a tick pops ----------
export const D5: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(SENTENCE.length, Math.max(0, Math.floor((t - 3) * 0.85)));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <WarmBackdrop id="d5w" t={t} memory />
      <g transform="translate(160 140)">
        <SlideApp w={1600} h={860} t={t} text={SENTENCE.slice(0, n)} thumbs={1} />
      </g>
      <Tag x={1500} y={110} t={t - 28} text="1 CÂU" mark="check" markT={6} w={300} />
    </g>
  );
};

// ---------- D6: the boulder: heavy, it won't move... then one more push and it rolls ----------
const groundY = (x: number) => 790 + (x - 700) * 0.06;
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const go = Math.max(0, t - 24);
  const bx = 1050 + 0.5 * 1.15 * go * go + (go === 0 ? Math.sin(t * 2.3) * 2.5 : 0);
  const R = 125;
  const by = groundY(bx) - R;
  const rolling = go > 0;
  const pose: Pose = rolling
    ? walkPose(bx - 270, t * 0.7, groundY, 1.4, { tilt: 8, armL: { a: -30, b: 10 }, armR: { a: 20, b: 10 }, ...faceAt(t, [[0, 'happy']]) })
    : walkPose(bx - 200, 0.2 + Math.sin(t * 0.5) * 0.18, groundY, 1.4, { tilt: 17, headTilt: 5, armL: { a: -84, b: 0 }, armR: { a: 84, b: 0 }, ...faceAt(t, [[0, 'worried']]) });
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1250]]), 600, 1.05)}>
      <HillSky id="d6s" t={t} ground dusk={0.2} sx={1500} sy={300} />
      <g transform={`translate(${bx} ${by}) rotate(${((bx - 1050) / R) * 57.3})`}>
        <circle r={R} fill="#8C8794" stroke="#241E2E" strokeWidth={7} />
        <path d="M -80 -20 L -40 -10 L -30 30 M 30 -90 L 50 -50 L 90 -40 M -20 80 L 20 60 L 60 80" stroke="#5E5A68" strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle r={R} cx={-24} cy={-26} fill="#FFF" opacity={0.1} />
      </g>
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {!rolling ? <FloatLabel x={bx - 140} y={by - 150} t={((t % 20) + 20) % 20} text="…" size={70} color="#FFE27A" /> : null}
      {rolling && go < 16 ? Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={bx - 90 - go * 6 - i * 14} cy={groundY(bx) - 8 - rnd(3, i) * 24 * (go / 16)} r={10 + i * 3} fill="#D9C9A8" opacity={0.5 * (1 - go / 16)} />) : null}
      {go > 0 ? <Sparkle x={bx - 30} y={by - R - 40} t={go} s={0.9} /> : null}
    </g>
  );
};

// ---------- D7: the timer on the desk passes 2:00 and keeps counting; Pip keeps typing ----------
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const sec = 112 + t * 0.32;
  const past = sec >= 120;
  return (
    <g transform={camT(kf(t, [[0, 1130], [len, 1180]]), 540, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <DeskWorld t={t + 20} id="d7r" pose={typingPip(t, { headTilt: 4 })} face={faceAt(t, [[0, 'neutral'], [12, 'happy']])} open={1} veil={0.4} />
      <TimerPill x={1240} y={430} text={fmt(sec)} s={0.5} color={past ? '#5BE08A' : '#FFE27A'} w={340} />
      <Sparkle x={1340} y={400} t={t - 25} s={0.8} />
      {past ? <FloatLabel x={1240} y={360} t={t - 25} text="+" size={60} color="#5BE08A" /> : null}
    </g>
  );
};

// ---------- D8: the slide app: thumbnails fill with planets one after another, the timer still counting ----------
export const D8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <WarmBackdrop id="d8w" t={t} memory />
    <g transform="translate(160 110)">
      <SlideApp w={1600} h={880} t={t} text="Hệ Mặt Trời" thumbs={1 + Math.min(5, t / 6)} planetOn={clamp((t - 6) / 10)} caret={false} />
    </g>
    <TimerPill x={1570} y={96} text={fmt(150 + t * 4)} s={0.4} color="#5BE08A" w={340} />
    <Dust t={t} seed={5} x0={300} y0={200} w={1300} h={600} n={16} o={0.35} />
    <Glow x={960} y={560} r={760} o={0.15} />
  </g>
);
