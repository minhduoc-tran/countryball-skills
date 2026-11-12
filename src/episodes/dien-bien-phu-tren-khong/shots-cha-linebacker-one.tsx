import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { UsafCap } from '../../countryball/ball-accessories';
import { breathe, mixMotion, talk } from '../../countryball/ball-motion';
import { SpeechBubble } from '../../countryball/ball-speech-and-props';
import { LowerThird } from '../../countryball/hud-chips';
import { PhotoCard } from '../../countryball/photo-card';
import { CITIES, City } from '../../countryball/map-labels';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { Glow } from '../../countryball/fx-glow';
import { easeOut, lerp, prog } from '../../countryball/fx-math';
import { At, GeoFlight, LL, MapShot, NameCard, Tag, sec } from './cha-map-scene';

// Chapter A, spring 1972 and Linebacker I: A31 fighting in the South, A32 Nixon orders bombing of the North,
// A33 mines at Hải Phòng, A34 "Linebacker I" (US name), A35 bombs vs secret talks (split screen), A36 photo card.

const FIGHTS: [number, number, number][] = [[107.0, 16.8, 36], [107.6, 15.5, 48], [108.1, 14.4, 60], [106.6, 13.3, 72], [106.2, 12.1, 84], [107.7, 13.0, 96], [105.9, 14.7, 108]];

export const A31: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a31" date="1972" keys={[{ t: 0, lon: 107.6, lat: 15.0, zoom: 80 }, { t: 4.6, lon: 107.4, lat: 14.0, zoom: 94 }]}>
    <City {...CITIES.saigon} /><City {...CITIES.danang} />
    {FIGHTS.map(([lo, la, at], i) => <At key={i} lon={lo} lat={la}><GroundBlast t={t} t0={at} x={0} y={0} r={24} linger={80} /></At>)}
    <LowerThird title="Mùa xuân 1972" sub="Chiến sự ở miền Nam bùng lên dữ dội" from={0.3} t={sec(t)} />
  </MapShot>
);

const NORTH: { f: LL; route: LL[]; t0: number; t1: number }[] = [
  { f: [105.85, 21.03], route: [[109.6, 19.7], [107.6, 20.4], [105.85, 21.03]], t0: 8, t1: 60 },
  { f: [105.7, 18.7], route: [[109.4, 18.2], [107.4, 18.7], [105.7, 18.7]], t0: 16, t1: 66 },
  { f: [106.68, 20.86], route: [[109.7, 20.9], [108.2, 20.9], [106.68, 20.86]], t0: 22, t1: 72 },
];

export const A32: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a32" date="5.1972" keys={[{ t: 0, lon: 103.4, lat: 19.8, zoom: 98 }, { t: 2.8, lon: 103.7, lat: 19.9, zoom: 108 }]}
    over={() => <NameCard x={400} y={440} w={400} name="RICHARD NIXON" sub="Tổng thống Mỹ" s={sec(t)} from={0.1} />}>
    <City {...CITIES.hanoi} /><City {...CITIES.haiphong} /><City {...CITIES.vinh} />
    {NORTH.map((b, i) => <GeoFlight key={i} id={`a32${i}`} t={t} t0={b.t0} t1={b.t1} kind="f4" size={72} route={b.route} />)}
    {NORTH.map((b, i) => <At key={i} lon={b.f[0]} lat={b.f[1]}><GroundBlast t={t} t0={b.t1 - 2} x={0} y={0} r={26} linger={60} /></At>)}
    <LowerThird title="Ném bom trở lại miền Bắc" sub="Tháng 5.1972" from={0.5} t={sec(t)} />
  </MapShot>
);

const MINES: [number, number, number][] = [[106.96, 20.74, 8], [107.03, 20.8, 14], [107.09, 20.7, 20], [106.98, 20.64, 26], [107.12, 20.82, 32], [107.05, 20.6, 38]];
const Mine: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const a = t - t0;
  if (a < 0) return null;
  const fall = Math.min(1, a / 12), y = -420 * (1 - fall * fall), splash = prog(a, 12, 30);
  return (
    <g>
      {splash > 0 && splash < 1 && <circle r={10 + splash * 46} fill="none" stroke="#DCEBFA" strokeWidth={4} opacity={1 - splash} />}
      <g transform={`translate(0,${y + (fall >= 1 ? Math.sin(a / 8) * 2 : 0)})`}>
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={0} x2={0} y2={-22} stroke="#111" strokeWidth={5} strokeLinecap="round" transform={`rotate(${i * 45})`} />)}
        <circle r={14} fill="#3A3F45" stroke="#111" strokeWidth={4} />
      </g>
    </g>
  );
};
const Ship: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-34,0 L34,0 L24,16 L-26,16 Z" fill="#6B7380" stroke="#111" strokeWidth={4} strokeLinejoin="round" />
    <rect x={-8} y={-16} width={22} height={16} fill="#E9E6DA" stroke="#111" strokeWidth={4} />
  </g>
);

