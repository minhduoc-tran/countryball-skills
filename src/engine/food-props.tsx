import React from 'react';
import { rnd, easeOut, clamp } from './anim';

// Food and shop props, drawn like props.tsx: flat fills, a darker shade on the side away from the light (the left),
// a warm rim line on the lit (right) edge, and a contact shadow. Everything is generic: no lettering, no brands, a
// colour and a simple picture on the label. Origins are noted per prop (mostly the middle of the base, so a prop sits
// on a surface at the point you give it).

const RIM = '#FFD39A';
const INK = '#1D1A26';
const CHROME = '#B8C2D0';
const CHROME_DK = '#6C7686';
const TIN = '#C9D1DD';
const LABELS = ['#D94452', '#F6B93B', '#58B368', '#3E9BD6', '#E86AA6', '#F28F3B', '#8E6AD8', '#2FB7A6'];

// ---------- the shopping cart ----------
/** Where a good sits inside the basket (cart-local, at s = 1): the middle of the basket floor. Put children around it. */
export const CART_BASKET = { x: -18, y: -100 };

/**
 * A shopping cart in three-quarter view, nose to the right: x, y the middle of the base on the floor, s the scale
 * (about 220 wide and 225 tall at s = 1). `children` are drawn inside the basket in cart-local coordinates (origin at
 * the floor, around CART_BASKET), behind the wire sides, so goods show through the mesh. `flip` mirrors it.
 */
