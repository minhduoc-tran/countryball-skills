import React from 'react';
import { rnd, FONT, clamp, easeOut, backOut } from '../../engine';
import { mix } from './kit-palette';

// Chapter C props: food and the economy. Pure functions of t. (x, y) is the base/centre as noted.
//   SauceBottle (x,y = base; ~120 wide, 330 tall at s 1)  level 0..1 of nước mắm left, drip when it is nearly empty.
//   RiceBowl (x,y = base centre; ~260 wide)  steam 0..1.   FishPlate (x,y = centre, r 150): top view plate with fish + lemon.
//   ProteinPie (x,y,r)  5 slices, slice 0 (fish) pops out when lit=1.
//   Container (x,y = top-left, w x h)   PortCrane (x,y = ground between the legs, ~420 wide, 560 tall at s 1)
//   FuelDrum / GrainSack / PhoneBox  cargo icons (x,y = centre, ~120).   PriceTag (x,y = centre) tag with n up-arrows.

const INK = '#14121A';

export const SauceBottle: React.FC<{ x: number; y: number; s?: number; level?: number; t?: number }> = ({ x, y, s = 1, level = 1, t = 0 }) => {
  const top = -250;
  const bot = -8;
  const ly = bot - (bot - top) * 0.78 * level; // liquid surface
  const drip = level < 0.08 ? clamp(((t % 26) / 26)) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={78} ry={11} fill="#000" opacity={0.3} />
      <path d="M -52 -8 L -52 -190 Q -52 -230 -20 -250 L -20 -318 L 20 -318 L 20 -250 Q 52 -230 52 -190 L 52 -8 Q 0 6 -52 -8 Z" fill="#CFE6EE" fillOpacity={0.55} stroke={INK} strokeWidth={6} />
      {level > 0.01 ? <path d={`M -49 ${ly} Q -25 ${ly - 5 + Math.sin(t / 5) * 3} 0 ${ly} Q 25 ${ly + 5} 49 ${ly} L 49 -10 Q 0 4 -49 -10 Z`} fill="#8E3F12" opacity={0.92} /> : null}
      <rect x={-24} y={-340} width={48} height={30} rx={6} fill="#C23B2B" stroke={INK} strokeWidth={5} />
      <rect x={-52} y={-170} width={104} height={96} rx={8} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
      <text textAnchor="middle" x={0} y={-130} fontFamily={FONT.ui} fontWeight={700} fontSize={21} fill="#9B2C1F">NƯỚC</text>
      <text textAnchor="middle" x={0} y={-98} fontFamily={FONT.ui} fontWeight={700} fontSize={21} fill="#9B2C1F">MẮM</text>
      <path d="M -40 -230 L -40 -30" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
      {drip > 0 ? <ellipse cx={0} cy={-322 + 0} rx={0} ry={0} /> : null}
      {drip > 0 ? <path d={`M 0 ${-318 + drip * 90} q -7 12 0 18 q 7 -6 0 -18 Z`} fill="#8E3F12" opacity={1 - drip * 0.5} transform="translate(0 6)" /> : null}
    </g>
  );
};

