#!/usr/bin/env python3
"""Check calculations and geometric consistency using the alternate page 104 scan."""
import json
from decimal import Decimal as D
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 104)
assert review["sourcePdfPage"] is None and review["alternateSourcePdfPage"] == 99
assert {i["number"] for i in review["items"]} == set(range(25,31))
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"

values=[D('2.38')*D('3.14')-D('1.28')*D('.9'), D(17)*D('9.5')+D('2.1')*9,
        (D('37.5')+D('12.5'))*2*D('3.65'), 5*D('8.75')-D('1.2')*D('.46')+D('.74')*8,
        D('.24')*13+D('.02')*26-D('.06')*39,
        (D('3.78')*D('6.1')-D('2.07')*D('1.4'))*D('.3')]
assert values==list(map(D,['6.3212','180.4','365','49.118','1.3','6.048']))
assert (D('12.4')/1240)*(D('3.82')*D('4.5'))*((D('12.5')*D('4.2')-D('44.5'))/D('.008'))==D('171.9')
assert D('13.5')*D('8.4')*D('.65')==D('73.71')
assert D('5.08')*D('2.6')==D('13.208')
assert D('15.4')*D('7.3')-7*D('2.6')==D('94.22')
assert D('6.21')*D('7.3')-3*(D('7.3')-4-D('1.5'))==D('39.933')
assert (D('7.2')-D('4.8'))**2+D('10.5')**2==D('116.01')
assert 6**2+8**2==100 and D('116.01')!=100
assert D('.2')*D('.7')==D('.14') and D('.7')-D('.2')==D('.5')
assert D('-.7')*D('-.2')==D('.14') and D('-.2')-D('-.7')==D('.5')
print('Page 104 alternate-scan checks passed; source and publisher answers remain unverified.')
