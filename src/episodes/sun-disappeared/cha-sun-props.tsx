import React from 'react';
import { SCH, clamp, easeOut, rnd } from '../../engine';

// Chapter A, local props for "What if the Sun disappeared?": beach umbrella and towel, a kite, a schematic Sun and
// Earth, a warning triangle, a letter and a doormat. All pure functions of the shot clock t.

/** Beach umbrella: a striped canopy on a pole. (x, y) = pole foot in the sand; canopy centre ~ 330 * s above. */
export const Umbrella: React.FC<{ x: number; y: number; s?: number; tilt?: number }> = ({ x, y, s = 1, tilt = -8 }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
    <path d="M 0 0 L 0 -330" stroke="#E8D9BE" strokeWidth={9} strokeLinecap="round" />
    <path d="M -230 -300 Q 0 -470 230 -300 Q 150 -330 115 -300 Q 60 -330 0 -300 Q -60 -330 -115 -300 Q -150 -330 -230 -300 Z" fill="#F4E9D2" stroke="#2A1A3A" strokeWidth={5} strokeLinejoin="round" />
    {[-1, 0, 1].map((i) => (
      <path key={i} d={`M ${i * 76 - 38} ${-300 - (1 - Math.abs(i) * 0.1) * 0} Q ${i * 70} -420 ${i * 76 + 38} -300 L ${i * 76} -300 Z`} fill="#E8553E" opacity={0.92} />
    ))}
    <path d="M -230 -300 Q -150 -330 -115 -300 Q -60 -330 0 -300 Q 60 -330 115 -300 Q 150 -330 230 -300" stroke="#2A1A3A" strokeWidth={5} fill="none" />
    <circle cx={0} cy={-398} r={9} fill="#2A1A3A" />
  </g>
);

/** A striped beach towel lying on the sand (a flat parallelogram, perspective). */
export const Towel: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 560 }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={26} rx={w / 2 + 16} ry={20} fill="#000" opacity={0.25} />
    <path d={`M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 + 40} 46 L ${-w / 2 - 40} 46 Z`} fill="#3FA7A0" stroke="#1F5F66" strokeWidth={4} strokeLinejoin="round" />
    {[0.18, 0.4, 0.62, 0.84].map((k, i) => (
      <path key={i} d={`M ${-w / 2 - 40 * k + w * 0} ${46 * k} L ${w / 2 + 40 * k} ${46 * k}`} stroke={i % 2 ? '#FFE9B8' : '#F2784B'} strokeWidth={9} opacity={0.9} />
    ))}
  </g>
);

/** A diamond kite with a wagging bow-tie tail. (x, y) = centre. */
export const Kite: React.FC<{ x: number; y: number; t: number; s?: number; rot?: number }> = ({ x, y, t, s = 1, rot = 14 }) => {
  const wob = Math.sin(t / 7) * 6;
  const tail = Array.from({ length: 6 }).map((_, i) => {
    const px = Math.sin(t / 5 - i * 0.9) * (10 + i * 5);
    const py = 78 + i * 40;
    return { px, py, c: i % 2 ? '#FFD35A' : '#F2784B' };
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + wob}) scale(${s})`}>
      <path d={`M 0 78 ${tail.map((p) => `L ${p.px} ${p.py}`).join(' ')}`} stroke="#2A1A3A" strokeWidth={4} fill="none" />
      {tail.slice(1).map((p, i) => (
        <path key={i} d={`M ${p.px - 14} ${p.py - 8} L ${p.px + 14} ${p.py + 8} L ${p.px + 14} ${p.py - 8} L ${p.px - 14} ${p.py + 8} Z`} fill={p.c} stroke="#2A1A3A" strokeWidth={2} />
      ))}
      <path d="M 0 -84 L 56 -8 L 0 78 L -56 -8 Z" fill="#E8553E" stroke="#2A1A3A" strokeWidth={5} strokeLinejoin="round" />
      <path d="M 0 -84 L 56 -8 L 0 -8 Z" fill="#FFD35A" />
      <path d="M 0 78 L -56 -8 L 0 -8 Z" fill="#FFD35A" />
      <path d="M 0 -84 L 0 78 M -56 -8 L 56 -8" stroke="#2A1A3A" strokeWidth={4} />
    </g>
  );
};

/** Schematic Sun: a circle with 12 rays. `on` 0..1 scales/lights it; `dashed` draws the empty outline only. */
export const SunIcon: React.FC<{ x: number; y: number; r?: number; t: number; on?: number; dashed?: boolean; color?: string }> = ({ x, y, r = 100, t, on = 1, dashed = false, color = SCH.live }) => {
  if (dashed) {
    return <circle cx={x} cy={y} r={r} fill="none" stroke={SCH.dim} strokeWidth={5} strokeDasharray="16 14" strokeDashoffset={-t * 0.6} opacity={on} />;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${on})`} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}aa)` }}>
      <circle r={r} fill="#FFC857" stroke={color} strokeWidth={6} />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M 0 ${-r * 1.25} L 0 ${-r * (i % 2 ? 1.45 : 1.6)}`} transform={`rotate(${i * 30 + t * 0.8})`} stroke={color} strokeWidth={7} strokeLinecap="round" />
      ))}
    </g>
  );
};

