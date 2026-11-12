import React from 'react';
import { FONT, clamp, easeOut } from '../../engine';

// Chapter E: props of "the law is a promise": the heavy law book with its golden scales, the neighbourhood's rule board
// (the one the end card leaves a blank line on), and a pinky promise with its glowing thread.

const LINE = '#2A1E24';

/** The law book, closed, centred on (0, 0), about 300 x 220 at s = 1: dark blue cover, gold scales, cream page edge. */
export const LawBook: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number }> = ({ x, y, s = 1, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o} strokeLinejoin="round">
    <path d="M -150 100 L -150 -100 L 150 -100 L 150 100 Z" fill="#F4EAD0" stroke={LINE} strokeWidth={7} transform="translate(12 10)" />
    <rect x={-150} y={-110} width={300} height={220} rx={14} fill="#2F4A8A" stroke={LINE} strokeWidth={8} />
    <rect x={-150} y={-110} width={42} height={220} rx={14} fill="#223870" stroke={LINE} strokeWidth={8} />
    <rect x={-126} y={-90} width={262} height={180} rx={8} fill="none" stroke="#E9B93A" strokeWidth={5} />
    {/* the scales of justice */}
    <g transform="translate(14 -4)" stroke="#F2C94C" strokeWidth={7} fill="none" strokeLinecap="round">
      <path d="M 0 -62 V 52 M -36 52 H 36 M -64 -40 H 64" />
      <path d="M -64 -40 L -84 4 M -64 -40 L -44 4 M 64 -40 L 44 4 M 64 -40 L 84 4" strokeWidth={4} />
      <path d="M -90 4 H -38 Q -40 24 -64 24 Q -88 24 -90 4 Z M 38 4 H 90 Q 88 24 64 24 Q 40 24 38 4 Z" fill="#F2C94C" strokeWidth={3} />
    </g>
  </g>
);

export type BoardRow = { text: string; reveal?: number };

/**
 * The neighbourhood's rule board on two posts under a little tiled roof; centred on (0, 0), 1400 x 600 at s = 1.
 * Rows are chalk lines (`reveal` 0..1 writes them on); `blank` adds "ĐIỀU 3: ......" with a blinking underscore.
 */
export const NeighbourBoard: React.FC<{ x: number; y: number; s?: number; t: number; rows: BoardRow[]; blank?: number }> = ({ x, y, s = 1, t, rows, blank = 0 }) => {
  const caret = Math.floor(t / 9) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <rect x={-560} y={250} width={34} height={330} fill="#6B4128" stroke={LINE} strokeWidth={6} />
      <rect x={526} y={250} width={34} height={330} fill="#6B4128" stroke={LINE} strokeWidth={6} />
      <ellipse cx={0} cy={590} rx={700} ry={24} fill="#000" opacity={0.2} />
      <path d="M -720 -270 L 0 -380 L 720 -270 L 690 -240 H -690 Z" fill="#B8603E" stroke={LINE} strokeWidth={8} />
      <path d="M -540 -262 Q 0 -300 540 -262" stroke="#E8A070" strokeWidth={5} fill="none" opacity={0.7} />
      <rect x={-680} y={-240} width={1360} height={540} rx={22} fill="#8A5A38" stroke={LINE} strokeWidth={8} />
      <rect x={-650} y={-212} width={1300} height={484} rx={10} fill="#27483F" stroke={LINE} strokeWidth={6} />
      <rect x={-650} y={-212} width={1300} height={484} rx={10} fill="#FFFFFF" opacity={0.05} />
      <text y={-132} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} letterSpacing={8} fill="#FFE27A">QUY ĐỊNH CỦA XÓM</text>
      {rows.map((r, i) => {
        const rv = r.reveal ?? 1;
        return (
          <g key={i}>
            <clipPath id={`nbrow${i}`}><rect x={-620} y={-90 + i * 112} width={1240 * rv} height={110} /></clipPath>
            <text x={-600} y={-24 + i * 112} fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill="#F6F0E0" clipPath={`url(#nbrow${i})`}>{r.text}</text>
          </g>
        );
      })}
      {blank > 0 ? (
        <g opacity={blank}>
          <text x={-600} y={-24 + rows.length * 112} fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill="#F6F0E0">ĐIỀU 3: ......</text>
          {caret ? <rect x={-600 + 340} y={-24 + rows.length * 112 - 58} width={8} height={64} fill="#FFE27A" /> : null}
        </g>
      ) : null}
      <path d="M -620 252 H 620" stroke="#8A5A38" strokeWidth={10} opacity={0.6} />
    </g>
  );
};

