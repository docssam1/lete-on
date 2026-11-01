#!/usr/bin/env python3
"""Check geometry from selected printed page 93 questions."""
import json
import math
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 93)
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
assert {i["number"] for i in review["items"]} == {67, 70, 72}

# Reflect (6,0) in a line at 30 degrees, and (3 sqrt(3),3) in the x-axis.
root3 = math.sqrt(3)
points = [(3 * root3, 3), (3, 3 * root3), (3 * root3, -3), (6, 0)]
area = abs(sum(x * v - u * y for (x, y), (u, v) in zip(points, points[1:] + points[:1]))) / 2
assert math.isclose(area, 9, abs_tol=1e-10)

# The two equal base angles in the inner triangle equal the larger apex angle.
base = (180 + 21) / 3
apex = 180 - 2 * base
assert (base, apex, 2 * apex) == (67, 46, 92)
print("Page 93 reflection calculations passed; publisher answer remains unverified.")
