"""Calculated SVG givens and separate answer figures for the 44 source-profile variants."""
import math,re,xml.etree.ElementTree as ET
from html import escape
INK='#254f46'; ANSWER='#b34335'
def svg(body,w=600,h=300,large=False):return f'<svg class="soma-authoring-figure" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img"'+(' data-large-grid="true"'if large else'')+'>'+body+'</svg>'
def text(x,y,s,size=21):return f'<text x="{x:g}" y="{y:g}" text-anchor="middle" font-size="{size}">{escape(str(s))}</text>'
def poly(points,fill='none',color=INK,cls=''):return f'<polygon class="{cls}" points="'+ ' '.join(f'{x:g},{y:g}'for x,y in points)+f'" fill="{fill}" stroke="{color}" stroke-width="2"/>'
def path(points,color=INK,dash=False):return '<polyline points="'+' '.join(f'{x:g},{y:g}'for x,y in points)+f'" fill="none" stroke="{color}" stroke-width="2"'+(' stroke-dasharray="5 4"'if dash else'')+'/>'
def pointboard(points,triangular=False,answer=None,grid=True):
 metric=lambda p:(p[0],p[1]*math.sqrt(3)if triangular else p[1]); ps=[metric(p)for p in points];xs=[p[0]for p in ps];ys=[p[1]for p in ps];scale=min(400/max(max(xs)-min(xs),1),185/max(max(ys)-min(ys),1));left=300-(max(xs)-min(xs))*scale/2;top=220
 project=lambda p:(left+(metric(p)[0]-min(xs))*scale,top-(metric(p)[1]-min(ys))*scale)
 b=''
 if grid and not triangular:
  for x in range(math.floor(min(xs)),math.ceil(max(xs))+1):b+=path([project((x,min(ys))),project((x,max(ys)))],color='#d5ded9')
  for y in range(math.floor(min(ys)),math.ceil(max(ys))+1):b+=path([project((min(xs),y)),project((max(xs),y))],color='#d5ded9')
 if answer:
  for face in answer:b+=poly([project(points[i])for i in face],color=ANSWER)
 for i,p in enumerate(points):
  x,y=project(p);b+=f'<circle class="given-point" data-index="{i}" cx="{x:g}" cy="{y:g}" r="4" fill="{INK}"/>'+text(x+11,y-9,'가나다라마바사아자차카타파하'[i],19)
 return svg(b),dict(pixels=[list(project(p))for p in points],triangularMetric=triangular)
def parts_figure(parts,answer=False):
 # Each supplied set is one construction; the answer may show several constructions side by side.
 groups=parts if answer else [[p]for p in parts]
 b='';n=len(groups)
 for j,group in enumerate(groups):
  pts=[p for piece in group for p in piece];xs=[p[0]for p in pts];ys=[p[1]for p in pts];space=560/n;s=min((space-25)/max(max(xs)-min(xs),1),170/max(max(ys)-min(ys),1));ox=20+j*space+(space-(max(xs)-min(xs))*s)/2;oy=220
  for piece in group:b+=poly([(ox+(x-min(xs))*s,oy-(y-min(ys))*s)for x,y in piece],fill='#edf1ed',color=ANSWER if answer else INK)
  if n>1:b+=text(20+(j+.5)*space,265,j+1)
 return svg(b)
def circles_chain():
 b=f'<circle class="large-circle" cx="300" cy="145" r="112" fill="none" stroke="{INK}" stroke-width="2"/>'
 for x in [300-224/3,300,300+224/3]:b+=f'<circle class="small-circle" cx="{x:g}" cy="145" r="{112/3:g}" fill="none" stroke="{INK}" stroke-width="2"/>'
 return svg(b+text(300,285,'큰 원의 반지름 12cm'))
def train_logo():return svg(f'<rect class="logo-rectangle" x="140" y="95" width="200" height="90" fill="#e8c15a" stroke="{INK}"/>'+poly([(340,95),(430,185),(340,185)],'#77b8a5')+''.join(f'<circle class="logo-circle" cx="{x}" cy="205" r="23" fill="#7597b9" stroke="{INK}"/>'for x in [185,300]))
def attribute_cards():
 b=f'<circle cx="120" cy="130" r="43" fill="#c84940"/>'+poly([(260,173),(346,173),(303,87)],'#3b76b5')+f'<rect x="453" y="115" width="30" height="30" fill="#c84940"/>'
 return svg(b+text(120,235,'가')+text(303,235,'나')+text(468,235,'다'))
