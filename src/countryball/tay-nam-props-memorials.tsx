import React from 'react';
import { Candle, IncenseBundle } from './ground-memorial-props';
import { Glow } from './fx-glow';
import { hash } from './fx-math';
import { FONT } from '../engine/fonts';

// Remembrance props (screen px; x = centre, y = ground line; t in FRAMES for flames / smoke; pure). TikTok-safe by construction: memorials
// are EXTERIORS only (closed glass, nothing visible inside), no remains, no inscriptions of numbers; light = candles, incense, flowers.
//   <MemorialStupa x y h? tone? t? offerings? />     Choeung Ek-like memorial stupa: white tiered tower on a terrace, CLOSED glass panels
//                                                      (only sky reflections), Khmer roof tiers and spire; offerings = incense + flowers in front
//   <MemorialGate x y w? tone? text? />              generic three-entrance memorial gate (Ba Chúc style, tiled double roofs), plaque `text`
//   <CandleRow x y w n? s? t? lit? />                 row of candles, lighting up one by one when `lit` 0..1 ramps
//   <FlowerBouquet x y s? color? />                   white / yellow chrysanthemums wrapped in paper, laid on the ground
//   <OfferingTable x y w? t? />                       low table with incense bowl, two candles, flowers and fruit

const INK = '#17151B';
type Tone = 'day' | 'dusk' | 'night';
const WHITE: Record<Tone, string> = { day: '#EDE8DC', dusk: '#B9A9A8', night: '#5A6178' };

export const MemorialStupa: React.FC<{ x: number; y: number; h?: number; tone?: Tone; t?: number; offerings?: boolean }> = ({ x, y, h = 900, tone = 'dusk', t = 0, offerings = true }) => {
  const k = h / 900, wh = WHITE[tone], shade = '#00000022', roof = tone === 'day' ? '#C59A3E' : tone === 'dusk' ? '#8A6440' : '#3D3C52';
  const glass = tone === 'night' ? '#2A3550' : '#7FA6C4';
  return (
    <g>
      <g transform={`translate(${x},${y}) scale(${k})`} strokeLinejoin="round">
        {/* terrace with steps and railings */}
        <path d="M-330,0 H330 V-30 H-330 Z M-280,-30 H280 V-60 H-280 Z" fill={wh} stroke={INK} strokeWidth={3} />
        <path d="M-70,0 H70 L50,-60 H-50 Z" fill={wh} stroke={INK} strokeWidth={3} />
        {[-1, 1].map((s) => <path key={s} d={`M${s * 90},-60 V-86 H${s * 270} V-60`} fill="none" stroke={INK} strokeWidth={4} />)}
        {/* glass body: closed panels, only reflections */}
        <rect x={-170} y={-420} width={340} height={360} fill={wh} stroke={INK} strokeWidth={3} />
        {Array.from({ length: 4 }, (_, i) => (
          <g key={i}>
            <rect x={-150 + i * 76} y={-400} width={64} height={320} fill={glass} stroke={INK} strokeWidth={2.5} />
            <path d={`M${-146 + i * 76},${-300} L${-90 + i * 76},${-396} L${-90 + i * 76},${-360} L${-146 + i * 76},${-264} Z`} fill="#FFFFFF" opacity={0.35} />
          </g>
        ))}
        <rect x={-170} y={-420} width={340} height={360} fill={shade} />
        {/* tiered Khmer roofs with upturned ends */}
        {[[-200, -420, 70], [-150, -490, 60], [-104, -550, 52]].map(([hw, yb, ht], i) => (
          <g key={i}>
            <path d={`M${hw},${yb} L${hw * 0.6},${yb - ht} L${-hw * 0.6},${yb - ht} L${-hw},${yb} Z`} fill={roof} stroke={INK} strokeWidth={3} />
            {[-1, 1].map((s) => <path key={s} d={`M${-s * hw},${yb} q${-s * 18},-6 ${-s * 14},-30`} fill="none" stroke={roof} strokeWidth={7} strokeLinecap="round" />)}
          </g>
        ))}
        <path d="M-60,-602 Q0,-640 60,-602 Z" fill={wh} stroke={INK} strokeWidth={3} />
        <path d="M-40,-612 L-14,-860 L14,-860 L40,-612 Z" fill={wh} stroke={INK} strokeWidth={3} />
        {[-660, -710, -760, -810].map((yy, i) => <line key={yy} x1={-34 + i * 6} y1={yy} x2={34 - i * 6} y2={yy} stroke={INK} strokeWidth={2.5} opacity={0.5} />)}
        <path d="M-8,-860 L0,-900 L8,-860 Z" fill={roof} stroke={INK} strokeWidth={2} />
      </g>
      {offerings && <OfferingTable x={x} y={y + 6 * k} w={360 * k} t={t} />}
    </g>
  );
};

