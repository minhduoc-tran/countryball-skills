import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, cameraAt, hasSaigonLevel } from '../../countryball/geo-camera';
import { backOut, clamp } from '../../countryball/fx-math';
import { GeoMap } from '../../countryball/map-geo-map';
import { DateChip, DateKey } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { SourceLine } from '../../countryball/hud-chips';
import { SAIGON_ATTRIBUTION } from '../../countryball/sai-gon-map-labels';

// Chapter B shared helpers (3.1975 Tây Nguyên -> 4.1975 Xuân Lộc / Phan Rang): time ramps, outlined text, pop-in, card backdrop,
// the 1975 map wrapper (neutral land #B9A88A, same as every chapter), camera drift and the map HUD (date chip, minimap, OSM credit).
// Pure functions of the shot clock (frames `t` or seconds `s`, as noted).

export const sec = (t: number) => t / 30;
export const ramp = (s: number, a: number, b: number) => clamp((s - a) / Math.max(1e-6, b - a));

export const LAND = { VNM: '#B9A88A' };
export const GOLD = '#E2B95A';
export const RED = '#E0483C';
export const YEL = '#F2C230';

/** Places (lon, lat) used in chapter B: checked 2026-11-11 (Buôn Ma Thuột 12.67/108.04, Pleiku 13.98/108.0, Huế 16.46/107.59, Đà Nẵng 16.05/108.2,
 *  Phan Rang 11.57/108.99, Xuân Lộc 10.94/107.23, Tuy Hòa 13.09/109.3). Phú Bổn (Cheo Reo) and Củng Sơn are approximate (±5 km). */
export const P: Record<string, [number, number]> = {
  bmt: [108.04, 12.67], pleiku: [108.0, 13.98], cheoReo: [108.45, 13.4], cungSon: [108.98, 13.05], tuyHoa: [109.3, 13.09],
  hue: [107.59, 16.46], danang: [108.2, 16.05], quyNhon: [109.22, 13.78], nhaTrang: [109.19, 12.24], phanRang: [108.99, 11.57],
  xuanLoc: [107.2345, 10.9395], saigon: [106.7, 10.78], hanoi: [105.85, 21.03],
};
/** Route 7 (Pleiku -> Phú Bổn -> Củng Sơn -> Tuy Hòa), hand-laid. */
export const ROUTE7: [number, number][] = [[108.0, 13.98], [108.15, 13.72], [108.3, 13.52], [108.45, 13.4], [108.62, 13.28], [108.8, 13.16], [108.98, 13.05], [109.15, 13.1], [109.3, 13.09]];
/** Coast road (QL1) Đà Nẵng -> Sài Gòn, hand-laid along the coast. */
export const COAST: [number, number][] = [[108.2, 16.05], [108.8, 15.12], [109.1, 14.4], [109.22, 13.78], [109.3, 13.09], [109.19, 12.24], [108.99, 11.57], [108.1, 10.93], [107.5, 10.9], [106.95, 10.9], [106.7, 10.78]];

export const CAM = {
  tayNguyen: { lon: 108.6, lat: 13.1, zoom: 340 },
  bmt: { lon: 108.2, lat: 12.75, zoom: 1100 },
  route7: { lon: 108.65, lat: 13.5, zoom: 800 },
  coast: { lon: 108.6, lat: 14.6, zoom: 420 },
  vietnam: { lon: 107.6, lat: 15.8, zoom: 62 },
  phanRang: { lon: 108.8, lat: 11.9, zoom: 1100 },
  coastLong: { lon: 108.2, lat: 13.45, zoom: 200 },
} satisfies Record<string, Camera>;

export const drift = (s: number, a: Camera, b: Camera, dur: number): Camera => cameraAt([{ t: 0, ...a }, { t: Math.max(0.1, dur), ...b }], s);

