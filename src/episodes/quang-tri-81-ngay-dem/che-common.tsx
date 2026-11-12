import React from 'react';
import { Camera, cameraAt } from '../../countryball/geo-camera';
import { CitadelPlan } from '../../countryball/citadel-plan';
import { cameraOnCitadel, localToScreen } from '../../countryball/citadel-geometry';
import { OSM_ATTRIBUTION } from '../../countryball/quang-tri-map-labels';
import { SourceLine } from '../../countryball/hud-chips';
import { Glow } from '../../countryball/fx-glow';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, mixMotion, hop } from '../../countryball/ball-motion';
import { Eyes } from '../../countryball/ball-face';
import { clamp, hash, Pt } from '../../countryball/fx-math';
import { ramp } from './chb-common';

// Chapter E shared helpers (the Thạch Hãn night crossings, students, Nguyễn Văn Thạc, the other side).
// Pure functions of the shot clock: `t` frames or `s` seconds, as noted. Screen 1920x1080.

/** Citadel-plan camera that drifts slowly between two (u, v, px-per-metre) views over `dur` seconds. */
export const planCam = (a: [number, number, number], b: [number, number, number], s: number, dur: number): Camera => {
  const ca = cameraOnCitadel(...a), cb = cameraOnCitadel(...b);
  return cameraAt([{ t: 0, ...ca }, { t: dur, ...cb, ease: 'linear' }], s);
};

/** The river crossing line in plan-view local metres: rear bank (west, river centre ~ x -615 m) -> the citadel bank (east). */
export const crossLine = (cam: Camera): { a: Pt; b: Pt } => ({ a: localToScreen(cam, -880, 30), b: localToScreen(cam, -410, -10) });

/** Night plan of the shattered Citadel + the Thạch Hãn with the OSM credit (CitadelPlan is visible, so ODbL credit is required). */
export const NightPlan: React.FC<{ id: string; cam: Camera; t: number; night?: number; damage?: number; fires?: number; flood?: number }> = ({
  id, cam, t, night = 0.85, damage = 0.8, fires = 0.4, flood = 0.35,
}) => (
  <g>
    <CitadelPlan id={id} camera={cam} t={t} damage={damage} night={night} fires={fires} flood={flood} labels={false} />
    <SourceLine text={`${OSM_ATTRIBUTION}; Natural Earth (public domain)`} t={t / 30} />
  </g>
);

/** Little soldier pictogram (helmet dome + body). `ghost` = only a pale outline (empty helmet), used for losses. */
export const SoldierIcon: React.FC<{ x: number; y: number; s?: number; color?: string; ghost?: number; o?: number }> = ({ x, y, s = 1, color = '#C8573F', ghost = 0, o = 1 }) => {
  const fill = ghost > 0.5 ? 'none' : color;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={o * (1 - 0.55 * ghost)} stroke={ghost > 0.5 ? '#9DB0C4' : '#141414'} strokeWidth={ghost > 0.5 ? 3 : 3.4} strokeLinejoin="round"
      strokeDasharray={ghost > 0.5 ? '6 5' : undefined}>
      <path d="M-18,34 Q-18,6 0,6 Q18,6 18,34 Z" fill={fill} />
      <circle cx={0} cy={-8} r={11} fill={ghost > 0.5 ? 'none' : '#E7C9A0'} />
      <path d="M-15,-10 Q-15,-27 0,-27 Q15,-27 15,-10 Z" fill={fill === 'none' ? 'none' : '#5C6A3A'} />
    </g>
  );
};

