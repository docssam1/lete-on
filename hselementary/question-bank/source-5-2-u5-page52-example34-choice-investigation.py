from itertools import permutations,product
from collections import deque
N=lambda a:tuple(-x for x in a)
A=lambda a,b:tuple(x+y for x,y in zip(a,b))
S=lambda a,b:tuple(x-y for x,y in zip(a,b))
M=lambda a,k:tuple(x*k for x in a)
C=lambda a,b:(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
# Coordinates are doubled to preserve edge midpoints.
cells={(0,0),(1,0),(1,1),(2,1),(2,2),(3,2)}
f={(0,0):((0,0,0),(2,0,0),(0,2,0),(0,0,2))};q=deque(f)
while q:
 x,y=q.popleft();o,r,d,n=f[x,y]
 for dx,dy,v in [(1,0,(A(o,r),N(n),d,r)),(-1,0,(S(o,n),n,d,N(r))),(0,1,(A(o,d),r,N(n),d)),(0,-1,(S(o,n),r,n,N(d)))]:
  k=x+dx,y+dy
  if k in cells and k not in f:f[k]=v;q.append(k)
patterns={(0,0):((0,2),(2,0)),(1,0):((0,1),(2,1)),(1,1):((1,0),(1,2)),(2,1):((0,0),(2,2)),(2,2):((0,1),(2,1)),(3,2):((0,2),(2,0))}
face=[]
for c,(o,r,d,n) in f.items():
 def p(x,y):return A(o,A(M(r,x/2),M(d,y/2)))
 face.append((tuple(int(x/2) for x in n),[p(*z) for z in patterns[c]]))
axes=[(1,0,0),(0,1,0),(0,0,1)];rot=[]
for p in permutations(axes):
 for sign in product((-1,1),repeat=3):
  v=[M(a,s) for a,s in zip(p,sign)]
  if C(v[0],v[1])==v[2]:rot.append(v)
def tr(p,r):return tuple(sum(p[k]*r[k][i] for k in range(3)) for i in range(3))
def line(face_name,pts):
 # oriented screen coordinates, invariant to translation
 if face_name=='F': p=[(x,-y) for x,y,z in pts]
 elif face_name=='R':p=[(-z,-y) for x,y,z in pts]
 else:p=[(x,z) for x,y,z in pts]
 (a,b),(c,d)=p; dx=c-a;dy=d-b
 if dy==0:return 'H'
 if dx==0:return 'V'
 return '\\' if dx*dy>0 else '/'
sets=set()
for r in rot:
 visible={}
 for normal,points in face:
  n=tr(normal,r)
  name={(0,0,1):'F',(1,0,0):'R',(0,1,0):'T'}.get(n)
  if name: visible[name]=line(name,[tr(p,r) for p in points])
 assert len(visible)==3
 sets.add((visible['T'],visible['F'],visible['R']))
# First and second visible drawings, as currently transcribed:
# top horizontal, front descending diagonal; right diagonal differs.
# Treat mismatch as a review flag, not a determination about the publisher key.
transcribed = [("H", "\\", "\\"), ("H", "\\", "/")]
assert len(rot) == 24
assert all(choice not in sets for choice in transcribed)
print("Page 52 Example 3-4: 24 rotations checked; transcribed choices 1 and 2 both mismatch, so source transcription/model needs review.")
