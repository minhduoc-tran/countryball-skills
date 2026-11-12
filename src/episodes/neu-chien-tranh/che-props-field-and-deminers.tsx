import React from 'react';
import { Hero, Pose, basePose, faceAt, walkPose, joints, toWorld, LOOKS, Look, Glow, clamp, easeOut, rnd, Haze } from '../../engine';
import { VN_PATH } from '../tien-vo-han/cha-vietnam-map-props';

// Chapter E props: the quiet country after the guns stop. A side-on field (dry, uncleared ground on the right, fresh green
// where the deminers have been, on the left), deminers in hi-vis vests with metal detectors, marker stakes, birds, thin
// smoke, and the Vietnam outline with a hatched fifth. Pure functions of the shot clock t. No weapons are ever drawn.

export const VEST: Look = { ...LOOKS.mo, jacket: '#F0A82E', jacketShade: '#C9861C', accent: '#FFF3C4', limb: '#4A4458', extra: undefined, hair: '#2A1C18' };
export const KID_BOY: Look = { ...LOOKS.mo, jacket: '#4C86B8', jacketShade: '#3B6C96', accent: '#F2C14E', extra: 'curls' };

/** n birds crossing the sky, flapping; (x0, y0, w, h) is their box. */
export const Birds: React.FC<{ t: number; seed: number; x0: number; y0: number; w: number; h: number; n?: number; o?: number; col?: string }> = ({ t, seed, x0, y0, w, h, n = 5, o = 0.85, col = '#2A1A30' }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const sp = 1.4 + rnd(seed, i) * 0.9;
      const bx = x0 + ((t * sp + rnd(seed, i + 9) * w) % w);
      const by = y0 + rnd(seed, i + 20) * h + Math.sin(t / 16 + i) * 12;
      const fl = Math.sin(t / 2.4 + i * 1.7) * 8;
      const k = 0.8 + rnd(seed, i + 40) * 0.6;
      return <path key={i} d={`M ${bx - 16 * k} ${by + fl * 0.4 * k} Q ${bx - 7 * k} ${by - 7 * k + fl * k} ${bx} ${by} Q ${bx + 7 * k} ${by - 7 * k + fl * k} ${bx + 16 * k} ${by + fl * 0.4 * k}`} stroke={col} strokeWidth={3.5 * k} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

/** Smoke columns on the horizon that thin out: `thin` 0 (dense) .. 1 (gone). */
export const SmokeWisps: React.FC<{ t: number; xs: number[]; y: number; thin: number; col?: string }> = ({ t, xs, y, thin, col = '#54425A' }) => (
  <g filter="url(#blur16)">
    {xs.map((x, i) => (
      <g key={i} opacity={(1 - thin) * 0.75}>
        {Array.from({ length: 5 }).map((_, j) => {
          const ph = (t * 0.25 + j * 12 + i * 7) % 60;
          return <ellipse key={j} cx={x + Math.sin(ph / 9 + i) * 16 + ph * 0.8} cy={y - j * 46 - ph * 1.2} rx={26 + j * 14} ry={38 + j * 11} fill={col} opacity={0.75 - j * 0.1} />;
        })}
      </g>
    ))}
  </g>
);

/** A red-and-white marker stake (base at x, y), height h. */
export const Stake: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 90 }) => (
  <g>
    <ellipse cx={x} cy={y + 2} rx={h * 0.22} ry={h * 0.05} fill="#000" opacity={0.3} />
    <rect x={x - 5} y={y - h} width={10} height={h} rx={3} fill="#F3EDE0" stroke="#5A3A2A" strokeWidth={2} />
    <rect x={x - 5} y={y - h} width={10} height={h * 0.26} fill="#D9453B" />
    <rect x={x - 5} y={y - h * 0.5} width={10} height={h * 0.18} fill="#D9453B" />
  </g>
);

/** x of the cleared edge at ground height y: a diagonal line, so people along it spread across the frame. */
export const edgeX = (y: number, front: number, hor = 560) => front + 100 - (y - hor) * 0.55;

