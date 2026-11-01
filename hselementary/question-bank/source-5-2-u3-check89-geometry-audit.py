#!/usr/bin/env python3
"""Verify selected page 89 figures, including the inconsistent dimensions in #39."""
import json
import math
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==89)
assert r['sourcePdfPage']==85 and r['runtimeConnection']=='not-connected' and not r['publisherAnswerVerified']
assert [x['number'] for x in r['items']]==[33,39,40]
assert r['items'][1]['status']=='source-ambiguity-answer-key-pending'
# 60° rotation with aligned image endpoints forces original height=8√3.
h=8*math.sqrt(3)
assert abs(h*math.cos(math.pi/3)-8*math.sin(math.pi/3))<1e-12
assert abs(math.hypot(h,8)-16)<1e-12
# Original #39: the oblique segment spans a horizontal difference of 10−8 and height 5.
assert (10-8)**2+5**2==29 and 7**2==49 and 29!=49
# The intended overlap perimeter assumes congruent trapezoids and the stated oblique length.
assert 2*(8+10-14)+2*7==22
assert abs(math.degrees(math.asin(3/6))-30)<1e-12
print('PASS: page 89 #33/#40; #39 source dimensions contradict the right-triangle distance')
