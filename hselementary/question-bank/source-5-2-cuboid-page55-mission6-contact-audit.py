#!/usr/bin/env python3
"""Enumerate all contact-label tuples from the actual rendered shape coords."""
from collections import Counter
from itertools import permutations, product
from math import prod
import json
import os
import shutil
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent
node = os.environ.get("NODE", shutil.which("node") or "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node")
shapes = json.loads(subprocess.check_output([node, "-e", """
const s=require('./source-5-2-cuboid-page55-mission6.js');
console.log(JSON.stringify(s.shapes));
"""], cwd=root, text=True))
faces = [p for p in permutations(range(1,7))
         if p[0]+p[1] == p[2]+p[3] == p[4]+p[5] == 7]
assert len(faces) == 48
assert shapes["square"]["coords"] == [[0,0],[1,0],[0,1],[1,1]]
assert shapes["zigzag"]["coords"] == [[0,0],[1,0],[1,1],[2,1]]
for name, shape in shapes.items():
    cells = [tuple(p) for p in shape["coords"]]
    index = {cell:i for i,cell in enumerate(cells)}
    edges = []
    for i,(x,y) in enumerate(cells):
        for dx,dy,a,b in ((1,0,0,1),(0,1,2,3)):
            if (x+dx,y+dy) in index:
                edges.append((i,a,index[x+dx,y+dy],b))
    assert len(edges) == (4 if name == "square" else 3)
    totals = Counter()
    triples = 0
    for contacts in product(range(1,7), repeat=len(edges)):
        requirements = [[] for _ in cells]
        for (a,fa,b,fb),value in zip(edges,contacts):
            requirements[a].append((fa,value))
            requirements[b].append((fb,value))
        choices = [sum(all(face[axis] == value for axis,value in req) for face in faces)
                   for req in requirements]
        if all(choices):
            triples += 1
            totals[sum(contacts)] += prod(choices)
    expected_min, expected_count = ((6,4608) if name == "square" else (4,24576))
    assert min(totals) == expected_min and sum(totals.values()) == expected_count
    assert 84-2*min(totals) == shape["outerMax"]
    print(f"PASS {name}: {triples} feasible contact tuples, {sum(totals.values())} face assignments, min contact {min(totals)}, max outer {shape['outerMax']}")
print("LIMIT: source shape transcription is an input; this permits both die handednesses and does not confirm the publisher key.")
