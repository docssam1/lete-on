"""Recheck the original exploration and first three examples independently."""
from fractions import Fraction

def floor_to(n,unit):return n//unit*unit
def ceil_to(n,unit):return (n+unit-1)//unit*unit
def round_to(n,unit):return (n+unit//2)//unit*unit

candidates=[n for n in range(4300,4601) if ceil_to(n,100)==4500 and floor_to(n,100)==4400 and round_to(n,100)==4500]
assert candidates==list(range(4450,4500))
minima=[n for n in range(6000,8000) if round_to(n,1000)==7000 and floor_to(n,100)==round_to(n,100) and ceil_to(n,10)==round_to(n,10)]
assert min(minima)==6500
# Compare exact quotient rounding without assuming integer division.
q=[n for n in range(200,400) if 45<=Fraction(n,6)<55 and 65<=Fraction(n,4)<75]
assert q==list(range(270,300))
# For every real x in [600,700), y=250 supplies sum in [850,950)
# and difference in [350,450); check exact rational endpoints and samples.
for x in (Fraction(600),Fraction(60001,100),Fraction(64999,100),Fraction(69999,100)):
 y=Fraction(250);assert 850<=x+y<950 and 350<=x-y<450
assert (Fraction(850)+Fraction(350))/2==600
assert (Fraction(950)+Fraction(450))/2==700
print('Exploration count 50; minimum 6500; quotient range [270,300); larger-number range [600,700)')
