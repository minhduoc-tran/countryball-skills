import React from 'react';
import { rnd } from '../anim';
import { Room, Pt, pts } from '../room';
import { Teddy, Ball, ToyRobot, ToyCar } from './toy-sprites';

// Goods for the supermarket (and its toy-store twin): generic packs drawn as polygons on a unit square, mapped onto a
// shelf face in perspective (or onto a flat rectangle for macro inserts). No lettering, no brands: boxes with a band
// and a window, cartons, bottles, jars, snack bags, tins; for toys, boxed toys and upright sprites (bears, balls,
// robots, cars). Everything is a pure function of its inputs (rnd, never Math.random).

/** Maps a shape's unit coordinates (a across 0..1, b up 0..1) to the screen. */
export type Map2 = (a: number, b: number) => Pt;
export const PAL = ['#E4572E', '#F6B93B', '#3E9BD6', '#58B368', '#E86AA6', '#8E6AD8', '#F28F3B', '#2FB7A6', '#D94452', '#EFE2BC', '#4A6FD0', '#9BCB4C'];
const CREAM = '#F4EBD2';

export type Kind = 'box' | 'carton' | 'bottle' | 'jar' | 'bag' | 'can' | 'toybox';
export type SpriteKind = 'bear' | 'ball' | 'robot' | 'car';
export type Good = { row: number; w0: number; w1: number; hf: number; kind: Kind | SpriteKind; c1: string; c2: string; c3: string; rank: number };

/** The shelf bay on each side of the aisle: the inner face's u, where the bays start in depth, and the row heights (v). */
export const SHELF = { uIn: [0.18, 0.82] as const, w0: 0.21, top: 0.2, head: 0.285, vb: [0.43, 0.575, 0.72, 0.865, 0.965], rowH: [0.145, 0.145, 0.145, 0.145, 0.1] };

/** Map a shelf face (plane u) segment w0..w1 standing on v = vBottom, hv tall, onto the screen. */
export const faceMapper = (r: Room, u: number, w0: number, w1: number, vBottom: number, hv: number): Map2 => (a, b) => r.P(u, vBottom - b * hv, w0 + a * (w1 - w0));
/** A flat (front-on) mapper: x, y the bottom left, w by h px. */
export const flatMapper = (x: number, y: number, w: number, h: number): Map2 => (a, b) => ({ x: x + a * w, y: y - b * h });

const poly = (m: Map2, p: number[][]) => pts(p.map(([a, b]) => m(a, b)));
const ngon = (cx: number, cy: number, rx: number, ry: number, n = 10, rot = 0) => Array.from({ length: n }).map((_, i) => [cx + Math.cos(rot + (i / n) * Math.PI * 2) * rx, cy + Math.sin(rot + (i / n) * Math.PI * 2) * ry]);

