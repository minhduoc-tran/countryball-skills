# Quảng Trị kit API (src/countryball/), for "81 ngày đêm Thành cổ Quảng Trị"

Extends the old kit (`plans/261107-0952-dien-bien-phu-tren-khong/kit-api-map.md`). Demo = composition `QuangTriKitDemo` (1400 f; pattern files
`demo-quang-tri-kit.tsx`, `quang-tri-demo-section-*.tsx`: copy from them). Units: screen px (1920x1080) unless said; `t` in FRAMES (30 fps) for all fx
(`t={t}` of the shot, never useCurrentFrame); camera `zoom` = px per degree of latitude. Everything is a pure function of its props.
Credit for the OSM level: `import { OSM_ATTRIBUTION } from './geo-quang-tri-sites'` -> `<SourceLine text={`${OSM_ATTRIBUTION}; Natural Earth (public domain)`} />`
("Bản đồ: © OpenStreetMap contributors", ODbL: required in any scene whose camera reaches the Quảng Trị level, i.e. zoom >= ~900).

## 1. Map: Vietnam -> Quảng Trị -> town (GeoMap, same API as before)
New 4th level `quangtri` (OSM, lon 106..108.3, lat 16.15..17.65): accurate coast + Cồn Cỏ, VNM/LAO land, 4 provinces split at the DMZ,
rivers. It is drawn only when the WHOLE view lies inside that box (zoom ~900-1400 depending on how centred the view is; any zoom >= 2500 that overlaps it), so the box edge
never shows. Existing episodes never reach it (verified: MapKitDemo renders as before). `hasQuangTriLevel(camera)` (geo-camera.ts) tells you when it is on.
- Provinces (names for `provinceColors` / `highlight`, 1972 meaning): `'Quảng Bình'` (north of Bến Hải, VNDCCH side), `'Quảng Trị'`, `'Thừa Thiên-Huế'`,
  `'Quảng Nam - Đà Nẵng'`. Need `provinces` prop. They exist ONLY at this level: at lower zoom the fills/borders pop in at the swap (a small coast shift of 1-5 px too).
  Hide the pop under a camera move or a cut; do not rely on province fills for zoom < ~900.
- Rivers (`rivers` true | names): `ThachHan BenHai Hieu CamLo MyChanh`(= "Sông Nhùng" in OSM) `AiTu VinhDinh OLau Bo Huong Other`(small streams). Drawn with real
  widths (metres * zoom / 111320 px). `<RiverLabel level="quangtri" river text near minZoom maxZoom />` (new optional `level`, `maxZoom`).
- Zoom >= ~15000: switch to / overlay `CitadelPlan` (section 2). The map has no street detail.
```ts
import { CAMERAS } from './quang-tri-camera-keys';   // all are Camera {lon, lat, zoom}
CAMERAS.vietnam          { lon 108.2, lat 15.8, zoom 62 }     whole country (Hoàng Sa/Trường Sa in view)
CAMERAS.binhTriThien     { lon 107.1, lat 17.1, zoom 330 }    Quảng Bình..Huế, coast (still region level)
CAMERAS.quangTriProvince fitCamera([106.55,16.5,107.5,17.15]) = lon 107.025 lat 16.825 zoom ~1385  (OSM level, DMZ at top, Huế bottom, Khe Sanh/Lao Bảo left)
CAMERAS.triThienFront    { lon 107.12, lat 16.82, zoom 3000 } Đông Hà, Cửa Việt, Quảng Trị, Hải Lăng, Thạch Hãn course
CAMERAS.myChanh          { lon 107.2,  lat 16.68, zoom 6000 } Hải Lăng / Mỹ Chánh river line (Marines' front), Nhùng river, La Vang
CAMERAS.town             { lon 107.185,lat 16.755,zoom 14000 }Quảng Trị town, Thạch Hãn bend, citadel as a ~60 px square
CAMERAS.citadel          { lon 107.1896,lat 16.7539,zoom 150000 } citadel fills 60% of the height (CitadelPlan standalone)
CAMERAS.citadelAndRiver  { lon 107.1835,lat 16.7545,zoom 90000 }  citadel + the Thạch Hãn bank 400 m west
```
Fly: `cameraAt([{t:0,...vietnam},{t:3,...binhTriThien},{t:6,...quangTriProvince},{t:9,...triThienFront},{t:12,...town},{t:15,...citadel}], t)`; log-zoom keeps it smooth.
- Places: `QUANG_TRI_SITES` (geo-quang-tri-sites.ts, `CityDef`s): hue dongHa quangTri citadel cuaViet laVang aiTu trieuPhong haiLang myChanh(~) camLo gioLinh conTien
  kheSanh laoBao hienLuong(Cầu Hiền Lương) cuaTung vinhLinh conCo thachHanBridge. `<QuangTriSites lights? only? size? />` draws all with per-site minZoom so labels never pile up.
  Single: `<City {...QUANG_TRI_SITES.dongHa} minZoom={600} />` (existing CITIES.hanoi/danang/saigon still work).
