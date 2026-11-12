import React from 'react';
import { FONT } from '../engine/fonts';
import { SAIGON_ATTRIBUTION, SAIGON_SITES } from './geo-sai-gon-sites';
import { mix, ramp, useGeo } from './map-context';
import { City, RiverLabel, SeaLabel } from './map-labels';

// Labels for the Sài Gòn map level (children of <GeoMap>, all fade with the camera zoom, px/deg):
//   <SaigonLabels regions? rivers? roads? />   region names (SÀI GÒN, BIÊN HÒA, CỦ CHI, CẦN GIỜ...), river names, road tags (QL1 Xa lộ Biên Hòa, QL4, QL13, QL22, QL15), BIỂN ĐÔNG
//   <SaigonSites lights? only? size? />        all SAIGON_SITES as <City/>, each with its own minZoom so labels never pile up
//   SAIGON_ATTRIBUTION                          credit string for <SourceLine/> (OSM, ODbL)
export { SAIGON_ATTRIBUTION };
const txt = { fontFamily: FONT.title, fontWeight: 800, paintOrder: 'stroke', strokeLinejoin: 'round' } as const;

/** minZoom (px/deg) at which each site label appears: region view ~1600, city view ~12500, palace plan ~40000. */
export const SAIGON_SITE_MIN_ZOOM: Record<string, number> = {
  dinhDocLap: 2400, bienHoa: 700, thuDauMot: 900, vungTau: 900, xuanLoc: 1000, cuChi: 1200, benLuc: 1200, canGio: 1200, trangBom: 1300, hauNghia: 1300, nhonTrach: 1300,
  longThanh: 1500, benCat: 2400, nhaBe: 1500, bienHoaAirbase: 2500, longBinh: 2500, dongDu: 3000, tanSonNhat: 3000, cauSaiGon: 4500, cauRachChiec: 4500, hangXanh: 5500,
  boTongThamMuu: 6000, bietKhuThuDo: 6500, tongNhaCanhSat: 6500, boQuocPhong: 9000, daiPhatThanh: 9000, daiSuMy: 11000,
};
export const SaigonSites: React.FC<{ lights?: number; only?: string[]; size?: number; maxZoom?: number }> = ({ lights = 1, only, size = 26, maxZoom = 120000 }) => (
  <g>
    {Object.entries(SAIGON_SITES).filter(([k]) => !only || only.includes(k)).map(([k, s]) => (
      <City key={k} {...s} lights={lights} minZoom={SAIGON_SITE_MIN_ZOOM[k] ?? 1500} maxZoom={maxZoom} size={k === 'dinhDocLap' ? size + 4 : size} />
    ))}
  </g>
);

