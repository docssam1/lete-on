#!/usr/bin/env python3
"""Verify printed page 106 decimal calculations and strict bounds."""
import json
from decimal import Decimal as D
from pathlib import Path

path=Path(__file__).parent/'source-inventory/5-2-u4-readiness-review.json'
review=next(r for r in json.loads(path.read_text())['additionalSourceReviews'] if r['sourcePrintedPage']==106)
assert review['sourcePdfPage']==100 and review['alternateSourcePdfPage']==101
assert {i['number'] for i in review['items']}==set(range(39,47))
assert review['publisherAnswerVerified'] is False
assert review['runtimeConnection'] == 'partially-connected'
assert all(item['status'] == 'public-independent-verification-publisher-key-pending'
           and item['runtimeTypeId'] == f"5-2-u4-practice-{item['number']}-original"
           for item in review['items'])
assert (D(5)-4*D('.1'))*(D(8)-3*D('.1'))==D('35.42')
assert D('68.5')*D('2.4')+80*D('3.6')==D('452.4')
assert (D('4.8')+D('3.6'))*D('1.5')==D('12.6')
assert (D(48)/10+D('1.4')*6)*D('4.5')==D('59.4')
assert D('15.4')/10*D('1.5')-D('.15')==D('2.16')
assert D('87.5')*D('2.8')*D('.2')==D(49)
assert pow(8,150,10)==4
assert D('21.25')*D('7.75')==D('164.6875')
assert D('21.35')*D('7.85')==D('167.5975')
assert D('21.3499')*D('7.8499')<D('167.5975')
print('Page 106 decimals, exponent digit and rounding bounds passed; publisher answers remain unverified.')
