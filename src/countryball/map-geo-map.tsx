import React from 'react';
import { Camera, ScreenSize, levelsFor, screenOf, withScreen } from './geo-camera';
import { LAYERS } from './geo-data';
import { GeoProvider, mix } from './map-context';
import { LevelLayer } from './map-geo-layer';
import { LabelDefs, MapLabels, Parallel } from './map-labels';

// <GeoMap>: the countryball-channel map. Dark navy sea, soft glowing coast, flat muted land with paper grain, thin
// dark borders. Zoom picks the detail level (world 110m / region 50m / North Vietnam 10m with provinces + rivers).
// Children render inside the map's coordinate context: use <City/>, <IslandGroup/>, <Parallel/> or useGeo().project.

/** Default land colours: Vietnam warm red, USA (and its territories) blue-grey; everything else MUTED grey-brown. */
export const DEFAULT_COLORS: Record<string, string> = { VNM: '#C8573F', USA: '#6F8299', GUM: '#6F8299', MNP: '#6F8299', ASM: '#6F8299' };

export interface GeoMapProps {
  camera: Camera;
  /** ISO A3 -> fill, merged over DEFAULT_COLORS. */
  colors?: Record<string, string>;
  /** Fill per province name (detail level, e.g. { 'Hà Nội': '#E8795F' }); needs provinces. */
  provinceColors?: Record<string, string>;
  /** Countries (ISO A3) or provinces (Vietnamese name) drawn lighter with a gold outline. */
  highlight?: string[];
  /** Draw province borders (only at the detail level, zoom >= LEVEL_ZOOM.detail). */
  provinces?: boolean;
  /** true = all rivers of the level, or a list of names ('Mekong', 'Hong', 'Da', 'Lo', 'Duong'). */
  rivers?: boolean | string[];
  /** 0 day .. 1 night (cooler, darker; City lights glow). */
  night?: number;
  /** Dashed parallel at this latitude, e.g. 20 for "vĩ tuyến 20". */
  parallel?: number | false;
  /** Sea / island labels (BIỂN ĐÔNG, HOÀNG SA, TRƯỜNG SA, VỊNH BẮC BỘ). Default true. */
  labels?: boolean;
  /** Unique SVG id prefix when two maps share a frame. */
  id?: string;
  riverColor?: string;
  /** Opt-in Tây Nam / Indochina level (Natural Earth 10m: Cambodia, Biển Hồ, Mekong + Bassac, KHM + south VN provinces, islands of the
   *  Gulf of Thailand). Replaces the North-VN detail / Quảng Trị levels for this map. */
  tayNam?: boolean;
  /** Screen size (e.g. PORTRAIT = 1080x1920). Default: the camera's own w/h, else 1920x1080. */
  screen?: ScreenSize;
  children?: React.ReactNode;
}

export const GeoMap: React.FC<GeoMapProps> = ({
  camera, colors, provinceColors, highlight = [], provinces = false, rivers = true, night = 0, parallel = false,
  labels = true, id = 'gm', riverColor = '#2A4B6B', tayNam = false, screen, children,
}) => {
  if (screen) camera = withScreen(camera, screen);
  const { W, H } = screenOf(camera);
  const levels = levelsFor(camera, { tayNam });
  const merged = { ...DEFAULT_COLORS, ...colors };
  const sea0 = mix('#0E1D2E', '#050B15', night), sea1 = mix('#1A3550', '#0B1A2C', night);
  return (
    <GeoProvider camera={camera} night={night} id={id}>
      <defs>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor={sea0} /><stop offset="1" stopColor={sea1} /></linearGradient>
        <filter id={`${id}-glow`} filterUnits="userSpaceOnUse" x={-120} y={-120} width={W + 240} height={H + 240}>
          <feGaussianBlur stdDeviation={Math.max(5, Math.min(20, (14 * camera.zoom) / 55))} />
        </filter>
        {/* paper grain: high-frequency noise kept only where land is painted */}
        <filter id={`${id}-grain`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={4} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" result="g" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="g" /></feMerge>
        </filter>
        <LabelDefs id={id} />
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sea)`} />
      {levels.map((lv, i) => (
        <LevelLayer key={lv} id={id} level={lv} layer={LAYERS[lv]} cam={camera} night={night}
          hole={i + 1 < levels.length ? LAYERS[levels[i + 1]].box : null}
          colors={merged} provinceColors={provinceColors ?? {}} highlight={highlight} provinces={provinces}
          rivers={rivers} riverColor={riverColor} />
      ))}
      {parallel !== false && <Parallel lat={parallel} label={parallel === 20 ? 'VĨ TUYẾN 20' : undefined} />}
      {labels && <MapLabels />}
      {children}
    </GeoProvider>
  );
};
