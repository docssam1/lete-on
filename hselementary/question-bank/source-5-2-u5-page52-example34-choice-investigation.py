from itertools import permutations,product
from collections import deque
N=lambda a:tuple(-x for x in a)
A=lambda a,b:tuple(x+y for x,y in zip(a,b))
S=lambda a,b:tuple(x-y for x,y in zip(a,b))
M=lambda a,k:tuple(x*k for x in a)
C=lambda a,b:(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
# Coordinates are doubled to preserve edge midpoints.
cells={(0,0),(1,0),(1,1),(2,1),(2,2),(3,2)}
# The net coordinates run right and down on the marked side. The marked
# side must face outwards: its normal is opposite right cross down.
f={(0,0):((0,0,0),(2,0,0),(0,2,0),(0,0,-2))};q=deque(f)
while q:
 x,y=q.popleft();o,r,d,n=f[x,y]
 for dx,dy,v in [(1,0,(A(o,r),N(n),d,r)),(-1,0,(S(o,n),n,d,N(r))),(0,1,(A(o,d),r,N(n),d)),(0,-1,(S(o,n),r,n,N(d)))]:
  k=x+dx,y+dy
  if k in cells and k not in f:f[k]=v;q.append(k)
# The reconstructed marked faces must form the six boundary planes of one cube.
assert len(f) == 6
assert {n for _,_,_,n in f.values()} == {(2,0,0),(-2,0,0),(0,2,0),(0,-2,0),(0,0,2),(0,0,-2)}
for o,r,d,n in f.values():
 corners = [o,A(o,r),A(o,d),A(A(o,r),d)]
 assert all(all(c in (0,2) for c in point) for point in corners)
 assert C(r,d) == N(M(n,2)), 'the printed side must face outward'
patterns={(0,0):((0,2),(2,0)),(1,0):((0,1),(2,1)),(1,1):((1,0),(1,2)),(2,1):((0,0),(2,2)),(2,2):((0,1),(2,1)),(3,2):((0,2),(2,0))}
face=[]
for c,(o,r,d,n) in f.items():
 def p(x,y):return A(o,A(M(r,x/2),M(d,y/2)))
 face.append((tuple(int(x/2) for x in n),[p(*z) for z in patterns[c]]))
# Three diagonal-bearing faces have six distinct cube vertices as endpoints.
# Therefore no vertex can be an endpoint of two diagonals simultaneously.
diagonal_cells = {(0,0), (2,1), (3,2)}
diagonal_endpoints = [tuple(point) for cell, (_, points) in zip(f, face)
                      if cell in diagonal_cells for point in points]
assert len(diagonal_endpoints) == 6 and len(set(diagonal_endpoints)) == 6
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
witnesses={}
for r in rot:
 visible={}
 for normal,points in face:
  n=tr(normal,r)
  name={(0,0,1):'F',(1,0,0):'R',(0,1,0):'T'}.get(n)
  if name: visible[name]=line(name,[tr(p,r) for p in points])
 assert len(visible)==3
 configuration=(visible['T'],visible['F'],visible['R'])
 sets.add(configuration)
 witnesses.setdefault(configuration,r)
# Each tuple gives the top, front and right face lines in screen coordinates.
transcribed = [("H", "\\", "\\"), ("H", "\\", "/"),
               ("\\", "V", "/"), ("V", "V", "\\"),
               ("\\", "H", "H")]
assert len(rot) == 24
assert [choice in sets for choice in transcribed] == [True, False, True, True, True]
# Retain an actual rotation witness for each possible original option.
for number,choice in enumerate(transcribed,1):
 if number == 2:
  assert choice not in witnesses
 else:
  rotation = witnesses[choice]
  assert len({tuple(axis) for axis in rotation}) == 3
  print(f'option {number}: possible, rotation basis {rotation}')
print('option 2: impossible; two diagonals meet at a cube vertex, but all six net diagonal endpoints are distinct')
print('Publisher answer unverified; this is a mathematical source check, not release approval.')
print("Page 52 Example 3-4: outward fold and all five choices checked; only choice 2 is impossible. Official key unverified.")
