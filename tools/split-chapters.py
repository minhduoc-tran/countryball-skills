"""Split a long episode's voice into chapters for parallel (or one-session-per-chapter) shot work: writes
chapters/<slug>/words-<x>.txt with every word of the chapter and its cut cue (word start minus 2 frames), beat by beat.

python tools/split-chapters.py <slug> a="0 cold open, demo 1" b="3 fun: turning point" c="4 cost: power" ...
   each letter = the name of the chapter's FIRST beat in episode.json "script"; chapters run to the next letter's beat.
   With no letters it lists the beats and their start times, to choose the splits.

Run after the voice (words.json is final). Edit cues in chapter files are "s:<cue>" from these lists, so chapters can be
built in any order and merged with tools/merge-chapters.py.
"""
import json, pathlib, re, sys

slug = sys.argv[1]
root = pathlib.Path.cwd()
epd = root / 'src' / 'episodes' / slug
ep = json.loads((epd / 'episode.json').read_text(encoding='utf-8'))
W = json.loads((epd / 'words.json').read_text(encoding='utf-8'))
LEAD = 2 / ep.get('fps', 30)

beats, k = [], 0
for b in ep['script']:
    n = len(re.findall(r"[\w'’]+", b['text']))
    beats.append({'beat': b['beat'], 'text': b['text'], 'w0': k, 'w1': k + n - 1, 's': W[k]['s'], 'e': W[k + n - 1]['e']})
    k += n
if k != len(W):
    raise SystemExit(f'words.json has {len(W)} words, the script {k}: re-run the voice')

splits = dict(a.split('=', 1) for a in sys.argv[2:])
if not splits:
    for b in beats:
        print(f"{int(b['s'] // 60)}:{b['s'] % 60:05.2f}  {b['beat']}")
    sys.exit(0)

names = [b['beat'] for b in beats]
starts = sorted((names.index(v), c) for c, v in splits.items())
if starts[0][0] != 0:
    raise SystemExit('The first chapter must start at the first beat')
out = root / 'chapters' / slug
out.mkdir(parents=True, exist_ok=True)
end_of_episode = W[-1]['e'] + ep.get('tail', 0.9)
for i, (i0, ch) in enumerate(starts):
    i1 = starts[i + 1][0] - 1 if i + 1 < len(starts) else len(beats) - 1
    lines = [f'# chapter {ch.upper()}: beats {i0}-{i1}. Cue = word start - 2 frames (use as "s:<cue>" in edit).']
    for b in beats[i0:i1 + 1]:
        lines.append(f'\n## beat "{b["beat"]}"  {b["s"]:.2f}-{b["e"]:.2f} s\n# {b["text"]}')
        lines.append(' '.join(f'{W[j]["w"]}{W[j]["p"]}@{max(0, W[j]["s"] - LEAD):.2f}' for j in range(b['w0'], b['w1'] + 1)))
    nxt = beats[i1 + 1]['s'] - LEAD if i1 + 1 < len(beats) else end_of_episode
    lines.append(f"\n# chapter ends at s:{nxt:.2f} (next chapter's first cut, or the episode end)")
    (out / f'words-{ch}.txt').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'{ch}: {max(0, beats[i0]["s"] - LEAD):.2f} -> {nxt:.2f}  ({i1 - i0 + 1} beats)')
