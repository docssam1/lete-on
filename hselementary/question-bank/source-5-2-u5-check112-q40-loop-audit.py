#!/usr/bin/env python3
"""Check a conditional midpoint reconstruction of the p.112 net's connections.

Coordinates are doubled: 0 and 2 are cube boundaries, 1 is an assumed
edge midpoint. The source drawing does not state exact midpoint ratios.
"""
from collections import Counter

points = [
    (1, 2, 2),  # front/top edge
    (2, 1, 2),  # right/top edge
    (2, 0, 1),  # right/back edge
    (1, 0, 0),  # back/bottom edge
    (0, 1, 0),  # left/bottom edge
    (0, 2, 1),  # left/front edge
]
expected_faces = [(2, 2), (0, 2), (1, 0), (2, 0), (0, 0), (1, 2)]
assert len(set(points)) == 6
assert all(sum(c in (0, 2) for c in p) == 2 for p in points)
degrees = Counter()
for i, start in enumerate(points):
    end = points[(i+1) % len(points)]
    shared = [(axis, start[axis]) for axis in range(3)
              if start[axis] == end[axis] and start[axis] in (0, 2)]
    assert shared == [expected_faces[i]], (start, end, shared)
    degrees[start] += 1
    degrees[end] += 1
assert len(set(expected_faces)) == 6
assert set(degrees.values()) == {2}
print("PASS: conditional midpoint reconstruction forms one six-face closed loop")
print("LIMIT: midpoint ratios and publisher answer are not verified by this model")
