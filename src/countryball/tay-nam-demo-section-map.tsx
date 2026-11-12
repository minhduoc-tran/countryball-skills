import React from 'react';
import { CameraKey, cameraAt } from './geo-camera';
import { GeoMap } from './map-geo-map';
import { MapFlag } from './flag-cloth';
import { TAY_NAM_CAMERAS as C, TAY_NAM_COLORS, TAY_NAM_COLORS_PEACE } from './tay-nam-camera-keys';
import { BorderRun, MapArrow, TayNamLabels, TayNamSites } from './tay-nam-map-labels';
import { TAY_NAM_ATTRIBUTION } from './geo-tay-nam-sites';
import { DateChip } from './hud-date-chip';
import { LowerThird, SourceLine } from './hud-chips';
import { MiniMap } from './hud-minimap';

// TayNamKitDemo section 1 (t = local frame, 30 fps, 1080x1920): Asia -> Indochina -> Cambodia + Nam Bộ -> An Giang border (border run, the
// Khmer Rouge raid arrow in maroon toward Ba Chúc, VN counter-attack in red) -> Tây Ninh -> the January 1979 arrows on Phnôm Pênh -> the city
// with the PRK flag. Every camera key is portrait (TAY_NAM_CAMERAS carry w/h 1080x1920), so GeoMap needs no screen prop.
export const MAP_SECTION_FRAMES = 660;
const KEYS: CameraKey[] = [
  { t: 0, ...C.asia }, { t: 0.8, ...C.asia }, { t: 2.6, ...C.indochina }, { t: 3.4, ...C.indochina }, { t: 5.2, ...C.southVietnamAndCambodia },
  { t: 6.4, ...C.southVietnamAndCambodia }, { t: 8.2, ...C.borderAnGiang }, { t: 11.2, ...C.borderAnGiang }, { t: 12.6, ...C.borderTayNinh },
  { t: 13.6, ...C.borderTayNinh }, { t: 15, ...C.phnomPenhRegion }, { t: 18.6, ...C.phnomPenhRegion }, { t: 20.2, ...C.phnomPenh },
];

export const MapSection: React.FC<{ t: number }> = ({ t }) => {
  const s = t / 30, cam = cameraAt(KEYS, s), peace = s > 19;
  return (
    <g>
      <GeoMap camera={cam} tayNam colors={peace ? TAY_NAM_COLORS_PEACE : TAY_NAM_COLORS} provinces={cam.zoom > 300} id="tnmap">
        <TayNamLabels />
        {s > 7.5 && s < 12.4 && <BorderRun t={t} t0={7.8 * 30} label="BIÊN GIỚI" />}
        {s > 8.6 && s < 12.4 && <MapArrow id="kr1" t={t} t0={8.8 * 30} side="kr" points={[[104.78, 10.72], [104.84, 10.6], [104.9, 10.5]]} label="Khơ Me Đỏ" dur={40} />}
        {s > 9.8 && s < 12.4 && <MapArrow id="vn1" t={t} t0={10 * 30} side="vn" points={[[105.05, 10.4], [104.95, 10.48], [104.86, 10.58], [104.8, 10.7]]} dur={40} />}
        {s > 15.2 && <>
          <MapArrow id="j1" t={t} t0={15.4 * 30} side="vn" points={[[106.1, 11.3], [105.85, 11.32], [105.5, 11.3], [105.28, 11.27], [105.1, 11.45], [105.0, 11.52]]} label="7.1.1979" />
          <MapArrow id="j2" t={t} t0={15.8 * 30} side="vn" points={[[105.05, 10.65], [104.85, 10.9], [104.82, 11.2], [104.88, 11.46]]} />
          <MapArrow id="j3" t={t} t0={16.2 * 30} side="front" points={[[106.4, 12.07], [105.9, 11.98], [105.46, 11.99], [105.15, 11.78], [105.0, 11.64]]} />
        </>}
        <TayNamSites />
        <MapFlag lon={104.916} lat={11.562} kind="PRK" minZoom={1500} t={t} id="tnflag" size={110} />
      </GeoMap>
      <DateChip dates={[{ t: 0, label: '17.04.1975' }, { t: 7.8, label: '18.04.1978' }, { t: 15, label: '07.01.1979' }]} t={s} id="tndate" />
      <MiniMap camera={cam} id="tnmini" />
      <LowerThird title={s < 12.4 ? 'Ba Chúc, An Giang' : 'Phnôm Pênh'} sub={s < 12.4 ? 'Theo phía Việt Nam (ước tính)' : 'Giải phóng 7.1.1979'} from={s < 12.4 ? 8.4 : 16} to={s < 12.4 ? 12.2 : 30} t={s} />
      <SourceLine text={TAY_NAM_ATTRIBUTION} t={s} />
    </g>
  );
};
