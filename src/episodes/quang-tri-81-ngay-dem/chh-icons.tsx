import React from 'react';
import { Glow } from '../../countryball/fx-glow';
import { clamp, flicker, hash } from '../../countryball/fx-math';

// Chapter H icons (quiet, no people drawn): backpack, school desk, cinema seats, music notes, letter, speech bubble,
// grass field, and a small wooden boat (đò) with a lantern. All pure functions of props / frames `t`.

const INK = '#0B1018';

/** Olive backpack, (x, y) = bottom centre. */
export const Backpack: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <ellipse cy={2} rx={42} ry={8} fill="#000" opacity={0.3} stroke="none" />
    <rect x={-36} y={-92} width={72} height={90} rx={22} fill="#5F6E3C" />
    <path d="M-36,-62 Q0,-40 36,-62 L36,-48 Q0,-26 -36,-48 Z" fill="#4C5A2E" />
    <rect x={-22} y={-34} width={44} height={28} rx={8} fill="#6D7D45" />
    <path d="M-18,-92 Q0,-120 18,-92" fill="none" strokeWidth={6} />
  </g>
);

/** Side-on school desk with chair, (x, y) = floor. */
export const Desk: React.FC<{ x: number; y: number; s?: number; lit?: number }> = ({ x, y, s = 1, lit = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
    <ellipse cy={4} rx={150} ry={12} fill="#000" opacity={0.3} stroke="none" />
    <path d="M-70,-16 L-70,-150 M60,-16 L60,-150" fill="none" strokeWidth={9} stroke="#2A2F3A" />
    <rect x={-66} y={-150} width={120} height={16} rx={5} fill="#8A6A44" />
    <path d="M-80,-120 L80,-120 L100,-170 L-60,-170 Z" fill="#A27B4F" />
    <path d="M60,-16 L60,-150" fill="none" strokeWidth={9} stroke="#2A2F3A" />
    <path d="M-150,-86 L-150,-18 M-80,-86 L-80,-18" fill="none" strokeWidth={8} stroke="#2A2F3A" />
    <rect x={-160} y={-96} width={96} height={14} rx={5} fill="#8A6A44" />
    <path d="M-160,-96 L-168,-190" fill="none" strokeWidth={8} stroke="#2A2F3A" />
    <rect x={-182} y={-206} width={30} height={90} rx={6} fill="#8A6A44" transform="rotate(-6,-170,-160)" />
    {lit > 0 && <rect x={-20} y={-182} width={50} height={12} rx={3} fill="#F2EBD8" transform="rotate(-8,0,-176)" opacity={0.9} />}
  </g>
);

/** Rows of cinema seats seen from behind (perspective), `filled` 0..1 = share of seats with a head (a dot). Screen glow above. */
export const CinemaSeats: React.FC<{ t: number; filled: number; id: string }> = ({ t, filled, id }) => {
  const rows = 7, items: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const k = r / (rows - 1), y = 470 + Math.pow(k, 1.25) * 560, sc = 0.45 + 1.15 * k, n = 15 - r, gap = 118 * sc;
    for (let c = 0; c < n; c++) {
      const x = 960 + (c - (n - 1) / 2) * gap, order = hash(r * 31 + c, 3), on = filled > order;
      items.push(
        <g key={`${r}-${c}`} transform={`translate(${x},${y}) scale(${sc})`}>
          <rect x={-42} y={-70} width={84} height={78} rx={18} fill="#4B1C2A" stroke={INK} strokeWidth={4} />
          <rect x={-46} y={-30} width={14} height={44} rx={6} fill="#3A1520" stroke={INK} strokeWidth={3} />
          <rect x={32} y={-30} width={14} height={44} rx={6} fill="#3A1520" stroke={INK} strokeWidth={3} />
          {on && <circle cy={-86} r={24} fill="#0E0A12" stroke="#7A5B6A" strokeWidth={3} />}
        </g>,
      );
    }
  }
  const f = 0.9 + 0.1 * Math.sin(t / 5);
  return (
    <g>
      <defs><linearGradient id={`${id}-scr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4EAD0" /><stop offset="1" stopColor="#B9A98A" /></linearGradient></defs>
      <rect x={470} y={90} width={980} height={290} rx={10} fill={`url(#${id}-scr)`} opacity={0.92 * f} />
      <Glow x={960} y={250} r={760} color="#FFE2A8" o={0.42 * f} />
      {items}
    </g>
  );
};

/** Music note (beamed pair or single). (x, y) = head. */
export const Note: React.FC<{ x: number; y: number; s?: number; pair?: boolean; color?: string; rot?: number }> = ({ x, y, s = 1, pair, color = '#FFE9B8', rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} fill={color} stroke="#0A0F1C" strokeWidth={4} strokeLinejoin="round">
    {pair ? (
      <>
        <ellipse cx={0} cy={0} rx={17} ry={12} transform="rotate(-20)" /><ellipse cx={58} cy={-12} rx={17} ry={12} transform="rotate(-20,58,-12)" />
        <path d="M13,-3 L13,-92 L71,-108 L71,-18" fill="none" strokeWidth={8} stroke="#0A0F1C" /><path d="M13,-3 L13,-92 L71,-108 L71,-18" fill="none" strokeWidth={4} stroke={color} />
        <path d="M13,-92 L71,-108 L71,-86 L13,-70 Z" />
      </>
    ) : (
      <>
        <ellipse cx={0} cy={0} rx={17} ry={12} transform="rotate(-20)" />
        <path d="M13,-3 L13,-92 Q34,-80 38,-58" fill="none" strokeWidth={8} stroke="#0A0F1C" /><path d="M13,-3 L13,-92 Q34,-80 38,-58" fill="none" strokeWidth={4} stroke={color} />
      </>
    )}
  </g>
);

/** Folded letter / message with a warm seal. (x, y) = centre. */
export const Letter: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <rect x={-96} y={-62} width={192} height={124} rx={10} fill="#F2E7C9" />
    <path d="M-96,-56 L0,12 L96,-56" fill="none" />
    <path d="M-96,56 L-30,-4 M96,56 L30,-4" fill="none" strokeWidth={3} opacity={0.6} />
    <circle cy={8} r={15} fill="#C9343A" strokeWidth={3} />
  </g>
);

/** Speech bubble with three dots (comments). (x, y) = centre. */
export const Bubble: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} stroke={INK} strokeWidth={6} strokeLinejoin="round">
    <path d="M-120,-70 Q-120,-96 -94,-96 L94,-96 Q120,-96 120,-70 L120,40 Q120,66 94,66 L-20,66 L-70,112 L-62,66 L-94,66 Q-120,66 -120,40 Z" fill="#F2E7C9" />
    {[-52, 0, 52].map((dx, i) => <circle key={i} cx={dx} cy={-14 - 7 * Math.max(0, Math.sin(t / 7 - i * 1.1))} r={13} fill="#8A6A44" stroke="none" />)}
  </g>
);

