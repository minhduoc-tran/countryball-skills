import React from 'react';
import { Hero, Pose, Look, LOOKS, basePose, toWorld, joints, FONT, clamp, easeIn, easeOut, rnd } from '../../engine';

// Chapter D props, part 4: the boredom montage. Pure functions of the shot clock t.
//
//   <FlyingPages t x y w? n? startT? />            calendar pages ripped off and flying away, one every 2 frames
//   <Robber t hitT x ground scale? />              a generic masked robber with a money sack; one punch sends him tumbling off
//   <TimerChip t at x y />                         "00:01" pill with a stopwatch icon + tick that pops in at frame `at`
//   <EcgMonitor t x y w h bpmSpeed? />             heart monitor: calm, slow, tiny, regular beats on a green trace
//   <Tumbler t x y s? />                           a glass of water that does not ripple, for a hand that does not shake

const INK = '#16101A';

/** Torn calendar pages flying away to the upper right, tumbling, each lasting 22 frames. */
export const FlyingPages: React.FC<{ t: number; x: number; y: number; w?: number; n?: number; startT?: number; step?: number }> = ({ t, x, y, w = 300, n = 16, startT = 0, step = 2 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const h = t - startT - i * step;
      if (h < 0 || h > 24) return null;
      const p = h / 24;
      const dir = -0.6 + rnd(9, i) * 1.5;
      const px = x + Math.sin(dir) * 900 * easeIn(p) + (rnd(8, i) - 0.5) * 80;
      const py = y - Math.cos(dir) * 520 * easeOut(p) + 380 * p * p;
      return (
        <g key={i} transform={`translate(${px} ${py}) rotate(${(rnd(7, i) - 0.5) * 240 * p + (i % 2 ? 20 : -20)}) scale(${1 - 0.35 * p})`} opacity={1 - p * p}>
          <rect x={-w / 2} y={0} width={w} height={w * 1.32} fill="#EFE8DA" stroke={INK} strokeWidth={5} />
          <rect x={-w / 2} y={0} width={w} height={w * 0.34} fill={['#22264A', '#3E4A7A', '#6A3A52'][i % 3]} />
          <path d={`M ${-w * 0.4} ${w * 0.5} h ${w * 0.8} M ${-w * 0.4} ${w * 0.7} h ${w * 0.8} M ${-w * 0.4} ${w * 0.9} h ${w * 0.8}`} stroke="#B9AE9A" strokeWidth={5} />
        </g>
      );
    })}
  </g>
);

export const ROBBER: Look = { ...LOOKS.suit, jacket: '#3B3B4A', jacketShade: '#2C2C38', accent: '#E9C46A', limb: '#3B3B4A', shoe: '#14151A', extra: undefined };

/** A masked robber (generic: black eye mask, grey beanie, a sack of money). Faces `side` (1 = right). Before hitT he creeps in, after it he flies. */
export const Robber: React.FC<{ t: number; hitT: number; x: number; ground: number; scale?: number; side?: 1 | -1; flyDist?: number }> = ({ t, hitT, x, ground, scale = 0.7, side = 1, flyDist = 1500 }) => {
  const h = t - hitT;
  const fly = h < 0 ? 0 : easeOut(clamp(h / 28));
  const creep = h < 0 ? Math.sin(t * 0.55) : 0;
  const pose: Pose = {
    ...basePose,
    x: x - side * flyDist * fly + creep * 4 * scale,
    y: ground - 140 * scale - 14 * scale - 520 * Math.sin(Math.PI * fly) * scale * 0.9 * (h >= 0 ? 1 : 0),
    scale,
    facing: side,
    yaw: side * 0.85,
    spin: -side * 520 * fly,
    tilt: h < 0 ? side * 8 : 0,
    expr: h < 0 ? 'smug' : 'shock',
    armL: { a: h < 0 ? 40 : 150, b: h < 0 ? 40 : 20 },
    armR: { a: h < 0 ? 38 : 160, b: h < 0 ? 50 : 10 },
    legL: { a: h < 0 ? 22 * creep : 40, b: h < 0 ? 8 : 40 },
    legR: { a: h < 0 ? -22 * creep : -30, b: h < 0 ? 8 : 30 },
  };
  const hd = toWorld(pose, joints(pose).head);
  const hand = toWorld(pose, joints(pose)[side > 0 ? 'armL' : 'armR'].end);
  const s = scale;
  return (
    <g>
      <Hero look={ROBBER} pose={pose} rimId="rimR" shadow={h < 0 ? 1 : 0} />
      <g transform={`translate(${hd.x} ${hd.y}) rotate(${pose.spin})`}>
        <rect x={-64 * s + side * 12 * s} y={-18 * s} width={120 * s} height={30 * s} rx={10 * s} fill="#0B0910" />
        <path d={`M ${-66 * s} ${-36 * s} Q 0 ${-120 * s} ${66 * s} ${-36 * s} L ${64 * s} ${-26 * s} Q 0 ${-52 * s} ${-64 * s} ${-26 * s} Z`} fill="#5E6270" stroke={INK} strokeWidth={4 * s} />
      </g>
      <g transform={`translate(${hand.x} ${hand.y + 40 * s}) rotate(${pose.spin * 0.6})`}>
        <path d={`M ${-30 * s} 0 Q ${-44 * s} ${52 * s} 0 ${58 * s} Q ${44 * s} ${52 * s} ${30 * s} 0 Q 0 ${-14 * s} ${-30 * s} 0 Z`} fill="#8A7A4A" stroke={INK} strokeWidth={4 * s} />
        <text y={44 * s} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34 * s} fill="#2A2210">$</text>
      </g>
    </g>
  );
};

