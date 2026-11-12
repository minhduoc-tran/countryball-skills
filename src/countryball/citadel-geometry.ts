import { Camera } from './geo-camera';
import { clamp, hash } from './fx-math';
import { SITE_RESIDENTIAL, SITE_ROADS, SITE_WATER, SITE_WATERWAYS } from './citadel-site-data';

// Geometry of CitadelPlan: the LOCAL METRE FRAME and the seeded layouts (houses, trees, craters, wall pieces).
//   Local frame: origin = citadel centre (lon 107.1896, lat 16.7539), x = east, y = SOUTH (screen-like), 1 unit = 1 m.
//   Citadel frame (u, v): the citadel's own axes, rotated CITADEL.rot degrees clockwise from the local frame
//   (the real citadel is a ~480 m square turned 16.6 deg: its Đông wall faces east-south-east).
// Everything is computed once at module scope from fixed seeds (no Math.random) and only READ while rendering.

export const CITADEL = {
  lon: 107.1896, lat: 16.7539,
  cx: -8, cy: -3,       // citadel centre in the local frame (m), from the OSM outline
  rot: 16.6,            // degrees clockwise
  half: 240,            // outer face of the wall: square of 480 m
  wall: 12,             // rampart thickness at the base (brick-faced earth, 12 m per Wikipedia)
  moat: 18,             // moat width (the sources say ~18 m)
  tip: 272,             // bastion tip distance on the corner diagonals
};
export const M_PER_DEG = 110574;
const KX = 111320 * Math.cos((CITADEL.lat * Math.PI) / 180);

export type Vec = [number, number];
/** lon/lat -> local metres. */
export const lonLatToLocal = (lon: number, lat: number): Vec => [(lon - CITADEL.lon) * KX, -(lat - CITADEL.lat) * M_PER_DEG];
/** citadel frame (u east-ish, v south-ish, rotated) -> local metres. */
export const citadelToLocal = (u: number, v: number): Vec => {
  const a = (CITADEL.rot * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return [CITADEL.cx + u * c - v * s, CITADEL.cy + u * s + v * c];
};
export const localToCitadel = (x: number, y: number): Vec => {
  const a = (CITADEL.rot * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), dx = x - CITADEL.cx, dy = y - CITADEL.cy;
  return [dx * c + dy * s, -dx * s + dy * c];
};
/** Camera (GeoMap Camera: lon, lat, zoom px/deg) -> { k px per metre, local centre }. */
export const planCamera = (cam: Camera) => ({ k: cam.zoom / M_PER_DEG, c: lonLatToLocal(cam.lon, cam.lat) });
/** local metres -> screen px under a Camera. */
export const localToScreen = (cam: Camera, x: number, y: number): Vec => {
  const { k, c } = planCamera(cam);
  return [960 + (x - c[0]) * k, 540 + (y - c[1]) * k];
};
/** Citadel-frame point -> screen px (e.g. the east gate: citadelScreen(cam, CITADEL.half, 0)). */
export const citadelScreen = (cam: Camera, u: number, v: number): Vec => { const p = citadelToLocal(u, v); return localToScreen(cam, p[0], p[1]); };
/** Camera looking at a citadel-frame point at a given scale (px per metre). */
export const cameraOnCitadel = (u: number, v: number, pxPerM: number): Camera => {
  const p = citadelToLocal(u, v), lat = CITADEL.lat - p[1] / M_PER_DEG;
  return { lon: CITADEL.lon + p[0] / KX, lat, zoom: pxPerM * M_PER_DEG };
};

/** Named spots (citadel frame, metres): gates at the middle of each wall, centre, corners. */
export const CITADEL_POINTS = {
  centre: [0, 0], gateE: [CITADEL.half, 0], gateW: [-CITADEL.half, 0], gateN: [0, -CITADEL.half], gateS: [0, CITADEL.half],
  cornerNE: [CITADEL.half, -CITADEL.half], cornerNW: [-CITADEL.half, -CITADEL.half], cornerSE: [CITADEL.half, CITADEL.half], cornerSW: [-CITADEL.half, CITADEL.half],
} as const satisfies Record<string, Vec>;

// ---------- decoding the generated site data ----------
/** "x0 y0 dx dy ..." -> flat absolute [x, y, x, y ...] */
export const decodeLine = (s: string): number[] => {
  const v = s.split(' ').map(Number), out: number[] = [];
  let x = 0, y = 0;
  for (let i = 0; i + 1 < v.length; i += 2) { x += v[i]; y += v[i + 1]; out.push(x, y); }
  return out;
};
export const pointsD = (p: number[], close = false): string => {
  let d = '';
  for (let i = 0; i < p.length; i += 2) d += `${i ? 'L' : 'M'}${p[i]},${p[i + 1]}`;
  return d + (close ? 'Z' : '');
};
export const ROADS = { major: SITE_ROADS.major.map(decodeLine), mid: SITE_ROADS.mid.map(decodeLine), minor: SITE_ROADS.minor.map(decodeLine) };
export const WATER = SITE_WATER.map(([name, s]) => ({ name, pts: decodeLine(s) }));
export const WATERWAYS = SITE_WATERWAYS.map(([name, kind, s]) => ({ name, kind, pts: decodeLine(s) }));
export const RESIDENTIAL = SITE_RESIDENTIAL.map(decodeLine);
/** Static data extent (m): outside this the plan is plain fields. */
export const DATA_BOX = { x0: -4100, y0: -2500, x1: 3500, y1: 2200 };

export const inPoly = (p: number[], x: number, y: number): boolean => {
  let inside = false;
  for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2)
    if ((p[i + 1] > y) !== (p[j + 1] > y) && x < ((p[j] - p[i]) * (y - p[i + 1])) / (p[j + 1] - p[i + 1]) + p[i]) inside = !inside;
  return inside;
};
const waterBoxes = WATER.map((w) => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (let i = 0; i < w.pts.length; i += 2) { a = Math.min(a, w.pts[i]); c = Math.max(c, w.pts[i]); b = Math.min(b, w.pts[i + 1]); d = Math.max(d, w.pts[i + 1]); } return [a, b, c, d]; });
export const inWater = (x: number, y: number): boolean => WATER.some((w, i) => x > waterBoxes[i][0] && x < waterBoxes[i][2] && y > waterBoxes[i][1] && y < waterBoxes[i][3] && inPoly(w.pts, x, y));
/** True inside the citadel + moat + approach zone (|u|,|v| < r). */
export const inCitadelZone = (x: number, y: number, r = 292): boolean => { const [u, v] = localToCitadel(x, y); return Math.abs(u) < r && Math.abs(v) < r; };

