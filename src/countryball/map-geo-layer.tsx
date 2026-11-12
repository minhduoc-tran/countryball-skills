import React from 'react';
import { Box, Layer, LevelName } from './geo-data';
import { Camera, project, screenOf, viewBounds } from './geo-camera';
import { ringsPath } from './geo-paths';
import { clamp, mix, nightTone, ramp } from './map-context';
import { SaigonLayerExtras } from './map-saigon-layer-extras';

// One detail level of the map: coast glow, shore line, grain-textured country fills, borders, provinces, rivers.
// Levels are stacked coarse -> fine; a coarse level is clipped with a hole where the finer level takes over, so the
// two generalisations of the same coast never show through each other.

export const MUTED = '#6E6762';
const REF_ZOOM = 54.9661; // zoom of the original 1920x1080 SE-Asia framing: stroke widths below are tuned for it
const RIVER_W: Record<string, number> = { Hong: 1.35, Da: 1, Lo: 0.85, Duong: 0.7, Mekong: 1 };
/** Quảng Trị level: river widths in metres (drawn as metres * zoom / 111320 px, at least ~1.4 px). */
const RIVER_M: Record<string, number> = { ThachHan: 150, BenHai: 90, Hieu: 70, CamLo: 60, MyChanh: 50, AiTu: 55, VinhDinh: 45, OLau: 70, Bo: 60, Huong: 140, Other: 25,
  // Sài Gòn level (saigon): widths of the big rivers in metres (Soài Rạp / Nhà Bè are 1-2 km wide near the mouth)
  SaiGon: 300, DongNai: 700, NhaBe: 650, SoaiRap: 1100, LongTau: 700, ThiVai: 450, VamCoDong: 200, VamCoTay: 200, VamCo: 380, Be: 120, CanGiuoc: 150,
  DongTranh: 300, NgaBay: 200, Dua: 250, BenLuc: 100, GoGia: 90, ThiTinh: 60, ThiNghe: 35, BenNghe: 50, TauHu: 35 };
/** Tây Nam level (taynam, Natural Earth 10m): [relative width at low zoom, real width in metres] (drawn as the larger of the two). */
const RIVER_TN: Record<string, [number, number]> = { Mekong: [1.15, 1400], Bassac: [0.9, 900], TonleSap: [0.75, 450], CoChien: [0.7, 900], HamLuong: [0.65, 900],
  Kong: [0.6, 350], Srepok: [0.55, 250], Mun: [0.5, 200], ChaoPhraya: [0.6, 350] };

// inset > 0 shrinks the rectangle: the hole in a coarse level is 1 px smaller than the finer level's box, so the two
// overlap by a pixel and the anti-aliased seam never lets the sea show through as a hairline.
const rectD = (b: Box, cam: Camera, inset = 0) => {
  const [x0, y0] = project(cam, b[0], b[3]), [x1, y1] = project(cam, b[2], b[1]);
  return `M${(x0 + inset).toFixed(1)},${(y0 + inset).toFixed(1)}H${(x1 - inset).toFixed(1)}V${(y1 - inset).toFixed(1)}H${(x0 + inset).toFixed(1)}Z`;
};
const screenRect = (cam: Camera) => { const S = screenOf(cam); return `M-60,-60H${S.W + 60}V${S.H + 60}H-60Z`; };

export interface LayerProps {
  id: string; level: LevelName; layer: Layer; cam: Camera; night: number;
  hole: Box | null; // box of the next finer level (cut out of this one)
  colors: Record<string, string>; provinceColors: Record<string, string>; highlight: string[];
  provinces: boolean; rivers: boolean | string[]; riverColor: string;
}

