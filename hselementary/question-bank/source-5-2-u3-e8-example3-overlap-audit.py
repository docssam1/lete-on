"""Area of overlap of line- and point-reflected orthogonal shapes."""
from fractions import Fraction as F
# Rectangle x=[0,6], y=[0,12], arm x=[-4,0], y=[4,8].
shape=((F(0),F(6),F(0),F(12)),(F(-4),F(0),F(4),F(8)))
def line(r):
 x0,x1,y0,y1=r;return (8-x1,8-x0,y0,y1)
def point(r):
 x0,x1,y0,y1=r;return (8-x1,8-x0,8-y1,8-y0)
a=[line(r) for r in shape];b=[point(r) for r in shape]
xs=sorted({v for r in a+b for v in r[:2]});ys=sorted({v for r in a+b for v in r[2:]})
def inside(rects,x,y):return any(x0<x<x1 and y0<y<y1 for x0,x1,y0,y1 in rects)
area=F(0)
for xl,xr in zip(xs,xs[1:]):
 for yl,yr in zip(ys,ys[1:]):
  x=(xl+xr)/2;y=(yl+yr)/2
  if inside(a,x,y) and inside(b,x,y):area+=(xr-xl)*(yr-yl)
assert area==48
# Independent relation: the two reflected shapes differ by reflection about y=4;
# their common central rectangle is 6 by 8, while the arms only touch at y=4.
assert (8-2)*(8-0)==area
print('line/point reflected overlap:',area,'square cm')
