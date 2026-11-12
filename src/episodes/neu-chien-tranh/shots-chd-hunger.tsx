import React from 'react';
import { kf, clamp, easeOut, backOut, camT, Schematic, SchLabel, SCH, FONT, Glow, Dust, LightVeil, Foreground, ShotProps } from '../../engine';
import { WorldMap, MAP_BOWLS } from '../tien-vo-han/chb-hunger-map-props';
import { Cap } from '../khong-ai-ngheo/cha-number-card-props';
import { fmtVN } from '../khong-ai-ngheo/chb-cards-and-marks';
import { BackFigure, BackChild, ServingTable, AidYard, BowlStack, EmptyBowl, BackLook } from './chd-hunger-props';
import { SourceTag, ThatReal } from './chd-card-props';

// Chapter D (207.5-217.2 s), "year one: hunger", look y1. D15 a food-aid queue seen only from behind, empty bowls in the
// near blur; D16 the card 2023 and ≈ 282 TRIỆU NGƯỜI; D17 the world map where empty bowls light up; D18 "XUNG ĐỘT =
// NGUYÊN NHÂN HÀNG ĐẦU" with the source tag (Global Report on Food Crises) and the tick.

const QUEUE: BackLook[] = [
  { top: '#6A7A8A', bottom: '#3A3446', hair: '#2A1C18', hat: null },
  { top: '#8A6A5A', bottom: '#4A3C3C', hair: '#6A5A52', hat: 'scarf' },
  { top: '#5A6A5A', bottom: '#3A3A4A', hair: '#1E1418', hat: 'cone' },
  { top: '#7A5A6A', bottom: '#33303F', hair: '#3A2620', hat: null },
  { top: '#8A8A6A', bottom: '#3A3446', hair: '#2A1C18', hat: 'cap' },
  { top: '#5A5A7A', bottom: '#2E2A3A', hair: '#1E1418', hat: null },
  { top: '#8A6A6A', bottom: '#3A3446', hair: '#BDBAC4', hat: null },
  { top: '#6A8A8A', bottom: '#33303F', hair: '#2A1C18', hat: 'cone' },
  { top: '#7A7A8A', bottom: '#3A3446', hair: '#3A2620', hat: null },
];

// ---------- D15: "Và thứ thiếu nhất là thức ăn.": the long queue from behind, the table far off, empty bowls up close ----------
export const D15: React.FC<ShotProps> = ({ t, len }) => {
  const shuffle = kf(t, [[0, 0], [len, -34]]);
  const figs = QUEUE.map((look, i) => {
    const u = i / (QUEUE.length - 1);
    return { look, x: 1420 - 1000 * u + shuffle * (1 - 0.6 * u), y: 1030 - 305 * Math.pow(u, 0.85), s: 1.0 - 0.68 * u, i };
  }).reverse();
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 820]]), 620, kf(t, [[0, 1.0], [len, 1.16]]))}>
      <AidYard id="d15" t={t} />
      <ServingTable x={300} y={712} s={0.95} t={t} />
      {figs.map((f) => (
        <g key={f.i} filter="url(#rimL)">
          <BackFigure x={f.x} y={f.y} s={f.s} look={f.look} sway={Math.sin(t / 9 + f.i) * 1.2} />
          {f.i === 2 ? <BackChild x={f.x + 92 * f.s} y={f.y} s={f.s * 1.05} top="#C9784A" /> : null}
        </g>
      ))}
      <Glow x={300} y={560} r={520} o={0.35} />
      <LightVeil id="d15veil" lights={[[300, 560, 640], [1000, 760, 800]]} o={0.34} />
      <Dust t={t} seed={91} x0={200} y0={400} w={1100} h={400} n={18} o={0.4} />
      <Foreground blur={10}><BowlStack x={110} y={1150} s={1.35} n={5} /></Foreground>
    </g>
  );
};

