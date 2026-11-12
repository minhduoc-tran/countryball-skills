"""Step 2 with Gemini TTS (native English and other languages LucyLab's Vietnamese voice can't read).

python tools/voice-gemini.py <slug> [--force]        (run from the studio folder)

Gemini TTS returns audio but no timings. Beats are voiced in "takes" of up to `take_chars` characters (whole beats, in
order; default 1100): few requests (the free tier allows ~10 a day per model) and take boundaries that are exact; words
inside a take are timed from the audio (voice_common.align_block's dynamic programme over the phrase pauses). Each take
is cached by its text + voice + style in out/<slug>/tts/, so editing one beat re-buys only its take.

episode.json "voice": {"provider": "gemini", "model": "gemini-3.1-flash-tts-preview", "voiceName": "Charon",
                       "style": "Read like a warm, curious documentary narrator", "take_chars": 1100}
Keep one model for a whole episode: the same voice name sounds slightly different on another model.
Writes the same files as voice-lucylab.py (public/<slug>/voice.wav, src/episodes/<slug>/words.json, ...), with the
signature voice.py expects, then lets voice.py tighten the pauses and applies "holds".
Key by name only: GEMINI_API_KEY from the environment, a .env above the studio, or ~/.claude/.env. Never printed.
"""
import base64, hashlib, json, os, pathlib, subprocess, sys, time, urllib.error, urllib.request, wave

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from voice_common import SR, align_block, apply_holds, decode, np, run_voice_py, tokens, voice_sig, voiced_runs  # noqa: E402
from wi import load_episode, load_json, log_cost, out_dir, pub_dir, save_json, write_wav  # noqa: E402

try:  # python.org builds on macOS ship without CA certs
    import certifi, ssl
    CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    CTX = None

GAP = 0.35  # silence laid between beats; voice.py's gaps and the episode's holds shape it afterwards


def api_key():
    if os.environ.get('GEMINI_API_KEY'):
        return os.environ['GEMINI_API_KEY']
    for d in [pathlib.Path.cwd(), *pathlib.Path.cwd().parents, pathlib.Path.home() / '.claude']:
        p = d / '.env'
        if p.exists():
            for line in p.read_text(encoding='utf-8-sig').splitlines():
                k, _, v = line.partition('=')
                if k.strip() == 'GEMINI_API_KEY' and v.strip():
                    return v.strip().strip('"\'')
    raise SystemExit('No Gemini key: set GEMINI_API_KEY in the environment or a .env file.')


def tts(text, V):
    """One beat to 24 kHz mono PCM via Gemini TTS, retrying on overload. Returns float64 samples at 24 kHz."""
    prompt = f"{V['style']}: {text}" if V.get('style') else text
    body = {'contents': [{'parts': [{'text': prompt}]}],
            'generationConfig': {'responseModalities': ['AUDIO'],
                                 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': V.get('voiceName', 'Charon')}}}}}
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{V.get('model', 'gemini-3.8-flash-tts')}:generateContent"
    for attempt in range(8):
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': api_key()})
        try:
            res = json.loads(urllib.request.urlopen(req, context=CTX, timeout=300).read())
            data = res['candidates'][0]['content']['parts'][0]['inlineData']['data']
            return np.frombuffer(base64.b64decode(data), dtype='<i2').astype(np.float64) / 32768
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 503) and attempt < 7:
                time.sleep(5 * (attempt + 1))
                continue
            raise SystemExit(f'Gemini TTS failed: HTTP {e.code} {e.read()[:300]!r}')
        except (KeyError, IndexError) as e:
            if attempt < 7:
                time.sleep(3)
                continue
            raise SystemExit(f'Gemini TTS returned no audio: {e}')


slug = sys.argv[1]
force = '--force' in sys.argv
ep = load_episode(slug)
text, sig, V = voice_sig(ep)
raw_mp3 = pub_dir(slug) / 'voice_raw.mp3'
raw_words = out_dir(slug) / 'words_raw.json'
meta = load_json(out_dir(slug) / 'voice_meta.json', {})
cache = out_dir(slug) / 'tts'
cache.mkdir(exist_ok=True)

if force or meta.get('sig') != sig or not raw_mp3.exists() or not raw_words.exists():
    takes, cur = [], []
    for b in ep['script']:  # whole beats, in order, packed into takes of at most take_chars
        if cur and sum(len(c['text']) + 1 for c in cur) + len(b['text']) > V.get('take_chars', 1100):
            takes.append(cur)
            cur = []
        cur.append(b)
    takes.append(cur)
    print(f'{len(text)} characters in {len(takes)} takes to Gemini TTS ({V.get("model")}, voice {V.get("voiceName")})')
    pieces, words, t, bought = [], [], 0.0, 0
    for i, tk in enumerate(takes):
        tk_text = ' '.join(b['text'].strip() for b in tk)
        key = hashlib.sha1(json.dumps([tk_text, V.get('model'), V.get('voiceName'), V.get('style')]).encode()).hexdigest()[:12]
        wav = cache / f'take{i:02d}-{key}.wav'
        if force or not wav.exists():
            pcm = tts(tk_text, V)
            with wave.open(str(wav), 'wb') as w:  # keep the take at Gemini's own 24 kHz
                w.setnchannels(1)
                w.setsampwidth(2)
                w.setframerate(24000)
                w.writeframes((np.clip(pcm, -1, 1) * 32767).astype('<i2').tobytes())
            bought += len(tk_text)
            print(f'  take {i:02d} voiced: {len(tk)} beats, {len(tk_text)} chars')
        x = decode(wav)  # to 44.1 kHz mono
        runs = voiced_runs(x, 0, len(x) / SR)
        a, z = max(0.0, runs[0][0] - 0.05), min(len(x) / SR, runs[-1][1] + 0.08)
        seg = x[int(a * SR):int(z * SR)]
        ws = tokens(tk_text)
        align_block(ws, seg, 0, len(seg) / SR)
        voiced = sum(r1 - r0 for r0, r1 in runs)
        rate = len(ws) / max(voiced, 0.1)
        print(f'  take {i:02d}: {len(seg) / SR:.1f} s, {rate:.1f} words/s of voiced audio')
        if not 1.4 <= rate <= 4.8:
            print(f'  ! take {i:02d}: check it (instruction read aloud, or cut short?)')
        for w in ws:
            w['s'], w['e'] = round(w['s'] + t, 3), round(w['e'] + t, 3)
        words += ws
        pieces += [seg, np.zeros(int(GAP * SR))]
        t += len(seg) / SR + GAP
    x = np.concatenate(pieces)
    write_wav(pub_dir(slug) / 'voice_gemini.wav', x)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(pub_dir(slug) / 'voice_gemini.wav'), '-c:a', 'libmp3lame', '-q:a', '0', str(raw_mp3)], check=True)
    save_json(raw_words, words)
    save_json(out_dir(slug) / 'voice_meta.json', {'sig': sig, 'chars': len(text), 'provider': 'gemini', 'voice': V.get('voiceName')})
    log_cost(slug, 'voice', 0, f'Gemini TTS, {bought} characters newly voiced (billed by Google, not ElevenLabs)')
else:
    print('Voice unchanged since the last call: reusing it.')

run_voice_py(slug)
apply_holds(slug, ep)
