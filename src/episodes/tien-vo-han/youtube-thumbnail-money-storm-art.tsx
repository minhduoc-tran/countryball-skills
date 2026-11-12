import React from 'react';
import { Hero, HEAD, basePose, LOOKS, Glow, rnd, joints, toWorld } from '../../engine';
import { Note, NOTE_COLS } from './chc-props-money-and-prices';
import { BlackCard } from './cha-card-terminal-props';

type CardProps = React.ComponentProps<typeof BlackCard>;

// The art shared by both infinite-money thumbnails (VN tien-vo-han, EN infinite-money): a money storm. Gold rays burst
// from behind Pip, banknotes rain over the whole frame, Pip stands waist-deep in a mountain of cash on the right,
// shocked, the glowing black ∞ card held high. Each thumbnail adds only its HookText phrase on the left.

const RAYS = 18;
// big notes in the foreground, placed by hand so they never cover the face, the card or the hook text
const FRONT_NOTES: [number, number, number, number][] = [[930, 600, -28, 1.5], [1180, 80, 35, 1.3], [1830, 560, 62, 1.6], [760, 130, -50, 1.2]];

/** Gold sunburst rays on a red-to-black ground, centred behind Pip's head. */
const Burst: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    <defs>
      <radialGradient id="msBg" cx={cx / 1920} cy={cy / 1080} r="0.95">
        <stop offset="0" stopColor="#FFB53A" />
        <stop offset="0.35" stopColor="#D8331F" />
        <stop offset="1" stopColor="#2A0610" />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#msBg)" />
    {Array.from({ length: RAYS }).map((_, i) => {
      const a = (i / RAYS) * Math.PI * 2;
      const b = a + Math.PI / RAYS;
      const R = 2400;
      return <path key={i} d={`M ${cx} ${cy} L ${cx + Math.cos(a) * R} ${cy + Math.sin(a) * R} L ${cx + Math.cos(b) * R} ${cy + Math.sin(b) * R} Z`} fill="#FFE27A" opacity={0.13} />;
    })}
  </g>
);

/** Banknotes scattered over the frame (falling, so tilted and of mixed sizes); deterministic from `seed`. */
const NoteRain: React.FC<{ n: number; seed: number; label: string; s0: number; s1: number; o?: number }> = ({ n, seed, label, s0, s1, o = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <Note key={i} x={rnd(seed, i) * 1960 - 20} y={rnd(seed + 1, i) * 900 - 40} rot={(rnd(seed + 2, i) - 0.5) * 140}
        s={s0 + rnd(seed + 3, i) * (s1 - s0)} c={NOTE_COLS[i % 4]} label={label} o={o} />
    ))}
  </g>
);

/** A mound of notes along the bottom, highest under Pip (x ~1450); `front` draws the rows that cover his waist. */
const CashMountain: React.FC<{ label: string; front?: boolean }> = ({ label, front = false }) => {
  const rows = front ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [-1, -2];
  return (
    <g>
      {rows.flatMap((r) => Array.from({ length: 26 }).map((_, i) => {
        const x = (i / 25) * 2000 - 40 + rnd(40 + r, i) * 60;
        const peak = Math.exp(-(((x - 1450) / 520) ** 2));
        const y = 1100 - (90 + peak * 330) + r * 48 + rnd(50 + r, i) * 30;
        return <Note key={`${r}-${i}`} x={x} y={y} rot={(rnd(60 + r, i) - 0.5) * 70} s={1.15 + rnd(70 + r, i) * 0.4} c={NOTE_COLS[(i + r) % 4]} label={label} />;
      }))}
    </g>
  );
};

/** `Card` = the episode's own black card (the VN one says "NGÂN HÀNG", the EN one "BANK"). */
export const MoneyStormArt: React.FC<{ label: string; Card?: React.FC<CardProps> }> = ({ label, Card = BlackCard }) => {
  const sc = 3.0;
  const pose = {
    ...basePose, x: 1390, y: 470 - HEAD.y * sc, scale: sc, yaw: -0.2, look: -0.35,
    armL: { a: 130, b: 15 }, armR: { a: 150, b: -15 }, expr: 'shock' as const,
  };
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g>
      <Burst cx={1390} cy={330} />
      <NoteRain n={22} seed={11} label={label} s0={0.55} s1={0.9} o={0.8} />
      <CashMountain label={label} />
      <Glow x={1390} y={420} r={560} o={0.4} />
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimR" shadow={0} />
      <CashMountain label={label} front />
      <Card id="msCard" x={hand.x + 20} y={hand.y - 90} s={0.62} rot={10} glow={1} shine={0.42} />
      {FRONT_NOTES.map(([x, y, rot, k], i) => <Note key={i} x={x} y={y} rot={rot} s={k} c={NOTE_COLS[i % 4]} label={label} />)}
    </g>
  );
};
