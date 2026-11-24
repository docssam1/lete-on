"""Exact proof for native magic tasks after removing the non-given line-sum hint."""
from fractions import Fraction
import re

def magic(problem,tid):
 v=problem['visual'];n=v['size'];shown=v['shown'];answers=[int(x)for x in re.findall(r'-?\d+',problem['answer'])]
 lines=[[r*n+c for c in range(n)]for r in range(n)]+[[r*n+c for r in range(n)]for c in range(n)]+[[i*(n+1)for i in range(n)],[(i+1)*(n-1)for i in range(n)]]
 if tid=='MG01':
  assert len(answers)==n*n and sorted(answers)==sorted(v['cards'])
  assert all(not isinstance(x,(int,float))or answers[i]==x for i,x in enumerate(shown))
  line_sum=Fraction(sum(v['cards']),n)
  assert all(sum(answers[i]for i in line)==line_sum for line in lines)
  return dict(kind='grid-witness-not-unique-placement',lineSum=str(line_sum),placementsMayDiffer=True,values=answers)
 # Include the unknown common line sum itself. Neither v.lineSum nor meta is an input.
 unknown=[i for i,x in enumerate(shown)if not isinstance(x,(int,float))];cols=len(unknown)+1;mat=[]
 for line in lines:
  mat.append([Fraction(int(i in line))for i in unknown]+[Fraction(-1),Fraction(-sum(shown[i]for i in line if i not in unknown))])
 if tid=='MG03':
  assert re.search(r'1부터\s*16',problem['prompt']);mat.append([Fraction(0)]*len(unknown)+[Fraction(1),Fraction(sum(range(1,17)),4)])
 pivot={};row=0
 for col in range(cols):
  found=next((i for i in range(row,len(mat))if mat[i][col]),None)
  if found is None:continue
  mat[row],mat[found]=mat[found],mat[row];scale=mat[row][col];mat[row]=[x/scale for x in mat[row]]
  for i in range(len(mat)):
   if i!=row and mat[i][col]:
    m=mat[i][col];mat[i]=[a-m*b for a,b in zip(mat[i],mat[row])]
  pivot[col]=row;row+=1
 assert all(any(r[:-1])or not r[-1]for r in mat)
 target=next(i for i,x in enumerate(shown)if isinstance(x,str));col=unknown.index(target);assert col in pivot
 equation=mat[pivot[col]];assert all(not equation[j]for j in range(cols)if j!=col)
 value=equation[-1];assert value.denominator==1 and answers==[int(value)]
 return dict(kind='visible-line-equations-unique-target',value=int(value),lineSumHintUsed=False)
