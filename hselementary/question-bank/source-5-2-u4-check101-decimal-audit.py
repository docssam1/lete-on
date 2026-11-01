#!/usr/bin/env python3
"""Verify exact decimal arithmetic for printed page 101."""
import json
from decimal import Decimal as D
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 101)
assert {i["number"] for i in review["items"]} == set(range(1,9))
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"

assert D(37)*D('0.021')*150 == D('116.55')
natural = int(D(8)*D('3.62'))
product = D(17)*D('1.37')
fractional = product-int(product)
outer = D(natural)*fractional
assert outer-int(outer)==D('0.12')
for value in (D('2.4'),D('1349.2')):
    assert abs(D('0.6758')*100-value*D('0.1'))==D('67.34')
assert (D('67.58')-D('67.34'))/D('0.1')==D('2.4')
assert (D('67.58')+D('67.34'))/D('0.1')==D('1349.2')
assert D(38)*D('0.004')==D('0.152')
assert D('85.5')*26==D(2223)
assert D('0.45')*(28-4)==D('10.8')
assert D(72000)-D('1186.25')*60==D(825)
assert D(48)*(D(5)+D(15)/60)==D(252)
print('Page 101 decimal calculations passed; publisher answers remain unverified.')
