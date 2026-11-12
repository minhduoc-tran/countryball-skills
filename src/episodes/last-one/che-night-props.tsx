import React from 'react';
import { Glow, FONT, rnd, Rooftop, Stars, Moon } from '../../engine';

// Props chapter E draws locally (the power is off: candles, a phone's glow, a big red button), in the engine's
// style: flat fills, a darker side away from the light, a warm rim on the lit edge, a contact shadow.

/** The candle's flicker, 0.85..1.15, from the shot clock. */
export const flicker = (t: number, seed = 0) => 1 + 0.09 * Math.sin(t / 2.3 + seed) + 0.06 * Math.sin(t / 5.1 + seed * 2.1) + 0.04 * Math.sin(t / 1.3 + seed * 3.7);

/** A candle in a small holder, base at (x, y); s scales it. The flame leans a little and breathes. */
export const Candle: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number; glow?: number }> = ({ x, y, s = 1, t, seed = 0, glow = 1 }) => {
  const fl = flicker(t, seed);
  const lean = Math.sin(t / 7 + seed) * 3;
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={6} cy={2} rx={46} ry={8} fill="#000" opacity={0.4} />
        <path d="M -34 0 Q -30 -14 0 -14 Q 30 -14 34 0 Z" fill="#6A5470" />
        <rect x={-14} y={-96} width={28} height={84} rx={5} fill="#E9DEC6" />
        <rect x={4} y={-96} width={10} height={84} rx={4} fill="#C7B99C" />
        <path d="M -14 -96 q 3 18 6 0" fill="#F4ECD8" />
        <path d="M -12 -90 L -12 -20" stroke="#FFE7B8" strokeWidth={2.5} opacity={0.6} />
        <path d="M 0 -96 L 0 -104" stroke="#2A1E1E" strokeWidth={3} />
        <g transform={`translate(${lean * 0.3} -104) scale(${1 / fl} ${fl})`}>
          <path d={`M 0 0 Q -13 -12 -2 -38 Q ${lean} -52 ${lean * 1.6} -58 Q 12 -34 13 -14 Q 12 0 0 0 Z`} fill="#FF9A3A" />
          <path d={`M 0 -2 Q -7 -10 -1 -26 Q ${lean * 0.6} -34 6 -22 Q 8 -8 0 -2 Z`} fill="#FFE9A0" />
        </g>
      </g>
      {glow > 0 ? <Glow x={x} y={y - 120 * s} r={330 * s * fl} o={0.7 * glow} /> : null}
    </g>
  );
};

/** A phone, big and from the front, for inserts: x, y the centre, w the width. `children` is the screen's content,
 * drawn in screen coordinates (0, 0 at the screen's centre, 1 unit = 1 px at w 200). */
export const BigPhone: React.FC<{ x: number; y: number; w?: number; rot?: number; lit?: number; children?: React.ReactNode; id: string }> = ({
  x, y, w = 200, rot = 0, lit = 0, children, id,
}) => {
  const h = w * 2.05;
  const s = w / 200;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 14 * s} y={-h / 2 + 20 * s} width={w} height={h} rx={w * 0.16} fill="#000" opacity={0.4} />
      {lit > 0 ? <circle cx={0} cy={0} r={w * 1.7} fill="url(#g3cool)" opacity={0.5 * lit} style={{ mixBlendMode: 'screen' }} /> : null}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.16} fill="#1A1922" stroke="#3E3C4C" strokeWidth={5 * s} />
      <clipPath id={`${id}scr`}>
        <rect x={-w / 2 + w * 0.05} y={-h / 2 + w * 0.05} width={w * 0.9} height={h - w * 0.1} rx={w * 0.12} />
      </clipPath>
      <rect x={-w / 2 + w * 0.05} y={-h / 2 + w * 0.05} width={w * 0.9} height={h - w * 0.1} rx={w * 0.12} fill="#05050A" />
      <g clipPath={`url(#${id}scr)`}>
        <g transform={`scale(${s})`}>{children}</g>
      </g>
      <rect x={-w * 0.12} y={-h / 2 + w * 0.09} width={w * 0.24} height={w * 0.045} rx={w * 0.022} fill="#000" />
    </g>
  );
};

