import React from 'react';
import { rnd, clamp, proj, px, poly, streetStand, ST, Glow } from '../../engine';
import { Rain } from '../mot-cu-dam/storm-sky';
import { PAL } from './kit-palette';

// Pip's street / the crossroads at 16:00 in the rain, on the engine <Street> (read src/engine/sets/street.tsx: the
// street's ground is in METRES, X across (kerbs +-4.2, sidewalks to +-7.2), Z depth; streetStand(X, Z) places people).
// Draw order in a shot:  <Street t id />  <WetRoad t id amount />  characters  <RainVeil t id amount />  (RainVeil is
// screen space: put it OUTSIDE the camera group, last). Keep Street's `low` at 0 with these helpers.
//   <WetRoad t id amount puddles? />  wet asphalt: a cool sheen over the road, long reflections under the sun and the
//       traffic light, puddles with rain rings (default PUDDLES; pass [] for none). World space, inside the camera.
//   <RainVeil t id amount />  screen-space rain: overcast grey sky band, blue-grey darkening (PAL.rain), two depths of
//       streaks, splashes on the ground half. amount 0..1 (0 draws nothing: ramp it 0 -> 1 for "trời đổ mưa").
//   <Puddle X Z r t id />  one puddle on the road at (X, Z), r metres.
//   <HandUmbrella x y s t rot? open? color? />  a hand-held umbrella: x y = the hand on the handle, canopy ~300 wide,
//       ~330 above the hand at s 1 (scale it with the holder's scale). open 0..1 (0 = furled). Rain drips off its rim.
// KEY COORDINATES (street metres; the zebra crossing nearest the camera spans Z 9.4-11.7 across the whole road):
export const XR = {
  ZEBRA: { z0: 9.4, z1: 11.7 },
  SLIP: { X: -0.6, Z: 10.3 }, // where the granny slips, on the zebra just left of the centre line
  PIP_WATCH: { X: -5.6, Z: 8.2 }, // Pip on the left sidewalk, watching (day 1) / starting his run (sidewalk: true)
  LIGHT: { X: 4.7, Z: 13.5 }, // the traffic light on the right kerb
};
/** Hip point + scale for the granny at the slip spot (or offset by dX metres while she crosses). */
export const slipStand = (dX = 0) => streetStand(XR.SLIP.X + dX, XR.SLIP.Z, { k: 1.45 });
export const PUDDLES: [number, number, number][] = [[-0.9, 10.6, 0.7], [1.6, 6.2, 0.9], [-2.6, 7.6, 0.6], [2.4, 14.5, 0.8], [-1.4, 19, 1]];

export const Puddle: React.FC<{ X: number; Z: number; r: number; t: number; id: string }> = ({ X, Z, r, t, id }) => {
  const p = proj(X, 0, Z);
  const rx = r * px(Z);
  const ry = rx * (ST.camH / Z);
  return (
    <g>
      {/* still water mirrors the overcast sky: lighter than the asphalt, a darker wet rim */}
      <ellipse cx={p.x} cy={p.y} rx={rx * 1.08} ry={ry * 1.15} fill="#262C3A" opacity={0.5} />
      <ellipse cx={p.x} cy={p.y} rx={rx} ry={ry} fill="#8C9AB4" opacity={0.6} />
      <ellipse cx={p.x - rx * 0.15} cy={p.y - ry * 0.25} rx={rx * 0.55} ry={ry * 0.35} fill="#C9D6EA" opacity={0.35} />
      {[0, 1, 2].map((k) => {
        const ph = ((t + rnd(Math.round(X * 10 + Z), k) * 24) % 24) / 24;
        const cx = p.x + (rnd(7, k + Math.round(Z)) - 0.5) * rx;
        return <ellipse key={`${id}${k}`} cx={cx} cy={p.y + (rnd(8, k) - 0.5) * ry * 0.6} rx={rx * 0.35 * ph} ry={ry * 0.35 * ph} fill="none" stroke="#C9D8EE" strokeWidth={Math.max(1, rx * 0.02)} opacity={0.7 * (1 - ph)} />;
      })}
    </g>
  );
};

export const WetRoad: React.FC<{ t: number; id: string; amount?: number; puddles?: [number, number, number][] }> = ({ t, id, amount = 1, puddles = PUDDLES }) => {
  if (amount <= 0) return null;
  const light = proj(XR.LIGHT.X - 0.6, 0, XR.LIGHT.Z);
  return (
    <g opacity={amount}>
      <defs>
        <linearGradient id={`${id}wet`} x1="0" y1={ST.vy} x2="0" y2={1080} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B9C8E0" stopOpacity={0.5} />
          <stop offset="0.35" stopColor="#7E8EAA" stopOpacity={0.22} />
          <stop offset="1" stopColor="#4A5670" stopOpacity={0.12} />
        </linearGradient>
        <linearGradient id={`${id}refl`} x1="0" y1={ST.vy} x2="0" y2={1080} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE2B0" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFE2B0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={poly([[-4.2, 0, 2.2], [4.2, 0, 2.2], [4.2, 0, 120], [-4.2, 0, 120]])} fill={`url(#${id}wet)`} style={{ mixBlendMode: 'screen' }} />
      {/* the bright gap of sky at the street's end: the rain's only daylight */}
      <Glow x={ST.vx} y={ST.vy - 30} r={520} kind="cool" o={0.55} />
      {/* long wobbly reflections: the low sun at the street's end, the traffic light */}
      {Array.from({ length: 7 }).map((_, k) => {
        const x = 960 + (k - 3) * 9 + Math.sin(t / 7 + k) * 3;
        return <rect key={`rs${k}`} x={x - 5} y={ST.vy + 8} width={10 - Math.abs(k - 3) * 1.2} height={600} fill={`url(#${id}refl)`} opacity={0.5} />;
      })}
      <rect x={light.x - 8} y={light.y} width={16} height={280} fill="#FF6A5A" opacity={0.18 + 0.05 * Math.sin(t / 5)} style={{ mixBlendMode: 'screen' }} />
      {puddles.map(([X, Z, r], k) => <Puddle key={k} X={X} Z={Z} r={r} t={t} id={`${id}p${k}`} />)}
    </g>
  );
};

