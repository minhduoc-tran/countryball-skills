import React from 'react';
import { FONT } from '../../engine/fonts';
import { backOut, clamp, easeOut, hash, polar, prog } from '../../countryball/fx-math';

// Chapter D props: stat card, sky backdrop with a distant skyline, 24 h clock ring, percentage donut, route sketch
// notes, tail-gun turret. All pure functions of the frame `t` (30 fps); SVG ids carry the caller's `id`.

/** Dark card with a gold kicker, one giant figure and up to two lines under it. Pops in at frame `at`. */
export const StatCard: React.FC<{
  x: number; y: number; w: number; h: number; kicker: string; big: string; l1?: string; l2?: string; t: number; at?: number; accent?: string; bigColor?: string;
}> = ({ x, y, w, h, kicker, big, l1, l2, t, at = 0, accent = '#C9343A', bigColor = '#F4F4F4' }) => {
  const k = backOut(clamp((t - at) / 12));
  if (k <= 0.01) return null;
  const bigSize = Math.min(h * 0.46, (w * 0.78) / Math.max(1, big.length * 0.72));
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} rx={26} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill="#121A26" fillOpacity={0.96} stroke="#E2B95A" strokeWidth={5} />
      <rect x={-w / 2} y={-h / 2} width={16} height={h} rx={8} fill={accent} />
      <text x={8} y={-h / 2 + 56} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#E2B95A" letterSpacing={2}>{kicker}</text>
      <text x={8} y={bigSize * 0.34 + (l1 ? -8 : 20)} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={bigSize} fill={bigColor}>{big}</text>
      {l1 && <text x={8} y={h / 2 - (l2 ? 86 : 54)} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={40} fill="#F4F4F4">{l1}</text>}
      {l2 && <text x={8} y={h / 2 - 38} textAnchor="middle" fontFamily={FONT.title} fontWeight={600} fontSize={30} fill="#E2B95A">{l2}</text>}
    </g>
  );
};

/** Night sky gradient with a few stars and an optional lit skyline at the bottom. */
export const SkyBackdrop: React.FC<{ id: string; skyline?: boolean; glow?: number }> = ({ id, skyline = true, glow = 0 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050912" /><stop offset="0.7" stopColor="#12203A" /><stop offset="1" stopColor="#2A2A3A" /></linearGradient>
      <linearGradient id={`${id}-glow`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FF7A2A" stopOpacity={0.5 * glow} /><stop offset="1" stopColor="#FF7A2A" stopOpacity={0} /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${id}-sky)`} />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={hash(i, 1) * 1920} cy={hash(i, 2) * 620} r={1 + hash(i, 3) * 1.8} fill="#DDE6FF" opacity={0.25 + 0.4 * hash(i, 4)} />)}
    {skyline && (
      <g>
        <rect x={0} y={900} width={1920} height={180} fill="#0B0E14" />
        {Array.from({ length: 34 }, (_, i) => {
          const bw = 40 + hash(i, 5) * 40, bh = 40 + hash(i, 6) * 90, bx = i * 58 - 10;
          return (
            <g key={i}>
              <rect x={bx} y={900 - bh} width={bw} height={bh + 4} fill="#10141C" stroke="#07090D" strokeWidth={2} />
              {hash(i, 7) > 0.55 && <rect x={bx + bw * 0.3} y={900 - bh + 14} width={5} height={5} fill="#FFD983" opacity={0.7 * (1 - glow)} />}
            </g>
          );
        })}
        {glow > 0 && <rect x={0} y={640} width={1920} height={280} fill={`url(#${id}-glow)`} />}
      </g>
    )}
  </g>
);

/** 24 h clock ring: 24 segments (day = warm, night = cool) that light up one after another from `at` over `dur` frames. */
export const ClockRing: React.FC<{ t: number; cx: number; cy: number; r: number; at: number; dur: number }> = ({ t, cx, cy, r, at, dur }) => {
  const u = prog(t, at, at + dur), lit = u * 24;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 26} fill="#10151E" stroke="#E2B95A" strokeWidth={6} />
      {Array.from({ length: 24 }, (_, i) => {
        const a0 = -90 + i * 15 + 1.2, a1 = a0 + 12.6, day = i >= 6 && i < 18;
        const p0 = polar(cx, cy, a0, r), p1 = polar(cx, cy, a1, r), q0 = polar(cx, cy, a0, r * 0.62), q1 = polar(cx, cy, a1, r * 0.62);
        const on = clamp(lit - i), fill = day ? '#F2B84B' : '#5B7FD8';
        return (
          <g key={i}>
            <path d={`M${q0} L${p0} A${r},${r} 0 0 1 ${p1} L${q1} A${r * 0.62},${r * 0.62} 0 0 0 ${q0} Z`} fill={fill} fillOpacity={0.12 + 0.8 * on} stroke="#0A0F18" strokeWidth={3} />
          </g>
        );
      })}
      {u > 0 && u < 1 && (() => { const p = polar(cx, cy, -90 + u * 360, r + 18); const q = polar(cx, cy, -90 + u * 360, r * 0.5); return <line x1={q[0]} y1={q[1]} x2={p[0]} y2={p[1]} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />; })()}
      <text x={cx} y={cy - 6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={104} fill="#F4F4F4">24</text>
      <text x={cx} y={cy + 52} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#E2B95A">GIỜ</text>
    </g>
  );
};

/** Donut showing `pct` percent in red over grey, filling between frames [at, at+dur]; the figure in the middle. */
export const Donut: React.FC<{ t: number; cx: number; cy: number; r: number; pct: number; at: number; dur: number; label: string }> = ({ t, cx, cy, r, pct, at, dur, label }) => {
  const u = easeOut(prog(t, at, at + dur)), a = (pct / 100) * 360 * u;
  const p0 = polar(cx, cy, -90, r), p1 = polar(cx, cy, -90 + a, r);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2C3A4C" strokeWidth={70} />
      {a > 0.5 && <path d={`M${p0} A${r},${r} 0 ${a > 180 ? 1 : 0} 1 ${p1}`} fill="none" stroke="#E5483A" strokeWidth={70} strokeLinecap="butt" />}
      <text x={cx} y={cy + 40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F4F4F4">{label}</text>
    </g>
  );
};

/** One small "notebook sketch" card: a route polyline with `wobble` px of scatter (less each night as the crews learn). */
export const RouteSketch: React.FC<{ id: string; x: number; y: number; w: number; h: number; t: number; at: number; title: string; wobble: number; ghosts?: number; mark?: boolean }> = ({
  id, x, y, w, h, t, at, title, wobble, ghosts = 1, mark = false,
}) => {
  const k = backOut(clamp((t - at) / 12));
  if (k <= 0.01) return null;
  const base: [number, number][] = [[-0.42, 0.28], [-0.1, 0.1], [0.2, -0.05], [0.34, 0.12], [0.22, 0.3], [-0.05, 0.34]];
  const grow = prog(t, at + 6, at + 30);
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx={10} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#F1E9D2" stroke="#6B5E3C" strokeWidth={4} />
      <text x={0} y={-h / 2 + 40} textAnchor="middle" fontFamily={FONT.hand} fontSize={36} fill="#3A2F1C">{title}</text>
      <clipPath id={`${id}-c`}><rect x={-w / 2 + 12} y={-h / 2 + 52} width={w - 24} height={h - 64} /></clipPath>
      <g clipPath={`url(#${id}-c)`} transform={`translate(0,${22})`}>
        {Array.from({ length: ghosts }, (_, g) => (
          <polyline key={g} fill="none" stroke={g === ghosts - 1 ? '#B3281F' : '#8A7A55'} strokeWidth={g === ghosts - 1 ? 6 : 4} strokeDasharray={g === ghosts - 1 ? undefined : '10 8'} strokeLinecap="round" strokeLinejoin="round"
            points={base.slice(0, Math.max(2, Math.ceil(base.length * grow))).map(([bx, by], i) => `${bx * w + (hash(i + g * 7, 3) - 0.5) * wobble * 2},${by * h + (hash(i + g * 7, 4) - 0.5) * wobble * 2}`).join(' ')} />
        ))}
        {mark && grow > 0.9 && <circle cx={0.34 * w} cy={0.12 * h} r={26} fill="none" stroke="#B3281F" strokeWidth={6} />}
      </g>
    </g>
  );
};

