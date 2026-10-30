"""Check printed grade 5-2 unit 1 page 6 independently using integers."""
from itertools import product

def ceil(n, u): return (n + u - 1) // u * u
def floor(n, u): return n // u * u
def rounded(n, u): return (n + u // 2) // u * u

assert (ceil(735809, 100), floor(735809, 1000), rounded(735809, 10000)) == (735900, 735000, 740000)
assert [s for s, n in zip('abcd', [15209, 37064, 61325, 78472]) if ceil(n,100) == rounded(n,100)] == ['b','d']
x,y = 4772134,4993082
assert (ceil(x,10000)+ceil(y,10000)) - (floor(x,10000)+floor(y,10000)) == 20000
assert abs(rounded(x,10000)+rounded(y,10000)-rounded(x+y,10000)) == 10000
assert [n for n in [1450,2542,3664,4705,5878] if ceil(n,10)!=rounded(n,10) and floor(n,100)!=rounded(n,100)] == [3664]
triples = [(a,b,c) for a,b,c in product(range(10),repeat=3) if a>b>c and a+b+c==8 and rounded(2000+100*a+10*b+c,100)==2500]
assert triples == [(5,2,1),(5,3,0)]
print('Printed p6: exploration, examples 1–3 and two possible example 4 answers verified.')
