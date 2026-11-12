import React from 'react';
import { clamp, easeOut, backOut, rnd, Glow, Sparkle, FONT } from '../../engine';

// Chapter B props (4/4): Montreal 1969 as a sepia illustration (the "memory" look adds the grade): an old paper ground,
// a plain skyline, an empty patrol car (generic, no marks), a picket sign, a year that flips, a clock for 16 hours, and
// the three counters' icons (bank, broken shop window, flame). Schematic and calm: no people, nobody hurt.

export const PAPER = { ground: '#E6D6B0', edge: '#B89E6C', ink: '#3A2A1E', red: '#9A3A2A', soft: '#8A7656' };
const { ink } = PAPER;

/** The aged paper ground, with a frame line and slow drifting dust. Fills the world and its margins. */
export const OldPaper: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <radialGradient id={`${id}pap`} cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.45" stopColor={PAPER.ground} />
        <stop offset="1" stopColor={PAPER.edge} />
      </radialGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1880} fill={`url(#${id}pap)`} />
    {Array.from({ length: 40 }).map((_, i) => (
      <circle key={i} cx={rnd(61, i) * 1920} cy={rnd(62, i) * 1080} r={1.5 + rnd(63, i) * 3} fill={PAPER.soft} opacity={0.18 + 0.1 * Math.sin(t / 15 + i)} />
    ))}
    <rect x={50} y={50} width={1820} height={980} fill="none" stroke={PAPER.soft} strokeWidth={4} opacity={0.5} />
    <rect x={64} y={64} width={1792} height={952} fill="none" stroke={PAPER.soft} strokeWidth={1.5} opacity={0.5} />
  </g>
);

/** A plain skyline silhouette (boxy towers, a rounded hill behind), `w` wide with its base at y. No logos. */
export const PlainSkyline: React.FC<{ x: number; y: number; w: number; h?: number; color?: string; hill?: string }> = ({ x, y, w, h = 300, color = ink, hill = PAPER.soft }) => {
  let d = `M ${x} ${y}`;
  let cx = x;
  let i = 0;
  while (cx < x + w) {
    const bw = 50 + rnd(7, i) * 70;
    const bh = 60 + rnd(8, i) * h * (0.4 + 0.6 * Math.sin(((cx - x) / w) * Math.PI));
    d += ` L ${cx} ${y - bh} L ${cx + bw} ${y - bh} L ${cx + bw} ${y}`;
    cx += bw + 6;
    i++;
  }
  d += ` L ${x + w} ${y} Z`;
  return (
    <g>
      <path d={`M ${x - 40} ${y} Q ${x + w * 0.3} ${y - h * 0.9} ${x + w * 0.62} ${y - h * 0.45} Q ${x + w * 0.85} ${y - h * 0.15} ${x + w + 40} ${y} Z`} fill={hill} opacity={0.55} />
      <path d={d} fill={color} opacity={0.88} />
      {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={x + 20 + rnd(9, i) * (w - 60)} y={y - 30 - rnd(10, i) * h * 0.7} width={9} height={13} fill={PAPER.ground} opacity={0.45} />)}
    </g>
  );
};

/** A side-on patrol car, generic (a plain light bar, no marks), facing right, parked and empty. Origin: ground below the middle, ~560 wide. */
export const EmptyPatrolCar: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={300} ry={16} fill={ink} opacity={0.3} />
    <path d="M -270 -40 Q -276 -100 -240 -112 L -140 -122 Q -100 -190 -30 -190 L 100 -190 Q 160 -186 190 -124 L 250 -112 Q 282 -100 278 -40 Z" fill="#4A4036" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -230 -112 L -140 -122 L -130 -40 L -270 -40 Z" fill="#EDE2C6" opacity={0.9} />
    <path d="M -110 -122 Q -80 -178 -30 -178 L 50 -178 L 50 -122 Z" fill="#B9C4C4" stroke={ink} strokeWidth={4} />
    <path d="M 70 -178 L 110 -178 Q 150 -176 170 -122 L 70 -122 Z" fill="#B9C4C4" stroke={ink} strokeWidth={4} />
    <path d="M -240 -76 H 262" stroke={ink} strokeWidth={3} opacity={0.4} />
    <rect x={-70} y={-206} width={150} height={20} rx={8} fill="#8A7656" stroke={ink} strokeWidth={4} />
    <rect x={-62} y={-204} width={60} height={14} rx={5} fill={Math.sin(t / 22) > 0.97 ? '#C8402F' : '#6A5A46'} />
    <rect x={8} y={-204} width={60} height={14} rx={5} fill="#6A5A46" />
    {[-160, 170].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-30} r={44} fill={ink} />
        <circle cx={wx} cy={-30} r={22} fill="#A89878" stroke={ink} strokeWidth={4} />
      </g>
    ))}
    <rect x={252} y={-92} width={20} height={26} rx={6} fill="#F2D88A" stroke={ink} strokeWidth={3} />
  </g>
);

