import React from 'react';
import { Ball } from '../../countryball/countryball';
import { NonLa } from '../../countryball/ball-accessories';
import { MuCoi } from '../../countryball/ball-accessories';
import { hop } from '../../countryball/ball-motion';
import { FlagCloth } from '../../countryball/flag-cloth';
import { hash } from '../../countryball/fx-math';
import { TodayFacade } from './chh-common';

// Chapter H parade 2025 on đường Lê Duẩn: a perspective avenue with the Dinh at its end (national flag), flag garlands between the trees and
// rows of VNM balls marching TOWARDS the camera with small flags (no weapons, no vehicles firing). Pure function of t (frames).
// Used by H16 (day) and H17 (night, fireworks added by the shot). 30.04.2025 = 50 years.

const HORIZON = 430, ROAD_H = 650;
/** Screen y and scale for depth u in 0..1 (0 = horizon, 1 = bottom of the frame). */
const depth = (u: number) => ({ y: HORIZON + ROAD_H * Math.pow(u, 1.5), k: 0.12 + 0.95 * Math.pow(u, 1.5) });
const halfRoad = (y: number) => 110 + ((y - HORIZON) / ROAD_H) * 1250;

const Tree: React.FC<{ x: number; y: number; k: number; dark: boolean }> = ({ x, y, k, dark }) => (
  <g transform={`translate(${x},${y}) scale(${k})`}>
    <rect x={-10} y={-190} width={20} height={190} fill={dark ? '#2A2218' : '#6B4F32'} />
    <circle cx={0} cy={-250} r={110} fill={dark ? '#1C3A26' : '#3F8A3E'} /><circle cx={-70} cy={-200} r={80} fill={dark ? '#1A3322' : '#4B9A47'} /><circle cx={72} cy={-205} r={82} fill={dark ? '#1A3322' : '#4B9A47'} />
  </g>
);

const BALLS: { lane: number; row: number; hat: number }[] = Array.from({ length: 20 }, (_, i) => ({ lane: [-0.75, -0.28, 0.28, 0.75][i % 4], row: Math.floor(i / 4), hat: i % 3 }));

export const ParadeAvenue: React.FC<{ id: string; t: number; night?: boolean; speed?: number }> = ({ id, t, night = false, speed = 0.0042 }) => {
  const sky = night ? ['#070D1C', '#24365C'] : ['#8EC3E8', '#E5F2FA'], road = night ? '#2A2E38' : '#6E727C';
  const garland = (yy: number, k: number) => (
    <g>
      <path d={`M0,${yy} Q960,${yy + 120 * k} 1920,${yy}`} fill="none" stroke="#1B1B1E" strokeWidth={3} />
      {Array.from({ length: 22 }, (_, i) => {
        const u = (i + 0.5) / 22, x = u * 1920, y = yy + 120 * k * 2 * u * (1 - u) + 0;
        return <polygon key={i} points={`${x - 16},${y} ${x + 16},${y} ${x},${y + 36}`} fill={i % 2 ? '#FFD43B' : '#DA251D'} stroke="#1B1B1E" strokeWidth={2} />;
      })}
    </g>
  );
  // balls sorted far -> near
  const items = BALLS.map((b, i) => {
    const u = ((b.row * 0.2 + t * speed + hash(i, 3) * 0.05) % 1 + 1) % 1, d = depth(u);
    return { ...b, i, u, ...d, x: 960 + b.lane * halfRoad(d.y) * 0.85 };
  }).sort((a, b) => a.u - b.u);
  return (
    <g>
      <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
      <rect width={1920} height={HORIZON + 20} fill={`url(#${id}-sky)`} />
      <rect y={HORIZON} width={1920} height={1080 - HORIZON} fill={night ? '#1B2A22' : '#7FA652'} />
      <polygon points={`${960 - 110},${HORIZON} ${960 + 110},${HORIZON} ${960 + 1360},1080 ${960 - 1360},1080`} fill={road} />
      <line x1={960} y1={HORIZON} x2={960} y2={1080} stroke="#F4EFDC" strokeWidth={6} strokeDasharray="34 40" strokeDashoffset={-t * 3} opacity={0.7} />
      <TodayFacade id={`${id}-pal`} x={960} y={HORIZON + 14} w={560} tone={night ? 'night' : 'day'} t={t} backdrop={false} windows={0.85} />
      {[0.12, 0.26, 0.45, 0.72].map((u, j) => { const d = depth(u), hw = halfRoad(d.y); return (
        <g key={j}><Tree x={960 - hw - 60 * d.k} y={d.y} k={d.k * 0.9} dark={night} /><Tree x={960 + hw + 60 * d.k} y={d.y} k={d.k * 0.9} dark={night} /></g>
      ); })}
      {garland(205, 1)}{garland(150, 0.7)}
      {night && <rect width={1920} height={1080} fill="#050A14" opacity={0.28} />}
      {items.map(({ i, x, y, k, hat, u }) => {
        const r = 112 * k, pole = r * 2.5, o = Math.min(1, u / 0.08);
        return (
          <g key={i} opacity={o}>
            <line x1={x + r * 0.9} y1={y} x2={x + r * 0.9} y2={y - pole} stroke="#1B1B1E" strokeWidth={Math.max(2, 5 * k)} strokeLinecap="round" />
            <FlagCloth id={`${id}-pf${i}`} x={x + r * 0.9 + 1} y={y - pole} w={r * 1.2} h={r * 0.8} kind="VNM" wave={0.8} t={t + i * 5} />
            <Ball id={`${id}-pb${i}`} x={x} y={y - r} r={r} flag="VNM" eyes="happy" hat={hat === 0 ? <NonLa /> : hat === 1 ? <MuCoi /> : undefined} motion={hop(t, 26, r * 0.35, i * 7)} shadow />
          </g>
        );
      })}
    </g>
  );
};
