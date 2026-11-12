import React from 'react';
import { clamp, easeOut, backOut, rnd, FONT } from '../../engine';

// Chapter B props (2/5): the breakfast inserts (xôi, cà phê phin), the paid-off loan contract with its stamp, and the
// red gift bow. Flat fills, a darker side, a warm rim, a contact shadow, in the engine's style.

/** Steam wisps rising from (x, y) (local), looping on t. */
export const Wisps: React.FC<{ x: number; y: number; t: number; s?: number; n?: number; o?: number }> = ({ x, y, t, s = 1, n = 3, o = 0.55 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="#fff" strokeLinecap="round" strokeWidth={6}>
    {Array.from({ length: n }).map((_, i) => {
      const p = (((t * 0.022 + i / n) % 1) + 1) % 1;
      return <path key={i} d={`M ${(i - (n - 1) / 2) * 30} ${-p * 110} q ${10 + Math.sin(t / 7 + i) * 8} -20 0 -40 q -10 -18 0 -34`} opacity={o * Math.sin(p * Math.PI)} />;
    })}
  </g>
);

/** Xôi: a banana-leaf plate with a mound of yellow sticky rice, fried shallots and a few mung-bean flecks. ~300 wide at s 1. */
export const XoiPlate: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={175} ry={20} fill="#000" opacity={0.32} />
    <ellipse cx={0} cy={-14} rx={168} ry={34} fill="#2F7A3C" stroke="#17481F" strokeWidth={4} />
    <path d="M -150 -14 Q 0 -4 150 -14 M -120 -28 Q 0 -18 120 -28" stroke="#4FA85A" strokeWidth={3} fill="none" opacity={0.7} />
    <path d="M -120 -24 Q -128 -118 0 -134 Q 128 -118 120 -24 Q 0 -4 -120 -24 Z" fill="#F4C84A" stroke="#9A6E12" strokeWidth={4} strokeLinejoin="round" />
    <path d="M 20 -128 Q 124 -112 118 -26 Q 86 -16 54 -18 Q 84 -70 20 -128 Z" fill="#C99A22" opacity={0.45} />
    {Array.from({ length: 22 }).map((_, i) => (
      <ellipse key={i} cx={-90 + rnd(2, i) * 180} cy={-120 + rnd(4, i) * 90} rx={7} ry={4.5} fill={i % 3 ? '#FFE48A' : '#E0A92E'} transform={`rotate(${rnd(6, i) * 180} ${-90 + rnd(2, i) * 180} ${-120 + rnd(4, i) * 90})`} opacity={0.85} />
    ))}
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={`f${i}`} x={-60 + rnd(8, i) * 120} y={-128 + rnd(9, i) * 40} width={14} height={5} rx={2.5} fill="#7A4A1C" transform={`rotate(${rnd(3, i) * 160 - 80} ${-60 + rnd(8, i) * 120} ${-124 + rnd(9, i) * 40})`} />
    ))}
    <Wisps x={0} y={-130} t={t} s={1.1} />
  </g>
);

/** Cà phê phin: a glass with white milk under dark coffee, the steel phin on top dripping. ~150 wide, 330 tall at s 1. */
export const CaPheGlass: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => {
  const drip = (((t * 0.045) % 1) + 1) % 1;
  const level = 0.5 + 0.5 * Math.min(1, t / 70);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={105} ry={14} fill="#000" opacity={0.32} />
      {/* glass */}
      <path d="M -66 -190 L -56 0 L 56 0 L 66 -190 Z" fill="#DDEEF2" opacity={0.28} stroke="#EAF6FA" strokeWidth={4} strokeLinejoin="round" />
      <path d={`M -56 0 L -${64 - 8 * (1 - level) * 0.4} ${-150 * level} L ${64 - 8 * (1 - level) * 0.4} ${-150 * level} L 56 0 Z`} fill="#4A2A18" />
      <path d="M -56 0 L -58 -44 L 58 -44 L 56 0 Z" fill="#F3E6C8" />
      <path d="M -58 -44 Q 0 -34 58 -44" stroke="#C99A62" strokeWidth={5} fill="none" />
      <path d="M -52 -170 L -48 -30" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.35} />
      {/* phin filter on the rim */}
      <rect x={-88} y={-206} width={176} height={16} rx={6} fill="#B9BDC8" stroke="#6A6E7C" strokeWidth={3} />
      <path d="M -74 -206 L -66 -270 L 66 -270 L 74 -206 Z" fill="#CFD3DC" stroke="#6A6E7C" strokeWidth={3} strokeLinejoin="round" />
      <path d="M -74 -206 L -66 -270 L -52 -270 L -58 -206 Z" fill="#fff" opacity={0.35} />
      <rect x={-80} y={-290} width={160} height={22} rx={8} fill="#B9BDC8" stroke="#6A6E7C" strokeWidth={3} />
      <rect x={-18} y={-318} width={36} height={30} rx={10} fill="#8E93A2" stroke="#6A6E7C" strokeWidth={3} />
      {/* drips */}
      {[0, 0.5].map((o, i) => {
        const q = (drip + o) % 1;
        return <ellipse key={i} cx={0} cy={-190 + q * 120 * level} rx={5} ry={8} fill="#4A2A18" opacity={q < 0.9 ? 1 : 0} />;
      })}
      <Wisps x={0} y={-322} t={t + 40} s={0.9} n={2} o={0.4} />
    </g>
  );
};

