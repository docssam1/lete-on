#!/usr/bin/env python3
"""Check page 88 #26 and #27 with rational geometric constructions."""
import json
from fractions import Fraction as F
from itertools import combinations
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==88)
for n in (26,27):
    assert next(x for x in r['items'] if x['number']==n)['status']=='source-reviewed-answer-key-pending'
assert not r['publisherAnswerVerified'] and r['runtimeConnection']=='not-connected'
def ds(a,b): return (a[0]-b[0])**2+(a[1]-b[1])**2
def signature(*pts): return sorted(ds(a,b) for a,b in combinations(pts,2))
def intersection(a,b,c,d):
    u=(b[0]-a[0],b[1]-a[1]);v=(d[0]-c[0],d[1]-c[1]);w=(c[0]-a[0],c[1]-a[1])
    den=u[0]*v[1]-u[1]*v[0]
    t=(w[0]*v[1]-w[1]*v[0])/den
    return (a[0]+t*u[0],a[1]+t*u[1])
# #26: equal radii and equal angles determine reflected large and small triangles.
d=(F(0),F(0));n=(F(3,5),F(4,5));l=(F(1),F(0));g=(F(6,5),F(8,5));m=(F(2),F(0))
b=intersection(n,m,l,g)
assert signature(d,n,m)==signature(d,l,g)
assert signature(g,n,b)==signature(m,l,b)
# #27: congruent rectangles share opposite vertices G and D; S and O are intersections.
for w in range(3,12):
    for h in range(1,w):
        w,h=F(w),F(h)
        g=(F(0),F(0));n=(F(0),-h);d=(w,-h);l=(w,F(0))
        m=(2*w*h*h/(w*w+h*h),h*(w*w-h*h)/(w*w+h*h))
        b=(d[0]-m[0],d[1]-m[1])
        s=intersection(m,d,g,l);o=intersection(g,b,n,d)
        assert ds(g,m)==h*h and ds(m,d)==w*w
        target=signature(g,m,s)
        assert target==signature(g,n,o)==signature(o,b,d)==signature(l,d,s)
print('PASS: page 88 #26 and #27 congruent triangle correspondences; publisher answer pending')
