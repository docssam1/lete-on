#!/usr/bin/env python3
"""Construct and independently verify a packing of 66 boxes on printed p.108."""
from itertools import combinations

container = (25, 20, 16)
placements = []
# Four by four objects: footprint 6x5, height 4.
for x in range(4):
    for y in range(4):
        placements.append((6*x, 5*y, 0, 6, 5, 4))
# Two layers of five by five: footprint 5x4, height 6.
for z in (4, 10):
    for x in range(5):
        for y in range(5):
            placements.append((5*x, 4*y, z, 5, 4, 6))
assert len(placements) == 66
for x,y,z,a,b,c in placements:
    assert sorted((a,b,c)) == [4,5,6]
    assert 0 <= x and x+a <= container[0]
    assert 0 <= y and y+b <= container[1]
    assert 0 <= z and z+c <= container[2]
for p,q in combinations(placements,2):
    assert any(p[i]+p[i+3] <= q[i] or q[i]+q[i+3] <= p[i] for i in range(3)), (p,q)
volume = container[0]*container[1]*container[2]
object_volume = 4*5*6
assert volume // object_volume == len(placements)
assert 67*object_volume > volume
print("PASS: 66 valid, pairwise non-overlapping placements; volume excludes 67")
