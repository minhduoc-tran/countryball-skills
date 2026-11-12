import React from 'react';
import { Hero, Glow, Dust, Sparkle, poseAt, faceAt, joints, toWorld, kf, clamp, easeOut, easeIn, backOut, camT, LOOKS, FONT, ShotProps } from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { WORKER } from '../khong-ai-ngheo/cast-looks';
import { WarmCounter, PayEnvelope } from './chb-shop-props';
import { CompanyGate, BankFront, BigPhone, ScamPopup, RedFlag, ContractPaper, HoodedScammer, BalanceDigits, BALANCE } from './chb-money-props';

// Chapter B, "day one: money" (B17-B24): Mo's dad at the company gate with an empty pay envelope (B17), the contract that
// dissolves (B18), the bank shuts its grille (B19), Pip checks his balance (B20), the number floats away (B21) and
// has nothing under it (B22), then the scam pop-ups flood the phone (B23) and nobody is fined (B24).

const PIP = LOOKS.pipHood;
const NIGHT_BG = '#0E1426';

// ---------- B17: medium: Mo's dad at the shut gate opens his pay envelope: empty ----------
export const B17: React.FC<ShotProps> = ({ t, len }) => {
  const dad = poseAt(t, [
    { f: 0, p: { x: 1090, y: 718, scale: 1.3, yaw: -0.4, facing: -1, armL: { a: 52, b: 78 }, armR: { a: 8, b: -6 }, headTilt: 0 } },
    { f: 20, p: { armL: { a: 56, b: 82 } } },
    { f: 34, p: { armL: { a: 48, b: 70 }, headTilt: 4 } },
    { f: 46, p: { armL: { a: 54, b: 78 }, headTilt: -3 } },
  ]);
  const hand = toWorld(dad, joints(dad).armL.end);
  const open = clamp((t - 16) / 10);
  const shakeY = Math.sin(t * 1.3) * 5 * (t > 30 && t < 46 ? 1 : 0);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), 470, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <CompanyGate t={t} />
      <Hero look={WORKER} pose={{ ...dad, ...faceAt(t, [[0, 'neutral'], [18, 'worried'], [34, 'tired']]) }} rimId="rimL" shadow={0} />
      <PayEnvelope x={hand.x - 52} y={hand.y - 40 + shakeY} s={0.55} rot={-14} open={open} />
      <Glow x={1440} y={330} r={320} o={0.2} />
    </g>
  );
};

// ---------- B18: insert: the contract on the desk dissolves line by line; the empty envelope lies beside it ----------
export const B18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 580]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <WarmCounter t={t} />
    <PayEnvelope x={420} y={820} s={1.5} rot={-12} open={1} />
    <ContractPaper x={1000} y={170} t={t} gone={kf(t, [[12, 0], [len - 8, 1]])} s={1.35} rot={-3} />
    <Dust t={t} seed={18} x0={600} y0={100} w={900} h={700} n={26} o={0.6} />
  </g>
);

// ---------- B19: the bank's grille rolls down over the doors and a padlock drops on it ----------
export const B19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(880, kf(t, [[0, 470], [len, 560]]), kf(t, [[0, 0.88], [len, 1.15]]))}>
    <BankFront grille={kf(t, [[3, 0], [20, 1]], (v) => v)} lock={(t - 20) / 8} />
  </g>
);

const Screen: React.FC<{ p: number; t: number; size: number; show?: number }> = ({ p, t, size, show = 1 }) => (
  <g>
    <rect x={-210} y={-420} width={420} height={840} fill="#12233F" />
    <text x={0} y={-250} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill="#8FB0E0" letterSpacing={5}>SỐ DƯ</text>
    <g opacity={show}><BalanceDigits x={0} y={-60} size={size} p={p} t={t} /></g>
    <text x={0} y={30} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#8FB0E0" opacity={show}>VNĐ</text>
    <rect x={-150} y={230} width={300} height={70} rx={35} fill="#2F5FA8" opacity={0.7} />
  </g>
);

