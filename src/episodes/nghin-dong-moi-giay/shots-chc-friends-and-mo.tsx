import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Glow, Study, Desk, Street, streetStand, joints, toWorld,
  Schematic, SchLabel, SCH, Sparkle, ShotProps, FONT,
} from '../../engine';
import { PhoneShell } from '../last-one/cha-feed-screen-ui';
import { NumCard, RequestsScreen, CallBubble } from './chc-ui-phone-screens-cards-chips';

// Chapter C, cost 3: new friends. The "3 · BẠN MỚI" card, friend requests flooding in, distant relatives ringing,
// requests for money outnumbering "how are you", then Mo at the street stall who won't let Pip pay for the water.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;

// ---------- C30: card "3 · BẠN MỚI" ----------
export const C30: React.FC<ShotProps> = ({ t, len }) => <NumCard t={t} len={len} n={3} word="BẠN MỚI" icon="people" id="c30s" />;

// ---------- C31: close: a phone swamped with friend requests, new faces pop in around it ----------
export const C31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <g filter="url(#blur16)"><g transform="translate(-320 -300) scale(1.4)"><Study t={t + 100} id="c31b" night /></g></g>
    <rect x={-300} y={-300} width={2600} height={1700} fill="#0A0A16" opacity={0.3} />
    <PhoneShell id="c31p" x={960} y={560} s={0.74} rot={-3 + Math.sin(t * 0.1) * 1.5} glow={0.8}>
      <RequestsScreen t={t + 8} />
    </PhoneShell>
    {[[520, 300, 0], [1420, 420, 1], [480, 740, 2], [1450, 780, 3], [700, 150, 4]].map(([x, y, i], k) => {
      const p = backOut(clamp((t - 6 - k * 5) / 7));
      return (
        <g key={k} transform={`translate(${x} ${y + Math.sin(t * 0.2 + k) * 6}) scale(${p})`}>
          <circle r={58} fill={['#E9A0A0', '#8FB4D9', '#E9C46A', '#9BC9A0', '#B9A0D9'][k]} stroke="#0B0816" strokeWidth={5} />
          <circle cy={-12} r={18} fill="#F6EFE3" />
          <path d="M -32 38 Q 0 -10 32 38 Z" fill="#F6EFE3" />
          <g transform="translate(40 -44)"><circle r={20} fill="#2B7BD6" /><path d="M -9 0 H 9 M 0 -9 V 9" stroke="#fff" strokeWidth={5} strokeLinecap="round" /></g>
        </g>
      );
    })}
  </g>
);

// ---------- C32: medium: Pip at his desk, call bubbles from relatives pop up all around him ----------
const NAMES = [['CHÚ BA', 560, 330], ['DÌ TƯ', 1330, 330], ['ANH HỌ', 470, 560], ['BÁC CẢ', 1450, 560], ['CÔ SÁU', 700, 190], ['CẬU TƯ', 1180, 200]] as const;
export const C32: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, scale: 1, yaw: 0.1, look: 0.3, armL: { a: 20, b: 20 }, armR: { a: 20, b: 20 } } },
    { f: 30, p: { armL: { a: 60, b: 80 }, armR: { a: 60, b: 80 }, headTilt: -4 }, ease: easeOut },
    { f: 60, p: { headTilt: 4, look: -0.4 } },
  ]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.05], [len, 1.2]]))}>
      <Study t={t + 60} id="c32s" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [10, 'shock'], [44, 'worried']]) }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} laptop={false} lamp={false} />
      {NAMES.map(([n, x, y], i) => <CallBubble key={n} x={x} y={y} t={t} at={4 + i * 11} name={n} s={0.95} />)}
    </g>
  );
};

// ---------- C33: schematic: bars of messages: HỎI VAY TIỀN tall, HỎI THĂM tiny ----------
export const C33: React.FC<ShotProps> = ({ t, len }) => {
  const a = easeOut(clamp((t - 8) / 26));
  const b = easeOut(clamp((t - 36) / 10));
  const base = 860;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t + 20} id="c33s" />
      <SchLabel x={960} y={150} t={t - 2} text="TIN NHẮN GỬI ĐẾN" size={54} />
      <path d={`M 420 ${base + 14} L 1500 ${base + 14}`} stroke={SCH.line} strokeWidth={5} strokeLinecap="round" />
      <rect x={560} y={base - 540 * a} width={260} height={540 * a} rx={10} fill="rgba(255,138,61,0.55)" stroke={SCH.live} strokeWidth={7} style={{ filter: `drop-shadow(0 0 ${18 * a}px ${SCH.glow})` }} />
      <rect x={1100} y={base - 54 * b} width={260} height={54 * b} rx={8} fill="rgba(124,240,168,0.45)" stroke="#7CF0A8" strokeWidth={6} />
      <SchLabel x={690} y={base + 76} t={t - 30} text="HỎI VAY TIỀN" size={40} color={SCH.live} />
      <SchLabel x={1230} y={base + 76} t={t - 46} text="HỎI THĂM" size={40} color="#7CF0A8" />
      <g opacity={clamp((t - 30) / 8)} transform={`translate(690 ${base - 540 * a - 70}) scale(${backOut(clamp((t - 30) / 8))})`}>
        <circle r={52} fill={SCH.live} /><text y={22} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={70} fill="#101A2A">đ</text>
      </g>
      <Sparkle x={1230} y={base - 140} t={t - 50} s={1.1} />
    </g>
  );
};

