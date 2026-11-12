import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { DocumentProp } from '../../countryball/ball-speech-and-props';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { CITIES, City, Parallel } from '../../countryball/map-labels';
import { Glow } from '../../countryball/fx-glow';
import { backOut, easeOut, lerp, prog } from '../../countryball/fx-math';
import { At, MapShot, NightBg, Out, Tag } from './cha-map-scene';

// Chapter A, title and 1954: A8 twelve nights, A9 title card, A10 Điện Biên Phủ 1954, A11 Geneva document,
// A12 the country is split, A13 the 17th parallel.

const DBP = { lon: 103.02, lat: 21.39 };

export const A8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <NightBg t={t} id="a8" />
    <Out x={960} y={215} size={150} fill="#FFD43B" scale={Math.max(0.01, backOut((t - 4) / 12))}>12 NGÀY ĐÊM</Out>
    {Array.from({ length: 12 }, (_, i) => {
      const col = i % 6, row = Math.floor(i / 6), x = 285 + col * 270, y = 330 + row * 250 + 100, k = backOut((t - 12 - i * 7) / 10);
      const lit = k > 0.01;
      return (
        <g key={i} transform={`translate(${x},${y}) scale(${lit ? 1 + 0.02 * Math.max(0, 1 - (t - 12 - i * 7) / 12) : 1})`}>
          <rect x={-120} y={-95} width={240} height={190} rx={22} fill={lit ? '#26344F' : '#121A28'} stroke={lit ? '#E2B95A' : '#2A3447'} strokeWidth={lit ? 5 : 3} />
          <g transform="translate(-30,-82) scale(1.3)" opacity={lit ? Math.min(1, k) : 0.2}><path d="M44,14 A18,18 0 1 0 50,48 A14,14 0 0 1 44,14 Z" transform="translate(-4,2)" fill="#FFE9B0" /></g>
          <text y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill={lit ? '#F4F4F4' : '#4C586D'}>{18 + i}/12</text>
          <text y={72} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill={lit ? '#E2B95A' : '#3A465B'}>ĐÊM {i + 1}</text>
        </g>
      );
    })}
    <Tag x={960} y={930} text="18 - 29.12.1972" size={40} opacity={prog(t, 90, 104)} />
  </g>
);

export const A9: React.FC<ShotProps> = ({ t }) => {
  const pop = (at: number) => Math.max(0.01, backOut((t - at) / 10));
  const bx = lerp(-300, 2200, prog(t, 0, 88));
  return (
    <g>
      <NightBg t={t} id="a9" top="#0F1B33" bottom="#05080F" />
      <Glow x={960} y={560} r={900} color="#7A2A24" o={0.35} />
      <line x1={bx - 900} y1={150} x2={bx - 140} y2={150} stroke="#FFFFFF" strokeWidth={6} opacity={0.5} strokeLinecap="round" />
      <AircraftTop id="a9" kind="b52" x={bx} y={150} size={240} heading={0} />
      <Out x={960} y={380} size={200} fill="#FFFFFF" scale={pop(0)}>HÀ NỘI</Out>
      <Out x={960} y={580} size={176} fill="#FFD43B" scale={pop(19)}>ĐIỆN BIÊN PHỦ</Out>
      <Out x={960} y={780} size={176} fill="#FF6A4D" scale={pop(36)}>TRÊN KHÔNG</Out>
      <g opacity={prog(t, 52, 62)}><Tag x={960} y={930} text="12 NGÀY ĐÊM" size={48} /></g>
      <Ball id="a9v" x={230} y={880} r={110} flag="VNM" eyes="determined" hat={<MuCoi />} motion={mixMotion(breathe(t, 60), hopOnce(t, 40, 20, 40))} />
      <Ball id="a9u" x={1700} y={880} r={110} flag="USA" eyes="worried" motion={breathe(t, 66, 0.03, 20)} />
    </g>
  );
};

