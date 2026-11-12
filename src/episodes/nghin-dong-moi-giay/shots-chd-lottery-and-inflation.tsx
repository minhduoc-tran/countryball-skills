import React from 'react';
import { Schematic, SchLabel, SCH, FONT, clamp, easeOut, easeIn, backOut, kf, camT, ShotProps, Sparkle } from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { LotteryTicket, BanhMi, ChatBubble, Banknote, MoneyPile, GoodsPile, PriceTag, dots, lerpK } from './chd-props-schematic';

// Chapter D, second half of the science: D8-D12 the 1978 lottery study, D13-D18 inflation (everyone gets the power).
// All on the blueprint ground; one idea per shot.

const zoom = (t: number, len: number, a = 1, b = 1.07) => `translate(960 540) scale(${kf(t, [[0, a], [len, b]])}) translate(-960 -540)`;
const DIM = '#8795AE';

// ---------- D8: a lottery ticket pops in, "1978" spins up beside it ----------
export const D8: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp((t + 2) / 8));
  const yr = Math.round(1900 + 78 * easeOut(clamp((t - 8) / 26)));
  return (
    <g transform={zoom(t, len)}>
      <Schematic t={t} id="d8sch" />
      <LotteryTicket x={640} y={540 + Math.sin(t / 9) * 8} s={2.6 * pop} rot={-8 + Math.sin(t / 14) * 3} />
      <Sparkle x={820} y={380} t={t - 6} s={1.2} />
      <Sparkle x={470} y={700} t={t - 14} s={0.9} />
      <text x={1320} y={600} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={250} fill={SCH.live} style={{ filter: `drop-shadow(0 0 18px ${SCH.glow}88)` }}>{yr}</text>
      <path d="M 1040 650 H 1600" stroke={SCH.live} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - easeOut(clamp((t - 30) / 12))} />
      <SchLabel x={1320} y={730} t={t - 40} text="NHỮNG NGƯỜI TRÚNG SỐ" size={34} color={SCH.dim} />
    </g>
  );
};

