"""Independently enumerate small-batch range and number-card answers."""
from itertools import permutations
A={n for n in range(1,100) if 17<=n<27}
B={n for n in range(1,100) if 22<n<=38}
assert len(A|B)==22 and sum(A&B)==98
sums={a+b for a in A for b in B}
assert sums==set(range(40,65))
upper=[u for u in range(1,150) if sum(n%3==0 for n in range(25,u))==15]
assert upper==[70,71,72]
pairs=[(a,b) for a in range(10,100) for b in range(10,100) if sum(a<n<b for n in range(1,100))==81]
assert pairs==[(a,a+82) for a in range(10,18)]
# Compare hundredths as integers to avoid floating point boundary error.
cards=(0,2,3,5,7,9)
values=[100*a+10*b+c for a,b,c in permutations(cards,3) if 320<100*a+10*b+c<=750]
assert len(values)==len(set(values))==48
assert [sum(v//100==d for v in values) for d in (3,5,7)]==[15,20,13]
print('Mission 1: 22, 98, [40,64]; Mission 2: 70,71,72; Mission 3: 8 pairs; Mission 4: 48 decimals')
