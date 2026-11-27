"""Explicit learner-facing parameter domains; numbers are never executed as code."""
import math

class ParameterError(ValueError):
 def __init__(self,message,fields=None):super().__init__(message);self.fields=fields or{}

def number(key,label,lo,hi,default,step=1):return dict(key=key,label=label,kind='number',min=lo,max=hi,step=step,default=default)
def choice(key,label,options,default):return dict(key=key,label=label,kind='select',options=[dict(value=a,label=b)for a,b in options],default=default)
def mask(key,label,cells,default):return dict(key=key,label=label,kind='grid'if cells==9 else'digits',min=1,max=2**cells-1,default=default,cells=cells)
def select(key,label,values,default):return choice(key,label,[(v,str(v))for v in values],default)
F={
 'UA37':[number('columns','가로 점 수',3,4,4),number('area','넓이',.5,3,2,.5)],
 'GP01':[choice('picture','그림',[('boat','배'),('robot','로봇'),('train','기차')],'boat')],
 'SP01':[choice('sides','면의 모양',[(3,'정삼각형'),(4,'정사각형'),(5,'정오각형'),(6,'정육각형')],3)],
 'UL43':[number('count','작은 원 수',2,6,3),number('radius','큰 원의 반지름(cm)',2,30,15)],
 'FC18':[number('points','원 위의 점 수',4,8,8)],
 'CAL09':[number('dividend','나누어지는 수',100,999,582),number('divisor','나누는 수',2,9,7)],
 'OP12':[number('a','첫째 주사위',1,6,2),number('b','둘째 주사위',1,6,2),number('c','셋째 주사위',1,6,3)],
 'NS20':[number('lower','처음 수',1,30,11),number('upper','마지막 수',2,50,32)],
 'NC12':[number('n1','첫째 수',1,39,11),number('n2','둘째 수',1,39,16),number('n3','셋째 수',1,39,27),number('n4','넷째 수',1,39,34)],
 'NS21':[number('lower','처음 수',1,9,3),number('upper','마지막 수',10,40,26)],
 'NS22':[number('lower','처음 수',1,9,4),number('upper','마지막 수',10,25,18),number('speed','숫자 한 글자 인쇄(초)',1,3,3),number('rest','수 사이의 휴식(초)',1,3,1)],
 'VN08':[choice(k,label,[(x,lab)for x,lab in[('RL','빨강·큰 원'),('RS','빨강·작은 원'),('BL','파랑·큰 원'),('BS','파랑·작은 원')]],default)for k,label,default in[('cardA','가','RS'),('cardB','나','RL'),('cardC','다','BS')]],
 'TM13':[number('hour','출발 시각의 시',1,12,7),select('minute','도착 시각의 분',[0,10,20,30,40,50],40),select('durationA','걷는 시간(분)',list(range(5,61,5)),35),select('durationB','쉬는 시간(분)',list(range(10,61,10)),20),choice('order','문장 순서',[(i,label)for i,label in enumerate(['시각·시간·시각·시간','시간·시각·시간·시각','시각·시각·시간·시간','시간·시간·시각·시각','시각·시간·시간·시각','시간·시각·시각·시간'])],2)],
 'NG02':[number('target','목표 길이(cm)',4,25,22)],
 'UL40':[number('unitA','1A의 길이(cm)',1,5,4),number('unitB','1B의 길이(cm)',2,6,5)],
 'SQ27':[number('factor','구구단',2,9,8)],
 'FC19':[number('levels','점판 줄 수',3,4,3),number('cut','맨 위에서 뺄 점 수',0,2,1)],
 'PT08':[number('size','삼각형의 짧은 변(cm)',1,5,5)],
 'TL03':[select(k,label,[3,4,5,6,8,10,12],value)for k,label,value in[('p1','첫째 정다각형의 변 수',4),('p2','둘째 정다각형의 변 수',6),('p3','셋째 정다각형의 변 수',8),('p4','넷째 정다각형의 변 수',10)]],
 'UA38':[number('width','바닥의 가로(cm)',2,10,5),number('height','바닥의 세로(cm)',2,8,3)],
 'NC13':[number('factor','카드의 수를 늘리는 배수',1,4,3),number('offset','카드마다 더할 수',0,5,2)],
 'LG08':[choice('message','문장',[(0,'함께풀면신이난다'),(1,'생각하면길이보여'),(2,'오늘공부재미있다')],0),choice('rows','표의 줄 수',[(2,'2줄 × 4칸'),(4,'4줄 × 2칸')],4)],
 'CT12':[number('teams','팀 수',3,12,9)],
 'RT07':[number('count','맞닿은 원 수',1,6,6)],
 'AG31':[select('angle','읽을 각의 크기(°)',list(range(10,171,10)),100)],
 'SP02':[choice('net','전개도 모양',[(0,'옆으로 이어진 모양'),(1,'아래로 이어진 모양')],1),choice('turn','전개도 방향',[(0,'처음'),(1,'한 번 돌리기'),(2,'두 번 돌리기'),(3,'세 번 돌리기')],3)],
 'PT09':[choice('inventory','쓸 조각',[(0,'정사각형 1개·삼각형 2개'),(1,'정사각형 2개·삼각형 1개')],1),number('size','정사각형 한 변(cm)',1,4,2)],
 'DS07':[number('factor','면의 수를 늘리는 배수',1,3,3),number('offset','면마다 더할 수',0,5,2),choice('turn','전개도 방향',[(0,'처음'),(1,'한 번 돌리기'),(2,'두 번 돌리기'),(3,'세 번 돌리기')],1)],
 'TR11':[mask('digits','보기로 쓸 숫자',10,1023)],
 'TR14':[number('steps','90°씩 돌리는 횟수',4,28,26)],
 'TR13':[number('width','삼각형의 가로 비율',1,4,4),number('height','삼각형의 세로 비율',1,4,3)],
 'TR12':[mask('mask','처음 색칠할 칸',9,33),number('turns','90°씩 돌리는 횟수',1,3,2)],
 'AG32':[select(k,label,list(range(15,166,15)),val)for k,label,val in[('a','가의 각(°)',75),('b','나의 각(°)',90),('c','다의 각(°)',105)]],
 'GP02':[choice('board','점판',[(0,'계단 모양'),(1,'네 꼭짓점과 가운데'),(2,'오른쪽에 모인 점'),(3,'가로 3개·세로 3개'),(4,'가로 4개·세로 3개')],4)],
 'FC20':[number('height','위쪽 점의 높이',1,5,5)],
 'FC21':[select('width','직사각형 가로',[2,4,6,8],8),select('height','직사각형 세로',[2,4,6],6)],
 'GP03':[choice('claim','살펴볼 주장',[(0,'마름모와 정사각형'),(1,'이등변삼각형과 정삼각형'),(2,'사다리꼴과 직사각형')],1)],
 'FC22':[choice(key,label,[(0,'정사각형'),(1,'직사각형'),(2,'마름모'),(3,'평행사변형')],value)for key,label,value in[('shapeA','가',2),('shapeB','나',0),('shapeC','다',2)]],
 'FC23':[number('top','윗줄 점 수',2,4,4),number('bottom','아랫줄 점 수',2,4,2)],
 'FC24':[number('points','원 위의 점 수',3,8,8)],
 'QR33':[number('red','파랑 1개에 필요한 빨강',2,5,4),number('blue','초록 1개에 필요한 파랑',2,5,3),number('green','상자 1개에 필요한 초록',2,5,3)],
 'BL05':[number('ratio','사과 1개와 같은 무게의 귤',2,5,5),number('apples','왼쪽 사과 수',1,4,3),number('oranges','오른쪽 귤 수',1,20,19)],
 'OP13':[number('a','첫째 수',1,9,5),number('b','둘째 수',2,5,4),number('c','셋째 수',2,9,7),number('d','넷째 수',1,8,3)],
 'MG13':[number('first','처음 쓸 수',1,9,6),choice('direction','다음 칸의 방향',[(1,'오른쪽 위'),(-1,'왼쪽 위')],-1)]}
