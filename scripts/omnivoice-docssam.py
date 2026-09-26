#!/usr/bin/env python3
"""
독쌤 목소리를 원장님 실제 녹음으로 — 사이언스 랩의 독쌤 대사 전부를 그 목소리로 만든다.

원장(2026-09-26): "목소리 이걸로 바꾸자, 독쌤 목소리야" — Drive 「녹음 2026-09-24 045754.mp4」(15.9초).

하는 일
  1) 녹음을 참조 음성으로 다듬는다: 24kHz 모노 · 긴 쉼 줄이기 · 소리 크기 맞추기(원본이 아주 작다, 평균 -47dB) · 10초 이내.
  2) 독쌤 대사를 모은다: science-lab/data/voice/*.voice.json 의 lines + science-lab/intro/narration.json 의 lines.
  3) OmniVoice 로 한 줄씩 복제 음성을 만든다(ref_text 없이 — 녹음을 전사해 지어내지 않는다).
  4) science-lab/audio/docssam/<id>-<sha1("docssam-clone-v1|"+text) 앞 10자>.mp3 로 저장한다.
     글이 같으면 파일 이름이 같으므로 **이미 있는 줄은 건너뛴다**(고친 줄만 다시 만든다).
  5) manifest.json(있는 파일 목록)과 듣기.html(원본 녹음 + 만든 음성, 한 장에 다 들어 있음)을 만든다.

사이트(v2/docssam.js · intro/intro.js)는 이 폴더에 있는 파일을 먼저 틀고, 없는 줄만 예전 목소리(Supabase)를 쓴다.

⚠ 원본 녹음은 저장소에 넣지 않는다(공개 저장소 — 누구나 목소리를 복제할 수 있게 된다). 원장 PC 에서만 읽는다.

쓰는 법 (원장 PC: scripts\\local\\omnivoice-docssam.cmd 더블클릭 또는 녹음 파일을 그 위에 끌어다 놓기)
  python scripts/omnivoice-docssam.py --ref <녹음파일> [--only id,id] [--force]
"""
import argparse, base64, glob, hashlib, json, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SL = os.path.join(ROOT, "science-lab")
OUT = os.path.join(SL, "audio", "docssam")
VOICE = "docssam-clone-v1"          # 목소리를 다시 뽑으면 v2 로 올린다 → 파일 이름이 바뀌어 전부 새로 만든다
SR = 24000


def ffmpeg_exe():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return "ffmpeg"


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit("ffmpeg 실패:\n" + r.stderr[-1500:])


def prep_ref(src, dst):
    """녹음 → 참조 음성. 긴 쉼을 0.25초로 줄이고, 소리를 키우고(-20 LUFS), 앞 10초만."""
    run([ffmpeg_exe(), "-y", "-i", src, "-vn", "-ac", "1", "-ar", str(SR),
         "-af", "highpass=f=70,silenceremove=start_periods=1:start_threshold=-50dB:stop_periods=-1:stop_duration=0.25:stop_threshold=-50dB,"
                "loudnorm=I=-20:TP=-2:LRA=11",
         "-t", "10", dst])
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


def to_mp3(wav, mp3):
    run([ffmpeg_exe(), "-y", "-i", wav, "-af", "loudnorm=I=-18:TP=-1.5:LRA=11", "-ac", "1", "-ar", "24000",
         "-c:a", "libmp3lame", "-b:a", "64k", mp3])


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
<h1>독쌤 목소리 — 들어 보기</h1><p class="lede">맨 위가 원장님 녹음, 아래가 그 목소리로 만든 독쌤 대사입니다. 같은 사람으로 들리면 이 폴더를 올리면 됩니다.</p>
{ref}{items}</html>"""
    open(path, "w", encoding="utf-8").write(html)
    return path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True, help="원장님 녹음(mp4/m4a/mp3/wav)")
    ap.add_argument("--only", default="", help="이 id 들만(쉼표)")
    ap.add_argument("--force", action="store_true", help="이미 있어도 다시 만든다")
    ap.add_argument("--device", default="auto")
    ap.add_argument("--model", default="k2-fsa/OmniVoice")
    a = ap.parse_args()
    if not os.path.exists(a.ref):
        sys.exit(f"녹음 파일을 찾지 못했습니다: {a.ref}")
    os.makedirs(OUT, exist_ok=True)
    work = os.path.join(ROOT, ".docssam-work"); os.makedirs(work, exist_ok=True)   # .gitignore 대상(참조 음성은 올리지 않는다)
    ref_wav = prep_ref(a.ref, os.path.join(work, "docssam-ref.wav"))
    only = set(x for x in a.only.split(",") if x)
    todo = [(i, t) for i, t in lines() if (not only or i in only) and (a.force or not os.path.exists(os.path.join(OUT, fname(i, t))))]
    print(f"독쌤 대사 {len(lines())}줄 중 만들 것 {len(todo)}줄", flush=True)

    made = []
    if todo:
        import torch, soundfile as sf
        dev = a.device
        if dev == "auto":
            dev = "cuda:0" if torch.cuda.is_available() else "cpu"
        print(("🎮 GPU: " + torch.cuda.get_device_name(0)) if dev.startswith("cuda") else "🖥  GPU 없음 — CPU 라 느립니다", flush=True)
        from omnivoice import OmniVoice
        model = OmniVoice.from_pretrained(a.model, device_map=dev, dtype=torch.float16 if dev.startswith("cuda") else torch.float32)
        t0 = time.time()
        for n, (lid, text) in enumerate(todo, 1):
            t = time.time()
            try:
                y = model.generate(text=text, ref_audio=ref_wav)[0]
            except Exception as e:
                print(f"  ✗ {lid}: {e}", flush=True); continue
            wav = os.path.join(work, f"{lid}.wav"); sf.write(wav, y, SR)
            mp3 = os.path.join(OUT, fname(lid, text)); to_mp3(wav, mp3)
            made.append((lid, text, mp3))
            print(f"  ✓ [{n}/{len(todo)}] {lid}  {len(y)/SR:.1f}초 / {time.time()-t:.0f}초", flush=True)
        print(f"만든 음성 {len(made)}개 · {time.time()-t0:.0f}초", flush=True)

    # 있는 파일 목록 — 사이트가 이 목록에 있는 줄만 새 목소리로 튼다(없는 파일을 두드리지 않게)
    have = sorted(f for f in os.listdir(OUT) if f.endswith(".mp3"))
    json.dump({"voice": VOICE, "files": have}, open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"manifest.json: {len(have)}개", flush=True)
    sample = made or [(i, t, os.path.join(OUT, fname(i, t))) for i, t in lines()[:12] if os.path.exists(os.path.join(OUT, fname(i, t)))]
    page = listen_page(ref_wav, sample, os.path.join(work, "듣기.html"))
    print(f"\n듣기 페이지: {page}")


if __name__ == "__main__":
    main()
