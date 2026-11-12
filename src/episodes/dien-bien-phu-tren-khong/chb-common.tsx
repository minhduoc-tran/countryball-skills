import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, project } from '../../countryball/geo-camera';
import { clamp, backOut, easeOut, Pt } from '../../countryball/fx-math';
import { FlightPath, pathAtDist, SampledPath, samplePath } from '../../countryball/fx-flight-path';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';

// Chapter B shared helpers: time ramps, text with outline, pop-in wrapper, card backdrops, target reticle, B-52 cell
// slot positions, and the standard map HUD. Everything is a pure function of the shot clock (seconds or frames as noted).

/** frames -> seconds */
export const sec = (t: number) => t / 30;
/** 0..1 ramp of s between a and b (seconds) */
export const ramp = (s: number, a: number, b: number) => clamp((s - a) / Math.max(1e-6, b - a));
/** lon/lat -> screen for a camera */
export const proj = (cam: Camera) => (lon: number, lat: number): Pt => project(cam, lon, lat);

export const PHOTO_CREDIT = {
  usaf: 'Ảnh: U.S. Air Force / Public domain',
  dod: 'Ảnh: U.S. Department of Defense / Public domain',
};

/** Text with a dark outline so it reads on any background. */
export const Txt: React.FC<{
  x: number; y: number; text: string; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number;
  font?: string; stroke?: string; o?: number; ls?: number; rot?: number;
}> = ({ x, y, text, size = 56, color = '#F4F4F4', anchor = 'middle', weight = 800, font = FONT.title, stroke = '#0A121C', o = 1, ls = 0, rot = 0 }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={font} fontWeight={weight} fontSize={size} fill={color} stroke={stroke}
    strokeWidth={Math.max(5, size * 0.16)} paintOrder="stroke" strokeLinejoin="round" opacity={o} letterSpacing={ls}
    transform={rot ? `rotate(${rot},${x},${y})` : undefined}>{text}</text>
);

/** Pop-in with back-ease about (x, y) starting at second `at`; hidden before. */
export const Pop: React.FC<{ s: number; at: number; x: number; y: number; dur?: number; children: React.ReactNode }> = ({ s, at, x, y, dur = 0.3, children }) => {
  const k = backOut(ramp(s, at, at + dur));
  if (s < at) return null;
  return <g transform={`translate(${x},${y}) scale(${k}) translate(${-x},${-y})`} opacity={clamp(k * 2)}>{children}</g>;
};

/** Plain card background: navy gradient with a slowly drifting fine grid (so even card shots are never frozen). */
export const Backdrop: React.FC<{ s: number; id: string; top?: string; bottom?: string; grid?: boolean }> = ({ s, id, top = '#13263B', bottom = '#07111D', grid = true }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-bd`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient>
      <pattern id={`${id}-grid`} width={80} height={80} patternUnits="userSpaceOnUse" patternTransform={`translate(${(s * 14) % 80},${(s * 8) % 80})`}>
        <path d="M80,0 L0,0 L0,80" fill="none" stroke="#7FA3C8" strokeWidth={1.4} opacity={0.12} />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${id}-bd)`} />
    {grid && <rect width={1920} height={1080} fill={`url(#${id}-grid)`} />}
  </g>
);

/** Dark veil over a map for talk scenes. */
export const Dim: React.FC<{ o?: number }> = ({ o = 0.55 }) => <rect width={1920} height={1080} fill="#050B15" opacity={o} />;

/** Standard map HUD: date chip (top-left) and minimap (bottom-right). */
export const MapHud: React.FC<{ s: number; cam: Camera; date?: string }> = ({ s, cam, date }) => (
  <>
    {date && <DateChip label={date} t={s} />}
    <MiniMap camera={cam} />
  </>
);

