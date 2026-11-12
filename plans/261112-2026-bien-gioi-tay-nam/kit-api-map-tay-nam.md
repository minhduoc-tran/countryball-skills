# Tây Nam / Cambodia kit API (src/countryball/), PORTRAIT 1080x1920, for "Biên giới Tây Nam 1975-1989" (BienGioiTayNam)

Extends `plans/261111-2032-dinh-doc-lap-30-4/kit-api-map-sai-gon.md` + `plans/261109-1948-thanh-co-quang-tri/kit-api-map-quang-tri.md` (all old APIs unchanged; 16:9 output pixel-identical).
Demo = composition `TayNamKitDemo` (1740 f, 1080x1920; sections start at 0 map | 660 balls+flags | 810 monuments | 960 memorials | 1110 street | 1290 countryside | 1440 farewell/aid | 1590 HUD safe zone;
files `demo-tay-nam-kit.tsx`, `tay-nam-demo-section-*.tsx`: copy from them). Episode ids starting `BienGioiTayNam` are 1080x1920 automatically (`VERTICAL_ID_PREFIXES` in Root.tsx).
**UNITS.** Scene props `t`/`t0`/`dur` = FRAMES (30 fps): use `prog(t, a, b)` (fx-math). HUD (`DateChip`, `ClockChip`, `Counter steps`, `LowerThird from/to`) and `cameraAt` keys = SECONDS (`t={frame/30}`).
Camera `zoom` = px per degree of latitude. Pure functions of props (no state/random); `id` unique per instance (SVG ids). Rules: `tiktok-safety-rules.md` (no gore, DK flag only small, KR never demonic).

## 1. Portrait map (GeoMap + layers + camera helpers)
- A camera carries its screen: `{ lon, lat, zoom, w?: 1080, h?: 1920 }`. `project/unproject/viewBounds/levelsFor/fitCamera`, `<GeoMap>`, `City`, `MapFlag`, `Parallel`, `RiverLabel`, `FrontArrow`s, `MiniMap` all follow it.
  No w/h = 1920x1080 exactly as before. Helpers (geo-camera.ts): `PORTRAIT`, `SCREEN`, `portraitCam(c)`, `withScreen(c, S)`, `screenOf(c)`, `fitCamera(box, pad, PORTRAIT)`.
