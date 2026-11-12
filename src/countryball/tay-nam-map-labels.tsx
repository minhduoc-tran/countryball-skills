import React from 'react';
import { FONT } from '../engine/fonts';
import { LAYERS } from './geo-data';
import { clamp, Pt, easeOut, prog } from './fx-math';
import { FrontArrow } from './ground-front-arrows';
import { mix, ramp, useGeo } from './map-context';
import { City, RiverLabel } from './map-labels';
import { BorderRunName, TAY_NAM_DEFAULT_SITES, TAY_NAM_SITE_MIN_ZOOM, TAY_NAM_SITES } from './geo-tay-nam-sites';
import { TAY_NAM_SIDES, TayNamSide } from './tay-nam-camera-keys';

// Map children for the Tây Nam / Cambodia level (all inside <GeoMap tayNam ...>; fade with the camera zoom, px/deg; t in FRAMES):
//   <TayNamLabels countries? seas? rivers? />          CAMPUCHIA, VIỆT NAM, THÁI LAN, LÀO, VỊNH THÁI LAN, BIỂN ĐÔNG, BIỂN HỒ, river names
//   <TayNamSites only? size? lights? />                 TAY_NAM_SITES as <City/>, per-site minZoom (labels never pile up); size 34 = phone-readable
//   <BorderRun t? t0? dur? names? label? color? />      glowing dashed VN-KHM border along given VN provinces (default the SW front:
//                                                        Kiên Giang, An Giang, Tây Ninh), drawn on progressively from t0 over dur frames
//   <MapArrow id t t0 points side? width? label? dur?/> FrontArrow in lon/lat: side 'vn' | 'front' red, 'kr' maroon, 'krGrey', 'thai'
// Text sizes are tuned for the 1080x1920 frame seen on a phone (labels ~32-44 px).

const txt = { fontFamily: FONT.title, fontWeight: 800, paintOrder: 'stroke', strokeLinejoin: 'round' } as const;

type Name = { text: string; lon: number; lat: number; size: number; in0: number; out0: number };
const COUNTRIES: Name[] = [
  { text: 'CAMPUCHIA', lon: 104.3, lat: 12.15, size: 46, in0: 70, out0: 330 },
  { text: 'VIỆT NAM', lon: 106.9, lat: 11.6, size: 36, in0: 70, out0: 420 },
  { text: 'VIỆT NAM', lon: 105.5, lat: 9.72, size: 40, in0: 300, out0: 1500 },
  { text: 'THÁI LAN', lon: 101.9, lat: 14.9, size: 40, in0: 70, out0: 700 },
  { text: 'LÀO', lon: 105.6, lat: 15.6, size: 40, in0: 70, out0: 700 },
];

export const TayNamLabels: React.FC<{ countries?: boolean; seas?: boolean; rivers?: boolean }> = ({ countries = true, seas = true, rivers = true }) => {
  const { project, camera, night, screen } = useGeo();
  const z = camera.zoom;
  return (
    <g>
      {countries && COUNTRIES.map((c) => {
        const o = ramp(z, c.in0 * 0.8, c.in0) * (1 - ramp(z, c.out0, c.out0 * 1.5)), [x, y] = project(c.lon, c.lat);
        if (o < 0.01 || x < -400 || x > screen.W + 400 || y < -100 || y > screen.H + 100) return null;
        const s = c.size * clamp(z / 180, 0.8, 1.15);
        return <text key={c.text + c.lon} x={x} y={y} textAnchor="middle" fontSize={s} fill={mix('#F4E6C8', '#8E8A7C', night)} stroke="#2A1710" strokeWidth={s * 0.2} letterSpacing={s * 0.14} opacity={0.82 * o} {...txt}>{c.text}</text>;
      })}
      {seas && <>
        <SeaName lon={102.95} lat={9.95} lines={['VỊNH', 'THÁI LAN']} minZoom={90} maxZoom={700} />
        <SeaName lon={107.15} lat={9.0} lines={['BIỂN', 'ĐÔNG']} minZoom={60} maxZoom={600} />
        <LakeLabel />
      </>}
      {rivers && <>
        <RiverLabel level="taynam" river="Mekong" text="Mê Kông" near={[105.97, 12.95]} minZoom={150} maxZoom={1600} size={30} />
        <RiverLabel level="taynam" river="Mekong" text="Sông Tiền" near={[105.62, 10.43]} minZoom={500} maxZoom={6000} size={30} />
        <RiverLabel level="taynam" river="Bassac" text="Sông Hậu (Bát-xắc)" near={[105.3, 10.55]} minZoom={500} maxZoom={6000} size={30} />
        <RiverLabel level="taynam" river="TonleSap" text="Tônlê Sap" near={[104.8, 12.05]} minZoom={500} maxZoom={6000} size={30} />
      </>}
    </g>
  );
};

