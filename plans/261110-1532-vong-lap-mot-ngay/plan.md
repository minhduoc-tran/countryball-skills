# Plan: "Sẽ ra sao nếu chỉ mình bạn nhớ ngày hôm qua?" (~4:30, VN)

Slug `vong-lap-mot-ngay`, id `TimeLoop`, export `vongLapMotNgay`. Voice done (LucyLab, 295 s + 3 s tail ≈ 4:58).
Premise: every midnight the world snaps back to 06:00 on the same Wednesday (rooms, money, bodies, everyone's
memories); only you remember. Pip lives the loop: fun → lottery → learning → forgetting/fatigue → butterfly effect →
saving the granny → loneliness → 10 years → one perfect ordinary day → Thursday. 10 sourced facts in `science`.

## Phases
1. [x] Script + science (episode.json), voice (`tools/voice-lucylab.py`), chapters split (a-e).
2. [x] Kit (1 agent): shared kit + looks (`phase-01-kit-brief.md`).
3. [x] Chapters A-E in parallel (studio clones `../studios/vl-<x>`, `phase-02-chapter-brief-shared.md`).
4. [x] Merge → plan.py → storyboard review (≥ 2 passes) → fixes.
5. [x] Sound: score (synth-score.py), sfx, mixcheck (sfx_lu -9.5, music_lu -14).
6. [x] Master -14 LUFS → thumbnail (HookText one phrase) + youtube-upload.txt (3 consequence-led titles).
7. [x] Cleanup (studio clones, raw mp4, bundles).

## Chapters
| ch | time | beats |
|----|------|-------|
| a | 0:00-1:01 | cold open (6:00 alarm, déjà vu), premise, rules, day two, no consequences |
| b | 1:01-2:00 | body resets, lottery (win, midnight, ticket gone), learning (18 h, 2.200 h Japanese, piano) |
| c | 2:00-3:00 | forgetting (notebook vanishes, Ebbinghaus), tired (17-19 h ≈ 0,05%), butterfly effect |
| d | 3:00-3:58 | dark days in bed, saving the granny at 16:00, lonely (Mo forgets, 148 studies) |
| e | 3:58-4:58 | ten years, perfect ordinary day, Thursday, question + end card |
