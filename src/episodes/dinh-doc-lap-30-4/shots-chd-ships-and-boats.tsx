import React from 'react';
import { ShotProps } from '../../engine';
import { Camera, project } from '../../countryball/geo-camera';
import { CarrierDeck } from '../../countryball/carrier-deck';
import { City } from '../../countryball/map-labels';
import { Boat } from '../../countryball/ground-river-crossing';
import { Warship } from '../../countryball/ground-naval-gunfire';
import { lerp } from '../../countryball/fx-math';
import { Cap, MapScene, Photo, Stage, Tag, USA_BLUE, drift, easeOut, prog } from './chd-common';

// Chapter D, part 5 (5:02-5:13, beat "7c ships"): D24 the crowded decks (print), D25 a Huey is pushed over the side (CarrierDeck), D26 two prints
// of pushed helicopters, D27 small boats put out to sea (map), D28 print of boats reaching the fleet. Calm, no close-ups of people.

const SEA: Camera = { lon: 106.95, lat: 10.35, zoom: 940 }, SEA2: Camera = { ...SEA, zoom: 990 };

/** D24 "Ngoài biển, boong tàu chật kín." */
export const D24: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d24" tone="dusk" dim={0.15} />
    <Photo k="blueRidgeLand" t={t} id="d24p" x={960} y={440} w={1000} rot={-1.5} from={0.05} fromSide="bottom" kb={{ z0: 1.0, z1: 1.14, px0: 0.01, py0: 0.01, px1: -0.015, py1: -0.01 }} />
    <Tag t={t} at={6} x={960} y={992} text="NGOÀI BIỂN, BOONG TÀU CHẬT KÍN" fill="#2F5E9A" size={42} />
  </g>
);

/** D25 "Có những lúc, người ta phải đẩy cả trực thăng xuống biển" a Huey lands, the parked one is pushed over the side and splashes. */
export const D25: React.FC<ShotProps> = ({ t }) => (
  <g>
    <CarrierDeck id="d25" land={prog(t, 0, 44)} push={prog(t, 34, 82)} t={t} tone="dusk" />
    <Cap t={t} at={30} x={960} y={150} text="ĐẨY TRỰC THĂNG XUỐNG BIỂN" size={70} />
  </g>
);

/** D26 "để lấy chỗ cho những chiếc khác hạ cánh." two prints of helicopters pushed off the decks. */
export const D26: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d26" tone="navy" />
    <Photo k="blueRidgePush" t={t} id="d26a" x={640} y={470} w={780} rot={-2.5} from={0.05} fromSide="left" kb={{ z0: 1.0, z1: 1.1, px0: 0.01, py0: 0, px1: -0.015, py1: 0 }} />
    <Photo k="okinawaPush" t={t} id="d26b" x={1400} y={470} w={430} rot={2.5} from={0.4} fromSide="right" kb={{ z0: 1.0, z1: 1.08, px0: 0, py0: 0.01, px1: 0, py1: -0.01 }} />
    <Cap t={t} at={16} x={960} y={965} text="ĐỂ CÓ CHỖ CHO NHỮNG CHIẾC KHÁC HẠ CÁNH" size={46} color="#FFE08A" />
  </g>
);

/** D27 "Rất nhiều người khác đã tự tìm đường ra đi" small boats leave the coast for the open sea (faceless dots only). */
export const D27: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="d27" keys={drift(SEA, SEA2, 2.4)} osm={false} night={0.6} mini
    map={<City lon={107.0753} lat={10.3482} name="Vũng Tàu" anchor="r" minZoom={0} maxZoom={2000} size={24} />}
    over={(cam) => {
      const fleet = project(cam, 107.2, 9.97);
      const starts: [number, number][] = [[106.93, 10.4], [106.97, 10.39], [107.01, 10.37], [107.05, 10.33], [106.9, 10.41], [107.08, 10.31], [106.95, 10.37], [107.03, 10.35]];
      return (
        <g>
          <Warship x={fleet[0]} y={fleet[1] + 20} heading={200} size={140} kind="cruiser" t={t} aim={0} wake={false} />
          <circle cx={fleet[0]} cy={fleet[1]} r={150} fill="none" stroke={USA_BLUE} strokeWidth={5} strokeDasharray="14 12" opacity={0.8} />
          {starts.map(([lo, la], i) => {
            const a = project(cam, lo, la), b: [number, number] = [fleet[0] + (i - 3.5) * 70, fleet[1] - 90 + (i % 3) * 36], k = easeOut(prog(t, i * 3, 96 + i * 4));
            const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k) + Math.sin(t / 7 + i) * 3, h = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
            return <Boat key={i} x={x} y={y} heading={h} size={96} t={t} crew={3} ph={i * 3} />;
          })}
          <Tag t={t} at={6} x={960} y={170} text="TỰ TÌM ĐƯỜNG RA ĐI" fill="#2F3E58" size={46} />
        </g>
      );
    }} />
);

/** D28 "bằng thuyền nhỏ." a print of boats reaching the American ships. */
export const D28: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d28" tone="night" />
    <Photo k="boats" t={t} id="d28p" x={960} y={430} w={1000} rot={-1} from={0.03} fromSide="bottom" kb={{ z0: 1.0, z1: 1.12, px0: 0.01, py0: 0, px1: -0.015, py1: 0 }} />
    <Tag t={t} at={6} x={960} y={992} text="BẰNG THUYỀN NHỎ" fill="#2F3E58" size={46} />
  </g>
);
