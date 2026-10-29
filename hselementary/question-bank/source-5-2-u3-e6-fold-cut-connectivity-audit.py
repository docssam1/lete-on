from collections import deque
N=400
# The wedge 0<=y<=x<=1 models the final folded sector. Generate its
# cut regions across all eight square symmetries, then count components.
def label(x,y):
 if max(abs(x),abs(y))<.25:return 1
 a,b=sorted((abs(x),abs(y)),reverse=True)
 if a>.8 and abs(b-.5)<a-.8:return 2
 return 0
pixels=[label((2*i+1)/N-1,(2*j+1)/N-1) for j in range(N) for i in range(N)]
seen=bytearray(N*N);counts=[0,0,0]
for n in range(N*N):
 if seen[n]:continue
 color=pixels[n];counts[color]+=1;seen[n]=1;queue=deque([n])
 while queue:
  p=queue.popleft();i=p%N;j=p//N
  for q in ([p-1] if i else [])+([p+1] if i<N-1 else [])+([p-N] if j else [])+([p+N] if j<N-1 else []):
   if not seen[q] and pixels[q]==color:seen[q]=1;queue.append(q)
assert counts==[1,1,8],counts
print('remaining, center, edge components',counts,'total',sum(counts))
