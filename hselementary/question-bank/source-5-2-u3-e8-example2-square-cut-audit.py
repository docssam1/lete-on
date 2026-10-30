from itertools import combinations
C={(x,y) for x in range(4) for y in range(4)}
def conn(p):
 seen={next(iter(p))};stack=list(seen)
 while stack:
  x,y=stack.pop()
  for q in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
   if q in p and q not in seen:seen.add(q);stack.append(q)
 return len(seen)==len(p)
def normalized(p):
 a=min(x for x,y in p);b=min(y for x,y in p)
 return tuple(sorted((x-a,y-b) for x,y in p))
def form(p):
 s=[]
 for f in (False,True):
  for r in range(4):
   t=[]
   for x,y in p:
    if f:x=-x
    for _ in range(r):x,y=-y,x
    t.append((x,y))
   s.append(normalized(t))
 return min(s)
solutions=[];shapes={}
for p in combinations(sorted(C),8):
 a=set(p);b=C-a
 if conn(a) and conn(b) and form(a)==form(b):
  solutions.append(a);shapes.setdefault(form(a),a)
assert len(solutions)==44 and len(shapes)==6
print('labeled',len(solutions),'unlabeled',len(solutions)//2,'distinct piece shapes',len(shapes))
for i,(k,p) in enumerate(sorted(shapes.items()),1):
 print(i, '/'.join(''.join('#' if (x,y) in p else '.' for x in range(4)) for y in range(4)))
from collections import Counter
for p in solutions:
 deg=Counter()
 for x,y in p:
  for dx,dy,ends in [(1,0,((x+1,y),(x+1,y+1))),(0,1,((x,y+1),(x+1,y+1)))]:
   if (x+dx,y+dy) in C-p:
    for a in ends:deg[a]+=1
  for dx,dy,ends in [(-1,0,((x,y),(x,y+1))),(0,-1,((x,y),(x+1,y)))]:
   if (x+dx,y+dy) in C-p:
    for a in ends:deg[a]+=1
 assert max(deg.values(),default=0)<=2
print('all boundaries nonbranching')
ends_count=Counter()
for p in solutions:
 deg=Counter()
 for x,y in p:
  for dx,dy,ends in [(1,0,((x+1,y),(x+1,y+1))),(-1,0,((x,y),(x,y+1))),(0,1,((x,y+1),(x+1,y+1))),(0,-1,((x,y),(x+1,y)))]:
   if (x+dx,y+dy) in C-p:
    for point in ends:deg[point]+=1
 ends_count[sum(v==1 for v in deg.values())]+=1
assert ends_count=={2:44}
print('interface endpoint counts',dict(ends_count))
