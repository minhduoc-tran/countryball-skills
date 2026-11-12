# Chapter brief (shared by chapter agents A-F): "Sẽ ra sao nếu bạn chỉ cần một cú đấm?"

Episode slug `mot-cu-dam` (id `OnePunch`), ~4:43, Vietnamese voice (LucyLab, final, do not change). The One Punch
Man fantasy, 100% ORIGINAL: Pip (`LOOKS.pipHood`) is "you". No bald hero, no cape, no yellow suit, no names, logos or
designs from that anime (no "Hero Association", no crab monster, no meteor). The user's one wish: **fight scenes that
are a feast for the eyes** ("cảnh đấm đá mãn nhãn"). Every punch must land HARD.

## Read first
- `AGENTS.md`, `~/.claude/skills/what-if-animation/references/kit.md`, `look.md`, `traps.md`.
- THE PUNCH KIT (already built, use it for every fight): `src/episodes/mot-cu-dam/punch-fx-kit.tsx`,
  `giant-cockroach.tsx`, `rogue-robot.tsx`, `storm-sky.tsx` (read their header comments). Demo shots using it:
  `src/episodes/mot-cu-dam/shots-chz-kit-demo.tsx` (copy patterns; the demo chapter json is not part of the episode).
- Sets in `src/engine/sets/` (header comments): Street (VN street, `night`, `market`, `bus`, `streetStand`,
  `Motorbike`), Bedroom, Kitchen, Classroom, Stairwell, Rooftop, Supermarket, Schematic. Reusable episode pieces:
  `src/episodes/last-one/insert-arm-and-icons.tsx` (`InsertArm`), `src/episodes/tien-vo-han/*` (xôi cart, alley dawn
  backdrop `che-dawn-alley-backdrop.tsx`, phones, the suit's scenes in `shots-chd-suit.tsx`), schematic cards in
  `src/episodes/last-one/shots-chc-shared-props-and-cards.tsx`.
- Your words + cue times: `chapters/mot-cu-dam/words-<x>.txt`. Script + sourced facts:
  `src/episodes/mot-cu-dam/episode.json` (`script`, `science`). Looks: `src/episodes/mot-cu-dam/looks.tsx`.

## Deliver
1. `src/episodes/mot-cu-dam/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`; ≤ ~300 lines per
   file; local props in `ch<x>-*.tsx`). Do NOT edit the kit files or other chapters' files; if the kit lacks something,
   draw it locally in your own file.
2. `chapters/mot-cu-dam/ch<x>.json` (schema in `tools/merge-chapters.py`): shots (with `file`), edit, fx, events,
   repeats.
3. Preview + self-check: `python3 tools/merge-chapters.py mot-cu-dam && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py mot-cu-dam && npx tsc --noEmit && node
   ~/.claude/skills/what-if-animation/scripts/stills.mjs mot-cu-dam && python3
   ~/.claude/skills/what-if-animation/scripts/board.py mot-cu-dam`. Look at the storyboard AND every still at full
   size; run the look.md checklist; fix; re-render the fixed ids (`stills.mjs mot-cu-dam B3 B7`). ≥ 2 passes.
   Motion: `stills.mjs mot-cu-dam --frames <f1> <f2> ...` before/at/after EVERY hit you animate.
   (With only your chapter present, the first shot is forced to frame 0 and the last runs to the end: expected.)
   Clean `$TMPDIR` remotion-* dirs after stills runs: `find "$TMPDIR" -maxdepth 1 -name 'remotion-*' -exec rm -rf {} +`.

## How a punch plays (the power's grammar; say it with pictures every time)
"Một cú đấm." = wind-up (fist clenches, `FistInsert` or Pip crouching, speed lines gather) → "Bùm." = THE HIT exactly
on the word "Bùm" (its cue in your words file): `ImpactFlash` 2-4 frames, `Shockwave`, `Debris`/`DustCloud`, the target
flies, `BoomWord` optional, plus edit fx `{"at": "<shot>+<frames>", "kind": "shake", "amp": 18-30, "len": 10-16}` and a
short white `flash`. Then a beat of aftermath (dust settling, Pip standing, crowd). Vary the angles: low-angle hero
shot, side-on wide, over-the-shoulder, fist-to-camera, top-down crater, slow-motion freeze before the hit. Cut fast on
fights (0.6-1.5 s/shot around the hit), let the aftermath breathe (2-3 s). `"look": "fight"` on the edit entries of each
punch run (from the wind-up to the aftermath shot).

## Rules
- Shot ids: your letter + number (`B1`...). Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases.
- Pace outside fights: 1.6-2.8 s/shot; science schematics up to 4-5 s if animated. Nothing static.
- Every line is a picture, literal and readable in one second at phone size. Vary size/angle every cut.
- Cast: Pip (`pipHood`), mum (`mom`), little sister (`sis`, ~0.7 scale), best friend Mo (`mo`), the man in the suit
  (`suit`), crowds/neighbours (simple figures, `Kid` from the classroom set). Pip's face: calm/blank on the hit (he is
  unbothered), happy in the fun part, flat/bored in ch D, worried for his sister in E/F.
- On-screen text minimal, Vietnamese with correct diacritics (FONT.ui Space Mono, FONT.hand Itim, FONT.title).
  Numbers in VN format ("3.400 N", "343 m/s", "23 m/s", "x37", "200 x").
- Facts must match `science` exactly. Unique SVG ids per shot. Don't touch `src/engine/` or other episodes.

## Sound events (cue on your shot ids, `[cue, clip, gain, align?, until?]`, gains 0.06-0.3, hits in the pause after a word)
New fight clips: `punch_hit` (THE hit, gain 0.25-0.3, align "onset" on the hit frame), `swoosh` (swing / jump, align
"peak"), `sonic_crack`, `rubble`, `metal_crash`, `splash`, `rain` (bed, use until), `thunder`, `siren`, `drone_buzz`
(bed, until), `arcade_count`. Library: room_tone, roof_wind, class_murmur (crowd), step, big_step, catch, land,
fall_whoosh, clink, shatter, crack, gasp, laugh, pop, sparkle, ding, buzzer, glitch, counter_tick, power_hum,
power_down, switch_off, bulb_pop, drone_hit, title_boom, dizzy, shades, paper_land, phone_ring, ting, tumble.
One ambience bed per location. Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
