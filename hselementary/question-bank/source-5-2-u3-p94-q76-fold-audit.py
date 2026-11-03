"""Reverse the three folds in printed page 94 question 76."""
from fractions import Fraction as F

# Coordinates use a 100×100 square; final punch is inside the left
# half of the last folded triangle, near the top edge and centre line.
points={(F(45),F(5))}
for reflection in (
    lambda x,y: (100-x,y),       # third fold: x=50
    lambda x,y: (100-y,100-x),   # second fold: x+y=100
    lambda x,y: (y,x),           # first fold: x=y
):
    points |= {reflection(x,y) for x,y in points}
expected={(45,5),(55,5),(95,45),(95,55),(55,95),(45,95),(5,55),(5,45)}
assert points == expected
assert len(points) == 8
print('PASS: reversing all three folds produces the eight positions of choice ③')
