import React from 'react';
import { FONT } from '../../engine';
import { Camera } from '../../countryball/geo-camera';
import { citadelScreen, CITADEL } from '../../countryball/citadel-geometry';
import { clamp, easeOut } from '../../countryball/fx-math';
import { INK } from './chc-common';

// Drawings placed on the CitadelPlan through citadelScreen(): the wall outline (partial, for the "build it up" scenes),
// numbered gate markers, a travelling dot along the perimeter. `cam` is the shot's camera at this frame.

type P = [number, number];
const H = CITADEL.half;
/** Corners of the outer wall face in screen px (NW, NE, SE, SW, back to NW). */
export const squareCorners = (cam: Camera, grow = 0): P[] => {
  const h = H + grow;
  return [[-h, -h], [h, -h], [h, h], [-h, h], [-h, -h]].map(([u, v]) => citadelScreen(cam, u, v) as P);
};
/** Point at fraction u (0..1) around the square, starting at the NW corner, clockwise. */
export const squareAt = (cam: Camera, u: number, grow = 0): P => {
  const c = squareCorners(cam, grow), f = clamp(u) * 4, i = Math.min(3, Math.floor(f)), k = f - i;
  return [c[i][0] + (c[i + 1][0] - c[i][0]) * k, c[i][1] + (c[i + 1][1] - c[i][1]) * k];
};
const partial = (cam: Camera, u: number, grow: number): string => {
  const c = squareCorners(cam, grow), f = clamp(u) * 4, pts: P[] = [c[0]];
  for (let i = 0; i < 4 && f > i; i++) pts.push(f >= i + 1 ? c[i + 1] : squareAt(cam, u, grow));
  return pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
};

/** Wall outline drawn progressively (u 0..1). style 'earth' = dashed brown rampart, 'brick' = red brick band, 'glow' = bright tracing line. */
export const WallOutline: React.FC<{ cam: Camera; u: number; style?: 'earth' | 'brick' | 'glow'; width?: number; grow?: number }> = ({ cam, u, style = 'brick', width = 16, grow = 0 }) => {
  if (u <= 0.002) return null;
  const pts = partial(cam, u, grow);
  if (style === 'glow') return (
    <g>
      <polyline points={pts} fill="none" stroke="#7FE3FF" strokeWidth={width * 2.2} strokeLinejoin="round" strokeLinecap="round" opacity={0.28} />
      <polyline points={pts} fill="none" stroke="#E9FBFF" strokeWidth={width * 0.6} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
  const col = style === 'earth' ? '#8A6A3C' : '#B5573B';
  return (
    <g>
      <polyline points={pts} fill="none" stroke={INK} strokeWidth={width + 8} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={pts} fill="none" stroke={col} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={style === 'earth' ? '26 12' : undefined} />
      {style === 'brick' && <polyline points={pts} fill="none" stroke="#E9B89A" strokeWidth={width * 0.45} strokeLinejoin="round" strokeDasharray="10 7" opacity={0.85} />}
    </g>
  );
};

/** Four numbered gate markers (Bắc, Đông, Nam, Tây) popping one after another from frame `at`, `gap` frames apart. */
export const GateMarkers: React.FC<{ cam: Camera; t: number; at: number; gap?: number; r?: number }> = ({ cam, t, at, gap = 9, r = 26 }) => (
  <g>
    {([[0, -H], [H, 0], [0, H], [-H, 0]] as P[]).map(([u, v], i) => {
      const k = easeOut((t - at - i * gap) / 7);
      if (k <= 0.01) return null;
      const [x, y] = citadelScreen(cam, u, v), [lx, ly] = citadelScreen(cam, u * 1.55, v * 1.55);
      return (
        <g key={i} transform={`translate(${x},${y}) scale(${0.4 + 0.6 * k})`} opacity={k}>
          <circle r={r + 14 * (1 - k)} fill="#F2C230" stroke={INK} strokeWidth={5} />
          <text y={r * 0.38} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={r * 1.15} fill={INK}>{i + 1}</text>
          <text x={lx - x} y={ly - y + 10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#FFF" stroke="#0A121C" strokeWidth={7} paintOrder="stroke" strokeLinejoin="round">{['Cửa Bắc', 'Cửa Đông', 'Cửa Nam', 'Cửa Tây'][i]}</text>
        </g>
      );
    })}
  </g>
);

/** Dashed dimension arrow between two screen points with a label centred on it. */
export const DimLine: React.FC<{ a: P; b: P; label: string; k?: number; size?: number; color?: string; offset?: number }> = ({ a, b, label, k = 1, size = 40, color = '#FFE08A', offset = 0 }) => {
  if (k <= 0.01) return null;
  const e: P = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI, flip = Math.abs(ang) > 90;
  const mid: P = [(a[0] + e[0]) / 2, (a[1] + e[1]) / 2];
  return (
    <g>
      <line x1={a[0]} y1={a[1]} x2={e[0]} y2={e[1]} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <line x1={a[0]} y1={a[1]} x2={e[0]} y2={e[1]} stroke={color} strokeWidth={4} strokeLinecap="round" />
      {[a, e].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={9} fill={color} stroke={INK} strokeWidth={4} />)}
      {k > 0.85 && (
        <text transform={`translate(${mid[0]},${mid[1] + offset}) rotate(${flip ? ang + 180 : ang}) translate(0,-16)`} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size}
          fill="#FFF" stroke="#0A121C" strokeWidth={size * 0.2} paintOrder="stroke" strokeLinejoin="round">{label}</text>
      )}
    </g>
  );
};
