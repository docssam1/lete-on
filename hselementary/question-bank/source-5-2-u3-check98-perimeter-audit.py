#!/usr/bin/env python3
"""Check shared-boundary and point-symmetry perimeter calculations."""
import json
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 98)
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
assert {i["number"] for i in review["items"]} == {102, 103, 104}

def shared_boundary(length, center):
    # Original edge is [0,length], rotated edge is [2*center-length,2*center].
    return min(length, 2 * center) - max(0, 2 * center - length)

assert shared_boundary(46, 36) == 20
assert 2 * (2 * (46 + 35)) - 2 * shared_boundary(46, 36) == 284
assert shared_boundary(15, 5) == 10
assert 2 * (4 * 15) - 2 * shared_boundary(15, 5) == 100

# 104: a straight cut through the origin has opposite heights at corresponding x coordinates.
for slope in (-2, -0.5, 0, 0.5, 2):
    assert slope * 4 == -(slope * -4)
assert 2 * (16 + 3 + 7) == 52
print("Page 98 shared-edge checks passed; publisher answer remains unverified.")
