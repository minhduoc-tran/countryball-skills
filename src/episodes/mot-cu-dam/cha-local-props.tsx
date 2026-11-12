import React from 'react';
import { Hero, Look, walkPose, Pose, clamp, rnd, LOOKS, AlarmClock } from '../../engine';
import { DawnBedroom } from '../last-one/shots-cha-morning-bedroom';

// Chapter A local props: the fleeing crowd, a cloud ceiling, rubble, and the bedside table that gets punched in two.

/** A panicked runner (arms up, mouth open) crossing the street; `dir` -1 runs screen-left. Feet on `ground`. */
export const Runner: React.FC<{ t: number; x: number; ground: number; scale: number; look: Look; dir?: 1 | -1; ph?: number; rimId?: string }> = ({
  t, x, ground, scale, look, dir = -1, ph = 0, rimId = 'rimBlue',
}) => {
  const p = t * 0.85 + ph;
  const flail = Math.sin(p * 1.3) * 18;
  const pose: Pose = {
    ...walkPose(x, p, ground, scale, { expr: 'shock', armL: { a: 150 + flail, b: 20 }, armR: { a: 135 - flail, b: 25 }, tilt: 9 * dir }, dir),
  };
  return <Hero look={look} pose={pose} rimId={rimId} shadow={0.6} />;
};

export const CROWD: Look[] = [LOOKS.mo, LOOKS.mom, LOOKS.sis, LOOKS.suit];

/** A rolling black cloud ceiling filling the top of the frame (screen space): layered blobs drifting, optional lightning. */
export const CloudCeiling: React.FC<{ t: number; base?: number; flash?: number }> = ({ t, base = 520, flash = 0 }) => (
  <g>
    <rect x={-100} y={-100} width={2120} height={base + 140} fill="#0B0A14" />
    {[0, 1, 2].map((layer) => (
      <g key={layer} transform={`translate(${((t * (0.6 + layer * 0.5)) % 400) - 400} 0)`}>
        {Array.from({ length: 16 }).map((_, i) => {
          const cx = i * 270 + rnd(layer + 3, i) * 90;
          const cy = base - 160 + layer * 70 - rnd(layer + 9, i) * 120;
          const r = 150 + rnd(layer + 5, i) * 110;
          return <ellipse key={i} cx={cx} cy={cy} rx={r * 1.35} ry={r * 0.8} fill={['#15131F', '#1E1B2C', '#2A2639'][layer]} stroke="#0B0A14" strokeWidth={6} />;
        })}
      </g>
    ))}
    <rect x={-100} y={-100} width={2120} height={base + 140} fill="#CFE0FF" opacity={flash * 0.5} style={{ mixBlendMode: 'screen' }} />
  </g>
);

/** A heap of broken concrete: grey chunks with a lit top edge. (x, y) = bottom centre. */
export const Rubble: React.FC<{ x: number; y: number; s?: number; seed?: number }> = ({ x, y, s = 1, seed = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={330} ry={30} fill="#000" opacity={0.4} />
    {Array.from({ length: 11 }).map((_, i) => {
      const u = (i / 10 - 0.5) * 520;
      const h = 70 + 120 * (1 - Math.abs(u) / 300) * (0.6 + rnd(seed, i) * 0.8);
      const w = 70 + rnd(seed + 2, i) * 60;
      const lean = (rnd(seed + 4, i) - 0.5) * 40;
      return (
        <g key={i}>
          <path d={`M ${u - w} 0 L ${u - w * 0.5 + lean} ${-h} L ${u + w * 0.35 + lean} ${-h * 0.85} L ${u + w} 0 Z`} fill={['#5C5A66', '#6E6B78', '#4A4854'][i % 3]} stroke="#17141F" strokeWidth={5} strokeLinejoin="round" />
          <path d={`M ${u - w * 0.5 + lean} ${-h} L ${u + w * 0.35 + lean} ${-h * 0.85}`} stroke="#B9B4C6" strokeWidth={4} opacity={0.6} />
        </g>
      );
    })}
    <path d="M -80 -20 L -20 -140 M 90 -10 L 140 -60" stroke="#C4622D" strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** The blurred morning bedroom behind a macro insert (the table and clock are drawn in front, in screen space). */
export const BedsideBackdrop: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <g filter="url(#blur16)">
      <g transform="translate(-520 -520) scale(1.9)">
        <DawnBedroom t={t + 20} id={id} clock="07:00" />
      </g>
    </g>
    <rect x={-100} y={-100} width={2120} height={1280} fill="#0A0814" opacity={0.28} />
  </g>
);

const WOOD = { top: '#B98A5A', topLight: '#D9A874', front: '#8C6240', dark: '#5E3F28', line: '#2A1A12' };

/**
 * The bedside table seen from the front, slightly above. (x, y) = the front-top edge centre, w wide. `snap` (degrees, 0 = whole)
 * breaks it in the middle: each half pivots about its outer leg, the jagged inner ends drop. `cracks` 0..1 draws a crack growing.
 */
export const BedsideTable: React.FC<{ x: number; y: number; w: number; snap?: number; cracks?: number; legs?: boolean; floorY?: number }> = ({
  x, y, w, snap = 0, cracks = 0, legs = true, floorY = y + 330,
}) => {
  const half = w / 2;
  const slab = (
    <g>
      {/* top face, front apron with a jagged inner end */}
      <path d={`M 14 -40 L ${half - 4} -40 L ${half + 6} -26 L ${half - 8} -12 L ${half + 4} 0 L ${half - 10} 14 L ${half} 26 L 0 26 L 0 0 Z`} fill={WOOD.front} stroke={WOOD.line} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M 0 -40 L ${half - 4} -40 L ${half + 8} -26 L ${half - 6} -12 L ${half + 6} 0 L 14 0 L 0 0 Z`} fill={WOOD.topLight} stroke={WOOD.line} strokeWidth={6} strokeLinejoin="round" opacity={0} />
      <path d={`M -10 -40 L ${half - 4} -40 L ${half + 6} -26 L 14 -26 Z`} fill={WOOD.top} stroke={WOOD.line} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M 0 -12 L ${half - 14} -12`} stroke={WOOD.topLight} strokeWidth={5} opacity={0.5} />
    </g>
  );
  return (
    <g>
      <ellipse cx={x} cy={floorY} rx={half * 1.05} ry={26} fill="#000" opacity={0.4} />
      {legs
        ? [-1, 1].map((sd) => (
            <rect key={sd} x={x + sd * (half - 38) - 20} y={y + 20} width={40} height={floorY - y - 20} rx={8} fill={WOOD.dark} stroke={WOOD.line} strokeWidth={6} />
          ))
        : null}
      {/* left half pivots at the outer top corner; the right half is its mirror */}
      <g transform={`translate(${x - half} ${y}) rotate(${snap})`}>{slab}</g>
      <g transform={`translate(${x + half} ${y}) scale(-1 1) rotate(${snap})`}>{slab}</g>
      {cracks > 0 && snap === 0 ? (
        <path d={`M ${x - 4} ${y - 38} L ${x + 10} ${y - 20} L ${x - 8} ${y - 6} L ${x + 6} ${y + 14}`} stroke={WOOD.line} strokeWidth={5} fill="none" strokeDasharray="1 1" pathLength={1} strokeDashoffset={1 - clamp(cracks)} />
      ) : null}
    </g>
  );
};

