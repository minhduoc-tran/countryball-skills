import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, camT, LOOKS, HEAD, Glow, AlarmClock, FONT, ShotProps,
} from '../../engine';
import { DawnBedroom } from '../last-one/shots-cha-morning-bedroom';
import { PhoneShell } from '../last-one/cha-feed-screen-ui';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { LockNotifs, BalanceScreen } from './cha-bank-screens';

// Chapter A, shots A8-A13: the first morning. 06:00 on the alarm, the phone buzzes on the nightstand, the bank's
// notification "+1.000 đ", a second one stacks, Pip squints at the screen in bed, the balance counts up each second.
// From A9 on the edit uses the "ping" look. Backgrounds are the dawn bedroom, blurred, so the phone is the light.

const PIP = LOOKS.pipHood;

/** The dawn bedroom blurred and sunk, the backdrop of every phone / clock insert here. */
const SoftBedroom: React.FC<{ t: number; id: string; dark?: number }> = ({ t, id, dark = 0.4 }) => (
  <g>
    <g filter="url(#blur16)">
      <g transform="translate(-520 -520) scale(1.9)">
        <DawnBedroom t={t + 20} id={id} clock="06:00" />
      </g>
    </g>
    <rect x={-400} y={-300} width={2720} height={1680} fill="#0A0814" opacity={dark} />
  </g>
);

/** Strong phone buzz: x/y/rot jitter, 1 while buzzing. */
const buzzJit = (t: number, k = 1) => ({ x: (Math.sin(t * 9.1) * 9 + Math.sin(t * 5.3) * 5) * k, y: Math.sin(t * 7.7) * 5 * k, r: Math.sin(t * 6.1) * 2.4 * k });

// ---------- A8: macro, the alarm clock on the nightstand reads 06:00; morning light; it slowly pushes in ----------
export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = 0.5 + 0.5 * Math.sin(t / 6);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <SoftBedroom t={t} id="sa8" dark={0.3} />
      <Glow x={1500} y={300} r={700} o={0.45} />
      <Glow x={1020} y={620} r={520} o={0.35 + 0.1 * pulse} />
      <g transform="translate(1000 800) scale(3.4)">
        <AlarmClock x={0} y={0} s={1} text="06:00" on={1} />
      </g>
    </g>
  );
};

// ---------- A9: insert, the phone buzzing on the nightstand, screen waking: it shudders and creeps ----------
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const k = t > 6 ? 1 : 0.15;
  const j = buzzJit(t, k);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <SoftBedroom t={t} id="sa9" />
      <Glow x={960} y={560} r={800} kind="cool" o={0.5} />
      {[0, 1, 2].map((i) => {
        const p = ((t / 10 + i / 3) % 1);
        return [-1, 1].map((sd) => <path key={`${i}${sd}`} d={`M ${960 + sd * (330 + 120 * p)} 360 q ${sd * 36} 80 0 160`} stroke="#CFE6FF" strokeWidth={12} fill="none" strokeLinecap="round" opacity={k * (1 - p)} />);
      })}
      <PhoneShell id="sa9p" x={960 + j.x} y={600 + j.y} s={0.74} rot={-6 + j.r} glow={0.8}>
        <LockNotifs t={t} at={[]} time="06:00" />
      </PhoneShell>
    </g>
  );
};

// ---------- A10: insert, the bank's notification slides in: "NGÂN HÀNG +1.000 đ", the camera pushes to the card ----------
export const A10: React.FC<ShotProps> = ({ t, len }) => {
  const j = buzzJit(t, t < 14 ? 0.9 : 0);
  const cy = kf(t, [[0, 640], [len, 420]]);
  return (
    <g transform={camT(960, cy, kf(t, [[0, 1.0], [len, 1.5]]))}>
      <SoftBedroom t={t + 30} id="sa10" />
      <Glow x={960} y={560} r={900} kind="cool" o={0.55} />
      <PhoneShell id="sa10p" x={960 + j.x} y={700 + j.y} s={0.95} rot={2 + j.r} glow={0.8}>
        <LockNotifs t={t} at={[3]} time="06:00" balance={0} />
      </PhoneShell>
    </g>
  );
};

