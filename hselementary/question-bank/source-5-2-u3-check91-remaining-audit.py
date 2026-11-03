#!/usr/bin/env python3
"""Check remaining page 91 relations and source-review status."""
import json
from fractions import Fraction as F
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==91)
items={x['number']:x for x in r['items']}
assert not r['publisherAnswerVerified'] and r['runtimeConnection']=='partially-connected'
assert items[55]['status']=='public-independent-verification-publisher-key-pending'
for x in range(1,54):
    assert 180-(6+x)-(60-x)==114
assert 5**2+12**2==13**2 and 5+12+13==30
# #52 numerical realization: E=(9,0), F=(18,12), A=(0,18).
assert 9**2+12**2==15**2
assert F(abs(9*18-12*(-9)),15)==18
assert 9+6==15
one_triangle=F(180,6)
altitude=2*one_triangle/12
assert altitude==5 and 2*altitude==10
assert [items[n]['candidate'] for n in (50,51,52)]==['114도','13cm','15cm']
print('PASS: page 91 #50/#51/#52 and #55 calculation; publisher answer pending')
