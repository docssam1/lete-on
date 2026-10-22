#!/usr/bin/env python3
"""
넘버스 오브 매직 앱 음성 — OmniVoice 복제 목소리로 만든다 (2026-09-29, 원장: "복제음성으로 해. omni")

지금 앱이 쓰는 구글 음성(tts-map.js)을 **대신할** 음성을 만든다. 구글 글자당 요금이 0 이 된다
(원장 PC GPU 면 전기값만, 러너면 무료 CPU 시간).

목소리 = 아이들이 이미 듣는 목소리의 복제 (2026-09-21 원장 결정 "그냥 우리 나온 목소리 복제해").
  참조 음성·전사는 scripts/omnivoice-clone.py 의 build_refs 가 **구글 tts-map.js** 에서 언어마다
  3~10초짜리 한 줄을 골라 만든다. 전사는 합성에 쓴 바로 그 문장 — 지어내지 않는다.
  구글 map 은 그대로 두므로 참조가 복제본 쪽으로 흘러가는 일(복제의 복제)이 없다.

대사 목록 = number_magic/scripts/generate-nm-audio.js 의 DUMP_TASKS (한 곳에서만 모은다).

하는 일
  1) 언어별 참조 → 복제 프롬프트를 한 번만 만든다.
  2) 한 줄씩 만들고, 기대 길이의 1.25배를 넘으면(꼬리 반복) 길이를 고정해 다시.
  3) 같은 모델의 Whisper 로 **다시 받아 적어** 원문과 비교(글자 오류율 CER). 최대 3번 다시 만들어
     가장 나은 것을 쓰고, 끝까지 CER > 0.12 면 **연결표에 싣지 않는다** — 화면 글을 유지하며 다른 목소리로 바꾸지 않는다.
     엉뚱하게 읽은 음성을 아이에게 들려주지 않기 위해서다. 숫자는 비교에서 뺀다
     ("3" 을 Whisper 가 "삼"·"셋"·"3" 무엇으로 적을지 정해져 있지 않다).
  4) number_magic/audio/omni/<lang>-<sha1 앞 12자>.mp3 로 저장(글이 같으면 건너뜀, 글이 바뀌면 새 파일).
  5) number_magic/data/tts-map-omni.js (window.NM_TTS_OMNI) 를 다시 쓴다 — 앱 say() 가 이것부터 찾는다.
     report.json(줄마다 CER·받아 적은 글) · .omni-nm-work/듣기.html(참조 + 만든 음성 몇 줄).

쓰는 법
  원장 PC(GPU): scripts\\local\\omnivoice-nm.cmd 더블클릭
  러너(CPU)   : .github/workflows/omnivoice-nm.yml 수동 실행(조각 병렬)
  python scripts/omnivoice-nm.py [--shard 3/16] [--out DIR] [--lang ko] [--force] [--limit N]
  python scripts/omnivoice-nm.py --manifest-only        # 있는 mp3 로 map 만 다시
"""
import argparse, base64, hashlib, importlib.util, json, os, re, subprocess, sys, tempfile, time, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NM = os.path.join(ROOT, "number_magic")
OUT = os.path.join(NM, "audio", "omni")
MAP = os.path.join(NM, "data", "tts-map-omni.js")
WORK = os.path.join(ROOT, ".omni-nm-work")          # .gitignore 대상
VOICE = "nm-clone-v1"
SR = 24000
CER_OK, CER_RETRY, TRIES = 0.12, 0.12, 3
LANGS = ("ko", "en", "zh")
ASR_LANG = {"ko": "korean", "en": "english", "zh": "chinese"}

spec = importlib.util.spec_from_file_location("ovclone", os.path.join(ROOT, "scripts", "omnivoice-clone.py"))
ovclone = importlib.util.module_from_spec(spec); spec.loader.exec_module(ovclone)


def tasks():
    """generate-nm-audio.js 와 같은 대사 목록. 같은 (언어, 글) 은 하나로."""
    tmp = os.path.join(tempfile.gettempdir(), "nm-tasks.json")
    subprocess.run(["node", os.path.join(NM, "scripts", "generate-nm-audio.js")],
                   env={**os.environ, "DUMP_TASKS": tmp}, check=True, capture_output=True)
    seen, out = set(), []
    for t in json.load(open(tmp, encoding="utf-8")):
        k = (t["lang"], t["text"])
        if k not in seen:
            seen.add(k); out.append(t)
    return out


def fname(lang, text):
    return f"{lang}-{hashlib.sha1(f'{VOICE}|{lang}|{text}'.encode('utf-8')).hexdigest()[:12]}.mp3"


