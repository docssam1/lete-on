#!/usr/bin/env python3
"""Verify cuboid counts and an explicit mixed-orientation packing."""
import json
import math
from itertools import combinations, permutations
from pathlib import Path

path=Path(__file__).parent/'source-inventory/5-2-u5-readiness-review.json'
review=next(r for r in json.loads(path.read_text())['additionalSourceReviews'] if r['sourcePrintedPage']==108)
assert review['sourcePdfPage']==102 and review['alternateSourcePdfPage']==103
assert {i['number'] for i in review['items']}==set(range(1,9))
assert review['publisherAnswerVerified'] is False and review['runtimeConnection']=='not-connected'
assert 4*(7+6+3)==64
assert math.comb(6,2)*math.comb(5,2)*math.comb(4,2)==900
assert 4*(32+8+8)==192
assert math.gcd(math.gcd(30,45),15)==15 and (30//15)*(45//15)*(15//15)==6
assert 12*15==180

# 8: five x-slabs; in each, two layers of five and one layer of three.
boxes=[]
for x in range(0,25,5):
    for z in (0,6):
        for y in range(0,20,4): boxes.append((x,y,z,5,4,6))
    for y in (0,6,12): boxes.append((x,y,12,5,6,4))
assert len(boxes)==65
for x,y,z,w,d,h in boxes:
    assert sorted((w,d,h))==[4,5,6] and 0<=x<x+w<=25 and 0<=y<y+d<=20 and 0<=z<z+h<=16
for a,b in combinations(boxes,2):
    assert any(a[i]+a[i+3]<=b[i] or b[i]+b[i+3]<=a[i] for i in range(3))
assert 25*20*16//(4*5*6)==66
assert max((25//w)*(20//d)*(16//h) for w,d,h in permutations((4,5,6)))==64
print('Page 108 cuboid checks and 65-item construction passed; 66 feasibility and publisher answers remain unverified.')
