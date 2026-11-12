import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Dust, Sparkle, Street, streetStand, walkPose, Bedroom, BedDuvet, bedSit, LEG_LEN, rnd, ShotProps,
} from '../../engine';
import { DawnAlley, DawnMotes, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { Shopper } from '../tien-vo-han/che-world-icons-and-people';
import { ZzzFloat } from '../nghin-dong-moi-giay/chc-props-hammock-and-desk';

// Chapter E, "7 insight" freedom (252.1-258.5 s), look "peace": E20 Pip arms wide, E21 sis skips down a lit street at
// night, E22 mum's xôi cart open at dawn, E23 Pip sleeps soundly in the moonlight.

const PIP = LOOKS.pipHood, SIS = LOOKS.sis, MOM = LOOKS.mom;

// ---------- E20: Pip walks toward us down the golden street, arms flung wide, birds crossing the sky ----------
export const E20: React.FC<ShotProps> = ({ t, len }) => {
  const g = streetStand(0.2, kf(t, [[0, 6.0], [len, 4.6]]), { k: 1.6 });
  const wide = easeOut(clamp(t / 10));
  const pose: Pose = { ...basePose, x: g.x, y: g.y - Math.abs(Math.sin(t / 4)) * 6 * g.scale, scale: g.scale, yaw: 0.0, headTilt: -6 + Math.sin(t / 9) * 3, tilt: Math.sin(t / 9) * 2,
    armL: { a: 20 + 80 * wide, b: 0 }, armR: { a: 20 + 80 * wide, b: 0 }, legL: { a: 8 * Math.sin(t / 4), b: 0 }, legR: { a: -8 * Math.sin(t / 4), b: 0 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 600]]), kf(t, [[0, 1.9], [len, 1.7]]))}>
      <Street t={t + 200} id="e20st" market={0.7} veil={0.2} light="green" />
      {[0, 1, 2, 3].map((i) => {
        const bx = 300 + ((i * 480 + t * (3 + i)) % 1500), by = 250 + i * 35 + Math.sin(t / 5 + i) * 10, f = Math.sin(t / 2.5 + i) * 10;
        return <path key={i} d={`M ${bx - 22} ${by - f} Q ${bx - 8} ${by - 10 - f} ${bx} ${by} Q ${bx + 8} ${by - 10 - f} ${bx + 22} ${by - f}`} stroke="#2A1E24" strokeWidth={4} fill="none" strokeLinecap="round" />;
      })}
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Sparkle x={g.x - 160} y={g.y - 60} t={t - 8} s={1.0} />
      <Sparkle x={g.x + 170} y={g.y - 20} t={t - 14} s={0.8} />
    </g>
  );
};

// ---------- E21: night, the street lamps lit: little sis skips along the sidewalk, unafraid ----------
export const E21: React.FC<ShotProps> = ({ t, len }) => {
  const g = streetStand(kf(t, [[0, 6.3], [len, 5.0]], (v) => v), 4.3, { k: 1.15, sidewalk: true });
  const hop = Math.abs(Math.sin(t * 0.32));
  const sw = Math.sin(t * 0.32);
  const pose: Pose = { ...basePose, x: g.x, y: g.y - hop * 22 * g.scale, scale: g.scale, yaw: -0.6, facing: -1, headTilt: sw * 4, tilt: 3,
    armL: { a: 40 + 45 * sw, b: -10 }, armR: { a: 40 - 45 * sw, b: -10 }, legL: { a: 30 * sw, b: -20 * Math.max(0, sw) }, legR: { a: -30 * sw, b: -20 * Math.max(0, -sw) }, sway: 10, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(kf(t, [[0, 1420], [len, 1330]]), 650, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Street t={t + 260} id="e21st" night veil={0.3} market={0.5} />
      <Hero look={SIS} pose={pose} rimId="rimBlue" shadow={0} />
      <Glow x={g.x} y={g.y - 60} r={260} o={0.18} />
    </g>
  );
};

// ---------- E22: dawn, the xôi cart open: mum scoops, two customers wait, steam in the low sun ----------
export const E22: React.FC<ShotProps> = ({ t, len }) => {
  const { x: CX, y: CY, s: CS } = CART;
  const scoop = Math.sin(t / 5);
  const mum: Pose = { ...basePose, x: CX + 45 * CS, y: CY - 140 * CS, scale: CS, yaw: 0.45, facing: 1, headTilt: 3, armL: { a: 12, b: -6 }, armR: { a: 40 + 14 * scoop, b: 30 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 760]]), 600, kf(t, [[0, 2.7], [len, 3.1]]))}>
      <DawnAlley t={t + 70} id="e22st" />
      <Hero look={MOM} pose={mum} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Shopper x={CX + 330 * CS} y={CY + 6} s={CS * 1.05} color="#4A6A8A" bob={Math.max(0, Math.sin(t / 7)) * 2} />
      <Shopper x={CX + 450 * CS} y={CY + 24} s={CS * 1.0} color="#8A5A6A" bob={Math.max(0, Math.sin(t / 6 + 2)) * 2} />
      <DawnMotes t={t} seed={7} />
      <Sparkle x={CX + 330 * CS} y={CY - 330 * CS} t={t - 10} s={0.5} />
    </g>
  );
};

// ---------- E23: the moonlit bedroom, Pip asleep, a slow push-in, the duvet rising with his breath ----------
export const E23: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const pose: Pose = poseAt(t, [{ f: 0, p: { x: b.x, y: b.y + 26 + Math.sin(t / 14) * 2, scale: b.scale, yaw: -0.4, look: 0, armL: { a: 8, b: -6 }, armR: { a: 14, b: -6 }, headTilt: -14, tilt: -4, spin: -62 } }]);
  return (
    <g transform={camT(kf(t, [[0, 840], [len, 800]]), 520, kf(t, [[0, 1.4], [len, 1.65]]))}>
      <Bedroom t={t + 40} id="e23" duvet={false} lamp={0.15} crossed={0} clock="03:00" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]), blink: 1 }} rimId="rimBlue" shadow={0} />
      <BedDuvet knees={1} />
      <ZzzFloat x={b.x - 40} y={b.y - 250} t={t} o={1} />
      <Dust t={t} seed={5} x0={900} y0={380} w={500} h={300} n={10} o={0.25} />
    </g>
  );
};
