# Chapter brief (shared by chapter agents A-E): "Sẽ ra sao nếu đại dương không còn nước?"

Episode slug `dai-duong-can` (id `NoOcean`, export `daiDuongCan`), ~4:43, Vietnamese voice (LucyLab, FINAL, do not
change). Premise: every drop of ocean water vanishes in one second; rivers, lakes, ice and the SALT stay. Fiction
framing (Pip and his friend Mo at Đà Nẵng beach, mum at the market) carrying real oceanography. Every number is in
`science` of `src/episodes/dai-duong-can/episode.json`: on-screen numbers must match it exactly.

## Tone
Awe first (a hidden world revealed), then fun (treasure hunting), then a slow creeping dread (smell, hunger, salt,
no rain, heat), a relief beat (oxygen), a cosmic sting (Mars), and a warm return to the real sea. Bright, scorching
palette for the drained world; never gory (dead fish are simple shapes, no blood).

## Visual grammar (same in every chapter)
- Shared kit (import, don't edit; read the header comments): `kit-danang-beach.tsx` (`DanangBeach` with `drain`),
  `kit-dry-seabed.tsx` (`DrySeabed`, `StrandedShip`, `FishFlop`, `Anchor`), `kit-ocean-section.tsx` (`BasinSection`),
  `kit-globe.tsx` (`Globe` with `water`, `ridge`, `mars`), `kit-hud.tsx` (`OceanMeter`, `FactStamp`, `BigNum`).
  Kit notes: `kit-palette.ts` (`PAL` colours, `mix`, `fmtM(-3700)` → "−3.700 m"). Beach: horizon y 470, shore y 800,
  `beachWaterlineY(drain)`, `people` default 4 tiny bathers (`[]` for none); at drain 1 no sea is drawn, the far end is
  a dark drop band (add your own sheen/abyss if the shot needs it). Seabed: horizon y 400, shelf lip y 660;
  `StrandedShip` (x, y) = hull meets ground, at |rot| > 8 cover the hull bottom with a foreground rock. Section:
  y = 330 + depth_m × 0.0625, profile draws on over ~26 frames. Globe continents are coarse: keep it small/mid-size,
  no close-ups. `FactStamp` default (960, 800), stays once on. `BigNum` for strings NumCard can't show ("10.935").
- Every time the narrator says "Đó là thật", `FactStamp` thumps on at that word.
- Looks (on edit entries, `src/episodes/dai-duong-can/looks.tsx`): `sec1` GIÂY THỨ 1, `days` NHỮNG NGÀY ĐẦU,
  `months` VÀI THÁNG SAU, `years` VÀI NĂM SAU, `far` HÀNG TRIỆU NĂM SAU, `past` 20.000 NĂM TRƯỚC, `heat`, `mars`,
  `home` (the real sea, ending), `drained` (chip ĐẠI DƯƠNG: 0%). Use the chip looks on the first 1-3 shots of a new
  time jump, not on every shot.
- Cast: Pip `LOOKS.pipHood`, Mo `LOOKS.mo`, mum `LOOKS.mom`, sis `LOOKS.sis`. Mo carries his fishing rod in A/B.

## Per-chapter beats and picture ideas (a guide; better ideas welcome if they stay true to the words)
- **A 0:00-1:06**: Pip floats in the Đà Nẵng sea, sunny; water starts to slide out (drain 0→0.4→1), Pip lands on wet
  sand; TitleCard "SẼ RA SAO NẾU ĐẠI DƯƠNG / KHÔNG CÒN NƯỚC?" over the drained beach; second 1: silence (waves
  freeze, sound cuts), fish flopping, huge ships lying on their sides in mud; Mo on the sea wall with his rod staring
  into the abyss, "Biển đâu rồi mày?"; Globe 71% + OceanMeter 100%→0%, "1,3 TỶ KM³", "97%"; BasinSection "≈ 3.700 M";
  hidden world: Globe `ridge` 65.000 KM, volcano > 10.000 M vs Everest, Mariana 10.935 M, Everest lowered in, "> 2 KM",
  FactStamp.
- **B 1:06-1:57**: Hạ Long karst towers standing on a dry valley floor (draw locally: limestone towers, boats on mud);
  a simple map of Vietnam's coast going dry, a dotted walking path Đà Nẵng → Hoàng Sa (plateaus), label "HOÀNG SA";
  "Nghe như phim": film-clapper beat; `past` look: Sundaland map, sea level −120 M, ancient people walking to
  "BORNEO", FactStamp; treasure rush: crowds with metal detectors and shovels on the seabed, "≈ 3 TRIỆU XÁC TÀU",
  Titanic wreck as a tourist site with a ticket booth / queue "≈ 3.800 M"; Pip and Mo on bicycles down the shelf, find
  a rusty anchor; Internet: a fat undersea cable lying across the desert-like seabed, data pulses running through it,
  "99%", Pip's phone still loads.
- **C 1:57-2:57**: smell: green stink lines over the coast, people pinching noses; "200.000+ LOÀI": a blue whale
  shape and plankton icons fading to grey (gentle, not gory); "3 TỶ NGƯỜI" / "≥ 1/5 ĐẠM": globe of people, fish
  plate; nước mắm bottle (generic label "NƯỚC MẮM"), cá cơm icon crossed out, Pip mourning his bowl of rice; economy:
  "80%" world trade by sea, rows of stranded container ships, idle port cranes, price tags climbing, empty shelves;
  mum in front of an empty fish counter, sign "HẾT HÀNG". Salt: seabed turning white (`salt` 0→1), "~60 M" layer on a
  section, a dust storm blowing onto green rice fields turning them white; Aral Sea then/now map with a rusty ship in
  the desert, FactStamp.
- **D 2:57-4:01**: sky: the ocean as Earth's giant boiling pot, "85%" of vapour; cloud → rain diagram "60%" of land
  rain; clouds thinning; Mekong delta rice fields cracking (draw locally: cracked mud, wilted rice), `years`; heat:
  day/night thermometer swings (`heat` look), "90%" of extra heat absorbed, the ocean as an air-conditioner unit
  switching off; oxygen relief: plankton "≈ 1/2 Ô XY", the atmosphere as a big tank "ĐỦ CHO HÀNG NGHÌN NĂM", Pip
  breathes in relief, then the three threats "NƯỚC / MƯA / CÁI ĂN"; refill: pour rivers, lakes and melting polar ice
  into the empty basin on a BasinSection, the level barely rises: "< 2%", "Không đủ để nghe lại một tiếng sóng".
- **E 4:01-4:43**: Mars: Globe `mars` morph, ancient Mars with rivers/lakes then red desert (`mars` look), FactStamp,
  Earth turning into a Mars twin (`far`); ending: the real sea comes back (`home`): waves, Mo waving from the water,
  Pip tastes salt, "71%", warm golden sea; question card with three choices (RÃNH MARIANA / TITANIC / HOÀNG SA) and
  "Viết ở phần bình luận nhé"; the end card holds through the 3 s tail to the end of the timeline.

## Read first
`AGENTS.md`, `~/.claude/skills/what-if-animation/SKILL.md`, `references/kit.md`, `look.md`, `traps.md`, the kit files
above, your words file `chapters/dai-duong-can/words-<x>.txt`, a finished chapter for conventions:
`src/episodes/tri-hoan/shots-cha-*.tsx` + `chapters/tri-hoan/cha.json`. Sets in `src/engine/sets/` (Street, Kitchen,
Supermarket `empty`, Schematic...). Reusable (import, don't edit): `InsertArm` (`src/episodes/last-one/insert-arm-and-icons.tsx`),
`CargoShip` etc. (`src/episodes/mot-cu-dam/chc-harbour-props.tsx`), `Fish` (`src/episodes/sun-disappeared/chd-ocean-props.tsx`).

## Deliver
1. `src/episodes/dai-duong-can/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`, ≤ ~250 lines
   per file; local props in `ch<x>-*.tsx`). Don't edit kit files, looks.tsx, shared files, the engine or other
   episodes; if the kit lacks something, draw it locally in your chapter's props file.
2. `chapters/dai-duong-can/ch<x>.json` (schema in `tools/merge-chapters.py` docstring).
3. Self-check: `python3 tools/merge-chapters.py dai-duong-can && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py dai-duong-can && npx tsc --noEmit`, stills (TEMP RULE), then
   `python3 ~/.claude/skills/what-if-animation/scripts/board.py dai-duong-can`. Look at every still at full size, run the
   look.md checklist, fix, re-render only fixed ids. ≥ 2 passes. Motion: `--frames`.
   `src/episodes/index.ts` in your copy already imports `daiDuongCan`; only your chapter json is present in your copy,
   so merge builds a preview of your chapter (first shot forced to frame 0: expected).

## TEMP RULE / disk
Own temp folder for every Remotion command, emptied after each run, e.g. chapter c:
`mkdir -p /tmp/rmx-c && TMPDIR=/tmp/rmx-c node ~/.claude/skills/what-if-animation/scripts/stills.mjs dai-duong-can [ids]; rm -rf /tmp/rmx-c/remotion-*`
Never touch the shared `$TMPDIR`. Stills/frames only, never render video. Disk is limited (~15 GB shared by 5
agents): delete your stills once reviewed, before you report.

## Rules
Shot ids: your letter + number (A1, A2...). Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases. Your
first edit entry starts at your chapter's first cue. Pace 1.6-3 s per shot, cards up to 4 s if animated; nothing static.
Every line is a picture, readable in one second at phone size. Vietnamese text with correct diacritics, minimal;
numbers in VN format matching `science` ("71%", "1,3 TỶ KM³", "97%", "≈ 3.700 M", "65.000 KM", "> 10.000 M",
"10.935 M", "8.849 M", "> 2 KM", "−120 M", "20.000 NĂM", "≈ 3 TRIỆU", "≈ 3.800 M", "99%", "200.000+ LOÀI",
"3 TỶ NGƯỜI", "1/5", "80%", "~60 M", "85%", "60%", "90%", "≈ 1/2", "< 2%"). Unique SVG ids.

## Sound events (`[cue, clip, gain, align?, until?]`, gains 0.06-0.25, in pauses)
Only clip names already in `library/sfx/` (name before the hash) incl. `sea_waves` (20 s surf bed for beach shots, cut it with `until`; no looping, so chain a second event for > 20 s) and
`water_drain` (3.5 s: the whole sea sucked away, then silence; chapter A's vanish moment). Useful: roof_wind (hot wind over the dry seabed), step, land, gasp, laugh, pop, sparkle, ding,
buzzer, glitch, counter_tick, splash, rain, thunder, rubble, metal_crash, swoosh, drone_hit, title_boom, tumble,
paper_land, ting, clink, crack, select_draw, fall_whoosh, power_down, power_hum, radar_ping, gulp, shatter.
One ambience bed per location. Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