export const ShoppingCart: React.FC<{ x: number; y: number; s?: number; flip?: boolean; children?: React.ReactNode }> = ({ x, y, s = 1, flip = false, children }) => {
  const d = { x: 40, y: -24 }; // the depth vector, up and to the right
  const TL = { x: -100, y: -150 };
  const TR = { x: 50, y: -150 };
  const BL = { x: -84, y: -92 };
  const BR = { x: 36, y: -92 };
  const add = (p: { x: number; y: number }, q = d) => ({ x: p.x + q.x, y: p.y + q.y });
  const pt = (p: { x: number; y: number }) => `${p.x},${p.y}`;
  const quad = (...p: { x: number; y: number }[]) => p.map(pt).join(' ');
  const lerp2 = (a: { x: number; y: number }, b: { x: number; y: number }, k: number) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
  // wire mesh on a quad given by its four corners (top-left, top-right, bottom-right, bottom-left)
  const mesh = (a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }, e: { x: number; y: number }, nx: number, ny: number, key: string) => (
    <g key={key} stroke="#DCE3EE" strokeWidth={1.8} opacity={0.85}>
      {Array.from({ length: nx + 1 }).map((_, i) => {
        const p = lerp2(a, b, i / nx);
        const q = lerp2(e, c, i / nx);
        return <path key={`v${i}`} d={`M ${p.x} ${p.y} L ${q.x} ${q.y}`} />;
      })}
      {Array.from({ length: ny + 1 }).map((_, i) => {
        const p = lerp2(a, e, i / ny);
        const q = lerp2(b, c, i / ny);
        return <path key={`h${i}`} d={`M ${p.x} ${p.y} L ${q.x} ${q.y}`} />;
      })}
    </g>
  );
  const wheel = (cx: number, cy: number, r: number, k: string) => (
    <g key={k}>
      <circle cx={cx} cy={cy} r={r} fill="#14131A" />
      <circle cx={cx} cy={cy} r={r * 0.45} fill={TIN} />
      <path d={`M ${cx} ${cy - r * 0.45} L ${cx} ${cy - r * 2.2}`} stroke={CHROME_DK} strokeWidth={4} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={14} cy={2} rx={118} ry={13} fill="#000" opacity={0.38} />
      {/* far wheels, the lower tray, the legs */}
      {wheel(-34, -32, 8, 'wf1')}
      {wheel(66, -32, 8, 'wf2')}
      <polygon points={quad({ x: -78, y: -46 }, { x: 34, y: -46 }, add({ x: 34, y: -46 }), add({ x: -78, y: -46 }))} fill={CHROME_DK} opacity={0.9} />
      <path d={`M ${BL.x + 4} ${BL.y} L -74 -22 M ${BR.x - 4} ${BR.y} L 28 -22 M ${add(BR).x} ${add(BR).y} L 66 -42`} stroke={CHROME_DK} strokeWidth={5} />
      <polygon points={quad({ x: -78, y: -46 }, { x: 34, y: -46 }, { x: 34, y: -41 }, { x: -78, y: -41 })} fill={CHROME} />
      {wheel(-74, -12, 11, 'wn1')}
      {wheel(28, -12, 11, 'wn2')}
      {/* the basket's inside: far wall, left wall, floor */}
      <polygon points={quad(add(TL), add(TR), add(BR), add(BL))} fill="#2A3140" />
      <polygon points={quad(TL, add(TL), add(BL), BL)} fill="#222836" />
      <polygon points={quad(BL, BR, add(BR), add(BL))} fill="#394155" />
      {mesh(add(TL), add(TR), add(BR), add(BL), 10, 4, 'far')}
      <g>{children}</g>
      {/* the near side and the nose, as translucent mesh so goods read through them */}
      <polygon points={quad(TL, TR, BR, BL)} fill="#1C2230" opacity={0.3} />
      {mesh(TL, TR, BR, BL, 11, 4, 'near')}
      <polygon points={quad(TR, add(TR), add(BR), BR)} fill="#3A4254" opacity={0.4} />
      {mesh(TR, add(TR), add(BR), BR, 4, 4, 'nose')}
      <polygon points={quad(BL, BR, { x: BR.x, y: BR.y + 5 }, { x: BL.x, y: BL.y + 5 })} fill={CHROME} />
      {/* rim rails along the top */}
      <path d={`M ${TL.x} ${TL.y} L ${TR.x} ${TR.y} L ${add(TR).x} ${add(TR).y} L ${add(TL).x} ${add(TL).y} Z`} fill="none" stroke={CHROME} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M ${TR.x} ${TR.y} L ${add(TR).x} ${add(TR).y}`} stroke={RIM} strokeWidth={2.5} opacity={0.6} />
      {/* the handle: two posts up and back, a plastic grip */}
      <path d={`M ${TL.x} ${TL.y} L -114 -200 M ${add(TL).x} ${add(TL).y} L -74 -224`} stroke={CHROME} strokeWidth={6} strokeLinecap="round" />
      <path d="M -114 -200 L -74 -224" stroke="#F28F3B" strokeWidth={12} strokeLinecap="round" />
      <path d="M -112 -204 L -76 -226" stroke="#FFC48A" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      {/* near wheels over the legs */}
      {wheel(-74, -12, 11, 'wn1b')}
      {wheel(28, -12, 11, 'wn2b')}
    </g>
  );
};

// ---------- an ice-cream cone ----------
/**
 * A two-scoop cone, tip down: x, y the middle of the cone (hold it there), s the scale (about 150 tall), `rot` tilts
 * it about that point. `bite` 0..1 takes bites out of the scoops from the upper right; give each cone its own `id`
 * when two are on screen (the bite is a mask).
 */
export const IceCreamCone: React.FC<{ x: number; y: number; s?: number; rot?: number; bite?: number; id?: string; c1?: string; c2?: string }> = ({
  x, y, s = 1, rot = 0, bite = 0, id = 'ic', c1 = '#F29CB8', c2 = '#F6E4B8',
}) => {
  const left = (f: number) => ({ x: -24 + 24 * f, y: -30 + 86 * f });
  const right = (f: number) => ({ x: 24 - 24 * f, y: -30 + 86 * f });
  const lines: React.ReactNode[] = [];
  for (let k = 0; k < 4; k++) {
    const f0 = k * 0.22;
    const f1 = Math.min(1, f0 + 0.3);
    lines.push(<path key={`a${k}`} d={`M ${left(f0).x} ${left(f0).y} L ${right(f1).x} ${right(f1).y}`} stroke="#B9782F" strokeWidth={2} />);
    lines.push(<path key={`b${k}`} d={`M ${right(f0).x} ${right(f0).y} L ${left(f1).x} ${left(f1).y}`} stroke="#B9782F" strokeWidth={2} />);
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {bite > 0 ? (
        <defs>
          <mask id={`${id}bite`} maskUnits="userSpaceOnUse" x={-90} y={-160} width={180} height={140}>
            <rect x={-90} y={-160} width={180} height={140} fill="#fff" />
            <circle cx={26} cy={-94} r={17 * bite} fill="#000" />
            <circle cx={34} cy={-76} r={14 * bite} fill="#000" />
            <circle cx={16} cy={-106} r={11 * bite} fill="#000" />
            {bite > 0.7 ? <circle cx={30} cy={-52} r={13 * (bite - 0.5)} fill="#000" /> : null}
          </mask>
        </defs>
      ) : null}
      <polygon points="-24,-30 24,-30 0,56" fill="#E3A857" />
      <polygon points="-24,-30 -4,-30 0,56" fill="#000" opacity={0.12} />
      {lines}
      <path d="M 24 -30 L 0 56" stroke={RIM} strokeWidth={2.5} opacity={0.55} />
      <g mask={bite > 0 ? `url(#${id}bite)` : undefined}>
        <circle cx={0} cy={-78} r={25} fill={c2} />
        <circle cx={-10} cy={-86} r={9} fill="#fff" opacity={0.25} />
        {[[-8, -92], [8, -98], [12, -80], [-14, -74], [2, -70]].map(([a, b], i) => (
          <rect key={i} x={a} y={b} width={7} height={3} rx={1.5} fill={LABELS[(i * 3) % LABELS.length]} transform={`rotate(${i * 50} ${a} ${b})`} />
        ))}
        <path d="M -33 -46 A 33 30 0 0 1 33 -46 L 35 -36 Q 29 -24 22 -36 Q 14 -22 6 -36 Q -2 -26 -10 -36 Q -20 -22 -29 -36 Z" fill={c1} />
        <path d="M -33 -46 A 33 30 0 0 1 -6 -74 L -6 -36 L -29 -36 Z" fill="#000" opacity={0.1} />
        <ellipse cx={-14} cy={-52} rx={8} ry={5} fill="#fff" opacity={0.3} />
      </g>
      <rect x={-27} y={-36} width={54} height={8} rx={3} fill="#C98A3E" />
      <path d="M 22 -30 L 24 -22" stroke="#E86A92" strokeWidth={0} />
    </g>
  );
};

