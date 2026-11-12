import React from 'react';
import { Puff } from './fx-glow';
import { clamp, easeOut, hash, lerp, Pt, polar, prog } from './fx-math';
import { pathAtDist, samplePath } from './fx-flight-path';

// Helicopters for heliborne landings (screen px, t in frames, 30 fps): rotor drawn as a motion-blur disc + ghosted blades.
//   <HeliTop x y heading size? kind? t? />          TOP view, nose along `heading` (0 = east), size = fuselage length px
//   <HeliSide x y size? kind? flip? t? />           SIDE view (facing right), rotor as a flat blur ellipse
//   <HeliFlight id t t0 t1 points kind? size? land? troops? />   flies a path; `land` = set down at the end (rotor wash dust,
//                                                   skids on the ground) and then (troops) tiny figures run out to `troops` points
//   <HeliWave id t flights kind? size? />           several helicopters, each {points, t0, t1, land?}
//   <TinyFigures t t0 from to? n? spread? />        ~12 px dots-with-body running from `from` to scattered points (no detail, no gore)
// kind: 'uh1' (UH-1 Huey, 2-blade rotor, rotor radius 0.6 x length) | 'ch53' (CH-53 Sea Stallion: bigger, 6 blades, radius 0.5 x).

const INK = '#151515';
export type HeliKind = 'uh1' | 'ch53';
const BODY = { uh1: '#5C6A3A', ch53: '#5A6642' };

const Rotor: React.FC<{ cx: number; cy: number; r: number; blades: number; t: number; opacity?: number }> = ({ cx, cy, r, blades, t, opacity = 1 }) => {
  const a0 = (t * (blades === 2 ? 37 : 26)) % 360;
  return (
    <g opacity={opacity}>
      <circle cx={cx} cy={cy} r={r} fill="#DDE3E6" opacity={0.16} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EEF2F4" strokeWidth={1.4} opacity={0.4} />
      {[0, 1, 2].map((g) => Array.from({ length: blades }, (_, i) => (
        <line key={`${g}-${i}`} x1={cx} y1={cy} x2={cx + r * Math.cos(((a0 - g * 17 + (i * 360) / blades) * Math.PI) / 180)} y2={cy + r * Math.sin(((a0 - g * 17 + (i * 360) / blades) * Math.PI) / 180)}
          stroke={g ? '#C9D0D4' : '#2B2E32'} strokeWidth={g ? 3.4 : 2.4} strokeLinecap="round" opacity={g ? 0.3 - g * 0.1 : 0.85} />
      )))}
      <circle cx={cx} cy={cy} r={3.4} fill="#2B2E32" />
    </g>
  );
};

export const HeliTop: React.FC<{ x: number; y: number; heading?: number; size?: number; kind?: HeliKind; t?: number }> = ({ x, y, heading = 0, size = 80, kind = 'uh1', t = 0 }) => {
  const k = size / 100, big = kind === 'ch53', c = BODY[kind];
  return (
    <g transform={`translate(${x},${y}) rotate(${heading}) scale(${k})`} strokeLinejoin="round" strokeLinecap="round">
      {big ? (
        <g>
          <path d="M-62,-3 L-34,-5 L-34,5 L-62,3 Z" fill={c} stroke={INK} strokeWidth={1.6} />
          <path d="M-66,-9 L-62,-9 L-62,9 L-66,9 Z" fill="#4A5632" stroke={INK} strokeWidth={1.4} />
          <path d="M-40,-11 L34,-11 Q54,-8 56,0 Q54,8 34,11 L-40,11 Z" fill={c} stroke={INK} strokeWidth={1.8} />
          <rect x={-8} y={-17} width={24} height={6} rx={2} fill="#4A5632" stroke={INK} strokeWidth={1.4} /><rect x={-8} y={11} width={24} height={6} rx={2} fill="#4A5632" stroke={INK} strokeWidth={1.4} />
          <path d="M40,-6 Q52,-4 52,0 Q52,4 40,6 Z" fill="#26323E" stroke={INK} strokeWidth={1} />
          <Rotor cx={-4} cy={0} r={52} blades={6} t={t} /><Rotor cx={-64} cy={-1} r={9} blades={4} t={t * 1.6} />
        </g>
      ) : (
        <g>
          <path d="M-56,-2.2 L-12,-4 L-12,4 L-56,2.2 Z" fill={c} stroke={INK} strokeWidth={1.5} />
          <path d="M-58,-8 L-50,-3 L-50,3 L-58,8 Z" fill="#4A5632" stroke={INK} strokeWidth={1.3} />
          <path d="M-18,-8 Q8,-10 30,-6 Q42,-3 42,0 Q42,3 30,6 Q8,10 -18,8 Z" fill={c} stroke={INK} strokeWidth={1.8} />
          <path d="M28,-5 Q38,-3 38,0 Q38,3 28,5 Z" fill="#26323E" stroke={INK} strokeWidth={1} />
          <line x1={-14} y1={-11} x2={28} y2={-11} stroke={INK} strokeWidth={2.2} /><line x1={-14} y1={11} x2={28} y2={11} stroke={INK} strokeWidth={2.2} />
          <Rotor cx={4} cy={0} r={59} blades={2} t={t} /><Rotor cx={-58} cy={-1} r={9} blades={2} t={t * 1.8} />
        </g>
      )}
    </g>
  );
};

