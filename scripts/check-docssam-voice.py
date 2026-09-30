#!/usr/bin/env python3
"""독쌤 복제 음성이 빠진 대사를 찾는다 — 표준 라이브러리만(모델·GPU 불필요).

    python scripts/check-docssam-voice.py        # 빠진 줄 목록, 하나라도 있으면 exit 1

공부 대사(science-lab/data/voice/*.voice.json)는 느린 목소리(docssam-clone-v2-slow),
소개 대사(science-lab/intro/narration.json)는 원래 빠르기(docssam-clone-v1)로 있어야 한다.
파일 이름 규칙은 scripts/omnivoice-docssam.py 의 fname() 과 같다: <id>-<sha1("<목소리>|<글>")[:10]>.mp3
"""
import glob, hashlib, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SL = os.path.join(ROOT, "science-lab")
src = open(os.path.join(ROOT, "scripts", "omnivoice-docssam.py"), encoding="utf-8").read()
V1 = re.search(r'^V1\s*=\s*"([^"]+)"', src, re.M).group(1)
SLOW = re.search(r'^SLOW\s*=\s*"([^"]+)"', src, re.M).group(1)
have = {os.path.basename(p) for p in glob.glob(os.path.join(SL, "audio", "docssam", "*.mp3"))}
name = lambda lid, text, voice: f"{lid}-{hashlib.sha1(f'{voice}|{text}'.encode('utf-8')).hexdigest()[:10]}.mp3"

miss = []
for f in sorted(glob.glob(os.path.join(SL, "data", "voice", "*.voice.json"))):
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
