import React from 'react';
import { clamp, easeOut, rnd, toWorld, joints, Pose, LOOKS } from '../../engine';
import { PAL } from './kit-palette';

// Chapter B props, the body beat (B1-B5): pure functions of t. World space unless said.
//   <RefreshScan x y0 y1 w p t />   the "body refreshed" scan: a cyan bar sweeps from y0 down to y1 (p 0..1) over a
//       w-wide body, leaving a soft trail and little plus-sparks behind it.
//   <KneeScrape pose o />            torn trouser knee + red scrape on the rig's near (right) knee; o fades it.
//   <Muscles pose k />               bulging hoodie sleeves on both arms (k 0 = skinny, 1 = huge), drawn over the Hero.
//   <SweatDrops x y t s />           drops flicking off a head.
//   <DustPuff x y t s />             a tumble's dust puffs at a ground point (20 frames from t = 0).

const PIP = LOOKS.pipHood;

export const RefreshScan: React.FC<{ x: number; y0: number; y1: number; w: number; p: number; t: number }> = ({ x, y0, y1, w, p, t }) => {
  if (p <= 0 || p >= 1.05) return null;
  const y = y0 + (y1 - y0) * clamp(p);
  const o = p > 0.9 ? clamp((1.05 - p) / 0.15) : 1;
  return (
    <g style={{ mixBlendMode: 'screen' }} opacity={o}>
      <rect x={x - w / 2} y={y0} width={w} height={Math.max(0, y - y0)} fill={PAL.cyan} opacity={0.12} />
      <rect x={x - w / 2 - 20} y={y - 7} width={w + 40} height={14} rx={7} fill={PAL.cyanSoft} opacity={0.9} />
      <rect x={x - w / 2 - 60} y={y - 26} width={w + 120} height={52} rx={26} fill={PAL.cyan} opacity={0.25} />
      {Array.from({ length: 9 }).map((_, i) => {
        const py = y0 + rnd(41, i) * (y - y0);
        const px = x - w / 2 + rnd(42, i) * w;
        const s = 6 + 6 * Math.abs(Math.sin(t / 4 + i));
        return <path key={i} d={`M ${px - s} ${py} H ${px + s} M ${px} ${py - s} V ${py + s}`} stroke={PAL.cyanSoft} strokeWidth={3} opacity={0.8} />;
      })}
    </g>
  );
};

/** Where a joint of the pose lands in the world. */
const at = (pose: Pose, p: { x: number; y: number }) => toWorld(pose, p);

export const KneeScrape: React.FC<{ pose: Pose; o?: number }> = ({ pose, o = 1 }) => {
  const k = at(pose, joints(pose).legR.mid);
  const s = pose.scale;
  return (
    <g transform={`translate(${k.x} ${k.y}) scale(${s})`} opacity={o}>
      {/* the torn hole in the trouser, skin showing, three red scrape lines */}
      <path d="M -20 -14 L -6 -20 L 4 -12 L 18 -18 L 22 0 L 14 14 L -2 18 L -16 12 Z" fill="#F2D9C6" stroke="#121019" strokeWidth={3} />
      <path d="M -12 -6 L 12 -10 M -14 2 L 14 -2 M -8 10 L 10 6" stroke="#D6352E" strokeWidth={5} strokeLinecap="round" />
      <circle cx={6} cy={2} r={4} fill="#B8231E" />
    </g>
  );
};

export const Muscles: React.FC<{ pose: Pose; k: number }> = ({ pose, k }) => {
  if (k <= 0.01) return null;
  const j = joints(pose);
  const s = pose.scale;
  // a bulge on the side of the segment that faces the bent forearm (the biceps peak), lit along its top
  const puff = (a: { x: number; y: number }, b: { x: number; y: number }, w: number, key: string, up: number) => {
    const A = at(pose, a);
    const B = at(pose, b);
    const len = Math.hypot(B.x - A.x, B.y - A.y);
    const ang = (Math.atan2(B.y - A.y, B.x - A.x) * 180) / Math.PI;
    const ry = (w * k + 8) * s;
    return (
      <g key={key} transform={`translate(${(A.x + B.x) / 2} ${(A.y + B.y) / 2}) rotate(${ang})`}>
        <ellipse cx={len * 0.06} cy={-up * ry * 0.45} rx={len * 0.58} ry={ry} fill="#3A3650" stroke={PIP.line} strokeWidth={4 * s} />
        <path d={`M ${-len * 0.35} ${-up * ry * 1.05} Q ${len * 0.06} ${-up * ry * 1.5} ${len * 0.45} ${-up * ry * 1.0}`} stroke="#FFC98A" strokeWidth={5 * s} fill="none" opacity={0.8} strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g>
      {puff(j.armL.root, j.armL.mid, 26, 'ul', -1)}
      {puff(j.armL.mid, j.armL.end, 12, 'fl', 1)}
      {puff(j.armR.root, j.armR.mid, 26, 'ur', 1)}
      {puff(j.armR.mid, j.armR.end, 12, 'fr', -1)}
    </g>
  );
};

export const SweatDrops: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const p = ((t + i * 9) % 26) / 26;
      const side = i === 1 ? -1 : 1;
      const dx = side * (78 + 60 * p + i * 8) * s;
      const dy = (i - 1) * 30 * s - 50 * s * Math.sin(p * Math.PI) + p * 70 * s;
      return <path key={i} d="M 0 -14 Q 9 0 0 8 Q -9 0 0 -14 Z" transform={`translate(${x + dx} ${y + dy}) scale(${s * 1.3})`} fill="#BFE6FF" stroke="#2A4A6A" strokeWidth={2} opacity={1 - p * 0.6} />;
    })}
  </g>
);

/** A tumble's dust puffs at a ground point (age 0..1). */
export const DustPuff: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  if (t < 0 || t > 20) return null;
  const k = easeOut(t / 20);
  return (
    <g opacity={1 - k}>
      {[-1, -0.4, 0.3, 1].map((d, i) => <ellipse key={i} cx={x + d * 90 * s * k} cy={y - 10 * s - k * 20 * s * (1 - Math.abs(d) * 0.5)} rx={(26 + 30 * k) * s} ry={(14 + 14 * k) * s} fill="#CDB9A4" />)}
    </g>
  );
};
