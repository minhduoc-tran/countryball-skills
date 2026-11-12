import React from 'react';
import { clamp, easeOut, backOut, rnd, FONT, UI, SCH } from '../../engine';

// Chapter B props (1/4): the yellow "MAI LÀM" sticky note (the episode's motif), the crossed-out LƯỜI label, line icons
// (clock, heart, brain, smiley, spinner, battery), the source tag and the "BẠN CỦA NGÀY MAI" name tag.
// Everything is a pure function of the counters it is given (t counts frames from the moment the thing appears).

/** The sticky note, slightly crooked. t < 0 hides it; it slaps on with an overshoot. */
export const Sticky: React.FC<{ x: number; y: number; t?: number; rot?: number; s?: number; text?: string }> = ({ x, y, t = 99, rot = -5, s = 1, text = 'MAI LÀM' }) => {
  if (t < 0) return null;
  const k = 0.85 + 0.15 * backOut(clamp(t / 6));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * k})`} opacity={clamp(t / 2 + 0.4)}>
      <rect x={-52} y={-44} width={112} height={104} fill="#000" opacity={0.28} />
      <rect x={-58} y={-52} width={116} height={106} fill="#F7D94C" />
      <path d="M 40 54 L 58 36 L 58 54 Z" fill="#D9B730" />
      <rect x={-58} y={-52} width={116} height={14} fill="#FFE97A" />
      <text x={0} y={14} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={30} fill="#5A3A12" transform="rotate(-3)">{text}</text>
    </g>
  );
};

/** A red cross-out line (or an X) that draws on from t = 0. */
export const Strike: React.FC<{ x: number; y: number; w: number; t: number; x2?: boolean; color?: string; width?: number }> = ({ x, y, w, t, x2 = false, color = '#FF4A3F', width = 14 }) => {
  const p = easeOut(clamp(t / 7));
  const q = easeOut(clamp((t - 5) / 7));
  if (t < 0) return null;
  const h = x2 ? w * 0.7 : 0;
  return (
    <g stroke={color} strokeWidth={width} strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 8px rgba(255,74,63,0.6))' }}>
      <path d={`M ${x - w / 2} ${y - h / 2} L ${x - w / 2 + w * p} ${y - h / 2 + (x2 ? h : 0) * p}`} />
      {x2 ? <path d={`M ${x + w / 2} ${y - h / 2} L ${x + w / 2 - w * q} ${y - h / 2 + h * q}`} /> : null}
    </g>
  );
};

/** The "LƯỜI" label: a cream pill with the word, struck through by a red line. */
export const LazyLabel: React.FC<{ x: number; y: number; t: number; strikeAt?: number; s?: number }> = ({ x, y, t, strikeAt = 12, s = 1 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  const shake = t > strikeAt ? Math.sin((t - strikeAt) * 1.6) * 3 * Math.exp(-(t - strikeAt) / 8) : 0;
  return (
    <g transform={`translate(${x + shake} ${y}) scale(${s * k})`}>
      <rect x={-150} y={-62} width={300} height={124} rx={62} fill="#F6EFE3" stroke="#121019" strokeWidth={6} />
      <text x={0} y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={98} fill="#2E2B3D" letterSpacing={4}>LƯỜI</text>
      <Strike x={0} y={4} w={340} t={t - strikeAt} />
    </g>
  );
};

/** A line clock icon; the hand sweeps with `t`. */
export const ClockIcon: React.FC<{ x: number; y: number; r?: number; t: number; color?: string }> = ({ x, y, r = 120, t, color = SCH.line }) => (
  <g transform={`translate(${x} ${y})`} stroke={color} strokeLinecap="round" fill="none">
    <circle r={r} strokeWidth={r / 10} fill="#16233A" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M 0 ${-r * 0.82} L 0 ${-r * 0.68}`} transform={`rotate(${i * 90})`} strokeWidth={r / 16} />)}
    <path d={`M 0 0 L 0 ${-r * 0.62}`} strokeWidth={r / 11} transform={`rotate(${t * 9})`} stroke={SCH.live} />
    <path d={`M 0 0 L 0 ${-r * 0.4}`} strokeWidth={r / 9} transform={`rotate(${t * 0.75 + 40})`} />
    <circle r={r / 12} fill={color} stroke="none" />
  </g>
);