/** Schematic Earth: a blue disc with two cream land blobs, a lit side towards `lit` (degrees, 180 = lit from the left). */
export const EarthIcon: React.FC<{ x: number; y: number; r?: number; lit?: number; o?: number }> = ({ x, y, r = 70, lit = 180, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <circle r={r} fill="#2E5C9A" stroke={SCH.line} strokeWidth={5} />
    <path d={`M ${-r * 0.5} ${-r * 0.3} q ${r * 0.3} ${-r * 0.35} ${r * 0.55} ${-r * 0.05} q ${-r * 0.1} ${r * 0.4} ${-r * 0.35} ${r * 0.45} Z`} fill="#6FBF73" />
    <path d={`M ${r * 0.1} ${r * 0.15} q ${r * 0.4} ${-r * 0.1} ${r * 0.5} ${r * 0.25} q ${-r * 0.25} ${r * 0.35} ${-r * 0.45} ${r * 0.1} Z`} fill="#6FBF73" />
    <path d={`M 0 ${-r} A ${r} ${r} 0 0 ${lit > 90 ? 1 : 0} 0 ${r} A ${r * 0.6} ${r} 0 0 ${lit > 90 ? 0 : 1} 0 ${-r} Z`} fill="#0A1224" opacity={0.45} transform={`scale(${lit > 90 ? 1 : -1} 1)`} />
  </g>
);

/** A hazard-style triangle with "!" (the "no warning" icon). */
export const WarningIcon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -110 L 120 90 L -120 90 Z" fill="#FFC857" stroke={SCH.line} strokeWidth={8} strokeLinejoin="round" />
    <path d="M 0 -42 L 0 34" stroke="#2A1A3A" strokeWidth={16} strokeLinecap="round" />
    <circle cx={0} cy={66} r={9} fill="#2A1A3A" />
    <circle cx={0} cy={-8} r={150 + Math.sin(t / 4) * 4} fill="none" stroke="#FFC857" strokeWidth={2} opacity={0.2} />
  </g>
);

/** A red cross-out that draws on from t = 0 over `dur` frames, centred on (x, y), half-size h. */
export const CrossOut: React.FC<{ x: number; y: number; h: number; t: number; dur?: number }> = ({ x, y, h, t, dur = 8 }) => {
  const p = easeOut(clamp(t / dur));
  if (p <= 0) return null;
  const q = clamp(p * 2);
  const q2 = clamp(p * 2 - 1);
  return (
    <g stroke="#FF4A3A" strokeWidth={18} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 10px #FF4A3A88)' }}>
      <path d={`M ${x - h} ${y - h} L ${x - h + 2 * h * q} ${y - h + 2 * h * q}`} />
      {q2 > 0 ? <path d={`M ${x + h} ${y - h} L ${x + h - 2 * h * q2} ${y - h + 2 * h * q2}`} /> : null}
    </g>
  );
};

/** A packet of light: bright streaks pointing right, with a soft glow. (x, y) = front of the packet. */
export const LightPacket: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={60} fill={SCH.glow} opacity={0.22} />
    {[-22, -8, 8, 22].map((dy, i) => (
      <path key={i} d={`M ${-70 - i * 6 + Math.sin(t / 3 + i) * 4} ${dy} L ${-4} ${dy}`} stroke={i % 2 ? '#FFE9A8' : SCH.glow} strokeWidth={7} strokeLinecap="round" />
    ))}
    <circle r={13} fill="#FFF6D8" />
  </g>
);

/** A sealed letter with a small sun stamp. (x, y) = centre, 220 x 150 at s = 1. */
export const Letter: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-110} y={-75} width={220} height={150} rx={6} fill="#F4E7C9" stroke="#6B4A33" strokeWidth={5} />
    <path d="M -110 -75 L 0 10 L 110 -75" stroke="#6B4A33" strokeWidth={5} fill="none" strokeLinejoin="round" />
    <path d="M -110 75 L -30 8 M 110 75 L 30 8" stroke="#B49A74" strokeWidth={3} />
    <rect x={58} y={20} width={40} height={36} rx={3} fill="#FFD35A" stroke="#B8562E" strokeWidth={3} />
    <circle cx={78} cy={38} r={9} fill="#F2784B" />
  </g>
);

/** Simple beach-goer silhouettes (head + body + legs), walking/standing, in a warm dark colour. */
export const Walker: React.FC<{ x: number; y: number; t: number; s?: number; seed: number; dir?: number; walk?: boolean }> = ({ x, y, t, s = 1, seed, dir = 1, walk = true }) => {
  const sw = walk ? Math.sin(t / 3 + seed) * 12 : 0;
  const cols = ['#E8553E', '#3FA7A0', '#FFD35A', '#8E6BBF'];
  return (
    <g transform={`translate(${x + (walk ? dir * t * 1.2 : 0)} ${y}) scale(${s * dir} ${s})`}>
      <ellipse cx={0} cy={4} rx={36} ry={7} fill="#000" opacity={0.22} />
      <path d={`M -8 -70 L ${-8 - sw} 0 M 8 -70 L ${8 + sw} 0`} stroke="#2A1A3A" strokeWidth={11} strokeLinecap="round" />
      <rect x={-18} y={-140} width={36} height={76} rx={16} fill={cols[Math.floor(rnd(seed, 1) * 4) % 4]} stroke="#2A1A3A" strokeWidth={4} />
      <circle cx={0} cy={-162} r={20} fill="#E8B58A" stroke="#2A1A3A" strokeWidth={4} />
    </g>
  );
};
