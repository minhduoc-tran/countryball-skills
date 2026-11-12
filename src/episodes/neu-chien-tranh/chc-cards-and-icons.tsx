import React from 'react';
import { Schematic, SCH, FONT, UI, clamp, easeOut, backOut, kf, rnd, Glow } from '../../engine';

// Chapter C: schematic cards for the real numbers (Ukraine 2022 power, UNHCR refugees) and the line icons that go
// dark. Everything is a pure function of the shot clock `t`. The country is only ever a plain outline label.

/** A plain, rough outline of Ukraine in a 600 x 360 box (label only: nothing is ever shown at war on it). */
const UA_LL: [number, number][] = [
  [23.6, 51.6], [25.8, 51.9], [27.0, 51.7], [28.6, 51.5], [30.0, 51.4], [30.7, 51.4], [31.8, 52.1], [32.5, 52.3], [33.5, 52.35], [34.4, 51.9],
  [35.0, 51.3], [35.9, 50.45], [37.5, 50.4], [38.0, 49.9], [40.1, 49.6], [39.8, 47.6], [38.2, 47.1], [37.5, 47.0], [36.8, 46.7], [35.4, 46.4],
  [35.0, 45.7], [36.5, 45.3], [35.4, 45.0], [34.5, 44.7], [33.5, 44.4], [32.5, 45.3], [33.6, 46.0], [32.0, 46.4], [31.0, 46.6], [30.7, 46.5],
  [30.0, 45.8], [29.6, 45.3], [29.5, 45.5], [30.1, 46.4], [29.2, 47.0], [29.1, 47.9], [28.3, 48.2], [27.5, 48.45], [26.6, 48.25], [26.2, 48.2],
  [24.9, 47.7], [24.0, 47.9], [22.9, 47.95], [22.15, 48.4], [22.6, 49.1], [22.7, 49.5], [24.0, 50.6],
];
/** The outline's corners in outline space (600 x 360 box), for placing things inside it. */
export const UA_POLY: [number, number][] = UA_LL.map(([lo, la]) => [(lo - 22) * 33.3, (52.5 - la) * 42]);
const UA_PATH = 'M ' + UA_LL.map(([lo, la]) => `${((lo - 22) * 33.3).toFixed(1)} ${((52.5 - la) * 42).toFixed(1)}`).join(' L ') + ' Z';

