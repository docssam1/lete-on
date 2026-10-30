"""Check two point reflections from source grid coordinates, not annotations."""
original=((4,2),(2,6),(7,3))
first_center=(8,6)
second_center=(12,5)
def reflect(p,c):return tuple(2*x-y for x,y in zip(c,p))
first=tuple(reflect(p,first_center) for p in original)
second=tuple(reflect(p,second_center) for p in first)
assert first==((12,10),(14,6),(9,9))
assert second==((12,0),(10,4),(15,1))
for p,a,b in zip(original,first,second):
 assert tuple((x+y)//2 for x,y in zip(p,a))==first_center
 assert tuple((x+y)//2 for x,y in zip(a,b))==second_center
 assert tuple(y-x for x,y in zip(p,b))==(8,-2)
print('first image',first,'second image',second,'composition translates (8,-2)')
