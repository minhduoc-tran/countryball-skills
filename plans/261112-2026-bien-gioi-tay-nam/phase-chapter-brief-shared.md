# Chapter brief (shared by chapter agents A-G): "Biên giới Tây Nam 1975-1989" (TikTok, VERTICAL 1080x1920)

Episode slug `bien-gioi-tay-nam` (id `BienGioiTayNam`, merge export `bienGioiTayNam`), 8:24, Vietnamese voice (LucyLab,
FINAL, do not change). A COUNTRYBALL history documentary composed NATIVELY IN PORTRAIT 1080x1920 for TikTok, same style as
the finished `dinh-doc-lap-30-4` / `quang-tri-81-ngay-dem` (animated maps, balls with flags, date chips, minimap, arrows,
props, archive photos in framed cards with a credit). NOT stick-figure: no Pip/Mo, no sets. Our files only:
`src/episodes/bien-gioi-tay-nam/`, `chapters/bien-gioi-tay-nam/`, `public/bien-gioi-tay-nam/` (read-only). Never edit other
episodes, the kit, the engine, Root.

## TIKTOK SAFETY (user's top priority, binding): `plans/261112-2026-bien-gioi-tay-nam/tiktok-safety-rules.md`
Read it fully. In short: no blood/bodies/skulls/bones/wounds/weapons aimed at people/execution/torture/distressed children;
war = map arrows, tank/truck icons, distant smoke; losses = candles, incense, dim light, sad balls. On-screen text never
uses: giết, thảm sát, tàn sát, diệt, tiêu diệt, diệt chủng, máu, xác, hành quyết, tra tấn, Miên, bọn, lũ. Always write
"Khơ Me Đỏ" in full (never "quân Khơ Me", never "người Khơ Me" as enemy) or "chế độ Pôn Pốt". Cambodian PEOPLE are victims,
friends, rebuilders (PRK / KHM balls with krama, friendly). The regime ball (`CAMBODIA_BALLS.regime()`, DK flag + KrCap) is
small, neutral/stern, never demonic, never the hero of a frame, never mocked. No real person as a ball or caricature.

## ACCURACY
Every date, number, name on screen must match `science` in `src/episodes/bien-gioi-tay-nam/episode.json`, the narration,
and `plans/261112-2026-bien-gioi-tay-nam/research/fact-check.md` (overrides facts.md). Don't invent extra facts (no unit
numbers, casualty counts, quotes not in narration/science). Required labels on screen: VN-only numbers carry "theo phía
Việt Nam" (Tân Lập "hơn 500", Ba Chúc "3.157", 19/10 sư đoàn, 18 sư đoàn); "khoảng 1,7 triệu" carries "ước tính, ĐH Yale";
VN fallen = "hàng chục nghìn" (+ small "chưa có con số chính thức") — never a single number. Modern portraits (Hun Sen
2019, Heng Samrin 2019, Chea Sim 2012) say "ảnh năm 2019/2012" in the caption. Spellings: Pôn Pốt, Khơ Me Đỏ, Phnôm Pênh,
Hêng Xom-rin, Hun Xen, Chia Xim, Côm-pông Xom, Nếch Lương, Tà Lơn, Cam-pốt, Mô-ni-vông. VN number format: 3.157, 1.200,
17.04.1975.

