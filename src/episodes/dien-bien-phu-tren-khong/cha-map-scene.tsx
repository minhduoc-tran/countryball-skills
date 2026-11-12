import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, CameraKey, cameraAt, project } from '../../countryball/geo-camera';
import { DateChip, DateKey } from '../../countryball/hud-date-chip';
import { NightChip } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { GeoMap } from '../../countryball/map-geo-map';
import { useGeo } from '../../countryball/map-context';
import { appear } from '../../countryball/hud-anim';
import { hash, prog } from '../../countryball/fx-math';
import { samplePath, FlightPath, BCell } from '../../countryball/fx-flight-path';
import { AircraftKind } from '../../countryball/aircraft-kinds';

// Chapter A helpers: a map shot wrapper (camera keys in seconds, HUD, optional "south of the 17th parallel" tint),
// lon/lat placement, geo-anchored flights, and the plain cards (name card with silhouette, quote card, jam cloud).
// Every time argument is explicit: `t` = shot frames (30 fps), `s` = seconds.

export const NAVY = '#0E1D2E';
export const sec = (t: number) => t / 30;
export const ramp = (t: number, a: number, b: number) => prog(t, a, b);
export type LL = [number, number];

type MapProps = {
  t: number; keys: CameraKey[]; id: string;
  night?: number; highlight?: string[]; provinces?: boolean; parallel?: number | false; labels?: boolean;
  date?: string | DateKey[]; nightLabel?: string; nightSince?: number; minimap?: boolean; hud?: boolean;
  /** tint South Vietnam (below `lat`) like a second zone; k 0..1 sweeps in from the west */
  south?: { lat: number; k: number; color?: string };
  /** 0..1 black veil over the map, below the `over` layer */
  dim?: number;
  children?: React.ReactNode;
  /** screen-space layer drawn above the map and below the HUD, gets the camera */
  over?: (cam: Camera) => React.ReactNode;
};

export const MapShot: React.FC<MapProps> = ({ t, keys, id, night = 0, highlight = ['VNM'], provinces = true, parallel = false, labels = true, date, nightLabel, nightSince, minimap = true, hud = true, south, dim = 0, children, over }) => {
  const s = sec(t), cam = cameraAt(keys, s);
  const yLine = south ? project(cam, 100, south.lat)[1] : 0;
  return (
    <g>
      <GeoMap id={id} camera={cam} night={night} highlight={highlight} provinces={provinces} parallel={parallel} labels={labels}>{children}</GeoMap>
      {south && south.k > 0.001 && (
        <g>
          <clipPath id={`${id}-south`}><rect x={0} y={yLine} width={1920 * south.k} height={1080 - yLine + 10} /></clipPath>
          <g clipPath={`url(#${id}-south)`}>
            <GeoMap id={`${id}s`} camera={cam} night={night} highlight={[]} provinces={provinces} labels={false} colors={{ VNM: south.color ?? '#8C7B5E' }}>{children}</GeoMap>
          </g>
        </g>
      )}
      {dim > 0 && <rect width={1920} height={1080} fill="#050A12" opacity={dim} />}
      {over?.(cam)}
      {hud && date && (typeof date === 'string' ? <DateChip label={date} t={s} id={`${id}-date`} /> : <DateChip dates={date} t={s} id={`${id}-date`} />)}
      {hud && nightLabel && <NightChip label={nightLabel} since={nightSince} t={s} />}
      {hud && minimap && <MiniMap camera={cam} id={`${id}-mini`} />}
    </g>
  );
};

/** Put children at a lon/lat (inside <GeoMap>), px offsets stay constant at any zoom. */
export const At: React.FC<{ lon: number; lat: number; dx?: number; dy?: number; children: React.ReactNode }> = ({ lon, lat, dx = 0, dy = 0, children }) => {
  const [x, y] = useGeo().project(lon, lat);
  return <g transform={`translate(${x + dx},${y + dy})`}>{children}</g>;
};

/** lon/lat polyline -> current screen px (inside <GeoMap>). */
export const useGeoPts = (pts: LL[]) => {
  const { project: p } = useGeo();
  return pts.map(([lo, la]) => p(lo, la));
};

