import React from 'react';
import { FONT, clamp, backOut } from '../../engine';

// Chapter E: the respectful portrait sketch of Elinor Ostrom (an older woman, short grey hair, glasses, a warm smile),
// the sketchbook paper behind her, her name label and the Nobel medal. A simple drawn portrait, never a caricature.

const INK = '#4A3326';

/** Sketchbook paper: warm cream, a faint diagonal hatch, a soft vignette. Fills the whole frame. */
export const SketchPaper: React.FC<{ id: string; dark?: boolean }> = ({ id, dark = false }) => (
  <g>
    <defs>
      <radialGradient id={`${id}pg`} cx="0.5" cy="0.45" r="0.8"><stop offset="0" stopColor={dark ? '#C9A872' : '#F3E6C8'} /><stop offset="1" stopColor={dark ? '#6E4A2E' : '#CDB083'} /></radialGradient>
      <pattern id={`${id}ph`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M 0 0 V 22" stroke={INK} strokeWidth={1.4} opacity={0.09} /></pattern>
    </defs>
    <rect x={-200} y={-200} width={2320} height={1480} fill={`url(#${id}pg)`} />
    <rect x={-200} y={-200} width={2320} height={1480} fill={`url(#${id}ph)`} />
  </g>
);

/** Her bust, centred on the middle of the face (0, 0); about 460 wide, shoulders to y = 330. `t` breathes and blinks. */
export const OstromPortrait: React.FC<{ t: number; x: number; y: number; s?: number; medal?: boolean }> = ({ t, x, y, s = 1, medal = true }) => {
  const breathe = Math.sin(t / 22) * 3;
  const blink = t % 96 >= 90 ? 0.12 : 1;
  const tilt = Math.sin(t / 34) * 1.4;
  return (
    <g transform={`translate(${x} ${y + breathe}) scale(${s})`} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx={0} cy={338} rx={250} ry={22} fill="#000" opacity={0.18} />
      {/* jacket, blouse, collar */}
      <path d="M -235 340 Q -230 175 -112 150 L 112 150 Q 230 175 235 340 Z" fill="#3E5C70" stroke={INK} strokeWidth={5} />
      <path d="M -66 150 L 0 262 L 66 150 Z" fill="#F4EBD8" stroke={INK} strokeWidth={4} />
      <path d="M -112 150 L -30 300 L -64 150 Z M 112 150 L 30 300 L 64 150 Z" fill="#2E4A5C" stroke={INK} strokeWidth={4} />
      <path d="M -150 190 Q -190 260 -196 330" stroke="#5A7C92" strokeWidth={5} fill="none" opacity={0.6} />
      {/* neck */}
      <path d="M -44 88 L -44 160 Q 0 196 44 160 L 44 88 Z" fill="#D8AE88" stroke={INK} strokeWidth={4} />
      {medal ? (
        <g>
          <path d="M -50 150 L -4 296 L 18 290 L -26 150 Z" fill="#2F6FB0" stroke={INK} strokeWidth={3} />
          <path d="M 26 150 L -18 290 L 6 296 L 52 150 Z" fill="#F2C94C" stroke={INK} strokeWidth={3} />
          <circle cx={0} cy={318} r={34} fill="#E9B93A" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={318} r={24} fill="none" stroke="#9A6E14" strokeWidth={3} />
          <circle cx={-9} cy={309} r={7} fill="#FFF3B0" opacity={0.8} />
        </g>
      ) : null}
      <g transform={`rotate(${tilt})`}>
        {/* ears, head */}
        <ellipse cx={-102} cy={6} rx={15} ry={26} fill="#E2B992" stroke={INK} strokeWidth={4} />
        <ellipse cx={102} cy={6} rx={15} ry={26} fill="#E2B992" stroke={INK} strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={100} ry={120} fill="#EBC8A4" stroke={INK} strokeWidth={5} />
        <path d="M -60 90 Q 0 140 60 90 Q 40 128 0 132 Q -40 128 -60 90 Z" fill="#D8AE88" opacity={0.5} />
        {/* short grey hair */}
        <path d="M -112 -4 Q -132 -138 0 -146 Q 134 -138 112 -4 Q 108 -62 64 -88 Q 6 -66 -48 -92 Q -100 -68 -112 -4 Z" fill="#CBCDD6" stroke="#7E808C" strokeWidth={5} />
        <path d="M -70 -104 Q -20 -128 40 -112 M 10 -128 Q 60 -126 90 -92 M -96 -60 Q -100 -90 -80 -108" stroke="#9A9CA8" strokeWidth={4} fill="none" />
        {/* brows, eyes behind the lenses, nose, smile, laugh lines */}
        <path d="M -78 -44 Q -46 -62 -16 -46 M 16 -46 Q 46 -62 78 -44" stroke="#8E909C" strokeWidth={6} fill="none" />
        <g transform={`translate(0 -4)`}>
          <ellipse cx={-42} cy={0} rx={8} ry={8 * blink} fill="#2A2230" />
          <ellipse cx={42} cy={0} rx={8} ry={8 * blink} fill="#2A2230" />
        </g>
        <circle cx={-42} cy={-4} r={34} fill="#FFFFFF" opacity={0.14} stroke="#3A3340" strokeWidth={6} />
        <circle cx={42} cy={-4} r={34} fill="#FFFFFF" opacity={0.14} stroke="#3A3340" strokeWidth={6} />
        <path d="M -8 -8 Q 0 -16 8 -8 M -76 -10 L -100 -16 M 76 -10 L 100 -16" stroke="#3A3340" strokeWidth={5} fill="none" />
        <path d="M -52 -24 L -36 -34 M 36 -34 L 52 -24" stroke="#fff" strokeWidth={5} opacity={0.55} />
        <path d="M 0 10 Q -12 46 8 52" stroke={INK} strokeWidth={4} fill="none" />
        <path d="M -38 70 Q 0 100 38 70 Q 0 84 -38 70 Z" fill="#B85858" stroke={INK} strokeWidth={4} />
        <path d="M -62 40 Q -70 62 -52 78 M 62 40 Q 70 62 52 78 M -84 12 L -96 22 M 84 12 L 96 22" stroke="#A98163" strokeWidth={3} fill="none" opacity={0.8} />
        <ellipse cx={-62} cy={52} rx={16} ry={9} fill="#E58C84" opacity={0.35} />
        <ellipse cx={62} cy={52} rx={16} ry={9} fill="#E58C84" opacity={0.35} />
      </g>
    </g>
  );
};

/** The name plate under the portrait: ELINOR OSTROM, with the medal line under it. `t` pops it in at `t0`. */
export const NameLabel: React.FC<{ x: number; y: number; t: number; t0?: number; sub?: boolean; k?: number }> = ({ x, y, t, t0 = 6, sub = true, k = 1 }) => {
  const p = backOut(clamp((t - t0) / 9));
  return (
    <g transform={`translate(${x} ${y}) scale(${p * k})`}>
      <rect x={-330} y={-52} width={660} height={sub ? 150 : 100} rx={22} fill="#2A1830" opacity={0.9} />
      <rect x={-330} y={-52} width={660} height={sub ? 150 : 100} rx={22} fill="none" stroke="#FFE27A" strokeWidth={5} />
      <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={68} letterSpacing={3} fill="#FFF3D6">ELINOR OSTROM</text>
      {sub ? <text y={78} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} letterSpacing={3} fill="#FFE27A">NOBEL KINH TẾ 2009</text> : null}
    </g>
  );
};