/** Two fists hooking little fingers at (x, y), a golden glow and thread between; `p` 0..1 draws the hooking. */
export const PinkyPromise: React.FC<{ x: number; y: number; t: number; p?: number }> = ({ x, y, t, p = 1 }) => {
  const SK = '#E8C4A0';
  const pull = Math.sin(t / 5) * 5 * p;
  const fist = (side: 1 | -1, sleeve: string) => (
    <g transform={`scale(${side} 1)`}>
      <path d={`M 560 140 L ${200 + 40 * (1 - p)} 40`} stroke={LINE} strokeWidth={150} strokeLinecap="round" />
      <path d={`M 560 140 L ${200 + 40 * (1 - p)} 40`} stroke={sleeve} strokeWidth={134} strokeLinecap="round" />
      <ellipse cx={170 + 40 * (1 - p)} cy={30} rx={96} ry={78} fill={SK} stroke={LINE} strokeWidth={7} />
      <path d={`M ${120 + 40 * (1 - p)} 8 q 18 -14 40 0 M ${116 + 40 * (1 - p)} 40 q 20 -12 42 0`} stroke="#A98163" strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={176 + 40 * (1 - p)} cy={-40} rx={34} ry={44} fill={SK} stroke={LINE} strokeWidth={6} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={300} fill="#FFE27A" opacity={0.25 + 0.1 * Math.sin(t / 6)} />
      <g transform={`translate(${-pull} 0)`}>{fist(-1, '#2E2B3D')}</g>
      <g transform={`translate(${pull} 0)`}>{fist(1, '#3E8C86')}</g>
      {/* the hooked little fingers: two interlocking rings */}
      <g opacity={clamp(p * 3)} fill="none" strokeLinecap="round">
        <circle cx={-34} cy={-24} r={56} stroke={LINE} strokeWidth={46} /><circle cx={34} cy={-24} r={56} stroke={LINE} strokeWidth={46} />
        <circle cx={-34} cy={-24} r={56} stroke={SK} strokeWidth={30} />
        <circle cx={34} cy={-24} r={56} stroke={SK} strokeWidth={30} />
        <path d="M 0 -78 A 56 56 0 0 1 30 -76" stroke={LINE} strokeWidth={46} /><path d="M 0 -78 A 56 56 0 0 1 30 -76" stroke={SK} strokeWidth={30} />
      </g>
    </g>
  );
};

/** A thread of light between two points that sags; `glow` 0..1; a bright dot runs along it at phase `ph` (0..1). */
export const Thread: React.FC<{ x1: number; y1: number; x2: number; y2: number; sag?: number; ph?: number; o?: number; w?: number }> = ({ x1, y1, x2, y2, sag = 30, ph = 0, o = 1, w = 5 }) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag;
  const u = easeOut(clamp(ph));
  const bx = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * mx + u * u * x2;
  const by = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * y2;
  return (
    <g opacity={o} style={{ mixBlendMode: 'screen' }}>
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} stroke="#FFD76A" strokeWidth={w * 3} fill="none" opacity={0.3} strokeLinecap="round" />
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} stroke="#FFF1B8" strokeWidth={w} fill="none" strokeLinecap="round" />
      {ph > 0 && ph < 1 ? <circle cx={bx} cy={by} r={w * 2.4} fill="#FFFFFF" opacity={0.9} /> : null}
    </g>
  );
};
