import React from 'react';
import { rnd } from '../anim';
import { ST, proj, px, poly, mixHex, Ctx } from '../street-geom';
import type { V3 } from '../room';

// The street's ground: asphalt, kerbs, tiled sidewalks, lane dashes and zebra crossings, patches and cracks, the
// sun's (or the lamps') reflection down the middle, and weeds (`grass`) in the cracks. All drawn as projected quads.

const ROAD = '#3E3B4A';
const WALK = '#5C586A';
const Z_NEAR = 1.4;
const Z_FAR = 400;
export const ZEBRAS: [number, number][] = [[9.4, 11.7], [33, 35.2]];

/** A flat circle on the ground at (X, Z), radius r metres: an ellipse (manhole, puddle, stain). */
const GroundDisc: React.FC<{ X: number; Z: number; r: number; fill: string; o?: number; y?: number }> = ({ X, Z, r, fill, o = 1, y = 0 }) => {
  const p = proj(X, y, Z);
  const rx = r * px(Z);
  return <ellipse cx={p.x} cy={p.y} rx={rx} ry={rx * (ST.camH / Z)} fill={fill} opacity={o} />;
};
const strip = (side: number, x0: number, x1: number, y: number, z0: number, z1: number): V3[] => [[side * x0, y, z0], [side * x1, y, z0], [side * x1, y, z1], [side * x0, y, z1]];

