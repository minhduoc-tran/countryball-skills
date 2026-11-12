import React from 'react';
import type { Eyes } from './ball-face';

// Cambodian ball accessories (ball units: radius 1, eyes at y = -0.08, top at y = -1), pass as Ball's `hat`:
//   <Krama id mode? color? />   the red/white checked krama scarf: 'neck' (knotted at the side, two tails) or 'head' (wrapped turban-style
//                               like rice farmers). `id` must be unique per ball (pattern). color: 'red' (default) | 'blue'
//   <KrCap />                   plain dark cloth cap with a short peak: the regime's ball, NEUTRAL (no badge, no weapon, no "evil" face)
// CAMBODIA_BALLS presets: { flag, hat, eyes } for the regime (DK + KrCap, neutral eyes), the people 1979-89 (PRK + krama, happy) and today
// (KHM + krama). TikTok rule: the regime is never drawn demonic or glorified; the people are friends / victims / the ones who rebuild.

const W = { stroke: '#111', strokeWidth: 0.05, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
const KRAMA = { red: ['#C8302C', '#F4EFE6'], blue: ['#2F5FA8', '#F4EFE6'] } as const;

const CheckPattern: React.FC<{ pid: string; color: 'red' | 'blue' }> = ({ pid, color }) => {
  const [a, b] = KRAMA[color];
  return (
    <pattern id={pid} patternUnits="userSpaceOnUse" width={0.18} height={0.18} patternTransform="rotate(-8)">
      <rect width={0.18} height={0.18} fill={a} />
      <rect width={0.18} height={0.055} fill={b} opacity={0.85} />
      <rect width={0.055} height={0.18} fill={b} opacity={0.85} />
      <rect width={0.055} height={0.055} fill="#FFFFFF" />
    </pattern>
  );
};

export const Krama: React.FC<{ id: string; mode?: 'neck' | 'head'; color?: 'red' | 'blue' }> = ({ id, mode = 'neck', color = 'red' }) => {
  const pid = `krama-${id}`, fill = `url(#${pid})`;
  if (mode === 'head') return (
    <g>
      <defs><CheckPattern pid={pid} color={color} /></defs>
      <path d="M-0.9,-0.4 Q-0.95,-0.95 0,-1.02 Q0.95,-0.95 0.9,-0.4 Q0,-0.56 -0.9,-0.4 Z" fill={fill} {...W} />
      <path d="M-0.92,-0.42 Q0,-0.58 0.92,-0.42 L0.9,-0.3 Q0,-0.44 -0.9,-0.3 Z" fill={fill} {...W} />
      <path d="M0.62,-0.86 Q0.86,-1.04 0.98,-0.86 Q0.86,-0.74 0.62,-0.86 Z" fill={fill} {...W} />
      <path d="M0.86,-0.86 Q1.12,-0.7 1.06,-0.42 L0.94,-0.46 Q0.98,-0.66 0.8,-0.78 Z" fill={fill} {...W} />
    </g>
  );
  return (
    <g>
      <defs><CheckPattern pid={pid} color={color} /></defs>
      {/* worn low on the ball (y 0.5..0.85) so the flag emblem above it stays visible; knot + two tails at the right */}
      <path d="M-0.88,0.46 Q0,0.8 0.88,0.46 L0.8,0.64 Q0,0.98 -0.8,0.64 Z" fill={fill} {...W} />
      <path d="M0.46,0.74 L0.42,1.14 L0.6,1.12 L0.62,0.74 Z" fill={fill} {...W} />
      <path d="M0.6,0.72 L0.8,1.08 L0.94,1.0 L0.74,0.68 Z" fill={fill} {...W} />
      <ellipse cx={0.56} cy={0.74} rx={0.13} ry={0.1} fill={fill} {...W} />
    </g>
  );
};

export const KrCap: React.FC<{ color?: string }> = ({ color = '#2E2E33' }) => (
  <g transform="translate(0,-0.66) rotate(-3)">
    <path d="M-0.8,0.04 Q-0.86,-0.4 -0.3,-0.48 Q0.1,-0.54 0.5,-0.44 Q0.86,-0.34 0.8,0.04 Z" fill={color} {...W} />
    <path d="M-0.82,0.0 L0.82,0.0 L0.8,0.1 L-0.8,0.1 Z" fill="#1E1E22" {...W} />
    <path d="M-0.5,0.08 Q0.1,0.3 0.84,0.1 Q0.74,0.0 0.6,0.06 Z" fill="#1A1A1E" {...W} />
    <path d="M-0.5,-0.36 Q-0.2,-0.44 0.1,-0.4" fill="none" stroke="#55555C" strokeWidth={0.04} strokeLinecap="round" />
  </g>
);

/** Ball presets: spread into <Ball id x y r {...CAMBODIA_BALLS.people('b1')} />. */
export const CAMBODIA_BALLS = {
  /** the Khmer Rouge regime 1975-79: DK flag, plain dark cap, neutral eyes (use 'smug' / 'angry' sparingly, never demonic) */
  regime: () => ({ flag: 'DK', hat: <KrCap />, eyes: 'normal' as Eyes }),
  /** the Cambodian people / new Cambodia 1979-89: PRK flag + krama, friendly */
  people: (id: string) => ({ flag: 'PRK', hat: <Krama id={id} />, eyes: 'happy' as Eyes }),
  /** a rice farmer: krama on the head */
  farmer: (id: string) => ({ flag: 'PRK', hat: <Krama id={id} mode="head" />, eyes: 'normal' as Eyes }),
  /** State of Cambodia 1989-93 */
  soc: (id: string) => ({ flag: 'SOC', hat: <Krama id={id} />, eyes: 'normal' as Eyes }),
  /** today's Kingdom of Cambodia (friendship scenes) */
  today: (id: string) => ({ flag: 'KHM', hat: <Krama id={id} />, eyes: 'happy' as Eyes }),
};