/** Sea name on two short lines (portrait frames are narrow: one wide-spaced line would leave the screen). */
const SeaName: React.FC<{ lon: number; lat: number; lines: string[]; size?: number; minZoom?: number; maxZoom?: number }> = ({ lon, lat, lines, size = 36, minZoom = 60, maxZoom = 700 }) => {
  const { project, camera, night } = useGeo();
  const o = ramp(camera.zoom, minZoom * 0.8, minZoom) * (1 - ramp(camera.zoom, maxZoom, maxZoom * 1.4));
  if (o < 0.01) return null;
  const [x, y] = project(lon, lat), s = size * clamp(camera.zoom / 200, 0.85, 1.25);
  return (
    <g opacity={0.85 * o}>
      {lines.map((l, i) => <text key={l} x={x} y={y + (i - (lines.length - 1) / 2) * s * 1.2} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={s} fill={mix('#6F98BA', '#2A4560', night)} letterSpacing={s * 0.28}>{l}</text>)}
    </g>
  );
};

/** "BIỂN HỒ" in the middle of the Tonle Sap lake. */
const LakeLabel: React.FC = () => {
  const { project, camera, night } = useGeo();
  const o = ramp(camera.zoom, 140, 180) * (1 - ramp(camera.zoom, 2000, 3000));
  if (o < 0.01) return null;
  const [x, y] = project(104.05, 12.83), s = clamp(camera.zoom / 6, 26, 42);
  return <text x={x} y={y + s * 0.35} textAnchor="middle" fontSize={s} fontStyle="italic" fill={mix('#CFE7F7', '#6F9CBF', night)} stroke="#0E1D2E" strokeWidth={s * 0.18} letterSpacing={s * 0.1} opacity={o} {...txt}>BIỂN HỒ</text>;
};

export const TayNamSites: React.FC<{ only?: string[]; size?: number; lights?: number; maxZoom?: number }> = ({ only, size = 34, lights = 1, maxZoom = 60000 }) => (
  <g>
    {(only ?? TAY_NAM_DEFAULT_SITES).map((k) => {
      const s = TAY_NAM_SITES[k];
      return s ? <City key={k} {...s} lights={lights} minZoom={TAY_NAM_SITE_MIN_ZOOM[k] ?? 300} maxZoom={maxZoom} size={k === 'phnomPenh' ? size + 6 : size} /> : null;
    })}
  </g>
);

/** Glowing dashed border along the VN-KHM border of the given VN provinces (data: LAYERS.taynam.borders), drawn on from t0 over dur frames.
 *  `pulse` (default true) breathes the glow; `label` sits at the middle of the first run. */
export const BorderRun: React.FC<{ t?: number; t0?: number; dur?: number; names?: BorderRunName[]; label?: string; color?: string; width?: number; pulse?: boolean }> = ({
  t = 1e6, t0 = 0, dur = 45, names = ['Kiên Giang', 'An Giang', 'Tây Ninh'], label, color = '#FFD166', width, pulse = true,
}) => {
  const { project, camera } = useGeo();
  const u = easeOut(prog(t, t0, t0 + dur));
  if (u <= 0) return null;
  const w = width ?? clamp(camera.zoom / 90, 4, 12), k = pulse ? 0.75 + 0.25 * Math.sin(t * 0.12) : 1;
  const runs: Pt[][] = names.flatMap((n) => (LAYERS.taynam.borders[n] ?? []).map((r) => {
    const pts: Pt[] = [];
    for (let i = 0; i < r.pts.length; i += 2) pts.push(project(r.pts[i], r.pts[i + 1]));
    return pts;
  }));
  const ds = runs.map((pts) => {
    const n = Math.max(2, Math.ceil(pts.length * u));
    return pts.slice(0, n).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  });
  const mid = runs[0]?.[Math.floor(runs[0].length / 2)];
  return (
    <g>
      {ds.map((d, i) => <path key={`g${i}`} d={d} fill="none" stroke={color} strokeWidth={w * 3.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.28 * k} />)}
      {ds.map((d, i) => <path key={`b${i}`} d={d} fill="none" stroke="#1A1208" strokeWidth={w + 4} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />)}
      {ds.map((d, i) => <path key={`l${i}`} d={d} fill="none" stroke={color} strokeWidth={w} strokeDasharray={`${w * 3} ${w * 1.6}`} strokeLinecap="round" strokeLinejoin="round" />)}
      {label && mid && u > 0.7 && <text x={mid[0] - 24} y={mid[1]} textAnchor="end" fontSize={36} fill={color} stroke="#14100A" strokeWidth={7} opacity={clamp((u - 0.7) * 4)} {...txt}>{label}</text>}
    </g>
  );
};

/** FrontArrow placed in lon/lat; colour by side (VN / Front red, Khmer Rouge maroon). Width follows the zoom (phone-readable). */
export const MapArrow: React.FC<{ id: string; t: number; t0: number; points: [number, number][]; side?: TayNamSide; color?: string; width?: number; label?: string; dur?: number; opacity?: number }> = ({
  id, t, t0, points, side = 'vn', color, width, label, dur = 60, opacity = 0.94,
}) => {
  const { project, camera } = useGeo();
  const w = width ?? clamp(14 + camera.zoom * 0.03, 26, 64);
  return <FrontArrow id={id} t={t} t0={t0} dur={dur} points={points.map(([lo, la]) => project(lo, la) as Pt)} width={w} color={color ?? TAY_NAM_SIDES[side]} label={label} labelSize={clamp(w * 0.8, 22, 40)} opacity={opacity} />;
};
