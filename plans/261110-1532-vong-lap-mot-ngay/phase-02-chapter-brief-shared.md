# Chapter brief (shared by chapter agents A-E): "Sẽ ra sao nếu chỉ mình bạn nhớ ngày hôm qua?"

Episode slug `vong-lap-mot-ngay` (id `TimeLoop`, export `vongLapMotNgay`), ~4:58, Vietnamese voice (LucyLab, FINAL, do
not change). Premise: every midnight the whole world snaps back to 06:00 on the same Wednesday (rooms, money, bodies,
everyone's memories); only Pip remembers. The narrator says "bạn"; on screen "bạn" is Pip (`LOOKS.pipHood`). Every
number is in `science` of `src/episodes/vong-lap-mot-ngay/episode.json`: on-screen numbers must match it exactly.

## Tone
Cosy déjà vu → mischievous fun (no consequences, the lottery) → a gut-punch at midnight → hopeful mastery (learning)
→ quiet cracks (forgetting, fatigue, dark days in bed) → wonder (butterfly effect) → warmth and ache (saving the
granny, Mo who never remembers) → a perfect ordinary day → THỨ NĂM: release and the unknown. Never cruel, never gory.

## Visual grammar (same in every chapter)
- Shared kit (import, don't edit; READ the header comments of each file in `src/episodes/vong-lap-mot-ngay/kit-*`):
  `kit-palette.ts` (`PAL`, `mix`, `fmtVN(3650)` → "3.650"); `kit-morning-bedroom.tsx` (`MorningBedroom({ t, id?,
  dawn=1, clock='06:00', ring=0, day='THỨ TƯ', duvet=true, lamp=0, veil=0.4, notebook=0 })`, re-exports `bedSit`,
  `bedTop`, `BedDuvet`, `BEDROOM`; `roomStand(u, w)`; `MB.CLOCK {924,658}`, `MB.CAL {952,396,w120}`, `MB.WINDOW`,
  `MB.DESK`, `MB.NOTE`; use `dawn={0}` for Pip's room at night, NOT the engine Bedroom); `kit-alarm-insert.tsx`
  (`AlarmInsert({ id?, t, clock?, ring?, hand?, dawn? })`, a full-frame insert: draw it as the whole shot; `hand` 0→1
  arm from the left, > 0.9 presses snooze and the ring stops); `kit-bedroom-parts.tsx` (`DawnSky`, `BedsideClock`,
  `TearCalendar({ x, y, w?, day?, date?, rot? })` "THỨ" small + "TƯ"/"NĂM" huge); `kit-loop-clock.tsx` (`FlipClock({ x,
  y, s?, time, t, from?, flipAt?, cyan?, blur? })` ~600×236 at s 1; `ResetClock({ t, t0, x, y, s? })`: 23:59 until t0,
  flips to 00:00 by t0+8, spins back in cyan t0+9..30, slams 06:00 at t0+31, "THỨ TƯ" pill at t0+33 — pair with
  `RewindWave t0={t0+30}`; `DayCounter({ x, y, n, t?, s? })` "NGÀY #3.650"; `LoopIcon`); `kit-rewind-fx.tsx`
  (`RewindWave({ t, t0, id?, cx?, cy? })` 18 frames flash + cyan glitch + ripple, and `MemoryGlow({ x, y, r, t, id?,
  o? })` r ≈ head radius × 1.7: both screen space, draw LAST outside the camera group); `kit-street-rain.tsx` (on
  engine `Street`, keep `low` 0: draw `<Street/>`, `<WetRoad/>`, characters, then `<RainVeil/>` in screen space;
  `Puddle`, `HandUmbrella({ x, y, s?, t?, rot?, open?, color? })` at `toWorld(pose, joints(pose).armR.end)`; metres:
  zebra Z 9.4-11.7, `XR.SLIP {X -0.6, Z 10.3}`, `XR.PIP_WATCH {X -5.6, Z 8.2}`, `XR.LIGHT`; `slipStand(dX?)`; the Street
  always has riderless scooters in the road, one near the zebra at X 1.7, Z 7.4: frame around them);
  `kit-cast.ts` (`GRANNY`, `BOSS`, `NEIGHBOUR`, `grannyPose(x, y, scale, { slip?, facing?, walk? })`) and
  `kit-cast-figures.tsx` (`Granny({ pose, rimId?, shadow? })` — ALWAYS draw her with `<Granny>`, not `<Hero>`, or the bun
  is missing; `Boss`, `Neighbour`, `HeadOverlay`); `kit-props.tsx` (`Notebook({ x, y, s?, t, id, fade?, lines?, flat? })`
  lines ≤ 13 chars, `FlowerPot({ x, y, s?, t, fall, ground?, ledge? })` fall 0-0.2 tips, 0.2-0.8 drops, 0.8-1 smashes,
  `PianoKeys({ x, y, w, t, press? })` white-key indices 0-13, `Butterfly({ x, y, s?, t })`, + money props re-exported);
  `kit-props-money.tsx` (`IceCreamStack({ x, y, n?, s? })` x,y = fist, `MegaTicket({ x, y, s?, nums?, id, fade?, t?, rot?
  })` 440×230, fade → grey + cyan flakes, `Wallet50k({ x, y, s?, open? })`, `Dumbbell`).
- Looks (on edit entries, `src/episodes/vong-lap-mot-ngay/looks.tsx`): chips with loop icon `day2` `day5` `day10`
  `day50` `day122` `year1` `year10`; `midnight` (blue, chip "23:59"); `thursday` (bright warm, chip "THỨ NĂM"); no chip:
  `reset` (cyan + scanlines), `rain`, `tired` (desaturated, vignette, blur pulse: don't stack another filter on it),
  `memory` (sepia + cyan edge), `perfect` (golden hour), `dawn` (peach). Looks show only in the real render, not on
  board stills. Chip looks on the first 1-2 shots of a jump only.
- THE RESET (the power): every time a loop resets on screen (midnight → 06:00), use `ResetClock` and/or `RewindWave`
  and a cut back to the same 06:00 bedroom framing (MorningBedroom, ringing clock). Repeated framings are the point:
  the alarm shot, the calendar "THỨ TƯ", mum calling, Mo's joke, the cat + flower pot, the 16:00 rain at the crossroads
  recur across chapters with the SAME composition so the audience feels the loop. Loop count: `DayCounter` or day
  chip looks (`day2`, `day5`, `day10`, `day50`, `day122`, `year1`, `year10`) on the first 1-2 shots of a new jump only.
- The one thing that stays: a soft cyan `MemoryGlow` on Pip's head when the script talks about memory.
- Every time the narrator says "Đó là thật", `FactStamp` (`../dai-duong-can/kit-hud`) thumps on at that word.
- Cast: Pip `LOOKS.pipHood`, Mo `LOOKS.mo` (the joke teller), mum `LOOKS.mom`, granny `GRANNY`, boss `BOSS`,
  neighbour `NEIGHBOUR` (kit-cast.ts). Mo's joke: draw it as a speech bubble with a doodle (no words needed), the
  SAME bubble each loop.

## Per-chapter beats and picture ideas (a guide; better ideas welcome if they stay true to the words)
- **A 0:00-1:01**: 06:00 alarm rings (AlarmInsert, hand slaps it), Pip in bed `dawn`; mum calls from the stairs; TV
  news in the kitchen with a rain-cloud icon "16:00 MƯA LỚN"; Pip frozen with a spoon, déjà vu ("Quá quen"), a ghost
  double-exposure of yesterday's identical frame (`memory`); TitleCard "SẼ RA SAO NẾU CHỈ MÌNH BẠN / NHỚ NGÀY HÔM QUA?"
  (accent NHỚ); premise: ResetClock 23:59 → 06:00 THỨ TƯ, a globe/city with 8 billion tiny people snapping back;
  "mãi mãi" = calendar pages flipping and always landing on THỨ TƯ; rules card: bedroom, wallet, body, "8 TỶ NGƯỜI"
  icons rewinding (cyan) while Pip's head keeps a MemoryGlow; day two (`day2`): Mo tells the same joke (same bubble),
  Pip mouths it along; the neighbour's cat knocks the flower pot off the balcony (FlowerPot fall 0→1); 16:00 the rain
  starts at the exact second (FlipClock 16:00 + RainVeil); no consequences: 10 ice creams (IceCreamStack, Pip's belly
  bulges) → reset → flat belly; Pip tells the BOSS everything (big angry speech bubble) → reset → boss smiling blank;
  blue hair, jumping into a pool in a suit (splash), eating a whole restaurant menu (a long table of dishes);
  "Ngày nào cũng là ngày lễ": confetti, a party hat.
- **B 1:01-2:00**: body: Pip falls off a bicycle, scraped knee → reset → clean knee; lifting weights all day, arms
  swell → reset → skinny again; "không già đi": a mirror, Pip's face identical, a calendar stuck on THỨ TƯ; lottery:
  TV draw at 18:00 "MEGA 6/45", odds card "1 / 8.145.060" (or "> 8 TRIỆU"), Pip remembering yesterday's numbers
  (MemoryGlow), buys the ticket at a lottery stall, the six balls match one by one, "≥ 12 TỶ ĐỒNG" jackpot screen,
  Pip celebrating late (`midnight`) with confetti, FlipClock 23:59 → ResetClock → 06:00, the ticket in his hand
  dissolves (MegaTicket fade), wallet with one "50.000" note; learning: "Vậy thứ duy nhất bạn giữ được là gì?" Pip's
  head with MemoryGlow; "18 GIỜ" a day bar 06:00 → 24:00; FSI card "2.200 GIỜ" → tiếng Nhật (a 日本語 textbook,
  hiragana あ い う), "÷ 18 ≈ 4 THÁNG" (`day122`), "1 NĂM = 6.570 GIỜ" (say "> 6.500 GIỜ"); montage: piano, drawing,
  cooking; the fingers-soft gag: fingertips plain each morning but the brain lights up playing each note (PianoKeys).
- **C 2:00-3:00**: forgetting: Pip writes in a notebook at night, reset, the notebook is blank (Notebook fade); his
  head as the only storage; the forgetting curve chart (100% → ~1/3 after 1 day, label "SAU 1 NGÀY: QUÊN ~2/3",
  "1885"), then spaced review bumps (curve resets higher, gaps widening); FactStamp; tired: a day bar 06:00 → 24:00,
  "17-19 GIỜ KHÔNG NGỦ ≈ 0,05% NỒNG ĐỘ CỒN" (draw a reaction-time test or a wobbly Pip, a beer glass icon with "0,05%",
  no drinking shown), FactStamp, body refreshed each morning (sparkle) but the mind (`tired`) grey and heavy;
  butterfly: same day replays identical (split screen of two loops, synced); Pip greets the neighbour one minute
  early (FlipClock 07:14 vs 07:15) and the day branches (a branching path diagram with icons); Lorenz card "1972"
  "EDWARD LORENZ", a butterfly over a map of Brazil → a tornado over Texas (simple map shapes, labels "BRAZIL",
  "TEXAS"); "HIỆU ỨNG CÁNH BƯỚM"; Pip inside a giant butterfly-wing pattern.
- **D 3:00-3:58**: dark days: Pip in bed all day (`tired`/dim), the same sounds pass (alarm, mum, Mo knocking) as
  icons, time-lapse light moving across the room, "Nhưng sáng mai, vẫn là thứ Tư" → calendar THỨ TƯ; saving: 16:00 rain
  at the crossroads, the granny slips on the zebra crossing; loop counter shots: `day1`-ish Pip watches frozen; `day5`
  he catches her; `day10` he catches her AND holds the umbrella over her; next morning she's about to slip again,
  Pip sprints out; "Mỗi việc tốt bạn làm, chỉ sống được đúng một ngày": a good-deed heart icon that evaporates at
  midnight; lonely: Pip tells Mo about the loop: 1st Mo laughs, 10th Mo believes, 50th Pip mouths Mo's words with
  him (subtitles in sync); a photo album of memories with Mo where Mo's side is empty (`memory`); study card "148
  NGHIÊN CỨU", "> 300.000 NGƯỜI", "+50% KHẢ NĂNG SỐNG SÓT", FactStamp; "Con người cần được nhớ đến": Pip alone among
  a crowd that walks past.
- **E 3:58-4:58**: ten years (`year1` then `year10`): seasons can't change, so show the counter "3.650 NGÀY THỨ TƯ",
  Pip's body the same but his eyes older (mirror with an older reflection silhouette), skills montage: "5 THỨ TIẾNG"
  (speech bubbles in 5 scripts), piano virtuoso, knows every neighbour's name (name tags pop over a street), predicts
  every minute: Pip counts down, the cat jumps / the pot falls / the rain starts on his finger snap; perfect day
  (`perfect`): slow breakfast with mum, laughing at Mo's old joke, umbrella over the granny, a sunset on a rooftop;
  "Một ngày bình thường, nhưng trọn vẹn"; thursday: midnight (`midnight`), the reset wave starts... and doesn't spin
  back: 06:00 alarm, phone screen "THỨ NĂM" (`thursday`), Pip's slow wide-eyed smile, the window opens on a new day
  (different weather: clouds/birds), "lần đầu tiên sau mười năm..." the calendar page tears off revealing THỨ NĂM;
  question card with three choices (HỌC 1 THỨ TIẾNG / TRÚNG SỐ CHO VUI / SỐNG THẬT CHẬM) and "Viết ở phần bình luận
  nhé"; the end card holds through the 3 s tail to the end of the timeline.

## Read first
`AGENTS.md`, `~/.claude/skills/what-if-animation/SKILL.md`, `references/kit.md`, `look.md`, `traps.md`, the kit files
above, your words file `chapters/vong-lap-mot-ngay/words-<x>.txt`, a finished chapter for conventions:
`src/episodes/dai-duong-can/shots-cha-*.tsx` + `chapters/dai-duong-can/cha.json`. Sets in `src/engine/sets/` (Bedroom,
Kitchen, Street, Classroom, Rooftop, Supermarket, Schematic...). Reusable (import, don't edit): `TvSet`/`NewsScreen`
(`khong-ai-ngheo/chd-tv-news-props.tsx`), `NumCard` (`khong-ai-ngheo/chb-cards-and-marks.tsx`), `InsertArm`
(`last-one/insert-arm-and-icons.tsx`), `Umbrella` (`sun-disappeared/cha-sun-props.tsx`), `FactStamp`, `BigNum`
(`dai-duong-can/kit-hud.tsx`), `Globe` (`dai-duong-can/kit-globe.tsx`), phones (`neu-chien-tranh/chb-phone-props.tsx`).

## Deliver
1. `src/episodes/vong-lap-mot-ngay/shots-ch<x>-<topic>.tsx` (one component per shot, pure function of `t`, ≤ ~250
   lines per file; local props in `ch<x>-*.tsx`). Don't edit kit files, looks.tsx, shared files, the engine or other
   episodes; if the kit lacks something, draw it locally in your chapter's props file.
2. `chapters/vong-lap-mot-ngay/ch<x>.json` (schema in `tools/merge-chapters.py` docstring).
3. Self-check: `python3 tools/merge-chapters.py vong-lap-mot-ngay && python3
   ~/.claude/skills/what-if-animation/scripts/plan.py vong-lap-mot-ngay && npx tsc --noEmit`, stills (TEMP RULE), then
   `python3 ~/.claude/skills/what-if-animation/scripts/board.py vong-lap-mot-ngay`. Look at every still at full size,
   run the look.md checklist, fix, re-render only fixed ids. ≥ 2 passes. Motion: `--frames`.
   `src/episodes/index.ts` in your copy already imports `vongLapMotNgay`; only your chapter json is present in your
   copy, so merge builds a preview of your chapter (first shot forced to frame 0: expected).

## TEMP RULE / disk
Own temp folder for every Remotion command, emptied after each run, e.g. chapter c:
`mkdir -p /tmp/rmx-c && TMPDIR=/tmp/rmx-c node ~/.claude/skills/what-if-animation/scripts/stills.mjs vong-lap-mot-ngay [ids]; rm -rf /tmp/rmx-c/remotion-*`
Never touch the shared `$TMPDIR`. Stills/frames only, never render video. Disk is limited (~12 GB shared by 5
agents): delete your stills once reviewed, before you report.

## Rules
Shot ids: your letter + number (A1, A2...). Edit cues ONLY `"s:<seconds>"` from your words file, cut on phrases. Your
first edit entry starts at your chapter's first cue. Pace 1.6-3 s per shot, cards up to 4 s if animated; nothing static.
Every line is a picture, readable in one second at phone size. Vietnamese text with correct diacritics, minimal;
numbers in VN format matching `science` ("06:00", "23:59", "THỨ TƯ", "8 TỶ NGƯỜI", "1 / 8.145.060", "12 TỶ ĐỒNG",
"50.000", "18 GIỜ", "2.200 GIỜ", "≈ 4 THÁNG", "> 6.500 GIỜ", "~2/3", "1885", "17-19 GIỜ", "0,05%", "1972",
"148 NGHIÊN CỨU", "> 300.000 NGƯỜI", "+50%", "3.650 NGÀY", "10 NĂM", "THỨ NĂM"). Unique SVG ids.

## Sound events (`[cue, clip, gain, align?, until?]`, gains 0.06-0.25, in pauses)
Only clip names already in `library/sfx/` (name before the hash; `ls library/sfx/`), e.g. step, land, gasp, laugh,
pop, sparkle, ding, buzzer, glitch, counter_tick, splash, rain, thunder, swoosh, drone_hit, title_boom, tumble,
paper_land, ting, clink, crack, shatter, select_draw, fall_whoosh, power_down, power_hum, gulp. Alarm = `phone_ring` (or `ding` repeats); cat = `cat_yowl`/`cat_chirp`; pot = `shatter`; rain bed = `rain`,
`thunder`. THE RESET sound = `rewind_start` + `rewind` (or `clock_back`) + `glitch` at every reset. One ambience bed per location (rain
for the 16:00 crossroads). Music is handled by the lead.

## Report back
Shot count, time range, files, weak spots, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
