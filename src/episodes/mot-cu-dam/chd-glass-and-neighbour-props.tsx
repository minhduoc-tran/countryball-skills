import React from 'react';
import { Hero, basePose, LOOKS, Look, Expr, proj, clamp, easeOut, rnd, ST } from '../../engine';
import { makeLots, GROUND_H, FLOOR_H } from '../../engine/sets/street-buildings';

// Chapter D props, part 3: window glass that shatters from the sonic boom, and the neighbours behind it.
//
//   <StreetPane t quad breakAt seed? />        a pane on a street facade, given as 4 screen points [[x,y] x4]; cracks 8 frames before breakAt, then shards fall
//   <FacadeWindow t id x y w h breakAt look expr seed? />   close-up window with a neighbour bust behind the glass; glass shatters at breakAt
//   facadeQuad(X, y0, y1, z0, z1)               screen quad of a window on the street facade at lateral X (metres)
//   NEIGHBOURS                                  looks + expressions for the gag (shock, oops, dizzy)

const INK = '#16101A';

/** Every upper-floor window/balcony door of the Street's shophouses (same lots the set draws), nearer than zMax: lateral X, heights, depths. */
export const lotPanes = (zMax = 48) => {
  const out: { X: number; y0: number; y1: number; z0: number; z1: number; k: number }[] = [];
  let k = 0;
  for (const side of [-1, 1] as const)
    for (const lot of makeLots(side)) {
      if (lot.alley || lot.z0 > zMax) continue;
      for (let i = 0; i < lot.n; i++) {
        const fy = GROUND_H + FLOOR_H * i + 0.1;
        const style = Math.floor(rnd(lot.seed, 20 + i) * 3);
        const X = side * ST.wall;
        if (style === 0) out.push({ X, y0: fy + 0.15, y1: fy + 2.4, z0: lot.z0 + 0.5, z1: lot.z1 - 0.5, k: k++ });
        else {
          const zc = (lot.z0 + lot.z1) / 2;
          const spans = style === 1 ? [[lot.z0 + 0.5, zc - 0.2], [zc + 0.2, lot.z1 - 0.5]] : [[lot.z0 + 0.5, lot.z1 - 0.5]];
          for (const [a, b] of spans) out.push({ X, y0: fy + 0.5, y1: fy + 2.3, z0: a, z1: b, k: k++ });
        }
      }
    }
  return out;
};
const GLASS = '#BFE6F5';

/** Screen quad of a facade pane: lateral X (metres, +-7.2), heights y0..y1, depths z0..z1. */
export const facadeQuad = (X: number, y0: number, y1: number, z0: number, z1: number): [number, number][] => {
  const a = proj(X, y1, z0);
  const b = proj(X, y1, z1);
  const c = proj(X, y0, z1);
  const d = proj(X, y0, z0);
  return [[a.x, a.y], [b.x, b.y], [c.x, c.y], [d.x, d.y]];
};

const mid = (q: [number, number][]) => [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2];
const lerp2 = (q: [number, number][], u: number, v: number): [number, number] => {
  const top = [q[0][0] + (q[1][0] - q[0][0]) * u, q[0][1] + (q[1][1] - q[0][1]) * u];
  const bot = [q[3][0] + (q[2][0] - q[3][0]) * u, q[3][1] + (q[2][1] - q[3][1]) * u];
  return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
};

/** Shards of a quad: a 3 x 3 grid of cells split into triangles, flying outward from the quad centre and falling. */
const Shards: React.FC<{ quad: [number, number][]; h: number; seed: number; grav?: number; size?: number }> = ({ quad, h, seed, grav = 0.9, size = 1 }) => {
  const [cx, cy] = mid(quad);
  const out: React.ReactNode[] = [];
  const N = 3;
  let k = 0;
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++)
      for (const tri of [0, 1]) {
        const p00 = lerp2(quad, i / N, j / N);
        const p10 = lerp2(quad, (i + 1) / N, j / N);
        const p01 = lerp2(quad, i / N, (j + 1) / N);
        const p11 = lerp2(quad, (i + 1) / N, (j + 1) / N);
        const pts = tri ? [p00, p10, p11] : [p00, p11, p01];
        const gx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
        const gy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
        const dx = gx - cx;
        const dy = gy - cy;
        const vx = dx * 0.22 + (rnd(seed, k) - 0.5) * 6 * size;
        const vy = dy * 0.1 - (3 + rnd(seed + 1, k) * 5) * size;
        const px = vx * h;
        const py = vy * h + 0.5 * grav * size * h * h;
        const rot = (rnd(seed + 2, k) - 0.5) * 22 * h;
        out.push(
          <polygon
            key={k}
            transform={`translate(${px} ${py}) rotate(${rot} ${gx} ${gy})`}
            points={pts.map((p) => p.join(',')).join(' ')}
            fill={GLASS}
            fillOpacity={0.55}
            stroke="#EAF8FF"
            strokeWidth={Math.max(1.5, 2.5 * size)}
            strokeLinejoin="round"
          />,
        );
        k++;
      }
  return <g opacity={clamp(1 - h / 40)}>{out}</g>;
};

