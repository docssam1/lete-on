#!/usr/bin/env python3
"""Verify three equilateral-triangle congruences with exact scaled coordinates."""
import json
from fractions import Fraction as F
from itertools import combinations
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==88)
items={x['number']:x for x in r['items']}
assert all(items[n]['status']=='public-independent-verification-publisher-key-pending' for n in (25,30,31))
assert not r['publisherAnswerVerified'] and r['runtimeConnection']=='partial-verified-local'
# y coordinates are expressed in units of √3.
def dist2(a,b): return (a[0]-b[0])**2+3*(a[1]-b[1])**2
def sig(*points): return sorted(dist2(a,b) for a,b in combinations(points,2))
def plus(v): x,y=v; return ((x-3*y)/2,(x+y)/2)
def minus(v): x,y=v; return ((x+3*y)/2,(y-x)/2)
origin=(F(0),F(0))
for a in range(1,8):
    for b in range(1,8):
        a,b=F(a),F(b)
        n=(-a,F(0));g=(-a/2,a/2);m=(b,F(0));l=(b/2,b/2)
        assert sig(g,origin,m)==sig(n,origin,l)  # #25
        n=(-a,F(0));l=minus(n);d=(b,b/3);m=plus(d)
        assert sig(origin,n,m)==sig(origin,l,d)  # #30
for denominator in range(3,15):
    for numerator in range(1,denominator):
        t=F(numerator,denominator)
        g=(F(0),F(1));n=(-F(1),F(0));d=(F(1),F(0))
        l=(-t,1-t);m=(-1+2*t,F(0));b=(1-t,t)
        assert sig(g,l,b)==sig(n,m,l)==sig(d,b,m)  # #31
print('PASS: page 88 #25/#30/#31 equilateral congruences over multiple exact constructions')
