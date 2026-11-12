# Map kit API (src/countryball/), from the map-kit phase

Pattern to copy: `src/countryball/demo-map-kit.tsx` (keyframes → cameraAt → <GeoMap> + HUD).

```ts
// geo-camera.ts
type Camera = { lon; lat; zoom /*px per degree*/; lat0? }
type CameraKey = Camera & { t: number; ease?: 'inout'|'out'|'in'|'linear' }
cameraAt(keys, t): Camera   // log-zoom, zoom lands on target
project(cam, lon, lat): [x,y]; unproject(cam,x,y); viewBounds(cam,padPx?); fitCamera([lon0,lat0,lon1,lat1], padPx?)

// map-geo-map.tsx
<GeoMap camera colors? provinceColors? highlight? provinces? rivers? night? parallel? labels? id? riverColor?>{children}</GeoMap>
//  colors keyed ISO A3 (merged over DEFAULT_COLORS: VNM #C8573F, USA blue-grey incl. Guam); highlight = ISO codes or
//  province names ['Hà Nội']; rivers = true | ['Mekong','Hong','Da','Lo','Duong']; parallel={20} dashed "VĨ TUYẾN 20";
//  night 0..1; id unique if two maps in a frame.
// Inside <GeoMap>: useGeo().project(lon, lat) from map-context.tsx to place balls/planes by lon/lat.

// map-labels.tsx (children of GeoMap)
<City {...CITIES.hanoi} lights={0..1} minZoom maxZoom showLabel size />
//  CITIES: hanoi, haiphong, saigon, vinh, danang, guam, utapao, paris, washington, moskva, bacKinh
//  HANOI_SITES: noiBai, giaLam, yenVien, khamThien, bachMai (approximate coords)
<IslandGroup/> <SeaLabel/> <Parallel lat label/> <RiverLabel river text near/>
//  default labels: BIỂN ĐÔNG, HOÀNG SA, TRƯỜNG SA, VỊNH BẮC BỘ, rivers at high zoom

// HUD (optional t in seconds, else current frame)
<DateChip dates={[{t,label}]} | label />          // digits roll on change, e.g. "18.12.1972"
<Counter label unit steps={[{t,value}]} | value />  // eased count-up + pulse
<MiniMap camera />   <NightChip label since? from? to? />   <LowerThird title sub? from? to? />   <SourceLine text />
<PhotoCard src="dien-bien-phu-tren-khong/img/<file>.jpg" caption credit x y w? h? rot? from to? sepia? kb? fromSide? id? />
<AirRaidPulse level hz />
```
Detail levels by zoom: world 110m always; region 50m (lon 90..150, lat -5..30) from zoom 18; North VN 10m with
provinces + rivers (lon 102..109, lat 19..23.5) from zoom 140; usable max zoom ~1000 px/deg.
Weak spots: Hà Nội polygon = today's expanded province (say "Hà Nội", don't claim 1972 borders); site coords approximate;
night + red pulse over Vietnam's red can get very red (keep pulse low).
