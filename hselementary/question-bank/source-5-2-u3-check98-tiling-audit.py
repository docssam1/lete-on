#!/usr/bin/env python3
"""Verify point-symmetry overlaps and congruent grid partitions."""
import json
from fractions import Fraction as F
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 98)
assert {i["number"] for i in review["items"]} == set(range(102, 108))
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"

# 105: the original polygon is partitioned into seven disjoint triangles.
triangles = [[(3,3),(0,3),(3,1)],[(3,1),(3,0),(8,0)],[(3,3),(3,1),(8,0)],
             [(8,0),(8,2),(5,2)],[(3,3),(8,0),(5,2)],[(3,3),(5,2),(5,4)],
             [(5,4),(3,4),(3,3)]]
def cross(a,b,c):
    return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def area(p):
    return abs(sum(x*v-u*y for (x,y),(u,v) in zip(p,p[1:]+p[:1]))) / F(2)
def clip(poly,a,b):
    out=[]
    for p,q in zip(poly,poly[1:]+poly[:1]):
        cp,cq=cross(a,b,p),cross(a,b,q)
        if cp>=0: out.append(p)
        if (cp<0<cq) or (cq<0<cp):
            t=F(cp,cp-cq)
            out.append((p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])))
    return out
def overlap(center):
    rotated=[[(2*center[0]-x,2*center[1]-y) for x,y in t] for t in triangles]
    total=F(0)
    for t in triangles:
        for r in rotated:
            p=t[:]
            for a,b in zip(r,r[1:]+r[:1]):
                p=clip(p,a,b)
                if not p: break
            if p: total+=area(p)
    return total
assert sum(map(area,triangles)) == 17
assert [overlap(c) for c in [(5,0),(3,2),(6,1),(8,1)]] == [0,6,8,0]

def normal(shape):
    xmin=min(x for x,y in shape); ymin=min(y for x,y in shape)
    return tuple(sorted((x-xmin,y-ymin) for x,y in shape))
def canonical(shape):
    transformations=[(1,0,0,1),(0,-1,1,0),(-1,0,0,-1),(0,1,-1,0),
                     (-1,0,0,1),(1,0,0,-1),(0,1,1,0),(0,-1,-1,0)]
    return min(normal([(a*x+b*y,c*x+d*y) for x,y in shape]) for a,b,c,d in transformations)
def connected(shape):
    found={next(iter(shape))}
    while True:
        nxt=found | {(x+dx,y+dy) for x,y in found for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)) if (x+dx,y+dy) in shape}
        if nxt==found: return found==shape
        found=nxt
def check_layouts(layouts, labels, size):
    signatures=set()
    for layout in layouts:
        rows=layout.split('/')
        assert len(rows)==4 and all(len(row)==4 for row in rows)
        parts=[{(x,y) for y,row in enumerate(rows) for x,v in enumerate(row) if v==label} for label in labels]
        assert sum(map(len,parts))==16 and all(len(p)==size and connected(p) for p in parts)
        assert len({canonical(p) for p in parts})==1
        signatures.add(canonical(parts[0]))
    assert len(signatures)==len(layouts)

check_layouts(['AABB/AABB/AABB/AABB','AAAB/AABB/AABB/ABBB','AABB/AAAB/ABBB/AABB',
               'AAAB/AAAB/ABBB/ABBB','AAAB/ABBB/AAAB/ABBB','AAAB/ABAB/ABAB/ABBB'],'AB',8)
check_layouts(['ABCD/ABCD/ABCD/ABCD','AACC/ABCD/ABCD/BBDD',
               'ACCC/AACD/ABDD/BBBD','AACC/AACC/BBDD/BBDD'],'ABCD',4)
print('Page 98 overlaps and congruent partition examples passed; drawings and publisher answers remain unverified.')
