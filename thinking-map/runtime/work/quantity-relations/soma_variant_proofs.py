"""Independent enumeration/geometry/state checks. Does not import variant producers."""
import math,re
from fractions import Fraction as F
from itertools import combinations,permutations,product
from collections import Counter
from soma_authoring_proofs import area,clip,cover,boundary,convex,squared,sub,cross,triangles,cube_normals,canonical_segments,evaluate,xml,nodes,points_attribute,verify_point_figure

def close(a,b):assert abs(a-b)<.002,(a,b)
def numtext(root):return[''.join(n.itertext())for n in nodes(root,'text')]
def geometry_signature(p):return sorted(F(squared(a,b))for a,b in combinations(p,2))
def inspect(s):
 m=s['responseModel'];tid=m['kind'];r=s['answerData'];a=s['problem']['answer'];prompt=s['problem']['prompt'];fig=s['visualMarkup'];out={}
 assert s['problem']['solution']and a and prompt
 assert s['studentResponseContract']['automaticStudentScoringApproved']is False
 if fig:
  root=xml(fig);assert not nodes(root,'script');assert not any(n.attrib.get('class')=='answer'for n in root.iter())
  left,top,width,height=map(float,root.attrib['viewBox'].split());right=left+width;bottom=top+height
  for node in nodes(root,'circle'):
   x,y,rr=(float(node.attrib[k])for k in['cx','cy','r']);assert left-.01<=x-rr and x+rr<=right+.01 and top-.01<=y-rr and y+rr<=bottom+.01
  for node in nodes(root,'rect'):
   x,y,ww,hh=(float(node.attrib[k])for k in['x','y','width','height']);assert left-.01<=x and x+ww<=right+.01 and top-.01<=y and y+hh<=bottom+.01
  for node in nodes(root,'polygon')+nodes(root,'polyline'):
   assert all(left-.01<=x<=right+.01 and top-.01<=y<=bottom+.01 for x,y in points_attribute(node.attrib['points']))
 if tid in['UA37','GP02','FC19','FC20','FC21','FC18','FC24']:
  verify_point_figure(s)
  ps=m['points']
  if tid=='UA37':
   assert area([ps[i]for i in r['witness']])==F(str(m['targetArea']))==F(str(r['area']));assert len(set(r['witness']))==3
  elif tid in['GP02','FC19','FC20','FC21']:
   kind={'GP02':'right-isosceles','FC19':'equilateral','FC20':'isosceles','FC21':'right'}[tid];valid=triangles(ps,kind,m.get('metricY2',1));assert tuple(r['witness'])in[t[0]for t in valid]
   if'total'in r:assert r['total']==len(valid)
   if tid=='FC19':assert r['countsBySideSquared']==dict(Counter(str(int(t[1][0]))for t in valid));assert sum(r['countsBySideSquared'].values())==r['total']
  else:
   size=4 if tid=='FC18'else 3;polys=[]
   for ids in combinations(range(len(ps)),size):
    p=[ps[i]for i in ids];assert area(p)>0
    if size==4:assert convex(p)
    polys.append(ids)
   assert r['total']==len(polys)
  if'witness'in r:
   ar=xml(s['solutionVisualMarkup']);poly=nodes(ar,'polygon');assert len(poly)==1
   actual=points_attribute(poly[0].attrib['points']);pixels=m.get('figure',{}).get('pixels',ps);expected=[pixels[i]for i in r['witness']]
   for p,q in zip(actual,expected):
    for x,y in zip(p,q):close(x,y)
  out['finiteTrianglesOrSelectionsChecked']=True
 elif tid=='GP01':
  assert len(nodes(root,'circle'))>=2 and nodes(root,'rect')and nodes(root,'polygon');assert r['oralRubric'];assert r['shapeParts']==m['shapeParts'];assert not m['singleVerbatimExplanationRequired'];assert m['logo']in['boat','robot','train'];out['manualSemanticShapeRubric']=True
 elif tid=='SP01':
  assert m['faceAngle']==180*(m['polygonSides']-2)/m['polygonSides'];valid=[]
  for count in m['counts']:
   # Repeated addition, not the generator's strict product predicate.
   if sum([m['faceAngle']]*count)<360:valid.append(count)
  assert r=={'validCounts':valid}
 elif tid=='UL43':
  circles=nodes(root,'circle');outer=circles[0];small=circles[1:];assert len(small)==m['smallCount'];x0=float(outer.attrib['cx']);R=float(outer.attrib['r']);rad=float(small[0].attrib['r']);centers=[float(n.attrib['cx'])for n in small]
  for c in small:close(float(c.attrib['r']),rad);close(float(c.attrib['cy']),float(outer.attrib['cy']))
  for x,y in zip(centers,centers[1:]):close(y-x,2*rad)
  close(centers[0]-rad,x0-R);close(centers[-1]+rad,x0+R);close(r['radius']/m['outerRadius'],rad/R);assert str(m['outerRadius'])+'cm'in prompt
 elif tid=='CAL09':
  dividend,divisor=m['dividend'],m['divisor'];assert r['quotient']*divisor+r['remainder']==dividend and 0<=r['remainder']<divisor
  assert 100<=dividend<1000 and 2<=divisor<=9 and 10<=r['quotient']<100 and r['remainder']>=0
  ar=xml(s['solutionVisualMarkup']);entries={(float(t.attrib['x']),float(t.attrib['y'])):''.join(t.itertext())for t in nodes(ar,'text')}
  assert entries[(305.,30.)]+entries[(345.,30.)]==str(r['quotient']);assert entries[(265.,70.)]+entries[(305.,70.)]+entries[(345.,70.)]==str(dividend);assert entries[(345.,215.)]==str(r['remainder']);assert'세로식'in prompt
  assert a==f'몫 {r["quotient"]}, 나머지 {r["remainder"]}'
 elif tid in['OP12','OP13']:
  values=set()
  if tid=='OP12':
   for p in permutations(m['numbers']):
    for ops in permutations(['+','-']):values.add(int(evaluate(str(p[0])+ops[0]+str(p[1])+ops[1]+str(p[2]))))
   assert min(values)>=0
  else:
   tokens=[str(m['numbers'][0]),'+',str(m['numbers'][1]),'*',str(m['numbers'][2]),'-',str(m['numbers'][3])]
   for i in range(4):
    for j in range(i+1,4):
     t=tokens[:];t[2*i]='('+t[2*i];t[2*j]+=')';values.add(int(evaluate(''.join(t))))
   assert len(values)==3
  assert r['values']==sorted(values)
  assert len(r['expressions'])==len(values)
  seen=[]
  for exp in r['expressions']:
   expr,value=exp.replace('×','*').replace('−','-').split('=');assert int(evaluate(expr))==int(value);seen.append(int(value))
   assert Counter(map(int,re.findall(r'\d+',expr)))==Counter(m['numbers'])
   if tid=='OP12':assert expr.count('+')==expr.count('-')==1 and'('not in expr
   else:assert expr.count('(')==expr.count(')')==1
   assert exp in a
  assert sorted(seen)==sorted(values)
 elif tid=='NS20':
  ns=range(m['lower'],m['upper']+1);odds=[n for n in ns if n%2];evens=[n for n in ns if not n%2];assert r=={'total':len(odds)+len(evens),'odd':len(odds),'even':len(evens)};assert a==f'전체 {r["total"]}개, 홀수 {r["odd"]}개, 짝수 {r["even"]}개'
 elif tid=='NC12':
  # Greedy Roman notation, independently of the supplied ones lookup.
  vals=[]
  for n in m['numbers']:
   st=''
   for value,symbol in[(10,'X'),(9,'IX'),(5,'V'),(4,'IV'),(1,'I')]:
    while n>=value:n-=value;st+=symbol
   vals.append(st)
  assert vals==r['strings']and a==', '.join(vals)
 elif tid=='NS21':
  stream='+'.join(map(str,range(m['lower'],m['upper']+1)))+'=';assert len(stream)==r['presses']and a==f'{len(stream)}번'
 elif tid=='NS22':
  clock=0
  for n in range(m['lower'],m['upper']+1):
   if n>m['lower']:clock+=m['restBetween']
   for digit in str(n):clock+=m['secondsPerDigit']
  assert r['seconds']==clock and a==f'{clock}초'
 elif tid=='VN08':
  circles=nodes(root,'circle');assert len(circles)==3
  actual=[]
  for n,it in zip(circles,m['items']):
   color={'#c84940':'R','#3b76b5':'B'}[n.attrib['fill']];size='L'if float(n.attrib['r'])==45 else'S';actual.append(color+size);assert color==it['color']and size==it['size']
  assert r['codes']==actual
 elif tid=='TM13':
  actual=['△'if'동안'in t else'○'for t in m['statements']];assert r['marks']==actual;assert all(t in prompt for t in m['statements']);assert a==', '.join('가나다라'[i]+' '+x for i,x in enumerate(actual))
 elif tid=='NG02':
  target=m['target'];winning={target:False}
  for state in range(target-1,-1,-1):winning[state]=any(not winning[state+step]for step in m['moves']if state+step<=target)
  moves=[step for step in m['moves']if not winning[step]];assert moves==[r['first']]
  def follow(state,own):
   if state==target:return not own
   options=[r['replyToOne']if(state-r['first'])%3==1 else r['replyToTwo']]if own else[1,2]
   if own:assert len(options)==1 and options[0]in m['moves']
   return all(follow(state+step,not own)for step in options if state+step<=target)
  # All opponent paths after the fixed winning first move.
  assert follow(r['first'],False)
 elif tid=='UL40':
  vals=[m['unitValues'][u]*n for _,n,u in m['items']];assert vals==r['lengths'];groups=[]
  for val in sorted(set(vals)):groups.append('='.join(m['items'][i][0]for i,x in enumerate(vals)if x==val))
  assert r['order']==a=='<'.join(groups)
 elif tid=='SQ27':
  assert m['values']==list(range(m['factor'],11*m['factor'],m['factor']));assert r['digits']==[int(str(x)[-1])for x in m['values']];assert a==', '.join(map(str,r['digits']))
 elif tid in['PT08','PT09']:
  inventory=m['inventory'];groups=[m['partition']]if tid=='PT08'else m['constructions'];outers=[m['outer']]if tid=='PT08'else m['outers'];expected=Counter(tuple(geometry_signature(p))for p in inventory)
  for group,outer in zip(groups,outers):
   assert Counter(tuple(geometry_signature(p))for p in group)==expected;cover(group,outer)
   # Every piece is connected to another along a full original edge.
   for i,p in enumerate(group):
    edges=[(tuple(a),tuple(b))for a,b in zip(p,p[1:]+p[:1])];assert any(any(set(e)==set(map(tuple,f))for e in edges for f in zip(q,q[1:]+q[:1]))for j,q in enumerate(group)if j!=i)
  if tid=='PT08':
   p=outers[0];assert len(p)==4;assert len({squared(a,b)for a,b in zip(p,p[1:]+p[:1])})==1;assert squared(p[0],p[2])==squared(p[1],p[3]);assert r['construction']==groups[0]
  else:assert len(outers[0])!=len(outers[1]);assert r['constructions']==groups
  out['exactCoverAndInventory']=len(groups)
 elif tid=='TL03':
  actual=[]
  for n in m['polygonSides']:
   a0=F(180*(n-2),n);turn=F(360)/a0
   if turn.denominator==1 and turn>=3:actual.append(n)
   assert str(float(a0)).removesuffix('.0')+'°'in numtext(root)
  assert r['polygonSides']==actual
 elif tid=='UA38':
  w,h=m['target'];cells={(x,y)for y in range(h)for x in range(w)};placements=[]
  if len(cells)%2:
   assert w%2==h%2==1 and r==dict(square=len(cells),domino=None,circlePossible=False)
  else:
   if w%2==0:placements=[{(x,y),(x+1,y)}for y in range(h)for x in range(0,w,2)]
   else:placements=[{(x,y),(x,y+1)}for y in range(0,h,2)for x in range(w)]
   assert set.union(*placements)==cells and sum(map(len,placements))==len(cells);assert r==dict(square=len(cells),domino=len(placements),circlePossible=False)
  # A positive-radius contained disk cannot contain a rectangle's corner.
  assert m['units'][2]['radius']>0
 elif tid=='NC13':
  valid=[]
  for xs in permutations(m['cards']):
   if xs[0]<xs[1]<xs[2]and xs[3]<xs[1]<xs[4]and sum(xs[i]for i in[0,1,2])==m['sums'][0]and sum(xs[i]for i in[3,1,4])==m['sums'][1]:valid.append(list(xs))
  assert valid==[r['assignment']];assert all('合'not in t for t in numtext(root));assert[f'합 {v}'for v in m['sums']]==numtext(root)[-2:]
 elif tid=='LG08':
  stream=iter(m['cipher']);table=[['']*m['cols']for _ in range(m['rows'])]
  for c in range(m['cols']):
   for rr in range(m['rows']):table[rr][c]=next(stream)
  plain=''.join(''.join(row)for row in table);assert plain==r['plain']==a==m['plain'];assert len(nodes(root,'rect'))==m['rows']*m['cols']==8;assert not any(numtext(root))
 elif tid=='CT12':
  teams=list(range(m['teams']));pairs=set(combinations(teams,2));current=teams;games=0
  while len(current)>1:games+=len(current)//2;current=current[::2]
  assert r==dict(league=len(pairs),knockout=games)
 elif tid=='RT07':
  cs=nodes(root,'circle');assert len(cs)==m['circleCount'];centers=[[float(n.attrib['cx']),float(n.attrib['cy'])]for n in cs];rad=[float(n.attrib['r'])for n in cs];assert len(set(rad))==1
  for i in range(len(cs)-1):close(math.dist(centers[i],centers[i+1]),rad[i]+rad[i+1])
  assert r['routes']==len(list(product(['upper','lower'],repeat=len(cs))))
 elif tid in['AG31','AG32']:
  angles=[m['angle']]if tid=='AG31'else m['angles'];polys=nodes(root,'polyline');rays=[p for p in polys if len(points_attribute(p.attrib['points']))==3];assert len(rays)==len(angles)
  for ray,angle in zip(rays,angles):
   p=points_attribute(ray.attrib['points']);v=sub(p[0],p[1]);w=sub(p[2],p[1]);actual=math.degrees(math.acos((v[0]*w[0]+v[1]*w[1])/math.sqrt(squared(v,[0,0])*squared(w,[0,0]))));close(actual,angle)
  if tid=='AG31':assert r['angle']==m['angle']and a==str(m['angle'])+'°'
  else:assert r['names']==['예각'if x<90 else'직각'if x==90 else'둔각'for x in angles]
 elif tid in['SP02','DS07']:
  normals=cube_normals(m['cells']);cells=nodes(root,'rect');assert len(cells)==6
  assert set((int(n.attrib['data-x']),int(n.attrib['data-y']))for n in cells)==set((c['x'],c['y'])for c in m['cells'])
  if tid=='SP02':assert r==dict(solid='정육면체',faceShape='정사각형',faces=6);assert not nodes(root,'text')
  else:
   pairs={tuple(sorted((a,b)))for a,b in combinations(normals,2)if all(x==-y for x,y in zip(normals[a],normals[b]))};assert pairs==set(map(tuple,r['pairs']));assert set(map(sum,pairs))=={r['sum']};assert Counter(numtext(root))==Counter(str(c['number'])for c in m['cells'])
 elif tid=='TR11':
  allsegs={d:[m['segments'][ch]for ch in parts]for d,parts in m['digits'].items()};can={canonical_segments(v)for v in allsegs.values()};valid=[]
  for d in m['shown']:
   turned=[[(-x,-y)for x,y in line]for line in allsegs[str(d)]]
   if canonical_segments(turned)in can:valid.append(d)
  assert r['digits']==valid;assert len(nodes(root,'polyline'))==sum(len(m['digits'][str(d)])for d in m['shown']);assert list(map(str,m['shown']))==numtext(root)
 elif tid=='TR14':
  rotations=[(i*90)%360 for i in range(1,m['steps']+1)];assert rotations.count(0)==r['returns'];assert a==str(r['returns'])+'번'
 elif tid=='TR13':
  ps=m['triangle'];reflected=[[-x,y]for x,y in ps];assert area(clip(ps,reflected))==0;outer=cover([ps,reflected],m['outer']);ds=[squared(p,q)for p,q in combinations(outer,2)];assert len(ds)==3 and len(set(ds))<=2;assert r['kind']=='isosceles';assert a=='이등변삼각형'
 elif tid=='TR12':
  # Independent centered complex rotations, separate from repeated cell mapping.
  union=set()
  for x,y in m['givenCells']:
   for t in m['quarterTurns']:
    z=complex(x-1,y-1)*(1j**t);union.add((int(z.real)+1,int(z.imag)+1))
  assert set(map(tuple,r['union']))==union and r['uncolored']==9-len(union)
  rects=nodes(root,'rect');assert len(rects)==18;given={(int(n.attrib['data-col']),int(n.attrib['data-row']))for n in rects[:9]if n.attrib['fill']!='white'};assert given==set(map(tuple,m['givenCells']));assert all(n.attrib['fill']=='white'for n in rects[9:])
  ar=xml(s['solutionVisualMarkup']);assert{(int(n.attrib['data-col']),int(n.attrib['data-row']))for n in nodes(ar,'rect')[9:]if n.attrib['fill']!='white'}==union
 elif tid=='GP03':
  i=m['falseIndex'];p=m['counterexample'];assert r['falseIndex']==i and r['counterexample']==p
  ds=[squared(x,y)for x,y in zip(p,p[1:]+p[:1])];vectors=[sub(y,x)for x,y in zip(p,p[1:]+p[:1])];dots=[v[0]*w[0]+v[1]*w[1]for v,w in zip(vectors,vectors[1:]+vectors[:1])]
  false=m['statements'][i-1]
  if'모든 마름모'in false:assert len(p)==4 and len(set(ds))==1 and any(dots)
  elif'모든 이등변삼각형'in false:assert len(p)==3 and len(set(ds))==2
  elif'모든 사다리꼴'in false:assert len(p)==4 and any(dots)and cross(vectors[0],vectors[2])==0
  else:raise AssertionError(false)
 elif tid=='FC22':
  counts=[0,0,0]
  drawings=nodes(root,'polygon');assert len(drawings)==len(m['polygons'])
  for node,p in zip(drawings,m['polygons']):
   actual=points_attribute(node.attrib['points']);assert len(actual)==len(p)
   original=[squared(a,b)for a,b in combinations(p,2)];rendered=[squared(a,b)for a,b in combinations(actual,2)];scale=rendered[0]/original[0]
   for aa,bb in zip(original,rendered):close(bb/scale,aa)
  for p in m['polygons']:
   v=[sub(b,a)for a,b in zip(p,p[1:]+p[:1])];sides=[squared(x,[0,0])for x in v];right=all(a[0]*b[0]+a[1]*b[1]==0 for a,b in zip(v,v[1:]+v[:1]));equal=len(set(sides))==1;counts=[counts[0]+int(right and equal),counts[1]+int(right),counts[2]+int(equal)]
  assert r['counts']==counts
 elif tid=='FC23':
  ps=m['points'];valid=[]
  for ids in combinations(range(len(ps)),4):
   # Convex hull with four vertices, then at least one pair of parallel opposite sides.
   from soma_authoring_proofs import hull
   p=hull([ps[i]for i in ids])
   if len(p)!=4:continue
   vs=[sub(b,a)for a,b in zip(p,p[1:]+p[:1])]
   if cross(vs[0],vs[2])==0 or cross(vs[1],vs[3])==0:valid.append(ids)
  assert r['total']==len(valid);assert'두 점을 고르는'not in prompt;assert len(nodes(root,'circle'))==len(ps)
 elif tid=='QR33':
  a0,b,c=m['chain'];green=sum([a0]*b);box=sum([green]*c);assert r==dict(green=green,box=box)
 elif tid=='BL05':
  left=sum([m['appleInOranges']]*m['leftApples']);right=m['rightOranges'];side='오른쪽'if left>right else'왼쪽';assert left!=right;assert r==dict(side=side,count=abs(left-right));assert a==side+'에 귤 '+str(abs(left-right))+'개'
 elif tid=='MG13':
  g=r['grid'];assert g==m['grid'];flat=sum(g,[]);assert sorted(flat)==list(range(m['first'],m['first']+25));positions={v:(i,j)for i,row in enumerate(g)for j,v in enumerate(row)};assert positions[m['first']]==(0,2)
  for v in range(m['first'],m['first']+24):
   rr,c=positions[v];candidate=((rr-1)%5,(c+m['horizontalDirection'])%5);nr,nc=candidate
   expected=((rr+1)%5,c)if g[nr][nc]<=v else candidate;assert positions[v+1]==expected
  sums=[sum(row)for row in g]+[sum(g[i][j]for i in range(5))for j in range(5)]+[sum(g[i][i]for i in range(5)),sum(g[i][4-i]for i in range(5))];assert len(set(sums))==1
  ar=xml(s['solutionVisualMarkup']);assert list(map(str,flat))==numtext(ar);assert not any(numtext(root));assert'합이'in s['problem']['solution']and'합이'not in prompt
 else:raise AssertionError(tid)
 return dict(instanceId=s['instanceId'],typeId=tid,passed=True,**out)
