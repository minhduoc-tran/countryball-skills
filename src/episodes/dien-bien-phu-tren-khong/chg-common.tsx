import React from 'react';
import { FONT } from '../../engine/fonts';
import { CameraKey, cameraAt } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { clamp, easeOut, backOut } from '../../countryball/fx-math';
import { Ball } from '../../countryball/countryball';
import { BallMotion } from '../../countryball/ball-motion';

// Chapter G helpers: seconds clock, dimmed map backdrop (so card scenes still sit on the map), headline text with a
// dark outline (readable on any map), a candle, books, and the two ball presets (VNM / USA) used across the chapter.

/** shot frames -> seconds. */
export const sec = (t: number) => t / 30;
/** 0..1 ramp between two times (s). */
export const ramp = (s: number, a: number, b: number) => clamp((s - a) / Math.max(1e-6, b - a));
/** pop-in scale 0..~1.1..1 starting at time `a` (s). */
export const pop = (s: number, a: number, dur = 0.35) => backOut((s - a) / dur);
export const fade = (s: number, a: number, dur = 0.3) => easeOut((s - a) / dur);

export const VNM_RED = '#C8573F';
export const USA_BLUE = '#6F8299';
export const GOLD = '#E2B95A';
export const INK = '#0A121C';

/** Headline text: heavy title face, thick dark outline. */
export const Txt: React.FC<{
  x: number; y: number; children: React.ReactNode; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; o?: number;
  weight?: number; mono?: boolean; hand?: boolean; sw?: number; dy?: number; ls?: number;
}> = ({ x, y, children, size = 56, fill = '#F4F4F4', anchor = 'middle', o = 1, weight = 800, mono, hand, sw, dy = 0, ls }) => (
  <text x={x} y={y + dy} textAnchor={anchor} fontFamily={mono ? FONT.ui : hand ? FONT.hand : FONT.title} fontWeight={weight} fontSize={size} fill={fill}
    stroke={INK} strokeWidth={sw ?? size * 0.16} paintOrder="stroke" strokeLinejoin="round" opacity={o} letterSpacing={ls}>{children}</text>
);

/** Rounded dark panel. */
export const Panel: React.FC<{ x: number; y: number; w: number; h: number; accent?: string; o?: number; r?: number }> = ({ x, y, w, h, accent, o = 0.9, r = 26 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={r} fill="#15181F" fillOpacity={o} stroke="#2D3644" strokeWidth={3} />
    {accent && <rect x={x} y={y} width={w} height={14} rx={7} fill={accent} />}
  </g>
);

/** Dimmed map backdrop with a slow drifting camera. `keys` seconds are shot-relative. */
export const DimMap: React.FC<{
  s: number; keys: CameraKey[]; dim?: number; night?: number; highlight?: string[]; id: string; cities?: boolean; parallel?: number | false;
  children?: React.ReactNode;
}> = ({ s, keys, dim = 0.55, night = 0, highlight, id, cities = true, children }) => {
  const camera = cameraAt(keys, s);
  return (
    <g>
      <GeoMap camera={camera} night={night} highlight={highlight} id={id}>
        {cities && <><City {...CITIES.hanoi} minZoom={40} /><City {...CITIES.paris} minZoom={20} maxZoom={400} /><City {...CITIES.washington} maxZoom={30} /></>}
      </GeoMap>
      <rect width={1920} height={1080} fill="#07101B" opacity={dim} />
      {children}
    </g>
  );
};

/** Slow drift between two camera poses over `dur` seconds. */
export const drift = (lon: number, lat: number, zoom: number, dLon = 0, dLat = 0, zk = 1.06, dur = 8): CameraKey[] => [
  { t: 0, lon, lat, zoom, ease: 'linear' }, { t: dur, lon: lon + dLon, lat: lat + dLat, zoom: zoom * zk, ease: 'linear' },
];

/** A VNM ball with the pith helmet look (hat passed in by the caller to keep imports local). */
export const BallAt: React.FC<{
  id: string; x: number; y: number; r: number; flag: 'VNM' | 'USA' | 'FRA'; eyes?: React.ComponentProps<typeof Ball>['eyes'];
  hat?: React.ReactNode; look?: number; motion?: BallMotion; t?: number; tear?: boolean; tilt?: number; shadow?: boolean;
}> = (p) => <Ball {...p} />;

/** Candle: wax stick, flame that flickers (pure function of s), warm glow. */
export const Candle: React.FC<{ x: number; y: number; s: number; scale?: number; seed?: number }> = ({ x, y, s, scale = 1, seed = 0 }) => {
  const fl = 1 + 0.12 * Math.sin(s * 11 + seed) + 0.07 * Math.sin(s * 23 + seed * 2);
  const sway = Math.sin(s * 5 + seed) * 2.5;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <circle cy={-96} r={120 * fl} fill={`url(#chg-cg-${seed})`} />
      <defs><radialGradient id={`chg-cg-${seed}`}><stop offset="0" stopColor="#FFB04A" stopOpacity={0.45} /><stop offset="1" stopColor="#FFB04A" stopOpacity={0} /></radialGradient></defs>
      <rect x={-20} y={-80} width={40} height={110} rx={5} fill="#EFE6CF" stroke="#111" strokeWidth={4} />
      <rect x={-20} y={-80} width={40} height={14} rx={5} fill="#D8CCAE" />
      <line x1={0} y1={-80} x2={0} y2={-92} stroke="#222" strokeWidth={3} />
      <path d={`M${sway},${-92 - 40 * fl} Q${14 + sway},${-110 + 4} 0,${-88} Q${-14},${-108} ${sway},${-92 - 40 * fl} Z`} fill="#FFC857" stroke="#E8821E" strokeWidth={2.5} />
      <ellipse cx={sway * 0.4} cy={-100} rx={4.5} ry={9 * fl} fill="#FFF3C4" />
    </g>
  );
};

/** One book standing upright. */
export const Book: React.FC<{ x: number; y: number; w: number; h: number; color: string; tilt?: number }> = ({ x, y, w, h, color, tilt = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${tilt})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={4} fill={color} stroke="#111" strokeWidth={4} />
    <rect x={-w / 2 + 6} y={-h + 16} width={w - 12} height={10} fill="#F2E8C8" opacity={0.85} />
    <rect x={-w / 2 + 6} y={-h + 34} width={w - 12} height={5} fill="#F2E8C8" opacity={0.6} />
  </g>
);

/** Small pictogram of a person (head + shoulders), flat colour: used for crowds of prisoners being handed over. */
export const Person: React.FC<{ x: number; y: number; s?: number; color: string; bob?: number }> = ({ x, y, s = 1, color, bob = 0 }) => (
  <g transform={`translate(${x},${y + bob}) scale(${s})`}>
    <circle cy={-46} r={13} fill={color} stroke="#111" strokeWidth={3.5} />
    <path d="M-17,0 Q-17,-30 0,-30 Q17,-30 17,0 Z" fill={color} stroke="#111" strokeWidth={3.5} strokeLinejoin="round" />
  </g>
);