/** A picket sign "ĐÌNH CÔNG" on a stick; pops and settles at `t` = 0, then leans. Origin at the foot of the stick. */
export const PicketSign: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 8));
  const lean = -14 + 10 * Math.exp(-t / 10) * Math.cos(t / 2.2);
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean}) scale(${s * k})`}>
      <rect x={-7} y={-330} width={14} height={330} fill="#7A5A30" stroke={ink} strokeWidth={4} />
      <rect x={-210} y={-520} width={420} height={210} rx={10} fill="#F2E8CC" stroke={ink} strokeWidth={7} />
      <text x={0} y={-440} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={84} fill={PAPER.red} letterSpacing={4}>ĐÌNH</text>
      <text x={0} y={-350} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={84} fill={PAPER.red} letterSpacing={4}>CÔNG</text>
    </g>
  );
};

/** A split-flap year: four flap boxes showing `text`, each digit's top half dipping as it changes (a flip mark at the seam). */
export const FlapYear: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <g transform={`translate(${x} ${y})`}>
    {text.split('').map((ch, i) => (
      <g key={i} transform={`translate(${(i - 1.5) * 250} 0)`}>
        <rect x={-110} y={-170} width={220} height={340} rx={20} fill={ink} stroke="#1A120C" strokeWidth={6} />
        <text x={0} y={90} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={290} fill={PAPER.ground}>{ch}</text>
        <rect x={-110} y={-6} width={220} height={12} fill="#1A120C" />
      </g>
    ))}
  </g>
);

/** A clock whose ring shows hours of a 24-hour day: `p` 0..1 fills the ring to 16/24 and spins the hand. */
export const DayClock: React.FC<{ x: number; y: number; r: number; p: number }> = ({ x, y, r, p }) => {
  const a = (16 / 24) * 360 * p;
  const arc = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return `${(Math.cos(rad) * (r + 36)).toFixed(1)} ${(Math.sin(rad) * (r + 36)).toFixed(1)}`;
  };
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 36} fill="none" stroke={PAPER.soft} strokeWidth={26} opacity={0.35} />
      {a > 0.5 ? <path d={`M ${arc(0)} A ${r + 36} ${r + 36} 0 ${a > 180 ? 1 : 0} 1 ${arc(a)}`} stroke={PAPER.red} strokeWidth={26} fill="none" strokeLinecap="butt" /> : null}
      <circle r={r} fill="#F2E8CC" stroke={ink} strokeWidth={8} />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M 0 ${-r + 10} V ${-r + (i % 3 === 0 ? 38 : 24)}`} stroke={ink} strokeWidth={i % 3 === 0 ? 9 : 5} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
      <path d={`M 0 0 V ${-r * 0.78}`} stroke={PAPER.red} strokeWidth={9} strokeLinecap="round" transform={`rotate(${a * 12})`} />
      <path d={`M 0 0 V ${-r * 0.5}`} stroke={ink} strokeWidth={13} strokeLinecap="round" transform={`rotate(${a})`} />
      <circle r={13} fill={ink} />
    </g>
  );
};

/** A bank icon (columns under a pediment) with a red alarm blip; 150 wide, base at y 0. `t` is the frames since it popped. */
export const BankIcon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  const alarm = t > 5 && Math.floor(t / 4) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <path d="M -80 -100 L 0 -150 L 80 -100 Z" fill="#CBB98C" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
      {[-52, -17, 17, 52].map((cx) => <rect key={cx} x={cx - 8} y={-96} width={16} height={74} fill="#EADDB8" stroke={ink} strokeWidth={4} />)}
      <rect x={-86} y={-22} width={172} height={22} fill="#CBB98C" stroke={ink} strokeWidth={5} />
      <circle cx={0} cy={-118} r={9} fill={PAPER.ground} stroke={ink} strokeWidth={3} />
      <g opacity={alarm ? 1 : 0.35}>
        <circle cx={66} cy={-138} r={20} fill={PAPER.red} stroke={ink} strokeWidth={4} />
        <text x={66} y={-130} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#F6EFE3">!</text>
      </g>
    </g>
  );
};

