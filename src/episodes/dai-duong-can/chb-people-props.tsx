import React from 'react';
import { Sparkle } from '../../engine';
import { PAL } from './kit-palette';

// Chapter B (1/4): tiny background people for crowds (feet at (x, y), ~100*s tall). Pure functions of t.
//   <Mini x y s? c? t ph? tool? run? dir? skin? ping? />
//     tool: 'none' | 'shovel' | 'detector' (swings over the ground, `ping` makes the ring flash) | 'spear' | 'camera' | 'bucket'
//     run: fast legs + bob. dir: 1 faces right, -1 left. skin 0..3. c = shirt colour.
//   <GoldChest x y s? t? open? />   little treasure chest sitting on the ground (x, y = ground under it), glints when open.
const SKIN = ['#D9A070', '#C48A5E', '#E8B98A', '#B9794F'];
const INK = PAL.ink;

export type Tool = 'none' | 'shovel' | 'detector' | 'spear' | 'camera' | 'bucket';

export const Mini: React.FC<{ x: number; y: number; s?: number; c?: string; t: number; ph?: number; tool?: Tool; run?: boolean; dir?: 1 | -1; skin?: number; ping?: boolean; hat?: string }> = ({
  x, y, s = 1, c = '#E04B3A', t, ph = 0, tool = 'none', run = false, dir = 1, skin = 0, ping = false, hat,
}) => {
  const sp = run ? 0.95 : 0.5;
  const w = Math.sin(t * sp + ph);
  const bob = Math.abs(Math.cos(t * sp + ph)) * (run ? 6 : 2.5);
  const sk = SKIN[skin % 4];
  const hy = -64 - bob; // shoulder height
  const handX = 24 + (run ? w * 6 : 0);
  const handY = -50 - bob + (run ? Math.abs(w) * -8 : 0);
  const sw = Math.sin(t * 0.17 + ph * 2);
  const tools: Record<Tool, React.ReactNode> = {
    none: null,
    shovel: (
      <g>
        <path d={`M ${handX - 6} ${handY + 14} L ${handX + 22} ${-134 - bob}`} stroke="#6B4A2A" strokeWidth={5} strokeLinecap="round" />
        <path d={`M ${handX + 14} ${-128 - bob} L ${handX + 40} ${-146 - bob} L ${handX + 46} ${-124 - bob} L ${handX + 24} ${-114 - bob} Z`} fill="#9AA4AE" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      </g>
    ),
    detector: (
      <g>
        <path d={`M ${handX} ${handY} L ${60 + sw * 14} -8`} stroke="#5A5F68" strokeWidth={4.5} strokeLinecap="round" />
        <ellipse cx={64 + sw * 14} cy={-6} rx={22} ry={7} fill="#2D3138" stroke={INK} strokeWidth={2.5} />
        <circle cx={64 + sw * 14} cy={-6} r={4} fill={ping ? '#FF4A3F' : '#6DE08A'} />
        {ping ? <ellipse cx={64 + sw * 14} cy={-6} rx={34 + Math.sin(t) * 4} ry={11} fill="none" stroke="#FFE27A" strokeWidth={3} opacity={0.8} /> : null}
      </g>
    ),
    spear: (
      <g>
        <path d={`M ${handX + 4} ${-150 - bob} L ${handX - 2} 8`} stroke="#6B4A2A" strokeWidth={5} strokeLinecap="round" />
        <path d={`M ${handX + 1} ${-176 - bob} L ${handX + 10} ${-148 - bob} L ${handX - 2} ${-148 - bob} Z`} fill="#B9B2A0" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      </g>
    ),
    camera: (
      <g>
        <rect x={10} y={-118 - bob} width={22} height={15} rx={3} fill="#2D3138" stroke={INK} strokeWidth={2.5} />
        <circle cx={25} cy={-110 - bob} r={4.5} fill="#8FD0F0" />
      </g>
    ),
    bucket: (
      <g>
        <path d={`M ${handX - 10} ${handY + 22} L ${handX + 12} ${handY + 22} L ${handX + 9} ${handY + 46} L ${handX - 7} ${handY + 46} Z`} fill="#4F86B5" stroke={INK} strokeWidth={2.5} />
      </g>
    ),
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
      <ellipse cx={0} cy={2} rx={24} ry={5} fill="#000" opacity={0.22} />
      <path d={`M -3 ${-40 - bob} L ${-w * 15} ${-bob * 0.2}`} stroke={sk} strokeWidth={7} strokeLinecap="round" />
      <path d={`M 3 ${-40 - bob} L ${w * 15} ${-bob * 0.2}`} stroke={sk} strokeWidth={7} strokeLinecap="round" />
      <path d={`M -9 ${hy + 6} L ${-12 - w * 8} ${-46 - bob}`} stroke={sk} strokeWidth={6} strokeLinecap="round" />
      <rect x={-13} y={-84 - bob} width={26} height={48} rx={11} fill={c} stroke={INK} strokeWidth={3} />
      <path d={`M 9 ${hy + 6} L ${handX} ${handY}`} stroke={sk} strokeWidth={6.5} strokeLinecap="round" />
      <circle cx={2} cy={-100 - bob} r={14} fill={sk} stroke={INK} strokeWidth={3} />
      {hat ? <path d={`M -15 ${-102 - bob} Q 2 ${-124 - bob} 19 ${-102 - bob} Z`} fill={hat} stroke={INK} strokeWidth={2.5} /> : <path d={`M -13 ${-103 - bob} Q 2 ${-120 - bob} 17 ${-102 - bob} Q 2 ${-108 - bob} -13 ${-103 - bob} Z`} fill="#2A1A14" />}
      {tools[tool]}
    </g>
  );
};

export const GoldChest: React.FC<{ x: number; y: number; s?: number; t?: number; open?: number }> = ({ x, y, s = 1, t = 0, open = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={11} fill="#000" opacity={0.28} />
    <rect x={-56} y={-56} width={112} height={56} rx={6} fill="#8A5A2E" stroke={INK} strokeWidth={4} />
    <path d="M -56 -30 L 56 -30 M -22 -56 L -22 0 M 22 -56 L 22 0" stroke="#5B3A1C" strokeWidth={4} />
    {open > 0 ? <ellipse cx={0} cy={-58} rx={52} ry={12} fill="#FFD04A" stroke={INK} strokeWidth={3} /> : null}
    {open > 0 ? [-30, -8, 16, 36].map((px, i) => <circle key={i} cx={px} cy={-64 - (i % 2) * 6} r={9} fill={i % 2 ? '#FFE27A' : '#F2B632'} stroke={INK} strokeWidth={2} />) : null}
    <path d={`M -56 -56 Q 0 ${-100 + (1 - open) * 40} 56 -56`} fill="#A06A38" stroke={INK} strokeWidth={4} opacity={open > 0 ? 0 : 1} />
    <rect x={-8} y={-38} width={16} height={18} rx={3} fill="#F2B632" stroke={INK} strokeWidth={2.5} />
    {open > 0 ? <Sparkle x={-30} y={-84} t={t} s={1.1} /> : null}
    {open > 0 ? <Sparkle x={40} y={-76} t={t + 9} s={0.8} /> : null}
  </g>
);
