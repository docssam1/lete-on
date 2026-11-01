#!/usr/bin/env python3
"""Check the perimeter and triangle intersection on printed page 97."""
import json
from fractions import Fraction
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 97)
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
assert {i["number"] for i in review["items"]} == set(range(95, 102))
assert 2 * (12 + 9 + 15) - 2 * (2 * 4) == 56

def area(polygon):
    twice = abs(sum(x * v - u * y for (x, y), (u, v) in zip(polygon, polygon[1:] + polygon[:1])))
    return Fraction(twice, 2)

# 97: a completion containing all six original points and eight additional points.
p97 = [(3, 1), (2, 1), (2, 2), (1, 2), (1, 3), (2, 3), (3, 4),
       (3, 5), (4, 5), (4, 4), (5, 4), (5, 3), (4, 3), (3, 2)]
assert len(p97) == len(set(p97)) == 14 and area(p97) == 7
assert {(6 - x, 6 - y) for x, y in p97} == set(p97)

# 98: two centrally symmetric simple polygons contain the same printed bold path.
F = Fraction
ordinary = [(0, 0), (3, 0), (3, 1), (4, 1), (4, 2), (3, 2), (4, 4),
            (1, 4), (1, 3), (0, 3), (0, 2), (1, 2)]
notched = [(0, 0), (3, 0), (3, 1), (4, 1), (4, 2), (F(7, 2), 2),
           (F(7, 2), F(3, 2)), (3, F(3, 2)), (3, 2), (4, 4), (1, 4),
           (1, 3), (0, 3), (0, 2), (F(1, 2), 2), (F(1, 2), F(5, 2)),
           (1, F(5, 2)), (1, 2)]
assert area(ordinary) == 12 and area(notched) == F(23, 2)
for polygon in (ordinary, notched):
    assert {(4 - x, 4 - y) for x, y in polygon} == set(polygon)

def orient(a, b, c):
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

def on_segment(a, b, c):
    return (orient(a, b, c) == 0 and min(a[0], b[0]) <= c[0] <= max(a[0], b[0])
            and min(a[1], b[1]) <= c[1] <= max(a[1], b[1]))

def intersects(a, b, c, d):
    x, y, z, w = orient(a, b, c), orient(a, b, d), orient(c, d, a), orient(c, d, b)
    return ((x * y < 0 and z * w < 0) or on_segment(a, b, c) or on_segment(a, b, d)
            or on_segment(c, d, a) or on_segment(c, d, b))

for polygon in (ordinary, notched):
    n = len(polygon)
    for i in range(n):
        for j in range(i + 1, n):
            if j != i + 1 and (i, j) != (0, n - 1):
                assert not intersects(polygon[i], polygon[(i + 1) % n], polygon[j], polygon[(j + 1) % n])

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
