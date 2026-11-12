import React from 'react';
import { FONT } from '../engine/fonts';
import { clamp, easeIn, easeInOut, easeOut, hash, lerp, prog } from './fx-math';
import { HeliSide } from './ground-helicopters';
import { WaterSplash } from './ground-water-splash';
import { mix } from './map-context';

// <CarrierDeck>: SIDE VIEW of a US Navy carrier / assault ship during Operation Frequent Wind (29-30.4.1975): helicopters from Sài Gòn land one
// after another and, to clear the deck, one UH-1 is pushed over the side. A calm illustration (grey hull, island with a turning radar, deck
// crew as tiny jersey-coloured figures without faces), not a slapstick gag.
//   <CarrierDeck id x? y? s? land? push? t? tone? hull? backdrop? />
//   y = the flight-deck line (px); the hull hangs below it down to the sea (~170 px), the island rises ~230 px; x = centre, s = scale
//   land 0..1   a Huey comes in from the left and sets down on the stern (flies 0-0.75, settles 0.75-1)
//   push 0..1   the parked Huey is pushed by the crew to the bow edge (0-0.45), tips and falls (0.45-0.75) and splashes (0.75+)
//   t frames (rotors, radar, waves)    tone 'day' | 'dusk'     hull: number painted on the island / bow (default "41")
// Pure function of its props.

const INK = '#1B1B1E';
const CREW = ['#E6C229', '#C63A32', '#3D8A4A', '#F2F2EA'];

