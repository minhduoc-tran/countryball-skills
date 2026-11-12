import React from 'react';
import { Glow } from '../../engine';
import { Steam } from '../tien-vo-han/che-xoi-cart-and-money-props';

// Chapter E ending props: the golden floor line (the "sàn"), a gold pile, a balance scale whose two pans rise together,
// and what sits on its pans: a bowl of rice, a pill, a schoolbag, a hoe. Pure functions of the clock.

/** The glowing golden floor: a line from x0 to x1 at y, a soft glow under it, and a highlight that travels along it. */
export const GoldFloor: React.FC<{ x0: number; x1: number; y: number; t: number; o?: number; thick?: number }> = ({ x0, x1, y, t, o = 1, thick = 8 }) => {
  const hl = x0 + ((x1 - x0) * ((t * 0.012) % 1));
  return (
    <g opacity={o}>
      <g filter="url(#blur16)">
        <rect x={x0} y={y - thick * 2} width={x1 - x0} height={thick * 4} rx={thick * 2} fill="#FFC94A" opacity={0.55} />
      </g>
      <rect x={x0} y={y - thick / 2} width={x1 - x0} height={thick} rx={thick / 2} fill="#FFD76A" />
      <rect x={x0} y={y - thick / 2} width={x1 - x0} height={thick / 3} rx={thick / 6} fill="#FFF3C4" opacity={0.9} />
      <g filter="url(#blur6)">
        <ellipse cx={hl} cy={y} rx={90} ry={thick} fill="#FFFBE8" opacity={0.75} />
      </g>
    </g>
  );
};

