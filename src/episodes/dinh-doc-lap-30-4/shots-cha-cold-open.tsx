import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe } from '../../countryball/ball-motion';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { City, CITIES } from '../../countryball/map-labels';
import { MapFlag } from '../../countryball/flag-cloth';
import { PalacePlan, PalacePlanInMap, palaceRoute, PlanTank } from '../../countryball/palace-plan';
import { SAIGON_ATTRIBUTION, SaigonLabels, SaigonSites } from '../../countryball/sai-gon-map-labels';
import { GateCrash } from '../../countryball/palace-gate-crash';
import { PalaceFacade } from '../../countryball/palace-facade';
import { cameraAt, CameraKey } from '../../countryball/geo-camera';
import { LowerThird, SourceLine } from '../../countryball/hud-chips';
import { DateChip } from '../../countryball/hud-date-chip';
import { easeOut, prog } from '../../countryball/fx-math';
import { Out, Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Drift, Plate, SgMap, Slam, Veil, sec } from './cha-common';

// Chapter A cold open (0-20.6 s): A1 fly-in to Sài Gòn "10:45 sáng 30.04.1975", A2 tank column on the avenue (plan), A3 the closed gate,
// A4 the palace, A5 "nơi làm việc của Tổng thống VNCH", A6 the column rolls to the gate and FREEZES just before impact (crash 0.3),
// A7 held freeze + "hơn 20 năm" -> black.

const FLY: CameraKey[] = [
  { t: 0, ...C.vietnam }, { t: 0.9, ...C.vietnam }, { t: 2.9, ...C.saigonRegion }, { t: 4.2, ...C.city }, { t: 4.8, ...C.city }, { t: 6.65, ...C.downtown },
];

export const A1: React.FC<ShotProps> = ({ t }) => (
  <SgMap t={t} id="a1" keys={FLY} date="30.04.1975" provinces={false}
    over={() => <Out x={960} y={940} size={96} opacity={prog(t, 8, 20) * (1 - prog(t, 150, 164))}>10:45 SÁNG</Out>}>
    <City {...CITIES.saigon} maxZoom={1000} />
    <SaigonLabels />
    <SaigonSites />
    <PalacePlanInMap t={t} labels={['palace', 'streets']} />
    <MapFlag lon={106.6953} lat={10.7769} kind="RVN" minZoom={9000} t={t} id="a1f" size={70} />
  </SgMap>
);

// Tank column along the avenue axis toward the palace (palace frame [front, side]); gap in route fraction.
const AVENUE: [number, number][] = [[900, 0], [170, 0]];
const column = (u0: number, n: number, gap: number): PlanTank[] =>
  Array.from({ length: n }, (_, i) => { const p = palaceRoute(AVENUE, Math.max(0, u0 - i * gap)); return { x: p.x, y: p.y, heading: p.heading, kind: i === 0 ? 'type59' : 't54', scale: 1.4 }; });

export const A2: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const cam = cameraAt([{ t: 0, ...C.downtown }, { t: 2.0, lon: C.palaceGrounds.lon + 0.0014, lat: C.palaceGrounds.lat + 0.0012, zoom: 120000 }], s);
  return (
    <g>
      <PalacePlan id="a2" camera={cam} t={t} tanks={column(0.3 + 0.32 * prog(t, 0, 60), 4, 0.1)} labels={['streets', 'palace']} />
      <Veil id="a2" o={0.35} />
      <LowerThird title="Đại lộ Thống Nhất (nay: đường Lê Duẩn)" sub="Đoàn xe tăng tiến về Dinh Độc Lập" from={0.1} to={2} t={s} />
      <DateChip label="30.04.1975" t={s} id="a2-date" />
      <SourceLine text={`${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`} t={s} />
    </g>
  );
};

export const A3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1} z1={1.09} cx={1100} cy={700}>
      <GateCrash id="a3" crash={0} t={t} />
    </Drift>
    <Veil id="a3" o={0.4} />
    <Tag x={560} y={190} text="CỔNG SẮT ĐÓNG CHẶT" size={44} opacity={prog(t, 6, 16)} />
  </g>
);

export const A4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1} z1={1.08} cx={960} cy={900}>
      <PalaceFacade id="a4" x={960} y={930} w={1700} flag="RVN" t={t} />
    </Drift>
    <Veil id="a4" o={0.3} />
    <Out x={960} y={1030} size={118} opacity={prog(t, 6, 18)}>DINH ĐỘC LẬP</Out>
  </g>
);

export const A5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1.15} z1={1.3} cx={960} cy={420}>
      <PalaceFacade id="a5" x={960} y={1040} w={2000} flag="RVN" t={t} windows={0.2} />
    </Drift>
    <rect width={1920} height={1080} fill="#0A1220" opacity={0.28} />
    <Ball id="a5b" x={330} y={800} r={130} flag="RVN" eyes="worried" tilt={-4} hat={<M1Helmet />} motion={breathe(t, 74, 0.03)} t={t} />
    <Plate t={t} a={8} x={1150} y={830} w={1180} lines={[{ text: 'NƠI LÀM VIỆC CỦA', size: 50, fill: '#E2B95A' }, { text: 'TỔNG THỐNG VIỆT NAM CỘNG HÒA', size: 66 }]} />
    <Veil id="a5" o={0.35} />
  </g>
);

// A6: crash 0 -> 0.3 (the tank reaches the gate), then everything FREEZES (t held, no motion but the camera hold) just before impact (0.34).
const FREEZE = 52;
export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const ft = Math.min(t, FREEZE), crash = 0.3 * easeOut(prog(t, 0, FREEZE));
  return (
    <g>
      <Drift t={Math.min(t, FREEZE + 20)} len={FREEZE + 20} z0={1} z1={1.1} cx={1100} cy={720}>
        <GateCrash id="a6" crash={crash} t={ft} />
      </Drift>
      <Veil id="a6" o={0.35 + 0.3 * prog(t, FREEZE, len)} />
      <Out x={960} y={170} size={92} opacity={prog(t, 4, 14)}>CHỈ VÀI PHÚT NỮA</Out>
    </g>
  );
};

export const A7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1.1} z1={1.16} cx={1100} cy={720}>
      <GateCrash id="a7" crash={0.3} t={FREEZE} />
    </Drift>
    <rect width={1920} height={1080} fill="#04070D" opacity={0.15 + 0.5 * prog(t, 30, 80) + 0.35 * prog(t, len - 16, len - 2)} />
    <Slam t={t} a={40} x={960} y={470} size={190}>HƠN 20 NĂM</Slam>
    <Out x={960} y={600} size={78} opacity={prog(t, 78, 90)}>SẮP ĐẾN HỒI KẾT</Out>
  </g>
);
