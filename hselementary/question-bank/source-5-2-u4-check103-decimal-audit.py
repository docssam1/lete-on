#!/usr/bin/env python3
"""Verify decimals, rounding bounds and inverse multiplication on page 103."""
import json
from decimal import Decimal as D
from fractions import Fraction as F
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 103)
assert {i["number"] for i in review["items"]} == set(range(17,25))
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
assert D(3800)*(1+D('1.75')+D('1.75')*D('0.8'))==D(15770)
assert D('0.75')*90*15==D('1012.5')
assert D(720)*D('2.25')-1500==D(120)
assert (D(150)+D(150)*D('0.6'))*D('0.4')-D(150)*D('0.4')==D(36)
assert D('0.06')*2**8==D('15.36')
# Positive numerators must satisfy a/5<.65 and b/8<.65; enumerate a=1..3, b=1..5.
pairs=[(a,b) for a in range(1,4) for b in range(1,6) if F(11,20)<=F(a,5)+F(b,8)<F(13,20)]
assert pairs==[(1,3)]
assert D(26352)/10==D('12.2')*216
assert D(26352)-D(26352)/10==D('23716.8')
assert D('23.2')*12==D('278.4')
assert D('2784')-D('278.4')==D('2505.6')
print('Page 103 decimals and rounding checks passed; publisher answers remain unverified.')