/** A heap of gold coins and two bars; `fade` 0..1 melts it away (it sinks, thins and loses its glow). Origin: the base centre. */
export const GoldPile: React.FC<{ x: number; y: number; s?: number; t: number; fade?: number }> = ({ x, y, s = 1, t, fade = 0 }) => {
  const coins = Array.from({ length: 34 }).map((_, i) => {
    const row = Math.floor(Math.sqrt(i * 1.6));
    const u = (i * 0.618) % 1;
    const cx = (u - 0.5) * (300 - row * 38);
    const cy = -row * 26 - 10;
    return { cx, cy, k: i };
  });
  return (
    <g transform={`translate(${x} ${y + 90 * fade * fade}) scale(${s})`} opacity={1 - fade}>
      <Glow x={0} y={-90} r={320} o={0.5 * (1 - fade)} />
      <ellipse cx={0} cy={6} rx={190} ry={20} fill="#000" opacity={0.4} />
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d * 92} -28) rotate(${d * 6})`}>
          <path d="M -58 0 L -46 -34 H 46 L 58 0 Z" fill="#E7B63A" stroke="#8A6A1E" strokeWidth={4} strokeLinejoin="round" />
          <path d="M -44 -30 H 44" stroke="#FFF0A8" strokeWidth={4} opacity={0.8} strokeLinecap="round" />
        </g>
      ))}
      {coins.map((c) => (
        <g key={c.k} transform={`translate(${c.cx} ${c.cy})`}>
          <ellipse cx={0} cy={4} rx={30} ry={10} fill="#9A7424" />
          <ellipse cx={0} cy={0} rx={30} ry={10} fill="#F2C94A" stroke="#8A6A1E" strokeWidth={2.5} />
          <ellipse cx={-4} cy={-1} rx={15} ry={4.5} fill="#FFE98A" opacity={0.8} />
        </g>
      ))}
      {[0, 1, 2].map((i) => {
        const ph = ((t * 0.05 + i * 0.33) % 1);
        return <circle key={i} cx={-90 + i * 90} cy={-120 - ph * 20} r={4 + 4 * Math.sin(ph * Math.PI)} fill="#FFF6C0" opacity={Math.sin(ph * Math.PI) * 0.9} />;
      })}
    </g>
  );
};

/** A bowl of rice with chopsticks and steam. Origin: the base centre; ~190 wide at s = 1. */
export const RiceBowl: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={86} ry={10} fill="#000" opacity={0.3} />
    <path d="M -90 -78 Q -84 0 -34 0 L 34 0 Q 84 0 90 -78 Z" fill="#F0E6D2" stroke="#7A6A4E" strokeWidth={4} />
    <path d="M 30 0 Q 84 0 90 -78 L 66 -78 Q 62 -10 30 -2 Z" fill="#C9BCA2" opacity={0.8} />
    <path d="M -80 -50 H 80" stroke="#2F6E8A" strokeWidth={5} opacity={0.65} />
    <path d="M -92 -80 Q -70 -150 0 -154 Q 70 -150 92 -80 Z" fill="#FFFDF4" stroke="#CFC6AE" strokeWidth={3} />
    {[[-40, -112], [-6, -130], [30, -108], [58, -92], [-62, -92], [12, -96]].map(([dx, dy], i) => <ellipse key={i} cx={dx} cy={dy} rx={9} ry={4} fill="#EDE5D0" transform={`rotate(${i * 30} ${dx} ${dy})`} />)}
    <path d="M 20 -150 L 96 -214" stroke="#C98A4A" strokeWidth={7} strokeLinecap="round" />
    <path d="M 36 -146 L 112 -204" stroke="#A8703A" strokeWidth={7} strokeLinecap="round" />
    <Steam x={-6} y={-150} t={t} n={4} h={110} w={16} o={0.5} seed={4} />
  </g>
);

/** A pill: a red and white capsule resting beside a round tablet. Origin: the base centre; ~170 wide at s = 1. */
export const PillPair: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={90} ry={10} fill="#000" opacity={0.3} />
    <g transform="translate(-24 -34) rotate(-24)">
      <rect x={-62} y={-24} width={124} height={48} rx={24} fill="#F6F2EA" stroke="#5A4A4A" strokeWidth={4} />
      <path d="M 0 -24 H 38 A 24 24 0 0 1 38 24 H 0 Z" fill="#E4505A" />
      <rect x={-62} y={-24} width={124} height={48} rx={24} fill="none" stroke="#5A4A4A" strokeWidth={4} />
      <path d="M -50 -12 H 20" stroke="#fff" strokeWidth={5} opacity={0.7} strokeLinecap="round" />
    </g>
    <g transform="translate(58 -16)">
      <ellipse cx={0} cy={0} rx={28} ry={12} fill="#F6F2EA" stroke="#5A4A4A" strokeWidth={4} />
      <path d="M -16 0 H 16" stroke="#B8AFA4" strokeWidth={3} />
    </g>
  </g>
);

/** A child's schoolbag, front view with a flap, a buckle and two straps. Origin: the base centre; ~170 x 200. */
export const SchoolBag: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={84} ry={10} fill="#000" opacity={0.3} />
    <rect x={-80} y={-200} width={160} height={198} rx={34} fill="#2C8CB4" stroke="#14465E" strokeWidth={5} />
    <rect x={-80} y={-200} width={160} height={198} rx={34} fill="none" stroke="#fff" strokeWidth={3} opacity={0.15} />
    <path d="M -80 -150 Q 0 -84 80 -150 V -170 Q 0 -110 -80 -170 Z" fill="#1E6A8C" stroke="#14465E" strokeWidth={4} />
    <rect x={-52} y={-90} width={104} height={64} rx={14} fill="#238AAE" stroke="#14465E" strokeWidth={4} />
    <rect x={-10} y={-122} width={20} height={26} rx={5} fill="#F2C14E" stroke="#8A6A1E" strokeWidth={3} />
    <path d="M -34 -100 V -60 M 34 -100 V -60" stroke="#14465E" strokeWidth={3} opacity={0.5} />
    <path d="M -50 -200 Q -50 -232 0 -232 Q 50 -232 50 -200" stroke="#14465E" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M -64 -190 L -70 -150" stroke="#F28C6A" strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** A hoe lying at an angle, wooden handle and an iron blade, with a hand-worn grip. Origin: the centre; ~260 long. */
export const Hoe: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={26} rx={130} ry={9} fill="#000" opacity={0.28} />
    <rect x={-130} y={-6} width={236} height={14} rx={7} fill="#A8743E" stroke="#5A3A1C" strokeWidth={3} />
    <rect x={-130} y={-6} width={236} height={4} rx={2} fill="#E0B070" opacity={0.7} />
    <path d="M 96 -14 L 112 -14 L 124 34 L 70 34 L 82 6 Z" fill="#8E949E" stroke="#3A3F48" strokeWidth={4} strokeLinejoin="round" />
    <path d="M 96 -10 L 106 -10 L 114 20" stroke="#D3D8E0" strokeWidth={3} fill="none" opacity={0.7} />
    <rect x={-92} y={-9} width={46} height={20} rx={6} fill="#6B4A2A" opacity={0.7} />
  </g>
);

/**
 * A balance scale on a stand. `tilt` (degrees, + = right pan down) turns the beam; `lift` (0..1) raises BOTH pans together
 * by shortening their chains; `left` / `right` are drawn standing on their pans (origin: the pan's top centre).
 * Origin: the stand's base centre. Beam half-length 230; the pivot sits 380 above the base.
 */
export const Balance: React.FC<{ x: number; y: number; s?: number; tilt?: number; lift?: number; left?: React.ReactNode; right?: React.ReactNode; glow?: number }> = ({
  x, y, s = 1, tilt = 0, lift = 0, left = null, right = null, glow = 0,
}) => {
  const L = 230;
  const PIV = -380;
  const a = (tilt * Math.PI) / 180;
  const chain = 190 - 70 * lift;
  const pans = [-1, 1].map((d) => ({ d, px: d * L * Math.cos(a), py: PIV + d * L * Math.sin(a) }));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow > 0 ? <Glow x={0} y={-230} r={520} o={0.4 * glow} /> : null}
      <ellipse cx={0} cy={6} rx={170} ry={16} fill="#000" opacity={0.4} />
      <path d="M -120 0 Q -120 -34 -70 -34 H 70 Q 120 -34 120 0 Z" fill="#8B5A3C" stroke="#4A2E20" strokeWidth={5} />
      <rect x={-12} y={PIV} width={24} height={350} fill="#B98557" stroke="#4A2E20" strokeWidth={4} />
      <rect x={-12} y={PIV} width={7} height={350} fill="#F2C48A" opacity={0.6} />
      {/* the beam */}
      <g transform={`rotate(${tilt} 0 ${PIV})`}>
        <rect x={-L - 14} y={PIV - 9} width={2 * L + 28} height={18} rx={9} fill="#E7B63A" stroke="#8A6A1E" strokeWidth={4} />
        <rect x={-L - 14} y={PIV - 9} width={2 * L + 28} height={5} rx={3} fill="#FFF0A8" opacity={0.8} />
        {[-1, 1].map((d) => <circle key={d} cx={d * L} cy={PIV} r={11} fill="#C99A2A" stroke="#8A6A1E" strokeWidth={3} />)}
      </g>
      <circle cx={0} cy={PIV} r={20} fill="#E7B63A" stroke="#8A6A1E" strokeWidth={5} />
      {/* chains and pans hang straight down from the beam ends */}
      {pans.map((p) => (
        <g key={p.d} transform={`translate(${p.px} ${p.py})`}>
          <path d={`M 0 0 L -86 ${chain} M 0 0 L 86 ${chain}`} stroke="#8A6A1E" strokeWidth={4} />
          <g transform={`translate(0 ${chain})`}>
            <path d="M -110 0 H 110 Q 100 34 0 38 Q -100 34 -110 0 Z" fill="#E7B63A" stroke="#8A6A1E" strokeWidth={5} strokeLinejoin="round" />
            <path d="M -96 6 H 96" stroke="#FFF0A8" strokeWidth={4} opacity={0.7} strokeLinecap="round" />
            <g transform="translate(0 2)">{p.d < 0 ? left : right}</g>
          </g>
        </g>
      ))}
    </g>
  );
};
