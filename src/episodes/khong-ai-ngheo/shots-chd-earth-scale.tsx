import React from 'react';
import {
  Hero, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, shake, settle, LEG_LEN, LOOKS, Schematic, SchLabel, CountUp, SCH, Stars, Glow, Bokeh,
  FocusRings, Sparkle, FONT, ShotProps,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { Earth, Stamp, StuffIcon, Crowd, StuffKind } from './chd-earth-and-icons-props';
import { ScaleRig, StuffPile, EnoughSet } from './chd-scale-and-stuff-props';

// Chapter D, "the cost: the planet" (D9-D16): the Earth, 8 billion people, one average American's stuff, five Earths
// popping in, "that's real", then the balance: a pile of stuff ("tiêu thật nhiều") against enough ("ai cũng đủ").

const Space: React.FC<{ t: number; seed: number }> = ({ t, seed }) => (
  <g>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#050818" />
    <Stars seed={seed} x0={-200} y0={-100} w={2320} h={1300} t={t} n={70} o={0.8} />
  </g>
);

// ---------- D9: the Earth turning in space ----------
export const D9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Space t={t} seed={9} />
    <Earth x={960} y={520} r={330} t={t} id="d9e" />
    <SchLabel x={960} y={985} t={t - 8} text="1 TRÁI ĐẤT" size={58} />
  </g>
);

// ---------- D10: 8 billion: a crowd of person icons lights up and "8 TỶ" counts ----------
export const D10: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="d10s" />
    <Crowd lit={t / 34} />
    <rect x={540} y={360} width={840} height={350} rx={50} fill="#0B1226" opacity={0.82} stroke={SCH.dim} strokeWidth={3} />
    <CountUp x={960} y={575} t={t} to={8} dur={22} size={230} suffix=" TỶ" />
    <SchLabel x={960} y={668} t={t - 14} text="NGƯỜI" size={48} color={SCH.line} />
  </g>
);

// ---------- D11: the average American, one person with a house, car, plane, TV and bags around ----------
const STUFF_AT: [StuffKind, number, number][] = [['house', 560, 340], ['car', 1360, 340], ['plane', 470, 720], ['tv', 1450, 720], ['bag', 960, 900]];
export const D11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t + 30} id="d11s" />
    <SchLabel x={960} y={140} t={t} text="NGƯỜI MỸ TRUNG BÌNH" size={58} />
    <g transform={`translate(0 ${Math.sin(t / 6) * -3})`}>
      <PersonIcon x={960} y={580} s={6} on glow />
    </g>
    {STUFF_AT.map(([k, x, y], i) => <StuffIcon key={k} kind={k} x={x} y={y} t={t - 3 - i * 3} s={1.2} />)}
  </g>
);

