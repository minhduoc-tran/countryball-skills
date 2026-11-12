import React from 'react';
import { clamp, lerp, easeInOut, easeOut, rnd } from '../../engine';

// CHAPTER C props, part 1: the sea port. All pure functions of the shot clock t (frames, 30 fps), drawn in 1920 x 1080 world units.
//   <HarborBack t id />            bright morning sky, far cranes and container stacks, the horizon (y 450) and open sea
//   <SeaFront t wl? />             translucent near water laid OVER ship hulls / tentacle tips (crest line at y = wl)
//   <Pier id />                    foreground quay, top face y 846 (stand Pip at ground 866)
//   <CargoShip x y sc t bob? squeeze? />   container ship facing right: x centre, y waterline; length ~820 * sc
//   <OctoBody o t ... /> + <OctoArms o t wrap ... />   the giant octopus: purple-red, big eyes, EIGHT animated tentacles
//   <BigWave t at x y w h /> + <QuayTowers /> a building-tall wave beside port towers

const INK = '#16101A';
export type P = { x: number; y: number };
export type OctoOpts = { ox: number; oy: number; sc: number; rot?: number };
export const OCTO = { body: '#9B2E63', dark: '#6A1D47', light: '#C9487F', cup: '#F6C3D0', ink: '#2A0F26' };

const tf = (o: OctoOpts, lx: number, ly: number): P => {
  const r = ((o.rot ?? 0) * Math.PI) / 180;
  const [c, s] = [Math.cos(r), Math.sin(r)];
  return { x: o.ox + (lx * c - ly * s) * o.sc, y: o.oy + (lx * s + ly * c) * o.sc };
};
/** Where tentacle k (0..7, left to right) leaves the body, in world units. */
export const octoBase = (o: OctoOpts, k: number): P => tf(o, -196 + k * 56, 6);

/** Tapered ribbon along pts; `i0` is the global index of pts[0] (of `n` segments in all) so a split spine keeps one taper. */
const ribbon = (pts: P[], w0: number, w1: number, i0 = 0, n = pts.length - 1) => {
  const L: string[] = [];
  const R: string[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const m = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const w = lerp(w0, w1, (i0 + i) / n) / 2;
    const [nx, ny] = [(-(b.y - a.y) / m) * w, ((b.x - a.x) / m) * w];
    L.push(`${(p.x + nx).toFixed(1)},${(p.y + ny).toFixed(1)}`);
    R.push(`${(p.x - nx).toFixed(1)},${(p.y - ny).toFixed(1)}`);
  });
  return L.concat(R.reverse()).join(' ');
};

const N = 18;
export type ShipRef = { x: number; y: number; sc: number };

/** The spine of tentacle k: wrap 1 = hugging down over the ship's containers, 0 = free, waving up and out. flail scales the waving. */
export const octoSpine = (o: OctoOpts, k: number, t: number, wrap: number, ship: ShipRef, squeeze = 0, flail = 1): P[] => {
  const b = octoBase(o, k);
  const left = k < 4;
  const a0 = [165, 180, 195, 210, 330, 345, 360, 15][k];
  const free: P[] = [];
  let cur = { ...b };
  const seg = (640 * o.sc * (0.9 + 0.2 * rnd(3, k))) / N;
  for (let i = 0; i <= N; i++) {
    free.push(cur);
    const u = i / N;
    const ang = a0 + (left ? 1 : -1) * 58 * Math.pow(u, 1.3) + Math.sin(t * 0.13 + k * 1.3 - i * 0.55) * 11 * u * flail + (o.rot ?? 0);
    cur = { x: cur.x + Math.cos((ang * Math.PI) / 180) * seg, y: cur.y + Math.sin((ang * Math.PI) / 180) * seg };
  }
  if (wrap <= 0) return free;
  const tx = ship.x + (-235 + k * 70) * ship.sc;
  const topY = ship.y - 306 * ship.sc;
  const apexY = topY - 22;
  const endY = ship.y + 70;
  const w = easeInOut(clamp(wrap));
  return free.map((f, i) => {
    const u = i / N;
    const up = u < 0.42;
    const wig = (Math.sin(u * 7 + k * 1.9 + t * 0.06) * 20 * (1 - squeeze * 0.6) + (k - 3.5) * 9 * u) * Math.min(1, u * 3);
    const x = (up ? lerp(b.x, tx, easeOut(u / 0.42)) : tx) + wig;
    const y = up ? lerp(b.y, apexY, easeOut(u / 0.42)) : lerp(apexY, endY, Math.pow((u - 0.42) / 0.58, 0.9));
    return { x: lerp(f.x, x, w), y: lerp(f.y, y, w) };
  });
};

