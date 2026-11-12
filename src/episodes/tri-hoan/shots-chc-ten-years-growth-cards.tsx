import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, backOut, settle, shake, LOOKS, Glow, FloatLabel, FONT, SCH, ShotProps,
} from '../../engine';
import { BigStat, Cap } from '../khong-ai-ngheo/cha-number-card-props';
import { StickyNote, Stubble } from './chc-note-and-object-props';
import { CardFrame, GrowthChart, growthXY, GC, ORANGE, TEAL } from './chc-chart-props';
import { FlipCalendar } from './chc-calendar-and-country-props';

// Chapter C, "5 ten years" part 2 (144.26-156.2 s), look "y10": the maths. C24 the 22-year-old's curve grows to 60, C25 "≈ 1,7 TỶ",
// C26 ten years of "next month" flip by, C27 the second curve starts at 32, C28 it ends at "≈ 870 TRIỆU", C29 two bars: CHẬM 10 NĂM =
// MẤT GẦN MỘT NỬA, with the TOÁN HỌC · GIẢ ĐỊNH MINH HỌA tag. Numbers are the episode's `science`: 1.005^456 = 9.72 -> 1.744 tỷ, ^336 = 5.34 -> 869 triệu.

const PIP = LOOKS.pipHood;

// ---------- C24: the curve from age 22 to 60 draws on (compound growth: slow, then steep) ----------
export const C24: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / (len - 6));
  return (
    <CardFrame t={t} len={len} id="c24gr" cx={kf(t, [[0, 900], [len, 1050]])} cy={kf(t, [[0, 540], [len, 480]])} z0={1.0} z1={1.12}>
      <GrowthChart t={t} pa={p} pb={0} id="c24ch" />
      <Cap x={620} y={330} t={t - 2} text="TỪ 22 TUỔI" size={54} color={TEAL} />
    </CardFrame>
  );
};

// ---------- C25: the top of the curve: "≈ 1,7 TỶ" slams in ----------
export const C25: React.FC<ShotProps> = ({ t, len }) => {
  const end = growthXY(60, 22);
  const sh = shake(t, 4, 8, 8);
  return (
    <CardFrame t={t} len={len} id="c25gr" cx={kf(t, [[0, 1100], [len, 1180]])} cy={kf(t, [[0, 560], [len, 500]])} z0={1.12} z1={1.22}>
      <g transform={`translate(${sh.x} ${sh.y})`}>
        <GrowthChart t={t + 40} pa={1} pb={0} id="c25ch" />
        <Glow x={end.x} y={end.y} r={420} o={0.5 * clamp(t / 6)} />
        <BigStat x={end.x - 300} y={end.y + 20} t={t - 3} text="≈ 1,7 TỶ" size={170} color={TEAL} glow={TEAL} />
      </g>
    </CardFrame>
  );
};

// ---------- C26: older Pip beside a calendar whose months fly by: ten years of "next month" ----------
export const C26: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...basePose, x: 560, y: 660, scale: 1.5, yaw: 0.5, facing: 1, look: 0.5, headTilt: 4, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, ...faceAt(t, [[0, 'neutral'], [20, 'tired']]) };
  const yrs = Math.min(10, 1 + Math.floor(t / 3.6));
  return (
    <CardFrame t={t} len={len} id="c26cd" z0={1.0} z1={1.07}>
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Stubble pose={pose} />
      <ellipse cx={560} cy={870} rx={120} ry={14} fill="#000" opacity={0.35} />
      <FlipCalendar x={1190} y={620} s={1.35} m={t * 0.4} lin />
      <StickyNote x={1390} y={340} lines={['MAI', 'LÀM']} s={0.55} rot={-6 + Math.sin(t) * 4} />
      <text x={1700} y={170} textAnchor="end" fontFamily={FONT.title} fontWeight={900} fontSize={110} fill={ORANGE} stroke="#1A1230" strokeWidth={9} paintOrder="stroke">{`${yrs} NĂM`}</text>
    </CardFrame>
  );
};

// ---------- C27: the second curve begins at age 32; a bracket shows the ten lost years ----------
export const C27: React.FC<ShotProps> = ({ t, len }) => {
  const x22 = growthXY(22, 22).x;
  const x32 = growthXY(32, 22).x;
  const br = easeOut(clamp(t / 10));
  return (
    <CardFrame t={t} len={len} id="c27gr" cx={kf(t, [[0, 1000], [len, 900]])} cy={540} z0={1.05} z1={1.12}>
      <GrowthChart t={t + 50} pa={1} pb={clamp((t - 8) / (len + 30))} id="c27ch" />
      <g opacity={br}>
        <path d={`M ${x22} ${GC.yBase - 70} H ${x32}`} stroke={ORANGE} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 14" />
        <path d={`M ${x22} ${GC.yBase - 90} v 40 M ${x32} ${GC.yBase - 90} v 40`} stroke={ORANGE} strokeWidth={8} strokeLinecap="round" />
        <text x={(x22 + x32) / 2} y={GC.yBase - 120} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={64} fill={ORANGE} stroke="#1A1230" strokeWidth={7} paintOrder="stroke">10 NĂM</text>
      </g>
    </CardFrame>
  );
};

