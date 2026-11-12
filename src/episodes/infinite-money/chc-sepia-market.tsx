import React from 'react';
import { Hero, walkPose, FONT, rnd } from '../../engine';
import { INK } from './chc-props-money-and-prices';
import { SEPIA_LOOKS, ConicalHat } from './chc-props-food-and-trade';

// The remembered 1986 market, drawn in browns (so it reads as old photograph even before the "memory" grade):
// canopies, tables of greens, a crowd of small sepia figures walking behind, film scratches and a dark vignette.

const T = { paper: '#D9BC8A', far: '#B8935A', wall: '#9A7A4C', dark: '#4A3624', cloth: ['#8A5A3A', '#B8935A', '#6A4A30', '#A8754A'], leaf: '#7A7A44' };

const Stall: React.FC<{ x: number; y: number; s?: number; i: number }> = ({ x, y, s = 1, i }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={190} ry={14} fill="#000" opacity={0.3} />
    <path d="M -170 -230 L 170 -230 L 140 -330 L -140 -330 Z" fill={T.cloth[i % 4]} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -170 -230 Q -140 -200 -110 -230 Q -80 -200 -50 -230 Q -20 -200 10 -230 Q 40 -200 70 -230 Q 100 -200 130 -230 L 170 -230" fill={T.cloth[i % 4]} stroke={INK} strokeWidth={4} />
    <path d="M -150 -230 V 0 M 150 -230 V 0" stroke={T.dark} strokeWidth={9} />
    <rect x={-160} y={-110} width={320} height={34} fill="#7A5A38" stroke={INK} strokeWidth={4} />
    <path d="M -140 -76 V 0 M 140 -76 V 0" stroke={T.dark} strokeWidth={8} />
    {Array.from({ length: 9 }).map((_, k) => <ellipse key={k} cx={-120 + k * 30} cy={-126 - (k % 3) * 8} rx={20} ry={14} fill={k % 2 ? T.leaf : '#8A8A50'} stroke={INK} strokeWidth={2.5} />)}
  </g>
);

/** The sepia market backdrop. `t` drives the walking crowd and the film scratches. Draw figures after it. */
export const SepiaMarket: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8D2A8" /><stop offset="1" stopColor={T.paper} /></linearGradient>
      <radialGradient id={`${id}vig`} cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#2A1C10" stopOpacity={0} /><stop offset="1" stopColor="#2A1C10" stopOpacity={0.7} /></radialGradient>
    </defs>
    <rect x={-200} y={-200} width={2400} height={1500} fill={`url(#${id}sky)`} />
    <path d="M -100 520 H 2100 V 380 H 1800 V 440 H 1500 V 330 H 1200 V 430 H 900 V 360 H 600 V 450 H 300 V 390 H -100 Z" fill={T.far} opacity={0.8} />
    <rect x={-100} y={500} width={2200} height={700} fill="#B08E5C" />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={`g${i}`} d={`M -100 ${600 + i * 90} H 2100`} stroke={INK} strokeOpacity={0.08} strokeWidth={4} />)}
    <rect x={-100} y={500} width={2200} height={10} fill="#E8D2A8" opacity={0.6} />
    <path d="M 200 120 Q 960 220 1720 120" stroke={INK} strokeWidth={4} fill="none" />
    {Array.from({ length: 12 }).map((_, k) => <path key={k} d={`M ${200 + k * 140} ${120 + Math.sin(k / 11 * Math.PI) * 50 + 8} l 24 0 l -12 46 z`} fill={['#C8483E', '#E8D2A8'][k % 2]} opacity={0.55} stroke={INK} strokeWidth={2} />)}
    {[160, 560, 960, 1360, 1760].map((x, i) => <Stall key={i} x={x} y={560} s={0.5} i={i + 1} />)}
    {[[0, -1.5, 0, 0], [1, 1.2, 0, 1], [2, -1.9, 0, 2], [3, 1.6, 0, 0], [4, -1.1, 0, 1]].map(([i, v, , k]) => {
      const x = ((i * 470 + t * v + 600) % 2300 + 2300) % 2300 - 200;
      const p = walkPose(x, t * 0.45 + i * 3, 640, 0.4, { yaw: v > 0 ? 0.8 : -0.8 }, v > 0 ? 1 : -1);
      return <g key={`f${i}`}><Hero look={SEPIA_LOOKS[k % 3]} pose={p} rimId="rimR" shadow={0} />{i % 2 === 0 ? <ConicalHat pose={p} color="#C9A870" dy={-8} /> : null}</g>;
    })}
    <Stall x={330} y={760} s={0.9} i={0} />
    <Stall x={960} y={740} s={0.8} i={1} />
    <Stall x={1560} y={765} s={0.95} i={2} />
    {[[110, 960, 0], [700, 975, 1], [1250, 960, 2], [1820, 985, 0]].map(([x, y, k]) => (
      <g key={`b${x}`} transform={`translate(${x} ${y})`}>
        <ellipse cx={0} cy={4} rx={70} ry={10} fill="#000" opacity={0.3} />
        <path d="M -62 0 Q -70 -50 -44 -70 H 44 Q 70 -50 62 0 Z" fill={['#8A5A3A', '#A8754A', '#6A4A30'][k]} stroke={INK} strokeWidth={4} />
        <path d="M -52 -30 H 52 M -58 -14 H 58" stroke={INK} strokeOpacity={0.35} strokeWidth={3} />
        <ellipse cx={0} cy={-70} rx={48} ry={10} fill="#E8D2A8" stroke={INK} strokeWidth={3} />
      </g>
    ))}
    {[0, 1, 2, 3].map((i) => {
      const x = ((i * 610 + t * (i % 2 ? 2.2 : -1.8) + 500) % 2400 + 2400) % 2400 - 250;
      const p = walkPose(x, t * 0.4 + i * 3, 900, 0.8, { yaw: i % 2 ? 0.8 : -0.8 }, i % 2 ? 1 : -1);
      return (
        <g key={i} opacity={0.95}>
          <Hero look={SEPIA_LOOKS[(i + 1) % 3]} pose={p} rimId="rimR" shadow={0} />
          {i % 2 === 0 ? <ConicalHat pose={p} color="#C9A870" dy={-8} /> : null}
        </g>
      );
    })}
    <g transform="translate(960 236)"><rect x={-110} y={-52} width={220} height={78} rx={10} fill="#7A5A38" stroke={INK} strokeWidth={4} /><text x={0} y={8} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill="#F0DDB0">MARKET</text></g>
  </g>
);

/** Old-film finish drawn over a sepia shot: vertical scratches that change every 2 frames, dust, a dark vignette. */
export const FilmWear: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const k = Math.floor(t / 2);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill={`url(#${id}vig)`} />
      {[0, 1, 2].map((i) => {
        const x = rnd(k + 3, i) * 1920;
        return rnd(k + 9, i) > 0.45 ? <rect key={i} x={x} y={0} width={2} height={1080} fill="#F6E9C8" opacity={0.18} /> : null;
      })}
      {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={rnd(k, i) * 1920} cy={rnd(k + 5, i) * 1080} r={1 + rnd(k + 1, i) * 3} fill="#F6E9C8" opacity={0.3} />)}
    </g>
  );
};
