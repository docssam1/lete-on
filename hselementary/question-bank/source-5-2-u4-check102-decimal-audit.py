#!/usr/bin/env python3
"""Verify area, scale, overlap and decimal series on printed page 102."""
import json
from decimal import Decimal as D
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 102)
assert {i["number"] for i in review["items"]} == set(range(9,17))
assert review["publisherAnswerVerified"] is False
assert review["runtimeConnection"] == "partially-connected"
assert all(item["status"] == "public-independent-verification-publisher-key-pending"
           and item["runtimeTypeId"] == f"5-2-u4-practice-{item['number']}-original"
           for item in review["items"])
assert D('17.8')*9==D('160.2')
assert 11*D('2.5')+4*D('3.1')==D('39.9')
drawn_area=D(9)*15-D('4.5')*8
assert drawn_area*500**2/10000==D(2475)
assert (D(9)*5)*(D(15)*5)-(D('4.5')*5)*(D(8)*5)==D(2475)
assert D(15)*D('14.4')*2/18==D(24)
assert 9**2+12**2==15**2
assert (D('22.5')+5)*(D(12)+5)-D('22.5')*12==D('197.5')
assert (5*20-4*D('0.5'))-(10*10-9*D('0.5'))==D('2.5')
assert D(35)*D('0.4')-D(35)*D('0.6')*D('0.4')==D('5.6')
assert 340+(28-15)*D('0.6')==D('347.8')
sequence=[D('1.32')+D('0.03')*n for n in range(69)]
assert sequence[-1]==D('3.36') and sum(sequence)==D('161.46')
print('Page 102 scale, area and decimal calculations passed; publisher answers remain unverified.')
