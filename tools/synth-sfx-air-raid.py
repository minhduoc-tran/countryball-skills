"""Air-raid sound effects built locally (no ElevenLabs), for war-history episodes told on maps: bombers, bombs, flak,
missiles, sirens, radar. Same contract as tools/synth-sfx.py (whose helpers it reuses): each clip is written into
library/sfx/ under its name + prompt + length, so the skill's sfx.py finds it and never calls the API.

python tools/synth-sfx-air-raid.py [name ...]     (run from the studio folder; no names = all clips)
Prints the "clips" entries to paste into episode.json sound.clips.

Clips: bomber_drone (high heavy bombers, 8 s bed), bomb_carpet (a carpet of bombs walking closer), bomb_far (one
distant blast), flak (anti-aircraft gun bursts), sam_launch (missile launch roar), air_raid_siren (rising wail),
radar_ping (scope sweep ping), radio_static (jammed radio / loudspeaker hiss), jet_pass (fighter fly-by).
"""
import importlib.util, json, pathlib, subprocess, sys, tempfile

_spec = importlib.util.spec_from_file_location('synth_sfx', pathlib.Path(__file__).with_name('synth-sfx.py'))
S = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(S)
np, band, env, noise, t_of, sweep, reverb, pad, RNG = S.np, S.band, S.env, S.noise, S.t_of, S.sweep, S.reverb, S.pad, S.RNG
SR = S.SR


def boom(secs, f0=90, f1=28, decay=0.9):
    t = t_of(secs)
    body = sweep(t, f0, f1, 5) * env(t, 0.004, decay * 0.5)
    rumble = band(noise(secs), 20, 260) * (np.minimum(1, t / 0.03) * np.exp(-t / decay))
    crack = band(noise(secs), 700, 5000) * env(t, 0.001, 0.04)
    return np.tanh(1.8 * (body + 1.3 * rumble + 0.35 * crack))


def bomber_drone():
    secs = 8.0
    t = t_of(secs)
    # eight engines a few hertz apart beat against each other: the classic throbbing drone of a bomber stream
    x = sum(np.sin(2 * np.pi * (52 + k * 0.7) * t + k) + 0.5 * np.sin(2 * np.pi * (104 + k * 1.3) * t) for k in range(8)) / 8
    x = x + 0.8 * band(noise(secs), 30, 380) + 0.12 * band(noise(secs), 900, 3000)
    return x * np.minimum(1, np.minimum(t, secs - t) / 1.5)


def bomb_carpet():
    secs = 4.5
    x = np.zeros(int(secs * SR))
    for k in range(11):  # each blast a little louder and brighter: the carpet walks towards the listener
        at, g = int((0.15 + k * 0.3 + RNG.random() * 0.08) * SR), 0.35 + 0.65 * k / 10
        b = boom((len(x) - at) / SR, 70 + 4 * k, 26, 0.7) * g
        n = min(len(b), len(x) - at)
        x[at:at + n] += b[:n]
    return np.tanh(1.2 * x)


def bomb_far():
    t = t_of(3.0)
    return band(boom(3.0, 60, 24, 1.1), 20, 900) * np.minimum(1, t / 0.02)


def flak():
    secs = 2.6
    x = np.zeros(int(secs * SR))
    at = 0.05
    while at < secs - 0.3:
        i, ln = int(at * SR), int(0.18 * SR)
        tt = np.arange(ln) / SR
        shot = sweep(tt, 160, 60, 30) * np.exp(-tt / 0.05) + band(noise(0.18), 400, 4000) * np.exp(-tt / 0.015)
        x[i:i + ln] += shot * (0.6 + 0.4 * RNG.random())
        at += 0.11 + RNG.random() * 0.05
    return reverb(np.tanh(1.5 * x), 1.2, 0.35)


def sam_launch():
    secs = 3.5
    t = t_of(secs)
    blast = boom(secs, 110, 40, 0.25) * 0.7
    roar = band(noise(secs), 150, 6000) * np.minimum(1, t / 0.08) * np.exp(-t / 1.4)
    hiss = band(noise(secs), 3000, 9000) * np.exp(-t / 0.6) * 0.4
    return np.tanh(1.3 * (blast + roar + hiss))


def air_raid_siren():
    secs = 6.0
    t = t_of(secs)
    f = 260 + 440 * np.sin(np.pi * np.clip(t / secs, 0, 1)) ** 0.7  # wail up, hold, wail down
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)
    return reverb(x * np.minimum(1, np.minimum(t, secs - t) / 0.4), 1.5, 0.3)


def radar_ping():
    t = t_of(1.5)
    ping = np.sin(2 * np.pi * 1320 * t) * env(t, 0.002, 0.25) + 0.3 * np.sin(2 * np.pi * 2640 * t) * env(t, 0.002, 0.1)
    return reverb(ping, 1.2, 0.5)


def radio_static():
    secs = 6.0
    t = t_of(secs)
    x = band(noise(secs), 300, 5000) * (0.6 + 0.4 * np.sin(2 * np.pi * 3.1 * t) * np.sin(2 * np.pi * 0.7 * t))
    crackle = band(noise(secs), 2000, 8000) * (RNG.random(len(t)) > 0.995) * 3
    return (x + crackle) * np.minimum(1, np.minimum(t, secs - t) / 0.3)


def jet_pass():
    secs = 3.0
    t = t_of(secs)
    near = np.exp(-((t - 1.3) / 0.6) ** 2)
    roar = band(noise(secs), 200, 7000) * near
    whine = sweep(t, 2400, 900, 1.2) * near * 0.25
    return roar + whine


CLIPS = {
    'bomber_drone': ('synth: high heavy bomber stream drone, throbbing engines, 8 s bed', 8.0, bomber_drone),
    'bomb_carpet': ('synth: carpet bombing, a chain of heavy blasts walking closer', 4.5, bomb_carpet),
    'bomb_far': ('synth: one distant heavy bomb blast, muffled rumble', 3.0, bomb_far),
    'flak': ('synth: anti-aircraft gun bursts, rapid thuds', 2.6, flak),
    'sam_launch': ('synth: surface-to-air missile launch blast and roar', 3.5, sam_launch),
    'air_raid_siren': ('synth: air raid siren rising and falling wail', 6.0, air_raid_siren),
    'radar_ping': ('synth: radar scope sweep ping', 1.5, radar_ping),
    'radio_static': ('synth: jammed radio static and crackle', 6.0, radio_static),
    'jet_pass': ('synth: fighter jet fly-by roar', 3.0, jet_pass),
}

if __name__ == '__main__':
    names = sys.argv[1:] or list(CLIPS)
    for n in names:
        prompt, secs, fn = CLIPS[n]
        out = S.clip_path(n, prompt, secs)
        with tempfile.TemporaryDirectory() as d:
            w = pathlib.Path(d) / 'x.wav'
            S.write_wav(w, pad(fn(), secs), peak=0.89)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(w), '-b:a', '160k', str(out)], check=True)
        print('  wrote', out.name)
    print(json.dumps({n: [CLIPS[n][0], CLIPS[n][1]] for n in names}, ensure_ascii=False))
