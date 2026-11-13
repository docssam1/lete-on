#!/usr/bin/env python3
"""
레이키즈(sm/) 독쌤 목소리 만들기 — 사이언스 랩 독쌤과 **같은 목소리**(같은 참조 음성·참조 전사·공부용 빠르기 0.8).

생성·검수 함수는 scripts/omnivoice-docssam.py 의 것을 그대로 쓴다(숫자 읽기 · 받아 적어 CER 비교 · 꼬리 반복 막기).
다른 점은 줄 목록과 파일 이름뿐이다.
  줄 목록: sm/data/voice/sm.voice.json(코드 대사) + sm/data/voice-book.local.json(지문, 비공개 목록) — scripts/sm-voice-lines.py 가 만든다
  결과   : sm/audio/docssam/<id>.mp3 + manifest.json(파일 이름만 — 글은 싣지 않는다)
  검수   : <work>/sm-report.json · <work>/sm-듣기.html (비공개 — 지문 글이 들어 있어 저장소에 올리지 않는다)

⚠ 참조 녹음·참조 WAV·작업 폴더는 커밋하지 않는다. Google TTS는 쓰지 않는다.

쓰는 법(맥, 이미 깔린 환경):
  /Users/docssam/Developer/GFIELD/lete-on-voice-fcs/.venv-omnivoice/bin/python scripts/omnivoice-sm.py \
     --ref <다듬은 참조 wav> --ref-text-file <참조 전사 txt> --work-dir <비공개 폴더> [--only id,id] [--limit N]
  python3 scripts/omnivoice-sm.py --manifest-only
"""
import argparse, importlib.util, json, os, re, sys, time
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SM = os.path.join(ROOT, "sm")
OUT = os.path.join(SM, "audio", "docssam")
LISTS = [os.path.join(SM, "data", "voice", "sm.voice.json"), os.path.join(SM, "data", "voice-book.local.json")]
SPEED = 0.8

spec = importlib.util.spec_from_file_location("ovd", os.path.join(ROOT, "scripts", "omnivoice-docssam.py"))
ovd = importlib.util.module_from_spec(spec); spec.loader.exec_module(ovd)

EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿⭐️]")
# 레이키즈 화면 글 읽기: 출발점 번호 ①②③은 「일 번」, 컵 번호는 「일 번 컵」(개수 「한 번」이 아님), 큐브 무게 1g은 「일 그램」
SM_SPOKEN = [("①", "일 번"), ("②", "이 번"), ("③", "삼 번"),
             (r"([1-9])번 컵", lambda m: ovd.DIG[m.group(1)] + " 번 컵"), (r"([1-9])번 ([아엄])", lambda m: ovd.DIG[m.group(1)] + " 번 " + m.group(2)),
             (r"1g", "일 그램"), (r"([0-9])대 ([0-9])", r"\1 대 \2")]
# 큐브를 하나씩 짚으며 세는 말(「1」「2」…)은 「하나」「둘」…로 센다
COUNT = ["", "하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉", "열", "열하나", "열둘", "열셋", "열넷", "열다섯"]


def count_hyp(say, hyp):
    # 받아쓰기는 「열셋」을 「13」으로 적으므로 세기 말일 때는 숫자를 다시 세기 말로 바꿔 비교한다
    d = re.sub(r"[^0-9]", "", hyp)
    return COUNT[int(d)] if say in COUNT and d and re.fullmatch(r"\s*[0-9]+[.!]?\s*", hyp) and int(d) < len(COUNT) else hyp


def sm_spoken(text):
    if re.fullmatch(r"[1-9][0-9]?", text) and int(text) < len(COUNT):
        return COUNT[int(text)]
    for a, b in SM_SPOKEN:
        text = re.sub(a, b, text)
    return ovd.spoken(EMOJI.sub("", text).strip())


def lines():
    out, seen = [], set()
    for p in LISTS:
        if os.path.exists(p):
            for l in json.load(open(p, encoding="utf-8"))["lines"]:
                if l["id"] not in seen:
                    seen.add(l["id"]); out.append((l["id"], l["text"]))
    return out