/** A heart that beats (`beat` 0..1 pulse amount); `s` scales it. */
export const HeartIcon: React.FC<{ x: number; y: number; s?: number; t: number; color?: string; beat?: number }> = ({ x, y, s = 1, t, color = '#FF5A6E', beat = 1 }) => {
  const pulse = 1 + 0.12 * beat * Math.max(0, Math.sin(t * 0.8)) ** 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pulse})`} style={{ filter: 'drop-shadow(0 0 22px rgba(255,90,110,0.65))' }}>
      <path d="M 0 70 C -120 -10 -80 -90 -34 -82 C -12 -78 0 -62 0 -48 C 0 -62 12 -78 34 -82 C 80 -90 120 -10 0 70 Z" fill={color} stroke="#121019" strokeWidth={7} strokeLinejoin="round" />
      <path d="M -62 -42 Q -58 -66 -36 -66" stroke="#FFC2CB" strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** A pink brain (two lobes with folds), used as an icon and as the body of the running brain. */
export const BrainIcon: React.FC<{ x: number; y: number; s?: number; color?: string; glow?: number }> = ({ x, y, s = 1, color = '#F4A3BA', glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} style={glow ? { filter: `drop-shadow(0 0 ${22 * glow}px rgba(255,150,190,0.7))` } : undefined}>
    <path d="M 0 70 C -56 76 -112 50 -112 4 C -128 -18 -108 -62 -66 -62 C -48 -92 -8 -92 0 -68 C 8 -92 48 -92 66 -62 C 108 -62 128 -18 112 4 C 112 50 56 76 0 70 Z" fill={color} stroke="#121019" strokeWidth={7} strokeLinejoin="round" />
    <path d="M 0 -66 L 0 66" stroke="#C9708E" strokeWidth={6} strokeLinecap="round" />
    <path d="M -92 -6 q 14 -22 28 0 t 28 0 M -86 30 q 12 -20 24 0 t 24 0 M -66 -44 q 10 -14 20 0 t 20 0 M 92 -6 q -14 -22 -28 0 t -28 0 M 86 30 q -12 -20 -24 0 t -24 0 M 66 -44 q -10 -14 -20 0 t -20 0" stroke="#C9708E" strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

/** A round smiley that wobbles in a phone screen. */
export const Smiley: React.FC<{ x: number; y: number; r?: number; t?: number }> = ({ x, y, r = 40, t = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t / 5) * 6})`}>
    <circle r={r} fill="#FFD84A" stroke="#7A5A10" strokeWidth={r / 9} />
    <circle cx={-r * 0.36} cy={-r * 0.2} r={r * 0.11} fill="#4A3410" />
    <circle cx={r * 0.36} cy={-r * 0.2} r={r * 0.11} fill="#4A3410" />
    <path d={`M ${-r * 0.5} ${r * 0.12} Q 0 ${r * 0.78} ${r * 0.5} ${r * 0.12}`} stroke="#4A3410" strokeWidth={r / 8} fill="none" strokeLinecap="round" />
  </g>
);

/** A loading wheel: eight dashes whose brightness chases round. */
export const Spinner: React.FC<{ x: number; y: number; r?: number; t: number; color?: string }> = ({ x, y, r = 60, t, color = '#BFD6FF' }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: 8 }).map((_, i) => (
      <path key={i} d={`M 0 ${-r} L 0 ${-r * 0.58}`} stroke={color} strokeWidth={r / 6} strokeLinecap="round" transform={`rotate(${i * 45})`} opacity={0.18 + 0.82 * (((i - Math.floor(t / 2.4)) % 8 + 8) % 8) / 7} />
    ))}
  </g>
);

/** A battery icon at `pct` (0..100), red under 20 and blinking. */
export const Battery: React.FC<{ x: number; y: number; pct: number; s?: number; t?: number }> = ({ x, y, pct, s = 1, t = 0 }) => {
  const low = pct <= 20;
  const col = low ? '#FF4A3F' : '#5BE08A';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={low && t % 12 > 8 ? 0.45 : 1}>
      <rect x={-60} y={-26} width={112} height={52} rx={10} fill="none" stroke="#F6EFE3" strokeWidth={6} />
      <rect x={52} y={-11} width={10} height={22} rx={3} fill="#F6EFE3" />
      <rect x={-52} y={-18} width={Math.max(6, 96 * pct / 100)} height={36} rx={5} fill={col} />
    </g>
  );
};

/** A small source tag in the mono face: a paper icon and the citation, e.g. "STEEL, 2007". */
export const SourceTag: React.FC<{ x: number; y: number; t: number; text: string; size?: number }> = ({ x, y, t, text, size = 40 }) => {
  if (t < 0) return null;
  const w = text.length * size * 0.62 + 120;
  const k = backOut(clamp(t / 7));
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={size * 0.95} fill={UI.pill} opacity={0.88} stroke="#8394B4" strokeWidth={3} />
      <g transform={`translate(${-w / 2 + 40} 0)`}>
        <rect x={-14} y={-20} width={28} height={38} rx={3} fill="#F6EFE3" />
        <path d="M -7 -8 L 7 -8 M -7 0 L 7 0 M -7 8 L 2 8" stroke="#6B7690" strokeWidth={3} strokeLinecap="round" />
      </g>
      <text x={28} y={size * 0.34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={UI.text} letterSpacing={2}>{text}</text>
    </g>
  );
};

/** A name tag (red band on top is left off: just a white label with a pin), swings in on `t`. */
export const NameTag: React.FC<{ x: number; y: number; t: number; text: string; w?: number }> = ({ x, y, t, text, w = 640 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 8));
  const swing = Math.sin(t / 3.2) * 5 * Math.exp(-t / 14);
  return (
    <g transform={`translate(${x} ${y}) rotate(${-3 + swing}) scale(${k})`}>
      <rect x={-w / 2 + 8} y={-52} width={w} height={116} rx={14} fill="#000" opacity={0.3} />
      <rect x={-w / 2} y={-60} width={w} height={116} rx={14} fill="#F6EFE3" stroke="#121019" strokeWidth={6} />
      <rect x={-w / 2} y={-60} width={w} height={26} rx={14} fill="#E05A4A" />
      <rect x={-w / 2} y={-46} width={w} height={12} fill="#E05A4A" />
      <circle cx={0} cy={-47} r={6} fill="#F6EFE3" />
      <text x={0} y={34} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill="#2E2B3D" letterSpacing={1}>{text}</text>
    </g>
  );
};

/** Seeded sweat / worry drops around a point (pure function of t). */
export const SweatDrops: React.FC<{ x: number; y: number; t: number; n?: number }> = ({ x, y, t, n = 3 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = ((t + i * 9) % 27) / 27;
      return <path key={i} transform={`translate(${x + (rnd(7, i) - 0.5) * 80} ${y + p * 50}) scale(${1 - p * 0.3})`} d="M 0 -14 Q 9 2 0 10 Q -9 2 0 -14 Z" fill="#8FD3FF" opacity={1 - p} />;
    })}
  </g>
);
