import React from 'react';
import { rnd } from '../anim';
import { FONT } from '../fonts';
import { ST, proj, px, mixHex, Ctx } from '../street-geom';
import type { Pt } from '../room';
import { Leafy } from './street-buildings';

// Street furniture for <Street>: concrete power poles with their tangle of black cables, street trees, plastic stools,
// plants in pots, a bin, a bus stop sign, litter on the road. Billboards are placed with proj(), sized by px(Z).

export const POLES: { side: -1 | 1; z: number; tx?: boolean }[] = [
  { side: -1, z: 5.2 }, { side: 1, z: 11, tx: true }, { side: -1, z: 19.5, tx: true }, { side: 1, z: 26.5 }, { side: -1, z: 35 },
  { side: 1, z: 44, tx: true }, { side: -1, z: 55 }, { side: 1, z: 66 }, { side: -1, z: 79 }, { side: 1, z: 92 },
];
const POLE_X = 4.95;
const POLE_H = 9.2;
const ANCHORS = [-1, -0.35, 0.35, 1]; // insulator positions along the crossarm (m from the pole)

/** A concrete pole: tapered shaft, two crossarms with insulators, maybe a transformer; vines climb it with `grass`. */
export const PowerPole: React.FC<{ side: -1 | 1; z: number; tx?: boolean; c: Ctx }> = ({ side, z, tx, c }) => {
  const k = px(z);
  const X = side * POLE_X;
  const b = proj(X, ST.kerb, z);
  const t = proj(X, POLE_H, z);
  const F = (col: string) => c.F(col, z);
  const w0 = 0.17 * k;
  const w1 = 0.1 * k;
  const arm = (y: number, len: number) => {
    const a = proj(X - len, y, z);
    const e = proj(X + len, y, z);
    return <path d={`M ${a.x} ${a.y} L ${e.x} ${e.y}`} stroke={F('#3A3646')} strokeWidth={Math.max(2, k * 0.12)} strokeLinecap="round" />;
  };
  const ins: React.ReactNode[] = ANCHORS.map((o) => { const p = proj(X + o, 8.7, z); return <rect key={o} x={p.x - k * 0.03} y={p.y - k * 0.2} width={Math.max(2, k * 0.07)} height={k * 0.2} rx={k * 0.02} fill={F('#7A8EA8')} />; });
  const tr = tx ? proj(X - side * 0.35, 7.4, z) : null;
  const vine = c.grass > 0.05;
  return (
    <g>
      <ellipse cx={b.x} cy={b.y + 1} rx={k * 0.35} ry={Math.max(2, k * 0.06)} fill="#000" opacity={0.4} />
      <path d={`M ${b.x - w0} ${b.y} L ${t.x - w1} ${t.y} L ${t.x + w1} ${t.y} L ${b.x + w0} ${b.y} Z`} fill={F('#77738A')} />
      <path d={`M ${b.x} ${b.y} L ${t.x} ${t.y} L ${t.x + w1} ${t.y} L ${b.x + w0} ${b.y} Z`} fill={F('#5C586C')} />
      <path d={`M ${b.x - side * w0} ${b.y} L ${t.x - side * w1} ${t.y}`} stroke="#FFB46A" strokeWidth={Math.max(1, k * 0.025)} opacity={0.55} />
      {Array.from({ length: 7 }).map((_, i) => { const y = proj(X, 1.5 + i * 1.1, z); return <rect key={i} x={y.x - w0 * 0.5} y={y.y} width={Math.max(2, w0)} height={Math.max(1, k * 0.03)} fill="#14101C" opacity={0.3} />; })}
      {arm(8.7, 1.2)}
      {arm(7.9, 0.9)}
      {ins}
      {tr ? (
        <g>
          <rect x={tr.x - k * 0.38} y={tr.y - k * 0.2} width={k * 0.76} height={k * 0.9} rx={k * 0.1} fill={F('#7A8088')} />
          <rect x={tr.x - k * 0.38} y={tr.y - k * 0.2} width={k * 0.76} height={k * 0.1} rx={k * 0.05} fill={F('#4A5058')} />
          <path d={`M ${tr.x - k * 0.34} ${tr.y - k * 0.2} L ${tr.x - k * 0.34} ${tr.y + k * 0.7}`} stroke="#FFB46A" strokeWidth={Math.max(1, k * 0.03)} opacity={0.5} />
        </g>
      ) : null}
      {vine ? (() => {
        // a vine winding up the shaft, longer with grass, with leaves
        const len = c.grass * 6.5;
        let d = '';
        const leaves: React.ReactNode[] = [];
        for (let m = 0; m <= 24; m++) {
          const yy = (len * m) / 24;
          const p = proj(X + Math.sin(m * 0.9 + z) * 0.12, ST.kerb + yy, z);
          d += `${m ? 'L' : 'M'} ${p.x} ${p.y} `;
          if (m % 3 === 1) leaves.push(<ellipse key={m} cx={p.x + (m % 2 ? 1 : -1) * k * 0.1} cy={p.y} rx={k * 0.09} ry={k * 0.05} fill={F('#5A8A46')} transform={`rotate(${(m % 2 ? 30 : -30)} ${p.x} ${p.y})`} />);
        }
        return <g><path d={d} stroke={F('#3A5E3C')} strokeWidth={Math.max(1.4, k * 0.035)} fill="none" />{leaves}</g>;
      })() : null}
    </g>
  );
};

