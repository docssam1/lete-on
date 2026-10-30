"""Conditional model: 0,1,8 fixed by a half-turn; 6 and 9 exchange."""
from itertools import product
rotation={'0':'0','1':'1','6':'9','8':'8','9':'6'}
def turn(s):return ''.join(rotation.get(c,'?') for c in reversed(s))
exhaustive=[str(n) for n in range(1000,10000) if turn(str(n))==str(n)]
constructed=sorted(a+b+rotation[b]+rotation[a] for a,b in product('1689','01689'))
assert exhaustive==constructed and len(exhaustive)==20 and '1691' in exhaustive
print('Conditional 0/1/8 fixed and 6↔9:',len(exhaustive),'four-digit numbers; first digit 0 excluded')
