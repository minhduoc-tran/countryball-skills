import React from 'react';
import { rnd } from '../anim';
import { FONT } from '../fonts';
import { ST, proj, px, poly, mixHex, lightOn, Ctx } from '../street-geom';
import type { Pt } from '../room';

// The street's shophouses (nha ong): narrow, tall terraced fronts along both sides, one function per lot so <Street>
// can depth-sort them with the props. Ground floor 4.2 m (a shop with a roller shutter and a sign board), upper
// floors 3.1 m each with balconies, windows, AC units and plants, a parapet, now and then a roof tank. Facade
// parts are drawn as exact projected quads; text on a facade is fitted to its quad with an affine matrix.

const PAL = ['#8C6A5A', '#7C8A8A', '#A08A6A', '#6E7A96', '#9A6A74', '#7E9080', '#B09470', '#8A7A9A'];
const SIGNS: [string, string, string][] = [
  ['TẠP HÓA', '#B8402E', '#FFF1D0'], ['PHỞ', '#2F6B4F', '#FFF1D0'], ['SỬA XE', '#2D4F8A', '#FFE9A0'], ['CẮT TÓC', '#8A3A6A', '#FFF1D0'],
  ['QUÁN CƠM', '#C98A2A', '#2A1A10'], ['NHÀ THUỐC', '#2F8F6A', '#FFFFFF'], ['GIẶT ỦI', '#3A7AA8', '#FFFFFF'], ['CÀ PHÊ', '#6A4A32', '#FFE9B8'],
  ['TRÀ SỮA', '#D86A8A', '#FFFFFF'], ['BÁNH MÌ', '#D8A030', '#4A2A10'], ['VÁ XE', '#5A5A6A', '#FFE060'], ['ĐIỆN NƯỚC', '#3A5A9A', '#FFFFFF'],
];
export const GROUND_H = 4.2;
export const FLOOR_H = 3.1;

export type Lot = { side: -1 | 1; z0: number; z1: number; n: number; h: number; prevH: number; col: string; shutter: number; sign: number; seed: number; alley: boolean; vsign: boolean };

/** The lots along one side: widths 3.4-5.2 m, 1-3 upper storeys, an alley now and then. Same every call. */
export const makeLots = (side: -1 | 1): Lot[] => {
  const out: Lot[] = [];
  let z = side > 0 ? 1.7 : 1.0;
  let prev = 0;
  for (let i = 0; z < 98; i++) {
    const sd = i * 13 + (side > 0 ? 5 : 2);
    const alley = i > 3 && rnd(sd, 1) > 0.9;
    const w = alley ? 1.5 : 3.4 + rnd(sd, 2) * 1.8;
    const n = alley ? 3 : 1 + Math.floor(Math.pow(rnd(sd, 3), 0.8) * 3);
    const r4 = rnd(sd, 4);
    const h = GROUND_H + FLOOR_H * n + 0.5;
    out.push({ side, z0: z, z1: z + w, n, h, prevH: prev, col: PAL[Math.floor(rnd(sd, 5) * PAL.length)], shutter: r4 < 0.42 ? 0.05 : r4 < 0.72 ? 0.5 : 1, sign: Math.floor(rnd(sd, 6) * SIGNS.length), seed: sd, alley, vsign: rnd(sd, 7) > 0.72 });
    prev = h;
    z += w;
  }
  return out;
};

/** Text fitted to a quad: A top-left, B top-right, C bottom-left (screen points). Draws in a w x h box. */
const TextOn: React.FC<{ A: Pt; B: Pt; C: Pt; w: number; h: number; text: string; fill: string; size: number; o?: number }> = ({ A, B, C, w, h, text, fill, size, o = 1 }) => (
  <text x={w / 2} y={h / 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} opacity={o} textLength={w * 0.84} lengthAdjust="spacingAndGlyphs"
    transform={`matrix(${(B.x - A.x) / w} ${(B.y - A.y) / w} ${(C.x - A.x) / h} ${(C.y - A.y) / h} ${A.x} ${A.y})`}>{text}</text>
);

/** Leafy clump (plant, hanging pot) centred at screen (x, y) with radius r. */
export const Leafy: React.FC<{ x: number; y: number; r: number; c: string; seed: number; hi?: string }> = ({ x, y, r, c, seed, hi = '#C8E070' }) => (
  <g>
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={i} cx={x + (rnd(seed, i) - 0.5) * r * 1.4} cy={y - rnd(seed + 1, i) * r * 0.8} rx={r * 0.5} ry={r * 0.3} fill={c} transform={`rotate(${-50 + rnd(seed + 2, i) * 100} ${x} ${y})`} />
    ))}
    <ellipse cx={x - r * 0.1} cy={y - r * 0.85} rx={r * 0.35} ry={r * 0.14} fill={hi} opacity={0.35} />
  </g>
);

