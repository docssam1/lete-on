#!/usr/bin/env python3
"""
독쌤 목소리를 원장님 실제 녹음으로 — 사이언스 랩의 독쌤 대사 전부를 그 목소리로 만든다.

원장(2026-09-26): "목소리 이걸로 바꾸자, 독쌤 목소리야" → "네가 해".
Drive 「녹음 2026-09-24 045754.mp4」(15.9초, 쉼 없이 이어 말함, 녹음 레벨이 아주 작다).

하는 일
  1) 녹음을 참조 음성으로 다듬는다: 24kHz 모노 · 소리 크기 맞추기 · 8.5~11초 사이 **가장 조용한 틈에서** 자른다
     (10초에서 그냥 자르면 낱말 중간이 잘려 자동 전사가 어긋난다).
  2) 독쌤 대사를 모은다: science-lab/data/voice/*.voice.json + science-lab/intro/narration.json 의 lines.
  3) 참조로 복제 프롬프트를 **한 번만** 만든다(참조 전사는 모델의 Whisper 가 한 번 — 지어내지 않는다).
  4) 한 줄씩 복제 음성을 만들고, 같은 Whisper 로 **다시 받아 적어** 원문과 비교한다(글자 오류율 CER).
     어긋나면 최대 3번까지 다시 만들고 가장 나은 것을 쓴다. 끝까지 CER > 0.35 이면 **올리지 않는다** —
     그 줄은 사이트가 예전 목소리(Supabase)로 읽는다. 엉뚱하게 읽은 음성을 아이에게 들려주지 않기 위해서다.
  5) science-lab/audio/docssam/<id>-<sha1("docssam-clone-v1|"+text) 앞 10자>.mp3 로 저장(글이 같으면 건너뜀).
  6) manifest.json(있는 파일 목록) · report.json(줄마다 CER·받아 적은 글) · 듣기.html(원본 + 만든 음성).

읽기용 글: "3D"·"O/X"·"N과 S" 같은 로마자·숫자는 복제 모델이 헷갈리므로 한글 발음으로 바꿔 **읽기만** 한다
(파일 이름 해시는 원문 그대로 — 사이트가 원문으로 찾는다).

⚠ 원본 녹음은 저장소에 넣지 않는다(공개 저장소 — 누구나 목소리를 복제할 수 있게 된다).
   원장 PC 는 녹음 파일을 직접 읽고, GitHub 러너는 Supabase 비공개 표(voice_refs, RLS·anon 권한 없음)에서 받는다.

쓰는 법
  원장 PC : scripts\\local\\omnivoice-docssam.cmd (녹음 파일을 그 위에 끌어다 놓기)
  러너    : .github/workflows/omnivoice-docssam.yml (20조각 병렬)
  python scripts/omnivoice-docssam.py --ref <녹음> [--ref-ready] [--shard 3/20] [--out DIR] [--only id,id] [--force]
  python scripts/omnivoice-docssam.py --manifest-only
"""
import argparse, base64, glob, hashlib, json, os, re, subprocess, sys, time, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SL = os.path.join(ROOT, "science-lab")
OUT = os.path.join(SL, "audio", "docssam")
WORK = os.path.join(ROOT, ".docssam-work")
VOICE = "docssam-clone-v1"          # 목소리를 다시 뽑으면 v2 로 올린다 → 파일 이름이 바뀌어 전부 새로 만든다
SR = 24000
CER_OK, CER_RETRY, TRIES = 0.35, 0.12, 3


def ffmpeg_exe():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"


def run(cmd, binary=False):
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        sys.exit("ffmpeg 실패:\n" + r.stderr.decode("utf-8", "replace")[-1500:])
    return r.stdout


