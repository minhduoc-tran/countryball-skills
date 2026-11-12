import React from 'react';
import { FONT } from '../../engine';
import { easeOut } from '../../countryball/fx-math';
import { INK } from './chc-common';

/** Unit roster card (left column): coloured side stripe, big unit name, small parent unit. Slides in from the left at frame `at`. */
export const UnitCard: React.FC<{ t: number; at: number; y: number; name: string; sub?: string; color?: string; x?: number; w?: number; hot?: boolean }> = ({
  t, at, y, name, sub, color = '#E0483C', x = 56, w = 500, hot = false,
}) => {
  const k = easeOut((t - at) / 9);
  if (k <= 0.01) return null;
  const glow = hot ? 0.5 + 0.5 * Math.sin((t - at) / 4) : 0;
  return (
    <g transform={`translate(${x - (1 - k) * (w + 80)},${y})`} opacity={Math.min(1, k * 1.5)}>
      <rect x={6} y={8} width={w} height={104} rx={14} fill="#000" opacity={0.35} />
      <rect width={w} height={104} rx={14} fill="#15181F" fillOpacity={0.94} stroke={hot ? '#FFE08A' : INK} strokeWidth={hot ? 5 + glow * 2 : 4} />
      <rect width={16} height={104} rx={8} fill={color} />
      <text x={40} y={sub ? 52 : 66} fontFamily={FONT.title} fontWeight={800} fontSize={name.length > 16 ? 36 : 46} fill="#FFF">{name}</text>
      {sub && <text x={40} y={86} fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#E2B95A">{sub}</text>}
    </g>
  );
};