export const A33: React.FC<ShotProps> = ({ t }) => {
  const ship = (i: number) => {
    const k = easeOut(prog(t, i * 6, 46 + i * 4));
    return <At key={i} lon={lerp(107.6 + i * 0.05, 107.18 + i * 0.03, k)} lat={20.5 + i * 0.13}><Ship x={0} y={0} /></At>;
  };
  return (
    <MapShot t={t} id="a33" date="5.1972" keys={[{ t: 0, lon: 106.75, lat: 20.76, zoom: 520 }, { t: 2.4, lon: 106.82, lat: 20.78, zoom: 640 }]}>
      <City {...CITIES.haiphong} size={34} />
      {[0, 1, 2].map(ship)}
      {MINES.map(([lo, la, at], i) => <At key={i} lon={lo} lat={la}><Mine t={t} t0={at} /></At>)}
      <GeoFlight id="a33" t={t} t0={0} t1={50} kind="f4" size={110} route={[[107.5, 21.05], [106.95, 20.78], [106.5, 20.5]]} />
      <At lon={107.18} lat={20.63} dx={90}>
        <g opacity={prog(t, 50, 60)}><circle r={34} fill="#E0342F" stroke="#111" strokeWidth={5} /><path d="M-14,-14 L14,14 M14,-14 L-14,14" stroke="#fff" strokeWidth={9} strokeLinecap="round" /></g>
      </At>
      <LowerThird title="Thả thủy lôi phong tỏa cảng Hải Phòng" from={0.3} t={sec(t)} />
    </MapShot>
  );
};

export const A34: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a34" dim={0.55} date="1972" keys={[{ t: 0, lon: 105.8, lat: 20.0, zoom: 100 }, { t: 2.5, lon: 105.6, lat: 19.4, zoom: 108 }]}
    over={() => (
      <g>
        <Ball id="a34" x={470} y={640} r={150} flag="USA" eyes="determined" hat={<UsafCap />} motion={mixMotion(breathe(t, 60), talk(t, t > 8 && t < 56, 1))} />
        <SpeechBubble x={1000} y={340} tipX={540} tipY={560} text="LINEBACKER I" size={100} t={t} at={8} />
        <Tag x={1000} y={600} text="TÊN GỌI CỦA PHÍA MỸ" size={36} opacity={prog(t, 24, 34)} />
        <Tag x={1000} y={700} text="9.5 - 23.10.1972" size={36} color="#8EA8E8" opacity={prog(t, 34, 44)} />
      </g>
    )} />
);

const LEFT_CAM = [{ t: 0, lon: 110.1, lat: 20.3, zoom: 120 }, { t: 2.5, lon: 109.9, lat: 20.3, zoom: 130 }];
export const A35: React.FC<ShotProps> = ({ t }) => {
  const open = Math.sin(prog(t, 14, 60) * Math.PI) * 46, swing = Math.sin(t / 6) * 6;
  return (
    <g>
      <clipPath id="a35-left"><rect width={960} height={1080} /></clipPath>
      <g clipPath="url(#a35-left)">
        <MapShot t={t} id="a35" night={0.8} date="1972" keys={LEFT_CAM} minimap={false}>
          <City {...CITIES.hanoi} lights={1} /><City {...CITIES.haiphong} lights={0.9} />
          {[[105.85, 21.03, 6], [106.68, 20.86, 20], [105.9, 21.1, 34], [105.7, 20.9, 48]].map(([lo, la, at], i) => (
            <At key={i} lon={lo} lat={la}><GroundBlast t={t} t0={at} x={0} y={0} r={24} linger={70} /></At>
          ))}
        </MapShot>
        <Tag x={480} y={950} text="BOM ĐẠN" color="#FF6F6F" size={40} />
      </g>
      <rect x={960} width={960} height={1080} fill="#141B28" />
      <rect x={1230} y={210} width={420} height={600} rx={14} fill={`rgb(${255},${210},${110})`} opacity={0.35 + open / 80} />
      <rect x={1250 + open} y={230} width={380 - open} height={560} rx={10} fill="#5B4030" stroke="#111" strokeWidth={8} />
      <rect x={1280 + open} y={262} width={320 - open} height={220} rx={8} fill="none" stroke="#3E2B20" strokeWidth={6} />
      <rect x={1280 + open} y={520} width={320 - open} height={220} rx={8} fill="none" stroke="#3E2B20" strokeWidth={6} />
      <circle cx={1580} cy={520} r={16} fill="#D9B24A" stroke="#111" strokeWidth={5} />
      <g transform={`translate(1440,440) rotate(${swing} 0 -30)`}>
        <path d="M-30,0 V-40 A30,30 0 0 1 30,-40 V0" fill="none" stroke="#C7CDD6" strokeWidth={12} />
        <rect x={-48} y={0} width={96} height={72} rx={10} fill="#E2B95A" stroke="#111" strokeWidth={6} />
        <circle cy={30} r={9} fill="#111" />
      </g>
      <Tag x={1440} y={950} text="ĐÀM PHÁN BÍ MẬT" color="#E2B95A" size={40} opacity={prog(t, 20, 32)} />
      <Glow x={1440} y={520} r={420} color="#FFB44D" o={0.12 + open / 400} />
      <rect x={955} width={10} height={1080} fill="#E2B95A" />
    </g>
  );
};

export const A36: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a36" dim={0.6} date="1972" highlight={['FRA']} provinces={false} labels={false}
    keys={[{ t: 0, lon: 2.4, lat: 48.5, zoom: 95 }, { t: 3.2, lon: 2.3, lat: 48.9, zoom: 110 }]}
    over={() => (
      <g>
        <PhotoCard id="a36p" src="dien-bien-phu-tren-khong/img/le-duc-tho-kissinger.jpg" caption="Hai đoàn đàm phán ở Paris (ảnh 1.1973)" credit="Ảnh: Nhà Trắng (White House) / Public domain"
          x={1010} y={450} w={860} h={557} rot={-2} from={0.1} t={sec(t)} />
        <LowerThird title="Kissinger và Lê Đức Thọ" sub="Đàm phán bí mật ở Paris" from={0.4} t={sec(t)} />
      </g>
    )}><City {...CITIES.paris} /></MapShot>
);
