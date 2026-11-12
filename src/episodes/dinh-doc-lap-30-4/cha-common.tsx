import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, CameraKey, cameraAt } from '../../countryball/geo-camera';
import { DateChip, DateKey } from '../../countryball/hud-date-chip';
import { SourceLine } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { GeoMap } from '../../countryball/map-geo-map';
import { SAIGON_ATTRIBUTION } from '../../countryball/sai-gon-map-labels';
import { prog } from '../../countryball/fx-math';

// Chapter A (Dinh Độc Lập 30/4/1975) shared helpers. Time: `t` = shot frames (30 fps), `sec(t)` = seconds.
// 1973-1975 maps never paint the whole country red: neutral warm land LAND; control = flags / arrows / overlays.

export const LAND = '#B9A88A';
export const SIDE = { vnm: '#E0483C', rvn: '#F2C230', usa: '#4F7FC4' } as const;
export const sec = (t: number) => t / 30;

type SgMapProps = {
  t: number; id: string; keys: CameraKey[]; night?: number; highlight?: string[]; provinces?: boolean;
  date?: string | DateKey[]; minimap?: boolean; dim?: number; colors?: Record<string, string>; labels?: boolean;
  /** show the OSM credit (default: when the camera is zoomed into the Sài Gòn level, zoom >= 1000) */
  credit?: boolean;
  children?: React.ReactNode;
  /** screen-space layer above the map, below the HUD; gets the camera of this frame */
  over?: (cam: Camera) => React.ReactNode;
};

/** GeoMap + neutral 1975 land + HUD (date chip, minimap) + OSM credit when the Sài Gòn level / palace plan is on screen. */
export const SgMap: React.FC<SgMapProps> = ({ t, id, keys, night = 0, highlight = [], provinces = false, date, minimap = true, dim = 0, colors, labels = true, credit, children, over }) => {
  const s = sec(t), cam = cameraAt(keys, s);
  const osm = credit ?? cam.zoom >= 1000;
  return (
    <g>
      <GeoMap id={id} camera={cam} night={night} highlight={highlight} provinces={provinces} labels={labels} colors={{ VNM: LAND, ...colors }}>{children}</GeoMap>
      {dim > 0 && <rect width={1920} height={1080} fill="#050A12" opacity={dim} />}
      {over?.(cam)}
      {date && (typeof date === 'string' ? <DateChip label={date} t={s} id={`${id}-date`} /> : <DateChip dates={date} t={s} id={`${id}-date`} />)}
      {minimap && <MiniMap camera={cam} id={`${id}-mini`} />}
      {osm && <SourceLine text={`${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`} t={s} />}
    </g>
  );
};

/** Soft dark vignette to calm a busy picture behind text. */
export const Veil: React.FC<{ id: string; o?: number }> = ({ id, o = 0.5 }) => (
  <g pointerEvents="none">
    <defs><radialGradient id={`${id}-vig`} cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={o} /></radialGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id}-vig)`} />
  </g>
);

/** Big outlined phrase that slams in (scale overshoot) at frame `a`. */
export const Slam: React.FC<{ t: number; a: number; x: number; y: number; size: number; fill?: string; children: React.ReactNode; rot?: number; stroke?: string }> = ({ t, a, x, y, size, fill = '#FFE600', children, rot = -2, stroke = '#120C1E' }) => {
  const u = prog(t, a, a + 10);
  if (u <= 0) return null;
  const k = 1 + 0.5 * (1 - u) * (1 - u) * (1 - u);
  return (
    <text transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill}
      stroke={stroke} strokeWidth={size * 0.12} paintOrder="stroke" strokeLinejoin="round" opacity={u}>{children}</text>
  );
};

/** Dark rounded plate with a gold rim, text lines centred; slides up and fades in at frame `a`. */
export const Plate: React.FC<{ t: number; a: number; x: number; y: number; w: number; lines: { text: string; size: number; fill?: string }[]; accent?: string }> = ({ t, a, x, y, w, lines, accent = '#E2B95A' }) => {
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
        return <text key={i} y={yy} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={l.size} fill={l.fill ?? '#F4F4F4'}>{l.text}</text>;
      })}
    </g>
  );
};

/** Slow push-in / pan wrapper for flat scenes: scale z0 -> z1 around (cx, cy) over `len` frames. */
export const Drift: React.FC<{ t: number; len: number; z0?: number; z1?: number; cx?: number; cy?: number; children: React.ReactNode }> = ({ t, len, z0 = 1, z1 = 1.06, cx = 960, cy = 540, children }) => {
  const z = z0 + (z1 - z0) * prog(t, 0, len);
  return <g transform={`translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>;
};
