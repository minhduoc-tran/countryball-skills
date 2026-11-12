import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, CameraKey, cameraAt } from '../../countryball/geo-camera';
import { CitadelPlan } from '../../countryball/citadel-plan';
import { OSM_ATTRIBUTION } from '../../countryball/quang-tri-map-labels';
import { DateChip } from '../../countryball/hud-date-chip';
import { SourceLine } from '../../countryball/hud-chips';
import { clamp, easeOut, prog } from '../../countryball/fx-math';
import { cameraOnLocal } from './chc-common';

// Chapter H helpers: soft memorial text (cream, dark outline, warm glow), hand-written poem lines that write themselves
// left to right, and the standalone CitadelPlan "today" scene (memorial mode, green, damage 0) with optional veil / night.
export { cameraOnLocal };

export const CREAM = '#FFE9B8';
export const OSM_LINE = `${OSM_ATTRIBUTION}; Natural Earth (public domain)`;

/** fade in at `a`..`b`, out at `c`..`d` (frames) -> 0..1 */
export const inOut = (t: number, a: number, b: number, c = 1e9, d = 1e9 + 1) => prog(t, a, b) * (1 - prog(t, c, d));

/** Outlined title/caption text. Fades + rises in over 14 frames from `at` (frames of the shot), optional fade out [from, to]. */
export const SoftT: React.FC<{
  t: number; x: number; y: number; text: string; size?: number; color?: string; at?: number; out?: [number, number]; anchor?: 'start' | 'middle' | 'end';
  font?: 'title' | 'ui' | 'hand'; weight?: number; ls?: number; glow?: string;
}> = ({ t, x, y, text, size = 64, color = '#FFFFFF', at = 0, out, anchor = 'middle', font = 'title', weight = 800, ls = 0, glow }) => {
  const k = easeOut(prog(t, at, at + 14)) * (out ? 1 - prog(t, out[0], out[1]) : 1);
  if (k <= 0.01) return null;
  return (
    <text x={x} y={y + (1 - k) * 18} textAnchor={anchor} fontFamily={FONT[font]} fontWeight={weight} fontSize={size} fill={color} stroke="#050B15" strokeWidth={Math.max(5, size * 0.15)}
      paintOrder="stroke" strokeLinejoin="round" letterSpacing={ls} opacity={k} style={glow ? { filter: `drop-shadow(0 0 ${size * 0.22}px ${glow})` } : undefined}>{text}</text>
  );
};

/** Hand-written line (Itim) that writes itself left to right between frames a and b; `dim` lowers it once a newer line arrives. */
export const HandLine: React.FC<{ id: string; t: number; x: number; y: number; text: string; a: number; b: number; size?: number; dim?: number; color?: string }> = ({
  id, t, x, y, text, a, b, size = 88, dim = 1, color = CREAM,
}) => {
  const u = prog(t, a, b);
  if (u <= 0) return null;
  const w = text.length * size * 0.46, x0 = x - w / 2;
  return (
    <g opacity={dim}>
      <clipPath id={`${id}-clip`}><rect x={x0 - 30} y={y - size * 1.1} width={(w + 60) * easeOut(u)} height={size * 1.7} /></clipPath>
      <g clipPath={`url(#${id}-clip)`} style={{ filter: 'drop-shadow(0 0 14px rgba(255,190,90,0.55))' }}>
        <text x={x} y={y} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={size} fill={color} stroke="#0A0F1C" strokeWidth={size * 0.12} paintOrder="stroke" strokeLinejoin="round">{text}</text>
      </g>
      {/* pen glow at the writing edge */}
      {u < 1 && <circle cx={x0 - 30 + (w + 60) * easeOut(u)} cy={y - size * 0.3} r={9} fill="#FFE29A" opacity={0.85} style={{ filter: 'drop-shadow(0 0 10px #FFB347)' }} />}
    </g>
  );
};

type PlanProps = {
  t: number; id: string; keys: CameraKey[]; night?: number; labels?: boolean | ('citadel' | 'gates' | 'moat' | 'river' | 'bridge')[];
  date?: string; veil?: number; under?: (cam: Camera) => React.ReactNode; over?: (cam: Camera) => React.ReactNode; credit?: boolean;
};
/** Standalone CitadelPlan today (memorial mode, damage 0). Camera keys in seconds. Always carries the OSM credit. */
export const PlanToday: React.FC<PlanProps> = ({ t, id, keys, night = 0, labels = false, date, veil = 0, under, over, credit = true }) => {
  const s = t / 30, cam = cameraAt(keys, s);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1D2E" />
      <CitadelPlan id={id} camera={cam} t={t} memorial damage={0} night={night} labels={labels} />
      {under?.(cam)}
      {veil > 0 && <rect width={1920} height={1080} fill="#050B15" opacity={veil} />}
      {over?.(cam)}
      {date && <DateChip label={date} t={s} id={`${id}-date`} />}
      {credit && <SourceLine text={OSM_LINE} t={s} />}
    </g>
  );
};

export const driftCam = (a: Camera, b: Camera, dur: number): CameraKey[] => [{ t: 0, ...a, ease: 'linear' }, { t: dur, ...b, ease: 'linear' }];
export { clamp, easeOut, prog };