/** Plane(s) flying a lon/lat route (route follows the moving camera). cell = 3 B-52 in a V. */
export const GeoFlight: React.FC<{ id: string; t: number; t0: number; t1: number; route: LL[]; kind?: AircraftKind; size?: number; cell?: boolean; showRoute?: boolean; trailLen?: number }> = ({ id, t, t0, t1, route, kind = 'b52', size = 80, cell = false, showRoute = false, trailLen }) => {
  const pts = useGeoPts(route);
  return cell
    ? <BCell id={id} t={t} t0={t0} t1={t1} points={pts} size={size} trailLen={trailLen} route={showRoute} />
    : <FlightPath id={id} t={t} t0={t0} t1={t1} points={pts} kind={kind} size={size} trailLen={trailLen} route={showRoute} />;
};
export { samplePath };

/** Text with thick outline (genre look). */
export const Out: React.FC<{ x: number; y: number; size: number; fill?: string; stroke?: string; sw?: number; anchor?: 'start' | 'middle' | 'end'; rot?: number; scale?: number; opacity?: number; children: React.ReactNode; weight?: number; spacing?: number }> = ({
  x, y, size, fill = '#FFFFFF', stroke = '#0B0F16', sw, anchor = 'middle', rot = 0, scale = 1, opacity = 1, children, weight = 800, spacing = 0,
}) => (
  <text transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`} textAnchor={anchor} fontFamily={FONT.title} fontWeight={weight} fontSize={size} fill={fill}
    stroke={stroke} strokeWidth={sw ?? size * 0.16} paintOrder="stroke" strokeLinejoin="round" opacity={opacity} letterSpacing={spacing}>{children}</text>
);

/** Pill label (used for small tags like "THEO PHÍA MỸ"). */
export const Tag: React.FC<{ x: number; y: number; text: string; color?: string; size?: number; opacity?: number }> = ({ x, y, text, color = '#E2B95A', size = 30, opacity = 1 }) => {
  const w = text.length * size * 0.62 + 44;
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.6} rx={size * 0.8} fill="#15181F" fillOpacity={0.9} stroke={color} strokeWidth={3.5} />
      <text textAnchor="middle" y={size * 0.12} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#F4F4F4">{text}</text>
    </g>
  );
};

/** Plain card for a real person (no photo available): respectful head-and-shoulders silhouette, name, role. s = seconds. */
export const NameCard: React.FC<{ x: number; y: number; name: string; sub?: string; s: number; from: number; to?: number; w?: number; rot?: number }> = ({ x, y, name, sub, s, from, to, w = 440, rot = 0 }) => {
  const ap = appear(s, from, to, 0.6, 0.4);
  if (!ap.visible) return null;
  const h = w * 1.08, slide = (1 - ap.enter) * 90;
  return (
    <g transform={`translate(${x},${y + slide}) rotate(${rot})`} opacity={ap.a}>
      <rect x={-w / 2 + 10} y={-h / 2 + 16} width={w} height={h} rx={22} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill="#1B2433" stroke="#E2B95A" strokeWidth={5} />
      <clipPath id={`nc-${Math.round(x)}-${Math.round(y)}`}><rect x={-w / 2 + 18} y={-h / 2 + 18} width={w - 36} height={h * 0.62} rx={12} /></clipPath>
      <g clipPath={`url(#nc-${Math.round(x)}-${Math.round(y)})`}>
        <rect x={-w / 2 + 18} y={-h / 2 + 18} width={w - 36} height={h * 0.62} fill="#2A3548" />
        <circle cx={0} cy={-h / 2 + h * 0.27} r={w * 0.14} fill="#445168" />
        <path d={`M${-w * 0.34},${-h / 2 + h * 0.66} Q${-w * 0.32},${-h / 2 + h * 0.43} 0,${-h / 2 + h * 0.43} Q${w * 0.32},${-h / 2 + h * 0.43} ${w * 0.34},${-h / 2 + h * 0.66} Z`} fill="#445168" />
      </g>
      <text y={h / 2 - (sub ? 96 : 66)} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(46, (w - 50) / (name.length * 0.62))} fill="#F4F4F4">{name}</text>
      {sub && <text y={h / 2 - 48} textAnchor="middle" fontFamily={FONT.title} fontWeight={600} fontSize={30} fill="#E2B95A">{sub}</text>}
    </g>
  );
};

