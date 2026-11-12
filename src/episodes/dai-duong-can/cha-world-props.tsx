import React from 'react';
import { SCH, FONT, UI, rnd, clamp, easeOut, backOut } from '../../engine';
import { PAL } from './kit-palette';

// Chapter A props for the hidden-world beat. Pure functions of t.
//   <RidgeGlow t />              a warm glowing seam low on the far horizon (the mid-ocean ridge seen from the shelf lip).
//   <RidgeChain t id pulse? />   a mountain range receding from the lower left to the horizon (peaks shrink with distance),
//                                with a light pulse running along its crest. Fills the area over a DrySeabed.
//   <WaterVeil t y />            translucent sea above world y (wavy surface), for "it used to be under water".
//   <Volcano x base h w t />     a conical seamount: lit right flank, dark left, strata, lava glow + smoke at the crater.
//   <PeakCompare t />            schematic: Everest 8.849 m vs the Pacific volcano > 10.000 m from its underwater base.

export const RidgeGlow: React.FC<{ t: number }> = ({ t }) => {
  const crest = Array.from({ length: 52 }).map((_, i) => `${i ? 'L' : 'M'} ${-60 + i * 42} ${404 - 10 - Math.abs(Math.sin(i * 0.55 + 1)) * 34 - rnd(77, i) * 26}`).join(' ');
  const pulse = 0.75 + 0.25 * Math.sin(t / 6);
  return (
    <g>
      <path d={`${crest} L 2000 424 L -60 424 Z`} fill="#6B5742" opacity={0.85} />
      <g style={{ filter: 'drop-shadow(0 0 14px #FF8A3D)' }} opacity={pulse}>
        <path d={crest} stroke="#FF8A3D" strokeWidth={9} fill="none" strokeLinejoin="round" />
        <path d={crest} stroke="#FFEBB0" strokeWidth={3.5} fill="none" strokeLinejoin="round" />
      </g>
      <rect x={-100} y={416} width={2120} height={14} fill="#FFB15A" opacity={0.5 * pulse} style={{ mixBlendMode: 'screen' }} />
    </g>
  );
};

const ROCK_DARK = '#4A3C2E';
const ROCK_LIT = '#B99A6A';

type Crest = { x: number; y: number; peak: boolean; foot: number };

/** Crest points of one layer of the range along the spine (wide near, tight far), irregular peaks and saddles. */
const crestOf = (seed: number, lift: number, xOff: number) => {
  const spineY = (e: number) => 1020 - e * 570;
  const hAt = (e: number) => 300 * (1 - Math.pow(e, 1 / 0.75)) + 34;
  const pts: Crest[] = [];
  let i = 0;
  for (let x = -200 + xOff; x <= 1660; i++) {
    const e = clamp((x + 120) / 1760, 0, 1);
    const h = hAt(e) * (1 + lift);
    const peak = i % 2 === 0;
    const k = peak ? 0.62 + rnd(seed, i) * 0.55 : 0.3 + rnd(seed + 1, i) * 0.32;
    const base = spineY(e) - hAt(e) * lift * 0.9;
    pts.push({ x, y: base - h * k, peak, foot: base + hAt(e) * 0.28 });
    x += Math.max(7, h * (0.18 + rnd(seed + 2, i) * 0.34));
  }
  return pts;
};

export const RidgeChain: React.FC<{ t: number; id: string; pulse?: boolean }> = ({ t, id, pulse = true }) => {
  // ONE continuous range on a spine from the near lower left to the far horizon: a hazy back layer for mass, then the
  // front layer with lit right-facing slopes. Reads as a mountain range, not separate cones.
  const layer = (pts: Crest[], fill: string, litO: number, key: string) => {
    const outline = pts.map((c, j) => `${j ? 'L' : 'M'} ${c.x} ${c.y}`).join(' ');
    const base = [...pts].reverse().map((c) => `L ${c.x} ${c.foot}`).join(' ');
    return (
      <g key={key}>
        <path d={`${outline} ${base} Z`} fill={fill} />
        {pts.slice(0, -1).map((c, j) => {
          if (!c.peak) return null;
          const n = pts[j + 1];
          return <path key={j} d={`M ${c.x} ${c.y} L ${n.x} ${n.y} L ${n.x + (n.x - c.x) * 0.1} ${(n.y + n.foot) / 2} L ${c.x + (n.x - c.x) * 0.25} ${c.foot - (c.foot - c.y) * 0.15} Z`} fill={`url(#${id}rl)`} opacity={litO} />;
        })}
        <path d={outline} stroke={PAL.ink} strokeWidth={3.5} fill="none" strokeLinejoin="round" opacity={litO} />
      </g>
    );
  };
  const sp = (t * 0.012) % 1;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}rl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E7CE9C" /><stop offset="1" stopColor="#A9895C" /></linearGradient>
      </defs>
      {layer(crestOf(71, 0.35, 40), '#7A6650', 0.55, 'back')}
      {layer(crestOf(61, 0, 0), ROCK_DARK, 0.95, 'front')}
      {pulse ? Array.from({ length: 3 }).map((_, j) => {
        const p = (sp + j / 3) % 1;
        const e = Math.pow(p, 0.75);
        const h = 300 * (1 - p) + 34;
        return <circle key={j} cx={-120 + e * 1760} cy={1020 - e * 570 - h * 0.7} r={16 * (1 - p * 0.6) + 4} fill="#FFD27A" opacity={Math.sin(p * Math.PI) * 0.95} style={{ filter: 'drop-shadow(0 0 14px #FF8A3D)' }} />;
      }) : null}
    </g>
  );
};

