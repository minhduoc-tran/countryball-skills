# Kit brief: shared ocean kit for "Sẽ ra sao nếu đại dương không còn nước?" (slug `dai-duong-can`)

Five chapter agents will build ~150 shots on top of your kit in parallel right after you. Your job: the shared
locations, props, HUD and looks, so every chapter looks like ONE film. Daylight / hot-sun palette by default (this
episode is bright and scorching, not dusk), sea blue #2E86C1→#1B4F72, wet sand #9C8A6A, dry sand #E9D3A3,
salt crust #F4F1EA with faint blue-grey cracks, abyss shadows #5B4B3A→#2B2420.

## Read first
- `AGENTS.md` (studio runbook), `~/.claude/skills/what-if-animation/SKILL.md`, `references/kit.md`, `look.md`, `traps.md`.
- Script + facts: `src/episodes/dai-duong-can/episode.json`. Words/cues: `chapters/dai-duong-can/words-*.txt`.
- Reuse (import, never edit): `BeachDusk` (`src/episodes/nghin-dong-moi-giay/chb-travel-scenery-props.tsx`),
  `CargoShip`, `SeaFront`, `Pier`, `Ripples` (`src/episodes/mot-cu-dam/chc-harbour-props.tsx`), `Fish`, `Bubbles`
  (`src/episodes/sun-disappeared/chd-ocean-props.tsx`), Schematic set + `SCH`, `SchLabel` (engine), number cards
  (`NumCard` in `src/episodes/khong-ai-ngheo/` or `neu-chien-tranh/`), looks format `src/episodes/tri-hoan/looks.tsx`.

## Deliver (files in `src/episodes/dai-duong-can/`, each ≤ ~250 lines, header comment = API + coordinates)
1. `kit-danang-beach.tsx`: `DanangBeach({ id, t, drain = 0, people? })`: Đà Nẵng beach by day, eye level: sand,
   palms, the Sơn Trà mountain silhouette on the left horizon, a few low hotel blocks, sea with moving waves.
   `drain` 0..1: the waterline runs out to the horizon, revealing wet dark sand, then mud, rocks, weed, and at the far
   end the dark edge of a drop. Also export the waterline y for a given drain so shots can place fish/people.
2. `kit-dry-seabed.tsx`: `DrySeabed({ id, t, salt = 0, haze = 0, dust = 0 })`: a vast dry ocean floor vista to the
   horizon (continental slope falling away, distant ridges), `salt` 0..1 turns mud to cracked white salt crust,
   `dust` blows salt dust. `StrandedShip` (wrap `CargoShip`, tilted, half sunk in mud). `FishFlop({x,y,t,s,seed})`
   a fish flapping on sand (pure function of t). `Anchor` (rusty).
3. `kit-ocean-section.tsx`: `BasinSection({ id, t, water = 1, show? })` schematic cross-section (Schematic style):
   continent - shelf - slope - abyssal plain (≈ 3.700 m) - mid-ocean ridge - trench (≈ 10.935 m) - volcano (Mauna Kea
   style, > 10.000 m base to peak); depth ticks in VN format ("0 m", "−3.700 m", "−10.935 m"); `water` 0..1 level;
   `everest` 0..1 lowers an Everest silhouette (8.849 m, same scale) into the trench leaving a "> 2 km" gap label.
4. `kit-globe.tsx`: `Globe({ id, t, r, cx, cy, water = 1, rot = 0, ridge = 0, mars = 0 })`: Earth disc with simple
   continents rotating (pure function of t + rot), oceans blue at water 1 → dry tan/white basins at 0; `ridge` 0..1
   draws the 65.000 km mid-ocean ridge as a glowing seam; `mars` 0..1 morphs palette to rusty red Mars.
5. `kit-hud.tsx`: `OceanMeter({ x, y, p })` gauge "ĐẠI DƯƠNG" with % (100% → 0%); `FactStamp({ t, at })` the "ĐÓ LÀ
   THẬT" stamp that thumps on (used whenever the narrator says "Đó là thật"); `BigNum` card helper if NumCard doesn't fit.
6. `looks.tsx` (`export const looks`, format of tri-hoan): `sec1` chip "GIÂY THỨ 1" (slight shock grade), `days`
   "NHỮNG NGÀY ĐẦU", `months` "VÀI THÁNG SAU", `years` "VÀI NĂM SAU" (bleached, hot), `far` "HÀNG TRIỆU NĂM SAU"
   (desaturated), `past` "20.000 NĂM TRƯỚC" (sepia), `heat` (orange grade + top heat shimmer, no chip), `mars`
   (rust grade), `home` (warm, saturated: the sea is back), `drained` (bleached hot, chip "ĐẠI DƯƠNG: 0%").

Cast for the chapters: Pip `LOOKS.pipHood`, Mo `LOOKS.mo`, mum `LOOKS.mom`, sis `LOOKS.sis`. Don't add cast.

## Verify in a throwaway demo
In your studio copy only: register `daiDuongCan` in `src/episodes/index.ts`, write a throwaway
`chapters/dai-duong-can/chk.json` + `shots-chk-kit-demo.tsx` (K1..K8: beach drain 0/0.5/1, seabed salt 0/1 with ship
and fish, section with everest, globe water 1/0 + ridge + mars, HUD), `python3 tools/merge-chapters.py dai-duong-can`,
`npx tsc --noEmit`, stills (TEMP RULE), look at every still full size, fix, ≥ 2 passes. Do NOT hand back the demo
chapter / index.tsx / timeline / index.ts: only the kit files + looks.tsx.

## TEMP RULE / disk
`mkdir -p /tmp/rmx-k && TMPDIR=/tmp/rmx-k node ~/.claude/skills/what-if-animation/scripts/stills.mjs dai-duong-can [ids]; rm -rf /tmp/rmx-k/remotion-*`
Never touch the shared `$TMPDIR`. Stills only, never render video. Delete stills once reviewed. Disk ~16 GB free.

## Rules
Pure functions of `t` (no Math.random/state), unique SVG ids (prefix with `id`), Vietnamese diacritics correct,
numbers in VN format. Don't edit the engine, shared files or other episodes.

## Report back
Files + one-line API each, demo still observations, **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED.
