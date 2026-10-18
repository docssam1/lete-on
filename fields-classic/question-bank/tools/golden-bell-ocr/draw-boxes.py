"""OCR 낱말 상자를 쪽 그림 위에 그린다(확인용). 신뢰도 0.8 미만은 빨강, 나머지는 옅은 파랑.
사용: python3 -I draw-boxes.py <쪽 그림 폴더> <OCR 결과 폴더> [pNN,…]  → <결과>/pNN-boxes.png
원본 그림이 들어 있으므로 결과는 저장소 밖에만 둔다.
"""
import json, os, sys
from PIL import Image, ImageDraw

pages, out = sys.argv[1], sys.argv[2]
only = set(sys.argv[3].split(",")) if len(sys.argv) > 3 else None
for f in sorted(os.listdir(out)):
    if not f.endswith(".words.json"):
        continue
    name = f[: -len(".words.json")]
    if only and name not in only:
        continue
    src = next((os.path.join(pages, name + e) for e in (".png", ".jpg", ".jpeg") if os.path.exists(os.path.join(pages, name + e))), None)
    if not src:
        continue
    img = Image.open(src).convert("RGB")
    d = ImageDraw.Draw(img)
    for w in json.load(open(os.path.join(out, f), encoding="utf-8")):
        low = w["conf"] is not None and w["conf"] < 0.8
        d.rectangle(w["box"], outline=(220, 30, 30) if low else (90, 140, 230), width=3 if low else 1)
    img.save(os.path.join(out, name + "-boxes.png"))
    print("boxes", name)
