#!/usr/bin/env python3
"""
독쌤 목소리 만들기 — 사이언스 랩의 독쌤 대사 전부를 독쌤 목소리로 만든다.

참조 = 독쌤 목소리 녹음(Drive, 15.9초, 쉼 없이 이어 말함, 녹음 레벨이 아주 작다).

하는 일
  1) 녹음을 참조 음성으로 다듬는다: 24kHz 모노 · 소리 크기 맞추기 · 8.5~11초 사이 **가장 조용한 틈에서** 자른다
     (10초에서 그냥 자르면 낱말 중간이 잘려 자동 전사가 어긋난다).
  2) 독쌤 대사를 모은다: science-lab/data/voice/*.voice.json + science-lab/intro/narration.json 의 lines.
  3) 참조로 복제 프롬프트를 **한 번만** 만든다(참조 전사는 모델의 Whisper 가 한 번 — 지어내지 않는다).
  4) 한 줄씩 복제 음성을 만들고(기대 길이의 1.25배를 넘으면 꼬리 반복으로 보고 길이를 고정해 다시), 같은 Whisper 로 **다시 받아 적어** 원문과 비교한다(글자 오류율 CER).
     어긋나면 최대 3번까지 다시 만들고 가장 나은 것을 쓴다. 끝까지 CER > 0.35 이면 **올리지 않는다** —
     그 줄은 사이트가 기기 음성으로 읽는다(Google TTS는 켜지 않는다).
  5) science-lab/audio/docssam/<id>-<sha1("docssam-clone-v1|"+text) 앞 10자>.mp3 로 저장(글이 같으면 건너뜀).
  6) manifest.json(있는 파일 목록) · report.json(줄마다 CER·받아 적은 글) · 듣기.html(원본 + 만든 음성).

읽기용 글: "3D"·"O/X"·"N과 S" 같은 로마자·숫자는 복제 모델이 헷갈리므로 한글 발음으로 바꿔 **읽기만** 한다
(파일 이름 해시는 원문 그대로 — 사이트가 원문으로 찾는다).

⚠ 참조 녹음은 저장소에 넣지 않는다(공개 저장소 — 누구나 목소리를 복제할 수 있게 된다). GPU PC 에서만 읽는다.

쓰는 법
  GPU PC  : scripts\\local\\omnivoice-docssam.cmd (녹음 파일을 그 위에 끌어다 놓기)
  러너    : .github/workflows/omnivoice-docssam.yml (20조각 병렬)
  python scripts/omnivoice-docssam.py --ref <녹음> [--ref-ready] [--shard 3/20] [--out DIR] [--only id,id] [--force]
  python scripts/omnivoice-docssam.py --manifest-only
"""
import argparse, base64, glob, hashlib, json, os, re, subprocess, sys, time, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SL = os.path.join(ROOT, "science-lab")
OUT = os.path.join(SL, "audio", "docssam")
WORK = os.path.join(ROOT, ".docssam-work")
V1 = "docssam-clone-v1"             # 녹음 그대로의 말 빠르기(초당 약 6.5음절)
SLOW = "docssam-clone-v2-slow"       # --speed 0.8 로 느리게 만든 것 — 공부 대사(data/voice)만
VOICE = V1                           # 이번 실행에서 만드는 목소리(--speed 를 주면 SLOW)
# 공부 대사: SLOW 파일이 있으면 그것(원래 속도로 틈), 없으면 V1 을 0.8배로 튼다.
# 소개(광고) 대사(intro/narration.json): 언제나 V1, 원래 속도 — 광고는 살짝 빠른 게 자연스럽다(원장 결정 2026-09-28).
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


def study_lines():
    out = []
    for f in sorted(glob.glob(os.path.join(SL, "data", "voice", "*.voice.json"))):
        for l in json.load(open(f, encoding="utf-8")).get("lines", []):
            out.append((l["id"], l["text"]))
    return out


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


def fname(lid, text, voice=None):
    return f"{lid}-{hashlib.sha1(f'{voice or VOICE}|{text}'.encode('utf-8')).hexdigest()[:10]}.mp3"


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


def expected(text):
    """음절 수로 잡은 기대 길이(초) — 수의 마법 쇼릴에서 쓰던 식."""
    return len(re.findall(r"[가-힣0-9]", text)) / 5.6 + 0.25 * len(re.findall(r"[,.!?]", text))


def to_mp3(wav, mp3):
    temporary = mp3 + ".tmp"
    run([ffmpeg_exe(), "-y", "-v", "error", "-i", wav, "-af", "loudnorm=I=-18:TP=-1.5:LRA=11", "-ac", "1", "-ar", "24000",
         "-c:a", "libmp3lame", "-b:a", "64k", "-f", "mp3", temporary])
    os.replace(temporary, mp3)


def read_wav(path):
    """참조 음성을 24kHz 모노 float32 로(윈도에 ffmpeg 가 PATH 에 없어도 되게 파이프라인에 파일 경로를 주지 않는다)."""
    import numpy as np
    pcm = run([ffmpeg_exe(), "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"])
    return np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0


