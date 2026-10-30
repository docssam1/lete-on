"""Recalculate printed page 45 Missions 1–5 with exact arithmetic."""
from decimal import Decimal as D
from fractions import Fraction as F

answers = (D('6.8')*D('1.5')*D('3.2'), (D('2.38')-D('1.28'))*D('3.14'),
           (D('45')-D('28')+D('2.1'))*D('9.5'),
           D('3.78')*(D('6.1')-D('3.7'))*D('0.3'))
assert answers == tuple(map(D, ('32.64', '3.454', '181.45', '2.7216')))
low, high = D('2.12')*13, D('2.08')*15
values = [D(n)/100 for n in range(2756, 3121) if low < D(n)/100 < high and n % 10 == 8]
assert len(values) == 37 and values[0] == D('27.58') and values[-1] == D('31.18')
original = D('28.5')*D('6.1')+D('0.65')
assert original == D('174.5') and original*D('28.5') == D('4973.25')
assert (F(245, 10)*4-F(954, 10))*F(34, 10) == F(884, 100)
a = (F(73741, 100)+F(1302, 100))/101
b = F(1302, 100)-a
assert (a, b, a*b) == (F(743, 100), F(559, 100), F(415337, 10000))
print('Page 45 Missions 1–5: exact source calculations verified; publisher key unverified.')
