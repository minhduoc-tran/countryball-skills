import React from 'react';
import {
  Hero, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, joints, toWorld, reachAngle, LEG_LEN,
  Schematic, SchLabel, SCH, UI, FONT, Sparkle, Glow, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BlackCard, MilkTea, VENDOR_A, GOLD } from './cha-card-terminal-props';
import { DrinkStall, BankPhone } from './cha-scenery-props';
import { TapMacro, GreenMacro } from './shots-cha-cold-open';
import { VnOutline, VnIcons } from './cha-vietnam-map-props';

// Chapter A, the milk-tea test (25.8-31.7 s) and the scale schematic (31.7-44.9 s): the first purchase with the
// card, then Vietnam's whole economy as one number the card pays twice.

const PIP = LOOKS.pipHood;
const StallBlur: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <g filter="url(#blur16)"><DrinkStall id={id} t={t} /></g>
    <rect x={-100} y={-100} width={2120} height={1280} fill="#0A0814" opacity={0.3} />
  </g>
);

// ---------- A18: the drink stall; the seller slides a milk-tea cup across the counter to Pip ----------
export const A18: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.3;
  const start = { ...basePose, x: 1000, y: 1040 - LEG_LEN * sc, scale: sc, yaw: 0.6 };
  const a1 = reachAngle(start, { x: 1170, y: 690 });
  const pip = poseAt(t, [
    { f: 0, p: { ...start, look: 0.6, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } },
    { f: 40, p: {} },
    { f: 52, p: { armR: { a: a1, b: 0 }, look: 0.9 }, ease: easeOut },
  ]);
  const seller = poseAt(t, [
    { f: 0, p: { x: 1560, y: 800, scale: 1.15, yaw: -0.6, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } },
    { f: 22, p: { armL: { a: 86, b: 0 } }, ease: easeOut },
    { f: 36, p: { armL: { a: 20, b: -8 } } },
  ]);
  const cupX = kf(t, [[24, 1400], [44, 1200], [len, 1200]], easeOut);
  return (
    <g transform={camT(1180, 600, kf(t, [[0, 1.12], [len, 1.3]]))}>
      <DrinkStall id="a18d" t={t + 10} behind={<Hero look={VENDOR_A} pose={{ ...seller, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />} />
      {t >= 24 ? <MilkTea id="a18m" x={cupX} y={712} s={0.62} t={t} /> : null}
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- A19: tap macro at the stall ----------
export const A19: React.FC<ShotProps> = (p) => <TapMacro {...p} id="a19c" tx={1040} rot={4} bg={<StallBlur id="a19d" t={p.t} />} />;

// ---------- A20: green "THANH TOÁN THÀNH CÔNG", the milk tea beside it ----------
export const A20: React.FC<ShotProps> = (p) => (
  <GreenMacro {...p} bg={<StallBlur id="a20d" t={p.t + 20} />}>
    <MilkTea id="a20m" x={1540} y={1090} s={1.7} t={p.t} />
  </GreenMacro>
);

// ---------- A21: the phone in Pip's hand: SỐ DƯ pops in ----------
export const A21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <StallBlur id="a21d" t={t + 40} />
    <Glow x={960} y={560} r={520} o={0.25} kind="cool" />
    <BankPhone x={960} y={560} s={1.65} rot={kf(t, [[0, 5], [len, -2]])} check={1} bal={clamp((t - 5) / 14)} t={t} />
    <InsertArm x={1130} y={1000} fx={1500} fy={1400} rot={-12} s={4.6} width={112} />
  </g>
);

// ---------- A22: Pip sips the milk tea, eyes wide, a gold infinity pops over his head ----------
export const A22: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 880, y: 770, scale: 1.55, yaw: 0.35, look: 0.4, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 }, squash: 0 } },
    { f: 4, p: { squash: -0.04 }, ease: easeOut },
    { f: 12, p: { squash: 0, headTilt: -3 } },
  ]);
  const pop = backOut(clamp((t - 3) / 8));
  return (
    <g transform={camT(980, 520, kf(t, [[0, 1.15], [len, 1.3]]))}>
      <StallBlur id="a22d" t={t + 60} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      <MilkTea id="a22m" x={1030} y={780} s={0.95} rot={-32} level={1 - 0.25 * clamp(t / len)} t={t} />
      <g transform={`translate(760 250) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={260} fill={GOLD} stroke="#1A1230" strokeWidth={10} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 28px rgba(217,181,94,0.6))` }}>∞</text>
      </g>
      <Sparkle x={850} y={190} t={t - 6} s={1.2} />
    </g>
  );
};

// ================= scale schematic =================
const MAP = { x: 770, y: 110, s: 0.95 };
const NUM = (p: number) => `${(12.8 * p).toFixed(1).replace('.', ',')} TRIỆU TỶ Đ`;

// ---------- A23: "To picture it": Vietnam's outline draws on the grid ----------
export const A23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <Schematic t={t} id="a23sch" />
    <g transform={`translate(${MAP.x} ${MAP.y}) scale(${MAP.s})`}><VnOutline id="a23vn" t={t} t0={2} dur={26} fillT={22} /></g>
    <SchLabel x={400} y={420} t={t - 4} text="ĐỂ DỄ" size={72} anchor="middle" />
    <SchLabel x={400} y={510} t={t - 8} text="HÌNH DUNG" size={72} anchor="middle" color={SCH.live} />
    <SchLabel x={1500} y={560} t={t - 18} text="VIỆT NAM" size={64} />
  </g>
);

