"""Shared by the voice tools (voice-lucylab.py, voice-gemini.py): word timings estimated from the audio when the TTS
gives none (or only per sentence), the signature that makes the skill's voice.py reuse our take, and chapter holds.

Word timing method: split each sentence into phrases at its punctuation, put the phrase breaks on the silences between
voiced runs with a dynamic programme (phrase_cuts), then share each phrase's voiced time among its words by length.
"""
import hashlib, json, pathlib, re, subprocess, sys

SKILL_SCRIPTS = pathlib.Path.home() / '.claude' / 'skills' / 'what-if-animation' / 'scripts'
sys.path.insert(0, str(SKILL_SCRIPTS))
import numpy as np  # noqa: E402
from wi import SR, decode, ep_dir, load_json, pub_dir, save_json, write_wav  # noqa: E402

WORD = re.compile(r"[\w'’]")

# the defaults voice.py merges the episode's "voice" into; the signature must be computed the same way
ELEVEN_DEFAULTS = {'id': 'TX3LPaxmHKxFdv7VOQHJ', 'model': 'eleven_multilingual_v2', 'settings': {'stability': 0.4, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True}}


def voice_sig(ep):
    """(text, signature) exactly as voice.py computes them, so voice.py treats our take as its own and only tightens."""
    V = dict(ELEVEN_DEFAULTS)
    V.update(ep.get('voice', {}))
    text = ' '.join(b['text'].strip() for b in ep['script'])
    return text, hashlib.sha1(json.dumps([text, V], sort_keys=True).encode()).hexdigest()[:12], V


def tokens(text):
    """The script's words in order, each with the punctuation after it (same rule as voice.py)."""
    out, cur = [], None
    for ch in text:
        if WORD.match(ch):
            cur = cur or {'w': '', 'p': ''}
            cur['w'] += ch
        else:
            if cur is not None:
                out.append(cur)
                cur = None
            if out and ch.strip():
                out[-1]['p'] += ch
    if cur:
        out.append(cur)
    return out



