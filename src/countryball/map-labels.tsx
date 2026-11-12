import React from 'react';
import { FONT } from '../engine/fonts';
import { LAYERS, LevelName } from './geo-data';
import { clamp, mix, nightTone, ramp, useGeo } from './map-context';

// Things drawn ON the map in lon/lat: city markers (with night lights), island groups, sea and river labels,
// a dashed parallel. All read the camera from <GeoMap> via useGeo().

const REF_ZOOM = 54.9661;
/** fade in over [in0,in1], out over [out0,out1] (zoom, px/deg). */
const band = (z: number, in0: number, in1: number, out0: number, out1: number) => ramp(z, in0, in1) * (1 - ramp(z, out0, out1));
const label = { fontFamily: FONT.title, fontWeight: 700, paintOrder: 'stroke', strokeLinejoin: 'round' } as const;

/** Shared gradient for city lights (put once inside <defs>; GeoMap does). */
export const LabelDefs: React.FC<{ id: string }> = ({ id }) => (
  <radialGradient id={`${id}-citylight`}>
    <stop offset="0" stopColor="#FFE2A0" stopOpacity={0.95} /><stop offset="0.35" stopColor="#FFB44D" stopOpacity={0.5} />
    <stop offset="1" stopColor="#FF8A2A" stopOpacity={0} />
  </radialGradient>
);

export interface CityDef { lon: number; lat: number; name: string; anchor?: 'r' | 'l' | 't' | 'b'; glow?: number }
/** Preset places (Vietnamese labels). Spread: <City {...CITIES.hanoi} />. glow = size of the night light. */
export const CITIES: Record<string, CityDef> = {
  hanoi: { lon: 105.85, lat: 21.03, name: 'Hà Nội', anchor: 'l', glow: 1.4 },
  haiphong: { lon: 106.68, lat: 20.86, name: 'Hải Phòng', anchor: 'r', glow: 1 },
  saigon: { lon: 106.7, lat: 10.78, name: 'Sài Gòn', anchor: 'r', glow: 1.2 },
  vinh: { lon: 105.68, lat: 18.68, name: 'Vinh', anchor: 'l', glow: 0.7 },
  danang: { lon: 108.22, lat: 16.05, name: 'Đà Nẵng', anchor: 'r', glow: 0.8 },
  guam: { lon: 144.93, lat: 13.58, name: 'Guam (Andersen)', anchor: 'b', glow: 0.8 },
  utapao: { lon: 101.0, lat: 12.68, name: 'U-Tapao', anchor: 'b', glow: 0.7 },
  paris: { lon: 2.35, lat: 48.86, name: 'Paris', anchor: 'r', glow: 1 },
  washington: { lon: -77.04, lat: 38.9, name: 'Washington', anchor: 'l', glow: 1 },
  moskva: { lon: 37.62, lat: 55.75, name: 'Moskva', anchor: 'r', glow: 1 },
  bacKinh: { lon: 116.4, lat: 39.9, name: 'Bắc Kinh', anchor: 'r', glow: 1 },
};
/** Hà Nội targets (approximate positions, for zoom >= 600 scenes). */
export const HANOI_SITES: Record<string, CityDef> = {
  noiBai: { lon: 105.807, lat: 21.221, name: 'Nội Bài', anchor: 'r', glow: 0.6 },
  giaLam: { lon: 105.89, lat: 21.04, name: 'Gia Lâm', anchor: 'r', glow: 0.5 },
  yenVien: { lon: 105.93, lat: 21.1, name: 'Yên Viên', anchor: 'r', glow: 0.5 },
  khamThien: { lon: 105.84, lat: 21.018, name: 'Khâm Thiên', anchor: 'l', glow: 0.5 },
  bachMai: { lon: 105.85, lat: 21.0, name: 'Bạch Mai', anchor: 'b', glow: 0.5 },
};

export interface CityProps extends CityDef {
  /** 0..1 how lit the city is at night (0 = blackout). Default 1. */
  lights?: number;
  /** hide the label/dot when zoomed out beyond this (fades). */
  minZoom?: number;
  maxZoom?: number;
  /** label size px */
  size?: number;
  showLabel?: boolean;
}
export const City: React.FC<CityProps> = ({ lon, lat, name, anchor = 'r', glow = 1, lights = 1, minZoom = 0, maxZoom = 1e9, size = 28, showLabel = true }) => {
  const { project, camera, night, id, screen } = useGeo();
  const [x, y] = project(lon, lat);
  if (x < -300 || x > screen.W + 300 || y < -200 || y > screen.H + 200) return null;
  const op = band(camera.zoom, minZoom * 0.8, minZoom, maxZoom, maxZoom * 1.25);
  if (op <= 0) return null;
  const lit = night * lights, R = (22 + 26 * clamp(camera.zoom / 200, 0.4, 3)) * glow;
  const off = { r: [16, 0, 'start'], l: [-16, 0, 'end'], t: [0, -20, 'middle'], b: [0, size + 8, 'middle'] }[anchor] as [number, number, 'start' | 'end' | 'middle'];
  return (
    <g opacity={op}>
      {lit > 0.01 && <circle cx={x} cy={y} r={R} fill={`url(#${id}-citylight)`} opacity={Math.min(1, lit * 1.1)} />}
      <circle cx={x} cy={y} r={7} fill={lit > 0.3 ? '#FFD98A' : '#F2F2F2'} stroke="#15181F" strokeWidth={3.5} />
      {showLabel && <text x={x + off[0]} y={y + off[1] + size * 0.35} textAnchor={off[2]} fontSize={size} fill="#F4F4F4" stroke="#0E1D2E" strokeWidth={6} {...label}>{name}</text>}
    </g>
  );
};

