# Chapter brief (shared by chapter agents A-H): "Hà Nội - Điện Biên Phủ trên không"

Episode slug `dien-bien-phu-tren-khong` (id `SkyDienBienPhu`, merge-chapters export name `dienBienPhuTrenKhong`),
~13:02, Vietnamese voice (LucyLab, final, do not change). A COUNTRYBALL history documentary of Operation Linebacker II
(18-29 Dec 1972), told on animated maps like the countryball history channels: dark sea, flat muted land, balls with
flags, date chip / counter / minimap HUD, B-52 cells crossing the map, SAM-2 trails, radar scopes, plus REAL archive
photos in framed "ảnh tư liệu" cards with a credit line. This is NOT the stick-figure style: no Pip/Mo, no sets.

## Tone (important)
Documentary, respectful, factual. Vietnamese audience; history told honestly. War is shown through maps, icons,
aircraft, missiles, flak, fire glow and balls. NEVER gore, bodies, blood, wounded people, crying children drawn on
screen. Civilian tragedy (Bạch Mai, Khâm Thiên) = map + burning-block glow from far away, then quiet: the real
memorial photo, a candle/incense, sad balls, a soft dim, numbers on a plain card. The USA ball is not a cartoon villain
(no evil laughs, no mocking); it is determined, worried, later sad/relieved. VNM ball: determined, focused, proud,
grieving. Where the script says "theo phía Việt Nam / theo phía Mỹ", show both labels clearly (e.g. two cards side by
side). Real people (Nixon, Kissinger, Lê Đức Thọ, Hồ Chí Minh, Phạm Tuân, Vũ Xuân Thiều, Joan Baez, Olof Palme) appear
ONLY as their real photo (if in the manifest) or a plain name card with a simple respectful silhouette, never as
caricatures or balls with faces. No Republic of Vietnam (Saigon) flag anywhere: "chính quyền Sài Gòn" = a Sài Gòn city
marker / a document, no ball. Soviet aid = a crate labelled "LIÊN XÔ VIỆN TRỢ", no USSR ball. Use the DRV flag = the VNM
flag in the kit.

