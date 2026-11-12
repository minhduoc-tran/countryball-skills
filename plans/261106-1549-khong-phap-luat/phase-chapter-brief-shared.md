# Chapter brief (shared by chapter agents A-E): "Sẽ ra sao nếu xã hội không có pháp luật?"

Episode slug `khong-phap-luat` (id `NoLaw`), ~4:27, Vietnamese voice (LucyLab, final, do not change). FICTION: one
morning every law in your Vietnamese city is gone: no police, courts, contracts, rules. People are the same. The story
goes: hour 1 = fun freedom (red lights, no helmet, free milk) → the crossroads jam → day 1 shops shut, wages unpaid,
bank closed → week 1 "luật rừng" (the strong take, a toll gate at the alley, grandma's lottery tickets snatched, locked
doors) → the twist (real: 6 Tongan boys, 1965, wrote their own rules) → month 1 the neighbourhood writes rules again →
"law is a promise millions keep". Only the numbers and historical events are real.

## Tone
Light and satirical at first, tense in the middle, warm at the end. Suitable for teenagers: no weapons, no blood, no
fighting shown on screen; menace is implied (a rope barrier and a cash box at the toll gate, a hand snatching a stack
of lottery tickets, shut shutters, a padlock). History is shown as sepia illustrations/cards, never graphic.

## Read first
- `AGENTS.md`, `~/.claude/skills/what-if-animation/references/kit.md`, `look.md`, `traps.md`.
- Sets in `src/engine/sets/`: Street (VN street, `market`, `night`, `blackout`, `streetStand`, `Motorbike`,
  `TrafficLight`, `CrossroadsTop`), Kitchen, Bedroom, Classroom, Stairwell, Rooftop, Supermarket, Schematic.
- Reusable (import, don't edit): `src/episodes/tien-vo-han/che-dawn-alley-backdrop.tsx` (`DawnAlley`),
  `che-xoi-cart-and-money-props.tsx` (`XoiCart`, `Steam`), `src/episodes/khong-ai-ngheo/cast-looks.ts` (`GRANDMA` =
  the lottery-ticket grandma, `WORKER` = Mo's dad), number-card helpers in `src/episodes/khong-ai-ngheo/` and
  `src/episodes/neu-chien-tranh/` (e.g. `NumCard`), `src/episodes/last-one/insert-arm-and-icons.tsx` (`InsertArm`).
- Cast: Pip (`LOOKS.pipHood`), Mo (`LOOKS.mo`), sis (`LOOKS.sis`, ~0.7 scale), mum (`LOOKS.mom`), GRANDMA, WORKER,
  the shop owner (`LOOKS.suit` without the jacket is fine, or a local look), a "toll gang" of 3 generic young men
  (local look, hoodies/caps, faces not cruel-cartoonish, just cocky). Same clothes all episode.
- Your words + cues: `chapters/khong-phap-luat/words-<x>.txt`. Script + facts:
  `src/episodes/khong-phap-luat/episode.json` (`script`, `science`). Looks: `src/episodes/khong-phap-luat/looks.tsx`.

## Looks (on edit entries)
`h1` (GIỜ ĐẦU TIÊN) for hour-one shots, `d1` day one, `w1` week one, `m1` month one; `alert` (red pulse + "KHÔNG CÒN
LUẬT" bar) on 1-3 shock moments (the crash, the snatch); `blackout` for candle-lit night; `memory` for real history
(Montreal 1969, Hobbes 1651, medieval Europe, Tonga 1965); `peace` for the rebuilt neighbourhood and the ending.
Number cards keep their section's look.

## Deliver
1. `src/episodes/khong-phap-luat/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`, ≤ ~250
   lines per file; local props in `ch<x>-*.tsx`). Don't edit shared files, the engine or other episodes.
2. `chapters/khong-phap-luat/ch<x>.json` (schema in `tools/merge-chapters.py`).
3. Self-check: `python3 tools/merge-chapters.py khong-phap-luat && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py khong-phap-luat && npx tsc --noEmit`, stills (TEMP RULE), then
   `python3 ~/.claude/skills/what-if-animation/scripts/board.py khong-phap-luat`. Look at every still at full size,
   run the look.md checklist, fix, re-render. ≥ 2 passes. Motion: `--frames`.
   `src/episodes/index.ts` in your copy imports `khongPhapLuat` (the name merge-chapters generates).

## TEMP RULE
Own temp folder for every Remotion command, emptied after each run, e.g. chapter c:
`mkdir -p /tmp/rmx-c && TMPDIR=/tmp/rmx-c node ~/.claude/skills/what-if-animation/scripts/stills.mjs khong-phap-luat [ids]; rm -rf /tmp/rmx-c/remotion-*`
Never touch the shared `$TMPDIR`. Stills/frames only, never render video.

## Rules
Shot ids: your letter + number. Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases. Pace 1.6-3 s,
number cards up to 4 s if animated; nothing static. Every line is a picture, readable in one second at phone size.
Vietnamese text with correct diacritics, minimal; numbers in VN format and matching `science` exactly
("1,19 TRIỆU", "42%", "30% → 90%+", "1969", "16 GIỜ", "6", "100+", "12", "1651", "x HÀNG CHỤC", "1965", "6 CẬU BÉ",
"15 THÁNG", "NOBEL 2009"). Real people (Hobbes, Ostrom) only as simple respectful silhouettes/portrait sketches with
their name, never caricatures. Unique SVG ids.

## Sound events (`[cue, clip, gain, align?, until?]`, gains 0.06-0.25, in pauses)
Library + synth clips: room_tone, roof_wind, class_murmur (crowd), step, catch, land, clink, crack, shatter, gasp,
laugh, pop, sparkle, ding, buzzer, glitch, counter_tick, power_down, switch_off, paper_land, phone_ring, ting,
drone_hit, title_boom, tumble, siren (ambulance), metal_crash (the crash, gain ≤ 0.18), swoosh (the snatch),
rain, thunder. One ambience bed per location. Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