- `<QuangTriLabels provinces? rivers? />` province names (QUẢNG BÌNH/QUẢNG TRỊ/THỪA THIÊN, fade out above zoom 3600), river names, BIỂN ĐÔNG.
- `<DmzBand widthKm=10 label? minZoom? maxZoom? opacity? />` hatched Bến Hải / 17th-parallel band with dashed line (children of GeoMap).
- Hà Nội kit untouched; `parallel={17}` also works (label only for 20).

## 2. CitadelPlan: the hero location (citadel-plan.tsx)
Top-down Thành cổ + town + Thạch Hãn in its own LOCAL METRE frame (x east, y south, 1 unit = 1 m, origin = citadel centre lon 107.1896 lat 16.7539; the fort is a
480 m square turned 16.6 deg clockwise: Cửa Đông faces ESE), but it takes the SAME `Camera` type as GeoMap, so one `cameraAt` flies from Vietnam into the courtyard.
px per metre = `zoom / 110574`: 14000 -> 0.13 (town, ~15 km wide) | 40000 -> 0.36 | 90000 -> 0.81 | 150000 -> 1.36 (citadel 650 px) | 220000 -> 2 (fills height) | 500000 -> 4.5 (one gate).
```tsx
<CitadelPlan id camera t? damage? craters? fires? night? flood? memorial? labels? opacity? />      // standalone: paints its own ground; use at zoom >= ~15000
<GeoMap camera ...><CitadelPlanInMap labels? damage? .../></GeoMap>                                // overlay: soft-edged patch, fades in zoom 10000 -> 30000 (fadeFrom/fadeTo)
```
- `damage` 0..1: intact -> wall pieces crack (~0.6 of their seeded threshold) then breach (east gate survives, as in 1972), bastions and gates collapse, 1972 barracks to rubble,
  trees stump out, houses ruined, ground scorched, craters appear one by one (1100 seeded). Animate it with prog(t,..): a 0.2 -> 0.9 ramp over 3 s reads well.
- `craters` 0..1 density (default 1); `fires` 0..1 burning ruins + smoke (needs damage > ~0.2; use with night 0.6-0.9); `night` 0..1; `flood` 0..1 (river spreads over the low
  ground, moat widens); `memorial` = the site today (monument, museum, flowers) for the ending (damage 0); `t` frames only for flame/smoke flicker.
- `labels` true | ('citadel'|'gates'|'moat'|'river'|'bridge')[]: screen-space text that fades with scale (gates need ~0.6 px/m, citadel 0.35).
- Helpers (citadel-geometry.ts): `cameraOnCitadel(u, v, pxPerM)` camera centred on a citadel-frame point; `citadelScreen(camera, u, v)` / `localToScreen(camera, x, y)` -> screen px to hang balls,
  fx (GroundBlast, ShellBarrage, Flames, boats...) on the plan; `CITADEL_POINTS` (citadel frame, metres): centre gateE/W/N/S cornerNE/NW/SE/SW (E = +u = ESE, S = +v); `lonLatToLocal`, `citadelToLocal`, `localToCitadel`; `CITADEL.half` = 240.
  Example: `const [x,y] = citadelScreen(cam, 240, 0)` = the east gate. River bank ~400 m west of the centre (local x ~ -430..-700 around y = 0).
- Close-up is designed for ppm 1-5 (brick strip, towers with roofs, curved bridges); at ppm 0.13-0.4 houses become speckle (fine as texture).