export const A10: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a10" date="1954" keys={[{ t: 0, lon: 104.4, lat: 21.0, zoom: 105 }, { t: 2.9, lon: 104.0, lat: 21.1, zoom: 150 }]}
    over={() => <Out x={1180} y={940} size={220} fill="#FFD43B" rot={-3} scale={Math.max(0.01, backOut((t - 6) / 12))}>1954</Out>}>
    <City lon={DBP.lon} lat={DBP.lat} name="Điện Biên Phủ" anchor="r" size={36} />
    <At lon={DBP.lon} lat={DBP.lat} dy={-84}>
      <Glow x={0} y={80} r={150} color="#FFCD00" o={0.5 * (0.6 + 0.4 * Math.sin(t / 6))} />
      <Ball id="a10" x={0} y={0} r={64} flag="VNM" eyes="happy" hat={<MuCoi />} motion={mixMotion(breathe(t, 50), hopOnce(t, 14, 22, 36), hopOnce(t, 50, 22, 30))} />
    </At>
    <City {...CITIES.hanoi} />
  </MapShot>
);

export const A11: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 4, 30)), x = 1280 + (1 - k) * 900;
  return (
    <MapShot t={t} id="a11" date="1954" dim={0.35} keys={[{ t: 0, lon: 105.0, lat: 16.6, zoom: 68 }, { t: 2.5, lon: 105.6, lat: 17.0, zoom: 74 }]}
      over={() => (
        <g>
          <DocumentProp x={x} y={540 + Math.sin(t / 12) * 6} s={3.3} rot={-5 + (1 - k) * 18} title="GIƠ-NE-VƠ" />
          <Out x={1280} y={250} size={74} opacity={prog(t, 20, 32)}>HIỆP ĐỊNH GIƠ-NE-VƠ</Out>
          <Ball id="a11" x={430} y={650} r={120} flag="VNM" eyes="determined" hat={<MuCoi />} motion={breathe(t, 62)} />
        </g>
      )} />
  );
};

const SPLIT_KEYS = (a: number, b: number) => [{ t: 0, lon: 106.2, lat: 16.6, zoom: a }, { t: 2.7, lon: 106.0, lat: 16.3, zoom: b }];

/** Zone name in the sea with a short arrow pointing back at the land (inside <GeoMap>). */
const Zone: React.FC<{ lon: number; lat: number; text: string; fill?: string; op?: number; size?: number }> = ({ lon, lat, text, fill = '#FFFFFF', op = 1, size = 54 }) => (
  <At lon={lon} lat={lat}>
    <g opacity={op}>
      <line x1={-12} y1={-size * 0.3} x2={-86} y2={-size * 0.3} stroke="#0B0F16" strokeWidth={14} strokeLinecap="round" />
      <line x1={-12} y1={-size * 0.3} x2={-86} y2={-size * 0.3} stroke={fill} strokeWidth={6} strokeLinecap="round" />
      <polygon points={`-100,${-size * 0.3} -70,${-size * 0.3 - 18} -70,${-size * 0.3 + 18}`} fill={fill} stroke="#0B0F16" strokeWidth={4} strokeLinejoin="round" />
      <Out x={6} y={0} size={size} anchor="start" fill={fill}>{text}</Out>
    </g>
  </At>
);

export const A12: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 14, 62));
  return (
    <MapShot t={t} id="a12" date="1954" keys={SPLIT_KEYS(64, 70)} south={{ lat: 17, k }}>
      <Zone lon={108.4} lat={20.2} text="MIỀN BẮC" op={prog(t, 8, 20)} />
      <Zone lon={110.4} lat={13.6} text="MIỀN NAM" fill="#F2D9A8" op={prog(t, 40, 54)} />
    </MapShot>
  );
};

export const A13: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a13" date="1954" south={{ lat: 17, k: 1 }}
    keys={[{ t: 0, lon: 106.0, lat: 16.3, zoom: 70 }, { t: 2.1, lon: 107.0, lat: 17.2, zoom: 175 }]}>
    <Parallel lat={17} label="VĨ TUYẾN 17" labelX={1250} />
    <At lon={105.5} lat={18.1}><Ball id="a13" x={0} y={0} r={62} flag="VNM" eyes="determined" hat={<MuCoi />} motion={breathe(t, 56)} /></At>
    <Zone lon={108.3} lat={17.9} text="MIỀN BẮC" size={46} />
    <Zone lon={108.9} lat={16.4} text="MIỀN NAM" size={46} fill="#F2D9A8" />
  </MapShot>
);
