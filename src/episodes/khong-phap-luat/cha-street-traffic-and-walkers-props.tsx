import React from 'react';
import { Hero, Look, walkPose, streetStand, proj, propScale, Pose } from '../../engine';
import { Rider } from './cha-bike-rider-and-speed-props';

// Chapter A local props: ordinary street life for the "normal busy street" shots. TrafficFlow draws scooters with
// riders crossing the street (side-on billboards at their depth Z, far first); Walkers draws people strolling across.

export type Biker = { Z: number; X0: number; v: number; look: Look; color: string; helmet?: boolean };
const wrapX = (x0: number, v: number, t: number, half = 12) => ((((x0 + v * t + half) % (2 * half)) + 2 * half) % (2 * half)) - half;

/** Scooters crossing at depth Z, X metres wide wrap-around, v metres per frame (sign = direction). */
export const TrafficFlow: React.FC<{ t: number; bikers: Biker[]; lean?: number }> = ({ t, bikers, lean = 8 }) => (
  <g>
    {[...bikers].sort((a, b) => b.Z - a.Z).map((b, i) => {
      const X = wrapX(b.X0, b.v, t);
      const g = proj(X, 0, b.Z);
      return <Rider key={i} look={b.look} x={g.x} y={g.y} s={propScale(b.Z)} facing={b.v >= 0 ? 1 : -1} t={t + i * 7} color={b.color} lean={lean} expr="neutral" helmetHook={b.helmet} />;
    })}
  </g>
);

export type Walker = { look: Look; X0: number; Z: number; v: number; k?: number; extra?: Partial<Pose>; wrap?: boolean };
/** People strolling across the street at depth Z (X metres, v metres per frame); k the person's height in metres. */
export const Walkers: React.FC<{ t: number; people: Walker[]; low?: number }> = ({ t, people, low = 0 }) => (
  <g>
    {[...people].sort((a, b) => b.Z - a.Z).map((w, i) => {
      const X = w.wrap === false ? w.X0 + w.v * t : wrapX(w.X0, w.v, t, 9);
      const st = streetStand(X, w.Z, { k: w.k ?? 1.6, low });
      const dir = w.v >= 0 ? 1 : -1;
      const pose = walkPose(st.x, t * 0.5 + i * 2, st.y + 140 * st.scale, st.scale, w.extra ?? {}, dir);
      return <Hero key={i} look={w.look} pose={pose} rimId={dir === 1 ? 'rimR' : 'rimL'} shadow={0} />;
    })}
  </g>
);
