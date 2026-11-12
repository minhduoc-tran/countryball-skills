import React from 'react';
import { FONT } from '../../engine/fonts';
import { Candle } from '../../countryball/ground-memorial-props';
import { clamp, easeOut, hash } from '../../countryball/fx-math';
import { Glow } from '../../countryball/fx-glow';
import { ramp, Txt } from './chb-common';
import { star } from './chb-table-and-icons';

// Chapter G (the cost, the ruins, Paris, the border, the flag race: 8:45-10:10) shared helpers.
// Re-exports the chapter-B map/text helpers so every G shot imports from one place, and adds: the quiet memorial
// background, waving flag cloth + pole, a small map flag pin, a source chip and a Vietnamese number formatter.
// Everything is a pure function of s (seconds) / t (frames, 30 fps) as noted.
export { sec, ramp, proj, Txt, Pop, Backdrop, Dim, QtMap, MapHud, LAND, YELLOW, RED, BLUE, IMG } from './chb-common';
export { Chip, Vignette } from './chd-common';

export const GOLD = '#E2B95A';
export const SRC_MANY = 'Theo nhiều nguồn';
export const UNSETTLED = 'Số liệu chưa thống nhất';
/** 4000 -> "4.000" */
export const fmtVn = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Quiet dark background with a warm low glow and a few slowly rising motes (never frozen, never loud). */
export const Quiet: React.FC<{ id: string; s: number; glow?: number; cx?: number; cy?: number }> = ({ id, s, glow = 0.5, cx = 960, cy = 800 }) => (
  <g>
    <defs>
      <radialGradient id={`${id}-q`} cx={cx / 1920} cy={cy / 1080} r="0.9">
        <stop offset="0" stopColor="#2A2218" /><stop offset="0.55" stopColor="#12141A" /><stop offset="1" stopColor="#06080C" />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${id}-q)`} />
    <Glow x={cx} y={cy} r={620} color="#FFB347" o={0.12 * glow} />
    {Array.from({ length: 26 }, (_, i) => {
      const y = (((hash(i, 2) * 1300 - s * (12 + hash(i, 3) * 22)) % 1300) + 1300) % 1300 - 110;
      return <circle key={i} cx={hash(i, 1) * 1920 + Math.sin(s * 0.6 + i) * 18} cy={y} r={1.6 + hash(i, 4) * 2.2} fill="#FFD9A0" opacity={0.1 + 0.2 * hash(i, 5)} />;
    })}
  </g>
);

/** Row of candles that light one after another (frame `at0` + i * gap). Positions are foot points. */
export const CandleRow: React.FC<{ t: number; xs: number[]; y: number; at0?: number; gap?: number; s?: number; seed?: number }> = ({ t, xs, y, at0 = 0, gap = 8, s = 110, seed = 0 }) => (
  <g>{xs.map((x, i) => <Candle key={i} x={x} y={y + (i % 2) * 10} s={s * (0.9 + 0.2 * hash(i, seed + 9))} t={t} seed={seed + i} lit={t >= at0 + i * gap} />)}</g>
);

/** Rounded glass panel centred on (x, y). */
export const Panel: React.FC<{ x: number; y: number; w: number; h: number; o?: number; stroke?: string }> = ({ x, y, w, h, o = 1, stroke = GOLD }) => (
  <g opacity={o}>
    <rect x={x - w / 2 + 8} y={y - h / 2 + 12} width={w} height={h} rx={28} fill="#000" opacity={0.4} />
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={28} fill="#10161F" fillOpacity={0.93} stroke={stroke} strokeWidth={5} />
  </g>
);

/** Source line chip under a number ("Theo nhiều nguồn"). */
export const SourceTag: React.FC<{ x: number; y: number; text: string; o?: number; color?: string }> = ({ x, y, text, o = 1, color = GOLD }) => {
  const w = text.length * 24 + 56;
  return (
    <g opacity={o}>
      <rect x={x - w / 2} y={y - 36} width={w} height={64} rx={32} fill="#05080D" fillOpacity={0.9} stroke={color} strokeWidth={3.5} />
      <text x={x} y={y + 12} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={36} fill={color}>{text}</text>
    </g>
  );
};

type FlagId = 'VNM' | 'RVN';
/** Waving flag cloth. (x, y) = top corner on the pole; dir 1 = cloth extends right, -1 = left. Cut into strips that ripple with t. */
export const FlagCloth: React.FC<{ x: number; y: number; w: number; h: number; flag: FlagId; t: number; ph?: number; dir?: 1 | -1; amp?: number }> = ({
  x, y, w, h, flag, t, ph = 0, dir = 1, amp = 0.09,
}) => {
  const N = w > 120 ? 12 : 7, sw = w / N, A = h * amp;
  const dy = (u: number) => A * u * Math.sin(t * 0.2 - u * 4.2 + ph);
  const strips = Array.from({ length: N }, (_, i) => {
    const u = (i + 0.5) / N, x0 = dir === 1 ? x + i * sw : x - (i + 1) * sw, d = dy(u), slope = (dy(u + 0.05) - dy(u - 0.05)) * 3 / h;
    return (
      <g key={i} transform={`translate(0,${d})`}>
        <rect x={x0 - 0.5} y={y} width={sw + 1} height={h} fill={flag === 'VNM' ? '#D8322B' : '#F5CB2F'} />
        {flag === 'RVN' && [0.34, 0.46, 0.58].map((f) => <rect key={f} x={x0 - 0.5} y={y + h * f} width={sw + 1} height={h * 0.065} fill="#C8232C" />)}
        <rect x={x0 - 0.5} y={y} width={sw + 1} height={h} fill="#000" opacity={clamp(slope, -0.25, 0.25) > 0 ? clamp(slope, 0, 0.25) : 0} />
        <rect x={x0 - 0.5} y={y} width={sw + 1} height={h} fill="#FFF" opacity={clamp(-slope, 0, 0.18)} />
      </g>
    );
  });
  const top = Array.from({ length: N + 1 }, (_, i) => `${dir === 1 ? x + i * sw : x - i * sw},${y + dy(i / N)}`);
  const bot = Array.from({ length: N + 1 }, (_, i) => `${dir === 1 ? x + (N - i) * sw : x - (N - i) * sw},${y + h + dy((N - i) / N)}`);
  const midU = 0.5;
  return (
    <g>
      {strips}
      {flag === 'VNM' && <polygon points={star(x + dir * w * midU, y + h / 2 + dy(midU), h * 0.3)} fill="#FFDD2D" stroke="#7A5A00" strokeWidth={Math.max(1.5, h * 0.025)} strokeLinejoin="round" />}
      <polygon points={`${top.join(' ')} ${bot.join(' ')}`} fill="none" stroke="#111" strokeWidth={Math.max(2.5, h * 0.05)} strokeLinejoin="round" />
    </g>
  );
};

/** Flagpole standing on (x, y) with a cloth; `rise` 0..1 hoists the cloth from the foot up to the top of the pole. */
export const FlagPole: React.FC<{ x: number; y: number; h: number; flag: FlagId; t: number; ph?: number; dir?: 1 | -1; cw?: number; rise?: number }> = ({ x, y, h, flag, t, ph = 0, dir = 1, cw, rise = 1 }) => {
  const w = cw ?? h * 0.55, ch = w * 0.66, top = y - h, clothTop = y - ch - 8 + (top + 4 - (y - ch - 8)) * rise;
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={top} stroke="#111" strokeWidth={Math.max(5, h * 0.035) + 3} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x} y2={top} stroke="#CFC7B3" strokeWidth={Math.max(5, h * 0.035)} strokeLinecap="round" />
      <circle cx={x} cy={top - 4} r={Math.max(5, h * 0.03)} fill={GOLD} stroke="#111" strokeWidth={2.5} />
      <FlagCloth x={x + dir * 2} y={clothTop} w={w} h={ch} flag={flag} t={t} ph={ph} dir={dir} />
    </g>
  );
};

/** Small flag pin that pops onto a map spot (x, y = foot). `at` in seconds on the shot clock s. */
export const FlagPin: React.FC<{ x: number; y: number; flag: FlagId; s: number; at: number; t: number; size?: number }> = ({ x, y, flag, s, at, t, size = 78 }) => {
  const k = easeOut(ramp(s, at, at + 0.22));
  if (s < at) return null;
  const ring = ramp(s, at, at + 0.5);
  return (
    <g>
      <circle cx={x} cy={y} r={10 + ring * 34} fill="none" stroke={flag === 'VNM' ? '#FF7A6B' : '#FFD84A'} strokeWidth={4} opacity={(1 - ring) * 0.9} />
      <ellipse cx={x} cy={y} rx={12} ry={5} fill="#000" opacity={0.35} />
      <g transform={`translate(${x},${y}) scale(${0.4 + 0.6 * k}) translate(${-x},${-y})`} opacity={clamp(k * 3)}>
        <FlagPole x={x} y={y} h={size} flag={flag} t={t} ph={x * 0.05} cw={size * 0.62} />
      </g>
    </g>
  );
};

/** Big headline text that fades in at second `at` (outlined, centred). */
export const Head: React.FC<{ s: number; at?: number; y: number; text: string; size?: number; color?: string; x?: number }> = ({ s, at = 0.1, y, text, size = 84, color = '#F4F4F4', x = 960 }) => (
  <Txt x={x} y={y + 14 * (1 - easeOut(ramp(s, at, at + 0.35)))} text={text} size={size} color={color} o={ramp(s, at, at + 0.3)} />
);
