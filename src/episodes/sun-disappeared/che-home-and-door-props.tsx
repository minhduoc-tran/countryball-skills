import React from 'react';
import { Glow, Stars, Kitchen, KitchenIsland, FONT, rnd, clamp, LOOKS, faceAt } from '../../engine';

// Chapter E props: the cold, dark home lit by one orange heater and candles; frost; the front door; the neighbours'
// window; fuel cans with a "1 MONTH" tag. Everything is a pure function of the shot clock `t`.

/** faceAt plus an idle blink: lids close for ~5 frames once every `period` frames (after `thr`). */
export const faceBlink = (t: number, keys: Parameters<typeof faceAt>[1], period: number, thr: number) => {
  const f = faceAt(t, keys);
  return { ...f, blink: Math.max(f.blink ?? 0, t % period > thr ? 0.9 : 0) };
};

/** Flicker factor around 1 for a heater or candle glow. */
export const flick = (t: number, seed = 0) => 1 + 0.07 * Math.sin(t / 2.3 + seed) + 0.05 * Math.sin(t / 5.1 + seed * 2.1) + 0.03 * Math.sin(t / 1.3 + seed * 3.7);

/** Frost creeping in from the edges of a box: small fern-like crystals + a faint pale vignette. `grow` 0..1.5. */
export const FrostEdges: React.FC<{ x: number; y: number; w: number; h: number; grow?: number; seed?: number; o?: number }> = ({ x, y, w, h, grow = 1, seed = 1, o = 0.8 }) => {
  const arms: React.ReactNode[] = [];
  const n = 22;
  for (let i = 0; i < n; i++) {
    const side = i % 4; // 0 top, 1 bottom, 2 left, 3 right
    const q = 0.04 + rnd(seed, i) * 0.92;
    const len = (36 + rnd(seed + 5, i) * 70) * grow;
    const px = side < 2 ? x + q * w : side === 2 ? x : x + w;
    const py = side >= 2 ? y + q * h : side === 0 ? y : y + h;
    const dx = side === 2 ? 1 : side === 3 ? -1 : (rnd(seed + 9, i) - 0.5) * 0.7;
    const dy = side === 0 ? 1 : side === 1 ? -1 : (rnd(seed + 9, i) - 0.5) * 0.7;
    const m = Math.hypot(dx, dy);
    const ux = dx / m;
    const uy = dy / m;
    // a stem with three pairs of side-branches that shorten toward the tip
    const branches = [0.3, 0.55, 0.8].map((k) => {
      const bx = px + ux * len * k;
      const by = py + uy * len * k;
      const bl = len * 0.34 * (1 - k * 0.6);
      return `M ${bx} ${by} l ${(ux * 0.6 - uy * 0.8) * bl} ${(uy * 0.6 + ux * 0.8) * bl} M ${bx} ${by} l ${(ux * 0.6 + uy * 0.8) * bl} ${(uy * 0.6 - ux * 0.8) * bl}`;
    });
    arms.push(<path key={i} d={`M ${px} ${py} l ${ux * len} ${uy * len} ${branches.join(' ')}`} stroke="#E4F2FF" strokeWidth={2.6} strokeLinecap="round" fill="none" opacity={0.85} />);
  }
  const id = `fe${seed}`;
  return (
    <g opacity={o}>
      <defs>
        <radialGradient id={id} cx="0.5" cy="0.5" r="0.72">
          <stop offset="0.62" stopColor="#CFE6FF" stopOpacity={0} />
          <stop offset="1" stopColor="#E8F4FF" stopOpacity={0.4 * Math.min(1, grow)} />
        </radialGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
      {arms}
    </g>
  );
};

/** A small oil heater: dark body, glowing orange grill, hot light on the floor. x, y = the foot. About 150 x 200. */
export const Heater: React.FC<{ x: number; y: number; t: number; s?: number; glow?: number }> = ({ x, y, t, s = 1, glow = 1 }) => {
  const f = flick(t, 3);
  return (
    <g>
      <ellipse cx={x} cy={y + 4} rx={110 * s} ry={14 * s} fill="#000" opacity={0.45} />
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-62} y={-190} width={124} height={176} rx={14} fill="#2E2630" />
        <rect x={-62} y={-190} width={124} height={5} rx={2} fill="#FFB46A" opacity={0.7} />
        <rect x={-48} y={-168} width={96} height={118} rx={8} fill="#FF8A3D" opacity={0.65 + 0.2 * f} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={-48} y={-168 + i * 20} width={96} height={7} rx={3} fill={i % 2 ? '#FFD07A' : '#FF6A2A'} opacity={0.95} />
        ))}
        <rect x={-62} y={-44} width={124} height={26} rx={6} fill="#3E3442" />
        <circle cx={34} cy={-30} r={8} fill="#E8C87A" />
        <rect x={-50} y={-18} width={14} height={14} rx={3} fill="#1E1824" />
        <rect x={36} y={-18} width={14} height={14} rx={3} fill="#1E1824" />
      </g>
      {glow > 0 ? (
        <>
          <Glow x={x} y={y - 110 * s} r={520 * s * f} o={0.85 * glow} />
          <ellipse cx={x} cy={y + 10} rx={300 * s} ry={50 * s} fill="#FF9A4A" opacity={0.22 * glow * f} style={{ mixBlendMode: 'screen' }} />
        </>
      ) : null}
    </g>
  );
};

