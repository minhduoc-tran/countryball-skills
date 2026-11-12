import React from 'react';
import { Schematic, SchLabel, SCH, FONT, clamp, easeOut, backOut } from '../../engine';
import { PAL, fmtM } from './kit-palette';

// Schematic cross-section of an ocean basin, fills 0..1920 x 1080 on the blueprint ground (includes <Schematic>).
//   <BasinSection id t water={1} everest={0} show? />      show = { names?, ticks?, volcano? } (all default true)
//   t     profile draws on over ~26 frames, labels pop on after; use the shot clock.
//   water 1..0 water level (1 = sea level y 330, 0 = empty basin). everest 0..1 lowers the 8.849 m silhouette into the
//   trench (at 1 a "> 2 km" bracket marks the gap to sea level).
// Scale: y = 330 + depth_m * 0.0625 (0 m = 330, -3.700 m = 561, -10.935 m = 1013).  Trench floor x 1130..1300 (centre 1215),
//   plain 680..880, ridge peak x 985 (-2.600 m), volcano base x 1430..1770 (-5.800 m), peak (1600, 67) = +4.207 m (10.007 m total).
export const SECTION = { SEA_Y: 330, K: 0.0625, TRENCH_X: 1215, TRENCH_Y: 1013, RIDGE_X: 985, VOLCANO_X: 1600, PLAIN_Y: 561 };

const Y = (d: number) => SECTION.SEA_Y + d * SECTION.K;
// profile points [x, depth m] (negative depth = above sea level)
const PTS: [number, number][] = [
  [250, -520], [330, -400], [380, -100], [405, 0], [500, 120], [520, 140], [560, 1200], [620, 2700], [680, 3700], [880, 3700],
  [930, 3300], [965, 2800], [985, 2600], [1005, 2850], [1040, 3400], [1065, 3750], [1090, 3800], [1130, 10935], [1300, 10935], [1340, 3800],
  [1390, 4600], [1430, 5800], [1500, 2000], [1560, -1500], [1600, -4207], [1640, -1500], [1700, 2000], [1770, 5800], [1810, 5000], [1860, 4000],
];
const profile = 'M ' + PTS.map(([x, d]) => `${x} ${Y(d).toFixed(1)}`).join(' L ');
const solid = `${profile} L 1860 1080 L 250 1080 Z`;