def write_manifest():
    os.makedirs(OUT, exist_ok=True)
    have = sorted(f for f in os.listdir(OUT) if f.startswith("sm-") and f.endswith(".mp3"))
    json.dump({"tag": "sm-docssam-v1", "rate": 1, "files": have}, open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8"), indent=1)
    print(f"manifest.json: {len(have)}개", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref"); ap.add_argument("--ref-text-file"); ap.add_argument("--work-dir", required=False)
    ap.add_argument("--only", default=""); ap.add_argument("--limit", type=int, default=0); ap.add_argument("--force", action="store_true")
    ap.add_argument("--device", default="auto"); ap.add_argument("--asr-device", default="cpu")
    ap.add_argument("--model", default="k2-fsa/OmniVoice"); ap.add_argument("--manifest-only", action="store_true")
    a = ap.parse_args()
    if a.manifest_only:
        write_manifest(); return
    os.makedirs(OUT, exist_ok=True); os.makedirs(a.work_dir, exist_ok=True)
    only = set(x for x in a.only.split(",") if x)
    todo = [(i, t) for i, t in lines() if (not only or i in only) and (a.force or not os.path.exists(os.path.join(OUT, i + ".mp3")))]
    if a.limit:
        todo = todo[:a.limit]
    print(f"레이키즈 독쌤 대사 {len(lines())}줄 중 이번에 만들 것 {len(todo)}줄", flush=True)
    if not todo:
        write_manifest(); return
    import torch
    dev = a.device if a.device != "auto" else ("cuda:0" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu"))
    print("장치:", dev, flush=True)
    from omnivoice import OmniVoice
    model = OmniVoice.from_pretrained(a.model, device_map=dev, dtype=torch.float16 if dev.startswith("cuda") else torch.float32)
    model.load_asr_model(device=a.asr_device)
    ko = lambda audio: model._asr_pipe(audio, generate_kwargs={"language": "korean"})["text"].strip()
    ref_text = open(a.ref_text_file, encoding="utf-8-sig").read().strip()
    print("참조 전사:", ref_text, flush=True)
    prompt = model.create_voice_clone_prompt(ref_audio=a.ref, ref_text=ref_text)
    SR = ovd.SR
    report_path = os.path.join(a.work_dir, "sm-report.json")
    report = json.load(open(report_path, encoding="utf-8")) if os.path.exists(report_path) else {}
    made, t0, audio_s = [], time.time(), 0.0
    for n, (lid, text) in enumerate(todo, 1):
        t = time.time(); say = sm_spoken(text); best = None
        exp = ovd.expected(say) / SPEED; dur = None
        if say in COUNT:  # 세기 말은 한 낱말이라 너무 짧게 자르면 소리가 뭉개진다
            exp = max(exp, 0.9)
        for k in range(ovd.TRIES):
            try:
                y = model.generate(text=say, language="ko", voice_clone_prompt=prompt, duration=dur, speed=None if dur else SPEED)[0]
            except Exception as e:
                print(f"  ✗ {lid}: {e}", flush=True); break
            y = y.reshape(-1)
            if len(y) / SR > exp * 1.25:
                print(f"    ↻ {lid} 너무 김 {len(y) / SR:.1f}초 > 기대 {exp:.1f}초", flush=True)
                dur = round(exp * 1.08, 2)
                if k < ovd.TRIES - 1:
                    continue
            pad = np.zeros(int(SR * 0.4), dtype="float32")  # 아주 짧은 소리는 받아쓰기가 지어내지 않게 앞뒤에 쉼을 둔다
            hyp = ko({"raw": np.concatenate([pad, y.astype("float32"), pad]), "sampling_rate": SR}); c = ovd.cer(say, count_hyp(say, hyp))
            if best is None or c < best[0]:
                best = (c, hyp, y)
            if c <= ovd.CER_RETRY:
                break
            print(f"    ↻ {lid} 다시({k + 1}) CER {c:.2f}: {hyp}", flush=True)
        if best is None:
            continue
        c, hyp, y = best; audio_s += len(y) / SR
        wav = os.path.join(a.work_dir, f"{lid}.wav"); ovd.write_wav(wav, y)
        ok = c <= ovd.CER_OK
        report[lid] = {"text": text, "spoken": say, "asr": hyp, "cer": round(c, 3), "ok": ok, "sec": round(len(y) / SR, 2)}
        if ok:
            mp3 = os.path.join(OUT, lid + ".mp3"); ovd.to_mp3(wav, mp3); made.append((lid, text, mp3))
        json.dump(report, open(report_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"  {'✓' if ok else '✗ 뺌'} [{n}/{len(todo)}] {lid}  {len(y) / SR:.1f}초 · CER {c:.2f} · {time.time() - t:.0f}초", flush=True)
    el = time.time() - t0
    print(f"만든 음성 {len(made)}개 / 뺀 것 {len(todo) - len(made)}개 · {el:.0f}초 · RTF {el / max(audio_s, 1e-6):.1f}", flush=True)
    write_manifest()
    print("듣기 페이지:", ovd.listen_page(a.ref, made[:40], os.path.join(a.work_dir, "sm-듣기.html")), flush=True)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
