#!/usr/bin/env python3
"""Check page 76 arithmetic and recorded source-review status."""
import json
from fractions import Fraction as F
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u2-readiness-review.json').read_text())
review = next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage'] == 76)
assert review['sourcePdfPage'] == 72 and review['runtimeConnection'] == 'partial-verified-local'
assert review['publisherAnswerVerified'] is False
assert all(item['status'] == 'public-independent-verification-publisher-key-pending'
           for item in review['items'])
assert [item['number'] for item in review['items']] == list(range(9, 17))
answers = [
    180 * (1 - F(5, 12)) * F(10, 21),
    300 * (1 - F(2, 5)) * (1 - F(5, 6)),
    300 * F(7, 15) * (1 - F(3, 14)) + 300 * (1 - F(7, 15)) * (1 - F(3, 8)),
    225 * (1 - F(3, 5)) * F(4, 9),
    480 * (1 - F(2, 3)) * F(1, 4),
    380 * (1 - F(2, 5)) * (1 - F(1, 3)),
]
assert answers == [50, 30, 210, 40, 40, 152]
assert 7 * 24 * F(3, 2) == 4 * 60 + 12
assert 14 * F(26, 15) * 60 == 24 * 60 + 16
assert [i['candidate'] for i in review['items']] == ['50쪽', '30개', '210명', '40명', '40L', '152쪽', '12시 4분 12초', '11시 35분 44초']
print('PASS: page 76 exact fraction and clock calculations; review record is partially connected')
