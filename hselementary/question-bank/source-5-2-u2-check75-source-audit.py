#!/usr/bin/env python3
"""Check page 75 exact fraction candidates without publishing the source."""
import json
from fractions import Fraction as F
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u2-readiness-review.json').read_text())
review=next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage']==75)
assert review['sourcePdfPage']==71 and review['runtimeConnection']=='not-connected'
assert review['publisherAnswerVerified'] is False
assert [x['number'] for x in review['items']]==list(range(1,9))
values={'ㄱ':F(4,5)*15,'ㄴ':F(17,8)*6,'ㄷ':F(5,9)*24,'ㄹ':F(16,7)*5}
assert sorted(values,key=values.get,reverse=True)==['ㄷ','ㄴ','ㄱ','ㄹ']
assert 4*F(5,6)+8*F(7,12)==8
assert (F(23,4)-F(11,7))*4==F(117,7)
assert 8000*F(11,8)*3==33000
assert (20*F(3,5))*(20*F(3,4))==180
assert 87*(2+F(20,60))==203
assert (21*F(6,7))*F(29,9)==58
assert (72*F(4,9))*F(9,8)==36
print('PASS: page 75 exact fractions, order, perimeter and shaded area; source remains unconnected')
