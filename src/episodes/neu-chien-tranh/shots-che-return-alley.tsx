import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, walkPose, kf, clamp, easeOut, camT, LOOKS, Glow, Dust, Foreground, Sparkle, ShotProps,
} from '../../engine';
import { DawnAlley, DawnMotes, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart, Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { Birds } from './che-props-field-and-deminers';
import { CafeFront, Backpack, MessagePhone } from './che-props-cafe-coffee-and-backpack';

// Chapter E, "return" part 1 (248.3-259.8 s, look "peace"): E11 the family walks back into the old alley with their bags,
// E12 the old cafe, shuttered and dusty, E13 the alley at first light, E14 Pip smells xôi on the air, E15 mum sets up her
// cart, E16 the phone buzzes: Mo's message "Tao về rồi".

const PIP = LOOKS.pipHood;
const MOM = LOOKS.mom;
const SIS = LOOKS.sis;
const { x: CX, y: CY, s: CS } = CART;

// ---------- E11: wide: Pip, mum and sis walk into the alley carrying their bags, the street quiet and golden ----------
export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const ph = t * 0.5;
  const walker = (x: number, s: number, extra: Partial<Pose> = {}) => walkPose(x, ph, CY, s, { yaw: 0.8, ...extra }, 1);
  const x0 = CX - 60 + t * 6;
  const pip = walker(x0 + 120 * CS, CS);
  const mum = walker(x0, CS);
  const sis = walker(x0 + 250 * CS, CS * 0.7, { armL: { a: 20, b: 20 } });
  const bag = (p: Pose, col: string, k = 0.55) => <Backpack x={p.x - 30 * p.scale} y={p.y + 8 * p.scale} s={p.scale * k} rot={-6} col={col} shadow={0} />;
  return (
    <g transform={camT(kf(t, [[0, CX + 120], [len, CX + 380]]), CY - 150 * CS, kf(t, [[0, 2.1], [len, 2.4]]))}>
      <DawnAlley t={t + 10} id="e11st" />
      {bag(mum, '#4E7A8C')}
      <Hero look={MOM} pose={{ ...mum, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      {bag(pip, '#D9733A')}
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} rimId="rimR" shadow={0.5} />
      {bag(sis, '#E87AA0', 0.6)}
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <DawnMotes t={t} seed={11} />
    </g>
  );
};

// ---------- E12: the old cafe: shutter down, a faded sign, dust; Pip stands before it, quiet ----------
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 380, y: 880 - 140, scale: 1, yaw: 0.55, facing: 1, look: 0.7, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, sway: 3 } },
    { f: len, p: { headTilt: 6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 760]]), 560, kf(t, [[0, 1.0], [len, 1.18]]))}>
      <g transform="translate(-300 -60) scale(1.3)"><DawnAlley t={t + 50} id="e12st" blur={10} /></g>
      <rect x={-400} y={-300} width={2720} height={1700} fill="#2A1C24" opacity={0.28} />
      <CafeFront x={1000} y={880} s={1.0} t={t} id="e12cf" />
      <Glow x={1300} y={420} r={600} o={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <Dust t={t} seed={121} x0={200} y0={200} w={1300} h={700} n={34} o={0.55} />
    </g>
  );
};

// ---------- E13: the alley empty at first light, the sun rising at its end, birds crossing; a slow push toward the sun ----------
export const E13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 960]]), kf(t, [[0, 600], [len, 540]]), kf(t, [[0, 1.0], [len, 1.22]]))}>
    <DawnAlley t={t + 200} id="e13st" />
    <Glow x={960} y={470} r={kf(t, [[0, 500], [len, 800]])} o={kf(t, [[0, 0.25], [len, 0.55]])} />
    <Birds t={t + 20} seed={13} x0={0} y0={120} w={1920} h={160} n={4} col="#4A2E3A" />
    <DawnMotes t={t} seed={13} />
  </g>
);

