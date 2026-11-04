#!/usr/bin/env python3
"""Verify cuboid counts and an explicit mixed-orientation packing."""
import json
import math
from itertools import permutations
import runpy
from pathlib import Path

path=Path(__file__).parent/'source-inventory/5-2-u5-readiness-review.json'
review=next(r for r in json.loads(path.read_text())['additionalSourceReviews'] if r['sourcePrintedPage']==108)
assert review['sourcePdfPage']==102 and review['alternateSourcePdfPage']==103
assert {i['number'] for i in review['items']}==set(range(1,9))
assert review['publisherAnswerVerified'] is False
assert all(item['runtimeTypeId'] == f"5-2-u5-practice-{item['number']}-original" for item in review['items'])
assert all(item['status'] == 'public-independent-verification-publisher-key-pending' for item in review['items'])
assert 4*(7+6+3)==64
assert math.comb(6,2)*math.comb(5,2)*math.comb(4,2)==900
assert 4*(32+8+8)==192
assert math.gcd(math.gcd(30,45),15)==15 and (30//15)*(45//15)*(15//15)==6
assert 12*15==180

# Independently validate the current 66-object construction and volume upper bound.
runpy.run_path(str(Path(__file__).with_name('source-5-2-u5-check108-packing-audit.py')))
assert max((25//w)*(20//d)*(16//h) for w,d,h in permutations((4,5,6)))==64
print('Page 108 cuboid checks and 66-item mixed-orientation packing passed; publisher answers remain unverified.')
