from decimal import Decimal
from pathlib import Path
import json

items = json.loads((Path(__file__).parent / 'source-inventory/5-2-u4-readiness-review.json').read_text())['items']
record = next(x for x in items if x['sourceItemId'] == '5-2-u4-e1-example-1-3')
candidates = [Decimal(n) / 10 for n in range(455, 460)]
products = [x * Decimal('16.8') for x in candidates]
matches = [x for x, product in zip(candidates, products) if int(product * 100) % 10 == 6]
assert matches == [Decimal('45.7')]
assert record['independentAnswer'].startswith('45.7')
assert record['resultContract'] == 'single-value'
assert any('16.8' in condition for condition in record['conditions'])
print('Page 42 Example 1-3: additional hundredths-digit condition selects 45.7; publisher key unverified.')
