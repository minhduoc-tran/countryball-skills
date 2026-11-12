"""Replace ONE sentence of a finished LucyLab take without re-buying the whole script (and without breaking every cut).

python tools/voice-lucylab-splice.py <slug> "<old sentence>" "<new sentence>" [--dry]   (run from the studio folder)

The old sentence must appear exactly once in episode.json "script" (match whole words, punctuation included, e.g.
"Gần trưa ngày ba mươi tháng Tư năm một nghìn chín trăm bảy mươi lăm."). Steps:
  1. LucyLab voices only the new sentence (same voice + speed), trimmed of its own leading/trailing silence.
  2. public/<slug>/voice.wav: the old sentence's audio (first word start .. last word end) is cut out and the new one
     pasted in; the pauses around it are kept, so everything after moves by delta = new - old seconds.
  3. words.json: the old sentence's words are replaced by the new ones (timed inside the new audio with align_block),
     later words shift by delta. episode.json script text is updated, voice_meta.json gets the new signature so a
     later voice-lucylab.py run reuses this spliced take instead of re-buying it.
  4. chapters/<slug>/ch*.json: every "s:<sec>" cue after the sentence shifts by delta; sound.clips "score" seconds
     grows by delta (re-run synth-score.py, merge-chapters.py, plan.py, sfx.py afterwards).
Never re-run voice-lucylab.py --force afterwards unless you want a fresh full take (that would drop the splice).
"""
import importlib.util, json, pathlib, re, subprocess, sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from voice_common import align_block, tokens, voice_sig  # noqa: E402
from wi import write_wav  # noqa: E402  (voice_common put the skill scripts on sys.path)

spec = importlib.util.spec_from_file_location('vl', pathlib.Path(__file__).parent / 'voice-lucylab.py')
SRC = spec.loader.get_data(spec.origin).decode()
# reuse the API helpers of voice-lucylab.py without running its main flow (everything above "slug = sys.argv[1]")
exec(compile(SRC.split('\nslug = sys.argv[1]')[0], spec.origin, 'exec'))  # defines rpc, tts_part, parse_srt, SR, decode, write_wav...

slug, old, new = sys.argv[1], sys.argv[2].strip(), sys.argv[3].strip()
dry = '--dry' in sys.argv
ep_path = pathlib.Path('src/episodes') / slug / 'episode.json'
ep = json.loads(ep_path.read_text())
words_path = ep_path.parent / 'words.json'
words = json.loads(words_path.read_text())
voice_wav = pathlib.Path('public') / slug / 'voice.wav'

# ---- locate the old sentence in the script and in words.json ----
hits = [i for i, b in enumerate(ep['script']) if old in b['text']]
if len(hits) != 1:
    raise SystemExit(f'old sentence found in {len(hits)} beats (need exactly 1)')
bi = hits[0]
before = ' '.join(b['text'] for b in ep['script'][:bi])
k0 = len(tokens(before)) + len(tokens(ep['script'][bi]['text'].split(old)[0]))
old_toks, new_toks = tokens(old), tokens(new)
k1 = k0 + len(old_toks)
if [w['w'] for w in words[k0:k1]] != [t['w'] for t in old_toks]:
    raise SystemExit(f'words.json mismatch at {k0}: {[w["w"] for w in words[k0:k1]]}')
a, b = words[k0]['s'], words[k1 - 1]['e']
print(f'old sentence: words {k0}..{k1 - 1}, {a:.3f}-{b:.3f} s ({b - a:.2f} s)')

# ---- 1. voice the new sentence ----
V = dict(ep['voice'])
tmp = pathlib.Path('/tmp') / f'splice-{slug}.wav'
pw, srt, jid, _ = tts_part(new, V, tmp)
x_new = decode(pw)
runs = [i for i, v in enumerate(np.abs(x_new) > 0.02) if v]  # trim the clip's own silence (2 % of full scale)
lo, hi = max(0, runs[0] - int(0.02 * SR)), min(len(x_new), runs[-1] + int(0.04 * SR))
x_new = x_new[lo:hi]
x_old = decode(voice_wav)  # match the loudness of the processed take: RMS of the old sentence vs the new clip
rms = lambda y: float(np.sqrt(np.mean(y[np.abs(y) > 0.02] ** 2)))
x_new = x_new * rms(x_old[int(a * SR):int(b * SR)]) / rms(x_new)
new_len = len(x_new) / SR
delta = new_len - (b - a)
print(f'new sentence: {new_len:.2f} s, delta {delta:+.3f} s (LucyLab job {jid})')

# word times inside the new clip, then placed at a
nw = [{'w': t['w'], 's': 0.0, 'e': 0.0, 'p': t['p']} for t in new_toks]
align_block(nw, x_new, 0.0, new_len, new_toks)
for w in nw:
    w['s'], w['e'] = round(w['s'] + a, 3), round(w['e'] + a, 3)
if dry:
    print('dry run:', [(w['w'], w['s']) for w in nw]); tmp.unlink(); sys.exit()

# ---- 2. audio ----
x = x_old
ia, ib = int(a * SR), int(b * SR)
write_wav(voice_wav, np.concatenate([x[:ia], x_new, x[ib:]]))
tmp.unlink()

# ---- 3. words, script, signature ----
shift = lambda s: round(s + delta, 3)
words = words[:k0] + nw + [{**w, 's': shift(w['s']), 'e': shift(w['e'])} for w in words[k1:]]
words_path.write_text(json.dumps(words, ensure_ascii=False, indent=1))
ep['script'][bi]['text'] = ep['script'][bi]['text'].replace(old, new)
clips = ep.get('sound', {}).get('clips', {})
if 'score' in clips:
    clips['score'][1] = round(clips['score'][1] + delta, 2)
ep_path.write_text(json.dumps(ep, ensure_ascii=False, indent=1))
meta_p = pathlib.Path('out') / slug / 'voice_meta.json'
if meta_p.exists():
    meta = json.loads(meta_p.read_text())
    meta['sig'] = voice_sig(ep)[1]; meta['spliced'] = meta.get('spliced', []) + [{'old': old, 'new': new, 'delta': round(delta, 3)}]
    meta_p.write_text(json.dumps(meta, ensure_ascii=False))

# ---- 4. chapter cues ----
CUE = re.compile(r'"s:([0-9.]+)"')
for ch in sorted((pathlib.Path('chapters') / slug).glob('ch*.json')):
    txt = ch.read_text()
    out = CUE.sub(lambda m: f'"s:{float(m.group(1)) + delta:.2f}"' if float(m.group(1)) > a + 0.05 else m.group(0), txt)
    if out != txt:
        ch.write_text(out); print('shifted cues in', ch.name)
print('done: now re-run split-chapters (words files), synth-score.py, merge-chapters.py, plan.py, sfx.py, master.py')
