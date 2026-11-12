import React from 'react';
import { LookDef, UI, FONT, clamp } from '../../engine';

// The episode's looks ("look": "<name>" on edit entries; tools/merge-chapters.py imports `looks`).
// "card": the black card is live. A chip in the top right reads "SỐ DƯ: ∞" with a green tick that blinks in at the
//   start of each run (each swipe), the visual grammar of the power.
// "prices": prices are rising. A slightly hot, uneasy grade and a small red "GIÁ ↑" chip.
// "memory": warm, faded, for remembered moments.

const CardChip: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  const tick = clamp(p * 6);
  return (
    <g transform="translate(1600 96)">
      <rect x={-210} y={-46} width={420} height={92} rx={46} fill={UI.pill} opacity={0.65} />
      <rect x={-180} y={-20} width={62} height={40} rx={7} fill="#15131C" stroke="#C9A85A" strokeWidth={3} />
      <rect x={-172} y={-8} width={14} height={11} rx={2} fill="#C9A85A" />
      <text x={-100} y={14} fontFamily={FONT.ui} fontSize={36} fill={UI.text} letterSpacing={2}>SỐ DƯ: ∞</text>
      <g opacity={tick}>
        <circle cx={168} cy={0} r={22} fill="#2FBF71" />
        <path d="M 157 1 l 7 8 l 14 -16" stroke="#E9FFF2" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

const PriceChip: React.FC<{ f: number }> = ({ f }) => (
  <g transform="translate(1700 96)" opacity={0.7 + 0.3 * Math.abs(Math.sin(f / 8))}>
    <rect x={-120} y={-42} width={240} height={84} rx={42} fill="#3A0E14" opacity={0.75} />
    <text x={0} y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#FF6A5A" letterSpacing={3}>GIÁ ↑</text>
  </g>
);

const card: LookDef = { Overlay: ({ f, p }) => <CardChip f={f} p={p} /> };
const prices: LookDef = {
  grade: (lv) => `sepia(${0.15 * lv}) saturate(${1 + 0.15 * lv}) hue-rotate(${-8 * lv}deg)`,
  Overlay: ({ f }) => <PriceChip f={f} />,
};
const memory: LookDef = {
  grade: (lv) => `sepia(${0.55 * lv}) saturate(${1 - 0.25 * lv}) brightness(${1 + 0.05 * lv}) contrast(${1 - 0.08 * lv})`,
};

export const looks = { card, prices, memory };
