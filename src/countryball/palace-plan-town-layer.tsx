import React from 'react';
import { hash } from './fx-math';
import { bboxOf, BUILDING, BUILDINGS, GREEN, GROUNDS, inPoly, LANDMARKS, localToPalace, ptsD, ROADS, WATER } from './palace-geometry';
import { tone } from './citadel-palette';

// The city around Dinh Độc Lập in local metres (OpenStreetMap, today's streets): ground, parks, water, buildings, streets with casing,
// and trees (street trees along the avenues, trees in the grounds, trees in the parks: seeded, placed once at module scope).
// Used by <PalacePlan/>; `view` = visible rectangle in metres, `k` = px per metre, `night` 0..1.

type V = [number, number, number, number];
type Item = { p: number[]; bb: V };
const wrap = (l: number[][]): Item[] => l.map((p) => ({ p, bb: bboxOf(p) }));
const seen = (v: V, bb: V, pad = 0) => bb[2] > v[0] - pad && bb[0] < v[2] + pad && bb[3] > v[1] - pad && bb[1] < v[3] + pad;

const GREEN_I = wrap(GREEN), WATER_I = wrap(WATER), BLD_I = wrap(BUILDINGS);
const ROAD_I = { major: wrap(ROADS.major), mid: wrap(ROADS.mid), minor: wrap(ROADS.minor), path: wrap(ROADS.path), garden: wrap(ROADS.garden) };
export const PAL = {
  ground: '#BDB49C', lawn: '#9DBB62', lawnDark: '#86A653', groundsFloor: '#A9BD73', roadCase: '#80775F', road: '#DDD6C0', roadMajor: '#EAE4CF', path: '#E8E1C6',
  water: '#4B83AD', bld: ['#A09076', '#948873', '#AC9C84'], bldEdge: '#5F5444', tree: ['#5B7A3C', '#4C6B34', '#6C8745'],
};

// ---------- trees ----------
interface Tree { x: number; y: number; r: number; c: number }
const TREES: Tree[] = [];
const addTree = (x: number, y: number, id: number, r0 = 3.2) => TREES.push({ x, y, r: r0 + hash(id, 2) * 2.6, c: Math.floor(hash(id, 3) * 3) });
const bldBox = bboxOf(BUILDING);
const onBuilding = (x: number, y: number) => x > bldBox[0] - 6 && x < bldBox[2] + 6 && y > bldBox[1] - 6 && y < bldBox[3] + 6;
(() => {
  // street trees: both sides of avenues and streets, every ~15 m, alternating sides
  (['major', 'mid'] as const).forEach((cls, ci) => ROADS[cls].forEach((p, ri) => {
    const off = ci === 0 ? 10.5 : 7;
    for (let i = 0; i + 3 < p.length; i += 2) {
      const dx = p[i + 2] - p[i], dy = p[i + 3] - p[i + 1], len = Math.hypot(dx, dy);
      if (len < 1 || Math.hypot(p[i], p[i + 1]) > 900) continue;
      for (let s = 3; s < len; s += 15 + hash(ri * 31 + i, s) * 6) {
        const id = ri * 977 + i * 13 + Math.round(s), side = hash(id, 1) < 0.5 ? -1 : 1;
        if (hash(id, 9) > (ci === 0 ? 0.85 : 0.6)) continue;
        const x = p[i] + (dx * s) / len - (dy / len) * off * side, y = p[i + 1] + (dy * s) / len + (dx / len) * off * side;
        if (!onBuilding(x, y)) addTree(x, y, id);
      }
    }
  }));
  // the grounds: a tree every ~12 m except the open lawn between the palace and the gate and the building itself
  const gb = bboxOf(GROUNDS);
  for (let gx = gb[0]; gx < gb[2]; gx += 12) for (let gy = gb[1]; gy < gb[3]; gy += 12) {
    const id = Math.round(gx * 7 + gy * 131), x = gx + hash(id, 1) * 12, y = gy + hash(id, 4) * 12, [f, s] = localToPalace(x, y);
    if (!inPoly(GROUNDS, x, y) || onBuilding(x, y) || (f > 30 && f < 150 && Math.abs(s) < 52) || (f < 80 && Math.abs(s) < 60 && f > -55) || hash(id, 5) > 0.62) continue;
    addTree(x, y, id, 4);
  }
  // parks outside the grounds
  GREEN_I.forEach((g, gi) => {
    if (inPoly(GROUNDS, g.p[0], g.p[1])) return;
    for (let gx = g.bb[0]; gx < g.bb[2]; gx += 11) for (let gy = g.bb[1]; gy < g.bb[3]; gy += 11) {
      const id = gi * 5003 + Math.round(gx * 3 + gy * 17), x = gx + hash(id, 1) * 11, y = gy + hash(id, 4) * 11;
      if (TREES.length < 4200 && hash(id, 6) < 0.45 && inPoly(g.p, x, y)) addTree(x, y, id, 3.6);
    }
  });
})();

