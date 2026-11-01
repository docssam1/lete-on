#!/usr/bin/env python3
"""Check construction evidence and the two intersections on printed page 86."""
import json
import math
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==86)
assert r['sourcePdfPage']==82 and r['runtimeConnection']=='not-connected' and r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']]==list(range(9,17))
assert all(r['items'][i]['status']=='source-ambiguity-answer-key-pending' for i in [1,4,5,7])
assert all(r['items'][i]['status']=='source-reviewed-drawing-pending' for i in [0,6])
# A circle centered 5 cm from the ray origin intersects the 25° ray twice at radius 3 cm.
theta=math.radians(25)
disc=9-25*math.sin(theta)**2
assert disc>0
roots=[5*math.cos(theta)+sign*math.sqrt(disc) for sign in [-1,1]]
assert 0<roots[0]<roots[1]
assert all(abs(math.hypot(t*math.cos(theta)-5,t*math.sin(theta))-3)<1e-12 for t in roots)
assert r['items'][2]['candidate']=='④' and r['items'][3]['candidate']=='ㄱ, ㄷ, ㄹ, ㅁ'
print('PASS: page 86 construction states and two distinct SSA solutions; uncertain cases remain unconnected')