export const RiceBowl: React.FC<{ x: number; y: number; s?: number; steam?: number; t?: number }> = ({ x, y, s = 1, steam = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <ellipse cx={0} cy={4} rx={150} ry={16} fill="#000" opacity={0.3} />
    <path d="M -120 -92 Q -80 -190 0 -196 Q 80 -190 120 -92 Z" fill="#FBF7EE" stroke={INK} strokeWidth={5} />
    {Array.from({ length: 26 }).map((_, i) => <ellipse key={i} cx={-84 + rnd(5, i) * 168} cy={-110 - rnd(6, i) * 70} rx={7} ry={3.4} fill="#E6DCC8" transform={`rotate(${rnd(7, i) * 180} ${-84 + rnd(5, i) * 168} ${-110 - rnd(6, i) * 70})`} />)}
    <path d="M -148 -100 L 148 -100 Q 140 -20 60 -4 Q 0 6 -60 -4 Q -140 -20 -148 -100 Z" fill="#3E7CB0" stroke={INK} strokeWidth={6} />
    <path d="M -130 -80 Q -120 -30 -70 -18" stroke="#9CCBEB" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M -46 -8 Q 0 2 46 -8" stroke="#2A5C85" strokeWidth={6} fill="none" />
    <path d="M 40 -210 L 150 -250 M 62 -204 L 168 -232" stroke="#C69156" strokeWidth={8} strokeLinecap="round" />
    {[-40, 0, 40].map((dx, i) => {
      const ph = (t / 44 + i / 3) % 1;
      return <path key={i} d={`M ${dx} ${-200 - ph * 90} q 14 -22 0 -44 q -14 -22 0 -44`} stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" opacity={steam * Math.sin(Math.PI * ph) * 0.7} />;
    })}
  </g>
);

export const FishPlate: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <circle r={176} fill="#000" opacity={0.25} cx={6} cy={12} />
    <circle r={170} fill="#F7F3EA" stroke={INK} strokeWidth={6} />
    <circle r={126} fill="#EBE4D4" stroke="#D5CCB8" strokeWidth={4} />
    <path d="M -110 0 Q -50 -58 50 -30 L 100 -8 L 130 -38 L 120 0 L 130 38 L 100 8 L 50 30 Q -50 58 -110 0 Z" fill="#E2A25A" stroke={INK} strokeWidth={5} />
    {[-50, -20, 10, 40].map((px, i) => <path key={i} d={`M ${px} -26 Q ${px + 14} 0 ${px} 26`} stroke="#B97A38" strokeWidth={5} fill="none" strokeLinecap="round" />)}
    <circle cx={-82} cy={-4} r={8} fill={INK} /><circle cx={-80} cy={-6} r={3} fill="#FFF" />
    <g transform="translate(70 78)"><circle r={34} fill="#F6D84A" stroke={INK} strokeWidth={4} />{[0, 60, 120].map((a) => <path key={a} d="M 0 0 L 0 -28" stroke="#FBEFA0" strokeWidth={4} transform={`rotate(${a})`} />)}</g>
    {[0, 1, 2].map((i) => {
      const ph = (t / 40 + i / 3) % 1;
      return <path key={i} d={`M ${-40 + i * 50} ${-60 - ph * 50} q 12 -18 0 -34`} stroke="#FFFFFF" strokeWidth={7} fill="none" strokeLinecap="round" opacity={Math.sin(Math.PI * ph) * 0.6} />;
    })}
  </g>
);

export const ProteinPie: React.FC<{ x: number; y: number; r: number; lit: number }> = ({ x, y, r, lit }) => {
  const pt = (a: number, rr: number) => `${Math.cos((a * Math.PI) / 180) * rr} ${Math.sin((a * Math.PI) / 180) * rr}`;
  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
      {[0, 1, 2, 3, 4].map((i) => {
        const a0 = -90 + i * 72;
        const a1 = a0 + 72;
        const mid = a0 + 36;
        const push = i === 0 ? easeOut(clamp(lit)) * 38 : 0;
        return (
          <g key={i} transform={`translate(${Math.cos((mid * Math.PI) / 180) * push} ${Math.sin((mid * Math.PI) / 180) * push})`}>
            <path d={`M 0 0 L ${pt(a0, r)} A ${r} ${r} 0 0 1 ${pt(a1, r)} Z`} fill={i === 0 ? mix('#33415C', '#FF8A3D', lit) : '#33415C'} stroke="#F6EFE3" strokeWidth={6} />
          </g>
        );
      })}
    </g>
  );
};

const BOX = ['#C23B2B', '#2E6FA8', '#E0A12E', '#3E8C6B', '#7A4E9A', '#D9672E'];
export const Container: React.FC<{ x: number; y: number; w?: number; h?: number; c?: number; rust?: boolean }> = ({ x, y, w = 150, h = 70, c = 0, rust = false }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={mix(BOX[c % 6], '#5B4B3A', rust ? 0.35 : 0)} stroke={INK} strokeWidth={5} />
    {Array.from({ length: Math.floor(w / 24) }).map((_, i) => <path key={i} d={`M ${x + 14 + i * 24} ${y + 5} V ${y + h - 5}`} stroke={INK} strokeWidth={2.5} opacity={0.3} />)}
    <rect x={x} y={y} width={w} height={h * 0.14} fill="#FFFFFF" opacity={0.2} />
  </g>
);

