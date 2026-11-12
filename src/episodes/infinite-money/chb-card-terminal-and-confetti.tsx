import React from 'react';
import { clamp, kf, easeOut, backOut, rnd, FONT, UI } from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';

// Chapter B props (1/5): the power's prop kit. The matte black card (gold chip, thin gold infinity), the card
// terminal with its swipe grammar (tap, beep rings, green THANH TOÁN THÀNH CÔNG, balance ∞), confetti and a halo.
// Everything is a pure function of the frame counter it is given.

export const GOLD = '#C9A85A';

/** The infinity sign as a thin stroked path, about 80 wide at s 1, centred. */
export const InfinitySign: React.FC<{ x: number; y: number; s?: number; color?: string; w?: number; o?: number }> = ({ x, y, s = 1, color = GOLD, w = 5, o = 1 }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M 0 0 C 12 -26 42 -26 42 0 C 42 26 12 26 0 0 C -12 -26 -42 -26 -42 0 C -42 26 -12 26 0 0 Z"
    fill="none" stroke={color} strokeWidth={w} strokeLinejoin="round" opacity={o}
  />
);

/** The black card, 340 x 214 at s 1, centred. `shine` (0..1) sweeps a glint across it. */
export const BlackCard: React.FC<{ x: number; y: number; s?: number; rot?: number; shine?: number }> = ({ x, y, s = 1, rot = 0, shine = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <clipPath id="chbCardClip"><rect x={-170} y={-107} width={340} height={214} rx={22} /></clipPath>
    <rect x={-170} y={-107} width={340} height={214} rx={22} fill="#15131C" stroke="#3E3B4C" strokeWidth={3} />
    <path d="M -170 -20 Q -60 -90 40 -107 L 120 -107 Q 10 -60 -170 40 Z" fill="#fff" opacity={0.045} />
    <rect x={-132} y={-52} width={62} height={46} rx={9} fill={GOLD} />
    <path d="M -132 -29 H -70 M -101 -52 V -6 M -132 -40 H -118 M -132 -18 H -118 M -84 -40 H -70 M -84 -18 H -70" stroke="#8A6F2E" strokeWidth={2.4} />
    <InfinitySign x={72} y={42} s={1.15} />
    <rect x={-132} y={48} width={110} height={5} rx={2.5} fill={GOLD} opacity={0.55} />
    <rect x={-132} y={64} width={70} height={5} rx={2.5} fill={GOLD} opacity={0.35} />
    {shine > 0 ? (
      <g clipPath="url(#chbCardClip)" opacity={Math.sin(clamp(shine) * Math.PI) * 0.8}>
        <path transform={`translate(${-200 + shine * 400} 0) skewX(-22)`} d="M -14 -107 H 14 V 107 H -14 Z" fill="#FFF6D6" opacity={0.5} />
      </g>
    ) : null}
  </g>
);

/**
 * The card terminal, upright, 280 x 430 at s 1 (x, y = middle of its base). `k` = frames since the swipe began:
 * the card lands on the reader by k 8, the beep fires at k 10 (rings, flash), the green success shows from k 10.
 * `hand`: bring a mitten in from the upper right holding the card (an insert-size arm in screen units).
 */
export const CardTerminal: React.FC<{ x: number; y: number; s?: number; k: number; hand?: boolean; handScale?: number; lean?: number }> = ({
  x, y, s = 1, k, hand = true, handScale = 3.4, lean = 0,
}) => {
  const ok = k >= 10;
  const flash = k >= 10 && k < 16 ? 1 - (k - 10) / 6 : 0;
  const reading = k >= 5 && k < 10;
  // the card, in terminal-local coordinates: from up-right, onto the reader, then lifts away a little
  const cx = kf(k, [[-2, 250], [8, 20], [20, 30], [30, 150]], easeOut);
  const cy = kf(k, [[-2, -420], [8, -330], [12, -334], [20, -350], [30, -480]], easeOut);
  const crot = kf(k, [[-2, 24], [8, -2], [20, 4]], easeOut);
  const press = k >= 8 && k < 13 ? 0.96 : 1;
  const wx = x + cx * s;
  const wy = y + cy * s - 6 * s;
  return (
    <g>
      <g transform={`translate(${x} ${y}) rotate(${lean}) scale(${s})`}>
        <ellipse cx={0} cy={6} rx={170} ry={16} fill="#000" opacity={0.35} />
        <path d="M -128 0 L -150 -420 Q -150 -440 -130 -440 L 130 -440 Q 150 -440 150 -420 L 128 0 Z" fill="#2A2834" stroke="#0E0D14" strokeWidth={5} />
        <path d="M -150 -420 L -128 0 L -112 0 L -134 -420 Z" fill="#fff" opacity={0.08} />
        <rect x={-96} y={-410} width={192} height={150} rx={12} fill={ok ? '#12331F' : '#0E1626'} stroke="#0B0A10" strokeWidth={4} />
        {ok ? (
          <g>
            <circle cx={0} cy={-366} r={26} fill="#2FBF71" transform={`scale(${backOut(clamp((k - 10) / 6))})`} />
            <path d="M -12 -366 l 9 11 l 17 -22" stroke="#E9FFF2" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={clamp((k - 11) / 4)} />
            <text x={0} y={-312} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fontWeight={700} fill="#8DF0B4">PAYMENT</text>
            <text x={0} y={-290} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fontWeight={700} fill="#8DF0B4">APPROVED</text>
            <text x={0} y={-270} textAnchor="middle" fontFamily={FONT.ui} fontSize={15} fill={UI.text} opacity={0.8}>BALANCE: ∞</text>
          </g>
        ) : (
          <g>
            <text x={0} y={-340} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#7FB8FF" opacity={reading ? 0.6 + 0.4 * Math.sin(k) : 1}>{reading ? 'READING...' : 'READY'}</text>
            <rect x={-60} y={-318} width={120} height={6} rx={3} fill="#7FB8FF" opacity={0.3} />
          </g>
        )}
        {/* keypad */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={-84 + (i % 3) * 58} y={-236 + Math.floor(i / 3) * 52} width={46} height={38} rx={8} fill={i === 11 ? '#2FBF71' : i === 9 ? '#D94452' : '#46445A'} stroke="#0E0D14" strokeWidth={2.5} />
        ))}
        {/* the reader slot on top */}
        <rect x={-100} y={-440} width={200} height={10} rx={5} fill="#0E0D14" />
        {flash > 0 ? <rect x={-96} y={-410} width={192} height={150} rx={12} fill="#FFFFFF" opacity={flash * 0.35} /> : null}
        {/* the beep: rings from the top */}
        {k >= 10 && k < 28 ? [0, 1, 2].map((i) => {
          const q = clamp((k - 10 - i * 4) / 12);
          return q > 0 && q < 1 ? <path key={i} d={`M ${-60 - q * 60} ${-470 - q * 30} Q 0 ${-520 - q * 50} ${60 + q * 60} ${-470 - q * 30}`} fill="none" stroke="#9DEBB8" strokeWidth={6} strokeLinecap="round" opacity={1 - q} /> : null;
        }) : null}
      </g>
      <g transform={`translate(${wx} ${wy}) scale(${press})`}>
        {k > -2 ? <BlackCard x={0} y={0} s={0.5 * s * (hand ? 1.6 : 1)} rot={crot} shine={clamp((k - 4) / 14)} /> : null}
      </g>
      {hand && k > -2 && k < 34 ? <InsertArm x={wx + 40 * s} y={wy + 50 * s} fx={wx + 520 * s} fy={wy - 330 * s} rot={-20} s={handScale * s / 1.2} width={96 * s / 1.2} fist /> : null}
    </g>
  );
};

