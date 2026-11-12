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

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SM = os.path.join(ROOT, "sm")
OUT = os.path.join(SM, "audio", "docssam")
LISTS = [os.path.join(SM, "data", "voice", "sm.voice.json"), os.path.join(SM, "data", "voice-book.local.json")]
SPEED = 0.8

spec = importlib.util.spec_from_file_location("ovd", os.path.join(ROOT, "scripts", "omnivoice-docssam.py"))
ovd = importlib.util.module_from_spec(spec); spec.loader.exec_module(ovd)

EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿⭐️]")


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
        t = time.time(); say = ovd.spoken(EMOJI.sub("", text).strip()); best = None
        exp = ovd.expected(say) / SPEED; dur = None
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
            hyp = ko({"raw": y.astype("float32"), "sampling_rate": SR}); c = ovd.cer(say, hyp)
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
