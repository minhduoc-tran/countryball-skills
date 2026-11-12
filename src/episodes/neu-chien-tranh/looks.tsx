import React from 'react';
import { LookDef, UI, FONT } from '../../engine';

// The episode's looks ("look": "<name>" on edit entries; tools/merge-chapters.py imports `looks`).
// Time chips (the episode's grammar, top-left, the chapter of the war): "h1" GIỜ ĐẦU TIÊN, "d1" NGÀY ĐẦU TIÊN,
//   "w1" TUẦN ĐẦU TIÊN, "m1" THÁNG ĐẦU TIÊN, "y1" NĂM ĐẦU TIÊN; each with a slightly tenser, cooler grade.
// "alert": a phone emergency alert is on: red edge vignette pulsing + a "CẢNH BÁO KHẨN CẤP" bar at the top.
// "blackout": power is out: dark, cold grade.
// "memory": the past. Faded sepia. "peace": the return and the ending. Warm, soft, golden.

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
      <text x={960} y={44} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill="#FFFFFF" letterSpacing={4}>⚠ CẢNH BÁO KHẨN CẤP ⚠</text>
    </g>
  );
};

export const looks = {
  h1: time('GIỜ ĐẦU TIÊN', 1),
  d1: time('NGÀY ĐẦU TIÊN', 1),
  w1: time('TUẦN ĐẦU TIÊN', 1.2),
  m1: time('THÁNG ĐẦU TIÊN', 1.4),
  y1: time('NĂM ĐẦU TIÊN', 1.5),
  alert: { grade: (lv: number) => `contrast(${1 + 0.1 * lv}) saturate(${1 - 0.1 * lv})`, Overlay: ({ f }: { f: number }) => <AlertOverlay f={f} /> } as LookDef,
  blackout: { grade: (lv: number) => `brightness(${1 - 0.35 * lv}) saturate(${1 - 0.4 * lv}) hue-rotate(${15 * lv}deg)` } as LookDef,
  memory: { grade: (lv: number) => `sepia(${0.6 * lv}) saturate(${1 - 0.3 * lv}) brightness(${1 + 0.04 * lv}) contrast(${1 - 0.1 * lv})` } as LookDef,
  peace: { grade: (lv: number) => `sepia(${0.15 * lv}) saturate(${1 + 0.1 * lv}) brightness(${1 + 0.05 * lv})` } as LookDef,
};
