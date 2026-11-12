import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe } from '../../countryball/ball-motion';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { CitadelPlanInMap } from '../../countryball/citadel-plan';
import { citadelScreen } from '../../countryball/citadel-geometry';
import { DmzBand, QuangTriLabels, QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { LowerThird } from '../../countryball/hud-chips';
import { FrontArrow, SIDE_COLORS, UnitBox } from '../../countryball/ground-front-arrows';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { Out } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { PhotoCard } from '../../countryball/photo-card';
import { QUANG_TRI_SITES } from '../../countryball/geo-quang-tri-sites';
import { Camera, project } from '../../countryball/geo-camera';
import { Pt, easeOut, hash, lerp, prog } from '../../countryball/fx-math';
import { FlagPole, PROV, Plate, QtMap, sec } from './cha-common';
import { GeoPill, GeoRoad, LL } from './cha-geo-bits';

// Chapter A, the fall: A31 Đông Hà / Cam Lộ / Ái Tử, A32 Sư đoàn 3 collapses (+ Đông Hà defence map), A33 retreat south, A34 1.5.1972 the town
// is liberated, A35 first province fully liberated (theo phía VN), A36 fighting spreads, A37 refugees photo, A38 the road south to Huế.

const SITE = (cam: Camera, k: string): Pt => project(cam, QUANG_TRI_SITES[k].lon, QUANG_TRI_SITES[k].lat);
const pts = (cam: Camera, ll: LL[]): Pt[] => ll.map(([lo, la]) => project(cam, lo, la));
const NEUTRAL = { 'Quảng Bình': PROV.north, 'Quảng Trị': PROV.rvn, 'Thừa Thiên-Huế': PROV.rvn, 'Quảng Nam - Đà Nẵng': PROV.rvn };
const FRONT = [{ t: 0, ...CAMERAS.triThienFront }, { t: 2.4, lon: 107.1, lat: 16.81, zoom: 3200 }];
const Layers: React.FC<{ sites: string[]; prov?: boolean }> = ({ sites, prov = false }) => (<><DmzBand label="KHU PHI QUÂN SỰ" /><QuangTriLabels provinces={prov} /><QuangTriSites only={sites} /></>);

export const A31: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a31" provinceColors={NEUTRAL} date="4.1972" keys={FRONT}
    over={(cam) => (
      <g>
        <FrontArrow id="a31a" t={t} t0={0} points={pts(cam, [[107.1, 17.05], [107.098, 16.84], [107.03, 16.81]])} width={30} color={SIDE_COLORS.vnm} dur={50} opacity={0.7} />
        <FrontArrow id="a31b" t={t} t0={40} points={pts(cam, [[107.03, 16.81], [107.09, 16.79], [107.14, 16.775]])} width={30} color={SIDE_COLORS.vnm} dur={26} opacity={0.7} />
        {[['dongHa', 2], ['camLo', 24], ['aiTu', 44]].map(([k, a], i) => {
          const [x, y] = SITE(cam, k as string), u = easeOut(prog(t, a as number, (a as number) + 12));
          return <g key={i}><FlagPole x={x + 30} y={y + 20} flag={u > 0.9 ? 'VNM' : 'RVN'} h={150} k={u} t={t} id={`a31f${i}`} /></g>;
        })}
      </g>
    )}>
    <Layers sites={['dongHa', 'camLo', 'aiTu', 'quangTri']} />
    <GeoPill at={[107.098, 16.813]} text="ĐÔNG HÀ" t={t} a={2} dy={-190} color="#E0483C" size={34} />
    <GeoPill at={[106.9935, 16.8075]} text="CAM LỘ" t={t} a={24} dy={-190} color="#E0483C" size={34} />
    <GeoPill at={[107.1402, 16.7749]} text="ÁI TỬ" t={t} a={44} dy={-190} color="#E0483C" size={34} />
  </QtMap>
);

