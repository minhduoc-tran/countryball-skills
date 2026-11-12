import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, cameraAt } from '../../countryball/geo-camera';
import { cameraOnCitadel, citadelScreen } from '../../countryball/citadel-geometry';
import { Glow } from '../../countryball/fx-glow';
import { flicker, prog } from '../../countryball/fx-math';

// Chapter A: camera + small overlays for the citadel (top-down plan) scenes. t = shot frames, citadel frame in metres.

export type CitView = [u: number, v: number, pxPerM: number];

/** Slow linear drift between two citadel-centred views over the whole shot. */
export const citadelCam = (t: number, len: number, a: CitView, b: CitView = a): Camera =>
  cameraAt([{ t: 0, ...cameraOnCitadel(...a) }, { t: len / 30, ...cameraOnCitadel(...b), ease: 'linear' }], t / 30);

/** Dimension bracket between two citadel-frame points (offset outwards by the caller), grows from `a` over 14 frames. */
export const DimLine: React.FC<{ cam: Camera; t: number; a: number; p: [number, number]; q: [number, number]; text: string; side?: 1 | -1; color?: string }> = ({ cam, t, a, p, q, text, side = -1, color = '#FFD25A' }) => {
  const k = prog(t, a, a + 14);
  if (k <= 0.01) return null;
  const [x1, y1] = citadelScreen(cam, p[0], p[1]), [x2, y2] = citadelScreen(cam, q[0], q[1]);
  const ex = x1 + (x2 - x1) * k, ey = y1 + (y2 - y1) * k, ang = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(ang) * 16, ny = Math.cos(ang) * 16;
  let rot = (ang * 180) / Math.PI; if (rot > 90) rot -= 180; if (rot < -90) rot += 180;
  const tk = prog(t, a + 10, a + 22);
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke="#0B0F16" strokeWidth={11} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={5} strokeLinecap="round" />
      {[[x1, y1], [x2, y2]].map(([x, y], i) => (k > 0.95 || i === 0) && <line key={i} x1={x - nx} y1={y - ny} x2={x + nx} y2={y + ny} stroke={color} strokeWidth={6} strokeLinecap="round" />)}
      <text transform={`translate(${(x1 + x2) / 2 - Math.sin(ang) * 50 * side},${(y1 + y2) / 2 + Math.cos(ang) * 50 * side}) rotate(${rot})`} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44}
        fill={color} stroke="#0B0F16" strokeWidth={8} paintOrder="stroke" strokeLinejoin="round" opacity={tk}>{text}</text>
    </g>
  );
};

/** Citadel outline (the 480 m square) as a pulsing gold polygon. */
export const CitadelOutline: React.FC<{ cam: Camera; t: number; a?: number; color?: string }> = ({ cam, t, a = 0, color = '#FFD25A' }) => {
  const u = prog(t, a, a + 16);
  if (u <= 0) return null;
  const c = [[-240, -240], [240, -240], [240, 240], [-240, 240]].map(([x, y]) => citadelScreen(cam, x, y));
  return <polygon points={c.map((p) => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={5} strokeDasharray="22 12" strokeDashoffset={-t * 0.8} opacity={0.9 * u} />;
};

/** Flicker glow of distant fires/artillery at the screen edge (night scenes). */
export const EdgeGlows: React.FC<{ t: number; pts: [number, number][]; r?: number }> = ({ t, pts, r = 220 }) => (
  <g>{pts.map(([x, y], i) => <Glow key={i} x={x} y={y} r={r * flicker(t * 1.3, i)} color="#FF7A22" o={0.32 + 0.2 * Math.sin(t / 5 + i * 2)} />)}</g>
);