/** One shophouse as a node; lit windows and signs register themselves in c.lights. */
export const shopHouse = (lot: Lot, c: Ctx): React.ReactNode => {
  const { side, z0, z1, n, h, seed } = lot;
  const zc = (z0 + z1) / 2;
  const k = px(zc);
  const det = k > 11;
  const F = (hex: string) => c.F(hex, zc);
  const W = ST.wall;
  const sx = (d: number) => side * (W - d);
  const P = (y: number, z: number, d = 0) => proj(sx(d), y, z);
  // a quad on the facade plane (or pushed out by d towards the street)
  const Q = (y0: number, y1: number, za: number, zb: number, d = 0) => poly([[sx(d), y0, za], [sx(d), y1, za], [sx(d), y1, zb], [sx(d), y0, zb]]);
  const on = (q: number) => lightOn(c.black, 0.7 * q + 0.3 * (zc / 98));
  const warm = c.night ? '#FFC880' : '#FFD08A';
  const out: React.ReactNode[] = [];
  const spot = (y: number, z: number, r: number, o = 0.4, kind: 'warm' | 'cool' | 'red' = 'warm', veil = false) => { const p = P(y, z, 0.3); c.lights.push({ x: p.x, y: p.y, r, kind, o, veil }); };

  if (lot.alley) {
    // a dark slot between two houses: a gap with a lamp deep inside and a lit window or two
    out.push(<polygon key="al" points={Q(0, h, z0, z1)} fill={F('#0C0912')} />);
    const lampOn = on(rnd(seed, 40));
    if (det) {
      out.push(<polygon key="alq" points={Q(2.6, 3.2, z0 + 0.4, z1 - 0.4)} fill={F(lampOn ? '#FFD890' : '#2A2230')} opacity={0.85} />);
      if (lampOn) spot(2.9, zc, k * 2.2, 0.5, 'warm', true);
    }
    return <g key={`lot${side}${z0}`}>{out}</g>;
  }

  // the side wall of a taller house showing above a shorter neighbour (a flat face turned to the camera)
  if (h > lot.prevH) out.push(<polygon key="sw" points={poly([[side * W, lot.prevH, z0], [side * (W + 6), lot.prevH, z0], [side * (W + 6), h, z0], [side * W, h, z0]])} fill={F(mixHex(lot.col, '#14101C', 0.55))} />);
  // the facade, a grimy band at the foot, floor slabs, the parapet
  out.push(<polygon key="wall" points={Q(0, h, z0, z1)} fill={F(lot.col)} />);
  out.push(<polygon key="foot" points={Q(0, 0.7, z0, z1)} fill="#000" opacity={0.22} />);
  out.push(<polygon key="gsl" points={Q(GROUND_H - 0.12, GROUND_H + 0.1, z0, z1, 0.12)} fill={F(mixHex(lot.col, '#FFFFFF', 0.12))} />);
  for (let i = 0; i < n; i++) out.push(<polygon key={`sl${i}`} points={Q(GROUND_H + FLOOR_H * (i + 1) - 0.12, GROUND_H + FLOOR_H * (i + 1) + 0.1, z0, z1, 0.12)} fill={F(mixHex(lot.col, '#FFFFFF', 0.12))} />);
  out.push(<polygon key="par" points={Q(h - 0.55, h, z0, z1, 0.1)} fill={F(mixHex(lot.col, '#FFFFFF', 0.18))} />);
  const pa = P(h, z0, 0.1);
  const pb = P(h, z1, 0.1);
  out.push(<path key="parrim" d={`M ${pa.x} ${pa.y} L ${pb.x} ${pb.y}`} stroke="#FFB46A" strokeWidth={Math.max(1, k * 0.05)} opacity={0.55} />);

  // ---- ground floor: shop opening, interior, roller shutter, sign board
  const za = z0 + 0.3;
  const zb = z1 - 0.3;
  const shopLit = on(rnd(seed, 30));
  const sh = lot.shutter;
  out.push(<polygon key="op" points={Q(0, 2.9, za, zb)} fill={F('#1E1620')} />);
  if (sh < 0.99) {
    out.push(<polygon key="in" points={Q(0.1, 2.85, za + 0.1, zb - 0.1, -0.5)} fill={F(shopLit ? mixHex(warm, '#3A2A2A', 0.3) : '#2A2230')} />);
    if (det) {
      for (let j = 0; j < 3; j++) {
        out.push(<polygon key={`sf${j}`} points={Q(0.8 + 0.6 * j, 0.86 + 0.6 * j, za + 0.15, zb - 0.15, -0.45)} fill={F('#3A2A28')} />);
        const cnt = Math.floor((zb - za) / 0.45);
        for (let m = 0; m < cnt; m++) {
          const q = rnd(seed + j, m);
          const a = P(0.9 + 0.6 * j, za + 0.25 + m * 0.45, -0.45);
          out.push(<rect key={`it${j}-${m}`} x={a.x} y={a.y - k * 0.3} width={k * 0.16} height={k * 0.3} fill={F(['#C84A3E', '#E9C46A', '#4A8A6A', '#6A8AC8', '#EDE6D6'][Math.floor(q * 5)])} opacity={shopLit ? 0.9 : 0.4} />);
        }
      }
    }
    if (shopLit) {
      out.push(<polygon key="tube" points={Q(2.62, 2.7, za + 0.2, zb - 0.2, -0.3)} fill="#FFF6D8" />);
      // spill of light on the sidewalk in front of the open shop
      out.push(<polygon key="pool" points={poly([[side * W, ST.kerb, z0], [side * (W - 3), ST.kerb, z0 + 0.5], [side * (W - 3), ST.kerb, z1 - 0.5], [side * W, ST.kerb, z1]])} fill="url(#g3warm)" opacity={0.38} style={{ mixBlendMode: 'screen' }} />);
      spot(1.7, zc, k * 2.4, 0.45, 'warm', true);
    }
  }
  if (sh > 0.01) {
    const yb = 2.9 * (1 - sh); // the shutter's bottom edge
    out.push(<polygon key="sh" points={Q(yb, 2.9, za, zb, 0.05)} fill={F('#6E6A7C')} />);
    if (det) for (let y = yb + 0.12; y < 2.9; y += 0.2) { const a = P(y, za, 0.05); const b = P(y, zb, 0.05); out.push(<path key={`sl${y.toFixed(2)}`} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#4A4658" strokeWidth={Math.max(0.6, k * 0.018)} />); }
    const e1 = P(yb, za, 0.05);
    const e2 = P(yb, zb, 0.05);
    out.push(<path key="shedge" d={`M ${e1.x} ${e1.y} L ${e2.x} ${e2.y}`} stroke="#B8B6C4" strokeWidth={Math.max(1, k * 0.04)} opacity={0.7} />);
    if (sh > 0.99 && shopLit) out.push(<polygon key="seam" points={Q(0, 0.05, za, zb, 0.05)} fill="#FFD890" opacity={0.8} />);
  }
  out.push(<polygon key="box" points={Q(2.9, 3.15, za - 0.1, zb + 0.1, 0.1)} fill={F('#3A3646')} />);
  // the sign board over the shop
  const [stext, sbg, sfg] = SIGNS[lot.sign];
  const signOn = on(rnd(seed, 31));
  out.push(<polygon key="sgn" points={Q(3.2, 4.0, z0 + 0.15, z1 - 0.15, 0.14)} fill={F(signOn ? sbg : mixHex(sbg, '#101018', 0.55))} stroke={F('#14101C')} strokeWidth={Math.max(1, k * 0.03)} />);
  if (det) {
    const zl = side < 0 ? z0 + 0.15 : z1 - 0.15;
    const zr = side < 0 ? z1 - 0.15 : z0 + 0.15;
    out.push(<TextOn key="sgt" A={P(4.0, zl, 0.14)} B={P(4.0, zr, 0.14)} C={P(3.2, zl, 0.14)} w={400} h={80} text={stext} fill={sfg} size={54} o={signOn ? 1 : 0.35} />);
    if (signOn) spot(3.6, zc, k * 1.6, 0.5, 'warm', true);
  }

  // ---- upper floors
  for (let i = 0; i < n; i++) {
    const fy = GROUND_H + FLOOR_H * i + 0.1;
    const style = Math.floor(rnd(seed, 20 + i) * 3);
    const lq = rnd(seed, 50 + i);
    const lit = on(rnd(seed, 60 + i)) && lq < (c.night ? 0.7 : 0.32);
    const glass = lit ? F(warm) : F(mixHex('#2A3350', '#B07A8A', 0.18 + 0.25 * rnd(seed, 70 + i)));
    if (!det) {
      out.push(<polygon key={`fw${i}`} points={Q(fy + 0.6, fy + 2.3, z0 + 0.5, z1 - 0.5)} fill={glass} />);
      continue;
    }
    if (style === 0) {
      // balcony: a glass door behind, the slab's underside and edge, an iron grille, plants, sometimes washing
      out.push(<polygon key={`bd${i}`} points={Q(fy + 0.15, fy + 2.4, z0 + 0.5, z1 - 0.5)} fill={glass} stroke={F('#1E1620')} strokeWidth={Math.max(1, k * 0.04)} />);
      const d = 0.95;
      out.push(<polygon key={`bu${i}`} points={poly([[sx(0), fy - 0.12, z0], [sx(d), fy - 0.12, z0], [sx(d), fy - 0.12, z1], [sx(0), fy - 0.12, z1]])} fill={F('#1E1824')} />);
      out.push(<polygon key={`bf${i}`} points={Q(fy - 0.12, fy + 0.08, z0, z1, d)} fill={F(mixHex(lot.col, '#FFFFFF', 0.1))} />);
      out.push(<polygon key={`be${i}`} points={poly([[sx(0), fy - 0.12, z0], [sx(d), fy - 0.12, z0], [sx(d), fy + 0.08, z0], [sx(0), fy + 0.08, z0]])} fill={F(mixHex(lot.col, '#000000', 0.3))} />);
      const r0 = P(fy + 1.0, z0, d);
      const r1 = P(fy + 1.0, z1, d);
      out.push(<path key={`br${i}`} d={`M ${r0.x} ${r0.y} L ${r1.x} ${r1.y}`} stroke={F('#14101C')} strokeWidth={Math.max(1, k * 0.05)} />);
      const bars = Math.floor((z1 - z0) / 0.2);
      let dd = '';
      for (let m = 0; m <= bars; m++) { const a = P(fy + 0.08, z0 + (m * (z1 - z0)) / bars, d); const b = P(fy + 1.0, z0 + (m * (z1 - z0)) / bars, d); dd += `M ${a.x} ${a.y} L ${b.x} ${b.y} `; }
      out.push(<path key={`bg${i}`} d={dd} stroke={F('#14101C')} strokeWidth={Math.max(0.6, k * 0.022)} opacity={0.85} />);
      for (let m = 0; m < 2; m++) {
        if (rnd(seed, 80 + i * 3 + m) > 0.6) continue;
        const pp = P(fy + 0.08, z0 + 0.5 + rnd(seed, 90 + i * 3 + m) * (z1 - z0 - 1), 0.75);
        out.push(<g key={`pl${i}${m}`}><rect x={pp.x - k * 0.14} y={pp.y - k * 0.22} width={k * 0.28} height={k * 0.22} fill={F('#A8553E')} /><Leafy x={pp.x} y={pp.y - k * 0.22} r={k * 0.5} c={F('#4F8A4C')} seed={seed + i + m} /></g>);
      }
      if (rnd(seed, 100 + i) > 0.72) {
        const cl = ['#D8483C', '#E9C46A', '#4A8AC8', '#EDE6D6'];
        for (let m = 0; m < 3; m++) out.push(<polygon key={`cl${i}${m}`} points={poly([[sx(d), fy + 1.9, z0 + 0.6 + m * 0.9], [sx(d), fy + 1.9, z0 + 1.3 + m * 0.9], [sx(d), fy + 1.2, z0 + 1.3 + m * 0.9], [sx(d), fy + 1.2, z0 + 0.6 + m * 0.9]])} fill={F(cl[(m + i) % 4])} />);
        out.push(<path key={`cb${i}`} d={`M ${P(fy + 1.9, z0 + 0.5, d).x} ${P(fy + 1.9, z0 + 0.5, d).y} L ${P(fy + 1.9, z0 + 3.4, d).x} ${P(fy + 1.9, z0 + 3.4, d).y}`} stroke={F('#14101C')} strokeWidth={Math.max(1, k * 0.03)} />);
      }
    } else {
      const two = style === 1;
      const wz = two ? [[z0 + 0.5, (z0 + z1) / 2 - 0.2], [(z0 + z1) / 2 + 0.2, z1 - 0.5]] : [[z0 + 0.5, z1 - 0.5]];
      wz.forEach(([a, b], m) => {
        out.push(<polygon key={`w${i}${m}`} points={Q(fy + 0.5, fy + 2.3, a, b)} fill={glass} stroke={F(mixHex(lot.col, '#FFFFFF', 0.25))} strokeWidth={Math.max(1, k * 0.06)} />);
        if (!lit) {
          const g0 = P(fy + 2.3, a, 0);
          const g1 = P(fy + 0.5, b, 0);
          out.push(<path key={`wg${i}${m}`} d={`M ${g0.x} ${g0.y} L ${g1.x} ${g1.y}`} stroke="#FFB46A" strokeWidth={Math.max(1, k * 0.05)} opacity={0.25} />);
        }
        for (let y = fy + 0.7; y < fy + 2.3; y += 0.3) { const q0 = P(y, a, 0); const q1 = P(y, b, 0); out.push(<path key={`wb${i}${m}${y.toFixed(1)}`} d={`M ${q0.x} ${q0.y} L ${q1.x} ${q1.y}`} stroke={F('#14101C')} strokeWidth={Math.max(0.5, k * 0.012)} opacity={lit ? 0.5 : 0.2} />); }
        if (style === 1 && m === 0 && rnd(seed, 110 + i) > 0.35) {
          // an AC unit on the wall: front face, end face, fan
          const ua = (a + b) / 2 - 0.4;
          out.push(<polygon key={`ace${i}`} points={poly([[sx(0), fy + 0.05, ua], [sx(0.35), fy + 0.05, ua], [sx(0.35), fy + 0.5, ua], [sx(0), fy + 0.5, ua]])} fill={F('#6A687A')} />);
          out.push(<polygon key={`acf${i}`} points={Q(fy + 0.05, fy + 0.5, ua, ua + 0.8, 0.35)} fill={F('#A8A6B6')} />);
          const fc = P(fy + 0.28, ua + 0.4, 0.35);
          out.push(<ellipse key={`acfan${i}`} cx={fc.x} cy={fc.y} rx={k * 0.12} ry={k * 0.1} fill={F('#4A4858')} />);
        }
      });
      if (!two && rnd(seed, 120 + i) > 0.4) {
        const ledge = P(fy + 0.5, zc, 0.4);
        out.push(<g key={`pb${i}`}><rect x={ledge.x - k * 0.7} y={ledge.y - k * 0.12} width={k * 1.4} height={k * 0.14} fill={F('#7A5A44')} /><Leafy x={ledge.x - k * 0.3} y={ledge.y - k * 0.12} r={k * 0.5} c={F('#4F8A4C')} seed={seed + i} /><Leafy x={ledge.x + k * 0.35} y={ledge.y - k * 0.12} r={k * 0.45} c={F('#3D6E44')} seed={seed + i + 3} /></g>);
      }
    }
  }
  // vertical blade sign, a roof water tank and an aerial
  if (lot.vsign && det) {
    const vz = z0 + 0.2;
    const d = 0.85;
    out.push(<polygon key="vs" points={poly([[sx(0), 5.6, vz], [sx(d), 5.6, vz], [sx(d), 8.0, vz], [sx(0), 8.0, vz]])} fill={F('#2F6B4F')} stroke={F('#14101C')} strokeWidth={Math.max(1, k * 0.03)} />);
    const A = proj(side < 0 ? sx(0) : sx(d), 8.0, vz);
    const B = proj(side < 0 ? sx(d) : sx(0), 8.0, vz);
    const C = proj(side < 0 ? sx(0) : sx(d), 5.6, vz);
    out.push(<TextOn key="vst" A={A} B={B} C={C} w={100} h={140} text={lot.sign % 2 ? 'NHÀ TRỌ' : 'CHO THUÊ'} fill="#FFF1D0" size={26} />);
  }
  if (rnd(seed, 130) > 0.62 && k > 6) {
    const tc = proj(side * (W + 1.8), h, zc);
    out.push(<g key="tank"><rect x={tc.x - k * 0.1} y={tc.y - k * 0.5} width={k * 0.2} height={k * 0.5} fill={F('#3A3646')} /><rect x={tc.x - k * 0.6} y={tc.y - k * 1.5} width={k * 1.2} height={k * 1.1} rx={k * 0.3} fill={F('#7A8896')} /><path d={`M ${tc.x - k * 0.6} ${tc.y - k * 1.1} L ${tc.x + k * 0.6} ${tc.y - k * 1.1}`} stroke={F('#4A5866')} strokeWidth={k * 0.06} /><path d={`M ${tc.x - k * 0.5} ${tc.y - k * 1.5} Q ${tc.x} ${tc.y - k * 1.62} ${tc.x + k * 0.5} ${tc.y - k * 1.5}`} stroke="#FFB46A" strokeWidth={Math.max(1, k * 0.04)} fill="none" opacity={0.6} /></g>);
  }
  // the lot's near edge, a dark line that separates it from its neighbour
  const e0 = P(0, z0, 0);
  const e1 = P(h, z0, 0);
  out.push(<path key="edge" d={`M ${e0.x} ${e0.y} L ${e1.x} ${e1.y}`} stroke={F('#14101C')} strokeWidth={Math.max(1, k * 0.06)} />);
  return <g key={`lot${side}${z0}`}>{out}</g>;
};
