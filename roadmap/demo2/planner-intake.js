/* Compact intake backed by the first demo. Source curriculum stays in DemoContent. */
(function(global){
'use strict';
const D=global.DemoContent,P=global.Planner;
const thinking=['킨더팩토','키즈팩토','초등팩토','PRE 1031','1031 입문','1031 초급'];
/* 연산은 교재와 상관없이 '어느 학년·학기 교과 연산까지 혼자 하는지'로 고른다(원장 2026-11-11).
   학기별 주제는 넘버스 오브 매직 data/placement-books.js의 기적의 계산법 2021판 권별 공식 주제(한 권 = 한 학기)를 따른다.
   값은 예전과 같은 '기적의 계산법 N권'(N = 학기 순서)이라 저장된 답과 계획 계산은 그대로다. */
const calc=[['소마셈 K','수 가르기·모으기'],
 ['기적의 계산법 1권','1-1 · 첫 덧셈·뺄셈 · 두 자리 수 기초'],['기적의 계산법 2권','1-2 · 10 묶기 · 받아올림·받아내림'],
 ['기적의 계산법 3권','2-1 · 두 자리 덧셈·뺄셈 · 구구단'],['기적의 계산법 4권','2-2 · 구구단 종합 · 세 자리 덧셈·뺄셈'],
 ['기적의 계산법 5권','3-1 · 한 자리 수로 곱하기 · 첫 나눗셈'],['기적의 계산법 6권','3-2 · 두 자리 수 곱셈 · 한 자리 수로 나누기'],
 ['기적의 계산법 7권','4-1 · 큰 자연수 곱셈 · 두 자리 수로 나누기'],['기적의 계산법 8권','4-2 · 같은 분모 분수 · 소수 덧셈·뺄셈'],
 ['기적의 계산법 9권','5-1 · 약수·배수 · 약분·통분 · 분수 덧셈·뺄셈'],['기적의 계산법 10권','5-2 · 혼합 계산 · 분수·소수 곱셈'],
 ['기적의 계산법 11권','6-1 · 분수·소수 나눗셈'],['기적의 계산법 12권','6-2 · 비·비례식 · 중학 연결']];
const calcChoices=(group,current)=>calc.filter(([v],i)=>(group==='preschool'?i<=4:i>=1)||v===current);
const schoolBooks=['디딤돌 기본+응용','디딤돌 응용','원리해설','개념원리','쎈','RPM','개념+유형 라이트','개념+유형 파워','개념응용 · 최상위','개념응용 · 최상위라이트'];
const highSubjects=['공통수학1','공통수학2','대수','미적분Ⅰ','확률과 통계','미적분Ⅱ','기하'];
const highSubjectLabel=v=>v==='대수'?'대수 · 구 수학Ⅰ 주요 내용 대응':v==='미적분Ⅰ'?'미적분Ⅰ · 구 수학Ⅱ 주요 내용 대응':v;
const highSubjectHelp='2022 개정 과목명입니다. 대수는 구 수학Ⅰ, 미적분Ⅰ은 구 수학Ⅱ의 주요 내용에 대응하지만 범위·구성이 같은 과정은 아닙니다. 교재의 교육과정과 목차를 확인하세요.';
const highBook=v=>['기본정석','실력정석','개념원리 고등','수학의 정석','쎈 고등','RPM 고등','고쟁이','숨마쿰라우데 고등','학교 지정 교재'].includes(v);
const bookList=(course,axis)=>course==='foreign'?['학교 지정 교재']:course==='high'?(axis==='deep'?['실력정석','고쟁이','숨마쿰라우데 고등','학교 지정 교재','쎈 고등','RPM 고등','수학의 정석','기본정석']:['기본정석','개념원리 고등','쎈 고등','RPM 고등','수학의 정석','학교 지정 교재']):(axis==='deep'?deepBooks:schoolBooks).filter(v=>middleBook(v)===(course==='mid'));
const deepBooks=['최상위 S','최상위 수학','개념응용 · 최상위','A급','RPM'];
/* '개념응용 · 최상위'와 '개념응용 · 최상위라이트'는 실제 교재 이름이 아니다(원장 2026-11-11). 저장된 답은 계속 읽고, 새로 고르는 선택지와 예시에는 보이지 않는다. */
const pairedLabel=v=>/^개념응용 · 최상위/.test(v);
const choosable=(list,current)=>list.filter(v=>!pairedLabel(v)||v===current);
const special=v=>['none','unknown'].includes(v);
const middleBook=v=>['원리해설','개념원리','쎈','RPM','개념+유형 라이트','개념+유형 파워','개념응용 · 최상위라이트','A급'].includes(v);
const stageOptions=middle=>middle?P.MID.map((t,i)=>[String(i+14),t.replace(/중(\d)-(\d)/,'중등 $1학년 $2학기')]):Array.from({length:12},(_,i)=>[P.SEM(i+1),`초등 ${Math.ceil((i+1)/2)}학년 ${i%2+1}학기`]);
const absent=v=>v==='none'?'아직 시작 전':v==='unknown'?'잘 모르겠어요':'미선택';
const noThinking=a=>special(a.thinkingExperience);
const effective=a=>({...a,schoolBook:special(a.schoolCourse)?a.schoolCourse:a.schoolBook,deepBook:special(a.deepCourse)?a.deepCourse:a.deepBook});
const courseOptions=[['elem','초등 과정'],['mid','중등 과정'],['high','고등 과정'],['none','아직 시작 전'],['unknown','잘 모르겠어요']];
const schoolChoice=a=>special(a.schoolBook)?a.schoolBook:a.school;
const progress=[['progress','지금 하는 중'],['done','끝냈어요']];
// Grade is the current school year, including its following January/February.
// Legacy ages are read without rewriting their saved values.
const currentGrade=a=>/^(?:[1-9]|1[0-2])$/.test(a.grade||'')&&(a.gradeInput==='current'||!a.age||a.age==='older');
function gradeChoice(a,fields){
 if(fields.internationalCalendar)return 'international';
 if(a.grade==='pre'||currentGrade(a))return a.grade;
 if(a.age&&a.age!=='older'){const g=gradeForAge(a.age,fields.mon);return g<1?'pre':g<=12?String(g):undefined;}
 return undefined;
}
function age(a,fields){if(currentGrade(a))return 5+Math.floor(P.mOf(+a.grade,+fields.mon)/12);if(a.age&&a.age!=='older')return +a.age;if(a.age==='older')return 10;return 5+Math.floor(P.mOf(+fields.grade,+fields.mon)/12);}
function labelMonth(m){if(m>=144){const n=Math.floor(m/12)-11,mo=m%12+1,g=n-(mo<3?1:0);return (g<1?'중3':g<=3?'고'+g:'고교 이후')+' '+mo+'월';}return m>=38?P.label(m):D.labelMonth(m);}
function studentLabel(a,fields){const sp=fields.schoolContext;if(sp?.format&&sp.format!=='kr'){const f=sp.format==='grade'?'Grade':sp.format==='year'?'Year':'학교 학년';return sp.level?(sp.format==='other'||sp.format==='unknown'?({primary:'초등 단계',middle:'중등 단계',high:'고등 단계',unknown:'학교 단계 확인 전'})[sp.level]||'학교 단계 확인 전':f+' '+sp.level):'학교 학년 확인 전';}const g=gradeChoice(a,fields);return g==='pre'?(a.age&&a.age!=='older'?'미취학 · '+a.age+'세':'미취학'):g?(+g<=6?'초'+g:+g<=9?'중'+(+g-6):'고'+(+g-9)):'미선택';}
// Wording follows the confirmed school stage, independently of course progress and L level.
function audience(a,fields){
 if(fields.internationalCalendar)return 'general';
 const g=gradeChoice(a,fields);
 return g==='pre'?'preschool':g&&+g<=3?'lower':g&&+g<=6?'upper':g&&+g<=9?'middle':g?'high':'general';
}
function learningLabels(a,fields){
 const group=audience(a,fields),young=['preschool','lower'].includes(group);
 return {grade:group==='preschool'?'나이':'학년',school:young?'교과 수학':'교과',deep:young?'심화 수학':'심화',deepBook:young?'심화 수학':'심화',thinking:young?'사고력 수학':'사고력',thinking1:young?'사고력 수학':'사고력',calc:young?'수와 계산':'연산'};
}
function gradeForAge(value,month){return +value-7-(+month<3?1:0);}
// Decisions use confirmed school grade and course, never a default age or level.
function seniorIntake(a,fields){const grade=gradeChoice(a,fields);return /^(?:[3-9]|1[0-2])$/.test(grade||'');}
function thinkingRequired(a,fields){
 const grade=gradeChoice(a,fields);
 if(grade==='pre'||grade==='1'||grade==='2')return true;
 if(!seniorIntake(a,fields))return null;
 if(['mid','high'].includes(a.schoolCourse))return false;
 if(a.schoolCourse==='none')return null;
 if(a.schoolCourse!=='elem'||!/^([1-6])-[12]$/.test(a.school||''))return null;
 return Number(a.school[0])<=5;
}
function order(a,fields){a=effective(a);
 const list=fields.internationalCalendar?[]:['grade'];if(gradeChoice(a,fields)==='pre')list.push('age');
 const addThinking=()=>{if(thinkingRequired(a,fields)!==true)return;list.push('thinkingExperience');if(!noThinking(a)){list.push('thinking');if(a.thinking==='advanced')list.push('compExact');if(a.thinking==='PRE 1031')list.push('preDone');list.push('thinkingStatus');}};
 const senior=seniorIntake(a,fields);
 if(!senior)addThinking();
 /* 원장님 2026-11-11: 교과 과정 → 학년·학기(과목) → 교재 → 상태, 그다음 심화도 같은 순서로 묻는다.
    교과 과정만 고른 채 심화 과정으로 넘어갔다가 교재를 몰아 물으면 어느 쪽 교재인지 헷갈려 잘못 고른다. 학년과 관계없이 같은 순서. */
 const stageKey=c=>['high','foreign'].includes(c)?'schoolHigh':c==='mid'?'schoolExact':'school';
 list.push('schoolCourse');if(!special(a.schoolCourse)&&a.schoolCourse){list.push(stageKey(a.schoolCourse),'schoolBook');if(!special(a.schoolBook))list.push('schoolStatus');}
 list.push('deepCourse');if(!special(a.deepCourse)&&a.deepCourse){list.push('deepStage','deepBook');if(!special(a.deepBook))list.push('deepStatus');}
 if(a.deepCourse==='high'){list.push('deepExtra');if(a.deepExtra==='yes')list.push('deepExtraStage','deepExtraBook','deepExtraStatus');}
 list.push('calc');if(a.calc==='advanced')list.push('calcExact');if(a.calc==='high')list.push('calcHigh');if(!special(a.calc))list.push('calcStatus');
 if(senior)addThinking();
 const y=age(a,fields);if(y>=6&&y<=9&&['A','B'].includes(fields.band))list.push('hw');if(+gradeChoice(a,fields)<7||gradeChoice(a,fields)==='pre'||!gradeChoice(a,fields))list.push('gifted');return list;
}
// Curriculum standards come from the existing four BAND rules and buildD.
// The broader book guide is a reference list, not a replacement for those rules.
/* 질문의 예시는 실제 교재 이름만 쓴다. 영과고형(D)의 계획 줄 이름은 standardBook이 그대로 맡는다. */
function exampleBook(band,course,axis){if(band==='D'&&(course==='elem'||course==='mid')&&!(course==='mid'&&axis==='deep'))return course==='mid'?'개념원리 · 최상위수학 중학':axis==='school'?'디딤돌 응용':'최상위 수학';return standardBook(band,course,axis);}
function standardBook(band,course,axis){
 if(course==='foreign')return '학교 지정 교재 · 현재 과목·판본 확인';
 if(course==='high')return axis==='school'?'기본정석(개념) + 쎈(유형) 병행':'실력정석 · 고쟁이 등에서 현재 풀이에 맞춰 선택';
 if(course==='mid')return axis==='school'?P.BAND[band].midBook:band==='C'?'RPM · 응용 반복':P.BAND[band].deep;
 return band==='D'?'개념응용 · 최상위':axis==='school'?'디딤돌 기본+응용 · 디딤돌 응용':'최상위 S';
}
function questions(a,fields){const q=baseQuestions(a,fields);a=effective(a);
 /* 교재 질문에 앞에서 고른 과정을 붙여 어느 쪽 교재인지 분명히 한다. */
 const picked=(key,v)=>special(v)?'':(q[key]?.[2]||[]).find(([id])=>id===v)?.[1]?.split(' · ')[0]||'';
 const sk=['high','foreign'].includes(a.schoolCourse)?'schoolHigh':a.schoolCourse==='mid'?'schoolExact':'school';
 const sl=picked(sk,a[sk]),dl=picked('deepStage',a.deepStage);
 if(sl)q.schoolBook=[sl+' 교과는 어떤 교재로 공부하나요?',...q.schoolBook.slice(1)];
 if(dl)q.deepBook=[dl+' 심화는 어떤 교재로 공부하나요?',...q.deepBook.slice(1)];
 return q;}
function baseQuestions(a,fields){a=effective(a);const curriculum=global.PlannerCollegeData?.CURRICULA[fields.schoolContext?.curriculum],mathOptions=fields.internationalCalendar?(curriculum?.math?.length?curriculum.math:['학교 수학 · 과목 확인 전']):highSubjects;const allMath=[...new Set([...highSubjects,...Object.values(global.PlannerCollegeData?.CURRICULA||{}).flatMap(c=>c.math)])];const retained=(base,value)=>[...new Set([...base,...(allMath.includes(value)?[value]:[])])];const schoolMath=retained(a.schoolCourse==='foreign'?mathOptions:highSubjects,a.schoolHigh),deepMath=retained(a.deepCourse==='foreign'?mathOptions:highSubjects,a.deepStage),calcMath=retained([...mathOptions,...highSubjects],a.calcHigh);const courses=fields.internationalCalendar?[['foreign','현재 학교 교육과정'],...courseOptions]:courseOptions;const deepHigh=a.deepCourse?a.deepCourse==='high':highBook(a.deepBook),deepMiddle=a.deepCourse?a.deepCourse==='mid':middleBook(a.deepBook);const highLearning=a.schoolCourse==='high'||a.deepCourse==='high',older=age(a,fields)>=8||highLearning,group=audience(a,fields),young=['preschool','lower'].includes(group);return {
 age:['아이는 지금 몇 살인가요?','미취학 아동의 한국 나이를 골라 주세요.',[4,5,6,7].map(v=>[String(v),v+'세']).concat(+fields.mon<3?[['8','8세 · 입학 전']]:[])],
 grade:['아이는 지금 몇 학년인가요?','현재 학년을 골라 주세요.',[['pre','미취학'],...Array.from({length:12},(_,i)=>[String(i+1),i<6?'초'+(i+1):i<9?'중'+(i-5):'고'+(i-8)])]],
 thinkingExperience:['사고력 수학을 공부한 적이 있나요?',young?'규칙 찾기나 도형 문제를 생각하며 푸는 수학이에요.': '학원 수업과 집에서 공부한 경험을 모두 포함해요.',[['yes','네, 있어요'],['none','아직 없어요'],['unknown','잘 모르겠어요']]],
 thinking:['사고력은 어디까지 했나요?','가장 최근에 공부한 과정을 골라 주세요.',thinking.map(v=>[v,v]).concat(older?[['advanced','그 이후 과정']]:[])],
 thinkingStatus:['이 사고력 과정은 끝냈나요?','지금 공부 중인지, 끝냈는지 골라주세요.',progress],
 preDone:['초등팩토는 끝냈나요?','초등팩토를 마쳤는지 함께 확인할게요.',[['1','네'],['0','아니요']]],
 schoolCourse:['현재 공부하고 있는 수학 진도는 무엇인가요?',(group==='preschool'?'초등·중등 교과서에서 배우는 수학이에요. ':young?'학교에서 배우는 교과 수학이에요. ':'선행을 포함한 교과 진도예요. ')+'과정을 고르면 학년·학기, 교재 순서로 이어서 물어요. 심화는 그다음에 따로 물어요.',courses],
 schoolBook:['교과는 어떤 교재로 공부하나요?',`이 과정의 교재 예: ${exampleBook(fields.band,a.schoolCourse,'school')}`,choosable(bookList(a.schoolCourse,'school'),a.schoolBook).map(v=>[v,v==='수학의 정석'?'수학의 정석 · 기본/실력 확인 전':v==='기본정석'?'기본정석 · 개념 학습':['쎈','RPM'].includes(v)?v+' · 유형 학습':v])],
 school:['교과는 어느 과정인가요?','지금 공부하는 교과의 학년과 학기를 골라 주세요.',stageOptions(false)],
 schoolHigh:[fields.internationalCalendar?'현재 수학 교재의 과목은요?':'현재 고등 수학 과목은요?',(fields.internationalCalendar?'학교 교육과정의 과목명을 기준으로 확인하세요.':highSubjectHelp)+' 과목 이수 순서는 학교 교육과정과 실제 선수학습을 확인합니다.',schoolMath.map(v=>[v,highSubjectLabel(v)])],
 schoolStatus:['이 교과 교재는 끝냈나요?',a.schoolCourse==='high'?'선택한 교재의 상태입니다. 개념 교재 완료와 쎈 유형 완료는 따로 기록합니다.':'지금 공부 중인지, 끝냈는지 골라주세요.',progress],
 deepCourse:[young?'심화 수학은 어느 과정을 공부하나요?':'심화는 어느 과정을 공부하나요?',young?'배운 내용을 써서 더 깊이 생각하는 문제를 풀어요. 아직 시작 전도 고를 수 있어요.':'아직 시작하지 않았다면 아래에서 골라주세요.',courses],
 deepBook:['심화는 어떤 교재로 공부하나요?',`이 과정의 교재 예: ${exampleBook(fields.band,a.deepCourse,'deep')}`,choosable(bookList(a.deepCourse,'deep'),a.deepBook).map(v=>[v,v==='RPM'?'RPM · 응용 반복':['쎈 고등','RPM 고등'].includes(v)?v+' · 유형 학습(기존 기록)':v==='수학의 정석'?'수학의 정석 · 기본/실력 확인 전':v==='기본정석'?'기본정석 · 개념 보완':v])],
 deepStage:[deepHigh?'현재 심화하는 과목은 무엇인가요?':'심화는 어느 과정인가요?',deepHigh?(fields.internationalCalendar?'학교 교육과정의 과목명을 기준으로 확인하세요.':highSubjectHelp)+' 지금 공부 중인 심화 과목을 고릅니다. 선행 과목과 달라도 됩니다. 이후 심화는 다음 계획으로 구분하며, 이 선택을 바꾸면 현재 심화 기록이 바뀝니다.':'지금 심화하는 학년과 학기를 골라 주세요.',deepHigh?deepMath.map(v=>[v,highSubjectLabel(v)]):stageOptions(deepMiddle)],
 deepExtra:['동시에 공부하는 다른 고등 심화 과목도 있나요?','앞서 입력한 심화는 그대로 두고, 별도로 진행하는 심화 하나를 추가합니다.',[['no','아니요'],['yes','네, 다른 과목도 함께 해요'],['unknown','아직 확인 전이에요']]],
 deepExtraStage:['함께 공부하는 다른 심화 과목은 무엇인가요?',highSubjectHelp+' 앞서 입력한 심화와 다른 과목을 고릅니다.',highSubjects.filter(v=>v!==a.deepStage).map(v=>[v,highSubjectLabel(v)])],
 deepExtraBook:['추가 심화는 어떤 교재로 공부하나요?','기존 심화 교재를 바꾸지 않고 별도로 기록합니다.',['실력정석','고쟁이','숨마쿰라우데 고등','학교 지정 교재'].map(v=>[v,v])],
 deepExtraStatus:['추가 심화 교재는 현재 어느 상태인가요?','이 과목의 실제 진행 상태와 완료 분량만 입력합니다.',progress],
 deepStatus:['이 심화 과정은 끝냈나요?','지금 공부 중인지, 끝냈는지 골라주세요.',progress],
 calc:[highLearning?'별도로 공부하는 연산은 어느 범위인가요?':young?'수와 계산은 어디까지 공부했나요?':'연산은 어느 학기까지 되나요?',highLearning?'고등 선행과 연산 범위는 다를 수 있습니다. 초등 후반·중등 연산은 그 이후 단계에서, 고등 계산·식 변형은 별도로 고르세요. 범위를 모르면 잘 모르겠어요를 선택합니다.':group==='preschool'?'수를 나누고 모으기, 덧셈·뺄셈 등을 말해요.':young?'혼자 할 수 있는 교과 연산의 학년·학기를 골라주세요. 소마셈·원리셈·두뇌로·구몬 등 어떤 교재로 하든 같은 기준이에요.':'도움 없이 혼자 할 수 있는 교과 연산의 학년·학기를 고르세요. 소마셈·원리셈·두뇌로·구몬 등 어떤 교재로 하든 같은 기준으로 고르면 됩니다.',calcChoices(group,a.calc).map(([v,t])=>[v,t]).concat(older?[['advanced','중학 연산 이후']]:[]).concat([['high','고등 계산·식 변형 연습'],['none','아직 시작 전'],['unknown','잘 모르겠어요']])],
 calcHigh:[fields.internationalCalendar?'계산·식 변형은 어느 과목에서 연습하나요?':'계산·식 변형은 어느 고등 과목에서 연습하나요?',(fields.internationalCalendar?'학교 교육과정의 과목명을 기준으로 확인하세요.':highSubjectHelp)+' 현재 교과·심화와 별개로 실제 연습하는 범위를 고릅니다.',calcMath.map(v=>[v,highSubjectLabel(v)])],
 calcStatus:[(calc.find(c=>c[0]===a.calc)?.[1]||'이 연산')+' 단계는요?','지금 연습하는 중인지, 끝냈는지 골라 주세요.',progress],
 compExact:['지금 사고력 교재는요?','현재 과정 하나만 골라 주세요.',P.COMP.map((c,i)=>[String(i),c[0]])],
 schoolExact:['교과는 어느 과정인가요?','지금 공부하는 교과의 학년과 학기를 골라 주세요.',[['13','초등 계통 대수심화'],...stageOptions(true)]],
 calcExact:['지금 연산 교재는요?','현재 연습하는 연산·도형 교재를 고릅니다. 교과 선행 과목과 같을 필요는 없습니다. 초등 연산은 앞 질문에서 권별로 고릅니다.',P.CALC.map((c,i)=>[String(i),c[0]]).filter(([i])=>+i>=12||i===a.calcExact)],
 hw:['생각하는 황소도 고려하고 계세요?','나중에 바꿔도 괜찮아요.',[['1','네'],['0','아니요'],['pending','아직 고민 중']]],
 gifted:['영재원도 고려하고 계세요?','나중에 바꿔도 괜찮아요.',[['1','네'],['0','아니요'],['pending','아직 고민 중']]]
 };}
function sourceInput(a,fields){a=effective(a);
 const thinkingValues=[];
 if(!noThinking(a)&&thinking.includes(a.thinking)&&a.thinkingStatus&&!fields.pendingStatus?.thinkingStatus){thinkingValues.push(a.thinking+' '+(a.thinkingStatus==='done'?'완료':'진행 중'));if(a.thinking==='PRE 1031'&&a.preDone==='1')thinkingValues.push('초등팩토 완료');}
 return {age:age(a,fields),month:+fields.mon,thinking:thinkingValues,progress:Object.fromEntries([['school','schoolStatus'],['thinking1','thinkingStatus'],['calc','calcStatus']].flatMap(([key,status])=>{const v=progressValue(a,status);return a[status]==='progress'&&v?[[key,v.done/v.total]]:[];})),
  school:schoolChoice(a)&&!middleBook(a.schoolBook)&&schoolChoice(a)!=='advanced'&&!['unknown'].includes(schoolChoice(a))?(schoolChoice(a)==='none'?'교과 진행 안 함':a.school+' 진행 중'):undefined,
  calcRadio:a.calc&&a.calc!=='advanced'&&!special(a.calc)&&a.calcStatus?a.calc+' '+(a.calcStatus==='done'?'완료':'진행 중'):undefined};
}

function sourceMode(a,fields){a=effective(a);if(fields.internationalCalendar)return true;if(!gradeChoice(a,fields))return false;return highBook(a.schoolBook)||+gradeChoice(a,fields)>=10||noThinking(a)||special(a.calc)||special(a.schoolBook)||(a.schoolStatus==='done'&&+a.schoolExact===19&&middleBook(a.schoolBook))||(a.calc==='advanced'&&+a.calcExact===P.CALC.length-1&&a.calcStatus==='done')||(a.thinking==='advanced'&&+a.compExact===P.COMP.length-1&&a.thinkingStatus==='done')||gradeForAge(age(a,fields),fields.mon)<1||['킨더팩토','키즈팩토'].includes(a.thinking)||schoolChoice(a)==='none'||(a.calc==='소마셈 K'&&a.calcStatus!=='done');}
function nextComp(index,band){let n=index+1;while(band!=='A'&&n<P.COMP.length&&P.COMP[n][2]==='skip')n++;return Math.min(n,P.COMP.length-1);}
// Progress is tied to a particular book/course. Calendar rows use whole months.
function progressKey(status){return status.replace(/Status$/,'Progress');}
function progressCourse(a,status){const keys={schoolStatus:['schoolCourse','schoolBook','school','schoolExact','schoolHigh'],deepStatus:['deepCourse','deepBook','deepStage'],deepExtraStatus:['deepExtra','deepExtraStage','deepExtraBook'],thinkingStatus:['thinking','compExact','preDone'],calcStatus:['calc','calcExact','calcHigh']}[status]||[];return keys.map(k=>a[k]||'').join('|');}
function progressValue(a,status){const v=a[progressKey(status)];return v&&v.course===progressCourse(a,status)&&Number.isFinite(v.done)&&Number.isFinite(v.total)&&v.total>0&&v.done>=0&&v.done<v.total?v:null;}
function remainingMonths(a,status,full){const v=progressValue(a,status);return Math.max(1,Math.ceil(full*(v?1-v.done/v.total:.5)));}
function progressText(a,status){const v=progressValue(a,status);return v?(v.estimated?'남은 범위 확인 전':v.unit==='percent'?'약 '+Math.round(v.done/v.total*100)+'% 분량 진행 · 숙달 아님':v.total+' '+(v.unit==='session'?'회':v.unit==='page'?'쪽':'단원')+' 중 '+v.done+' 완료'):'';}
function fieldChanges(a,fields,key){a=effective(a);
 const result={};const recalc=['band','speed'].includes(key),y=age(a,fields),g=gradeForAge(y,fields.mon);
 if(['age','grade'].includes(key)&&g>=1&&g<=12)result.grade=String(g);
 if(['school','schoolExact','schoolBook','schoolCourse','schoolStatus'].includes(key)||recalc){
  const n=middleBook(a.schoolBook)?+a.schoolExact:!special(a.school)&&a.school!=='advanced'&&a.school?2*(+a.school[0]-1)+(+a.school[2]):null;
  if(!fields.pendingStatus?.schoolStatus&&!special(a.schoolBook)&&Number.isInteger(n)&&n>=1&&n<=19){
   const len=n===13?4:n>=14?P.BAND[fields.band].midLen:fields.band==='C'?3:+fields.speed||2;
   const next=a.schoolStatus==='done'?Math.min(19,n+1):n;
   result.school=String(next);result.schoolLeft=String(a.schoolStatus==='done'?next===13?4:next>=14?P.BAND[fields.band].midLen:len:remainingMonths(a,'schoolStatus',len));
  }
 }

 if((['thinking','thinkingStatus','preDone','compExact'].includes(key)||recalc)&&!noThinking(a)&&a.thinkingStatus&&!fields.pendingStatus?.thinkingStatus){
   let n=a.thinking==='advanced'?+a.compExact:({'초등팩토':0,'PRE 1031':a.preDone==='1'?1:0,'1031 입문':2,'1031 초급':4})[a.thinking];
   if(Number.isInteger(n)){if(a.thinkingStatus==='done')n=nextComp(n,fields.band);result.comp=String(n);result.compLeft=String(a.thinkingStatus==='done'?P.COMP[n][1]:remainingMonths(a,'thinkingStatus',P.COMP[n][1]));}
 }
 if((['calc','calcStatus','calcExact'].includes(key)||recalc)&&!special(a.calc)&&a.calcStatus&&!fields.pendingStatus?.calcStatus){
   let n=a.calc==='advanced'?+a.calcExact:a.calc==='소마셈 K'?(a.calcStatus==='done'?1:null):parseInt(a.calc.match(/(\d+)권/)?.[1]||'',10)-1;
   if(Number.isInteger(n)){if(a.calcStatus==='done'&&a.calc!=='소마셈 K')n=Math.min(n+1,P.CALC.length-1);result.calc=String(n);result.calcLeft=String(a.calcStatus==='done'?(P.CALC[n][1]||(fields.band==='C'?5:+fields.speed||2)):remainingMonths(a,'calcStatus',P.CALC[n][1]||(fields.band==='C'?5:+fields.speed||2)));}
 }
 return result;
}
function additionalDeep(a,fields={}){
 if(a.deepCourse!=='high'||a.deepExtra!=='yes'||a.deepExtraStage===a.deepStage||!highSubjects.includes(a.deepExtraStage)||!['실력정석','고쟁이','숨마쿰라우데 고등','학교 지정 교재'].includes(a.deepExtraBook)||!['progress','done'].includes(a.deepExtraStatus)||fields.pendingStatus?.deepExtraStatus)return null;
 const p=progressValue(a,'deepExtraStatus');return {stage:a.deepExtraStage,book:a.deepExtraBook,done:a.deepExtraStatus==='done',fraction:a.deepExtraStatus==='done'?1:p&&!p.estimated?p.done/p.total:0};
}
function summary(a,fields){a=effective(a);const status=k=>fields.pendingStatus?.[k]?'상태 확인 전':a[k]==='done'?'완료':a[k]==='progress'?['진행 중',progressText(a,k)].filter(Boolean).join(' · '):'';
 return [{key:'grade',label:'학년',text:studentLabel(a,fields)},
 {key:'thinking',label:'사고력',text:noThinking(a)?(a.thinkingExperience==='none'?'공부한 경험 없음':'잘 모르겠어요'):(a.thinking==='advanced'?(P.COMP[+a.compExact]?.[0]||'이후 과정'):a.thinking||'미선택')+' '+status('thinkingStatus')},
 {key:'school',label:'교과',text:special(a.schoolBook)?absent(a.schoolBook):[a.schoolExact==='13'&&a.school==='advanced'?'':a.schoolBook||'',highBook(a.schoolBook)?a.schoolHigh||'과목 미선택':middleBook(a.schoolBook)||a.school==='advanced'?(+a.schoolExact<=12?P.SEM(+a.schoolExact):a.schoolExact==='13'?'초등 계통 대수심화':P.MID[+a.schoolExact-14]||'이후 과정'):a.school||'미선택',status('schoolStatus')].filter(Boolean).join(' ')},
 {key:'deepBook',label:'심화',text:special(a.deepBook)?absent(a.deepBook):a.deepBook?`${a.deepBook} ${highBook(a.deepBook)?a.deepStage||'과목 미선택':middleBook(a.deepBook)?P.MID[+a.deepStage-14]||'과정 미선택':a.deepStage||'과정 미선택'} ${status('deepStatus')}`:'미선택'},
 ...(a.deepCourse==='high'?[{key:'deepExtraBook',label:'추가 심화',text:additionalDeep(a,fields)?a.deepExtraBook+' '+a.deepExtraStage+' '+status('deepExtraStatus'):a.deepExtra==='no'?'동시 추가 심화 없음':'추가 심화 여부·과목 확인 전'}]:[]),
 {key:'calc',label:'연산',text:special(a.calc)?absent(a.calc):a.calc==='high'?(a.calcHigh||'고등 과목 확인 전')+' · 계산·식 변형 연습 '+status('calcStatus'):(a.calc==='advanced'?(P.CALC[+a.calcExact]?.[0]||'이후 단계'):calc.find(c=>c[0]===a.calc)?.[1]||'미선택')+' '+status('calcStatus')}];
}
// Each subject resolves independently. An original-only answer never replaces
// the other subjects with the original demo's limited curriculum.
function hasAnswer(a,fields,key){
 if(key==='deepStage'&&!seniorIntake(a,fields)&&a.deepBook&&a.deepCourse&&!special(a.deepCourse)&&!bookList(a.deepCourse,'deep').includes(a.deepBook))return false;
 if(key==='deepExtra'&&a.deepExtra===undefined)return true; // Existing single-depth records remain valid.
 if(fields.pendingStatus?.[key])return false;const q=questions(a,fields)[key];return !!q&&q[2].some(([v])=>String(key==='grade'?gradeChoice(a,fields):a[key])===String(v));
}
function firstMissing(a,fields){return order(a,fields).find(k=>!hasAnswer(a,fields,k));}
function options(a,fields,overrides={}){a=effective(a);
 const value={band:fields.band||'B',grade:Math.max(1,gradeForAge(age(a,fields),fields.mon)),mon:+fields.mon,year:new Date().getFullYear(),school:1,schoolLeft:1,comp:0,compLeft:3,calc:1,calcLeft:1,speed:+fields.speed||2,hw:'none',hwDeep:false,hwMid:false,gifted:false,kmo:'switch',...fieldChanges(a,fields,'band'),...overrides};
 for(const key of ['grade','mon','year','school','schoolLeft','comp','compLeft','calc','calcLeft','speed'])value[key]=+value[key];return value;
}
function deepRow(a,fields,now){a=effective(a);
 if(highBook(a.deepBook))return null;
 if(!deepBooks.includes(a.deepBook)||!hasAnswer(a,fields,'deepStage')||!hasAnswer(a,fields,'deepStatus'))return null;
 const mid=middleBook(a.deepBook),first=mid?+a.deepStage:2*(+a.deepStage[0]-1)+(+a.deepStage[2]),last=mid?19:12;
 const duration=mid?P.BAND[fields.band].midLen:a.deepBook==='개념응용 · 최상위'?3:2,blocks=[];
 let t=now;
 for(let n=first;n<=last;n++){
  if(n===first&&a.deepStatus==='done')continue;
  const count=n===first?remainingMonths(a,'deepStatus',duration):duration;
  blocks.push([`${mid?P.MID[n-14]:P.SEM(n)} ${a.deepBook}`,t,t+count-1,duration]);t+=count;
  // Preserve the reported current book in C, without recommending an excluded course.
  if(fields.band==='C'&&a.deepBook==='A급')break;
 }
 return {key:'school2',label:'교과 심화',blocks,color:'#e0f2fe',lane:'수학'};
}
function unresolvedThinking(a){return !a.thinking||!['progress','done'].includes(a.thinkingStatus);}
function buildPlan(a,fields,overrides={}){a=effective(a);
 const o=options(a,fields,overrides),plan=P.build(o);
 if(highBook(a.schoolBook)||a.calc==='high')plan.rows=plan.rows.map(r=>(r.key==='school'&&highBook(a.schoolBook))||(r.key==='calc'&&a.calc==='high')?{...r,blocks:[]}:r);
 if(fields.band==='D'&&a.schoolBook&&!special(a.schoolBook)){const personal=P.build({...o,personalSchool:true});plan.rows=plan.rows.map(r=>r.key==='school'?personal.rows.find(x=>x.key==='school'):r);plan.mid=personal.mid;}
 if(a.schoolBook&&!special(a.schoolBook)){
  const row=plan.rows.find(r=>r.key==='school');
  row.blocks=row.blocks.map(b=>[b[0].replace(middleBook(a.schoolBook)?/원리해설|개념원리|개념응용 · 최상위라이트/:/디딤돌 (?:기본\+응용|응용)|개념응용 · 최상위(?!라이트)/g,a.schoolBook),...b.slice(1)]);
 }
 if(Object.hasOwn(a,'deepBook')){
  const row=deepRow(a,fields,plan.now)||{key:'school2',label:'교과 심화',blocks:[],color:'#e0f2fe',lane:'수학'};
  plan.rows=plan.rows.map(r=>r.key==='school2'?row:r);plan.independentDeep=true;
 }
 for(const [key,status]of [['school','schoolStatus'],['school2','deepStatus'],['comp','thinkingStatus'],['calc','calcStatus']])if(fields.pendingStatus?.[status])plan.rows=plan.rows.map(r=>r.key===key?{...r,blocks:[]}:r);
 if(noThinking(a)||unresolvedThinking(a))plan.rows=plan.rows.map(r=>r.key==='comp'?{...r,blocks:[]}:r);
 return plan;
}
function profile(a,fields,overrides={}){a=effective(a);
 if(fields.internationalCalendar){const summaries=summary(a,fields);return {ready:false,now:null,nowLabel:studentLabel(a,fields),rows:[['school','school'],['thinking1','thinking'],['deep','deepBook'],['calc','calc']].map(([key,label])=>({key,current:{shortText:summaries.find(x=>x.key===label)?.text||'확인 전',e:null},blocks:[],remaining:[],next:null})),comparison:{ready:false,levels:[],best:null}};}
 const original=D.buildProfile(sourceInput(a,fields)),now=original.now;
 if(!Number.isFinite(now))return original;
 const plan=buildPlan(a,fields,overrides),shift=now-plan.now,young=gradeForAge(age(a,fields),fields.mon)<1;
 const summaries=summary(a,fields),status={school:a.schoolStatus,thinking1:a.thinkingStatus,calc:a.calcStatus,deep:a.deepStatus};
 const rowKey=k=>k==='thinking1'?'comp':k==='deep'?'school2':k;
 const answerKey=k=>k==='thinking1'?'thinking':k==='deep'?'deepBook':k;
 const fromEngine=k=>{
  const bs=(plan.rows.find(r=>r.key===rowKey(k))?.blocks||[]).map(b=>({text:b[0],shortText:D.shortText(b[0]),s:b[1]+shift,e:b[2]+shift})).filter(b=>b.e>=now);
  const text=summaries.find(it=>it.key===answerKey(k))?.text||'';
  const done=status[k]==='done',current={shortText:text,e:done?now-1:bs[0]?.e??now,completed:done};
  return {key:k,current,blocks:bs,remaining:bs.map(b=>({...b,remainingStart:Math.max(now,b.s)})),next:done?bs[0]||null:bs.find(b=>b.s>now)||null};
 };
 const rows=['school','thinking1','calc'].map(k=>{
  const empty=fields.pendingStatus?.[({school:'schoolStatus',thinking1:'thinkingStatus',calc:'calcStatus'})[k]]||(k==='thinking1'?noThinking(a)||unresolvedThinking(a):k==='school'?special(a.schoolBook):special(a.calc));
  if(empty)return {key:k,current:{shortText:summaries.find(it=>it.key===answerKey(k))?.text||'',e:now},blocks:[],remaining:[],next:null};
  const source=k==='school'?(young&&!middleBook(a.schoolBook)&&a.school!=='advanced'):k==='thinking1'?young||['킨더팩토','키즈팩토'].includes(a.thinking):young||(a.calc==='소마셈 K'&&a.calcStatus!=='done');
  const row=original.rows.find(r=>r.key===k);
  if(source&&row){
   if(k==='school'&&a.schoolStatus==='done')return D.learningRow(k,{key:row.current.choiceKey,pos:'end'},now);
   const st=({school:'schoolStatus',thinking1:'thinkingStatus',calc:'calcStatus'})[k],v=progressValue(a,st);
   if(v&&status[k]!=='done'){
    const current=row.current,full=current.e-current.s+1,remain=remainingMonths(a,st,full),delta=now+remain-1-current.e;
    const blocks=row.blocks.map((b,i)=>i<current.index?b:{...b,s:i===current.index?now:b.s+delta,e:b.e+delta});
    const updated={...current,...blocks[current.index],shortText:summaries.find(it=>it.key===answerKey(k))?.text||current.shortText};
    const remaining=blocks.slice(current.index).map((b,i)=>({...b,remainingStart:i===0?now:b.s,sourceCurrent:i===0}));
    return {...row,current:updated,blocks,remaining,next:blocks[current.index+1]||null};
   }
   return row;
  }
  const exhausted=k==='thinking1'?a.thinking==='advanced'&&+a.compExact===P.COMP.length-1&&a.thinkingStatus==='done':k==='calc'?a.calc==='advanced'&&+a.calcExact===P.CALC.length-1&&a.calcStatus==='done':middleBook(a.schoolBook)&&+a.schoolExact===19&&a.schoolStatus==='done';
  const resolved=fromEngine(k);if(k==='school'&&highBook(a.schoolBook)){resolved.blocks=[];resolved.remaining=[];resolved.next=null;}if(exhausted){resolved.blocks=[];resolved.remaining=[];resolved.next=null;}return resolved;
 });
 if(Object.hasOwn(a,'deepBook'))rows.splice(2,0,fromEngine('deep'));
 return {...original,nowLabel:labelMonth(now),rows,comparison:Object.values(fields.pendingStatus||{}).some(Boolean)?{ready:false,levels:[],best:null}:original.comparison};
}
// Explicitly chosen depth is independent of the curriculum's relative depth preset.
function narrative(plan){
 const years=P.narrative(plan);if(!plan.independentDeep)return years;
 const deep=plan.rows.find(r=>r.key==='school2')?.blocks||[];
 return years.map(y=>{
  const lo=Math.max(plan.now,y.months[0].m),hi=y.months.at(-1).m,bs=deep.filter(b=>b[2]>=lo&&b[1]<=hi);
  const items=y.items.filter(it=>it.label!=='심화');
  if(bs.length)items.push({label:'심화',text:bs.map(b=>`${P.label(Math.max(lo,b[1]))}부터 ${D.shortText(b[0])} 과정을 이어가요.`).join(' ')});
  const months=y.months.map(m=>({...m,starts:[...m.starts,...bs.filter(b=>b[1]===m.m).map(b=>D.shortText(b[0]))]}));
  return {...y,months,items};
 });
}
function milestones(a,fields,p){a=effective(a);
 const current=summary(a,fields).slice(1).map(x=>x.text).join(' · '),main=[{m:p.now,kind:'now',title:'현재 · '+p.nowLabel,sub:current,icon:''}];
 const labels={school:'교과',thinking1:'사고력',deep:'심화',calc:'연산'};
 const future=p.rows.map(row=>row.next?{m:row.next.s,kind:'step',title:labels[row.key]+' · '+row.next.shortText,sub:'다음에 이어갈 학습이에요.',icon:''}:{m:Math.max(p.now+1,row.current.e+1),kind:'step',title:labels[row.key]+' · 다음 단계 확인',sub:'학습을 확인하며 다음 과정을 정해요.',icon:''});
 main.push(...future.sort((a,b)=>a.m-b.m));
 const forks=[];const y=age(a,fields);
 if(y>=6&&y<=9&&['A','B'].includes(fields.band))forks.push({id:'hw',title:'생각하는 황소',m:p.now+1,selected:a.hw==='1',pending:!['0','1'].includes(a.hw),yes:'과정 정보 함께 확인',no:'현재 학습 이어가기',reason:a.hw==='1'?'관심 과정의 안내를 함께 살펴봐요.':'지금 학습을 이어가며 나중에 바꿔도 괜찮아요.'});
 forks.push({id:'gift',title:'영재원',m:p.now+2,selected:a.gifted==='1',pending:!['0','1'].includes(a.gifted),yes:'선발 안내 함께 확인',no:'현재 학습 이어가기',reason:a.gifted==='1'?'선발 시기와 자격은 해당 연도 공고에서 확인해요.':'지금 학습을 이어가며 나중에 바꿔도 괜찮아요.'});
 return {main,branch:[],forks};
}
global.PlannerIntake=Object.freeze({seniorIntake,thinkingRequired,additionalDeep,progressKey,progressCourse,progressValue,remainingMonths,progressText,highSubjects,highBook,bookList,thinking,calc,schoolBooks,deepBooks,special,effective,middleBook,noThinking,age,gradeChoice,audience,learningLabels,studentLabel,labelMonth,gradeForAge,order,standardBook,questions,hasAnswer,firstMissing,sourceInput,options,deepRow,buildPlan,profile,narrative,sourceMode,fieldChanges,summary,milestones});
})(window);
