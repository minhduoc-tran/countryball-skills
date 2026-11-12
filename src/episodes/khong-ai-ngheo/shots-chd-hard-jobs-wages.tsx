import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, streetStand, walkPose, LEG_LEN, Street, Glow, LightVeil, Bokeh, FONT, ShotProps,
} from '../../engine';
import { DawnAlley } from '../tien-vo-han/che-dawn-alley-backdrop';
import { PriceTag } from '../tien-vo-han/chc-props-money-and-prices';
import { WORKER } from './cast-looks';
import { JobBoard, Notice, PhoBowl, Shirt, UpChip } from './chd-jobs-props';

// Chapter D, "hard jobs" (D1-D3, D7-D8): the help-wanted board whose wages tick up, the WORKER who walks past the
// old "lương bèo" sign, a close-up of a notice climbing, then a phở price tag and a shirt price tag nudging up.

const INK = '#1D2033';

const WarmShop: React.FC<{ t: number; seed: number; dark?: number }> = ({ t, seed, dark = 0.5 }) => (
  <g>
    <defs>
      <linearGradient id={`chd${seed}bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4A3436" />
        <stop offset="100%" stopColor="#241A22" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={1700} fill={`url(#chd${seed}bg)`} />
    <Bokeh seed={seed} n={16} x0={-100} y0={-50} w={2100} h={900} t={t} o={0.3} />
    <rect x={-400} y={-300} width={2720} height={1700} fill="#07040C" opacity={dark * 0.4} />
  </g>
);

// ---------- D1: wide: the help-wanted board by the alley at dawn; six wages tick up one after another ----------
export const D1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 0.98], [len, 1.12]]))}>
    <DawnAlley t={t + 10} id="d1a" blur={10} />
    <rect x={-400} y={-300} width={2720} height={1700} fill="#1A1220" opacity={0.28} />
    <JobBoard x={960} y={500} s={1.22} up={(t - 6) / 44} t={t} />
    <Glow x={960} y={400} r={900} o={0.2} />
  </g>
);

// ---------- D2: the WORKER strolls past the old A-frame sign "LƯƠNG 4 TR", looks, shakes his head, walks on ----------
const OldSign: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={120} ry={10} fill="#000" opacity={0.3} />
    <path d="M -90 0 L -60 -250 L 60 -250 L 90 0" fill="#7A5A3A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-72} y={-232} width={144} height={150} rx={6} fill="#EDE3CC" stroke={INK} strokeWidth={4} />
    <text x={0} y={-188} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#7A3A2C" letterSpacing={1}>TUYỂN</text>
    <text x={0} y={-130} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={52} fill={INK}>4 TR</text>
    <text x={0} y={-98} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fill="#6A6A74">LƯƠNG BÈO</text>
    <path d={`M 66 -230 q 8 ${14 + Math.sin(t / 9) * 3} 0 40`} stroke="#B9B6C0" strokeWidth={2.5} fill="none" />
  </g>
);
export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const at = streetStand(0, 3.4);
  const gy = at.y + LEG_LEN * at.scale;
  const x = kf(t, [[0, 330], [24, 760], [48, 760], [len, 1260]], (v) => v);
  const stopped = t > 22 && t < 50;
  const pose: Pose = stopped
    ? {
        ...basePose, x, y: at.y, scale: at.scale, yaw: kf(t, [[24, 0.9], [34, 0.2], [40, 0.9]]), look: kf(t, [[24, 0.5], [32, -0.6], [38, 0.6]]), headTilt: kf(t, [[24, 0], [30, -5], [36, 5], [42, 0]]),
        armR: { a: 12, b: 8 }, armL: { a: 14, b: 10 }, expr: 'neutral',
      }
    : walkPose(x, x * 0.034, gy, at.scale, { yaw: 1 });
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 1000]]), 700, 1.9)}>
      <DawnAlley t={t + 70} id="d2a" />
      <OldSign x={1020} y={gy + 6} s={0.78} t={t} />
      <Hero look={WORKER} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'worried'], [52, 'neutral']]) }} rimId="rimL" shadow={0.6} />
    </g>
  );
};

// ---------- D3: close-up: one notice, "THU GOM RÁC", the wage climbing with an arrow, more notices soft behind ----------
export const D3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#8A5E38" />
    <Bokeh seed={4} n={14} x0={0} y0={0} w={1900} h={1000} t={t} o={0.25} />
    <g filter="url(#blur10)">
      <Notice x={250} y={420} rot={-6} s={1.9} job="HÁI CÀ PHÊ" from={6} to={10} c="#F6DCCB" up={1} t={t} />
      <Notice x={1700} y={640} rot={5} s={1.9} job="QUÉT ĐƯỜNG" from={6} to={9} c="#F4E7C8" up={1} t={t + 9} />
    </g>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#07040C" opacity={0.28} />
    <Notice x={960} y={540} rot={-2} s={3.0} job="THU GOM RÁC" from={7} to={11} c="#E9F0D4" up={(t - 10) / 50} t={t} />
    <Glow x={960} y={500} r={800} o={0.25} />
  </g>
);

// ---------- D7: macro: a bowl of phở, its price tag (45.000) nudges up to 48.000 ----------
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const flip = t >= 16;
  const bounce = flip ? Math.sin((t - 16) * 0.9) * 12 * Math.exp(-(t - 16) / 9) : 0;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <WarmShop t={t} seed={7} />
      <rect x={-400} y={880} width={2720} height={500} fill="#4B3426" />
      <rect x={-400} y={880} width={2720} height={14} fill="#7A5A3C" />
      <PhoBowl x={720} y={620} s={1.55} t={t} />
      <PriceTag x={1500} y={330 + bounce} s={1.25} rot={flip ? 4 : -3} text={flip ? '48.000' : '45.000'} sub="ĐỒNG / TÔ" c={flip ? '#F6D9C8' : '#F2E6D0'} ink={flip ? '#A2281F' : INK} />
      <UpChip x={1700} y={520} k={(t - 17) / 16} s={1.1} />
      <Glow x={720} y={400} r={800} o={0.3} />
      <LightVeil id="d7veil" lights={[[720, 520, 700]]} o={0.35} />
    </g>
  );
};

// ---------- D8: a shirt on a hanger swinging gently, its tag goes 180.000 -> 190.000 ----------
export const D8: React.FC<ShotProps> = ({ t, len }) => {
  const flip = t >= 12;
  const k = backOut(clamp((t - 12) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <WarmShop t={t} seed={8} dark={0.7} />
      <rect x={-400} y={170} width={2720} height={14} fill="#B9A58A" />
      {[-1, 1].map((d) => (
        <g key={d} opacity={0.5} filter="url(#blur10)">
          <Shirt x={960 + d * 560} y={420} s={1.3} rot={Math.sin(t / 14 + d) * 3} c={d < 0 ? '#3E8C86' : '#E9C46A'} />
        </g>
      ))}
      <Shirt x={900} y={500} s={1.7} rot={Math.sin(t / 10) * 3.5} />
      <PriceTag x={1330 + (flip ? 4 : 0)} y={380} s={1.1} rot={flip ? 5 : -2} text={flip ? '190.000' : '180.000'} c={flip ? '#F6D9C8' : '#F2E6D0'} ink={flip ? '#A2281F' : INK} />
      <UpChip x={1500} y={560} k={(t - 13) / 16} s={1.1 * k} />
      <Glow x={900} y={400} r={800} o={0.25} />
    </g>
  );
};