// ---------- C28: the second curve climbs to "≈ 870 TRIỆU", far under the first ----------
export const C28: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 2) / (len - 18));
  const end = growthXY(60, 32);
  const endA = growthXY(60, 22);
  return (
    <CardFrame t={t} len={len} id="c28gr" cx={1100} cy={540} z0={1.1} z1={1.18}>
      <GrowthChart t={t + 90} pa={1} pb={p} id="c28ch" />
      <text x={endA.x - 20} y={endA.y - 30} textAnchor="end" fontFamily={FONT.title} fontWeight={900} fontSize={70} fill={TEAL} stroke="#1A1230" strokeWidth={7} paintOrder="stroke">≈ 1,7 TỶ</text>
      <path d={`M ${end.x + 40} ${end.y} V ${endA.y}`} stroke={SCH.dim} strokeWidth={4} strokeDasharray="6 12" opacity={clamp((t - len + 18) / 8)} />
      <BigStat x={end.x - 300} y={end.y + 20} t={t - 50} text="≈ 870 TRIỆU" size={130} color={ORANGE} glow={ORANGE} />
    </CardFrame>
  );
};

// ---------- C29: two bars (1,7 tỷ vs 870 triệu); the missing top chunk breaks off: CHẬM 10 NĂM = MẤT GẦN MỘT NỬA; the maths tag ----------
export const C29: React.FC<ShotProps> = ({ t, len }) => {
  const BASE = 810;
  const H = 440;
  const grow = easeOut(clamp(t / 14));
  const hA = H * grow;
  const hB = H * (869 / 1744) * grow;
  const gone = clamp((t - 28) / 12);
  const bar = (x: number, h: number, c: string) => <rect x={x} y={BASE - h} width={250} height={h} rx={12} fill={c} stroke="#101A2A" strokeWidth={6} />;
  return (
    <CardFrame t={t} len={len} id="c29bar" z0={1.0} z1={1.05}>
      {bar(500, hA, TEAL)}
      {bar(1060, hB, ORANGE)}
      <rect x={1060} y={BASE - H} width={250} height={H * (1 - 869 / 1744) * clamp((t - 16) / 8) * (1 - gone)} rx={12} fill="none" stroke={ORANGE} strokeWidth={6} strokeDasharray="14 12" transform={`translate(0 ${H * (1 - 869 / 1744) * 0})`} opacity={0.9} />
      <path d={`M 500 ${BASE + 8} H 1310`} stroke={SCH.line} strokeWidth={6} strokeLinecap="round" />
      <text x={625} y={BASE + 66} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={TEAL}>22 → 60</text>
      <text x={1185} y={BASE + 66} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={ORANGE}>32 → 60</text>
      <text x={625} y={BASE - hA - 22} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={60} fill={TEAL} stroke="#1A1230" strokeWidth={6} paintOrder="stroke" opacity={clamp((t - 10) / 4)}>≈ 1,7 TỶ</text>
      <text x={1185} y={BASE - hB - 22} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={60} fill={ORANGE} stroke="#1A1230" strokeWidth={6} paintOrder="stroke" opacity={clamp((t - 10) / 4)}>≈ 870 TRIỆU</text>
      {gone > 0 && gone < 1 ? <g transform={`translate(${gone * 60} ${-gone * 80})`} opacity={1 - gone}><FloatLabel x={1185} y={BASE - H * 0.75} t={Math.round(gone * 8)} text="−" size={120} color="#FF5A4A" /></g> : null}
      <g transform={`translate(960 ${240 + settle(t - 36, 8, 1.6, 5)}) scale(${backOut(clamp((t - 36) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={82} fill="#FFE27A" stroke="#1A1230" strokeWidth={10} paintOrder="stroke">CHẬM 10 NĂM = MẤT GẦN MỘT NỬA</text>
      </g>
      <g transform={`translate(960 1000) scale(${backOut(clamp((t - 66) / 8))})`}>
        <rect x={-440} y={-40} width={880} height={72} rx={36} fill="#0B0816" opacity={0.78} />
        <rect x={-440} y={-40} width={880} height={72} rx={36} fill="none" stroke="#F6EFE3" strokeWidth={3} opacity={0.85} />
        <text y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#F6EFE3" letterSpacing={2}>TOÁN HỌC · GIẢ ĐỊNH MINH HỌA</text>
      </g>
    </CardFrame>
  );
};