/** A unit box that cracks into three shards flying apart from frame `a`. */
const Shatter: React.FC<{ t: number; a: number; x: number; y: number }> = ({ t, a, x, y }) => {
  const u = prog(t, a, a + 26);
  if (u <= 0) return <UnitBox x={x} y={y} kind="inf" color={SIDE_COLORS.rvn} size={150} />;
  return (
    <g opacity={1 - u * 0.7}>
      {[[-1, -0.6, -18], [0.2, -1, 9], [1, 0.5, 22]].map(([dx, dy, r], i) => (
        <g key={i} transform={`translate(${x + dx * u * 90},${y + dy * u * 60 + u * u * 60}) rotate(${r * u})`}>
          <clipPath id={`a32c${i}`}><rect x={-112 + i * 76} y={-80} width={80} height={160} /></clipPath>
          <g clipPath={`url(#a32c${i})`}><UnitBox x={0} y={0} kind="inf" color={i === 1 ? '#A8924A' : SIDE_COLORS.rvn} size={150} /></g>
        </g>
      ))}
    </g>
  );
};

export const A32: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a32" provinceColors={NEUTRAL} date="4.1972" dim={0.35} keys={FRONT}
    over={(cam) => {
      return (
        <g>
          <Shatter t={t} a={34} x={430} y={520} />
          <Out x={430} y={630} size={64}>SĐ 3</Out>
          <PhotoCard id="a32p" src="quang-tri-81-ngay-dem/img/004.jpg" caption="Sơ đồ phòng thủ Đông Hà, 4.1972" credit="Ảnh: U.S. Marine Corps History Division / Public domain"
            x={1330} y={450} w={760} h={545} rot={2} from={0.15} t={sec(t)} kb={{ z0: 1.03, z1: 1.12 }} />
          <LowerThird title="Sư đoàn 3 quân đội Sài Gòn tan rã" from={0.9} t={sec(t)} />
        </g>
      );
    }}>
    <Layers sites={['dongHa', 'quangTri', 'aiTu']} />
  </QtMap>
);

export const A33: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a33" provinceColors={NEUTRAL} date="4.1972"
    keys={[{ t: 0, lon: 107.15, lat: 16.75, zoom: 2900 }, { t: 1.6, lon: 107.2, lat: 16.66, zoom: 2300 }]}
    over={(cam) => {
      const path = pts(cam, [[107.14, 16.78], [107.186, 16.75], [107.2055, 16.7229], [107.194, 16.65], [107.22, 16.55]]);
      return (
        <g>
          <FrontArrow id="a33a" t={t} t0={0} points={path} width={36} color={SIDE_COLORS.rvn} dur={36} label="RÚT VỀ PHÍA NAM" labelSize={24} />
          <Ball id="a33b" x={path[2][0] + 110} y={path[2][1]} r={56} flag="RVN" eyes="worried" sweat hat={<M1Helmet />} motion={breathe(t, 40, 0.04)} t={t} />
        </g>
      );
    }}><Layers sites={['aiTu', 'quangTri', 'haiLang', 'myChanh']} /></QtMap>
);

export const A34: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a34" provinceColors={NEUTRAL} date={[{ t: 0, label: '4.1972' }, { t: 0.3, label: '01.05.1972' }]}
    keys={[{ t: 0, ...CAMERAS.triThienFront }, { t: 3.4, lon: 107.1835, lat: 16.7545, zoom: 22000, ease: 'out' }]}
    over={(cam) => {
      const [x, y] = citadelScreen(cam, 0, 0), k = easeOut(prog(t, 30, 80));
      return (
        <g>
          <circle cx={x} cy={y} r={620 * k} fill="#D2543C" opacity={0.15} />
          <circle cx={x} cy={y} r={620 * k} fill="none" stroke="#E0483C" strokeWidth={6} opacity={0.8 * (1 - k)} />
          <FlagPole x={x + 20} y={y + 10} flag="VNM" h={230} k={easeOut(prog(t, 44, 84))} t={t} id="a34f" />
          <LowerThird title="Thị xã Quảng Trị" sub="Ngày 1 tháng 5 năm 1972" from={0.6} t={sec(t)} />
        </g>
      );
    }}><Layers sites={['quangTri', 'dongHa']} /><CitadelPlanInMap fadeFrom={9000} fadeTo={26000} /></QtMap>
);