export const RainVeil: React.FC<{ t: number; id: string; amount?: number }> = ({ t, id, amount = 1 }) => {
  const a = clamp(amount);
  if (a <= 0) return null;
  return (
    <g style={{ pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={`${id}ov`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E4A60" stopOpacity={0.92} />
          <stop offset="0.3" stopColor="#56647E" stopOpacity={0.7} />
          <stop offset="0.5" stopColor="#6E7C94" stopOpacity={0.25} />
          <stop offset="0.7" stopColor="#6E7C94" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* blue-grey darkening of the whole picture, then the overcast sky over the top */}
      <rect x={0} y={0} width={1920} height={1080} fill={PAL.rain} opacity={0.5 * a} style={{ mixBlendMode: 'multiply' }} />
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id}ov)`} opacity={a} />
      <rect x={0} y={0} width={1920} height={1080} fill="#9AAAC4" opacity={0.08 * a} />
      {/* rain in two depths: fine and far, heavy and near */}
      <Rain t={t} intensity={0.9 * a} slant={0.12} seed={11} color="#C9D8EE" />
      <g opacity={0.9}>
        <Rain t={t * 1.3} intensity={0.35 * a} slant={0.14} seed={23} color="#E6EEFA" />
      </g>
      {/* splashes on the lower half: little crowns that pop and fade */}
      {Array.from({ length: Math.round(34 * a) }).map((_, k) => {
        const ph = ((t + rnd(31, k) * 10) % 10) / 10;
        const cyc = Math.floor((t + rnd(31, k) * 10) / 10);
        const x = rnd(32 + cyc, k) * 1920;
        const y = 640 + rnd(33 + cyc, k) * 440;
        const s = 0.5 + ((y - 640) / 440) * 1.2;
        return (
          <g key={k} opacity={(1 - ph) * 0.5} stroke="#D8E4F4" strokeWidth={1.5 * s} strokeLinecap="round" fill="none">
            <ellipse cx={x} cy={y} rx={12 * s * ph + 2} ry={3 * s * ph + 1} />
            {ph < 0.4 ? <g fill="#D8E4F4" stroke="none"><circle cx={x - 6 * s} cy={y - 8 * s * (1 - ph)} r={1.6 * s} /><circle cx={x + 6 * s} cy={y - 9 * s * (1 - ph)} r={1.6 * s} /></g> : null}
          </g>
        );
      })}
    </g>
  );
};

export const HandUmbrella: React.FC<{ x: number; y: number; s?: number; t?: number; rot?: number; open?: number; color?: string }> = ({ x, y, s = 1, t = 0, rot = 0, open = 1, color = '#3E8C86' }) => {
  const o = clamp(open);
  const w = 30 + 140 * o; // half width of the canopy
  const top = -330;
  const rim = top + 40 + 60 * o;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* the J handle and the shaft */}
      <path d="M 0 -8 L 0 26 Q 0 46 -18 46 Q -32 46 -32 32" stroke="#2A1E1C" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M 0 0 L 0 ${top}`} stroke="#3A3446" strokeWidth={7} strokeLinecap="round" />
      {/* the canopy: scalloped rim, panel seams, a lit edge on top */}
      <path d={`M ${-w} ${rim} Q ${-w * 0.8} ${top + 8} 0 ${top} Q ${w * 0.8} ${top + 8} ${w} ${rim} Q ${w * 0.75} ${rim - 22} ${w * 0.5} ${rim} Q ${w * 0.25} ${rim - 22} 0 ${rim} Q ${-w * 0.25} ${rim - 22} ${-w * 0.5} ${rim} Q ${-w * 0.75} ${rim - 22} ${-w} ${rim} Z`} fill={color} stroke="#14121C" strokeWidth={5} strokeLinejoin="round" />
      {[-0.5, 0, 0.5].map((k) => <path key={k} d={`M 0 ${top} Q ${w * k * 0.9} ${top + 20} ${w * k} ${rim - 10}`} stroke="#14121C" strokeWidth={3} fill="none" opacity={0.45} />)}
      <path d={`M ${-w * 0.8} ${rim - 30} Q ${-w * 0.5} ${top + 6} 0 ${top + 2}`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.25} strokeLinecap="round" />
      <circle cx={0} cy={top - 8} r={7} fill="#14121C" />
      {/* drips falling off the rim */}
      {o > 0.6
        ? [-1, -0.5, 0.5, 1].map((k, i) => {
            const ph = ((t * 1.4 + i * 7) % 20) / 20;
            return <ellipse key={i} cx={w * k} cy={rim + 6 + ph * 140} rx={3} ry={7} fill="#D8E4F4" opacity={0.75 * (1 - ph)} />;
          })
        : null}
    </g>
  );
};