/** Tail-gun turret: ball-sized dome with four barrels pointing left (rear) and muzzle flashes while `fire` is on. */
export const TailTurret: React.FC<{ x: number; y: number; s?: number; t: number; fire?: boolean }> = ({ x, y, s = 1, t, fire = false }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-18, -6, 6, 18].map((dy) => <rect key={dy} x={-130} y={dy - 3.5} width={110} height={7} rx={3} fill="#3A4048" stroke="#111" strokeWidth={3} />)}
    <rect x={-22} y={-40} width={60} height={80} rx={16} fill="#6A7650" stroke="#111" strokeWidth={5} />
    <ellipse cx={20} cy={-8} rx={18} ry={26} fill="#27323F" stroke="#111" strokeWidth={4} />
    {fire && [-18, -6, 6, 18].map((dy, i) => (Math.floor(t / 2 + i) % 2 === 0
      ? <polygon key={dy} points={`-130,${dy} -158,${dy - 9} -150,${dy} -158,${dy + 9}`} fill="#FFD25A" stroke="#FF8A1E" strokeWidth={2} /> : null))}
  </g>
);

/** Soft cone of "jamming" wedges from (x, y) towards `aim` degrees, with arcs travelling outward (t = frame). */
export const JamCone: React.FC<{ x: number; y: number; aim: number; len: number; t: number; color?: string; o?: number; spread?: number }> = ({ x, y, aim, len, t, color = '#FFB347', o = 1, spread = 22 }) => {
  const a0 = polar(x, y, aim - spread, len), a1 = polar(x, y, aim + spread, len);
  return (
    <g opacity={o}>
      <polygon points={`${x},${y} ${a0} ${a1}`} fill={color} opacity={0.16} />
      {[0, 1, 2, 3].map((i) => {
        const d = ((t * 5 + i * (len / 4)) % len), p0 = polar(x, y, aim - spread, d), p1 = polar(x, y, aim + spread, d);
        return <path key={i} d={`M${p0} A${d},${d} 0 0 1 ${p1}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" opacity={0.75 * (1 - d / len)} />;
      })}
    </g>
  );
};
