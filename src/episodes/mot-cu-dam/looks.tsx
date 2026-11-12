import React from 'react';
import { LookDef, UI, FONT, clamp } from '../../engine';

// The episode's looks ("look": "<name>" on edit entries; tools/merge-chapters.py imports `looks`).
// "fight": a punch is coming. Punchy grade (contrast, saturation) and a chip in the top right, a fist + "1 CÚ ĐẤM",
//   whose tick blinks in at the start of each run: the visual grammar of the power.
// "bored": the thrill is gone. Washed-out, grey, a little flat.
// "watched": the drone is filming you. Camera-feed overlay: corner brackets, a blinking red "● REC", a timecode.
// "storm": the typhoon night. Cold, dark blue grade.

const FistChip: React.FC<{ p: number }> = ({ p }) => {
  const tick = clamp(p * 6);
  return (
    <g transform="translate(1630 96)">
      <rect x={-200} y={-46} width={400} height={92} rx={46} fill={UI.pill} opacity={0.65} />
      <g transform="translate(-150 0)">
        <rect x={-24} y={-20} width={46} height={40} rx={12} fill="#F3E3C8" stroke="#1D2033" strokeWidth={4} />
        <path d="M -12 -20 v 14 M 0 -20 v 14 M 12 -20 v 14" stroke="#1D2033" strokeWidth={3} />
      </g>
      <text x={-100} y={13} fontFamily={FONT.ui} fontSize={36} fill={UI.text} letterSpacing={2}>1 CÚ ĐẤM</text>
      <g opacity={tick}>
        <circle cx={158} cy={0} r={22} fill="#FFC531" />
        <path d="M 147 1 l 7 8 l 14 -16" stroke="#3A2A00" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

const RecOverlay: React.FC<{ f: number }> = ({ f }) => {
  const s = Math.floor(f / 30);
  const tc = `00:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const c = (x: number, y: number, dx: number, dy: number) => <path d={`M ${x} ${y + dy * 70} V ${y} H ${x + dx * 110}`} stroke="#E9F1F4" strokeWidth={6} fill="none" opacity={0.85} />;
  return (
    <g>
      {c(70, 60, 1, 1)}{c(1850, 60, -1, 1)}{c(70, 1020, 1, -1)}{c(1850, 1020, -1, -1)}
      <circle cx={130} cy={128} r={14} fill="#FF3B3B" opacity={f % 30 < 18 ? 1 : 0.15} />
      <text x={156} y={141} fontFamily={FONT.ui} fontSize={36} fill="#E9F1F4" letterSpacing={3}>REC</text>
      <text x={1790} y={1000} textAnchor="end" fontFamily={FONT.ui} fontSize={32} fill="#E9F1F4" opacity={0.85}>{tc}</text>
      <path d="M 945 540 h 30 M 960 525 v 30" stroke="#E9F1F4" strokeWidth={3} opacity={0.6} />
    </g>
  );
};

const fight: LookDef = {
  grade: (lv) => `contrast(${1 + 0.12 * lv}) saturate(${1 + 0.18 * lv})`,
  Overlay: ({ p }) => <FistChip p={p} />,
};
const bored: LookDef = {
  grade: (lv) => `saturate(${1 - 0.6 * lv}) contrast(${1 - 0.1 * lv}) brightness(${1 - 0.04 * lv})`,
};
const watched: LookDef = {
  grade: (lv) => `saturate(${1 - 0.35 * lv}) contrast(${1 + 0.08 * lv}) hue-rotate(${10 * lv}deg)`,
  Overlay: ({ f }) => <RecOverlay f={f} />,
};
const storm: LookDef = {
  grade: (lv) => `saturate(${1 - 0.25 * lv}) brightness(${1 - 0.12 * lv}) hue-rotate(${12 * lv}deg)`,
};

export const looks = { fight, bored, watched, storm };