const REGIONS: { text: string; lon: number; lat: number; size: number; in0: number; in1: number; out0: number; out1: number }[] = [
  { text: 'SÀI GÒN - GIA ĐỊNH', lon: 106.8, lat: 10.745, size: 38, in0: 700, in1: 1000, out0: 2600, out1: 3600 },
  { text: 'BIÊN HÒA', lon: 106.9, lat: 10.995, size: 30, in0: 1000, in1: 1400, out0: 2800, out1: 3800 },
  { text: 'BÌNH DƯƠNG', lon: 106.74, lat: 11.07, size: 30, in0: 1000, in1: 1400, out0: 2800, out1: 3800 },
  { text: 'HẬU NGHĨA', lon: 106.37, lat: 10.84, size: 28, in0: 1000, in1: 1400, out0: 2800, out1: 3800 },
  { text: 'LONG AN', lon: 106.5, lat: 10.55, size: 30, in0: 1000, in1: 1400, out0: 2800, out1: 3800 },
  { text: 'LONG KHÁNH', lon: 107.12, lat: 10.88, size: 28, in0: 1000, in1: 1400, out0: 2800, out1: 3800 },
  { text: 'RỪNG SÁC · CẦN GIỜ', lon: 106.88, lat: 10.55, size: 28, in0: 800, in1: 1200, out0: 4000, out1: 6000 },
];
const RIVERS: { river: string; text: string; near: [number, number]; minZoom: number; maxZoom: number }[] = [
  { river: 'SaiGon', text: 'Sông Sài Gòn', near: [106.7, 10.92], minZoom: 1500, maxZoom: 20000 },
  { river: 'DongNai', text: 'Sông Đồng Nai', near: [106.95, 10.99], minZoom: 1500, maxZoom: 20000 },
  { river: 'NhaBe', text: 'Sông Nhà Bè', near: [106.775, 10.64], minZoom: 1800, maxZoom: 20000 },
  { river: 'SoaiRap', text: 'Sông Soài Rạp', near: [106.82, 10.42], minZoom: 1200, maxZoom: 20000 },
  { river: 'LongTau', text: 'Sông Lòng Tàu', near: [106.87, 10.5], minZoom: 1500, maxZoom: 20000 },
  { river: 'VamCoDong', text: 'Sông Vàm Cỏ Đông', near: [106.4, 10.68], minZoom: 1500, maxZoom: 20000 },
  { river: 'Be', text: 'Sông Bé', near: [106.73, 11.12], minZoom: 1700, maxZoom: 20000 },
];
// road tags: [text, lon, lat, minZoom]. QL1 east of Sài Gòn = Xa lộ Biên Hòa (Xa lộ Hà Nội); QL4 = today's QL1 south-west; QL15 = today's QL51.
const ROADS: [string, number, number, number][] = [
  ['QL1 · Xa lộ Biên Hòa', 106.8147, 10.8816, 1400], ['QL1', 107.06, 10.945, 1100], ['QL4', 106.573, 10.667, 1600], ['QL13', 106.625, 11.075, 1400], ['QL22', 106.458, 10.985, 1400], ['QL15', 106.965, 10.755, 1600], ['QL20', 107.1759, 11.0135, 1500],
];

export const SaigonLabels: React.FC<{ regions?: boolean; rivers?: boolean; roads?: boolean }> = ({ regions = true, rivers = true, roads = true }) => {
  const { project, camera, night, screen: SCREEN } = useGeo();
  const z = camera.zoom;
  return (
    <g>
      {regions && REGIONS.map((r) => {
        const o = ramp(z, r.in0, r.in1) * (1 - ramp(z, r.out0, r.out1)), [x, y] = project(r.lon, r.lat);
        if (o < 0.01 || x < -300 || x > SCREEN.W + 300 || y < -100 || y > SCREEN.H + 100) return null;
        return <text key={r.text} x={x} y={y} textAnchor="middle" fontSize={r.size} fill={mix('#F4E6C8', '#8E8A7C', night)} stroke="#2A1710" strokeWidth={r.size * 0.2} letterSpacing={r.size * 0.12} opacity={0.8 * o} {...txt}>{r.text}</text>;
      })}
      {rivers && RIVERS.map((r) => <RiverLabel key={r.river} level="saigon" {...r} />)}
      {roads && ROADS.map(([text, lon, lat, minZoom]) => {
        const o = ramp(z, minZoom * 0.8, minZoom) * (1 - ramp(z, 9000, 13000)), [x, y] = project(lon, lat);
        if (o < 0.01 || x < -200 || x > SCREEN.W + 200 || y < -60 || y > SCREEN.H + 60) return null;
        const w = text.length * 13.5 + 24;
        return <g key={text} opacity={0.95 * o}><rect x={x - w / 2} y={y - 17} width={w} height={32} rx={9} fill="#F6E7B6" stroke="#3A1E16" strokeWidth={3} /><text x={x} y={y + 7} textAnchor="middle" fontSize={22} fill="#3A1E16" fontFamily={FONT.ui} fontWeight={700}>{text}</text></g>;
      })}
      <SeaLabel lon={107.16} lat={10.27} text="BIỂN ĐÔNG" size={34} spacing={12} minZoom={900} maxZoom={5000} />
    </g>
  );
};
