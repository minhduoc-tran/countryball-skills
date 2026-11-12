# Chapter brief (shared by chapter agents A-E): "Sẽ ra sao nếu chiến tranh ập đến?"

Episode slug `neu-chien-tranh` (id `IfWar`), ~4:48, Vietnamese voice (LucyLab, final, do not change). FICTION: an
ordinary modern Sunday in your Vietnamese city (coffee with Mo, sis doing homework, mum selling xôi at the alley
mouth), then a war arrives. The story follows time: hour 1, day 1, week 1, month 1, year 1, after the guns stop, the
return. Only the NUMBERS are real (from other places: Ukraine 2022, Access Now, UNHCR, UNICEF, VNMAC...).

## Tone & taboo (most important)
- Human, quiet, dignified, NOT action. No combat, no soldiers, no weapons firing, no explosions on people, no blood,
  no bodies, no flags, no uniforms, no named or recognisable enemy, no aircraft insignia. The war is only ever felt:
  a phone alert, a siren, distant smoke on the horizon, a power cut, empty shelves, a queue, a closed school, a bus
  of evacuees, a backpack. Keep it suitable for teenagers.
- Real numbers appear on clean schematic cards (Schematic set) with a small source tag and "ĐÓ LÀ THẬT" tick; the
  places in the numbers (Ukraine...) are only labels on a plain outline map, never shown at war.
- Warmth matters as much as fear: neighbours sharing porridge, a phone-charging station from a car battery, the
  goodbye hug of Pip and Mo at the bus station, sis writing in her notebook to not forget, the return.

## Read first
- `AGENTS.md`, `~/.claude/skills/what-if-animation/references/kit.md`, `look.md`, `traps.md`.
- Sets in `src/engine/sets/` (header comments): Street (VN street, `market`, `night`, `blackout`, `streetStand`,
  `Motorbike`, `bus`), Kitchen, Bedroom (`lamp`), Classroom (`empty`), Stairwell (shelter/basement feel), Rooftop
  (`blackout`, `lightsOut`, `cityLit`), Supermarket (`empty`, `dark`), Schematic. Engine props: `Cat` in
  `src/engine/props.tsx` (sis's cat).
- Reusable (import, don't edit): `src/episodes/tien-vo-han/che-dawn-alley-backdrop.tsx` (`DawnAlley`),
  `che-xoi-cart-and-money-props.tsx` (`XoiCart`, `Steam`), `src/episodes/mot-cu-dam/che-props-storm-and-icons.tsx`
  (`AlertPhone`), `src/episodes/mot-cu-dam/chb-night-props.tsx` (`RecPhone`), `src/episodes/khong-ai-ngheo/cast-looks.ts`
  (`GRANDMA` = the old neighbour downstairs, `WORKER` = Mo's dad / the mechanic), `src/episodes/last-one/*`
  (`InsertArm`, `PersonIcon`, number cards), `src/episodes/tien-vo-han/cha-vietnam-map-props.tsx` (VN outline).
- Cast: Pip (`LOOKS.pipHood`, "you"), Mo (`LOOKS.mo`), sis (`LOOKS.sis`, ~0.7 scale), mum (`LOOKS.mom`), GRANDMA,
  WORKER. Pip's family keeps the SAME clothes all episode; the cat is grey-white.
- Your words + cue times: `chapters/neu-chien-tranh/words-<x>.txt`. Script + facts:
  `src/episodes/neu-chien-tranh/episode.json` (`script`, `science`). Looks: `src/episodes/neu-chien-tranh/looks.tsx`.

## Looks (on edit entries)
- Time chips, put on EVERY shot of that time section: `h1` (GIỜ ĐẦU TIÊN), `d1` (NGÀY ĐẦU TIÊN), `w1` (TUẦN ĐẦU TIÊN),
  `m1` (THÁNG ĐẦU TIÊN), `y1` (NĂM ĐẦU TIÊN). Exceptions: `alert` on the 1-3 shots where a phone emergency alert
  fires; `blackout` on power-cut shots; `memory` for the past; `peace` for the cold-open Sunday, the return and the
  ending. Number cards keep their section's time chip.

## Deliver
1. `src/episodes/neu-chien-tranh/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`; ≤ ~250
   lines per file; local props in `ch<x>-*.tsx`). Don't edit shared files, the engine or other episodes.
2. `chapters/neu-chien-tranh/ch<x>.json` (schema in `tools/merge-chapters.py`).
3. Self-check: `python3 tools/merge-chapters.py neu-chien-tranh && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py neu-chien-tranh && npx tsc --noEmit`, stills (TEMP RULE), then
   `python3 ~/.claude/skills/what-if-animation/scripts/board.py neu-chien-tranh`. Look at every still at full size,
   run the look.md checklist, fix, re-render. ≥ 2 passes. Motion: `--frames`.
   `src/episodes/index.ts` in your copy imports `neuChienTranh` (the name merge-chapters generates).

## TEMP RULE
Own temp folder for every Remotion command, emptied after each run, e.g. chapter c:
`mkdir -p /tmp/rmx-c && TMPDIR=/tmp/rmx-c node ~/.claude/skills/what-if-animation/scripts/stills.mjs neu-chien-tranh [ids]; rm -rf /tmp/rmx-c/remotion-*`
Never touch the shared `$TMPDIR`. Stills/frames only, never render video.

## Rules
Shot ids: your letter + number. Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases. Pace 1.6-3 s
(the emotional beats may breathe to 3.5 s with slow push-ins); nothing static. Every line is a picture, readable in
one second at phone size. Vietnamese text with correct diacritics, minimal. Numbers in VN format and matching
`science` exactly. Unique SVG ids.

## Sound events (`[cue, clip, gain, align?, until?]`, gains 0.06-0.25, in pauses)
siren (alert/air-raid, use sparingly), phone_ring, ting, rain, thunder (distant rumble only), drone_buzz, room_tone,
roof_wind, class_murmur (crowd), step, catch, clink, crack, gasp, pop, sparkle, ding, counter_tick, power_down,
switch_off, bulb_pop, paper_land, cat_chirp, glitch (network down), buzzer (error), drone_hit (tension sting),
title_boom. No punch/explosion clips. One ambience bed per location. Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