// ---------- E14: medium: Pip in the alley, eyes closed, face lifted: the smell of xôi drifts to him in curling lines ----------
export const E14: React.FC<ShotProps> = ({ t, len }) => {
  const px = CX + 480 * CS;
  const lift = easeOut(clamp(t / 20));
  const pose: Pose = {
    ...basePose, x: px, y: CY - 140 * CS, scale: CS, yaw: -0.6, facing: -1, tilt: -3 * lift, headTilt: -6 * lift, blink: 0.9 * lift,
    armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, sway: 3,
  };
  const nose = { x: px - 40 * CS, y: CY - 306 * CS };
  const wisp = (k: number) => {
    const ph = ((t * 0.6 + k * 20) % 60) / 60;
    const x0 = nose.x - 420 * CS + ph * 120 * CS;
    return (
      <path key={k} d={`M ${x0} ${nose.y + (k - 1) * 22 * CS} q ${60 * CS} ${-70 * CS} ${130 * CS} ${-20 * CS} t ${130 * CS} ${-10 * CS}`} stroke="#FFE2A8" strokeWidth={16 * CS} strokeLinecap="round" fill="none" opacity={Math.sin(ph * Math.PI) * 0.95} filter="url(#blur3)" />
    );
  };
  return (
    <g transform={camT(kf(t, [[0, px - 70 * CS], [len, px - 100 * CS]]), CY - 300 * CS, kf(t, [[0, 6.0], [len, 6.8]]))}>
      <DawnAlley t={t + 260} id="e14st" blur={6} />
      {[0, 1, 2].map(wisp)}
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [22, 'happy']]) }} rimId="rimR" shadow={0} />
      <Glow x={nose.x - 100 * CS} y={nose.y} r={360} o={0.3} />
      <DawnMotes t={t} seed={14} />
    </g>
  );
};

// ---------- E15: medium: mum sets up the cart, lifting the lid of the steamer; steam pours out into the low sun ----------
export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const lid = easeOut(clamp((t - 6) / 12));
  const mum: Pose = poseAt(t, [
    { f: 0, p: { x: CX + 60 * CS, y: CY - 140 * CS, scale: CS, yaw: 0.35, facing: 1, headTilt: 2, armL: { a: 14, b: -6 }, armR: { a: 30, b: 30 } } },
    { f: 14, p: { armR: { a: 70, b: 50 }, headTilt: -3 }, ease: easeOut },
    { f: 34, p: { armR: { a: 40, b: 40 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, CX + 120 * CS], [len, CX + 150 * CS]]), CY - 240 * CS, kf(t, [[0, 4.0], [len, 4.5]]))}>
      <DawnAlley t={t + 300} id="e15st" blur={6} />
      <Hero look={MOM} pose={{ ...mum, ...faceAt(t, [[0, 'neutral'], [16, 'happy']]) }} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Steam x={CX - 80 * CS} y={CY - 290 * CS} t={t} n={7} h={260 * CS * lid + 40} w={30 * CS} o={0.8 * lid} seed={5} />
      <Glow x={CX + 60 * CS} y={CY - 380 * CS} r={420} o={0.45} />
      <Sparkle x={CX - 30 * CS} y={CY - 330 * CS} t={t - 20} s={0.8} />
      <DawnMotes t={t} seed={15} />
    </g>
  );
};

// ---------- E16: insert: a phone on a stool buzzes, then Mo's message pops: "Tao về rồi" ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const buzz = t < 30 ? 1 : 0;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), kf(t, [[0, 560], [len, 530]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g filter="url(#blur16)"><g transform="translate(-400 -200) scale(1.6)"><DawnAlley t={t + 320} id="e16st" cart /></g></g>
      <rect x={-400} y={-300} width={2720} height={1700} fill="#2A1830" opacity={0.3} />
      <Glow x={960} y={540} r={700} o={0.25} />
      <MessagePhone x={960} y={560} w={420} t={t} at={30} rot={-6 + (buzz ? Math.sin(t * 3) * 0.8 : 0)} buzz={buzz} />
      <Sparkle x={1240} y={420} t={t - 34} s={1.3} />
      <Sparkle x={700} y={640} t={t - 42} s={1.0} />
      <Foreground blur={10}>
        <path d="M -40 1100 Q 400 980 900 1090 V 1160 H -40 Z" fill="#3A2A22" opacity={0.7} />
      </Foreground>
    </g>
  );
};
