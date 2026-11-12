import React from 'react';
import { FONT } from '../../engine/fonts';
import { backOut, clamp, easeOut } from '../../countryball/fx-math';

// Chapter C shared helpers (Thiệu resigns -> F-5E bombing 08.04 -> campaign opens 26.04 -> five directions -> plan).
// Everything is a pure function of the shot clock: `t` frames (30 fps) or `s` seconds as noted.

/** frames -> seconds */
export const sec = (t: number) => t / 30;
/** 0..1 ramp of s between a and b (seconds) */
export const ramp = (s: number, a: number, b: number) => clamp((s - a) / Math.max(1e-6, b - a));

/** Neutral 1973-75 land colour (same in every chapter). */
export const LAND = { VNM: '#B9A88A' };
export const GOLD = '#E2B95A';
export const YELLOW = '#E8B422';
export const IMG = 'dinh-doc-lap-30-4/img/';
export const credit = (who: string, lic: string) => `Ảnh: ${who} / ${lic}`;

/** Text with a dark outline so it reads on any background. */
export const Txt: React.FC<{
  x: number; y: number; text: string; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number;
  stroke?: string; o?: number; ls?: number; rot?: number;
}> = ({ x, y, text, size = 56, color = '#F4F4F4', anchor = 'middle', weight = 800, stroke = '#0A121C', o = 1, ls = 0, rot = 0 }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.title} fontWeight={weight} fontSize={size} fill={color} stroke={stroke}
    strokeWidth={stroke === 'none' ? 0 : Math.max(5, size * 0.16)} paintOrder="stroke" strokeLinejoin="round" opacity={o} letterSpacing={ls}
    transform={rot ? `rotate(${rot},${x},${y})` : undefined}>{text}</text>
);

/** Pop-in with back-ease about (x, y) starting at second `at`; hidden before. */
export const Pop: React.FC<{ s: number; at: number; x: number; y: number; dur?: number; children: React.ReactNode }> = ({ s, at, x, y, dur = 0.3, children }) => {
  const k = backOut(ramp(s, at, at + dur));
  if (s < at) return null;
  return <g transform={`translate(${x},${y}) scale(${k}) translate(${-x},${-y})`} opacity={clamp(k * 2)}>{children}</g>;
};

/** Card background: navy gradient with a slowly drifting fine grid (cards are never frozen). */
export const Backdrop: React.FC<{ s: number; id: string; top?: string; bottom?: string }> = ({ s, id, top = '#13263B', bottom = '#07111D' }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-bd`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient>
      <pattern id={`${id}-grid`} width={80} height={80} patternUnits="userSpaceOnUse" patternTransform={`translate(${(s * 14) % 80},${(s * 8) % 80})`}>
        <path d="M80,0 L0,0 L0,80" fill="none" stroke="#7FA3C8" strokeWidth={1.4} opacity={0.12} />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${id}-bd)`} />
    <rect width={1920} height={1080} fill={`url(#${id}-grid)`} />
  </g>
);

export const Dim: React.FC<{ o?: number }> = ({ o = 0.5 }) => <rect width={1920} height={1080} fill="#050B15" opacity={o} />;

/** Respectful faceless silhouette (head + shoulders) centred on (x, y) = base of the chest. cap: officer's peaked cap. */
export const Silhouette: React.FC<{ x: number; y: number; s?: number; color?: string; rim?: string; cap?: boolean }> = ({ x, y, s = 1, color = '#1B2735', rim = GOLD, cap = false }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-120,0 Q-118,-86 -52,-104 L-24,-118 L24,-118 L52,-104 Q118,-86 120,0 Z" fill={color} stroke={rim} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-22} y={-150} width={44} height={40} rx={14} fill={color} stroke={rim} strokeWidth={5} />
    <ellipse cx={0} cy={-190} rx={52} ry={62} fill={color} stroke={rim} strokeWidth={5} />
    {cap && <g>
      <path d="M-58,-222 L-74,-262 Q0,-284 74,-262 L58,-222 Z" fill={color} stroke={rim} strokeWidth={5} strokeLinejoin="round" />
      <rect x={-60} y={-228} width={120} height={22} fill={color} stroke={rim} strokeWidth={5} />
      <path d="M-56,-206 Q0,-186 56,-206 L62,-196 Q0,-170 -62,-196 Z" fill={color} stroke={rim} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={0} cy={-244} r={9} fill={rim} />
    </g>}
  </g>
);

/** Name card: dark panel, silhouette on the left, rank line + big name + sub line. Slides in at second `at`. */
export const NameCard: React.FC<{ id: string; x: number; y: number; w?: number; rank: string; name: string; sub?: string; s: number; at: number; cap?: boolean; nameSize?: number }> = ({
  id, x, y, w = 1280, rank, name, sub, s, at, cap = false, nameSize = 76,
}) => {
  const k = easeOut(ramp(s, at, at + 0.45));
  if (s < at) return null;
  return (
    <g transform={`translate(${x + (1 - k) * 900},${y})`} opacity={clamp(k * 1.6)}>
      <rect x={-w / 2 + 8} y={-182} width={w} height={364} rx={26} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-190} width={w} height={364} rx={26} fill="#15202D" stroke={GOLD} strokeWidth={5} />
      <clipPath id={`${id}-nc`}><rect x={-w / 2 + 20} y={-170} width={290} height={324} rx={16} /></clipPath>
      <rect x={-w / 2 + 20} y={-170} width={290} height={324} rx={16} fill="#2A3C50" />
      <g clipPath={`url(#${id}-nc)`}><Silhouette x={-w / 2 + 165} y={152} s={1.12} color="#101A26" cap={cap} /></g>
      <Txt x={-w / 2 + 350} y={-60} text={rank} size={46} color={GOLD} anchor="start" stroke="none" />
      <Txt x={-w / 2 + 350} y={40} text={name} size={nameSize} anchor="start" stroke="none" />
      {sub && <Txt x={-w / 2 + 350} y={118} text={sub} size={38} color="#B9C6D6" anchor="start" stroke="none" weight={600} />}
    </g>
  );
};
