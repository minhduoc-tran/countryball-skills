import React from 'react';
import { Glow, Puff } from './fx-glow';
import { GroundBlast } from './fx-bomb-carpet';
import { clamp, easeOut, hash, lerp, Pt, polar, prog } from './fx-math';
import { WaterSplash } from './ground-water-splash';

// Artillery on the map (screen px, t in frames, 30 fps, everything deterministic):
//   <Howitzer x y aim s? recoil? tone? />        top-view gun, barrel along `aim` degrees (0 = east, 90 = south), s = length px
//   <HowitzerSide x y s? elev? recoil? flip? />  side view (for close-ups), facing right
//   <MuzzleFlash x y dir t t0 size? />           flash + smoke cloud of ONE shot fired at frame t0
//   <ArtilleryBattery id t t0 x y aim n? gap? period? s? seed? />  n guns in a row across the aim, firing in staggered turn
//   <ShellArc t t0 from to dur? lift? water? r? linger? />   one shell streaking along an arc, impact blast (or water splash) at `to`
//   <ShellBarrage id t t0 from to n? span? spread? dur? lift? water? r? />   many shells onto a target area (incoming fire)
//   arcPos(from, to, u, lift)                    shell position at flight progress u (arc rises `lift` px above the chord)
// "from" far outside the screen (e.g. [-300, 100]) gives shells that come streaking in from beyond the map.

const INK = '#151515';
const TONES = { vn: ['#5E6B34', '#7C8A4A'], us: ['#4B5A3C', '#6A7A55'], grey: ['#5A6068', '#7B838C'] } as const;
export type GunTone = keyof typeof TONES;

export const Howitzer: React.FC<{ x: number; y: number; aim?: number; s?: number; recoil?: number; tone?: GunTone }> = ({ x, y, aim = 0, s = 70, recoil = 0, tone = 'vn' }) => {
  const [dark, mid] = TONES[tone], k = s / 100, sw = Math.max(1.8, 3.2 * k);
  return (
    <g transform={`translate(${x},${y}) rotate(${aim}) scale(${k})`}>
      {/* trails (the legs that dig in behind the gun) */}
      <path d="M-4,0 L-52,-22 M-4,0 L-52,22" stroke={INK} strokeWidth={9 + sw / k} strokeLinecap="round" fill="none" />
      <path d="M-4,0 L-52,-22 M-4,0 L-52,22" stroke={dark} strokeWidth={6} strokeLinecap="round" fill="none" />
      <rect x={-12} y={-23} width={14} height={9} rx={2} fill="#2B2E32" stroke={INK} strokeWidth={sw / k} />
      <rect x={-12} y={14} width={14} height={9} rx={2} fill="#2B2E32" stroke={INK} strokeWidth={sw / k} />
      <g transform={`translate(${-recoil * 10},0)`}>
        <rect x={-6} y={-5} width={74} height={10} rx={2} fill={mid} stroke={INK} strokeWidth={sw / k} />
        <rect x={64} y={-7} width={13} height={14} rx={2} fill={dark} stroke={INK} strokeWidth={sw / k} />
        <rect x={-12} y={-7} width={20} height={14} rx={3} fill={dark} stroke={INK} strokeWidth={sw / k} />
      </g>
      <rect x={4} y={-17} width={7} height={34} rx={2} fill="#3A4128" stroke={INK} strokeWidth={sw / k} />
    </g>
  );
};

