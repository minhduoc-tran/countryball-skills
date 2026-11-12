import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, rnd, camT, LOOKS, HEAD, Glow, Dust, Street, streetStand, proj, ST,
  Rooftop, Kitchen, Bedroom, BedDuvet, bedSit, Mug, Tag, FloatLabel, joints, toWorld, FONT, ShotProps,
} from '../../engine';
import { PhoneShell } from '../last-one/cha-feed-screen-ui';
import { DawnBedroom } from '../last-one/shots-cha-morning-bedroom';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { AtmKiosk, Banknote, HeldPhone } from './cha-street-props';
import { BalanceScreen, TransferScreen, BadgeScreen, ToggleScreen, ReceivedScreen } from './cha-bank-screens';

// Chapter A, shots A20-A28: the tests (ATM cash, the transfer to Mo, the balance still climbing) and the explosion
// (noon, 21.600 buzzes, the phone vibrates off the table), ending with the notifications switched off and sleep.

const PIP = LOOKS.pipHood;

// ---------- A20: wide, the ATM on the pavement: Pip taps the keypad ----------
export const A20: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 5.6;
  const atm = proj(5.3, ST.kerb, Z);
  const s = streetStand(3.95, 5.3, { sidewalk: true });
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x - 30, y: s.y, scale: s.scale, yaw: 0.65, look: 0.8, armL: { a: 8, b: -4 }, armR: { a: 8, b: -4 } } },
    { f: 8, p: { x: s.x, armR: { a: 76, b: 28 } }, ease: easeOut },
    { f: 22, p: { armR: { a: 82, b: 22 } } },
    { f: 30, p: { armR: { a: 76, b: 28 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1230], [len, 1210]]), 590, kf(t, [[0, 2.1], [len, 2.35]]))}>
      <Street t={t + 50} id="sa20" />
      <AtmKiosk x={atm.x} y={atm.y} s={(2.3 * ST.f) / Z / 430} t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [30, 'happy']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- A21: close-up pair, amazed Pip on the left, the ATM slot on the right pushing out notes ----------
export const A21: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 2.9;
  const head = { x: 1380, y: 560 };
  const cash = easeOut(clamp((t - 6) / 16));
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc + (t > 22 ? Math.sin(t) * 0 : 0), scale: sc, yaw: -0.5, look: -0.9,
    headTilt: kf(t, [[0, 0], [24, -5]]), armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, ...faceAt(t, [[0, 'neutral'], [20, 'shock']]),
  };
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
        <g filter="url(#blur16)">
          <g transform="translate(960 470) scale(2.0) translate(-960 -470)"><Street t={t + 20} id="sa21" /></g>
        </g>
        <rect x={-300} y={-300} width={2520} height={1680} fill="#120A18" opacity={0.38} />
        <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
        <AtmKiosk x={560} y={1420} s={3.1} t={t} cash={cash} screen="RÚT TIỀN" />
        {cash > 0.2 ? <Banknote x={560} y={800 + cash * 160} w={300} rot={-3} label="500.000" clip /> : null}
      </g>
      <Tag x={1060} y={200} t={t - 14} text="ĐƯỢC" mark="check" markT={5} w={300} />
    </g>
  );
};

// ---------- A22: insert, the transfer screen: 500.000 đ to Mo; a finger presses XÁC NHẬN, "THÀNH CÔNG" ----------
export const A22: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp((t - 6) / 12));
  const tap = t >= 20 && t < 26 ? 8 : 0;
  const away = easeOut(clamp((t - 34) / 8));
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 660]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <rect x={-400} y={-300} width={2720} height={1680} fill="#0A1218" />
      <Glow x={960} y={560} r={900} kind="cool" o={0.5} />
      <PhoneShell id="sa22p" x={960} y={550} s={0.8} glow={0.6}><TransferScreen t={t} /></PhoneShell>
      <InsertArm x={1010 + (1 - reach) * 220 + away * 260} y={810 + (1 - reach) * 140 + tap + away * 300} fx={1700} fy={1260} s={4.2} rot={-22} point />
    </g>
  );
};

