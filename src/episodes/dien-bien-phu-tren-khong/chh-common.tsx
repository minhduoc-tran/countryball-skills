import React from 'react';
import { FONT } from '../../engine/fonts';
import { Glow } from '../../countryball/fx-glow';
import { flicker } from '../../countryball/fx-math';

// Chapter H shared helpers (ending of "Điện Biên Phủ trên không"): full-screen stage, outlined big text, dawn sky,
// candle, hospital, tube-house street, map pin with leader line. All pure functions of seconds `ts`.

export const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
export const ramp = (ts: number, a: number, b: number) => clamp01((ts - a) / Math.max(1e-6, b - a));
export const eio = (u: number) => { const c = clamp01(u); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const eout = (u: number) => 1 - Math.pow(1 - clamp01(u), 3);

export const Stage: React.FC<{ bg?: string; children: React.ReactNode }> = ({ bg = '#0E1D2E', children }) => (
  <g>
    <rect width={1920} height={1080} fill={bg} />
    {children}
  </g>
);

/** Soft dark veil over a map so photo cards / text read. */
export const Veil: React.FC<{ o?: number; color?: string }> = ({ o = 0.5, color = '#050B14' }) => <rect width={1920} height={1080} fill={color} opacity={o} />;

/** Heavy outlined display text, lines centred on x; pops in from `from` (s). */
export const BigText: React.FC<{ ts: number; lines: string[]; x?: number; y: number; size?: number; fill?: string; from?: number; anchor?: 'middle' | 'start'; lh?: number; stroke?: number; sub?: string; subFill?: string }> = ({
  ts, lines, x = 960, y, size = 110, fill = '#FFD84A', from = 0, anchor = 'middle', lh = 1.08, stroke = 14, sub, subFill = '#EAF1F8',
}) => {
  const k = eout((ts - from) / 0.45);
  if (k <= 0) return null;
  const sc = 0.86 + 0.14 * k;
  return (
    <g opacity={k} transform={`translate(${x},${y}) scale(${sc}) translate(${-x},${-y})`}>
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + i * size * lh} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill}
          stroke="#0A0F18" strokeWidth={stroke} strokeLinejoin="round" paintOrder="stroke">{l}</text>
      ))}
      {sub && <text x={x} y={y + lines.length * size * lh + size * 0.1} textAnchor={anchor} fontFamily={FONT.title} fontWeight={600} fontSize={size * 0.38} fill={subFill}
        stroke="#0A0F18" strokeWidth={6} paintOrder="stroke">{sub}</text>}
    </g>
  );
};

/** Dawn sky + hills; k 0..1 = sun rise. Fills the whole stage. */
export const Dawn: React.FC<{ id: string; k: number }> = ({ id, k }) => {
  const sunY = 760 - 300 * eio(k);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2A4A" /><stop offset={0.55} stopColor={k > 0.4 ? '#C9748A' : '#3A3F6B'} /><stop offset="1" stopColor="#F2A65A" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${id}-sky)`} />
      <Glow x={1250} y={sunY} r={420} color="#FFC46B" o={0.5 + 0.3 * k} />
      <circle cx={1250} cy={sunY} r={86} fill="#FFE29A" />
      <path d="M0,820 Q320,730 640,800 T1280,790 T1920,810 L1920,1080 L0,1080 Z" fill="#2A3350" />
      <path d="M0,900 Q400,840 800,890 T1600,880 L1920,900 L1920,1080 L0,1080 Z" fill="#1C2338" />
    </g>
  );
};

/** One candle with a flickering flame and a warm glow. (x, y) = base of the candle. */
export const Candle: React.FC<{ x: number; y: number; ts: number; s?: number; lit?: number; seed?: number }> = ({ x, y, ts, s = 1, lit = 1, seed = 0 }) => {
  const fl = flicker(ts * 30, seed), h = 70 * s;
  return (
    <g>
      <Glow x={x} y={y - h - 20 * s} r={150 * s * lit} color="#FFB347" o={0.55 * lit} />
      <rect x={x - 14 * s} y={y - h} width={28 * s} height={h} rx={5 * s} fill="#F3EBDD" stroke="#2A2118" strokeWidth={3} />
      <rect x={x - 1.5} y={y - h - 12 * s} width={3} height={12 * s} fill="#2A2118" />
      {lit > 0.05 && <path d={`M${x},${y - h - 52 * s * lit * fl} Q${x + 14 * s},${y - h - 22 * s} ${x},${y - h - 10 * s} Q${x - 14 * s},${y - h - 22 * s} ${x},${y - h - 52 * s * lit * fl} Z`} fill="#FFD36B" stroke="#E8832A" strokeWidth={2} />}
    </g>
  );
};

