import React from 'react';
import { Bicycle } from '../engine/street-props';
import { MarketStall } from '../engine/street-bus-market';
import { clamp, hash, lerp, prog } from './fx-math';
import { mix } from './map-context';
import { Crowd, Person } from './tay-nam-people-silhouettes';

// <PhnomPenhStreet id? x? y w? life t backdrop? houses? />: a row of Phnôm Pênh shophouses, side-on, for the 1975 emptied city and the 1979 return (screen px,
// y = pavement line, w = width of the strip, t FRAMES; pure). `life` 0..1:
//   0  = empty city: rolling shutters down, wooden window shutters closed, dust drifting, a sheet of paper tumbling, grey dusty light, nobody
//   1  = city coming back: shutters up, awnings out, market stalls, bicycles and a cyclist riding, people walking, warm light, potted plants
//   animate it with prog(t, a, b); in between, things appear in a seeded order (shutters first, then stalls, then people).
// No people at life 0 (the safety rule: never show victims; the empty street tells it). Engine Bicycle / MarketStall are reused (in street
// units 100 px/m, scaled here to the house scale).

const INK = '#18161C';
const WALLS = ['#D9C7A0', '#C9B48E', '#E0CFA8', '#BFAF8C', '#D4BC94', '#CDBF9F'];

