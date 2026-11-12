import React from 'react';
import { FONT } from '../engine/fonts';
import { FlagCloth, FlagKind } from './flag-cloth';
import { clamp, hash, lerp } from './fx-math';
import { Crowd, Person } from './tay-nam-people-silhouettes';

// Help and farewell props (screen px; side views; t FRAMES; pure):
//   <TroopTruck id x y s? facing? t? flowers? flag? troops? />   1980s army truck (ZIL-style cab, open cargo bed) with soldiers in pith helmets
//                                                                waving, flower garlands on the bonnet and along the bed, a small flag on the cab
//                                                                (x = middle of the truck, y = ground; s = 1 -> ~460 px long)
//   <FarewellConvoy id y x0? x1? n? progress t? s? crowd? />    a column of TroopTrucks driving x0 -> x1 as progress 0..1, waving crowd with small
//                                                                flags along the road (the 26.9.1989 withdrawal: "tiễn đưa", flowers, no weapons shown)
//   <RiceSacks x y n? s? label? />                               a pyramid of rice sacks (food aid), stencilled label (default 'GẠO')
//   <SchoolHouse id x y w? t? children? flag? />                 village school (tiled roof, sign TRƯỜNG HỌC, blackboard in the door), pupils
//                                                                in front waving, flag on a pole

const INK = '#18161C';
const FLOWERS = ['#F2C443', '#E8573C', '#F5F2EA', '#E86FA0'];

const Garland: React.FC<{ x1: number; y1: number; x2: number; y2: number; n?: number; sag?: number }> = ({ x1, y1, x2, y2, n = 9, sag = 16 }) => (
  <g>
    <path d={`M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + sag * 2} ${x2},${y2}`} fill="none" stroke="#3E7A2E" strokeWidth={3} />
    {Array.from({ length: n }, (_, i) => { const u = (i + 0.5) / n, px = lerp(x1, x2, u), py = lerp(y1, y2, u) + sag * 4 * u * (1 - u); return <circle key={i} cx={px} cy={py} r={6.5} fill={FLOWERS[i % 4]} stroke={INK} strokeWidth={1.4} />; })}
  </g>
);

export const TroopTruck: React.FC<{ id: string; x: number; y: number; s?: number; facing?: 1 | -1; t?: number; flowers?: boolean; flag?: FlagKind | 'none'; troops?: number }> = ({
  id, x, y, s = 1, facing = 1, t = 0, flowers = true, flag = 'VNM', troops = 5,
}) => {
  const bump = Math.sin(t * 0.5 + x * 0.01) * 1.5;
  return (
    <g transform={`translate(${x},${y}) scale(${s * facing},${s})`} strokeLinejoin="round">
      <ellipse cx={0} cy={4} rx={240} ry={14} fill="#000" opacity={0.25} />
      <g transform={`translate(0,${bump})`}>
        {/* cargo bed with soldiers */}
        {Array.from({ length: troops }, (_, i) => <Person key={i} x={-190 + i * 44} y={-92} h={86} pose={i % 2 ? 'wave' : 'stand'} t={t + i * 9} color="#5C6A30" hat="helmet" seed={i + 1} />)}
        <path d="M-220,-96 H40 V-40 H-220 Z" fill="#55632E" stroke={INK} strokeWidth={3} />
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-210 + i * 42} y1={-92} x2={-210 + i * 42} y2={-44} stroke="#3E4A20" strokeWidth={3} />)}
        {/* cab + bonnet */}
        <path d="M44,-40 V-140 H120 L140,-96 H210 Q228,-96 230,-78 V-40 Z" fill="#5C6A30" stroke={INK} strokeWidth={3} />
        <path d="M62,-128 H112 L126,-98 H62 Z" fill="#8FB4C8" stroke={INK} strokeWidth={2.5} />
        <rect x={-226} y={-44} width={460} height={14} fill="#2E3418" stroke={INK} strokeWidth={2.5} />
        {[-160, -90, 160].map((wx) => <g key={wx}><circle cx={wx} cy={-16} r={30} fill="#1A1A1E" /><circle cx={wx} cy={-16} r={13} fill="#6E7460" /></g>)}
        <rect x={222} y={-74} width={12} height={10} fill="#F2E6A0" stroke={INK} strokeWidth={1.5} />
        {flowers && <>
          <Garland x1={-218} y1={-92} x2={38} y2={-92} n={12} sag={10} />
          <Garland x1={142} y1={-94} x2={228} y2={-80} n={5} sag={6} />
          <g>{[150, 172, 194].map((fx, i) => <circle key={fx} cx={fx} cy={-102 - (i % 2) * 6} r={9} fill={FLOWERS[i]} stroke={INK} strokeWidth={1.5} />)}</g>
        </>}
        {flag !== 'none' && <g><line x1={50} y1={-140} x2={50} y2={-210} stroke={INK} strokeWidth={4} /><FlagCloth id={`${id}-flag`} x={50} y={-210} w={66} h={44} kind={flag} wave={0.8} t={t} /></g>}
      </g>
    </g>
  );
};