/** Hospital block that rises (build 0..1) with a red cross. (x, y) = bottom centre. */
export const Hospital: React.FC<{ x: number; y: number; w?: number; h?: number; build: number }> = ({ x, y, w = 460, h = 300, build }) => {
  const hh = h * eout(build);
  return (
    <g>
      <rect x={x - w / 2} y={y - hh} width={w} height={hh} fill="#EDE6D6" stroke="#2B2620" strokeWidth={5} />
      {hh > h * 0.6 && Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={x - w / 2 + 34 + (i % 4) * 100} y={y - h + 40 + Math.floor(i / 4) * 90} width={56} height={56} fill="#9CC4E4" stroke="#2B2620" strokeWidth={3} />
      ))}
      <rect x={x - 36} y={y - 64} width={72} height={64} fill="#8A6B4A" stroke="#2B2620" strokeWidth={3} opacity={build > 0.8 ? 1 : 0} />
      <g opacity={ramp(build, 0.7, 1)} transform={`translate(${x},${y - h - 44})`}>
        <circle r={44} fill="#FFF" stroke="#2B2620" strokeWidth={5} />
        <rect x={-10} y={-30} width={20} height={60} fill="#D7343B" /><rect x={-30} y={-10} width={60} height={20} fill="#D7343B" />
      </g>
      <rect x={x - w / 2 - 14} y={y - 10} width={w + 28} height={14} rx={4} fill="#4B463C" />
    </g>
  );
};

const HOUSE_COLORS = ['#EFD9A6', '#E2B58C', '#BFD9D0', '#F1E5CB', '#D9A9A0', '#C9D6A8'];
/** Row of narrow tube houses (Hà Nội style) built one after another. (x, y) = left end of the ground line. */
export const Town: React.FC<{ ts: number; x: number; y: number; n?: number; w?: number; t0?: number; step?: number; seed?: number; lit?: number }> = ({ ts, x, y, n = 11, w = 150, t0 = 0, step = 0.12, seed = 0, lit = 0 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const b = eout((ts - t0 - i * step) / 0.6);
      const hh = (330 + ((i * 53 + seed * 31) % 140)) * b, bx = x + i * w, col = HOUSE_COLORS[(i + seed) % HOUSE_COLORS.length];
      const floors = Math.max(1, Math.floor(hh / 110));
      return (
        <g key={i}>
          <rect x={bx} y={y - hh} width={w - 8} height={hh} fill={col} stroke="#2B2620" strokeWidth={4} />
          <path d={`M${bx - 6},${y - hh} L${bx + w / 2 - 4},${y - hh - 44 * b} L${bx + w + -2},${y - hh} Z`} fill="#B5533A" stroke="#2B2620" strokeWidth={4} />
          {b > 0.7 && Array.from({ length: floors }, (_, f) => (
            <g key={f}>
              <rect x={bx + 24} y={y - hh + 30 + f * 100} width={w - 56} height={58} fill={lit > 0 && (i + f) % 2 ? '#FFD98A' : '#7FA9C9'} stroke="#2B2620" strokeWidth={3} />
              <rect x={bx + 14} y={y - hh + 86 + f * 100} width={w - 36} height={8} fill="#2B2620" />
            </g>
          ))}
        </g>
      );
    })}
    <rect x={x - 20} y={y} width={n * w + 40} height={1080 - y} fill="#4A4A52" />
    <rect x={x - 20} y={y + 4} width={n * w + 40} height={10} fill="#6A6A74" />
  </g>
);

/** Map-pin: dot at its true position, label on a plate at (lx, ly) joined by a leader line. */
export const Pin: React.FC<{ ts: number; from: number; px: number; py: number; lx: number; ly: number; label: string; color?: string }> = ({ ts, from, px, py, lx, ly, label, color = '#FFD84A' }) => {
  const k = eout((ts - from) / 0.5);
  if (k <= 0) return null;
  const W = 40 + label.length * 24;
  return (
    <g opacity={k}>
      <line x1={px} y1={py} x2={px + (lx - px) * k} y2={py + (ly - py) * k} stroke={color} strokeWidth={4} />
      <circle cx={px} cy={py} r={12} fill={color} stroke="#0A0F18" strokeWidth={4} />
      <circle cx={px} cy={py} r={12 + 16 * ((ts * 1.2) % 1)} fill="none" stroke={color} strokeWidth={3} opacity={1 - ((ts * 1.2) % 1)} />
      <g transform={`translate(${lx},${ly})`}>
        <rect x={-W / 2} y={-34} width={W} height={68} rx={16} fill="#15181F" fillOpacity={0.92} stroke={color} strokeWidth={4} />
        <text y={13} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#F4F4F4">{label}</text>
      </g>
    </g>
  );
};

/** Tiny stars for night backdrops. */
export const Stars: React.FC<{ ts: number }> = ({ ts }) => (
  <g>{Array.from({ length: 46 }, (_, i) => {
    const x = (i * 397) % 1920, y = (i * 211) % 620;
    return <circle key={i} cx={x} cy={y} r={1.6 + (i % 3)} fill="#DCE6FF" opacity={0.35 + 0.35 * Math.sin(ts * 1.6 + i)} />;
  })}</g>
);
