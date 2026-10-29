import math
# Check every actual clock minute from midnight through noon inclusive.
times=[]
for minute in range(12*60+1):
 hour=minute//60%12 or 12
 text=str(hour)+str(minute%60).zfill(2)
 if text==text[::-1]:times.append(minute)
assert len(times)==57 and times[0]==21 and times[-1]==671
# Count independently from integer digit reversal and inclusion of digit 1.
def has_one(n):
 while n:
  if n%10==1:return True
  n//=10
 return False
def reverse(n):
 out=0
 while n:out=10*out+n%10;n//=10
 return out
assert sum(1 for n in range(100,10001) if reverse(n)==n and has_one(n))==36
# Simulate 45-degree light in rectangle from upper-left to a corner.
x=y=0;dx=dy=1;hits=[]
while True:
 t=min(12-x if dx>0 else x,10-y if dy>0 else y)
 assert t>0
 x+=dx*t;y+=dy*t
 if x in (0,12) and y in (0,10):break
 hits.append((x,y))
 if x in (0,12):dx=-dx
 if y in (0,10):dy=-dy
assert len(hits)==9 and (x,y)==(12,0)
assert math.lcm(12,10)==60
print('Clock times, digit-containing palindromes and mirror-wall collisions verified')

# The ball leaves the lower wall, reflects on the upper wall (-20 degrees),
# then on the lower wall; at the final upper wall it must reverse direction.
def reflected_direction(theta,axis):return (2*axis-theta)%360
candidates=[]
for launch in range(1,71):
 upper=reflected_direction(launch,-20)
 lower=reflected_direction(upper,0)
 final=reflected_direction(lower,-20)
 if final==(lower+180)%360:candidates.append(launch)
assert candidates==[30]
assert reflected_direction(30,-20)==290
assert reflected_direction(290,0)==70
assert reflected_direction(70,-20)==250
print('Wedge return path independently verified: launch angle 30 degrees')

# Folded rectangle: independently compute the marked upper trapezoid by shoelace.
upper=[(6,0),(8,0),(8,8),(6,6)]
upper_area=abs(sum(x*v-u*y for (x,y),(u,v) in zip(upper,upper[1:]+upper[:1])))/2
lower_area=(8-6)*(22-16)
assert upper_area==14 and lower_area==12
assert 8*upper_area+2*lower_area==136
print('Folded rectangle layer counts and upper trapezoid area verified')
