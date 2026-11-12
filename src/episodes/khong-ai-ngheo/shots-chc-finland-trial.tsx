import React from 'react';
import {
  Hero, basePose, faceAt, Schematic, SchLabel, CountUp, DrawOn, SCH, FONT, LOOKS, Glow, Sparkle, camT, kf, clamp, easeOut, backOut, ShotProps,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { Note, Mark } from '../tien-vo-han/chc-props-money-and-prices';
import { FINLAND_PATH, CountryOutline, vnNum } from './chc-doubt-props';
import { LivingRoom, Sofa, BlanketLump, CalendarPage } from './chc-lazy-props';

// Chapter C, "4 doubt: lazy", part 1 (137.97-146.23 s): C23 "is anyone lazy?" (a sprawled sofa, a question), C24 Finland and
// 2.000 people, C25 560 €/THÁNG with a note landing on the calendar, C26 two years, no conditions.

const zoom = (t: number, len: number, a = 1.0, b = 1.08) => camT(960, 540, kf(t, [[0, a], [len, b]]));

// ---------- C23: "Vậy có ai lười đi không?": a sprawled figure under a blanket, Zs, Pip's doubt as a "?" ----------
export const C23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 900]]), 600, kf(t, [[0, 1.05], [len, 1.2]]))}>
    <LivingRoom t={t + 20} id="c23r" />
    <Sofa x={1000} y={830} s={1.15} />
    <BlanketLump x={1000} y={830} s={1.15} t={t} />
    <Hero look={LOOKS.pipHood} pose={{ ...basePose, x: 420, y: 800 - 140 * 1.2, scale: 1.2, yaw: 0.5, facing: 1, look: 0.6, headTilt: 6, armL: { a: 12, b: -6 }, armR: { a: 100, b: 110 }, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
    <Mark x={560} y={250} t={t - 8} ch="?" s={1.5} />
  </g>
);

// ---------- C24: Finland's outline, 2.000 person icons light up one by one ----------
export const C24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={zoom(t, len, 1.0, 1.08)}>
    <Schematic t={t} id="c24" />
    <CountryOutline d={FINLAND_PATH} x={190} y={270} s={1.35} t={t} />
    <SchLabel x={330} y={190} t={t - 4} text="PHẦN LAN" size={76} color={SCH.line} />
    {Array.from({ length: 32 }).map((_, i) => <PersonIcon key={i} x={830 + (i % 8) * 104} y={420 + Math.floor(i / 8) * 104} s={0.95} on={t > 12 + i * 1.3} glow={t > 12 + i * 1.3 && t < 20 + i * 1.3} />)}
    <CountUp x={1250} y={290} t={t - 6} to={2000} dur={36} size={130} color={SCH.live} suffix=" NGƯỜI" format={vnNum} />
    <SchLabel x={1250} y={900} t={t - 30} text="THẤT NGHIỆP" size={46} color={SCH.dim} />
  </g>
);

// ---------- C25: a euro note drops onto a month calendar: "560 €/THÁNG" ----------
export const C25: React.FC<ShotProps> = ({ t, len }) => {
  const drop = easeOut(clamp((t - 6) / 14));
  return (
    <g transform={zoom(t, len, 1.0, 1.08)}>
      <Schematic t={t} id="c25" />
      <CalendarPage x={520} y={600} s={2.0} t={t} ticks={0} />
      <Note x={520} y={110 + drop * 420} rot={-12 + drop * 14} s={2.2} c="#7FA6D6" label="€" o={clamp((t - 4) / 4)} />
      <g transform={`translate(1320 510) scale(${backOut(clamp((t - 4) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={250} fill={SCH.live} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}77)` }}>560 €</text>
      </g>
      <SchLabel x={1320} y={700} t={t - 14} text="/ THÁNG" size={110} color={SCH.line} />
      <Sparkle x={680} y={640} t={t - 22} s={1.3} />
    </g>
  );
};

// ---------- C26: two years as 24 month dots filling, then a form's three conditions struck out: "KHÔNG ĐIỀU KIỆN" ----------
export const C26: React.FC<ShotProps> = ({ t, len }) => {
  const fill = clamp((t - 4) / 22) * 24;
  const strike = (i: number) => easeOut(clamp((t - 30 - i * 5) / 6));
  return (
    <g transform={zoom(t, len, 1.0, 1.06)}>
      <Schematic t={t} id="c26" />
      <SchLabel x={480} y={250} t={t} text="2 NĂM" size={180} color={SCH.live} />
      {Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={940 + (i % 12) * 74} cy={190 + Math.floor(i / 12) * 78} r={26} fill={fill > i ? SCH.live : 'none'} stroke={fill > i ? SCH.live : SCH.dim} strokeWidth={5} opacity={fill > i ? 1 : 0.6} />)}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={440} y={430 + i * 112} width={60} height={60} rx={10} fill="none" stroke={SCH.dim} strokeWidth={6} />
          <path d={`M 530 ${460 + i * 112} H ${1060 + i * 90}`} stroke={SCH.dim} strokeWidth={10} strokeLinecap="round" />
          <path d={`M 420 ${460 + i * 112} H ${420 + (1000 + i * 90) * strike(i)}`} stroke="#FF5A4A" strokeWidth={12} strokeLinecap="round" />
        </g>
      ))}
      <g transform={`translate(1660 560) scale(${backOut(clamp((t - 40) / 7)) * 0.8})`} opacity={t > 38 ? 1 : 0}>
        <path d="M -60 -20 l 40 50 l 90 -110" stroke="#2DBE6C" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 14px #2DBE6C88)' }} />
      </g>
      <SchLabel x={960} y={920} t={t - 32} text="KHÔNG ĐIỀU KIỆN" size={104} color={SCH.line} />
      <DrawOn d="M 360 950 H 1560" t={t - 34} dur={10} color={SCH.live} width={7} />
    </g>
  );
};
