import React from 'react';
import { FONT } from '../engine/fonts';
import { Camera } from './geo-camera';
import { clamp, Pt, prog } from './fx-math';
import { pathAt, samplePath } from './fx-flight-path';
import { TankKind, TankTop } from './ground-tanks';
import { FlagKind } from './flag-cloth';
import { AXIS_DEG, lonLatToLocal, MAIN_GATE, palaceToLocal, planCamera, LANDMARKS, bboxOf } from './palace-geometry';
import { PalaceTownLayer, PalaceTreeLayer, PAL } from './palace-plan-town-layer';
import { PalaceGroundsLayer } from './palace-plan-grounds-layer';
import { tone } from './citadel-palette';
import { useGeo } from './map-context';

// <PalacePlan>: top-down Dinh Độc Lập (Dinh Thống Nhất) and the streets around it, the hero location of the 30.4.1975 episode. It draws in
// its own LOCAL METRE FRAME (x east, y south, origin = the palace; see palace-geometry.ts) but takes the SAME `Camera` as <GeoMap>
// ({ lon, lat, zoom px/deg }), so one cameraAt() can fly from Vietnam down to the main gate. px per metre = zoom / 110574:
// 90000 -> 0.8 (the grounds ~ 400 px) | 175000 -> 1.6 (whole grounds) | 330000 -> 3 (palace + oval lawn + gate) | 660000 -> 6 (the gate).
//   Standalone (zoom >= ~15000): <svg><PalacePlan id camera .../></svg>: paints its own ground over the whole screen (data window = 2 km square around the
//   palace, beyond it plain ground). Inside <GeoMap>: <PalacePlanInMap/> fades in over the map (zoom 12000 -> 40000, feathered patch).
// Props (pure functions of props; t in FRAMES only drives the flag ripple and dust):
//   gate 0..1     main gate on Lê Duẩn: 0 intact, ~0.4 bent, 1 down flat (inwards, towards the palace) with dust (draw tanks over it)
//   flag          'none' | 'RVN' | 'PRG' (the NLF flag raised on the roof on 30.4.1975) on the roof pavilion, as a map icon (11 x 7 m)
//   tanks         [{ x, y, heading?, kind?, turret?, fire?, scale? }] in LOCAL metres (use palaceToLocal(front, side) or palaceRoute); default heading faces
//                 the palace (AXIS_DEG + 180); drawn as TankTop sprites >= 44 px long whatever the zoom
//   labels        true | ('palace'|'gate'|'church'|'streets'|'museum')[]    night 0..1    opacity 0..1
// Helpers (palace-geometry.ts): palaceToLocal(front, side), PALACE_POINTS (palace, mainGate, sideGateL/R, street, steps), cameraOnPalace,
// palaceScreen(cam, front, side) / localToScreen(cam, x, y) -> screen px to hang balls and fx; palaceRoute(points, u) below.

export type PalaceLabel = 'palace' | 'gate' | 'church' | 'streets' | 'museum';
export interface PlanTank { x: number; y: number; heading?: number; kind?: TankKind; turret?: number; fire?: number; scale?: number }
export interface PalacePlanProps {
  id: string; camera: Camera; t?: number; night?: number; gate?: number; flag?: FlagKind | 'none'; tanks?: PlanTank[]; labels?: boolean | PalaceLabel[]; opacity?: number;
}
const lab = { fontFamily: FONT.title, fontWeight: 800, paintOrder: 'stroke', strokeLinejoin: 'round', fill: '#FFFFFF' } as const;

/** Pose { x, y (local metres), heading (deg, 0 = east, 90 = south) } at u in 0..1 along a route given in the PALACE frame [front, side] points. */
export const palaceRoute = (points: Pt[], u: number): { x: number; y: number; heading: number } => {
  const p = pathAt(samplePath(points.map(([f, s]) => palaceToLocal(f, s) as Pt), 12), u);
  return { x: p.x, y: p.y, heading: p.heading };
};

// street names: [text, lon, lat, angle deg] (OSM street lines; angle along the street)
const STREETS: [string, number, number, number][] = [
  ['Lê Duẩn', 106.69788, 10.77962, -47], ['Nam Kỳ Khởi Nghĩa', 106.69727, 10.77747, 43], ['Nguyễn Du', 106.69699, 10.77572, -48],
  ['Nguyễn Thị Minh Khai', 106.69447, 10.77901, -47], ['Huyền Trân Công Chúa', 106.69454, 10.77611, 47],
];
const CHURCH = LANDMARKS.find((l) => l.name.includes('Đức Bà')), MUSEUM = LANDMARKS.find((l) => l.name.includes('Bảo tàng'));
const centre = (l: { pts: number[] } | undefined): Pt => { if (!l) return [0, 0]; const b = bboxOf(l.pts); return [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]; };

