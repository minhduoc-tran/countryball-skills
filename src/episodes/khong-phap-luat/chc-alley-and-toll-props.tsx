import React from 'react';
import { Look, LOOKS, Glow, rnd, FONT } from '../../engine';

// Chapter C props: the characters of week one, the alley with its toll gate (rope, cash box, "NỘP TIỀN" sign) and the
// leader's long shadow. One-point perspective: depth z (1 = at the lens, larger = farther), vanishing point (960, 440).
// All pure functions of the clock.

const INK = '#1A1420';

// ---------- cast (same clothes all episode) ----------
const hood = (jacket: string, shade: string, hair: string): Look => ({ ...LOOKS.pipHood, jacket, jacketShade: shade, limb: shade, accent: '#EDE6D6', hair });
/** The toll gang: three cocky young men in hoodies. A is the leader (red). */
export const GANG_A: Look = hood('#B8483E', '#963A31', '#1E1612');
export const GANG_B: Look = hood('#C9C2B0', '#A8A190', '#2A1C18');
export const GANG_C: Look = hood('#3E6A8A', '#30546E', '#2A1C18');
/** The big man who simply takes. */
export const BIG_MAN: Look = { ...LOOKS.mo, jacket: '#7A3B2E', jacketShade: '#612E24', accent: '#E9C46A', extra: undefined, hair: '#2A1C18' };
/** Stall seller and neighbours. */
export const SELLER: Look = { ...LOOKS.mom, jacket: '#4E8A62', jacketShade: '#3C6E4E', accent: '#E9C46A' };
export const PAYER: Look = { ...LOOKS.mo, jacket: '#D9A441', jacketShade: '#B8862F', accent: '#5A4A6A', extra: undefined, hair: '#3A2620' };
export const WATCHMAN: Look = { ...LOOKS.mo, jacket: '#4A5A78', jacketShade: '#3A4860', accent: '#E9C46A', extra: undefined, hair: '#2A1C18' };

// ---------- the alley ----------
/** Screen x of the left / right wall, y of the ceiling / floor at depth z. */
export const alley = {
  xl: (z: number) => 960 - 1060 / z,
  xr: (z: number) => 960 + 1060 / z,
  yt: (z: number) => 440 - 590 / z,
  yb: (z: number) => 440 + 690 / z,
  /** Hero scale for a person standing at depth z (about 1.65 m tall). */
  s: (z: number) => 1.6 / z,
  /** Hip y of a hero with feet on the floor at depth z. */
  hip: (z: number) => 440 + 690 / z - 140 * (1.6 / z),
};

/** A point on the left (-1) or right (1) wall: depth z, v 0 ceiling .. 1 floor. */
const wp = (side: -1 | 1, z: number, v: number) => ({ x: side < 0 ? alley.xl(z) : alley.xr(z), y: alley.yt(z) + (alley.yb(z) - alley.yt(z)) * v });
const quad = (side: -1 | 1, z0: number, z1: number, v0: number, v1: number) => {
  const a = wp(side, z0, v0), b = wp(side, z1, v0), c = wp(side, z1, v1), d = wp(side, z0, v1);
  return `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`;
};

