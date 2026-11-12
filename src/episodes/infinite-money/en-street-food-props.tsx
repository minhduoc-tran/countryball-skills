import React from 'react';
import { FONT, UI, clamp, easeOut, backOut, rnd, Kid, KidLook, Glow } from '../../engine';

// Chapter B, local props for the street scenes: a bánh mì cart with a QR standee, a loaf, a bank-app phone (scan screen
// and refilling balance), plastic stools, low tables with steaming bowls, and cheering classmates. Pure functions of t.

/** A loaf of bánh mì about 340 wide, lying with its tip to the left; `fill` 0..1 how much filling is in, `bite` 0..1 eaten from the right. */
export const Loaf: React.FC<{ x: number; y: number; s?: number; rot?: number; fill?: number; bite?: number }> = ({ x, y, s = 1, rot = 0, fill = 0, bite = 0 }) => {
  const R = 170 - bite * 140; // right end of the loaf
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={0} cy={58} rx={170} ry={14} fill="#000" opacity={0.3} />
      {/* the lower half, then the filling, then the top half (a hinged baguette) */}
      <path d={`M -165 20 Q -150 56 -100 56 L ${R - 40} 56 Q ${R} 52 ${R} 20 Z`} fill="#D79A4A" stroke="#6E3F12" strokeWidth={4} strokeLinejoin="round" />
      {fill > 0 ? (
        <g opacity={clamp(fill * 4)}>
          <path d={`M -150 18 Q -60 -2 ${R} 12 L ${R} 28 L -150 28 Z`} fill="#F0C8C0" />
          {[-120, -70, -20, 30, 80, 130].filter((v) => v < R - 10).map((v, i) => (
            <g key={i}>
              <path d={`M ${v} 14 q 10 -34 28 -14 q -6 18 -28 14 Z`} fill={i % 2 ? '#4E9A50' : '#6CB05A'} />
              <rect x={v + 10} y={6} width={20} height={5} rx={2.5} fill="#F6F1E3" transform={`rotate(${i * 12 - 20} ${v + 20} 8)`} />
            </g>
          ))}
          <circle cx={Math.min(R - 30, 60)} cy={2} r={7} fill="#D94452" />
        </g>
      ) : null}
      <path d={`M -170 8 Q -165 -50 -90 -56 L ${R - 50} -56 Q ${R} -50 ${R} 4 Q ${R * 0.6} ${fill > 0 ? -10 : 8} -100 ${fill > 0 ? -2 : 8} Z`} fill="#E6AE5B" stroke="#6E3F12" strokeWidth={4} strokeLinejoin="round" />
      <path d="M -110 -50 L -88 -18 M -50 -54 L -28 -22 M 10 -54 L 32 -22 M 70 -54 L 92 -22" stroke="#B9782E" strokeWidth={6} strokeLinecap="round" />
      <path d="M -150 -30 Q -100 -50 -40 -50" stroke="#F6D48E" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  );
};

