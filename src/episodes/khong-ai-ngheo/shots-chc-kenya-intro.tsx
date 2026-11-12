import React from 'react';
import {
  Schematic, SchLabel, CountUp, Arrow, SCH, FONT, TapeLines, Glow, Sparkle, camT, kf, clamp, easeOut, backOut, ShotProps,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { Note, Mark } from '../tien-vo-han/chc-props-money-and-prices';
import { KENYA_PATH, CountryOutline, HouseIcon, Coin, WorriedTag, Clipboard, vnNum } from './chc-doubt-props';

// Chapter C, "4 doubt: inflation", part 1 (120.89-131.13 s): C14 "wait": a freeze, a note falls toward a person while a price
// tag looks worried; C15 the tag shoots up; C16 Kenya and the economists; C17 10.000+ households light up; C18 about 1.000 USD each.

const zoom = (t: number, len: number, a = 1.0, b = 1.08) => camT(960, 540, kf(t, [[0, a], [len, b]]));

// ---------- C14: "Nhưng khoan đã": freeze (tape lines and a pause glyph), a note drops toward a person, the price tag sweats ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => {
  const drop = easeOut(clamp((t - 14) / 16));
  const freeze = clamp(1 - t / 12);
  return (
    <g>
      <g transform={zoom(t, len)}>
        <Schematic t={t} id="c14" />
        <PersonIcon x={520} y={660} s={4.2} on glow />
        <Note x={520} y={120 + drop * 330} rot={-10 + drop * 14} s={1.5} c="#6FB38A" label="$" o={clamp((t - 12) / 4)} />
        <WorriedTag x={1360} y={640} t={t} s={1.5} />
        <Mark x={1560} y={420} t={t - 20} ch="!" s={1.3} />
      </g>
      <g opacity={0.35 + 0.65 * freeze}><TapeLines f={t} /></g>
      <g transform="translate(960 210)" opacity={clamp(1 - (t - 26) / 14) * clamp(t / 3)}>
        <circle r={96} fill={`${SCH.live}22`} stroke={SCH.live} strokeWidth={9} />
        <rect x={-34} y={-44} width={26} height={88} rx={6} fill={SCH.live} />
        <rect x={8} y={-44} width={26} height={88} rx={6} fill={SCH.live} />
      </g>
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.5 * clamp(1 - t / 4)} />
    </g>
  );
};

// ---------- C15: "giá cả có tăng vọt không?": the worried tag rides a steep line up and shakes at the top, "?" over it ----------
export const C15: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp((t - 4) / 20));
  const tx = 420 + up * 1000;
  const ty = 860 - up * 600;
  return (
    <g transform={zoom(t, len, 1.0, 1.1)}>
      <Schematic t={t} id="c15" />
      <path d="M 300 900 H 1700" stroke={SCH.dim} strokeWidth={6} strokeLinecap="round" />
      <path d="M 300 900 V 160" stroke={SCH.dim} strokeWidth={6} strokeLinecap="round" />
      <Arrow x0={360} y0={860} x1={1440} y1={250} t={t - 2} dur={20} color={SCH.live} bend={-0.08} />
      <WorriedTag x={tx} y={ty + 8} t={t} s={1.35} rot={-8} />
      <Mark x={tx + 150} y={ty - 130} t={t - 22} ch="?" s={1.6} />
      <Glow x={tx} y={ty} r={380} o={0.18 * up} />
    </g>
  );
};

// ---------- C16: Kenya's outline draws on; a clipboard of results ticks: the economists really tried it ----------
export const C16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={zoom(t, len, 1.0, 1.1)}>
    <Schematic t={t} id="c16" />
    <CountryOutline d={KENYA_PATH} x={330} y={170} s={1.75} t={t} />
    <circle cx={330 + 200 * 1.6} cy={170 + 150 * 1.6} r={12 + 4 * Math.sin(t / 4)} fill={SCH.live} opacity={clamp((t - 14) / 6)} />
    <SchLabel x={1340} y={400} t={t - 10} text="KENYA" size={170} color={SCH.line} />
    <Clipboard x={1340} y={700} s={1.2} t={t - 18} />
    <Sparkle x={1500} y={600} t={t - 46} s={1.2} />
  </g>
);

// ---------- C17: the outline fills with houses that light up one by one; "10.000+ HỘ" counts up ----------
const HOUSES = Array.from({ length: 20 }).map((_, i) => ({ x: 200 + (i % 5) * 84 + ((Math.floor(i / 5) % 2) * 24), y: 330 + Math.floor(i / 5) * 110 }));
export const C17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={zoom(t, len, 1.0, 1.08)}>
    <Schematic t={t} id="c17" />
    <CountryOutline d={KENYA_PATH} x={110} y={170} s={1.5} t={t - 40} dur={1} fillO={0.12} />
    {HOUSES.map((h, i) => <HouseIcon key={i} x={h.x} y={h.y} s={1.05} on={clamp((t - 4 - i * 2) / 6)} />)}
    <SchLabel x={330} y={190} t={t} text="KENYA" size={56} color={SCH.dim} />
    <CountUp x={1330} y={480} t={t - 6} to={10000} dur={32} size={190} color={SCH.live} suffix="+" format={vnNum} />
    <SchLabel x={1330} y={640} t={t - 24} text="HỘ" size={120} color={SCH.line} />
  </g>
);

// ---------- C18: one house, a coin drops in: "≈ 1.000 USD" ----------
export const C18: React.FC<ShotProps> = ({ t, len }) => {
  const drop = easeOut(clamp((t - 4) / 14));
  const lit = clamp((t - 14) / 8);
  return (
    <g transform={zoom(t, len, 1.0, 1.1)}>
      <Schematic t={t} id="c18" />
      <HouseIcon x={560} y={640} s={5.2} on={lit} />
      <Coin x={560} y={170 + drop * 320 - Math.sin(clamp((t - 14) / 10) * Math.PI) * 20} s={1.5} o={1 - clamp((t - 18) / 6)} />
      <Glow x={560} y={640} r={420} o={0.25 * lit} />
      <g transform={`translate(1330 520) scale(${backOut(clamp((t - 8) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={150} fill={SCH.live} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}66)` }}>≈ 1.000</text>
        <text y={130} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={110} fill={SCH.line} letterSpacing={4}>USD</text>
      </g>
      <SchLabel x={1330} y={820} t={t - 16} text="MỖI HỘ" size={46} color={SCH.dim} />
    </g>
  );
};
