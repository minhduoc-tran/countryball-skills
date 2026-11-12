import React from 'react';
import { Glow } from '../../countryball/fx-glow';
import { FONT } from '../../engine/fonts';
import { hash } from './che-map-and-text-helpers';

// Chapter E small icons for the quiet / civilian beats: candle, incense, hospital, house, silhouette (name cards),
// clock, recorder, vinyl, newspaper, public buildings. Flat shapes, no people drawn in distress. t in frames (30 fps).

const INK = '#111';

/** Candle: (x, y) = base of the wax; height ~ 70 * s. Flame flickers with t. */
export const Candle: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number; o?: number }> = ({ x, y, s = 1, t, seed = 0, o = 1 }) => {
  const fl = 1 + 0.12 * Math.sin(t * 0.37 + seed * 2.1) + 0.07 * Math.sin(t * 0.91 + seed);
  return (
    <g opacity={o}>
      <Glow x={x} y={y - 85 * s} r={90 * s * fl} color="#FFB347" o={0.5} />
      <rect x={x - 11 * s} y={y - 62 * s} width={22 * s} height={62 * s} rx={3 * s} fill="#F2E9D6" stroke={INK} strokeWidth={2.5 * s} />
      <line x1={x} y1={y - 62 * s} x2={x} y2={y - 70 * s} stroke={INK} strokeWidth={2.5 * s} />
      <path d={`M${x},${y - 70 * s} Q${x + 11 * s},${y - 86 * s} ${x},${y - 106 * s * fl} Q${x - 11 * s},${y - 86 * s} ${x},${y - 70 * s} Z`} fill="#FFC857" stroke="#E8782A" strokeWidth={2 * s} />
      <ellipse cx={x} cy={y - 80 * s} rx={3.5 * s} ry={7 * s} fill="#FFF6D8" />
    </g>
  );
};

/** Three incense sticks in a small bowl with smoke curling up. (x, y) = bowl bottom centre. */
export const Incense: React.FC<{ x: number; y: number; s?: number; t: number; o?: number }> = ({ x, y, s = 1, t, o = 1 }) => (
  <g opacity={o}>
    {[-1, 0, 1].map((k) => {
      const tx = x + k * 26 * s, ty = y - 210 * s + Math.abs(k) * 8 * s;
      return (
        <g key={k}>
          <line x1={x + k * 8 * s} y1={y - 34 * s} x2={tx} y2={ty} stroke="#8C4A2B" strokeWidth={5 * s} strokeLinecap="round" />
          <circle cx={tx} cy={ty} r={5 * s} fill="#FF6A2A" />
          <Glow x={tx} y={ty} r={26 * s} color="#FF7A33" o={0.6} />
          {[0, 1].map((j) => {
            const pts = Array.from({ length: 14 }, (_, i) => {
              const u = i / 13, dy = -u * (220 * s), dx = Math.sin(u * 5 + t * 0.05 + k * 1.7 + j * 2.2) * (10 + u * 26) * s;
              return `${tx + dx},${ty + dy}`;
            }).join(' ');
            return <polyline key={j} points={pts} fill="none" stroke="#CFD6E2" strokeWidth={3 * s} opacity={0.3 - j * 0.1} strokeLinecap="round" />;
          })}
        </g>
      );
    })}
    <path d={`M${x - 70 * s},${y - 34 * s} L${x + 70 * s},${y - 34 * s} L${x + 56 * s},${y} L${x - 56 * s},${y} Z`} fill="#6B4A32" stroke={INK} strokeWidth={4 * s} strokeLinejoin="round" />
    <ellipse cx={x} cy={y - 34 * s} rx={70 * s} ry={10 * s} fill="#4A3322" stroke={INK} strokeWidth={4 * s} />
  </g>
);

/** Hospital building (plain, white-grey) with a cross sign. (x, y) = bottom centre; width 300 * s. */
export const Hospital: React.FC<{ x: number; y: number; s?: number; o?: number; lit?: number }> = ({ x, y, s = 1, o = 1, lit = 1 }) => (
  <g opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-170} width={300} height={170} fill="#D9DEE6" stroke={INK} strokeWidth={5} />
    <rect x={-60} y={-230} width={120} height={60} fill="#E8ECF2" stroke={INK} strokeWidth={5} />
    {[-120, -70, 70, 120].flatMap((cx) => [-140, -90, -40].map((cy) => <rect key={`${cx}${cy}`} x={cx - 14} y={cy} width={28} height={30} fill={lit > 0.5 ? '#FFD983' : '#5B6676'} stroke={INK} strokeWidth={3} />))}
    <rect x={-20} y={-60} width={40} height={60} fill="#7A8696" stroke={INK} strokeWidth={4} />
    <circle cx={0} cy={-200} r={24} fill="#fff" stroke={INK} strokeWidth={4} />
    <path d="M-5,-216 h10 v11 h11 v10 h-11 v11 h-10 v-11 h-11 v-10 h11 z" fill="#DA251D" />
  </g>
);