export const A35: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a35" date="01.05.1972" provinceColors={{ ...NEUTRAL, 'Quảng Trị': PROV.lib }} highlight={['Quảng Trị']}
    keys={[{ t: 0, lon: 107.15, lat: 16.78, zoom: 3600 }, { t: 3.2, ...CAMERAS.quangTriProvince }]}
    over={(cam) => {
      const [x, y] = project(cam, 106.9, 16.72);
      return (
        <g>
          <FlagPole x={x} y={y} flag="VNM" h={190} k={easeOut(prog(t, 40, 64))} t={t} id="a35f" />
          <Plate t={t} a={14} x={800} y={915} w={1380} lines={[{ text: 'THEO PHÍA VIỆT NAM', size: 34, fill: '#E2B95A' }, { text: 'Tỉnh đầu tiên ở miền Nam được giải phóng hoàn toàn', size: 46 }]} />
        </g>
      );
    }}><Layers sites={['quangTri', 'dongHa', 'hue']} prov /></QtMap>
);

export const A36: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a36" date="5.1972" provinceColors={NEUTRAL}
    keys={[{ t: 0, ...CAMERAS.quangTriProvince }, { t: 1.6, lon: 107.03, lat: 16.82, zoom: 1450 }]}
    over={(cam) => (
      <g>
        {Array.from({ length: 14 }, (_, i) => {
          const [x, y] = project(cam, lerp(106.7, 107.3, hash(i, 1)), lerp(16.6, 17.0, hash(i, 2)));
          return <GroundBlast key={i} t={t} t0={i * 3} x={x} y={y} r={22 + 10 * hash(i, 3)} linger={90} />;
        })}
        {[[107.1, 16.8], [107.19, 16.75], [106.99, 16.8]].map(([lo, la], i) => { const [x, y] = project(cam, lo, la); return <SmokeColumn key={i} t={t} t0={4 + i * 6} x={x} y={y} h={190} w={26} fire lean={0.4} />; })}
      </g>
    )}><Layers sites={['quangTri', 'dongHa']} prov /></QtMap>
);

export const A37: React.FC<ShotProps> = ({ t, len }) => (
  <QtMap t={t} id="a37" date="5.1972" provinceColors={NEUTRAL} dim={0.6} minimap={false}
    keys={[{ t: 0, ...CAMERAS.quangTriProvince }, { t: 3, lon: 107.05, lat: 16.78, zoom: 1500 }]}
    over={() => (
      <PhotoCard id="a37p" src="quang-tri-81-ngay-dem/img/008.jpg" caption="Người dân sơ tán trên Quốc lộ 1, 1972" credit="Ảnh: U.S. Marine Corps History Division / Public domain"
        x={960} y={500} w={860} h={591} rot={-2} from={0.1} to={len / 30 + 1} t={sec(t)} fromSide="bottom" kb={{ z0: 1.03, z1: 1.14, px0: 0.02, px1: -0.03 }} />
    )} />
);

const ROUTE: LL[] = [[107.186, 16.754], [107.194, 16.65], [107.28, 16.55], [107.45, 16.47], [107.5863, 16.4639], [107.8, 16.35], [108.0, 16.2], [108.2, 16.07]];
export const A38: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a38" date="5.1972" provinceColors={NEUTRAL}
    keys={[{ t: 0, lon: 107.2, lat: 16.7, zoom: 1500 }, { t: 3.5, lon: 107.65, lat: 16.35, zoom: 360 }]}>
    <QuangTriLabels provinces={false} />
    <QuangTriSites only={['quangTri']} />
    <GeoRoad pts={ROUTE} k={easeOut(prog(t, 4, 95))} color="#FFFFFF" w={7} crawl={t * 1.2} dot="#3A4A66" />
    <GeoPill at={[107.186, 16.754]} text="QUẢNG TRỊ" t={t} a={2} dy={-60} color="#E0483C" size={30} />
    <GeoPill at={[107.5863, 16.4639]} text="HUẾ" t={t} a={46} dy={-60} size={30} />
    <GeoPill at={[108.2, 16.07]} text="ĐÀ NẴNG" t={t} a={84} dy={-60} size={30} />
  </QtMap>
);
