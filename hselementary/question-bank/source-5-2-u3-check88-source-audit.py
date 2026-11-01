#!/usr/bin/env python3
"""Enumerate triangles along actual page 88 #28 segments with exact coordinates."""
import json
from collections import Counter
from fractions import Fraction as F
from itertools import combinations
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==88)
assert r['sourcePdfPage']==84 and r['runtimeConnection']=='not-connected' and r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']]==list(range(25,33))
assert all(x['status']=='source-ambiguity-answer-key-pending' for x in r['items'])
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
for t in combinations(p,3):
    if cross(*(p[x] for x in t)) and all(connected(*e) for e in combinations(t,2)):
        groups[tuple(sorted(squared_distance(*e) for e in combinations(t,2)))]+=1
assert sorted(groups.values())==[1,3,6,6]
assert sum(groups.values())==16 and sum(n*(n-1)//2 for n in groups.values())==33
print('PASS: page 88 #28 exact 16 triangles and 33 pairs under all-pairs convention; source remains unconnected')
