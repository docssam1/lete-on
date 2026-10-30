from fractions import Fraction
from pathlib import Path
import json

counts = {}
for input_noninteger in (False, True):
    for output_noninteger in (False, True):
        values = []
        for n in range(13, 40):
            x, product = Fraction(n, 10), Fraction(25*n, 100)
            if input_noninteger and x.denominator == 1:
                continue
            if (product * 10).denominator != 1:
                continue
            if output_noninteger and product.denominator == 1:
                continue
            values.append(n)
        counts[input_noninteger, output_noninteger] = values
assert [len(counts[k]) for k in ((False, False), (False, True), (True, False), (True, True))] == [13, 7, 11, 6]
assert counts[True, True] == [14, 18, 22, 26, 34, 38]
items = json.loads((Path(__file__).parent / 'source-inventory/5-2-u4-readiness-review.json').read_text())['items']
record = next(x for x in items if x['sourceItemId'] == '5-2-u4-e2-mission-6')
assert record['independentAnswer'].startswith('6개') and not record['singleAnswer']
print('Mission 6: input/product tenths conventions enumerated; official answer remains unverified.')
