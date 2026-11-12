import React from 'react';
import { LookDef, UI, FONT } from '../../engine';

// The episode's looks ("look": "<name>" on edit entries; tools/merge-chapters.py imports `looks`).
// Countdown chips (top-left, the episode's grammar): "c7" CÒN 7 NGÀY, "c5" CÒN 5 NGÀY, "c1" CÒN 1 NGÀY,
//   "night" ĐÊM CUỐI (the all-nighter, darker, cold). Fast-forward chips: "y1" 1 NĂM SAU, "y10" 10 NĂM SAU (faded, cool).
// "alert": deadline panic (red pulse + "HẠN NỘP: 00:00" bar). "memory": real studies shown as sepia cards.
// "peace": the fixes and the ending. Warm, soft, golden.

const TimeChip: React.FC<{ label: string; f: number }> = ({ label, f }) => (
  <g transform="translate(70 70)">
    <rect x={0} y={0} width={label.length * 22 + 96} height={72} rx={36} fill={UI.pill} opacity={0.72} />
    <circle cx={38} cy={36} r={11} fill="#FF5A48" opacity={f % 30 < 18 ? 1 : 0.35} />
    <text x={62} y={48} fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={UI.text} letterSpacing={2}>{label}</text>
  </g>
);

const time = (label: string, tense: number): LookDef => ({
  grade: (lv) => `saturate(${1 - 0.18 * tense * lv}) contrast(${1 + 0.06 * tense * lv}) hue-rotate(${5 * tense * lv}deg)`,
  Overlay: ({ f }) => <TimeChip label={label} f={f} />,
});

const AlertOverlay: React.FC<{ f: number }> = ({ f }) => {
  const pulse = 0.35 + 0.35 * Math.abs(Math.sin(f / 6));
  return (
    <g>
      <defs>
        <radialGradient id="alertVig" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="#C8202F" stopOpacity={0} />
          <stop offset="1" stopColor="#C8202F" stopOpacity={pulse} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#alertVig)" />
      <rect x={0} y={0} width={1920} height={64} fill="#C8202F" opacity={0.9} />
      <text x={960} y={44} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill="#FFFFFF" letterSpacing={4}>⏰ HẠN NỘP: 00:00 ⏰</text>
    </g>
  );
};

export const looks = {
  c7: time('CÒN 7 NGÀY', 0.3),
  c5: time('CÒN 5 NGÀY', 0.6),
  c1: time('CÒN 1 NGÀY', 1.1),
  night: { ...time('ĐÊM CUỐI', 1.4), grade: (lv: number) => `brightness(${1 - 0.18 * lv}) saturate(${1 - 0.25 * lv}) hue-rotate(${12 * lv}deg)` } as LookDef,
  y1: { ...time('1 NĂM SAU', 0.8), grade: (lv: number) => `saturate(${1 - 0.3 * lv}) brightness(${1 - 0.04 * lv})` } as LookDef,
  y10: { ...time('10 NĂM SAU', 1.2), grade: (lv: number) => `saturate(${1 - 0.45 * lv}) brightness(${1 - 0.06 * lv}) sepia(${0.12 * lv})` } as LookDef,
  alert: { grade: (lv: number) => `contrast(${1 + 0.1 * lv}) saturate(${1 - 0.1 * lv})`, Overlay: ({ f }: { f: number }) => <AlertOverlay f={f} /> } as LookDef,
  memory: { grade: (lv: number) => `sepia(${0.6 * lv}) saturate(${1 - 0.3 * lv}) brightness(${1 + 0.04 * lv}) contrast(${1 - 0.1 * lv})` } as LookDef,
  peace: { grade: (lv: number) => `sepia(${0.15 * lv}) saturate(${1 + 0.1 * lv}) brightness(${1 + 0.05 * lv})` } as LookDef,
};
