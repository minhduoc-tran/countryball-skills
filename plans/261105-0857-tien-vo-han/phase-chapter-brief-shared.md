# Chapter brief (shared by chapter agents A-E): "Sẽ ra sao nếu bạn có tiền vô hạn?"

Episode slug `tien-vo-han` (id `InfiniteMoney`), ~4:28, Vietnamese voice (LucyLab, final, do not change).
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
- Your words + cue times: `chapters/tien-vo-han/words-<x>.txt`. Script + sourced facts:
  `src/episodes/tien-vo-han/episode.json` (`script`, `science`). Power looks: `looks.tsx` in that folder.

## Deliver
1. `src/episodes/tien-vo-han/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`;
   ≤ ~300 lines per file; local props in `ch<x>-*.tsx`).
2. `chapters/tien-vo-han/ch<x>.json` (schema in `tools/merge-chapters.py`): shots (with `file`), edit, fx,
   events, repeats.
3. Preview + self-check: `python3 tools/merge-chapters.py tien-vo-han && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py tien-vo-han && npx tsc --noEmit && node
   ~/.claude/skills/what-if-animation/scripts/stills.mjs tien-vo-han && python3
   ~/.claude/skills/what-if-animation/scripts/board.py tien-vo-han`. Look at the storyboard AND every still at
   full size; run the look.md checklist; fix; re-render the fixed ids (`stills.mjs tien-vo-han B3 B7`). ≥ 2
   passes. Motion: `stills.mjs tien-vo-han --frames <f1> <f2> ...` across 3-4 action shots.
   (With only your chapter present, the first shot is forced to frame 0 and the last runs to the end: expected.)

## Rules
- Shot ids: your letter + number (`B1`...). Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases.
- Pace: A cold open 0.8-1.6 s/shot, then 1.6-2.6 s; B fun 1.4-2.4 s; C 1.8-3 s (schematics up to 5 s with action);
  D 2.2-3.5 s; E 2.4-4 s, the xôi morning can breathe. Nothing static: push-ins, sways, blinking, steam.
- Every line is a picture, literal and readable in one second at phone size. Vary size/angle every cut.
- Cast (all alive in this episode): Pip (`LOOKS.pipHood`, "you"), mum (`LOOKS.mom`), little sister (`LOOKS.sis`,
  ~0.7 scale), best friend Mo (`LOOKS.mo`), the man in the suit (`LOOKS.suit`), classmates (`Kid` from the classroom
  set). Nothing resembling famous characters, brands or real banks (bank app = generic "NGÂN HÀNG", green tick).
- Money on screen in Vietnamese format: "15.000 đ", "12,8 TRIỆU TỶ Đ", "33 TỶ USD/NĂM", "774,7%". Facts must match
  `science` exactly (GDP 2025 ~12,8 triệu tỷ đồng / >500 tỷ USD; Ceres2030 ~33 tỷ USD/năm; 1986: 774,7%, 1 đồng -> gần
  9 đồng; Zimbabwe: giá gấp đôi sau ~1 ngày, tờ 100 nghìn tỷ đô la Zimbabwe năm 2009).
- The power: a black card with no limit. Its grammar on every swipe: the card tapped on a terminal, a beep, a green
  "THANH TOÁN THÀNH CÔNG", balance "∞" (draw the terminal/receipt locally; a shared black card + terminal prop is in
  `src/episodes/tien-vo-han/` once chapter A lands — draw your own matching one: matte black card with a gold chip and a
  thin gold "∞"). Looks: `"look": "card"` (chip "SỐ DƯ: ∞" with a green tick) on swipe moments; `"prices"` (hot grade +
  red "GIÁ ↑" chip) on the inflation shots; `"memory"` for remembered moments.
- Mum sells xôi from a push cart at the mouth of the alley (đầu ngõ) every morning: warm dawn light, steam.
- On-screen text minimal, Vietnamese with correct diacritics (FONT.ui Space Mono, FONT.hand Itim, FONT.title).
- New props you need: draw them in your own files in the engine's style. Do NOT edit `src/engine/` or other
  chapters' files. Unique SVG ids per shot.

## Sound events (cue on your shot ids; only these clips)
room_tone, roof_wind, class_murmur, step, big_step, catch, land, fall_whoosh, clink, shatter, crack, cookie_crunch,
gulp, gasp, laugh (kids), pop, paste_pop, sparkle, ding, buzzer, select_draw, copy_click, glitch, counter_tick,
power_hum, power_down, switch_off, bulb_pop, drone_hit, title_boom, clock_back, rewind, rewind_start, dizzy, shades,
paper_land, cat_chirp, cat_yowl, phone_ring, and `ting` (bank notification chime, 0.5 s). Event
`[cue, clip, gain, align?, until?]`, gains 0.06-0.3; hits in the pause after a word; one ambience bed per location.
Use `ting` for the card-terminal beep (gain ≤0.12, after the word 'Quẹt thẻ'). Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
