# Phase 0 brief: the shared PUNCH KIT for "Sẽ ra sao nếu bạn chỉ cần một cú đấm?" (slug `mot-cu-dam`)

Vietnamese What If episode (~4:43, voice final) where Pip (`LOOKS.pipHood`, "you") defeats anything with ONE punch
(One Punch Man fantasy, but 100% original: Pip stays Pip, hooded stick figure; NO bald head, NO cape, NO yellow suit,
nothing from that anime). The user's ask: "cảnh đấm đá mãn nhãn" = spectacular fight scenes. Six chapter agents will
build the shots AFTER you; they all import your kit, so the fights look the same everywhere. Make it punchy, readable
at phone size, and pure functions of the shot clock `t` (frames, 30 fps).

## Read first
`AGENTS.md`, `~/.claude/skills/what-if-animation/references/kit.md`, `look.md`, `traps.md`; `src/engine/` exports
(rig: `Hero`, `basePose`, `Pose`, `joints`, `toWorld`, `kf`, easing helpers, `rnd`, `Glow`, sets `Street`, `Rooftop`,
`Schematic`...). Style reference shots: `src/episodes/last-one/shots-ch*.tsx`, `src/episodes/tien-vo-han/shots-*.tsx`.
Engine-level fx already exist on edit entries: `{"kind": "shake", "amp": .., "len": ..}` and `{"kind": "flash"}`.

## Deliver (all in `src/episodes/mot-cu-dam/`, each file ≤ ~250 lines, kebab-case, header comment with usage)
1. `punch-fx-kit.tsx`
   - `SpeedLines` radial manga speed lines converging on a point (animated flicker, `o`, `n`, colour), and `StreakLines`
     parallel motion streaks behind a moving fist/body.
   - `ImpactFlash` 2-4 frame impact frame starting at `hitT`: white burst star + an inverted/high-contrast ring; then
     `Shockwave` expanding rings (air ripple + dust ring on the ground variant), `Debris` seeded chunks/sparks flying
     out ballistically from the hit point, `DustCloud` billowing puffs.
   - `PunchPip` (or a `punchPose(t, hitT, side)` helper + wrapper): Pip's wind-up (fist pulled back, crouch) → strike
     (arm fully extended, body lunges, 2-3 frames) → follow-through/hold, using the rig (`armR` a≈90 extended toward the
     facing side). Include a smear/blur arm on the strike frame.
   - `FistInsert` huge close-up of Pip's fist (dark hoodie sleeve, cream hand, knuckle highlights) clenching, then
     thrusting toward camera with speed lines (used for "Bạn nắm tay lại" / "Một cú đấm").
   - `BoomWord` comic onomatopoeia "BÙM!" (FONT.title, yellow with heavy outline, pops in with overshoot, slight tilt),
     optional per shot.
   - `shakeAt(t, hitT, amp, len)` → {x, y} offset helper for in-shot camera shake (deterministic).
2. `giant-cockroach.tsx`: `GiantCockroach` (as big as a city bus beside the `Street` set; side + 3/4 views if easy;
   glossy brown shell, twitching antennae, scuttling 6-leg cycle; `hit` 0..1 sends it flying and spinning, legs up).
3. `rogue-robot.tsx`: `RogueRobot` (10-storey boxy industrial robot, generic, rust-orange + grey, one red eye, stomping
   walk cycle, smoke from vents; `burst` 0..1 explodes it into flying plates/limbs) and `BoltRain` (nuts and bolts
   raining down, pings).
4. `storm-sky.tsx`: `CloudDeck` (heavy dark cloud ceiling over a city skyline, `split` 0..1 tears it in two along a
   line with a column of sunlight and blue sky), `TyphoonSpiral` (huge spiral cloud seen from below, rotating, `hole`
   0..1 opens a hole that then closes), `Rain` (slanted rain streaks layer, intensity).
5. Demo to prove it: `shots-chz-kit-demo.tsx` + `chapters/mot-cu-dam/chz-kit-demo.json` (4-5 shots, ids `Z1`..), e.g.
   Z1 Pip punches the cockroach on the night street (wide, shockwave, debris, BÙM), Z2 FistInsert + speed lines,
   Z3 robot burst + bolt rain, Z4 cloud split over the city, Z5 typhoon hole opening. Cue them on the first ~20 s of
   `chapters/mot-cu-dam/words-a.txt` ("s:<seconds>" cues). The lead deletes the demo chapter before the real merge.

## Check
Work in YOUR studio copy (path in your prompt). `python3 tools/merge-chapters.py mot-cu-dam && python3
~/.claude/skills/what-if-animation/scripts/plan.py mot-cu-dam && npx tsc --noEmit && node
~/.claude/skills/what-if-animation/scripts/stills.mjs mot-cu-dam` then `stills.mjs mot-cu-dam --frames ...` across the
hit moments (before/at/after the hit) to verify motion. Look at every still at full size; fix; ≥ 2 passes.

## Rules
Unique SVG ids (take an `id` prop). No Math.random/state. Flat fills + dark outline like the engine. Do NOT edit
`src/engine/` or other episodes. Report: files, exported API (one line each), weak spots,
**Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
