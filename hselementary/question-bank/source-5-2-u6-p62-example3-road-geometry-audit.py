import subprocess,re,json,itertools,os
node=os.environ.get('NODE_BINARY','node')
s="const m=require('./hselementary/question-bank/source-5-2-u6-page62-originals.js');console.log(JSON.stringify(m.makeQuestion(2).prompt))"
h=json.loads(subprocess.check_output([node,'-e',s],text=True))
groups=dict(re.findall(r'<path data-edge="([A-Z]-[A-Z])" d="([^"]+)"',h))
expected={'A-B':3,'A-D':2,'B-D':2,'B-C':1,'D-C':4}
assert {k:v.count('M') for k,v in groups.items()}==expected
curves=[]
for label,d in groups.items():
 for segment in re.findall(r'M[^M]+',d):
  parts=re.findall(r'[MQL]|-?\d+(?:\.\d+)?',segment);assert parts[0]=='M';a=tuple(map(float,parts[1:3]));op=parts[3]
  if op=='L':b=tuple(map(float,parts[4:6]));c=((a[0]+b[0])/2,(a[1]+b[1])/2)
  else:assert op=='Q';c=tuple(map(float,parts[4:6]));b=tuple(map(float,parts[6:8]))
  pts=[((1-t)**2*a[0]+2*(1-t)*t*c[0]+t*t*b[0],(1-t)**2*a[1]+2*(1-t)*t*c[1]+t*t*b[1]) for t in (i/180 for i in range(181))]
  assert all(2<x<428 and 2<y<248 for x,y in pts)
  curves.append((label,pts))
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
for (la,A),(lb,B) in itertools.combinations(curves,2):
 for a,b in zip(A,A[1:]):
  for c,d in zip(B,B[1:]):
   assert not (cross(a,b,c)*cross(a,b,d)<-1e-7 and cross(c,d,a)*cross(c,d,b)<-1e-7),(la,lb,a,b,c,d)
print('PASS 12 paths, original connections, no interior crossing, paths within viewBox')