/** Black cables: bundles along each side between neighbouring poles, zig-zags across the street, drops to the houses, and tangles at the pole tops. */
export const Cables: React.FC<{ c: Ctx }> = ({ c }) => {
  const out: React.ReactNode[] = [];
  const anchor = (p: { side: -1 | 1; z: number }, i: number): Pt => proj(p.side * POLE_X + ANCHORS[i], i % 3 === 1 ? 9.0 : 8.7, p.z);
  const wire = (key: string, a: Pt, b: Pt, sag: number, zm: number, seed: number) => {
    const s = (sag + Math.sin(c.t / 55 + seed) * 0.05) * px(zm);
    const col = c.F('#0D0A12', zm);
    out.push(<path key={key} d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 + 2 * s} ${b.x} ${b.y}`} stroke={col} strokeWidth={Math.max(0.9, px(zm) * 0.028)} fill="none" />);
  };
  POLES.forEach((p, i) => {
    const q = POLES.find((o, j) => j > i && o.side === p.side);
    if (q) for (let m = 0; m < 4; m++) wire(`a${i}${m}`, anchor(p, m), anchor(q, m), 0.35 + rnd(81, i * 4 + m) * 0.45, (p.z + q.z) / 2, i * 4 + m);
    const n = POLES[i + 1];
    if (n && n.side !== p.side) for (let m = 0; m < 3; m++) wire(`x${i}${m}`, anchor(p, m + (p.side > 0 ? 1 : 0)), anchor(n, 3 - m - (n.side > 0 ? 1 : 0) + 0), 0.8 + rnd(82, i * 3 + m) * 0.6, (p.z + n.z) / 2, i * 5 + m);
    for (let m = 0; m < 2; m++) { // drops to the shophouses, a loose bundle with a loop
      const o = proj(p.side * ST.wall, 5.4 + m * 1.1 + rnd(83, i) * 1.2, p.z + 0.8 + m);
      wire(`d${i}${m}`, anchor(p, m ? 0 : 3), o, 0.5 + rnd(84, i + m) * 0.4, p.z, i * 7 + m);
    }
    const base = proj(p.side * POLE_X, 8.9, p.z);
    const k = px(p.z);
    for (let m = 0; m < 3; m++) { // the tangle at the pole top
      const r = (0.5 + rnd(85, i * 3 + m) * 0.9) * k;
      const sx = base.x + (rnd(86, i * 3 + m) - 0.5) * k * 1.4;
      const sy = base.y + rnd(87, i * 3 + m) * k * 0.5;
      out.push(<path key={`t${i}${m}`} d={`M ${sx - r} ${sy} C ${sx - r * 0.2} ${sy - r * 0.9} ${sx + r * 0.9} ${sy + r * 0.3} ${sx + r * 0.3} ${sy + r * 0.5} S ${sx - r * 0.6} ${sy + r * 0.9} ${sx + r} ${sy - r * 0.1}`} stroke={c.F('#0D0A12', p.z)} strokeWidth={Math.max(1, k * 0.03)} fill="none" />);
    }
  });
  return <g>{out}</g>;
};

/** A street tree: whitewashed trunk, dark canopy back-lit (a warm rim along the top), a low brick tree pit. */
export const StreetTree: React.FC<{ X: number; z: number; seed: number; c: Ctx }> = ({ X, z, seed, c }) => {
  const k = px(z);
  const b = proj(X, ST.kerb, z);
  const F = (col: string) => c.F(col, z);
  const blobs = Array.from({ length: 12 }).map((_, i) => {
    const a = rnd(seed, i) * 6.283;
    const rr = Math.sqrt(rnd(seed + 1, i));
    return { x: b.x + Math.cos(a) * rr * 2.4 * k, y: b.y - (6.3 + Math.sin(a) * rr * 1.7) * k, r: (1.2 + rnd(seed + 2, i) * 0.9) * k };
  });
  return (
    <g>
      <ellipse cx={b.x} cy={b.y + 2} rx={k * 0.8} ry={k * 0.12} fill="#000" opacity={0.4} />
      <rect x={b.x - k * 0.55} y={b.y - k * 0.16} width={k * 1.1} height={k * 0.16} fill={F('#7A4A3E')} />
      <path d={`M ${b.x - k * 0.2} ${b.y} L ${b.x - k * 0.14} ${b.y - 4.6 * k} L ${b.x + k * 0.14} ${b.y - 4.6 * k} L ${b.x + k * 0.2} ${b.y} Z`} fill={F('#4A3A3E')} />
      <path d={`M ${b.x - k * 0.2} ${b.y} L ${b.x - k * 0.17} ${b.y - 1.2 * k} L ${b.x + k * 0.17} ${b.y - 1.2 * k} L ${b.x + k * 0.2} ${b.y} Z`} fill={F('#B8B2A8')} />
      <path d={`M ${b.x} ${b.y - 3.6 * k} L ${b.x - 1.2 * k} ${b.y - 5.4 * k} M ${b.x} ${b.y - 3.9 * k} L ${b.x + 1.3 * k} ${b.y - 5.6 * k}`} stroke={F('#4A3A3E')} strokeWidth={k * 0.12} strokeLinecap="round" />
      {blobs.map((o, i) => <circle key={`c${i}`} cx={o.x} cy={o.y} r={o.r} fill={F(i % 3 ? '#2C4A38' : '#24402F')} />)}
      {/* back-light: lighter leaf masses toward the sky, a warm rim only on the highest blobs */}
      {blobs.map((o, i) => (i % 3 === 0 ? <circle key={`l${i}`} cx={o.x - o.r * 0.1} cy={o.y - o.r * 0.28} r={o.r * 0.78} fill={F('#3F6A44')} opacity={0.55} /> : null))}
      {blobs.filter((o) => o.y < b.y - 7 * k).map((o, i) => <path key={`h${i}`} d={`M ${o.x - o.r * 0.7} ${o.y - o.r * 0.65} A ${o.r} ${o.r} 0 0 1 ${o.x + o.r * 0.6} ${o.y - o.r * 0.78}`} stroke="#FFB46A" strokeWidth={Math.max(1.5, k * 0.04)} fill="none" opacity={c.night ? 0.1 : 0.3} />)}
    </g>
  );
};

/** Plastic stools and a low table, as outside every cafe. */
export const Stools: React.FC<{ X: number; z: number; seed: number; c: Ctx }> = ({ X, z, seed, c }) => {
  const k = px(z);
  const b = proj(X, ST.kerb, z);
  const F = (col: string) => c.F(col, z);
  const cols = ['#C84A3E', '#3A7AC8', '#E9A83A'];
  return (
    <g>
      <ellipse cx={b.x} cy={b.y + 2} rx={k * 0.9} ry={k * 0.1} fill="#000" opacity={0.35} />
      <rect x={b.x - k * 0.25} y={b.y - k * 0.55} width={k * 0.5} height={k * 0.05} fill={F('#8A6A52')} />
      <path d={`M ${b.x - k * 0.2} ${b.y - k * 0.5} L ${b.x - k * 0.22} ${b.y} M ${b.x + k * 0.2} ${b.y - k * 0.5} L ${b.x + k * 0.22} ${b.y}`} stroke={F('#4A4858')} strokeWidth={k * 0.04} />
      {[-0.62, 0.55, 0.95].map((dx, i) => (
        <g key={i}>
          <path d={`M ${b.x + dx * k - k * 0.14} ${b.y - k * 0.3} L ${b.x + dx * k - k * 0.17} ${b.y} L ${b.x + dx * k + k * 0.17} ${b.y} L ${b.x + dx * k + k * 0.14} ${b.y - k * 0.3} Z`} fill={F(cols[(i + seed) % 3])} />
          <ellipse cx={b.x + dx * k} cy={b.y - k * 0.3} rx={k * 0.15} ry={k * 0.045} fill={F(mixHex(cols[(i + seed) % 3], '#FFFFFF', 0.25))} />
        </g>
      ))}
    </g>
  );
};

/** A potted plant on the pavement. */
export const PlantPot: React.FC<{ X: number; z: number; seed: number; c: Ctx }> = ({ X, z, seed, c }) => {
  const k = px(z);
  const b = proj(X, ST.kerb, z);
  return (
    <g>
      <ellipse cx={b.x} cy={b.y + 2} rx={k * 0.4} ry={k * 0.06} fill="#000" opacity={0.35} />
      <path d={`M ${b.x - k * 0.26} ${b.y - k * 0.5} L ${b.x - k * 0.18} ${b.y} L ${b.x + k * 0.18} ${b.y} L ${b.x + k * 0.26} ${b.y - k * 0.5} Z`} fill={c.F('#A8553E', z)} />
      <Leafy x={b.x} y={b.y - k * 0.5} r={k * 0.75} c={c.F('#4F8A4C', z)} seed={seed} />
    </g>
  );
};

/** A bus stop sign: a pole with a blue plate, a bus pictogram and the route number plate. */
export const BusStopSign: React.FC<{ X: number; z: number; c: Ctx; number?: string }> = ({ X, z, c, number = '09' }) => {
  const k = px(z);
  const b = proj(X, ST.kerb, z);
  const F = (col: string) => c.F(col, z);
  return (
    <g>
      <ellipse cx={b.x} cy={b.y + 2} rx={k * 0.3} ry={k * 0.05} fill="#000" opacity={0.4} />
      <rect x={b.x - k * 0.04} y={b.y - 3.0 * k} width={k * 0.08} height={3 * k} fill={F('#8E8CA0')} />
      <circle cx={b.x} cy={b.y - 3.0 * k} r={k * 0.36} fill={F('#2F5FA8')} stroke="#F2E6D0" strokeWidth={k * 0.04} />
      <rect x={b.x - k * 0.22} y={b.y - 3.0 * k - k * 0.14} width={k * 0.44} height={k * 0.26} rx={k * 0.05} fill="#F2E6D0" />
      <circle cx={b.x - k * 0.1} cy={b.y - 3.0 * k + k * 0.14} r={k * 0.045} fill="#F2E6D0" />
      <circle cx={b.x + k * 0.1} cy={b.y - 3.0 * k + k * 0.14} r={k * 0.045} fill="#F2E6D0" />
      <rect x={b.x - k * 0.26} y={b.y - 2.5 * k} width={k * 0.52} height={k * 0.3} rx={k * 0.04} fill={F('#F2E6D0')} />
      <text x={b.x} y={b.y - 2.5 * k + k * 0.22} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={k * 0.22} fill="#2F5FA8">{number}</text>
    </g>
  );
};

/** Things left on the road: a helmet, a flip-flop, a plastic bag. */
export const Litter: React.FC<{ c: Ctx }> = ({ c }) => {
  const f = (X: number, z: number) => ({ p: proj(X, 0, z), k: px(z), z });
  const h = f(2.9, 8.9);
  const s = f(-1.0, 8.6);
  const g = f(-3.0, 13.5);
  return (
    <g>
      <ellipse cx={h.p.x} cy={h.p.y} rx={h.k * 0.26} ry={h.k * 0.05} fill="#000" opacity={0.4} />
      <path d={`M ${h.p.x - h.k * 0.22} ${h.p.y - h.k * 0.02} A ${h.k * 0.22} ${h.k * 0.22} 0 0 1 ${h.p.x + h.k * 0.22} ${h.p.y - h.k * 0.02} Z`} fill={c.F('#E9C46A', h.z)} stroke="#14101C" strokeWidth={1.5} />
      <path d={`M ${h.p.x - h.k * 0.14} ${h.p.y - h.k * 0.12} Q ${h.p.x} ${h.p.y - h.k * 0.22} ${h.p.x + h.k * 0.07} ${h.p.y - h.k * 0.19}`} stroke="#FFFFFF" strokeWidth={1.5} fill="none" opacity={0.5} />
      <ellipse cx={s.p.x} cy={s.p.y} rx={s.k * 0.13} ry={s.k * 0.035} fill={c.F('#2FA595', s.z)} transform={`rotate(-12 ${s.p.x} ${s.p.y})`} />
      <ellipse cx={s.p.x + s.k * 0.34} cy={s.p.y + 2} rx={s.k * 0.13} ry={s.k * 0.035} fill={c.F('#2FA595', s.z)} transform={`rotate(18 ${s.p.x} ${s.p.y})`} />
      <path d={`M ${s.p.x - s.k * 0.05} ${s.p.y - 2} L ${s.p.x + s.k * 0.06} ${s.p.y - 3}`} stroke="#14101C" strokeWidth={1.4} />
      <path d={`M ${g.p.x - g.k * 0.2} ${g.p.y} Q ${g.p.x - g.k * 0.1} ${g.p.y - g.k * 0.3} ${g.p.x + g.k * 0.05} ${g.p.y - g.k * 0.1} Q ${g.p.x + g.k * 0.2} ${g.p.y - g.k * 0.25} ${g.p.x + g.k * 0.25} ${g.p.y} Z`} fill={c.F('#D8D4C8', g.z)} opacity={0.8} />
    </g>
  );
};
