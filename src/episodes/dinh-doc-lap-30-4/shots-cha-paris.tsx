import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { City, CITIES } from '../../countryball/map-labels';
import { DocumentProp, PenProp } from '../../countryball/ball-speech-and-props';
import { PhotoCard } from '../../countryball/photo-card';
import { DateChip } from '../../countryball/hud-date-chip';
import { easeOut, prog } from '../../countryball/fx-math';
import { Out, Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { SIDE, SgMap, Slam, Veil, sec } from './cha-common';
import { At, CardBg, GeoArrow, PlaneIcon, lonLatAt, LL } from './cha-bits';

// Chapter A, Paris (25.96-39.5 s): A10 rewind to Paris, A11 the signing photo 27.01.1973, A12 the agreement document, A13 the US leaves (map),
// A14 "hai tháng sau" (timeline 27.01 -> 29.03.1973), A15 last US combat units fly home (ICCS photo 09.03.1973 + plane).

const PARIS = [{ t: 0, lon: 2.4, lat: 48.5, zoom: 95 }, { t: 3.4, lon: 2.3, lat: 48.9, zoom: 112 }];

export const A10: React.FC<ShotProps> = ({ t }) => (
  <SgMap t={t} id="a10" highlight={['FRA']} minimap={false} credit={false} date={[{ t: 0, label: '30.04.1975' }, { t: 0.55, label: '1973' }]}
    keys={[{ t: 0, lon: 106.7, lat: 10.9, zoom: 260 }, { t: 0.5, lon: 106.7, lat: 11.5, zoom: 100, ease: 'in' }, { t: 1.2, lon: 60, lat: 32, zoom: 9, ease: 'in' }, { t: 1.8, lon: 2.4, lat: 48.7, zoom: 105, ease: 'out' }]}
    over={() => (
      <g>
        <Out x={960} y={930} size={92} opacity={prog(t, 6, 18)}>HAI NĂM TRƯỚC ĐÓ</Out>
        {[0, 1].map((i) => <polygon key={i} points="0,0 56,-34 56,34" transform={`translate(${1180 + i * 60 - 30 * easeOut(prog(t, 4, 40))},780)`} fill="#FFE600" stroke="#120C1E" strokeWidth={7} strokeLinejoin="round" opacity={prog(t, 4, 14)} />)}
      </g>
    )}>
    <City {...CITIES.paris} />
  </SgMap>
);

export const A11: React.FC<ShotProps> = ({ t }) => (
  <SgMap t={t} id="a11" highlight={['FRA']} dim={0.62} minimap={false} credit={false} date="27.01.1973" keys={PARIS}
    over={() => (
      <g>
        <Slam t={t} a={6} x={500} y={330} size={176}>27.01.1973</Slam>
        <Out x={500} y={450} size={74} opacity={prog(t, 20, 32)}>HIỆP ĐỊNH PARIS</Out>
        <Tag x={500} y={560} text="ĐƯỢC KÝ KẾT" size={42} opacity={prog(t, 28, 40)} />
        <PhotoCard id="a11p" src="dinh-doc-lap-30-4/img/vietnam-peace-agreement-signing.jpg" caption="Lễ ký Hiệp định Paris, 27.01.1973" credit="Ảnh: Robert L. Knudsen / Nhà Trắng / Public domain"
          x={1320} y={500} w={780} h={529} rot={2.5} from={0.2} t={t / 30} fromSide="right" kb={{ z0: 1.04, z1: 1.16 }} />
      </g>
    )}><City {...CITIES.paris} /></SgMap>
);

export const A12: React.FC<ShotProps> = ({ t }) => {
  const pen = prog(t, 14, 40), stamp = prog(t, 40, 50);
  return (
    <g>
      <CardBg id="a12" />
      <Veil id="a12" o={0.45} />
      <g transform={`translate(960,470) scale(${1 + 0.04 * prog(t, 0, 65)})`}>
        <DocumentProp x={0} y={0} s={4.4} title="HIỆP ĐỊNH" />
        <PenProp x={-250 + 380 * pen} y={170 - 40 * Math.sin(pen * Math.PI)} s={2.2} rot={-18} />
      </g>
      {stamp > 0 && (
        <g transform={`translate(1480,310) rotate(-14) scale(${1 + 0.8 * (1 - stamp)})`} opacity={stamp}>
          <rect x={-190} y={-62} width={380} height={124} rx={14} fill="none" stroke="#E5143A" strokeWidth={12} />
          <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#E5143A">ĐÃ KÝ</text>
        </g>
      )}
      <Out x={960} y={950} size={88} opacity={prog(t, 4, 16)}>HIỆP ĐỊNH PARIS 1973</Out>
    </g>
  );
};

const LEAVE: LL[] = [[106.7, 10.8], [108.4, 10.3], [111.5, 9.6]];
export const A13: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 6, 66)), [lo, la] = lonLatAt(LEAVE, k);
  return (
    <SgMap t={t} id="a13" date="1973" credit={false} keys={[{ t: 0, lon: 109.0, lat: 12.4, zoom: 130 }, { t: 2.4, lon: 109.6, lat: 12.2, zoom: 138 }]}
      over={() => (
        <g>
          <Out x={1330} y={280} size={84} opacity={prog(t, 8, 20)}>RÚT HẾT QUÂN ĐỘI</Out>
          <Out x={1330} y={380} size={84} opacity={prog(t, 14, 26)}>KHỎI VIỆT NAM</Out>
        </g>
      )}>
      <City {...CITIES.saigon} />
      <GeoArrow id="a13a" t={t} t0={6} route={LEAVE} dur={60} width={34} color={SIDE.usa} />
      <At lon={lo} lat={la} dy={-70}>
        <Ball id="a13u" x={0} y={0} r={62} flag="USA" eyes="worried" hat={<M1Helmet />} motion={mixMotion(hop(t, 22, 10), breathe(t, 50))} t={t} />
      </At>
    </SgMap>
  );
};

