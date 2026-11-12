import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, backOut, LOOKS, Glow, Dust, FONT, Sparkle,
  Study, Desk, Mug, ShotProps,
} from '../../engine';
import { DawnAlley, DawnMotes, CART } from './che-dawn-alley-backdrop';
import { XoiCart, Steam, Wallet, BlackCard } from './che-xoi-cart-and-money-props';
import { Counter } from './shots-che-xoi-morning';
import { Shopper } from './che-world-icons-and-people';

// Chapter E, "ending" (236.5-246.4 s): E18 the card sleeps in a wallet, E19 Pip at his desk, the card unused beside him,
// E20 mum at the xôi cart, E21 the dawn alley wide, Pip eating her xôi, happy.

const PIP = LOOKS.pipHood;
const MOM = LOOKS.mom;
const { x: CX, y: CY, s: CS } = CART;

// ---------- E18: insert from above: a wallet on the table, the black card tucked in a slot, a glint sweeping over it ----------
export const E18: React.FC<ShotProps> = ({ t, len }) => {
  const pill = backOut(clamp((t - 4) / 9));
  const slide = 8 * Math.sin(t / 22);
  const shine = clamp((t - 30) / 30);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.14]]))}>
      <Counter t={t + 40} />
      <rect x={-100} y={-100} width={2120} height={1280} fill="#1A1020" opacity={0.3} />
      <Wallet x={960} y={560} s={1.45}>
        <g transform={`translate(143 ${20 + slide})`}><BlackCard x={0} y={-30} s={0.95} rot={-2} glow={0.2} shine={shine > 0 && shine < 1 ? shine : 0} /></g>
        <rect x={24} y={42} width={238} height={110} rx={10} fill="#573323" stroke="#2E1A12" strokeWidth={4} />
        <rect x={24} y={78} width={238} height={14} fill="#3E2318" opacity={0.7} />
      </Wallet>
      <g transform={`translate(960 150) scale(${pill})`}>
        <rect x={-250} y={-52} width={500} height={104} rx={52} fill="#2A1830" opacity={0.82} />
        <rect x={-250} y={-52} width={500} height={104} rx={52} fill="none" stroke="#F6EFE3" strokeWidth={3} opacity={0.8} />
        <text y={20} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={48} fill="#F6EFE3" letterSpacing={3}>ONE YEAR LATER</text>
      </g>
      <Dust t={t} seed={181} x0={300} y0={200} w={1300} h={700} n={20} o={0.4} />
    </g>
  );
};

// ---------- E19: medium: Pip at his desk, doing something he loves with a mug of tea; the card lies unused at the edge ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => {
  const pen = Math.sin(t / 3.5);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 1020, y: 712, yaw: -0.4, facing: -1, look: -0.5, headTilt: 4, armL: { a: 40 + 6 * pen, b: 40 }, armR: { a: 14, b: -6 } } },
    { f: 40, p: { headTilt: -3 } },
    { f: 64, p: { headTilt: 3 } },
  ]);
  const shine = clamp((t - 14) / 24);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 950]]), 610, kf(t, [[0, 2.0], [len, 2.25]]))}>
      <Study t={t + 100} id="e19" veil={0.4} />
      <Hero look={PIP} pose={{ ...pose, armL: { a: 52 + 8 * pen, b: 36 }, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <Desk x0={520} x1={1300} y={700} lamp={false} />
      <Mug x={1150} y={690} rot={0} f={t} />
      <BlackCard x={760} y={690} s={0.34} rot={6} glow={0.1} shine={shine > 0 && shine < 1 ? shine : 0} />
      <Glow x={1000} y={470} r={500} o={0.3} />
      <Dust t={t} seed={191} x0={700} y0={380} w={700} h={320} n={16} o={0.4} />
    </g>
  );
};

// ---------- E20: medium, mum at her cart scooping xôi into a leaf, a customer waiting, steam in the low sun ----------
export const E20: React.FC<ShotProps> = ({ t, len }) => {
  const sc = Math.sin(t / 6);
  const mum: Pose = poseAt(t, [
    { f: 0, p: { x: CX + 60 * CS, y: CY - 140 * CS, scale: CS, yaw: 0.35, facing: 1, headTilt: 2, armL: { a: 14, b: -6 }, armR: { a: 40, b: 40 } } },
    { f: 40, p: { headTilt: -3 } },
    { f: 76, p: { headTilt: 3 } },
  ]);
  const give = easeOut(clamp((t - 50) / 14));
  return (
    <g transform={camT(kf(t, [[0, CX + 130 * CS], [len, CX + 150 * CS]]), CY - 240 * CS, kf(t, [[0, 4.2], [len, 4.7]]))}>
      <DawnAlley t={t + 70} id="e20st" blur={6} />
      <Hero look={MOM} pose={{ ...mum, armR: { a: 44 + 16 * sc * (1 - give), b: 40 - 20 * give }, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Shopper x={CX + 400 * CS} y={CY + 30} s={CS * 1.35} color="#8A5A6A" bob={give * 3} />
      <Glow x={CX + 60 * CS} y={CY - 380 * CS} r={420} o={0.4} />
      <DawnMotes t={t} seed={20} />
    </g>
  );
};

// ---------- E21: wide: the alley at dawn, mum at the cart, Pip on a stool with a steaming packet of xôi, delighted ----------
export const E21: React.FC<ShotProps> = ({ t, len }) => {
  const bite = Math.max(0, Math.sin((t - 12) / 10));
  const pip: Pose = {
    ...basePose, x: CX + 420 * CS, y: CY - 68 * CS - 6, scale: CS, yaw: -0.85, facing: -1, tilt: -4, headTilt: 3 * Math.sin(t / 9),
    legL: { a: 84, b: -84 }, legR: { a: 74, b: -80 }, armL: { a: 20, b: 8 }, armR: { a: 66 + 10 * bite, b: 80 },
  };
  const mum: Pose = { ...basePose, x: CX + 60 * CS, y: CY - 140 * CS, scale: CS, yaw: 0.45, facing: 1, headTilt: 3, armL: { a: 14, b: -6 }, armR: { a: 40 + 12 * Math.sin(t / 6), b: 36 } };
  const px = CX + 420 * CS;
  return (
    <g transform={camT(kf(t, [[0, CX + 170 * CS], [len, CX + 230 * CS]]), CY - 230 * CS, kf(t, [[0, 2.7], [len, 2.95]]))}>
      <DawnAlley t={t + 110} id="e21st" />
      <Hero look={MOM} pose={{ ...mum, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <rect x={px - 26 * CS} y={CY - 66 * CS} width={52 * CS} height={66 * CS} rx={4 * CS} fill="#D9534F" stroke="#7A2A28" strokeWidth={2} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <g transform={`translate(${px - 58 * CS} ${CY - 190 * CS})`}>
        <rect x={-12} y={-8} width={34} height={20} rx={6} fill="#4C9A52" stroke="#2B5E32" strokeWidth={2} />
        <ellipse cx={-4} cy={-9} rx={13} ry={5} fill="#F4D35E" />
        <Steam x={0} y={-10} t={t} n={3} h={34} w={7} o={0.5} />
      </g>
      <Sparkle x={px - 90 * CS} y={CY - 260 * CS} t={t - 14} s={0.9} />
      <Sparkle x={px - 20 * CS} y={CY - 300 * CS} t={t - 40} s={0.8} />
      <DawnMotes t={t} seed={21} />
    </g>
  );
};
