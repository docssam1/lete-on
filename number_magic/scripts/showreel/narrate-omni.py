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
    out = os.path.join(HERE, "narration", "omnivoice")
    os.makedirs(out, exist_ok=True)
    refs = ovclone.build_refs(["ko"], os.path.join(ROOT, ".omni-ref"))
    if "ko" not in refs:
        sys.exit("한국어 참조 음성을 만들지 못했습니다")
    ref_wav, ref_text = refs["ko"]
    json.dump({"ref_text": ref_text, "ref_voice": ovclone.VOICE_OF.get("ko")}, open(os.path.join(out, "_ref.json"), "w", encoding="utf-8"), ensure_ascii=False)

    import torch, soundfile as sf
    from omnivoice import OmniVoice
    dev = "cuda:0" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if dev.startswith("cuda") else torch.float32
    t0 = time.time()
    model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map=dev, dtype=dtype)
    print(f"모델 준비 {time.time()-t0:.0f}초 · {dev}", flush=True)
    for line in cfg["lines"]:
        t = time.time()
        y = model.generate(text=line["text"], ref_audio=ref_wav, ref_text=ref_text)[0]
        f = os.path.join(out, line["id"] + ".wav")
        sf.write(f, y, 24000)
        secs = len(y) / 24000.0
        print(f"  ✓ {line['id']} {secs:.1f}초 / {time.time()-t:.0f}초 걸림", flush=True)

if __name__ == "__main__":
    main()
