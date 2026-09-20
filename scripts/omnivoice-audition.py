#!/usr/bin/env python3
"""
OmniVoice 음성 시청(audition) — 우리 캐릭터 목소리를 들어 보기 위한 것

왜 이 파일이 있나 (2026-09-21, 원장: "OmniVoice 쓰면 음성 비용 저렴해지나")
---------------------------------------------------------------------------
OmniVoice(k2-fsa, Apache 2.0)는 목소리 복제·설계가 되는 zero-shot TTS다. 비용은
글자당 요금에서 GPU/CPU 시간으로 바뀔 뿐 공짜가 아니지만, **Google 이 아예 못 하는
일**을 한다 — 누미·독쌤·할아버지에게 저마다 다른 목소리를 주는 것.

그래서 이 스크립트는 **production 이 아니라 시청용**이다.
  · Supabase 에 아무것도 올리지 않는다(운영 음성을 건드리지 않는다)
  · 비밀키를 하나도 쓰지 않는다
  · 결과는 워크플로 artifact 로만 받는다 — 귀로 듣고 판단한 뒤에 다음을 정한다

두 가지 길
---------------------------------------------------------------------------
1) 목소리 **설계**(instruct) — 참조 음성 없이 "여성, 아이, 높은 음"처럼 말로 지정.
   ⚠ 공식 문서가 명시한다: **voice design 은 중국어·영어 데이터로만 학습**됐고 다른
   언어에서는 불안정할 수 있다. 한국어 학습량도 8,609시간으로 영어(206,061)의 1/24다.
   그래서 한국어 설계 결과는 기대를 낮추고 들어야 한다.
2) 목소리 **복제**(clone) — 3~10초 참조 음성을 주면 그 목소리로 읽는다. 문서가
   "가장 안정적인 방식"이라고 못 박은 쪽이다.
   ⚠ 참조 음성은 **권리가 깨끗한 것**이어야 한다. 다른 TTS 업체가 만들어 준 음성을
     복제하는 것은 그 업체 약관 위반이 될 수 있으니 쓰지 않는다. 선생님이 직접
     3~10초 읽어 주는 것이 가장 깨끗하고, 그러면 **독쌤이 진짜 선생님 목소리**가 된다.

쓰는 법 (GitHub Actions `OmniVoice 음성 시청` 워크플로가 이 파일을 부른다)
  python scripts/omnivoice-audition.py --out out/
  python scripts/omnivoice-audition.py --out out/ --ref ref.wav --ref-text "안녕하세요"
"""
import argparse, os, sys, time

# 앱에 실제로 들어 있는 대사로 듣는다 — 시청용 문장을 따로 지어내면 비교가 안 된다.
LINES = [
    ("numi-01", "누미랑 같이 세어 보자! 톡톡 누르면서 하나, 둘, 셋!"),
    ("numi-02", "자, 더해서 10이 되는 수를 말할 거야. 내가 3 하면, 짝꿍 7을 눌러줘. 준비됐지?"),
    ("numi-03", "완벽해! 이제 넌 10 묶기 마법사야"),
    ("en-01",   "Now let's practise halving! I'll show a number — tap its half. Ready?"),
    ("zh-01",   "现在来练习减半！我给你看一个数，你按出它的一半。准备好了吗？"),
]

# 캐릭터별 목소리 설계안. 설계는 중·영으로만 학습됐으니 한국어에서 어떻게 나오는지가
# 바로 이 시청에서 확인할 일이다.
VOICES = [
    ("numi",   "female, child, high pitch"),
    ("docssam","male, young adult, medium pitch"),
    ("elder",  "male, elderly, low pitch"),
    ("auto",   None),                 # 아무 지정 없이 모델이 고르게 두기(기준선)
]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--ref", default="", help="목소리 복제용 참조 음성(3~10초)")
    ap.add_argument("--ref-text", default="", help="참조 음성의 대사(비우면 자동 전사)")
    ap.add_argument("--device", default="cpu")
    ap.add_argument("--model", default="k2-fsa/OmniVoice")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    import torch, soundfile as sf
    from omnivoice import OmniVoice

    # CPU 에서는 float16 이 느리거나 지원되지 않는다 — 장치에 맞춰 고른다.
    dtype = torch.float16 if a.device.startswith("cuda") else torch.float32
    t0 = time.time()
    print(f"모델 내려받는 중… ({a.model}, {a.device})", flush=True)
    model = OmniVoice.from_pretrained(a.model, device_map=a.device, dtype=dtype)
    print(f"준비 {time.time()-t0:.0f}초", flush=True)

    jobs = []
    if a.ref:
        # 복제 — 참조 음성 하나로 전 대사를 읽는다(설계안은 쓰지 않는다)
        jobs = [("clone", None)]
    else:
        jobs = VOICES

    total_audio = 0.0
    for vname, instruct in jobs:
        for lid, text in LINES:
            t = time.time()
            kw = {"text": text}
            if a.ref:
                kw["ref_audio"] = a.ref
                if a.ref_text:
                    kw["ref_text"] = a.ref_text
            elif instruct:
                kw["instruct"] = instruct
            try:
                audio = model.generate(**kw)
            except Exception as e:      # 한 줄이 실패해도 나머지는 들어 봐야 한다
                print(f"  ✗ {vname}/{lid}: {e}", flush=True)
                continue
            wav = audio[0]
            secs = len(wav) / 24000.0
            total_audio += secs
            path = os.path.join(a.out, f"{vname}-{lid}.wav")
            sf.write(path, wav, 24000)
            took = time.time() - t
            print(f"  ✓ {vname}/{lid}  {secs:.1f}초 음성 / {took:.0f}초 걸림 (RTF {took/max(secs,0.01):.1f})",
                  flush=True)

    print(f"\n합계 음성 {total_audio:.0f}초 · 전체 {time.time()-t0:.0f}초")
    print("RTF 가 1 보다 크면 CPU 로는 실시간보다 느리다는 뜻 — 운영에 쓰려면 GPU 가 필요하다.")

if __name__ == "__main__":
    sys.exit(main())
