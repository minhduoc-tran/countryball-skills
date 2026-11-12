import React from 'react';
import { clamp, backOut, easeOut, FONT, UI, Glow } from '../../engine';
import { DanangBeach, BEACH } from './kit-danang-beach';

// Chapter E props for the warm ending (pure functions of t).
//   <GoldenBeach id t />      the real Đà Nẵng sea is back (drain 0, nobody on the sand), golden light, rolling foam, gulls.
//   <ShoreFoam t />           foam sliding up the sand at the shore (y 800..850); draw it after the beach.
//   <WaterOver x y w t />     translucent sea in front of someone standing in it: a wavy top at y, down 90.
//   <Gulls t />               three gulls gliding across the sky.
//   <Badge x y t at> icon </Badge>   cream circle badge popping at frame `at` (icons below are drawn around 0,0, ~100 wide).
//   Icons: RainIcon, O2Icon, CoolIcon, FishIcon, ShipIcon (small ship), WaveIcon, TrenchIcon, TitanicIcon, IslandIcon.

export const ShoreFoam: React.FC<{ t: number }> = ({ t }) => {
  const y = 826 + 20 * Math.sin(t * 0.07);
  let d = `M -60 ${y}`;
  for (let x = -60; x <= 1980; x += 60) d += ` L ${x} ${y + Math.sin(x * 0.012 + t * 0.09) * 7}`;
  return (
    <g>
      <path d={`${d} L 1980 ${BEACH.SHORE + 2} L -60 ${BEACH.SHORE + 2} Z`} fill="#8FD6E6" opacity={0.4} />
      <path d={d} stroke="#FFFFFF" strokeWidth={9} fill="none" opacity={0.85} />
      <path d={d} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.5} transform="translate(0 -26)" />
    </g>
  );
};

export const Gulls: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const x = ((t * (1.6 + i * 0.4) + i * 700) % 2400) - 240;
      const y = 200 + i * 55 + Math.sin(t / 20 + i) * 14;
      const f = Math.sin(t / 4 + i * 2) * 14;
      return <path key={i} d={`M ${x - 34} ${y - f} Q ${x - 14} ${y - 18} ${x} ${y} Q ${x + 14} ${y - 18} ${x + 34} ${y - f}`} stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

export const GoldenBeach: React.FC<{ id: string; t: number; sun?: number }> = ({ id, t, sun = 0.35 }) => (
  <g>
    <DanangBeach id={id} t={t} drain={0} people={[]} />
    <Glow x={1480} y={140} r={900} o={sun} />
    <rect x={-100} y={-100} width={2120} height={1300} fill="#FFB347" opacity={0.17} style={{ mixBlendMode: 'overlay' }} />
    <Gulls t={t} />
    <ShoreFoam t={t} />
  </g>
);

export const WaterOver: React.FC<{ x: number; y: number; w: number; t: number }> = ({ x, y, w, t }) => (
  <g>
    <ellipse cx={x} cy={y + 14} rx={w / 2} ry={34} fill="#4BB0D8" opacity={0.7} />
    <ellipse cx={x} cy={y + 14} rx={w / 2} ry={34} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.85} />
    {[0, 1].map((i) => {
      const p = ((t / 40 + i * 0.5) % 1);
      return <ellipse key={i} cx={x} cy={y + 14} rx={w / 2 * (1 + p * 0.6)} ry={34 * (1 + p * 0.6)} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.6 * (1 - p)} />;
    })}
  </g>
);

export const Badge: React.FC<{ x: number; y: number; t: number; at: number; children: React.ReactNode; r?: number }> = ({ x, y, t, at, children, r = 96 }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 8));
  return (
    <g transform={`translate(${x} ${y + Math.sin((t - at) / 9) * 5}) scale(${k})`}>
      <circle r={r} fill="#FFF6E4" stroke="#14121A" strokeWidth={7} style={{ filter: 'drop-shadow(0 8px 0 rgba(0,0,0,0.3))' }} />
      {children}
    </g>
  );
};

