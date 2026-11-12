import React from 'react';
import { LOOKS, Look, clamp, easeOut, FONT, Glow, Dust } from '../../engine';

// Chapter D props (3/4): the shuttered corner shop, its owner, and the milk carton from day one.

/** The shop owner: grey hair, a cream apron-shirt (local look, nobody famous). */
export const OWNER: Look = { ...LOOKS.mo, jacket: '#E8E2D2', jacketShade: '#C9C2AE', accent: '#8A5A32', hair: '#8E8E96', extra: undefined };

/** A gable-top milk carton, generic (a blue band and a drop, no brand). (x, y) = centre of the body. */
export const MilkCarton: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -40 -60 L -40 -78 L 0 -104 L 40 -78 L 40 -60 Z" fill="#DCE8F2" stroke="#3E5A74" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -40 -78 L 0 -88 L 40 -78 M 0 -104 V -88" stroke="#3E5A74" strokeWidth={3} fill="none" />
    <rect x={-40} y={-62} width={80} height={124} rx={4} fill="#F6F9FC" stroke="#3E5A74" strokeWidth={4} />
    <rect x={-40} y={-10} width={80} height={44} fill="#3E8CC8" />
    <path d="M 0 -42 Q 14 -22 0 -14 Q -14 -22 0 -42 Z" fill="#3E8CC8" />
    <path d="M 22 -60 V 60" stroke="#000" strokeWidth={10} opacity={0.08} />
  </g>
);

/** The shop front in world units: wall, TẠP HÓA sign, roll-up shutter, the lit shop behind, the stone sill. Ground at y = gy.
 * open 0..1 raises the shutter; gap = px of dark slit left under a "closed" shutter. `inside` draws in the shop behind
 * the shutter (clipped to the door). The door is 640 wide, 440 tall. */
