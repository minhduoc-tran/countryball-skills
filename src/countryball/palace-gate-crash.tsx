import React from 'react';
import { clamp, easeInOut, easeOut, hash, lerp, prog } from './fx-math';
import { Puff } from './fx-glow';
import { mix } from './map-context';
import { TankKind, TankSide } from './ground-tanks';
import { PalaceFacade } from './palace-facade';

// <GateCrash>: THE money shot of 30.4.1975. A T-54 / Type 59 (side view) rolls in from the street (left) and breaks the wrought-iron main gate
// of Dinh Độc Lập, which bends and falls INWARDS (towards the right, into the grounds) while the tank rolls over it; or (variant 'side') hits a
// side-gate pillar and stalls with smoke (tank 843). Everything is a pure function of `crash` (0..1) and t:
//   <GateCrash id x y s? crash variant? kind? num? flag? t? tone? backdrop? />
//   x, y   centre of the gate on the ground line (px; default 1040, 880), the tank passes through it       s   scale (1 = a 400 px tank)
//   crash  0..1   main: 0-0.34 the tank drives in | 0.34-0.46 impact, the gate BENDS, dust + flying bits | 0.46-0.70 the leaves FALL flat
//                 | 0.70-1 the tank rolls over them and out (nose up, then down); 0.36-0.7 is where the action is, so give it ~2 s of the shot
//                 side: 0-0.40 it drives in | 0.40-0.5 it hits the pillar (crack, cap tilts) | 0.5-1 it sits stalled, engine smoke grows
//   num    hull number on the turret ("390" for the main gate, "843" for the side gate)     kind 'type59' (default main) | 't54' (default side, with the T-54B lamp)
//   flag   the Mặt trận DTGP flag on the antenna (default true)     t  frame (flag ripple, smoke)     tone 'day' | 'dusk'
// The view is a stylised 3/4: the gate plane is drawn slanted (depth runs up-right) so its iron bars are readable although the tank is in pure side view.

const INK = '#1B1B1E';
const D: [number, number] = [0.46, -0.3];                      // screen vector of 1 unit of depth (away from the camera)
const HALF_DEPTH = 240;                                        // half the gate width (depth units)
const GATE_H = 300;

const poly = (pts: [number, number][]) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/** Stone pillar with a lantern cap: front face + slanted side, foot at (x, y). `tilt` degrees, `crack` 0..1. */
const Pillar: React.FC<{ x: number; y: number; s: number; tone: (c: string) => string; tilt?: number; crack?: number; cap?: number }> = ({ x, y, s, tone, tilt = 0, crack = 0, cap = 0 }) => {
  const w = 52 * s, h = 330 * s;
  return (
    <g transform={`translate(${x},${y}) rotate(${tilt})`} strokeLinejoin="round">
      <rect x={-w / 2 - 6 * s} y={-26 * s} width={w + 12 * s} height={26 * s} fill={tone('#CFC8B2')} stroke={INK} strokeWidth={3} />
      <rect x={-w / 2} y={-h} width={w} height={h - 26 * s} fill={tone('#E9E4D3')} stroke={INK} strokeWidth={3} />
      <polygon points={poly([[w / 2, -h], [w / 2 + 20 * s, -h - 14 * s], [w / 2 + 20 * s, -14 * s], [w / 2, -26 * s]])} fill={tone('#BDB6A0')} stroke={INK} strokeWidth={3} />
      {[0.3, 0.55, 0.78].map((k) => <line key={k} x1={-w / 2} y1={-h * k} x2={w / 2} y2={-h * k} stroke={tone('#B6AF98')} strokeWidth={2} />)}
      <g transform={`translate(${cap * 10 * s},${-cap * 8 * s}) rotate(${cap * 14} 0 ${-h})`}>
        <rect x={-w / 2 - 8 * s} y={-h - 14 * s} width={w + 16 * s} height={16 * s} fill={tone('#DAD3BC')} stroke={INK} strokeWidth={3} />
        <path d={`M${-w / 2 + 6 * s},${-h - 14 * s} L${-w / 2 + 14 * s},${-h - 44 * s} L${w / 2 - 14 * s},${-h - 44 * s} L${w / 2 - 6 * s},${-h - 14 * s}Z`} fill={tone('#E9E4D3')} stroke={INK} strokeWidth={3} />
        <circle cx={0} cy={-h - 58 * s} r={13 * s} fill={tone('#E2B95A')} stroke={INK} strokeWidth={2.4} />
      </g>
      {crack > 0 && <path d={`M${-w * 0.1},${-h * 0.1} L${w * 0.2},${-h * 0.2 * (0.6 + crack)} L${-w * 0.2},${-h * 0.34} L${w * 0.25},${-h * 0.2 - h * 0.24 * crack}`} fill="none" stroke={INK} strokeWidth={3.4 * crack + 1} strokeLinecap="round" opacity={0.9} />}
    </g>
  );
};

