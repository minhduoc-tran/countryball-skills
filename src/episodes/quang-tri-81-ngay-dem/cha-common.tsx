import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, CameraKey, cameraAt, hasQuangTriLevel } from '../../countryball/geo-camera';
import { DateChip, DateKey } from '../../countryball/hud-date-chip';
import { NightChip, SourceLine } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { GeoMap } from '../../countryball/map-geo-map';
import { OSM_ATTRIBUTION } from '../../countryball/quang-tri-map-labels';
import { FLAGS } from '../../countryball/ball-flags';
import { prog } from '../../countryball/fx-math';

// Chapter A (Quảng Trị 81 ngày đêm) shared helpers. Time: `t` = shot frames (30 fps), `sec(t)` = seconds.
// 1972 maps never paint the whole country red: neutral warm land LAND; control = translucent overlays / flags.

export const LAND = '#B9A88A';
export const SIDE = { vnm: '#E0483C', rvn: '#F2C230', usa: '#4F7FC4' } as const;
export const sec = (t: number) => t / 30;
export const frames = (s: number) => Math.round(s * 30);
/** Province fills for the OSM level: yellowish = VNCH side, reddish = Quân Giải phóng / north. */
export const PROV = { rvn: '#CDB66E', north: '#C98672', lib: '#D26A52', neutral: '#BFAE8E' };

type QtMapProps = {
  t: number; id: string; keys: CameraKey[]; night?: number; highlight?: string[]; provinces?: boolean;
  provinceColors?: Record<string, string>; parallel?: number | false; labels?: boolean; rivers?: boolean;
  date?: string | DateKey[]; dayLabel?: string; minimap?: boolean; dim?: number; colors?: Record<string, string>;
  children?: React.ReactNode;
  /** screen-space layer above the map, below the HUD; gets the camera of this frame */
  over?: (cam: Camera) => React.ReactNode;
  /** map layers that must sit under the overlay but need the camera (e.g. citadel patch) */
  below?: (cam: Camera) => React.ReactNode;
};

/** GeoMap + 1972 colours + HUD (date chip, day counter, minimap) + OSM credit whenever the Quảng Trị level is on. */
export const QtMap: React.FC<QtMapProps> = ({
  t, id, keys, night = 0, highlight = [], provinces = true, provinceColors, parallel = false, labels = true, rivers = true,
  date, dayLabel, minimap = true, dim = 0, colors, children, over, below,
}) => {
  const s = sec(t), cam = cameraAt(keys, s);
  const osm = hasQuangTriLevel(cam);
  return (
    <g>
      <GeoMap id={id} camera={cam} night={night} highlight={highlight} provinces={provinces} provinceColors={provinceColors}
        parallel={parallel} labels={labels} rivers={rivers} colors={{ VNM: LAND, ...colors }}>{children}</GeoMap>
      {below?.(cam)}
      {dim > 0 && <rect width={1920} height={1080} fill="#050A12" opacity={dim} />}
      {over?.(cam)}
      {date && (typeof date === 'string' ? <DateChip label={date} t={s} id={`${id}-date`} /> : <DateChip dates={date} t={s} id={`${id}-date`} />)}
      {dayLabel && <NightChip label={dayLabel} t={s} />}
      {minimap && <MiniMap camera={cam} id={`${id}-mini`} />}
      {osm && <SourceLine text={`${OSM_ATTRIBUTION}; Natural Earth (public domain)`} t={s} />}
    </g>
  );
};

/** Small flag on a pole (flag = VNM | RVN | USA), planted at (x, y) = pole foot; k 0..1 = how far it has been raised. */
export const FlagPole: React.FC<{ x: number; y: number; flag: 'VNM' | 'RVN' | 'USA'; h?: number; k?: number; t?: number; id: string }> = ({ x, y, flag, h = 120, k = 1, t = 0, id }) => {
  if (k <= 0.01) return null;
  const w = h * 0.66, fh = h * 0.44, sway = Math.sin(t / 5) * 0.05;
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={0} y1={0} x2={0} y2={-h * k - 6} stroke="#2A2118" strokeWidth={h * 0.045} strokeLinecap="round" />
      <g transform={`translate(0,${-h * k}) scale(${w / 2.4},${fh / 2.4}) translate(1.2,1.2) skewY(${sway * 40})`}>{FLAGS[flag]()}</g>
      <rect x={0} y={-h * k} width={w} height={fh} fill="none" stroke="#151515" strokeWidth={4} />
    </g>
  );
};

/** Wide dark vignette used to calm busy night scenes behind text. */
export const Vignette: React.FC<{ o?: number }> = ({ o = 0.55 }) => (
  <g pointerEvents="none">
    <defs><radialGradient id="cha-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={o} /></radialGradient></defs>
    <rect width={1920} height={1080} fill="url(#cha-vig)" />
  </g>
);

/** Big outlined number/phrase card that slams in (scale overshoot). `a` = frame it starts. */
export const Slam: React.FC<{ t: number; a: number; x: number; y: number; size: number; fill?: string; children: React.ReactNode; rot?: number; stroke?: string }> = ({ t, a, x, y, size, fill = '#FFE600', children, rot = -2, stroke = '#120C1E' }) => {
  const u = prog(t, a, a + 10);
  if (u <= 0) return null;
  const k = 1 + 0.5 * (1 - u) * (1 - u) * (1 - u);
  return (
    <text transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill}
      stroke={stroke} strokeWidth={size * 0.12} paintOrder="stroke" strokeLinejoin="round" opacity={u}>{children}</text>
  );
};

/** Dark rounded plate with gold rim, text lines centred; slides up and fades in at frame `a`. */
export const Plate: React.FC<{ t: number; a: number; x: number; y: number; w: number; lines: { text: string; size: number; fill?: string; weight?: number }[]; accent?: string }> = ({ t, a, x, y, w, lines, accent = '#E2B95A' }) => {
  const u = prog(t, a, a + 10);
  if (u <= 0) return null;
  const gap = 12, h = lines.reduce((s, l) => s + l.size * 1.2 + gap, gap + 10);
  let cy = -h / 2 + gap + 8;
  return (
    <g transform={`translate(${x},${y + (1 - u) * 40})`} opacity={u}>
      <rect x={-w / 2 + 8} y={-h / 2 + 12} width={w} height={h} rx={22} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill="#141C2A" fillOpacity={0.94} stroke={accent} strokeWidth={5} />
      {lines.map((l, i) => {
        cy += l.size * 1.2; const yy = cy - l.size * 0.22; cy += gap;
        return <text key={i} y={yy} textAnchor="middle" fontFamily={FONT.title} fontWeight={l.weight ?? 800} fontSize={l.size} fill={l.fill ?? '#F4F4F4'}>{l.text}</text>;
      })}
    </g>
  );
};

/** OSM credit line (required wherever the Quảng Trị level or CitadelPlan is visible). */
export const Osm: React.FC<{ t: number }> = ({ t }) => <SourceLine text={`${OSM_ATTRIBUTION}; Natural Earth (public domain)`} t={sec(t)} />;
