import React from 'react';
import { LookDef, UI, FONT, clamp } from '../../engine';

// The episode's looks, used as "look": "<name>" on edit entries (tools/merge-chapters.py imports `looks`).
// "countdown": the last sunlight still on its way. A chip in the top right counts 08:20 down to 00:00 across the
//   look's whole run (p goes 0 -> 1 over the consecutive edit entries that carry it), then the world goes dark.
// "cold": the freezing world. A blue, drained grade and frost creeping in from the corners.

const Countdown: React.FC<{ p: number; f: number }> = ({ p, f }) => {
  const left = Math.max(0, Math.round(500 * (1 - p)));
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const warn = left < 60 && Math.floor(f / 6) % 2 === 0;
  return (
    <g transform="translate(1640 96)">
      <rect x={-170} y={-46} width={340} height={92} rx={46} fill={UI.pill} opacity={0.62} />
      <circle cx={-120} cy={0} r={22} fill="#FFC85A" opacity={0.35 + 0.65 * (1 - p)} />
      <text x={30} y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill={warn ? '#FF5A4A' : '#FFE2A8'} letterSpacing={3}>{`${mm}:${ss}`}</text>
    </g>
  );
};

const Frost: React.FC<{ lv: number }> = ({ lv }) => (
  <g opacity={0.55 * lv}>
    <defs>
      <radialGradient id="frostVignette" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.55" stopColor="#CFE6FF" stopOpacity={0} />
        <stop offset="1" stopColor="#E8F4FF" stopOpacity={0.9} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#frostVignette)" />
  </g>
);

const countdown: LookDef = { Overlay: ({ p, f }) => <Countdown p={clamp(p)} f={f} /> };
const cold: LookDef = {
  grade: (lv) => `saturate(${1 - 0.5 * lv}) hue-rotate(${18 * lv}deg) brightness(${1 - 0.06 * lv})`,
  Overlay: ({ lv }) => <Frost lv={lv} />,
};
const memory: LookDef = {
  grade: (lv) => `sepia(${0.55 * lv}) saturate(${1 - 0.25 * lv}) brightness(${1 + 0.05 * lv}) contrast(${1 - 0.08 * lv})`,
};

export const looks = { countdown, cold, memory };
