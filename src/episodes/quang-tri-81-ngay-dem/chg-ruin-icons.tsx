import React from 'react';
import { clamp, hash } from '../../countryball/fx-math';

// Chapter G icons: three buildings (house, school, church) that crumble into rubble as d goes 0 -> 1, and a tiny search
// team (three small figures with hats, no faces) used in the "tìm kiếm hài cốt" beats. No people drawn in the ruins.

const INK = '#141414';
type Kind = 'house' | 'school' | 'church';

/** Building standing on (x, y) = ground centre. d 0..1 crumbling: walls shorten into a jagged top, the roof / spire drops and tilts. id must be unique. */
export const RuinBuilding: React.FC<{ id: string; kind: Kind; x: number; y: number; d: number; s?: number; seed?: number }> = ({ id, kind, x, y, d, s = 1, seed = 1 }) => {
  const W = kind === 'house' ? 230 : kind === 'school' ? 380 : 210, H = kind === 'house' ? 150 : kind === 'school' ? 150 : 180;
  const wall = kind === 'house' ? '#C9A66B' : kind === 'school' ? '#D8CDB0' : '#DAD3C4', cols = Math.round(W / 22);
  const top = Array.from({ length: cols + 1 }, (_, i) => {
    const cut = clamp(d * (0.35 + 0.65 * hash(i, seed)) * 1.15);
    return `${(-W / 2 + (i * W) / cols).toFixed(1)},${(-H * (1 - 0.78 * cut)).toFixed(1)}`;
  });
  const roofDrop = clamp(d * 1.4), fade = 1 - clamp((d - 0.7) / 0.3) * 0.25;
  const rub = clamp(d * 1.3);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs><clipPath id={`${id}-cl`}><polygon points={`${-W / 2 - 4},4 ${top.join(' ')} ${W / 2 + 4},4`} /></clipPath></defs>
      <ellipse cx={0} cy={6} rx={W * 0.62} ry={14} fill="#000" opacity={0.3} />
      <g clipPath={`url(#${id}-cl)`}>
        <rect x={-W / 2} y={-H} width={W} height={H} fill={wall} stroke={INK} strokeWidth={5} />
        {kind === 'house' && <><rect x={-24} y={-84} width={48} height={84} fill="#6B4A2B" stroke={INK} strokeWidth={4} /><rect x={62} y={-100} width={52} height={46} fill="#9CC4DE" stroke={INK} strokeWidth={4} /><rect x={-114} y={-100} width={52} height={46} fill="#9CC4DE" stroke={INK} strokeWidth={4} /></>}
        {kind === 'school' && Array.from({ length: 5 }, (_, i) => <rect key={i} x={-165 + i * 70} y={-110} width={42} height={50} fill="#9CC4DE" stroke={INK} strokeWidth={4} />)}
        {kind === 'school' && <rect x={-30} y={-72} width={60} height={72} fill="#6B4A2B" stroke={INK} strokeWidth={4} />}
        {kind === 'church' && <><path d={`M-26,-60 Q-26,-100 0,-100 Q26,-100 26,-60 V0 H-26 Z`} fill="#5C6B7E" stroke={INK} strokeWidth={4} /><circle cx={0} cy={-138} r={15} fill="#9CC4DE" stroke={INK} strokeWidth={4} /></>}
      </g>
      {/* roof / spire falls and tilts as the walls give way */}
      <g transform={`translate(${roofDrop * (kind === 'church' ? 18 : -24)},${roofDrop * H * 0.7}) rotate(${roofDrop * (kind === 'church' ? 38 : -28)},0,${-H})`} opacity={fade}>
        {kind === 'house' && <polygon points={`${-W / 2 - 20},${-H} 0,${-H - 95} ${W / 2 + 20},${-H}`} fill="#8E3B2E" stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
        {kind === 'school' && <polygon points={`${-W / 2 - 14},${-H} ${-W / 2 + 36},${-H - 46} ${W / 2 - 36},${-H - 46} ${W / 2 + 14},${-H}`} fill="#A8473A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
        {kind === 'church' && <g><rect x={-52} y={-H - 70} width={104} height={70} fill={wall} stroke={INK} strokeWidth={5} /><polygon points={`-64,${-H - 70} 0,${-H - 190} 64,${-H - 70}`} fill="#5C6B7E" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d={`M0,${-H - 190} v-38 M-14,${-H - 212} h28`} stroke={INK} strokeWidth={7} strokeLinecap="round" /></g>}
      </g>
      {/* rubble heap grows */}
      {rub > 0.02 && (
        <g>
          <path d={`M${-W * 0.55},8 Q${-W * 0.3},${-H * 0.5 * rub} 0,${-H * 0.38 * rub} Q${W * 0.32},${-H * 0.5 * rub} ${W * 0.55},8 Z`} fill="#6A5A48" stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={clamp(rub * 2)} />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={(hash(i, seed + 3) - 0.5) * W * 0.9} y={-hash(i, seed + 4) * H * 0.34 * rub} width={16 + hash(i, 6) * 20} height={10 + hash(i, 7) * 12} fill={i % 2 ? '#B9774D' : '#8C7B66'} stroke={INK} strokeWidth={2.5} transform={`rotate(${(hash(i, 8) - 0.5) * 70})`} opacity={clamp(rub * 2 - 0.4)} />)}
        </g>
      )}
    </g>
  );
};

/** Small search team: three little figures (round heads, hats, no faces) with a shovel line; (x, y) = feet centre. */
export const TeamIcon: React.FC<{ x: number; y: number; s?: number; t?: number; color?: string }> = ({ x, y, s = 1, t = 0, color = '#3F5A3A' }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={12} fill="#000" opacity={0.3} />
    {[-70, 0, 70].map((dx, i) => {
      const bob = Math.sin(t * 0.18 + i * 1.7) * 3;
      return (
        <g key={i} transform={`translate(${dx},${bob})`}>
          <path d="M-26,0 Q-26,-62 0,-66 Q26,-62 26,0 Z" fill={color} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
          <circle cx={0} cy={-88} r={20} fill="#E3BE98" stroke={INK} strokeWidth={4.5} />
          <path d="M-30,-96 Q0,-134 30,-96 Z" fill="#6B7A3A" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
          {i === 1 && <path d="M30,-30 L74,-92" stroke="#8C7B66" strokeWidth={6} strokeLinecap="round" />}
        </g>
      );
    })}
  </g>
);

/** A small house with a lit window (the family). (x, y) = ground centre. */
export const HomeIcon: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={150} ry={14} fill="#000" opacity={0.3} />
    <rect x={-110} y={-130} width={220} height={130} fill="#C9A66B" stroke={INK} strokeWidth={5} />
    <polygon points="-136,-130 0,-225 136,-130" fill="#8E3B2E" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-22} y={-78} width={44} height={78} fill="#6B4A2B" stroke={INK} strokeWidth={4} />
    <rect x={44} y={-100} width={46} height={42} fill={glow > 0.5 ? '#FFD27A' : '#6F8AA3'} stroke={INK} strokeWidth={4} />
    <rect x={-90} y={-100} width={46} height={42} fill={glow > 0.5 ? '#FFD27A' : '#6F8AA3'} stroke={INK} strokeWidth={4} />
  </g>
);
