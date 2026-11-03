#!/usr/bin/env python3
"""Check page 87 triangle inequalities, angle choices, and reflection pairs."""
import json
from itertools import combinations
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==87)
assert r['sourcePdfPage']==83 and r['runtimeConnection']=='partial-verified-local' and r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']]==list(range(17,25))
for item in r['items']:
    assert item['status']=='public-independent-verification-publisher-key-pending'
    assert item['runtimeTypeId']==f"5-2-u3-practice-{item['number']}-original"
    assert item['publisherAnswerVerified'] is False
assert 2+5<8 and 5+6>7 and 50+30<180
assert max(n for n in range(8,20) if n<5+7)==11
assert max(n for n in range(10,25) if n<8+9)==16
triangle=lambda a:a[0]+a[1]>a[2]
assert len([x for x in combinations([3,4,5,6,7],3) if triangle(x)])==9
assert len([x for x in combinations([40,60,70,90,120],2) if sum(x)<180])==7
intervals=list(combinations(range(5),2))
mirrored=lambda pair:(4-pair[1],4-pair[0])
assert len(intervals)==10 and sum(pair==mirrored(pair) for pair in intervals)==2
assert len({tuple(sorted((pair,mirrored(pair)))) for pair in intervals if pair!=mirrored(pair)})==4
assert len([n for n in range(1,20) if abs(8-5)<n<8+5])==9
assert len([x for x in [72,50,3,0,162,90] if 0<x<180])==5
assert len([x for x in combinations([4,6,7,8,13,16],3) if triangle(x)])==10
assert [x['candidate'] for x in r['items']]==['④, ⑤','(1) 11cm, (2) 16cm','9가지','7가지','4쌍','9개','5가지','10개']
print('PASS: page 87 triangle choices, reflection pairing and source connections; publisher key pending')
