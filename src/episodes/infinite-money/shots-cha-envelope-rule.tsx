import React from 'react';
import {
  Hero, basePose, poseAt, faceAt, walkPose, kf, clamp, easeOut, backOut, camT, LOOKS, joints, toWorld, reachAngle, LEG_LEN,
  Foreground, Sparkle, FocusRings, Glow, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BlackCard, SpotBackdrop } from './cha-card-terminal-props';
import { GateScene, MAIL, Envelope, Note, BankPhone } from './cha-scenery-props';

// Chapter A, the envelope and the rule (12.4-25.8 s): the mailbox on the gate, Pip pulls out a plain envelope, the
// black card slides out, the three-word note, Pip's wide eyes ("anything, any amount"), the bank app checks the card.

const PIP = LOOKS.pipHood;
const GROUND = 830;

// ---------- A11: wide, the morning gate; Pip walks up to the mailbox on the post ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = walkPose(kf(t, [[0, 640], [len, 1000]]), t * 0.6, GROUND, 0.95, { yaw: 0.9 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1090]]), 540, kf(t, [[0, 1.12], [len, 1.3]]))}>
      <GateScene id="a11g" t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Glow x={MAIL.x} y={MAIL.y} r={220} o={0.25 + 0.1 * Math.sin(t / 5)} />
      <Foreground blur={10}><path d="M 1500 -20 Q 1560 140 1470 260 Q 1700 160 1760 -20 Z" fill="#1E3A24" /></Foreground>
    </g>
  );
};

// ---------- A12: medium, Pip opens the mailbox door and slides out a plain envelope ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.3;
  const start = { ...basePose, x: 1085, y: GROUND - LEG_LEN * sc, scale: sc, yaw: 0.7 };
  const a0 = reachAngle(start, { x: MAIL.x - 80, y: MAIL.y - 6 });
  const pose = poseAt(t, [
    { f: 0, p: { ...start, look: 0.8, armR: { a: a0, b: 0 }, armL: { a: 10, b: -8 } } },
    { f: 8, p: { armR: { a: a0, b: 0 } } },
    { f: 24, p: { armR: { a: 70, b: 62 }, yaw: 0.45, look: 0.2 }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const pull = easeOut(clamp((t - 7) / 16));
  const ex = MAIL.x + (hand.x + 26 - MAIL.x) * pull;
  const ey = MAIL.y + 6 + (hand.y - 30 - MAIL.y - 6) * pull;
  return (
    <g transform={camT(kf(t, [[0, 1230], [len, 1190]]), 540, kf(t, [[0, 1.55], [len, 1.8]]))}>
      <GateScene id="a12g" t={t + 20} door={easeOut(clamp((t - 2) / 6))} flag={clamp((t - 10) / 8)} />
      <Envelope x={ex} y={ey} s={0.5 + 0.2 * pull} rot={-8 * pull} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [20, 'worried']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// ---------- A13: insert, the flap opens and the black card slides out of the envelope ----------
export const A13: React.FC<ShotProps> = ({ t, len }) => {
  const rise = easeOut(clamp((t - 14) / 24));
  const cy = 600 - 330 * rise;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <SpotBackdrop id="a13bg" t={t} cx={960} cy={560} r={800} />
      <Envelope x={960} y={720} s={1.9} open={clamp((t - 4) / 8)} />
      <BlackCard id="a13c" x={960} y={cy + 150} s={0.82} rot={-4} yaw={0} shine={clamp((t - 30) / 26)} glow={rise} />
      {/* the envelope's front pocket hides the card's lower part */}
      <g transform="translate(960 720) scale(1.9)">
        <path d="M -150 -95 L 0 14 L 150 -95 L 150 95 L -150 95 Z" fill="#EFE3C8" stroke="#A8946A" strokeWidth={4} strokeLinejoin="round" />
        <path d="M -150 95 L -30 -10 M 150 95 L 30 -10" stroke="#C9B58A" strokeWidth={3} fill="none" />
      </g>
      <InsertArm x={640} y={920} fx={-300} fy={1240} rot={20} s={4.6} width={112} />
      <Sparkle x={1280} y={330} t={t - 30} s={1.5} />
      <Sparkle x={640} y={400} t={t - 38} s={1.0} />
    </g>
  );
};

// ---------- A14: insert, the note unfolds beside the card; the three words write on as they are spoken ----------
export const A14: React.FC<ShotProps> = ({ t, len }) => {
  const unf = easeOut(clamp(t / 14));
  const w = (a: number, b: number) => clamp((t - a) / (b - a));
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), kf(t, [[0, 600], [len, 520]]), kf(t, [[0, 1.0], [len, 1.55]]))}>
      <SpotBackdrop id="a14bg" t={t + 30} cx={980} cy={540} r={800} />
      <BlackCard id="a14c" x={380} y={860} s={0.66} rot={14} shine={clamp((t - 6) / 30)} />
      <g transform={`translate(1000 540) scale(1 ${0.12 + 0.88 * unf}) translate(-1000 -540)`}>
        <Note id="a14n" x={1000} y={540} s={1.45} rot={-2} words={[w(58, 68), w(66, 75), w(72, 83)]} />
      </g>
      <InsertArm x={430} y={440} fx={-300} fy={760} rot={-30} s={4.6} width={112} />
    </g>
  );
};

