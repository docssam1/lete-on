#!/usr/bin/env python3
"""Check the page 85 source review without opening its drawing exercises."""
import json
import math
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==85)
assert r['sourcePdfPage']==81 and r['runtimeConnection']=='not-connected' and r['publisherAnswerVerified'] is False
assert [i['number'] for i in r['items']]==list(range(1,9))
assert all(r['items'][i]['status']=='source-reviewed-drawing-pending' for i in [1,2,3])
assert r['items'][5]['status']=='source-ambiguity-answer-key-pending'
assert 180-115-35==30 and 4+2>5
# With angle A=40°, opposite side a=10 and side b=12, SSA gives two valid B angles.
angle_a=40
acute_b=math.degrees(math.asin(12*math.sin(math.radians(angle_a))/10))
obtuse_b=180-acute_b
assert 0<acute_b<90<obtuse_b and angle_a+obtuse_b<180
assert [r['items'][i]['candidate'] for i in [0,4,5,6,7]]==['ㄴ, ㄱ, ㄷ, ㄹ','ㄹ','ㄴ, ㄹ, ㄱ, ㄷ','변 ㄴㄷ','③, ④']
print('PASS: page 85 construction metadata and SSA counterexample; drawing exercises remain unconnected')