/** A small house; (x, y) = bottom centre, width ~ 70 * s. `lit` 0..1 window light. */
export const House: React.FC<{ x: number; y: number; s?: number; lit?: number; o?: number; hue?: number }> = ({ x, y, s = 1, lit = 1, o = 1, hue = 0 }) => (
  <g opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
    {lit > 0.1 && <Glow x={0} y={-24} r={60} color="#FFB347" o={0.35 * lit} />}
    <rect x={-32} y={-44} width={64} height={44} fill={['#C9B99A', '#B9A383', '#D2C3A4'][hue % 3]} stroke={INK} strokeWidth={3.5} />
    <path d="M-40,-44 L0,-76 L40,-44 Z" fill="#8A4B38" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
    <rect x={-8} y={-32} width={16} height={18} fill={lit > 0.1 ? '#FFD983' : '#3A424F'} stroke={INK} strokeWidth={2.5} />
  </g>
);

/** Plain respectful head-and-shoulders silhouette on a round plate. (x, y) = centre, radius 100 * s. */
export const Silhouette: React.FC<{ x: number; y: number; s?: number; plate?: string; fig?: string; o?: number }> = ({ x, y, s = 1, plate = '#3A4660', fig = '#0F131B', o = 1 }) => (
  <g opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
    <defs><clipPath id={`sil-${Math.round(x)}-${Math.round(y)}`}><circle r={100} /></clipPath></defs>
    <circle r={100} fill={plate} stroke={INK} strokeWidth={6} />
    <g clipPath={`url(#sil-${Math.round(x)}-${Math.round(y)})`}>
      <circle cx={0} cy={-18} r={36} fill={fig} />
      <path d="M-80,100 Q-76,28 0,26 Q76,28 80,100 Z" fill={fig} />
    </g>
  </g>
);

/** Clock face with a sweeping hand; k 0..1 = fraction of the `span` hours elapsed. (x, y) centre. */
export const ClockFace: React.FC<{ x: number; y: number; r?: number; k: number; fill?: string; o?: number }> = ({ x, y, r = 120, k, fill = '#F4EFE3', o = 1 }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r} fill={fill} stroke={INK} strokeWidth={r * 0.06} />
    <path d={`M${x},${y} L${x},${y - r * 0.86} A${r * 0.86},${r * 0.86} 0 ${k > 0.5 ? 1 : 0} 1 ${x + Math.sin(k * 6.2831) * r * 0.86},${y - Math.cos(k * 6.2831) * r * 0.86} Z`} fill="#C9343A" opacity={0.55} />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={x + Math.sin(i * 0.5236) * r * 0.86} y1={y - Math.cos(i * 0.5236) * r * 0.86} x2={x + Math.sin(i * 0.5236) * r * 0.74} y2={y - Math.cos(i * 0.5236) * r * 0.74} stroke={INK} strokeWidth={r * 0.04} />)}
    <line x1={x} y1={y} x2={x + Math.sin(k * 6.2831) * r * 0.78} y2={y - Math.cos(k * 6.2831) * r * 0.78} stroke={INK} strokeWidth={r * 0.06} strokeLinecap="round" />
    <circle cx={x} cy={y} r={r * 0.07} fill={INK} />
  </g>
);

/** Pocket tape recorder with two spinning reels; (x, y) centre, ~220 * s wide. */
export const Recorder: React.FC<{ x: number; y: number; s?: number; t: number; o?: number }> = ({ x, y, s = 1, t, o = 1 }) => (
  <g opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-110} y={-70} width={220} height={140} rx={16} fill="#4C5560" stroke={INK} strokeWidth={6} />
    <rect x={-90} y={-52} width={180} height={78} rx={8} fill="#1D232B" stroke={INK} strokeWidth={4} />
    {[-45, 45].map((cx) => (
      <g key={cx} transform={`translate(${cx},-13) rotate(${t * 7})`}>
        <circle r={30} fill="#C8CED6" stroke={INK} strokeWidth={4} />
        {[0, 120, 240].map((a) => <line key={a} x1={0} y1={0} x2={22 * Math.cos((a * Math.PI) / 180)} y2={22 * Math.sin((a * Math.PI) / 180)} stroke={INK} strokeWidth={5} strokeLinecap="round" />)}
      </g>
    ))}
    <circle cx={-70} cy={48} r={9} fill="#DA251D" stroke={INK} strokeWidth={3} />
    <rect x={-40} y={40} width={110} height={16} rx={4} fill="#2B323B" />
  </g>
);

