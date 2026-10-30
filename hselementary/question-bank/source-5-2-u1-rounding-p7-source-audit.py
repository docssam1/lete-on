"""Independent arithmetic checks for printed grade 5-2 unit 1 page 7."""
from itertools import permutations

def ceil(n, unit):
    return (n + unit - 1) // unit * unit

def round_half_up(n, unit):
    return (n + unit // 2) // unit * unit

assert [[ceil(n, u) for u in (10, 100, 1000)] for n in (4721, 7698)] == [[4730, 4800, 5000], [7700, 7700, 8000]]
assert [abs(ceil(n, 100) - round_half_up(n, 1000)) for n in (72462, 351716)] == [500, 200]
nums = [int(''.join(p)) for p in permutations('083914') if p[0] != '0']
nearest = min(nums, key=lambda n: abs(n - 400000))
assert nearest == 401389 and sum(abs(n - 400000) == 1389 for n in nums) == 1
assert round_half_up(nearest, 1000) == 401000
assert [d for d in range(10) if (465000 + 100*d + 32)//1000*1000 == round_half_up(465000 + 100*d + 32, 1000)] == list(range(5))
assert sum(ceil(n, 100) == n//100*100 == round_half_up(n, 100) for n in range(1000, 10000)) == 90
assert sum(ceil(n, 10) == round_half_up(n, 10) and ceil(n, 100) != round_half_up(n, 100) for n in range(100, 1000)) == 261
print('Source p7 Missions 1–6: table, 500/200, 401000, 0–4, 90, 261 checked.')
