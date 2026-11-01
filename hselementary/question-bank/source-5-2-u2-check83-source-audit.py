#!/usr/bin/env python3
"""Verify page 83 exact fractions, number line positions, and digit pairs."""
import json
from fractions import Fraction as F
from math import gcd
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u2-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==83)
assert r['sourcePdfPage']==79 and r['runtimeConnection']=='not-connected' and r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']]==list(range(65,73))
assert all((F(84,5)*v).denominator==1 for v in [F(5,3),F(10,7),F(35,4)])
start,end=F(3,5),F(44,7)
assert [start+(end-start)*F(i,4) for i in range(1,4)]==[F(283,140),F(241,70),F(681,140)]
assert F(15,4)+(F(29,6)-F(15,4))*F(3,5)==F(22,5)
box=F(1,8)+(F(1,5)-F(1,8))*F(5,3)
assert box==F(1,4) and box.numerator+box.denominator==5
assert F(8,7)*3==F(24,7)
v=F(6,5)/F(36,100)
assert v==F(10,3) and v.numerator*v.denominator==30
pairs=[(a,b) for a in range(1,10) for b in range(1,10) if gcd(a,2)==gcd(b,3)==1 and (F(a,2)*F(b,3)).denominator==1]
assert pairs==[(3,2),(3,4),(3,8),(9,2),(9,4),(9,8)]
v=F(17,3)/F(7,3)
assert v==F(17,7) and v.numerator*v.denominator==119
assert [x['candidate'] for x in r['items']]==['84/5','ㄱ 2와 3/140, ㄴ 3과 31/70, ㄷ 4와 121/140','4와 2/5','5','3과 3/7m','30','6개','119']
print('PASS: page 83 exact number lines and digit enumeration; source remains unconnected')