## Read first
- `AGENTS.md` (sections 1, 3, 4), `~/.claude/skills/what-if-animation/references/look.md` (readability checklist; the
  stick-figure parts don't apply), `traps.md`.
- KIT (import, never edit; everything in `src/countryball/`):
  - Map: `plans/261107-0952-dien-bien-phu-tren-khong/kit-api-map.md` and the pattern `src/countryball/demo-map-kit.tsx`.
  - Balls, aircraft, SAM/flak/shootdown/bomb carpet/burning city/tracers/searchlights/radar: read the headers of
    `countryball.tsx`, `ball-*.tsx`, `aircraft-*.tsx`, `fx-*.tsx`, `radar-*.tsx` and the demos
    `demo-fx-kit.tsx`, `fx-demo-sections-*.tsx`. Kit stills (what it looks like): `/tmp/kitcheck/sheet.jpg`.
  - If you need a small helper the kit lacks, write it in your own `ch<x>-*.tsx` file.
- Your words + cues: `chapters/dien-bien-phu-tren-khong/words-<x>.txt`. Script + sources (`science`):
  `src/episodes/dien-bien-phu-tren-khong/episode.json`. Archive photos + captions + credits:
  `public/dien-bien-phu-tren-khong/img/manifest.json` (open the jpgs you use to see them).

## Time units (trap)
`ShotProps = { t, len, f }`: `t` = frames since the shot started, `len` = shot length in frames, 30 fps. Kit components
mostly take seconds or explicit times: ALWAYS pass time explicitly (e.g. `t={t / 30}`), never rely on a component
reading `useCurrentFrame()` (that is the global frame in an episode). Check each component's header for its unit.

## Visual grammar (consistent across chapters)
- Map scenes: `<GeoMap>` with a keyframed camera (`cameraAt`) that is always moving slowly (drift/zoom), never frozen.
  Night raids: `night` 0.6-0.9, city lights; day/background history: night 0.
- HUD: `DateChip` top-left on map scenes with the date being narrated ("12.1972", "18.12.1972"; year only for
  background like "1954", "1965"); `NightChip` "ĐÊM 3/12" during the 12 nights (18/12 = đêm 1 ... 29/12 = đêm 12);
  `MiniMap` bottom-right on map scenes. No running "bị bắn rơi" counter (the two sides' totals differ); per-night facts
  go on a `LowerThird` with their source, e.g. "Đêm 20/12: 6 / 99 B-52 không trở về" sub "Theo Không quân Mỹ".
  A `Counter` is fine for undisputed numbers (129 B-52, 729 lần xuất kích, 20.000+ tấn bom, 591 tù binh).
- Photos: `PhotoCard` with `caption` (Vietnamese, from the manifest, shortened) and `credit` = "Ảnh: <credit> / <licence>"
  (e.g. "Ảnh: USAF / Public domain", "Ảnh: calflier001 / CC BY-SA 2.0"). Ken Burns always on. Every photo shown MUST
  carry its credit line. Use only photos assigned to your chapter (below) unless told otherwise.
- Text on screen: Vietnamese with correct diacritics, short, readable at phone size in one second; numbers match
  `science` exactly in VN format ("129", "6 / 99", "1.624", "20.000+", "27.01.1973").
- Balls: VNM ball usually with `MuCoi` (pith helmet) in military scenes, `Headset` for radar crews; USA ball with
  `PilotHelmet`/`UsafCap`; FRA ball only as host in Paris. Balls sit on the map near their country or in full-screen
  "talk" scenes over a dimmed map.

## Chapters and photos
- A 0:00-1:40: cold open (radar noise spreading toward Hà Nội, B-52 reveal), title card (big countryball-style title
  "HÀ NỘI - ĐIỆN BIÊN PHỦ TRÊN KHÔNG", "12 NGÀY ĐÊM", design it in your files), 1954 Geneva + 17th parallel, 1965,
  Rolling Thunder ("Sấm Rền"), Paris talks 1968, Linebacker I + Hải Phòng mining. Photos: f4b-vf111-dropping-bombs,
  le-duc-tho-kissinger.
- B 1:40-3:16: breakdown (Kissinger "Hòa bình đã trong tầm tay", Saigon objects, Nixon decides), the B-52 (8 engines,
  6 crew, cell of 3, carpet ~1 km x 3 km), Arc Light in the South, ~200 B-52 from Guam + U-Tapao, escorts, the 10+ hour
  flight, targets (Yên Viên, Gia Lâm, Hải Phòng). Photos: nixon-portrait, b52d-mk117-bombs-andersen,
  b52d-dropping-bombs-vietnam, andersen-afb-150-b52s-1972, f105-f4-kc135-refuel, eb66e-destroyer-side-view.
- C 3:16-5:03: Hồ Chí Minh's prediction (photo ho-chi-minh-1946 + quote card), the jamming problem (RadarScope with
  jam, ManualNotebook "cẩm nang"), SAM-2 (Soviet aid crate; >10 m, >3x sound, >20 km), how a launch works (step by
  step), evacuation, loudspeaker "Đồng bào chú ý...", militia on rooftops. Photos: ho-chi-minh-1946,
  dvina-sa2-missile-hanoi.
- D 5:03-6:51: night 1 (sirens, 129 B-52 in three waves, flares, flak, SAM trails, first B-52 falls; "3, theo phía Mỹ"),
  same routes, the post-target turn weakness, Hải Phòng/Thái Nguyên + day raids, tail gunner (US says shot a MiG; VN
  doesn't confirm), night of 20/12 (99 → 6 lost, US figure; tactics change). Photo: map-raid-19-dec.
- E 6:51-8:41: Bạch Mai 22/12 (28 medical staff; US: bombs strayed), Christmas pause 36 h, Joan Baez in a shelter
  (name card + recorder icon, no likeness), 26/12 largest raid (120 B-52, ~15 min, many directions), the sound of those
  nights, Khâm Thiên (≈2.000 houses, 287 dead incl. 56 children; then memorial photo, incense), world reaction (Palme,
  Western press "Christmas bombing", Congress). Photos: map-raid-26-dec, kham-thien-memorial.
- F 8:41-10:01: SAM stocks running low, firing only when sure; 27/12 Phạm Tuân MiG-21 from Yên Bái (VN account vs US:
  no B-52 lost to MiGs; in 1980 first Vietnamese in space, show a Soyuz rocket icon + "1980"), B-52 into Hữu Tiệp lake
  in Ba Đình, Vũ Xuân Thiều 28/12 over Sơn La (died aged 27; Hero title), 29/12 last night, 30/12 Nixon halts north of
  the 20th parallel (parallel line on map). Photos: mig21-5121-museum, b52-wreck-huu-tiep-lake.
- G 10:01-11:36: tallies: 729 B-52 sorties, 20.000+ tons; two-column card "Theo phía Việt Nam: 81 máy bay, 34 B-52" /
  "Theo phía Mỹ: 15 B-52 + ~12 máy bay chiến thuật"; "chưa bao giờ mất nhiều B-52 đến thế"; 1.624 Hà Nội civilians
  (quiet card); final deal ≈ October draft; 8.1.1973 back to Paris; 27.1.1973 Paris Accords (60 days, POWs); 591 POWs,
  Gia Lâm 12.2.1973 "Homecoming". Photos: vietnam-peace-agreement-signing, pows-gia-lam-1973, pows-await-gia-lam,
  hoa-lo-1973.
- H 11:36-13:02: the name "Điện Biên Phủ trên không" (1954 Điện Biên Phủ map callback → 1972 Hà Nội sky), today's
  Hà Nội (lake wreck, B-52 Victory Museum on Đội Cấn, Khâm Thiên statue), Bạch Mai rebuilt with help from American
  donors, 1975 unification, 1995 normalisation, 2023 comprehensive strategic partners (VNM and USA balls side by side,
  calm, a handshake-free gesture: both looking at the lake), ending reflection, CTA "Bạn đã đến hồ Hữu Tiệp chưa?".
  Photos: b52-wreck-huu-tiep-lake, b52-museum-sam2, b52-tail-fin-wreck, kham-thien-memorial.

## Deliver
1. `src/episodes/dien-bien-phu-tren-khong/shots-ch<x>-<topic>.tsx` (one exported component per shot, `React.FC<ShotProps>`
   from `../../engine`, pure function of `t`, ≤ ~250 lines per file); local helpers in `ch<x>-*.tsx`. Don't edit
   shared files, the kit, the engine or other episodes.
2. `chapters/dien-bien-phu-tren-khong/ch<x>.json` (schema in `tools/merge-chapters.py`; `"set": "map"` or `"card"` or
   `"photo"` or `"radar"`, `"size": "wide"`).
3. Self-check: `python3 tools/merge-chapters.py dien-bien-phu-tren-khong && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py dien-bien-phu-tren-khong && npx tsc --noEmit`, stills (TEMP RULE),
   then `python3 ~/.claude/skills/what-if-animation/scripts/board.py dien-bien-phu-tren-khong`. Look at every still at
   full size: readable in one second, nothing clipped, labels not colliding, photo credits present, no gore. Fix,
   re-render. ≥ 2 passes. Check motion with `--frames`. Your copy's `src/episodes/index.ts` imports
   `dienBienPhuTrenKhong`.

## TEMP RULE + CLEANUP (the user asked: delete leftovers as you go)
Own temp folder for every Remotion command, emptied after each run, e.g. chapter c:
`mkdir -p /tmp/rmx-c && TMPDIR=/tmp/rmx-c node ~/.claude/skills/what-if-animation/scripts/stills.mjs dien-bien-phu-tren-khong [ids]; find /tmp/rmx-c -maxdepth 1 -name 'remotion-*' -exec rm -rf {} +`
Never touch the shared `$TMPDIR`. Stills/frames only, never render video. Disk is limited (~19 GB): delete old stills
you no longer need, and any scratch files you made, before you report. Shell hooks block commands containing the
literal text "node_modules": don't type it.

## Rules
Shot ids: your letter + number. Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases. Pace 2-4 s per
shot (map moves and photo cards up to ~5 s if animated); nothing static. Every line is a picture. ~25-35 shots per
chapter. Unique SVG ids (prefix with your shot id).

## Sound events (`[cue, clip, gain, align?, until?]`, gains 0.05-0.22, hits in pauses)
War clips: bomber_drone (8 s bed under B-52 shots), bomb_carpet, bomb_far, flak, sam_launch, air_raid_siren,
radar_ping, radio_static (radar jamming / loudspeaker), jet_pass. Library: title_boom, drone_hit, paper_land (photo
card lands), pop, ding, counter_tick, glitch, switch_off, power_down, ting, room_tone, roof_wind, class_murmur (crowd),
crack, shatter, gasp, step. Keep explosions sparse and below the voice; the quiet civilian beats get no hits. Music is
handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
