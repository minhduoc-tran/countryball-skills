import React from 'react';
import { clamp, easeOut, rnd, FONT, SCH } from '../../engine';
import { PAL } from './kit-palette';

// Chapter C, butterfly-effect props (pure functions of t; x, y = centre unless said).
//   geo(lon, lat)            the Americas map projection (11 px per degree; lon -130..-30, lat 55..-40 fill 1920 x 1080).
//   TEXAS / BRAZIL           map points for the labels, the butterfly and the tornado.
//   <AmericasMap t id />     a stylised sea-and-land map of North + South America (a soft graticule, coast glow).
//   <MapLabel x y t text />  a mono pill label with a pin dot, popping on from t 0.
//   <Tornado x y s t grow /> x y = the ground point; a grey funnel ~420 tall at s 1, spinning bands, debris; grow 0..1.
//   LORENZ_D                 the Lorenz attractor (σ 10, ρ 28, β 8/3) as a path in board space (x 740 ± 300, y 200-520).
//   <BranchIcon kind x y s on /> schematic line icons for the day's events: cat, pot, rain, star, heart, note, bike.

export const geo = (lon: number, lat: number) => ({ x: 410 + (lon + 130) * 11, y: 20 + (55 - lat) * 11 });
export const TEXAS = geo(-99, 31.5);
export const BRAZIL = geo(-50, -10);

