import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe, hopOnce, mixMotion, shake } from '../../countryball/ball-motion';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { DmzBand, QuangTriLabels, QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { CITIES, City } from '../../countryball/map-labels';
import { FrontArrow, SIDE_COLORS } from '../../countryball/ground-front-arrows';
import { WaterRipples } from '../../countryball/ground-water-splash';
import { BCell, FlightPath } from '../../countryball/fx-flight-path';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { PhotoCard } from '../../countryball/photo-card';
import { Camera, project } from '../../countryball/geo-camera';
import { Pt, easeOut, hash, prog } from '../../countryball/fx-math';
import { NameCard, Out, Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { PROV, QtMap, SIDE, Slam, sec } from './cha-common';

// Chapter A, the response (ends at 118.19 s): A39 Nixon in Washington, A40 US bombers back over the North, A41 mines at the ports,
// A42 Thiệu swaps the commander (name cards, no photos), A43 "lấy lại Quảng Trị" arrow at the town.

const WASH = [{ t: 0, lon: -77.0, lat: 38.9, zoom: 72 }, { t: 3.2, lon: -77.0, lat: 38.9, zoom: 90 }];

export const A39: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a39" provinces={false} highlight={['USA']} labels={false} dim={0.5} minimap={false} date="5.1972" keys={WASH}
    over={() => (
      <g>
        <Ball id="a39u" x={520} y={650} r={140} flag="USA" eyes="angry" tilt={-3} motion={mixMotion(breathe(t, 50, 0.04), shake(t, 40, 9, 24))} t={t} />
        <Tag x={520} y={450} text="PHẢN ỨNG GAY GẮT" color={SIDE.usa} size={34} opacity={prog(t, 30, 42)} />
        <PhotoCard id="a39p" src="quang-tri-81-ngay-dem/img/nixon-portrait.jpg" caption="Tổng thống Richard Nixon" credit="Ảnh: U.S. Department of Defense / Public domain"
          x={1330} y={470} w={470} h={627} rot={3} from={0.15} t={sec(t)} fromSide="right" kb={{ z0: 1.03, z1: 1.1, px0: 0, py0: 0.03, px1: 0, py1: -0.02 }} />
      </g>
    )}><City {...CITIES.washington} /></QtMap>
);

export const A40: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a40" provinces={false} highlight={['VNM']} date="5.1972" keys={[{ t: 0, lon: 105.6, lat: 19.4, zoom: 150 }, { t: 2.1, lon: 105.6, lat: 19.6, zoom: 165 }]}
    over={(cam) => {
      const P = (lo: number, la: number): Pt => project(cam, lo, la);
      return (
        <g>
          {[[105.68, 18.68, 22], [105.85, 21.03, 30], [106.68, 20.86, 40], [105.9, 19.8, 14]].map(([lo, la, a], i) => { const [x, y] = P(lo, la); return <GroundBlast key={i} t={t} t0={a} x={x} y={y} r={26} linger={70} />; })}
          <BCell id="a40a" t={t} t0={0} t1={64} points={[P(107.6, 17.3), P(106.2, 19.2), P(105.85, 21.1)]} size={62} trailLen={300} />
          <FlightPath id="a40b" t={t} t0={8} t1={62} points={[P(107.9, 18.8), P(106.6, 20.0), P(106.5, 21.0)]} kind="f4" size={52} trailLen={220} />
          <Tag x={1480} y={160} text="NÉM BOM MIỀN BẮC" color={SIDE.usa} size={34} opacity={prog(t, 4, 16)} />
        </g>
      );
    }}><City {...CITIES.hanoi} /><City {...CITIES.haiphong} /><City {...CITIES.vinh} /></QtMap>
);

/** A floating naval mine: dark ball with spikes, bobbing. */
const Mine: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 20 }) => (
  <g transform={`translate(${x},${y + Math.sin(t / 8 + x) * 2})`}>
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * 0.785) * s * 1.5} y2={Math.sin(i * 0.785) * s * 1.5} stroke="#151515" strokeWidth={s * 0.35} strokeLinecap="round" />)}
    <circle r={s} fill="#3A4150" stroke="#151515" strokeWidth={4} /><circle cx={-s * 0.3} cy={-s * 0.3} r={s * 0.28} fill="#7C8AA0" opacity={0.7} />
  </g>
);

