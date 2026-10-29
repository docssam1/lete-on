#!/usr/bin/env python3
"""Contact-variable enumeration independent of the generator's reverse steps."""
from collections import Counter
from itertools import permutations, product
from math import prod

# Directions: right, left, back, front, up, down. A-B-C-D-E path,
# C is elbow, top C=2, external right E=2, requested A front.
states = [p for p in permutations(range(1,7))
          if p[0]+p[1] == p[2]+p[3] == p[4]+p[5] == 7]
assert len(states) == 48
edges = [(0,2,1,3), (1,2,2,3), (2,0,3,1), (3,0,4,1)]
counts, feasible = Counter(), []
for left_faces in product(range(1,7), repeat=4):
    required = [[] for _ in range(5)]
    required[2].append((4,2))
    required[4].append((0,2))
    for (a,fa,b,fb), value in zip(edges,left_faces):
        required[a].append((fa,value))
        required[b].append((fb,8-value))
    pools = [[p for p in states if all(p[axis] == v for axis,v in req)] for req in required]
    if not all(pools):
        continue
    feasible.append(left_faces)
    other_count = prod(map(len,pools[1:]))
    for face in pools[0]:
        counts[face[3]] += other_count
assert counts == {4:4096}, counts
print("PASS: legal contact tuples", feasible, "; answer distribution", dict(counts))
print("LIMIT: source layout and marked face readings are inputs; publisher key not verified.")
