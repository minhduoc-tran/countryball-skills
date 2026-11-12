import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { breathe } from '../../countryball/ball-motion';
import { GeoMap } from '../../countryball/map-geo-map';
import { useGeo } from '../../countryball/map-context';
import { Camera } from '../../countryball/geo-camera';
import { DateChip } from '../../countryball/hud-date-chip';
import { HoaDang } from '../../countryball/ground-memorial-props';
import { Glow } from '../../countryball/fx-glow';
import { backOut, hash } from '../../countryball/fx-math';
import { Txt } from './chb-common';
import { CinemaSeats } from './chh-icons';
import { LanternField, RiverScene } from './chh-river-night';
import { SoftT, easeOut, prog } from './chh-text-and-plan';

// Chapter H part 5 (11:09-11:20, beat "35 film"): the 2025 film "Mưa đỏ" as a plain title card (no poster, no likeness), the cinema
// filling up, young people travelling to Quảng Trị, and the one VNM ball of the chapter at the river.

/** H23 "Năm 2025, bộ phim Mưa đỏ kể về tám mươi mốt ngày đêm này" plain title card with a slow red rain. */
export const H23: React.FC<ShotProps> = ({ t }) => {
  const yearU = easeOut(prog(t, 3, 18)), titleU = backOut(prog(t, 55, 68)), shift = easeOut(prog(t, 52, 66));
  return (
    <g>
      <defs><linearGradient id="h23-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C0C10" /><stop offset="1" stopColor="#07080D" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#h23-bg)" />
      {Array.from({ length: 90 }, (_, i) => {
        const sp = 7 + 9 * hash(i, 1), x = ((hash(i, 2) * 2300 - t * sp * 0.28) % 2300 + 2300) % 2300 - 200, y = ((hash(i, 3) * 1300 + t * sp) % 1300) - 110, len = 40 + 60 * hash(i, 4);
        return <line key={i} x1={x} y1={y} x2={x - len * 0.28} y2={y + len} stroke={hash(i, 5) > 0.3 ? '#C23A34' : '#E8795F'} strokeWidth={2 + 2 * hash(i, 6)} strokeLinecap="round" opacity={0.18 + 0.3 * hash(i, 7)} />;
      })}
      <Glow x={960} y={540} r={760} color="#8E1F26" o={0.28} />
      <text x={960} y={620 - shift * 330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={380 - shift * 270} fill="#FFE9B8" stroke="#1A0A0C" strokeWidth={30 - shift * 18} paintOrder="stroke" strokeLinejoin="round"
        opacity={yearU} letterSpacing={shift * 14}>2025</text>
      {titleU > 0.01 && (
        <g transform={`translate(960,590) scale(${titleU})`} opacity={Math.min(1, titleU * 2)}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={290} fill="#E5483C" stroke="#1A0A0C" strokeWidth={30} paintOrder="stroke" strokeLinejoin="round" letterSpacing={8}>MƯA ĐỎ</text>
          <text y={110} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill="#FFE9B8" stroke="#1A0A0C" strokeWidth={9} paintOrder="stroke">phim điện ảnh Việt Nam</text>
        </g>
      )}
      <SoftT t={t} x={960} y={900} text="81 NGÀY ĐÊM" size={74} at={92} color="#F4C95A" ls={10} />
    </g>
  );
};

/** H24 "đã đưa hàng triệu người Việt Nam tới rạp." Cinema seats fill with heads. */
export const H24: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0710" />
    <CinemaSeats t={t} filled={prog(t, 4, 52)} id="h24" />
    <Txt x={960} y={262} text="HÀNG TRIỆU" size={118} color="#FFFFFF" o={easeOut(prog(t, 6, 18))} />
    <Txt x={960} y={344} text="người Việt Nam tới rạp" size={58} color="#FFE9B8" font={FONT.hand} o={easeOut(prog(t, 16, 28))} />
  </g>
);

