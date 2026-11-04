from fractions import Fraction as F
p=[(6,6),(10,1),(11,5),(13,4),(12,7),(10,8)]
q=[(16-x,y) for x,y in p]
def edges(poly):return list(zip(poly,poly[1:]+poly[:1]))
def cross(a,b):return a[0]*b[1]-a[1]*b[0]
yvals={F(y) for x,y in p+q}
for a,b in edges(p):
 for c,d in edges(q):
  u=(b[0]-a[0],b[1]-a[1]);v=(d[0]-c[0],d[1]-c[1]);den=cross(u,v)
  if not den:continue
  w=(c[0]-a[0],c[1]-a[1]);t=F(cross(w,v),den);z=F(cross(w,u),den)
  if 0<=t<=1 and 0<=z<=1:yvals.add(F(a[1])+t*u[1])
def intervals(poly,y):
 xs=sorted(F(x1)+(y-y1)*F(x2-x1,y2-y1) for (x1,y1),(x2,y2) in edges(poly) if min(y1,y2)<y<max(y1,y2))
 return list(zip(xs[::2],xs[1::2]))
def widths(y):
 a,b=intervals(p,y),intervals(q,y);area=lambda a:sum((v-u for u,v in a),F(0));shared=sum((max(F(0),min(v,z)-max(u,w)) for u,v in a for w,z in b),F(0));return area(a),area(b),shared
acc=[F(0),F(0),F(0)]
for lo,hi in zip(sorted(yvals),sorted(yvals)[1:]):
 y=lo+(hi-lo)/2
 for i,w in enumerate(widths(y)):acc[i]+=w*(hi-lo)
print('polygon, reflected, overlap in grid cells:',acc,'exclusive:',acc[0]+acc[1]-2*acc[2],'cm²:',16*(acc[0]+acc[1]-2*acc[2]))
assert acc == [F(45,2), F(45,2), F(7)]
assert 16*(acc[0]+acc[1]-2*acc[2]) == 496
