import React from 'react';
import { clamp, backOut, easeOut, FONT, UI, Pose, basePose, LOOKS, Hero } from '../../engine';
import { PAL } from './kit-palette';
import { LoopIcon } from './kit-loop-clock';
import { bedSit, bedTop } from './kit-morning-bedroom';

// Chapter D local props for the dark days in bed. Pure functions of t (screen or world units, x y = centre).
//   <SoundIcon x y t kind life? s? />  a round badge naming a sound that passes Pip by: 'alarm' (the red 06:00 LED
//       with ring lines), 'mum' (mum's bob-haired head calling, sound arcs), 'door' (a door with knock bursts).
//       Pops in at t 0 (backOut), drifts up, fades out over its last 10 frames of `life`.
//   <ThoughtBubble x y t s? tx ty>children</ThoughtBubble>  a cream cloud (about 420 x 300 at s 1) with three small
//       puffs trailing down to (tx, ty) (Pip's head); the puffs pop first, then the cloud.
//   <CountPill t label />  the chip-style pill top-left (same place and look as the day chips): "NGÀY #1", "LẦN #10".
//   lyingPose(u, breathe)  Pip lying in bed on his back, head on the pillow at u (draw BedDuvet after him).
//   <LyingPip pose id rimId? />  Hero clipped at the mattress so his legs never poke out under the bed.

