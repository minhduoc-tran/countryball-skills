import React from 'react';
import { clamp, easeOut, rnd, lerp, Pose, streetStand, walkPose } from '../../engine';
import { grannyPose } from './kit-cast';
import { XR } from './kit-street-rain';
import { PAL } from './kit-palette';
import { Rain } from '../mot-cu-dam/storm-sky';
import { RainVeil } from './kit-street-rain';

// Chapter D local props for the 16:00 rain at the crossroads (pure functions of t).
//   grannyAt(dX, slip, down?, walk?)  the granny's pose on the zebra at XR.SLIP + dX metres: slip 0..1 is the kit's fall,
//       down 0..1 carries it on until she lies on the wet road (spun back, hips on the ground).
//   pipStreet(X, Z, extra?)  Pip's standing hip point/scale on the street (on the sidewalk when |X| > 4.2).
//   pipRun(X, Z, phase, extra?)  a running pose at (X, Z): fast stride, lean forward, arms pumping, facing right.
//   <RainScene t id cam amount? set people />  the rain layering that keeps faces popping: the set (inside `cam`),
//       the kit RainVeil (screen space), the people (inside `cam` again), then a light veil of streaks over them.
//   <GoodHeart x y s t dissolve />  the good deed: a warm glowing heart with a little umbrella in it; dissolve 0..1
//       breaks it into cyan flakes that lift away (the reset takes it). ~300 wide at s 1.

export const grannyAt = (dX: number, slip: number, down = 0, walk?: number): Pose => {
  const p = streetStand(XR.SLIP.X + dX, XR.SLIP.Z, { k: 1.45 });
  const base = grannyPose(p.x, p.y, p.scale, { slip, facing: 1, walk });
  const d = easeOut(clamp(down));
  return {
    ...base,
    y: base.y + d * 70 * p.scale,
    spin: base.spin - 52 * d,
    legL: { a: lerp(base.legL.a, 80, d), b: lerp(base.legL.b, -10, d) },
    legR: { a: lerp(base.legR.a, 60, d), b: lerp(base.legR.b, -30, d) },
    armL: { a: lerp(base.armL.a, 70, d), b: lerp(base.armL.b, -20, d) },
    expr: slip > 0.2 ? (d > 0.6 ? 'worried' : 'shock') : base.expr,
  };
};

export const pipStreet = (X: number, Z: number) => streetStand(X, Z, { sidewalk: Math.abs(X) > 4.2 });

export const pipRun = (X: number, Z: number, phase: number, extra: Partial<Pose> = {}): Pose => {
  const p = pipStreet(X, Z);
  const s = Math.sin(phase);
  return walkPose(p.x, phase, p.y + 140 * p.scale, p.scale, {
    tilt: 16,
    legL: { a: 46 * s, b: -Math.max(0, 70 * Math.sin(phase + 1.2)) },
    legR: { a: -46 * s, b: -Math.max(0, 70 * Math.sin(phase + 1.2 + Math.PI)) },
    armL: { a: -50 * s, b: 80 },
    armR: { a: 50 * s, b: 80 },
    yaw: 0.7,
    sway: 16 * Math.sin(phase + 0.8),
    expr: 'worried',
    ...extra,
  });
};

const HEART = 'M 0 110 C -40 80 -150 20 -150 -50 C -150 -110 -100 -140 -60 -140 C -30 -140 -10 -122 0 -100 C 10 -122 30 -140 60 -140 C 100 -140 150 -110 150 -50 C 150 20 40 80 0 110 Z';

export const GoodHeart: React.FC<{ x: number; y: number; s?: number; t: number; dissolve?: number }> = ({ x, y, s = 1, t, dissolve = 0 }) => {
  const d = clamp(dissolve);
  const beat = 1 + 0.05 * Math.max(0, Math.sin(t / 5)) * (1 - d);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g opacity={1 - d} transform={`scale(${beat * (1 - 0.15 * d)})`}>
        <circle r={230} fill="#FF7A6A" opacity={0.16} />
        <path d={HEART} fill="#F0584E" stroke="#14121C" strokeWidth={10} strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 30px #FF8A6A)' }} />
        <path d="M -110 -70 C -110 -100 -90 -118 -62 -120" stroke="#FFFFFF" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.45} />
        {/* the little umbrella: the good deed it stands for */}
        <g transform="translate(0 -4)" fill="#F6EFE3" stroke="#F6EFE3">
          <path d="M -70 -10 Q -66 -66 0 -70 Q 66 -66 70 -10 Q 52 -22 35 -10 Q 18 -22 0 -10 Q -18 -22 -35 -10 Q -52 -22 -70 -10 Z" strokeWidth={2} />
          <path d="M 0 -10 L 0 50 Q 0 64 -14 64" strokeWidth={9} fill="none" strokeLinecap="round" />
        </g>
      </g>
      {/* cyan flakes break off and lift away */}
      {d > 0
        ? Array.from({ length: 40 }).map((_, k) => {
            const a = rnd(51, k) * Math.PI * 2;
            const r0 = rnd(52, k) * 120;
            const x0 = Math.cos(a) * r0;
            const y0 = Math.sin(a) * r0 * 0.8 - 20;
            const lift = d * (180 + rnd(53, k) * 260);
            const o = clamp(d * 3) * clamp(1.2 - d);
            const sz = 8 + rnd(54, k) * 16;
            return <rect key={k} x={x0 + (rnd(55, k) - 0.5) * 160 * d} y={y0 - lift} width={sz} height={sz} fill={k % 3 ? PAL.cyan : PAL.cyanSoft} opacity={o} transform={`rotate(${k * 37 + t * 6} ${x0} ${y0 - lift})`} />;
          })
        : null}
    </g>
  );
};

export const RainScene: React.FC<{ t: number; id: string; cam: string; amount?: number; set: React.ReactNode; people: React.ReactNode; over?: React.ReactNode }> = ({ t, id, cam, amount = 1, set, people, over }) => (
  <g>
    <g transform={cam}>{set}</g>
    <RainVeil t={t} id={id} amount={amount} />
    <g transform={cam}>{people}</g>
    {amount > 0 ? <Rain t={t * 1.1} intensity={0.35 * amount} slant={0.12} seed={41} color="#DCE6F6" /> : null}
    {over}
  </g>
);
