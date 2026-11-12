import React from 'react';
import { FONT } from '../engine/fonts';
import { clamp, hash, lerp } from './fx-math';
import { mix } from './map-context';
import { SugarPalm, Tone } from './tay-nam-props-monuments';
import { Person } from './tay-nam-people-silhouettes';

// Cambodian / Tây Nam countryside (screen px; t FRAMES; pure):
//   <PaddyLandscape id x? y w? h? tone? season? t? palms? farmers? />   rice paddies in perspective down from the horizon y, dikes, water glints,
//                                                                       sugar palms (thốt nốt) on the dikes, a far tree line; season 'green' | 'gold'
//   <BorderMarker x y s? num? />                                        concrete border post: "VIỆT NAM" face + "CAMPUCHIA" side, number on top
//   <MekongFerry id x? y w? progress t? tone? s? />                     wide river (y = far bank; the water fills everything below), landing ramps at
//                                                                       both sides, the ferry (pontoon + tug, s = scale, 1.6 fills a 1080 frame)
//                                                                       carrying a truck and people crosses left -> right as progress 0..1

const INK = '#18161C';

export const PaddyLandscape: React.FC<{ id?: string; x?: number; y: number; w?: number; h?: number; tone?: Tone; season?: 'green' | 'gold'; t?: number; palms?: number; farmers?: number }> = ({
  id = 'paddy', x = 540, y, w = 1080, h = 900, tone = 'day', season = 'green', t = 0, palms = 9, farmers = 2,
}) => {
  const x0 = x - w / 2, rice = season === 'green' ? ['#7DB04A', '#93C25A'] : ['#D8B248', '#E6C766'];
  const dark = tone === 'day' ? 0 : tone === 'dusk' ? 0.35 : 0.7, T = (c: string) => mix(c, '#1A1E30', dark);
  const sky = tone === 'day' ? ['#8CC4E8', '#E8F0E6'] : tone === 'dusk' ? ['#3A4A7A', '#F2A65A'] : ['#0E1A33', '#2E3F66'];
  const rows = 9, rowY = (i: number) => y + h * Math.pow(i / rows, 1.7);                          // rows get taller toward the viewer
  return (
    <g>
      <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
      <rect x={x0} y={y - 1300} width={w} height={1300} fill={`url(#${id}-sky)`} />
      {/* far tree line */}
      <path d={`M${x0},${y} ${Array.from({ length: 24 }, (_, i) => `Q${x0 + (i + 0.5) * (w / 24)},${y - 28 - hash(i, 2) * 30} ${x0 + (i + 1) * (w / 24)},${y - 6}`).join(' ')} L${x0 + w},${y + 4} L${x0},${y + 4} Z`} fill={T('#3E6A3A')} />
      {Array.from({ length: rows }, (_, i) => {
        const ya = rowY(i), yb = rowY(i + 1), cols = 3 + (i % 2);
        return Array.from({ length: cols }, (_, j) => {
          const xa = x0 + (j / cols) * w, xb = x0 + ((j + 1) / cols) * w, water = (i + j) % 3 === 0;
          return (
            <g key={`${i}-${j}`}>
              <rect x={xa} y={ya} width={xb - xa} height={yb - ya} fill={T(water ? mix('#7FA8B8', rice[0], 0.35) : rice[(i + j) % 2])} />
              {water && <line x1={xa + (xb - xa) * (0.2 + 0.3 * hash(i, j))} y1={(ya + yb) / 2} x2={xa + (xb - xa) * (0.45 + 0.3 * hash(i, j)) + Math.sin(t * 0.05 + i) * 6} y2={(ya + yb) / 2} stroke="#FFFFFF" strokeWidth={1 + i * 0.4} opacity={0.45} />}
              {!water && i > 3 && Array.from({ length: 10 }, (_, k) => <line key={k} x1={xa + (k + 0.5) * ((xb - xa) / 10)} y1={yb - 2} x2={xa + (k + 0.5) * ((xb - xa) / 10) + Math.sin(t * 0.04 + k + i) * 2} y2={yb - (yb - ya) * 0.5} stroke={T(rice[1])} strokeWidth={1 + i * 0.25} opacity={0.7} />)}
              <rect x={xa} y={yb - 2 - i * 0.6} width={xb - xa} height={3 + i * 1.2} fill={T('#8A7A50')} />
              <rect x={xb - 1.5 - i * 0.3} y={ya} width={3 + i * 0.6} height={yb - ya} fill={T('#8A7A50')} />
            </g>
          );
        });
      })}
      {Array.from({ length: palms }, (_, i) => {
        const r = (i + 0.5) / palms, row = 1 + Math.floor(hash(i, 3) * 6), py = rowY(row), sc = 0.35 + Math.pow(row / rows, 1.7) * 2.2;
        return <SugarPalm key={i} x={x0 + (r + (hash(i, 4) - 0.5) * 0.08) * w} y={py} h={210 * sc} tone={tone} lean={(hash(i, 5) - 0.5) * 8} />;
      })}
      {Array.from({ length: farmers }, (_, i) => { const row = 5 + i, py = rowY(row) - 4, sc = Math.pow(row / rows, 1.7) * 2.2; return <Person key={i} x={x0 + w * (0.3 + i * 0.35) + Math.sin(t * 0.01 + i) * 20} y={py} h={70 * sc} pose={i ? 'carry' : 'stand'} t={t} color={T('#2F3A4E')} hat="cone" seed={i} />; })}
    </g>
  );
};

