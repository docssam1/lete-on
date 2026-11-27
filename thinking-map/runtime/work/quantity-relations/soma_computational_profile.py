"""Learner operations and coarse number ranges; never infer school grade from checker maths."""
OPERATIONS={
 'UA37':['단위 넓이·절반 넓이 비교'],'GP01':[],'SP01':['같은 각의 크기를 여러 번 더하기','360°와 비교'],
 'UL43':['지름과 반지름의 두 배·절반','같은 수로 나누기'],'FC18':['개수 세기','중복 없이 경우 나누기'],
 'CAL09':['곱셈구구','자리별 뺄셈','나눗셈 세로식·몫의 0·나머지'],
 'OP12':['덧셈·뺄셈','같은 계산 결과를 한 번만 세기'],'NS20':['차례대로 세기','홀짝 구별','양 끝 포함'],
 'NC12':['십의 자리·일의 자리 읽기'],'NS21':['수의 개수와 숫자 글자 수 구별','사이 개수·마지막 기호 더하기'],
 'NS22':['글자 수에 따른 시간의 곱셈','사이의 휴식 시간 더하기'],'VN08':[],'TM13':[],
 'NG02':['1과 2 더하기','상대의 선택과 내 선택을 이어 생각하기'],'UL40':['같은 단위로 바꾸기','같은 값·크기 순서 비교'],
 'SQ27':['주어진 수에서 일의 자리 읽기'],'FC19':['개수 세기','크기별로 나누어 중복 제외'],
 'PT08':['조각 수 세기'],'TL03':['같은 각의 반복 합','한 바퀴 360°'],
 'UA38':['가로·세로의 단위 칸 수 곱하기','2씩 묶기·나머지 확인'],'NC13':['세 수의 합','전체 합·공통 칸 비교'],
 'LG08':[],'CT12':['겹쳐 센 경기 수 반으로 나누기','한 팀씩 탈락하는 수 세기'],
 'RT07':['각 원의 두 선택을 이어 세기'],'AG31':['각도 눈금 읽기'],'SP02':['면의 수 세기'],
 'PT09':['세 조각의 재고 확인'],'DS07':['마주 보는 두 수의 합'],'TR11':[],
 'TR14':['네 번씩 묶어 세기','처음·마지막 포함 구별'],'TR13':[],
 'TR12':['9칸 안에서 중복 제외','전체에서 색칠한 칸 빼기'],'AG32':['직각을 기준으로 비교'],
 'GP02':[],'FC20':['중복 없이 도형 수 세기'],'FC21':['중복 없이 도형 수 세기'],
 'GP03':[],'FC22':['0~3개 세기'],'FC23':['점 선택을 묶어 세기'],'FC24':['중복 없이 세 점 고르기'],
 'QR33':['같은 묶음의 곱셈','세 단계 교환 단위 연결'],'BL05':['같은 무게로 바꾸는 곱셈','차이·더 놓을 쪽 구별'],
 'OP13':['괄호·곱셈 우선순위','덧셈·뺄셈'],'MG13':['다음 수 읽고 쓰기']}

def profile(tid,m,r):
 vals=[]
 def add(*xs):
  for x in xs:
   if type(x)in[int,float]:vals.append(abs(x))
   elif isinstance(x,(list,tuple)):
    for v in x:add(v)
 if tid in['FC18','FC19','FC20','FC21','FC23','FC24']:add(r.get('total',0))
 elif tid=='UA37':add(3)
 elif tid=='SP01':add(360,m['faceAngle']*max(m['counts']))
 elif tid=='UL43':add(2*m['outerRadius'],m['smallCount'])
 elif tid=='CAL09':add(m['dividend'],m['divisor'])
 elif tid=='OP12':add(sum(m['numbers']))
 elif tid in['NS20','NS21','NS22']:add(m['upper'],r.get('presses'),r.get('seconds'))
 elif tid=='NC12':add(m['numbers'])
 elif tid=='NG02':add(m['target'])
 elif tid=='UL40':add(r['lengths'])
 elif tid=='SQ27':add(m['values'])
 elif tid in['PT08','PT09']:add(4)
 elif tid=='TL03':add(360)
 elif tid=='UA38':add(m['target'][0]*m['target'][1])
 elif tid=='NC13':add(m['sums'],m['cards'])
 elif tid=='CT12':add(m['teams'],r['league'])
 elif tid=='RT07':add(r['routes'])
 elif tid=='AG31':add(m['angle'])
 elif tid=='SP02':add(6)
 elif tid=='DS07':add(r['sum'])
 elif tid=='TR14':add(m['steps'])
 elif tid=='TR12':add(9)
 elif tid=='AG32':add(180)
 elif tid=='FC22':add(3)
 elif tid=='QR33':add(r['green'],r['box'])
 elif tid=='BL05':add(m['appleInOranges']*m['leftApples'],m['rightOranges'])
 elif tid=='OP13':add(m['numbers'],r['values'])
 elif tid=='MG13':add(m['first']+24)
 top=max(vals,default=0);bucket=next((v for v in[10,20,50,100,200,500,1000]if v>=top),1000)if top else None
 return dict(operations=OPERATIONS[tid],numberRangeBucket=bucket,numberRangeNote=(f'{bucket}까지의 수를 읽거나 세는 범위'if bucket else'수 계산보다 모양·위치·분류·조건 설명을 사용'),rangeIsCoarseAndDoesNotExposeExactAnswer=True,schoolGradeAssigned=False,verificationOnlyMathematicsExcluded=True,excludedCheckerTopics=['좌표·벡터·삼각함수·순열 전수 검산','마방진 줄 합 증명'])
