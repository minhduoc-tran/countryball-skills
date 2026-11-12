import React from 'react';
import { clamp, easeOut, rnd } from '../../engine';
import { PAL } from './kit-palette';

// The RESET motif's overlays (screen space: draw them LAST in a shot, outside the camera group).
//   <RewindWave t t0 id? cx? cy? />  every reset moment, ~18 frames from t0 (nothing outside t0..t0+18):
//       f0-1 white flash, f1-12 cyan scanlines + RGB-split glitch bars (cyan/magenta slices shifted sideways),
//       f0-18 a radial ripple ring from (cx, cy) (default frame centre) out past the corners, a cyan cool wash.
//   <MemoryGlow x y r t id? />  a soft cyan halo marking the one thing that stays (Pip's head, a memory): breathing
//       halo + a thin ring + a few motes orbiting slowly. r ~ the head radius on screen x 1.6 (e.g. 110 for a medium).

export const RewindWave: React.FC<{ t: number; t0: number; id?: string; cx?: number; cy?: number }> = ({ t, t0, id = 'rw', cx = 960, cy = 540 }) => {
  const tt = t - t0;
  if (tt < 0 || tt > 18) return null;
  const flash = tt < 1 ? 0.95 : tt < 2 ? 0.55 : tt < 4 ? 0.2 * (4 - tt) / 2 : 0;
  const glitch = tt >= 1 && tt <= 12 ? 1 - Math.abs(tt - 5) / 8 : 0;
  const ring = easeOut(clamp(tt / 18));
  const R = 80 + ring * 1300;
  const fr = Math.floor(tt);
  return (
    <g style={{ pointerEvents: 'none' }}>
      <defs>
        <radialGradient id={`${id}wash`} cx="50%" cy="50%" r="70%">
          <stop offset="0" stopColor={PAL.cyanSoft} stopOpacity={0.05} />
          <stop offset="1" stopColor={PAL.cyan} stopOpacity={0.4} />
        </radialGradient>
      </defs>
      {/* the cool wash, strongest at the edges */}
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id}wash)`} opacity={(1 - ring) * 0.9} style={{ mixBlendMode: 'screen' }} />
      {/* RGB-split slices: horizontal bands of cyan and magenta pushed sideways, new every frame (seeded by frame) */}
      {glitch > 0
        ? Array.from({ length: 6 }).map((_, k) => {
            const y = rnd(fr + 3, k) * 1080;
            const h = 4 + rnd(fr + 4, k) * 26;
            const x0 = rnd(fr + 6, k) * 900;
            const w = 500 + rnd(fr + 7, k) * 1100;
            const dx = (rnd(fr + 5, k) - 0.5) * 90 * glitch;
            return (
              <g key={k} style={{ mixBlendMode: 'screen' }}>
                <rect x={x0 + dx} y={y} width={w} height={h} fill={PAL.cyan} opacity={0.3 * glitch} />
                <rect x={x0 - dx} y={y + h * 0.6} width={w * 0.8} height={Math.max(2, h * 0.4)} fill="#FF4FD8" opacity={0.2 * glitch} />
              </g>
            );
          })
        : null}
      {/* scanlines */}
      {glitch > 0 ? (
        <g opacity={0.18 * glitch}>
          {Array.from({ length: 54 }).map((_, k) => <rect key={k} x={0} y={k * 20 + (fr % 2) * 10} width={1920} height={2} fill="#0A1A2A" />)}
        </g>
      ) : null}
      {/* the ripple: a bright ring and a softer echo */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={PAL.cyanSoft} strokeWidth={26 * (1 - ring) + 4} opacity={0.85 * (1 - ring)} />
      <circle cx={cx} cy={cy} r={R * 0.72} fill="none" stroke={PAL.cyan} strokeWidth={12 * (1 - ring) + 2} opacity={0.6 * (1 - ring)} />
      {/* the white flash */}
      {flash > 0 ? <rect x={0} y={0} width={1920} height={1080} fill={PAL.flash} opacity={flash} /> : null}
    </g>
  );
};

export const MemoryGlow: React.FC<{ x: number; y: number; r: number; t: number; id?: string; o?: number }> = ({ x, y, r, t, id = 'mg', o = 1 }) => {
  const br = 1 + 0.06 * Math.sin(t / 9);
  return (
    <g style={{ pointerEvents: 'none' }} opacity={o}>
      <defs>
        <radialGradient id={`${id}halo`}>
          <stop offset="0" stopColor={PAL.cyanSoft} stopOpacity={0} />
          <stop offset="0.55" stopColor={PAL.cyan} stopOpacity={0.42} />
          <stop offset="0.75" stopColor={PAL.cyan} stopOpacity={0.24} />
          <stop offset="1" stopColor={PAL.cyan} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 1.7 * br} fill={`url(#${id}halo)`} style={{ mixBlendMode: 'screen' }} />
      <circle cx={x} cy={y} r={r * br} fill="none" stroke={PAL.cyan} strokeWidth={Math.max(2, r * 0.03)} opacity={0.65 + 0.2 * Math.sin(t / 7)} strokeDasharray={`${r * 0.5} ${r * 0.18}`} transform={`rotate(${-t * 0.8} ${x} ${y})`} />
      {Array.from({ length: 6 }).map((_, k) => {
        const a = -t / 30 + (k * Math.PI * 2) / 6;
        const rr = r * (1.15 + 0.12 * Math.sin(t / 13 + k));
        return <circle key={k} cx={x + Math.cos(a) * rr} cy={y + Math.sin(a) * rr * 0.9} r={Math.max(2, r * 0.035)} fill={PAL.cyanSoft} opacity={0.5 + 0.4 * Math.sin(t / 5 + k * 2)} />;
      })}
    </g>
  );
};
