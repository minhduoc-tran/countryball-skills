# Plan: "Hà Nội - Điện Biên Phủ trên không" countryball documentary (~15 min, VN)

Slug `dien-bien-phu-tren-khong`, id `SkyDienBienPhu`, export name `dienBienPhuTrenKhong`. Channel Bút Chì Man.
Style: countryball on animated maps (like history countryball channels): dark sea, flat textured land, balls with
flags (USA, VNM; others only if needed), date chip + counter + minimap HUD, aircraft and SAM on the map, radar
screens, plus REAL archive photos (public domain / CC only) shown in a framed "ảnh tư liệu" card with credit line.
Tone: documentary, respectful; war shown through maps, icons and balls, no gore. Both sides' figures where they
differ ("theo phía Việt Nam ... / theo phía Mỹ ..."). Every number sourced in `science`.

## Phases
1. Research (parallel): facts + timeline (research/facts.md); archive images + licences (public/<slug>/img/, manifest).
2. Kit (parallel): A = map camera + geo data + HUD + photo card (`src/countryball/`); B = ball upgrades, aircraft,
   SAM/AA/bomb/radar effects (`src/countryball/`). Demo compositions MapKitDemo / FxKitDemo.
3. Script (episode.json, ~3,300-3,800 syllables) → LucyLab voice → split into ~8 chapters.
4. Chapter agents (2 waves) → merge → storyboard review → sound (synth sfx + score) → master (-14 LUFS).
5. Thumbnail + youtube-upload.txt (sources + image credits).
