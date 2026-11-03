#!/usr/bin/env python3
"""Check page 79 calculations and retain explicit geometry and tie uncertainties."""
import json
from fractions import Fraction as F
from pathlib import Path
record=json.loads((Path(__file__).parent/'source-inventory/5-2-u2-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==79)
assert r['sourcePdfPage']==75 and r['runtimeConnection']=='partial-verified-local' and r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']]==list(range(33,41))
for item in r['items']:
    if item['number'] not in (36, 39):
        assert item['status']=='public-independent-verification-publisher-key-pending'
        assert item['runtimeTypeId']==f"5-2-u2-practice-{item['number']}-original"
        assert item['publisherAnswerVerified'] is False
assert 10*F(1,4)*10*F(11,6)==F(275,6)
assert F(9,4)**2*8*6==243
assert F(46,5)**2/4==F(529,25)
assert F(10,3)**2*(5-4*F(1,4))==F(400,9)
assert F(162,5)*F(5,6)*F(3,10)==F(81,10)
assert (F(9,10)+F(6,5))*F(19,3)==F(133,10)
assert F(3,5)*F(5,9)+F(2,5)*F(5,8)==F(7,12)
assert F(100,21)*F(49,15)*F(13,25)==F(364,45)
assert all(r['items'][i]['status']=='source-ambiguity-answer-key-pending' for i in [3,6])
assert [i['candidate'] for i in r['items']]==['45와 5/6cm²','243cm²','21과 4/25cm²','44와 4/9cm² (그림의 겹친 부분이 각각 한 장의 1/4이라는 해석)','8과 1/10L','13과 3/10L','7/12 (후반기 무승부가 없다는 가정)','8과 4/45cm²']
print('PASS: page 79 arithmetic; overlapping-square interpretation and possible draws remain unresolved')
