import React from 'react';
import { star } from './ball-flags';

// Ball accessories, drawn in ball units (radius 1, eyes at y = -0.08, top of the ball at y = -1). Pass one as Ball's
// `hat` (or several in a fragment). Outlines are 0.05 like the ball.

const W = { stroke: '#111', strokeWidth: 0.05, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// Conical Vietnamese hat sitting on the top of the ball.
export const NonLa: React.FC = () => (
  <g transform="translate(0,-0.82) rotate(-8)">
    <path d="M-1.08,0.12 L0,-0.62 L1.08,0.12 Q0,0.3 -1.08,0.12 Z" fill="#EAD39A" stroke="#111" strokeWidth={0.05} strokeLinejoin="round" />
    {[-0.6, -0.25, 0.25, 0.6].map((k) => <line key={k} x1={0} y1={-0.6} x2={k * 1.6} y2={0.16 + Math.abs(k) * -0.05} stroke="#B89A55" strokeWidth={0.025} />)}
    <path d="M-1.08,0.12 Q0,0.3 1.08,0.12" fill="none" stroke="#9C7E3E" strokeWidth={0.04} />
  </g>
);

/** Mũ cối: olive pith helmet, round dome, flat brim all round, band and a small red star badge on the front.
 *  `camo` adds leaf camouflage (foliage sprigs stuck in the band, the way bộ đội wore it in the field). */
export const MuCoi: React.FC<{ camo?: boolean }> = ({ camo = false }) => (
  <g transform="translate(0,-0.62)">
    <path d="M-0.84,-0.02 Q-0.8,-0.62 0,-0.64 Q0.8,-0.62 0.84,-0.02 Z" fill="#6B7A3A" {...W} />
    <path d="M-0.83,-0.12 L0.83,-0.12 L0.84,-0.02 L-0.84,-0.02 Z" fill="#4E5A28" stroke="none" />
    <path d="M-0.4,-0.56 Q-0.2,-0.62 -0.1,-0.5" fill="none" stroke="#97A55C" strokeWidth={0.05} strokeLinecap="round" opacity={0.8} />
    <path d="M-1.02,0.02 Q0,0.22 1.02,0.02 Q0.98,-0.06 0.84,-0.04 L-0.84,-0.04 Q-0.98,-0.06 -1.02,0.02 Z" fill="#5C6A30" {...W} />
    <circle cx={0} cy={-0.3} r={0.17} fill="#DA251D" stroke="#111" strokeWidth={0.04} />
    <polygon points={star(0, -0.3, 0.12)} fill="#FFCD00" />
    {camo && [[-0.74, -0.2, -60, '#3E7A2E'], [-0.5, -0.5, -25, '#4F8F38'], [0.42, -0.5, 25, '#3E7A2E'], [0.72, -0.22, 60, '#4F8F38'], [-0.2, -0.62, -10, '#5FA044'], [0.1, -0.6, 12, '#4F8F38'], [-0.88, -0.02, -85, '#4F8F38'], [0.88, -0.02, 85, '#3E7A2E']].map(([x, y, r, c], i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${r})`}><path d="M0,0 Q0.14,-0.1 0,-0.3 Q-0.14,-0.1 0,0 Z" fill={c as string} stroke="#111" strokeWidth={0.03} strokeLinejoin="round" /><line x1={0} y1={0} x2={0} y2={-0.24} stroke="#1E4318" strokeWidth={0.02} /></g>
    ))}
  </g>
);

/** US pilot helmet: light-grey shell with a tinted visor pushed up on the forehead and an oxygen-mask strap. */
export const PilotHelmet: React.FC = () => (
  <g transform="translate(0,-0.5)">
    <path d="M-0.9,0.1 Q-0.95,-0.6 0,-0.66 Q0.95,-0.6 0.9,0.1 Q0.5,-0.04 0,-0.04 Q-0.5,-0.04 -0.9,0.1 Z" fill="#D8DDE2" {...W} />
    <path d="M-0.6,-0.14 Q-0.3,-0.5 0,-0.5 Q0.3,-0.5 0.6,-0.14 Q0.3,-0.06 0,-0.06 Q-0.3,-0.06 -0.6,-0.14 Z" fill="#2E4056" {...W} />
    <path d="M-0.4,-0.36 Q-0.15,-0.46 0.05,-0.43" fill="none" stroke="#9DB6CF" strokeWidth={0.05} strokeLinecap="round" />
    <path d="M-0.04,-0.62 L-0.04,-0.5 M0.1,-0.62 L0.1,-0.5" stroke="#8D949B" strokeWidth={0.04} />
    <path d="M-0.92,0.08 L-0.92,0.3 Q-0.84,0.4 -0.72,0.3 L-0.72,0.1 Z" fill="#B7BEC5" {...W} />
    <path d="M0.92,0.08 L0.92,0.3 Q0.84,0.4 0.72,0.3 L0.72,0.1 Z" fill="#B7BEC5" {...W} />
  </g>
);

/** USAF officer cap: dark blue crown, black peak, gold badge. */
export const UsafCap: React.FC = () => (
  <g transform="translate(0,-0.62) rotate(-4)">
    <path d="M-0.86,0.06 Q-0.9,-0.42 -0.45,-0.5 Q0,-0.58 0.45,-0.5 Q0.9,-0.42 0.86,0.06 Z" fill="#26407A" {...W} />
    <path d="M-0.9,0.0 L0.9,0.0 L0.86,0.1 L-0.86,0.1 Z" fill="#1A2A55" {...W} />
    <path d="M-0.7,0.1 Q0,0.4 0.9,0.12 Q0.8,0.0 0.7,0.06 Z" fill="#14161A" {...W} />
    <path d="M-0.2,-0.2 Q0,-0.4 0.2,-0.2 L0.14,-0.04 L-0.14,-0.04 Z" fill="#E8C34A" stroke="#111" strokeWidth={0.04} />
    <path d="M-0.12,-0.16 L0.12,-0.16 M-0.1,-0.1 L0.1,-0.1" stroke="#7A5E12" strokeWidth={0.03} />
  </g>
);

/** Aviator sunglasses covering both eyes: gold frame, dark teardrop lenses, glint, bridge. */
export const Aviators: React.FC<{ look?: number }> = ({ look = 0 }) => (
  <g transform={`translate(${look * 0.12},-0.06)`}>
    {[-0.34, 0.34].map((x) => (
      <g key={x}>
        <path d={`M${x - 0.3},-0.2 Q${x},-0.3 ${x + 0.3},-0.2 Q${x + 0.28},0.2 ${x},0.3 Q${x - 0.28},0.2 ${x - 0.3},-0.2 Z`} fill="#15181C" stroke="#C9A227" strokeWidth={0.05} strokeLinejoin="round" />
        <path d={`M${x - 0.18},-0.14 L${x - 0.04},-0.18 M${x - 0.2},-0.06 L${x - 0.12},-0.08`} stroke="#8EA4BA" strokeWidth={0.04} strokeLinecap="round" />
      </g>
    ))}
    <path d="M-0.06,-0.2 Q0,-0.26 0.06,-0.2" fill="none" stroke="#C9A227" strokeWidth={0.05} />
    <path d="M-0.64,-0.18 L-0.96,-0.1 M0.64,-0.18 L0.96,-0.1" stroke="#C9A227" strokeWidth={0.04} strokeLinecap="round" />
  </g>
);

/** Radar operator headset: band over the top, ear cups on both sides, boom mic towards the mouth. */
export const Headset: React.FC = () => (
  <g>
    <path d="M-0.94,-0.1 Q-0.95,-1.02 0,-1.02 Q0.95,-1.02 0.94,-0.1" fill="none" stroke="#111" strokeWidth={0.15} strokeLinecap="round" />
    <path d="M-0.94,-0.1 Q-0.95,-1.02 0,-1.02 Q0.95,-1.02 0.94,-0.1" fill="none" stroke="#4A5058" strokeWidth={0.08} strokeLinecap="round" />
    {[-1, 1].map((s) => <rect key={s} x={s * 0.93 - 0.11} y={-0.28} width={0.22} height={0.42} rx={0.09} fill="#2A2F36" {...W} />)}
    <path d="M-0.93,0.12 Q-0.9,0.5 -0.5,0.58" fill="none" stroke="#111" strokeWidth={0.045} strokeLinecap="round" />
    <circle cx={-0.46} cy={0.58} r={0.07} fill="#111" />
  </g>
);
