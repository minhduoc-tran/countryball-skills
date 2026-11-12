import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe } from '../../countryball/ball-motion';
import { CitadelPlan, CitadelPlanInMap } from '../../countryball/citadel-plan';
import { citadelScreen, localToScreen } from '../../countryball/citadel-geometry';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { LowerThird } from '../../countryball/hud-chips';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { Candle, HoaDangField, IncenseBundle } from '../../countryball/ground-memorial-props';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { BCell } from '../../countryball/fx-flight-path';
import { Flare } from '../../countryball/fx-tracers-and-lights';
import { Glow } from '../../countryball/fx-glow';
import { easeOut, flicker, prog } from '../../countryball/fx-math';
import { Out } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Osm, Plate, QtMap, Vignette, sec } from './cha-common';
import { CitadelOutline, DimLine, EdgeGlows, citadelCam } from './cha-citadel-bits';

// Chapter A cold open (0:00-22.1): A1 night fly-in, A2 the small citadel by the Thạch Hãn, A3 "500 m a side", A4 "81 ngày đêm",
// A5 shells + B-52 carpet, A6 "328.000 tấn (theo phía Việt Nam)", A7 smoke clears to ruins, A8 the soldiers, A9 candle today -> black.

export const A1: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a1" night={0.78} provinces={false} date="1972"
    keys={[{ t: 0, ...CAMERAS.binhTriThien }, { t: 2.4, lon: 107.1835, lat: 16.7545, zoom: 42000, ease: 'out' }]}
    over={(cam) => {
      const [x, y] = citadelScreen(cam, 0, 0), k = prog(t, 30, 50);
      return (
        <g>
          <Glow x={x} y={y} r={90 + 80 * k} color="#FF7A22" o={0.5 * k * flicker(t, 2) * 0.7} />
          <Out x={960} y={960} size={90} opacity={prog(t, 4, 16)}>MÙA HÈ 1972</Out>
        </g>
      );
    }}>
    <QuangTriSites only={['quangTri', 'dongHa', 'citadel']} lights={1} />
    <CitadelPlanInMap fadeFrom={7000} fadeTo={22000} />
  </QtMap>
);

export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const cam = citadelCam(t, len, [-130, 10, 0.4], [-130, 10, 0.6]);
  return (
    <g>
      <CitadelPlan id="a2" camera={cam} t={t} night={0.8} damage={0.04} labels={['citadel', 'river']} />
      <EdgeGlows t={t} pts={[[140, 160], [1800, 940]]} r={180} />
      <Flare t={t} t0={6} x={1330} y={210} r={170} life={170} />
      <Vignette o={0.5} />
      <LowerThird title="Thành cổ Quảng Trị" sub="Bên bờ sông Thạch Hãn" from={0.3} to={2.4} t={sec(t)} />
      <Osm t={t} />
    </g>
  );
};

export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const cam = citadelCam(t, len, [0, 0, 1.25], [0, 0, 1.32]);
  return (
    <g>
      <CitadelPlan id="a3" camera={cam} t={t} night={0.55} damage={0.02} labels={false} />
      <CitadelOutline cam={cam} t={t} a={2} />
      <DimLine cam={cam} t={t} a={6} p={[-240, -300]} q={[240, -300]} text="≈ 500 m" />
      <DimLine cam={cam} t={t} a={24} p={[300, -240]} q={[300, 240]} text="≈ 500 m" side={1} />
      <Vignette o={0.35} />
      <Osm t={t} />
    </g>
  );
};

export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const cam = citadelCam(t, len, [0, 0, 0.95], [0, 0, 1.05]);
  const n = 1 + Math.round(80 * easeOut(prog(t, 2, 34)));
  return (
    <g>
      <CitadelPlan id="a4" camera={cam} t={t} night={0.86} damage={0.12 + 0.12 * prog(t, 0, len)} fires={0.4} />
      <ShellBarrage id="a4s" t={t} t0={4} from={[-200, -150]} to={citadelScreen(cam, -60, 20)} n={9} span={36} spread={[120, 90]} dur={34} lift={190} r={26} />
      <defs><linearGradient id="a4-sh" x1="0" x2="1"><stop offset="0" stopColor="#05080F" stopOpacity={0} /><stop offset="0.45" stopColor="#05080F" stopOpacity={0.7} /><stop offset="1" stopColor="#05080F" stopOpacity={0.8} /></linearGradient></defs>
      <rect x={700} width={1220} height={1080} fill="url(#a4-sh)" />
      <Out x={1500} y={600} size={430} fill="#FFE600" stroke="#120C1E" rot={-3}>{n}</Out>
      <Out x={1500} y={760} size={128} fill="#FFFFFF" rot={-3} opacity={prog(t, 30, 38)}>NGÀY ĐÊM</Out>
      <Osm t={t} />
    </g>
  );
};

// B-52 line over the citadel: plane flies P(t) along PA->PB, carpet blasts follow it.
const PA: [number, number] = [-220, 90], PB: [number, number] = [2140, 880];
const at = (u: number): [number, number] => [PA[0] + (PB[0] - PA[0]) * u, PA[1] + (PB[1] - PA[1]) * u];

