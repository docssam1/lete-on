import math
from math import cos,sin,radians,atan2,degrees,tan
m=tan(radians(8));x,y=1.,0.;angle=162.;hits=[]
for i in range(100):
 dx,dy=cos(radians(angle)),sin(radians(angle));cand=[]
 if abs(dy)>1e-12:
  t=-y/dy
  if t>1e-10 and x+t*dx>0:cand.append((t,0))
 den=dy-m*dx
 if abs(den)>1e-12:
  t=(m*x-y)/den
  if t>1e-10 and x+t*dx>0:cand.append((t,8))
 t,wall=min(cand);x+=t*dx;y+=t*dy
 if abs(x-1)<1e-9 and abs(y)<1e-9:
  print('return: reflections between start and return',len(hits),'return',x,y,'last angle',angle);break
 hits.append((wall,x,y));angle=(2*wall-angle)%360
else:raise AssertionError('no return')
print('wall sequence',''.join('U' if a==8 else 'L' for a,_,_ in hits));print('minimum x',min(v for _,v,_ in hits))
assert len(hits)==17
assert all(wall==(8 if i%2==0 else 0) for i,(wall,_,_) in enumerate(hits))
assert abs(x-1)<1e-9 and abs(y)<1e-9
