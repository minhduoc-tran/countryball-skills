import React from 'react';
import { CameraKey, cameraAt } from './geo-camera';
import { SAIGON_CAMERAS as C } from './sai-gon-camera-keys';
import { GeoMap } from './map-geo-map';
import { City, CITIES } from './map-labels';
import { MapFlag } from './flag-cloth';
import { PalacePlanInMap } from './palace-plan';
import { CampaignArrows } from './sai-gon-campaign-arrows';
import { SAIGON_ATTRIBUTION, SaigonLabels, SaigonSites } from './sai-gon-map-labels';
import { ClockChip } from './hud-clock-chip';
import { SourceLine } from './hud-chips';

// SaigonKitDemo section 1 (t = local frame, 30 fps): Vietnam -> Nam Bộ -> the five arrows of the Hồ Chí Minh campaign around Sài Gòn -> the
// city -> the plan of Dinh Độc Lập fading in (PalacePlanInMap). The ClockChip gets its times as data.

const KEYS: CameraKey[] = [
  { t: 0, ...C.vietnam }, { t: 1, ...C.vietnam }, { t: 3, ...C.southEast }, { t: 4, ...C.southEast },
  { t: 6, ...C.saigonRegion }, { t: 11.5, ...C.saigonRegion }, { t: 13.5, ...C.city }, { t: 14.2, ...C.city }, { t: 16, ...C.downtown }, { t: 17, ...C.downtown },
];
export const MAP_SECTION_FRAMES = 540;

export const MapSection: React.FC<{ t: number }> = ({ t }) => {
  const sec = t / 30, camera = cameraAt(KEYS, sec);
  const arrows = camera.zoom > 1200 && camera.zoom < 3500;
  return (
    <g>
      <GeoMap camera={camera} id="mapsg" colors={{ VNM: '#9B4C3A' }}>
        <City {...CITIES.saigon} maxZoom={1000} />
        <City {...CITIES.danang} minZoom={30} maxZoom={200} />
        {arrows && <CampaignArrows t={t} t0={6.8 * 30} />}
        <SaigonLabels />
        <SaigonSites />
        <PalacePlanInMap t={t} labels={['palace', 'streets', 'church']} />
        <MapFlag lon={106.6953} lat={10.7769} kind={sec > 15 ? 'PRG' : 'RVN'} minZoom={9000} t={t} id="mfd" size={70} />
      </GeoMap>
      <ClockChip date="30.04.1975" clock={[{ t: 0, time: '04:30' }, { t: 17, time: '10:45' }]} t={sec} />
      <SourceLine text={`${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`} t={sec} />
    </g>
  );
};
