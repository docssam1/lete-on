#!/usr/bin/env python3
"""Independently check the final four exercises on printed page 84."""
import json
from fractions import Fraction as F
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u2-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==84)
assert r['sourcePdfPage']==80 and r['runtimeConnection']=='partial-verified-local' and r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']]==list(range(73,77))
for item in r['items']:
    assert item['status']=='public-independent-verification-publisher-key-pending'
    assert item['runtimeTypeId']==f"5-2-u2-practice-{item['number']}-original"
    assert item['publisherAnswerVerified'] is False
height=F(7,4)/F(2,5)/F(7,3)
assert height==F(15,8) and height.numerator*height.denominator==120
assert F(5,6)/(F(4,5)/3)==F(25,8)
pairs=[(a,b) for a in range(1,46) for b in range(1,46) if F(2,3)*F(2,5)*F(a,6)==F(2,b)]
assert pairs and all(a*b==45 for a,b in pairs)
assert F(8,27)*F(3,2)**3==1
assert [x['candidate'] for x in r['items']]==['120','25/8','45','8/27']
print('PASS: page 84 fraction equations, reverse growth and source connections; publisher key pending')
