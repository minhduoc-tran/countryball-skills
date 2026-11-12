import React from 'react';
import { clamp, backOut, FONT, UI, Hero, Pose, Look } from '../../engine';
import { PAL } from './kit-palette';

// Chapter E street props. Pure functions of t. x, y = CENTRE unless said.
//   <NameTag x y text t at col? />   a name label on a pill with a little pointer down to a head (x y = pointer tip).
//   <Ghost look pose o? />           a character's future self: the rig drawn translucent and tinted cyan, a dashed
//       ring on the ground (the minute Pip already knows they will be there).

export const NameTag: React.FC<{ x: number; y: number; text: string; t: number; at: number; col?: string; size?: number }> = ({ x, y, text, t, at, col = UI.text, size = 34 }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 7));
  const w = text.length * size * 0.64 + 44;
  const h = size * 1.7;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d={`M -14 ${-18} L 0 0 L 14 ${-18} Z`} fill={UI.pill} opacity={0.9} />
      <rect x={-w / 2} y={-18 - h} width={w} height={h} rx={h / 2} fill={UI.pill} opacity={0.9} stroke={PAL.cyan} strokeWidth={3} />
      <text y={-18 - h / 2 + size * 0.36} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={col} letterSpacing={1}>{text}</text>
    </g>
  );
};

export const Ghost: React.FC<{ look: Look; pose: Pose; o?: number }> = ({ look, pose, o = 0.45 }) => (
  <g opacity={o}>
    <ellipse cx={pose.x} cy={pose.y + 140 * pose.scale} rx={70 * pose.scale} ry={16 * pose.scale} fill="none" stroke={PAL.cyan} strokeWidth={4} strokeDasharray="10 8" />
    <g style={{ filter: 'grayscale(1) sepia(1) hue-rotate(140deg) saturate(2.4) brightness(1.15)' }}>
      <Hero look={look} pose={pose} rimId="rimBlue" shadow={0} />
    </g>
  </g>
);

