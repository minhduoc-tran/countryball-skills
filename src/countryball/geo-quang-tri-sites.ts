import { CityDef } from './map-labels';

// Places around Quảng Trị for <City {...QUANG_TRI_SITES.dongHa} minZoom=... />. Coordinates from OpenStreetMap place nodes
// (Đông Hà, Quảng Trị, La Vang, Khe Sanh, Cửa Việt ...) or APPROXIMATE (marked ~): enough for map labels at zoom <= 12000,
// not for surveying. Recommended minZoom: big towns 450, towns 900, villages/bridges 2500.

/** Credit line for any scene that uses the Quảng Trị map level (OpenStreetMap, ODbL): put it in <SourceLine text=.../>. */
export const OSM_ATTRIBUTION = 'Bản đồ: © OpenStreetMap contributors';

export const QUANG_TRI_SITES: Record<string, CityDef> = {
  hue: { lon: 107.5863, lat: 16.4639, name: 'Huế', anchor: 'r', glow: 1 },
  dongHa: { lon: 107.098, lat: 16.813, name: 'Đông Hà', anchor: 'l', glow: 1 },
  quangTri: { lon: 107.1859, lat: 16.7539, name: 'Quảng Trị', anchor: 'l', glow: 0.8 },
  /** Thành cổ (the citadel) itself: centre of the OSM outline. */
  citadel: { lon: 107.1896, lat: 16.7539, name: 'Thành cổ', anchor: 'r', glow: 0.5 },
  cuaViet: { lon: 107.1777, lat: 16.9066, name: 'Cửa Việt', anchor: 'r', glow: 0.5 },
  laVang: { lon: 107.1946, lat: 16.7103, name: 'La Vang', anchor: 'r', glow: 0.4 },
  aiTu: { lon: 107.1402, lat: 16.7749, name: 'Ái Tử', anchor: 'l', glow: 0.4 },
  trieuPhong: { lon: 107.1651, lat: 16.7693, name: 'Triệu Phong', anchor: 'l', glow: 0.4 },
  haiLang: { lon: 107.2055, lat: 16.7229, name: 'Hải Lăng', anchor: 'r', glow: 0.4 },
  /** ~ Mỹ Chánh bridge on QL1 (the river is "Sông Nhùng" in OSM), about 10 km south of Quảng Trị town. */
  myChanh: { lon: 107.194, lat: 16.65, name: 'Mỹ Chánh', anchor: 'r', glow: 0.4 },
  camLo: { lon: 106.9935, lat: 16.8075, name: 'Cam Lộ', anchor: 'l', glow: 0.5 },
  gioLinh: { lon: 107.0853, lat: 16.9235, name: 'Gio Linh', anchor: 'l', glow: 0.5 },
  conTien: { lon: 107.0062, lat: 16.8994, name: 'Cồn Tiên', anchor: 'l', glow: 0.4 },
  kheSanh: { lon: 106.7377, lat: 16.6273, name: 'Khe Sanh', anchor: 'r', glow: 0.5 },
  laoBao: { lon: 106.5981, lat: 16.6136, name: 'Lao Bảo', anchor: 'r', glow: 0.4 },
  /** Cầu Hiền Lương over the Bến Hải: the 17th parallel bridge. */
  hienLuong: { lon: 107.0502, lat: 17.0057, name: 'Cầu Hiền Lương', anchor: 'l', glow: 0.4 },
  cuaTung: { lon: 107.1064, lat: 17.0286, name: 'Cửa Tùng', anchor: 'r', glow: 0.4 },
  vinhLinh: { lon: 107.005, lat: 17.0687, name: 'Vĩnh Linh', anchor: 'l', glow: 0.5 },
  conCo: { lon: 107.341, lat: 17.1541, name: 'Cồn Cỏ', anchor: 'r', glow: 0.3 },
  /** Cầu Thạch Hãn on QL1, 1.3 km SW of the citadel (the bridge of the 1972 fighting). */
  thachHanBridge: { lon: 107.1813, lat: 16.7423, name: 'Cầu Thạch Hãn', anchor: 'l', glow: 0.3 },
};
