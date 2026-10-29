import math
# Two 12 by 12 squares shifted five units on both axes.
s=12; d=5
square1={(x,y) for x in range(s) for y in range(s)}
square2={(x+d,y+d) for x in range(s) for y in range(s)}
union=square1|square2
perimeter=sum((x+dx,y+dy) not in union for x,y in union for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)])
assert len(union)==239 and len(square1&square2)==49 and perimeter==68
# Independent coordinate model: big triangle base angles 70; construct R on GN
# by intersecting GN with the 30-degree ray from D, then test GR=DR.
def intersect(p,v,q,w):
 det=v[0]*w[1]-v[1]*w[0]
 t=((q[0]-p[0])*w[1]-(q[1]-p[1])*w[0])/det
 return (p[0]+t*v[0],p[1]+t*v[1])
rad=math.radians
N=(0.,0.);D=(1.,0.);G=intersect(N,(math.cos(rad(70)),math.sin(rad(70))),D,(math.cos(rad(110)),math.sin(rad(110))))
R=intersect(N,(G[0],G[1]),D,(math.cos(rad(150)),math.sin(rad(150))))
assert abs(math.dist(G,N)-math.dist(G,D))<1e-12
assert abs(math.dist(G,R)-math.dist(D,R))<1e-12
v=(D[0]-R[0],D[1]-R[1]);axis=((G[0]+D[0])/2-R[0],(G[1]+D[1])/2-R[1])
angle=math.degrees(math.acos((v[0]*axis[0]+v[1]*axis[1])/(math.hypot(*v)*math.hypot(*axis))))
assert abs(angle-50)<1e-9
print('Mission 5 union perimeter and Mission 6 coordinate angle passed')

# Reflect the two endpoints of the shaded sector across each vertex-to-vertex axis.
points=[(math.cos(2*math.pi*k/8),math.sin(2*math.pi*k/8)) for k in range(8)]
results=set()
for j in range(4):
 axis=points[j]
 def reflected(p):
  projection=p[0]*axis[0]+p[1]*axis[1]
  return (2*projection*axis[0]-p[0],2*projection*axis[1]-p[1])
 endpoints=[]
 for point in points[:2]:
  q=reflected(point)
  indices=[k for k,p in enumerate(points) if math.dist(p,q)<1e-9]
  assert len(indices)==1
  endpoints.append(indices[0])
 edge=next(k for k in range(8) if set(endpoints)=={k,(k+1)%8})
 results.add(edge)
assert results=={1,3,5,7}
print('Mission 1: all four vertex-diagonal reflection choices verified')

# Mission 4: validate all reflections by vectors and compare the marked smaller angle.
def vec(deg): return (math.cos(rad(deg)),math.sin(rad(deg)))
def reflect_vector(p,axis):
 u=vec(axis);projection=p[0]*u[0]+p[1]*u[1]
 return (2*projection*u[0]-p[0],2*projection*u[1]-p[1])
n=vec(45);g=reflect_vector(n,90);d=reflect_vector(n,60);l=reflect_vector(d,135)
for point,expected in [(g,135),(d,75),(l,195)]:assert math.dist(point,vec(expected))<1e-12
marked=math.degrees(math.acos(max(-1,min(1,n[0]*l[0]+n[1]*l[1]))))
assert abs(marked-150)<1e-9
print('Mission 4: three vector reflections and marked angle verified')
