#!/usr/bin/env python3
"""Cross-check the page 88 #32 correspondence on parallelogram coordinates."""
import json
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==88)
item=next(x for x in r['items'] if x['number']==32)
assert item['candidate']=='삼각형 ㅁㄱㄹ; ①, ②, ③'
assert item['status']=='source-reviewed-answer-key-pending' and not r['publisherAnswerVerified']
assert r['runtimeConnection']=='not-connected'
def dist2(a,b): return (a[0]-b[0])**2+(a[1]-b[1])**2
def dot(a,b): return a[0]*b[0]+a[1]*b[1]
def sub(a,b): return (a[0]-b[0],a[1]-b[1])
# B=(0,0), C=(L,0), A=(-u,h), D=(L-u,h).
# DE=DC, with E distinct from C on BC, gives E=(L-2u,0).
for length in range(5,15):
    for u in range(1,(length+1)//2):
        for height in range(1,8):
            b=(0,0); c=(length,0); a=(-u,height); d=(length-u,height); e=(length-2*u,0)
            assert 0<e[0]<c[0] and dist2(d,e)==dist2(d,c)
            # D-B-C corresponds to E-A-D: all three sides match (SSS).
            assert [dist2(d,b),dist2(b,c),dist2(c,d)]==[dist2(e,a),dist2(a,d),dist2(d,e)]
            # Equality of the two included-angle dot products verifies the SAS angle.
            assert dot(sub(b,c),sub(d,c))==dot(sub(a,d),sub(e,d))
print('PASS: page 88 #32 corresponding sides and included angle; publisher answer pending')
