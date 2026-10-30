"""Independent arithmetic for original printed page 9 Missions 2, 5 and 6."""
from fractions import Fraction
# For every rectangular corner cut, horizontal and vertical segments cancel.
width, height = 48, 24
for cut_w in range(1,width):
 for cut_h in range(1,height):
  perimeter = width + height + (width-cut_w) + cut_h + cut_w + (height-cut_h)
  assert perimeter == 144
assert Fraction(perimeter,10) == Fraction(72,5)
assert (perimeter+5)//10 == 14  # nearest natural centimeter
population=[3434091,2956513,1486647]
rounded=[(n+50000)//100000*100000 for n in population]
length_cm=[Fraction(n,100000)*Fraction(5,10) for n in rounded]
assert rounded==[3400000,3000000,1500000]
assert length_cm==[17,15,Fraction(15,2)]
total=sum([4283,3976,4015]); boxes,remainder=divmod(total,500)
assert (total,boxes,remainder,boxes*150000)==(12274,24,274,3600000)
print('Printed p9: 144mm ≈ 14cm; bar lengths 17,15,7.5cm; 24 boxes, 3,600,000 won.')
