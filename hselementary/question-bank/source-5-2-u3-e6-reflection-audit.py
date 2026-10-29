# Trace 45-degree light through a mirrored 120 x 40 rectangle and
# independently measure the three enclosed polygon areas.
W,H=120,40
x,y=0,20;dx,dy=1,-1;start=(x,y);path=[start]
for _ in range(20):
 tx=(W-x) if dx>0 else x
 ty=(H-y) if dy>0 else y
 step=min(tx,ty);assert step>0
 x+=step*dx;y+=step*dy;path.append((x,y))
 if (x,y)==start:break
 if x in (0,W):dx=-dx
 if y in (0,H):dy=-dy
assert path==[(0,20),(20,0),(60,40),(100,0),(120,20),(100,40),(60,0),(20,40),(0,20)]
polygons=[[(0,20),(20,0),(40,20),(20,40)],[(40,20),(60,0),(80,20),(60,40)],[(80,20),(100,0),(120,20),(100,40)]]
def area(p):return abs(sum(x*y2-x2*y for (x,y),(x2,y2) in zip(p,p[1:]+p[:1])))/2
assert [area(p) for p in polygons]==[800,800,800]
assert sum(map(area,polygons))==2400
print('45-degree mirror path and three enclosed polygon areas verified')
