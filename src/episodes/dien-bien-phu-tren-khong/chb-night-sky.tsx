import React from 'react';
import { hash } from '../../countryball/fx-math';

/** Night-sky card background for side-view aircraft shots: gradient, drifting stars and a few thin cloud streaks. s = seconds. */
export const NightSky: React.FC<{ s: number; id: string; speed?: number }> = ({ s, id, speed = 1 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050914" /><stop offset="1" stopColor="#1D2F4B" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${id}-sky)`} />
    {Array.from({ length: 50 }, (_, i) => (
      <circle key={i} cx={(((hash(i, 1) * 2000 - s * speed * (8 + hash(i, 2) * 40)) % 2000) + 2000) % 2000 - 40} cy={hash(i, 3) * 650} r={1.4 + hash(i, 4) * 2.2} fill="#FFF" opacity={0.25 + 0.55 * hash(i, 5)} />
    ))}
    {[0, 1, 2].map((i) => (
      <rect key={i} x={((((i * 700 - s * speed * (520 + i * 220)) % 2400) + 2400) % 2400) - 400} y={420 + i * 170} width={420 + i * 120} height={4} rx={2} fill="#9DB6D6" opacity={0.16} />
    ))}
  </g>
);
