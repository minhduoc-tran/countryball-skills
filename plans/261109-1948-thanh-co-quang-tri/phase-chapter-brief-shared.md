# Chapter brief (shared by chapter agents A-H): "81 ngày đêm Thành cổ Quảng Trị"

Episode slug `quang-tri-81-ngay-dem` (id `QuangTri81NgayDem`, merge export `quangTri81NgayDem`), 11:43, Vietnamese
voice (LucyLab, FINAL, do not change). A COUNTRYBALL history documentary of the 1972 battle for the Quảng Trị Citadel
(28/6-16/9/1972), in the same style as the finished episode `dien-bien-phu-tren-khong` (look at its shot files for
patterns): animated maps (dark sea, flat muted land), balls with flags, date chip / minimap HUD, front arrows, shell
arcs, B-52 cells, naval gunfire, the Citadel seen from above, plus REAL archive photos in framed "ảnh tư liệu" cards
with a credit line. NOT the stick-figure style: no Pip/Mo, no sets.

WARNING: `thanh-co-quang-tri` and `thanh-co-quang-tri-lua` are OTHER (vertical TikTok) episodes. Never edit, render or
delete anything of theirs. Our files: `src/episodes/quang-tri-81-ngay-dem/`, `chapters/quang-tri-81-ngay-dem/`,
`public/quang-tri-81-ngay-dem/`.

## Tone (important)
Documentary, respectful, factual; a Vietnamese audience; the dead of BOTH sides are treated with respect. War is shown
through maps, icons, arrows, aircraft, ships, shells, smoke, fire glow, crumbling walls and balls. NEVER gore, bodies,
blood, wounded people drawn on screen, drowning figures. Losses = numbers on plain cards, empty helmets/candles/incense,
sad balls, a soft dim, quiet. Balls:
- VNM ball (= Quân Giải phóng / QĐND; use the VNM flag): MuCoi helmet in military scenes; determined, focused,
  exhausted, grieving, proud. Never smug or gloating.