export const HeliSide: React.FC<{ x: number; y: number; size?: number; kind?: HeliKind; flip?: boolean; t?: number }> = ({ x, y, size = 420, kind = 'uh1', flip = false, t = 0 }) => {
  const k = size / 200, big = kind === 'ch53', c = BODY[kind], bl = 0.5 + 0.5 * Math.sin(t * 2.3);
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -k : k},${k})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx={big ? -6 : 10} cy={big ? -52 : -46} rx={big ? 104 : 118} ry={4 + 2 * bl} fill="#DDE3E6" opacity={0.3} />
      <ellipse cx={big ? -6 : 10} cy={big ? -52 : -46} rx={big ? 104 : 118} ry={2} fill="#2B2E32" opacity={0.5} />
      <line x1={big ? -6 : 10} y1={big ? -50 : -44} x2={big ? -6 : 10} y2={big ? -40 : -34} stroke={INK} strokeWidth={5} />
      {big ? (
        <g>
          <path d="M-90,-34 L-126,-60 L-132,-56 L-110,-30 Z" fill={c} stroke={INK} strokeWidth={3} /><circle cx={-130} cy={-60} r={15} fill="#DDE3E6" opacity={0.35} stroke={INK} strokeWidth={1.5} />
          <path d="M-100,-32 L60,-36 Q104,-34 108,-12 L100,6 L-100,6 Z" fill={c} stroke={INK} strokeWidth={3.4} />
          <path d="M70,-30 L96,-26 Q104,-16 98,-8 L70,-8 Z" fill="#26323E" stroke={INK} strokeWidth={2.4} />
          {[-40, -10, 20].map((wx) => <rect key={wx} x={wx} y={-24} width={14} height={11} rx={2} fill="#26323E" stroke={INK} strokeWidth={2} />)}
          <rect x={-18} y={4} width={30} height={22} rx={6} fill="#4A5632" stroke={INK} strokeWidth={3} /><circle cx={-2} cy={32} r={9} fill="#2B2E32" stroke={INK} strokeWidth={2.4} /><circle cx={78} cy={26} r={7} fill="#2B2E32" stroke={INK} strokeWidth={2.4} />
        </g>
      ) : (
        <g>
          <path d="M-60,-24 L-150,-30 L-150,-40 L-142,-40 L-130,-28 L-60,-18 Z" fill={c} stroke={INK} strokeWidth={3} /><circle cx={-146} cy={-36} r={12} fill="#DDE3E6" opacity={0.35} stroke={INK} strokeWidth={1.5} />
          <path d="M-70,-34 Q-70,-38 -20,-40 Q50,-40 80,-20 Q96,-6 70,4 L-60,4 Q-74,-6 -70,-34 Z" fill={c} stroke={INK} strokeWidth={3.4} />
          <path d="M34,-34 Q70,-32 80,-14 L34,-10 Z" fill="#26323E" stroke={INK} strokeWidth={2.4} />
          <rect x={-40} y={-26} width={50} height={20} rx={3} fill="#4A5632" stroke={INK} strokeWidth={2} />
          <path d="M-52,22 L72,22 Q84,22 88,16" fill="none" stroke={INK} strokeWidth={4.4} /><path d="M-30,4 L-34,22 M44,4 L48,22" stroke={INK} strokeWidth={4} />
        </g>
      )}
    </g>
  );
};

