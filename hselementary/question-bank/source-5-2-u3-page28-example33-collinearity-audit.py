import math

def cross(a,b): return a[0]*b[1]-a[1]*b[0]
def sub(a,b): return (a[0]-b[0],a[1]-b[1])
def construct(h):
    theta=math.atan(h);c=math.cos(theta);s=math.sin(theta)
    n=(-1.,0.);g=(0.,h);r=(-c,s);m=(h*s,h*c);d=(0.,0.)
    line_error=cross(sub(g,n),sub(r,n))
    target=math.degrees(math.atan2(abs(cross(sub(d,m),sub(r,m))),sum(x*y for x,y in zip(sub(d,m),sub(r,m)))))
    return theta,line_error,target
for h in [1, math.sqrt(3)]:
    theta,residual,target=construct(h)
    print(f'h={h:.9f}; rotated_R_on_GN_cross={residual:.9f}; target={target:.9f}°')
    if h==1: assert abs(residual)>0.1 and abs(target-45)<1e-8
    else: assert abs(residual)<1e-8 and abs(target-30)<1e-8
for i in range(1,1000):
    h=i/100
    _,residual,_=construct(h)
    assert abs(residual - (2/math.sqrt(1+h*h)-1)*h)<1e-10
print('collinearity requires 2*cos(atan(h))=1, giving h=sqrt(3) and target 30°')
