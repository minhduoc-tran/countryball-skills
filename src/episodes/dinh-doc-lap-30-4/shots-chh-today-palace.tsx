import React from 'react';
import { ShotProps } from '../../engine';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { GeoMap } from '../../countryball/map-geo-map';
import { MapFlag } from '../../countryball/flag-cloth';
import { SaigonLabels, SaigonSites } from '../../countryball/sai-gon-map-labels';
import { PalacePlanInMap } from '../../countryball/palace-plan';
import { cameraAt } from '../../countryball/geo-camera';
import { MiniMap } from '../../countryball/hud-minimap';
import { LowerThird, SourceLine } from '../../countryball/hud-chips';
import { star } from '../../countryball/ball-flags';
import { Glow } from '../../countryball/fx-glow';
import { Drift, Slam, Veil } from './cha-common';
import { Cap, CREDIT_OSM, GoldPlaque, Photo, Stage, Tag, TodayFacade, prog } from './chh-common';

// Chapter H, part 1 (9:33-9:47, beat "12 today palace"): H1 ngày nay (2019 print), H2 giữa trung tâm thành phố (today's map, normal red VNM, national
// flag on the Dinh), H3 gần như còn nguyên (façade like chapter A, VNM flag), H4 + H5 "2009" di tích quốc gia đặc biệt, H6 the roof print (08.04.1975 marks).
// Sound: paper_land when prints land. No RVN ball anywhere in this chapter (today).

/** H1 "Ngày nay, Dinh Độc Lập vẫn đứng đó," the 2019 front view as a print. */
export const H1: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="h1" tone="dusk" />
    <Photo k="front" t={t} x={960} y={545} w={1200} rot={-1.2} from={0.05} fromSide="bottom" kb={{ z0: 1.0, z1: 1.1, px0: 0.01, py0: 0, px1: -0.015, py1: 0 }} />
    <Tag t={t} at={14} x={330} y={230} text="NGÀY NAY" fill="#2F6B4A" size={52} />
  </g>
);

/** H2 "giữa trung tâm thành phố," today's map: ordinary red VNM land, the national flag planted on the Dinh. */
export const H2: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, cam = cameraAt([{ t: 0, ...C.city, zoom: 9000, ease: 'linear' }, { t: 1.4, ...C.city, zoom: 14000, ease: 'linear' }], s);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1D2E" />
      <GeoMap camera={cam} rivers id="h2">
        <SaigonLabels />
        <SaigonSites only={['dinhDocLap', 'boQuocPhong', 'tanSonNhat', 'cauSaiGon', 'hangXanh']} />
        <PalacePlanInMap t={t} labels={['palace']} />
        <MapFlag lon={106.6953} lat={10.7769} kind="VNM" minZoom={9000} t={t} id="h2f" size={70} />
      </GeoMap>
      <LowerThird title="Thành phố Hồ Chí Minh" sub="Dinh Độc Lập, ngày nay" from={0.1} t={s} accent="#2F6B4A" />
      <MiniMap camera={cam} id="h2-mini" />
      <SourceLine text={CREDIT_OSM} t={s} />
    </g>
  );
};

/** H3 "gần như còn nguyên như năm xưa." the façade as in chapter A, but the national flag flies on the roof. */
export const H3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1} z1={1.08} cx={960} cy={900}>
      <TodayFacade id="h3" x={960} y={960} w={1500} tone="day" t={t} />
    </Drift>
    <Veil id="h3" o={0.3} />
    <Cap t={t} at={8} x={960} y={1030} text="GẦN NHƯ CÒN NGUYÊN" size={92} />
  </g>
);

/** H4 "Năm 2009," the night print + a big year. */
export const H4: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="h4" tone="night" />
    <Photo k="night" t={t} x={900} y={520} w={1260} rot={1.2} from={0.05} fromSide="left" kb={{ z0: 1.0, z1: 1.1, px0: 0.01, py0: 0.01, px1: -0.01, py1: -0.01 }} />
    <Slam t={t} a={16} x={1520} y={930} size={250} rot={-4}>2009</Slam>
  </g>
);

/** H5 "nơi đây được xếp hạng di tích quốc gia đặc biệt." a gold plaque with a star over the lit façade. */
export const H5: React.FC<ShotProps> = ({ t, len }) => {
  const k = prog(t, 4, 24), pulse = 0.5 + 0.5 * Math.sin(t / 10);
  return (
    <g>
      <Drift t={t} len={len} z0={1.05} z1={1.12} cx={960} cy={900}>
        <TodayFacade id="h5" x={960} y={990} w={1500} tone="night" t={t} windows={0.8} />
      </Drift>
      <rect width={1920} height={1080} fill="#050A14" opacity={0.45} />
      <Glow x={960} y={455} r={300} color="#FFD27A" o={0.25 + 0.12 * pulse} />
      <g transform={`translate(960,455) scale(${0.4 + 0.6 * k})`} opacity={k}>
        <circle r={100} fill="#C9343A" stroke="#E2B95A" strokeWidth={10} />
        <circle r={92} fill="none" stroke="#E2B95A" strokeWidth={3} opacity={0.8} />
        <polygon points={star(0, 0, 70)} fill="#FFD43B" stroke="#1B1B1E" strokeWidth={4} strokeLinejoin="round" />
      </g>
      <GoldPlaque t={t} a={10} x={960} y={760} w={1260} lines={[{ text: 'DI TÍCH QUỐC GIA', size: 84 }, { text: 'ĐẶC BIỆT', size: 108, fill: '#FFD27A' }, { text: '2009', size: 84, fill: '#E2B95A' }]} />
    </g>
  );
};

/** H6 "Trên nóc Dinh vẫn còn dấu vết của những quả bom ngày 08.04." the roof print; the red circles mark where the bombs fell. */
export const H6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="h6" tone="navy" />
    <Photo k="roof" t={t} x={960} y={540} w={1260} rot={-1} from={0.05} fromSide="bottom" kb={{ z0: 1.0, z1: 1.18, px0: 0, py0: 0.02, px1: 0.01, py1: -0.1 }} />
    <Tag t={t} at={50} x={330} y={200} text="08.04.1975" fill="#B5573B" size={58} />
  </g>
);
