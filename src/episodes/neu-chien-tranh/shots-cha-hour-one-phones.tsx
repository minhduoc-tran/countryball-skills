import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, Glow, FONT, HEAD, Rooftop, rnd, shake, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { PIP, CafeBack } from './cha-cafe-and-alley-props';
import { PhoneFrame, AlertPhone, BusyPhone, CallLogPhone, FeedPhone } from './cha-phone-screens';

// Chapter A, hour one, the phones (A13-A18, 23.14-36.64 s): the alert arrives, the siren over the rooftops, the whole
// city calls at once, the network says MẠNG BẬN, five missed calls to mum, a feed of rumours, and Pip not knowing.
// A13 runs in the "alert" look.

const DARK_CAFE: React.FC<{ t: number; id: string; o?: number }> = ({ t, id, o = 0.55 }) => (
  <g>
    <CafeBack t={t} id={id} blur={16} />
    <rect x={-300} y={-300} width={2520} height={1700} fill="#0A0814" opacity={o} />
  </g>
);

// ---------- A13: macro: Pip's phone on its lock screen (14:07, Chủ nhật), then the emergency alert slams in ----------
export const A13: React.FC<ShotProps> = ({ t, len }) => {
  const alert = t >= 32;
  const sh = shake(t, 32, 10, 12);
  return (
    <g transform={`translate(${sh.x} ${sh.y})`}>
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
        <DARK_CAFE t={t + 30} id="a13st" />
        {alert ? (
          <AlertPhone id="a13p" x={960} y={560} w={440} rot={-3} t={t} />
        ) : (
          <PhoneFrame id="a13l" x={960} y={540} w={440} rot={-3} screen="#2C3A5E">
            <rect x={-220} y={-451} width={440} height={902} fill="#34466E" />
            <text x={0} y={-170} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={104} fill="#F6EFE3">14:07</text>
            <text x={0} y={-118} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#CFE6FF" opacity={0.85}>Chủ nhật</text>
            <g transform={`translate(0 ${60 - 40 * clamp((t - 22) / 8)})`} opacity={clamp((t - 22) / 6)}>
              <rect x={-190} y={0} width={380} height={96} rx={24} fill="#FFFFFF" opacity={0.9} />
              <rect x={-166} y={24} width={46} height={46} rx={12} fill="#D2261A" />
              <rect x={-106} y={26} width={200} height={14} rx={7} fill="#2A2E40" />
              <rect x={-106} y={52} width={140} height={12} rx={6} fill="#8A8E9C" />
            </g>
          </PhoneFrame>
        )}
        <Glow x={960} y={560} r={700} kind={alert ? 'red' : 'cool'} o={alert ? 0.6 : 0.45} />
        <InsertArm x={1090} y={930} fx={1500} fy={1250} rot={-18} s={4.2} width={110} />
      </g>
    </g>
  );
};

