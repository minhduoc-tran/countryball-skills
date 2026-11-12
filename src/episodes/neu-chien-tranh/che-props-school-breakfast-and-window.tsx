import React from 'react';
import { FONT, Glow, clamp, easeOut, backOut, rnd } from '../../engine';

// Chapter E props for the ending: a daytime school with a gate and a phượng tree, the wooden school drum (trống trường), a
// top-down breakfast table, and a dusk apartment block with one warm window. Pure functions of the shot clock t.

/** A cheerful daytime school: yellow wall, red tiled roof, a wide door, a phượng tree. (x, y) the ground, middle of the building. */
export const SchoolDay: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={720} ry={16} fill="#000" opacity={0.25} />
    <rect x={-640} y={-420} width={1280} height={420} fill="#F2D27A" stroke="#7A5A2A" strokeWidth={6} />
    <rect x={-640} y={-420} width={1280} height={420} fill="#B8863A" opacity={0.12} />
    <path d="M -680 -420 L -560 -520 H 560 L 680 -420 Z" fill="#B8453C" stroke="#5A221E" strokeWidth={6} />
    {[-520, -330, 330, 520].map((wx) => (
      <g key={wx}>
        <rect x={wx - 62} y={-340} width={124} height={130} fill="#8EC4DA" stroke="#5A4A2A" strokeWidth={6} />
        <path d={`M ${wx} -340 V -210 M ${wx - 62} -275 H ${wx + 62}`} stroke="#5A4A2A" strokeWidth={4} />
        <path d={`M ${wx - 50} -330 L ${wx - 10} -330 L ${wx - 50} -290 Z`} fill="#fff" opacity={0.35} />
      </g>
    ))}
    <rect x={-120} y={-250} width={240} height={250} fill="#6A4630" stroke="#3A2418" strokeWidth={6} />
    <path d="M 0 -250 V 0" stroke="#3A2418" strokeWidth={4} />
    <rect x={-220} y={-400} width={440} height={64} rx={10} fill="#2E7D4F" stroke="#F6EFE3" strokeWidth={4} />
    <text x={0} y={-352} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={44} fill="#F6EFE3" letterSpacing={6}>TRƯỜNG</text>
    <g transform="translate(-780 0)">
      <rect x={-12} y={-300} width={24} height={300} fill="#6A4630" />
      {[[-80, -330, 100], [70, -350, 110], [-10, -420, 100], [-130, -270, 70], [120, -280, 80]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx + Math.sin(t / 30 + i) * 3} cy={cy} r={r} fill={i % 2 ? '#D9453B' : '#E8604A'} />
      ))}
    </g>
  </g>
);

/** The school drum: a barrel on a wooden frame, red skin, brass studs; `hit` 0..1 is the drumstick strike this frame (rings out). */
export const SchoolDrum: React.FC<{ x: number; y: number; s?: number; hit?: number }> = ({ x, y, s = 1, hit = 0 }) => {
  const sq = 1 - 0.05 * hit;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={170} ry={16} fill="#000" opacity={0.3} />
      <path d="M -130 0 L -60 -150 M 130 0 L 60 -150" stroke="#5A3A24" strokeWidth={22} strokeLinecap="round" />
      <g transform={`translate(0 -250) scale(${sq} 1)`}>
        <ellipse cx={0} cy={0} rx={120} ry={120} fill="#B8453C" stroke="#5A221E" strokeWidth={8} />
        <path d="M -120 0 Q 0 40 120 0" fill="none" stroke="#5A221E" strokeWidth={5} opacity={0.5} />
        <circle cx={0} cy={0} r={96} fill="#E3C8A0" stroke="#5A3A24" strokeWidth={7} />
        <circle cx={-28} cy={-30} r={30} fill="#fff" opacity={0.18} />
        {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={Math.cos((i / 16) * 6.2832) * 108} cy={Math.sin((i / 16) * 6.2832) * 108} r={4.5} fill="#E9C46A" stroke="#7A5A1A" strokeWidth={1.5} />)}
      </g>
      {hit > 0 ? [0, 1, 2].map((i) => {
        const k = clamp(hit * 3 - i * 0.5);
        return k > 0 && k < 1 ? <circle key={i} cx={0} cy={-250} r={130 + 90 * i + 120 * k} fill="none" stroke="#FFE7B0" strokeWidth={7 * (1 - k)} opacity={1 - k} /> : null;
      }) : null}
      <g transform={`rotate(${-34 + 34 * hit} 190 -330)`}>
        <path d="M 190 -330 L 70 -330" stroke="#6A4630" strokeWidth={13} strokeLinecap="round" />
        <circle cx={66} cy={-330} r={13} fill="#6A4630" />
      </g>
      <Glow x={0} y={-250} r={260} o={0.18 + 0.2 * hit} />
    </g>
  );
};

