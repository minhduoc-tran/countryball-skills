import React from 'react';
import {
  Hero, Street, ShotProps, LOOKS, basePose, Pose, faceAt, poseAt, kf, clamp, easeOut, camT, Glow, Dust, Foreground, LEG_LEN, joints, toWorld,
  Bedroom, BEDROOM, stand, shake, rnd,
} from '../../engine';
import { DawnAlley } from '../tien-vo-han/che-dawn-alley-backdrop';
import { GRANDMA } from '../khong-ai-ngheo/cast-looks';
import { LotteryStrip } from '../khong-ai-ngheo/chc-grandma-props';
import { Walker } from './chc-street-people';
import { GANG_A, WATCHMAN, PAYER } from './chc-alley-and-toll-props';
import { SnatchHand, FlyingTickets, PoliceBooth, LockedDoor, TorchBeam } from './chc-jungle-incident-props';
import { ped, floorOf, handAt } from '../neu-chien-tranh/chc-pose-utils';

// Chapter C, "week one: jungle" (look w1), part 2: C5 grandma's tickets are snatched (look alert); C6 she looks around, nobody to call,
// an empty police booth; C7 a front door is bolted, padlocked and barred; C8 neighbours swap the night-watch torch; C9 sis at the window.

const SLEEVE = GANG_A.jacket;

// ---------- C5: medium: grandma calls her tickets; a hand snatches the strip, tickets flutter; she freezes ----------
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const GRAB = 32;
  const reach = clamp((t - 20) / (GRAB - 20));
  const pull = clamp((t - GRAB - 1) / 12);
  const after = clamp((t - GRAB) / 10);
  const pose: Pose = {
    ...basePose, x: 930, y: 640, scale: 1.55, yaw: 0.35, facing: 1, headTilt: 3 + 2 * Math.sin(t / 10) - after * 5, look: 0.3 + after * 0.5,
    armL: { a: 12, b: 6 }, armR: { a: 128 + 4 * Math.sin(t / 6) - after * 30, b: 12 }, tilt: -after * 4,
    ...faceAt(t, [[0, 'neutral'], [GRAB, 'shock']]),
  };
  const hand = toWorld(pose, joints({ ...pose, armR: { a: 128, b: 12 } }).armR.end);
  const grab = { x: hand.x + 6, y: hand.y + 52 };
  const sk = shake(t, GRAB, 9, 14);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 570, kf(t, [[0, 1.05], [len, 1.25]]))}>
        <DawnAlley t={t + 20} id="jc5" blur={10} />
        <Hero look={GRANDMA} pose={pose} rimId="rimR" shadow={0} />
        {t < GRAB + 1 ? <LotteryStrip x={hand.x + 6} y={hand.y - 4} t={t} s={1.15} /> : null}
        <SnatchHand gx={grab.x} gy={grab.y - 30} reach={reach} pull={pull} sleeve={SLEEVE} s={1.0} held={t > GRAB ? <g transform="translate(-4 -20) scale(1.15)"><LotteryStrip x={0} y={0} t={t * 2} n={5} /></g> : null} />
        <FlyingTickets x={grab.x} y={grab.y} k={t - GRAB} n={10} s={1.15} />
        <Dust t={t} seed={3} x0={700} y0={300} w={800} h={500} n={18} o={0.4} />
      </g>
    </g>
  );
};

// ---------- C6: wide: grandma, empty-handed, looks left and right for anyone; the police booth beside her is empty ----------
export const C6: React.FC<ShotProps> = ({ t, len }) => {
  const gs = 1.5;
  const scan = kf(t, [[0, 0.9], [14, -0.9], [28, 0.9], [len, 0.2]]);
  const pose: Pose = {
    ...basePose, x: 700, y: 820 - LEG_LEN * gs, scale: gs, yaw: scan > 0 ? 0.45 : -0.45, facing: scan > 0 ? 1 : -1, look: scan, headTilt: scan * 6, tilt: 0,
    armL: { a: 20, b: 14 }, armR: { a: 34 + 8 * Math.sin(t / 5), b: 18 }, ...faceAt(t, [[0, 'worried']]),
  };
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 600, kf(t, [[0, 1.05], [len, 1.2]]))}>
      <DawnAlley t={t + 60} id="jc6" blur={10} />
      <ellipse cx={1240} cy={826} rx={200} ry={20} fill="#000" opacity={0.3} />
      <PoliceBooth x={1240} y={820} s={1.5} t={t} />
      <ellipse cx={700} cy={824} rx={100} ry={14} fill="#000" opacity={0.3} />
      <Hero look={GRANDMA} pose={pose} rimId="rimR" shadow={0} />
      <Foreground blur={10}><rect x={-100} y={960} width={2200} height={200} fill="#17101C" opacity={0.8} /></Foreground>
    </g>
  );
};

