"""Fill episode.json sound.clips for every clip name used in sound events/repeats, copying (prompt, seconds) from any
episode whose entry hashes to a file already in library/sfx (merge-chapters.py leaves clips untouched).

python3 tools/fill-sound-clips.py <slug>      (run from the studio folder, after merge-chapters.py)
"""
import json, glob, hashlib, pathlib, sys
slug = sys.argv[1]
p = pathlib.Path(f'src/episodes/{slug}/episode.json'); e = json.loads(p.read_text())
snd = e['sound']; used = {ev[1] for ev in snd.get('events', [])} | {r['clip'] for r in snd.get('repeats', [])}
lib = {f.name for f in pathlib.Path('library/sfx').glob('*.mp3')}
cands = {}
for f in glob.glob('src/episodes/*/episode.json'):
    try: c = json.load(open(f)).get('sound', {}).get('clips', {})
    except Exception: continue
    for n, (pr, s) in c.items():
        h = hashlib.sha1(f'{pr}|{s}'.encode()).hexdigest()[:8]
        if f'{n}-{h}.mp3' in lib: cands.setdefault(n, [pr, s])
miss = []
for n in sorted(used):
    if n in snd['clips']: continue
    if n in cands: snd['clips'][n] = cands[n]
    else: miss.append(n)
p.write_text(json.dumps(e, ensure_ascii=False, indent=1) + '\n')
print('used', len(used), 'clips', len(snd['clips']), 'missing', miss)