// ---------- B20: medium: Pip looks at the balance on his phone, lit by it ----------
export const B20: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: 780, y: 760, scale: 1.45, yaw: 0.35, facing: 1, look: 0.4, armR: { a: 62, b: 92 }, armL: { a: 8, b: -6 } } },
    { f: 22, p: { armR: { a: 66, b: 96 }, headTilt: 3 } },
    { f: 40, p: { headTilt: -2 } },
  ]);
  const hand = toWorld(pip, joints(pip).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), 600, kf(t, [[0, 1.55], [len, 1.8]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill={NIGHT_BG} />
      <Glow x={1180} y={520} r={600} kind="cool" o={0.18} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [26, 'worried']]) }} rimId="rimR" shadow={0} />
      <g transform={`translate(${hand.x + 46} ${hand.y - 58})`}>
        <BigPhone x={0} y={0} s={0.3} rot={-8} glow={0.6}><Screen p={0} t={t} size={52} /></BigPhone>
      </g>
      <Glow x={hand.x + 20} y={hand.y - 70} r={380} kind="cool" o={0.5} />
    </g>
  );
};

// ---------- B21: macro: the number blinks, then its digits come loose and float away ----------
export const B21: React.FC<ShotProps> = ({ t, len }) => {
  const blink = t >= 14 && t < 30 ? (Math.floor((t - 14) / 4) % 2 ? 0.15 : 1) : 1;
  const p = clamp((t - 32) / (len - 36));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill={NIGHT_BG} />
      <BigPhone x={960} y={560} s={1.1} rot={-5} glow={0.7}><Screen p={0} t={t} size={60} show={p > 0 ? 0 : blink} /></BigPhone>
      <g transform="translate(960 560) rotate(-5) scale(1.1)">{p > 0 ? <BalanceDigits x={0} y={-60} size={60} p={p} t={t} /> : null}</g>
      <InsertArm x={1190} y={930} fx={1800} fy={1220} rot={14} s={4} width={96} />
    </g>
  );
};

// ---------- B22: the number stands on a pillar marked LUẬT; the pillar fades and the number falls into the void ----------
export const B22: React.FC<ShotProps> = ({ t, len }) => {
  const fall = easeIn(clamp((t - 30) / 24));
  const blocks = [0, 1, 2];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill={NIGHT_BG} />
      <Glow x={960} y={560} r={700} kind="cool" o={0.18} />
      {blocks.map((i) => {
        const gone = clamp((t - 12 - i * 4) / 10);
        return (
          <g key={i} transform={`translate(0 ${gone * 30})`}>
            <rect x={730} y={760 - i * 120} width={460} height={110} rx={8} fill={`rgba(120,134,160,${0.9 * (1 - gone)})`} stroke="#F6EFE3" strokeWidth={5} strokeDasharray={gone > 0 ? '18 12' : undefined} opacity={1 - 0.8 * gone} />
            {i === 2 ? <text x={960} y={760 - i * 120 + 76} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={70} fill="#F6EFE3" letterSpacing={8} opacity={1 - gone}>LUẬT</text> : null}
          </g>
        );
      })}
      <g transform={`translate(0 ${fall * 560}) rotate(${Math.sin(t / 2) * 3 * clamp((t - 24) / 6)} 960 400)`} opacity={1 - clamp((fall - 0.7) / 0.3)}>
        <text x={960} y={430} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={120} fill="#7CF0B0" style={{ filter: 'drop-shadow(0 0 20px #7CF0B088)' }}>{BALANCE}</text>
      </g>
      <path d="M 300 900 H 1620" stroke="#7E8DA6" strokeWidth={5} strokeDasharray="20 14" opacity={0.6} />
    </g>
  );
};

