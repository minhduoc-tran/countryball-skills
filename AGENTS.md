# AGENTS.md: making "Sẽ ra sao nếu..." (What If) episodes in this studio

For any coding agent (Codex, Claude Code, OpenCode...). Read this first, then the skill.
Videos are Vietnamese, stick-figure "What If" animation; every frame is SVG code rendered by Remotion.

## 0. Read before doing anything

- The skill (method, formula, look, checklists): `~/.claude/skills/what-if-animation/SKILL.md` and its
  `references/formula.md`, `look.md`, `kit.md`, `sound.md`, `traps.md`. Follow its pipeline and rules
  (original characters only, every fact sourced in `science`, storyboard before animation).
- A finished long episode to copy from: `src/episodes/last-one/` (5:14, 165 shots, chapters A-E) and
  `chapters/last-one/`. The 15-25 s examples: `src/episodes/copy-paste/`, `src/episodes/rewind/`.
- The chapter brief used for last-one (conventions every chapter followed):
  `plans/261104-1100-last-one-long-episode/phase-04-chapter-brief-shared.md`.

## 1. Environment

- Run every command from this folder (`what-if-studio/`). Node 18+, ffmpeg/ffprobe, python3 with `numpy` and `Pillow`
  (`pip3 install numpy Pillow certifi`).
- Skill scripts: `python3 ~/.claude/skills/what-if-animation/scripts/<name>.py <slug>` (and `node .../stills.mjs`).
- Keys live in `../.env` (never print or hardcode them): `LUCYLAB_API_KEY`. There is NO ElevenLabs key: never run
  the skill's `voice.py` directly for a new take, and never add sound clips that aren't in `library/sfx/`
  (sfx.py would call ElevenLabs and fail).
- Disk: renders need ~4 GB free in `$TMPDIR`; Remotion leaves `remotion-webpack-bundle-*` dirs there (100-370 MB
  each, one per stills/render run: 14 GB after a day of agents). Clean when no render is running with
  `find "$TMPDIR" -maxdepth 1 -name 'remotion-*' -exec rm -rf {} +` (in zsh a `rm` with an unmatched glob aborts the
  whole command and deletes nothing). With parallel agents give each one its OWN temp folder instead (`TMPDIR=/tmp/rmx-<x> node .../stills.mjs ...;
  rm -rf /tmp/rmx-<x>/remotion-*`): a shared `$TMPDIR` either fills the disk (15 GB of bundles) or one agent's
  cleanup deletes the bundle another is rendering from.

## 2. Pipeline for a new episode (slug = kebab-case, id = PascalCase)

1. **Script.** Create `src/episodes/<slug>/episode.json`: `id`, `slug`, `topic`, `title` (2 lines, caps), `script`
   (beats), `science` (claim, working, source), `voice`, `gaps`, `tail`. Write numbers as words ("tám tỷ") so the
   TTS subtitles match the script. Short: 45-65 words. 5-7 min: ~1100-1400 syllables, `"speed": 0.9`.
   `"voice": {"provider": "lucylab", "userVoiceId": "u4ZCcxDX4FJScdJ97iN8pr", "speed": 0.9}`
   `"gaps": {"word": 0.12, "comma": 0.3, "sentence": 0.55, "question": 0.75}` (long-form; shorter for 20 s clips)
   `"holds": {"lastWordOfBeat|firstWordOfNext": 1.0}` = longer pauses at chapter breaks.
2. **Voice.** `python3 tools/voice-lucylab.py <slug>` (calls LucyLab once, aligns words, tightens pauses, applies holds;
   writes `public/<slug>/voice.wav` + `src/episodes/<slug>/words.json`). Re-running is free unless the script or
   voice settings change (`--force` re-buys the take, `--realign` redoes word timings from the cached SRT).
   Check: phrase starts should match real silences (see "Checks" below).
   Changing ONE sentence after the chapters exist: `python3 tools/voice-lucylab-splice.py <slug> "<old sentence>"
   "<new sentence>" [--dry]` voices only the new sentence, pastes it into voice.wav (loudness matched), fixes words.json,
   the script, the voice signature and shifts every later `s:` cue in chapters/<slug>/ch*.json; then re-run
   split-chapters, synth-score, merge-chapters, plan, sfx, master. Never `--force` a full take after a splice.
