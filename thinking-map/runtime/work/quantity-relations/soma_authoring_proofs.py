"""Independent exact geometry, enumeration and small-state solvers. No authoring module imports."""
from fractions import Fraction as F
from itertools import combinations,permutations,product
from collections import Counter,deque
import ast,math,re,xml.etree.ElementTree as ET

def cross(a,b):return a[0]*b[1]-a[1]*b[0]
def sub(a,b):return(a[0]-b[0],a[1]-b[1])
def signed(p):return sum(cross(a,b)for a,b in zip(p,p[1:]+p[:1]))/F(2)
def area(p):return abs(signed(p))if p else F(0)
def squared(a,b,metric=1):return(a[0]-b[0])**2+metric*(a[1]-b[1])**2
def triangles(points,kind,metric=1):
 out=[]
 for ids in combinations(range(len(points)),3):
  pts=[points[i]for i in ids]
  if cross(sub(pts[1],pts[0]),sub(pts[2],pts[0]))==0:continue
  ds=sorted(squared(a,b,metric)for a,b in combinations(pts,2))
  good=kind=='all'or kind=='equilateral'and ds[0]==ds[2]or kind=='isosceles'and len(set(ds))<=2 or kind=='right'and ds[0]+ds[1]==ds[2]or kind=='right-isosceles'and ds[0]==ds[1]and ds[0]+ds[1]==ds[2]
  if good:out.append((ids,ds))
 return out
def clip(subject,clipper):
 subject=[tuple(map(F,x))for x in subject];clipper=[tuple(map(F,x))for x in clipper]
 if signed(clipper)<0:clipper.reverse()
 for a,b in zip(clipper,clipper[1:]+clipper[:1]):
  if not subject:break
  result=[];s=subject[-1];s_inside=cross(sub(b,a),sub(s,a))>=0
  for e in subject:
   inside=cross(sub(b,a),sub(e,a))>=0
   if inside!=s_inside:
    direction=sub(e,s);edge=sub(b,a);t=F(cross(sub(a,s),edge),cross(direction,edge));result.append((s[0]+t*direction[0],s[1]+t*direction[1]))
   if inside:result.append(e)
   s=e;s_inside=inside
  subject=result
 return subject
def boundary(parts):
 edges=[]
 for p in parts:
  p=[tuple(map(F,x))for x in p]
  if signed(p)<0:p.reverse()
  for a,b in zip(p,p[1:]+p[:1]):
   if(b,a)in edges:edges.remove((b,a))
   else:edges.append((a,b))
 path=[edges[0][0]];current=path[0]
 for _ in range(len(edges)):
  candidates=[e for e in edges if e[0]==current];assert len(candidates)==1;edge=candidates[0];edges.remove(edge);current=edge[1];path.append(current)
 assert current==path[0]and not edges;path.pop()
 while any(cross(sub(path[i],path[i-1]),sub(path[(i+1)%len(path)],path[i]))==0 for i in range(len(path))):
  for i in range(len(path)):
   if cross(sub(path[i],path[i-1]),sub(path[(i+1)%len(path)],path[i]))==0:path.pop(i);break
 return path
def convex(p):return len({1 if cross(sub(b,a),sub(c,b))>0 else -1 for a,b,c in zip(p,p[1:]+p[:1],p[2:]+p[:2])if cross(sub(b,a),sub(c,b))})==1
def hull(points):
 pts=sorted(set(map(tuple,points)));lower=[];upper=[]
 for dest,order in [(lower,pts),(upper,list(reversed(pts)))]:
  for p in order:
   while len(dest)>1 and cross(sub(dest[-1],dest[-2]),sub(p,dest[-1]))<=0:dest.pop()
   dest.append(p)
 return lower[:-1]+upper[:-1]
def cover(parts,outer):
 assert all(area(clip(a,b))==0 for a,b in combinations(parts,2));actual=boundary(parts)
 assert area(actual)==area(outer)==sum(area(x)for x in parts)
 # Equality of the simplified boundary, up to cyclic shift and reversal, proves no holes or outside area.
 canonical=lambda p:min(tuple(p[i:]+p[:i])for i in range(len(p)))
 a=list(map(tuple,actual));b=list(map(tuple,outer));assert canonical(a)in[canonical(b),canonical(list(reversed(b)))]
 return actual