## 3. Ground-war fx (all screen px, `t` frames; draw inside the map/camera group)
| file | components |
|---|---|
| ground-artillery | `Howitzer {x y aim s? recoil? tone?}` top view; `HowitzerSide {x y s? elev? recoil? flip?}`; `MuzzleFlash {x y dir t t0 size?}`; `ArtilleryBattery {id t t0 x y aim n? gap? period? s? tone? rounds?}`; `ShellArc {t t0 from to dur? lift? water? r? linger?}`; `ShellBarrage {id t t0 from to n? span? spread? dur? lift? water? r?}` (`from` may be off-screen: shells streak in); `arcPos` |
| ground-naval-gunfire | `Warship {x y heading size? kind? t? aim? recoil? wake?}` (kind 'destroyer'/'cruiser'); `WarshipSide {x y size? kind? flip? t?}`; `NavalBombardment {id t t0 ship:{x y heading size kind} target until? every? flight? lift? spread? r? water?}` (flashes, smoke, shells + blasts); `turretPoints` |
| ground-tanks | `TankTop {x y heading size? kind? turret? fire? mark?}` kind 't54' (QĐND, star) / 'm48' (VNCH/US); `TankSide`; `TankColumn {id t t0 t1 points n? gap? size? kind? turret? fireEvery? dust?}` |
| ground-helicopters | `HeliTop {x y heading size? kind? t?}` 'uh1' / 'ch53', rotor blur; `HeliSide`; `HeliFlight {id t t0 t1 points kind? size? land? troops?}` (landing = rotor-wash dust, then `TinyFigures`); `HeliWave {id t flights[] kind? size?}`; `TinyFigures {t t0 from to? n? spread?}` |
| ground-front-arrows | `FrontArrow {id t t0 points dur? width? color? label? tail?}` (grows along a smooth path); `TrenchLine {id t t0 points dur? style:'zigzag'\|'triangles'\|'dashes' step? amp? color? side?}`; `UnitBox {x y kind:'inf'\|'arm'\|'art'\|'mar'\|'air' color? label? size?}`; `SIDE_COLORS` vnm red, rvn yellow, usa blue |
| ground-river-crossing | `Boat {x y heading size? t? crew?}`, `Raft`, `FlareGlitter {x y t}`, `RiverCrossing {id t t0 t1 from to n? size? spacing? drift? raft? flares:[{t0 x y}] splashes? crew?}` (boats cross bank `from` -> `to`, shell splashes, flares via fx-tracers `Flare`) |
| ground-water-splash | `WaterSplash {t t0 x y r?}` shell column in water; `WaterRipples {t t0 x y r? n? life?}` |
| ground-weather-and-smoke | `MonsoonRain {t intensity? angle? dim?}` (full screen, draw last); `SmokeColumn {t t0? x y h? w? color? lean? life? fire?}`; `CraterField {id t t0 t1 x y w h n? seed? scale?}` (craters accumulate in an ellipse) |
| ground-ruined-wall-side | `RuinedWallSide {id x y w? h? damage t? night?}` side view of the brick wall crumbling (x,y = bottom centre) |
| ground-memorial-props | `HoaDang {x y s? t? color:'pink'\|'white'\|'yellow' ph?}`; `HoaDangField {id t t0 points n? size? speed? every?}` drifting down a path; `Candle {x y s? t? lit?}`; `IncenseBundle {x y s? t? n?}` |
Reused from the old kit: `GroundBlast`, `BombCarpet`, `Flames` (fx-bomb-carpet), `Glow`/`Puff`, `Flare`/`AaTracers`/`Searchlights`, B-52 `FlightPath`/`BCell`, `samplePath`/`pathAtDist`.
Colour grammar: QĐND red, VNCH yellow, Mỹ blue; T-54 star on the turret; M48 has a small RVN flag aerial. Boats carry only dots (heads): nothing graphic.

## 4. Balls
Flags `VNM`, `RVN` (yellow, 3 red stripes: checked, correct), `USA` work. Accessories (hat prop): `MuCoi camo?` (ball-accessories.tsx, leaf camouflage), and in
ball-accessories-military.tsx: `M1Helmet {net? color?}` (VNCH/US), `Beret {color? badge:'wings'|'anchor'|'none'}` ('#B3262B' red = Dù, '#2F6B3A' green = TQLC), `NavyCap {style:'officer'|'dixie'}`.
Pair with existing `Headset`, `PilotHelmet`, `UsafCap`, expressions in ball-face.

## 5. Data + regeneration
`tools/geo-quang-tri-from-osm.py` (Overpass queries in its docstring; needs shapely in a venv) writes `geo-data-quang-tri.ts` (117 KB; scale 1/20000 deg via new `RawLayer.scale`)
and `citadel-site-data.ts` (49 KB; roads, Thạch Hãn polygon, canals, residential land-use in metres). OSM data fetched 2026-11-09, ODbL; scratch files deleted.

## 6. Weak spots
- OSM town data = TODAY's streets and river polygon; 1972's grid/houses differ (houses, trees, rice fields are seeded fillers). Say "Quảng Trị ngày nay" only for the memorial.
- Province polygons = today's boundaries (2025 merges undone by cutting at Bến Hải; Huế = old Thừa Thiên); the DMZ band is a 10 km stylised band along the 17th parallel, west end approximate.
- Level swap (zoom ~900-1400) pops provinces/coast slightly; cover it with a cut or camera move. `myChanh` site and the Mỹ Chánh river (OSM name "Sông Nhùng") are approximate.
- Citadel layout from OSM outline + Wikipedia (square, 4 gates at mid-sides, 4 arrowhead bastions, ~18 m moat, brick-faced rampart); interior buildings are generic. Gate names are nominal (Bắc/Đông/Nam/Tây).
- CitadelPlan with fires at zoom < 0.2 px/m shows speckle; huge houses count at 0.13 px/m is cheap but unreadable: prefer the map there. A still of the busy night scene renders in ~12 s including the Remotion bundle.
- Warship/tank/heli sprites are generic silhouettes (not hull-accurate). Shell arcs are ballistic curves in screen space (lift is "up the screen"), not geodesics.
- No Cửa Việt port, lagoon (Tam Giang) or Đà Nẵng detail on the map; no lat/lon grid.
