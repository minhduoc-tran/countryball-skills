import React from 'react';
import { rnd, NightSky, Stars, Skyline, Glow, FONT, mixHex } from '../../engine';

// Chapter C props, part 1: the Milky Way band, a star-sky backdrop, the dark beach, the sunscreen bottle, the happy
// astronomer with her telescope. Everything is a pure function of the shot clock `t`.

/** A soft glowing band of the Milky Way with dense stars and a dark dust lane. Screen-blended so it sits over a sky. */
export const MilkyWay: React.FC<{ t: number; id: string; cx?: number; cy?: number; rot?: number; len?: number; w?: number; o?: number; seed?: number; stars?: number }> = ({
  t, id, cx = 960, cy = 300, rot = -18, len = 1500, w = 300, o = 1, seed = 7, stars = 260,
}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot})`} opacity={o} style={{ mixBlendMode: 'screen' }}>
    <defs>
      <radialGradient id={`${id}mw`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#E8DDFF" stopOpacity={0.8} />
        <stop offset="0.45" stopColor="#8E86D8" stopOpacity={0.4} />
        <stop offset="1" stopColor="#3A4A9A" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${id}core`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFE9C8" stopOpacity={0.85} />
        <stop offset="1" stopColor="#FFB48A" stopOpacity={0} />
      </radialGradient>
    </defs>
    <g filter="url(#blur16)">
      <ellipse cx={0} cy={0} rx={len} ry={w * 0.55} fill={`url(#${id}mw)`} />
      <ellipse cx={-len * 0.15} cy={0} rx={len * 0.5} ry={w * 0.45} fill={`url(#${id}core)`} opacity={0.75} />
    </g>
    <g filter="url(#blur10)">
      {Array.from({ length: 9 }).map((_, i) => (
        <ellipse key={i} cx={(rnd(seed, i) - 0.5) * len * 1.5} cy={(rnd(seed + 1, i) - 0.5) * w * 0.4} rx={120 + rnd(seed + 2, i) * 160} ry={30 + rnd(seed + 3, i) * 50} fill="#D8D0FF" opacity={0.22} />
      ))}
    </g>
    {/* dust lane */}
    <g filter="url(#blur10)">
      <path d={`M ${-len * 0.9} ${w * 0.02} Q ${-len * 0.3} ${-w * 0.14} ${len * 0.1} ${w * 0.04} T ${len * 0.9} ${-w * 0.02}`} stroke="#0A0D24" strokeWidth={w * 0.13} fill="none" opacity={0.38} />
    </g>
    {Array.from({ length: stars }).map((_, i) => {
      const x = (rnd(seed + 4, i) + rnd(seed + 5, i) - 1) * len * 1.7;
      const y = (rnd(seed + 6, i) + rnd(seed + 7, i) + rnd(seed + 8, i) - 1.5) * w * 0.7;
      const tw = 0.6 + 0.4 * Math.sin(t / (6 + rnd(seed + 9, i) * 8) + i * 1.7);
      return <circle key={i} cx={x} cy={y} r={0.7 + rnd(seed + 10, i) * 1.6} fill={i % 7 === 0 ? '#FFD9B0' : '#F2F4FF'} opacity={(0.45 + 0.5 * rnd(seed + 11, i)) * tw} />;
    })}
  </g>
);

/** A full-frame black starry sky for scenes that are not on a set (x0..x1 = -400..2320). */
export const StarSky: React.FC<{ t: number; id: string; horizonY?: number; n?: number; seed?: number }> = ({ t, id, horizonY = 900, n = 110, seed = 41 }) => (
  <g>
    <NightSky id={id} horizonY={horizonY} />
    <Stars seed={seed} x0={-300} y0={-300} w={2520} h={1200} t={t} n={n} />
  </g>
);

