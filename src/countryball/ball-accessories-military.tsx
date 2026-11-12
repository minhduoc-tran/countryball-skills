import React from 'react';
import { star } from './ball-flags';

// More ball accessories (units: ball radius 1, top of the ball y = -1, eyes y = -0.08; pass as Ball's `hat`):
//   <M1Helmet net? />                 steel pot helmet with net and chin straps: VNCH and US infantry
//   <Beret color? badge? />           slouched beret: '#B3262B' red = Dù (Airborne), '#2F6B3A' green = TQLC (Marines); gold badge
//   <TankCrewHelmet color? />         mũ lái xe tăng: padded cloth/leather tank-crew helmet with seams and ear flaps (VNM tank crews, 1975)
//   <NavyCap style? />                'officer' white combination cap (black band, black peak, gold anchor) | 'dixie' white sailor cap
// (MuCoi with leaf camouflage: `<MuCoi camo />` in ball-accessories.tsx.)

const W = { stroke: '#111', strokeWidth: 0.05, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export const M1Helmet: React.FC<{ net?: boolean; color?: string }> = ({ net = true, color = '#5E6B3A' }) => (
  <g transform="translate(0,-0.6)">
    {/* chin straps hanging behind the brim */}
    <path d="M-0.86,0.0 Q-0.96,0.36 -0.74,0.56 M0.86,0.0 Q0.96,0.36 0.74,0.56" fill="none" stroke="#B7A874" strokeWidth={0.06} strokeLinecap="round" />
    <path d="M-0.92,0.04 Q-0.92,-0.6 0,-0.64 Q0.92,-0.6 0.92,0.04 Q0,0.14 -0.92,0.04 Z" fill={color} {...W} />
    <path d="M-0.92,0.04 Q0,0.14 0.92,0.04 L0.9,-0.04 Q0,0.06 -0.9,-0.04 Z" fill="#46522A" stroke="none" />
    {net && <g fill="none" stroke="#2D3A1C" strokeWidth={0.025} opacity={0.55}>
      <path d="M-0.7,-0.14 Q0,-0.3 0.7,-0.14" /><path d="M-0.6,-0.32 Q0,-0.46 0.6,-0.32" /><path d="M-0.34,-0.52 Q0,-0.58 0.34,-0.52" />
      <path d="M-0.5,-0.04 Q-0.34,-0.4 -0.16,-0.6" /><path d="M-0.16,-0.02 Q-0.08,-0.4 0,-0.62" /><path d="M0.2,-0.02 Q0.12,-0.4 0,-0.62" /><path d="M0.54,-0.04 Q0.36,-0.4 0.16,-0.6" />
    </g>}
    <path d="M-0.5,-0.5 Q-0.3,-0.6 -0.12,-0.58" fill="none" stroke="#96A468" strokeWidth={0.05} strokeLinecap="round" opacity={0.75} />
    <path d="M-0.92,0.04 Q0,0.14 0.92,0.04" fill="none" stroke="#111" strokeWidth={0.07} strokeLinecap="round" />
  </g>
);

export const Beret: React.FC<{ color?: string; badge?: 'wings' | 'anchor' | 'none' }> = ({ color = '#B3262B', badge = 'wings' }) => (
  <g transform="translate(0.04,-0.74) rotate(-9)">
    <path d="M-0.92,0.12 Q-1.0,-0.2 -0.5,-0.36 Q0,-0.52 0.62,-0.3 Q1.06,-0.14 0.98,0.1 Q0.3,-0.02 -0.92,0.12 Z" fill={color} {...W} />
    <path d="M-0.92,0.12 Q0.3,-0.02 0.98,0.1" fill="none" stroke="#111" strokeWidth={0.06} strokeLinecap="round" />
    <path d="M-0.5,0.0 Q-0.3,0.04 -0.06,0.03" fill="none" stroke="#000" strokeWidth={0.04} opacity={0.2} />
    <ellipse cx={0.18} cy={-0.5} rx={0.05} ry={0.035} fill={color} stroke="#111" strokeWidth={0.03} />
    {badge === 'wings' && <g transform="translate(-0.42,-0.06)"><path d="M-0.2,0.02 Q-0.1,-0.06 0,-0.02 Q0.1,-0.06 0.2,0.02 Q0.1,0.0 0,0.04 Q-0.1,0.0 -0.2,0.02 Z" fill="#E8C34A" stroke="#111" strokeWidth={0.025} /><circle cx={0} cy={0} r={0.045} fill="#B3262B" stroke="#111" strokeWidth={0.02} /></g>}
    {badge === 'anchor' && <g transform="translate(-0.42,-0.04)"><circle r={0.11} fill="#E8C34A" stroke="#111" strokeWidth={0.03} /><path d="M0,-0.06 V0.07 M-0.05,0 H0.05 M-0.06,0.03 Q0,0.1 0.06,0.03" fill="none" stroke="#7A5E12" strokeWidth={0.025} /></g>}
  </g>
);

export const NavyCap: React.FC<{ style?: 'officer' | 'dixie' }> = ({ style = 'officer' }) => (style === 'dixie' ? (
  <g transform="translate(0,-0.78) rotate(-4)">
    <path d="M-0.62,0.18 Q-0.7,-0.18 -0.3,-0.3 Q0,-0.38 0.3,-0.3 Q0.7,-0.18 0.62,0.18 Q0,0.06 -0.62,0.18 Z" fill="#F6F6F2" {...W} />
    <path d="M-0.62,0.18 Q0,0.06 0.62,0.18 L0.7,0.3 Q0,0.18 -0.7,0.3 Z" fill="#F0F0EA" {...W} />
    <path d="M-0.64,0.04 Q0,-0.06 0.64,0.04" fill="none" stroke="#1B2A4A" strokeWidth={0.07} strokeLinecap="round" />
  </g>
) : (
  <g transform="translate(0,-0.66) rotate(-3)">
    <path d="M-0.9,0.0 Q-0.98,-0.4 -0.5,-0.5 Q0,-0.62 0.5,-0.5 Q0.98,-0.4 0.9,0.0 Z" fill="#F7F7F3" {...W} />
    <path d="M-0.9,-0.08 L0.9,-0.08 L0.9,0.04 L-0.9,0.04 Z" fill="#17181C" {...W} />
    <path d="M-0.7,0.04 Q0,0.4 0.92,0.12 Q0.82,0.0 0.7,0.04 Z" fill="#14161A" {...W} />
    <g transform="translate(0,-0.22)"><circle r={0.15} fill="#E8C34A" stroke="#111" strokeWidth={0.035} /><path d="M0,-0.09 V0.09 M-0.07,-0.02 H0.07 M-0.09,0.03 Q0,0.14 0.09,0.03" fill="none" stroke="#7A5E12" strokeWidth={0.03} strokeLinecap="round" /></g>
  </g>
));

/** Padded tank-crew helmet (the Soviet-pattern "mũ lái xe tăng" worn by QĐND tank crews): close-fitting dome with three padded ridges,
 *  ear flaps, a small red star badge. Dark khaki by default; pass `color` for the black/navy version. */
export const TankCrewHelmet: React.FC<{ color?: string }> = ({ color = '#3F4A2E' }) => (
  <g transform="translate(0,-0.58)">
    <path d="M-0.94,0.34 Q-1.02,-0.1 -0.8,-0.34 Q-0.4,-0.7 0,-0.7 Q0.4,-0.7 0.8,-0.34 Q1.02,-0.1 0.94,0.34 Q0.9,0.46 0.78,0.4 L0.74,0.12 Q0,0.04 -0.74,0.12 L-0.78,0.4 Q-0.9,0.46 -0.94,0.34 Z" fill={color} {...W} />
    <path d="M-0.74,0.12 Q0,0.04 0.74,0.12 L0.72,0.02 Q0,-0.06 -0.72,0.02 Z" fill="#000" opacity={0.22} stroke="none" />
    {/* padded ridges running front to back */}
    <path d="M-0.3,0.04 Q-0.34,-0.34 -0.2,-0.68 M0,0.02 L0,-0.7 M0.3,0.04 Q0.34,-0.34 0.2,-0.68" fill="none" stroke="#111" strokeWidth={0.04} strokeLinecap="round" opacity={0.7} />
    <path d="M-0.5,-0.3 Q0,-0.46 0.5,-0.3" fill="none" stroke="#111" strokeWidth={0.03} opacity={0.4} />
    <path d="M-0.55,-0.5 Q-0.3,-0.64 -0.1,-0.62" fill="none" stroke="#fff" strokeWidth={0.05} strokeLinecap="round" opacity={0.18} />
    <g transform="translate(0,-0.12)"><circle r={0.12} fill="#DA251D" stroke="#111" strokeWidth={0.035} /><polygon points={star(0, 0, 0.085)} fill="#FFCD00" /></g>
    <rect x={-0.1} y={-0.0} width={0.2} height={0.06} rx={0.02} fill="#2A311E" stroke="#111" strokeWidth={0.025} />
  </g>
);