/** The battery icon: an outline, a fill of `pct` percent in red under 20, and the number. Drawn at 1 unit = 1 px. */
export const BatteryIcon: React.FC<{ x: number; y: number; pct: number; s?: number; blink?: number }> = ({ x, y, pct, s = 1, blink = 1 }) => {
  const low = pct < 20;
  const col = low ? '#FF3B3B' : '#7CE0A0';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={blink}>
      <rect x={-46} y={-22} width={86} height={44} rx={9} fill="none" stroke={col} strokeWidth={5} />
      <rect x={42} y={-8} width={8} height={16} rx={3} fill={col} />
      <rect x={-40} y={-16} width={Math.max(5, (74 * pct) / 100)} height={32} rx={4} fill={col} />
      <text x={0} y={74} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={col}>{`${pct}%`}</text>
    </g>
  );
};

/** The big red button on its pedestal, base at (x, y); `glow` 0..1 how lit it is, `press` 0..1 how far it is pushed. */
export const BigRedButton: React.FC<{ x: number; y: number; s?: number; glow?: number; press?: number; t: number; id: string }> = ({ x, y, s = 1, glow = 1, press = 0, t, id }) => {
  const pulse = 0.85 + 0.15 * Math.sin(t / 7);
  const drop = 14 * press;
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={10} cy={4} rx={190} ry={26} fill="#000" opacity={0.55} />
        {/* the pedestal: a drum, dark on the far side, a warm rim where the button's light hits it */}
        <path d="M -150 0 L -128 -170 L 128 -170 L 150 0 Z" fill="#33313E" />
        <path d="M 40 0 L 60 -170 L 128 -170 L 150 0 Z" fill="#26242F" />
        <path d="M -128 -170 L -150 0" stroke="#5A586A" strokeWidth={4} />
        <ellipse cx={0} cy={-170} rx={128} ry={34} fill="#44414F" />
        <ellipse cx={0} cy={-176} rx={116} ry={28} fill="#2A2832" />
        <ellipse cx={0} cy={-176} rx={116} ry={28} fill="none" stroke={`rgba(255,120,90,${0.55 * glow})`} strokeWidth={4} />
        {/* the hazard stripe round the base of the button */}
        <path d="M -96 -178 q 96 40 192 0" stroke="#E7B93C" strokeWidth={9} fill="none" strokeDasharray="22 16" opacity={0.85} />
        {/* the button: a cylinder and a domed top */}
        <g transform={`translate(0 ${drop})`}>
          <path d="M -86 -186 L -86 -222 Q 0 -190 86 -222 L 86 -186 Q 0 -150 -86 -186 Z" fill="#8E1420" />
          <ellipse cx={0} cy={-222} rx={86} ry={24} fill={`rgb(${220 + 30 * glow * pulse}, ${40 + 30 * glow}, ${50 + 20 * glow})`} />
          <ellipse cx={-22} cy={-228} rx={34} ry={9} fill="#FFB8A8" opacity={0.5 + 0.3 * glow} />
          <ellipse cx={0} cy={-222} rx={86} ry={24} fill="none" stroke="#FF9A8A" strokeWidth={3} opacity={0.6} />
        </g>
      </g>
      {glow > 0 ? (
        <g>
          <Glow x={x} y={y - 220 * s} r={420 * s * (0.9 + 0.1 * pulse)} kind="red" o={0.85 * glow} />
          <Glow x={x} y={y - 230 * s} r={160 * s} kind="red" o={0.9 * glow} />
        </g>
      ) : null}
      <title>{id}</title>
    </g>
  );
};

/** A tilted shaft of light from above, falling on (cx, floorY), `w` wide at the floor; for the button reveal. */
export const LightCone: React.FC<{ cx: number; floorY: number; w: number; top?: number; o?: number }> = ({ cx, floorY, w, top = -200, o = 0.5 }) => (
  <path d={`M ${cx - 40} ${top} L ${cx + 40} ${top} L ${cx + w / 2} ${floorY} L ${cx - w / 2} ${floorY} Z`} fill="url(#g3cone)" opacity={o} style={{ mixBlendMode: 'screen' }} />
);

