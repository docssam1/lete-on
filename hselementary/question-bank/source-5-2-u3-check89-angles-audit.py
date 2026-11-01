#!/usr/bin/env python3
"""Check angle relations and fold correspondence for printed page 89."""
import json
from fractions import Fraction as F
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==89)
assert r['sourcePdfPage']==85 and r['runtimeConnection']=='not-connected' and not r['publisherAnswerVerified']
by_number={x['number']:x for x in r['items']}
assert [by_number[n]['candidate'] for n in range(34,39)]==['30도','80도','120도','33도','30도']
# #34: let the first triangle's angle at ㄷ vary; its congruent counterpart has that angle at ㄱ.
for angle_d in range(21,130):
    angle_g_in_small=angle_d-20
    angle_d_in_small=180-50-angle_g_in_small
    angle_between_g_and_l=180-angle_d_in_small
    assert angle_between_g_and_l-angle_d==30
# #35: opposite angles and the congruent triangles impose 2*x+58+(180-142)=180.
x=F(180-58-(180-142),2)
assert x==42 and 180-58-x==80
# #36: rotate by 45° inside 60°; use the external angle at the crossing.
assert (60-45)+(180-(180-45-60))==120
# #37: fold preserves the apex angle at the new point on the base.
base=F(180-58,2)
left_triangle_at_fold=180-base-30
assert 180-left_triangle_at_fold-58==33
# #38: the two crossing segments make 60° and 30° with the same baseline.
assert 60-(180-90-60)==30
print('PASS: page 89 #34–38 congruence, rotation and folding angle relations')
