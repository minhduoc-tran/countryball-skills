import React from 'react';
import { hash } from './fx-math';
import { DATA_BOX, HOUSES, pointsD, RESIDENTIAL, ROADS, WATER, WATERWAYS } from './citadel-geometry';
import { inView, PAL, tone, View } from './citadel-palette';

// The town around the citadel in local metres: fields, town tint, Thạch Hãn + canals (with flood), streets, houses.
// Streets, river, canals come from OpenStreetMap (today's layout: the 1972 street grid was larger and is not on any map
// we can use, so this is a stand-in); houses and rice fields are seeded fillers placed along the streets.

type P = { id: string; view: View; k: number; night: number; damage: number; flood: number };

const PATCHES = Array.from({ length: 360 }, (_, i) => ({
  x: DATA_BOX.x0 - 500 + hash(i, 1) * (DATA_BOX.x1 - DATA_BOX.x0 + 1000), y: DATA_BOX.y0 - 500 + hash(i, 2) * (DATA_BOX.y1 - DATA_BOX.y0 + 1000),
  w: 70 + hash(i, 3) * 230, h: 50 + hash(i, 4) * 150, c: Math.floor(hash(i, 5) * 3),
}));
const WATERWAY_W: Record<string, number> = { river: 22, canal: 8, stream: 4 };

/** Ground, fields, river, canals, streets, houses. Order matters: the caller draws the citadel and trees after it. */
export const CitadelTownLayer: React.FC<P> = ({ id, view, k, night, damage, flood }) => {
  const T = (c: string) => tone(c, night), scorch = Math.min(1, damage * 1.1);
  const lw = (m: number) => Math.max(m, 1.6 / k); // never thinner than ~1.6 px
  const houses = k > 0.1 ? HOUSES.filter((h) => inView(view, h.x, h.y, 20)) : [];
  const roofD: string[] = ['', '', '', ''], rubbleD: string[] = [], litD: string[] = [];
  for (const h of houses) {
    const a = (h.a * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), hw = h.w / 2, hh = h.h / 2;
    const q = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([x, y]) => `${(h.x + x * c - y * s).toFixed(1)},${(h.y + x * s + y * c).toFixed(1)}`);
    if (damage >= h.th) rubbleD.push(`M${q[0]}L${q[1]}L${(h.x + hw * 0.3 * c).toFixed(1)},${(h.y + hh * 0.5).toFixed(1)}L${q[2]}L${q[3]}Z`);
    else { roofD[h.roof] += `M${q.join('L')}Z`; if (night > 0.3 && h.lit) litD.push(`M${(h.x - 1.6).toFixed(1)},${(h.y - 1.6).toFixed(1)}h3.2v3.2h-3.2z`); }
  }
  const floodW = flood * 190, floodGrow = flood > 0.02;
  return (
    <g>
      <rect x={view[0] - 80} y={view[1] - 80} width={view[2] - view[0] + 160} height={view[3] - view[1] + 160} fill={T(PAL.ground)} />
      {PATCHES.filter((p) => inView(view, p.x, p.y, 260)).map((p, i) => <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={14} fill={T([PAL.paddyA, PAL.paddyB, PAL.paddyC][p.c])} opacity={0.75} />)}
      {RESIDENTIAL.map((r, i) => <path key={i} d={pointsD(r, true)} fill={T(PAL.town)} opacity={0.7} />)}
      {scorch > 0.05 && <><defs><radialGradient id={`${id}-scorch`}><stop offset="0" stopColor={T(PAL.burnt)} stopOpacity={0.55} /><stop offset="0.6" stopColor={T(PAL.burnt)} stopOpacity={0.3} /><stop offset="1" stopColor={T(PAL.burnt)} stopOpacity={0} /></radialGradient></defs><ellipse cx={0} cy={0} rx={760} ry={620} fill={`url(#${id}-scorch)`} opacity={scorch} /></>}
      {/* water: sandy bank, river, canals; flood = the water spreading over the low ground */}
      {floodGrow && WATER.map((w, i) => <path key={`f${i}`} d={pointsD(w.pts, true)} fill={T(PAL.flood)} stroke={T(PAL.flood)} strokeWidth={floodW * 2} strokeLinejoin="round" opacity={0.55} />)}
      {floodGrow && WATER.map((w, i) => <path key={`g${i}`} d={pointsD(w.pts, true)} fill={T(PAL.floodDeep)} stroke={T(PAL.floodDeep)} strokeWidth={floodW} strokeLinejoin="round" opacity={0.8} />)}
      {WATER.map((w, i) => <path key={`b${i}`} d={pointsD(w.pts, true)} fill="none" stroke={T(PAL.bank)} strokeWidth={lw(10)} strokeLinejoin="round" />)}
      {WATERWAYS.map((w, i) => <path key={`w${i}`} d={pointsD(w.pts)} fill="none" stroke={T(PAL.water)} strokeWidth={lw((WATERWAY_W[w.kind] ?? 6) * (w.name ? 1.2 : 1) * (1 + flood * 0.8))} strokeLinecap="round" strokeLinejoin="round" />)}
      {WATER.map((w, i) => <path key={`r${i}`} d={pointsD(w.pts, true)} fill={T(PAL.water)} stroke={T(PAL.waterEdge)} strokeWidth={lw(2.5)} strokeLinejoin="round" />)}
      {/* streets: casing first so crossings merge */}
      {([['minor', 7, 'roadFill'], ['mid', 11, 'roadFill'], ['major', 16, 'roadMajor']] as const).map(([cls, w, col]) => (
        <g key={cls}>
          <path d={ROADS[cls].filter((p) => p.length > 3).map((p) => pointsD(p)).join('')} fill="none" stroke={T(PAL.roadCase)} strokeWidth={lw(w + 4)} strokeLinecap="round" strokeLinejoin="round" />
          <path d={ROADS[cls].filter((p) => p.length > 3).map((p) => pointsD(p)).join('')} fill="none" stroke={T(PAL[col])} strokeWidth={lw(w)} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {roofD.map((d, i) => d && <path key={`h${i}`} d={d} fill={T(PAL.roofs[i])} stroke={T('#3A2A22')} strokeWidth={Math.max(0.5, Math.min(0.7, 0.5 / k))} strokeLinejoin="round" />)}
      {rubbleD.length > 0 && <path d={rubbleD.join('')} fill={T(PAL.rubble)} stroke={T('#2E241C')} strokeWidth={lw(0.6)} />}
      {litD.length > 0 && <path d={litD.join('')} fill="#FFD27A" opacity={0.9 * Math.min(1, night)} />}
    </g>
  );
};
