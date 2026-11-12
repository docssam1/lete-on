#!/usr/bin/env python3
"""
레이키즈(sm/) 독쌤 대사 모으기 — OmniVoice 독쌤 목소리로 만들 줄 목록.

  1) 코드의 고정 대사: guide.say/praise/encourage/think("…") 와 say:/wrongSay:/praise:/hint: "…" 글.
     ${…}가 들어간 글(아이마다 달라지는 말)은 미리 만들 수 없어 기기 음성으로 남는다 — 개수만 알려 준다.
  2) 교재 지문: sm/data/a1-3.local.json 의 text·text2·bubbles·rules(원장 2026-11-12 「지문도 복제 목소리」).
     지문 글 목록은 공개 저장소에 두지 않는다 → sm/data/voice-book.local.json (gitignore: sm/data/*.local.json)

결과
  sm/data/voice/sm.voice.json        {"lines":[{"id","text"}]}   코드 대사(공개 — 화면 코드에 이미 있는 글)
  sm/data/voice-book.local.json      {"lines":[{"id","text"}]}   지문(비공개)
파일 이름 규칙(사이트와 같음): sm-<sha1("sm-docssam-v1|"+글) 앞 12자>.mp3 → sm/audio/docssam/

쓰는 법: python3 scripts/sm-voice-lines.py
"""
import glob, hashlib, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SM = os.path.join(ROOT, "sm")
TAG = "sm-docssam-v1"

CALL = re.compile(r"guide\.(?:say|praise|encourage|think)\(\s*(\"(?:[^\"\\]|\\.)*\"|`[^`]*`|'(?:[^'\\]|\\.)*')")
KEY = re.compile(r"\b(?:say|wrongSay|praise|hint)\s*:\s*(\"(?:[^\"\\]|\\.)*\"|`[^`]*`)")


def unquote(lit):
    q, body = lit[0], lit[1:-1]
    if q == "`":
        return None if "${" in body else body
    return json.loads('"' + body.replace("\\'", "'").replace('"', '\\"') + '"') if q == "'" else json.loads(lit)


def key(text):
    return "sm-" + hashlib.sha1(f"{TAG}|{text}".encode("utf-8")).hexdigest()[:12]


def main():
    code, dynamic = [], 0
    for f in sorted(glob.glob(os.path.join(SM, "js", "**", "*.js"), recursive=True)):
        src = open(f, encoding="utf-8").read()
        for rx in (CALL, KEY):
            for m in rx.finditer(src):
                t = unquote(m.group(1))
                if t is None:
                    dynamic += 1
                elif re.search(r"[가-힣]", t):
                    code.append(t)
    book = []
    p = os.path.join(SM, "data", "a1-3.local.json")
    if os.path.exists(p):
        for no, e in sorted(json.load(open(p, encoding="utf-8"))["pages"].items(), key=lambda kv: int(kv[0])):
            # 지문(text·text2)과 화면에서 독쌤이 읽는 말풍선·규칙(4단원부터 읽음)
            for t in [e.get("text"), e.get("text2"), *(e.get("bubbles") or []), *(e.get("rules") or [])]:
                if t:
                    book.append(t)
    def pack(texts):
        seen, out = set(), []
        for t in texts:
            if t not in seen:
                seen.add(t); out.append({"id": key(t), "text": t})
        return {"tag": TAG, "lines": out}
    os.makedirs(os.path.join(SM, "data", "voice"), exist_ok=True)
    a, b = pack(code), pack([t for t in book if t not in set(code)])
    json.dump(a, open(os.path.join(SM, "data", "voice", "sm.voice.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(b, open(os.path.join(SM, "data", "voice-book.local.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"코드 대사 {len(a['lines'])}줄 · 지문 {len(b['lines'])}줄 · 미리 못 만드는 말(${{…}}) {dynamic}곳")


if __name__ == "__main__":
    main()