export const BorderMarker: React.FC<{ x: number; y: number; s?: number; num?: string }> = ({ x, y, s = 1, num = '' }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round">
    <ellipse cx={20} cy={4} rx={130} ry={16} fill="#000" opacity={0.25} />
    <path d="M-90,0 L-90,-40 L90,-40 L130,-60 L130,-20 L90,0 Z" fill="#B9B2A2" stroke={INK} strokeWidth={3} />
    <path d="M-70,-40 L-70,-420 L70,-420 L70,-40 Z" fill="#ECE8DE" stroke={INK} strokeWidth={3} />
    <path d="M70,-40 L70,-420 L104,-438 L104,-58 Z" fill="#CFC9BA" stroke={INK} strokeWidth={3} />
    <path d="M-70,-420 L-36,-438 L104,-438 L70,-420 Z" fill="#F6F3EA" stroke={INK} strokeWidth={3} />
    <text x={0} y={-330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#B3262B" transform="rotate(0)">VIỆT</text>
    <text x={0} y={-292} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#B3262B">NAM</text>
    <rect x={-40} y={-262} width={80} height={6} fill="#B3262B" />
    {num && <text x={0} y={-200} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#22201E">{num}</text>}
    <text transform="translate(90,-150) skewY(-28) rotate(-90)" textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={20} fill="#2F4A8A">CAMPUCHIA</text>
  </g>
);

export const MekongFerry: React.FC<{ id?: string; x?: number; y: number; w?: number; progress: number; t?: number; tone?: Tone; s?: number }> = ({ id = 'ferry', x = 540, y, w = 1080, progress, t = 0, tone = 'day', s = 1.6 }) => {
  const x0 = x - w / 2, dark = tone === 'day' ? 0 : tone === 'dusk' ? 0.35 : 0.7, T = (c: string) => mix(c, '#1A1E30', dark);
  const fx = lerp(x0 + w * 0.3, x0 + w * 0.7, clamp(progress)), bob = Math.sin(t * 0.08) * 3, fy = y + 420 + bob, moving = progress > 0.01 && progress < 0.99;
  return (
    <g>
      <defs><linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={T('#8A7A5A')} /><stop offset="1" stopColor={T('#6A5E48')} /></linearGradient></defs>
      <rect x={x0} y={y} width={w} height={1600} fill={`url(#${id}-w)`} />
      {/* far bank + near banks with landing ramps */}
      <path d={`M${x0},${y} ${Array.from({ length: 16 }, (_, i) => `Q${x0 + (i + 0.5) * (w / 16)},${y - 20 - hash(i, 1) * 26} ${x0 + (i + 1) * (w / 16)},${y - 4}`).join(' ')} L${x0 + w},${y + 6} L${x0},${y + 6} Z`} fill={T('#4E7A3A')} />
      <path d={`M${x0},${y + 260} L${x0 + w * 0.1},${y + 260} L${x0 + w * 0.16},${y + 520} L${x0},${y + 560} Z`} fill={T('#A08A5E')} stroke={INK} strokeWidth={2} />
      <path d={`M${x0 + w},${y + 260} L${x0 + w * 0.9},${y + 260} L${x0 + w * 0.84},${y + 520} L${x0 + w},${y + 560} Z`} fill={T('#A08A5E')} stroke={INK} strokeWidth={2} />
      {Array.from({ length: 14 }, (_, i) => { const lx = x0 + ((hash(i, 2) * w + t * 0.6) % w), ly = y + 40 + hash(i, 3) * 1000; return <line key={i} x1={lx} y1={ly} x2={lx + 50 + hash(i, 4) * 60} y2={ly} stroke="#FFFFFF" strokeWidth={2} opacity={0.25} />; })}
      {moving && Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${fx - (150 + i * 40) * s},${fy + (20 + i * 4) * s} q${-30 * s},${(8 + i * 3) * s} ${-60 * s},0`} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.4 - i * 0.08} />)}
      {/* the ferry: flat pontoon, rails, a small tug cabin, a truck and three people */}
      <g transform={`translate(${fx},${fy}) scale(${s})`} strokeLinejoin="round">
        <path d="M-170,0 L170,0 L150,26 L-150,26 Z" fill={T('#5A6670')} stroke={INK} strokeWidth={3} />
        <rect x={-170} y={-8} width={340} height={8} fill={T('#7E8A92')} stroke={INK} strokeWidth={2} />
        <rect x={110} y={-62} width={50} height={54} fill={T('#E6E0D0')} stroke={INK} strokeWidth={2.5} /><rect x={118} y={-52} width={34} height={16} fill={T('#5E8FB0')} />
        <g transform="translate(-80,-8)">
          <rect x={-60} y={-60} width={90} height={52} fill={T('#5C6A30')} stroke={INK} strokeWidth={2.5} />
          <path d="M30,-8 V-46 H58 L72,-28 V-8 Z" fill={T('#4E5A28')} stroke={INK} strokeWidth={2.5} />
          {[-40, 10, 52].map((wx) => <circle key={wx} cx={wx} cy={-6} r={11} fill="#1A1A1E" />)}
        </g>
        {[20, 50, 80].map((px, i) => <Person key={i} x={px} y={-8} h={58} pose={i === 1 ? 'wave' : 'stand'} t={t} color={['#3A4A63', '#7A3B3B', '#3F6B4A'][i]} hat={i === 2 ? 'krama' : 'none'} seed={i} />)}
      </g>
    </g>
  );
};
