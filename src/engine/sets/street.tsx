import React from 'react';
import { rnd, clamp } from '../anim';
import { DuskSky, Sun, NightSky, Stars, Moon, Skyline } from '../kit';
import { Glow, LightVeil, Dust } from '../light';
import { ST, proj, propScale, makeCtx, lightOn, Ctx } from '../street-geom';
import { Motorbike, StreetLamp, TrafficLight, LightState, Bus, MarketStall } from '../street-props';
import { makeLots, shopHouse } from './street-buildings';
import { Ground, Weeds } from './street-ground';
import { POLES, PowerPole, Cables, StreetTree, Stools, PlantPot, BusStopSign, Litter } from './street-furniture';

export * from './street-crossroads';

// A Vietnamese city street at dusk, seen down its length in one-point perspective (street-geom.ts has the camera).
//
// GROUND COORDINATES (metres, the same in every helper): X across, 0 = the road's centre line, -4.2 / +4.2 the kerbs
// (left / right), sidewalks 4.2-7.2, shophouse fronts at +-7.2. Z is depth from the camera: 3 is nearly at the lens,
// 6-10 a close wide, 100 the end of the street. The vanishing point is (960, 470); the road is y = 470 + 1500 / Z, so
// y 700 is Z 6.5, y 900 is Z 3.5. The sun sits at the end of the street, so people are back-lit: rimId "rimL" / "rimR"
// on the side facing the centre, "rimBlue" at night.
//   const p = streetStand(0.3, 6.5);   // hip point + scale for <Hero pose={{ ...pose, ...p }} />
// A road bike, a stall or the bus is drawn as a billboard at its Z with propScale(Z). Everything is depth-sorted, so a
// character drawn AFTER <Street> stands in front of all of it: for a character that must go behind a near bike or a
// stall, draw that prop again after the Hero (the preview episode's S3 does this with the key bike).
//
// Props: t (clock: sways, flicker), id (unique svg ids), veil (dark contrast pass, 0.34), light ('red' | 'yellow' |
// 'green', else it cycles from t: green 3 s, yellow 0.8 s, red 3.2 s), market 0..1 (stalls set up along the sidewalk),
// bus (a bus at the stop on the right, doors open, route 09), grass 0..1 (weeds, moss, vines), night, blackout 0..1
// (lamps, windows, signs, shop lights go dark in a ragged sweep), red 0..1 (the dark turn's tint), low (px: camera
// tilts up, the street drops by this much; pass it to streetStand too).

export type StreetProps = { t: number; id?: string; veil?: number; light?: LightState; market?: number; bus?: boolean; grass?: number; night?: boolean; blackout?: number; red?: number; low?: number; moon?: boolean };

/** The cycling traffic light: green 90 f, yellow 24 f, red 96 f, with the seconds left. */
export const trafficState = (t: number): { state: LightState; count: number } => {
  const p = ((t % 210) + 210) % 210;
  return p < 90 ? { state: 'green', count: Math.ceil((90 - p) / 30) } : p < 114 ? { state: 'yellow', count: Math.ceil((114 - p) / 30) } : { state: 'red', count: Math.ceil((210 - p) / 30) };
};