export const FarewellConvoy: React.FC<{ id: string; y: number; x0?: number; x1?: number; n?: number; progress: number; t: number; s?: number; crowd?: boolean }> = ({
  id, y, x0 = -700, x1 = 1500, n = 3, progress, t, s = 0.9, crowd = true,
}) => {
  const gap = 520 * s, head = lerp(x0, x1 + gap * (n - 1), clamp(progress));
  return (
    <g>
      {Array.from({ length: n }, (_, i) => <TroopTruck key={i} id={`${id}-${i}`} x={head - i * gap} y={y} s={s} t={t + i * 13} flag={i === 0 ? 'VNM' : 'none'} />)}
      {crowd && <g>
        <Crowd x={540} y={y + 300} w={1180} n={11} h={150} t={t} seed={7} />
        {Array.from({ length: 6 }, (_, i) => { const fx = 60 + i * 190 + hash(i, 2) * 40; return <g key={i}><line x1={fx} y1={y + 210} x2={fx} y2={y + 150} stroke={INK} strokeWidth={3} /><FlagCloth id={`${id}-cf${i}`} x={fx} y={y + 150} w={46} h={30} kind={i % 2 ? 'PRK' : 'VNM'} wave={0.9} t={t + i * 11} /></g>; })}
      </g>}
    </g>
  );
};

export const RiceSacks: React.FC<{ x: number; y: number; n?: number; s?: number; label?: string }> = ({ x, y, n = 6, s = 1, label = 'GẠO' }) => {
  const rows: number[] = []; let left = n, r = Math.ceil((Math.sqrt(8 * n + 1) - 1) / 2);
  while (left > 0 && r > 0) { rows.push(Math.min(r, left)); left -= r; r--; }
  const sw = 150 * s, sh = 96 * s;
  return (
    <g strokeLinejoin="round">
      <ellipse cx={x} cy={y + 4} rx={rows[0] * sw * 0.55} ry={14 * s} fill="#000" opacity={0.25} />
      {rows.map((cnt, ri) => Array.from({ length: cnt }, (_, i) => {
        const cx = x + (i - (cnt - 1) / 2) * sw * 0.96, cy = y - sh / 2 - ri * sh * 0.82;
        return (
          <g key={`${ri}-${i}`} transform={`translate(${cx},${cy}) rotate(${(hash(ri, i) - 0.5) * 4})`}>
            <path d={`M${-sw * 0.48},${-sh * 0.36} Q${-sw * 0.52},0 ${-sw * 0.46},${sh * 0.44} Q0,${sh * 0.54} ${sw * 0.46},${sh * 0.44} Q${sw * 0.52},0 ${sw * 0.48},${-sh * 0.36} Q0,${-sh * 0.5} ${-sw * 0.48},${-sh * 0.36} Z`} fill="#E8DDBF" stroke={INK} strokeWidth={2.5 * s} />
            <path d={`M${-sw * 0.4},${-sh * 0.34} Q0,${-sh * 0.24} ${sw * 0.4},${-sh * 0.34}`} fill="none" stroke="#9A8A62" strokeWidth={2 * s} strokeDasharray={`${5 * s} ${4 * s}`} />
            <text x={0} y={sh * 0.16} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30 * s} fill="#2F5F7A" opacity={0.85}>{label}</text>
          </g>
        );
      }))}
    </g>
  );
};

export const SchoolHouse: React.FC<{ id: string; x: number; y: number; w?: number; t?: number; children?: number; flag?: FlagKind }> = ({ id, x, y, w = 760, t = 0, children = 6, flag = 'PRK' }) => {
  const k = w / 760;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} strokeLinejoin="round">
      <rect x={-340} y={-230} width={680} height={230} fill="#E9DFC4" stroke={INK} strokeWidth={3} />
      <path d="M-380,-226 L-300,-330 H300 L380,-226 Z" fill="#B5512E" stroke={INK} strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-330 + i * 60} y1={-230} x2={-270 + i * 50} y2={-326} stroke="#8A3A20" strokeWidth={2} />)}
      <rect x={-120} y={-300} width={240} height={46} rx={6} fill="#2F4A8A" stroke={INK} strokeWidth={2.5} />
      <text x={0} y={-266} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#F4F0E2" letterSpacing={2}>TRƯỜNG HỌC</text>
      {[-250, 170].map((wx) => <g key={wx}><rect x={wx} y={-190} width={90} height={80} fill="#5E8FB0" stroke={INK} strokeWidth={2.5} /><line x1={wx + 45} y1={-190} x2={wx + 45} y2={-110} stroke={INK} strokeWidth={2} /></g>)}
      <rect x={-70} y={-180} width={140} height={180} fill="#3A2E28" stroke={INK} strokeWidth={2.5} />
      <rect x={-56} y={-160} width={112} height={70} fill="#2E4A3A" stroke="#8A6A3A" strokeWidth={4} />
      <text x={0} y={-118} textAnchor="middle" fontFamily={FONT.hand} fontSize={26} fill="#F4F0E2">a b c</text>
      <line x1={250} y1={-326} x2={250} y2={-520} stroke="#D8D2C0" strokeWidth={6} />
      <FlagCloth id={`${id}-flag`} x={253} y={-516} w={120} h={80} kind={flag} wave={0.8} t={t} />
      {Array.from({ length: children }, (_, i) => <Person key={i} x={-280 + i * (560 / Math.max(1, children - 1))} y={60} h={95 + hash(i, 3) * 20} pose={i % 3 === 1 ? 'wave' : 'stand'} t={t + i * 7} color={i % 2 ? '#F2F2F2' : '#2F4A8A'} seed={i} />)}
    </g>
  );
};