const Crew: React.FC<{ x: number; y: number; k: number; s: number; c: string; lean?: number }> = ({ x, y, k, s, c, lean = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${lean}) scale(${1.1 * s})`}><rect x={-6} y={-30} width={12} height={21} rx={5} fill={c} stroke={INK} strokeWidth={1.5} /><path d="M-3,-10 L-4,0 M3,-10 L4,0" stroke={INK} strokeWidth={4} strokeLinecap="round" /><circle cx={0} cy={-37} r={6.4} fill={mix(c, '#000000', 0.5)} stroke={INK} strokeWidth={1.5} /><path d={`M6,-26 l${8 + k * 0},-6`} stroke={INK} strokeWidth={3.4} strokeLinecap="round" /></g>
);

export const CarrierDeck: React.FC<{ id: string; x?: number; y?: number; s?: number; land?: number; push?: number; t?: number; tone?: 'day' | 'dusk'; hull?: string; backdrop?: boolean }> = ({
  id, x = 960, y = 560, s = 1, land = 1, push = 0, t = 0, tone = 'day', hull = '41', backdrop = true,
}) => {
  const dusk = tone === 'dusk', T = (c: string) => (dusk ? mix(c, '#9A6A60', 0.3) : c), sea = y + 190 * s, hk = 1.5 * s;   // HeliSide size 300 -> k = 1.5 s
  const L = clamp(land), P = clamp(push), edge = x + 700 * s, rest = x + 120 * s;
  const sx = push > 0.001 ? lerp(rest, edge, easeInOut(prog(P, 0, 0.45))) : rest;
  const fall = prog(P, 0.45, 0.78), fx = sx + 30 * s * easeOut(fall), fy = y - 22 * hk + (sea - y + 20 * s) * easeIn(fall), tilt = -75 * easeIn(fall);
  const parkedHidden = fall >= 1 || (P >= 0.78);
  const fly = easeOut(prog(L, 0, 0.75)), set = easeInOut(prog(L, 0.75, 1));
  const lx = lerp(x - 1500 * s, x - 780 * s, fly), ly = y - 22 * hk - (1 - set) * 120 * s - (1 - fly) * 180 * s;
  const ang = (t * 3) % 360;
  return (
    <g>
      {backdrop && (
        <g>
          <defs>
            <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dusk ? '#5E6DA6' : '#8EC3E8'} /><stop offset="1" stopColor={dusk ? '#F6B677' : '#E2F1F8'} /></linearGradient>
            <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={T('#3F7FA8')} /><stop offset="1" stopColor={T('#1F4A70')} /></linearGradient>
          </defs>
          <rect width={1920} height={sea} fill={`url(#${id}-sky)`} />
          {dusk && <circle cx={260} cy={sea - 40} r={110} fill="#FFD9A0" opacity={0.75} />}
          <rect y={sea - 6} width={1920} height={1086 - sea} fill={`url(#${id}-sea)`} />
          {Array.from({ length: 20 }, (_, i) => { const wx = ((hash(i, 1) * 2300 + t * (1 + hash(i, 5))) % 2100) - 100, wy = sea + 14 + hash(i, 2) * (1080 - sea); return <path key={i} d={`M${wx},${wy} q24,-8 48,0 t48,0`} fill="none" stroke="#E8F4FF" strokeWidth={3} opacity={0.3 + 0.3 * hash(i, 3)} />; })}
        </g>
      )}
      <g strokeLinejoin="round">
        {/* hull: raked bow on the right, long overhanging deck */}
        <path d={`M${x - 1200 * s},${y} L${x + 980 * s},${y} Q${x + 1010 * s},${y + 30 * s} ${x + 930 * s},${y + 90 * s} L${x + 760 * s},${sea + 14 * s} L${x - 960 * s},${sea + 14 * s} Q${x - 1100 * s},${y + 90 * s} ${x - 1200 * s},${y}Z`} fill={T('#6D7782')} stroke={INK} strokeWidth={5} />
        <path d={`M${x - 1180 * s},${y + 40 * s} H${x + 960 * s}`} stroke={T('#4C5560')} strokeWidth={6 * s} />
        <path d={`M${x - 1100 * s},${y + 110 * s} L${x + 840 * s},${y + 110 * s}`} stroke={T('#59636E')} strokeWidth={4 * s} />
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={x - 1000 * s + i * 90 * s} cy={y + 70 * s} r={7 * s} fill={T('#2C343C')} stroke={INK} strokeWidth={2} />)}
        <path d={`M${x - 1200 * s},${y - 3} H${x + 980 * s}`} stroke={T('#B8BEC4')} strokeWidth={8 * s} />
        <path d={`M${x - 1200 * s},${y - 3} H${x + 980 * s}`} stroke="#F4F2E8" strokeWidth={2} strokeDasharray={`${40 * s} ${30 * s}`} />
        <text x={x + 800 * s} y={y + 96 * s} textAnchor="middle" fontSize={64 * s} fontFamily={FONT.title} fontWeight={900} fill="#F4F2E8" stroke={INK} strokeWidth={4} paintOrder="stroke">{hull}</text>
        {/* island + radar */}
        <path d={`M${x + 250 * s},${y} V${y - 130 * s} L${x + 300 * s},${y - 150 * s} H${x + 520 * s} L${x + 540 * s},${y - 120 * s} V${y}Z`} fill={T('#8B949E')} stroke={INK} strokeWidth={4} />
        <rect x={x + 300 * s} y={y - 230 * s} width={190 * s} height={82 * s} fill={T('#A0A8B0')} stroke={INK} strokeWidth={4} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={x + 316 * s + i * 34 * s} y={y - 210 * s} width={22 * s} height={22 * s} fill={T('#2F4A5C')} stroke={INK} strokeWidth={2} />)}
        <path d={`M${x + 360 * s},${y - 230 * s} V${y - 330 * s}M${x + 450 * s},${y - 230 * s} V${y - 300 * s}`} stroke={INK} strokeWidth={6 * s} />
        <ellipse cx={x + 360 * s} cy={y - 338 * s} rx={Math.abs(Math.cos((ang * Math.PI) / 180)) * 52 * s + 4} ry={12 * s} fill={T('#C9CFD4')} stroke={INK} strokeWidth={3} />
        <path d={`M${x - 960 * s},${sea + 4 * s} Q${x - 300 * s},${sea - 8 * s} ${x + 760 * s},${sea + 4 * s}`} fill="none" stroke="#F4FAFF" strokeWidth={8 * s} opacity={0.8} />
      </g>
      {/* parked CH-53 near the island, the Huey that is pushed, the Huey that lands */}
      <HeliSide x={x - 330 * s} y={y - 22 * 1.7 * s} size={340 * s} kind="ch53" t={0} />
      {!parkedHidden && <g transform={`rotate(${tilt} ${fx} ${fy})`}><HeliSide x={fx} y={fy} size={300 * s} kind="uh1" t={0} /></g>}
      {push > 0.1 && push < 0.46 && [0, 1, 2].map((i) => <Crew key={i} x={sx - 200 * s - i * 34 * s} y={y} k={i} s={s} c={CREW[i]} lean={-8} />)}
      {[[-1010, 0], [-150, 1], [-20, 2], [180, 3]].map(([cx, i]) => <Crew key={cx} x={x + cx * s} y={y} k={0} s={s} c={CREW[i]} />)}
      <HeliSide x={lx} y={ly} size={300 * s} kind="uh1" t={t} />
      {push > 0.78 && <WaterSplash t={P * 100} t0={78} x={fx} y={sea + 10 * s} r={46 * s} />}
    </g>
  );
};
