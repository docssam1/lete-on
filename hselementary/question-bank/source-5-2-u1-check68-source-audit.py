#!/usr/bin/env python3
"""Check page 68 source boundaries and current review status."""
import json
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u1-readiness-review.json').read_text())
review = next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage'] == 68)
assert review['sourcePdfPage'] == 64 and review['runtimeConnection'] == 'partial-verified-local'
assert all(item['status'] == 'public-independent-verification-publisher-key-pending'
           for item in review['items'][:7])
assert review['publisherAnswerVerified'] is False
assert [x['number'] for x in review['items']] == list(range(1, 9))
assert [n for n in range(24, 37) if 28 < n <= 35 and 26 <= n < 33] == [29, 30, 31, 32]
assert len([n for n in range(1, 100) if 25 < n <= 45]) == 20
assert len([n for n in range(1, 100) if 8 <= n < 30]) == 22
pairs = [(a, b) for a in range(10, 100) for b in range(10, 100) if b-a-1 == 42]
assert max(a for a, b in pairs) == 56 and (56, 99) in pairs
assert len([n for n in range(1, 100) if 54 < n < 99]) == 44
buses = lambda n: (n + 44) // 45
assert buses(135) == 3 and buses(136) == 4 and buses(180) == 4 and buses(181) == 5
assert all((buses(n) >= 4) == (n > 135) for n in range(1, 1001))
assert review['items'][7]['status'] == 'source-ambiguity-answer-key-pending'
print('PASS: page 68 boundary and count checks; review record marks items 1–7 public and item 8 source-ambiguous')