/** Small island group drawn as dots + label (Hoàng Sa / Trường Sa). Offsets are deterministic (seed). */
export const IslandGroup: React.FC<{ lon: number; lat: number; label: string; color: string; seed: number; minZoom?: number; maxZoom?: number }> = ({ lon, lat, label: text, color, seed, minZoom = 24, maxZoom = 240 }) => {
  const { project, camera, night } = useGeo();
  const op = band(camera.zoom, minZoom * 0.8, minZoom, maxZoom, maxZoom * 1.3);
  if (op <= 0) return null;
  const [x, y] = project(lon, lat), sc = clamp(camera.zoom / REF_ZOOM, 0.5, 3);
  const dots = Array.from({ length: 7 }, (_, i) => [x + Math.sin(i * 2.3 + seed) * 26 * sc, y + Math.cos(i * 1.7 + seed) * 18 * sc, (4 + (i % 3)) * sc]);
  return (
    <g opacity={op}>
      {dots.map(([dx, dy, r], i) => <circle key={i} cx={dx} cy={dy} r={r} fill={nightTone(color, night)} stroke="#24252C" strokeWidth={1.5} />)}
      <text x={x} y={y + 50 * Math.min(sc, 1.6)} textAnchor="middle" fontSize={22} fill="#DCE6EE" stroke="#0E1D2E" strokeWidth={5} {...label}>{text}</text>
    </g>
  );
};

/** Wide-spaced sea name. */
export const SeaLabel: React.FC<{ lon: number; lat: number; text: string; size?: number; spacing?: number; minZoom?: number; maxZoom?: number }> = ({ lon, lat, text, size = 34, spacing = 10, minZoom = 28, maxZoom = 150 }) => {
  const { project, camera, night } = useGeo();
  const op = band(camera.zoom, minZoom * 0.8, minZoom, maxZoom, maxZoom * 1.4);
  if (op <= 0) return null;
  const [x, y] = project(lon, lat), s = clamp(camera.zoom / REF_ZOOM, 0.7, 1.5);
  return <text x={x} y={y} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={size * s} fill={mix('#5F86A6', '#2A4560', night)} letterSpacing={spacing * s} opacity={0.85 * op}>{text}</text>;
};

/** Dashed parallel across the screen (e.g. lat 20 = "vĩ tuyến 20"). */
export const Parallel: React.FC<{ lat: number; label?: string; labelX?: number; color?: string }> = ({ lat, label: text, labelX = 1180, color = '#E2B95A' }) => {
  const { project, screen } = useGeo();
  const y = project(0, lat)[1];
  if (y < -40 || y > screen.H + 40) return null;
  return (
    <g>
      <line x1={0} y1={y} x2={screen.W} y2={y} stroke={color} strokeWidth={3.5} strokeDasharray="22 14" opacity={0.85} />
      {text && <text x={labelX} y={y - 14} fontFamily={FONT.title} fontWeight={800} fontSize={30} fill={color} stroke="#0E1D2E" strokeWidth={6} paintOrder="stroke" letterSpacing={3}>{text}</text>}
    </g>
  );
};

/** River name set along the river: finds the closest point of the detail-level river and follows its direction. */
export const RiverLabel: React.FC<{ river: string; text: string; near: [number, number]; minZoom?: number; maxZoom?: number; level?: LevelName; size?: number }> = ({ river, text, near, minZoom = 260, maxZoom = 1e9, level = 'detail', size = 24 }) => {
  const { project, camera, night } = useGeo();
  const op = band(camera.zoom, minZoom * 0.8, minZoom, maxZoom, maxZoom * 1.3);
  if (op <= 0) return null;
  let best = 1e9, a: [number, number] = [0, 0], b: [number, number] = [0, 0];
  for (const r of LAYERS[level].rivers[river] ?? []) {
    for (let i = 0; i + 3 < r.pts.length; i += 2) {
      const d = Math.hypot(r.pts[i] - near[0], r.pts[i + 1] - near[1]);
      if (d < best) { best = d; a = [r.pts[i], r.pts[i + 1]]; b = [r.pts[i + 2], r.pts[i + 3]]; }
    }
  }
  const [x0, y0] = project(a[0], a[1]), [x1, y1] = project(b[0], b[1]);
  let ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
  return (
    <text transform={`translate(${x0},${y0}) rotate(${ang})`} y={-16} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontStyle="italic"
      fontSize={size} fill={mix('#BFE0F7', '#6F9CBF', night)} stroke="#0E1D2E" strokeWidth={(5 * size) / 24} paintOrder="stroke" opacity={op}>{text}</text>
  );
};

/** Default map labels: Biển Đông, Hoàng Sa, Trường Sa, Vịnh Bắc Bộ and the four rivers around Hà Nội. */
export const MapLabels: React.FC = () => (
  <g>
    <SeaLabel lon={116.4} lat={11.6} text="BIỂN ĐÔNG" />
    <SeaLabel lon={107.7} lat={19.7} text="VỊNH BẮC BỘ" size={30} spacing={8} minZoom={110} maxZoom={420} />
    <IslandGroup lon={112.0} lat={16.5} label="HOÀNG SA" color="#C8573F" seed={1} />
    <IslandGroup lon={114.3} lat={9.6} label="TRƯỜNG SA" color="#C8573F" seed={3} />
    <RiverLabel river="Hong" text="Sông Hồng" near={[105.8, 21.12]} />
    <RiverLabel river="Da" text="Sông Đà" near={[104.6, 21.5]} minZoom={300} />
    <RiverLabel river="Lo" text="Sông Lô" near={[105.1, 21.9]} minZoom={400} />
    <RiverLabel river="Duong" text="Sông Đuống" near={[106.03, 21.14]} minZoom={560} />
  </g>
);
