import React from 'react';
import { backOut, clamp, hash, prog } from '../../countryball/fx-math';
import { Glow } from '../../countryball/fx-glow';
import { FONT } from '../../engine/fonts';

// Chapter F icons: respectful person silhouette + name card, candle, Soyuz rocket, hero medal, star field, radio icon.
// All pure functions of their props; `t` is in FRAMES (30 fps) unless the name says seconds.

/** Plain head-and-shoulders silhouette (no likeness). Centre of the head at (x, y), s = scale. */
export const Silhouette: React.FC<{ x: number; y: number; s?: number; cap?: boolean; fill?: string }> = ({ x, y, s = 1, cap = false, fill = '#27384D' }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-62,92 Q-62,40 -26,30 L26,30 Q62,40 62,92 Z" fill={fill} />
    <circle cx={0} cy={-8} r={34} fill={fill} />
    {cap && <path d="M-36,-14 Q-36,-54 0,-54 Q36,-54 36,-14 Z" fill="#3A5068" />}
  </g>
);

/** Name card that pops in at frame `at`: silhouette, big name, one small line. Centre (x, y). */
export const NameCard: React.FC<{ t: number; at?: number; x: number; y: number; name: string; sub: string; cap?: boolean; accent?: string; w?: number }> = ({
  t, at = 0, x, y, name, sub, cap = true, accent = '#C9343A', w = 820,
}) => {
  const k = backOut(prog(t, at, at + 10));
  if (k <= 0.01) return null;
  const h = 250;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <rect x={-w / 2 + 10} y={-h / 2 + 18} width={w} height={h} rx={26} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill="#F6F2E7" stroke="#CFC8B6" strokeWidth={4} />
      <rect x={-w / 2} y={-h / 2} width={18} height={h} rx={9} fill={accent} />
      <circle cx={-w / 2 + 130} cy={0} r={92} fill="#DCE3EA" />
      <clipPath id={`nc-${name.length}-${x}`}><circle cx={-w / 2 + 130} cy={0} r={92} /></clipPath>
      <g clipPath={`url(#nc-${name.length}-${x})`}><Silhouette x={-w / 2 + 130} y={-6} s={1.35} cap={cap} /></g>
      <circle cx={-w / 2 + 130} cy={0} r={92} fill="none" stroke="#27384D" strokeWidth={5} />
      <text x={-w / 2 + 260} y={-6} fontFamily={FONT.title} fontWeight={800} fontSize={name.length > 13 ? 56 : 66} fill="#1B1A17">{name}</text>
      <text x={-w / 2 + 262} y={62} fontFamily={FONT.hand} fontSize={42} fill="#5A5348">{sub}</text>
    </g>
  );
};

