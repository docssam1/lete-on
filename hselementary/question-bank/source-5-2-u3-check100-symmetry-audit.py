#!/usr/bin/env python3
"""Verify the triangle, arrows, and digit permutations on printed page 100."""
import json
from fractions import Fraction
from itertools import combinations, permutations
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 100)
assert {i["number"] for i in review["items"]} == {115, 116, 117}
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
# Affine coordinates preserve the intersection-to-triangle area ratio.
triangle=[(0,0),(3,0),(0,3)]
rotated=[(2,2),(-1,2),(2,-1)]
def cross(a,b,p):
    return (b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])
def clip(poly,a,b):
    out=[]
    for p,q in zip(poly,poly[1:]+poly[:1]):
        cp,cq=cross(a,b,p),cross(a,b,q)
        if cp>=0:out.append(p)
        if (cp<0<cq) or (cq<0<cp):
            t=Fraction(cp,cp-cq)
            out.append((p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])))
    return out
def area(p):
    return abs(sum(x*v-u*y for (x,y),(u,v) in zip(p,p[1:]+p[:1])))/Fraction(2)
intersection=triangle[:]
for a,b in zip(rotated,rotated[1:]+rotated[:1]):
    intersection=clip(intersection,a,b)
assert area(intersection)/area(triangle)==Fraction(2,3)
assert 78*area(intersection)/area(triangle)==52

# 116: include the full outline and arrow directions when identifying congruent results.
cells={(0,0),(1,0),(2,0),(3,0),(0,1),(3,-1)}
arrows={(1,1),(-1,1),(-1,-1),(1,-1)}
transforms=[(1,0,0,1),(0,-1,1,0),(-1,0,0,-1),(0,1,-1,0),
            (-1,0,0,1),(1,0,0,-1),(0,1,1,0),(0,-1,-1,0)]
def canonical(placement):
    forms=[]
    for a,b,c,d in transforms:
        points=[(a*x+b*y,c*x+d*y,a*u+b*v,c*u+d*v) for (x,y),(u,v) in placement.items()]
        xmin=min(x for x,y,u,v in points); ymin=min(y for x,y,u,v in points)
        forms.append(tuple(sorted((x-xmin,y-ymin,u,v) for x,y,u,v in points)))
    return min(forms)
valid=[]
for count in (2,4):
    for chosen in combinations(sorted(cells),count):
        for directions in permutations(arrows,count):
            placement={p:(0,0) for p in cells}
            placement.update(zip(chosen,directions))
            if all(placement[(3-x,-y)]==(-u,-v) for (x,y),(u,v) in placement.items()):
                valid.append(placement)
assert len(valid)==36 and len({canonical(p) for p in valid})==36

# 117: each selected source card is distinct; its rotated image need not be distinct.
rotation={'0':'0','1':'1','2':'2','5':'5','6':'9','8':'8','9':'6'}
assert len(list(permutations(rotation,4)))==840
assert all(rotation[rotation[d]]==d for d in rotation)
print('Page 100 symmetry calculations passed; publisher answers remain unverified.')