export const A41: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a41" provinces={false} highlight={['VNM']} date="8.5.1972" keys={[{ t: 0, lon: 106.95, lat: 20.65, zoom: 640 }, { t: 2.0, lon: 106.9, lat: 20.7, zoom: 700 }]}
    over={(cam) => {
      const mouth = project(cam, 106.78, 20.76);
      return (
        <g>
          <FlightPath id="a41f" t={t} t0={0} t1={52} points={[[2100, 300], [1500, 470], [mouth[0] + 160, mouth[1] - 20], [mouth[0] - 100, mouth[1] + 30]]} kind="f4" size={64} trailLen={240} />
          {Array.from({ length: 7 }, (_, i) => {
            const t0 = 12 + i * 5, x = mouth[0] + 190 - i * 54 + (hash(i, 2) - 0.5) * 40, y = mouth[1] - 14 + (hash(i, 3) - 0.5) * 70;
            return t >= t0 ? <g key={i}><WaterRipples t={t} t0={t0} x={x} y={y} r={44} n={2} life={50} /><Mine x={x} y={y} t={t} s={26} /></g> : null;
          })}
          <Slam t={t} a={26} x={1150} y={190} size={92} fill="#FFFFFF" rot={-2}>PHONG TỎA CẢNG BIỂN</Slam>
        </g>
      );
    }}><City {...CITIES.haiphong} /></QtMap>
);

export const A42: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <QtMap t={t} id="a42" provinces={false} highlight={['VNM']} dim={0.55} minimap={false} date="2.5.1972"
      keys={[{ t: 0, lon: 106.9, lat: 11.2, zoom: 150 }, { t: 3.6, lon: 106.8, lat: 11.0, zoom: 175 }]}
      over={() => (
        <g>
          <NameCard x={310} y={500} w={420} name="NGUYỄN VĂN THIỆU" sub="Tổng thống" s={s} from={0.1} />
          <g opacity={1 - 0.65 * prog(t, 62, 74)}>
            <NameCard x={830} y={500} w={420} name="HOÀNG XUÂN LÃM" sub="Tư lệnh Quân đoàn I" s={s} from={0.5} />
            <g opacity={prog(t, 44, 52)}><line x1={630} y1={330} x2={1030} y2={700} stroke="#E0483C" strokeWidth={14} strokeLinecap="round" /><line x1={1030} y1={330} x2={630} y2={700} stroke="#E0483C" strokeWidth={14} strokeLinecap="round" /></g>
          </g>
          <NameCard x={1510} y={500} w={420} name="NGÔ QUANG TRƯỞNG" sub="Tư lệnh mới" s={s} from={1.9} />
          <polygon points="1100,470 1180,470 1180,430 1260,500 1180,570 1180,530 1100,530" fill="#E2B95A" stroke="#151515" strokeWidth={5} opacity={prog(t, 52, 62)} transform={`translate(${Math.sin(t / 5) * 4},0)`} />
          <Ball id="a42r" x={310} y={890} r={78} flag="RVN" eyes="determined" hat={<M1Helmet />} motion={mixMotion(breathe(t, 60), hopOnce(t, 56, 18, 30))} t={t} />
        </g>
      )}><City {...CITIES.saigon} /></QtMap>
  );
};

export const A43: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a43" date="5.1972" provinceColors={{ 'Quảng Bình': PROV.north, 'Quảng Trị': PROV.lib, 'Thừa Thiên-Huế': PROV.rvn, 'Quảng Nam - Đà Nẵng': PROV.rvn }}
    keys={[{ t: 0, ...CAMERAS.triThienFront }, { t: 2.0, lon: 107.15, lat: 16.78, zoom: 4200 }]}
    over={(cam: Camera) => {
      const [x, y] = project(cam, 107.186, 16.754), ring = (t % 24) / 24;
      return (
        <g>
          <FrontArrow id="a43a" t={t} t0={2} points={[[x + 330, y + 560], [x + 220, y + 300], [x + 70, y + 110]]} width={56} color={SIDE_COLORS.rvn} dur={36} />
          <FrontArrow id="a43b" t={t} t0={10} points={[[x + 760, y + 420], [x + 460, y + 250], [x + 110, y + 60]]} width={44} color={SIDE_COLORS.rvn} dur={34} />
          <circle cx={x} cy={y} r={30 + 110 * easeOut(ring)} fill="none" stroke="#FFD25A" strokeWidth={6} opacity={1 - ring} />
          <Out x={960} y={960} size={88} fill="#FFE600" opacity={prog(t, 20, 32)}>LẤY LẠI QUẢNG TRỊ</Out>
        </g>
      );
    }}><DmzBand label="KHU PHI QUÂN SỰ" /><QuangTriLabels provinces={false} /><QuangTriSites only={['quangTri', 'dongHa', 'haiLang', 'myChanh']} /></QtMap>
);
