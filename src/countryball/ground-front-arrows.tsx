import React from 'react';
import { FONT } from '../engine/fonts';
import { clamp, easeOut, lerp, Pt, prog } from './fx-math';
import { pathAtDist, samplePath } from './fx-flight-path';

// History-channel map graphics for ground fronts (screen px, t in frames):
//   <FrontArrow id t t0 points dur? width? color? label? />      thick arrow that GROWS along `points` (smooth path), head at the tip
//   <TrenchLine id t t0 points dur? style? />                    a defence line drawn on progressively: 'zigzag' trench, 'triangles'
//                                                                (military front-line symbol, `side` = which side they face), 'dashes'
//   <UnitBox x y kind? color? label? size? />                    unit marker (NATO-like box: inf X, arm ellipse, art dot, mar anchor-less "TQLC")
//   SIDE_COLORS                                                  vnm red, rvn yellow, usa blue, neutral grey
// Colour per side: VNM (QĐND) red, RVN (VNCH) yellow, USA blue. Every shape has an ink outline + soft shadow to read on any map.

export const SIDE_COLORS = { vnm: '#E0483C', rvn: '#F2C230', usa: '#4F7FC4', neutral: '#C9CDD2' } as const;
const INK = '#151515';
const label = { fontFamily: FONT.title, fontWeight: 800, paintOrder: 'stroke', strokeLinejoin: 'round' } as const;

export const FrontArrow: React.FC<{ id: string; t: number; t0: number; points: Pt[]; dur?: number; width?: number; color?: string; label?: string; labelSize?: number; opacity?: number; tail?: number }> = ({
  t, t0, points, dur = 60, width = 46, color = SIDE_COLORS.vnm, label: text, labelSize = 30, opacity = 0.92, tail = 0.4,
}) => {
  const sp = samplePath(points, 14), u = easeOut(prog(t, t0, t0 + dur));
  if (u <= 0.01) return null;
  const L = sp.total * u, headLen = Math.min(width * 1.7, L * 0.7), shaft = Math.max(1, L - headLen), steps = Math.max(2, Math.ceil(shaft / 14));
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const s = (shaft * i) / steps, p = pathAtDist(sp, s), th = (p.heading * Math.PI) / 180, w = lerp(width * tail, width, clamp(s / Math.max(60, sp.total * 0.5))) / 2;
    left.push([p.x - Math.sin(th) * w, p.y + Math.cos(th) * w]); right.push([p.x + Math.sin(th) * w, p.y - Math.cos(th) * w]);
  }
  const hb = pathAtDist(sp, shaft), tip = pathAtDist(sp, L), th = (hb.heading * Math.PI) / 180, hw = width * 0.95;
  const hl: Pt = [hb.x - Math.sin(th) * hw, hb.y + Math.cos(th) * hw], hr: Pt = [hb.x + Math.sin(th) * hw, hb.y - Math.cos(th) * hw];
  const poly = [...left, hl, [tip.x, tip.y] as Pt, hr, ...right.reverse()].map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
  const mid = pathAtDist(sp, shaft * 0.5);
  return (
    <g opacity={opacity}>
      <polygon points={poly} transform="translate(5,7)" fill="#000" opacity={0.3} />
      <polygon points={poly} fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <polygon points={poly} fill="none" stroke="#FFFFFF" strokeWidth={2.2} strokeLinejoin="round" opacity={0.55} />
      <polyline points={Array.from({ length: steps + 1 }, (_, i) => pathAtDist(sp, (shaft * i) / steps)).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} fill="none" stroke="#FFFFFF" strokeWidth={width * 0.14} strokeLinecap="round" opacity={0.22} />
      {text && u > 0.6 && <text x={mid.x} y={mid.y + labelSize * 0.35} textAnchor="middle" fontSize={labelSize} fill="#FFFFFF" stroke="#151515" strokeWidth={labelSize * 0.2} opacity={clamp((u - 0.6) * 4)} {...label}>{text}</text>}
    </g>
  );
};