/** A QR code, `size` square, origin at its centre; cells from rnd so it never changes. */
export const QrCode: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => {
  const n = 9;
  const c = size / n;
  const finder = (cx: number, cy: number) => (
    <g transform={`translate(${cx * c} ${cy * c})`}>
      <rect width={c * 3} height={c * 3} fill="#14151C" />
      <rect x={c * 0.5} y={c * 0.5} width={c * 2} height={c * 2} fill="#fff" />
      <rect x={c * 1} y={c * 1} width={c} height={c} fill="#14151C" />
    </g>
  );
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2})`}>
      <rect x={-c * 0.4} y={-c * 0.4} width={size + c * 0.8} height={size + c * 0.8} rx={c * 0.4} fill="#fff" />
      {Array.from({ length: n * n }).map((_, i) => {
        const cx = i % n;
        const cy = Math.floor(i / n);
        const inF = (cx < 3 && cy < 3) || (cx > 5 && cy < 3) || (cx < 3 && cy > 5);
        return !inF && rnd(11, i) > 0.5 ? <rect key={i} x={cx * c} y={cy * c} width={c} height={c} fill="#14151C" /> : null;
      })}
      {finder(0, 0)}{finder(6, 0)}{finder(0, 6)}
    </g>
  );
};

/** The bánh mì cart, wheels on y, about 440 wide at s 1; its QR standee centre is at (140, -205) in cart units (see QR_AT). */
export const QR_AT = { x: 140, y: -205 };
export const BanhMiCart: React.FC<{ x: number; y: number; s?: number; t?: number; scan?: number }> = ({ x, y, s = 1, t = 0, scan = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={250} ry={16} fill="#000" opacity={0.38} />
    <circle cx={-130} cy={-40} r={40} fill="#1C1B22" /><circle cx={-130} cy={-40} r={17} fill="#8E8A94" />
    <circle cx={150} cy={-40} r={40} fill="#1C1B22" /><circle cx={150} cy={-40} r={17} fill="#8E8A94" />
    <rect x={-200} y={-160} width={400} height={100} rx={10} fill="#2F8F8A" stroke="#14463F" strokeWidth={4} />
    <rect x={-200} y={-160} width={400} height={16} fill="#E9DFC6" />
    {/* glass case with loaves */}
    <rect x={-190} y={-300} width={250} height={140} rx={8} fill="#BFE3EE" opacity={0.35} stroke="#E9F6FA" strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-150 + i * 56} cy={-190} rx={30} ry={14} fill="#E0A650" stroke="#8A5A22" strokeWidth={3} transform={`rotate(${-14 + i * 9} ${-150 + i * 56} -190)`} />)}
    {[0, 1, 2].map((i) => <ellipse key={i} cx={-125 + i * 56} cy={-228} rx={28} ry={13} fill="#D79A4A" stroke="#8A5A22" strokeWidth={3} transform={`rotate(${10 - i * 8} ${-125 + i * 56} -228)`} />)}
    <path d="M -178 -296 L -150 -296" stroke="#fff" strokeWidth={5} opacity={0.6} strokeLinecap="round" />
    {/* price board and awning */}
    <rect x={-150} y={-146} width={140} height={74} rx={8} fill="#1C2A26" stroke="#E9DFC6" strokeWidth={4} />
    <text x={-80} y={-96} textAnchor="middle" fontFamily={FONT.hand} fontSize={29} fill="#FFF2C4">₫25,000</text>
    <path d="M -230 -300 L -200 -380 L 230 -380 L 260 -300 Z" fill="#D8483C" stroke="#6E1F18" strokeWidth={4} strokeLinejoin="round" />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${-200 + i * 72 + 36} -380 L ${-212 + i * 76 + 38} -300`} stroke="#F2E6D0" strokeWidth={14} opacity={0.9} />)}
    <path d="M -230 -300 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 q 18 22 36 0 Z" fill="#F2E6D0" opacity={0.0} />
    {/* QR standee on the counter */}
    <rect x={QR_AT.x - 4} y={-150} width={8} height={36} fill="#3A3846" />
    <rect x={QR_AT.x - 56} y={QR_AT.y - 62} width={112} height={124} rx={10} fill="#F6EFE3" stroke="#3A3846" strokeWidth={4} />
    <QrCode x={QR_AT.x} y={QR_AT.y - 8} size={82} />
    {scan > 0 ? <rect x={QR_AT.x - 46} y={QR_AT.y - 56 + 90 * Math.min(1, scan)} width={92} height={5} rx={2.5} fill="#4CE08A" style={{ filter: 'drop-shadow(0 0 8px #4CE08A)' }} /> : null}
    <text x={QR_AT.x} y={QR_AT.y + 55} textAnchor="middle" fontFamily={FONT.ui} fontSize={13} fill="#14151C">SCAN</text>
    <path d={`M 240 -360 Q ${250 + Math.sin(t / 10) * 6} -420 240 -460`} stroke="#fff" strokeWidth={0} fill="none" />
  </g>
);

/** Steam wisps rising from (x, y). */
export const Steam: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="#fff" strokeLinecap="round" strokeWidth={5}>
    {[0, 1, 2].map((i) => {
      const p = (((t * 0.025 + i / 3) % 1) + 1) % 1;
      return <path key={i} d={`M ${(i - 1) * 22} ${-p * 70} q ${8 + Math.sin(t / 7 + i) * 6} -16 0 -32 q -8 -14 0 -26`} opacity={0.5 * Math.sin(p * Math.PI)} />;
    })}
  </g>
);