// ---------- houses along the minor streets ----------
export interface House { x: number; y: number; w: number; h: number; a: number; roof: number; th: number; lit: boolean }
const buildHouses = (): House[] => {
  const out: House[] = [];
  ROADS.minor.forEach((p, ri) => {
    let carry = hash(ri, 3) * 14;
    for (let i = 0; i + 3 < p.length; i += 2) {
      const dx = p[i + 2] - p[i], dy = p[i + 3] - p[i + 1], len = Math.hypot(dx, dy);
      if (len < 1) continue;
      const nx = -dy / len, ny = dx / len, ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      for (let s = carry; s < len; s += 15 + hash(ri * 7 + i, s) * 14) {
        const px = p[i] + (dx * s) / len, py = p[i + 1] + (dy * s) / len, dist = Math.hypot(px, py);
        for (const side of [-1, 1]) {
          const id = ri * 131 + i * 7 + (side > 0 ? 1 : 0), key = hash(id, Math.round(s));
          if (key > 1.15 - dist / 2600 || inCitadelZone(px, py) ) continue;
          const w = 7 + hash(id, 5) * 7, h = 6 + hash(id, 6) * 5, off = 8.5 + h / 2 + hash(id, 7) * 4;
          const x = px + nx * side * off, y = py + ny * side * off;
          if (inWater(x, y) || inCitadelZone(x, y)) continue;
          out.push({ x, y, w, h, a: ang + (hash(id, 8) - 0.5) * 8, roof: Math.floor(hash(id, 9) * 4), th: 0.05 + 0.9 * hash(id, 10) * (0.6 + 0.4 * Math.min(1, dist / 500)), lit: hash(id, 11) < 0.35 });
        }
        carry = 0;
      }
      carry = Math.max(0, carry - len);
    }
  });
  return out;
};
export const HOUSES: House[] = buildHouses();

