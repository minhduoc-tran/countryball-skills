import React from 'react';
import {
  Hero, Pose, basePose, HEAD, poseAt, faceAt, kf, clamp, easeOut, backOut, rnd, camT, LOOKS, Glow, Dust, Kitchen, KitchenIsland, KITCHEN, stand, islandTop,
  Bedroom, BedDuvet, bedSit, LAMP, Study, Desk, joints, toWorld, FONT, ShotProps,
} from '../../engine';
import { PhoneShell } from '../last-one/cha-feed-screen-ui';
import { BanhMi, HeldPhone } from './cha-street-props';
import { CheckScreen } from './cha-bank-screens';

// Chapter A, shots A14-A19: "every second, never stopping, even when you eat, shower, sleep" (three quick domestic
// shots, each with the ping chip), then the "nobody knows where it comes from" shrug, the bank officer, and the phone
// screen that says the check passed ("HỢP LỆ ✓").

const PIP = LOOKS.pipHood;
const KS = stand(KITCHEN, 0.5, 0.4);

// ---------- A14: wide, eating at the kitchen island: bánh mì in hand, a bite, the phone lit beside the plate ----------
export const A14: React.FC<ShotProps> = ({ t, len }) => {
  const chew = Math.sin(t / 2.2) * 2.5;
  const pose = poseAt(t, [
    { f: 0, p: { x: KS.x, y: KS.y, scale: KS.scale, yaw: 0.15, look: 0.2, armL: { a: 12, b: -6 }, armR: { a: 70, b: 60 } } },
    { f: 8, p: { armR: { a: 128, b: 112 } }, ease: easeOut },
    { f: 20, p: { armR: { a: 110, b: 100 } }, ease: easeOut },
  ]);
  const h = toWorld(pose, joints(pose).armR.end);
  const ph = islandTop(0.7, 0.4);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 566]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Kitchen t={t + 70} id="sa14" veil={0.36} />
      <Hero look={PIP} pose={{ ...pose, headTilt: chew, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <BanhMi x={h.x + 6} y={h.y + 6} s={0.22} rot={-40} />
      <KitchenIsland />
      <HeldPhone x={ph.x + 20} y={ph.y - 6} s={1.5} rot={78} glow={0.5 + 0.5 * Math.abs(Math.sin(t / 5))} />
    </g>
  );
};

