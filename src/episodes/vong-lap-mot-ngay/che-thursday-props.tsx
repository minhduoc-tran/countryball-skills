import React from 'react';
import { clamp, easeOut, backOut, rnd, FONT, Glow } from '../../engine';
import { PAL, mix } from './kit-palette';

// Chapter E "THỨ NĂM" props. Pure functions of t. x, y = CENTRE unless said.
//   <FizzleRing x y t t0 />   the reset that doesn't happen: a cyan ring swells from (x, y) for 8 frames, stalls,
//       flickers, breaks into falling dashes and is gone by t0 + 20.
//   <NewSky id t x0 y0 w h />  a NEW day's sky (not the loop's peach dawn): clear blue, a high warm sun, puffy clouds
//       drifting right, a flock of birds crossing, rooftops along the bottom. Clipped to its box.
//   <Bird x y s t />          one bird, wings flapping (a dark M stroke).
//   <TornPage x y w t tear id />  the THỨ TƯ top page of the tear-off calendar (same look as kit TearCalendar's page):
//       x y = top centre, tear 0..1 = it rips from the top binding, swings down from its top-left corner and drops.

export const FizzleRing: React.FC<{ x: number; y: number; t: number; t0: number }> = ({ x, y, t, t0 }) => {
  const tt = t - t0;
  if (tt < 0 || tt > 20) return null;
  const grow = easeOut(clamp(tt / 8));
  const r = 120 + 200 * grow;
  const flick = tt > 8 ? (Math.floor(tt) % 2 ? 0.35 : 0.9) : 1;
  const breakK = clamp((tt - 10) / 10);
  const n = 24;
  return (
    <g style={{ pointerEvents: 'none' }} opacity={(1 - breakK * 0.9) * flick}>
      <Glow x={x} y={y} r={r * 1.4} kind="cool" o={0.45 * (1 - breakK)} />
      {Array.from({ length: n }).map((_, k) => {
        const a0 = (k / n) * Math.PI * 2;
        const a1 = a0 + (Math.PI * 2) / n * 0.7;
        const drop = breakK * breakK * (180 + rnd(5, k) * 260);
        const dx = breakK * (rnd(6, k) - 0.5) * 80;
        return (
          <path
            key={k}
            d={`M ${x + Math.cos(a0) * r + dx} ${y + Math.sin(a0) * r + drop} A ${r} ${r} 0 0 1 ${x + Math.cos(a1) * r + dx} ${y + Math.sin(a1) * r + drop}`}
            stroke={k % 3 ? PAL.cyan : PAL.cyanSoft}
            strokeWidth={14 - 8 * breakK}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

export const Bird: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const f = Math.sin(t * 0.7) * 18;
  return <path d={`M ${x - 26 * s} ${y + f * 0.4 * s} Q ${x - 12 * s} ${y - 14 * s - f * 0.5 * s} ${x} ${y} Q ${x + 12 * s} ${y - 14 * s - f * 0.5 * s} ${x + 26 * s} ${y + f * 0.4 * s}`} stroke="#2A3046" strokeWidth={5 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
};

export const NewSky: React.FC<{ id: string; t: number; x0: number; y0: number; w: number; h: number; birds?: number }> = ({ id, t, x0, y0, w, h, birds = 1 }) => (
  <g>
    <defs>
      <clipPath id={`${id}c`}><rect x={x0} y={y0} width={w} height={h} /></clipPath>
      <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5FB4EC" />
        <stop offset="0.7" stopColor="#B8E2F8" />
        <stop offset="1" stopColor="#EAF6FF" />
      </linearGradient>
    </defs>
    <g clipPath={`url(#${id}c)`}>
      <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}g)`} />
      <circle cx={x0 + w * 0.78} cy={y0 + h * 0.22} r={h * 0.09} fill="#FFF6D8" />
      <Glow x={x0 + w * 0.78} y={y0 + h * 0.22} r={h * 0.5} o={0.6} />
      {/* clouds drifting right, each a cluster of white puffs with a soft grey belly */}
      {[0, 1, 2, 3].map((k) => {
        const cx = x0 + ((w * (0.1 + k * 0.3) + t * (0.8 + k * 0.25)) % (w + 400)) - 200;
        const cy = y0 + h * (0.18 + (k % 2) * 0.2);
        const s = (h / 600) * (0.8 + rnd(21, k) * 0.6);
        return (
          <g key={k} transform={`translate(${cx} ${cy}) scale(${s})`}>
            <ellipse cx={0} cy={24} rx={150} ry={34} fill="#D6E4F0" />
            {[[-90, 0, 50], [-30, -30, 70], [40, -20, 60], [100, 6, 44]].map(([dx, dy, r], i) => <circle key={i} cx={dx} cy={dy} r={r} fill="#FFFFFF" />)}
          </g>
        );
      })}
      {/* the flock */}
      {birds > 0
        ? Array.from({ length: 6 }).map((_, k) => {
            const bx = x0 - 100 + ((t * (3.2 + rnd(31, k)) + k * 70) % (w + 300));
            const by = y0 + h * (0.3 + rnd(32, k) * 0.25) - bx * 0.04 + Math.sin(t / 9 + k) * 8;
            return <Bird key={k} x={bx} y={by} s={(h / 600) * (0.8 + rnd(33, k) * 0.5)} t={t + k * 3} />;
          })
        : null}
      {/* the rooftops, now in plain daylight */}
      {Array.from({ length: 9 }).map((_, k) => {
        const bw = w * (0.1 + rnd(41, k) * 0.08);
        const bx = x0 + (k / 8) * w - bw * 0.3;
        const bh = h * (0.12 + rnd(42, k) * 0.16);
        return (
          <g key={`r${k}`}>
            <rect x={bx} y={y0 + h - bh} width={bw} height={bh + 4} fill={mix('#8A6E78', '#B88A7A', rnd(43, k))} />
            <rect x={bx + bw * 0.2} y={y0 + h - bh - h * 0.05} width={bw * 0.3} height={h * 0.05} rx={6} fill="#DDE3EA" />
            <rect x={bx} y={y0 + h - bh} width={bw} height={4} fill="#FFFFFF" opacity={0.4} />
          </g>
        );
      })}
    </g>
  </g>
);

export const TornPage: React.FC<{ x: number; y: number; w: number; t: number; tear: number }> = ({ x, y, w, t, tear }) => {
  const h = w * 1.3;
  const k = clamp(tear);
  const swing = easeOut(clamp(k / 0.45)) * 32;
  const drop = Math.pow(clamp((k - 0.4) / 0.6), 2) * 1100;
  const flap = Math.sin(t / 2) * 3 * k;
  if (k >= 1) return null;
  return (
    <g transform={`translate(${x - w / 2} ${y + drop}) rotate(${swing + flap})`} opacity={1 - clamp((k - 0.85) / 0.15)}>
      <rect x={6} y={10} width={w} height={h} fill="#000" opacity={0.3} />
      <rect x={0} y={0} width={w} height={h} fill={PAL.paper} />
      <rect x={0} y={0} width={w} height={h * 0.16} fill="#C8382E" />
      {/* the ragged top edge where it tore off the binding */}
      <path d={`M 0 0 ${Array.from({ length: 16 }).map((_, i) => `L ${(w * (i + 0.5)) / 16} ${(i % 2 ? 5 : -3) * k * 2}`).join(' ')} L ${w} 0`} stroke="#9A2A22" strokeWidth={3} fill="none" />
      <text x={w / 2} y={h * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.2} fill="#C8382E" letterSpacing={2}>THỨ</text>
      <text x={w / 2} y={h * 0.36 + w * 0.56 * 1.02} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.56} fill="#C8382E">TƯ</text>
      <path d={`M ${w * 0.2} ${h * 0.9} L ${w * 0.8} ${h * 0.9}`} stroke="#B9B0A0" strokeWidth={3} strokeLinecap="round" />
      <path d={`M ${w} 0 L ${w} ${h}`} stroke="#000" strokeWidth={6} opacity={0.12} />
    </g>
  );
};

/** A two-line title over the card world, popping at `at`. */
export const CardTitle: React.FC<{ t: number; at: number; lines: [string, string]; y?: number }> = ({ t, at, lines, y = 150 }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 9));
  const pulse = 0.4 + 0.25 * Math.sin(t / 10);
  return (
    <g transform={`translate(960 ${y}) scale(${k})`}>
      {lines.map((line, i) => (
        <text key={i} y={i * 112} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={104} letterSpacing={2} fill="#FFE27A" stroke="#14264A" strokeWidth={20} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 22px rgba(255,200,90,${pulse}))` }}>
          {line}
        </text>
      ))}
    </g>
  );
};