export const WaterVeil: React.FC<{ t: number; y: number; id: string }> = ({ t, y, id }) => {
  let d = `M -200 ${y}`;
  for (let x = -200; x <= 2100; x += 50) d += ` L ${x} ${y + Math.sin(x * 0.012 + t * 0.15) * 7}`;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}wv`} gradientUnits="userSpaceOnUse" x1="0" y1={y} x2="0" y2={y + 700}><stop offset="0" stopColor="#3FA3D0" stopOpacity="0.62" /><stop offset="1" stopColor="#1B4F72" stopOpacity="0.88" /></linearGradient>
      </defs>
      <path d={`${d} L 2100 1300 L -200 1300 Z`} fill={`url(#${id}wv)`} />
      <path d={d} stroke="#E8F7FC" strokeWidth={6} fill="none" opacity={0.8} />
    </g>
  );
};

export const Volcano: React.FC<{ x: number; base: number; h: number; w: number; t: number }> = ({ x, base, h, w, t }) => {
  const top = base - h;
  const cw = w * 0.11;
  const glow = 0.7 + 0.3 * Math.sin(t / 4);
  const L = `M ${x - w} ${base} Q ${x - w * 0.5} ${base - h * 0.2} ${x - w * 0.22} ${base - h * 0.62} Q ${x - w * 0.14} ${top + h * 0.12} ${x - cw} ${top}`;
  const Rq = `Q ${x + w * 0.14} ${top + h * 0.12} ${x + w * 0.22} ${base - h * 0.62} Q ${x + w * 0.5} ${base - h * 0.2} ${x + w} ${base}`;
  const R = `L ${x + cw} ${top} ${Rq}`;
  return (
    <g>
      <ellipse cx={x} cy={base + 6} rx={w * 1.05} ry={26} fill="#000" opacity={0.28} />
      <path d={`${L} ${R} Z`} fill="#4A3C2E" stroke={PAL.ink} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M ${x + cw * 0.2} ${top} L ${x + cw} ${top} ${Rq} L ${x + w * 0.1} ${base} Z`} fill="#8A7050" opacity={0.85} />
      {[0.25, 0.45, 0.65, 0.82].map((k, i) => <path key={i} d={`M ${x - w * (0.12 + k * 0.62)} ${base - h * (0.62 - k * 0.55)} Q ${x} ${base - h * (0.69 - k * 0.55)} ${x + w * (0.12 + k * 0.62)} ${base - h * (0.62 - k * 0.55)}`} stroke="#2B2420" strokeWidth={3} fill="none" opacity={0.3} />)}
      <ellipse cx={x} cy={top} rx={cw * 1.05} ry={9} fill="#2B2420" />
      <ellipse cx={x} cy={top + 1} rx={cw * 0.8} ry={6} fill="#FF8A3D" opacity={glow} style={{ filter: 'drop-shadow(0 0 18px #FF8A3D)' }} />
      {Array.from({ length: 5 }).map((_, i) => {
        const p = ((t * 0.02 + i / 5) % 1);
        return <circle key={i} cx={x + Math.sin(p * 5 + i) * 16 + p * 30} cy={top - p * 120} r={14 + p * 36} fill="#6B6358" opacity={0.5 * (1 - p)} />;
      })}
    </g>
  );
};

export const PeakCompare: React.FC<{ t: number }> = ({ t }) => {
  const K = 0.052; // px per metre
  const base = 900;
  const rise = easeOut(clamp(t / 18));
  const evTop = base - 8849 * K;
  const volTop = base - 10210 * K * rise;
  const line = easeOut(clamp((t - 22) / 10));
  const sea = base - 6000 * K; // the volcano's underwater part: its base is 6.000 m below sea level, so the sea surface is 6.000 m up
  return (
    <g>
      <path d={`M 420 ${base} L 820 ${base}`} stroke={SCH.dim} strokeWidth={4} />
      <path d={`M 420 ${base} L 560 ${evTop + 60} L 612 ${evTop} L 650 ${evTop + 40} L 820 ${base} Z`} fill="#C8D4E2" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M 596 ${evTop + 18} L 612 ${evTop} L 636 ${evTop + 24} L 622 ${evTop + 30} L 608 ${evTop + 24} Z`} fill="#FFFFFF" />
      <path d={`M 1080 ${base} L 1400 ${base} L 1250 ${volTop + 20} L 1230 ${volTop} L 1210 ${volTop + 22} Z`} fill="#4A3C2E" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round" />
      <clipPath id="caPcClip"><path d={`M 1080 ${base} L 1400 ${base} L 1250 ${volTop + 20} L 1230 ${volTop} L 1210 ${volTop + 22} Z`} /></clipPath>
      <g clipPath="url(#caPcClip)"><rect x={1000} y={sea} width={500} height={base - sea} fill="#2E86C1" opacity={0.7} /><path d={`M 1000 ${sea} L 1500 ${sea}`} stroke="#E8F7FC" strokeWidth={5} /></g>
      <path d={`M 420 ${evTop} L ${420 + (1210 - 420) * line} ${evTop}`} stroke={UI.live} strokeWidth={4} strokeDasharray="14 10" />
      <path d={`M 1480 ${base} L 1480 ${volTop} M 1464 ${base} L 1496 ${base} M 1464 ${volTop} L 1496 ${volTop}`} stroke={UI.live} strokeWidth={5} fill="none" strokeLinecap="round" opacity={rise} />
      <g transform={`translate(620 ${base + 70}) scale(${backOut(clamp((t - 6) / 8))})`}><text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={SCH.line}>EVEREST</text><text y={50} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={46} fill={UI.live}>8.849 M</text></g>
      <g transform={`translate(1240 ${base + 70}) scale(${backOut(clamp((t - 14) / 8))})`}><text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={SCH.line}>NÚI LỬA</text><text y={50} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={46} fill={UI.live}>{'> 10.000 M'}</text></g>
    </g>
  );
};