const CUT = 7; // spine index where a wrapped tentacle crosses the top of the container stack (behind the ship before, in front after)

/** The eight tentacles. part 'back' = up to the stack's top edge (draw before the ship), 'front' = down over the boxes (after the ship), 'all' = whole. hi(k) 0..1 lights tentacle k up (counting). */
export const OctoArms: React.FC<{ o: OctoOpts; t: number; wrap?: number; ship: ShipRef; squeeze?: number; flail?: number; hi?: (k: number) => number; part?: 'all' | 'back' | 'front' }> = ({ o, t, wrap = 0, ship, squeeze = 0, flail = 1, hi, part = 'all' }) => (
  <g strokeLinejoin="round" strokeLinecap="round">
    {Array.from({ length: 8 }).map((_, k) => {
      const all = octoSpine(o, k, t, wrap, ship, squeeze, flail);
      const lo = part === 'front' ? CUT : 0;
      const hiI = part === 'back' ? CUT : N;
      const pts = all.slice(lo, hiI + 1);
      const w0 = lerp(58, 54, clamp(wrap)) * o.sc;
      const sw = Math.max(1.6, 6 * Math.min(1, o.sc * 1.4));
      const w1 = lerp(9, 30, clamp(wrap)) * o.sc;
      const h = hi ? hi(k) : 0;
      return (
        <g key={k}>
          {wrap > 0.3 && part !== 'back' ? <polygon points={ribbon(pts.map((p) => ({ x: p.x + 9, y: p.y + 11 })), w0, w1, lo, N)} fill="#000" opacity={0.22} /> : null}
          <polygon points={ribbon(pts, w0, w1, lo, N)} fill={h > 0.3 ? '#F0589A' : OCTO.body} stroke={INK} strokeWidth={sw} />
          <polyline points={pts.slice(1, -1).map((p) => `${p.x - 0.12 * w0},${p.y - 0.12 * w0}`).join(' ')} fill="none" stroke={OCTO.light} strokeWidth={w0 * 0.14} opacity={0.5} />
          {all.map((p, i) => {
            if (i < Math.max(3, lo) || i > Math.min(N - 2, hiI) || i % 2) return null;
            const w = lerp(w0, w1, i / N);
            const a = all[i - 1];
            const bb = all[i + 1];
            const m = Math.hypot(bb.x - a.x, bb.y - a.y) || 1;
            const side = k < 4 ? 1 : -1;
            return <circle key={i} cx={p.x + (-(bb.y - a.y) / m) * w * 0.2 * side} cy={p.y + ((bb.x - a.x) / m) * w * 0.2 * side} r={w * 0.17} fill={OCTO.cup} stroke={OCTO.dark} strokeWidth={sw * 0.4} />;
          })}
        </g>
      );
    })}
  </g>
);

const Eye: React.FC<{ x: number; y: number; look: number; lookY: number; lid: number; blink: number }> = ({ x, y, look, lookY, lid, blink }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse rx={66} ry={72} fill="#FFFFFF" stroke={INK} strokeWidth={7} />
    <circle cx={look * 26} cy={lookY * 24} r={34} fill="#1E0F26" />
    <circle cx={look * 26 - 11} cy={lookY * 24 - 13} r={11} fill="#FFFFFF" />
    <circle cx={look * 26 + 12} cy={lookY * 24 + 14} r={5} fill="#FFFFFF" opacity={0.8} />
    {(() => {
      const ly = -72 + lid * 80;
      const xe = 66 * Math.sqrt(Math.max(0, 1 - (ly / 72) ** 2));
      return <path d={`M ${-xe} ${ly} A 66 72 0 0 1 ${xe} ${ly} Q 0 ${ly + 16 + lid * 10} ${-xe} ${ly} Z`} fill={OCTO.body} stroke={INK} strokeWidth={6} strokeLinejoin="round" />;
    })()}
    {blink > 0 ? <ellipse rx={68} ry={74 * blink} cy={0} fill={OCTO.body} stroke={INK} strokeWidth={6} transform={`translate(0 ${-74 * (1 - blink)})`} /> : null}
  </g>
);