// ---------- cans, bags ----------
/** A fizzy-drink can, side view: x, y the middle of the base, about 40 wide and 70 tall at s = 1. Generic: waves, no print. */
export const SodaCan: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string; accent?: string }> = ({ x, y, s = 1, rot = 0, color = '#D94452', accent = '#F6F1E3' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={4} cy={1} rx={26} ry={5} fill="#000" opacity={0.38} />
    <path d="M -20 -62 L -20 -6 Q -20 0 -14 0 L 14 0 Q 20 0 20 -6 L 20 -62 L 15 -68 L -15 -68 Z" fill={color} />
    <path d="M -20 -62 L -20 -6 Q -20 0 -14 0 L -6 0 L -6 -68 L -15 -68 Z" fill="#000" opacity={0.16} />
    <path d="M -20 -46 Q -10 -56 0 -46 T 20 -46 L 20 -26 Q 10 -36 0 -26 T -20 -26 Z" fill={accent} />
    <circle cx={0} cy={-36} r={6} fill={color} />
    <rect x={-17} y={-4} width={34} height={4} fill={TIN} />
    <ellipse cx={0} cy={-68} rx={15} ry={4} fill={TIN} />
    <ellipse cx={0} cy={-68} rx={10} ry={2.4} fill="#8E98A8" />
    <rect x={-4} y={-70} width={8} height={3} rx={1.5} fill="#EEF1F6" />
    <path d="M 17 -62 L 17 -6" stroke={RIM} strokeWidth={2.5} opacity={0.6} />
    <rect x={-14} y={-60} width={4} height={50} rx={2} fill="#fff" opacity={0.22} />
  </g>
);

/** A bag of snacks (crimped top and bottom, a bulging pillow), generic print: x, y the middle of the base, 70 wide, 100 tall at s = 1. */
export const SnackBag: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string; accent?: string; squeeze?: number }> = ({ x, y, s = 1, rot = 0, color = '#F6B93B', accent = '#D94452', squeeze = 0 }) => {
  const w = 35 + squeeze * 4;
  const zig = (y0: number, dir: number, rev: boolean) =>
    Array.from({ length: 8 })
      .map((_, i) => `L ${rev ? w - 4 - (i * (2 * w - 8)) / 7 : -w + 4 + (i * (2 * w - 8)) / 7} ${y0 + (i % 2 ? dir * 5 : 0)}`)
      .join(' ');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={4} cy={1} rx={38} ry={5} fill="#000" opacity={0.38} />
      <path d={`M ${-w + 4} -4 ${zig(-4, 1, false)} Q ${w + 8 - squeeze * 6} -50 ${w - 4} -96 ${zig(-96, -1, true)} Q ${-w - 8 + squeeze * 6} -50 ${-w + 4} -4 Z`} fill={color} />
      <path d={`M ${-w + 4} -4 Q ${-w - 8} -50 ${-w + 4} -96 L -8 -96 L -8 -4 Z`} fill="#000" opacity={0.14} />
      <path d="M -26 -62 L 26 -62 L 24 -28 L -24 -28 Z" fill={accent} />
      <path d="M -12 -44 L 0 -58 L 12 -44 L 4 -32 L -4 -32 Z" fill="#F6F1E3" />
      <circle cx={-16} cy={-80} r={5} fill="#F6F1E3" opacity={0.8} />
      <circle cx={14} cy={-78} r={3.5} fill="#F6F1E3" opacity={0.8} />
      <path d={`M ${w - 6} -90 Q ${w + 4} -50 ${w - 6} -10`} stroke={RIM} strokeWidth={2.5} fill="none" opacity={0.55} />
      <path d="M -30 -80 Q -34 -60 -30 -30" stroke="#fff" strokeWidth={4} fill="none" opacity={0.22} strokeLinecap="round" />
    </g>
  );
};

