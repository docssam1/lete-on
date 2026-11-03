#!/usr/bin/env python3
"""Independent enumeration and ray tracing for printed page 95."""
import json
import math
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 95)
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "partially-connected"
assert {i["number"] for i in review["items"]} == set(range(81, 89))

next_palindrome = next(n for n in range(75848, 100000) if str(n) == str(n)[::-1])
assert next_palindrome == 75857 and 75878 - next_palindrome == 21
three_digit = [n for n in range(100, 1000) if str(n) == str(n)[::-1]]
assert three_digit[69] == 797

# 82: polygon area in a 3x3 folded square; all four layers have equal area.
polygon = [(0, 2), (2, 1), (1, 3), (0, 3)]
twice_area = abs(sum(x * v - u * y for (x, y), (u, v) in zip(polygon, polygon[1:] + polygon[:1])))
assert twice_area == 4
from fractions import Fraction
assert Fraction(9 - twice_area // 2, 9) == Fraction(7, 9)

# 86: independent polygon and rectangle-minus-triangles area checks.
piece = [(0, 0), (3, 0), (11, 8), (5, 8), (0, 3)]
piece_twice = abs(sum(x * v - u * y for (x, y), (u, v) in zip(piece, piece[1:] + piece[:1])))
assert Fraction(piece_twice, 2) == Fraction(87, 2)
assert 11 * 8 - Fraction(8 * 8, 2) - Fraction(5 * 5, 2) == Fraction(87, 2)

# 87: enumerate pairs of parallel lines from the conditional crease model.
from itertools import combinations
F = Fraction
families = [(1, 0, [F(0), F(1, 2), F(1)]), (0, 1, [F(0), F(1, 2), F(1)]),
            (1, 1, [F(1, 2), F(1), F(3, 2)]), (1, -1, [F(-1, 2), F(0), F(1, 2)])]
counts = []
for (a, b, cs), (d, e, ds) in combinations(families, 2):
    if a * d + b * e == 0:
        continue  # perpendicular normals make rectangles
    determinant = a * e - b * d
    count = 0
    for c1, c2 in combinations(cs, 2):
        for d1, d2 in combinations(ds, 2):
            vertices = [((c * e - b * f) / determinant, (a * f - c * d) / determinant)
                        for c in (c1, c2) for f in (d1, d2)]
            count += all(0 <= x <= 1 and 0 <= y <= 1 for x, y in vertices)
    counts.append(count)
assert counts == [2, 2, 2, 2]

# Trace intersections with y=0 and y=x*tan(10°); returning to start is not a reflection.
slope = math.tan(math.radians(10))
position = (1.0, 0.0)
angle = 170.0
hits = []
for step in range(1, 17):
    dx, dy = math.cos(math.radians(angle)), math.sin(math.radians(angle))
    distance = ((slope * position[0] - position[1]) / (dy - slope * dx)
                if step % 2 else -position[1] / dy)
    assert distance > 0
    position = (position[0] + distance * dx, position[1] + distance * dy)
    hits.append(position)
    angle = ((20 - angle) if step % 2 else -angle) % 360
assert math.isclose(hits[15][0], 1, abs_tol=1e-9) and math.isclose(hits[15][1], 0, abs_tol=1e-9)
assert all(math.dist(p, (1, 0)) > 1e-6 for p in hits[:15])
assert math.dist(hits[6], hits[8]) < 1e-9
print("Page 95 enumeration and 15-reflection trace passed; publisher answer remains unverified.")
