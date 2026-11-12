import React from 'react';
import { FlagKind, FlagCloth } from '../../countryball/flag-cloth';
import { FONT } from '../../engine';
import { mix } from '../../countryball/map-context';
import { hash, lerp } from '../../countryball/fx-math';
import { INK } from './chg-common';

// Chapter G scene pieces (pure SVG, screen px): shophouse with flags, skyline with the twin-tower church, perspective road toward the sunrise,
// four "life goes on" tiles (school / market / church / port), a small house, an empty chair + framed portrait, a fast day/night sky.

/** Hand-planted flag on a short pole (cloth waves with t). */
export const PoleFlag: React.FC<{ id: string; x: number; y: number; kind: FlagKind; w?: number; t?: number; h?: number }> = ({ id, x, y, kind, w = 70, t = 0, h = 90 }) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y - h} stroke={INK} strokeWidth={4} strokeLinecap="round" />
    <FlagCloth id={id} x={x + 1} y={y - h} w={w} h={w * 0.66} kind={kind} wave={0.7} t={t} />
  </g>
);

/** Shophouse front with a 3x3 window grid (positions: see `windowXY`). */
export const Shophouse: React.FC<{ id: string; x: number; y: number; w: number; h: number; color: string; roof?: string; lit?: boolean; shutter?: boolean }> = ({
  id, x, y, w, h, color, roof = '#7A4A3A', lit = false, shutter = false,
}) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} fill={color} stroke={INK} strokeWidth={5} />
    <path d={`M${x - 10},${y - h} L${x + w / 2},${y - h - 50} L${x + w + 10},${y - h} Z`} fill={roof} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {Array.from({ length: 6 }, (_, i) => {
      const [wx, wy] = windowXY(x, y, w, h, i);
      return <rect key={`${id}w${i}`} x={wx - w * 0.09} y={wy} width={w * 0.18} height={h * 0.16} fill={lit ? '#FFD98A' : '#2F4455'} stroke={INK} strokeWidth={4} />;
    })}
    <rect x={x + w * 0.3} y={y - h * 0.26} width={w * 0.4} height={h * 0.26} fill={shutter ? '#6F7C86' : '#3A2A1E'} stroke={INK} strokeWidth={4} />
    {shutter && [0.05, 0.11, 0.17, 0.23].map((q) => <line key={q} x1={x + w * 0.3} x2={x + w * 0.7} y1={y - h * q} y2={y - h * q} stroke={INK} strokeWidth={2.5} opacity={0.6} />)}
  </g>
);
/** Centre-top of window i (0..5: two rows of three) of a Shophouse. */
export const windowXY = (x: number, y: number, w: number, h: number, i: number): [number, number] => [x + w * (0.2 + 0.3 * (i % 3)), y - h * (0.88 - 0.3 * Math.floor(i / 3))];

/** City skyline silhouette with the twin-tower cathedral, `lit` 0..1 = share of lit windows. Ground line at y. */
export const Skyline: React.FC<{ id: string; y: number; lit?: number; color?: string; seed?: number }> = ({ id, y, lit = 0.5, color = '#1D2B3D', seed = 3 }) => (
  <g>
    {Array.from({ length: 22 }, (_, i) => {
      const w = 96 + hash(i, seed) * 70, h = 90 + hash(i, seed + 1) * 150, x = -40 + i * 92;
      return (
        <g key={`${id}b${i}`}>
          <rect x={x} y={y - h} width={w} height={h} fill={color} stroke={INK} strokeWidth={4} />
          {Array.from({ length: 12 }, (_, j) => <rect key={j} x={x + 14 + (j % 3) * 26} y={y - h + 20 + Math.floor(j / 3) * 40} width={14} height={20} fill="#FFD98A" opacity={hash(i * 13 + j, 7) < lit ? 0.85 : 0.12} />)}
        </g>
      );
    })}
    <g transform={`translate(1180,${y}) scale(0.95)`}>
      <rect x={-150} y={-240} width={300} height={240} fill="#9B5A44" stroke={INK} strokeWidth={5} />
      {[-150, 80].map((cx) => <g key={cx}><rect x={cx} y={-420} width={70} height={190} fill="#A8624A" stroke={INK} strokeWidth={5} /><path d={`M${cx - 4},-420 L${cx + 35},-520 L${cx + 74},-420 Z`} fill="#6B3A2E" stroke={INK} strokeWidth={5} strokeLinejoin="round" /></g>)}
      <path d="M-60,0 L-60,-110 Q0,-170 60,-110 L60,0 Z" fill="#5E3326" stroke={INK} strokeWidth={4} />
    </g>
  </g>
);

