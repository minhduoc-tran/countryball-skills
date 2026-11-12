import React from 'react';
import { AircraftTop } from './aircraft-top-view';
import { AircraftKind, B52Variant } from './aircraft-kinds';
import { clamp, deg, Pt, prog } from './fx-math';

// Flight paths over the map: a smooth path through points, a plane riding it with t, and a vapour trail that fades.
//   <FlightPath id points t t0 t1 kind size />            one plane, optional route line
//   <BCell id points t t0 t1 size />                      3 B-52s in a V behind the lead (the real "cell")
//   <BWave id cells t size />                             many cells, each {points, t0, t1}
//   samplePath(points) / pathAt(path, u)                  position + heading (deg) along a path, u in 0..1
// Everything in screen px (draw inside the map camera group). t in frames (30 fps).

export type SampledPath = { p: Pt[]; cum: number[]; total: number };

/** Catmull-Rom smooth the points, then measure arc length so speed along the path is constant. */
export const samplePath = (points: Pt[], per = 16): SampledPath => {
  const P = [points[0], ...points, points[points.length - 1]], out: Pt[] = [];
  for (let i = 1; i < P.length - 2; i++)
    for (let k = 0; k < per; k++) {
      const u = k / per, [a, b, c, d] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
      const f = (j: 0 | 1) => 0.5 * (2 * b[j] + (-a[j] + c[j]) * u + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * u * u + (-a[j] + 3 * b[j] - 3 * c[j] + d[j]) * u * u * u);
      out.push([f(0), f(1)]);
    }
  out.push(points[points.length - 1]);
  const cum = [0];
  for (let i = 1; i < out.length; i++) cum.push(cum[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  return { p: out, cum, total: cum[cum.length - 1] || 1 };
};

/** Point and heading at arc distance `s` px (clamped; may extrapolate along the end tangent with `extend`). */
export const pathAtDist = (sp: SampledPath, s: number): { x: number; y: number; heading: number } => {
  const c = clamp(s, 0, sp.total);
  let lo = 0, hi = sp.cum.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (sp.cum[m] <= c) lo = m; else hi = m; }
  const [a, b] = [sp.p[lo], sp.p[hi]], k = (c - sp.cum[lo]) / Math.max(1e-6, sp.cum[hi] - sp.cum[lo]);
  const j = Math.min(hi, sp.p.length - 1), i0 = Math.max(0, j - 1);
  return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, heading: deg(Math.atan2(sp.p[j][1] - sp.p[i0][1], sp.p[j][0] - sp.p[i0][0])) };
};
export const pathAt = (sp: SampledPath, u: number) => pathAtDist(sp, clamp(u) * sp.total);

/** Vapour trail along the path between distances [s0, s1], fading towards the tail (opacity = fade * (1 - age)).
 *  `twin` draws two parallel trails (engine contrails) `gap` px apart. */
export const Trail: React.FC<{ sp: SampledPath; s0: number; s1: number; w?: number; twin?: number; fade?: number; color?: string; segs?: number; off?: number }> = ({
  sp, s0, s1, w = 5, twin = 0, fade = 1, color = '#FFFFFF', segs = 26, off = 0,
}) => {
  if (s1 - s0 < 2 || fade <= 0.01) return null;
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < segs; i++) {
    const a = s0 + ((s1 - s0) * i) / segs, b = s0 + ((s1 - s0) * (i + 1)) / segs, A = pathAtDist(sp, a), B = pathAtDist(sp, b);
    const age = 1 - (i + 1) / segs, o = fade * (1 - age) * (1 - age * 0.3), nx = -Math.sin((A.heading * Math.PI) / 180), ny = Math.cos((A.heading * Math.PI) / 180);
    const offs = twin ? [-twin / 2, twin / 2] : [0];
    offs.forEach((d, j) => lines.push(
      <line key={`${i}-${j}`} x1={A.x + nx * (d + off)} y1={A.y + ny * (d + off)} x2={B.x + nx * (d + off)} y2={B.y + ny * (d + off)}
        stroke={color} strokeWidth={w * (0.6 + 0.8 * age)} strokeLinecap="round" opacity={o * 0.8} />,
    ));
  }
  return <g>{lines}</g>;
};

type FlightProps = {
  id: string; points: Pt[]; t: number; t0: number; t1: number; kind?: AircraftKind; size?: number; variant?: B52Variant;
  trailLen?: number; trailW?: number; twin?: number; route?: boolean; routeColor?: string;
};

/** One plane flying `points` between frames t0 and t1 (constant speed). Hidden outside; the trail lingers and fades
 *  for `trailLen` px behind the plane and after the plane has left. Optional dashed route line ahead. */
export const FlightPath: React.FC<FlightProps & { lateral?: number; back?: number; sp?: SampledPath }> = ({
  id, points, t, t0, t1, kind = 'b52', size = 100, variant = 'D', trailLen = 420, trailW, twin, route = false, routeColor = '#FFD166', lateral = 0, back = 0, sp: given,
}) => {
  const sp = given ?? samplePath(points), u = prog(t, t0, t1);
  const s = u * (sp.total + back) - back, hidden = t < t0 || t > t1 + 1 || s < 0;
  const afterFade = 1 - prog(t, t1, t1 + 90);
  const head = pathAtDist(sp, clamp(s, 0, sp.total)), nx = -Math.sin((head.heading * Math.PI) / 180), ny = Math.cos((head.heading * Math.PI) / 180);
  const sHead = clamp(s, 0, sp.total), tw = twin ?? size * 0.16;
  return (
    <g>
      {route && t >= t0 && <polyline points={sp.p.map((q) => q.join(',')).join(' ')} fill="none" stroke={routeColor} strokeWidth={3} strokeDasharray="10 10" opacity={0.55} />}
      <Trail sp={sp} s0={Math.max(0, sHead - trailLen)} s1={sHead} w={trailW ?? Math.max(3.5, size * 0.06)} twin={kind === 'b52' || kind === 'kc135' ? tw : 0}
        fade={t < t0 ? 0 : t <= t1 ? 1 : afterFade} off={lateral} />
      {!hidden && <AircraftTop id={`${id}`} kind={kind} variant={variant} size={size} x={head.x + nx * lateral} y={head.y + ny * lateral} heading={head.heading} />}
    </g>
  );
};

/** A B-52 cell: lead plus two wingmen stepped back and out in a V. `spread` px sideways, `step` px back per wingman. */
export const BCell: React.FC<FlightProps & { spread?: number; step?: number }> = ({ id, size = 90, spread, step, ...rest }) => {
  const sp = samplePath(rest.points), sx = spread ?? size * 1.15, st = step ?? size * 0.95;
  return (
    <g>
      <FlightPath {...rest} id={`${id}-l`} size={size} sp={sp} />
      <FlightPath {...rest} id={`${id}-a`} size={size} sp={sp} lateral={-sx} back={st} trailLen={rest.trailLen ? rest.trailLen * 0.7 : 300} />
      <FlightPath {...rest} id={`${id}-b`} size={size} sp={sp} lateral={sx} back={st} trailLen={rest.trailLen ? rest.trailLen * 0.7 : 300} />
    </g>
  );
};

/** A wave of cells: each cell has its own route and timing (typically staggered t0). */
export const BWave: React.FC<{ id: string; t: number; size?: number; cells: { points: Pt[]; t0: number; t1: number }[]; trailLen?: number }> = ({ id, t, size = 80, cells, trailLen }) => (
  <g>{cells.map((c, i) => <BCell key={i} id={`${id}-${i}`} t={t} size={size} points={c.points} t0={c.t0} t1={c.t1} trailLen={trailLen} />)}</g>
);