export const A5: React.FC<ShotProps> = ({ t, len }) => {
  const cam = citadelCam(t, len, [0, 0, 0.8], [0, 0, 0.88]);
  const c = citadelScreen(cam, 0, 0);
  return (
    <g>
      <CitadelPlan id="a5" camera={cam} t={t} night={0.9} damage={0.2 + 0.35 * prog(t, 10, len)} fires={0.6} />
      <ShellBarrage id="a5a" t={t} t0={0} from={[-300, 120]} to={[c[0] - 80, c[1] - 30]} n={10} span={60} spread={[190, 120]} dur={40} lift={200} r={30} />
      <ShellBarrage id="a5b" t={t} t0={24} from={[2250, 80]} to={[c[0] + 140, c[1] + 40]} n={9} span={50} spread={[170, 110]} dur={42} lift={210} r={28} seed={5} />
      <BombCarpet id="a5c" t={t} t0={20} from={at(0.25)} to={at(0.78)} dur={46} n={22} width={90} r={30} />
      <BCell id="a5p" t={t} t0={0} t1={72} points={[at(-0.05), at(1.05)]} size={70} trailLen={300} />
      <Vignette o={0.5} />
      <Osm t={t} />
    </g>
  );
};

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const cam = citadelCam(t, len, [0, 0, 0.85], [0, 0, 0.78]);
  const c = citadelScreen(cam, 0, 0);
  const n = Math.round(328000 * easeOut(prog(t, 40, 100)));
  return (
    <g>
      <CitadelPlan id="a6" camera={cam} t={t} night={0.86} damage={0.55 + 0.2 * prog(t, 0, len)} fires={0.85} />
      <ShellBarrage id="a6a" t={t} t0={0} from={[-250, 300]} to={[c[0] - 120, c[1]]} n={12} span={70} spread={[200, 130]} dur={42} lift={210} r={30} seed={3} />
      <ShellBarrage id="a6b" t={t} t0={50} from={[2200, 200]} to={[c[0] + 120, c[1] + 60]} n={10} span={50} spread={[200, 120]} dur={42} lift={200} r={30} seed={9} />
      <SmokeColumn t={t} x={c[0] - 150} y={c[1] + 40} h={330} w={46} fire lean={0.4} />
      <SmokeColumn t={t} x={c[0] + 170} y={c[1] + 90} h={300} w={40} fire lean={0.5} t0={20} />
      <Vignette o={0.55} />
      <Plate t={t} a={2} x={960} y={846} w={960} lines={[{ text: 'THEO PHÍA VIỆT NAM', size: 38, fill: '#E2B95A' }, { text: `${fmt(n)} tấn bom đạn`, size: 96, fill: '#FFE600' }]} />
      <Osm t={t} />
    </g>
  );
};

export const A7: React.FC<ShotProps> = ({ t, len }) => {
  const cam = citadelCam(t, len, [0, 0, 1.15], [0, 0, 1.28]);
  const c = citadelScreen(cam, 0, 0), clear = prog(t, 6, 80), fade = 1 - prog(t, 30, 92);
  return (
    <g>
      <CitadelPlan id="a7" camera={cam} t={t} night={0.8 - 0.65 * clear} damage={0.85 + 0.15 * prog(t, 0, 60)} fires={0.9 * (1 - prog(t, 8, 66))} />
      <g opacity={fade}>
        <SmokeColumn t={t} x={c[0] - 140} y={c[1] + 60} h={380} w={50} lean={0.4} />
        <SmokeColumn t={t} x={c[0] + 160} y={c[1] + 110} h={340} w={44} lean={0.55} t0={14} />
        <SmokeColumn t={t} x={c[0] + 20} y={c[1] - 120} h={300} w={40} lean={0.3} t0={30} />
      </g>
      <rect width={1920} height={1080} fill="#FFD9A0" opacity={0.14 * clear} />
      <Vignette o={0.4} />
      <Osm t={t} />
    </g>
  );
};

export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const cam = citadelCam(t, len, [90, 40, 1.35], [60, 30, 1.45]);
  return (
    <g>
      <CitadelPlan id="a8" camera={cam} t={t} night={0.22} damage={1} fires={0} />
      <rect width={1920} height={1080} fill="#FFD9A0" opacity={0.12} />
      <Vignette o={0.45} />
      <Ball id="a8v" x={690} y={730} r={118} flag="VNM" eyes="sad" tilt={5} hat={<MuCoi camo />} motion={breathe(t, 80, 0.025)} t={t} />
      <Ball id="a8r" x={1230} y={745} r={118} flag="RVN" eyes="sad" tilt={-5} hat={<M1Helmet />} motion={breathe(t, 84, 0.025, 20)} t={t} />
      <Candle x={960} y={830} s={110} t={t} />
      <LowerThird title="Những người lính đã ở trong đó" from={0.3} to={2.3} t={sec(t)} />
      <Osm t={t} />
    </g>
  );
};

export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const cam = citadelCam(t, len, [-250, 80, 0.85], [-230, 60, 0.7]);
  const r = localToScreen(cam, -560, 40);
  return (
    <g>
      <CitadelPlan id="a9" camera={cam} t={t} night={0.62} memorial labels={['river']} />
      <rect width={1920} height={1080} fill="#050B1F" opacity={0.2} />
      <HoaDangField id="a9h" t={t} t0={0} points={[[r[0] - 60, r[1] - 400], [r[0] + 30, r[1] - 100], [r[0] - 20, r[1] + 260], [r[0] + 40, r[1] + 520]]} n={8} size={56} speed={4} every={10} />
      <Candle x={1460} y={820} s={130} t={t} /><Candle x={1560} y={840} s={100} t={t} seed={3} />
      <IncenseBundle x={1680} y={846} s={150} t={t} n={3} />
      <Vignette o={0.5} />
      <rect width={1920} height={1080} fill="#000" opacity={prog(t, len - 18, len - 2)} />
      <Osm t={t} />
    </g>
  );
};
