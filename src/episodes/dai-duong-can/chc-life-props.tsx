import React from 'react';
import { rnd, FONT } from '../../engine';
import { mix } from './kit-palette';

// Chapter C props: the smell and the dead sea life. Pure functions of t; "grey" 0..1 drains colour (gentle: no blood, no gore).
//   StinkLines  wavy green strands rising from y (x0..x0+w), looping.      StinkCloud  a drifting green puff.
//   Whale       blue whale seen from the side, head left, tail right (~1000 wide at s 1), eye shuts as grey grows.
//   Plankton    kind 0 diatom, 1 copepod, 2 dinoflagellate star (~90 wide).  Anchovy  silver cá cơm, nose right (~160 wide).
//   Lbl         a small pill label in the mono face (centred on x, y).

const INK = '#14121A';
const GREEN = '#8FD14F';

export const StinkLines: React.FC<{ t: number; x0: number; w: number; y: number; h?: number; n?: number; seed?: number; o?: number; width?: number }> = ({ t, x0, w, y, h = 420, n = 10, seed = 3, o = 0.85, width = 10 }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    {Array.from({ length: n }).map((_, i) => {
      const ph = (t / 52 + rnd(seed, i)) % 1;
      const bx = x0 + rnd(seed + 1, i) * w;
      const amp = 12 + rnd(seed + 2, i) * 14;
      const yb = y - ph * h;
      const d = Array.from({ length: 9 }).map((__, k) => `${k ? 'L' : 'M'} ${bx + Math.sin(k * 0.95 + t * 0.13 + i * 2) * amp} ${yb - k * 22}`).join(' ');
      const a = Math.sin(Math.PI * ph) * o;
      return (
        <g key={i} opacity={a}>
          <path d={d} stroke="#2F5E1C" strokeWidth={width + 5} opacity={0.5} />
          <path d={d} stroke={GREEN} strokeWidth={width} />
        </g>
      );
    })}
  </g>
);

export const StinkCloud: React.FC<{ x: number; y: number; s?: number; t: number; o?: number }> = ({ x, y, s = 1, t, o = 0.55 }) => (
  <g transform={`translate(${x + Math.sin(t / 30) * 10} ${y + Math.cos(t / 24) * 6}) scale(${s})`} opacity={o}>
    {[[-70, 10, 62], [0, -14, 80], [74, 8, 64], [20, 34, 56], [-30, 30, 52]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx + Math.sin(t / 20 + i) * 5} cy={cy} r={r} fill={i % 2 ? '#7CBF3E' : GREEN} stroke="#3F7A22" strokeWidth={4} />
    ))}
  </g>
);

export const Whale: React.FC<{ x: number; y: number; s?: number; grey?: number; t?: number; rot?: number }> = ({ x, y, s = 1, grey = 0, t = 0, rot = 0 }) => {
  const body = mix('#4A86BE', '#8E959C', grey);
  const dark = mix('#2F5E8F', '#6C7279', grey);
  const belly = mix('#A9CDE8', '#BCC1C6', grey);
  const sway = Math.sin(t / 16) * (1 - grey) * 3;
  const eyeShut = grey > 0.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + sway}) scale(${s})`}>
      <path d="M -420 20 Q -430 -110 -170 -140 Q 150 -160 330 -50 Q 420 -20 480 -52 L 600 -150 Q 590 -80 572 -42 Q 624 8 640 70 Q 560 38 490 34 Q 410 60 330 62 Q 150 120 -170 100 Q -410 90 -420 20 Z" fill={body} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 470 -48 L 596 -144 Q 588 -80 570 -42 Q 620 8 636 66 Q 560 38 490 32 Z" fill={dark} />
      <path d="M -410 40 Q -380 100 -170 100 Q 150 118 320 54 L 320 40 Q 120 84 -170 70 Q -330 66 -410 40 Z" fill={belly} />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${-300 + i * 52} 70 q 8 22 0 34`} stroke={mix('#7FAFD6', '#9AA0A6', grey)} strokeWidth={5} fill="none" strokeLinecap="round" />)}
      <path d="M -120 40 Q -70 130 20 140 Q 10 80 -40 30 Z" fill={dark} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {eyeShut
        ? <path d="M -330 -4 Q -312 8 -292 -4" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
        : <g><circle cx={-310} cy={-6} r={14} fill="#F6EFE3" stroke={INK} strokeWidth={4} /><circle cx={-306} cy={-6} r={6} fill={INK} /></g>}
      <path d="M -310 40 Q -250 66 -170 56" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M -200 -140 q -6 -34 -34 -44 M -190 -140 q 6 -34 34 -44" stroke={mix('#BFE6FF', '#C8CCD0', grey)} strokeWidth={8} fill="none" strokeLinecap="round" opacity={1 - grey} />
    </g>
  );
};

