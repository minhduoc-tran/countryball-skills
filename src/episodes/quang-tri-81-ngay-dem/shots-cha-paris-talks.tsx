import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { breathe, hop, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { CITIES, City } from '../../countryball/map-labels';
import { PhotoCard } from '../../countryball/photo-card';
import { easeOut, prog } from '../../countryball/fx-math';
import { Out, Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { QtMap, Slam } from './cha-common';

// Chapter A, Paris talks: A14 flight to Paris, A15 two sides at the table (1968), A16 four years stalled + the 1973 talks photo.

const PARIS = [{ t: 0, lon: 2.4, lat: 48.5, zoom: 95 }, { t: 3.4, lon: 2.3, lat: 48.9, zoom: 112 }];

export const A14: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a14" provinces={false} highlight={['FRA']} date="1.1972" minimap={false}
    keys={[{ t: 0, lon: 106.0, lat: 16.4, zoom: 70 }, { t: 0.8, lon: 60, lat: 32, zoom: 9, ease: 'in' }, { t: 1.8, lon: 2.4, lat: 48.7, zoom: 105, ease: 'out' }, { t: 2.3, lon: 2.35, lat: 48.8, zoom: 108 }]}
    over={() => <Out x={960} y={930} size={84} opacity={prog(t, 36, 50)}>ĐÀM PHÁN HÒA BÌNH Ở PARIS</Out>}>
    <City {...CITIES.paris} />
  </QtMap>
);

const Table: React.FC<{ t: number; id: string; vx: number; ux: number; y: number; r: number }> = ({ t, id, vx, ux, y, r }) => (
  <g>
    <ellipse cx={(vx + ux) / 2} cy={y + r * 1.05} rx={(ux - vx) / 2 + r * 1.1} ry={r * 0.9} fill="#6B4A32" stroke="#111" strokeWidth={7} />
    <ellipse cx={(vx + ux) / 2} cy={y + r * 0.98} rx={(ux - vx) / 2 + r * 0.95} ry={r * 0.74} fill="#7E5A3E" />
    <Ball id={`${id}v`} x={vx} y={y} r={r} flag="VNM" eyes="determined" tilt={4} motion={mixMotion(breathe(t, 62), hopOnce(t, 8, 18, 22))} t={t} />
    <Ball id={`${id}u`} x={ux} y={y} r={r} flag="USA" eyes="determined" tilt={-4} motion={mixMotion(breathe(t, 66, 0.03, 20), hopOnce(t, 16, 18, 22))} t={t} />
  </g>
);

export const A15: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a15" provinces={false} highlight={['FRA']} dim={0.55} minimap={false} date={[{ t: 0, label: '1.1972' }, { t: 0.3, label: '1968' }]}
    keys={PARIS}
    over={() => (
      <g>
        <Ball id="a15f" x={960} y={380} r={90} flag="FRA" eyes="normal" motion={breathe(t, 60)} t={t} />
        <Tag x={960} y={250} text="CHỦ NHÀ: PARIS" size={28} opacity={prog(t, 8, 18)} />
        <Table t={t} id="a15" vx={620} ux={1300} y={590} r={140} />
        <Tag x={620} y={800} text="VIỆT NAM" opacity={prog(t, 14, 24)} />
        <Tag x={1300} y={800} text="MỸ" opacity={prog(t, 20, 30)} />
        <Slam t={t} a={26} x={960} y={190} size={150}>1968</Slam>
      </g>
    )}><City {...CITIES.paris} /></QtMap>
);

export const A16: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 12, 90)), X0 = 150, X1 = 880;
  return (
    <QtMap t={t} id="a16" provinces={false} highlight={['FRA']} dim={0.66} minimap={false} date={[{ t: 0, label: '1968' }, { t: 1, label: '1970' }, { t: 2, label: '1972' }]}
      keys={PARIS}
      over={() => (
        <g>
          <Slam t={t} a={4} x={560} y={290} size={190}>4 NĂM</Slam>
          <rect x={X0} y={380} width={X1 - X0} height={24} rx={12} fill="#1B2433" stroke="#E2B95A" strokeWidth={4} />
          <rect x={X0} y={380} width={(X1 - X0) * k} height={24} rx={12} fill="#E2B95A" />
          {[1968, 1970, 1972].map((y, i) => <text key={y} x={X0 + i * 365} y={452} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F4F4F4">{y}</text>)}
          <Ball id="a16v" x={300} y={690} r={105} flag="VNM" eyes="worried" motion={hop(t, 18, 18)} t={t} />
          <Ball id="a16u" x={700} y={690} r={105} flag="USA" eyes="worried" motion={hop(t, 18, 18, 9)} t={t} />
          <Tag x={500} y={880} text="GIẬM CHÂN TẠI CHỖ" color="#E2B95A" size={34} opacity={prog(t, 30, 42)} />
          <PhotoCard id="a16p" src="quang-tri-81-ngay-dem/img/le-duc-tho-kissinger.jpg" caption="Bàn đàm phán Paris (ảnh 01.1973)" credit="Ảnh: Nhà Trắng / Public domain"
            x={1380} y={500} w={700} h={454} rot={2.5} from={0.25} t={t / 30} fromSide="right" kb={{ z0: 1.04, z1: 1.14 }} />
        </g>
      )}><City {...CITIES.paris} /></QtMap>
  );
};
