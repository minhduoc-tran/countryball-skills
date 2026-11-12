import React from 'react';
import { rnd, clamp, easeOut } from '../../engine';

// Chapter B local props: the industrial zone (robot fight). Floor line GROUND = 880. All pure functions of t.
//   <IndustrialBg t id />                         hazy dusk sky, chimneys with smoke, sawtooth halls, tanks, asphalt
//   <Trooper x y s flash? />                      generic dark silhouette of an officer behind cover, aiming right
//   <Barricade x y s />                           striped road barrier
//   <Tracers t x0 y0 x1 y1 n? />                  bullet streaks from the troopers to the robot (no gore)
//   <Pings t x y r? n? seed? />                   sparks pinging off armour (white-yellow star bursts and ricochet lines)

export const GROUND = 880;
const INK = '#1A1218';

export const IndustrialBg: React.FC<{ t: number; id: string; smoke?: number }> = ({ t, id, smoke = 1 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38476E" /><stop offset="0.6" stopColor="#B97C6A" /><stop offset="1" stopColor="#F0B574" /></linearGradient>
    </defs>
    <rect x={-800} y={-500} width={3600} height={GROUND + 500} fill={`url(#${id}s)`} />
    <circle cx={1500} cy={640} r={110} fill="#FFE2A6" opacity={0.7} />
    {/* far skyline with chimneys */}
    {Array.from({ length: 22 }).map((_, i) => {
      const x = -700 + i * 160;
      const h = 150 + rnd(11, i) * 210;
      return (
        <g key={i}>
          <rect x={x} y={GROUND - 20 - h} width={140} height={h + 20} fill="#5B5272" stroke="#3E3654" strokeWidth={4} />
          {i % 3 === 0 ? <rect x={x + 90} y={GROUND - 20 - h - 160} width={34} height={170} fill="#4A4262" stroke="#3E3654" strokeWidth={4} /> : null}
        </g>
      );
    })}
    {/* smoke from chimneys */}
    {[0, 3, 6, 9, 12, 15, 18].map((i) => {
      const x = -700 + i * 160 + 107;
      const h = 150 + rnd(11, i) * 210;
      return [0, 1, 2, 3].map((k) => {
        const p = (((t * 0.012 + k / 4 + i * 0.13) % 1) + 1) % 1;
        return <circle key={`${i}${k}`} cx={x + p * 90} cy={GROUND - 20 - h - 170 - p * 220} r={22 + p * 60} fill="#6C6684" opacity={0.55 * (1 - p) * smoke} />;
      });
    })}
    {/* mid halls: sawtooth roofs, tanks, pipes */}
    {Array.from({ length: 9 }).map((_, i) => {
      const x = -650 + i * 360;
      return (
        <g key={i}>
          <rect x={x} y={GROUND - 200} width={320} height={200} fill="#6A5A72" stroke={INK} strokeWidth={6} />
          {[0, 1, 2].map((k) => <polygon key={k} points={`${x + k * 107},${GROUND - 200} ${x + k * 107},${GROUND - 270} ${x + k * 107 + 107},${GROUND - 200}`} fill="#7B6A84" stroke={INK} strokeWidth={5} strokeLinejoin="round" />)}
          {[0, 1, 2, 3].map((k) => <rect key={k} x={x + 20 + k * 76} y={GROUND - 150} width={50} height={46} fill={rnd(4, i * 4 + k) > 0.55 ? '#FFD98A' : '#2B2338'} stroke={INK} strokeWidth={3} />)}
          <rect x={x + 120} y={GROUND - 80} width={80} height={80} fill="#4A3F55" stroke={INK} strokeWidth={5} />
        </g>
      );
    })}
    {[-300, 640, 1500, 2300].map((x, i) => (
      <g key={i}>
        <rect x={x} y={GROUND - 330} width={150} height={330} rx={26} fill="#8E8AA0" stroke={INK} strokeWidth={6} />
        <rect x={x + 18} y={GROUND - 310} width={26} height={290} rx={12} fill="#FFFFFF" opacity={0.25} />
        <path d={`M ${x + 150} ${GROUND - 250} h 90 v 250`} stroke={INK} strokeWidth={16} fill="none" />
        <path d={`M ${x + 150} ${GROUND - 250} h 90 v 250`} stroke="#9AA3AE" strokeWidth={8} fill="none" />
      </g>
    ))}
    {/* asphalt */}
    <rect x={-800} y={GROUND} width={3600} height={500} fill="#3A3944" />
    <rect x={-800} y={GROUND} width={3600} height={10} fill="#1A1820" />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-700 + i * 190} y={GROUND + 120} width={100} height={10} fill="#E7C547" opacity={0.8} />)}
  </g>
);

