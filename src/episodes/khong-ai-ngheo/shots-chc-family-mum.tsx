import React from 'react';
import { Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Sparkle, AlarmClock, shake, ShotProps } from '../../engine';
import { DawnAlley, DawnMotes, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart, Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { Shopper } from '../tien-vo-han/che-world-icons-and-people';
import { MusicNote, MoneyTin } from './chc-family-props';

// Chapter C, "3 fun: family", part 1 (96.97-102.37 s): C1 the 4:00 AM alarm, C2 mum at the xôi cart in the dawn
// alley, C3 mum hums happily while the worried ghost of the old mum fades and the tin goes unwatched.

const MOM = LOOKS.mom;
const { x: CX, y: CY, s: CS } = CART;
const hip = (s: number) => CY - 140 * s;

// ---------- C1: macro: the alarm clock says 4:00 in the dark, the window behind it slowly warms to dawn ----------
export const C1: React.FC<ShotProps> = ({ t }) => {
  const len = 54; // the shot runs about 1.8 s; fixed so a chapter preview (first shot forced to frame 0) animates the same
  const dawn = clamp(t / len);
  const ring = shake(t, 4, 14, 5);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <defs>
        <linearGradient id="c1sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dawn > 0.5 ? '#3B3A6B' : '#1C2142'} />
          <stop offset="1" stopColor={dawn > 0.5 ? '#E59A78' : '#3A3358'} />
        </linearGradient>
        <linearGradient id="c1wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B4128" /><stop offset="1" stopColor="#3E2616" /></linearGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1500} fill="url(#c1sky)" />
      <rect x={-300} y={-300} width={2520} height={1500} fill="#E59A78" opacity={dawn * 0.5} />
      <g filter="url(#blur16)" opacity={0.8}>
        <rect x={520} y={110} width={880} height={520} rx={16} fill="#2A2D5A" stroke="#14172E" strokeWidth={18} />
        <rect x={540} y={130} width={840} height={480} fill="#F3B38C" opacity={0.25 + dawn * 0.7} />
      </g>
      <rect x={-300} y={760} width={2520} height={500} fill="url(#c1wood)" />
      <rect x={-300} y={752} width={2520} height={14} fill="#8A5A3C" />
      <g transform={`translate(${ring} 0)`}>
        <AlarmClock x={960} y={800} s={3.1} text="4:00" on={0.6 + 0.4 * Math.abs(Math.sin(t / 3))} />
        {/* ring marks either side of the clock */}
        {[-1, 1].map((d) => [0, 1].map((i) => (
          <path key={`${d}${i}`} d={`M ${960 + d * (440 + i * 50)} ${560 - i * 40} q ${d * 26} 40 0 80`} stroke="#FFE7B3" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t / 2 + i)} />
        )))}
      </g>
      <Glow x={960} y={600} r={620} o={0.28} kind="red" />
    </g>
  );
};

// ---------- C2: wide: the alley at dawn, mum at her cart, steam and motes in the low sun, one early customer ----------
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const scoop = Math.sin(t / 6);
  const mum: Pose = { ...basePose, x: CX + 45 * CS, y: hip(CS), scale: CS, yaw: 0.45, facing: 1, headTilt: 3 + 2 * Math.sin(t / 9), armL: { a: 12, b: -6 }, armR: { a: 40 + 14 * scoop, b: 30 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 670]]), 610, kf(t, [[0, 2.4], [len, 2.9]]))}>
      <DawnAlley t={t + 80} id="c2st" />
      <Hero look={MOM} pose={mum} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Shopper x={CX + 330 * CS} y={CY + 6} s={CS * 1.05} color="#4A6A8A" bob={Math.max(0, Math.sin(t / 7)) * 2} />
      <DawnMotes t={t} seed={7} />
    </g>
  );
};

// ---------- C3: "vì thích, không phải vì sợ": mum hums, happy; the worried ghost of the old mum, glancing at the tin, fades ----------
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const S = CS;
  const p = clamp((t - 14) / (len - 14));
  const real: Pose = { ...basePose, x: CX + 60 * S, y: hip(S), scale: S, yaw: 0.35, facing: 1, look: 0.5, headTilt: 3 + 2 * Math.sin(t / 10), armL: { a: 12, b: -6 }, armR: { a: 36 + 10 * Math.sin(t / 6), b: 30 }, ...faceAt(t, [[0, 'happy']]) };
  const ghost: Pose = { ...basePose, x: CX - 240 * S - easeOut(p) * 90 * S, y: hip(S), scale: S, yaw: -0.5, facing: -1, look: -0.9, headTilt: -6, armL: { a: 20, b: 40 }, armR: { a: 20, b: 40 }, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g transform={camT(CX + 30 * S, CY - 330 * S, kf(t, [[0, 3.6], [len, 3.9]]))}>
      <DawnAlley t={t + 80} id="c3st" blur={6} />
      <g opacity={t < 6 ? 0 : 0.6 * (1 - easeOut(p))}><Hero look={MOM} pose={ghost} rimId="rimL" shadow={0} /></g>
      <Hero look={MOM} pose={real} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      {/* the tin sits unwatched on the counter, soft and ignored */}
      <g filter="url(#blur3)" opacity={0.9}><MoneyTin x={CX - 120 * S} y={CY - 182 * S} s={0.5 * S * 1.6} rot={-4} /></g>
      {[0, 1, 2].map((i) => <MusicNote key={i} x={CX + 120 * S + i * 30} y={CY - 440 * S} t={t} seed={i} s={0.9} />)}
      <DawnMotes t={t} seed={9} />
    </g>
  );
};