def write_wav(path, y):
    import numpy as np
    pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


def listen_page(ref_wav, made, path):
    b64 = lambda f: base64.b64encode(open(f, "rb").read()).decode("ascii")
    ref = f'<div class="clip orig"><b>독쌤 목소리 녹음(참조로 다듬은 것)</b><audio controls src="data:audio/wav;base64,{b64(ref_wav)}"></audio></div>'
    items = "".join(f'<div class="clip"><b>{lid}</b><audio controls preload="none" src="data:audio/mpeg;base64,{b64(f)}"></audio><p>{t}</p></div>'
                    for lid, t, f in made)
    html = f"""<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>독쌤 목소리 — 들어 보기</title>
<style>body{{font:15px/1.7 system-ui,"Malgun Gothic",sans-serif;background:#f6f8fb;color:#1a2233;margin:0 auto;padding:20px 16px;max-width:820px;word-break:keep-all}}
h1{{font-size:20px;margin:0 0 4px}}.lede{{color:#4a5468;font-size:13.5px}}.clip{{background:#fff;border:1px solid #dfe6f0;border-radius:12px;padding:10px 12px;margin:10px 0}}
.clip.orig{{background:#fff8e6;border-color:#ecd9a8}}.clip b{{font-size:12.5px;color:#23498a}}audio{{width:100%}}.clip p{{margin:6px 0 0;font-size:13px;color:#4a5468}}</style>
<h1>독쌤 목소리 — 들어 보기</h1><p class="lede">맨 위가 독쌤 목소리 녹음(참조), 아래가 그 목소리로 만든 독쌤 대사입니다.</p>
{ref}{items}</html>"""
    open(path, "w", encoding="utf-8").write(html)
    return path


def write_manifest(out):
    # 지금 글에 맞는 파일만 목록에 싣는다: 모든 줄의 V1 + 공부 줄의 SLOW.
    # 공부 줄은 SLOW 가 생기면 V1 을 목록에서만 뺀다. 기존 승인 파일은 삭제하지 않는다.
    exist = set(os.listdir(out))
    slow = {fname(i, t, SLOW) for i, t in study_lines()}
    valid = {fname(i, t, V1) for i, t in lines()} | slow
    for i, t in study_lines():
        if fname(i, t, SLOW) in exist: valid.discard(fname(i, t, V1))
    have = sorted(f for f in os.listdir(out) if f.endswith(".mp3") and f in valid)
    voices = ([SLOW] if any(f in slow for f in have) else []) + [V1]
    # voices: 사이트가 이 순서로 찾는다. rates: 목소리마다 공부 화면 재생 속도(소개 페이지는 늘 1).
    with open(os.path.join(out, "manifest.json"), "w", encoding="utf-8") as handle:
        json.dump({"voices": voices, "rates": {SLOW: 1, V1: 0.8}, "files": have}, handle, ensure_ascii=False, indent=1)
    print(f"manifest.json: {len(have)}개", flush=True)
    return have


def pending_lines(candidates, out, only=None, force=False):
    """공개 폴더와 별도 출력 폴더 양쪽을 확인해 완료된 음성을 다시 만들지 않는다."""
    return [(i, t) for i, t in candidates if (not only or i in only)
            and (force or not any(os.path.exists(os.path.join(d, fname(i, t)))
                                 for d in (OUT, out)))]


def save_report(path, report):
    """한 줄씩 저장한다. 중단 후 재실행해도 검수 결과가 남는다."""
    old = {}
    if os.path.exists(path):
        with open(path, encoding="utf-8") as handle:
            old = json.load(handle)
    old.update(report)
    with open(path + ".tmp", "w", encoding="utf-8") as handle:
        json.dump(old, handle, ensure_ascii=False, indent=1)
    os.replace(path + ".tmp", path)