export const TrenchLine: React.FC<{ id: string; t: number; t0: number; points: Pt[]; dur?: number; style?: 'zigzag' | 'triangles' | 'dashes'; step?: number; amp?: number; color?: string; side?: 1 | -1 }> = ({
  t, t0, points, dur = 50, style = 'zigzag', step = 24, amp = 9, color = '#3A2A1C', side = 1,
}) => {
  const sp = samplePath(points, 14), u = prog(t, t0, t0 + dur);
  if (u <= 0) return null;
  const L = sp.total * u, n = Math.floor(L / step), pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const p = pathAtDist(sp, i * step), th = (p.heading * Math.PI) / 180, o = style === 'zigzag' ? (i % 2 ? amp : -amp) : 0;
    pts.push([p.x - Math.sin(th) * o, p.y + Math.cos(th) * o]);
  }
  const d = pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
  return (
    <g>
      {style === 'zigzag' && <><polyline points={d} fill="none" stroke="#000" strokeWidth={11} strokeLinejoin="miter" opacity={0.25} transform="translate(2,4)" />
        <polyline points={d} fill="none" stroke="#C7AE7C" strokeWidth={10} strokeLinejoin="miter" /><polyline points={d} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="miter" /></>}
      {style === 'dashes' && <polyline points={Array.from({ length: Math.ceil(L / 8) + 1 }, (_, i) => pathAtDist(sp, Math.min(L, i * 8))).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} fill="none" stroke={color} strokeWidth={5} strokeDasharray="16 10" strokeLinecap="round" />}
      {style === 'triangles' && Array.from({ length: n }, (_, i) => {
        const p = pathAtDist(sp, i * step + step / 2), th = (p.heading * Math.PI) / 180, nx = -Math.sin(th) * side, ny = Math.cos(th) * side, tx = Math.cos(th), ty = Math.sin(th), b = step * 0.36, hgt = step * 0.5;
        return <polygon key={i} points={`${p.x - tx * b},${p.y - ty * b} ${p.x + tx * b},${p.y + ty * b} ${p.x + nx * hgt},${p.y + ny * hgt}`} fill={color} stroke={INK} strokeWidth={2} strokeLinejoin="round" />;
      })}
    </g>
  );
};

const UNIT_GLYPH: Record<string, (s: number) => React.ReactNode> = {
  inf: (s) => <path d={`M${-s * 0.5},${-s * 0.3}L${s * 0.5},${s * 0.3}M${-s * 0.5},${s * 0.3}L${s * 0.5},${-s * 0.3}`} stroke={INK} strokeWidth={s * 0.07} />,
  arm: (s) => <ellipse rx={s * 0.34} ry={s * 0.2} fill="none" stroke={INK} strokeWidth={s * 0.07} />,
  art: (s) => <circle r={s * 0.1} fill={INK} />,
  mar: (s) => <path d={`M${-s * 0.5},${-s * 0.3}L${s * 0.5},${s * 0.3}M${-s * 0.5},${s * 0.3}L${s * 0.5},${-s * 0.3}M0,${-s * 0.3}V${s * 0.3}`} stroke={INK} strokeWidth={s * 0.07} />,
  air: (s) => <path d={`M${-s * 0.4},${s * 0.18}Q0,${-s * 0.4} ${s * 0.4},${s * 0.18}`} fill="none" stroke={INK} strokeWidth={s * 0.07} />,
};
/** Map unit marker: a 1.5:1 box in the side colour with a glyph (inf X, arm ellipse, art dot, mar X+bar, air arch) and a name below. */
export const UnitBox: React.FC<{ x: number; y: number; kind?: keyof typeof UNIT_GLYPH; color?: string; label?: string; size?: number }> = ({ x, y, kind = 'inf', color = SIDE_COLORS.vnm, label: text, size = 54 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-size * 0.75 + 3} y={-size * 0.5 + 4} width={size * 1.5} height={size} fill="#000" opacity={0.3} />
    <rect x={-size * 0.75} y={-size * 0.5} width={size * 1.5} height={size} fill={color} stroke={INK} strokeWidth={size * 0.07} />
    <g transform={`scale(1.2)`}>{(UNIT_GLYPH[kind] ?? UNIT_GLYPH.inf)(size * 0.8)}</g>
    {text && <text y={size * 0.5 + size * 0.5} textAnchor="middle" fontSize={size * 0.46} fill="#FFFFFF" stroke="#0E1D2E" strokeWidth={size * 0.12} {...label}>{text}</text>}
  </g>
);
