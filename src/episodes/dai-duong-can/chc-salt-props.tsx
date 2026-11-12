import React from 'react';
import { rnd, clamp, easeOut, FONT } from '../../engine';
import { mix } from './kit-palette';

// Chapter C props: salt, rice fields, the Aral Sea. Pure functions of t.
//   SaltPile (x,y = ground, s)         heap of white salt cubes with glints (~300 wide at s 1).
//   SaltTank (x,y = top-left, w,h)     side view of a basin: water level 1..0 drains, the white salt layer stays.
//   RiceField (id, t, white, dust)     fills 0..1920 x 1080: hot sky, hills, perspective rice rows; white 0..1 sweeps left -> right.
//   AralMap (id, t, shrink)            top-down map (fills 1920 x 1080): land, two rivers, the lake; shrink 0 = 1960, 1 = today.
//   LakeBars (t)                       four lake bars on blueprint-dark, the 4th (Aral) lit.

const INK = '#14121A';

export const SaltPile: React.FC<{ x: number; y: number; s?: number; t?: number; n?: number }> = ({ x, y, s = 1, t = 0, n = 34 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <ellipse cx={0} cy={6} rx={170} ry={20} fill="#000" opacity={0.25} />
    {Array.from({ length: n }).map((_, i) => {
      const u = rnd(11, i) * 2 - 1;
      const cx = u * 150;
      const cy = -Math.max(0, 1 - u * u) * 95 * rnd(12, i) - rnd(13, i) * 12;
      const sz = 12 + rnd(14, i) * 15;
      const r = rnd(15, i) * 50 - 25;
      return (
        <g key={i} transform={`translate(${cx} ${cy}) rotate(${r})`}>
          <rect x={-sz / 2} y={-sz / 2} width={sz} height={sz} fill="#F4F1EA" stroke={INK} strokeWidth={2} />
          <path d={`M ${-sz / 2} ${-sz / 2} L ${sz / 2} ${-sz / 2} L ${sz / 2 - 5} ${-sz / 2 + 7} L ${-sz / 2 + 5} ${-sz / 2 + 7} Z`} fill="#FFFFFF" />
          <rect x={sz / 2 - 7} y={-sz / 2 + 7} width={7} height={sz - 7} fill="#CBD5DD" />
        </g>
      );
    })}
    {[0, 1, 2, 3].map((k) => {
      const ph = ((t / 20 + k * 0.27) % 1);
      const gx = -120 + rnd(16, k) * 240;
      const gy = -20 - rnd(17, k) * 90;
      const g = Math.sin(Math.PI * ph);
      return <path key={k} d={`M ${gx} ${gy - 26 * g} L ${gx + 6 * g} ${gy - 6 * g} L ${gx + 26 * g} ${gy} L ${gx + 6 * g} ${gy + 6 * g} L ${gx} ${gy + 26 * g} L ${gx - 6 * g} ${gy + 6 * g} L ${gx - 26 * g} ${gy} L ${gx - 6 * g} ${gy - 6 * g} Z`} fill="#FFFFFF" opacity={g} />;
    })}
  </g>
);

export const SaltTank: React.FC<{ x: number; y: number; w: number; h: number; water: number; t: number }> = ({ x, y, w, h, water, t }) => {
  const salt = 58;
  const wy = y + h - salt - (h - salt - 14) * water;
  const bubbles = water > 0.02 && water < 0.98;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={24} fill="#EAF4F8" opacity={0.14} />
      {water > 0.01 ? <path d={`M ${x + 8} ${wy} ` + Array.from({ length: 13 }).map((_, k) => `L ${x + 8 + ((w - 16) * k) / 12} ${wy + Math.sin(k * 1.1 + t * 0.2) * 5}`).join(' ') + ` L ${x + w - 8} ${y + h - 10} L ${x + 8} ${y + h - 10} Z`} fill="#2E86C1" opacity={0.85} /> : null}
      {bubbles ? Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={x + 60 + rnd(20, i) * (w - 120)} cy={y + h - salt - ((t * 4 + i * 60) % Math.max(40, y + h - salt - wy))} r={5 + rnd(21, i) * 6} fill="#FFFFFF" opacity={0.5} />) : null}
      <path d={`M ${x + 8} ${y + h - salt} ` + Array.from({ length: 15 }).map((_, k) => `L ${x + 8 + ((w - 16) * k) / 14} ${y + h - salt + (k % 2 ? -9 : 3) + rnd(22, k) * 4}`).join(' ') + ` L ${x + w - 8} ${y + h - 8} L ${x + 8} ${y + h - 8} Z`} fill="#F4F1EA" stroke="#C9D2DA" strokeWidth={3} />
      <rect x={x} y={y} width={w} height={h} rx={24} fill="none" stroke="#F6EFE3" strokeWidth={8} />
    </g>
  );
};

