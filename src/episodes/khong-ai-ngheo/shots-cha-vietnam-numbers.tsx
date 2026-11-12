import React from 'react';
import { kf, clamp, easeOut, backOut, camT, Schematic, SCH, FONT, Sparkle, ShotProps } from '../../engine';
import { VnOutline } from '../tien-vo-han/cha-vietnam-map-props';
import { GridPerson, BigStat, Cap } from './cha-number-card-props';

// Chapter A, the Vietnam scale beat (42.38-49.32 s), look "before": "Việt Nam mình cũng từng như vậy", 1993, 10 people with
// 6 dimmed (gần sáu trên mười), the 58% under the poverty line.

const CREAM = '#F6EFE3';
// people scattered along the map's spine (in the map's own 400 x 880 box); the first 7 are dim: 7 of 12 is 58%
const SPINE: [number, number][] = [[250, 120], [190, 230], [205, 330], [215, 430], [225, 520], [270, 610], [280, 700], [230, 790], [160, 845], [130, 300], [300, 200], [330, 640]];
const ROW = { x0: 285, dx: 150, s: 2.0 };

// ---------- A26: "Việt Nam mình cũng từng như vậy": Vietnam's outline draws on, most of the people in it dimmed ----------
export const A26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Schematic t={t + 340} id="a26sch" />
    <g transform="translate(480 110) scale(0.95)">
      <VnOutline id="a26vn" t={t} t0={2} dur={20} fillT={16} />
      {SPINE.map(([x, y], i) => <GridPerson key={i} x={x} y={y} s={1.35} dim={i < 7 ? 1 : 0} pop={backOut(clamp((t - 14 - i * 1.5) / 7))} />)}
    </g>
    <BigStat x={1380} y={520} t={t - 8} text="VIỆT NAM" size={150} color={CREAM} />
    <Cap x={1380} y={600} t={t - 20} text="CŨNG TỪNG NHƯ VẬY" size={38} />
  </g>
);

// ---------- A27: "Năm 1993": the year slams down ----------
export const A27: React.FC<ShotProps> = ({ t, len }) => {
  const s = t < 8 ? 2.4 - 1.4 * easeOut(clamp(t / 8)) : 1 + 0.05 * Math.exp(-(t - 8) / 4) * Math.cos((t - 8) / 1.5);
  const dy = t > 7 && t < 14 ? Math.sin((t - 7) * 3) * 7 * (1 - (t - 7) / 7) : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t + 380} id="a27sch" />
      <Cap x={960} y={330} t={t - 2} text="NĂM" size={64} />
      <g transform={`translate(960 ${660 + dy}) scale(${s})`} opacity={clamp(t / 3)}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={340} fill={CREAM} stroke="#101A2A" strokeWidth={14} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 24px ${SCH.glow}55)` }}>1993</text>
      </g>
      <Cap x={960} y={830} t={t - 14} text="VIỆT NAM" size={52} color={SCH.live} />
      <Sparkle x={1500} y={420} t={t - 9} s={1.5} />
    </g>
  );
};

// ---------- A28: "gần sáu trên mười người Việt": ten people, six dim down one by one ----------
export const A28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <Schematic t={t + 420} id="a28sch" />
    <Cap x={960} y={250} t={t - 1} text="VIỆT NAM · 1993" size={50} color={CREAM} />
    {Array.from({ length: 10 }).map((_, i) => (
      <GridPerson key={i} x={ROW.x0 + i * ROW.dx} y={520} s={ROW.s} dim={i < 6 ? clamp((t - (6 + i * 3.2)) / 5) : 0} pop={backOut(clamp((t - 1 - i * 0.6) / 7))} />
    ))}
    <BigStat x={960} y={900} t={t - 24} text="6 / 10" size={170} />
  </g>
);

// ---------- A29: "sống dưới chuẩn nghèo": the six slide under a dashed poverty line; 58% ----------
export const A29: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.04], [len, 1.0]]))}>
    <Schematic t={t + 460} id="a29sch" />
    <path d="M 160 640 H 1760" stroke="#FFD36B" strokeWidth={8} strokeDasharray="30 18" strokeLinecap="round" opacity={clamp((t - 2) / 8)} style={{ filter: 'drop-shadow(0 0 10px rgba(255,200,90,0.6))' }} />
    <Cap x={1500} y={740} t={t - 16} text="CHUẨN NGHÈO" size={46} color="#FFD36B" />
    {Array.from({ length: 10 }).map((_, i) => {
      const down = i < 6 ? easeOut(clamp((t - (8 + i * 2)) / 9)) : 0;
      return <GridPerson key={i} x={ROW.x0 + i * ROW.dx} y={520 + 250 * down} s={ROW.s} dim={i < 6 ? 1 : 0} />;
    })}
    <BigStat x={960} y={330} t={t - 26} text="58%" size={230} />
  </g>
);
