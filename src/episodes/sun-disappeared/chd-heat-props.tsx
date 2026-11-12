import React from 'react';
import { clamp, rnd, SCH, Glow, mixHex } from '../../engine';

// Chapter D local props, part 4: the places with their own heat (volcano + pin, houses with hot pipes, a reactor,
// the earth cutaway with a warm underground city).

/** A line-art volcano with a glowing crater, a lava run and smoke. Base centre (x, y). */
export const VolcanoIcon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-90} r={360} kind="warm" o={0.45 + 0.1 * Math.sin(t / 6)} />
    {[0, 1, 2, 3].map((i) => {
      const k = ((t / 70 + i / 4) % 1);
      return <circle key={i} cx={Math.sin(k * 6 + i) * 30} cy={-120 - k * 230} r={26 + k * 50} fill="#3A3F58" opacity={0.55 * (1 - k)} />;
    })}
    <path d="M -230 130 L -60 -100 L 60 -100 L 230 130 Z" fill="#1B2438" stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -60 -100 Q 0 -70 60 -100 Q 0 -128 -60 -100 Z" fill="#FF7A2A" />
    <path d="M -10 -92 Q 30 -30 10 20 Q 50 70 20 130" stroke="#FF8A3D" strokeWidth={12} fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 10px #FFB15A)' }} />
    <path d="M -230 130 L 230 130" stroke={SCH.dim} strokeWidth={5} />
  </g>
);

/** A glowing map pin whose tip is at (x, y); `drop` 0..1 drops it in with a bounce. */
export const GlowPin: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const d = clamp(t / 12);
  const yy = y - (1 - d) * (1 - d) * 520 - (t > 12 ? Math.abs(Math.sin((t - 12) * 0.5)) * 18 * Math.exp(-(t - 12) / 6) : 0);
  const ring = (t % 36) / 36;
  return (
    <g transform={`translate(${x} ${yy}) scale(${s})`}>
      {t > 12 ? <ellipse cx={0} cy={0} rx={30 + ring * 110} ry={10 + ring * 36} fill="none" stroke="#FFB15A" strokeWidth={4} opacity={1 - ring} transform={`translate(0 ${y - yy})`} /> : null}
      <path d="M 0 0 C -50 -70 -62 -108 -62 -130 A 62 62 0 1 1 62 -130 C 62 -108 50 -70 0 0 Z" fill="#FF6A3A" stroke="#FFE2A8" strokeWidth={6} style={{ filter: 'drop-shadow(0 0 18px #FF8A3D)' }} />
      <circle cx={0} cy={-130} r={22} fill="#FFF3DC" />
    </g>
  );
};

/** A small line-art house. `lit` 0..1 fills the window orange. Base centre (x, y). */
export const HouseIcon: React.FC<{ x: number; y: number; s?: number; lit: number; t: number }> = ({ x, y, s = 1, lit, t }) => {
  const c = lit > 0.05 ? SCH.live : SCH.dim;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={c} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round">
      {lit > 0.05 ? <g stroke="none"><Glow x={0} y={-40} r={150} kind="warm" o={0.22 * lit} /></g> : null}
      <path d="M -50 0 L -50 -70 L 0 -112 L 50 -70 L 50 0 Z" fill={mixHex('#101A2A', '#4A2A18', lit)} />
      <rect x={-18} y={-62} width={36} height={32} fill={mixHex('#101A2A', '#FFB15A', lit)} />
      {lit > 0.4 ? <path d={`M 30 -118 q ${-8 + Math.sin(t / 5) * 5} -18 0 -34`} strokeOpacity={0.6} /> : null}
    </g>
  );
};

/** A reactor: concrete dome on a block with a glowing core ring. Base centre (x, y). */
export const ReactorIcon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-80} r={300} kind="warm" o={0.5 + 0.1 * Math.sin(t / 5)} />
    <rect x={-120} y={-60} width={240} height={60} fill="#2A2630" stroke="#8A6A58" strokeWidth={4} />
    <path d="M -100 -60 A 100 100 0 0 1 100 -60 Z" fill="#3A3640" stroke="#BDA58E" strokeWidth={5} />
    <circle cx={0} cy={-84} r={34} fill="none" stroke="#FFB15A" strokeWidth={10} style={{ filter: 'drop-shadow(0 0 14px #FF8A3D)' }} opacity={0.7 + 0.3 * Math.sin(t / 4)} />
    <circle cx={0} cy={-84} r={14} fill="#FFE2A8" />
    <rect x={-200} y={-30} width={72} height={30} fill="#1E1B26" /><rect x={128} y={-30} width={72} height={30} fill="#1E1B26" />
  </g>
);

/** A hot spring pool in a cave floor with rising steam. Centre-top of the pool at (x, y). */
export const HotSpring: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={14} rx={170} ry={34} fill="#3A2A22" />
    <ellipse cx={0} cy={8} rx={150} ry={26} fill="#2E7FA8" />
    <ellipse cx={-20} cy={6} rx={90} ry={14} fill="#6CC8E8" opacity={0.6} />
    {[0, 1, 2, 3, 4].map((i) => {
      const k = ((t / 60 + i / 5) % 1);
      return <ellipse key={i} cx={-90 + i * 45 + Math.sin(k * 7 + i) * 14} cy={-k * 170} rx={22 + k * 30} ry={14 + k * 18} fill="#FFFFFF" opacity={0.35 * (1 - k)} />;
    })}
  </g>
);

/** The cutaway planet: frozen surface strip on top, earth below, glowing magma line at the bottom. Fills x -300..2220. */
export const EarthCut: React.FC<{ id: string; t: number; surface: number }> = ({ id, t, surface }) => (
  <g>
    <defs>
      <linearGradient id={`${id}e`} x1="0" y1={surface} x2="0" y2="1500" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2C2430" /><stop offset="0.6" stopColor="#3A2A28" /><stop offset="1" stopColor="#7A3A1C" />
      </linearGradient>
    </defs>
    <rect x={-300} y={surface - 700} width={2520} height={700} fill="#0C1428" />
    {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={-200 + rnd(8, i) * 2320} cy={surface - 650 + rnd(9, i) * 560} r={1 + rnd(10, i) * 1.6} fill="#EAF0FF" opacity={0.5 + 0.4 * Math.sin(t / 9 + i)} />)}
    <rect x={-300} y={surface} width={2520} height={1200} fill={`url(#${id}e)`} />
    <path d={`M -300 ${surface} Q 200 ${surface - 26} 700 ${surface - 6} T 1700 ${surface - 10} T 2220 ${surface}`} fill="#E8F4FF" stroke="#FFFFFF" strokeWidth={6} />
    <path d={`M -300 ${surface + 14} L 2220 ${surface + 14}`} stroke="#BFD8EE" strokeWidth={10} opacity={0.6} />
  </g>
);
