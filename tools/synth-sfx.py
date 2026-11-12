"""Sound effects built locally (no ElevenLabs): impacts, whooshes, weather and machines that library/sfx/ lacks.
Each clip is written into library/sfx/ under the name + prompt + length that episode.json "sound.clips" gives it, so
the skill's sfx.py finds it already "in the library" and never calls the API.

python tools/synth-sfx.py [name ...]        (run from the studio folder; no names = all clips)
Prints the "clips" entries to paste into episode.json sound.clips.

Clips: punch_hit (huge punch boom), swoosh (fist swing), sonic_crack (supersonic whip crack), rubble (debris settling),
metal_crash (robot parts, clang), splash (big wave), rain (storm bed, 20 s), thunder, siren (emergency alert),
drone_buzz (small UAV hovering), arcade_count (score counter beeps), sea_waves (surf bed, 20 s),
water_drain (the whole sea sucked away: rising roar, gurgle, then dead silence).
"""
import json, pathlib, subprocess, sys, tempfile

sys.path.insert(0, str(pathlib.Path.home() / '.claude' / 'skills' / 'what-if-animation' / 'scripts'))
import numpy as np  # noqa: E402
from wi import SR, clip_path, write_wav  # noqa: E402

RNG = np.random.default_rng(7)


def t_of(secs):
    return np.arange(int(secs * SR)) / SR


def noise(secs):
    return RNG.standard_normal(int(secs * SR))


def band(x, lo=None, hi=None):
    """Brick-wall band filter in the frequency domain (zero-padded so nothing wraps round to the start)."""
    n = len(x)
    X = np.fft.rfft(x, 2 * n)
    f = np.fft.rfftfreq(2 * n, 1 / SR)
    if lo:
        X[f < lo] = 0
    if hi:
        X[f > hi] = 0
    return np.fft.irfft(X, 2 * n)[:n]


def env(t, attack, decay):
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


def sweep(t, f0, f1, k):
    """Sine whose pitch glides from f0 to f1 exponentially (rate k)."""
    f = f1 + (f0 - f1) * np.exp(-t * k)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def reverb(x, secs=1.2, mix=0.25):
    tail = band(noise(secs), 200, 6000) * np.exp(-t_of(secs) / (secs / 5))
    wet = np.convolve(x, tail / np.abs(tail).sum() * 40)[: len(x)]
    return x + mix * wet


def pad(x, secs):
    n = int(secs * SR)
    x = np.pad(x, (0, max(0, n - len(x))))[:n]
    x[-int(0.08 * SR):] *= np.linspace(1, 0, int(0.08 * SR))  # never end on a click
    return x


# ---------------------------------------------------------------- the clips
def punch_hit():
    t = t_of(1.8)
    boom = sweep(t, 140, 32, 9) * env(t, 0.002, 0.45)
    crack = band(noise(1.8), 900, 9000) * env(t, 0.0005, 0.03)
    body = band(noise(1.8), 40, 400) * env(t, 0.003, 0.25)
    x = 1.0 * boom + 0.55 * crack + 0.6 * body
    return reverb(np.tanh(2.2 * x), 1.6, 0.3)


def swoosh():
    t = t_of(0.7)
    shape = np.sin(np.pi * np.clip(t / 0.55, 0, 1)) ** 3
    x = np.zeros_like(t)
    for lo, hi, w in ((300, 900, 0.6), (900, 2500, 1.0), (2500, 6000, 0.4)):
        x += w * band(noise(0.7), lo, hi)
    return x * shape


def sonic_crack():
    t = t_of(1.4)
    n = np.zeros_like(t)
    i0, i1 = int(0.01 * SR), int(0.016 * SR)
    n[i0], n[i1] = 1.0, -1.0  # the N-wave's two shocks
    n[i0:i1] = np.linspace(1, -1, i1 - i0)
    x = band(n, 60, 12000) * 40 + band(noise(1.4), 1500, 10000) * env(t, 0.0005, 0.02)
    return reverb(np.tanh(x), 1.3, 0.45)


def rubble():
    secs = 2.4
    x = band(noise(secs), 60, 1200) * env(t_of(secs), 0.01, 0.6) * 0.5
    for k in range(70):
        at = int((RNG.random() ** 1.6) * (secs - 0.2) * SR)
        ln = int(0.05 * SR)
        hit = band(noise(0.05), 150 + RNG.random() * 600, 3000) * np.exp(-np.arange(ln) / SR / 0.012)
        x[at:at + ln] += hit * (1 - at / (secs * SR)) * (0.4 + RNG.random())
    return x


def metal_crash():
    t = t_of(2.2)
    x = np.zeros_like(t)
    for f, d in ((317, 0.9), (521, 0.7), (844, 0.5), (1290, 0.35), (1977, 0.25), (2711, 0.2)):
        x += np.sin(2 * np.pi * f * t + RNG.random() * 6) * env(t, 0.001, d)
    x += 1.5 * band(noise(2.2), 2000, 9000) * env(t, 0.001, 0.12)
    x += 0.8 * sweep(t, 120, 45, 7) * env(t, 0.002, 0.3)
    return reverb(np.tanh(1.5 * x), 1.4, 0.3)


def splash():
    t = t_of(2.4)
    body = band(noise(2.4), 200, 5000) * (np.minimum(1, t / 0.05) * np.exp(-t / 0.7))
    thump = sweep(t, 90, 40, 6) * env(t, 0.003, 0.3)
    drops = band(noise(2.4), 2500, 9000) * np.clip(np.sin(np.pi * t / 2.4), 0, 1) * 0.3 * (RNG.random(len(t)) > 0.97)
    return 0.8 * body + 0.7 * thump + drops


