import React from 'react';
import { FONT } from '../../engine';
import { Camera, CameraKey, cameraAt } from '../../countryball/geo-camera';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { GeoMap } from '../../countryball/map-geo-map';
import { useGeo } from '../../countryball/map-context';
import { clamp, easeOut, prog } from '../../countryball/fx-math';

// Chapter C helpers: dark "card" backgrounds, outlined captions, tag chips, a map scene wrapper (camera keys + date
// chip + minimap) and a pin that places any drawing at a lon/lat inside <GeoMap>. Everything is a pure function of t
// (frames, 30 fps) except the HUD pieces, which get explicit seconds.

export const INK = '#111';
export const RED = '#C9343A';
export const GOLD = '#FFCD00';
export { clamp, easeOut, prog };

/** Dark navy card background with a faint grid; `tone` shifts the colour (default navy, 'green' for radar rooms). */
export const Dark: React.FC<{ id: string; tone?: 'navy' | 'green' | 'warm' | 'night' }> = ({ id, tone = 'navy' }) => {
  const c = { navy: ['#16263A', '#0A1422'], green: ['#10241A', '#050E09'], warm: ['#2B2118', '#120D09'], night: ['#0C1424', '#03060C'] }[tone];
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.5" cy="0.45" r="0.85"><stop offset="0" stopColor={c[0]} /><stop offset="1" stopColor={c[1]} /></radialGradient>
        <pattern id={`${id}-grid`} width={60} height={60} patternUnits="userSpaceOnUse"><path d="M60,0 L0,0 L0,60" fill="none" stroke="#FFFFFF" strokeOpacity={0.05} strokeWidth={2} /></pattern>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${id}-bg)`} />
      <rect width={1920} height={1080} fill={`url(#${id}-grid)`} />
    </g>
  );
};

/** Big outlined caption (title font). `at` = frame it pops in; anchor middle by default. */
export const Cap: React.FC<{ t: number; x: number; y: number; text: string; size?: number; color?: string; at?: number; anchor?: 'start' | 'middle' | 'end'; font?: 'title' | 'ui' | 'hand' }> = ({
  t, x, y, text, size = 64, color = '#FFFFFF', at = 0, anchor = 'middle', font = 'title',
}) => {
  const k = easeOut(clamp((t - at) / 7));
  if (k <= 0.01) return null;
  return (
    <text x={x} y={y + (1 - k) * 24} textAnchor={anchor} fontFamily={FONT[font]} fontWeight={800} fontSize={size} fill={color} stroke="#0A121C" strokeWidth={size * 0.16}
      paintOrder="stroke" strokeLinejoin="round" opacity={k}>{text}</text>
  );
};

/** Rounded tag chip centred on (x, y). */
export const Tag: React.FC<{ t?: number; at?: number; x: number; y: number; text: string; fill?: string; color?: string; size?: number; sub?: string }> = ({
  t = 99999, at = 0, x, y, text, fill = RED, color = '#FFF', size = 38, sub,
}) => {
  const k = easeOut(clamp((t - at) / 8));
  if (k <= 0.01) return null;
  const w = text.length * size * 0.64 + size * 1.2, h = size * 1.7 + (sub ? size * 0.7 : 0);
  return (
    <g transform={`translate(${x},${y}) scale(${0.85 + 0.15 * k})`} opacity={k}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill={fill} stroke={INK} strokeWidth={5} />
      <text y={sub ? -size * 0.1 : size * 0.35} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color}>{text}</text>
      {sub && <text y={size * 0.85} textAnchor="middle" fontFamily={FONT.ui} fontSize={size * 0.5} fill={color} opacity={0.9}>{sub}</text>}
    </g>
  );
};

/** Step badge for "how a launch works": numbered circle + label top-left of the picture. */
export const StepBadge: React.FC<{ t: number; n: number; text: string; at?: number }> = ({ t, n, text, at = 0 }) => {
  const k = easeOut(clamp((t - at) / 8));
  const w = text.length * 25 + 130;
  return (
    <g transform={`translate(${60 - (1 - k) * 400},900)`} opacity={k}>
      <rect width={w} height={92} rx={46} fill="#101820" fillOpacity={0.92} stroke="#FFD43B" strokeWidth={4} />
      <circle cx={46} cy={46} r={32} fill="#FFD43B" stroke={INK} strokeWidth={4} />
      <text x={46} y={61} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={INK}>{n}</text>
      <text x={96} y={60} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFF">{text}</text>
    </g>
  );
};

/** Places children at a lon/lat inside <GeoMap>. */
export const Pin: React.FC<{ lon: number; lat: number; children: (x: number, y: number) => React.ReactNode }> = ({ lon, lat, children }) => {
  const { project } = useGeo();
  const [x, y] = project(lon, lat);
  return <g>{children(x, y)}</g>;
};

export const ramp = (t: number, a: number, b: number) => prog(t, a, b);

type MapSceneProps = {
  t: number; keys: CameraKey[]; id: string; date?: string; dates?: { t: number; label: string }[]; night?: number; parallel?: number | false;
  highlight?: string[]; provinces?: boolean; mini?: boolean; labels?: boolean; rivers?: boolean | string[]; provinceColors?: Record<string, string>;
  /** drawn inside the map (use <Pin/> or useGeo) */ map?: React.ReactNode;
  /** drawn on screen above the map; receives the camera */ over?: (cam: Camera) => React.ReactNode;
};
/** Standard map scene: slow keyframed camera (keys in SECONDS), DateChip and MiniMap. */
export const MapScene: React.FC<MapSceneProps> = ({
  t, keys, id, date, dates, night = 0, parallel = false, highlight = ['VNM'], provinces = true, mini = true, labels = true, rivers = true, provinceColors, map, over,
}) => {
  const s = t / 30, cam = cameraAt(keys, s);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1D2E" />
      <GeoMap camera={cam} night={night} highlight={highlight} provinces={provinces} parallel={parallel} id={id} labels={labels} rivers={rivers} provinceColors={provinceColors}>{map}</GeoMap>
      {over?.(cam)}
      {(date || dates) && <DateChip label={date} dates={dates} t={s} id={`${id}-date`} />}
      {mini && <MiniMap camera={cam} id={`${id}-mini`} />}
    </g>
  );
};

/** Slow drift keys: from -> to over `dur` seconds (linear). */
export const drift = (a: [number, number, number], b: [number, number, number], dur: number): CameraKey[] => [
  { t: 0, lon: a[0], lat: a[1], zoom: a[2], ease: 'linear' }, { t: dur, lon: b[0], lat: b[1], zoom: b[2], ease: 'linear' },
];

/** Round shelter ("hầm trú ẩn cá nhân") on the pavement: pit, concrete lid that can slide over. lid 0 = open, 1 = closed. */
export const Shelter: React.FC<{ x: number; y: number; s?: number; lid?: number }> = ({ x, y, s = 1, lid = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse rx={62} ry={16} fill="#0B0B0D" stroke={INK} strokeWidth={5} />
    <ellipse rx={50} ry={11} fill="#000" />
    <g transform={`translate(${(1 - lid) * 92},${-(1 - lid) * 6})`}>
      <ellipse rx={66} ry={19} cy={-5} fill="#9AA0A3" stroke={INK} strokeWidth={5} />
      <ellipse rx={50} ry={12} cy={-9} fill="#B7BCBF" />
      <rect x={-8} y={-17} width={16} height={7} rx={3} fill="#5A5F63" stroke={INK} strokeWidth={3} />
    </g>
  </g>
);
