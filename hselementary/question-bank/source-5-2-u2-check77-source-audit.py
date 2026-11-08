#!/usr/bin/env python3
"""Check page 77 arithmetic and recorded source-review status."""
import json
from fractions import Fraction as F
from functools import reduce
from operator import mul
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u2-readiness-review.json').read_text())
review = next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage'] == 77)
assert review['sourcePdfPage'] == 73 and review['runtimeConnection'] == 'partial-verified-local'
assert review['publisherAnswerVerified'] is False
assert all(item['status'] == 'public-independent-verification-publisher-key-pending'
           for item in review['items'])
assert [item['number'] for item in review['items']] == list(range(17, 25))
assert 1025 * F(4, 5) * F(7, 10) * F(1, 2) == 287
assert (F(7, 3) - F(8, 5)) * 75 == 55
assert 18 * F(3, 5) == F(54, 5)
assert [n for n in range(1, 100) if (F(n, 7) / F(2, 5)).denominator == 1] == list(range(14, 100, 14))
values = {'ㄱ': F(4, 5)*F(3, 10), 'ㄴ': F(3, 4)*F(5, 9), 'ㄷ': F(5, 8)*F(4, 7), 'ㄹ': F(9, 11)*F(7, 12)}
assert sorted(values, key=values.get, reverse=True) == ['ㄹ', 'ㄴ', 'ㄷ', 'ㄱ']
assert [F(4,9)*F(3,7)*F(5,8), F(5,6)*9*F(6,5), F(35,6)*F(16,7)*F(11,4), F(33,8)*F(56,11)*F(11,6)] == [F(5,42), 9, F(110,3), F(77,2)]
a = reduce(mul, (F(n, n-1) for n in range(4,13,2)), F(1))
b = reduce(mul, (F(n, n-1) for n in range(5,14,2)), F(1))
assert a*b == F(13,3)
assert reduce(mul, (1-F(1,n) for n in range(11,1001)), F(1)) == F(1,100)
assert [i['candidate'] for i in review['items']] == ['287명','55km','10과 4/5km','7개','ㄹ, ㄴ, ㄷ, ㄱ','(1) 5/42, (2) 9, (3) 36과 2/3, (4) 38과 1/2','4와 1/3','1/100']
print('PASS: page 77 exact fractions, comparison and telescoping products; review record is partially connected')
