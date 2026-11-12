import React from 'react';
import { Camera } from './geo-camera';
import { GeoMap } from './map-geo-map';
import { ArtilleryBattery, ShellBarrage } from './ground-artillery';
import { NavalBombardment } from './ground-naval-gunfire';
import { TankColumn } from './ground-tanks';
import { HeliWave } from './ground-helicopters';
import { FrontArrow, SIDE_COLORS, TrenchLine, UnitBox } from './ground-front-arrows';
import { CraterField } from './ground-weather-and-smoke';
import { Label } from './fx-demo-sections-balls';

// QuangTriKitDemo sections 4-5 (t = local frame): fire support (battery, ship, barrage) and movement (tanks, helicopters,
// front arrows, trenches, unit boxes), over the coast between Cửa Việt and Quảng Trị (sea to the upper right).

const BACK: Camera = { lon: 107.2, lat: 16.88, zoom: 2900 };
const Back: React.FC<{ id: string }> = ({ id }) => <GeoMap camera={BACK} id={id} labels={false} provinces rivers />;

export const FireSupportSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Back id="fs" />
    <Label x={60} y={70} text="PHÁO BINH, HẠM ĐỘI, ĐẠN RƠI: pháo + tàu bắn vào bờ" size={28} color="#FFD166" anchor="start" />
    <ArtilleryBattery id="bat" t={t} t0={4} x={330} y={820} aim={-35} n={4} gap={92} period={46} s={84} />
    <NavalBombardment id="nav" t={t} t0={14} ship={{ x: 1560, y: 250, heading: 200, size: 340, kind: 'cruiser' }} target={[1020, 640]} every={70} flight={60} lift={240} spread={120} r={36} />
    <NavalBombardment id="nav2" t={t} t0={40} ship={{ x: 1650, y: 470, heading: 190, size: 200, kind: 'destroyer' }} target={[1150, 760]} every={60} flight={56} lift={180} spread={90} r={30} seed={4} />
    <ShellBarrage id="inc" t={t} t0={20} from={[-300, 80]} to={[560, 540]} n={14} span={100} spread={[120, 80]} dur={52} lift={200} r={30} />
    <CraterField id="cr" t={t} t0={10} t1={140} x={620} y={560} w={380} h={240} n={34} />
    <Label x={420} y={960} text="Pháo: chớp nòng + khói + giật" size={22} />
    <Label x={1500} y={640} text="Tàu tuần dương và khu trục bắn vào bờ" size={22} />
    <Label x={560} y={420} text="Đạn pháo vạch cung bay tới từ ngoài màn hình" size={22} />
  </g>
);

const ROAD: [number, number][] = [[60, 400], [420, 580], [760, 710], [1100, 890], [1500, 1050]];
export const MovementSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Back id="mv" />
    <Label x={60} y={70} text="XE TĂNG (T-54 đỏ / M48), TRỰC THĂNG, MŨI TÊN, HÀO, ĐƠN VỊ" size={28} color="#FFD166" anchor="start" />
    <path d={ROAD.map((p, i) => `${i ? 'L' : 'M'}${p.join(',')}`).join('')} stroke="#D9CDA8" strokeWidth={9} fill="none" strokeDasharray="22 10" opacity={0.7} />
    <TrenchLine id="tr" t={t} t0={4} points={[[1000, 960], [1120, 840], [1180, 700], [1260, 600]]} style="zigzag" />
    <TrenchLine id="fl" t={t} t0={10} points={[[420, 330], [600, 400], [820, 380]]} style="triangles" color={SIDE_COLORS.rvn} side={1} />
    <FrontArrow id="a1" t={t} t0={6} points={[[120, 880], [420, 760], [720, 660], [900, 540]]} width={50} color={SIDE_COLORS.vnm} label="QĐND" />
    <FrontArrow id="a2" t={t} t0={30} points={[[1050, 980], [1000, 900], [940, 760]]} width={40} color={SIDE_COLORS.rvn} label="VNCH" labelSize={24} />
    <FrontArrow id="a3" t={t} t0={50} points={[[1800, 150], [1500, 330], [1300, 420]]} width={36} color={SIDE_COLORS.usa} label="Mỹ" labelSize={24} />
    <TankColumn id="t54" t={t} t0={2} t1={110} points={ROAD} n={3} gap={110} size={70} kind="t54" fireEvery={50} />
    <TankColumn id="m48" t={t} t0={14} t1={118} points={[[1800, 1000], [1400, 900], [1200, 800]].map(([x, y]) => [x, y] as [number, number])} n={2} gap={110} size={70} kind="m48" fireEvery={60} />
    <HeliWave id="hw" t={t} kind="uh1" size={80} flights={[
      { points: [[-100, 240], [400, 250], [800, 460]], t0: 0, t1: 70, land: true, troops: [900, 540] },
      { points: [[-120, 330], [380, 300], [760, 520]], t0: 14, t1: 84, land: true, troops: [820, 580] },
    ]} />
    <HeliWave id="hc" t={t} kind="ch53" size={140} flights={[{ points: [[-200, 120], [500, 180], [900, 330]], t0: 24, t1: 100 }]} />
    <UnitBox x={1700} y={900} kind="arm" color={SIDE_COLORS.vnm} label="203" />
    <UnitBox x={1500} y={760} kind="mar" color={SIDE_COLORS.rvn} label="TQLC" />
    <UnitBox x={1790} y={760} kind="art" color={SIDE_COLORS.usa} label="Hạm đội 7" />
  </g>
);
