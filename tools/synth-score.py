"""The long episode's music bed, built locally (no ElevenLabs): one clip the length of the episode, its sections cued
to the script's beats, saved into library/sfx/ under the name and prompt that episode.json's sound.clips gives it.

python tools/synth-score.py <slug>          (run from the studio folder, after the voice; re-run if the voice changes)

The plan is episode.json "sound.score": a list of sections laid over each other, each from a beat to a beat
(beat names from "script", or "END"; optional "from_off"/"to_off" seconds):
  {"kind": "loop", "from": ..., "to": ..., "gain": 0.55}                  the library's playful loop (pizzicato)
  {"kind": "pad", "chords": ["Am", "F"], "every": 6, "gain": 0.16, "bright": 5}   soft held chords
  {"kind": "bells", "notes": [81, null, 76], "step": 1.5, "gain": 0.05, "decay": 1.6}   music box / bell (MIDI notes)
  {"kind": "drone", "note": 33, "gain": 0.13}, {"kind": "heartbeat", "bpm": 62, "gain": 0.24}   tension
  {"kind": "pluck", "chords": ["C", "G", "Am", "F"], "bpm": 108, "gain": 0.12, "every": 2}   plucked arpeggio, bright
Chords: C Dm Em F G Am E D Bb Gm Cm. See last-one and nghin-dong-moi-giay episode.json for full plans.
"""
import json, re, sys, pathlib

sys.path.insert(0, str(pathlib.Path.home() / '.claude' / 'skills' / 'what-if-animation' / 'scripts'))
import numpy as np  # noqa: E402
from wi import SR, clip_path, decode, ep_dir, load_episode, load_json, write_wav, LIB  # noqa: E402

slug = sys.argv[1]
ep = load_episode(slug)
words = load_json(ep_dir(slug) / 'words.json')


def beat_times():
    """First-word start of every beat, by name."""
    out, k = {}, 0
    for b in ep['script']:
        n = len(re.findall(r"[\w'’]+", b['text']))
        out[b['beat']] = words[k]['s']
        k += n
    return out


T = beat_times()
END = words[-1]['e'] + ep.get('tail', 0.9)  # the same end plan.py computes
N = int((END + 0.5) * SR)
t_all = np.arange(N) / SR
NOTE = lambda m: 440.0 * 2 ** ((m - 69) / 12)  # midi to Hz


def env(n, a, r):
    e = np.ones(n)
    a, r = min(int(a * SR), n // 2), min(int(r * SR), n // 2)
    if a:
        e[:a] = np.linspace(0, 1, a)
    if r:
        e[-r:] = np.linspace(1, 0, r)
    return e


def pad(t0, t1, chords, every, gain=0.18, bright=5):
    """Soft chords, each held `every` s with long attack and release, a few odd-ish harmonics, slow tremolo."""
    out = np.zeros(N)
    t = t0
    i = 0
    while t < t1:
        dur = min(every + 2.0, t1 - t + 1.0)
        a, n = int(t * SR), int(dur * SR)
        n = min(n, N - a)
        if n <= 0:
            break
        tt = np.arange(n) / SR
        x = np.zeros(n)
        for m in chords[i % len(chords)]:
            for d in (-0.12, 0.0, 0.12):  # three detuned voices
                f = NOTE(m + d)
                for h in range(1, bright + 1):
                    x += np.sin(2 * np.pi * f * h * tt + h * d) / h ** 1.6
        x *= (1 + 0.15 * np.sin(2 * np.pi * 0.18 * tt)) * env(n, 1.8, 2.0)
        out[a:a + n] += x
        t += every
        i += 1
    peak = np.abs(out).max() or 1
    m = (t_all >= t0) & (t_all < t1 + 2)
    out[~m] = 0
    return out / peak * gain


def bells(t0, t1, notes, step, gain=0.12, decay=1.6):
    """A music box / bell: sine + bright partials with an exponential decay, one note every `step` s."""
    out = np.zeros(N)
    t, i = t0, 0
    while t < t1:
        m = notes[i % len(notes)]
        if m is not None:
            a = int(t * SR)
            n = min(int(decay * 3 * SR), N - a)
            if n <= int(0.01 * SR):
                break
            tt = np.arange(n) / SR
            f = NOTE(m)
            x = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 2.0 * tt) + 0.12 * np.sin(2 * np.pi * f * 3.01 * tt)) * np.exp(-tt / decay * 2.2)
            x[:int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
            out[a:a + n] += x * gain
        t += step
        i += 1
    return out


def heartbeat(t0, t1, bpm=62, gain=0.35):
    out = np.zeros(N)
    t = t0
    while t < t1:
        for off, g in ((0.0, 1.0), (0.22, 0.6)):
            a = int((t + off) * SR)
            n = min(int(0.25 * SR), N - a)
            if n <= 0:
                continue
            tt = np.arange(n) / SR
            out[a:a + n] += np.sin(2 * np.pi * (52 - 20 * tt) * tt) * np.exp(-tt * 18) * g * gain
        t += 60 / bpm
    return out


def drone(t0, t1, m=33, gain=0.2):
    out = np.zeros(N)
    a, b = int(t0 * SR), min(int(t1 * SR), N)
    tt = np.arange(b - a) / SR
    x = np.sin(2 * np.pi * NOTE(m) * tt) + 0.5 * np.sin(2 * np.pi * NOTE(m + 7) * tt) + 0.3 * np.sin(2 * np.pi * NOTE(m + 12) * tt * 1.002)
    out[a:b] = x * env(b - a, 3.0, 3.0) * (1 + 0.2 * np.sin(2 * np.pi * 0.07 * tt)) * gain / 1.8
    return out


def loop_clip(x, t0, t1, gain, xf=1.0):
    """The playful library loop laid end to end from t0 to t1 with crossfades, faded out at t1."""
    out = np.zeros(N)
    t, L, f = t0, len(x) / SR, int(xf * SR)
    while t < t1:
        a = int(t * SR)
        n = min(len(x), N - a, int((t1 - t + xf) * SR))
        if n <= 0:
            break
        seg = x[:n].copy()
        seg[:f] *= np.linspace(0, 1, f) if t > t0 else 1
        seg[-f:] *= np.linspace(1, 0, f)
        out[a:a + n] += seg * gain
        t += L - xf
    return out


def reverb(x, secs=2.2, mix=0.28):
    """A cheap hall: convolution with decaying noise, overlap-add in blocks."""
    rng = np.random.default_rng(7)
    L = int(secs * SR)
    ir = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 3.2)
    ir /= np.abs(ir).sum() ** 0.5 * 12
    B = 1 << 17
    nfft = 1 << int(np.ceil(np.log2(B + L)))
    IR = np.fft.rfft(ir, nfft)
    wet = np.zeros(len(x) + L)
    for i in range(0, len(x), B):
        blk = np.fft.irfft(np.fft.rfft(x[i:i + B], nfft) * IR, nfft)[:min(B, len(x) - i) + L]
        wet[i:i + len(blk)] += blk
    return x * (1 - mix) + wet[:len(x)] * mix