/** Perspective road from the bottom edge to a vanishing point under the sun: sky, rising sun (`dawn` 0..1), hills, moving dashes, trees. Horizon y = 520. */
export const RoadScene: React.FC<{ id: string; t: number; dawn: number; skyTop?: string }> = ({ id, t, dawn, skyTop = '#2B3F66' }) => {
  const hz = 520, sunY = hz + 90 - dawn * 190, m = (a: number, b: number) => lerp(a, b, dawn), sc = (t * 0.012) % 1;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={skyTop} /><stop offset="0.7" stopColor="#E7A874" /><stop offset="1" stopColor="#FFD9A0" /></linearGradient>
        <radialGradient id={`${id}-sun`}><stop offset="0" stopColor="#FFF3C8" stopOpacity={0.95} /><stop offset="1" stopColor="#FFD27A" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1920} height={hz + 4} fill={`url(#${id}-sky)`} />
      <circle cx={960} cy={sunY} r={m(150, 330)} fill={`url(#${id}-sun)`} />
      <circle cx={960} cy={sunY} r={m(52, 72)} fill="#FFF0B8" />
      <path d={`M0,${hz} L0,${hz - 60} Q300,${hz - 130} 620,${hz - 40} Q900,${hz - 20} 1300,${hz - 90} Q1650,${hz - 130} 1920,${hz - 50} L1920,${hz} Z`} fill="#4C5E52" opacity={0.9} />
      <rect x={0} y={hz} width={1920} height={560} fill="#6C7A4C" />
      <rect x={0} y={hz} width={1920} height={560} fill="#000" opacity={0.18 * (1 - dawn)} />
      <path d={`M${938},${hz} L${982},${hz} L${1860},1080 L${60},1080 Z`} fill="#4B4A4E" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const u = (i + sc) / 9, u2 = Math.min(1, u + 0.05), y0 = hz + 560 * u * u, y1 = hz + 560 * u2 * u2, w0 = 3 + 22 * u * u, w1 = 3 + 22 * u2 * u2;
        return <path key={i} d={`M${960 - w0},${y0} L${960 + w0},${y0} L${960 + w1},${y1} L${960 - w1},${y1} Z`} fill="#F1E2A8" opacity={0.85} />;
      })}
      {[-1, 1].flatMap((side) => Array.from({ length: 6 }, (_, i) => {
        const u = (i + 0.5 + sc) / 7, v = u * u, y = hz + 560 * v, x = 960 + side * (80 + 980 * v), s = 0.25 + 1.5 * v;
        return <g key={`${side}${i}`} transform={`translate(${x},${y}) scale(${s})`}><rect x={-7} y={-70} width={14} height={70} fill="#5A3E26" stroke={INK} strokeWidth={5} /><circle cy={-100} r={52} fill="#3F6B3C" stroke={INK} strokeWidth={5} /></g>;
      }))}
    </g>
  );
};

type TileKind = 'school' | 'market' | 'church' | 'port';
/** Calm "still standing" tile (380 x 400 centred on x, y): drawn icon + label; k = pop progress 0..1. */
export const Tile: React.FC<{ x: number; y: number; kind: TileKind; label: string; k: number; t: number }> = ({ x, y, kind, label, k, t }) => (
  <g transform={`translate(${x},${y + (1 - k) * 60}) scale(${0.8 + 0.2 * k})`} opacity={k}>
    <rect x={-190} y={-200} width={380} height={400} rx={28} fill="#F2EBD8" stroke={INK} strokeWidth={6} />
    <rect x={-187} y={-197} width={374} height={287} rx={26} fill="#BFD9EE" />
    <rect x={-187} y={60} width={374} height={30} fill="#7A8E60" />
    <g transform="translate(0,70)" strokeLinejoin="round">
      {kind === 'school' && <>
        <rect x={-140} y={-150} width={280} height={150} fill="#E3C98A" stroke={INK} strokeWidth={5} />
        <path d="M-156,-150 L0,-215 L156,-150 Z" fill="#B4553B" stroke={INK} strokeWidth={5} />
        {[-100, -35, 30, 95].map((cx) => <rect key={cx} x={cx - 14} y={-120} width={28} height={40} fill="#2F4455" stroke={INK} strokeWidth={4} />)}
        <rect x={-24} y={-62} width={48} height={62} fill="#6A4A2C" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={-172} r={13} fill="#FFF" stroke={INK} strokeWidth={4} />
      </>}
      {kind === 'market' && <>
        <path d="M-150,-120 L150,-120 L170,-70 L-170,-70 Z" fill="#C9343A" stroke={INK} strokeWidth={5} />
        {[-110, -36, 38, 112].map((cx, i) => <path key={cx} d={`M${cx - 37},-120 L${cx + 37},-120 L${cx + 37},-70 L${cx - 37},-70 Z`} fill={i % 2 ? '#F6F0DC' : '#C9343A'} stroke={INK} strokeWidth={4} />)}
        <rect x={-140} y={-70} width={280} height={70} fill="#8A6A44" stroke={INK} strokeWidth={5} />
        {([[-90, '#E0483C'], [-30, '#F2C230'], [30, '#6FAE4F'], [90, '#E78B3A']] as [number, string][]).map(([cx, c]) => <circle key={cx} cx={cx} cy={-84} r={22} fill={c} stroke={INK} strokeWidth={4} />)}
      </>}
      {kind === 'church' && <>
        <rect x={-100} y={-120} width={200} height={120} fill="#9B5A44" stroke={INK} strokeWidth={5} />
        {[-100, 52].map((cx) => <g key={cx}><rect x={cx} y={-210} width={48} height={100} fill="#A8624A" stroke={INK} strokeWidth={5} /><path d={`M${cx - 4},-210 L${cx + 24},-280 L${cx + 52},-210 Z`} fill="#6B3A2E" stroke={INK} strokeWidth={5} /></g>)}
        <path d="M-34,0 L-34,-70 Q0,-108 34,-70 L34,0 Z" fill="#5E3326" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={-128} r={16} fill="#F2EBD8" stroke={INK} strokeWidth={4} />
      </>}
      {kind === 'port' && <>
        <rect x={-187} y={-6} width={374} height={30} fill="#2A5A86" />
        <path d="M-130,-30 L60,-30 L36,-4 L-110,-4 Z" fill="#33475B" stroke={INK} strokeWidth={5} /><rect x={-70} y={-70} width={60} height={42} fill="#E8E4D6" stroke={INK} strokeWidth={4} />
        <g transform={`translate(${Math.sin(t / 40) * 4},0)`}><rect x={110} y={-190} width={14} height={190} fill="#C9A227" stroke={INK} strokeWidth={4} /><rect x={30} y={-196} width={150} height={14} fill="#C9A227" stroke={INK} strokeWidth={4} /><line x1={50} y1={-182} x2={50} y2={-110} stroke={INK} strokeWidth={4} /><rect x={32} y={-110} width={36} height={26} fill="#B3262B" stroke={INK} strokeWidth={4} /></g>
      </>}
    </g>
    <text y={150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={42} fill="#1C2733">{label}</text>
  </g>
);

/** Small family house, window glows (`glow` 0..1). Ground at y. */
export const House: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round">
    <ellipse cy={4} rx={190} ry={14} fill="#000" opacity={0.28} />
    <rect x={-150} y={-190} width={300} height={190} fill="#E8D6A8" stroke={INK} strokeWidth={6} />
    <path d="M-185,-190 L0,-300 L185,-190 Z" fill="#B4553B" stroke={INK} strokeWidth={6} />
    <rect x={-110} y={-140} width={80} height={80} fill={`rgba(255,217,138,${0.35 + 0.65 * glow})`} stroke={INK} strokeWidth={5} />
    <rect x={30} y={-150} width={72} height={150} fill="#6A4A2C" stroke={INK} strokeWidth={5} />
    <circle cx={88} cy={-72} r={5} fill="#FFD98A" />
  </g>
);

