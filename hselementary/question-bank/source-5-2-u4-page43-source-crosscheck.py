"""Cross-check the printed page 43 candidate calculations with exact fractions."""
from fractions import Fraction as F
from pathlib import Path
import json

items = json.loads((Path(__file__).parent / 'source-inventory/5-2-u4-readiness-review.json').read_text())['items']
by_id = {item['sourceItemId']: item for item in items}
mission = lambda n: by_id[f'5-2-u4-e1-mission-{n}']

products = (F(46, 100)*75, F(6, 10)*490, F(12, 100)*274, 23*F(92, 100))
assert products == (F(345, 10), 294, F(3288, 100), F(2116, 100))
field = 42*25
cabbage = field*F(16, 100)
sweet = (field-cabbage)*F(35, 100)
assert sweet-cabbage == F(1407, 10)
assert '남은 넓이' in ' '.join(mission(2)['conditions'])
assert mission(2)['independentAnswer'].startswith('140.7m²')

seconds = F(7, 100)*24*60*60
assert seconds == 6048 == 3600+40*60+48
assert F(1842, 100) + 299*F(357, 100) == F(108585, 100)
assert 16*(F(43, 10)-F(6, 10)) == F(592, 10)
integers = [n for n in range(1, 200) if F(245, 100) <= F(n, 53) < F(255, 100)]
assert integers == list(range(130, 136)) and sum(integers) == 795
print('Page 43: six source candidates checked with exact rational arithmetic; publisher key unverified.')
