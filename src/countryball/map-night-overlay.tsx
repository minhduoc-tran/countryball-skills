import React from 'react';
import { useT } from './hud-anim';

// Air-raid alarm overlay: a red vignette that breathes with the siren (default 1.1 pulses per second) plus a hot
// edge. Draw it above the map, below the HUD. level 0..1 sets how strong (0 = off). Pure function of t.
export const AirRaidPulse: React.FC<{ level?: number; hz?: number; t?: number; id?: string }> = ({ level = 1, hz = 1.1, t, id = 'raid' }) => {
  const T = useT(t);
  if (level <= 0) return null;
  const s = (Math.sin(2 * Math.PI * hz * T - Math.PI / 2) + 1) / 2;   // 0..1, starts dark
  const k = level * (0.25 + 0.75 * Math.pow(s, 1.6));
  return (
    <g pointerEvents="none">
      <defs>
        <radialGradient id={`${id}-vig`} cx="50%" cy="50%" r="75%">
          <stop offset="0.45" stopColor="#FF1F2A" stopOpacity={0} /><stop offset="1" stopColor="#FF1F2A" stopOpacity={0.62} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${id}-vig)`} opacity={k} />
      <rect x={6} y={6} width={1908} height={1068} fill="none" stroke="#FF3B3B" strokeWidth={12} opacity={0.5 * k} />
    </g>
  );
};
