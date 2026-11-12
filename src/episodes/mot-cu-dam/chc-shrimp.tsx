import React from 'react';
import { clamp, lerp, easeIn, rnd, Schematic } from '../../engine';

// CHAPTER C props, part 4: the mantis shrimp (tôm tít), its prey and the tank backdrop. Pure functions of t.
//   <TankBack t id />                          blueprint grid tinted like water, sand floor (y 880+), seaweed, rising bubbles
//   <MantisShrimp x y s t strike? />           side view facing right, colourful, club arm; strike 0..1 swings the club forward
//   clubTip(x, y, s, strike)                    world position of the club's centre (aim effects at it)
//   <PreyCrab x y s t hit? />                  a small crab: shakes and cracks as `hit` 0..1 grows
const INK = '#16101A';

export const TankBack: React.FC<{ t: number; id: string; burrow?: boolean }> = ({ t, id, burrow = false }) => (
  <g>
    <Schematic t={t} id={id} />
    <rect x={-400} y={-400} width={2720} height={1900} fill="#1B7FB0" opacity={0.3} />
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={i} cx={120 + rnd(5, i) * 1700} cy={1100 - ((rnd(6, i) * 1100 + t * (1.2 + rnd(7, i) * 1.6)) % 1200)} r={6 + rnd(8, i) * 12} fill="none" stroke="#CFF1FF" strokeWidth={3} opacity={0.5} />
    ))}
    <path d="M -100 900 Q 300 850 700 890 T 1500 880 T 2100 900 V 1200 H -100 Z" fill="#CDB68C" stroke={INK} strokeWidth={6} />
    <path d="M -100 940 Q 400 910 900 950 T 2100 940" fill="none" stroke="#A8925F" strokeWidth={5} opacity={0.6} />
    {[160, 1760, 1660].map((x, k) => (
      <path key={x} d={`M ${x} 900 q ${-30 + Math.sin(t * 0.07 + k) * 18} -120 0 -220 q ${34 + Math.sin(t * 0.07 + k) * 18} -80 0 -160`} fill="none" stroke="#3DBE7A" strokeWidth={20} strokeLinecap="round" />
    ))}
    {burrow ? (
      <g>
        <ellipse cx={1000} cy={900} rx={230} ry={62} fill="#8A7550" stroke={INK} strokeWidth={6} />
        <ellipse cx={1000} cy={905} rx={170} ry={40} fill="#1A1410" />
      </g>
    ) : null}
  </g>
);

const BODY = ['#27B57E', '#1E9C6D', '#27B57E', '#1E9C6D', '#27B57E'];
/** Club centre in world space: arm pivot at the shoulder (110, 22) local. */
export const clubTip = (x: number, y: number, s: number, strike: number) => {
  const a = (lerp(165, -4, easeIn(clamp(strike))) * Math.PI) / 180;
  return { x: x + (110 + Math.cos(a) * 150) * s, y: y + (22 + Math.sin(a) * 150) * s };
};

