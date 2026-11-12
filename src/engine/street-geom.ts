import { clamp } from './anim';
import type { Pt, V3 } from './room';

// Street geometry: a real (if simple) pinhole camera looking straight down a street, so every set part and prop
// shares one perspective. World units are METRES: X across (negative = screen-left), Y up from the road, Z away from
// the camera. A point projects to screen with proj(X, Y, Z). Pure functions, no React.

export const ST = {
  vx: 960, // vanishing point (screen)
  vy: 470,
  f: 500, // focal length in px: a thing 1 m big at Z metres is f / Z px
  camH: 3, // camera height above the road (a raised, "establishing" eye)
  road: 4.2, // road half-width: the kerbs are at X = +-4.2
  wall: 7.2, // the shophouse fronts are at X = +-7.2 (sidewalks between)
  kerb: 0.15, // kerb height
};
const BODY_H = 378; // the rig's height at scale 1 (head top to soles)
const LEG = 140; // rig LEG_LEN


/** Project a world point (X across, Y up, Z away) to the screen. */
export const proj = (X: number, Y: number, Z: number): Pt => ({ x: ST.vx + (X * ST.f) / Z, y: ST.vy + ((ST.camH - Y) * ST.f) / Z });
/** Pixels per metre at depth Z. */
export const px = (Z: number) => ST.f / Z;
/** Scale for the street props (Motorbike, Bus...): they are drawn at 100 px per metre, so s = px(Z) / 100. */
export const propScale = (Z: number) => ST.f / Z / 100;
/** Screen y of the road at depth Z. */
export const groundY = (Z: number) => ST.vy + (ST.camH * ST.f) / Z;
/** An SVG points string for a polygon given in world points. */
export const poly = (a: V3[]) => a.map(([X, Y, Z]) => { const p = proj(X, Y, Z); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');

/**
 * Place a character standing on the road or sidewalk at lateral position X (metres, 0 = road centre, +-4.2 kerbs,
 * +-5.7 mid sidewalk) and depth Z (metres, ~3 near, 100 far). Returns the hip point and scale for <Hero>. `k` is the
 * character's height in metres (1.6 default). Pass the same `low` you gave <Street> (its screen shift) so the feet
 * keep to the ground; add `sidewalk: true` for a character on the raised sidewalk (kerb height).
 */
export const streetStand = (X: number, Z: number, o: { k?: number; low?: number; sidewalk?: boolean } = {}) => {
  const { k = 1.6, low = 0, sidewalk = false } = o;
  const scale = (k * ST.f) / Z / BODY_H;
  const g = proj(X, sidewalk ? ST.kerb : 0, Z);
  return { x: g.x, y: g.y + low - LEG * scale, scale };
};

// ---------- colour helpers: atmospheric fog and the night tone ----------
const h2 = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
export const mixHex = (a: string, b: string, k: number) => {
  const A = h2(a);
  const B = h2(b);
  const m = clamp(k);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * m).toString(16).padStart(2, '0')).join('');
};
/** How foggy depth Z is, 0 (near) to ~0.85 (the end of the street). */
export const fogK = (Z: number) => 0.85 * Math.pow(clamp((Z - 7) / 80), 0.75);
/** Is a light still on? It goes out when the blackout passes its private threshold q (0..1). */
export const lightOn = (blackout: number, q: number) => !(blackout > q);

/** Per-draw context for the set's parts: colours already toned for dusk or night, and the blackout. */
export type Ctx = {
  t: number;
  night: boolean;
  black: number;
  red: number;
  grass: number;
  fogC: string;
  /** tone a base colour for this depth: night shift, then fog */
  F: (c: string, Z: number) => string;
  lights: LightSpot[];
};
export type LightSpot = { x: number; y: number; r: number; kind?: 'warm' | 'cool' | 'red'; o?: number; veil?: boolean };
export const makeCtx = (t: number, night: boolean, black: number, red: number, grass: number): Ctx => {
  const fogC = night ? '#1F2656' : '#9A6A86';
  return {
    t, night, black, red, grass, fogC, lights: [],
    F: (c, Z) => mixHex(night ? mixHex(c, '#0E1332', 0.55) : c, fogC, fogK(Z)),
  };
};
