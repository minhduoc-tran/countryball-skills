import React from 'react';
import { clamp, hash } from './fx-math';

// Side view of a brick rampart wall (the citadel wall) that crumbles as `damage` goes 0 -> 1 (screen px).
//   <RuinedWallSide id x y w? h? damage t? tone? />   (x, y) = bottom centre of the wall; w x h = size of the intact wall in px
// Bricks are rows of seeded rectangles: brick i disappears when damage passes its threshold (top rows first, with randomness);
// bricks in the last 4% before their threshold fall (so animating `damage` makes them drop), a debris pile grows at the foot,
// cracks and shell scars appear from damage 0.25, grass tufts on the top while intact. `t` only sways the grass.

const INK = '#1A120D';
const COLS = 22, ROWS = 9;

export const RuinedWallSide: React.FC<{ id: string; x: number; y: number; w?: number; h?: number; damage: number; t?: number; night?: number }> = ({ id, x, y, w = 760, h = 300, damage, t = 0, night = 0 }) => {
  const d = clamp(damage), bw = w / COLS, bh = h / ROWS, x0 = x - w / 2, shade = 1 - 0.55 * night;
  const col = (c: number, r: number) => {
    const hv = hash(c * 17 + r, 5), base = [168, 82, 58], k = (0.84 + 0.3 * hv) * shade;
    return `rgb(${Math.round(base[0] * k)},${Math.round(base[1] * k)},${Math.round(base[2] * k)})`;
  };
  const bricks: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const th = clamp(0.2 + 0.9 * (0.5 * (r / ROWS) + 0.5 * hash(c * 31 + r, 9)) + (r >= ROWS - 2 ? 0.5 + 0.7 * hash(c, r + 40) : 0), 0, 1.6), left = c * bw + (r % 2 ? bw / 2 : 0) - (r % 2 ? bw : 0);
      if (left + bw < 0 || left > w - bw * 0.01) continue;
      if (d > th) continue;
      const loose = d > th - 0.04, fall = loose ? (th - d) / 0.04 : 1, drop = loose ? (1 - fall) * bh * 3 : 0; // loose bricks slip and tilt just before they go
      bricks.push(<rect key={`${c}-${r}`} x={x0 + Math.max(0, left)} y={y - h + r * bh + drop} width={Math.min(bw, w - left) - 1} height={bh - 1} rx={1.5} fill={col(c, r)} stroke={INK} strokeWidth={1.2} opacity={loose ? 0.8 : 1} transform={loose ? `rotate(${(hash(c, r) - 0.5) * 40 * (1 - fall)} ${x0 + left + bw / 2} ${y - h + r * bh + bh / 2 + drop})` : undefined} />);
    }
  const pile = Array.from({ length: 26 }, (_, i) => {
    const px = x0 + hash(i, 1) * w * 0.95 + w * 0.02, sz = (8 + hash(i, 2) * 22) * (0.4 + d), vis = hash(i, 3) < d * 1.1;
    return vis ? <rect key={i} x={px} y={y - sz * (0.5 + hash(i, 4) * 0.6)} width={sz * 1.3} height={sz * 0.8} rx={3} fill={col(i, 3)} stroke={INK} strokeWidth={1.2} transform={`rotate(${(hash(i, 5) - 0.5) * 50} ${px} ${y})`} /> : null;
  });
  return (
    <g>
      <defs><clipPath id={`${id}-clip`}><rect x={x0 - 40} y={y - h - 90} width={w + 80} height={h + 130} /></clipPath></defs>
      <rect x={x0} y={y - h * 0.04} width={w} height={h * 0.05} fill={`rgb(${Math.round(90 * shade)},${Math.round(110 * shade)},${Math.round(60 * shade)})`} />
      <g clipPath={`url(#${id}-clip)`}>
        {bricks}
        {d > 0.25 && Array.from({ length: Math.round(d * 6) }, (_, i) => {
          const cx = x0 + hash(i, 11) * w * 0.9 + w * 0.05, cy = y - h * (0.12 + 0.4 * hash(i, 12)), r = 10 + hash(i, 13) * 16;
          return <g key={i}><ellipse cx={cx} cy={cy} rx={r * 1.3} ry={r} fill="#241913" opacity={0.7} /><path d={`M${cx - r * 2},${cy - r}l${r},${r * 0.7}l${-r * 0.4},${r * 0.9}l${r * 1.2},${r * 0.7}`} stroke={INK} strokeWidth={2} fill="none" /></g>;
        })}
        {d < 0.35 && Array.from({ length: 16 }, (_, i) => { const gx = x0 + (i + 0.5) * (w / 16), sw = Math.sin(t * 0.08 + i) * 3; return <path key={i} d={`M${gx},${y - h + 2}q${sw},-14 ${sw * 1.6},-22 M${gx + 4},${y - h + 2}q${sw},-10 ${sw},-16`} stroke={`rgb(${Math.round(80 * shade)},${Math.round(120 * shade)},${Math.round(50 * shade)})`} strokeWidth={3} strokeLinecap="round" fill="none" opacity={1 - d * 2.5} />; })}
        {pile}
      </g>
    </g>
  );
};
