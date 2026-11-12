import { Box, LAYERS, LevelName } from './geo-data';

// Map camera: centre lon/lat + zoom (pixels per degree of latitude), equirectangular with the x-scale reduced by cos(lat) (lat0 = latitude
// of true scale, defaults to the camera latitude). The screen is 1920x1080 unless the camera carries its own size (`w`, `h`): a PORTRAIT
// camera ({ ...cam, w: 1080, h: 1920 }, see `portraitCam` / `PORTRAIT`) makes project/unproject/viewBounds/levelsFor, <GeoMap> and every
// map child work on a 1080x1920 frame. Cameras without w/h behave exactly as before (same numbers, same pixels).
// Everything here is a pure function of its arguments (t in seconds), so it is safe in any frame.

export interface ScreenSize { W: number; H: number }
export const SCREEN: ScreenSize = { W: 1920, H: 1080 };
/** TikTok / Shorts frame. */
export const PORTRAIT: ScreenSize = { W: 1080, H: 1920 };
export interface Camera { lon: number; lat: number; zoom: number; lat0?: number; /** screen width px (default 1920) */ w?: number; /** screen height px (default 1080) */ h?: number }
/** Screen size a camera renders to (SCREEN unless the camera carries w/h). */
export const screenOf = (c: Camera): ScreenSize => ({ W: c.w ?? SCREEN.W, H: c.h ?? SCREEN.H });
/** The same camera on another screen size. */
export const withScreen = (c: Camera, s: ScreenSize): Camera => ({ ...c, w: s.W, h: s.H });
/** The same camera on the 1080x1920 portrait frame. */
export const portraitCam = (c: Camera): Camera => withScreen(c, PORTRAIT);
export type Ease = 'inout' | 'out' | 'in' | 'linear';
/** A camera key at time t (s). `ease` shapes the move that ARRIVES at this key (default 'inout'). */
export interface CameraKey extends Camera { t: number; ease?: Ease }

/** Zoom (px/deg) from which each finer level is drawn on top of the coarser ones. */
export const LEVEL_ZOOM = { region: 18, detail: 140, quangtri: 500, quangtriAlways: 2500, saigon: 1000, saigonAlways: 3000, taynam: 40, taynamAlways: 400 };

const EASES: Record<Ease, (u: number) => number> = {
  inout: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  out: (u) => 1 - Math.pow(1 - u, 3),
  in: (u) => u * u * u,
  linear: (u) => u,
};
const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/**
 * Camera at time t from keyframes (sorted by t). Zoom interpolates in log space; the centre moves so the target
 * keeps a steady screen speed while zooming (so a zoom toward a point really lands on it), then eases.
 */
export function cameraAt(keys: CameraKey[], t: number): Camera {
  if (!keys.length) throw new Error('cameraAt: no keys');
  // one key sequence = one screen: if any key carries w/h (portrait keys), the result carries them; else no w/h (1920x1080, as before)
  const sk = keys.find((k) => k.w !== undefined), sc = sk ? { w: sk.w, h: sk.h } : {};
  if (t <= keys[0].t) return { lon: keys[0].lon, lat: keys[0].lat, zoom: keys[0].zoom, lat0: keys[0].lat0, ...sc };
  const last = keys[keys.length - 1];
  if (t >= last.t) return { lon: last.lon, lat: last.lat, zoom: last.zoom, lat0: last.lat0, ...sc };
  let i = 0;
  while (keys[i + 1].t <= t) i++;
  const a = keys[i], b = keys[i + 1];
  const e = EASES[b.ease ?? 'inout'](clamp01((t - a.t) / (b.t - a.t)));
  const zoom = a.zoom * Math.pow(b.zoom / a.zoom, e);
  const dz = 1 / b.zoom - 1 / a.zoom;
  const s = Math.abs(Math.log(b.zoom / a.zoom)) > 1e-3 ? clamp01((1 / zoom - 1 / a.zoom) / dz) : e;
  return { lon: lerp(a.lon, b.lon, s), lat: lerp(a.lat, b.lat, s), zoom, lat0: a.lat0 !== undefined && b.lat0 !== undefined ? lerp(a.lat0, b.lat0, s) : undefined, ...sc };
}

/** px per degree of longitude. */
export const scaleX = (c: Camera) => c.zoom * Math.cos(((c.lat0 ?? c.lat) * Math.PI) / 180);

/** lon/lat -> screen px. */
export const project = (c: Camera, lon: number, lat: number): [number, number] =>
  [(c.w ?? SCREEN.W) / 2 + (lon - c.lon) * scaleX(c), (c.h ?? SCREEN.H) / 2 - (lat - c.lat) * c.zoom];

/** screen px -> lon/lat. */
export const unproject = (c: Camera, x: number, y: number): [number, number] =>
  [c.lon + (x - (c.w ?? SCREEN.W) / 2) / scaleX(c), c.lat - (y - (c.h ?? SCREEN.H) / 2) / c.zoom];