/** Mantle and face. o.oy is the head's bottom edge (where the tentacles start); the dome rises ~430 * sc above it. */
export const OctoBody: React.FC<{ o: OctoOpts; t: number; look?: number; lookY?: number; lid?: number; mouth?: number }> = ({ o, t, look = -0.6, lookY = 0.3, lid = 0.35, mouth = 0 }) => {
  const bl = Math.floor(t) % 97 > 93 ? 0.8 : 0;
  const breathe = 1 + 0.012 * Math.sin(t * 0.16);
  return (
    <g transform={`translate(${o.ox} ${o.oy}) rotate(${o.rot ?? 0}) scale(${o.sc * breathe} ${o.sc / breathe})`}>
      <path d="M -236 30 C -310 -120 -270 -400 0 -440 C 270 -400 310 -120 236 30 Z" fill={OCTO.body} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 10 -438 C 270 -400 310 -120 236 30 L 60 30 C 170 -120 150 -340 10 -438 Z" fill={OCTO.dark} opacity={0.55} />
      <ellipse cx={-120} cy={-330} rx={70} ry={40} fill={OCTO.light} opacity={0.4} transform="rotate(-28 -120 -330)" />
      {[[-170, -120, 20], [-205, -200, 14], [150, -330, 18], [190, -250, 12], [-60, -380, 13], [90, -400, 10], [215, -140, 15]].map(([sx, sy, sr], i) => (
        <circle key={i} cx={sx} cy={sy} r={sr} fill={OCTO.light} stroke={OCTO.dark} strokeWidth={3} opacity={0.75} />
      ))}
      <Eye x={-100} y={-190} look={look} lookY={lookY} lid={lid} blink={bl} />
      <Eye x={100} y={-190} look={look} lookY={lookY} lid={lid} blink={bl} />
      <path d={`M -34 -86 Q 0 ${-70 + 30 * mouth} 34 -86 Q 0 ${-100 + 24 * mouth} -34 -86 Z`} fill={OCTO.ink} stroke={INK} strokeWidth={4} />
    </g>
  );
};

// ---------------------------------------------------------------- the port
const CRANE = '#D9542E';
const Crane: React.FC<{ x: number; s: number }> = ({ x, s }) => (
  <g transform={`translate(${x} 462) scale(${s})`} stroke="#8E2E1A" strokeWidth={4} strokeLinejoin="round" fill="none">
    <path d="M -60 0 L -50 -170 M 60 0 L 50 -170 M -55 -90 L 55 -90" />
    <rect x={-70} y={-196} width={140} height={28} fill={CRANE} />
    <path d="M -230 -196 L 260 -196 L 260 -176 L -230 -176 Z" fill={CRANE} />
    <path d="M -230 -196 L 0 -300 L 260 -196 M 0 -300 L 0 -196" />
    <path d="M 170 -176 L 170 -80" strokeWidth={3} />
    <rect x={150} y={-84} width={40} height={20} fill="#2F7FBF" stroke={INK} strokeWidth={3} />
  </g>
);
const BoxStack: React.FC<{ x: number; seed: number; cols?: number }> = ({ x, seed, cols = 4 }) => (
  <g>
    {Array.from({ length: cols * 3 }).map((_, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      if (r > 0 && rnd(seed, i) < 0.25) return null;
      return <rect key={i} x={x + c * 46} y={456 - (r + 1) * 24} width={44} height={22} fill={['#D9482F', '#2F7FBF', '#E8B13A', '#3E9C6B', '#8E5BB8'][Math.floor(rnd(seed + 1, i) * 5)]} stroke={INK} strokeWidth={1.8} opacity={0.9} />;
    })}
  </g>
);

