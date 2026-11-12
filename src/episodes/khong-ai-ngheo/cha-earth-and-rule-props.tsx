import React from 'react';
import { clamp, rnd, backOut, easeOut, mixHex, Glow, Rays, FONT } from '../../engine';
import { Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';

// Chapter A props (3/4): the Earth at night with a light for every person, the gold pile and crown (the billionaire we
// DON'T get), and the four "enough" icons: rice bowl, roof, school bag, doctor's cross. Pure functions of t.

// ---------- the Earth ----------
const LAND: [number, number, number, number][] = [
  [0.1, -0.35, 0.34, 0.2], [0.28, 0.2, 0.22, 0.34], [0.62, -0.3, 0.42, 0.22], [0.8, 0.1, 0.2, 0.3],
  [1.12, -0.1, 0.3, 0.2], [1.3, 0.32, 0.26, 0.16], [1.55, -0.4, 0.26, 0.14],
];

/** The Earth by night, `cx, cy, r`: oceans, land that turns slowly, and `n` tiny lights (one per crowd of people).
 *  `lit` 0..1 is the share switched on, `warm` 0..1 turns the lights from pale to warm gold. */
export const EarthLights: React.FC<{ t: number; id: string; cx: number; cy: number; r: number; lit?: number; warm?: number; n?: number }> = ({ t, id, cx, cy, r, lit = 1, warm = 0.5, n = 900 }) => {
  const W = 2.0 * r;
  const c1 = mixHex('#BFD8FF', '#FFC95E', warm);
  const c2 = mixHex('#FFFFFF', '#FFF1C4', warm);
  const off = (t * 0.7) % W;
  const dots = Array.from({ length: n }).map((_, i) => {
    const L = LAND[Math.floor(rnd(11, i) * LAND.length)];
    const a = rnd(12, i) * Math.PI * 2;
    const d = Math.sqrt(rnd(13, i));
    return { x: (L[0] + Math.cos(a) * d * L[2]) * r, y: (L[1] + Math.sin(a) * d * L[3]) * r, k: i / n, rr: 1.8 + rnd(14, i) * 2.4 };
  });
  const layer = (shift: number) => (
    <g transform={`translate(${shift - off} 0)`}>
      {LAND.map((L, i) => <ellipse key={i} cx={L[0] * r} cy={L[1] * r} rx={L[2] * r} ry={L[3] * r} fill="#1B3558" />)}
      {dots.map((d, i) => (d.k < lit ? <circle key={i} cx={d.x} cy={d.y} r={d.rr * (r / 330) * (1 + 0.5 * warm)} fill={i % 3 ? c1 : c2} opacity={clamp(0.6 + 0.4 * Math.sin(t / 6 + i * 1.7))} /> : null))}
    </g>
  );
  return (
    <g>
      <defs>
        <radialGradient id={`${id}sea`} cx="0.4" cy="0.35" r="0.85"><stop offset="0" stopColor="#1C3A66" /><stop offset="1" stopColor="#081428" /></radialGradient>
        <radialGradient id={`${id}shade`} cx="0.5" cy="0.5" r="0.5"><stop offset="0.7" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.55} /></radialGradient>
        <clipPath id={`${id}clip`}><circle cx={0} cy={0} r={r} /></clipPath>
      </defs>
      <g transform={`translate(${cx} ${cy})`}>
        <circle r={r * 1.18} fill="#4B7BD8" opacity={0.16} filter="url(#blur16)" />
        <circle r={r} fill={`url(#${id}sea)`} />
        <g clipPath={`url(#${id}clip)`}>
          <g transform={`translate(${-r * 1.0} 0)`}>{layer(0)}{layer(W)}{layer(W * 2)}</g>
          <circle r={r} fill={`url(#${id}shade)`} />
        </g>
        <circle r={r} fill="none" stroke="#7FB0FF" strokeWidth={4} opacity={0.5} />
      </g>
      <Glow x={cx} y={cy} r={r * 1.5} o={0.12} kind="cool" />
    </g>
  );
};

