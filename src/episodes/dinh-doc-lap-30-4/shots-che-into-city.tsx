import React from 'react';
import { ShotProps } from '../../engine';
import { Camera, project } from '../../countryball/geo-camera';
import { TankColumn, TankSide } from '../../countryball/ground-tanks';
import { PalacePlan, palaceRoute } from '../../countryball/palace-plan';
import { SaigonSites } from '../../countryball/sai-gon-map-labels';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { SourceLine } from '../../countryball/hud-chips';
import { lerp, Pt } from '../../countryball/fx-math';
import { cameraAt } from '../../countryball/geo-camera';
import { CREDIT_OSM, MapScene, PhotoE, Plate, Stage, Tag, VNM_RED, easeOut, prog } from './che-common';
import { Onlooker, PavementRow, Rider, ShopFront } from './che-props';

// Chapter E, part 6 (6:28-6:43, beat "8d into city", 30.04.1975): E26 across the bridge, Hàng Xanh, into the centre (map), E27 people on both sides of the road, E28 three
// reactions (wave / watch / shutter), E29 the avenue Thống Nhất (print 1996, says so), E30 the palace at the end of Lê Duẩn (gate CLOSED, RVN flag): the crash is chapter F.

/** Route cầu Sài Gòn -> Hàng Xanh -> centre (hand-laid, approximate): ends at the Dinh. */
const ROUTE: [number, number][] = [[106.7335, 10.8035], [106.7272, 10.7988], [106.7101, 10.8013], [106.7035, 10.7935], [106.699, 10.7855], [106.6953, 10.7769]];

/** E26 388.85 "Đoàn xe tăng vượt qua cầu, chạy qua ngã tư Hàng Xanh, rồi rẽ vào trung tâm." column crosses the bridge, passes Hàng Xanh and turns to the centre. */
export const E26: React.FC<ShotProps> = ({ t }) => {
  const keys = [{ t: 0, lon: 106.72, lat: 10.803, zoom: 14000, ease: 'inout' as const }, { t: 4.5, lon: 106.7, lat: 10.788, zoom: 17000, ease: 'inout' as const }];
  const text = t < 44 ? 'CẦU SÀI GÒN' : t < 91 ? 'NGÃ TƯ HÀNG XANH' : 'VÀO TRUNG TÂM';
  return (
    <MapScene t={t} id="e26" date="30.04.1975" keys={keys}
      map={<SaigonSites only={['cauSaiGon', 'hangXanh', 'dinhDocLap']} size={26} />}
      over={(cam: Camera) => (
        <g>
          <TankColumn id="e26" t={t} t0={0} t1={118} points={ROUTE.map(([lo, la]) => project(cam, lo, la) as Pt)} n={4} gap={80} size={70} kind="t54" />
          <Tag t={t} at={t < 44 ? 0 : t < 91 ? 44 : 91} x={960} y={930} text={text} fill={VNM_RED} size={52} />
        </g>
      )} />
  );
};

/** E27 393.35 "Người dân Sài Gòn đứng hai bên đường nhìn theo." the column passes, people stand along the pavement (faceless silhouettes). */
export const E27: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="e27" tone="noon" />
    {[0, 1, 2, 3, 4].map((i) => <ShopFront key={i} id={`e27s${i}`} x={160 + i * 400} y={700} w={340} h={380 + (i % 2) * 70} shutter={i === 3 ? 0.5 : 0} wall={['#D8C79A', '#C9B98B', '#E0D2A8', '#C5B089', '#D2C292'][i]} />)}
    <rect y={690} width={1920} height={390} fill="#6A6458" /><rect y={684} width={1920} height={10} fill="#B9B29E" />
    <rect y={900} width={1920} height={180} fill="#5A5346" />
    <g transform={`translate(${lerp(-420, 2300, prog(t, 0, 76))},0)`}>
      <TankSide x={0} y={830} size={360} kind="t54" t={t} />
      {[[-70, -34], [-14, -66], [12, -66]].map(([sx, sy], i) => <Rider key={i} x={sx * 1.8} y={830 + sy * 1.8} s={1.1} bob={Math.sin(t / 4 + i * 2) * 2} />)}
    </g>
    <PavementRow x0={60} x1={1860} y={1040} n={22} s={1.3} t={t} seed={4} wavers={0.15} color="#141B26" />
    <Plate t={t} at={4} x={960} y={150} text="NGƯỜI DÂN SÀI GÒN ĐỨNG HAI BÊN ĐƯỜNG" size={54} />
  </g>
);