def prep_ref(src, dst):
    """녹음 → 참조 음성. 소리를 키우고(-20 LUFS) 8.5~11초 사이 가장 조용한 100ms 에서 자른다."""
    import numpy as np
    pcm = run([ffmpeg_exe(), "-v", "error", "-i", src, "-vn", "-ac", "1", "-ar", str(SR),
               "-af", "highpass=f=70,loudnorm=I=-20:TP=-2:LRA=11", "-f", "s16le", "-"])
    x = np.frombuffer(pcm, np.int16)
    hop = SR // 10
    db = [20 * np.log10(np.sqrt(np.mean((x[i:i + hop] / 32768.0) ** 2)) + 1e-9) for i in range(0, len(x) - hop, hop)]
    start = next((k for k, v in enumerate(db) if v > -45), 0)          # 앞 무음
    lo, hi = start + 85, min(len(db) - 1, start + 110)
    if hi > lo:
        cut = min(range(lo, hi), key=lambda k: db[k]); end = (cut * hop) + hop // 2
    else:
        end = len(x)
    y = x[max(0, start * hop - hop // 2):end]
    with wave.open(dst, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
    print(f"참조 음성: {len(y) / SR:.1f}초 → {dst}", flush=True)
    return dst


def lines():
    out = []
    for f in sorted(glob.glob(os.path.join(SL, "data", "voice", "*.voice.json"))):
        for l in json.load(open(f, encoding="utf-8")).get("lines", []):
            out.append((l["id"], l["text"]))
    nar = os.path.join(SL, "intro", "narration.json")
    if os.path.exists(nar):
        for l in json.load(open(nar, encoding="utf-8")).get("lines", []):
            out.append((l["id"], l["text"]))
    seen, uniq = set(), []
    for i, t in out:
        if (i, t) not in seen:
            seen.add((i, t)); uniq.append((i, t))
    return uniq


def fname(lid, text):
    return f"{lid}-{hashlib.sha1(f'{VOICE}|{text}'.encode('utf-8')).hexdigest()[:10]}.mp3"


# 읽기용 글 — 로마자·숫자를 한글 발음으로(앞의 것이 먼저 적용된다)
SPOKEN = [
    (r"3D", "쓰리디"), (r"QR", "큐알"), (r"N과 S", "엔과 에스"), (r"(?<![A-Za-z])O(?![A-Za-z])", "오"), (r"(?<![A-Za-z])X(?![A-Za-z])", "엑스"),
    (r"3분의 1", "삼분의 일"), (r"3학년", "삼학년"), (r"6학년", "육학년"), (r"5분", "오분"), (r"(?<![0-9])0에", "영에"),
]
DIG = dict(zip("0123456789", ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"]))


def spoken(text):
    for a, b in SPOKEN:
        text = re.sub(a, b, text)
    return re.sub(r"[0-9]", lambda m: DIG[m.group(0)], text)


def hangul(s):
    return re.sub(r"[^가-힣]", "", s)


def cer(ref, hyp):
    a, b = hangul(ref), hangul(hyp)
    if not a:
        return 0.0
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (ca != cb))
    return d[len(b)] / len(a)


def to_mp3(wav, mp3):
    run([ffmpeg_exe(), "-y", "-v", "error", "-i", wav, "-af", "loudnorm=I=-18:TP=-1.5:LRA=11", "-ac", "1", "-ar", "24000",
         "-c:a", "libmp3lame", "-b:a", "64k", mp3])


def write_wav(path, y):
    import numpy as np
    pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


def listen_page(ref_wav, made, path):
    b64 = lambda f: base64.b64encode(open(f, "rb").read()).decode("ascii")
    ref = f'<div class="clip orig"><b>원장님 녹음(참조로 다듬은 것)</b><audio controls src="data:audio/wav;base64,{b64(ref_wav)}"></audio></div>'
    items = "".join(f'<div class="clip"><b>{lid}</b><audio controls preload="none" src="data:audio/mpeg;base64,{b64(f)}"></audio><p>{t}</p></div>'
                    for lid, t, f in made)
    html = f"""<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>독쌤 목소리 — 들어 보기</title>
<style>body{{font:15px/1.7 system-ui,"Malgun Gothic",sans-serif;background:#f6f8fb;color:#1a2233;margin:0 auto;padding:20px 16px;max-width:820px;word-break:keep-all}}
h1{{font-size:20px;margin:0 0 4px}}.lede{{color:#4a5468;font-size:13.5px}}.clip{{background:#fff;border:1px solid #dfe6f0;border-radius:12px;padding:10px 12px;margin:10px 0}}
.clip.orig{{background:#fff8e6;border-color:#ecd9a8}}.clip b{{font-size:12.5px;color:#23498a}}audio{{width:100%}}.clip p{{margin:6px 0 0;font-size:13px;color:#4a5468}}</style>
<h1>독쌤 목소리 — 들어 보기</h1><p class="lede">맨 위가 원장님 녹음, 아래가 그 목소리로 만든 독쌤 대사입니다.</p>
{ref}{items}</html>"""
    open(path, "w", encoding="utf-8").write(html)
    return path


def write_manifest(out):
    have = sorted(f for f in os.listdir(out) if f.endswith(".mp3"))
    json.dump({"voice": VOICE, "files": have}, open(os.path.join(out, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"manifest.json: {len(have)}개", flush=True)
    return have


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", help="원장님 녹음(mp4/m4a/mp3/wav)")
    ap.add_argument("--ref-ready", action="store_true", help="--ref 가 이미 다듬은 참조 음성이다")
    ap.add_argument("--only", default="", help="이 id 들만(쉼표)")
    ap.add_argument("--shard", default="", help="k/n — n 조각 중 k 번째(0부터)만")
    ap.add_argument("--out", default=OUT, help="mp3 를 둘 곳(러너는 조각마다 따로 두었다가 모은다)")
    ap.add_argument("--force", action="store_true", help="이미 있어도 다시 만든다")
    ap.add_argument("--no-check", action="store_true", help="받아 적어 비교하는 검사를 끈다")
    ap.add_argument("--manifest-only", action="store_true")
    ap.add_argument("--device", default="auto")
    ap.add_argument("--model", default="k2-fsa/OmniVoice")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True); os.makedirs(WORK, exist_ok=True)   # WORK 는 .gitignore 대상
    if a.manifest_only:
        write_manifest(a.out); return
    if not a.ref or not os.path.exists(a.ref):
        sys.exit(f"녹음 파일을 찾지 못했습니다: {a.ref}")
    ref_wav = a.ref if a.ref_ready else prep_ref(a.ref, os.path.join(WORK, "docssam-ref.wav"))

    only = set(x for x in a.only.split(",") if x)
    todo = [(i, t) for i, t in lines() if (not only or i in only)
            and (a.force or not os.path.exists(os.path.join(OUT, fname(i, t))))]
    if a.shard:
        k, n = map(int, a.shard.split("/")); todo = todo[k::n]
    print(f"독쌤 대사 {len(lines())}줄 중 이번에 만들 것 {len(todo)}줄", flush=True)

    made, report = [], {}
    if todo:
        import torch
        dev = a.device
        if dev == "auto":
            dev = "cuda:0" if torch.cuda.is_available() else "cpu"
        print(("🎮 GPU: " + torch.cuda.get_device_name(0)) if dev.startswith("cuda") else "🖥  GPU 없음 — CPU 라 느립니다", flush=True)
        from omnivoice import OmniVoice
        model = OmniVoice.from_pretrained(a.model, device_map=dev, dtype=torch.float16 if dev.startswith("cuda") else torch.float32)
        model.load_asr_model()
        prompt = model.create_voice_clone_prompt(ref_audio=ref_wav)
        print(f"참조 전사(Whisper): {prompt.ref_text}", flush=True)
        t0 = time.time(); audio_s = 0.0
        for n, (lid, text) in enumerate(todo, 1):
            t = time.time(); say = spoken(text); best = None
            for k in range(TRIES):
                try:
                    y = model.generate(text=say, language="ko", voice_clone_prompt=prompt)[0]
                except Exception as e:
                    print(f"  ✗ {lid}: {e}", flush=True); break
                y = y.reshape(-1)
                if a.no_check:
                    best = (0.0, "", y); break
                hyp = model.transcribe((y, SR)); c = cer(say, hyp)
                if best is None or c < best[0]:
                    best = (c, hyp, y)
                if c <= CER_RETRY:
                    break
                print(f"    ↻ {lid} 다시({k + 1}) CER {c:.2f}: {hyp}", flush=True)
            if best is None:
                continue
            c, hyp, y = best; audio_s += len(y) / SR
            wav = os.path.join(WORK, f"{lid}.wav"); write_wav(wav, y)
            ok = c <= CER_OK
            report[fname(lid, text)] = {"id": lid, "text": text, "spoken": say, "asr": hyp, "cer": round(c, 3), "ok": ok, "sec": round(len(y) / SR, 2)}
            if ok:
                mp3 = os.path.join(a.out, fname(lid, text)); to_mp3(wav, mp3); made.append((lid, text, mp3))
            print(f"  {'✓' if ok else '✗ 뺌'} [{n}/{len(todo)}] {lid}  {len(y) / SR:.1f}초 · CER {c:.2f} · {time.time() - t:.0f}초", flush=True)
        el = time.time() - t0
        print(f"만든 음성 {len(made)}개 / 뺀 것 {len(todo) - len(made)}개 · {el:.0f}초 · RTF {el / max(audio_s, 1e-6):.1f}", flush=True)

    rp = os.path.join(a.out, f"report{'-' + a.shard.replace('/', 'of') if a.shard else ''}.json")
    if report:
        old = json.load(open(rp, encoding="utf-8")) if os.path.exists(rp) else {}
        old.update(report); json.dump(old, open(rp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    if a.out == OUT:
        write_manifest(OUT)
        sample = made or [(i, t, os.path.join(OUT, fname(i, t))) for i, t in lines()[:12] if os.path.exists(os.path.join(OUT, fname(i, t)))]
        print(f"\n듣기 페이지: {listen_page(ref_wav, sample, os.path.join(WORK, '듣기.html'))}")


if __name__ == "__main__":
    main()