export const MantisShrimp: React.FC<{ x: number; y: number; s?: number; t: number; strike?: number }> = ({ x, y, s = 1, t, strike = 0 }) => {
  const a = lerp(165, -4, easeIn(clamp(strike)));
  const leg = Math.sin(t * 0.5) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      {[-1, 0, 1].map((k) => <path key={k} d={`M -250 ${k * 18} Q -330 ${k * 46 + 10} -340 ${k * 60 + 20} Q -280 ${k * 30 + 40} -230 ${k * 8 + 14} Z`} fill={k ? '#FF8A3D' : '#E5483D'} stroke={INK} strokeWidth={5} />)}
      {[0, 1, 2, 3, 4].map((i) => <path key={`l${i}`} d={`M ${-170 + i * 62} 36 L ${-176 + i * 62 + leg * (i % 2 ? 1 : -1)} 84`} stroke="#FF6FA3" strokeWidth={9} fill="none" />)}
      {BODY.map((c, i) => <ellipse key={i} cx={-210 + i * 70} cy={-6 + Math.abs(i - 2) * 5} rx={50} ry={48 - i * 2} fill={c} stroke={INK} strokeWidth={5} />)}
      {[0, 1, 2, 3].map((i) => <path key={`b${i}`} d={`M ${-168 + i * 70} -38 Q ${-150 + i * 70} -6 ${-168 + i * 70} 30`} stroke="#FF8A3D" strokeWidth={7} fill="none" />)}
      <ellipse cx={110} cy={-2} rx={62} ry={48} fill="#27B57E" stroke={INK} strokeWidth={5} />
      <path d="M 70 -30 Q 120 -52 160 -20" stroke="#FFD23F" strokeWidth={8} fill="none" />
      {[[84, 82], [128, 134]].map(([bx, ex], i) => (
        <g key={i}>
          <path d={`M ${bx} -40 L ${ex - 6} -96`} stroke="#FFD23F" strokeWidth={10} fill="none" />
          <circle cx={ex} cy={-106} r={24} fill="#FFD23F" stroke={INK} strokeWidth={5} />
          <ellipse cx={ex + 4} cy={-106} rx={10} ry={24} fill="#3B2AA8" />
          <circle cx={ex + 6} cy={-108} r={7} fill="#0B0816" />
        </g>
      ))}
      <path d="M 160 -20 Q 230 -70 300 -40 M 150 -10 Q 240 -20 300 20" stroke="#FF6FA3" strokeWidth={5} fill="none" />
      <g transform={`translate(110 22) rotate(${a})`}>
        <path d="M 0 0 L 100 0" stroke={INK} strokeWidth={26} />
        <path d="M 0 0 L 100 0" stroke="#FF6FA3" strokeWidth={16} />
        <ellipse cx={138} cy={0} rx={48} ry={27} fill="#E5483D" stroke={INK} strokeWidth={6} />
        <ellipse cx={128} cy={-9} rx={26} ry={8} fill="#FFFFFF" opacity={0.5} />
        <path d="M 176 -8 Q 200 -2 190 14" stroke="#FFD23F" strokeWidth={9} fill="none" />
      </g>
    </g>
  );
};

export const PreyCrab: React.FC<{ x: number; y: number; s?: number; t: number; hit?: number; cracks?: number }> = ({ x, y, s = 1, t, hit = 0, cracks = 0 }) => {
  const sh = hit > 0 ? Math.sin(t * 3) * 10 * hit : 0;
  return (
    <g transform={`translate(${x + sh} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      {[-1, 1].map((d) => [0, 1, 2].map((i) => <path key={`${d}${i}`} d={`M ${d * 40} ${6 + i * 10} L ${d * (86 + i * 10)} ${30 + i * 16} L ${d * (100 + i * 10)} ${70}`} stroke={INK} strokeWidth={9} fill="none" />))}
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M ${d * 70} -20 L ${d * 110} -70`} stroke={INK} strokeWidth={12} />
          <ellipse cx={d * 122} cy={-84} rx={30} ry={22} fill="#E8834A" stroke={INK} strokeWidth={5} />
          <path d={`M ${d * 28} -46 L ${d * 28} -76`} stroke={INK} strokeWidth={6} />
          <circle cx={d * 28} cy={-82} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={4} /><circle cx={d * 28} cy={-82} r={5} fill={INK} />
        </g>
      ))}
      <ellipse cx={0} cy={0} rx={84} ry={56} fill="#E8834A" stroke={INK} strokeWidth={6} />
      <ellipse cx={-18} cy={-18} rx={40} ry={16} fill="#F5B07A" opacity={0.6} />
      {cracks > 0 ? <path d={`M -10 -52 L 6 -20 L -14 6 L 8 30 M 6 -20 L 36 -8`} stroke={INK} strokeWidth={5} fill="none" opacity={clamp(cracks)} /> : null}
    </g>
  );
};
