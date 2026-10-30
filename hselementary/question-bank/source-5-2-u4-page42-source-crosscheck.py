"""Independent exact arithmetic for the remaining page 42 source candidates."""
from fractions import Fraction as F

assert sum([F(314, 100)] * 14) == F(4396, 100)
assert 64*2019*F(125, 1000)*F(25, 100)*F(5, 10) == 2019
assert F(54, 100)*19 - F(72, 100)*9 + F(18, 100)*39 - F(36, 100)*29 == F(36, 100)

# Allow either one or two omitted decimal places; test natural numbers exactly.
delta = F(314325, 100)
matches = [(n, places) for n in range(1, 5000) for places in (1, 2)
           if (F(127, 100)*n*10**places).denominator == 1
           and F(127, 100)*n*(10**places-1) == delta]
assert matches == [(25, 2)]
remaining = 180*(1-F(15, 100))
target_revenue = 45900*(1+F(2, 10))
assert remaining == 153 and target_revenue / remaining == 360
print('Page 42 exploration and Examples 1-1, 1-2, 1-4: exact independent calculations passed; publisher key unverified.')
