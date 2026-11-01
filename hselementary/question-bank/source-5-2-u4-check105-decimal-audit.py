#!/usr/bin/env python3
"""Verify printed page 105 calculations from the alternate scan."""
import json
from decimal import Decimal as D
from fractions import Fraction as F
from pathlib import Path

path=Path(__file__).parent/'source-inventory/5-2-u4-readiness-review.json'
review=next(r for r in json.loads(path.read_text())['additionalSourceReviews'] if r['sourcePrintedPage']==105)
assert review['sourcePdfPage'] is None and review['alternateSourcePdfPage']==100
assert {i['number'] for i in review['items']}==set(range(31,39))
assert review['publisherAnswerVerified'] is False and review['runtimeConnection']=='not-connected'
assert D('3.7')*(D(210)/60)==D('12.95')
assert D('.8')*(D(25)+D(45)/60)==D('20.6')
assert D('.83')*(D('5.7')*60/10)==D('28.386')
assert D('79.36')*(D(4)+D(45)/60)*14==D('5277.44')
assert D('19.36')*D('7.5')==D('145.2')
assert (D(75)*D('.8')-D('11.7'))*D('1.3')==D('62.79')
assert D('.7')*D('1.4')*D('2.1')==D('2.058')
# The shared diagonal has equal slopes in both rectangles; test multiple valid sizes.
for left_width in (F(1),F(3),F(7)):
    right_width=F(35,4); lower_height=F(16,5)
    upper_height=right_width*lower_height/left_width
    assert left_width*upper_height==28
print('Page 105 alternate-scan calculations passed; source and publisher answers remain unverified.')
