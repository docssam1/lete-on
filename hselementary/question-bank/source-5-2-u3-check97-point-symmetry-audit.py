#!/usr/bin/env python3
"""Check the perimeter and triangle intersection on printed page 97."""
import json
from fractions import Fraction
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 97)
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
assert {i["number"] for i in review["items"]} == {96, 99, 100, 101}
assert 2 * (12 + 9 + 15) - 2 * (2 * 4) == 56

# Clip the line-reflected triangle by the point-reflected triangle.
subject = [(0, -2), (3, 1), (-2, 2)]
clipper = [(-2, -2), (3, -1), (0, 2)]  # counterclockwise

def side(a, b, p):
    return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])

for a, b in zip(clipper, clipper[1:] + clipper[:1]):
    result = []
    for p, q in zip(subject, subject[1:] + subject[:1]):
        cp, cq = side(a, b, p), side(a, b, q)
        if cp >= 0:
            result.append(p)
        if (cp < 0 < cq) or (cq < 0 < cp):
            t = Fraction(cp, cp - cq)
            result.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    subject = result
assert len(subject) == len(set(subject)) == 6
print("Page 97 perimeter and six-vertex intersection passed; publisher answer remains unverified.")