/** Crack lines radiating from the quad centre; `p` 0..1 draws them on. */
const Cracks: React.FC<{ quad: [number, number][]; p: number; seed: number; w: number }> = ({ quad, p, seed, w }) => {
  const [cx, cy] = mid(quad);
  const R = Math.hypot(quad[2][0] - quad[0][0], quad[2][1] - quad[0][1]) * 0.6;
  return (
    <g stroke="#FFFFFF" strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.9}>
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2 + rnd(seed, i) * 0.5;
        const l = R * p * (0.6 + 0.5 * rnd(seed + 1, i));
        const bend = (rnd(seed + 2, i) - 0.5) * 0.7;
        return <path key={i} d={`M ${cx} ${cy} L ${cx + Math.cos(a) * l * 0.55} ${cy + Math.sin(a) * l * 0.55} L ${cx + Math.cos(a + bend) * l} ${cy + Math.sin(a + bend) * l}`} />;
      })}
    </g>
  );
};

/** A street-facade pane that cracks 8 frames before `breakAt`, flashes, and falls apart. */
export const StreetPane: React.FC<{ t: number; quad: [number, number][]; breakAt: number; seed?: number; shine?: number }> = ({ t, quad, breakAt, seed = 1, shine = 0.5 }) => {
  const pts = quad.map((p) => p.join(',')).join(' ');
  const wide = Math.abs(quad[1][0] - quad[0][0]) + Math.abs(quad[3][1] - quad[0][1]);
  const sw = Math.max(1.5, wide * 0.012);
  if (t < breakAt)
    return (
      <g>
        <polygon points={pts} fill={GLASS} fillOpacity={0.28 * shine + 0.12} stroke="#EAF8FF" strokeWidth={sw} />
        <Cracks quad={quad} p={easeOut(clamp((t - breakAt + 10) / 8))} seed={seed} w={sw} />
      </g>
    );
  const h = t - breakAt;
  return (
    <g>
      {h < 3 ? <polygon points={pts} fill="#FFFFFF" opacity={0.9 - h * 0.25} /> : null}
      <Shards quad={quad} h={h} seed={seed} size={Math.min(0.9, Math.max(0.15, wide / 260))} />
    </g>
  );
};

export const NEIGHBOURS: { look: Look; expr: Expr; y: number }[] = [
  { look: LOOKS.mom, expr: 'shock', y: 0 },
  { look: LOOKS.suit, expr: 'oops', y: 0 },
  { look: LOOKS.mo, expr: 'dizzy', y: 0 },
];

/** Close-up window: frame, a neighbour bust behind the glass (clipped), glass cracking then shattering at breakAt; the neighbour flinches. */
export const FacadeWindow: React.FC<{ t: number; id: string; x: number; y: number; w: number; h: number; breakAt: number; look: Look; expr: Expr; seed?: number; before?: Expr }> = ({
  t, id, x, y, w, h, breakAt, look, expr, seed = 1, before = 'neutral',
}) => {
  const after = t >= breakAt;
  const flinch = after ? Math.exp(-(t - breakAt) / 6) * Math.sin((t - breakAt) * 1.7) * 14 : 0;
  const sc = (h / 378) * 1.1;
  const quad: [number, number][] = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  return (
    <g>
      <rect x={x - 24} y={y - 24} width={w + 48} height={h + 48} rx={10} fill="#4A3C46" stroke={INK} strokeWidth={8} />
      <defs>
        <clipPath id={`${id}clip`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill="#3B3548" />
      <g clipPath={`url(#${id}clip)`}>
        <rect x={x} y={y} width={w} height={h} fill="#6C5A66" />
        <g transform={`translate(${flinch} 0)`}>
          <Hero look={look} pose={{ ...basePose, x: x + w / 2, y: y + h * 0.48 + 176 * sc, scale: sc, yaw: 0.1, expr: after ? expr : before, look: after ? 0 : -0.6 }} rimId="rimR" shadow={0} />
        </g>
      </g>
      <StreetPane t={t} quad={quad} breakAt={breakAt} seed={seed} shine={1} />
      <path d={`M ${x + w / 2} ${y} V ${y + h} M ${x} ${y + h / 2} H ${x + w}`} stroke={INK} strokeWidth={8} opacity={t < breakAt ? 1 : Math.max(0, 1 - (t - breakAt) / 4)} />
      <rect x={x - 40} y={y + h + 20} width={w + 80} height={22} rx={6} fill="#8A7A80" stroke={INK} strokeWidth={6} />
    </g>
  );
};
