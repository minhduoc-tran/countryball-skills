"""Step 2 with LucyLab (Vivibe) instead of ElevenLabs: Vietnamese TTS, then the skill's voice.py tightens the pauses.

python tools/voice-lucylab.py <slug> [--force]        (run from the studio folder)

LucyLab's API is async: `ttsLongText` returns a projectExportId, `getExportStatus` returns the wav and an SRT once the
job completes. The SRT is timed per sentence, not per word, so word timings are estimated inside each sentence: the
silences in the audio split it at its commas, and the words share each part's voiced time by length.

Writes public/<slug>/voice_raw.mp3, out/<slug>/words_raw.json and out/<slug>/voice_meta.json with the same signature
voice.py computes, so voice.py reuses this take (no ElevenLabs call) and only tightens the pauses.

Key by name only: LUCYLAB_API_KEY from the environment or the nearest .env above the studio. Never printed.
episode.json "voice": {"provider": "lucylab", "userVoiceId": "...", "speed": 1}
episode.json "holds": {"wordA|wordB": seconds}  -> after voice.py tightens, lengthen the pause between those two words to
  `seconds` (chapter breaks, a beat after the title). voice.py only shortens pauses; this is the other direction.
"""
import hashlib, json, os, pathlib, re, subprocess, sys, time, urllib.request

SKILL_SCRIPTS = pathlib.Path.home() / '.claude' / 'skills' / 'what-if-animation' / 'scripts'
sys.path.insert(0, str(SKILL_SCRIPTS))
import numpy as np  # noqa: E402
from wi import SR, decode, load_episode, load_json, log_cost, out_dir, pub_dir, save_json  # noqa: E402
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from voice_common import align_block, apply_holds, run_voice_py, tokens, voice_sig  # noqa: E402

API = 'https://api.lucylab.io/json-rpc'
try:  # python.org builds on macOS ship without CA certs; certifi's bundle fixes the handshake
    import certifi, ssl
    urllib.request.install_opener(urllib.request.build_opener(urllib.request.HTTPSHandler(context=ssl.create_default_context(cafile=certifi.where()))))
except ImportError:
    pass
UA = 'curl/8.7.1'  # Cloudflare in front of the API rejects Python's default user agent (error 1010)
WORD = re.compile(r"[\w'’]")


def api_key():
    if os.environ.get('LUCYLAB_API_KEY'):
        return os.environ['LUCYLAB_API_KEY']
    for d in [pathlib.Path.cwd(), *pathlib.Path.cwd().parents]:
        p = d / '.env'
        if p.exists():
            for line in p.read_text(encoding='utf-8-sig').splitlines():
                k, _, v = line.partition('=')
                if k.strip() == 'LUCYLAB_API_KEY' and v.strip():
                    return v.strip().strip('"\'')
    raise SystemExit('No LucyLab key: set LUCYLAB_API_KEY in the environment or a .env file.')


