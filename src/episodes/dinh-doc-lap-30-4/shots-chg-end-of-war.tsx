import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { breathe } from '../../countryball/ball-motion';
import { MuCoi } from '../../countryball/ball-accessories';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { Candle } from '../../countryball/ground-memorial-props';
import { FlagCloth } from '../../countryball/flag-cloth';
import { Cap, INK, Stage, easeOut, prog } from './chg-common';

// Chapter G, part 5 (8:48-8:56, beat "10d end of war"): the war ends, quiet and without a single hit. G17 smoke thins out as the sky pales, G18 the candles
// (hàng triệu người), G19 both sides: candles under a VNM and a RVN flag, the two balls side by side, sad. No numbers beyond "hàng triệu", no sound.

/** G17 "Cuộc chiến tranh dài nhất của Việt Nam trong thế kỷ hai mươi đã kết thúc." the last smoke thins, the sky pales. */
export const G17: React.FC<ShotProps> = ({ t }) => {
  const fade = 1 - easeOut(prog(t, 10, 100)), pale = easeOut(prog(t, 20, 108));
  return (
    <g>
      <Stage id="g17" tone="dusk" dim={0.15 * (1 - pale)} />
      <rect width={1920} height={1080} fill="#BFD9EE" opacity={0.35 * pale} />
      <path d={`M0,760 Q400,700 760,750 Q1100,690 1500,745 Q1760,720 1920,740 L1920,1080 L0,1080 Z`} fill="#25303A" stroke={INK} strokeWidth={5} />
      <circle cx={1450} cy={730 - 40 * pale} r={74} fill="#FFE9B0" opacity={0.85} />
      {[[420, 750, 330], [760, 760, 270], [1060, 745, 300]].map(([x, y, h], i) => <g key={i} opacity={fade}><SmokeColumn t={t} x={x} y={y} h={h} w={40} lean={0.22} life={110} /></g>)}
      <Cap t={t} at={4} x={960} y={150} text="CUỘC CHIẾN DÀI NHẤT" size={86} />
      <Cap t={t} at={22} x={960} y={250} text="CỦA VIỆT NAM TRONG THẾ KỶ 20" size={56} color="#CFE0F0" font="ui" />
      <Cap t={t} at={81} x={960} y={900} text="ĐÃ KẾT THÚC" size={104} color="#FFE08A" />
    </g>
  );
};

/** G18 "Nó đã lấy đi sinh mạng của hàng triệu người," candles light up one by one (no hits, no music). */
export const G18: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g18" tone="night" dim={0.2} />
    {Array.from({ length: 4 }, (_, r) => Array.from({ length: 12 }, (_, c) => {
      const i = r * 12 + c, lit = t > 4 + i * 1.2;
      return <Candle key={i} x={190 + c * 140 + (r % 2) * 40} y={520 + r * 130} s={110 - r * 4} t={t} lit={lit} seed={i} />;
    }))}
    <Cap t={t} at={0} x={960} y={190} text="ĐÃ LẤY ĐI SINH MẠNG CỦA" size={56} color="#CFD8E4" />
    <Cap t={t} at={30} x={960} y={300} text="HÀNG TRIỆU NGƯỜI" size={100} />
  </g>
);

/** G19 "ở cả hai miền, cả hai chiến tuyến." two flags, a candle row under each, the two balls beside each other, sad. */
export const G19: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 34, 52));
  return (
    <g>
      <Stage id="g19" tone="night" dim={0.2} />
      <g transform="translate(300,180)"><line x1={0} y1={0} x2={0} y2={250} stroke="#9AA5B1" strokeWidth={6} /><FlagCloth id="g19f1" x={2} y={0} w={220} h={146} kind="VNM" wave={0.5} t={t} /></g>
      <g transform="translate(1400,180)"><line x1={0} y1={0} x2={0} y2={250} stroke="#9AA5B1" strokeWidth={6} /><FlagCloth id="g19f2" x={2} y={0} w={220} h={146} kind="RVN" wave={0.5} t={t} /></g>
      {[0, 1, 2].map((i) => <Candle key={`a${i}`} x={230 + i * 120} y={900} s={170} t={t + i * 7} seed={i} />)}
      {[0, 1, 2].map((i) => <Candle key={`b${i}`} x={1330 + i * 120} y={900} s={170} t={t + i * 5} seed={i + 5} />)}
      <g opacity={k}>
        <Ball id="g19a" x={830} y={740} r={130} flag="VNM" eyes="sad" hat={<MuCoi />} tilt={-3} motion={breathe(t, 110, 0.015)} t={t} />
        <Ball id="g19b" x={1090} y={740} r={130} flag="RVN" eyes="sad" hat={<M1Helmet />} tilt={3} motion={breathe(t, 110, 0.015, 30)} t={t} />
      </g>
      <Cap t={t} at={17} x={960} y={180} text="Ở CẢ HAI MIỀN" size={80} />
      <Cap t={t} at={35} x={960} y={290} text="CẢ HAI CHIẾN TUYẾN" size={80} color="#FFE08A" />
    </g>
  );
};