// ---------- the gold pile and the crown ----------
/** A heap of gold coins and bars with a crown on top, centred on x with its base at y (about 520 wide, 400 tall at s = 1). */
export const GoldPile: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={300} ry={26} fill="#000" opacity={0.4} />
    <path d="M -260 0 Q -230 -130 -120 -180 Q 0 -250 120 -180 Q 230 -130 260 0 Z" fill="#E0A82A" stroke="#7A5210" strokeWidth={5} />
    {Array.from({ length: 34 }).map((_, i) => {
      const a = rnd(21, i);
      const cxp = -230 + a * 460;
      const top = -230 * Math.max(0, 1 - Math.pow(Math.abs(cxp) / 270, 1.6));
      const cyp = -12 + (top + 12) * rnd(22, i) * 0.92;
      return <ellipse key={i} cx={cxp} cy={cyp} rx={30} ry={12} fill={i % 2 ? '#FFD45A' : '#F3BE3A'} stroke="#8A6014" strokeWidth={3} />;
    })}
    {[-170, -60, 60, 170].map((bx, i) => <path key={i} d={`M ${bx - 46} 0 L ${bx - 34} -34 L ${bx + 34} -34 L ${bx + 46} 0 Z`} fill="#F6C945" stroke="#7A5210" strokeWidth={4} />)}
    <g transform={`translate(0 ${-222 + Math.sin(t / 8) * 3})`}>
      <path d="M -74 0 L -86 -86 L -40 -44 L 0 -108 L 40 -44 L 86 -86 L 74 0 Z" fill="#FFCF3E" stroke="#7A5210" strokeWidth={5} strokeLinejoin="round" />
      <rect x={-78} y={-2} width={156} height={20} rx={5} fill="#E8A91F" stroke="#7A5210" strokeWidth={4} />
      {[-40, 0, 40].map((jx) => <circle key={jx} cx={jx} cy={8} r={6} fill={jx ? '#E8414E' : '#4EA8E0'} />)}
    </g>
  </g>
);

/** A red cross-out that draws on from t = 0 over `dur` frames, over a box about 560 x 520 centred on (x, y). */
export const CrossOut: React.FC<{ x: number; y: number; t: number; dur?: number; s?: number }> = ({ x, y, t, dur = 10, s = 1 }) => {
  const p = easeOut(clamp(t / dur));
  const q = easeOut(clamp((t - dur * 0.7) / dur));
  if (p <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#E8414E" strokeWidth={34} strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 16px rgba(232,65,78,0.6))' }}>
      <path d="M -270 -250 L 270 250" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      <path d="M 270 -250 L -270 250" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - q} />
    </g>
  );
};

// ---------- the four "enough" icons, each about 220 wide, centred on (0, 0) of its own group ----------
export const RiceBowlIcon: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <path d="M -90 -10 Q -90 -92 0 -96 Q 90 -92 90 -10 Z" fill="#FBF6EA" stroke="#8A8272" strokeWidth={5} />
    {Array.from({ length: 22 }).map((_, i) => <ellipse key={i} cx={-70 + rnd(31, i) * 140} cy={-90 + rnd(32, i) * 70 * (1 - Math.abs(rnd(31, i) - 0.5)) - 4} rx={6} ry={3} fill="#E7DFC9" transform={`rotate(${rnd(33, i) * 90} ${-70 + rnd(31, i) * 140} -60)`} />)}
    <path d="M -110 -8 L 110 -8 Q 106 60 40 76 L -40 76 Q -106 60 -110 -8 Z" fill="#4E86C4" stroke="#1F3A5E" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -96 12 H 96" stroke="#FFFFFF" strokeWidth={5} opacity={0.6} />
    <path d="M 40 -100 L 120 -150 M 56 -96 L 134 -134" stroke="#B8843E" strokeWidth={7} strokeLinecap="round" />
    <Steam x={-10} y={-100} t={t} n={4} h={110} w={16} o={0.7} seed={2} />
  </g>
);