/** The Nobel medal on its ribbon, hanging from (x, y) (the ribbon's top) and swinging; r is the medal's radius. */
export const NobelMedal: React.FC<{ x: number; y: number; t: number; s?: number; swing?: number }> = ({ x, y, t, s = 1, swing = 7 }) => {
  const a = Math.sin(t / 7) * swing * Math.exp(-t / 70);
  const shine = ((t % 60) / 60) * 260 - 80;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${a})`} strokeLinejoin="round">
      <path d="M -70 0 L 0 330 L 36 322 L -30 0 Z" fill="#2F6FB0" stroke={INK} strokeWidth={5} />
      <path d="M 70 0 L 0 330 L -36 322 L 30 0 Z" fill="#F2C94C" stroke={INK} strokeWidth={5} />
      <circle cx={0} cy={420} r={118} fill="#E9B93A" stroke={INK} strokeWidth={6} />
      <circle cx={0} cy={420} r={96} fill="#F4CE62" stroke="#9A6E14" strokeWidth={5} />
      <circle cx={0} cy={420} r={78} fill="none" stroke="#B8861C" strokeWidth={3} strokeDasharray="4 10" />
      {/* a stylised laurel and a star as the engraving */}
      <path d="M -44 450 Q -62 410 -40 372 M 44 450 Q 62 410 40 372" stroke="#9A6E14" strokeWidth={7} fill="none" />
      <path d="M 0 372 L 11 405 L 46 405 L 18 425 L 28 458 L 0 438 L -28 458 L -18 425 L -46 405 L -11 405 Z" fill="#B8861C" />
      <clipPath id="e2medalclip"><circle cx={0} cy={420} r={118} /></clipPath>
      <g clipPath="url(#e2medalclip)"><rect x={shine - 20} y={290} width={34} height={260} fill="#FFFFFF" opacity={0.45} transform={`rotate(20 ${shine} 420)`} /></g>
    </g>
  );
};