/** The side-on field. Dry ground from `front` rightwards, green grass to its left; birds optional. id must be unique. */
export const Field: React.FC<{ t: number; id: string; front: number; hor?: number; sunX?: number; dawn?: number }> = ({ t, id, front, hor = 560, sunX = 1450, dawn = 0 }) => {
  const sway = (x: number) => Math.sin(t / 14 + x / 60) * 3;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8EB8D6" /><stop offset="0.6" stopColor="#F4D8B4" /><stop offset="1" stopColor="#FBE7C2" />
        </linearGradient>
        <linearGradient id={`${id}dry`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B49A62" /><stop offset="1" stopColor="#8A6F44" /></linearGradient>
        <linearGradient id={`${id}grn`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7CC265" /><stop offset="1" stopColor="#4C9A48" /></linearGradient>
      </defs>
      <rect x={-500} y={-400} width={3000} height={hor + 420} fill={`url(#${id}sky)`} />
      <circle cx={sunX} cy={hor - 60} r={90} fill="#FFF1CF" opacity={0.9} />
      <Glow x={sunX} y={hor - 60} r={520} o={0.45 + 0.2 * dawn} />
      <path d={`M -500 ${hor} Q 100 ${hor - 120} 600 ${hor - 20} T 1400 ${hor - 40} T 2500 ${hor - 90} V ${hor + 20} H -500 Z`} fill="#8FB09A" opacity={0.7} />
      <path d={`M -500 ${hor + 10} Q 300 ${hor - 50} 900 ${hor} T 2500 ${hor - 20} V ${hor + 40} H -500 Z`} fill="#6E9A7C" />
      {[260, 520, 1180, 1620, 1900].map((x, i) => (
        <g key={i} transform={`translate(${x} ${hor + 14})`}>
          <rect x={-4} y={-40} width={8} height={40} fill="#5A4030" />
          <circle cx={0} cy={-62} r={30 + (i % 2) * 8} fill="#3F7A4C" /><circle cx={14} cy={-50} r={22} fill="#4C8C58" />
        </g>
      ))}
      <rect x={-500} y={hor} width={3000} height={1300} fill={`url(#${id}dry)`} />
      {/* dry tufts on the uncleared side */}
      {Array.from({ length: 46 }).map((_, i) => {
        const x = front + 20 + rnd(id.length + 3, i) * 1500;
        const y = hor + 30 + rnd(id.length + 5, i) * 560;
        return <path key={i} d={`M ${x - 7} ${y} Q ${x - 3} ${y - 22} ${x - 8 + sway(x)} ${y - 34} M ${x} ${y} Q ${x + 2} ${y - 26} ${x + 4 + sway(x)} ${y - 40} M ${x + 7} ${y} Q ${x + 6} ${y - 18} ${x + 12 + sway(x)} ${y - 28}`} stroke="#6A5430" strokeWidth={3} fill="none" strokeLinecap="round" />;
      })}
      {/* the cleared, green side: a soft edge, grass blades, tiny flowers */}
      <path d={`M -500 ${hor + 4} H ${edgeX(hor, front, hor)} Q ${edgeX(hor + 200, front, hor) - 20} ${hor + 200} ${edgeX(hor + 330, front, hor) + 6} ${hor + 330} Q ${edgeX(hor + 470, front, hor) - 20} ${hor + 470} ${edgeX(1300, front, hor)} 1300 H -500 Z`} fill={`url(#${id}grn)`} />
      {Array.from({ length: 60 }).map((_, i) => {
        const x = front - 30 - rnd(id.length + 7, i) * 1700;
        const y = hor + 24 + rnd(id.length + 9, i) * 600;
        const c = i % 7 === 0 ? '#FFE27A' : i % 11 === 0 ? '#FFFFFF' : '#2F7A3A';
        return i % 7 === 0 || i % 11 === 0
          ? <circle key={i} cx={x} cy={y} r={5} fill={c} />
          : <path key={i} d={`M ${x - 6} ${y} L ${x - 4 + sway(x)} ${y - 20} L ${x} ${y} L ${x + 3 + sway(x)} ${y - 26} L ${x + 7} ${y}`} stroke={c} strokeWidth={3} fill="none" strokeLinejoin="round" />;
      })}
      <Haze y={hor - 20} h={140} o={0.3} />
    </g>
  );
};

/** The marker line at the cleared edge: three stakes at different depths with a ribbon between them. */
export const Frontier: React.FC<{ front: number; hor?: number }> = ({ front, hor = 560 }) => {
  const pts = [110, 250, 400].map((d, i) => [edgeX(hor + d, front, hor), hor + d, [60, 92, 130][i]]);
  return (
    <g>
      <path d={`M ${pts[0][0]} ${pts[0][1] - pts[0][2] * 0.8} L ${pts[1][0]} ${pts[1][1] - pts[1][2] * 0.8} L ${pts[2][0]} ${pts[2][1] - pts[2][2] * 0.8}`} stroke="#D9453B" strokeWidth={5} strokeDasharray="14 10" fill="none" />
      {pts.map(([x, y, h], i) => <Stake key={i} x={x} y={y} h={h} />)}
    </g>
  );
};

/** A metal detector held by a deminer: a pole from the hand down to a flat disc on the ground at (gx, gy). */
export const Detector: React.FC<{ hx: number; hy: number; gx: number; gy: number; s?: number; beep?: number }> = ({ hx, hy, gx, gy, s = 1, beep = 0 }) => (
  <g>
    <path d={`M ${hx} ${hy} L ${gx} ${gy - 8 * s}`} stroke="#2A2833" strokeWidth={7 * s} strokeLinecap="round" />
    <path d={`M ${hx} ${hy} L ${gx} ${gy - 8 * s}`} stroke="#8C8A98" strokeWidth={3 * s} strokeLinecap="round" />
    <ellipse cx={gx} cy={gy} rx={34 * s} ry={9 * s} fill="#2A2833" stroke="#6E6C7C" strokeWidth={3 * s} />
    {beep > 0 ? <ellipse cx={gx} cy={gy} rx={(34 + 60 * beep) * s} ry={(9 + 16 * beep) * s} fill="none" stroke="#FFE27A" strokeWidth={3 * s} opacity={1 - beep} /> : null}
  </g>
);

/**
 * A deminer in a vest sweeping a detector over the ground ahead; (x, gy) is where the feet stand. Facing right.
 * Draw order: the Hero is drawn here, then the detector in front of the legs.
 */
export const Deminer: React.FC<{ t: number; x: number; gy: number; s: number; phase?: number; face?: Look }> = ({ t, x, gy, s, phase = 0, face = VEST }) => {
  const sw = Math.sin(t / 9 + phase);
  const base: Pose = { ...basePose, x, y: gy - 140 * s, scale: s, yaw: 0.75, facing: 1, tilt: 14, headTilt: 5, look: 0.6, armL: { a: 20, b: 6 }, armR: { a: 40, b: 12 }, legL: { a: 12, b: 0 }, legR: { a: -10, b: 0 } };
  const hand = toWorld(base, joints(base).armR.end);
  return (
    <g>
      <Hero look={face} pose={{ ...base, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <Detector hx={hand.x} hy={hand.y} gx={hand.x + (150 + 36 * sw) * s} gy={gy + 6 * s} s={s * 1.6} beep={Math.max(0, Math.sin(t / 23 + phase * 3) - 0.9) * 10} />
    </g>
  );
};

/** A child running on the grass between xa and xb (loops), facing right; (gy) the ground. */
export const RunningKid: React.FC<{ t: number; look: Look; xa: number; xb: number; gy: number; s: number; seed?: number }> = ({ t, look, xa, xb, gy, s, seed = 0 }) => {
  const x = xa + ((t * 6 + seed * 160) % (xb - xa));
  const pose = walkPose(x, t * 0.75 + seed, gy, s, { armL: { a: 50 * Math.sin(t * 0.75 + seed), b: 40 }, armR: { a: -50 * Math.sin(t * 0.75 + seed), b: 40 }, tilt: 9 });
  return <Hero look={look} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />;
};

/** The Vietnam outline (400 x 880 box at x, y, scale s) with a hatched fifth of its area that pulses; `hatch` 0..1 draws it in. */
export const HatchedVietnam: React.FC<{ id: string; t: number; x: number; y: number; s?: number; hatch: number; warn?: boolean }> = ({ id, t, x, y, s = 1, hatch, warn = false }) => {
  const pulse = 0.75 + 0.25 * Math.sin(t / 8);
  // patches of contamination (circles in the map's own box) that together cover about a fifth of it
  const patches: [number, number, number][] = [[230, 300, 74], [250, 430, 58], [200, 570, 66], [160, 700, 52], [290, 190, 46], [120, 250, 44], [220, 150, 40]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={`${id}clip`}><path d={VN_PATH} /></clipPath>
        <pattern id={`${id}hatch`} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={16} height={16} fill="#FF8A3D" opacity={0.22 * pulse} />
          <rect width={7} height={16} fill="#FF8A3D" opacity={0.95} />
        </pattern>
      </defs>
      <path d={VN_PATH} fill="#16304A" stroke="#F6EFE3" strokeWidth={6} strokeLinejoin="round" />
      <g clipPath={`url(#${id}clip)`}>
        {patches.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r * easeOut(clamp(hatch * 1.6 - i * 0.12))} fill={`url(#${id}hatch)`} />)}
      </g>
      {warn
        ? patches.map(([cx, cy], i) => {
            const k = clamp((t - 8 - i * 3) / 6);
            return k > 0 ? (
              <g key={i} transform={`translate(${cx} ${cy}) scale(${k})`}>
                <path d="M 0 -20 L 18 12 H -18 Z" fill="#FFE27A" stroke="#3A2A10" strokeWidth={3} strokeLinejoin="round" />
                <path d="M 0 -9 V 3" stroke="#3A2A10" strokeWidth={3.5} strokeLinecap="round" /><circle cx={0} cy={8} r={2} fill="#3A2A10" />
              </g>
            ) : null;
          })
        : null}
      <path d={VN_PATH} fill="none" stroke="#F6EFE3" strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
};
