# Plan: "Sẽ ra sao nếu đại dương không còn nước?" (~4:43, VN)

Slug `dai-duong-can`, id `NoOcean`, export `daiDuongCan`. Voice done (LucyLab, 280 s + 3 s tail).
Premise: every drop of ocean water vanishes in one second; rivers, lakes, ice and the SALT stay. Fiction framing
(Pip + Mo at Đà Nẵng beach, mum at the market) carrying real oceanography; 22 sourced facts in episode.json `science`.

## Phases
1. [x] Script + science (episode.json), voice (`tools/voice-lucylab.py`), chapters split (a-e).
2. [x] Kit (1 agent): shared ocean kit + looks (`phase-01-kit-brief.md`).
3. [x] Chapters A-E in parallel (studio clones `../studios/ddc-<x>`, `phase-02-chapter-brief-shared.md`).
4. [x] Merge → plan.py → storyboard review (≥ 2 passes) → fixes.
5. [x] Sound: score (synth-score.py), sfx, mixcheck (sfx_lu -9.5, music_lu -14).
6. [x] Master -14 LUFS → thumbnail (HookText one phrase) + youtube-upload.txt (3 consequence-led titles).
7. [x] Cleanup (studio clones, raw mp4, bundles).

## Chapters
| ch | time | beats |
|----|------|-------|
| a | 0:00-1:06 | cold open, premise, first second, scale, hidden world |
| b | 1:06-1:57 | Việt Nam (Hạ Long, Hoàng Sa, Sundaland), treasure, Internet cables |
| c | 1:57-2:57 | smell / dead sea life, food (nước mắm), economy (ships, prices), salt + Aral |
| d | 2:57-4:01 | rain stops, heat swings, oxygen (good news), can't refill (<2%) |
| e | 4:01-4:43 | Mars, ending (waves back, Mo waves), question + end card |
