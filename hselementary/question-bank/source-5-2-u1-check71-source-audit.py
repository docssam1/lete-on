#!/usr/bin/env python3
"""Check page 71 arithmetic and recorded source-review status."""
import itertools
import json
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u1-readiness-review.json').read_text())
review = next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage'] == 71)
assert review['sourcePdfPage'] == 67 and review['runtimeConnection'] == 'partial-verified-local'
assert review['publisherAnswerVerified'] is False
expected_statuses = {25: 'public-independent-verification-publisher-key-pending', 26: 'public-independent-verification-publisher-key-pending', 27: 'public-independent-verification-publisher-key-pending', 28: 'public-independent-verification-publisher-key-pending', 29: 'public-independent-verification-publisher-key-pending', 30: 'public-independent-verification-publisher-key-pending', 31: 'public-independent-verification-publisher-key-pending', 32: 'source-ambiguity-answer-key-pending'}
assert {item['number']: item['status'] for item in review['items']} == expected_statuses
assert [x['number'] for x in review['items']] == list(range(25, 33))
round_up = lambda n, unit: (n + unit//2)//unit*unit
nums = [int(''.join(p)) for p in itertools.permutations(['46', '8', '60', '39'])]
assert (min(nums), max(nums)) == (3946608, 8604639)
assert round_up(max(nums)-min(nums), 1000) == 4658000
nums = [int(''.join(p)) for p in itertools.permutations('25317')]
a, b = (min(nums, key=lambda n: abs(n-target)) for target in (50000,70000))
assert (a,b,round_up(abs(b-a),1000)) == (51237,71235,20000)
nums = [int(''.join(p)) for p in itertools.permutations('34567')]
assert len([n for n in nums if round_up(n,10000) == 50000]) == 30
assert [n for n in range(300000,400000) if n%100==61 and n//100%10*2==n//1000%10 and n//10000==37 and round_up(n,10000)==380000] == [376361,378461]
assert (736+5)//6 == 123 and (3980+49)//50*800 == 64000
assert (80*130+499)//500 == 21 and (80*35+499)//500 == 6
assert divmod(495,40) == (12,15)
assert 12*92700//10000 == 111 and 13*92700//10000 == 120
assert review['items'][7]['status'] == 'source-ambiguity-answer-key-pending'
print('PASS: page 71 card permutations, rounding and resource counts; rice packing held pending')
