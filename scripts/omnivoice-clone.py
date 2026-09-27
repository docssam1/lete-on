#!/usr/bin/env python3
"""
OmniVoice 목소리 복제 — 지금 쓰는 우리 목소리를 그대로 이어 간다

원장 지시(2026-09-21): **"그냥 우리 나온 목소리 복제해."**
이유가 분명하다 — 아이들이 이미 아는 누미 목소리가 바뀌면 안 된다. 목소리 설계
(instruct)는 공식 문서가 "중국어·영어로만 학습됐다"고 못 박아 한국어에서 불안정하고,
설령 잘 나와도 **지금과 다른 목소리**가 된다. 복제는 그 둘을 한 번에 푼다.

⚠ 짚고 넘어간 것: TTS 업체가 만들어 준 음성을 복제해 자체 음성을 만드는 것은 일반적으로
   약관이 다루는 영역이고, 그 목소리들은 실제 성우를 계약해 만든 것이다. 구글 약관의 해당
   조항은 이 세션에서 확인하지 못했다(약관 페이지가 자바스크립트로 그려진다). 원장이
   위험을 알고 진행하기로 했다.

하는 일
---------------------------------------------------------------------------
1) `number_magic/data/tts-map.js` 에서 **언어마다 참조로 쓸 대사 한 줄**을 고른다.
   문서 권장이 3~10초라 그 길이에 맞는 줄을 고르고, 실제로 받아서 길이를 재 확인한다.
2) 그 MP3 를 공개 URL 에서 받아 24 kHz 모노 wav 로 만든다(참조 음성).
   **전사(ref_text)는 지어내지 않는다** — 우리가 합성에 쓴 바로 그 문장을 그대로 쓴다.
   자동 전사(Whisper)를 쓰면 여기서 오차가 생긴다.
3) 그 참조로 앱 대사를 다시 읽혀 `clone/` 에 담는다. 언어마다 제 목소리를 쓴다.

ffmpeg 이 없어도 된다 — omnivoice 가 이미 의존하는 librosa 로 mp3 를 읽는다.

쓰는 법 (원장 PC: scripts\\local\\omnivoice-clone.cmd 더블클릭)
  python scripts/omnivoice-clone.py --out clone
  python scripts/omnivoice-clone.py --out clone --refs-only     # 참조 음성만 뽑아 보기
"""
import argparse, json, os, re, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TTS_MAP = os.path.join(ROOT, "number_magic", "data", "tts-map.js")

# 지금 쓰는 목소리 — 참조를 뽑을 때 무엇을 복제하는지 로그에 남기려고 적어 둔다.
VOICE_OF = {"ko": "ko-KR-Neural2-C", "en": "en-US-Neural2-F", "zh": "cmn-CN-Wavenet-A"}
LANG_NAME = {"ko": "한국어", "en": "English", "zh": "中文"}

# 시청용 대사. 앱에 실제로 있는 것만 쓴다 — 지어낸 문장으로는 지금 음성과 비교가 안 된다.
LINES = [
    ("ko", "numi-01", "누미랑 같이 세어 보자! 톡톡 누르면서 하나, 둘, 셋!"),
    ("ko", "numi-02", "자, 더해서 10이 되는 수를 말할 거야. 내가 3 하면, 짝꿍 7을 눌러줘. 준비됐지?"),
    ("ko", "numi-03", "완벽해! 이제 넌 10 묶기 마법사야"),
    ("en", "en-01",   "Now let's practise halving! I'll show a number — tap its half. Ready?"),
    ("zh", "zh-01",   "现在来练习减半！我给你看一个数，你按出它的一半。准备好了吗？"),
]

def load_map():
    """tts-map.js 는 `window.NM_TTS_MAP = { … };` 한 줄짜리 대입문이라 JSON 으로 읽힌다."""
    src = open(TTS_MAP, encoding="utf-8").read()
    m = re.search(r"window\.NM_TTS_MAP\s*=\s*(\{.*\})\s*;", src, re.S)
    if not m:
        sys.exit(f"tts-map.js 를 읽지 못했습니다: {TTS_MAP}")
    return json.loads(m.group(1))