/** Empty wooden chair. */
export const Chair: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
    <ellipse cy={4} rx={110} ry={12} fill="#000" opacity={0.3} />
    <rect x={-70} y={-250} width={140} height={150} rx={10} fill="#7A5232" stroke={INK} strokeWidth={6} />
    <rect x={-84} y={-110} width={168} height={26} rx={6} fill="#8A6038" stroke={INK} strokeWidth={6} />
    {[-70, 70].map((cx) => <line key={cx} x1={cx} y1={-86} x2={cx} y2={0} stroke={INK} strokeWidth={14} />)}
    {[-70, 70].map((cx) => <line key={`i${cx}`} x1={cx} y1={-86} x2={cx} y2={0} stroke="#7A5232" strokeWidth={7} />)}
  </g>
);

/** Framed faceless portrait with a black ribbon corner (a loss we do not name). */
export const Portrait: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round">
    <rect x={-100} y={-130} width={200} height={260} rx={8} fill="#6A4A2C" stroke={INK} strokeWidth={6} />
    <rect x={-80} y={-110} width={160} height={220} fill="#C9C2B0" />
    <circle cy={-28} r={32} fill="#7C8794" /><path d="M-62,110 Q0,-20 62,110 Z" fill="#7C8794" />
    <path d="M-100,-130 L-40,-130 L-100,-70 Z" fill="#111" />
  </g>
);

/** Full-screen sky where a sun and a moon chase each other (a "period" frames cycle, smooth colour): years passing. */
export const FastSky: React.FC<{ id: string; t: number; period?: number }> = ({ id, t, period = 40 }) => {
  const a = (t / period) * Math.PI * 2, cx = 960, cy = 760, sx = cx - Math.cos(a) * 820, sy = cy - Math.sin(a) * 560;
  const day = Math.max(0, Math.min(1, 0.5 + Math.sin(a) * 0.9));
  return (
    <g>
      <defs><linearGradient id={`${id}-fs`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix('#0B1626', '#4F86C0', day)} /><stop offset="1" stopColor={mix('#243A5A', '#CFE6F6', day)} /></linearGradient></defs>
      <rect width={1920} height={1080} fill={`url(#${id}-fs)`} />
      <circle cx={sx} cy={sy} r={70} fill="#FFE27A" stroke={INK} strokeWidth={5} />
      <circle cx={2 * cx - sx} cy={2 * cy - sy} r={54} fill="#E8ECF2" stroke={INK} strokeWidth={5} />
    </g>
  );
};
