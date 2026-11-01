#!/usr/bin/env python3
"""Enumerate card and digit constraints from printed page 107."""
import json
from decimal import Decimal as D
from itertools import permutations
from pathlib import Path

path=Path(__file__).parent/'source-inventory/5-2-u4-readiness-review.json'
review=next(r for r in json.loads(path.read_text())['additionalSourceReviews'] if r['sourcePrintedPage']==107)
assert review['sourcePdfPage']==101 and review['alternateSourcePdfPage']==102
assert {i['number'] for i in review['items']}==set(range(47,55))
assert review['publisherAnswerVerified'] is False and review['runtimeConnection']=='not-connected'
products=[]
for a,b,c,d,e in permutations((2,4,5,7,8)):
    products.append(((100*a+10*b+c)*(10*d+e),(a,b,c,d,e)))
assert min(products)[0]==11950 and max(products)[0]==63168
assert D(max(products)[0]-min(products)[0])/100000==D('.51218')
products=[]
for a,b,c,d,e,f in permutations((0,2,4,5,7,8)):
    products.append(((100*a+10*b+c)*(100*d+10*e+f),(a,b,c,d,e,f)))
best=max(v for v,p in products)
assert best==631680 and {p for v,p in products if v==best}=={(7,5,2,8,4,0),(8,4,0,7,5,2)}
assert max(v for v,p in products if p[2]!=0 and p[5]!=0)==604708
eligible=[n for n in range(1000) if D('37.05')<=D(n)/10<D('40.95')]
assert len(eligible)==39 and (eligible[0],eligible[-1])==(371,409)
assert sum(D(n)*D(n+1)/100 for n in range(31,94,2))==D('1359.04')
assert (D('77.75')-D('5.5')*D('2.5'))/8==8
assert (D('7.24')+D('4.36'))/2==D('5.8')
assert D('58')*D('1.44')==D('83.52') and D('5.8')*144==D('835.2')
solutions53=[]
for a,b,c in permutations(range(10),3):
    if a and (100*a+10*b+c)*103==11000*a+100*b+45: solutions53.append((a,b,c))
assert solutions53==[(2,1,5)]
solutions54=[]
for a,b,c,d,e in permutations(range(10),5):
    if not a or not d: continue
    n=100*a+10*b+c
    if n*7==1000+100*e+10*a+c and n*d==100*b+10*d+c and n*(100*d+10*e+7)==11000*b+100*c+10*a+c:
        solutions54.append((a,b,c,d,e))
assert solutions54==[(1,4,5,3,0)] and sum(solutions54[0])==13
print('Page 107 card, rounding and digit constraints passed; publisher answers remain unverified.')
