import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, backOut, LOOKS, Glow, FONT, Sparkle, joints, toWorld, rnd, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { DawnAlley, DawnMotes, CART } from './che-dawn-alley-backdrop';
import { XoiCart, Steam, Note, BlackCard } from './che-xoi-cart-and-money-props';
import { Shopper } from './che-world-icons-and-people';

// Chapter E, "help mum" (199.8-209.5 s): E1 the dawn alley wide, E2 Pip serving a customer, E3 the notes land in his
// mitten (insert), E4 "15.000 đ", E5 the notes outweigh the black card on a little scale.

const PIP = LOOKS.pipHood;
const MOM = LOOKS.mom;
const { x: CX, y: CY, s: CS } = CART;
const hip = (s: number) => CY - 140 * s;

// ---------- E1: wide, the alley at dawn: mum and Pip at the xôi cart, two customers waiting, steam in the low sun ----------
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const scoop = Math.sin(t / 5);
  const mum: Pose = { ...basePose, x: CX + 45 * CS, y: hip(CS), scale: CS, yaw: 0.45, facing: 1, headTilt: 3, armL: { a: 12, b: -6 }, armR: { a: 40 + 14 * scoop, b: 30 }, ...faceAt(t, [[0, 'happy']]) };
  const pip: Pose = poseAt(t, [
    { f: 0, p: { x: CX + 150 * CS, y: hip(CS), scale: CS, yaw: 0.5, facing: 1, armL: { a: 12, b: -6 }, armR: { a: 20, b: 10 } } },
    { f: 20, p: { armR: { a: 74, b: 6 } }, ease: easeOut },
    { f: 44, p: { armR: { a: 30, b: 14 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 690], [len, 670]]), 620, kf(t, [[0, 2.5], [len, 2.9]]))}>
      <DawnAlley t={t + 40} id="e1st" />
      <Hero look={MOM} pose={mum} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Shopper x={CX + 330 * CS} y={CY + 6} s={CS * 1.05} color="#4A6A8A" bob={Math.max(0, Math.sin(t / 7)) * 2} />
      <Shopper x={CX + 450 * CS} y={CY + 24} s={CS * 1.0} color="#8A5A6A" bob={Math.max(0, Math.sin(t / 6 + 2)) * 2} />
      <DawnMotes t={t} seed={5} />
    </g>
  );
};

// ---------- E2: medium, Pip takes a note from a customer and hands over a packet; mum scoops beside him ----------
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const S = CS * 1.0;
  const pip: Pose = poseAt(t, [
    { f: 0, p: { x: CX + 175 * S, y: hip(S), scale: S, yaw: 0.45, facing: 1, look: 0.5, armL: { a: 12, b: -6 }, armR: { a: 20, b: 10 } } },
    { f: 18, p: { armR: { a: 78, b: 4 }, headTilt: 3 }, ease: easeOut },
    { f: 36, p: { armR: { a: 30, b: 18 }, headTilt: -2 } },
  ]);
  const mum: Pose = { ...basePose, x: CX + 10 * S, y: hip(S), scale: S, yaw: 0.45, facing: 1, headTilt: 2, armL: { a: 12, b: -6 }, armR: { a: 36 + 12 * Math.sin(t / 5), b: 30 } };
  const hand = toWorld(pip, joints(pip).armR.end);
  const give = easeOut(clamp(t / 16));
  const noteX = hand.x + (1 - clamp((t - 18) / 6)) * 70 * S + 20 * S;
  return (
    <g transform={camT(CX + 150 * S, CY - 230 * S, kf(t, [[0, 4.6], [len, 5.0]]))}>
      <DawnAlley t={t + 40} id="e2st" blur={6} />
      <Hero look={MOM} pose={{ ...mum, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [18, 'happy']]) }} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Shopper x={CX + 360 * S} y={CY + 30} s={S * 1.25} color="#4A6A8A" bob={give * 3} />
      <g opacity={give}>
        <path d={`M ${CX + 330 * S} ${CY - 170 * S} Q ${CX + 280 * S} ${CY - 130 * S} ${noteX + 18} ${hand.y - 4}`} stroke="#4A6A8A" strokeWidth={16 * S} strokeLinecap="round" fill="none" />
        <Note x={noteX} y={hand.y - 12} v="10.000" s={0.2 * S * 3} rot={-8} />
      </g>
      <Glow x={CX + 150 * S} y={CY - 360 * S} r={380} o={0.35} />
    </g>
  );
};

/** Warm wooden counter seen from above, for the notes inserts. */
export const Counter: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <linearGradient id="e3wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#A56E48" /><stop offset="1" stopColor="#6B4128" /></linearGradient>
    </defs>
    <rect x={-100} y={-100} width={2120} height={1280} fill="url(#e3wood)" />
    {[180, 400, 640, 860, 1060].map((y, i) => <path key={i} d={`M -100 ${y} H 2020`} stroke="#4A2E20" strokeWidth={4} opacity={0.5} />)}
    <Glow x={1500} y={300} r={700} o={0.4} />
    <Steam x={260} y={1120} t={t} n={4} h={380} w={40} o={0.3} />
  </g>
);