export const RoofIcon: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-80} y={-40} width={160} height={110} fill="#F1D9A8" stroke="#7A5A30" strokeWidth={5} />
    <path d="M -110 -34 L 0 -118 L 110 -34 Z" fill="#C9553A" stroke="#7A2E1E" strokeWidth={5} strokeLinejoin="round" />
    <rect x={-22} y={4} width={44} height={66} rx={4} fill="#8A4A2E" stroke="#4A2A18" strokeWidth={4} />
    <rect x={30} y={-22} width={34} height={30} fill="#FFE27A" stroke="#7A5A30" strokeWidth={4} opacity={0.75 + 0.25 * Math.sin(t / 7)} />
    <rect x={-66} y={-22} width={34} height={30} fill="#FFE27A" stroke="#7A5A30" strokeWidth={4} opacity={0.75 + 0.25 * Math.sin(t / 9)} />
    <rect x={52} y={-104} width={20} height={44} fill="#9A4A32" stroke="#4A2A18" strokeWidth={4} />
    <Steam x={62} y={-106} t={t} n={3} h={80} w={10} o={0.6} seed={5} />
  </g>
);

export const SchoolBagIcon: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`rotate(${Math.sin(t / 12) * 3} 0 70)`}>
    <path d="M -64 -70 Q -64 -112 0 -112 Q 64 -112 64 -70" fill="none" stroke="#7A2E1E" strokeWidth={9} strokeLinecap="round" />
    <rect x={-80} y={-84} width={160} height={150} rx={30} fill="#D9503A" stroke="#7A2E1E" strokeWidth={5} />
    <path d="M -80 -30 Q 0 10 80 -30" fill="#C2432F" stroke="#7A2E1E" strokeWidth={5} />
    <rect x={-46} y={14} width={92} height={42} rx={10} fill="#F2B63E" stroke="#7A2E1E" strokeWidth={4} />
    <circle cx={0} cy={-14} r={9} fill="#F2B63E" stroke="#7A2E1E" strokeWidth={3} />
    <g transform="translate(92 20) rotate(24)"><rect x={-7} y={-70} width={14} height={110} fill="#F6D24A" stroke="#7A5A1E" strokeWidth={3} /><path d="M -7 40 L 0 60 L 7 40 Z" fill="#2A2A2A" /><rect x={-7} y={-84} width={14} height={14} fill="#E88AB0" /></g>
  </g>
);

export const DoctorCrossIcon: React.FC<{ t: number }> = ({ t }) => {
  const beat = 1 + 0.06 * Math.max(0, Math.sin(t / 4));
  return (
    <g>
      <circle r={96} fill="#FFFFFF" stroke="#B8C4CC" strokeWidth={5} />
      <path d="M -22 -70 h 44 v 48 h 48 v 44 h -48 v 48 h -44 v -48 h -48 v -44 h 48 z" fill="#2FA86A" transform={`scale(${beat})`} />
    </g>
  );
};

/** One badge: a glowing disc with the icon inside and a label under it; pops with overshoot at t = 0. */
export const EnoughBadge: React.FC<{ x: number; y: number; t: number; label: string; children: React.ReactNode }> = ({ x, y, t, label, children }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 9));
  const idle = 1 + 0.025 * Math.sin(t / 8);
  return (
    <g transform={`translate(${x} ${y}) scale(${k * idle})`}>
      <circle r={190} fill="#FFD36B" opacity={0.22 * clamp(1 - t / 40) + 0.1} filter="url(#blur16)" />
      <Rays x={0} y={0} t={t} len={230} n={10} o={0.1 * clamp(1 - (t - 20) / 30)} />
      <circle r={150} fill="#2A2038" stroke="#FFD36B" strokeWidth={8} />
      <circle r={136} fill="#3A2C4C" />
      <g transform="scale(0.9) translate(0 -4)">{children}</g>
      <text y={226} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill="#FFF3D0" stroke="#1A1230" strokeWidth={9} paintOrder="stroke">{label}</text>
    </g>
  );
};
