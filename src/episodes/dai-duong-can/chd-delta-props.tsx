import React from 'react';
import { rnd, clamp, Glow } from '../../engine';
import { mix } from './kit-palette';
import { Cloud, SkyBand } from './chd-sky-props';

// Chapter D props (2/4): the Mekong delta rice country (lush -> cracked), a cracked-mud macro and a rice stalk.
//   <Delta id t dry={0..1} />   fills 0..1920 x 1080; horizon y 430, canal down the middle, dike path at y ~ 900.
//   <CrackedGround id p w h />  top-down mud filling w x h; cracks draw on with p 0..1.
//   <RiceStalk x y h wilt t />  one stalk standing on (x, y), wilt 0 green and upright .. 1 yellow and drooping.

const INK = '#14121A';
export const DELTA = { H: 430, PATH_Y: 900 };

/** Where a point at screen row y sits in the field (0 at horizon, 1 at the bottom). */
const depthAt = (y: number) => clamp((y - DELTA.H) / (1080 - DELTA.H));

export const RiceStalk: React.FC<{ x: number; y: number; h: number; wilt: number; t?: number; lean?: number }> = ({ x, y, h, wilt, t = 0, lean = 1 }) => {
  const w = clamp(wilt);
  const col = mix('#5DB04A', '#C9A44A', w);
  const dark = mix('#357A2E', '#8A6A2A', w);
  const sway = Math.sin(t / 22 + x) * 5 * (1 - w);
  // the stem rises, then bows over as it wilts; the grain head hangs from its tip
  const tx = x + lean * h * (0.04 + 0.34 * w) + sway;
  const ty = y - h * (0.95 - 0.4 * w);
  const blade = (dir: number, k: number) => {
    const ex = x + dir * h * (0.22 + 0.12 * w);
    const ey = y - h * (0.62 - 0.3 * w) * k;
    return `M ${x} ${y} Q ${x + dir * h * 0.04} ${y - h * 0.5 * k} ${ex} ${ey}`;
  };
  return (
    <g strokeLinecap="round" fill="none">
      <path d={blade(-1, 0.95)} stroke={dark} strokeWidth={h * 0.028} />
      <path d={blade(1, 0.8)} stroke={dark} strokeWidth={h * 0.026} />
      <path d={`M ${x} ${y} Q ${x + lean * h * 0.02} ${y - h * 0.6} ${tx} ${ty}`} stroke={col} strokeWidth={h * 0.032} />
      <path d={`M ${tx} ${ty} q ${lean * h * 0.05} ${h * 0.04} ${lean * h * 0.06} ${h * (0.12 + 0.1 * w)}`} stroke={mix('#E8C547', '#B58B2E', w)} strokeWidth={h * 0.05} />
    </g>
  );
};

/** One rice tuft (three blades) on a field row. */
const tuft = (x: number, y: number, s: number, k: number): string => {
  const hgt = 30 * s;
  return `M ${x} ${y} q ${-6 * s} ${-hgt * 0.7} ${-12 * s - k * 8 * s} ${-hgt} M ${x} ${y} q ${1 * s} ${-hgt * 0.8} ${4 * s + k * 12 * s} ${-hgt * 1.15} M ${x} ${y} q ${7 * s} ${-hgt * 0.6} ${14 * s + k * 16 * s} ${-hgt * 0.8}`;
};

