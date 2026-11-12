import React from 'react';
import { rnd, FONT, Pose, joints, toWorld } from '../../engine';

// Chapter C props (1/3): the "MAI LÀM" sticky note motif, the dusty guitar, the empty savings jar, Pip's stubble (older Pip),
// and a small task box. All pure functions of the shot clock.

export const INK = '#1D2033';

/** The yellow sticky note (Itim hand font, a little crooked). x, y = its centre; w = 160 at s = 1. `lines` are stacked words. */
export const StickyNote: React.FC<{ x: number; y: number; lines: string[]; s?: number; rot?: number; curl?: number }> = ({ x, y, lines, s = 1, rot = -4, curl = 0 }) => {
  const longest = Math.max(...lines.map((l) => l.length));
  const size = lines.length > 1 ? (longest > 4 ? 44 : 56) : 46;
  const top = -(lines.length - 1) * size * 0.5 + size * 0.3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-72} y={-66} width={160} height={160} fill="#000" opacity={0.28} />
      <rect x={-80} y={-80} width={160} height={160} fill="#FFE27A" stroke="#C9A32B" strokeWidth={2} />
      <rect x={-80} y={-80} width={160} height={24} fill="#F2CB4E" opacity={0.7} />
      <path d={`M ${80 - 34 - curl * 6} 80 L 80 ${80 - 34 - curl * 6} L 80 80 Z`} fill="#D9B53A" />
      {lines.map((l, i) => (
        <text key={i} x={0} y={top + i * size * 1.05 + 6} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={size} fill="#3A2A10">
          {l}
        </text>
      ))}
    </g>
  );
};

/**
 * An acoustic guitar standing upright (leaning a few degrees): origin = the bottom of the body, about 640 tall at s = 1.
 * `dust` (0..1) lays a grey film over the body; `shine` (0..1) is a clean new-guitar gleam.
 */
export const Guitar: React.FC<{ x: number; y: number; s?: number; rot?: number; dust?: number; shine?: number; swipe?: number; id: string }> = ({ x, y, s = 1, rot = 5, dust = 0, shine = 0, swipe = 0, id }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <defs>
      <linearGradient id={`${id}wood`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#E0A25C" /><stop offset="0.55" stopColor="#C98A4B" /><stop offset="1" stopColor="#9A6531" />
      </linearGradient>
      <clipPath id={`${id}body`}>
        <ellipse cx={0} cy={-105} rx={108} ry={106} />
        <ellipse cx={0} cy={-246} rx={80} ry={82} />
        <rect x={-66} y={-200} width={132} height={80} />
      </clipPath>
    </defs>
    <ellipse cx={0} cy={4} rx={118} ry={14} fill="#000" opacity={0.35} />
    {/* neck and headstock */}
    <rect x={-17} y={-600} width={34} height={380} fill="#4E3320" stroke={INK} strokeWidth={4} />
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-17} y={-560 + i * 36} width={34} height={3} fill="#C9C4B8" opacity={0.75} />)}
    <path d="M -26 -600 L 26 -600 L 22 -672 L -22 -672 Z" fill="#3E2816" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={-38} y={-660 + i * 20} width={14} height={9} rx={3} fill="#D9D3C4" />
        <rect x={24} y={-660 + i * 20} width={14} height={9} rx={3} fill="#D9D3C4" />
      </g>
    ))}
    {/* body: two bouts and a waist, rim outline */}
    <g fill={INK}>
      <ellipse cx={0} cy={-105} rx={114} ry={112} /><ellipse cx={0} cy={-246} rx={86} ry={88} /><rect x={-72} y={-206} width={144} height={86} />
    </g>
    <g fill={`url(#${id}wood)`}>
      <ellipse cx={0} cy={-105} rx={108} ry={106} /><ellipse cx={0} cy={-246} rx={80} ry={82} /><rect x={-66} y={-200} width={132} height={80} />
    </g>
    <circle cx={0} cy={-212} r={34} fill="#2A1A10" stroke="#6E4630" strokeWidth={6} />
    <rect x={-52} y={-112} width={104} height={14} rx={5} fill="#4E3320" />
    {[-13, -8, -3, 3, 8, 13].map((dx, i) => <path key={i} d={`M ${dx * 0.6} -105 L ${dx * 0.5} -600`} stroke="#E9E4D6" strokeWidth={1.8} opacity={0.85} />)}
    {/* the dust film over the body and a few grey specks on the neck */}
    {dust > 0 ? (
      <g>
        <g clipPath={`url(#${id}body)`}>
          <rect x={-120} y={-340} width={240} height={340} fill="#B9B3A8" opacity={0.62 * dust} />
          {Array.from({ length: 26 }).map((_, i) => (
            <circle key={i} cx={(rnd(3, i) - 0.5) * 220} cy={-30 - rnd(4, i) * 280} r={2 + rnd(5, i) * 5} fill="#D6D0C4" opacity={0.7 * dust} />
          ))}
          {swipe > 0 ? <path d="M 112 -160 Q 0 -146 -112 -176" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - swipe} stroke="#D9A05A" strokeWidth={30} fill="none" strokeLinecap="round" /> : null}
        </g>
        <rect x={-17} y={-600} width={34} height={380} fill="#B9B3A8" opacity={0.4 * dust} />
      </g>
    ) : null}
    {shine > 0 ? <path d="M -70 -170 Q -88 -110 -60 -50" stroke="#FFF3D0" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7 * shine} /> : null}
  </g>
);

