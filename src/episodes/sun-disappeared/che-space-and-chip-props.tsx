import React from 'react';
import { Stars, Glow, FONT, SCH, rnd } from '../../engine';

// Chapter E props: deep space with a small frosted Earth, a galaxy of drifting dots (schematic), the "08:20" chip.

/** Deep space: near-black navy, stars that twinkle and drift left slowly. */
export const DeepSpace: React.FC<{ t: number; id: string; drift?: number }> = ({ t, id, drift = 0.25 }) => (
  <g>
    <defs>
      <radialGradient id={`${id}sp`} cx="0.5" cy="0.5" r="0.8">
        <stop offset="0" stopColor="#0E1430" />
        <stop offset="1" stopColor="#03040C" />
      </radialGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1880} fill={`url(#${id}sp)`} />
    <g transform={`translate(${-t * drift} 0)`}>
      <Stars seed={5} x0={-200} y0={-200} w={2900} h={1500} t={t} n={150} o={0.9} />
    </g>
  </g>
);

/** A dark, frosted Earth: ocean in deep blue, frost caps and patches, a few orange city lights on the night side. */
export const FrozenEarth: React.FC<{ x: number; y: number; r: number; t: number; id: string; spin?: number }> = ({ x, y, r, t, id, spin = 0.4 }) => {
  const lights = Array.from({ length: 22 }).map((_, i) => {
    const a = rnd(3, i) * Math.PI * 2;
    const d = Math.sqrt(rnd(4, i)) * r * 0.78;
    return { cx: x + Math.cos(a) * d, cy: y + Math.sin(a) * d, o: 0.5 + 0.5 * Math.sin(t / 7 + i * 2.1) * 0.5 + 0.25 };
  });
  const sh = ((t * spin) % 40) - 20;
  return (
    <g>
      <defs>
        <clipPath id={`${id}clip`}><circle cx={x} cy={y} r={r} /></clipPath>
        <radialGradient id={`${id}g`} cx="0.3" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#3A5A86" />
          <stop offset="0.55" stopColor="#1B2C4E" />
          <stop offset="1" stopColor="#070C1C" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 1.18} fill="#5FA0E8" opacity={0.12} />
      <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id}clip)`}>
        <g transform={`translate(${sh} 0)`}>
          <path d={`M ${x - r * 0.6} ${y - r * 0.2} q ${r * 0.25} ${-r * 0.35} ${r * 0.5} ${-r * 0.1} q ${r * 0.1} ${r * 0.3} ${-r * 0.2} ${r * 0.45} q ${-r * 0.3} ${r * 0.05} ${-r * 0.3} ${-r * 0.35} Z`} fill="#26364A" />
          <path d={`M ${x + r * 0.1} ${y + r * 0.1} q ${r * 0.3} ${-r * 0.2} ${r * 0.5} ${r * 0.05} q ${r * 0.05} ${r * 0.3} ${-r * 0.25} ${r * 0.4} q ${-r * 0.3} ${-r * 0.05} ${-r * 0.25} ${-r * 0.45} Z`} fill="#26364A" />
        </g>
        <ellipse cx={x} cy={y - r * 0.95} rx={r * 0.8} ry={r * 0.32} fill="#DCEBFA" opacity={0.85} />
        <ellipse cx={x} cy={y + r * 0.97} rx={r * 0.7} ry={r * 0.26} fill="#DCEBFA" opacity={0.8} />
        {[[-0.4, -0.5], [0.45, -0.2], [-0.1, 0.55], [0.3, 0.6]].map(([a, b], i) => (
          <ellipse key={i} cx={x + a * r} cy={y + b * r} rx={r * 0.24} ry={r * 0.1} fill="#E8F4FF" opacity={0.5} />
        ))}
        {lights.map((l, i) => (
          <circle key={i} cx={l.cx} cy={l.cy} r={Math.max(2, r * 0.022)} fill="#FFB15A" opacity={l.o} />
        ))}
        <circle cx={x + r * 0.3} cy={y + r * 0.2} r={r * 1.1} fill="#02030A" opacity={0.0} />
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#9FD0FF" strokeWidth={Math.max(1.5, r * 0.02)} opacity={0.35} />
      <Glow x={x - r * 0.4} y={y - r * 0.4} r={r * 0.9} kind="cool" o={0.1} />
    </g>
  );
};

/** A spiral galaxy of dots on log-spiral arms, turning slowly. `n` stars per arm. */
export const GalaxyDots: React.FC<{ cx: number; cy: number; R: number; t: number; n?: number; tilt?: number; color?: string }> = ({ cx, cy, R, t, n = 90, tilt = 0.5, color = '#CFE0FF' }) => {
  const rot = t * 0.0035;
  const dots: React.ReactNode[] = [];
  for (let arm = 0; arm < 3; arm++) {
    for (let i = 0; i < n; i++) {
      const k = i / n;
      const rr = 14 + k * R;
      const ang = rot + arm * ((Math.PI * 2) / 3) + k * 4.4 + (rnd(arm + 2, i) - 0.5) * 0.45;
      const px = cx + Math.cos(ang) * rr * (1 + (rnd(8, i + arm * 99) - 0.5) * 0.12);
      const py = cy + Math.sin(ang) * rr * tilt;
      dots.push(<circle key={`${arm}-${i}`} cx={px} cy={py} r={2.2 + rnd(arm, i) * 3.4 * (1 - k * 0.5)} fill={color} opacity={0.35 + 0.6 * (1 - k) * rnd(5, i)} />);
    }
  }
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={R * 0.26} ry={R * 0.26 * tilt * 1.2} fill="#FFE2A8" opacity={0.18} />
      <ellipse cx={cx} cy={cy} rx={R * 0.14} ry={R * 0.14 * tilt * 1.2} fill="#FFF3DC" opacity={0.7} />
      {dots}
    </g>
  );
};

/** The countdown chip drawn locally (the `countdown` look is chapter A's): sun dot + "MM:SS", at the right/top by default. */
export const CountChip: React.FC<{ x?: number; y?: number; text: string; s?: number; pulse?: number }> = ({ x = 1640, y = 96, text, s = 1, pulse = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * (1 + pulse * 0.08)})`}>
    <rect x={-170} y={-46} width={340} height={92} rx={46} fill="#120B24" opacity={0.72} />
    <circle cx={-120} cy={0} r={22} fill="#FFC85A" />
    <text x={30} y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill="#FFE2A8" letterSpacing={3}>{text}</text>
  </g>
);

export { SCH };
