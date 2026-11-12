import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, hop } from '../../countryball/ball-motion';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { DmzBand, QuangTriLabels, QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { ArtilleryBattery, ShellBarrage } from '../../countryball/ground-artillery';
import { FrontArrow, SIDE_COLORS, UnitBox } from '../../countryball/ground-front-arrows';
import { TankColumn } from '../../countryball/ground-tanks';
import { TinyFigures } from '../../countryball/ground-helicopters';
import { QUANG_TRI_SITES } from '../../countryball/geo-quang-tri-sites';
import { Camera, project } from '../../countryball/geo-camera';
import { easeOut, prog } from '../../countryball/fx-math';
import { Pt } from '../../countryball/fx-math';
import { Out } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { FlagPole, PROV, Plate, QtMap, Slam } from './cha-common';
import { LL } from './cha-geo-bits';

// Chapter A, 30.03.1972 offensive: A25 the date, A26 "tiến công chiến lược Xuân Hè" arrows over the DMZ, A27 Trị Thiên,
// A28 artillery on the bases along the line, A29 tanks + infantry cross, A30 bases fall one by one (flags turn red).

const COLORS = { 'Quảng Bình': PROV.north, 'Quảng Trị': PROV.rvn, 'Thừa Thiên-Huế': PROV.rvn, 'Quảng Nam - Đà Nẵng': PROV.rvn };
const pts = (cam: Camera, ll: LL[]): Pt[] => ll.map(([lo, la]) => project(cam, lo, la));
const site = (cam: Camera, k: keyof typeof QUANG_TRI_SITES): Pt => project(cam, QUANG_TRI_SITES[k].lon, QUANG_TRI_SITES[k].lat);
const BASES = ['conTien', 'gioLinh', 'camLo'] as const;

export const A25: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a25" provinces={false} highlight={['VNM']} date={[{ t: 0, label: '1972' }, { t: 0.4, label: '30.03.1972' }]}
    keys={[{ t: 0, ...CAMERAS.binhTriThien }, { t: 2.8, lon: 107.1, lat: 17.0, zoom: 520 }]}
    over={(cam) => (
      <g>
        <FrontArrow id="a25a" t={t} t0={34} points={pts(cam, [[107.1, 17.5], [107.1, 17.2], [107.08, 16.95]])} width={30} color={SIDE_COLORS.vnm} dur={40} />
        <Slam t={t} a={14} x={960} y={880} size={150} fill="#FFFFFF" rot={-3}>30.03.1972</Slam>
      </g>
    )}>
    <DmzBand />
  </QtMap>
);

const NORTH_ARROWS: LL[][] = [
  [[107.17, 17.3], [107.12, 17.02], [107.1, 16.86]],
  [[106.95, 17.3], [106.94, 17.0], [106.98, 16.82]],
  [[106.62, 17.12], [106.82, 16.97], [106.99, 16.81]],
];

export const A26: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a26" provinceColors={COLORS} date="30.03.1972"
    keys={[{ t: 0, lon: 107.0, lat: 16.95, zoom: 1385 }, { t: 2.8, lon: 107.0, lat: 16.97, zoom: 1450 }]}
    over={(cam) => (
      <g>
        {NORTH_ARROWS.map((a, i) => <FrontArrow key={i} id={`a26a${i}`} t={t} t0={6 + i * 8} points={pts(cam, a)} width={34} color={SIDE_COLORS.vnm} dur={46} label={i === 1 ? 'QUÂN GIẢI PHÓNG' : undefined} labelSize={24} />)}
        {[0, 1].map((i) => <Ball key={i} id={`a26b${i}`} x={620 + i * 210} y={190 + i * 30} r={58} flag="VNM" eyes="determined" hat={<MuCoi camo />} motion={hop(t, 18, 10, i * 6)} t={t} />)}
        <Plate t={t} a={3} x={960} y={950} w={900} lines={[{ text: 'TIẾN CÔNG CHIẾN LƯỢC XUÂN HÈ', size: 50, fill: '#FFE600' }]} />
      </g>
    )}>
    <DmzBand label="KHU PHI QUÂN SỰ" /><QuangTriLabels provinces={false} />
  </QtMap>
);

export const A27: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a27" date="30.03.1972"
    provinceColors={{ ...COLORS, 'Quảng Trị': '#D9B25E', 'Thừa Thiên-Huế': '#D9B25E', 'Quảng Bình': PROV.neutral }}
    keys={[{ t: 0, lon: 107.1, lat: 16.72, zoom: 1000 }, { t: 2.1, lon: 107.1, lat: 16.76, zoom: 1100 }]}
    over={(cam) => (
      <g>
        <FrontArrow id="a27a" t={t} t0={4} points={pts(cam, [[107.12, 17.2], [107.1, 16.95], [107.15, 16.72], [107.4, 16.52]])} width={40} color={SIDE_COLORS.vnm} dur={50} />
        <Slam t={t} a={16} x={620} y={420} size={130} rot={-4}>TRỊ THIÊN</Slam>
      </g>
    )}>
    <DmzBand label="KHU PHI QUÂN SỰ" /><QuangTriLabels provinces={false} /><QuangTriSites only={['quangTri', 'dongHa', 'hue']} />
  </QtMap>
);

