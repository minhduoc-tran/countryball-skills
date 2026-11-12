import React from 'react';
import { FONT } from '../../engine';
import { Camera, CameraKey, cameraAt } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { CitadelPlan, CitadelPlanInMap } from '../../countryball/citadel-plan';
import { CITADEL, M_PER_DEG } from '../../countryball/citadel-geometry';
import { OSM_ATTRIBUTION } from '../../countryball/quang-tri-map-labels';
import { DateChip } from '../../countryball/hud-date-chip';
import { SourceLine } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { clamp, easeOut, prog } from '../../countryball/fx-math';

// Chapter C helpers (Thành cổ introduced): outlined captions, tag chips, day chip, name card with a plain silhouette, and
// two scene wrappers: MapScene (GeoMap, neutral 1972 land) and PlanScene (standalone CitadelPlan). Cameras are keyed in
// SECONDS (cameraAt), everything else in frames `t` of the shot (30 fps). Every wrapper shows the OSM credit.

export const INK = '#111';
export const NEUTRAL_LAND = { VNM: '#B9A88A' };
export const VNM_RED = '#E0483C';
export const RVN_YELLOW = '#F2C230';
export const CREDIT = `${OSM_ATTRIBUTION}; Natural Earth (public domain)`;
export { clamp, easeOut, prog };

/** Camera looking at a LOCAL metre point (x east, y south of the citadel origin) at `ppm` px per metre. */
export const cameraOnLocal = (x: number, y: number, ppm: number): Camera => ({
  lon: CITADEL.lon + x / (111320 * Math.cos((CITADEL.lat * Math.PI) / 180)), lat: CITADEL.lat - y / M_PER_DEG, zoom: ppm * M_PER_DEG,
});

/** Slow linear drift between two cameras over `dur` seconds (never frozen). */
export const driftKeys = (a: Camera, b: Camera, dur: number): CameraKey[] => [
  { t: 0, ...a, ease: 'linear' }, { t: dur, ...b, ease: 'linear' },
];

/** Big outlined caption that pops in at frame `at`. */
export const Cap: React.FC<{ t: number; x: number; y: number; text: string; size?: number; color?: string; at?: number; anchor?: 'start' | 'middle' | 'end'; font?: 'title' | 'ui' | 'hand' }> = ({
  t, x, y, text, size = 64, color = '#FFFFFF', at = 0, anchor = 'middle', font = 'title',
}) => {
  const k = easeOut((t - at) / 7);
  if (k <= 0.01) return null;
  return (
    <text x={x} y={y + (1 - k) * 22} textAnchor={anchor} fontFamily={FONT[font]} fontWeight={800} fontSize={size} fill={color} stroke="#0A121C" strokeWidth={size * 0.16}
      paintOrder="stroke" strokeLinejoin="round" opacity={k}>{text}</text>
  );
};

/** Rounded tag chip centred on (x, y) with optional second line. */
export const Tag: React.FC<{ t: number; at?: number; x: number; y: number; text: string; fill?: string; color?: string; size?: number; sub?: string; subColor?: string }> = ({
  t, at = 0, x, y, text, fill = '#C9343A', color = '#FFF', size = 40, sub, subColor,
}) => {
  const k = easeOut((t - at) / 8);
  if (k <= 0.01) return null;
  const w = Math.max(text.length * size * 0.6, (sub ?? '').length * size * 0.34) + size * 1.3, h = size * 1.7 + (sub ? size * 0.65 : 0);
  return (
    <g transform={`translate(${x},${y}) scale(${0.85 + 0.15 * k})`} opacity={k}>
      <rect x={-w / 2 + 5} y={-h / 2 + 7} width={w} height={h} rx={h / 2.6} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.6} fill={fill} stroke={INK} strokeWidth={5} />
      <text y={sub ? -size * 0.08 : size * 0.35} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color}>{text}</text>
      {sub && <text y={size * 0.85} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size * 0.46} fill={subColor ?? color} opacity={0.95}>{sub}</text>}
    </g>
  );
};