# 읽지 않는 글자 — 그림 글자(🪄✨)·이음 글자. 파일 이름 해시는 원문 그대로(앱이 원문으로 찾는다).
EMOJI = re.compile("[\U0001F000-\U0001FFFF☀-➿⬀-⯿️‍]")


def spoken(lang, text):
    """Turn display-only math placeholders into words the voice can read."""
    if lang == "ko":
        text = text.replace("✔를", "확인 버튼을")
    text = text.replace("✔", {"ko":"확인 버튼", "en":"the check button", "zh":"确认按钮"}.get(lang,""))
    text = EMOJI.sub("", text)
    text = re.sub(r"[,]{2,}", ",", text)
    text = re.sub(r"[!?]{2,}", ".", text)
    text = re.sub(r"\s[—–-]\s|——", ", ", text)
    if lang == "ko":
        text = re.sub(r"Level\s+(\d+)", r"레벨 \1", text)
        text = text.replace("위+아래 = 왼쪽+오른쪽", "위와 아래를 더한 수는, 왼쪽과 오른쪽을 더한 수와 같아요")
        text = text.replace("2~9단", "이 단부터 구 단까지")
        text = text.replace("+1000 하고 -1", "플러스 천 하고 마이너스 일")
        text = text.replace("끝 - 시작 + 1", "끝 수 빼기 시작, 더하기 일")
    replacements = {
        "ko": (("□0+□0", "열 개씩 더하기"), ("□0", "열 개씩"), ("□", "빈칸")),
        "en": (("□0+□0", "addition strategy"), ("□0", "tens"), ("□", "the missing number")),
        "zh": (("□0+□0", "十加十"), ("□0", "十"), ("□", "未知数")),
    }
    for source, replacement in replacements.get(lang, ()):
        text = text.replace(source, replacement)
    return re.sub(r"\s{2,}", " ", text).strip()


def letters(lang, s):
    if lang == "ko":
        return re.sub(r"[^가-힣]", "", s)
    if lang == "zh":
        return re.sub(r"[^一-鿿]", "", s)
    return re.sub(r"[^a-z]", "", s.lower())


def cer(lang, ref, hyp):
    a, b = letters(lang, ref), letters(lang, hyp)
    if not a:
        return 0.0
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (ca != cb))
    return d[len(b)] / len(a)


def expected(lang, text):
    """기대 길이(초). ko 는 쇼릴·독쌤에서 쓰던 식(초당 5.6음절)."""
    pauses = len(re.findall(r"[,.!?，。！？]", text))
    if lang == "ko":
        n = len(re.findall(r"[가-힣0-9]", text)) / 5.6
    elif lang == "zh":
        n = len(re.findall(r"[一-鿿0-9]", text)) / 4.2
    else:
        n = len(re.findall(r"[A-Za-z0-9']+", text)) / 2.5
    return n + 0.25 * pauses + 0.3


def ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"


def write_wav(path, y):
    import numpy as np
    pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


def to_mp3(wav, mp3):
    r = subprocess.run([ffmpeg(), "-y", "-v", "error", "-i", wav, "-af", "loudnorm=I=-18:TP=-1.5:LRA=11",
                        "-ac", "1", "-ar", str(SR), "-c:a", "libmp3lame", "-b:a", "64k", mp3], capture_output=True)
    if r.returncode:
        sys.exit("ffmpeg 실패:\n" + r.stderr.decode("utf-8", "replace")[-800:])


def write_map(out):
    """Match current text and quality evidence; retain original files for recovery."""
    ts = tasks()
    valid = {fname(t["lang"], t["text"]): t for t in ts}
    exist = set(os.listdir(out)) if os.path.isdir(out) else set()
    rp = os.path.join(out, "report.json")
    report = {}
    if os.path.exists(rp):
        with open(rp, encoding="utf-8") as handle:
            report = json.load(handle)
    m = {l: {} for l in LANGS}
    for f, t in valid.items():
        quality = report.get(f)
        if quality is not None and quality.get("ok") is not True:
            continue
        if quality and quality.get("audioSHA256") and f in exist:
            with open(os.path.join(out,f), "rb") as handle:
                if hashlib.sha256(handle.read()).hexdigest() != quality["audioSHA256"]:
                    continue
        if f in exist:
            m[t["lang"]][t["text"]] = f"audio/omni/{f}"
    n = sum(len(v) for v in m.values())
    body = json.dumps(m, ensure_ascii=False, indent=1)
    with open(MAP, "w", encoding="utf-8") as handle:
        handle.write(
        "/* Numbers of Magic — OmniVoice 복제 음성 map (scripts/omnivoice-nm.py 가 만든다, 손으로 고치지 말 것)\n"
        f" * {n}/{len(ts)}줄. 없는 줄은 화면 글을 유지한다. 다른 목소리로 대체하지 않는다.\n */\n"
        f"window.NM_TTS_OMNI = {body};\n")
    per = {l: len(m[l]) for l in LANGS}
    print(f"tts-map-omni.js: {n}/{len(ts)}줄 {per}", flush=True)
    return n