/** "00:01" in a pill with a stopwatch and a green tick, popping in at frame `at` (world or screen units). */
export const TimerChip: React.FC<{ t: number; at: number; x: number; y: number; s?: number }> = ({ t, at, x, y, s = 1 }) => {
  const h = t - at;
  if (h < 0) return null;
  const pop = 1 + 0.25 * Math.max(0, 1 - h / 6);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`}>
      <rect x={-170} y={-52} width={340} height={104} rx={52} fill="#0E1626" stroke="#7FD4FF" strokeWidth={6} opacity={0.95} />
      <g transform="translate(-132 0)" stroke="#E8F6FF" strokeWidth={6} fill="none" strokeLinecap="round">
        <circle r={26} />
        <path d="M 0 -26 V -36 M -8 -36 H 8 M 0 0 L 12 -12" />
      </g>
      <text x={14} y={22} textAnchor="middle" fontFamily={FONT.ui} fontSize={64} fill="#FFE27A" letterSpacing={2}>00:01</text>
      <g transform="translate(128 0)">
        <circle r={20} fill="#5BD68A" />
        <path d="M -9 1 l 6 8 l 12 -15" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** A heart monitor screen: dark glass, a green trace with calm small beats (one every `period` frames), scrolling left. */
export const EcgMonitor: React.FC<{ t: number; x: number; y: number; w: number; h: number; period?: number }> = ({ t, x, y, w, h, period = 40 }) => {
  const pts: string[] = [];
  const N = 220;
  for (let i = 0; i <= N; i++) {
    const px = (i / N) * w;
    // sample position along time: the trace scrolls left, newest at the right
    const tt = t - (1 - i / N) * 110;
    const ph = (((tt % period) + period) % period) / period; // 0..1 within a beat
    let v = 0;
    if (ph > 0.12 && ph < 0.22) v = 0.08 * Math.sin(((ph - 0.12) / 0.1) * Math.PI); // P wave
    if (ph > 0.3 && ph < 0.34) v = -0.07 * Math.sin(((ph - 0.3) / 0.04) * Math.PI);
    if (ph > 0.34 && ph < 0.4) v = 0.42 * Math.sin(((ph - 0.34) / 0.06) * Math.PI); // small calm R
    if (ph > 0.4 && ph < 0.45) v = -0.1 * Math.sin(((ph - 0.4) / 0.05) * Math.PI);
    if (ph > 0.56 && ph < 0.72) v = 0.12 * Math.sin(((ph - 0.56) / 0.16) * Math.PI); // T wave
    pts.push(`${(x + px).toFixed(1)},${(y + h / 2 - v * h * 0.8).toFixed(1)}`);
  }
  return (
    <g>
      <rect x={x - 40} y={y - 40} width={w + 80} height={h + 80} rx={30} fill="#1C2230" stroke={INK} strokeWidth={8} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#07140E" />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={x + (i * w) / 12} y1={y} x2={x + (i * w) / 12} y2={y + h} stroke="#12301F" strokeWidth={2} />)}
      {Array.from({ length: 5 }).map((_, i) => <line key={i} x1={x} y1={y + (i * h) / 5} x2={x + w} y2={y + (i * h) / 5} stroke="#12301F" strokeWidth={2} />)}
      <polyline points={pts.join(' ')} fill="none" stroke="#3DFF8A" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" opacity={0.25} style={{ filter: 'blur(6px)' }} />
      <polyline points={pts.join(' ')} fill="none" stroke="#6BFFA6" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x + w} cy={pts.length ? Number(pts[N].split(',')[1]) : y} r={9} fill="#E9FFF2" />
    </g>
  );
};

/** A tumbler of water seen side-on: the surface is perfectly level. x, y = bottom centre. */
export const Tumbler: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -70 -240 L -56 0 L 56 0 L 70 -240 Z" fill="#BFE6F5" fillOpacity={0.25} stroke="#EAF8FF" strokeWidth={8} strokeLinejoin="round" />
    <path d="M -66 -170 L -54 -6 L 54 -6 L 66 -170 Z" fill="#5BB4E8" fillOpacity={0.7} />
    <path d="M -66 -170 H 66" stroke="#EAF8FF" strokeWidth={6} />
    <path d="M -46 -150 L -40 -30" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
  </g>
);