def main():
    global VOICE, WORK
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", help="독쌤 목소리 녹음(mp4/m4a/mp3/wav)")
    ap.add_argument("--ref-ready", action="store_true", help="--ref 가 이미 다듬은 참조 음성이다")
    ap.add_argument("--only", default="", help="이 id 들만(쉼표)")
    ap.add_argument("--shard", default="", help="k/n — n 조각 중 k 번째(0부터)만")
    ap.add_argument("--out", default=OUT, help="mp3 를 둘 곳(러너는 조각마다 따로 두었다가 모은다)")
    ap.add_argument("--force", action="store_true", help="이미 있어도 다시 만든다")
    ap.add_argument("--no-check", action="store_true", help="받아 적어 비교하는 검사를 끈다")
    ap.add_argument("--manifest-only", action="store_true")
    ap.add_argument("--device", default="auto")
    ap.add_argument("--speed", type=float, default=None, help="말 빠르기(1 보다 작으면 느리게). 예: 0.8 — 공부용 권장")
    ap.add_argument("--model", default="k2-fsa/OmniVoice")
    ap.add_argument("--work-dir", default=WORK, help="비공개 참조·중간 WAV 폴더(E: 권장, 업로드 금지)")
    ap.add_argument("--asr-device", default="cpu", help="전사 검수 장치(기본 cpu: GPU 메모리를 음성 생성에 확보)")
    ap.add_argument("--asr-model", help="전사 모델 이름 또는 기존 로컬 캐시 경로")
    ap.add_argument("--ref-text-file", help="실제 참조 녹음의 확인된 전사 UTF-8 파일(비공개)")
    a = ap.parse_args()
    WORK = a.work_dir
    if a.speed:
        VOICE = SLOW                 # 느린 목소리는 공부 대사에만 만든다
    os.makedirs(a.out, exist_ok=True); os.makedirs(WORK, exist_ok=True)   # WORK 는 .gitignore 대상
    if a.manifest_only:
        write_manifest(a.out); return
    if not a.ref or not os.path.exists(a.ref):
        sys.exit(f"녹음 파일을 찾지 못했습니다: {a.ref}")
    ref_wav = a.ref if a.ref_ready else prep_ref(a.ref, os.path.join(WORK, "docssam-ref.wav"))

    only = set(x for x in a.only.split(",") if x)
    todo = pending_lines(study_lines() if a.speed else lines(), a.out, only, a.force)
    if a.shard:
        k, n = map(int, a.shard.split("/")); todo = todo[k::n]
    print(f"독쌤 대사 {len(lines())}줄 중 이번에 만들 것 {len(todo)}줄", flush=True)

    made, report = [], {}
    rp = os.path.join(a.out, f"report{'-' + a.shard.replace('/', 'of') if a.shard else ''}.json")
    if todo:
        import torch
        dev = a.device
        if dev == "auto":
            dev = "cuda:0" if torch.cuda.is_available() else "cpu"
        print(("🎮 GPU: " + torch.cuda.get_device_name(0)) if dev.startswith("cuda") else "🖥  GPU 없음 — CPU 라 느립니다", flush=True)
        from omnivoice import OmniVoice
        model = OmniVoice.from_pretrained(a.model, device_map=dev, dtype=torch.float16 if dev.startswith("cuda") else torch.float32)
        model.load_asr_model(model_name=a.asr_model, device=a.asr_device)
        ko = lambda audio: model._asr_pipe(audio, generate_kwargs={"language": "korean"})["text"].strip()
        # 참조 전사는 한국어로 못 박는다 — 자동 언어 감지가 틀리면 문장 끝에 참조의 남은 말이 붙는다
        # (수의 마법 쇼릴에서 문장 끝에 참조의 남은 말이 반복되던 문제)
        ref_text = (open(a.ref_text_file, encoding="utf-8-sig").read().strip() if a.ref_text_file
                    else ko({"raw": read_wav(ref_wav), "sampling_rate": SR}))
        if not ref_text:
            sys.exit("참조 전사가 비어 있습니다.")
        print(f"참조 전사: {ref_text}", flush=True)
        json.dump({"ref_text": ref_text}, open(os.path.join(WORK, "ref.json"), "w", encoding="utf-8"), ensure_ascii=False)
        prompt = model.create_voice_clone_prompt(ref_audio=ref_wav, ref_text=ref_text)
        t0 = time.time(); audio_s = 0.0
        for n, (lid, text) in enumerate(todo, 1):
            t = time.time(); say = spoken(text); best = None
            exp = expected(say) / (a.speed or 1.0); dur = None
            for k in range(TRIES):
                try:
                    y = model.generate(text=say, language="ko", voice_clone_prompt=prompt, duration=dur, speed=None if dur else a.speed)[0]
                except Exception as e:
                    print(f"  ✗ {lid}: {e}", flush=True); break
                y = y.reshape(-1)
                if len(y) / SR > exp * 1.25:          # 꼬리 반복 — 기대 길이로 고정해 다시
                    print(f"    ↻ {lid} 너무 김 {len(y) / SR:.1f}초 > 기대 {exp:.1f}초", flush=True)
                    dur = round(exp * 1.08, 2)
                    if k < TRIES - 1:
                        continue
                if a.no_check:
                    best = (0.0, "", y); break
                hyp = ko({"raw": y.astype("float32"), "sampling_rate": SR}); c = cer(say, hyp)
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
            save_report(rp, report)
            print(f"  {'✓' if ok else '✗ 뺌'} [{n}/{len(todo)}] {lid}  {len(y) / SR:.1f}초 · CER {c:.2f} · {time.time() - t:.0f}초", flush=True)
        el = time.time() - t0
        print(f"만든 음성 {len(made)}개 / 뺀 것 {len(todo) - len(made)}개 · {el:.0f}초 · RTF {el / max(audio_s, 1e-6):.1f}", flush=True)

    if report:
        save_report(rp, report)
    if a.out == OUT:
        write_manifest(OUT)
        sample = made or [(i, t, os.path.join(OUT, fname(i, t))) for i, t in lines()[:12] if os.path.exists(os.path.join(OUT, fname(i, t)))]
        print(f"\n듣기 페이지: {listen_page(ref_wav, sample, os.path.join(WORK, '듣기.html'))}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    main()
