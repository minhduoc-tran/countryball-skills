import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe } from '../../countryball/ball-motion';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { DmzBand, QuangTriLabels, QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { LowerThird } from '../../countryball/hud-chips';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { QUANG_TRI_SITES } from '../../countryball/geo-quang-tri-sites';
import { project } from '../../countryball/geo-camera';
import { easeOut, hash, prog } from '../../countryball/fx-math';
import { Out, Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { FlagPole, PROV, QtMap, SIDE, Slam, sec } from './cha-common';
import { GeoPill, GeoRoad, LL, Mountains } from './cha-geo-bits';

// Chapter A, geography of Quảng Trị 1972: A19 northernmost province of the South, A20 Bến Hải / 17th parallel, A21 the division since 1954,
// A22 QL1 + đường 9, A23 coast to mountains, A24 the narrow land of fighting.

const COLORS = { 'Quảng Bình': PROV.north, 'Quảng Trị': PROV.rvn, 'Thừa Thiên-Huế': PROV.rvn, 'Quảng Nam - Đà Nẵng': PROV.rvn };
const P = CAMERAS.quangTriProvince;
const MapLayers: React.FC<{ sites?: string[]; dmz?: boolean; provinces?: boolean }> = ({ sites = ['quangTri', 'dongHa', 'hue', 'camLo', 'kheSanh', 'laoBao'], dmz = true, provinces = true }) => (
  <>{dmz && <DmzBand label="KHU PHI QUÂN SỰ" />}<QuangTriLabels provinces={provinces} /><QuangTriSites only={sites} /></>
);

export const A19: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a19" date="1972" provinceColors={COLORS} highlight={['Quảng Trị']}
    keys={[{ t: 0, ...CAMERAS.binhTriThien }, { t: 2.7, ...P }]}
    over={(cam) => {
      const [x, y] = project(cam, 106.78, 16.78), u = prog(t, 24, 40);
      return (
        <g>
          <FlagPole x={x} y={y} flag="RVN" h={150} k={easeOut(prog(t, 30, 50))} t={t} id="a19f" />
          {u > 0 && <g opacity={u}><Out x={x} y={y - 210} size={60}>CỰC BẮC MIỀN NAM</Out></g>}
          <LowerThird title="Tỉnh Quảng Trị" sub="Tỉnh cực bắc của miền Nam, năm 1972" from={0.2} t={sec(t)} />
        </g>
      );
    }}><MapLayers dmz={false} /></QtMap>
);

export const A20: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a20" date="1972" provinceColors={COLORS} parallel={17}
    keys={[{ t: 0, ...P }, { t: 3, lon: 107.0, lat: 16.98, zoom: 1900 }]}
  ><MapLayers sites={['hienLuong', 'vinhLinh', 'gioLinh', 'dongHa', 'camLo']} />
    <GeoPill at={[106.9, 17.0]} text="SÔNG BẾN HẢI" t={t} a={12} dy={64} color="#8EC9F0" size={34} />
    <GeoPill at={[106.55, 17.0]} text="VĨ TUYẾN 17" t={t} a={34} dy={-50} size={36} />
  </QtMap>
);

export const A21: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a21" provinceColors={COLORS} parallel={17} date={[{ t: 0, label: '1972' }, { t: 0.5, label: '1954' }]}
    keys={[{ t: 0, lon: 107.05, lat: 17.0, zoom: 1450 }, { t: 4.2, lon: 107.05, lat: 17.0, zoom: 1280 }]}
    over={(cam) => {
      const [nx, ny] = project(cam, 106.7, 17.22), [sx, sy] = project(cam, 106.8, 16.72);
      return (
        <g>
          <Ball id="a21v" x={nx} y={ny} r={92} flag="VNM" eyes="determined" hat={<MuCoi camo />} motion={breathe(t, 62)} t={t} />
          <Tag x={nx} y={ny - 130} text="MIỀN BẮC" color={SIDE.vnm} size={34} opacity={prog(t, 20, 32)} />
          <Ball id="a21r" x={sx} y={sy} r={92} flag="RVN" eyes="determined" hat={<M1Helmet />} motion={breathe(t, 66, 0.03, 12)} t={t} />
          <Tag x={sx} y={sy - 130} text="MIỀN NAM" color={SIDE.rvn} size={34} opacity={prog(t, 34, 46)} />
          <Slam t={t} a={60} x={1380} y={300} size={110} fill="#FFFFFF" rot={-5}>TẠM THỜI</Slam>
        </g>
      );
    }}><MapLayers sites={['hienLuong', 'vinhLinh', 'dongHa']} /></QtMap>
);

