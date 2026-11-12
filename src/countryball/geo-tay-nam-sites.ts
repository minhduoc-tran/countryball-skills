import { CityDef } from './map-labels';

// Places of the Tây Nam / Cambodia map (Vietnam - Khmer Rouge war 1975-1989), Vietnamese labels, for <City {...TAY_NAM_SITES.phnomPenh} />
// or <TayNamSites /> (tay-nam-map-labels.tsx). Coordinates = town centres from general map knowledge (+-2 km; fine for labels at zoom
// <= ~3000 px/deg, not for surveying). Ba Chúc = the commune centre (Tri Tôn, An Giang) under Núi Tượng, 6 km from the border.
// Neak Lương = the Mekong ferry crossing of National Road 1 (today's Tsubasa bridge). Kampong Som = Sihanoukville.

/** Map credit: the Tây Nam level is Natural Earth (public domain): no ODbL line needed, a short source is still good practice. */
export const TAY_NAM_ATTRIBUTION = 'Bản đồ: Natural Earth (public domain)';

export const TAY_NAM_SITES: Record<string, CityDef> = {
  phnomPenh: { lon: 104.916, lat: 11.562, name: 'Phnôm Pênh', anchor: 'l', glow: 1.3 },
  baChuc: { lon: 104.904, lat: 10.489, name: 'Ba Chúc', anchor: 'l', glow: 0.5 },
  tayNinh: { lon: 106.099, lat: 11.31, name: 'Tây Ninh', anchor: 'r', glow: 0.7 },
  haTien: { lon: 104.488, lat: 10.383, name: 'Hà Tiên', anchor: 'l', glow: 0.6 },
  chauDoc: { lon: 105.117, lat: 10.704, name: 'Châu Đốc', anchor: 'r', glow: 0.6 },
  phuQuoc: { lon: 103.962, lat: 10.218, name: 'Phú Quốc', anchor: 'r', glow: 0.6 },
  thoChu: { lon: 103.465, lat: 9.297, name: 'Thổ Chu', anchor: 'r', glow: 0.4 },
  neakLuong: { lon: 105.283, lat: 11.262, name: 'Neak Lương', anchor: 'r', glow: 0.5 },
  kampongCham: { lon: 105.46, lat: 11.993, name: 'Côm-pông Chàm', anchor: 'r', glow: 0.6 },
  kampongSom: { lon: 103.52, lat: 10.627, name: 'Côm-pông Xom', anchor: 'l', glow: 0.6 },
  siemReap: { lon: 103.86, lat: 13.362, name: 'Xiêm Riệp', anchor: 'r', glow: 0.7 },
  battambang: { lon: 103.199, lat: 13.095, name: 'Bát-tam-boong', anchor: 't', glow: 0.7 },
  takeo: { lon: 104.785, lat: 10.991, name: 'Ta Keo', anchor: 'l', glow: 0.5 },
  svayRieng: { lon: 105.799, lat: 11.087, name: 'Svay Riêng', anchor: 'r', glow: 0.5 },
  kratie: { lon: 106.018, lat: 12.488, name: 'Kra-chê', anchor: 'r', glow: 0.5 },
  snuol: { lon: 106.425, lat: 12.065, name: 'Xnuôn', anchor: 'r', glow: 0.4 },
  stungTreng: { lon: 105.968, lat: 13.525, name: 'Stung Treng', anchor: 'r', glow: 0.5 },
  pailin: { lon: 102.609, lat: 12.849, name: 'Pai-lin', anchor: 'l', glow: 0.4 },
  poipet: { lon: 102.563, lat: 13.659, name: 'Poi-pết', anchor: 'r', glow: 0.5 },
  anlongVeng: { lon: 104.082, lat: 14.232, name: 'An-lông Veng', anchor: 'r', glow: 0.4 },
  angkorWat: { lon: 103.867, lat: 13.412, name: 'Ăng-co Vát', anchor: 't', glow: 0.3 },
  bangkok: { lon: 100.501, lat: 13.754, name: 'Băng Cốc', anchor: 'r', glow: 1.1 },
  saiGon: { lon: 106.7, lat: 10.78, name: 'Sài Gòn', anchor: 'r', glow: 1.2 },
  /** same place, post-1976 name */
  tpHcm: { lon: 106.7, lat: 10.78, name: 'TP. Hồ Chí Minh', anchor: 'r', glow: 1.2 },
  hanoi: { lon: 105.85, lat: 21.03, name: 'Hà Nội', anchor: 'l', glow: 1.3 },
};

/** minZoom (px/deg) for each site label in <TayNamSites/>: big cities show on the Cambodia view (~180), towns from the border views (~500+). */
export const TAY_NAM_SITE_MIN_ZOOM: Record<string, number> = {
  phnomPenh: 60, saiGon: 60, tpHcm: 60, hanoi: 60, bangkok: 60, siemReap: 150, battambang: 150, kampongCham: 170, kampongSom: 170, tayNinh: 170, chauDoc: 260,
  haTien: 260, phuQuoc: 170, thoChu: 220, kratie: 220, stungTreng: 220, neakLuong: 300, takeo: 300, svayRieng: 300, baChuc: 420, snuol: 380, pailin: 300,
  poipet: 300, anlongVeng: 300, angkorWat: 900,
};
/** Sites drawn by default (saiGon OR tpHcm, not both; no angkorWat dot). */
export const TAY_NAM_DEFAULT_SITES = Object.keys(TAY_NAM_SITES).filter((k) => k !== 'tpHcm' && k !== 'angkorWat' && k !== 'hanoi');

/** Province keys of the taynam level: Vietnamese provinces by name_vi ('Tây Ninh', 'An Giang', 'Kiên Giang', 'Long An', 'Đồng Tháp'...),
 *  Cambodian provinces by English name; Vietnamese labels for the Cambodian ones (use for on-screen text). Boundaries = today's (NE). */
export const KHM_PROVINCE_VI: Record<string, string> = {
  'Phnom Penh': 'Phnôm Pênh', Kandal: 'Kan-đan', 'Takéo': 'Ta Keo', Kampot: 'Cam-pốt', Kep: 'Kép', 'Svay Rieng': 'Svay Riêng', 'Prey Veng': 'Prây Veng',
  'Kampong Cham': 'Côm-pông Chàm', 'Kratié': 'Kra-chê', Mondulkiri: 'Mon-đun-ki-ri', Ratanakiri: 'Ra-ta-na-ki-ri', 'Stung Treng': 'Stung Treng',
  'Preah Vihear': 'Prê-ah Vi-hia', 'Oddar Meanchey': 'Ốt-đa Miên-chây', 'Banteay Meanchey': 'Băn-tê-ay Miên-chây', 'Siem Reap': 'Xiêm Riệp',
  Battambang: 'Bát-tam-boong', Pailin: 'Pai-lin', Pursat: 'Pu-sát', 'Koh Kong': 'Kô Kông', Sihanoukville: 'Xi-ha-núc-vin', 'Kampong Speu': 'Côm-pông Xpư',
  'Kampong Chhnang': 'Côm-pông Chơ-nang', 'Kampong Thom': 'Côm-pông Thom',
};

/** VN-KHM border runs available in LAYERS.taynam.borders (keys = VN province). The SW front of 1977-78: Tây Ninh, An Giang, Kiên Giang. */
export const BORDER_RUNS = ['Kiên Giang', 'An Giang', 'Đồng Tháp', 'Long An', 'Tây Ninh', 'Bình Phước', 'Đắk Nông', 'Đắk Lắk', 'Gia Lai', 'Kon Tum'] as const;
export type BorderRunName = (typeof BORDER_RUNS)[number];