// ---------- tins ----------
/**
 * A tin of food, side view: x, y the middle of the base, 46 wide and 54 tall at s = 1. `label` the wrapper colour; a
 * cream circle with a leaf is the generic picture. `rot` lays it down about the base.
 */
export const CanFood: React.FC<{ x: number; y: number; s?: number; rot?: number; label?: string; pic?: string }> = ({ x, y, s = 1, rot = 0, label = '#D94452', pic = '#58B368' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={3} cy={1} rx={29} ry={5} fill="#000" opacity={0.38} />
    <rect x={-23} y={-54} width={46} height={54} rx={4} fill={TIN} />
    <rect x={-23} y={-50} width={46} height={4} fill="#8E98A8" />
    <rect x={-23} y={-8} width={46} height={4} fill="#8E98A8" />
    <rect x={-23} y={-46} width={46} height={38} fill={label} />
    <rect x={-23} y={-46} width={14} height={38} fill="#000" opacity={0.17} />
    <ellipse cx={2} cy={-27} rx={13} ry={12} fill="#F4EBD2" />
    <path d="M 2 -22 Q -6 -32 2 -38 Q 10 -32 2 -22 Z" fill={pic} />
    <rect x={-23} y={-46} width={46} height={5} fill="#F4EBD2" opacity={0.85} />
    <ellipse cx={0} cy={-54} rx={22} ry={3.6} fill="#DDE3EC" />
    <path d="M 21 -48 L 21 -4" stroke={RIM} strokeWidth={2.5} opacity={0.6} />
    <rect x={-17} y={-44} width={3} height={34} rx={1.5} fill="#fff" opacity={0.22} />
  </g>
);

/** A pyramid of `n` tins (3, 6, 10, 15...), the bottom row the widest: x, y the middle of the bottom row's base. */
export const CanStack: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 6 }) => {
  let base = 1;
  while ((base * (base + 1)) / 2 < n) base++;
  const out: React.ReactNode[] = [];
  let k = 0;
  for (let row = 0; row < base && k < n; row++) {
    const count = base - row;
    for (let i = 0; i < count && k < n; i++) {
      out.push(<CanFood key={k} x={(i - (count - 1) / 2) * 48} y={-row * 52} label={LABELS[(k * 3) % LABELS.length]} pic={LABELS[(k * 5 + 2) % LABELS.length]} />);
      k++;
    }
  }
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{out}</g>;
};

