#!/usr/bin/env python3
"""Check page 81 with exact arithmetic and an affine triangle area model."""
import json
from fractions import Fraction as F
from pathlib import Path

r = next(x for x in json.loads((Path(__file__).parent / 'source-inventory/5-2-u2-readiness-review.json').read_text())['additionalSourceReviews'] if x['sourcePrintedPage'] == 81)
assert r['sourcePdfPage'] == 77 and r['runtimeConnection'] == 'partial-verified-local'
assert r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']] == list(range(49,57))
for item in r['items']:
    assert item['status'] == 'public-independent-verification-publisher-key-pending'
    assert item['runtimeTypeId'] == f"5-2-u2-practice-{item['number']}-original"
    assert item['publisherAnswerVerified'] is False
width, height = F(9,7), F(6,7)
assert 2*(width+height)==F(30,7) and height==width*F(2,3)
assert F(11,8)*F(48,11)-3*F(1,4)+F(3,4)*F(11,2)-F(6,7)*F(21,8)==F(57,8)
assert F(6,1)/(1-F(3,8)-F(5,32)-(F(3,16)+F(5,32)))==48
# Map the outer triangle to (0,1), (0,0), (1,0); affine maps preserve area ratios.
left, right, bottom = (F(0),F(3,5)), (F(3,5),F(2,5)), (F(2,5),F(0))
cross = abs((right[0]-left[0])*(bottom[1]-left[1])-(right[1]-left[1])*(bottom[0]-left[0]))
assert cross==F(7,25) and F(42,1)/cross==150
assert F(48,1)/(F(1,6)*F(3,5)*F(2,7))==1680
assert F(16,1)/(F(5,8)*F(3,5)*F(2,3))==64
assert F(5,1)/(F(2,3)*F(5,8)*F(2,5)*F(1,4))==120
total=F(6,1)/(1-F(1,3)-F(1,5)-F(4,9))
assert total==270 and total/3-3==87
assert [x['candidate'] for x in r['items']] == ['가로 1과 2/7m, 세로 6/7m','1/4','48km','150cm²','1680명','64개','120개','87개']
print('PASS: page 81 arithmetic, triangle-area cross product and source connections; publisher key pending')