export const A14: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 8, 54)), X0 = 280, X1 = 1640;
  return (
    <g>
      <CardBg id="a14" />
      <Veil id="a14" o={0.4} />
      <Slam t={t} a={4} x={960} y={400} size={210}>HAI THÁNG SAU</Slam>
      <rect x={X0} y={700} width={X1 - X0} height={34} rx={17} fill="#1B2433" stroke="#E2B95A" strokeWidth={5} />
      <rect x={X0} y={700} width={(X1 - X0) * k} height={34} rx={17} fill="#E2B95A" />
      <g transform={`translate(${X0 + (X1 - X0) * k},717)`}><circle r={26} fill="#FFE600" stroke="#120C1E" strokeWidth={6} /></g>
      <text x={X0} y={820} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F4F4F4" stroke="#0A101C" strokeWidth={8} paintOrder="stroke">27.01.1973</text>
      <text x={X1} y={820} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F4F4F4" stroke="#0A101C" strokeWidth={8} paintOrder="stroke" opacity={prog(t, 44, 56)}>29.03.1973</text>
      <Ball id="a14u" x={X0 + (X1 - X0) * k} y={610} r={78} flag="USA" eyes="worried" hat={<M1Helmet />} motion={mixMotion(hop(t, 18, 14), breathe(t, 50))} t={t} />
      <DateChip dates={[{ t: 0, label: '27.01.1973' }, { t: 1.5, label: '29.03.1973' }]} t={sec(t)} id="a14-date" />
    </g>
  );
};

export const A15: React.FC<ShotProps> = ({ t }) => {
  const fly = easeOut(prog(t, 18, 62));
  return (
    <SgMap t={t} id="a15" dim={0.6} minimap={false} credit={false} date="29.03.1973" keys={[{ t: 0, lon: 107.5, lat: 11.8, zoom: 150 }, { t: 2.1, lon: 107.5, lat: 11.8, zoom: 158 }]}
      over={() => (
        <g>
          <PhotoCard id="a15p" src="dinh-doc-lap-30-4/img/iccs-kiem-tra-quan-my-rut-1973.jpg" caption="Quân Mỹ rút khỏi Tân Sơn Nhất, 09.03.1973" credit="Ảnh: SSG Richard S. Hiwa Jr., Quân đội Mỹ / Public domain"
            x={560} y={520} w={720} h={559} rot={-2.5} from={0.15} t={t / 30} fromSide="left" kb={{ z0: 1.04, z1: 1.14 }} />
          <PlaneIcon x={1120 + 640 * fly} y={760 - 330 * fly} s={0.9 + 0.2 * fly} rot={-12 * fly} />
          <Slam t={t} a={14} x={1380} y={640} size={140}>29.03.1973</Slam>
          <Tag x={1380} y={740} text="LÊN MÁY BAY VỀ NƯỚC" size={40} opacity={prog(t, 26, 38)} />
        </g>
      )} />
  );
};
