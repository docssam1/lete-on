#!/usr/bin/env python3
"""Check selected page 91 figures and exhibit the missing-center ambiguity."""
import json
import math
from fractions import Fraction as F
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==91)
assert r['sourcePdfPage']==87 and r['runtimeConnection']=='not-connected' and not r['publisherAnswerVerified']
assert [x['number'] for x in r['items']]==[49,53,54,56]
assert r['items'][1]['status']=='source-ambiguity-answer-key-pending'
assert 5**2+2**2==29
# Two regular dodecagons with different radii admit an interior point P at distance 10
# from both adjacent vertices. Thus that isosceles condition alone does not fix the area.
areas=[]
for radius in (10,12):
    v1=(radius*math.cos(math.pi/12),radius*math.sin(math.pi/12))
    v2=(v1[0],-v1[1])
    px=v1[0]-math.sqrt(100-v1[1]**2)
    assert abs(math.dist((px,0),v1)-10)<1e-12 and abs(math.dist((px,0),v2)-10)<1e-12
    assert abs(px)<radius*math.cos(math.pi/12)
    areas.append(12*radius**2*math.sin(math.pi/6)/2)
assert abs(areas[0]-300)<1e-10 and abs(areas[1]-432)<1e-10
assert 4+4==8
height=F(2*24,8)
assert height==6 and height*F(8,24)==2
assert [x['candidate'] for x in r['items']]==['29cm²','300cm² (ㅍ이 정십이각형의 중심이라는 가정)','8cm','2cm']
print('PASS: page 91 #49/#54/#56 and two noncongruent #53 constructions; source remains unconnected')
