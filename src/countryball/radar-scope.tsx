import React from 'react';
import { FONT } from '../engine/fonts';
import { clamp, easeOut, hash, polar, Pt, prog } from './fx-math';

// Round PPI radar scope (the key scene: operators find B-52s inside the jamming). Pure function of t (30 fps).
// Bearings are degrees clockwise from the top (0 = up). Range 0..1 = centre to rim. The sweep turns once per `period`
// frames; targets glow when the sweep passes and fade (phosphor); a jamming wedge fills part of the scope with
// seeded noise that re-rolls every 2 frames. A target blip with `target: true` gets circled and labelled after `foundAt`.

export type Blip = { bearing: number; range: number; vB?: number; vR?: number; target?: boolean; label?: string };
export type Jam = { center: number; width: number; strength: number };

const G = '#46FF7A', GD = '#1C7A3A';
const pos = (cx: number, cy: number, r: number, bearing: number, range: number): Pt => polar(cx, cy, bearing - 90, range * r);
/** Brightness 0..1 of something at `bearing`: 1 just as the sweep passes, exponential phosphor fade after. */
const persist = (sweep: number, bearing: number, period: number) => {
  const behind = (((sweep - bearing) % 360) + 360) % 360; // degrees the sweep has moved past this bearing
  return Math.exp(-((behind / 360) * period) / (period * 0.55));
};
const wedge = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p0 = polar(cx, cy, a0 - 90, r), p1 = polar(cx, cy, a1 - 90, r);
  return `M${cx},${cy} L${p0[0]},${p0[1]} A${r},${r} 0 0 1 ${p1[0]},${p1[1]} Z`;
};

export const RadarScope: React.FC<{
  id: string; t: number; cx: number; cy: number; r: number; period?: number; jam?: Jam; blips?: Blip[]; foundAt?: number; foundLabel?: string; noiseDots?: number;
}> = ({ id, t, cx, cy, r, period = 72, jam, blips = [], foundAt = Infinity, foundLabel = 'B-52', noiseDots = 620 }) => {
  const sweep = ((t / period) * 360) % 360, k2 = Math.floor(t / 2);
  const found = prog(t, foundAt, foundAt + 14);
  const noise: React.ReactNode[] = [];
  if (jam && jam.strength > 0.01)
    for (let i = 0; i < noiseDots; i++) {
      const b = jam.center + (hash(i, k2 * 0.37 + 1) - 0.5) * jam.width, rg = 0.12 + 0.88 * Math.pow(hash(i, k2 * 0.37 + 2), 0.65);
      const lit = persist(sweep, b, period) * (0.35 + 0.65 * hash(i, k2 + 3)), a = clamp(lit * jam.strength * 1.1);
      if (a < 0.06) continue;
      const p = pos(cx, cy, r, b, rg), q = polar(p[0], p[1], b - 90, 3 + hash(i, k2 + 4) * 15);
      noise.push(<line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={hash(i, 7) > 0.8 ? '#C8FFD6' : G} strokeWidth={1.4 + hash(i, 5) * 2} opacity={a * 0.85} strokeLinecap="round" />);
    }
  return (
    <g>
      <defs>
        <radialGradient id={`rd-bg-${id}`}><stop offset="0" stopColor="#0B2A17" /><stop offset="1" stopColor="#04120A" /></radialGradient>
        <clipPath id={`rd-clip-${id}`}><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.1} fill="#23282E" stroke="#0C0E10" strokeWidth={6} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#rd-bg-${id})`} stroke="#0C0E10" strokeWidth={5} />
      <g clipPath={`url(#rd-clip-${id})`}>
        {[0.25, 0.5, 0.75, 1].map((k) => <circle key={k} cx={cx} cy={cy} r={r * k} fill="none" stroke={GD} strokeWidth={2} opacity={0.9} />)}
        {Array.from({ length: 12 }, (_, i) => { const p = pos(cx, cy, r, i * 30, 1); return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke={GD} strokeWidth={i % 3 ? 1 : 2} opacity={0.7} />; })}
        {/* phosphor afterglow: 26 wedges trailing the sweep line, fading */}
        {Array.from({ length: 26 }, (_, i) => <path key={i} d={wedge(cx, cy, r, sweep - (i + 1) * 3, sweep - i * 3)} fill={G} opacity={0.34 * Math.pow(1 - i / 26, 1.7)} />)}
        {noise}
        {jam && jam.strength > 0.01 && Array.from({ length: 9 }, (_, i) => {
          const b = jam.center + (hash(i, k2 + 11) - 0.5) * jam.width, p = pos(cx, cy, r, b, 1);
          return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke={G} strokeWidth={3 + hash(i, 12) * 5} opacity={0.09 * jam.strength * (0.5 + persist(sweep, b, period))} />;
        })}
        {blips.map((bl, i) => {
          const b = bl.bearing + (bl.vB ?? 0) * t, rg = clamp(bl.range + (bl.vR ?? 0) * t, 0, 1), p = pos(cx, cy, r, b, rg), glow = persist(sweep, b, period);
          const isT = !!bl.target, o = isT ? (0.5 + 0.5 * found) * glow : glow;
          return (
            <g key={i}>
              <g transform={`translate(${p[0]},${p[1]}) rotate(${b - 90})`} opacity={clamp(o + 0.05)}>
                <rect x={-r * 0.026} y={-r * 0.016} width={r * 0.052} height={r * 0.032} rx={r * 0.008} fill={isT && found > 0.4 ? '#E8FFE9' : G} />
                <rect x={-r * 0.05} y={-r * 0.006} width={r * 0.03} height={r * 0.012} rx={r * 0.006} fill={G} opacity={0.6} />
              </g>
            </g>
          );
        })}
        {(() => { const p = pos(cx, cy, r, sweep, 1); return <line x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#B8FFC9" strokeWidth={3} />; })()}
      </g>
      {blips.map((bl, i) => {
        if (!bl.target || found <= 0) return null;
        const b = bl.bearing + (bl.vB ?? 0) * t, rg = clamp(bl.range + (bl.vR ?? 0) * t, 0, 1), p = pos(cx, cy, r, b, rg), left = p[0] > cx + r * 0.3, fs = Math.max(14, r * 0.1);
        return (
          <g key={`f${i}`} opacity={found}>
            <circle cx={p[0]} cy={p[1]} r={r * 0.06 + r * 0.06 * (1 - easeOut(found))} fill="none" stroke="#FFD43B" strokeWidth={4} />
            <line x1={p[0] + (left ? -1 : 1) * r * 0.05} y1={p[1] - r * 0.05} x2={p[0] + (left ? -1 : 1) * r * 0.13} y2={p[1] - r * 0.12} stroke="#FFD43B" strokeWidth={3} />
            <text x={p[0] + (left ? -1 : 1) * r * 0.14} y={p[1] - r * 0.11} textAnchor={left ? 'end' : 'start'} fontFamily={FONT.ui} fontWeight={700} fontSize={fs} fill="#FFD43B" stroke="#04120A" strokeWidth={4} paintOrder="stroke">{bl.label ?? foundLabel}</text>
          </g>
        );
      })}
      {Array.from({ length: 36 }, (_, i) => { const a = pos(cx, cy, r, i * 10, 1.0), b = pos(cx, cy, r, i * 10, i % 3 ? 1.035 : 1.06); return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#8D959E" strokeWidth={2} />; })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={G} strokeWidth={2} opacity={0.18} />
    </g>
  );
};
