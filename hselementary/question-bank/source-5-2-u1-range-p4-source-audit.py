"""Check printed page 4 original integer cases and constructive allocations."""
from math import ceil
assert [n for n in range(1,100) if 26<n<=33] == list(range(27,34))
starts=[a for a in range(100,1000) for b in range(a,1000) if b-a+1==567]
assert max(starts)==433
students=[n for n in range(1,1000) if ceil(n/6)==70 and ceil(n/8)==52]
assert students==[415,416]
overlap=[n for n in range(41) if n<=min(33,21) and 33+21-n<=40]
assert overlap==list(range(14,22))
feasible=[]
for k in range(1,100):
 if 33*k<=365<=42*k:
  boxes=[33]*k; remainder=365-33*k
  for i in range(k):
   add=min(9,remainder);boxes[i]+=add;remainder-=add
  assert remainder==0 and sum(boxes)==365 and all(33<=n<=42 for n in boxes)
  feasible.append(k)
assert feasible==[9,10,11]
print('Printed p4: open/closed endpoints, 433, 415–416, 14–21, and 9–11 checked.')
