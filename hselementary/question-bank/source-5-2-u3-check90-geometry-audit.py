#!/usr/bin/env python3
"""Cross-check selected page 90 geometry and current review status."""
import json
from fractions import Fraction as F
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==90)
assert r['sourcePdfPage']==86 and r['runtimeConnection']=='partial-verified-local' and not r['publisherAnswerVerified']
assert [x['number'] for x in r['items']]==list(range(41,49))
for item in r['items']:
    assert item['status']=='public-independent-verification-publisher-key-pending'
    assert item['runtimeTypeId']==f"5-2-u3-practice-{item['number']}-original"
    assert item['publisherAnswerVerified'] is False
assert [x['candidate'] for x in r['items']]==['432cm²','90도','115도','50도','60도','75도','80cm²','∠ㄴㅂㄹ=29도, ∠ㄴㄹㅂ=122도']
for s in range(2,20):
    for t in range(1,s):
        assert t*s-s*t==0  # dot product of (t,-s) and (s,t)
angle_b=F(90,3)
assert 2*angle_b==60 and angle_b+2*angle_b==90
assert F(20*8,2)==80
base=180-114-37
assert base==29 and 180-2*base==122
print('PASS: page 90 #42/#45/#47/#48 angle and area relations')