/** The scooters abandoned in the road (X, Z in metres): the preview's keyed bike is the first one. */
export const ROAD_BIKES = [
  { X: 1.7, Z: 7.4, facing: 1 as const, lean: -9, color: '#B8483E' },
  { X: -1.9, Z: 11.8, facing: -1 as const, lean: 0, color: '#3E6A8A' },
  { X: 2.5, Z: 18, facing: -1 as const, lean: 8, color: '#D9A441' },
  { X: -2.4, Z: 24, facing: 1 as const, lean: -6, color: '#2E2B3D' },
  { X: 0.3, Z: 31, facing: 1 as const, lean: 0, color: '#EDE6D6' },
  { X: -1.3, Z: 43, facing: -1 as const, lean: 7, color: '#B8483E' },
  { X: 2.8, Z: 58, facing: 1 as const, lean: 0, color: '#3E6A8A' },
];
const BIKE_COLS = ['#2E2B3D', '#B8483E', '#EDE6D6', '#3E6A8A', '#D9A441', '#2FA595', '#7A5A8A'];
// motorbikes parked in rows across the sidewalk, nose to the shop (z of each bike, per side)
const PARKED: [number, number[]][] = [
  [-1, [6.2, 6.9, 7.6, 8.3, 14.5, 15.2, 15.9, 21, 21.7, 22.4, 23.1, 29, 29.7, 40, 40.8, 41.6, 52, 52.8, 63, 63.8]],
  [1, [5.5, 6.2, 13, 13.7, 14.4, 15.1, 19.5, 20.2, 27, 27.7, 28.4, 34.5, 35.2, 35.9, 47, 47.8, 48.6, 58, 58.8]],
];
const LAMPS: [number, number][] = [[1, 5.8], [-1, 15], [1, 31], [-1, 41], [1, 57], [-1, 72], [1, 86]];
const TREES: [number, number][] = [[-5.5, 8.5], [5.5, 16], [-5.5, 24.5], [5.5, 37.5], [-5.5, 48], [5.5, 61]];

type Item = { z: number; el: React.ReactNode };