## Read first
- `AGENTS.md` (sections 1, 3, 4), `~/.claude/skills/what-if-animation/references/look.md` (readability; stick-figure parts
  don't apply), `traps.md`.
- KIT (import, never edit; `src/countryball/`): NEW portrait + Tây Nam kit cheat sheet
  `plans/261112-2026-bien-gioi-tay-nam/kit-api-map-tay-nam.md` + demo `TayNamKitDemo` (`demo-tay-nam-kit.tsx`,
  `tay-nam-demo-section-*.tsx`: copy patterns from them). Older kits (tanks, ships, smoke, memorial props, PhotoCard, HUD):
  `plans/261111-2032-dinh-doc-lap-30-4/kit-api-map-sai-gon.md`, `plans/261109-1948-thanh-co-quang-tri/kit-api-map-quang-tri.md`,
  `plans/261107-0952-dien-bien-phu-tren-khong/kit-api-map.md`. Look at 2-3 shot files of `src/episodes/dinh-doc-lap-30-4/` for
  the shot pattern. A helper the kit lacks → write it in your own `ch<x>-*.tsx` file.
- Your words + cues: `chapters/bien-gioi-tay-nam/words-<x>.txt`. Photos + credits: `public/bien-gioi-tay-nam/img/manifest.json`
  (open every jpg you use; notes tell where to crop for 9:16).

## PORTRAIT LAYOUT (new: get this right)
Canvas 1080x1920. TikTok covers: top y < 160, bottom y > 1500 (caption + music bar), right column x > 960 for y 700..1500.
All text and key subjects inside x 48..1032 (48..948 for y 700..1500), y 176..1484 (`PORTRAIT_SAFE`). Backgrounds/maps
fill the whole frame (bleed), only the content stays safe. Text big: headlines 64-110 px, body 40-56, credits ≥ 24. One idea
per frame; at most ~8 words of headline. Maps: always a portrait camera (`TAY_NAM_CAMERAS` keys or keys with `w:1080,h:1920`),
`<GeoMap tayNam ...>`, slow camera motion. Photos: `PhotoCard` with `PORTRAIT_SLOTS.photo`/`photoTall`, `captionSize`,
`creditSize`, Ken Burns on, on a themed background (map dimmed, paper texture, dark gradient), not floating on black.

## Time units (trap)
`ShotProps = { t, len, f }`: `t` = frames since shot start, 30 fps. Kit scene props `t`/`t0`/`dur` = FRAMES; HUD (`DateChip`,
`ClockChip`, Counter, LowerThird from/to) and `cameraAt` keys = SECONDS (`t / 30`). Pass time explicitly; never
`useCurrentFrame()`.

## Visual grammar (consistent across chapters)
- Map colours: 1975-78 `TAY_NAM_COLORS`; from 7.1.1979 on `TAY_NAM_COLORS_PEACE`. Arrows: VN/Front red (`side="vn"`/`"front"`),
  Khơ Me Đỏ dark maroon (`side="kr"`). `DateChip` top-left on map scenes with the narrated date ("17.04.1975",
  "30.04.1977", "07.01.1979"). `MiniMap` only where it doesn't collide. `SourceLine text={TAY_NAM_ATTRIBUTION}` on map frames.
- Balls: VNM (MuCoi / soldier helmet) determined, kind, tired in war, never smug/gloating. Cambodian people: PRK or KHM + krama.
  Regime: small DK ball. THA/others neutral. Ball faces read on a phone (r ≥ 110 when a ball is the subject).
- Cold-open motif (ch A) and its callback (ch E): Monivong bridge + empty Phnôm Pênh street (`PhnomPenhStreet life` 0 → 1
  later in ch E "chợ mở lại"). Keep the street look consistent (same `PhnomPenhStreet` params/backdrop).
- Remembrance beats (Ba Chúc, Tân Lập, Tuol Sleng, fallen soldiers): slow, quiet, warm dim light, candles/incense/lotus,
  no hits, no shaking; text minimal.

## Chapters (times = voice seconds; see your words file)
- A 0:00-1:17 (0 cold open → 2b toll): midday 07.01.1979 Monivong bridge, T-54 icon (TankTop/side) crosses into an empty city
  (`PhnomPenhStreet life=0`, shutters, dust), questions "Vì sao?" on screen; TITLE CARD "BIÊN GIỚI TÂY NAM / 1975 - 1989"
  big, channel style (+ map of the SW border glowing, `BorderRun`); rewind effect to the 1960s (photos 1964, "hòn ngọc châu Á");
  17.04.1975 KR enter (photo Monivong 17/4/1975 + map); city emptied (people silhouettes walking out on roads, carrying
  bundles, calm not panic); money (riel note flying away, no burning), market shutters, school/hospital/pagoda icons going grey;
  "công trường khổng lồ" (paddies, endless work, a clock); "3 năm 8 tháng 20 ngày" counter; "khoảng 1,7 triệu" + "Cứ 5 người
  thì 1 người" (5 person icons, 1 fades to a candle) with "ước tính, ĐH Yale".
- B 1:17-2:29 (3 islands → 4b tân lập): map Gulf of Thailand: Phú Quốc (early 05.1975, arrow repelled), Thổ Chu 10.05.1975
  (photo satellite), "hơn 500 người dân bị bắt đi" (empty houses, boats gone) "theo phía Việt Nam"; retaken late May (Navy
  ship icons, VNM ball); 1976 talks table (VNM ball + DK ball at a table, papers, no handshake), "không đi đến đâu"; small
  border nibbling (tiny arrows); 30.04.1977 night: reunification fireworks then border flashes An Giang, "14 xã", houses burning
  far away (orange glow, smoke), families leaving with bundles, militia Vĩnh Xương / Vĩnh Gia holding (helmet balls in a
  trench line, map BorderRun); Tây Ninh 24.09.1977: a Trung thu lantern (star lantern) on a quiet commune at night, it dims
  (NO child figure), "hơn 500 người dân" "theo phía Việt Nam", "11 thầy cô giáo" (an empty classroom, 11 chalk marks or 11
  small candles).
- C 2:29-3:47 (4c defectors → 6b memorial): KR ranks cracking (balls slipping away), 06.1977 Hun Xen (name card + modern
  photo "ảnh năm 2019"), crosses border (map dotted path Memot → Tây Ninh), 1978 purge in the east, Hêng Xom-rin + Chia Xim
  photos "ảnh năm 2019/2012"; 12.1977 VN push back then withdraw (arrows out and back); 31.12.1977 diplomatic cut (a telegram/
  phone line snapping); 05.02.1978 peace offer as a document with 4 points appearing one by one (ngừng bắn / lùi 5 km /
  hiệp ước hữu nghị / giám sát quốc tế) and "TỪ CHỐI" stamp-free: the paper simply blows away; Ba Chúc 18.04.1978 map zoom
  (`baChuc` key), two pagodas (photo Phi Lai), people seeking shelter as silhouettes walking into pagoda gates (calm), then
  the quiet card "3.157 người dân" "theo phía Việt Nam" with candles, "phụ nữ, người già, trẻ em" as text only; today:
  memorial photos exterior (crop out the sign), lotus, incense, 16/3 âm lịch, international visitors (silhouettes with
  flowers).
- D 3:47-5:00 (7 front → 8b river): map with 19 KR divisions along the border (UnitBoxes, maroon, "theo phía Việt Nam");
  02.12.1978 the Front founded at Xnuôn, Kra-chê (photo monument + emblem; PRK flag rises), call for help (radio waves);
  Bộ Chính trị decision; 23.12.1978: 10 KR boxes push → VN + Front arrows along ~1.200 km (BorderRun full length, counter
  "1.200 km"), "18 sư đoàn, hàng trăm xe tăng, xe bọc thép, máy bay" (icons, theo phía Việt Nam); "không chỉ đẩy lùi";
  arrows along Routes 1, 7, 2 (`phnomPenhRegion` key); 31.12 VN territory regained (border glows calm); 02.01 KR lines
  broken; Neak Lương ferry with one tank per trip (`MekongFerry`, photo ferry today); night river crossing by landing craft;
  Tà Lơn: Navy's first sea landing (ships approach Kampot coast at night, map `gulfIslands`), road to Côm-pông Xom.
- E 5:00-6:15 (8c phnom penh → 9b second birth): 07.01.1979 TRƯA: arrows converge, PRK flag on Phnôm Pênh, tanks over
  Mô-ni-vông into the empty city (callback to A), "15 ngày"; 10.01 Côm-pông Xom (photo port today), 17.01 all towns (flags pop
  over the map, colours switch to PEACE); KR remnants to the Thai border (maroon dots retreat west); Tuol Sleng: ONLY the
  exterior photo of the school building + a film camera icon "phóng viên truyền hình Việt Nam", text "hơn 12.000 người từng
  bị giam giữ", "rất ít người sống sót" — very quiet, no other imagery; 08.01.1979 council (Hêng Xom-rin card); people
  returning on long roads (Crowd walking, bundles, family reunions as two balls hugging, one ball waiting alone); street
  comes back to life (`PhnomPenhStreet life` 0 → 1), market (photo Central Market), school, pagoda bell; 18.02.1979 treaty
  (VNM + PRK balls, two pens); 1980 riel returns (banknote design simplified, not a real note); 7/1 holiday: fireworks over
  Independence Monument, "ngày sinh lần thứ hai", label "theo Chính phủ Campuchia".
- F 6:15-7:20 (10 decade → 11 going home): "chiến tranh chưa kết thúc"; 10 years timeline 1979 → 1989; famine relief (RiceSacks,
  aid ship photo 1979, trucks to villages, rail line), rebuilding (SchoolHouse, government building, Cambodian army ball
  training), KR guerrillas at the Thai border (maroon dots in forest, a mine warning sign: a red triangle "MÌN" sign, no
  explosion on people), embargo/isolation (VNM ball alone, closed door, map with grey neighbours, no country insulted);
  "Đội quân nhà Phật" (warm card, lotus, pagoda roof, VN soldier ball with a krama gift); withdrawals from 1982 (truck
  columns heading east, year labels); 25.09.1989 farewell at the Independence Monument (photos day/night, `FarewellConvoy`
  with flowers, big Crowd waving, "hơn 10 vạn người"), 26.09.1989 "khoảng 26.000" by road, river, sea (three routes on a map),
  border gate welcome: flowers, lion dance (simple lion head shape), firecrackers (paper confetti, no explosions).
- G 7:20-8:24 (11b fallen → 14 cta): "không phải ai cũng được trở về": empty helmet on a grave-less hill with incense (no
  graves of bones), "hàng chục nghìn chiến sĩ" (+ "chưa có con số chính thức"), a mother ball waiting by a window over
  the years (calendar pages), search teams (two flags, shovels, a small flag-draped box carried respectfully, NO remains),
  "850 liệt sĩ, mùa khô 2025-2026"; cemetery photo (caption: Nghĩa trang Liệt sĩ TP.HCM); peace: 23.10.1991 Paris (Eiffel
  outline + document), 1993 elections (ballot box, UNTAC photo 1992), Kingdom flag KHM rises; 1998 Pôn Pốt qua đời (plain name
  card, no photo, no ball), KR movement fades (maroon dots vanish); tribunal (a courthouse icon with UN + KHM flags, "ECCC");
  Friendship Monument (photos + kit `FriendshipMonument`), "Hòa bình hôm nay..." with VNM + KHM balls side by side at
  sunset, candles for both peoples; "Hãy nhớ..."; CTA card: "Gia đình bạn có ai từng là lính tình nguyện ở Campuchia?" +
  comment icon (inside the safe zone, not under the TikTok caption bar).

## Deliver
1. `src/episodes/bien-gioi-tay-nam/shots-ch<x>-<topic>.tsx` (one exported component per shot, `React.FC<ShotProps>` from
   `../../engine`, pure function of `t`, ≤ ~250 lines per file); local helpers in `ch<x>-*.tsx`.
2. `chapters/bien-gioi-tay-nam/ch<x>.json` (schema in `tools/merge-chapters.py` docstring; `"set": "map"|"card"|"photo"|"scene"`,
   `"size": "wide"`).
3. Self-check in YOUR studio copy: `python3 tools/merge-chapters.py bien-gioi-tay-nam && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py bien-gioi-tay-nam && npx tsc --noEmit`; your copy's
   `src/episodes/index.ts` must import `bienGioiTayNam` from './bien-gioi-tay-nam' and list it in EPISODES (add it in your copy
   if missing). Stills (TEMP RULE), then `python3 ~/.claude/skills/what-if-animation/scripts/board.py bien-gioi-tay-nam`.
   Look at EVERY still at full size: phone-readable in one second, inside the safe zone, nothing clipped, labels not
   colliding, photo credits present, facts match, TikTok-safe. Fix, re-render. ≥ 2 passes. Check motion with `--frames`.

## TEMP RULE + CLEANUP (user: delete leftovers as you go)
Own temp folder for every Remotion command, emptied after each run, e.g. chapter c:
`mkdir -p /tmp/rmx-c && TMPDIR=/tmp/rmx-c node ~/.claude/skills/what-if-animation/scripts/stills.mjs bien-gioi-tay-nam [ids]; find /tmp/rmx-c -maxdepth 1 -name 'remotion-*' -exec rm -rf {} +`
Never touch the shared `$TMPDIR`. Stills/frames only, never render video. Disk is limited (~18 GB free, 7 agents): delete
old stills/scratch before you report. Shell hooks block commands containing the literal text "node_modules": don't type it.

## Rules
Shot ids: your letter + number. Edit cues ONLY `"s:<seconds>"` from your words file. CUT AT SENTENCE OR COMMA STARTS
(word times inside long sentences are estimates and can be off by ~1 s; sentence starts are exact). Pace 2-4 s per shot
(maps/photos up to ~5 s if animated); nothing static. ~1 shot per 3 s of your chapter. Unique SVG ids (prefix with your
shot id). First shot of your chapter starts at your chapter's first cue.

## Sound events (`[cue, clip, gain, align?, until?]`, gains 0.05-0.22, hits in pauses)
Names that exist in `library/sfx/` (check with ls): title_boom, paper_land (photo card lands), pop, ding, ting, swoosh,
counter_tick, glitch, rewind, rewind_start, clock_back, switch_off, power_down, room_tone, roof_wind, class_murmur, step,
big_step, sea_waves, splash, rain, thunder, radio_static, radar_ping, drone_buzz (low engine bed), bomb_far, flak, rubble,
metal_crash, sparkle, gasp (avoid), siren. No new clips. Explosions rare, far, under the voice; remembrance beats get NO
hits (room_tone / roof_wind beds only). Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.

## Photos by chapter (public/bien-gioi-tay-nam/img/, credits in manifest.json; caption Vietnamese, credit "Ảnh: <credit> / <licence>")
Use only photos listed for your chapter. English map labels/titles: crop or overlay Vietnamese labels; NEVER show the word
"invasion" (ban-do-tien-quan-12-1978-1-1979 is reference only unless cropped to a label-free area).
- A: phnom-penh-nhin-tu-may-bay-1964, duong-pho-phnom-penh-1964, cau-monivong-phnom-penh-17-4-1975, ban-do-phnom-penh-thang-4-1975, ban-do-cac-vung-cua-chinh-quyen-khome-do-1975-1978, pol-pot-gap-ceausescu-1978 (optional; caption names Pôn Pốt + Ceaușescu, 1978), angkor-wat-phan-chieu-mat-ho
- B: phu-quoc-nhin-tu-tren-cao, quan-dao-tho-chu-ve-tinh, ha-tien-ven-bien, ban-do-bien-gioi-viet-nam-campuchia-1976, kenh-vinh-te-tinh-bien, vung-bay-nui-an-giang-tu-nui-cam, cay-thot-not, bieu-tuong-cua-khau-moc-bai, nui-ba-den-tay-ninh
- C: hun-sen-2019, heng-samrin-2019, chea-sim-2012, canh-dong-tri-ton-an-giang, cua-khau-tinh-bien-an-giang, chua-phi-lai-ba-chuc, nha-mo-ba-chuc-ben-ngoai (crop the sign out), loi-vao-khu-tuong-niem-ba-chuc, pho-ba-chuc-an-giang
- D: tuong-dai-mat-tran-2-12-kratie, bieu-trung-mat-tran-cuu-nuoc-campuchia, ban-do-campuchia-cia-1997, xe-tang-t54-bao-tang-lich-su-quan-su, xe-tang-loi-nuoc-pt76-bao-tang, pha-neak-leung-song-mekong, ban-do-tien-quan-12-1978-1-1979 (reference/cropped only)
- E: cang-sihanoukville-kampong-som, toa-nha-tuol-sleng-ben-ngoai, heng-samrin-2019, hoang-cung-phnom-penh, chua-wat-phnom, cho-trung-tam-phnom-penh, bo-song-sisowath-phnom-penh, ho-chieu-cong-hoa-nhan-dan-campuchia, dai-doc-lap-phnom-penh-ve-dem
- F: tau-cho-hang-cuu-tro-campuchia-1979, ban-do-kampuchea-cia-1982, trai-ty-nan-khao-i-dang-1984, xe-tang-cu-bao-tang-chien-tranh-siem-reap, dai-doc-lap-phnom-penh, dai-doc-lap-phnom-penh-ve-dem, tuong-huu-nghi-khmer-viet-nam-kampot
- G: nghia-trang-liet-si-tp-hcm, dai-tuong-niem-chien-tranh-campuchia-viet-nam-siem-reap, cong-dai-tuong-niem-siem-reap, untac-xe-tuan-tra-kampot-1992, norodom-sihanouk-1983 (only if it fits the 1991 beat, caption "Norodom Sihanouk, 1983"), dai-tuong-niem-choeung-ek-tu-xa, tuong-dai-huu-nghi-viet-nam-campuchia-toan-canh, tuong-dai-huu-nghi-viet-nam-campuchia-can-canh, tuong-dai-huu-nghi-viet-nam-campuchia-doc, tuong-dai-huu-nghi-sihanoukville, phnom-penh-ngay-nay-hoang-cung-va-nha-cao-tang, phnom-penh-nhin-tu-tren-cao-2019, angkor-wat-phan-chieu-mat-ho