// ---------- A23: medium, Mo on the rooftop with his phone: "+500.000 đ" lights it, he jolts in shock ----------
export const A23: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 800, scale: 1.25, yaw: 0.35, look: 0.5, armL: { a: 10, b: -4 }, armR: { a: 66, b: 118 }, headTilt: 2 } },
    { f: 8, p: { squash: -0.12, armL: { a: 70, b: 40 }, headTilt: -4 }, ease: easeOut },
    { f: 14, p: { squash: 0.05 } },
    { f: 20, p: { squash: 0 } },
  ]);
  const h = toWorld(pose, joints(pose).armR.end);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 900], [len, 920]]), 640, kf(t, [[0, 1.5], [len, 1.62]]))}>
        <Rooftop t={t + 60} sunX={1300} sunY={600} />
        <Hero look={LOOKS.mo} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [6, 'shock']]) }} rimId="rimR" shadow={0.5} />
        <HeldPhone x={h.x + 4} y={h.y - 10} s={1.1} rot={8} glow={1} />
      </g>
      <FloatLabel x={960} y={300} t={t - 4} text="+500.000 đ" color="#7CF0A8" size={110} />
    </g>
  );
};

// ---------- A24: insert, the balance still climbing fast; real notes tumble down either side ----------
export const A24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <rect x={-400} y={-300} width={2720} height={1680} fill="#0A1218" />
    <Glow x={960} y={560} r={950} kind="cool" o={0.5} />
    {[0, 1].map((side) => Array.from({ length: 7 }).map((_, i) => {
      const p = (t / 52 + rnd(side + 3, i)) % 1;
      const x = side ? 1480 + rnd(5, i + side) * 360 : 80 + rnd(7, i) * 360;
      return <Banknote key={`${side}${i}`} x={x + Math.sin(p * 9 + i) * 40} y={-120 + p * 1400} s={0.9 + rnd(2, i) * 0.5} rot={Math.sin(p * 7 + i) * 50} w={190} label="500.000" />;
    }))}
    <PhoneShell id="sa24p" x={960} y={545} s={0.78} glow={0.6}><BalanceScreen t={t} start={1200000} every={3} /></PhoneShell>
  </g>
);

// ---------- A25: macro, the wall clock racing to 12:00 and stopping with a shudder ----------
export const A25: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 14));
  const over = t > 14 && t < 22 ? Math.sin((t - 14) * 1.6) * 3 * (1 - (t - 14) / 8) : 0;
  const hourA = 330 * (1 - k) + over * 0.2;
  const minA = (-720 * (1 - k)) + over;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-480 -520) scale(1.9)"><Kitchen t={t + 70} id="sa25" veil={0.36} /></g>
      </g>
      <rect x={-400} y={-300} width={2720} height={1680} fill="#0A0814" opacity={0.3} />
      <Glow x={960} y={540} r={760} o={0.45} />
      <g transform="translate(960 540)">
        <circle r={380} fill="#1E1A22" /><circle r={350} fill="#F2E8D2" stroke="#6A5A4A" strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => (
          <text key={i} transform={`rotate(${i * 30}) translate(0 -290) rotate(${-i * 30})`} textAnchor="middle" y={22} fontFamily={FONT.hand} fontSize={i % 3 ? 54 : 74} fontWeight={700} fill="#3A2A22">{i === 0 ? 12 : i}</text>
        ))}
        <path d="M 0 20 L 0 -190" transform={`rotate(${hourA})`} stroke="#2A1E1A" strokeWidth={22} strokeLinecap="round" />
        <path d="M 0 30 L 0 -280" transform={`rotate(${minA})`} stroke="#2A1E1A" strokeWidth={14} strokeLinecap="round" />
        <circle r={20} fill="#C0392B" />
      </g>
    </g>
  );
};

