"""Independent exact examples: joining centers of two attached rectangles."""
from fractions import Fraction as F

def side(p,a,b):return (b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])
def clip(poly,a,b):
 out=[]
 for p,q in zip(poly,poly[1:]+poly[:1]):
  u,v=side(p,a,b),side(q,a,b)
  if u>=0:out.append(p)
  if (u<0<v) or (v<0<u):
   t=u/(u-v);out.append((p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])))
 return out
def area(p):return abs(sum(x[0]*y[1]-x[1]*y[0] for x,y in zip(p,p[1:]+p[:1])))/2
for w,h,u,v in ((4,2,2,1),(6,3,2,2),(7,4,3,1)):
 w,h,u,v=map(F,(w,h,u,v))
 lower=[(F(0),F(0)),(w,F(0)),(w,h),(F(0),h)]
 upper=[(w-u,h),(w,h),(w,h+v),(w-u,h+v)]
 c1=(w/2,h/2);c2=(w-u/2,h+v/2)
 # The line must intersect the shared edge inside its span to make a single cut.
 seam=c1[0]+(c2[0]-c1[0])*(h-c1[1])/(c2[1]-c1[1])
 assert w-u<=seam<=w
 for p in (lower,upper):assert area(clip(p,c1,c2))*2==area(p)
 assert sum(area(clip(p,c1,c2)) for p in (lower,upper))*2==sum(area(p) for p in (lower,upper))
print('Three step shapes: center line bisects each rectangle and crosses their shared edge')