/** One framed vignette (w x h) lit when `on` (0..1): dim and shrunk otherwise. */
const Panel: React.FC<{ cx: number; on: number; label: string; children: React.ReactNode }> = ({ cx, on, label, children }) => (
  <g transform={`translate(${cx},540) scale(${0.94 + 0.06 * on})`} opacity={0.5 + 0.5 * on}>
    <rect x={-290} y={-330} width={580} height={620} rx={26} fill="#C9DCEA" stroke="#0A121C" strokeWidth={8} />
    <rect x={-290} y={120} width={580} height={170} rx={26} fill="#6A6458" /><rect x={-290} y={120} width={580} height={22} fill="#B9B29E" />
    {children}
    <rect x={-290} y={-330} width={580} height={620} rx={26} fill="none" stroke={on > 0.5 ? '#FFE08A' : '#0A121C'} strokeWidth={on > 0.5 ? 12 : 8} />
    <text y={380} textAnchor="middle" fontFamily="'Bricolage Grotesque', sans-serif" fontWeight={800} fontSize={54} fill="#FFFFFF" stroke="#0A121C" strokeWidth={9} paintOrder="stroke" strokeLinejoin="round">{label}</text>
  </g>
);

/** E28 395.89 "Có người vẫy tay, có người lặng lẽ quan sát, có người khép cửa." three reactions, each lit in turn. */
export const E28: React.FC<ShotProps> = ({ t }) => {
  const a = t < 31 ? 1 : 0, b = t >= 31 && t < 70 ? 1 : 0, c = t >= 70 ? 1 : 0;
  return (
    <g>
      <Stage id="e28" tone="night" />
      <Panel cx={330} on={a} label="VẪY TAY">
        <Onlooker x={0} y={130} s={3.2} color="#1A2430" wave={1} t={t} hat />
      </Panel>
      <Panel cx={960} on={b} label="LẶNG LẼ QUAN SÁT">
        <Onlooker x={-90} y={130} s={2.9} color="#1A2430" t={t} lean={-2 + Math.sin(t / 25) * 1.5} />
        <Onlooker x={110} y={132} s={2.6} color="#2A2F3A" t={t} lean={3} />
      </Panel>
      <Panel cx={1590} on={c} label="KHÉP CỬA">
        <ShopFront id="e28s" x={0} y={130} w={420} h={420} shutter={prog(t, 70, 100)} />
      </Panel>
    </g>
  );
};

/** E29 399.40 "Phía trước là đại lộ Thống Nhất," print of the avenue seen from the Dinh balcony (1996: the caption says so). */
export const E29: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="e29" tone="noon" dim={0.1} />
    <PhotoE k="leDuan" id="e29p" t={t} x={960} y={450} w={960} rot={-1} from={0.03} fromSide="right" sepia={0.12} kb={{ z0: 1.0, z1: 1.12, px0: 0.01, py0: 0, px1: -0.02, py1: 0 }} />
    <Tag t={t} at={6} x={960} y={968} text="ĐẠI LỘ THỐNG NHẤT" fill="#2F3E58" size={48} sub="nay là đường Lê Duẩn" subColor="#FFE08A" />
  </g>
);

/** E30 400.99 "và ở cuối con đường là Dinh Độc Lập." plan view: the column drives up Lê Duẩn towards the Dinh; gate CLOSED, RVN flag on the roof. */
export const E30: React.FC<ShotProps> = ({ t }) => {
  const cam = cameraAt([{ t: 0, ...C.downtown, ease: 'linear' }, { t: 2.5, ...C.palaceGrounds, ease: 'linear' }], t / 30);
  const tanks = [0, 1, 2].map((i) => {
    const u = Math.max(0, prog(t, 0, 73) - i * 0.09), p = palaceRoute([[620, 0], [215, 0]], u);
    return { x: p.x, y: p.y, heading: p.heading, kind: 't54' as const, scale: 1.8 };
  });
  return (
    <g>
      <PalacePlan id="e30" camera={cam} t={t} gate={0} flag="RVN" tanks={tanks} labels={['palace', 'gate']} />
      <Plate t={t} at={8} x={960} y={160} text="CUỐI ĐƯỜNG LÊ DUẨN: DINH ĐỘC LẬP" size={56} />
      <SourceLine text={CREDIT_OSM} t={t / 30} />
    </g>
  );
};
