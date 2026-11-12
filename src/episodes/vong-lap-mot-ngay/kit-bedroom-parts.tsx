import React from 'react';
import { rnd, Glow, FONT } from '../../engine';
import { PAL, mix } from './kit-palette';

// Pieces of Pip's morning bedroom, usable on their own (inserts, close-ups). Pure functions of t.
//   <DawnSky id t x0 x1 y0 y1 dawn />   what the window sees: a sky from pre-dawn blue (dawn 0) to peach/gold (1), the
//        sun rising over Vietnamese tube-house rooftops (water tanks, antennas, a tiled roof, a pagoda-ish roof far
//        off), city windows lit before dawn. Clipped to the box. Sun: sunAt(box, dawn).
//   <BedsideClock x y s text ring t glow? />  Pip's digital alarm clock (side-on, x y = base centre, 240 x 120 at s 1,
//        snooze bar on top, red LED `text`). ring > 0: it shakes and ring lines burst from both sides.
//   <TearCalendar x y w day date? />   the Vietnamese tear-off day calendar (lịch bloc): x y top centre, w wide
//        (height 1.3 w). `day` ('THỨ TƯ', 'THỨ NĂM') is printed LARGE: "THỨ" small, the second word huge.

type Box = { x0: number; x1: number; y0: number; y1: number };

/** Where the sun is in a window box for a dawn value (below the roofs at 0, low over them at 1). */
export const sunAt = (b: Box, dawn: number) => ({ x: b.x0 + (b.x1 - b.x0) * 0.68, y: b.y1 + 30 - (b.y1 - b.y0) * 0.62 * dawn });