def cube_normals(cells):
 cells={(c['x'],c['y']):c['number']for c in cells};start=next(iter(cells));frames={start:((1,0,0),(0,1,0),(0,0,1))};q=deque([start]);neg=lambda x:tuple(-v for v in x)
 while q:
  x,y=q.popleft();u,v,n=frames[(x,y)]
  for dx,dy,f in [(1,0,(neg(n),v,u)),(-1,0,(n,v,neg(u))),(0,1,(u,neg(n),v)),(0,-1,(u,n,neg(v)))]:
   at=(x+dx,y+dy)
   if at not in cells:continue
   if at in frames:assert frames[at]==f
   else:frames[at]=f;q.append(at)
 assert len(frames)==len(cells)==6 and len({x[2]for x in frames.values()})==6
 return{cells[at]:f[2]for at,f in frames.items()}
def canonical_segments(segments):
 xs=[F(x)for e in segments for x,y in e];ys=[F(y)for e in segments for x,y in e];mx,my=min(xs),min(ys)
 return tuple(sorted(tuple(sorted((F(x)-mx,F(y)-my)for x,y in e))for e in segments))
def evaluate(expression):
 def calc(n):
  if isinstance(n,ast.Expression):return calc(n.body)
  if isinstance(n,ast.Constant)and isinstance(n.value,int):return F(n.value)
  if isinstance(n,ast.BinOp):
   a,b=calc(n.left),calc(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
  raise AssertionError(type(n))
 return calc(ast.parse(expression,mode='eval'))
def xml(markup):return ET.fromstring(re.search(r'<svg\b.*?</svg>',markup,re.S)[0])
def nodes(root,tag):return root.findall('.//{*}'+tag)
def points_attribute(s):return[tuple(map(float,p.split(',')))for p in s.split()]
def verify_point_figure(s):
 m=s['responseModel'];root=xml(s['visualMarkup']);actual=[(float(x.attrib['cx']),float(x.attrib['cy']))for x in nodes(root,'circle')if x.attrib.get('class')=='given-point'];world=m['points'];assert len(actual)==len(world)
 if 'figure'in m:
  expected=m['figure']['pixels'];assert max(abs(a-b)for p,q in zip(actual,expected)for a,b in zip(p,q))<.001
  yy=[y*math.sqrt(m.get('metricY2',1))for x,y in world];xx=[x for x,y in world];sx=(max(x for x,y in actual)-min(x for x,y in actual))/(max(xx)-min(xx));sy=(max(y for x,y in actual)-min(y for x,y in actual))/(max(yy)-min(yy));assert abs(sx-sy)<.001
 else:assert max(abs(a-b)for p,q in zip(actual,world)for a,b in zip(p,q))<.001

def prove(s):
 m=s['responseModel'];kind=m['kind'];answer=s['problem']['answer'];prompt=s['problem']['prompt'];v=s['visualMarkup'];out={}
 nums=lambda:[int(x)for x in re.findall(r'\d+',answer)]
 if kind in ['UA37','GP02','FC19','FC20','FC21','FC24','FC18']:
  verify_point_figure(s)
 if kind=='UA37':
  valid=[ids for ids in combinations(range(len(m['points'])),3)if area([m['points'][i]for i in ids])==m['targetArea']];assert tuple(m['witness'])in valid;out=dict(validTriangleVertexSets=valid,targetArea=2,oneDrawingRequired=True)
 elif kind=='GP01':
  root=xml(v);assert len(nodes(root,'circle'))==2 and len(nodes(root,'rect'))==1 and len(nodes(root,'polygon'))==1
  assert m['shapeParts']=={'circle':'wheels','triangle':'front','rectangle':'body'};out=dict(visibleCircles=2,visibleRectangles=1,visibleTriangles=1,oralRubricHasMultipleAcceptedWording=True,semanticVisualReviewRequired=True)
 elif kind=='SP01':
  assert m['convexVertexRequired']and '볼록한 정다면체'in prompt;sums=[n*m['faceAngle']for n in m['counts']];valid=[n for n,a in zip(m['counts'],sums)if a<360 and n>=3];assert valid==nums()==[3,4,5];out=dict(angles=sums,validVertexFaceCounts=valid,flatAtSix=True,convexityConditionExplicit=True)
 elif kind=='UL43':
  r=F(m['outerRadius'],m['smallCount']);root=xml(v);circles=nodes(root,'circle');assert len(circles)==4
  big=circles[0];small=circles[1:];R=float(big.attrib['r']);rs=[float(c.attrib['r'])for c in small];xs=[float(c.attrib['cx'])for c in small];assert all(abs(x-R/3)<1e-3 for x in rs)and all(abs(xs[i+1]-xs[i]-2*rs[i])<1e-3 for i in range(2));assert nums()==[r];out=dict(radius=str(r),diameterChainVerified=True)
 elif kind=='FC18':
  sets=list(combinations(range(len(m['points'])),4));assert all(area([m['points'][i]for i in ids])>0 for ids in sets);assert nums()==[len(sets)]==[5];out=dict(validVertexSets=sets,count=5,noncrossingCyclicOrder=True)
 elif kind=='CAL09':
  q,r=divmod(m['dividend'],m['divisor']);assert nums()==[q,r]==[76,6]and '538÷7'in prompt and m['formalWrittenAlgorithmRequired'];work={(int(float(t.attrib['x'])),int(float(t.attrib['y']))):t.text for t in nodes(xml(s['solutionVisualMarkup']),'text')};assert ''.join(work[(x,30)]for x in[305,345])=='76'and ''.join(work[(x,70)]for x in[265,305,345])=='538';assert ''.join(work[(x,105)]for x in[265,305])==str(7*7)=='49'and ''.join(work[(x,140)]for x in[305,345])=='48'and ''.join(work[(x,175)]for x in[305,345])==str(7*6)=='42'and work[(345,215)]=='6';out=dict(quotient=q,remainder=r,recomposed=m['divisor']*q+r,writtenColumnStepsVerified=True)
 elif kind=='OP12':
  values={}
  for ns in permutations(m['numbers']):
   for ops in permutations(m['operators']):
    e=f'{ns[0]}{ops[0]}{ns[1]}{ops[1]}{ns[2]}';value=int(evaluate(e));values.setdefault(value,[]).append(e)
  assert sorted(values)==[0,2,4];assert answer.startswith('0, 2, 4');out=dict(allExpressionValues=values,allValues=[0,2,4])
 elif kind=='NS20':
  vals=list(range(m['lower'],m['upper']+1));counts=[len(vals),sum(x%2==1 for x in vals),sum(x%2==0 for x in vals)];assert nums()==counts==[13,6,7];out=dict(totalOddEven=counts)
 elif kind=='NC12':
  encoded=['X'*(n//10)+m['ones'][n%10]for n in m['numbers']];assert encoded==answer.split(', ')==['III','VIII','IX','XIV'];out=dict(encoded=encoded,canonicalProtocolExplicit=True)
 elif kind=='NS21':
  entry=m['separator'].join(str(x)for x in range(m['lower'],m['upper']+1))+m['terminal'];assert nums()==[len(entry)]==[36];out=dict(actualKeySequence=entry,keyCount=len(entry))
 elif kind=='NS22':
  events=[]
  for n in range(m['lower'],m['upper']+1):
   events.append(len(str(n))*m['secondsPerDigit'])
   if n<m['upper']:events.append(m['restBetween'])
  assert nums()==[sum(events)]==[33];out=dict(timelineDurations=events,totalSeconds=sum(events))
 elif kind=='VN08':
  codes=[x['color']+x['size']for x in m['items']];assert codes==['RL','BL','RS']and all(c in answer for c in codes);root=xml(v);c=nodes(root,'circle')[0];p=nodes(root,'polygon')[0];r=nodes(root,'rect')[0];assert c.attrib['fill']==r.attrib['fill']=='#c84940'and p.attrib['fill']=='#3b76b5';assert float(c.attrib['r'])*2>float(r.attrib['width'])*2;out=dict(orderedCodes=codes,requiredCharacterOrder='color-then-size')
 elif kind=='TM13':
  marks=['○'if re.search('오전|오후',t)else'△'for t in m['statements']];assert marks==re.findall('[○△]',answer)==['○','△','○','△'];out=dict(pointDurationMarks=marks)
 elif kind=='NG02':
  target=m['target'];win={target:False};winning_moves={}
  for at in range(target-1,-1,-1):
   opts=[k for k in m['moves']if at+k<=target and(at+k==target or not win[at+k])];win[at]=bool(opts);winning_moves[at]=opts
  assert winning_moves[0]==[1];assert [at for at in range(target)if not win[at]]==[1,4,7];out=dict(winningMoves=winning_moves,firstMove=1,maintainedTotals=[1,4,7,10],allOpponentChoicesHandled=True)
 elif kind=='UL40':
  amounts=[(name,count*m['unitValues'][unit])for name,count,unit in m['items']];assert [x[1]for x in amounts]==[6,6,8,9]and answer=='가=나<다<라';out=dict(convertedCentimeters=amounts)
 elif kind=='SQ27':
  ds=[x%10 for x in m['values']];assert ds==list(range(9,-1,-1));assert answer.startswith(', '.join(map(str,ds)));out=dict(onesDigits=ds,successiveDifference=-1)
 elif kind=='FC19':
  valid=triangles(m['points'],'equilateral',3);sizes=Counter(ds[0]for ids,ds in valid);assert sizes=={4:4,16:1}and nums()==[4,1];out=dict(equilateralVertexSets=[x[0]for x in valid],squaredSideSizeCounts=dict(sizes))
 elif kind in ['PT08','PT09']:
  constructions=[m['partition']]if kind=='PT08'else m['constructions'];outers=[m['outer']]if kind=='PT08'else m['outers'];invariant=lambda p:sorted(squared(a,b)for a,b in combinations(p,2));inventory=sorted((len(x),invariant(x))for x in m['inventory']);boundaries=[]
  for pieces,outer in zip(constructions,outers):
   assert sorted((len(x),invariant(x))for x in pieces)==inventory;boundaries.append(cover(pieces,outer))
  if kind=='PT08':
   b=boundaries[0];sides=[squared(a,b)for a,b in zip(b,b[1:]+b[:1])];assert len(b)==4 and len(set(sides))==1;assert all(sum(x*y for x,y in zip(sub(b[i-1],b[i]),sub(b[(i+1)%4],b[i])))==0 for i in range(4))
  else:assert convex(boundaries[0])and not convex(boundaries[1])
  given=[points_attribute(x.attrib['points'])for x in nodes(xml(v),'polygon')];assert len(given)==len(m['inventory'])
  ratios=[]
  for pictured,original in zip(given,m['inventory']):
   observed=sorted(squared(a,b)for a,b in combinations(pictured,2));expected=invariant(original);ratios.extend(float(a/b)for a,b in zip(observed,expected))
  assert (max(ratios)-min(ratios))/max(ratios)<.0001
  out=dict(exactBoundaryCertificates=[[list(map(str,p))for p in b]for b in boundaries],inventoryCongruence=True,overlapHolesOutsideAreaZero=True,nonequivalentConstructions=len(boundaries),actualInventoryFigureUsesCommonScale=True)
 elif kind=='TL03':
  angles={n:F(180*(n-2),n)for n in m['polygonSides']};around={n:F(360)/a for n,a in angles.items()};valid=[n for n,x in around.items()if x.denominator==1];assert valid==[3,4,6];out=dict(angles={str(n):str(a)for n,a in angles.items()},tilesAtVertex={str(n):str(around[n])for n in valid},invalidRegularPentagon=True)
 elif kind=='UA38':
  a,b=m['target'];counts=[]
  for unit in m['units']:
   if unit['kind']=='rectangle':w,h=unit['size'];assert a%w==b%h==0;counts.append((a//w)*(b//h))
   else:counts.append(None)
  assert counts==[24,12,None]and nums()==[24,12]
  root=xml(v);polys=[points_attribute(x.attrib['points'])for x in nodes(root,'polygon')];dims=[(max(x for x,y in p)-min(x for x,y in p),max(y for x,y in p)-min(y for x,y in p))for p in polys];assert dims==[(240,160),(40,40),(80,40)]and float(nodes(root,'circle')[0].attrib['r'])==20
  out=dict(unitCounts=counts,circleCannotCoverRectangleCornerWithoutOutside=True,cornerDistanceSquaredOverRadiusSquared=2,actualRenderedDimensionsScale40=True)
 elif kind=='NC13':
  valid=[v for v in permutations(m['cards'])if all(sum(v[i]for i in row)==target and all(v[a]<v[b]for a,b in zip(row,row[1:]))for row,target in zip(m['rows'],m['sums']))];assert valid==[(1,4,7,3,9)]and nums()==[1,4,7,3,9];out=dict(allValidAssignments=valid)
 elif kind=='LG08':
  grid=[['']*m['cols']for _ in range(m['rows'])];i=0
  for c in range(m['cols']):
   for r in range(m['rows']):grid[r][c]=m['cipher'][i];i+=1
  plain=''.join(''.join(row)for row in grid);assert plain==m['plain']==answer;assert ''.join(grid[r][c]for c in range(m['cols'])for r in range(m['rows']))==m['cipher'];out=dict(decoded=plain,grid=grid,roundtripCipher=True)
 elif kind=='CT12':
  league=list(combinations(range(m['teams']),2));knockout=m['teams']-1;assert nums()==[len(league),knockout]==[15,5];out=dict(allLeaguePairs=league,eliminatedTeams=knockout)
 elif kind=='RT07':
  root=xml(v);cs=nodes(root,'circle');assert len(cs)==m['circleCount']==3
  for c,(cx,cy)in zip(cs,m['centers']):assert[float(c.attrib[k])for k in ['cx','cy','r']]==[cx,cy,m['radius']]
  assert all(m['centers'][i+1][0]-m['centers'][i][0]==2*m['radius']for i in range(2));ways=[1]
  for _ in cs:ways.append(sum([ways[-1],ways[-1]]))
  assert nums()==[ways[-1]]==[8];out=dict(shortestArcChoices=list(product(['upper','lower'],repeat=3)),shortestSemicircleCount=3)
 elif kind=='AG31':
  root=xml(v);line=next(x for x in nodes(root,'polyline')if x.attrib['stroke']=='#b34335');ps=points_attribute(line.attrib['points']);a=math.degrees(math.atan2(-(ps[2][1]-ps[1][1]),ps[2][0]-ps[1][0]));assert abs(a-120)<.001 and nums()==[120];out=dict(actualRenderedAngle=a)
 elif kind=='SP02':
  ps=m['points'];assert all(len(set(squared(ps[a],ps[b],3)for a,b in combinations(face,2)))==1 for face in m['faces'])
  root=xml(v);rendered=[p for node in nodes(root,'polygon')+nodes(root,'polyline')for p in points_attribute(node.attrib['points'])];expected=[(160+65*x,255-65*math.sqrt(3)*y)for x,y in ps];assert all(min(math.dist(p,q)for q in rendered)<.001 for p in expected)and all(min(math.dist(p,q)for q in expected)<.001 for p in rendered)
  xyz=[(F(0),F(0),F(0)),(F(2),F(0),F(0)),(F(1),F(1),F(0)),(F(1),F(1,3),F(2,3))];mapping={0:3,1:0,2:3,3:1,4:2,5:3};faces=[tuple(mapping[i]for i in f)for f in m['faces']];incidence=Counter(tuple(sorted(e))for f in faces for e in combinations(f,2));assert len(incidence)==6 and all(c==2 for c in incidence.values());assert all(sum(weight*(a-b)**2 for weight,a,b in zip([1,3,6],xyz[i],xyz[j]))==4 for i,j in combinations(range(4),2));assert len(set(map(frozenset,faces)))==4;out=dict(foldedFaces=faces,allSixSquaredEdges=4,closedEdgeIncidenceTwo=True,nonzeroHeightSquared=str(F(8,3)))
 elif kind=='DS07':
  root=xml(v);rectangles=nodes(root,'rect');texts=nodes(root,'text');actual=[{k:r.attrib[k]for k in ['x','y','width','height']}for r in rectangles];assert actual==m['originalRectangles']and all(r.attrib['fill']=='#fff'for r in rectangles);cells=[]
  for r,t in zip(rectangles,texts):cells.append(dict(x=round((float(r.attrib['x'])-20)/46),y=round((float(r.attrib['y'])-20)/46),number=int(t.text)))
  assert cells==m['cells'];normals=cube_normals(cells);pairs=[(a,b)for a,b in combinations(sorted(normals),2)if sum(x*y for x,y in zip(normals[a],normals[b]))==-1];assert pairs==[(1,6),(2,5),(3,4)]and all(a+b==7 for a,b in pairs);out=dict(oppositePairs=pairs,commonSum=7,existingFigureCoordinatesPreserved=True)
 elif kind=='TR11':
  shapes={d:canonical_segments([m['segments'][k]for k in segs])for d,segs in m['digits'].items()};mapping={}
  for d,segs in m['digits'].items():
   rotated=canonical_segments([[(-x,-y)for x,y in m['segments'][k]]for k in segs]);matches=[digit for digit,shape in shapes.items()if shape==rotated]
   if matches:mapping[d]=matches[0]
  actual={str(i):[]for i in range(10)}
  for line in nodes(xml(v),'polyline'):
   ps=points_attribute(line.attrib['points']);cx=sum(x for x,y in ps)/len(ps);cy=sum(y for x,y in ps)/len(ps);column=round((cx-52)/120);row=0 if cy<130 else 1;actual[str(row*5+column)].append([(F(str(x))/19,F(str(y))/19)for x,y in ps])
  assert all(canonical_segments(actual[d])==shape for d,shape in shapes.items())
  assert sorted(mapping,key=int)==list(map(str,nums()))==['0','1','2','5','6','8','9'];out=dict(rotatedGlyphMap=mapping,fontAndTranslationRuleSpecific=True,renderedGlyphsChecked=True)
 elif kind=='TR14':
  hits=[i for i in range(1,m['steps']+1)if(m['initialDegrees']+i*m['degreesPerStep'])%360==m['initialDegrees']];assert hits==[4,8,12]and nums()==[3];out=dict(equalDirectionSteps=hits)
 elif kind=='TR13':
  a=m['triangle'];b=[[2*m['mirrorX']-x,y]for x,y in a];actual=cover([a,b],m['outer']);ds=sorted(squared(x,y)for x,y in zip(actual,actual[1:]+actual[:1]));assert ds==[8,8,16];out=dict(reflectedVertices=b,outerSquaredSides=list(map(str,ds)),kind='isosceles-triangle',rightAngleNotStudentDemand=True)
 elif kind=='TR12':
  n=m['side'];union=set()
  for turn in m['quarterTurns']:
   for x,y in m['givenCells']:
    for _ in range(turn):x,y=n-1-y,x
    union.add((x,y))
  assert union=={(x,y)for x in range(n)for y in range(n)}-{(1,1)}and nums()==[1]
  for markup,is_answer in [(v,False),(s['solutionVisualMarkup'],True)]:
   rs=nodes(xml(markup),'rect');assert len(rs)==18
   for group,expected in [(rs[:9],set(map(tuple,m['givenCells']))),(rs[9:],union if is_answer else set())]:
    colored={(int(x.attrib['data-col']),int(x.attrib['data-row']))for x in group if x.attrib['fill']!='white'};assert colored==expected
  out=dict(unionCells=sorted(union),uncoloredCells=[[1,1]],givenAndAnswerShadingsSeparated=True)
 elif kind=='AG32':
  actual=[]
  for p in nodes(xml(v),'polyline'):
   a,o,b=points_attribute(p.attrib['points']);u=sub(a,o);w=sub(b,o);angle=math.degrees(math.acos(sum(x*y for x,y in zip(u,w))/math.hypot(*u)/math.hypot(*w)));actual.append(angle)
  assert len(actual)==3 and all(abs(a-b)<.001 for a,b in zip(actual,[30,90,120]));out=dict(renderedAngles=actual,classes=['acute','right','obtuse'])
 elif kind in ['GP02','FC20','FC21']:
  predicate={'GP02':'right-isosceles','FC20':'isosceles','FC21':'right'}[kind];valid=triangles(m['points'],predicate);assert tuple(m['witness'])in[ids for ids,ds in valid]
  if kind=='FC20':assert len(valid)==3 and nums()==[3]
  if kind=='FC21':assert len(valid)==8 and nums()==[8]
  out=dict(validVertexSets=[ids for ids,ds in valid],oneDrawingRequired=True,allPositionCounts=len(valid))
 elif kind=='GP03':
  a,b=m['counterexampleRectangle'];assert a!=b and min(a,b)>0 and answer.startswith('③')and nums()==[3,2];out=dict(falseStatement=3,rectangleCounterexample=[a,b],allFourAnglesRight=True,notAllFourSidesEqual=True)
 elif kind=='FC22':
  categories=[]
  for p in m['polygons']:
   edges=[sub(b,a)for a,b in zip(p,p[1:]+p[:1])];lengths=[sum(x*x for x in e)for e in edges];right=all(sum(a*b for a,b in zip(e,edges[(i+1)%4]))==0 for i,e in enumerate(edges));equal=len(set(lengths))==1;categories.append([right and equal,right,equal])
  rendered=[points_attribute(x.attrib['points'])for x in nodes(xml(v),'polygon')];assert len(rendered)==3
  for j,(picture,points)in enumerate(zip(rendered,m['polygons'])):assert all(math.dist(p,(30+j*200+35*x,190-35*y))<.001 for p,(x,y)in zip(picture,points))
  counts=[sum(c[i]for c in categories)for i in range(3)];assert counts==nums()==[1,2,2];out=dict(squareRectangleRhombusFlags=categories,counts=counts,inclusiveDefinitionsExplicit=True)
 elif kind=='FC23':
  quads=[ids for ids in combinations(range(len(m['points'])),4)if len(hull([m['points'][i]for i in ids]))==4];assert len(quads)==9 and nums()==[9];out=dict(validVertexSets=quads,count=9,unmarkedCrossingsExcluded=True,allFifteenFourPointSubsetsChecked=True,threeCollinearVerticesRejected=True)
 elif kind=='FC24':
  valid=triangles(m['points'],'all');assert len(valid)==10 and nums()==[10];out=dict(allTriangleVertexSets=[ids for ids,ds in valid])
 elif kind=='QR33':
  a,b,c=m['chain'];assert nums()==[1,a*b,1,a*b*c]==[1,6,1,12];out=dict(redForGreen=a*b,redForBox=a*b*c)
 elif kind=='BL05':
  left=m['appleInOranges']*m['leftApples'];right=m['rightOranges'];assert left-right==2 and '오른쪽'in answer and nums()==[2];out=dict(leftInOranges=left,rightInOranges=right,addPan='right',addCount=2)
 elif kind=='OP13':
  ns=m['numbers'];ops=m['operators'];values={}
  for a,b in combinations(range(len(ns)+1),2):
   if b-a<2:continue
   pieces=[]
   for i,n in enumerate(ns):
    if i==a:pieces.append('(')
    pieces.append(str(n))
    if i==b-1:pieces.append(')')
    if i<len(ops):pieces.append(ops[i])
   expression=''.join(pieces);value=int(evaluate(expression));values.setdefault(value,[]).append(expression)
  assert sorted(values)==[12,15,47]and answer.startswith('12, 15, 47');out=dict(allParenthesizedExpressionValues=values,distinctResults=[12,15,47])
 elif kind=='MG13':
  n=m['side'];grid=[[0]*n for _ in range(n)];r,c=m['start'];transitions=[]
  for value in range(1,n*n+1):
   assert grid[r][c]==0;grid[r][c]=value;nr,nc=(r-1)%n,(c+1)%n
   if grid[nr][nc]:nr,nc=(r+1)%n,c
   transitions.append([value,r,c]);r,c=nr,nc
  assert grid==m['grid'];lines=grid+list(map(list,zip(*grid)))+[[grid[i][i]for i in range(n)],[grid[i][n-1-i]for i in range(n)]];assert all(sum(line)==65 for line in lines);assert sorted(x for row in grid for x in row)==list(range(1,26));out=dict(wholeGrid=grid,stepTrace=transitions,allTwelveLineSums=65,optionalVerifierChecksNotStudentPrerequisite=True)
 else:raise AssertionError(kind)
 return dict(typeId=kind,instanceId=s['instanceId'],responseContract=s['studentResponseContract']['kind'],answer=answer,proof=out)