export const HarborBack: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4FA8EA" />
        <stop offset="100%" stopColor="#D5EEFB" />
      </linearGradient>
      <linearGradient id={`${id}sea`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4FA6C4" />
        <stop offset="45%" stopColor="#23799F" />
        <stop offset="100%" stopColor="#0F4767" />
      </linearGradient>
    </defs>
    <rect x={-500} y={-500} width={2900} height={960} fill={`url(#${id}sky)`} />
    <circle cx={330} cy={150} r={70} fill="#FFF6C8" />
    <circle cx={330} cy={150} r={170} fill="#FFF6C8" opacity={0.25} />
    {[[260, 120, 1], [820, 90, 1.3], [1560, 190, 1.1], [1100, 270, 0.8]].map(([cx, cy, s], i) => (
      <g key={i} transform={`translate(${((cx + t * 0.12 * s) % 2300) - 200} ${cy}) scale(${s})`} opacity={0.9}>
        <ellipse rx={130} ry={32} fill="#FFFFFF" />
        <ellipse cx={30} cy={-22} rx={70} ry={30} fill="#FFFFFF" />
      </g>
    ))}
    <g opacity={0.8}>
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={-50 + i * 100 + rnd(11, i) * 30} y={462 - 40 - rnd(12, i) * 80} width={70} height={130} fill="#9CBBD0" />
      ))}
    </g>
    <BoxStack x={40} seed={4} cols={5} />
    <BoxStack x={1580} seed={7} cols={6} />
    <Crane x={380} s={1.0} />
    <Crane x={1480} s={1.15} />
    <rect x={-500} y={448} width={2900} height={900} fill={`url(#${id}sea)`} />
    <rect x={-500} y={446} width={2900} height={8} fill="#BFE3F0" opacity={0.7} />
    {Array.from({ length: 34 }).map((_, i) => {
      const y = 470 + Math.pow(rnd(21, i), 1.6) * 520;
      const x = ((rnd(22, i) * 2600 + t * (0.5 + rnd(23, i))) % 2600) - 300;
      return <rect key={i} x={x} y={y} width={30 + (y - 440) * 0.18} height={3 + (y - 440) * 0.008} rx={2} fill="#FFFFFF" opacity={0.28} />;
    })}
  </g>
);

export const SeaFront: React.FC<{ t: number; wl?: number; o?: number }> = ({ t, wl = 730, o = 0.62 }) => {
  const crest = (dy: number, ph: number, amp: number) => {
    let d = `M -400 1200 L -400 ${wl + dy}`;
    for (let x = -400; x <= 2400; x += 40) d += ` L ${x} ${wl + dy + Math.sin(x * 0.013 + t * 0.09 + ph) * amp}`;
    return d + ' L 2400 1200 Z';
  };
  return (
    <g>
      <path d={crest(0, 0, 7)} fill="#2A86AE" opacity={o} />
      <path d={crest(0, 0, 7).replace(/ L 2400 1200 Z/, '').replace('M -400 1200 L -400', 'M -400')} fill="none" stroke="#DDF4FB" strokeWidth={5} opacity={0.8} />
      <path d={crest(60, 2, 9)} fill="#1C6F96" opacity={o * 0.8} />
    </g>
  );
};