/** Radar-jamming streaks spreading along an axis from `from` to `to` (screen px). k = how far it has spread (0..1). */
export const JamCloud: React.FC<{ t: number; from: [number, number]; to: [number, number]; width: number; k: number; n?: number; opacity?: number }> = ({ t, from, to, width, k, n = 320, opacity = 1 }) => {
  if (k <= 0.01) return null;
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy), ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const nx = -dy / len, ny = dx / len, r = Math.floor(t / 2);
  return (
    <g opacity={opacity} pointerEvents="none">
      {Array.from({ length: n }, (_, i) => {
        const u = Math.pow(hash(i, r * 0.31 + 1), 0.8) * k, off = (hash(i, r * 0.31 + 2) - 0.5) * 2 * width * (0.15 + u);
        const x = from[0] + dx * u + nx * off, y = from[1] + dy * u + ny * off, l = 14 + hash(i, r + 3) * 46, a = (ang + (hash(i, r + 4) - 0.5) * 50) * Math.PI / 180;
        return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * l} y2={y + Math.sin(a) * l} stroke={hash(i, 9) > 0.7 ? '#FFFFFF' : '#C8FFD6'} strokeWidth={2 + hash(i, 5) * 3} strokeLinecap="round" opacity={0.25 + 0.6 * hash(i, r + 6)} />;
      })}
    </g>
  );
};

/** Slow push-in / drift wrapper for card scenes (never frozen). */
export const Drift: React.FC<{ t: number; len: number; z0?: number; z1?: number; cx?: number; cy?: number; dx?: number; children: React.ReactNode }> = ({ t, len, z0 = 1, z1 = 1.06, cx = 960, cy = 540, dx = 0, children }) => {
  const u = Math.min(1, t / Math.max(1, len)), z = z0 + (z1 - z0) * u;
  return <g transform={`translate(${cx + dx * u},${cy}) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>;
};

/** Dark control-room / night card background with faint grid and slowly drifting stars. */
export const NightBg: React.FC<{ t: number; stars?: number; top?: string; bottom?: string; id: string }> = ({ t, stars = 70, top = '#0A1422', bottom = '#05090F', id }) => (
  <g>
    <defs><linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id}-bg)`} />
    {Array.from({ length: stars }, (_, i) => (
      <circle key={i} cx={(hash(i, 1) * 1980 - t * (0.15 + hash(i, 4) * 0.3) + 1980) % 1920} cy={hash(i, 2) * 1080} r={1 + hash(i, 3) * 2.2} fill="#CFE0FF" opacity={0.2 + 0.5 * hash(i, 5) * (0.7 + 0.3 * Math.sin(t / 14 + i))} />
    ))}
  </g>
);

/** Arrow between two lon/lat points, drawn up to k (0..1), dashed shaft + head (inside <GeoMap>). */
export const GeoArrow: React.FC<{ from: LL; to: LL; k: number; color?: string; w?: number; dash?: boolean; t?: number }> = ({ from, to, k, color = '#FFD166', w = 12, dash = false, t = 0 }) => {
  const { project: p } = useGeo();
  if (k <= 0.01) return null;
  const [x1, y1] = p(from[0], from[1]), [x2, y2] = p(to[0], to[1]);
  const ex = x1 + (x2 - x1) * k, ey = y1 + (y2 - y1) * k, a = Math.atan2(y2 - y1, x2 - x1), h = w * 2.6;
  const bx = ex - Math.cos(a) * h * 0.8, by = ey - Math.sin(a) * h * 0.8;
  return (
    <g opacity={Math.min(1, k * 4)}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke="#0B0F16" strokeWidth={w + 7} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? `${w * 1.6} ${w}` : undefined} strokeDashoffset={-t * 2} />
      <polygon points={`${ex},${ey} ${bx + Math.sin(a) * h * 0.7},${by - Math.cos(a) * h * 0.7} ${bx - Math.sin(a) * h * 0.7},${by + Math.cos(a) * h * 0.7}`} fill={color} stroke="#0B0F16" strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};