def listen_page(refs, made, path):
    b64 = lambda f: base64.b64encode(open(f, "rb").read()).decode("ascii")
    parts = []
    for lang in LANGS:
        if lang not in refs:
            continue
        rows = [x for x in made if x[0] == lang][:8]
        parts.append(f'<h2>{ovclone.LANG_NAME.get(lang, lang)}</h2><div class="clip orig"><b>참조(지금 앱 목소리)</b>'
                     f'<audio controls src="data:audio/wav;base64,{b64(refs[lang][0])}"></audio><p>{refs[lang][1]}</p></div>'
                     + "".join(f'<div class="clip"><audio controls preload="none" src="data:audio/mpeg;base64,{b64(f)}"></audio><p>{t}</p></div>'
                               for _, t, f in rows))
    open(path, "w", encoding="utf-8").write(
        '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>넘버스 복제 음성 듣기</title><style>body{font:15px/1.7 system-ui,"Malgun Gothic",sans-serif;background:#f6f8fb;'
        'color:#1a2233;margin:0 auto;padding:20px 16px;max-width:820px;word-break:keep-all}.clip{background:#fff;border:1px solid #dfe6f0;'
        'border-radius:12px;padding:10px 12px;margin:10px 0}.clip.orig{background:#fff8e6}audio{width:100%}p{margin:6px 0 0;font-size:13px}</style>'
        '<h1>넘버스 오브 매직 — 복제 음성 듣기</h1><p>맨 위가 지금 앱 목소리(참조), 아래가 복제 음성입니다. 이 파일 한 장에 소리가 다 들어 있습니다.</p>'
        + "".join(parts) + "</html>")
    return path


