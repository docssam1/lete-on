from fractions import Fraction as F
from collections import Counter
poly=[(F(-1),F(-1)),(F(1),F(-1)),(F(1),F(1)),(F(-1),F(1))]
def clean(p):
 out=[]
 for x in p:
  if not out or x!=out[-1]:out.append(x)
 if len(out)>1 and out[0]==out[-1]:out.pop()
 changed=True
 while changed and len(out)>=3:
  changed=False
  for i in range(len(out)):
   a,b,c=out[i-1],out[i],out[(i+1)%len(out)]
   if (b[0]-a[0])*(c[1]-b[1])==(b[1]-a[1])*(c[0]-b[0]):out.pop(i);changed=True;break
 return out
def clip(p,a,b,c,sign):
 def v(t):return sign*(a*t[0]+b*t[1]-c)
 result=[]
 for P,Q in zip(p,p[1:]+p[:1]):
  u,w=v(P),v(Q)
  if u>=0:result.append(P)
  if (u<0<w) or (u>0>w):
   t=u/(u-w);result.append((P[0]+t*(Q[0]-P[0]),P[1]+t*(Q[1]-P[1])))
 return clean(result)
def area(p):return abs(sum(x*v-u*y for (x,y),(u,v) in zip(p,p[1:]+p[:1])))/2
parts=[poly]
for a,b,c in [(0,1,F(1,2)),(0,1,F(-1,2)),(1,-1,0),(1,1,0)]:
 parts=[q for p in parts for q in (clip(p,a,b,c,1),clip(p,a,b,c,-1)) if len(q)>=3 and area(q)>0]
counts=Counter(map(len,parts));print('parts',len(parts),'sides',counts,'area',sum(map(area,parts)));assert counts=={3:6,4:2,5:2};assert sum(map(area,parts))==4
