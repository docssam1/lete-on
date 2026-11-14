#!/usr/bin/env python3
"""Check page 70 arithmetic and recorded source-review status."""
import itertools
import json
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u1-readiness-review.json').read_text())
review = next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage'] == 70)
assert review['sourcePdfPage'] == 66 and review['runtimeConnection'] == 'partial-verified-local'
assert review['publisherAnswerVerified'] is False
expected_statuses = {17: 'public-independent-verification-publisher-key-pending', 18: 'public-independent-verification-publisher-key-pending', 19: 'public-independent-verification-publisher-key-pending', 20: 'public-independent-verification-publisher-key-pending', 21: 'public-independent-verification-publisher-key-pending', 22: 'public-independent-verification-publisher-key-pending', 23: 'public-independent-verification-publisher-key-pending', 24: 'public-independent-verification-publisher-key-pending'}
assert {item['number']: item['status'] for item in review['items']} == expected_statuses
assert [x['number'] for x in review['items']] == list(range(17, 25))
prices = [n for n in range(1, 4001) if 5 <= 4000 // n < 11]
assert prices == list(range(364, 801)) and 4000 // 400 == 10
assert [17 + 10 - overlap + 5 for overlap in range(11)] == list(range(32, 21, -1))
boxes = [n for n in range(1, 100) if 15*n <= 749 <= 25*n]
assert boxes == list(range(30, 50)) and 29*25+24 == 749 and 14*16+35*15 == 749
assert [n for n in range(123, 145) if n % 8 == 3 and (n+4) % 11 == 0] == [139]
ceil = lambda n, unit: (n+unit-1)//unit*unit
floor = lambda n, unit: n//unit*unit
half_up = lambda n, unit: (n+unit//2)//unit*unit
assert [(ceil(n,u),floor(n,u),half_up(n,u)) for n,u in [(37498,100),(26498,1000),(470586,10000)]] == [(37500,37400,37500),(27000,26000,26000),(480000,470000,470000)]
assert ceil(74805,100)-floor(74805,1000) == 900
assert [n for n in range(4800, 5201) if ceil(n,100)==floor(n,100)==half_up(n,100)==5000] == [5000]
nums = [int(''.join(p)) for p in itertools.permutations('291054') if p[0] != '0']
assert min(nums,key=lambda n:abs(n-900000)) == 901245
assert half_up(901245,1000) == 901000
print('PASS: page 70 purchase bounds, combinations and rounding candidates; review record is partially connected')