/** A football, x y the centre. */
const Ball: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle r={34} fill="#F6EFE3" stroke="#14121C" strokeWidth={4} />
    <path d="M 0 -14 L 13 -4 L 8 12 L -8 12 L -13 -4 Z" fill="#14121C" />
    <path d="M 0 -14 V -34 M 13 -4 L 32 -10 M 8 12 L 20 28 M -8 12 L -20 28 M -13 -4 L -32 -10" stroke="#14121C" strokeWidth={3.5} />
  </g>
);

// ---------- C34: wide street: Mo bounces a football and waves Pip over to play, as every afternoon ----------
export const C34: React.FC<ShotProps> = ({ t, len }) => {
  const m = streetStand(-1.0, 5.2);
  const p = streetStand(1.1, 5.2);
  const wave = Math.sin(t * 0.5) * 10;
  const mo = poseAt(t, [{ f: 0, p: { x: m.x, y: m.y, scale: m.scale, yaw: 0.55, look: 0.7, armL: { a: 20, b: 80 }, armR: { a: 150 + wave, b: 20 } } }]);
  const pip = poseAt(t, [{ f: 0, p: { x: p.x, y: p.y, scale: m.scale, yaw: -0.5, look: -0.6, armL: { a: 12, b: 10 }, armR: { a: 12, b: 10 } } }, { f: 24, p: { armR: { a: 60, b: 50 } }, ease: easeOut }]);
  const bounce = Math.abs(Math.sin(t * 0.3));
  const h = toWorld(mo, joints(mo).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 950], [len, 965]]), 700, kf(t, [[0, 1.7], [len, 1.95]]))}>
      <Street t={t + 160} id="c34s" />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Ball x={h.x + 16} y={h.y + 40 - bounce * 40} s={0.8} rot={t * 6} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [18, 'happy']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- C35: medium: at the drinks stall Pip holds out a note, Mo pushes his hand back and shakes his head ----------
export const C35: React.FC<ShotProps> = ({ t, len }) => {
  const push = easeOut(clamp((t - 22) / 10));
  const m = streetStand(-0.6, 4.4);
  const p = streetStand(0.9, 4.4);
  const mo = poseAt(t, [
    { f: 0, p: { x: m.x, y: m.y, scale: m.scale, yaw: 0.5, look: 0.6, armL: { a: 20, b: 80 }, armR: { a: 14, b: 10 } } },
    { f: 22, p: { armR: { a: 80, b: 30 }, headTilt: -4 }, ease: easeOut },
    { f: 36, p: { armR: { a: 84, b: 20 }, headTilt: 5 } },
  ]);
  const pip = poseAt(t, [{ f: 0, p: { x: p.x, y: p.y, scale: m.scale, yaw: -0.5, look: -0.7, armL: { a: 12, b: 10 }, armR: { a: 84, b: 20 } } }, { f: 22, p: { armR: { a: 84, b: 20 } } }, { f: 34, p: { armR: { a: 60, b: 70 } }, ease: easeOut }]);
  const note = toWorld(pip, joints(pip).armR.end);
  const bottle = toWorld(mo, joints(mo).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 600, kf(t, [[0, 1.9], [len, 2.1]]))}>
      <Street t={t + 190} id="c35s" market={1} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'neutral'], [22, 'oops']]) }} rimId="rimR" shadow={0} />
      <rect x={bottle.x - 8} y={bottle.y - 52} width={16} height={56} rx={6} fill="#7CC8F0" stroke="#14121C" strokeWidth={3} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [26, 'worried']]) }} rimId="rimL" shadow={0} />
      <g transform={`translate(${note.x} ${note.y - 10}) rotate(${-14 - push * 20})`}>
        <rect x={-30} y={-16} width={60} height={32} rx={3} fill="#9ED8A8" stroke="#2A5A3A" strokeWidth={3} />
        <text y={9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#2A5A3A">đ</text>
      </g>
      <Glow x={m.x} y={m.y - 120} r={260} o={0.2} />
    </g>
  );
};

// ---------- C36: close on Mo: shy, eyes down, a blush, looking away ----------
export const C36: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 2.8 * (1 + 0.05 * clamp(t / len));
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 0, scale: sc, yaw: 0.35, look: -0.8, armL: { a: 14, b: 10 }, armR: { a: 14, b: 10 }, headTilt: 2 } },
    { f: 30, p: { headTilt: 8, look: -1, yaw: 0.5 }, ease: easeOut },
  ]);
  return (
    <g>
      <g filter="url(#blur16)"><g transform="translate(-300 -240) scale(1.4)"><Street t={t + 200} id="c36s" market={1} /></g></g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.3} />
      <Hero look={MO} pose={{ ...pose, y: 470 + 176 * sc, ...faceAt(t, [[0, 'oops']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};
