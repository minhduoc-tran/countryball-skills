import React from 'react';
import { rnd, clamp, easeOut, backOut, NightSky, Stars, Moon, FONT, SCH } from '../../engine';

// Chapter B's local props: a banh mi, a night-sky backdrop, a glowing Jupiter point, line icons for the schematics
// (Sun, Earth, Moon, Jupiter, a crossed-out bulb, a mirror) and a kilometre counter chip. All pure functions of t.

/** A banh mi (baguette) held at (x, y), tilted by rot degrees, with a bite taken when bite > 0. */
export const Sandwich: React.FC<{ x: number; y: number; rot?: number; s?: number; bite?: number }> = ({ x, y, rot = 0, s = 1, bite = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -64 -12 Q -70 -26 -52 -28 L 52 -28 Q 70 -26 64 -12 L 60 14 Q 56 26 40 26 L -40 26 Q -56 26 -60 14 Z" fill="#D9A25B" stroke="#4A2C14" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -56 -6 L 56 -6" stroke="#4A2C14" strokeWidth={4} strokeLinecap="round" />
    {/* filling peeking out of the slit: cucumber, carrot, coriander, pate */}
    <path d="M -50 -6 Q -40 -18 -28 -6 Q -16 -20 -4 -6 Q 8 -18 20 -6 Q 32 -20 46 -6" fill="#6FBF5A" stroke="#2E5A24" strokeWidth={3} />
    <rect x={-34} y={-8} width={26} height={7} rx={3} fill="#F07A3A" />
    <rect x={10} y={-8} width={22} height={7} rx={3} fill="#E8B8A0" />
    <path d="M -46 8 Q -20 2 8 10 M 6 18 Q 26 12 46 16" stroke="#F4D9A0" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
    {bite > 0 ? <circle cx={64} cy={-4} r={22 * bite} fill="#0C0A14" /> : null}
  </g>
);

/** A full-frame night sky for standalone shots: deep blue gradient, twinkling stars drifting very slowly. */
export const StarField: React.FC<{ id: string; t: number; n?: number; seed?: number; drift?: number }> = ({ id, t, n = 160, seed = 31, drift = 0.15 }) => (
  <g>
    <NightSky id={id} horizonY={1080} />
    <g transform={`translate(${-t * drift} 0)`}>
      <Stars seed={seed} x0={-300} y0={-200} w={2700} h={1500} t={t} n={n} o={0.9} />
    </g>
  </g>
);

/** A bright planet-star: a hot core, a soft bloom and four thin spikes; `o` fades it, pulse breathes. */
export const BrightPoint: React.FC<{ x: number; y: number; t: number; r?: number; o?: number; color?: string }> = ({ x, y, t, r = 14, o = 1, color = '#FFF3D0' }) => {
  const pulse = 1 + 0.12 * Math.sin(t / 5);
  const k = r * pulse;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={k * 7} fill={color} opacity={0.12} />
      <circle cx={x} cy={y} r={k * 3.2} fill={color} opacity={0.28} />
      <path d={`M ${x - k * 6} ${y} L ${x + k * 6} ${y} M ${x} ${y - k * 6} L ${x} ${y + k * 6}`} stroke={color} strokeWidth={2.4} opacity={0.7} strokeLinecap="round" />
      <circle cx={x} cy={y} r={k} fill="#FFFFFF" />
    </g>
  );
};

/** The Moon in a night sky that blinks out: a few flickers from frame `at`, gone after `at + 10`. */
export const BlinkMoon: React.FC<{ x: number; y: number; r: number; t: number; at: number }> = ({ x, y, r, t, at }) => {
  const k = t - at;
  let o = 1;
  if (k >= 0) o = k < 2 ? 0.2 : k < 4 ? 1 : k < 6 ? 0.15 : k < 8 ? 0.6 : 0;
  return o > 0 ? <g opacity={o}><Moon x={x} y={y} r={r} /></g> : null;
};

