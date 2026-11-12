import React from 'react';
import { clamp, Pt } from './fx-math';
import { FrontArrow, SIDE_COLORS } from './ground-front-arrows';
import { useGeo } from './map-context';

// The five directions of Chiến dịch Hồ Chí Minh (26-30.4.1975) as arrows that GROW on the Sài Gòn map (children of <GeoMap>):
//   <CampaignArrows t t0 gap? dur? only? widthScale? labels? />   t in FRAMES (30 fps); arrow i starts at t0 + i * gap frames (gap default 18)
//   CAMPAIGN_ARROWS                                                data: name, unit label, lon/lat points (approximate), target site
// Routes are APPROXIMATE (hand-laid along the real roads: checked visually against the OSM roads of the map level, not from unit histories):
//   bac      Hướng Bắc       QĐ1 (Quân đoàn 1)   Bến Cát / Thủ Dầu Một down QL13 -> Bộ Tổng tham mưu (Tân Bình / Gò Vấp)
//   tayBac   Hướng Tây Bắc   QĐ3 (Quân đoàn 3)   Củ Chi / Đồng Dù down QL22 -> Tân Sơn Nhất
//   dong     Hướng Đông      QĐ4 (Quân đoàn 4)   Xuân Lộc / Trảng Bom via Biên Hòa (QL1) -> Bộ Quốc phòng (centre)
//   dongNam  Hướng Đông Nam  QĐ2 (Quân đoàn 2)   Long Thành / Nhơn Trạch (QL15 + Xa lộ Biên Hòa), cầu Sài Gòn -> Dinh Độc Lập
//   tayNam   Hướng Tây Nam   Đoàn 232            Bến Lức / Long An via QL4 -> Biệt khu Thủ đô, Tổng nha Cảnh sát
// (assignment of the east / south-east axes to QĐ4 / QĐ2: nhandan.vn "Binh đoàn Cửu Long trên hướng đông", vi.wikipedia Chiến dịch Hồ Chí Minh.)
// Colour = SIDE_COLORS.vnm (red); width follows the zoom so the arrows read at the region view (zoom ~1600 -> ~38 px).

export type DirectionKey = 'bac' | 'tayBac' | 'dong' | 'dongNam' | 'tayNam';
export interface CampaignArrowDef { name: string; label: string; unit: string; target: string; points: Pt[] }
export const CAMPAIGN_ARROWS: Record<DirectionKey, CampaignArrowDef> = {
  bac: { name: 'Hướng Bắc', label: 'QĐ1', unit: 'Quân đoàn 1', target: 'Bộ Tổng tham mưu', points: [[106.595, 11.15], [106.605, 11.105], [106.628, 11.05], [106.652, 10.99], [106.69, 10.945], [106.713, 10.9], [106.708, 10.86], [106.69, 10.83], [106.67, 10.812]] },
  tayBac: { name: 'Hướng Tây Bắc', label: 'QĐ3', unit: 'Quân đoàn 3', target: 'Tân Sơn Nhất', points: [[106.4, 11.03], [106.46, 10.99], [106.51, 10.955], [106.555, 10.925], [106.59, 10.885], [106.62, 10.85], [106.648, 10.825]] },
  dong: { name: 'Hướng Đông', label: 'QĐ4', unit: 'Quân đoàn 4', target: 'Bộ Quốc phòng', points: [[107.26, 10.94], [107.15, 10.945], [107.02, 10.955], [106.9, 10.965], [106.83, 10.945], [106.8, 10.91], [106.765, 10.885], [106.74, 10.85], [106.715, 10.815], [106.702, 10.787]] },
  dongNam: { name: 'Hướng Đông Nam', label: 'QĐ2', unit: 'Quân đoàn 2', target: 'Dinh Độc Lập', points: [[107.03, 10.68], [106.985, 10.74], [106.94, 10.79], [106.89, 10.82], [106.83, 10.845], [106.775, 10.825], [106.74, 10.805], [106.7272, 10.7988], [106.708, 10.786], [106.698, 10.778]] },
  tayNam: { name: 'Hướng Tây Nam', label: 'ĐOÀN 232', unit: 'Đoàn 232', target: 'Biệt khu Thủ đô, Tổng nha Cảnh sát', points: [[106.4, 10.615], [106.45, 10.63], [106.51, 10.645], [106.57, 10.668], [106.6, 10.705], [106.605, 10.745], [106.635, 10.765], [106.668, 10.777]] },
};
const ORDER: DirectionKey[] = ['bac', 'tayBac', 'dong', 'dongNam', 'tayNam'];

export const CampaignArrows: React.FC<{ t: number; t0?: number; gap?: number; dur?: number; only?: DirectionKey[]; widthScale?: number; labels?: boolean; opacity?: number }> = ({
  t, t0 = 0, gap = 18, dur = 70, only, widthScale = 1, labels = true, opacity = 0.92,
}) => {
  const { project, camera } = useGeo();
  const w = clamp(camera.zoom * 0.024, 16, 64) * widthScale;
  return (
    <g>
      {ORDER.filter((k) => !only || only.includes(k)).map((k, i) => {
        const a = CAMPAIGN_ARROWS[k];
        return <FrontArrow key={k} id={`camp-${k}`} t={t} t0={t0 + i * gap} dur={dur} points={a.points.map(([lo, la]) => project(lo, la) as Pt)} width={w} color={SIDE_COLORS.vnm} label={labels ? a.label : undefined} labelSize={clamp(w * 0.62, 14, 30)} opacity={opacity} />;
      })}
    </g>
  );
};
