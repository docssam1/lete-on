"""Check lengths and area independently from the illustrated vertices."""
from fractions import Fraction as F
A=(F(0),F(0)); B=(F(38,5),F(0)); C=(F(56,5),F(24,5)); D=(F(24,5),F(48,5)); E=(F(0),F(48,5))
square_distance=lambda p,q:sum((a-b)**2 for a,b in zip(p,q))
assert square_distance(B,C)==36 and square_distance(C,D)==64
assert sum((B[i]-C[i])*(D[i]-C[i]) for i in (0,1))==0
polygon=[A,B,C,D,E]
shoelace=abs(sum(x1*y2-y1*x2 for (x1,y1),(x2,y2) in zip(polygon,polygon[1:]+polygon[:1])))/2
assert shoelace==F(2088,25)==(F(38,5)+F(24,5))*F(48,5)/2+F(6*8,2)
print('PASS: five labeled lengths, right angle, shoelace area 83.52 cm²')
