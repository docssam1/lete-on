from decimal import Decimal, localcontext
from functools import reduce
from pathlib import Path
import json

first = (2019 * pow(7, 2019, 10)) % 10
with localcontext() as context:
    context.prec = 60
    product = reduce(lambda a, b: a*b, (Decimal(n)/100 for n in range(1, 11)), Decimal(1))
    text = format(product.normalize(), 'f')
places = len(text.partition('.')[2])
assert (first, text, places) == (7, '0.000000000000036288', 18)
items = json.loads((Path(__file__).parent / 'source-inventory/5-2-u4-readiness-review.json').read_text())['items']
record = next(x for x in items if x['sourceItemId'] == '5-2-u4-e2-example-2-3')
assert record['independentAnswer'].startswith('(7, 18)')
assert any('2019번' in condition for condition in record['conditions'])
print('Page 44 Example 2-3: repeated product digit 7 and 18 decimal places; publisher key unverified.')