assert len(F)==44

NOTES={
 'UA37':'세로는 3점입니다. 넓이는 0.5씩 바꾸며 점판에서 만들 수 있어야 합니다.',
 'CAL09':'세 자리 수÷한 자리 수이며 몫이 두 자리인 범위입니다. 나머지 0도 포함합니다.',
 'UL43':'작은 원의 반지름이 자연수가 되도록 큰 반지름이 원 수로 나누어져야 합니다.',
 'OP12':'이 단계에서는 음수 결과를 사용하지 않습니다. 가장 큰 눈은 나머지 두 눈의 합 이하여야 합니다.',
 'NG02':'먼저 하는 사람이 이기는 전략을 찾는 문항입니다. 목표가 3의 배수이면 이 요구에 맞지 않습니다.',
 'UL40':'1A가 1B보다 짧아야 합니다.',
 'TL03':'서로 다른 정다각형 네 종류를 고릅니다. 가능한 도형이 없는 보기도 만들 수 있습니다.',
 'BL05':'처음에는 균형이 맞지 않아야 하며, 추가할 귤은 1~9개 범위입니다.',
 'OP13':'넷째 수는 셋째 수보다 작아야 합니다. 세 결과는 양수로 서로 다릅니다.',
 'GP01':'검토한 세 그림과 구두 설명 기준을 사용합니다. 새 그림의 뜻을 자동 판정하지 않습니다.',
 'GP03':'검토한 세 주장과 반례 기준을 사용합니다. 자유롭게 쓴 주장을 자동 채점하지 않습니다.'}

