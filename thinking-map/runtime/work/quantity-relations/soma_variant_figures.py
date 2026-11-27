"""Parameter-driven student givens and separate answer SVGs. No solution scaffolds."""
import math
from soma_authoring_figures import svg,text,path,poly,INK,ANSWER,DIGITS,SEGMENTS

LABELS='가나다라마바사아자차카타파하'
POLYGON_NAMES={3:'정삼각형',4:'정사각형',5:'정오각형',6:'정육각형',8:'정팔각형',10:'정십각형',12:'정십이각형'}
def circles(n,radius):
 r=110/n
 return svg(f'<circle class="large-circle" cx="300" cy="140" r="110" fill="none" stroke="{INK}"/>'+''.join(f'<circle class="small-circle" cx="{190+(2*i+1)*r:g}" cy="140" r="{r:g}" fill="none" stroke="{INK}"/>'for i in range(n))+text(300,280,f'큰 원의 반지름 {radius}cm'))

def logo(kind):
 if kind=='boat':
  b=poly([(190,170),(390,170),(350,215),(230,215)],'#e8c15a')+poly([(285,50),(285,160),(375,160)],'#77b8a5')+f'<rect x="280" y="45" width="6" height="126" fill="{INK}"/><rect x="225" y="130" width="45" height="40" fill="#7597b9" stroke="{INK}"/>'
  b+=''.join(f'<circle class="logo-circle" cx="{x}" cy="190" r="10" fill="#7597b9"/>'for x in[255,315])
 elif kind=='robot':
  b=f'<rect x="230" y="100" width="140" height="130" fill="#e8c15a" stroke="{INK}"/>'+poly([(300,35),(250,90),(350,90)],'#77b8a5')
  b+=''.join(f'<circle class="logo-circle" cx="{x}" cy="140" r="14" fill="#7597b9"/>'for x in[267,333])
 else:
  b=f'<rect x="150" y="80" width="190" height="110" fill="#e8c15a" stroke="{INK}"/>'+poly([(340,80),(440,190),(340,190)],'#77b8a5')
  b+=''.join(f'<circle class="logo-circle" cx="{x}" cy="215" r="24" fill="#7597b9"/>'for x in[195,305])
 return svg(b)

def attributes(items):
 b=''
 for j,v in enumerate(items):
  x=110+190*j;r=45 if v['size']=='L'else 22;color={'R':'#c84940','B':'#3b76b5'}[v['color']]
  b+=f'<circle class="attribute-circle" data-color="{v["color"]}" data-size="{v["size"]}" cx="{x}" cy="135" r="{r}" fill="{color}"/>'+text(x,240,LABELS[j])
 return svg(b)

def polygons(ns):
 b=''
 for i,n in enumerate(ns):
  cx=80+i*145;b+=poly([(cx+47*math.cos(-math.pi/2+2*math.pi*k/n),115+47*math.sin(-math.pi/2+2*math.pi*k/n))for k in range(n)])+text(cx,215,POLYGON_NAMES[n],19)+text(cx,250,f'{180*(n-2)/n:g}°',18)
 return svg(b)

def units(w,h):
 s=min(210/w,145/h,37)
 return svg(poly([(30,50),(30+w*s,50),(30+w*s,50+h*s),(30,50+h*s)])+text(30+w*s/2,35,f'{w}cm')+text(60+w*s,60+h*s/2,f'{h}cm')+poly([(350,55),(350+s,55),(350+s,55+s),(350,55+s)])+text(370,135,'① 1cm × 1cm',17)+poly([(425,55),(425+2*s,55),(425+2*s,55+s),(425,55+s)])+text(480,170,'② 2cm × 1cm',17)+f'<circle cx="510" cy="225" r="{s/2:g}" fill="none" stroke="{INK}"/>'+text(455,280,'③ 지름 1cm인 원',17))

def cross(sums,values=None):
 pos=[(105,155),(280,155),(455,155),(280,50),(280,260)];b=''
 for i,(x,y)in enumerate(pos):b+=f'<rect class="cross-card" x="{x-28}" y="{y-28}" width="56" height="56" fill="white" stroke="{INK}"/>'+text(x,y+8,values[i]if values else'')
 return svg(b+text(530,163,f'합 {sums[0]}',19)+text(280,328,f'합 {sums[1]}',19),h=345)

def cipher(rows,cols,filled=None):
 cell=min(80,240/rows,400/cols);ox=300-cols*cell/2;b=''
 for r in range(rows):
  for c in range(cols):b+=f'<rect x="{ox+c*cell:g}" y="{25+r*cell:g}" width="{cell:g}" height="{cell:g}" fill="white" stroke="{INK}"/>'+text(ox+(c+.5)*cell,25+(r+.65)*cell,filled[r*cols+c]if filled else'')
 return svg(b)

def route(n):
 if n==1:return svg(f'<circle class="route-circle" cx="300" cy="140" r="100" fill="none" stroke="{INK}"/>'+text(185,148,'S')+text(415,148,'T')),[[300,140]],100
 r=220/n;centers=[[80+(2*i+1)*r,140]for i in range(n)]
 b=''.join(f'<circle class="route-circle" cx="{x:g}" cy="{y}" r="{r:g}" fill="none" stroke="{INK}"/>'for x,y in centers)
 return svg(b+text(65,148,'S')+text(535,148,'T')),centers,r

