"""Check arithmetic in printed p.8 without using handwritten annotations."""
from decimal import Decimal, ROUND_HALF_UP
n=56074; target=56000
methods=[]
for unit in (10,100,1000,10000,100000):
 floor=n//unit*unit; ceil=(n+unit-1)//unit*unit; nearest=(n+unit//2)//unit*unit
 for method,value in (('floor',floor),('ceil',ceil),('nearest',nearest)):
  if value==target:methods.append((method,unit))
assert methods==[('floor',100),('floor',1000),('nearest',1000)]
red=(946+49)//50;yellow=(638+39)//40
assert (red,yellow,red*560+yellow*480)==(19,16,18320)
assert 23400//1000*1000+1000==24000 and 569//10*10==560
assert Decimal('12.46').quantize(Decimal('0.1'),rounding=ROUND_HALF_UP)==Decimal('12.5')
assert 4296%5==1
assert 3300+74*200==18100 and 3300+75*200==18300
print('Printed p8: three methods, ribbon 18,320; exploration arithmetic and source ambiguities checked.')
