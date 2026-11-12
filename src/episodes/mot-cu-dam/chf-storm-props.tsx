import React from 'react';
import { rnd, mixHex } from '../../engine';

// CHAPTER F local props for the typhoon night, all side-on, drawn in 1920 x 1080 world units, pure functions of t.
//   <StormBack t id flash? />        night storm sky, lightning, houses with lit windows, a sodden road (ground y = GROUND)
//   <FloodFront t y0? flow? />       translucent flood water + foam streaks, drawn AFTER the people so legs are submerged
//   <TinSheet a b id wobble? />      a slab of corrugated metal roof between two world points
//   <TinHouse x ... />               a little house: walls, lit window with neighbours' heads, the roof sheet's fixed eave
//   <Egg .../> lives in chf-hand-and-egg-inserts.tsx

export const GROUND = 805;
const INK = '#10131E';

/** Lightning level 0..1 for a frame (two quick flickers every ~3 s); `phase` shifts the schedule per shot. */
export const lightning = (t: number, phase = 0) => {
  const k = (t + phase) % 96;
  return k < 2 ? 1 : k > 4 && k < 6 ? 0.6 : 0;
};

const houseRow = (id: string, base: number, hMin: number, hMax: number, seed: number, tone: string, win: number) => (
  <g>
    {Array.from({ length: 11 }).map((_, i) => {
      const w = 170 + rnd(seed, i) * 110;
      const x = -80 + i * 190 + (rnd(seed + 1, i) - 0.5) * 40;
      const h = hMin + rnd(seed + 2, i) * (hMax - hMin);
      return (
        <g key={`${id}${i}`}>
          <rect x={x} y={base - h} width={w} height={h + 60} fill={tone} stroke={INK} strokeWidth={4} />
          <path d={`M ${x - 10} ${base - h} L ${x + w * 0.5} ${base - h - 38} L ${x + w + 10} ${base - h} Z`} fill={mixHex(tone, '#000000', 0.35)} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          {rnd(seed + 3, i) < win ? <rect x={x + w * 0.22} y={base - h + 34} width={w * 0.2} height={44} fill="#FFC864" opacity={0.85} /> : null}
          {rnd(seed + 4, i) < win * 0.7 ? <rect x={x + w * 0.62} y={base - h + 34} width={w * 0.2} height={44} fill="#FFC864" opacity={0.7} /> : null}
        </g>
      );
    })}
  </g>
);

/** The sodden night street. `flash` 0..1 forces a lightning wash (default: the lightning schedule). */
export const StormBack: React.FC<{ t: number; id: string; flash?: number; phase?: number }> = ({ t, id, flash, phase = 0 }) => {
  const lg = flash ?? lightning(t, phase);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0E22" />
          <stop offset="100%" stopColor="#2A3656" />
        </linearGradient>
        <linearGradient id={`${id}rd`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C2338" />
          <stop offset="100%" stopColor="#0B0E1A" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={1500} fill={`url(#${id}sk)`} />
      {/* ragged storm cloud underside */}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={i * 150 - 40} cy={70 + Math.sin(i * 1.7 + t * 0.03) * 40} r={150 + rnd(7, i) * 60} fill="#141A30" opacity={0.9} />
      ))}
      {houseRow(`${id}f`, 640, 170, 280, 11, '#1B2236', 0.45)}
      {houseRow(`${id}n`, GROUND - 40, 150, 230, 23, '#232B43', 0.6)}
      {/* a palm bending in the gale */}
      <g transform={`translate(1680 ${GROUND - 20}) rotate(${-14 + Math.sin(t * 0.35) * 5})`}>
        <path d="M 0 0 Q 18 -190 -10 -340" stroke="#0C0F1A" strokeWidth={22} fill="none" strokeLinecap="round" />
        {[-70, -35, 0, 35, 70].map((a) => (
          <path key={a} d={`M -10 -340 Q ${a * 2} ${-420 + Math.abs(a)} ${a * 3.2 + Math.sin(t * 0.5 + a) * 14} ${-330 + Math.abs(a) * 1.2}`} stroke="#0C0F1A" strokeWidth={13} fill="none" strokeLinecap="round" />
        ))}
      </g>
      <rect x={-200} y={GROUND - 30} width={2320} height={420} fill={`url(#${id}rd)`} />
      <rect x={-200} y={GROUND - 30} width={2320} height={5} fill="#3A4766" opacity={0.7} />
      {lg > 0 ? <rect x={-200} y={-200} width={2320} height={1500} fill="#D8E6FF" opacity={0.32 * lg} /> : null}
    </g>
  );
};

/** Flood water over the road: a translucent blue-brown layer with rippling streaks and foam, flowing to the right. */
export const FloodFront: React.FC<{ t: number; y0?: number; flow?: number; o?: number }> = ({ t, y0 = GROUND - 38, flow = 1, o = 0.62 }) => (
  <g>
    <rect x={-200} y={y0} width={2320} height={1200} fill="#34506E" opacity={o} />
    <rect x={-200} y={y0} width={2320} height={10} fill="#9FC0E4" opacity={0.55} />
    {Array.from({ length: 26 }).map((_, i) => {
      const yy = y0 + 14 + rnd(3, i) * 300;
      const l = 80 + rnd(4, i) * 180;
      const x = ((rnd(5, i) * 2400 + t * (9 + rnd(6, i) * 14) * flow) % 2400) - 240;
      return <path key={i} d={`M ${x} ${yy} q ${l * 0.25} -8 ${l * 0.5} 0 t ${l * 0.5} 0`} stroke="#D6E8FF" strokeWidth={3 + rnd(8, i) * 3} fill="none" strokeLinecap="round" opacity={0.2 + rnd(9, i) * 0.35} />;
    })}
  </g>
);