const FieldTuft: React.FC<{ x: number; y: number; k: number; white: number }> = ({ x, y, k, white }) => {
  const col = mix('#4FA23A', '#F1EFE6', white);
  const col2 = mix('#7BCB52', '#FFFFFF', white);
  return (
    <g>
      <path d={`M ${x - 4 * k} ${y} Q ${x - 14 * k} ${y - 22 * k} ${x - 20 * k} ${y - 36 * k} M ${x} ${y} Q ${x} ${y - 24 * k} ${x + 2 * k} ${y - 44 * k} M ${x + 4 * k} ${y} Q ${x + 14 * k} ${y - 22 * k} ${x + 22 * k} ${y - 34 * k}`} stroke={col} strokeWidth={Math.max(2, 4 * k)} fill="none" strokeLinecap="round" />
      <path d={`M ${x} ${y - 10 * k} Q ${x + 2 * k} ${y - 30 * k} ${x + 6 * k} ${y - 40 * k}`} stroke={col2} strokeWidth={Math.max(1.5, 2.5 * k)} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const RiceField: React.FC<{ id: string; t: number; white?: number; dust?: number }> = ({ id, t, white = 0, dust = 0 }) => {
  const H = 440;
  const rows = 15;
  const front = clamp(white);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9ED0E8" /><stop offset="1" stopColor="#F4EAD0" /></linearGradient>
        <linearGradient id={`${id}gnd`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix('#5FAE45', '#E8E5DA', front)} /><stop offset="1" stopColor={mix('#3F8A34', '#F6F4EC', front)} /></linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={H + 6} fill={`url(#${id}sky)`} />
      <circle cx={1500} cy={150} r={86} fill="#FFF3C4" opacity={0.9} />
      <path d={`M 0 ${H} L 0 ${H - 90} Q 200 ${H - 150} 420 ${H - 80} Q 640 ${H - 20} 800 ${H - 70} Q 1100 ${H - 170} 1400 ${H - 70} Q 1700 ${H - 10} 1920 ${H - 100} L 1920 ${H} Z`} fill={mix('#6A9A86', '#B6BDB8', front)} />
      <rect x={0} y={H} width={1920} height={1080 - H} fill={`url(#${id}gnd)`} />
      {Array.from({ length: rows }).map((_, j) => {
        const f = Math.pow((j + 0.5) / rows, 1.7);
        const y = H + 12 + (1080 - H) * f;
        const k = 0.28 + 1.6 * f;
        const n = Math.ceil(1980 / (46 * k + 10));
        return Array.from({ length: n }).map((__, i) => {
          const x = -30 + i * (46 * k + 10) + (j % 2) * 20 * k;
          const sway = Math.sin(t / 14 + i * 0.7 + j) * 2 * k;
          const w = clamp(white * 1.7 - (x / 1920) * 0.7 - rnd(30 + j, i) * 0.15);
          return <FieldTuft key={`${j}-${i}`} x={x + sway} y={y} k={k} white={w} />;
        });
      })}
      {dust > 0 ? Array.from({ length: 16 }).map((_, i) => {
        const ph = (t / 30 + rnd(40, i)) % 1;
        const y = 120 + rnd(41, i) * 800;
        return <path key={i} d={`M ${-200 + ph * 2400 - 220} ${y} q 110 -26 220 0`} stroke="#FFFFFF" strokeWidth={6 + rnd(42, i) * 8} fill="none" strokeLinecap="round" opacity={dust * 0.55} />;
      }) : null}
    </g>
  );
};

// the lake outline (relative to the centre), smoothed through midpoints
const LAKE: [number, number][] = [[-340, -60], [-250, -190], [-60, -230], [120, -190], [260, -120], [330, 20], [260, 170], [70, 230], [-120, 200], [-230, 110]];
const lakePath = (cx: number, cy: number, sx: number, sy: number) => {
  const p = LAKE.map(([a, b]) => [cx + a * 1.25 * sx, cy + b * 1.25 * sy]);
  const m = (i: number) => [(p[i][0] + p[(i + 1) % p.length][0]) / 2, (p[i][1] + p[(i + 1) % p.length][1]) / 2];
  let d = `M ${m(p.length - 1)[0]} ${m(p.length - 1)[1]}`;
  for (let i = 0; i < p.length; i++) d += ` Q ${p[i][0]} ${p[i][1]} ${m(i)[0]} ${m(i)[1]}`;
  return d + ' Z';
};

export const AralMap: React.FC<{ id: string; t: number; shrink?: number }> = ({ id, t, shrink = 0 }) => {
  const k = easeOut(clamp(shrink));
  const sx = 1 - 0.86 * k;
  const sy = 1 - 0.9 * k;
  const cx = 960 + 60 * k;
  const cy = 560 + 30 * k;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}land`} cx="0.5" cy="0.5" r="0.8"><stop offset="0" stopColor="#E3CE98" /><stop offset="1" stopColor="#C9AE74" /></radialGradient>
        <clipPath id={`${id}clip`}><path d={lakePath(960, 560, 1, 1)} /></clipPath>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id}land)`} />
      {Array.from({ length: 22 }).map((_, i) => <ellipse key={i} cx={rnd(50, i) * 1920} cy={rnd(51, i) * 1080} rx={60 + rnd(52, i) * 90} ry={14 + rnd(53, i) * 20} fill="#B89A5E" opacity={0.25} />)}
      <path d="M 1920 330 Q 1500 380 1380 470 Q 1300 520 1200 540" stroke="#2E86C1" strokeWidth={16} fill="none" strokeLinecap="round" opacity={1 - 0.7 * k} />
      <path d="M 1920 760 Q 1560 700 1400 640 Q 1330 600 1250 590" stroke="#2E86C1" strokeWidth={16} fill="none" strokeLinecap="round" opacity={1 - 0.7 * k} />
      {k > 0 ? <path d={lakePath(960, 560, 1, 1)} fill="#F2E9D2" stroke="#FFFFFF" strokeWidth={5} opacity={Math.min(1, k * 3)} /> : null}
      {k > 0 ? <g clipPath={`url(#${id}clip)`}>{Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={640 + rnd(60, i) * 640} cy={340 + rnd(61, i) * 460} rx={14 + rnd(62, i) * 26} ry={5} fill="#FFFFFF" opacity={0.7} />)}</g> : null}
      <path d={lakePath(960, 560, 1, 1)} fill="none" stroke="#7A6A48" strokeWidth={4} strokeDasharray="16 12" opacity={k * 0.9} />
      <path d={lakePath(cx, cy, sx, sy)} fill="#2E86C1" stroke="#1B4F72" strokeWidth={6} />
      <path d={lakePath(cx - 20 * sx, cy - 20 * sy, sx * 0.7, sy * 0.6)} fill="#4FA5DC" opacity={0.6 * (1 - k)} transform={`translate(${Math.sin(t / 20) * 3} 0)`} />
    </g>
  );
};

export const LakeBars: React.FC<{ t: number }> = ({ t }) => {
  const rows = [{ w: 1040, c: '#3B4B66' }, { w: 780, c: '#3B4B66' }, { w: 560, c: '#3B4B66' }, { w: 400, c: '#2E86C1' }];
  return (
    <g>
      {rows.map((r, i) => {
        const g = easeOut(clamp((t - i * 3) / 14));
        const y = 250 + i * 150;
        const lit = i === 3 ? 1 : 0;
        return (
          <g key={i}>
            <rect x={300} y={y} width={r.w * g} height={100} rx={20} fill={r.c} stroke={lit ? '#9ADBFF' : '#F6EFE3'} strokeWidth={lit ? 8 : 4} />
            <text x={270} y={y + 70} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={72} fill={lit ? '#FF8A3D' : '#7E8DA6'}>{i + 1}</text>
          </g>
        );
      })}
      {t > 18 ? <text x={330 + 400 + 40} y={250 + 3 * 150 + 72} fontFamily={FONT.ui} fontWeight={700} fontSize={60} fill="#9ADBFF" opacity={easeOut(clamp((t - 18) / 8))}>ARAL</text> : null}
    </g>
  );
};