const NA: [number, number][] = [
  [-130, 55], [-125, 50], [-124, 46], [-124, 42], [-122, 37], [-118, 34], [-115, 30], [-112, 26], [-110, 23], [-105, 20], [-100, 17], [-95, 16],
  [-92, 14.5], [-88, 13], [-85, 11], [-83, 9], [-80, 8], [-78, 8.5], [-77, 8.7], [-80, 9.5], [-83, 11], [-84, 15], [-88, 16], [-88, 21],
  [-87, 21.5], [-90, 21], [-91, 19], [-94, 18.5], [-96, 20], [-97.5, 23], [-97.5, 26], [-97, 28], [-94, 29.5], [-90, 29.2], [-89, 30.3],
  [-85, 30], [-83, 29], [-82.5, 27.5], [-81, 25.2], [-80, 26.5], [-80.5, 28.5], [-81.4, 30.5], [-79, 33.5], [-76, 35], [-76, 37], [-74, 40],
  [-71, 41.5], [-70, 43.5], [-67, 44.5], [-66, 45], [-64, 46], [-61, 46], [-60, 47], [-64, 49], [-60, 50], [-57, 51.5], [-56, 53], [-58, 55],
  [-77, 55], [-79, 52], [-81, 51.5], [-82.5, 53], [-85, 55],
];
const SA: [number, number][] = [
  [-77, 8.7], [-77, 7], [-77.5, 4], [-79, 1], [-80.5, -1], [-81, -4.5], [-79.5, -7], [-77, -12], [-76, -14], [-71, -18], [-70.3, -23],
  [-71.5, -28], [-71.6, -33], [-73.5, -37], [-73.7, -41], [-62, -41], [-62, -38.8], [-57.5, -38], [-56.7, -36.5], [-57.5, -34.8], [-54, -34.8],
  [-53, -33.5], [-51, -31], [-48.6, -28], [-48.5, -25.5], [-44.5, -23], [-41, -22], [-39, -17], [-39, -13], [-37, -11], [-35, -9], [-35, -5.5],
  [-38, -3.5], [-41, -2.8], [-44, -2.5], [-48, -1], [-50, 0.5], [-51, 4], [-53.5, 5.5], [-57, 6], [-60, 8.5], [-62, 10.5], [-64, 10.5],
  [-67, 10.5], [-70, 12.2], [-72, 11.5], [-74, 11], [-75.5, 10.5],
];
const CUBA: [number, number][] = [[-85, 22], [-82, 23.1], [-77, 21.5], [-74.2, 20.2], [-77, 19.9], [-80, 21.7], [-84, 21.8]];
const pts = (a: [number, number][]) => a.map(([lo, la]) => { const p = geo(lo, la); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');

export const AmericasMap: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <radialGradient id={`${id}sea`} cx="0.5" cy="0.45" r="0.8">
        <stop offset="0" stopColor="#1E3A5A" />
        <stop offset="1" stopColor="#0C1626" />
      </radialGradient>
    </defs>
    <rect x={-1200} y={-800} width={4400} height={2800} fill={`url(#${id}sea)`} />
    {/* graticule every 10 degrees */}
    {Array.from({ length: 14 }).map((_, k) => <path key={`lo${k}`} d={`M ${geo(-160 + k * 10, 0).x} -800 V 2000`} stroke="#2A4A6A" strokeWidth={2} opacity={0.5} />)}
    {Array.from({ length: 14 }).map((_, k) => <path key={`la${k}`} d={`M -1200 ${geo(0, 70 - k * 10).y} H 3200`} stroke="#2A4A6A" strokeWidth={2} opacity={k === 7 ? 0.9 : 0.5} />)}
    {/* soft shallow-water halo, then the land */}
    {[NA, SA, CUBA].map((a, k) => <polygon key={`h${k}`} points={pts(a)} fill="none" stroke="#3E7AA8" strokeWidth={26} strokeLinejoin="round" opacity={0.35} />)}
    {[NA, SA, CUBA].map((a, k) => <polygon key={k} points={pts(a)} fill={k === 1 ? '#5E8A5A' : '#6E8A5E'} stroke="#E9E2C8" strokeWidth={4} strokeLinejoin="round" />)}
    {/* a little relief: darker blotches (forest, mountains) */}
    {[[-62, -5, 90], [-70, -15, 50], [-110, 40, 70], [-90, 45, 60], [-72, -30, 30]].map(([lo, la, r], k) => (
      <ellipse key={`r${k}`} cx={geo(lo, la).x} cy={geo(lo, la).y} rx={r} ry={r * 0.7} fill={k === 0 ? '#3E6A44' : '#7E7A56'} opacity={0.55} />
    ))}
    {/* drifting cloud shadows */}
    {[0, 1, 2].map((k) => <ellipse key={`c${k}`} cx={((t * 0.8 + k * 700) % 2600) - 300} cy={300 + k * 260} rx={180} ry={50} fill="#FFFFFF" opacity={0.08} />)}
  </g>
);

export const MapLabel: React.FC<{ x: number; y: number; t: number; text: string; color?: string; s?: number }> = ({ x, y, t, text, color = '#F6EFE3', s = 1 }) => {
  if (t < 0) return null;
  const k = easeOut(clamp(t / 8));
  const w = 60 + text.length * 34;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.6 + 0.4 * k)})`} opacity={k}>
      <circle cx={0} cy={0} r={12} fill={SCH.live} stroke="#14121A" strokeWidth={3} />
      <rect x={-w / 2} y={-110} width={w} height={74} rx={37} fill="#14121A" opacity={0.85} />
      <path d="M -12 -37 L 0 -14 L 12 -37 Z" fill="#14121A" opacity={0.85} />
      <text x={0} y={-58} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill={color} letterSpacing={3}>{text}</text>
    </g>
  );
};

export const Tornado: React.FC<{ x: number; y: number; s?: number; t: number; grow: number }> = ({ x, y, s = 1, t, grow }) => {
  const g = clamp(grow);
  const bands = 9;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.2 + 0.8 * g)} ${s * g})`} opacity={clamp(g * 3)}>
      <ellipse cx={0} cy={0} rx={90} ry={18} fill="#2A2630" opacity={0.5} />
      <path d={`M -16 0 Q -40 -200 -150 -420 L 150 -420 Q 40 -200 16 0 Z`} fill="#8A8EA0" opacity={0.85} />
      {Array.from({ length: bands }).map((_, k) => {
        const yy = -k * 46 - 10;
        const w = 16 + (k / bands) * 140;
        const ph = (t * 0.35 + k * 0.7) % (Math.PI * 2);
        return <ellipse key={k} cx={Math.sin(ph) * 6} cy={yy} rx={w} ry={8 + k * 1.4} fill="none" stroke="#D9DCE8" strokeWidth={5} opacity={0.6} strokeDasharray={`${w} ${w * 0.6}`} strokeDashoffset={-t * 6 - k * 10} />;
      })}
      <ellipse cx={0} cy={-420} rx={170} ry={30} fill="#6A6E80" />
      {Array.from({ length: 8 }).map((_, k) => {
        const a = t * 0.3 + k * 0.8;
        const r = 40 + rnd(51, k) * 90;
        return <rect key={`d${k}`} x={Math.cos(a) * r} y={-20 - rnd(52, k) * 140} width={10} height={6} fill="#4A3E36" transform={`rotate(${a * 60} ${Math.cos(a) * r} ${-20})`} />;
      })}
    </g>
  );
};

