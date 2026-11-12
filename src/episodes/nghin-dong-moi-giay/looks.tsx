import React from 'react';
import { LookDef, UI, FONT, clamp, backOut } from '../../engine';

// The power's look. "ping": every second (every 30 frames of the film's clock) a bank notification pops in the top
// right, "+1.000 đ", with a little bounce and a green glow, then settles until the next one: the viewer learns the
// rhythm of the power. Put "look": "ping" on every edit entry where the money is flowing and the phone is "on".
// "memory": warm, faded, for remembered moments. "cold": the money feels hollow (the science of adaptation).

const PingChip: React.FC<{ f: number }> = ({ f }) => {
  const k = f % 30; // frames since the last second ticked
  const pop = backOut(clamp(k / 6));
  const glow = 1 - clamp(k / 18);
  return (
    <g transform="translate(1610 96)">
      <rect x={-200} y={-44} width={400} height={88} rx={44} fill={UI.pill} opacity={0.62} />
      <circle cx={-150} cy={0} r={24} fill="#2FBF71" opacity={0.25 + 0.6 * glow} />
      <path d="M -162 2 l 8 9 l 17 -20" stroke="#E9FFF2" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(30 0) scale(${0.8 + 0.2 * pop})`}>
        <text x={0} y={15} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#7CF0A8" letterSpacing={2}
          style={{ filter: `drop-shadow(0 0 ${10 * glow}px rgba(47,191,113,0.9))` }}>+1.000 đ</text>
      </g>
    </g>
  );
};

const ping: LookDef = { Overlay: ({ f }) => <PingChip f={f} /> };
const memory: LookDef = {
  grade: (lv) => `sepia(${0.55 * lv}) saturate(${1 - 0.25 * lv}) brightness(${1 + 0.05 * lv}) contrast(${1 - 0.08 * lv})`,
};
const cold: LookDef = {
  grade: (lv) => `saturate(${1 - 0.45 * lv}) brightness(${1 - 0.05 * lv})`,
  Overlay: ({ f }) => <PingChip f={f} />,
};

export const looks = { ping, memory, cold };
