import React from 'react';
import { Camera, CameraKey, cameraAt, project } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City, HANOI_SITES } from '../../countryball/map-labels';
import { DateChip } from '../../countryball/hud-date-chip';
import { NightChip } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { AirRaidPulse } from '../../countryball/map-night-overlay';
import { FONT } from '../../engine/fonts';

// Chapter E helpers: a Hà Nội map scene (camera keys in SECONDS, HUD, lon/lat -> screen projector for overlays) and
// plain text / panel pieces. All pure functions of t (seconds unless the name says frames).

export { prog, clamp, hash, lerp, easeOut, easeInOut, backOut } from '../../countryball/fx-math';
export type Pt = [number, number];

export type MapCtx = { cam: Camera; P: (lon: number, lat: number) => Pt; s: number };

export const HanoiMap: React.FC<{
  id: string; s: number; keys: CameraKey[]; night?: number; date?: string; nightLabel?: string; lights?: number; pulse?: number;
  veil?: number; highlight?: string[]; hud?: boolean; cities?: React.ReactNode; parallel?: number | false;
  children?: (c: MapCtx) => React.ReactNode;
}> = ({ id, s, keys, night = 0.85, date, nightLabel, lights = 1, pulse = 0, veil = 0, highlight = ['VNM'], hud = true, cities, children }) => {
  const cam = cameraAt(keys, s);
  const P = (lon: number, lat: number): Pt => project(cam, lon, lat);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1D2E" />
      <GeoMap id={id} camera={cam} night={night} highlight={highlight} provinces provinceColors={{ 'Hà Nội': '#D9694F', 'Hải Phòng': '#B84A36' }}>
        {cities ?? (
          <>
            <City {...CITIES.hanoi} lights={lights} showLabel={cam.zoom < 700} />
            <City {...CITIES.haiphong} lights={lights} minZoom={90} />
            {Object.values(HANOI_SITES).map((x) => <City key={x.name} {...x} lights={lights} minZoom={900} size={22} />)}
          </>
        )}
      </GeoMap>
      {pulse > 0 && <AirRaidPulse t={s} level={pulse} />}
      {veil > 0 && <rect width={1920} height={1080} fill="#04060B" opacity={veil} />}
      {children?.({ cam, P, s })}
      {hud && date && <DateChip label={date} t={s} id={`${id}-d`} />}
      {hud && nightLabel && <NightChip label={nightLabel} t={s} />}
      {hud && <MiniMap camera={cam} />}
    </g>
  );
};

/** Text with a dark outline (readable over any map). */
export const Txt: React.FC<{
  x: number; y: number; children: string; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; o?: number; weight?: number; ui?: boolean; ls?: number;
}> = ({ x, y, children, size = 48, fill = '#FFF', anchor = 'middle', o = 1, weight = 800, ui = false, ls = 0 }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fontFamily={ui ? FONT.ui : FONT.title} fill={fill} opacity={o} letterSpacing={ls}
    stroke="#06080D" strokeWidth={size * 0.12} paintOrder="stroke" strokeLinejoin="round">{children}</text>
);

/** Dark rounded panel with a coloured edge; (x, y) = centre. */
export const Plaque: React.FC<{ x: number; y: number; w: number; h: number; accent?: string; o?: number; rot?: number; fill?: string; children?: React.ReactNode }> = ({
  x, y, w, h, accent = '#C9343A', o = 1, rot = 0, fill = '#15181F', children,
}) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o}>
    <rect x={-w / 2} y={-h / 2 + 8} width={w} height={h} rx={22} fill="#000" opacity={0.35} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill={fill} fillOpacity={0.94} stroke={accent} strokeWidth={5} />
    {children}
  </g>
);

/** Solid dark backdrop with a soft centre light for quiet cards. */
export const QuietBackdrop: React.FC<{ id: string; tint?: string }> = ({ id, tint = '#2A2118' }) => (
  <g>
    <defs><radialGradient id={`${id}-qb`} cx="50%" cy="45%" r="75%"><stop offset="0" stopColor={tint} /><stop offset="1" stopColor="#05070B" /></radialGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id}-qb)`} />
  </g>
);

export const pts = (P: (lon: number, lat: number) => Pt, c: [number, number][]): Pt[] => c.map(([lo, la]) => P(lo, la));

export const PHOTO_CREDIT = {
  grau: 'Ảnh: Lester W. Grau (U.S. Army FMSO) / Public domain',
  arjun: 'Ảnh: Arjunullas / CC BY-SA 4.0',
};