/** Night top-down river card: far bank (the Citadel side, cratered) on top, water band, near bank (rear) below; ripples drift. */
export const FlatRiver: React.FC<{ s: number; id: string; y0?: number; y1?: number; glow?: number }> = ({ s, id, y0 = 400, y1 = 690, glow = 0.5 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1F1A18" /><stop offset="1" stopColor="#16241B" /></linearGradient>
      <linearGradient id={`${id}-wat`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14293F" /><stop offset="1" stopColor="#0A1727" /></linearGradient>
      <clipPath id={`${id}-wclip`}><rect x={0} y={y0} width={1920} height={y1 - y0} /></clipPath>
    </defs>
    <rect width={1920} height={y0} fill={`url(#${id}-top)`} />
    <Glow x={1450} y={40} r={700} color="#FF7A2E" o={0.2 * glow} />
    {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={hash(i, 11) * 1920} cy={40 + hash(i, 12) * (y0 - 90)} rx={30 + 40 * hash(i, 13)} ry={12 + 14 * hash(i, 13)} fill="#0C1410" opacity={0.7} />)}
    <rect x={0} y={y1} width={1920} height={1080 - y1} fill="#0F1D17" />
    <rect x={0} y={y0} width={1920} height={y1 - y0} fill={`url(#${id}-wat)`} />
    <path d={`M0,${y0} Q480,${y0 + 14} 960,${y0 - 6} T1920,${y0 + 8}`} fill="none" stroke="#3B4A3A" strokeWidth={8} />
    <path d={`M0,${y1} Q480,${y1 - 12} 960,${y1 + 6} T1920,${y1 - 6}`} fill="none" stroke="#3B4A3A" strokeWidth={8} />
    <g clipPath={`url(#${id}-wclip)`} fill="none" stroke="#8FB4D6" strokeLinecap="round">
      {Array.from({ length: 26 }, (_, i) => {
        const y = y0 + 14 + hash(i, 3) * (y1 - y0 - 28), L = 50 + hash(i, 4) * 120, x = ((hash(i, 5) * 2200 + s * (30 + 20 * hash(i, 6))) % 2300) - 200;
        return <line key={i} x1={x} y1={y} x2={x + L} y2={y} strokeWidth={2.2} opacity={0.12 + 0.2 * hash(i, 7)} />;
      })}
    </g>
  </g>
);

/** A ball with a MuCoi helmet (QĐND / Quân Giải phóng): the young soldier. */
export const VnmSoldier: React.FC<{ id: string; x: number; y: number; r?: number; t: number; eyes?: Eyes; ph?: number; hat?: React.ReactNode; hops?: boolean; tear?: boolean }> = ({
  id, x, y, r = 120, t, eyes = 'determined', ph = 0, hat, hops = false, tear,
}) => (
  <Ball id={id} x={x} y={y} r={r} flag="VNM" eyes={eyes} hat={hat === undefined ? <MuCoi camo /> : hat} t={t} tear={tear}
    motion={hops ? mixMotion(breathe(t, 70, 0.03, ph), hop(t, 54, 14, ph)) : breathe(t, 74, 0.03, ph)} />
);

/** Small "Theo lời kể ..." style source tag on a rounded plate. */
export const SrcPlate: React.FC<{ x: number; y: number; text: string; o?: number; w?: number }> = ({ x, y, text, o = 1, w = 780 }) => (
  <g opacity={o}>
    <rect x={x - w / 2} y={y - 36} width={w} height={64} rx={32} fill="#15181F" fillOpacity={0.9} stroke="#E2B95A" strokeWidth={3} />
    <text x={x} y={y + 10} textAnchor="middle" fontSize={32} fontFamily="'Space Mono', monospace" fill="#F0E2BC" fontWeight={700}>{text}</text>
  </g>
);

/** Slow push-in wrapper so card shots are never frozen: scales the content about the screen centre. */
export const Push: React.FC<{ s: number; dur: number; from?: number; to?: number; cx?: number; cy?: number; children: React.ReactNode }> = ({ s, dur, from = 1, to = 1.06, cx = 960, cy = 540, children }) => {
  const k = from + (to - from) * clamp(s / dur);
  return <g transform={`translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})`}>{children}</g>;
};

export { ramp };
