import React from 'react';
import { LookDef, UI, FONT, clamp } from '../../engine';

// The episode's looks ("look": "<name>" on edit entries; tools/merge-chapters.py imports `looks`).
// "zero": the new world, where nobody is poor. A chip in the top right, "NGƯỜI NGHÈO: 0", whose green tick blinks in
//   at the start of each run: the visual grammar of the premise. Slightly warm, clean grade.
// "before": the world as it is today (the real numbers, the hardship). Cooler, washed-out grade.
// "warm": family and the ending. Golden, soft.

const ZeroChip: React.FC<{ p: number }> = ({ p }) => {
  const tick = clamp(p * 6);
  return (
    <g transform="translate(1610 96)">
      <rect x={-230} y={-46} width={460} height={92} rx={46} fill={UI.pill} opacity={0.65} />
      <text x={-196} y={13} fontFamily={FONT.ui} fontSize={34} fill={UI.text} letterSpacing={1}>NGƯỜI NGHÈO: 0</text>
      <g opacity={tick}>
        <circle cx={190} cy={0} r={22} fill="#2FBF71" />
        <path d="M 179 1 l 7 8 l 14 -16" stroke="#E9FFF2" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

const zero: LookDef = {
  grade: (lv) => `saturate(${1 + 0.1 * lv}) brightness(${1 + 0.03 * lv})`,
  Overlay: ({ p }) => <ZeroChip p={p} />,
};
const before: LookDef = {
  grade: (lv) => `saturate(${1 - 0.45 * lv}) contrast(${1 - 0.06 * lv}) hue-rotate(${8 * lv}deg)`,
};
const warm: LookDef = {
  grade: (lv) => `sepia(${0.18 * lv}) saturate(${1 + 0.1 * lv}) brightness(${1 + 0.04 * lv})`,
};

export const looks = { zero, before, warm };