export const Pier: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <polygon points="-400,846 700,846 770,886 -400,886" fill="#B7BFC8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <polygon points="-400,886 770,886 770,1200 -400,1200" fill="#6C7683" stroke={INK} strokeWidth={5} />
    <polygon points="700,846 770,886 770,1200 700,1200" fill="#59636F" opacity={0.5} />
    {[-100, 260, 600].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={950} rx={52} ry={62} fill="#1B1B22" stroke="#0D0D12" strokeWidth={4} />
        <ellipse cx={x} cy={950} rx={26} ry={32} fill="#6C7683" />
      </g>
    ))}
    <rect x={500} y={808} width={34} height={46} rx={8} fill="#2B3138" stroke={INK} strokeWidth={4} />
    <ellipse cx={517} cy={808} rx={26} ry={9} fill="#3A424B" stroke={INK} strokeWidth={4} />
    <path d="M -400 886 L 770 886" stroke="#F2C230" strokeWidth={9} opacity={0.9} />
    <rect x={-400} y={846} width={1170} height={5} fill="#FFFFFF" opacity={0.35} />
    <defs><linearGradient id={`${id}pg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.35" /></linearGradient></defs>
    <rect x={-400} y={886} width={1170} height={314} fill={`url(#${id}pg)`} />
  </g>
);

const BOX = ['#D9482F', '#2F7FBF', '#E8B13A', '#3E9C6B', '#8E5BB8', '#E67E3C'];
/** Container ship facing right, 3 rows of containers. x centre, y waterline (the hull runs 40 below it). squeeze 0..1 makes the boxes shudder and bulge. */
export const CargoShip: React.FC<{ x: number; y: number; sc?: number; t: number; rot?: number; squeeze?: number }> = ({ x, y, sc = 0.8, t, rot = 0, squeeze = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`}>
    <path d="M -410 -120 L 330 -120 Q 440 -125 480 -176 L 446 44 L -380 44 Q -424 44 -410 0 Z" fill="#22385E" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M -400 -20 L 462 -20 L 446 44 L -380 44 Q -424 44 -410 0 Z" fill="#B3362E" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -408 -120 L 330 -120 Q 440 -125 480 -176 L 474 -150 Q 430 -100 330 -98 L -408 -98 Z" fill="#324E80" opacity={0.7} />
    <rect x={-420} y={-340} width={150} height={222} rx={8} fill="#F1ECE2" stroke={INK} strokeWidth={7} />
    <rect x={-408} y={-392} width={126} height={52} rx={8} fill="#F1ECE2" stroke={INK} strokeWidth={7} />
    {[0, 1, 2].map((r) => <rect key={r} x={-396 + r * 40} y={-376} width={30} height={22} fill="#7FC4E8" stroke={INK} strokeWidth={4} />)}
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-400 + c * 44} y={-320 + r * 62} width={30} height={34} fill="#7FC4E8" stroke={INK} strokeWidth={4} />))}
    <rect x={-380} y={-420} width={34} height={36} fill="#C23B2B" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 15 }).map((_, i) => {
      const c = i % 5;
      const r = Math.floor(i / 5);
      const wob = squeeze * Math.sin(t * 1.3 + i * 2.1) * 3.2;
      const bulge = 1 + squeeze * 0.05 * Math.sin(t * 0.7 + i);
      return (
        <g key={i} transform={`translate(${-246 + c * 106 + wob} ${-120 - (r + 1) * 62 + (squeeze ? Math.cos(t * 1.1 + i) * 1.6 : 0)}) scale(${bulge} 1)`}>
          <rect width={102} height={60} fill={BOX[(i * 2 + r) % 6]} stroke={INK} strokeWidth={5} />
          <path d="M 18 4 V 56 M 36 4 V 56 M 54 4 V 56 M 72 4 V 56 M 90 4 V 56" stroke={INK} strokeWidth={2.2} opacity={0.35} />
          <rect width={102} height={9} fill="#FFFFFF" opacity={0.18} />
        </g>
      );
    })}
  </g>
);

/** Spray: a geyser of foam blobs that shoots up at `at`, hangs, and collapses. x, y = the water line. */
export const SprayColumn: React.FC<{ t: number; at: number; x: number; y: number; h: number; w: number; seed?: number }> = ({ t, at, x, y, h, w, seed = 5 }) => {
  const p = (t - at) / 40;
  if (p < 0 || p > 1) return null;
  const up = easeOut(clamp(p * 3.5));
  const down = clamp((p - 0.45) / 0.55);
  const hh = h * up * (1 - 0.92 * down * down);
  const o = 1 - Math.pow(down, 2);
  return (
    <g opacity={o}>
      {Array.from({ length: 9 }).map((_, j) => {
        const f = j / 8;
        const r = w * 0.5 * (1.05 - 0.55 * f) * (0.8 + 0.4 * rnd(seed, j));
        const cx = x + (rnd(seed + 3, j) - 0.5) * w * 0.35 * (1 + f);
        return <circle key={j} cx={cx} cy={y - hh * f} r={r} fill={j % 2 ? '#F2FBFE' : '#CDEFF9'} stroke="#8CCBE2" strokeWidth={4} />;
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (rnd(seed + 1, i) - 0.5) * 2.2;
        const hh2 = p * 40;
        const sp = (0.6 + rnd(seed + 2, i)) * h * 0.011;
        return <circle key={`d${i}`} cx={x + Math.sin(a) * sp * hh2 * 1.6} cy={y - hh * 0.8 - Math.cos(a) * sp * hh2 + 0.5 * hh2 * hh2 * 0.35} r={5 + 9 * rnd(seed + 4, i)} fill="#F2FBFE" stroke="#8CCBE2" strokeWidth={2.5} />;
      })}
    </g>
  );
};

/** A tall wave wall (side profile, crest curling left) rising from y over `rise` 0..1. x = left foot, w, h = full height. */
export const BigWave: React.FC<{ t: number; x: number; y: number; w: number; h: number; rise: number; id: string }> = ({ t, x, y, w, h, rise, id }) => {
  const hh = h * easeOut(clamp(rise));
  if (hh < 4) return null;
  const d = `M 0 40 L 0 0 C ${w * 0.1} ${-hh * 0.04} ${w * 0.16} ${-hh * 0.7} ${w * 0.46} ${-hh} C ${w * 0.62} ${-hh * 1.05} ${w * 0.8} ${-hh * 0.97} ${w * 0.8} ${-hh * 0.8} C ${w * 0.72} ${-hh * 0.86} ${w * 0.56} ${-hh * 0.84} ${w * 0.52} ${-hh * 0.7} C ${w * 0.66} ${-hh * 0.4} ${w * 0.9} ${-hh * 0.12} ${w} 0 L ${w} 40 Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id={`${id}wv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C8F0FA" />
          <stop offset="0.3" stopColor="#3FA6D2" />
          <stop offset="1" stopColor="#0E4770" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}wv)`} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <path d={`M ${w * 0.1} ${-hh * 0.3} Q ${w * 0.2} ${-hh * 0.6} ${w * 0.4} ${-hh * 0.86}`} fill="none" stroke="#FFFFFF" strokeWidth={10} opacity={0.4} strokeLinecap="round" />
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} cx={w * (0.3 + 0.55 * rnd(31, i)) + Math.sin(t * 0.2 + i) * 6} cy={-hh * (0.74 + 0.3 * rnd(32, i)) - (t % 30) * 0.5 * rnd(33, i)} r={7 + 14 * rnd(34, i)} fill="#F2FBFE" opacity={0.9} />
      ))}
      <path d={`M ${w * 0.5} ${-hh * 0.72} Q ${w * 0.62} ${-hh * 0.9} ${w * 0.79} ${-hh * 0.82}`} fill="none" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" opacity={0.85} />
    </g>
  );
};