export const SoundIcon: React.FC<{ x: number; y: number; t: number; kind: 'alarm' | 'mum' | 'door'; life?: number; s?: number }> = ({ x, y, t, kind, life = 40, s = 1 }) => {
  if (t < 0 || t > life) return null;
  const pop = backOut(clamp(t / 8));
  const o = clamp(t / 3) * clamp((life - t) / 10);
  const dy = -easeOut(clamp(t / life)) * 50;
  const wob = Math.sin(t * 1.3) * 4;
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${s * pop})`} opacity={o}>
      <circle r={96} fill={UI.pill} opacity={0.82} />
      <circle r={96} fill="none" stroke={kind === 'alarm' ? PAL.led : '#FFD9A0'} strokeWidth={6} />
      {/* sound arcs on both sides, pulsing outward */}
      {[0, 1, 2].map((k) => {
        const ph = ((t * 0.08 + k / 3) % 1);
        return (
          <g key={k} opacity={(1 - ph) * 0.9} stroke="#FFD9A0" strokeWidth={7} fill="none" strokeLinecap="round">
            <path d={`M ${112 + ph * 50} -40 Q ${132 + ph * 60} 0 ${112 + ph * 50} 40`} />
            <path d={`M ${-112 - ph * 50} -40 Q ${-132 - ph * 60} 0 ${-112 - ph * 50} 40`} />
          </g>
        );
      })}
      {kind === 'alarm' ? (
        <g transform={`rotate(${wob})`}>
          <rect x={-70} y={-40} width={140} height={84} rx={16} fill="#1E1A24" stroke="#F6EFE3" strokeWidth={4} />
          <rect x={-56} y={-28} width={112} height={56} rx={8} fill="#120A0C" />
          <text y={16} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={PAL.led}>06:00</text>
          <rect x={-40} y={-54} width={80} height={14} rx={6} fill="#4A4456" />
        </g>
      ) : null}
      {kind === 'mum' ? (
        <g transform={`rotate(${wob * 0.5})`}>
          {/* mum's head: rose cardigan collar, the bob, an open calling mouth */}
          <path d="M -58 78 Q -52 30 0 30 Q 52 30 58 78 Z" fill={LOOKS.mom.jacket} />
          <circle cy={-12} r={44} fill={LOOKS.mom.skin} stroke="#14121C" strokeWidth={4} />
          <path d="M -48 6 Q -56 -66 0 -62 Q 56 -66 48 6 Q 44 -34 20 -40 Q -10 -30 -40 -34 Q -46 -20 -48 6 Z" fill={LOOKS.mom.hair} stroke="#14121C" strokeWidth={3} />
          <circle cx={-15} cy={-12} r={5} fill="#14121C" />
          <circle cx={15} cy={-12} r={5} fill="#14121C" />
          <ellipse cy={14} rx={10} ry={8 + 4 * Math.abs(Math.sin(t * 0.6))} fill="#5A1E22" />
        </g>
      ) : null}
      {kind === 'door' ? (
        <g>
          <rect x={-40} y={-62} width={80} height={124} rx={6} fill="#6A4C42" stroke="#F6EFE3" strokeWidth={4} />
          <rect x={-28} y={-50} width={56} height={40} rx={3} fill="none" stroke="#3E2C28" strokeWidth={3} />
          <circle cx={26} cy={6} r={6} fill="#E9C46A" />
          {/* knock bursts, alternating */}
          {[0, 1].map((k) => {
            const on = Math.floor(t / 5) % 2 === k;
            const bx = k ? 46 : -46;
            const by = k ? -26 : 20;
            return on ? (
              <path key={k} transform={`translate(${bx} ${by})`} d="M 0 -26 L 6 -8 L 24 -12 L 10 2 L 22 18 L 2 10 L -8 26 L -8 6 L -26 2 L -10 -8 Z" fill="#FFE27A" stroke="#14121C" strokeWidth={3} />
            ) : null;
          })}
        </g>
      ) : null}
    </g>
  );
};

export const ThoughtBubble: React.FC<{ x: number; y: number; t: number; s?: number; tx: number; ty: number; children?: React.ReactNode }> = ({ x, y, t, s = 1, tx, ty, children }) => {
  if (t < 0) return null;
  const puffs = [0.22, 0.48, 0.74].map((k, i) => ({ x: tx + (x - tx) * k, y: ty + (y + 120 * s - ty) * k, r: (10 + i * 8) * s, at: i * 3 }));
  const pop = backOut(clamp((t - 9) / 9));
  const bob = Math.sin(t / 10) * 5;
  const cloud = [[-150, 10, 100], [-60, -70, 110], [70, -66, 112], [160, 0, 96], [90, 80, 100], [-60, 86, 104], [0, 0, 140]];
  return (
    <g>
      {puffs.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y + bob * (i / 3)} r={p.r * backOut(clamp((t - p.at) / 5))} fill={PAL.paper} stroke="#14121C" strokeWidth={4} />
      ))}
      <g transform={`translate(${x} ${y + bob}) scale(${s * pop})`}>
        {cloud.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx} cy={cy} r={r + 5} fill="#14121C" />)}
        {cloud.map(([cx, cy, r], i) => <circle key={`i${i}`} cx={cx} cy={cy} r={r} fill={PAL.paper} />)}
        {children}
      </g>
    </g>
  );
};

export const CountPill: React.FC<{ t: number; label: string }> = ({ t, label }) => {
  const pop = backOut(clamp(t / 8));
  return (
    <g transform={`translate(70 70) scale(${pop})`} opacity={clamp(t / 3)}>
      <rect x={0} y={0} width={label.length * 22 + 100} height={72} rx={36} fill={UI.pill} opacity={0.74} />
      <LoopIcon x={40} y={36} r={15} t={t} spin={-3} />
      <text x={66} y={48} fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={UI.text} letterSpacing={2}>{label}</text>
    </g>
  );
};

/** Pip on his back in bed, head on the pillow at u (body hidden by the BedDuvet drawn after him). */
export const lyingPose = (u = 0.12, breathe = 0): Pose => {
  const b = bedSit(u, 0.06);
  return {
    ...basePose,
    x: b.x,
    y: b.y + 136 * b.scale + breathe,
    scale: b.scale,
    yaw: 0.1,
    headTilt: 14,
    armL: { a: 6, b: 0 },
    armR: { a: 6, b: 0 },
    legL: { a: 0, b: 0 },
    legR: { a: 0, b: 0 },
    expr: 'tired',
  };
};

export const LyingPip: React.FC<{ pose: Pose; id: string; rimId?: string }> = ({ pose, id, rimId = 'rimR' }) => {
  const cy = bedTop(0.2, 0.3).y;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={-2000} y={-2000} width={6000} height={2000 + cy} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <Hero look={LOOKS.pipHood} pose={pose} rimId={rimId} shadow={0} />
      </g>
    </g>
  );
};
