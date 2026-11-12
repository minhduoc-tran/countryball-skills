import React from 'react';
import { Glow, Dust, kf, clamp, easeOut, easeIn, backOut, camT, FONT, ShotProps } from '../../engine';
import {
  PAPER, OldPaper, PlainSkyline, EmptyPatrolCar, PicketSign, FlapYear, DayClock, BankIcon, BrokenShopIcon, FlameIcon, InkNumber, PaperTick,
} from './chb-montreal-props';

// Chapter B, "day one: Montreal 1969" (B25-B32): a sepia illustration. An old photograph of a plain skyline (B25), the
// year flips back to 1969 (B26), the empty patrol car and the strike sign under "MONTREAL, CANADA · 1969" (B27), the
// 16-hour clock (B28), then the counters: 6 banks (B29), 100+ shops (B30), 12 fires (B31), and ĐÓ LÀ THẬT (B32).
// The episode's "memory" look gives the sepia grade; the colours here are already warm and faded.

// ---------- B25: an old photograph of a plain skyline drops onto the paper and settles ----------
export const B25: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 12));
  const rot = -3 + 4 * (1 - k) + Math.sin(t / 20) * 0.6;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <OldPaper t={t} id="sb25" />
      <g transform={`translate(960 ${520 - 420 * (1 - k)}) rotate(${rot})`}>
        <rect x={-520} y={-340} width={1040} height={700} fill="#F6EFE3" stroke={PAPER.ink} strokeWidth={6} style={{ filter: 'drop-shadow(0 18px 26px rgba(40,24,10,0.45))' }} />
        <clipPath id="sb25ph"><rect x={-470} y={-290} width={940} height={540} /></clipPath>
        <g clipPath="url(#sb25ph)">
          <rect x={-470} y={-290} width={940} height={540} fill="#CDB98E" />
          <circle cx={260} cy={-120} r={70} fill="#F2E3B8" />
          <PlainSkyline x={-500} y={250} w={1000} h={380} />
          <rect x={-470} y={190} width={940} height={60} fill="#8A7656" opacity={0.7} />
          <Glow x={260} y={-120} r={300} o={0.25} />
        </g>
        <text x={0} y={322} textAnchor="middle" fontFamily={FONT.hand} fontSize={44} fill={PAPER.soft}>···</text>
      </g>
      <Dust t={t} seed={25} x0={200} y0={100} w={1500} h={800} n={30} o={0.5} />
    </g>
  );
};

// ---------- B26: the year flips back through the decades to 1969 ----------
export const B26: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / (len - 14)));
  const year = 1969 + Math.round(57 * (1 - p));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <OldPaper t={t} id="sb26" />
      <FlapYear x={960} y={520} text={String(year)} />
      <g transform={`translate(0 ${-6 * Math.max(0, 1 - Math.abs(t - (len - 10)) / 5)})`}>
        <path d="M 480 800 H 1440" stroke={PAPER.ink} strokeWidth={6} opacity={0.5} />
      </g>
    </g>
  );
};

// ---------- B27: wide: the empty patrol car, the strike sign, the city; the place and year typed above ----------
export const B27: React.FC<ShotProps> = ({ t, len }) => {
  const label = 'MONTREAL, CANADA · 1969';
  const shown = Math.min(label.length, Math.max(0, Math.floor((t - 24) / 1.4)));
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 580, kf(t, [[0, 1.0], [len, 1.18]]))}>
      <OldPaper t={t} id="sb27" />
      <PlainSkyline x={-100} y={760} w={2120} h={420} />
      <rect x={-300} y={760} width={2520} height={500} fill="#C9B382" />
      <path d="M -300 800 H 2200" stroke={PAPER.ink} strokeWidth={5} opacity={0.5} />
      <EmptyPatrolCar x={900} y={900} s={1.45} t={t} />
      <PicketSign x={1500} y={930} s={0.95} t={t - 46} />
      <g opacity={shown > 0 ? 1 : 0}>
        <rect x={400} y={118} width={1120} height={96} rx={10} fill={PAPER.ink} />
        <text x={960} y={188} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill={PAPER.ground} letterSpacing={4}>{label.slice(0, shown)}</text>
      </g>
    </g>
  );
};

// ---------- B28: the clock sweeps 16 hours of the day ----------
export const B28: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / (len - 10)));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <OldPaper t={t} id="sb28" />
      <DayClock x={640} y={540} r={230} p={p} />
      <InkNumber x={1330} y={640} t={t - 8} text="~16" size={260} />
      <InkNumber x={1330} y={820} t={t - 14} text="GIỜ" size={150} color={PAPER.red} />
    </g>
  );
};

const counterShot = (bg: string, n: string, countTo: number | null, cols: number, rows: number, kind: 'bank' | 'shop' | 'flame', step: number, size: number): React.FC<ShotProps> => ({ t, len }) => {
  const total = cols * rows;
  const text = countTo === null ? n : `${Math.round(countTo * easeOut(clamp(t / 28)))}${t >= 28 ? '+' : ''}`;
  const dx = kind === 'bank' ? 280 : 210;
  const dy = kind === 'bank' ? 300 : 250;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <OldPaper t={t} id={bg} />
      <InkNumber x={560} y={660} t={t} text={text} size={size} color={kind === 'flame' ? PAPER.red : PAPER.ink} />
      {Array.from({ length: total }).map((_, i) => {
        const x = 1090 + (i % cols) * dx;
        const y = 330 + Math.floor(i / cols) * dy + (kind === 'flame' ? 70 : 0);
        const ti = t - 3 - i * step;
        return kind === 'bank' ? <BankIcon key={i} x={x} y={y + 90} s={1.3} t={ti} /> : kind === 'shop' ? <BrokenShopIcon key={i} x={x} y={y + 50} s={1.15} t={ti} /> : <FlameIcon key={i} x={x} y={y + 60} s={1.45} t={ti} i={i} />;
      })}
    </g>
  );
};

// ---------- B29: "6" bank robberies ----------
export const B29 = counterShot('sb29', '6', null, 3, 2, 'bank', 4, 420);
// ---------- B30: "100+" shops looted ----------
export const B30 = counterShot('sb30', '100+', 100, 4, 3, 'shop', 2, 300);
// ---------- B31: "12" fires ----------
export const B31 = counterShot('sb31', '12', null, 4, 3, 'flame', 2.5, 420);

// ---------- B32: ĐÓ LÀ THẬT ----------
export const B32: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <OldPaper t={t} id="sb32" />
    <PaperTick t={t} sub="THEO PINKER (2011)" />
  </g>
);
