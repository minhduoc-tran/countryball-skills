import React from 'react';
import { SCH, FONT, clamp, easeOut, easeInOut, backOut, rnd } from '../../engine';

// Chapter B, the math cards: line icons and money piles for the schematic "scale" cards (a minute, an hour, a day, a
// year of 1.000 đ a second). All pure functions of the shot clock t.

/** 86400000 -> "86.400.000" (Vietnamese thousands dots, no locale needed). */
export const dots = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** A clock icon whose minute hand makes `turns` turns between t = 0 and `dur` (the hour hand follows at 1/12). */
export const ClockIcon: React.FC<{ x: number; y: number; r?: number; t: number; turns?: number; dur?: number; color?: string; glow?: boolean; start?: number }> = ({
  x, y, r = 120, t, turns = 1, dur = 40, color = SCH.line, glow = false, start = 0,
}) => {
  const p = easeInOut(clamp(t / dur));
  const min = (start + p * turns) * 360;
  const hr = min / 12;
  const hand = (deg: number, len: number, w: number, col: string) => (
    <path d={`M 0 0 L ${Math.sin((deg * Math.PI) / 180) * len} ${-Math.cos((deg * Math.PI) / 180) * len}`} stroke={col} strokeWidth={w} strokeLinecap="round" />
  );
  return (
    <g transform={`translate(${x} ${y})`} style={glow ? { filter: `drop-shadow(0 0 14px ${SCH.glow})` } : undefined}>
      <circle r={r} fill="#16233A" stroke={color} strokeWidth={7} />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M ${Math.sin((i * Math.PI) / 6) * r * 0.82} ${-Math.cos((i * Math.PI) / 6) * r * 0.82} L ${Math.sin((i * Math.PI) / 6) * r * 0.92} ${-Math.cos((i * Math.PI) / 6) * r * 0.92}`} stroke={color} strokeWidth={i % 3 === 0 ? 7 : 4} strokeLinecap="round" />
      ))}
      {hand(hr, r * 0.5, 9, color)}
      {hand(min, r * 0.76, 6, SCH.live)}
      <circle r={9} fill={SCH.live} />
    </g>
  );
};

/** A tear-off page calendar icon: the pages flip away at `rate` frames each; `label` is the big number on the top page. */
export const CalendarIcon: React.FC<{ x: number; y: number; s?: number; t: number; rate?: number; label: string }> = ({ x, y, s = 1, t, rate = 5, label }) => {
  const k = Math.floor(t / rate);
  const ph = (t % rate) / rate;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-130} y={-120} width={260} height={250} rx={16} fill="#16233A" stroke={SCH.line} strokeWidth={7} />
      <rect x={-130} y={-120} width={260} height={64} rx={16} fill={SCH.live} />
      <rect x={-130} y={-76} width={260} height={20} fill={SCH.live} />
      <circle cx={-70} cy={-120} r={9} fill={SCH.ground} stroke={SCH.line} strokeWidth={4} />
      <circle cx={70} cy={-120} r={9} fill={SCH.ground} stroke={SCH.line} strokeWidth={4} />
      <rect x={-120} y={-56} width={240} height={170} rx={8} fill="#E9E2D2" stroke={SCH.dim} strokeWidth={3} />
      {/* the page being torn: it spins and drops away */}
      {t > 0 ? (
        <g transform={`translate(${(rnd(k, 1) - 0.5) * 120 * ph} ${-56 + ph * ph * 330}) rotate(${(rnd(k, 2) - 0.5) * 120 * ph})`} opacity={1 - ph * ph}>
          <rect x={-120} y={0} width={240} height={170} rx={8} fill="#E9E2D2" stroke={SCH.dim} strokeWidth={3} />
        </g>
      ) : null}
      <text y={72} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={label.length > 3 ? 74 : 110} fill="#1B2438">{label}</text>
    </g>
  );
};

/** One gold coin lying flat, centre of its top face at (0, 0), 80 wide. */
const Coin: React.FC = () => (
  <g>
    <rect x={-40} y={0} width={80} height={15} fill="#B97C14" />
    <ellipse cx={0} cy={15} rx={40} ry={11} fill="#B97C14" />
    <ellipse cx={0} cy={0} rx={40} ry={11} fill="#F6C445" stroke="#6E4608" strokeWidth={2.4} />
    <ellipse cx={0} cy={0} rx={27} ry={7} fill="none" stroke="#C98A1E" strokeWidth={2.5} />
    <path d="M -22 -3 Q -6 -8 10 -7" stroke="#FFF1B8" strokeWidth={2.6} fill="none" strokeLinecap="round" />
  </g>
);

/**
 * A pyramid of coin columns standing on (x, y): `cols` columns, the middle one `per` coins high. Coins drop in level by
 * level, one level every `step` frames from t = 0. `s` scales it (a coin is 80 wide at s 1).
 */
export const CoinPile: React.FC<{ x: number; y: number; t: number; cols: number; per: number; s?: number; step?: number }> = ({ x, y, t, cols, per, s = 1, step = 3 }) => {
  const mid = (cols - 1) / 2;
  const order = Array.from({ length: cols }, (_, i) => i).sort((a, b) => Math.abs(b - mid) - Math.abs(a - mid));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={14} rx={(cols * 74) / 2 + 30} ry={20} fill="#000" opacity={0.35} />
      {order.map((i) => {
        const h = Math.max(1, Math.round(per * (1 - Math.abs(i - mid) / (mid + 1.4))));
        return (
          <g key={i} transform={`translate(${(i - mid) * 74} 0)`}>
            {Array.from({ length: h }).map((_, j) => {
              const at = j * step + Math.abs(i - mid) * 1.5;
              const q = clamp((t - at) / 5);
              if (q <= 0) return null;
              return (
                <g key={j} transform={`translate(0 ${-j * 15 - (1 - easeOut(q)) * 90})`} opacity={clamp(q * 3)}>
                  <Coin />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

/** A banknote brick (a band of notes), front face 130 x 60 with a top face; (0, 0) is the middle of the front's base. */
export const BillBrick: React.FC = () => (
  <g>
    <path d="M -65 -60 L -43 -76 L 87 -76 L 65 -60 Z" fill="#7BC48C" stroke="#1F4D31" strokeWidth={2.4} strokeLinejoin="round" />
    <path d="M 65 -60 L 87 -76 L 87 -16 L 65 0 Z" fill="#2F7048" stroke="#1F4D31" strokeWidth={2.4} strokeLinejoin="round" />
    <rect x={-65} y={-60} width={130} height={60} fill="#4C9A62" stroke="#1F4D31" strokeWidth={2.4} />
    <rect x={-14} y={-60} width={28} height={60} fill="#EFE6CF" stroke="#1F4D31" strokeWidth={2} />
    <circle cx={-40} cy={-30} r={11} fill="none" stroke="#CFEBD3" strokeWidth={3} />
    <circle cx={40} cy={-30} r={11} fill="none" stroke="#CFEBD3" strokeWidth={3} />
  </g>
);

/** A wall of banknote bricks, `cols` x `rows`, bricks dropping in from t = 0 (one every `step` frames). x is the centre, y the base. */
export const BillWall: React.FC<{ x: number; y: number; t: number; cols: number; rows: number; s?: number; step?: number }> = ({ x, y, t, cols, rows, s = 1, step = 1.2 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={cols * 70} ry={18} fill="#000" opacity={0.35} />
    {Array.from({ length: rows }).map((_, r) =>
      Array.from({ length: cols }).map((__, c) => {
        const q = clamp((t - (r * cols + c) * step) / 5);
        if (q <= 0) return null;
        const off = r % 2 ? 66 : 0;
        return (
          <g key={`${r}-${c}`} transform={`translate(${(c - (cols - 1) / 2) * 132 + off - 33} ${-r * 58 - (1 - easeOut(q)) * 120})`} opacity={clamp(q * 3)}>
            <BillBrick />
          </g>
        );
      }),
    )}
  </g>
);

/** A pocket calculator, centred on (x, y), about 330 x 470; keys light up in turn, the display types `typed`. */
export const CalcIcon: React.FC<{ x: number; y: number; s?: number; t: number; typed: string; result?: string; resultAt?: number }> = ({ x, y, s = 1, t, typed, result, resultAt = 40 }) => {
  const n = Math.min(typed.length, Math.floor(t / 2.5));
  const hot = Math.floor(t / 4) % 16;
  const shown = result && t >= resultAt ? result : typed.slice(0, n);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-165} y={-235} width={330} height={470} rx={34} fill="#16233A" stroke={SCH.line} strokeWidth={7} />
      <rect x={-135} y={-205} width={270} height={110} rx={14} fill="#0B1220" stroke={SCH.dim} strokeWidth={4} />
      <text x={118} y={-122} textAnchor="end" fontFamily={FONT.ui} fontSize={shown.length > 9 ? 40 : 52} fill={result && t >= resultAt ? SCH.live : '#9BE8B0'}
        style={{ filter: `drop-shadow(0 0 8px ${result && t >= resultAt ? SCH.glow : '#58d68d'})` }}>{shown}{t % 14 < 8 && !(result && t >= resultAt) ? '_' : ''}</text>
      {Array.from({ length: 16 }).map((_, i) => {
        const cx = -100 + (i % 4) * 67;
        const cy = -50 + Math.floor(i / 4) * 66;
        const on = i === hot && t < resultAt;
        const last = i % 4 === 3;
        return <rect key={i} x={cx - 25} y={cy - 22} width={50} height={44} rx={10} fill={on || (last && i === 15 && t >= resultAt) ? SCH.live : last ? '#6A4A2E' : '#243556'} stroke={SCH.line} strokeWidth={3} opacity={0.95} />;
      })}
    </g>
  );
};

/** A big mono number with an orange glow (the counting amount on a card). */
export const BigNum: React.FC<{ x: number; y: number; text: string; size: number; color?: string; anchor?: 'start' | 'middle' | 'end'; pop?: number }> = ({ x, y, text, size, color = SCH.live, anchor = 'middle', pop = 1 }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.ui} fontWeight={700} fontSize={size * (0.9 + 0.1 * backOut(clamp(pop)))} fill={color} style={{ filter: `drop-shadow(0 0 ${size * 0.12}px ${SCH.glow}88)` }}>{text}</text>
);
