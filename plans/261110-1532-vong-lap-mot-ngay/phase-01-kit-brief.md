# Kit brief: shared kit for "Sẽ ra sao nếu chỉ mình bạn nhớ ngày hôm qua?" (slug `vong-lap-mot-ngay`)

Five chapter agents will build ~140 shots on top of your kit in parallel right after you. Your job: the shared
locations, props, cast additions, overlays and looks, so every chapter looks like ONE film.

Premise: every midnight the whole world snaps back to 06:00 on the same Wednesday; only Pip remembers. The day:
06:00 alarm in Pip's bedroom (dawn light), breakfast with mum, TV news says heavy rain this afternoon, Mo's same joke,
the neighbour's cat knocks the same flower pot off a balcony, 16:00 rain at the crossroads where a granny slips,
evening Vietlott-style draw at 18:00, midnight reset. Palette: dawn peach/gold through the window (#FFB98A, #FFD9A0),
day bright, 16:00 rain blue-grey (#5E6E86), midnight deep blue (#141A33), the RESET motif = cyan rewind (#5CE1E6) +
white flash.

## Read first
- `AGENTS.md` (studio runbook), `~/.claude/skills/what-if-animation/SKILL.md`, `references/kit.md`, `look.md`, `traps.md`.
- Script + facts: `src/episodes/vong-lap-mot-ngay/episode.json`. Words/cues: `chapters/vong-lap-mot-ngay/words-*.txt`.
- Reuse (import, never edit): engine `Bedroom` (night only) + room kit (`src/engine/room.tsx`, `furnish.tsx`,
  `props.tsx` `AlarmClock`, `WallCalendar`), `Kitchen`, `Street` (+ `street-props.tsx`), `TvSet`/`NewsScreen`
  (`src/episodes/khong-ai-ngheo/chd-tv-news-props.tsx`), `Umbrella` (`sun-disappeared/cha-sun-props.tsx`), `Rain`
  (`dai-duong-can/chd-sky-props.tsx`, `mot-cu-dam/storm-sky.tsx`), `RainStreaks` (`khong-ai-ngheo/chc-grandma-props.tsx`),
  `CatHead`/`CatPeek` (`neu-chien-tranh/chc-backpack-and-cat-props.tsx`), `LotteryTicket` (`nghin-dong-moi-giay/chd-props-schematic.tsx`),
  `FactStamp`, `BigNum` (`dai-duong-can/kit-hud.tsx`), `NumCard` (`khong-ai-ngheo/chb-cards-and-marks.tsx`),
  derived Looks pattern (`neu-chien-tranh/chc-neighbours-props.tsx`), looks format (`dai-duong-can/looks.tsx`).

## Deliver (files in `src/episodes/vong-lap-mot-ngay/`, each ≤ ~250 lines, header comment = API + coordinates)
1. `kit-palette.ts`: `PAL` colours above + `mix`.
2. `kit-morning-bedroom.tsx`: `MorningBedroom({ id, t, dawn = 1, clock = '06:00', ring = 0, day = 'THỨ TƯ', duvet = true })`:
   Pip's bedroom at 06:00, built with the room kit (engine Bedroom geometry is fine to copy, NOT its night palette):
   peach dawn light through the window (sun rising over Vietnamese rooftops), nightstand with an alarm clock that
   reads `clock` and shakes when `ring` > 0 (with ring lines), a wall calendar whose page shows `day` LARGE enough to
   read at phone size, a desk with a notebook. `dawn` 0 = pre-dawn blue, 1 = full peach morning. Export `bedSit`/
   `bedTop` helpers and the coordinates of the clock, calendar and window. Also an insert helper
   `AlarmInsert({ id, t, clock, ring, hand? })`: the clock big in close-up (bedside, hand reaching in from the side).
3. `kit-loop-clock.tsx`: `FlipClock({ x, y, s, time, t, flipAt? })` big flip-digit clock (HH:MM, card flip on change);
   `ResetClock({ t, t0, x, y, s })` the power's gag: 23:59 → 00:00 → digits spin backwards fast → 06:00 + label
   "THỨ TƯ" (over ~40 frames from t0); `DayCounter({ x, y, n, t? })` pill "NGÀY #n" (n formatted VN: 3.650); `LoopIcon`
   (cyan circular arrow); `RewindWave({ t, t0, id })` full-frame overlay for every reset moment: white flash, cyan
   scanline/RGB-split glitch, a radial ripple, ~18 frames; `MemoryGlow({ x, y, r, t })` a soft cyan halo marking the
   one thing that stays (Pip's head / memories).
4. `kit-street-rain.tsx`: Pip's street / the crossroads at 16:00 using engine `Street` (read its header): `RainVeil({ t,
   amount, id })` screen-space rain + darkening, wet ground sheen/puddles helper, and the granny's slip spot coordinates
   (zebra crossing). If `Street` already has a good crossroads, wrap it; don't rebuild the street.
5. `kit-cast.ts`: derived Looks (pattern above): `GRANNY` (grey hair bun, purple/brown áo bà ba, slightly stooped
   pose helper `grannyPose`), `BOSS` (suit, tie), `NEIGHBOUR`. Show them next to Pip in the demo.
6. `kit-props.tsx`: `Notebook({ x, y, s, fade, t, id })` (open notebook, handwriting lines that dissolve when fade→1),
   `FlowerPot({ x, y, s, fall, t })` (terracotta pot with plant: on a balcony ledge at fall 0, tumbling, shattered
   on the ground at 1), `PianoKeys({ x, y, w, t, press? })` (keyboard close-up, keys depress), `Butterfly({ x, y, s, t })`
   (wings flapping), `IceCreamStack({ x, y, n })` (cones), `MegaTicket({ x, y, s, nums, id, fade? })` generic lottery
   ticket "MEGA 6/45" with 6 two-digit numbers (no real logo), `Wallet50k({ x, y, s })` wallet with one 50.000 note,
   `Dumbbell`. Reuse existing props by wrapping when they fit.
7. `looks.tsx` (`export const looks`, format of dai-duong-can): chips top-left: `day2` "NGÀY #2", `day5` "NGÀY #5",
   `day10` "NGÀY #10", `day50` "NGÀY #50", `day122` "NGÀY #122", `year1` "1 NĂM", `year10` "10 NĂM"; `midnight` (deep
   blue grade, chip "23:59"), `reset` (cyan cool grade + subtle scanlines, no chip), `rain` (blue-grey, no chip),
   `tired` (desaturated + heavy vignette, slow blur pulse), `memory` (soft sepia + faint cyan edge: a remembered past
   loop), `perfect` (golden hour warm), `thursday` (fresh bright warm, chip "THỨ NĂM" with a green dot), `dawn`
   (peach morning, no chip).

Cast for the chapters: Pip `LOOKS.pipHood`, Mo `LOOKS.mo`, mum `LOOKS.mom`, + your GRANNY/BOSS/NEIGHBOUR.

## Verify in a throwaway demo
In your studio copy only: register `vongLapMotNgay` in `src/episodes/index.ts`, write a throwaway
`chapters/vong-lap-mot-ngay/chk.json` + `shots-chk-kit-demo.tsx` (K1..K8: bedroom dawn 0/1 with ringing clock and
calendar, AlarmInsert, FlipClock + ResetClock mid-spin + DayCounter + RewindWave, street rain with granny + Pip,
cast line-up, props sheet, a looks check), `python3 tools/merge-chapters.py vong-lap-mot-ngay`, `npx tsc --noEmit`,
stills (TEMP RULE), look at every still full size, fix, ≥ 2 passes. Do NOT hand back the demo chapter / index.tsx /
timeline / index.ts: only the kit files + looks.tsx.

## TEMP RULE / disk
`mkdir -p /tmp/rmx-k && TMPDIR=/tmp/rmx-k node ~/.claude/skills/what-if-animation/scripts/stills.mjs vong-lap-mot-ngay [ids]; rm -rf /tmp/rmx-k/remotion-*`
Never touch the shared `$TMPDIR`. Stills only, never render video. Delete stills once reviewed. Disk ~13 GB free.

## Rules
Pure functions of `t` (no Math.random/state), unique SVG ids (prefix with `id`), Vietnamese diacritics correct,
numbers in VN format. Don't edit the engine, shared files or other episodes. Original characters only.

## Report back
Files + one-line API each, demo still observations, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
