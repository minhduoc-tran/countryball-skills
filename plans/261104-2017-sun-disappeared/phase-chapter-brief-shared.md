# Chapter brief (shared by chapter agents A-E): "What If the Sun Disappeared?" (English)

Episode slug `sun-disappeared` (id `SunDisappeared`), ~4:29, ENGLISH voice (LucyLab, final, do not change), for the
English channel "Pencil Man". Same studio, engine and pipeline as the finished Vietnamese episodes `last-one` and
`nghin-dong-moi-giay`: copy their patterns freely. All on-screen text is ENGLISH.

## Read first
- `AGENTS.md` (studio runbook), `~/.claude/skills/what-if-animation/references/kit.md`, `look.md`, `traps.md`.
- Sets in `src/engine/sets/` (header comments): Rooftop (NEW prop `sunGone` 0..1: the Sun winks out, night sky and
  stars; plus `blackout`, `lightsOut`, `cityLit`, `red`, `low`), Street (`night`, `blackout`, `streetStand`),
  Kitchen, Bedroom (`lamp`, `WINDOW`), Study, Classroom, Stairwell, Supermarket, Schematic.
- Reusable episode pieces: `src/episodes/last-one/insert-arm-and-icons.tsx` (`InsertArm`, `PersonIcon`),
  `src/episodes/last-one/shots-chc-shared-props-and-cards.tsx` (numbered cards, candle, dark kitchen),
  `src/episodes/last-one/shots-reusable-from-short-cut.tsx` (CityBlackoutWide etc.),
  `src/episodes/nghin-dong-moi-giay/chb-travel-scenery-props.tsx` (a drawn beach at dusk),
  `src/episodes/nghin-dong-moi-giay/chb-math-icons.tsx` (ClockIcon, BigNum...).
- Your words + cue times: `chapters/sun-disappeared/words-<x>.txt`. Script + sourced facts:
  `src/episodes/sun-disappeared/episode.json` (`script`, `science`). Looks: `src/episodes/sun-disappeared/looks.tsx`.

## Deliver
1. `src/episodes/sun-disappeared/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`, ≤ ~300 lines
   per file; local props in `ch<x>-*.tsx`).
2. `chapters/sun-disappeared/ch<x>.json` (schema in `tools/merge-chapters.py`): shots (with `file`), edit, fx, events,
   repeats.
3. Preview + self-check: `python3 tools/merge-chapters.py sun-disappeared && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py sun-disappeared && npx tsc --noEmit && node
   ~/.claude/skills/what-if-animation/scripts/stills.mjs sun-disappeared && python3
   ~/.claude/skills/what-if-animation/scripts/board.py sun-disappeared`. Look at the storyboard AND every still at full
   size; run the look.md checklist; fix; re-render the fixed ids. ≥ 2 passes. Motion: `stills.mjs sun-disappeared
   --frames <f1> <f2> ...` on 3-4 action shots. (With only your chapter present the first shot starts at frame 0 and
   the last runs to the end: expected.)

## Rules
- Shot ids: your letter + number. Edit cues ONLY `"s:<seconds>"` from your words file; cut on phrases/sentences.
- Pace: A 1.0-2.2 s/shot in the cold open, then 2-3 s; B 2-3.5 s (space schematics may hold 4-5 s with motion);
  C/D 2-3 s; E 2.5-4 s. Nothing static: push-ins, drifting stars, breath, flicker.
- Every line is a picture, literal and readable in one second at phone size. Vary size/angle every cut.
- Cast (alive): Pip (`LOOKS.pipHood`, "you"), little sister (`LOOKS.sis`, ~0.7 scale), mum (`LOOKS.mom`), best friend
  Mo (`LOOKS.mo`), the man in the suit (`LOOKS.suit`, on TV screens), neighbours (simple figures/silhouettes). No
  famous characters, brands, real logos or real people.
- World state: before "minute eight" (chapter A and the start of B) it is a normal sunny/dusk day. From the lights-out
  on, the sky is black with stars at all hours (Rooftop `sunGone={1}`; windows dark). Electric lights still work in
  chapter C, fail gradually in D (candles, torches, heaters glow orange), E is a cold dark world with ice.
- Looks: `"look": "countdown"` on every edit entry from the rule line ("No explosion...") to the last shot before
  "Then, at minute eight" (chapter A only: the chip runs 08:20 -> 00:00 across the run). `"look": "cold"` on the
  freezing shots (from "Then the cold arrives" on, outdoors; not on cosy indoor heater shots). `"memory"` for
  remembered sunny moments if you use any.
- Space schematics (Schematic set): simple line icons: a Sun circle with rays, Earth and Moon dots, orbit ellipses, a
  light ray arrow labelled "8 min 20 s", distance labels ("150,000,000 km", "107,000 km/h"). Facts must match
  `science` exactly (8 min 20 s; 1 second for the Moon; Jupiter > 1 hour; 107,000 km/h; 940,000,000 km in a year;
  -18 °C in a week; -73 °C in a year; 9 in 10 Icelandic homes).
- On-screen text: English, minimal (labels, numbers, a TV ticker). FONT.title / FONT.ui / FONT.hand.
- Draw new props in your own files (kite, beach umbrella, heater, frozen puddle, TV with the suit, ice...). Do NOT edit
  `src/engine/` or other chapters' files. Unique SVG ids per shot. Do not touch other episodes.

## Sound events (cue on your shot ids; only these clips)
room_tone, roof_wind, class_murmur, step, big_step, catch, land, fall_whoosh, clink, shatter, crack, cookie_crunch,
gulp, gasp, laugh (kids), pop, paste_pop, sparkle, ding, buzzer, select_draw, copy_click, glitch, counter_tick,
power_hum, power_down, switch_off, bulb_pop, drone_hit, title_boom, clock_back, rewind, rewind_start, dizzy, shades,
paper_land, cat_chirp, cat_yowl, phone_ring, ting. `[cue, clip, gain, align?, until?]`, gains 0.06-0.3; hits in the
pause after a word; one ambience bed per location. Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
