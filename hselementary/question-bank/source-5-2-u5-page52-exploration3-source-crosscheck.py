"""Check the two source routes in both nets, without inferring dimensions.

A=ㄱㄴ (front top edge), B=ㄱㄹ (depth), C=ㄱㅁ (height). The source
asserts that the two pictured routes are globally shortest. Actual lengths
are not specified, so formulas remain symbolic and examples are not answers.
"""
from fractions import Fraction as F
from itertools import product

def sqdistance(p,q):
    return sum((x-y)**2 for x,y in zip(p,q))

def point(a,b,t):
    return tuple(x+t*(y-x) for x,y in zip(a,b))

for ai,bi,ci in product(range(1,7), repeat=3):
    A,B,C=map(F,(ai,bi,ci))
    # On ㅁㅇ, ㅈ is C/(A+C) of the way from ㅁ toward ㅇ.
    # On ㄴㄷ, ㅊ is A/(A+C) of the way from ㄴ toward ㄷ.
    j=B*C/(A+C)
    h=B*A/(A+C)
    G=(F(0),F(0),C); S=(A,B,F(0))
    J=(F(0),j,F(0)); H=(A,h,C)
    length2=B*B+(A+C)**2
    # Each leg is the corresponding fraction of the unfolded straight line.
    assert sqdistance(G,J)==length2*(C/(A+C))**2
    assert sqdistance(J,S)==length2*(A/(A+C))**2
    assert sqdistance(G,H)==length2*(A/(A+C))**2
    assert sqdistance(H,S)==length2*(C/(A+C))**2
    # (가): upper face has ㄱ=(0,0), ㄹ=(B,0), ㄴ=(0,A).
    # The top tab is the left face; the lower tab is the right face.
    assert point((F(0),F(0)),(B,A+C),A/(A+C))==(h,A)
    assert sqdistance((F(0),F(0)),(j,-C))==length2*(C/(A+C))**2
    assert sqdistance((B+C+B-j,F(0)),(B+C,A))==length2*(A/(A+C))**2
    # (나): top face has ㄹ=(0,0), ㄷ=(A,0), ㄱ=(0,B).
    assert point((F(0),B),(A+C,F(0)),A/(A+C))==(A,B-h)
    assert sqdistance((F(0),B),(-C,B-j))==length2*(C/(A+C))**2
    assert sqdistance((2*A+C,B-j),(A+C,F(0)))==length2*(A/(A+C))**2
    # The other pairs of faces may be shorter unless B is at least as long
    # as both A and C. The drawing alone gives no explicit numerical lengths.
    otherA=A*A+(B+C)**2
    otherC=C*C+(A+B)**2
    assert length2-otherA==2*C*(A-B)
    assert length2-otherC==2*A*(C-B)
    assert (length2<=otherA and length2<=otherC)==(B>=A and B>=C)
print('PASS: both source routes, cut-edge copies and the straight-line distances in (가) and (나), across 216 exact box dimensions.')
print('The stated global-shortest premise implies B >= A and B >= C; the source supplies no numeric lengths or official key.')
