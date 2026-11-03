#!/usr/bin/env python3
"""Check page 82 fractions and retain the common-multiplier interpretation."""
import json
from fractions import Fraction as F
from math import gcd
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u2-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==82)
assert r['sourcePdfPage']==78 and r['runtimeConnection']=='partial-verified-local' and r['publisherAnswerVerified'] is False
assert [i['number'] for i in r['items']]==list(range(57,65))
for item in r['items']:
    assert item['status']=='public-independent-verification-publisher-key-pending'
    assert item['runtimeTypeId']==f"5-2-u2-practice-{item['number']}-original"
    assert item['publisherAnswerVerified'] is False
assert F(35*3,5)==21
assert F(546,25)/(F(6,5)**3-1)==30
assert 60*F(3+4,12)+63==98
assert (F(138,7)-F(64,5))/2/(F(18,7)-1)==F(11,5)
assert all((F(8,3)/24).numerator==1 and (F(3,8)/24).numerator==1 for _ in [0])
assert all(not ((F(8,3)/n).numerator==1 and (F(3,8)/n).numerator==1) for n in range(1,24))
answers=[F(n,d) for d in (15,45) for n in range(1,40) if gcd(n,d)==1 and (F(45,7)*F(n,d)).denominator==1]
assert answers==[F(7,15),F(14,15),F(28,15),F(7,45),F(14,45),F(28,45)]
for mult, fs in [(F(77,15),[F(60,7),F(45,11)]),(F(735,8),[F(8,21),F(16,35),F(32,49)])]:
    assert all((mult*f).denominator==1 for f in fs)
    assert all(not all((F(n,d)*f).denominator==1 for f in fs) for d in range(1,101) for n in range(1,(mult*d).numerator//(mult*d).denominator+1) if F(n,d)<mult)
assert '공통으로 곱하는 한 수로 해석' in r['items'][7]['reviewNote']
assert [x['candidate'] for x in r['items']]==['21명','30cm','98cm','2와 1/5cm','1/24','7/15, 14/15, 28/15, 7/45, 14/45, 28/45','77/15','735/8']
print('PASS: page 82 fractions, enumeration, bounded minimality and source connections; publisher key pending')