const POPS: [number, number, number, number, string][] = [
  [960, 400, -3, 2, 'TRÚNG THƯỞNG!'], [650, 640, 4, 8, 'CHUYỂN KHOẢN NGAY'], [1270, 560, -5, 14, 'NHẬN QUÀ MIỄN PHÍ'], [520, 330, 6, 20, 'TRÚNG THƯỞNG!'],
  [1430, 330, -4, 25, 'KHẨN CẤP!'], [960, 760, 3, 29, 'CHUYỂN KHOẢN NGAY'], [360, 620, -6, 34, 'TRÚNG THƯỞNG!'], [1580, 690, 5, 39, 'LÃI 300%!'],
  [800, 220, 2, 44, 'NHẬN NGAY!'], [1150, 850, -3, 48, 'TRÚNG THƯỞNG!'],
];
const FLAGS: [number, number, number][] = [[240, 900, 12], [1700, 950, 20], [1020, 990, 32], [520, 960, 40], [1380, 980, 46]];

// ---------- B23: the phone floods with scam pop-ups and red flags ----------
export const B23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <rect x={-300} y={-300} width={2520} height={1700} fill={NIGHT_BG} />
    <BigPhone x={960} y={560} s={0.95} glow={0.5}>
      <rect x={-210} y={-420} width={420} height={840} fill="#18284A" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-180} y={-340 + i * 120} width={360} height={90} rx={16} fill="#2A3F6A" />)}
    </BigPhone>
    {POPS.map(([x, y, r, at, text], i) => <ScamPopup key={i} x={x} y={y} rot={r} t={t - at} text={text} hot={i % 3 === 1} />)}
    {FLAGS.map(([x, y, at], i) => <RedFlag key={i} x={x} y={y} t={t} at={at} s={1.3} />)}
    <Glow x={960} y={540} r={900} kind="red" o={0.12 + 0.1 * Math.abs(Math.sin(t / 5))} />
  </g>
);

// ---------- B24: a hooded figure at a laptop sends pop-ups out; a PHẠT stamp is crossed out: nobody is fined ----------
const FLY: [number, number, string][] = [[1000, 330, 'TRÚNG THƯỞNG!'], [1280, 560, 'CHUYỂN KHOẢN NGAY'], [820, 140, 'NHẬN NGAY!'], [1640, 470, 'TRÚNG THƯỞNG!'], [1100, 790, 'KHẨN CẤP!'], [1620, 700, 'LÃI 300%!']];
export const B24: React.FC<ShotProps> = ({ t, len }) => {
  const stamp = clamp((t - 18) / 6);
  const cross = easeOut(clamp((t - 34) / 8));
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill={NIGHT_BG} />
      <HoodedScammer x={380} y={900} t={t} s={1.15} />
      {FLY.map(([tx, ty, text], i) => {
        const k = easeOut(clamp((t - i * 6) / 14));
        return <ScamPopup key={i} x={720 + (tx - 720) * k} y={560 + (ty - 560) * k} rot={(i % 2 ? 1 : -1) * 4} s={0.62 + 0.2 * k} t={t - i * 6} text={text} hot={i % 2 === 1} />;
      })}
      {stamp > 0 ? (
        <g transform={`translate(1480 170) scale(${1.2 - 0.2 * backOut(stamp)}) rotate(-6)`} opacity={stamp}>
          <rect x={-170} y={-80} width={340} height={160} rx={14} fill="#F6EFE3" stroke="#12101C" strokeWidth={6} />
          <text x={0} y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={96} fill="#C8202F" letterSpacing={6}>PHẠT</text>
          <path d={`M ${-190} ${-100} L ${-190 + 380 * cross} ${-100 + 200 * cross} M 190 -100 L ${190 - 380 * cross} ${-100 + 200 * cross}`} stroke="#E8302F" strokeWidth={22} strokeLinecap="round" />
        </g>
      ) : null}
      <Sparkle x={1480} y={160} t={t - 36} s={0.8} />
    </g>
  );
};
