import React from 'react';
import { clamp, lerp, rnd, FONT, NightSky, Stars, Glow, mixHex } from '../../engine';

// Chapter D local props, part 1: the dead-weather pieces (solar panels, a power meter, a wind turbine, a flag,
// a night backdrop). All are pure functions of their props; the shot passes the clock.

const INK = '#0B0E1A';
const STEEL = '#AEB8CC';

/** A night backdrop that fills the frame: sky, stars, and a dark horizon band of distant silhouettes. */
export const NightBack: React.FC<{ id: string; t: number; horizon?: number; seed?: number; glow?: number }> = ({ id, t, horizon = 760, seed = 41, glow = 0 }) => (
  <g>
    <NightSky id={`${id}sky`} horizonY={horizon} />
    <Stars seed={seed} x0={-300} y0={-300} w={2520} h={horizon + 200} t={t} n={110} />
    {glow > 0 ? <Glow x={960} y={horizon} r={900} kind="warm" o={0.25 * glow} /> : null}
  </g>
);

/** A row of solar panels on a roof, tilted toward us. `life` 1 = faintly glowing cells, 0 = dead black glass. */
export const SolarRow: React.FC<{ x: number; y: number; s?: number; n?: number; life: number; t: number }> = ({ x, y, s = 1, n = 4, life, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={150} width={n * 250 + 120} height={34} fill="#1A1626" />
    <rect x={-60} y={150} width={n * 250 + 120} height={5} fill="#3A3450" />
    {Array.from({ length: n }).map((_, k) => {
      // each panel dies at its own moment (life runs 1 -> 0 across the row, left to right)
      const lk = clamp(life * (n + 1) - (n - 1 - k) * 0.7);
      const flick = lk > 0 && lk < 1 ? 0.5 + 0.5 * Math.sin(t * 2.3 + k * 4) : 1;
      const on = clamp(lk) * flick;
      return (
        <g key={k} transform={`translate(${k * 250} 0)`}>
          <path d="M 40 150 L 60 100 M 160 150 L 140 100" stroke="#5A5870" strokeWidth={8} />
          <path d="M 30 100 L 190 100 L 220 -10 L 0 -10 Z" fill={mixHex('#10162A', '#1E4E78', on * 0.9)} stroke={STEEL} strokeWidth={7} strokeLinejoin="round" />
          {[1, 2, 3].map((j) => <path key={`v${j}`} d={`M ${j * 55} -10 L ${j * 48 + 15} 100`} stroke={STEEL} strokeWidth={2.5} opacity={0.5} />)}
          {[1, 2].map((j) => <path key={`h${j}`} d={`M ${6 - j * 8 + 30 * (j / 3)} ${-10 + j * 36.6} L ${214 - j * 8 - 4} ${-10 + j * 36.6}`} stroke={STEEL} strokeWidth={2.5} opacity={0.5} />)}
          <path d="M 30 100 L 190 100 L 220 -10 L 160 -10 Z" fill="#9FD8FF" opacity={0.28 * on} />
          <circle cx={110} cy={118} r={6} fill={on > 0.3 ? '#5CE08A' : '#FF4A4A'} />
        </g>
      );
    })}
  </g>
);

/** A round power meter: needle at `v` (0..1), a readout under it. Needle sweeps -65..+65 degrees. */
export const PowerMeter: React.FC<{ x: number; y: number; s?: number; v: number; readout: string; dead?: boolean; t?: number }> = ({ x, y, s = 1, v, readout, dead = false, t = 0 }) => {
  const a = lerp(-65, 65, clamp(v, -0.06, 1));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-250} y={-230} width={500} height={420} rx={46} fill="#1A1D2B" stroke="#59607A" strokeWidth={8} />
      <path d="M -190 -20 A 200 200 0 0 1 190 -20 L 190 -20" fill="#0F121C" stroke="#59607A" strokeWidth={4} />
      <path d="M -190 -20 A 200 200 0 0 1 190 -20 Z" fill="#12151F" />
      {Array.from({ length: 11 }).map((_, i) => (
        <path key={i} d="M 0 -176 L 0 -150" stroke={i < 2 ? '#FF5A4A' : '#E9E2D0'} strokeWidth={i % 5 === 0 ? 8 : 4} transform={`translate(0 20) rotate(${-65 + i * 13})`} />
      ))}
      <g transform={`translate(0 20) rotate(${a})`}>
        <path d="M -7 0 L 0 -168 L 7 0 Z" fill={dead ? '#FF5A4A' : '#FFB15A'} />
      </g>
      <circle cx={0} cy={20} r={18} fill="#E9E2D0" />
      <rect x={-130} y={72} width={260} height={84} rx={14} fill="#06080E" stroke="#3A4058" strokeWidth={4} />
      <text x={0} y={134} textAnchor="middle" fontFamily={FONT.ui} fontSize={58} fill={dead ? '#FF5A4A' : '#FFB15A'} opacity={dead && Math.floor(t / 7) % 2 ? 0.55 : 1}>{readout}</text>
      <text x={0} y={-186} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#9AA3BC" letterSpacing={6}>SOLAR OUTPUT</text>
    </g>
  );
};

