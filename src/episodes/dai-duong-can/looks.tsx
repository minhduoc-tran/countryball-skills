import React from 'react';
import { LookDef, UI, FONT } from '../../engine';

// The ocean episode's looks ("look": "<name>" on edit entries; tools/merge-chapters.py imports `looks`).
// Time chips (top-left, the episode's grammar): sec1 GIÂY THỨ 1 (slight shock grade), days NHỮNG NGÀY ĐẦU, months VÀI THÁNG SAU,
//   years VÀI NĂM SAU (bleached, hot), far HÀNG TRIỆU NĂM SAU (desaturated), past 20.000 NĂM TRƯỚC (sepia).
// No chip: heat (orange grade + heat shimmer at the top), mars (rust), home (warm, saturated: the sea is back).
// drained: bleached hot with the chip "ĐẠI DƯƠNG: 0%".

const Chip: React.FC<{ label: string; f: number; dot?: string }> = ({ label, f, dot = '#FF5A48' }) => (
  <g transform="translate(70 70)">
    <rect x={0} y={0} width={label.length * 22 + 96} height={72} rx={36} fill={UI.pill} opacity={0.72} />
    <circle cx={38} cy={36} r={11} fill={dot} opacity={f % 30 < 18 ? 1 : 0.35} />
    <text x={62} y={48} fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={UI.text} letterSpacing={2}>{label}</text>
  </g>
);

const chipLook = (label: string, grade: (lv: number) => string, dot?: string, extra?: React.FC<{ f: number; lv: number }>): LookDef => ({
  grade,
  Overlay: ({ f, lv }) => (
    <g>
      {extra ? React.createElement(extra, { f, lv }) : null}
      <Chip label={label} f={f} dot={dot} />
    </g>
  ),
});

/** Heat: a warm veil at the top and slow wavy shimmer lines. */
const Shimmer: React.FC<{ f: number; lv: number }> = ({ f, lv }) => (
  <g opacity={lv}>
    <defs>
      <linearGradient id="dhHeat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF8A3D" stopOpacity="0.42" /><stop offset="1" stopColor="#FF8A3D" stopOpacity="0" /></linearGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={420} fill="url(#dhHeat)" />
    {Array.from({ length: 7 }).map((_, i) => {
      const y = 60 + i * 52;
      const d = 'M 0 ' + y + Array.from({ length: 33 }).map((__, k) => ` L ${k * 60} ${y + Math.sin(k * 0.8 + f * 0.16 + i * 1.7) * 7}`).join('');
      return <path key={i} d={d} stroke="#FFF1D0" strokeWidth={3} fill="none" opacity={0.2 - i * 0.02} />;
    })}
  </g>
);

const Bleach: React.FC<{ f: number; lv: number }> = ({ lv }) => <rect x={0} y={0} width={1920} height={1080} fill="#FFF4DA" opacity={0.14 * lv} />;

export const looks = {
  sec1: chipLook('GIÂY THỨ 1', (lv) => `contrast(${1 + 0.12 * lv}) saturate(${1 + 0.1 * lv}) brightness(${1 + 0.04 * lv})`, '#FFFFFF'),
  days: chipLook('NHỮNG NGÀY ĐẦU', (lv) => `saturate(${1 - 0.06 * lv}) contrast(${1 + 0.04 * lv})`),
  months: chipLook('VÀI THÁNG SAU', (lv) => `saturate(${1 - 0.15 * lv}) sepia(${0.12 * lv}) contrast(${1 + 0.04 * lv})`),
  years: chipLook('VÀI NĂM SAU', (lv) => `brightness(${1 + 0.08 * lv}) contrast(${1 - 0.1 * lv}) saturate(${1 - 0.3 * lv}) sepia(${0.2 * lv})`, '#FF5A48', Bleach),
  far: chipLook('HÀNG TRIỆU NĂM SAU', (lv) => `saturate(${1 - 0.55 * lv}) brightness(${1 - 0.05 * lv}) contrast(${1 - 0.04 * lv})`, '#9AA6B8'),
  past: chipLook('20.000 NĂM TRƯỚC', (lv) => `sepia(${0.75 * lv}) saturate(${1 - 0.2 * lv}) contrast(${1 - 0.08 * lv}) brightness(${1 + 0.02 * lv})`, '#E0B070'),
  heat: { grade: (lv: number) => `sepia(${0.25 * lv}) saturate(${1 + 0.2 * lv}) hue-rotate(${-10 * lv}deg) brightness(${1 + 0.04 * lv})`, Overlay: ({ f, lv }: { f: number; lv: number }) => <Shimmer f={f} lv={lv} /> } as LookDef,
  mars: { grade: (lv: number) => `sepia(${0.65 * lv}) hue-rotate(${-18 * lv}deg) saturate(${1 + 0.5 * lv}) contrast(${1 + 0.06 * lv})` } as LookDef,
  home: { grade: (lv: number) => `sepia(${0.12 * lv}) saturate(${1 + 0.22 * lv}) brightness(${1 + 0.05 * lv})` } as LookDef,
  drained: chipLook('ĐẠI DƯƠNG: 0%', (lv) => `brightness(${1 + 0.08 * lv}) contrast(${1 - 0.08 * lv}) saturate(${1 - 0.28 * lv}) sepia(${0.22 * lv})`, '#FF5A48', Bleach),
};