// ---------- trees ----------
export interface Tree { x: number; y: number; r: number; th: number; tone: number }
const buildTrees = (): Tree[] => {
  const out: Tree[] = [];
  for (let gx = DATA_BOX.x0 - 600; gx < DATA_BOX.x1 + 600; gx += 55)
    for (let gy = DATA_BOX.y0 - 600; gy < DATA_BOX.y1 + 600; gy += 55) {
      const id = gx * 13 + gy * 7, x = gx + hash(id, 1) * 55, y = gy + hash(id, 2) * 55;
      if (hash(id, 3) > 0.34 || inWater(x, y) || inCitadelZone(x, y, 262)) continue;
      out.push({ x, y, r: 5 + hash(id, 4) * 7, th: 0.04 + 0.9 * hash(id, 5), tone: Math.floor(hash(id, 6) * 3) });
    }
  // old trees inside the citadel (banyan, tamarind): the ground cover of the enclosure
  for (let i = 0; i < 90; i++) {
    const u = (hash(i, 21) - 0.5) * 400, v = (hash(i, 22) - 0.5) * 400, p = citadelToLocal(u, v);
    out.push({ x: p[0], y: p[1], r: 6 + hash(i, 23) * 8, th: 0.02 + 0.4 * hash(i, 24), tone: Math.floor(hash(i, 25) * 3) });
  }
  return out;
};
export const TREES: Tree[] = buildTrees();

// ---------- craters ----------
export interface Crater { x: number; y: number; r: number; th: number; ry: number; rot: number }
export const CRATER_COUNT = 1100;
const buildCraters = (): Crater[] => {
  const out: Crater[] = [];
  for (let i = 0; i < CRATER_COUNT; i++) {
    const pick = hash(i, 31);
    let x: number, y: number;
    if (pick < 0.5) { const p = citadelToLocal((hash(i, 32) - 0.5) * 500, (hash(i, 33) - 0.5) * 500); [x, y] = p; }           // inside the walls
    else if (pick < 0.78) { const a = hash(i, 34) * 6.283, d = 250 + hash(i, 35) * 450; x = CITADEL.cx + Math.cos(a) * d; y = CITADEL.cy + Math.sin(a) * d; } // the town around
    else { const a = hash(i, 36) * 6.283, d = 600 + hash(i, 37) * 1500; x = CITADEL.cx + Math.cos(a) * d; y = CITADEL.cy + Math.sin(a) * d; }                // fields
    if (inWater(x, y)) continue; // shells that fall in the river make splashes, not craters
    out.push({ x, y, r: 2.5 + Math.pow(hash(i, 38), 2) * 10, th: hash(i, 39), ry: 0.72 + hash(i, 40) * 0.25, rot: hash(i, 41) * 180 });
  }
  return out;
};
export const CRATERS: Crater[] = buildCraters();

// ---------- wall pieces ----------
export interface WallPiece { side: 0 | 1 | 2 | 3; i: number; ht: number }
export const WALL_PIECES_PER_SIDE = 24;
/** Each wall side (0 N, 1 E, 2 S, 3 W) is 24 pieces; a piece cracks at damage ~0.6*ht and breaches at damage ht. The east
 *  gate area (the part that survived in 1972) gets ht > 1 so it stays. */
export const WALL_PIECES: WallPiece[] = Array.from({ length: 4 * WALL_PIECES_PER_SIDE }, (_, n) => {
  const side = Math.floor(n / WALL_PIECES_PER_SIDE) as 0 | 1 | 2 | 3, i = n % WALL_PIECES_PER_SIDE;
  const near = side === 1 && Math.abs(i - 11.5) < 3.2;
  return { side, i, ht: near ? 1.4 : 0.28 + 0.8 * hash(n, 51) };
});
/** Damage state of a thing with threshold ht: 0 intact, 1 cracked, 2 broken. */
export const breakState = (damage: number, ht: number): 0 | 1 | 2 => (damage >= ht ? 2 : damage >= ht * 0.55 ? 1 : 0);
export const clamp01 = (v: number) => clamp(v, 0, 1);
