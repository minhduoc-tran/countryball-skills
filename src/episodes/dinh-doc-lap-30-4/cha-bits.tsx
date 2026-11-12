import React from 'react';
import { FONT } from '../../engine/fonts';
import { FrontArrow } from '../../countryball/ground-front-arrows';
import { useGeo } from '../../countryball/map-context';
import { Ball } from '../../countryball/countryball';
import { breathe, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { prog, Pt } from '../../countryball/fx-math';

// Chapter A small helpers: lon/lat placement inside <GeoMap>, geo-anchored arrow, airliner icon, the four-party Paris table, dark card backdrop.

export type LL = [number, number];

/** Put children at a lon/lat (inside <GeoMap>); px offsets stay constant at any zoom. */
export const At: React.FC<{ lon: number; lat: number; dx?: number; dy?: number; children: React.ReactNode }> = ({ lon, lat, dx = 0, dy = 0, children }) => {
  const [x, y] = useGeo().project(lon, lat);
  return <g transform={`translate(${x + dx},${y + dy})`}>{children}</g>;
};

/** FrontArrow along a lon/lat route (follows the moving camera). */
export const GeoArrow: React.FC<{ id: string; t: number; t0: number; route: LL[]; dur?: number; width?: number; color: string; label?: string }> = ({ id, t, t0, route, dur = 50, width = 40, color, label }) => {
  const { project } = useGeo();
  const pts = route.map(([lo, la]) => project(lo, la) as Pt);
  return <FrontArrow id={id} t={t} t0={t0} points={pts} dur={dur} width={width} color={color} label={label} />;
};

/** Dashed neutral line between lon/lat points (draws itself from frame t0 over `dur` frames). */
export const GeoDash: React.FC<{ t: number; t0: number; route: LL[]; dur?: number }> = ({ t, t0, route, dur = 30 }) => {
  const { project } = useGeo(), u = prog(t, t0, t0 + dur);
  if (u <= 0) return null;
  const p = route.map(([lo, la]) => project(lo, la)), a = p[0], b = p[p.length - 1];
  return <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * u} y2={a[1] + (b[1] - a[1]) * u} stroke="#FFFFFF" strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" opacity={0.9} />;
};

/** lon/lat linear interpolation along a polyline (u 0..1). */
export const lonLatAt = (route: LL[], u: number): LL => {
  const n = route.length - 1, k = Math.min(n - 1e-6, Math.max(0, u) * n), i = Math.floor(k), f = k - i;
  return [route[i][0] + (route[i + 1][0] - route[i][0]) * f, route[i][1] + (route[i + 1][1] - route[i][1]) * f];
};

/** Simple airliner silhouette (side view, nose right), ~300 px long at s = 1; rotate for climb. */
export const PlaneIcon: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string }> = ({ x, y, s = 1, rot = 0, color = '#F4F1E8' }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} strokeLinejoin="round" stroke="#151515" strokeWidth={5}>
    <path d="M-150,-4 Q-150,-26 -120,-26 L96,-26 Q150,-24 166,2 Q150,18 96,18 L-120,18 Q-150,18 -150,-4 Z" fill={color} />
    <path d="M-150,-4 L-176,-62 L-140,-62 L-96,-24 Z" fill="#C8322A" />
    <path d="M-20,-4 L-84,64 L-52,64 L40,-2 Z" fill="#D9D4C4" />
    <path d="M-30,-22 L-92,-58 L-70,-58 L10,-24 Z" fill="#D9D4C4" />
    {[-90, -60, -30, 0, 30, 60, 90].map((px) => <circle key={px} cx={px} cy={-8} r={5} fill="#5E7FA0" strokeWidth={2.5} />)}
    <ellipse cx={20} cy={30} rx={20} ry={10} fill="#6E6E74" />
  </g>
);

/** Dark navy "card" backdrop with a soft vignette (for explainer scenes without a map). */
export const CardBg: React.FC<{ id: string; a?: string; b?: string }> = ({ id, a = '#1C2A44', b = '#0A101C' }) => (
  <g>
    <defs><radialGradient id={`${id}-bg`} cx="0.5" cy="0.45" r="0.85"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id}-bg)`} />
  </g>
);

export const PARTIES = [
  { key: 'dr', flag: 'VNM', x: 330, name: ['VIỆT NAM DÂN CHỦ', 'CỘNG HÒA'] },
  { key: 'prg', flag: 'PRG', x: 745, name: ['CHÍNH PHỦ CÁCH MẠNG', 'LÂM THỜI CHMNVN'] },
  { key: 'usa', flag: 'USA', x: 1175, name: ['MỸ'] },
  { key: 'rvn', flag: 'RVN', x: 1590, name: ['VIỆT NAM', 'CỘNG HÒA'] },
] as const;

/** The Paris table with four chairs: party i sits down at frame `at[i]` (hop in); 0 = none yet. `show` = which already sit (instantly). */
export const FourTable: React.FC<{ id: string; t: number; at: (number | null)[]; y?: number; r?: number; names?: boolean }> = ({ id, t, at, y = 560, r = 112, names = true }) => (
  <g>
    <ellipse cx={960} cy={y + r * 1.15} rx={880} ry={r * 0.95} fill="#5A3E2A" stroke="#111" strokeWidth={7} />
    <ellipse cx={960} cy={y + r * 1.06} rx={850} ry={r * 0.78} fill="#7E5A3E" />
    {PARTIES.map((p, i) => {
      const a = at[i], seated = a !== null && t >= a;
      const u = a === null ? 0 : prog(t, a, a + 10);
      return (
        <g key={p.key}>
          {!seated && <rect x={p.x - r * 0.8} y={y - r * 0.2} width={r * 1.6} height={r * 1.4} rx={26} fill="#2A3346" stroke="#55627C" strokeWidth={5} strokeDasharray="14 10" />}
          {seated && (
            <g>
              <Ball id={`${id}${p.key}`} x={p.x} y={y} r={r} flag={p.flag} eyes="determined" tilt={i < 2 ? 4 : -4}
                motion={mixMotion(breathe(t, 64 + i * 3, 0.03, i * 9), hopOnce(t, a as number, 16, 54))} t={t} />
              {names && p.name.map((ln, k) => (
                <text key={k} x={p.x} y={y + r * 1.75 + k * 40 + 20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={p.name.length === 1 ? 54 : 32} fill="#F4F4F4"
                  stroke="#0A101C" strokeWidth={6} paintOrder="stroke" opacity={u}>{ln}</text>
              ))}
            </g>
          )}
        </g>
      );
    })}
  </g>
);
