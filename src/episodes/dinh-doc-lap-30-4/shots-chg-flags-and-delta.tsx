import React from 'react';
import { ShotProps } from '../../engine';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { SaigonLabels, SaigonSites } from '../../countryball/sai-gon-map-labels';
import { FlagKind } from '../../countryball/flag-cloth';
import { backOut } from '../../countryball/fx-math';
import { TruckSide } from './chb-icons';
import { Cap, INK, MapScene, PopFlag, Stage, Tag, drift, prog } from './chg-common';
import { PoleFlag, Shophouse, windowXY } from './chg-icons';

// Chapter G, part 3 (8:23-8:35, beat "10c city"): flags across the city (map), in windows / on roofs / on a truck (street), the Mekong delta (RVN flags
// turn into PRG one by one: "lần lượt buông súng", calm), and 02.05.1975 (the whole South). Flags only: no fighting, no crowds cheering.
// Sound: soft pops, no hits.

/** G9 "Trên khắp thành phố, những lá cờ mới xuất hiện" flags pop across the city map. */
const CITY_FLAGS: [number, number, FlagKind][] = [
  [106.6953, 10.7769, 'PRG'], [106.7012, 10.7897, 'PRG'], [106.6563, 10.8182, 'VNM'], [106.7272, 10.7988, 'PRG'], [106.7101, 10.8013, 'PRG'],
  [106.6985, 10.7655, 'VNM'], [106.66, 10.752, 'PRG'], [106.7205, 10.772, 'PRG'], [106.675, 10.835, 'VNM'], [106.64, 10.78, 'PRG'], [106.735, 10.835, 'PRG'], [106.69, 10.755, 'VNM'],
];
export const G9: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="g9" keys={drift({ ...C.city, zoom: 11000 }, { ...C.city, zoom: 13200 }, 2.5)} date="30.04.1975"
    map={<>
      <SaigonLabels />
      <SaigonSites only={['daiPhatThanh', 'tanSonNhat', 'cauSaiGon', 'hangXanh']} />
      {CITY_FLAGS.map(([lon, lat, kind], i) => <PopFlag key={i} lon={lon} lat={lat} kind={kind} t={t} at={4 + i * 5} id={`g9f${i}`} size={64} />)}
    </>}
    over={() => <Tag t={t} at={4} x={1480} y={150} text="TRÊN KHẮP THÀNH PHỐ" fill="#B5573B" size={48} />} />
);

/** Popping wrapper for screen-space pieces (origin = pole foot). */
const Pop: React.FC<{ t: number; at: number; x: number; y: number; children: React.ReactNode }> = ({ t, at, x, y, children }) => {
  const k = backOut(prog(t, at, at + 12));
  return t < at ? null : <g transform={`translate(${x},${y}) scale(${k})`}>{children}</g>;
};

