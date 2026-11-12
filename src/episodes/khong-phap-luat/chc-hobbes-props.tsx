import React from 'react';
import { FONT, rnd, clamp, backOut, easeOut } from '../../engine';

// Chapter C props, "week one: hobbes" (look memory, sepia): the parchment ground, a respectful portrait sketch of Thomas Hobbes in an
// oval frame, his book LEVIATHAN, a writing quill, the lone figure on an empty hill, and the five stamped words. Pure functions of the clock.

export const INK = '#2E2018';
const GOLD = '#B8914A';

/** Aged paper filling the world (1920 x 1080, drawn a little larger), with fibres, foxing and burnt edges (`burn` 0..1). */
export const Parchment: React.FC<{ id: string; burn?: number; fibres?: number }> = ({ id, burn = 0.5, fibres = 60 }) => (
  <g>
    <defs>
      <radialGradient id={`${id}pg`} cx="0.5" cy="0.45" r="0.8">
        <stop offset="0" stopColor="#F0E2BC" /><stop offset="0.65" stopColor="#DCC896" /><stop offset="1" stopColor="#8A6A3E" stopOpacity={1} />
      </radialGradient>
      <radialGradient id={`${id}pb`} cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.55" stopColor="#2A160A" stopOpacity={0} /><stop offset="1" stopColor="#2A160A" stopOpacity={0.55 * burn + 0.2} />
      </radialGradient>
    </defs>
    <rect x={-200} y={-200} width={2320} height={1480} fill={`url(#${id}pg)`} />
    {Array.from({ length: fibres }).map((_, i) => (
      <path key={i} d={`M ${rnd(2, i) * 1920} ${rnd(3, i) * 1080} q ${(rnd(4, i) - 0.5) * 120} ${(rnd(5, i) - 0.5) * 40} ${(rnd(6, i) - 0.5) * 200} ${(rnd(7, i) - 0.5) * 60}`} stroke="#7A5A30" strokeWidth={1.5} fill="none" opacity={0.18} />
    ))}
    {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={rnd(8, i) * 1920} cy={rnd(9, i) * 1080} r={6 + rnd(10, i) * 22} fill="#9A6A34" opacity={0.1} />)}
    <rect x={-200} y={-200} width={2320} height={1480} fill={`url(#${id}pb)`} />
  </g>
);

/** The bust of Thomas Hobbes in an oval gilt frame, centre (x, y), about 360 x 470 at s 1: long hair, flat white collar, dark coat, moustache. */
export const HobbesPortrait: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={0} rx={190} ry={246} fill="#3A2A22" stroke={GOLD} strokeWidth={14} />
    <ellipse cx={0} cy={0} rx={176} ry={232} fill="none" stroke="#6A4A26" strokeWidth={4} />
    <clipPath id="hobbesClip"><ellipse cx={0} cy={0} rx={172} ry={228} /></clipPath>
    <g clipPath="url(#hobbesClip)">
      <rect x={-200} y={-250} width={400} height={500} fill="#5A4636" />
      <path d="M -190 250 L -170 130 Q -120 70 0 74 Q 120 70 170 130 L 190 250 Z" fill="#1E1816" />
      <path d="M -96 100 L 0 168 L 96 100 L 70 78 L 0 112 L -70 78 Z" fill="#F2ECE0" stroke={INK} strokeWidth={3} />
      <path d="M -26 70 H 26 V 106 Q 0 124 -26 106 Z" fill="#D8A878" stroke={INK} strokeWidth={3} />
      <path d="M -92 -44 Q -150 40 -112 150 Q -86 120 -78 40 Z" fill="#4A3426" stroke={INK} strokeWidth={3} />
      <path d="M 92 -44 Q 150 40 112 150 Q 86 120 78 40 Z" fill="#4A3426" stroke={INK} strokeWidth={3} />
      <ellipse cx={0} cy={-10} rx={80} ry={98} fill="#E4B890" stroke={INK} strokeWidth={4} />
      <path d="M -88 -34 Q -92 -112 0 -116 Q 92 -112 88 -34 Q 70 -78 0 -80 Q -70 -78 -88 -34 Z" fill="#4A3426" stroke={INK} strokeWidth={3} />
      <path d="M -46 -30 q 14 -10 30 -2 M 16 -32 q 16 -8 30 2" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={-30} cy={-16} r={5} fill={INK} /><circle cx={30} cy={-16} r={5} fill={INK} />
      <path d="M -6 -10 Q -10 14 4 18" stroke="#B08460" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M -44 32 Q -20 22 0 30 Q 20 22 44 32 Q 22 42 0 38 Q -22 42 -44 32 Z" fill="#5A4030" stroke={INK} strokeWidth={2} />
      <path d="M -14 54 Q 0 66 14 54" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  </g>
);