/** Swaying grass field from y0 down to the bottom: layered rows of blades, no mounds. */
export const GrassField: React.FC<{ t: number; y0?: number; tone?: number }> = ({ t, y0 = 560, tone = 0.5 }) => {
  const rows = 9;
  const cols = ['#27402A', '#2F4A30', '#365635', '#3E6140', '#47704A', '#4F7C51', '#59885A', '#639463', '#6FA06E'];
  return (
    <g>
      {Array.from({ length: rows }, (_, r) => {
        const k = r / (rows - 1), y = y0 + 40 + Math.pow(k, 1.1) * (1080 - y0 - 10), h = 22 + 70 * k, step = 11 + 22 * k;
        let d = `M-40,1100 L-40,${y}`;
        for (let x = -40; x < 1980; x += step) {
          const sway = Math.sin(t / 26 + x / 90 + r) * (3 + 7 * k), hh = h * (0.6 + 0.6 * hash(Math.round(x / step), r));
          d += ` L${x},${y} L${x + step * 0.5 + sway},${y - hh} L${x + step},${y}`;
        }
        return <path key={r} d={`${d} L1980,1100 Z`} fill={cols[r]} opacity={0.4 + 0.6 * clamp(tone + 0.5)} />;
      })}
    </g>
  );
};

/** Small wooden boat (đò) in side view with a rower silhouette and a lantern at the bow. (x, y) = waterline centre. Glides, no wake spray. */
export const Boat: React.FC<{ x: number; y: number; s?: number; t: number; flip?: boolean }> = ({ x, y, s = 1, t, flip }) => {
  const rock = Math.sin(t / 34) * 1.2, f = flicker(t * 0.6, 3), row = Math.sin(t / 46) * 7;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <g opacity={0.26} transform="scale(1,-0.5) translate(0,-6)" style={{ filter: 'blur(2px)' }}><path d="M-150,-26 Q-120,6 -20,8 L110,8 Q150,0 170,-30 Z" fill="#FFB347" /></g>
      <ellipse cy={6} rx={175} ry={11} fill="none" stroke="#CFE0FF" strokeWidth={3} opacity={0.25} />
      <ellipse cy={9} rx={235} ry={16} fill="none" stroke="#CFE0FF" strokeWidth={2} opacity={0.12 + 0.05 * Math.sin(t / 20)} />
      <g transform={`rotate(${rock})`}>
        <path d="M-150,-26 Q-120,6 -20,8 L110,8 Q150,0 170,-30 Z" fill="#3B2A22" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-142,-24 L162,-28" stroke="#6A4A38" strokeWidth={5} />
        {/* rower: plain dark silhouette seated at the stern, conical hat, oar */}
        <g transform="translate(-70,-28)" fill="#0D1320" stroke="#26334A" strokeWidth={3} strokeLinejoin="round">
          <path d="M-22,0 Q-24,-46 -4,-58 L12,-58 Q30,-46 28,0 Z" /><circle cx={4} cy={-72} r={13} />
          <path d="M-22,-76 L4,-100 L30,-76 Z" fill="#1B2638" />
        </g>
        <g transform={`translate(-60,-60) rotate(${28 + row * 0.7})`}><rect x={0} y={-3} width={190} height={6} rx={3} fill="#6A4A38" stroke={INK} strokeWidth={2} /><ellipse cx={190} cy={0} rx={22} ry={8} fill="#6A4A38" stroke={INK} strokeWidth={2} /></g>
        {/* bow lantern */}
        <line x1={140} y1={-28} x2={140} y2={-86} stroke="#6A4A38" strokeWidth={5} />
        <Glow x={140} y={-96} r={140 * f} color="#FFA43A" o={0.75} />
        <rect x={128} y={-112} width={24} height={30} rx={6} fill="#FFD27A" stroke={INK} strokeWidth={3} />
      </g>
    </g>
  );
};
