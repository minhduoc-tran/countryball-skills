# Chapter brief (shared by chapter agents A-D): "Sẽ ra sao nếu bạn trì hoãn mọi thứ?"

Episode slug `tri-hoan` (id `Procrastinate`), ~4:02, Vietnamese voice (LucyLab, final, do not change). FICTION with
real psychology: Pip always says "Mai làm" (I'll do it tomorrow). A 7-day countdown to a school presentation about the
solar system (videos, cleaning instead of working, the panicked all-nighter), the science of why (emotions, the
future self is a stranger, Tice & Baumeister 1997), a fast-forward of a whole life of "tomorrow" (dusty guitar, 10
years of not saving, health, grandma waiting on her porch), then three real fixes (2 minutes, if-then plans,
self-forgiveness) and a warm ending (Pip visits grandma, she teaches him a song on the dusted guitar).

## Tone
Funny and relatable first (every teen recognises it), a little sad in the life fast-forward, warm and practical at the
end. No moralising lecture: show, don't preach.

## Visual grammar (keep it consistent across chapters)
- The yellow sticky note "MAI LÀM" (Itim hand font, slightly crooked) is the motif: it appears on the laptop, the
  desk, the guitar, the calendar, the savings jar... In the ending Pip peels one off and crumples it.
- Pip's room = the Bedroom set (`lamp` at night) with a desk + laptop; the presentation file "HỆ MẶT TRỜI.pptx"
  (generic slide app, no brand logos). Mo chats on the phone (generic chat UI).
- Grandma (`GRANDMA` from `src/episodes/khong-ai-ngheo/cast-looks.ts`) on her countryside porch (draw a simple rural
  house porch locally), the guitar (draw locally: warm wood, 6 strings).
- Looks (on edit entries): `c7` CÒN 7 NGÀY, `c5` CÒN 5 NGÀY, `c1` CÒN 1 NGÀY, `night` ĐÊM CUỐI (all-nighter),
  `alert` (deadline panic: red pulse + "HẠN NỘP: 00:00" bar) on 1-2 shots, `memory` for real-study cards,
  `y1` 1 NĂM SAU, `y10` 10 NĂM SAU, `peace` for the fixes and ending.

## Read first
- `AGENTS.md`, `~/.claude/skills/what-if-animation/references/kit.md`, `look.md`, `traps.md`.
- Sets in `src/engine/sets/`: Bedroom (`lamp`), Kitchen, Classroom, Street, Rooftop, Schematic. Reusable (import,
  don't edit): number-card helpers (e.g. `NumCard` in `src/episodes/khong-ai-ngheo/` or `src/episodes/neu-chien-tranh/`),
  `InsertArm` (`src/episodes/last-one/insert-arm-and-icons.tsx`), `XoiCart`/`Steam`
  (`src/episodes/tien-vo-han/che-xoi-cart-and-money-props.tsx`), `DawnAlley`.
- Cast: Pip (`LOOKS.pipHood`), Mo (`LOOKS.mo`), mum (`LOOKS.mom`), sis (`LOOKS.sis`), GRANDMA, a teacher (local look).
- Your words + cues: `chapters/tri-hoan/words-<x>.txt`. Script + facts: `src/episodes/tri-hoan/episode.json`.
  Looks: `src/episodes/tri-hoan/looks.tsx`.

## Deliver
1. `src/episodes/tri-hoan/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`, ≤ ~250 lines per
   file; local props in `ch<x>-*.tsx`). Don't edit shared files, the engine or other episodes.
2. `chapters/tri-hoan/ch<x>.json` (schema in `tools/merge-chapters.py`).
3. Self-check: `python3 tools/merge-chapters.py tri-hoan && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py tri-hoan && npx tsc --noEmit`, stills (TEMP RULE), then
   `python3 ~/.claude/skills/what-if-animation/scripts/board.py tri-hoan`. Look at every still at full size, run the
   look.md checklist, fix, re-render. ≥ 2 passes. Motion: `--frames`.
   `src/episodes/index.ts` in your copy imports `triHoan` (the name merge-chapters generates).

## TEMP RULE
Own temp folder for every Remotion command, emptied after each run, e.g. chapter c:
`mkdir -p /tmp/rmx-c && TMPDIR=/tmp/rmx-c node ~/.claude/skills/what-if-animation/scripts/stills.mjs tri-hoan [ids]; rm -rf /tmp/rmx-c/remotion-*`
Never touch the shared `$TMPDIR`. Stills/frames only, never render video. Disk is limited (~18 GB).

## Rules
Shot ids: your letter + number. Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases. Pace 1.6-3 s,
cards up to 4 s if animated; nothing static. Every line is a picture, readable in one second at phone size. Vietnamese
text with correct diacritics, minimal; numbers in VN format and matching `science` exactly ("80–95%", "1997",
"1 TRIỆU/THÁNG", "6%/NĂM", "≈ 1,7 TỶ", "≈ 870 TRIỆU", "3.500+", "~100 NGHIÊN CỨU"). Unique SVG ids.

## Sound events (`[cue, clip, gain, align?, until?]`, gains 0.06-0.25, in pauses)
room_tone, roof_wind, class_murmur, step, catch, land, clink, crack, gasp, laugh, pop, paste_pop, sparkle, ding,
buzzer, glitch, counter_tick, copy_click (typing), select_draw, phone_ring, ting (chat message), paper_land,
switch_off, bulb_pop, drone_hit, title_boom, clock_back, rewind, rewind_start (fast-forward/rewind), dizzy, tumble,
cat_chirp. One ambience bed per location. Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
