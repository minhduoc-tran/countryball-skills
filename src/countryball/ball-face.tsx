import React from 'react';

// Countryball faces: two white pupil-less eyes (the genre rule) plus brows / lids / tears per expression.
// Drawn in ball units (ball radius = 1). `look` shifts the eyes sideways; `t` only animates 'dizzy' spirals.

export type Eyes = 'normal' | 'happy' | 'smug' | 'shock' | 'angry' | 'determined' | 'worried' | 'sad' | 'dizzy';

const INK = '#111';
const ink = { stroke: INK, strokeWidth: 0.055, strokeLinejoin: 'round' as const };
const brow = (x1: number, y1: number, x2: number, y2: number) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={0.085} strokeLinecap="round" />
);

const spiral = (cx: number, cy: number, r: number, turn: number) => {
  let d = '';
  for (let i = 0; i <= 28; i++) {
    const a = turn + i * 0.45, rr = (r * i) / 28;
    d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(3)},${(cy + rr * Math.sin(a)).toFixed(3)} `;
  }
  return d;
};

export const EyePair: React.FC<{ eyes: Eyes; look: number; t?: number; tear?: boolean }> = ({ eyes, look, t = 0, tear }) => {
  const dx = look * 0.12, xs = [-0.34 + dx, 0.34 + dx];
  if (eyes === 'happy') // closed smiling eyes: white crescents bent upward
    return <>{xs.map((x) => <path key={x} d={`M${x - 0.2},${-0.02} Q${x},${-0.36} ${x + 0.2},${-0.02} Q${x},${-0.16} ${x - 0.2},${-0.02} Z`} fill="#FFF" {...ink} />)}</>;
  const shock = eyes === 'shock', narrow = eyes === 'determined';
  const rx = shock ? 0.24 : 0.2, ry = shock ? 0.3 : narrow ? 0.14 : eyes === 'sad' ? 0.23 : 0.25;
  const cy = narrow ? -0.04 : -0.08;
  return (
    <>
      {xs.map((x, i) => {
        const s = i ? 1 : -1; // -1 = left eye, +1 = right eye
        return (
          <g key={x}>
            <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill="#FFF" {...ink} />
            {/* smug = heavy lids cutting the top of each eye */}
            {eyes === 'smug' && <path d={`M${x - rx - 0.04},${-0.16 + (i ? -0.04 : 0.04)} L${x + rx + 0.04},${-0.16 + (i ? 0.04 : -0.04)} L${x + rx + 0.04},${-0.4} L${x - rx - 0.04},${-0.4} Z`} fill="#111" />}
            {/* determined = dark flat upper lid plus a straight brow, inner end a touch low */}
            {narrow && <path d={`M${x - rx - 0.04},${cy - ry + 0.04} L${x + rx + 0.04},${cy - ry + 0.04} L${x + rx + 0.04},${cy - ry - 0.14} L${x - rx - 0.04},${cy - ry - 0.14} Z`} fill={INK} />}
            {narrow && brow(x + s * 0.27, cy - ry - 0.2, x - s * 0.27, cy - ry - 0.1)}
            {/* angry = brows slanted down to the nose, overlapping the eye top */}
            {eyes === 'angry' && brow(x + s * 0.28, -0.52, x - s * 0.26, -0.27)}
            {/* worried / sad = inner brow ends raised, outer ends low */}
            {eyes === 'worried' && brow(x + s * 0.26, -0.42, x - s * 0.26, -0.58)}
            {eyes === 'sad' && brow(x + s * 0.26, -0.34, x - s * 0.26, -0.52)}
            {eyes === 'dizzy' && <path d={spiral(x, cy, rx * 0.85, t * 0.35 * (i ? -1 : 1))} fill="none" stroke={INK} strokeWidth={0.04} strokeLinecap="round" />}
          </g>
        );
      })}
      {eyes === 'sad' && tear && <path d={`M${xs[0] - 0.05},0.16 Q${xs[0] + 0.07},0.36 ${xs[0] - 0.05},0.44 Q${xs[0] - 0.17},0.36 ${xs[0] - 0.05},0.16 Z`} fill="#7FC8F0" {...ink} strokeWidth={0.035} />}
    </>
  );
};