// ---------- C7: a front door: it swings shut, the bolt slides, a padlock snaps on, a plank bar slides across ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const shut = clamp(t / 12);
  const bolt = clamp((t - 14) / 7);
  const lock = clamp((t - 24) / 9);
  const bar = clamp((t - 38) / 12);
  const sk = shake(t, 12, 6, 8);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 960], [len, 1010]]), kf(t, [[0, 600], [len, 640]]), kf(t, [[0, 1.0], [len, 1.45]]))}>
        <rect x={-600} y={-400} width={3120} height={1800} fill="#3A2E3E" />
        <rect x={-600} y={900} width={3120} height={500} fill="#2A2230" />
        <rect x={-600} y={-400} width={3120} height={1300} fill="#6A5460" opacity={0.7} />
        {[-1, 1].map((d) => (
          <g key={d} transform={`translate(${960 + d * 640} 560)`}>
            <rect x={-110} y={-190} width={220} height={260} fill="#D9C7A8" stroke="#1A1420" strokeWidth={5} />
            <rect x={-92} y={-172} width={184} height={224} fill="#5A4636" stroke="#1A1420" strokeWidth={4} />
            {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={-92} y1={-150 + i * 38} x2={92} y2={-150 + i * 38} stroke="#00000055" strokeWidth={4} />)}
          </g>
        ))}
        <LockedDoor x={960} y={900} s={1.5} shut={shut} bolt={bolt} lock={lock} bar={bar} />
        <Dust t={t} seed={8} x0={600} y0={300} w={800} h={500} n={16} o={0.4} />
      </g>
    </g>
  );
};

// ---------- C8: night street: one neighbour hands the torch to the next for the watch; the beam sweeps the dark ----------
export const C8: React.FC<ShotProps> = ({ t, len }) => {
  const g = ped(-3.4, 4.4);
  const s = g.scale * 1.05;
  const fy = floorOf(g);
  const pass = easeOut(clamp((t - 6) / 16));
  const mk = (x: number, yaw: number, extra: Partial<Pose>): Pose => ({ ...basePose, x, y: fy - LEG_LEN * s, scale: s, yaw, facing: yaw < 0 ? -1 : 1, tilt: 0, ...extra });
  const aBase = mk(g.x - 190 * s, 0.6, { expr: 'tired', look: 0.6 });
  const bBase = mk(g.x + 190 * s, -0.6, { expr: 'neutral', look: -0.5 });
  const aArm = { a: 78 + 6 * pass, b: -14 };
  const bArm = { a: 30 + 52 * pass, b: -14 };
  const a: Pose = { ...aBase, armR: aArm };
  const b: Pose = { ...bBase, armL: bArm };
  const ha = handAt(a, 'armR', aArm);
  const hb = handAt(b, 'armL', bArm);
  const th = { x: ha.x + (hb.x - ha.x) * pass, y: ha.y + (hb.y - ha.y) * pass };
  const ang = kf(t, [[0, 6], [len, 22]]);
  return (
    <g transform={camT(kf(t, [[0, 780], [len, 720]]), 640, kf(t, [[0, 1.7], [len, 1.95]]))}>
      <Street t={t + 90} id="jc8" night />
      <Hero look={PAYER} pose={a} rimId="rimBlue" shadow={0} />
      <Hero look={WATCHMAN} pose={b} rimId="rimBlueL" shadow={0} />
      <TorchBeam id="jc8b" x={th.x + 8} y={th.y} ang={ang} len={720} o={0.8} />
      <rect x={th.x - 8} y={th.y - 8} width={26} height={16} rx={4} fill="#2A2A36" stroke="#0E0C14" strokeWidth={3} />
    </g>
  );
};

// ---------- C9: sis at her bedroom window after dark: she peeks past the curtain, a torch beam slides across the glass; slow push-in ----------
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const at = stand(BEDROOM, 0.56, 0.1);
  const sc = at.scale * 0.72;
  const peek = easeOut(clamp((t - 4) / 12));
  const pose: Pose = {
    ...basePose, x: at.x, y: at.y + (LEG_LEN * at.scale - LEG_LEN * sc), scale: sc, yaw: 0.65, facing: 1, look: 0.9, headTilt: -3,
    armL: { a: 10, b: 8 }, armR: { a: 40 + 70 * peek, b: -30 + 10 * peek }, ...faceAt(t, [[0, 'worried']]),
  };
  const beam = kf(t, [[0, 1040], [len, 1360]]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1080]]), kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.2], [len, 1.8]]))}>
      <Bedroom t={t + 40} id="jc9" veil={0.5} lamp={0.15} crossed={0} clock="21:40" />
      <Glow x={beam} y={500} r={120} kind="cool" o={0.35 + 0.1 * Math.sin(t / 3)} />
      <Hero look={LOOKS.sis} pose={pose} rimId="rimBlue" shadow={0} />
      <Foreground blur={16}><rect x={440} y={380} width={90} height={500} fill="#0C0812" opacity={0.9} /></Foreground>
    </g>
  );
};