def cube(cells,blank=False):
 b='';size=68;xs=[c['x']for c in cells];ys=[c['y']for c in cells];ox=300-size*(min(xs)+max(xs)+1)/2;oy=25-size*min(ys)
 for c in cells:
  x=ox+c['x']*size;y=oy+c['y']*size;b+=f'<rect class="net-cell" data-x="{c["x"]}" data-y="{c["y"]}" x="{x:g}" y="{y:g}" width="{size}" height="{size}" fill="white" stroke="{INK}"/>'+(text(x+size/2,y+size*.62,c['number'])if not blank else'')
 return svg(b,h=330)

def digital(shown):
 b=''
 for j,d in enumerate(shown):
  segs=DIGITS[str(d)];cx=65+115*(j%5);cy=24+140*(j//5);pts=[p for s in segs for p in SEGMENTS[s]];mid=(min(x for x,y in pts)+max(x for x,y in pts))/2
  for s in segs:b+=path([(cx+(x-mid)*19,cy+y*19)for x,y in SEGMENTS[s]])
  b+=text(cx,cy+108,d,19)
 return svg(b,h=300)

def mirror(w,h,answer=False):
 s=min(150/w,180/h);project=lambda p:(300+s*p[0],235-s*p[1]);b=path([(300,25),(300,255)],dash=True)+poly([project(p)for p in[(0,0),(w,0),(0,h)]],'#d8e5dd')
 if answer:b+=poly([project(p)for p in[(0,0),(-w,0),(0,h)]],'#f7e6df',ANSWER)
 return svg(b)

def rotation(given,union=None):
 b=''
 for ox,cells in[(80,set(map(tuple,given))),(360,set(map(tuple,union or[])))]:
  for y in range(3):
   for x in range(3):b+=f'<rect class="rotation-cell" data-col="{x}" data-row="{y}" x="{ox+50*x}" y="{60+50*y}" width="50" height="50" fill="'+('#558775'if(x,y)in cells else'white')+f'" stroke="{INK}"/>'
 return svg(b+text(155,245,'처음 모양')+text(435,245,'겹친 모양'))

def angles(values,center_offset=65):
 b=''
 for j,a in enumerate(values):
  cx=center_offset+200*j;cy=180;end=(cx+75*math.cos(math.radians(a)),cy-75*math.sin(math.radians(a)));b+=path([(cx+75,cy),(cx,cy),end])+text(cx+30,240,LABELS[j])
 return svg(b)

def quadrilaterals(ps):
 b=''
 for i,p in enumerate(ps):
  xs=[x for x,y in p];ys=[y for x,y in p];s=min(140/(max(xs)-min(xs)),160/(max(ys)-min(ys)));ox=30+i*200
  for x in range(math.floor(min(xs)),math.ceil(max(xs))+1):b+=path([(ox+(x-min(xs))*s,195),(ox+(x-min(xs))*s,195-(max(ys)-min(ys))*s)],'#d4dfd8')
  for y in range(math.floor(min(ys)),math.ceil(max(ys))+1):b+=path([(ox,195-(y-min(ys))*s),(ox+(max(xs)-min(xs))*s,195-(y-min(ys))*s)],'#d4dfd8')
  b+=poly([(ox+(x-min(xs))*s,195-(y-min(ys))*s)for x,y in p])+text(95+i*200,255,LABELS[i])
 return svg(b)

def trapezoids(top,bottom):
 ps=[[i,1]for i in range(top)]+[[i,0]for i in range(bottom)];scale=400/(max(top,bottom)-1);project=lambda p:(90+p[0]*scale,220-p[1]*130)
 b=path([project(ps[0]),project(ps[top-1])])+path([project(ps[top]),project(ps[-1])])
 for i in range(top):
  for j in range(top,len(ps)):b+=path([project(ps[i]),project(ps[j])],'#75988c')
 for i,p in enumerate(ps):
  x,y=project(p);b+=f'<circle class="given-point" cx="{x:g}" cy="{y:g}" r="4" fill="{INK}"/>'+text(x,y+(-13 if i<top else 28),LABELS[i],19)
 return svg(b),ps

def division(a,b):
 q,rem=divmod(a,b);tens=a//10;first=q//10;left=tens-b*first;after=left*10+a%10;last=q%10
 rows=[(305,30,first),(345,30,last),(220,70,b),(265,70,a//100),(305,70,a//10%10),(345,70,a%10)]
 def digits(n,y,end=345):
  return[(end-40*(len(str(n))-1-i),y,ch)for i,ch in enumerate(str(n))]
 rows+=digits(b*first,105,305)+[(235,105,'−')]+digits(after,140)+digits(b*last,175)+[(275,175,'−')]+digits(rem,215)
 return svg('<path d="M245 80V40H370M255 115H320M295 185H360" fill="none" stroke="#254f46"/>'+''.join(text(x,y,n,22)for x,y,n in rows),h=245)
