import React from 'react';
import { FONT, Glow } from '../../engine';

// Chapter E props: the xôi push cart (mum's, at the mouth of the alley), steam, generic banknotes (NOT the real
// design), the black card (matte, gold chip, thin gold infinity), the card terminal and a wallet. Origins: the cart
// at the ground centre; everything else at its own centre. All pure functions of the clock.

/** Rising steam: n wisps from (x, y); `t` is the clock, `h` how high they climb, `w` their width. */
export const Steam: React.FC<{ x: number; y: number; t: number; n?: number; h?: number; w?: number; o?: number; seed?: number }> = ({ x, y, t, n = 5, h = 150, w = 26, o = 0.5, seed = 0 }) => (
  <g filter="url(#blur6)">
    {Array.from({ length: n }).map((_, i) => {
      const ph = ((t * 0.55 + i * (60 / n) + seed * 13) % 60) / 60;
      const dx = Math.sin(ph * 6 + i * 2.1 + seed) * w;
      return <circle key={i} cx={x + dx + (i - n / 2) * 6} cy={y - ph * h} r={10 + ph * 26} fill="#FFF3DF" opacity={Math.sin(ph * Math.PI) * o} />;
    })}
  </g>
);

/** Mum's xôi cart, drawn at the same scale as a Hero of `scale` s (the counter sits at a standing person's belly). */
export const XoiCart: React.FC<{ x: number; y: number; s?: number; t: number; lantern?: boolean; flip?: boolean }> = ({ x, y, s = 1, t, lantern = true, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={0} rx={200} ry={14} fill="#000" opacity={0.3} />
    {/* lantern pole at the left */}
    {lantern ? (
      <g>
        <path d="M -168 -170 L -168 -360 Q -168 -380 -140 -380" stroke="#4A3226" strokeWidth={8} fill="none" strokeLinecap="round" />
        <ellipse cx={-140} cy={-352} rx={20} ry={26} fill="#FFB347" stroke="#7A3F18" strokeWidth={4} />
        <Glow x={-140} y={-352} r={170} o={0.5 + 0.06 * Math.sin(t / 7)} />
      </g>
    ) : null}
    {/* wheels */}
    {[-120, 120].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-38} r={38} fill="#26222C" stroke="#8A8794" strokeWidth={7} />
        <circle cx={wx} cy={-38} r={8} fill="#8A8794" />
        <path d={`M ${wx} -74 V -2 M ${wx - 36} -38 H ${wx + 36}`} stroke="#8A8794" strokeWidth={3} />
      </g>
    ))}
    {/* the box and its sign */}
    <rect x={-172} y={-170} width={344} height={108} rx={10} fill="#8B5A3C" stroke="#4A2E20" strokeWidth={5} />
    <rect x={-172} y={-100} width={344} height={38} rx={8} fill="#6E4430" opacity={0.7} />
    <rect x={-118} y={-152} width={236} height={64} rx={14} fill="#F2E3C0" stroke="#4A2E20" strokeWidth={4} />
    <text x={0} y={-103} textAnchor="middle" fontFamily={FONT.hand} fontSize={52} fill="#B8442E">XÔI NÓNG</text>
    <rect x={-182} y={-182} width={364} height={16} rx={6} fill="#B98557" stroke="#4A2E20" strokeWidth={4} />
    <rect x={-182} y={-182} width={364} height={5} rx={3} fill="#F2C48A" opacity={0.8} />
    {/* steamer pot with an ajar lid */}
    <path d="M -146 -182 L -134 -272 L -40 -272 L -28 -182 Z" fill="#C9CDD6" stroke="#4A4F5C" strokeWidth={4} />
    <path d="M -60 -272 L -40 -272 L -28 -182 L -50 -182 Z" fill="#9FA3AE" opacity={0.7} />
    <ellipse cx={-80} cy={-276} rx={60} ry={10} fill="#B8BCC8" stroke="#4A4F5C" strokeWidth={4} transform="rotate(-6 -80 -276)" />
    <circle cx={-84} cy={-290} r={7} fill="#4A4F5C" />
    {/* the tray of xôi: a golden mound with purple grains */}
    <ellipse cx={72} cy={-186} rx={78} ry={14} fill="#E7E2D3" stroke="#4A2E20" strokeWidth={3} />
    <path d="M -2 -190 Q 6 -246 72 -248 Q 138 -246 146 -190 Z" fill="#F4D35E" stroke="#B8902A" strokeWidth={3} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={i} cx={30 + i * 15} cy={-205 - ((i * 7) % 5) * 8} r={4} fill="#9B5FA8" opacity={0.8} />)}
    {/* leaf packets */}
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${150 + i * 8} ${-196 - i * 22})`}>
        <rect x={-18} y={-18} width={44} height={22} rx={8} fill="#4C9A52" stroke="#2B5E32" strokeWidth={3} />
        <path d="M -18 -7 H 26" stroke="#E9D8A0" strokeWidth={3} />
      </g>
    ))}
    <Steam x={-80} y={-284} t={t} n={6} h={170} w={22} o={0.55} />
    <Steam x={72} y={-250} t={t + 20} n={3} h={90} w={14} o={0.35} seed={3} />
  </g>
);

const NOTE_COL: Record<string, [string, string]> = { '10.000': ['#C8CF8E', '#8A9455'], '5.000': ['#8CC3D6', '#4F8AA0'] };

/** A generic banknote (not a real design): a value, a ring, a pattern band. `x y` is its centre, 220 x 110 at s = 1. */
export const Note: React.FC<{ x: number; y: number; v: '10.000' | '5.000'; s?: number; rot?: number; o?: number }> = ({ x, y, v, s = 1, rot = 0, o = 1 }) => {
  const [c, d] = NOTE_COL[v];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      <rect x={-110} y={-55} width={220} height={110} rx={9} fill="#1C1620" opacity={0.25} transform="translate(4 7)" />
      <rect x={-110} y={-55} width={220} height={110} rx={9} fill={c} stroke={d} strokeWidth={4} />
      <rect x={-98} y={-43} width={196} height={86} rx={5} fill="none" stroke={d} strokeWidth={2} opacity={0.8} />
      <circle cx={-52} cy={-4} r={30} fill={d} opacity={0.35} />
      <path d="M -52 -30 Q -30 -4 -52 22 Q -74 -4 -52 -30 Z" fill="none" stroke={d} strokeWidth={2.5} />
      <text x={34} y={-6} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#2B2E1E">{v}</text>
      <path d="M -10 20 H 90 M -10 30 H 70" stroke={d} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <path d="M -108 -50 L 108 -50" stroke="#fff" strokeWidth={2} opacity={0.35} />
    </g>
  );
};

/** The black card: matte, a gold chip, a thin gold infinity. 200 x 126 at s = 1; `glow` 0..1 adds a gold halo. */
export const BlackCard: React.FC<{ x: number; y: number; s?: number; rot?: number; glow?: number; shine?: number }> = ({ x, y, s = 1, rot = 0, glow = 0, shine = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {glow > 0 ? <Glow x={0} y={0} r={190} o={0.6 * glow} /> : null}
    <rect x={-100} y={-63} width={200} height={126} rx={14} fill="#16141D" stroke="#34313F" strokeWidth={3} style={glow > 0 ? { filter: `drop-shadow(0 0 ${10 + 14 * glow}px rgba(240,200,110,${0.7 * glow}))` } : undefined} />
    <path d="M -100 30 Q -20 10 100 -30 L 100 -45 Q 100 -63 82 -63 L 20 -63 Q -40 -10 -100 4 Z" fill="#fff" opacity={0.05} />
    <rect x={-74} y={-30} width={36} height={28} rx={5} fill="#C9A85A" stroke="#8A6E2A" strokeWidth={2} />
    <path d="M -74 -16 H -38 M -56 -30 V -2" stroke="#8A6E2A" strokeWidth={1.8} />
    <text x={52} y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={300} fontSize={64} fill="#C9A85A">∞</text>
    {shine > 0 ? <rect x={-100 + 200 * shine - 20} y={-63} width={26} height={126} fill="#FFE9A8" opacity={0.35} transform="skewX(-20)" /> : null}
  </g>
);

/** A card terminal seen head on, ~240 x 340 at s = 1. `ok` 0..1 turns the screen to the green THANH TOÁN THÀNH CÔNG. */
export const Terminal: React.FC<{ x: number; y: number; s?: number; ok?: number; t?: number }> = ({ x, y, s = 1, ok = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-170} width={240} height={340} rx={28} fill="#2B2B36" stroke="#14141C" strokeWidth={5} />
    <rect x={-120} y={-170} width={240} height={10} rx={5} fill="#fff" opacity={0.08} />
    <rect x={-96} y={-146} width={192} height={112} rx={10} fill={ok > 0.5 ? '#134A2C' : '#0F1B2A'} stroke="#0A0A10" strokeWidth={3} />
    {ok > 0.5 ? (
      <g>
        <circle cx={0} cy={-110} r={24} fill="#2FBF71" />
        <path d="M -11 -110 l 8 10 l 16 -20" stroke="#E9FFF2" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={0} y={-62} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={14} fill="#BFF5D6">THANH TOÁN THÀNH CÔNG</text>
      </g>
    ) : (
      <g>
        <text x={0} y={-82} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#7FD4FF" opacity={0.6 + 0.4 * Math.abs(Math.sin(t / 8))}>QUẸT THẺ</text>
        <path d="M -20 -112 q 20 -22 40 0 M -30 -100 q 30 -34 60 0" stroke="#7FD4FF" strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
      </g>
    )}
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-82 + (i % 3) * 58} y={-10 + Math.floor(i / 3) * 44} width={46} height={32} rx={7} fill="#4A4A58" stroke="#14141C" strokeWidth={2} />)}
  </g>
);

/** A wallet seen from above, open: leather, a stitched edge, card slots; `children` (the card) is drawn in its slot. */
export const Wallet: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={206} rx={330} ry={26} fill="#000" opacity={0.4} />
    <rect x={-300} y={-190} width={600} height={390} rx={34} fill="#6B4130" stroke="#2E1A12" strokeWidth={6} />
    <rect x={-300} y={-190} width={600} height={14} rx={7} fill="#C98B5E" opacity={0.5} />
    <rect x={-276} y={-166} width={552} height={342} rx={22} fill="none" stroke="#D9A878" strokeWidth={3} strokeDasharray="12 9" opacity={0.8} />
    <path d="M 0 -190 V 200" stroke="#2E1A12" strokeWidth={6} />
    <rect x={-262} y={-20} width={238} height={170} rx={10} fill="#573323" stroke="#2E1A12" strokeWidth={4} />
    <rect x={24} y={-20} width={238} height={170} rx={10} fill="#573323" stroke="#2E1A12" strokeWidth={4} />
    <rect x={-262} y={62} width={238} height={14} fill="#3E2318" opacity={0.7} />
    <rect x={24} y={62} width={238} height={14} fill="#3E2318" opacity={0.7} />
    {children}
  </g>
);
