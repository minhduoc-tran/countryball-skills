import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, HEAD, Kitchen, KitchenIsland, KITCHEN, stand,
  Tabletop, LightVeil, Glow, walkPose, FONT, UI, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BlackCard, Terminal } from './chd-props-money-and-icons';
import { ArmHand } from './chd-props-cast-and-scenes';

// Chapter D, beat "the suit" (D5-D8): a week later the man in the suit walks into the kitchen; his badge (generic
// "NGÂN HÀNG TRUNG ƯƠNG"); the tired close-up; Pip's hand freezing above the terminal.

const PIP = LOOKS.pipHood;
const SUIT = LOOKS.suit;
const PIP_AT = stand(KITCHEN, 0.34, 0.4);
const SUIT_AT = stand(KITCHEN, 0.74, 0.4);
const KITCHEN_BG: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g filter="url(#blur16)">
    <g transform="translate(-300 -260) scale(1.5)"><Kitchen t={t + 40} id={id} /></g>
  </g>
);

// ---------- D5: wide: the kitchen a week later; the man in the suit walks in from the right, Pip turns ----------
export const D5: React.FC<ShotProps> = ({ t, len }) => {
  const walkEnd = 56;
  const k = easeOut(clamp(t / walkEnd));
  const sx = 1700 - (1700 - SUIT_AT.x) * k;
  const walking = t < walkEnd;
  const sPose: Pose = walking
    ? walkPose(sx, t * 0.55, SUIT_AT.y + LEG_LEN * SUIT_AT.scale, SUIT_AT.scale, { yaw: -1, tilt: -3 }, -1)
    : { ...basePose, ...SUIT_AT, yaw: -0.5, armL: { a: 10, b: 8 }, armR: { a: 12, b: 6 }, headTilt: 2 };
  const pPose = poseAt(t, [
    { f: 0, p: { ...basePose, ...PIP_AT, yaw: 0.2, look: 0.2, armL: { a: 8, b: 6 }, armR: { a: 14, b: 10 } } },
    { f: 40, p: { yaw: 0.55, look: 0.6 } },
    { f: 52, p: { armL: { a: 8, b: 6 } } },
  ]);
  const tag = clamp((t - 2) / 8);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 560, kf(t, [[0, 1.0], [len, 1.15]]))}>
      <Kitchen t={t + 150} id="d5k" />
      <Hero look={PIP} pose={{ ...pPose, ...faceAt(t, [[0, 'neutral'], [44, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={SUIT} pose={{ ...sPose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.5} />
      <KitchenIsland />
      <g transform={`translate(330 150) scale(${tag})`}>
        <rect x={-10} y={-44} width={420} height={78} rx={39} fill={UI.pill} opacity={0.75} />
        <text x={200} y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill={UI.text} letterSpacing={3}>ONE WEEK LATER</text>
      </g>
    </g>
  );
};

// ---------- D6: insert: the badge slid across the table by the man's hand: NGÂN HÀNG TRUNG ƯƠNG ----------
const Badge: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-250 + 12} y={-160 + 16} width={500} height={320} rx={24} fill="#000" opacity={0.35} />
    <rect x={-250} y={-160} width={500} height={320} rx={24} fill="#F1EEE6" stroke="#8E8A7C" strokeWidth={5} />
    <path d="M -250 -136 Q -250 -160 -226 -160 L 226 -160 Q 250 -160 250 -136 L 250 -60 L -250 -60 Z" fill="#23447A" />
    <circle cx={-190} cy={-110} r={34} fill="none" stroke="#E8C86A" strokeWidth={5} />
    <path d="M -206 -100 L -190 -126 L -174 -100 M -202 -92 H -178" stroke="#E8C86A" strokeWidth={5} fill="none" strokeLinecap="round" />
    <text x={-130} y={-120} fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#F1EEE6" letterSpacing={2}>BANK</text>
    <text x={-130} y={-80} fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#F1EEE6" letterSpacing={2}>CENTRAL BANK</text>
    <rect x={-210} y={-30} width={140} height={160} rx={10} fill="#C9D2DE" />
    <circle cx={-140} cy={20} r={30} fill="#9AA6B8" />
    <path d="M -190 126 Q -190 70 -140 70 Q -90 70 -90 126 Z" fill="#9AA6B8" />
    <rect x={-30} y={-6} width={220} height={18} rx={9} fill="#3A3A46" />
    <rect x={-30} y={38} width={160} height={14} rx={7} fill="#9A9AA6" />
    <rect x={-30} y={74} width={190} height={14} rx={7} fill="#9A9AA6" />
  </g>
);
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 16));
  const bx = 1500 - 560 * k;
  const by = 560 + Math.sin(t / 9) * 3;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.07]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#5A4636" grain="#4C3B2D" />
      <LightVeil id="d6veil" lights={[[900, 560, 640]]} o={0.55} />
      <rect x={480} y={330} width={620} height={440} rx={12} fill="#C9A26A" stroke="#7A5A30" strokeWidth={5} transform="rotate(-5 790 550)" opacity={0.9} />
      <Badge x={bx} y={by} rot={-4} />
      <ArmHand look={SUIT} x={bx + 260} y={by + 120} fx={bx + 960} fy={by + 700} rot={20} s={5} width={130} />
    </g>
  );
};

// ---------- D7: close-up: the man in the suit, tired and sincere, kitchen soft behind ----------
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 3.3], [len, 3.7]]);
  const head = { x: 960, y: 520 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: -0.3, look: kf(t, [[0, -0.5], [30, -0.2], [60, -0.5]]),
    headTilt: kf(t, [[0, -2], [len, 2]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, expr: 'tired', blink: (t > 24 && t < 27) || (t > 55 && t < 58) ? 1 : 0,
  };
  return (
    <g>
      <KITCHEN_BG t={t} id="d7k" />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0A12" opacity={0.4} />
      <Glow x={700} y={480} r={760} o={0.3} />
      <Hero look={SUIT} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- D8: insert: Pip's hand with the black card stops dead above the terminal, trembling, a bead of sweat ----------
export const D8: React.FC<ShotProps> = ({ t, len }) => {
  const dropIn = clamp((t - 8) / 40);
  const tremble = Math.sin(t * 2.3) * 5 * Math.max(0, 1 - t / 30);
  const y = kf(t, [[0, 700], [10, 330]]) + tremble;
  const x = kf(t, [[0, 640], [10, 900]]) + tremble * 0.6;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.07]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#4A3A44" grain="#3E3038" lip="#5A4652" floor="#1E1824" floorLines="#18121E" />
      <LightVeil id="d8veil" lights={[[940, 560, 620]]} o={0.55} />
      <Terminal x={940} y={1050} s={1.5} idle="TAP" />
      <BlackCard x={x} y={y} rot={-6} s={1.5} />
      <InsertArm x={x - 70} y={y + 56} fx={x - 520} fy={y + 800} rot={-6} s={5} width={120} />
      <g transform={`translate(${x + 250} ${y - 120 + dropIn * 220})`} opacity={clamp(dropIn * 4) * (1 - clamp((dropIn - 0.85) * 6))}>
        <path d="M 0 -26 Q 18 4 14 14 A 16 16 0 0 1 -14 14 Q -18 4 0 -26 Z" fill="#9FD8FF" stroke="#4A86B8" strokeWidth={3} />
      </g>
    </g>
  );
};
