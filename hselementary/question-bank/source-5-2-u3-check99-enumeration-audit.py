#!/usr/bin/env python3
"""Enumerate the point-symmetric shapes in printed page 99."""
def check_111():
    from fractions import Fraction as F
    from itertools import combinations

    def calculate(W,H):
     segments=[((0,0),(W,0)),((0,H),(W,H)),((0,0),(0,H)),((W,0),(W,H)),((0,H/2),(W,H/2)),((W/2,0),(W/2,H)),((0,0),(W,H/2)),((W,0),(0,H/2)),((0,H/2),(W,H)),((W,H/2),(0,H))]
     def cross(a,b):return a[0]*b[1]-a[1]*b[0]
     def sub(a,b):return(a[0]-b[0],a[1]-b[1])
     def intersect(a,b,c,d):
      r=sub(b,a);s=sub(d,c);D=cross(r,s)
      if not D:return None
      v=sub(c,a);t=cross(v,s)/D;u=cross(v,r)/D
      return (a[0]+t*r[0],a[1]+t*r[1]) if 0<=t<=1 and 0<=u<=1 else None
     points=set(v for seg in segments for v in seg)
     for (a,b),(c,d) in combinations(segments,2):
      p=intersect(a,b,c,d)
      if p is not None:points.add(p)
     def on(p,a,b):return cross(sub(p,a),sub(b,a))==0 and min(a[0],b[0])<=p[0]<=max(a[0],b[0]) and min(a[1],b[1])<=p[1]<=max(a[1],b[1])
     def edge(p,q):return any(on(p,a,b) and on(q,a,b) for a,b in segments)
     def dist(p,q):return (p[0]-q[0])**2+(p[1]-q[1])**2
     quads=set();signatures=set()
     for a,b,c,d in combinations(sorted(points),4):
      for p,q,r,s in [(a,b,c,d),(a,c,b,d),(a,d,b,c)]:
       if p[0]+q[0]!=r[0]+s[0] or p[1]+q[1]!=r[1]+s[1]:continue
       if cross(sub(q,p),sub(s,r))==0:continue
       if not all(edge(x,y) for x,y in [(p,r),(r,q),(q,s),(s,p)]):continue
       quads.add(tuple(sorted((a,b,c,d))))
       signatures.add((tuple(sorted([dist(p,r),dist(r,q)])),tuple(sorted([dist(p,q),dist(r,s)]))))
     return len(points),len(quads),len(signatures)

    assert calculate(F(6),F(4)) == (11,16,7)
    assert calculate(F(6),F(5)) == (11,16,7)
    assert calculate(F(8),F(5)) == (11,16,7)
    assert calculate(F(4),F(4)) == (11,16,6)