def voiced_runs(x, s, e, hop=0.01, min_sil=0.07):
    """Voiced stretches of x between s and e (seconds): 10 ms RMS frames above 8% of the block's loud level."""
    a, b = int(s * SR), int(e * SR)
    seg = x[a:b]
    n = max(1, len(seg) // int(hop * SR))
    rms = np.array([np.sqrt(np.mean(seg[i * int(hop * SR):(i + 1) * int(hop * SR)] ** 2) + 1e-12) for i in range(n)])
    on = rms > 0.08 * np.percentile(rms, 95)
    runs, i = [], 0
    while i < n:
        if on[i]:
            j = i
            while j < n and on[j]:
                j += 1
            runs.append([s + i * hop, s + j * hop])
            i = j
        else:
            i += 1
    merged = []
    for r in runs:  # silences shorter than min_sil are inside a word, not between words
        if merged and r[0] - merged[-1][1] < min_sil:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    return merged or [[s, e]]



def spread(words, runs):
    """Share the voiced time of `runs` among `words` by length; returns (start, end) per word."""
    total = sum(b - a for a, b in runs)
    wts = [len(w['w']) + 1.5 for w in words]
    W = sum(wts)

    def at(v):  # voiced time -> real time
        for a, b in runs:
            if v <= b - a:
                return a + v
            v -= b - a
        return runs[-1][1]
    out, acc = [], 0.0
    for wt in wts:
        v0, v1 = acc, acc + wt / W * total
        out.append((at(v0 + 1e-4), at(v1)))
        acc = v1
    return out



def phrase_cuts(groups, runs, strong=None):
    """Which silences between voiced runs are the phrase breaks: a dynamic programme over the whole sentence that keeps
    every phrase's voiced length close to its share of the text (by letters) and prefers longer silences. A greedy
    nearest-silence pick drifted by one phrase in long sentences and shifted every word after it.
    strong[g]: group g ends a sentence (. ? !). Those boundaries want the long pauses much more than comma breaks do:
    without it an English take put a sentence break on a breath inside the next sentence."""
    k = len(groups) - 1
    if k == 0:
        return []
    wt = [sum(len(w['w']) + 1.5 for w in g) for g in groups]
    voiced = sum(r1 - r0 for r0, r1 in runs)
    exp = [w / sum(wt) * voiced for w in wt]
    gaps = [i for i in range(len(runs) - 1) if runs[i + 1][0] - runs[i][1] >= 0.08]
    if len(gaps) < k:
        return []
    before = [sum(r1 - r0 for r0, r1 in runs[:i + 1]) for i in gaps]  # voiced time before each gap
    sil = [runs[i + 1][0] - runs[i][1] for i in gaps]
    strong = strong or [False] * k
    bonus_at = lambda g, j: (4.0 * min(sil[j], 1.0)) if strong[g] else (1.5 * min(sil[j], 0.5))
    cost = lambda act, g: ((act - exp[g]) / max(exp[g], 0.25)) ** 2
    INF = float('inf')
    n = len(gaps)
    dp = [[INF] * n for _ in range(k)]
    back = [[-1] * n for _ in range(k)]
    for j in range(n):
        dp[0][j] = cost(before[j], 0) - bonus_at(0, j)
    for g in range(1, k):
        for j in range(g, n):
            for jp in range(g - 1, j):
                c = dp[g - 1][jp] + cost(before[j] - before[jp], g) - bonus_at(g, j)
                if c < dp[g][j]:
                    dp[g][j], back[g][j] = c, jp
    end = min(range(k - 1, n), key=lambda j: dp[k - 1][j] + cost(voiced - before[j], k))
    out, j = [], end
    for g in range(k - 1, -1, -1):
        out.append(gaps[j])
        j = back[g][j]
    return out[::-1]




def align_block(ws, x, s, e, srt_tokens=None):
    """Time the words `ws` (dicts from tokens()) spoken between s and e seconds of audio x, in place.
    srt_tokens: the subtitle's own tokens for this block, whose punctuation marks extra pauses (LucyLab); optional."""
    runs = voiced_runs(x, s, e)
    groups, g = [], []
    for i, w in enumerate(ws):
        g.append(w)
        p = w['p'] + (srt_tokens[i]['p'] if srt_tokens else '')
        if re.search(r'[,.:;!?—-]', p):
            groups.append(g)
            g = []
    if g:
        groups.append(g)
    cuts = phrase_cuts(groups, runs, [bool(re.search(r'[.?!…]', grp[-1]['p'])) for grp in groups[:-1]])
    if len(cuts) == len(groups) - 1:
        parts, k0 = [], 0
        for c in cuts:
            parts.append(runs[k0:c + 1])
            k0 = c + 1
        parts.append(runs[k0:])
    else:
        groups, parts = [ws], [runs]
    for grp, rs in zip(groups, parts):
        for w, (a, b) in zip(grp, spread(grp, rs)):
            w['s'], w['e'] = round(a, 3), round(b, 3)
    return ws


def run_voice_py(slug):
    """Hand over to the skill's voice.py: it sees the matching signature and only tightens the pauses."""
    subprocess.run([sys.executable, str(SKILL_SCRIPTS / 'voice.py'), slug], check=True)


def apply_holds(slug, ep):
    """episode.json "holds": {"wordA|wordB": seconds} -> lengthen those pauses in voice.wav and words.json."""
    holds = ep.get('holds', {})
    if holds:
        bare = lambda w: re.sub(r'[^\w]', '', w)
        words = load_json(ep_dir(slug) / 'words.json')
        x = decode(pub_dir(slug) / 'voice.wav')
        adds = []  # (insert at seconds, extra seconds), in time order
        for a, b in zip(words, words[1:]):
            keep = holds.get(bare(a['w']) + '|' + bare(b['w']))
            if keep and b['s'] - a['e'] < keep:
                adds.append(((a['e'] + b['s']) / 2, keep - (b['s'] - a['e'])))
        parts, last = [], 0
        for at, extra in adds:
            parts += [x[last:int(at * SR)], np.zeros(int(extra * SR))]
            last = int(at * SR)
        parts.append(x[last:])
        write_wav(pub_dir(slug) / 'voice.wav', np.concatenate(parts))
        shift = lambda t: t + sum(e for at, e in adds if t > at)
        for w in words:
            w['s'], w['e'] = round(shift(w['s']), 3), round(shift(w['e']), 3)
        save_json(ep_dir(slug) / 'words.json', words)
        print(f'Held {len(adds)} chapter breaks, added {sum(e for _, e in adds):.2f} s: now {len(x) / SR + sum(e for _, e in adds):.2f} s')