const Txt: React.FC<{ p: Pt; size: number; text: string; k: number; min: number; rot?: number; italic?: boolean; color?: string }> = ({ p, size, text, k, min, rot = 0, italic, color }) => {
  const o = prog(k, min * 0.8, min) * (1 - prog(k, 12, 16));
  let a = rot; while (a > 90) a -= 180; while (a < -90) a += 180;
  if (o <= 0.01 || p[0] < -200 || p[0] > 2120 || p[1] < -100 || p[1] > 1180) return null;
  return <text transform={`translate(${p[0].toFixed(1)},${p[1].toFixed(1)}) rotate(${a.toFixed(1)})`} textAnchor="middle" fontSize={size} stroke="#0E1D2E" strokeWidth={size * 0.22} letterSpacing={size * 0.05} opacity={o} {...lab} fill={color ?? '#FFFFFF'} fontStyle={italic ? 'italic' : 'normal'}>{text}</text>;
};

export const PalacePlan: React.FC<PalacePlanProps & { overlay?: boolean }> = ({ id, camera, t = 0, night = 0, gate = 0, flag = 'none', tanks = [], labels = false, opacity = 1, overlay = false }) => {
  const { k, c } = planCamera(camera);
  if (opacity <= 0.005) return null;
  const view: [number, number, number, number] = [c[0] - 960 / k, c[1] - 540 / k, c[0] + 960 / k, c[1] + 540 / k];
  const ni = clamp(night, 0, 1), want = (l: PalaceLabel) => labels === true || (Array.isArray(labels) && labels.includes(l));
  const toS = (x: number, y: number): Pt => [960 + (x - c[0]) * k, 540 + (y - c[1]) * k];
  const R = 800, feather = Math.max(2, 120 * k), sx = (x: number) => 960 + (x - c[0]) * k;
  const world = (
    <g transform={`translate(${(960 - c[0] * k).toFixed(2)},${(540 - c[1] * k).toFixed(2)}) scale(${k.toFixed(5)})`}>
      <PalaceTownLayer id={id} view={view} k={k} night={ni} />
      <PalaceGroundsLayer id={id} k={k} night={ni} gate={clamp(gate)} flag={flag} t={t} />
      <PalaceTreeLayer view={view} k={k} night={ni} />
    </g>
  );
  return (
    <g opacity={opacity}>
      {overlay && <defs>
        <filter id={`${id}-feather`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={feather} /></filter>
        <mask id={`${id}-patch`} maskUnits="userSpaceOnUse" x={-4000} y={-4000} width={9920} height={9080}>
          <rect x={sx(-R)} y={540 + (-R - c[1]) * k} width={2 * R * k} height={2 * R * k} fill="#FFF" filter={`url(#${id}-feather)`} />
        </mask>
      </defs>}
      {overlay ? <g mask={`url(#${id}-patch)`}>{world}</g> : <><rect width={1920} height={1080} fill={tone(PAL.ground, ni)} />{world}</>}
      {tanks.map((tk, i) => {
        const [x, y] = toS(tk.x, tk.y);
        return <TankTop key={i} x={x} y={y} heading={tk.heading ?? AXIS_DEG + 180} size={Math.max(44, 10 * k * (tk.scale ?? 1))} kind={tk.kind ?? 't54'} turret={tk.turret ?? 0} fire={tk.fire ?? 0} />;
      })}
      {labels && (
        <g>
          {want('palace') && <Txt p={toS(0, 0)} size={Math.max(24, Math.min(50, k * 14))} text="DINH ĐỘC LẬP" k={k} min={0.5} />}
          {want('gate') && <Txt p={toS(MAIN_GATE[0] + 10, MAIN_GATE[1] - 10)} size={28} text="Cổng chính" k={k} min={1.2} rot={AXIS_DEG + 90} />}
          {want('church') && <Txt p={toS(...centre(CHURCH))} size={26} text="Nhà thờ Đức Bà" k={k} min={0.4} />}
          {want('museum') && <Txt p={toS(...centre(MUSEUM))} size={22} text="Dinh Gia Long" k={k} min={1.0} />}
          {want('streets') && STREETS.map(([s, lon, lat, a]) => <Txt key={s} p={toS(...lonLatToLocal(lon, lat))} size={22} text={s} k={k} min={0.9} rot={a} italic color="#F2F0E2" />)}
        </g>
      )}
    </g>
  );
};

/** Plan as a child of <GeoMap>: uses the map's camera and night, fades in between zoom 12000 and 40000 (feathered 1.6 km patch). */
export const PalacePlanInMap: React.FC<Omit<PalacePlanProps, 'camera' | 'id'> & { id?: string; fadeFrom?: number; fadeTo?: number }> = ({ fadeFrom = 12000, fadeTo = 40000, opacity = 1, night, id, ...rest }) => {
  const { camera, night: mapNight, id: mid } = useGeo();
  const fade = clamp(Math.log(camera.zoom / fadeFrom) / Math.log(fadeTo / fadeFrom), 0, 1);
  return <PalacePlan {...rest} id={id ?? `${mid}-palace`} camera={camera} night={night ?? mapNight} opacity={opacity * fade} overlay />;
};
