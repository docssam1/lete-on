"""Independent exact-coordinate check of page 95 no. 86's folded cut."""
from fractions import Fraction as F

# x rightward, y downward. First fold is x=y, second fold x+y=16.
# A cut in the final stack is q(t)=(t+3,t), from t=0 to t=13/2.
# The second folded flap only covers t=5..13/2; reflecting it back
# sends that interval to t=13/2..8 on the same diagonal.
reflect_second = lambda x, y: (16-y, 16-x)
q = lambda t: (t+3, t)
assert reflect_second(*q(F(5))) == q(F(8))
assert reflect_second(*q(F(13, 2))) == q(F(13, 2))
# First fold adds reflection across x=y over t=0..5 (the square flap).
reflect_first = lambda x, y: (y, x)
assert reflect_first(*q(F(0))) == (0, 3)
assert reflect_first(*q(F(5))) == (5, 8)
assert q(F(0)) == (3, 0) and q(F(8)) == (11, 8)
polygon = [(0,0),(3,0),(11,8),(5,8),(0,3)]
area = abs(sum(x1*y2-y1*x2 for (x1,y1),(x2,y2) in zip(polygon, polygon[1:]+polygon[:1]))) / F(2)
assert area == F(87,2) == 11*8-F(8*8,2)-F(5*5,2)
print('PASS: both folded layers, reflected cut endpoints, and area 43.5 cm²')
