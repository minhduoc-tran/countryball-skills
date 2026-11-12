# Sài Gòn / Dinh Độc Lập kit API (src/countryball/), for "30/4/1975: xe tăng húc đổ cổng Dinh Độc Lập"

Extends `plans/261109-1948-thanh-co-quang-tri/kit-api-map-quang-tri.md` (map, ground fx, balls: unchanged). Demo = composition `SaigonKitDemo` (2070 f; sections start at
frames 0 map | 540 PalacePlan | 840 gate 390 | 1020 gate 843 | 1200 facade | 1470 bridge | 1620 rooftop | 1770 carrier | 1920 props; files `demo-sai-gon-kit.tsx`, `sai-gon-demo-section-*.tsx`: copy from them).
**UNITS.** Every scene prop named `t`/`t0` = FRAMES (30 fps) of the shot. Progress props (`crash` `gate` `land` `push` `queue` `climb` `flagRaise` `progress` `smoke` `waves` `damage`) = 0..1: compute with `prog(t, a, b)` (fx-math, frames).
HUD (`ClockChip`, `DateChip`) and `cameraAt` keys = SECONDS (`t={frame/30}`). Camera `zoom` = px per degree of latitude. Everything is pure (no state/random); `id` must be unique per instance (SVG ids).
Credit in every scene whose camera reaches the level (zoom >= ~1000): `import { SAIGON_ATTRIBUTION } from './sai-gon-map-labels'` -> `<SourceLine text={`${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`} />`.

## 1. Map level `saigon` (OSM; GeoMap API unchanged, new 5th level)
Box lon 106.2..107.55, lat 10.2..11.25 (wider than asked: Cần Giờ coast + Vũng Tàu are below 10.55): coast, Cần Giờ mangroves (Rừng Sác), rivers (SaiGon DongNai NhaBe SoaiRap LongTau ThiVai VamCoDong VamCoTay VamCo Be CanGiuoc DongTranh NgaBay Dua BenLuc GoGia ThiTinh ThiNghe BenNghe TauHu Other,
drawn with real widths), urban footprint (OSM landuse: patchy), roads of 1975 (QL1 = Xa lộ Biên Hòa NE / QL4 SW, QL13, QL22, QL15 = today's QL51, QL20; inner-city 'Arterial' from zoom 2500, 'Street' from 6000).
Drawn when the WHOLE view is inside the box and zoom >= 1000 (or zoom >= 3000 overlapping): `hasSaigonLevel(camera)`. Below that the 50m region level (coarse coast, no rivers); the swap pops rivers/roads: hide it under a camera move (saigonRegion is the first OSM view).
```ts
import { SAIGON_CAMERAS as C } from './sai-gon-camera-keys';   // Camera {lon, lat, zoom}
C.vietnam {108.2,15.8,62} | C.southEast {106.7,10.9,260} Nam Bộ | C.saigonRegion (= fitCamera, 106.84/10.87 zoom 1778: all 5 directions, Bến Cát..Xuân Lộc..Bến Lức) |
C.cityWide {106.7,10.79,5200} 25 km | C.city {106.69,10.79,12500} 8 km (Dinh, Bộ Quốc phòng, Đài, Biệt khu) | C.downtown 90000 (plan fades in) |
C.palaceGrounds 175000 (ppm 1.6, whole fence) | C.palace 330000 (ppm 3: palace + oval lawn + gate) | C.gate 660000 (ppm 6, main gate) | C.palaceClose 1000000 (ppm 9)
```
Fly: `cameraAt([{t:0,...vietnam},{t:3,...southEast},{t:6,...saigonRegion},{t:13.5,...city},{t:16,...downtown},{t:18,...palace}], t)`.
- `<SaigonLabels regions? rivers? roads? />` (SÀI GÒN - GIA ĐỊNH, BIÊN HÒA, BÌNH DƯƠNG, HẬU NGHĨA, LONG AN, LONG KHÁNH, RỪNG SÁC · CẦN GIỜ, rivers, road tags QL1/QL4/QL13/QL22/QL15/QL20, BIỂN ĐÔNG) and `<SaigonSites lights? only? size? />`
  (all `SAIGON_SITES`, `CityDef`s, per-site minZoom in `SAIGON_SITE_MIN_ZOOM`). Draw arrows BEFORE labels. Sites: dinhDocLap boTongThamMuu tanSonNhat boQuocPhong bietKhuThuDo tongNhaCanhSat daiPhatThanh daiSuMy cauSaiGon cauRachChiec hangXanh bienHoa bienHoaAirbase cuChi dongDu thuDauMot benCat longBinh nhonTrach longThanh xuanLoc trangBom hauNghia benLuc nhaBe canGio vungTau.
- `<MapFlag lon lat kind size? minZoom? t? id? />` (flag-cloth.tsx): a waving pole flag planted on the map ('PRG' | 'RVN' | 'VNM' | 'USA').
- `<CampaignArrows t t0? gap? dur? only? widthScale? labels? />` (children of GeoMap, t FRAMES): the 5 directions of Chiến dịch Hồ Chí Minh as `FrontArrow`s (red `SIDE_COLORS.vnm`, grow in order, width follows zoom, labels QĐ1 QĐ3 QĐ4 QĐ2 ĐOÀN 232).
  `CAMPAIGN_ARROWS[key]` = {name, label, unit, target, points lon/lat}: bac QĐ1 -> Bộ Tổng tham mưu (Bến Cát down QL13) | tayBac QĐ3 -> Tân Sơn Nhất (Củ Chi, QL22) | dong QĐ4 -> Bộ Quốc phòng (Xuân Lộc, Trảng Bom, Biên Hòa, Xa lộ) |
  dongNam QĐ2 -> Dinh Độc Lập (Long Thành / Nhơn Trạch, QL15, cầu Sài Gòn) | tayNam Đoàn 232 -> Biệt khu Thủ đô, Tổng nha (Bến Lức, QL4). Routes are hand-laid along the roads (approximate); east / south-east assignment per nhandan.vn + vi.wikipedia.
  Pass `colors={{ VNM: '#9B4C3A' }}` to GeoMap for contrast: the default land red is close to the arrow red.

## 2. PalacePlan (palace-plan.tsx, palace-geometry.ts): the hero location, top-down, OSM
Local metre frame (x east, y south, origin = centre of the OSM building) but the SAME `Camera` as GeoMap. ppm = zoom / 110574. The real façade faces NE: the avenue Lê Duẩn ends exactly on the palace axis, main gate 164 m from the palace centre.
Palace frame (front towards the gate, side = right when facing it): `palaceToLocal(front, side)`, `localToPalace`, `palaceScreen(cam, f, s)`, `cameraOnPalace(f, s, ppm)`, `PALACE_POINTS` (palace mainGate sideGateL sideGateR street steps), `AXIS_DEG` -47.
```tsx
<PalacePlan id camera t? night? gate? flag? tanks? labels? opacity? />         // standalone (zoom >= ~15000), paints its own ground; 2 km data window
<GeoMap ...><PalacePlanInMap t? gate? flag? tanks? labels? /></GeoMap>          // feathered patch, fades in zoom 12000 -> 40000
```
`gate` 0..1 (intact -> bent -> down flat inwards + dust); `flag` 'none'|'RVN'|'PRG' on the roof pavilion (icon 11 x 7 m); `tanks` = `[{x, y (LOCAL m), heading? (default faces the palace), kind? 't54'|'type59'|'m48', turret?, fire?, scale?}]`
(TankTop, min 44 px long). `palaceRoute([[front, side]...], u)` -> {x, y, heading} for a tank along a route (u 0..1). `labels` true | ('palace'|'gate'|'church'|'streets'|'museum')[].
Shown: fence, oval lawn + fountain, driveway, front steps, palace roof + pavilion canopy + helipad, 3 gates, ~1000 trees, OSM streets/parks/buildings, Nhà thờ Đức Bà, Dinh Gia Long. Cheap tank placement example: `sai-gon-demo-section-plan.tsx` (gate driven by the tank's own `front`).

## 3. Side / front scenes (all screen px, `t` frames, props 0..1 as listed)
| component | props |
|---|---|
| `PalaceFacade` palace-facade.tsx | `id x y w?=1700 tone?'day'\|'dusk'\|'night' flag?'none'\|'RVN'\|'PRG' flagRaise?=1 climb? t? backdrop?=true windows?=0.5`. x centre, y ground line. Real 1966 front elevation: piers, bamboo screens (rèm hoa đá), balconies, roof pavilion + canopy, helipad, palms, pole (top at ~y-0.58w). `climb` 0..1: tiny faceless runner up the stairs/balconies/roof; `flagRaise` 0..1 hoists the flag (wave ripple from t). |
| `GateCrash` (= `PalaceGateSide`) palace-gate-crash.tsx | `id x?=1040 y?=880 s?=1 crash variant?'main'\|'side' kind? num? flag?=true t? tone?'day'\|'dusk' backdrop?`. main: 0-.34 drives in, .34-.46 impact (starburst, bars bend, bits), .46-.70 leaves fall flat INWARDS, .70-1 tank (Type 59 "390", PRG flag on antenna) rolls over, nose up. side: T-54B "843" (lamp box) hits a pillar (crack, cap tilts), stalls, smoke grows. Give .36-.7 about 2 s. |
| `SaigonBridgeSide` | `id x? y?=600 (deck) w? progress n?=3 t? smoke? tone? flag? kind? size?=250`: cầu Sài Gòn girders on piers, tank column crossing (progress 0..1), smoke columns on the far bank. |
| `RooftopEvacuation` | `id x? y?=760 (roof) s? land queue n?=8 t? tone?`: Huey lands on the stair-box pad (land 0..1), queue of silhouettes climbs the ladder and boards (queue 0..1). |
| `CarrierDeck` | `id x? y?=560 (flight deck) s? land push t? tone? hull?="41"`: land = a Huey sets down at the stern, push = another is pushed to the bow, tips and splashes (WaterSplash). Parked CH-53, island with radar, crew. |
| `RadioMicrophone` / `ReelToReel` / `TransistorRadio` radio-props.tsx | `x y s? t? (onAir?)`, `TransistorRadio waves? 0..1`: studio desk (mic, tape recorder, headphones, ON AIR lamp on an acoustic panel, ~520 px wide) / 1970s portable radio with sound arcs. |
`TankSide` (ground-tanks) new optional props: `num` hull number on the turret, `flag` ('PRG') on the antenna + `t` `id`, `searchlight`; new `kind: 'type59'` (greener, same silhouette; T-54B differs only by the lamp box) also for `TankSide/TankColumn/TankTop`.

## 4. Balls, flags, HUD
- Ball flags: `VNM`, `RVN` (yellow, 3 red stripes: checked), `USA` fine; NEW `PRG` (alias `MTDTGP`): red over blue, yellow star across the split (`PRG_COLORS` in ball-flags.tsx; also usable as banner via `FLAGS.PRG()`).
- `<FlagCloth id x y w h kind wave? t?>` (flag-cloth.tsx, `flagFace`): pole-edge flag with a wind ripple (cut into 14 columns, no filter): kinds PRG RVN VNM USA.
- Hat `<TankCrewHelmet color? />` (ball-accessories-military.tsx): padded tank-crew helmet with ridges, star; `MuCoi camo?`, `M1Helmet`, `Beret`, `NavyCap` exist.
- `<ClockChip date clock t? id? pulse? />` (hud-clock-chip.tsx, top-left like DateChip): `date="30.04.1975"`, `clock={[{t: 0 (s), time: '10:45'}, {t: 12, time: '11:30'}]}` or `"10:45"`; minutes tick linearly between keys with rolling digits; rim flashes at each key. Times are data.

## 5. Data + regeneration
`tools/geo-sai-gon-from-osm.py` (Overpass queries in its docstring; needs shapely in a throwaway venv; plain curl UA gets 406: send a custom UA; overpass.openstreetmap.fr works when the main server is busy) writes `geo-data-sai-gon.ts` (131 KB) and `palace-site-data.ts` (49 KB). Data fetched 2026-11-11 (ODbL).
Coordinates checked with OSM / Nominatim 2026-11-11: dinh (OSM building centroid), tanSonNhat, bietKhuThuDo (Bộ Tư lệnh TP.HCM, 291 CMT8), daiSuMy (4 Lê Duẩn), daiPhatThanh (3 Nguyễn Đình Chiểu, VOH: NOT Nguyễn Thị Minh Khai), cầu Sài Gòn / Rạch Chiếc / Hàng Xanh, Biên Hòa, Củ Chi, Thủ Dầu Một, Bến Cát, Nhà Bè, Nhơn Trạch, Long Thành, Trảng Bom, Hậu Nghĩa, Bến Lức, Vũng Tàu, Xuân Lộc (= thị xã Long Khánh, 10.9395, 107.2345).
APPROXIMATE (~, +-1 km): boTongThamMuu (trại Trần Hưng Đạo, Võ Tánh near the Tân Sơn Nhất gate), boQuocPhong (63 Gia Long = Lý Tự Trọng, next to Dinh Gia Long), tongNhaCanhSat (258 Võ Tánh = Nguyễn Trọng Tuyển, Phú Nhuận), dongDu, longBinh, canGio.

## 6. Weak spots
- OSM = TODAY: streets/buildings/rivers of 2026 (Q1 grid and the palace grounds are the 1975 ones; many towers around are new; the 1975 city beyond the centre was smaller: the Urban tint is OSM landuse and patchy). Roads are QL trunk roads filtered by ref, Xa lộ Biên Hòa = today's QL1.
- PalacePlan data window is 2 km: above ppm ~1 the screen can show beyond it (plain ground, fine); between zoom 12000 and 40000 the patch edge shows over the map. "Công viên 30/4" is not tagged in OSM (no label); the palace footprint is OSM's (L-shaped); roof pavilion/helipad positions are plausible, not surveyed.
- GateCrash is a stylised 3/4: the gate plane is slanted so bars read next to a pure side-view tank; the tank is drawn in front of the gate plane (it never hides the bars above it). The gate design is a generic wrought-iron leaf (not copied from a photo); PalaceFacade windows/plinth are simplified (see its header comment).
- Type 59 vs T-54B differ in the sprite only by colour + lamp box. CH-53 / Huey / ship sprites are generic. Carrier hull "41" is nominal.
- Campaign arrows: routes approximate; QĐ2 and QĐ4 converge near Hàng Xanh (two arrows overlap near the head).
- `SaigonKitDemo` stills render in ~15 s incl. bundle; the plan layers draw ~1000 trees + ~800 street polylines (cheap, culled to the view).