/** Trees (street trees, the grounds, the parks): draw AFTER the grounds layer so the grounds' floor does not cover them. Hidden below ~0.12 px/m. */
export const PalaceTreeLayer: React.FC<{ view: V; k: number; night: number }> = ({ view, k, night }) => {
  if (k <= 0.12) return null;
  const treeD: string[] = ['', '', ''];
  TREES.forEach((t) => {
    if (t.x < view[0] - 10 || t.x > view[2] + 10 || t.y < view[1] - 10 || t.y > view[3] + 10) return;
    treeD[t.c] += `M${(t.x - t.r).toFixed(1)},${t.y.toFixed(1)}a${t.r.toFixed(1)},${t.r.toFixed(1)} 0 1,0 ${(2 * t.r).toFixed(1)},0a${t.r.toFixed(1)},${t.r.toFixed(1)} 0 1,0 ${(-2 * t.r).toFixed(1)},0Z`;
  });
  return <g>{treeD.map((d, i) => d && <path key={i} d={d} fill={tone(PAL.tree[i], night)} opacity={0.92} />)}</g>;
};

export const PalaceTownLayer: React.FC<{ id: string; view: V; k: number; night: number }> = ({ view, k, night }) => {
  const T = (c: string) => tone(c, night), lw = (m: number) => Math.max(m, 1.5 / k);
  const sel = (l: Item[], pad = 0) => l.filter((i) => seen(view, i.bb, pad));
  const roadsD = (cls: keyof typeof ROAD_I) => sel(ROAD_I[cls], 12).map((i) => ptsD(i.p)).join('');
  const blds = sel(BLD_I, 5), roofD: string[] = ['', '', ''];
  blds.forEach((b) => { roofD[Math.floor(hash(b.p[0] * 3 + b.p[1], 7) * 3)] += ptsD(b.p, true); });
  const pathD = k > 0.5 ? roadsD('path') : '';
  return (
    <g>
      <rect x={view[0] - 60} y={view[1] - 60} width={view[2] - view[0] + 120} height={view[3] - view[1] + 120} fill={T(PAL.ground)} />
      {sel(GREEN_I).map((g, i) => <path key={`g${i}`} d={ptsD(g.p, true)} fill={T(i % 2 ? PAL.lawnDark : PAL.lawn)} />)}
      {sel(WATER_I).map((g, i) => <path key={`w${i}`} d={ptsD(g.p, true)} fill={T(PAL.water)} stroke={T('#2D5C82')} strokeWidth={lw(1)} />)}
      {([['minor', 5], ['mid', 9], ['major', 15]] as const).map(([cls, w]) => {
        const d = roadsD(cls);
        return <g key={cls}><path d={d} fill="none" stroke={T(PAL.roadCase)} strokeWidth={lw(w + 2.4)} strokeLinecap="round" strokeLinejoin="round" /><path d={d} fill="none" stroke={T(cls === 'major' ? PAL.roadMajor : PAL.road)} strokeWidth={lw(w)} strokeLinecap="round" strokeLinejoin="round" /></g>;
      })}
      {pathD && <path d={pathD} fill="none" stroke={T(PAL.path)} strokeWidth={lw(1.6)} strokeLinecap="round" opacity={0.8} />}
      {roofD.map((d, i) => d && <path key={`b${i}`} d={d} fill={T(PAL.bld[i])} stroke={T(PAL.bldEdge)} strokeWidth={lw(0.5)} strokeLinejoin="round" />)}
      {LANDMARKS.filter((l) => seen(view, bboxOf(l.pts), 5)).map((l) => <path key={l.name} d={ptsD(l.pts, true)} fill={T(l.name.includes('Đức Bà') ? '#B5573D' : l.name.includes('Bưu') ? '#E2C37E' : '#C9B28F')} stroke={T(PAL.bldEdge)} strokeWidth={lw(0.7)} strokeLinejoin="round" />)}
    </g>
  );
};