/** A screen-sized falling confetti field, looping on t. Pieces fall from y0 over h; w wide from x0. */
export const Confetti: React.FC<{ t: number; x0: number; y0: number; w: number; h: number; n?: number; seed?: number; speed?: number; o?: number }> = ({
  t, x0, y0, w, h, n = 40, seed = 3, speed = 3.4, o = 1,
}) => {
  const cols = ['#FF6A5A', '#FFD04D', '#58C77A', '#5FB4FF', '#E86AA6', '#F6F1E3'];
  return (
    <g opacity={o}>
      {Array.from({ length: n }).map((_, i) => {
        const sp = speed * (0.7 + rnd(seed, i + 40) * 0.8);
        const y = y0 + ((t * sp + rnd(seed, i) * h) % h);
        const x = x0 + rnd(seed, i + 9) * w + Math.sin(t / 9 + i * 1.7) * 26;
        const flip = Math.cos(t / 4 + i * 2.1);
        return (
          <rect key={i} x={-9} y={-5} width={18} height={10} rx={2} fill={cols[i % cols.length]}
            transform={`translate(${x} ${y}) rotate(${t * (3 + (i % 5)) + i * 40}) scale(1 ${Math.max(0.25, Math.abs(flip))})`} />
        );
      })}
    </g>
  );
};

/** A ring of confetti bits and sparkles orbiting a head at (x, y): the "kindest person" halo. */
export const ConfettiHalo: React.FC<{ x: number; y: number; r: number; t: number; n?: number }> = ({ x, y, r, t, n = 18 }) => {
  const cols = ['#FF6A5A', '#FFD04D', '#58C77A', '#5FB4FF', '#E86AA6', '#F6F1E3'];
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r * 1.05} ry={r * 0.32} fill="none" stroke="#FFE7A0" strokeWidth={5} opacity={0.5 + 0.2 * Math.sin(t / 6)} />
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + t / 28;
        const rr = r * (0.9 + 0.2 * rnd(5, i));
        const px = x + Math.cos(a) * rr * 1.05;
        const py = y + Math.sin(a) * rr * 0.32 + Math.sin(t / 7 + i) * 6;
        return <rect key={i} x={-8} y={-4.5} width={16} height={9} rx={2} fill={cols[i % cols.length]} transform={`translate(${px} ${py}) rotate(${t * 6 + i * 50})`} />;
      })}
    </g>
  );
};
