# Chapter brief (shared by chapter agents A-E): "Sẽ ra sao nếu bạn kiếm được 1.000 đồng mỗi giây?"

Episode slug `nghin-dong-moi-giay` (id `ThousandPerSecond`), ~5:05, Vietnamese voice (LucyLab, final, do not change).
Engine: Remotion + SVG stick-figure "What If" style. Every frame is code. Same studio and pipeline as the finished
episode `last-one` (5:14): copy its patterns freely.

## Read first
- `AGENTS.md` (studio runbook), then `~/.claude/skills/what-if-animation/references/kit.md`, `look.md`, `traps.md`.
- Sets in `src/engine/sets/` (read header comments): Kitchen, Bedroom, Study, Classroom (`empty`), Stairwell,
  Rooftop, Schematic, `Street` (VN street: `market` stalls, plastic stools, `bus`, `night`; `streetStand(X, Z)`;
  `Motorbike`, `TrafficLight`, `CrossroadsTop`, `Bicycle`+`bikePose`), `Supermarket` (`aisleStand`, `ShoppingCart`,
  food props in `src/engine/food-props.tsx`).
- Finished examples of every kind of shot: `src/episodes/last-one/shots-ch*.tsx` (inserts with `InsertArm` from
  `src/episodes/last-one/insert-arm-and-icons.tsx`, phone UIs in `cha-feed-screen-ui.tsx`, schematic cards in
  `shots-chc-shared-props-and-cards.tsx`, memory shots in `shots-che-*`). Import from there or copy into your files.
- Your words + cue times: `chapters/nghin-dong-moi-giay/words-<x>.txt`. Script + sourced facts:
  `src/episodes/nghin-dong-moi-giay/episode.json` (`script`, `science`). Power looks: `looks.tsx` in that folder.

## Deliver
1. `src/episodes/nghin-dong-moi-giay/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`;
   ≤ ~300 lines per file; local props in `ch<x>-*.tsx`).
2. `chapters/nghin-dong-moi-giay/ch<x>.json` (schema in `tools/merge-chapters.py`): shots (with `file`), edit, fx,
   events, repeats.
3. Preview + self-check: `python3 tools/merge-chapters.py nghin-dong-moi-giay && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py nghin-dong-moi-giay && npx tsc --noEmit && node
   ~/.claude/skills/what-if-animation/scripts/stills.mjs nghin-dong-moi-giay && python3
   ~/.claude/skills/what-if-animation/scripts/board.py nghin-dong-moi-giay`. Look at the storyboard AND every still at
   full size; run the look.md checklist; fix; re-render the fixed ids (`stills.mjs nghin-dong-moi-giay B3 B7`). ≥ 2
   passes. Motion: `stills.mjs nghin-dong-moi-giay --frames <f1> <f2> ...` across 3-4 action shots.
   (With only your chapter present, the first shot is forced to frame 0 and the last runs to the end: expected.)

## Rules
- Shot ids: your letter + number (`B1`...). Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases.
- Pace: A cold open 0.8-1.6 s/shot, then 1.6-2.6 s; B math/fun 1.4-2.4 s; C 1.8-3 s; D 2.2-3.5 s (schematics up to
  5 s with action); E 2.4-4 s, the dinner can breathe. Nothing static: push-ins, sways, blinking, steam.
- Every line is a picture, literal and readable in one second at phone size. Vary size/angle every cut.
- Cast (all alive in this episode): Pip (`LOOKS.pipHood`, "you"), mum (`LOOKS.mom`), little sister (`LOOKS.sis`,
  ~0.7 scale), best friend Mo (`LOOKS.mo`), the man in the suit (`LOOKS.suit`), classmates (`Kid` from the classroom
  set). Nothing resembling famous characters, brands or real banks (bank app = generic "NGÂN HÀNG", green tick).
- Money on screen in Vietnamese format: "1.000 đ", "86.400.000 đ", "31 tỷ", "+1.000 đ". Facts must match `science`
  exactly (8,4 triệu; 35% trên 100 triệu; 1978; 86.400 giây; ~2,3 tỷ giây; 31 năm 8 tháng).
- The power's look: put `"look": "ping"` (bank chip "+1.000 đ" popping every second, top right) on edit entries
  where the money is flowing in daily life (from the first ping on). Leave it OFF on: schematic/math cards, the
  mum phone call, the time section, the choice, and the dinner (he has turned the phone face down). Use `"memory"`
  for remembered moments, `"cold"` (desaturated + ping) for the adaptation section ("nothing is special").
- Recurring visual grammar: phone banking notifications ("NGÂN HÀNG: +1.000 đ", balance counting up), the balance
  number, price → seconds conversions shown as a small tag ("25.000 đ = 25 giây").
- The first ping happens at 06:00 (alarm/clock reads 06:00) so "by noon, more than 20.000 pings" is true.
- On-screen text minimal, Vietnamese with correct diacritics (FONT.ui Space Mono, FONT.hand Itim, FONT.title).
- New props you need: draw them in your own files in the engine's style. Do NOT edit `src/engine/` or other
  chapters' files. Unique SVG ids per shot.

## Sound events (cue on your shot ids; only these clips)
room_tone, roof_wind, class_murmur, step, big_step, catch, land, fall_whoosh, clink, shatter, crack, cookie_crunch,
gulp, gasp, laugh (kids), pop, paste_pop, sparkle, ding, buzzer, select_draw, copy_click, glitch, counter_tick,
power_hum, power_down, switch_off, bulb_pop, drone_hit, title_boom, clock_back, rewind, rewind_start, dizzy, shades,
paper_land, cat_chirp, cat_yowl, phone_ring, and `ting` (bank notification chime, 0.5 s). Event
`[cue, clip, gain, align?, until?]`, gains 0.06-0.3; hits in the pause after a word; one ambience bed per location.
Use `ting` sparingly (first pings in A, a few accents), the ping look is visual. Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
