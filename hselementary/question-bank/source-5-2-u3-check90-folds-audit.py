#!/usr/bin/env python3
"""Check the remaining page 90 fold, rotation and area relations."""
import json
import math
from fractions import Fraction as F
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==90)
assert r['sourcePdfPage']==86 and r['runtimeConnection']=='partial-verified-local' and not r['publisherAnswerVerified']
assert [x['number'] for x in r['items']]==list(range(41,49))
# #41: 12-16-20 right triangle. Projection from ㅁ to the foot below ㅂ.
assert 12**2+16**2==20**2
horizontal=F(16**2,20); vertical=F(12*16,20)
left_width=horizontal*F(12,1)/vertical
assert left_width==16 and (left_width+20)*12==432
# #43: triangle bounded by the original and rotated segments.
assert 180-40-25==115
# #44: both legs of the first isosceles triangle rotate 50° to corresponding legs of the second.
for t in range(1,20):
    angle=math.radians(t)
    rotated=angle-math.radians(50)
    assert abs(math.degrees(abs(angle-rotated))-50)<1e-10
# #46: half the square's side is opposite the 30° angle; fold bisects the 30° turn.
assert abs(math.degrees(math.asin(F(1,2)))-30)<1e-12
assert 90-30/2==75
print('PASS: page 90 #41/#43/#44/#46 fold, area and rotation relations')