/** One pack on a unit square. c1 the body, c2 the band or label, c3 the window or light accent. */
export const Art: React.FC<{ kind: Kind; m: Map2; c1: string; c2: string; c3: string }> = ({ kind, m, c1, c2, c3 }) => {
  const P = (p: number[][]) => poly(m, p);
  let body: React.ReactNode;
  if (kind === 'box') {
    body = (
      <g>
        <polygon points={P([[0.04, 0], [0.96, 0], [0.96, 1], [0.04, 1]])} fill={c1} />
        <polygon points={P([[0.04, 0.5], [0.96, 0.5], [0.96, 0.72], [0.04, 0.72]])} fill={c2} />
        <polygon points={P([[0.2, 0.08], [0.8, 0.08], [0.8, 0.42], [0.2, 0.42]])} fill={c3} />
        <polygon points={P([[0.5, 0.38], [0.3, 0.14], [0.7, 0.14]])} fill={c1} />
        <polygon points={P(ngon(0.5, 0.86, 0.2, 0.08))} fill={c3} />
      </g>
    );
  } else if (kind === 'carton') {
    body = (
      <g>
        <polygon points={P([[0.08, 0], [0.92, 0], [0.92, 0.84], [0.5, 1], [0.08, 0.84]])} fill={c1} />
        <polygon points={P([[0.08, 0.84], [0.5, 1], [0.92, 0.84], [0.92, 0.78], [0.08, 0.78]])} fill={c2} />
        <polygon points={P([[0.08, 0.3], [0.92, 0.3], [0.92, 0.55], [0.08, 0.55]])} fill={c2} />
        <polygon points={P(ngon(0.5, 0.42, 0.22, 0.12))} fill={c3} />
      </g>
    );
  } else if (kind === 'bottle') {
    body = (
      <g>
        <polygon points={P([[0.14, 0], [0.86, 0], [0.86, 0.6], [0.62, 0.74], [0.62, 0.86], [0.38, 0.86], [0.38, 0.74], [0.14, 0.6]])} fill={c1} />
        <polygon points={P([[0.36, 0.86], [0.64, 0.86], [0.64, 1], [0.36, 1]])} fill={c2} />
        <polygon points={P([[0.14, 0.2], [0.86, 0.2], [0.86, 0.5], [0.14, 0.5]])} fill={c3} />
        <polygon points={P([[0.14, 0.32], [0.86, 0.32], [0.86, 0.38], [0.14, 0.38]])} fill={c2} />
      </g>
    );
  } else if (kind === 'jar') {
    body = (
      <g>
        <polygon points={P([[0.06, 0], [0.94, 0], [0.94, 0.78], [0.06, 0.78]])} fill={c1} />
        <polygon points={P([[0.02, 0.78], [0.98, 0.78], [0.98, 1], [0.02, 1]])} fill={c2} />
        <polygon points={P([[0.06, 0.16], [0.94, 0.16], [0.94, 0.58], [0.06, 0.58]])} fill={c3} />
        <polygon points={P(ngon(0.5, 0.37, 0.2, 0.14))} fill={c1} />
      </g>
    );
  } else if (kind === 'bag') {
    const top: number[][] = Array.from({ length: 9 }).map((_, i) => [0.04 + (i / 8) * 0.92, i % 2 ? 0.93 : 1]);
    body = (
      <g>
        <polygon points={P([[0.06, 0], [0.94, 0], [0.98, 0.5], ...top.slice().reverse(), [0.02, 0.5]])} fill={c1} />
        <polygon points={P([[0.02, 0.55], [0.98, 0.55], [0.97, 0.7], [0.03, 0.7]])} fill={c2} />
        <polygon points={P(ngon(0.5, 0.32, 0.3, 0.2))} fill={c3} />
        <polygon points={P([[0.06, 0], [0.94, 0], [0.95, 0.06], [0.05, 0.06]])} fill={c2} />
      </g>
    );
  } else if (kind === 'can') {
    body = (
      <g>
        <polygon points={P([[0.1, 0], [0.9, 0], [0.9, 1], [0.1, 1]])} fill="#C9D1DD" />
        <polygon points={P([[0.1, 0.1], [0.9, 0.1], [0.9, 0.86], [0.1, 0.86]])} fill={c1} />
        <polygon points={P([[0.1, 0.4], [0.9, 0.4], [0.9, 0.62], [0.1, 0.62]])} fill={c2} />
        <polygon points={P(ngon(0.5, 0.5, 0.26, 0.1))} fill={c3} />
      </g>
    );
  } else {
    // boxed toy: a picture panel with a sun and a ground
    body = (
      <g>
        <polygon points={P([[0.03, 0], [0.97, 0], [0.97, 1], [0.03, 1]])} fill={c1} />
        <polygon points={P([[0.12, 0.14], [0.88, 0.14], [0.88, 0.86], [0.12, 0.86]])} fill={c3} />
        <polygon points={P([[0.12, 0.14], [0.88, 0.14], [0.88, 0.34], [0.12, 0.34]])} fill={c2} />
        <polygon points={P(ngon(0.64, 0.64, 0.17, 0.13))} fill={c1} />
        <polygon points={P([[0.2, 0.4], [0.42, 0.7], [0.34, 0.7]])} fill={c2} />
        <polygon points={P([[0.12, 0.92], [0.88, 0.92], [0.88, 1], [0.12, 1]])} fill={c2} />
      </g>
    );
  }
  return (
    <g>
      {body}
      <polygon points={P([[0.04, 0], [0.96, 0], [0.96, 0.12], [0.04, 0.12]])} fill="#000" opacity={0.16} />
      <polygon points={P([[0.06, 0.06], [0.17, 0.06], [0.17, 0.92], [0.06, 0.92]])} fill="#fff" opacity={0.16} />
    </g>
  );
};