/** G10 "ở cửa sổ, trên nóc nhà, trên xe." three shophouses (flags in windows, then roofs) and a truck with a flag. */
export const G10: React.FC<ShotProps> = ({ t }) => {
  const bs = [{ x: 60, h: 560, c: '#D9C79A' }, { x: 680, h: 540, c: '#C9D3B0' }, { x: 1300, h: 520, c: '#E3C6A8' }], gy = 860, tx = -300 + t * 14;
  return (
    <g>
      <Stage id="g10" tone="noon" />
      {bs.map((b, i) => <Shophouse key={i} id={`g10b${i}`} x={b.x} y={gy} w={560} h={b.h} color={b.c} lit />)}
      <rect y={gy} width={1920} height={220} fill="#4B4A4E" /><rect y={gy} width={1920} height={10} fill="#8A8A8A" stroke={INK} strokeWidth={3} />
      {bs.flatMap((b, i) => [1, 3, 5].map((w, j) => { const [wx, wy] = windowXY(b.x, gy, 560, b.h, w); return (
        <Pop key={`${i}${j}`} t={t} at={i * 4 + j * 3} x={wx} y={wy + b.h * 0.1}><PoleFlag id={`g10w${i}${j}`} x={0} y={0} kind={(i + j) % 3 === 1 ? 'VNM' : 'PRG'} w={56} h={40} t={t} /></Pop>
      ); }))}
      {bs.map((b, i) => <Pop key={`r${i}`} t={t} at={24 + i * 5} x={b.x + 280} y={gy - b.h - 50}><PoleFlag id={`g10r${i}`} x={0} y={0} kind={i === 1 ? 'VNM' : 'PRG'} w={96} h={120} t={t} /></Pop>)}
      <TruckSide x={tx} y={gy + 120} s={1.05} />
      <Pop t={t} at={49} x={tx + 88} y={gy + 120 - 112}><PoleFlag id="g10t" x={0} y={0} kind="PRG" w={84} h={80} t={t} /></Pop>
      <Cap t={t} at={0} x={960} y={110} text="CỬA SỔ" size={62} color="#FFE08A" anchor="middle" o={prog(t, 0, 4) * (1 - prog(t, 22, 26))} />
      <Cap t={t} at={22} x={960} y={110} text="NÓC NHÀ" size={62} color="#FFE08A" o={1 - prog(t, 48, 52)} />
      <Cap t={t} at={49} x={960} y={110} text="TRÊN XE" size={62} color="#FFE08A" />
    </g>
  );
};

/** Delta provinces (lon, lat): hand-placed town centres, approximate. */
const DELTA: [number, number][] = [
  [106.41, 10.53], [106.35, 10.36], [106.38, 10.24], [105.97, 10.25], [106.34, 9.93], [105.76, 10.3], [105.79, 10.04],
  [105.44, 10.38], [105.11, 10.7], [105.08, 10.01], [105.97, 9.6], [105.72, 9.29], [105.15, 9.18],
];

/** G11 "Ở các tỉnh miền Tây, quân đội Sài Gòn cũng lần lượt buông súng." the delta: RVN flags turn into PRG one after another. */
export const G11: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="g11" osm={false} keys={drift({ lon: 105.85, lat: 9.85, zoom: 600 }, { lon: 105.85, lat: 9.85, zoom: 660 }, 3.4)}
    map={DELTA.map(([lon, lat], i) => <PopFlag key={i} lon={lon} lat={lat} kind="PRG" before="RVN" t={t} at={22 + i * 5} id={`g11f${i}`} size={66} />)}
    over={() => <Tag t={t} at={4} x={1450} y={150} text="CÁC TỈNH MIỀN TÂY" fill="#2F3E58" size={50} />} />
);

/** Towns of the South for the 02.05 overview (lon, lat). */
const SOUTH: [number, number][] = [
  [107.59, 16.46], [108.2, 16.05], [109.22, 13.78], [108.0, 13.98], [108.04, 12.67], [109.19, 12.24], [108.44, 11.94], [108.1, 10.93],
  [106.7, 10.78], [106.35, 10.36], [105.79, 10.04], [105.08, 10.01], [105.15, 9.18],
];

/** G12 "Đến ngày hai tháng Năm, toàn bộ miền Nam đã hoàn toàn giải phóng." the whole South, date rolls to 02.05.1975. */
export const G12: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="g12" osm={false} keys={[{ t: 0, lon: 106.2, lat: 10.4, zoom: 520, ease: 'out' }, { t: 3.2, lon: 107.4, lat: 12.8, zoom: 120, ease: 'inout' }]}
    dates={[{ t: 0, label: '30.04.1975' }, { t: 1.1, label: '02.05.1975' }]}
    map={SOUTH.map(([lon, lat], i) => <PopFlag key={i} lon={lon} lat={lat} kind="PRG" t={t} at={6 + i * 4} id={`g12f${i}`} size={58} />)}
    over={() => <>
      <Cap t={t} at={34} x={1480} y={700} text="TOÀN BỘ MIỀN NAM" size={60} />
      <Cap t={t} at={50} x={1480} y={780} text="HOÀN TOÀN GIẢI PHÓNG" size={60} color="#FFE08A" />
    </>} />
);