def pick_ref(entries, lang, want=(3.0, 10.0)):
    """길이가 맞는 줄을 고른다. 글자 수로 후보를 추린 뒤 **실제로 받아서 재 본다** —
       한국어·중국어·영어는 글자당 길이가 달라 글자 수만으로는 맞출 수 없다."""
    import librosa
    # 글자 수 기준 후보(한/중은 글자당 ~0.18초, 영문은 ~0.06초로 어림)
    per = 0.18 if lang in ("ko", "zh") else 0.06
    cands = sorted(entries.items(), key=lambda kv: abs(len(kv[0]) * per - 6.5))
    for text, url in cands[:8]:
        try:
            raw = urllib.request.urlopen(url, timeout=60).read()
        except Exception as e:
            print(f"    받기 실패({e}) — 다음 후보", flush=True)
            continue
        tmp = os.path.join(ROOT, f".ref-tmp-{lang}.mp3")
        open(tmp, "wb").write(raw)
        try:
            y, sr = librosa.load(tmp, sr=24000, mono=True)
        finally:
            os.remove(tmp)
        dur = len(y) / sr
        if want[0] <= dur <= want[1]:
            return text, url, y, sr, dur
        print(f"    {dur:.1f}초 — 3~10초가 아니라 건너뜀", flush=True)
    return None

def build_refs(langs, ref_dir):
    import soundfile as sf
    os.makedirs(ref_dir, exist_ok=True)
    M = load_map()
    refs = {}
    for lang in langs:
        wav = os.path.join(ref_dir, f"{lang}.wav")
        txt = os.path.join(ref_dir, f"{lang}.txt")
        if os.path.exists(wav) and os.path.exists(txt):
            refs[lang] = (wav, open(txt, encoding="utf-8").read().strip())
            print(f"  · {lang}: 이미 있는 참조를 씁니다 ({wav})", flush=True)
            continue
        entries = M.get(lang) or {}
        if not entries:
            print(f"  · {lang}: tts-map 에 없음 — 건너뜁니다", flush=True)
            continue
        print(f"  · {lang}: 참조 고르는 중 (복제 대상 {VOICE_OF.get(lang,'?')})", flush=True)
        got = pick_ref(entries, lang)
        if not got:
            print(f"  · {lang}: 3~10초짜리를 못 찾았습니다 — 건너뜁니다", flush=True)
            continue
        text, url, y, sr, dur = got
        sf.write(wav, y, sr)
        open(txt, "w", encoding="utf-8").write(text)
        refs[lang] = (wav, text)
        print(f"  ✓ {lang}: {dur:.1f}초 · \"{text[:30]}…\"", flush=True)
    return refs



def upload_results(files, tag):
    """결과를 Supabase 공개 버킷에 올리고 **바로 눌러 들을 수 있는 주소**를 찍는다.

    왜 필요한가 (2026-09-21, 원장: "2번을 네가 여기 올려줘"):
      Claude 세션은 huggingface·supabase 가 게이트웨이에서 막혀 있고 GPU 도 없어
      **복제 음성을 만들 수가 없다.** 반면 GitHub Actions 러너는 막히지 않는다.
      그래서 러너가 만들고, 여기서 올려, 원장은 **휴대폰에서 주소만 누르면** 된다.
      원격 데스크톱의 소리 설정도, 파일 옮기기도 필요 없어진다.

    올리는 자리는 `_audition/<시각>/` — 앱이 쓰는 경로와 완전히 분리된 임시 자리다.
    듣고 나면 지워도 앱에 아무 영향이 없다.
    """
    import urllib.request, subprocess, shutil
    base = os.environ.get("SUPABASE_URL", "https://fgahqumaldheqettmvqg.supabase.co")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not key:
        print("  (SUPABASE_SERVICE_ROLE_KEY 가 없어 올리지 않습니다 — 파일로만 받으세요)")
        return []

    urls = []
    for f in files:
        name = os.path.basename(f)
        # wav 는 이 버킷이 안 받는다(2026-09-21 실측: 8개 전부 400). 기존 스크립트가 전부
        # audio/mpeg 를 쓰고 share-reader 는 JSON 조차 mpeg 로 올린다는 주석이 단서였다.
        # 그래서 mp3 로 바꿔 올린다. ffmpeg 가 없으면 그 파일만 건너뛴다(다른 건 올라간다).
        send, ctype = f, "audio/mpeg"
        if f.lower().endswith(".wav"):
            mp3 = f[:-4] + ".mp3"
            if shutil.which("ffmpeg"):
                try:
                    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", f,
                                    "-codec:a", "libmp3lame", "-b:a", "96k", mp3], check=True)
                    send = mp3
                except Exception as e:
                    print(f"  ✗ mp3 변환 실패 {name}: {e}", flush=True); continue
            else:
                print(f"  ✗ ffmpeg 가 없어 {name} 을 올리지 못합니다", flush=True); continue
        sname = os.path.basename(send)
        path = f"_audition/{tag}/{sname}"
        req = urllib.request.Request(
            f"{base}/storage/v1/object/audio/{path}", data=open(send, "rb").read(), method="POST",
            headers={"Authorization": f"Bearer {key}", "apikey": key,
                     "Content-Type": ctype, "x-upsert": "true"})
        try:
            urllib.request.urlopen(req, timeout=180).read()
        except Exception as e:
            # 본문을 같이 찍는다 — 지난번엔 "400 Bad Request" 만 나와서 원인을 추측해야 했다
            body = ""
            try: body = " · " + e.read().decode("utf-8", "replace")[:200]
            except Exception: pass
            print(f"  ✗ 올리기 실패 {sname}: {e}{body}", flush=True)
            continue
        urls.append(f"{base}/storage/v1/object/public/audio/{path}")
    return urls

