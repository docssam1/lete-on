"""Check source-requested inequality wording and bus-count interpretation."""
from math import ceil
intersections=[i for i in range(41) if i<=33 and i<=21 and 33+21-i<=40]
assert intersections==list(range(14,22))
assert all((13<n<=21)==(n in intersections) for n in range(41))
boxes=[k for k in range(1,366) if 33*k<=365<=42*k]
assert boxes==[9,10,11]
exact=[n for n in range(1,1000) if ceil(n/40)==8 and ceil(n/45)==7]
assert exact==list(range(281,316))
assert all((280<n<316)==(n in exact) for n in range(1,1000))
# Merely needing at least 8 and at least 7 permits 800 students, hence no finite upper bound.
assert ceil(800/40)>=8 and ceil(800/45)>=7 and 800 not in exact
print('Overlap: 13 < n ≤ 21; boxes 9..11; exact minimum bus counts: 280 < n < 316; lower bounds alone do not give an upper bound')