/** The alley seen from the street, dusk light from the open far end; a lantern on the right wall. */
export const TollAlley: React.FC<{ t: number; id: string; far?: number }> = ({ t, id, far = 7 }) => {
  const zf = far;
  const flick = 0.9 + 0.1 * Math.sin(t / 5 + 1);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}lw`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4A3F46" /><stop offset="1" stopColor="#8A6A58" /></linearGradient>
        <linearGradient id={`${id}rw`} x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#40384A" /><stop offset="1" stopColor="#7A6058" /></linearGradient>
        <linearGradient id={`${id}fl`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#2A2430" /><stop offset="1" stopColor="#6A5048" /></linearGradient>
        <radialGradient id={`${id}end`} cx="0.5" cy="0.55" r="0.7"><stop offset="0" stopColor="#FFE0A8" /><stop offset="0.6" stopColor="#F0A060" /><stop offset="1" stopColor="#B86A58" /></radialGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#20182A" />
      {/* the open far end: the street at sunset */}
      <rect x={alley.xl(zf)} y={alley.yt(zf)} width={alley.xr(zf) - alley.xl(zf)} height={alley.yb(zf) - alley.yt(zf)} fill={`url(#${id}end)`} />
      <rect x={alley.xl(zf)} y={alley.yb(zf) - 40} width={alley.xr(zf) - alley.xl(zf)} height={40} fill="#6A4A48" opacity={0.7} />
      {/* ceiling strip, walls, floor */}
      <polygon points={`-300,-300 2220,-300 ${alley.xr(zf)},${alley.yt(zf)} ${alley.xl(zf)},${alley.yt(zf)}`} fill="#2A2234" />
      <polygon points={`${alley.xl(1)},${alley.yt(1)} ${alley.xl(zf)},${alley.yt(zf)} ${alley.xl(zf)},${alley.yb(zf)} ${alley.xl(1)},${alley.yb(1)}`} fill={`url(#${id}lw)`} />
      <polygon points={`${alley.xr(1)},${alley.yt(1)} ${alley.xr(zf)},${alley.yt(zf)} ${alley.xr(zf)},${alley.yb(zf)} ${alley.xr(1)},${alley.yb(1)}`} fill={`url(#${id}rw)`} />
      <polygon points={`${alley.xl(1)},${alley.yb(1)} ${alley.xl(zf)},${alley.yb(zf)} ${alley.xr(zf)},${alley.yb(zf)} ${alley.xr(1)},${alley.yb(1)}`} fill={`url(#${id}fl)`} />
      <polygon points={`-300,${alley.yb(1)} ${alley.xl(1)},${alley.yb(1)} ${alley.xl(1)},${alley.yt(1)} -300,${alley.yt(1)}`} fill="#3A3040" />
      <polygon points={`2220,${alley.yb(1)} ${alley.xr(1)},${alley.yb(1)} ${alley.xr(1)},${alley.yt(1)} 2220,${alley.yt(1)}`} fill="#352C3C" />
      {/* plaster bands + skirting */}
      {[1.6, 2.4, 3.4, 4.8].map((z, i) => (
        <g key={i}>
          <line x1={wp(-1, z, 0).x} y1={wp(-1, z, 0).y} x2={wp(-1, z, 1).x} y2={wp(-1, z, 1).y} stroke="#00000030" strokeWidth={3} />
          <line x1={wp(1, z, 0).x} y1={wp(1, z, 0).y} x2={wp(1, z, 1).x} y2={wp(1, z, 1).y} stroke="#00000030" strokeWidth={3} />
        </g>
      ))}
      <polygon points={quad(-1, 1, zf, 0.9, 1)} fill="#2E2630" opacity={0.7} />
      <polygon points={quad(1, 1, zf, 0.9, 1)} fill="#2A2430" opacity={0.7} />
      {/* doors and windows: left a shut door, right a lit window and a shuttered shop */}
      <polygon points={quad(-1, 1.45, 1.85, 0.3, 0.96)} fill="#5A3A3A" stroke={INK} strokeWidth={3} />
      <polygon points={quad(-1, 2.9, 3.3, 0.3, 0.96)} fill="#46506A" stroke={INK} strokeWidth={3} />
      <polygon points={quad(-1, 2.2, 2.6, 0.22, 0.5)} fill="#FFD890" stroke={INK} strokeWidth={3} opacity={0.9} />
      <polygon points={quad(1, 1.5, 2.1, 0.3, 0.96)} fill="#70695E" stroke={INK} strokeWidth={3} />
      {[0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((v, i) => (
        <line key={i} x1={wp(1, 1.5, v).x} y1={wp(1, 1.5, v).y} x2={wp(1, 2.1, v).x} y2={wp(1, 2.1, v).y} stroke="#00000045" strokeWidth={3} />
      ))}
      <polygon points={quad(1, 2.6, 3.0, 0.25, 0.55)} fill="#FFC878" stroke={INK} strokeWidth={3} opacity={0.85} />
      {/* wires over the alley */}
      {[1.9, 3.1, 4.6].map((z, i) => {
        const a = wp(-1, z, 0.1 + i * 0.03), b = wp(1, z, 0.12 + i * 0.02);
        return <path key={i} d={`M ${a.x} ${a.y} Q 960 ${(a.y + b.y) / 2 + 60 / z * 4} ${b.x} ${b.y}`} stroke={INK} strokeWidth={4 / z + 1} fill="none" opacity={0.8} />;
      })}
      {/* lantern on the right wall */}
      {(() => {
        const p = wp(1, 2.35, 0.2);
        return (
          <g>
            <line x1={p.x} y1={p.y - 30} x2={p.x} y2={p.y + 4} stroke={INK} strokeWidth={4} />
            <ellipse cx={p.x} cy={p.y + 20} rx={16} ry={22} fill="#FFB347" stroke={INK} strokeWidth={3} />
            <Glow x={p.x} y={p.y + 24} r={260} o={0.55 * flick} />
          </g>
        );
      })()}
      <Glow x={960} y={alley.yb(zf) - 90} r={330} o={0.7} />
      {/* plant pots along the right wall foot */}
      {[1.8, 2.7, 4].map((z, i) => {
        const p = wp(1, z, 1);
        const s = 1.6 / z;
        return (
          <g key={i} transform={`translate(${p.x - 40 * s} ${p.y}) scale(${s})`}>
            <path d="M -20 0 L 20 0 L 15 -34 L -15 -34 Z" fill="#B8603E" stroke={INK} strokeWidth={3} />
            {[-1, 0, 1].map((k) => <path key={k} d={`M ${k * 6} -34 q ${k * 18 + Math.sin(t / 20 + i + k) * 3} -30 ${k * 26} -52`} stroke="#4E8A52" strokeWidth={7} strokeLinecap="round" fill="none" />)}
          </g>
        );
      })}
      {/* floor mottling */}
      {Array.from({ length: 9 }).map((_, i) => {
        const z = 1.2 + rnd(3, i) * 4;
        const y = alley.yb(z) - 6;
        return <ellipse key={i} cx={960 + (rnd(5, i) - 0.5) * 900 / z} cy={y} rx={60 / z} ry={8 / z} fill="#000" opacity={0.18} />;
      })}
    </g>
  );
};