/** lon/lat box visible on screen (padPx grows it, for culling). */
export function viewBounds(c: Camera, padPx = 0): Box {
  const S = screenOf(c), [l0, t0] = unproject(c, -padPx, -padPx), [l1, b1] = unproject(c, S.W + padPx, S.H + padPx);
  return [l0, b1, l1, t0];
}

/** Camera that frames a lon/lat box with a pixel margin (no animation: feed it to keys). Pass `screen` (e.g. PORTRAIT) to fit a
 *  1080x1920 frame: the result then carries w/h. */
export function fitCamera(box: Box, padPx = 120, screen?: ScreenSize): Camera {
  const S = screen ?? SCREEN;
  const lon = (box[0] + box[2]) / 2, lat = (box[1] + box[3]) / 2, k = Math.cos((lat * Math.PI) / 180);
  const zoom = Math.min((S.W - 2 * padPx) / ((box[2] - box[0]) * k), (S.H - 2 * padPx) / (box[3] - box[1]));
  return screen ? { lon, lat, zoom, w: S.W, h: S.H } : { lon, lat, zoom };
}

const overlaps = (a: Box, b: Box) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
const within = (v: Box, b: Box) => v[0] >= b[0] && v[2] <= b[2] && v[1] >= b[1] && v[3] <= b[3];

/** Options of levelsFor / <GeoMap>. */
export interface LevelOpts {
  /** Use the Tây Nam / Indochina Natural Earth 10m level (Cambodia, Biển Hồ, Mekong + Bassac, provinces) instead of the North-VN
   *  detail and Quảng Trị levels. Opt-in so existing episodes never change. */
  tayNam?: boolean;
}

/** Detail levels drawn for this camera, coarse to fine ('world' is always first). */
export function levelsFor(c: Camera, opts: LevelOpts = {}): LevelName[] {
  const v = viewBounds(c, 40);
  const out: LevelName[] = ['world'];
  if (opts.tayNam) {
    // taynam swaps in once the whole view lies inside lon 97..115 / lat 4..24 (portrait zoom >= ~90, landscape >= ~110) or from zoom 400;
    // the 50m region level is skipped when the 10m level covers the whole view (it would be clipped away anyway).
    const tb = LAYERS.taynam.box, inT = within(v, tb);
    const tn = c.zoom >= LEVEL_ZOOM.taynam && overlaps(v, tb) && (inT || c.zoom >= LEVEL_ZOOM.taynamAlways);
    if (c.zoom >= LEVEL_ZOOM.region && overlaps(v, LAYERS.region.box) && !(tn && inT)) out.push('region');
    if (tn) out.push('taynam');
    const sb = LAYERS.saigon.box;
    if (tn && c.zoom >= LEVEL_ZOOM.saigon && overlaps(v, sb) && (within(v, sb) || c.zoom >= LEVEL_ZOOM.saigonAlways)) out.push('saigon');
    return out;
  }
  if (c.zoom >= LEVEL_ZOOM.region && overlaps(v, LAYERS.region.box)) out.push('region');
  if (c.zoom >= LEVEL_ZOOM.detail && overlaps(v, LAYERS.detail.box)) out.push('detail');
  // Quảng Trị (OSM) swaps in only once the whole view lies inside its box, so the box edge never shows as a seam
  // between two different generalisations of the coast (or at any zoom >= quangtriAlways that overlaps it).
  const qb = LAYERS.quangtri.box, inside = v[0] >= qb[0] && v[2] <= qb[2] && v[1] >= qb[1] && v[3] <= qb[3];
  if (c.zoom >= LEVEL_ZOOM.quangtri && overlaps(v, qb) && (inside || c.zoom >= LEVEL_ZOOM.quangtriAlways)) out.push('quangtri');
  // Sài Gòn (OSM) swaps in by the same rule: whole view inside lon 106.2..107.55 / lat 10.2..11.25 (about zoom 1000-1700), or zoom >= saigonAlways.
  const sb = LAYERS.saigon.box, inS = v[0] >= sb[0] && v[2] <= sb[2] && v[1] >= sb[1] && v[3] <= sb[3];
  if (c.zoom >= LEVEL_ZOOM.saigon && overlaps(v, sb) && (inS || c.zoom >= LEVEL_ZOOM.saigonAlways)) out.push('saigon');
  return out;
}

/** True when the OpenStreetMap Quảng Trị level (provinces, small rivers, accurate coast) is drawn for this camera: use it to time
 *  `provinceColors` / highlights, which only exist from that level on (at lower zoom the region level has no provinces). */
export const hasQuangTriLevel = (c: Camera): boolean => levelsFor(c).includes('quangtri');

/** True when the OpenStreetMap Sài Gòn level (rivers, roads, mangroves, accurate coast) is drawn: credit OSM in such scenes. */
export const hasSaigonLevel = (c: Camera): boolean => levelsFor(c).includes('saigon');
