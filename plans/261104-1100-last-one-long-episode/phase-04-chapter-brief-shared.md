# Phase 4: chapter brief (shared by chapter agents A-E)

Episode "Sẽ ra sao nếu thế giới chỉ còn mình bạn?" — long cut, ~5:14, Vietnamese voice (LucyLab, final, do not change).
Engine: Remotion + SVG stick-figure "What If" style. Every frame is code.

## Read first
- `~/.claude/skills/what-if-animation/SKILL.md`, `references/kit.md`, `references/look.md`, `references/traps.md`
- Your studio copy's `src/engine/` (sets, rig, props, ui, light). New sets: `sets/street.tsx` (+ street props), `sets/supermarket.tsx` (+ `food-props.tsx`); read their header comments for coordinates.
- Example shots: `src/episodes/copy-paste/shots.tsx`, `src/episodes/rewind/shots.tsx`
- This episode: `src/episodes/last-one/shots-cha-cold-open.tsx` (A1-A8), `shots-reusable-from-short-cut.tsx` (TitleOverEmptyCity, PopulationCountdown, RooftopLookRound, LonelinessCigarettes, WorriedCloseUpRedLight, CityBlackoutWide — alias them, e.g. `export const C12 = CityBlackoutWide;`, or copy and vary), `insert-arm-and-icons.tsx` (InsertArm for hands in inserts, PersonIcon, CigaretteIcon)
- Your chapter's words + times: `chapters/words-<x>.txt`; the full script and sourced facts: `src/episodes/last-one/episode.json` (`script`, `science`)

## What you deliver
1. `src/episodes/last-one/shots-ch<x>-<topic>.tsx` files (one component per shot, pure function of `t`; split files at ~300 lines; kebab-case names).
2. `chapters/ch<x>.json` (schema in `tools/merge-chapters.py` docstring): `shots` (each with `file` = the tsx file name without extension), `edit`, `fx`, `events`, `repeats`.
3. Preview: `python3 tools/merge-chapters.py last-one && python3 ~/.claude/skills/what-if-animation/scripts/plan.py last-one && npx tsc --noEmit && node ~/.claude/skills/what-if-animation/scripts/stills.mjs last-one && python3 ~/.claude/skills/what-if-animation/scripts/board.py last-one`. Look at `out/last-one/storyboard.jpg` and every still at full size; run the look.md storyboard checklist honestly; fix; re-render (`stills.mjs last-one B3 B7`). At least 2 passes. Then motion-check 3-4 action shots with `python3 ~/.claude/skills/what-if-animation/scripts/motiongrid.py last-one B2 B5`.
   (With only your chapter present, the first cut is forced to frame 0 and your last shot runs to the end of the voice: expected, ignore.)

## Rules
- Shot ids: your chapter letter + number (`B1`, `B2`, ...). Edit cues ONLY as `"s:<seconds>"` taken from `words-<x>.txt` (already 2 frames early). First edit = your chapter's first word; nothing after your chapter's end time.
- Cut on phrases. Pace: A morning 1.8-2.6 s/shot; B fun 1.4-2.2 s; C cost 2.2-3.5 s (schematics may hold to 5 s with action inside); D/E 2.4-3.8 s. No static frame: slow push-ins (`kf` on camT zoom), dust, sways, blinking lights. Vary size/angle every cut (wide, medium, close-up, insert, OTS, high, low).
- Every line is a picture. Illustrate the words literally and simply; one read in a second at phone size.
- Cast: only Pip (`LOOKS.pipHood`, the hoodie) is alive on screen. Mum, dad, sister, best friend appear only as photos, drawings, phone screens or inside the `memory` look (warm sepia). Never resemble a famous character or brand.
- Continuity: Day 1 morning (Ch A) -> day 2+ fun (B) -> the costs (C) -> day 5 cat, day 10, day 20, birthday (D) -> nights, sister's room, the button, night 100 (E). The cat (`Cat` prop) exists from day 5 on, and sits with Pip at the end. Calendar crosses match the day (`WallCalendar crossed`). Power is ON in A and B, failing in C, OFF (night scenes lit by candles, moon, torch, fire) in D and E.
- Looks: `alone` (DÂN SỐ: 1 chip) only on lines containing "Chỉ còn mình bạn"; `memory` for remembered/imagined moments. Use as `"look": "alone"` on an edit entry.
- On-screen text: minimal, Vietnamese with correct diacritics (FONT.ui = Space Mono, FONT.hand = Itim, FONT.title = Bricolage Grotesque). Schematic facts: number + 2-4 word label, as in PopulationCountdown / LonelinessCigarettes.
- Facts on screen must match `science` exactly (4 tiếng; 2-5 năm; 15 điếu; 8.200.000.000).
- New props you need (cake, button, crayon drawings, torch, etc.): draw them locally in your chapter files, in the engine's style (flat fills, darker side away from light, warm rim on the lit edge, contact shadow). Do NOT edit `src/engine/`.
- Unique SVG ids per shot (`id="b3"`, ...).

## Sound events (cue on your shot ids; no new clips except listed)
Library clips: room_tone (12.5 s indoor), roof_wind (7 s), class_murmur, step, big_step, catch, land, tumble, fall_whoosh, clink, shatter, crack, cookie_crunch, gulp, gasp, laugh (kids), pop, paste_pop, sparkle, ding, buzzer, select_draw, copy_click, glitch, counter_tick, power_hum, power_down, switch_off, bulb_pop, drone_hit, title_boom, clock_back, rewind, rewind_start, dizzy, shades, paper_land, cat_chirp, cat_yowl, phone_ring (ringback), plus the music bed (lead does it).
Event: `[cue, clip, gain, align?, until?]`, gains 0.08-0.35. Land hits in the pause after a word, never on it; give long clips an `until`. Ambience: one bed per location (room_tone / roof_wind at 0.1-0.15).

## Report back
Shots count, time range covered, files, anything you could not draw well, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