/**
 * A pantry shelf in screen space for "you'll live on canned food": x, y the top left, `w` wide, `rows` boards of `cols`
 * slots, `s` the can scale. `count` cans stand in it (scattered by a fixed rank; a fractional count pops the next one
 * in or out), the clean rings on the dusty boards show where the others were.
 */
export const CannedShelf: React.FC<{ x: number; y: number; w?: number; rows?: number; cols?: number; s?: number; count: number; backdrop?: boolean }> = ({
  x, y, w = 1500, rows = 3, cols = 9, s = 2.2, count, backdrop = true,
}) => {
  const rowH = 54 * s + 44 * s;
  const cell = w / cols;
  const slots = rows * cols;
  // each slot's rank decides when its tin leaves: a fixed shuffle, so count 24 -> 6 empties it the same way every time
  const order = Array.from({ length: slots }).map((_, i) => ({ i, r: rnd(91, i) })).sort((a, b) => a.r - b.r).map((o) => o.i);
  const place = new Array<number>(slots);
  order.forEach((slot, rank) => (place[slot] = rank));
  const full = Math.floor(count);
  const frac = count - full;
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const by = y + (r + 1) * rowH;
    out.push(<rect key={`b${r}`} x={x - 30} y={by} width={w + 60} height={26 * s * 0.6} fill="#7A5747" />);
    out.push(<rect key={`bt${r}`} x={x - 30} y={by} width={w + 60} height={5} fill="#A07456" />);
    out.push(<rect key={`bs${r}`} x={x - 30} y={by + 26 * s * 0.6} width={w + 60} height={14} fill="#000" opacity={0.3} />);
    for (let c = 0; c < cols; c++) {
      const slot = r * cols + c;
      const cx = x + (c + 0.5) * cell + (rnd(92, slot) - 0.5) * cell * 0.25;
      const rank = place[slot];
      const grow = rank < full ? 1 : rank === full ? easeOut(clamp(frac)) : 0;
      if (grow < 1) out.push(<ellipse key={`ring${slot}`} cx={cx} cy={by + 8} rx={25 * s} ry={5 * s} fill="#9A7458" opacity={0.55 * (1 - grow)} />);
      if (grow > 0) {
        out.push(
          <g key={`can${slot}`} transform={`translate(${cx} ${by}) scale(${grow})`}>
            <CanFood x={0} y={0} s={s * (0.96 + 0.08 * rnd(93, slot))} label={LABELS[Math.floor(rnd(94, slot) * LABELS.length)]} pic={LABELS[Math.floor(rnd(95, slot) * LABELS.length)]} />
          </g>,
        );
      }
    }
  }
  return (
    <g>
      {backdrop ? (
        <g>
          <rect x={x - 60} y={y - 40} width={w + 120} height={rows * rowH + 120} fill="#3B2C2E" />
          {Array.from({ length: Math.ceil((w + 120) / 90) }).map((_, i) => (
            <rect key={i} x={x - 60 + i * 90} y={y - 40} width={4} height={rows * rowH + 120} fill="#2A1F22" />
          ))}
        </g>
      ) : null}
      {out}
      <rect x={x - 60} y={y - 40} width={14} height={rows * rowH + 120} fill="#5B4038" />
      <rect x={x + w + 46} y={y - 40} width={14} height={rows * rowH + 120} fill="#5B4038" />
    </g>
  );
};