/** A red fuel can (jerrycan) with a handle and a cap. x, y = the middle of its base. About 90 x 120 at s 1. */
export const FuelCan: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={4} cy={4} rx={60} ry={9} fill="#000" opacity={0.45} />
    <path d="M -44 0 L -44 -92 L -30 -108 L 30 -108 L 44 -92 L 44 0 Z" fill="#B8352E" stroke="#5A1A18" strokeWidth={4} strokeLinejoin="round" />
    <rect x={-44} y={-108} width={14} height={108} fill="#E0584A" opacity={0.45} />
    <path d="M -22 -108 L -22 -128 L 4 -128 L 4 -108" fill="#8E2824" stroke="#5A1A18" strokeWidth={4} />
    <rect x={14} y={-122} width={18} height={14} rx={3} fill="#E8B84A" stroke="#6A4A10" strokeWidth={3} />
    <path d="M -30 -66 L 30 -66 M -30 -34 L 30 -34" stroke="#7A2220" strokeWidth={4} />
    <path d="M -10 -80 q 10 -12 20 0 l -10 22 Z" fill="#F2C230" />
  </g>
);

/** A paper tag on a string: "1 MONTH". x, y = where the string is tied; it swings a little. */
export const MonthTag: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t / 9) * 3}) scale(${s})`}>
    <path d="M 0 0 L 0 26" stroke="#E8DCC0" strokeWidth={3} />
    <path d="M -110 26 L 110 26 L 110 104 L -110 104 Z" fill="#F4E9CC" stroke="#8A7A58" strokeWidth={4} />
    <circle cx={0} cy={40} r={6} fill="#8A7A58" />
    <text x={0} y={92} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={46} fill="#4A2A1A">1 MONTH</text>
  </g>
);

/** The kitchen at night with the Sun gone: the window shows stars and frost, everything sinks, a heater and candles light it. */
export const HomeNight: React.FC<{ t: number; id: string; heaterAt?: number; dim?: number }> = ({ t, id, heaterAt = 560, dim = 0.5 }) => (
  <g>
    <Kitchen t={t} id={id} veil={0.6} />
    {/* the window: no Sun, a black sky with stars, frosted at the edges */}
    <rect x={650} y={383} width={282} height={150} fill="#070A1A" />
    <Stars seed={9} x0={650} y0={383} w={282} h={150} t={t} n={16} o={0.9} />
    <FrostEdges x={648} y={381} w={286} h={154} grow={0.8} seed={4} o={0.85} />
    <rect x={-1500} y={-1500} width={5000} height={4500} fill="#050818" opacity={dim} />
    <Glow x={790} y={457} r={300} kind="cool" o={0.22} />
    <KitchenIsland />
    <Heater x={heaterAt} y={940} t={t} s={1.1} />
    {[[1040, 760], [1230, 770]].map(([cx, cy], i) => (
      <g key={i}>
        <rect x={cx - 11} y={cy - 56} width={22} height={52} rx={4} fill="#E8DCC0" />
        <path d={`M ${cx} ${cy - 56} q -9 -18 0 -36 q 9 18 0 36`} fill="#FFB347" transform={`translate(${Math.sin(t / 3 + i) * 1.5} 0)`} />
        <Glow x={cx} y={cy - 70} r={230 * flick(t, i)} o={0.5} />
      </g>
    ))}
  </g>
);

/** A blanket wrapped round a seated figure: drawn AFTER the Hero. A dome over the shoulders (cx, top = neck level), falling to a
 * wavy hem `h` lower; folds and a stitched stripe so it reads as cloth, not a box. */
export const Blanket: React.FC<{ cx: number; top: number; w: number; h: number; t: number }> = ({ cx, top, w, h, t }) => {
  const br = Math.sin(t / 14) * 3;
  const L = cx - w / 2;
  const R = cx + w / 2;
  const B = top + h;
  return (
    <g>
      <path d={`M ${cx - w * 0.2} ${top + br} Q ${cx - w * 0.42} ${top + 0.02 * h} ${L + 4} ${top + 0.2 * h} Q ${L - 12} ${top + 0.6 * h} ${L + 6} ${B - 10} Q ${L + w * 0.25} ${B + 12} ${cx} ${B - 6} Q ${R - w * 0.25} ${B + 12} ${R - 6} ${B - 10} Q ${R + 12} ${top + 0.6 * h} ${R - 4} ${top + 0.2 * h} Q ${cx + w * 0.42} ${top + 0.02 * h} ${cx + w * 0.2} ${top + br} Q ${cx} ${top + 0.1 * h} ${cx - w * 0.2} ${top + br} Z`} fill="#C8504A" stroke="#5A1E22" strokeWidth={5} strokeLinejoin="round" />
      <path d={`M ${cx - w * 0.2} ${top + br} Q ${cx} ${top + 0.1 * h} ${cx + w * 0.2} ${top + br}`} stroke="#FFB4A0" strokeWidth={6} fill="none" opacity={0.6} strokeLinecap="round" />
      <path d={`M ${L + 8} ${top + 0.42 * h} Q ${cx} ${top + 0.5 * h} ${R - 8} ${top + 0.4 * h} M ${L + 10} ${top + 0.5 * h} Q ${cx} ${top + 0.58 * h} ${R - 10} ${top + 0.48 * h}`} stroke="#F2C230" strokeWidth={5} fill="none" opacity={0.8} />
      <path d={`M ${cx - w * 0.12} ${top + 0.15 * h} Q ${cx - w * 0.16} ${top + 0.6 * h} ${cx - w * 0.1} ${B - 14} M ${cx + w * 0.16} ${top + 0.2 * h} Q ${cx + w * 0.2} ${top + 0.6 * h} ${cx + w * 0.14} ${B - 14}`} stroke="#7A2A2A" strokeWidth={4} fill="none" opacity={0.45} />
    </g>
  );
};

/** The front door seen straight on, frost on its edges. x0 = left edge. `shake` jolts it (knocks); `open` opens a crack of cold blue. */
export const FrontDoor: React.FC<{ x0: number; y0: number; w: number; h: number; shake?: number; frost?: number; seed?: number }> = ({ x0, y0, w, h, shake = 0, frost = 1, seed = 2 }) => (
  <g transform={`translate(${shake * 7} ${-Math.abs(shake) * 2})`}>
    <rect x={x0 - 30} y={y0 - 30} width={w + 60} height={h + 30} fill="#2C2434" />
    <rect x={x0} y={y0} width={w} height={h} fill="#6A4A34" />
    <rect x={x0} y={y0} width={w} height={6} fill="#FFC98A" opacity={0.3} />
    {[[y0 + 40, h * 0.4], [y0 + 70 + h * 0.4, h * 0.42]].map(([y, hh], i) => (
      <g key={i}>
        <rect x={x0 + 36} y={y} width={w - 72} height={hh} fill="#5A3C2A" />
        <rect x={x0 + 36} y={y} width={w - 72} height={5} fill="#FFC98A" opacity={0.25} />
      </g>
    ))}
    <circle cx={x0 + w - 44} cy={y0 + h * 0.52} r={22} fill="#C9A46A" stroke="#6A4A20" strokeWidth={4} />
    <rect x={x0 + w - 46} y={y0 + h * 0.52 - 6} width={74} height={12} rx={6} fill="#C9A46A" stroke="#6A4A20" strokeWidth={3} />
    <FrostEdges x={x0} y={y0} w={w} h={h} grow={frost} seed={seed} o={0.9} />
  </g>
);

/** The neighbours' window across the way: dark, frosted, a huddled silhouette inside. */
export const NeighbourWindow: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => (
  <g>
    <rect x={x - 26} y={y - 26} width={w + 52} height={h + 52} fill="#2A2438" />
    <rect x={x} y={y} width={w} height={h} fill="#0A1122" />
    {/* two huddled shapes under a blanket, barely visible */}
    <path d={`M ${x + w * 0.3} ${y + h} Q ${x + w * 0.3} ${y + h * 0.58} ${x + w * 0.5} ${y + h * 0.56} Q ${x + w * 0.72} ${y + h * 0.58} ${x + w * 0.72} ${y + h} Z`} fill="#141C30" />
    <circle cx={x + w * 0.5} cy={y + h * 0.5 + Math.sin(t / 16) * 2} r={w * 0.07} fill="#18223A" />
    <rect x={x + w / 2 - 5} y={y} width={10} height={h} fill="#2A2438" />
    <rect x={x} y={y + h / 2 - 5} width={w} height={10} fill="#2A2438" />
    <rect x={x} y={y} width={w} height={h} fill="#9FC8F0" opacity={0.1} />
    <FrostEdges x={x} y={y} w={w} h={h} grow={1.5} seed={6} o={0.95} />
  </g>
);

export const SIS = LOOKS.sis;
export const PIP = LOOKS.pipHood;
export { clamp };
