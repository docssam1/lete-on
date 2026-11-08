#!/usr/bin/env python3
"""
독쌤 목소리 비교 듣기 — 지금 쓰는 OmniVoice 복제 음성 옆에 Qwen3-TTS 복제 음성을 나란히 놓는다.
원장 2026-11-08 「옴니보이스보다 한국어에 맞는 복제 프로그램 찾아봐」 → 「진행」.

Qwen3-TTS(QwenLM, Apache 2.0): 한국어 포함 10개 언어, 참조 3초로 복제. 공식 표의 한국어 화자 유사도가
ElevenLabs·MiniMax보다 높다고 나와 있다(제조사 자체 측정) — 우리 귀로 확인하려고 만든 도구다.

하는 일
  1) 독쌤 녹음을 OmniVoice 때와 **똑같이** 다듬어 참조로 쓴다(scripts/omnivoice-docssam.py 의 prep_ref 그대로).
  2) 참조 전사: OmniVoice 가 이 PC 에서 받아 적어 둔 .docssam-work/ref.json 을 그대로 쓴다(지어내지 않는다).
     없으면 --ref-text-file, 그것도 없으면 목소리 특징만 쓰는 모드(x_vector_only — 닮음이 덜할 수 있다)로 돈다.
  3) 이미 OmniVoice 음성이 있는 독쌤 대사 가운데 고르게 N줄(숫자 든 줄 포함)을 골라 Qwen3-TTS 로 만든다.
     읽기용 글(숫자·기호 → 한글 읽기)은 OmniVoice 와 같은 spoken() 을 쓴다.
  4) .docssam-work/qwen3/듣기.html — 녹음(참조) · 줄마다 OmniVoice / Qwen3-TTS 를 한 장에(소리를 파일 안에 넣어 휴대폰으로 옮겨도 열린다).

아무것도 올리지 않는다. 결과는 저장소 밖(.docssam-work, .gitignore 대상)에만 둔다. 사이트 음성은 바꾸지 않는다.

쓰는 법
  PC  : scripts\\local\\qwen3tts-audition.cmd  (녹음 파일을 그 위에 끌어다 놓기)
  맥  : scripts/local/qwen3tts-audition.command
  python scripts/qwen3tts-audition.py --ref <녹음> [--lines 8] [--model Qwen/Qwen3-TTS-12Hz-1.7B-Base] [--tempo 0.85]
"""
import argparse, base64, importlib.util, json, os, re, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_spec = importlib.util.spec_from_file_location("omnivoice_docssam", os.path.join(ROOT, "scripts", "omnivoice-docssam.py"))
ov = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(ov)   # 같은 다듬기·읽기 규칙·파일 이름을 그대로 쓴다

WORK = os.path.join(ROOT, ".docssam-work")
OUT = os.path.join(WORK, "qwen3")


def omnivoice_file(lid, text):
    """그 줄의 지금 OmniVoice 음성(공부 대사 = 느린 목소리) 파일 경로 — 없으면 None."""
    for voice in (ov.SLOW, ov.V1):
        f = os.path.join(ov.OUT, ov.fname(lid, text, voice))
        if os.path.exists(f):
            return f
    return None


