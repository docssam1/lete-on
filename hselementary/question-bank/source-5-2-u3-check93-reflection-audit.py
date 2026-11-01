#!/usr/bin/env python3
"""Check geometry from selected printed page 93 questions."""
import json
import math
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 93)
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
assert {i["number"] for i in review["items"]} == set(range(65, 73))

# 65 and 66: direction angles after reflection in each indicated axis.
reflect_angle = lambda direction, axis: (2 * axis - direction) % 360
assert (reflect_angle(5, 30), reflect_angle(5, 90)) == (55, 175)
left = reflect_angle(260, 54)
right = reflect_angle(left, 90)
assert (left, right, (right - 260) % 360) == (208, 332, 72)

# 68: two distinct isosceles triangles with a side 18 and the given 30° angle.
first_height = 18 * math.sin(math.radians(30))
assert math.isclose(18 * first_height / 2, 81)
assert math.isclose(18 * math.sqrt(3) * first_height / 2, 81 * math.sqrt(3))

# Reflect (6,0) in a line at 30 degrees, and (3 sqrt(3),3) in the x-axis.
root3 = math.sqrt(3)
points = [(3 * root3, 3), (3, 3 * root3), (3 * root3, -3), (6, 0)]
area = abs(sum(x * v - u * y for (x, y), (u, v) in zip(points, points[1:] + points[:1]))) / 2
assert math.isclose(area, 9, abs_tol=1e-10)

# 71: a 6-8-10 triangle subtracted from a larger right triangle.
assert 6**2 + 8**2 == 10**2
assert (10 + 6) * 8 / 2 - 6 * 8 / 2 == 40

# The two equal base angles in the inner triangle equal the larger apex angle.
base = (180 + 21) / 3
apex = 180 - 2 * base
assert (base, apex, 2 * apex) == (67, 46, 92)
print("Page 93 reflection calculations passed; publisher answer remains unverified.")
