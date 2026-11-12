import { Camera, fitCamera } from './geo-camera';

// Ready camera framings for the Quảng Trị map (same Camera type as GeoMap; zoom = px per degree of latitude).
// Zoom path used by the demo: vietnam -> binhTriThien -> quangTriProvince -> triThienFront -> town -> citadel
// (from `town` on, fade the CitadelPlan in, see citadel-plan.tsx). The OSM level swaps in once the whole view lies
// inside lon 106..108.3 / lat 16.15..17.65 (about zoom 900 and up).

export const CAMERAS: Record<string, Camera> = {
  /** whole country, North to South, Hoàng Sa / Trường Sa in view */
  vietnam: { lon: 108.2, lat: 15.8, zoom: 62 },
  /** Bình Trị Thiên: Quảng Bình south to Huế, with the coast */
  binhTriThien: { lon: 107.1, lat: 17.1, zoom: 330 },
  /** Quảng Trị of 1972 + the DMZ above it (switches to the OSM level) */
  quangTriProvince: { ...fitCamera([106.55, 16.5, 107.5, 17.15], 90) },
  /** Quảng Trị town + Đông Hà + Cửa Việt + Hải Lăng */
  triThienFront: { lon: 107.12, lat: 16.82, zoom: 3000 },
  /** Quảng Trị town, Thạch Hãn river, citadel (a few km across) */
  town: { lon: 107.185, lat: 16.755, zoom: 14000 },
  /** the citadel plan fills the screen */
  citadel: { lon: 107.1896, lat: 16.7539, zoom: 150000 },
  /** Citadel + the Thạch Hãn bank to its west, for river-crossing scenes */
  citadelAndRiver: { lon: 107.1835, lat: 16.7545, zoom: 90000 },
  /** Hải Lăng / Mỹ Chánh line, the Marines' front */
  myChanh: { lon: 107.2, lat: 16.68, zoom: 6000 },
};