/** A top-down breakfast table (the whole frame): xôi in a leaf, a bowl of porridge, iced coffee, a plate with an egg, chopsticks. */
export const BreakfastTop: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-100} y={-100} width={2120} height={1280} fill="#8A6244" />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M -100 ${i * 90 - 40} Q 960 ${i * 90 - 70 + (i % 3) * 14} 2020 ${i * 90 - 30}`} stroke="#6E4A30" strokeWidth={3} opacity={0.5} fill="none" />)}
    <rect x={-100} y={-100} width={2120} height={1280} fill="#FFD9A0" opacity={0.08} />
    {/* leaf packet of xôi, open */}
    <g transform="translate(560 470)">
      <ellipse cx={8} cy={12} rx={190} ry={140} fill="#000" opacity={0.25} />
      <path d="M -190 0 Q -120 -140 0 -140 Q 130 -140 190 0 Q 130 140 0 140 Q -120 140 -190 0 Z" fill="#4C9A52" stroke="#2B5E32" strokeWidth={6} />
      <path d="M -170 0 H 170" stroke="#2B5E32" strokeWidth={4} opacity={0.5} />
      <ellipse cx={0} cy={0} rx={120} ry={84} fill="#F4D35E" stroke="#B8902A" strokeWidth={5} />
      {Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={(rnd(3, i) - 0.5) * 190} cy={(rnd(4, i) - 0.5) * 120} r={7} fill="#9B5FA8" opacity={0.8} />)}
    </g>
    {/* bowl of porridge with steam */}
    <g transform="translate(1100 400)">
      <ellipse cx={6} cy={10} rx={170} ry={160} fill="#000" opacity={0.25} />
      <circle r={160} fill="#F6EFE3" stroke="#7A8CA0" strokeWidth={8} />
      <circle r={126} fill="#EADCC0" stroke="#C9B890" strokeWidth={4} />
      <circle r={110} fill="#F4E8CC" />
      {Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx={(rnd(8, i) - 0.5) * 140} cy={(rnd(9, i) - 0.5) * 140} rx={11} ry={5} fill="#fff" opacity={0.8} transform={`rotate(${i * 31} 0 0)`} />)}
      <circle cx={30} cy={-20} r={20} fill="#6E9A4A" opacity={0.8} /><circle cx={-40} cy={36} r={14} fill="#C9553E" opacity={0.8} />
      <g filter="url(#blur6)">
        {[0, 1, 2, 3].map((i) => {
          const ph = ((t * 0.5 + i * 15) % 60) / 60;
          return <circle key={i} cx={Math.sin(ph * 6 + i) * 30 - 20 + i * 14} cy={-ph * 90} r={20 + ph * 34} fill="#FFF3DF" opacity={Math.sin(ph * Math.PI) * 0.5} />;
        })}
      </g>
    </g>
    {/* iced coffee seen from above */}
    <g transform="translate(1470 560)">
      <ellipse cx={6} cy={10} rx={96} ry={96} fill="#000" opacity={0.25} />
      <circle r={90} fill="#DFF0F4" stroke="#F6FBFF" strokeWidth={6} opacity={0.9} />
      <circle r={76} fill="#6B3E24" />
      {[[-28, -20], [22, -30], [-10, 26], [30, 20]].map(([cx, cy], i) => <rect key={i} x={cx - 15} y={cy - 15} width={30} height={30} rx={5} fill="#F6FBFF" opacity={0.6} transform={`rotate(${i * 21 + t * 0.2} ${cx} ${cy})`} />)}
      <path d="M 10 -10 L 70 -80" stroke="#E9654B" strokeWidth={9} strokeLinecap="round" />
    </g>
    {/* a plate with a fried egg, and chopsticks */}
    <g transform="translate(900 800)">
      <ellipse cx={6} cy={10} rx={176} ry={136} fill="#000" opacity={0.25} />
      <ellipse rx={170} ry={130} fill="#F6EFE3" stroke="#B8C0CC" strokeWidth={6} />
      <ellipse cx={-30} cy={-6} rx={80} ry={60} fill="#fff" stroke="#E0DCD0" strokeWidth={3} />
      <circle cx={-30} cy={-6} r={26} fill="#F2B33D" /><circle cx={-38} cy={-14} r={8} fill="#FFE9A0" opacity={0.8} />
      <path d="M 40 40 Q 90 20 120 30" stroke="#5A8A3A" strokeWidth={9} fill="none" strokeLinecap="round" />
    </g>
    <path d="M 1180 840 L 1620 760 M 1190 880 L 1630 800" stroke="#D8B88A" strokeWidth={11} strokeLinecap="round" />
    <path d="M 1180 840 L 1620 760 M 1190 880 L 1630 800" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.25} />
  </g>
);

/** A dusk apartment block, front on: dark with lit windows; the window at (wx, wy) is the warm one with a family in it. */
export const DuskBlock: React.FC<{ t: number; wx: number; wy: number }> = ({ t, wx, wy }) => (
  <g>
    <rect x={-600} y={-500} width={3120} height={1900} fill="#2A2038" />
    <rect x={-100} y={-500} width={2120} height={600} fill="#7A4A6A" opacity={0.35} />
    {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 9 }).map((__, c) => {
      const x = 170 + c * 190;
      const y = 80 + r * 150;
      const warm = rnd(r + 3, c + 7) > 0.62;
      if (Math.abs(x - wx) < 5 && Math.abs(y - wy) < 5) return null;
      return (
        <g key={`${r}-${c}`}>
          <rect x={x - 54} y={y - 46} width={108} height={92} fill={warm ? '#FFC970' : '#1A1626'} opacity={warm ? 0.55 + 0.1 * Math.sin(t / 20 + c) : 1} stroke="#120E1C" strokeWidth={5} />
          <path d={`M ${x} ${y - 46} V ${y + 46}`} stroke="#120E1C" strokeWidth={3} />
        </g>
      );
    }))}
    <g>
      <Glow x={wx} y={wy} r={300} o={0.7} />
      <rect x={wx - 70} y={wy - 60} width={140} height={120} fill="#FFD280" stroke="#120E1C" strokeWidth={6} />
      <path d={`M ${wx - 70} ${wy + 60} H ${wx + 70}`} stroke="#120E1C" strokeWidth={4} />
      {/* three silhouettes at the table inside */}
      {[[-32, 22, 1], [4, 18, 1.05], [38, 34, 0.7]].map(([dx, dy, k], i) => (
        <g key={i} transform={`translate(${wx + dx} ${wy + dy + Math.sin(t / 12 + i) * 1.2}) scale(${k})`} fill="#7A4A2A">
          <circle cy={-22} r={13} /><path d="M -16 22 Q -16 -8 0 -8 Q 16 -8 16 22 Z" />
        </g>
      ))}
    </g>
  </g>
);

/** The pop-in of a text line from t0 (a backOut scale about its own anchor). */
export const popK = (t: number, t0: number) => backOut(clamp((t - t0) / 9));
export const fadeK = (t: number, t0: number, d = 8) => easeOut(clamp((t - t0) / d));
