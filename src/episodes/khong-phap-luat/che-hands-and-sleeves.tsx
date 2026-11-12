import React from 'react';

// Chapter E: arms entering an insert (any sleeve colour), a pencil and an eraser. Same drawing language as the
// last-one InsertArm (a thick sleeve from off frame, a mitten scaled up), but with the colours as props so the whole
// neighbourhood (Pip, Mo, mum, sis, grandma) can put a hand in.

export const SKIN = '#E8C4A0';
const LINE = '#2A1E24';

/** A mitten centred on (0, 0): palm, thumb. */
export const Mitten: React.FC<{ skin?: string; s?: number; point?: boolean }> = ({ skin = SKIN, s = 1, point = false }) => (
  <g transform={`scale(${s})`}>
    {point ? <rect x={-4} y={10} width={8} height={26} rx={4} fill={skin} stroke={LINE} strokeWidth={2.4} /> : null}
    <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={skin} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
    <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={skin} stroke={LINE} strokeWidth={2.4} />
  </g>
);

/** A sleeve from (fx, fy) off frame to a mitten at (x, y). Children draw in the hand's frame (a pencil, a thread). */
export const ArmIn: React.FC<{
  x: number; y: number; fx: number; fy: number; color: string; shade?: string; skin?: string; rot?: number; s?: number; width?: number; point?: boolean; children?: React.ReactNode;
}> = ({ x, y, fx, fy, color, shade = '#00000055', skin = SKIN, rot = 0, s = 4.4, width = 104, point = false, children }) => {
  const d = `M ${x + (fx - x) * 0.08} ${y + (fy - y) * 0.08} Q ${x + (fx - x) * 0.45 + 30} ${y + (fy - y) * 0.45} ${fx} ${fy}`;
  return (
    <g filter="url(#rimR)">
      <path d={d} stroke={LINE} strokeWidth={width + 16} fill="none" strokeLinecap="round" />
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
      <path d={d} stroke={shade} strokeWidth={width * 0.28} fill="none" strokeLinecap="round" transform="translate(16 18)" opacity={0.5} />
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        <Mitten skin={skin} s={s} point={point} />
        {children}
      </g>
    </g>
  );
};

/** A pencil, tip at (0, 0), body running up-right; `s` scales it. */
export const Pencil: React.FC<{ x?: number; y?: number; rot?: number; s?: number }> = ({ x = 0, y = 0, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 0 L 26 -9 L 26 9 Z" fill="#F1D6A6" stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
    <path d="M 0 0 L 9 -3 L 9 3 Z" fill="#2A2530" />
    <rect x={26} y={-9} width={190} height={18} fill="#F2B73C" stroke={LINE} strokeWidth={3} />
    <rect x={26} y={-3} width={190} height={5} fill="#FFE08A" opacity={0.7} />
    <rect x={216} y={-9} width={18} height={18} fill="#B8B8C4" stroke={LINE} strokeWidth={3} />
    <rect x={234} y={-9} width={30} height={18} rx={6} fill="#F08A8A" stroke={LINE} strokeWidth={3} />
  </g>
);

/** A pink block eraser centred on (0, 0). */
export const Eraser: React.FC<{ x?: number; y?: number; rot?: number; s?: number }> = ({ x = 0, y = 0, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-34} width={140} height={68} rx={12} fill="#F4A0A8" stroke={LINE} strokeWidth={4} />
    <rect x={-70} y={-34} width={64} height={68} rx={12} fill="#4A6FA8" stroke={LINE} strokeWidth={4} />
    <rect x={-60} y={-26} width={140} height={14} rx={7} fill="#FFFFFF" opacity={0.25} />
  </g>
);