/** Port office towers, a warehouse and a lamp: gives the wave a scale. Bases on y. */
export const QuayTowers: React.FC<{ x: number; y: number; id: string }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-60} y={0} width={900} height={400} fill="#8E98A4" stroke={INK} strokeWidth={6} />
    <rect x={-60} y={0} width={900} height={12} fill="#F2C230" />
    <rect x={0} y={-240} width={330} height={240} fill="#7C8794" stroke={INK} strokeWidth={6} />
    <rect x={330} y={-620} width={170} height={620} fill="#9CB2C6" stroke={INK} strokeWidth={6} />
    <rect x={500} y={-420} width={150} height={420} fill="#B9C6D2" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={346 + c * 50} y={-596 + r * 48} width={34} height={26} fill="#E8F4FA" stroke={INK} strokeWidth={3} />))}
    {Array.from({ length: 8 }).map((_, r) => [0, 1].map((c) => <rect key={`b${r}${c}`} x={520 + c * 56} y={-396 + r * 46} width={38} height={24} fill="#E8F4FA" stroke={INK} strokeWidth={3} />))}
    {[0, 1, 2, 3].map((c) => <rect key={`w${c}`} x={22 + c * 76} y={-150} width={56} height={150} fill="#5E6874" stroke={INK} strokeWidth={4} />)}
  </g>
);

/** Rings spreading over the water round the ship after the wave passes (x, y = the waterline). */
export const Ripples: React.FC<{ t: number; x: number; y: number; rx: number }> = ({ t, x, y, rx }) => (
  <g fill="none" stroke="#E6F7FC">
    {[0, 12, 24].map((d) => {
      const p = ((t - d) % 46) / 46;
      return t >= d ? <ellipse key={d} cx={x} cy={y + 20} rx={rx * (0.7 + 0.8 * p)} ry={rx * 0.09 * (0.7 + 0.8 * p)} strokeWidth={6 * (1 - p)} opacity={0.8 * (1 - p)} /> : null;
    })}
  </g>
);