/** A feather quill: tip at (x, y) pointing down-left, `ink` drops hang from the nib. About 330 long at s 1. */
export const Quill: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number }> = ({ x, y, s = 1, rot = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 0 L 40 -26 Q 150 -190 300 -330 Q 270 -190 190 -90 Q 130 -30 60 -4 Z" fill="#F2ECE0" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 8 -4 Q 150 -120 290 -318" stroke="#B8A888" strokeWidth={3} fill="none" />
    {[60, 100, 140, 180, 220].map((k, i) => <path key={i} d={`M ${k} ${-k * 0.55 - 14} l ${40 - i * 3} ${-8 + i * 2}`} stroke="#B8A888" strokeWidth={2.5} fill="none" />)}
    <path d="M 0 0 L 10 -6 L 4 8 Z" fill={INK} />
    <circle cx={-2} cy={14 + 6 * Math.abs(Math.sin(t / 9))} r={3.5} fill={INK} />
  </g>
);

/** The book LEVIATHAN, closed and upright, centre of its base (x, y); 250 x 340 at s 1. */
export const LeviathanBook: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={10} cy={6} rx={160} ry={14} fill="#000" opacity={0.3} />
    <rect x={-120} y={-340} width={250} height={340} rx={8} fill="#5A2E22" stroke={INK} strokeWidth={5} />
    <rect x={-120} y={-340} width={34} height={340} rx={8} fill="#3E1E16" />
    {[-290, -170, -50].map((yy, i) => <rect key={i} x={-120} y={yy} width={34} height={8} fill={GOLD} />)}
    <rect x={-66} y={-308} width={178} height={276} rx={4} fill="none" stroke={GOLD} strokeWidth={5} />
    <rect x={-52} y={-250} width={150} height={78} rx={4} fill="#3E1E16" stroke={GOLD} strokeWidth={3} />
    <text x={23} y={-200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={25} fill="#E8C878" letterSpacing={2}>LEVIATHAN</text>
    <path d="M -30 -130 Q 23 -96 76 -130 M -20 -108 Q 23 -80 66 -108" stroke={GOLD} strokeWidth={3} fill="none" />
    <path d="M 100 4 L 104 40 L 112 30 L 120 40 L 118 4 Z" fill="#8A2A2A" stroke={INK} strokeWidth={2} />
  </g>
);

/** The name plate "THOMAS HOBBES · 1651": a cream ribbon with a gilt edge, centre (x, y). `p` 0..1 pops it in. */
export const NamePlate: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 1 }) => {
  const k = backOut(clamp(p));
  if (p <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${k * s})`}>
      <rect x={-300} y={-40} width={600} height={80} rx={8} fill="#F2E6C6" stroke={GOLD} strokeWidth={6} />
      <rect x={-290} y={-31} width={580} height={62} rx={4} fill="none" stroke="#6A4A26" strokeWidth={2} />
      <text x={0} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={INK} letterSpacing={3}>THOMAS HOBBES · 1651</text>
    </g>
  );
};

/** A stamped word: pops in at `t0` with an ink splat, centre (x, y). */
export const InkWord: React.FC<{ text: string; x: number; y: number; t: number; t0: number; size?: number; rot?: number; fade?: number }> = ({ text, x, y, t, t0, size = 200, rot = 0, fade = 0 }) => {
  const k = t - t0;
  if (k < 0) return null;
  const sc = backOut(clamp(k / 7));
  const splat = clamp(k / 10);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={1 - 0.5 * fade}>
      <text x={5} y={size * 0.34 + 5} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={size} fill="#000" opacity={0.2} letterSpacing={4}>{text}</text>
      <text x={0} y={size * 0.34} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={size} fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="round" letterSpacing={4}>{text}</text>
      {[-1, 0.2, 1.1].map((d, i) => <circle key={i} cx={d * size * 1.1} cy={size * (0.5 + 0.12 * i) * easeOut(splat)} r={5 + 3 * (i % 2)} fill={INK} opacity={0.7 * (1 - splat * 0.4)} />)}
    </g>
  );
};

/** An empty hill under heavy cloud with a fallen signpost and a dead tree; the lone figure goes on top (drawn by the shot). Ground at y 800. */
export const EmptyHill: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={2320} height={1100} fill="#C8B488" />
    <path d="M -200 330 Q 300 180 700 300 Q 1100 120 1500 280 Q 1800 200 2120 300 L 2120 -200 L -200 -200 Z" fill="#6A5640" opacity={0.7} />
    <path d="M -200 800 Q 400 640 900 720 Q 1400 640 2120 760 L 2120 1280 L -200 1280 Z" fill="#9A8460" stroke={INK} strokeWidth={5} />
    <path d="M -200 880 Q 500 790 1100 850 Q 1600 800 2120 880 L 2120 1280 L -200 1280 Z" fill="#7A6444" />
    <g transform="translate(1500 800)">
      <path d="M 0 0 L -10 -230 M -10 -230 L -90 -300 M -10 -170 L 70 -240 M -4 -110 L -60 -150" stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none" />
    </g>
    <g transform="translate(560 800) rotate(-18)">
      <rect x={-8} y={-190} width={16} height={190} fill="#5A4026" stroke={INK} strokeWidth={4} />
      <rect x={-86} y={-232} width={172} height={64} rx={5} fill="#D8C69A" stroke={INK} strokeWidth={4} transform="rotate(14 0 -200)" />
    </g>
    {[0, 1, 2].map((i) => {
      const k = ((t * 0.9 + i * 90) % 300) / 300;
      return <path key={i} d={`M ${-100 + k * 2200} ${240 + i * 46 + Math.sin(k * 20 + i) * 12} q 14 -14 28 0 q 14 -14 28 0`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />;
    })}
  </g>
);