3. **Register** the episode in `src/episodes/index.ts`.
4. **Short episode (≤ 30 s):** follow SKILL.md steps 3-8 as written (shots/edit in episode.json, `shots.tsx`,
   `index.tsx`, plan.py, stills, board, self-check, animate).
   **Long episode:** chapters, below.
5. **Chapters (long episodes).**
   - `python3 tools/split-chapters.py <slug>` lists beats with start times; choose 4-6 chapters, then
     `python3 tools/split-chapters.py <slug> a="<first beat name>" b="..." ...` writes `chapters/<slug>/words-<x>.txt`.
   - Build each chapter (one agent session per chapter is fine; parallel agents should each work in a COPY of this
     studio and hand back files; make copies with `cp -cR what-if-studio ../studios/<x>`: an APFS clone, node_modules
     included, costs ~0 disk until files change): shot files `src/episodes/<slug>/shots-ch<x>-<topic>.tsx` (≤ ~300 lines each) and
     `chapters/<slug>/ch<x>.json` (schema in `tools/merge-chapters.py` docstring). Shot ids `A1`, `B1`...; edit cues
     ONLY `"s:<seconds>"` from the words file. Power looks (grade + overlay) go in `src/episodes/<slug>/looks.tsx`
     (`export const looks = {...}`), used as `"look": "<name>"` on edit entries.
   - `python3 tools/merge-chapters.py <slug>` writes episode.json shots/edit/fx/sound events and regenerates
     `index.tsx` (never edit index.tsx by hand). Then `python3 .../plan.py <slug>`.
   - With only one chapter present it builds a preview of that chapter (first shot forced to frame 0, last shot runs
     to the end: expected).
6. **Storyboard + self-check** (the step that makes it good): `npx tsc --noEmit`,
   `node ~/.claude/skills/what-if-animation/scripts/stills.mjs <slug> [ids]`,
   `python3 .../board.py <slug>`; open `out/<slug>/storyboard.jpg` AND each still at full size; run the look.md
   checklist; fix; re-render only the fixed ids. ≥ 2 passes. Motion: `stills.mjs <slug> --frames f1 f2 ...`.
7. **Sound.** `episode.json` `sound`: `clips` (only names already in `library/sfx/`: copy prompt+seconds from
   `src/episodes/last-one/episode.json` → `sound.clips`, the hash must match; after merge `python3 tools/fill-sound-clips.py <slug>` does it for every clip the events use), `events`, `repeats`, `music`, `levels`.
   Music bed: `python3 tools/synth-score.py <slug>` (edit its section table to the new beats first; clip name
   `score`, seconds = last word end + tail), or the library's 17 s playful loop `music` for short clips.
   Fight/weather/machine effects the library lacks: `python3 tools/synth-sfx.py` writes them into the library
   (punch_hit, swoosh, sonic_crack, rubble, metal_crash, splash, rain, thunder, siren, drone_buzz, arcade_count,
   sea_waves (20 s surf bed), water_drain (sea sucked away)) and
   prints their `clips` entries. Then `python3 .../sfx.py <slug>` and `python3 .../mixcheck.py <slug>`.
   Long-form narration levels: `"sfx_lu": -9.5, "music_lu": -14`. sfx.py levels the whole effects stem, so lowering
   one event raises the others: lower the stem level instead. Flags ≤ +2 dB on hits in pauses are fine.
8. **Master.** `python3 ~/.claude/skills/what-if-animation/scripts/master.py <slug>` (renders JPEG frames; ~8 min of
   render per minute of video on this Mac; 5 min ≈ 45 min) → `out/<slug>/<slug>-final.mp4` at -14 LUFS. Delete
   `<slug>-raw.mp4` after.
