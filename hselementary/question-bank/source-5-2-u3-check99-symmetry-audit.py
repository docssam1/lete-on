#!/usr/bin/env python3
"""Check regular-hexagon regions and rotation from printed page 99."""
import json
import math
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 99)
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
assert {i["number"] for i in review["items"]} == set(range(108, 115))

# Clip a regular hexagon in four half-plane combinations, then compare colors.
h=5*math.sqrt(3)
hexagon=[(-10,0),(-5,-h),(5,-h),(10,0),(5,h),(-5,h)]
def clip(polygon, axis, boundary, direction):
    out=[]
    for p,q in zip(polygon,polygon[1:]+polygon[:1]):
        a=direction*(p[axis]-boundary); b=direction*(q[axis]-boundary)
        if a>=0: out.append(p)
        if (a<0<b) or (b<0<a):
            t=a/(a-b)
            out.append((p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])))
    return out
def area(p):
    return abs(sum(x*v-u*y for (x,y),(u,v) in zip(p,p[1:]+p[:1])))/2
regions={}
for sx in (-1,1):
    for sy in (-1,1):
        regions[sx,sy]=area(clip(clip(hexagon,0,-2,sx),1,3,sy))
diff=abs(regions[-1,1]+regions[1,-1]-regions[-1,-1]-regions[1,1])
assert math.isclose(diff,24,abs_tol=1e-9)

# 112: after a 180-degree rotation, both bounding rays turn 120 degrees clockwise.
assert (180-120,150-120)==(60,30)
print('Page 99 region and rotation checks passed; publisher answer remains unverified.')
