import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe, hop } from '../../countryball/ball-motion';
import { FrontArrow } from '../../countryball/ground-front-arrows';
import { NavalBombardment } from '../../countryball/ground-naval-gunfire';
import { BCell, FlightPath } from '../../countryball/fx-flight-path';
import { project } from '../../countryball/geo-camera';
import { backOut, easeOut, lerp, prog } from '../../countryball/fx-math';
import { Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Plate, QtMap, SIDE } from './cha-common';

// Chapter A, Vietnamization: A17 US ground troops leave (USA balls walk out to the sea), RVN ball takes over; A18 US air + navy still support.

export const A17: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a17" highlight={['VNM']} provinces={false} date="1972"
    keys={[{ t: 0, lon: 108.7, lat: 14.9, zoom: 70 }, { t: 4.2, lon: 108.4, lat: 14.7, zoom: 78 }]}
    over={(cam) => {
      const [rx, ry] = project(cam, 107.7, 14.1), k = easeOut(prog(t, 44, 96));
      return (
        <g>
          <FrontArrow id="a17a" t={t} t0={4} points={[[1150, 470], [1600, 440], [2050, 470]]} width={44} color={SIDE.usa} dur={70} label="BỘ BINH MỸ RÚT VỀ" labelSize={26} />
          {[0, 1, 2].map((i) => {
            const u = prog(t, 8 + i * 8, 100 + i * 8), x = lerp(1050 - i * 70, 2150, u), o = 1 - prog(u, 0.85, 1);
            return <g key={i} opacity={o}><Ball id={`a17u${i}`} x={x} y={600 + i * 8} r={64} flag="USA" eyes="normal" look={0.5} hat={<M1Helmet color="#58663C" />} motion={hop(t, 16, 12, i * 5)} t={t} /></g>;
          })}
          <Ball id="a17r" x={rx} y={ry} r={78 + 46 * k} flag="RVN" eyes="determined" hat={<M1Helmet />} motion={breathe(t, 60, 0.03)} t={t} />
          <Tag x={rx} y={ry + 175} text="QUÂN ĐỘI SÀI GÒN" color={SIDE.rvn} size={30} opacity={prog(t, 50, 62)} />
          <Plate t={t} a={34} x={960} y={120} w={780} lines={[{ text: 'VIỆT NAM HÓA CHIẾN TRANH', size: 44, fill: '#FFE600' }]} />
        </g>
      );
    }} />
);

export const A18: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a18" provinces={false} highlight={['VNM']} date="1972"
    keys={[{ t: 0, lon: 107.0, lat: 16.9, zoom: 380 }, { t: 3.1, lon: 107.1, lat: 16.85, zoom: 400 }]}
    over={() => (
      <g>
        <NavalBombardment id="a18n" t={t} t0={8} ship={{ x: 1560, y: 400, heading: 200, size: 330, kind: 'cruiser' }} target={[980, 560]} every={46} flight={44} lift={190} spread={90} r={30} />
        <NavalBombardment id="a18m" t={t} t0={22} ship={{ x: 1640, y: 640, heading: 190, size: 220, kind: 'destroyer' }} target={[1020, 700]} every={52} flight={44} lift={150} spread={80} r={26} seed={4} />
        <BCell id="a18b" t={t} t0={0} t1={90} points={[[-200, 90], [900, 150], [2100, 230]]} size={70} trailLen={330} />
        <FlightPath id="a18f" t={t} t0={14} t1={92} points={[[2100, 860], [1100, 800], [-200, 700]]} kind="f4" size={64} trailLen={260} />
        <Ball id="a18r" x={520} y={780} r={110} flag="RVN" eyes="determined" hat={<M1Helmet />} motion={breathe(t, 64, 0.03)} t={t} />
        <Tag x={520} y={940} text="QUÂN ĐỘI SÀI GÒN" color={SIDE.rvn} size={30} opacity={prog(t, 4, 14)} />
        <Tag x={800} y={120} text="KHÔNG QUÂN MỸ" color={SIDE.usa} size={32} opacity={backOut((t - 6) / 10)} />
        <Tag x={1400} y={850} text="HẢI QUÂN MỸ" color={SIDE.usa} size={32} opacity={backOut((t - 16) / 10)} />
      </g>
    )} />
);
