#!/usr/bin/env python3
"""Independently verify the source page 80 calculation candidates."""
import json
from fractions import Fraction as F
from pathlib import Path

record = json.loads((Path(__file__).parent / 'source-inventory/5-2-u2-readiness-review.json').read_text())
r = next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage'] == 80)
assert r['sourcePdfPage'] == 76 and r['runtimeConnection'] == 'partial-verified-local'
assert r['publisherAnswerVerified'] is False
assert [x['number'] for x in r['items']] == list(range(41, 49))
for item in r['items']:
    assert item['status'] == 'public-independent-verification-publisher-key-pending'
    assert item['runtimeTypeId'] == f"5-2-u2-practice-{item['number']}-original"
    assert item['publisherAnswerVerified'] is False
assert (F(16,3)+F(32,5))*F(5,2) == F(88,3)
assert (F(23,8)+F(7,2))*F(11,6) == F(187,16)
assert (F(8,3)+F(21,4))*F(28,5) == F(133,3)
assert F(1000+80,120)*255 == 2295
assert F(22,1)/F(2,24)*F(11,24) == 121
assert (F(135,16)-7)*7 == F(161,16)
assert ((F(2,3)+F(1,6))/2)*((F(2,3)-F(1,6))/2) == F(5,48)
assert (1+F(1,3))*(1-F(1,3)) == F(8,9)
assert [x['candidate'] for x in r['items']] == ['29와 1/3km','11과 11/16km','44와 1/3km','2295m','121명','10과 1/16','240','8/9배']
print('PASS: page 80 exact movement, tunnel, fractions, area and source connections; publisher key pending')