// ---------- A15: close-up, Pip's eyes go wide; ("anything, any amount") things he could buy pop up round him ----------
const Badge: React.FC<{ kind: 'house' | 'car' | 'phone' | 'plane'; x: number; y: number; t: number; at: number }> = ({ kind, x, y, t, at }) => {
  const k = backOut(clamp((t - at) / 8));
  if (k <= 0) return null;
  const bob = Math.sin(t / 7 + at) * 6;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${k * 0.55})`}>
      <circle r={74} fill="#F6EFE3" stroke="#1A1230" strokeWidth={7} />
      {kind === 'house' ? <g fill="#E4604A" stroke="#1A1230" strokeWidth={5} strokeLinejoin="round"><path d="M -44 -4 L 0 -44 L 44 -4 Z" /><rect x={-32} y={-4} width={64} height={44} fill="#F2C94C" /></g> : null}
      {kind === 'car' ? <g stroke="#1A1230" strokeWidth={5} strokeLinejoin="round"><path d="M -52 14 L -44 -8 L -20 -26 L 22 -26 L 44 -6 L 54 14 Z" fill="#3E8C86" /><circle cx={-28} cy={18} r={11} fill="#1A1230" /><circle cx={30} cy={18} r={11} fill="#1A1230" /></g> : null}
      {kind === 'phone' ? <g stroke="#1A1230" strokeWidth={5}><rect x={-24} y={-44} width={48} height={88} rx={9} fill="#2E2B3D" /><rect x={-17} y={-34} width={34} height={58} rx={3} fill="#7FD4F0" /></g> : null}
      {kind === 'plane' ? <g fill="#7FB8E0" stroke="#1A1230" strokeWidth={5} strokeLinejoin="round"><path d="M -50 8 L 40 -16 L 54 -8 L 20 8 L 40 30 L 26 34 L 2 16 L -34 28 Z" /></g> : null}
    </g>
  );
};
export const A15: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, scale: 1, yaw: 0.2, look: 0.3, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 }, squash: 0.03 } },
    { f: 6, p: { squash: -0.04 }, ease: easeOut },
    { f: 14, p: { squash: 0, look: -0.3 } },
    { f: 34, p: { look: 0.4, headTilt: -3 } },
    { f: 58, p: { look: -0.2, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 2.2], [len, 2.7]]))}>
      <g filter="url(#blur16)"><GateScene id="a15g" t={t} /></g>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#1A1020" opacity={0.35} />
      <Glow x={960} y={520} r={420} o={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [34, 'happy']]) }} rimId="rimR" shadow={0} />
      <g transform="translate(960 530) scale(0.5)"><FocusRings x={0} y={0} t={t - 2} /></g>
      <Badge kind="house" x={705} y={430} t={t} at={22} />
      <Badge kind="car" x={1215} y={425} t={t} at={30} />
      <Badge kind="phone" x={715} y={690} t={t} at={38} />
      <Badge kind="plane" x={1205} y={690} t={t} at={46} />
    </g>
  );
};

// ---------- A16: insert, the phone bank app is checking the card (spinner, a bar, then the green tick row) ----------
const PhoneBg: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <SpotBackdrop id={id} t={t} cx={960} cy={520} r={820} tint="#BFE6FF" />
  </g>
);
export const A16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 330], [len, 380]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
    <PhoneBg id="a16bg" t={t} />
    <BankPhone x={960} y={560} s={1.6} rot={-3} check={clamp((t - 4) / 34)} bal={0} t={t} />
    <InsertArm x={1120} y={1010} fx={1500} fy={1400} rot={-12} s={4.6} width={112} />
  </g>
);

// ---------- A17: the phone says KIỂM TRA: HỢP LỆ ✓, then SỐ DƯ: ∞ drops in ("it never runs out") ----------
export const A17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 420], [len, 620]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
    <PhoneBg id="a17bg" t={t + 40} />
    <Glow x={960} y={560} r={520} o={0.2 + 0.15 * clamp((t - 27) / 10)} kind="cool" />
    <BankPhone x={960} y={560} s={1.6} rot={kf(t, [[0, -3], [len, 2]])} check={1} bal={clamp((t - 27) / 18)} t={t} />
    <Sparkle x={1150} y={420} t={t - 3} s={1.0} />
    <Sparkle x={820} y={640} t={t - 33} s={1.4} />
    <InsertArm x={1120} y={1010} fx={1500} fy={1400} rot={-12} s={4.6} width={112} />
  </g>
);