// ---------- the toll gate ----------
/** A hanging "NỘP TIỀN" sign on cardboard. Centre-top at (x, y). */
export const TollSign: React.FC<{ x: number; y: number; s?: number; swing?: number }> = ({ x, y, s = 1, swing = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${swing}) scale(${s})`}>
    <line x1={-60} y1={0} x2={-40} y2={24} stroke={INK} strokeWidth={4} />
    <line x1={60} y1={0} x2={40} y2={24} stroke={INK} strokeWidth={4} />
    <rect x={-98} y={22} width={196} height={84} rx={6} fill="#E8D8B0" stroke={INK} strokeWidth={5} />
    <rect x={-98} y={22} width={196} height={84} rx={6} fill="none" stroke="#C8202F" strokeWidth={3} opacity={0.0} />
    <text x={0} y={80} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={50} fill="#C8202F" stroke={INK} strokeWidth={1.5}>NỘP TIỀN</text>
  </g>
);

/** The rope barrier: two posts at x0 and x1 (post feet at y), a sagging rope between them at height h; `pull` 0..1 draws it taut. */
export const RopeBarrier: React.FC<{ x0: number; x1: number; y: number; h?: number; s?: number; t: number; sign?: boolean; build?: number }> = ({ x0, x1, y, h = 170, s = 1, t, sign = true, build = 1 }) => {
  const top = y - h * s;
  const reach = Math.max(0, Math.min(1, build));
  const xe = x0 + (x1 - x0) * reach;
  const sag = (1 - reach * 0.55) * 46 * s + 8 * s;
  const mid = (x0 + xe) / 2;
  const sw = Math.sin(t / 14) * 2;
  return (
    <g>
      {[x0, x1].map((px, i) => (
        <g key={i}>
          <ellipse cx={px} cy={y + 2} rx={26 * s} ry={6 * s} fill="#000" opacity={0.35} />
          <rect x={px - 6 * s} y={top - 14 * s} width={12 * s} height={h * s + 14 * s} rx={5 * s} fill="#8A6A44" stroke={INK} strokeWidth={3 * s} />
          <rect x={px - 6 * s} y={top - 14 * s} width={12 * s} height={20 * s} fill={i ? '#C8202F' : '#E8E0D0'} stroke={INK} strokeWidth={2 * s} />
        </g>
      ))}
      <path d={`M ${x0} ${top} Q ${mid} ${top + sag + sw} ${xe} ${top}`} stroke={INK} strokeWidth={9 * s} fill="none" strokeLinecap="round" />
      <path d={`M ${x0} ${top} Q ${mid} ${top + sag + sw} ${xe} ${top}`} stroke="#E8D8B0" strokeWidth={5 * s} fill="none" strokeLinecap="round" strokeDasharray={`${14 * s} ${10 * s}`} />
      {sign && reach > 0.9 ? <TollSign x={mid} y={top + sag * 0.5 + sw} s={0.9 * s} swing={sw} /> : null}
    </g>
  );
};

/** The cash box on a crate: a green tin with a slot and a tray of notes; `open` lifts the lid, `bill` (0..1) is a note dropping in. */
export const CashBox: React.FC<{ x: number; y: number; s?: number; open?: number; bill?: number }> = ({ x, y, s = 1, open = 0, bill = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={66} ry={10} fill="#000" opacity={0.35} />
    <rect x={-48} y={-70} width={96} height={70} rx={5} fill="#9A7A52" stroke={INK} strokeWidth={4} />
    <path d="M -48 -46 H 48 M -48 -22 H 48" stroke="#00000030" strokeWidth={3} />
    <g transform={`translate(0 -70) rotate(${-open * 34} -44 0)`}>
      <rect x={-44} y={-34} width={88} height={34} rx={5} fill="#3E8C7A" stroke={INK} strokeWidth={4} />
      <rect x={-26} y={-20} width={52} height={7} rx={3} fill={INK} />
      <rect x={32} y={-26} width={8} height={18} rx={2} fill="#E9C46A" stroke={INK} strokeWidth={2} />
    </g>
    {bill > 0 && bill < 1 ? (
      <g transform={`translate(${-30 + bill * 30} ${-150 + bill * 98}) rotate(${-18 + bill * 18})`}>
        <rect x={-26} y={-12} width={52} height={24} rx={3} fill="#9ED0A0" stroke={INK} strokeWidth={3} />
        <circle cx={0} cy={0} r={6} fill="#6AAA70" />
      </g>
    ) : null}
  </g>
);

/** The leader's shadow lying down the alley floor toward the camera: feet at (fx, fy), `len` px long, head at the near end; hands on hips. */
export const LongShadow: React.FC<{ fx: number; fy: number; len: number; s?: number; o?: number }> = ({ fx, fy, len, s = 1, o = 0.62 }) => {
  const u = (len / 360) * s;
  const y = (k: number) => fy + len * k;
  const P = (dx: number, k: number) => `${(fx + dx * u).toFixed(1)} ${y(k).toFixed(1)}`;
  const side = (d: 1 | -1) =>
    `M ${P(d * 4, 0)} L ${P(d * 26, 0)} L ${P(d * 36, 0.5)} L ${P(d * 26, 0.5)} Z`;
  return (
    <g opacity={o} filter="url(#blur3)">
      <path d={side(1)} fill="#0A0610" /><path d={side(-1)} fill="#0A0610" />
      <path d={`M ${P(-36, 0.5)} L ${P(-30, 0.64)} L ${P(-70, 0.78)} L ${P(-112, 0.66)} L ${P(-46, 0.54)} L ${P(-52, 0.66)} L ${P(-26, 0.8)} L ${P(-14, 0.86)} L ${P(14, 0.86)} L ${P(26, 0.8)} L ${P(52, 0.66)} L ${P(46, 0.54)} L ${P(112, 0.66)} L ${P(70, 0.78)} L ${P(30, 0.64)} L ${P(36, 0.5)} Z`} fill="#0A0610" />
      <ellipse cx={fx} cy={y(0.93)} rx={34 * u} ry={len * 0.065} fill="#0A0610" />
    </g>
  );
};
