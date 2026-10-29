from fractions import Fraction as F
R=[(F(0),F(0)),(F(4),F(0)),(F(4),F(2)),(F(0),F(2))]
P=[(F(0),F(2)),(F(4),F(2)),(F(5),F(4)),(F(1),F(4))]
def cross(p): return 4*p[0]-p[1]-7
def clip(poly):
 out=[]
 for a,b in zip(poly,poly[1:]+poly[:1]):
  fa,fb=cross(a),cross(b)
  if fa>=0:out.append(a)
  if (fa<0<fb) or (fb<0<fa):
   t=fa/(fa-fb);out.append((a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])))
 return out
def area(p): return abs(sum(a[0]*b[1]-a[1]*b[0] for a,b in zip(p,p[1:]+p[:1])))/2
for poly in (R,P):
 print('total',area(poly),'one side',area(clip(poly)))
 assert 2*area(clip(poly))==area(poly)
print('both centers satisfy line:',cross((F(2),F(1))),cross((F(5,2),F(3))))