- `cameraAt(keys, s)`: if ANY key has w/h the result has them (mix `TAY_NAM_CAMERAS` with your own `{t, lon, lat, zoom}` keys freely). Or force it: `<GeoMap screen={PORTRAIT} ...>`.
- Outside GeoMap, project with the same portrait camera: `project(cam, lon, lat)`. Inside: `useGeo().project` / `useGeo().screen`.
```tsx
import { cameraAt } from './geo-camera';
import { GeoMap } from './map-geo-map';
import { TAY_NAM_CAMERAS as TN, TAY_NAM_COLORS, TAY_NAM_COLORS_PEACE, TAY_NAM_SIDES } from './tay-nam-camera-keys';
import { TayNamLabels, TayNamSites, BorderRun, MapArrow } from './tay-nam-map-labels';
const cam = cameraAt([{ t: 0, ...TN.indochina }, { t: 3, ...TN.cambodia }, { t: 6, ...TN.borderAnGiang }], s);
<GeoMap camera={cam} tayNam colors={TAY_NAM_COLORS} provinces={cam.zoom > 300} id="a12">
  <TayNamLabels /> {/* arrows / BorderRun BEFORE sites so labels stay on top */}
  <BorderRun t={t} t0={20} label="BIÊN GIỚI" />
  <MapArrow id="a12kr" t={t} t0={30} side="kr" points={[[104.78, 10.72], [104.9, 10.5]]} label="Khơ Me Đỏ" />
  <TayNamSites />
</GeoMap>
```
- `tayNam` (opt-in) = Natural Earth 10m level `taynam`, box lon 97..115 / lat 4..24: coast, VN/KHM/THA/LAO borders (1978 = today's), Phú Quốc, Thổ Chu, Nam Du, Hòn Khoai, Koh Kong, Koh Rong, Koh Chang,
  Hoàng Sa outline (NE code `PGA`, VN colour in the presets), Biển Hồ (Tonle Sap lake), rivers `Mekong` (= sông Tiền below Phnôm Pênh, to the sea) `Bassac` (= sông Hậu) `TonleSap` `CoChien` `HamLuong`
  (last two + both mouths hand-laid, approximate) `Kong` `Srepok` `Mun` `ChaoPhraya`. Drawn when the whole view lies inside the box (every TN key except `asia`) or zoom >= 400; else the old 50m region.
  The Sài Gòn OSM level still swaps in at zoom >= 1000 around Sài Gòn (then credit `SAIGON_ATTRIBUTION`). North-VN detail / Quảng Trị levels are not used with `tayNam`.
- `provinces`: KHM admin-1 (keys = English: 'Takéo', 'Svay Rieng', 'Kampong Cham', 'Phnom Penh', 'Kratié', 'Siem Reap', 'Battambang', 'Pailin', 'Koh Kong'...; Vietnamese labels in `KHM_PROVINCE_VI`)
  + VN provinces south of 16N by Vietnamese name ('Tây Ninh', 'An Giang', 'Kiên Giang', 'Long An', 'Đồng Tháp', 'Bình Phước'...; today's 63-province boundaries). `highlight={['An Giang']}`, `provinceColors`.
- Colours: `TAY_NAM_COLORS` (1975-79 neutral: VN muted brick, KHM sand, neighbours grey), `TAY_NAM_COLORS_PEACE` (KHM green-sand, from 7.1.1979). Arrow sides `TAY_NAM_SIDES`:
  vn / front red, **kr dark maroon `#5B1F2B`** (never VN red), krGrey, thai, neutral.
- Credit: `TAY_NAM_ATTRIBUTION` = 'Bản đồ: Natural Earth (public domain)' (no ODbL needed for this level).

### Camera keys (`TAY_NAM_CAMERAS`, all portrait, subject lifted ~90 px above centre; `TAY_NAM_CAMERAS_LANDSCAPE` = same subjects for 16:9)
asia {107.5, 13.5, 62} region level | indochina (Hà Nội..Cà Mau, ~108) | cambodia fitCamera(102.3-107.7, 9-14.8) ~185 | southVietnamAndCambodia (+Phú Quốc, Thổ Chu) ~190 |
borderTayNinh {105.95, 11.35, 900} | borderAnGiang {104.85, 10.62, 700} | baChuc {104.9, 10.5, 2600} | phnomPenhRegion {105.3, 11.45, 380} (Jan 1979 thrust) | phnomPenh {104.93, 11.56, 2400} (Chaktomuk) |
gulfIslands {103.75, 10.15, 430} | thaiBorder {103.3, 13.35, 480} (Poipet, Pailin, Siem Reap, An-lông Veng) | northEast {106.0, 12.7, 420} (Kratie, Snuol, Stung Treng).

### Sites (`TAY_NAM_SITES`, geo-tay-nam-sites.ts; `<City {...TAY_NAM_SITES.baChuc} minZoom={400} />` or `<TayNamSites only? size?=34 />`, per-site minZoom in `TAY_NAM_SITE_MIN_ZOOM`)
phnomPenh baChuc tayNinh haTien chauDoc phuQuoc thoChu neakLuong kampongCham (Côm-pông Chàm) kampongSom (Côm-pông Xom) siemReap (Xiêm Riệp) battambang (Bát-tam-boong) takeo (Ta Keo)
svayRieng (Svay Riêng) kratie (Kra-chê) snuol (Xnuôn) stungTreng pailin (Pai-lin) poipet (Poi-pết) anlongVeng (An-lông Veng) angkorWat bangkok (Băng Cốc) saiGon | tpHcm (same point) hanoi.
Town centres +-2 km (labels, not surveying). Default set skips tpHcm / angkorWat / hanoi.
- `<BorderRun t? t0? dur? names? label? color? width? pulse? />`: glowing dashed VN-KHM border along `BORDER_RUNS` (default ['Kiên Giang', 'An Giang', 'Tây Ninh']; also 'Long An', 'Đồng Tháp', 'Bình Phước', 'Đắk Nông', 'Đắk Lắk', 'Gia Lai', 'Kon Tum'), drawn on over `dur` frames. Data from NE shared vertices.
- `<MapArrow id t t0 points={[lon,lat][]} side? color? width? label? dur? />` = FrontArrow in lon/lat, width follows zoom (26-64 px). Old `FrontArrow`, `UnitBox`, `TrenchLine` take screen px.
- `<TayNamLabels countries? seas? rivers? />`: CAMPUCHIA / VIỆT NAM / THÁI LAN / LÀO, VỊNH THÁI LAN + BIỂN ĐÔNG (two lines, portrait-narrow), BIỂN HỒ, Mê Kông / Sông Tiền / Sông Hậu (Bát-xắc) / Tônlê Sap.
- `<MapFlag lon lat kind="PRK" .../>` now also takes 'DK' 'PRK' 'SOC' 'KHM' 'THA'. `RiverLabel` has `size` (default 24).

## 2. HUD in portrait (TikTok SAFE ZONE) — hud-portrait-safe.ts
`PORTRAIT_SAFE`: top bar y < 160, caption+music bar y > 1500, button column x > 960 for y 700..1500 → keep text in x 48..1032 (48..948 below y 700), y 176..1484.
HUD pieces switch to portrait positions by themselves when the composition is taller than wide (`portrait` prop forces either way; 16:9 unchanged):
DateChip / ClockChip (48,176) | NightChip (48,290) | Counter right 1032, y 290, width 500 | MiniMap top-left (720,404) | LowerThird bottom edge at 1440, max 900 px wide, title 56 / sub 34 shrink to fit |
SourceLine (48,1484) 24 px. Overrides: DateChip/ClockChip/MiniMap `x y`; Counter `right y width`; LowerThird `y` (= bottom in portrait).
`PhotoCard` never moves by itself: use `{...PORTRAIT_SLOTS.photo}` (x 510 y 760 w 840 h 560) or `photoTall`, and pass `captionSize={PORTRAIT_SLOTS.captionSize}` (40) `creditSize={PORTRAIT_SLOTS.creditSize}` (24).
`PORTRAIT_SLOTS.ball` (300,1250) for a speaking ball. Engine: look `Overlay` svg now uses the video size.

## 3. Flags + balls
Ball flags (`FLAGS`, ball-flags-cambodia.tsx, Commons-checked): `DK` (red, yellow 3-tower Angkor, 1975-79), `PRK` (red, yellow 5-tower blocky, 1979-89), `SOC` (red/blue, yellow Angkor, 1989-93);
existing `KHM` (today), `THA`, `LAO`, `VNM`. Pole flags: `<FlagCloth kind="DK|PRK|SOC|KHM|THA" .../>`, `cambodiaFlagFace(kind, w, h)`.
Accessories (ball-accessories-cambodia.tsx): `<Krama id mode?='neck'|'head' color?='red'|'blue' />` (checked scarf, low on the ball so the emblem shows), `<KrCap />` (plain dark cloth cap).
Presets: `<Ball id x y r {...CAMBODIA_BALLS.regime()} />` (DK + KrCap, neutral eyes) | `.people(id)` (PRK + krama, happy) | `.farmer(id)` | `.soc(id)` | `.today(id)` (KHM + krama).
Regime ball: neutral/'worried'/'smug' at most, never demonic; it may appear only small (no hero DK flag).

## 4. Props (screen px, x = centre, y = ground line, `t` frames, tone 'day'|'dusk'|'night')
| file | components |
|---|---|
| tay-nam-props-monuments | `AngkorWat {x y w?=900 tone? reflect?=true t?}` · `IndependenceMonument {x y h?}` · `RoyalPalaceRoof {x y w?}` · `WatPhnom {x y w?}` · `PhnomPenhSkyline {x y w? tone? t?}` (palace + monument + Wat Phnom + river) · `FriendshipMonument {x y h?=760}` (VN soldier with flag, KH soldier, mother + baby; no weapons) · `SugarPalm {x y h? tone? lean?}` |
| tay-nam-props-memorials | `MemorialStupa {x y h?=900 tone? t? offerings?}` (exterior, closed glass) · `MemorialGate {x y w?=820 tone? text?='BA CHÚC'}` · `CandleRow {x y w n? s? t? lit 0..1}` · `FlowerBouquet {x y s? color}` · `OfferingTable {x y w? t?}` |
| tay-nam-props-street | `PhnomPenhStreet {id? x? y w? life 0..1 t backdrop? houses?}`: life 0 = empty city (shutters down, dust, no people) → 1 = market, bicycles, walkers |
| tay-nam-props-countryside | `PaddyLandscape {id x? y(horizon) w? h? tone? season 'green'\|'gold' t? palms? farmers?}` · `BorderMarker {x y s? num?}` · `MekongFerry {id x? y w? progress t? tone? s?=1.6}` |
| tay-nam-props-aid-and-farewell | `TroopTruck {id x y s? facing? t? flowers? flag? troops?}` · `FarewellConvoy {id y x0? x1? n? progress t s? crowd?}` (26.9.1989) · `RiceSacks {x y n? s? label?}` · `SchoolHouse {id x y w? t? children? flag?}` |
| tay-nam-people-silhouettes | `Person {x y h? pose 'stand'\|'walk'\|'wave'\|'carry' t? color? hat 'none'\|'cone'\|'krama'\|'helmet' facing? seed?}` · `Crowd {x y w n h? t? seed? walking?}` |
| angkor-silhouette.ts | `angkorPath(w, 3\|5)` path string (base at 0,0), `ANGKOR_DK_PATH`, `ANGKOR_PRK_PATH` (900x600 flag box) |
Reuse for remembrance: `Candle`, `IncenseBundle`, `HoaDang` (ground-memorial-props); war on the map only: `MapArrow`, `UnitBox`, `TankTop`/`TankColumn`, `SmokeColumn` far away.

## 5. Data
`tools/geo-tay-nam-from-natural-earth.py <dir>` (NE 10m geojson: admin_0, admin_1, rivers_lake_centerlines, lakes, minor_islands from github nvkelso/natural-earth-vector) writes `geo-data-tay-nam.ts` (152 KB).
NE names both Mekong arms 'Mekong'; the Châu Đốc arm is renamed `Bassac`. No OSM in this level.

## 6. Gotchas / weak spots
- `tayNam` is opt-in: forget it and you get the coarse 50m map (no Biển Hồ, no Bassac). Level swap at the `asia` → `indochina` move pops lake/rivers: hide it under the camera move.
- Map labels under the top HUD band (y 176-380) are covered by chips: frame the subject in y 400-1450 (TN keys already lift it).
- Delta mouths (Tiền, Hậu, Cổ Chiên, Hàm Luông) hand-laid (+-3 km); NE coast is 10m (fine to zoom ~2500; Phnôm Pênh close-up shows generalised rivers). Province lines = today's (KHM without Tbong Khmum, VN pre-2025).
- Friendship Monument / memorial stupa / gate / street / truck are generic, not surveys of the real objects; Thổ Chu etc. are small NE minor-island polygons. Sites +-2 km.
- MonsoonRain / AirRaidPulse / CarrierDeck / PalaceFacade are still 1920x1080 full-screen pieces (scale or avoid in portrait). PhotoCard defaults are unchanged (pass the portrait sizes).
- Stills: `mkdir -p /tmp/rmx-kit && TMPDIR=/tmp/rmx-kit npx remotion still src/index.ts TayNamKitDemo /tmp/x.jpg --frame N`, then clean `/tmp/rmx-kit/remotion-*`.
