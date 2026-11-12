import React from 'react';
import { FONT, SCH, mixHex, clamp, easeOut, backOut, kf } from '../../engine';

// Chapter D (savings, the suit, the insight, "cannot make") money props: the black card and its terminal, a banknote
// that can fade to plain paper, a passbook, a grocery basket that empties, and the schematic line icons.
// All pure functions of the shot clock.

const GOLD = '#C9A85A';

/** The matte black card with a gold chip and a thin gold ∞; x, y its centre, about 170 x 108 at s 1. */
export const BlackCard: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-85} y={-54} width={170} height={108} rx={12} fill="#17151D" stroke="#3A3644" strokeWidth={3} />
    <path d="M -85 -30 Q 0 -70 85 -40 L 85 -42 Q 85 -54 73 -54 L -73 -54 Q -85 -54 -85 -42 Z" fill="#fff" opacity={0.06} />
    <rect x={-64} y={-22} width={36} height={28} rx={5} fill={GOLD} />
    <path d="M -64 -8 H -28 M -46 -22 V 6" stroke="#8E7536" strokeWidth={2} />
    <text x={38} y={26} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} fill={GOLD} opacity={0.9}>∞</text>
  </g>
);

/**
 * A card terminal standing up: x, y the middle of its base, about 260 wide and 420 tall at s 1. `ok` 0..1 turns the
 * screen green ("THANH TOÁN THÀNH CÔNG" with a tick); `dim` 0..1 greys it out (nobody is swiping any more).
 */
export const Terminal: React.FC<{ x: number; y: number; s?: number; ok?: number; rot?: number; idle?: string }> = ({ x, y, s = 1, ok = 0, rot = 0, idle = 'QUẸT THẺ' }) => {
  const on = ok > 0.02;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={10} cy={4} rx={150} ry={16} fill="#000" opacity={0.4} />
      <rect x={-130} y={-420} width={260} height={420} rx={26} fill="#2A2D36" stroke="#14151A" strokeWidth={5} />
      <rect x={-130} y={-420} width={40} height={420} rx={20} fill="#1F2229" />
      <rect x={118} y={-400} width={5} height={370} rx={2} fill="#6B7080" opacity={0.6} />
      <rect x={-100} y={-388} width={200} height={140} rx={12} fill={on ? '#0F3A24' : '#16202E'} stroke="#0B0C10" strokeWidth={4} />
      {on ? (
        <g opacity={clamp(ok * 3)}>
          <circle cx={0} cy={-340} r={26} fill="#2FBF71" />
          <path d="M -13 -339 l 9 10 l 18 -22" stroke="#E9FFF2" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={0} y={-290} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={19} fill="#B6F5CF">THANH TOÁN</text>
          <text x={0} y={-268} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={19} fill="#B6F5CF">THÀNH CÔNG</text>
        </g>
      ) : (
        <text x={0} y={-310} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#6F85A6" letterSpacing={2}>{idle}</text>
      )}
      {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
        <rect key={`${r}${c}`} x={-86 + c * 62} y={-230 + r * 52} width={50} height={38} rx={8} fill="#3A3E4A" stroke="#14151A" strokeWidth={2.5} />
      )))}
      <rect x={-70} y={-22} width={140} height={10} rx={5} fill="#0E0F13" />
    </g>
  );
};

