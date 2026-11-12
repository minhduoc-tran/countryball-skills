import React from 'react';
import { Glow, Puff } from './fx-glow';
import { Flames } from './fx-bomb-carpet';
import { flicker, hash } from './fx-math';
import { CRATERS, CRATER_COUNT, HOUSES, TREES } from './citadel-geometry';
import { inView, PAL, tone, View } from './citadel-palette';

// War damage on the plan, in local metres:
//   <CitadelCraters/>  craters that appear one by one as `damage` rises (seeded thresholds), `density` 0..1 scales how many
//   <CitadelTrees/>    trees that vanish as `damage` rises (a stump marks the moment a tree goes)
//   <CitadelFires/>    burning ruins: glow, flames and smoke columns (flicker follows t, in frames)

type V = { view: View; k: number; night: number; damage: number };

export const CitadelCraters: React.FC<V & { density: number }> = ({ view, k, night, damage, density }) => {
  const T = (c: string) => tone(c, night), n = Math.round(CRATER_COUNT * Math.min(1, density));
  const shown = CRATERS.filter((c, i) => i < n && c.th * 0.97 <= damage && inView(view, c.x, c.y, 16));
  if (!shown.length) return null;
  return (
    <g>
      {shown.map((c, i) => {
        const age = Math.min(1, (damage - c.th * 0.97) * 14), r = c.r * (0.4 + 0.6 * age);
        return (
          <g key={i} transform={`translate(${c.x.toFixed(1)},${c.y.toFixed(1)}) rotate(${c.rot.toFixed(0)})`}>
            <ellipse rx={r * 1.55} ry={r * 1.55 * c.ry} fill={T(PAL.burnt)} opacity={0.35} />
            <ellipse rx={r * 1.18} ry={r * 1.18 * c.ry} fill={T(PAL.craterRim)} opacity={0.9} />
            <ellipse rx={r * 0.82} ry={r * 0.82 * c.ry} fill={T(PAL.crater)} />
            {r > 5 * (1 / Math.max(k, 0.3)) * 0.4 && <ellipse cx={-r * 0.18} cy={-r * 0.12} rx={r * 0.42} ry={r * 0.3 * c.ry} fill="#17100B" opacity={0.55} />}
          </g>
        );
      })}
    </g>
  );
};

export const CitadelTrees: React.FC<V> = ({ view, night, damage, k }) => {
  if (k < 0.12) return null;
  const T = (c: string) => tone(c, night), vis = TREES.filter((t) => inView(view, t.x, t.y, 20));
  const d: string[] = ['', '', ''], hi: string[] = [], sh: string[] = [], stump: string[] = [];
  for (const t of vis) {
    if (damage > t.th + 0.08) continue;
    if (damage > t.th) { stump.push(`M${t.x.toFixed(1)},${t.y.toFixed(1)}m-1.1,0a1.1,1.1 0 1,0 2.2,0a1.1,1.1 0 1,0 -2.2,0`); continue; }
    const r = t.r * (1 - 0.25 * damage);
    const c = (x: number, y: number, rr: number) => `M${(x - rr).toFixed(1)},${y.toFixed(1)}a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(2 * rr).toFixed(1)},0a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(-2 * rr).toFixed(1)},0`;
    d[t.tone] += c(t.x, t.y, r); sh.push(c(t.x + r * 0.28, t.y + r * 0.34, r)); hi.push(c(t.x - r * 0.25, t.y - r * 0.28, r * 0.5));
  }
  return (
    <g>
      <path d={sh.join('')} fill="#10180C" opacity={0.28} />
      {d.map((s, i) => s && <path key={i} d={s} fill={T(PAL.tree[i])} />)}
      <path d={hi.join('')} fill={T('#86A357')} opacity={0.55} />
      <path d={stump.join('')} fill={T('#3A2C20')} />
    </g>
  );
};

// burning spots: ruined houses near the citadel (seeded, stable order) plus the enclosure
const FIRE_SPOTS = HOUSES.filter((h) => Math.hypot(h.x, h.y) < 650).sort((a, b) => hash(a.x, a.y) - hash(b.x, b.y)).slice(0, 40)
  .map((h) => ({ x: h.x, y: h.y, th: h.th }));

export const CitadelFires: React.FC<V & { fires: number; t: number }> = ({ view, night, damage, fires, t, k }) => {
  const n = Math.round(FIRE_SPOTS.length * Math.min(1, fires)), spots = FIRE_SPOTS.slice(0, n).filter((s) => s.th < damage && inView(view, s.x, s.y, 60));
  if (!spots.length) return null;
  const glow = 0.45 + 0.4 * night;
  return (
    <g>
      {spots.map((s, i) => {
        const f = flicker(t, i), age = (t + i * 23) % 120;
        return (
          <g key={i}>
            <Glow x={s.x} y={s.y} r={(30 + 14 * f) * Math.max(1, 0.5 / k)} color="#FF6A1A" o={glow} />
            <Flames t={t} x={s.x} y={s.y + 3} s={9 + 4 * hash(i, 2)} n={3} seed={i + 5} />
            {[0, 1].map((j) => {
              const a = (age + j * 60) % 120;
              return <Puff key={j} x={s.x + a * 0.16} y={s.y - 6 - a * 0.42} r={4 + a * 0.18} color="#2A2A2E" o={0.55 * (1 - a / 120)} seed={i + j} />;
            })}
          </g>
        );
      })}
    </g>
  );
};
