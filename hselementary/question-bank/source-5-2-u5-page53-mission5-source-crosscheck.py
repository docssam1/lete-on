from collections import deque
from itertools import permutations,product
N=lambda a:tuple(-i for i in a)
A=lambda a,b:tuple(x+y for x,y in zip(a,b))
S=lambda a,b:tuple(x-y for x,y in zip(a,b))
D=lambda a,b:sum(x*y for x,y in zip(a,b))
C=lambda a,b:(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
def fold(cells,start):
 f={start:((0,0,0),(1,0,0),(0,1,0),(0,0,1))}; q=deque([start])
 while q:
  x,y=q.popleft(); o,r,d,n=f[x,y]
  for dx,dy,v in [(1,0,(A(o,r),N(n),d,r)),(-1,0,(S(o,n),n,d,N(r))),(0,1,(A(o,d),r,N(n),d)),(0,-1,(S(o,n),r,n,N(d)))]:
   c=(x+dx,y+dy)
   if c in cells and c not in f:f[c]=v;q.append(c)
 return f
axes=[(1,0,0),(0,1,0),(0,0,1)];rot=[]
for p in permutations(axes):
 for sign in product([-1,1],repeat=3):
  v=[tuple(z*s for z in a) for a,s in zip(p,sign)]
  if C(v[0],v[1])==v[2]:rot.append(v)
def transform(v,r):return tuple(sum(v[k]*r[k][i] for k in range(3)) for i in range(3))
labels={(0,0,1):'나',(0,0,-1):'라',(1,0,0):'가',(-1,0,0):'다',(0,1,0):'바',(0,-1,0):'마'}
# Coordinates: first view has 가 on +X, 바 on +Y and 나 on +Z.
# The third view keeps 나 on top and turns 180 degrees, placing 다 and 마
# opposite 가 and 바 respectively. Directions are source-image readings.
cases = [
    ({(0,1),(1,1),(2,1),(3,1),(2,0),(2,2)}, (2,0), (-1,0,0), (0,1,0), "right", {(1,1): ("마", "right"), (3,1): ("바", "right")}),
    ({(0,0),(1,0),(1,1),(2,1),(2,2),(3,2)}, (2,2), (0,1,0), (0,0,1), "left", {(0,0): ("다", "left"), (2,1): ("가", "down")}),
]
ups = {"가": (0,1,0), "마": (0,0,-1), "바": (0,0,1), "다": (0,1,0)}
for cells, anchor, world_normal, world_up, direction, expected in cases:
    faces = fold(cells, anchor)
    assert len(faces) == 6 and len({f[3] for f in faces.values()}) == 6
    _, right, down, normal = faces[anchor]
    anchor_up = right if direction == "right" else N(right)
    matching = [r for r in rot if transform(normal,r) == world_normal and transform(anchor_up,r) == world_up]
    assert len(matching) == 1
    rotation = matching[0]
    for cell, (label, label_up) in expected.items():
        _, right, down, normal = faces[cell]
        assert labels[transform(normal,rotation)] == label
        local_up = {"right": right, "left": N(right), "down": down, "up": N(down)}[label_up]
        assert transform(local_up,rotation) == ups[label]
print("Page 53 Mission 5: two folded nets and directional candidates checked; publisher key unverified.")
