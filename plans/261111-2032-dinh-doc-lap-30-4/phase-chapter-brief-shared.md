# Chapter brief (shared by chapter agents A-H): "Ngày 30 tháng 4 – Xe tăng vào Dinh Độc Lập"

Episode slug `dinh-doc-lap-30-4` (id `DinhDocLap304`, merge export `dinhDocLap304`), 10:35, Vietnamese voice (LucyLab,
FINAL, do not change). A COUNTRYBALL history documentary of the Hồ Chí Minh Campaign and 30/4/1975, in the same style as
the finished episodes `quang-tri-81-ngay-dem` and `dien-bien-phu-tren-khong` (look at their shot files for patterns):
animated maps, balls with flags, date/clock chips, minimap, front arrows, tanks, helicopters, ships, the Dinh Độc Lập
plan/façade/gate scenes, plus REAL archive photos in framed "ảnh tư liệu" cards with a credit line. NOT the stick-figure
style: no Pip/Mo, no sets. Our files only: `src/episodes/dinh-doc-lap-30-4/`, `chapters/dinh-doc-lap-30-4/`,
`public/dinh-doc-lap-30-4/` (read-only for you). Never edit other episodes.

## ACCURACY (user's top priority)
Every date, time, name, number on screen must match `science` in `src/episodes/dinh-doc-lap-30-4/episode.json` and the
narration exactly. Do NOT invent extra facts on screen (no unit numbers, ranks, counts, quotes, casualty numbers that
aren't in `science` / your words file). When unsure, show less. Gate sequence (official wording, dinhdoclap.gov.vn):
10:45 xe 843 húc cổng PHỤ (and stalls), ngay sau đó xe 390 húc tung cổng CHÍNH; 11:30 Bùi Quang Thận cắm cờ MTDTGP
(PRG flag: red top, blue bottom, yellow star) on the roof. 843 = T-54B, 390 = Type 59. The surrender exchange inside
the palace has disputed wording: no quotes on screen, paraphrase cards only. Frequent Wind numbers carry
"Theo tài liệu phía Mỹ". Kiệt's line carries "Võ Văn Kiệt, 2005".

## Tone
Documentary, respectful, factual; Vietnamese audience; the dead of BOTH sides treated with respect. No gore, bodies,
blood, wounded people, panic close-ups, mocking. Losses = quiet cards, smoke, sad balls, a soft dim. Balls:
- VNM ball (Quân Giải phóng; use flag `VNM`, or `PRG` for MTDTGP forces/flags in the South where it fits): MuCoi or
  `TankCrewHelmet`; determined, focused, tired, proud at the end. Never smug or gloating.
- RVN ball (VNCH flag, user's choice): M1Helmet / Beret; determined at Xuân Lộc, tired, worried, resigned at the end;
  never mocked, never a cowardly joke. In ch G/H the RVN ball may appear sad/quiet; in "today" scenes no RVN ball.
- USA ball: Navy/Marines (NavyCap, M1Helmet), helicopters; worried, hurried; no caricature.
- Real people (Thiệu, Dương Văn Minh, Trần Văn Hương, Văn Tiến Dũng, Nguyễn Thành Trung, Graham Martin, Lý Bửng,
  Bùi Quang Thận, Vũ Đăng Toàn, Nguyễn Văn Tập, Bùi Văn Tùng, Lê Minh Đảo, Võ Văn Kiệt, McMahon, Judge): ONLY a real
  photo if one is in the manifest, else a plain name card (+ simple faceless silhouette). Never caricatures/balls.

## Read first
- `AGENTS.md` (sections 1, 3, 4), `~/.claude/skills/what-if-animation/references/look.md` (readability; stick-figure
  parts don't apply), `traps.md`.
- KIT (import, never edit; `src/countryball/`): NEW Sài Gòn kit cheat sheet
  `plans/261111-2032-dinh-doc-lap-30-4/kit-api-map-sai-gon.md` + demo `SaigonKitDemo` (`demo-sai-gon-kit.tsx`,
  `sai-gon-demo-section-*.tsx`: copy patterns from them); older kits: `plans/261109-1948-thanh-co-quang-tri/kit-api-map-quang-tri.md`
  (tanks, helis, front arrows, ships, smoke, memorial props) and `plans/261107-0952-dien-bien-phu-tren-khong/kit-api-map.md`
  (GeoMap, HUD, PhotoCard, aircraft). A helper the kit lacks → write it in your own `ch<x>-*.tsx` file.
- Your words + cues: `chapters/dinh-doc-lap-30-4/words-<x>.txt`. Facts: episode.json `science` and
  `plans/261111-2032-dinh-doc-lap-30-4/research/facts.md` (section 12 overrides the rest). Photos + credits:
  `public/dinh-doc-lap-30-4/img/manifest.json` (open the jpgs you use).

## Time units (trap)
`ShotProps = { t, len, f }`: `t` = frames since the shot started, 30 fps. Kit scene props `t`/`t0` = FRAMES; HUD
(`ClockChip`, `DateChip`) and `cameraAt` keys = SECONDS (`t / 30`). Always pass time explicitly, never rely on a
component reading `useCurrentFrame()`.

## Visual grammar (consistent across chapters)
- Map scenes: `<GeoMap>` with a keyframed camera, always moving slowly. 1973-1975 maps: neutral land
  `colors={{ VNM: '#B9A88A' }}` (same value everywhere), control shown with `MapFlag`s / translucent overlays / arrows
  (red = Quân Giải phóng, yellow #E8B422 = VNCH, blue-grey = Mỹ). Only "today" maps (ch H) use the normal red VNM.
- HUD: `DateChip` top-left on map scenes with the narrated date ("27.01.1973", "10.03.1975", "26.04.1975"); on 30/4
  use `ClockChip date="30.04.1975"` with the narrated times only (04:58, 07:53, 10:24, 10:45, 11:30). `MiniMap`
  bottom-right on map scenes. Source labels as `LowerThird` sub or small `SourceLine`.
- OSM credit: any frame showing the `saigon` map level or `PalacePlan` → `<SourceLine text={`${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`} />`.
- Photos: `PhotoCard` with Vietnamese `caption` (short, from the manifest) and `credit` = "Ảnh: <credit> / <licence>".
  Ken Burns on. Every photo carries its credit. Use only photos assigned to your chapter (list below); a photo used
  twice in the episode only if listed for both chapters.
- Text on screen: Vietnamese, correct diacritics, short, readable at phone size in one second; VN number format
  ("1.373", "5.595", "30.04.1975", "10:45").
- Hero location continuity: Lê Duẩn (đại lộ Thống Nhất) avenue → main gate → oval lawn → palace façade. Gate intact in
  every shot before ch F's crash; flag on the roof = RVN before 11:30 (ch F), PRG after.

## Chapters (times = voice seconds)
- A 0:00-1:23 (0 cold open → 2c Phước Long): cold open on Lê Duẩn avenue near noon, tank column approaching a closed
  gate (GateCrash crash ≤ 0.3, freeze before impact), PalacePlan top view with tanks on the avenue, title card "NGÀY 30
  THÁNG 4 / XE TĂNG VÀO DINH ĐỘC LẬP" (design it big, channel style), Paris signing (photo + 4 flags: VNM/DRV, PRG, USA,
  RVN), last US troops leave (plane icon, "29.03.1973"), fighting resumes (map flashes), US aid shrinking (bar/fuel gauge
  icon, no numbers), Phước Long 06.01.1975 (map flag), "Mỹ có quay lại?" (USA ball on a carrier/plane that stays away).
- B 1:23-2:48 (3 Tây Nguyên → 4b2 Phan Rang): Buôn Ma Thuột 10.03.1975 (map arrow, flag 11.03), Thiệu's withdrawal
  order (name card), route 7 retreat (long column of tiny vehicles on a map road, rain-dark; no panic close-ups), Huế
  26.03, Đà Nẵng 29.03 (flags pop along the coast), refugee ships (photo if assigned / ships icon), Bộ Chính trị decision
  "trước mùa mưa" (calendar/rain cloud), "14.04.1975: CHIẾN DỊCH HỒ CHÍ MINH" card, Xuân Lộc (map ~80 km, Sư đoàn 18 card
  + Lê Minh Đảo name card, RVN ball determined, artillery both ways), 20→21.04 withdrawal, "cánh cửa phía đông mở",
  Phan Rang 16.04, divisions racing south (truck/ship columns down the coast).
- C 2:48-3:58 (4c Thiệu → 5c plan): Thiệu resigns 21.04 (name card + TV set + speech lines, no quotes), Trần Văn Hương
  card, Thiệu leaves (plane), 08.04 F-5E over Dinh Độc Lập (photos: F-5E + roof bomb marks; Nguyễn Thành Trung name
  card), 17:00 26.04 campaign opens (ClockChip/DateChip), map C.saigonRegion with `CampaignArrows` growing one by one in
  the narrated order (Bắc QĐ1 → Tây Bắc QĐ3 → Đông QĐ4 → Đông Nam QĐ2 → Tây Nam Đoàn 232) with target sites
  highlighted, plan "đánh nhanh vào cơ quan đầu não" (5 targets light up), Văn Tiến Dũng name card.
- D 3:58-5:13 (6 Minh → 7c ships): Dương Văn Minh sworn in 28.04 (photo of his jeep if assigned / name card), A-37s
  over Tân Sơn Nhất (aircraft kit, small bombs on runway, no casualties shown), "Phi đội Quyết Thắng" card, shelling at
  dawn 29.04, McMahon + Judge name cards (quiet, candle), Frequent Wind order, radio with "White Christmas" (snowflake +
  music notes, no lyrics), helicopters shuttling city ↔ fleet (map + RooftopEvacuation), crowds waiting (silhouettes),
  numbers card 1.373 / 5.595 "Theo tài liệu phía Mỹ", ships crowded, helicopter pushed overboard (CarrierDeck + photos),
  small boats.
- E 5:13-6:43 (7c2 Lý Bửng → 8d into city): Lý Bửng's O-1 with family (tiny plane over sea, note dropped, Midway deck
  clears, lands: photo), Martin leaves 04:58 (ClockChip), last helicopter from the embassy roof 07:53, "Mỹ rời Việt Nam"
  (USA ball on a ship, sea horizon), Lữ đoàn 203 on Xa lộ Biên Hòa (map C.cityWide, tank column, infantry on tanks),
  cầu Sài Gòn fight (SaigonBridgeSide with smoke; a tank hit = smoke only; "thương vong ở cả hai bên"), 10:24 Minh's
  ceasefire broadcast (RadioMicrophone + TransistorRadio, guns go quiet: smoke columns thin out), tanks through Hàng
  Xanh into the centre (map C.city → C.downtown), people on the sidewalks (silhouettes, some waving, some watching,
  a closed shutter), Lê Duẩn avenue, the palace at the end.
- F 6:43-7:56 (8e palace history → 9d flag): the palace's story (photo Dinh Norodom 1961, "27.02.1962" bombing card,
  Ngô Viết Thụ card, "31.10.1966", façade with bamboo-screen detail, photo 1969), 10:45 (ClockChip): GateCrash side 843
  stalls, then GateCrash main 390 (THE money shot: give the crash ~2-3 s, impact sound cue in a pause), PalacePlan top
  view of 390 entering, gate flat, "Theo Khu di tích Dinh Độc Lập" source label, crew cards (Bùi Quang Thận 843; 390:
  Vũ Đăng Toàn, Nguyễn Văn Tập + 2 others: names only as listed in science), "which tank first" (two tank icons 843/390
  with cổng phụ / cổng chính tags, a camera/film icon "ảnh, phim của phóng viên nước ngoài"), Thận runs in with the flag
  (PalaceFacade `climb`), RVN flag lowered (respectfully, folded), PRG flag raised (`flagRaise`), ClockChip 11:30.
- G 7:56-9:33 (10 inside → 11c healing): inside the palace (photo of the cabinet room if assigned, Dương Văn Minh +
  cabinet as silhouettes around a table, paraphrase cards: "Chờ bàn giao" → "Chính quyền cũ đã sụp đổ – đầu hàng vô điều
  kiện"), radio station afternoon (RadioMicrophone, ON AIR, Bùi Văn Tùng name card), flags appear across the city
  (MapFlags pop on C.city), Mekong delta provinces flags, "02.05.1975: toàn bộ miền Nam giải phóng", Saigon intact
  (schools, market, church, port icons, calm), war ended + loss (quiet: candles for both sides, "hàng triệu người",
  both balls sad side by side), 02.07.1976 Quốc hội (map of a single Vietnam turning normal red, "Thành phố Hồ Chí Minh"
  label replaces "Sài Gòn"), reunion (balls hugging) and separation (boat leaving, sad), Kiệt's line card ("Võ Văn
  Kiệt, 2005"), the long road of healing (a road toward sunrise).
- H 9:33-10:39 (12 today → 13 cta): today's palace (photos today, night, aerial), special relic "2009", roof bomb
  marks (photo), tanks today (museum photos 843 / 390 + palace replicas), "Bảo vật quốc gia – QĐ 1426/QĐ-TTg, 01.10.2012",
  2025 parade on Lê Duẩn (balls with flags, confetti, fireworks; no weapons firing), "Những người lính năm ấy" (old
  tank-crew silhouettes, Bùi Quang Thận 1948-2012 card), the story told to the next generation (old ball + young ball),
  CTA card "Bạn đã từng đứng trước cánh cổng Dinh Độc Lập chưa?" + comment icon.

## Deliver
1. `src/episodes/dinh-doc-lap-30-4/shots-ch<x>-<topic>.tsx` (one exported component per shot, `React.FC<ShotProps>`
   from `../../engine`, pure function of `t`, ≤ ~250 lines per file); local helpers in `ch<x>-*.tsx`. Don't edit
   shared files, the kit, the engine or other episodes.
2. `chapters/dinh-doc-lap-30-4/ch<x>.json` (schema in `tools/merge-chapters.py`; `"set": "map"` | `"card"` | `"photo"`
   | `"palace"`, `"size": "wide"`).
3. Self-check in YOUR studio copy: `python3 tools/merge-chapters.py dinh-doc-lap-30-4 && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py dinh-doc-lap-30-4 && npx tsc --noEmit`, stills (TEMP RULE), then
   `python3 ~/.claude/skills/what-if-animation/scripts/board.py dinh-doc-lap-30-4`. Look at every still at full size:
   readable in one second, nothing clipped, labels not colliding, photo credits present, facts match science, no gore,
   respectful. Fix, re-render. ≥ 2 passes. Check motion with `--frames`. Your copy's `src/episodes/index.ts` must import
   `dinhDocLap304` from './dinh-doc-lap-30-4' and list it in EPISODES (add it in your copy if missing).

## TEMP RULE + CLEANUP (user: delete leftovers as you go)
Own temp folder for every Remotion command, emptied after each run, e.g. chapter c:
`mkdir -p /tmp/rmx-c && TMPDIR=/tmp/rmx-c node ~/.claude/skills/what-if-animation/scripts/stills.mjs dinh-doc-lap-30-4 [ids]; find /tmp/rmx-c -maxdepth 1 -name 'remotion-*' -exec rm -rf {} +`
Never touch the shared `$TMPDIR`. Stills/frames only, never render video. Disk is limited: delete old stills you no
longer need and scratch files before you report. Shell hooks block commands containing the literal text
"node_modules": don't type it.

## Rules
Shot ids: your letter + number. Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases. Pace 2-4 s per
shot (map moves and photo cards up to ~5 s if animated); nothing static. Every line is a picture. ~1 shot per 3 s of
your chapter. Unique SVG ids (prefix with your shot id).

## Sound events (`[cue, clip, gain, align?, until?]`, gains 0.05-0.22, hits in pauses)
Check exact names in `library/sfx/` (ls) before using one. War/machine: bomb_far, flak, jet_pass, radio_static,
radar_ping, air_raid_siren; synth-sfx: punch_hit, swoosh, rubble, metal_crash (gate impact!), splash, rain, thunder,
siren, sea_waves, drone_buzz. Library: title_boom, drone_hit, paper_land (photo card lands), pop, ding, counter_tick,
glitch, switch_off, power_down, ting, room_tone, roof_wind, class_murmur, crack, shatter, gasp, step. Tank engine/
helicopter beds: use what exists (e.g. drone_buzz low gain, bomber_drone) — no new clips. Explosions sparse, below the
voice; quiet memorial beats get no hits. Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.

## Photos by chapter (public/dinh-doc-lap-30-4/img/, credits in manifest.json)
Caption rules: photos taken AFTER 1975 say so ("ngày nay", "2013"...). The tanks displayed at the palace are tanks of
the SAME TYPE ("xe cùng loại trưng bày tại Dinh"), the original 843 is at Bảo tàng Lịch sử Quân sự Việt Nam, the original
390 at Bảo tàng Lực lượng Tăng-Thiết giáp. The 4 US Army CMH maps are B/W English: crop + overlay Vietnamese labels or
show briefly as "bản đồ tư liệu". No photo of the 30/4 gate/flag moment exists under a free licence: that is animation.
- A: vietnam-peace-agreement-signing, iccs-kiem-tra-quan-my-rut-1973 (caption: quân Mỹ rút khỏi Tân Sơn Nhất, 09.03.1973), gerald-ford-chan-dung-1974
- B: ban-do-buon-ma-thuot-3-1975, tau-pioneer-contender-cho-nguoi-di-tan, ban-do-xuan-loc-4-1975
- C: nguyen-van-thieu-1966, may-bay-f5e-dinh-doc-lap (F-5E trưng bày tại Dinh, ngày nay), san-thuong-dau-bom-8-4-1975, ban-do-cac-mat-tran-quanh-sai-gon, ban-do-sai-gon-that-thu-26-29-4-1975
- D: duong-van-minh-nguyen-khanh-1964 (Minh is one of the two: caption names both), ford-kissinger-rockefeller-28-4-1975, san-bay-tan-son-nhat-29-4-1975, c130-chay-tren-duong-bang-tan-son-nhat, khu-dao-tan-son-nhat-30-4-1975, truc-thang-uh1-ha-canh-blue-ridge, nguoi-di-tan-xuong-ch53-uss-hancock, thuy-quan-luc-chien-tren-uss-hancock, truc-thang-uh1-bi-day-xuong-bien-blue-ridge, truc-thang-bi-day-xuong-bien-uss-okinawa, thuyen-nguoi-di-tan-tiep-can-ham-doi-my, san-thuong-22-gia-long-ngay-nay (today's view; caption so)
- E: cessna-o1-ly-bung-ha-canh-uss-midway, ford-gap-graham-martin-25-3-1975 (Martin is in it: caption), cau-sai-gon-1961, nhin-tu-dinh-ra-duong-le-duan-1996
- F: dinh-norodom-1961, dinh-doc-lap-thang-3-1969, dinh-doc-lap-nhin-tu-tren-cao-2005, bien-thuyet-minh-xe-tang-843
- G: phong-hop-noi-cac, phong-lam-viec-tong-thong, phong-tac-chien-tang-ham, xe-jeep-duong-van-minh (xe phục chế), thanh-pho-ho-chi-minh-toan-canh-2024
- H: dinh-doc-lap-mat-tien-2019, dinh-doc-lap-ve-dem-2013, san-thuong-dau-bom-8-4-1975, xe-tang-843-bao-tang-ha-noi-2012, xe-tang-843-bao-tang-moi-2025, bao-tang-lich-su-quan-su-viet-nam-2025, xe-tang-390-dinh-doc-lap-2013, xe-tang-390-can-canh-2023, xe-tang-843-dinh-doc-lap-2023, xe-tang-843-dinh-doc-lap-chinh-dien, duong-le-duan-2014, cau-sai-gon-2009, thanh-pho-ho-chi-minh-ve-dem-2024, phong-vo-tuyen-tang-ham
