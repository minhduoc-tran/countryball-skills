import { Camera, PORTRAIT, fitCamera, portraitCam } from './geo-camera';
import { SIDE_COLORS } from './ground-front-arrows';

// Ready camera framings for the Tây Nam / Cambodia map, composed for the 1080x1920 PORTRAIT frame (TikTok). Every key already carries
// w/h = 1080x1920, so `cameraAt([{ t: 0, ...TN.indochina }, { t: 3, ...TN.cambodia }], s)` and <GeoMap camera tayNam> are portrait without
// any extra prop. zoom = px per degree of latitude. Keep important things inside PORTRAIT_SAFE (y 176..1484, x 48..948 below y 700):
// the framings put their subject a little ABOVE the centre (cy ~ 880) so TikTok's caption bar never covers it.
// With <GeoMap tayNam>, the Natural Earth 10m level (Biển Hồ, Bassac, provinces) is on for every key below except `asia`.
// TAY_NAM_CAMERAS_LANDSCAPE: the same subjects framed for 1920x1080 (fallback / YouTube cut).

/** Shift a portrait camera so lon/lat lands `dy` px above the screen centre (subject clear of the bottom caption bar). */
const lift = (c: Camera, dy = 90): Camera => ({ ...c, lat: c.lat - dy / c.zoom });
const P = (lon: number, lat: number, zoom: number): Camera => lift(portraitCam({ lon, lat, zoom }));

export const TAY_NAM_CAMERAS: Record<string, Camera> = {
  /** South-East Asia (region 50m level): Indochina + Thailand + Biển Đông, Hoàng Sa / Trường Sa in view */
  asia: P(107.5, 13.5, 62),
  /** Indochina: Hà Nội (top) .. Cà Mau (bottom), Thailand left, Biển Đông right (taynam level) */
  indochina: P(105.6, 14.6, 108),
  /** Cambodia whole + southern Vietnam + Tonle Sap + the Mekong down to the delta; Bangkok just off the left edge */
  cambodia: fitCamera([102.3, 9.0, 107.7, 14.8], 50, PORTRAIT),
  /** the war zone: Cambodia + Nam Bộ + Gulf of Thailand islands (Phú Quốc, Thổ Chu) */
  southVietnamAndCambodia: fitCamera([102.4, 8.6, 107.4, 14.6], 40, PORTRAIT),
  /** Tây Ninh border: Parrot's Beak (Svay Rieng), Tây Ninh town, Xa Mát, Neak Lương ferry above */
  borderTayNinh: P(105.95, 11.35, 900),
  /** An Giang / Kiên Giang border: Hà Tiên, Ba Chúc, Châu Đốc, Takeo above */
  borderAnGiang: P(104.85, 10.62, 700),
  /** Ba Chúc close-up (commune, Núi Tượng, the border 6 km west) */
  baChuc: P(104.9, 10.5, 2600),
  /** the January 1979 thrust: Tây Ninh / Svay Rieng / Neak Lương / Takeo -> Phnôm Pênh */
  phnomPenhRegion: P(105.3, 11.45, 380),
  /** Phnôm Pênh: the four arms of the river (Chaktomuk): Tonle Sap, Mekong up and down, Bassac */
  phnomPenh: P(104.93, 11.56, 2400),
  /** Gulf of Thailand islands: Phú Quốc, Thổ Chu (bottom), Hà Tiên, Kampot, Koh Kong (top) */
  gulfIslands: P(103.75, 10.15, 430),
  /** Thai border 1979-89: Poipet, Pailin, Battambang, Siem Reap / Angkor, An-lông Veng; Tonle Sap lake bottom right */
  thaiBorder: P(103.3, 13.35, 480),
  /** Mekong north-east: Kratie, Snuol, Stung Treng (1977-78 eastern zone) */
  northEast: P(106.0, 12.7, 420),
};

/** The same subjects for 1920x1080 (no w/h: plain landscape cameras). */
export const TAY_NAM_CAMERAS_LANDSCAPE: Record<string, Camera> = {
  asia: { lon: 107.5, lat: 13.5, zoom: 40 },
  indochina: { lon: 105.6, lat: 15.0, zoom: 62 },
  cambodia: fitCamera([102.3, 9.6, 107.7, 14.6], 80),
  southVietnamAndCambodia: fitCamera([102.4, 8.6, 107.4, 14.6], 60),
  borderTayNinh: { lon: 105.95, lat: 11.3, zoom: 1100 },
  borderAnGiang: { lon: 104.85, lat: 10.68, zoom: 950 },
  baChuc: { lon: 104.9, lat: 10.5, zoom: 3200 },
  phnomPenhRegion: { lon: 105.3, lat: 11.4, zoom: 600 },
  phnomPenh: { lon: 104.93, lat: 11.56, zoom: 3000 },
  gulfIslands: { lon: 103.75, lat: 10.15, zoom: 520 },
  thaiBorder: { lon: 103.3, lat: 13.3, zoom: 620 },
  northEast: { lon: 106.0, lat: 12.7, zoom: 600 },
};

/** Land colours. 1975-79: neutral, nobody "owns" the map; Vietnam muted brick, Cambodia warm sand, neighbours grey. Hoàng Sa (NE code PGA)
 *  in Vietnam's colour. Pass as <GeoMap colors={TAY_NAM_COLORS} />. */
export const TAY_NAM_COLORS: Record<string, string> = { VNM: '#A4573F', PGA: '#A4573F', KHM: '#B39A68', THA: '#6E6762', LAO: '#736B63', MMR: '#6E6762', CHN: '#6A6560' };
/** After 7.1.1979 / today: Cambodia a friendlier green-sand (peace, rebuilding), same Vietnam. */
export const TAY_NAM_COLORS_PEACE: Record<string, string> = { ...TAY_NAM_COLORS, KHM: '#9DAA6C' };

/** Arrow / marker colours by side. VN and the Front (Mặt trận Đoàn kết Dân tộc Cứu nước Campuchia) = red; Khmer Rouge = dark maroon
 *  (never the same red as VN), krGrey for a neutral alternative; thai = grey-blue for the border camps. */
export const TAY_NAM_SIDES = { vn: SIDE_COLORS.vnm, front: '#D9452F', kr: '#5B1F2B', krGrey: '#6B6F76', thai: '#7D8FA6', neutral: SIDE_COLORS.neutral } as const;
export type TayNamSide = keyof typeof TAY_NAM_SIDES;
