import React from 'react';
import { ShotProps } from '../../engine';
import { Camera, CameraKey, project } from '../../countryball/geo-camera';
import { Ball } from '../../countryball/countryball';
import { breathe } from '../../countryball/ball-motion';
import { TankCrewHelmet } from '../../countryball/ball-accessories-military';
import { TankColumn, TankSide } from '../../countryball/ground-tanks';
import { CampaignArrows } from '../../countryball/sai-gon-campaign-arrows';
import { SaigonLabels, SaigonSites } from '../../countryball/sai-gon-map-labels';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { FlagCloth } from '../../countryball/flag-cloth';
import { Pt, lerp } from '../../countryball/fx-math';
import { Cap, MapScene, Plate, Stage, Tag, VNM_RED, easeOut, prog } from './che-common';
import { Rider, RoadScroll, Truck } from './che-props';

// Chapter E, part 3 (5:48-6:01, beat "8 morning", 30.04.1975): E12 from the south-east, E13 Lữ đoàn xe tăng 203 / Quân đoàn 2, E14 tank column on Xa lộ Biên Hòa (map),
// E15 infantry on the tanks and trucks, E16 a vehicle captured on the way. Unit names exactly as narrated; no counts, no extra unit numbers.

/** Xa lộ Biên Hòa (today's QL1), Biên Hòa -> cầu Sài Gòn: hand-laid approximation of the road drawn on the OSM level. */
const XA_LO: [number, number][] = [[106.8263, 10.9508], [106.815, 10.918], [106.795, 10.885], [106.77, 10.853], [106.745, 10.822], [106.7272, 10.7988]];
const proj = (cam: Camera): Pt[] => XA_LO.map(([lo, la]) => project(cam, lo, la) as Pt);

/** E12 348.57 "Cùng buổi sáng ấy, từ hướng đông nam," the south-east axis (the arrow grows from Long Thành / Nhơn Trạch towards the city). */
export const E12: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="e12" date="30.04.1975" keys={[{ t: 0, ...C.saigonRegion, ease: 'linear' }, { t: 2.2, lon: 106.84, lat: 10.84, zoom: 2300, ease: 'linear' }]}
    map={<><CampaignArrows t={t} t0={4} only={['dongNam']} dur={46} labels={false} /><SaigonLabels regions rivers={false} roads={false} /><SaigonSites only={['dinhDocLap', 'bienHoa']} size={24} /></>}
    over={() => <Tag t={t} at={6} x={1120} y={920} text="TỪ HƯỚNG ĐÔNG NAM" fill={VNM_RED} size={52} />} />
);

/** E13 350.71 "Lữ đoàn xe tăng hai trăm linh ba của Quân đoàn hai" unit card with a determined VNM ball (tank-crew helmet) and a T-54 rolling in. */
export const E13: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 0, 40));
  return (
    <g>
      <Stage id="e13" tone="noon" />
      <rect y={800} width={1920} height={280} fill="#5C6B3C" /><rect y={780} width={1920} height={20} fill="#6A6458" />
      <TankSide x={lerp(2300, 1380, k)} y={830} size={560} kind="t54" t={t} turret={0} />
      <Ball id="e13b" x={470} y={700} r={150} flag="VNM" eyes="determined" hat={<TankCrewHelmet />} tilt={-4} motion={breathe(t, 80, 0.025)} t={t} />
      <Plate t={t} at={0} x={960} y={170} text="LỮ ĐOÀN XE TĂNG 203" size={78} />
      <Plate t={t} at={50} x={960} y={330} text="QUÂN ĐOÀN 2" size={64} color="#FFE08A" />
    </g>
  );
};

/** E14 353.67 "đang lao trên xa lộ Biên Hòa." the column rushes down Xa lộ Biên Hòa towards cầu Sài Gòn. */
export const E14: React.FC<ShotProps> = ({ t }) => {
  const keys: CameraKey[] = [{ t: 0, lon: 106.78, lat: 10.87, zoom: 3600, ease: 'linear' }, { t: 1.8, lon: 106.77, lat: 10.855, zoom: 4300, ease: 'linear' }];
  return (
    <MapScene t={t} id="e14" date="30.04.1975" keys={keys}
      map={<><SaigonLabels regions={false} rivers={false} roads={false} /><SaigonSites only={['bienHoa', 'cauSaiGon']} size={24} /></>}
      over={(cam) => (
        <g>
          <TankColumn id="e14" t={t} t0={0} t1={46} points={proj(cam)} n={5} gap={92} size={74} kind="t54" />
          <Tag t={t} at={4} x={960} y={930} text="XA LỘ BIÊN HÒA" fill={VNM_RED} size={52} />
        </g>
      )} />
  );
};

/** Tank with riders on the hull / turret (local units of TankSide: k = size / 200). */
const RiddenTank: React.FC<{ x: number; y: number; size: number; t: number; n?: number; seed?: number }> = ({ x, y, size, t, n = 5, seed = 0 }) => {
  const k = size / 200;
  const spots: Pt[] = [[-70, -34], [-48, -34], [-14, -66], [12, -66], [38, -66], [-30, -34]];
  return (
    <g transform={`translate(0,${Math.sin(t / 5 + seed) * 2})`}>
      <TankSide x={x} y={y} size={size} kind="t54" t={t} />
      {spots.slice(0, n).map(([sx, sy], i) => <Rider key={i} x={x + sx * k} y={y + sy * k} s={k * 0.6} bob={Math.sin(t / 4 + i * 2 + seed) * 2} />)}
    </g>
  );
};

/** E15 355.43 "Đi cùng xe tăng là bộ binh, ngồi trên thùng xe, trên nóc xe," infantry ride the tanks and a truck (side view, the road scrolls). */
export const E15: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 0, 24));
  const text = t < 47 ? 'BỘ BINH ĐI CÙNG XE TĂNG' : t < 82 ? 'NGỒI TRÊN THÙNG XE' : 'TRÊN NÓC XE';
  return (
    <g>
      <RoadScroll id="e15" t={t} y={780} speed={7} />
      <RiddenTank x={lerp(-300, 520, k) + t * 0.5} y={900} size={560} t={t} n={6} />
      <Truck x={lerp(2500, 1560, easeOut(prog(t, 30, 70))) + t * 0.4} y={900} size={430} riders={5} t={t} />
      <Plate t={t} at={t < 47 ? 0 : t < 82 ? 47 : 82} x={960} y={160} text={text} size={72} />
    </g>
  );
};

/** E16 359.05 "trên cả những chiếc xe vừa thu được dọc đường." a captured truck (grey body, PRG flag) carries the infantry on. */
export const E16: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RoadScroll id="e16" t={t} y={780} speed={5} />
    <Truck x={820 + t * 1.2} y={930} size={800} riders={7} t={t} body="#8A93A0" cab="#7C8592" />
    <g transform={`translate(${916 + t * 1.2},410) scale(-1,1)`}><FlagCloth id="e16fl" x={0} y={0} w={130} h={86} kind="PRG" wave={0.9} t={t} /></g>
    <Plate t={t} at={0} x={960} y={160} text="XE VỪA THU ĐƯỢC DỌC ĐƯỜNG" size={68} />
  </g>
);