/** Tiny running figures (a dot head + short body, ~7 px): n figures spread out from `from` towards scattered points around `to`. */
export const TinyFigures: React.FC<{ t: number; t0: number; from: Pt; to?: Pt; n?: number; spread?: number; color?: string; dur?: number }> = ({ t, t0, from, to, n = 6, spread = 70, color = '#D8D8C8', dur = 70 }) => {
  const a = t - t0;
  if (a < 0) return null;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const dst: Pt = to ? [to[0] + (hash(i, 3) - 0.5) * spread, to[1] + (hash(i, 4) - 0.5) * spread] : polar(from[0], from[1], hash(i, 1) * 360, spread * (0.5 + 0.7 * hash(i, 2)));
        const u = easeOut(clamp((a - i * 4) / dur)), x = lerp(from[0], dst[0], u), y = lerp(from[1], dst[1], u) + Math.abs(Math.sin(a * 0.6 + i)) * -1.6 * (1 - u);
        return a < i * 4 ? null : <g key={i} transform={`translate(${x},${y}) scale(1.7)`}><ellipse cx={1} cy={4} rx={3.6} ry={1.4} fill="#000" opacity={0.25} /><rect x={-1.4} y={-3} width={2.8} height={6} rx={1.2} fill={color} stroke={INK} strokeWidth={0.8} /><circle cx={0} cy={-5} r={2.1} fill={color} stroke={INK} strokeWidth={0.8} /></g>;
      })}
    </g>
  );
};

type Flight = { points: Pt[]; t0: number; t1: number; land?: boolean; troops?: Pt };
export const HeliFlight: React.FC<{ id: string; t: number; kind?: HeliKind; size?: number } & Flight> = ({ t, t0, t1, points, kind = 'uh1', size = 84, land = false, troops }) => {
  const sp = samplePath(points), u = prog(t, t0, t1), end = pathAtDist(sp, sp.total);
  const head = pathAtDist(sp, u * sp.total), onGround = land && t >= t1;
  if (t < t0 - 1 || (t > t1 + 160 && !land)) return null;
  const lift = land ? 1 - prog(t, t1 - 30, t1) : 1, shadow = 6 + 20 * lift;
  const wash = land ? Math.min(prog(t, t1 - 40, t1), 1 - prog(t, t1 + 70, t1 + 150)) : 0;
  const pose = onGround ? end : head;
  return (
    <g>
      {wash > 0.02 && [0, 1, 2, 3, 4, 5].map((i) => { const p = polar(end.x, end.y, i * 60 + t * 3, size * (0.5 + 0.4 * easeOut(prog(t, t1 - 40, t1 + 30)))); return <Puff key={i} x={p[0]} y={p[1]} r={size * 0.25} color="#CBBE9A" o={0.35 * wash} seed={i} />; })}
      <ellipse cx={pose.x + shadow} cy={pose.y + shadow * 1.1} rx={size * 0.5} ry={size * 0.16} fill="#000" opacity={0.2} transform={`rotate(${pose.heading} ${pose.x + shadow} ${pose.y + shadow * 1.1})`} />
      <HeliTop x={pose.x} y={pose.y} heading={pose.heading} size={size * (1 + 0.06 * lift)} kind={kind} t={t} />
      {land && troops && <TinyFigures t={t} t0={t1 + 18} from={[end.x, end.y]} to={troops} n={kind === 'ch53' ? 9 : 5} spread={90} />}
    </g>
  );
};

export const HeliWave: React.FC<{ id: string; t: number; flights: Flight[]; kind?: HeliKind; size?: number }> = ({ id, t, flights, kind, size }) => (
  <g>{flights.map((f, i) => <HeliFlight key={i} id={`${id}-${i}`} t={t} kind={kind} size={size} {...f} />)}</g>
);
