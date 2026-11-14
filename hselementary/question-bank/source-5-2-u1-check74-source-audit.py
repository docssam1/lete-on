#!/usr/bin/env python3
"""Check page 74 arithmetic and recorded source-review status."""
import json
from pathlib import Path

record=json.loads((Path(__file__).parent/'source-inventory/5-2-u1-readiness-review.json').read_text())
review=next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage']==74)
assert review['sourcePdfPage']==70 and review['runtimeConnection']=='partial-verified-local'
assert review['publisherAnswerVerified'] is False
expected_statuses = {49: 'public-independent-verification-publisher-key-pending', 50: 'public-independent-verification-publisher-key-pending', 51: 'public-independent-verification-publisher-key-pending', 52: 'public-independent-verification-publisher-key-pending', 53: 'public-independent-verification-publisher-key-pending', 54: 'public-independent-verification-publisher-key-pending', 55: 'public-independent-verification-publisher-key-pending', 56: 'public-independent-verification-publisher-key-pending'}
assert {item['number']: item['status'] for item in review['items']} == expected_statuses
assert [x['number'] for x in review['items']]==list(range(49,57))
ceil=lambda n,u:(n+u-1)//u*u
floor=lambda n,u:n//u*u
round_up=lambda n,u:(n+u//2)//u*u
people=[n for n in range(1,1000) if round_up(n,100)==600]
assert (min(people),max(people),max(2*n-1200 for n in people))==(550,649,98)
assert [n for n in range(1300,1500) if round_up(n,100)==1400 and floor(n,10)==1370 and n%10==2*(n//100%10)]==[1376]
assert all(ceil(n,10)==30 for n in [27,28,29,30]) and ceil(31,10)==40
values=[n for n in range(1,2000) if floor(n//8,10)==120]
assert (min(values),max(values),max(values)-min(values))==(960,1039,79)
values=[n for n in range(1,5000) if ceil(9*n,1000)==30000]
assert (min(values),max(values),len(values))==(3223,3333,111)
values=[n for n in range(1,1000) if floor(n//15,10)==30 and round_up(n//11,10)==40]
assert (min(values),max(values),len(values))==(450,494,45)
assert [d for d in range(10) if sum(round_up(n,1000) for n in (63507,48035+100*d,57304))==170000]==[5,6,7,8,9]
assert round_up(284999,10000)==280000 and round_up(155000,10000)==160000
assert 284999-155000==129999
print('PASS: page 74 rounding, digit, count and graph candidates; review record is partially connected')
