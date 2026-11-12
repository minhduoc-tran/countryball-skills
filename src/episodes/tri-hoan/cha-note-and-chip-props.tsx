import React from 'react';
import { FONT, UI, backOut, clamp, Look, LOOKS } from '../../engine';

// Chapter A props: the "MAI LÀM" sticky note (the episode's motif), small time chips, the teacher's look, and a few
// shared helpers. Everything is a pure function of its inputs.

/** The teacher: a bob in a green blazer (Mum's rig, our own colours). */
export const TEACHER: Look = { ...LOOKS.mom, hair: '#2A2028', jacket: '#3E7C6E', jacketShade: '#2F6256', accent: '#E9C46A', extra: 'bob' };

/**
 * The yellow note "MAI LÀM" (Itim, a little crooked). x, y its centre, w its width. `pop` 0..1 pops it on with an
 * overshoot (1 = settled), `curl` 0..1 curls its lower corner up as the days pass.
 */
export const StickyNote: React.FC<{ x: number; y: number; w?: number; rot?: number; pop?: number; curl?: number; ink?: string }> = ({
  x, y, w = 200, rot = -4, pop = 1, curl = 0, ink = '#4A3418',
}) => {
  const s = pop >= 1 ? 1 : backOut(clamp(pop));
  if (s <= 0.01) return null;
  const h = w * 0.96;
  const c = w * 0.2 * curl;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-w / 2 + w * 0.04} y={-h / 2 + w * 0.05} width={w} height={h} fill="#000" opacity={0.3} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#FFE27A" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.16} fill="#FFEFA8" />
      <rect x={-w / 2} y={h / 2 - h * 0.14} width={w} height={h * 0.14} fill="#F2CC55" />
      {/* the lower right corner, curling up */}
      <path d={`M ${w / 2} ${h / 2 - c * 1.6} L ${w / 2 - c * 1.6} ${h / 2} L ${w / 2 - c * 0.2} ${h / 2 - c * 0.2} Z`} fill="#D9AF3C" opacity={curl > 0 ? 1 : 0} />
      <text x={0} y={-h * 0.04} textAnchor="middle" fontFamily={FONT.hand} fontSize={w * 0.3} fill={ink} transform="rotate(-3)">MAI</text>
      <text x={w * 0.02} y={h * 0.27} textAnchor="middle" fontFamily={FONT.hand} fontSize={w * 0.3} fill={ink} transform="rotate(2)">LÀM</text>
      <path d={`M ${-w * 0.3} ${h * 0.34} q ${w * 0.15} ${w * 0.05} ${w * 0.3} 0 t ${w * 0.3} 0`} stroke={ink} strokeWidth={w * 0.018} fill="none" strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

/** A time chip in the corner (same look as the countdown chips): "1 TUẦN TRƯỚC", "2 GIỜ SAU". */
export const SideChip: React.FC<{ label: string; f: number; x?: number; y?: number }> = ({ label, f, x = 70, y = 70 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={label.length * 22 + 96} height={72} rx={36} fill={UI.pill} opacity={0.78} />
    <circle cx={38} cy={36} r={11} fill="#FFB15A" opacity={f % 30 < 18 ? 1 : 0.35} />
    <text x={62} y={48} fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={UI.text} letterSpacing={2}>{label}</text>
  </g>
);

/** A cartoon blink of light across a screen: a soft cool glow, used on faces lit by a laptop. */
export const ScreenGlow: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 260, o = 0.4 }) => (
  <circle cx={x} cy={y} r={r} fill="url(#g3cool)" opacity={o} style={{ mixBlendMode: 'screen' }} />
);

/** A deterministic scatter of note positions inside a box, for rooms and roads papered in notes. */
export const noteSpots = (n: number, box: [number, number, number, number], seed: number) =>
  Array.from({ length: n }).map((_, i) => {
    const a = Math.abs(Math.sin(seed * 31.7 + i * 12.9898) * 43758.5453) % 1;
    const b = Math.abs(Math.sin(seed * 17.3 + i * 78.233) * 43758.5453) % 1;
    const c = Math.abs(Math.sin(seed * 5.1 + i * 39.346) * 43758.5453) % 1;
    return { x: box[0] + a * (box[2] - box[0]), y: box[1] + b * (box[3] - box[1]), rot: (c - 0.5) * 30 };
  });