// ---------- A15: close-up, in the shower: Pip's head over the tub edge, steam, water falling, the curtain bunched at the side ----------
export const A15: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 2.2;
  const pose: Pose = {
    ...basePose, x: 900, y: 340 - HEAD.y * sc + Math.sin(t / 6) * 3, scale: sc, yaw: -0.25, look: 0.2, headTilt: Math.sin(t / 8) * 3,
    armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, ...faceAt(t, [[0, 'happy']]),
  };
  return (
    <g>
      <rect width={1920} height={1080} fill="#2E4A5E" />
      {Array.from({ length: 9 }).map((_, i) => <path key={`v${i}`} d={`M ${i * 240} 0 L ${i * 240} 1080`} stroke="#22394A" strokeWidth={4} />)}
      {Array.from({ length: 6 }).map((_, i) => <path key={`h${i}`} d={`M 0 ${i * 200} L 1920 ${i * 200}`} stroke="#22394A" strokeWidth={4} />)}
      <Glow x={900} y={200} r={900} o={0.45} />
      {/* shower head and pipe, upper left of the head */}
      <path d="M 380 0 L 380 110 Q 380 160 440 160 L 520 160" stroke="#B8BCCB" strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d="M 500 140 L 680 110 L 680 190 L 500 190 Z" fill="#CFD3DE" stroke="#7E8398" strokeWidth={4} />
      {Array.from({ length: 26 }).map((_, i) => {
        const p = ((t * 0.07 + rnd(4, i)) % 1);
        const x = 520 + (i / 25) * 150 + p * 120;
        return <path key={i} d={`M ${x} ${200 + p * 440} l 10 36`} stroke="#CFE6FF" strokeWidth={5} strokeLinecap="round" opacity={0.7 * (1 - p * 0.5)} />;
      })}
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {/* shampoo foam on his head */}
      {[[-70, -78, 36], [0, -104, 44], [70, -82, 34], [-24, -60, 26], [38, -56, 24]].map(([dx, dy, r], i) => (
        <circle key={i} cx={900 + (dx as number) * 1.4 + Math.sin(t / 9 + i) * 3} cy={235 + (dy as number) * 1.1} r={(r as number) * 1.4} fill="#F4F8FF" opacity={0.95} />
      ))}
      {/* steam wraps his shoulders, the tub edge hides the rest */}
      {[[620, 560, 330, 150], [900, 540, 380, 170], [1180, 580, 330, 140]].map(([cx, cy, rx, ry], i) => (
        <ellipse key={i} cx={(cx as number) + Math.sin(t / 25 + i) * 20} cy={cy as number} rx={rx as number} ry={ry as number} fill="#E4EEF4" opacity={0.93} style={{ filter: 'blur(10px)' }} />
      ))}
      <rect x={0} y={690} width={1920} height={390} fill="#DDE4EC" />
      <rect x={0} y={690} width={1920} height={24} fill="#FFFFFF" opacity={0.7} />
      <path d="M 1400 0 L 1920 0 L 1920 1080 L 1470 1080 Q 1420 540 1400 0 Z" fill="#7AB8C8" opacity={0.92} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${1470 + i * 90} 0 Q ${1450 + i * 90 + Math.sin(t / 20 + i) * 8} 540 ${1500 + i * 90} 1080`} stroke="#4E8A9C" strokeWidth={10} fill="none" />)}
      <path d="M 0 22 L 1920 22" stroke="#8A8E9C" strokeWidth={10} />
      {Array.from({ length: 4 }).map((_, i) => {
        const p = ((t / 60 + i * 0.27) % 1);
        return <ellipse key={i} cx={400 + i * 360 + p * 80} cy={700 - p * 380} rx={240} ry={100} fill="#FFFFFF" opacity={0.3 * Math.sin(p * Math.PI)} style={{ filter: 'blur(14px)' }} />;
      })}
    </g>
  );
};

// ---------- A16: wide, night: Pip asleep, the phone on the nightstand lighting up the lamp's corner of the room ----------
export const A16: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const pose: Pose = { ...basePose, x: b.x, y: b.y + Math.sin(t / 8) * 1.2, scale: b.scale, yaw: -0.4, look: 0, blink: 1, headTilt: 10, armL: { a: 8, b: -6 }, armR: { a: 14, b: -6 } };
  const jit = Math.sin(t * 9.1) * 3;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 540, kf(t, [[0, 1.05], [len, 1.18]]))}>
      <Bedroom t={t + 140} id="sa16" duvet={false} clock="03:12" lamp={0} crossed={0} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]), blink: 1 }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
      <Glow x={LAMP.x + 40} y={LAMP.y + 80} r={300} kind="cool" o={0.6 + 0.3 * Math.abs(Math.sin(t / 6))} />
      <HeldPhone x={LAMP.x + 46 + jit} y={LAMP.y + 86} s={1.5} rot={84} glow={1} />
      {[0, 1, 2].map((i) => {
        const p = ((t / 44 + i / 3) % 1);
        return <text key={i} x={b.x - 30 + p * 80} y={b.y - 330 - p * 140} fontFamily={FONT.hand} fontSize={30 + i * 10} fill="#CFE6FF" opacity={Math.sin(p * Math.PI) * 0.85}>Z</text>;
      })}
    </g>
  );
};

// ---------- A17: medium, Pip at his desk shrugs at the phone; question marks pop around his head ----------
export const A17: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, scale: 1, yaw: 0.2, look: 0.2, armL: { a: 10, b: -6 }, armR: { a: 70, b: 100 }, headTilt: 3 } },
    { f: 16, p: { armL: { a: 100, b: 40 }, armR: { a: 100, b: 40 }, headTilt: -6 }, ease: easeOut },
    { f: 34, p: { armL: { a: 12, b: -4 }, armR: { a: 70, b: 100 }, headTilt: 4 }, ease: easeOut },
  ]);
  const h = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.55], [len, 1.75]]))}>
      <Study t={t + 100} id="sa17" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [14, 'worried']]) }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} />
      {[0, 1, 2].map((i) => {
        const p = backOut(clamp((t - 10 - i * 8) / 8));
        return p > 0 ? <text key={i} x={[820, 1130, 960][i]} y={[430, 440, 330][i]} textAnchor="middle" fontFamily={FONT.hand} fontSize={110 * p} fontWeight={700} fill="#FFE27A" stroke="#1E1824" strokeWidth={4} paintOrder="stroke" transform={`rotate(${(i - 1) * 12} ${[820, 1130, 960][i]} ${[430, 440, 330][i]})`}>?</text> : null;
      })}
      <HeldPhone x={h.x + 2} y={h.y - 6} s={0.8} rot={-6} glow={0.9} />
    </g>
  );
};

// ---------- A18: medium, the man in the suit at a desk, his eyes on the screen, a nod ----------
export const A18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, scale: 1, yaw: -0.25, look: -0.5, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 }, headTilt: 0 } },
    { f: 14, p: { headTilt: 5, look: -0.4 }, ease: easeOut },
    { f: 24, p: { headTilt: -3 }, ease: easeOut },
    { f: 36, p: { headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 520, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Study t={t + 30} id="sa18" night />
      <Hero look={LOOKS.suit} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'happy']]) }} rimId="rimL" shadow={0} />
      <Desk x0={560} x1={1360} y={700} />
      {/* NGÂN HÀNG name plate, and a stamp pressing a paper */}
      <g transform="translate(1085 690)">
        <rect x={-90} y={-34} width={180} height={34} rx={5} fill="#2A2F3E" stroke="#C9B26A" strokeWidth={3} />
        <text y={-10} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fontWeight={700} fill="#E9D9A0" letterSpacing={2}>NGÂN HÀNG</text>
      </g>
      <g transform="translate(1262 702)">
        <rect x={-60} y={-12} width={120} height={14} fill="#EDE6D6" stroke="#8A8470" strokeWidth={2} />
        <g transform={`translate(0 ${-40 + 30 * Math.min(1, Math.max(0, (t - 30) / 3))})`}>
          <rect x={-22} y={-46} width={44} height={14} rx={5} fill="#A8323E" />
          <rect x={-8} y={-34} width={16} height={34} fill="#5A3A2A" />
          <rect x={-24} y={-2} width={48} height={8} rx={3} fill="#A8323E" />
        </g>
      </g>
    </g>
  );
};

// ---------- A19: insert, the bank's check on the phone: three ticks, then the stamp "HỢP LỆ ✓" slams on ----------
export const A19: React.FC<ShotProps> = ({ t, len }) => {
  const flash = t >= 30 && t < 33 ? 0.25 : 0;
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 0.95], [len, 1.0]]))}>
      <rect x={-400} y={-300} width={2720} height={1680} fill="#0A1218" />
      <Glow x={960} y={560} r={900} kind="cool" o={0.5} />
      <PhoneShell id="sa19p" x={960} y={560} s={0.82} rot={0} glow={0.6}>
        <CheckScreen t={t} />
      </PhoneShell>
      <rect x={-400} y={-300} width={2720} height={1680} fill="#7CF0A8" opacity={flash} />
      <Dust t={t} seed={19} x0={300} y0={100} w={1300} h={800} n={14} o={0.3} />
    </g>
  );
};
