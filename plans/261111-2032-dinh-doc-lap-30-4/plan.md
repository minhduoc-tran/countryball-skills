# Plan: "30/4/1975: Xe tăng húc đổ cổng Dinh Độc Lập" countryball documentary (~10-12 min, VN)

Slug `dinh-doc-lap-30-4`, id `DinhDocLap304`, export `dinhDocLap304`. Channel Bút Chì Man.
Same style as `quang-tri-81-ngay-dem` / `dien-bien-phu-tren-khong` (countryball on animated maps + archive photo cards).
Balls: VNM (Quân Giải phóng, MuCoi), RVN (user choice: ball WITH the VNCH flag), USA (evacuation, Frequent Wind).
Tone: documentary, respectful to the dead of both sides; no gore, no mocking. Disputed facts/numbers labelled with
their source on screen ("theo phía Việt Nam / theo nguồn phương Tây / các nguồn còn khác nhau").
User asks (2026-11-11): ACCURATE facts (cross-checked) + plenty of illustrative archive photos with credits.

## Scope (user choice)
Short context (Paris 27/1/1973 → US leaves; Phước Long; Buôn Ma Thuột 10/3/1975; Huế 26/3, Đà Nẵng 29/3; Xuân Lộc
9-21/4; Thiệu resigns 21/4) → Chiến dịch Hồ Chí Minh 26-29/4: 5 cánh quân surround Sài Gòn, Dương Văn Minh in office
28/4, Tân Sơn Nhất bombed, US evacuation (Frequent Wind, 29-30/4) → morning 30/4: cầu Sài Gòn, Lữ đoàn tăng 203, xe 843
kẹt cổng phụ, xe 390 húc cổng chính, Bùi Quang Thận cắm cờ trên nóc Dinh, Dương Văn Minh tuyên bố đầu hàng trên đài →
đất nước thống nhất → today (Dinh Thống Nhất, xe 390/843 bảo vật quốc gia, 50 năm 2025).

## Phases
1. [x] Parallel: research facts (research/facts.md) | archive images + licences (public/<slug>/img/manifest.json,
   research/images-report.md) | kit: Sài Gòn map level + Dinh Độc Lập plan/front view + gate-crash + rooftop flag +
   evacuation fx (`src/countryball/`, demo `SaigonKitDemo`, cheat sheet kit-api-map-sai-gon.md).
2. [x] Lead verifies key facts → script (episode.json, ~2,700 syllables, speed 0.9) → LucyLab voice → chapters.
3. [x] Chapter agents (2 waves) in APFS studio copies → merge → storyboard review.
4. [x] Sound (synth sfx + score) → mixcheck → master (-14 LUFS).
5. [x] Thumbnail + youtube-upload.txt (sources + image credits). Cleanup leftovers.

## Status (2026-11-11)
Research cross-checked twice (fact-check agent + lead: gate wording from dinhdoclap.gov.vn, QĐ 1426/QĐ-TTg, QĐ2 = Đông Nam / QĐ4 = Đông).
Voice 10:35 (2.480 syllables, 47 beats, speed 0.88). 227 shots in 8 chapters, lead review fixed: D23 "HƠN 5.595", D19 label,
F3 A-37 → A-1 Skyraider (1962), G29 quote marks + neutral faces, H20/22/23 tank barrel (GateCrash `tank` prop).
Sound: sfx -14 LU, music -16.5 LU, worst flag +1.8 dB. youtube-upload.txt done (37 photo credits). Master done: 10:39, -14.0 LUFS, TP -1.41 dBTP; thumbnail "HÚC ĐỔ CỔNG DINH"; raw + temp cleaned.

## Revision (2026-11-12, user: "thời gian cụ thể thay vì gần trưa")
Cold open "Gần trưa ngày 30/4/1975" → "Mười giờ bốn mươi lăm phút sáng ngày 30/4/1975" (dinhdoclap.gov.vn: 10:45 xe 843
húc cổng phụ; "chỉ vài phút nữa" = cổng chính, still true). Spliced with new tools/voice-lucylab-splice.py (+1.005 s,
all later cues shifted), A1 text "10:45 SÁNG", upload text timestamps recomputed. D13 "Trưa hôm đó" kept: sources differ
(NHHC: Ford ordered Frequent Wind 11:08 Saigon time; Wikipedia: evacuation began ~14:00). Total 10:40. Master re-rendered 2026-11-12: 10:40, -14.0 LUFS, TP -1.4 dBTP.
