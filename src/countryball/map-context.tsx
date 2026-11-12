import React, { createContext, useContext } from 'react';
import { Camera, ScreenSize, project, screenOf } from './geo-camera';

// Shared state for everything drawn inside <GeoMap>: camera, night level, unique-id prefix and a lon/lat projector.
// Children (City, SeaLabel, Parallel, Ball placed by lon/lat...) call useGeo() instead of receiving props.

export interface GeoCtx {
  camera: Camera;
  /** 0 = day, 1 = full night. */
  night: number;
  /** unique SVG id prefix for this map instance */
  id: string;
  project: (lon: number, lat: number) => [number, number];
  /** screen size of this map (1920x1080, or 1080x1920 with a portrait camera): use it for culling / full-width lines */
  screen: ScreenSize;
}
const Ctx = createContext<GeoCtx | null>(null);

export const GeoProvider: React.FC<{ camera: Camera; night: number; id: string; children: React.ReactNode }> = ({ camera, night, id, children }) => {
  const value: GeoCtx = { camera, night, id, project: (lon, lat) => project(camera, lon, lat), screen: screenOf(camera) };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useGeo = (): GeoCtx => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useGeo must be used inside <GeoMap>');
  return c;
};

// ---- colour helpers (hex only) ----
const parse = (h: string): [number, number, number] => {
  const v = h.replace('#', '');
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};
export const mix = (a: string, b: string, k: number): string => {
  const A = parse(a), B = parse(b);
  return '#' + A.map((x, i) => Math.round(x + (B[i] - x) * k).toString(16).padStart(2, '0')).join('');
};
/** Day colour -> night colour: cooler (blue shift) and darker. */
export const nightTone = (c: string, night: number): string =>
  night <= 0 ? c : mix(mix(c, '#2F4166', 0.5 * night), '#04070E', 0.3 * night);

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** 0..1 ramp between two zooms (for fading labels/layers with the camera). */
export const ramp = (z: number, z0: number, z1: number) => clamp((z - z0) / (z1 - z0), 0, 1);