// ---------- what goes on which row ----------
const ROWS_FOOD: Kind[][] = [['bag', 'carton', 'box'], ['box', 'box', 'carton', 'bag'], ['bottle', 'bottle', 'jar', 'carton'], ['jar', 'can', 'bottle', 'box'], ['can', 'can', 'box', 'bottle']];
const ROWS_TOY: (Kind | SpriteKind)[][] = [['bear', 'bear', 'toybox', 'robot'], ['toybox', 'toybox', 'toybox', 'robot'], ['ball', 'robot', 'ball', 'toybox'], ['car', 'car', 'toybox', 'ball'], ['toybox', 'ball', 'car', 'toybox']];
const WIDTH: Record<Kind, number> = { box: 0.034, carton: 0.03, bottle: 0.02, jar: 0.024, bag: 0.036, can: 0.018, toybox: 0.04 };
const HEIGHT: Record<string, number> = { box: 0.92, carton: 0.9, bottle: 0.88, jar: 0.6, bag: 0.9, can: 0.62, toybox: 0.95, bear: 0.98, ball: 0.5, robot: 0.98, car: 0.46 };
const isSprite = (k: string): k is SpriteKind => k === 'bear' || k === 'ball' || k === 'robot' || k === 'car';

/** Everything on one side's shelves, from far to near, row by row. `side` 0 left, 1 right. */
export const makeGoods = (r: Room, side: 0 | 1, toys: boolean): Good[] => {
  const out: Good[] = [];
  for (let row = 0; row < 5; row++) {
    const seed = side * 101 + row * 13 + (toys ? 500 : 0);
    const kinds = toys ? ROWS_TOY[row] : ROWS_FOOD[row];
    const hpx = (w: number) => SHELF.rowH[row] * (r.back.y1 - r.back.y0) * r.s(w);
    let w = SHELF.w0 + rnd(seed, 99) * 0.01;
    let g = 0;
    while (w < 0.985) {
      const sec = Math.floor((w - 0.2) / 0.14);
      const kind = kinds[Math.floor(rnd(seed, g) * kinds.length)];
      const c1 = PAL[(sec * 3 + g + side * 5 + row) % PAL.length];
      const c2 = PAL[(sec * 5 + g * 2 + 4 + row * 3) % PAL.length];
      const c3 = rnd(seed + 5, g) > 0.5 ? CREAM : PAL[(g * 7 + sec + 2) % PAL.length];
      const n = isSprite(kind) ? 1 : 2 + Math.floor(rnd(seed + 1, g) * 3);
      // a sprite's width in w follows its on-screen size: wider in depth the further away it is
      const iw = isSprite(kind) ? Math.max(0.045, (0.9 * HEIGHT[kind] * hpx(w)) / (170 * 0.783 * r.s(w) * r.s(w))) : WIDTH[kind];
      for (let i = 0; i < n; i++) {
        out.push({ row, w0: w + i * iw, w1: w + (i + 1) * iw - 0.0015, hf: HEIGHT[kind] * (0.9 + 0.1 * rnd(seed + 2, g * 4 + i)), kind, c1, c2, c3, rank: rnd(seed + 3, g * 8 + i) });
      }
      w += n * iw + 0.004 + (rnd(seed + 4, g) > 0.8 ? 0.012 : 0);
      g++;
    }
  }
  return out;
};

/** A sprite toy standing at the middle of a good's slot on its shelf. */
const SpriteGood: React.FC<{ r: Room; u: number; g: Good; vBottom: number }> = ({ r, u, g, vBottom }) => {
  const wc = (g.w0 + g.w1) / 2;
  const p = r.P(u, vBottom, wc);
  const h = g.hf * SHELF.rowH[g.row] * (r.back.y1 - r.back.y0) * r.s(wc);
  if (g.kind === 'bear') return <Teddy x={p.x} y={p.y} h={h} fur={g.c1} belly={g.c3 === CREAM ? '#EAD3AE' : g.c3} bow={g.c2} shadow={false} />;
  if (g.kind === 'ball') return <Ball x={p.x} y={p.y} r={h / 2} c1={g.c1} c2={g.c2} c3={g.c3} />;
  if (g.kind === 'robot') return <ToyRobot x={p.x} y={p.y} h={h} body={g.c1} trim={g.c2} />;
  return <ToyCar x={p.x} y={p.y} w={h * 2.2} body={g.c1} stripe={g.c3} />;
};

/**
 * One side of the aisle: the dark bay, rows of goods (gone as `empty` rises: each pack has its own rank), the shelf
 * lips with price-tag strips, steel uprights and a coloured header. Reflections of the bottom row sit under the floor.
 */
