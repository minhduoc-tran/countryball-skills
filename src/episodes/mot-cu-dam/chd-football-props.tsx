import React from 'react';
import { Glow, LOOKS, Look, rnd } from '../../engine';

// Chapter D props, part 5: the football pitch at dusk, a ball, and the other kids' looks. Pure functions of t.
//
//   <Pitch t id />                dusk sky, tree line, mown grass stripes in perspective, a goal far left; characters stand at y ~ 820
//   <Ball x y r? rot? />          a classic football (white, black patches); x, y = centre
//   KIDS                          three schoolkids' looks (not Pip, not Mo)

const INK = '#16101A';
export const PITCH_GROUND = 820;

export const KIDS: Look[] = [
  { ...LOOKS.sis, jacket: '#C9553E', jacketShade: '#A64430', accent: '#F2C94C' },
  { ...LOOKS.mo, jacket: '#4A6A9A', jacketShade: '#3A5580', extra: undefined, hair: '#2A1C18' },
  { ...LOOKS.pip, jacket: '#7AA05A', jacketShade: '#5E8044', accent: '#3A5A2A' },
];

export const Pitch: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3C3C78" />
        <stop offset="55%" stopColor="#C8708A" />
        <stop offset="100%" stopColor="#F2A66A" />
      </linearGradient>
      <linearGradient id={`${id}grass`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3F7A48" />
        <stop offset="100%" stopColor="#245436" />
      </linearGradient>
    </defs>
    <rect x={-200} y={-200} width={2320} height={900} fill={`url(#${id}sky)`} />
    <circle cx={1420} cy={560} r={150} fill="#FFD9A0" opacity={0.9} />
    <Glow x={1420} y={560} r={520} o={0.55} />
    {[0, 1, 2, 3].map((i) => (
      <ellipse key={i} cx={260 + i * 470 + ((t * 0.12) % 40)} cy={170 + (i % 2) * 90} rx={210} ry={32} fill="#F4C4B4" opacity={0.35} />
    ))}
    {/* tree line */}
    {Array.from({ length: 16 }).map((_, i) => (
      <circle key={i} cx={-40 + i * 135} cy={612 - rnd(3, i) * 30} r={78 + rnd(4, i) * 40} fill={i % 2 ? '#2B4A3A' : '#244034'} />
    ))}
    <rect x={-200} y={610} width={2320} height={600} fill={`url(#${id}grass)`} />
    {/* mown stripes, widening toward the camera */}
    {Array.from({ length: 9 }).map((_, i) => {
      const y0 = 640 + Math.pow(i / 9, 1.6) * 460;
      const y1 = 640 + Math.pow((i + 1) / 9, 1.6) * 460;
      return i % 2 ? <rect key={i} x={-200} y={y0} width={2320} height={y1 - y0} fill="#FFFFFF" opacity={0.06} /> : null;
    })}
    <path d="M -100 700 L 2020 700" stroke="#FFFFFF" strokeWidth={5} opacity={0.5} />
    {/* the goal, far left */}
    <g transform="translate(250 700)" stroke="#F4F1EA" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 0 0 V -100 H 190 V 0" />
      <path d="M 0 -100 L -34 -76 V 4 M 190 -100 L 224 -76 V 4" strokeWidth={5} opacity={0.8} />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${i * 24} -100 L ${i * 24 - 30} -76`} strokeWidth={2.5} opacity={0.5} />)}
    </g>
  </g>
);

export const Ball: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 44, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r} fill="#FFFFFF" stroke={INK} strokeWidth={r * 0.1} />
    <polygon points={`0,${-r * 0.42} ${r * 0.4},${-r * 0.13} ${r * 0.25},${r * 0.34} ${-r * 0.25},${r * 0.34} ${-r * 0.4},${-r * 0.13}`} fill={INK} />
    {[0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return <path key={i} d={`M ${Math.cos(a) * r * 0.42} ${Math.sin(a) * r * 0.42} L ${Math.cos(a) * r * 0.9} ${Math.sin(a) * r * 0.9}`} stroke={INK} strokeWidth={r * 0.07} />;
    })}
    <path d={`M ${-r * 0.6} ${-r * 0.5} Q ${-r * 0.3} ${-r * 0.85} ${r * 0.1} ${-r * 0.82}`} stroke="#FFFFFF" strokeWidth={r * 0.12} fill="none" strokeLinecap="round" opacity={0.7} />
  </g>
);
