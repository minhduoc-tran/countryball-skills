import React from 'react';
import { FONT } from '../engine/fonts';
import { CameraKey, cameraAt } from './geo-camera';
import { CitadelPlan, CitadelPlanInMap } from './citadel-plan';
import { cameraOnCitadel } from './citadel-geometry';
import { CAMERAS } from './quang-tri-camera-keys';
import { GeoMap } from './map-geo-map';
import { QuangTriSites } from './quang-tri-map-labels';
import { prog } from './fx-math';

// QuangTriKitDemo sections 2-3 (t = local frame): the zoom from the map into the citadel plan, then 4 damage states.

const KEYS: CameraKey[] = [
  { t: 0, ...CAMERAS.town }, { t: 1, ...CAMERAS.town },
  { t: 3, ...CAMERAS.citadel }, { t: 4.2, ...CAMERAS.citadel },
  { t: 6, ...cameraOnCitadel(240, 0, 4.2) }, { t: 7, ...cameraOnCitadel(240, 0, 4.2) },
];

export const CitadelZoomSection: React.FC<{ t: number }> = ({ t }) => {
  const sec = t / 30, cam = cameraAt(KEYS, sec), standalone = cam.zoom > 60000;
  return (
    <g>
      {!standalone && (
        <GeoMap camera={cam} id="czm" provinces provinceColors={{ 'Quảng Trị': '#C9684F' }}>
          <CitadelPlanInMap labels={['citadel', 'river', 'bridge']} />
          <QuangTriSites only={['quangTri', 'aiTu', 'trieuPhong']} />
        </GeoMap>
      )}
      {standalone && <CitadelPlan id="cz" camera={cam} labels={['citadel', 'gates', 'moat', 'river', 'bridge']} />}
    </g>
  );
};

const PANELS = [
  { damage: 0, night: 0, flood: 0, t: 'NGUYÊN VẸN' }, { damage: 0.45, night: 0, flood: 0, t: 'HƯ HẠI 0,45' },
  { damage: 0.8, night: 0.85, flood: 0, t: 'ĐÊM, HƯ HẠI 0,8, CHÁY' }, { damage: 1, night: 0, flood: 1, t: 'ĐỔ NÁT, LŨ' },
];
export const CitadelStatesSection: React.FC<{ t: number }> = ({ t }) => {
  const cam = cameraOnCitadel(0, 0, 0.9);
  return (
    <g>
      {PANELS.map((p, i) => {
        const x = (i % 2) * 960, y = Math.floor(i / 2) * 540;
        return (
          <g key={i} transform={`translate(${x},${y}) scale(0.5)`} clipPath={`url(#cs-clip)`}>
            <CitadelPlan id={`cs${i}`} camera={cam} t={t} damage={prog(t, 0, 20) * p.damage} night={p.night} flood={p.flood} fires={p.night > 0 ? 1 : 0} />
            <text x={30} y={1030} fontFamily={FONT.ui} fontSize={40} fill="#FFF" stroke="#000" strokeWidth={7} paintOrder="stroke">{p.t}</text>
          </g>
        );
      })}
      <defs><clipPath id="cs-clip"><rect width={1920} height={1080} /></clipPath></defs>
      <path d="M960,0V1080M0,540H1920" stroke="#0E1D2E" strokeWidth={6} />
    </g>
  );
};