/** Vinyl record sleeve + disc; (x, y) = sleeve centre, sleeve 260 * s square. No real album art. */
export const AlbumSleeve: React.FC<{ x: number; y: number; s?: number; t: number; slide?: number; o?: number }> = ({ x, y, s = 1, t, slide = 1, o = 1 }) => (
  <g opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
    <g transform={`translate(${130 * slide},0) rotate(${t * 6})`}>
      <circle r={118} fill="#14161B" stroke={INK} strokeWidth={4} />
      {[40, 62, 84, 104].map((r) => <circle key={r} r={r} fill="none" stroke="#2B2F38" strokeWidth={2} />)}
      <circle r={32} fill="#C9343A" /><circle r={5} fill="#14161B" /><path d="M0,-32 A32,32 0 0 1 32,0" fill="none" stroke="#fff" strokeWidth={3} opacity={0.4} />
    </g>
    <rect x={-130} y={-130} width={260} height={260} rx={6} fill="#E8E1D0" stroke={INK} strokeWidth={6} />
    <rect x={-110} y={-110} width={220} height={150} fill="#3B4F6E" />
    <path d="M-110,40 L-60,-30 L-20,10 L30,-60 L110,40 Z" fill="#2A3A55" />
    <circle cx={60} cy={-60} r={22} fill="#F1D78A" />
    <text x={0} y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#1A1A1A">ALBUM PHẢN ĐỐI</text>
    <text x={0} y={118} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#1A1A1A">CHIẾN TRANH</text>
  </g>
);

/** Audio waveform strip: bars, height from a seeded hash, `energy(i)` 0..1 shapes the pattern. */
export const Waveform: React.FC<{ x: number; y: number; w: number; h: number; t: number; bars?: number; color?: string; energy?: (u: number) => number; seed?: number; o?: number }> = ({
  x, y, w, h, t, bars = 48, color = '#FFD166', energy = () => 0.6, seed = 1, o = 1,
}) => (
  <g opacity={o}>
    {Array.from({ length: bars }, (_, i) => {
      const u = i / (bars - 1), a = (0.25 + 0.75 * hash(i, seed + Math.floor(t / 3))) * energy(u);
      return <rect key={i} x={x - w / 2 + u * w - w / bars / 2.6} y={y - (h * a) / 2} width={(w / bars) * 0.6} height={Math.max(4, h * a)} rx={3} fill={color} />;
    })}
  </g>
);

/** Newspaper front page (generic masthead, no real paper). (x, y) centre, 240 * s wide. */
export const Newspaper: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; head?: string; shade?: number }> = ({ x, y, s = 1, rot = 0, o = 1, head = '', shade = 0 }) => (
  <g opacity={o} transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-124} y={-164} width={248} height={336} fill="#000" opacity={0.3} />
    <rect x={-120} y={-170} width={240} height={336} fill="#E9E2CF" stroke={INK} strokeWidth={4} />
    <rect x={-100} y={-150} width={200} height={30} fill="#2A2A2A" />
    <text x={0} y={-90} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(34, 200 / (Math.max(4, head.length) * 0.6))} fill="#151515">{head}</text>
    <rect x={-100} y={-70} width={200} height={90} fill="#8D8878" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-100 + (i % 2) * 104} y={36 + Math.floor(i / 2) * 22} width={i % 2 ? 96 : 96} height={7} fill="#6E6A5C" />)}
    {shade > 0 && <rect x={-120} y={-170} width={240} height={336} fill="#05070B" opacity={shade} />}
  </g>
);

/** Plain public building with columns + a flag-less pediment, `dome` adds a dome (Quốc hội). (x, y) = bottom centre. */
export const PublicBuilding: React.FC<{ x: number; y: number; s?: number; dome?: boolean; fill?: string; o?: number }> = ({ x, y, s = 1, dome = false, fill = '#E4E6EC', o = 1 }) => (
  <g opacity={o} transform={`translate(${x},${y}) scale(${s})`}>
    {dome && <>
      <path d="M-70,-170 A70,70 0 0 1 70,-170 Z" fill={fill} stroke={INK} strokeWidth={5} />
      <rect x={-8} y={-262} width={16} height={26} fill={fill} stroke={INK} strokeWidth={4} />
    </>}
    <rect x={-190} y={-60} width={380} height={60} fill={fill} stroke={INK} strokeWidth={5} />
    <rect x={-150} y={-170} width={300} height={110} fill={fill} stroke={INK} strokeWidth={5} />
    {!dome && <path d="M-170,-170 L0,-232 L170,-170 Z" fill={fill} stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
    {[-120, -60, 0, 60, 120].map((cx) => <rect key={cx} x={cx - 11} y={-160} width={22} height={100} fill="#C4C8D2" stroke={INK} strokeWidth={3} />)}
  </g>
);