export const ShelfSide: React.FC<{ r: Room; id: string; side: 0 | 1; goods: Good[]; empty?: number; header?: [string, string] }> = ({
  r, id, side, goods, empty = 0, header = ['#2F6FA8', '#E4572E'] }) => {
  const u = SHELF.uIn[side];
  const { Q, P } = r;
  const present = goods.filter((g) => g.rank >= empty * 1.05);
  const sprites: React.ReactNode[] = [];
  const packs: React.ReactNode[] = [];
  const refl: React.ReactNode[] = [];
  present.forEach((g, i) => {
    const vb = SHELF.vb[g.row];
    if (isSprite(g.kind)) {
      sprites.push(<SpriteGood key={`s${i}`} r={r} u={u} g={g} vBottom={vb} />);
      return;
    }
    const hv = g.hf * SHELF.rowH[g.row];
    packs.push(<Art key={`p${i}`} kind={g.kind} m={faceMapper(r, u, g.w0, g.w1, vb, hv)} c1={g.c1} c2={g.c2} c3={g.c3} />);
    if (g.row === 4) refl.push(<Art key={`r${i}`} kind={g.kind} m={(a, b) => r.P(u, 2 * 1 - (vb - b * hv), g.w0 + a * (g.w1 - g.w0))} c1={g.c1} c2={g.c2} c3={g.c3} />);
  });
  const tags: React.ReactNode[] = [];
  const lips: React.ReactNode[] = [];
  SHELF.vb.forEach((vb, row) => {
    lips.push(<polygon key={`l${row}`} points={Q([[u, vb, SHELF.w0], [u, vb, 1], [u, vb + 0.018, 1], [u, vb + 0.018, SHELF.w0]])} fill="#8D96A8" />);
    lips.push(<polygon key={`s${row}`} points={Q([[u, vb + 0.003, SHELF.w0], [u, vb + 0.003, 1], [u, vb + 0.015, 1], [u, vb + 0.015, SHELF.w0]])} fill="#ECE8DA" />);
    for (let w = SHELF.w0 + 0.01; w < 0.985; w += 0.05) {
      const c = ['#F6D04D', '#D94452', '#3E9BD6'][Math.floor(rnd(side * 31 + row, w * 100) * 3)];
      tags.push(<polygon key={`t${row}-${w.toFixed(3)}`} points={Q([[u, vb + 0.004, w], [u, vb + 0.004, w + 0.018], [u, vb + 0.014, w + 0.018], [u, vb + 0.014, w]])} fill={c} />);
    }
  });
  const posts: React.ReactNode[] = [];
  for (let w = SHELF.w0; w < 1; w += 0.13) {
    posts.push(<polygon key={`u${w.toFixed(2)}`} points={Q([[u, SHELF.top, w], [u, SHELF.top, w + 0.007], [u, 1, w + 0.007], [u, 1, w]])} fill="#5C657A" />);
  }
  const a = P(u, 0.5, SHELF.w0);
  const b = P(u, 0.5, 0.62);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}haze${side}`} gradientUnits="userSpaceOnUse" x1={a.x} y1={0} x2={b.x} y2={0}>
          <stop offset="0%" stopColor="#B4C6DA" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#B4C6DA" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={Q([[u, SHELF.top, SHELF.w0], [u, SHELF.top, 1], [u, 1, 1], [u, 1, SHELF.w0]])} fill="#2A2F3D" />
      <g opacity={0.9}>{refl}</g>
      {packs}
      {sprites}
      {lips}
      {tags}
      {posts}
      {/* the header band, in blocks of colour, and the lit top edge */}
      {Array.from({ length: 6 }).map((_, i) => {
        const w0 = SHELF.w0 + (i * (1 - SHELF.w0)) / 6;
        const w1 = SHELF.w0 + ((i + 1) * (1 - SHELF.w0)) / 6;
        return <polygon key={`h${i}`} points={Q([[u, SHELF.top, w0], [u, SHELF.top, w1], [u, SHELF.head, w1], [u, SHELF.head, w0]])} fill={header[i % 2]} />;
      })}
      <polygon points={Q([[u, SHELF.top, SHELF.w0], [u, SHELF.top, 1], [u, SHELF.head, 1], [u, SHELF.head, SHELF.w0]])} fill={`url(#${id}haze${side})`} />
      <path d={`M ${P(u, SHELF.top, SHELF.w0).x} ${P(u, SHELF.top, SHELF.w0).y} L ${P(u, SHELF.top, 1).x} ${P(u, SHELF.top, 1).y}`} stroke="#FFD39A" strokeWidth={2.5} opacity={0.5} />
      <polygon points={Q([[u, 0.965, SHELF.w0], [u, 0.965, 1], [u, 1, 1], [u, 1, SHELF.w0]])} fill="#1E212B" />
    </g>
  );
};