def pluck(t0, t1, chords, bpm=108, gain=0.12, every=2.0):
    """A plucked-string arpeggio (Karplus-Strong): chord tones up and down in eighth notes, a bass note on each bar,
    the chord changing every `every` bars. Light and bright: the sound of good news."""
    out = np.zeros(N)
    step = 60 / bpm / 2
    rng = np.random.default_rng(3)

    def ks(f, dur):
        n, p = int(dur * SR), max(2, int(SR / f))
        buf = rng.uniform(-1, 1, p)
        y = np.zeros(n)
        for i in range(n):  # the classic averaging loop; notes are cached, so it runs once per pitch
            y[i] = buf[i % p]
            buf[i % p] = 0.996 * 0.5 * (buf[i % p] + buf[(i + 1) % p])
        return y * np.exp(-np.arange(n) / SR * 3.0)
    cache = {}

    def note(m, dur):
        if (m, dur) not in cache:
            cache[(m, dur)] = ks(NOTE(m), dur)
        return cache[(m, dur)]
    t, i, bar = t0, 0, step * 8
    while t < t1 - step:
        ch = chords[int((t - t0) / (bar * every)) % len(chords)]
        tones = [m + 12 for m in ch] + [ch[1] + 24]
        seq = tones + tones[-2:0:-1]
        a = int(t * SR)
        for m, dur, g in [(seq[i % len(seq)], 0.6, 1.0)] + ([(ch[0] - 12, 1.2, 1.3)] if i % 8 == 0 else []):
            y = note(m, dur)[:max(0, N - a)]
            out[a:a + len(y)] += y * gain * g
        t += step
        i += 1
    return out


CHORD = {'C': [48, 52, 55], 'Dm': [50, 53, 57], 'Em': [52, 55, 59], 'F': [53, 57, 60], 'G': [55, 59, 62], 'Am': [57, 60, 64],
         'E': [52, 56, 59], 'D': [50, 54, 57], 'Bb': [46, 50, 53], 'Gm': [55, 58, 62], 'Cm': [48, 51, 55]}
CHORD_PAD = dict(CHORD, C=[48, 55, 64])  # the open C voicing the pads were tuned with


def when(name, off=0.0):
    """A beat name (its first word's start) or 'END', plus an offset in seconds."""
    return (END if name == 'END' else T[name]) + off


play = decode(LIB / 'music-4cdabe20.mp3')
play /= np.abs(play).max()
plan = ep['sound'].get('score')
if not plan:
    raise SystemExit('episode.json sound.score is missing: a list of sections, see the docstring')
mus = np.zeros(N)
for sec in plan:
    t0, t1 = when(sec['from'], sec.get('from_off', 0.0)), when(sec['to'], sec.get('to_off', 0.0))
    k, g = sec['kind'], sec.get('gain', 0.15)
    if k == 'loop':
        mus += loop_clip(play, t0, t1, g)
    elif k == 'pad':
        mus += pad(t0, t1, [CHORD_PAD[c] for c in sec['chords']], sec.get('every', 5.0), gain=g, bright=sec.get('bright', 5))
    elif k == 'bells':
        mus += bells(t0, t1, sec['notes'], sec.get('step', 0.7), gain=g, decay=sec.get('decay', 1.6))
    elif k == 'drone':
        mus += drone(t0, t1, sec.get('note', 33), gain=g)
    elif k == 'heartbeat':
        mus += heartbeat(t0, t1, sec.get('bpm', 62), gain=g)
    elif k == 'pluck':
        mus += pluck(t0, t1, [CHORD[c] for c in sec['chords']], sec.get('bpm', 108), gain=g, every=sec.get('every', 2.0))
    else:
        raise SystemExit(f'Unknown score section kind {k}')
mus *= env(N, 0.05, 3.0)
mus = reverb(mus)

S = ep['sound']['clips']['score']
out = clip_path('score', S[0], S[1])
write_wav(out.with_suffix('.wav'), mus, peak=0.9)
import subprocess  # noqa: E402
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(out.with_suffix('.wav')), '-c:a', 'libmp3lame', '-q:a', '2', str(out)], check=True)
out.with_suffix('.wav').unlink()
print(f'score: {N / SR:.1f} s -> {out.name}')
