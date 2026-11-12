import { Camera } from './geo-camera';
import { PALACE_BUILDING, PALACE_BUILDINGS, PALACE_GATES, PALACE_GREEN, PALACE_GROUNDS, PALACE_LANDMARKS, PALACE_ORIGIN, PALACE_ROADS, PALACE_WATER } from './palace-site-data';

// Geometry of PalacePlan (Dinh Độc Lập): the LOCAL METRE FRAME and the decoded OpenStreetMap data.
//   Local frame: origin = centre of the palace building (lon 106.6953, lat 10.7769), x = east, y = SOUTH (screen-like), 1 unit = 1 m.
//   Palace frame (front, side): `front` runs along the palace's axis towards the main gate on Lê Duẩn (north-east, AXIS_DEG = -47 deg:
//   the long boulevard Lê Duẩn / Thống Nhất meets the grounds exactly on this axis), `side` is to the RIGHT when looking along `front`
//   (south-east, towards Nguyễn Du). The real façade faces NE; the oval lawn lies between the palace and the gate.
// Everything is computed once at module scope and only READ while rendering (pure).

export const M_PER_DEG = 110574;
const KX = 111320 * Math.cos((PALACE_ORIGIN[1] * Math.PI) / 180);
export const AXIS_DEG = -47;
const AX = Math.cos((AXIS_DEG * Math.PI) / 180), AY = Math.sin((AXIS_DEG * Math.PI) / 180);

export type Vec = [number, number];
export const lonLatToLocal = (lon: number, lat: number): Vec => [(lon - PALACE_ORIGIN[0]) * KX, -(lat - PALACE_ORIGIN[1]) * M_PER_DEG];
export const localToLonLat = (x: number, y: number): Vec => [PALACE_ORIGIN[0] + x / KX, PALACE_ORIGIN[1] - y / M_PER_DEG];
/** palace frame (front towards the gate, side to the right) -> local metres */
export const palaceToLocal = (front: number, side: number): Vec => [front * AX - side * AY, front * AY + side * AX];
/** local metres -> palace frame [front, side] */
export const localToPalace = (x: number, y: number): Vec => [x * AX + y * AY, -x * AY + y * AX];
/** Camera -> { k px per metre, c local centre }. */
export const planCamera = (cam: Camera) => ({ k: cam.zoom / M_PER_DEG, c: lonLatToLocal(cam.lon, cam.lat) });
/** local metres -> screen px under a Camera (place balls, tanks, fx on the plan). */
export const localToScreen = (cam: Camera, x: number, y: number): Vec => {
  const { k, c } = planCamera(cam);
  return [960 + (x - c[0]) * k, 540 + (y - c[1]) * k];
};
/** palace-frame point -> screen px */
export const palaceScreen = (cam: Camera, front: number, side: number): Vec => { const p = palaceToLocal(front, side); return localToScreen(cam, p[0], p[1]); };
/** Camera centred on a palace-frame point at a given scale (px per metre). */
export const cameraOnPalace = (front: number, side: number, pxPerM: number): Camera => {
  const p = palaceToLocal(front, side), ll = localToLonLat(p[0], p[1]);
  return { lon: ll[0], lat: ll[1], zoom: pxPerM * M_PER_DEG };
};

// ---------- decoding (strings are "x0 y0 dx dy ..." in half metres) ----------
export const decodeHalf = (s: string): number[] => {
  const v = s.split(' ').map(Number), out: number[] = [];
  let x = 0, y = 0;
  for (let i = 0; i + 1 < v.length; i += 2) { x += v[i]; y += v[i + 1]; out.push(x / 2, y / 2); }
  return out;
};
export const ptsD = (p: number[], close = false): string => {
  let d = '';
  for (let i = 0; i < p.length; i += 2) d += `${i ? 'L' : 'M'}${p[i].toFixed(1)},${p[i + 1].toFixed(1)}`;
  return d + (close ? 'Z' : '');
};
export const GROUNDS = decodeHalf(PALACE_GROUNDS);
export const BUILDING = decodeHalf(PALACE_BUILDING);
export const ROADS = { major: PALACE_ROADS.major.map(decodeHalf), mid: PALACE_ROADS.mid.map(decodeHalf), minor: PALACE_ROADS.minor.map(decodeHalf), path: PALACE_ROADS.path.map(decodeHalf), garden: PALACE_ROADS.garden.map(decodeHalf) };
export const GREEN = PALACE_GREEN.map(decodeHalf);
export const WATER = PALACE_WATER.map(decodeHalf);
export const BUILDINGS = PALACE_BUILDINGS.map(decodeHalf);
export const LANDMARKS = PALACE_LANDMARKS.map(([name, s]) => ({ name, pts: decodeHalf(s) }));
export const GATES: { x: number; y: number; access: string }[] = PALACE_GATES.map(([x, y, access]) => ({ x, y, access }));

/** Bounding box [x0, y0, x1, y1] of a flat ring. */
export const bboxOf = (p: number[]): [number, number, number, number] => {
  let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
  for (let i = 0; i < p.length; i += 2) { a = Math.min(a, p[i]); c = Math.max(c, p[i]); b = Math.min(b, p[i + 1]); d = Math.max(d, p[i + 1]); }
  return [a, b, c, d];
};
export const inPoly = (p: number[], x: number, y: number): boolean => {
  let inside = false;
  for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2)
    if ((p[i + 1] > y) !== (p[j + 1] > y) && x < ((p[j] - p[i]) * (y - p[i + 1])) / (p[j + 1] - p[i + 1]) + p[i]) inside = !inside;
  return inside;
};

// ---------- named points (palace frame, metres) ----------
const nearestGate = (front: number, side: number): Vec => {
  const t = palaceToLocal(front, side);
  let best = 1e9, at: Vec = t;
  for (const g of GATES) { const d = Math.hypot(g.x - t[0], g.y - t[1]); if (d < best) { best = d; at = [g.x, g.y]; } }
  return best < 30 ? at : t;
};
/** The main gate (Cổng chính, Lê Duẩn / Thống Nhất): the OSM gate node nearest the axis, ~163 m from the palace centre. */
export const MAIN_GATE: Vec = nearestGate(163, 0);
/** Side gates: the OSM node 49 m to the right (the visitors' gate on Nam Kỳ Khởi Nghĩa) and its mirror on the left. */
export const SIDE_GATE_R: Vec = nearestGate(163, 49);
export const SIDE_GATE_L: Vec = palaceToLocal(localToPalace(MAIN_GATE[0], MAIN_GATE[1])[0], -49);
export const PALACE_POINTS = {
  palace: [0, 0], mainGate: MAIN_GATE, sideGateR: SIDE_GATE_R, sideGateL: SIDE_GATE_L,
  /** Lê Duẩn street 120 m outside the main gate (tanks come from here) */
  street: palaceToLocal(localToPalace(MAIN_GATE[0], MAIN_GATE[1])[0] + 120, 0),
  /** foot of the palace's front steps */
  steps: palaceToLocal(52, 0),
} as const satisfies Record<string, Vec>;
const gl = localToLonLat(MAIN_GATE[0], MAIN_GATE[1]);
export const PALACE_FRAME = { lon: PALACE_ORIGIN[0], lat: PALACE_ORIGIN[1], gateLon: gl[0], gateLat: gl[1] };