export const Delta: React.FC<{ id: string; t: number; dry?: number }> = ({ id, t, dry = 0 }) => {
  const d = clamp(dry);
  const { H } = DELTA;
  const soil = mix('#6FB24F', '#D6BC82', d);
  const soilFar = mix('#8CC96A', '#E6D3A4', d);
  const rows = 10;
  const canalL = (y: number) => 925 - depthAt(y) * 420;
  const canalR = (y: number) => 975 + depthAt(y) * 330;
  const shrink = 1 - 0.8 * d; // the canal dries from the banks inwards
  const cl = (y: number) => canalL(y) + (canalR(y) - canalL(y)) * (1 - shrink) / 2;
  const cr = (y: number) => canalR(y) - (canalR(y) - canalL(y)) * (1 - shrink) / 2;
  const tufts: { x: number; y: number; s: number; k: number }[] = [];
  for (let j = 0; j < rows; j++) {
    const f = Math.pow((j + 0.5) / rows, 1.7);
    const y = H + 26 + (1080 - H - 26) * f;
    const s = 0.35 + 1.9 * f;
    const cell = 70 * s;
    for (let k = -1; k < 1960 / cell; k++) {
      const x = k * cell + rnd(200 + j, k) * cell * 0.5;
      if (x > canalL(y) - 30 * s && x < canalR(y) + 30 * s) continue;
      tufts.push({ x, y: y + (rnd(210 + j, k) - 0.5) * 8 * s, s, k: (x - 960) / 960 });
    }
  }
  return (
    <g>
      <SkyBand id={`${id}sky`} top={mix('#6CBDEB', '#F2C98A', d)} bottom={mix('#D9EEF5', '#FCEFD2', d)} h={H} />
      <Glow x={1500} y={150} r={520 + 200 * d} o={0.55 + 0.3 * d} />
      <circle cx={1500} cy={150} r={64 + 30 * d} fill="#FFFDEB" />
      {d < 0.7 ? <g>{[[330, 190, 1.1], [820, 120, 0.8], [1180, 250, 0.9]].map(([x, y, s], i) => <Cloud key={i} x={x + ((t * 0.25) % 80)} y={y} s={s} o={1 - d * 1.4} />)}</g> : null}
      {/* far tree line: nipa and coconut palms */}
      <rect x={-100} y={H - 40} width={2120} height={50} fill={mix('#3F7F45', '#9A8A5A', d)} />
      {Array.from({ length: 40 }).map((_, i) => <ellipse key={i} cx={i * 52 - 20} cy={H - 40 - rnd(220, i) * 26} rx={34 + rnd(221, i) * 20} ry={26 + rnd(222, i) * 18} fill={mix(i % 2 ? '#3F8A4A' : '#2F7040', i % 2 ? '#A59462' : '#8E7E52', d)} />)}
      {[200, 610, 1360, 1750].map((x, i) => (
        <g key={x} transform={`translate(${x} ${H - 8})`}>
          <path d={`M 0 0 Q ${8 + i * 3} -90 ${14 - i * 5} -170`} stroke={mix('#6B4A2C', '#7C6A48', d)} strokeWidth={14} fill="none" strokeLinecap="round" />
          {[-150, -110, -70, -30, 10].map((a, k) => <path key={k} d={`M ${14 - i * 5} -170 q ${Math.cos((a * Math.PI) / 180) * 40} ${Math.sin((a * Math.PI) / 180) * 30 - 24} ${Math.cos((a * Math.PI) / 180) * 80} ${Math.sin((a * Math.PI) / 180) * 50 + 20}`} stroke={mix('#2F7A3F', '#8C7A3E', d)} strokeWidth={9} fill="none" strokeLinecap="round" />)}
        </g>
      ))}
      {/* ground */}
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={soilFar} /><stop offset="1" stopColor={soil} /></linearGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix('#A9DDF2', '#BFAE86', d)} /><stop offset="1" stopColor={mix('#2E86C1', '#8E7A55', d)} /></linearGradient>
      </defs>
      <rect x={-100} y={H} width={2120} height={700} fill={`url(#${id}g)`} />
      {/* the canal */}
      <path d={`M ${canalL(H)} ${H} L ${canalR(H)} ${H} L ${canalR(1080)} 1080 L ${canalL(1080)} 1080 Z`} fill={mix('#5E4A32', '#8A7650', d)} />
      <path d={`M ${cl(H)} ${H} L ${cr(H)} ${H} L ${cr(1080)} 1080 L ${cl(1080)} 1080 Z`} fill={`url(#${id}w)`} />
      {d < 0.6 ? Array.from({ length: 8 }).map((_, i) => {
        const f = Math.pow(((i + (t * 0.03) % 1) / 8) % 1, 1.6);
        const y = H + 10 + f * (1080 - H);
        return <path key={i} d={`M ${cl(y) + 40 * f} ${y} L ${cr(y) - 40 * f} ${y}`} stroke="#FFFFFF" strokeWidth={2 + 3 * f} opacity={0.3 * (1 - d)} />;
      }) : null}
      {/* rice rows */}
      {tufts.map((p, i) => <path key={i} d={tuft(p.x, p.y, p.s, p.k)} stroke={mix(i % 3 ? '#2F8A3A' : '#4DA84A', i % 2 ? '#B89A4A' : '#C9AA55', d)} strokeWidth={3 + 4 * p.s * 0.6} fill="none" strokeLinecap="round" />)}
      {/* dried-out cracks creep over the rows */}
      {d > 0.25 ? (
        <g stroke="#5A4630" strokeWidth={3} fill="none" opacity={clamp((d - 0.25) / 0.4) * 0.7} strokeLinecap="round">
          {Array.from({ length: 22 }).map((_, i) => {
            const y = 520 + rnd(230, i) * 540;
            const f = depthAt(y);
            const x = rnd(231, i) * 1920;
            return <path key={i} d={`M ${x} ${y} l ${(rnd(232, i) - 0.5) * 120 * (0.4 + f)} ${14 + 30 * f} l ${(rnd(233, i) - 0.5) * 90 * f} ${20 + 28 * f}`} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

/** Top-down dried mud with a crack network that draws on as p goes 0 -> 1. */
export const CrackedGround: React.FC<{ id: string; p: number; w?: number; h?: number; wet?: number }> = ({ id, p, w = 1920, h = 1080, wet = 0 }) => {
  const cell = 150;
  const cols = Math.ceil(w / cell) + 2;
  const rws = Math.ceil(h / cell) + 2;
  const pt = (i: number, j: number): [number, number] => [i * cell - cell + (rnd(300 + j, i) - 0.5) * cell * 0.7, j * cell - cell + (rnd(340 + j, i) - 0.5) * cell * 0.7];
  const edges: { d: string; thr: number }[] = [];
  for (let j = 0; j < rws; j++) for (let i = 0; i < cols; i++) {
    const a = pt(i, j);
    [[1, 0], [0, 1], [1, 1]].forEach(([di, dj], k) => {
      if (k === 2 && rnd(380 + j, i) < 0.55) return;
      const b = pt(i + di, j + dj);
      const mx = (a[0] + b[0]) / 2 + (rnd(400 + k + j, i) - 0.5) * 30;
      const my = (a[1] + b[1]) / 2 + (rnd(430 + k + j, i) - 0.5) * 30;
      edges.push({ d: `M ${a[0].toFixed(0)} ${a[1].toFixed(0)} L ${mx.toFixed(0)} ${my.toFixed(0)} L ${b[0].toFixed(0)} ${b[1].toFixed(0)}`, thr: rnd(460 + k + j, i) * 0.6 });
    });
  }
  const base = mix('#6A5238', '#C9A874', 1 - wet);
  return (
    <g>
      <defs><radialGradient id={`${id}cg`} cx="0.5" cy="0.45" r="0.8"><stop offset="0" stopColor={mix(base, '#FFFFFF', 0.12)} /><stop offset="1" stopColor={mix(base, '#000000', 0.25)} /></radialGradient></defs>
      <rect x={-50} y={-50} width={w + 100} height={h + 100} fill={`url(#${id}cg)`} />
      {edges.map((e, i) => {
        const k = clamp((p - e.thr) / 0.35);
        if (k <= 0) return null;
        return (
          <g key={i}>
            <path d={e.d} stroke="#1E1610" strokeWidth={8 * k} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
            <path d={e.d} stroke="#F2D9A6" strokeWidth={3} fill="none" opacity={0.35 * k} transform="translate(-4 -4)" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
          </g>
        );
      })}
    </g>
  );
};