export const DawnSky: React.FC<{ id: string; t: number; x0: number; x1: number; y0: number; y1: number; dawn?: number }> = ({ id, t, x0, x1, y0, y1, dawn = 1 }) => {
  const w = x1 - x0;
  const h = y1 - y0;
  const d = dawn;
  const top = mix('#121A40', '#E8A08E', d);
  const midC = mix('#24305E', PAL.dawn, d);
  const hor = mix('#3A4676', PAL.dawnGold, d);
  const sun = sunAt({ x0, x1, y0, y1 }, d);
  const roofC = mix('#12142E', '#5A3E52', d);
  const roofFar = mix('#1C2042', '#B9787A', d);
  const rimC = mix('#3A4676', '#FFE2B0', d);
  // near roofline: tube houses of varied height, each with a water tank or an antenna
  const houses: React.ReactNode[] = [];
  let x = x0 - 8;
  let i = 0;
  while (x < x1 + 10) {
    const bw = w * (0.12 + rnd(71, i) * 0.12);
    const bh = h * (0.16 + rnd(72, i) * 0.2);
    const top0 = y1 - bh;
    houses.push(
      <g key={`h${i}`}>
        <rect x={x} y={top0} width={bw + 1} height={bh + 4} fill={roofC} />
        <path d={`M ${x} ${top0} L ${x + bw} ${top0}`} stroke={rimC} strokeWidth={2} opacity={0.7} />
        {/* windows: lit before dawn, dark after */}
        {[0, 1].map((k) => (rnd(73, i * 3 + k) > 0.45 ? <rect key={k} x={x + bw * (0.2 + k * 0.4)} y={top0 + bh * 0.35} width={bw * 0.2} height={bh * 0.18} fill="#FFC27A" opacity={0.85 * (1 - d) + 0.08} /> : null))}
        {rnd(74, i) > 0.4 ? (
          // a stainless rooftop water tank on legs
          <g>
            <rect x={x + bw * 0.25} y={top0 - h * 0.075} width={bw * 0.42} height={h * 0.06} rx={h * 0.03} fill={mix('#2A2E4C', '#9A8A96', d)} />
            <path d={`M ${x + bw * 0.3} ${top0 - h * 0.015} L ${x + bw * 0.3} ${top0} M ${x + bw * 0.62} ${top0 - h * 0.015} L ${x + bw * 0.62} ${top0}`} stroke={roofC} strokeWidth={2} />
            <path d={`M ${x + bw * 0.27} ${top0 - h * 0.075} L ${x + bw * 0.65} ${top0 - h * 0.075}`} stroke={rimC} strokeWidth={1.5} opacity={0.8} />
          </g>
        ) : (
          <path d={`M ${x + bw * 0.5} ${top0} L ${x + bw * 0.5} ${top0 - h * 0.13} M ${x + bw * 0.36} ${top0 - h * 0.1} L ${x + bw * 0.64} ${top0 - h * 0.1} M ${x + bw * 0.4} ${top0 - h * 0.07} L ${x + bw * 0.6} ${top0 - h * 0.07}`} stroke={roofC} strokeWidth={2.2} />
        )}
      </g>,
    );
    x += bw;
    i++;
  }
  return (
    <g>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect x={x0} y={y0} width={w} height={h} />
        </clipPath>
        <linearGradient id={`${id}sky`} x1="0" y1={y0} x2="0" y2={y1} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={top} />
          <stop offset="0.55" stopColor={midC} />
          <stop offset="1" stopColor={hor} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}clip)`}>
        <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}sky)`} />
        {/* a few stars that fade as the sky lightens */}
        {Array.from({ length: 10 }).map((_, k) => (
          <circle key={`s${k}`} cx={x0 + rnd(75, k) * w} cy={y0 + rnd(76, k) * h * 0.45} r={1.6} fill="#F1F3FF" opacity={(1 - d) * (0.5 + 0.4 * Math.sin(t / 11 + k))} />
        ))}
        {/* thin morning clouds lit from below */}
        {[[0.22, 0.24, 0.3], [0.7, 0.16, 0.24], [0.45, 0.36, 0.2]].map(([u, v, s], k) => (
          <g key={`c${k}`} transform={`translate(${((t * 0.06 * (k % 2 ? 1 : -1)) % 30)} 0)`}>
            <ellipse cx={x0 + u * w} cy={y0 + v * h} rx={w * s} ry={h * 0.025} fill={mix('#2E3A6A', '#FFE6C4', d)} opacity={0.55} />
            <ellipse cx={x0 + u * w + 10} cy={y0 + v * h + h * 0.012} rx={w * s * 0.8} ry={h * 0.012} fill={mix('#3A4676', '#FF9F7A', d)} opacity={0.6} />
          </g>
        ))}
        {/* the sun with its bloom, rising behind the far roofs */}
        <circle cx={sun.x} cy={sun.y} r={w * 0.9} fill="url(#kitBloom)" opacity={0.55 * d} />
        <circle cx={sun.x} cy={sun.y} r={Math.min(34, w * 0.09)} fill="#FFF1CF" opacity={Math.min(1, d * 1.6)} />
        {/* far roofs: a tiled roof with upturned eaves and a tall narrow block */}
        <path d={`M ${x0} ${y1 - h * 0.3} L ${x0 + w * 0.18} ${y1 - h * 0.3} L ${x0 + w * 0.2} ${y1 - h * 0.4} L ${x0 + w * 0.24} ${y1 - h * 0.4} L ${x0 + w * 0.26} ${y1 - h * 0.3} L ${x0 + w * 0.4} ${y1 - h * 0.32} Q ${x0 + w * 0.46} ${y1 - h * 0.46} ${x0 + w * 0.52} ${y1 - h * 0.34} Q ${x0 + w * 0.5} ${y1 - h * 0.37} ${x0 + w * 0.56} ${y1 - h * 0.39} L ${x0 + w * 0.6} ${y1 - h * 0.3} L ${x0 + w * 0.82} ${y1 - h * 0.33} L ${x0 + w * 0.84} ${y1 - h * 0.48} L ${x0 + w * 0.9} ${y1 - h * 0.48} L ${x0 + w * 0.92} ${y1 - h * 0.33} L ${x1} ${y1 - h * 0.31} L ${x1} ${y1} L ${x0} ${y1} Z`} fill={roofFar} opacity={0.9} />
        {houses}
        {/* a power line with birds across the view */}
        <path d={`M ${x0} ${y0 + h * 0.5} Q ${x0 + w / 2} ${y0 + h * 0.58} ${x1} ${y0 + h * 0.48}`} stroke={roofC} strokeWidth={2} fill="none" />
        {[0.3, 0.36, 0.62].map((u, k) => (
          <ellipse key={`b${k}`} cx={x0 + u * w} cy={y0 + h * (0.53 + 0.03 * Math.sin(u * 3.14)) - 5} rx={6} ry={4.5} fill={roofC} />
        ))}
        {/* haze near the horizon */}
        <rect x={x0} y={y1 - h * 0.35} width={w} height={h * 0.35} fill={hor} opacity={0.12 + 0.12 * d} />
      </g>
    </g>
  );
};