export const Txt: React.FC<{
  x: number; y: number; text: string; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number;
  font?: string; stroke?: string; o?: number; ls?: number; rot?: number;
}> = ({ x, y, text, size = 56, color = '#F4F4F4', anchor = 'middle', weight = 800, font = FONT.title, stroke = '#0A121C', o = 1, ls = 0, rot = 0 }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={font} fontWeight={weight} fontSize={size} fill={color} stroke={stroke}
    strokeWidth={stroke === 'none' ? 0 : Math.max(5, size * 0.16)} paintOrder="stroke" strokeLinejoin="round" opacity={o} letterSpacing={ls}
    transform={rot ? `rotate(${rot},${x},${y})` : undefined}>{text}</text>
);

/** Pop-in with back-ease about (x, y) from second `at`; hidden before. */
export const Pop: React.FC<{ s: number; at: number; x: number; y: number; dur?: number; children: React.ReactNode }> = ({ s, at, x, y, dur = 0.3, children }) => {
  const k = backOut(ramp(s, at, at + dur));
  if (s < at) return null;
  return <g transform={`translate(${x},${y}) scale(${k}) translate(${-x},${-y})`} opacity={clamp(k * 2)}>{children}</g>;
};

/** Card background: navy gradient + slowly drifting grid (card shots are never frozen). */
export const Backdrop: React.FC<{ s: number; id: string; top?: string; bottom?: string }> = ({ s, id, top = '#13263B', bottom = '#07111D' }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-bd`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient>
      <pattern id={`${id}-grid`} width={80} height={80} patternUnits="userSpaceOnUse" patternTransform={`translate(${(s * 14) % 80},${(s * 8) % 80})`}>
        <path d="M80,0 L0,0 L0,80" fill="none" stroke="#7FA3C8" strokeWidth={1.4} opacity={0.12} />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${id}-bd)`} />
    <rect width={1920} height={1080} fill={`url(#${id}-grid)`} />
  </g>
);

export const Dim: React.FC<{ o?: number; color?: string }> = ({ o = 0.5, color = '#050B15' }) => <rect width={1920} height={1080} fill={color} opacity={o} />;
export const Vignette: React.FC<{ id: string; o?: number }> = ({ id, o = 0.5 }) => (
  <g><defs><radialGradient id={`${id}-vg`} cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={o} /></radialGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id}-vg)`} /></g>
);

/** The 1975 map: neutral land, no overlays; children draw in map space (use useGeo / chb-map-bits). */
export const CMap: React.FC<{ cam: Camera; id: string; night?: number; children?: React.ReactNode }> = ({ cam, id, night = 0, children }) => (
  <GeoMap camera={cam} id={id} colors={LAND} night={night}>{children}</GeoMap>
);

/** Map HUD: date chip (key list in seconds), minimap bottom-right, OSM credit whenever the Sài Gòn (OSM) level is drawn. */
export const MapHud: React.FC<{ s: number; cam: Camera; dates?: DateKey[]; mini?: boolean }> = ({ s, cam, dates, mini = true }) => (
  <>
    {dates && <DateChip dates={dates} t={s} id="hud-date" />}
    {mini && <MiniMap camera={cam} />}
    {hasSaigonLevel(cam) && <SourceLine text={`${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`} t={s} />}
  </>
);


/** Xuân Lộc / Sài Gòn framings (OSM level): the whole east approach, and the town close up. */
export const XL = {
  east: { lon: 106.88, lat: 10.88, zoom: 1700 },
  eastWide: { lon: 106.9, lat: 10.9, zoom: 1250 },
  town: { lon: 107.2345, lat: 10.9395, zoom: 6000 },
} satisfies Record<string, Camera>;
/** QL1 from Xuân Lộc to Sài Gòn (Xa lộ Biên Hòa), hand-laid. */
export const QL1: [number, number][] = [[107.2345, 10.9395], [107.12, 10.95], [107.0, 10.955], [106.9, 10.95], [106.83, 10.92], [106.78, 10.86], [106.72, 10.8], [106.7, 10.78]];