/** Ray-casting point-in-polygon test against the outline. */
export const inUkraine = (x: number, y: number) => {
  let c = false;
  for (let i = 0, j = UA_POLY.length - 1; i < UA_POLY.length; j = i++) {
    const [xi, yi] = UA_POLY[i];
    const [xj, yj] = UA_POLY[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

/** The i-th deterministic point inside the outline (outline space). */
export const uaPoint = (i: number): [number, number] => {
  for (let k = 0; k < 40; k++) {
    const x = 20 + rnd(40 + k, i) * 570;
    const y = 30 + rnd(70 + k, i * 3 + 1) * 300;
    if (inUkraine(x, y)) return [x, y];
  }
  return [300, 150];
};

/** The outline drawn on over `dur` frames (fill fades in after), centred on x, y at scale s. */
export const UkraineOutline: React.FC<{ x: number; y: number; s?: number; t: number; dur?: number; fillO?: number; stroke?: string }> = ({ x, y, s = 1, t, dur = 16, fillO = 0.14, stroke = SCH.line }) => {
  const p = easeOut(clamp(t / dur));
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(-305 -185)`}>
      <path d={UA_PATH} fill={SCH.live} opacity={fillO * clamp((t - dur * 0.6) / 8)} />
      <path d={UA_PATH} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} stroke={stroke} strokeWidth={6 / s} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
};

/** The small source line in the corner: "NGUỒN: CHÍNH PHỦ UKRAINE". */
export const SourceTag: React.FC<{ t: number; text: string; x?: number; y?: number }> = ({ t, text, x = 90, y = 960 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  const w = text.length * 21 + 150;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={0} y={-40} width={w} height={64} rx={32} fill={UI.pill} opacity={0.78} />
      <rect x={0} y={-40} width={w} height={64} rx={32} fill="none" stroke={SCH.dim} strokeWidth={2.5} />
      <text x={28} y={2} fontFamily={FONT.ui} fontSize={26} fill={SCH.dim} letterSpacing={2}>NGUỒN:</text>
      <text x={150} y={2} fontFamily={FONT.ui} fontWeight={700} fontSize={28} fill={UI.text} letterSpacing={2}>{text}</text>
    </g>
  );
};

/** The green "ĐÓ LÀ THẬT" tick: a disc pops, the tick draws on, a ring pulses out. Centred on x, y. */
export const TickBadge: React.FC<{ t: number; x?: number; y?: number; s?: number }> = ({ t, x = 1500, y = 860, s = 1 }) => {
  if (t < 0) return null;
  const disc = backOut(clamp(t / 7));
  const tick = easeOut(clamp((t - 3) / 8));
  const ring = clamp((t - 3) / 16);
  const label = easeOut(clamp((t - 6) / 7));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`scale(${disc})`}>
        {ring > 0 && ring < 1 ? <circle r={64 + ring * 70} fill="none" stroke="#2FBF71" strokeWidth={6 * (1 - ring)} opacity={1 - ring} /> : null}
        <circle r={64} fill="#2FBF71" style={{ filter: 'drop-shadow(0 0 22px #2FBF71AA)' }} />
        <path d="M -28 2 L -9 22 L 31 -22" stroke="#E9FFF2" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tick} />
      </g>
      <text x={0} y={128} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={UI.text} letterSpacing={4} opacity={label}>ĐÓ LÀ THẬT</text>
    </g>
  );
};

// ---------- line icons that go dark one by one ----------
export type OffKind = 'fridge' | 'pump' | 'signal' | 'lift';

const ICON_BODY: Record<OffKind, (on: boolean) => React.ReactNode> = {
  fridge: () => (
    <g>
      <rect x={-52} y={-90} width={104} height={180} rx={12} />
      <path d="M -52 -20 L 52 -20 M -34 -64 L -34 -40 M -34 6 L -34 40" />
    </g>
  ),
  pump: () => (
    <g>
      <path d="M -62 70 L -62 0 Q -62 -22 -40 -22 L 24 -22 Q 46 -22 46 0 L 46 70 Z" />
      <path d="M -14 -22 L -14 -84 L 56 -84 L 56 -62" />
      <path d="M 56 -44 Q 70 -24 56 -14 Q 42 -24 56 -44 Z" />
      <path d="M -62 40 L 46 40" />
    </g>
  ),
  signal: (on) => (
    <g>
      <rect x={-46} y={-96} width={92} height={176} rx={14} />
      <path d="M -30 -66 L 30 -66" />
      <path d="M -26 40 L -26 52 M -8 28 L -8 52 M 10 16 L 10 52 M 28 4 L 28 52" strokeWidth={9} />
      {on ? null : null}
    </g>
  ),
  lift: () => (
    <g>
      <rect x={-56} y={-90} width={112} height={180} rx={10} />
      <path d="M 0 -40 L 0 90" />
      <path d="M -20 -66 L -8 -78 L 4 -66 M 14 -78 L 26 -66" strokeWidth={5} />
      <path d="M -30 10 L -30 -10 M -40 0 L -20 0" strokeWidth={7} />
      <path d="M 30 10 L 30 -10 M 20 0 L 40 0" strokeWidth={7} />
    </g>
  ),
};

/**
 * A line icon, centred, about 180 tall at s 1. `offT` < 0: still on (orange, glowing); from 0 it flickers out, goes
 * dim grey and a red slash draws across it.
 */
export const OffIcon: React.FC<{ kind: OffKind; x: number; y: number; s?: number; offT: number; label?: string; pop?: number }> = ({ kind, x, y, s = 1, offT, label, pop = 1 }) => {
  const on = offT < 0;
  const flick = offT >= 0 && offT < 6 ? (Math.floor(offT / 2) % 2 === 0 ? 1 : 0) : on ? 1 : 0;
  const col = flick ? SCH.live : SCH.dim;
  const slash = easeOut(clamp((offT - 6) / 7));
  const k = backOut(clamp(pop));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      {flick ? <circle r={140} fill={SCH.live} opacity={0.07} /> : null}
      <g stroke={col} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" style={flick ? { filter: `drop-shadow(0 0 16px ${SCH.glow})` } : undefined} opacity={flick ? 1 : 0.7}>
        {ICON_BODY[kind](on)}
      </g>
      {slash > 0 ? <path d="M -86 -100 L 86 100" stroke="#FF5A48" strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - slash} /> : null}
      {label ? (
        <text y={160} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill={flick ? SCH.line : SCH.dim} letterSpacing={2}>{label}</text>
      ) : null}
    </g>
  );
};

// ---------- the distant power plant on the horizon ----------
/** A far silhouette of a power plant at dusk: cooling towers, a chimney, a low hall. `out` 0..1 switches its lights
 * and the far town's lights off in a sweep (no explosion, no smoke: just the lights going out). */
export const PlantHorizon: React.FC<{ t: number; id: string; out: number; px?: number; hy?: number }> = ({ t, id, out, px = 1180, hy = 668 }) => {
  const sil = '#14122A';
  const rim = '#6B4A6E';
  const windows: [number, number][] = [];
  for (let i = 0; i < 26; i++) windows.push([px - 250 + (i % 13) * 22, hy - 66 + Math.floor(i / 13) * 24]);
  const lampOn = (q: number) => out < q;
  // the sweep goes right to left: lights at the right of the plant die first
  const sweepQ = (x: number) => clamp((x - 140) / 1700) * 0.8 + 0.1;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2={hy} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0A0E2C" />
          <stop offset="0.6" stopColor="#3B2A64" />
          <stop offset="0.92" stopColor="#C8654C" />
          <stop offset="1" stopColor="#F0A25A" />
        </linearGradient>
        <linearGradient id={`${id}gr`} x1="0" y1={hy} x2="0" y2="1080" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1A1634" />
          <stop offset="1" stopColor="#0A0816" />
        </linearGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={hy + 300} fill={`url(#${id}sky)`} />
      {Array.from({ length: 50 }).map((_, i) => (
        <circle key={i} cx={rnd(3, i) * 1920} cy={rnd(4, i) * 380} r={1.2 + rnd(5, i) * 1.6} fill="#F6EFE3" opacity={(0.25 + 0.5 * Math.abs(Math.sin(t / 12 + i))) * (rnd(6, i) > 0.4 ? 1 : 0.4)} />
      ))}
      {/* far hills */}
      <path d={`M -300 ${hy} L -300 ${hy - 40} Q 200 ${hy - 90} 520 ${hy - 36} Q 820 ${hy - 70} 1400 ${hy - 30} Q 1700 ${hy - 70} 2220 ${hy - 40} L 2220 ${hy} Z`} fill="#241C42" />
      <g transform={`translate(0 ${hy})`} />
      {/* the plant: two cooling towers, a chimney, a long hall */}
      <g fill={sil} stroke={rim} strokeWidth={2} strokeLinejoin="round">
        <path d={`M ${px - 130} ${hy} Q ${px - 100} ${hy - 90} ${px - 112} ${hy - 190} L ${px - 28} ${hy - 190} Q ${px - 40} ${hy - 90} ${px - 10} ${hy} Z`} />
        <path d={`M ${px + 10} ${hy} Q ${px + 36} ${hy - 80} ${px + 26} ${hy - 168} L ${px + 100} ${hy - 168} Q ${px + 90} ${hy - 80} ${px + 128} ${hy} Z`} />
        <rect x={px + 170} y={hy - 300} width={22} height={300} />
        <rect x={px - 270} y={hy - 84} width={290} height={84} />
        <rect x={px - 250} y={hy - 104} width={110} height={24} />
      </g>
      {/* the faint steam a cooling tower makes, thinning as the plant dies */}
      <g filter="url(#blur10)" opacity={0.5 * (1 - out)}>
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={px - 70 + Math.sin(t / 30 + i) * 14 + i * 16} cy={hy - 214 - i * 40 - ((t * 0.3) % 30)} rx={46 + i * 12} ry={20 + i * 5} fill="#B8A8D0" opacity={0.5 - i * 0.12} />
        ))}
      </g>
      {/* lit windows of the hall, each with its own moment to go out */}
      {windows.map(([wx, wy], i) => {
        const q = sweepQ(wx) + (rnd(8, i) - 0.5) * 0.1;
        const on = lampOn(q);
        return <rect key={i} x={wx} y={wy} width={11} height={13} fill={on ? '#FFC86A' : '#241E3A'} opacity={on ? 0.95 : 0.8} />;
      })}
      {/* red aircraft-warning lamps on the chimney, blinking until the end (they're the last to go) */}
      {out < 0.95 && Math.floor(t / 14) % 2 === 0 ? (
        <g>
          <circle cx={px + 181} cy={hy - 304} r={5} fill="#FF4A3A" />
          <Glow x={px + 181} y={hy - 304} r={40} kind="red" o={0.8} />
          <circle cx={px + 181} cy={hy - 190} r={4} fill="#FF4A3A" />
        </g>
      ) : null}
      {/* the plant's glow on the haze */}
      <Glow x={px - 60} y={hy - 60} r={300} kind="warm" o={0.55 * (1 - clamp(out * 1.3))} />
      {/* the far town: tiny lights along the horizon */}
      {Array.from({ length: 70 }).map((_, i) => {
        const lx = rnd(21, i) * 1900 + 10;
        if (Math.abs(lx - px) < 260) return null;
        const on = lampOn(sweepQ(lx) + 0.04);
        return <circle key={`tl${i}`} cx={lx} cy={hy + 6 + rnd(22, i) * 18} r={1.8 + rnd(23, i) * 1.4} fill={on ? '#FFD08A' : '#2A2444'} opacity={on ? 0.9 : 0.5} />;
      })}
      <rect x={-300} y={hy} width={2520} height={1080 - hy + 300} fill={`url(#${id}gr)`} />
    </g>
  );
};

/**
 * The i-th person of a stream leaving a point: it starts at (x0, y0) (the outline's edge), fans out to its lane and
 * walks on to x1. Returns the position and an opacity (fading in and out at the ends).
 */
export const streamPos = (i: number, t: number, x0: number, x1: number, lanes: number, y0: number, laneY: number, dy: number, speed = 1) => {
  const ph = (t * 0.011 * speed + rnd(31, i)) % 1;
  const lane = i % lanes;
  const fan = easeOut(clamp(ph * 3));
  return { x: x0 + (x1 - x0) * ph, y: y0 + (laneY + lane * dy - y0) * fan + Math.sin(ph * 14 + i) * 4, o: Math.sin(ph * Math.PI) };
};

/** Base for every card: the blueprint ground and a slow push-in. */
export const CardBase: React.FC<{ t: number; len: number; id: string; z1?: number; children: React.ReactNode }> = ({ t, len, id, z1 = 1.06, children }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, z1]])}) translate(-960 -540)`}>
    <Schematic t={t} id={id} />
    {children}
  </g>
);