const Shophouse: React.FC<{ x: number; y: number; w: number; floors: number; open: number; seed: number; dust: number }> = ({ x, y, w, floors, open, seed, dust }) => {
  const fh = w * 0.62, H = fh * floors + w * 0.18, wall = mix(WALLS[seed % WALLS.length], '#A8A090', dust * 0.45);
  const shutterUp = clamp(open * 1.6), winOpen = clamp(open * 1.6 - 0.3);
  return (
    <g strokeLinejoin="round">
      <rect x={x} y={y - H} width={w} height={H} fill={wall} stroke={INK} strokeWidth={2.5} />
      <path d={`M${x - 6},${y - H} H${x + w + 6} V${y - H + w * 0.07} H${x - 6} Z`} fill={mix(wall, '#000000', 0.25)} stroke={INK} strokeWidth={2} />
      {/* upper floors: two windows each, wooden shutters that swing open */}
      {Array.from({ length: floors - 1 }, (_, f) => {
        const fy = y - fh * (f + 2) + fh * 0.18;
        return [0.18, 0.58].map((px, j) => (
          <g key={`${f}-${j}`}>
            <rect x={x + px * w} y={fy} width={w * 0.24} height={fh * 0.5} fill="#2A2830" stroke={INK} strokeWidth={2} />
            {[0, 1].map((side) => <rect key={side} x={x + px * w + (side ? w * 0.12 : 0) + (side ? 1 : -1) * winOpen * w * 0.1} y={fy} width={w * 0.12 * (1 - 0.7 * winOpen)} height={fh * 0.5} fill={mix('#6E8A6A', '#8A7A5A', (seed + j) % 2 * 0.5)} stroke={INK} strokeWidth={1.5} />)}
            <rect x={x + px * w - 4} y={fy + fh * 0.5} width={w * 0.24 + 8} height={6} fill={mix(wall, '#000000', 0.3)} />
            {winOpen > 0.6 && (seed + j + f) % 2 === 0 && <ellipse cx={x + px * w + w * 0.12} cy={fy + fh * 0.5} rx={w * 0.09} ry={w * 0.05} fill="#4E7A3A" />}
          </g>
        ));
      })}
      {/* ground floor: rolling shutter that rises */}
      <rect x={x + w * 0.08} y={y - fh * 0.82} width={w * 0.84} height={fh * 0.82} fill="#3A3232" />
      <g>
        {(() => { const sh = fh * 0.82 * (1 - shutterUp); return (
          <g>
            <rect x={x + w * 0.08} y={y - fh * 0.82} width={w * 0.84} height={sh} fill={mix('#8C8C90', '#9A948A', dust * 0.5)} stroke={INK} strokeWidth={1.5} />
            {Array.from({ length: Math.floor(sh / 9) }, (_, i) => <line key={i} x1={x + w * 0.08} y1={y - fh * 0.82 + i * 9 + 6} x2={x + w * 0.92} y2={y - fh * 0.82 + i * 9 + 6} stroke="#5E5E64" strokeWidth={1.2} />)}
          </g>
        ); })()}
      </g>
      {/* striped awning unrolls with life */}
      {open > 0.4 && (() => { const a = clamp((open - 0.4) / 0.4), d = w * 0.22 * a; const c = ['#C8402C', '#2F7F8A', '#D99A2A', '#4A6EB0'][seed % 4]; return (
        <g>
          <path d={`M${x + w * 0.04},${y - fh * 0.86} H${x + w * 0.96} L${x + w * 0.96 + d * 0.2},${y - fh * 0.86 + d} H${x + w * 0.04 - d * 0.2} Z`} fill={c} stroke={INK} strokeWidth={2} />
          {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${x + w * (0.13 + i * 0.18)},${y - fh * 0.86} l${d * 0.02},${d} h${w * 0.09} l${-d * 0.02},${-d} Z`} fill="#F2E6D0" opacity={0.85} />)}
        </g>
      ); })()}
      {/* house number sign */}
      <rect x={x + w * 0.4} y={y - H + w * 0.1} width={w * 0.2} height={w * 0.08} fill="#2F4A6A" stroke={INK} strokeWidth={1.5} />
    </g>
  );
};

export const PhnomPenhStreet: React.FC<{ id?: string; x?: number; y: number; w?: number; life: number; t: number; backdrop?: boolean; houses?: number }> = ({ id = 'ppst', x = 540, y, w = 1080, life, t, backdrop = true, houses = 5 }) => {
  const L = clamp(life), dust = 1 - L, hw = w / houses, m = hw / 4.2;                     // m = px per metre (a shophouse ~4.2 m wide)
  const x0 = x - w / 2, skyTop = mix('#C9C2B0', '#8CC4E8', L), skyBot = mix('#E6DCC4', '#F4E4C0', L);
  return (
    <g>
      {backdrop && <>
        <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={skyTop} /><stop offset="1" stopColor={skyBot} /></linearGradient></defs>
        <rect x={x0} y={y - 1400} width={w} height={1400} fill={`url(#${id}-sky)`} />
        <rect x={x0} y={y} width={w} height={60} fill={mix('#A69C8A', '#B9AE98', L)} />
        <rect x={x0} y={y + 60} width={w} height={1400} fill={mix('#6E6A64', '#5E5C5A', L)} />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={x0 + ((i * 220 + 40) % w)} y={y + 300} width={120} height={10} fill="#E8E2CC" opacity={0.6} />)}
      </>}
      {Array.from({ length: houses }, (_, i) => <Shophouse key={i} x={x0 + i * hw} y={y} w={hw} floors={2 + (i % 2)} open={clamp(L * 1.4 - hash(i, 2) * 0.4)} seed={i} dust={dust} />)}
      {/* life: stalls on the pavement, bicycles on the road, walkers */}
      {L > 0.35 && [0.2, 0.62].map((p, i) => <g key={i} opacity={clamp((L - 0.35 - i * 0.1) * 4)}><MarketStall x={x0 + p * w} y={y + 40} s={m / 100 * 1.15} seed={i + 2} variant={i} pop={1} t={t} glow={false} /></g>)}
      {L > 0.55 && <g opacity={clamp((L - 0.55) * 4)}><Crowd x={x} y={y + 52} w={w * 0.9} n={7} h={1.6 * m} t={t} seed={3} walking /></g>}
      {L > 0.45 && [0, 1, 2].map((i) => {
        const dir = i % 2 ? -1 : 1, sp = 1.4 + hash(i, 4), span = w + 300, px = x0 - 150 + ((((hash(i, 6) * span + dir * t * sp) % span) + span) % span), py = y + 200 + i * 90;
        return (
          <g key={i} opacity={clamp((L - 0.45 - i * 0.08) * 4)}>
            <Bicycle x={px} y={py} s={(m / 100) * 0.5} facing={dir as 1 | -1} t={t} color={['#C75B48', '#2F7F8A', '#5A5A9A'][i]} />
            <Person x={px - dir * m * 0.12} y={py - m * 0.32} h={1.55 * m} pose="stand" color={['#3A4A63', '#7A3B3B', '#3F6B4A'][i]} hat={i === 1 ? 'cone' : 'none'} facing={dir as 1 | -1} seed={i + 4} />
          </g>
        );
      })}
      {/* empty city: dust motes drifting and a sheet of paper tumbling along the road */}
      {dust > 0.05 && <g opacity={dust}>
        {Array.from({ length: 40 }, (_, i) => { const px = x0 + ((hash(i, 1) * w + t * (0.8 + hash(i, 2) * 1.5)) % w), py = y - 500 + hash(i, 3) * 700 + Math.sin(t * 0.04 + i) * 20; return <circle key={i} cx={px} cy={py} r={1.5 + hash(i, 4) * 2.5} fill="#D8CBA8" opacity={0.5} />; })}
        {(() => { const u = (t % 150) / 150, px = lerp(x0 - 60, x0 + w + 60, u), py = y + 120 - Math.abs(Math.sin(u * Math.PI * 4)) * 40; return <rect x={px} y={py} width={34} height={24} fill="#EDE6D2" stroke="#8A8270" strokeWidth={1.5} transform={`rotate(${t * 6} ${px + 17} ${py + 12})`} opacity={prog(t, 0, 10)} />; })()}
        <rect x={x0} y={y - 1400} width={w} height={1460} fill="#C8B890" opacity={0.12 * dust} />
      </g>}
    </g>
  );
};
