#!/usr/bin/env python3
"""Check page 78 arithmetic and recorded source-review status."""
import json
from fractions import Fraction as F
from functools import reduce
from itertools import permutations
from operator import mul
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u2-readiness-review.json').read_text())
review = next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage'] == 78)
assert review['sourcePdfPage'] == 74 and review['runtimeConnection'] == 'partial-verified-local'
assert review['publisherAnswerVerified'] is False
assert all(item['status'] == 'public-independent-verification-publisher-key-pending'
           for item in review['items'])
assert [x['number'] for x in review['items']] == list(range(25, 33))
assert [n for n in range(1,100) if F(1,2)*F(1,n)>F(1,15)] == list(range(1,8))
assert F(16,7)*F(7,4)-F(7,4)*F(3,8)==F(107,32)
assert F(8,3)**2-2*F(8,3)*F(2,3)+F(2,3)**2==4
mixed=[a+F(b,c) for a,b,c in permutations([3,5,8]) if b<c]
assert len(mixed)==3 and reduce(mul,mixed,F(1))==F(53621,320)
proper=[F(a,b) for a,b in permutations([4,5,8],2) if a<b]
assert len(proper)==3 and reduce(mul,proper,F(1))==F(1,4)
assert F(24,71)*F(71,212)==F(6,53)
terms=[term for k in range(1,55) for term in (F(2*k+3,2*k+1),F(k+2,k+1))]
assert len(terms)==108 and reduce(mul,terms,F(1))==1036
assert F(64,5)/8*F(5,7)/4==F(2,7)
assert [i['candidate'] for i in review['items']]==['1, 2, 3, 4, 5, 6, 7','3과 11/32','4','167과 181/320','1/4','6/53','1036','2/7m']
print('PASS: page 78 fractions, card enumeration and 108-term product; review record is partially connected')
