import React from 'react';
import { clamp, easeOut, FONT, rnd } from '../../engine';
import { SECTION } from './kit-ocean-section';

// Chapter D props (4/4): pouring things into the basin. Jug (a tilted pitcher), PourStream (water falling from its spout to the
// basin surface), Drip (meltwater drops), WaveRings (sound arcs).

const INK = '#14121A';

/** World position of a jug's spout for a jug at (x, y) tilted `rot` degrees (dir 1: spout on the left, -1 mirrored). */
export const spoutOf = (x: number, y: number, rot: number, dir: 1 | -1 = 1, s = 1) => {
  const r = (rot * dir * Math.PI) / 180;
  const lx = -100 * dir * s;
  const ly = -60 * s;
  return { x: x + Math.cos(r) * lx - Math.sin(r) * ly, y: y + Math.sin(r) * lx + Math.cos(r) * ly };
};

/** A blue pitcher with a label on its belly, tilted to pour. `k` 0..1 pops it in. */
export const Jug: React.FC<{ x: number; y: number; rot?: number; dir?: 1 | -1; label: string; col?: string; k?: number; s?: number }> = ({ x, y, rot = -40, dir = 1, label, col = '#4FB4F0', k = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${easeOut(clamp(k)) * s})`}>
    <g transform={`rotate(${rot * dir}) scale(${dir} 1)`}>
      <path d="M -100 -60 L -70 -80 L 60 -80 L 80 -50 L 90 60 Q 90 110 40 110 L -40 110 Q -90 110 -90 60 Z" fill={col} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 86 -40 q 70 0 70 50 q 0 50 -66 50" stroke={INK} strokeWidth={20} fill="none" strokeLinecap="round" />
      <path d="M 86 -40 q 70 0 70 50 q 0 50 -66 50" stroke={col} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M -70 -50 L -62 70" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
    </g>
    <text y={dir * 0 + 36} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#0B1330" transform={`rotate(${rot * dir * 0.5})`}>{label}</text>
  </g>
);

/** A stream falling from (sx, sy) to (tx, ty): a wavy ribbon with moving highlights, drawing down over ~8 frames from `t0`. */
export const PourStream: React.FC<{ sx: number; sy: number; tx: number; ty: number; t: number; t0?: number; w?: number }> = ({ sx, sy, tx, ty, t, t0 = 0, w = 22 }) => {
  const k = easeOut(clamp((t - t0) / 8));
  if (k <= 0) return null;
  const ex = sx + (tx - sx) * k;
  const ey = sy + (ty - sy) * k;
  const cx = sx + (tx - sx) * 0.15;
  const d = `M ${sx} ${sy} Q ${cx} ${sy + (ey - sy) * 0.7} ${ex} ${ey}`;
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="#4FB4F0" strokeWidth={w} />
      <path d={d} stroke="#CFEFFF" strokeWidth={w * 0.3} strokeDasharray="26 40" strokeDashoffset={-t * 9} opacity={0.85} />
      {k >= 1 ? Array.from({ length: 4 }).map((_, i) => {
        const ph = (t * 0.07 + i / 4) % 1;
        return <circle key={i} cx={tx + (ph - 0.5) * 80} cy={ty - Math.sin(ph * Math.PI) * 28} r={5} fill="#CFEFFF" opacity={0.9} />;
      }) : null}
    </g>
  );
};

/** Drops falling from y0 to y1 around x (ice melting). */
export const Drip: React.FC<{ x: number; y0: number; y1: number; t: number; n?: number; spread?: number }> = ({ x, y0, y1, t, n = 5, spread = 150 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const ph = (rnd(95, i) + t * 0.05) % 1;
      const xx = x + (rnd(96, i) - 0.5) * spread;
      const yy = y0 + ph * ph * (y1 - y0);
      return <path key={i} transform={`translate(${xx} ${yy})`} d="M 0 -18 Q 11 2 0 12 Q -11 2 0 -18 Z" fill="#7FD0F5" stroke="#2E86C1" strokeWidth={3} opacity={clamp(1 - ph * 0.2)} />;
    })}
  </g>
);

/** Sound arcs "))" radiating right from (x, y): `k` 0..1 how far they've travelled; they fade out as they go. */
export const WaveArcs: React.FC<{ x: number; y: number; k: number; s?: number; col?: string }> = ({ x, y, k, s = 1, col = '#BFE6FA' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={col} strokeWidth={10} strokeLinecap="round">
    {[0, 1, 2].map((i) => {
      const q = clamp(k * 1.3 - i * 0.18);
      return <path key={i} d={`M ${40 + q * 120} ${-40 - q * 30} A ${60 + q * 130} ${60 + q * 130} 0 0 1 ${40 + q * 120} ${40 + q * 30}`} opacity={Math.sin(q * Math.PI) * 0.9} />;
    })}
  </g>
);

/** Where the basin surface is, in world y, for a BasinSection `water` value. */
export const surfaceY = (water: number) => SECTION.SEA_Y + (1080 - SECTION.SEA_Y) * (1 - clamp(water));