9. **YouTube kit** in `out/<slug>/`: `thumbnail.jpg` 1280x720 and `youtube-upload.txt` (titles, description with
   chapter timestamps ≥ 10 s apart starting 0:00, sources, hashtags, tags < 500 chars; copy the format of
   `out/tien-vo-han/youtube-upload.txt`).
   - **Titles: lead with the crazy consequence** (crowd psychology): hyperinflation, the economy breaking, being
     investigated or hunted, a planet freezing, 8 billion people vanishing. Pattern: the premise + the consequence in
     brackets, or the consequence alone as a hook. VN: "Điều Gì Xảy Ra Nếu ...? (Lạm Phát Phi Mã)", EN: "What If ...?
     (It Breaks the Economy)". Give 3 options, < 100 chars. They must stay TRUE to what the video shows (YouTube
     penalises misleading metadata): if the best hook needs a different premise ("What If EVERYONE Had Infinite
     Money?"), that is a new episode, not a new title.
   - **Thumbnails: ONE short phrase only** (2-4 words, 1-2 lines), huge, yellow on a slanted red band, heavy black
     outline: `HookText` from `src/channel/channel-branding.tsx`. No subtitles, chips, channel badges or labels. The
     character big on the right with a face that matches the consequence (shock/worried, not smug). Composition like
     `src/episodes/tien-vo-han/youtube-thumbnail.tsx`, registered in `src/Root.tsx`; render with
     `npx remotion still src/index.ts <Id>Thumbnail out/<slug>/thumbnail-1920.png`, then ffmpeg scale to 1280x720.

## 3. Engine notes (this studio's additions to the skill)

- Fonts carry Vietnamese: title Bricolage Grotesque (vietnamese subset), `FONT.ui` = Space Mono, `FONT.hand` = Itim.
  TitleCard accent matching is Unicode-aware.
- New sets (read their header comments): `Street` (`src/engine/sets/street*.tsx`, `street-geom.ts`,
  `street-props.tsx`: Vietnamese street, `market`, `bus`, `grass`, `night`, `blackout`, `streetStand(X, Z)`,
  `CrossroadsTop` + `LyingPipTop`, `Motorbike` with `keys`, `Bicycle` + `bikePose`, `TrafficLight`) and
  `Supermarket` (`src/engine/sets/supermarket*.tsx`, `food-props.tsx`: `toys`, `dark`, `night`, `empty`,
  `aisleStand(u, w)`, `PillowFort`, `CannedShelf`). `Classroom` has `empty`. `Rooftop` has `sunGone` (0..1: the Sun winks out, night sky and stars). `Street` has `moon` (default true; false for a moonless night).
- Shared episode helpers in `src/episodes/last-one/`: `insert-arm-and-icons.tsx` (`InsertArm` for hands in inserts,
  `PersonIcon`, `CigaretteIcon`), `shots-reusable-from-short-cut.tsx` (population countdown, cigarettes, blackout).
- Any standalone composition (thumbnail) must render `<KitDefs />` and `<SetDefs />` or rim filters break.

## 4. Traps we hit (don't repeat them)

- LucyLab API: async (`ttsLongText` → poll `getExportStatus` → wav + SRT). Cloudflare blocks Python's default
  user agent (error 1010): send a curl UA. python.org Python on macOS lacks CA certs: use certifi. The SRT is per
  sentence only; word times are estimated (dynamic programme over silences), so cut on phrases, not mid-phrase words.
- Keep beats in story order in the script; reordering after the take means re-buying it (or splicing audio).
- Render frames as JPEG (`remotion.config.ts`): PNG frames for 5 min = 20-40 GB and fill the disk.
- Shell hooks here may block commands that mention `node_modules`; install deps with `npm ci` in a copy instead of
  symlinking it.
- Agents' stills: the board shows looks (grades) only in the real render, not on board stills.
- Everything in a shot is a pure function of `t` (no Math.random, no state); unique SVG ids per shot.

## 5. Checks

- Voice alignment: `ffmpeg -i public/<slug>/voice.wav -af silencedetect=n=-35dB:d=0.1 -f null -` and compare phrase
  starts in words.json to silence ends (median error should be ~0.01 s, none > 0.15 s).
- Before master: `npx tsc --noEmit`, plan.py pace (no static shot > ~3 s unless it has action), mixcheck.
- After master: watch it once with sound; contact sheet:
  `ffmpeg -i out/<slug>/<slug>-final.mp4 -vf "select='isnan(prev_selected_t)+gte(t-prev_selected_t\,26)',scale=480:-1,tile=4x3" -frames:v 1 sheet.jpg`
