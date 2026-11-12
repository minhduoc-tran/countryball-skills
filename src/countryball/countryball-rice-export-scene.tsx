import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT } from '../engine/fonts';
import { Ball, NonLa } from './countryball';
import { Counter, DateChip, geo, Islands, MiniMap, RegionMap } from './countryball-map-ui';

// Countryball still: Vietnam ships rice to the Philippines in 2024 (9.18 million tonnes exported that year, a
// record; the Philippines was the largest buyer). Thailand, the rival exporter, watches; Laos and Cambodia cheer.

const COLORS: Record<string, string> = { VNM: '#C8573F', LAO: '#C59A55', KHM: '#5F9C80', THA: '#5C79A8', PHL: '#D3A23F', MYS: '#7F8F63' };

const RiceSack: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-40,-46 Q-48,-62 -30,-66 L30,-66 Q48,-62 40,-46 Q58,10 44,44 Q0,58 -44,44 Q-58,10 -40,-46 Z"
      fill="#E9DCC0" stroke="#111" strokeWidth={4} strokeLinejoin="round" />
    <path d="M-30,-66 Q0,-54 30,-66" fill="none" stroke="#8C6F3E" strokeWidth={5} />
    <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#B23A2E">GẠO</text>
  </g>
);

const RiceBowl: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-50,-8 Q-46,-52 0,-54 Q46,-52 50,-8 Z" fill="#FAFAF5" stroke="#111" strokeWidth={4} />
    {[-24, -6, 14, 30].map((k, i) => <ellipse key={k} cx={k} cy={-22 - (i % 2) * 12} rx={5} ry={3} fill="#E7E3D6" />)}
    <path d="M-58,-8 L58,-8 Q50,40 0,42 Q-50,40 -58,-8 Z" fill="#2E6FB0" stroke="#111" strokeWidth={4} strokeLinejoin="round" />
    <path d="M-40,8 Q0,18 40,8" fill="none" stroke="#FFF" strokeWidth={4} opacity={0.7} />
    {[-18, 6, 28].map((k) => <path key={k} d={`M${k},-62 q-10,-16 0,-30 q10,-14 0,-28`} fill="none" stroke="#FFF" strokeWidth={4} opacity={0.6} strokeLinecap="round" />)}
  </g>
);

// Thick curved shipping arrow (blue with a white rim, like the reference), with a triangular head.
const Arrow: React.FC<{ from: [number, number]; via: [number, number]; to: [number, number] }> = ({ from, via, to }) => {
  const d = `M${from[0]},${from[1]} Q${via[0]},${via[1]} ${to[0]},${to[1]}`;
  const a = Math.atan2(to[1] - via[1], to[0] - via[0]) * (180 / Math.PI);
  return (
    <g>
      <path d={d} fill="none" stroke="#EAF3FF" strokeWidth={26} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#2F7FD8" strokeWidth={16} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#7DB8F5" strokeWidth={5} strokeLinecap="round" strokeDasharray="2 22" />
      <g transform={`translate(${to[0]},${to[1]}) rotate(${a})`}>
        <polygon points="18,0 -30,-30 -30,30" fill="#2F7FD8" stroke="#EAF3FF" strokeWidth={6} strokeLinejoin="round" />
      </g>
    </g>
  );
};

export const CountryballRiceExport: React.FC = () => {
  const [vx, vy] = geo(108.6, 14.8), [px, py] = geo(121.3, 15.6), [tx, ty] = geo(100.6, 15.4);
  const [lx, ly] = geo(103.2, 19.6), [kx, ky] = geo(104.6, 12.3);
  const [sx, sy] = geo(116.4, 11.6);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <RegionMap colors={COLORS} />
        <text x={sx} y={sy} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={34} fill="#5F86A6"
          letterSpacing={10} opacity={0.85}>BIỂN ĐÔNG</text>
        <Islands lon={112.0} lat={16.5} label="HOÀNG SA" color={COLORS.VNM} seed={1} />
        <Islands lon={114.3} lat={9.6} label="TRƯỜNG SA" color={COLORS.VNM} seed={3} />
        <Arrow from={[vx + 110, vy - 90]} via={[(vx + px) / 2, vy - 330]} to={[px - 120, py - 60]} />
        <RiceSack x={(vx + px) / 2 - 150} y={vy - 236} s={0.55} rot={-14} />
        <RiceSack x={(vx + px) / 2 + 150} y={vy - 230} s={0.55} rot={12} />
        <Ball id="lao" x={lx} y={ly} r={66} flag="LAO" eyes="happy" />
        <Ball id="khm" x={kx} y={ky} r={70} flag="KHM" eyes="normal" look={0.8} />
        <Ball id="tha" x={tx} y={ty} r={96} flag="THA" eyes="smug" look={1} sweat />
        <Ball id="phl" x={px} y={py} r={108} flag="PHL" eyes="happy" look={0.5} />
        <RiceBowl x={px - 70} y={py + 96} />
        <Ball id="vnm" x={vx} y={vy} r={124} flag="VNM" eyes="normal" look={0.7} hat={<NonLa />} />
        <RiceSack x={vx + 118} y={vy + 70} s={1.05} rot={8} />
        <DateChip label="2024" />
        <Counter value="9.180.000" unit="TẤN GẠO" />
        <MiniMap />
      </svg>
    </AbsoluteFill>
  );
};
