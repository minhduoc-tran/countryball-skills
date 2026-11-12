import React from 'react';
import { rnd, clamp } from '../../engine';
import { PAL, mix } from './kit-palette';

// A spinning Earth disc, orthographic, pure function of t.
//   <Globe id t r cx cy water={1} rot={0} ridge={0} mars={0} />
//   water 1 = blue oceans, 0 = dry tan basins with white salt flecks (continents stay).  rot = start longitude in degrees;
//   the globe also turns 0.3 deg/frame.  ridge 0..1 draws the mid-ocean ridge (65.000 km) as a glowing orange seam.
//   mars 0..1 morphs ocean + land + atmosphere to rusty red Mars (craters fade in).  Tilt 20 deg.  Draw labels yourself.
type LL = [number, number];
const NA: LL[] = [[-168, 66], [-140, 70], [-95, 72], [-80, 70], [-62, 60], [-55, 48], [-70, 42], [-76, 35], [-81, 25], [-97, 26], [-97, 18], [-87, 21], [-83, 10], [-78, 8], [-90, 14], [-105, 20], [-118, 32], [-124, 40], [-124, 48], [-135, 57], [-152, 60], [-166, 60]];
const GREEN: LL[] = [[-55, 60], [-45, 60], [-20, 70], [-20, 82], [-60, 82], [-72, 76]];
const SA: LL[] = [[-78, 8], [-62, 10], [-50, 0], [-35, -6], [-40, -22], [-48, -27], [-58, -38], [-66, -46], [-70, -54], [-74, -48], [-73, -35], [-71, -18], [-81, -6]];
const AFR: LL[] = [[-17, 21], [-10, 35], [10, 37], [32, 31], [43, 12], [51, 12], [40, -5], [40, -16], [33, -27], [20, -35], [12, -18], [9, 0], [-8, 4], [-17, 14]];
const EUR: LL[] = [[-10, 36], [-9, 43], [-2, 48], [5, 52], [10, 58], [5, 62], [15, 70], [30, 71], [60, 70], [100, 78], [140, 72], [180, 68], [170, 60], [160, 55], [142, 52], [135, 44], [125, 38], [122, 30], [110, 20], [108, 10], [100, 2], [98, 16], [90, 22], [80, 10], [72, 20], [60, 25], [50, 28], [45, 15], [35, 30], [28, 38], [20, 40], [12, 44], [3, 43]];
const AUS: LL[] = [[114, -22], [130, -12], [142, -11], [153, -26], [148, -38], [135, -35], [115, -34]];
const INDO: LL[] = [[95, 5], [105, -6], [120, -8], [140, -8], [130, 0], [110, 2]];
const ANT: LL[] = [[-180, -72], [-120, -75], [-60, -70], [0, -70], [60, -68], [120, -66], [180, -72], [180, -90], [-180, -90]];
const LAND = [NA, GREEN, SA, AFR, EUR, AUS, INDO, ANT];
const RIDGES: LL[][] = [
  [[-10, 70], [-20, 65], [-30, 55], [-33, 40], [-42, 25], [-45, 10], [-30, 0], [-14, -10], [-12, -30], [-15, -45], [-5, -55], [15, -55], [30, -50], [50, -40], [65, -30], [68, -20], [66, -5], [62, 10], [58, 13]],
  [[68, -42], [90, -48], [120, -50], [150, -58], [180, -62], [-150, -62], [-130, -55], [-115, -40], [-112, -20], [-108, 0], [-106, 15], [-109, 24]],
];
const TILT = 20 * (Math.PI / 180);
const D = Math.PI / 180;

const dense = (pts: LL[], closed: boolean, step = 7): LL[] => {
  const out: LL[] = [];
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    let dl = b[0] - a[0];
    if (dl > 180) dl -= 360;
    if (dl < -180) dl += 360;
    const k = Math.max(1, Math.ceil(Math.max(Math.abs(dl), Math.abs(b[1] - a[1])) / step));
    for (let j = 0; j < k; j++) out.push([a[0] + (dl * j) / k, a[1] + ((b[1] - a[1]) * j) / k]);
  }
  if (!closed) out.push(pts[pts.length - 1]);
  return out;
};

type V = { x: number; y: number; z: number };
/** Unit-sphere view vector: x right, y down (screen), z toward the viewer. */
const view = ([lon, lat]: LL, lam0: number): V => {
  const l = (lon - lam0) * D;
  const p = lat * D;
  return { x: Math.cos(p) * Math.sin(l), y: -(Math.sin(p) * Math.cos(TILT) - Math.cos(p) * Math.cos(l) * Math.sin(TILT)), z: Math.sin(p) * Math.sin(TILT) + Math.cos(p) * Math.cos(l) * Math.cos(TILT) };
};

