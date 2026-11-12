import React from 'react';
import {
  Hero, poseAt, faceAt, walkPose, joints, toWorld, kf, clamp, easeOut, camT, LOOKS, Glow, Stairwell, Banister, SW, hipGround, Tabletop, LightVeil,
  Foreground, FloatLabel, ShotProps,
} from '../../engine';
import { PhoneShell } from '../last-one/cha-feed-screen-ui';
import { NumCard, CallScreen } from './chc-ui-phone-screens-cards-chips';

// Chapter C, cost 2: people start to notice. The "2 · BỊ ĐỂ Ý" card, the bank and the tax office ringing, and a man in
// a suit climbing to Pip's door with a folder, asking where the money came from.

const PIP = LOOKS.pipHood;
const SUIT = LOOKS.suit;
const SC = 0.95;

// ---------- C24: card "2 · BỊ ĐỂ Ý" ----------
export const C24: React.FC<ShotProps> = ({ t, len }) => <NumCard t={t} len={len} n={2} word="BỊ ĐỂ Ý" icon="eye" id="c24s" />;

/** A phone ringing on a dark table: the screen shakes, ripples go out; `rot` and `wood` vary the angle shot to shot. */
const RingingPhone: React.FC<{ t: number; len: number; who: string; icon: 'bank' | 'tax'; rot: number; id: string; tint: string }> = ({ t, len, who, icon, rot, id, tint }) => {
  const ring = t % 14 < 9 ? 1 : 0;
  const jx = ring * Math.sin(t * 9.1) * 7;
  return (
    <g transform={`translate(960 540) rotate(${rot + t * 0.06}) scale(${kf(t, [[0, 1.0], [len, 1.12]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood={tint} grain="#2E2638" lip="#4A3E56" floor="#18121E" floorLines="#120D18" kind="stone" />
      <LightVeil id={`${id}veil`} lights={[[960, 540, 640]]} o={0.62} />
      {[0, 1, 2].map((k) => { const p = ((t * 0.045 + k / 3) % 1); return <circle key={k} cx={960 + jx} cy={540} r={330 + 420 * p} fill="none" stroke="#CFE6FF" strokeWidth={7} opacity={0.4 * (1 - p)} />; })}
      <PhoneShell id={id} x={960 + jx} y={560} s={0.7} rot={ring * Math.sin(t * 5) * 2} glow={0.9}>
        <CallScreen t={t} who={who} icon={icon} />
      </PhoneShell>
    </g>
  );
};

// ---------- C25: top-down: the phone rings, NGÂN HÀNG ----------
export const C25: React.FC<ShotProps> = (p) => <RingingPhone {...p} who="NGÂN HÀNG" icon="bank" rot={-5} id="c25p" tint="#4A3A44" />;
// ---------- C26: tilted: the next call, CƠ QUAN THUẾ ----------
export const C26: React.FC<ShotProps> = (p) => <RingingPhone {...p} who="CƠ QUAN THUẾ" icon="tax" rot={7} id="c26p" tint="#3A3446" />;

/** A manila folder held at (x, y), tilted by `rot`. */
const Folder: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-46} y={-60} width={92} height={120} rx={6} fill="#D9B36A" stroke="#6A4A1E" strokeWidth={4} />
    <path d="M -46 -60 L -46 -72 L -8 -72 L 0 -60 Z" fill="#C79F52" stroke="#6A4A1E" strokeWidth={4} />
    <path d="M -28 -20 H 28 M -28 4 H 28 M -28 28 H 10" stroke="#8A6A32" strokeWidth={5} strokeLinecap="round" />
  </g>
);

const stairLight = (id: string) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#2A2F6A" opacity={0.42} style={{ mixBlendMode: 'multiply' }} />
    <Glow x={330} y={330} r={420} o={0.45} />
    <Glow x={1500} y={760} r={420} kind="cool" o={0.3} />
  </g>
);

// ---------- C27: wide: the man in the suit climbs the stairs toward the landing, folder under his arm ----------
export const C27: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1360], [len, 520]], (u) => u);
  const ph = t * 0.55;
  const pose = { ...walkPose(x, ph, hipGround, SC, { armL: { a: 38, b: 96 }, armR: { a: -24 * Math.sin(ph), b: 20 }, expr: 'neutral', look: -0.4 }, -1), blink: 0 };
  const hand = toWorld(pose, joints(pose).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 800]]), 560, kf(t, [[0, 1.0], [len, 1.25]]))}>
      <Stairwell t={t + 200} id="c27w" />
      {stairLight('c27')}
      <Hero look={SUIT} pose={pose} shadow={0.5} rimId="rimBlue" />
      <Folder x={hand.x - 6} y={hand.y + 6} rot={-8} s={0.9} />
      <Banister />
    </g>
  );
};

// ---------- C28: medium: the man stops at the landing by the lit door, stern, taps the folder ----------
export const C28: React.FC<ShotProps> = ({ t, len }) => {
  const g = SW.top;
  const tap = Math.max(0, Math.sin(t * 0.5)) * 8;
  const pose = poseAt(t, [
    { f: 0, p: { x: 400, y: g - 140 * 1.0 - 4, scale: 1.0, yaw: -0.85, facing: -1, look: -0.8, armL: { a: 30, b: 96 }, armR: { a: 12, b: 10 }, headTilt: 2 } },
    { f: 20, p: { headTilt: -3, look: -0.9, tilt: -4 }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 500], [len, 470]]), 330, kf(t, [[0, 1.5], [len, 1.8]]))}>
      <Stairwell t={t + 240} id="c28w" />
      {stairLight('c28')}
      <Hero look={SUIT} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0.5} rimId="rimR" />
      <Folder x={hand.x - 4} y={hand.y + 2 - tap} rot={-10 + tap * 0.4} s={1.1} />
      <FloatLabel x={200} y={150} t={t - 18} text="?" size={110} color="#FF8A6A" />
    </g>
  );
};

// ---------- C29: close: Pip at the door, a big blurred shoulder in front: he shrugs, oops, a gulp ----------
export const C29: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1180, y: 690, scale: 2.0, yaw: -0.25, look: -0.7, armL: { a: 20, b: 20 }, armR: { a: 20, b: 20 }, headTilt: -2 } },
    { f: 14, p: { armL: { a: 74, b: 90 }, armR: { a: 74, b: 90 }, headTilt: 6, look: 0.2 }, ease: easeOut },
    { f: 40, p: { armL: { a: 70, b: 96 }, armR: { a: 70, b: 96 }, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <g filter="url(#blur16)"><g transform="translate(-200 -140) scale(1.5)"><Stairwell t={t + 260} id="c29w" /></g></g>
      <rect x={-300} y={-300} width={2600} height={1700} fill="#0A0A22" opacity={0.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [10, 'oops']]) }} shadow={0} rimId="rimBlue" />
      <g opacity={clamp((t - 14) / 6)} transform={`translate(1360 ${340 + Math.min(40, Math.max(0, t - 14) * 2)})`}>
        <path d="M 0 -26 Q 22 6 0 24 Q -22 6 0 -26 Z" fill="#8FD0FF" stroke="#4A90C8" strokeWidth={4} />
      </g>
      <Foreground blur={16}><path d="M -100 1100 L -60 560 Q 120 420 360 520 Q 520 640 540 1100 Z" fill="#0A0A16" /></Foreground>
    </g>
  );
};
