#!/usr/bin/env python3
"""Enumerate contact triples from face assignments, independently of generator."""
from collections import Counter
from itertools import permutations, product
from math import prod

# x+, x-, y+, y-, z+, z-. Keep both mirror families: the source
# imposes opposite sums but does not require identical dice.
faces = [p for p in permutations(range(1,7))
         if p[0]+p[1] == p[2]+p[3] == p[4]+p[5] == 7]
assert len(faces) == 48
shapes = {
    "line": [(0,0), (1,0), (2,0), (3,0)],
    "bent": [(0,0), (1,0), (2,0), (0,1)],
}
for name, cells in shapes.items():
    index = {cell:i for i,cell in enumerate(cells)}
    edges = []
    for i,(x,y) in enumerate(cells):
        for dx,dy,a,b in ((1,0,0,1),(0,1,2,3)):
            if (x+dx,y+dy) in index:
                edges.append((i,a,index[x+dx,y+dy],b))
    assert len(edges) == 3
    counts = Counter()
    triples = set()
    for contacts in product(range(1,7), repeat=3):
        requirements = [[] for _ in cells]
        for (a,fa,b,fb), value in zip(edges, contacts):
            requirements[a].append((fa,value))
            requirements[b].append((fb,value))
        choices = [sum(all(face[d] == v for d,v in required) for face in faces)
                   for required in requirements]
        if not all(choices):
            continue
        triples.add(contacts)
        counts[84-2*sum(contacts)] += prod(choices)
    assert set(counts) == {58,60,62,64,66,68}, counts
    assert min(map(sum, triples)) == 8 and max(map(sum, triples)) == 13
    assert len(triples) == (6 if name == "line" else 24), (name,len(triples))
    print(f"PASS {name}: {len(triples)} feasible contact triples; outer sum distribution {dict(sorted(counts.items()))}")
print("LIMIT: source shape transcription and the usual six distinct die labels are inputs; publisher key unverified.")