/** A land polygon clipped at the limb: hidden stretches follow the disc edge. */
const landPath = (poly: LL[], lam0: number, r: number, cx: number, cy: number): string => {
  const v = dense(poly, true).map((p) => view(p, lam0));
  const s = v.findIndex((p) => p.z > 0);
  if (s < 0) return '';
  const w = [...v.slice(s), ...v.slice(0, s)];
  const pts: [number, number][] = [];
  let exitA = 0;
  for (let i = 0; i < w.length; i++) {
    const p = w[i];
    const q = w[(i + 1) % w.length];
    if (p.z > 0) pts.push([p.x, p.y]);
    if (p.z > 0 !== q.z > 0) {
      const f = p.z / (p.z - q.z);
      const ix = p.x + (q.x - p.x) * f;
      const iy = p.y + (q.y - p.y) * f;
      const m = Math.hypot(ix, iy) || 1;
      const a = Math.atan2(iy / m, ix / m);
      if (p.z > 0) { exitA = a; pts.push([ix / m, iy / m]); } else {
        let da = a - exitA;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        const n = Math.max(1, Math.ceil(Math.abs(da) / 0.15));
        for (let j = 1; j < n; j++) pts.push([Math.cos(exitA + (da * j) / n), Math.sin(exitA + (da * j) / n)]);
        pts.push([ix / m, iy / m]);
      }
    }
  }
  return 'M ' + pts.map(([x, y]) => `${(cx + x * r).toFixed(1)} ${(cy + y * r).toFixed(1)}`).join(' L ') + ' Z';
};

export const Globe: React.FC<{ id: string; t: number; r: number; cx: number; cy: number; water?: number; rot?: number; ridge?: number; mars?: number }> = ({ id, t, r, cx, cy, water = 1, rot = 0, ridge = 0, mars = 0 }) => {
  const lam0 = rot + t * 0.3;
  const wet = clamp(water);
  const m = clamp(mars);
  const oceanLit = mix(mix('#C9A97A', '#5BB6E6', wet), '#D0653A', m);
  const oceanDark = mix(mix('#6B573F', PAL.seaDeep, wet), '#6E2C18', m);
  const landCol = mix(mix('#7C9A4A', '#5D9B4A', wet), '#8C4A2C', m);
  const landEdge = mix('#34552E', '#4A1F10', m);
  const glow = mix(mix('#E9D3A3', '#7FC8F0', wet), '#FF9A5A', m);
  const segs: string[] = [];
  if (ridge > 0) {
    RIDGES.forEach((rg) => {
      let cur: string[] = [];
      dense(rg, false, 5).forEach((p) => {
        const v = view(p, lam0);
        if (v.z > 0.04) cur.push(`${(cx + v.x * r).toFixed(1)} ${(cy + v.y * r).toFixed(1)}`);
        else if (cur.length) { segs.push('M ' + cur.join(' L ')); cur = []; }
      });
      if (cur.length) segs.push('M ' + cur.join(' L '));
    });
  }
  const seam = segs.join(' ');
  const pulse = 0.85 + 0.15 * Math.sin(t / 5);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}o`} cx="0.38" cy="0.34" r="0.8"><stop offset="0" stopColor={oceanLit} /><stop offset="1" stopColor={oceanDark} /></radialGradient>
        <radialGradient id={`${id}sh`} cx="0.36" cy="0.32" r="0.85"><stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#0A0816" stopOpacity="0.62" /></radialGradient>
        <radialGradient id={`${id}at`} cx="0.5" cy="0.5" r="0.5"><stop offset="0.9" stopColor={glow} stopOpacity="0.55" /><stop offset="1" stopColor={glow} stopOpacity="0" /></radialGradient>
        <clipPath id={`${id}c`}><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.13} fill={`url(#${id}at)`} opacity={0.9 - 0.6 * m} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}o)`} />
      <g clipPath={`url(#${id}c)`}>
        {wet < 1 ? Array.from({ length: 70 }).map((_, i) => {
          const v = view([rnd(5, i) * 360 - 180, Math.asin(rnd(6, i) * 1.7 - 0.85) / D], lam0);
          if (v.z <= 0.1) return null;
          return <ellipse key={i} cx={cx + v.x * r} cy={cy + v.y * r} rx={r * (0.02 + 0.05 * rnd(7, i)) * v.z} ry={r * 0.02 * v.z} fill={i % 3 ? PAL.salt : '#7A6648'} opacity={(1 - wet) * 0.7 * (1 - m)} />;
        }) : null}
        {LAND.map((poly, i) => <path key={i} d={landPath(poly, lam0, r, cx, cy)} fill={landCol} stroke={landEdge} strokeWidth={Math.max(1.5, r * 0.012)} strokeLinejoin="round" />)}
        {m > 0.3 ? Array.from({ length: 22 }).map((_, i) => {
          const v = view([rnd(15, i) * 360 - 180, Math.asin(rnd(16, i) * 1.8 - 0.9) / D], lam0);
          return v.z > 0.1 ? <ellipse key={i} cx={cx + v.x * r} cy={cy + v.y * r} rx={r * 0.045 * v.z} ry={r * 0.045 * v.z * v.z} fill="#5A2412" opacity={(m - 0.3) * 0.7} /> : null;
        }) : null}
        {ridge > 0 ? (
          <g opacity={ridge * pulse} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={seam} stroke="#FF8A3D" strokeWidth={r * 0.07} opacity={0.28} />
            <path d={seam} stroke="#FFB15A" strokeWidth={r * 0.03} opacity={0.7} />
            <path d={seam} stroke="#FFF3C4" strokeWidth={Math.max(2, r * 0.012)} />
          </g>
        ) : null}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id}sh)`} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={glow} strokeWidth={Math.max(2, r * 0.012)} opacity={0.7} />
    </g>
  );
};