/** Parts left of the alarm clock: gear, bell cap, spring, LED digits, screws. Scatter-lies at (x, y), `s` scale. */
export const ClockWreck: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform="translate(-170 -10)">
      <circle r={42} fill="#8A8AA0" stroke="#17141F" strokeWidth={5} />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-8} y={-56} width={16} height={20} fill="#8A8AA0" stroke="#17141F" strokeWidth={4} transform={`rotate(${i * 36})`} />)}
      <circle r={14} fill="#17141F" />
    </g>
    <ellipse cx={150} cy={-22} rx={70} ry={28} fill="#8A8AA0" stroke="#17141F" strokeWidth={5} transform="rotate(14 150 -22)" />
    <path d="M -60 -8 q 14 -28 28 0 t 28 0 t 28 0 t 28 0" stroke="#B9B4C6" strokeWidth={6} fill="none" strokeLinecap="round" />
    <g transform="translate(40 -40) rotate(-18)">
      <rect x={-60} y={-24} width={120} height={46} rx={8} fill="#120A0C" stroke="#3A3444" strokeWidth={5} />
      <text x={0} y={12} textAnchor="middle" fontFamily="monospace" fontSize={36} fill="#FF5A3A" opacity={0.55}>0:</text>
    </g>
    {[[-90, 12], [100, 6], [-10, 16]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={6} fill="#B9B4C6" stroke="#17141F" strokeWidth={3} />)}
  </g>
);

/** The ringing alarm clock for a macro: jitter and rotation while ringing, ring marks off the bell caps. (cx, cy) = bottom centre. */
export const RingingClock: React.FC<{ t: number; cx: number; cy: number; s?: number; ring?: number; text?: string }> = ({ t, cx, cy, s = 3, ring = 1, text = '07:00' }) => {
  const jit = ring * (Math.sin(t * 2.7) * 7 + Math.sin(t * 5.1) * 3);
  const rot = ring * Math.sin(t * 3.1) * 2.6;
  const pulse = (t % 8) / 8;
  return (
    <g>
      {ring > 0
        ? [0, 1, 2].map((k) => {
            const p = (pulse + k / 3) % 1;
            return [-1, 1].map((sd) => (
              <path key={`${k}${sd}`} d={`M ${cx + sd * (0.14 * 240 * s + 160 * p)} ${cy - 118 * s - 120} q ${sd * 40} 60 0 120`} stroke="#FFE7B8" strokeWidth={14} fill="none" strokeLinecap="round" opacity={ring * (1 - p) * 0.9} />
            ));
          })
        : null}
      <g transform={`translate(${cx + jit} ${cy}) rotate(${rot} 0 ${-60 * s / 3})`}>
        <ellipse cx={-70 * s} cy={-130 * s} rx={32 * s} ry={15 * s} fill="#8A8AA0" />
        <ellipse cx={-70 * s} cy={-135 * s} rx={26 * s} ry={10 * s} fill="#B8B6C4" />
        <ellipse cx={70 * s} cy={-130 * s} rx={32 * s} ry={15 * s} fill="#8A8AA0" />
        <ellipse cx={70 * s} cy={-135 * s} rx={26 * s} ry={10 * s} fill="#B8B6C4" />
        <rect x={-3 * s} y={-158 * s} width={6 * s} height={34 * s} rx={2} fill="#6E6C7C" />
        <g transform={`scale(${s})`}>
          <AlarmClock x={0} y={0} s={1} text={text} on={1} />
        </g>
      </g>
    </g>
  );
};