def rpc(method, payload):
    req = urllib.request.Request(API, data=json.dumps({'method': method, 'input': payload}).encode(), method='POST',
                                 headers={'Authorization': f'Bearer {api_key()}', 'Content-Type': 'application/json', 'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            res = json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise SystemExit(f'LucyLab {method} failed: HTTP {e.code} {e.read()[:300]!r}')
    if 'error' in res:
        raise SystemExit(f'LucyLab {method} failed: {res["error"]}')
    return res['result']


def parse_srt(txt):
    def sec(s):
        h, m, rest = s.strip().replace(',', '.').split(':')
        return int(h) * 3600 + int(m) * 60 + float(rest)
    blocks = []
    for chunk in re.split(r'\n\s*\n', txt.strip()):
        lines = [l for l in chunk.strip().splitlines() if l.strip()]
        ti = next((i for i, l in enumerate(lines) if '-->' in l), None)
        if ti is None:
            continue
        a, b = lines[ti].split('-->')
        blocks.append({'s': sec(a), 'e': sec(b), 'text': ' '.join(lines[ti + 1:])})
    return blocks


def align(words, blocks, x):
    n_need = sum(len(tokens(b['text'])) for b in blocks)
    if n_need != len(words):
        raise SystemExit(f'SRT has {n_need} words, the script {len(words)}: write numbers as words so they match.')
    k = 0
    for b in blocks:
        st = tokens(b['text'])
        align_block(words[k:k + len(st)], x, b['s'], b['e'], st)
        k += len(st)
    return words


MAX_PART = 6000  # LucyLab rejects texts over 8,000 of its characters; it counts fewer than len(), so 6,000 is safe


def chunks(text):
    """Split the script at sentence ends into parts LucyLab accepts in one call."""
    parts, cur = [], ''
    for sent in re.split(r'(?<=[.?!])\s+', text):
        if cur and len(cur) + 1 + len(sent) > MAX_PART:
            parts.append(cur); cur = sent
        else:
            cur = f'{cur} {sent}'.strip()
    return parts + [cur] if cur else parts


def tts_part(text, V, wav_path):
    """One async LucyLab job: returns (wav path, SRT text, job id, job)."""
    job = rpc('ttsLongText', {'text': text, 'userVoiceId': V['userVoiceId'], 'speed': V.get('speed', 1)})
    jid = job['projectExportId']
    for _ in range(150):
        st = rpc('getExportStatus', {'projectExportId': jid})
        if st.get('state') == 'completed':
            break
        if st.get('state') in ('failed', 'error'):
            raise SystemExit(f'LucyLab job {jid} failed: {st}')
        time.sleep(2)
    else:
        raise SystemExit(f'LucyLab job {jid} did not finish in 5 minutes')
    wav_path.write_bytes(urllib.request.urlopen(urllib.request.Request(st['url'], headers={'User-Agent': UA}), timeout=300).read())
    srt = urllib.request.urlopen(urllib.request.Request(st['srtUrl'], headers={'User-Agent': UA}), timeout=60).read().decode('utf-8-sig')
    return wav_path, srt, jid, job


def to_srt(blocks):
    def ts(x):
        h, m = int(x // 3600), int(x % 3600 // 60)
        return f'{h:02d}:{m:02d}:{x % 60:06.3f}'.replace('.', ',')
    return '\n\n'.join(f'{i + 1}\n{ts(b["s"])} --> {ts(b["e"])}\n{b["text"]}' for i, b in enumerate(blocks)) + '\n'


slug = sys.argv[1]
force = '--force' in sys.argv
ep = load_episode(slug)
# the same signature voice.py computes, so it treats this take as its own
text, sig, V = voice_sig(ep)
raw_mp3 = pub_dir(slug) / 'voice_raw.mp3'
raw_words = out_dir(slug) / 'words_raw.json'
meta = load_json(out_dir(slug) / 'voice_meta.json', {})

if force or meta.get('sig') != sig or not raw_mp3.exists() or not raw_words.exists():
    parts = chunks(text)
    print(f'{len(text)} characters to LucyLab in {len(parts)} part(s) (voice {V.get("userVoiceId")})')
    wav = pub_dir(slug) / 'voice_lucylab.wav'
    blocks, offset, part_wavs, jid = [], 0.0, [], None
    for i, part in enumerate(parts):
        pw, srt, jid, job = tts_part(part, V, pub_dir(slug) / f'voice_lucylab_{i}.wav')
        blocks += [{**b, 's': b['s'] + offset, 'e': b['e'] + offset} for b in parse_srt(srt)]
        offset += float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(pw)],
                                       capture_output=True, text=True, check=True).stdout)
        part_wavs.append(pw)
    if len(part_wavs) == 1:
        part_wavs[0].replace(wav)
    else:  # join the takes end to end; SRT times were already shifted by each part's duration
        args = sum((['-i', str(w)] for w in part_wavs), [])
        subprocess.run(['ffmpeg', '-y', '-v', 'error', *args, '-filter_complex', f'concat=n={len(part_wavs)}:v=0:a=1', str(wav)], check=True)
        for w in part_wavs:
            w.unlink()
    srt = to_srt(blocks)
    (out_dir(slug) / 'voice_lucylab.srt').write_text(srt, encoding='utf-8')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(wav), '-ar', str(SR), '-ac', '1', '-c:a', 'libmp3lame', '-q:a', '0', str(raw_mp3)], check=True)
    words = align(tokens(text), parse_srt(srt), decode(raw_mp3))
    save_json(raw_words, words)
    save_json(out_dir(slug) / 'voice_meta.json', {'sig': sig, 'chars': len(text), 'provider': 'lucylab', 'job': jid})
    log_cost(slug, 'voice', 0, f'LucyLab, {len(text)} characters (billed by LucyLab, not ElevenLabs)')
elif '--realign' in sys.argv:
    print('Voice unchanged since the last call: reusing it, re-aligning the words from the cached SRT.')
    words = align(tokens(text), parse_srt((out_dir(slug) / 'voice_lucylab.srt').read_text(encoding='utf-8')), decode(raw_mp3))
    save_json(raw_words, words)
else:
    print('Voice unchanged since the last call: reusing it (pass --realign to redo the word timings).')

run_voice_py(slug)


apply_holds(slug, ep)
