from fractions import Fraction as F
from itertools import combinations

half=F(1,2);quarter=F(1,4)
def f1(p):x,y=p;return (1-y,1-x)   # first fold: x+y=1
def f2(p):x,y=p;return (y,x)       # second fold: x=y
def f3(p):x,y=p;return (1-x,y)     # third fold: x=1/2
def reflect(seg,fn):return frozenset(fn(p) for p in seg)
def unfold(seg,functions):
    segments={frozenset(seg)}
    for fn in functions: segments |= {reflect(s,fn) for s in segments}
    return segments

# The fourth fold is a half-diagonal on the final right triangle. Reverse the
# first three folds and check all eight half-segments that it leaves.
fourth=unfold([(half,0),(quarter,quarter)],[f3,f2,f1])
expected={frozenset(pair) for pair in [
 ((half,0),(quarter,quarter)),((quarter,quarter),(0,half)),
 ((half,0),(F(3,4),quarter)),((F(3,4),quarter),(1,half)),
 ((0,half),(quarter,F(3,4))),((quarter,F(3,4)),(half,1)),
 ((half,1),(F(3,4),F(3,4))),((F(3,4),F(3,4)),(1,half))]}
assert fourth==expected
third=unfold([(half,0),(half,half)],[f2,f1])
assert third=={frozenset(pair) for pair in [((half,0),(half,half)),((half,half),(half,1)),((0,half),(half,half)),((half,half),(1,half))]}
second=unfold([(0,0),(half,half)],[f1])
assert second=={frozenset(((0,0),(half,half))),frozenset(((half,half),(1,1)))}

# Choose two parallel lines in each of two nonperpendicular direction families.
families=[(1,0,[F(0),half,F(1)]),(0,1,[F(0),half,F(1)]),
          (1,1,[half,F(1),F(3,2)]),(1,-1,[F(-1,2),F(0),half])]
counts=[];shapes=set()
for (a,b,cs),(d,e,ds) in combinations(families,2):
    if a*d+b*e==0:continue
    det=a*e-b*d;count=0
    for cs2 in combinations(cs,2):
        for ds2 in combinations(ds,2):
            vertices=[((c*e-b*f)/det,(a*f-c*d)/det) for c in cs2 for f in ds2]
            if all(0<=x<=1 and 0<=y<=1 for x,y in vertices):
                shapes.add(frozenset(vertices));count+=1
    counts.append(count)
assert counts==[2,2,2,2] and len(shapes)==8
print('PASS: four folds unfolded exactly and eight nonrectangular parallelograms enumerated')
