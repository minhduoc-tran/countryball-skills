import React from 'react';
import { Schematic, SCH, SchLabel, CountUp, Sparkle, kf, clamp, easeOut, camT, ShotProps } from '../../engine';
import { NumCard } from '../khong-ai-ngheo/chb-cards-and-marks';
import { WorldDots, CutCable, SourceTag, ThatStamp, mapXY } from './chb-card-props';

// Chapter B, "day one: shutdown" (B10-B14): the Access Now numbers on schematic cards. 2023 (B10); a cable is cut and the
// wifi dies (B11); "283 LẦN" (B12); a world map where small cut cables pop up in 39 countries (B13); ĐÓ LÀ THẬT (B14).

const SRC = 'ACCESS NOW · 2023';

// ---------- B10: "2023" ----------
export const B10: React.FC<ShotProps> = ({ t, len }) => (
  <NumCard t={t} len={len} id="sb10" to={2023} statik>
    <WorldDots o={0.22} />
  </NumCard>
);

// ---------- B11: a cable across the card is cut with a spark; the wifi above it goes dark ----------
const CUT = 26;
export const B11: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - CUT) / 8);
  const gap = 90 * easeOut(k);
  const dead = t >= CUT;
  const col = dead ? SCH.dim : SCH.live;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t} id="sb11" />
      <SchLabel x={960} y={170} t={t - 2} text="INTERNET" size={84} />
      <g transform="translate(960 470) scale(2.4)" stroke={col} strokeWidth={6} fill="none" strokeLinecap="round" style={dead ? undefined : { filter: `drop-shadow(0 0 10px ${SCH.glow})` }}>
        <path d="M -56 -12 Q 0 -66 56 -12 M -36 10 Q 0 -24 36 10 M -16 30 Q 0 18 16 30" opacity={dead ? 0.5 : 1} />
        <circle cx={0} cy={48} r={5} fill={col} stroke="none" />
        {dead ? <path d="M -62 -52 L 62 62" stroke="#FF4A3A" strokeWidth={7} /> : null}
      </g>
      {[200, 1720].map((x) => <circle key={x} cx={x} cy={760} r={26} fill="none" stroke={SCH.line} strokeWidth={6} />)}
      <path d={`M 226 760 L ${960 - gap} 760`} stroke={SCH.line} strokeWidth={8} strokeLinecap="round" />
      <path d={`M ${960 + gap} 760 L 1694 760`} stroke={SCH.line} strokeWidth={8} strokeLinecap="round" />
      {!dead
        ? [0, 1, 2, 3, 4].map((i) => {
            const x = 226 + ((t * 24 + i * 300) % 1500);
            return x < 960 - 40 || x > 960 + 40 ? <circle key={i} cx={x} cy={760} r={9} fill={SCH.live} style={{ filter: `drop-shadow(0 0 8px ${SCH.glow})` }} /> : null;
          })
        : null}
      <CutCable x={960} y={760} t={t} at={CUT} s={2.4} />
    </g>
  );
};

// ---------- B12: "283 LẦN" ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => (
  <NumCard t={t} len={len} id="sb12" to={283} unit="LẦN" caption="INTERNET BỊ CẮT" dur={24}>
    <SourceTag x={140} y={1000} t={t - 8} text={SRC} />
  </NumCard>
);

// ---------- B13: a world map; cut cables pop up one after another; "39 QUỐC GIA" counts on ----------
const CABLES: [number, number][] = [
  [-110, 42], [-85, 18], [-60, -14], [-64, -38], [-5, 40], [15, 52], [10, 8], [30, -8], [40, 28], [62, 42], [80, 22], [100, 52], [112, 24], [138, 36], [135, -26],
];
export const B13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Schematic t={t} id="sb13" />
    <WorldDots o={0.9} />
    <CountUp x={960} y={215} t={t} to={39} dur={26} size={120} suffix=" QUỐC GIA" />
    {CABLES.map(([lon, lat], i) => {
      const p = mapXY(lon, lat);
      return <CutCable key={i} x={p.x} y={p.y} t={t} at={12 + i * 6} s={0.95} />;
    })}
    <SourceTag x={140} y={1000} t={t - 10} text={SRC} />
  </g>
);

// ---------- B14: ĐÓ LÀ THẬT ----------
export const B14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t} id="sb14" />
    <WorldDots o={0.3} />
    <ThatStamp x={960} y={520} t={t - 2} rot={-3} />
    <SourceTag x={960} y={720} t={t - 8} text={SRC} anchor="middle" />
    <Sparkle x={400} y={380} t={t - 8} s={1.2} />
    <Sparkle x={1540} y={650} t={t - 11} s={1.0} />
  </g>
);
