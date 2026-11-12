import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { CameraKey, cameraAt } from './geo-camera';
import { Counter } from './hud-counter';
import { DateChip } from './hud-date-chip';
import { LowerThird, NightChip, SourceLine } from './hud-chips';
import { MiniMap } from './hud-minimap';
import { GeoMap } from './map-geo-map';
import { CITIES, City, HANOI_SITES } from './map-labels';
import { AirRaidPulse } from './map-night-overlay';
import { PhotoCard } from './photo-card';

// Demo of the map kit (20 s): world -> Pacific (Guam, U-Tapao) -> North Vietnam (province + river detail) ->
// zoom to Hà Nội at night with air-raid pulse, changing date, counting counter and a photo card.
// Copy this file as the pattern for a real map scene: keys -> cameraAt(t) -> <GeoMap> + HUD.

const KEYS: CameraKey[] = [
  { t: 0, lon: 62, lat: 28, zoom: 9 },
  { t: 3, lon: 62, lat: 28, zoom: 9 },
  { t: 6.5, lon: 123, lat: 13, zoom: 22 },
  { t: 9, lon: 123, lat: 13, zoom: 22 },
  { t: 12, lon: 105.8, lat: 19.9, zoom: 150 },
  { t: 13, lon: 105.8, lat: 19.9, zoom: 150 },
  { t: 17, lon: 105.86, lat: 21.05, zoom: 900 },
  { t: 20, lon: 105.9, lat: 21.06, zoom: 1000, ease: 'linear' },
];
const PHOTO = 'dien-bien-phu-tren-khong/img/andersen-afb-150-b52s-1972.jpg';
const ramp = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));

export const MapKitDemo: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const camera = cameraAt(KEYS, t);
  const night = ramp(t, 9, 12.5);
  const lights = 1 - ramp(t, 17.2, 17.8) * 0.92;      // Hà Nội blackout
  const highlight = t < 9 ? ['USA', 'VNM'] : t < 14 ? ['VNM'] : ['Hà Nội'];
  return (
    <AbsoluteFill style={{ background: '#0E1D2E' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <GeoMap camera={camera} night={night} highlight={highlight} provinces provinceColors={{ 'Hà Nội': '#D9694F', 'Hải Phòng': '#B84A36' }}
          parallel={t > 8 && t < 16 ? 20 : false}>
          <City {...CITIES.washington} maxZoom={30} /><City {...CITIES.paris} maxZoom={30} />
          <City {...CITIES.moskva} maxZoom={30} /><City {...CITIES.bacKinh} maxZoom={30} />
          <City {...CITIES.guam} minZoom={14} maxZoom={140} /><City {...CITIES.utapao} minZoom={14} maxZoom={140} />
          <City {...CITIES.saigon} minZoom={40} /><City {...CITIES.danang} minZoom={70} /><City {...CITIES.vinh} minZoom={70} />
          <City {...CITIES.haiphong} minZoom={90} />
          <City {...CITIES.hanoi} lights={lights} showLabel={camera.zoom < 500} />
          {Object.values(HANOI_SITES).map((s) => <City key={s.name} {...s} lights={lights} minZoom={600} size={24} />)}
        </GeoMap>
        <AirRaidPulse t={t} level={ramp(t, 14.5, 15.5) * (t < 17.5 ? 0.8 : 0.25)} />
        <DateChip dates={[{ t: 0, label: '11.12.1972' }, { t: 7, label: '18.12.1972' }, { t: 13.5, label: '26.12.1972' }]} t={t} />
        <NightChip label={t < 15.5 ? 'ĐÊM 1/12' : 'ĐÊM 8/12'} since={15.5} from={9.5} t={t} />
        <Counter label="B-52 BỊ BẮN RƠI" steps={[{ t: 9, value: 0 }, { t: 11, value: 0 }, { t: 15, value: 15 }, { t: 18, value: 34 }]} t={t} />
        <LowerThird title="Guam (Andersen) và U-Tapao" sub="Nơi B-52 cất cánh" from={4} to={8.5} t={t} />
        <LowerThird title="Hà Nội, đêm 18.12.1972" sub="Theo phía Mỹ: mục tiêu quân sự" from={13.5} to={20} t={t} />
        <SourceLine text="Nguồn: USAF; Natural Earth (public domain)" t={t} />
        <PhotoCard src={PHOTO} caption="B-52 xếp hàng ở Andersen, Guam, 1972" x={1390} y={460} rot={-3.5} from={14.5} to={19.6} t={t} sepia={0.25} />
        <MiniMap camera={camera} />
      </svg>
    </AbsoluteFill>
  );
};
