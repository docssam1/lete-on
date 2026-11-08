#!/usr/bin/env python3
"""Check page 73 arithmetic and recorded source-review status."""
import json
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u1-readiness-review.json').read_text())
review = next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage'] == 73)
assert review['sourcePdfPage'] == 69 and review['runtimeConnection'] == 'partial-verified-local'
assert review['publisherAnswerVerified'] is False
expected_statuses = {41: 'public-independent-verification-publisher-key-pending', 42: 'public-independent-verification-publisher-key-pending', 43: 'public-independent-verification-publisher-key-pending', 44: 'public-independent-verification-publisher-key-pending', 45: 'public-independent-verification-publisher-key-pending', 46: 'public-independent-verification-publisher-key-pending', 47: 'public-independent-verification-publisher-key-pending', 48: 'public-independent-verification-publisher-key-pending'}
assert {item['number']: item['status'] for item in review['items']} == expected_statuses
assert [x['number'] for x in review['items']] == list(range(41, 49))
ceil = lambda n,u: (n+u-1)//u*u
floor = lambda n,u: n//u*u
round_up = lambda n,u: (n+u//2)//u*u
assert [n for n in range(10289998,10300002) if floor(n,10000)==10290000] == list(range(10290000,10300000))
a = [n for n in range(1,100) if round_up(n,10)==70]
b = [n for n in range(1,100) if round_up(n,10)==80]
assert (min(a)+min(b),max(a)+max(b)) == (140,158)
assert len([n for n in range(1,1001) if round_up(n,100)==600]) + len([n for n in range(1,1001) if floor(n,100)==600]) == 200
assert [n for n in range(1,100) if floor(n,10)==50 and round_up(n,10)==60] == list(range(55,60))
assert [n for n in range(400,701) if ceil(n,100)==600 and round_up(n,100)==500] == list(range(501,550))
a=[n for n in range(13000,15000) if ceil(n,100)==14000]
b=[n for n in range(13000,15000) if floor(n,10)==14000]
assert max(abs(x-y) for x in a for y in b) == 108
assert [n for n in range(2300,2601) if ceil(n,100)==2500 and floor(n,100)==2400 and round_up(n,10)==2500] == list(range(2495,2500))
valid=[n for n in range(7810000,7840001) if ceil(n,10000)==7830000 and floor(n,10000)==7820000 and round_up(n,10000)==7820000]
assert len(valid)==4999 and (min(valid),max(valid))==(7820001,7824999)
print('PASS: page 73 rounding-boundary candidates and extrema; review record is partially connected')