/** A wind turbine: tower, hub, three blades at `angle` degrees. Hub at (x, y); `h` is tower height. */
export const Turbine: React.FC<{ x: number; y: number; angle: number; s?: number; h?: number; glow?: number }> = ({ x, y, angle, s = 1, h = 520, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M -9 ${h} L -5 0 L 5 0 L 9 ${h} Z`} fill="#CBD2E0" />
    <path d={`M 2 ${h} L 5 0 L 9 ${h} Z`} fill="#8A93AA" />
    <ellipse cx={0} cy={h + 4} rx={40} ry={7} fill="#000" opacity={0.4} />
    <g transform={`rotate(${angle})`}>
      {[0, 120, 240].map((r) => (
        <path key={r} d="M -6 0 Q -16 -110 -2 -250 Q 14 -120 6 0 Z" fill="#E6EAF3" stroke="#6C7590" strokeWidth={2.5} transform={`rotate(${r})`} />
      ))}
    </g>
    <circle r={18} fill="#CBD2E0" stroke="#6C7590" strokeWidth={3} />
    <circle cx={0} cy={-26} r={4} fill="#FF4A4A" opacity={0.5 + 0.5 * Math.sin(glow * 0.3)} />
  </g>
);

/** A flag on a pole. `limp` 0 = streaming in the wind, 1 = hanging straight down. Pole base at (x, y). */
export const Flag: React.FC<{ x: number; y: number; t: number; limp: number; color?: string; s?: number }> = ({ x, y, t, limp, color = '#D9534F', s = 1 }) => {
  const N = 14, L = 230, H = 110, top = 480;
  const pts = Array.from({ length: N + 1 }).map((_, i) => {
    const u = i / N;
    const amp = 26 * u * (1 - limp);
    const hx = u * L * (1 - 0.15 * limp);
    const hy = Math.sin(u * 7 - t * 0.45) * amp;
    const vx = 8 + Math.sin(u * 4 - t * 0.2) * 5 * u * limp;
    const vy = u * L * 0.85;
    return { cx: lerp(hx, vx, limp), cy: lerp(hy, vy, limp) };
  });
  const nx = limp, ny = 1 - limp; // blend of the horizontal normal (0, 1) and the hanging normal (1, 0)
  const top1 = pts.map((p) => `${(p.cx - nx * 0).toFixed(1)},${(p.cy).toFixed(1)}`);
  const bot = pts.map((p) => `${(p.cx + nx * H * 0.6).toFixed(1)},${(p.cy + ny * H).toFixed(1)}`).reverse();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={30} ry={6} fill="#000" opacity={0.4} />
      <rect x={-6} y={-top} width={12} height={top} fill="#A9B2C6" />
      <circle cx={0} cy={-top - 6} r={10} fill="#E9C46A" />
      <g transform={`translate(6 ${-top + 10})`}>
        <polygon points={[...top1, ...bot].join(' ')} fill={color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** Drifting specks for rain or snow: returns positions from the clock. `stop` (frames) freezes them; they fade out after. */
export const flakeField = (seed: number, n: number, t: number, o: { speed: number; sway: number; stop: number; gone: number; w: number; h: number; x0?: number; y0?: number }) =>
  Array.from({ length: n }).map((_, i) => {
    const tt = Math.min(t, o.stop); // frozen in mid-air from `stop`
    const ph = rnd(seed, i);
    const sp = o.speed * (0.7 + 0.6 * rnd(seed + 1, i));
    const y = ((ph * o.h + tt * sp) % (o.h + 80)) - 40 + (o.y0 ?? 0);
    const x = (o.x0 ?? 0) + rnd(seed + 2, i) * o.w + Math.sin(tt / 14 + i) * o.sway;
    const r = rnd(seed + 3, i);
    // each flake vanishes at its own moment after `gone`
    const alive = t < o.gone + r * 28 ? 1 : 0;
    return { x, y, r, alive, i };
  });
