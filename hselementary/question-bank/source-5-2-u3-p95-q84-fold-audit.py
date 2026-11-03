"""Trace the actual paper layers under the punch, printed p.95 no.84."""
from fractions import Fraction as F
p=(F(1,4),F(1,8))
def second(x,y):return (1-y,1-x) # x+y=1
def first(x,y):return (y+F(1,2),x-F(1,2)) # x-y=1/2
def original(x,y):return 0<=y<=x<=1
q=second(*p)
assert q==(F(7,8),F(3,4)) and original(*q) and original(*p)
# The first fold can add a hole only if the inverse point lies in
# the original triangular flap x-y>1/2. Both inverse points lie outside.
for point in (p,q):
    x,y=first(*point)
    assert not original(x,y) or x-y<=F(1,2)
assert first(*p)==(F(5,8),F(-1,4))
assert first(*q)==(F(5,4),F(3,8))
print('PASS: two layers produce two holes, choice ①')