const INK = '#14121A';
export const RainIcon: React.FC = () => (
  <g>
    <path d="M -50 -4 Q -64 -4 -60 -22 Q -54 -42 -30 -36 Q -20 -62 10 -52 Q 30 -62 46 -38 Q 66 -34 58 -4 Z" fill="#9DB4C6" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[-30, 0, 30].map((dx) => <path key={dx} d={`M ${dx} 14 l -8 26`} stroke="#2E86C1" strokeWidth={8} strokeLinecap="round" />)}
  </g>
);
export const O2Icon: React.FC = () => <text y={22} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={72} fill="#1E7A48">O₂</text>;
export const CoolIcon: React.FC = () => (
  <g>
    <rect x={-14} y={-60} width={28} height={84} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
    <circle cy={34} r={24} fill="#2E86C1" stroke={INK} strokeWidth={5} />
    <rect x={-6} y={-8} width={12} height={40} fill="#2E86C1" />
    <path d="M 30 -30 h 22 M 30 -10 h 16" stroke={INK} strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const FishIcon: React.FC = () => (
  <g transform="scale(0.8)">
    <path d="M -60 0 L -92 -30 L -92 30 Z" fill="#E5742A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -64 0 Q -20 -50 50 -20 Q 80 -4 76 4 Q 40 38 -20 32 Q -54 22 -64 0 Z" fill="#FF9A4A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={40} cy={-6} r={6} fill={INK} />
  </g>
);
export const ShipIcon: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-30} y={-48} width={60} height={26} fill="#E8B13A" stroke={INK} strokeWidth={4} />
    <rect x={-60} y={-24} width={120} height={20} fill="#D9482F" stroke={INK} strokeWidth={4} />
    <path d="M -80 -4 L 80 -4 L 58 30 L -58 30 Z" fill="#2B3A55" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);
export const WaveIcon: React.FC = () => (
  <g fill="none" stroke="#2E86C1" strokeWidth={10} strokeLinecap="round">
    <path d="M -56 -16 q 14 -22 28 0 t 28 0 t 28 0 t 28 0" /><path d="M -56 18 q 14 -22 28 0 t 28 0 t 28 0 t 28 0" />
  </g>
);

export const TrenchIcon: React.FC = () => (
  <g>
    <path d="M -80 -50 L -80 60 L 80 60 L 80 -50 L 36 -50 L 10 50 L -10 50 L -36 -50 Z" fill="#2E86C1" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -36 -50 L -10 50 L 10 50 L 36 -50 Z" fill="#14264A" />
    <path d="M -80 -50 L -36 -50 M 36 -50 L 80 -50" stroke="#E9D3A3" strokeWidth={10} />
    <path d="M 0 -30 v 60 m -12 -14 l 12 14 l 12 -14" stroke="#FFE27A" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
export const TitanicIcon: React.FC = () => (
  <g>
    <rect x={-80} y={-60} width={160} height={120} rx={10} fill="#1B4F72" />
    <path d="M -76 20 L 80 20 L 62 44 L -60 44 Z" fill="#14121A" />
    <rect x={-62} y={0} width={124} height={20} fill="#F4F1EA" stroke={INK} strokeWidth={3} />
    {[-36, -12, 12, 36].map((fx) => <g key={fx}><rect x={fx - 7} y={-30} width={14} height={30} fill="#E8B13A" stroke={INK} strokeWidth={3} /><rect x={fx - 7} y={-30} width={14} height={8} fill={INK} /></g>)}
  </g>
);
export const IslandIcon: React.FC = () => (
  <g>
    <rect x={-80} y={-60} width={160} height={120} rx={10} fill="#4BB0D8" />
    <ellipse cx={0} cy={26} rx={64} ry={16} fill="#F0DDB0" stroke={INK} strokeWidth={4} />
    <path d="M 0 22 Q 6 -10 -2 -34" stroke="#6B4A2A" strokeWidth={8} fill="none" strokeLinecap="round" />
    {[-150, -100, -40, 10].map((a, i) => <path key={i} d={`M -2 -34 q ${Math.cos((a * Math.PI) / 180) * 28} ${Math.sin((a * Math.PI) / 180) * 14 - 10} ${Math.cos((a * Math.PI) / 180) * 46} ${Math.sin((a * Math.PI) / 180) * 22 + 8}`} stroke="#2F7A44" strokeWidth={9} fill="none" strokeLinecap="round" />)}
  </g>
);

/** A choice card for the end card: icon on top, two-line-safe label below. Pops at frame `at`. */
export const ChoiceCard: React.FC<{ x: number; y: number; t: number; at: number; label: string; children: React.ReactNode }> = ({ x, y, t, at, label, children }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 9));
  const glow = easeOut(clamp(1 - (t - at) / 20));
  return (
    <g transform={`translate(${x} ${y + Math.sin((t - at) / 12) * 4}) scale(${k})`}>
      <rect x={-166} y={-124} width={332} height={256} rx={30} fill="#FFF6E4" stroke="#14121A" strokeWidth={7} style={{ filter: `drop-shadow(0 10px 0 rgba(0,0,0,0.3)) drop-shadow(0 0 ${26 * glow}px #FFE27A)` }} />
      <g transform="translate(0 -36)">{children}</g>
      <text y={100} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={label.length > 9 ? 38 : 46} fill={UI.pill} letterSpacing={1}>{label}</text>
    </g>
  );
};