export const ShopFront: React.FC<{ x: number; gy: number; id: string; t: number; open?: number; gap?: number; inside?: React.ReactNode; lit?: number }> = ({ x, gy, id, t, open = 0, gap = 0, inside = null, lit }) => {
  const DW = 640;
  const DH = 440;
  const top = gy - DH;
  const left = x - DW / 2;
  const sb = top + (DH - gap) * (1 - open); // the shutter's bottom edge
  const light = lit ?? clamp(open * 1.6 + (gap > 0 ? 0.25 : 0));
  return (
    <g>
      <defs>
        <clipPath id={`${id}door`}><rect x={left} y={top} width={DW} height={DH} /></clipPath>
        <clipPath id={`${id}below`}><rect x={left} y={sb} width={DW} height={gy - sb + 4} /></clipPath>
        <linearGradient id={`${id}spill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD58A" stopOpacity={0.85} /><stop offset="1" stopColor="#FFD58A" stopOpacity={0} /></linearGradient>
      </defs>
      <rect x={x - 1200} y={gy - 760} width={2400} height={760} fill="#C9B79A" />
      <rect x={x - 1200} y={gy - 760} width={2400} height={760} fill="#000" opacity={0.18} />
      <path d={`M ${x - 900} ${gy - 700} q 20 120 -10 240 M ${x + 700} ${gy - 640} q -30 90 10 200`} stroke="#8A7656" strokeWidth={26} opacity={0.35} fill="none" />
      <rect x={x - 1200} y={gy} width={2400} height={500} fill="#7E786C" />
      <path d={`M ${x - 1200} ${gy + 100} H ${x + 1200} M ${x - 1200} ${gy + 240} H ${x + 1200}`} stroke="#5E5A50" strokeWidth={4} />
      {/* the shop inside */}
      <g clipPath={`url(#${id}door)`}>
        <rect x={left} y={top} width={DW} height={DH} fill={light > 0.05 ? '#5A3A22' : '#16120E'} />
        <rect x={left} y={top} width={DW} height={DH} fill="#FFC27A" opacity={0.55 * light} />
        {[70, 190, 310].map((yy) => <rect key={yy} x={left + 24} y={top + yy} width={DW - 48} height={14} fill="#3E2814" />)}
        {[20, 140, 260].map((yy, r) => Array.from({ length: 12 }).map((_, i) => <rect key={`${r}${i}`} x={left + 34 + i * 49} y={top + yy + (i % 3) * 3} width={36} height={50 - (i % 3) * 3} rx={4} fill={['#C4623C', '#4C7FA8', '#D9B04A', '#6E9A5A', '#E8E2D2'][(i + r) % 5]} opacity={0.5 + 0.45 * light} />))}
        <rect x={left} y={gy - 40} width={DW} height={40} fill="#4A3220" />
        <g clipPath={`url(#${id}below)`}>{inside}</g>
      </g>
      {/* roll-up shutter */}
      <g clipPath={`url(#${id}door)`}>
        <rect x={left} y={top} width={DW} height={Math.max(0, sb - top)} fill="#8E949C" />
        {Array.from({ length: 30 }).map((_, i) => {
          const yy = sb - 12 - i * 16;
          return yy > top ? <path key={i} d={`M ${left} ${yy} H ${left + DW}`} stroke="#5E646C" strokeWidth={4} /> : null;
        })}
        <rect x={left} y={sb - 14} width={DW} height={14} fill="#5E646C" />
        <rect x={left + DW / 2 - 24} y={sb - 40} width={48} height={20} rx={6} fill="#3E4248" />
      </g>
      <rect x={left - 36} y={top - 24} width={DW + 72} height={36} fill="#6E5E4C" stroke="#3E3022" strokeWidth={5} />
      <rect x={left - 40} y={top - 190} width={DW + 80} height={130} rx={10} fill="#B02E2E" stroke="#4A1010" strokeWidth={7} />
      <text x={x} y={top - 94} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={84} fill="#FFF3CF" letterSpacing={8}>TẠP HÓA</text>
      <rect x={left - 36} y={top} width={36} height={DH} fill="#7C6E58" stroke="#3E3022" strokeWidth={4} />
      <rect x={left + DW} y={top} width={36} height={DH} fill="#7C6E58" stroke="#3E3022" strokeWidth={4} />
      {/* the sill: a stone slab across the foot of the door */}
      <path d={`M ${left - 50} ${gy + 6} L ${left + DW + 50} ${gy + 6} L ${left + DW + 80} ${gy + 70} L ${left - 80} ${gy + 70} Z`} fill="#B8B0A0" stroke="#5E5A50" strokeWidth={5} strokeLinejoin="round" />
      <rect x={left - 80} y={gy + 70} width={DW + 160} height={30} fill="#8E887A" stroke="#5E5A50" strokeWidth={5} />
      {light > 0.1 ? (
        <g>
          <path d={`M ${left} ${gy + 70} L ${left + DW} ${gy + 70} L ${left + DW + 260} ${gy + 420} L ${left - 260} ${gy + 420} Z`} fill={`url(#${id}spill)`} opacity={light * 0.7} style={{ mixBlendMode: 'screen' }} />
          <Glow x={x} y={gy - 160} r={520} o={0.55 * light} />
          <Dust t={t} seed={7} x0={left} y0={gy - 360} w={DW} h={420} n={22} o={0.7 * light} />
        </g>
      ) : null}
    </g>
  );
};

/** The fridge from the cold-open theft: cold-lit shelves of cartons; `take` 0..1 lifts one out. */
export const Fridge: React.FC<{ take: number }> = ({ take }) => {
  const lift = easeOut(clamp(take));
  return (
    <g>
      <rect x={-300} y={-200} width={2520} height={1500} fill="#1F3A44" />
      <rect x={300} y={80} width={1320} height={800} rx={20} fill="#D6EAF0" stroke="#3E5A74" strokeWidth={10} />
      <rect x={330} y={110} width={1260} height={740} rx={10} fill="#A8D0DE" />
      <Glow x={960} y={480} r={700} o={0.6} />
      {[0, 1, 2].map((r) => <rect key={r} x={330} y={300 + r * 190} width={1260} height={14} fill="#6E9AAE" />)}
      {[0, 1, 2].map((r) => Array.from({ length: 7 }).map((_, c) => {
        const taken = r === 1 && c === 3;
        return taken ? null : <MilkCarton key={`${r}${c}`} x={420 + c * 175} y={r * 190 + 190} s={0.95} />;
      }))}
      <MilkCarton x={420 + 3 * 175 + 520 * lift} y={380 - 120 * lift} s={0.95 + 0.5 * lift} rot={-14 * lift} />
    </g>
  );
};
