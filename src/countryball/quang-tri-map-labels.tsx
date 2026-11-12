import React from 'react';
import { FONT } from '../engine/fonts';
import { DMZ_LINE } from './geo-data-quang-tri';
import { OSM_ATTRIBUTION } from './geo-quang-tri-sites';
import { clamp, mix, ramp, useGeo } from './map-context';
import { City, RiverLabel, SeaLabel } from './map-labels';
import { QUANG_TRI_SITES } from './geo-quang-tri-sites';

// Extra labels for the Quảng Trị map level (children of <GeoMap>, all fade with the camera zoom, px/deg):
//   <DmzBand />            the 1954-1975 demarcation line (Bến Hải river + parallel to Laos) as a hatched band ~10 km wide
//   <QuangTriLabels />     province names (QUẢNG BÌNH / QUẢNG TRỊ / THỪA THIÊN, 1972 split at the DMZ; add side tags yourself), river names (Thạch Hãn, Bến Hải, Hiếu, Cam Lộ, Ái Tử, Vĩnh Định...), BIỂN ĐÔNG
//   <QuangTriSites />      all QUANG_TRI_SITES as <City/>, each with its own minZoom so labels never pile up (lights = night glow)
//   OSM_ATTRIBUTION        re-exported credit string for <SourceLine/>
export { OSM_ATTRIBUTION };

const txt = { fontFamily: FONT.title, fontWeight: 800, paintOrder: 'stroke', strokeLinejoin: 'round' } as const;

/** DMZ band: width in km (default 10: 5 km each side of the line). The line itself is dashed gold with a tick label. */
export const DmzBand: React.FC<{ widthKm?: number; label?: string; minZoom?: number; maxZoom?: number; opacity?: number }> = ({
  widthKm = 10, label = 'KHU PHI QUÂN SỰ · BẾN HẢI · VĨ TUYẾN 17', minZoom = 260, maxZoom = 9000, opacity = 1,
}) => {
  const { project, camera, id, screen: SCREEN } = useGeo();
  const op = ramp(camera.zoom, minZoom * 0.7, minZoom) * (1 - ramp(camera.zoom, maxZoom, maxZoom * 1.4)) * opacity;
  if (op <= 0.01 || DMZ_LINE.length < 2) return null;
  const pts = DMZ_LINE.map(([lon, lat]) => project(lon, lat)), d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  const w = clamp((widthKm * 1000 * camera.zoom) / 111320, 8, 1400);
  // label sits on the longest straight run near the middle, along the line direction
  const m = Math.floor(pts.length * 0.12) + 1, [a, b] = [pts[Math.max(0, m - 1)], pts[Math.min(pts.length - 1, m + 1)]];
  let ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
  const off = pts.some((p) => p[0] > -400 && p[0] < SCREEN.W + 400 && p[1] > -400 && p[1] < SCREEN.H + 400);
  if (!off) return null;
  return (
    <g opacity={op}>
      <defs>
        <pattern id={`${id}-dmz`} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={16} height={16} fill="#E2B95A" opacity={0.1} /><rect width={6} height={16} fill="#E2B95A" opacity={0.3} />
        </pattern>
      </defs>
      <path d={d} fill="none" stroke={`url(#${id}-dmz)`} strokeWidth={w} strokeLinejoin="round" strokeLinecap="butt" />
      <path d={d} fill="none" stroke="#E2B95A" strokeWidth={3.2} strokeDasharray="20 12" opacity={0.95} />
      <text transform={`translate(${((a[0] + b[0]) / 2).toFixed(1)},${((a[1] + b[1]) / 2).toFixed(1)}) rotate(${ang.toFixed(1)})`} y={-w / 2 - 14} textAnchor="middle"
        fontSize={26} fill="#F6DE9C" stroke="#0E1D2E" strokeWidth={6} letterSpacing={3} {...txt}>{label}</text>
    </g>
  );
};

const PROVINCE_LABELS: { text: string; lon: number; lat: number }[] = [
  { text: 'QUẢNG BÌNH', lon: 106.55, lat: 17.45 },
  { text: 'QUẢNG TRỊ', lon: 106.88, lat: 16.55 },
  { text: 'THỪA THIÊN', lon: 107.3, lat: 16.42 },
];
const RIVERS: { river: string; text: string; near: [number, number]; minZoom: number; maxZoom?: number }[] = [
  { river: 'ThachHan', text: 'Sông Thạch Hãn', near: [107.16, 16.84], minZoom: 1500, maxZoom: 14000 },
  { river: 'BenHai', text: 'Sông Bến Hải', near: [107.0, 16.99], minZoom: 1500, maxZoom: 14000 },
  { river: 'Hieu', text: 'Sông Hiếu', near: [106.97, 16.8], minZoom: 2600, maxZoom: 14000 },
  { river: 'AiTu', text: 'Sông Ái Tử', near: [107.12, 16.78], minZoom: 3500, maxZoom: 14000 },
  { river: 'MyChanh', text: 'Sông Mỹ Chánh', near: [107.22, 16.67], minZoom: 3500, maxZoom: 14000 },
  { river: 'OLau', text: 'Sông Ô Lâu', near: [107.3, 16.58], minZoom: 2500, maxZoom: 14000 },
  { river: 'Huong', text: 'Sông Hương', near: [107.55, 16.46], minZoom: 2500, maxZoom: 14000 },
];

/** Province names (1972 meaning), rivers, sea. Province text fades out above zoom 3500. */
export const QuangTriLabels: React.FC<{ provinces?: boolean; rivers?: boolean }> = ({ provinces = true, rivers = true }) => {
  const { project, camera, night } = useGeo();
  const po = ramp(camera.zoom, 400, 600) * (1 - ramp(camera.zoom, 2400, 3600));
  return (
    <g>
      {provinces && po > 0.01 && PROVINCE_LABELS.map((p) => {
        const [x, y] = project(p.lon, p.lat);
        return <text key={p.text} x={x} y={y} textAnchor="middle" fontSize={34} fill={mix('#F4E6C8', '#8E8A7C', night)} stroke="#2A1710" strokeWidth={7} letterSpacing={4} opacity={0.82 * po} {...txt}>{p.text}</text>;
      })}
      {rivers && RIVERS.map((r) => <RiverLabel key={r.river} level="quangtri" {...r} />)}
      <SeaLabel lon={107.9} lat={17.3} text="BIỂN ĐÔNG" size={36} spacing={12} minZoom={500} maxZoom={5000} />
    </g>
  );
};

/** minZoom (px/deg) at which each site's label appears: provinces view ~1000, town view ~14000. */
const SITE_MIN_ZOOM: Record<string, number> = {
  hue: 450, dongHa: 600, quangTri: 900, kheSanh: 900, cuaViet: 1000, vinhLinh: 900, cuaTung: 1400, camLo: 1500, gioLinh: 1500, conTien: 2200,
  laoBao: 1200, conCo: 900, hienLuong: 2600, haiLang: 4200, myChanh: 4200, laVang: 5200, aiTu: 5500, trieuPhong: 7000, thachHanBridge: 9000, citadel: 9000,
};
export const QuangTriSites: React.FC<{ lights?: number; only?: string[]; size?: number }> = ({ lights = 1, only, size = 26 }) => (
  <g>
    {Object.entries(QUANG_TRI_SITES).filter(([k]) => !only || only.includes(k)).map(([k, s]) => (
      <City key={k} {...s} lights={lights} minZoom={SITE_MIN_ZOOM[k] ?? 1500} maxZoom={k === 'citadel' ? 1e9 : 60000} size={size} />
    ))}
  </g>
);
