"""Three explicitly bounded parameter configurations for each of the 44 checked models.

This creates original practice. Source answers, source difficulty and teacher approvals
are never changed. Finite configurations are intentional, not an unlimited seed API.
"""
import copy,math
from itertools import combinations,permutations
from soma_authoring_figures import pointboard,circle_points,parts_figure,protractor,tetra_net,magic_grid,DIGITS,SEGMENTS
import soma_variant_figures as V

L=V.LABELS
BAND_REASONS={
 'UA37':'점 세 개의 선택과 넓이·절반 넓이 조건을 함께 유지합니다.',
 'GP01':'제공된 그림의 기본 도형을 찾고 눈에 보이는 쓰임에 직접 대응합니다.',
 'SP01':'한 각의 반복 합과 한 바퀴 미만이라는 입체 조건을 연결합니다.',
 'UL43':'큰 지름을 같은 작은 지름으로 나눈 뒤 반지름으로 바꿉니다.',
 'FC18':'표시된 점의 선택과 한 도형 그리기·전체 개수 응답을 구별합니다.',
 'CAL09':'안내된 나눗셈 세로식의 자리 순서와 구구·뺄셈을 적용합니다.',
 'OP12':'각 수와 두 연산의 사용 조건을 지키면서 같은 결과를 중복 제외합니다.',
 'NS20':'양 끝을 포함하는 수의 차례에 익힌 홀짝 구별을 적용합니다.',
 'NC12':'지문에 제공된 기호표를 십의 자리·일의 자리에 적용합니다.',
 'NS21':'숫자 글자 수와 사이의 기호·마지막 기호를 구분해 합칩니다.',
 'NS22':'자리수별 인쇄 시간과 양 끝을 제외한 사이의 휴식을 연결합니다.',
 'VN08':'그림의 두 속성을 주어진 색→크기 표기 순서에 대응합니다.',
 'TM13':'문장에 직접 제시된 특정한 때와 지속 시간을 구분합니다.',
 'NG02':'상대의 두 선택 모두에 대응하는 이기는 전략을 스스로 구성합니다.',
 'UL40':'다른 단위를 같은 길이로 바꾸고 동률과 크기 순서를 함께 표현합니다.',
 'SQ27':'주어진 구구의 곱에서 일의 자리를 읽고 익힌 자릿값 관계를 적용합니다.',
 'FC19':'실제 점 배치에서 크기별 모든 정삼각형의 선택 범위를 확인해야 합니다.',
 'PT08':'같은 조각 네 개의 방향·직각·정사각형 경계를 함께 유지해 배치합니다.',
 'TL03':'각 보기의 한 각과 여러 조각이 한 점을 빈틈 없이 채우는 조건을 연결합니다.',
 'UA38':'넓이에 따른 개수와 실제로 채울 수 있는 모양·모서리 조건을 구별합니다.',
 'NC13':'카드 한 번 사용·공통 가운데·두 합·두 증가 순서를 함께 유지합니다.',
 'LG08':'제공된 가로쓰기/세로읽기 약속을 역으로 적용하고 중간 표를 유지합니다.',
 'CT12':'같은 두 팀의 중복 세기와 경기마다 한 팀 탈락하는 두 구조를 구별합니다.',
 'RT07':'원마다의 위/아래 선택을 독립적으로 연결하며 길의 중복을 구별합니다.',
 'AG31':'그림에 주어진 각도기의 오른쪽 0° 기준과 눈금을 직접 읽습니다.',
 'SP02':'면의 종류와 실제 전개도 접힘 범위를 함께 확인해야 합니다.',
 'PT09':'바뀐 조각 재고에서 두 개의 서로 다른 전체 모양을 구성해야 합니다.',
 'DS07':'전개도 위치를 접힌 면의 관계로 바꾸고 세 쌍의 합을 비교합니다.',
 'TR11':'명시된 같은 글꼴에 익힌 반 바퀴 회전을 적용합니다.',
 'TR14':'주어진 90° 회전과 한 바퀴 복귀 관계에 처음/마지막 포함 규약을 적용합니다.',
 'TR13':'한 변 위의 거울 반사를 그린 뒤 합쳐진 바깥 경계의 성질을 연결합니다.',
 'TR12':'회전의 중간 상태를 유지하고 겹친 칸을 한 번만 세어 남은 칸을 구합니다.',
 'AG32':'제공된 각을 익힌 예각·직각·둔각 정의에 직접 대응합니다.',
 'GP02':'직각·같은 두 변·표시된 꼭짓점이라는 세 조건을 함께 만족하게 그립니다.',
 'FC20':'같은 두 변과 일직선 제외 조건을 유지하며 꼭짓점 조합을 중복 제외합니다.',
 'FC21':'바깥/가운데 점을 나눠 직각과 일직선 제외 조건을 연결합니다.',
 'GP03':'모든 경우라는 주장에 도형의 정의를 적용하고 성립하지 않는 반례를 연결합니다.',
 'FC22':'같은 변과 직각을 구별하고 한 도형을 여러 포함 범주에 함께 넣습니다.',
 'FC23':'표시된 꼭짓점만 쓰면서 평행 조건과 조합의 중복을 함께 유지합니다.',
 'FC24':'원 위의 서로 다른 세 점 선택과 순서에 따른 중복 제외를 연결합니다.',
 'QR33':'두 번의 교환과 상자 조건을 같은 빨강 칩 단위로 이어 바꿉니다.',
 'BL05':'같은 무게로 치환하고 차의 크기와 더 놓을 쪽을 함께 정합니다.',
 'OP13':'합법적인 괄호 구간과 연산 순서·같은 결과 중복 제외를 함께 유지합니다.',
 'MG13':'주어진 방법을 적용하면서 현재 칸·경계 이어짐·이미 찬 칸을 함께 유지합니다.'}
def label(ids):return '·'.join(L[i]for i in ids)
def triangle_candidates(ps,kind='all',metric=1):
 out=[]
 for ids in combinations(range(len(ps)),3):
  a,b,c=[ps[i]for i in ids];area2=abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))
  if not area2:continue
  ds=sorted((p[0]-q[0])**2+metric*(p[1]-q[1])**2 for p,q in combinations([a,b,c],2))
  if kind=='all'or kind=='equal'and ds[0]==ds[2]or kind=='iso'and len(set(ds))<=2 or kind=='right'and ds[0]+ds[1]==ds[2]or kind=='rightiso'and ds[0]==ds[1]and ds[0]+ds[1]==ds[2]:out.append((list(ids),area2/2,ds))
 return out

