from itertools import combinations,permutations
W,H=4,2
boundary=[(x,0) for x in range(W)]+[(W,y) for y in range(H)]+[(x,H) for x in range(W,0,-1)]+[(0,y) for y in range(H,0,-1)]
inside=[(1,1),(2,1),(3,1)]
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def on(a,b,p):return cross(a,b,p)==0 and min(a[0],b[0])<=p[0]<=max(a[0],b[0]) and min(a[1],b[1])<=p[1]<=max(a[1],b[1])
def intersect(a,b,c,d):
 x,y,z,t=cross(a,b,c),cross(a,b,d),cross(c,d,a),cross(c,d,b)
 return x*y<0 and z*t<0 or (x==0 and on(a,b,c)) or (y==0 and on(a,b,d)) or (z==0 and on(c,d,a)) or (t==0 and on(c,d,b))
def simple(path):
 for i in range(len(path)-1):
  for j in range(i+2,len(path)-1):
   if intersect(path[i],path[i+1],path[j],path[j+1]):return False
 for a,b,c in zip(path,path[1:],path[2:]):
  if cross(a,b,c)==0 and (b[0]-a[0])*(c[0]-b[0])+(b[1]-a[1])*(c[1]-b[1])<0:return False
 # path may only meet boundary at its two endpoints
 for i,(a,b) in enumerate(zip(path,path[1:])):
  for p in boundary:
   if p not in (path[0],path[-1]) and on(a,b,p):return False
 return True
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
paths={};shapes={}
for i,j in combinations(range(len(boundary)),2):
 for count in range(4):
  for middle in permutations(inside,count):
   path=(boundary[i],)+middle+(boundary[j],)
   if not simple(path):continue
   arc1=boundary[i:j+1];arc2=boundary[j:]+boundary[:i+1]
   p1=simplify(arc1+list(reversed(path[1:-1])));p2=simplify(arc2+list(path[1:-1]))
   if area(p1)!=8 or area(p2)!=8 or len(p1)!=len(p2) or signature(p1)!=signature(p2):continue
   sig=signature(p1);paths[path]=(p1,p2);shapes.setdefault(sig,path)
example=((1,2),(1,1),(3,1),(3,0))
example_path=example if example in paths else tuple(reversed(example))
assert example_path in paths
example_class=signature(paths[example_path][0])
assert len(shapes)==9 and example_class in shapes
remaining=set(shapes)-{example_class}
assert len(remaining)==8
print('Valid point-to-point simple cuts:',len(paths),'distinct congruent piece shapes:',len(shapes),'excluding the printed example:',len(remaining))