const QL1: LL[] = [[107.0502, 17.0057], [107.075, 16.96], [107.0853, 16.9235], [107.09, 16.865], [107.098, 16.813], [107.14, 16.775], [107.1859, 16.7539], [107.1813, 16.7423], [107.2055, 16.7229], [107.194, 16.65], [107.2, 16.56]];
const D9: LL[] = [[107.098, 16.813], [106.9935, 16.8075], [106.88, 16.74], [106.7377, 16.6273], [106.5981, 16.6136]];

export const A22: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a22" date="1972" provinceColors={COLORS}
    keys={[{ t: 0, ...P }, { t: 2.1, lon: 107.0, lat: 16.8, zoom: 1500 }]}>
    <MapLayers />
    <GeoRoad pts={QL1} k={easeOut(prog(t, 2, 40))} />
    <GeoRoad pts={D9} k={easeOut(prog(t, 22, 56))} color="#FFD25A" />
    <GeoPill at={[107.2, 16.7]} text="QUỐC LỘ 1" t={t} a={30} dx={90} dy={30} />
    <GeoPill at={[106.85, 16.72]} text="ĐƯỜNG 9" t={t} a={48} dy={-52} />
  </QtMap>
);

export const A23: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a23" date="1972" provinceColors={COLORS}
    keys={[{ t: 0, lon: 107.0, lat: 16.8, zoom: 1500 }, { t: 2.8, lon: 106.95, lat: 16.78, zoom: 1480 }]}>
    <MapLayers />
    <GeoRoad pts={QL1} k={1} crawl={t * 0.8} />
    <GeoRoad pts={D9} k={1} color="#FFD25A" crawl={t * 0.8} />
    <GeoPill at={[107.3, 16.8]} text="ĐỒNG BẰNG VEN BIỂN" t={t} a={4} color="#8EC9F0" dy={-20} />
    <GeoPill at={[106.58, 16.8]} text="NÚI RỪNG PHÍA TÂY" t={t} a={30} color="#9CC27A" dy={-70} />
    <Mountains at={[106.6, 16.9]} k={easeOut(prog(t, 28, 44))} s={70} n={5} />
  </QtMap>
);

const HITS: { at: LL; t0: number }[] = [
  { at: [107.0853, 16.9235], t0: 4 }, { at: [107.098, 16.813], t0: 14 }, { at: [107.186, 16.754], t0: 24 }, { at: [106.9935, 16.8075], t0: 33 },
  { at: [107.2055, 16.7229], t0: 42 }, { at: [106.8, 16.72], t0: 50 }, { at: [107.14, 16.775], t0: 58 }, { at: [107.0062, 16.8994], t0: 66 }, { at: [107.194, 16.65], t0: 76 }, { at: [106.74, 16.63], t0: 86 },
];

export const A24: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a24" date="1972" provinceColors={COLORS} highlight={['Quảng Trị']}
    keys={[{ t: 0, lon: 106.95, lat: 16.78, zoom: 1480 }, { t: 3.5, lon: 107.05, lat: 16.8, zoom: 1560 }]}
    over={(cam) => (
      <g>
        {HITS.map((h, i) => { const [x, y] = project(cam, h.at[0], h.at[1]); return <GroundBlast key={i} t={t} t0={h.t0} x={x} y={y} r={26 + 10 * hash(i, 3)} linger={120} />; })}
        {[QUANG_TRI_SITES.dongHa, QUANG_TRI_SITES.quangTri].map((s, i) => { const [x, y] = project(cam, s.lon, s.lat); return <SmokeColumn key={i} t={t} t0={14 + i * 14} x={x} y={y} h={170} w={26} fire lean={0.4} />; })}
        <Out x={960} y={985} size={74} opacity={prog(t, 30, 44)}>NƠI GIAO TRANH ÁC LIỆT</Out>
      </g>
    )}>
    <MapLayers provinces={false} />
    <GeoRoad pts={QL1} k={1} crawl={t * 0.6} />
    <GeoRoad pts={D9} k={1} color="#FFD25A" crawl={t * 0.6} />
  </QtMap>
);
