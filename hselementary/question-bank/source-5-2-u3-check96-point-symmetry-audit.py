#!/usr/bin/env python3
"""Check point-symmetry correspondences on printed page 96."""
import json
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 96)
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
assert {i["number"] for i in review["items"]} == set(range(89, 95))

# 90: rotate each grid vertex 180 degrees around the marked origin.
vertices = [(-5, -3), (-3, -2), (-1, -2), (-2, -1), (-2, 1), (-5, 1), (-4, -1)]
rotated = [(-x, -y) for x, y in vertices]
assert rotated == [(5, 3), (3, 2), (1, 2), (2, 1), (2, -1), (5, -1), (4, 1)]
assert all(x + u == 0 and y + v == 0 for (x, y), (u, v) in zip(vertices, rotated))

# 91: apply the same point mapping to the three vertices of the angle.
correspondence = {"ㄱ": "ㅁ", "ㄴ": "ㅂ", "ㄷ": "ㅅ", "ㄹ": "ㅇ"}
assert "".join(correspondence[p] for p in "ㄱㄹㄷ") == "ㅁㅇㅅ"
print("Page 96 point-symmetry mapping passed; drawing and publisher answer remain unverified.")