// ---------- E3: insert: the customer's hand gives two notes; Pip's mitten closes on them ----------
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const meet = easeOut(clamp(t / 20));
  const away = easeOut(clamp((t - 30) / 22));
  const nx = 520 + 330 * meet + 150 * away;
  const ny = 560 + 60 * away;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Counter t={t} />
      {/* the customer's hand: a sleeve from the left and a hand pinching the notes */}
      <g opacity={1 - clamp((t - 38) / 12)}>
        <path d={`M -100 640 Q 200 620 ${nx - 150} 570`} stroke="#4A6A8A" strokeWidth={130} strokeLinecap="round" fill="none" />
        <ellipse cx={nx - 120} cy={ny - 6} rx={70} ry={46} fill="#D9B896" stroke="#8A6A4A" strokeWidth={4} />
      </g>
      <Note x={nx} y={ny - 30} v="10.000" s={1.35} rot={-6} />
      <Note x={nx + 70} y={ny + 30} v="5.000" s={1.35} rot={5} />
      <InsertArm x={nx + 290 - 20 * away} y={ny + 20} fx={2150} fy={980 - 60 * meet} rot={80} />
      <Sparkle x={nx + 60} y={ny - 120} t={t - 22} s={1.3} />
    </g>
  );
};

// ---------- E4: insert: the notes held up, a big "15.000 đ" tag pops on ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp((t - 4) / 8));
  const bob = Math.sin(t / 6) * 5;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Counter t={t + 30} />
      <Note x={800} y={500 + bob} v="10.000" s={1.6} rot={-7} />
      <Note x={1010} y={580 + bob} v="5.000" s={1.6} rot={6} />
      <InsertArm x={1330} y={640 + bob} fx={2150} fy={1020} rot={80} />
      <g transform={`translate(960 214) scale(${pop})`}>
        <rect x={-290} y={-88} width={580} height={150} rx={75} fill="#2A1830" opacity={0.82} />
        <rect x={-290} y={-88} width={580} height={150} rx={75} fill="none" stroke="#FFE27A" strokeWidth={6} />
        <text y={34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={104} fill="#FFE27A">15.000 đ</text>
      </g>
      <Sparkle x={680} y={330} t={t - 8} s={1.4} />
      <Sparkle x={1250} y={380} t={t - 14} s={1.1} />
    </g>
  );
};

// ---------- E5: the little scale: the two notes outweigh the black card, the pan drops and the card bounces up ----------
export const E5: React.FC<ShotProps> = ({ t, len }) => {
  const tip = easeOut(clamp((t - 10) / 22));
  const wob = Math.sin(t / 3) * 3 * Math.exp(-Math.max(0, t - 30) / 8);
  const ang = (1 - tip) * -2 + tip * 13 + wob; // + : right side down
  const rad = (ang * Math.PI) / 180;
  const L = 380;
  const px = 960, py = 380;
  const rx = px + L * Math.cos(rad), ry = py + L * Math.sin(rad);
  const lx = px - L * Math.cos(rad), ly = py - L * Math.sin(rad);
  const pan = (x: number, y: number) => (
    <g>
      <path d={`M ${x} ${y} L ${x - 110} ${y + 190} M ${x} ${y} L ${x + 110} ${y + 190}`} stroke="#E9D8A0" strokeWidth={4} />
      <path d={`M ${x - 140} ${y + 190} H ${x + 140} Q ${x + 120} ${y + 240} ${x} ${y + 240} Q ${x - 120} ${y + 240} ${x - 140} ${y + 190} Z`} fill="#C9A85A" stroke="#7A5C20" strokeWidth={5} />
    </g>
  );
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <defs><radialGradient id="e5bg" cx="0.5" cy="0.45" r="0.8"><stop offset="0" stopColor="#FFD9A0" /><stop offset="1" stopColor="#6B3A4A" /></radialGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#e5bg)" />
      <path d={`M ${px} ${py} V 880`} stroke="#6B4128" strokeWidth={22} />
      <path d="M 780 900 H 1140 L 1100 860 H 820 Z" fill="#6B4128" stroke="#3A2214" strokeWidth={5} />
      <path d={`M ${lx} ${ly} L ${rx} ${ry}`} stroke="#8B5A3C" strokeWidth={26} strokeLinecap="round" />
      <circle cx={px} cy={py} r={22} fill="#C9A85A" stroke="#7A5C20" strokeWidth={5} />
      {pan(lx, ly)}
      {pan(rx, ry)}
      <BlackCard x={lx} y={ly + 166 - 22 * Math.sin(clamp((t - 14) / 16) * Math.PI)} s={0.78} rot={-4} glow={0.4} />
      <Note x={rx - 56} y={ry + 176} v="10.000" s={0.6} rot={-6} />
      <Note x={rx + 44} y={ry + 160} v="5.000" s={0.6} rot={7} />
      <Sparkle x={rx} y={ry + 90} t={t - 26} s={1.5} />
      <g opacity={clamp((t - 30) / 6)} transform={`translate(${rx + 190} ${ry - 20}) scale(${backOut(clamp((t - 30) / 8))})`}>
        <path d="M 0 -10 C -30 -50 -80 -10 0 50 C 80 -10 30 -50 0 -10 Z" fill="#FF6A7A" stroke="#7A1E2E" strokeWidth={5} />
      </g>
    </g>
  );
};
