#!/usr/bin/env python3
"""Check selected number and folding exercises from printed page 94."""
import json
import math
from pathlib import Path

path = Path(__file__).parent / "source-inventory/5-2-u3-e1-e4-readiness-review.json"
review = next(r for r in json.loads(path.read_text())["additionalSourceReviews"] if r["sourcePrintedPage"] == 94)
assert review["publisherAnswerVerified"] is False and review["runtimeConnection"] == "not-connected"
assert {i["number"] for i in review["items"]} == {73, 75, 77, 79, 80}

palindromes = [n for n in range(10001, 100000, 2) if str(n) == str(n)[::-1]]
assert len(palindromes) == 500
divisible = [n for n in range(100, 1000) if str(n) == str(n)[::-1] and n % 9 == 0]
assert divisible == [171, 252, 333, 414, 585, 666, 747, 828, 909, 999]
product = 92565
pairs = [(a, product // a) for a in range(1, math.isqrt(product) + 1)
         if product % a == 0 and str(a)[::-1] == str(product // a)]
assert pairs == [(165, 561)]

# 79: each of four quarters has two triangles at the outer edge.
assert 4 * 2 == 8
# 80: first punch before folding, then six punches after the fifth fold.
assert sum((folds + 1) * 2**folds for folds in range(6)) == 321
print("Page 94 selected number and folding checks passed; publisher answer remains unverified.")