def create(tid,k,base,parameters=None):
 assert k in[0,1,2]
 p=parameters or{}
 if p and tid=='GP01':k=['boat','robot','train'].index(p['picture'])
 if p and tid=='GP03':k=p['claim']
 m={'kind':tid,'configuration':k+1};visual='';av='';band=base['commonBandCandidate'];hold=None
 def done(prompt,answer,solution,response):
  return dict(prompt=prompt,answer=answer,solution=solution,visual=visual,answerVisual=av,model=m,response=response,candidateBand=band,bandHold=hold,candidateReason=BAND_REASONS[tid])

 if tid in['UA37','GP02','FC19','FC20','FC21']:
  metric=1
  if tid=='UA37':
   ps=[[x,y]for y in range(3)for x in range(p.get('columns',3))];target=p.get('area',[1,.5,1.5][k]);cand=[t for t in triangle_candidates(ps)if t[1]==target];m['targetArea']=target
   sizeText=['단위 정사각형 1개와','단위 정사각형의 절반과','단위 정사각형 1개 반과'][k]
   if p:sizeText=f'단위 정사각형 {int(target)}개와'if target==int(target)else('단위 정사각형의 절반과'if target<1 else f'단위 정사각형 {int(target)}개 반과')
   prompt=f'이웃한 가로·세로 점 사이의 거리가 1인 점판입니다. 넓이가 {sizeText} 같은 삼각형 한 개를 그리세요. 꼭짓점은 표시된 점이어야 합니다.'
   ids=cand[-1][0];answer=f'예: {label(ids)}';solution=f'{label(ids)}를 이은 삼각형의 넓이는 {target:g}입니다. 같은 넓이의 다른 삼각형도 정답입니다.';response={'witness':ids,'area':target}
  elif tid=='GP02':
   ps=[[[0,0],[1,0],[2,0],[0,1],[1,1],[0,2]],[[0,0],[2,0],[0,2],[2,2],[1,1]],[[0,0],[1,0],[2,0],[1,1],[2,1],[2,2]]][k];cand=triangle_candidates(ps,'rightiso');ids=cand[-1][0]
   if p:
    boards=[[[0,0],[1,0],[2,0],[0,1],[1,1],[0,2]],[[0,0],[2,0],[0,2],[2,2],[1,1]],[[0,0],[1,0],[2,0],[1,1],[2,1],[2,2]],[[x,y]for y in range(3)for x in range(3)],[[x,y]for y in range(3)for x in range(4)]];ps=boards[p['board']];cand=triangle_candidates(ps,'rightiso');ids=cand[-1][0]
   prompt='표시된 점 세 개를 꼭짓점으로 하는 직각이등변삼각형 한 개를 그리세요. 모눈의 가로·세로 간격은 같습니다.';answer=f'예: {label(ids)}';solution=f'{label(ids)} 삼각형은 두 변의 길이가 같고 그 두 변이 직각으로 만납니다. 조건을 만족하는 다른 삼각형도 정답입니다.';response={'witness':ids}
  elif tid=='FC19':
   ps=[[2*x+y,y]for y in range(4)for x in range(4-y)];ps=ps[:[9,8,10][k]];metric=3;cand=triangle_candidates(ps,'equal',3);ids=cand[0][0];counts={}
   if p:
    ps=[[2*x+y,y]for y in range(p['levels'])for x in range(p['levels']-y)];ps=ps[:len(ps)-p['cut']];cand=triangle_candidates(ps,'equal',3);ids=cand[0][0]
   for t in cand:counts[str(int(t[2][0]))]=counts.get(str(int(t[2][0])),0)+1
   prompt='이웃한 점 사이의 간격이 같은 정삼각형 점판입니다. 표시된 세 점을 이어 정삼각형 한 개를 그리고, 크기별 개수와 전체 개수를 구하세요. 선 위의 표시되지 않은 점은 쓰지 않습니다.'
   sizes=sorted(counts,key=int);answer=f'예: {label(ids)} / 작은 크기부터 '+', '.join(f'{counts[x]}개'for x in sizes)+f' / 전체 {len(cand)}개';solution='표시된 세 점을 골라 세 변이 같은 경우만 남깁니다. '+answer.split(' / ',1)[1]+'입니다.';response={'witness':ids,'countsBySideSquared':counts,'total':len(cand)};band=None;hold='기존 6점에서 8~10점으로 경우 조직 범위가 늘어 새 표현 난도 확인 전입니다.'
   if p:hold='점 배치와 크기별 경우 조직 범위가 달라져 현재 표현 난도 확인 전입니다.'
  elif tid=='FC20':
   h=[1,3,4][k];ps=[[-2,0],[0,0],[2,0],[-1,h],[1,h]];cand=triangle_candidates(ps,'iso');ids=cand[0][0]
   if p:h=p['height'];ps=[[-2,0],[0,0],[2,0],[-1,h],[1,h]];cand=triangle_candidates(ps,'iso');ids=cand[0][0]
   prompt='같은 간격의 모눈에 표시된 점 중 세 점을 이어 이등변삼각형 한 개를 그리고, 만들 수 있는 이등변삼각형을 모두 세세요. 일직선인 세 점은 제외하며 정삼각형도 포함합니다.';answer=f'예: {label(ids)} / 모두 {len(cand)}개';solution='같은 두 변을 가진 삼각형을 꼭짓점 위치별로 나누고 같은 세 점을 중복해서 세지 않으면 '+str(len(cand))+'개입니다.';response={'witness':ids,'total':len(cand)}
  else:
   w,h=[(4,2),(6,2),(6,4)][k];ps=[[0,0],[w,0],[0,h],[w,h],[w//2,h//2]];cand=triangle_candidates(ps,'right');ids=cand[0][0]
   if p:w,h=p['width'],p['height'];ps=[[0,0],[w,0],[0,h],[w,h],[w//2,h//2]];cand=triangle_candidates(ps,'right');ids=cand[0][0]
   prompt='모눈에 표시된 다섯 점 중 세 점을 이어 직각삼각형 한 개를 그리고, 만들 수 있는 직각삼각형을 모두 세세요. 일직선인 세 점은 제외합니다.';answer=f'예: {label(ids)} / 모두 {len(cand)}개';solution='바깥 네 점 중 세 점을 고르면 네 개의 직각삼각형이 생깁니다. 이 직사각형에서는 가운데 점을 포함하는 나머지 조합에 직각이 없으므로 모두 '+str(len(cand))+'개입니다.';response={'witness':ids,'total':len(cand)}
   if p and w==h:solution='바깥 네 점에서 세 점을 고르는 4개와, 가운데 점에서 이웃한 바깥 두 점으로 만든 4개가 있습니다. 가운데 점과 마주 보는 두 점은 일직선이므로 제외하여 모두 8개입니다.'
  visual,fig=pointboard(ps,triangular=metric==3);av,_=pointboard(ps,triangular=metric==3,answer=[ids]);m.update(points=ps,metricY2=metric,witness=ids,figure=fig)
  return done(prompt,answer,solution,response)

 if tid=='GP01':
  kind=['boat','robot','train'][k];title=['배','로봇','기차'][k];parts=[['둥근 창','돛','선실'],['눈','모자','몸통'],['바퀴','앞부분','몸통']][k];visual=V.logo(kind);m.update(logo=kind,requiredShapes=['circle','triangle','rectangle'],shapeParts=parts,singleVerbatimExplanationRequired=False)
  return done(f'{title} 그림에서 동그라미, 세모, 네모를 하나씩 찾아 표시하고 무엇을 나타내는지 말해 보세요.','예: '+', '.join(a+'는 '+b for a,b in zip(['동그라미','세모','네모'],parts)),'도형의 모양과 그림 속 부분이 맞게 연결되면 됩니다. 같은 뜻을 다른 말로 설명해도 됩니다.',{'shapeParts':parts,'oralRubric':True})
 if tid=='SP01':
  n,a=[(4,90),(5,108),(6,120)][k];counts=[3,4,5,6];valid=[c for c in counts if c*a<360];m.update(polygonSides=n,faceAngle=a,counts=counts,convexVertexRequired=True)
  if p:n=p['sides'];a=180*(n-2)//n;valid=[c for c in counts if c*a<360];m.update(polygonSides=n,faceAngle=a)
  if p and n==3:return done(f'한 각이 {a}°인 같은 정삼각형 종이가 한 점에서 3장, 4장, 5장, 6장씩 만납니다. 들어간 곳이 없는 볼록한 정다면체의 꼭짓점을 만들 수 있는 경우를 모두 고르고 이유를 설명하세요.',', '.join(str(v)+'장'for v in valid),'3·4·5장의 각의 합은 180°·240°·300°로 360°보다 작아 접혀 올라갈 여유가 있습니다. 6장은 360°가 되어 평평해집니다.',{'validCounts':valid})
  return done(f'한 각이 {a}°인 같은 {V.POLYGON_NAMES[n]} 종이가 한 점에서 3장, 4장, 5장, 6장씩 만납니다. 들어간 곳이 없는 볼록한 정다면체의 꼭짓점을 만들 수 있는 경우를 모두 고르세요. 만들 수 있는 경우가 없으면 없다고 쓰고 이유를 설명하세요.',(', '.join(str(v)+'장'for v in valid)if valid else'없음'),f'입체 꼭짓점에서는 모인 각의 합이 360°보다 작아야 합니다. '+', '.join(f'{c}장: {c*a}°'for c in counts)+'이므로 '+('3장만 가능합니다.'if valid else'가능한 경우가 없습니다.'),{'validCounts':valid})
 if tid=='UL43':
  n,r=[(2,5),(4,3),(5,2)][k];n=p.get('count',n);R=p.get('radius',n*r);r=R//n;visual=V.circles(n,R);m.update(outerRadius=R,smallCount=n)
  return done(f'반지름이 {R}cm인 큰 원 안에 같은 작은 원 {n}개가 있습니다. 모든 중심은 큰 원의 한 지름 위에 있고 작은 원은 차례로 맞닿습니다. 양 끝의 작은 원은 큰 원의 지름 양 끝에 맞닿습니다. 작은 원의 반지름은 몇 cm인가요?',f'{r}cm',f'큰 지름 {2*R}cm를 작은 지름 {n}개가 채웁니다. {2*R}÷{n}÷2={r}이므로 작은 반지름은 {r}cm입니다.',{'radius':r})
 if tid in['FC18','FC24']:
  n=p.get('points',[4,6,7][k]);sides=4 if tid=='FC18'else 3;visual,ps=circle_points(n);ids=list(range(sides));count=math.comb(n,sides);m.update(points=ps,cyclicOrder=True)
  name='사각형'if sides==4 else'삼각형';prefix=f'한 개를 그리고, 'if sides==4 else''
  if sides==4:av,_=circle_points(n,ids);m['witness']=ids
  if k==0:band=2
  else:band=None;hold='원 위의 6~7점에서 고르는 꼭짓점 조합과 중복 제외의 조직 범위가 달라져 현재 표현 난도 확인 전입니다.'
  if p:band=2 if n<=4 else(3 if n==5 else None);hold=None if n<=5 else'원 위의 점 선택 범위가 달라져 현재 표현 난도 확인 전입니다.'
  return done(f'원 위의 표시된 {n}개 점 중 {sides}개를 골라 선이 교차하지 않는 {name}을 만듭니다. {prefix}모두 몇 개인지 구하세요. 꼭짓점 위치가 다르면 다른 도형입니다.',(f'예: {label(ids)} / 'if sides==4 else'')+f'{count}개',f'표시된 점에서 {sides}개를 고른 각 조합이 도형 하나를 만듭니다. 순서를 바꾼 같은 꼭짓점 조합은 중복해서 세지 않으면 모두 {count}개입니다.',dict(total=count,**({'witness':ids}if sides==4 else{})))
 if tid=='CAL09':
  a,b=[(467,6),(653,8),(724,9)][k];a=p.get('dividend',a);b=p.get('divisor',b);q,r=divmod(a,b);av=V.division(a,b);m.update(dividend=a,divisor=b,formalWrittenAlgorithmRequired=True)
  return done(f'{a}÷{b}을 나눗셈 세로식으로 계산하고 몫과 나머지를 쓰세요.',f'몫 {q}, 나머지 {r}',f'{a//10}÷{b}에서 몫의 십의 자리 {q//10}을 구합니다. 남은 {a//10-b*(q//10)}에 일의 자리 {a%10}을 내려 {a%b+b*(q%10)}÷{b}을 계산하면 몫의 일의 자리 {q%10}, 나머지 {r}입니다. {b}×{q}+{r}={a}입니다.',{'quotient':q,'remainder':r})
 if tid=='OP12':
  nums=[p[x]for x in['a','b','c']]if p else[[2,3,4],[2,4,6],[3,4,5]][k];total=sum(nums);results=sorted({total-2*x for x in nums})
  exprs=[]
  for val in results:
   subtract=(total-val)//2;others=nums.copy();others.remove(subtract);exprs.append(f'{others[0]}+{others[1]}−{subtract}={val}')
  m.update(numbers=nums,operators=['+','-'],allowZero=True,allowParentheses=False)
  return done(f'주사위 눈은 {", ".join(map(str,nums))}입니다. 세 수를 한 번씩, +와 −를 각각 한 번 써서 식을 만드세요. 수의 순서는 바꾸어도 되며 괄호나 다른 연산은 쓰지 않습니다. 0도 결과로 인정합니다. 서로 다른 결과를 모두 쓰고 각 결과가 되는 식을 하나씩 쓰세요.',', '.join(map(str,results))+' / '+', '.join(exprs),f'세 수의 합 {total}에서 빼는 수를 두 번 뺀 값이 됩니다. 빼는 수를 하나씩 바꾸면 '+', '.join(map(str,results))+'이고 이외의 결과는 없습니다.',{'values':results,'expressions':exprs})
 if tid=='NS20':
  lo,hi=[(9,22),(12,27),(15,30)][k];lo=p.get('lower',lo);hi=p.get('upper',hi);nums=list(range(lo,hi+1));odd=sum(x%2 for x in nums);even=len(nums)-odd;m.update(lower=lo,upper=hi)
  return done(f'{lo}부터 {hi}까지 양 끝을 포함하여 자연수를 셉니다. 전체 수, 홀수, 짝수의 개수를 각각 쓰세요.',f'전체 {len(nums)}개, 홀수 {odd}개, 짝수 {even}개',f'{hi}−{lo}+1={len(nums)}개입니다. 홀수를 하나씩 확인하면 {odd}개이고 나머지 {even}개는 짝수입니다.',{'total':len(nums),'odd':odd,'even':even})
 if tid=='NC12':
  nums=[p[x]for x in['n1','n2','n3','n4']]if p else[[4,7,12,19],[6,9,23,28],[8,14,24,39]][k];ones=base['responseModel']['ones'];answers=['X'*(n//10)+ones[n%10]for n in nums];m.update(numbers=nums,ones=ones,ten='X')
  return done('로마 숫자를 다음 약속으로 씁니다. 십의 자리는 10마다 X를 쓰고, 일의 자리는 1:I, 2:II, 3:III, 4:IV, 5:V, 6:VI, 7:VII, 8:VIII, 9:IX를 씁니다. 큰 자리부터 이어 써서 '+', '.join(map(str,nums))+'를 각각 나타내세요.',', '.join(answers),'각 수를 십의 자리와 일의 자리로 나누고 X를 십의 자리 수만큼 쓴 뒤 약속한 일의 자리 표기를 이으면 '+', '.join(answers)+'입니다.',{'strings':answers})
 if tid in['NS21','NS22']:
  lo,hi=[(1,12),(1,18),(1,23)][k]if tid=='NS21'else[(3,12),(7,16),(8,19)][k];lo=p.get('lower',lo);hi=p.get('upper',hi);digits=sum(len(str(n))for n in range(lo,hi+1));gaps=hi-lo;m.update(lower=lo,upper=hi)
  if tid=='NS21':
   m.update(separator='+',terminal='=');val=digits+gaps+1
   return done(f'계산기에 {lo}부터 {hi}까지 차례로 입력하고 이웃한 두 수 사이에 +를 한 번씩 누른 뒤 마지막에 =를 한 번 누릅니다. 숫자 한 글자와 기호 하나가 각각 키 한 번입니다. 모두 몇 번 누르나요?',f'{val}번',f'숫자 키 {digits}번, 사이의 + 키 {gaps}번, 마지막 = 키 1번이므로 {digits}+{gaps}+1={val}번입니다.',{'presses':val})
  speed,rest=[(2,1),(1,3),(2,2)][k];speed=p.get('speed',speed);rest=p.get('rest',rest);m.update(secondsPerDigit=speed,restBetween=rest);val=digits*speed+gaps*rest
  return done(f'기계가 {lo}부터 {hi}까지 차례로 인쇄합니다. 숫자 한 글자에는 {speed}초, 수 하나를 다 쓴 뒤 다음 수를 쓰기 전에는 {rest}초씩 걸립니다. 처음 쓰기 전과 마지막 수를 쓴 뒤에는 쉬지 않습니다. 모두 몇 초가 걸리나요?',f'{val}초',f'숫자 {digits}글자를 쓰는 시간 {digits*speed}초에 사이의 휴식 {gaps}번×{rest}초를 더하면 {val}초입니다.',{'seconds':val})
 if tid=='VN08':
  items=[[{'color':'B','size':'S'},{'color':'R','size':'L'},{'color':'B','size':'L'}],[{'color':'R','size':'S'},{'color':'B','size':'S'},{'color':'R','size':'L'}],[{'color':'B','size':'L'},{'color':'R','size':'S'},{'color':'B','size':'S'}]][k];visual=V.attributes(items);codes=[v['color']+v['size']for v in items];m['items']=items
  if p:items=[dict(color=p[x][0],size=p[x][1])for x in['cardA','cardB','cardC']];visual=V.attributes(items);codes=[v['color']+v['size']for v in items];m['items']=items
  return done('빨강은 R, 파랑은 B, 큰 도형은 L, 작은 도형은 S입니다. 색 기호를 먼저, 크기 기호를 나중에 써서 가·나·다를 각각 두 글자로 나타내세요.',', '.join(L[i]+' '+c for i,c in enumerate(codes)),'각 그림의 색과 크기를 읽고 색 다음에 크기 기호를 쓰면 '+', '.join(codes)+'입니다.',{'codes':codes})
 if tid=='TM13':
  rows=[('오전 8시에 출발했습니다.','point'),('25분 동안 걸었습니다.','duration'),('오후 3시 10분에 도착했습니다.','point'),('50분 동안 쉬었습니다.','duration')];order=[[1,0,3,2],[2,3,1,0],[3,2,0,1]][k];rows=[rows[i]for i in order];marks=['○'if typ=='point'else'△'for _,typ in rows];m.update(statements=[t for t,_ in rows],statementKinds=[t for _,t in rows])
  if p:
   rows=[(f'오전 {p["hour"]}시에 출발했습니다.','point'),(f'{p["durationA"]}분 동안 걸었습니다.','duration'),(f'오후 3시 {p["minute"]}분에 도착했습니다.','point'),(f'{p["durationB"]}분 동안 쉬었습니다.','duration')];order=[[0,1,2,3],[1,0,3,2],[0,2,1,3],[1,3,0,2],[0,1,3,2],[1,0,2,3]][p['order']];rows=[rows[i]for i in order];marks=['○'if typ=='point'else'△'for _,typ in rows];m.update(statements=[t for t,_ in rows],statementKinds=[t for _,t in rows])
  return done('특정한 때를 나타내면 ○, 걸린 시간을 나타내면 △를 쓰세요. '+' '.join(f'{L[i]}: {s}'for i,(s,t)in enumerate(rows)),', '.join(L[i]+' '+x for i,x in enumerate(marks)),'몇 시에 해당하는 표현은 시각이고, 몇 분 동안에 해당하는 표현은 걸린 시간입니다.',{'marks':marks})
 if tid=='NG02':
  target=p.get('target',[8,13,17][k]);first=target%3;m.update(moves=[1,2],target=target,overshootAllowed=False)
  return done(f'두 사람이 번갈아 1cm 또는 2cm 막대를 하나씩 이어 붙입니다. 정확히 {target}cm를 만드는 사람이 이깁니다. {target}cm를 넘기면 안 됩니다. 먼저 하는 사람이 반드시 이기려면 첫 막대는 몇 cm여야 하나요? 그 뒤의 방법도 설명하세요.',f'첫 막대 {first}cm / 상대와 내 막대 길이의 합을 3cm로 맞추기',f'먼저 {first}cm를 놓고 상대가 1cm를 놓으면 2cm, 2cm면 1cm로 답합니다. 내 차례가 끝날 때 전체는 '+', '.join(map(str,range(first,target+1,3)))+f'cm가 되어 {target}cm를 만들 수 있습니다.',{'first':first,'replyToOne':2,'replyToTwo':1})
 if tid=='UL40':
  a,b=[(2,5),(3,4),(3,5)][k];a=p.get('unitA',a);b=p.get('unitB',b);g=math.gcd(a,b);items=[['가',b//g,'A'],['나',a//g,'B'],['다',b//g+1,'A'],['라',a//g+1,'B']];vals=[v*{'A':a,'B':b}[u]for _,v,u in items];groups=[]
  for v in sorted(set(vals)):groups.append('='.join(L[i]for i,x in enumerate(vals)if x==v))
  order='<'.join(groups);m.update(unitValues={'A':a,'B':b},items=items)
  return done(f'1A는 {a}cm, 1B는 {b}cm입니다. '+', '.join(f'{name}:{cnt}{unit}'for name,cnt,unit in items)+'를 짧은 것부터 나열하세요. 같은 길이는 =로 묶으세요.',order,', '.join(f'{L[i]} {v}cm'for i,v in enumerate(vals))+'이므로 '+order+'입니다.',{'lengths':vals,'order':order})
 if tid=='SQ27':
  factor=p.get('factor',[3,6,7][k]);values=[factor*n for n in range(1,11)];digits=[x%10 for x in values];m.update(factor=factor,values=values)
  return done(f'{factor}단 구구의 곱 {", ".join(map(str,values))}에서 일의 자리 숫자만 차례로 쓰고 숫자가 이어지는 규칙을 설명하세요.',', '.join(map(str,digits)),f'{factor}씩 더할 때 일의 자리는 10이 되면 0부터 이어집니다. 주어진 곱에서 일의 자리만 읽으면 '+', '.join(map(str,digits))+'입니다.',{'digits':digits})
 if tid=='PT08':
  size=p.get('size',k+2);tri=[[0,0],[size,0],[0,size]];inventory=[tri]*4;parts=[tri,[[0,0],[0,size],[-size,0]],[[0,0],[-size,0],[0,-size]],[[0,0],[0,-size],[size,0]]];outer=[[0,size],[size,0],[0,-size],[-size,0]];visual=parts_figure(inventory);av=parts_figure([parts],True);m.update(inventory=inventory,partition=parts,outer=outer,legLength=size)
  return done(f'직각을 이루는 두 변이 각각 {size}cm인 같은 직각이등변삼각형 네 조각입니다. 네 조각을 모두 한 번씩 써서 정사각형 한 개를 만드세요. 조각은 돌리거나 뒤집어도 되며 겹치거나 빈틈이 있으면 안 됩니다.','예: 네 직각 꼭짓점을 한 점에 모은 정사각형','네 삼각형의 직각을 한 점에 모으면 한 바퀴를 채웁니다. 바깥의 같은 빗변 네 개가 정사각형의 변이 됩니다.',{'construction':parts,'outer':outer})
 if tid=='TL03':
  ns=[p[x]for x in['p1','p2','p3','p4']]if p else[[3,5,6,8],[4,5,8,12],[3,4,10,12]][k];valid=[n for n in ns if 360%(180*(n-2)//n)==0 and n in[3,4,6]];visual=V.polygons(ns);m.update(polygonSides=ns,edgeToEdge=True)
  if p and not valid:return done('그림의 정다각형 중 한 종류만 써서 변 전체끼리 맞대어 평면을 빈틈과 겹침 없이 채울 수 있는 도형을 모두 고르세요. 가능한 도형이 없으면 없다고 쓰세요. 한 각의 크기는 그림에 적혀 있습니다.','없음','보기의 각 108°·135°·144°·150°는 같은 개수를 더해 360°를 만들 수 없어 어느 도형도 조건에 맞지 않습니다.',{'polygonSides':[]})
  return done('각 그림은 같은 변과 같은 각을 가진 정다각형입니다. 한 종류만 반복해 평면을 빈틈과 겹침 없이 채울 수 있는 도형을 모두 고르세요. 변 전체가 이웃 도형의 변 전체와 맞닿게 놓습니다. 한 각의 크기는 그림에 적혀 있습니다.',', '.join(V.POLYGON_NAMES[n]for n in valid),'한 꼭짓점에 모인 각의 합이 360°여야 합니다. 정삼각형은 6개, 정사각형은 4개, 정육각형은 3개가 모여 채웁니다. 나머지 보기의 각은 같은 개수로 360°를 채우지 못합니다.',{'polygonSides':valid})
 if tid=='UA38':
  w,h=[(8,3),(6,5),(8,4)][k];w=p.get('width',w);h=p.get('height',h);visual=V.units(w,h);m.update(target=[w,h],units=[{'kind':'rectangle','size':[1,1]},{'kind':'rectangle','size':[2,1]},{'kind':'circle','radius':.5}])
  if p and w*h%2:
   band=None;hold='넓이가 홀수여서 2칸 조각을 채울 수 없는 조건의 현재 표현 난도 확인 전입니다.'
   return done(f'가로 {w}cm, 세로 {h}cm인 직사각형을 ① 한 변 1cm인 정사각형, ② 가로 2cm·세로 1cm인 직사각형, ③ 지름 1cm인 원 중 한 종류로 채웁니다. 조각은 자르지 않고 돌릴 수 있으며 겹침·빈틈 없이 바닥 밖으로 나가지 않아야 합니다. 가능한 종류와 각각 필요한 개수를 쓰세요.',f'① {w*h}개 / ②·③ 불가능',f'①은 {w*h}개로 채웁니다. ②는 한 조각이 2cm²여서 홀수인 {w*h}cm²를 남김없이 채울 수 없습니다. 원은 모서리에 빈틈이 생깁니다.',{'square':w*h,'domino':None,'circlePossible':False})
  return done(f'가로 {w}cm, 세로 {h}cm인 직사각형 바닥을 채웁니다. ① 한 변 1cm 정사각형, ② 가로 2cm·세로 1cm 직사각형, ③ 지름 1cm 원 중 한 종류만 씁니다. 조각은 자르지 않고 돌릴 수 있으며 겹침·빈틈 없이 바닥 밖으로 나가지 않아야 합니다. 가능한 종류와 각각 필요한 개수를 쓰세요.',f'① {w*h}개, ② {w*h//2}개 / ③ 불가능',f'넓이는 {w*h}cm²입니다. ①은 한 개에 1cm², ②는 2cm²이며 실제로 줄맞춰 채울 수 있어 각각 {w*h}개와 {w*h//2}개입니다. 원으로는 직사각형의 모서리를 빈틈 없이 채울 수 없습니다.',{'square':w*h,'domino':w*h//2,'circlePossible':False})
 if tid=='NC13':
  a,b=[(1,2),(2,0),(2,1)][k];a=p.get('factor',a);b=p.get('offset',b);cards=[a*x+b for x in[1,3,4,7,9]];sums=[12*a+3*b,16*a+3*b];values=[a*x+b for x in[1,4,7,3,9]];visual=V.cross(sums);av=V.cross(sums,values);m.update(cards=cards,sums=sums,rows=[[0,1,2],[3,1,4]],increasing=True)
  return done(f'카드 {", ".join(map(str,cards))}를 십자 칸에 한 장씩 모두 넣으세요. 가로 세 칸의 합은 {sums[0]}, 세로 세 칸의 합은 {sums[1]}입니다. 가로는 왼쪽부터, 세로는 위쪽부터 수가 커져야 합니다. 모든 칸의 수를 쓰세요.',f'왼쪽 {values[0]}, 가운데 {values[1]}, 오른쪽 {values[2]}, 위 {values[3]}, 아래 {values[4]}','두 합을 더하면 가운데 카드가 두 번 더해집니다. 전체 카드 합과 비교하여 가운데를 찾고, 남은 카드 쌍을 합과 증가 순서에 맞추면 답 배치가 됩니다.',{'assignment':values})
 if tid=='LG08':
  plain=['함께풀면신이난다','생각하면길이보여','오늘공부재미있다'][p.get('message',k)];rows,cols=[(2,4),(4,2),(4,2)][k];rows=p.get('rows',rows);cols=8//rows;cipher=''.join(plain[r*cols+c]for c in range(cols)for r in range(rows));visual=V.cipher(rows,cols);av=V.cipher(rows,cols,plain);m.update(rows=rows,cols=cols,cipher=cipher,plain=plain)
  return done(f'아래 {rows}줄 {cols}칸 표에 문장을 왼쪽부터 가로로 한 줄씩 쓴 뒤, 세로줄을 왼쪽부터 위에서 아래로 읽어 암호를 만들었습니다. 암호는 「{cipher}」입니다. 원래 문장을 찾고 표를 어떻게 채웠는지 설명하세요.',plain,f'암호를 왼쪽 세로줄부터 {rows}글자씩 넣고 가로로 읽으면 「{plain}」입니다.',{'plain':plain})
 if tid=='CT12':
  n=p.get('teams',[4,7,8][k]);m['teams']=n;league=n*(n-1)//2
  return done(f'{n}개 팀이 참가합니다. 모든 두 팀이 한 번씩 만나는 리그전과 한 번 지면 탈락하는 토너먼트전은 각각 몇 경기를 하나요? 무승부는 없고 우승팀은 하나입니다. 토너먼트에서 부전승은 경기 수에 넣지 않습니다.',f'리그전 {league}경기, 토너먼트전 {n-1}경기',f'리그전은 팀마다 상대가 {n-1}개이고 두 번 센 경기를 반으로 나누어 {league}경기입니다. 토너먼트에서는 경기마다 한 팀이 탈락하므로 우승팀을 뺀 {n-1}경기입니다.',{'league':league,'knockout':n-1})
 if tid=='RT07':
  n=p.get('count',[2,4,5][k]);visual,centers,r=V.route(n);m.update(circleCount=n,centers=centers,radius=r)
  return done(f'같은 원 {n}개가 그림처럼 일렬로 맞닿아 있습니다. S에서 T까지 원의 둘레만 따라가되 뒤로 되돌아가지 않는 가장 짧은 길은 몇 가지인가요?',f'{2**n}가지',f'각 원에서 위쪽 반원 또는 아래쪽 반원을 고를 수 있습니다. 원마다 두 선택을 이어 곱하면 {"×".join(["2"]*n)}={2**n}가지입니다.',{'routes':2**n})
 if tid=='AG31':
  a=p.get('angle',[40,70,150][k]);visual=protractor(a);m['angle']=a
  return done('각도기의 오른쪽 0° 선에서 시작해 표시된 두 선 사이의 각을 읽으세요.',f'{a}°',f'오른쪽의 0°에서 시작하는 눈금을 읽으면 {a}°입니다.',{'angle':a})
 if tid=='SP02':
  coords=[(1,0),(0,1),(1,1),(2,1),(3,1),(1,2)]
  if k==1:coords=[(-y,x)for x,y in coords]
  if k==2:coords=[(-x,-y)for x,y in coords]
  if p:
   coords=[(1,0),(0,1),(1,1),(2,1),(3,1),(1,2)]if p['net']==0 else[(1,0),(0,1),(1,1),(2,1),(1,2),(1,3)]
   for _ in range(p['turn']):coords=[(-y,x)for x,y in coords]
  cells=[dict(x=x,y=y,number=i+1)for i,(x,y)in enumerate(coords)];visual=V.cube(cells,blank=True);m.update(cells=cells,solid='cube');response={'solid':'정육면체','faceShape':'정사각형','faces':6};prompt='그림의 같은 정사각형 여섯 개를 접어 겹치지 않게 닫힌 입체를 만듭니다. 입체의 이름과 면의 모양, 면의 수를 쓰세요.'
  band=None;hold='정삼각형 네 면에서 정사각형 여섯 면 전개도로 바뀌어 새 표현 난도 확인 전입니다.'
  return done(prompt,' / '.join([response['solid'],response['faceShape'],str(response['faces'])+'개']),f'각 면을 접어 닫으면 {response["solid"]}가 됩니다. 면은 모두 {response["faceShape"]}이며 {response["faces"]}개입니다.',response)
 if tid=='PT09':
  size=p.get('size',k+1);sq=[[0,0],[1,0],[1,1],[0,1]];tri=[[0,0],[1,0],[0,1]];inventory=[sq,tri,tri]
  groups=[[sq,[[1,0],[2,0],[1,1]],[[2,0],[2,1],[1,1]]],[sq,[[1,0],[2,0],[1,1]],[[0,1],[1,1],[0,2]]]];outers=[[[0,0],[2,0],[2,1],[0,1]],[[0,0],[2,0],[0,2]]]
  if p and p['inventory']==1:
   inventory=copy.deepcopy(base['responseModel']['inventory']);groups=copy.deepcopy(base['responseModel']['constructions']);outers=copy.deepcopy(base['responseModel']['outers'])
  scale=lambda p:[[size*x,size*y]for x,y in p];inventory=list(map(scale,inventory));groups=[[scale(p)for p in g]for g in groups];outers=list(map(scale,outers));visual=parts_figure(inventory);av=parts_figure(groups,True);m.update(inventory=inventory,constructions=groups,outers=outers,legLength=size)
  band=None;hold='기존 두 정사각형+한 삼각형에서 한 정사각형+두 삼각형으로 재고가 바뀌어 새 표현 난도 확인 전입니다.'
  if p and p['inventory']==1:
   band=base['commonBandCandidate'];hold=None
   return done(f'한 변 {size}cm인 정사각형 두 조각과 직각을 이루는 두 변이 각각 {size}cm인 직각이등변삼각형 한 조각입니다. 세 조각을 모두 한 번씩 써서 서로 다른 도형 두 가지를 만드세요. 돌리기·뒤집기로 같아지는 모양은 한 가지로 봅니다. 겹침·빈틈 없이 변 전체끼리 붙이세요.','예: 사다리꼴과 오각형','정사각형 두 개를 이어 붙이고 삼각형을 바깥의 다른 두 변에 각각 붙이면, 사다리꼴과 오목한 오각형이라는 서로 다른 두 모양을 만들 수 있습니다.',{'constructions':groups,'outers':outers})
  return done(f'한 변 {size}cm인 정사각형 한 조각과 직각을 이루는 두 변이 각각 {size}cm인 직각이등변삼각형 두 조각입니다. 세 조각을 모두 한 번씩 써서 서로 다른 도형 두 가지를 만드세요. 돌리기·뒤집기로 같아지는 모양은 한 가지로 봅니다. 겹침·빈틈 없이 변 전체끼리 붙이세요.','예: 직사각형과 큰 직각이등변삼각형','두 삼각형을 합쳐 정사각형으로 만든 뒤 원래 정사각형에 붙이면 직사각형입니다. 두 삼각형을 원래 정사각형의 이웃한 두 변에 붙이면 큰 삼각형입니다.',{'constructions':groups,'outers':outers})
 if tid=='DS07':
  cells=copy.deepcopy(base['responseModel']['cells']);factor,offset=[(1,1),(2,0),(2,1)][k]
  factor=p.get('factor',factor);offset=p.get('offset',offset)
  for c in cells:c['number']=c['number']*factor+offset
  if p:
   for _ in range(p['turn']):
    for c in cells:c['x'],c['y']=-c['y'],c['x']
  visual=V.cube(cells);pairs=[[factor*x+offset,factor*y+offset]for x,y in[(1,6),(2,5),(3,4)]];s=7*factor+2*offset;m.update(cells=cells)
  return done('숫자가 적힌 전개도를 접어 정육면체를 만듭니다. 마주 보는 면의 수를 세 쌍 모두 쓰고, 각 쌍의 합에 어떤 공통점이 있는지 설명하세요.',', '.join(f'{a}와 {b}'for a,b in pairs)+f' / 각 합 {s}',f'면을 접어 마주 보는 쌍을 찾으면 '+', '.join(f'{a}와 {b}'for a,b in pairs)+f'이고 각 합은 {s}입니다.',{'pairs':pairs,'sum':s})
 if tid=='TR11':
  shown=[i for i in range(10)if p['digits']>>i&1]if p else[[0,1,3,4,6,7,8],[1,2,4,5,7,9],[0,2,3,5,6,9]][k];valid=[d for d in shown if d in[0,1,2,5,6,8,9]];visual=V.digital(shown);m.update(digits=DIGITS,segments=SEGMENTS,shown=shown,translationAllowed=True)
  if not valid:return done('그림의 숫자 카드를 반 바퀴 돌려 같은 글꼴의 0~9 중 어느 숫자가 되는 보기를 모두 고르세요. 크기를 바꾸거나 뒤집지 않으며 위치를 옮겨 겹쳐 볼 수 있습니다. 해당 카드가 없으면 없다고 쓰세요.','없음','이 글꼴에서 보기의 숫자는 반 바퀴 돌리면 0~9 어느 숫자에도 겹쳐지지 않습니다.',{'digits':[]})
  return done('그림의 숫자 카드를 반 바퀴 돌렸을 때 같은 글꼴의 0~9 중 어느 숫자가 되는 카드를 모두 고르세요. 카드의 크기를 바꾸거나 뒤집을 수는 없습니다. 숫자의 위치를 옮겨 겹쳐 보는 것은 가능합니다. 보기 밖의 숫자로 바뀌어도 됩니다.',', '.join(map(str,valid)),'이 글꼴에서는 반 바퀴 돌리면 0·1·2·5·8은 같은 숫자, 6과 9는 서로 바뀝니다. 보기 중 이 조건에 맞는 것은 '+', '.join(map(str,valid))+'입니다.',{'digits':valid})
 if tid=='TR14':
  steps=p.get('steps',[7,15,21][k]);m.update(steps=steps,degreesPerStep=90,initialDegrees=0)
  return done(f'위쪽을 향한 화살표를 시계 방향으로 90°씩 {steps}번 돌립니다. 돌리기 전은 세지 않고, 매번 돌린 직후를 셉니다. 마지막 회전 직후도 포함하여 화살표가 처음 방향을 향하는 때는 몇 번인가요?',f'{steps//4}번',f'네 번 돌릴 때마다 처음 방향이 됩니다. 4의 배수 회전인 '+', '.join(map(str,range(4,steps+1,4)))+f'번째이므로 {steps//4}번입니다.',{'returns':steps//4})
 if tid=='TR13':
  w,h=[(1,2),(3,2),(2,3)][k];w=p.get('width',w);h=p.get('height',h);visual=V.mirror(w,h);av=V.mirror(w,h,True);m.update(triangle=[[0,0],[w,0],[0,h]],mirrorX=0,outer=[[-w,0],[w,0],[0,h]])
  return done('점선은 거울선입니다. 색칠한 직각삼각형의 거울에 비친 모양을 그려 원래 삼각형과 붙이세요. 합쳐진 바깥 도형은 어떤 삼각형인지 쓰세요. 거울선은 직각을 이루는 한 변 위에 있습니다.','이등변삼각형','거울선 양쪽의 두 빗변은 서로 같은 길이입니다. 바깥 경계에는 길이가 같은 두 변이 있으므로 이등변삼각형입니다.',{'kind':'isosceles'})
 if tid=='TR12':
  given=[[[0,0],[1,1]],[[1,0],[2,0]],[[0,0],[1,0],[1,1]]][k];turns=[list(range(3)),list(range(4)),list(range(2))][k];union=set()
  if p:given=[[i%3,i//3]for i in range(9)if p['mask']>>i&1];turns=list(range(p['turns']+1))
  for x,y in given:
   for t in turns:
    xx,yy=x,y
    for _ in range(t):xx,yy=2-yy,xx
    union.add((xx,yy))
  visual=V.rotation(given);av=V.rotation(given,union);m.update(side=3,givenCells=given,quarterTurns=turns);un=9-len(union)
  return done(f'왼쪽 모양을 정사각형의 중심 주위로 시계 방향 90°씩 차례로 {max(turns)}번 돌립니다. 처음 모양과 돌릴 때마다의 색칠을 모두 오른쪽 한 판에 겹쳐 칠하세요. 두 번 이상 겹친 칸도 한 번 칠하며 색칠하지 않은 칸 수를 쓰세요.',f'색칠 {len(union)}칸 / 색칠하지 않은 칸 {un}칸','각 색칠 칸의 회전 위치를 차례로 옮긴 뒤 겹친 칸은 한 번만 세면 '+str(len(union))+f'칸입니다. 전체 9칸에서 빼면 {un}칸이 남습니다.',{'union':sorted(map(list,union)),'uncolored':un})
 if tid=='AG32':
  angles=[p[x]for x in['a','b','c']]if p else[[90,45,135],[60,120,90],[150,90,30]][k];names=['예각'if a<90 else'직각'if a==90 else'둔각'for a in angles];visual=V.angles(angles,center_offset=90)if p else V.angles(angles);m['angles']=angles
  return done('가·나·다의 각을 각각 예각, 직각, 둔각 중 하나로 분류하세요.',', '.join(L[i]+' '+x for i,x in enumerate(names)),'직각보다 작으면 예각, 직각과 같으면 직각, 직각보다 크고 반 바퀴보다 작으면 둔각입니다.',{'names':names})
 if tid=='GP03':
  statements=[['모든 마름모는 정사각형입니다.','직사각형은 네 각이 직각입니다.','정사각형은 네 변의 길이가 같습니다.'],['정삼각형은 세 변의 길이가 같습니다.','모든 이등변삼각형은 정삼각형입니다.','정사각형은 직사각형입니다.'],['직사각형은 네 각이 직각입니다.','정사각형은 마름모입니다.','모든 사다리꼴은 직사각형입니다.']][k];bad=k+1
  counter=[[[0,1],[2,0],[4,1],[2,2]],[[0,0],[2,0],[1,2]],[[0,0],[3,0],[2,1],[0,1]]][k];names=['직각이 없는 마름모','세 변이 모두 같지 않은 이등변삼각형','직각이 네 개가 아닌 사다리꼴'];m.update(statements=statements,falseIndex=bad,counterexample=counter)
  return done('다음 말 중 틀린 것을 고르고, 맞지 않는 도형의 예를 들어 설명하세요. '+' '.join(f'{i+1}. {s}'for i,s in enumerate(statements)),f'{bad}번 / 예: {names[k]}',names[k]+'이 존재하므로 해당 말은 모든 도형에서 참이 아닙니다. 조건에 맞는 다른 반례도 정답입니다.',{'falseIndex':bad,'counterexample':counter})
 if tid=='FC22':
  sq=[[0,0],[2,0],[2,2],[0,2]];rect=[[0,0],[3,0],[3,2],[0,2]];rhomb=[[0,1],[2,0],[4,1],[2,2]];para=[[0,0],[3,0],[4,2],[1,2]];ps=[[sq,rect,para],[sq,sq,rhomb],[rect,rhomb,para]][k];counts=[[1,2,1],[2,2,3],[0,1,1]][k];visual=V.quadrilaterals(ps);m['polygons']=ps
  if p:
   kinds=[p[x]for x in['shapeA','shapeB','shapeC']];ps=[[sq,rect,rhomb,para][i]for i in kinds];counts=[kinds.count(0),sum(i in[0,1]for i in kinds),sum(i in[0,2]for i in kinds)];visual=V.quadrilaterals(ps);m['polygons']=ps
  return done('모눈의 가·나·다에서 정사각형, 직사각형, 마름모의 개수를 각각 쓰세요. 직사각형은 네 각이 직각인 사각형, 마름모는 네 변의 길이가 같은 사각형입니다. 정사각형도 직사각형과 마름모에 각각 포함합니다.',f'정사각형 {counts[0]}개, 직사각형 {counts[1]}개, 마름모 {counts[2]}개','같은 변과 직각을 확인합니다. 정사각형은 세 범주에 모두 넣고, 나머지 도형도 각 정의에 맞게 세면 '+', '.join(map(str,counts))+'개입니다.',{'counts':counts})
 if tid=='FC23':
  top,bottom=[(2,3),(3,4),(4,4)][k];top=p.get('top',top);bottom=p.get('bottom',bottom);visual,ps=V.trapezoids(top,bottom);n=math.comb(top,2)*math.comb(bottom,2);m.update(points=ps,upper=list(range(top)),lower=list(range(top,len(ps))),unmarkedIntersectionsAllowed=False)
  band=None if k else band;hold='표시 점이 늘어 경우 조직 범위가 바뀐 표현의 난도 확인 전입니다.'if k else None
  return done('표시된 점 중 네 점을 꼭짓점으로 하고 그려진 선을 변으로 하여 사다리꼴을 만듭니다. 표시되지 않은 교점은 꼭짓점으로 쓰지 않습니다. 사다리꼴은 적어도 한 쌍의 마주 보는 변이 평행한 사각형입니다. 모두 몇 개인가요?',f'{n}개',f'위에서 두 점을 고르는 {math.comb(top,2)}가지와 아래에서 두 점을 고르는 {math.comb(bottom,2)}가지를 짝지으면 각 사다리꼴을 한 번씩 세므로 {n}개입니다.',{'total':n})
 if tid=='QR33':
  a,b,c=[(3,2,3),(2,4,2),(3,3,2)][k];a=p.get('red',a);b=p.get('blue',b);c=p.get('green',c);m['chain']=[a,b,c]
  return done(f'빨강 칩 {a}개를 파랑 칩 1개로, 파랑 칩 {b}개를 초록 칩 1개로 바꿉니다. 초록 칩 {c}개로 상자 1개를 받습니다. 초록 칩 1개와 상자 1개에 필요한 빨강 칩 수를 각각 쓰세요.',f'초록 칩 1개: {a*b}개 / 상자 1개: {a*b*c}개',f'초록 하나는 파랑 {b}개이므로 빨강 {a}×{b}={a*b}개입니다. 상자는 그 {c}배인 {a*b*c}개입니다.',{'green':a*b,'box':a*b*c})
 if tid=='BL05':
  a,left,right=[(2,3,8),(4,2,5),(3,3,11)][k];a=p.get('ratio',a);left=p.get('apples',left);right=p.get('oranges',right);delta=a*left-right;side='오른쪽'if delta>0 else'왼쪽';m.update(appleInOranges=a,leftApples=left,rightOranges=right)
  return done(f'사과 한 개의 무게는 귤 {a}개와 같습니다. 양팔저울 왼쪽에는 사과 {left}개, 오른쪽에는 귤 {right}개가 있습니다. 어느 쪽에 귤을 몇 개 더 놓아야 균형이 맞나요?',f'{side}에 귤 {abs(delta)}개',f'왼쪽은 귤 {a*left}개와 같은 무게입니다. 두 쪽의 차가 {abs(delta)}개이므로 가벼운 {side}에 그만큼 더 놓습니다.',{'side':side,'count':abs(delta)})
 if tid=='OP13':
  a,b,c,d=[(6,3,4,2),(7,2,6,4),(9,3,5,1)][k];a=p.get('a',a);b=p.get('b',b);c=p.get('c',c);d=p.get('d',d);vals=sorted({a+b*(c-d),a+b*c-d,(a+b)*c-d});exprs=[f'{a}+{b}×({c}−{d})={vals[0]}',f'{a}+({b}×{c})−{d}={vals[1]}',f'({a}+{b})×{c}−{d}={vals[2]}'];m.update(numbers=[a,b,c,d],operators=['+','*','-'],oneConsecutiveParenthesisPair=True)
  return done(f'{a}+{b}×{c}−{d}에 괄호 한 쌍을 넣어 서로 다른 계산 결과 세 가지를 만드세요. 괄호는 연속한 수 두 개 이상과 그 사이 기호를 감싸야 합니다. 수와 기호의 순서는 바꾸지 않습니다. 각 식과 값을 쓰고 값을 작은 것부터 나열하세요.',', '.join(map(str,vals))+' / '+', '.join(exprs),'괄호가 감싸는 구간을 여섯 가지로 나누어 계산하고 같은 값을 합치면 '+', '.join(map(str,vals))+'의 세 결과가 남습니다.',{'values':vals,'expressions':exprs})
 if tid=='MG13':
  first=p.get('first',k+2);direction=p.get('direction',1 if k!=1 else-1);grid=[[0]*5 for _ in range(5)];r,c=0,2
  for val in range(first,first+25):
   grid[r][c]=val;nr,nc=(r-1)%5,(c+direction)%5
   if grid[nr][nc]:r=(r+1)%5
   else:r,c=nr,nc
  visual=magic_grid();av=magic_grid(grid);m.update(side=5,start=[0,2],first=first,horizontalDirection=direction,grid=grid,studentMustProveLineSum=False)
  direct='오른쪽'if direction==1 else'왼쪽';total=5*(first+12)
  return done(f'5×5 표에 {first}부터 {first+24}까지 차례로 채우세요. {first}는 맨 윗줄 가운데에 씁니다. 다음 수는 바로 전 수의 {direct} 위 칸에 씁니다. 표 밖이면 반대쪽 끝으로 이어 갑니다. 그 칸에 이미 수가 있으면 바로 전 수의 바로 아래 칸에 씁니다.',' / '.join(' '.join(map(str,row))for row in grid),f'주어진 이동을 차례로 따르면 답 표가 됩니다. 완성 후 가로줄·세로줄·두 대각선의 합이 모두 {total}인지도 확인할 수 있습니다.',{'grid':grid})
 raise ValueError(tid)
