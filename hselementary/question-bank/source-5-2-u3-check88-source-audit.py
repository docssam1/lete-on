#!/usr/bin/env python3
"""Enumerate triangles along actual page 88 #28 segments with exact coordinates."""
import json
from collections import Counter
from fractions import Fraction as F
from itertools import combinations
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==88)
assert r['sourcePdfPage']==84 and r['runtimeConnection']=='partial-verified-local' and r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']]==list(range(25,33))
assert next(x for x in r['items'] if x['number']==28)['status']=='public-independent-verification-publisher-key-pending'
assert all(next(x for x in r['items'] if x['number']==n)['status']=='public-independent-verification-publisher-key-pending' for n in (25,26,27,30,31))
assert next(x for x in r['items'] if x['number']==29)['status']=='public-independent-verification-publisher-key-pending'
assert next(x for x in r['items'] if x['number']==32)['status']=='public-independent-verification-publisher-key-pending'
for item in r['items']:
    assert item['runtimeTypeId']==f"5-2-u3-practice-{item['number']}-original"
    assert item['publisherAnswerVerified'] is False
# Coordinates use y scaled by sqrt(3), preserving exact distances via dx²+3dy².
p={'A':(F(1),F(1)),'B':(F(0),F(0)),'C':(F(2),F(0)),
   'D':(F(1,2),F(1,2)),'E':(F(1),F(0)),'F':(F(3,2),F(1,2)),'O':(F(1),F(1,3))}
segments=[('A','B'),('A','C'),('B','C'),('A','E'),('B','F'),('C','D')]
def cross(a,b,c):
    return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def on(q,a,b):
    return cross(a,b,q)==0 and all(min(a[i],b[i])<=q[i]<=max(a[i],b[i]) for i in (0,1))
def connected(a,b):
    return any(on(p[a],p[u],p[v]) and on(p[b],p[u],p[v]) for u,v in segments)
def squared_distance(a,b):
    return (p[a][0]-p[b][0])**2+3*(p[a][1]-p[b][1])**2
groups=Counter()
triangles={}
for t in combinations(p,3):
    if cross(*(p[x] for x in t)) and all(connected(*e) for e in combinations(t,2)):
        key=tuple(sorted(squared_distance(*e) for e in combinations(t,2)))
        groups[key]+=1
        triangles.setdefault(key,[]).append(t)
assert sorted(groups.values())==[1,3,6,6]
assert sum(groups.values())==16 and sum(n*(n-1)//2 for n in groups.values())==33
def positive_area_overlap(t,u):
    poly=[p[x] for x in t]
    clip=[p[x] for x in u]
    if cross(*clip)<0:
        clip.reverse()
    for a,b in zip(clip,clip[1:]+clip[:1]):
        out=[]
        if not poly:
            break
        for s,e in zip(poly[-1:]+poly[:-1],poly):
            cs,ce=cross(a,b,s),cross(a,b,e)
            if (cs<0 and ce>0) or (cs>0 and ce<0):
                ratio=cs/(cs-ce)
                out.append((s[0]+ratio*(e[0]-s[0]),s[1]+ratio*(e[1]-s[1])))
            if ce>=0:
                out.append(e)
        poly=out
    if len(poly)<3:
        return False
    return sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly)))!=0
pairs=[pair for ts in triangles.values() for pair in combinations(ts,2)]
assert len(pairs)==33
assert sum(positive_area_overlap(*pair) for pair in pairs)==12
assert sum(not positive_area_overlap(*pair) for pair in pairs)==21
print('PASS: page 88 #28 has 33 congruent pairs, including 12 with interior overlap; publisher key pending')