/** A bowl of noodle soup with steam, about 110 wide at s 1 (x, y = middle of its base). */
export const Bowl: React.FC<{ x: number; y: number; s?: number; t?: number; steam?: boolean }> = ({ x, y, s = 1, t = 0, steam = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={56} ry={8} fill="#000" opacity={0.3} />
    <path d="M -58 -50 Q -52 0 -22 0 L 22 0 Q 52 0 58 -50 Z" fill="#F2EEE4" stroke="#8A8A9A" strokeWidth={3} />
    <path d="M -50 -34 Q 0 -26 50 -34" stroke="#3A78B8" strokeWidth={5} fill="none" opacity={0.7} />
    <ellipse cx={0} cy={-50} rx={58} ry={12} fill="#E8B060" stroke="#8A8A9A" strokeWidth={3} />
    <path d="M -34 -52 q 10 -6 18 0 M -4 -50 q 10 -6 18 0 M 20 -52 q 10 -6 16 0" stroke="#FFF1C8" strokeWidth={4} fill="none" strokeLinecap="round" />
    <circle cx={-12} cy={-52} r={5} fill="#5AA05A" /><circle cx={22} cy={-50} r={4} fill="#D94452" />
    <path d="M 10 -56 L 70 -96 M 20 -54 L 78 -88" stroke="#C98A4A" strokeWidth={4} strokeLinecap="round" />
    {steam ? <Steam x={0} y={-62} t={t + x} /> : null}
  </g>
);

/** A plastic stool (red, blue or yellow by `c`), seat at y - 64 * s, x the middle. */
export const Stool: React.FC<{ x: number; y: number; s?: number; c?: number }> = ({ x, y, s = 1, c = 0 }) => {
  const col = ['#C84A3E', '#3A7AC8', '#E9A83A'][c % 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={3} rx={50} ry={8} fill="#000" opacity={0.35} />
      <path d="M -34 -60 L -42 0 L 42 0 L 34 -60 Z" fill={col} />
      <path d="M -34 -60 L -42 0 L -22 0 L -18 -60 Z" fill="#000" opacity={0.18} />
      <ellipse cx={0} cy={-62} rx={40} ry={11} fill={col} />
      <ellipse cx={0} cy={-64} rx={34} ry={8} fill="#fff" opacity={0.18} />
    </g>
  );
};

/** A low table seen from the side, top at y - 120 * s, `w` wide in units of s; children are drawn on its top (origin: the top's middle). */
export const LowTable: React.FC<{ x: number; y: number; s?: number; w?: number; children?: React.ReactNode }> = ({ x, y, s = 1, w = 420, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={w / 2 + 20} ry={12} fill="#000" opacity={0.35} />
    <path d={`M ${-w / 2 + 30} -108 L ${-w / 2 + 24} 0 M ${w / 2 - 30} -108 L ${w / 2 - 24} 0`} stroke="#4A4858" strokeWidth={10} strokeLinecap="round" />
    <rect x={-w / 2} y={-124} width={w} height={18} rx={6} fill="#B9B2A2" stroke="#5A5648" strokeWidth={3} />
    <g transform="translate(0 -124)">{children}</g>
  </g>
);

/** A classmate on a stool: the classroom's `Kid` (back and a turned face), with raised arms waving (`up` 0..1) and an open mouth. */
export const Cheerer: React.FC<{ x: number; y: number; s: number; look: KidLook; t: number; up?: number; flip?: boolean; turn?: number; seed?: number }> = ({ x, y, s, look, t, up = 1, flip = false, turn = 1, seed = 0 }) => {
  const w = Math.sin(t / 2.2 + seed * 1.7) * 10 * up;
  return (
    <g transform={`translate(${x} 0) scale(${flip ? -1 : 1} 1)`}>
      <Kid x={0} y={y} s={s} look={look} turn={turn} laugh={up} t={t + seed * 7} />
      {up > 0 ? [-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 58 * s} ${y - 80 * s})`}>
          <path d={`M 0 0 L ${sd * 22 * s} ${(-96 - up * 40) * s} `} stroke={look.top} strokeWidth={22 * s} strokeLinecap="round" transform={`rotate(${w * sd} 0 0)`} />
          <circle cx={sd * 22 * s + w * sd * 1.2} cy={(-110 - up * 40) * s} r={14 * s} fill="#F2C9A0" stroke="#3A2A20" strokeWidth={2} />
        </g>
      )) : null}
    </g>
  );
};

/** A phone with the bank app, `w` wide, centre (x, y). mode 'scan': camera view on a QR, then PAID; 'balance': the balance refilling. */
export const BankPhone: React.FC<{ x: number; y: number; w?: number; rot?: number; mode: 'scan' | 'balance'; t: number; paidAt?: number; balance?: number }> = ({ x, y, w = 220, rot = 0, mode, t, paidAt = 14, balance = 1225000 }) => {
  const h = w * 2.0;
  const s = w / 220;
  const paid = mode === 'scan' && t >= paidAt;
  const k = Math.floor(Math.max(0, t) / 1.2); // one tick (+1.000 đ) every 1.2 frames while refilling
  const bal = balance + Math.min(25, k) * 1000;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 8 * s} y={-h / 2 + 12 * s} width={w} height={h} rx={w * 0.14} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.14} fill="#16151C" stroke="#3A3846" strokeWidth={4 * s} />
      <rect x={-w / 2 + 10 * s} y={-h / 2 + 10 * s} width={w - 20 * s} height={h - 20 * s} rx={w * 0.1} fill={mode === 'scan' ? (paid ? '#12361F' : '#202A38') : '#0F2A1E'} />
      <rect x={-w / 2 + 10 * s} y={-h / 2 + 10 * s} width={w - 20 * s} height={44 * s} rx={w * 0.1} fill="#2FBF71" opacity={0.9} />
      <text x={0} y={-h / 2 + 40 * s} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22 * s} fill="#0B2A18" letterSpacing={2 * s}>BANK</text>
      {mode === 'scan' && !paid ? (
        <g>
          <rect x={-70 * s} y={-70 * s} width={140 * s} height={140 * s} fill="none" stroke="#fff" strokeWidth={4 * s} strokeDasharray={`${30 * s} ${110 * s}`} />
          <rect x={-60 * s} y={-70 * s + (((t * 0.07) % 1) * 130 * s)} width={120 * s} height={5 * s} rx={2.5 * s} fill="#4CE08A" style={{ filter: 'drop-shadow(0 0 8px #4CE08A)' }} />
        </g>
      ) : null}
      {paid ? (
        <g transform={`translate(0 ${-20 * s}) scale(${backOut(clamp((t - paidAt) / 6))})`}>
          <circle r={56 * s} fill="#2FBF71" />
          <path d={`M ${-26 * s} ${2 * s} l ${18 * s} ${20 * s} l ${36 * s} ${-42 * s}`} stroke="#E9FFF2" strokeWidth={10 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text y={110 * s} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26 * s} fill="#F6EFE3">-₫25,000</text>
        </g>
      ) : null}
      {mode === 'balance' ? (
        <g>
          <text x={0} y={-h * 0.2} textAnchor="middle" fontFamily={FONT.ui} fontSize={22 * s} fill="#9FD9B6" letterSpacing={2 * s}>BALANCE</text>
          <text x={0} y={-h * 0.1} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={31 * s} fill="#F6EFE3">{bal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</text>
          <text x={0} y={-h * 0.1 + 34 * s} textAnchor="middle" fontFamily={FONT.ui} fontSize={22 * s} fill="#9FD9B6">₫</text>
          <rect x={-72 * s} y={h * 0.05} width={144 * s} height={16 * s} rx={8 * s} fill="#1D4A33" />
          <rect x={-72 * s} y={h * 0.05} width={144 * s * Math.min(1, k / 25)} height={16 * s} rx={8 * s} fill="#4CE08A" />
          <text x={0} y={h * 0.2} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34 * s} fill="#7CF0A8" style={{ filter: 'drop-shadow(0 0 8px #2FBF71)' }}>+₫1,000</text>
        </g>
      ) : null}
    </g>
  );
};

/** Crumbs flying from (x, y) in a loop. */
export const Crumbs: React.FC<{ x: number; y: number; t: number; n?: number; s?: number }> = ({ x, y, t, n = 8, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#E6AE5B" stroke="#8A5A22" strokeWidth={1.5}>
    {Array.from({ length: n }).map((_, i) => {
      const p = (((t * 0.045 + rnd(5, i)) % 1) + 1) % 1;
      return <circle key={i} cx={(rnd(6, i) - 0.3) * 120 * p} cy={-30 * Math.sin(p * Math.PI) + p * p * 90} r={3 + rnd(7, i) * 3} opacity={1 - p} />;
    })}
  </g>
);