def defaults(tid):return{x['key']:x['default']for x in F[tid]}
def validate(tid,parameters):
 if not isinstance(tid,str)or tid not in F:raise ParameterError('이 유형의 조건 입력은 아직 연결하지 않았습니다.')
 if not isinstance(parameters,dict):raise ParameterError('문항 조건을 항목별로 입력해 주세요.')
 allowed={x['key']for x in F[tid]}
 if set(parameters)-allowed:raise ParameterError('이 유형에서 지원하지 않는 조건이 포함되어 있습니다.')
 values=defaults(tid);values.update(parameters);errors={}
 for field in F[tid]:
  k=field['key'];v=values[k]
  if field['kind']=='select':
   if not any(type(v)==type(o['value'])and v==o['value']for o in field['options']):errors[k]='보기에서 골라 주세요.'
  elif field['kind']in['grid','digits']and(type(v)not in[int,float]or not math.isfinite(v)or v!=int(v)or not field['min']<=v<=field['max']):errors[k]='표시된 칸이나 숫자를 한 개 이상 골라 주세요.'
  elif type(v)not in[int,float]or not math.isfinite(v):errors[k]='숫자로 입력해 주세요.'
  elif not field['min']<=v<=field['max']:errors[k]=f'{field["min"]}~{field["max"]} 범위로 입력해 주세요.'
  elif abs((v-field['min'])/field.get('step',1)-round((v-field['min'])/field.get('step',1)))>1e-9:errors[k]=f'{field.get("step",1)} 간격으로 입력해 주세요.'
  elif field.get('step',1)==1:values[k]=int(v)
 if errors:raise ParameterError('입력한 조건을 확인해 주세요.',errors)
 p=values
 def need(ok,message,keys):
  if not ok:raise ParameterError(message,{k:message for k in keys})
 if tid=='UA37':need(p['area']<=p['columns']-1,'이 점판에서 만들 수 있는 삼각형의 넓이를 입력해 주세요.',['area'])
 if tid=='UL43':need(p['radius']%p['count']==0,NOTES[tid],['radius','count'])
 if tid=='CAL09':need(10<=p['dividend']//p['divisor']<=99,NOTES[tid],['dividend','divisor'])
 if tid=='OP12':need(2*max(p.values())<=sum(p.values()),NOTES[tid],list(p))
 if tid in['NS20','NS21','NS22']:need(p['lower']<=p['upper'],'마지막 수는 처음 수 이상이어야 합니다.',['lower','upper'])
 if tid=='NG02':need(p['target']%3!=0,NOTES[tid],['target'])
 if tid=='UL40':need(p['unitA']<p['unitB'],NOTES[tid],['unitA','unitB'])
 if tid=='TL03':need(len(set(p.values()))==4,NOTES[tid],list(p))
 if tid=='BL05':need(1<=abs(p['ratio']*p['apples']-p['oranges'])<=9,NOTES[tid],list(p))
 if tid=='OP13':need(p['d']<p['c'],NOTES[tid],['c','d'])
 return values

def export_schema(names):
 return dict(schema='soma-parameter-schema/v1',types=[dict(typeId=tid,name=names[tid],fields=fields,note=NOTES.get(tid,'표시한 범위에서 조건을 입력해 주세요.'))for tid,fields in F.items()],freeTextClaimsOrPicturesAccepted=False,automaticStudentScoringApproved=False)
