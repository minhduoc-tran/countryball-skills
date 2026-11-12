import React from 'react';
import { clamp, easeOut, rnd, FONT } from '../../engine';

// Chapter A local props for "no more extra classes": a weekly timetable headed HỌC THÊM that tears in two, and the
// paper bits that fly. 380 x 520 at s = 1, centred on (0, 0).

const INK = '#14101C';
const CELLS = ['#E4572E', '#3E9BD6', '#F6B93B', '#58B368', '#8E6AD8', '#E86AA6'];

const Sheet: React.FC = () => (
  <g>
    <rect x={-190} y={-260} width={380} height={520} rx={8} fill="#F6F1E3" stroke={INK} strokeWidth={6} />
    <rect x={-190} y={-260} width={380} height={86} rx={8} fill="#C8323C" stroke={INK} strokeWidth={6} />
    <text x={0} y={-200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#FFFFFF" letterSpacing={2}>HỌC THÊM</text>
    {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 4 }).map((__, c) => (
      <rect key={`${r}${c}`} x={-164 + c * 84} y={-150 + r * 82} width={74} height={68} rx={8} fill={CELLS[(r * 3 + c * 2) % CELLS.length]} opacity={0.88} stroke={INK} strokeWidth={3} />
    )))}
  </g>
);

const ZIG = 'M 14 -300 L -10 -230 L 26 -170 L -14 -100 L 22 -40 L -12 30 L 24 100 L -10 170 L 16 230 L 0 300';

/** The timetable; `tear` 0..1 pulls it into a left and a right half along a jagged line (they drift apart and turn). */
export const Timetable: React.FC<{ x: number; y: number; s?: number; rot?: number; tear?: number; id: string }> = ({ x, y, s = 1, rot = 0, tear = 0, id }) => {
  const e = easeOut(clamp(tear));
  const split = tear > 0.001;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {!split ? <Sheet /> : (
        <g>
          <clipPath id={`${id}L`}><path d={`${ZIG} L -400 300 L -400 -300 Z`} /></clipPath>
          <clipPath id={`${id}R`}><path d={`${ZIG} L 400 300 L 400 -300 Z`} /></clipPath>
          <g transform={`translate(${-60 * e} ${30 * e}) rotate(${-14 * e})`}><g clipPath={`url(#${id}L)`}><Sheet /></g></g>
          <g transform={`translate(${70 * e} ${-20 * e}) rotate(${12 * e})`}><g clipPath={`url(#${id}R)`}><Sheet /></g></g>
        </g>
      )}
    </g>
  );
};

/** Paper bits flying out of (x, y) from frame k (negative: nothing yet). */
export const PaperBits: React.FC<{ x: number; y: number; k: number; n?: number; seed?: number }> = ({ x, y, k, n = 26, seed = 9 }) => {
  if (k < 0 || k > 40) return null;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const a = rnd(seed, i) * Math.PI * 2;
        const v = 6 + rnd(seed + 1, i) * 16;
        const px = x + Math.cos(a) * v * k * 0.9;
        const py = y + Math.sin(a) * v * k * 0.9 + 0.5 * 0.7 * k * k;
        const w = 14 + rnd(seed + 2, i) * 26;
        return <rect key={i} x={-w / 2} y={-w / 3} width={w} height={w * 0.66} fill={i % 3 ? '#F6F1E3' : CELLS[i % 6]} stroke={INK} strokeWidth={2} opacity={1 - k / 40} transform={`translate(${px} ${py}) rotate(${rnd(seed + 3, i) * 360 + k * (8 + 10 * rnd(seed + 4, i))})`} />;
      })}
    </g>
  );
};
