import React from 'react';
import { FONT } from '../engine/fonts';
import { CitadelPlan } from './citadel-plan';
import { cameraOnCitadel, localToScreen } from './citadel-geometry';
import { RiverCrossing } from './ground-river-crossing';
import { ShellBarrage } from './ground-artillery';
import { MonsoonRain, SmokeColumn } from './ground-weather-and-smoke';
import { HoaDang, HoaDangField, Candle, IncenseBundle } from './ground-memorial-props';
import { Ball } from './countryball';
import { MuCoi } from './ball-accessories';
import { Beret, M1Helmet, NavyCap } from './ball-accessories-military';
import { breathe } from './ball-motion';
import { Label } from './fx-demo-sections-balls';
import { Flare } from './fx-tracers-and-lights';

// QuangTriKitDemo sections 6 and 8 (t = local frame): the night crossing of the Thạch Hãn under flares, rain and shells;
// then the memorial scene (hoa đăng on the river, candle, incense) with the new ball accessories.

const CAM_CROSS = cameraOnCitadel(-340, 10, 1.15);
export const RiverNightSection: React.FC<{ t: number }> = ({ t }) => {
  const a = localToScreen(CAM_CROSS, -720, 40), b = localToScreen(CAM_CROSS, -400, -10);
  return (
    <g>
      <CitadelPlan id="rn" camera={CAM_CROSS} t={t} damage={0.55} night={0.9} fires={0.7} flood={0.4} labels={false} />
      <SmokeColumn t={t} x={localToScreen(CAM_CROSS, -60, -40)[0]} y={localToScreen(CAM_CROSS, -60, -40)[1]} h={420} w={44} fire lean={0.5} />
      <RiverCrossing id="rc" t={t} t0={10} t1={120} from={a} to={b} n={5} size={44} spacing={62} drift={50}
        flares={[{ t0: 4, x: a[0] + 90, y: a[1] - 330 }, { t0: 70, x: a[0] + 160, y: a[1] - 360 }]} splashes={7} />
      <ShellBarrage id="sb" t={t} t0={30} from={[2100, 120]} to={[a[0] + 160, a[1] - 20]} n={10} span={80} spread={[150, 90]} dur={40} lift={170} water r={30} />
      <Flare t={t} t0={40} x={a[0] + 240} y={a[1] - 300} r={130} life={180} />
      <MonsoonRain t={t} intensity={0.65} angle={12} />
      <Label x={60} y={70} text="ĐÊM VƯỢT SÔNG THẠCH HÃN: thuyền, pháo sáng, đạn rơi xuống nước, mưa" size={26} color="#FFD166" anchor="start" />
    </g>
  );
};

const BALLS: { f: string; hat: React.ReactNode; name: string; e: 'determined' | 'sad' | 'worried' | 'normal' }[] = [
  { f: 'VNM', hat: <MuCoi camo />, name: 'mũ cối + lá nguỵ trang', e: 'determined' }, { f: 'RVN', hat: <M1Helmet />, name: 'M1 (VNCH)', e: 'worried' },
  { f: 'RVN', hat: <Beret color="#B3262B" badge="wings" />, name: 'mũ đỏ Dù', e: 'determined' }, { f: 'RVN', hat: <Beret color="#2F6B3A" badge="anchor" />, name: 'mũ xanh TQLC', e: 'determined' },
  { f: 'USA', hat: <NavyCap />, name: 'mũ sĩ quan Hải quân', e: 'normal' }, { f: 'USA', hat: <NavyCap style="dixie" />, name: 'mũ thủy thủ', e: 'worried' }, { f: 'USA', hat: <M1Helmet color="#58663C" />, name: 'M1 (Mỹ)', e: 'sad' },
];
const CAM_MEM = cameraOnCitadel(-330, 120, 1.0);
export const MemorialSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <CitadelPlan id="mm" camera={CAM_MEM} t={t} night={0.88} memorial labels={['citadel', 'river']} />
    <rect width={1920} height={1080} fill="#050B1F" opacity={0.18} />
    <HoaDangField id="hd" t={t} t0={0} points={[[120, 100], [300, 380], [420, 640], [300, 900]]} n={9} size={56} speed={5} every={11} />
    <HoaDang x={640} y={700} s={80} t={t} color="white" ph={5} />
    <Candle x={1560} y={760} s={120} t={t} /><Candle x={1650} y={780} s={96} t={t} seed={3} />
    <IncenseBundle x={1760} y={790} s={140} t={t} n={3} />
    {BALLS.map((b, i) => (
      <g key={i}>
        <Ball id={`mb${i}`} x={170 + i * 262} y={920} r={78} flag={b.f} eyes={b.e} hat={b.hat} motion={breathe(t, 70, 0.03, i * 9)} t={t} />
        <text x={170 + i * 262} y={1045} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#E6EEF7" stroke="#050B1F" strokeWidth={5} paintOrder="stroke">{b.name}</text>
      </g>
    ))}
    <Label x={60} y={70} text="TƯỞNG NIỆM: hoa đăng, nến, hương + phụ kiện mới (M1, mũ nồi, mũ Hải quân, mũ cối nguỵ trang)" size={26} color="#FFD166" anchor="start" />
  </g>
);