/** Target reticle: ring, rotating ticks, crosshair; pulses. */
export const Reticle: React.FC<{ x: number; y: number; r?: number; s: number; color?: string }> = ({ x, y, r = 60, s, color = '#FF5A5F' }) => {
  const pulse = 1 + 0.08 * Math.sin(s * 9);
  return (
    <g transform={`translate(${x},${y}) scale(${pulse})`} opacity={0.95}>
      <circle r={r} fill="none" stroke={color} strokeWidth={5} />
      <circle r={r * 1.35} fill="none" stroke={color} strokeWidth={3} strokeDasharray="14 14" transform={`rotate(${s * 60})`} opacity={0.8} />
      <path d={`M${-r * 1.6},0 L${-r * 0.55},0 M${r * 0.55},0 L${r * 1.6},0 M0,${-r * 1.6} L0,${-r * 0.55} M0,${r * 0.55} L0,${r * 1.6}`} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <circle r={5} fill={color} />
    </g>
  );
};

/** Positions of the three B-52s of a cell (lead + two wingmen stepped back, as BCell draws them) at path distance d. */
export const cellSlots = (sp: SampledPath, d: number, size: number, spread?: number, step?: number): { x: number; y: number; heading: number }[] => {
  const sx = spread ?? size * 1.15, st = step ?? size * 0.95;
  const lead = pathAtDist(sp, d);
  return [-1, 0, 1].map((k) => {
    const p = k === 0 ? lead : pathAtDist(sp, Math.max(0, d - st));
    const nx = -Math.sin((p.heading * Math.PI) / 180), ny = Math.cos((p.heading * Math.PI) / 180);
    return { x: p.x + nx * k * sx, y: p.y + ny * k * sx, heading: p.heading };
  });
};

/** Small round number badge. */
export const Badge: React.FC<{ x: number; y: number; n: string | number; r?: number; fill?: string; color?: string }> = ({ x, y, n, r = 26, fill = '#E2B95A', color = '#14161A' }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={fill} stroke="#0A121C" strokeWidth={5} />
    <text x={x} y={y + r * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={r * 1.05} fill={color}>{n}</text>
  </g>
);

/** Slow drifting 3-key camera helper: linear drift from a to b over `dur` seconds (always moving, never frozen). */
export const drift = (s: number, a: Camera, b: Camera, dur: number): Camera => {
  const k = easeOut(clamp(s / dur) * 0.6) / easeOut(0.6);
  return { lon: a.lon + (b.lon - a.lon) * k, lat: a.lat + (b.lat - a.lat) * k, zoom: a.zoom * Math.pow(b.zoom / a.zoom, k), lat0: a.lat0 };
};

/** B-52 cell with a CONSTANT V (BCell's wingmen converge on the lead by the end of the path, this one keeps the spacing).
 *  Frames: t, t0, t1 (lead enters at t0 and reaches the path end at t1). Returns nothing but draws 3 planes + trails. */
export const Cell: React.FC<{ id: string; t: number; points: Pt[]; t0: number; t1: number; size?: number; spread?: number; step?: number; trailLen?: number; kind?: 'b52' }> = ({
  id, t, points, t0, t1, size = 90, spread, step, trailLen = 380,
}) => {
  const sp = samplePath(points), sx = spread ?? size * 1.15, st = step ?? size * 0.95;
  const t1w = t0 + ((t1 - t0) * (sp.total + st)) / sp.total;
  return (
    <g>
      <FlightPath id={`${id}-l`} points={points} sp={sp} t={t} t0={t0} t1={t1} size={size} trailLen={trailLen} />
      <FlightPath id={`${id}-a`} points={points} sp={sp} t={t} t0={t0} t1={t1w} size={size} lateral={-sx} back={st} trailLen={trailLen * 0.7} />
      <FlightPath id={`${id}-b`} points={points} sp={sp} t={t} t0={t0} t1={t1w} size={size} lateral={sx} back={st} trailLen={trailLen * 0.7} />
    </g>
  );
};
/** Lead distance (px along the path) of a Cell at frame t. */
export const cellLead = (points: Pt[], t: number, t0: number, t1: number): number => {
  const sp = samplePath(points);
  return clamp((t - t0) / (t1 - t0)) * sp.total;
};