export const HowitzerSide: React.FC<{ x: number; y: number; s?: number; elev?: number; recoil?: number; flip?: boolean; tone?: GunTone }> = ({ x, y, s = 220, elev = 22, recoil = 0, flip = false, tone = 'vn' }) => {
  const [dark, mid] = TONES[tone], k = s / 200;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -k : k},${k})`} strokeLinejoin="round" strokeLinecap="round">
      <path d="M-30,-6 L-92,16 L-100,16 L-100,10 L-40,-14 Z" fill={dark} stroke={INK} strokeWidth={3.4} />
      <g transform={`rotate(${-elev} 0 -34) translate(${-recoil * 16},0)`}>
        <rect x={-18} y={-42} width={128} height={16} rx={4} fill={mid} stroke={INK} strokeWidth={3.4} />
        <rect x={104} y={-46} width={24} height={24} rx={3} fill={dark} stroke={INK} strokeWidth={3.4} />
        <rect x={-28} y={-46} width={30} height={24} rx={4} fill={dark} stroke={INK} strokeWidth={3.4} />
      </g>
      <rect x={-12} y={-52} width={10} height={44} rx={2} fill="#3A4128" stroke={INK} strokeWidth={3} />
      <circle cx={-6} cy={-4} r={22} fill="#2B2E32" stroke={INK} strokeWidth={3.6} /><circle cx={-6} cy={-4} r={8} fill="#6A6F73" stroke={INK} strokeWidth={2.4} />
      <rect x={-34} y={-34} width={56} height={14} rx={4} fill={dark} stroke={INK} strokeWidth={3} />
    </g>
  );
};

/** ONE shot at frame t0: white-yellow star (5 frames), glow, then a smoke cloud blown forward that thins out over ~70 frames. */
export const MuzzleFlash: React.FC<{ x: number; y: number; dir: number; t: number; t0: number; size?: number }> = ({ x, y, dir, t, t0, size = 46 }) => {
  const a = t - t0;
  if (a < 0 || a > 90) return null;
  const star = a < 6 ? 1 - a / 6 : 0;
  return (
    <g>
      {[0, 1, 2].map((i) => { const d = size * (0.5 + 0.8 * easeOut(a / 30)) * (0.6 + i * 0.5), p = polar(x, y, dir + (i - 1) * 16, d);
        return <Puff key={i} x={p[0]} y={p[1] - a * 0.25} r={size * (0.3 + 0.22 * i) * (0.6 + 0.6 * easeOut(a / 34))} color="#CFCFCB" o={0.55 * (1 - prog(a, 12, 90))} seed={i + x} />; })}
      {star > 0 && <>
        <Glow x={x} y={y} r={size * 2.2} color="#FFB347" o={0.9 * star} />
        <polygon points={Array.from({ length: 14 }, (_, i) => polar(x, y, dir - 70 + i * (140 / 13), (i % 2 ? 0.55 : 1.5) * size * star).join(',')).join(' ')} fill="#FFF3C4" opacity={star} />
        <circle cx={x} cy={y} r={size * 0.32 * star} fill="#FFFFFF" />
      </>}
    </g>
  );
};

/** n guns side by side (spread `gap` px across the firing direction), each fires every `period` frames, staggered. */
export const ArtilleryBattery: React.FC<{ id: string; t: number; t0: number; x: number; y: number; aim: number; n?: number; gap?: number; period?: number; s?: number; seed?: number; tone?: GunTone; rounds?: number }> = ({
  t, t0, x, y, aim, n = 4, gap = 90, period = 44, s = 76, seed = 1, tone = 'vn', rounds = 99,
}) => (
  <g>
    {Array.from({ length: n }, (_, j) => {
      const gx = x + polar(0, 0, aim + 90, (j - (n - 1) / 2) * gap)[0], gy = y + polar(0, 0, aim + 90, (j - (n - 1) / 2) * gap)[1];
      const phase = hash(j, seed) * period, since = t - t0 - phase, m = Math.floor(since / period), age = since - m * period;
      const fired = since >= 0 && m < rounds, rec = fired && age < 12 ? 1 - age / 12 : 0, mp = polar(gx, gy, aim, s * 0.78);
      return (
        <g key={j}>
          {fired && age < 24 && <ellipse cx={gx + 8} cy={gy + 6} rx={s * 0.5 * (1 + age / 24)} ry={s * 0.16 * (1 + age / 24)} fill="#C9B98F" opacity={0.5 * (1 - age / 24)} />}
          <Howitzer x={gx} y={gy} aim={aim} s={s} recoil={rec} tone={tone} />
          {fired && <MuzzleFlash x={mp[0]} y={mp[1]} dir={aim} t={age} t0={0} size={s * 0.5} />}
        </g>
      );
    })}
  </g>
);

/** Shell position at flight progress u: straight chord plus an arc `lift` px up the screen at mid-flight. */
export const arcPos = (from: Pt, to: Pt, u: number, lift = 140): Pt => [lerp(from[0], to[0], u), lerp(from[1], to[1], u) - 4 * lift * u * (1 - u)];

/** One shell fired at frame t0, arriving at frame t0 + dur: glowing head, tapering streak behind, then GroundBlast (or WaterSplash
 *  with `water`). `lift` = arc height px. Hidden before t0; the streak fades 8 frames after impact. */
export const ShellArc: React.FC<{ t: number; t0: number; from: Pt; to: Pt; dur?: number; lift?: number; water?: boolean; r?: number; linger?: number; color?: string }> = ({
  t, t0, from, to, dur = 46, lift = 150, water = false, r = 34, linger = 140, color = '#FFC15A',
}) => {
  const a = t - t0;
  if (a < 0) return null;
  const u = clamp(a / dur), segs = 14, trail = 0.2, pts: Pt[] = Array.from({ length: segs + 1 }, (_, i) => arcPos(from, to, clamp(u - (trail * (segs - i)) / segs), lift));
  const fade = a <= dur ? 1 : 1 - prog(a, dur, dur + 8), head = pts[segs];
  return (
    <g>
      {fade > 0 && pts.slice(1).map((p, i) => (
        <line key={i} x1={pts[i][0]} y1={pts[i][1]} x2={p[0]} y2={p[1]} stroke={i > segs * 0.6 ? '#FFF1C8' : color} strokeWidth={1.4 + (i / segs) * 4.6} strokeLinecap="round" opacity={fade * (i / segs) * 0.9} />
      ))}
      {a <= dur && <><Glow x={head[0]} y={head[1]} r={22} color={color} o={0.7} /><circle cx={head[0]} cy={head[1]} r={4.5} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} /></>}
      {a >= dur && (water ? <WaterSplash t={t} t0={t0 + dur} x={to[0]} y={to[1]} r={r} /> : <GroundBlast t={t} t0={t0 + dur} x={to[0]} y={to[1]} r={r} linger={linger} />)}
    </g>
  );
};

/** n shells over `span` frames onto an area of ±spread px around `to`; origins jitter ±30 px around `from`. */
export const ShellBarrage: React.FC<{ id: string; t: number; t0: number; from: Pt; to: Pt; n?: number; span?: number; spread?: number | Pt; dur?: number; lift?: number; water?: boolean; r?: number; linger?: number; seed?: number }> = ({
  t, t0, from, to, n = 12, span = 90, spread = 110, dur = 44, lift = 160, water = false, r = 32, linger = 130, seed = 1,
}) => {
  const [sx, sy] = Array.isArray(spread) ? spread : [spread, spread * 0.7];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const ti = t0 + (i / Math.max(1, n - 1)) * span + (hash(i, seed + 7) - 0.5) * (span / n) * 1.4;
        if (t < ti) return null;
        const f: Pt = [from[0] + (hash(i, seed + 1) - 0.5) * 60, from[1] + (hash(i, seed + 2) - 0.5) * 60];
        const e: Pt = [to[0] + (hash(i, seed + 3) - 0.5) * 2 * sx, to[1] + (hash(i, seed + 4) - 0.5) * 2 * sy];
        return <ShellArc key={i} t={t} t0={ti} from={f} to={e} dur={dur * (0.85 + 0.3 * hash(i, seed + 5))} lift={lift * (0.8 + 0.4 * hash(i, seed + 6))} water={water} r={r * (0.7 + 0.6 * hash(i, seed + 8))} linger={linger} />;
      })}
    </g>
  );
};
