import React from 'react';
import { FONT, clamp, rnd, SCH } from '../../engine';

// Chapter E props, part 2: the emergency-alert phone, the dark storm ground with puddles, the school block at night,
// the radar screen, and the schematic icons (spiral typhoon, small fist). Pure functions of the shot clock.

const INK = '#121019';

/** A phone with a flashing red emergency alert, centred at (0,0), `w` wide. */
export const AlertPhone: React.FC<{ x: number; y: number; w?: number; rot?: number; t: number }> = ({ x, y, w = 560, rot = 0, t }) => {
  const h = w * 2.05;
  const flash = t % 16 < 9 ? 1 : 0.55;
  const buzz = Math.sin(t * 9.1) * 6 * (w / 560);
  return (
    <g transform={`translate(${x + buzz} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 20} y={-h / 2 + 24} width={w} height={h} rx={w * 0.14} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.14} fill="#16151C" stroke="#3A3846" strokeWidth={8} />
      <rect x={-w / 2 + 22} y={-h / 2 + 22} width={w - 44} height={h - 44} rx={w * 0.1} fill="#B3101E" opacity={flash} />
      <rect x={-w / 2 + 22} y={-h / 2 + 22} width={w - 44} height={h - 44} rx={w * 0.1} fill="#FF4A3A" opacity={0.25 * flash} />
      {/* warning triangle */}
      <g transform={`translate(0 ${-h * 0.2})`}>
        <path d={`M 0 ${-w * 0.2} L ${w * 0.22} ${w * 0.16} L ${-w * 0.22} ${w * 0.16} Z`} fill="#FFD23F" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <rect x={-w * 0.018} y={-w * 0.1} width={w * 0.036} height={w * 0.15} rx={w * 0.018} fill={INK} />
        <circle cx={0} cy={w * 0.1} r={w * 0.024} fill={INK} />
      </g>
      <text x={0} y={h * 0.08} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.088} fill="#FFF4E0" letterSpacing={2}>CẢNH BÁO</text>
      <text x={0} y={h * 0.08 + w * 0.12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.088} fill="#FFF4E0" letterSpacing={2}>BÃO KHẨN CẤP</text>
      <rect x={-w * 0.34} y={h * 0.26} width={w * 0.68} height={w * 0.1} rx={w * 0.05} fill="#FFF4E0" opacity={0.9} />
      <rect x={-w * 0.3} y={h * 0.26 + w * 0.13} width={w * 0.6} height={w * 0.04} rx={w * 0.02} fill="#FFF4E0" opacity={0.5} />
    </g>
  );
};

/** The dark ground of the storm night: wet road slab with puddles that ripple and reflect lightning. `y` = ground line. */
export const StormGround: React.FC<{ t: number; y: number; id: string }> = ({ t, y, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}gr`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1B2236" />
        <stop offset="100%" stopColor="#090B14" />
      </linearGradient>
    </defs>
    {/* far house silhouettes */}
    {Array.from({ length: 12 }).map((_, i) => {
      const w = 130 + rnd(4, i) * 110;
      const hh = 90 + rnd(5, i) * 120;
      return <rect key={i} x={-100 + i * 180} y={y - hh} width={w} height={hh + 4} fill="#0D111E" stroke="#171C2E" strokeWidth={3} />;
    })}
    <rect x={-300} y={y} width={2520} height={600} fill={`url(#${id}gr)`} stroke="#222A44" strokeWidth={4} />
    {Array.from({ length: 7 }).map((_, i) => {
      const px = 120 + i * 270 + rnd(9, i) * 60;
      const py = y + 40 + (i % 3) * 38;
      return (
        <g key={i}>
          <ellipse cx={px} cy={py} rx={120 + rnd(2, i) * 60} ry={11} fill="#35456E" opacity={0.55} />
          {[0, 1].map((k) => <ellipse key={k} cx={px + (rnd(6, i + k) - 0.5) * 80} cy={py} rx={((t * 0.6 + k * 13 + i * 5) % 26) * 2.2} ry={((t * 0.6 + k * 13 + i * 5) % 26) * 0.4} fill="none" stroke="#C9DAFF" strokeWidth={2} opacity={0.5 - ((t * 0.6 + k * 13 + i * 5) % 26) / 60} />)}
        </g>
      );
    })}
  </g>
);

/** A two-storey school block at night: lit classroom windows, a sign, a flagpole. One window (win) can be drawn bigger to host the sister. */
export const SchoolBuilding: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const flick = t % 97 < 2 ? 0.4 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-760} y={-560} width={1520} height={560} fill="#2A2F45" stroke={INK} strokeWidth={8} />
      <rect x={-780} y={-600} width={1560} height={50} fill="#1B1F32" stroke={INK} strokeWidth={8} />
      <rect x={-760} y={-340} width={1520} height={24} fill="#1B1F32" />
      {[0, 1].map((row) =>
        Array.from({ length: 6 }).map((_, i) => {
          const lit = row === 1 ? (i === 3 ? 1 : 0) : i === 1 || i === 4 ? 0.7 : 0;
          return (
            <g key={`${row}-${i}`}>
              <rect x={-690 + i * 240} y={-500 + row * 190} width={150} height={130} fill={lit ? '#FFD680' : '#12182A'} opacity={lit ? lit * flick : 1} stroke={INK} strokeWidth={6} />
              <path d={`M ${-615 + i * 240} ${-500 + row * 190} V ${-370 + row * 190} M ${-690 + i * 240} ${-435 + row * 190} H ${-540 + i * 240}`} stroke={INK} strokeWidth={4} />
            </g>
          );
        })
      )}
      <rect x={-130} y={-150} width={260} height={150} fill="#12182A" stroke={INK} strokeWidth={7} />
      <rect x={-200} y={-594} width={400} height={42} rx={8} fill="#14472E" stroke="#E9E4D0" strokeWidth={4} />
      <text x={0} y={-562} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#E9E4D0" letterSpacing={8}>TRƯỜNG</text>
      <path d="M 700 0 V -820" stroke="#6B7080" strokeWidth={10} />
      <path d={`M 700 -820 Q ${760 + Math.sin(t / 5) * 18} ${-800} ${830} ${-780 + Math.sin(t / 4) * 10} L 700 -740 Z`} fill="#B3202E" />
    </g>
  );
};

