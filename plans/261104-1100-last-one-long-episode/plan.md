# Plan: "Sẽ ra sao nếu thế giới chỉ còn mình bạn?" long cut (~5:15)

Episode slug `last-one` (id `LastOne`), replaces the 19 s cut (deleted). Voice: LucyLab, 310.9 s, done.

## Phases

| # | Phase | Owner | Status |
|---|---|---|---|
| 1 | Script (40 beats, 7-beat formula, open-question ending) + science sources | lead | done |
| 2 | Voice: LucyLab speed 0.9, DP word alignment, chapter holds, beat swap (nature before silence) | lead | done |
| 3 | New sets: `Street` (VN street, market, crossroads top-down, motorbike, bus, bicycle, traffic light) | agent set-street | done |
| 3 | New sets: `Supermarket` (aisle, toys variant, cans, cart, pillow fort) | agent set-market | done |
| 4 | Chapters A-E: shots + chapter json (shots/edit/fx/sfx events), stills self-check | 5 agents, own studio copies | done (A46 B34 C29 D23 E33 = 165 shots) |
| 5 | Merge chapters, plan.py | lead | done |
| 6 | Score: library playful loop (fun) + synthesized pads (mystery/cost/loneliness), sfx, mixcheck | lead | in progress |
| 7 | Master (~45 min render), report | lead | in progress |

## Chapters (voice times, s)

| Ch | Beats | Time | Shots (target) | Sets |
|---|---|---|---|---|
| A | cold open, title, morning, premise | 0-70.0 | ~30 (A1-A9 reuse short cut) | kitchen, classroom, bedroom, stairwell, street, rooftop, schematic |
| B | fun | 70.0-124.0 | ~24 | supermarket, classroom, street, crossroads, rooftop, bedroom |
| C | cost: power, food, cans, water/health, internet, nature, silence | 124.0-191.5 | ~26 | schematic, kitchen, street, study (library), rooftop |
| D | cat, loneliness, diary, birthday, fact, hallucination | 191.5-234.4 | ~18 | street, bedroom, kitchen, schematic |
| E | friend, sister, choice, ending, comments | 234.4-313 | ~26 | bedroom, rooftop, stairwell |

## Conventions for chapter agents

- Shot ids prefixed by chapter: `A1..`, `B1..` (unique in the merged episode).
- Edit cues as `s:<seconds>` (word start minus 0.067 s), from `chapters/words-<ch>.txt`: order-independent when merged.
- Files: `src/episodes/last-one/shots-ch<x>-<topic>.tsx` (<= ~300 lines each, split if longer), `chapters/ch<x>.json`.
- Sound events: only clips in the library list; cue on shot ids.

## Risks

- Render time ~8x realtime (45 min); stills first.
- Agents editing engine: only set agents touch `src/engine/`; chapter agents keep new props local.
