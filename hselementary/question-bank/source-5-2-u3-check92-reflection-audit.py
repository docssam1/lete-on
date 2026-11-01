#!/usr/bin/env python3
"""Independently check selected page 92 reflection calculations."""

import json
from pathlib import Path

inventory = json.loads((Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json").read_text())
review = next(item for item in inventory["additionalSourceReviews"] if item["sourcePrintedPage"] == 92)
assert review["publisherAnswerVerified"] is False
assert review["runtimeConnection"] == "not-connected"
assert {item["number"] for item in review["items"]} == {58, 60, 61, 63}

# 60: independent polygon area, doubled by reflection across the y axis.
points = [(0, 0), (-18, 0), (-18, 6), (-25, 6), (-18, 18), (0, 23)]
twice_area = abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(points, points[1:] + points[:1])))
assert twice_area == 822  # This is the reflected total area.

# 61: orientation of an asymmetric point in the card after each reflection.
x, y = 1, 2
orientations = []
for direction in "HVHVH":
    if direction == "H":
        y = -y
    else:
        x = -x
    orientations.append((x, y))
assert [i + 1 for i, point in enumerate(orientations) if point == (1, 2)] == [4]

# 63: reflect an interval at x=6, then x=35; compare the outside squares.
first = (-10, 0)
reflect = lambda interval, axis: (2 * axis - interval[1], 2 * axis - interval[0])
middle = reflect(first, 6)
last = reflect(middle, 35)
assert middle == (12, 22) and last == (48, 58)
assert (first[1] + last[0]) / 2 - first[1] == 24
print("Page 92 selected reflection checks passed; publisher key remains unverified.")
