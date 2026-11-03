from fractions import Fraction as F
from math import comb, pi, atan, sin, cos, hypot, isclose

# All six triangles have area 30 and the shared side has length 12.
# Thus its altitude is 5 and cot(A)+cot(B)=12/5 for its endpoint angles.
# If adjacent triangles exchanged the shared edge's endpoints, their angles at
# the fan center sum to pi-C. The remaining four each contribute at least m,
# the least of A,B,C. A fan in the source's half-plane requires C >= 4m.
# If m=C this is impossible. Otherwise take m=A <= B and C >= 4A.
# A+B+C=pi then gives A <= 30 degrees and B <= pi-5A, hence
# 12/5=cot(A)+cot(B) >= cot(A)-cot(5A).
# We prove cot(A)-cot(5A) > 12/5 by the exact Bernstein certificate below.
# With t=tan(A), 0<t<=tan(30°)<3/5, its numerator after multiplying the
# positive denominator 5t(5-10t²+t⁴) is P=20-60t+120t³-20t⁴-12t⁵.
# Every Bernstein coefficient on [0,3/5] is positive, so P>0 throughout.
coeff=[F(20),F(-60),F(0),F(120),F(-20),F(-12)]
degree=5;limit=F(3,5)
power=[coeff[i]*limit**i for i in range(degree+1)]
bernstein=[sum(power[i]*F(comb(k,i),comb(degree,i)) for i in range(k+1)) for k in range(degree+1)]
assert bernstein == [F(20),F(64,5),F(28,5),F(124,125),F(656,625),F(19984,3125)]
assert all(x>0 for x in bernstein)
assert F(5)-10*limit**2>0
# The source reconstruction uses alternating radii sqrt(250) and 12, with
# common apex angle atan(1/3). Its six triangles each have area 30.
alpha=atan(1/3); radii=[250**.5,12,250**.5,12,250**.5,12,250**.5]
assert 6*alpha<pi
for a,b in zip(radii,radii[1:]): assert isclose(a*b*sin(alpha)/2,30,abs_tol=1e-10)
assert isclose(radii[1],12) and isclose(2*radii[0]*sin(alpha),10,abs_tol=1e-10)
print('PASS: page 91 #55 correspondence proof and reconstructed six-triangle geometry')
