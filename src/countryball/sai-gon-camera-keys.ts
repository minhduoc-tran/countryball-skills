import { Camera, fitCamera } from './geo-camera';
import { PALACE_FRAME } from './palace-geometry';
import { CAMERAS as QT } from './quang-tri-camera-keys';

// Ready camera framings for the Sài Gòn map and the Dinh Độc Lập plan (same Camera type as GeoMap and PalacePlan; zoom = px per degree of latitude).
// Fly: vietnam -> southEast -> saigonRegion -> city -> palaceGrounds -> palace (-> gate). The OSM level swaps in once the whole view lies
// inside lon 106.2..107.55 / lat 10.2..11.25 (saigonRegion and below); PalacePlan takes over from ~ zoom 15000 (see palace-plan.tsx).
// px per metre of the plan = zoom / 110574.
const P = PALACE_FRAME;

export const SAIGON_CAMERAS: Record<string, Camera> = {
  /** whole country (same as QUANG_TRI CAMERAS.vietnam) */
  vietnam: QT.vietnam,
  /** Nam Bộ: Đồng Nai / Mê Kông delta, Sài Gòn in the upper middle (region level, no rivers) */
  southEast: { lon: 106.7, lat: 10.9, zoom: 260 },
  /** all five directions in view: Bến Cát / Củ Chi (north, north-west), Xuân Lộc (east), Long Thành / Nhơn Trạch (south-east), Bến Lức (south-west). OSM level. */
  saigonRegion: fitCamera([106.4, 10.6, 107.28, 11.14], 60),
  /** the built-up city: Tân Sơn Nhất (left), Dinh, cầu Sài Gòn and Hàng Xanh (right), Nhà Bè (bottom), 25 km wide */
  cityWide: { lon: 106.7, lat: 10.79, zoom: 5200 },
  /** the centre: Dinh Độc Lập, Bộ Quốc phòng, Đài phát thanh, Biệt khu Thủ đô (8 km wide) */
  city: { lon: 106.69, lat: 10.79, zoom: 12500 },
  /** the Dinh and the grounds with the surrounding streets (plan fades in), 1.2 km wide */
  downtown: { lon: P.lon + 0.001, lat: P.lat + 0.001, zoom: 90000 },
  /** the whole grounds (500 m fence square) in view, front gate lower right of the palace */
  palaceGrounds: { lon: P.lon + 0.0009, lat: P.lat + 0.0006, zoom: 175000 },
  /** palace + the oval lawn + the driveway to the gate (ppm 3) */
  palace: { lon: P.lon + 0.0008, lat: P.lat + 0.0005, zoom: 330000 },
  /** the main gate on Lê Duẩn and the street in front of it (ppm 6), gate between the two side gates */
  gate: { lon: P.gateLon, lat: P.gateLat, zoom: 660000 },
  /** the Dinh Độc Lập building filling the screen (ppm 9) */
  palaceClose: { lon: P.lon, lat: P.lat, zoom: 1000000 },
};