def regular_shapes():
 b=''
 for j,n in enumerate([3,4,5,6]):
  cx=85+145*j;ps=[(cx+48*math.cos(-math.pi/2+2*math.pi*k/n),115+48*math.sin(-math.pi/2+2*math.pi*k/n))for k in range(n)];b+=poly(ps)+text(cx,215,['정삼각형','정사각형','정오각형','정육각형'][j])+text(cx,250,str(180*(n-2)//n)+'°')
 return svg(b)
def area_units():
 b=poly([(30,30),(270,30),(270,190),(30,190)])+text(150,25,'6cm')+text(295,115,'4cm')
 b+=poly([(340,55),(380,55),(380,95),(340,95)])+text(360,130,'① 1cm × 1cm',17)
 b+=poly([(425,55),(505,55),(505,95),(425,95)])+text(465,160,'② 2cm × 1cm',17)
 b+=f'<circle cx="520" cy="225" r="20" fill="none" stroke="{INK}"/>'+text(445,275,'③ 지름 1cm인 원',17)
 return svg(b)
def cross_cards(values=None):
 pos=[(105,155),(280,155),(455,155),(280,50),(280,260)];b=''
 for i,(x,y)in enumerate(pos):b+=f'<rect class="cross-card" x="{x-28}" y="{y-28}" width="56" height="56" fill="white" stroke="{INK}"/>'+text(x,y+8,values[i]if values else'',22)
 b+=text(540,163,'합 12',19)+text(280,328,'합 16',19)
 return svg(b,h=345)
def cipher_grid(filled=None):
 b=''
 for y in range(2):
  for x in range(4):b+=f'<rect x="{140+80*x}" y="{50+80*y}" width="80" height="80" fill="white" stroke="{INK}"/>'+text(180+80*x,100+80*y,filled[y*4+x]if filled else'')
 return svg(b)
def tangent_route():return svg(''.join(f'<circle class="route-circle" cx="{x}" cy="140" r="75" fill="none" stroke="{INK}" stroke-width="2"/>'for x in [140,290,440])+text(55,145,'S')+text(525,145,'T'))
def protractor(angle=120):
 cx,cy,r=300,215,160;b=f'<path d="M140 215A160 160 0 0 1 460 215" fill="none" stroke="{INK}"/>'
 for a in range(0,181,10):
  p=lambda rad:(cx+rad*math.cos(math.radians(a)),cy-rad*math.sin(math.radians(a)))
  b+=path([p(r-12),p(r)])
  if a%30==0:x,y=p(r+22);b+=text(x,y+6,a,18)
 end=(cx+140*math.cos(math.radians(angle)),cy-140*math.sin(math.radians(angle)))
 b+=path([(cx+140,cy),(cx,cy),end],ANSWER)+text(cx,cy+28,'O')
 return svg(b,h=260)
def tetra_net():
 points=[(0,0),(2,0),(4,0),(1,1),(3,1),(2,2)]
 project=lambda p:(160+65*p[0],255-65*math.sqrt(3)*p[1])
 b=poly([project(points[i])for i in [0,2,5]],'#f4f1e6')+path([project(points[i])for i in [1,3,4,1]],dash=True)
 return svg(b),dict(points=points,faces=[[0,1,3],[1,2,4],[3,4,5],[1,3,4]])
def cube_net_from_verified(previous):
 original=previous['visualMarkup'];source=re.search(r'<svg\b.*?</svg>',original,re.S)[0];root=ET.fromstring(source);ns={'s':'http://www.w3.org/2000/svg'};rects=root.findall('.//{*}rect');labels=root.findall('.//{*}text');assignment={(1,0):3,(0,1):1,(1,1):2,(2,1):6,(3,1):5,(1,2):4};cells=[];mapping={}
 for r,t in zip(rects,labels):
  c=(round((float(r.attrib['x'])-20)/46),round((float(r.attrib['y'])-20)/46));assert c in assignment;cells.append(dict(x=c[0],y=c[1],number=assignment[c]));mapping[t.text]=str(assignment[c])
 assert len(cells)==6
 for old,new in mapping.items():source=source.replace('>'+old+'</text>','>'+new+'</text>')
 source=re.sub(r'<rect\b[^>]*>',lambda m:re.sub(r'fill="[^"]*"','fill="#fff"',m[0]),source)
 return '<div class="soma-authoring-net">'+source+'</div>',dict(cells=cells,geometrySourceInstance=previous['instanceId'],originalRectangles=[{k:r.attrib[k]for k in ['x','y','width','height']}for r in rects])
DIGITS={'0':'abcdef','1':'bc','2':'abdeg','3':'abcdg','4':'bcfg','5':'acdfg','6':'acdefg','7':'abc','8':'abcdefg','9':'abcdfg'}
SEGMENTS={'a':[(0,0),(2,0)],'b':[(2,0),(2,2)],'c':[(2,2),(2,4)],'d':[(0,4),(2,4)],'e':[(0,2),(0,4)],'f':[(0,0),(0,2)],'g':[(0,2),(2,2)]}
def digital_cards():
 b=''
 for j,(digit,segs)in enumerate(DIGITS.items()):
  cx=52+120*(j%5);cy=24+140*(j//5);pts=[p for s in segs for p in SEGMENTS[s]];mid=(min(x for x,y in pts)+max(x for x,y in pts))/2
  for s in segs:
   line=[(cx+(x-mid)*19,cy+y*19)for x,y in SEGMENTS[s]];b+=path(line)
  b+=text(cx,cy+108,digit,19)
 return svg(b,h=300)
def mirror_triangle(answer=False):
 project=lambda p:(300+80*p[0],235-80*p[1]);b=path([(300,25),(300,250)],dash=True)
 b+=poly([project(p)for p in [(0,0),(2,0),(0,2)]],'#d8e5dd')
 if answer:b+=poly([project(p)for p in [(0,0),(-2,0),(0,2)]],'#f7e6df',ANSWER)
 return svg(b)
def cell_rotation(cells,answer=False):
 def grid(ox,fill):
  out=''
  for y in range(3):
   for x in range(3):out+=f'<rect class="rotation-cell" data-col="{x}" data-row="{y}" x="{ox+50*x}" y="{60+50*y}" width="50" height="50" fill="'+('#558775'if(x,y)in fill else'white')+f'" stroke="{INK}"/>'
  return out
 b=grid(80,{(0,0),(1,0)})+grid(360,set(cells)if answer else set())+text(155,245,'처음 모양')+text(435,245,'겹친 모양')
 return svg(b)
def angle_categories():
 b=''
 for j,a in enumerate([30,90,120]):
  cx=90+200*j;cy=190;end=(cx+80*math.cos(math.radians(a)),cy-80*math.sin(math.radians(a)));b+=path([(cx+80,cy),(cx,cy),end])+text(cx,250,'가나다'[j])
 return svg(b)
def quadrilateral_kinds():
 ps=[[(0,0),(2,0),(2,2),(0,2)],[(0,0),(3,0),(3,2),(0,2)],[(0,1),(2,0),(4,1),(2,2)]];b=''
 for j,p in enumerate(ps):
  for x in range(5):b+=path([(30+j*200+35*x,120),(30+j*200+35*x,190)],'#d4dfd8')
  for y in range(3):b+=path([(30+j*200,190-35*y),(170+j*200,190-35*y)],'#d4dfd8')
  b+=poly([(30+j*200+35*x,190-35*y)for x,y in p])+text(95+j*200,245,'가나다'[j])
 return svg(b),ps
def trapezoid_board():
 ps=[(0,1),(1,1),(2,1),(-1,0),(1,0),(3,0)];project=lambda p:(170+90*p[0],220-130*p[1]);b=path([project(ps[i])for i in [0,2]])+path([project(ps[i])for i in [3,5]])
 for i in range(3):
  for j in range(3,6):b+=path([project(ps[i]),project(ps[j])],color='#75988c')
 for i,p in enumerate(ps):x,y=project(p);b+=f'<circle cx="{x:g}" cy="{y:g}" r="4" fill="{INK}"/>'+text(x,y+(-13 if i<3 else 28),'가나다라마바'[i],19)
 return svg(b),ps
def circle_points(n,answer=None):
 ps=[(300+105*math.cos(-math.pi/2+2*math.pi*k/n),145+105*math.sin(-math.pi/2+2*math.pi*k/n))for k in range(n)];b=f'<circle cx="300" cy="145" r="105" fill="none" stroke="{INK}"/>'
 if answer:b+=poly([ps[i]for i in answer],color=ANSWER)
 for i,(x,y)in enumerate(ps):b+=f'<circle class="given-point" cx="{x:g}" cy="{y:g}" r="4" fill="{INK}"/>'+text(300+(x-300)*1.2,145+(y-145)*1.2+6,'가나다라마바사아자'[i],19)
 return svg(b),ps
def magic_grid(values=None):
 b=''
 for r in range(5):
  for c in range(5):b+=f'<rect x="{35+50*c}" y="{35+50*r}" width="50" height="50" fill="white" stroke="{INK}"/>'+text(60+50*c,93/2+50*r+20,values[r][c]if values else'',20)
 return svg(b,w=320,h=320,large=True)
def written_division_answer():
 b='<path d="M245 80V40H370M255 115H320M295 185H360" fill="none" stroke="#254f46"/>'
 entries=[(305,30,'7'),(345,30,'6'),(220,70,'7'),(265,70,'5'),(305,70,'3'),(345,70,'8'),(265,105,'4'),(305,105,'9'),(235,105,'−'),(305,140,'4'),(345,140,'8'),(305,175,'4'),(345,175,'2'),(275,175,'−'),(345,215,'6')]
 return svg(b+''.join(text(x,y,s,22)for x,y,s in entries),h=245)
