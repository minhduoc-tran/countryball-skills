import React from 'react';

// Soft shapes safe to repeat hundreds of times: Glow shares one gradient id per colour, Puff is plain circles.

/** Soft glow: one radial gradient disc (id derived from the colour; identical duplicate defs are harmless).
 *  `blend` 'screen' lightens what is underneath (fire, lamps). */
export const Glow: React.FC<{ x: number; y: number; r: number; color?: string; o?: number; blend?: boolean }> = ({ x, y, r, color = '#FF9A2E', o = 0.5, blend = true }) => {
  if (o <= 0.002 || r <= 0.5) return null;
  const gid = `fxg-${color.replace('#', '')}`;
  return (
    <g style={blend ? { mixBlendMode: 'screen' } : undefined}>
      <defs>
        <radialGradient id={gid}>
          <stop offset="0" stopColor={color} stopOpacity={1} />
          <stop offset="0.35" stopColor={color} stopOpacity={0.55} />
          <stop offset="0.7" stopColor={color} stopOpacity={0.16} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${gid})`} opacity={Math.min(1, o)} />
    </g>
  );
};

/** Lumpy smoke puff: a main disc plus 3 offset lobes so it does not read as a perfect circle. */
export const Puff: React.FC<{ x: number; y: number; r: number; color?: string; o?: number; seed?: number }> = ({ x, y, r, color = '#2B2B2E', o = 0.8, seed = 0 }) => {
  if (o <= 0.01 || r <= 0.5) return null;
  const lobes = [0, 1, 2].map((i) => {
    const a = (seed * 2.1 + i * 2.1) % 6.28;
    return [x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45, r * (0.55 + 0.1 * i)] as const;
  });
  return (
    <g opacity={o} fill={color}>
      <circle cx={x} cy={y} r={r} />
      {lobes.map((l, i) => <circle key={i} cx={l[0]} cy={l[1]} r={l[2]} />)}
    </g>
  );
};