/** Candle with a flickering flame and warm glow; (x, y) = base of the candle. */
export const Candle: React.FC<{ t: number; x: number; y: number; s?: number; o?: number }> = ({ t, x, y, s = 1, o = 1 }) => {
  const fl = 1 + 0.08 * Math.sin(t * 0.9) + 0.05 * Math.sin(t * 2.3 + 1), sway = Math.sin(t * 0.37) * 3;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
      <Glow x={0} y={-150} r={210 * fl} color="#FFB347" o={0.55} />
      <rect x={-26} y={-120} width={52} height={120} rx={6} fill="#F2E8D0" stroke="#15181F" strokeWidth={4} />
      <rect x={-26} y={-120} width={16} height={120} rx={6} fill="#FFFFFF" opacity={0.35} />
      <path d="M-22,-120 Q-8,-104 0,-118 Q10,-100 22,-120" fill="#F2E8D0" />
      <line x1={0} y1={-120} x2={0} y2={-134} stroke="#15181F" strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(${sway * 0.4},-134) scale(${fl},${fl * 1.05})`}>
        <path d="M0,-58 Q22,-26 14,-6 Q0,6 -14,-6 Q-22,-26 0,-58 Z" fill="#FFB02E" />
        <path d="M0,-34 Q10,-16 6,-6 Q0,0 -6,-6 Q-10,-16 0,-34 Z" fill="#FFF3B0" />
      </g>
    </g>
  );
};

/** Seeded star field covering the screen. */
export const StarField: React.FC<{ t: number; n?: number; drift?: number }> = ({ t, n = 90, drift = 0.15 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = (hash(i, 1) * 2000 - 40 - t * drift * (0.3 + hash(i, 4))) % 1960, y = hash(i, 2) * 1080;
      return <circle key={i} cx={x < -20 ? x + 1960 : x} cy={y} r={1.2 + hash(i, 3) * 2.4} fill="#FFFFFF" opacity={0.45 + 0.4 * Math.sin(t * 0.08 + i)} />;
    })}
  </g>
);

/** Soyuz rocket pointing up, 100 units tall at s = 1, base at (x, y); flame length `fl` (px at s = 1). */
export const Soyuz: React.FC<{ x: number; y: number; s?: number; fl?: number; t?: number }> = ({ x, y, s = 1, fl = 0, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {fl > 0 && (
      <g>
        <Glow x={0} y={30} r={fl * 1.1} color="#FF9A2E" o={0.7} />
        <path d={`M-16,0 Q0,${fl * (1 + 0.1 * Math.sin(t))} 16,0 Z`} fill="#FFB02E" />
        <path d={`M-8,0 Q0,${fl * 0.62} 8,0 Z`} fill="#FFF3B0" />
      </g>
    )}
    <g stroke="#15181F" strokeWidth={3.2} strokeLinejoin="round">
      {[-1, 1].map((k) => <path key={k} d={`M${k * 14},-10 L${k * 34},-6 L${k * 30},-120 Q${k * 24},-170 ${k * 14},-182 Z`} fill="#E6E8EA" />)}
      <path d="M-14,0 L-14,-186 Q0,-250 14,-186 L14,0 Z" fill="#F4F5F6" />
      <path d="M-14,-150 L14,-150 L14,-186 Q0,-250 -14,-186 Z" fill="#D9DCDF" />
      <path d="M-30,-8 L-48,22 L-14,0 Z M30,-8 L48,22 L14,0 Z" fill="#C9343A" />
    </g>
    <polygon points="0,-128 5,-114 20,-114 8,-105 13,-90 0,-99 -13,-90 -8,-105 -20,-114 -5,-114" fill="#C9343A" transform="scale(0.5) translate(0,-120)" />
  </g>
);

/** Hero medal: gold five-point star on a red disc and ribbon. Centre (x, y), radius r. */
export const Medal: React.FC<{ x: number; y: number; r?: number; t?: number }> = ({ x, y, r = 120, t = 0 }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.42 : r;
    return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
  }).join(' ');
  const shine = 0.5 + 0.5 * Math.sin(t * 0.12);
  return (
    <g transform={`translate(${x},${y})`}>
      <Glow x={0} y={0} r={r * 2.2} color="#FFD166" o={0.28 + 0.12 * shine} />
      <path d={`M${-r * 0.5},${-r * 1.9} L${-r * 0.1},${-r * 0.5} L${r * 0.5},${-r * 0.5} L${r * 0.15},${-r * 1.9} Z`} fill="#C9343A" stroke="#15181F" strokeWidth={4} />
      <circle r={r * 1.18} fill="#C9343A" stroke="#15181F" strokeWidth={6} />
      <circle r={r * 1.04} fill="none" stroke="#FFD166" strokeWidth={5} />
      <polygon points={pts} fill="#FFCD00" stroke="#15181F" strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
};

/** Radio set with waves; `slash` 0..1 draws the red "no signal" bar across it. */
export const RadioIcon: React.FC<{ x: number; y: number; s?: number; t: number; slash: number }> = ({ x, y, s = 1, t, slash }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <line x1={50} y1={-40} x2={96} y2={-120} stroke="#15181F" strokeWidth={14} strokeLinecap="round" />
    <line x1={50} y1={-40} x2={96} y2={-120} stroke="#8892A0" strokeWidth={7} strokeLinecap="round" />
    <rect x={-110} y={-50} width={220} height={130} rx={22} fill="#4A5A44" stroke="#15181F" strokeWidth={8} />
    <circle cx={-50} cy={15} r={34} fill="#222B20" stroke="#15181F" strokeWidth={5} />
    <rect x={10} y={-22} width={70} height={22} rx={5} fill="#C9D6B8" />
    {[0, 1, 2].map((i) => <circle key={i} cx={34 + i * 22} cy={44} r={7} fill="#15181F" />)}
    {[0, 1, 2].map((i) => {
      const a = clamp(1 - slash * 1.2) * (0.35 + 0.65 * Math.max(0, Math.sin(t * 0.18 - i * 0.9)));
      return <path key={i} d={`M${112 + i * 26},-140 Q${136 + i * 26},-112 ${112 + i * 26},-84`} fill="none" stroke="#FFD166" strokeWidth={9} strokeLinecap="round" opacity={a} />;
    })}
    {slash > 0 && <line x1={-140} y1={-110} x2={-140 + 300 * slash} y2={-110 + 250 * slash} stroke="#E8353B" strokeWidth={22} strokeLinecap="round" />}
  </g>
);
