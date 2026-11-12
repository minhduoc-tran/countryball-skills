import { CityDef } from './map-labels';
import { OSM_ATTRIBUTION } from './geo-quang-tri-sites';

// Places of the Sài Gòn - Gia Định map (for <City {...SAIGON_SITES.dinhDocLap} minZoom=... /> or <SaigonSites />). Coordinates: OSM
// place nodes / Nominatim (checked 2026-11-11) or APPROXIMATE (marked ~, +-1 km): fine for labels at zoom <= 30000, not for surveying.
// Recommended minZoom (px/deg): provincial towns 500, towns 1000-1800, city sites 6000-14000 (see SAIGON_SITE_MIN_ZOOM in sai-gon-map-labels.tsx).

/** Credit line for any scene whose camera reaches the Sài Gòn level (zoom >= ~1000 inside lon 106.2..107.55 / lat 10.2..11.25): <SourceLine text=.../> */
export const SAIGON_ATTRIBUTION = OSM_ATTRIBUTION;

export const SAIGON_SITES: Record<string, CityDef> = {
  /** Dinh Độc Lập = centre of the OSM building (135 Nam Kỳ Khởi Nghĩa; the front gate is on Lê Duẩn / Thống Nhất, 190 m NE). */
  dinhDocLap: { lon: 106.6953, lat: 10.7769, name: 'Dinh Độc Lập', anchor: 't', glow: 0.8 },
  /** ~ trại Trần Hưng Đạo on Võ Tánh near the Tân Sơn Nhất gate (Bộ Tổng tham mưu VNCH), Quân đoàn 1's goal. */
  boTongThamMuu: { lon: 106.6653, lat: 10.8092, name: 'Bộ Tổng tham mưu', anchor: 'r', glow: 0.5 },
  tanSonNhat: { lon: 106.6563, lat: 10.8182, name: 'Tân Sơn Nhất', anchor: 'l', glow: 0.8 },
  /** ~ 63 Gia Long (today Lý Tự Trọng), next to the Gia Long palace (Bảo tàng TP.HCM): 600 m from the Dinh. */
  boQuocPhong: { lon: 106.6985, lat: 10.7755, name: 'Bộ Quốc phòng', anchor: 'b', glow: 0.4 },
  /** Bộ Tư lệnh Biệt khu Thủ đô = today's Bộ Tư lệnh TP.HCM, 291 Cách Mạng Tháng 8. */
  bietKhuThuDo: { lon: 106.6751, lat: 10.7773, name: 'Biệt khu Thủ đô', anchor: 'l', glow: 0.5 },
  /** ~ Tổng nha Cảnh sát Quốc gia, 258 Võ Tánh (today Nguyễn Trọng Tuyển, Phú Nhuận). */
  tongNhaCanhSat: { lon: 106.6735, lat: 10.7978, name: 'Tổng nha Cảnh sát', anchor: 'l', glow: 0.4 },
  /** Đài Phát thanh Sài Gòn = 3 Nguyễn Đình Chiểu, Đa Kao (today Đài Tiếng nói Nhân dân TP.HCM, VOH). */
  daiPhatThanh: { lon: 106.7012, lat: 10.7897, name: 'Đài Phát thanh', anchor: 'l', glow: 0.4 },
  /** Tòa Đại sứ Mỹ, 4 Lê Duẩn (today the US consulate general). */
  daiSuMy: { lon: 106.7003, lat: 10.7831, name: 'Đại sứ quán Mỹ', anchor: 'l', glow: 0.3 },
  cauSaiGon: { lon: 106.7272, lat: 10.7988, name: 'Cầu Sài Gòn', anchor: 'r', glow: 0.4 },
  cauRachChiec: { lon: 106.7571, lat: 10.8137, name: 'Cầu Rạch Chiếc', anchor: 'l', glow: 0.3 },
  hangXanh: { lon: 106.7101, lat: 10.8013, name: 'Hàng Xanh', anchor: 'b', glow: 0.4 },
  bienHoa: { lon: 106.8263, lat: 10.9508, name: 'Biên Hòa', anchor: 'r', glow: 0.9 },
  bienHoaAirbase: { lon: 106.8183, lat: 10.9759, name: 'Sân bay Biên Hòa', anchor: 'l', glow: 0.5 },
  cuChi: { lon: 106.4949, lat: 10.9744, name: 'Củ Chi', anchor: 'l', glow: 0.5 },
  /** ~ căn cứ Đồng Dù (Sư đoàn 25 VNCH), 3 km from Củ Chi town. */
  dongDu: { lon: 106.4983, lat: 10.9835, name: 'Đồng Dù', anchor: 'l', glow: 0.4 },
  thuDauMot: { lon: 106.6516, lat: 10.9803, name: 'Thủ Dầu Một', anchor: 'l', glow: 0.7 },
  /** Bến Cát on QL13 (OSM place node), start of the Northern axis. */
  benCat: { lon: 106.5987, lat: 11.1514, name: 'Bến Cát', anchor: 'r', glow: 0.4 },
  /** ~ Long Bình post (Tổng kho Long Bình; OSM only has the Long Bình ward, 10.97/106.89). */
  longBinh: { lon: 106.8874, lat: 10.945, name: 'Long Bình', anchor: 'l', glow: 0.5 },
  nhonTrach: { lon: 106.9451, lat: 10.7376, name: 'Nhơn Trạch', anchor: 'r', glow: 0.4 },
  longThanh: { lon: 106.9523, lat: 10.7805, name: 'Long Thành', anchor: 'r', glow: 0.4 },
  xuanLoc: { lon: 107.2345, lat: 10.9395, name: 'Xuân Lộc', anchor: 'r', glow: 0.5 },
  trangBom: { lon: 107.0042, lat: 10.9531, name: 'Trảng Bom', anchor: 'b', glow: 0.4 },
  hauNghia: { lon: 106.3931, lat: 10.8948, name: 'Hậu Nghĩa', anchor: 'r', glow: 0.4 },
  benLuc: { lon: 106.4848, lat: 10.6416, name: 'Bến Lức', anchor: 'r', glow: 0.5 },
  nhaBe: { lon: 106.7396, lat: 10.6957, name: 'Nhà Bè', anchor: 'l', glow: 0.5 },
  /** ~ Cần Giờ town. */
  canGio: { lon: 106.954, lat: 10.41, name: 'Cần Giờ', anchor: 'l', glow: 0.4 },
  vungTau: { lon: 107.0753, lat: 10.3482, name: 'Vũng Tàu', anchor: 'r', glow: 0.6 },
};