export const Ground: React.FC<{ id: string; c: Ctx }> = ({ id, c }) => {
  const F = (col: string, Z: number) => c.F(col, Z);
  const road = c.night ? '#191C34' : ROAD;
  const walk = c.night ? '#232644' : WALK;
  const gy = (Z: number) => proj(0, 0, Z).y;
  const stops = (col: string) => [[470, 0.88], [500, 0.62], [560, 0.38], [680, 0.16], [900, 0.04], [1100, 0]].map(([y, k]) => <stop key={y} offset={`${((y - 470) / 630) * 100}%`} stopColor={mixHex(col, c.fogC, k)} />);
  const out: React.ReactNode[] = [];
  // tiles: a checker of two close tones, a few stained or cracked ones, joints
  for (const side of [-1, 1]) {
    for (let r = 0, z = 1.6; z < 34; r++, z += 0.8) {
      for (let j = 0; j < 3; j++) {
        const q = rnd(side * 7 + 3, r * 5 + j);
        const tone = (r + j) % 2 ? 0.05 : 0;
        const col = q < 0.1 ? mixHex(walk, '#000000', 0.25) : q > 0.93 ? mixHex(walk, '#9A5A4A', 0.25) : mixHex(walk, '#FFFFFF', tone);
        out.push(<polygon key={`t${side}${r}${j}`} points={poly(strip(side, 4.35 + j, 5.35 + j, ST.kerb, z, z + 0.8))} fill={F(col, z + 0.4)} />);
      }
      const a = proj(side * 4.35, ST.kerb, z);
      const b = proj(side * 7.2, ST.kerb, z);
      out.push(<path key={`tj${side}${r}`} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#14101C" strokeWidth={Math.max(0.6, px(z) * 0.014)} opacity={0.35} />);
    }
    for (let j = 1; j < 3; j++) {
      const a = proj(side * (4.35 + j), ST.kerb, 1.6);
      const b = proj(side * (4.35 + j), ST.kerb, Z_FAR);
      out.push(<path key={`tl${side}${j}`} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#14101C" strokeWidth={1.2} opacity={0.28} />);
    }
  }
  // road: patches, cracks, stains, tyre marks
  const patches = Array.from({ length: 14 }).map((_, i) => {
    const z = 3 + rnd(41, i) * 40;
    const X = -3.6 + rnd(42, i) * 7.2;
    return <polygon key={`pa${i}`} points={poly(strip(1, X, X + 1.1 + rnd(43, i) * 1.4, 0, z, z + 1.4 + rnd(44, i) * 2))} fill="#000" opacity={0.16 + rnd(45, i) * 0.1} />;
  });
  const cracks = Array.from({ length: 9 }).map((_, i) => {
    const z = 4 + rnd(51, i) * 30;
    const X = -3.5 + rnd(52, i) * 7;
    let d = '';
    for (let m = 0; m < 5; m++) { const p = proj(X + (rnd(53 + m, i) - 0.5) * 1.1, 0, z + m * 0.55); d += `${m ? 'L' : 'M'} ${p.x} ${p.y} `; }
    return <path key={`cr${i}`} d={d} stroke="#14101C" strokeWidth={Math.max(1, px(z) * 0.02)} fill="none" opacity={0.5} />;
  });
  // lane dashes (white), clear of the zebras
  const dashes: React.ReactNode[] = [];
  for (let z = 2; z < 130; z += 5.5) {
    if (ZEBRAS.some(([a, b]) => z + 2.2 > a - 1 && z < b + 0.5)) continue;
    dashes.push(<polygon key={`d${z}`} points={poly(strip(1, -0.07, 0.07, 0, z, z + 2.2))} fill={F('#D8D4C8', z)} />);
  }
  const zebra = ZEBRAS.map(([a, b], zi) => Array.from({ length: 9 }).map((_, i) => <polygon key={`z${zi}${i}`} points={poly(strip(1, -4.0 + i * 0.9, -3.5 + i * 0.9, 0, a, b))} fill={F('#D8D4C8', a)} opacity={0.9} />));
  const stopLine = <polygon points={poly(strip(1, 0.2, 4.0, 0, 8.7, 9.0))} fill={F('#D8D4C8', 8.8)} opacity={0.85} />;
  const edges = [-1, 1].map((side) => <polygon key={`e${side}`} points={poly(strip(side, 3.95, 4.05, 0, 2, 120))} fill={F('#D8D4C8', 20)} opacity={0.55} />);
  const kerbs = [-1, 1].map((side) => (
    <g key={`k${side}`}>
      <polygon points={poly([[side * 4.2, 0, Z_NEAR], [side * 4.2, ST.kerb, Z_NEAR], [side * 4.2, ST.kerb, Z_FAR], [side * 4.2, 0, Z_FAR]])} fill={c.night ? '#2E3254' : '#7A7688'} />
      <path d={`M ${proj(side * 4.2, ST.kerb, Z_NEAR).x} ${proj(side * 4.2, ST.kerb, Z_NEAR).y} L ${proj(side * 4.2, ST.kerb, Z_FAR).x} ${proj(side * 4.2, ST.kerb, Z_FAR).y}`} stroke="#FFB46A" strokeWidth={2} opacity={0.5} />
    </g>
  ));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}road`} x1="0" y1="470" x2="0" y2="1100" gradientUnits="userSpaceOnUse">{stops(road)}</linearGradient>
        <linearGradient id={`${id}walk`} x1="0" y1="470" x2="0" y2="1100" gradientUnits="userSpaceOnUse">{stops(walk)}</linearGradient>
        <linearGradient id={`${id}refl`} x1="0" y1="476" x2="0" y2="960" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.night ? '#7A8CFF' : '#FFB46A'} stopOpacity={0.55} />
          <stop offset="60%" stopColor={c.night ? '#7A8CFF' : '#FF9A5A'} stopOpacity={0.12} />
          <stop offset="100%" stopColor="#FF9A5A" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={poly([[-4.2, 0, Z_NEAR], [4.2, 0, Z_NEAR], [4.2, 0, Z_FAR], [-4.2, 0, Z_FAR]])} fill={`url(#${id}road)`} />
      <polygon points={poly([[-7.4, ST.kerb, Z_NEAR], [-4.2, ST.kerb, Z_NEAR], [-4.2, ST.kerb, Z_FAR], [-7.4, ST.kerb, Z_FAR]])} fill={`url(#${id}walk)`} />
      <polygon points={poly([[4.2, ST.kerb, Z_NEAR], [7.4, ST.kerb, Z_NEAR], [7.4, ST.kerb, Z_FAR], [4.2, ST.kerb, Z_FAR]])} fill={`url(#${id}walk)`} />
      {out}
      {kerbs}
      {patches}
      {cracks}
      {edges}
      {zebra}
      {stopLine}
      {dashes}
      <GroundDisc X={-1.3} Z={6.2} r={0.4} fill="#2A2733" />
      <GroundDisc X={-1.3} Z={6.2} r={0.3} fill="#4A4658" o={0.7} />
      <GroundDisc X={1.9} Z={15.5} r={0.4} fill="#2A2733" />
      <GroundDisc X={-2.2} Z={9} r={1.0} fill="#14101C" o={0.2} />
      <GroundDisc X={2.6} Z={13} r={0.9} fill={c.night ? '#4A5AA0' : '#F0A070'} o={0.22} />
      {/* the light on the wet-dark asphalt: the sun's path (dusk) or the lamps' (night) */}
      <polygon points={poly([[-1.4, 0, 3], [1.4, 0, 3], [0.15, 0, 140], [-0.15, 0, 140]])} fill={`url(#${id}refl)`} style={{ mixBlendMode: 'screen' }} />
    </g>
  );
};

/**
 * Weeds and grass in the pavement cracks, along the kerbs and walls, climbing up from the tile joints. `grass` 0..1:
 * more of them, taller, then moss patches. A pure function of the amount (they are seeded, never random).
 */
export const Weeds: React.FC<{ c: Ctx; grass: number }> = ({ c, grass }) => {
  if (grass <= 0.01) return null;
  const out: React.ReactNode[] = [];
  // creeping lawn along the kerbs and the house walls: green strips that widen with grass
  for (const side of [-1, 1]) {
    for (let z = 2; z < 46; z += 1.6) {
      if (rnd(95 + side, z) > grass * 1.1) continue;
      const w = (0.25 + 0.7 * rnd(96, z)) * grass;
      for (const [x0, x1] of [[4.35, 4.35 + w], [7.2 - w, 7.2]]) {
        const a = proj(side * x0, ST.kerb, z);
        const b = proj(side * x1, ST.kerb, z);
        const a2 = proj(side * x0, ST.kerb, z + 1.7);
        const b2 = proj(side * x1, ST.kerb, z + 1.7);
        out.push(<polygon key={`gs${side}${z}${x0}`} points={`${a.x},${a.y} ${b.x},${b.y} ${b2.x},${b2.y} ${a2.x},${a2.y}`} fill={c.F('#3E5E3A', z)} opacity={0.85} />);
      }
    }
  }
  const cols = c.night ? ['#5E9A7A', '#4A8A6E', '#7ABA8A', '#68A880'] : ['#4C7A4A', '#3A5E3C', '#6A9A52', '#5A8A46'];
  for (let i = 0; i < 520; i++) {
    if (rnd(71, i) > grass * 1.05) continue;
    const z = 2.4 + Math.pow(rnd(72, i), 1.5) * 52;
    const spots = [-4.35, -4.05, -5.35, -6.35, -7.05, 4.05, 4.35, 5.35, 6.35, 7.05, -2.6, 2.4, -0.2, 3.4];
    const X = spots[Math.floor(rnd(73, i) * spots.length)] + (rnd(74, i) - 0.5) * 0.3;
    const sidewalk = Math.abs(X) > 4.2;
    const b = proj(X, sidewalk ? ST.kerb : 0, z);
    const k = px(z);
    const hgt = (0.16 + 0.6 * rnd(75, i)) * (0.5 + 1.1 * grass) * k;
    if (sidewalk && rnd(76, i) > 0.6 && grass > 0.45) out.push(<ellipse key={`m${i}`} cx={b.x} cy={b.y} rx={k * 0.5} ry={k * 0.5 * (ST.camH / z)} fill={c.F('#3E5E3A', z)} opacity={0.55} />);
    let d = '';
    for (let m = 0; m < 9; m++) {
      const lean = (rnd(77 + m, i) - 0.5) * hgt * 0.9;
      d += `M ${b.x + (m - 4) * k * 0.02} ${b.y} Q ${b.x + lean * 0.4} ${b.y - hgt * 0.65} ${b.x + lean} ${b.y - hgt * (0.7 + 0.3 * rnd(78 + m, i))} `;
    }
    out.push(<path key={`w${i}`} d={d} stroke={c.F(cols[i % 4], z)} strokeWidth={Math.max(1.2, k * 0.035)} strokeLinecap="round" fill="none" />);
  }
  return <g>{out}</g>;
};