const SPOTS: [number, number, string][] = [[105.85, 21.03, 'Hà Nội'], [106.68, 20.86, ''], [105.68, 18.68, 'Vinh'], [108.2, 16.05, 'Đà Nẵng'], [109.19, 12.24, ''], [108.04, 12.67, ''], [106.7, 10.78, 'TP. Hồ Chí Minh'], [105.78, 10.03, '']];
const QT: [number, number] = [107.19, 16.75];
/** Travellers (small warm dots) flowing to Quảng Trị along curved lines. */
const Flows: React.FC<{ t: number }> = ({ t }) => {
  const { project } = useGeo(), q = project(QT[0], QT[1]);
  return (
    <g>
      {SPOTS.map(([lo, la, name], i) => {
        const p = project(lo, la), mx = (p[0] + q[0]) / 2 + (p[1] > q[1] ? -120 : 120) * (i % 2 ? 1 : 0.6), my = (p[1] + q[1]) / 2;
        const at = (u: number): [number, number] => [(1 - u) * (1 - u) * p[0] + 2 * (1 - u) * u * mx + u * u * q[0], (1 - u) * (1 - u) * p[1] + 2 * (1 - u) * u * my + u * u * q[1]];
        const on = prog(t, 2 + i * 3, 14 + i * 3);
        return (
          <g key={i} opacity={on}>
            <path d={`M${p[0]},${p[1]} Q${mx},${my} ${q[0]},${q[1]}`} fill="none" stroke="#FFE9B8" strokeWidth={3} strokeDasharray="4 12" strokeLinecap="round" opacity={0.6} />
            <circle cx={p[0]} cy={p[1]} r={9} fill="#FFE9B8" stroke="#0A121C" strokeWidth={3} />
            {name && <Txt x={p[0] + (lo > 106.9 ? 24 : -24)} y={p[1] + 8} anchor={lo > 106.9 ? 'start' : 'end'} text={name} size={30} stroke="#0A121C" />}
            {[0, 1, 2].map((j) => { const u = ((t * 0.012 + j / 3 + i * 0.13) % 1), [x, y] = at(u); return <g key={j}><Glow x={x} y={y} r={26} color="#FFB347" o={0.7} /><circle cx={x} cy={y} r={6} fill="#FFF3C8" stroke="#0A121C" strokeWidth={2} /></g>; })}
          </g>
        );
      })}
      <circle cx={q[0]} cy={q[1]} r={20 + 14 * ((t % 40) / 40)} fill="none" stroke="#FFE9B8" strokeWidth={4} opacity={1 - (t % 40) / 40} />
      <circle cx={q[0]} cy={q[1]} r={12} fill="#FFD43B" stroke="#0A121C" strokeWidth={4} />
      <Txt x={q[0] + 26} y={q[1] - 20} anchor="start" text="QUẢNG TRỊ" size={44} color="#FFD43B" />
    </g>
  );
};

/** H25 "rất nhiều người trẻ đã tìm về Quảng Trị," */
export const H25: React.FC<ShotProps> = ({ t }) => {
  const cam: Camera = { lon: 107.3 + 0.0, lat: 15.7, zoom: 64 + 0.04 * t };
  return (
    <g>
      <GeoMap camera={cam} id="h25" rivers={false}><Flows t={t} /></GeoMap>
      <DateChip label="2025" t={t / 30} id="h25-date" />
      <SoftT t={t} x={540} y={1000} text="người trẻ tìm về Quảng Trị" size={56} at={10} font="hand" weight={700} color="#FFE9B8" />
    </g>
  );
};

/** H26 "để tận mắt nhìn thấy dòng sông ấy." The VNM ball on the bank, looking at the river among the lanterns. */
export const H26: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RiverScene id="h26" moonX={1720} t={t} tone={0.85} H={540} pan={t * 0.3}>
      <LanternField id="h26" t={t} n={60} H={540} t0={-60} span={1} speed={0.28} seed={14} dMin={0.1} />
      <HoaDang x={1120 + t * 0.6} y={830} s={120} t={t} color="pink" ph={9} />
    </RiverScene>
    <path d="M-20,1100 L-20,820 Q300,770 640,840 Q900,900 1020,1100 Z" fill="#04080F" />
    <Ball id="h26b" x={520} y={716} r={112} flag="VNM" eyes="normal" look={0.8} tilt={-2} t={t} motion={breathe(t, 80, 0.025)} />
    <SoftT t={t} x={1130} y={190} text="dòng sông ấy" size={90} at={22} font="hand" weight={700} color="#FFE9B8" glow="#FFB347" />
  </g>
);