// ---------- A14: wide: a siren horn on a pole over the rooftops, its rings spreading; phones glow in the windows ----------
export const A14: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = 0.5 + 0.5 * Math.sin(t / 3);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Rooftop t={t + 20} sunX={1300} sunY={620} cityLit={1.6} />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#2A0A20" opacity={0.28} />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#B3101E" opacity={0.18 + 0.16 * pulse} style={{ mixBlendMode: 'multiply' }} />
      {/* the pole and the horn */}
      <rect x={252} y={170} width={16} height={640} fill="#1A1624" />
      <path d="M 260 190 L 400 120 L 400 280 Z" fill="#2A2438" stroke="#0E0B14" strokeWidth={5} />
      <rect x={236} y={176} width={36} height={64} rx={8} fill="#2A2438" stroke="#0E0B14" strokeWidth={5} />
      {[0, 1, 2, 3].map((i) => {
        const p = ((t / 22 + i / 4) % 1);
        return <path key={i} d={`M ${400 + p * 420} ${200 - p * 320} Q ${400 + p * 540} 200 ${400 + p * 420} ${200 + p * 320}`} stroke="#FF5A4A" strokeWidth={16 - p * 11} fill="none" opacity={(1 - p) * 0.9} strokeLinecap="round" />;
      })}
      <Glow x={380} y={200} r={320} kind="red" o={0.4 + 0.3 * pulse} />
      {/* calls rising from the city: little phone glows lifting out of the windows */}
      {Array.from({ length: 22 }).map((_, i) => {
        const at = 14 + rnd(3, i) * 40;
        const p = clamp((t - at) / 26);
        if (p <= 0) return null;
        const x = 520 + rnd(4, i) * 1300;
        const y0 = 640 - rnd(5, i) * 120;
        return (
          <g key={i} opacity={Math.sin(p * Math.PI)} transform={`translate(${x + Math.sin(t / 8 + i) * 10} ${y0 - p * 220})`}>
            <rect x={-9} y={-16} width={18} height={30} rx={4} fill="#CFE6FF" />
            <path d="M 14 -12 q 8 10 0 22 M 22 -18 q 14 16 0 34" stroke="#CFE6FF" strokeWidth={3} fill="none" strokeLinecap="round" />
            <Glow x={0} y={0} r={50} kind="cool" o={0.6} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- A15: macro: the call won't go through: MẠNG BẬN, signal bars dying, a wall of busy phones behind ----------
export const A15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <rect x={-300} y={-300} width={2520} height={1700} fill="#141A2C" />
    <g filter="url(#blur10)" opacity={0.7}>
      {Array.from({ length: 12 }).map((_, i) => {
        const cx = 160 + (i % 6) * 320;
        const cy = 250 + Math.floor(i / 6) * 520 + Math.sin(t / 10 + i) * 10;
        return (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            <rect x={-60} y={-120} width={120} height={240} rx={22} fill="#1B2236" stroke="#3A4560" strokeWidth={5} />
            <path d="M -26 -26 L 26 26 M 26 -26 L -26 26" stroke="#FF5A4A" strokeWidth={9} strokeLinecap="round" opacity={0.5 + 0.4 * Math.sin(t / 5 + i)} />
          </g>
        );
      })}
    </g>
    <BusyPhone id="a15p" x={960} y={540} w={440} rot={2} t={t} />
    <Glow x={960} y={560} r={640} kind="red" o={0.3} />
    <InsertArm x={1090} y={940} fx={1500} fy={1260} rot={-18} s={4.2} width={110} />
  </g>
);

// ---------- A16: the call log: Mẹ, Mẹ, Mẹ, Mẹ, Mẹ, all missed, red; a big ×5 stamps in; KHÔNG ĐƯỢC ----------
export const A16: React.FC<ShotProps> = ({ t, len }) => {
  const badge = backOut(clamp((t - 40) / 8));
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1030]]), 540, kf(t, [[0, 1.12], [len, 1.22]]))}>
      <DARK_CAFE t={t + 90} id="a16st" o={0.6} />
      <CallLogPhone id="a16p" x={800} y={540} w={440} t={t} n={5} t0={3} every={7} failT={50} />
      <g transform={`translate(1330 420) rotate(-8) scale(${badge})`}>
        <circle r={170} fill="#D2261A" stroke="#fff" strokeWidth={12} />
        <text y={46} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={170} fill="#fff">×5</text>
      </g>
      <Glow x={820} y={560} r={600} kind="red" o={0.25} />
    </g>
  );
};

// ---------- A17: the feed floods: posts blur past, question marks fly off the screen ----------
export const A17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.08], [len, 1.18]]))}>
    <DARK_CAFE t={t + 150} id="a17st" o={0.65} />
    <FeedPhone id="a17p" x={960} y={540} w={440} t={t} speed={13} />
    {Array.from({ length: 12 }).map((_, i) => {
      const p = clamp((t - i * 3) / 30);
      if (p <= 0) return null;
      const ang = (i / 12) * Math.PI * 2 + 0.3;
      const r = 200 + p * 520;
      return (
        <text key={i} x={960 + Math.cos(ang) * r * 1.2} y={560 + Math.sin(ang) * r * 0.9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={90 + (i % 3) * 40} fill={i % 2 ? '#F2B84B' : '#FF5A4A'} opacity={Math.sin(p * Math.PI)} transform={`rotate(${(i - 6) * 9} ${960 + Math.cos(ang) * r * 1.2} ${560 + Math.sin(ang) * r * 0.9})`}>?</text>
      );
    })}
  </g>
);

// ---------- A18: close-up: Pip's face lit from below by the screen, "?" drifting round him; he doesn't know ----------
export const A18: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 3.2], [len, 3.6]]);
  const head = { x: 960, y: 520 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.25, look: kf(t, [[0, -0.5], [20, 0.6], [40, -0.3]]),
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 2], [len, -4]]), ...faceAt(t, [[0, 'worried'], [30, 'shock'], [44, 'worried']]),
  };
  return (
    <g>
      <g filter="url(#blur16)"><DARK_CAFE t={t + 200} id="a18st" o={0.5} /></g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.35} />
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
      {[0, 1, 2, 3, 4].map((i) => (
        <text key={i} x={300 + i * 330 + Math.sin(t / 12 + i) * 20} y={300 + ((i * 97) % 300) - ((t * 1.2 + i * 40) % 80)} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={120} fill="#CFE6FF" opacity={0.35 + 0.2 * Math.sin(t / 9 + i)}>?</text>
      ))}
      <g filter="url(#blur10)">
        <rect x={760} y={930} width={400} height={400} rx={60} fill="#BFD8F5" opacity={0.7} transform="rotate(-6 960 1000)" />
      </g>
      <Glow x={960} y={900} r={700} kind="cool" o={0.55} />
    </g>
  );
};