/** A banknote, x y its centre, width w, height 0.46 w; `fade` 0..1 drains its colour and print to plain paper. */
export const Banknote: React.FC<{ x: number; y: number; w?: number; rot?: number; fade?: number; text?: string }> = ({ x, y, w = 600, rot = 0, fade = 0, text = '100.000 đ' }) => {
  const h = w * 0.46;
  const body = mixHex('#4F9A8C', '#ECE8DC', fade);
  const ink = mixHex('#2F6A60', '#D8D2C2', fade);
  const pr = 1 - fade;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 8} y={-h / 2 + 12} width={w} height={h} rx={w * 0.02} fill="#000" opacity={0.3} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.02} fill={body} stroke={mixHex('#2A5A50', '#BDB6A4', fade)} strokeWidth={w * 0.008} />
      <rect x={-w / 2 + w * 0.03} y={-h / 2 + w * 0.03} width={w * 0.94} height={h - w * 0.06} rx={w * 0.012} fill="none" stroke={ink} strokeWidth={w * 0.006} opacity={pr} />
      <ellipse cx={0} cy={0} rx={w * 0.17} ry={h * 0.34} fill={ink} opacity={0.5 * pr} />
      <circle cx={-w * 0.3} cy={0} r={h * 0.2} fill="none" stroke={ink} strokeWidth={w * 0.01} opacity={pr} />
      <text x={w * 0.3} y={h * 0.32} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.075} fill={ink} opacity={pr}>{text}</text>
      <text x={-w * 0.4} y={-h * 0.3} fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.06} fill={ink} opacity={pr}>100</text>
      <path d={`M ${-w * 0.45} ${h * 0.4} H ${w * 0.45}`} stroke={ink} strokeWidth={w * 0.006} opacity={0.6 * pr} strokeDasharray={`${w * 0.02} ${w * 0.012}`} />
    </g>
  );
};

/** A closed passbook, x y its centre, w wide (a bit taller than wide x 0.72). "SỔ TIẾT KIỆM" in gold on the cover. */
export const SavingsBook: React.FC<{ x: number; y: number; w?: number; rot?: number; worn?: number }> = ({ x, y, w = 420, rot = 0, worn = 0 }) => {
  const h = w * 1.3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 12} y={-h / 2 + 14} width={w} height={h} rx={10} fill="#000" opacity={0.35} />
      <rect x={-w / 2 + 14} y={-h / 2 + 8} width={w} height={h} rx={8} fill="#EDE3CB" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={mixHex('#8C2F39', '#7A4A44', worn)} stroke="#4A141C" strokeWidth={5} />
      <rect x={-w / 2} y={-h / 2} width={w * 0.07} height={h} rx={6} fill="#6E212B" />
      <rect x={-w / 2 + w * 0.12} y={-h / 2 + h * 0.06} width={w * 0.8} height={h * 0.88} rx={6} fill="none" stroke={GOLD} strokeWidth={4} />
      <circle cx={w * 0.04} cy={-h * 0.22} r={w * 0.13} fill="none" stroke={GOLD} strokeWidth={4} />
      <path d={`M ${w * 0.04 - 22} ${-h * 0.22 + 8} L ${w * 0.04} ${-h * 0.22 - 22} L ${w * 0.04 + 22} ${-h * 0.22 + 8} M ${w * 0.04 - 14} ${-h * 0.22 + 20} H ${w * 0.04 + 14}`} stroke={GOLD} strokeWidth={5} fill="none" strokeLinecap="round" />
      <text x={w * 0.04} y={h * 0.06} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.1} fill={GOLD} letterSpacing={2}>SỔ TIẾT</text>
      <text x={w * 0.04} y={h * 0.06 + w * 0.13} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.1} fill={GOLD} letterSpacing={2}>KIỆM</text>
      <rect x={-w * 0.2} y={h * 0.33} width={w * 0.48} height={h * 0.05} rx={4} fill={GOLD} opacity={0.5} />
    </g>
  );
};