export const BasinSection: React.FC<{ id: string; t: number; water?: number; everest?: number; show?: { names?: boolean; ticks?: boolean; volcano?: boolean } }> = ({ id, t, water = 1, everest = 0, show }) => {
  const { names = true, ticks = true, volcano = true } = show ?? {};
  const k = easeOut(clamp(t / 26));
  const wy = SECTION.SEA_Y + (1080 - SECTION.SEA_Y) * (1 - clamp(water));
  const ev = easeOut(clamp(everest));
  const evDy = (1 - ev) * -760;
  const evTop = SECTION.TRENCH_Y - 553;
  const wave = Array.from({ length: 36 }).map((_, i) => `L ${250 + i * 46} ${wy + Math.sin(i * 0.9 + t * 0.12) * 3}`).join(' ');
  const L = (delay: number) => t - delay;
  return (
    <g>
      <Schematic t={t} id={id} />
      <defs>
        <linearGradient id={`${id}w`} gradientUnits="userSpaceOnUse" x1="0" y1={SECTION.SEA_Y} x2="0" y2="1080">
          <stop offset="0" stopColor={PAL.seaTop} stopOpacity="0.9" /><stop offset="1" stopColor={PAL.seaDeep} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="0" y2="1080">
          <stop offset="0" stopColor="#9C8A6A" /><stop offset="0.3" stopColor={PAL.abyssTop} /><stop offset="1" stopColor={PAL.abyssDeep} />
        </linearGradient>
      </defs>
      {/* sea level + depth ticks */}
      {ticks ? (
        <g opacity={k}>
          {[0, -3700, -10935].map((m) => (
            <g key={m}>
              <path d={`M 250 ${Y(-m)} L 1860 ${Y(-m)}`} stroke={SCH.dim} strokeWidth={2} strokeDasharray="10 10" opacity={0.6} />
              <text x={236} y={Y(-m) + 10} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={28} fill={m === 0 ? SCH.line : SCH.live}>{fmtM(m)}</text>
            </g>
          ))}
        </g>
      ) : null}
      {water > 0.001 ? (
        <g opacity={k}>
          <path d={`M 250 ${wy} ${wave} L 1860 ${wy} L 1860 1080 L 250 1080 Z`} fill={`url(#${id}w)`} />
          <path d={`M 250 ${wy} ${wave} L 1860 ${wy}`} stroke="#9AD3F2" strokeWidth={4} fill="none" />
        </g>
      ) : null}
      <path d={solid} fill={`url(#${id}g)`} opacity={k} />
      <path d={profile} fill="none" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
      <path d={`M 1575 ${Y(-3600)} L 1600 ${Y(-4207)} L 1625 ${Y(-3600)} Q 1600 ${Y(-3400)} 1575 ${Y(-3600)} Z`} fill="#F4F1EA" opacity={k} />
      <circle cx={1600} cy={Y(-4207) + 6} r={7} fill={SCH.live} opacity={k * (0.7 + 0.3 * Math.sin(t / 5))} />
      {/* names */}
      {names ? (
        <g>
          <SchLabel x={440} y={292} t={L(30)} text="THỀM LỤC ĐỊA" size={24} color={SCH.dim} />
          <SchLabel x={600} y={418} t={L(34)} text="SƯỜN" size={24} color={SCH.dim} anchor="start" />
          <SchLabel x={700} y={545} t={L(38)} text="ĐỒNG BẰNG" size={24} color={SCH.dim} anchor="start" />
          <SchLabel x={950} y={452} t={L(42)} text="DÃY NÚI GIỮA ĐẠI DƯƠNG" size={24} color={SCH.dim} />
          <SchLabel x={SECTION.TRENCH_X} y={292} t={L(46)} text="RÃNH MARIANA" size={28} color={SCH.line} />
        </g>
      ) : null}
      {volcano ? (
        <g opacity={clamp(L(48) / 8)}>
          <SchLabel x={1600} y={44} t={L(50)} text="NÚI LỬA" size={28} color={SCH.line} />
          <path d={`M 1790 ${Y(-4207)} L 1790 ${Y(5800)} M 1776 ${Y(-4207)} L 1804 ${Y(-4207)} M 1776 ${Y(5800)} L 1804 ${Y(5800)}`} stroke={SCH.live} strokeWidth={4} fill="none" strokeLinecap="round" />
          <text transform={`translate(1828 ${(Y(-4207) + Y(5800)) / 2}) rotate(-90)`} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill={SCH.live}>{'> 10.000 m'}</text>
        </g>
      ) : null}
      {/* Everest lowered into the trench */}
      {everest > 0 ? (
        <g>
          <g transform={`translate(0 ${evDy})`}>
            <path d={`M 1140 ${SECTION.TRENCH_Y} L 1178 ${evTop + 150} L 1196 ${evTop + 96} L 1215 ${evTop} L 1236 ${evTop + 90} L 1250 ${evTop + 130} L 1290 ${SECTION.TRENCH_Y} Z`} fill="#C8D4E2" stroke={SCH.line} strokeWidth={4} strokeLinejoin="round" />
            <path d={`M 1196 ${evTop + 96} L 1215 ${evTop} L 1236 ${evTop + 90} L 1224 ${evTop + 80} L 1212 ${evTop + 100} Z`} fill="#FFFFFF" />
            <path d={`M 1215 ${evTop} L 1250 ${evTop + 130} L 1290 ${SECTION.TRENCH_Y} L 1230 ${SECTION.TRENCH_Y} Z`} fill="#7E8DA6" opacity={0.45} />
          </g>
          <g opacity={clamp((everest - 0.7) / 0.3)}>
            <SchLabel x={1250} y={490} t={8} text="EVEREST" size={24} color={SCH.line} anchor="start" />
            <SchLabel x={1250} y={518} t={8} text="8.849 m" size={24} color={SCH.live} anchor="start" />
            <path d={`M 1170 ${SECTION.SEA_Y + 2} L 1170 ${evTop - 2} M 1160 ${SECTION.SEA_Y + 2} L 1180 ${SECTION.SEA_Y + 2} M 1160 ${evTop} L 1215 ${evTop}`} stroke={SCH.live} strokeWidth={4} fill="none" strokeLinecap="round" />
            <g transform={`translate(1150 ${(SECTION.SEA_Y + evTop) / 2 + 4}) scale(${backOut(clamp((everest - 0.75) / 0.25))})`}>
              <text textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={SCH.live}>{'> 2 km'}</text>
            </g>
          </g>
        </g>
      ) : null}
    </g>
  );
};