export const MemorialGate: React.FC<{ x: number; y: number; w?: number; tone?: Tone; text?: string }> = ({ x, y, w = 820, tone = 'day', text = 'BA CHÚC' }) => {
  const k = w / 820, wall = tone === 'day' ? '#E8DFC6' : tone === 'dusk' ? '#9E8E86' : '#5A6280', roof = tone === 'day' ? '#9E3B2A' : tone === 'dusk' ? '#6E3A30' : '#4A3E5E';
  const rim = tone === 'night' ? '#A9A6D0' : INK;   // moonlit roof edges so the gate reads against a night sky
  const roofD = (hw: number, yb: number, ht: number) => `M${-hw},${yb} Q${-hw * 0.7},${yb - ht * 0.4} ${-hw * 0.55},${yb - ht} L${hw * 0.55},${yb - ht} Q${hw * 0.7},${yb - ht * 0.4} ${hw},${yb} Z`;
  const part = (cx: number, sc: number) => (
    <g transform={`translate(${cx},0) scale(${sc})`}>
      <rect x={-120} y={-300} width={240} height={300} fill={wall} stroke={INK} strokeWidth={3} />
      <path d="M-62,0 V-170 Q0,-230 62,-170 V0 Z" fill="#2A2420" />
      <path d={roofD(160, -300, 56)} fill={roof} stroke={rim} strokeWidth={3} />
      <rect x={-90} y={-372} width={180} height={18} fill={wall} stroke={INK} strokeWidth={2.5} />
      <path d={roofD(118, -354, 46)} fill={roof} stroke={rim} strokeWidth={3} />
      {[-1, 1].map((s) => <path key={s} d={`M${s * 160},-300 q${s * 22},-4 ${s * 18},-34 M${s * 118},-354 q${s * 18},-4 ${s * 15},-28`} fill="none" stroke={roof} strokeWidth={7} strokeLinecap="round" />)}
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} strokeLinejoin="round">
      <rect x={-410} y={-12} width={820} height={12} fill="#00000033" />
      {part(-280, 0.72)}{part(280, 0.72)}{part(0, 1)}
      <rect x={-110} y={-290} width={220} height={58} rx={6} fill="#7A2A22" stroke="#E2B95A" strokeWidth={4} />
      <text x={0} y={-250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#F4D58A" letterSpacing={2}>{text}</text>
    </g>
  );
};

export const CandleRow: React.FC<{ x: number; y: number; w: number; n?: number; s?: number; t?: number; lit?: number }> = ({ x, y, w, n = 9, s = 80, t = 0, lit = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const u = n === 1 ? 0.5 : i / (n - 1), on = lit * n > i + 0.2 * hash(i, 4);
      return <Candle key={i} x={x - w / 2 + u * w} y={y + (i % 2) * s * 0.12} s={s * (0.85 + 0.3 * hash(i, 2))} t={t + i * 7} lit={on} seed={i} />;
    })}
  </g>
);

export const FlowerBouquet: React.FC<{ x: number; y: number; s?: number; color?: 'white' | 'yellow' }> = ({ x, y, s = 90, color = 'white' }) => {
  const pet = color === 'white' ? '#F5F2EA' : '#F2C443', core = color === 'white' ? '#E8D67A' : '#D98A22';
  return (
    <g transform={`translate(${x},${y}) rotate(-12) scale(${s / 90})`} strokeLinejoin="round">
      <path d="M-14,0 L-34,-60 L34,-60 L14,0 Z" fill="#F0E6CF" stroke={INK} strokeWidth={2.5} />
      {Array.from({ length: 6 }, (_, i) => { const fx = -26 + (i % 3) * 26, fy = -66 - Math.floor(i / 3) * 22; return <g key={i}><circle cx={fx} cy={fy} r={13} fill={pet} stroke={INK} strokeWidth={2} /><circle cx={fx} cy={fy} r={5} fill={core} /></g>; })}
      <path d="M-8,-20 Q0,-36 8,-20" fill="none" stroke="#3E7A2E" strokeWidth={4} />
    </g>
  );
};

export const OfferingTable: React.FC<{ x: number; y: number; w?: number; t?: number }> = ({ x, y, w = 360, t = 0 }) => {
  const k = w / 360;
  return (
    <g>
      <path d={`M${x - w / 2},${y - 70 * k} H${x + w / 2} V${y - 56 * k} H${x - w / 2} Z`} fill="#6B3A22" stroke={INK} strokeWidth={2.5 * k} />
      {[-1, 1].map((s) => <rect key={s} x={x + s * (w / 2 - 22 * k) - 6 * k} y={y - 56 * k} width={12 * k} height={56 * k} fill="#4A2818" />)}
      <IncenseBundle x={x} y={y - 70 * k} s={120 * k} t={t} n={3} />
      <Candle x={x - 110 * k} y={y - 70 * k} s={70 * k} t={t} seed={1} />
      <Candle x={x + 110 * k} y={y - 70 * k} s={70 * k} t={t + 11} seed={2} />
      <FlowerBouquet x={x - 175 * k} y={y} s={80 * k} color="white" />
      <FlowerBouquet x={x + 180 * k} y={y} s={80 * k} color="yellow" />
      {[[-50, 0], [-40, 1], [-60, 1]].map(([dx, i], j) => <circle key={j} cx={x + (dx + 120) * k - j * 10 * k} cy={y - 78 * k - i * 10 * k} r={9 * k} fill={['#E8892A', '#D9C23A', '#E8892A'][j]} stroke={INK} strokeWidth={1.5} />)}
      <Glow x={x} y={y - 120 * k} r={160 * k} color="#FFB347" o={0.18} />
    </g>
  );
};
