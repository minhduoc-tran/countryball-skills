import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, project } from '../../countryball/geo-camera';
import { LAYERS } from '../../countryball/geo-data';
import { star } from '../../countryball/ball-flags';
import { clamp, Pt } from '../../countryball/fx-math';
import { RED, YELLOW, Txt } from './chb-common';

// Chapter F shared helpers (early Sept - 16.9.1972): a waving pole flag (VNCH / VNM), the 22:00 clock, the order
// document, the "front line" overlay on the province map (river line + south yellow / north red, clipped to land) and
// the assault arrow geometry on the citadel plan. Everything is a pure function of the clock passed in (frames t / seconds s).
export { sec, ramp, Txt, Pop, Backdrop, Dim, QtMap, MapHud, proj, YELLOW, RED } from './chb-common';
export { Chip, Plan, Vignette, drift, SRC_VN } from './chd-common';

/** One wavy flag cloth strip: a quad from x0..x0+w, y0..y0+h whose columns ripple with t (frames); the pole side stays still. */
const wavy = (x0: number, y0: number, w: number, y1: number, y2: number, t: number, amp: number): string => {
  const n = 12, top: string[] = [], bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n, dy = Math.sin(t * 0.22 + k * 5) * amp * k, x = x0 + w * k;
    top.push(`${x.toFixed(1)},${(y0 + y1 + dy).toFixed(1)}`);
    bot.unshift(`${x.toFixed(1)},${(y0 + y2 + dy).toFixed(1)}`);
  }
  return `M${top.join(' L')} L${bot.join(' L')} Z`;
};

/** Pole + flag. (x, y) = pole foot, `h` = pole height, `raise` 0..1 = how far up the cloth is hoisted, `kind` rvn | vnm. */
export const PoleFlag: React.FC<{ x: number; y: number; h?: number; kind: 'rvn' | 'vnm'; raise?: number; t: number; limp?: number }> = ({ x, y, h = 220, kind, raise = 1, t, limp = 0.5 }) => {
  const w = h * 0.62, ch = h * 0.42, top = y - h, cy = top + 10 + (1 - raise) * (h - ch - 20), amp = ch * 0.1 * (1 - limp * 0.5);
  const cloth = wavy(x + 5, cy, w, 0, ch, t, amp);
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={top} stroke="#2A2118" strokeWidth={9} strokeLinecap="round" />
      <circle cx={x} cy={top - 4} r={9} fill="#E2B95A" stroke="#2A2118" strokeWidth={3} />
      <path d={cloth} fill={kind === 'rvn' ? '#F2C230' : '#D2362C'} stroke="#2A2118" strokeWidth={4} strokeLinejoin="round" />
      {kind === 'rvn'
        ? [0.3, 0.5, 0.7].map((k) => <path key={k} d={wavy(x + 5, cy, w, ch * (k - 0.04), ch * (k + 0.04), t, amp)} fill="#C9343A" />)
        : <g transform={`translate(${x + 5 + w / 2},${cy + ch / 2 + Math.sin(t * 0.22 + 2.5) * amp * 0.5}) scale(${ch * 0.3})`}><polygon points={star(0, 0, 1)} fill="#FFDA3A" /></g>}
    </g>
  );
};

/** Analog + digital clock: hands sweep from `from` to `to` (minutes since 12:00 of the same dial) over `k` 0..1. (x, y) = centre. */
export const Clock: React.FC<{ x: number; y: number; r?: number; k: number; label: string; ring?: string }> = ({ x, y, r = 210, k, label, ring = '#E2B95A' }) => {
  const mins = 21 * 60 + 15 + 45 * clamp(k), hour = ((mins / 60) % 12) * 30, minute = (mins % 60) * 6;
  const hand = (deg: number, len: number, wd: number) => (
    <line x1={x} y1={y} x2={x + Math.sin((deg * Math.PI) / 180) * len} y2={y - Math.cos((deg * Math.PI) / 180) * len} stroke="#F4F4F4" strokeWidth={wd} strokeLinecap="round" />
  );
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#15202D" stroke={ring} strokeWidth={14} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6, big = i % 3 === 0;
        return <line key={i} x1={x + Math.sin(a) * r * 0.82} y1={y - Math.cos(a) * r * 0.82} x2={x + Math.sin(a) * r * (big ? 0.66 : 0.72)} y2={y - Math.cos(a) * r * (big ? 0.66 : 0.72)} stroke="#9FB3C8" strokeWidth={big ? 9 : 5} strokeLinecap="round" />;
      })}
      {hand(hour, r * 0.45, 14)}{hand(minute, r * 0.7, 9)}
      <circle cx={x} cy={y} r={12} fill={ring} />
      <Txt x={x} y={y + r + 120} text={label} size={170} color="#FFE9B0" ls={4} />
    </g>
  );
};

