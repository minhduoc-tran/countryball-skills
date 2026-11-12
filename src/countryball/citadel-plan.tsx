import React from 'react';
import { FONT } from '../engine/fonts';
import { Camera } from './geo-camera';
import { clamp, prog } from './fx-math';
import { CITADEL, citadelToLocal, lonLatToLocal, planCamera, WATERWAYS } from './citadel-geometry';
import { CitadelPatchMask } from './citadel-patch-mask';
import { CitadelCraters, CitadelFires, CitadelTrees } from './citadel-damage-layer';
import { CitadelFortLayer } from './citadel-fort-layer';
import { CitadelTownLayer } from './citadel-town-layer';
import { useGeo } from './map-context';

// <CitadelPlan>: top-down Quảng Trị Citadel (Thành cổ) and its town, THE hero location. It draws in its own LOCAL METRE
// frame (x east, y south, origin = citadel centre; the fort is a 480 m square turned 16.6 deg, see citadel-geometry.ts)
// but takes the SAME camera type as <GeoMap> ({ lon, lat, zoom px/deg }) so one cameraAt() keyframe list can fly from all
// of Vietnam down into the courtyard. Scale: px per metre = zoom / 110574, so zoom 90000 = 0.81 px/m (citadel 390 px
// wide), zoom 150000 = 1.36 px/m (citadel ~650 px = 60% of the height), 220000 = 2 px/m (fills the height), 500000 = 4.5 px/m (a gate).
//   Standalone (zoom >= ~15000): <svg><CitadelPlan id camera ... /></svg>, it paints its own ground over the screen.
//   Inside <GeoMap> (zoom 8000..30000): <CitadelPlanInMap .../> fades in over the map (soft-edged patch, ~9 km across).
// Props (all pure functions of the props; t in frames only drives flicker):
//   damage 0..1   intact -> walls cracked then breached (east gate survives), buildings to rubble, trees gone, houses ruined
//   craters 0..1  crater density (default 1; they still appear one by one with `damage`)
//   fires 0..1    burning ruins with smoke (needs damage > ~0.2)     night 0..1     flood 0..1 (Thạch Hãn + moat in flood)
//   memorial      the site today (monument, museum) instead of the 1972 barracks     labels  true | ('citadel'|'gates'|'moat'|'river'|'bridge')[]
// Helpers to place things on it: citadelScreen(camera, u, v), localToScreen, CITADEL_POINTS (citadel-geometry.ts).

export type PlanLabel = 'citadel' | 'gates' | 'moat' | 'river' | 'bridge';
export interface CitadelPlanProps {
  id: string; camera: Camera; t?: number; damage?: number; craters?: number; fires?: number; night?: number; flood?: number;
  memorial?: boolean; labels?: boolean | PlanLabel[]; opacity?: number;
}
const ALL_LABELS: PlanLabel[] = ['citadel', 'gates', 'moat', 'river', 'bridge'];
const lab = { fontFamily: FONT.title, fontWeight: 800, paintOrder: 'stroke', strokeLinejoin: 'round', fill: '#FFFFFF' } as const;

// nearest vertex of the named Thạch Hãn centre line to the citadel, with the local direction (for the river label)
const RIVER_ANCHOR = (() => {
  let best = 1e9, at: [number, number] = [-420, 0], dir: [number, number] = [0, -1];
  for (const w of WATERWAYS) {
    if (w.name !== 'Sông Thạch Hãn') continue;
    for (let i = 2; i + 3 < w.pts.length; i += 2) {
      const d = Math.hypot(w.pts[i] - CITADEL.cx, w.pts[i + 1] - CITADEL.cy);
      if (d < best) { best = d; at = [w.pts[i], w.pts[i + 1]]; dir = [w.pts[i + 2] - w.pts[i - 2], w.pts[i + 3] - w.pts[i - 1]]; }
    }
  }
  return { at, ang: (Math.atan2(dir[1], dir[0]) * 180) / Math.PI };
})();

