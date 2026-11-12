import React from 'react';
import { FONT } from '../../engine/fonts';
import { useGeo } from '../../countryball/map-context';
import { prog } from '../../countryball/fx-math';
import { pathAtDist, samplePath } from '../../countryball/fx-flight-path';

// Chapter A: lon/lat drawing helpers for the Quảng Trị map (inside <GeoMap> children, they follow the moving camera).
export type LL = [number, number];

/** Road: lon/lat polyline that GROWS along its length (k 0..1), light line with dark casing. Dashes crawl when `crawl`. */
export const GeoRoad: React.FC<{ pts: LL[]; k: number; color?: string; w?: number; crawl?: number; dot?: string }> = ({ pts, k, color = '#FFF1C2', w = 9, crawl, dot = '#E0483C' }) => {
  const { project } = useGeo();
  if (k <= 0.005) return null;
  const sp = samplePath(pts.map(([lo, la]) => project(lo, la)), 10), n = Math.max(2, Math.ceil(sp.p.length * Math.min(1, k)));
  const d = sp.p.slice(0, n).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  return (
    <g>
      <path d={d} fill="none" stroke="#0B0F16" strokeWidth={w + 8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      {crawl !== undefined && Array.from({ length: 6 }, (_, i) => {
        const q = pathAtDist(sp, ((i / 6 + crawl / 260) % 1) * sp.total);
        return <circle key={i} cx={q.x} cy={q.y} r={w * 0.62} fill={dot} stroke="#0B0F16" strokeWidth={3} />;
      })}
    </g>
  );
};

/** Pill label anchored at a lon/lat (offset in px), appears at frame a. */
export const GeoPill: React.FC<{ at: LL; text: string; t: number; a: number; dx?: number; dy?: number; color?: string; size?: number }> = ({ at, text, t, a, dx = 0, dy = 0, color = '#E2B95A', size = 30 }) => {
  const { project } = useGeo(), u = prog(t, a, a + 8);
  if (u <= 0) return null;
  const [x, y] = project(at[0], at[1]), w = text.length * size * 0.6 + 40;
  return (
    <g transform={`translate(${x + dx},${y + dy})`} opacity={u}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.55} rx={size * 0.78} fill="#15181F" fillOpacity={0.92} stroke={color} strokeWidth={3.5} />
      <text textAnchor="middle" y={size * 0.1} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#F4F4F4">{text}</text>
    </g>
  );
};

/** Little mountain range (triangles + snowless ridges) around a lon/lat, `n` peaks. */
export const Mountains: React.FC<{ at: LL; n?: number; s?: number; k?: number }> = ({ at, n = 6, s = 80, k = 1 }) => {
  const { project } = useGeo(), [x, y] = project(at[0], at[1]);
  if (k <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y})`} opacity={k}>
      {Array.from({ length: n }, (_, i) => {
        const px = (i - (n - 1) / 2) * s * 0.9, py = (i % 2) * s * 0.45 - s * 0.2, h = s * (0.8 + 0.35 * ((i * 7) % 3) / 2);
        return (
          <g key={i} transform={`translate(${px},${py})`}>
            <polygon points={`${-s * 0.62},0 0,${-h} ${s * 0.62},0`} fill="#6E7B5C" stroke="#151515" strokeWidth={5} strokeLinejoin="round" />
            <polygon points={`0,${-h} ${s * 0.62},0 ${s * 0.12},0`} fill="#56624A" />
          </g>
        );
      })}
    </g>
  );
};
