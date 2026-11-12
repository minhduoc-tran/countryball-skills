import React from 'react';
import { DuskSky, Sun, Skyline, Haze, Glow, LightVeil, FONT, clamp, backOut } from '../../engine';
import { Motes } from './chd-local-props';

// A balcony at dusk, drawn locally for chapter D (day 20): the low sun over a quiet city, a railing, boards, the
// house wall with its dark door on the left, a laundry line, a folded chair and a watering can; and Bông, the potted
// plant that gets a name tag. Floor line y 830 (feet at about 930), the sun at (1250, 640).

export const BALCONY_FLOOR = 930;

export const Balcony: React.FC<{ t: number; id: string; veil?: number }> = ({ t, id, veil = 0.34 }) => {
  const bars = Array.from({ length: 34 }).map((_, i) => -380 + i * 80);
  return (
    <g>
      <DuskSky id={`${id}sky`} horizonY={640} />
      <Sun x={1250} y={650} r={110} t={t} />
      <Skyline y={700} seed={4} color="#3A2650" h={210} />
      <Skyline y={744} seed={9} color="#2A1B45" h={130} />
      <Haze y={640} h={220} o={0.35} />
      {/* the house wall on the left, with the dark balcony door and a dead lamp over it */}
      <rect x={-420} y={-400} width={820} height={1700} fill="#34314E" />
      <rect x={380} y={-400} width={22} height={1700} fill="#292640" />
      <rect x={60} y={300} width={250} height={540} fill="#1B1830" stroke="#4A4668" strokeWidth={10} />
      <rect x={76} y={316} width={218} height={508} fill="#232044" />
      <path d="M 90 330 L 180 330 L 90 560 Z" fill="#6A7EC0" opacity={0.14} />
      <rect x={270} y={560} width={10} height={64} rx={5} fill="#C9A46A" />
      <rect x={168} y={206} width={54} height={40} rx={8} fill="#2A2640" />
      {/* a laundry line, two socks and a shirt, swaying a little */}
      <path d="M 402 250 Q 900 330 1560 240" stroke="#15101C" strokeWidth={4} fill="none" />
      {[
        [560, '#7A5A6A'], [700, '#5A7A6A'], [1180, '#8A6A4A'],
      ].map(([x, c], i) => (
        <path key={i} transform={`rotate(${Math.sin(t / 34 + i) * 3} ${x} 300)`} d={`M ${Number(x) - 22} 296 L ${Number(x) + 22} 296 L ${Number(x) + 18} ${350 + i * 18} L ${Number(x) - 18} ${350 + i * 18} Z`} fill={String(c)} />
      ))}
      <rect x={1550} y={240} width={14} height={600} fill="#15101C" />
      {/* the floor boards */}
      <rect x={-420} y={830} width={2760} height={400} fill="#463748" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M -420 ${838 + i * i * 4 + i * 14} L 2340 ${838 + i * i * 4 + i * 14}`} stroke="#2E2230" strokeWidth={2.5 + i * 0.3} />
      ))}
      <rect x={-420} y={826} width={2760} height={6} fill="#6A5468" />
      {/* the railing in front of the city */}
      {bars.map((x) => (
        <rect key={x} x={x} y={716} width={9} height={114} fill="#1E1626" />
      ))}
      <rect x={-420} y={700} width={2760} height={18} rx={6} fill="#241A2E" />
      <rect x={-420} y={700} width={2760} height={4} fill="#FFB46A" opacity={0.55} />
      <rect x={-420} y={816} width={2760} height={14} fill="#241A2E" />
      {/* a folded chair and a watering can in the corner */}
      <path d="M 460 840 L 520 560 L 548 566 L 492 846 Z M 590 846 L 566 566 L 540 560 L 560 846 Z" fill="#2C2236" />
      <rect x={510} y={600} width={60} height={12} fill="#3A2E44" />
      <ellipse cx={690} cy={930} rx={52} ry={10} fill="#000" opacity={0.4} />
      <path d="M 650 930 L 656 870 L 726 870 L 732 930 Z" fill="#3E7A7A" />
      <path d="M 726 884 L 790 846 L 800 854 L 732 906 Z" fill="#3E7A7A" />
      <path d="M 656 880 Q 630 856 662 840 Q 700 830 722 870" stroke="#2E5E5E" strokeWidth={9} fill="none" />
      <path d="M 656 872 L 656 930" stroke="#FFC98A" strokeWidth={2.5} opacity={0.5} />
      <ellipse cx={560} cy={934} rx={44} ry={9} fill="#000" opacity={0.35} />
      <LightVeil id={`${id}veil`} lights={[[1250, 700, 760], [960, 900, 520]]} o={veil} />
      <Glow x={1250} y={650} r={420} o={0.4} />
      <Motes t={t} seed={5} x0={700} y0={420} w={800} h={400} n={16} />
    </g>
  );
};

/**
 * Bông: a plant in a terracotta pot on the floor at (x, BALCONY_FLOOR), a stake with a kraft name tag. `tag` (0..1)
 * pops the tag on, `write` (0..1) writes BÔNG across it, `face` (0..1) draws the little face on the pot.
 */
export const PlantBong: React.FC<{ x: number; t: number; id: string; s?: number; tag?: number; write?: number; face?: number; y?: number; tagScale?: number }> = ({
  x, t, id, s = 1, tag = 0, write = 0, face = 0, y = BALCONY_FLOOR, tagScale = 1.5,
}) => {
  const leaves: [number, number, string][] = [[-120, -250, '#3F5E44'], [-60, -330, '#4E7350'], [10, -370, '#3F5E44'], [80, -320, '#4E7350'], [130, -230, '#3F5E44'], [-150, -160, '#4E7350']];
  const tg = clamp(tag);
  const k = tg <= 0 ? 0 : backOut(tg);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={14} cy={4} rx={110} ry={16} fill="#000" opacity={0.45} />
      {leaves.map(([dx, dy, c], i) => {
        const sw = Math.sin(t / 26 + i * 1.3) * 3.5;
        return (
          <g key={i} transform={`rotate(${sw} 0 -150)`}>
            <path d={`M 0 -150 Q ${dx * 0.2} ${dy * 0.75} ${dx} ${dy} Q ${dx * 0.8 + 18} ${dy * 0.5} 0 -150 Z`} fill={c} />
            <path d={`M 0 -150 Q ${dx * 0.3} ${dy * 0.6} ${dx} ${dy}`} stroke="#8FB88A" strokeWidth={2.5} fill="none" opacity={0.45} />
          </g>
        );
      })}
      <path d="M -84 -150 L 84 -150 L 66 0 L -66 0 Z" fill="#9A5642" />
      <path d="M 24 -150 L 84 -150 L 66 0 L 40 0 Z" fill="#7A4033" />
      <rect x={-92} y={-172} width={184} height={30} rx={8} fill="#B0654E" />
      <rect x={-92} y={-172} width={184} height={6} rx={3} fill="#FFC98A" opacity={0.5} />
      {face > 0 ? (
        <g opacity={clamp(face)} stroke="#4A2418" strokeWidth={5} strokeLinecap="round" fill="none">
          <circle cx={-20} cy={-96} r={3.5} fill="#4A2418" />
          <circle cx={20} cy={-96} r={3.5} fill="#4A2418" />
          <path d="M -14 -78 Q 0 -64 14 -78" />
        </g>
      ) : null}
      {/* the stake and the tag */}
      <path d="M 70 -160 L 70 -330" stroke="#8A6A44" strokeWidth={8} strokeLinecap="round" />
      {k > 0 ? (
        <g transform={`translate(70 -330) scale(${k * tagScale}) rotate(${-5 + Math.sin(t / 22) * 1.5})`}>
          <defs>
            <clipPath id={`${id}wr`}>
              <rect x={-90} y={-6} width={180 * clamp(write)} height={80} />
            </clipPath>
          </defs>
          <path d="M 0 0 L 0 14" stroke="#4A3A2C" strokeWidth={3} />
          <path d="M -88 14 L 70 6 L 78 44 L 84 88 L -76 94 L -84 56 Z" fill="#D2B07A" stroke="#7A5A34" strokeWidth={4} strokeLinejoin="round" />
          <path d="M 70 6 L 78 44 L 84 88" stroke="#FFD9A0" strokeWidth={3} fill="none" opacity={0.6} />
          <circle cx={0} cy={22} r={5} fill="#3A2C20" />
          <g clipPath={`url(#${id}wr)`}>
            <text x={-4} y={74} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={50} fill="#3A2418" transform="rotate(-2)">BÔNG</text>
          </g>
        </g>
      ) : null}
    </g>
  );
};