/** "NGÀY 14/81" chip under the date chip (sun icon, same geometry as NightChip). */
export const DayChip: React.FC<{ t: number; label: string; at?: number }> = ({ t, label, at = 0 }) => {
  const k = easeOut((t - at) / 12);
  if (k <= 0.01) return null;
  const W = 120 + label.length * 19;
  return (
    <g transform={`translate(${56 - (1 - k) * 260},142)`} opacity={k}>
      <rect width={W} height={64} rx={32} fill="#15181F" fillOpacity={0.88} stroke="#E2B95A" strokeWidth={3.5} />
      <circle cx={42} cy={32} r={10} fill="#F2C94C" />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={42 + 15 * Math.cos(i * 0.785)} y1={32 + 15 * Math.sin(i * 0.785)} x2={42 + 21 * Math.cos(i * 0.785)} y2={32 + 21 * Math.sin(i * 0.785)} stroke="#F2C94C" strokeWidth={4} strokeLinecap="round" />)}
      <text x={76} y={44} fontSize={32} fontFamily={FONT.title} fontWeight={800} fill="#FFF1CC" letterSpacing={1}>{label}</text>
    </g>
  );
};

/** Plain name card (respectful: simple silhouette, no face) for real people. */
export const NameCard: React.FC<{ t: number; at?: number; x: number; y: number; name: string; sub?: string; w?: number }> = ({ t, at = 0, x, y, name, sub, w = 560 }) => {
  const k = easeOut((t - at) / 10);
  if (k <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y + (1 - k) * 40}) rotate(-1.5)`} opacity={k}>
      <rect x={-w / 2 + 8} y={-100 + 12} width={w} height={220} rx={18} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-100} width={w} height={220} rx={18} fill="#F2EBD8" stroke={INK} strokeWidth={5} />
      <rect x={-w / 2 + 22} y={-78} width={150} height={176} rx={10} fill="#4A5A6E" stroke={INK} strokeWidth={4} />
      <circle cx={-w / 2 + 97} cy={-20} r={38} fill="#8E9CAE" /><path d={`M${-w / 2 + 30},98 Q${-w / 2 + 97},12 ${-w / 2 + 164},98 Z`} fill="#8E9CAE" />
      <text x={-w / 2 + 196} y={-14} fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(46, ((w - 220) / name.length) * 1.55)} fill="#1C2733">{name}</text>
      {sub && <text x={-w / 2 + 196} y={36} fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#5A4A2A">{sub}</text>}
    </g>
  );
};

type Hud = { date?: string; dates?: { t: number; label: string }[]; day?: string; dayAt?: number; mini?: boolean };

/** Map scene (GeoMap, neutral land): keys in seconds, date + day chip, minimap, OSM credit. */
export const MapScene: React.FC<Hud & {
  t: number; id: string; keys: CameraKey[]; night?: number; map?: React.ReactNode; over?: (cam: Camera) => React.ReactNode; provinceColors?: Record<string, string>;
}> = ({ t, id, keys, night = 0, map, over, provinceColors, date, dates, day, dayAt = 0, mini = true }) => {
  const s = t / 30, cam = cameraAt(keys, s);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1D2E" />
      <GeoMap camera={cam} night={night} colors={NEUTRAL_LAND} provinces rivers id={id} provinceColors={provinceColors}>{map}</GeoMap>
      {over?.(cam)}
      {(date || dates) && <DateChip label={date} dates={dates} t={s} id={`${id}-date`} />}
      {day && <DayChip t={t} label={day} at={dayAt} />}
      {mini && <MiniMap camera={cam} id={`${id}-mini`} />}
      <SourceLine text={CREDIT} t={s} />
    </g>
  );
};

type PlanOpts = { damage?: number; night?: number; fires?: number; flood?: number; labels?: boolean | ('citadel' | 'gates' | 'moat' | 'river' | 'bridge')[]; opacity?: number; craters?: number };
/** CitadelPlan scene. `plan` may be a function of t for animated damage. Standalone plan when zoom >= 20000, else map + soft overlay. */
export const PlanScene: React.FC<Hud & PlanOpts & { t: number; id: string; keys: CameraKey[]; over?: (cam: Camera) => React.ReactNode; under?: (cam: Camera) => React.ReactNode }> = ({
  t, id, keys, over, under, date, dates, day, dayAt = 0, mini = true, ...opts
}) => {
  const s = t / 30, cam = cameraAt(keys, s);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1D2E" />
      {cam.zoom >= 20000
        ? <CitadelPlan id={id} camera={cam} t={t} {...opts} />
        : <GeoMap camera={cam} colors={NEUTRAL_LAND} provinces rivers id={`${id}-m`}><CitadelPlanInMap damage={opts.damage} labels={opts.labels} /></GeoMap>}
      {under?.(cam)}
      {over?.(cam)}
      {(date || dates) && <DateChip label={date} dates={dates} t={s} id={`${id}-date`} />}
      {day && <DayChip t={t} label={day} at={dayAt} />}
      {mini && <MiniMap camera={cam} id={`${id}-mini`} />}
      <SourceLine text={CREDIT} t={s} />
    </g>
  );
};
