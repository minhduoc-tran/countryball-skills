import React from 'react';
import { Glow } from '../../countryball/fx-glow';
import { Flare } from '../../countryball/fx-tracers-and-lights';
import { hash } from '../../countryball/fx-math';

// Side view of the destroyed iron bridge over the Thạch Hãn at night: two intact approaches, the middle span snapped in two
// halves that hang from their piers into the water. Dark, quiet, no people. `t` in frames. Unique ids via `id`.

const INK = '#0B0F16', STEEL = '#3A4658', STEEL_HI = '#6E7F96';

/** One truss span from x0 to x1: deck at y, height h, posts every `step` px with diagonals. */
const Truss: React.FC<{ x0: number; x1: number; y: number; h?: number; step?: number }> = ({ x0, x1, y, h = 110, step = 70 }) => {
  const n = Math.max(1, Math.round((x1 - x0) / step)), dx = (x1 - x0) / n;
  return (
    <g stroke={STEEL} strokeWidth={9} strokeLinecap="round" fill="none">
      <line x1={x0} y1={y} x2={x1} y2={y} strokeWidth={16} stroke={INK} />
      <line x1={x0} y1={y - 6} x2={x1} y2={y - 6} strokeWidth={9} />
      <line x1={x0} y1={y - h} x2={x1} y2={y - h} stroke={STEEL_HI} />
      {Array.from({ length: n + 1 }, (_, i) => <line key={`p${i}`} x1={x0 + i * dx} y1={y} x2={x0 + i * dx} y2={y - h} strokeWidth={6} />)}
      {Array.from({ length: n }, (_, i) => <line key={`d${i}`} x1={x0 + i * dx} y1={y} x2={x0 + (i + 1) * dx} y2={y - h} strokeWidth={4.5} opacity={0.85} />)}
    </g>
  );
};

export const BrokenBridge: React.FC<{ id: string; t: number }> = ({ id, t }) => {
  const s = t / 30, drift = -s * 16, deckY = 600, waterY = 760;
  const sway = Math.sin(s * 1.4) * 0.6;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070D1A" /><stop offset="0.7" stopColor="#1A2538" /><stop offset="1" stopColor="#4A2E2A" /></linearGradient>
        <linearGradient id={`${id}-wat`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14243A" /><stop offset="1" stopColor="#070E19" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${id}-sky)`} />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={hash(i, 1) * 1920} cy={hash(i, 2) * 420} r={1 + hash(i, 3) * 1.6} fill="#DDE8FF" opacity={0.25 + 0.5 * Math.abs(Math.sin(s * 1.2 + i))} />)}
      {/* distant fires on the horizon */}
      <Glow x={1500} y={waterY - 30} r={420} color="#FF7A2E" o={0.3 + 0.05 * Math.sin(s * 6)} />
      <Glow x={380} y={waterY - 20} r={300} color="#FF8A3A" o={0.16} />
      <path d={`M0,${waterY} L0,${waterY - 70} Q260,${waterY - 120} 560,${waterY - 80} T1160,${waterY - 90} T1920,${waterY - 70} L1920,${waterY} Z`} fill="#0A140F" />
      <g transform={`translate(${drift},0)`}>
        {/* piers (concrete, chipped) */}
        {[440, 1260].map((px) => <g key={px}><rect x={px - 34} y={deckY} width={68} height={waterY - deckY + 120} fill="#2A3140" stroke={INK} strokeWidth={5} /><path d={`M${px - 34},${deckY + 90} l18,14 l-10,26 l22,18`} fill="none" stroke={INK} strokeWidth={4} /></g>)}
        <Truss x0={-400} x1={440} y={deckY} step={84} />
        <Truss x0={1260} x1={2200} y={deckY} step={84} />
        {/* left half of the middle span: hangs from the left pier, nose in the water */}
        <g transform={`rotate(${26 + sway},440,${deckY})`}><Truss x0={440} x1={800} y={deckY} step={72} /></g>
        {/* right half: sagging from the right pier */}
        <g transform={`rotate(${-22 - sway},1260,${deckY})`}><Truss x0={900} x1={1260} y={deckY} step={72} /></g>
      </g>
      {/* river */}
      <rect x={0} y={waterY} width={1920} height={320} fill={`url(#${id}-wat)`} />
      {Array.from({ length: 24 }, (_, i) => {
        const y = waterY + 16 + hash(i, 4) * 280, L = 60 + hash(i, 5) * 160, x = ((hash(i, 6) * 2200 + s * (24 + 20 * hash(i, 7))) % 2300) - 200;
        return <line key={i} x1={x} y1={y} x2={x + L} y2={y} stroke="#8FB4D6" strokeWidth={2.4} strokeLinecap="round" opacity={0.1 + 0.2 * hash(i, 8)} />;
      })}
      <Glow x={1250} y={waterY + 60} r={260} color="#FF8A3A" o={0.12} />
      <Flare t={t} t0={4} x={1560} y={300} r={150} life={150} />
    </g>
  );
};