// ---------- A24: the year 2025 and the whole economy lights up: factories, rice fields, ports ----------
export const A24: React.FC<ShotProps> = ({ t, len }) => {
  const mx = kf(t, [[0, MAP.x], [16, 250]]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t + 30} id="a24sch" />
      <g transform={`translate(${mx} ${MAP.y}) scale(${MAP.s})`}>
        <VnOutline id="a24vn" t={100} />
        <VnIcons t={t} t0={44} />
      </g>
      <g transform={`translate(1290 380) scale(${backOut(clamp((t - 6) / 9))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={SCH.dim} letterSpacing={10} y={-215}>NĂM</text>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={230} fill="#F6EFE3" stroke="#101A2A" strokeWidth={10} paintOrder="stroke">2025</text>
      </g>
      <SchLabel x={1290} y={600} t={t - 52} text="CẢ NỀN KINH TẾ" size={50} />
      <SchLabel x={1290} y={670} t={t - 56} text="VIỆT NAM" size={66} color={SCH.live} />
    </g>
  );
};

// ---------- A25: the counter runs up to 12,8 TRIỆU TỶ Đ, then "> 500 TỶ USD" ----------
export const A25: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp((t - 8) / 50));
  const chip = backOut(clamp((t - 62) / 10));
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Schematic t={t + 60} id="a25sch" />
      <g transform="translate(150 190) scale(0.7)">
        <VnOutline id="a25vn" t={100} />
        <VnIcons t={t} t0={0} litAll />
      </g>
      <text x={1180} y={440} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={118} fill={SCH.live} stroke="#101A2A" strokeWidth={8} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 22px ${SCH.glow})` }}>{NUM(p)}</text>
      <g transform={`translate(1180 640) scale(${chip})`}>
        <rect x={-350} y={-70} width={700} height={120} rx={60} fill={UI.pill} stroke={UI.good} strokeWidth={5} opacity={0.95} />
        <text textAnchor="middle" y={28} fontFamily={FONT.ui} fontWeight={700} fontSize={80} fill={UI.good}>{'> 500 TỶ USD'}</text>
      </g>
      <SchLabel x={1180} y={300} t={t - 4} text="GDP VIỆT NAM 2025" size={44} color={SCH.dim} />
    </g>
  );
};

// ---------- the swipe: the card sweeps along the number, a green wipe follows it ----------
const NumberLine: React.FC<{ id: string; x: number; y: number; swipeX: number; size?: number; wipe: boolean }> = ({ id, x, y, swipeX, size = 118, wipe }) => (
  <g>
    <defs><clipPath id={`${id}wipe`}><rect x={-200} y={y - size} width={swipeX + 200} height={size * 1.6} /></clipPath></defs>
    <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={SCH.live} stroke="#101A2A" strokeWidth={8} paintOrder="stroke">12,8 TRIỆU TỶ Đ</text>
    {wipe ? (
      <g clipPath={`url(#${id}wipe)`}>
        <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={UI.good} stroke="#101A2A" strokeWidth={8} paintOrder="stroke">12,8 TRIỆU TỶ Đ</text>
      </g>
    ) : null}
  </g>
);
const SwipeCard: React.FC<{ id: string; x: number; y: number; t: number }> = ({ id, x, y, t }) => (
  <g>
    <rect x={x - 900} y={y - 8} width={880} height={16} rx={8} fill={GOLD} opacity={0.25} style={{ filter: 'blur(6px)' }} />
    <BlackCard id={id} x={x} y={y} s={0.62} rot={-5} shine={clamp(t / 20)} />
  </g>
);
const PaidPill: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <g transform={`translate(${x} ${y}) scale(${backOut(clamp(k))})`}>
    <rect x={-330} y={-48} width={660} height={96} rx={48} fill={UI.good} />
    <circle cx={-278} cy={0} r={28} fill="#EFFFF5" /><path d="M -291 1 l 9 10 l 18 -22" stroke={UI.good} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <text x={20} y={14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={37} fill="#06301A">THANH TOÁN THÀNH CÔNG</text>
  </g>
);

// ---------- A26: "with this card, one swipe covers it": the card appears and swipes across the number ----------
export const A26: React.FC<ShotProps> = ({ t, len }) => {
  const cardX = kf(t, [[0, -380], [14, 230], [34, 250], [54, 2300]], easeOut);
  const cardIn = t < 34 ? cardX + Math.sin(t / 4) * 6 : cardX;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t + 90} id="a26sch" />
      <NumberLine id="a26n" x={960} y={400} swipeX={cardIn} wipe={t >= 34} />
      <text x={960} y={540} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={78} fill={SCH.dim}>{'> 500 TỶ USD'}</text>
      <SwipeCard id="a26c" x={cardIn} y={470} t={t} />
      <PaidPill x={960} y={780} k={(t - 56) / 8} />
      <Sparkle x={1500} y={330} t={t - 58} s={1.3} />
    </g>
  );
};

// ---------- A27: "then swipe once more": a second swipe, a second number, ×2 ----------
export const A27: React.FC<ShotProps> = ({ t, len }) => {
  const cardX = kf(t, [[0, -380], [20, 2300]], easeOut);
  const two = backOut(clamp((t - 26) / 10));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t + 130} id="a27sch" />
      <NumberLine id="a27a" x={960} y={250} swipeX={3000} wipe size={104} />
      <g opacity={t > 8 ? 1 : 0}>
        <NumberLine id="a27b" x={960} y={500} swipeX={cardX} wipe size={104} />
      </g>
      <SwipeCard id="a27c" x={cardX} y={440} t={t} />
      <g transform={`translate(960 840) scale(${two})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={280} fill={SCH.live} stroke="#101A2A" strokeWidth={12} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 30px ${SCH.glow})` }}>×2</text>
      </g>
      <Sparkle x={1300} y={640} t={t - 28} s={1.4} />
    </g>
  );
};