// ---------- D9: the survey: a row of lottery winners, each ticked off on a clipboard ----------
export const D9: React.FC<ShotProps> = ({ t, len }) => {
  const rows = 6;
  return (
    <g transform={zoom(t, len, 1.04, 1)}>
      <Schematic t={t} id="d9sch" />
      <g transform={`translate(330 560) scale(${backOut(clamp((t + 2) / 8))})`} stroke={SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x={-130} y={-190} width={260} height={380} rx={20} fill="#16243A" />
        <rect x={-50} y={-216} width={100} height={44} rx={14} fill={SCH.ground} />
        {Array.from({ length: rows }).map((_, i) => {
          const k = easeOut(clamp((t - 8 - i * 6) / 6));
          return (
            <g key={i}>
              <path d={`M -90 ${-120 + i * 54} H 80`} stroke={SCH.dim} strokeWidth={4} />
              <path d={`M -106 ${-122 + i * 54} l 8 10 l 14 -18`} stroke={SCH.live} strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
            </g>
          );
        })}
      </g>
      {Array.from({ length: rows }).map((_, i) => {
        const k = backOut(clamp((t - 4 - i * 6) / 7));
        const x = 640 + i * 200;
        const lit = t > 8 + i * 6;
        return (
          <g key={i} transform={`translate(0 ${(1 - k) * 40})`} opacity={clamp(k)}>
            <LotteryTicket x={x} y={400} s={0.5} rot={-6 + i * 3} />
            <PersonIcon x={x} y={590} s={3.4} on={lit} glow={lit} />
          </g>
        );
      })}
      <SchLabel x={1240} y={850} t={t - 22} text="KHẢO SÁT" size={44} color={SCH.line} />
    </g>
  );
};

// ---------- D10: two happiness bars, nearly equal ----------
export const D10: React.FC<ShotProps> = ({ t, len }) => {
  const g1 = easeOut(clamp((t - 6) / 26));
  const g2 = easeOut(clamp((t - 14) / 26));
  const bar = (x: number, h: number, c: string, glow: boolean) => (
    <g>
      <rect x={x - 130} y={860 - h} width={260} height={h} rx={14} fill={`${c}33`} stroke={c} strokeWidth={7} style={glow ? { filter: `drop-shadow(0 0 14px ${SCH.glow}88)` } : undefined} />
      <rect x={x - 130} y={860 - h} width={260} height={Math.min(h, 24)} rx={12} fill={c} opacity={0.75} />
    </g>
  );
  const eq = backOut(clamp((t - 46) / 8));
  return (
    <g transform={zoom(t, len)}>
      <Schematic t={t} id="d10sch" />
      <SchLabel x={960} y={170} t={t - 2} text="MỨC HẠNH PHÚC" size={44} color={SCH.dim} />
      {bar(560, 520 * g1, SCH.live, true)}
      {bar(1360, 490 * g2, SCH.line, false)}
      <path d="M 300 860 H 1620" stroke={SCH.dim} strokeWidth={5} />
      <SchLabel x={560} y={930} t={t - 22} text="TRÚNG SỐ" size={44} color={SCH.live} />
      <SchLabel x={1360} y={930} t={t - 28} text="NGƯỜI BÌNH THƯỜNG" size={36} color={SCH.line} />
      <g transform={`translate(960 600) scale(${eq})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={200} fill={SCH.line}>≈</text>
      </g>
    </g>
  );
};

// ---------- D11: small joys: a fresh bánh mì and a chat bubble, both bright ----------
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const a = backOut(clamp((t - 6) / 9));
  const b = backOut(clamp((t - 74) / 9));
  return (
    <g transform={zoom(t, len)}>
      <Schematic t={t} id="d11sch" />
      <SchLabel x={960} y={150} t={t - 2} text="NHỮNG NIỀM VUI NHỎ" size={46} color={SCH.dim} />
      <BanhMi x={560} y={560} s={2.1 * a} rot={-5} t={t} />
      <ChatBubble x={1360} y={540 + Math.sin(t / 10) * 6} s={2.0 * b} t={t} />
      <SchLabel x={560} y={780} t={t - 22} text="BỮA SÁNG NGON" size={36} color={SCH.line} />
      <SchLabel x={1360} y={780} t={t - 90} text="TRÒ CHUYỆN VỚI BẠN BÈ" size={32} color={SCH.line} />
    </g>
  );
};

// ---------- D12: the same two icons drain to grey; a joy meter sinks; the source line ----------
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const fade = easeOut(clamp((t - 6) / 34));
  return (
    <g transform={zoom(t, len)}>
      <Schematic t={t} id="d12sch" />
      <SchLabel x={960} y={150} t={0} text="NHỮNG NIỀM VUI NHỎ" size={46} color={SCH.dim} />
      <BanhMi x={560} y={540 + fade * 20} s={2.1} rot={-5 + fade * 4} fade={fade} t={t} />
      <ChatBubble x={1360} y={520 + fade * 20} s={2.0} fade={fade} t={t} />
      {/* thú vị meter under each: sinks */}
      {[560, 1360].map((x) => (
        <g key={x}>
          <rect x={x - 150} y={770} width={300} height={26} rx={13} fill="none" stroke={SCH.dim} strokeWidth={4} />
          <rect x={x - 146} y={774} width={292 * (1 - 0.7 * fade)} height={18} rx={9} fill={fade < 0.5 ? SCH.live : DIM} />
        </g>
      ))}
      <SchLabel x={960} y={880} t={t - 14} text="KÉM THÚ VỊ HƠN TRƯỚC" size={40} color={SCH.line} />
      <SchLabel x={960} y={1000} t={t - 26} text="BRICKMAN ET AL., 1978" size={28} color={SCH.dim} />
    </g>
  );
};

// ---------- D13 / D14: a grid of grey people; one lit. Then the whole grid lights up with +1.000 ----------
const COLS = 8;
const ROWS = 3;
const gx = (c: number) => 260 + c * 200;
const gy = (r: number) => 330 + r * 190;
const LIT = { c: 3, r: 1 };

export const D13: React.FC<ShotProps> = ({ t, len }) => {
  const k = (t % 30) / 30;
  return (
    <g transform={camT((gx(LIT.c) + 960) / 2, (gy(LIT.r) + 540) / 2, kf(t, [[0, 1], [len, 1.16]]))}>
      <Schematic t={t} id="d13sch" />
      {Array.from({ length: ROWS * COLS }).map((_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const lit = c === LIT.c && r === LIT.r;
        return lit ? null : <PersonIcon key={i} x={gx(c)} y={gy(r)} s={2.4} o={0.7} />;
      })}
      <circle cx={gx(LIT.c)} cy={gy(LIT.r)} r={30 + k * 90} fill="none" stroke={SCH.live} strokeWidth={5} opacity={0.6 * (1 - k)} />
      <PersonIcon x={gx(LIT.c)} y={gy(LIT.r)} s={3.2 * (1 + 0.04 * Math.sin(t / 5))} on glow />
      <text x={gx(LIT.c)} y={gy(LIT.r) - 150 - k * 20} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={SCH.glow} opacity={1 - k * 0.6}>+1.000 đ</text>
      <SchLabel x={960} y={160} t={t - 44} text="CHỈ MÌNH BẠN" size={72} color={SCH.live} />
    </g>
  );
};

export const D14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={zoom(t, len, 1.1, 1)}>
    <Schematic t={t} id="d14sch" />
    {Array.from({ length: ROWS * COLS }).map((_, i) => {
      const c = i % COLS;
      const r = Math.floor(i / COLS);
      const d = Math.hypot(c - LIT.c, r - LIT.r);
      const lk = clamp((t - 4 - d * 4) / 6);
      const tl = t - 4 - d * 4;
      return (
        <g key={i}>
          <PersonIcon x={gx(c)} y={gy(r)} s={2.4 + 0.4 * backOut(lk)} on={lk > 0} o={lk > 0 ? 1 : 0.7} glow={lk > 0} />
          {tl > 0 && tl < 26 ? (
            <text x={gx(c)} y={gy(r) - 74 - easeOut(tl / 26) * 40} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill={SCH.glow} opacity={clamp((26 - tl) / 10)}>+1.000</text>
          ) : null}
        </g>
      );
    })}
    <SchLabel x={960} y={160} t={t - 30} text="AI CŨNG CÓ SỨC MẠNH NÀY" size={46} color={SCH.line} />
  </g>
);

// ---------- D15: the 1.000 đ note shrinks and drains to grey ----------
export const D15: React.FC<ShotProps> = ({ t, len }) => {
  const fade = easeOut(clamp((t - 10) / 40));
  const s = 3.0 - 1.4 * easeOut(clamp((t - 8) / 44));
  return (
    <g transform={zoom(t, len, 1, 1.03)}>
      <Schematic t={t} id="d15sch" />
      {Array.from({ length: ROWS * COLS }).map((_, i) => (
        <PersonIcon key={i} x={gx(i % COLS)} y={gy(Math.floor(i / COLS)) + 60} s={2.4} on o={0.16} />
      ))}
      <Banknote x={960} y={520 + fade * 70} s={s} rot={-4 + fade * 9} fade={fade} />
      <SchLabel x={960} y={900} t={t - 24} text="KHÔNG CÒN GIÁ TRỊ" size={48} color={fade > 0.5 ? DIM : SCH.line} />
    </g>
  );
};

// ---------- D16: a bánh mì with a price tag spinning up: 25.000 đ -> 2.500.000 đ ----------
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 14) / 66);
  const v = 25000 * Math.pow(100, easeIn(p) * 0.5 + easeOut(p) * 0.5);
  const sz = lerpK(64, 76, p);
  const sw = Math.sin(t / 5) * (6 + 10 * p);
  return (
    <g transform={zoom(t, len)}>
      <Schematic t={t} id="d16sch" />
      <BanhMi x={620} y={600} s={2.6} rot={-6} t={t} />
      <PriceTag x={1290} y={300} s={1.0} sw={sw * 0.6} size={sz} text={`${dots(p >= 1 ? 2500000 : v)} đ`} color={p > 0.5 ? '#B3261E' : '#2A1A08'} />
      <SchLabel x={1290} y={640} t={t - 20} text="GIÁ BÁNH MÌ" size={36} color={SCH.dim} />
      {p >= 1 ? <SchLabel x={1290} y={780} t={t - 80} text="×100" size={84} color={SCH.live} /> : null}
    </g>
  );
};

// ---------- D17: "LẠM PHÁT": the word, and a price curve shooting up ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => {
  const word = backOut(clamp((t + 2) / 9));
  const draw = easeOut(clamp((t - 8) / 40));
  return (
    <g transform={zoom(t, len)}>
      <Schematic t={t} id="d17sch" />
      <g transform={`translate(960 270) scale(${word})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={176} fill={SCH.live} letterSpacing={6} style={{ filter: `drop-shadow(0 0 18px ${SCH.glow}88)` }}>LẠM PHÁT</text>
      </g>
      <path d="M 360 960 H 1560 M 360 960 V 460" stroke={SCH.dim} strokeWidth={5} fill="none" />
      <path d="M 380 940 C 760 930 1100 900 1280 740 S 1480 500 1540 440" stroke={SCH.live} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} style={{ filter: `drop-shadow(0 0 10px ${SCH.glow})` }} />
      <SchLabel x={1500} y={420} t={t - 36} text="GIÁ" size={44} color={SCH.glow} />
      <SchLabel x={560} y={560} t={t - 26} text="TIỀN ↑ NHANH HƠN HÀNG ↑" size={34} color={SCH.dim} />
    </g>
  );
};

// ---------- D18: money pile racing up, the goods pile crawling; one note shrinks between them ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / 90);
  const money = 1 + 26 * easeIn(p);
  const goods = 1 + 3.2 * p;
  const shr = easeOut(clamp((t - 46) / 34));
  return (
    <g transform={zoom(t, len)}>
      <Schematic t={t} id="d18sch" />
      <MoneyPile x={470} y={900} n={money} />
      <GoodsPile x={1450} y={900} n={goods} />
      <SchLabel x={470} y={980} t={t - 4} text="TIỀN" size={44} color={SCH.live} />
      <SchLabel x={1450} y={980} t={t - 8} text="HÀNG HÓA" size={44} color={SCH.line} />
      {t >= 40 ? <Banknote x={960} y={400} s={1.5 - 0.8 * shr} rot={-6} fade={shr * 0.8} text="1 đồng" /> : null}
      {t >= 52 ? <SchLabel x={960} y={600} t={t - 52} text="MUA ĐƯỢC ÍT ĐI" size={38} color={SCH.line} /> : null}
    </g>
  );
};