/** Pip's bedside alarm clock, side-on, x y = middle of its base; 240 x 120 at s 1. `ring` (0..1) shakes it. */
export const BedsideClock: React.FC<{ x: number; y: number; s?: number; text: string; ring?: number; t?: number; glow?: number }> = ({ x, y, s = 1, text, ring = 0, t = 0, glow = 1 }) => {
  const rot = ring > 0 ? Math.sin(t * 2.7) * 4.5 * ring : 0;
  const dx = ring > 0 ? Math.sin(t * 3.9) * 5 * ring : 0;
  const lines = ring > 0 ? (
    <g stroke="#FFE7B8" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.85 * ring}>
      {[-1, 1].map((sd) =>
        [0, 1, 2].map((k) => {
          const on = (Math.floor(t / 3) + k) % 3 !== 0;
          const r = 150 + k * 34;
          return on ? <path key={`${sd}${k}`} d={`M ${sd * r * 0.92} ${-120} Q ${sd * (r + 14)} ${-64} ${sd * r * 0.92} ${-8}`} /> : null;
        }),
      )}
    </g>
  ) : null;
  return (
    <g transform={`translate(${x + dx * s} ${y}) scale(${s})`}>
      <ellipse cx={8} cy={2} rx={132} ry={14} fill="#000" opacity={0.38} />
      {lines}
      <g transform={`rotate(${rot} 0 0)`}>
        {/* snooze bar on top */}
        <rect x={-70} y={-136} width={140} height={22} rx={8} fill="#3A3444" stroke="#121019" strokeWidth={4} />
        <rect x={-64} y={-134} width={128} height={5} rx={2} fill="#6A6278" />
        <rect x={-124} y={-120} width={248} height={116} rx={24} fill="#2A2632" stroke="#121019" strokeWidth={5} />
        <rect x={-120} y={-118} width={240} height={10} rx={5} fill="#4A4456" />
        <rect x={-104} y={-102} width={208} height={80} rx={12} fill="#120A0C" />
        <circle cx={0} cy={-62} r={130} fill="url(#g3red)" opacity={0.32 * glow} style={{ mixBlendMode: 'screen' }} />
        <text x={0} y={-38} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={66} fill={PAL.led} style={{ filter: 'drop-shadow(0 0 10px #FF3A2A)' }}>
          {text}
        </text>
        <path d="M -122 -60 Q -126 -14 -96 -6" stroke="#FFC98A" strokeWidth={3} fill="none" opacity={0.45} />
        <rect x={-96} y={-6} width={22} height={9} rx={3} fill="#1A1620" />
        <rect x={74} y={-6} width={22} height={9} rx={3} fill="#1A1620" />
      </g>
    </g>
  );
};

/** The tear-off day calendar (lịch bloc) on the wall: x y top centre, w wide. `day` prints LARGE. */
export const TearCalendar: React.FC<{ x: number; y: number; w?: number; day?: string; date?: string; rot?: number }> = ({ x, y, w = 140, day = 'THỨ TƯ', date = '', rot = 0 }) => {
  const h = w * 1.3;
  const [a, ...b] = day.split(' ');
  const big = b.join(' ') || a;
  const small = b.length ? a : '';
  const bigSize = big.length <= 2 ? w * 0.56 : w * 0.36;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + w * 0.05} y={w * 0.06} width={w} height={h} fill="#000" opacity={0.35} />
      {/* the board it is stapled to, and the nail */}
      <rect x={-w / 2 - w * 0.06} y={-w * 0.05} width={w * 1.12} height={h + w * 0.1} rx={w * 0.03} fill="#6A4632" stroke="#2A1A14" strokeWidth={3} />
      {/* the page block: a few page edges show under the top sheet */}
      {[3, 2, 1].map((k) => <rect key={k} x={-w / 2 + k} y={k * 2.5} width={w} height={h} fill={k % 2 ? '#E6DFCE' : '#D9D1BE'} />)}
      <rect x={-w / 2} y={0} width={w} height={h} fill={PAL.paper} />
      <rect x={-w / 2} y={0} width={w} height={h * 0.16} fill="#C8382E" />
      <path d={`M ${-w / 2} ${h * 0.16} ${Array.from({ length: 12 }).map((_, k) => `L ${-w / 2 + (w * (k + 0.5)) / 12} ${h * 0.16 + (k % 2 ? 3 : -2)}`).join(' ')} L ${w / 2} ${h * 0.16}`} stroke="#9A2A22" strokeWidth={2} fill="none" />
      {[-0.3, 0, 0.3].map((u, k) => <circle key={k} cx={u * w} cy={h * 0.08} r={w * 0.025} fill="#7A1E18" />)}
      {small ? (
        <text x={0} y={h * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.2} fill="#C8382E" letterSpacing={2}>
          {small}
        </text>
      ) : null}
      <text x={0} y={small ? h * 0.36 + bigSize * 1.02 : h * 0.62} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={bigSize} fill="#C8382E">
        {big}
      </text>
      {date ? (
        <text x={0} y={h * 0.94} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.12} fill="#3A3444">
          {date}
        </text>
      ) : (
        <path d={`M ${-w * 0.3} ${h * 0.9} L ${w * 0.3} ${h * 0.9}`} stroke="#B9B0A0" strokeWidth={3} strokeLinecap="round" />
      )}
      <Glow x={0} y={h * 0.5} r={w * 0.9} o={0.12} />
    </g>
  );
};