// ---------- the macro shelf (front-on, for inserts) ----------
export type MacroSlot = { kind: Kind; x: number; w: number; c1: string; c2: string; c3: string };
/** A row of packs laid out left to right across the frame (px). Deterministic from `seed`; slot i is the pack the hand takes. */
export const macroRow = (seed: number, kinds: Kind[], x0 = -80, x1 = 2000, wBase = 190): MacroSlot[] => {
  const out: MacroSlot[] = [];
  let x = x0;
  let i = 0;
  while (x < x1) {
    const kind = kinds[Math.floor(rnd(seed, i) * kinds.length)];
    const w = wBase * (kind === 'bottle' || kind === 'can' ? 0.6 : kind === 'jar' ? 0.8 : 1) * (0.92 + 0.16 * rnd(seed + 1, i));
    out.push({ kind, x, w, c1: PAL[(i * 5 + seed) % PAL.length], c2: PAL[(i * 3 + seed + 4) % PAL.length], c3: rnd(seed + 2, i) > 0.5 ? CREAM : PAL[(i * 7 + 2) % PAL.length] });
    x += w + 8;
    i++;
  }
  return out;
};

/** A front-on shelf row: packs standing on a board at y (their bottoms), `h` tall, with the lip and price strip below. */
export const MacroRow: React.FC<{ slots: MacroSlot[]; y: number; h: number; omit?: number; lip?: boolean }> = ({ slots, y, h, omit = -1, lip = true }) => (
  <g>
    {slots.map((s, i) => {
      if (i === omit) return null;
      const hh = h * (s.kind === 'bottle' ? 1 : s.kind === 'jar' || s.kind === 'can' ? 0.66 : 0.94);
      return (
        <g key={i}>
          <ellipse cx={s.x + s.w / 2 + 10} cy={y + 2} rx={s.w * 0.55} ry={8} fill="#000" opacity={0.35} />
          <Art kind={s.kind} m={flatMapper(s.x, y, s.w, hh)} c1={s.c1} c2={s.c2} c3={s.c3} />
        </g>
      );
    })}
    {lip ? (
      <g>
        <rect x={-100} y={y} width={2200} height={46} fill="#8D96A8" />
        <rect x={-100} y={y + 8} width={2200} height={30} fill="#ECE8DA" />
        {Array.from({ length: 16 }).map((_, i) => (
          <g key={i}>
            <rect x={20 + i * 135} y={y + 10} width={64} height={26} fill={['#F6D04D', '#D94452', '#3E9BD6'][i % 3]} />
            <rect x={28 + i * 135} y={y + 18} width={34} height={5} fill="#1D1A26" opacity={0.65} />
          </g>
        ))}
        <rect x={-100} y={y} width={2200} height={3} fill="#FFD39A" opacity={0.7} />
      </g>
    ) : null}
  </g>
);

/** Things knocked onto the floor (progressively with `n`), as lying packs and tins in screen space around the aisle. */
export const FloorDebris: React.FC<{ r: Room; n: number; toys?: boolean }> = ({ r, n, toys = false }) => (
  <g>
    {Array.from({ length: Math.min(40, Math.round(n)) }).map((_, i) => {
      const u = 0.24 + rnd(71, i) * 0.52;
      const w = 0.22 + rnd(72, i) * 0.74;
      const p = r.P(u, 1, w);
      const k = r.s(w) * 0.9;
      const rot = (rnd(73, i) - 0.5) * 150;
      const c = PAL[Math.floor(rnd(74, i) * PAL.length)];
      const pick = Math.floor(rnd(75, i) * 4);
      return (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${k})`}>
          <ellipse cx={4} cy={1} rx={22} ry={5} fill="#000" opacity={0.4} />
          <g transform={`rotate(${rot})`}>
            {toys ? (
              pick % 2 ? <Teddy x={0} y={0} h={46} fur={c} belly="#EAD3AE" bow={null} shadow={false} /> : <Ball x={0} y={0} r={11} c1={c} />
            ) : pick === 0 ? (
              <g><rect x={-15} y={-20} width={30} height={20} fill={c} /><rect x={-15} y={-12} width={30} height={6} fill={CREAM} /></g>
            ) : pick === 1 ? (
              <g><rect x={-16} y={-12} width={32} height={12} rx={2} fill={c} /><rect x={-17} y={-12} width={4} height={12} fill="#C9D1DD" /><rect x={13} y={-12} width={4} height={12} fill="#C9D1DD" /></g>
            ) : pick === 2 ? (
              <path d="M -16 0 L -14 -22 L -8 -19 L 0 -23 L 8 -19 L 14 -22 L 16 0 Z" fill={c} />
            ) : (
              <g><rect x={-16} y={-9} width={26} height={9} rx={2} fill={c} /><rect x={10} y={-6} width={7} height={4} fill="#EFE2BC" /></g>
            )}
          </g>
        </g>
      );
    })}
  </g>
);