/** Ash, dust and specks floating through a dark space, caught by light only near (cx, cy). */
export const Motes: React.FC<{ t: number; cx: number; cy: number; r: number; n?: number; seed?: number }> = ({ t, cx, cy, r, n = 50, seed = 3 }) => (
  <g style={{ mixBlendMode: 'screen' }}>
    {Array.from({ length: n }).map((_, i) => {
      const a = rnd(seed, i) * Math.PI * 2;
      const d = Math.sqrt(rnd(seed + 1, i)) * r;
      const x = cx + Math.cos(a) * d + Math.sin(t / 34 + i) * 22;
      const y = cy + Math.sin(a) * d * 0.8 - ((t * (0.25 + rnd(seed + 2, i) * 0.4) + rnd(seed + 4, i) * 300) % 300) + 150;
      const near = 1 - Math.min(1, Math.hypot(x - cx, y - cy) / r);
      return <circle key={i} cx={x} cy={y} r={1.4 + rnd(seed + 3, i) * 2.4} fill="#FFC8B0" opacity={0.15 + 0.7 * near * (0.5 + 0.5 * Math.sin(t / 8 + i))} />;
    })}
  </g>
);

/**
 * The rooftop at night with the power off: the dusk rooftop with its sun sunk, the whole city dark (blackout, lights out),
 * a deep blue wash, then stars and the moon over the sky. `black` (0..1) is how far the blackout has swept.
 */
export const NightRoof: React.FC<{ t: number; low?: number; black?: number; moon?: { x: number; y: number }; stars?: number; dim?: number }> = ({
  t, low = 0, black = 1, moon = { x: 1420, y: 230 }, stars = 46, dim = 0.72,
}) => (
  <g>
    <Rooftop t={t} sunX={moon.x} sunY={1500} low={low} blackout={black} lightsOut={black} cityLit={2.6} />
    <rect x={-400} y={-400} width={2720} height={1900} fill="#050A24" opacity={dim} style={{ mixBlendMode: 'multiply' }} />
    {/* the parapet's moonlit top edge and face, so something sits on it */}
    <rect x={-400} y={790 + low} width={2720} height={4} fill="#9AA2D8" opacity={0.55} />
    <rect x={-400} y={794 + low} width={2720} height={30} fill="#2A2E54" opacity={0.55} />
    <g transform={`translate(0 ${low * 0.6})`}>
      <Stars seed={11} x0={220} y0={20} w={1520} h={400} t={t} n={stars} o={0.9} />
      <Moon x={moon.x} y={moon.y} r={58} bloom={0.9} />
    </g>
    <Glow x={moon.x} y={moon.y + low * 0.6} r={700} kind="cool" o={0.22} />
  </g>
);

/** Streaks of wind blowing left to right across the frame: thin pale lines and a few specks, pure in t. */
export const WindStreaks: React.FC<{ t: number; n?: number; seed?: number; o?: number }> = ({ t, n = 18, seed = 21, o = 0.35 }) => (
  <g stroke="#C9D6FF" strokeLinecap="round" fill="none" style={{ mixBlendMode: 'screen' }}>
    {Array.from({ length: n }).map((_, i) => {
      const sp = 14 + rnd(seed, i) * 22;
      const x = (((rnd(seed + 1, i) * 2400 + t * sp) % 2400) + 2400) % 2400 - 240;
      const y = 120 + rnd(seed + 2, i) * 860 + Math.sin(t / 12 + i) * 8;
      const l = 60 + rnd(seed + 3, i) * 120;
      return <path key={i} d={`M ${x} ${y} q ${l / 2} ${-6} ${l} 0`} strokeWidth={2 + rnd(seed + 4, i) * 2} opacity={o * (0.4 + 0.6 * rnd(seed + 5, i))} />;
    })}
  </g>
);