/** One gate leaf: bars hinged along base a -> b, bent and falling forward (+x) by `theta` radians; returns the drawing. */
const Leaf: React.FC<{ a: [number, number]; b: [number, number]; theta: number; bend: number; s: number; seed: number; tone: (c: string) => string }> = ({ a, b, theta, bend, s, seed, tone }) => {
  const H = GATE_H * s, n = 9, edges = [0, 0.34, 0.72, 1];
  const at = (u: number, k: number): [number, number] => {
    // bars lag at mid-height and overshoot at the top (the bend), each with its own wobble
    const wob = bend * 0.4 * (hash(seed + Math.round(u * 8), 2) - 0.2), angs = [theta * 0.5, theta, theta * (1.35 + wob)];
    let px = lerp(a[0], b[0], u), py = lerp(a[1], b[1], u);
    for (let i = 0; i < 3; i++) {
      const k1 = Math.min(k, edges[i + 1]);
      if (k1 <= edges[i]) break;
      px += Math.sin(angs[i]) * (k1 - edges[i]) * H; py -= Math.cos(angs[i]) * (k1 - edges[i]) * H;
    }
    return [px, py];
  };
  const bars = Array.from({ length: n }, (_, i) => i / (n - 1));
  const rails = [0.34, 0.72, 1];
  const top = (u: number) => at(u, 1);
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <polygon points={poly([at(0, 0), at(1, 0), top(1), top(0)])} fill={tone('#17171B')} opacity={0.35} />
      {rails.map((k) => <polyline key={k} points={poly(bars.map((u) => at(u, k)))} fill="none" stroke={tone('#2C2C33')} strokeWidth={k === 1 ? 7 * s : 6 * s} />)}
      {bars.map((u, i) => {
        const p0 = at(u, 0), p1 = at(u, 0.34), p2 = at(u, 0.72), p3 = at(u, 1);
        return (
          <g key={i}>
            <polyline points={poly([p0, p1, p2, p3])} fill="none" stroke={INK} strokeWidth={9 * s} />
            <polyline points={poly([p0, p1, p2, p3])} fill="none" stroke={tone(i % 2 ? '#3A3A42' : '#2E2E35')} strokeWidth={5.4 * s} />
            <polygon points={poly([[p3[0] - 7 * s, p3[1] + 2], [p3[0], p3[1] - 18 * s], [p3[0] + 7 * s, p3[1] + 2]])} fill={tone('#2C2C33')} stroke={INK} strokeWidth={2.2} />
          </g>
        );
      })}
      {theta < 0.6 && (() => { const m = at(0.5, 0.52); return <circle cx={m[0]} cy={m[1]} r={34 * s * (1 - theta)} fill="none" stroke={tone('#3A3A42')} strokeWidth={7 * s} />; })()}
    </g>
  );
};

