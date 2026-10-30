"""Check the population conversion and the apple source's packaging constraint."""
populations=(3434091,2956513,1486647)
rounded=[((n+50000)//100000)*100000 for n in populations]
centimetres=[n//100000*5/10 for n in rounded]
assert rounded==[3400000,3000000,1500000]
assert centimetres==[17,15,7.5]
# Any number of 20-item boxes plus any number of 5-item bundles is divisible by 5.
total=4296
assert total%5==1
assert not any(20*x+5*y==total for x in range(total//20+1) for y in range(total//5+1))
boxes,left=divmod(total,20);bundles,unsold=divmod(left,5)
assert (boxes,bundles,unsold)==(214,3,1)
assert boxes*30000+bundles*8000==6444000
print('Population bar lengths:',centimetres,'cm; complete-sale packaging impossible; 6444000 won assumes 1 apple unsold')
