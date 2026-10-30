"""Enumerate non-self-crossing cuts in a checkerboard-diagonal grid."""
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def simplify(p):
 p=list(p)
 changed=True
 while changed:
  changed=False
  for i in range(len(p)):
   if cross(p[i-1],p[i],p[(i+1)%len(p)])==0:
    p.pop(i);changed=True;break
 return p
def area(p):return abs(sum(a[0]*b[1]-a[1]*b[0] for a,b in zip(p,p[1:]+p[:1])))
def signature(p):
 p=simplify(p);n=len(p);a=[]
 for rev in (False,True):
  v=p[::-1] if rev else p
  for i in range(n):
   q=v[i:]+v[:i]
   a.append(tuple((q[j][0]-q[k][0])**2+(q[j][1]-q[k][1])**2 for j in range(n) for k in range(j+1,n)))
 return min(a)
W=4
boundary=[(x,0) for x in range(W)]+[(W,y) for y in range(W)]+[(x,W) for x in range(W,0,-1)]+[(0,y) for y in range(W,0,-1)]
adj={ (x,y):set() for x in range(5) for y in range(5)}
def edge(a,b):adj[a].add(b);adj[b].add(a)
for x in range(4):
 for y in range(4):
  edge((x,y),(x+1,y));edge((x,y),(x,y+1))
  if (x+y)%2==0:edge((x,y),(x+1,y+1))
  else:edge((x+1,y),(x,y+1))
for k in range(4):edge((4,k),(4,k+1));edge((k,4),(k+1,4))
paths={};shapes={}
def search(path):
 p=path[-1]
 if p in boundary and len(path)>1:
  j=boundary.index(p)
  arc1=boundary[:j+1];arc2=boundary[j:]+boundary[:1]
  a=simplify(arc1+list(reversed(path[1:-1])));b=simplify(arc2+list(path[1:-1]))
  if area(a)==16 and area(b)==16 and len(a)==len(b) and signature(a)==signature(b):
   paths[tuple(path)]=(a,b);shapes.setdefault(signature(a),tuple(path))
  return
 for q in adj[p]:
  if q in path:continue
  if len(path)==1 and q in boundary:continue
  search(path+[q])
search([(0,0)])
print('cut paths',len(paths),'piece shapes',len(shapes))
for i,p in enumerate(shapes.values()):print(i+1,p)
def rotate(p):return (4-p[1],p[0])
def reflect(p):return (4-p[0],p[1])
def canonical(path):
 opts=[]
 for f in (False,True):
  for turns in range(4):
   p=list(path)
   if f:p=[reflect(x) for x in p]
   for _ in range(turns):p=[rotate(x) for x in p]
   opts.extend([tuple(p),tuple(reversed(p))])
 return min(opts)
assert len(paths)==7 and len(shapes)==4
classes={canonical(p) for p in paths}
assert len(classes)==4
for p in paths:
 for q in paths:
  assert (canonical(p)==canonical(q))==(signature(paths[p][0])==signature(paths[q][0]))
print('cut path symmetry classes:',len(classes))