def save_report(path, report):
    """한 줄씩 원자적으로 저장해 중단 후에도 검수 결과를 보존한다."""
    old = {}
    if os.path.exists(path):
        with open(path, encoding="utf-8") as handle:
            old = json.load(handle)
    old.update(report)
    with open(path + ".tmp", "w", encoding="utf-8") as handle:
        json.dump(old, handle, ensure_ascii=False, indent=1)
    os.replace(path + ".tmp", path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shard", default="", help="k/n — n 조각 중 k 번째(0부터)만")
    ap.add_argument("--out", default=OUT)
    ap.add_argument("--ref-dir", default=os.path.join(WORK, "ref"))
    ap.add_argument("--refs-only", action="store_true")
    ap.add_argument("--lang", default="", help="이 언어만(쉼표)")
    ap.add_argument("--limit", type=int, default=0, help="앞에서 N줄만(시험용)")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--tasks-file", help="재검수 JSON: file 또는 lang/text로 선택한 문장만 후보 폴더에 생성")
    ap.add_argument("--no-check", action="store_true")
    ap.add_argument("--manifest-only", action="store_true")
    ap.add_argument("--device", default="auto")
    ap.add_argument("--asr-device", default="cpu", help="받아쓰기 검수 장치(기본 cpu: GPU 메모리는 음성 생성에 사용)")
    ap.add_argument("--asr-model", help="받아쓰기 모델 이름 또는 기존 로컬 캐시 경로")
    ap.add_argument("--tries", type=int, default=TRIES, help="문장별 최대 생성 횟수(기본 3)")
    ap.add_argument("--speed", type=float, default=None)
    ap.add_argument("--model", default="k2-fsa/OmniVoice")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True); os.makedirs(WORK, exist_ok=True)
    if a.manifest_only:
        write_map(OUT); return

    langs = [l for l in (a.lang.split(",") if a.lang else LANGS) if l in LANGS]
    refs = ovclone.build_refs(langs, a.ref_dir)
    json.dump({l: refs[l][1] for l in refs}, open(os.path.join(a.out, "refs.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    if a.refs_only:
        print(f"참조만 만들었습니다: {a.ref_dir}"); return

    selected = None
    if a.tasks_file:
        selected = set()
        for row in json.load(open(a.tasks_file, encoding="utf-8")):
            selected.add(row.get("file") or fname(row["lang"], row["text"]))
    todo = [t for t in tasks() if t["lang"] in refs
            and (selected is None or fname(t["lang"],t["text"]) in selected)
            and (a.force or not os.path.exists(os.path.join(OUT, fname(t["lang"], t["text"]))))]
    if a.shard:
        k, n = map(int, a.shard.split("/")); todo = todo[k::n]
    if a.limit:
        todo = todo[:a.limit]
    print(f"이번에 만들 것 {len(todo)}줄 (참조 언어 {sorted(refs)})", flush=True)

    rp = os.path.join(a.out, f"report{'-' + a.shard.replace('/', 'of') if a.shard else ''}.json")
    made, report = [], {}
    if todo:
        import torch
        dev = a.device
        if dev == "auto":
            dev = "cuda:0" if torch.cuda.is_available() else "cpu"
        print(("🎮 GPU: " + torch.cuda.get_device_name(0)) if dev.startswith("cuda") else "🖥  GPU 없음 — CPU 라 느립니다", flush=True)
        from omnivoice import OmniVoice
        model = OmniVoice.from_pretrained(a.model, device_map=dev, dtype=torch.float16 if dev.startswith("cuda") else torch.float32)
        if not a.no_check:
            model.load_asr_model(model_name=a.asr_model, device=a.asr_device)
        prompts = {l: model.create_voice_clone_prompt(ref_audio=refs[l][0], ref_text=refs[l][1]) for l in refs}
        use_lang = [True]

        def gen(lang, say, dur):
            kw = dict(text=say, voice_clone_prompt=prompts[lang], duration=dur, speed=None if dur else a.speed)
            if use_lang[0]:
                try:
                    return model.generate(language=lang, **kw)[0]
                except (TypeError, ValueError) as e:     # language 인자를 안 받는 판이면 한 번만 알리고 뺀다
                    print(f"  (language 인자 없이 진행: {e})", flush=True); use_lang[0] = False
            return model.generate(**kw)[0]

        t0 = time.time(); audio_s = 0.0
        for n, t in enumerate(todo, 1):
            lang, text = t["lang"], t["text"]; say = spoken(lang, text)
            label = f"{t['unitId']} {t['key']} [{lang}]"
            exp = expected(lang, say) / (a.speed or 1.0); dur = None; best = None; ts = time.time()
            tries = max(1, a.tries)
            for k in range(tries):
                try:
                    y = gen(lang, say, dur).reshape(-1)
                except Exception as e:
                    print(f"  ✗ {label}: {e}", flush=True); break
                if len(y) / SR > exp * 1.25:
                    print(f"    ↻ {label} 너무 김 {len(y) / SR:.1f}초 > 기대 {exp:.1f}초", flush=True)
                    dur = round(exp * 1.08, 2)
                    if k < tries - 1:
                        continue
                if a.no_check:
                    best = (0.0, "", y); break
                hyp = model._asr_pipe({"raw": y.astype("float32"), "sampling_rate": SR},
                                      generate_kwargs={"language": ASR_LANG[lang]})["text"].strip()
                c = cer(lang, say, hyp)
                if best is None or c < best[0]:
                    best = (c, hyp, y)
                if c <= CER_RETRY:
                    break
                print(f"    ↻ {label} 다시({k + 1}) CER {c:.2f}: {hyp}", flush=True)
            if best is None:
                continue
            c, hyp, y = best; audio_s += len(y) / SR
            f = fname(lang, text); ok = not a.no_check and c <= CER_OK
            report[f] = {"unit": t["unitId"], "key": t["key"], "lang": lang, "text": text, "asr": hyp,
                         "cer": round(c, 3), "ok": ok, "checked": not a.no_check, "spoken": say, "sec": round(len(y) / SR, 2)}
            if ok or a.no_check:
                wav = os.path.join(WORK, "tmp.wav"); write_wav(wav, y)
                mp3 = os.path.join(a.out, f); to_mp3(wav, mp3); made.append((lang, text, mp3))
                with open(mp3, "rb") as handle:
                    report[f]["audioSHA256"] = hashlib.sha256(handle.read()).hexdigest()
            save_report(rp, report)
            print(f"  {'✓' if ok else '✗ 뺌'} [{n}/{len(todo)}] {label} {len(y) / SR:.1f}초 · CER {c:.2f} · {time.time() - ts:.0f}초", flush=True)
        el = time.time() - t0
        print(f"만든 음성 {len(made)}개 / 뺀 것 {len(todo) - len(made)}개 · {el:.0f}초 · RTF {el / max(audio_s, 1e-6):.1f}", flush=True)

    if report:
        save_report(rp, report)
    if a.out == OUT:
        write_map(OUT)
        if made:
            print(f"\n듣기 페이지: {listen_page(refs, made, os.path.join(WORK, '듣기.html'))}")


if __name__ == "__main__":
    main()