/** A glass jar for savings with a coin slot lid: x, y = bottom centre. `coins` stacked at the bottom (0 = empty). 230 tall at s = 1. */
export const SavingsJar: React.FC<{ x: number; y: number; s?: number; coins?: number; id: string }> = ({ x, y, s = 1, coins = 0, id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <linearGradient id={`${id}glass`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#BFE9F2" stopOpacity={0.55} /><stop offset="0.5" stopColor="#E6F7FA" stopOpacity={0.18} /><stop offset="1" stopColor="#9FD3DE" stopOpacity={0.5} />
      </linearGradient>
    </defs>
    <ellipse cx={0} cy={4} rx={112} ry={12} fill="#000" opacity={0.3} />
    {Array.from({ length: coins }).map((_, i) => <ellipse key={i} cx={-40 + (i % 4) * 26} cy={-14 - Math.floor(i / 4) * 12} rx={22} ry={8} fill="#F2C14E" stroke="#B88A1C" strokeWidth={2} />)}
    <path d="M -86 -190 Q -100 -190 -100 -160 L -100 -30 Q -100 0 -70 0 L 70 0 Q 100 0 100 -30 L 100 -160 Q 100 -190 86 -190 Z" fill={`url(#${id}glass)`} stroke="#DDF4F8" strokeWidth={5} />
    <path d="M -78 -170 Q -86 -100 -78 -30" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.55} />
    <rect x={-92} y={-224} width={184} height={40} rx={10} fill="#D9A441" stroke={INK} strokeWidth={5} />
    <rect x={-38} y={-210} width={76} height={9} rx={4} fill="#2A1A10" />
  </g>
);

/** A to-do task box (a card with a tick box and two text lines): 150 x 96 at s = 1, centred. `done` draws the tick. */
export const TaskBox: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string; done?: boolean }> = ({ x, y, s = 1, rot = 0, color = '#F6EFE3', done = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-72} y={-44} width={150} height={96} rx={10} fill="#000" opacity={0.28} />
    <rect x={-75} y={-48} width={150} height={96} rx={10} fill={color} stroke={INK} strokeWidth={4} />
    <rect x={-58} y={-28} width={30} height={30} rx={6} fill="none" stroke={INK} strokeWidth={4} />
    {done ? <path d="M -52 -12 l 8 10 l 14 -22" stroke="#2FBF71" strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
    <path d="M -14 -22 H 54 M -14 -4 H 36 M -58 22 H 50" stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.55} />
  </g>
);

/** Older Pip: a grey-brown stubble over the lower face, drawn after the Hero. Scales and follows the head. */
export const Stubble: React.FC<{ pose: Pose }> = ({ pose }) => {
  const h = toWorld(pose, joints(pose).head);
  const r = 62 * pose.scale;
  const cx = h.x + pose.yaw * r * 0.22;
  return (
    <g>
      {Array.from({ length: 46 }).map((_, i) => {
        const ang = (0.2 + rnd(7, i) * 0.6) * Math.PI;
        const rad = r * (0.62 + rnd(8, i) * 0.3);
        const hide = Math.abs(Math.cos(ang)) < 0.22 && rad < r * 0.8; // keep the mouth clear
        return hide ? null : <circle key={i} cx={cx + Math.cos(ang) * rad * 0.95} cy={h.y + Math.sin(ang) * rad * 0.95} r={2.3 * pose.scale} fill="#4A4250" opacity={0.6} />;
      })}
    </g>
  );
};