/** Order paper with a red seal star (a plain document, no text lines readable). (x, y) = centre. */
export const OrderPaper: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -4 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-186} y={-236} width={380} height={480} rx={10} fill="#000" opacity={0.3} />
    <rect x={-200} y={-250} width={380} height={480} rx={10} fill="#EFE6CF" stroke="#7B6A45" strokeWidth={6} />
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-150} y1={-110 + i * 30} x2={i % 3 === 2 ? 30 : 130} y2={-110 + i * 30} stroke="#8F8268" strokeWidth={8} strokeLinecap="round" />)}
    <polygon points={star(-90, -170, 46)} fill="#C23A2E" />
    <rect x={-20} y={-196} width={150} height={16} rx={6} fill="#8F8268" /><rect x={-20} y={-164} width={110} height={16} rx={6} fill="#8F8268" />
    <circle cx={90} cy={150} r={44} fill="none" stroke="#C23A2E" strokeWidth={8} opacity={0.85} /><polygon points={star(90, 150, 26)} fill="#C23A2E" opacity={0.85} />
  </g>
);

// ---------------- assault geometry on the citadel plan (local metres: x east, y south, origin = citadel centre) ----------------
export type LP = [number, number];
/** Five axes of the early-September assault: far start -> mid -> near the walls. */
export const ASSAULT: { far: LP[]; near: LP[] }[] = [
  { far: [[2100, 260], [1200, 200], [620, 130]], near: [[1200, 200], [700, 140], [330, 80]] },
  { far: [[1700, 1250], [900, 820], [440, 470]], near: [[900, 820], [560, 560], [300, 330]] },
  { far: [[320, 1500], [260, 900], [120, 470]], near: [[260, 900], [180, 600], [100, 320]] },
  { far: [[1600, -1000], [880, -600], [420, -360]], near: [[880, -600], [560, -420], [300, -250]] },
  { far: [[-800, 1300], [-460, 780], [-250, 440]], near: [[-460, 780], [-340, 560], [-200, 330]] },
];

// ---------------- province map overlay: the front line on the Thạch Hãn ----------------
const RIVER: number[] = LAYERS.quangtri.rivers['ThachHan'][0].pts;   // flat lon/lat, west -> Cửa Việt
const LAND_RINGS = LAYERS.quangtri.countries['VNM'];
const toPath = (cam: Camera, pts: number[], extra: [number, number][] = []): string => {
  const out: string[] = [];
  for (let i = 0; i < pts.length; i += 2) { const p = project(cam, pts[i], pts[i + 1]); out.push(`${p[0].toFixed(1)},${p[1].toFixed(1)}`); }
  for (const [lo, la] of extra) { const p = project(cam, lo, la); out.push(`${p[0].toFixed(1)},${p[1].toFixed(1)}`); }
  return `M${out.join(' L')} Z`;
};
/** River line as screen points (for arrows / labels). */
export const riverScreen = (cam: Camera): Pt[] => { const o: Pt[] = []; for (let i = 0; i < RIVER.length; i += 2) o.push(project(cam, RIVER[i], RIVER[i + 1])); return o; };

/** South bank (VNCH yellow) and north (Quân Giải phóng red, hatched) tints either side of the Thạch Hãn line, clipped to land.
 *  south / north 0..1 = how visible each tint is; `line` 0..1 draws the river front line itself. */
export const FrontSides: React.FC<{ cam: Camera; id: string; south: number; north: number; line?: number }> = ({ cam, id, south, north, line = 1 }) => {
  const clip = LAND_RINGS.map((r) => toPath(cam, r.pts)).join(' ');
  const southPath = toPath(cam, RIVER, [[107.6, 16.907], [107.6, 16.0], [105.9, 16.0], [105.9, 16.683]]);
  const northPath = toPath(cam, RIVER, [[107.6, 16.907], [107.6, 17.8], [105.9, 17.8], [105.9, 16.683]]);
  const line_ = toPath(cam, RIVER).replace(/ Z$/, '');
  return (
    <g>
      <defs>
        <clipPath id={`${id}-land`}><path d={clip} /></clipPath>
        <pattern id={`${id}-hatch`} width={26} height={26} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={26} height={26} fill={RED} fillOpacity={0.22} /><line x1={0} y1={0} x2={0} y2={26} stroke={RED} strokeWidth={9} strokeOpacity={0.5} />
        </pattern>
      </defs>
      <g clipPath={`url(#${id}-land)`}>
        <path d={southPath} fill={YELLOW} opacity={0.38 * south} />
        <path d={northPath} fill={`url(#${id}-hatch)`} opacity={north} />
      </g>
      <path d={line_} fill="none" stroke="#10151D" strokeWidth={18} strokeLinejoin="round" strokeLinecap="round" opacity={0.8 * line} />
      <path d={line_} fill="none" stroke="#F4F4F4" strokeWidth={6} strokeDasharray="22 14" strokeLinejoin="round" opacity={line} />
    </g>
  );
};

/** Simple pill label on maps. */
export const Tag: React.FC<{ x: number; y: number; text: string; sub?: string; color: string; o?: number }> = ({ x, y, text, sub, color, o = 1 }) => (
  <g opacity={o}>
    <rect x={x - 330} y={y - 50} width={660} height={sub ? 128 : 92} rx={22} fill="#15181F" fillOpacity={0.92} stroke={color} strokeWidth={6} />
    <text x={x} y={y + 16} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill={color}>{text}</text>
    {sub && <text x={x} y={y + 60} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={32} fill="#E6EBF2">{sub}</text>}
  </g>
);
