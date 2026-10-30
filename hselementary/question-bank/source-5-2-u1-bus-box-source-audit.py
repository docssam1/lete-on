"""Check printed page 5 bus interpretation and constructive box allocations."""
from math import ceil

# These are conditional on the stated numbers being exact minimum bus counts.
exact = [n for n in range(1, 1001) if ceil(n / 40) == 8 and ceil(n / 45) == 7]
assert exact == list(range(281, 316))
# If only lower bounds on the required numbers are stated, there is no upper bound.
for n in (1000, 10000, 100000):
    assert ceil(n / 40) >= 8 and ceil(n / 45) >= 7

feasible = []
for k in range(1, 1001):
    if 23 * k <= 1000 <= 33 * k:
        remaining = 1000 - 23 * k
        boxes = [23] * k
        for i in range(k):
            extra = min(10, remaining)
            boxes[i] += extra
            remaining -= extra
        assert remaining == 0 and sum(boxes) == 1000
        assert all(23 <= x <= 33 for x in boxes)
        feasible.append(k)
assert feasible == list(range(31, 44))
print('Bus: conditional 281–315; box counts: 31–43 with explicit allocations.')