export const CitadelPlan: React.FC<CitadelPlanProps & { overlay?: boolean }> = ({
  id, camera, t = 0, damage = 0, craters = 1, fires = 0, night = 0, flood = 0, memorial = false, labels = false, opacity = 1, overlay = false,
}) => {
  const { k, c } = planCamera(camera);
  if (opacity <= 0.005) return null;
  const view: [number, number, number, number] = [c[0] - 960 / k, c[1] - 540 / k, c[0] + 960 / k, c[1] + 540 / k];
  const dmg = clamp(damage, 0, 1), fl = clamp(flood, 0, 1), ni = clamp(night, 0, 1);
  const toS = (x: number, y: number): [number, number] => [960 + (x - c[0]) * k, 540 + (y - c[1]) * k];
  const want = (l: PlanLabel) => labels === true || (Array.isArray(labels) && labels.includes(l));
  const world = (
    <g transform={`translate(${(960 - c[0] * k).toFixed(2)},${(540 - c[1] * k).toFixed(2)}) scale(${k.toFixed(5)})`}>
      <CitadelTownLayer id={id} view={view} k={k} night={ni} damage={dmg} flood={fl} />
      <g transform={`translate(${CITADEL.cx},${CITADEL.cy}) rotate(${CITADEL.rot})`}>
        <CitadelFortLayer night={ni} damage={dmg} flood={fl} memorial={memorial} />
      </g>
      <CitadelCraters view={view} k={k} night={ni} damage={dmg} density={craters} />
      <CitadelTrees view={view} k={k} night={ni} damage={dmg} />
      {fires > 0 && <CitadelFires view={view} k={k} night={ni} damage={dmg} fires={fires} t={t} />}
    </g>
  );
  return (
    <g opacity={opacity}>
      <CitadelPatchMask id={id} overlay={overlay} k={k} c={c} />
      {overlay ? <g mask={`url(#${id}-patch)`}>{world}</g> : world}
      {labels && (
        <g>
          {want('citadel') && <PlanText p={toS(CITADEL.cx, CITADEL.cy - 6)} size={Math.max(24, Math.min(54, k * 52))} text="THÀNH CỔ QUẢNG TRỊ" k={k} min={0.35} />}
          {want('gates') && ([['Cửa Bắc', 0, -1], ['Cửa Đông', 1, 0], ['Cửa Nam', 0, 1], ['Cửa Tây', -1, 0]] as const).map(([name, ux, vy]) => {
            const p = citadelToLocal(ux * (CITADEL.half + 58), vy * (CITADEL.half + 58));
            return <PlanText key={name} p={toS(p[0], p[1])} size={26} text={name} k={k} min={0.6} />;
          })}
          {want('moat') && <PlanText p={toS(...citadelToLocal(-170, -CITADEL.half - 28))} size={22} text="Hào thành" k={k} min={0.8} italic />}
          {want('river') && <PlanText p={toS(RIVER_ANCHOR.at[0], RIVER_ANCHOR.at[1])} size={30} text="Sông Thạch Hãn" k={k} min={0.12} italic rot={RIVER_ANCHOR.ang} color="#BFE0F7" />}
          {want('bridge') && <PlanText p={toS(...lonLatToLocal(107.1813, 16.7423))} size={24} text="Cầu Thạch Hãn" k={k} min={0.12} />}
        </g>
      )}
    </g>
  );
};

/** A label that fades in above scale k >= min (px/m) and out when the plan is too close to need it (k > 6). */
const PlanText: React.FC<{ p: [number, number]; size: number; text: string; k: number; min: number; italic?: boolean; rot?: number; color?: string }> = ({ p, size, text, k, min, italic, rot = 0, color }) => {
  const o = prog(k, min * 0.8, min) * (1 - prog(k, 6, 8));
  let a = rot; if (a > 90) a -= 180; if (a < -90) a += 180;
  if (o <= 0.01) return null;
  return <text transform={`translate(${p[0].toFixed(1)},${p[1].toFixed(1)}) rotate(${a.toFixed(1)})`} textAnchor="middle" fontSize={size} stroke="#0E1D2E" strokeWidth={size * 0.22} letterSpacing={size * 0.05} opacity={o} {...lab} fill={color ?? '#FFFFFF'} fontStyle={italic ? 'italic' : 'normal'}>{text}</text>;
};

/** Plan as a child of <GeoMap>: takes the map's camera and night, fades in between zoom 10000 and 30000, soft-edged patch. */
export const CitadelPlanInMap: React.FC<Omit<CitadelPlanProps, 'camera' | 'id'> & { id?: string; fadeFrom?: number; fadeTo?: number }> = ({ fadeFrom = 10000, fadeTo = 30000, opacity = 1, night, id, ...rest }) => {
  const { camera, night: mapNight, id: mid } = useGeo();
  const fade = clamp((Math.log(camera.zoom / fadeFrom)) / Math.log(fadeTo / fadeFrom), 0, 1);
  return <CitadelPlan {...rest} id={id ?? `${mid}-plan`} camera={camera} night={night ?? mapNight} opacity={opacity * fade} overlay />;
};
