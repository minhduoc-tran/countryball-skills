import React from 'react';
import { Camera, CameraKey, cameraAt, project } from '../../countryball/geo-camera';
import { DateChip, DateKey } from '../../countryball/hud-date-chip';
import { NightChip } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { appear } from '../../countryball/hud-anim';
import { FONT } from '../../engine/fonts';

// Chapter F shared map scene: GeoMap + keyframed camera + HUD (date chip, night chip, minimap), and the small text
// helpers used by every shot. Shots pass `t` in FRAMES (30 fps); everything here converts to seconds for the kit.
// `children` is a render function receiving P (lon/lat -> screen px for THIS frame's camera), cam and s (seconds),
// so FX that live on the map stay geo-locked while the camera drifts.

export type PF = (lon: number, lat: number) => [number, number];
export type MapCtx = { P: PF; cam: Camera; s: number };

type Props = {
  t: number; keys: CameraKey[]; id: string;
  night?: number; veil?: number; highlight?: string[]; parallel?: number | false; provinces?: boolean;
  date?: string | DateKey[]; nightLabel?: string; lights?: number; hanoi?: boolean; mini?: boolean;
  children?: (c: MapCtx) => React.ReactNode;
  /** drawn on top of everything (cards, banners) */
  top?: (c: MapCtx) => React.ReactNode;
};

export const FMap: React.FC<Props> = ({
  t, keys, id, night = 0, veil = 0, highlight = [], parallel = false, provinces = true, date, nightLabel, lights = 1, hanoi = true, mini = true, children, top,
}) => {
  const s = t / 30, cam = cameraAt(keys, s);
  const P: PF = (lon, lat) => project(cam, lon, lat);
  const c: MapCtx = { P, cam, s };
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1D2E" />
        <GeoMap id={id} camera={cam} night={night} highlight={highlight} provinces={provinces} parallel={parallel}
          provinceColors={{ 'Hà Nội': '#D9694F', 'Hải Phòng': '#B84A36' }}>
          {hanoi && <City {...CITIES.hanoi} lights={lights} showLabel={cam.zoom < 900} />}
        </GeoMap>
        {veil > 0 && <rect width={1920} height={1080} fill="#050B15" opacity={veil} />}
        {children?.(c)}
        {date && (typeof date === 'string' ? <DateChip label={date} t={s} id={`${id}-date`} /> : <DateChip dates={date} t={s} id={`${id}-date`} />)}
        {nightLabel && <NightChip label={nightLabel} from={0} t={s} />}
        {mini && <MiniMap camera={cam} />}
        {top?.(c)}
    </g>
  );
};

/** Full-screen radial gradient background (shots that are not on a map). */
export const Bg: React.FC<{ id: string; inner: string; outer: string; cx?: number; cy?: number }> = ({ id, inner, outer, cx = 0.5, cy = 0.5 }) => (
  <g>
    <defs><radialGradient id={`${id}-bg`} cx={cx} cy={cy} r={0.8}><stop offset="0" stopColor={inner} /><stop offset="1" stopColor={outer} /></radialGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id}-bg)`} />
  </g>
);

/** Outlined text (readable on any background). */
export const OutText: React.FC<{
  x: number; y: number; text: string; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; font?: 'title' | 'hand' | 'ui';
  opacity?: number; stroke?: string; weight?: number; spacing?: number;
}> = ({ x, y, text, size = 64, color = '#FFFFFF', anchor = 'middle', font = 'title', opacity = 1, stroke = '#0A121C', weight = 800, spacing = 0 }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT[font]} fontWeight={weight} fontSize={size} fill={color} stroke={stroke}
    strokeWidth={Math.max(5, size * 0.12)} paintOrder="stroke" strokeLinejoin="round" opacity={opacity} letterSpacing={spacing}>{text}</text>
);

/** Rounded dark pill with a coloured rim and one line of text; slides up in [from, to] seconds. */
export const Banner: React.FC<{ s: number; from: number; to?: number; text: string; sub?: string; y?: number; accent?: string; size?: number }> = ({
  s, from, to, text, sub, y = 900, accent = '#E2B95A', size = 60,
}) => {
  const ap = appear(s, from, to, 0.5, 0.35);
  if (!ap.visible) return null;
  const w = Math.max(text.length * size * 0.6, (sub?.length ?? 0) * 26) + 120, h = sub ? size + 92 : size + 52;
  return (
    <g transform={`translate(960,${y + (1 - ap.enter) * 120})`} opacity={ap.a}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.6} fill="#10151D" fillOpacity={0.9} stroke={accent} strokeWidth={5} />
      <text x={0} y={sub ? -h / 2 + size * 0.95 + 8 : size * 0.35} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#FFFFFF">{text}</text>
      {sub && <text x={0} y={h / 2 - 24} textAnchor="middle" fontFamily={FONT.hand} fontSize={34} fill={accent}>{sub}</text>}
    </g>
  );
};

/** A named point on the map (dot + label). `o` = opacity. */
export const Place: React.FC<{ x: number; y: number; name: string; size?: number; o?: number; side?: 'r' | 'l' | 'b'; color?: string }> = ({
  x, y, name, size = 30, o = 1, side = 'r', color = '#FFD98A',
}) => {
  const dx = side === 'r' ? 20 : side === 'l' ? -20 : 0, dy = side === 'b' ? size + 16 : size * 0.35;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={9} fill={color} stroke="#15181F" strokeWidth={4} />
      <OutText x={x + dx} y={y + dy} text={name} size={size} anchor={side === 'r' ? 'start' : side === 'l' ? 'end' : 'middle'} font="title" weight={700} />
    </g>
  );
};

export const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
