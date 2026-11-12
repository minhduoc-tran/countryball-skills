import React from 'react';
import { FONT, clamp, easeOut, backOut } from '../../engine';

// Chapter C ("fun" gifts): props drawn for this chapter in the engine's style: flat fills, a darker shade on the side
// away from the light (the light is on the right), a warm rim line on the lit edge, a contact shadow. All pure
// functions of the shot clock `t`.

/** A red gift bow, centred on its knot (x, y), about 150 wide at s 1. */
export const Bow: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 0 Q -70 -70 -78 -22 Q -80 14 0 6 Z" fill="#C42B36" />
    <path d="M 0 0 Q 70 -70 78 -22 Q 80 14 0 6 Z" fill="#E0414B" />
    <path d="M -20 -18 Q -52 -40 -60 -20" stroke="#FF8F94" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M -6 6 L -34 56 L -10 46 L -2 62 L 6 10 Z" fill="#A91F2B" />
    <path d="M 6 6 L 38 54 L 14 46 L 6 62 L 0 10 Z" fill="#D6333E" />
    <ellipse cx={0} cy={2} rx={17} ry={14} fill="#B52430" />
    <ellipse cx={4} cy={-1} rx={10} ry={8} fill="#E8505A" />
  </g>
);

/** A front-loading washing machine, x the middle, y the floor; about 220 wide, 250 tall at s 1. The drum water swirls when `run` is 1. */
export const WashingMachine: React.FC<{ x: number; y: number; s?: number; t: number; id: string; bow?: number; run?: number }> = ({ x, y, s = 1, t, id, bow = 1, run = 1 }) => {
  const wave = (k: number) => 4 * Math.sin(t * 0.22 * run + k);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={8} cy={4} rx={150} ry={17} fill="#000" opacity={0.42} />
      <rect x={-96} y={-8} width={22} height={12} rx={3} fill="#4A5062" />
      <rect x={74} y={-8} width={22} height={12} rx={3} fill="#4A5062" />
      <rect x={-110} y={-256} width={220} height={250} rx={14} fill="#D5DAE3" />
      <rect x={-110} y={-256} width={46} height={250} rx={14} fill="#A9B0C0" opacity={0.65} />
      <rect x={103} y={-250} width={7} height={238} rx={3} fill="#FFD9A0" opacity={0.75} />
      <rect x={-110} y={-256} width={220} height={58} rx={14} fill="#C2C9D8" />
      <rect x={-110} y={-204} width={220} height={6} fill="#98A0B2" />
      <circle cx={-66} cy={-228} r={15} fill="#69728A" />
      <path d="M -66 -228 L -66 -240" stroke="#EDEFF5" strokeWidth={4} strokeLinecap="round" transform={`rotate(${run * ((t * 6) % 360)} -66 -228)`} />
      <rect x={-6} y={-244} width={74} height={30} rx={6} fill="#162030" />
      <text x={31} y={-221} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#7CF0A8">{run ? '0:45' : 'END'}</text>
      <circle cx={88} cy={-228} r={7} fill="#E9C46A" />
      <circle cx={0} cy={-110} r={82} fill="#8E97AA" />
      <circle cx={0} cy={-110} r={70} fill="#18243A" />
      <defs><clipPath id={`${id}drum`}><circle cx={0} cy={-110} r={62} /></clipPath></defs>
      <g clipPath={`url(#${id}drum)`}>
        <path d={`M -70 ${-96 + wave(0)} Q -35 ${-120 + wave(1)} 0 ${-100 + wave(2)} Q 35 ${-80 + wave(3)} 70 ${-104 + wave(4)} L 70 -40 L -70 -40 Z`} fill="#5BA8E8" opacity={0.9} />
        <path d={`M -70 ${-84 + wave(2)} Q -30 ${-104 + wave(3)} 10 ${-86 + wave(0)} Q 40 ${-72 + wave(1)} 70 ${-90 + wave(2)} L 70 -40 L -70 -40 Z`} fill="#8CC8F5" opacity={0.7} />
        {[0, 1, 2].map((k) => {
          const a = t * 0.2 * run + k * 2.1;
          return <circle key={k} cx={Math.cos(a) * 34} cy={-96 + Math.sin(a) * 26} r={9 - k} fill={k === 1 ? '#F6EFE3' : '#E9A0A0'} />;
        })}
      </g>
      <path d="M -44 -150 Q -26 -166 0 -168" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.5} />
      {bow > 0 ? <Bow x={52} y={-258} s={0.8 * backOut(clamp(bow))} rot={8} /> : null}
    </g>
  );
};