def pick_lines(n):
    """OmniVoice 음성이 있는 줄 중 고르게 n줄. 덱(fcs-)·판서(fcb-)·사이언스 랩이 섞이고, 숫자 든 줄이 들어가게."""
    have = [(i, t, f) for i, t in ov.study_lines() if 12 <= len(t) <= 90 and (f := omnivoice_file(i, t))]
    if not have:
        sys.exit("OmniVoice 음성이 있는 대사를 찾지 못했습니다(science-lab/audio/docssam). git pull 을 먼저 하세요.")
    groups = [[x for x in have if x[0].startswith("fcs-")], [x for x in have if x[0].startswith("fcb-")],
              [x for x in have if not x[0].startswith(("fcs-", "fcb-"))]]
    picked = []
    for g in groups:   # 묶음마다 고르게
        k = max(1, -(-n // 3))
        picked += [g[int(j * len(g) / k)] for j in range(k)] if g else []
    digits = [x for x in have if re.search(r"[0-9]", x[1]) and x not in picked]
    if digits:
        picked.append(digits[len(digits) // 2])
    return picked[:max(n, 1)]


def to_mp3(wav, mp3, tempo):
    af = (f"atempo={tempo}," if abs(tempo - 1) > 1e-3 else "") + "loudnorm=I=-18:TP=-1.5:LRA=11"
    ov.run([ov.ffmpeg_exe(), "-y", "-v", "error", "-i", wav, "-af", af, "-ac", "1", "-ar", "24000",
            "-c:a", "libmp3lame", "-b:a", "64k", mp3])


def listen_page(ref_wav, rows, path, note):
    b64 = lambda f: base64.b64encode(open(f, "rb").read()).decode("ascii")
    clip = lambda label, f, kind: (f'<div class="pick {kind}"><span>{label}</span>'
                                   f'<audio controls preload="none" src="data:audio/{"wav" if f.endswith(".wav") else "mpeg"};base64,{b64(f)}"></audio></div>')
    items = "".join(f'<section><p>{t}</p><div class="pair">{clip("지금(OmniVoice)", fo, "ov")}{clip("Qwen3-TTS", fq, "qw")}</div></section>'
                    for _, t, fo, fq in rows)
    html = f"""<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>독쌤 목소리 비교</title>
<style>:root{{--paper:#fbf6ea;--line:#e2d5bc;--ink:#22302a;--green:#1f6b4a;--muted:#5f574a}}
body{{margin:0 auto;padding:20px 16px 40px;max-width:860px;background:var(--paper);color:var(--ink);font:15px/1.7 system-ui,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;word-break:keep-all}}
h1{{font-size:21px;margin:0 0 4px}}.lede{{color:var(--muted);font-size:14px;margin:0 0 14px}}
section,.ref{{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:12px 0}}.ref{{background:#fff4dc}}
section p{{margin:0 0 8px}}.pair{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}@media(max-width:560px){{.pair{{grid-template-columns:1fr}}}}
.pick span{{display:block;font-size:13px;font-weight:700;color:var(--muted)}}.pick.qw span{{color:var(--green)}}audio{{width:100%}}</style>
<h1>독쌤 목소리 비교 — 지금(OmniVoice) · Qwen3-TTS</h1>
<p class="lede">맨 위는 참조로 쓴 독쌤 녹음입니다. 줄마다 두 목소리를 번갈아 들어 보고, 어느 쪽이 녹음과 더 같은 사람 같은지·발음이 정확한지 골라 주세요. {note}</p>
<div class="ref">{clip("독쌤 녹음(참조)", ref_wav, "ref")}</div>{items}</html>"""
    open(path, "w", encoding="utf-8").write(html)
    return path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True, help="독쌤 목소리 녹음(mp4/m4a/mp3/wav) — 저장소에 넣지 않는다")
    ap.add_argument("--ref-text-file", help="참조 녹음의 확인된 전사(UTF-8). 없으면 .docssam-work/ref.json")
    ap.add_argument("--lines", type=int, default=8)
    ap.add_argument("--model", default="Qwen/Qwen3-TTS-12Hz-1.7B-Base", help="그래픽 메모리가 모자라면 Qwen/Qwen3-TTS-12Hz-0.6B-Base")
    ap.add_argument("--tempo", type=float, default=0.85, help="공부 대사 빠르기(OmniVoice 는 0.8 배로 만들었다). 1 이면 그대로")
    ap.add_argument("--device", default="auto")
    a = ap.parse_args()
    if not os.path.exists(a.ref):
        sys.exit(f"녹음 파일을 찾지 못했습니다: {a.ref}")
    os.makedirs(OUT, exist_ok=True)

    ref_wav = ov.prep_ref(a.ref, os.path.join(OUT, "docssam-ref.wav"))
    ref_text = ""
    if a.ref_text_file:
        ref_text = open(a.ref_text_file, encoding="utf-8-sig").read().strip()
    elif os.path.exists(os.path.join(WORK, "ref.json")):
        ref_text = json.load(open(os.path.join(WORK, "ref.json"), encoding="utf-8")).get("ref_text", "").strip()
    note = "참조 전사를 같이 써서 복제했습니다." if ref_text else "참조 전사가 없어 목소리 특징만으로 복제했습니다(닮음이 덜할 수 있음)."
    print(("참조 전사: " + ref_text) if ref_text else "참조 전사 없음 → 목소리 특징만 쓰는 모드", flush=True)

    rows_in = pick_lines(a.lines)
    print(f"비교할 대사 {len(rows_in)}줄", flush=True)

    import torch, soundfile as sf
    from qwen_tts import Qwen3TTSModel
    dev = a.device
    if dev == "auto":
        dev = "cuda:0" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu")
    dtype = torch.bfloat16 if dev.startswith("cuda") else torch.float32
    print(("🎮 GPU: " + torch.cuda.get_device_name(0)) if dev.startswith("cuda") else "🍎 애플 칩 GPU(MPS)" if dev == "mps" else "🖥  CPU — 느립니다", flush=True)
    model = Qwen3TTSModel.from_pretrained(a.model, device_map=dev, dtype=dtype)
    prompt = model.create_voice_clone_prompt(ref_audio=ref_wav, ref_text=ref_text or None, x_vector_only_mode=not ref_text)

    rows, t0, secs = [], time.time(), 0.0
    for n, (lid, text, fo) in enumerate(rows_in, 1):
        t = time.time()
        wavs, sr = model.generate_voice_clone(text=ov.spoken(text), language="Korean", voice_clone_prompt=prompt)
        wav = os.path.join(OUT, f"{lid}.wav"); sf.write(wav, wavs[0], sr)
        mp3 = os.path.join(OUT, f"{lid}.mp3"); to_mp3(wav, mp3, a.tempo)
        secs += len(wavs[0]) / sr
        print(f"  [{n}/{len(rows_in)}] {lid}  {time.time() - t:.1f}초", flush=True)
        rows.append((lid, text, fo, mp3))
    took = time.time() - t0
    print(f"만든 음성 {secs:.0f}초 · 걸린 시간 {took:.0f}초 · RTF {took / max(secs, 0.1):.2f}(1보다 작으면 실제 길이보다 빨리 만든다)", flush=True)
    page = listen_page(ref_wav, rows, os.path.join(OUT, "듣기.html"), note)
    print(f"\n듣기 페이지: {page}")


if __name__ == "__main__":
    main()
