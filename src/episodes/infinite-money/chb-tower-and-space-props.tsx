import React from 'react';
import { clamp, easeOut, rnd, Glow, FONT, UI } from '../../engine';

// Chapter B props (4/5): the tallest tower, simple crowd figures, the roof door, the rocket, the capsule window and the
// Earth behind it. Pure functions of t.

/** A simple stick-style person (head, body, legs, optional raised arms), ~250 tall at s 1, feet at (x, y). */
export const Figure: React.FC<{ x: number; y: number; s?: number; c?: string; skin?: string; hair?: string; t?: number; up?: number; sit?: boolean; flip?: boolean; seed?: number; walk?: number }> = ({
  x, y, s = 1, c = '#5B8FCC', skin = '#F2C9A0', hair = '#3A2A20', t = 0, up = 0, sit = false, flip = false, seed = 0, walk = 0,
}) => {
  const bob = Math.sin(t / 4 + seed * 2.3) * 3 * (up + walk);
  const sw = Math.sin(t / 3 + seed) * 0.5 * walk;
  const arm = (sd: number) => `M ${sd * 22} -150 L ${sd * 44} ${-150 - (up * 95 + 10) * (sd > 0 ? 1 : 0.8) + (1 - up) * 70}`;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <ellipse cx={0} cy={2} rx={42} ry={8} fill="#000" opacity={0.3} />
      {sit ? (
        <path d="M -14 -84 L 50 -84 L 50 -4 M 14 -84 L 62 -84 L 62 -4" stroke="#2E2B3D" strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ) : (
        <path d={`M -14 -96 L ${-16 + sw * 30} -6 M 14 -96 L ${16 - sw * 30} -6`} stroke="#2E2B3D" strokeWidth={17} strokeLinecap="round" fill="none" />
      )}
      <rect x={-27} y={-190 + (sit ? 40 : 0) + 22} width={54} height={sit ? 90 : 100} rx={22} fill={c} />
      <path d={arm(-1)} stroke={c} strokeWidth={17} strokeLinecap="round" fill="none" />
      <path d={arm(1)} stroke={c} strokeWidth={17} strokeLinecap="round" fill="none" />
      <circle cx={0} cy={-206 + (sit ? 40 : 0)} r={27} fill={skin} stroke="#2A1A14" strokeWidth={2.5} />
      <path d={`M -27 ${-212 + (sit ? 40 : 0)} Q 0 ${-246 + (sit ? 40 : 0)} 27 ${-212 + (sit ? 40 : 0)} Q 12 ${-224 + (sit ? 40 : 0)} -27 ${-212 + (sit ? 40 : 0)} Z`} fill={hair} />
    </g>
  );
};
export const CROWD_COLORS = ['#D94452', '#E9B84A', '#58B368', '#8E6AD8', '#E8864A', '#3E8CC8', '#E86AA6'];

// ---------- the tallest tower, seen from the foot of it: it narrows toward the sky; windows lit by hash ----------
export const Tower: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const top = -2300;
  const base = 1500;
  const wAt = (y: number) => 340 - 150 * ((base - y) / (base - top));
  const rows: React.ReactNode[] = [];
  for (let r = 0; r < 46; r++) {
    const y = base - 60 - r * 82;
    const w = wAt(y);
    for (let c = 0; c < 6; c++) {
      const lit = rnd(r + 3, c) > 0.45;
      const x = 960 - w + (c + 0.5) * ((2 * w) / 6);
      rows.push(<rect key={`${r}-${c}`} x={x - w / 14} y={y - 24} width={w / 7} height={44} rx={4} fill={lit ? '#FFE3A0' : '#3A4A6A'} opacity={lit ? 0.9 : 0.8} />);
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A2A6A" /><stop offset="0.55" stopColor="#C8648A" /><stop offset="1" stopColor="#FFB070" /></linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5A6A8E" /><stop offset="0.6" stopColor="#3E4A6A" /><stop offset="1" stopColor="#2A3350" /></linearGradient>
      </defs>
      <rect x={-600} y={-2600} width={3120} height={4200} fill={`url(#${id}sky)`} />
      {[[-200, 0.8], [260, 0.6], [1500, 0.7], [1900, 0.9]].map(([x, k], i) => (
        <rect key={i} x={(x as number) - 160} y={base - 1000 * (k as number) - rnd(i, 2) * 300} width={320} height={2000} fill="#4A3A6A" opacity={0.8} />
      ))}
      <path d={`M ${960 - wAt(base)} ${base} L ${960 - wAt(top)} ${top} L ${960 + wAt(top)} ${top} L ${960 + wAt(base)} ${base} Z`} fill={`url(#${id}t)`} stroke="#1E2438" strokeWidth={6} />
      <path d={`M ${960 + wAt(base) - 40} ${base} L ${960 + wAt(top) - 20} ${top} L ${960 + wAt(top)} ${top} L ${960 + wAt(base)} ${base} Z`} fill="#FFB070" opacity={0.18} />
      {rows}
      <rect x={950} y={top - 220} width={20} height={220} fill="#C8CCD8" />
      <circle cx={960} cy={top - 226} r={12} fill="#FF4A4A" opacity={0.4 + 0.6 * (Math.sin(t / 5) > 0 ? 1 : 0.2)} />
      <Glow x={960} y={top - 226} r={80} kind="red" o={0.5 * (Math.sin(t / 5) > 0 ? 1 : 0.2)} />
      <rect x={-600} y={base} width={3120} height={400} fill="#2A2638" />
    </g>
  );
};

