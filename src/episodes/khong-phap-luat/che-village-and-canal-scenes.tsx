import React from 'react';
import { FONT, clamp, easeInOut, easeOut, Glow } from '../../engine';
import { Tiny } from './che-tiny-people';

// Chapter E: two communities that share by rules. FishingVillage: boats take turns at sea, a board of turns on the beach
// (E5). IrrigationCanal: one canal, three wooden gates opened in turns, farmers in straw hats (E6). Both are 1920x1080
// world scenes, pure functions of the shot clock `t`.

const LINE = '#2A1E24';
const COLORS = ['#D9564A', '#E9B93A', '#3D8BA8'];

const Boat: React.FC<{ x: number; y: number; s: number; color: string; t: number; fish?: number; phase?: number }> = ({ x, y, s, color, t, fish = 0, phase = 0 }) => {
  const rock = Math.sin(t / 8 + phase) * 3;
  return (
    <g transform={`translate(${x} ${y + Math.sin(t / 9 + phase) * 3 * s}) rotate(${rock}) scale(${s})`} strokeLinejoin="round">
      <ellipse cx={0} cy={18} rx={150} ry={12} fill="#000" opacity={0.2} />
      <path d="M -150 -30 Q -140 24 -80 28 L 90 28 Q 150 20 170 -34 Z" fill={color} stroke={LINE} strokeWidth={6} />
      <path d="M -146 -14 H 160" stroke="#FFF3D6" strokeWidth={8} />
      <rect x={-20} y={-96} width={78} height={62} rx={6} fill="#F2E4C0" stroke={LINE} strokeWidth={5} />
      <rect x={-6} y={-82} width={26} height={24} fill="#7FC8E0" stroke={LINE} strokeWidth={4} />
      <path d="M -90 -34 L -90 -150" stroke={LINE} strokeWidth={7} />
      <path d="M -90 -150 L -30 -132 L -90 -112 Z" fill="#FFF3D6" stroke={LINE} strokeWidth={4} />
      {fish > 0 ? Array.from({ length: 4 }).map((_, i) => (
        <g key={i} transform={`translate(${80 + i * 18} ${-44 - (i % 2) * 7})`} opacity={clamp(fish * 5 - i)}>
          <ellipse rx={13} ry={6} fill="#C9D6E4" stroke={LINE} strokeWidth={2.4} /><path d="M 11 0 L 20 -6 L 20 6 Z" fill="#C9D6E4" stroke={LINE} strokeWidth={2} />
        </g>
      )) : null}
    </g>
  );
};

/** The wooden board of turns on the beach: a row per boat, an arrow on the boat whose turn it is. */
const TurnBoard: React.FC<{ x: number; y: number; turn: number }> = ({ x, y, turn }) => {
  const arrow = easeInOut(clamp(turn));
  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
      <path d="M -150 0 V 230 M 150 0 V 230" stroke="#6B4128" strokeWidth={22} />
      <rect x={-210} y={-190} width={420} height={270} rx={18} fill="#B07A4E" stroke={LINE} strokeWidth={7} />
      <rect x={-190} y={-170} width={380} height={230} rx={10} fill="#8A5A38" opacity={0.5} />
      <text y={-124} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={44} letterSpacing={6} fill="#FFF3D6">LƯỢT</text>
      {COLORS.map((c, i) => (
        <g key={i} transform={`translate(0 ${-72 + i * 54})`}>
          <rect x={-160} y={-22} width={320} height={44} rx={10} fill="#FFF3D6" opacity={0.2} />
          <path d="M -130 8 Q -120 20 -90 20 H -50 Q -30 14 -26 -8 H -130 Z" fill={c} stroke={LINE} strokeWidth={3.5} />
          <circle cx={90} cy={0} r={14} fill="none" stroke="#FFF3D6" strokeWidth={4} opacity={i === 0 ? 0 : 0.5} />
          {i === 0 ? <path d="M 76 2 L 88 14 L 108 -10" stroke="#9CF0B0" strokeWidth={8} fill="none" strokeLinecap="round" opacity={clamp(turn * 2 - 0.2)} /> : null}
        </g>
      ))}
      <path d="M -176 -26 L -158 -18 L -176 -10 Z" fill="#FFE27A" stroke={LINE} strokeWidth={3} transform={`translate(0 ${arrow * 54})`} />
    </g>
  );
};