/** A dark beach at "noon": black starry sky, calm black sea glittering with star reflections, sand, a palm. */
export const NightBeach: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const H = 540;
  return (
    <g>
      <StarSky t={t} id={`${id}sky`} horizonY={H} n={130} seed={53} />
      <MilkyWay t={t} id={`${id}mw`} cx={1100} cy={230} rot={-14} len={1300} w={260} o={0.8} stars={120} seed={19} />
      <rect x={-400} y={H} width={2720} height={260} fill="#0B1430" />
      <rect x={-400} y={H} width={2720} height={3} fill="#5A6CB0" opacity={0.5} />
      {Array.from({ length: 44 }).map((_, i) => {
        const x = -200 + rnd(61, i) * 2300;
        const y = H + 14 + rnd(62, i) * 230;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t / (8 + rnd(63, i) * 8) + i));
        return <rect key={i} x={x} y={y} width={14 + rnd(64, i) * 40} height={2.5} rx={1.2} fill="#BFD0FF" opacity={0.5 * tw} />;
      })}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M -50 ${H + 120 + i * 60} ` + Array.from({ length: 21 }).map((_, k) => `Q ${k * 100 + 25 + Math.sin(t * 0.05 + i * 2) * 10} ${H + 112 + i * 60} ${k * 100 + 50} ${H + 120 + i * 60}`).join(' ')} stroke="#6C7FC0" strokeWidth={2.5} fill="none" opacity={0.35} />
      ))}
      <path d={`M -400 ${H + 262} Q 500 ${H + 236 + Math.sin(t * 0.06) * 8} 1100 ${H + 258} T 2320 ${H + 250} L 2320 1300 L -400 1300 Z`} fill="#3A3550" />
      <path d={`M -400 ${H + 262} Q 500 ${H + 236 + Math.sin(t * 0.06) * 8} 1100 ${H + 258} T 2320 ${H + 250}`} stroke="#C8D6FF" strokeWidth={4} fill="none" opacity={0.4} />
      <rect x={-400} y={H + 300} width={2720} height={900} fill="#2A2640" />
      {Array.from({ length: 60 }).map((_, i) => (
        <circle key={i} cx={-200 + rnd(71, i) * 2300} cy={H + 330 + rnd(72, i) * 350} r={1.5 + rnd(73, i) * 3} fill="#4A4460" opacity={0.7} />
      ))}
      {/* a palm leaning in from the left, a dark silhouette */}
      <g transform={`translate(150 ${H + 300})`}>
        <path d="M 0 0 Q 30 -150 -10 -300 L 18 -300 Q 60 -150 40 0 Z" fill="#0E0C1E" />
        {[-70, -35, 10, 50, 85].map((a, i) => (
          <path key={i} d="M 0 0 Q 90 -40 170 40 Q 90 0 0 14 Z" fill="#0E0C1E" transform={`translate(4 -300) rotate(${a - 30 + Math.sin(t / 30 + i) * 2})`} />
        ))}
      </g>
    </g>
  );
};

/** A tossed-aside bottle of sunscreen (a sun on an orange bottle). x, y = its middle. */
export const Sunscreen: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-24} y={-40} width={48} height={80} rx={12} fill="#F28A3A" />
    <rect x={-24} y={-40} width={18} height={80} rx={9} fill="#000" opacity={0.14} />
    <rect x={-14} y={-56} width={28} height={20} rx={5} fill="#F6EFE3" />
    <rect x={-8} y={-66} width={16} height={14} rx={4} fill="#F6EFE3" />
    <circle cx={2} cy={0} r={11} fill="#FFE27A" />
    {Array.from({ length: 8 }).map((_, i) => (
      <path key={i} d="M 0 -15 L 0 -21" stroke="#FFE27A" strokeWidth={3} strokeLinecap="round" transform={`translate(2 0) rotate(${i * 45})`} />
    ))}
    <path d="M 20 -34 L 20 30" stroke="#FFD9A8" strokeWidth={2.5} opacity={0.6} />
  </g>
);

/** A happy astronomer dancing beside a telescope on a tripod. x, y = her feet; `dance` 0..1 how wild. Not a real person. */
export const Astronomer: React.FC<{ x: number; y: number; t: number; s?: number; dance?: number }> = ({ x, y, t, s = 1, dance = 1 }) => {
  const b = Math.sin(t / 3.2) * dance;
  const hop = Math.abs(Math.sin(t / 3.2)) * 26 * dance;
  const sw = Math.sin(t / 3.2 + 1.4);
  const arm = (side: number, ph: number) => {
    const a = (-150 + 70 * Math.sin(t / 3.2 + ph)) * dance + (1 - dance) * -10;
    return `rotate(${side * -a} ${side * 30} -150)`;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* telescope on a tripod to her right */}
      <g transform="translate(200 0)">
        <ellipse cx={0} cy={4} rx={80} ry={10} fill="#000" opacity={0.35} />
        <path d="M 0 -190 L -64 0 M 0 -190 L 64 0 M 0 -190 L 4 0" stroke="#2A2C40" strokeWidth={9} strokeLinecap="round" />
        <g transform="translate(0 -196) rotate(-52)">
          <rect x={-150} y={-24} width={290} height={48} rx={14} fill="#CFD6EA" />
          <rect x={-150} y={-24} width={290} height={14} rx={7} fill="#fff" opacity={0.3} />
          <rect x={-170} y={-30} width={30} height={60} rx={8} fill="#5B6A9A" />
          <rect x={120} y={-14} width={50} height={28} rx={6} fill="#5B6A9A" />
          <rect x={-60} y={-24} width={14} height={48} fill="#8A96BC" />
        </g>
        <rect x={-18} y={-206} width={36} height={22} rx={6} fill="#3A3E5A" />
      </g>
      {/* her */}
      <g transform={`translate(0 ${-hop})`}>
        <ellipse cx={0} cy={hop + 4} rx={50 - hop * 0.6} ry={9} fill="#000" opacity={0.35} />
        <path d={`M -14 -80 L ${-24 - sw * 14} -6 M 14 -80 L ${24 - sw * 14} -6`} stroke="#2A2C40" strokeWidth={15} strokeLinecap="round" />
        <ellipse cx={-26 - sw * 14} cy={-2} rx={20} ry={9} fill="#E8E4F0" />
        <ellipse cx={24 - sw * 14} cy={-2} rx={20} ry={9} fill="#E8E4F0" />
        <g transform={`rotate(${b * 5} 0 -80)`}>
          <path d="M -44 -84 L -34 -230 Q 0 -250 34 -230 L 44 -84 Z" fill="#F4F1FA" stroke="#B8B4D0" strokeWidth={3} />
          <path d="M 0 -240 L 0 -86" stroke="#B8B4D0" strokeWidth={3} />
          <rect x={14} y={-190} width={16} height={22} rx={3} fill="#fff" stroke="#B8B4D0" strokeWidth={2} />
          {[-1, 1].map((side) => (
            <g key={side} transform={arm(side, side > 0 ? 0 : 2.2)}>
              <path d={`M ${side * 30} -150 L ${side * 30} -60`} stroke="#F4F1FA" strokeWidth={22} strokeLinecap="round" />
              <circle cx={side * 30} cy={-52} r={13} fill="#F2C49A" />
            </g>
          ))}
          <g transform={`rotate(${b * 8} 0 -250)`}>
            <circle cx={0} cy={-286} r={44} fill="#F2C49A" />
            <path d="M -44 -292 Q -40 -340 0 -338 Q 44 -340 44 -292 Q 20 -318 -10 -312 Q -30 -308 -44 -292 Z" fill="#8A8AA0" />
            <circle cx={-16} cy={-284} r={13} fill="#fff" fillOpacity={0.5} stroke="#2A2C40" strokeWidth={3} />
            <circle cx={16} cy={-284} r={13} fill="#fff" fillOpacity={0.5} stroke="#2A2C40" strokeWidth={3} />
            <path d="M -3 -284 L 3 -284" stroke="#2A2C40" strokeWidth={3} />
            <circle cx={-16} cy={-284} r={4} fill="#2A2C40" />
            <circle cx={16} cy={-284} r={4} fill="#2A2C40" />
            <path d="M -18 -266 Q 0 -246 18 -266 Q 0 -258 -18 -266 Z" fill="#fff" stroke="#8A3A2A" strokeWidth={3} strokeLinejoin="round" />
          </g>
        </g>
      </g>
    </g>
  );
};

/** A tall city clock tower with a lit face at 12:00, black against the sky: x = centre, y = ground. */
export const ClockTower: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -90 0 L -70 -520 L 70 -520 L 90 0 Z" fill="#141226" />
    <path d="M -80 -520 L 0 -700 L 80 -520 Z" fill="#141226" />
    <rect x={-90} y={-540} width={180} height={26} fill="#1E1A34" />
    <Glow x={0} y={-430} r={230} kind="warm" o={0.55} />
    <circle cx={0} cy={-430} r={84} fill="#FFF3D8" stroke="#2A2038" strokeWidth={10} />
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d="M 0 -72 L 0 -62" stroke="#2A2038" strokeWidth={i % 3 === 0 ? 6 : 3} transform={`translate(0 -430) rotate(${i * 30})`} />
    ))}
    <path d="M 0 -430 L 0 -496" stroke="#2A2038" strokeWidth={7} strokeLinecap="round" />
    <path d="M 0 -430 L 0 -482" stroke="#2A2038" strokeWidth={9} strokeLinecap="round" transform={`rotate(${Math.sin(t / 40) * 0.6} 0 -430)`} />
    <circle cx={0} cy={-430} r={7} fill="#2A2038" />
    {Array.from({ length: 4 }).map((_, i) => (
      <rect key={i} x={-34 + (i % 2) * 40} y={-330 + Math.floor(i / 2) * 90} width={28} height={44} fill="#FFC27A" opacity={0.7 + 0.2 * Math.sin(t / 9 + i)} />
    ))}
  </g>
);

/** A city skyline silhouette with lit windows, to sit under a sky. */
export const NightCity: React.FC<{ t: number; y: number; id?: string }> = ({ t, y }) => (
  <g>
    <Skyline y={y} seed={91} color="#14122A" h={220} />
    <Skyline y={y + 30} seed={97} color="#0C0A1C" h={140} />
    <rect x={-400} y={y + 28} width={2720} height={600} fill="#0A0818" />
    {Array.from({ length: 28 }).map((_, i) => (
      <rect key={i} x={-200 + rnd(81, i) * 2300} y={y - 10 - rnd(82, i) * 190} width={8} height={11} fill={mixHex('#FFC27A', '#9FC0FF', rnd(83, i))} opacity={0.5 + 0.4 * Math.abs(Math.sin(t / 30 + i))} />
    ))}
  </g>
);

/** A clock chip: a small pill with the time, in the mono face. */
export const TimeChip: React.FC<{ x: number; y: number; text: string; s?: number; sub?: string }> = ({ x, y, text, s = 1, sub }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-50} width={340} height={100} rx={50} fill="#0A0E22" opacity={0.78} stroke={mixHex('#FFE2A8', '#0A0E22', 0.4)} strokeWidth={3} />
    <circle cx={-118} cy={0} r={24} fill="none" stroke="#FFE2A8" strokeWidth={4} />
    <path d="M -118 -14 L -118 0 L -106 6" stroke="#FFE2A8" strokeWidth={4} fill="none" strokeLinecap="round" />
    <text x={26} y={sub ? 4 : 18} textAnchor="middle" fontFamily={FONT.ui} fontSize={sub ? 56 : 62} fill="#FFE2A8" letterSpacing={3}>{text}</text>
    {sub ? <text x={26} y={36} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#9FB0D8" letterSpacing={4}>{sub}</text> : null}
  </g>
);
