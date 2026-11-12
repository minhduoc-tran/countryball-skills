import React from 'react';
import { hash } from '../../countryball/fx-math';
import { star } from '../../countryball/ball-flags';

// Chapter D icons (all screen px, pure functions of props): A-37 jet (top + side), faceless person + crowd rows, snowflake, music note.

const INK = '#151515';
type Mark = 'rvn' | 'star';

const Roundel: React.FC<{ x: number; y: number; r: number; mark: Mark }> = ({ x, y, r, mark }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={mark === 'star' ? '#D8372F' : '#F2C230'} stroke={INK} strokeWidth={1.2} />
    {mark === 'star' ? <polygon points={star(0, 0, r * 0.78)} transform={`translate(${x},${y})`} fill="#FFD43B" /> : <path d={`M${x - r * 0.7},${y - r * 0.3} H${x + r * 0.7} M${x - r * 0.7},${y + r * 0.3} H${x + r * 0.7}`} stroke="#C9343A" strokeWidth={1.4} />}
  </g>
);

/** A-37 Dragonfly, TOP view, `size` = length in px, heading degrees (0 = east). `mark`: 'rvn' (yellow roundel) or 'star' (red roundel, yellow star). */
export const A37Top: React.FC<{ x: number; y: number; size?: number; heading?: number; mark?: Mark }> = ({ x, y, size = 110, heading = 0, mark = 'rvn' }) => (
  <g transform={`translate(${x},${y}) rotate(${heading}) scale(${size / 100})`} strokeLinejoin="round">
    <ellipse cx={4} cy={14} rx={56} ry={16} fill="#000" opacity={0.22} />
    <path d="M8,-6 L-8,-38 L-22,-38 L-16,-6 Z M8,6 L-8,38 L-22,38 L-16,6 Z" fill="#8A957A" stroke={INK} strokeWidth={2.2} />
    <ellipse cx={-16} cy={-39} rx={11} ry={4.6} fill="#6E7A63" stroke={INK} strokeWidth={2} /><ellipse cx={-16} cy={39} rx={11} ry={4.6} fill="#6E7A63" stroke={INK} strokeWidth={2} />
    <path d="M-38,-3 L-47,-17 L-53,-17 L-49,-3 Z M-38,3 L-47,17 L-53,17 L-49,3 Z" fill="#8A957A" stroke={INK} strokeWidth={2} />
    <path d="M52,0 Q32,-8 4,-8 L-46,-4 L-52,0 L-46,4 L4,8 Q32,8 52,0 Z" fill="#9AA58A" stroke={INK} strokeWidth={2.4} />
    <ellipse cx={22} cy={0} rx={10} ry={3.8} fill="#A9D2EA" stroke={INK} strokeWidth={1.6} />
    <Roundel x={-4} y={-23} r={5.2} mark={mark} /><Roundel x={-4} y={23} r={5.2} mark={mark} />
  </g>
);

/** A-37 SIDE view facing right (flip = facing left), `size` = length in px, (x, y) = centre. */
export const A37Side: React.FC<{ x: number; y: number; size?: number; flip?: boolean; mark?: Mark }> = ({ x, y, size = 400, flip = false, mark = 'rvn' }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -size / 100 : size / 100},${size / 100})`} strokeLinejoin="round">
    <path d="M-34,-8 L-48,-36 L-58,-36 L-54,-8 Z" fill="#8A957A" stroke={INK} strokeWidth={1.6} />
    <path d="M54,3 Q46,-5 30,-8 L8,-10 L-30,-9 L-54,-10 L-54,-2 L-30,4 L10,7 Q42,7 54,3 Z" fill="#9AA58A" stroke={INK} strokeWidth={1.8} />
    <path d="M30,-8 Q24,-17 12,-15 L6,-9 Z" fill="#A9D2EA" stroke={INK} strokeWidth={1.4} />
    <ellipse cx={2} cy={8} rx={20} ry={4.6} fill="#6E7A63" stroke={INK} strokeWidth={1.5} />
    <path d="M-30,-2 L-6,-2" stroke="#5E6A52" strokeWidth={2} />
    <circle cx={-44} cy={-26} r={4.4} fill={mark === 'star' ? '#D8372F' : '#F2C230'} stroke={INK} strokeWidth={1} />
    {mark === 'star' && <polygon points={star(0, 0, 3.4)} transform="translate(-44,-26)" fill="#FFD43B" />}
  </g>
);

/** Faceless standing person, (x, y) = feet. */
export const Person: React.FC<{ x: number; y: number; s?: number; color?: string; lean?: number; arm?: boolean }> = ({ x, y, s = 1, color = '#1A2430', lean = 0, arm = false }) => (
  <g transform={`translate(${x},${y}) rotate(${lean}) scale(${s})`}>
    <ellipse cy={2} rx={15} ry={4} fill="#000" opacity={0.25} />
    <path d="M-8,0 L-7,-30 L7,-30 L8,0 Z" fill={color} />
    <path d="M-12,-30 Q-12,-54 0,-54 Q12,-54 12,-30 Z" fill={color} />
    <circle cy={-65} r={9.5} fill={color} />
    {arm && <path d="M10,-48 L24,-72" stroke={color} strokeWidth={5.5} strokeLinecap="round" />}
  </g>
);

/** Rows of faceless people (deterministic), they sway a little with t. */
export const Crowd: React.FC<{ x: number; y: number; w: number; rows?: number; per?: number; s?: number; t?: number; color?: string; seed?: number }> = ({ x, y, w, rows = 3, per = 14, s = 1, t = 0, color = '#141C28', seed = 1 }) => (
  <g>
    {Array.from({ length: rows }, (_, r) => (
      <g key={r} opacity={0.75 + 0.25 * (r / Math.max(1, rows - 1))}>
        {Array.from({ length: per }, (_, i) => {
          const px = x - w / 2 + ((i + 0.5 + (hash(i + r * 31, seed) - 0.5) * 0.6) / per) * w + (r % 2) * (w / per / 2);
          const k = 0.8 + 0.18 * r;
          return <Person key={i} x={px} y={y + r * 34 * s} s={s * k * (0.92 + 0.14 * hash(i, seed + r))} color={color} lean={Math.sin(t * 0.05 + i * 1.7 + r) * 1.6} />;
        })}
      </g>
    ))}
  </g>
);

/** Six-armed snowflake, r = arm length. */
export const Snowflake: React.FC<{ x: number; y: number; r?: number; rot?: number; o?: number }> = ({ x, y, r = 14, rot = 0, o = 0.9 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} stroke="#F4FAFF" strokeWidth={Math.max(1.6, r * 0.14)} strokeLinecap="round" opacity={o}>
    {[0, 60, 120].map((a) => <g key={a} transform={`rotate(${a})`}><line x1={-r} y1={0} x2={r} y2={0} /><path d={`M${r * 0.55},${-r * 0.3} L${r * 0.55},0 L${r * 0.55},${r * 0.3} M${-r * 0.55},${-r * 0.3} L${-r * 0.55},${r * 0.3}`} strokeWidth={Math.max(1.2, r * 0.1)} /></g>)}
  </g>
);

/** Eighth note. */
export const Note: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string; o?: number }> = ({ x, y, s = 40, rot = 0, color = '#FFE9B0', o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s / 40})`} opacity={o}>
    <ellipse cx={0} cy={0} rx={11} ry={8} transform="rotate(-20)" fill={color} stroke={INK} strokeWidth={3} />
    <path d="M9,-3 L9,-44 Q22,-38 26,-24" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" /><path d="M9,-3 L9,-44 Q22,-38 26,-24" fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" />
  </g>
);