/** The contract seen from above: HỢP ĐỒNG VAY, a few lines, the bank's name; the stamp comes on from `k` frames (0 = slam). 460 x 620 at s 1. */
export const LoanContract: React.FC<{ x: number; y: number; s?: number; rot?: number; k: number }> = ({ x, y, s = 1, rot = 0, k }) => {
  const sl = clamp(k / 4);
  const stampS = k < 0 ? 0 : 1 + (1 - easeOut(sl)) * 1.6;
  const jolt = k >= 4 && k < 11 ? Math.sin(k * 3) * (11 - k) * 0.6 : 0;
  return (
    <g transform={`translate(${x} ${y + jolt}) rotate(${rot}) scale(${s})`}>
      <rect x={-216} y={-296} width={460} height={620} rx={6} fill="#000" opacity={0.28} />
      <rect x={-230} y={-310} width={460} height={620} rx={6} fill="#F6F1E3" stroke="#B9B09A" strokeWidth={3} />
      <rect x={-230} y={-310} width={460} height={62} fill="#2F5E8F" />
      <text x={-206} y={-268} fontFamily={FONT.ui} fontSize={26} fontWeight={700} fill="#E9F2FB" letterSpacing={3}>NGÂN HÀNG</text>
      <text x={0} y={-180} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fontWeight={700} fill="#2A2630" letterSpacing={1}>HỢP ĐỒNG VAY</text>
      <rect x={-190} y={-150} width={380} height={4} fill="#2A2630" opacity={0.6} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={-190} y={-110 + i * 38} width={i % 4 === 3 ? 240 : 380} height={9} rx={4.5} fill="#2A2630" opacity={0.2} />
      ))}
      <text x={-190} y={250} fontFamily={FONT.hand} fontSize={34} fill="#2A2630" opacity={0.7}>Nhà của bố mẹ</text>
      <path d="M -190 270 q 30 -34 60 0 t 60 0 t 60 0" stroke="#2F5E8F" strokeWidth={4} fill="none" opacity={0.7} />
      {k >= 0 ? (
        <g transform={`translate(10 90) rotate(-14) scale(${stampS})`} opacity={clamp(k / 2)}>
          <rect x={-190} y={-52} width={380} height={104} rx={12} fill="none" stroke="#D63C3C" strokeWidth={9} />
          <rect x={-178} y={-40} width={356} height={80} rx={8} fill="none" stroke="#D63C3C" strokeWidth={3} />
          <text x={0} y={16} textAnchor="middle" fontFamily={FONT.title} fontSize={54} fontWeight={800} fill="#D63C3C" letterSpacing={2}>ĐÃ TẤT TOÁN</text>
        </g>
      ) : null}
    </g>
  );
};

/** A big red gift bow (two loops, two tails, a knot), ~200 wide at s 1, centred on the knot; `pop` (frames since) scales it in. */
export const RedBow: React.FC<{ x: number; y: number; s?: number; rot?: number; pop?: number }> = ({ x, y, s = 1, rot = 0, pop = 99 }) => {
  const k = pop <= 0 ? 0 : backOut(clamp(pop / 8));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * k})`}>
      <path d="M -6 6 L -64 92 L -34 84 L -18 108 L 8 18 Z" fill="#B82E34" stroke="#701519" strokeWidth={3} strokeLinejoin="round" />
      <path d="M 6 6 L 64 92 L 34 84 L 18 108 L -8 18 Z" fill="#D63C3C" stroke="#701519" strokeWidth={3} strokeLinejoin="round" />
      <path d="M 0 0 C -30 -70 -110 -78 -104 -22 C -100 20 -40 20 0 0 Z" fill="#E4484A" stroke="#701519" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M 0 0 C 30 -70 110 -78 104 -22 C 100 20 40 20 0 0 Z" fill="#D63C3C" stroke="#701519" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M -20 -22 C -48 -48 -78 -44 -84 -26" stroke="#FF8A86" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
      <ellipse cx={0} cy={2} rx={22} ry={20} fill="#B82E34" stroke="#701519" strokeWidth={3} />
      <ellipse cx={-6} cy={-4} rx={9} ry={7} fill="#FF8A86" opacity={0.6} />
    </g>
  );
};

/** A ticket "MIỄN PHÍ" for the cinema, 360 x 150 at s 1. */
export const FreeTicket: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -180 -75 H 180 V -20 a 20 20 0 0 0 0 40 V 75 H -180 V 20 a 20 20 0 0 0 0 -40 Z" fill="#F6D04D" stroke="#8A6A10" strokeWidth={4} strokeLinejoin="round" />
    <path d="M 100 -75 V 75" stroke="#8A6A10" strokeWidth={3} strokeDasharray="8 8" />
    <text x={-40} y={-16} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fontWeight={700} fill="#5A4208" letterSpacing={4}>VÉ XEM PHIM</text>
    <text x={-50} y={40} textAnchor="middle" fontFamily={FONT.title} fontSize={50} fontWeight={800} fill="#D63C3C" letterSpacing={2}>MIỄN PHÍ</text>
    <text x={140} y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#5A4208" transform="rotate(90 140 0)">{'★ ★ ★'}</text>
  </g>
);