/** A radar screen (round, concentric rings, a sweeping line) showing a typhoon spiral and a red track toward the coast. */
export const RadarScreen: React.FC<{ cx: number; cy: number; r: number; t: number; id: string }> = ({ cx, cy, r, t, id }) => {
  const ang = (t * 6) % 360;
  const arm = (k: number) => {
    const pts = Array.from({ length: 26 }).map((_, i) => {
      const f = i / 25;
      const rr = (0.06 + f * 0.34) * r;
      const th = ((k * 120 + t * 4) * Math.PI) / 180 + 5.2 * f;
      return `${cx - r * 0.28 + Math.cos(th) * rr},${cy + Math.sin(th) * rr * 0.9}`;
    });
    return <polyline key={k} points={pts.join(' ')} fill="none" stroke="#FF5A4A" strokeWidth={r * 0.06} strokeLinecap="round" opacity={0.85} />;
  };
  return (
    <g>
      <clipPath id={`${id}rc`}><circle cx={cx} cy={cy} r={r} /></clipPath>
      <circle cx={cx} cy={cy} r={r + 22} fill="#10141E" stroke="#3A4258" strokeWidth={10} />
      <circle cx={cx} cy={cy} r={r} fill="#07261E" />
      <g clipPath={`url(#${id}rc)`}>
        {/* coastline */}
        <path d={`M ${cx + r * 0.2} ${cy - r} Q ${cx + r * 0.1} ${cy - r * 0.4} ${cx + r * 0.35} ${cy} Q ${cx + r * 0.5} ${cy + r * 0.4} ${cx + r * 0.3} ${cy + r} L ${cx + r} ${cy + r} L ${cx + r} ${cy - r} Z`} fill="#0F4A36" stroke="#37D69A" strokeWidth={4} />
        {[0.25, 0.5, 0.75, 1].map((k) => <circle key={k} cx={cx} cy={cy} r={r * k} fill="none" stroke="#37D69A" strokeWidth={2} opacity={0.4} />)}
        <path d={`M ${cx - r} ${cy} H ${cx + r} M ${cx} ${cy - r} V ${cy + r}`} stroke="#37D69A" strokeWidth={2} opacity={0.35} />
        {[0, 1, 2].map(arm)}
        <circle cx={cx - r * 0.28} cy={cy} r={r * 0.05} fill="#07261E" />
        <path d={`M ${cx - r * 0.28} ${cy} L ${cx + r * 0.3} ${cy + r * 0.05}`} stroke="#FFD23F" strokeWidth={6} strokeDasharray="16 12" strokeDashoffset={-t} />
        <g transform={`rotate(${ang} ${cx} ${cy})`}>
          <path d={`M ${cx} ${cy} L ${cx + r} ${cy - r * 0.16} L ${cx + r} ${cy} Z`} fill="#37D69A" opacity={0.28} />
          <path d={`M ${cx} ${cy} H ${cx + r}`} stroke="#9FFFD6" strokeWidth={4} />
        </g>
      </g>
    </g>
  );
};

