import React from 'react';
import { rnd, clamp, easeOut, DuskSky, Sun, Glow, FONT } from '../../engine';
import { Bird, PerchedBird } from './shots-chb-local-props';

// Chapter B's props for the climb, the shout, the cable of birds and the night: a high-rise wall with a ladder, a power
// cable the birds sit on (and leave), expanding shout arcs, sleepy Zs and a sun beam across a bedside table.

// ---------- a tall building wall with a ladder up it and the dusk sky above its roof edge (world y 0 at the roof edge) ----------
export const TowerWall: React.FC<{ id: string; t: number; cx: number }> = ({ id, t, cx }) => (
  <g>
    <g transform="translate(0 -1100)"><DuskSky id={`${id}sky`} horizonY={1080} /></g>
    <Sun x={cx + 520} y={-280} r={120} t={t} />
    <g filter="url(#blur6)" opacity={0.7}>
      {[[cx - 600, -520, 300, 22], [cx + 100, -700, 380, 26], [cx + 760, -460, 260, 18]].map(([x, y, rx, ry], i) => (
        <g key={i}><ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#6A3E6E" /><ellipse cx={x + 10} cy={y + ry * 0.5} rx={rx * 0.9} ry={ry * 0.45} fill="#F29A6A" opacity={0.7} /></g>
      ))}
    </g>
    {/* the wall, a roof ledge on top, a window grid with lit and dark windows */}
    <rect x={cx - 1400} y={0} width={2800} height={3200} fill="#3E3458" />
    <rect x={cx - 1400} y={-4} width={2800} height={46} fill="#2B2338" />
    <rect x={cx - 1400} y={-6} width={2800} height={5} fill="#FFC98A" opacity={0.5} />
    {Array.from({ length: 14 }).map((_, r) =>
      Array.from({ length: 9 }).map((__, c) => {
        const x = cx - 1020 + c * 250 + (c > 3 ? 90 : 0);
        const y = 160 + r * 230;
        if (Math.abs(x - cx) < 130) return null;
        const q = rnd(31, r * 9 + c);
        return (
          <g key={`${r}-${c}`}>
            <rect x={x} y={y} width={120} height={150} fill="#1B1730" stroke="#2B2640" strokeWidth={8} />
            {q > 0.55 ? <rect x={x + 6} y={y + 6} width={108} height={138} fill="#FFC27A" opacity={0.4 + q * 0.3} /> : null}
            <path d={`M ${x} ${y + 60} L ${x + 120} ${y + 60}`} stroke="#2B2640" strokeWidth={4} />
          </g>
        );
      }),
    )}
    {/* the pipe ladder: two rails and rungs, with a few brackets */}
    <rect x={cx - 74} y={-10} width={12} height={3300} fill="#8A8A98" />
    <rect x={cx + 62} y={-10} width={12} height={3300} fill="#8A8A98" />
    <rect x={cx + 62} y={-10} width={4} height={3300} fill="#FFC98A" opacity={0.5} />
    {Array.from({ length: 48 }).map((_, i) => <rect key={i} x={cx - 74} y={50 + i * 66} width={148} height={9} rx={3} fill="#A8A8B6" />)}
    <Glow x={cx + 520} y={-240} r={900} o={0.5} />
  </g>
);

// ---------- a power cable across the frame with a row of birds on it; each takes off at its own frame ----------
const WIRE = (x: number) => 300 + 70 * (1 - Math.pow((x - 960) / 1100, 2));
const PERCH = [180, 330, 470, 640, 780, 1260, 1420, 1590, 1760];
export const CableBirds: React.FC<{ t: number; off: number; gone?: boolean }> = ({ t, off, gone = false }) => {
  const kick = (i: number) => off + i * 1.1;
  return (
    <g>
      <path d={`M -100 ${WIRE(-100)} Q 960 ${WIRE(960) + 60} 2020 ${WIRE(2020)}`} stroke="#14101C" strokeWidth={8} fill="none" />
      <path d={`M -100 ${WIRE(-100) - 22} Q 960 ${WIRE(960) + 36} 2020 ${WIRE(2020) - 22}`} stroke="#14101C" strokeWidth={5} fill="none" opacity={0.8} />
      {PERCH.map((x, i) => {
        const y = WIRE(x) + 24 * Math.sin((x - 960) / 700) * 0 + 8;
        const k = t - kick(i);
        if (gone && i !== 4) return null;
        if (k < 0) return <PerchedBird key={i} x={x} y={y} s={1.3} flip={i % 2 === 1} peck={Math.max(0, Math.sin(t / 5 + i))} />;
        const vx = (i % 2 ? 1 : -1) * (5 + rnd(2, i) * 6);
        const e = easeOut(clamp(k / 30));
        return <Bird key={i} x={x + vx * k * 1.2} y={y - 12 - 22 * k - 40 * e + 0.12 * k * k} f={t * 0.7 + i * 2} s={1.3 - 0.01 * Math.min(k, 40)} flip={vx > 0} />;
      })}
    </g>
  );
};

// ---------- shout arcs: n concentric arcs swelling out of a mouth at (x, y), facing right ----------
export const ShoutArcs: React.FC<{ x: number; y: number; t: number; face?: 1 | -1; s?: number }> = ({ x, y, t, face = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${face * s} ${s})`}>
    {[0, 1, 2, 3].map((i) => {
      const p = (((t * 0.07 + i / 4) % 1) + 1) % 1;
      const r = 40 + p * 360;
      return <path key={i} d={`M ${r * Math.cos(-0.7)} ${r * Math.sin(-0.7)} A ${r} ${r} 0 0 1 ${r * Math.cos(0.7)} ${r * Math.sin(0.7)}`} stroke="#FFF0D8" strokeWidth={14 * (1 - p) + 2} strokeLinecap="round" fill="none" opacity={0.85 * (1 - p)} />;
    })}
  </g>
);

// ---------- sleepy Zs rising and fading ----------
export const Zzz: React.FC<{ x: number; y: number; t: number; size?: number }> = ({ x, y, t, size = 70 }) => (
  <g fontFamily={FONT.hand} fill="#CFE6FF">
    {[0, 1, 2].map((i) => {
      const p = (((t * 0.022 + i / 3) % 1) + 1) % 1;
      return <text key={i} x={x + 40 * p + Math.sin(t / 9 + i) * 8} y={y - 150 * p} fontSize={size * (0.6 + 0.7 * p)} opacity={Math.sin(p * Math.PI)} transform={`rotate(${-10 + 20 * p} ${x} ${y})`}>Z</text>;
    })}
  </g>
);

// ---------- a diagonal sun beam over a surface, dust drifting through it ----------
export const SunBeam: React.FC<{ t: number; o?: number }> = ({ t, o = 0.3 }) => (
  <g style={{ mixBlendMode: 'screen' }}>
    <polygon points="1500,-100 1900,-100 900,1180 300,1180" fill="#FFE2A8" opacity={o} />
    <polygon points="1700,-100 1850,-100 1150,1180 900,1180" fill="#FFE2A8" opacity={o * 0.7} />
    {Array.from({ length: 26 }).map((_, i) => {
      const k = (rnd(9, i) * 1100 + t * (0.4 + rnd(10, i) * 0.6)) % 1100;
      return <circle key={i} cx={1600 - k * 0.78 + rnd(11, i) * 200} cy={-60 + k + 60 * Math.sin(t / 30 + i)} r={2 + rnd(12, i) * 3.4} fill="#FFF3DC" opacity={0.5 * Math.sin((k / 1100) * Math.PI)} />;
    })}
  </g>
);
