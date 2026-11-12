import React from 'react';
import { CAMERAS } from './quang-tri-camera-keys';
import { CameraKey, cameraAt } from './geo-camera';
import { GeoMap } from './map-geo-map';
import { City, CITIES } from './map-labels';
import { DmzBand, OSM_ATTRIBUTION, QuangTriLabels, QuangTriSites } from './quang-tri-map-labels';
import { DateChip } from './hud-date-chip';
import { SourceLine } from './hud-chips';

// QuangTriKitDemo section 1 (t = local frame, 30 fps): the zoom from all of Vietnam down to Quảng Trị town.

const KEYS: CameraKey[] = [
  { t: 0, ...CAMERAS.vietnam }, { t: 1, ...CAMERAS.vietnam },
  { t: 3, ...CAMERAS.binhTriThien }, { t: 4, ...CAMERAS.binhTriThien },
  { t: 6, ...CAMERAS.quangTriProvince }, { t: 7, ...CAMERAS.quangTriProvince },
  { t: 9, ...CAMERAS.triThienFront }, { t: 10, ...CAMERAS.triThienFront },
  { t: 12, ...CAMERAS.town }, { t: 13, ...CAMERAS.town },
];

export const MapSection: React.FC<{ t: number }> = ({ t }) => {
  const sec = t / 30, camera = cameraAt(KEYS, sec);
  const z = camera.zoom;
  return (
    <g>
      <GeoMap camera={camera} provinces highlight={z > 250 && z < 2000 ? ['Quảng Trị'] : []} id="mapqt"
        provinceColors={{ 'Quảng Trị': '#D2654B', 'Quảng Bình': '#B84A36', 'Thừa Thiên-Huế': '#C25E45', 'Quảng Nam - Đà Nẵng': '#B9503C' }}>
        <DmzBand />
        <QuangTriLabels />
        <City {...CITIES.danang} minZoom={40} maxZoom={600} />
        <City {...CITIES.vinh} minZoom={40} maxZoom={600} />
        <City {...CITIES.hanoi} maxZoom={300} />
        <QuangTriSites />
      </GeoMap>
      <DateChip label="28.6.1972" t={sec} />
      <SourceLine text={`${OSM_ATTRIBUTION}; Natural Earth (public domain)`} t={sec} />
    </g>
  );
};
