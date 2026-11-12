import React from 'react';
import { Flames } from './fx-bomb-carpet';
import { Glow, Puff } from './fx-glow';
import { easeOut, flicker, hash, prog } from './fx-math';

// City blocks at night: a grid of dark roofs with a few lit windows. From frame `fireAt` blocks ignite one by one
// (spread over `spread` frames): orange glow washes the streets, flames lick the roof, smoke rises, roofs char.
//   <BurningBlocks id t x y w h cols? rows? fireAt spread? seed? />    (x, y) = top-left corner, screen px

export const BurningBlocks: React.FC<{ id: string; t: number; x: number; y: number; w: number; h: number; cols?: number; rows?: number; fireAt: number; spread?: number; seed?: number; burnout?: number; fraction?: number }> = ({
  t, x, y, w, h, cols = 7, rows = 4, fireAt, spread = 90, seed = 1, burnout = 260, fraction = 0.55,
}) => {
  const cw = w / cols, ch = h / rows, cells = Array.from({ length: cols * rows }, (_, i) => {
    const c = i % cols, r = Math.floor(i / cols), hv = hash(i, seed);
    return { i, bx: x + c * cw + cw * 0.09, by: y + r * ch + ch * 0.1, bw: cw * (0.62 + 0.26 * hash(i, seed + 1)), bh: ch * (0.6 + 0.26 * hash(i, seed + 2)), tIgn: hash(i, seed + 9) < fraction ? fireAt + hv * spread : Infinity };
  });
  return (
    <g>
      {/* streets */}
      <rect x={x} y={y} width={w} height={h} fill="#0F141C" opacity={0.8} />
      {cells.map((c) => {
        const burning = t >= c.tIgn, charred = burning ? prog(t, c.tIgn, c.tIgn + burnout * 0.6) : 0;
        return (
          <g key={c.i}>
            <rect x={c.bx} y={c.by} width={c.bw} height={c.bh} rx={2} fill={charred > 0 ? `rgb(${40 - charred * 20},${44 - charred * 24},${54 - charred * 30})` : '#2C3342'} stroke="#080A0E" strokeWidth={2} />
            {!burning && hash(c.i, seed + 5) > 0.55 && <rect x={c.bx + c.bw * 0.2} y={c.by + c.bh * 0.25} width={4} height={4} fill="#FFD983" opacity={0.85} />}
            {!burning && hash(c.i, seed + 6) > 0.6 && <rect x={c.bx + c.bw * 0.6} y={c.by + c.bh * 0.55} width={4} height={4} fill="#FFD983" opacity={0.7} />}
          </g>
        );
      })}
      {cells.map((c) => {
        if (t < c.tIgn) return null;
        const a = t - c.tIgn, k = easeOut(a / 20) * (1 - prog(a, burnout, burnout + 80) * 0.7), cx = c.bx + c.bw / 2, cy = c.by + c.bh / 2;
        return <Glow key={c.i} x={cx} y={cy} r={cw * 0.95 * k * flicker(t, c.i)} color="#FF6A1A" o={0.7 * k} />;
      })}
      {cells.map((c) => {
        if (t < c.tIgn) return null;
        const a = t - c.tIgn, k = easeOut(a / 20) * (1 - prog(a, burnout, burnout + 80)), cx = c.bx + c.bw / 2, cy = c.by + c.bh / 2;
        return (
          <g key={c.i}>
            {k > 0.05 && <Flames t={t} x={cx} y={cy + c.bh * 0.3} s={Math.min(cw, ch) * 0.5 * k} n={3} seed={c.i} />}
            {[0, 1].map((j) => {
              const age = (a + j * 40) % 80;
              return <Puff key={j} x={cx + age * 0.3} y={cy - 6 - age * 0.55} r={5 + age * 0.22} color="#222227" o={0.55 * k * (1 - age / 80)} seed={c.i + j} />;
            })}
          </g>
        );
      })}
    </g>
  );
};