// ---------- schematic line icons ----------
export const SunIcon: React.FC<{ x: number; y: number; r?: number; t: number; gone?: number; color?: string }> = ({ x, y, r = 70, t, gone = 0, color = '#FFC85A' }) => {
  const o = 1 - 0.78 * gone;
  return (
    <g opacity={o} transform={`translate(${x} ${y})`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M ${r * 1.3} 0 L ${r * (1.6 + 0.08 * Math.sin(t / 4 + i))} 0`} transform={`rotate(${i * 30 + t * 0.4})`} stroke={color} strokeWidth={6} strokeLinecap="round" />
      ))}
      <circle r={r} fill={gone > 0.5 ? 'none' : color + '33'} stroke={color} strokeWidth={6} strokeDasharray={gone > 0.5 ? '10 12' : undefined} />
    </g>
  );
};

export const EarthIcon: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 34 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#2F6FB5" stroke={SCH.line} strokeWidth={5} />
    <path d={`M ${-r * 0.5} ${-r * 0.3} Q ${-r * 0.1} ${-r * 0.8} ${r * 0.3} ${-r * 0.4} Q ${r * 0.1} ${r * 0.1} ${-r * 0.3} ${r * 0.2} Z M ${r * 0.2} ${r * 0.3} Q ${r * 0.6} ${r * 0.2} ${r * 0.5} ${r * 0.6} Q ${r * 0.3} ${r * 0.7} ${r * 0.2} ${r * 0.3} Z`} fill="#5DB36A" />
  </g>
);

export const MoonIcon: React.FC<{ x: number; y: number; r?: number; lit?: number }> = ({ x, y, r = 40, lit = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    {lit > 0 ? <circle r={r * 2} fill="#FFF3D0" opacity={0.18 * lit} /> : null}
    <circle r={r} fill={lit > 0.5 ? '#E9E4D2' : '#8A8FA0'} stroke={SCH.line} strokeWidth={5} />
    {[[-0.3, -0.2, 0.2], [0.25, 0.3, 0.15], [0.3, -0.35, 0.1]].map(([dx, dy, k], i) => (
      <circle key={i} cx={dx * r} cy={dy * r} r={k * r} fill="#5A5F72" opacity={0.6} />
    ))}
  </g>
);

export const JupiterIcon: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 54 }) => (
  <g transform={`translate(${x} ${y})`}>
    <clipPath id={`jclip${Math.round(x)}${Math.round(y)}`}><circle r={r} /></clipPath>
    <circle r={r} fill="#E2B88A" />
    <g clipPath={`url(#jclip${Math.round(x)}${Math.round(y)})`}>
      {[-0.55, -0.2, 0.15, 0.5].map((v, i) => <rect key={i} x={-r} y={v * r - 7} width={r * 2} height={14 + i * 2} fill={i % 2 ? '#C77D52' : '#F1DDC0'} />)}
      <ellipse cx={r * 0.3} cy={r * 0.3} rx={r * 0.2} ry={r * 0.12} fill="#B4503A" />
    </g>
    <circle r={r} fill="none" stroke={SCH.line} strokeWidth={5} />
  </g>
);

/** A light bulb with a red cross drawn over it (p: 0..1 draws the cross on). */
export const CrossedBulb: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -50 Q 34 -50 34 -14 Q 34 6 18 20 L 18 34 L -18 34 L -18 20 Q -34 6 -34 -14 Q -34 -50 0 -50 Z" fill="none" stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -14 44 L 14 44 M -10 54 L 10 54" stroke={SCH.line} strokeWidth={6} strokeLinecap="round" />
    <path d="M -50 -60 L 50 66" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - easeOut(clamp(p))} stroke="#FF5A4A" strokeWidth={9} strokeLinecap="round" />
  </g>
);

/** A hand mirror: an oval glass with a handle and a glint sliding across it. */
export const MirrorIcon: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const g = ((t * 3) % 120) - 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-20)`}>
      <rect x={-9} y={44} width={18} height={50} rx={8} fill="#B88A5A" stroke={SCH.line} strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={42} ry={54} fill="#9FD4F0" stroke={SCH.line} strokeWidth={6} />
      <clipPath id={`mir${Math.round(x)}${Math.round(y)}`}><ellipse cx={0} cy={0} rx={38} ry={50} /></clipPath>
      <g clipPath={`url(#mir${Math.round(x)}${Math.round(y)})`}>
        <path d={`M ${g - 40} 60 L ${g + 10} -60 L ${g + 26} -60 L ${g - 24} 60 Z`} fill="#FFFFFF" opacity={0.7} />
      </g>
    </g>
  );
};

/** A kilometre readout chip: big mono number in orange on a dark pill, popping in at t = 0. */
export const KmChip: React.FC<{ x: number; y: number; t: number; text: string; sub?: string; size?: number }> = ({ x, y, t, text, sub, size = 72 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7));
  const w = text.length * size * 0.62 + 80;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-size * 0.85} width={w} height={size * (sub ? 1.95 : 1.3)} rx={size * 0.4} fill="#0A1220" opacity={0.82} stroke={SCH.live} strokeWidth={3} />
      <text textAnchor="middle" y={0} fontFamily={FONT.ui} fontSize={size} fill={SCH.live} letterSpacing={2}>{text}</text>
      {sub ? <text textAnchor="middle" y={size * 0.7} fontFamily={FONT.ui} fontSize={size * 0.4} fill={SCH.line} letterSpacing={3}>{sub}</text> : null}
    </g>
  );
};

/** Speed streaks: thin horizontal lines streaming past (right to left), deterministic in t. */
export const Streaks: React.FC<{ t: number; n?: number; speed?: number; seed?: number; o?: number }> = ({ t, n = 18, speed = 90, seed = 5, o = 0.35 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const len = 160 + rnd(seed, i) * 380;
      const x = 2100 - ((t * speed * (0.6 + rnd(seed + 1, i)) + rnd(seed + 2, i) * 2600) % 2800);
      return <rect key={i} x={x} y={40 + rnd(seed + 3, i) * 1000} width={len} height={3} rx={1.5} fill="#EAF0FF" opacity={o * (0.4 + rnd(seed + 4, i) * 0.6)} />;
    })}
  </g>
);
