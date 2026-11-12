import React from 'react';
import { easeOut, hash } from '../../countryball/fx-math';

// Chapter H small icons: speech-bubble "comment" icon with bouncing dots (CTA), a wrought-iron gate icon, drifting warm sparkles for the closing image.
// All pure functions of props / frame `t`.

const INK = '#1B1B1E';

/** Comment icon: white rounded bubble with a tail and three dots that bounce in turn. (x, y) = centre, s = scale (1 = 260 px wide). */
export const CommentIcon: React.FC<{ t: number; at?: number; x: number; y: number; s?: number }> = ({ t, at = 0, x, y, s = 1 }) => {
  const k = easeOut((t - at) / 12);
  if (k <= 0.01) return null;
  const sc = s * (0.6 + 0.4 * k) * (1 + 0.025 * Math.sin(t / 10));
  return (
    <g transform={`translate(${x},${y}) scale(${sc})`} opacity={k}>
      <rect x={-130} y={-96} width={260} height={176} rx={52} fill="#000" opacity={0.3} transform="translate(8,10)" />
      <path d="M-70,70 L-96,128 L-14,78 Z" fill="#FFFFFF" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <rect x={-130} y={-96} width={260} height={176} rx={52} fill="#FFFFFF" stroke={INK} strokeWidth={7} />
      <path d="M-72,66 L-92,112 L-26,74 Z" fill="#FFFFFF" />
      {[-62, 0, 62].map((dx, i) => <circle key={i} cx={dx} cy={-8 - 16 * Math.max(0, Math.sin(t / 5 - i * 1.3)) } r={19} fill={i === 1 ? '#C9343A' : '#2F3E58'} />)}
    </g>
  );
};

/** Wrought-iron gate icon: two pillars with caps and a barred leaf. (x, y) = centre. */
export const GateIcon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-130} y={-96} width={260} height={192} rx={42} fill="#FFFFFF" stroke={INK} strokeWidth={7} />
    <path d="M-60,96 L-80,140 L-8,96 Z" fill="#FFFFFF" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-60} y={96 - 8} width={60} height={16} fill="#FFFFFF" />
    {[-92, 92].map((px) => <g key={px}><rect x={px - 13} y={-62} width={26} height={140} fill="#E9E4D3" stroke={INK} strokeWidth={4} /><rect x={px - 17} y={-74} width={34} height={14} fill="#DAD3BC" stroke={INK} strokeWidth={4} /></g>)}
    {[-60, -36, -12, 12, 36, 60].map((bx) => <g key={bx}><line x1={bx} y1={-50} x2={bx} y2={78} stroke="#2A2E38" strokeWidth={6} strokeLinecap="round" /><polygon points={`${bx - 6},-50 ${bx + 6},-50 ${bx},-66`} fill="#2A2E38" /></g>)}
    <line x1={-72} y1={-30} x2={72} y2={-30} stroke="#2A2E38" strokeWidth={5} /><line x1={-72} y1={52} x2={72} y2={52} stroke="#2A2E38" strokeWidth={5} />
  </g>
);

/** Slow warm sparkles / fireflies over the closing image. */
export const Sparkles: React.FC<{ t: number; n?: number }> = ({ t, n = 18 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = hash(i, 11) * 1920 + Math.sin(t / 40 + i) * 30, y = 200 + hash(i, 12) * 700 - ((t * (0.25 + 0.3 * hash(i, 13))) % 140), tw = 0.35 + 0.35 * Math.sin(t / 12 + i * 2.1);
      return <circle key={i} cx={x} cy={y} r={2 + 2.2 * hash(i, 14)} fill="#FFE2A0" opacity={tw} />;
    })}
  </g>
);
