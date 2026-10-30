"""Exact independent checks for printed page 44 besides Example 2-3."""
from decimal import Decimal
from fractions import Fraction as F

product = Decimal('0.3747') * Decimal('0.78528')
assert str(product) == '0.294244416'
assert (str(product)[5], str(product)[-1]) == ('2', '6')
base = F(519)*47
assert base == 24393
unknowns = (F(519, 100)*47, F(24393, 10)/F(519, 100),
            F(24393, 10000)/F(519, 1000), F(24393, 100000)/F(47, 100000))
assert unknowns == (F(24393, 100), 470, F(47, 10), 519)
low, high = F(345, 100)*F(168, 10), F(355, 100)*F(168, 10)
assert (low, high) == (F(5796, 100), F(5964, 100))
side = (F(4025, 100)-F(35, 10)*F(15, 10))/(F(35, 10)+F(15, 10))
assert side == 7
print('Page 44 exploration and Examples 2-1, 2-2, 2-4: exact arithmetic passed; publisher key unverified.')