- RVN ball (VNCH flag, user's explicit choice; = "quân đội Sài Gòn"): M1Helmet, red Beret = Dù, green Beret = Thủy quân
  lục chiến (TQLC). Determined, tired, worried; NOT a cartoon villain, never mocked, never cowardly jokes.
- USA ball: B-52 / Navy (NavyCap) / advisers; determined, later neutral. No evil laughs.
- Real people (Nixon, Thiệu, Ngô Quang Trưởng, Nguyễn Văn Thạc, Lê Bá Dương) appear ONLY as their real photo (if in the
  manifest) or a plain name card with a simple respectful silhouette; never as caricatures or balls with faces.
Where the script says "theo phía Việt Nam / theo nhiều nguồn / theo tài liệu phía Mỹ", show that source label on screen.

## Read first
- `AGENTS.md` (sections 1, 3, 4), `~/.claude/skills/what-if-animation/references/look.md` (readability checklist; the
  stick-figure parts don't apply), `traps.md`.
- KIT (import, never edit; everything in `src/countryball/`):
  - Old map/HUD/photo API: `plans/261107-0952-dien-bien-phu-tren-khong/kit-api-map.md`, pattern `src/countryball/demo-map-kit.tsx`.
  - NEW Quảng Trị kit (local geo, CitadelPlan, ground-war fx, accessories): `plans/261109-1948-thanh-co-quang-tri/kit-api-map-quang-tri.md`
    and the demo `QuangTriKitDemo` source; kit look: `/tmp/kitqt/sheet.jpg`.
  - Balls, aircraft, SAM/flak/bomb carpet/burning city/tracers/flares: headers of `countryball.tsx`, `ball-*.tsx`,
    `aircraft-*.tsx`, `fx-*.tsx` and demos `demo-fx-kit.tsx`, `fx-demo-sections-*.tsx`.
  - A small helper the kit lacks → write it in your own `ch<x>-*.tsx` file.
- Your words + cues: `chapters/quang-tri-81-ngay-dem/words-<x>.txt`. Script + sources (`science`):
  `src/episodes/quang-tri-81-ngay-dem/episode.json`. Photos + captions + credits:
  `public/quang-tri-81-ngay-dem/img/manifest.json` (open the jpgs you use to see them).

## Time units (trap)
`ShotProps = { t, len, f }`: `t` = frames since the shot started, `len` = shot length in frames, 30 fps. Kit components
mostly take seconds or explicit times: ALWAYS pass time explicitly (e.g. `t={t / 30}`), never rely on a component reading
`useCurrentFrame()` (global frame in an episode). Check each component's header for its unit.

## Visual grammar (consistent across chapters)
- Map scenes: `<GeoMap>` with a keyframed camera (`cameraAt`), always moving slowly (drift/zoom), never frozen.
  Night scenes: `night` 0.6-0.9. Day: 0.
- HUD: `DateChip` top-left on map scenes with the narrated date ("30.03.1972", "28.06.1972", "1972"); during the 81 days
  a `NightChip`-style day counter "NGÀY 1/81" ... "NGÀY 81/81" where a date is known (28/6 = ngày 1, 7/7 = ngày 10,
  11/7 = 14, 27/7 = 30, 30/7 = 33, 9/9 = 74, 15/9 = 80, 16/9 = 81); `MiniMap` bottom-right on map scenes.
  Disputed numbers go on a `LowerThird`/card WITH their source ("328.000 tấn bom đạn" sub "Theo phía Việt Nam").
- Colours of sides: QĐND/Quân Giải phóng arrows + markers red (#C8573F/VNM red), VNCH yellow (#E8B422) with red stripe
  accent, US blue-grey. Same in every chapter.
- Photos: `PhotoCard` with `caption` (Vietnamese, from the manifest, short) and `credit` = "Ảnh: <credit> / <licence>".
  Ken Burns always on. Every photo shown MUST carry its credit line. Use only photos assigned to your chapter.
- Text on screen: Vietnamese with correct diacritics, short, readable at phone size in one second; numbers match
  `science` exactly in VN format ("328.000", "35.000+", "81", "27.01.1973").
- Hero location: the Citadel (`CitadelPlan`): its `damage` should rise across the episode: ch C ~0-0.2 (intact),
  D 0.3-0.7, E/F 0.7-0.95, G ruins 1.0, H = today's memorial park (green, damage 0, the memorial in the centre; if the
  kit has no "today" mode, use photos + a calm green plan).

## Chapters and photos (manifest file names)
- A 0:00-1:58 (beats 0 cold open → 4 response): cold open on the Citadel + Thạch Hãn at night (shells, smoke, then the
  smoke clears to ruins), title card "81 NGÀY ĐÊM / THÀNH CỔ QUẢNG TRỊ" (design it, countryball-channel style, big),
  1972 war context + Paris talks stalled (Paris map + table), Vietnamization (USA ball leaving, RVN ball holding),
  17th parallel / Bến Hải / QL1 + đường 9 map, 30/3 offensive (red arrows across the DMZ), Đông Hà / Cam Lộ / Ái Tử fall,
  1/5 liberation (VNM flag over the province), refugees (photo only), Nixon response (bombing + mining), Thiệu orders
  recapture. Photos: le-duc-tho-kissinger.jpg, 004.jpg, 008.jpg, nixon-portrait.jpg.
- B 1:58-3:25 (4b truong → 8 plan): Ngô Quang Trưởng (name card), why Quảng Trị (Paris table, territory = cards),
  Lam Sơn 72 on 28/6 (yellow arrows from Mỹ Chánh north along QL1 + coast), forces (Dù red beret, TQLC green beret,
  tanks, "35.000+ quân" sub "Theo phía Việt Nam"), US firepower (B-52s, tactical jets, 7th Fleet ships off the coast),
  USS Newport News (photo + "50.000+ quả đạn"), plan "≈ 2 TUẦN" stamp, 7/7 Dù reach the southern edge, walls in sight.
  Photos: marine1.jpg, marine2.jpg, 013.jpg, b52d-dropping-bombs-vietnam.jpg, 006.jpg.
- C 3:25-5:01 (9 citadel → 13b marines): Citadel history (1809 Gia Long, 1837 Minh Mạng; square, ~2.000 m perimeter,
  ~4 m walls, moat, 4 gates: build it up on CitadelPlan with dimension labels), 1967 aerial photo, the river (south bank
  vs north bank = rear), defenders (unit cards: E48/F320B, E27 Triệu Hải, local battalions; then E95/F325 + others),
  11/7 heliborne landing NE of town (helicopters, one shot down = smoke trail, no crash gore), Dù attacks stopped,
  handover to TQLC end of July (red beret ball tired, green beret ball steps in), "2 tuần → 1 tháng", TQLC from the
  east, street-by-street, "vài chục mét". Photos: 1967.jpg, 024.jpg.
- D 5:01-6:40 (14 tonnage → 18 rain): the firepower: "328.000 tấn bom đạn" (Theo phía Việt Nam), "Mỹ không công bố
  riêng", "Tháng 7: 2.000+ lượt B-52" (Theo tài liệu phía Mỹ), per soldier 100 bombs + 200 shells (icon grid), the
  never-ending noise, day (jets + artillery) / night (B-52 carpet) / sea (naval guns), walls crumbling (side view),
  callback to the DBP episode (B-52 cell carpet ~ several km; small "Xem tập: Điện Biên Phủ trên không" chip), life in
  bunkers and trenches (cutaway), letters home (envelope icons carried across the river, one doesn't return: quiet),
  monsoon rain, flooded trenches, river rising. Photos: boeing-b-52-dropping-bombs.jpg,
  bombs-from-b-52-arc-light-strike-exploding.jpg, 023.jpg.
- E 6:40-7:50 (19 crossing → 23 other side): the destroyed iron bridge, bến Vượt, night crossings (boats, rafts,
  flares, water columns; tiny figures only, no drowning shown), "một đại đội → vài người" (company icons fading,
  "Theo lời kể cựu chiến binh"), students 6/9/1971 (university buildings → backpacks → map road south), Nguyễn Văn
  Thạc (name card, dates 1952-1972, a diary book "Mãi mãi tuổi hai mươi", no face drawn), the other side: young RVN
  soldiers in the same rain (both balls under the same smoky sky, sad, no mockery). No photos (maybe none needed).
- F 7:50-8:45 (24 september → 26 flag): early September big assault from many directions (yellow arrows close in),
  walls = rubble, new units still crossing each night, 15/9 22:00 order to withdraw (clock "22:00"), silent night
  crossing back to the north bank, 16/9 VNCH flag over the west gate (small flag on the ruined plan, RVN ball tired, not
  triumphant), "2 TUẦN → 81 NGÀY", only the south bank retaken: map with the river line, north half still red.
- G 8:45-10:10 (27 cost → 30b flags): cost card "Theo nhiều nguồn: ~4.000 chiến sĩ Quân Giải phóng hy sinh" + "Sư đoàn
  TQLC VNCH: 5.000+ chết và bị thương" + "Số liệu chưa thống nhất" (quiet, candles), the search for remains today
  (quiet: a small team icon, incense), ruins (town wiped out; the gate with bullet holes photo), Paris: Oct 1972 draft →
  breakdown → 12 days of B-52 over Hà Nội (quick callback map) → 27.01.1973 Paris Accords (photo) → US leaves, Thạch Hãn
  becomes the border (two flags across the river), 19.03.1975 + 30.04.1975 unification, the "cắm cờ" race before the
  ceasefire (flags popping up on a map). Photos: 2012.jpg, vietnam-peace-agreement-signing.jpg.
- H 10:10-11:43 (31 today → 37 cta): today's Citadel (green memorial park; special national relic "2013"), the student
  soldiers memorial, "nghĩa trang không nấm mộ" (quiet, grass, incense), hoa đăng on the Thạch Hãn at night (many
  lanterns drifting, candle glow), the poem: 4 lines appear one by one in a hand font over the river ("— Lê Bá Dương"),
  songs (music notes drifting), the 2025 film "Mưa đỏ" (a plain title card + cinema seats icon, no poster), ending
  (bridges across the river, both banks calm; TODAY scenes use only the VNM ball (no RVN ball today); a calm river,
  lanterns, "chèo thật nhẹ" with a small boat gliding slowly), CTA card "Bạn đã từng đến Thành cổ Quảng Trị chưa?".
  Photos: citadel-memorial-today.jpg, citadel-today-wide.jpg, student-soldiers-memorial.jpg,
  thach-han-flower-wharf-2018.jpg.

## Deliver
1. `src/episodes/quang-tri-81-ngay-dem/shots-ch<x>-<topic>.tsx` (one exported component per shot, `React.FC<ShotProps>`
   from `../../engine`, pure function of `t`, ≤ ~250 lines per file); local helpers in `ch<x>-*.tsx`. Don't edit
   shared files, the kit, the engine or other episodes.
2. `chapters/quang-tri-81-ngay-dem/ch<x>.json` (schema in `tools/merge-chapters.py`; `"set": "map"` | `"card"` |
   `"photo"` | `"citadel"`, `"size": "wide"`).
3. Self-check in YOUR studio copy: `python3 tools/merge-chapters.py quang-tri-81-ngay-dem && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py quang-tri-81-ngay-dem && npx tsc --noEmit`, stills (TEMP RULE),
   then `python3 ~/.claude/skills/what-if-animation/scripts/board.py quang-tri-81-ngay-dem`. Look at every still at full
   size: readable in one second, nothing clipped, labels not colliding, photo credits present, no gore, respectful.
   Fix, re-render. ≥ 2 passes. Check motion with `--frames`. Your copy's `src/episodes/index.ts` must import
   `quangTri81NgayDem` from './quang-tri-81-ngay-dem' and list it in EPISODES (add it in your copy if missing).

## TEMP RULE + CLEANUP (the user asked: delete leftovers as you go)
Own temp folder for every Remotion command, emptied after each run, e.g. chapter c:
`mkdir -p /tmp/rmx-c && TMPDIR=/tmp/rmx-c node ~/.claude/skills/what-if-animation/scripts/stills.mjs quang-tri-81-ngay-dem [ids]; find /tmp/rmx-c -maxdepth 1 -name 'remotion-*' -exec rm -rf {} +`
Never touch the shared `$TMPDIR`. Stills/frames only, never render video. Disk is limited (~16 GB): delete old stills
you no longer need, and any scratch files, before you report. Shell hooks block commands containing the literal text
"node_modules": don't type it.

## Rules
Shot ids: your letter + number. Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases. Pace 2-4 s per shot
(map moves and photo cards up to ~5 s if animated); nothing static. Every line is a picture. ~25-35 shots per chapter
(~1 shot per 3 s of your chapter). Unique SVG ids (prefix with your shot id).

## Sound events (`[cue, clip, gain, align?, until?]`, gains 0.05-0.22, hits in pauses)
War clips (in library/sfx): bomber_drone (8 s bed under B-52), bomb_carpet, bomb_far, flak, sam_launch, air_raid_siren,
radar_ping, radio_static, jet_pass; synth-sfx: punch_hit, swoosh, rubble, metal_crash, splash, rain, thunder, siren,
sea_waves. Library: title_boom, drone_hit, paper_land (photo card lands), pop, ding, counter_tick, glitch, switch_off,
power_down, ting, room_tone, roof_wind, class_murmur, crack, shatter, gasp, step. Check the exact names exist in
`library/sfx/` (ls) before using one. Keep explosions sparse and below the voice; quiet memorial beats get no hits
(rain/water/room tone only). Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.

## Map colours in 1972 (lead's note after the kit review)
The kit colours all of Vietnam VNM red by default. For 1972 maps (chapters A-G) do NOT paint the whole country red:
pass `colors={{ VNM: '#B9A88A' }}` (or similar neutral warm land; use the same value everywhere: `#B9A88A`) and show
control with translucent overlays / hatching (red = Quân Giải phóng, yellow = VNCH) and small flags, plus the DMZ band.
Only "today" maps (ch H, and the 1975 unification beat in G) use the normal red VNM colour.
Show `OSM_ATTRIBUTION` (SourceLine) on any frame where the Quảng Trị OSM level or CitadelPlan is visible.
