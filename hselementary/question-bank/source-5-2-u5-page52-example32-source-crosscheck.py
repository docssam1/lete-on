"""Independently intersect a water half-space with the five open-box faces.

The clean source drawing shows a triangular water surface through base corners
ㄴ and ㄹ and the upper rim corner directly above ㄱ. Coordinates are normalized
by the three edge lengths; this does not assume a cube or a particular size.
"""
from fractions import Fraction as F

P = lambda x,y,z: (F(x),F(y),F(z))
K,N,D,R = P(0,0,0),P(0,1,0),P(1,1,0),P(1,0,0)
KU,NU,DU,RU = P(0,0,1),P(0,1,1),P(1,1,1),P(1,0,1)
assert all(sum(p)==1 for p in (N,R,KU))
assert sum(K)<1 and sum(D)>1
# A filled area on a face is below the surface x+y+z=1. Clip its polygon
# using exact rational arithmetic, eliminating duplicate boundary vertices.
def clip(poly):
    out=[]
    for p,q in zip(poly,poly[1:]+poly[:1]):
        fp,fq=sum(p)-1,sum(q)-1
        if fp<=0: out.append(p)
        if (fp<0 and fq>0) or (fp>0 and fq<0):
            t=fp/(fp-fq);out.append(tuple(a+t*(b-a) for a,b in zip(p,q)))
    return list(dict.fromkeys(out))
faces={'base':[K,R,D,N], 'left':[K,N,NU,KU], 'upper':[K,R,RU,KU],
       'right':[R,D,DU,RU], 'lower':[N,D,DU,NU]}
wet={name:clip(poly) for name,poly in faces.items()}
assert set(wet['base'])=={K,N,R}
assert set(wet['left'])=={K,N,KU}
assert set(wet['upper'])=={K,R,KU}
assert set(wet['right'])=={R}
assert set(wet['lower'])=={N}
# Each of the three wet faces is split exactly in half, independently of
# box dimensions. The other faces only meet water at a single point.
print('PASS: water plane through ㄴ, ㄹ and the rim above ㄱ; base, ㄱㄴ side and ㄱㄹ side each have a triangular wet half. Other sides have no positive-area wet region.')
print('Source interpretation checked against the clean scanned diagram; publisher key remains unverified.')