// ---------- D12: five Earths pop in a row: "5 TRÁI ĐẤT" ----------
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const POP = [3, 8, 12, 16, 20];
  const txt = backOut(clamp((t - 24) / 7));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Space t={t + 60} seed={12} />
      {POP.map((p, i) => {
        const k = backOut(clamp((t - p) / 6));
        return k > 0 ? <Earth key={i} x={960 + (i - 2) * 350} y={450} r={142 * k} t={t + i * 40} id={`d12e${i}`} /> : null;
      })}
      {POP.map((p, i) => (t > p && t < p + 10 ? <circle key={i} cx={960 + (i - 2) * 350} cy={450} r={142 + (t - p) * 14} fill="none" stroke="#BFE4FF" strokeWidth={6} opacity={1 - (t - p) / 10} /> : null))}
      <g transform={`translate(960 860) scale(${txt})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={170} fill="#FFE27A" stroke="#1A1230" strokeWidth={12} paintOrder="stroke" letterSpacing={3}>5 TRÁI ĐẤT</text>
      </g>
    </g>
  );
};

// ---------- D13: "that's real": Pip's jaw drops, a green stamp slams in with its source ----------
export const D13: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.45;
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 560, y: 1010 - LEG_LEN * sc, scale: sc, yaw: 0.25, armL: { a: 12, b: 6 }, armR: { a: 12, b: 6 } } },
    { f: 8, p: { armL: { a: 150, b: -10 }, armR: { a: 148, b: -10 }, headTilt: -3 } },
    { f: 20, p: { armL: { a: 140, b: 0 }, armR: { a: 138, b: 0 } } },
  ]);
  const c = shake(t, 5, 8, 7);
  return (
    <g transform={`${camT(kf(t, [[0, 960], [len, 940]]), 540, kf(t, [[0, 1.0], [len, 1.06]]))} translate(${c.x} ${c.y})`}>
      <Schematic t={t + 70} id="d13s" />
      {[0, 1, 2, 3, 4].map((i) => <Earth key={i} x={1030 + i * 160} y={190} r={58 * backOut(clamp((t - i) / 5))} t={t + i * 30} id={`d13e${i}`} />)}
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [6, 'shock']]) }} rimId="rimR" shadow={0.5} />
      <FocusRings x={560} y={430} t={t - 6} r0={90} />
      <Stamp x={1330} y={620} t={t - 6} text="THẬT" sub="GLOBAL FOOTPRINT NETWORK" rot={-7} />
    </g>
  );
};

// ---------- the balance: shared background + helpers ----------
const ScaleBg: React.FC<{ t: number; seed: number }> = ({ t, seed }) => (
  <g>
    <defs>
      <linearGradient id={`chd${seed}sb`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#15333D" />
        <stop offset="100%" stopColor="#0B1A22" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={1700} fill={`url(#chd${seed}sb)`} />
    <Bokeh seed={seed} n={12} x0={0} y0={0} w={1900} h={700} t={t} o={0.16} />
    <Glow x={960} y={420} r={820} o={0.18} />
    {/* the golden floor (the "sàn") under everything */}
    <rect x={-400} y={925} width={2720} height={500} fill="#1A2A2E" />
    <rect x={-400} y={921} width={2720} height={8} fill="#F4C95D" />
    <rect x={-400} y={905} width={2720} height={40} fill="#F4C95D" opacity={0.18} />
  </g>
);

// ---------- D14: "Hết nghèo không có nghĩa là ai cũng...": the empty scale, two plates ----------
export const D14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 0.95], [len, 1.02]]))}>
    <ScaleBg t={t} seed={14} />
    <ScaleRig x={960} y={270} ang={Math.sin(t / 10) * 2.2} t={t} capL="TIÊU THẬT NHIỀU" capR="AI CŨNG ĐỦ" capO={clamp((t - 6) / 8)} />
  </g>
);

// ---------- D15: "tiêu thật nhiều": the pile crashes onto the left pan, the beam slams down ----------
const TILT = -17;
export const D15: React.FC<ShotProps> = ({ t, len }) => {
  const hit = 14;
  const ang = kf(t, [[2, 0], [hit, TILT - 3]], easeOut) + (t > hit ? settle(t - hit, 3, 1.1, 7) : 0);
  const c = shake(t, hit, 9, 12);
  return (
    <g transform={`${camT(960, 600, kf(t, [[0, 0.97], [len, 1.05]]))} translate(${c.x} ${c.y})`}>
      <ScaleBg t={t + 40} seed={14} />
      <ScaleRig x={960} y={270} ang={ang} t={t + 20} capL="TIÊU THẬT NHIỀU" capR="AI CŨNG ĐỦ" left={(p) => <StuffPile x={p.x} y={p.y} t={t} t0={0} />} />
    </g>
  );
};

// ---------- D16: "ai cũng đủ": the pile poofs, a bowl, a roof and books land, the beam settles level on ĐỦ ----------
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const q = clamp((t - 6) / 14);
  const ang = TILT * (1 - easeOut(q)) + (t > 20 ? settle(t - 20, 3.2, 1.1, 6) : 0);
  const out = easeOut(clamp((t - 4) / 8));
  const lab = backOut(clamp((t - 19) / 7));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.02], [len, 0.97]]))}>
      <ScaleBg t={t + 60} seed={14} />
      <ScaleRig
        x={960} y={270} ang={ang} t={t + 40} capL="TIÊU THẬT NHIỀU" capR="AI CŨNG ĐỦ"
        left={(p) => (out < 1 ? <StuffPile x={p.x} y={p.y} t={t + 100} out={out} /> : null)}
        right={(p) => <EnoughSet x={p.x} y={p.y} t={t} t0={6} />}
      />
      <g transform={`translate(960 168) scale(${lab})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FFE27A" stroke="#1A1230" strokeWidth={12} paintOrder="stroke" letterSpacing={4}>ĐỦ</text>
      </g>
      <Sparkle x={780} y={110} t={t - 20} s={1.2} />
      <Sparkle x={1140} y={130} t={t - 23} s={1} />
    </g>
  );
};