/** A splash ring + droplets around (x, y) that runs with phase `p` 0..1 (call each step of a run). */
export const Splash: React.FC<{ x: number; y: number; p: number; s?: number; seed?: number }> = ({ x, y, p, s = 1, seed = 1 }) => {
  if (p <= 0 || p >= 1) return null;
  return (
    <g opacity={1 - p}>
      <ellipse cx={x} cy={y} rx={(26 + 70 * p) * s} ry={(6 + 14 * p) * s} fill="none" stroke="#E4F0FF" strokeWidth={5 * s} />
      {Array.from({ length: 7 }).map((_, i) => {
        const a = -Math.PI * (0.15 + 0.7 * rnd(seed, i));
        const d = (30 + 80 * rnd(seed + 1, i)) * p * s;
        return <circle key={i} cx={x + Math.cos(a) * d * 1.2} cy={y + Math.sin(a) * d * 1.3 + 90 * p * p * s} r={(5 - 3 * p) * s} fill="#E4F0FF" />;
      })}
    </g>
  );
};

/** Corrugated metal slab from world point a (fixed eave) to b (free end), `th` thick, with ridges and a cold highlight. */
export const TinSheet: React.FC<{ a: { x: number; y: number }; b: { x: number; y: number }; th?: number }> = ({ a, b, th = 22 }) => {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  const ridges = Math.max(4, Math.floor(len / 26));
  return (
    <g transform={`translate(${a.x} ${a.y}) rotate(${ang})`}>
      <rect x={0} y={-th} width={len} height={th} rx={3} fill="#9AA7B6" stroke={INK} strokeWidth={4} />
      {Array.from({ length: ridges }).map((_, i) => (
        <path key={i} d={`M ${(i + 0.5) * (len / ridges)} ${-th + 2} v ${th - 4}`} stroke="#6D7A8C" strokeWidth={5} opacity={0.8} />
      ))}
      <rect x={4} y={-th + 2} width={len - 8} height={4} fill="#E4EEF8" opacity={0.7} />
    </g>
  );
};

/** Window with two neighbours' faces behind the glass (a kid and a granny), lit warm. */
const WindowPeople: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#FFC864" stroke={INK} strokeWidth={4} />
    <circle cx={x + w * 0.3} cy={y + h * 0.62} r={h * 0.2} fill="#F0D2B0" stroke={INK} strokeWidth={3} />
    <path d={`M ${x + w * 0.3 - h * 0.28} ${y + h} Q ${x + w * 0.3} ${y + h * 0.7} ${x + w * 0.3 + h * 0.28} ${y + h} Z`} fill="#8A4A5A" />
    <circle cx={x + w * 0.7} cy={y + h * 0.66 + Math.sin(t * 0.3) * 2} r={h * 0.17} fill="#F0D2B0" stroke={INK} strokeWidth={3} />
    <path d={`M ${x + w * 0.7 - h * 0.24} ${y + h} Q ${x + w * 0.7} ${y + h * 0.76} ${x + w * 0.7 + h * 0.24} ${y + h} Z`} fill="#3E6A8A" />
    <path d={`M ${x + w * 0.5} ${y} V ${y + h}`} stroke={INK} strokeWidth={3} />
  </g>
);

/** A small house, front on: walls + door + lit window with people. The roof is drawn separately (TinSheet from `eave`). */
export const TinHouse: React.FC<{ x: number; t: number; w?: number; h?: number; roof?: boolean }> = ({ x, t, w = 520, h = 190, roof = true }) => {
  const top = GROUND - h;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={h + 20} fill="#B9AE98" stroke={INK} strokeWidth={5} />
      <rect x={x - w / 2} y={top + h - 14} width={w} height={34} fill="#7C7466" opacity={0.7} />
      <WindowPeople x={x - w / 2 + 50} y={top + 36} w={150} h={96} t={t} />
      <rect x={x + w / 2 - 190} y={top + 30} width={110} height={h - 30} fill="#5A3E2E" stroke={INK} strokeWidth={4} />
      <circle cx={x + w / 2 - 100} cy={top + h * 0.62} r={6} fill="#E8C060" />
      {/* the roof's rafters when the sheet lifts */}
      {roof ? <path d={`M ${x - w / 2 - 20} ${top} H ${x + w / 2 + 20}`} stroke={INK} strokeWidth={10} strokeLinecap="round" /> : null}
    </g>
  );
};

/** Bits of metal / leaves / twigs streaking through the gale. */
export const WindDebris: React.FC<{ t: number; n?: number; seed?: number }> = ({ t, n = 14, seed = 3 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const sp = 40 + rnd(seed, i) * 50;
      const x = 2100 - ((rnd(seed + 1, i) * 2600 + t * sp) % 2600);
      const y = 120 + rnd(seed + 2, i) * 620 + Math.sin(t * 0.2 + i) * 30;
      const c = i % 3 === 0 ? '#6E7F96' : '#3E5A42';
      return <ellipse key={i} cx={x} cy={y} rx={12 + rnd(seed + 3, i) * 12} ry={4 + rnd(seed + 4, i) * 4} fill={c} transform={`rotate(${t * 9 + i * 40} ${x} ${y})`} opacity={0.8} />;
    })}
  </g>
);