/** A shop front with a broken window: awning, a pane with crack lines and a few shards falling. Base at y 0, ~150 wide. */
export const BrokenShopIcon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  const crack = clamp((t - 4) / 5);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <rect x={-72} y={-130} width={144} height={130} fill="#CBB98C" stroke={ink} strokeWidth={5} />
      <path d="M -82 -130 H 82 L 70 -100 H -70 Z" fill={PAPER.red} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-54} y={-92} width={108} height={68} fill="#9FB4B4" stroke={ink} strokeWidth={4} />
      <path d={`M -10 -92 L 6 -62 L -16 -44 L 4 -24 M 6 -62 L 40 -50 M -16 -44 L -50 -52`} stroke={ink} strokeWidth={4} fill="none" strokeLinecap="round" opacity={crack} />
      {[0, 1, 2].map((i) => {
        const ph = clamp((t - 5 - i * 2) / 14);
        return ph > 0 && ph < 1 ? <path key={i} d="M 0 0 L 8 6 L -4 10 Z" transform={`translate(${-20 + i * 24} ${-40 + 70 * ph * ph}) rotate(${ph * 240})`} fill="#C9DADA" stroke={ink} strokeWidth={2} opacity={1 - ph} /> : null;
      })}
    </g>
  );
};

/** A flame icon that flickers (t = frames since it popped); base at y 0, ~90 tall. */
export const FlameIcon: React.FC<{ x: number; y: number; s?: number; t: number; i: number }> = ({ x, y, s = 1, t, i }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  const fl = 1 + 0.12 * Math.sin(t / 2.3 + i * 1.7);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <Glow x={0} y={-50} r={80} o={0.35} />
      <g transform={`scale(${1 / fl} ${fl})`}>
        <path d="M 0 0 Q -42 -6 -40 -48 Q -38 -78 -14 -104 Q -14 -76 4 -70 Q 8 -100 26 -118 Q 52 -80 44 -40 Q 40 -4 0 0 Z" fill="#D8602A" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 0 -4 Q -20 -8 -18 -34 Q -10 -50 2 -58 Q 6 -40 18 -34 Q 22 -6 0 -4 Z" fill="#F2B84B" />
      </g>
    </g>
  );
};

/** A big ink number (with a thin paper-coloured edge), popping at t = 0. */
export const InkNumber: React.FC<{ x: number; y: number; t: number; text: string; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, t, text, size = 330, color = ink, anchor = 'middle' }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 8));
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <text textAnchor={anchor} fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={color} stroke={PAPER.ground} strokeWidth={size / 22} paintOrder="stroke">{text}</text>
    </g>
  );
};

/** The "ĐÓ LÀ THẬT" stamp on paper: a green-brown disc with a tick drawing on, a ring pulse, sparkles. */
export const PaperTick: React.FC<{ t: number; sub?: string }> = ({ t, sub }) => {
  const disc = 0.5 + 0.5 * backOut(clamp((t + 2) / 7));
  const tick = easeOut(clamp((t - 3) / 8));
  const ring = clamp((t - 3) / 16);
  return (
    <g>
      <g transform={`translate(960 450) scale(${disc})`}>
        <circle r={ring > 0 && ring < 1 ? 150 + ring * 130 : 0} fill="none" stroke="#3E8C5A" strokeWidth={8 * (1 - ring)} opacity={1 - ring} />
        <circle r={150} fill="#3E8C5A" stroke={ink} strokeWidth={8} />
        <path d="M -68 6 L -22 52 L 74 -52" stroke="#F6EFE3" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tick} />
      </g>
      <text x={960} y={735} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={92} fill={ink} letterSpacing={5} opacity={easeOut(clamp((t - 6) / 7))}>ĐÓ LÀ THẬT</text>
      {sub ? <text x={960} y={810} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill={PAPER.soft} letterSpacing={2} opacity={easeOut(clamp((t - 10) / 8))}>{sub}</text> : null}
      <Sparkle x={760} y={330} t={t - 8} s={1.1} />
      <Sparkle x={1170} y={380} t={t - 11} s={0.9} />
    </g>
  );
};