const ZOOM_N = [{ t: 0, lon: 107.04, lat: 16.95, zoom: 2800 }, { t: 3.4, lon: 107.04, lat: 16.92, zoom: 2900 }];
const FireMap: React.FC<{ t: number; id: string; over: (cam: Camera) => React.ReactNode }> = ({ t, id, over }) => (
  <QtMap t={t} id={id} provinceColors={COLORS} date="30.03.1972" keys={ZOOM_N} over={over}>
    <DmzBand label="KHU PHI QUÂN SỰ" widthKm={8} />
    <QuangTriSites only={['conTien', 'gioLinh', 'camLo', 'dongHa']} />
  </QtMap>
);

export const A28: React.FC<ShotProps> = ({ t }) => (
  <FireMap t={t} id="a28" over={(cam) => (
    <g>
      {BASES.map((b, i) => { const [x, y] = site(cam, b); return <UnitBox key={b} x={x + 50} y={y + 36} kind="inf" color={SIDE_COLORS.rvn} size={38} />; })}
      {[[106.93, 17.06], [107.05, 17.07], [107.16, 17.05]].map(([lo, la], i) => {
        const [x, y] = project(cam, lo, la), [bx, by] = site(cam, BASES[i]);
        return (
          <g key={i}>
            <ArtilleryBattery id={`a28b${i}`} t={t} t0={2 + i * 8} x={x} y={y} aim={90} n={3} gap={64} period={30} s={64} />
            <ShellBarrage id={`a28s${i}`} t={t} t0={8 + i * 8} from={[x, y + 20]} to={[bx, by]} n={6} span={46} spread={[40, 30]} dur={30} lift={170} r={22} seed={i + 1} />
          </g>
        );
      })}
      <Out x={900} y={890} size={56} opacity={prog(t, 8, 20)}>PHÁO BINH BẮN PHÁ DỌC GIỚI TUYẾN</Out>
    </g>
  )} />
);

export const A29: React.FC<ShotProps> = ({ t }) => (
  <FireMap t={t} id="a29" over={(cam) => {
    const road = pts(cam, [[107.0, 17.2], [107.02, 17.05], [107.0, 16.92], [106.99, 16.83]]);
    const road2 = pts(cam, [[107.12, 17.2], [107.1, 17.0], [107.09, 16.9], [107.1, 16.82]]);
    return (
      <g>
        {BASES.map((b) => { const [x, y] = site(cam, b); return <UnitBox key={b} x={x + 50} y={y + 36} kind="inf" color={SIDE_COLORS.rvn} size={38} />; })}
        <FrontArrow id="a29a" t={t} t0={2} points={road} width={34} color={SIDE_COLORS.vnm} dur={60} opacity={0.75} />
        <FrontArrow id="a29b" t={t} t0={8} points={road2} width={34} color={SIDE_COLORS.vnm} dur={60} opacity={0.75} />
        <TankColumn id="a29t" t={t} t0={0} t1={72} points={road} n={4} gap={80} size={64} kind="t54" fireEvery={36} />
        <TankColumn id="a29u" t={t} t0={6} t1={72} points={road2} n={3} gap={90} size={64} kind="t54" fireEvery={42} />
        <TinyFigures t={t} t0={22} from={road2[1]} to={road2[2]} n={8} spread={70} />
        <TinyFigures t={t} t0={30} from={road[1]} to={road[2]} n={8} spread={70} />
        <Out x={900} y={890} size={56} opacity={prog(t, 8, 20)}>XE TĂNG VÀ BỘ BINH TRÀN QUA</Out>
      </g>
    );
  }} />
);

export const A30: React.FC<ShotProps> = ({ t }) => (
  <FireMap t={t} id="a30" over={(cam) => (
    <g>
      {BASES.map((b, i) => {
        const [x, y] = site(cam, b), fall = 12 + i * 20, k = easeOut(prog(t, 2 + i * 3, 12 + i * 3));
        return (
          <g key={b}>
            <FlagPole x={x + 36} y={y + 40} flag={t < fall ? 'RVN' : 'VNM'} h={110} k={k} t={t} id={`a30f${i}`} />
            {t >= fall && t < fall + 10 && <circle cx={x + 36} cy={y - 30} r={26 + 3 * (t - fall)} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={1 - (t - fall) / 10} />}
          </g>
        );
      })}
      <FrontArrow id="a30a" t={t} t0={0} points={pts(cam, [[107.0, 17.2], [107.03, 16.99], [107.05, 16.86], [107.1, 16.7]])} width={34} color={SIDE_COLORS.vnm} dur={70} opacity={0.75} />
      <Plate t={t} a={4} x={960} y={930} w={940} lines={[{ text: 'CÁC CĂN CỨ LẦN LƯỢT THẤT THỦ', size: 48, fill: '#FFE600' }]} />
      <Ball id="a30v" x={1700} y={270} r={74} flag="VNM" eyes="determined" hat={<MuCoi camo />} motion={breathe(t, 60)} t={t} />
    </g>
  )} />
);