/** Soft clouds lit from below by the low sun. */
const Clouds: React.FC<{ t: number }> = ({ t }) => (
  <g filter="url(#blur6)">
    {[[560, 190, 300, 22], [1380, 150, 340, 24], [980, 300, 220, 14], [200, 270, 260, 18], [1700, 320, 220, 14]].map(([cx, cy, rx, ry], i) => (
      <g key={i} transform={`translate(${(t * 0.15 * (i % 2 ? 1 : -1)) % 50} 0)`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#6A3E6E" opacity={0.7} />
        <ellipse cx={cx + 10} cy={cy + ry * 0.5} rx={rx * 0.9} ry={ry * 0.45} fill="#F29A6A" opacity={0.55} />
      </g>
    ))}
  </g>
);

export const Street: React.FC<StreetProps> = ({ t, id = 'st', veil = 0.34, light, market = 0, bus = false, grass = 0, night = false, blackout = 0, red = 0, low = 0, moon = true }) => {
  const c: Ctx = makeCtx(t, night, blackout, red, grass);
  const items: Item[] = [];
  const pools: { x: number; y: number; rx: number; o: number }[] = [];
  const add = (z: number, el: React.ReactNode) => items.push({ z, el });
  const walkP = (X: number, Z: number) => proj(X, ST.kerb, Z);
  const roadP = (X: number, Z: number) => proj(X, 0, Z);
  const lamp = (Z: number, q: number) => (lightOn(blackout, q + 0.3 * (Z / 90)) ? (night ? 1 : 0.7) : 0);

  // ---- houses
  for (const side of [-1, 1] as const) {
    for (const lot of makeLots(side)) {
      const far = proj(side * ST.wall, 0, lot.z1).x;
      if (side < 0 ? far < -800 : far > 2720) continue;
      add(lot.z1, shopHouse(lot, c));
      const zc = (lot.z0 + lot.z1) / 2;
      if (zc > 46 || lot.alley || lot.shutter > 0.8) continue;
      if (lot.sign === 7 || lot.sign === 8 || lot.sign === 1) add(zc, <Stools key={`st${side}${lot.z0}`} X={side * 5.9} z={zc} seed={lot.seed} c={c} />);
      else if (lot.sign % 3 === 0) add(zc + 1, <PlantPot key={`pp${side}${lot.z0}`} X={side * 6.6} z={zc + 1} seed={lot.seed} c={c} />);
    }
  }
  // ---- poles, lamps, trees
  POLES.forEach((p) => add(p.z, <PowerPole key={`pole${p.z}`} side={p.side} z={p.z} tx={p.tx} c={c} />));
  TREES.forEach(([X, Z], i) => add(Z, <StreetTree key={`tree${i}`} X={X} z={Z} seed={i * 5 + 3} c={c} />));
  LAMPS.forEach(([side, Z], i) => {
    const on = lamp(Z, 0.15 + 0.4 * rnd(11, i));
    const b = walkP(side * 4.5, Z);
    const s = propScale(Z);
    add(Z, <StreetLamp key={`lamp${i}`} x={b.x} y={b.y} s={s} flip={side > 0} on={on} glow={false} />);
    if (on > 0.02) {
      const lx = b.x + (side > 0 ? -138 : 138) * s;
      c.lights.push({ x: lx, y: b.y - 626 * s, r: 210 * s * (night ? 1.3 : 1), o: 0.9 * on, veil: true });
      pools.push({ x: lx, y: roadP(0, Z).y, rx: 190 * s, o: on });
    }
  });
  // ---- the traffic light on the right, over the right-hand lane
  const tl = light ? { state: light, count: undefined as number | undefined } : trafficState(t);
  {
    const b = walkP(4.7, 13.5);
    const s = propScale(13.5);
    const on = lightOn(blackout, 0.45) ? 1 : 0;
    add(13.5, <TrafficLight key="tl" x={b.x} y={b.y} s={s} state={tl.state} flip count={on ? tl.count : undefined} glow={false} on={on} />);
    if (on) c.lights.push({ x: b.x - 300 * s, y: b.y - (tl.state === 'red' ? 490 : tl.state === 'yellow' ? 458 : 426) * s, r: 90 * s * 1.2, kind: tl.state === 'red' ? 'red' : 'warm', o: 0.9, veil: true });
  }
  // ---- motorbikes: rows on the sidewalks, abandoned ones in the road
  PARKED.forEach(([side, zs]) =>
    zs.forEach((Z, i) => {
      const q = rnd(side + 20, Z);
      const b = walkP(side * (5.45 + (q - 0.5) * 0.5), Z);
      const facing = (q > 0.82 ? -side : side) as 1 | -1;
      add(Z, <Motorbike key={`pk${side}${Z}`} x={b.x} y={b.y} s={propScale(Z)} facing={facing} color={BIKE_COLS[Math.floor(rnd(side + 30, i + Z) * BIKE_COLS.length)]} lamp={night && lamp(Z, 0.5) ? 0.8 : 0} helmet={q < 0.2} />);
    }),
  );
  ROAD_BIKES.forEach((m, i) => {
    const b = roadP(m.X, m.Z);
    add(m.Z, <Motorbike key={`rb${i}`} x={b.x} y={b.y} s={propScale(m.Z)} facing={m.facing} lean={m.lean} color={m.color} helmet={i % 3 === 1} />);
  });
  add(5, <Litter key="litter" c={c} />);
  // the near sidewalk: stools outside a cafe, a plant in a pot, so the foreground isn't bare
  add(4.2, <Stools key="nst" X={-5.9} z={4.2} seed={2} c={c} />);
  add(4.0, <PlantPot key="npp" X={6.3} z={4.0} seed={9} c={c} />);
  // ---- the bus at its stop on the right, and the market
  if (bus) {
    const b = roadP(3.4, 8.5);
    const lit = lightOn(blackout, 0.6) ? 1 : 0.25;
    add(8.5, <Bus key="bus" x={b.x} y={b.y} s={propScale(8.5)} facing={-1} number="09" open={1} lit={lit} t={t} />);
    add(6.6, <BusStopSign key="bs" X={4.55} z={6.6} c={c} />);
  } else {
    for (let i = 0; i < 12; i++) {
      const Z = 5.4 + i * 3.7;
      const pop = clamp((market - 0.8 * rnd(91, i)) * 6);
      if (pop <= 0.001) continue;
      const b = walkP(5.7, Z);
      const s = propScale(Z);
      const lit = lightOn(blackout, 0.4 + 0.4 * rnd(92, i)) ? (night ? 1 : 0.8) : 0;
      add(Z, <MarketStall key={`ms${i}`} x={b.x} y={b.y} s={s} variant={i % 4} seed={i + 1} pop={pop} lit={lit} glow={false} t={t} />);
      if (lit && pop > 0.9) c.lights.push({ x: b.x - 70 * s, y: b.y - 196 * s, r: 150 * s, o: 0.75 * lit, veil: true });
    }
    for (let i = 0; i < 12 && market > 0; i++) {
      const Z = 7.2 + i * 3.7;
      const pop = clamp((market - 0.8 * rnd(93, i)) * 6);
      if (pop <= 0.001) continue;
      const b = walkP(-5.7, Z);
      add(Z, <MarketStall key={`ml${i}`} x={b.x} y={b.y} s={propScale(Z)} variant={(i + 2) % 4} seed={i + 21} pop={pop} lit={lightOn(blackout, 0.5) ? 0.8 : 0} glow={false} t={t} />);
    }
  }
  // ---- haze slabs between the depth bands
  const fogs: [number, number][] = [[70, 0.4], [40, 0.22], [24, 0.12]];
  fogs.forEach(([z, o]) => add(z, <rect key={`fog${z}`} x={-600} y={210} width={3120} height={440} fill={`url(#${id}fog)`} opacity={o} />));
  items.sort((a, b) => b.z - a.z);

  // ---- sky and the sun at the end of the street
  const sun = { x: 960, y: 446 };
  const holes: [number, number, number][] = [[sun.x, sun.y, night ? 330 : 560]];
  c.lights.filter((l) => l.veil).slice(0, 40).forEach((l) => holes.push([l.x, l.y, Math.max(40, Math.min(420, l.r * 1.15))]));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}fog`} x1="0" y1="210" x2="0" y2="650" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.fogC} stopOpacity={0} />
          <stop offset="55%" stopColor={c.fogC} stopOpacity={1} />
          <stop offset="100%" stopColor={c.fogC} stopOpacity={0} />
        </linearGradient>
      </defs>
      {night ? (
        <g>
          <NightSky id={`${id}sky`} horizonY={ST.vy} />
          <Stars seed={5} x0={-100} y0={-100} w={2120} h={560} t={t} n={110} />
          {moon ? <Moon x={1040} y={230} r={34} /> : null}
        </g>
      ) : (
        <g>
          <DuskSky id={`${id}sky`} horizonY={ST.vy} red={red} />
          <Clouds t={t} />
          <Sun x={sun.x} y={sun.y} r={64} t={t} red={red} />
        </g>
      )}
      <g transform={`translate(0 ${low})`}>
        <Skyline y={ST.vy + 6} seed={17} color={night ? '#12163A' : red > 0.5 ? '#3A1426' : '#5A3A66'} h={150} />
        <Ground id={id} c={c} />
        <Weeds c={c} grass={grass} />
        {items.map((it, i) => <React.Fragment key={i}>{it.el}</React.Fragment>)}
        <Cables c={c} />
        <LightVeil id={`${id}veil`} lights={holes} o={night ? veil + 0.1 : veil} />
        {pools.map((p, i) => <ellipse key={`pool${i}`} cx={p.x} cy={p.y} rx={p.rx * (night ? 1.5 : 1)} ry={p.rx * (night ? 0.32 : 0.2)} fill="url(#g3warm)" opacity={(night ? 0.95 : 0.6) * p.o} style={{ mixBlendMode: 'screen' }} />)}
        {c.lights.filter((l) => l.r > 0).map((l, i) => <Glow key={`g${i}`} x={l.x} y={l.y} r={l.r} kind={l.kind ?? (night ? 'cool' : 'warm')} o={(l.o ?? 0.4) * (night && !l.kind ? 0.8 : 1)} />)}
        <Glow x={sun.x} y={sun.y + 10} r={night ? 160 : 380} kind={night ? 'cool' : 'warm'} o={night ? 0.25 : 0.55} />
        <Dust t={t} seed={61} x0={640} y0={250} w={640} h={420} n={26} o={night ? 0.25 : 0.5} />
        {red > 0 ? <rect x={-1500} y={-1500} width={5000} height={4500} fill="#16000A" opacity={0.42 * red} /> : null}
      </g>
    </g>
  );
};