// the Lorenz attractor, integrated once (deterministic), projected x/z onto the classroom board
export const LORENZ_D = (() => {
  let x = 0.1, y = 0, z = 0;
  const out: string[] = [];
  for (let i = 0; i < 2600; i++) {
    const dt = 0.008;
    const dx = 10 * (y - x);
    const dy = x * (28 - z) - y;
    const dz = x * y - (8 / 3) * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    if (i > 40 && i % 2 === 0) out.push(`${out.length ? 'L' : 'M'} ${(740 + x * 13).toFixed(1)} ${(530 - z * 6.2).toFixed(1)}`);
  }
  return out.join(' ');
})();

type IconKind = 'cat' | 'pot' | 'rain' | 'star' | 'heart' | 'note' | 'bike';
export const BranchIcon: React.FC<{ kind: IconKind; x: number; y: number; s?: number; on?: boolean; o?: number }> = ({ kind, x, y, s = 1, on = false, o = 1 }) => {
  const c = on ? SCH.live : SCH.dim;
  const st = { stroke: c, strokeWidth: 6, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} style={on ? { filter: `drop-shadow(0 0 10px ${SCH.glow})` } : undefined}>
      <circle r={62} fill={on ? '#2A1E14' : '#141E2E'} stroke={c} strokeWidth={4} opacity={0.9} />
      {kind === 'cat' ? <path {...st} d="M -26 26 L -26 -10 L -30 -34 L -12 -20 L 12 -20 L 30 -34 L 26 -10 L 26 26 Z M -10 0 L -8 2 M 10 0 L 8 2" /> : null}
      {kind === 'pot' ? <path {...st} d="M -24 0 L 24 0 L 18 32 L -18 32 Z M 0 0 Q -22 -24 -6 -40 Q 4 -20 0 0 Q 22 -30 30 -14 Q 14 -8 0 0" /> : null}
      {kind === 'rain' ? <path {...st} d="M -30 6 Q -40 -20 -14 -22 Q -4 -42 18 -30 Q 38 -28 32 6 Z M -16 20 L -20 34 M 2 20 L -2 34 M 20 20 L 16 34" /> : null}
      {kind === 'star' ? <path {...st} d="M 0 -34 L 10 -10 L 34 -10 L 14 6 L 22 30 L 0 16 L -22 30 L -14 6 L -34 -10 L -10 -10 Z" /> : null}
      {kind === 'heart' ? <path {...st} d="M 0 30 C -40 4 -30 -32 0 -14 C 30 -32 40 4 0 30 Z" /> : null}
      {kind === 'note' ? <path {...st} d="M -14 26 a 10 8 0 1 1 0 -1 L -4 26 L -4 -30 L 24 -36 L 24 16 M 24 16 a 10 8 0 1 1 0 -1" /> : null}
      {kind === 'bike' ? <path {...st} d="M -22 16 m -14 0 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 M 22 16 m -14 0 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 M -22 16 L -6 -12 L 14 -12 L 22 16 M -6 -12 L 4 16 L 14 -12 M -10 -20 L 0 -20" /> : null}
    </g>
  );
};

/** Air swirls curling off a flapping wing (x y = the butterfly), drifting outward. */
export const AirSwirls: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g>
    {Array.from({ length: 6 }).map((_, k) => {
      const ph = ((t + k * 9) % 54) / 54;
      const a = -0.6 + (k % 3) * 0.5 + (k > 2 ? Math.PI : 0);
      const r = (60 + ph * 260) * s;
      return <path key={k} d={`M ${x + Math.cos(a) * r} ${y + Math.sin(a) * r} a ${18 * s} ${18 * s} 0 1 1 ${24 * s} ${-6 * s}`} stroke={PAL.cyanSoft} strokeWidth={5 * s} fill="none" opacity={Math.sin(ph * Math.PI) * 0.8} strokeLinecap="round" />;
    })}
  </g>
);
