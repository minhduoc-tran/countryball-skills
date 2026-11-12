"""Re-time a finished episode's chapters for a translated voice: same beats, same shots, new words.

python tools/translate-episode-timing.py <src-slug> <dst-slug>       (run from the studio folder)

Both episodes must have the same beats (same "beat" names, same order) in episode.json "script", and a finished
voice (words.json). Every edit cue "s:<t>" in chapters/<src>/ch*.json is mapped to the destination voice by its
position inside its beat (proportional), then snapped to the nearest phrase start of the new voice when one is within
0.8 s, kept in order with at least 0.4 s between cuts. The chapter files are written to chapters/<dst>/ with only the
cues changed: shot ids, files, looks, fx and sound events (cued on shot ids) carry over unchanged.
"""
import json, pathlib, re, sys

src, dst = sys.argv[1], sys.argv[2]
root = pathlib.Path.cwd()
LEAD = 2 / 30


def beats(slug):
    ep = json.loads((root / 'src' / 'episodes' / slug / 'episode.json').read_text(encoding='utf-8'))
    W = json.loads((root / 'src' / 'episodes' / slug / 'words.json').read_text(encoding='utf-8'))
    out, k = [], 0
    for b in ep['script']:
        n = len(re.findall(r"[\w'’]+", b['text']))
        out.append({'beat': b['beat'], 's': max(0.0, W[k]['s'] - LEAD)})
        k += n
    end = W[-1]['e'] + ep.get('tail', 0.9)
    for i, b in enumerate(out):
        b['e'] = out[i + 1]['s'] if i + 1 < len(out) else end
    phrase = [max(0.0, W[i]['s'] - LEAD) for i in range(len(W)) if i == 0 or W[i - 1]['p'].strip()]
    return out, phrase


A, _ = beats(src)
B, phrases = beats(dst)
if [b['beat'] for b in A] != [b['beat'] for b in B]:
    raise SystemExit('The two episodes must have the same beats in the same order')


def remap(t):
    i = max(j for j, b in enumerate(A) if b['s'] <= t + 1e-6)
    a, b = A[i], B[i]
    if abs(t - a['s']) < 0.05:  # a cut on a beat start stays on the beat start
        return b['s'], True
    x = b['s'] + (t - a['s']) / max(a['e'] - a['s'], 0.01) * (b['e'] - b['s'])
    near = min(phrases, key=lambda p: abs(p - x))
    return (near if abs(near - x) <= 0.8 and b['s'] <= near < b['e'] else x), False


out_dir = root / 'chapters' / dst
out_dir.mkdir(parents=True, exist_ok=True)
last, moved = -1.0, 0
for p in sorted((root / 'chapters' / src).glob('ch*.json')):
    c = json.loads(p.read_text(encoding='utf-8'))
    for e in c['edit']:
        at = str(e['at'])
        if not at.startswith('s:'):
            raise SystemExit(f'{p.name}: cue {at} is not an s: cue')
        t, _ = remap(float(at[2:]))
        t = max(t, last + 0.4)
        e['at'] = f's:{t:.2f}'
        last = t
        moved += 1
    (out_dir / p.name).write_text(json.dumps(c, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'{moved} cuts re-timed from {src} ({A[-1]["e"]:.1f} s) to {dst} ({B[-1]["e"]:.1f} s) -> chapters/{dst}/')
