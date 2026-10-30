"""Recheck mission 2-4 original question contracts and exact bounds."""
from fractions import Fraction as F
round100=lambda n:((n+50)//100)*100
floor1000=lambda n:(n//1000)*1000
valid=[n for n in range(3000,4100) if round100(n)==4000 and floor1000(n)==3000]
assert valid==list(range(3950,4000)) and len(valid)==50
students=[n for n in range(1,100) if ((n+9)//10)*10==50]
remaining=[160-3*n for n in students]
assert students==list(range(41,51)) and sorted(remaining)==list(range(10,38,3))
# The third prompt says a number, not a natural number: check exact real bounds.
unit=100000
floor=lambda x:(x//unit)*unit
ceil=lambda x:-((-x)//unit)*unit
round_half_up=lambda x:((x+unit/2)//unit)*unit
matches=lambda x:round_half_up(x)==7900000 and floor(x)==7900000 and ceil(x)==8000000
assert not matches(F(7900000)) and matches(F(7900000)+F(1,10))
assert matches(F(7950000)-F(1,10)) and not matches(F(7950000))
print('Mission 2: 50 values; Mission 3: remaining 10..37 in steps of 3; Mission 4: 7900000 < n < 7950000')
