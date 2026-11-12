import React from 'react';
import { ShotProps } from '../../engine';
import { B52Shootdown } from '../../countryball/fx-b52-hit';
import { FlakBurst, SamLaunch, SamSite } from '../../countryball/fx-sam-and-flak';
import { AaGun, AaTracers } from '../../countryball/fx-tracers-and-lights';
import { prog } from '../../countryball/fx-math';
import { LowerThird } from '../../countryball/hud-chips';
import { PhotoCard } from '../../countryball/photo-card';
import { Banner, FMap, OutText, ramp } from './chf-map-scene';
import { LakeInset } from './chf-lake-inset';

// Chapter F, F16-F20: the B-52 that fell inside the city on 27.12 and the wreck in Hữu Tiệp lake that is still there.
// The lake is drawn as a schematic magnifier (not to scale). t = frames (30 fps).

const DATE = '27.12.1972', NIGHT = 'ĐÊM 10/12';
const BA_DINH: [number, number] = [105.835, 21.035];

// F16: SAM + flak, a B-52 falls right over the city centre
export const F16: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f16" night={0.85} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: 105.82, lat: 21.03, zoom: 560 }, { t: 4.8, lon: 105.84, lat: 21.03, zoom: 680, ease: 'linear' }]}
    top={({ s }) => <LowerThird title="Hà Nội, đêm 27.12.1972" sub="Một B-52 rơi ngay giữa nội thành" from={3.7} t={s} />}>
    {({ P }) => {
      const [ax, ay] = P(105.84, 21.03);
      const hit: [number, number] = [ax - 10, ay - 20];
      return (
        <g>
          <SamSite x={ax + 420} y={ay + 230} r={42} />
          <SamSite x={ax - 460} y={ay + 250} r={42} />
          <AaGun x={ax + 170} y={ay + 300} aim={-120} s={1.3} />
          <AaTracers id="f16a" t={t} x={ax + 170} y={ay + 285} aim={-120} reach={560} seed={5} />
          <SamLaunch id="f16s1" t={t} t0={16} from={[ax + 420, ay + 230]} to={hit} dur={28} bend={0.07} />
          <SamLaunch id="f16s2" t={t} t0={22} from={[ax - 460, ay + 250]} to={hit} dur={22} bend={-0.06} />
          <FlakBurst id="f16b0" t={t} t0={12} x={ax - 280} y={ay - 190} r={50} />
          <FlakBurst id="f16b1" t={t} t0={24} x={ax + 130} y={ay - 140} r={52} />
          <B52Shootdown id="f16" t={t} t0={44} at={hit} heading={35} size={132} speed={5} fallDur={70} spin={0.9} />
        </g>
      );
    }}
  </FMap>
);

// F17: zoom to Ba Đình, wreck falls into Hữu Tiệp lake
export const F17: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f17" night={0.85} veil={0.35} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: BA_DINH[0], lat: BA_DINH[1], zoom: 700 }, { t: 2, lon: BA_DINH[0], lat: BA_DINH[1], zoom: 950, ease: 'linear' }]}
    top={() => <LakeInset id="f17l" t={t} cx={960} cy={540} r={360} day={0} wreck={40} grow={prog(t, 0, 16)} />} />
);

// F18: a small residential block of Ba Đình round the lake
export const F18: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f18" night={0.85} veil={0.35} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: BA_DINH[0], lat: BA_DINH[1], zoom: 950 }, { t: 2.4, lon: BA_DINH[0], lat: BA_DINH[1], zoom: 1000, ease: 'linear' }]}
    top={({ s }) => (
      <g>
        <LakeInset id="f18l" t={t} cx={960} cy={520} r={370 + t * 0.3} day={0} wreck={-1} />
        <Banner s={s} from={0.2} to={2.3} text="KHU DÂN CƯ NHỎ · QUẬN BA ĐÌNH" size={50} y={950} />
      </g>
    )} />
);

// F19: more than fifty years later: the same lake in daylight
export const F19: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f19" night={0.85 - 0.85 * ramp(t, 4, 30)} veil={0.3} date="NGÀY NAY" keys={[{ t: 0, lon: BA_DINH[0], lat: BA_DINH[1], zoom: 1000 }, { t: 1.9, lon: BA_DINH[0], lat: BA_DINH[1], zoom: 900, ease: 'linear' }]}
    top={() => (
      <g>
        <LakeInset id="f19l" t={t} cx={960} cy={520} r={380} day={ramp(t, 4, 30)} wreck={-1} />
        <OutText x={960} y={985} text="HƠN 50 NĂM" size={96} color="#FFD166" opacity={ramp(t, 4, 14)} />
      </g>
    )} />
);

// F20: the real photo of the wreck in the lake
export const F20: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f20" night={0} veil={0.5} date="NGÀY NAY" keys={[{ t: 0, lon: BA_DINH[0], lat: BA_DINH[1], zoom: 900 }, { t: 2.3, lon: BA_DINH[0], lat: BA_DINH[1], zoom: 800, ease: 'linear' }]}
    top={({ s }) => (
      <PhotoCard id="f20p" src="dien-bien-phu-tren-khong/img/b52-wreck-huu-tiep-lake.jpg" caption="Xác B-52 giữa hồ Hữu Tiệp, Hà Nội" credit="Ảnh: calflier001 / CC BY-SA 2.0"
        x={960} y={510} w={800} h={600} rot={-1.5} from={0} to={2.6} t={s} fromSide="bottom" kb={{ z0: 1.0, z1: 2.2, px0: 0, py0: 0, px1: -0.066, py1: -0.075 }} />
    )} />
);