export const FishingVillage: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const leave = easeInOut(clamp(t / 40));
  const shift1 = easeInOut(clamp((t - 8) / 18));
  const shift2 = easeInOut(clamp((t - 14) / 18));
  const back = easeOut(clamp(t / 46));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FBD7A4" /><stop offset="1" stopColor="#F6A67C" /></linearGradient>
        <linearGradient id={`${id}sea`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5FBFC4" /><stop offset="1" stopColor="#2C7A93" /></linearGradient>
        <linearGradient id={`${id}sand`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EAD3A6" /><stop offset="1" stopColor="#C9A874" /></linearGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={760} fill={`url(#${id}sky)`} />
      <circle cx={1330} cy={500} r={120} fill="#FFF2BE" /><Glow x={1330} y={500} r={620} o={0.7} />
      <rect x={-200} y={520} width={2320} height={360} fill={`url(#${id}sea)`} />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M ${-100 + ((i * 197) % 400) + ((t * (1 + (i % 3) * 0.4)) % 400)} ${548 + i * 26} q 40 -10 80 0 t 80 0`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.28} />
      ))}
      <path d="M 1450 840 L 1450 770 L 1520 730 L 1590 770 L 1590 840 Z M 1640 840 L 1640 780 L 1700 745 L 1760 780 L 1760 840 Z" fill="#8A4A38" stroke={LINE} strokeWidth={5} />
      <rect x={-200} y={840} width={2320} height={700} fill={`url(#${id}sand)`} />
      <path d="M -200 846 Q 200 826 600 848 T 1400 846 T 2200 846" stroke="#FFFFFF" strokeWidth={8} fill="none" opacity={0.55} />
      {/* out at sea: the boat that left, shrinking toward the horizon; the one coming back with fish */}
      <Boat x={900 - 260 * leave} y={790 - 150 * leave} s={1 - 0.5 * leave} color={COLORS[0]} t={t} />
      <Boat x={1800 - 340 * back} y={650 + 162 * back} s={0.45 + 0.55 * back} color="#7FB069" t={t} fish={back} phase={2} />
      <Boat x={1180 - 280 * shift1} y={800} s={1} color={COLORS[1]} t={t} phase={1} />
      <Boat x={1460 - 280 * shift2} y={812} s={1} color={COLORS[2]} t={t} phase={3} />
      <TurnBoard x={330} y={700} turn={clamp((t - 10) / 14)} />
      <Tiny x={560} y={900} s={2.2} hat shirt="#6A8EAE" armR={t > 10 ? 130 : 20} />
      <Tiny x={160} y={910} s={2.0} hat shirt="#C86A5A" old />
    </g>
  );
};

/** One wooden sluice gate on a branch channel: two posts and a plank that slides up when `open` (0..1). */
const Gate: React.FC<{ x: number; y: number; open: number }> = ({ x, y, open }) => (
  <g transform={`translate(${x} ${y}) scale(1.7)`} strokeLinejoin="round">
    <rect x={-34} y={-18} width={12} height={58} rx={3} fill="#8A5A38" stroke={LINE} strokeWidth={4} />
    <rect x={22} y={-18} width={12} height={58} rx={3} fill="#8A5A38" stroke={LINE} strokeWidth={4} />
    <rect x={-24} y={-8 - open * 46} width={48} height={42} rx={3} fill="#C99358" stroke={LINE} strokeWidth={4} />
    <path d={`M -20 ${6 - open * 46} H 20 M -20 ${20 - open * 46} H 20`} stroke="#8A5A38" strokeWidth={3} />
  </g>
);

export const IrrigationCanal: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const xs = [480, 960, 1440];
  const cur = Math.floor(t / 16) % 3;
  const into = (t % 16) / 16;
  const openOf = (i: number) => (i === cur ? easeOut(clamp(into * 4)) : i === (cur + 2) % 3 ? 1 - easeOut(clamp(into * 4)) : 0);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFE3F2" /><stop offset="1" stopColor="#FBEBC4" /></linearGradient>
        <linearGradient id={`${id}fld`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9CCB6A" /><stop offset="1" stopColor="#4F8F3E" /></linearGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={560} fill={`url(#${id}sky)`} />
      <path d="M -200 340 Q 300 250 700 330 T 1500 320 T 2200 330 V 380 H -200 Z" fill="#7BAE6A" opacity={0.8} />
      {[160, 520, 880, 1380, 1700].map((x, i) => <g key={i} transform={`translate(${x} 340)`}><rect x={-6} y={-30} width={12} height={34} fill="#7A5230" /><circle cy={-52} r={34} fill="#5E9A4E" stroke={LINE} strokeWidth={4} /></g>)}
      <rect x={-200} y={350} width={2320} height={800} fill={`url(#${id}fld)`} />
      {/* the three paddies above the canal, the three below */}
      {xs.map((x, i) => (
        <g key={i}>
          {[0, 1].map((r) => (
            <rect key={r} x={x - 190} y={r ? 750 : 380} width={380} height={r ? 230 : 130} rx={10} fill="#8CC46A" stroke="#5E8E44" strokeWidth={5} opacity={0.9} />
          ))}
          {Array.from({ length: 7 }).map((_, k) => <path key={k} d={`M ${x - 170 + k * 56} 398 v 92 M ${x - 170 + k * 56} 770 v 190`} stroke="#5E9A3A" strokeWidth={5} strokeDasharray="10 8" opacity={0.7} />)}
          <rect x={x - 190} y={380} width={380} height={130} rx={10} fill="#7FD0F0" opacity={0.45 * openOf(i)} />
          <rect x={x - 18} y={510} width={36} height={52} fill="#5AB8D6" opacity={0.3 + 0.7 * openOf(i)} />
        </g>
      ))}
      {/* the canal */}
      <rect x={-200} y={556} width={2320} height={130} fill="#6B8F4E" />
      <rect x={-200} y={566} width={2320} height={112} fill="#4AA9CC" />
      <rect x={-200} y={566} width={2320} height={24} fill="#2E86AA" opacity={0.5} />
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${-100 + ((i * 160 + t * 6) % 2300)} ${590 + (i % 3) * 30} h 60`} stroke="#E8F8FF" strokeWidth={5} strokeLinecap="round" opacity={0.6} />)}
      {xs.map((x, i) => <Gate key={i} x={x} y={560} open={openOf(i)} />)}
      {xs.map((x, i) => <Tiny key={i} x={x + 130} y={740} s={3.0} hat shirt={['#C86A5A', '#6A8EAE', '#8E7BB0'][i]} armL={i === cur ? 150 : 14} armR={i === cur ? 150 : 14} bob={i === cur ? Math.abs(Math.sin(t / 3)) * 4 : 0} />)}
    </g>
  );
};