export const LevelLayer: React.FC<LayerProps> = (p) => {
  const { id, level, layer, cam, night } = p;
  const view = viewBounds(cam, 60);
  const gs = clamp(cam.zoom / REF_ZOOM, 0.35, 1.4);                 // glow/shore scale
  const bw = clamp((3 * cam.zoom) / REF_ZOOM, 1.1, 3.2);            // border width
  const codes = Object.keys(layer.countries);
  const paths = codes.map((c) => [c, ringsPath(layer.countries[c], cam, view, { closed: true })] as const).filter(([, d]) => d);
  const all = paths.map(([, d]) => d).join('');
  const clipId = `${id}-clip-${level}`;
  const needClip = level !== 'world' || p.hole !== null;
  const outer = level === 'world' ? screenRect(cam) : rectD(layer.box, cam);
  const clipD = outer + (p.hole ? rectD(p.hole, cam, 1) : '');       // solid parts: overlap the finer level by 1 px
  const glowClipD = outer + (p.hole ? rectD(p.hole, cam) : '');      // translucent glow: exact abutment (overlap would double it)

  const riverNames = Object.keys(layer.rivers).filter((n) => p.rivers === true || (Array.isArray(p.rivers) && p.rivers.includes(n)));
  const baseW = cam.zoom < 100 ? cam.zoom * 0.0728 : clamp(4.5 + (cam.zoom - 100) * 0.0085, 4.5, 11);
  const riverCol = nightTone(mix(p.riverColor, '#5FA0D0', ramp(cam.zoom, 60, 300)), night);
  const hi = p.highlight;
  const fill = (c: string) => {
    const base = nightTone(p.colors[c] ?? MUTED, night);
    return hi.includes(c) ? mix(base, '#FFFFFF', 0.22) : base;
  };
  const showProv = p.provinces && (level === 'detail' || level === 'quangtri' || level === 'taynam');
  // Biển Hồ (Tonlé Sap) and other lakes of the taynam level: water fill + a shore line in the river colour
  const lakeD = level === 'taynam' ? ringsPath(layer.areas.Lake ?? [], cam, view, { closed: true }) : '';
  const provPaths = showProv ? Object.keys(layer.provinces).map((n) => [n, ringsPath(layer.provinces[n], cam, view, { closed: true })] as const) : [];

  return (
    <g>
      {needClip && <clipPath id={clipId}><path d={clipD} clipRule="evenodd" /></clipPath>}
      {needClip && <clipPath id={`${clipId}-glow`}><path d={glowClipD} clipRule="evenodd" /></clipPath>}
      <g clipPath={needClip ? `url(#${clipId}-glow)` : undefined}>
        <g filter={`url(#${id}-glow)`} opacity={0.55 * (1 - 0.35 * night)}>
          <path d={all} fill="none" stroke={mix('#3F7398', '#1F4A70', night)} strokeWidth={46 * gs} strokeLinejoin="round" />
        </g>
      </g>
      <g clipPath={needClip ? `url(#${clipId})` : undefined}>
        <path d={all} fill="none" stroke={mix('#2D5878', '#17304A', night)} strokeWidth={12 * gs} strokeLinejoin="round" opacity={0.7} />
        <g filter={`url(#${id}-grain)`}>
          {paths.map(([c, d]) => <path key={c} d={d} fill={fill(c)} />)}
        </g>
        <path d={all} fill="none" stroke={nightTone('#24252C', night)} strokeWidth={bw} strokeLinejoin="round" />
        {level === 'saigon' && <SaigonLayerExtras layer={layer} cam={cam} view={view} night={night} />}
        {showProv && (
          <g>
            {provPaths.filter(([n, d]) => d && p.provinceColors[n]).map(([n, d]) => <path key={`pf${n}`} d={d} fill={nightTone(p.provinceColors[n], night)} fillOpacity={0.92} />)}
            <path d={provPaths.map(([, d]) => d).join('')} fill="none" stroke={nightTone('#4A2118', night)} strokeWidth={1.4} strokeOpacity={0.55} strokeLinejoin="round" />
            {provPaths.filter(([n, d]) => d && hi.includes(n)).map(([n, d]) => <path key={`ph${n}`} d={d} fill="#FFFFFF" fillOpacity={0.14} stroke="#E2B95A" strokeWidth={3.4} strokeLinejoin="round" />)}
          </g>
        )}
        {lakeD && <path d={lakeD} fill={nightTone(mix('#1F4466', '#3E78A6', ramp(cam.zoom, 100, 600)), night)} stroke={riverCol} strokeWidth={clamp(cam.zoom / 220, 1.2, 3)} strokeLinejoin="round" />}
        {riverNames.map((n) => {
          const d = ringsPath(layer.rivers[n], cam, view, { closed: false, smooth: level !== 'world' && level !== 'region', minStep: 0.6 });
          const tn = RIVER_TN[n] ?? [0.5, 200];
          const w = level === 'quangtri' || level === 'saigon' ? clamp(((RIVER_M[n] ?? 25) * cam.zoom) / 111320, n === 'Other' ? 1 : 1.6, 60)
            : level === 'taynam' ? clamp(Math.max(baseW * tn[0], (tn[1] * cam.zoom) / 111320), 1.4, 60) : baseW * (RIVER_W[n] ?? 1);
          return d ? <path key={n} d={d} fill="none" stroke={riverCol} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /> : null;
        })}
      </g>
    </g>
  );
};
