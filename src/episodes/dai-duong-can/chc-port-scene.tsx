import React from 'react';
import { clamp, easeOut, backOut } from '../../engine';
import { DrySeabed, StrandedShip } from './kit-dry-seabed';
import { Container, PortCrane, FuelDrum, GrainSack, PhoneBox } from './chc-food-econ-props';

// A dead port on the drained seabed (fills 0..1920 x 1080): hazy cracked ground, a ship lying in the mud, two idle cranes, a concrete
// quay with three container stacks (x 520 / 960 / 1400, tops at y ~690). pops = frames at which the cargo badge above each stack pops
// on (fuel drum, grain sack, phone); lock 0..1 closes a big padlock on the middle stack.

const STACKS = [520, 960, 1400];

export const PortScene: React.FC<{ id: string; t: number; pops?: number[]; lock?: number }> = ({ id, t, pops = [], lock = 0 }) => (
  <g>
    <DrySeabed id={`${id}s`} t={t} haze={0.45} />
    <StrandedShip x={1180} y={705} sc={0.5} rot={-7} t={t} />
    <PortCrane x={260} y={800} s={0.78} t={t} />
    <PortCrane x={1690} y={800} s={0.7} t={t + 40} />
    <rect x={0} y={800} width={1920} height={280} fill="#8B8F94" />
    <rect x={0} y={800} width={1920} height={14} fill="#B7BBBF" />
    {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${i * 220} 830 L ${i * 220 - 120} 1080`} stroke="#6C7075" strokeWidth={3} opacity={0.6} />)}
    <rect x={0} y={800} width={1920} height={10} fill="#E3B23A" opacity={0.9} />
    {STACKS.map((x, i) => (
      <g key={i}>
        <ellipse cx={x} cy={930} rx={170} ry={14} fill="#000" opacity={0.25} />
        {[0, 1, 2].map((r) => <Container key={r} x={x - 130} y={930 - (r + 1) * 82} w={260} h={80} c={i * 2 + r} rust={r === 2} />)}
        {pops[i] !== undefined && t >= pops[i] ? (
          <g transform={`translate(${x} ${620 - 20 * (1 - easeOut(clamp((t - pops[i]) / 8)))}) scale(${backOut(clamp((t - pops[i]) / 7))})`}>
            <circle r={96} fill="#F6EFE3" stroke="#14121A" strokeWidth={7} />
            {i === 0 ? <FuelDrum x={0} y={0} s={0.95} /> : i === 1 ? <GrainSack x={0} y={4} s={0.95} /> : <PhoneBox x={0} y={0} s={0.8} />}
          </g>
        ) : null}
      </g>
    ))}
    {lock > 0 ? <Padlock x={960} y={650} k={lock} /> : null}
  </g>
);

/** A big padlock whose shackle drops shut (k 0..1). */
const Padlock: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => {
  const e = backOut(clamp(k));
  return (
    <g transform={`translate(${x} ${y - 160 * (1 - clamp(k * 2))}) scale(${1.4 + 0.3 * (1 - clamp(k))})`} strokeLinejoin="round">
      <path d={`M -52 -70 V ${-118 + 36 * e} Q -52 ${-190 + 36 * e} 0 ${-190 + 36 * e} Q 52 ${-190 + 36 * e} 52 ${-118 + 36 * e} V -70`} stroke="#14121A" strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d={`M -52 -70 V ${-118 + 36 * e} Q -52 ${-190 + 36 * e} 0 ${-190 + 36 * e} Q 52 ${-190 + 36 * e} 52 ${-118 + 36 * e} V -70`} stroke="#C9CED3" strokeWidth={20} fill="none" strokeLinecap="round" />
      <rect x={-96} y={-72} width={192} height={150} rx={26} fill="#E3B23A" stroke="#14121A" strokeWidth={9} />
      <circle cx={0} cy={-8} r={20} fill="#14121A" /><path d="M -9 -4 L -13 40 L 13 40 L 9 -4 Z" fill="#14121A" />
      <rect x={-80} y={-60} width={160} height={24} rx={10} fill="#FFFFFF" opacity={0.28} />
    </g>
  );
};