export const GateCrash: React.FC<{
  id: string; x?: number; y?: number; s?: number; crash: number; variant?: 'main' | 'side'; kind?: TankKind; num?: string; flag?: boolean; t?: number; tone?: 'day' | 'dusk'; backdrop?: boolean; tank?: boolean;
}> = ({ id, x = 1040, y = 880, s = 1, crash, variant = 'main', kind, num, flag = true, t = 0, tone = 'day', backdrop = true, tank = true }) => {
  const c = clamp(crash), main = variant === 'main', night = tone === 'dusk' ? 0.25 : 0;
  const T = (col: string) => (night ? mix(col, '#7A5A6A', night) : col);
  const size = 400 * s, k = size / 200, tankKind: TankKind = kind ?? (main ? 'type59' : 't54'), tankNum = num ?? (main ? '390' : '843');
  // ---- timeline ----
  const hit = main ? 0.34 : 0.4, contact = x - 196 * s;                                  // tank centre when the hull front touches the gate plane
  const start = x - 880 * s, stop = main ? x + 900 * s : contact;
  const phase = main ? prog(c, 0, 0.34) : prog(c, 0, 0.4);
  let tx = lerp(start, contact, easeOut(phase) * 0.35 + phase * 0.65);
  if (main && c >= hit) tx = lerp(contact, stop, prog(c, hit, 1)) - 26 * s * Math.sin(Math.PI * prog(c, hit, 0.6));
  if (!main && c >= hit) tx = contact + 10 * s * Math.sin(Math.PI * prog(c, hit, 0.5)) * 0.6 - 4 * s * prog(c, 0.5, 0.7);
  const climb = main ? Math.sin(Math.PI * prog(c, 0.62, 0.95)) : 0, tilt = main ? 7 * climb : prog(c, 0.42, 0.5) * 3 * (1 - prog(c, 0.5, 0.8));
  const ground = y, tankY = ground - 18 * k + (main ? -6 * s * climb : 0);
  const theta = main ? (c < hit ? 0 : c < 0.46 ? lerp(0, 0.2, prog(c, hit, 0.46)) : lerp(0.2, 1.53, easeInOut(prog(c, 0.46, 0.7))) + 0.02 * Math.sin(prog(c, 0.7, 0.9) * 9) * (1 - prog(c, 0.7, 0.9))) : 0;
  const bend = main ? Math.sin(Math.PI * clamp((c - hit) / 0.3)) : 0, since = Math.max(0, c - hit);
  // gate geometry (slanted): near pillar A, centre C, far pillar B
  const dz = HALF_DEPTH * s, A: [number, number] = [x - D[0] * dz, y - D[1] * dz], C: [number, number] = [x, y], B: [number, number] = [x + D[0] * dz, y + D[1] * dz];
  const Bc: [number, number] = [x + (main ? 0 : 160 * s), y];
  // ---- dust, bits, smoke ----
  const dust = main ? prog(c, hit, 0.5) * (1 - prog(c, 0.75, 1)) : prog(c, hit, 0.52) * (1 - prog(c, 0.8, 1) * 0.7);
  const ix = main ? x - 12 * s : x - 40 * s, iy = ground - 70 * s;
  const bitT = since / 0.5 * 52, bits = since > 0 && since < 0.6 ? Array.from({ length: main ? 12 : 7 }, (_, i) => {
    const vx = (main ? 3 : 2) + hash(i, 1) * (main ? 9 : 5) - (main ? 0 : 3), vy = -(7 + hash(i, 2) * 12), px = ix + vx * bitT * s, py = iy + (vy * bitT + 0.5 * 0.95 * bitT * bitT) * s;
    return { i, px, py: Math.min(py, ground + 10 * s), rot: hash(i, 3) * 360 + bitT * (hash(i, 4) - 0.5) * 24, len: (24 + hash(i, 5) * 40) * s };
  }) : [];
  const ring = prog(c, hit, hit + 0.1), sm = !main ? prog(c, 0.45, 1) : 0;
  const body = (
    <g transform={`rotate(${-tilt} ${tx} ${ground})`}>
      <TankSide x={tx} y={tankY} size={size} kind={tankKind} num={tankNum} searchlight={tankKind === 't54'} flag={flag ? 'PRG' : undefined} t={t} id={`${id}-tk`} turret={main ? 4 : 7} />
    </g>
  );
  return (
    <g>
      {backdrop && (
        <g>
          <PalaceFacade id={`${id}-pf`} x={x + 400 * s} y={y - 90 * s} w={980 * s} tone={tone} backdrop />
          <rect y={y - 90 * s} width={1920} height={90 * s + 1} fill={T('#7FA652')} />
          <rect y={y - 14 * s} width={1920} height={1080 - y + 14 * s} fill={T('#9C9482')} />
          <rect y={y - 14 * s} width={1920} height={10} fill="#000" opacity={0.15} />
          <path d={`M0,${y + 150 * s} H1920`} stroke="#F4F0E2" strokeWidth={6} strokeDasharray="60 44" opacity={0.7} />
          <rect x={0} y={y - 90 * s} width={1920} height={14} fill="#000" opacity={0.1} />
        </g>
      )}
      {/* far pillar, both gate halves, near pillar, dust, then the tank (it rolls in FRONT of the gate plane, so it never hides the bars above it) */}
      {main && <Pillar x={B[0]} y={B[1]} s={s * 0.94} tone={T} />}
      {main ? <Leaf a={C} b={B} theta={theta} bend={bend} s={s} seed={3} tone={T} /> : <Leaf a={Bc} b={[Bc[0] + D[0] * dz, Bc[1] + D[1] * dz]} theta={0} bend={0} s={s} seed={3} tone={T} />}
      {main && <Leaf a={A} b={C} theta={theta} bend={bend} s={s} seed={11} tone={T} />}
      {main && <Pillar x={A[0]} y={A[1]} s={s * 1.06} tone={T} />}
      {dust > 0.02 && [0, 1, 2, 3].map((i) => <Puff key={`d${i}`} x={ix - 60 * s + i * 46 * s} y={ground - 40 * s - i * 8 * s} r={(40 + i * 12) * s * (0.5 + dust)} color="#CDBF9B" o={0.42 * dust} seed={i} />)}
      {tank && body}
      {!main && <Pillar x={x + 22 * s} y={ground + 20 * s} s={s * 1.06} tone={T} tilt={prog(c, hit, hit + 0.08) * 2.5} crack={prog(c, hit, hit + 0.1)} cap={prog(c, hit, hit + 0.12)} />}
      {/* contact flash, dust clouds, flying bits */}
      {ring > 0 && ring < 1 && <g opacity={1 - ring}><ellipse cx={ix} cy={iy} rx={30 * s + 150 * s * ring} ry={20 * s + 100 * s * ring} fill="none" stroke="#FFF6D8" strokeWidth={9 * (1 - ring)} />
        {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 6.283, r0 = 30 * s + 40 * s * ring, r1 = r0 + 70 * s * (1 - ring * 0.3); return <line key={i} x1={ix + Math.cos(a) * r0} y1={iy + Math.sin(a) * r0 * 0.7} x2={ix + Math.cos(a) * r1} y2={iy + Math.sin(a) * r1 * 0.7} stroke="#FFE9A8" strokeWidth={6 * (1 - ring)} strokeLinecap="round" />; })}</g>}
      {dust > 0.02 && [0, 1, 2].map((i) => <Puff key={`f${i}`} x={ix + 60 * s + i * 90 * s * easeOut(prog(c, hit, 0.8))} y={ground - 6 * s - i * 6 * s} r={(30 + i * 8) * s * (0.4 + dust)} color="#D8CAA6" o={0.3 * dust} seed={i + 9} />)}
      {bits.map((b) => (
        <g key={b.i} transform={`translate(${b.px},${b.py}) rotate(${b.rot})`}><rect x={-b.len / 2} y={-3 * s} width={b.len} height={6 * s} rx={2} fill={b.i % 3 ? '#2C2C33' : '#C9C2AE'} stroke={INK} strokeWidth={1.6} />{b.i % 4 === 0 && <polygon points={`${b.len / 2},${-6 * s} ${b.len / 2 + 14 * s},0 ${b.len / 2},${6 * s}`} fill="#2C2C33" stroke={INK} strokeWidth={1.4} />}</g>
      ))}
      {sm > 0.02 && [0, 1, 2, 3, 4].map((i) => <Puff key={`s${i}`} x={tx - 150 * s - i * 14 * s + Math.sin(t * 0.08 + i) * 8} y={ground - 130 * s - i * 58 * s * sm} r={(26 + i * 12) * s * (0.4 + sm)} color="#3C3C40" o={0.75 * sm * (1 - i * 0.14)} seed={i + 3} />)}
    </g>
  );
};

/** Alias: the same component, named for the side-gate stall (variant 'side') or the main gate (variant 'main'). */
export const PalaceGateSide = GateCrash;
