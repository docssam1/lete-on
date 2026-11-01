#!/usr/bin/env python3
"""Enumerate convex polygons on the regular pentagon's drawn edges."""
import json
import math,itertools
from pathlib import Path
record=json.loads((Path(__file__).parent/'source-inventory/5-2-u3-e1-e4-readiness-review.json').read_text())
r=next(x for x in record['additionalSourceReviews'] if x['sourcePrintedPage']==88)
item=next(x for x in r['items'] if x['number']==29)
assert item['candidate']=='3쌍' and r['publisherAnswerVerified'] is False and r['runtimeConnection']=='not-connected'
v={k:(math.cos(math.radians(a)),math.sin(math.radians(a))) for k,a in zip('ABCDE',[90,18,-54,-126,162])}
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
a,d,e,b=[v[x] for x in 'ADEB'];t=cross(e,b,a)/(cross(e,b,a)-cross(e,b,d));v['X']=(a[0]+t*(d[0]-a[0]),a[1]+t*(d[1]-a[1]))
segments=['AB','BC','CD','DE','EA','EB','AD']
def on(p,a,b):return abs(cross(a,b,p))<1e-8 and all(min(a[k],b[k])-1e-8<=p[k]<=max(a[k],b[k])+1e-8 for k in (0,1))
def edge(x,y):return any(on(v[x],v[s[0]],v[s[1]]) and on(v[y],v[s[0]],v[s[1]]) for s in segments)
def norm_dist(seq):return tuple(round(math.dist(v[seq[i]],v[seq[j]])**2,8) for i in range(len(seq)) for j in range(i+1,len(seq)))
def key(seq):
 n=len(seq); seq=list(seq); forms=[]
 for s in [seq,seq[::-1]]:
  for i in range(n):forms.append(norm_dist(s[i:]+s[:i]))
 return min(forms)
groups={}
for n in range(3,7):
 for comb in itertools.combinations(v,n):
  centre=(sum(v[x][0] for x in comb)/n,sum(v[x][1] for x in comb)/n)
  seq=sorted(comb,key=lambda x:math.atan2(v[x][1]-centre[1],v[x][0]-centre[0]))
  if not all(cross(v[seq[i]],v[seq[(i+1)%n]],v[seq[(i+2)%n]])>1e-8 for i in range(n)):continue
  if not all(edge(seq[i],seq[(i+1)%n]) for i in range(n)):continue
  groups.setdefault((n,key(seq)),[]).append(''.join(seq))
assert sum(map(len,groups.values()))==9
assert sorted(len(x) for x in groups.values())==[1,1,1,2,2,2]
assert sum(len(x)*(len(x)-1)//2 for x in groups.values())==3
print('PASS: page 88 #29 nine convex polygons, three congruent pairs; source remains unconnected')