export const Plankton: React.FC<{ x: number; y: number; s?: number; grey?: number; t?: number; kind?: number }> = ({ x, y, s = 1, grey = 0, t = 0, kind = 0 }) => {
  const c = mix(['#6FD18A', '#F2A65A', '#7FC4E8'][kind % 3], '#9AA0A6', grey);
  const bob = Math.sin(t * 0.12 + x * 0.01) * 7 * (1 - grey * 0.7);
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${Math.sin(t * 0.07 + kind) * 12 * (1 - grey)}) scale(${s})`} stroke={INK} strokeLinecap="round" strokeLinejoin="round">
      {kind % 3 === 0 ? (
        <g>
          {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${Math.cos((i * Math.PI) / 6) * 34} ${Math.sin((i * Math.PI) / 6) * 34} L ${Math.cos((i * Math.PI) / 6) * 56} ${Math.sin((i * Math.PI) / 6) * 56}`} strokeWidth={5} />)}
          <circle r={34} fill={c} strokeWidth={5} />
          <circle r={14} fill="#FFFFFF" opacity={0.35} stroke="none" />
        </g>
      ) : kind % 3 === 1 ? (
        <g>
          <path d="M 20 -8 Q 70 -60 96 -30 M 20 -8 Q 80 -20 110 10" fill="none" strokeWidth={4} />
          <path d="M -50 14 L -78 -6 M -50 14 L -78 30" fill="none" strokeWidth={4} />
          <ellipse rx={50} ry={24} fill={c} strokeWidth={5} />
          <circle cx={26} cy={-5} r={5} fill={INK} stroke="none" />
        </g>
      ) : (
        <g>
          <path d={Array.from({ length: 16 }).map((_, i) => `${i ? 'L' : 'M'} ${Math.cos((i * Math.PI) / 8) * (i % 2 ? 24 : 50)} ${Math.sin((i * Math.PI) / 8) * (i % 2 ? 24 : 50)}`).join(' ') + ' Z'} fill={c} strokeWidth={5} />
          <circle r={9} fill="#FFF7C2" opacity={1 - grey} stroke="none" />
        </g>
      )}
    </g>
  );
};

export const Anchovy: React.FC<{ x: number; y: number; s?: number; t?: number; dir?: 1 | -1; grey?: number }> = ({ x, y, s = 1, t = 0, dir = 1, grey = 0 }) => {
  const w = Math.sin(t / 3) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`} strokeLinejoin="round">
      <path d={`M -62 0 L -96 ${-22 + w} Q -84 ${w * 0.3} -96 ${22 + w} Z`} fill={mix('#9FB4C8', '#9AA0A6', grey)} stroke={INK} strokeWidth={3.5} />
      <path d="M -66 0 Q -30 -20 40 -13 L 74 -2 L 74 4 L 40 14 Q -30 20 -66 0 Z" fill={mix('#D5E0EA', '#B8BCC0', grey)} stroke={INK} strokeWidth={4} />
      <path d="M -60 -3 Q -20 -17 40 -11 L 70 -2 Q 0 -4 -60 -3 Z" fill={mix('#4B6C8F', '#7A8085', grey)} />
      <path d="M -30 2 L 66 -1" stroke="#FFFFFF" strokeWidth={4} opacity={0.6} />
      <circle cx={52} cy={-3} r={5.5} fill="#FFFFFF" stroke={INK} strokeWidth={2} /><circle cx={53.5} cy={-3} r={2.4} fill={INK} />
    </g>
  );
};

/** A small pill label (mono face), centred on x, y. */
export const Lbl: React.FC<{ x: number; y: number; text: string; size?: number; fg?: string; bg?: string; o?: number; rot?: number }> = ({ x, y, text, size = 46, fg = '#F6EFE3', bg = '#0B0816', o = 1, rot = 0 }) => {
  const w = text.length * size * 0.62 + size * 1.1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      <rect x={-w / 2} y={-size * 0.82} width={w} height={size * 1.5} rx={size * 0.4} fill={bg} opacity={0.82} />
      <text textAnchor="middle" y={size * 0.3} fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={fg} letterSpacing={2}>{text}</text>
    </g>
  );
};
