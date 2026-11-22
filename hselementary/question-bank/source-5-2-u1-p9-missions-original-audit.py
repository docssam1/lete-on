"""Independent audit for printed page 9 (PDF page 7) Missions 2-6 of 5-2 unit 1.

Source: canonical PDF page 7 (printed 9). Student handwriting on the page is ignored.
Publisher answer key is not available; every answer below is recomputed here.
Run: python3 -I source-5-2-u1-p9-missions-original-audit.py
"""
from fractions import Fraction
from itertools import product
from math import ceil, floor
import re
from pathlib import Path

# ---------------------------------------------------------------- Mission 2
# L-shaped (ㄱ자) rectilinear figure: left side 2cm 4mm = 24mm, bottom 48mm,
# notch removed at the upper right. The notch size is not given, so check that
# the perimeter does not depend on it.
W, H = 48, 24
perims = set()
for cw in range(1, W):          # horizontal width of the removed corner (mm)
    for ch in range(1, H):      # vertical height of the removed corner (mm)
        top = W - cw
        segs = [W, H, top, ch, cw, H - ch]   # bottom, left, top, step down, inner run, right
        perims.add(sum(segs))
assert perims == {144}
p_cm = Fraction(144, 10)
assert p_cm == Fraction(72, 5)              # 14.4cm
rounded = {
    "반올림": floor(p_cm + Fraction(1, 2)),
    "버림": floor(p_cm),
    "올림": ceil(p_cm),
}
assert rounded == {"반올림": 14, "버림": 14, "올림": 15}
# Only 올림 would differ; the clarification fixes 반올림 (the usual meaning of '약').
m2 = 14

# ---------------------------------------------------------------- Mission 3
# Warehouse 3m x 10m x 4m, cube boxes of side 15cm, edges parallel to walls
# (조건 보충). For axis-parallel equal cubes, every cube occupies a half-open
# cell (t, t+15] on each axis, which contains exactly one point of the grid
# {15, 30, ..., 15*floor(L/15)}; distinct cubes get distinct grid points, so
# the count is at most the product of floors, and the grid packing reaches it.
room = (300, 1000, 400)
side = 15
for L in room:
    n = L // side
    # 1D check of the half-open-cell lemma on a fine rational grid of offsets.
    for t10 in range(0, (L - side) * 10 + 1):
        t = Fraction(t10, 10)
        pts = [k * side for k in range(1, n + 1) if t < k * side <= t + side]
        assert len(pts) == 1, (L, t, pts)
counts = [L // side for L in room]
assert counts == [20, 66, 26]
m3 = counts[0] * counts[1] * counts[2]
assert m3 == 34320
volume_bound = Fraction(300 * 1000 * 400, side ** 3)
assert m3 < volume_bound  # 35555.5...: tilted packings are excluded by the clarification

# ---------------------------------------------------------------- Mission 4
students = 652
marts = {"가": (15, 9000), "나": (24, 13000)}
cost = {}
for name, (pack, price) in marts.items():
    bundles = ceil(students / pack)
    assert bundles * pack >= students and (bundles - 1) * pack < students
    cost[name] = bundles * price
assert cost == {"가": 44 * 9000, "나": 28 * 13000} == {"가": 396000, "나": 364000}
best = min(cost, key=cost.get)
assert best == "나" and sorted(cost.values())[0] < sorted(cost.values())[1]
m4 = (best, cost["가"] - cost["나"])
assert m4 == ("나", 32000)
# Without the single-store clarification, mixing stores is cheaper -> clarification needed.
mixed = min(9000 * a + 13000 * b for a in range(0, 45) for b in range(0, 29) if 15 * a + 24 * b >= students)
assert mixed == 356000 and mixed < cost["나"]

# ---------------------------------------------------------------- Mission 5
pop = {"부산광역시": 3434091, "인천광역시": 2956513, "대전광역시": 1486647}
r = {k: (v + 50000) // 100000 * 100000 for k, v in pop.items()}
assert r == {"부산광역시": 3400000, "인천광역시": 3000000, "대전광역시": 1500000}
length_cm = {k: Fraction(v, 100000) * Fraction(5, 10) for k, v in r.items()}
assert length_cm == {"부산광역시": 17, "인천광역시": 15, "대전광역시": Fraction(15, 2)}
m5 = length_cm

# ---------------------------------------------------------------- Mission 6
harvest = [4283, 3976, 4015]
total = sum(harvest)
boxes, left = divmod(total, 500)
assert (total, boxes, left) == (12274, 24, 274)
m6 = boxes * 150000
assert m6 == 3600000

# ---------------------------------------------------------------- generator file cross-check
js = Path(__file__).with_name("source-5-2-u1-p9-missions-original.js").read_text(encoding="utf-8")
expected = {
    "5-2-u1-e3-mission-2-original": "약 14cm",
    "5-2-u1-e3-mission-3-original": "34320개",
    "5-2-u1-e3-mission-4-original": "㈏ 마트, 32000원 절약",
    "5-2-u1-e3-mission-5-original": "부산광역시 17cm, 인천광역시 15cm, 대전광역시 7.5cm",
    "5-2-u1-e3-mission-6-original": "3600000원",
}
for tid, ans in expected.items():
    assert js.count(f"'{tid}'") == 1, tid
    assert f"answer:'{ans}'" in js, (tid, ans)
for key in ["Mission2", "Mission3", "Mission4", "Mission5", "Mission6"]:
    assert js.count(f"source52U1P9{key}Original") == 1, key
assert js.count("※ 조건 보충") == 3  # Missions 2, 3, 4 only
assert "publisherKeyVerified:false" in js and "publisherAnswerVerified:false" in js
assert js.count("(") == js.count(")") and js.count("{") == js.count("}") and js.count("[") == js.count("]")
assert len(re.findall(r"`", js)) % 2 == 0
for size in re.findall(r'font-size="(\d+)"', js):
    assert int(size) >= 13
print("p9 Missions 2-6: 14cm | 34320개 | ㈏ 32000원 | 17/15/7.5cm | 3600000원 — all unique; OK")