// ---------- A26: top view of a table: the phone's badge 21.600 and it vibrates across the wood toward the edge ----------
export const A26: React.FC<ShotProps> = ({ t, len }) => {
  const count = Math.floor(21600 * easeOut(clamp(t / 40)));
  const d = easeOut(clamp(t / len));
  const jx = Math.sin(t * 9.7) * 16 + Math.sin(t * 4.1) * 8;
  const jy = Math.sin(t * 8.3) * 12;
  const jr = Math.sin(t * 6.3) * 4 + d * 14;
  const sh = { x: Math.sin(t * 5.1) * 6, y: Math.cos(t * 6.7) * 5 };
  return (
    <g transform={`translate(${sh.x} ${sh.y})`}>
      <rect x={-60} y={-60} width={2040} height={1200} fill="#8A5E3C" />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M -60 ${i * 150} L 2000 ${i * 150 + 12}`} stroke="#6E4A2E" strokeWidth={6} opacity={0.7} />)}
      <rect x={-60} y={-60} width={2040} height={1200} fill="url(#g3warm)" opacity={0.2} />
      <g transform="translate(1560 360) scale(2.6)"><Mug x={0} y={Math.abs(Math.sin(t * 4)) * 3} rot={Math.sin(t * 5) * 3} steam={0} f={t} /></g>
      {Array.from({ length: 4 }).map((_, i) => {
        const p = ((t / 8 + i / 4) % 1);
        return [-1, 1].map((sd) => <path key={`${i}${sd}`} d={`M ${960 + jx + sd * (330 + 150 * p)} ${540 + jy - 120} q ${sd * 40} 90 0 180`} stroke="#FFF3D0" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.8 * (1 - p)} />);
      })}
      <g transform={`translate(${960 - d * 40 + jx} ${540 + d * 70 + jy}) rotate(${jr})`}>
        <PhoneShell id="sa26p" x={0} y={0} s={0.7} glow={0.5}><BadgeScreen t={t} count={count} /></PhoneShell>
      </g>
      {Array.from({ length: 9 }).map((_, i) => {
        const p = ((t / 14 + rnd(3, i)) % 1);
        const a = rnd(8, i) * 6.28;
        return <text key={i} x={960 + Math.cos(a) * (300 + 700 * p)} y={540 + Math.sin(a) * (300 + 420 * p)} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#7CF0A8" stroke="#0B1A12" strokeWidth={5} paintOrder="stroke" opacity={1 - p}>+1.000 đ</text>;
      })}
    </g>
  );
};

// ---------- A27: insert, the settings toggle "Thông báo": a finger flicks it OFF ----------
export const A27: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp((t - 2) / 10));
  const flick = t >= 14 ? Math.min(1, (t - 14) / 4) : 0;
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 450]]), kf(t, [[0, 1.0], [len, 1.4]]))}>
      <rect x={-400} y={-300} width={2720} height={1680} fill="#0A1218" />
      <Glow x={960} y={560} r={900} kind="cool" o={0.5} />
      <PhoneShell id="sa27p" x={960} y={620} s={0.86} glow={0.6}><ToggleScreen t={t} off={16} /></PhoneShell>
      <InsertArm x={1160 - flick * 40 + (1 - reach) * 300} y={410 + (1 - reach) * 300} fx={1760} fy={1160} s={4.0} rot={-28} point />
    </g>
  );
};

// ---------- A28: medium, Pip flops back onto the pillow, the phone slipping from his hand; midday light, the room goes quiet ----------
export const A28: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const fall = easeOut(clamp((t - 6) / 12));
  const pose: Pose = {
    ...basePose, x: b.x + 60 * fall, y: b.y + 8 * fall + Math.sin(t / 8) * 1.0, scale: b.scale, yaw: -0.4, look: kf(t, [[0, -0.5], [10, 0]]),
    tilt: -78 * fall, headTilt: 6 * fall, armL: { a: 8 + 36 * fall, b: -6 }, armR: { a: 14 + 40 * fall, b: -6 },
  };
  const out = t >= 18 ? { blink: 1 } : {};
  return (
    <g transform={camT(kf(t, [[0, 780], [len, 750]]), kf(t, [[0, 520], [len, 505]]), kf(t, [[0, 1.8], [len, 2.0]]))}>
      <DawnBedroom t={t + 200} id="sa28" duvet={false} clock="12:00" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [14, 'happy'], [24, 'tired']]), ...out }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
      <HeldPhone x={b.x - 90 + fall * 50} y={b.y - 120 + fall * 150} s={1.1} rot={40 * fall} glow={1 - fall * 0.8} />
      {[0, 1, 2].map((i) => {
        const p = ((t - 20) / 40 + i / 3) % 1;
        return t > 20 ? <text key={i} x={b.x - 30 + p * 80} y={b.y - 250 - p * 120} fontFamily={FONT.hand} fontSize={30 + i * 10} fill="#CFE6FF" opacity={Math.sin(p * Math.PI) * 0.85}>Z</text> : null;
      })}
    </g>
  );
};
