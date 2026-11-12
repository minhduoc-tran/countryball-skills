import React from 'react';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { FlightPath, pathAtDist, samplePath, Trail, SampledPath } from '../../countryball/fx-flight-path';
import { easeOut, prog, rad } from '../../countryball/fx-math';
import { PF } from './chf-map-scene';

// The 27.12 chase over several shots (F10-F12): one B-52 cell on a geo-locked route and a MiG-21 closing in from
// behind. All three shots share the route and a time shift (`shift` = frames already played), so the picture continues
// seamlessly across cuts. Everything recomputes from P() each frame, so it stays geo-locked while the camera drifts.

/** Route of the cell (lon, lat): from the north-west over the hills towards Hà Nội. */
export const CHASE_GEO: [number, number][] = [[103.6, 22.2], [104.6, 21.75], [105.4, 21.4], [105.9, 21.15], [106.4, 20.9]];
export const T0 = -40, T1 = 330;

export type ChaseCfg = { shift: number; g0: number; g1: number; gd: number };
export type ChasePose = { sp: SampledPath; sL: number; lead: { x: number; y: number; heading: number }; mig: { x: number; y: number; heading: number }; speed: number };

/** Lead B-52 and MiG poses at shot frame t. gap = distance (px) behind the lead, easing g0 -> g1 over gd frames. */
export const chaseAt = (P: PF, t: number, c: ChaseCfg): ChasePose => {
  const sp = samplePath(CHASE_GEO.map(([lo, la]) => P(lo, la)));
  const sL = prog(t + c.shift, T0, T1) * sp.total, gap = c.g0 + (c.g1 - c.g0) * prog(t, 0, c.gd);
  return { sp, sL, lead: pathAtDist(sp, sL), mig: pathAtDist(sp, Math.max(0, sL - gap)), speed: sp.total / (T1 - T0) };
};

/** The cell (all three, or only the two wingmen when the lead is drawn by a shootdown) plus the chasing MiG. `peel` =
 *  shot frame at which the MiG breaks away upward (undefined = keeps following). */
export const Chase: React.FC<{ id: string; P: PF; t: number; cfg: ChaseCfg; wingsOnly?: boolean; peel?: number; reticle?: number }> = ({ id, P, t, cfg, wingsOnly, peel, reticle }) => {
  const pose = chaseAt(P, t, cfg), tt = t + cfg.shift, { sp } = pose, size = 92;
  const common = { t: tt, t0: T0, t1: T1, sp, points: [] as [number, number][], size };
  let mig = pose.mig, migHead = mig.heading;
  if (peel !== undefined && t > peel) {
    const k = easeOut(prog(t, peel, peel + 24));
    migHead = mig.heading - 50 * k;
    const d = (t - peel) * 7;
    mig = { ...mig, x: mig.x + Math.cos(rad(migHead)) * d, y: mig.y + Math.sin(rad(migHead)) * d };
  }
  return (
    <g>
      {!wingsOnly && <FlightPath {...common} id={`${id}-l`} />}
      <FlightPath {...common} id={`${id}-a`} lateral={-size * 1.15} back={size * 0.95} trailLen={300} />
      <FlightPath {...common} id={`${id}-b`} lateral={size * 1.15} back={size * 0.95} trailLen={300} />
      <Trail sp={sp} s0={Math.max(0, pose.sL - 560)} s1={Math.max(0, pose.sL - (cfg.g0 + (cfg.g1 - cfg.g0) * prog(t, 0, cfg.gd)))} w={5} color="#9BD3FF" fade={peel !== undefined && t > peel ? 0 : 0.8} />
      <AircraftTop id={`${id}-m`} kind="mig21" x={mig.x} y={mig.y} size={72} heading={migHead} />
      {reticle !== undefined && t > reticle && !wingsOnly && (
        <g transform={`translate(${pose.lead.x},${pose.lead.y})`} opacity={prog(t, reticle, reticle + 8)}>
          <circle r={70 - 18 * easeOut(prog(t, reticle, reticle + 14))} fill="none" stroke="#E8353B" strokeWidth={5} strokeDasharray="16 10" />
          <path d="M-90,0 L-50,0 M50,0 L90,0 M0,-90 L0,-50 M0,50 L0,90" stroke="#E8353B" strokeWidth={5} />
        </g>
      )}
    </g>
  );
};
