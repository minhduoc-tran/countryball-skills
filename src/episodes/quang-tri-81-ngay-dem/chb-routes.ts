// Chapter B map geometry (lon, lat), approximate: the start line on the Mỹ Chánh (Sông Nhùng) river, Highway 1 (QL1) north to
// Quảng Trị town, the coastal road, Quảng Trị town and the citadel. Hand-placed from the kit's QUANG_TRI_SITES; not surveyed.
export type LL = [number, number];

export const TOWN_LL: LL = [107.1859, 16.7539];
export const CITADEL_LL: LL = [107.1896, 16.7539];
/** the Mỹ Chánh river line, west to east: where the 28.6.1972 counter-offensive started */
export const MY_CHANH_LINE: LL[] = [[107.07, 16.668], [107.13, 16.658], [107.194, 16.652], [107.25, 16.662], [107.31, 16.672]];
/** QL1 from Mỹ Chánh to the south edge of the town (La Vang, Hải Lăng on the way) */
export const QL1: LL[] = [[107.194, 16.645], [107.198, 16.678], [107.196, 16.71], [107.193, 16.738]];
/** the coastal road, a few km east of QL1 */
export const COAST_ROAD: LL[] = [[107.262, 16.655], [107.27, 16.69], [107.262, 16.725], [107.245, 16.762]];