// ---------- the roof door: a stairwell wall, a steel door swinging out onto golden light ----------
export const RoofDoor: React.FC<{ t: number; open: number }> = ({ t, open }) => {
  const o = easeOut(clamp(open));
  return (
    <g>
      <rect x={-300} y={-300} width={2600} height={1700} fill="#3A3A46" />
      <path d="M -300 200 H 2300 M -300 520 H 2300 M -300 840 H 2300" stroke="#2E2E38" strokeWidth={4} />
      <rect x={560} y={160} width={800} height={800} fill="#2A2630" />
      <rect x={600} y={200} width={720} height={760} fill="#FFC27A" />
      <rect x={600} y={200} width={720} height={420} fill="#FF8A5A" opacity={0.6} />
      <circle cx={1060} cy={520} r={90} fill="#FFF0C8" />
      <Glow x={960} y={520} r={900} o={0.3 + 0.5 * o} />
      <path d="M 640 960 L 1280 960 L 1700 1250 L 200 1250 Z" fill="#FFC27A" opacity={0.25 + 0.4 * o} />
      <g transform="translate(600 0)">
        <rect x={0} y={200} width={Math.max(40, 360 * (1 - o))} height={760} fill="#7A8296" stroke="#2A2E3A" strokeWidth={6} />
        <rect x={20} y={230} width={Math.max(10, 320 * (1 - o))} height={300} fill="#8E96AA" />
      </g>
      <g transform="translate(1320 0)">
        <rect x={-Math.max(40, 360 * (1 - o))} y={200} width={Math.max(40, 360 * (1 - o))} height={760} fill="#7A8296" stroke="#2A2E3A" strokeWidth={6} />
      </g>
      <rect x={1180} y={90} width={170} height={60} rx={8} fill="#2F8F6A" />
      <text x={1265} y={133} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill="#E9FFF2">ROOFTOP</text>
    </g>
  );
};

