#!/usr/bin/env python3
"""독쌤 복제 음성이 빠진 대사를 찾는다 — 표준 라이브러리만(모델·GPU 불필요).

    python scripts/check-docssam-voice.py        # 빠진 줄 목록, 하나라도 있으면 exit 1

공부 대사(science-lab/data/voice/*.voice.json + fields-classic/question-bank/data/voice/*.voice.json 손글씨 판서)는 느린 목소리(docssam-clone-v2-slow),
소개 대사(science-lab/intro/narration.json)는 원래 빠르기(docssam-clone-v1)로 있어야 한다.
파일 이름 규칙은 scripts/omnivoice-docssam.py 의 fname() 과 같다: <id>-<sha1("<목소리>|<글>")[:10]>.mp3
"""
import glob, hashlib, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SL = os.path.join(ROOT, "science-lab")
# 파일 이름은 생성기의 fname() 그대로 쓴다(고유어 수 읽기로 바뀐 줄은 docssam-clone-v3-slow 이름 — 생성기 주석 참고).
import importlib.util
_spec = importlib.util.spec_from_file_location("omnivoice_docssam", os.path.join(ROOT, "scripts", "omnivoice-docssam.py"))
_gen = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(_gen)
V1, SLOW = _gen.V1, _gen.SLOW
have = {os.path.basename(p) for p in glob.glob(os.path.join(SL, "audio", "docssam", "*.mp3"))}
name = _gen.fname

miss = []
for f in sorted(glob.glob(os.path.join(SL, "data", "voice", "*.voice.json")) + glob.glob(os.path.join(ROOT, "fields-classic", "question-bank", "data", "voice", "*.voice.json"))):
    for l in json.load(open(f, encoding="utf-8")).get("lines", []):
        if name(l["id"], l["text"], SLOW) not in have:
            miss.append((os.path.basename(f), l["id"], l["text"]))
nar = os.path.join(SL, "intro", "narration.json")
if os.path.exists(nar):
    for l in json.load(open(nar, encoding="utf-8")).get("lines", []):
        if name(l["id"], l["text"], V1) not in have:
            miss.append(("intro/narration.json", l["id"], l["text"]))

for f, i, t in miss:
    print(f"{f}\t{i}\t{t}")
print(f"빠진 독쌤 음성: {len(miss)}줄", file=sys.stderr)
sys.exit(1 if miss else 0)
