import React from 'react';
import { hash } from './fx-math';

// Faceless flat people silhouettes for the Tây Nam props (street life, school, farewell trucks). Screen px; (x, y) = feet on the ground,
// h = height in px; t in FRAMES drives the walk / wave cycle (pure). Nothing graphic: people stand, walk, wave, carry baskets.
//   <Person x y h? pose? t? color? hat? facing? seed? />   pose 'stand' | 'walk' | 'wave' | 'carry' (shoulder pole with two baskets)
//   <Crowd x y w n h? t? seed? colors? walking? />          a deterministic row of people spread over w px (walkers wrap at the row ends)

export type PersonPose = 'stand' | 'walk' | 'wave' | 'carry';
const SKIN = ['#6B4A3A', '#7A5642', '#5E4032'];

export const Person: React.FC<{ x: number; y: number; h?: number; pose?: PersonPose; t?: number; color?: string; hat?: 'none' | 'cone' | 'krama' | 'helmet'; facing?: 1 | -1; seed?: number }> = ({
  x, y, h = 120, pose = 'stand', t = 0, color = '#3A4A63', hat = 'none', facing = 1, seed = 0,
}) => {
  const u = h / 100, ph = t * 0.22 + seed * 1.7, sw = pose === 'walk' ? Math.sin(ph) * 14 : 0, bob = pose === 'walk' ? Math.abs(Math.cos(ph)) * 1.5 : 0;
  const skin = SKIN[seed % 3], wave = pose === 'wave' ? Math.sin(t * 0.35 + seed) * 18 : 0;
  const leg = (a: number) => <line x1={0} y1={-46} x2={Math.sin((a * Math.PI) / 180) * 46} y2={-46 + Math.cos((a * Math.PI) / 180) * 46} stroke="#24262E" strokeWidth={9} strokeLinecap="round" />;
  return (
    <g transform={`translate(${x},${y - bob * u}) scale(${u * facing},${u})`}>
      <ellipse cx={0} cy={bob + 1} rx={18} ry={4} fill="#000" opacity={0.22} />
      {leg(sw)}{leg(-sw)}
      <path d="M-13,-48 L-15,-82 Q0,-92 15,-82 L13,-48 Z" fill={color} />
      {pose === 'wave' ? <line x1={10} y1={-82} x2={22 + wave * 0.3} y2={-108} stroke={color} strokeWidth={8} strokeLinecap="round" /> : <line x1={12} y1={-80} x2={16 - sw * 0.5} y2={-54} stroke={color} strokeWidth={8} strokeLinecap="round" />}
      <line x1={-12} y1={-80} x2={-16 + sw * 0.5} y2={-54} stroke={color} strokeWidth={8} strokeLinecap="round" />
      {pose === 'wave' && <circle cx={22 + wave * 0.3} cy={-110} r={5} fill={skin} />}
      <circle cx={0} cy={-96} r={11} fill={skin} />
      {hat === 'cone' && <path d="M-20,-99 L0,-116 L20,-99 Z" fill="#E5CF96" stroke="#8C7440" strokeWidth={1.5} />}
      {hat === 'krama' && <path d="M-12,-100 Q0,-112 12,-100 L12,-96 L-12,-96 Z M10,-100 L18,-90 L14,-88 Z" fill="#C8302C" />}
      {hat === 'helmet' && <path d="M-13,-98 Q0,-112 13,-98 L15,-96 L-15,-96 Z" fill="#5C6A30" />}
      {pose === 'carry' && <g><line x1={-34} y1={-84} x2={34} y2={-84} stroke="#8C6A3A" strokeWidth={4} /><path d="M-40,-60 L-28,-60 L-26,-44 L-42,-44 Z M28,-60 L40,-60 L42,-44 L26,-44 Z" fill="#B88A4A" stroke="#5A4020" strokeWidth={2} /><path d="M-34,-84 V-60 M34,-84 V-60" stroke="#5A4020" strokeWidth={1.5} /></g>}
    </g>
  );
};

export const Crowd: React.FC<{ x: number; y: number; w: number; n: number; h?: number; t?: number; seed?: number; colors?: string[]; walking?: boolean; hats?: boolean }> = ({
  x, y, w, n, h = 110, t = 0, seed = 1, colors = ['#3A4A63', '#7A3B3B', '#3F6B4A', '#6B5B8C', '#A0703A', '#2F5F7A'], walking = false, hats = true,
}) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      // walkers drift at their own speed and wrap 100 px beyond both ends of the row (the jump happens outside [x - w/2, x + w/2])
      const r = hash(i, seed), b0 = ((i + 0.5) / n) * w + (hash(i, seed + 3) - 0.5) * (w / n) * 0.6;
      const dir = walking ? (hash(i, seed + 5) > 0.5 ? 1 : -1) : 1, span = w + 200, drift = walking ? dir * t * (0.5 + r) : 0;
      const px = x - w / 2 - 100 + ((((b0 + 100 + drift) % span) + span) % span);
      return <Person key={i} x={px} y={y + (hash(i, seed + 7) - 0.5) * 10} h={h * (0.8 + 0.35 * r)} pose={walking ? 'walk' : 'stand'} t={t} color={colors[i % colors.length]}
        hat={hats ? (['none', 'cone', 'krama', 'none'] as const)[i % 4] : 'none'} facing={dir as 1 | -1} seed={i} />;
    })}
  </g>
);
