#!/usr/bin/env python3
"""Check page 72 calculation candidates independently without publishing the source."""
import json
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u1-readiness-review.json').read_text())
review = next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage'] == 72)
assert review['sourcePdfPage'] == 68 and review['runtimeConnection'] == 'not-connected'
assert review['publisherAnswerVerified'] is False
assert [x['number'] for x in review['items']] == list(range(33, 41))
assert (600-2*120-3*90)//25 == 3
perimeter_mm = 2*(447+572)
assert perimeter_mm == 2038 and (perimeter_mm+5)//10 == 204
money = 13*10000 + 57*1000 + 614*500 + 2978*100 + 307*50
assert divmod(money,5000) == (161,2150)
assert (85+7)//8*6000 == 66000 and (85+11)//12*10000 == 80000
assert divmod(1287,30) == (42,27) and (1287//30)*8 == 336
assert ((127*18+99)//100)*800 == 18400
sundays = sum(1 for day in range(365) if day%7 == 0)
assert sundays == 53 and divmod(365*3+sundays,20) == (57,8)
options = [(100*a+10*b, 420000*a+45000*b) for a in range(8) for b in range(60) if 100*a+10*b >= 474]
assert min(cost for people,cost in options) == 2040000
print('PASS: page 72 quantities, perimeter, weekday count, and bundle minimum; source remains unconnected')
