#!/usr/bin/env python3
"""쇼릴 내레이션을 OmniVoice 로 (2026-09-26, 원장: "음성은 이제 omni보이스 사용해").

목소리는 **앱에서 아이들이 이미 듣는 누미 목소리를 복제**한다 — 원장 결정(2026-09-21 "그냥 우리 나온
목소리 복제해")을 그대로 따른다. 참조 음성·전사는 scripts/omnivoice-clone.py 의 build_refs 가 tts-map.js 에서
3~10초짜리 한 줄을 골라 만든다(전사는 합성에 쓴 바로 그 문장 — 지어내지 않음).
대본은 narration.json 한 곳. 결과: narration/omnivoice/<줄 id>.wav (워크플로가 mp3 로 줄여 커밋).
GitHub Actions(.github/workflows/showreel-narration-omni.yml)에서 CPU 로 돈다 — 이 저장소 컨테이너는
Hugging Face 가 막혀 모델을 못 받는다. 원장 PC(GPU)에서도 그대로 돈다:  python number_magic/scripts/showreel/narrate-omni.py
"""
import importlib.util, json, os, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
spec = importlib.util.spec_from_file_location("ovclone", os.path.join(ROOT, "scripts", "omnivoice-clone.py"))
ovclone = importlib.util.module_from_spec(spec); spec.loader.exec_module(ovclone)

def main():
    cfg = json.load(open(os.path.join(HERE, "narration.json"), encoding="utf-8"))
    omni = cfg.get("omni") or {}
    out = os.path.join(HERE, "narration", omni.get("outDir") or "omnivoice")
    os.makedirs(out, exist_ok=True)
    if omni.get("refAudio"):
        # v4: 원장이 보낸 원본 녹음을 참조로. 전사를 모르면 None → OmniVoice 가 스스로 받아쓴다
        ref_wav = os.path.join(HERE, omni["refAudio"])
        ref_text = omni.get("refText")
        print(f"참조: {ref_wav} · 전사 {'자동(아래에 찍음)' if not ref_text else ref_text}", flush=True)
    elif omni.get("refText"):
        # 참조 줄을 대본에서 지정(v3: 더 활기찬 누미 대사) — tts-map 에 있는 그 문장의 실제 음성을 받는다
        import urllib.request, librosa, soundfile as sf0
        url = (ovclone.load_map().get("ko") or {}).get(omni["refText"])
        if not url:
            sys.exit("refText 가 tts-map.js 에 없습니다: " + omni["refText"])
        os.makedirs(os.path.join(ROOT, ".omni-ref"), exist_ok=True)
        tmp = os.path.join(ROOT, ".omni-ref", "ko-pick.mp3")
        open(tmp, "wb").write(urllib.request.urlopen(url, timeout=60).read())
        y0, sr0 = librosa.load(tmp, sr=24000, mono=True)
        ref_wav = os.path.join(ROOT, ".omni-ref", "ko-pick.wav"); sf0.write(ref_wav, y0, sr0)
        ref_text = omni["refText"]
        print(f"참조: {len(y0)/sr0:.1f}초 · {ref_text}", flush=True)
    else:
        refs = ovclone.build_refs(["ko"], os.path.join(ROOT, ".omni-ref"))
        if "ko" not in refs:
            sys.exit("한국어 참조 음성을 만들지 못했습니다")
        ref_wav, ref_text = refs["ko"]

    import re, torch, soundfile as sf
    from omnivoice import OmniVoice
    dev = "cuda:0" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if dev.startswith("cuda") else torch.float32
    t0 = time.time()
    model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map=dev, dtype=dtype)
    print(f"모델 준비 {time.time()-t0:.0f}초 · {dev}", flush=True)
    if not ref_text:
        # 전사를 모르면 직접 받아써서 **찍고 저장한다** — 자동 전사가 틀리면 문장 끝에 참조의 남은 말이 붙는다
        # (2026-09-26 원장: "문장 끝나고 '하넸다' 이런 것처럼 말을 반복해")
        model.load_asr_model()
        ref_text = model._asr_pipe(ref_wav, generate_kwargs={"language": "korean"})["text"].strip()
        print(f"참조 전사: {ref_text}", flush=True)
    json.dump({"ref_text": ref_text, "ref_voice": ("원장 녹음 " + omni["refAudio"]) if omni.get("refAudio") else ovclone.VOICE_OF.get("ko")},
              open(os.path.join(out, "_ref.json"), "w", encoding="utf-8"), ensure_ascii=False)
    # 꼬리 검사: 음절 수로 기대 길이를 잡고, 1.25배를 넘으면 기대 길이로 고정해 다시 만든다
    def expected(text):
        syl = len(re.findall(r"[가-힣0-9]", text))
        pauses = len(re.findall(r"[,.!?]", text))
        return syl / 5.6 + 0.25 * pauses
    report = []
    for line in cfg["lines"]:
        t = time.time()
        exp = expected(line["text"])
        y = model.generate(text=line["text"], language="ko", ref_audio=ref_wav, ref_text=ref_text,
                           speed=omni.get("speed"))[0]
        secs = len(y) / 24000.0
        fixed = False
        if secs > exp * 1.25:
            y = model.generate(text=line["text"], language="ko", ref_audio=ref_wav, ref_text=ref_text,
                               duration=round(exp * 1.08, 2))[0]
            fixed = True
            secs = len(y) / 24000.0
        f = os.path.join(out, line["id"] + ".wav")
        sf.write(f, y, 24000)
        report.append({"id": line["id"], "sec": round(secs, 2), "expected": round(exp, 2), "fixedLength": fixed})
        print(f"  ✓ {line['id']} {secs:.1f}초 (기대 {exp:.1f}초){' · 길이 고정해 다시 만듦' if fixed else ''} / {time.time()-t:.0f}초 걸림", flush=True)
    json.dump(report, open(os.path.join(out, "_lengths.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main()
