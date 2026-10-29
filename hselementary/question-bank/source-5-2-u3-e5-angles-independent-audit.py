import math
r=math.radians
D=(0,0);L=(1,0)
a,b=r(42),r(68)
t=1/(math.cos(a)-math.sin(a)*math.cos(b)/math.sin(b));u=t*math.sin(a)/math.sin(b)
G=(t*math.cos(a),t*math.sin(a));N=(math.cos(r(84)),math.sin(r(84)));M=(1+u,0)
def angle(a,b,c):
 x=(a[0]-b[0],a[1]-b[1]);y=(c[0]-b[0],c[1]-b[1]);return math.degrees(math.acos(max(-1,min(1,(x[0]*y[0]+x[1]*y[1])/math.hypot(*x)/math.hypot(*y)))))
assert abs(angle(D,N,L)-48)<1e-9 and abs(angle(G,L,M)-68)<1e-9
assert abs(math.dist(D,N)-math.dist(D,L))<1e-9 and abs(math.dist(G,N)-math.dist(G,L))<1e-9
assert abs(math.dist(G,L)-math.dist(L,M))<1e-9
assert abs(angle(D,G,M)-82)<1e-9
# Two reflections across lines at 0° and 45°: verify all starting rays, including original 20° clue.
def reflect(theta,axis):return 2*axis-theta
for theta in range(-180,180):
 result=reflect(reflect(theta,0),45);difference=abs((result-theta+180)%360-180);assert difference==90
print('5-2 independent coordinate model: 82°; 5-3 reflection transform: 90° for all integer rays')