def write_listen_page(out_dir, rows, path):
    """듣기 페이지 한 장 — 원격 데스크톱으로는 소리가 안 넘어오는 일이 많다(2026-09-21,
       원장: "원격이라 소리를 어떻게 들어"). 원격 프로그램의 오디오 전송 설정이 막혀
       있으면 PC 에서 아무리 만들어도 들을 수가 없다.

       그래서 **파일 하나에 소리를 다 넣는다.** wav 를 base64 로 박아 넣으므로 이 html
       한 장만 메일·메신저·USB 무엇으로든 옮기면 휴대폰에서도 그냥 열려서 재생된다.
       서버도, 인터넷도, 같은 폴더의 다른 파일도 필요 없다."""
    import base64
    def b64(f):
        return base64.b64encode(open(f, "rb").read()).decode("ascii")
    cards = []
    for lang, voice, ref_wav, ref_text, clips in rows:
        items = "".join(
            f'<div class="clip"><b>{lid}</b><audio controls preload="none" '
            f'src="data:audio/wav;base64,{b64(f)}"></audio><p>{txt}</p></div>'
            for lid, txt, f in clips)
        cards.append(f"""<section>
  <h2>{LANG_NAME.get(lang, lang)} <small>복제 대상: {voice}</small></h2>
  <div class="row">
    <div class="clip orig"><b>원본(지금 쓰는 목소리)</b>
      <audio controls preload="none" src="data:audio/wav;base64,{b64(ref_wav)}"></audio>
      <p>{ref_text}</p></div>
  </div>
  <div class="row">{items}</div>
</section>""")
    html = """<!doctype html><html lang="ko"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>목소리 복제 듣기</title>
<style>
 body{font:15px/1.7 system-ui,-apple-system,"Malgun Gothic",sans-serif;
   background:#fdfaf3;color:#1A2233;margin:0;padding:20px 16px;max-width:760px;margin:0 auto}
 h1{font-size:20px;color:#0E2C57;margin:0 0 4px}
 .lede{color:#4a5468;font-size:13.5px;margin:0 0 20px}
 section{border:1px solid #e0d6bd;border-radius:14px;background:#fff;padding:14px 16px;margin-bottom:16px}
 h2{font-size:16px;color:#0E2C57;margin:0 0 10px}
 h2 small{font-weight:400;color:#8a6d46;font-size:12px;margin-left:6px}
 .row{display:grid;gap:10px;margin-bottom:10px}
 @media(min-width:620px){.row{grid-template-columns:1fr 1fr}}
 .clip{border:1px solid #eee7d8;border-radius:10px;padding:10px 12px;background:#fdfaf3}
 .clip.orig{background:#FBF6E8;border-color:#E4D9BC}
 .clip b{display:block;font-size:13px;color:#0E2C57;margin-bottom:6px}
 audio{width:100%}
 .clip p{margin:7px 0 0;font-size:12.5px;color:#4a5468;word-break:keep-all}
 .tip{font-size:12.5px;color:#4a5468;background:#fff;border:1px dashed #e0d6bd;
   border-radius:10px;padding:12px 14px}
</style>
<h1>목소리 복제 — 들어 보기</h1>
<p class="lede">위가 <b>원본</b>(지금 아이들이 듣는 목소리), 아래가 <b>복제본</b>입니다.
번갈아 눌러서 같은 사람 목소리로 들리면 성공입니다.</p>
""" + "\n".join(cards) + """
<p class="tip">이 파일 한 장에 소리가 전부 들어 있습니다. 메일·메신저·USB 무엇으로든
옮기면 휴대폰에서도 그냥 열립니다 — 인터넷도, 다른 파일도 필요 없습니다.</p>
</html>"""
    open(path, "w", encoding="utf-8").write(html)
    return path

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="clone")
    ap.add_argument("--ref-dir", default="clone-ref")
    ap.add_argument("--refs-only", action="store_true", help="참조 음성만 뽑고 끝낸다")
    ap.add_argument("--device", default="auto")
    ap.add_argument("--model", default="k2-fsa/OmniVoice")
    ap.add_argument("--upload", action="store_true",
                    help="결과를 Supabase 공개 버킷 _audition/ 에 올리고 주소를 찍는다")
    ap.add_argument("--tag", default="", help="올릴 폴더 이름(비우면 시각)")
    a = ap.parse_args()

    langs = sorted({l for l, _, _ in LINES})
    print("참조 음성 준비 — 지금 쓰는 우리 목소리에서 뽑습니다")
    refs = build_refs(langs, a.ref_dir)
    if not refs:
        sys.exit("참조 음성을 하나도 못 만들었습니다. 인터넷 연결과 tts-map.js 를 확인하세요.")
    if a.refs_only:
        print(f"\n참조만 만들었습니다: {os.path.abspath(a.ref_dir)}")
        return

    import torch
    dev = a.device
    if dev == "auto":
        dev = "cuda:0" if torch.cuda.is_available() else "cpu"
    if dev.startswith("cuda"):
        p = torch.cuda.get_device_properties(0)
        print(f"\n🎮 GPU: {p.name} · VRAM {p.total_memory/1024**3:.1f} GB", flush=True)
    else:
        print("\n🖥  GPU 를 못 찾았습니다 — CPU 로 돌면 많이 느립니다", flush=True)

    from omnivoice import OmniVoice
    import soundfile as sf
    dtype = torch.float16 if dev.startswith("cuda") else torch.float32
    t0 = time.time()
    print(f"모델 준비 중… ({a.model})", flush=True)
    model = OmniVoice.from_pretrained(a.model, device_map=dev, dtype=dtype)
    print(f"준비 {time.time()-t0:.0f}초\n", flush=True)

    os.makedirs(a.out, exist_ok=True)
    total = 0.0
    made = {}
    for lang, lid, text in LINES:
        if lang not in refs:
            continue
        ref_wav, ref_text = refs[lang]
        t = time.time()
        try:
            audio = model.generate(text=text, ref_audio=ref_wav, ref_text=ref_text)
        except Exception as e:      # 한 줄이 실패해도 나머지는 들어 봐야 한다
            print(f"  ✗ {lid}: {e}", flush=True)
            continue
        y = audio[0]
        secs = len(y) / 24000.0
        total += secs
        f = os.path.join(a.out, f"clone-{lid}.wav")
        sf.write(f, y, 24000)
        made.setdefault(lang, []).append((lid, text, f))
        took = time.time() - t
        print(f"  ✓ {lid} ({lang})  {secs:.1f}초 음성 / {took:.0f}초 걸림 · RTF {took/max(secs,0.01):.2f}",
              flush=True)

    # 듣기 페이지 — 원격 데스크톱으로 소리가 안 넘어와도 이 파일 하나만 옮기면 들린다
    page = ""
    if made:
        rows = [(lang, VOICE_OF.get(lang, "?"), refs[lang][0], refs[lang][1], made[lang])
                for lang in sorted(made)]
        page = write_listen_page(a.out, rows, os.path.join(a.out, "듣기.html"))

    print(f"\n합계 음성 {total:.0f}초 · 전체 {time.time()-t0:.0f}초 · 장치 {dev}")
    print(f"결과: {os.path.abspath(a.out)}")
    if page:
        print("")
        print("  ┌─ 원격이라 소리가 안 들릴 때 ─────────────────────────────")
        print(f"  │  {os.path.abspath(page)}")
        print("  │  이 파일 한 장에 소리가 전부 들어 있습니다.")
        print("  │  메일·메신저·USB 무엇으로든 옮기면 휴대폰에서도 그냥 열립니다.")
        print("  └──────────────────────────────────────────────────────────")
    print("RTF 는 '음성 1초를 만드는 데 몇 초 걸렸나'. 1 보다 작으면 실시간보다 빠릅니다.")

    if a.upload and made:
        tag = a.tag or time.strftime("%Y%m%d-%H%M")
        # 원본(참조)도 같이 올린다 — 복제본만 들으면 같은지 아닌지 판단할 수가 없다
        files = [refs[l][0] for l in sorted(made)] + [f for l in sorted(made) for _, _, f in made[l]]
        print("\n올리는 중…", flush=True)
        urls = upload_results(files, tag)
        if urls:
            print("\n===== 들어 보실 주소 (휴대폰에서 그냥 눌러도 재생됩니다) =====")
            for u in urls:
                print("  " + u)
            print("============================================================")
            print(f"다 들으신 뒤에는 audio/_audition/{tag}/ 를 지우셔도 앱에 아무 영향이 없습니다.")

if __name__ == "__main__":
    sys.exit(main())
