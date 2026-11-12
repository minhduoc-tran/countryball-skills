import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, CameraKey, cameraAt, project } from '../../countryball/geo-camera';
import { DateChip, DateKey } from '../../countryball/hud-date-chip';
import { NightChip } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, CityDef, City } from '../../countryball/map-labels';
import { AirRaidPulse } from '../../countryball/map-night-overlay';
import { backOut, clamp, Pt, prog } from '../../countryball/fx-math';

// Chapter D shared helpers: a map stage (GeoMap + HUD in one call), lon/lat -> screen projection for FX that sit on
// the map, and a few small text pieces. Every time argument is a frame count `t` (shot clock, 30 fps); the HUD kit
// wants seconds, so MapStage converts once.

export const THAI_NGUYEN: CityDef = { lon: 105.84, lat: 21.59, name: 'Thái Nguyên', anchor: 'r', glow: 0.7 };
export const PHOTO_CREDIT_GRAU = 'Ảnh: Lester W. Grau (U.S. Army FMSO) / Public domain';
export const RAID_MAP_PHOTO = 'dien-bien-phu-tren-khong/img/map-raid-19-dec.jpg';

export type LonLat = [number, number];
/** Projector for FX drawn in screen px that must stay glued to the geography under a moving camera. */
export const projector = (cam: Camera) => (p: LonLat): Pt => project(cam, p[0], p[1]);
export const ll = (cam: Camera, lon: number, lat: number): Pt => project(cam, lon, lat);

type CityId = 'hanoi' | 'haiphong' | 'thainguyen' | 'guam' | 'vinh' | 'utapao' | 'saigon';
const cityDef = (c: CityId): CityDef => (c === 'thainguyen' ? THAI_NGUYEN : CITIES[c]);

export type StageProps = {
  id: string; t: number; keys: CameraKey[];
  night?: number; lights?: number; pulse?: number;
  date?: string | DateKey[]; nightChip?: string; nightSince?: number;
  highlight?: string[]; provinces?: boolean; rivers?: boolean; parallel?: number | false; labels?: boolean;
  cities?: CityId[]; cityMin?: number; cityLabels?: boolean;
  mini?: boolean;
  /** FX drawn above the map (screen px) and below the HUD; receives the camera of this frame. */
  children?: (cam: Camera) => React.ReactNode;
  /** extra HUD (counter, lower third...), drawn last */
  hud?: React.ReactNode;
};

export const MapStage: React.FC<StageProps> = ({
  id, t, keys, night = 0.8, lights = 1, pulse = 0, date, nightChip, nightSince, highlight = ['VNM'], provinces = true, rivers = true,
  parallel = false, labels = true, cities = ['hanoi'], cityMin = 60, cityLabels = true, mini = true, children, hud,
}) => {
  const s = t / 30, cam = cameraAt(keys, s);
  return (
    <g>
      <GeoMap id={id} camera={cam} night={night} highlight={highlight} provinces={provinces} rivers={rivers} parallel={parallel} labels={labels}
        provinceColors={{ 'Hà Nội': '#D9694F', 'Hải Phòng': '#B84A36' }}>
        {cities.map((c, i) => <City key={c} {...cityDef(c)} lights={lights} minZoom={i === 0 ? 0 : cityMin} showLabel={cityLabels} />)}
      </GeoMap>
      {children?.(cam)}
      {pulse > 0 && <AirRaidPulse t={s} level={pulse} id={`${id}-raid`} />}
      {date && (typeof date === 'string' ? <DateChip label={date} t={s} id={`${id}-date`} /> : <DateChip dates={date} t={s} id={`${id}-date`} />)}
      {nightChip && <NightChip label={nightChip} t={s} since={nightSince} />}
      {mini && <MiniMap camera={cam} id={`${id}-mini`} />}
      {hud}
    </g>
  );
};

/** Slow constant camera drift: from (lon, lat, zoom) to the same plus deltas over `secs` seconds. */
export const drift = (lon: number, lat: number, zoom: number, dLon: number, dLat: number, dZoom: number, secs: number): CameraKey[] => [
  { t: 0, lon, lat, zoom, ease: 'linear' },
  { t: secs, lon: lon + dLon, lat: lat + dLat, zoom: zoom + dZoom, ease: 'linear' },
];

/** Pill chip with a pop-in at frame `at`: text centred at (x, y). */
export const Chip: React.FC<{ x: number; y: number; text: string; t: number; at?: number; color?: string; fg?: string; size?: number; until?: number }> = ({
  x, y, text, t, at = 0, color = '#15181F', fg = '#F4F4F4', size = 40, until,
}) => {
  const k = backOut(clamp((t - at) / 9)) * (until === undefined ? 1 : 1 - prog(t, until, until + 6));
  if (k <= 0.01) return null;
  const w = text.length * size * 0.64 + size * 1.4, h = size * 1.55;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} fillOpacity={0.92} stroke="#E2B95A" strokeWidth={4} />
      <text y={size * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fg} letterSpacing={1}>{text}</text>
    </g>
  );
};

/** Big outlined headline text (pops in at frame `at`). */
export const Headline: React.FC<{ x: number; y: number; text: string; t: number; at?: number; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; until?: number }> = ({
  x, y, text, t, at = 0, size = 90, color = '#FFD166', anchor = 'middle', until,
}) => {
  const k = backOut(clamp((t - at) / 10)) * (until === undefined ? 1 : 1 - prog(t, until, until + 8));
  if (k <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <text textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#0A0F18" strokeWidth={size * 0.12} paintOrder="stroke" strokeLinejoin="round" letterSpacing={2}>{text}</text>
    </g>
  );
};

/** Dark vignette-less dim over whatever is under it (for "talk" scenes over a dimmed map). */
export const Dim: React.FC<{ o?: number }> = ({ o = 0.62 }) => <rect width={1920} height={1080} fill="#060A12" opacity={o} />;

/** A dimmed, slowly drifting map used behind cards and talking balls. */
export const DimMap: React.FC<{ id: string; t: number; lon?: number; lat?: number; zoom?: number; dim?: number; children?: React.ReactNode }> = ({
  id, t, lon = 105.6, lat = 20.2, zoom = 150, dim = 0.66, children,
}) => (
  <g>
    <GeoMap id={id} camera={cameraAt(drift(lon, lat, zoom, 0.12, 0.05, zoom * 0.06, 6), t / 30)} night={0.7} provinces={false} labels={false} />
    <Dim o={dim} />
    {children}
  </g>
);

/** Constant-speed straight lane (px/frame) as a 2-point path starting at `a` heading `deg` (0 = east), long enough for `frames`. */
export const laneEnd = (a: Pt, headingDeg: number, speed: number, frames: number): Pt => [
  a[0] + Math.cos((headingDeg * Math.PI) / 180) * speed * frames, a[1] + Math.sin((headingDeg * Math.PI) / 180) * speed * frames,
];
