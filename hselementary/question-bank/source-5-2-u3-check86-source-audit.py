#!/usr/bin/env python3
"""Check construction evidence and the two intersections on printed page 86."""
import json
import math
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==86)
assert r['sourcePdfPage']==82 and r['runtimeConnection']=='partially-connected' and r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']]==list(range(9,17))
assert all(r['items'][i]['status']=='source-ambiguity-answer-key-pending' for i in [1,4,5,7])
for item in r['items']:
    if item['number'] in (9,11,12,15):
        assert item['status']=='public-independent-verification-publisher-key-pending'
        assert item['runtimeTypeId']==f"5-2-u3-practice-{item['number']}-original"
        assert item['publisherAnswerVerified'] is False
# A circle centered 5 cm from the ray origin intersects the 25° ray twice at radius 3 cm.
theta=math.radians(25)
disc=9-25*math.sin(theta)**2
assert disc>0
roots=[5*math.cos(theta)+sign*math.sqrt(disc) for sign in [-1,1]]
assert 0<roots[0]<roots[1]
assert all(abs(math.hypot(t*math.cos(theta)-5,t*math.sin(theta))-3)<1e-12 for t in roots)
assert r['items'][2]['candidate']=='④' and r['items'][3]['candidate']=='ㄱ, ㄷ, ㄹ, ㅁ'
assert r['items'][7]['candidate']=='ㄱ, ㄷ, ㅁ, ㅂ (원본처럼 볼록한 사각형 기준)'
# A=(0,0), D=(7,0), C=(7,3), AB=9.  Both B positions below give angle ABC=55°.
# They are distinct convex quadrilaterals A-B-C-D with all original lengths and angle D.
a,c,d=(0.0,0.0),(7.0,3.0),(7.0,0.0)
ac=math.hypot(*c)
angle_b=math.radians(55)
angle_c=math.asin(9*math.sin(angle_b)/ac)
assert 0<angle_c<math.pi/2
points=[]
for angle_c_choice in [angle_c,math.pi-angle_c]:
    angle_a=math.pi-angle_b-angle_c_choice
    theta=math.atan2(c[1],c[0])+angle_a
    b=(9*math.cos(theta),9*math.sin(theta))
    poly=[a,b,c,d]
    cross=[(poly[(i+1)%4][0]-poly[i][0])*(poly[(i+2)%4][1]-poly[(i+1)%4][1])-(poly[(i+1)%4][1]-poly[i][1])*(poly[(i+2)%4][0]-poly[(i+1)%4][0]) for i in range(4)]
    assert max(cross)<0 or min(cross)>0
    ba=(a[0]-b[0],a[1]-b[1]);bc=(c[0]-b[0],c[1]-b[1])
    measured=math.acos((ba[0]*bc[0]+ba[1]*bc[1])/(math.hypot(*ba)*math.hypot(*bc)))
    assert abs(measured-angle_b)<1e-12
    points.append(b)
assert math.dist(*points)>1
print('PASS: page 86 construction states and two distinct SSA solutions; uncertain cases remain unconnected')
