"""Verify integer population ranges and the last two source missions."""
from fractions import Fraction as F

# Graph values in hundreds: dashed male (round), solid female (truncate).
male=(51,55,62,68,62,72)
female=(56,58,63,61,66,70)
ranges=[]
for m,f in zip(male,female):
 values={abs(x-y) for x in range(100*m-50,100*m+50) for y in range(100*f,100*f+100)}
 assert values==set(range(min(values),max(values)+1))
 ranges.append((min(values),max(values)))
assert ranges==[(451,649),(251,449),(51,249),(551,749),(351,549),(51,249)]
# For every 2008 difference 551..749 choose other years at their minima;
# the overall maximum then equals that 2008 value.
assert max(lo for lo,hi in ranges)==551 and max(hi for lo,hi in ranges)==749
assert 5699-5050==649 and 6750-6199==551  # 2005 can exceed 2008

valid=[n for n in range(1,500) if 25<=F(n,9)<35 and 40<=F(n,6)<50]
assert valid==list(range(240,300)) and sum(valid)==16170
rounded=lambda n,unit:((n+unit//2)//unit)*unit
counts={unit:sum(rounded(n,unit)==7200 for n in range(1,10000)) for unit in (10,100,1000,10000)}
assert counts=={10:10,100:100,1000:0,10000:0}
print('Maximum actual yearly gap 551..749; quotient sum 16170; integer-digit rounding counts',counts)