/** Line icon of a typhoon: three spiral arms around an eye. `draw` 0..1 draws it on; `spin` frames turn it; `glow` lights it orange. */
export const SpiralIcon: React.FC<{ x: number; y: number; r: number; t: number; draw?: number; glow?: number; color?: string }> = ({ x, y, r, t, draw = 1, glow = 0, color = SCH.line }) => {
  const arms = [0, 1, 2].map((k) => {
    const pts = Array.from({ length: 40 }).map((_, i) => {
      const f = i / 39;
      const rr = (0.12 + f * 0.88) * r;
      const th = ((k * 120 - t * 3) * Math.PI) / 180 + 4.6 * f;
      return `${Math.cos(th) * rr},${Math.sin(th) * rr}`;
    });
    return <polyline key={k} points={pts.join(' ')} pathLength={1} fill="none" stroke={glow > 0 ? SCH.live : color} strokeWidth={Math.max(6, r * 0.07)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - clamp(draw)} />;
  });
  return (
    <g transform={`translate(${x} ${y})`} style={glow > 0 ? { filter: `drop-shadow(0 0 ${14 + 18 * glow}px ${SCH.glow})` } : undefined}>
      {arms}
      <circle cx={0} cy={0} r={r * 0.1} fill="none" stroke={glow > 0 ? SCH.live : color} strokeWidth={Math.max(5, r * 0.05)} opacity={clamp(draw * 2 - 1)} />
    </g>
  );
};

/** A small clenched-fist line icon (like the fight chip), centred at (x, y), `s` times 100 px wide. */
export const FistIcon: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = '#F3E3C8' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={34} rx={34} ry={44} fill="#000" opacity={0.25} />
    <rect x={-40} y={-34} width={80} height={72} rx={22} fill={color} stroke="#1D2033" strokeWidth={6} />
    <path d="M -20 -34 v 24 M 0 -34 v 24 M 20 -34 v 24" stroke="#1D2033" strokeWidth={5} strokeLinecap="round" />
    <rect x={-44} y={8} width={52} height={22} rx={11} fill={color} stroke="#1D2033" strokeWidth={5} />
    <rect x={-30} y={36} width={60} height={50} rx={10} fill="#2E2B3D" stroke="#1D2033" strokeWidth={6} />
  </g>
);
