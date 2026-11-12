# Chapter brief (shared by chapter agents A-E): "Sẽ ra sao nếu thế giới này không còn ai nghèo?"

Episode slug `khong-ai-ngheo` (id `NoPoverty`), ~3:51, Vietnamese voice (LucyLab, final, do not change). A warm,
hopeful, thought-provoking episode (not a fight episode): overnight, nobody on Earth is poor. Nobody becomes rich;
everyone simply has ENOUGH (food, a roof, school, a doctor), like a floor nobody falls below. Real numbers about
poverty today, real experiments (Kenya cash transfers, Finland basic income), the costs (hard jobs pay more, the
planet), the twist (relative poverty), and a family ending ("Nhà mình đủ.").

## Read first
- `AGENTS.md`, `~/.claude/skills/what-if-animation/references/kit.md`, `look.md`, `traps.md`.
- Sets in `src/engine/sets/` (header comments): Street (VN street, `market`, `night`, `streetStand`, `Motorbike`),
  Kitchen, Bedroom, Classroom (`empty`), Stairwell, Rooftop, Supermarket, Schematic. Reusable episode pieces (import,
  don't edit): `src/episodes/tien-vo-han/che-dawn-alley-backdrop.tsx` (dawn alley), `che-xoi-cart-and-money-props.tsx`
  (mum's xôi cart `XoiCart`, `Steam`, banknotes), `chc-props-money-and-prices.tsx` (`Note`, `PriceTag`), its suit
  scenes; `src/episodes/last-one/insert-arm-and-icons.tsx` (`InsertArm`, `PersonIcon`), schematic cards in
  `src/episodes/last-one/shots-chc-shared-props-and-cards.tsx`, `src/episodes/tien-vo-han/cha-vietnam-map-props.tsx`
  (Vietnam outline). Look at finished shots in `src/episodes/tien-vo-han/shots-*.tsx` for the style of numbers cards.
- Shared cast for this episode: `src/episodes/khong-ai-ngheo/cast-looks.ts` (`GRANDMA` lottery seller, `VILLAGE_GIRL`,
  `DOCTOR`, `WORKER`) plus `LOOKS.pipHood` (you), `mom`, `sis`, `mo`, `suit`. Use these, don't invent other looks for them.
- Your words + cue times: `chapters/khong-ai-ngheo/words-<x>.txt`. Script + sourced facts:
  `src/episodes/khong-ai-ngheo/episode.json` (`script`, `science`). Looks: `src/episodes/khong-ai-ngheo/looks.tsx`.

## Deliver
1. `src/episodes/khong-ai-ngheo/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`; ≤ ~250 lines
   per file; local props in `ch<x>-*.tsx`). Do NOT edit shared files, the engine or other episodes.
2. `chapters/khong-ai-ngheo/ch<x>.json` (schema in `tools/merge-chapters.py`): shots (with `file`), edit, fx, events,
   repeats.
3. Preview + self-check: `python3 tools/merge-chapters.py khong-ai-ngheo && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py khong-ai-ngheo && npx tsc --noEmit`, then stills (see the TEMP
   RULE) and `python3 ~/.claude/skills/what-if-animation/scripts/board.py khong-ai-ngheo`. Look at the storyboard AND
   every still at full size; run the look.md checklist; fix; re-render fixed ids. ≥ 2 passes. Motion: `--frames`.
   (With only your chapter present, the first shot is forced to frame 0 and the last runs to the end: expected.)

## TEMP RULE (disk is limited; several agents run at once)
Give every Remotion command its OWN temp folder and empty it after each run, e.g. for chapter b:
`mkdir -p /tmp/rmx-b && TMPDIR=/tmp/rmx-b node ~/.claude/skills/what-if-animation/scripts/stills.mjs khong-ai-ngheo [ids]; rm -rf /tmp/rmx-b/remotion-*`
Never delete anything in the shared `$TMPDIR`. Stills/frames only, never render video.

## Visual grammar
- The premise is shown, not told: the "before" (today's hardship, real numbers) vs the "after" (the same place, now
  with enough). Use `"look": "before"` on today's-world shots and real-number cards about today, `"look": "zero"` on
  the new-world shots (chip "NGƯỜI NGHÈO: 0"), `"look": "warm"` on family moments and the ending.
- A recurring motif: a glowing golden FLOOR line under people's feet (the "sàn") in the new world.
- Numbers on screen in Vietnamese format, minimal text: "2 TỶ", "1990", "≈ 700 TRIỆU", "x7", "58%", "4,9 TRIỆU",
  "685 TRIỆU" (no electricity), "250 TRIỆU" (out of school), "1.000 USD", "x2,5", "< 1%", "560 €/THÁNG", "5 TRÁI ĐẤT",
  "60%". Facts must match `science` exactly. Never show suffering graphically: dignity first (no crying skeletal kids,
  no gore); show empty chairs, a walk for water, a closed school door, a pharmacy price tag.
- Every line is a picture, literal and readable in one second at phone size. Vary size/angle every cut. Pace
  1.6-2.8 s/shot (number cards up to 4 s if animated). Nothing static: push-ins, sways, blinking, steam, wind.
- On-screen text Vietnamese with correct diacritics (FONT.ui Space Mono, FONT.hand Itim, FONT.title).
- No real people, logos or brands; countries only as map outlines/flags-free labels ("KENYA", "PHẦN LAN", "ẤN ĐỘ").

## Rules
Shot ids: your letter + number. Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases. Unique SVG ids.

## Sound events (cue on your shot ids, `[cue, clip, gain, align?, until?]`, gains 0.06-0.25, in pauses)
Library: room_tone, roof_wind, class_murmur (crowd/classroom), step, catch, land, clink, crack, gasp, laugh (kids),
pop, paste_pop, sparkle, ding, buzzer, select_draw, copy_click, counter_tick, power_hum, power_down, switch_off,
bulb_pop, drone_hit, title_boom, paper_land, phone_ring, ting, tumble, rain (bed, until), thunder, siren,
arcade_count. One ambience bed per location. Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