def check_113():
    from itertools import combinations
    pts=[]
    triangles={}
    for x in (0,1):
     for y in (0,1):
      corners=[(2*x,2*y),(2*x+2,2*y),(2*x+2,2*y+2),(2*x,2*y+2)];m=(2*x+1,2*y+1)
      for a,b in zip(corners,corners[1:]+corners[:1]):
       pt=(a[0]+b[0]+m[0],a[1]+b[1]+m[1]);pts.append(pt);triangles[pt]=frozenset((3*x,3*y) for x,y in (a,b,m))
    def canonical(points):
     transforms=[(1,0,0,1),(0,-1,1,0),(-1,0,0,-1),(0,1,-1,0),(-1,0,0,1),(1,0,0,-1),(0,1,1,0),(0,-1,-1,0)]
     out=[]
     for a,b,c,d in transforms:
      q=[(a*x+b*y,c*x+d*y) for x,y in points];mx=min(x for x,y in q);my=min(y for x,y in q)
      out.append(tuple(sorted((x-mx,y-my) for x,y in q)))
     return min(out)
    valid=[]
    for comb in combinations(pts,8):
     s=set(comb); X=sum(x for x,y in s);Y=sum(y for x,y in s)
     if X%4 or Y%4:continue
     Cx=X//4; Cy=Y//4
     if any((Cx-x,Cy-y) not in s for x,y in s):continue
     # Twice-center coordinates Cx,Cy; axes through center.
     if (all((Cx-x,y) in s for x,y in s) or all((x,Cy-y) in s for x,y in s) or
         all(((Cx-Cy)//2+y,(Cy-Cx)//2+x) in s for x,y in s) and (Cx-Cy)%2==0 or
         all(((Cx+Cy)//2-y,(Cx+Cy)//2-x) in s for x,y in s) and (Cx+Cy)%2==0):valid.append(s)

    real=[]
    for shape in valid:
     X=sum(x for x,y in shape)//4;Y=sum(y for x,y in shape)//4
     def ok(fn):
      return all(fn(p) in shape and frozenset(fn(v) for v in triangles[p])==triangles[fn(p)] for p in shape)
     if not ok(lambda p:(X-p[0],Y-p[1])):continue
     reflections=[lambda p:(X-p[0],p[1]),lambda p:(p[0],Y-p[1])]
     if (X-Y)%2==0: reflections.append(lambda p:((X-Y)//2+p[1],(Y-X)//2+p[0]))
     if (X+Y)%2==0: reflections.append(lambda p:((X+Y)//2-p[1],(X+Y)//2-p[0]))
     if any(ok(fn) for fn in reflections):real.append(shape)
    assert len(valid) == 18 and len(real) == 14
    def canon_tri(shape):
     def rot(p):x,y=p;return(-y,x)
     def ref(p):x,y=p;return(-x,y)
     forms=[]
     for flip in (False,True):
      for k in range(4):
       tris=[]
       for center in shape:
        q=[]
        for v in triangles[center]:
         if flip:v=ref(v)
         for _ in range(k):v=rot(v)
         q.append(v)
        tris.append(q)
       mx=min(x for tri in tris for x,y in tri);my=min(y for tri in tris for x,y in tri)
       forms.append(tuple(sorted(tuple(sorted((x-mx,y-my) for x,y in tri)) for tri in tris)))
     return min(forms)
    assert len({canon_tri(s) for s in real}) == 7


def check_114():
    from itertools import combinations

    def verts(i,j,t):return frozenset([(i,j),(i+1,j),(i,j+1)] if t==0 else [(i+1,j),(i,j+1),(i+1,j+1)])
    def centroid(tri):return(tuple(sum(p[k] for p in tri) for k in (0,1)))
    def connected(ts):
     seen={next(iter(ts))}
     while True:
      new=seen|{v for u in seen for v in ts if len(u&v)==2}
      if new==seen:return new==ts
      seen=new
    def canon(points):
     def rot(p):x,y=p;return(-y,x+y)
     def mirror(p):x,y=p;return(y,x)
     forms=[]
     for refl in (False,True):
      for k in range(6):
       q=[]
       for p in points:
        if refl:p=mirror(p)
        for _ in range(k):p=rot(p)
        q.append(p)
       mx=min(x for x,y in q);my=min(y for x,y in q)
       forms.append(tuple(sorted((x-mx,y-my) for x,y in q)))
     return min(forms)
    initial={verts(0,0,0),verts(0,0,1),verts(1,0,0),verts(1,0,1),verts(2,0,0),verts(1,1,0)}
    pool={verts(i,j,t) for i in range(-3,5) for j in range(-3,5) for t in (0,1)}
    solutions={}
    for removed in initial:
     rem=initial-{removed}
     for added in pool-initial:
      if not any(len(added&t)==2 for t in rem):continue
      shape=rem|{added}
      if not connected(shape):continue
      points={centroid(t) for t in shape};sx=sum(x for x,y in points);sy=sum(y for x,y in points)
      if sx%3 or sy%3:continue
      twice=(sx//3,sy//3)
      if all((twice[0]-x,twice[1]-y) in points for x,y in points) and all(frozenset((twice[0]-3*x,twice[1]-3*y) for x,y in tri) in {frozenset((3*x,3*y) for x,y in tri2) for tri2 in shape} for tri in shape):solutions.setdefault(canon(points),[]).append((centroid(removed),centroid(added)))
    assert len(solutions) == 3


check_111()
check_113()
check_114()
print("Page 99 shape enumerations passed; publisher answers remain unverified.")
