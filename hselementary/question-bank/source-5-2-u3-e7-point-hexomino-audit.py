def norm(p):
 mx=min(x for x,y in p);my=min(y for x,y in p);return tuple(sorted((x-mx,y-my) for x,y in p))
def transforms(p):
 for mirror in [False,True]:
  for turn in range(4):
   out=[]
   for x,y in p:
    if mirror:x=-x
    for _ in range(turn):x,y=-y,x
    out.append((x,y))
   yield norm(out)
def canonical(p):return min(transforms(p))
fixed={((0,0),)}
for n in range(2,7):
 nexts=set()
 for p in fixed:
  for x,y in p:
   for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
    t=(x+dx,y+dy)
    if t not in p:nexts.add(norm((*p,t)))
 fixed=nexts
free={canonical(p) for p in fixed}
selected={p for p in fixed if norm([(-x,-y) for x,y in p])==p}
classes={canonical(p) for p in selected}
print('fixed',len(fixed),'free',len(free),'symmetric fixed',len(selected),'symmetric free',len(classes))
for p in sorted(classes):
 mx=max(x for x,y in p);my=max(y for x,y in p);print('/'.join(''.join('#' if (x,y) in p else '.' for x in range(mx+1)) for y in range(my+1)))
assert len(fixed)==216 and len(free)==35
# Independent center test: centroid gives the only possible rotation center.
def centroid_test(p):
 sx=sum(x for x,y in p);sy=sum(y for x,y in p);n=len(p)
 return all((2*sx-n*x,2*sy-n*y) in {(n*u,n*v) for u,v in p} for x,y in p)
assert {p for p in fixed if centroid_test(p)}==selected
example1={(0,0),(0,1),(1,1),(2,1),(3,1),(3,2)}
example2={(0,0),(1,0),(2,0),(0,1),(1,1),(2,1)}
assert canonical(example1) in classes and canonical(example2) in classes
assert canonical(example1)!=canonical(example2)
assert len(classes)==7
print('centroid cross-check and both printed examples passed')