def rain():
    secs = 20
    t = t_of(secs)
    x = band(noise(secs), 400, 9000) * 0.6 + band(noise(secs), 80, 400) * 0.5
    x *= 1 + 0.15 * np.sin(2 * np.pi * 0.13 * t)
    fade = np.minimum(1, np.minimum(t, secs - t) / 0.5)
    return x * fade


def thunder():
    t = t_of(4.5)
    crack = band(noise(4.5), 800, 8000) * env(t, 0.002, 0.08)
    rumble = band(noise(4.5), 25, 220) * (np.minimum(1, t / 0.15) * np.exp(-t / 1.4))
    rumble *= 1 + 0.5 * np.sin(2 * np.pi * 1.7 * t) * np.sin(2 * np.pi * 0.6 * t)
    return np.tanh(1.6 * (0.6 * crack + 1.4 * rumble))


def siren():
    t = t_of(3.0)
    f = np.where((t * 2.0) % 1 < 0.5, 880, 660)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 + np.sin(2 * np.pi * np.cumsum(f) / SR)
    gate = ((t * 4.0) % 1 < 0.8).astype(float)
    return band(x * gate, 200, 4000) * np.minimum(1, (3.0 - t) / 0.1)


def drone_buzz():
    t = t_of(5.0)
    f = 190 + 6 * np.sin(2 * np.pi * 0.7 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 9))
    x = x * (0.8 + 0.2 * np.sin(2 * np.pi * 23 * t)) + 0.3 * band(noise(5.0), 1000, 5000)
    fade = np.minimum(1, np.minimum(t, 5.0 - t) / 0.3)
    return x * fade


def arcade_count():
    t = t_of(1.6)
    x = np.zeros_like(t)
    for k in range(16):
        at = int(k * 0.08 * SR)
        ln = int(0.05 * SR)
        f = 600 + k * 70
        x[at:at + ln] += np.sign(np.sin(2 * np.pi * f * np.arange(ln) / SR)) * 0.6
    return band(x, 200, 6000)


def sea_waves():
    """Surf bed: a deep swell every ~6.6 s (rumble builds, the break hisses, the wash fades), loop-friendly."""
    secs = 20
    t = t_of(secs)
    ph = (t / (secs / 3)) % 1  # three waves per clip, so the loop point lands on a quiet trough
    swell = np.clip(np.sin(np.pi * ph), 0, 1) ** 2
    hiss = np.exp(-np.maximum(ph - 0.45, 0) / 0.18) * (ph > 0.45)
    x = band(noise(secs), 40, 300) * (0.25 + 0.6 * swell) + band(noise(secs), 900, 7000) * 0.5 * hiss
    x += band(noise(secs), 300, 900) * 0.15
    fade = np.minimum(1, np.minimum(t, secs - t) / 0.4)
    return x * fade


def water_drain():
    t = t_of(3.5)
    rise = np.minimum(1, t / 2.2) ** 1.5 * (t < 2.6)
    roar = band(noise(3.5), 60, 1800) * rise
    gurgle = sum(np.sin(2 * np.pi * (180 + 90 * k) * t + 3 * np.sin(2 * np.pi * (5 + k) * t)) for k in range(4)) / 4
    gurgle *= rise * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t)) * 0.35
    suck = sweep(t, 400, 60, 2.5) * env(t, 0.5, 0.9) * 0.4
    return np.tanh(1.4 * (roar + gurgle + suck)) * np.minimum(1, np.maximum(0, 2.7 - t) / 0.1)


CLIPS = {
    'punch_hit': ('synth: huge cartoon punch impact boom, deep sub drop with a sharp crack', 1.8, punch_hit),
    'swoosh': ('synth: fast fist swing whoosh', 0.7, swoosh),
    'sonic_crack': ('synth: supersonic whip crack, sonic boom N-wave with echo', 1.4, sonic_crack),
    'rubble': ('synth: debris and rubble falling and settling', 2.4, rubble),
    'metal_crash': ('synth: giant robot metal crash and clang', 2.2, metal_crash),
    'splash': ('synth: huge wave splash with a deep thump', 2.4, splash),
    'rain': ('synth: heavy tropical storm rain bed', 20, rain),
    'thunder': ('synth: thunder crack and long rumble', 4.5, thunder),
    'siren': ('synth: two-tone emergency alert beeps', 3.0, siren),
    'drone_buzz': ('synth: small quadcopter drone hovering buzz', 5.0, drone_buzz),
    'arcade_count': ('synth: arcade score counter rising beeps', 1.6, arcade_count),
    'sea_waves': ('synth: calm beach surf bed, slow waves breaking and washing', 20, sea_waves),
    'water_drain': ('synth: the whole ocean sucked away, rising roar and gurgle then silence', 3.5, water_drain),
}

if __name__ == '__main__':
    names = sys.argv[1:] or list(CLIPS)
    for n in names:
        prompt, secs, fn = CLIPS[n]
        x = pad(fn(), secs)
        out = clip_path(n, prompt, secs)
        with tempfile.TemporaryDirectory() as d:
            w = pathlib.Path(d) / 'x.wav'
            write_wav(w, x, peak=0.89)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(w), '-b:a', '160k', str(out)], check=True)
        print('  wrote', out.name)
    print(json.dumps({n: [CLIPS[n][0], CLIPS[n][1]] for n in names}, ensure_ascii=False))