// ---------- the rocket: slim body, porthole with Pip, fins, a flame and smoke; origin at the nose-base centre ----------
export const Rocket: React.FC<{ x: number; y: number; s?: number; t: number; fire?: number }> = ({ x, y, s = 1, t, fire = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {fire > 0 ? (
      <g>
        <path d={`M -48 260 Q 0 ${420 + Math.sin(t) * 40 * fire + 160 * fire} 48 260 Z`} fill="#FF8A3D" opacity={0.95} />
        <path d={`M -28 260 Q 0 ${360 + Math.sin(t * 1.3) * 30 + 120 * fire} 28 260 Z`} fill="#FFE27A" />
        <Glow x={0} y={340} r={300} o={0.6 * fire} />
      </g>
    ) : null}
    <path d="M -80 -240 Q 0 -420 80 -240 L 80 250 L -80 250 Z" fill="#F2F0F6" stroke="#6A6A80" strokeWidth={5} strokeLinejoin="round" />
    <path d="M 20 -330 Q 70 -290 80 -240 L 80 250 L 28 250 Z" fill="#B8B6CC" opacity={0.55} />
    <path d="M -80 -240 Q 0 -420 80 -240 Z" fill="#D63C3C" />
    <path d="M -80 100 L -150 280 L -80 230 Z M 80 100 L 150 280 L 80 230 Z" fill="#D63C3C" stroke="#7A1E1E" strokeWidth={4} />
    <circle cx={0} cy={-60} r={50} fill="#2A3A5A" stroke="#6A6A80" strokeWidth={8} />
    <circle cx={0} cy={-56} r={34} fill="#F2C9A0" />
    <path d="M -34 -66 Q 0 -112 34 -66 Q 0 -86 -34 -66 Z" fill="#2E2A3A" />
    <circle cx={-11} cy={-52} r={4} fill="#1A1622" /><circle cx={11} cy={-52} r={4} fill="#1A1622" />
    <path d="M -12 -38 Q 0 -26 12 -38" stroke="#1A1622" strokeWidth={4} fill="none" strokeLinecap="round" />
    <rect x={-80} y={150} width={160} height={14} fill="#6A6A80" opacity={0.6} />
  </g>
);

// ---------- Earth, a sphere with continents and cloud, seen through the window ----------
export const Earth: React.FC<{ x: number; y: number; r: number; t: number; id: string }> = ({ x, y, r, t, id }) => (
  <g>
    <defs>
      <radialGradient id={`${id}e`} cx="0.35" cy="0.3" r="0.9"><stop offset="0" stopColor="#6FC3FF" /><stop offset="0.6" stopColor="#2A6AC8" /><stop offset="1" stopColor="#0E2A6A" /></radialGradient>
      <clipPath id={`${id}c`}><circle cx={x} cy={y} r={r} /></clipPath>
    </defs>
    <circle cx={x} cy={y} r={r * 1.07} fill="#7FC8FF" opacity={0.25} />
    <circle cx={x} cy={y} r={r} fill={`url(#${id}e)`} />
    <g clipPath={`url(#${id}c)`} transform={`translate(${(t * 0.6) % 600} 0)`}>
      {[-600, 0].map((o) => (
        <g key={o} transform={`translate(${o} 0)`}>
          <path d={`M ${x - r * 0.8} ${y - r * 0.2} q ${r * 0.3} ${-r * 0.5} ${r * 0.5} ${-r * 0.1} q ${r * 0.1} ${r * 0.5} ${-r * 0.15} ${r * 0.7} q ${-r * 0.3} ${r * 0.1} ${-r * 0.35} ${-r * 0.6} Z`} fill="#58B368" />
          <path d={`M ${x + r * 0.1} ${y + r * 0.1} q ${r * 0.4} ${-r * 0.3} ${r * 0.6} ${r * 0.1} q ${-r * 0.1} ${r * 0.5} ${-r * 0.4} ${r * 0.5} q ${-r * 0.3} ${-r * 0.2} ${-r * 0.2} ${-r * 0.6} Z`} fill="#4FA85A" />
          <path d={`M ${x - r * 0.4} ${y + r * 0.5} q ${r * 0.3} ${-r * 0.1} ${r * 0.6} 0 M ${x - r * 0.2} ${y - r * 0.6} q ${r * 0.4} ${-r * 0.1} ${r * 0.8} ${r * 0.05}`} stroke="#fff" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      ))}
    </g>
    <circle cx={x} cy={y} r={r} fill="none" stroke="#fff" strokeWidth={4} opacity={0.15} />
  </g>
);

/** The ticket price chip, in the mono face on a dark pill. */
export const PriceChip: React.FC<{ x: number; y: number; t: number; text: string; color?: string }> = ({ x, y, t, text, color = UI.live }) => {
  const k = clamp(t / 8);
  const sc = k <= 0 ? 0 : 1 + (1 - easeOut(k)) * 0.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${sc})`} opacity={clamp(t / 3)}>
      <rect x={-300} y={-48} width={600} height={96} rx={48} fill={UI.pill} opacity={0.82} />
      <text x={0} y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} fontWeight={700} fill={color} letterSpacing={2}>{text}</text>
    </g>
  );
};
