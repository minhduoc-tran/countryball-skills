import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Headset } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { RadarScope } from '../../countryball/radar-scope';
import { LowerThird } from '../../countryball/hud-chips';
import { AirRaidPulse } from '../../countryball/map-night-overlay';
import { CITIES, City } from '../../countryball/map-labels';
import { Glow } from '../../countryball/fx-glow';
import { backOut, lerp, prog } from '../../countryball/fx-math';
import { At, Drift, GeoFlight, JamCloud, MapShot, NightBg, Out, Tag, sec } from './cha-map-scene';

// Chapter A cold open (0:00-0:17): Hà Nội at night, the radar scope, the jamming spreading, the B-52 reveal.
// A1 map zoom to Hà Nội, A2 radar clean, A3 jam spreads, A4 jam cloud on the map, A5 B-52 reveal, A6 "B-52" found, A7 cells fly in.

const BLIPS = [{ bearing: 150, range: 0.42 }, { bearing: 262, range: 0.7, vR: -0.0004 }, { bearing: 330, range: 0.55 }];

export const A1: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a1" night={0.85} date="18.12.1972" nightLabel="ĐÊM 1/12" nightSince={1.4}
    keys={[{ t: 0, lon: 106.2, lat: 19.4, zoom: 62 }, { t: 4.2, lon: 105.85, lat: 21.0, zoom: 235 }]}>
    <City {...CITIES.hanoi} lights={1} />
    <City {...CITIES.haiphong} lights={0.9} />
    <City {...CITIES.vinh} lights={0.8} />
    <LowerThird title="Hà Nội" sub="Tối 18 tháng 12 năm 1972" from={0.2} to={4} t={sec(t)} />
  </MapShot>
);

export const A2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <NightBg t={t} id="a2" />
    <Drift t={t} len={len} z0={1} z1={1.07} cx={640} cy={560}>
      <RadarScope id="a2" t={t} cx={640} cy={560} r={400} blips={BLIPS} />
      <Tag x={640} y={80} text="MÀN HÌNH RADAR" />
      <Ball id="a2b" x={1400} y={660} r={130} flag="VNM" eyes="determined" look={-0.6} hat={<Headset />} motion={breathe(t, 64)} />
      <Tag x={1400} y={400} text="BỘ ĐỘI TÊN LỬA" />
    </Drift>
  </g>
);

export const A3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <NightBg t={t} id="a3" />
    <Drift t={t} len={len} z0={1.0} z1={1.08} cx={760} cy={560}>
      <RadarScope id="a3" t={t} cx={760} cy={560} r={440} blips={BLIPS}
        jam={{ center: 215, width: 30 + Math.min(150, t * 1.5), strength: Math.min(1, t / 25) }} noiseDots={1700} />
      <Ball id="a3b" x={1560} y={720} r={120} flag="VNM" eyes="worried" sweat look={-0.5} hat={<Headset />} motion={breathe(t, 52, 0.04)} />
      <Tag x={1520} y={300} text="NHIỄU RADAR" color="#FF6F6F" size={40} opacity={prog(t, 12, 22)} />
    </Drift>
  </g>
);

export const A4: React.FC<ShotProps> = ({ t }) => {
  const u = prog(t, 0, 72);
  const plane = (a: number, b: number, off: number): [number, number, number] => [lerp(100.4, 105.3, a + u * 0.18) + off * 0.1, lerp(16.4, 20.9, b + u * 0.18) - off * 0.4, -38];
  return (
    <MapShot t={t} id="a4" night={0.9} date="18.12.1972" nightLabel="ĐÊM 1/12"
      keys={[{ t: 0, lon: 103.4, lat: 19.0, zoom: 62 }, { t: 2.4, lon: 104.4, lat: 19.9, zoom: 82 }]}
      over={(cam) => {
        const p = (lo: number, la: number): [number, number] => [960 + (lo - cam.lon) * cam.zoom * Math.cos((cam.lat0 ?? cam.lat) * Math.PI / 180), 540 - (la - cam.lat) * cam.zoom];
        return <JamCloud t={t} from={p(100.6, 16.6)} to={p(105.5, 20.9)} width={420} k={0.35 + 0.65 * prog(t, 0, 66)} n={380} />;
      }}>
      <City {...CITIES.hanoi} lights={1} />
      {[plane(0.45, 0.45, 0), plane(0.52, 0.4, 3), plane(0.38, 0.5, -3), plane(0.6, 0.62, 1)].map(([lo, la, h], i) => (
        <At key={i} lon={lo} lat={la}><AircraftTop id={`a4p${i}`} kind="b52" x={0} y={0} size={86} heading={h} opacity={0.55} shadow={false} /></At>
      ))}
    </MapShot>
  );
};

export const A5: React.FC<ShotProps> = ({ t }) => {
  const k = prog(t, 0, 52), x = lerp(-240, 930, 1 - Math.pow(1 - k, 3)) + t * 0.5;
  return (
    <g>
      <NightBg t={t} id="a5" top="#0B1830" bottom="#04070D" />
      <Glow x={960} y={540} r={760} color="#2B4C7E" o={0.45} />
      <JamCloud t={t} from={[0, 540]} to={[1920, 540]} width={900} k={1} n={240} opacity={1 - prog(t, 6, 40)} />
      <AircraftTop id="a5" kind="b52" x={x} y={540} size={880} heading={0} />
      <Tag x={960} y={990} text="B-52 STRATOFORTRESS" opacity={prog(t, 22, 32)} />
    </g>
  );
};

export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut((t - 5) / 8);
  return (
    <g>
      <NightBg t={t} id="a6" />
      <Drift t={t} len={len} z0={1.02} z1={1.08} cx={560} cy={540}>
        <RadarScope id="a6" t={t} cx={560} cy={540} r={430} foundAt={4} blips={[...BLIPS, { bearing: 40, range: 0.58, target: true, vB: 0.03 }]}
          jam={{ center: 40, width: 170, strength: 1 }} noiseDots={1400} />
      </Drift>
      <Out x={1480} y={620} size={290} fill="#FFD43B" scale={Math.max(0.01, k)} rot={-4}>B-52</Out>
    </g>
  );
};

export const A7: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a7" night={0.9} date="18.12.1972" nightLabel="ĐÊM 1/12"
    keys={[{ t: 0, lon: 103.6, lat: 18.6, zoom: 80 }, { t: 2, lon: 104.5, lat: 19.6, zoom: 95 }]}
    over={() => <AirRaidPulse t={sec(t)} level={0.15 + 0.25 * prog(t, 10, 50)} />}>
    <City {...CITIES.hanoi} lights={1} />
    <GeoFlight id="a7a" t={t} t0={0} t1={64} cell showRoute size={54} route={[[100.3, 14.8], [102.5, 17.6], [105.5, 20.8]]} />
    <GeoFlight id="a7b" t={t} t0={4} t1={66} cell showRoute size={54} route={[[99.6, 17.8], [102.4, 19.9], [105.75, 21.25]]} />
    <GeoFlight id="a7c" t={t} t0={8} t1={68} cell showRoute size={54} route={[[108.8, 17.0], [107.4, 19.2], [106.3, 20.7]]} />
  </MapShot>
);
