#!/usr/bin/env python3
"""Check page 69 arithmetic and recorded source-review status."""
import json
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u1-readiness-review.json').read_text())
review = next(r for r in record['additionalSourceReviews'] if r['sourcePrintedPage'] == 69)
assert review['sourcePdfPage'] == 65 and review['runtimeConnection'] == 'partial-verified-local'
assert review['publisherAnswerVerified'] is False
expected_statuses = {9: 'public-independent-verification-publisher-key-pending', 10: 'public-independent-verification-publisher-key-pending', 11: 'source-ambiguity-answer-key-pending', 12: 'public-independent-verification-publisher-key-pending', 13: 'source-ambiguity-answer-key-pending', 14: 'public-independent-verification-publisher-key-pending', 15: 'public-independent-verification-publisher-key-pending', 16: 'public-independent-verification-publisher-key-pending'}
assert {item['number']: item['status'] for item in review['items']} == expected_statuses
assert [x['number'] for x in review['items']] == list(range(9, 17))
assert 150 + 24 * 200 < 5000 <= 150 + 25 * 200
assert (90 / 9, 216 / 9) == (10, 24)
assert len([hundredths for hundredths in range(314, 960) if 314 < hundredths < 959]) == 644
assert min(n for n in range(1, 37) if 3*n <= 36 <= 6*n) == 6
assert max(n for n in range(1, 37) if 3*n <= 36 <= 6*n) == 12
assert all(len([n for n in range(30, upper+1) if n % 4 == 0]) == 35 for upper in range(168, 172))
assert len([n for n in range(30, 168) if n % 4 == 0]) == 34
assert len([n for n in range(30, 173) if n % 4 == 0]) == 36
candidates = [n for n in range(20001, 50000) if n//10000 >= 4 and n//1000%10 == 0 and n//10%10 == 0 and n//100%10+n%10 == 18]
assert candidates == [40909]
assert [n for n in range(1, 300) if (n+3)//4 == 61 and (n+5)//6 == 41] == [241, 242, 243, 244]
assert review['items'][4]['status'] == 'source-ambiguity-answer-key-pending'
print('PASS: page 69 counting and boundary candidates; exchange wording held pending')
