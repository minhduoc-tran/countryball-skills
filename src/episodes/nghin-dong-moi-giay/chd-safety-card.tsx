import React from 'react';
import { Schematic, SchLabel, SCH, FONT, clamp, easeOut, backOut, kf } from '../../engine';

// "4 · AN TOÀN": the numbered chapter card on the schematic, same layout as last-one's CostCard (ring with the number,
// the word, an underline drawing on, a glowing line icon), with a shield and keyhole as its icon.

const Shield: React.FC<{ t: number }> = ({ t }) => (
  <g stroke={SCH.live} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }}>
    <g transform={`translate(0 ${Math.sin(t / 8) * 4})`}>
      <path d="M 0 -68 L 52 -48 Q 52 28 0 68 Q -52 28 -52 -48 Z" />
      <circle cx={0} cy={-14} r={13} />
      <path d="M 0 -1 L 0 30" />
    </g>
  </g>
);

export const SafetyCard: React.FC<{ t: number; len: number; id: string }> = ({ t, len, id }) => {
  const ring = backOut(clamp((t + 2) / 7));
  const wordIn = backOut(clamp((t - 3) / 7));
  const iconIn = backOut(clamp((t - 7) / 7));
  const underline = easeOut(clamp((t - 8) / 10));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.07]])}) translate(-960 -540)`}>
      <Schematic t={t} id={id} />
      <g transform={`translate(400 520) scale(${ring})`}>
        <circle r={190} fill={`${SCH.live}1A`} stroke={SCH.live} strokeWidth={8} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}88)` }} />
        <text y={104} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={290} fill={SCH.live}>4</text>
      </g>
      <g transform={`translate(700 585) scale(${wordIn})`}>
        <text fontFamily={FONT.ui} fontWeight={700} fontSize={118} fill={SCH.line} letterSpacing={3}>AN TOÀN</text>
      </g>
      <path d="M 704 640 L 1560 640" stroke={SCH.live} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - underline} />
      <g transform={`translate(1600 400) scale(${2.1 * iconIn})`}>
        <Shield t={t} />
      </g>
      <SchLabel x={400} y={800} t={t - 6} text="CÁI GIÁ" size={34} color={SCH.dim} />
    </g>
  );
};