export const PortCrane: React.FC<{ x: number; y: number; s?: number; t?: number; sway?: number }> = ({ x, y, s = 1, t = 0, sway = 1 }) => {
  const sw = Math.sin(t / 30) * 4 * sway;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx={0} cy={4} rx={230} ry={12} fill="#000" opacity={0.25} />
      <path d="M -190 0 L -170 -420 M 190 0 L 170 -420 M -180 -200 L 180 -200 M -190 0 L 170 -420 M 190 0 L -170 -420" stroke="#D9672E" strokeWidth={14} fill="none" />
      <rect x={-210} y={-440} width={420} height={26} fill="#E8792F" stroke={INK} strokeWidth={6} />
      <path d="M -200 -440 L -560 -470 L -560 -450 L -200 -414 Z M 200 -440 L 340 -520 L 340 -500 L 200 -414 Z" fill="#E8792F" stroke={INK} strokeWidth={6} />
      <path d={`M -440 -462 L ${-440 + sw} -330`} stroke={INK} strokeWidth={5} />
      <rect x={-486 + sw} y={-330} width={92} height={46} fill={BOX[3]} stroke={INK} strokeWidth={5} />
      <rect x={-60} y={-500} width={120} height={60} fill="#F1ECE2" stroke={INK} strokeWidth={5} />
      <rect x={-44} y={-486} width={32} height={26} fill="#7FC4E8" /><rect x={4} y={-486} width={32} height={26} fill="#7FC4E8" />
    </g>
  );
};

export const FuelDrum: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <path d="M -46 -64 Q -46 -78 0 -78 Q 46 -78 46 -64 L 46 64 Q 46 78 0 78 Q -46 78 -46 64 Z" fill="#C23B2B" />
    <path d="M -46 -30 Q 0 -16 46 -30 M -46 30 Q 0 44 46 30" fill="none" />
    <path d="M 0 -12 Q 18 8 0 26 Q -18 8 0 -12 Z" fill="#F4C542" stroke={INK} strokeWidth={3} />
  </g>
);
export const GrainSack: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <path d="M -50 60 Q -64 0 -40 -50 L -26 -76 L 26 -76 L 40 -50 Q 64 0 50 60 Q 0 78 -50 60 Z" fill="#D9B97A" />
    <path d="M -30 -66 Q 0 -50 30 -66" fill="none" />
    {[-14, 0, 14].map((dx, i) => <path key={i} d={`M ${dx} -10 q 8 -26 0 -40 M ${dx} -10 q -10 -14 -16 -20`} stroke="#8A6A2E" strokeWidth={4} fill="none" transform={`translate(0 ${30 + i * 4})`} />)}
  </g>
);
export const PhoneBox: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <rect x={-38} y={-70} width={76} height={140} rx={14} fill="#2B2F3A" />
    <rect x={-30} y={-58} width={60} height={104} rx={6} fill="#7FC4E8" />
    <circle cx={0} cy={58} r={5} fill="#F6EFE3" stroke="none" />
  </g>
);

/** A price tag (red) with n up-chevrons, swinging a little. */
export const PriceTag: React.FC<{ x: number; y: number; n?: number; s?: number; t?: number; rot?: number; bump?: number }> = ({ x, y, n = 1, s = 1, t = 0, rot = -8, bump = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot + Math.sin(t / 9 + x) * 3}) scale(${s * (0.6 + 0.4 * backOut(clamp(bump)))})`} strokeLinejoin="round">
    <path d="M -110 -50 L 70 -50 L 124 0 L 70 50 L -110 50 Z" fill="#E94B3C" stroke={INK} strokeWidth={6} />
    <circle cx={86} cy={0} r={11} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
    {Array.from({ length: n }).map((_, i) => <path key={i} d={`M -48 ${22 - i * 24} L -8 ${-8 - i * 24} L 32 ${22 - i * 24}`} stroke="#FFF7E8" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${(n - 1) * 12})`} />)}
  </g>
);