// ---------- A11: insert, a second buzz and a second card stacks under the first ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => {
  const j = buzzJit(t, t > 42 && t < 58 ? 1 : 0);
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 990]]), kf(t, [[0, 520], [len, 600]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <SoftBedroom t={t + 60} id="sa11" />
      <Glow x={960} y={560} r={900} kind="cool" o={0.55} />
      <PhoneShell id="sa11p" x={960 + j.x} y={720 + j.y} s={0.95} rot={-3 + j.r} glow={0.8}>
        <LockNotifs t={t + 40} at={[8, 90]} time="06:00" balance={0} />
      </PhoneShell>
    </g>
  );
};

// ---------- A12: close-up, Pip squints at the screen in bed; its light on his face; the phone's back and his hand low in frame ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.4 * (1 + 0.06 * clamp(t / len));
  const head = { x: 900, y: 560 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: -0.3, look: kf(t, [[0, 0.2], [14, 0.8]]), headTilt: kf(t, [[0, 4], [len, 7]]),
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'tired']]),
  };
  const tw = 1 + 0.04 * Math.sin(t / 3);
  return (
    <g>
      <SoftBedroom t={t + 90} id="sa12" dark={0.3} />
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
      {/* the screen's cool light from lower right, over his face */}
      <Glow x={1250} y={800} r={900 * tw} kind="cool" o={0.9} />
      <Glow x={900} y={520} r={420} kind="cool" o={0.35} />
      <g transform="translate(1330 930) rotate(-24)">
        <rect x={-130} y={-230} width={260} height={470} rx={36} fill="#14131A" stroke="#3A3846" strokeWidth={6} />
        <rect x={-130} y={-230} width={260} height={470} rx={36} fill="url(#g3cool)" opacity={0.3} />
        <circle cx={-70} cy={-170} r={22} fill="#0A0910" stroke="#3A3846" strokeWidth={4} />
      </g>
      <InsertArm x={1320} y={1060} fx={1700} fy={1300} s={4.4} rot={-20} />
    </g>
  );
};

// ---------- A13: insert, the balance on the phone: +1.000 đ every second, a second hand sweeping beside it ----------
export const A13: React.FC<ShotProps> = ({ t, len }) => {
  const sec = (t % 30) / 30;
  const tick = t % 30 < 4 ? 1 : 0;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <SoftBedroom t={t + 10} id="sa13" dark={0.55} />
      <Glow x={1040} y={560} r={900} kind="cool" o={0.5} />
      <PhoneShell id="sa13p" x={1100} y={560} s={0.74} rot={0} glow={0.7}>
        <BalanceScreen t={t} start={2000} every={30} />
      </PhoneShell>
      {/* a stopwatch face: one sweep = one second */}
      <g transform="translate(470 560)">
        <circle r={190} fill="#12181F" stroke="#CFE6FF" strokeWidth={8} opacity={0.95} />
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d="M 0 -170 L 0 -148" transform={`rotate(${i * 30})`} stroke="#9FB4D8" strokeWidth={i % 3 ? 5 : 9} strokeLinecap="round" />)}
        <path d={`M 0 12 L 0 -150`} transform={`rotate(${sec * 360})`} stroke="#FFE27A" strokeWidth={9} strokeLinecap="round" />
        <circle r={14} fill="#FFE27A" />
        <text y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fontWeight={700} fill="#F6EFE3">MỖI GIÂY</text>
        <g transform={`translate(0 -250) scale(${1 + 0.2 * tick})`}>
          <rect x={-130} y={-40} width={260} height={80} rx={40} fill="#0B1A12" stroke="#2FBF71" strokeWidth={4} />
          <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} fill="#7CF0A8">+1.000 đ</text>
        </g>
      </g>
    </g>
  );
};