/** A small generic hatchback (no brand), x the middle, y the ground; about 470 wide at s 1; a gift bow on the roof when `bow` > 0. */
export const SmallCar: React.FC<{ x: number; y: number; s?: number; t: number; bow?: number; flip?: boolean }> = ({ x, y, s = 1, t, bow = 1, flip = false }) => {
  const bounce = Math.sin(t * 0.18) * 1.2;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={6} rx={270} ry={20} fill="#000" opacity={0.45} />
      <g transform={`translate(0 ${bounce})`}>
        <path d="M -232 -32 L -232 -74 Q -230 -98 -196 -102 L -128 -108 Q -98 -168 -34 -172 L 84 -172 Q 140 -168 168 -112 L 206 -102 Q 236 -94 236 -62 L 236 -32 Z" fill="#4F8FC9" />
        <path d="M -232 -32 L -232 -74 Q -230 -98 -196 -102 L -128 -108 Q -98 -168 -34 -172 L -10 -172 L -10 -32 Z" fill="#3A74A8" opacity={0.55} />
        <path d="M -232 -52 L 236 -52 L 236 -32 L -232 -32 Z" fill="#2F5F8A" />
        <path d="M -104 -112 Q -80 -156 -34 -158 L 14 -158 L 14 -112 Z" fill="#BFE0F5" />
        <path d="M 40 -158 L 82 -158 Q 120 -154 142 -112 L 40 -112 Z" fill="#BFE0F5" />
        <path d="M -104 -112 Q -80 -156 -34 -158 L -20 -158 L -60 -112 Z" fill="#FFFFFF" opacity={0.35} />
        <path d="M 27 -170 L 27 -50" stroke="#2F5F8A" strokeWidth={4} />
        <rect x={-6} y={-92} width={26} height={7} rx={3} fill="#2F5F8A" />
        <rect x={58} y={-92} width={26} height={7} rx={3} fill="#2F5F8A" />
        <path d="M 222 -88 Q 236 -84 236 -66 L 214 -66 Z" fill="#FFF0B8" />
        <rect x={-232} y={-84} width={14} height={24} rx={4} fill="#D84A4A" />
        <path d="M 228 -150 Q 238 -120 236 -102" stroke="#FFD9A0" strokeWidth={4} fill="none" opacity={0.7} />
      </g>
      {[-140, 140].map((wx) => (
        <g key={wx} transform={`translate(${wx} -30)`}>
          <circle r={44} fill="#17151D" />
          <circle r={25} fill="#B9BFCB" />
          <circle r={9} fill="#6A7284" />
          {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={-2} y={-24} width={4} height={16} fill="#6A7284" transform={`rotate(${k * 72 + t * 8})`} />)}
        </g>
      ))}
      {bow > 0 ? <Bow x={-10 + 0} y={-176 + bounce} s={1.25 * backOut(clamp(bow))} rot={-4} /> : null}
    </g>
  );
};

/** A 1.000 đ coin that splits into 650 and 350 halves; `split` 0..1 (the red tax half slides out and drops). */
export const SplitCoin: React.FC<{ x: number; y: number; r?: number; split: number; t: number }> = ({ x, y, r = 190, split, t }) => {
  const k = easeOut(clamp(split));
  return (
    <g transform={`translate(${x} ${y + Math.sin(t * 0.12) * 4})`}>
      <g transform={`translate(${-k * 120} ${0})`}>
        <path d={`M 0 ${-r} A ${r} ${r} 0 0 0 0 ${r} Z`} fill="#F0C14B" stroke="#8A5E12" strokeWidth={8} strokeLinejoin="round" />
        <path d={`M 0 ${-r + 26} A ${r - 26} ${r - 26} 0 0 0 0 ${r - 26}`} fill="none" stroke="#FFE59A" strokeWidth={6} opacity={0.8} />
        <text x={-r * 0.46} y={14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={k > 0.2 ? 52 : 0} fill="#6B4508">{k > 0.2 ? '650 đ' : ''}</text>
      </g>
      <g transform={`translate(${k * 120} ${k * 40})`}>
        <path d={`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} Z`} fill="#E0554D" stroke="#7A1E1E" strokeWidth={8} strokeLinejoin="round" />
        <path d={`M 0 ${-r + 26} A ${r - 26} ${r - 26} 0 0 1 0 ${r - 26}`} fill="none" stroke="#FFB0A8" strokeWidth={6} opacity={0.7} />
        <text x={r * 0.46} y={14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={k > 0.2 ? 52 : 0} fill="#FFF3E6">{k > 0.2 ? '350 đ' : ''}</text>
      </g>
      <text x={0} y={22} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={84} fill="#6B4508" opacity={1 - clamp(k * 5)}>1.000 đ</text>
    </g>
  );
};