type Grocery = { dx: number; dy: number; kind: 'tomato' | 'bread' | 'milk' | 'cabbage' | 'carrot' | 'egg' };
const ITEMS: Grocery[] = [
  { dx: -62, dy: -34, kind: 'cabbage' }, { dx: 40, dy: -30, kind: 'bread' }, { dx: -8, dy: -58, kind: 'milk' },
  { dx: -78, dy: -70, kind: 'tomato' }, { dx: 62, dy: -76, kind: 'carrot' }, { dx: 8, dy: -102, kind: 'egg' },
];
const GroceryIcon: React.FC<{ kind: Grocery['kind'] }> = ({ kind }) => {
  switch (kind) {
    case 'tomato': return <g><circle r={26} fill="#D94452" stroke="#7A1E2A" strokeWidth={3} /><path d="M -10 -24 l 10 6 l 10 -6" stroke="#4E8A3A" strokeWidth={5} fill="none" /></g>;
    case 'bread': return <g><rect x={-46} y={-24} width={92} height={48} rx={24} fill="#D9A25A" stroke="#7A5226" strokeWidth={3} /><path d="M -20 -14 l 10 28 M 4 -16 l 10 30 M 26 -12 l 8 24" stroke="#A87433" strokeWidth={4} /></g>;
    case 'milk': return <g><rect x={-22} y={-40} width={44} height={80} rx={4} fill="#EEF2F6" stroke="#5A6A80" strokeWidth={3} /><path d="M -22 -40 L 0 -58 L 22 -40 Z" fill="#CFD8E4" stroke="#5A6A80" strokeWidth={3} /><rect x={-22} y={-8} width={44} height={22} fill="#4A7FC0" /></g>;
    case 'cabbage': return <g><circle r={34} fill="#7FB35A" stroke="#3E6A2E" strokeWidth={3} /><path d="M -22 -10 Q 0 -30 22 -10 M -26 8 Q 0 -12 26 8" stroke="#3E6A2E" strokeWidth={3} fill="none" /></g>;
    case 'carrot': return <g transform="rotate(-30)"><path d="M -14 -30 L 14 -30 L 0 40 Z" fill="#E8832E" stroke="#8A4A14" strokeWidth={3} /><path d="M -8 -30 l -4 -14 M 0 -30 v -18 M 8 -30 l 4 -14" stroke="#4E8A3A" strokeWidth={5} /></g>;
    default: return <g><ellipse rx={20} ry={26} fill="#F2E8D2" stroke="#8A7A5A" strokeWidth={3} /><ellipse cx={30} cy={6} rx={18} ry={24} fill="#EADCC0" stroke="#8A7A5A" strokeWidth={3} /></g>;
  }
};

/** A wicker basket of shopping, x y the middle of its base; `left` 0..6 is how many items are still in (it shrinks item by item). */
export const GroceryBasket: React.FC<{ x: number; y: number; s?: number; left: number }> = ({ x, y, s = 1, left }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={150} ry={20} fill="#000" opacity={0.4} />
    {ITEMS.map((it, i) => {
      const k = clamp(left - (ITEMS.length - 1 - i) + 0);
      const sc = easeOut(clamp(k));
      return sc > 0.01 ? (
        <g key={i} transform={`translate(${it.dx} ${it.dy - 40 - (1 - sc) * 50}) scale(${sc * 1.1})`} opacity={sc}>
          <GroceryIcon kind={it.kind} />
        </g>
      ) : null;
    })}
    <path d="M -140 -66 L 140 -66 L 112 0 L -112 0 Z" fill="#B88A55" stroke="#6A4A26" strokeWidth={5} strokeLinejoin="round" />
    {[-90, -45, 0, 45, 90].map((dx) => <path key={dx} d={`M ${dx * 1.15} -66 L ${dx * 0.9} 0`} stroke="#8A6234" strokeWidth={4} />)}
    <path d="M -126 -33 H 126" stroke="#8A6234" strokeWidth={4} />
    <rect x={-146} y={-76} width={292} height={16} rx={8} fill="#C9A06A" stroke="#6A4A26" strokeWidth={4} />
  </g>
);