// ---------- D16: "Năm 2023, gần 282 triệu người": the year, then the number counts up over a row of empty bowls ----------
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const v = 282 * easeOut(clamp((t - 52) / 34));
  const yearK = easeOut(clamp((t - 46) / 12));
  const pop = 0.9 + 0.1 * backOut(clamp((t - 50) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Schematic t={t} id="d16sch" />
      <g transform={`translate(960 ${590 - 380 * yearK}) scale(${(1 - 0.5 * yearK) * backOut(clamp((t + 2) / 9))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={300} fill={SCH.line} stroke="#101A2A" strokeWidth={14} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 20px ${SCH.glow}44)` }}>2023</text>
      </g>
      {t > 50 ? (
        <g transform={`translate(960 600) scale(${pop})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={290} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{`≈ ${fmtVN(v)}`}</text>
        </g>
      ) : null}
      <text x={960} y={730} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={104} fill={SCH.line} letterSpacing={5} opacity={easeOut(clamp((t - 62) / 8))}>TRIỆU NGƯỜI</text>
      {Array.from({ length: 11 }).map((_, i) => (
        <g key={i} opacity={easeOut(clamp((t - 56 - i * 2.2) / 6))}><EmptyBowl x={360 + i * 120} y={880} s={0.62} /></g>
      ))}
    </g>
  );
};

// ---------- D17: "trên thế giới bị đói cấp tính,": the world on the blueprint, empty bowls ringing orange ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Schematic t={t + 100} id="d17sch" />
    <WorldMap x={210} y={170} s={1.5} o={0.8} />
    {MAP_BOWLS.map(([bx, by], i) => {
      const k = backOut(clamp((t - 2 - i * 3) / 7));
      const r = (((t - i * 5) * 0.035) % 1 + 1) % 1;
      const x = 210 + bx * 1.5;
      const y = 170 + by * 1.5;
      return (
        <g key={i} opacity={clamp(k * 2)}>
          <circle cx={x} cy={y + 24} r={30 + r * 70} fill="none" stroke={SCH.live} strokeWidth={4} opacity={0.8 * (1 - r)} />
          <g transform={`translate(${x} ${y + 24}) scale(${k})`}><EmptyBowl x={0} y={-24} s={0.62} /></g>
        </g>
      );
    })}
    <SchLabel x={960} y={1000} t={t - 8} text="ĐÓI CẤP TÍNH" size={64} color={SCH.live} />
  </g>
);

// ---------- D18: "và xung đột là nguyên nhân hàng đầu. Đó là thật.": the card, the source tag, the tick ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => {
  const medal = backOut(clamp((t - 30) / 9));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Schematic t={t + 150} id="d18sch" />
      <g transform={`translate(960 330) scale(${backOut(clamp((t - 2) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={190} fill={SCH.live} stroke="#101A2A" strokeWidth={12} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}77)` }}>XUNG ĐỘT</text>
      </g>
      <g transform={`translate(960 470) scale(${backOut(clamp((t - 12) / 7))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={110} fill={SCH.line}>=</text>
      </g>
      <g transform={`translate(900 620) scale(${backOut(clamp((t - 20) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={84} fill={SCH.line} stroke="#101A2A" strokeWidth={8} paintOrder="stroke" letterSpacing={3}>NGUYÊN NHÂN HÀNG ĐẦU</text>
      </g>
      <g transform={`translate(1700 560) scale(${medal})`} style={{ filter: `drop-shadow(0 0 20px ${SCH.glow}88)` }}>
        <circle r={96} fill={`${SCH.live}22`} stroke={SCH.live} strokeWidth={8} />
        <text y={52} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={150} fill={SCH.live}>1</text>
      </g>
      <Cap x={960} y={134} t={t - 3} text="NẠN ĐÓI" size={44} />
      <ThatReal x={960} y={830} t={t - 62} />
      <SourceTag x={96} y={976} t={t - 8} text="GLOBAL REPORT ON FOOD CRISES" />
    </g>
  );
};