export const Barricade: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-110} width={240} height={50} rx={6} fill="#F2F2F2" stroke={INK} strokeWidth={6} />
    {[-100, -40, 20, 80].map((dx) => <polygon key={dx} points={`${dx},-110 ${dx + 36},-110 ${dx + 6},-60 ${dx - 30},-60`} fill="#E5322D" />)}
    <path d="M -90 -60 L -100 0 M 90 -60 L 100 0" stroke={INK} strokeWidth={9} />
  </g>
);

/** A generic officer silhouette crouched behind cover, aiming to the right; `flash` 0/1 draws the muzzle flash. */
export const Trooper: React.FC<{ x: number; y: number; s?: number; flash?: number }> = ({ x, y, s = 1, flash = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -34 0 L -30 -90 Q -28 -128 0 -128 Q 28 -128 30 -90 L 36 0 Z" fill="#20233A" stroke="#0B0C16" strokeWidth={5} />
    <circle cx={0} cy={-160} r={32} fill="#20233A" stroke="#0B0C16" strokeWidth={5} />
    <path d="M -34 -176 Q 0 -216 34 -176 Z" fill="#2E3350" stroke="#0B0C16" strokeWidth={5} />
    <rect x={10} y={-118} width={92} height={14} rx={5} fill="#0B0C16" />
    <path d="M 4 -106 L 40 -112" stroke="#20233A" strokeWidth={16} strokeLinecap="round" />
    {flash > 0 ? <polygon points="102,-111 150,-140 134,-111 166,-111 134,-100 150,-80" fill="#FFE27A" stroke="#FFFFFF" strokeWidth={3} /> : null}
  </g>
);

export const Tracers: React.FC<{ t: number; x0: number; y0: number; x1: number; y1: number; n?: number }> = ({ t, x0, y0, x1, y1, n = 7 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = (((t * 0.5 + i * 0.37) % 1) + 1) % 1;
      const sy = y0 + (rnd(3, i) - 0.5) * 120;
      const ty = y1 + (rnd(4, i) - 0.5) * 300;
      const a = clamp(p * 1.0);
      const hx = x0 + (x1 - x0) * a;
      const hy = sy + (ty - sy) * a;
      const tx = x0 + (x1 - x0) * Math.max(0, a - 0.2);
      const ty2 = sy + (ty - sy) * Math.max(0, a - 0.2);
      return <line key={i} x1={tx} y1={ty2} x2={hx} y2={hy} stroke="#FFF3B0" strokeWidth={5} strokeLinecap="round" opacity={0.9} />;
    })}
  </g>
);

export const Pings: React.FC<{ t: number; x: number; y: number; r?: number; n?: number; seed?: number }> = ({ t, x, y, r = 300, n = 6, seed = 1 }) => {
  const k = Math.floor(t / 3);
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const age = (t % 3) / 3;
        const px = x + (rnd(seed + k, i) - 0.5) * r * 1.2;
        const py = y + (rnd(seed + k + 5, i) - 0.5) * r * 1.6;
        const a = rnd(seed + k + 9, i) * Math.PI * 2;
        const L = 46 + 40 * rnd(seed + k + 2, i);
        return (
          <g key={i} opacity={1 - age * 0.6}>
            <polygon points={`${px},${py - 22} ${px + 7},${py - 7} ${px + 22},${py} ${px + 7},${py + 7} ${px},${py + 22} ${px - 7},${py + 7} ${px - 22},${py} ${px - 7},${py - 7}`} fill="#FFFFFF" stroke="#FFE27A" strokeWidth={3} transform={`scale(${easeOut(1 - age * 0.3)})`} style={{ transformOrigin: `${px}px ${py}px` }} />
            <line x1={px} y1={py} x2={px + Math.cos(a) * L * (0.5 + age)} y2={py + Math.sin(a) * L * (0.5 + age)} stroke="#FFD25A" strokeWidth={5} strokeLinecap="round" />
            <line x1={px} y1={py} x2={px - Math.cos(a) * L * 0.6} y2={py - Math.sin(a) * L * 0.4} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};