// ---------- schematic line icons (centred, about 130 tall at s 1) and the "+0" card ----------
const strokeProps = (col: string) => ({ stroke: col, strokeWidth: 6, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });
export type NoMoreKind = 'rice' | 'doctor' | 'clock';
const NoMoreIcon: React.FC<{ kind: NoMoreKind; t: number }> = ({ kind, t }) => {
  const sp = strokeProps(SCH.line);
  if (kind === 'rice') {
    return (
      <g {...sp}>
        <path d="M -70 -4 H 70 Q 66 54 20 62 H -20 Q -66 54 -70 -4 Z" />
        <path d="M -52 -8 Q -40 -62 0 -66 Q 40 -62 52 -8" />
        <path d="M -24 82 H 24" />
        {[-20, 6, 26].map((dx, i) => <circle key={i} cx={dx} cy={-34 + (i % 2) * 14} r={3} fill={SCH.line} />)}
        <path d={`M -20 -84 q 8 -14 0 -26 M 6 -84 q 8 -14 0 -26 M 30 -84 q 8 -14 0 -26`} stroke={SCH.dim} strokeWidth={4} opacity={0.6 + 0.4 * Math.sin(t / 5)} />
      </g>
    );
  }
  if (kind === 'doctor') {
    return (
      <g {...sp}>
        <circle cx={0} cy={-48} r={26} />
        <path d="M -52 66 Q -54 -10 0 -12 Q 54 -10 52 66 Z" />
        <path d="M 0 22 v 30 M -15 37 h 30" stroke={SCH.live} />
        <path d="M -20 -6 Q -30 24 -6 34 Q 14 36 14 18" stroke={SCH.dim} strokeWidth={4} />
      </g>
    );
  }
  return (
    <g {...sp}>
      <circle r={66} />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d="M 0 -56 V -48" strokeWidth={i % 3 === 0 ? 6 : 3} transform={`rotate(${i * 30})`} />)}
      <path d="M 0 0 V -38" transform={`rotate(${t * 6})`} stroke={SCH.live} />
      <path d="M 0 0 V -26" transform={`rotate(${t * 0.5})`} />
    </g>
  );
};

/**
 * "Cannot make" card: the icon big on the left, a label, a swipe of the black card on a little terminal that does
 * nothing (the tick comes, the number stays "+0"), and the red "+0" slamming in. t = 0 is the cut.
 */
export const NoMoreCard: React.FC<{ t: number; len: number; kind: NoMoreKind; label: string; sub?: string }> = ({ t, len, kind, label, sub }) => {
  const iconIn = backOut(clamp((t + 2) / 7));
  const cx = kf(t, [[8, 1180], [20, 1530], [26, 1530], [42, 1290]]);
  const cy = kf(t, [[8, 820], [20, 700], [26, 700], [42, 800]]);
  const tick = clamp((t - 22) / 4);
  const zero = backOut(clamp((t - 27) / 7));
  const shakeX = t > 27 && t < 36 ? (Math.sin(t * 3) * 7 * (36 - t)) / 9 : 0;
  return (
    <g transform={`translate(960 540) scale(${1 + 0.05 * clamp(t / len)}) translate(-960 -540)`}>
      <g transform={`translate(430 470) scale(${2.5 * iconIn})`} style={{ filter: `drop-shadow(0 0 12px ${SCH.glow}66)` }}>
        <NoMoreIcon kind={kind} t={t} />
      </g>
      <text x={430} y={820} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill={SCH.line} letterSpacing={3} opacity={clamp((t - 4) / 6)}>{label}</text>
      {sub ? <text x={430} y={880} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={SCH.dim} letterSpacing={2} opacity={clamp((t - 6) / 6)}>{sub}</text> : null}
      <Terminal x={1560} y={960} s={0.8} ok={tick} idle="QUẸT THẺ" />
      <g opacity={clamp((t - 4) / 5)}>
        <BlackCard x={cx} y={cy} rot={-14 + 14 * clamp((t - 8) / 12)} s={1.0} />
      </g>
      <g transform={`translate(${1330 + shakeX} 480) scale(${zero})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={320} fill="#FF5A4A" stroke="#3A0E14" strokeWidth={12} paintOrder="stroke">+0</text>
      </g>
    </g>
  );
};
