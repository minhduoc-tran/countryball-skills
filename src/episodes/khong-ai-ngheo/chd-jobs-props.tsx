import React from 'react';
import { FONT, clamp, easeOut, backOut, rnd } from '../../engine';

// Chapter D, "hard jobs" props: the help-wanted board whose wages tick up, a garbage truck (side view), a phở bowl
// and a shirt on a hanger. All flat fills + dark outline, pure functions of their props.

const INK = '#1D2033';

const NOTICES: { job: string; from: number; to: number; c: string }[] = [
  { job: 'QUÉT ĐƯỜNG', from: 6, to: 9, c: '#F4E7C8' },
  { job: 'THU GOM RÁC', from: 7, to: 11, c: '#E9F0D4' },
  { job: 'HÁI CÀ PHÊ', from: 6, to: 10, c: '#F6DCCB' },
  { job: 'BỐC VÁC', from: 7, to: 10, c: '#DDEBF2' },
  { job: 'THỢ HỒ', from: 8, to: 12, c: '#F4E7C8' },
  { job: 'ĐÁNH CÁ', from: 6, to: 9, c: '#E9F0D4' },
];

/** One help-wanted paper, 300 x 230 at s 1, centred. `up` 0..1 runs the wage from its old to its new value. */
export const Notice: React.FC<{ x: number; y: number; rot?: number; s?: number; job: string; from: number; to: number; c: string; up: number; t: number }> = ({
  x, y, rot = 0, s = 1, job, from, to, c, up, t,
}) => {
  const v = Math.round(from + (to - from) * easeOut(clamp(up)));
  const moving = up > 0 && up < 1;
  const arrow = clamp(up * 4);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + Math.sin(t / 11 + x) * 0.8}) scale(${s})`}>
      <rect x={-146} y={-104} width={300} height={230} rx={6} fill="#000" opacity={0.28} />
      <rect x={-150} y={-115} width={300} height={230} rx={6} fill={c} stroke={INK} strokeWidth={4} />
      <rect x={-150} y={-115} width={300} height={52} rx={6} fill="#D9473A" />
      <text x={0} y={-76} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#FFF6E6" letterSpacing={2}>TUYỂN GẤP</text>
      <text x={0} y={-24} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={42} fill={INK}>{job}</text>
      <text x={-34} y={64} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={moving ? 84 : 78} fill={moving ? '#1E8F4E' : INK}>{v} TR</text>
      <g opacity={arrow} transform={`translate(112 ${40 - Math.sin(t / 5) * 4})`}>
        <path d="M 0 22 V -22 M -17 -5 L 0 -24 L 17 -5" stroke="#1E8F4E" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx={0} cy={-115} r={9} fill="#D9473A" stroke={INK} strokeWidth={3} />
    </g>
  );
};

/** The board: wood frame, cork, six notices whose wages tick up one after another (up 0..1 over the whole board). */
export const JobBoard: React.FC<{ x: number; y: number; s?: number; up: number; t: number }> = ({ x, y, s = 1, up, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={420} rx={560} ry={26} fill="#000" opacity={0.35} />
    <rect x={-420} y={250} width={26} height={170} fill="#4A3226" />
    <rect x={394} y={250} width={26} height={170} fill="#4A3226" />
    <rect x={-540} y={-290} width={1080} height={560} rx={16} fill="#6B4630" stroke="#2E1D14" strokeWidth={6} />
    <rect x={-516} y={-266} width={1032} height={512} rx={8} fill="#B98A5A" stroke="#7A5532" strokeWidth={4} />
    {Array.from({ length: 60 }).map((_, i) => (
      <circle key={i} cx={-500 + rnd(5, i) * 1000} cy={-250 + rnd(6, i) * 480} r={2 + rnd(7, i) * 3} fill="#8A6038" opacity={0.6} />
    ))}
    {NOTICES.map((n, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const k = clamp(up * 1.8 - i * 0.12);
      return <Notice key={n.job} x={-340 + col * 340} y={-120 + row * 250} rot={(rnd(11, i) - 0.5) * 6} s={0.96} {...n} up={k} t={t + i * 7} />;
    })}
  </g>
);

/** A garbage truck from the side, facing left: cab on the left, the hopper at the back (right). ~560 wide at s 1; x y = ground below the middle. */
export const GarbageTruck: React.FC<{ x: number; y: number; s?: number; t: number; lift?: number }> = ({ x, y, s = 1, t, lift = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={330} ry={18} fill="#000" opacity={0.35} />
    <rect x={-300} y={-250} width={170} height={170} rx={22} fill="#E9B12E" stroke={INK} strokeWidth={5} />
    <path d="M -300 -230 L -230 -230 L -230 -150 L -300 -150 Z" fill="#9FD3E8" stroke={INK} strokeWidth={4} />
    <rect x={-150} y={-300} width={440} height={220} rx={16} fill="#3E8C5A" stroke={INK} strokeWidth={5} />
    <rect x={-150} y={-300} width={440} height={16} rx={8} fill="#fff" opacity={0.18} />
    <path d="M 290 -300 L 300 -300 L 300 -80 L 290 -80 Z" fill="#2F6E45" stroke={INK} strokeWidth={4} />
    <rect x={-150} y={-100} width={440} height={30} fill="#2B2B35" />
    {/* the hopper lip at the back */}
    <path d="M 230 -300 L 330 -330 L 330 -230 L 290 -230" fill="#2F6E45" stroke={INK} strokeWidth={4} />
    <rect x={-110} y={-230} width={270} height={64} rx={8} fill="#FFF6E6" opacity={0.95} />
    <text x={25} y={-185} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#2F6E45" letterSpacing={3}>MÔI TRƯỜNG</text>
    {[-210, -20, 210].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-48} r={50} fill="#23222B" stroke={INK} strokeWidth={5} />
        <circle cx={wx} cy={-48} r={20} fill="#9A98A4" />
        <path d={`M ${wx} -48 l ${Math.cos(t / 3) * 18} ${Math.sin(t / 3) * 18}`} stroke="#23222B" strokeWidth={4} />
      </g>
    ))}
    <rect x={296} y={-120 - lift} width={22} height={70} rx={6} fill="#D9473A" stroke={INK} strokeWidth={3} />
    <circle cx={-296} cy={-100} r={11} fill="#FFE27A" stroke={INK} strokeWidth={3} />
  </g>
);

/** A bin bag with a knot. */
export const Bag: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -34 40 Q -50 -6 -18 -26 L -10 -42 L 12 -42 L 18 -26 Q 50 -6 34 40 Z" fill="#2E3340" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -16 -44 Q 0 -66 18 -44" fill="#2E3340" stroke={INK} strokeWidth={4} />
    <path d="M -22 -2 Q -14 -12 -8 -6" stroke="#fff" strokeOpacity={0.3} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

/** A bowl of phở from a high three-quarter view: broth, noodles, beef, herbs, chopsticks, steam. Centred, ~520 wide. */
export const PhoBowl: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={150} rx={300} ry={44} fill="#000" opacity={0.35} />
    <path d="M -290 -20 Q -280 150 0 168 Q 280 150 290 -20 Z" fill="#F2EEE6" stroke={INK} strokeWidth={6} />
    <path d="M -270 80 Q 0 130 270 80" stroke="#3E8C86" strokeWidth={10} fill="none" />
    <path d="M -70 160 H 70 L 60 190 H -60 Z" fill="#E4DED2" stroke={INK} strokeWidth={5} />
    <ellipse cx={0} cy={-20} rx={290} ry={86} fill="#F2EEE6" stroke={INK} strokeWidth={6} />
    <ellipse cx={0} cy={-14} rx={262} ry={70} fill="#D8A24C" stroke="#9A6A22" strokeWidth={4} />
    <ellipse cx={0} cy={-10} rx={190} ry={44} fill="#F3E6C4" opacity={0.95} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={i} d={`M ${-160 + i * 52} -26 q 24 -22 52 0 q -26 14 -52 0`} fill="none" stroke="#D8C28A" strokeWidth={5} />
    ))}
    {[[-110, -16, -12], [-20, -34, 8], [78, -8, -20], [20, 8, 14]].map(([bx, by, r], i) => (
      <g key={i} transform={`translate(${bx} ${by}) rotate(${r})`}>
        <ellipse rx={54} ry={20} fill="#B5614A" stroke="#7A3A2C" strokeWidth={4} />
        <ellipse cx={-8} cy={-4} rx={30} ry={8} fill="#D98A70" />
      </g>
    ))}
    {[[-170, -30], [150, -34], [120, 24], [-150, 22]].map(([hx, hy], i) => (
      <ellipse key={i} cx={hx} cy={hy} rx={26} ry={12} fill={i % 2 ? '#3E9A55' : '#6DBE5A'} stroke="#245F34" strokeWidth={3} transform={`rotate(${(i - 1.5) * 24} ${hx} ${hy})`} />
    ))}
    <path d="M -120 -60 L -330 -250 M -150 -52 L -360 -226" stroke="#C99A5E" strokeWidth={9} strokeLinecap="round" />
    <g filter="url(#blur6)">
      {Array.from({ length: 5 }).map((_, i) => {
        const ph = ((t * 0.5 + i * 12) % 60) / 60;
        return <circle key={i} cx={-150 + i * 75 + Math.sin(ph * 6 + i) * 22} cy={-60 - ph * 200} r={16 + ph * 28} fill="#FFF3DF" opacity={Math.sin(ph * Math.PI) * 0.55} />;
      })}
    </g>
  </g>
);

/** A T-shirt on a hanger, ~300 wide, hook at (0, -230). */
export const Shirt: React.FC<{ x: number; y: number; s?: number; rot?: number; c?: string }> = ({ x, y, s = 1, rot = 0, c = '#E8715A' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot} 0 -230) scale(${s})`}>
    <path d="M 0 -232 q 0 -26 18 -28 q 18 0 14 18" stroke="#9A98A4" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M -22 -176 L 0 -216 L 22 -176" stroke="#9A98A4" strokeWidth={6} fill="none" strokeLinejoin="round" />
    <path d="M -34 -178 Q 0 -150 34 -178 L 130 -140 L 108 -66 L 70 -86 L 70 100 L -70 100 L -70 -86 L -108 -66 L -130 -140 Z" fill={c} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -34 -178 Q 0 -134 34 -178" fill="none" stroke={INK} strokeWidth={5} />
    <path d="M -56 -60 V 90" stroke="#fff" strokeOpacity={0.2} strokeWidth={14} strokeLinecap="round" />
  </g>
);

/** The little pop of an up-arrow chip beside a price that rose. `k` 0..1. */
export const UpChip: React.FC<{ x: number; y: number; k: number; s?: number; c?: string }> = ({ x, y, k, s = 1, c = '#D9473A' }) => (
  k <= 0 ? null : (
    <g transform={`translate(${x} ${y - Math.sin(k * 3) * 6}) scale(${backOut(clamp(k * 3)) * s})`}>
      <circle r={42} fill={c} stroke={INK} strokeWidth={5} />
      <path d="M 0 20 V -18 M -16 -4 L 0 -22 L 16 -4" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
);
